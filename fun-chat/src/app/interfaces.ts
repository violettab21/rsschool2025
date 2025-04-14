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
type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

export { Properties, ButtonProperties, CustomElement };
