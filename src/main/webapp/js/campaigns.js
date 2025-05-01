const propertiesUrl = "properties/api-endpoints.properties";

const corsHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

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

function loadCampaigns() {
    loadProperties()
        .then(props => fetch(props['api.campaigns.url'], {
            headers: corsHeaders
        }))
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al cargar campañas");
            }
            return res.json();
        })
        .then(renderCampaigns)
        .catch(err => alert(`Error al cargar campañas: ${err.message}`));
}

function createCampaign(data) {
    loadProperties()
        .then(props => fetch(props['api.campaigns.url'], {
            method: 'POST',
            headers: corsHeaders,
            body: JSON.stringify(data)
        }))
        .then(res => {
            if (!res.ok) throw new Error("No se pudo crear la campaña");
            document.getElementById("createCampaignForm").reset();
            loadCampaigns();
        })
        .catch(err => alert(`Error al crear campaña: ${err.message}`));
}

function deleteCampaign(id) {
    loadProperties()
        .then(props => fetch(`${props['api.campaigns.url']}/${id}`, {
            method: 'DELETE',
            headers: corsHeaders
        }))
        .then(res => {
            if (!res.ok) throw new Error("No se pudo eliminar");
            loadCampaigns();
        })
        .catch(err => alert(`Error al eliminar campaña: ${err.message}`));
}

function renderCampaigns(data) {
    const tableBody = document.querySelector("#campaignsTable tbody");
    tableBody.innerHTML = "";

    data.forEach(campaign => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${campaign.code}</td>
            <td>${campaign.name}</td>
            <td>${campaign.description}</td>
        `;
        tableBody.appendChild(row);
    });
}

// ⏱️ Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    loadCampaigns();

    document.getElementById("createCampaignForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const code = document.getElementById("code").value;
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;

        createCampaign({ code, name, description });
    });
});
