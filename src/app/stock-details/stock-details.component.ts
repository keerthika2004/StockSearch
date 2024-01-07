import { Component, OnInit, ChangeDetectorRef, AfterViewInit, Renderer2, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, Params, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { StockDetailsService } from './stock-details.service'
// import * as hc from 'highcharts';
import * as Highcharts from 'highcharts/highstock';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../loader.service';
import { StorageServiceService } from '../storage-service.service'
import { FormControl, FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
declare var require: any;
require('highcharts/indicators/indicators')(Highcharts);
var vbp = require('highcharts/indicators/volume-by-price');
vbp(Highcharts);


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {

  qtySelect = new FormControl();
  stockTicker = '';
  packet: any;
  comp_details: any;
  stock_price: any;
  peers: any;
  news: any;
  closeResult = '';
  priceVar: any [] = [];
  highcharts = Highcharts;
  chartOptions1: any;
  chartOptionsMain: any;
  chartOptionsRec: any;
  chartOptionsExp: any;
  rdt: any [] = [];
  twtr: any [] = [];
  localStorageChanges$ = this.localStorageService.changes$;
  totalPrice: number = 0;
  totalQty: number = 0;
  stockInPf: any;
  cwallet: any;
  display: boolean = true;
  watchlist: any = {};
  @ViewChild("stockData")
  stockData!: ElementRef;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private appService: StockDetailsService,
    private modalService: NgbModal,
    private _cdr: ChangeDetectorRef,
    public loaderService: LoaderService,
    private localStorageService: StorageServiceService,
  ) {
    this.route.params.subscribe((params: Params) => this.stockTicker = params['ticker']);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          
      }

      if (event instanceof NavigationEnd) {
          this.onSubmit();
      }
    });
  }

  ngOnInit(): void {
    this.cwallet = this.localStorageService.wallet;
  }

  clearDiv(val: any) {
    // this.display = false;
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  timeConverter(UNIX_timestamp: any){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + '-' + month + '-' +date + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  
  wishList(){
    console.log(this.stockTicker);
    console.log(this.stock_price);
    this.watchlist[this.stockTicker] = this.stock_price;
    this.localStorageService.set('watchlist', this.watchlist);
    console.log(this.localStorageService.get('watchlist'));
  }

  checkWishList(){
    let wl = this.localStorageService.get('watchlist');
    if (Object.keys(wl).length !== 0){
      if (wl[this.comp_details.ticker])
        return true
      else
        return false
    }
    return false
  }

  removeFromWishList(){
    delete this.watchlist[this.comp_details.ticker];
    this.localStorageService.set('watchlist', this.watchlist);
  }

  onBuy(){
    this.localStorageService.wallet -= this.totalPrice;
    if (Object.keys(this.localStorageService.getCurrentPortfolio(this.stockTicker)).length !== 0){
      let cdata = this.localStorageService.getCurrentPortfolio(this.stockTicker);
      cdata.quantity += this.totalQty;
      cdata.totalCost += this.totalPrice;
      cdata.avg_cost = cdata.totalCost/cdata.quantity;
      
    }
    else{
      let cdata = {
        quantity: this.totalQty,
        totalCost: this.totalPrice,
        avg_cost: this.totalPrice/this.totalQty
      };
      this.localStorageService.setPortfolio(this.stockTicker, cdata);
    }
    console.log(this.localStorageService.getPortfolio());
    this.modalService.dismissAll();
  }

  onSell(){

  }

  quantityChange(event: any){
    this.totalPrice = 0;
    this.totalQty = +event.target.value
    this.totalPrice = this.stock_price.c * this.totalQty;
  }

  onSubmit(){
    // this.display = true;
    this.packet = {
      'stockTicker': this.stockTicker
    }

    // timer(0, 15000).subscribe(() =>{
      this.appService.getCompany(this.packet).subscribe((response: any) => {
        this.comp_details = response;
      });
    // })
    

    this.appService.getHistory(this.packet).subscribe((response: any) => {
      function convertTime(time: any){
        let unix_timestamp = time;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var formattedTime = hours + ':' + minutes.substr(-2);
        return formattedTime;
      }
      let times = response.t;
      let prices = response.o;
      this.priceVar = [];
      for (let i=0; i<times.length; i++){
        let ct = convertTime(times[i]);
        this.priceVar.push([ct, prices[i]]);
      }
      this.chartOptions1 = {
        title: {
          text: this.stockTicker+" Hourly Price Variation"
        },
        yAxis: {
          opposite: true
        },
        legend:{
          enabled: false
        },
        series: [{
          data: this.priceVar,
          type: 'line'
        }]
      }
    });

    this.appService.getChartsHistory(this.packet).subscribe((response: any) => {
      let ohlc = [], volume = [], dlen = response.o.length;
      
      let groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
      ], [
        'month',
        [1, 2, 3, 4, 6]
      ]]

      for (let i=0; i<dlen; i++){
        ohlc.push([response.t[i],
            response.o[i],
            response.h[i],
            response.l[i],
            response.c[i]
        ]);

        volume.push([response.t[i], response.v[i]]);

      }
      console.log(volume);
      this.chartOptionsMain = {
        rangeSelector: {
          selected: 2
      },

      title: {
          text: this.stockTicker+'Historical'
      },

      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          // height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          }
      }, {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          // height: '35%',
          offset: 0,
          lineWidth: 2
      }],

      tooltip: {
          split: true
      },

      plotOptions: {
          series: {
              dataGrouping: {
                  units: groupingUnits
              }
          }
      },

      series: [{
          type: 'candlestick',
          name: 'AAPL',
          id: 'aapl',
          zIndex: 2,
          data: ohlc
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: 'aapl',
          params: {
              volumeSeriesID: 'volume'
          },
          dataLabels: {
              enabled: false
          },
          zoneLines: {
              enabled: false
          }
      }, {
          type: 'sma',
          linkedTo: 'aapl',
          zIndex: 1,
          marker: {
              enabled: false
          }
      }]
      }

    });

    this.appService.getStockPrice(this.packet).subscribe((response: any) => {
      this.stock_price = response;
      this.stock_price.t = this.timeConverter(response.t);
    });

    this.appService.getNews(this.packet).subscribe((response: any) => {
      let allNews = response;
      let count = 1;
      let n = [];
      for (let i=0; i < allNews.length; i++){
        if (count > 20)
          break;
        if  (allNews[i].source !== '' && allNews[i].headline !== '' && allNews[i].image !== '' && allNews[i].summary !== '' && allNews[i].url !== ''){
          let date = allNews[i].datetime;
          date = new Date(date*1000);
          let longMonth = date.toLocaleString('en-us', { month: 'long' });
          let year = date.getFullYear().toString();
          let day = date.getDate().toString();
          allNews[i].datetime = longMonth+' '+day+', '+year;
          n.push(allNews[i]);
          count += 1
        }
      }
      this.news = n;
    });

    this.appService.getRecs(this.packet).subscribe((response: any) => {
      // console.log(response);
      let data = [], sb = [], b = [], h = [], se = [], ss = [];
      for (let i=0; i<response.length; i++){
        data.push(response[i].period);
        sb.push(response[i].strongBuy);
        b.push(response[i].buy);
        h.push(response[i].hold);
        se.push(response[i].sell);
        ss.push(response[i].strongSell);

      }
      

      this.chartOptionsRec = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Recommendation Trends'
        },
        xAxis: {
          categories: data
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Analysis'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title?.style &&
                        Highcharts.defaultOptions.title?.style.color
                    ) || 'gray'
                }
            }
        },
        legend: {
            align: 'center',
            // x: -30,
            verticalAlign: 'bottom',
            // y: 25,
            // floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend?.backgroundColor || 'white',
            borderColor: '#CCC',
            // borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: "Strong Buy",
            data: sb
        }, {
            name: "Buy",
            data: b
        }, {
            name: "Hold",
            data: h
        }, {
            name: "Sell",
            data: se
        }, {
            name: "Strong Sell",
            data: ss
        }]
      }

    });

    this.appService.getSocial(this.packet).subscribe((response: any) => {
      let reddit = response.reddit;
      let twitter = response.twitter;
      let rdTot = 0, rdPos = 0, rdNeg = 0, twTot = 0, twPos = 0, twNeg = 0;
      for (let i = 0; i<reddit.length; i++){
        rdTot += reddit[i].mention;
        rdPos += reddit[i].positiveMention;
        rdNeg += reddit[i].negativeMention;
      }
      for (let i = 0; i<twitter.length; i++){
        twTot += twitter[i].mention;
        twPos += twitter[i].positiveMention;
        twNeg += twitter[i].negativeMention;
      }
      this.rdt.push(rdTot, rdPos, rdNeg);
      this.twtr.push(twTot, twPos, twNeg);

    });

    this.appService.getPeers(this.packet).subscribe((response: any) => {
      this.peers = response;
    });

    this.appService.getEarnings(this.packet).subscribe((response: any) => {
      let actual = [], exp = [], dates = [];
      for (let i=0; i<response.length; i++){
        dates.push(response[i].period);
        if (response[i].actual != null){
          actual.push([response[i].period, response[i].actual]);
        }
        else{
          actual.push([response[i].period, 0])
        }
        exp.push([response[i].period, response[i].estimate]);
      
      }
      console.log(actual);
      this.chartOptionsExp = {
        chart: {
          type: 'spline',
        },
        title: {
            text: 'Historical EPS Surprises'
        },

        xAxis: {
            categories: dates
        },
        yAxis: {
            title: {
                text: 'Quarterly EPS'
            },
            // labels: {
            //     format: '{value}°'
            // },
            // accessibility: {
            //     rangeDescription: 'Range: -90°C to 20°C.'
            // },
            lineWidth: 2
        },
        legend: {
            enabled: true
        },
        tooltip: {
            shared: true,
            headerFormat: '<b>{series.name}</b><br/>',
            // pointFormat: 'Actual: {point.y} <br/>Estimate: {point.y}'
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            name: 'Actual',
            data: actual
        }, {
            name: 'Estimate',
            data: exp
        }]
      }

    });

    // interval(15*1000).pipe(mergeMap(() => this.appService.getCompany(this.packet))).subscribe((response: any) => {
    //   this.comp_details = response;
    //   console.log(this.comp_details);
    //   this._cdr.detectChanges()
    // });

    // interval(15*1000).pipe(mergeMap(() => this.appService.getStockPrice(this.packet))).subscribe((response: any) => {
    //   this.stock_price = response;
    //   this.stock_price.t = this.timeConverter(response.t);
    //   // console.log(this.stock_price);
    //   this._cdr.detectChanges()
    // });
  }

}
