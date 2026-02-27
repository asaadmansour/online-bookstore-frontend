import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLayoutComponent } from './profile-layout/profile-layout';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileLayoutComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent {}
