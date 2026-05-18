import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { UserService } from '../../../../../core/services/user.service';
import { Address, CreateAddressRequest } from '../../../../../core/models/address.model';

@Component({
  selector: 'app-profile-addresses',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './profile-addresses.html',
  styleUrl: './profile-addresses.css'
})
export class ProfileAddressesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  addresses = signal<Address[]>([]);
  showForm = signal(false);
  saving = signal(false);

  content = {
    title: 'Mis direcciones',
    subtitle: 'Gestiona las direcciones de entrega de tus pedidos.',
    newBtnLabel: 'Nueva dirección',
    newBtnIcon: 'pi-plus',
    deleteTitle: 'Eliminar dirección',
    defaultChipLabel: 'Principal',
    emptyText: 'No tienes direcciones guardadas.',
    formTitle: 'Agregar nueva dirección',

    fields: {
      regionLabel: 'Región *',
      regionPlaceholder: 'Lima',
      districtLabel: 'Distrito *',
      districtPlaceholder: 'Miraflores',
      mainAddressLabel: 'Dirección principal *',
      mainAddressPlaceholder: 'Av. Larco 345, Dpto 201',
      referenceLabel: 'Referencia',
      referencePlaceholder: 'Frente al Wong',
      defaultCheckboxLabel: 'Establecer como dirección principal',
      errorRequired: 'Campo requerido'
    },

    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar dirección',
      saveIcon: 'pi-check'
    },

    alerts: {
      saveSuccess: 'Dirección agregada',
      saveError: 'Error al guardar la dirección',
      deleteSuccess: 'Dirección eliminada',
      deleteError: 'Error al eliminar'
    },
    confirmModal: {
      title: '¿Eliminar dirección?',
      severity: 'danger',
      confirmLabel: 'Sí, eliminar'
    }
  };

  form = this.fb.group({
    country: ['Perú', Validators.required],
    region: ['', Validators.required],
    district: ['', Validators.required],
    mainAddress: ['', Validators.required],
    reference: [''],
    isDefault: [false],
  });

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.userService.getAddresses().subscribe(a => this.addresses.set(a));
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.userService.addAddress(this.form.value as CreateAddressRequest).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.saveSuccess);
        this.showForm.set(false);
        this.saving.set(false);
        this.form.reset({ country: 'Perú', isDefault: false });
        this.loadAddresses();
      },
      error: () => {
        this.alertService.error(this.content.alerts.saveError);
        this.saving.set(false);
      },
    });
  }

  onDelete(addr: Address) {
    this.modalService.open({
      title: this.content.confirmModal.title,
      message: `"${addr.mainAddress}" será eliminada de tu cuenta.`,
      severity: this.content.confirmModal.severity as any,
      confirmLabel: this.content.confirmModal.confirmLabel,
      onConfirm: () => {
        this.userService.deleteAddress(addr.idAddress).subscribe({
          next: () => {
            this.alertService.success(this.content.alerts.deleteSuccess);
            this.loadAddresses();
          },
          error: () => this.alertService.error(this.content.alerts.deleteError),
        });
      },
    });
  }
}
