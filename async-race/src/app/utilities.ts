import type {
    Car,
    Engine,
    Winner,
    GarageState,
    WinnersState,
} from './interfaces';

function isCar(data: unknown): data is Car {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<Car> = data;
    return typeof object.name === 'string';
}

function isEngine(data: unknown): data is Engine {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<Engine> = data;
    return typeof object.velocity === 'number';
}

function isWinner(data: unknown): data is Winner {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<Winner> = data;
    return typeof object.wins === 'number';
}
function isWinners(data: unknown): data is Winner[] {
    if (!Array.isArray(data) || data === null) {
        return false;
    } else if (
        Array.isArray(data) &&
        !data.every((element) => isWinner(element))
    )
        return false;
    return typeof data[0]?.wins === 'number' || data.length === 0;
}

function isCars(data: unknown): data is Car[] {
    if (!Array.isArray(data) || data === null) {
        return false;
    } else if (Array.isArray(data) && !data.every((element) => isCar(element)))
        return false;
    return typeof data[0]?.name === 'string' || data.length === 0;
}

function isGarageState(data: unknown): data is GarageState {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<GarageState> = data;
    return typeof object.createCarName === 'string';
}

function isWinnersState(data: unknown): data is WinnersState {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<WinnersState> = data;
    return typeof object.winsSort === 'string';
}
export {
    isCar,
    isCars,
    isEngine,
    isWinner,
    isWinners,
    isGarageState,
    isWinnersState,
};
