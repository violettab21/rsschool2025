import type { Car } from './interfaces';

function isCar(data: unknown): data is Car {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<Car> = data;
    return typeof object.name === 'string';
}

function isCars(data: unknown): data is Car[] {
    if (!Array.isArray(data) || data === null) {
        return false;
    } else if (Array.isArray(data) && !data.every((element) => isCar(element)))
        return false;
    return typeof data[0]?.name === 'string' || data.length === 0;
}

export { isCar, isCars };
