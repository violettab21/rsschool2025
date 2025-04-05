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

type NewCar = Omit<Car, 'id'>;

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

export {
    Properties,
    CustomElement,
    ButtonProperties,
    Car,
    NewCar,
    Engine,
    Winner,
};
