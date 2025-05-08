import express from 'express'
import mongoose from 'mongoose';
import { Good } from '../items/good.js' 
import { ReturnDocument } from 'mongodb';

/**
 * Router de bienes.
 */
export const goodRouter = express.Router();

const port = process.env.PORT || 3000

goodRouter.use(express.json());

/**
 * Manejador POST de /goods. Permite almacenar el documento de un bien.
 */
goodRouter.post('/goods', async (req, res) => {
  const good = new Good(req.body);

  try {
    await good.save();
    res.status(201).send(good);
  } catch (err) {
    res.status(400).send(err);
  }
}); 

/**
 * Manejador GET de /goods. Permite obtener la información de una serie de bienes por cualquiera de sus campos recibidos como query string.
 */
goodRouter.get('/goods', async (req, res) => {
  const { name, description, weight, crowns } = req.query;

  const filter: any = {};
  if (name) filter.name = name;
  if (description) filter.description = description;
  if (weight) filter.weight = Number(weight);
  if (crowns) filter.crowns = Number(crowns);

  try {
    const goods = await Good.find(filter);

    if (goods.length > 0) {
      res.status(200).send(goods);
    } else {
      res.status(404).send({ error: 'Bien no encontrado.' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Manejador GET de /goods. Permite obtener la información de un bien a partir de su ID único pasado como parámetro dinámico.
 */
goodRouter.get('/goods/:id', async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
      if (good) {
        res.send(good);
      } else {
        res.status(404).send({ error: 'Bien no encontrado.' });
      }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Manejador PATCH de /goods. Permite actualizar la información de un bien a partir de la query string de cualquiera de sus campos.
 */
goodRouter.patch('/goods', async (req, res) => {
  const { name, description, weight, crowns } = req.query;

  const filter: any = {};
  if (name) filter.name = name;
  if (description) filter.description = description;
  if (weight) filter.weight = Number(weight);
  if (crowns) filter.crowns = Number(crowns);
  
  if (!req.query.name && !req.query.description && !req.query.weight && !req.query.crowns) {
    res.status(400).send({
      error: 'A name must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['name', 'description','weight', 'crowns'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try {
        const good = await Good.findOneAndUpdate(filter, req.body, {
          new: true,
          runValidators: true,
        });

        if (!good) {
          res.status(404).send();
        } else {
          res.send(good);
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  }
});

/**
 * Manejador PATCH de /goods. Permite actualizar la información de un bien mediante su ID pasado como parámetro dinámico.
 */
goodRouter.patch('/goods/:id', async (req, res) => {
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
      try {
        const good = await Good.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!good) {
          res.status(404).send();
        } else {
          res.send(good);
        }
      } catch (err) {
        res.status(400).send(err);
      }
    }
  }
});

/**
 * Manejador DELETE de /goods. Permite borrar un bien según cualquiera de sus campos.
 */
goodRouter.delete('/goods', async (req, res) => {
  const { name, description, weight, crowns } = req.query;

  const filter: any = {};
  if (name) filter.name = name;
  if (description) filter.description = description;
  if (weight) filter.weight = Number(weight);
  if (crowns) filter.crowns = Number(crowns);

  if (!req.query.name && !req.query.description && !req.query.weight && !req.query.crowns) {
    res.status(400).send({
      error: 'A name must be provided',
    })
  } else {
    try {
      const good = await Good.findOneAndDelete(filter);
      if (!good) {
        res.status(404).send();
      } else {
        res.send(good);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

/**
 * Manejador DELETE de /goods. Permite borrar un bien según su ID pasado como un parámetro dinámico.
 */
goodRouter.delete('/goods/:id', async (req, res) => {
  try {
    const good = await Good.findByIdAndDelete(req.params.id);

    if (!good) {
      res.status(404).send();
    } else {
      res.send(good);
    }
  } catch (err) {
    res.status(500).send();
  }
});