package com.ipn.mx.miniinventario.features.categoria.service.impl;

import com.ipn.mx.miniinventario.core.entidades.Categoria;
import com.ipn.mx.miniinventario.features.categoria.repository.CategoriaDAO;
import com.ipn.mx.miniinventario.features.categoria.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class CategoriaServiceImpl implements CategoriaService {
    @Autowired
    CategoriaDAO categoriaRepository;

    /**
     * @return
     */
    @Transactional (readOnly = true)
    @Override
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    /**
     * @param id
     * @return
     */
    @Transactional (readOnly = true)
    @Override
    public Categoria findById(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    /**
     * @param categoria
     * @return
     */
    @Transactional
    @Override
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Transactional
    @Override
    public void deleteById(Long id) {
        categoriaRepository.deleteById(id);
    }
}
