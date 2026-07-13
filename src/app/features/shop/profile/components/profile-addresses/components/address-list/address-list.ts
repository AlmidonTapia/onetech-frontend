import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address } from '../../../../../../../core/domains/shipping/models/address.model';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address-list.html',
  styleUrl: './address-list.css'
})
export class AddressListComponent {
  addresses = input.required<Address[]>();
  content = input.required<any>();
  
  onDelete = output<Address>();

  deleteAddress(addr: Address) {
    this.onDelete.emit(addr);
  }
}
