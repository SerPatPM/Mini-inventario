package com.ipn.mx.miniinventario.features.Archivo.service.impl;

import com.ipn.mx.miniinventario.core.entidades.Archivo;
import com.ipn.mx.miniinventario.features.Archivo.repository.ArchivoRepository;
import com.ipn.mx.miniinventario.features.Archivo.service.ArchivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Optional;
@Service
public class ArchivoServiceImpl implements ArchivoService {
    @Autowired
    private ArchivoRepository repository;
    @Override
    public Archivo guardarArchivoEnBaseDeDatos(MultipartFile archivo) throws IOException {
        String nombreArchivo = StringUtils.cleanPath(
                archivo.getOriginalFilename()
        );
        Archivo archivo1 = Archivo.builder()
                .nombreArchivo(nombreArchivo)
                .tipoArchivo(archivo.getContentType())
                .datosArchivo(archivo.getBytes())
                .build();
        return repository.save(archivo1);
    }

    @Override
    public Optional<Archivo> descargarArchivo(Long id) throws FileNotFoundException {
        Optional<Archivo> archivo = repository.findById(id);
        if (archivo.isPresent()){
            return archivo;
        }
        throw new FileNotFoundException("EL ARCHIVO NO EXISTE");
    }
}
