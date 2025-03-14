import { Button } from './button';
import { ElementBase } from './element';
import { ParseListModal } from './ParseListModal';
import { Picker } from './picker';
import type { Main } from './main';
import { LocalStorage } from './localStorage';
export interface Option {
    id: string;
    title: string;
    weight: string;
}
class OptionsPage {
    public buttonsContainer: ElementBase;
    public optionsContainer: ElementBase;

    constructor(main: Main) {
        this.buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['buttons'],
        });
        this.optionsContainer = new ElementBase({
            tag: 'div',
            className: ['options'],
        });
        this.configureButtonsView(main);
        this.configureOptionsView();
    }

    public configureButtonsView(main: Main): void {
        const addOptions = new Button({
            className: ['add_option'],
            textContent: 'Add Option',
            handlerFunction: this.addOptionElement.bind(this),
        });
        const start = new Button({
            className: ['start'],
            textContent: 'Start',
            handlerFunction: (): void => {
                if (main.content instanceof OptionsPage) {
                    const localStorage = new LocalStorage(
                        'decision-maker_options'
                    );
                    localStorage.saveData(this.getOptions());
                    main.content.optionsContainer.element.remove();
                    main.content.buttonsContainer.element.remove();
                    main.content = new Picker(main);
                }
            },
        });
        const parseList = new Button({
            className: ['parse_list'],
            textContent: 'Parse List',
            handlerFunction: this.parseListHandler.bind(
                this,
                main.main.element
            ),
        });
        const saveToJSON = new Button({
            className: ['save'],
            textContent: 'Save options to File',
            handlerFunction: this.saveOptionsToFile.bind(this),
        });
        const inputFile = new ElementBase({
            tag: 'input',
            className: ['file-input'],
        });
        inputFile.element.id = 'upload-file';
        if (inputFile.element instanceof HTMLInputElement) {
            const input = inputFile.element;
            input.type = 'file';
            input.addEventListener('change', () => {
                console.log('readfile');
                let listOfOptions: Option[];
                if (input.files) {
                    console.log('readfile2');
                    const file = input.files[0];
                    console.log(file);
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.addEventListener('load', () => {
                        if (typeof reader.result === 'string') {
                            const result = reader.result;
                            if (typeof JSON.parse(result) === 'object') {
                                listOfOptions = JSON.parse(result) as Option[];
                                console.log(listOfOptions);
                                this.clearAllOptions();
                                this.creationOptionsBasedOnFileData(
                                    listOfOptions
                                );
                            }
                        }
                    });
                }
            });
            if (input.type === 'file') {
                input.accept = 'application/json';
            }
        }
        inputFile.element.style.display = 'none';

        const upload = new Button({
            className: ['upload'],
            textContent: 'Upload options from File',
            handlerFunction: (): void => {
                const upload = document.getElementById('upload-file');
                if (upload !== null) {
                    upload.click();
                }
            },
        });
        const clear = new Button({
            className: ['clear'],
            textContent: 'Clear All Options',
            handlerFunction: this.clearAllOptions.bind(this),
        });
        this.buttonsContainer.element.append(
            addOptions.element,
            start.element,
            parseList.element,
            saveToJSON.element,
            upload.element,
            inputFile.element,
            clear.element
        );
        main.main.element?.append(this.buttonsContainer.element);
    }

    public configureOptionsView(): void {
        this.buttonsContainer.element.before(this.optionsContainer.element);
        this.addOptionElement();
    }
    public addOptionElement(): void {
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
        const weight = new ElementBase({
            tag: 'input',
            className: ['option__input'],
        });
        const deleteBtn = new Button({
            className: ['delete'],
            textContent: 'Delete',
            handlerFunction: function (event?: Event): void {
                if (event) {
                    const optionToDelete = (event.target as Node).parentElement;
                    if (optionToDelete) optionToDelete.remove();
                }
            },
        });
        option.element.append(
            number.element,
            name.element,
            weight.element,
            deleteBtn.element
        );

        this.optionsContainer?.element.append(option.element);
    }
    public addOptionElementFromModal(
        optionData: { title: string; weight: string }[]
    ): void {
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
                handlerFunction: function (event?: Event): void {
                    if (event) {
                        const optionToDelete = (event.target as Node)
                            .parentElement;
                        if (optionToDelete) optionToDelete.remove();
                    }
                },
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
    public parseListHandler(main: HTMLElement): void {
        const modal = new ParseListModal(this);
        main.append(modal.modalContainer.element);
    }
    public saveOptionsToFile(): void {
        const json = JSON.stringify(this.getOptions());
        const file = new File([json], 'options.json', {
            type: 'application/json',
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'options.json';
        link.click();
    }

    public creationOptionsBasedOnFileData(
        options: { id: string; title: string; weight: string }[]
    ): void {
        options.forEach((el) => {
            const option = new ElementBase({
                tag: 'div',
                className: ['option'],
            });
            const number = new ElementBase({
                tag: 'p',
                className: ['option__number'],
                textContent: `#${el.id}`,
            });
            const name = new ElementBase({
                tag: 'input',
                className: ['option__input'],
            });
            if (name.element instanceof HTMLInputElement) {
                name.element.value = el.title;
            }

            const weight = new ElementBase({
                tag: 'input',
                className: ['option__input'],
            });
            if (weight.element instanceof HTMLInputElement) {
                weight.element.value = el.weight;
            }
            const deleteBtn = new Button({
                className: ['delete'],
                textContent: 'Delete',
                handlerFunction: function (event?: Event): void {
                    if (event) {
                        const optionToDelete = (event.target as Node)
                            .parentElement;
                        if (optionToDelete) optionToDelete.remove();
                    }
                },
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
    public clearAllOptions(): void {
        const numberChildren = this.optionsContainer.element.children.length;
        if (numberChildren !== 0) {
            const options = this.optionsContainer.element.children;
            Array.from(options).forEach((el) => el.remove());
        }
    }
    protected getOptions(): Option[] {
        const numberChildren = this.optionsContainer.element.children.length;
        const optionsList: Option[] = [];
        if (numberChildren !== 0) {
            const options = this.optionsContainer.element.children;
            for (const child of options) {
                const optionDetails = Array.from(child.children).slice(0, 3);
                const listOfValues = optionDetails.map((element) => {
                    if (element instanceof HTMLInputElement) {
                        return element.value ? element.value : '';
                    } else
                        return element.textContent ? element.textContent : '';
                });
                const [id, title, weight] = listOfValues;
                const option: Option = { id: id, title: title, weight: weight };
                optionsList.push(option);
            }
        }
        return optionsList;
    }
}
export { OptionsPage };
