package com.ipn.mx.miniinventario.features.producto.service.impl;

import com.ipn.mx.miniinventario.core.entidades.Producto;
import com.ipn.mx.miniinventario.features.producto.repository.ProductoDAO;
import com.ipn.mx.miniinventario.features.producto.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {
    @Autowired
    ProductoDAO productoRepository;

    /**
     * @return
     */
    @Transactional(readOnly = true)
    @Override
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    /**
     * @param id
     * @return
     */
    @Transactional(readOnly = true)
    @Override
    public Producto findById(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    /**
     * @param producto
     * @return
     */
    @Override
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    /**
     * @param id
     */
    @Override
    public void deleteById(Long id) {
        productoRepository.deleteById(id);
    }
}
