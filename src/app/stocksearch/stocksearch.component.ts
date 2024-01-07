import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchService } from './stocksearch.service';
// import { startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
// import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, map, startWith } from 'rxjs/operators';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stocksearch',
  templateUrl: './stocksearch.component.html',
  styleUrls: ['./stocksearch.component.css']
})
export class StocksearchComponent implements OnInit {

  searchBox = new FormControl();
  options : string [] = [];
  comp_name: string[] = [];
  ticker = '';
  searchValue : string = '';
  filteredOptions: any;
  alertEmpty: boolean = false;
  alertNoData: boolean = false;
  constructor(
    private appService: SearchService,
    private router: Router
  ) { }

  @Input() set ticker1(tic:string){
    this.userForm.setValue({
      stockTicker: tic,
    });
    this.searchValue = tic;
  }

  @Output() newItemEvent = new EventEmitter<string>();

  userForm = new FormGroup({
    stockTicker: new FormControl('', Validators.required),
  });
 
  ngOnInit() {
    this.userForm.get('stockTicker')!.valueChanges.subscribe(resp => {
      this.options = [];
      if (resp.length !== 0){
        this.appService.getAutoComplete(resp).subscribe((response: any) => {
          let res = [] as any;
          res = response.result;
          this.options = [];
          this.comp_name = [];
          for (let i = 0; i < res.length; i++){
            if (res[i]['type'] === "Common Stock"){
              let cv = res[i]['displaySymbol'];
              if (typeof cv === 'string' && !cv.includes('.')){
                this.options.push(cv);
                this.comp_name.push(res[i]['description']);
              }
            }
          }
        })
      }
    })
  }



  clearSearch(){
    this.searchValue = '';
    this.newItemEvent.emit('');
  }

  
  onSubmit() {
    if (this.userForm.value.stockTicker !== ''){
      this.appService.getCompany(this.userForm.value).subscribe((response: any) => {
        if (Object.keys(response).length !== 0){
          this.ticker = this.userForm.value['stockTicker'];
          this.router.navigate(['search', this.ticker]);
        }
        else{
          this.alertNoData = true;
          this.alertEmpty = false;
        }
      });
    }
    else{
      this.alertEmpty = true;
      this.alertNoData = false;
    }
  }
}
