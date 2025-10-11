# Find the Character - Back End

## Description

This project represents the backend of the digital version of the classic game “Where's Wally?”, where users must find characters hidden in detailed illustrations. The backend manages the game logic, data storage, and score recording. You can explore the front end [here](https://github.com/josednl/where-is-waldo-frontend.git)

---

## Features

- RESTful API for managing characters and scores.
- Timer for measuring search time.
- Data validation and strong typing with TypeScript.
- Recording of times and scores.

---

## Technologies Used

- **Database**: PostgreSQL
- **Server**: Express
- **ORM**: Prisma
- **Languaj**: Typescript
- **Others**: dotenv, prettier, ts-node-dev, axios

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en)
- [npm](https://docs.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

### Installation

1. Clone the repository

```bash
git clone https://github.com/josednl/where-is-waldo-backend.git
cd where-is-waldo-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory with the following variables:

```bash
NODE_ENV=<development or production>
DATABASE_URL=<Your remote DB connection URL>
DEV_DATABASE_URL=<Your local DB connection URL>
FRONT_END_URL=<Your front end url>

```

4. Generate the Prisma client and apply the migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start development server

```bash
npm run dev
```

5. Open your browser

Navigate to `http://localhost:3000` to view the API
