/**
 * Clase Date. Representa a una fecha
 */
export class Date {

    /**
     * Constructor de Date
     * @param _day - Día
     * @param _month - Mes
     * @param _year - Año
     */
    constructor(
      private readonly _day: number, 
      private readonly _month: number, 
      private readonly _year: number) {
        if (_day < 1 || _month < 1 || _month > 12 || _year < 1 || 
            (_month === 2 && ((_year % 4 === 0 && (_year % 100 !== 0 || _year % 400) && _day > 29) || _day > 28)) ||
            ((_month === 4 || _month === 6 || _month === 9 || _month === 11) && _day > 30) || (_day > 31)) {
              throw new Error("Formato de fecha incorrecto.");
        }
    }

    /**
     * Getter de day
     */
    get day() {
      return this._day;
    }

    /**
     * Getter de month
     */
    get month() {
      return this._month;
    }

    /**
     * Getter de year
     */
    get year() {
      return this._year;
    }
  
    /**
     * Crea una cadena que representa a una fecha en el formato DD/MM/AAAA
     * @returns String de forma DD/MM/AAAA
     */
    getDate(): string {
      return `${this._day}/${this._month}/${this._year}`;
    }

    /**
     * Compara si la fecha es menor o igual que otra
     * @param date2 - Fecha con la que comparar
     * @returns True si es menor o igual que la otra fecha, false en caso contrario
     */
    isLowerOrEqualThan(date2: Date): boolean {
      return this._year < date2.year || (this.year === date2.year && (this._month < date2.month || (this.month === date2.month && this.day <= date2.day)));
    }
  }