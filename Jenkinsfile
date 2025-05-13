                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        pipeline {
    agent {
        node {
            // Usar el agente incorporado de Jenkins, que es el que corre en tu máquina local
            // Asegúrate de que este agente tiene acceso a Docker Desktop
            label 'built-in' 
        }
    }
    tools {
        // Asegúrate de que este nombre ('Maven 3.9.x' o el que sea)
        // coincide exactamente con el nombre de tu instalación de Maven en
        // Gestionar Jenkins -> Configuración Global de Herramientas -> Maven
        maven 'Maven 3.9.x' 
    }
    stages {
        stage('Packaging') {
            steps {
                echo 'Packaging..'
                // Ejecutar el build de Maven usando el comando bat en Windows
                bat 'mvn clean package' 
            }
        }
stage('Copying war file') {
    steps {
        echo 'Copying war file..'
        // Copiar el archivo .war usando PowerShell y forzar sobrescritura
        powershell 'Copy-Item -Path "target/*.war" -Destination "." -Force' 
    }
}
        stage('cleanup') {
            steps {
                echo 'Cleaning up unused Docker resources...'
                // Limpia contenedores detenidos y otros recursos etiquetados
                // La opción --force evita preguntar confirmación
                bat 'docker system prune -a --volumes --force --filter "label=devops-web-project-server"' 
            }
        }
        stage('build image') {
            steps {
                echo 'Building Docker image...'
                // Construye la imagen Docker usando el Dockerfile en el directorio actual (.)
                // REEMPLAZA <nombre de usuario> por tu nombre de usuario REAL de Docker Hub
                bat 'docker build -t valeriajimenez-ops/devops-web-project:v1 --label devops-web-project-server .' 
            }
        }
stage('run container') {
    steps {
        echo 'Stopping and removing old container if exists...'
        // Usar powershell para que || true funcione correctamente
        powershell 'docker stop devops-web-project-server || true' 
        echo 'Removing old container if exists...'
        // Usar powershell para que || true funcione correctamente
        powershell 'docker rm devops-web-project-server || true'  
        echo 'Running new Docker container...'
        // Mantener esta línea como bat si el docker build funcionó así,
        // o cambiarla a powershell también para consistencia.
        // Como docker build funcionó con bat, mantengamos docker run como bat por ahora.
        bat 'docker run -d --name devops-web-project-server --label devops-web-project-server -p 8081:8080 <nombre de usuario>/devops-web-project:v1' 
    }
}
    }
}