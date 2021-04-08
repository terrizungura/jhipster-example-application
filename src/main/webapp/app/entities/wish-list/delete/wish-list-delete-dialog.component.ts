import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWishList } from '../wish-list.model';
import { WishListService } from '../service/wish-list.service';

@Component({
  templateUrl: './wish-list-delete-dialog.component.html',
})
export class WishListDeleteDialogComponent {
  wishList?: IWishList;

  constructor(protected wishListService: WishListService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.wishListService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
