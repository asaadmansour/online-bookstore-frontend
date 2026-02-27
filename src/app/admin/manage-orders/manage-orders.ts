import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-manage-orders',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4 text-center">
  <h2>Manage Orders (Admin)</h2>
  <p>Placeholder page.</p>
</div>`,
})
export class ManageOrdersComponent {}
