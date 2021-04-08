import { IProduct } from 'app/entities/product/product.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface IWishList {
  id?: number;
  title?: string | null;
  restricted?: boolean | null;
  titles?: IProduct[] | null;
  customer?: ICustomer | null;
}

export class WishList implements IWishList {
  constructor(
    public id?: number,
    public title?: string | null,
    public restricted?: boolean | null,
    public titles?: IProduct[] | null,
    public customer?: ICustomer | null
  ) {
    this.restricted = this.restricted ?? false;
  }
}

export function getWishListIdentifier(wishList: IWishList): number | undefined {
  return wishList.id;
}
