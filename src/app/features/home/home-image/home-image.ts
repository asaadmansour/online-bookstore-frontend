import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-image',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-image.html',
  styleUrl: './home-image.css',
})
export class HomeImage {}
