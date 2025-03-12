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

export { Properties, ButtonProperties };
