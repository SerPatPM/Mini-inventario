package com.ipn.mx.miniinventario.features.producto.controller;
import com.ipn.mx.miniinventario.core.entidades.Categoria;
import com.ipn.mx.miniinventario.core.entidades.Producto;
import com.ipn.mx.miniinventario.features.categoria.service.CategoriaService;
import com.ipn.mx.miniinventario.features.mail.service.EmailService;
import com.ipn.mx.miniinventario.features.producto.DTOs.ProductoCreateDTO;
import com.ipn.mx.miniinventario.features.producto.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    @Autowired
    private ProductoService productoService;
    @Autowired
    private CategoriaService categoriaService;
    @Autowired
    private EmailService emailService;

    @GetMapping("/producto")
    @ResponseStatus(HttpStatus.OK)
    public List<Producto> findAll(){
        emailService.enviarCorreoElectronico(
                "melanie.acbe@gmail.com", "Jajajja Ahuevo que pedo pinche mmd toca rara",
                "En mis tiempos esa wea era bn complicada puto Kike t voi a odiar hasta la muerte, viva zarate"
        );
        return productoService.findAll();
    }

    @GetMapping("/producto/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Producto findById(@PathVariable Long id){
        return productoService.findById(id);
    }

    @PostMapping("/producto")
    @ResponseStatus(HttpStatus.CREATED)
    public Producto create(@Valid @RequestBody ProductoCreateDTO dto){

        Producto producto = new Producto();
        producto.setNombreProducto(dto.getNombreProducto());
        producto.setDescripcionProducto(dto.getDescripcionProducto());
        producto.setPrecioProducto(dto.getPrecioProducto());
        producto.setExistencia(dto.getExistencia());
        producto.setCreateAt(dto.getCreateAt());
        Categoria categoria = categoriaService.findById(dto.getIdCategoria().getIdCategoria());
        producto.setIdCategoria(categoria);
        return productoService.save(producto);
    }

    @PutMapping("/producto/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Producto create(@Valid @RequestBody ProductoCreateDTO dto,
                           @PathVariable Long id){
        Producto p = productoService.findById(id);
        if (p != null){
            p.setIdProducto(id);
            p.setNombreProducto(dto.getNombreProducto());
            p.setDescripcionProducto(dto.getDescripcionProducto());
            p.setPrecioProducto(dto.getPrecioProducto());
            p.setCreateAt(dto.getCreateAt());
            Categoria categoria = categoriaService.findById(dto.getIdCategoria().getIdCategoria());
            p.setIdCategoria(categoria);
            return productoService.save(p);
        }
        else return null;
    }

    @DeleteMapping("/producto/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){
        productoService.deleteById(id);
    }
}
