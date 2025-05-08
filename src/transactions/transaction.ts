import { model, Schema } from "mongoose";
import { GoodInterface } from "../items/good.js";
import validator from "validator";

/**
 * Interfaz Transaction. Representa a una transacción.
 */
export interface TransactionInterface extends Document {
    merchant: Schema.Types.ObjectId,
    client: Schema.Types.ObjectId,
    goods: Schema.Types.ObjectId[],
    quantities: number[],
    crowns: number,
    date: string,
    time: string
}

/**
 * Esquema TransactionSchema.
 * Almacena la información que ha de tener una transacción, esta puede ser con un mercader o un cliente (se controlo mediante los manejadores).
 * Conlleva una serie de bienes y cantidades intercambiadas, esto se hace en una fecha y hora y por un precio en coronas.
 */
const TransactionSchema = new Schema<TransactionInterface>({
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'Merchant'
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
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
              throw new Error('La fecha introducida no tiene el formato correcto.')
          }
      }
  },
  time: {
      type: String,
      required: true,
      validate: (value: string) => {
          if (!validator.default.isTime(value)) {
              throw new Error('La hora introducida no tiene el formato correcto.')
          }
      }
  }
});

export const Transaction = model<TransactionInterface>('Transaction', TransactionSchema);