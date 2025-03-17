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
export { Properties, ButtonProperties, Route, Option };
