jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CustomerService } from '../service/customer.service';
import { ICustomer, Customer } from '../customer.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IWishList } from 'app/entities/wish-list/wish-list.model';
import { WishListService } from 'app/entities/wish-list/service/wish-list.service';

import { CustomerUpdateComponent } from './customer-update.component';

describe('Component Tests', () => {
  describe('Customer Management Update Component', () => {
    let comp: CustomerUpdateComponent;
    let fixture: ComponentFixture<CustomerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let customerService: CustomerService;
    let addressService: AddressService;
    let wishListService: WishListService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CustomerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CustomerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CustomerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      customerService = TestBed.inject(CustomerService);
      addressService = TestBed.inject(AddressService);
      wishListService = TestBed.inject(WishListService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Address query and add missing value', () => {
        const customer: ICustomer = { id: 456 };
        const address: IAddress = { id: 23508 };
        customer.address = address;

        const addressCollection: IAddress[] = [{ id: 37724 }];
        spyOn(addressService, 'query').and.returnValue(of(new HttpResponse({ body: addressCollection })));
        const additionalAddresses = [address];
        const expectedCollection: IAddress[] = [...additionalAddresses, ...addressCollection];
        spyOn(addressService, 'addAddressToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, ...additionalAddresses);
        expect(comp.addressesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call WishList query and add missing value', () => {
        const customer: ICustomer = { id: 456 };
        const wishList: IWishList = { id: 58888 };
        customer.wishList = wishList;

        const wishListCollection: IWishList[] = [{ id: 95393 }];
        spyOn(wishListService, 'query').and.returnValue(of(new HttpResponse({ body: wishListCollection })));
        const additionalWishLists = [wishList];
        const expectedCollection: IWishList[] = [...additionalWishLists, ...wishListCollection];
        spyOn(wishListService, 'addWishListToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(wishListService.query).toHaveBeenCalled();
        expect(wishListService.addWishListToCollectionIfMissing).toHaveBeenCalledWith(wishListCollection, ...additionalWishLists);
        expect(comp.wishListsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const customer: ICustomer = { id: 456 };
        const address: IAddress = { id: 48290 };
        customer.address = address;
        const wishList: IWishList = { id: 38180 };
        customer.wishList = wishList;

        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(customer));
        expect(comp.addressesSharedCollection).toContain(address);
        expect(comp.wishListsSharedCollection).toContain(wishList);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const customer = { id: 123 };
        spyOn(customerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: customer }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(customerService.update).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const customer = new Customer();
        spyOn(customerService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: customer }));
        saveSubject.complete();

        // THEN
        expect(customerService.create).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const customer = { id: 123 };
        spyOn(customerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ customer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(customerService.update).toHaveBeenCalledWith(customer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAddressById', () => {
        it('Should return tracked Address primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAddressById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackWishListById', () => {
        it('Should return tracked WishList primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackWishListById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
