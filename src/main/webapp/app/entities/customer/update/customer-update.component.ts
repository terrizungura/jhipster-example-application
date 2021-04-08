import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomer, Customer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IWishList } from 'app/entities/wish-list/wish-list.model';
import { WishListService } from 'app/entities/wish-list/service/wish-list.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;

  addressesSharedCollection: IAddress[] = [];
  wishListsSharedCollection: IWishList[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastNAme: [],
    email: [],
    telephone: [],
    address: [],
    wishList: [],
  });

  constructor(
    protected customerService: CustomerService,
    protected addressService: AddressService,
    protected wishListService: WishListService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.updateForm(customer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  trackWishListById(index: number, item: IWishList): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
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

  protected updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      firstName: customer.firstName,
      lastNAme: customer.lastNAme,
      email: customer.email,
      telephone: customer.telephone,
      address: customer.address,
      wishList: customer.wishList,
    });

    this.addressesSharedCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesSharedCollection, customer.address);
    this.wishListsSharedCollection = this.wishListService.addWishListToCollectionIfMissing(
      this.wishListsSharedCollection,
      customer.wishList
    );
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query()
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesSharedCollection = addresses));

    this.wishListService
      .query()
      .pipe(map((res: HttpResponse<IWishList[]>) => res.body ?? []))
      .pipe(
        map((wishLists: IWishList[]) =>
          this.wishListService.addWishListToCollectionIfMissing(wishLists, this.editForm.get('wishList')!.value)
        )
      )
      .subscribe((wishLists: IWishList[]) => (this.wishListsSharedCollection = wishLists));
  }

  protected createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastNAme: this.editForm.get(['lastNAme'])!.value,
      email: this.editForm.get(['email'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      address: this.editForm.get(['address'])!.value,
      wishList: this.editForm.get(['wishList'])!.value,
    };
  }
}
