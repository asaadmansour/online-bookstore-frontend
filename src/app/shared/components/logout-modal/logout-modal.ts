import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-logout-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './logout-modal.html',
})
export class LogoutModalComponent {
    @Input() isOpen = false;
    @Input() loading = false;
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm(): void { this.confirmed.emit(); }
    onCancel(): void { this.cancelled.emit(); }
}