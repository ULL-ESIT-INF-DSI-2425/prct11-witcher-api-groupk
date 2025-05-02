import { model, Schema } from "mongoose";
import { GoodInterface } from "../items/good.js";
import validator from "validator";

/**
 * Interfaz Transaction. Representa a una transacción.
 */
export interface TransactionInterface extends Document {
    merchant: Schema.Types.ObjectId,
    client: Schema.Types.ObjectId,
    type: 'Purchase' | 'Refund',
    goods: Schema.Types.ObjectId[],
    quantities: number[],
    crowns: number,
    date: string
}

const TransactionSchema = new Schema<TransactionInterface>({
    merchant: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant'
    },
    client: {
        type: Schema.Types.ObjectId,
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

export const Transaction = model<TransactionInterface>('BuyTransaction', TransactionSchema);