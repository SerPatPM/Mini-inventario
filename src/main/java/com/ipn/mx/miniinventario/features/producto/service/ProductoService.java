package com.ipn.mx.miniinventario.features.producto.service;

import com.ipn.mx.miniinventario.core.entidades.Producto;

import java.util.List;

public interface ProductoService {
    public List<Producto> findAll();
    public Producto findById(Long id);
    public Producto save(Producto producto);
    public void deleteById(Long id);
}
