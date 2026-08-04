import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  label = input<string>('');
  icon = input<string>('');
  iconPos = input<'left' | 'right'>('left');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
  type = input<'button' | 'submit'>('button');
  styleClass = input<string>('');
  
  clicked = output<Event>();

  baseClasses = 'relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold rounded-full border-none whitespace-nowrap cursor-pointer transition-all duration-300 z-10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none after:absolute after:inset-0 after:bg-white/15 after:opacity-0 after:transition-opacity after:-z-10 hover:after:opacity-100 disabled:after:hidden';

  sizeClasses = computed(() => {
    switch (this.size()) {
      case 'sm': return 'px-4 py-2 text-sm';
      case 'lg': return 'px-8 py-4 text-lg';
      default: return 'px-6 py-3 text-base';
    }
  });

  variantClasses = computed(() => {
    switch (this.variant()) {
      case 'accent':
        return 'bg-orange-500 text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/40';
      case 'outline':
        return 'bg-transparent text-blue-600 shadow-[inset_0_0_0_2px_#2563eb] hover:bg-blue-600/5 dark:text-blue-400 dark:shadow-[inset_0_0_0_2px_#60a5fa] dark:hover:bg-blue-400/10 after:hidden';
      case 'ghost':
        return 'bg-transparent text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 after:hidden';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 after:hidden';
      case 'primary':
      default:
        return 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/40 dark:from-blue-400 dark:to-blue-500 dark:text-slate-900';
    }
  });

  computedClasses = computed(() => {
    return [
      this.baseClasses,
      this.sizeClasses(),
      this.variantClasses(),
      this.fullWidth() ? 'w-full' : '',
      this.styleClass()
    ].filter(Boolean).join(' ');
  });
}