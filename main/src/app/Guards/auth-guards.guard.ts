import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    if (this.tokenService.getToken()) {
      return true;
    } else {
      this.router.navigate(['authentication/login']); // redirection si non authentifié
      return false;
    }
  }
}
