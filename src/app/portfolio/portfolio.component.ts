import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../storage-service.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  wallet: any = 25000;
  stocks: any = [];
  keys: any = [];
  
  constructor(
    private localStorageService: StorageServiceService
  ) { }

  ngOnInit(): void {
    let items = this.localStorageService.getPortfolio();
    if (items?.length ){
      for(let i=0;i<items.length;i++){
        let ckey = Object.keys(items[i]);
        this.keys.push(ckey[0]);
        this.stocks.push(this.localStorageService.getCurrentPortfolio(ckey[0]));
      }
    }
  }

  onSell(index: any){
    
  }

}
