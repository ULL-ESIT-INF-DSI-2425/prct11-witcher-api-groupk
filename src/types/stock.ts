import { Good } from "../items/good.js"

/**
 * Tipo Stock. Representa la relación entre un bien y su cantidad.
 */
export type Stock = {
    good: Good,
    quantity: number
}