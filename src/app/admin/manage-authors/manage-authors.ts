import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage-authors',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './manage-authors.html',
  styleUrl: './manage-authors.css',
})
export class ManageAuthorsComponent { }
