import { Transaction } from "../transactions/transaction.js";
import { MerchantInterface } from "../characters/merchant.js";
import { Schema, model } from "mongoose";
import validator from "validator";
import { ClientInterface } from "../characters/client.js";

/**
 * Interfaz BuyTransactionInterface. Representa una transacción de compra de la posada a un mercader.
 */
export interface SellTransactionInterface extends Transaction {
    client: ClientInterface
}

const SellTransactionSchema = new Schema<SellTransactionInterface>({
    client: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    type: {
        type: String,
        default: 'Purchase',
        enum: ['Purchase', 'Refund']
    },
    goods: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Good',
        validate: (value: Schema.Types.ObjectId[]) => {
            if (value.length === 0) {
                throw new Error('La lista de bienes no puede estar vacía.');
            }
        }
    },
    quantities: {
        type: [Number],
        required: true,
        validate: (value: number[]) => {
            if (value.length === 0) {
                throw new Error('La lista de cantidades no puede estar vacía.');
            } else if (value.some((qnt) => qnt <= 0)) {
                throw new Error('Ninguna cantidad puede ser menor o igual a 0.');
            }
        }
    },
    crowns: {
        type: Number,
        required: true,
        validate: (value: number) => {
            if (value <= 0) {
                throw new Error('El precio total de la transacción no puede ser menor o igual a 0.');
            }
        }
    },
    date: {
        type: String,
        required: true,
        validate: (value: string) => {
            if (!validator.default.isDate(value)) {
                throw new Error('La fecha introducidad no tiene el formato correcto.')
            }
        }
    }
});

export const BuyTransaction = model<SellTransactionInterface>('SellTransaction', SellTransactionSchema);