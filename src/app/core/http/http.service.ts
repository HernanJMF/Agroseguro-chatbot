import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //Este servicio funciona para encapsular los tipos de peticiones y la logica pueda estar unicamente en los servicios
  private baseUrl: string = "https://2yqtyzdtf0.execute-api.eu-west-1.amazonaws.com/prod" //environment.api_url

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: new HttpParams(),
  };

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  private handleError(http_res: any): any {
    /*if (
      http_res.statusCode === 500 ||
      http_res.isError ||
      http_res.errorMessage
    ) {
      throw new Error(
        http_res.message ? http_res.message : http_res.errorMessage
      );
    }*/
    return http_res;
  }

  constructor(private http: HttpClient) { }

  get(
    path: string,
    params:
      | {
          [param: string]:
            | string
            | number
            | boolean
            | ReadonlyArray<string | number | boolean>;
        }
      | undefined = undefined,
    headers:
      | string
      | { [name: string]: string | number | (string | number)[] }
      | undefined = undefined
  ): Observable<any> {
    if (headers) this.httpOptions.headers = new HttpHeaders(headers);
    if (params) this.httpOptions.params = new HttpParams({ fromObject: { ...params } });
    return this.http.get(`${this.baseUrl}${path}`, this.httpOptions)
                  .pipe(map(this.handleError));
  }

  patch(
    path: string,
    body: Object = {},
    headers:
      | string
      | { [name: string]: string | number | (string | number)[] }
      | undefined = undefined
  ): Observable<any> {
    if (headers) this.httpOptions.headers = new HttpHeaders(headers);
    return this.http
      .patch<any>(
        `${this.baseUrl}${path}`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(map(this.handleError));
  }

  put(
    path: string,
    body: Object = {},
    headers:
      | string
      | { [name: string]: string | number | (string | number)[] }
      | undefined = undefined
  ): Observable<any> {
    if (headers) this.httpOptions.headers = new HttpHeaders(headers);
    return this.http
      .put<any>(
        `${this.baseUrl}${path}`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(map(this.handleError));
  }

  putFile(
    path: string,
    body: Object = {},
    headers:
      | string
      | { [name: string]: string | number | (string | number)[] }
      | undefined = undefined
  ): Observable<any> {
    if (headers) this.httpOptions.headers = new HttpHeaders(headers);
    return this.http
      .put<any>(
        `${path}`,
        body,
        this.httpOptions
      )
      .pipe(map(this.handleError));
  }

  post(
    path: string,
    body: Object = {},
    headers:
      | string
      | { [name: string]: string | number | (string | number)[] }
      | undefined = undefined
  ): Observable<any> {
    this.httpOptions.params = new HttpParams();
    if (headers) this.httpOptions.headers = new HttpHeaders(headers);
    return this.http
      .post(`${this.baseUrl}${path}`, JSON.stringify(body), this.httpOptions)
      .pipe(map(this.handleError));
  }

  delete(
    path: string,
    body: Object = {},
    headers:
      | string
      | { [name: string]: string | number | (string | number)[] }
      | undefined = undefined
  ): Observable<any> {
    this.httpOptions.params = new HttpParams();
    if (headers) this.httpOptions.headers = new HttpHeaders(headers);
    if(Object.keys(body).length === 0){
      return this.http
        .delete(`${this.baseUrl}${path}`, {
            headers: this.httpOptions.headers
          })
        .pipe(map(this.handleError));

    }else{
      return this.http
        .delete(`${this.baseUrl}${path}`, {
            headers: this.httpOptions.headers,
            body: JSON.stringify(body)
          })
        .pipe(map(this.handleError));
    }

  }

  /*postFile(path: string, body: Object = {}): Observable<any> {
      return this.http.post(
        `${this.baseUrl}${path}`,
      body
      ).pipe(catchError(this.formatErrors));
  }*/

}
