import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  fullPage = input<boolean>(false);
  label = input<string>('');

  readonly sizeMap = { sm: '24px', md: '40px', lg: '64px' };
  spinnerSize = computed(() => this.sizeMap[this.size()]);
}