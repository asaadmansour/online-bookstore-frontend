import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { BRAND } from '../../core/config/brand';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  brand = BRAND;

  private router = inject(Router);

  isVisible = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => {
        const url = (e as NavigationEnd).url;
        return !url.startsWith('/auth/') && url !== '/auth';
      })
    ),
    {
      initialValue: !this.router.url.startsWith('/auth/') && this.router.url !== '/auth'
    }
  );
}
