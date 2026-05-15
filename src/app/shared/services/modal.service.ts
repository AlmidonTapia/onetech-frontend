import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    severity?: 'info' | 'warn' | 'danger';
    onConfirm?: () => void;
    onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
    visible = signal(false);
    config = signal<ModalConfig | null>(null);

    open(cfg: ModalConfig) {
        this.config.set(cfg);
        this.visible.set(true);
    }

    close() {
        this.config()?.onCancel?.();
        this.visible.set(false);
        setTimeout(() => this.config.set(null), 300);
    }

    confirm() {
        this.config()?.onConfirm?.();
        this.visible.set(false);
        setTimeout(() => this.config.set(null), 300);
    }
}