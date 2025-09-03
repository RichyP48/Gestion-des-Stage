import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-primary-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-2xl font-bold mb-4">
            <span class="text-orange-500">Stage</span>Richy48
          </h3>
          <p class="text-primary-200">
            La plateforme qui connecte les talents de demain avec les opportunités d'aujourd'hui.
          </p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Liens rapides</h4>
          <ul class="space-y-2 text-primary-200">
            <li>
              <a href="#" class="hover:text-white">
                Accueil
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                Offres
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                À propos
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Pour les étudiants</h4>
          <ul class="space-y-2 text-primary-200">
            <li>
              <a href="#" class="hover:text-white">
                Créer un profil
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                Rechercher un stage
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                Mes candidatures
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Pour les entreprises</h4>
          <ul class="space-y-2 text-primary-200">
            <li>
              <a href="#" class="hover:text-white">
                Publier une offre
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                Gérer les candidatures
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white">
                Suivi des stagiaires
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-primary-800 mt-8 pt-8 text-center text-primary-200">
        <p>&copy; 2025 StageRichy48. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
  `,
  styles: ``
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
