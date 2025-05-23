# Snake Game

A modern Snake Game built with Next.js, featuring sound effects, user authentication, and score tracking.

## Features

- Classic Snake Game gameplay
- Sound effects and background music
- User authentication (login/register)
- Score tracking and leaderboard
- Responsive design for both desktop and mobile
- Beautiful UI with animations and gradients

## Tech Stack

- Next.js 15
- TypeScript
- Prisma (Database ORM)
- Tailwind CSS
- PostgreSQL (Database)

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- PostgreSQL database

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_secret_key"
```

## Development

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and sign up/login with your GitHub account

3. Click "New Project" and import your repository

4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next

5. Add your environment variables:
   - DATABASE_URL
   - JWT_SECRET

6. Click "Deploy"

### Deploying to Other Platforms

#### Railway
1. Create a Railway account
2. Create a new project
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

#### Render
1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Add environment variables
5. Deploy

## Database Setup

1. Create a PostgreSQL database
2. Update your DATABASE_URL in the environment variables
3. Run database migrations:
```bash
npx prisma db push
```

## License

MIT
#   G a m e S n a k e B y F i t r a h  
 #   s n a k e g a m e v 2  
 