import { Component, Output, EventEmitter, signal, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../../../../core/domains/identity/services/auth.service';
import { UserService } from '../../../../../core/domains/identity/services/user.service';

export interface ConsigneeInfo {
  isSelf: boolean;
  fullName: string;
  docNumber: string;
  phone: string;
}

import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-checkout-consignee',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ToggleSwitchModule, CheckboxModule],
  templateUrl: './checkout-consignee.html',
  styleUrl: './checkout-consignee.css'
})
export class CheckoutConsigneeComponent implements OnInit {
  @Output() selected = new EventEmitter<ConsigneeInfo | null>();

  isSelf = signal(true);
  fullName = signal('');
  docNumber = signal('');
  phone = signal('');
  acceptedPolicies = signal(false);
  private initialized = false;
  
  ts = inject(TranslationService);
  t = this.ts.t;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    effect(() => {
      if (this.initialized) {
        this.emitChange();
      }
    });
  }

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    const user = this.authService.currentUser();
    if (user) {
      this.fullName.set(user.firstName + ' ' + user.lastName);
      
      this.userService.getProfile().subscribe({
        next: (profile) => {
          if (profile.documentNumber) this.docNumber.set(profile.documentNumber);
          if (profile.phone) this.phone.set(profile.phone);
          this.initialized = true;
          this.emitChange();
        },
        error: () => {
          this.initialized = true;
          this.emitChange();
        }
      });
    } else {
      this.initialized = true;
      this.emitChange();
    }
  }

  onToggleChange(value: boolean) {
    this.isSelf.set(value);
    if (!value) {
      this.fullName.set('');
      this.docNumber.set('');
      this.phone.set('');
    } else {
      this.loadProfileData();
    }
    this.emitChange();
  }

  emitChange() {
    const name = this.fullName().trim();
    const doc = this.docNumber().trim();
    const phone = this.phone().trim();

    const DNI_REGEX = /^\d{8}$|^\d{9,12}$/;
    const PHONE_REGEX = /^[9]\d{8}$/;

    const isValid = 
      name.length >= 3 &&
      DNI_REGEX.test(doc) &&
      PHONE_REGEX.test(phone) &&
      this.acceptedPolicies();
                    
    if (isValid) {
      this.selected.emit({
        isSelf: this.isSelf(),
        fullName: name,
        docNumber: doc,
        phone: phone
      });
    } else {
      this.selected.emit(null);
    }
  }
}
