interface Properties {
    tag: string;
    className: string[];
    textContent?: string;
}

interface ButtonProperties {
    className: string[];
    textContent: string;
    handlerFunction: () => void;
}
interface Route {
    url: string;
    handler: () => void;
}

interface Option {
    id?: string;
    title: string;
    weight: string;
}

interface ControlState {
    state: boolean;
    pointer: string;
    className: string;
}
interface Sound {
    sound: boolean;
}
type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

export {
    Properties,
    ButtonProperties,
    Route,
    Option,
    ControlState,
    CustomElement,
    Sound,
};
