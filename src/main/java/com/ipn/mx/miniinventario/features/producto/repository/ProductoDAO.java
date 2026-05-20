package com.ipn.mx.miniinventario.features.producto.repository;

import com.ipn.mx.miniinventario.core.entidades.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoDAO extends JpaRepository<Producto, Long> {
}
