import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { NgStyle } from '@angular/common';

export type SkeletonVariant = 'line' | 'circle' | 'rect';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('line');
  width = input<string>('100%');
  height = input<string>('');
  size = input<string>('');
  borderRadius = input<string>('');

  styles = computed(() => {
    const v = this.variant();
    const s = this.size();

    if (v === 'circle' && s) {
      return { width: s, height: s, borderRadius: '50%' };
    }

    const h = this.height() || (v === 'line' ? '1rem' : v === 'rect' ? '120px' : '1rem');
    const r = this.borderRadius() || (v === 'line' ? '4px' : v === 'rect' ? 'var(--ot-radius-md)' : '0');

    return {
      width: this.width(),
      height: h,
      borderRadius: r,
    };
  });
}
