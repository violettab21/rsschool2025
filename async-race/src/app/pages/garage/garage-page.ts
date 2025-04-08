import type { CustomElement, Car, GarageState } from '../../interfaces';
import { ElementBase } from '../../components/elements';
import { Button } from '../../components/buttons';
import { GarageAPI } from '../../api/garage-api';
import { isCar, isCars, isWinner } from '../../utilities';
import { ItemsPerPageGarage } from '../../constants';
import type { Main } from '../../components/main';
import { WinnersAPI } from '../../api/winners-api';
import type { Router } from '../../components/router';
import type { State } from '../../state/state';
import { Pagination } from '../../components/pagination';
import { Garage } from './garage';
import { createCarsContainer } from './garage';

export class GaragePage {
    public pagination: Pagination;
    public createRowContainer: CustomElement;
    public updateRowContainer: CustomElement;
    public garage: Garage;
    public garageContainer: CustomElement;
    public apiGarage: GarageAPI;
    public apiWinners: WinnersAPI;
    public selectedCarId: number;
    public carsNumber: number;
    public isRace: boolean;
    public winner: CustomElement | null;
    public state: State;

    constructor(main: Main, router: Router, state: State) {
        this.state = state;
        this.winner = null;
        this.isRace = false;
        this.carsNumber = 0;
        this.apiGarage = new GarageAPI();
        this.apiWinners = new WinnersAPI();
        const garageData = this.state.getGarageState();
        if (garageData) {
            this.selectedCarId = garageData.selectedCarId;
            const pageNumber = garageData.pageNumber;
            this.pagination = new Pagination(ItemsPerPageGarage, pageNumber);
        } else {
            this.pagination = new Pagination(ItemsPerPageGarage, 1);
            this.selectedCarId = 0;
        }
        this.createRowContainer = new ElementBase({
            tag: 'div',
            className: ['create-car-row'],
        }).element;
        this.createCarForm();
        this.updateRowContainer = new ElementBase({
            tag: 'div',
            className: ['update-car-row'],
        }).element;
        this.updateCarForm();
        this.garage = new Garage(this);
        this.garageContainer = new ElementBase({
            tag: 'div',
            className: ['garage'],
        }).element;
        this.getAllCarsCount()
            .then((number) => {
                this.carsNumber = number;
                this.createGarageContainer(this.pagination.pageNumber);
                this.configurePage(main, router);
            })
            .catch((error: Error) => console.log(error));
    }

    public configurePage(main: Main, router: Router): void {
        const garagePageMenu = this.createGaragePageMenu(router);
        if (main.main instanceof Element)
            main.main.append(garagePageMenu, this.garageContainer);
        this.garage
            .populateGarage(this.pagination.pageNumber)
            .then(() => {})
            .catch(() => {});
    }
    public createGaragePageMenu(router: Router): CustomElement {
        const pageMenuContainer = new ElementBase({
            tag: 'div',
            className: ['garage-page-menu'],
        }).element;

        pageMenuContainer.append(
            this.createTopLevelButtons(router),
            this.createForm(),
            this.createBottomLevelButtons()
        );

        return pageMenuContainer;
    }
    public createCarForm(): void {
        const newCarInput = new ElementBase({
            tag: 'input',
            className: ['create-car-input'],
        }).element;
        const newCarColor = new ElementBase({
            tag: 'input',
            className: ['create-car-color'],
        }).element;
        const newCarButton = new Button({
            className: ['create-car'],
            textContent: 'Create',
            handlerFunction: (): void => {
                this.garage.createCarHandler().then(
                    () => {},
                    (error) => console.log(error)
                );
            },
        }).element;
        if (
            newCarInput instanceof HTMLInputElement &&
            newCarColor instanceof HTMLInputElement
        ) {
            newCarColor.type = 'color';
            this.fillInCreateFormFromStorage(newCarInput, newCarColor);
            newCarInput.addEventListener('change', () =>
                this.saveGarageState()
            );
            newCarColor.addEventListener('change', () =>
                this.saveGarageState()
            );
        }
        this.createRowContainer.append(newCarInput, newCarColor, newCarButton);
    }

    public createForm(): CustomElement {
        const formContainer = new ElementBase({
            tag: 'div',
            className: ['garage-form'],
        }).element;
        formContainer.append(this.createRowContainer, this.updateRowContainer);
        return formContainer;
    }

