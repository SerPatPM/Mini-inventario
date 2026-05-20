package com.ipn.mx.miniinventario.core.entidades;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@JsonPropertyOrder({"idProducto","nombreProducto","descripcionProducto","precioProducto", "existencia", "createAt", "idCategoria"})
@Table(name = "Producto")
public class Producto implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column ( nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long idProducto;

    @Column(nullable = false, length = 50)
    private String nombreProducto;

    @Column(nullable = false, length = 150)
    private String descripcionProducto;

    @Column(nullable = false, precision = 5, scale = 2)//INVESTIGAR ESTO PARA FLOAT
    private BigDecimal precioProducto;

    @Column(nullable = false)
    @Min(0)
    private int existencia;

//    @Temporal(TemporalType.DATE) ya no se usa por el LocalDate, ya estas estbleciendo Date
    @CreationTimestamp
    @Column(nullable = false, name = "create_at", updatable = false)
    private LocalDate createAt;

    //EAGER CADA QUE SE USE UN ARGUMENTO SE VAN A TRAER TODOS CON EL
    //1 CATEGORIA Y SE TRAE TODOS SUS PRODUCTOS
    //LAZY DICE AY PUES VE TU POR TU PRODUCTO YO TRAJE LA CATEGORIA
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCategoria", nullable = false)
    private Categoria idCategoria;

    //EL NOMBRE idCategoria debe tener el MISMO NOMBRE
    //que el mappedBy de la Categoria
}
