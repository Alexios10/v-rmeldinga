# Værmeldinga

Værmeldinga is a modern weather app built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS.

## Features

- Search for weather by location
- View current weather and forecasts
- Responsive and mobile-friendly UI
- Beautiful, customizable components

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

Clone the repository and install dependencies:

```sh
git clone <YOUR_GIT_URL>
cd værmeldinga
npm install
```

### Running the App

Start the development server:

```sh
npm run dev
```

Open your browser and go to the local address shown in the terminal (usually http://localhost:5173).

### Environment Variables

Create a `.env` file in the project root and add your weather API key:

```
VITE_API_KEY=your_api_key_here
```

## Project Structure

- `src/` — Main source code
  - `components/` — UI and app components
  - `hooks/` — Custom React hooks
  - `lib/` — Utility functions
  - `pages/` — Page components (routing)

## Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deployment

You can deploy this app to any static hosting provider (e.g., Vercel, Netlify, GitHub Pages) after running:

```sh
npm run build
```

The production-ready files will be in the `dist/` folder.

## License

This project is open source and available under the MIT License.
