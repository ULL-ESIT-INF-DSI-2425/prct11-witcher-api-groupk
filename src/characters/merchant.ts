import { Person } from "./person.js"

/**
 * Interfaz Merchant. Representa a un mercader
 */
export interface Merchant extends Person {
    type: 'Blacksmith' | 'Alchemist' | 'General'
}