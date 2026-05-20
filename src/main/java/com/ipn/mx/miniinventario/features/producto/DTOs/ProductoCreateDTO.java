package com.ipn.mx.miniinventario.features.producto.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoCreateDTO {
    private String nombreProducto;
    private String descripcionProducto;
    private BigDecimal precioProducto;
    private int existencia;
    private LocalDate createAt;
    private CategoriaIdDTO idCategoria;
}
