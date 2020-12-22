import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public searchString(token, query, database, offset?) {
    //const searchObj = { 'token': token, 'search': query };
    let headers: { 'Content-Type': 'text/plain' };
    let formattedURL = environment.searchURL + '?token=' + token + '&search=' + query + '&file=' + database;
    if (offset) { formattedURL += '&offset=' + offset; }
    return this.http.get(formattedURL, { 'headers': headers });
  }

  public searchChem(token, chem) {
    let headers: { 'Content-Type': 'text/plain' };
    const formattedURL = environment.searchURL + '?token=' + token + '&chemical=' + chem;
    return this.http.get(formattedURL, { 'headers': headers });
  }

  public searchPatent(token, patent) {
    let headers: { 'Content-Type': 'text/plain' };
    const formattedURL = environment.searchURL + '?token=' + token + '&patent=' + patent;
    return this.http.get(formattedURL, { 'headers': headers });
  }

}
