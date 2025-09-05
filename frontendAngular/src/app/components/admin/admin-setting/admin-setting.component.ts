import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-setting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-primary-900">Paramètres système</h1>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border  p-6">
          <h2 class="text-lg font-semibold text-primary-900 mb-4">Configuration générale</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-primary-700">Inscriptions ouvertes</span>
              <button class="bg-primary-600 w-12 h-6 rounded-full relative">
                <div class="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-primary-700">Notifications email</span>
              <button class="bg-gray-300 w-12 h-6 rounded-full relative">
                <div class="bg-white w-5 h-5 rounded-full absolute left-0.5 top-0.5"></div>
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border  p-6">
          <h2 class="text-lg font-semibold text-primary-900 mb-4">Statistiques</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-primary-600">Utilisateurs actifs</span>
              <span class="font-bold text-primary-900">1,234</span>
            </div>
            <div class="flex justify-between">
              <span class="text-primary-600">Offres publiées</span>
              <span class="font-bold text-primary-900">456</span>
            </div>
            <div class="flex justify-between">
              <span class="text-primary-600">Conventions signées</span>
              <span class="font-bold text-primary-900">789</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AdminSettingComponent {}