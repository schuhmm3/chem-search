import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { LoginService } from '../../services/login.service';
import { ValResponse } from '../../interfaces/val-response';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(private search: SearchService,
    private login: LoginService) { }

  public query = '';
  public values: Array<Object>;
  private prevValue = '';
  public interval;
  private inputChangeInterval = 1500;
  private token;
  public found = 0;
  public offset = 0;
  public limit = 20;
  private database = 1;

  ngOnInit() {
    this.interval = setInterval(() => this.checkInputChange(), this.inputChangeInterval);
    this.token = this.login.getToken();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  private callQuery(token, query, offset, database) {
    this.search.searchString(token, query, database, offset).pipe(take(1)).subscribe((response: ValResponse) => {
      this.found = response.count;
      this.offset = response.offset;
      this.limit = response.limit;
      this.values = response.results;
    });
  }

  private checkInputChange() {
    if (this.query !== this.prevValue && this.query !== '') { // Check filter field every interval
      this.offset = 0;
      this.prevValue = this.query;
      this.callQuery(this.token, this.query, this.offset, this.database);
    }
  }

  public showNext() {
    const newOffset = this.offset + this.limit;
    this.callQuery(this.token, this.query, newOffset, this.database);
  }

  public showPrev() {
    let newOffset = this.offset - this.limit;
    if (newOffset < 0) { newOffset = 0 }
    this.callQuery(this.token, this.query, newOffset, this.database);
  }

  public selectDb(db) {
    if (db !== this.database) {
      this.database = db;
      this.offset = 0;
      if (this.query) {
        this.callQuery(this.token, this.query, this.offset, this.database);
      }
    }
  }

  public altSearch(value) {
    this.database === 1 ? this.database=2 : this.database = 1;
    this.query = value;
    this.offset= 0;
    this.callQuery(this.token, this.query, this.offset, this.database);
  }

  public isChecked(id){
    return this.database === id ? true : false;
  }

}
