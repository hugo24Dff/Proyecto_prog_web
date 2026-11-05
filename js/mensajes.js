
export function mostrarError(id, mensaje) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = mensaje;
    }
}

export function limpiarErrores() {
    const errores = document.querySelectorAll(".error");

    errores.forEach((elemento) => {
        elemento.textContent = "";
    });
}

export function limpiarMensajeExito() {
    document.getElementById("mensaje-exito").textContent = "";
}

export function mostrarMensajeExito(mensaje) {
    document.getElementById("mensaje-exito").textContent = mensaje;
}
