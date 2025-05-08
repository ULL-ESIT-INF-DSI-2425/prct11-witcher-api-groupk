import { PersonInterface } from "./person.js"
import { connect, model, Schema } from 'mongoose';
import validator from 'validator';

/**
 * Interfaz Client. Representa a un cliente.
 */
export interface ClientInterface extends PersonInterface {
  race: 'Human' | 'Elf' | 'Dwarf' | 'Wizard'
}

/**
 * Esquema ClientSchema. 
 * Representa toda la información que se ha de almacenar sobre un cliente: nombre, localización y raza.
 */
const ClientSchema = new Schema<ClientInterface>({
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
	race: {
		type: String,
		default: 'Human',
		enum: ['Human', 'Elf', 'Dwarf', 'Wizard']
	}
});

export const Client = model<ClientInterface>('Client', ClientSchema);