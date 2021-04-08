import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWishList, getWishListIdentifier } from '../wish-list.model';

export type EntityResponseType = HttpResponse<IWishList>;
export type EntityArrayResponseType = HttpResponse<IWishList[]>;

@Injectable({ providedIn: 'root' })
export class WishListService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/wish-lists');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(wishList: IWishList): Observable<EntityResponseType> {
    return this.http.post<IWishList>(this.resourceUrl, wishList, { observe: 'response' });
  }

  update(wishList: IWishList): Observable<EntityResponseType> {
    return this.http.put<IWishList>(`${this.resourceUrl}/${getWishListIdentifier(wishList) as number}`, wishList, { observe: 'response' });
  }

  partialUpdate(wishList: IWishList): Observable<EntityResponseType> {
    return this.http.patch<IWishList>(`${this.resourceUrl}/${getWishListIdentifier(wishList) as number}`, wishList, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWishList>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWishList[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addWishListToCollectionIfMissing(wishListCollection: IWishList[], ...wishListsToCheck: (IWishList | null | undefined)[]): IWishList[] {
    const wishLists: IWishList[] = wishListsToCheck.filter(isPresent);
    if (wishLists.length > 0) {
      const wishListCollectionIdentifiers = wishListCollection.map(wishListItem => getWishListIdentifier(wishListItem)!);
      const wishListsToAdd = wishLists.filter(wishListItem => {
        const wishListIdentifier = getWishListIdentifier(wishListItem);
        if (wishListIdentifier == null || wishListCollectionIdentifiers.includes(wishListIdentifier)) {
          return false;
        }
        wishListCollectionIdentifiers.push(wishListIdentifier);
        return true;
      });
      return [...wishListsToAdd, ...wishListCollection];
    }
    return wishListCollection;
  }
}
