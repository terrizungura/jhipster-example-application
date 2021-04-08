import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WishListDetailComponent } from './wish-list-detail.component';

describe('Component Tests', () => {
  describe('WishList Management Detail Component', () => {
    let comp: WishListDetailComponent;
    let fixture: ComponentFixture<WishListDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [WishListDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ wishList: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(WishListDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WishListDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load wishList on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.wishList).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
