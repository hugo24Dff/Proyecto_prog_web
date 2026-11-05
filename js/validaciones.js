
export function validarNombre(nombre) {
    if (!nombre.trim()) {
        return "El nombre de usuario es obligatorio.";
    }

    return "";
}

export function validarCorreo(correo) {
    if (!correo.trim()) {
        return "El correo electrónico es obligatorio.";
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(correo)) {
        return "Ingresa un correo electrónico válido.";
    }

    return "";
}

export function validarTelefono(telefono) {
    if (!telefono.trim()) {
        return "";
    }

    if (!/^\d{10}$/.test(telefono)) {
        return "El teléfono debe contener exactamente 10 dígitos.";
    }

    return "";
}

export function validarEdad(edad) {
    if (!edad.trim()) {
        return "";
    }

    const numero = Number(edad);

    if (!Number.isFinite(numero) ||
        numero < 18 ||
        numero > 99 ||
        (numero - 18) % 2 !== 0) {
        return "La edad debe estar entre 18 y 99, en intervalos de 2.";
    }

    return "";
}

export function validarContrasena(contrasena) {
    if (!contrasena.trim()) {
        return "La contraseña es obligatoria.";
    }

    return "";
}

export function validarTerminos(aceptados) {
    if (!aceptados) {
        return "Debes aceptar los términos y condiciones.";
    }

    return "";
}