    public updateCarForm(): void {
        const updateCarInput = new ElementBase({
            tag: 'input',
            className: ['update-car-input'],
        }).element;
        const updatedCarColor = new ElementBase({
            tag: 'input',
            className: ['update-car-color'],
        }).element;
        const updateCarButton = new Button({
            className: ['update-car'],
            textContent: 'Update',
            handlerFunction: (): void => {
                this.garage.updateCarRecordHandler().then(
                    (result) => result,
                    (error) => console.log(error)
                );
            },
        }).element;
        if (
            updateCarInput instanceof HTMLInputElement &&
            updatedCarColor instanceof HTMLInputElement
        ) {
            this.fillInUpdateFromStorage(updateCarInput, updatedCarColor);
            updatedCarColor.type = 'color';
            updateCarInput.addEventListener('change', () =>
                this.saveGarageState()
            );
            updatedCarColor.addEventListener('change', () =>
                this.saveGarageState()
            );
        }
        this.updateRowContainer.append(
            updateCarInput,
            updatedCarColor,
            updateCarButton
        );
    }
    public fillInCreateFormFromStorage(
        name: HTMLInputElement,
        color: HTMLInputElement
    ): void {
        const garageData = this.state.getGarageState();
        if (garageData) {
            name.value = garageData.createCarName;
            color.value = garageData.createCarColor;
        }
    }
    public fillInUpdateFromStorage(
        name: HTMLInputElement,
        color: HTMLInputElement
    ): void {
        const garageData = this.state.getGarageState();
        if (garageData) {
            name.value = garageData.updateCarName;
            color.value = garageData.updateCarColor;
        }
    }

