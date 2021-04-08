jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { WishListService } from '../service/wish-list.service';
import { IWishList, WishList } from '../wish-list.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { WishListUpdateComponent } from './wish-list-update.component';

describe('Component Tests', () => {
  describe('WishList Management Update Component', () => {
    let comp: WishListUpdateComponent;
    let fixture: ComponentFixture<WishListUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let wishListService: WishListService;
    let customerService: CustomerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WishListUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(WishListUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WishListUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      wishListService = TestBed.inject(WishListService);
      customerService = TestBed.inject(CustomerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Customer query and add missing value', () => {
        const wishList: IWishList = { id: 456 };
        const customer: ICustomer = { id: 18489 };
        wishList.customer = customer;

        const customerCollection: ICustomer[] = [{ id: 40556 }];
        spyOn(customerService, 'query').and.returnValue(of(new HttpResponse({ body: customerCollection })));
        const additionalCustomers = [customer];
        const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
        spyOn(customerService, 'addCustomerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ wishList });
        comp.ngOnInit();

        expect(customerService.query).toHaveBeenCalled();
        expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
        expect(comp.customersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const wishList: IWishList = { id: 456 };
        const customer: ICustomer = { id: 74077 };
        wishList.customer = customer;

        activatedRoute.data = of({ wishList });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(wishList));
        expect(comp.customersSharedCollection).toContain(customer);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const wishList = { id: 123 };
        spyOn(wishListService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ wishList });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: wishList }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(wishListService.update).toHaveBeenCalledWith(wishList);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const wishList = new WishList();
        spyOn(wishListService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ wishList });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: wishList }));
        saveSubject.complete();

        // THEN
        expect(wishListService.create).toHaveBeenCalledWith(wishList);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const wishList = { id: 123 };
        spyOn(wishListService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ wishList });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(wishListService.update).toHaveBeenCalledWith(wishList);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCustomerById', () => {
        it('Should return tracked Customer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCustomerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
