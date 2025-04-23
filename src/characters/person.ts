import { Document } from "mongoose";

/**
 * Interfaz Person. Representa a una persona.
 */
export interface PersonInterface extends Document {
    name: string,
    location: string
}