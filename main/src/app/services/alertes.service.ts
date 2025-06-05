import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage-service.service';
import { map, Observable } from 'rxjs';
import { Transfert } from '../classes/transfert';
import { AmortissementEcheance } from '../classes/AmortissementEcheance';


@Injectable({
  providedIn: 'root'
})
export class AlertesService {

 constructor(private http: HttpClient) {}

getTransfertsEnAttente(): Observable<Transfert[]> {
  return this.http.get<Transfert[]>('http://localhost:8085/transferts/alerte');
}

getAlertesEcheances(): Observable<AmortissementEcheance[]> {
  return this.http.get<any>('http://localhost:8085/alertsUpcomingDeadline').pipe(
    map(response => response.body.data as AmortissementEcheance[])
  );
}


}
