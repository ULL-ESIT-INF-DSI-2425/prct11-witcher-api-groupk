import express from 'express'
import { Transaction } from '../transactions/transaction.js' 
import { Stock } from '../items/stock.js';
import { Good } from '../items/good.js';

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
            
            for (let i: number = 0; i < req.body.goods.length; i++) {
                try {
                    const stock = await Stock.findOne({ good: req.body.goods[i] });

                    isStored = false;

                    if (req.body.client) {
                        if (!stock) {
                            res.status(404).send();
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
                } catch (err) {
                    res.status(500).send(err);
                    return;
                }
            }

            const transaction = new Transaction({ ...req.body, crowns: price });

            try {
                await transaction.save();
                res.status(201).send(transaction);
            } catch (err) {
                res.status(400).send(err);
                return;
            }

            for (let i: number = 0; i < req.body.goods.length; i++) {
                try {
                    if (req.body.merchant) {
                        if (indexes.includes(i)) {
                            const newGood = new Stock({ good: req.body.goods[i], quantity: Number(req.body.quantities[i]) });
                            await newGood.save();
                        } else {
                            const goodToIncrease = await Stock.findOneAndUpdate({ good: req.body.goods[i] }, { quantity: updates[i] }, { runValidators: true });
                        }
                    } else {
                        const goodToDecrease = await Stock.findOneAndUpdate({ good: req.body.goods[i] }, { quantity: updates[i] }, { runValidators: true });
                    }
                } catch (err) {
                    res.status(500).send(err);
                    return;
                }
            }
        } else {
            res.status(400).send({ error: 'Tiene que haber el mismo número de bienes y cantidades de los mismos intercambiados.' });
        }
    }
});