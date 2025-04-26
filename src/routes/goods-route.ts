import express from 'express'
import mongoose from 'mongoose';
import { Good, GoodInterface } from '../items/good.js' 

const app = express();

const port = process.env.PORT || 3000

app.use(express.json());

export function getgoodByName(name: string): Promise<GoodInterface> {
  return new Promise((resolve, reject) => {
    Good.findOne({ name: name })
      .then((good) => {
        if (good) {
          resolve(good.toObject());
        } else {
          reject(new Error('Good not found'));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getgoodByID(identifier: string): Promise<GoodInterface> {
  return new Promise((resolve, reject) => {
    if (!mongoose.Types.ObjectId.isValid(identifier)) return reject(new Error('Invalid ID format'));

    Good.findById(identifier)
      .then((good) => {
        if (good) {
          resolve(good.toObject());
        } else {
          reject(new Error('Good not found'));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

app.post('/goods', (req, res) => {
  const good = new Good(req.body);

  good.save().then((good) => {
    res.status(201).send(good);
  }).catch((error) => {
    res.status(400).send(error);
  });
}); 

app.get('/goods', (req, res) => {
  const { name, description, weight, crowns } = req.query;

  const filter: any = {};
  if (name) filter.name = name;
  if (description) filter.description = description;
  if (weight) filter.weight = Number(weight);
  if (crowns) filter.crowns = Number(crowns);

  Good.find(filter)
    .then((goods) => {
      if (goods.length > 0) {
        res.status(200).send(goods);
      } else {
        res.status(404).send({ error: 'No goods found matching the criteria' });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});


app.get('/goods/:id', (req, res) => {
  const id = req.params.id;

  getgoodByID(id)
  .then((good) => {
    if (good) res.status(201).send(good);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/goods', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'description', 'weight', 'crowns'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Good.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((good) => {
        if (!good) {
          res.status(404).send();
        } else {
          res.send(good);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.patch('/goods/:id', (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'description', 'weight', 'crowns'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Good.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).then((good) => {
        if (!good) {
          res.status(404).send();
        } else {
          res.send(good);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.delete('/goods', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    })
  } else {
    Good.findOneAndDelete({name: req.query.name.toString()}).then((good) => {
      if (!good) {
        res.status(404).send();
      } else {
        res.send(good)
      }
    })
  }
});

app.delete('/goods/:id', (req, res) => {
  Good.findByIdAndDelete(req.params.id).then((good) => {
    if (!good) {
      res.status(404).send();
    } else {
      res.send(good);
    }
  }).catch(() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});