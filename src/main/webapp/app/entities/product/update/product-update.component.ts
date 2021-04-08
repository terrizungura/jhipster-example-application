import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { IWishList } from 'app/entities/wish-list/wish-list.model';
import { WishListService } from 'app/entities/wish-list/service/wish-list.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  wishListsSharedCollection: IWishList[] = [];
  categoriesSharedCollection: ICategory[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    keywords: [],
    description: [],
    rating: [],
    dateAdded: [],
    dateModified: [],
    wishList: [],
    category: [],
  });

  constructor(
    protected productService: ProductService,
    protected wishListService: WishListService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackWishListById(index: number, item: IWishList): number {
    return item.id!;
  }

  trackCategoryById(index: number, item: ICategory): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      title: product.title,
      keywords: product.keywords,
      description: product.description,
      rating: product.rating,
      dateAdded: product.dateAdded,
      dateModified: product.dateModified,
      wishList: product.wishList,
      category: product.category,
    });

    this.wishListsSharedCollection = this.wishListService.addWishListToCollectionIfMissing(
      this.wishListsSharedCollection,
      product.wishList
    );
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      product.category
    );
  }

  protected loadRelationshipsOptions(): void {
    this.wishListService
      .query()
      .pipe(map((res: HttpResponse<IWishList[]>) => res.body ?? []))
      .pipe(
        map((wishLists: IWishList[]) =>
          this.wishListService.addWishListToCollectionIfMissing(wishLists, this.editForm.get('wishList')!.value)
        )
      )
      .subscribe((wishLists: IWishList[]) => (this.wishListsSharedCollection = wishLists));

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      keywords: this.editForm.get(['keywords'])!.value,
      description: this.editForm.get(['description'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      dateAdded: this.editForm.get(['dateAdded'])!.value,
      dateModified: this.editForm.get(['dateModified'])!.value,
      wishList: this.editForm.get(['wishList'])!.value,
      category: this.editForm.get(['category'])!.value,
    };
  }
}
