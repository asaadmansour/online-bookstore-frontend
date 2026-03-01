# Chapter One — E-Commerce Bookstore (Frontend)

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![PrimeNG](https://img.shields.io/badge/PrimeNG-21-red?style=for-the-badge&logo=angular&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

The frontend application for **Chapter One**, a full-stack e-commerce bookstore platform. This Angular 21 application provides a modern, responsive storefront for customers and a comprehensive, secure administrative dashboard for store managers.

---

## ✨ Features

### 🛍️ Customer Experience
- **Browse & Explore** — Search, filter, and discover books by category, popular authors, and curated trending lists.
- **Book Details** — View high-quality cover images, detailed author information, pricing, stock limits, and descriptions.
- **Shopping Cart** — Seamlessly add, remove, and update book quantities with real-time total price calculations.
- **Secure Checkout** — Intuitive, multi-step checkout process and order confirmation.
- **Order History** — View past orders, detailed summaries, and track delivery statuses (Processing → Out for Delivery → Delivered).
- **User Profile** — Register, log in, view profile details, and securely update passwords.

### 🛠️ Admin Dashboard
- **Analytics Overview** — High-level dashboard tracking total users, active orders, total books, and categories.
- **Manage Books** — Full CRUD management with cover image uploading, price control, stock management, and author/category assignment.
- **Manage Authors** — Create and edit author profiles and biographies.
- **Manage Categories** — Organize and structure the book catalog.
- **Manage Orders** — View all incoming customer orders, and update fulfillment and payment statuses.

---

## 🧰 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Angular 21** | Frontend framework (Standalone Components, Signals, Zoneless Change Detection) |
| **TypeScript 5.9** | Type-safe development |
| **Tailwind CSS 4** | Responsive UI styling and utility classes |
| **PrimeNG 21** | Pre-built, accessible UI components (Tables, Carousels, Modals, Spinners) |
| **Lucide & PrimeIcons** | Modern, clean icon libraries |
| **RxJS** | Reactive data streams and asynchronous HTTP state management |

---

## 📁 Project Structure

```text
src/app/
├── core/                    # Core singletons and configurations
│   ├── interceptors/        # HTTP interceptors (e.g., JWT auth injection)
│   ├── guards/              # Route guards (Auth, Admin, Guest)
│   └── services/            # API communication (Auth, Books, Orders, etc.)
├── shared/                  # Reusable UI components and models
│   ├── components/          # Navbar, Footer, UI wrappers
│   └── models/              # TypeScript interfaces and types
├── features/                # Customer-facing route pages
│   ├── home/                # Landing page with trending carousels
│   ├── books/               # Book catalog and detailed views
│   ├── authors/             # Author profiles and associated books
│   ├── categories/          # Category grids
│   ├── cart/                # Shopping cart interface
│   ├── checkout/            # Checkout flow
│   ├── order-history/       # User past orders
│   └── profile/             # User settings and password management
├── admin/                   # Administrative route pages
│   ├── admin-panel/         # Dashboard analytics
│   ├── manage-books/        # Book CRUD interface
│   ├── manage-orders/       # Order management interface
│   ├── manage-categories/   # Category CRUD interface
│   └── manage-authors/      # Author CRUD interface
├── auth/                    # Authentication boundary
│   ├── login/               # Sign in page
│   └── register/            # Sign up page
└── layouts/                 # Structural shell wrappers
    ├── user-layout/         # Standard customer view wrapper
    └── admin-layout/        # Secured admin dashboard wrapper
```

---

## � Security

- **JWT Authentication** — Secure, token-based authentication with automatic token injection via Angular HTTP Interceptors.
- **Route Guards** — Strict access control protecting admin routes and authenticated user features.
- **Role-based UI** — The administrative dashboard and standard user views are completely isolated.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x
- A running instance of the Chapter One Backend API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/asaadmansours/online-bookstore-frontend.git
   cd online-bookstore-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Update the environment API URL in `src/environments/environments.ts` (or `app.config.ts`) to point to your running backend instance.

### Run

```bash
# Start the development server
npm start

# Build for production
npm run build

# Run tests
npm test
```
The application will be running at `http://localhost:4200`.

---

## 🌐 Deployment

Designed to be easily deployed on robust Jamstack platforms like **Vercel** or **Netlify**.

- **Build command:** `ng build`
- **Output directory:** `dist/chapter-one-frontend/browser`

Ensure the production environment variables inside the deployment platform point to the live backend URL.

---

## � License

This project is licensed under the MIT License.
