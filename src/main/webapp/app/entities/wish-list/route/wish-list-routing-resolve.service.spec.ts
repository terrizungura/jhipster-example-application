jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IWishList, WishList } from '../wish-list.model';
import { WishListService } from '../service/wish-list.service';

import { WishListRoutingResolveService } from './wish-list-routing-resolve.service';

describe('Service Tests', () => {
  describe('WishList routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: WishListRoutingResolveService;
    let service: WishListService;
    let resultWishList: IWishList | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(WishListRoutingResolveService);
      service = TestBed.inject(WishListService);
      resultWishList = undefined;
    });

    describe('resolve', () => {
      it('should return IWishList returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWishList = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWishList).toEqual({ id: 123 });
      });

      it('should return new IWishList if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWishList = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultWishList).toEqual(new WishList());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultWishList = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultWishList).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
