import express from 'express';
import { goodRouter } from './goods-route.js';
import { hunterRouter } from './hunters-route.js';
import { merchantRouter } from './merchant-route.js';
import { Good } from '../items/good.js';
import * as InitItems from '../items/init-items.js';
import { Client } from '../characters/client.js';
import { Merchant } from '../characters/merchant.js';

const app = express();

app.use(express.json());
app.use(goodRouter);
app.use(hunterRouter);
app.use(merchantRouter);

const port = process.env.PORT || 3000;

app.delete('/restart', async (_, res) => {
  try {
    await Good.deleteMany({});
    await Client.deleteMany({});
    await Merchant.deleteMany({});
  } catch (err) {
    res.status(500).send(err);
  }

  for (let i: number = 0; i < 10; i++) {
    let good = new Good({ name: InitItems.namesGood[i], description: InitItems.descriptions[i], materials: [InitItems.materials[i]], weight: InitItems.weights[i], crowns: InitItems.crowns[i]});
    let client = new Client({ name: InitItems.namesClient[i], location: InitItems.locations[i], race: InitItems.races[i] });
    let merchant = new Merchant({ name: InitItems.namesMerchant[i], location: InitItems.locations[i], race: InitItems.types[i] });
    
    try {
      await good.save();
      await client.save();
      await merchant.save();
      res.send('Base de datos reiniciada.')
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