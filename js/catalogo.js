import Swal from 'sweetalert2';

const URL_VIDEOJUEGOS = `${import.meta.env.BASE_URL}data/videojuegos.json`;
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
  botonReintentar.hidden = true;
  controlesCatalogo.forEach(control => { control.disabled = true; });
  contenedor.setAttribute('aria-busy', 'true');
  estado.textContent = 'Cargando videojuegos...';
  contenedor.replaceChildren();
  try {
    const respuesta = await fetch(URL_VIDEOJUEGOS);
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
    const datos = await respuesta.json();
    const datosValidos = Array.isArray(datos) && datos.every(juego =>
      juego && Number.isInteger(juego.id) && Number.isFinite(juego.precio)
      && ['titulo', 'genero', 'descripcion', 'imagen'].every(campo => typeof juego[campo] === 'string')
    );
    if (!datosValidos) throw new Error('El archivo JSON no tiene el formato esperado.');
    videojuegos = datos;

    filtroGenero.options.length = 1;
    const generos = [...new Set(videojuegos.map(juego => juego.genero))];
    generos.forEach(genero => {
      const opcion = document.createElement('option');
      opcion.value = genero;
      opcion.textContent = genero;
      filtroGenero.appendChild(opcion);
    });
    renderizarCatalogo();
    controlesCatalogo.forEach(control => { control.disabled = false; });
  } catch (error) {
    console.error('No se pudo cargar el catálogo:', error);
    estado.textContent = 'No se pudieron cargar los videojuegos. Comprueba que el servidor esté activo y reintenta la carga.';
    botonReintentar.hidden = false;
  } finally {
    contenedor.setAttribute('aria-busy', 'false');
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
