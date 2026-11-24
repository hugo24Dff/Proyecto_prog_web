
<?php

require __DIR__ . '/helpers.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if (!in_array($metodo, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');

    responder([
        "error" => "Método no permitido."
    ], 405);
}

// Cargar los videojuegos iniciales
$iniciales = require __DIR__ . '/data/videojuegos.php';

// Ruta del archivo de almacenamiento
$archivo = __DIR__ . '/data/nuevos.json';

// Abrir el archivo para lectura y escritura
$fp = @fopen($archivo, 'c+');

if (!$fp) {
    responder([
        "error" => "No se pudo abrir el archivo de datos."
    ], 500);
}

// Bloquear el archivo mientras se utiliza
if (!flock($fp, $metodo === 'POST' ? LOCK_EX : LOCK_SH)) {
    responder([
        "error" => "No se pudo acceder a los datos."
    ], 500);
}

$contenido = stream_get_contents($fp);

$nuevos = $contenido === ''
    ? []
    : json_decode($contenido, true);

if (!is_array($nuevos)) {
    responder([
        "error" => "El archivo de datos es inválido."
    ], 500);
}

// Combinar videojuegos iniciales y nuevos
$videojuegos = array_merge($iniciales, $nuevos);


// ======================================
// GET: CONSULTAR VIDEOJUEGOS
// ======================================

if ($metodo === 'GET') {

    if (isset($_GET['id'])) {

        $id = filter_var(
            $_GET['id'],
            FILTER_VALIDATE_INT
        );

        foreach ($videojuegos as $juego) {

            if ($juego['id'] === $id) {
                responder($juego, 200);
            }
        }

        responder([
            "error" => "Videojuego no encontrado."
        ], 404);
    }

    responder($videojuegos, 200);
}


// ======================================
// POST: REGISTRAR VIDEOJUEGO
// ======================================

if ($metodo === 'POST') {

    $datos = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!is_array($datos)) {
        responder([
            "error" => "Debes enviar un JSON válido."
        ], 422);
    }

    // Obtener y validar los campos de texto
    $campos = [
        'titulo',
        'genero',
        'descripcion',
        'imagen'
    ];

    foreach ($campos as $campo) {

        if (!isset($datos[$campo]) ||
            !is_string($datos[$campo]) ||
            trim($datos[$campo]) === '') {

            responder([
                "error" => "El campo $campo es obligatorio."
            ], 422);
        }

        $datos[$campo] = trim($datos[$campo]);
    }

    $titulo = $datos['titulo'];
    $genero = $datos['genero'];
    $precio = $datos['precio'] ?? null;
    $descripcion = $datos['descripcion'];
    $imagen = $datos['imagen'];

    // Validar longitud del título
    if (strlen($titulo) < 3) {
        responder([
            "error" => "El título debe tener al menos 3 caracteres."
        ], 422);
    }

    // Validar precio
    if (!is_numeric($precio) ||
        !is_finite((float) $precio) ||
        $precio <= 0) {

        responder([
            "error" => "El precio debe ser un número mayor a cero."
        ], 422);
    }

    // Validar descripción
    if (strlen($descripcion) < 10) {
        responder([
            "error" => "La descripción debe tener al menos 10 caracteres."
        ], 422);
    }

    // Validar ruta local de imagen o URL HTTPS
    $rutaLocal = preg_match(
        '~^assets/img/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif)$~i',
        $imagen
    );

    $urlValida = filter_var(
        $imagen,
        FILTER_VALIDATE_URL
    ) && parse_url($imagen, PHP_URL_SCHEME) === 'https';

    if (!$rutaLocal && !$urlValida) {
        responder([
            "error" => "Ingresa una ruta de imagen válida o una URL HTTPS."
        ], 422);
    }

    // Generar ID automáticamente
    $ultimoId = max(array_column($videojuegos, 'id'));

    $nuevo = [
        "id" => $ultimoId + 1,
        "titulo" => $titulo,
        "genero" => $genero,
        "precio" => (float) $precio,
        "descripcion" => $descripcion,
        "imagen" => $imagen
    ];

    // Agregar al arreglo de nuevos registros
    $nuevos[] = $nuevo;

    $json = json_encode(
        $nuevos,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
    );

    if ($json === false) {
        responder([
            "error" => "No se pudieron convertir los datos a JSON."
        ], 500);
    }

    // Guardar los nuevos registros
    rewind($fp);

    if (!ftruncate($fp, 0) ||
        fwrite($fp, $json) !== strlen($json) ||
        !fflush($fp)) {

        responder([
            "error" => "No se pudo guardar el videojuego."
        ], 500);
    }

    flock($fp, LOCK_UN);
    fclose($fp);

    responder($nuevo, 201);
}
