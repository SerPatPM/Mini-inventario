package com.ipn.mx.miniinventario.features.mail.service;

public interface EmailService {
    public void enviarCorreoElectronico(
            String to,
            String subject,
            String text);
}
