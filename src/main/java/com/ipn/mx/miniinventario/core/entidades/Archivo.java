package com.ipn.mx.miniinventario.core.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Archivo")
public class Archivo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idArchvo;

    private String nombreArchivo;

    private String tipoArchivo;

    @Lob
    @Column(length = 16000000)
    private byte[] datosArchivo;
}
