import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IWishList, WishList } from '../wish-list.model';
import { WishListService } from '../service/wish-list.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

@Component({
  selector: 'jhi-wish-list-update',
  templateUrl: './wish-list-update.component.html',
})
export class WishListUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    restricted: [],
    customer: [],
  });

  constructor(
    protected wishListService: WishListService,
    protected customerService: CustomerService,
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

  trackCustomerById(index: number, item: ICustomer): number {
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
      customer: wishList.customer,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(
      this.customersSharedCollection,
      wishList.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }

  protected createFromForm(): IWishList {
    return {
      ...new WishList(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      restricted: this.editForm.get(['restricted'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }
}
