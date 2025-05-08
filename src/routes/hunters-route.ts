import express from 'express'
import mongoose from 'mongoose';
import { Client, ClientInterface } from '../characters/client.js' 

/**
 * Router de clientes.
 */
export const hunterRouter = express.Router();

const port = process.env.PORT || 3000

hunterRouter.use(express.json());

/**
 * Manejador POST de /hunters. Permite guardar la información de un cliente en la base de datos.
 */
hunterRouter.post('/hunters', async (req, res) => {
  const client = new Client(req.body);

  try {
    await client.save();
    res.status(201).send(client);
  } catch (err) {
    res.status(400).send(err);
  }
}); 

/**
 * Manejador GET de /hunters. Permite obtener la información de un cliente a partir de su nombre pasado como un query string.
 */
hunterRouter.get('/hunters', async (req, res) => {
  const name = req.query.name as string;

  try {
    const client = await Client.find({ name: name });

    if (client.length === 0) {
      res.status(404).send({ error: 'Cliente no encontrado.' });
    } else {
      res.send(client);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Manejador GET de /hunters. Permite obtener la información de un cliente a partir de su ID pasado como parámetro dinámico.
 */
hunterRouter.get('/hunters/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await Client.findById(req.params.id);
  
    if (client) {
      res.send(client);
    } else {
      res.status(404).send({ error: 'Cliente no encontrado.' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Manejador PATCH de /hunters. Permite actualizar la información de un cliente a partir de su nombre pasado como un query string.
 */
hunterRouter.patch('/hunters', async (req, res) => {
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
      try {
        const client = await Client.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });

        if (!client) {
          res.status(404).send();
        } else {
          res.send(client);
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  }
});

/**
 * Manejador PATCH de /hunters. Permite actualizar la información de un cliente a partir de su ID pasado como un parámetro dinámico.
 */
hunterRouter.patch('/hunters/:id', async (req, res) => {
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
      try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!client) {
          res.status(404).send();
        } else {
          res.send(client);
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }
});

/**
 * Manejador DELETE de /hunters. Permite borrar a un cliente de la base de datos a partir de su nombre pasado como un query string.
 */
hunterRouter.delete('/hunters', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    })
  } else {
    try {
      const client = await Client.findOneAndDelete({name: req.query.name.toString()});

      if (!client) {
        res.status(404).send();
      } else {
        res.send(client);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

/**
 * Manejador DELETE de /hunters. Permite borrar a un cliente de la base de datos a partir de su ID pasado como un parámetro dinámico.
 */
hunterRouter.delete('/hunters/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      res.status(404).send();
    } else {
      res.send(client);
    }
  } catch (err) {
    res.status(500).send();
  }
});