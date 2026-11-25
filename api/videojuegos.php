<?php

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db.php';

$metodo = $_SERVER['REQUEST_METHOD'];

try {

    $pdo = conectar();

    switch ($metodo) {

        // ==================================
        // READ - CONSULTAR VIDEOJUEGOS
        // ==================================

        case 'GET':

            // Consultar un videojuego por ID
            if (isset($_GET['id'])) {

                $id = validarId();

                $stmt = $pdo->prepare(
                    'SELECT * FROM videojuegos
                     WHERE id = :id'
                );

                $stmt->execute([
                    'id' => $id
                ]);

                $juego = $stmt->fetch();

                if (!$juego) {
                    responder([
                        'error' => 'Videojuego no encontrado'
                    ], 404);
                }

                responder(formatearVideojuego($juego));
            }

            // Buscar videojuegos por título
            $buscar = $_GET['buscar'] ?? '';

            if (!is_string($buscar)) {
                responder([
                    'error' => 'Búsqueda inválida'
                ], 422);
            }

            $buscar = trim($buscar);

            if ($buscar !== '') {

                $stmt = $pdo->prepare(
                    'SELECT * FROM videojuegos
                     WHERE titulo LIKE :buscar
                     ORDER BY id'
                );

                $stmt->execute([
                    'buscar' => "%$buscar%"
                ]);

            } else {

                // Consultar todos los videojuegos
                $stmt = $pdo->prepare(
                    'SELECT * FROM videojuegos ORDER BY id'
                );

                $stmt->execute();
            }

            $videojuegos = $stmt->fetchAll();

            responder(
                array_map(
                    'formatearVideojuego',
                    $videojuegos
                )
            );

            break;
            

        // ==================================
        // CREATE - REGISTRAR VIDEOJUEGO
        // ==================================

        case 'POST':

            $datos = validarVideojuego(leerJson());

            $stmt = $pdo->prepare(
                'INSERT INTO videojuegos
                    (titulo, genero, precio,
                     descripcion, imagen)
                 VALUES
                    (:titulo, :genero, :precio,
                     :descripcion, :imagen)'
            );

            $stmt->execute($datos);

            $id = (int) $pdo->lastInsertId();

            responder([
                'id' => $id,
                ...$datos
            ], 201);

            break;


        // ==================================
        // UPDATE - ACTUALIZAR VIDEOJUEGO
        // ==================================

        case 'PUT':

            $id = validarId();

            $datos = validarVideojuego(leerJson());

            // Verificar que el videojuego exista
            $existe = $pdo->prepare(
                'SELECT id FROM videojuegos
                 WHERE id = :id'
            );

            $existe->execute([
                'id' => $id
            ]);

            if (!$existe->fetch()) {

                responder([
                    'error' => 'Videojuego no encontrado'
                ], 404);
            }

            // Actualizar videojuego
            $stmt = $pdo->prepare(
                'UPDATE videojuegos
                 SET titulo = :titulo,
                     genero = :genero,
                     precio = :precio,
                     descripcion = :descripcion,
                     imagen = :imagen
                 WHERE id = :id'
            );

            $stmt->execute([
                ...$datos,
                'id' => $id
            ]);

            responder([
                'id' => $id,
                ...$datos
            ], 200);

            break;


        // ==================================
        // DELETE - ELIMINAR VIDEOJUEGO
        // ==================================

        case 'DELETE':

            $id = validarId();

            try {

                $stmt = $pdo->prepare(
                    'DELETE FROM videojuegos
                     WHERE id = :id'
                );

                $stmt->execute([
                    'id' => $id
                ]);

            } catch (PDOException $e) {

                if ($e->getCode() === '23000') {

                    responder([
                        'error' => 'El videojuego está relacionado con otros registros'
                    ], 409);
                }

                throw $e;
            }

            if ($stmt->rowCount() === 0) {

                responder([
                    'error' => 'Videojuego no encontrado'
                ], 404);
            }

            http_response_code(204);
            exit;


        // ==================================
        // MÉTODO NO PERMITIDO
        // ==================================

        default:

            header('Allow: GET, POST, PUT, DELETE');

            responder([
                'error' => 'Método no permitido'
            ], 405);
    }

} catch (Throwable $e) {

    error_log($e->getMessage());

    responder([
        'error' => 'Error interno del servidor'
    ], 500);
}
