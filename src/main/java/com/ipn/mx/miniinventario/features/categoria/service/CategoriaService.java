package com.ipn.mx.miniinventario.features.categoria.service;

import com.ipn.mx.miniinventario.core.entidades.Categoria;

import java.util.List;

public interface CategoriaService {
    public List<Categoria> findAll();
    public Categoria findById(Long id);
    public Categoria save(Categoria categoria);
    public void deleteById(Long id);
}
