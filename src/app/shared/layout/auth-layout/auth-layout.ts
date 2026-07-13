import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface AuthBrandData {
  logoImage?: string;
  logoText1?: string;
  logoText2?: string;
  logoRoute?: string;
  title: string;
  description: string;
  benefits?: { icon: string; title: string; desc: string; }[];
  stats?: { value: string; label: string; }[];
  perks?: string[];
}

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayoutComponent {
  @Input() brandData!: AuthBrandData;
}
