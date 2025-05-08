import express from 'express'
import { Transaction, TransactionInterface } from '../transactions/transaction.js' 
import { Stock } from '../items/stock.js';
import { Good } from '../items/good.js';
import { Merchant } from '../characters/merchant.js';
import { Client } from '../characters/client.js';
import { Document, Types } from 'mongoose';

export const transactionRouter = express.Router();

const port = process.env.PORT || 3000

transactionRouter.use(express.json());

transactionRouter.post('/transactions', async (req, res) => {
    if ((req.body.merchant && req.body.client) || (!req.body.merchant && !req.body.client)) {
        res.status(400).send({ error: 'Una transacción no puede tener un mercader y un cliente al mismo tiempo ni ninguno.' })
    } else if (req.body.crowns) {
        res.status(400).send({ error: 'No puede indicar el precio de la transacción.' });
    } else {
        if (req.body.goods && req.body.quantities && (req.body.goods.length === req.body.quantities.length)) {
            let price: number = 0;
            let indexes: number[] = [];
            let updates: number[] = [];
            let isStored: boolean;

            try {
                if (req.body.merchant) {
                    const merchant = await Merchant.findOne({ name: String(req.body.merchant) });
                    
                    if (merchant) {
                        req.body.merchant = merchant.toObject()._id;
                    } else {
                        res.status(404).send({ error: 'Mercader no encontrado.' });
                        return;
                    }
                    
                } else {
                    const client = await Client.findOne({ name: String(req.body.client) });
                    
                    if (client) {
                        req.body.client = client.toObject()._id;
                    } else {
                        res.status(404).send({ error: 'Cliente no encontrado.' });
                        return;
                    }
                }

                for (let i: number = 0; i < req.body.goods.length; i++) {
                    const good = await Good.findOne({ name: String(req.body.goods[i]) });

                    if (good) {
                        req.body.goods[i] = good.toObject()._id;
                    } else {
                        res.status(404).send({ error: 'Bien no encontrado.' });
                        return;
                    }
                    
                    const stock = await Stock.findOne({ good: req.body.goods[i] });
    
                    isStored = false;
    
                    if (req.body.client) {
                        if (!stock) {
                            res.status(404).send({ error: 'La posada no cuenta con ese bien.' });
                            return;
                        } else if (stock.toObject().quantity < Number(req.body.quantities[i])) {
                            res.status(400).send({ error: 'No hay tanto stock de uno de los productos.' });
                            return;
                        } else {
                            updates.push(Number(stock.toObject().quantity) - Number(req.body.quantities[i]));
                            isStored = true;
                        }
                    } else {
                        if (!stock) {
                            indexes.push(i);
                            updates.push(0);
                            const good = await Good.findById(req.body.goods[i]);
                            price += Number(good!.crowns) * Number(req.body.quantities[i]);
                        } else {
                            updates.push(Number(stock.toObject().quantity) + Number(req.body.quantities[i]));
                            isStored = true;
                        }
                    }
    
                    if (isStored) {
                        const good = await Good.findById(stock!.toObject().good);
                        price += Number(good!.crowns) * Number(req.body.quantities[i]);
                    }
                    
                }
    
                const transaction = new Transaction({ ...req.body, crowns: price });
                
                await transaction.save();
    
                if (req.body.merchant) {
                    await transaction.populate({
                        path: "merchant",
                        select: ["name"]
                    });
                } else {
                    await transaction.populate({
                        path: "client",
                        select: ["name"]
                    });
                }

                await transaction.populate({
                    path: "goods",
                    select: ["name"]
                })
    
                res.status(201).send(transaction);
                
    
                for (let i: number = 0; i < req.body.goods.length; i++) {
                    if (req.body.merchant) {
                      await Stock.findOneAndUpdate(
                        { good: req.body.goods[i] },
                        { $inc: { quantity: Number(req.body.quantities[i]) } },
                        { upsert: true, new: true, runValidators: true }
                      );
                    } else {
                      const goodToDecrease = await Stock.findOneAndUpdate(
                        { good: req.body.goods[i] },
                        { $inc: { quantity: -Number(req.body.quantities[i]) } },
                        { runValidators: true }
                      );
                    }
                  }
                  
            } catch (err) {
                res.status(500).send(err);
            }
        } else {
            res.status(400).send({ error: 'Tiene que haber el mismo número de bienes y cantidades de los mismos intercambiados.' });
        }
    }
});

