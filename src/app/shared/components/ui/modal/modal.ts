import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../button/button';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DialogModule, ButtonComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalComponent {
  modalService = inject(ModalService);
}