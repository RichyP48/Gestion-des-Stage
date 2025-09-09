import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private refreshSubject = new Subject<string>();
  
  refresh$ = this.refreshSubject.asObservable();

  triggerRefresh(component: string): void {
    this.refreshSubject.next(component);
  }
}