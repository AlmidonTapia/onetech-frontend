import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';
import { ModalComponent } from '../../components/ui/modal/modal';
import { AddToCartModalComponent } from '../../components/ui/add-to-cart-modal/add-to-cart-modal';

@Component({
  selector: 'app-shop-layout',
  standalone: true,
  imports: [RouterOutlet, ToastModule, NavbarComponent, FooterComponent, ModalComponent, AddToCartModalComponent],
  providers: [MessageService],
  templateUrl: './shop-layout.html',
  host: {
    'class': 'flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-300'
  }
})
export class ShopLayoutComponent { }