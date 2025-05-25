import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employe } from '../classes/employe';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl: string = 'http://localhost:8090/api/users';

  constructor(private httpClient: HttpClient) {}



  getUserById(idUser: number) {
    return this.httpClient.get(this.userUrl + '/'+idUser);
  }


 searchByMail(email:string)
 {
  return this.httpClient.get(this.userUrl+ '/mail/'+email);
 }
}