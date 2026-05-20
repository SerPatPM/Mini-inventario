package com.ipn.mx.miniinventario.features.Archivo.controller;

import com.ipn.mx.miniinventario.core.entidades.Archivo;
import com.ipn.mx.miniinventario.features.Archivo.DTOs.RespuestaDTO;
import com.ipn.mx.miniinventario.features.Archivo.service.ArchivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;

@RestController
@RequestMapping("/apiArchivos/archivo")
public class ArchivoController {
    @Autowired
    private ArchivoService service;

    @PostMapping("/subirArchivo")
    public ResponseEntity<RespuestaDTO> subirArchivo(@RequestParam MultipartFile archivo)
        throws IOException{
        service.guardarArchivoEnBaseDeDatos(archivo);
        RespuestaDTO respuestaDTO = new RespuestaDTO();
        respuestaDTO.setMensaje("Archivo Guardado Correctamente");
        return ResponseEntity.ok().body(respuestaDTO);
    }

    @GetMapping("/descargarArchivo/{id}")
    public ResponseEntity<byte[]> descargarArchivo(@PathVariable Long id)
        throws FileNotFoundException{
        Archivo file = service.descargarArchivo(id).get();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_TYPE,
        file.getTipoArchivo())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getNombreArchivo() + "\"").body(file.getDatosArchivo());
    }
}
