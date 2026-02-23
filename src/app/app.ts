import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Navbar } from "./shared/components/navbar/navbar";
import { HomeImage } from "./features/home/home-image/home-image";
import { HomePage } from "./features/home/home-page/home-page";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Navbar, HomeImage, HomePage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ChapterOneFrontend');
}
