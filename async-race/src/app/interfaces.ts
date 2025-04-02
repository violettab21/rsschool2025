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

type NewCar = Omit<Car, 'id'>;

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

export { Properties, CustomElement, ButtonProperties, Car, NewCar };
