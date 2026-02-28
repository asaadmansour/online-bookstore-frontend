import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-image',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home-image.html',
  styleUrl: './home-image.css',
})
export class HomeImage {}
