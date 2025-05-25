import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { Employe } from '../classes/employe';
import { TokenStorageService } from './token-storage-service.service';
import { loginResponse } from '../classes/loginResponse';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userUrl: string = 'http://localhost:8090/api/auth';

  constructor(private httpClientauth: HttpClient, private sessionStorage:TokenStorageService) {}




  signup(user: Employe) {
    return this.httpClientauth.post(this.userUrl + '/signup', user);
  }


login(user: Employe): Observable<loginResponse> {
  return this.httpClientauth.post<loginResponse>(this.userUrl + '/login', user);
}


  logout() {
    this.sessionStorage.signOut(); // Appel de la méthode signOut() du TokenStorageService
  }
  loggedIn(){
    return !!this.sessionStorage.getToken();
  }

 





}