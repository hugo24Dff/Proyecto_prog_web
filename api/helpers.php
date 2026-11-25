
<?php

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);

    header('Content-Type: application/json; charset=utf-8');

    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

function leerJson(): array
{
    $entrada = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!is_array($entrada)) {
        responder([
            'error' => 'JSON inválido'
        ], 400);
    }

    return $entrada;
}

function validarId(): int
{
    $id = filter_var(
        $_GET['id'] ?? null,
        FILTER_VALIDATE_INT,
        [
            'options' => [
                'min_range' => 1,
                'max_range' => 2147483647
            ]
        ]
    );

    if ($id === false) {
        responder([
            'error' => 'ID inválido o no proporcionado'
        ], 422);
    }

    return $id;
}

function validarVideojuego(array $datos): array
{
    $campos = [
        'titulo' => 150,
        'genero' => 80,
        'descripcion' => 10000,
        'imagen' => 500
    ];

    foreach ($campos as $campo => $limite) {

        $valor = $datos[$campo] ?? null;

        if (
            !is_string($valor) ||
            trim($valor) === '' ||
            strlen($valor) > $limite
        ) {
            responder([
                'error' => "Campo inválido: $campo"
            ], 422);
        }
    }

    $precio = $datos['precio'] ?? null;

    if (
        (!is_int($precio) && !is_float($precio)) ||
        !is_finite((float) $precio) ||
        $precio < 0 ||
        $precio > 99999999.99
    ) {
        responder([
            'error' => 'El precio es inválido'
        ], 422);
    }

    return [
        'titulo' => trim($datos['titulo']),
        'genero' => trim($datos['genero']),
        'precio' => round((float) $precio, 2),
        'descripcion' => trim($datos['descripcion']),
        'imagen' => trim($datos['imagen'])
    ];
}

function formatearVideojuego(array $juego): array
{
    $juego['id'] = (int) $juego['id'];
    $juego['precio'] = (float) $juego['precio'];

    return $juego;
}