import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';
import { ModalComponent } from '../../components/ui/modal/modal';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, ToastModule, AdminSidebarComponent, ModalComponent],
  providers: [MessageService],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent { }