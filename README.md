# Daily Deals Affiliate Site

This is an affiliate marketing web application built to display and manage daily deals. It uses modern web technologies to provide a fast, responsive user experience. 

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, version 16)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL (Hosted on [Neon Serverless Postgres](https://neon.tech/), utilizing `@prisma/adapter-neon`)

## 📂 Project Structure

- `app/`: Next.js App Router directory.
  - `page.tsx`: The main landing page displaying deals.
  - `api/`: Backend API route handlers.
  - `deal/`: Dynamic routes for viewing individual deals.
- `prisma/`: Contains database configuration and schema.
  - `schema.prisma`: Defines the single data model `Deal` (id, title, content, affiliateUrl, platform, imageUrl, createdAt).
- `public/`: Static assets like images and icons.

## 🚀 Getting Started

First, install dependencies:
```bash
npm install
```

Set up your `.env` file with your Neon Postgres connection string. Then, generate the Prisma client:
```bash
npx prisma generate
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
