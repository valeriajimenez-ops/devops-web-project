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
                // Mover el archivo .war generado al directorio raíz del workspace
                // Usamos 'move /Y' para Windows (sobrescribe si existe) y barras normales '/' para compatibilidad con Groovy
                bat 'move /Y target/*.war .' 
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
                bat 'docker build -t <nombre de usuario>/devops-web-project:v1 --label devops-web-project-server .' 
            }
        }
        stage('run container') {
            steps {
                echo 'Stopping and removing old container if exists...'
                // Detiene el contenedor si ya está corriendo. || true evita que el pipeline falle si no existe
                bat 'docker stop devops-web-project-server || true' 
                echo 'Removing old container if exists...'
                // Elimina el contenedor si existe. || true evita que el pipeline falle si no existe
                bat 'docker rm devops-web-project-server || true'  
                echo 'Running new Docker container...'
                // Ejecuta un nuevo contenedor en segundo plano (-d), con un nombre (--name),
                // una etiqueta (--label) y mapeando puertos (-p 8081 del host al 8080 del contenedor)
                // Usamos la imagen que acabamos de construir
                // REEMPLAZA <nombre de usuario> por tu nombre de usuario REAL de Docker Hub
                // Si el puerto 8081 está ocupado, tendrás que cambiarlo aquí (ej: 8082:8080 o 9000:8080)
                bat 'docker run -d --name devops-web-project-server --label devops-web-project-server -p 8081:8080 <nombre de usuario>/devops-web-project:v1' 
            }
        }
    }
}