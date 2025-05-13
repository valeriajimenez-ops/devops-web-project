pipeline {
    agent {
        node {
            label 'dockerhost-build-server' // O la etiqueta de tu agente Jenkins con Docker
        }
    }
    tools {
        maven 'maven-3.9.6' // Asegúrate de que el nombre de tu herramienta Maven configurada en Jenkins sea 'maven-3.9.6'
    }
    stages {
        stage('Packaging') {
            steps {
                echo 'Packaging..'
                sh 'mvn clean package' // Compila la aplicación Java y crea el archivo .war
            }
        }
        stage('Copying war file') {
            steps {
                echo 'Copying war file..'
                sh 'mv target/*.war .' // Mueve el .war generado en 'target' al directorio raíz para que el Dockerfile lo encuentre
            }
        }
        stage('cleanup') {
            steps {
                // Limpia contenedores detenidos y otros recursos etiquetados específicamente
                sh 'docker system prune -a --volumes --force --filter "label=devops-web-project-server"'
            }
        }
        stage('build image') {
            steps {
                // Construye la imagen Docker usando el Dockerfile en el directorio actual
                sh 'docker build -t <nombre de usuario>/devops-web-project:v1 --label devops-web-project-server .'
            }
        }
        stage('run container') {
            steps {
                // Detiene y remueve el contenedor si ya existe, luego lo ejecuta
                sh 'docker stop devops-web-project-server || true' // Detiene si existe, || true evita que el pipeline falle si no existe
                sh 'docker rm devops-web-project-server || true'  // Elimina si existe
                sh 'docker run -d --name devops-web-project-server --label devops-web-project-server -p 8081:8080 <nombre de usuario>/devops-web-project:v1' // Ejecuta el nuevo contenedor
            }
        }
    }
}