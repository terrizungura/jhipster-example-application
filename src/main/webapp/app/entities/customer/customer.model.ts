import { IAddress } from 'app/entities/address/address.model';
import { IWishList } from 'app/entities/wish-list/wish-list.model';

export interface ICustomer {
  id?: number;
  firstName?: string | null;
  lastNAme?: string | null;
  email?: string | null;
  telephone?: string | null;
  firstNames?: IAddress[] | null;
  firstNames?: IWishList[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastNAme?: string | null,
    public email?: string | null,
    public telephone?: string | null,
    public firstNames?: IAddress[] | null,
    public firstNames?: IWishList[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