transactionRouter.get('/transactions', async (req, res) => {
    if (((req.query.merchant && req.query.client) || (!req.query.merchant && !req.query.client)) && !req.query.iniDate) {
        res.status(400).send({ error: 'Una transacción no puede tener un mercader y un cliente al mismo tiempo ni ninguno.' });
    } else if ((req.query.merchant || req.query.client) && (req.query.iniDate && req.query.finDate && req.query.iniTime && req.query.finTime)) {
        res.status(400).send({ error: 'No se puede buscar una transacción por su cliente/mercader y fecha al mismo tiempo.' });
    } else if (req.query.client) {
        try {
            const client = await Client.findOne({ name: req.query.client });

            if (client) {
                const transactions = await Transaction.find({ client: client.toObject()._id }).populate({
                    path: "client",
                    select: ["name"]
                }).populate({
                    path: "goods",
                    select: ["name"]
                });

                if (transactions.length === 0) {
                    res.status(404).send({ error: 'No se han encontrado transacciones de este cliente.' });
                } else {
                    res.send(transactions);
                }
            } else {
                res.status(404).send({ error: 'Cliente no encontrado.' });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else if (req.query.merchant) {
        try {
            const merchant = await Merchant.findOne({ name: req.query.merchant });

            if (merchant) {
                const transactions = await Transaction.find({ merchant: merchant.toObject()._id }).populate({
                    path: "merchant",
                    select: ["name"]
                }).populate({
                    path: "goods",
                    select: ["name"]
                });

                if (transactions.length === 0) {
                    res.status(404).send({ error: 'No se han encontrado transacciones de este mercader.' });
                } else {
                    res.send(transactions);
                }
            } else {
                res.status(404).send({ error: 'Mercader no encontrado.' });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else if (req.query.iniDate && req.query.finDate && req.query.iniTime && req.query.finTime) {
        if (req.query.iniTime <= req.query.finTime || (req.query.iniTime === req.query.finTime && req.query.iniTime <= req.query.finTime)) {
            try {
                const transactions = await Transaction.find({});

                if (transactions.length === 0) {
                    res.status(404).send({ error: 'No hay transacciones.' });
                } else {
                    const rslt: (Document<unknown, {}, TransactionInterface> & TransactionInterface & { _id: Types.ObjectId; } & { __v: number; })[] = [];

                    transactions.forEach((trans) => {
                        if (String(trans.toObject().date) >= req.query.iniDate! && String(trans.toObject().date) <= req.query.finDate! &&
                                String(trans.toObject().time) >= req.query.iniTime! && String(trans.toObject().time) <= req.query.finTime!) {
                            rslt.push(trans);
                        }
                    });

                    if (rslt.length === 0) {
                        res.status(404).send({ error: 'No hay transacciones en ese rango de tiempo.' });
                    } else {
                        res.send(rslt);
                    }
                }
            } catch (err) {
                res.status(500).send(err);
            }
        } else {
            res.status(400).send({ error: 'La fecha y hora inicial tienen que ser anteriores o iguales a la fecha y hora final.' });
        }
    } else {
        res.status(400).send({ error: 'Para buscar por fecha, es necesario que se introduzca fecha inicial y final y hora inicial y final.' });
    }
});


transactionRouter.get('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (transaction) {
            res.send(transaction);
        } else {
            res.status(404).send({ error: 'Transacción no encontrada.' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


transactionRouter.patch("/transactions/:id", async (req, res) => {
    try {
      const allowedUpdates = ["goods"];
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) =>
        allowedUpdates.includes(update)
      );
  
      if (!isValidUpdate) {
        res.status(400).send({ error: "Solo se permite actualizar los bienes de la transacción." });
        return;
      }
  
      const updatedGoods = req.body.goods;
  
      if (!Array.isArray(updatedGoods) || updatedGoods.length === 0) {
        res.status(400).send({ error: "Se requiere una lista de bienes válida." });
        return;
      }
  
      const transaction = await Transaction.findById(req.params.id);
  
      if (!transaction) {
        res.status(404).send({ error: "Transacción no encontrada." });
        return;
      }
  
      const isClient = !!transaction.client; 
      const stockMap: Map<string, number> = new Map();
  
      
      for (let i = 0; i < transaction.goods.length; i++) {
        const goodId = transaction.goods[i].toString();
        const qty = transaction.quantities[i];
  
        const stock = await Stock.findOne({ good: goodId });
        if (!stock) continue;
  
        const currentQty = stockMap.get(goodId) ?? stock.quantity;
  
        if (isClient) {
          stockMap.set(goodId, currentQty + qty); 
        } else {
          const result = currentQty - qty;      
          if (result < 1) {
            res.status(400).send({ error: `Al revertir, el stock del bien ${goodId} quedaría menor que 1.` });
            return;
          }
          stockMap.set(goodId, result);
        }
      }
  
      for (const item of updatedGoods) {
        const stock = await Stock.findOne({ good: item.good });
  
        if (!stock) {
          res.status(404).send({ error: `No se encontró el bien ${item.good}` });
          return;
        }
  
        const currentQty = stockMap.get(item.good) ?? stock.quantity;
        const result = isClient ? currentQty - item.quantity : currentQty + item.quantity;
  
        if (result < 1) {
          res.status(400).send({ error: `El stock del bien ${item.good} quedaría menor que 1 tras el cambio.` });
          return;
        }
  
        stockMap.set(item.good, result);
      }
  
      for (const [goodId, finalQty] of stockMap.entries()) {
        await Stock.findOneAndUpdate(
          { good: goodId },
          { quantity: finalQty },
          { new: true, runValidators: true }
        );
      }
  
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { _id: req.params.id },
        {
          goods: updatedGoods.map((item: any) => item.good),
          quantities: updatedGoods.map((item: any) => item.quantity),
        },
        { new: true, runValidators: true }
      ).populate({
        path: isClient ? "client" : "merchant",
        select: ["name"],
      });
  
      if (updatedTransaction) {
        res.send(updatedTransaction);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

transactionRouter.delete('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    const newQuantities = [];
    let continued = false;
    let newQuantity;

    if (!transaction) {
      res.status(404).send({ error: 'Transacción no encontrada.' });
      return;
    }

    const tx = transaction.toObject();
    const goods = tx.goods;
    const quantities = tx.quantities;
    const isClient = !!tx.client;

    for (let i = 0; i < goods.length; i++) {
      if (continued) {
        continued = false;
        continue;
      }

      const stock = await Stock.findOne({ good: goods[i] });
      if (!stock) continue;

      const allQuantity = stock.quantity;
      const quantity = quantities[i];

      if (isClient) {
        newQuantity = allQuantity + quantity;
      } else {
        newQuantity = allQuantity - quantity;
      }

      if (newQuantity < 0) {
        res.status(400).send({
          error: `Stock insuficiente para bien ${goods[i]}`,
        });
        return;
      }

      const currentId = goods[i]?.toString();
      const nextId = goods[i + 1]?.toString();

      if (currentId === nextId) {
        newQuantity += isClient ? quantities[i + 1] : -quantities[i + 1];
        continued = true;
      }

      newQuantities.push({ good: goods[i], quantity: newQuantity });
    }

    for (const item of newQuantities) {
      await Stock.findOneAndUpdate(
        { good: item.good },
        { quantity: item.quantity },
        { runValidators: true }
      );
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.send(transaction);

  } catch (err) {
    res.status(500).send(err);
  }
});