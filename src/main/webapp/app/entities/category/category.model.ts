import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { CategoryStatus } from 'app/entities/enumerations/category-status.model';

export interface ICategory {
  id?: number;
  welcome?: string;
  description?: string;
  sortOrder?: number | null;
  dateAdded?: dayjs.Dayjs | null;
  dateModified?: dayjs.Dayjs | null;
  status?: CategoryStatus | null;
  product?: IProduct | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public welcome?: string,
    public description?: string,
    public sortOrder?: number | null,
    public dateAdded?: dayjs.Dayjs | null,
    public dateModified?: dayjs.Dayjs | null,
    public status?: CategoryStatus | null,
    public product?: IProduct | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
