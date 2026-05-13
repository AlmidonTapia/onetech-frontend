import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertService {

    private msg = inject(MessageService);

    success(summary: string, detail = '') {
        this.msg.add({ severity: 'success', summary, detail, life: 3000 });
    }

    error(summary: string, detail = '') {
        this.msg.add({ severity: 'error', summary, detail, life: 5000 });
    }

    warn(summary: string, detail = '') {
        this.msg.add({ severity: 'warn', summary, detail, life: 4000 });
    }

    info(summary: string, detail = '') {
        this.msg.add({ severity: 'info', summary, detail, life: 3000 });
    }
}