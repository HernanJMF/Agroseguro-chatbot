import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '../../http/http.service';
import { UserService } from '../users/user.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private http: HttpClient
  ) {

  }

  getTopicList(): Observable<any> { //obtiene la lista de tópicos
    const headers = {
      'Content-Type': 'application/json',
      'admin': this.userService.email,
      "user": this.userService.email,
      "is_admin": "false",

    };
    return this.httpService
      .get(
        `/topics`,
        undefined,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTopicDocumentList(topicID: string): Observable<any> { //Obtiene la lista de documentos asociados al tópico
    const headers = {
      'Content-Type': 'application/json',
      'topic_id': topicID
    };
    return this.httpService
      .get(
        `/documents-by-topic`,
        undefined,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  sendMessage(body: any): Observable<any> { //envia la pregunta realizada por el usuario y obtiene una respuesta generada por la IA
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.httpService
      .post(
        `/send-message`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  generateTicket(body: any): Observable<any> { //Envia la petición de generación de tickets
    const headers = {
      'Content-Type': 'application/json'
    };
    return this.httpService
      .post(
        `/tickets`,
        body,
        headers
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getDocument(documentID: string, type: string, email: string): Observable<any> {
    return this.http.get(`/api/get-document`, {
      params: { document_id: documentID, type, email }  // Cambia documentID a document_id si es necesario
    });
  }

  getDocumentsList(): Observable<any> {
    return this.http.get(`/api/get-documents`);
  }

  getTopicsList(): Observable<any> {
    return this.http.get(`/api/get-topics`);
  }

  logout(){
    this.userService.logout()
  }

}
