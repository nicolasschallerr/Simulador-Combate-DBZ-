class Personaje {
  static id = 0;
  constructor(nombre, ataque, defensa) {
    this.id = ++Personaje.id;
    this.nombre = nombre;
    this.ataque = ataque;
    this.defensa = defensa;
    this.defensaInicial = defensa;
  }

  poderEspecial = () => this.ataque * 1.5;

  recuperar() {
    this.defensa += 10;
  }

  esquivar = () => Math.random() > 0.5;

  mostrarDetalles() {
    return `${this.nombre}: Ataque = ${this.ataque}, Defensa = ${this.defensa}`;
  }
}

// Saludo de Bienvenida
let mensaje = sessionStorage.getItem("Bienvenido a Dragon Ball Combat");

// Crear instancias de personajes
const personajes = [
  new Personaje("Super Saiyajin Goku", 60, 115, "../img/goku.avif"),
  new Personaje("Soldado de Orgullo Giren", 60, 130, "../img/giren.jpg"),
  new Personaje("Dios Bills", 70, 100),
  new Personaje("Soldado de Orgullo Toppo", 40, 140, "../img/Toppo.png"),
  new Personaje("Super Saiyajin Vegeta", 55, 110, "../img/vegeta.webp"),
  new Personaje("Dios Champa", 80, 90),
  new Personaje("Soldado de Orgullo Dyspo", 40, 140),
  new Personaje("Super Saiyajin Trunks", 55, 110),
  new Personaje("Dios Vermouth", 80, 90),
];

const personajesSeleccionados = [];

function selecPersonaje(id) {
  const personaje = personajes.find((p) => p.id === id);
  if (personaje && personajesSeleccionados.length < 2) {
    personajesSeleccionados.push(personaje);
  }
}

function mostrar(personajes, callback) {
  personajes.forEach((personaje) => {
    callback(personaje.mostrarDetalles());
  });
}

const mostrarPersonaje = [];
mostrar(personajes, (detalle) => mostrarPersonaje.push(detalle));

function buscarPersonajes() {
  return {
    super: personajes.filter((el) => el.nombre.includes("Super")),
    dios: personajes.filter((el) => el.nombre.includes("Dios")),
    soldado: personajes.filter((el) => el.nombre.includes("Soldado")),
  };
}

const resultados = buscarPersonajes();

function guardarPersonajesSeleccionados() {
  sessionStorage.setItem(
    "personajesSeleccionados",
    JSON.stringify(personajesSeleccionados)
  );
}

function cargarPersonajesSeleccionados() {
  const data = sessionStorage.getItem("personajesSeleccionados");
  return data ? JSON.parse(data) : [];
}

function atacar(atacante, defensor) {
  const daño = atacante.ataque - defensor.defensa;
  defensor.defensa = Math.max(defensor.defensa - daño, 0);
}

function ataqueDebil(personaje1) {
  return (defensa) => defensa - Math.sqrt(personaje1.ataque);
}

function combate(personaje1, personaje2) {
  while (personaje1.defensa > 0 && personaje2.defensa > 0) {
    atacar(personaje1, personaje2);
    if (personaje2.defensa <= 0) {
      return `${personaje1.nombre} ha ganado el combate!`;
    }
    atacar(personaje2, personaje1);
    if (personaje1.defensa <= 0) {
      return `${personaje2.nombre} ha ganado el combate!`;
    }
  }
}

function realizarCombate(personaje1, personaje2) {
  let resultados = [];
  for (let i = 1; i <= 3; i++) {
    const resultado = combate(personaje1, personaje2);
    resultados.push(`Combate ${i}: ${resultado}`);
    ReiniciarCombate(personaje1, personaje2);
  }
  return resultados;
}

function ReiniciarCombate(personaje1, personaje2) {
  personaje1.defensa = personaje1.defensaInicial;
  personaje2.defensa = personaje2.defensaInicial;
}

function renderizarPersonajes() {
  const contenedor = document.querySelector("#personajes-section .row");
  contenedor.innerHTML = "";

  personajes.forEach((personaje) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");
    card.innerHTML = `
      <div class="card text-bg-dark h-100">
        <img src="${personaje.imagen}" class="card-img-top" alt="${personaje.nombre}">
        <div class="card-body">
          <h5 class="card-title">${personaje.nombre}</h5>
          <p class="card-text">Ataque: ${personaje.ataque} | Defensa: ${personaje.defensa}</p>
          <button class="btn btn-primary" onclick="seleccionarPersonaje(${personaje.id})">Seleccionar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Seleccionar personaje y guardar en localStorage
function seleccionarPersonaje(id) {
  const personaje = personajes.find((p) => p.id === id);
  if (personaje && personajesSeleccionados.length < 2) {
    personajesSeleccionados.push(personaje);
    alert(`${personaje.nombre} ha sido seleccionado!`);
    guardarPersonajesSeleccionados();
    localStorage.setItem(
      "historialCombates",
      JSON.stringify(personajesSeleccionados)
    );
  } else if (personajesSeleccionados.length >= 2) {
    alert("Ya has seleccionado el máximo de personajes.");
  }
}

// Mostrar personajes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderizarPersonajes();
  personajesSeleccionados.push(...cargarPersonajesSeleccionados());
});

// Guardar resultados de combates en localStorage
function guardarResultadosCombate(resultados) {
  const historial = JSON.parse(localStorage.getItem("historialCombates")) || [];
  historial.push(...resultados);
  localStorage.setItem("historialCombates", JSON.stringify(historial));
}

// Cargar y mostrar el historial de combates desde localStorage
function mostrarHistorialCombates() {
  const historial = JSON.parse(localStorage.getItem("historialCombates")) || [];
  const contenedorHistorial = document.getElementById("historial-combates");
  contenedorHistorial.innerHTML = "<h3>Historial de Combates</h3>";

  if (historial.length === 0) {
    contenedorHistorial.innerHTML += "<p>No hay combates registrados.</p>";
  } else {
    historial.forEach((combate, index) => {
      const p = document.createElement("p");
      p.textContent = `Combate ${index + 1}: ${combate}`;
      contenedorHistorial.appendChild(p);
    });
  }
}

// Función para limpiar personajes seleccionados
function limpiarSeleccion() {
  personajesSeleccionados.length = 0;
  sessionStorage.removeItem("personajesSeleccionados");
}

// Función para reiniciar el historial de combates
function reiniciarHistorial() {
  localStorage.removeItem("historialCombates"); // Eliminar del Storage
  mostrarHistorialCombates(); // Actualizar hisotrial
}

// Mostrar personajes y botones en la pagina
document.addEventListener("DOMContentLoaded", () => {
  renderizarPersonajes();
  personajesSeleccionados.push(...cargarPersonajesSeleccionados());
  mostrarHistorialCombates(); // Mostrar historial al cargar
});

// Crear botones en la página
const botonesContenedor = document.createElement("div");
botonesContenedor.innerHTML = `
  <button class="btn btn-warning m-2" onclick="limpiarSeleccion()">Limpiar Selección</button>
  <button class="btn btn-danger m-2" onclick="reiniciarHistorial()">Reiniciar Historial</button>
`;
document.body.appendChild(botonesContenedor);
