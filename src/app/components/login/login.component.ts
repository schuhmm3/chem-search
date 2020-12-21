import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { LogResponse } from '../../interfaces/log-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private loginService: LoginService, private router: Router) { }

  public id;
  public passwd;
  public showModal = false;
  private unsubscriber;

  ngOnInit(): void {
  }

  doLogin() {
    this.unsubscriber = this.loginService.tryCredentials(this.id, this.passwd).subscribe((res: LogResponse) => {
      if (res.accessToken) {
        this.loginService.setToken(res);
        this.loginService.setUserName(this.id);
        this.router.navigate(['/search']);
      } else {
        this.showModal = true;
        this.id = '';
        this.passwd = '';
        this.loginService.setToken('');
      }
    }, err => {
      this.id = '';
      this.passwd = '';
      this.showModal = true;
      this.loginService.setToken('');
    });
  }

  modClose() {
    this.showModal = false;
  }

  ngOnDestroy() {
    if (this.unsubscriber) { this.unsubscriber.unsubscribe(); }
  }

}
