import { Schema, connect, model } from "mongoose";
import { Good, GoodInterface } from "./good.js";

/**
 * Interfaz StockInterface. Representa al stock de la posada.
 */
interface StockInterface extends Document {
    good: GoodInterface,
    quantity: number
}

/**
 * Esquema StockSchema.
 * Almacena la información del stock de los bienes en la posada, un par bien y cantidad.
 */
const StockSchema = new Schema<StockInterface>({
    good: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Good'
    },
    quantity: {
        type: Number,
        default: 1,
        validate: (value: number) => {
            if (value < 0) {
                throw new Error('La cantidad del stock tiene que ser mínimo de 1.');
            }
        }
    }
});

export const Stock = model<StockInterface>('Stock', StockSchema);