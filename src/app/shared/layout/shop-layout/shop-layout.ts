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
  styleUrl: './shop-layout.css'
})
export class ShopLayoutComponent { }