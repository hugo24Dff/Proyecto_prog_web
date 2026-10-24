/* 
Dado un arreglo de objetos relacionado con el tema de su proyecto (productos, cursos, tareas, videojuegos etc.), obtener:

Una lista filtrada según un criterio relevante.
El total de un campo numérico.
El promedio de ese campo.
Una lista ordenada por algún campo.
Restricción: no se permite usar ciclos clásicos (for, while). Solo métodos de arreglo.

Requisitos mínimos
Al menos 5 objetos, cada uno con 4 o más propiedades.
Usar al menos una vez: desestructuración, spread, ?. y ??.
No mutar el arreglo original (verificar con console.log).

Plantilla base: */

const videojuegos =
  [{id: 1, nombre: "Star Wars Battlefront 2", precio: 299, categoria: "Acción"},
  {id: 2, nombre: "Batman Arkham Knight", precio: 299, categoria: "Acción"}, 
  {id: 3, nombre: "Rainbow Six Siege", precio: 0, categoria: "Estrategia"},
  {id: 4, nombre: "FIFA 23", precio: 199, categoria: "Deportes"},
  {id: 5, nombre: "King of Fighters XV", precio: 499, categoria: "Combate"}];

const filtrados = Object.entries(videojuegos).filter(([key, { precio }]) => precio > 200).map(([key, value]) => value); // Filtrar por un criterio relevante (precio mayor a 200)
const total = videojuegos.reduce((acc, { precio }) => acc + precio, 0); // Calcular el total del campo numérico (precio)
const promedio = total / videojuegos.length; // Calcular el promedio del campo numérico (precio)
const ordenados = [...videojuegos].sort((a, b) => a.precio - b.precio); // Ordenar por precio de menor a mayor

const categoria = videojuegos[0]?.categoria ?? "Sin categoría";

console.log({ filtrados, total, promedio, ordenados });