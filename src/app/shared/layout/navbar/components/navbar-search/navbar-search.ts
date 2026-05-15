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

  search() {
    const q = this.query.trim();
    if (q) {
      this.router.navigate(['/catalog'], { queryParams: { search: q } });
    }
  }
}