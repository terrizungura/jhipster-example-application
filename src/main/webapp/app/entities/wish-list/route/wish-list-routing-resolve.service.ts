import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWishList, WishList } from '../wish-list.model';
import { WishListService } from '../service/wish-list.service';

@Injectable({ providedIn: 'root' })
export class WishListRoutingResolveService implements Resolve<IWishList> {
  constructor(protected service: WishListService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWishList> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((wishList: HttpResponse<WishList>) => {
          if (wishList.body) {
            return of(wishList.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WishList());
  }
}
