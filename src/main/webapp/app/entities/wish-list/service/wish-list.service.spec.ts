import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWishList, WishList } from '../wish-list.model';

import { WishListService } from './wish-list.service';

describe('Service Tests', () => {
  describe('WishList Service', () => {
    let service: WishListService;
    let httpMock: HttpTestingController;
    let elemDefault: IWishList;
    let expectedResult: IWishList | IWishList[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(WishListService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        title: 'AAAAAAA',
        restricted: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a WishList', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new WishList()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a WishList', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            restricted: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a WishList', () => {
        const patchObject = Object.assign(
          {
            restricted: true,
          },
          new WishList()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of WishList', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            restricted: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a WishList', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addWishListToCollectionIfMissing', () => {
        it('should add a WishList to an empty array', () => {
          const wishList: IWishList = { id: 123 };
          expectedResult = service.addWishListToCollectionIfMissing([], wishList);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(wishList);
        });

        it('should not add a WishList to an array that contains it', () => {
          const wishList: IWishList = { id: 123 };
          const wishListCollection: IWishList[] = [
            {
              ...wishList,
            },
            { id: 456 },
          ];
          expectedResult = service.addWishListToCollectionIfMissing(wishListCollection, wishList);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a WishList to an array that doesn't contain it", () => {
          const wishList: IWishList = { id: 123 };
          const wishListCollection: IWishList[] = [{ id: 456 }];
          expectedResult = service.addWishListToCollectionIfMissing(wishListCollection, wishList);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(wishList);
        });

        it('should add only unique WishList to an array', () => {
          const wishListArray: IWishList[] = [{ id: 123 }, { id: 456 }, { id: 18041 }];
          const wishListCollection: IWishList[] = [{ id: 123 }];
          expectedResult = service.addWishListToCollectionIfMissing(wishListCollection, ...wishListArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const wishList: IWishList = { id: 123 };
          const wishList2: IWishList = { id: 456 };
          expectedResult = service.addWishListToCollectionIfMissing([], wishList, wishList2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(wishList);
          expect(expectedResult).toContain(wishList2);
        });

        it('should accept null and undefined values', () => {
          const wishList: IWishList = { id: 123 };
          expectedResult = service.addWishListToCollectionIfMissing([], null, wishList, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(wishList);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
