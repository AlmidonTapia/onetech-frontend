import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shipments-table.html',
  styleUrl: './shipments-table.css'
})
export class ShipmentsTableComponent {}
