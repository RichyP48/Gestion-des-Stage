@echo off
echo Démarrage des microservices...

echo 1. Construction des images Docker...
docker-compose build

echo 2. Démarrage des services...
docker-compose up -d

echo 3. Attente du démarrage complet...
timeout /t 30

echo 4. Vérification des services...
docker-compose ps

echo.
echo Services disponibles:
echo - API Gateway: http://localhost:8080
echo - Eureka Server: http://localhost:8761
echo - Auth Service: http://localhost:8081
echo - User Service: http://localhost:8082
echo - Internship Service: http://localhost:8083
echo - Notification Service: http://localhost:8084
echo.
echo Microservices démarrés avec succès!
pause