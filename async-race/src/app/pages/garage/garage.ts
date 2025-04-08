import { GarageAPI } from '../../api/garage-api';
import { isCars, isCar, isEngine } from '../../utilities';
import type { CustomElement } from '../../interfaces';
import { ElementBase } from '../../components/elements';
import type { Pagination } from '../../components/pagination';
import type { Car, NewCar } from '../../interfaces';
import { Button } from '../../components/buttons';
import image from '../../../assets/racing-finish-svgrepo-com.svg';
import type { GaragePage } from './garage-page';
import { models, cars } from '../../constants';
import { WinnersAPI } from '../../api/winners-api';
export class Garage {
    public apiGarage: GarageAPI;
    public apiWinners: WinnersAPI;
    public carsContainer: CustomElement;
    public pagination: Pagination;
    public garagePage: GaragePage;
    constructor(pagination: Pagination, garagePage: GaragePage) {
        this.pagination = pagination;
        this.garagePage = garagePage;
        this.apiGarage = new GarageAPI();
        this.apiWinners = new WinnersAPI();
        this.carsContainer = createCarsContainer();
    }

    public async getAllCarsCount(): Promise<number> {
        let count: number;
        const cars = await this.apiGarage.getAllCars();
        if (isCars(cars)) {
            count = cars.length;
            return count;
        } else return 0;
    }
    public async populateGarage(page: number): Promise<void> {
        const cars = await this.apiGarage.getCars(page, this.pagination.limit);
        if (isCars(cars)) cars.forEach((car) => this.renderCarRecord(car));
    }
    public renderCarRecord(car: Car): void {
        const carRow = new ElementBase({
            tag: 'div',
            className: ['car-row'],
        }).element;
        carRow.dataset.id = car.id.toString();

        const carMenu = this.createCarRecordTopMenu(car.name);
        const carMain = this.createCarMainContent(car.color);
        carRow.append(carMenu, carMain);

        this.carsContainer.append(carRow);
    }
    public createCarRecordTopMenu(name: string): CustomElement {
        const menuContainer = new ElementBase({
            tag: 'div',
            className: ['car-menu'],
        }).element;

        const selectButton = new Button({
            className: ['select-button'],
            textContent: 'Select',
            handlerFunction: (event?: Event): void => {
                this.selectCarRecordHandler(event)
                    .then(() => this.garagePage.saveGarageState())
                    .catch((error: Error) => console.log(error));
            },
        }).element;

        const removeButton = new Button({
            className: ['remove-button'],
            textContent: 'Remove',
            handlerFunction: (event?: Event): void => {
                void this.removeCarRecordHandler(event);
            },
        }).element;

        const carName = new ElementBase({
            tag: 'p',
            className: ['car-name'],
            textContent: name,
        }).element;

        menuContainer.append(selectButton, removeButton, carName);

        return menuContainer;
    }
    public createCarMainContent(color: string): CustomElement {
        const carContainer = new ElementBase({
            tag: 'div',
            className: ['car-main'],
        }).element;
        const startButton = new Button({
            className: ['start-button'],
            textContent: 'A',
            handlerFunction: (event?: Event): void => {
                this.startCarHandler(event);
            },
        }).element;
        const stopButton = new Button({
            className: ['stop-button'],
            textContent: 'B',
            handlerFunction: (event?: Event): void => {
                this.stopCarHandler(event);
            },
        }).element;
        const carImage = createCarImage(color);
        const flag = new ElementBase({
            tag: 'span',
            className: ['flag-image'],
        }).element;
        flag.style.backgroundImage = `url(${image})`;
        carContainer.append(startButton, stopButton, carImage, flag);
        disableStop(carContainer.children);
        return carContainer;
    }
    public async selectCarRecordHandler(event?: Event): Promise<void> {
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const optionToSelect = clickedItem.parentElement?.parentElement;
                if (
                    optionToSelect instanceof Element &&
                    optionToSelect.dataset
                ) {
                    this.garagePage.selectedCarId = Number(
                        optionToSelect.dataset.id
                    );

                    const car = await this.apiGarage.getCar(
                        this.garagePage.selectedCarId
                    );
                    if (isCar(car)) {
                        const updateRowContainerFields = [
                            ...this.garagePage.updateRowContainer.children,
                        ];
                        if (
                            updateRowContainerFields[0] instanceof
                                HTMLInputElement &&
                            updateRowContainerFields[1] instanceof
                                HTMLInputElement
                        ) {
                            updateRowContainerFields[0].value = car.name;
                            updateRowContainerFields[1].value = car.color;
                        }
                    }
                }
            }
        }
    }
    public async createCarHandler(): Promise<void> {
        const car: NewCar = { name: '', color: '' };

        const listOfElements = [...this.garagePage.createRowContainer.children];
        if (
            listOfElements[0] instanceof HTMLInputElement &&
            listOfElements[1] instanceof HTMLInputElement
        ) {
            const carName = listOfElements[0].value;
            const carColor = listOfElements[1].value;
            car.name = carName;
            car.color = carColor;

            const createdCar = await this.apiGarage.createCar(car);
            this.garagePage.carsNumber += 1;
            this.garagePage.setCarsNumber(this.garagePage.carsNumber);
            if (
                this.getCarsCountOnPage() < this.pagination.limit &&
                isCar(createdCar)
            ) {
                this.renderCarRecord(createdCar);
            }
            this.updateNextPageButtonState();
        }
    }
    public async removeCarRecordHandler(event?: Event): Promise<void> {
        let idOfClickedItem: number;
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const optionToDelete = clickedItem.parentElement?.parentElement;
                if (
                    optionToDelete instanceof Element &&
                    optionToDelete.dataset
                ) {
                    idOfClickedItem = Number(optionToDelete.dataset.id);
                    await this.apiGarage.removeCar(idOfClickedItem);
                    await this.apiWinners.removeWinner(idOfClickedItem);
                    this.garagePage.carsNumber -= 1;
                    this.garagePage.setCarsNumber(this.garagePage.carsNumber);
                    this.garagePage.clearCars();
                    await this.populateGarage(this.pagination.pageNumber);
                    this.updateNextPageButtonState();
                }
            }
        }
    }
    public updateNextPageButtonState(): void {
        const next =
            this.garagePage.garageContainer.querySelector('.next-button');
        if (next instanceof HTMLButtonElement)
            this.pagination.setNextButtonState(
                next,
                this.garagePage.carsNumber
            );
    }
    public async updateCarRecordHandler(): Promise<void> {
        const updateRowContainerFields = [
            ...this.garagePage.updateRowContainer.children,
        ];
        let name: string;
        let color: string;
        if (
            updateRowContainerFields[0] instanceof HTMLInputElement &&
            updateRowContainerFields[1] instanceof HTMLInputElement
        ) {
            name = updateRowContainerFields[0].value;
            color = updateRowContainerFields[1].value;
            await this.apiGarage.updateCar(this.garagePage.selectedCarId, {
                name: name,
                color: color,
            });
            this.garagePage.clearCars();
            await this.populateGarage(this.pagination.pageNumber);
        }
    }
    public startCarHandler(event?: Event): void {
        if (event) {
            this.garagePage.isRace = false;
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const carToStart = clickedItem.parentElement?.parentElement;

                if (carToStart instanceof Element && carToStart.dataset) {
                    const carId = Number(carToStart.dataset.id);
                    this.apiGarage
                        .startEngine(carId)
                        .then((result) => {
                            if (isEngine(result)) {
                                const time = result.distance / result.velocity;
                                carToStart.dataset.state = '';
                                this.startCar(time, carToStart);
                                this.apiGarage
                                    .driveEngine(carId)
                                    .then((response) => {
                                        if (!response.ok) {
                                            carToStart.dataset.state =
                                                'stopped';
                                        } else if (response.ok)
                                            console.log('finish animation');
                                    })
                                    .catch((error: Error) =>
                                        console.log(error)
                                    );
                            }
                        })
                        .catch((error: Error) => console.log(error));
                }
            }
        }
    }
    public startCar(time: number, carRow: Element): void {
        const startTime = performance.now();
        const carMain = [...carRow.children][1];
        changeButtonsStateOnStart(carMain);
        requestAnimationFrame((timestamp) =>
            this.animateCar(timestamp, startTime, time, carRow)
        );
    }
    public stopCarHandler(event?: Event): void {
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const carToStop = clickedItem.parentElement?.parentElement;

                if (carToStop instanceof Element && carToStop.dataset) {
                    const carId = Number(carToStop.dataset.id);
                    this.apiGarage
                        .stopEngine(carId)
                        .then((result) => {
                            if (isEngine(result)) {
                                carToStop.dataset.state = 'stopped';
                                changeCarPosition(0, carToStop);
                                const carMain = [...carToStop.children][1];
                                changeButtonsStateOnStop(carMain);
                            }
                        })
                        .catch((error: Error) => console.log(error));
                }
            }
        }
    }
    public animateCar(
        timestamp: number,
        startTime: number,
        time: number,
        carRow: Element
    ): void {
        const progress = (timestamp - startTime) / time;

        const offset = progress * (carRow.clientWidth - 130);
        if (progress < 1 && carRow instanceof HTMLElement) {
            if (carRow.dataset.state !== 'stopped') {
                changeCarPosition(offset, carRow);
                requestAnimationFrame((timestamp) =>
                    this.animateCar(timestamp, startTime, time, carRow)
                );
            }
        } else {
            if (this.garagePage.isRace && this.garagePage.winner === null) {
                console.log('winner is');
                if (carRow instanceof HTMLElement)
                    this.garagePage.winner = carRow;
                console.log(carRow);
                this.garagePage.showWinMessage(time, carRow);
                this.garagePage
                    .saveWinner(time, carRow)
                    .then((result) => console.log(result))
                    .catch((error: Error) => console.log(error));
            }
        }
    }
    public getCarsCountOnPage(): number {
        return this.carsContainer.children.length;
    }
    public startRaceHandler(): void {
        this.garagePage.winner = null;
        const arrayCarsElements = [...this.carsContainer.children];
        const arrayOfRequests: Promise<unknown>[] = [];
        for (let i = 0; i < this.carsContainer.children.length; i += 1) {
            const carElement = arrayCarsElements[i];
            if (carElement instanceof HTMLElement) {
                const id = Number(carElement.dataset.id);
                arrayOfRequests.push(this.apiGarage.startEngine(id));
            }
        }
        Promise.all(arrayOfRequests)
            .then((values) => {
                arrayCarsElements.forEach((car, i) => {
                    if (car instanceof HTMLElement) {
                        car.dataset.state = 'started';
                        this.garagePage.isRace = true;
                    }
                    if (isEngine(values[i])) {
                        const time = values[i].distance / values[i].velocity;
                        this.startCar(time, car);
                        if (car instanceof HTMLElement) {
                            const id = Number(car.dataset.id);
                            this.apiGarage
                                .driveEngine(id)
                                .then((response) => {
                                    if (!response.ok) {
                                        car.dataset.state = 'stopped';
                                    }
                                })
                                .catch((error: Error) => console.log(error));
                        }
                    }
                });
            })
            .catch((error: Error) => console.log(error));
    }

    public stopAllCarsHandler(): void {
        const arrayCarsElements = [...this.carsContainer.children];
        const count = this.carsContainer.children.length;
        const arrayOfRequests = [];
        for (let i = 0; i < count; i += 1) {
            const carElement = arrayCarsElements[i];
            if (carElement instanceof HTMLElement) {
                const id = Number(carElement.dataset.id);
                arrayOfRequests.push(this.apiGarage.stopEngine(id));
            }
        }
        Promise.all(arrayOfRequests)
            .then(() => {
                arrayCarsElements.forEach((car) => {
                    if (car instanceof HTMLElement) {
                        car.dataset.state = 'stopped';
                        changeCarPosition(0, car);
                        const carMain = [...car.children][1];
                        changeButtonsStateOnStop(carMain);
                    }
                });
            })
            .catch((error: Error) => console.log(error));
    }
    public async generateRandomCars(): Promise<void> {
        for (let i = 0; i < 100; i += 1) {
            const car = {
                name: generateRandomCarName(),
                color: generateRandomColor(),
            };
            const createdCar = await this.apiGarage.createCar(car);

            if (
                this.getCarsCountOnPage() < this.pagination.limit &&
                isCar(createdCar)
            )
                this.renderCarRecord(createdCar);
        }
        this.garagePage.carsNumber = await this.getAllCarsCount();
        this.garagePage.setCarsNumber(this.garagePage.carsNumber);
        this.updateNextPageButtonState();
    }
}
export function createCarsContainer(): CustomElement {
    const garageContainer = new ElementBase({
        tag: 'div',
        className: ['cars'],
    }).element;

    return garageContainer;
}
export function createCarImage(color: string): CustomElement {
    const carImage = new ElementBase({
        tag: 'span',
        className: ['car-image'],
    }).element;
    carImage.innerHTML = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 viewBox="0 0 17.485 17.485" xml:space="preserve">
<g>
	<g>
		<path style="fill:${color};" d="M17.477,8.149c-0.079-0.739-3.976-0.581-3.976-0.581L11.853,5.23H4.275L3.168,7.567H0v2.404
			l2.029,0.682c0.123-0.836,0.843-1.48,1.711-1.48c0.939,0,1.704,0.751,1.73,1.685l6.62,0.041c0.004-0.951,0.779-1.726,1.733-1.726
			c0.854,0,1.563,0.623,1.704,1.439l1.479-0.17C17.006,10.442,17.556,8.887,17.477,8.149z M4.007,7.568l0.746-1.771h2.864
			l0.471,1.771H4.007z M8.484,7.568L8.01,5.797h3.67l1.137,1.771H8.484z"/>
		<circle style="fill:#030104;" cx="3.759" cy="10.966" r="1.289"/>
		<circle style="fill:#030104;" cx="13.827" cy="10.9" r="1.29"/>
	</g>
</g>
</svg>`;
    return carImage;
}
function generateRandomColor(): string {
    const HEX = ['A', 'B', 'C', 'D', 'E', 'F', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let color: string = '';
    for (let i = 0; i < 6; i += 1) {
        color += HEX[Math.floor(Math.random() * 16)];
    }
    return `#${color}`;
}

