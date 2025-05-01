const propertiesUrl = "properties/api-endpoints.properties";

const corsHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

// Cargar propiedades del archivo .properties
function loadProperties() {
    return fetch(propertiesUrl)
        .then(res => res.text())
        .then(text => {
            const props = {};
            text.split('\n').forEach(line => {
                if (line.includes('=') && !line.trim().startsWith('#')) {
                    const [key, value] = line.split('=');
                    props[key.trim()] = value.trim();
                }
            });
            return props;
        });
}

// Cargar todos los trabajadores y renderizar tabla
function loadWorkers() {
    loadProperties()
        .then(props => fetch(props['api.workers.url'], { headers: corsHeaders }))
        .then(res => {
            if (!res.ok) throw new Error("Error al cargar trabajadores");
            return res.json();
        })
        .then(renderWorkers)
        .catch(err => alert(`Error al cargar trabajadores: ${err.message}`));
}

// Crear nuevo trabajador
function createWorker(data) {
    loadProperties()
        .then(props => fetch(props['api.workers.url'], {
            method: 'POST',
            headers: corsHeaders,
            body: JSON.stringify(data)
        }))
        .then(res => {
            if (!res.ok) throw new Error("No se pudo crear el trabajador");
            document.getElementById("createWorkerForm").reset();
            loadWorkers();
        })
        .catch(err => alert(`Error al crear trabajador: ${err.message}`));
}

// Mostrar tabla de trabajadores
function renderWorkers(data) {
    const tableBody = document.querySelector("#workersTable tbody");
    tableBody.innerHTML = "";

    data.forEach(worker => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${worker.id}</td>
            <td>${worker.lastName}, ${worker.firstName} </td>
            <td>${worker.user.email}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Ejecutar cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
    loadWorkers();

    document.getElementById("createWorkerForm").addEventListener("submit", event => {
        event.preventDefault();
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        createWorker({user:{ email }, firstName, lastName });
    });
});