import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  uploadCV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('cv', file);
    return this.http.post(`${this.apiUrl}/cv`, formData);
  }

  uploadCoverLetter(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('coverLetter', file);
    return this.http.post(`${this.apiUrl}/cover-letter`, formData);
  }

  uploadDocument(file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return this.http.post(`${this.apiUrl}/documents`, formData);
  }

  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileId}/download`, { responseType: 'blob' });
  }

  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`);
  }

  getUserFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }
}