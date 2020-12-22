import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { LoginService } from '../../services/login.service';
import { ChemicalsResponse, ValResponse } from '../../interfaces/val-response';
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
  public values2: Array<Object>;
  private prevValue = '';
  public interval;
  private inputChangeInterval = 1500;
  private token;
  public found = 0;
  public found2 = 0;
  public offset = 0;
  public offset2 = 0;
  public limit = 20;
  public limit2 = 20;
  public chems: ChemicalsResponse;
  public chemTable1 = [];
  public chemTable2 = [];
  public sortCT1 = { chem: 0, num: 0 };
  public sortCT2 = { chem: 0, num: 0 };


  ngOnInit() {
    this.interval = setInterval(() => this.checkInputChange(), this.inputChangeInterval);
    this.token = this.login.getToken();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  private callQuery(token, query, offset, database) {
    this.search.searchString(token, query, database, offset).pipe(take(1)).subscribe((response: ValResponse) => {
      if (database === 1) {
        this.found = response.count;
        this.offset = response.offset;
        this.limit = response.limit;
        this.values = response.results;
      }
      else {
        this.found2 = response.count;
        this.offset2 = response.offset;
        this.limit2 = response.limit;
        this.values2 = response.results;
      }
    });
  }

  private checkInputChange() {
    if (this.query !== this.prevValue && this.query !== '') { // Check filter field every interval
      this.offset = 0;
      this.prevValue = this.query;
      this.callQuery(this.token, this.query, this.offset, 1);
      this.callQuery(this.token, this.query, this.offset, 2);
    }
  }

  public showNext(dbNumber) {
    let newOffset = dbNumber === 1 ? this.offset + this.limit : this.offset2 + this.limit2;
    this.callQuery(this.token, this.query, newOffset, dbNumber);
  }

  public showPrev(dbNumber) {
    let newOffset = dbNumber === 1 ? this.offset - this.limit : this.offset2 - this.limit2;
    if (newOffset < 0) { newOffset = 0 }
    this.callQuery(this.token, this.query, newOffset, dbNumber);
  }

  public searchChem(chem) {
    this.search.searchChem(this.token, chem).pipe(take(1)).subscribe((response: ChemicalsResponse) => {
      this.chems = response;
      // This may have an insane number of calls to the API. The frontend should be able to process them.
      // Sometimes a large number of short api calls is better than a single call to large queries.
      // 1. Create distinct list of patents
      let patList = [...response.results];
      response.results2.forEach(x => { if (!patList.includes(x)) { patList.push(x) } })
      // 2. Create promises list
      const promiseList = [];
      patList.forEach(x => promiseList.push(this.search.searchPatent(this.token, x).toPromise()));
      // 3. Fill tables when promises are fulfilled
      Promise.all(promiseList).then(resultArr => {
        const table1 = [];
        const table2 = [];
        resultArr.forEach(ans => {
          ans.results.map(reg => {
            let index = table1.findIndex(x => x.type === reg.type);
            index < 0 ? table1.push({ type: reg.type, count: 1 }) : table1[index].count++;
          });
          ans.results2.map(reg => {
            let index = table2.findIndex(x => x.type === reg.type);
            index < 0 ? table2.push({ type: reg.type, count: 1 }) : table2[index].count++;
          });
        });
        this.chemTable1 = [...table1];
        this.chemTable2 = [...table2];
      });
    })
  }

  public sortTable(table, crit) {
    if (table === 1) {
      if (crit === 'chem') {
        this.sortCT1.num = 0;
        if (this.sortCT1.chem === 0 || this.sortCT1.chem === 2) {
          this.sortCT1.chem = 1;
          this.chemTable1.sort((a, b) => a.type.toUpperCase() < b.type.toUpperCase() ? -1 : 1);
        }
        else {
          this.sortCT1.chem = 2;
          this.chemTable1.sort((a, b) => b.type.toUpperCase() < a.type.toUpperCase() ? -1 : 1);
        }
      }
      else if (crit === 'count') {
        this.sortCT1.chem = 0;
        if (this.sortCT1.num === 0 || this.sortCT1.num === 2) {
          this.sortCT1.num = 1;
          this.chemTable1.sort((a, b) => b.count - a.count);
        }
        else {
          this.sortCT1.num = 2;
          this.chemTable1.sort((a, b) => a.count - b.count);
        }
      }
    }
    else if (table === 2) {
      if (crit === 'chem') {
        this.sortCT2.num = 0;
        if (this.sortCT2.chem === 0 || this.sortCT2.chem === 2) {
          this.sortCT2.chem = 1;
          this.chemTable2.sort((a, b) => a.type.toUpperCase() < b.type.toUpperCase() ? -1 : 1);
        }
        else {
          this.sortCT2.chem = 2;
          this.chemTable2.sort((a, b) => b.type.toUpperCase() < a.type.toUpperCase() ? -1 : 1);
        }
      }
      else if (crit === 'count') {
        this.sortCT2.chem = 0;
        if (this.sortCT2.num === 0 || this.sortCT2.num === 2) {
          this.sortCT2.num = 1;
          this.chemTable2.sort((a, b) => b.count - a.count);
        }
        else {
          this.sortCT2.num = 2;
          this.chemTable2.sort((a, b) => a.count - b.count);
        }
      }
    }

  }

  public patentBoxClose() {
    this.chems = null;
  }

  public openExtWindow(pat) {
    const fUrl = 'https://patents.google.com/patent/' + pat;
    window.open(fUrl)
  }

}