function generateRandomCarName(): string {
    const carName =
        cars[Math.floor(Math.random() * cars.length)] +
        ' ' +
        models[Math.floor(Math.random() * models.length)];

    return carName;
}

function changeCarPosition(offset: number, carRow: Element): void {
    const carElement = carRow.querySelector('.car-image');
    if (carElement instanceof HTMLElement)
        carElement.style.transform = `translate(${offset}px)`;
}
function changeButtonsStateOnStart(elements: Element): void {
    const carButtons = [...elements.children];
    disableStart(carButtons);
    enableStop(carButtons);
}

function changeButtonsStateOnStop(elements: Element): void {
    const carButtons = [...elements.children];
    disableStop(carButtons);
    enableStart(carButtons);
}
function disableStart(buttons: HTMLCollection | Element[]): void {
    const startButton = buttons[0];
    if (startButton instanceof HTMLButtonElement) startButton.disabled = true;
}
function disableStop(buttons: HTMLCollection | Element[]): void {
    const stopButton = buttons[1];
    if (stopButton instanceof HTMLButtonElement) stopButton.disabled = true;
}
function enableStart(buttons: HTMLCollection | Element[]): void {
    const startButton = buttons[0];
    if (startButton instanceof HTMLButtonElement) startButton.disabled = false;
}
function enableStop(buttons: HTMLCollection | Element[]): void {
    const stopButton = buttons[1];
    if (stopButton instanceof HTMLButtonElement) stopButton.disabled = false;
}
