import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartStore } from '../../../../../core/domains/shopping/store/cart.store';
import { CurrencyPenPipe } from '../../../../pipes/currency-pen.pipe';
import { Popover } from 'primeng/popover';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { NgOptimizedImage } from '@angular/common';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-navbar-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPenPipe, Popover, ButtonComponent, NgOptimizedImage],
  templateUrl: './navbar-cart.html',
  styleUrl: './navbar-cart.css'
})
export class NavbarCartComponent {
  cartStore = inject(CartStore);
  private router = inject(Router);

  itemCount = this.cartStore.itemCount;
  totalAmount = this.cartStore.totalAmount;

  ts = inject(TranslationService);
  t = this.ts.t;

  goToCheckout(op: any) {
    op.hide();
    this.router.navigate(['/checkout']);
  }
}
