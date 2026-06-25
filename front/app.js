// =====================================================
// MiniInventario — lógica de frontend
// =====================================================

const STORAGE_KEY = 'miniinventario_api_base';
let API_BASE = localStorage.getItem(STORAGE_KEY) || 'http://localhost:8085';

let categoriasCache = [];

const TAG_PALETTE = [
  { bg: '#DCE6D6', fg: '#33502E' },
  { bg: '#EAD9C9', fg: '#7A4420' },
  { bg: '#D9E1E8', fg: '#34495C' },
  { bg: '#E6E2C9', fg: '#5C5320' },
  { bg: '#E6D9E2', fg: '#5C3454' },
  { bg: '#F0E2BD', fg: '#7A5A12' },
];

function tagColorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

// ---------- utilidades de red ----------

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch (_) {}
    throw new Error(`${res.status} ${res.statusText}${detail ? ' — ' + detail.slice(0, 160) : ''}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function formatFecha(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatPrecio(valor) {
  const n = Number(valor);
  return `$ ${n.toFixed(2)}`;
}

// ---------- toasts ----------

function toast(message, type = 'ok') {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = `toast${type === 'error' ? ' toast-error' : ''}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

// ---------- estado de conexión ----------

const connDot = document.getElementById('connDot');
const connLabel = document.getElementById('connLabel');
const connPill = document.getElementById('connPill');
const connPopover = document.getElementById('connPopover');
const apiBaseInput = document.getElementById('apiBaseInput');

async function checkConnection() {
  connDot.className = 'conn-dot';
  connLabel.textContent = 'Verificando conexión';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE}/api/v1/categorias/categoria`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('no ok');
    connDot.classList.add('ok');
    connLabel.textContent = 'Conectado';
  } catch (_) {
    connDot.classList.add('fail');
    connLabel.textContent = 'Sin conexión';
  }
}

connPill.addEventListener('click', () => {
  const isHidden = connPopover.hasAttribute('hidden');
  if (isHidden) {
    apiBaseInput.value = API_BASE;
    connPopover.removeAttribute('hidden');
    connPill.setAttribute('aria-expanded', 'true');
  } else {
    connPopover.setAttribute('hidden', '');
    connPill.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('btnConnCancel').addEventListener('click', () => {
  connPopover.setAttribute('hidden', '');
});

document.getElementById('btnConnSave').addEventListener('click', () => {
  const value = apiBaseInput.value.trim().replace(/\/+$/, '');
  if (!value) return;
  API_BASE = value;
  localStorage.setItem(STORAGE_KEY, API_BASE);
  connPopover.setAttribute('hidden', '');
  checkConnection();
  cargarCategorias();
  cargarProductos();
  toast('URL de la API actualizada');
});

document.addEventListener('click', (e) => {
  if (!connPopover.contains(e.target) && e.target !== connPill && !connPill.contains(e.target)) {
    connPopover.setAttribute('hidden', '');
  }
});

// ---------- navegación entre secciones ----------

document.querySelectorAll('.tag-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tag-tab').forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const target = tab.dataset.section;
    document.querySelectorAll('.panel-section').forEach((s) => s.classList.remove('active'));
    document.getElementById(`section-${target}`).classList.add('active');
  });
});

// ---------- panel lateral (formularios) ----------

const overlay = document.getElementById('overlay');
const tagPanel = document.getElementById('tagPanel');
const panelTitle = document.getElementById('panelTitle');
const panelForm = document.getElementById('panelForm');
let currentSubmitHandler = null;
panelForm.addEventListener('submit', (e) => {
  if (currentSubmitHandler) currentSubmitHandler(e);
});

function openPanel(title) {
  panelTitle.textContent = title;
  overlay.removeAttribute('hidden');
  tagPanel.classList.add('open');
  tagPanel.setAttribute('aria-hidden', 'false');
}

function closePanel() {
  tagPanel.classList.remove('open');
  tagPanel.setAttribute('aria-hidden', 'true');
  setTimeout(() => overlay.setAttribute('hidden', ''), 200);
  panelForm.innerHTML = '';
  currentSubmitHandler = null;
}

document.getElementById('panelClose').addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && tagPanel.classList.contains('open')) closePanel();
});

// ======================================================
// CATEGORÍAS
// ======================================================

const bodyCategorias = document.getElementById('bodyCategorias');
const bannerCategorias = document.getElementById('bannerCategorias');
const emptyCategorias = document.getElementById('emptyCategorias');
const loadingCategorias = document.getElementById('loadingCategorias');

function renderCategorias(lista) {
  categoriasCache = lista;
  bodyCategorias.innerHTML = '';
  emptyCategorias.hidden = lista.length !== 0;

  lista.forEach((cat) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-id">#${cat.idCategoria}</td>
      <td class="row-name">${escapeHtml(cat.nombreCategoria)}</td>
      <td>${escapeHtml(cat.descripcionCategoria)}</td>
      <td class="col-date">${formatFecha(cat.createAt)}</td>
      <td class="col-actions"></td>
    `;
    const actionsCell = tr.querySelector('.col-actions');
    const renderActions = () => {
      actionsCell.innerHTML = '';
      actionsCell.appendChild(buildRowActions(
        () => openCategoriaForm(cat),
        () => confirmarYEjecutar(actionsCell, renderActions, () => eliminarCategoria(cat.idCategoria))
      ));
    };
    renderActions();
    bodyCategorias.appendChild(tr);
  });
}

