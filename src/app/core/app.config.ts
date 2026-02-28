import { ApplicationConfig } from '@angular/core';
import { API_URL } from './api.config';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: API_URL, useValue: 'http://localhost:5000/' }],
};
