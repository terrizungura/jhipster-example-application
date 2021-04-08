import * as dayjs from 'dayjs';
import { IWishList } from 'app/entities/wish-list/wish-list.model';
import { ICategory } from 'app/entities/category/category.model';

export interface IProduct {
  id?: number;
  title?: string;
  keywords?: string | null;
  description?: string | null;
  rating?: number | null;
  dateAdded?: dayjs.Dayjs | null;
  dateModified?: dayjs.Dayjs | null;
  wishLists?: IWishList[] | null;
  categories?: ICategory[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public title?: string,
    public keywords?: string | null,
    public description?: string | null,
    public rating?: number | null,
    public dateAdded?: dayjs.Dayjs | null,
    public dateModified?: dayjs.Dayjs | null,
    public wishLists?: IWishList[] | null,
    public categories?: ICategory[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
