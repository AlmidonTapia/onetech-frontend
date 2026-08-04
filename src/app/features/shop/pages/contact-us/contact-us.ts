import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { StoreConfigService } from '../../../../shared/services/store-config.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputTextModule,
    TextareaModule,
    SelectModule
  ],
  templateUrl: './contact-us.html'
})
export class ContactUsComponent {
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private http = inject(HttpClient);
  private storeConfigService = inject(StoreConfigService);
  private destroyRef = inject(DestroyRef);

  loading = signal(false);

  content = {
    title: 'Contáctanos',
    subtitle: 'Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.',
    infoTitle: 'Información de Contacto',
    formTitle: 'Envíanos un mensaje',
    contactDetails: [
      { icon: 'pi pi-map-marker', title: 'Ubicación', desc: 'Cargando...' },
      { icon: 'pi pi-phone', title: 'Teléfono', desc: 'Cargando...' },
      { icon: 'pi pi-envelope', title: 'Correo', desc: 'Cargando...' },
      { icon: 'pi pi-clock', title: 'Horario', desc: 'Lunes a Sábado: 9:00 AM - 6:00 PM' }
    ],
    fields: {
      name: 'Nombre completo',
      email: 'Correo electrónico',
      subject: 'Asunto',
      message: 'Mensaje'
    },
    subjects: [
      { label: 'Consulta de ventas', value: 'sales' },
      { label: 'Soporte técnico', value: 'support' },
      { label: 'Garantías y devoluciones', value: 'warranty' },
      { label: 'Otro', value: 'other' }
    ],
    submitBtn: 'Enviar Mensaje',
    errors: {
      required: 'Este campo es obligatorio',
      email: 'Ingresa un correo electrónico válido'
    }
  };

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [null as any, Validators.required],
    message: ['', Validators.required]
  });

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  ngOnInit() {
    this.storeConfigService.getConfiguration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (config) => {
        this.content.contactDetails[0].desc = config.address || 'No disponible';
        this.content.contactDetails[1].desc = config.supportPhone || 'No disponible';
        this.content.contactDetails[2].desc = config.supportEmail || 'No disponible';
      },
      error: () => {}
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.http.post(`${environment.apiUrl}/contact`, this.form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.reset();
        this.alertService.success('Mensaje Enviado', 'Hemos recibido tu consulta. Nos pondremos en contacto contigo pronto.');
      },
      error: (err: any) => {
        this.loading.set(false);
        this.alertService.error('Error', err?.error?.message || 'No pudimos enviar tu mensaje. Intenta más tarde.');
      }
    });
  }
}
