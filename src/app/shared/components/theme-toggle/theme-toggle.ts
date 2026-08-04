import { themeToggleContent } from '../../../core/content/shared/themeToggle.content';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../ui/button/button';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [ButtonComponent],
    templateUrl: './theme-toggle.html'
})
export class ThemeToggleComponent {
    content = themeToggleContent;
    isDark = signal(document.documentElement.classList.contains('dark'));

    toggleTheme() {
        const nextState = !this.isDark();
        this.isDark.set(nextState);

        if (nextState) {
            document.documentElement.classList.add(this.content.darkClass);
            localStorage.setItem(this.content.storageKey, this.content.darkValue);
        } else {
            document.documentElement.classList.remove(this.content.darkClass);
            localStorage.setItem(this.content.storageKey, this.content.lightValue);
        }
    }
}
