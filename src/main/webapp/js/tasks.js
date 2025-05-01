const propertiesUrl = "properties/api-endpoints.properties";

const corsHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

let selectedCampaign = null;
let selectedWorker = null;

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

// Cargar todas las tareas
function loadTasks() {
    loadProperties()
        .then(props => fetch(props['api.tasks.url'], { headers: corsHeaders }))
        .then(res => {
            if (!res.ok) throw new Error("Error al cargar tareas");
            return res.json();
        })
        .then(renderTasks)
        .catch(err => alert(`Error al obtener tareas: ${err.message}`));
}

// Crear nueva tarea
function createTask(data) {
    loadProperties()
        .then(props => fetch(props['api.tasks.url'], {
            method: 'POST',
            headers: corsHeaders,
            body: JSON.stringify(data)
        }))
        .then(res => {
            if (!res.ok) throw new Error("No se pudo crear la tarea");
            document.getElementById("createTaskForm").reset();
            selectedCampaign = null;
            selectedWorker = null;
            document.getElementById("campaignName").value = "";
            document.getElementById("workerName").value = "";
            loadTasks();
        })
        .catch(err => alert(`Error al crear tarea: ${err.message}`));
}

// Mostrar tabla de tareas
function renderTasks(data) {
    const tbody = document.querySelector("#tasksTable tbody");
    tbody.innerHTML = "";

    data.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${task.campaignId}</td>
            <td>${task.assignee?.lastName || '-'}, ${task.assignee?.firstName || '-'}</td>
            <td>${task.dueDate}</td>
            <td>${task.estimatedHours}</td>
        `;
        tbody.appendChild(row);
    });
}

// Al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.getElementById("createTaskForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        var today =new Date();
        today.setDate(today.getDate() + 30);
        const dueDate = today;
        const status = "To Do";
        const campaignId = document.getElementById("campaignId").value;
        const workerId = document.getElementById("workerId").value;
        const estimatedHours = document.getElementById("estimatedHours").value;

        if (!selectedWorker) {
            alert("Debes seleccionar un trabajador.");
            return;
        }
        console.log(selectedWorker);
        createTask({
            name,
            description,
            dueDate,
            status,
            campaignId,
            workerId,
            assignee: selectedWorker,
            estimatedHours
        });
    });
});
    // Campaña popup
    window.openCampaignPopup = function () {
        document.getElementById("campaignPopup").style.display = "block";
        //document.getElementById("campaignPopup").classList.add("task-show-popup"); //New
        document.getElementById("overlay").style.display = "block";
        searchCampaigns();
    }

    window.closeCampaignPopup = function () {
        document.getElementById("campaignPopup").style.display = "none";
        //document.getElementById("campaignPopup").classList.remove("task-show-popup"); //New
        document.getElementById("overlay").style.display = "none";
    }

    function searchCampaigns() {
        loadProperties()
            .then(props => fetch(props['api.campaigns.url'], { headers: corsHeaders }))
            .then(res => {
                    if (!res.ok) throw new Error("Error al cargar campañas");
                    return res.json();
            })
            .then(data => {
                    const list = document.getElementById("campaignList");
                    list.innerHTML = '';
                    data.forEach(c => {
                        const li = document.createElement("li");
                        li.textContent = c.name;
                        li.onclick = () => {
                            selectedCampaign = c;
                            document.getElementById("campaignName").value = c.name;
                            document.getElementById("campaignId").value = c.id;
                            closeCampaignPopup();
                        };
                        list.appendChild(li);
                    });
            })
            .catch(err => alert(`Error al cargar campañas: ${err.message}`));
    }

    // Trabajador popup
    window.openWorkerPopup = function () {
    //function openWorkerPopup() {
        document.getElementById("workerPopup").style.display = "block";
        //document.getElementById("workerPopup").classList.add("show-popup"); //New
        document.getElementById("overlay").style.display = "block";
        searchWorkers();
    }

    window.closeWorkerPopup = function () {
        document.getElementById("workerPopup").style.display = "none";
        //document.getElementById("workerPopup").classList.remove("show-popup"); //New
        document.getElementById("overlay").style.display = "none";
    }

    function searchWorkers() {
        loadProperties()
            .then(props => fetch(props['api.workers.url'], { headers: corsHeaders }))
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar trabajadores");
                return res.json();
            })
            .then(data => {
                const list = document.getElementById("workerList");
                list.innerHTML = '';
                data.forEach(w => {
                    const li = document.createElement("li");
                    li.textContent = w.lastName + ", " + w.firstName;
                    li.onclick = () => {
                        selectedWorker = w;
                        document.getElementById("workerName").value = w.lastName + ", " + w.firstName;
                        document.getElementById("workerId").value = w.id;
                        closeWorkerPopup();
                    };
                    list.appendChild(li);
                });
            })
            .catch(err => alert(`Error al cargar trabajadores: ${err.message}`));
    }

    window.closeAllPopups = function () {
        closeCampaignPopup();
        closeWorkerPopup();
    }

