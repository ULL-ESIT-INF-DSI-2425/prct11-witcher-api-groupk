import express from 'express'
import mongoose from 'mongoose';
import { Client, ClientInterface } from '../characters/client.js' 

const app = express();

const port = process.env.PORT || 3000

app.use(express.json());


export function getClientByName(name: string): Promise<ClientInterface> {
  return new Promise((resolve, reject) => {
    Client.findOne({ name: name })
    .then((client) => {
      if (client) resolve(client.toObject());
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function getClientByID(identifier: string): Promise<ClientInterface> {
  return new Promise((resolve, reject) => {
    if (!mongoose.Types.ObjectId.isValid(identifier)) return reject(new Error('Invalid ID format'));
    
    Client.findById(identifier)
    .then((client) => {
      if (client) resolve(client.toObject());
    })
    .catch((err) => {
      reject(err);
    });
  });
}

app.post('/hunters', (req, res) => {
  const client = new Client(req.body);

  client.save().then((client) => {
    res.status(201).send(client);
  }).catch((error) => {
    res.status(400).send(error);
  });
}); 

app.get('/hunters', (req, res) => {
  const name = req.query.name as string;

  getClientByName(name)
  .then((client) => {
    if (client) res.status(201).send(client);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/hunters/:id', (req, res) => {
  const id = req.params.id;

  getClientByID(id)
  .then((client) => {
    if (client) res.status(201).send(client);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/hunters', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'location', 'race'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Client.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((client) => {
        if (!client) {
          res.status(404).send();
        } else {
          res.send(client);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.patch('/hunters/:id', (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'location', 'race'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).then((client) => {
        if (!client) {
          res.status(404).send();
        } else {
          res.send(client);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.delete('/hunters', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    })
  } else {
    Client.findOneAndDelete({name: req.query.name.toString()}).then((client) => {
      if (!Client) {
        res.status(404).send();
      } else {
        res.send(client)
      }
    })
  }
});

app.delete('/hunters/:id', (req, res) => {
  Client.findByIdAndDelete(req.params.id).then((client) => {
    if (!client) {
      res.status(404).send();
    } else {
      res.send(client);
    }
  }).catch(() => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});