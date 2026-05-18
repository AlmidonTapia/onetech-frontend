import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [],
    templateUrl: './theme-toggle.component.html',
    styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
    isDark = signal(document.documentElement.classList.contains('dark-mode'));

    content = {
        ariaLight: 'Activar modo claro',
        ariaDark: 'Activar modo oscuro',
        iconLight: 'pi-sun',
        iconDark: 'pi-moon',
        storageKey: 'theme',
        darkClass: 'dark-mode',
        lightValue: 'light',
        darkValue: 'dark'
    } as const;

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
