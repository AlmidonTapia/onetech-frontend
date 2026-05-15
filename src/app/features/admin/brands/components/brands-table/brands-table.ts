import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Brand } from '../../../../../core/models/brand.model';

@Component({
  selector: 'app-brands-table',
  standalone: true,
  imports: [TableModule, TooltipModule],
  templateUrl: './brands-table.html',
  styleUrl: './brands-table.css'
})
export class BrandsTableComponent {
  @Input() brands: Brand[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Brand>();
  @Output() deleteItem = new EventEmitter<Brand>();
}