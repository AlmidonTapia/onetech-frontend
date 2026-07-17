import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { UserService } from '../../../core/domains/identity/services/user.service';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { User, UpdateProfileRequest } from '../../../core/domains/identity/models/user.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, PasswordModule, ButtonComponent],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  authService = inject(AuthService);
  ts = inject(TranslationService);
  t = this.ts.t;

  saving = signal(false);
  savingPassword = signal(false);
  loading = signal(true);
  activeTab = signal<'info' | 'security'>('info');

  get content() {
    return this.t().adminProfile;
  }

  readonly docTypes = [
    { label: 'DNI', value: 'DNI' },
    { label: 'Pasaporte', value: 'PASAPORTE' },
    { label: 'CE', value: 'CE' },
  ];

  profileForm = this.fb.group({
    firstName: [{ value: '', disabled: true }],
    lastName: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }],
    documentType: [''],
    documentNumber: [''],
    phone: ['', [Validators.pattern(/^\d{9}$/)]],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordsMatch });

  passwordsMatch(ctrl: AbstractControl) {
    const np = ctrl.get('newPassword')?.value;
    const cp = ctrl.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          documentType: user.documentType ?? '',
          documentNumber: user.documentNumber ?? '',
          phone: user.phone ?? '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isInvalid(form: 'profile' | 'password', field: string): boolean {
    const control = form === 'profile' ? this.profileForm.get(field) : this.passwordForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  get userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'AD';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  }

  get userName(): string {
    const user = this.authService.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'Admin';
  }

  get userEmail(): string {
    const user = this.authService.currentUser();
    return user?.email ?? '';
  }

  onSaveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const data: UpdateProfileRequest = {
      documentType: this.profileForm.value.documentType ?? '',
      documentNumber: this.profileForm.value.documentNumber ?? '',
      phone: this.profileForm.value.phone ?? '',
    };

    this.userService.updateProfileDetails(data).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.profileSuccess);
        this.saving.set(false);
      },
      error: () => {
        this.alertService.error(this.content.alerts.profileError);
        this.saving.set(false);
      },
    });
  }

  onSavePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.savingPassword.set(true);
    this.http.post(`${environment.apiUrl}/users/profile/password`, {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
    }).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.passwordSuccess);
        this.passwordForm.reset();
        this.savingPassword.set(false);
      },
      error: () => {
        this.alertService.error(this.content.alerts.passwordError, this.content.alerts.passwordErrorMsg);
        this.savingPassword.set(false);
      },
    });
  }
}
