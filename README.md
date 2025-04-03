# Express Meta

A modern Express.js application with TypeScript, dependency injection, and a clean architecture.

## Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Dependency Injection**: Using Inversify for IoC container
- **Clean Architecture**: Separation of concerns with controllers, services, and repositories
- **Error Handling**: Centralized error handling with custom ApiError class
- **Modular Design**: Feature-based organization with posts and users modules

## Project Structure

```
src/
├── api/
│   └── v1/
│       └── client/
│           ├── posts/
│           │   ├── controllers/
│           │   ├── services/
│           │   └── repositories/
│           ├── users/
│           │   ├── controllers/
│           │   ├── services/
│           │   └── repositories/
│           └── shared/
│               └── errors/
├── config/
├── container.ts
└── server.ts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/express-meta.git
cd express-meta
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables
```
PORT=3000
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## API Endpoints

### Posts

- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/:id` - Get a post by ID
- `POST /api/v1/posts` - Create a new post
- `PUT /api/v1/posts/:id` - Update a post
- `DELETE /api/v1/posts/:id` - Delete a post

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get a user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests

## License

This project is licensed under the MIT License - see the LICENSE file for details. 