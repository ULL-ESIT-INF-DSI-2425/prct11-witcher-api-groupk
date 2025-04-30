import express from 'express';
import { goodRouter } from './goods-route.js';
import { hunterRouter } from './hunters-route.js';
import { merchantRouter } from './merchant-route.js';

const app = express();

app.use(express.json());
app.use(goodRouter);
app.use(hunterRouter);
app.use(merchantRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});