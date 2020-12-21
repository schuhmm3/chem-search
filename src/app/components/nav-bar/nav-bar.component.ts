import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

  constructor(private loginService: LoginService, private router: Router) { }

  public uName;
  private unsubscriber;

  ngOnInit() {
    this.unsubscriber = this.loginService.getUserName().subscribe(res => {
      this.uName = res;
    });
  }

  ngOnDestroy() {
    if (this.unsubscriber) { this.unsubscriber.unsubscribe(); }
  }

  logOut() {
    this.loginService.setUserName('');
    this.loginService.setToken('');
    this.router.navigate(['/login']);
  }

}
