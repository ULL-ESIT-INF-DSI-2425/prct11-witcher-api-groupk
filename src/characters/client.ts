import { Person } from "./person.js"

/**
 * Interfaz Client. Representa a un cliente.
 */
export interface Client extends Person {
    race: 'Human' | 'Elf' | 'Dwarf' | 'Wizard'
}