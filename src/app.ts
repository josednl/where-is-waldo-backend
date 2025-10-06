import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: String(process.env.FRONT_END_URL),
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Successful backend connection');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
