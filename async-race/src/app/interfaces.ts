interface Properties {
    tag: string;
    className: string[];
    textContent?: string;
}

interface ButtonProperties {
    className: string[];
    textContent: string;
    handlerFunction: (event?: Event) => void;
}

interface Car {
    name: string;
    color: string;
    id: number;
}

interface Engine {
    velocity: number;
    distance: number;
}

interface Winner {
    id: number;
    wins: number;
    time: number;
}

interface GarageState {
    pageNumber: number;
    selectedCarId: number;
    createCarName: string;
    createCarColor: string;
    updateCarName: string;
    updateCarColor: string;
}

interface WinnersState {
    pageNumber: number;
    winsSort: string;
    timeSort: string;
}

type NewWinner = Omit<Winner, 'id'>;

type NewCar = Omit<Car, 'id'>;

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

interface Route {
    url: string;
    handler: () => void;
}

export {
    Properties,
    CustomElement,
    ButtonProperties,
    Car,
    NewCar,
    Engine,
    Winner,
    NewWinner,
    Route,
    GarageState,
    WinnersState,
};
