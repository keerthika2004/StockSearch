import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockDetailsService {

  constructor(private http: HttpClient) { }

  rootURL = '/stock';

  getCompany(ticker: any) {
    return this.http.get(this.rootURL + "/search", {params: ticker});
  }
  getHistory(ticker: any) {
    return this.http.get(this.rootURL + "/history", {params: ticker});
  }
  getChartsHistory(ticker: any) {
    return this.http.get(this.rootURL + "/charts_history", {params: ticker});
  }
  getStockPrice(ticker: any) {
    return this.http.get(this.rootURL + "/stockprice", {params: ticker});
  }
  getNews(ticker: any) {
    return this.http.get(this.rootURL + "/news", {params: ticker});
  }
  getRecs(ticker: any) {
    return this.http.get(this.rootURL + "/rectrends", {params: ticker});
  }
  getSocial(ticker: any) {
    return this.http.get(this.rootURL + "/social", {params: ticker});
  }
  getPeers(ticker: any) {
    return this.http.get(this.rootURL + "/peers", {params: ticker});
  }
  getEarnings(ticker: any) {
    return this.http.get(this.rootURL + "/earnings", {params: ticker});
  }
}