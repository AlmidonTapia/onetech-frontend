import { Component, ChangeDetectionStrategy, input, output, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './quantity-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantitySelectorComponent),
      multi: true
    }
  ]
})
export class QuantitySelectorComponent implements ControlValueAccessor {
  min = input<number>(1);
  max = input<number>(99);
  
  quantityChange = output<number>();

  value = signal<number>(1);
  disabled = signal<boolean>(false);

  private onChange: (val: number) => void = () => {};
  private onTouched: () => void = () => {};

  increase() {
    if (this.value() < this.max() && !this.disabled()) {
      this.value.update(v => v + 1);
      this.notifyChanges();
    }
  }

  decrease() {
    if (this.value() > this.min() && !this.disabled()) {
      this.value.update(v => v - 1);
      this.notifyChanges();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.increase();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrease();
    }
  }

  private notifyChanges() {
    this.onChange(this.value());
    this.onTouched();
    this.quantityChange.emit(this.value());
  }

  writeValue(val: any): void {
    if (val !== undefined && val !== null) {
      this.value.set(val);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
