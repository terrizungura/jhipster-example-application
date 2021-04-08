import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWishList, WishList } from '../wish-list.model';
import { WishListService } from '../service/wish-list.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-wish-list-update',
  templateUrl: './wish-list-update.component.html',
})
export class WishListUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    restricted: [],
    product: [],
  });

  constructor(
    protected wishListService: WishListService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wishList }) => {
      this.updateForm(wishList);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const wishList = this.createFromForm();
    if (wishList.id !== undefined) {
      this.subscribeToSaveResponse(this.wishListService.update(wishList));
    } else {
      this.subscribeToSaveResponse(this.wishListService.create(wishList));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWishList>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(wishList: IWishList): void {
    this.editForm.patchValue({
      id: wishList.id,
      title: wishList.title,
      restricted: wishList.restricted,
      product: wishList.product,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, wishList.product);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IWishList {
    return {
      ...new WishList(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      restricted: this.editForm.get(['restricted'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
