const STORAGE_KEY = "personas-registro";

const form = document.querySelector("#person-form");
const peopleList = document.querySelector("#people-list");
const emptyState = document.querySelector("#empty-state");
const peopleCount = document.querySelector("#people-count");
const formMessage = document.querySelector("#form-message");
const navigation = document.querySelector(".navigation");
const menuToggle = document.querySelector(".menu-toggle");

function loadPeople() {
  try {
    const storedPeople = localStorage.getItem(STORAGE_KEY);
    if (!storedPeople) return [];

    const parsedPeople = JSON.parse(storedPeople);
    if (!Array.isArray(parsedPeople)) {
      throw new Error("El formato de los registros guardados no es válido.");
    }

    return parsedPeople;
  } catch (error) {
    console.error("No se pudieron cargar las personas guardadas.", error);
    formMessage.textContent = "No se pudieron cargar los registros guardados.";
    formMessage.classList.add("message-error");
    return [];
  }
}

let people = loadPeople();

function renderPeople() {
  peopleList.replaceChildren();
  emptyState.hidden = people.length > 0;
  peopleList.closest("table").hidden = people.length === 0;
  peopleCount.textContent = `${people.length} ${people.length === 1 ? "persona" : "personas"}`;

  for (const person of people) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const name = document.createElement("span");
    const avatar = document.createElement("span");
    const emailCell = document.createElement("td");
    const phoneCell = document.createElement("td");

    name.className = "person-name";
    avatar.className = "person-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = `${person.nombre.charAt(0)}${person.apellidos.charAt(0)}`.toUpperCase();
    name.append(avatar, document.createTextNode(`${person.nombre} ${person.apellidos}`));
    nameCell.append(name);
    emailCell.textContent = person.correo || "—";
    phoneCell.textContent = person.telefono || "—";
    row.append(nameCell, emailCell, phoneCell);
    peopleList.append(row);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.classList.remove("message-error");

  if (!form.reportValidity()) return;

  const values = new FormData(form);
  const person = {
    nombre: String(values.get("nombre")).trim(),
    apellidos: String(values.get("apellidos")).trim(),
    correo: String(values.get("correo")).trim(),
    telefono: String(values.get("telefono")).trim(),
  };

  if (!person.nombre || !person.apellidos) return;

  const updatedPeople = [...people, person];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  } catch (error) {
    console.error("No se pudo guardar la persona.", error);
    formMessage.textContent = "No se pudo guardar el registro. Revisa el espacio disponible del navegador.";
    formMessage.classList.add("message-error");
    return;
  }

  people = updatedPeople;
  renderPeople();
  form.reset();
  formMessage.textContent = "Persona registrada correctamente.";
});

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

renderPeople();
