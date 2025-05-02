import express from 'express';
import { goodRouter } from './goods-route.js';
import { hunterRouter } from './hunters-route.js';
import { merchantRouter } from './merchant-route.js';
import { Good } from '../items/good.js';
import * as InitItems from '../items/init-items.js';

const app = express();

app.use(express.json());
app.use(goodRouter);
app.use(hunterRouter);
app.use(merchantRouter);

const port = process.env.PORT || 3000;

app.get('/restart', async (_, res) => {
  for (let i: number = 0; i < 10; i++) {
    let good = new Good({ name: namesGood[i], description: descriptions[i], materials: [materials[i]], weight: weights[i], crowns: crowns[i]});

    try {
      await good.save();
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});