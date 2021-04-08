import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { WishListComponent } from './list/wish-list.component';
import { WishListDetailComponent } from './detail/wish-list-detail.component';
import { WishListUpdateComponent } from './update/wish-list-update.component';
import { WishListDeleteDialogComponent } from './delete/wish-list-delete-dialog.component';
import { WishListRoutingModule } from './route/wish-list-routing.module';

@NgModule({
  imports: [SharedModule, WishListRoutingModule],
  declarations: [WishListComponent, WishListDetailComponent, WishListUpdateComponent, WishListDeleteDialogComponent],
  entryComponents: [WishListDeleteDialogComponent],
})
export class WishListModule {}
