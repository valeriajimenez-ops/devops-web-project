pipeline {
    agent {
        node {
            label 'built-in' // Usar el agente incorporado que tiene acceso a Docker Desktop
        }
    }
    tools {
        // Asegúrate de que 'Maven 3.9.x' (o el nombre exacto) está configurado en Gestionar Jenkins -> Configuración Global de Herramientas
        maven 'Maven 3.9.x' 
    }
    stages {
        stage('Packaging') {
            steps {
                echo 'Packaging..'
                bat 'mvn clean package' // Cambiado de sh a bat
            }
        }
        stage('Copying war file') {
            steps {
                echo 'Copying war file..'
                // Cambiado de sh a bat. Nota: 'mv' es comando de Linux. Si 'bat move target\*.war .' no funciona,
                // podría requerir configuración adicional en Jenkins o usar 'move' en lugar de 'mv'.
                bat 'mv target/*.war .' 
            }
        }
        stage('cleanup') {
            steps {
                // Limpia contenedores detenidos y otros recursos etiquetados específicamente
                bat 'docker system prune -a --volumes --force --filter "label=devops-web-project-server"' // Cambiado de sh a bat
            }
        }
        stage('build image') {
            steps {
                // Construye la imagen Docker usando el Dockerfile en el directorio actual
                // REEMPLAZA <nombre de usuario> por tu usuario de Docker Hub
                bat 'docker build -t <nombre de usuario>/devops-web-project:v1 --label devops-web-project-server .' // Cambiado de sh a bat
            }
        }
        stage('run container') {
            steps {
                // Detiene y remueve el contenedor si ya existe, luego lo ejecuta
                // Cambiado de sh a bat. || true en comandos bat es distinto, pero para docker stop/rm suele funcionar
                bat 'docker stop devops-web-project-server || true' 
                bat 'docker rm devops-web-project-server || true'  
                // REEMPLAZA <nombre de usuario> por tu usuario de Docker Hub
                bat 'docker run -d --name devops-web-project-server --label devops-web-project-server -p 8081:8080 <nombre de usuario>/devops-web-project:v1' // Cambiado de sh a bat
            }
        }
    }
}