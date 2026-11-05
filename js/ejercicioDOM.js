

console.log("EJERCICIO DOM CARGADO");

document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector(".header-container");
    const nav = document.querySelector(".site-nav");

    console.log("Header:", header);
    console.log("Nav:", nav);

});

document.addEventListener("DOMContentLoaded", () => {
   
    const header = document.querySelector(".header-container");
    const nav = document.querySelector(".site-nav");

    const btnMenu = document.createElement("button");
    btnMenu.classList.add("menu-toggle");
    btnMenu.textContent = "☰";
    btnMenu.setAttribute("aria-label", "Abrir menú");
    btnMenu.setAttribute("aria-expanded", "false");

    header.insertBefore(btnMenu, nav);

    btnMenu.addEventListener("click", () => {

        nav.classList.toggle("menu-abierto");

        const abierto = nav.classList.contains("menu-abierto");

        btnMenu.textContent = abierto ? "✕" : "☰";
        btnMenu.setAttribute("aria-expanded", abierto);
        btnMenu.setAttribute("aria-label",abierto ? "Cerrar menú" : "Abrir menú");

    });


    const enlaces = nav.querySelectorAll(".nav__link");

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", () => {
            nav.classList.remove("menu-abierto");
            btnMenu.textContent = "☰";
            btnMenu.setAttribute("aria-expanded", "false");
        });
    });


    const btnTema = document.createElement("button");

    btnTema.classList.add("theme-toggle");
    btnTema.textContent = "🌙";
    btnTema.title = "Cambiar tema";

    header.insertBefore(btnTema, nav);

    btnTema.addEventListener("click", () => {

        document.body.classList.toggle("modo-oscuro");

        const oscuro = document.body.classList.contains("modo-oscuro");

        document.documentElement.dataset.theme = oscuro ? "dark" : "light";
        btnTema.textContent = oscuro ? "🌞" : "🌚";

    });

    const buscador = document.querySelector(".search-bar__input");
    const tarjetas = document.querySelectorAll(".game-card");
    const listaJuegos = document.querySelector(".games__list");

    



});



