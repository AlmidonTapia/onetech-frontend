import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css'
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullPage = false;
  @Input() label = '';

  readonly sizeMap = { sm: '24px', md: '40px', lg: '64px' };
}