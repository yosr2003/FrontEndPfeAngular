import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantStateService {
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.isSidebarOpen.asObservable();

  openSidebar() {
    this.isSidebarOpen.next(true);
  }

  closeSidebar() {
    this.isSidebarOpen.next(false);
  }
}
