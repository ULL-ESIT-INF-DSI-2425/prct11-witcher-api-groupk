import { PersonInterface } from "./person.js"
import { connect, model, Schema } from 'mongoose';
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/witcher-app').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

/**
 * Interfaz Client. Representa a un cliente.
 */
export interface ClientInterface extends PersonInterface {
  race: 'Human' | 'Elf' | 'Dwarf' | 'Wizard'
}

const ClientSchema = new Schema<ClientInterface>({
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
	race: {
		type: String,
		default: 'Human',
		enum: ['Human', 'Elf', 'Dwarf', 'Wizard']
	}
});

export const Client = model<ClientInterface>('Client', ClientSchema);