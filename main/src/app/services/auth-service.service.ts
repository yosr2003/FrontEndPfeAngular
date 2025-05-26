import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { Employe } from '../classes/employe';
import { TokenStorageService } from './token-storage-service.service';
import { loginResponse } from '../classes/loginResponse';
import { LoginRequest } from '../classes/LoginRequest';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userUrl: string = 'http://localhost:8085/api/auth';

  constructor(private httpClientauth: HttpClient, private sessionStorage:TokenStorageService) {}




  signup(user: Employe) {
    return this.httpClientauth.post(this.userUrl + '/signup', user);
  }


login(loginData: LoginRequest): Observable<loginResponse> {
  return this.httpClientauth.post<loginResponse>(this.userUrl + '/login', loginData);
}



  logout() {
    this.sessionStorage.signOut(); // Appel de la méthode signOut() du TokenStorageService
  }
  loggedIn(){
    return !!this.sessionStorage.getToken();
  }

 





}