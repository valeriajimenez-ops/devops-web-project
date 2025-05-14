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
                // Copiar el archivo .war generado al directorio raíz del workspace usando PowerShell
                // -Force sobrescribe si existe. Usamos barras normales '/' que cmd.exe y PowerShell entienden
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
                // Ya con tu nombre de usuario de Docker Hub
                bat 'docker build -t valeriajimenez-ops/devops-web-project:v1 --label devops-web-project-server .'
            }
        }
        stage('run container') {
            steps {
                echo 'Checking for and stopping/removing old container if exists...'
                script {
                    powershell '''
                      # Verificar si el contenedor existe usando docker inspect
                      # Redirigir error estándar a null para que el script no falle si no existe
                      $container = docker inspect -f "{{.Id}}" devops-web-project-server 2>$null

                      # Si el comando docker inspect no dio error (significa que encontró el contenedor)
                      if ($LASTEXITCODE -eq 0) {
                          echo "Container devops-web-project-server found. Stopping..."
                          docker stop devops-web-project-server
                          echo "Container devops-web-project-server stopped. Removing..."
                          docker rm devops-web-project-server
                          echo "Container devops-web-project-server removed."
                      } else {
                          echo "Container devops-web-project-server does not exist. Skipping stop/remove."
                      }

                      # Forzar un código de salida exitoso (0) para este bloque de script de PowerShell
                      # Esto asegura que Jenkins no marque este bloque como fallido si docker inspect no encontró el contenedor
                      exit 0;
                    '''
                }
                echo 'Running new Docker container...'
                // Ejecuta un nuevo contenedor en segundo plano (-d), con un nombre (--name),
                // una etiqueta (--label) y mapeando puertos (-p 8081 del host al 8080 del contenedor)
                // Usamos la imagen que acabamos de construir, ya con tu nombre de usuario
                // Si el puerto 8081 está ocupado, tendrás que cambiarlo aquí (ej: 8082:8080 o 9000:8080)
                bat 'docker run -d --name devops-web-project-server --label devops-web-project-server -p 8081:8080 valeriajimenez-ops/devops-web-project:v1'
            }
        }
    }
}