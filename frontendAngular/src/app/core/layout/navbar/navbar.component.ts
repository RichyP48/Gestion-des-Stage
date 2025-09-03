import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold">
              <span class="text-orange-500">Stage</span>
              <span class="text-primary-900">Richy48</span>
            </h1>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a routerLink="/" class="text-gray-700 hover:text-orange-500">
              Accueil
            </a>
            <a routerLink="/offers" class="text-gray-700 hover:text-orange-500">
              Offres
            </a>
            <a href="#about" class="text-gray-700 hover:text-orange-500">
              À propos
            </a>
          </nav>
          <div class="flex items-center space-x-4">
            <a routerLink="/auth/register">
              <button class="border-2 border-primary-900 text-primary-900 hover:bg-primary-100 px-4 py-2 rounded-md">
                S'inscrire
              </button>
            </a>
            <a routerLink="/auth/login">
              <button class="bg-primary-900 text-white hover:bg-primary-800 px-4 py-2 rounded-md">
                Se connecter
              </button>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class NavbarComponent {
}
