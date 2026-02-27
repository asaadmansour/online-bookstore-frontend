import { Component } from '@angular/core';
import { BRAND } from '../../core/config/brand';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  brand = BRAND;

}
