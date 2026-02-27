import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: `<div class="p-4">
  <h2>Admin Section</h2>
  <router-outlet></router-outlet>
</div>`,
})
export class AdminLayoutComponent {}
