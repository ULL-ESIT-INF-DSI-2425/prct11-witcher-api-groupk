import express from 'express'
import mongoose from 'mongoose';
import { Merchant, MerchantInterface } from '../characters/merchant.js' 

const app = express();

const port = process.env.PORT || 3000

app.use(express.json());


export function getMerchantByName(name: string): Promise<MerchantInterface> {
  return new Promise((resolve, reject) => {
    Merchant.findOne({ name: name })
    .then((merchant) => {
      if (merchant) resolve(merchant.toObject());
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function getMerchantByID(identifier: string): Promise<MerchantInterface> {
  return new Promise((resolve, reject) => {
    if (!mongoose.Types.ObjectId.isValid(identifier)) return reject(new Error('Invalid ID format'));
    
    Merchant.findById(identifier)
    .then((merchant) => {
      if (merchant) resolve(merchant.toObject());
    })
    .catch((err) => {
      reject(err);
    });
  });
}

app.post('/merchants', (req, res) => {
  const merchant = new Merchant(req.body);

  merchant.save().then((merchant) => {
    res.status(201).send(merchant);
  }).catch((error) => {
    res.status(400).send(error);
  });
}); 

app.get('/merchants', (req, res) => {
  const name = req.query.name as string;

  getMerchantByName(name)
  .then((merchant) => {
    if (merchant) res.status(201).send(merchant);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/merchants/:id', (req, res) => {
  const id = req.params.id;

  getMerchantByID(id)
  .then((merchant) => {
    if (merchant) res.status(201).send(merchant);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/merchants', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'location', 'type'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Merchant.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((merchant) => {
        if (!merchant) {
          res.status(404).send();
        } else {
          res.send(merchant);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.patch('/merchants/:id', (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'location', 'type'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Merchant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).then((merchant) => {
        if (!merchant) {
          res.status(404).send();
        } else {
          res.send(merchant);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.delete('/merchants', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    })
  } else {
    Merchant.findOneAndDelete({name: req.query.name.toString()}).then((merchant) => {
      if (!merchant) {
        res.status(404).send();
      } else {
        res.send(merchant)
      }
    })
  }
});

app.delete('/merchants/:id', (req, res) => {
  Merchant.findByIdAndDelete(req.params.id).then((merchant) => {
    if (!merchant) {
      res.status(404).send();
    } else {
      res.send(merchant);
    }
  }).catch(() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});