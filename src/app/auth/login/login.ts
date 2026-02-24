import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
})
export class LoginComponent {
    form: FormGroup;
    error = '';
    loading: boolean = false;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loading = true;
        this.error = '';

        this.auth.login(this.form.value).subscribe({
            next: () => {
                this.loading = false;
                const role = this.auth.currentUser?.role;
                this.router.navigate([role === 'admin' ? '/admin' : '/']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err?.error?.error || err?.message || 'Login failed';
            },
        });
    }
}
