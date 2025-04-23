import { PersonInterface } from "./person.js"
import { connect, model, Schema } from 'mongoose';
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/witcher-app').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

/**
 * Interfaz Merchant. Representa a un mercader
 */
export interface MerchantInterface extends PersonInterface {
    type: 'Blacksmith' | 'Alchemist' | 'General'
}

const MerchantSchema = new Schema<MerchantInterface>({
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
    location: {
        type: String,
        default: 'Drakenborg',
        validate: (value: string) => {
            if (!value.match(/^[A-Z]/)) {
                throw new Error('La localización debe comenzar con mayúscula.');
            } else if (!validator.default.isAlphanumeric(value)) {
                throw new Error('La localización solo puede contener caracteres alfanuméricos.');
            }
        }
    },
    type: {
        type: String,
        default: 'General',
        enum: ['General', 'Blacksmith', 'Alchemist']
    }
});

const Client = model<MerchantInterface>('Merchant', MerchantSchema);