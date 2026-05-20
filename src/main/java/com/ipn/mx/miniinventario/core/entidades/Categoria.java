package com.ipn.mx.miniinventario.core.entidades;

import com.fasterxml.jackson.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "Categoria")
public class Categoria implements Serializable {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column ( nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long idCategoria;

    @Column ( nullable = false, length = 50)
    private String nombreCategoria;

    @Column (nullable = false, length = 100)
    private String descripcionCategoria;

    @Column (name = "create_at", nullable = true) //Solo se usa name si el atributo se llama diferente a la tabla
    private LocalDate createAt;

    //@JsonManagedReference
    //@JsonIgnoreProperties("productos")
    @JsonIgnore
    @OneToMany(mappedBy = "idCategoria", cascade = CascadeType.ALL)
    private Set<Producto> productos = new HashSet<>();
    //Elejir como mandar las listas en este caso Hash




    public Categoria(Long idCategoria){
        this.idCategoria = idCategoria;
    }
}
