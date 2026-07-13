import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { UserService } from '../../../../../core/domains/identity/services/user.service';
import { Address, CreateAddressRequest } from '../../../../../core/domains/shipping/models/address.model';
import { AddressListComponent } from './components/address-list/address-list';
import { AddressFormComponent } from './components/address-form/address-form';

@Component({
  selector: 'app-profile-addresses',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AddressListComponent, AddressFormComponent],
  templateUrl: './profile-addresses.html',
  styleUrl: './profile-addresses.css'
})
export class ProfileAddressesComponent implements OnInit {
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
      departmentLabel: 'Departamento *',
      departmentPlaceholder: 'Seleccione Departamento',
      provinceLabel: 'Provincia *',
      provincePlaceholder: 'Seleccione Provincia',
      districtLabel: 'Distrito *',
      districtPlaceholder: 'Seleccione Distrito',
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

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.userService.getAddresses().subscribe(a => this.addresses.set(a));
  }

  onSave(requestData: CreateAddressRequest) {
    this.saving.set(true);
    this.userService.addAddress(requestData).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.saveSuccess);
        this.showForm.set(false);
        this.saving.set(false);
        this.loadAddresses();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.content.alerts.saveError);
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
          error: (err: any) => this.alertService.error(err?.error?.message || this.content.alerts.deleteError),
        });
      },
    });
  }
}
