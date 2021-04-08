import { ICustomer } from 'app/entities/customer/customer.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IWishList {
  id?: number;
  title?: string | null;
  restricted?: boolean | null;
  customers?: ICustomer[] | null;
  product?: IProduct | null;
}

export class WishList implements IWishList {
  constructor(
    public id?: number,
    public title?: string | null,
    public restricted?: boolean | null,
    public customers?: ICustomer[] | null,
    public product?: IProduct | null
  ) {
    this.restricted = this.restricted ?? false;
  }
}

export function getWishListIdentifier(wishList: IWishList): number | undefined {
  return wishList.id;
}
