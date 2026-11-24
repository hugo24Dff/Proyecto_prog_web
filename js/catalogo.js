import Swal from 'sweetalert2';

const URL_VIDEOJUEGOS = '/api/videojuegos.php';
const CLAVE_FAVORITOS = 'tekhstore_favoritos';
const CLAVE_TEMA = 'tekhstore_tema';

const contenedor = document.getElementById('lista-videojuegos');
const estado = document.getElementById('estado-catalogo');
const buscador = document.getElementById('buscador-juegos');
const filtroGenero = document.getElementById('filtro-genero');
const botonFavoritos = document.getElementById('ver-favoritos');
const contadorFavoritos = document.getElementById('contador-favoritos');
const botonTema = document.getElementById('alternar-tema');
const botonLimpiar = document.getElementById('limpiar-filtro');
const botonReintentar = document.getElementById('reintentar-catalogo');
const controlesCatalogo = [buscador, filtroGenero, botonFavoritos, botonLimpiar];

let videojuegos = [];
let soloFavoritos = false;

function leerJSON(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch (error) {
    console.warn(`No se pudo leer ${clave} de localStorage:`, error);
    return valorInicial;
  }
}

function obtenerFavoritos() {
  const favoritos = leerJSON(CLAVE_FAVORITOS, []);
  return Array.isArray(favoritos) ? favoritos : [];
}

function guardarFavoritos(favoritos) {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  actualizarContador(favoritos);
}

function actualizarContador(favoritos) {
  contadorFavoritos.textContent = favoritos.length;
}

function actualizarBotonFavorito(boton, seleccionado) {
  boton.textContent = seleccionado ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos';
  boton.setAttribute('aria-pressed', String(seleccionado));
}

async function alternarFavorito(juego, boton) {
  const quitar = obtenerFavoritos().includes(juego.id);

  if (quitar) {
    const confirmacion = await Swal.fire({
      icon: 'question',
      titleText: `¿Quitar ${juego.titulo} de favoritos?`,
      showCancelButton: true,
      confirmButtonText: 'Quitar',
      cancelButtonText: 'Cancelar',
      focusCancel: true
    });
    if (!confirmacion.isConfirmed) return;
  }

  try {
    const favoritos = obtenerFavoritos();
    const nuevos = quitar
      ? favoritos.filter(id => id !== juego.id)
      : [...new Set([...favoritos, juego.id])];
    guardarFavoritos(nuevos);
  } catch (error) {
    console.warn('No se pudieron guardar los favoritos:', error);
    await Swal.fire({
      icon: 'error',
      title: 'No se guardaron los favoritos',
      text: 'Comprueba que tu navegador permita el almacenamiento local.'
    });
    return;
  }

  if (soloFavoritos && quitar) {
    renderizarCatalogo();
    botonFavoritos.focus();
  } else {
    actualizarBotonFavorito(boton, !quitar);
  }

  await Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: quitar ? 'Eliminado de favoritos' : 'Agregado a favoritos',
    showConfirmButton: false,
    timer: 1600
  });
}

function crearTarjeta(juego, esFavorito) {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'game-card catalogo-card';

  const imagen = document.createElement('img');
  imagen.className = 'game-card__image';
  imagen.src = `${import.meta.env.BASE_URL}${juego.imagen}`;
  imagen.alt = juego.titulo;
  imagen.loading = 'lazy';
  imagen.onerror = () => { imagen.alt = `Imagen no disponible: ${juego.titulo}`; };

  const contenido = document.createElement('div');
  contenido.className = 'catalogo-card__contenido';
  const titulo = document.createElement('h3');
  titulo.textContent = juego.titulo;
  const genero = document.createElement('p');
  genero.textContent = `Género: ${juego.genero}`;
  const descripcion = document.createElement('p');
  descripcion.textContent = juego.descripcion;
  const precio = document.createElement('strong');
  precio.textContent = `$${juego.precio.toFixed(2)} MXN`;
  const favorito = document.createElement('button');
  favorito.type = 'button';
  favorito.className = 'btn-favorito';
  actualizarBotonFavorito(favorito, esFavorito);
  favorito.addEventListener('click', () => alternarFavorito(juego, favorito));

  contenido.append(titulo, genero, descripcion, precio, favorito);
  tarjeta.append(imagen, contenido);
  return tarjeta;
}

function renderizarCatalogo() {
  const texto = buscador.value.trim().toLocaleLowerCase('es');
  const generoSeleccionado = filtroGenero.value;
  const favoritos = obtenerFavoritos();
  const filtrados = videojuegos.filter(juego => {
    const coincideTexto = juego.titulo.toLocaleLowerCase('es').includes(texto);
    const coincideGenero = generoSeleccionado === 'todos' || juego.genero === generoSeleccionado;
    const coincideFavorito = !soloFavoritos || favoritos.includes(juego.id);
    return coincideTexto && coincideGenero && coincideFavorito;
  });

  contenedor.replaceChildren();
  if (filtrados.length === 0) {
    if (videojuegos.length === 0) {
      estado.textContent = 'El catálogo está vacío.';
    } else if (soloFavoritos && favoritos.length === 0) {
      estado.textContent = 'Todavía no tienes videojuegos favoritos.';
    } else {
      estado.textContent = 'No se encontraron videojuegos con esos filtros.';
    }
    return;
  }
  estado.textContent = filtrados.length === 1
    ? '1 videojuego encontrado.'
    : `${filtrados.length} videojuegos encontrados.`;
  contenedor.append(...filtrados.map(juego => crearTarjeta(juego, favoritos.includes(juego.id))));
}

