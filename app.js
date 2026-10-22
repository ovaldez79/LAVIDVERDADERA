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
    if (formMessage) {
      formMessage.textContent = "No se pudieron cargar los registros guardados.";
      formMessage.classList.add("message-error");
    }
    return [];
  }
}

let people = loadPeople();

function renderPeople() {
  if (!peopleList || !emptyState || !peopleCount) return;

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
    const fullName = person.nombreCompleto || [person.nombre, person.apellidos].filter(Boolean).join(" ");
    const initials = fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0)).join("");

    name.className = "person-name";
    avatar.className = "person-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = initials.toUpperCase();
    name.append(avatar, document.createTextNode(fullName));
    nameCell.append(name);
    emailCell.textContent = person.correo || "—";
    phoneCell.textContent = person.telefono || "—";
    row.append(nameCell, emailCell, phoneCell);
    peopleList.append(row);
  }
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formMessage) {
      formMessage.textContent = "";
      formMessage.classList.remove("message-error");
    }

    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const person = {
      nombreCompleto: String(values.get("nombreCompleto")).trim(),
      correo: String(values.get("correo")).trim(),
      telefono: String(values.get("telefono")).trim(),
      direccion: String(values.get("direccion")).trim(),
      edad: String(values.get("edad")).trim(),
      sexo: String(values.get("sexo")).trim(),
      tutor: String(values.get("tutor")).trim(),
      telefonoTutor: String(values.get("telefonoTutor")).trim(),
      alergiaMedicamento: String(values.get("alergiaMedicamento")).trim(),
      medicamentosAlergia: String(values.get("medicamentosAlergia")).trim(),
      enfermedadCronica: String(values.get("enfermedadCronica")).trim(),
      detalleEnfermedadCronica: String(values.get("detalleEnfermedadCronica")).trim(),
      tipoSangre: String(values.get("tipoSangre")).trim(),
      tallaPlayera: String(values.get("tallaPlayera")).trim(),
      medioConocimiento: String(values.get("medioConocimiento")).trim(),
    };

    if (!person.nombreCompleto) return;

    const updatedPeople = [...people, person];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
    } catch (error) {
      console.error("No se pudo guardar la persona.", error);
      if (formMessage) {
        formMessage.textContent = "No se pudo guardar el registro. Revisa el espacio disponible del navegador.";
        formMessage.classList.add("message-error");
      }
      return;
    }

    people = updatedPeople;
    renderPeople();
    form.reset();
    if (formMessage) formMessage.textContent = "Persona registrada correctamente.";
  });
}

if (menuToggle && navigation) {
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
}

renderPeople();
