# Photo Gallery

An Angular application for browsing, viewing, and favoriting photos from the [Lorem Picsum](https://picsum.photos/) API.

## Features

- Browse a randomized gallery of photos
- View photo detail with author info
- Add/remove photos from a local Favorites list
- Navigate between Gallery and Favorites views

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ (v20 recommended)
- npm (bundled with Node.js)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Then open your browser at `http://localhost:4200`.

The app will reload automatically when you edit source files.

## Running Tests

```bash
npm test
```

Unit tests run via [Karma](https://karma-runner.github.io) and Jasmine.

## Build

```bash
npm run build
```

Production artifacts are output to the `dist/` directory.

## Project Structure

```
src/app/
├── core/
│   ├── models/        # Photo data model
│   └── services/      # PhotoApiService, FavoritesService
├── header/            # Top navigation bar
├── pages/
│   ├── photos/        # Gallery / home page
│   └── favorites/     # Favorites list and photo detail
└── shared/            # Reusable components
```

## Tech Stack

- [Angular 20](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [Lorem Picsum API](https://picsum.photos/) — free photo placeholder service
