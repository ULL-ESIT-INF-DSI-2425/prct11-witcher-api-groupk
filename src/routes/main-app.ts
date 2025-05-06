import express from 'express';
import { goodRouter } from './goods-route.js';
import { hunterRouter } from './hunters-route.js';
import { merchantRouter } from './merchant-route.js';
import { transactionRouter } from './transactions-route.js';

export const app = express();

app.use(express.json());
app.use(goodRouter);
app.use(hunterRouter);
app.use(merchantRouter);
app.use(transactionRouter);

const port = process.env.PORT || 3000;

app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});