package com.ipn.mx.miniinventario.features.Archivo.service;

import com.ipn.mx.miniinventario.core.entidades.Archivo;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Optional;

public interface ArchivoService {
    //Almacernar Archivos en la base de datos
    Archivo guardarArchivoEnBaseDeDatos(MultipartFile archivo)
        throws IOException;

    //Pintar el archivo que lo busque
    Optional<Archivo> descargarArchivo(Long id) throws FileNotFoundException;


}
