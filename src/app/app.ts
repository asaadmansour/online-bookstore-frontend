import { Component, signal ,inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ChapterOneFrontend');
   private theme = inject(ThemeService);

  constructor(){
    this.theme.initTheme(); // Initialize on app start
  }
}