async function cargarCategorias() {
  loadingCategorias.hidden = false;
  bannerCategorias.hidden = true;
  try {
    const data = await apiFetch('/api/v1/categorias/categoria');
    renderCategorias(data || []);
    refrescarSelectCategorias();
  } catch (err) {
    bannerCategorias.textContent = `No se pudo cargar categorías: ${err.message}`;
    bannerCategorias.hidden = false;
  } finally {
    loadingCategorias.hidden = true;
  }
}

function openCategoriaForm(categoria = null) {
  const esEdicion = !!categoria;
  panelForm.innerHTML = `
    <div class="field">
      <label for="catNombre">Nombre</label>
      <input id="catNombre" maxlength="50" required value="${esEdicion ? escapeAttr(categoria.nombreCategoria) : ''}">
    </div>
    <div class="field">
      <label for="catDescripcion">Descripción</label>
      <textarea id="catDescripcion" maxlength="100" required>${esEdicion ? escapeHtml(categoria.descripcionCategoria) : ''}</textarea>
    </div>
    <div class="field">
      <label for="catFecha">Fecha de alta (opcional)</label>
      <input type="date" id="catFecha" value="${esEdicion && categoria.createAt ? categoria.createAt : ''}">
    </div>
    <div class="field-error" id="catError" hidden></div>
    <div class="panel-actions">
      <button type="button" class="btn-ghost" id="catCancelar">Cancelar</button>
      <button type="submit" class="btn-primary">${esEdicion ? 'Guardar cambios' : 'Crear categoría'}</button>
    </div>
  `;
  panelForm.querySelector('#catCancelar').addEventListener('click', closePanel);

  currentSubmitHandler = async (e) => {
    e.preventDefault();
    const nombreCategoria = panelForm.querySelector('#catNombre').value.trim();
    const descripcionCategoria = panelForm.querySelector('#catDescripcion').value.trim();
    const createAt = panelForm.querySelector('#catFecha').value || null;
    const errorEl = panelForm.querySelector('#catError');

    if (!nombreCategoria || !descripcionCategoria) {
      errorEl.textContent = 'Nombre y descripción son obligatorios.';
      errorEl.hidden = false;
      return;
    }

    const payload = { nombreCategoria, descripcionCategoria, createAt };

    try {
      if (esEdicion) {
        await apiFetch(`/api/v1/categorias/categoria/${categoria.idCategoria}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Categoría actualizada');
      } else {
        await apiFetch('/api/v1/categorias/categoria', { method: 'POST', body: JSON.stringify(payload) });
        toast('Categoría creada');
      }
      closePanel();
      cargarCategorias();
      cargarProductos();
    } catch (err) {
      errorEl.textContent = `No se pudo guardar: ${err.message}`;
      errorEl.hidden = false;
    }
  };

  openPanel(esEdicion ? 'Editar categoría' : 'Nueva categoría');
}

async function eliminarCategoria(id) {
  try {
    await apiFetch(`/api/v1/categorias/categoria/${id}`, { method: 'DELETE' });
    toast('Categoría eliminada');
    cargarCategorias();
    cargarProductos();
  } catch (err) {
    toast(`No se pudo eliminar: ${err.message}`, 'error');
  }
}

document.getElementById('btnNuevaCategoria').addEventListener('click', () => openCategoriaForm());

// ======================================================
// PRODUCTOS
// ======================================================

const bodyProductos = document.getElementById('bodyProductos');
const bannerProductos = document.getElementById('bannerProductos');
const emptyProductos = document.getElementById('emptyProductos');
const loadingProductos = document.getElementById('loadingProductos');

function renderProductos(lista) {
  bodyProductos.innerHTML = '';
  emptyProductos.hidden = lista.length !== 0;

  lista.forEach((p) => {
    const cat = p.idCategoria;
    const tr = document.createElement('tr');
    const tagHtml = cat
      ? (() => { const c = tagColorFor(cat.nombreCategoria); return `<span class="tag-chip" style="background:${c.bg};color:${c.fg}">${escapeHtml(cat.nombreCategoria)}</span>`; })()
      : '<span class="tag-chip" style="background:#eee;color:#888">sin categoría</span>';

    tr.innerHTML = `
      <td class="col-id">#${p.idProducto}</td>
      <td>
        <span class="row-name">${escapeHtml(p.nombreProducto)}</span>
        <span class="row-desc">${escapeHtml(p.descripcionProducto)}</span>
      </td>
      <td>${tagHtml}</td>
      <td class="col-num">${formatPrecio(p.precioProducto)}</td>
      <td class="col-num">${p.existencia}</td>
      <td class="col-date">${formatFecha(p.createAt)}</td>
      <td class="col-actions"></td>
    `;
    const actionsCell = tr.querySelector('.col-actions');
    const renderActions = () => {
      actionsCell.innerHTML = '';
      actionsCell.appendChild(buildRowActions(
        () => openProductoForm(p),
        () => confirmarYEjecutar(actionsCell, renderActions, () => eliminarProducto(p.idProducto))
      ));
    };
    renderActions();
    bodyProductos.appendChild(tr);
  });
}

async function cargarProductos() {
  loadingProductos.hidden = false;
  bannerProductos.hidden = true;
  try {
    const data = await apiFetch('/api/v1/productos/producto');
    renderProductos(data || []);
  } catch (err) {
    bannerProductos.textContent = `No se pudo cargar productos: ${err.message}`;
    bannerProductos.hidden = false;
  } finally {
    loadingProductos.hidden = true;
  }
}

function refrescarSelectCategorias() {
  const select = panelForm.querySelector('#prodCategoria');
  if (!select) return;
  const actual = select.value;
  select.innerHTML = categoriasCache
    .map((c) => `<option value="${c.idCategoria}">${escapeHtml(c.nombreCategoria)}</option>`)
    .join('');
  if (actual) select.value = actual;
}

function openProductoForm(producto = null) {
  if (categoriasCache.length === 0) {
    toast('Crea una categoría antes de agregar productos.', 'error');
    return;
  }
  const esEdicion = !!producto;
  const catActualId = esEdicion && producto.idCategoria ? producto.idCategoria.idCategoria : categoriasCache[0].idCategoria;

  panelForm.innerHTML = `
    <div class="field">
      <label for="prodNombre">Nombre</label>
      <input id="prodNombre" maxlength="50" required value="${esEdicion ? escapeAttr(producto.nombreProducto) : ''}">
    </div>
    <div class="field">
      <label for="prodDescripcion">Descripción</label>
      <textarea id="prodDescripcion" maxlength="150" required>${esEdicion ? escapeHtml(producto.descripcionProducto) : ''}</textarea>
    </div>
    <div class="field-row">
      <div class="field">
        <label for="prodPrecio">Precio (máx. 999.99)</label>
        <input type="number" id="prodPrecio" min="0" max="999.99" step="0.01" required value="${esEdicion ? producto.precioProducto : ''}">
      </div>
      <div class="field">
        <label for="prodExistencia">Existencia</label>
        <input type="number" id="prodExistencia" min="0" step="1" required value="${esEdicion ? producto.existencia : ''}">
      </div>
    </div>
    <div class="field">
      <label for="prodCategoria">Categoría</label>
      <select id="prodCategoria"></select>
    </div>
    <div class="field-error" id="prodError" hidden></div>
    <div class="panel-actions">
      <button type="button" class="btn-ghost" id="prodCancelar">Cancelar</button>
      <button type="submit" class="btn-primary">${esEdicion ? 'Guardar cambios' : 'Crear producto'}</button>
    </div>
  `;

  refrescarSelectCategorias();
  panelForm.querySelector('#prodCategoria').value = catActualId;
  panelForm.querySelector('#prodCancelar').addEventListener('click', closePanel);

  currentSubmitHandler = async (e) => {
    e.preventDefault();
    const errorEl = panelForm.querySelector('#prodError');
    const nombreProducto = panelForm.querySelector('#prodNombre').value.trim();
    const descripcionProducto = panelForm.querySelector('#prodDescripcion').value.trim();
    const precioProducto = parseFloat(panelForm.querySelector('#prodPrecio').value);
    const existencia = parseInt(panelForm.querySelector('#prodExistencia').value, 10);
    const idCategoriaSel = parseInt(panelForm.querySelector('#prodCategoria').value, 10);

    if (!nombreProducto || !descripcionProducto || isNaN(precioProducto) || isNaN(existencia)) {
      errorEl.textContent = 'Completa todos los campos obligatorios.';
      errorEl.hidden = false;
      return;
    }
    if (precioProducto > 999.99) {
      errorEl.textContent = 'El precio no puede superar 999.99 (límite de la base de datos).';
      errorEl.hidden = false;
      return;
    }

    const payload = {
      nombreProducto,
      descripcionProducto,
      precioProducto,
      existencia,
      idCategoria: { idCategoria: idCategoriaSel },
    };

    try {
      if (esEdicion) {
        await apiFetch(`/api/v1/productos/producto/${producto.idProducto}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast('Producto actualizado');
      } else {
        await apiFetch('/api/v1/productos/producto', { method: 'POST', body: JSON.stringify(payload) });
        toast('Producto creado');
      }
      closePanel();
      cargarProductos();
    } catch (err) {
      errorEl.textContent = `No se pudo guardar: ${err.message}`;
      errorEl.hidden = false;
    }
  };

  openPanel(esEdicion ? 'Editar producto' : 'Nuevo producto');
}

async function eliminarProducto(id) {
  try {
    await apiFetch(`/api/v1/productos/producto/${id}`, { method: 'DELETE' });
    toast('Producto eliminado');
    cargarProductos();
  } catch (err) {
    toast(`No se pudo eliminar: ${err.message}`, 'error');
  }
}

document.getElementById('btnNuevoProducto').addEventListener('click', () => openProductoForm());

// ---------- acciones de fila reutilizables ----------

function buildRowActions(onEdit, onDelete) {
  const wrap = document.createElement('div');
  wrap.className = 'row-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.type = 'button';
  editBtn.setAttribute('aria-label', 'Editar');
  editBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  editBtn.addEventListener('click', onEdit);

  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn';
  delBtn.type = 'button';
  delBtn.setAttribute('aria-label', 'Eliminar');
  delBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  delBtn.addEventListener('click', onDelete);

  wrap.appendChild(editBtn);
  wrap.appendChild(delBtn);
  return wrap;
}

function confirmarYEjecutar(actionsCell, restoreFn, onConfirm) {
  actionsCell.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'confirm-inline';
  wrap.innerHTML = '<span>¿Eliminar?</span>';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'btn-ghost';
  yesBtn.type = 'button';
  yesBtn.textContent = 'Sí';
  yesBtn.style.padding = '4px 10px';
  yesBtn.addEventListener('click', onConfirm);

  const noBtn = document.createElement('button');
  noBtn.className = 'btn-ghost';
  noBtn.type = 'button';
  noBtn.textContent = 'No';
  noBtn.style.padding = '4px 10px';
  noBtn.addEventListener('click', restoreFn);

  wrap.appendChild(yesBtn);
  wrap.appendChild(noBtn);
  actionsCell.appendChild(wrap);
}

// ======================================================
// ARCHIVOS
// ======================================================

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const dropzoneText = document.getElementById('dropzoneText');
const btnSubirArchivo = document.getElementById('btnSubirArchivo');
const archivoStatus = document.getElementById('archivoStatus');

let archivoSeleccionado = null;

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) seleccionarArchivo(fileInput.files[0]);
});

