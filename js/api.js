const URL_VIDEOJUEGOS = "/api/videojuegos.php";

async function realizarPeticion(url, opciones = {}) {

    const respuesta = await fetch(url, opciones);

    if (respuesta.status === 204) {
        return null;
    }

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.error ?? "Error en la solicitud"
        );
    }

    return datos;
}

// READ - Obtener todos
export async function obtenerVideojuegos() {

    return realizarPeticion(URL_VIDEOJUEGOS);
}

// READ - Obtener uno
export async function obtenerVideojuego(id) {

    return realizarPeticion(
        `${URL_VIDEOJUEGOS}?id=${encodeURIComponent(id)}`
    );
}

// READ - Buscar
export async function buscarVideojuegos(buscar) {

    return realizarPeticion(
        `${URL_VIDEOJUEGOS}?buscar=${encodeURIComponent(buscar)}`
    );
}

// CREATE
export async function crearVideojuego(videojuego) {

    return realizarPeticion(URL_VIDEOJUEGOS, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(videojuego)
    });
}

// UPDATE
export async function actualizarVideojuego(id, videojuego) {

    return realizarPeticion(
        `${URL_VIDEOJUEGOS}?id=${encodeURIComponent(id)}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(videojuego)
        }
    );
}

// DELETE
export async function eliminarVideojuego(id) {

    return realizarPeticion(
        `${URL_VIDEOJUEGOS}?id=${encodeURIComponent(id)}`,
        {
            method: "DELETE"
        }
    );
}
