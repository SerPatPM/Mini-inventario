package com.ipn.mx.miniinventario.features.categoria.DTOs;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaCreateDTO {
    private String nombreCategoria;
    private String descripcionCategoria;
}
