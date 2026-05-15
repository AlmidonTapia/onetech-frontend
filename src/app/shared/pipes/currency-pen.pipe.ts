import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyPen', standalone: true })
export class CurrencyPenPipe implements PipeTransform {
    transform(value: number | null | undefined, showSymbol = true): string {
        if (value == null || isNaN(value as number)) {
            return showSymbol ? 'S/ 0.00' : '0.00';
        }
        const formatted = (value as number).toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return showSymbol ? `S/ ${formatted}` : formatted;
    }
}