# Guide de Connexion API - Frontend Angular ↔ Backend Spring Boot

## 🎯 Objectif
Ce guide explique comment le frontend Angular est connecté au backend Spring Boot via les APIs REST.

## 🏗️ Architecture de Connexion

### Services Frontend
```
ApiService (Base) → Services Spécialisés → Composants
     ↓                    ↓                  ↓
- HTTP Client      - OfferService      - Components
- Intercepteurs    - UserService       - Pages
- Logging          - AuthService       - Layouts
- Error Handling   - ApplicationService
```

### Services Créés

#### 1. **ApiService** (`src/app/services/api.service.ts`)
- Service de base pour toutes les requêtes HTTP
- Gestion centralisée des erreurs
- Logging automatique des requêtes/réponses
- Support des différents types de réponses (JSON, Blob)

#### 2. **BackendService** (`src/app/services/backend.service.ts`)
- Service unifié qui orchestre tous les autres services
- Méthodes de compatibilité avec l'ancien code
- Point d'entrée principal pour les composants

#### 3. **ApiConnectorService** (`src/app/services/api-connector.service.ts`)
- Test automatique de la connectivité backend
- Monitoring des connexions API
- Initialisation des données utilisateur

#### 4. **AppInitializerService** (`src/app/services/app-initializer.service.ts`)
- Initialisation automatique au démarrage de l'app
- Configuration via APP_INITIALIZER
- Gestion des erreurs de connexion

## 🔗 Endpoints API Connectés

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register/student` - Inscription étudiant
- `POST /api/auth/register/company` - Inscription entreprise

### Offres de Stage
- `GET /api/offers` - Liste des offres (avec pagination et filtres)
- `GET /api/offers/{id}` - Détails d'une offre
- `POST /api/offers` - Création d'offre (entreprise)
- `PUT /api/offers/{id}` - Modification d'offre
- `DELETE /api/offers/{id}` - Suppression d'offre

### Candidatures
- `POST /api/applications` - Soumission de candidature
- `GET /api/students/me/applications` - Candidatures de l'étudiant
- `GET /api/companies/me/applications` - Candidatures reçues par l'entreprise
- `PUT /api/applications/{id}/status` - Mise à jour du statut

### Utilisateurs
- `GET /api/users/me` - Profil utilisateur actuel
- `PUT /api/users/me` - Mise à jour du profil
- `GET /api/admin/users` - Liste des utilisateurs (admin)

### Entreprises
- `GET /api/companies/me` - Données de l'entreprise actuelle
- `PUT /api/companies/me` - Mise à jour de l'entreprise
- `GET /api/admin/companies` - Liste des entreprises (admin)

### Conventions de Stage
- `GET /api/agreements` - Liste des conventions
- `GET /api/agreements/{id}` - Détails d'une convention
- `PUT /api/agreements/{id}/validate` - Validation (faculté)
- `GET /api/agreements/{id}/pdf` - Téléchargement PDF

### Ressources Support
- `GET /api/skills` - Liste des compétences
- `GET /api/domains` - Liste des domaines
- `GET /api/sectors` - Liste des secteurs

## 🛠️ Configuration

### Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Intercepteurs
- **AuthInterceptor** : Ajoute automatiquement le token JWT
- **LoggingInterceptor** : Log toutes les requêtes HTTP

### App Config
```typescript
// src/app/app.config.ts
providers: [
  provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor])),
  ApiConnectorService,
  AppInitializerService,
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [AppInitializerService],
    multi: true
  }
]
```

## 🧪 Test des Connexions

### Page de Test
Accédez à `/api-test` pour tester toutes les connexions API :
- État des connexions backend
- Test des endpoints individuels
- Démonstration des APIs
- Logs détaillés

### Composants de Test
1. **ApiStatusComponent** - Affiche l'état des connexions
2. **ApiDemoComponent** - Démonstration interactive des APIs
3. **ApiTestPageComponent** - Page complète de test

### Console Logging
Tous les appels API sont loggés dans la console avec :
- 📡 Requêtes sortantes
- ✅ Réponses réussies
- ❌ Erreurs détaillées
- 🔧 Informations de debug

## 🚀 Utilisation dans les Composants

### Exemple d'utilisation
```typescript
import { OfferService } from '../services/offer.service';

export class MyComponent {
  constructor(private offerService: OfferService) {}

  loadOffers(): void {
    this.offerService.getOffers(0, 10).subscribe({
      next: (data) => {
        console.log('Offres chargées:', data);
        this.offers = data.content;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }
}
```

### Gestion des Erreurs
```typescript
this.apiService.get('/endpoint').pipe(
  catchError(error => {
    console.error('Erreur API:', error);
    // Gestion spécifique de l'erreur
    return throwError(() => new Error('Message utilisateur'));
  })
).subscribe();
```

## 🔐 Authentification

### Token JWT
- Stocké automatiquement dans localStorage
- Ajouté automatiquement aux requêtes via AuthInterceptor
- Géré par AuthService

### Rôles Utilisateur
- `STUDENT` - Étudiant
- `COMPANY` - Entreprise
- `FACULTY` - Personnel académique
- `ADMIN` - Administrateur

## 📊 Monitoring

### Status en Temps Réel
- Connexion backend : ✅/❌
- APIs individuelles : ✅/❌
- Session utilisateur : ✅/❌
- Dernière mise à jour

### Logs Structurés
```
🔧 ApiService initialized
🌐 Backend URL: http://localhost:8080/api
📡 GET Request: /api/offers
✅ GET Success: /api/offers
👤 User authenticated: student@example.com
```

## 🔧 Dépannage

### Problèmes Courants
1. **Backend non démarré** : Vérifier que Spring Boot tourne sur port 8080
2. **CORS** : Configurer les headers CORS dans Spring Boot
3. **Token expiré** : Géré automatiquement par AuthInterceptor
4. **Erreurs réseau** : Vérifier la connectivité et les URLs

### Debug
1. Ouvrir la console du navigateur
2. Aller sur `/api-test`
3. Tester les connexions individuellement
4. Vérifier les logs détaillés

## 📝 Prochaines Étapes

1. ✅ Connexion API de base
2. ✅ Services spécialisés
3. ✅ Gestion d'erreurs
4. ✅ Logging et monitoring
5. 🔄 Tests d'intégration
6. 🔄 Optimisation des performances
7. 🔄 Cache et offline support

---

**Note** : Cette architecture assure une connexion robuste et maintenable entre le frontend Angular et le backend Spring Boot, avec un monitoring complet et une gestion d'erreurs appropriée.