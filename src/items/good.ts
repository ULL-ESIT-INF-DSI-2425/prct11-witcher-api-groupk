/**
 * Interfaz Good. Representa a un bien.
 */
export interface Good {
    name: string,
    description: string,
    materials: string[],
    weight: number,
    crowns: number
}