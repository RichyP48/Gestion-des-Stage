import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  get isLoggedIn(): boolean {
    try {
      return this.authService.isLoggedIn();
    } catch (error) {
      console.error('Erreur dans isLoggedIn:', error);
      return false;
    }
  }

  constructor(private authService: AuthService) {
    console.log('HomePageComponent initialisé');
  }
}
