
CREATE DATABASE IF NOT EXISTS tekhstore_db
CHARACTER SET utf8mb4;

USE tekhstore_db;

CREATE TABLE IF NOT EXISTS videojuegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    genero VARCHAR(80) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    descripcion TEXT NOT NULL,
    imagen VARCHAR(500) NOT NULL
);

INSERT INTO videojuegos
(id, titulo, genero, precio, descripcion, imagen)
VALUES
(
    1,
    'Rainbow Six Siege',
    'Acción',
    399.00,
    'Acción táctica y estrategia en equipos.',
    'assets/img/rainbow-six-siege.jpg'
),
(
    2,
    'The King of Fighters XV',
    'Peleas',
    799.00,
    'Combates clásicos con un elenco de luchadores.',
    'assets/img/kof-xv.webp'
),
(
    3,
    'Batman: Arkham Knight',
    'Aventura',
    299.00,
    'Explora Gotham en esta aventura de acción.',
    'assets/img/arkham-knight.png'
),
(
    4,
    'Star Wars Battlefront II',
    'Acción',
    499.00,
    'Participa en batallas del universo Star Wars.',
    'assets/img/star-wars-battlefront-2.jpg'
);
