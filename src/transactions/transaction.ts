import { Schema } from "mongoose";
import { GoodInterface } from "../items/good.js";

/**
 * Interfaz Transaction. Representa a una transacción.
 */
export interface Transaction extends Document {
    type: 'Purchase' | 'Refund',
    goods: Schema.Types.ObjectId[],
    quantities: number[],
    crowns: number,
    date: string
}