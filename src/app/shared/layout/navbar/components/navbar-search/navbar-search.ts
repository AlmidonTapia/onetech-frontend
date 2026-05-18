import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar-search.html',
  styleUrl: './navbar-search.css'
})
export class NavbarSearchComponent {
  private router = inject(Router);
  query = '';

  content = {
    catalogRoute: '/catalog',
    searchParamKey: 'search',
    placeholderText: 'Buscar laptops, celulares, componentes...',
    ariaLabels: {
      input: 'Buscar productos',
      button: 'Buscar'
    },
    searchIcon: 'pi pi-search'
  };

  search() {
    const q = this.query.trim();
    if (q) {
      this.router.navigate([this.content.catalogRoute], {
        queryParams: { [this.content.searchParamKey]: q }
      });
    }
  }
}
