import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Offres
  getOffres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/offres`);
  }

  getOffreById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/offres/${id}`);
  }

  // Candidatures
  postuler(candidature: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/candidatures`, candidature);
  }

  getCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidatures`);
  }

  getCandidaturesByEtudiant(etudiantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidatures/etudiant/${etudiantId}`);
  }

  // Conventions
  getConventions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/conventions`);
  }

  getConventionsByEtudiant(etudiantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/conventions/etudiant/${etudiantId}`);
  }

  // Utilisateurs
  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/utilisateurs`);
  }

  getUtilisateurById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/utilisateurs/${id}`);
  }

  updateUtilisateur(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/utilisateurs/${id}`, data);
  }

  // Entreprises
  getEntreprises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/entreprises`);
  }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
  }
}