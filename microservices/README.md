# Architecture Microservices - Gestion des Stages

## Vue d'ensemble

Cette architecture microservices divise l'application de gestion des stages en 5 services indépendants :

### Services

1. **API Gateway** (Port 8080)
   - Point d'entrée unique pour toutes les requêtes
   - Routage vers les microservices appropriés
   - Gestion CORS pour le frontend Angular

2. **Auth Service** (Port 8081)
   - Authentification et autorisation
   - Gestion des JWT tokens
   - Base de données dédiée : `stage_auth_db`

3. **User Service** (Port 8082)
   - Gestion des utilisateurs (étudiants, entreprises, faculté, admin)
   - Profils utilisateurs
   - Base de données dédiée : `stage_user_db`

4. **Internship Service** (Port 8083)
   - Gestion des offres de stage
   - Candidatures et conventions
   - Base de données dédiée : `stage_internship_db`

5. **Notification Service** (Port 8084)
   - Envoi d'emails et notifications
   - Utilise Redis pour le cache

### Infrastructure

- **Eureka Server** (Port 8761) : Service discovery
- **MySQL** : 3 bases de données séparées
- **Redis** : Cache et sessions
- **Docker** : Containerisation

## Démarrage

### Prérequis
- Docker et Docker Compose installés
- Java 17+
- Maven 3.6+

### Lancement rapide
```bash
# Exécuter le script de démarrage
start-services.bat

# Ou manuellement
docker-compose up -d
```

### Vérification
- Eureka Dashboard : http://localhost:8761
- API Gateway : http://localhost:8080
- Tous les services doivent apparaître dans Eureka

## Configuration Frontend

Modifier les URLs dans votre service Angular :

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api' // API Gateway
};
```

## Avantages de cette architecture

1. **Scalabilité** : Chaque service peut être mis à l'échelle indépendamment
2. **Résilience** : Panne d'un service n'affecte pas les autres
3. **Technologie** : Chaque service peut utiliser sa propre stack
4. **Déploiement** : Déploiements indépendants
5. **Équipes** : Développement parallèle par équipes spécialisées

## Monitoring

- Logs : `docker-compose logs [service-name]`
- Métriques : Eureka Dashboard
- Santé : Endpoints `/actuator/health` sur chaque service