['dragover', 'dragleave', 'drop'].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    if (evt === 'dragover') dropzone.classList.add('dragover');
    if (evt === 'dragleave') dropzone.classList.remove('dragover');
    if (evt === 'drop') {
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) seleccionarArchivo(e.dataTransfer.files[0]);
    }
  });
});

function seleccionarArchivo(file) {
  archivoSeleccionado = file;
  dropzoneText.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  btnSubirArchivo.disabled = false;
  archivoStatus.textContent = '';
}

btnSubirArchivo.addEventListener('click', async () => {
  if (!archivoSeleccionado) return;
  btnSubirArchivo.disabled = true;
  archivoStatus.textContent = 'Subiendo…';

  const formData = new FormData();
  formData.append('archivo', archivoSeleccionado);

  try {
    const res = await fetch(`${API_BASE}/apiArchivos/archivo/subirArchivo`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    archivoStatus.textContent = data.mensaje || 'Archivo guardado correctamente.';
    toast('Archivo subido');
    archivoSeleccionado = null;
    fileInput.value = '';
    dropzoneText.textContent = 'Arrastra un archivo o haz clic para elegirlo';
  } catch (err) {
    archivoStatus.textContent = `No se pudo subir: ${err.message}`;
    toast('Error al subir el archivo', 'error');
  } finally {
    btnSubirArchivo.disabled = !archivoSeleccionado ? true : false;
  }
});

const descargaIdInput = document.getElementById('descargaIdInput');
const btnDescargarArchivo = document.getElementById('btnDescargarArchivo');
const descargaStatus = document.getElementById('descargaStatus');

btnDescargarArchivo.addEventListener('click', async () => {
  const id = descargaIdInput.value.trim();
  if (!id) {
    descargaStatus.textContent = 'Escribe un folio válido.';
    return;
  }
  descargaStatus.textContent = 'Buscando archivo…';
  try {
    const res = await fetch(`${API_BASE}/apiArchivos/archivo/descargarArchivo/${id}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const disposition = res.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match ? match[1] : `archivo_${id}`;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    descargaStatus.textContent = `Descargado: ${filename}`;
  } catch (err) {
    descargaStatus.textContent = `No se encontró el archivo: ${err.message}`;
  }
});

// ---------- helpers de escape ----------

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

// ---------- arranque ----------

checkConnection();
cargarCategorias();
cargarProductos();
