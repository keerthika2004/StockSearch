import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {
  // localStorage: Storage;
  // watchlist = [];
  // portfolio = [];
  wallet: number = 25000;
  changes$ = new Subject();
  changeP$ = new Subject();

  constructor() {
    Object.defineProperty(window, 'localStorage', {
    });
  }

  get(key: string): any {
    if (this.isLocalStorageSupported) {
      return JSON.parse(localStorage.getItem(key) || '{}');
    }
    return null;
  }

  getCurrentPortfolio(key: string): any {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  getAll(){
    if (this.isLocalStorageSupported){
      var list = [];
      var keys = Object.keys(localStorage)
      for (var i = 0; i < localStorage.length; i++)
      {
        var ckey: string = keys[i];
        var value = localStorage.getItem(ckey);
        let item : {[key: string]: any} = {};
        item[ckey] = JSON.parse(value || '{}');
        list.push(item);
      }
      return list;
    }
    return null;
  }

  set(key: string, value: any): boolean {
    if (this.isLocalStorageSupported) {
      localStorage.setItem(key, JSON.stringify(value));
      this.changes$.next({
        type: 'set',
        key,
        value
      });
      return true;
    }

    return false;
  }

  setPortfolio(key: string, value: any): boolean {
    localStorage.setItem(key, JSON.stringify(value));
    this.changeP$.next({
      type: 'set',
      key,
      value
    });
    return true;
  }

  remove(key: string): boolean {
    if (this.isLocalStorageSupported) {
      localStorage.removeItem(key);
      this.changes$.next({
        type: 'remove',
        key
      });
      return true;
    }

    return false;
  }

  removePortfolio(key: string): boolean {
    localStorage.removeItem(key);
    this.changeP$.next({
      type: 'remove',
      key
    });
    return true;
  }

  get isLocalStorageSupported(): boolean {
    return !!localStorage
  }

  getPortfolio(){
    var list = [];
    var keys = Object.keys(localStorage)
    for (var i = 0; i < localStorage.length; i++)
    {
      var ckey: string = keys[i];
      var value = localStorage.getItem(ckey);
      let item : {[key: string]: any} = {};
      item[ckey] = JSON.parse(value || '{}');
      list.push(item);
    }
    return list;
  }
}

