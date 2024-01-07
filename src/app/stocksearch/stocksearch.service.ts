import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  rootURL = '/stock';

  getCompany(ticker: any) {
    console.log("first "+ticker);
    return this.http.get(this.rootURL + "/search", {params: ticker});
  }
  getAutoComplete(ticker: any) {
    let val = {
      value: ticker
    }
    return this.http.get(this.rootURL + "/autocomplete", {params: val});
  }
}