import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.css',
})
export class ManageCategoriesComponent { }
