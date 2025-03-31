import type { CustomElement } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';

export class GaragePage {
    public content: CustomElement;
    constructor() {
        this.content = new ElementBase({
            tag: 'main',
            className: ['main'],
        }).element;
        document.body.append(this.content);
        this.configurePage();
    }

    public configurePage(): void {
        const garagePageMenu = createGaragePageMenu();
        this.content.append(garagePageMenu);
    }
}

function createGaragePageMenu(): CustomElement {
    const pageMenuContainer = new ElementBase({
        tag: 'div',
        className: ['garage-page-menu'],
    }).element;

    pageMenuContainer.append(
        createTopLevelButtons(),
        createForm(),
        createBottomLevelButtons()
    );

    return pageMenuContainer;
}

function createTopLevelButtons(): CustomElement {
    const buttonsContainer = new ElementBase({
        tag: 'div',
        className: ['garage-page-top-buttons'],
    }).element;

    const toGarageButton = new Button({
        className: ['garage-button'],
        textContent: 'To Garage',
        handlerFunction: (): void => {},
    }).element;

    const toWinnersButton = new Button({
        className: ['winners-button'],
        textContent: 'To Winners',
        handlerFunction: (): void => {},
    }).element;
    buttonsContainer.append(toGarageButton, toWinnersButton);

    return buttonsContainer;
}

function createBottomLevelButtons(): CustomElement {
    const buttonsContainer = new ElementBase({
        tag: 'div',
        className: ['garage-page-bottom-buttons'],
    }).element;

    const raceButton = new Button({
        className: ['garage-button'],
        textContent: 'Race',
        handlerFunction: (): void => {},
    }).element;

    const resetButton = new Button({
        className: ['winners-button'],
        textContent: 'Reset',
        handlerFunction: (): void => {},
    }).element;

    const generateCarsButton = new Button({
        className: ['winners-button'],
        textContent: 'Generate Cars',
        handlerFunction: (): void => {},
    }).element;

    buttonsContainer.append(raceButton, resetButton, generateCarsButton);

    return buttonsContainer;
}

function createForm(): CustomElement {
    const formContainer = new ElementBase({
        tag: 'div',
        className: ['garage-form'],
    }).element;
    formContainer.append(createCarForm(), updateCarForm());
    return formContainer;
}

function createCarForm(): CustomElement {
    const createRowContainer = new ElementBase({
        tag: 'div',
        className: ['create-car-row'],
    }).element;

    const newCarInput = new ElementBase({
        tag: 'input',
        className: ['create-car-input'],
    }).element;

    const NewCarColor = new ElementBase({
        tag: 'input',
        className: ['create-car-color'],
    }).element;

    const NewCarButton = new ElementBase({
        tag: 'button',
        className: ['create-car'],
        textContent: 'Create',
    }).element;

    createRowContainer.append(newCarInput, NewCarColor, NewCarButton);
    return createRowContainer;
}

function updateCarForm(): CustomElement {
    const updateRowContainer = new ElementBase({
        tag: 'div',
        className: ['update-car-row'],
    }).element;

    const updateCarInput = new ElementBase({
        tag: 'input',
        className: ['update-car-input'],
    }).element;

    const updatedCarColor = new ElementBase({
        tag: 'input',
        className: ['update-car-color'],
    }).element;

    const updateCarButton = new ElementBase({
        tag: 'button',
        className: ['update-car'],
        textContent: 'Update',
    }).element;

    updateRowContainer.append(updateCarInput, updatedCarColor, updateCarButton);

    return updateRowContainer;
}
