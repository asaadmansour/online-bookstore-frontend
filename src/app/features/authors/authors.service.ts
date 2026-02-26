import { Injectable } from '@angular/core';
import { Author } from '../../shared/models/author.model';

@Injectable({ providedIn: 'root' })
export class AuthorsService {
  private authors: Author[] = [
    {
      id: 1,
      name: 'Naguib Mahfouz',
      bio: 'Egyptian writer who won the Nobel Prize in Literature.',
      imageUrl: 'https://picsum.photos/seed/author1/200/200',
      booksCount: 25,
    },
    {
      id: 2,
      name: 'Agatha Christie',
      bio: 'The queen of mystery and detective novels.',
      imageUrl: 'https://picsum.photos/seed/author2/200/200',
      booksCount: 85,
    },
    {
      id: 3,
      name: 'George Orwell',
      bio: 'Known for 1984 and Animal Farm.',
      imageUrl: 'https://picsum.photos/seed/author3/200/200',
      booksCount: 12,
    },
  ];

  getAll(): Author[] {
    return this.authors;
  }

  getById(id: number): Author | undefined {
    return this.authors.find(a => a.id === id);
  }
}