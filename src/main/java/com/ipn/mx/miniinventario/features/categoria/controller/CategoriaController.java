package com.ipn.mx.miniinventario.features.categoria.controller;

import com.ipn.mx.miniinventario.core.entidades.Categoria;
import com.ipn.mx.miniinventario.features.categoria.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")

public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/categoria")
    @ResponseStatus(HttpStatus.OK)
    public List<Categoria> findAll() {
        return categoriaService.findAll();
    }

    @GetMapping("/categoria/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria findbyId(@PathVariable Long id){
        return categoriaService.findById(id);
    }

    @PostMapping("/categoria")
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria create (@RequestBody Categoria categoria){
        return categoriaService.save(categoria);
    }

    //Put es para actualizaciones completas, patch es para pariales
    //ESTE ES UN UPDATE TOTALLLLLL
    @PutMapping("/categoria/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria create (@RequestBody Categoria categoria,
                             @PathVariable Long id) {
        Categoria c = categoriaService.findById(id);
        categoria.setIdCategoria(id);
        c.setNombreCategoria(categoria.getNombreCategoria());
        c.setDescripcionCategoria(categoria.getDescripcionCategoria());
        c.setCreateAt(categoria.getCreateAt());
        return categoriaService.save(categoria);
    }

    @DeleteMapping("/categoria/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categoriaService.deleteById(id);
    }
}