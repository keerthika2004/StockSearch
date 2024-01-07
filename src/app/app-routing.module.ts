import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { StocksearchComponent } from './stocksearch/stocksearch.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [{path: '', redirectTo: 'search/home', pathMatch: 'full'},
{ path: 'search/home', component: StocksearchComponent },
{ path: 'search/:ticker', component: StockDetailsComponent },
{ path: 'watchlist', component: WishlistComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
