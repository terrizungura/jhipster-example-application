import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WishListService } from '../service/wish-list.service';

import { WishListComponent } from './wish-list.component';

describe('Component Tests', () => {
  describe('WishList Management Component', () => {
    let comp: WishListComponent;
    let fixture: ComponentFixture<WishListComponent>;
    let service: WishListService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [WishListComponent],
      })
        .overrideTemplate(WishListComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WishListComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(WishListService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.wishLists?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
