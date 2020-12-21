import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  private token = '';
  public userName: Subject<string> = new Subject<string>();

  public tryCredentials(login, password) {
    const loginObj = { username: login, password: password };
    return this.http.post(environment.loginURL, loginObj);
  }

  public getToken() {
    return this.token;
  }

  public setToken(token) {
    this.token = token.accessToken;
  }

  public getUserName() {
    return this.userName;
  }

  public setUserName(userName) {
    this.userName.next(userName);
  }

}