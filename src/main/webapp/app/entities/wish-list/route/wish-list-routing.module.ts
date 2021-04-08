import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WishListComponent } from '../list/wish-list.component';
import { WishListDetailComponent } from '../detail/wish-list-detail.component';
import { WishListUpdateComponent } from '../update/wish-list-update.component';
import { WishListRoutingResolveService } from './wish-list-routing-resolve.service';

const wishListRoute: Routes = [
  {
    path: '',
    component: WishListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WishListDetailComponent,
    resolve: {
      wishList: WishListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WishListUpdateComponent,
    resolve: {
      wishList: WishListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WishListUpdateComponent,
    resolve: {
      wishList: WishListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(wishListRoute)],
  exports: [RouterModule],
})
export class WishListRoutingModule {}
