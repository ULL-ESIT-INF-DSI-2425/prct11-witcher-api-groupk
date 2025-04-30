import express from 'express'
import mongoose from 'mongoose';
import { Merchant } from '../characters/merchant.js' 

export const merchantRouter = express.Router();

const port = process.env.PORT || 3000

merchantRouter.use(express.json());

merchantRouter.post('/merchants', async (req, res) => {
  const merchant = new Merchant(req.body);

  try {
    await merchant.save();
    res.status(201).send(merchant);
  } catch (err) {
    res.status(500).send(err);
  }
}); 

merchantRouter.get('/merchants', async (req, res) => {
  const name = req.query.name as string;

  try {
    const merchant = await Merchant.findOne({ name: name });
    if (merchant) {
      res.send(merchant);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

merchantRouter.get('/merchants/:id', async (req, res) => {
    try {
      const merchant = await Merchant.findById(req.params.id);
      if (merchant) {
        res.send(merchant);
      } else {
        res.status(404).send();
      }
    } catch (err) {
      res.status(500).send(err);
    }
});

merchantRouter.patch('/merchants', async (req, res) => {
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
      try {
        const merchant = await Merchant.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });

        if (!merchant) {
          res.status(404).send();
        } else {
          res.send(merchant);
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }
});

merchantRouter.patch('/merchants/:id', async (req, res) => {
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
      try {
        const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!merchant) {
          res.status(404).send();
        } else {
          res.send(merchant);
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }
});

merchantRouter.delete('/merchants', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    })
  } else {
    try {
      const merchant = await Merchant.findOneAndDelete({name: req.query.name.toString()});

      if (!merchant) {
        res.status(404).send();
      } else {
        res.send(merchant);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

merchantRouter.delete('/merchants/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndDelete(req.params.id);

    if (!merchant) {
      res.status(404).send();
    } else {
      res.send(merchant);
    }
  } catch (err) {
    res.status(500).send();
  }
});