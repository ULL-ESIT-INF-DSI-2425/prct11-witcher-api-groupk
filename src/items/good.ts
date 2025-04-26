import { connect, model, Schema } from 'mongoose';
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/witcher-app').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

/**
 * Interfaz Good. Representa a un bien.
 */
export interface GoodInterface {
    name: string,
    description: string,
    weight: number,
    crowns: number
}

const GoodSchema = new Schema<GoodInterface>({
    name: {
        type: String,
        unique: true,
        required: true,
        validate: (value: string) => {
            if (!value.match(/^[A-Z]/)) {
                throw new Error('El nombre debe comenzar con mayúscula.');
            } else if (!validator.default.isAlphanumeric(value)) {
                throw new Error('El nombre solo puede contener caracteres alfanuméricos.');
            }
        }
    },
    description: {
        type: String,
        required: true,
        validate: (value: string) => {
            if (!value.match(/^[A-Z]/)) {
                throw new Error('La descripción debe comenzar con mayúscula.');
            } else if (!validator.default.isAlphanumeric(value)) {
                throw new Error('La descripción solo puede contener caracteres alfanuméricos.');
            }
        }
    },
    weight: {
        type: Number,
        default: 1,
        validate: (value: number) => {
            if (value <= 0) {
                throw new Error('El peso del bien tiene que ser positivo y mayor que 0.');
            }
        }
    },
    crowns: {
        type: Number,
        default: 1,
        validate: (value: number) => {
            if (value <= 0) {
                throw new Error('El peso del bien tiene que ser positivo y mayor que 0.');
            }
        }
    }
});

export const Good = model<GoodInterface>('Good', GoodSchema);