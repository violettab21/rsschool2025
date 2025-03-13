import { Button } from './button';
import { ElementBase } from './element';
import { ParseListModal } from './ParseListModal';
class OptionsPage {
    public pageTitle: ElementBase;
    public buttonsContainer: ElementBase;
    public optionsContainer: ElementBase;
    public main: ElementBase;

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
        this.main = new ElementBase({ tag: 'main', className: ['main'] });
        this.configurePageView();
        this.configureButtonsView();
        this.configureOptionsView();
    }
    public configurePageView(): void {
        this.main.element.append(this.pageTitle.element);
        document.querySelector('body')?.append(this.main.element);
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
        const parseList = new Button({
            className: ['parse_list'],
            textContent: 'Parse List',
            handlerFunction: this.parseListHandler.bind(this),
        });
        this.buttonsContainer.element.append(
            addOptions.element,
            start.element,
            parseList.element
        );
        document.querySelector('main')?.append(this.buttonsContainer.element);
    }
    public configureOptionsView(): void {
        this.buttonsContainer.element.before(this.optionsContainer.element);
        this.addOptionElement();
    }
    public addOptionElement(
        optionData?: { title: string; weight: string }[]
    ): void {
        if (!optionData) {
            const option = new ElementBase({
                tag: 'div',
                className: ['option'],
            });
            const number = new ElementBase({
                tag: 'p',
                className: ['optition__number'],
                textContent: `#${this.generateIdForOption()}`,
            });
            const name = new ElementBase({
                tag: 'input',
                className: ['option__input'],
            });
            const weight = new ElementBase({
                tag: 'input',
                className: ['option__input'],
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
        } else {
            optionData.forEach((optionRow) => {
                const option = new ElementBase({
                    tag: 'div',
                    className: ['option'],
                });
                const number = new ElementBase({
                    tag: 'p',
                    className: ['option__number'],
                    textContent: `#${this.generateIdForOption()}`,
                });
                const name = new ElementBase({
                    tag: 'input',
                    className: ['option__input'],
                });
                if (name.element instanceof HTMLInputElement)
                    name.element.value = optionRow.title;
                const weight = new ElementBase({
                    tag: 'input',
                    className: ['option__input'],
                });
                if (weight.element instanceof HTMLInputElement)
                    weight.element.value = optionRow.weight;
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
            });
        }
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
    public parseListHandler(): void {
        const modal = new ParseListModal(this);
        this.main.element.append(modal.modalContainer.element);
    }
}

export { OptionsPage };
