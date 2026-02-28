import { Component, computed, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CartFacade } from '../../../core/services/cart.facade';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [ProgressSpinnerModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  readonly cartFacade = inject(CartFacade);
  readonly cart = this.cartFacade.cart;
  readonly loading = this.cartFacade.loading;
  readonly error = this.cartFacade.error;
  readonly subtotal = computed(() => {
    const currentCart = this.cart();
    if (!currentCart) return 0;
    return currentCart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  });
  readonly totalItems = computed(() => {
    const currentCart = this.cart();
    if (!currentCart) return 0;
    return currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
  });
  constructor() {
    this.cartFacade.loadCart();
  }

  addItem() {
    this.cartFacade.addItem();
  }

  updateQuantity(itemId: string | undefined, current: number, delta: number): void {
    if (!itemId) return;
    this.cartFacade.updateQuantity(itemId, current + delta);
  }

  removeItem(itemId: string | undefined): void {
    if (!itemId) return;
    this.cartFacade.removeItem(itemId);
  }
}

// {
//   "message": "Item added in cart successfully",
//   "cart": {
//     "_id": "699f0ff30f698f2f358f526c",
//     "user": "699cb28fd9bd94f8e4c13dc9",
//     "items": [
//       {
//         "book": {
//           "_id": "699c4ea93d8d37d167b7886e",
//           "name": "Utopia",
//           "author": {
//             "_id": "69977e741e5485aa72cdaa60",
//             "name": "Ahmed Khaled Tawfik",
//             "bio": "Egyptian horror and sci-fi writer",
//             "createdAt": "2026-02-19T21:19:48.454Z",
//             "updatedAt": "2026-02-19T21:19:48.454Z",
//             "__v": 0
//           },
//           "categories": [
//             {
//               "_id": "699785724cbc8aa48deebcac",
//               "name": "Horror",
//               "createdAt": "2026-02-19T21:49:38.611Z",
//               "updatedAt": "2026-02-22T12:45:14.643Z",
//               "__v": 0
//             },
//             {
//               "_id": "6997853d4cbc8aa48deebca8",
//               "name": "Science",
//               "createdAt": "2026-02-19T21:48:45.040Z",
//               "updatedAt": "2026-02-19T21:48:45.040Z",
//               "__v": 0
//             }
//           ],
//           "coverUrl": "https://res.cloudinary.com/dufnwn7gr/image/upload/v1771851431/bookstore/book-covers/13-1771851429954-681800466.png",
//           "price": 15.5,
//           "stock": 30,
//           "description": "A grim vision of a future Egypt where the wealthy live in a fortified city while the rest of the population lives in poverty-stricken chaos.",
//           "averageRating": 0,
//           "isDeleted": false,
//           "createdAt": "2026-02-23T12:57:13.738Z",
//           "updatedAt": "2026-02-23T12:57:13.738Z",
//           "__v": 0
//         },
//         "quantity": 10,
//         "_id": "699f0ff30f698f2f358f526d"
//       },
//       {
//         "book": {
//           "_id": "699c4f7a3d8d37d167b7887a",
//           "name": "The Days",
//           "author": {
//             "_id": "69977e5a1e5485aa72cdaa5e",
//             "name": "Taha Hussein",
//             "bio": "Pioneer of modern Arabic literature",
//             "createdAt": "2026-02-19T21:19:22.873Z",
//             "updatedAt": "2026-02-19T21:19:22.873Z",
//             "__v": 0
//           },
//           "categories": [
//             {
//               "_id": "699785524cbc8aa48deebcaa",
//               "name": "Self Development",
//               "createdAt": "2026-02-19T21:49:06.046Z",
//               "updatedAt": "2026-02-19T21:49:06.046Z",
//               "__v": 0
//             }
//           ],
//           "coverUrl": "https://res.cloudinary.com/dufnwn7gr/image/upload/v1771851640/bookstore/book-covers/15-1771851638042-854897708.png",
//           "price": 12.99,
//           "stock": 40,
//           "description": "An autobiographical masterpiece detailing the author's childhood in rural Egypt and his journey through education despite his blindness.",
//           "averageRating": 0,
//           "isDeleted": false,
//           "createdAt": "2026-02-23T13:00:42.954Z",
//           "updatedAt": "2026-02-23T13:00:42.954Z",
//           "__v": 0
//         },
//         "quantity": 10,
//         "_id": "699f14b6145fc6a787ec3d57"
//       },
//       {
//         "book": {
//           "_id": "699c51e53d8d37d167b78888",
//           "name": "The Alchemist",
//           "author": {
//             "_id": "69977e951e5485aa72cdaa62",
//             "name": "Paulo Coelho",
//             "bio": "Brazilian author of The Alchemist",
//             "createdAt": "2026-02-19T21:20:21.227Z",
//             "updatedAt": "2026-02-19T21:20:21.227Z",
//             "__v": 0
//           },
//           "categories": [
//             {
//               "_id": "699785524cbc8aa48deebcaa",
//               "name": "Self Development",
//               "createdAt": "2026-02-19T21:49:06.046Z",
//               "updatedAt": "2026-02-19T21:49:06.046Z",
//               "__v": 0
//             }
//           ],
//           "coverUrl": "https://res.cloudinary.com/dufnwn7gr/image/upload/v1771852259/bookstore/book-covers/12-1771852256656-886151578.png",
//           "price": 18.99,
//           "stock": 50,
//           "description": "A magical story about Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
//           "averageRating": 0,
//           "isDeleted": false,
//           "createdAt": "2026-02-23T13:11:01.107Z",
//           "updatedAt": "2026-02-23T13:11:01.107Z",
//           "__v": 0
//         },
//         "quantity": 10,
//         "_id": "699f15118ea706b872afa0cd"
//       }
//     ],
//     "createdAt": "2026-02-25T15:06:27.145Z",
//     "updatedAt": "2026-02-25T15:28:17.810Z",
//     "__v": 2
//   }
// }
