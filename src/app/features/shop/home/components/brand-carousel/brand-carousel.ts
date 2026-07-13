import { Component, Input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { Brand } from '../../../../../core/domains/catalog/models/brand.model';

@Component({
  selector: 'app-brand-carousel',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './brand-carousel.html',
  styleUrl: './brand-carousel.css'
})
export class BrandCarouselComponent {
  @Input() brands: Brand[] = [];

  content = {
    title: 'Nuestras Marcas'
  };

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 2,
      numScroll: 1
    }
  ];
}
