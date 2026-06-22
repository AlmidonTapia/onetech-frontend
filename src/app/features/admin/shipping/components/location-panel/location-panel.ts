import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

export interface UbigeoItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-location-panel',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './location-panel.html',
  styleUrl: './location-panel.css'
})
export class LocationPanelComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() items: UbigeoItem[] = [];
  @Input() selectedItem: UbigeoItem | null = null;
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No hay elementos';
  @Input() showCreateBtn: boolean = true;
  @Input() isLeaf: boolean = false;
  @Input() placeholderMessage: string | null = null;

  @Output() create = new EventEmitter<void>();
  @Output() selectItem = new EventEmitter<UbigeoItem>();
  @Output() delete = new EventEmitter<UbigeoItem>();
}
