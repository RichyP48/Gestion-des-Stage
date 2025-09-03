import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiStatusComponent } from './api-status.component';
import { ApiDemoComponent } from './api-demo.component';

@Component({
  selector: 'app-api-test-page',
  standalone: true,
  imports: [CommonModule, ApiStatusComponent, ApiDemoComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">🔗 Test des Connexions API</h1>
          <p class="text-gray-600">
            Cette page permet de tester la connectivité entre le frontend Angular et le backend Spring Boot.
          </p>
        </div>

        <div class="space-y-6">
          <!-- API Status Component -->
          <app-api-status></app-api-status>
          
          <!-- API Demo Component -->
          <app-api-demo></app-api-demo>
          
          <!-- Instructions -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-blue-800 mb-4">📋 Instructions</h3>
            <div class="space-y-3 text-sm text-blue-700">
              <div class="flex items-start">
                <span class="font-medium mr-2">1.</span>
                <span>Vérifiez que le backend Spring Boot est démarré sur http://localhost:8080</span>
              </div>
              <div class="flex items-start">
                <span class="font-medium mr-2">2.</span>
                <span>Utilisez les boutons "Tester Connexions" pour vérifier la connectivité</span>
              </div>
              <div class="flex items-start">
                <span class="font-medium mr-2">3.</span>
                <span>Connectez-vous pour tester les APIs nécessitant une authentification</span>
              </div>
              <div class="flex items-start">
                <span class="font-medium mr-2">4.</span>
                <span>Consultez la console du navigateur pour les logs détaillés</span>
              </div>
            </div>
          </div>

          <!-- API Endpoints Reference -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">🔗 Endpoints API Disponibles</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-700 mb-3">🔐 Authentification</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">POST /api/auth/login</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">POST /api/auth/register/student</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">POST /api/auth/register/company</code></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-700 mb-3">📋 Offres de Stage</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/offers</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/offers/{id}</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">POST /api/offers</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">PUT /api/offers/{id}</code></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-700 mb-3">📝 Candidatures</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">POST /api/applications</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/students/me/applications</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/companies/me/applications</code></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-700 mb-3">👤 Utilisateurs</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/users/me</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">PUT /api/users/me</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/admin/users</code></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-700 mb-3">🏢 Entreprises</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/companies/me</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">PUT /api/companies/me</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/admin/companies</code></li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-700 mb-3">🏷️ Ressources</h4>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/skills</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/domains</code></li>
                  <li><code class="bg-gray-100 px-2 py-1 rounded">GET /api/sectors</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApiTestPageComponent {}