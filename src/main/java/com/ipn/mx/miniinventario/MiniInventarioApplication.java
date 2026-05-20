package com.ipn.mx.miniinventario;

import com.ipn.mx.miniinventario.core.entidades.Categoria;
import com.ipn.mx.miniinventario.features.categoria.repository.CategoriaDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MiniInventarioApplication implements CommandLineRunner {
    //@Autowired
    //private CategoriaDAO dao;

    public static void main(String[] args) {
        SpringApplication.run(MiniInventarioApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
//        IO.println("Categoria");
//        Categoria categoria = new Categoria();
        //categoria.setIdCategoria(2L);
        //categoria.setNombreCategoria("Electronica");
        //categoria.setDescripcionCategoria("Articulos de electronica");

        //dao.save(categoria);
        //dao.deleteById(categoria.getIdCategoria());
        //IO.println(dao.findById(3L));
        IO.println("Estoy Trabajando...");
    }
}