    public createGarageContainer(pageNumber: number): void {
        const pageTitle = new ElementBase({
            tag: 'p',
            className: ['garage-title'],
            textContent: `Garage (${this.carsNumber})`,
        }).element;

        const page = new ElementBase({
            tag: 'p',
            className: ['garage-page-number'],
            textContent: `Page #${pageNumber}`,
        }).element;

        this.garageContainer.append(
            pageTitle,
            page,
            this.garage.carsContainer,
            this.createPaginationButtons()
        );
    }
    public clearGarage(): void {
        [...this.garageContainer.children].forEach((element) =>
            element.remove()
        );
    }
    public clearCars(): void {
        [...this.garage.carsContainer.children].forEach((element) =>
            element.remove()
        );
    }
    public createPaginationButtons(): CustomElement {
        const paginationButtons = new ElementBase({
            tag: 'div',
            className: ['pagination-buttons'],
        }).element;
        const previousButton = new Button({
            className: ['prev-button', 'button'],
            textContent: 'Prev',
            handlerFunction: (): void => {
                this.clearGarage();
                this.garage.carsContainer = createCarsContainer();
                this.pagination.pageNumber -= 1;
                this.createGarageContainer(this.pagination.pageNumber);
                this.garage
                    .populateGarage(this.pagination.pageNumber)
                    .then(() => this.saveGarageState())
                    .catch((error: Error) => console.log(error));
            },
        }).element;
        if (previousButton instanceof HTMLButtonElement)
            this.pagination.setPrevButtonState(previousButton);
        const nextButton = new Button({
            className: ['next-button', 'button'],
            textContent: 'Next',
            handlerFunction: (): void => {
                this.clearGarage();
                this.garage.carsContainer = createCarsContainer();
                this.pagination.pageNumber += 1;
                this.createGarageContainer(this.pagination.pageNumber);
                this.garage
                    .populateGarage(this.pagination.pageNumber)
                    .then(() => this.saveGarageState())
                    .catch((error: Error) => console.log(error));
            },
        }).element;
        if (nextButton instanceof HTMLButtonElement)
            this.pagination.setNextButtonState(nextButton, this.carsNumber);
        paginationButtons.append(previousButton, nextButton);
        return paginationButtons;
    }
    public createTopLevelButtons(router: Router): CustomElement {
        const buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['garage-page-top-buttons'],
        }).element;

        const toWinnersButton = new Button({
            className: ['winners-button', 'button'],
            textContent: 'To Winners',
            handlerFunction: (): void => {
                this.openWinnersHandler(router);
            },
        }).element;
        buttonsContainer.append(toWinnersButton);

        return buttonsContainer;
    }
    public createBottomLevelButtons(): CustomElement {
        const buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['garage-page-bottom-buttons'],
        }).element;

        const raceButton = new Button({
            className: ['race-button', 'button'],
            textContent: 'Race',
            handlerFunction: (): void => {
                this.garage.startRaceHandler();
            },
        }).element;

        const resetButton = new Button({
            className: ['reset-button', 'button'],
            textContent: 'Reset',
            handlerFunction: (): void => {
                this.garage.stopAllCarsHandler();
            },
        }).element;

        const generateCarsButton = new Button({
            className: ['generate-cars-button', 'button'],
            textContent: 'Generate Cars',
            handlerFunction: (): void => {
                void this.garage.generateRandomCars();
            },
        }).element;

        buttonsContainer.append(raceButton, resetButton, generateCarsButton);

        return buttonsContainer;
    }
    public getCarsCountOnPage(): number {
        return this.garage.carsContainer.children.length;
    }
    public async getAllCarsCount(): Promise<number> {
        let count: number;
        const cars = await this.apiGarage.getAllCars();
        if (isCars(cars)) {
            count = cars.length;
            return count;
        } else return 0;
    }

    public setCarsNumber(count: number): void {
        const garage = [...this.garageContainer.children];
        const title = garage[0];
        title.textContent = `Garage (${count})`;
    }

    public saveGarageState(): void {
        const pageNumber = this.pagination.pageNumber;
        const selectedCarId = this.selectedCarId;
        let carName = '';
        let carColor = '';
        let updatedName = '';
        let updatedColor = '';
        const listOfNewCarElements = [...this.createRowContainer.children];
        if (
            listOfNewCarElements[0] instanceof HTMLInputElement &&
            listOfNewCarElements[1] instanceof HTMLInputElement
        ) {
            carName = listOfNewCarElements[0].value;
            carColor = listOfNewCarElements[1].value;
        }
        const listOfUpdatedCarElements = [...this.updateRowContainer.children];
        if (
            listOfUpdatedCarElements[0] instanceof HTMLInputElement &&
            listOfUpdatedCarElements[1] instanceof HTMLInputElement
        ) {
            updatedName = listOfUpdatedCarElements[0].value;
            updatedColor = listOfUpdatedCarElements[1].value;
        }

        const objectToSave: GarageState = {
            pageNumber: pageNumber,
            selectedCarId: selectedCarId,
            createCarName: carName,
            createCarColor: carColor,
            updateCarName: updatedName,
            updateCarColor: updatedColor,
        };
        this.state.saveGarageState(objectToSave);
    }
    public showWinMessage(time: number, carRow: Element): void {
        let winnerCar: Car;
        if (carRow instanceof HTMLElement) {
            const id = Number(carRow.dataset.id);
            this.apiGarage
                .getCar(id)
                .then((car) => {
                    if (isCar(car)) winnerCar = car;
                    const text = `${winnerCar.name} went first (${(time / 1000).toFixed(2)}s)!`;
                    const messageComponent = createWinMessage(
                        text,
                        winnerCar.color
                    );
                    setTimeout(() => {
                        removeWinMessage(messageComponent);
                    }, 3000);
                })
                .catch((error: Error) => console.log(error));
        }
    }
    public openWinnersHandler(router: Router): void {
        this.saveGarageState();
        router.openPage('winners');
    }

    public async saveWinner(time: number, carRow: Element): Promise<void> {
        if (carRow instanceof HTMLElement) {
            const id = Number(carRow.dataset.id);
            const winRecord = await this.apiWinners.getWinner(id);
            if (isWinner(winRecord)) {
                winRecord.wins += 1;
                if (winRecord.time > Number((time / 1000).toFixed(2)))
                    winRecord.time = Number((time / 1000).toFixed(2));
                await this.apiWinners.updateWinner(id, winRecord);
            } else
                await this.apiWinners.addWinner({
                    id: id,
                    wins: 1,
                    time: Number((time / 1000).toFixed(2)),
                });
        }
    }
}

function removeWinMessage(messageComponent: CustomElement): void {
    messageComponent.remove();
}

function createWinMessage(text: string, color: string): CustomElement {
    const modalContainer = new ElementBase({
        tag: 'div',
        className: ['dark-view'],
    }).element;
    const modal = new ElementBase({
        tag: 'div',
        className: ['message-container'],
    }).element;
    const modalContent = new ElementBase({
        tag: 'p',
        className: ['message'],
        textContent: text,
    }).element;
    if (modalContent instanceof HTMLElement) {
        modalContent.style.textShadow = `${color} 3px 2px 15px`;
    }
    modal.append(modalContent);
    modalContainer.append(modal);
    document.body.append(modalContainer);
    return modalContainer;
}
