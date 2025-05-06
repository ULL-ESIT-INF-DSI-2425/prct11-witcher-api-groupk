import { PersonInterface } from "./person.js"
import { connect, model, Schema } from 'mongoose';
import validator from 'validator';

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
        trim: true,
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
        trim: true,
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

export const Merchant = model<MerchantInterface>('Merchant', MerchantSchema);