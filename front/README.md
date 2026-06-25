# MiniInventario — Frontend

HTML + CSS + JS sin build. Tres archivos: `index.html`, `styles.css`, `app.js`.
Conecta directo a tu API de Spring Boot (Productos, Categorías, Archivos).

## Cómo correrlo en local

El backend ya tiene CORS configurado para aceptar peticiones desde
`http://localhost:5500` (puerto típico de la extensión "Live Server" de VS Code).
Si abres el `index.html` directo con doble clic (protocolo `file://`), el
navegador no va a poder hablarle a la API por CORS — sírvelo con un servidor
local sencillo:

**Opción A — VS Code:**
Instala la extensión "Live Server", clic derecho sobre `index.html` →
"Open with Live Server".

**Opción B — Python (ya viene instalado en Mac):**
```bash
cd frontend
python3 -m http.server 5500
```
Abre `http://localhost:5500` en el navegador.

Con el backend corriendo en `http://localhost:8085` (el puerto por defecto
del proyecto), el frontend debería conectar solo. Si usas otro puerto o
otra URL, haz clic en el indicador de conexión (arriba a la derecha) y
cámbiala ahí — se guarda en el navegador.

## Cuando despliegues a producción

1. **Backend en Render**: agrega la variable de entorno
   `CORS_ALLOWED_ORIGINS` con la URL real de tu sitio en Netlify, ej:
   `https://tu-sitio.netlify.app`
2. **Frontend en Netlify**: arrastra esta carpeta al dashboard de Netlify
   (Sites → "Add new site" → "Deploy manually"), o conéctalo a tu repo.
3. Abre el sitio publicado y cambia la URL de la API (mismo indicador de
   conexión) a la URL de tu backend en Render.

## Limitación conocida del backend (Archivos)

El endpoint `subirArchivo` guarda el archivo pero su respuesta solo regresa
un mensaje de texto, no el folio (`idArchvo`) del archivo creado. Tampoco
existe un endpoint que liste los archivos guardados. Por eso esta sección
del frontend solo permite:
- Subir un archivo (confirmación de éxito, sin folio)
- Descargar un archivo si ya conoces su folio manualmente

Para que esta sección sea realmente usable, conviene agregar al backend:
- Que `RespuestaDTO` también regrese `idArchvo`
- Un endpoint `GET /apiArchivos/archivo` que liste folio + nombre + tipo
