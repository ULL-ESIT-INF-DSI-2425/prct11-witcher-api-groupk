import express from 'express'
import { Merchant } from '../characters/merchant.js' 

/**
 * Router de mercaderes.
 */
export const merchantRouter = express.Router();

const port = process.env.PORT || 3000

merchantRouter.use(express.json());

/**
 * Manejador POST de /merchants. Permite guardar la información de un mercader en la base de datos.
 */
merchantRouter.post('/merchants', async (req, res) => {
  const merchant = new Merchant(req.body);

  try {
    await merchant.save();
    res.status(201).send(merchant);
  } catch (err) {
    res.status(400).send(err);
  }
}); 

/**
 * Manejador GET de /merchants. Permite obtener la información de un mercader a partir de su nombre pasado como query string.
 */
merchantRouter.get('/merchants', async (req, res) => {
  const name = req.query.name as string;

  try {
    const merchant = await Merchant.find({ name: name });
    
    if (merchant.length > 0) {
      res.send(merchant);
    } else {
      res.status(404).send({ error: 'Mercader no encontrado.' });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Manejador GET de /merchants. Permite obtener la información de un mercader a partir de su ID pasado como parámetro dinámico.
 */
merchantRouter.get('/merchants/:id', async (req, res) => {
    try {
      const merchant = await Merchant.findById(req.params.id);
      if (merchant) {
        res.send(merchant);
      } else {
        res.status(404).send({ error: 'Mercader no encontrado.' });
      }
    } catch (err) {
      res.status(500).send(err);
    }
});

/**
 * Manejador PATCH de /merchants. Permite actualizar la información de un mercader a partir de su nombre pasado como query string.
 */
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

/**
 * Manejador PATCH de /merchants. Permite actualizar la información de un mercader a partir de su ID pasado como parámetro dinámico.
 */
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

/**
 * Manejador DELETE de /merchants. Permite borrar a un mercader de la base de datos a partir de su nombre pasado como query string.
 */
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

/**
 * Manejador DELETE de /merchants. Permite borrar a un mercader de la base de datos a partir de su ID pasado como parámetro dinámico.
 */
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