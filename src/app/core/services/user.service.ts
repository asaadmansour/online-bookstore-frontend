import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = `${environment.apiUrl}/users`;

  private http = inject(HttpClient);
  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.api}/me`);
  }

  updateProfile(
    data: Partial<Pick<User, 'firstName' | 'lastName' | 'dob'>>,
  ): Observable<{ message: string; user: User }> {
    return this.http.patch<{ message: string; user: User }>(`${this.api}/me`, data);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/me/passwords`, {
      currentPassword,
      newPassword,
    });
  }

  getAllUsers(
    page = 1,
    limit = 8,
  ): Observable<{
    users: User[];
    pagination: { currentPage: number; totalItems: number; totalPages: number };
  }> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<any>(this.api, { params });
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${userId}`);
  }
}
