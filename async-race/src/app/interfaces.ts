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

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

export { Properties, CustomElement, ButtonProperties };
