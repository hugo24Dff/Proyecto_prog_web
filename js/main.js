
import {
    validarNombre,
    validarCorreo,
    validarTelefono,
    validarEdad,
    validarContrasena,
    validarTerminos
} from "./validaciones.js";

import {
    mostrarError,
    limpiarErrores,
    limpiarMensajeExito,
    mostrarMensajeExito
} from "./mensajes.js";

const formulario = document.getElementById("form-registro");

formulario.addEventListener("submit", function (evento) {
  
    evento.preventDefault();

    limpiarErrores();
    limpiarMensajeExito();

    const datos = new FormData(formulario);

    const nombre = datos.get("user_name") ?? "";
    const correo = datos.get("user_email") ?? "";
    const telefono = datos.get("phone") ?? "";
    const edad = datos.get("age") ?? "";
    const contrasena = datos.get("contrasena") ?? "";
    const terminos = datos.get("terminos") === "aceptado";

    const errores = [
        {
            id: "error-user",
            mensaje: validarNombre(nombre)
        },
        {
            id: "error-email",
            mensaje: validarCorreo(correo)
        },
        {
            id: "error-phone",
            mensaje: validarTelefono(telefono)
        },
        {
            id: "error-age",
            mensaje: validarEdad(edad)
        },
        {
            id: "error-password",
            mensaje: validarContrasena(contrasena)
        },
        {
            id: "error-terminos",
            mensaje: validarTerminos(terminos)
        }
    ];

    errores.forEach((error) => {
        mostrarError(error.id, error.mensaje);
    });

    const primerError = errores.find(
        (error) => error.mensaje !== ""
    );

    if (primerError) {
        const campos = {
            "error-user": "inp-user",
            "error-email": "inp-email",
            "error-phone": "inp-phone",
            "error-age": "inp-age",
            "error-password": "password",
            "error-terminos": "chk-terminos"
        };

        document.getElementById(campos[primerError.id]).focus();
        return;
    }

    mostrarMensajeExito("Formulario validado correctamente.");

    console.log("Datos del formulario:");

    for (const [campo, valor] of datos.entries()) {
        console.log(`${campo}: ${valor}`);
    }
});
