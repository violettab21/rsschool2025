import { Button } from './button';
import { ElementBase } from './element';
class OptionsPage {
    public pageTitle: ElementBase;
    public buttonsContainer: ElementBase;
    public optionsContainer: ElementBase;

    constructor() {
        this.pageTitle = new ElementBase({
            tag: 'p',
            className: ['title'],
            textContent: 'Decision Making Tool',
        });
        this.buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['buttons'],
        });
        this.optionsContainer = new ElementBase({
            tag: 'div',
            className: ['options'],
        });
        this.configurePageView();
        this.configureButtonsView();
        this.configureOptionsView();
    }
    public configurePageView(): void {
        const main = new ElementBase({ tag: 'main', className: ['main'] });
        main.element.append(this.pageTitle.element);
        document.querySelector('body')?.append(main.element);
    }

    public configureButtonsView(): void {
        const addOptions = new Button({
            className: ['add_option'],
            textContent: 'Add Option',
            handlerFunction: this.addOptionElement.bind(this),
        });
        const start = new Button({
            className: ['start'],
            textContent: 'Start',
            handlerFunction: this.addOptionElement.bind(this),
        });
        this.buttonsContainer.element.append(addOptions.element, start.element);
        document.querySelector('main')?.append(this.buttonsContainer.element);
    }
    public configureOptionsView(): void {
        this.buttonsContainer.element.before(this.optionsContainer.element);
        this.addOptionElement();
    }
    public addOptionElement(): void {
        const option = new ElementBase({ tag: 'div', className: ['option'] });
        const number = new ElementBase({
            tag: 'p',
            className: ['optition__number'],
            textContent: `#${this.generateIdForOption()}`,
        });
        const name = new ElementBase({
            tag: 'input',
            className: ['optition__input'],
        });
        const weight = new ElementBase({
            tag: 'input',
            className: ['optition__input'],
        });
        const deleteBtn = new Button({
            className: ['delete'],
            textContent: 'Delete',
            handlerFunction: this.addOptionElement.bind(this),
        });
        option.element.append(
            number.element,
            name.element,
            weight.element,
            deleteBtn.element
        );

        this.optionsContainer?.element.append(option.element);
    }
    public generateIdForOption(): number {
        let value: string | null;
        let id: number = 0;
        const numberChildren = this.optionsContainer.element.children.length;
        if (numberChildren === 0) return 1;
        else {
            const lastChild: Element | null =
                this.optionsContainer.element.children.item(numberChildren - 1);
            if (lastChild !== null) {
                value = lastChild.children.item(0)!.textContent;
                if (value) id = parseInt(value.slice(1));
            }
        }
        return id + 1;
    }
}

export { OptionsPage };
