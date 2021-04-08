import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IWishList } from '../wish-list.model';
import { WishListService } from '../service/wish-list.service';
import { WishListDeleteDialogComponent } from '../delete/wish-list-delete-dialog.component';

@Component({
  selector: 'jhi-wish-list',
  templateUrl: './wish-list.component.html',
})
export class WishListComponent implements OnInit {
  wishLists?: IWishList[];
  isLoading = false;

  constructor(protected wishListService: WishListService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.wishListService.query().subscribe(
      (res: HttpResponse<IWishList[]>) => {
        this.isLoading = false;
        this.wishLists = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IWishList): number {
    return item.id!;
  }

  delete(wishList: IWishList): void {
    const modalRef = this.modalService.open(WishListDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.wishList = wishList;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