function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  botonTema.textContent = tema === 'dark' ? '☀️' : '🌙';
}


async function cargarVideojuegos() {

  estado.textContent = 'Cargando videojuegos...';

  try {

    const respuesta = await fetch(URL_VIDEOJUEGOS);

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        datos.error || `Error HTTP ${respuesta.status}`
      );
    }

    if (!Array.isArray(datos)) {
      throw new Error(
        'La API devolvió un formato incorrecto.'
      );
    }

    videojuegos = datos;

    // Limpiar las opciones anteriores
    filtroGenero.replaceChildren();

    const opcionTodos = document.createElement('option');

    opcionTodos.value = 'todos';
    opcionTodos.textContent = 'Todos';

    filtroGenero.appendChild(opcionTodos);

    // Obtener géneros sin repetir
    const generos = [
      ...new Set(
        videojuegos.map(juego => juego.genero)
      )
    ];

    generos.forEach(genero => {

      const opcion = document.createElement('option');

      opcion.value = genero;
      opcion.textContent = genero;

      filtroGenero.appendChild(opcion);
    });

    renderizarCatalogo();

    return true;

  } catch (error) {

    console.error(error);

    estado.textContent =
      'No fue posible cargar los videojuegos.';

    await Swal.fire({
      icon: 'error',
      title: 'Error al cargar el catálogo',
      text: error.message
    });

    return false;
  }
}

buscador.addEventListener('input', renderizarCatalogo);
filtroGenero.addEventListener('change', renderizarCatalogo);
botonLimpiar.addEventListener('click', () => {
  buscador.value = '';
  filtroGenero.value = 'todos';
  soloFavoritos = false;
  botonFavoritos.setAttribute('aria-pressed', 'false');
  renderizarCatalogo();
});
botonFavoritos.addEventListener('click', () => {
  soloFavoritos = !soloFavoritos;
  botonFavoritos.setAttribute('aria-pressed', String(soloFavoritos));
  renderizarCatalogo();
});
botonReintentar.addEventListener('click', cargarVideojuegos);
botonTema.addEventListener('click', async () => {
  const temaActual = document.documentElement.dataset.theme || 'light';
  const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
  aplicarTema(nuevoTema);
  try {
    localStorage.setItem(CLAVE_TEMA, JSON.stringify(nuevoTema));
  } catch (error) {
    console.warn('No se pudo guardar el tema:', error);
    await Swal.fire({
      icon: 'warning',
      title: 'No se guardó el tema',
      text: 'El cambio solo se aplicará mientras esta página siga abierta.'
    });
  }
});

const temaGuardado = leerJSON(CLAVE_TEMA, 'light');
aplicarTema(temaGuardado === 'dark' ? 'dark' : 'light');
actualizarContador(obtenerFavoritos());
cargarVideojuegos();


const formularioVideojuego =
    document.getElementById('form-videojuego');

formularioVideojuego.addEventListener(
    'submit',
    async (evento) => {

        // Evitar recargar la página
        evento.preventDefault();

        const datos = new FormData(formularioVideojuego);

        const nuevoVideojuego = {
            titulo: datos.get('titulo').trim(),
            genero: datos.get('genero').trim(),
            precio: Number(datos.get('precio')),
            descripcion: datos.get('descripcion').trim(),
            imagen: datos.get('imagen').trim()
        };

        const boton = formularioVideojuego.querySelector(
            'button[type="submit"]'
        );

        boton.disabled = true;

        try {

            const respuesta = await fetch(URL_VIDEOJUEGOS, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(nuevoVideojuego)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.error || 'Error al registrar.'
                );
            }

            // Limpiar formulario
            formularioVideojuego.reset();

            // Restablecer filtros
            buscador.value = '';
            filtroGenero.value = 'todos';
            soloFavoritos = false;

            botonFavoritos.setAttribute(
                'aria-pressed',
                'false'
            );

            botonFavoritos.title = 'Ver favoritos';

            // Actualizar catálogo sin recargar
            const actualizado = await cargarVideojuegos();

            await Swal.fire({
                icon: actualizado ? 'success' : 'warning',
                title: 'Videojuego registrado',
                text: actualizado
                    ? `${resultado.titulo} fue agregado correctamente.`
                    : 'Se guardó el videojuego, pero no se pudo actualizar la lista.'
            });

        } catch (error) {

            await Swal.fire({
                icon: 'error',
                title: 'No se pudo registrar',
                text: error.message
            });

        } finally {

            boton.disabled = false;
        }
    }
);
