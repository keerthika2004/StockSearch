import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../storage-service.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  localStorageChanges$ = this.localStorageService.changes$;
  stocks: any = [];
  keys: any = [];
  constructor(
    private localStorageService: StorageServiceService
  ) { }

  ngOnInit(): void {
    let items = this.localStorageService.get('watchlist');
    // if (items?.length ){
    //   for(let i=0;i<items.length;i++){
    //     let ckey = Object.keys(items[i]);
    //     this.keys.push(ckey[0]);
    //     this.stocks.push(this.localStorageService.get(ckey[0]));
    //   }
    // }
    for(let item in items){
      this.keys.push(item);
      this.stocks.push(items[item]);
    }
    
    // this.keys = Object.keys(Object.keys(this.items));
    // console.log(this.keys);
    // console.log(this.items[0]);

  }

  onClear(key: any){
    this.keys = [];
    this.stocks = [];
    let items = this.localStorageService.get('watchlist');

    // if(items?.length){
    //   let rkey = Object.keys(items[index]);
    //   this.localStorageService.remove(rkey[0]);
    //   items = this.localStorageService.getAll();
    // }

    // if (items?.length ){
    //   for(let i=0;i<items.length;i++){
    //     let ckey = Object.keys(items[i]);
    //     this.keys.push(ckey[0]);
    //     this.stocks.push(this.localStorageService.get(ckey[0]));
    //   }
    // }

    delete items[key];
    for(let item in items){
      this.keys.push(item);
      this.stocks.push(items[item]);
    }
  }

}
