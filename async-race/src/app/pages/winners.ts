import type { Main } from '../components/main';
import type { CustomElement } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
import type { Car, Winner } from '../interfaces';
import { WinnersAPI } from '../api/winners-api';
import { GarageAPI } from '../api/garage-api';
import { isWinners, isCar } from '../utilities';
export class Winners {
    public winnersCount: number;
    public winnersContainer: CustomElement;

    public pageNumber: number;
    public winners: CustomElement;
    public api: WinnersAPI;
    public apiCars: GarageAPI;
    constructor(main: Main) {
        this.winnersCount = 0;
        this.api = new WinnersAPI();
        this.apiCars = new GarageAPI();

        this.pageNumber = 1;
        this.winnersContainer = new ElementBase({
            tag: 'div',
            className: ['winners-container'],
        }).element;
        this.winners = new ElementBase({
            tag: 'div',
            className: ['winners'],
        }).element;
        this.configurePage(main);
    }
    public configurePage(main: Main): void {
        const winnersPageMenu = createWinnersPageMenu();
        if (main.main instanceof Element) {
            main.main.append(winnersPageMenu, this.winnersContainer);
            this.createWinnersComponents()
                .then(() => this.createWinnersContainer(this.pageNumber))
                .catch((error: Error) => console.log(error));
        }
    }
    public createWinnersContainer(pageNumber: number): void {
        const pageTitle = new ElementBase({
            tag: 'p',
            className: ['winners-title'],
            textContent: `Winners (${this.winnersCount})`,
        }).element;

        const page = new ElementBase({
            tag: 'p',
            className: ['winners-page-number'],
            textContent: `Page #${pageNumber}`,
        }).element;

        this.winnersContainer.append(
            pageTitle,
            page,
            this.winners,
            this.createPaginationButtons()
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
                this.clearWinnersContainer();
                this.clearWinners();
                this.pageNumber -= 1;
                this.createWinnersComponents()
                    .then(() => this.createWinnersContainer(this.pageNumber))
                    .catch((error: Error) => console.log(error));
            },
        }).element;

        const nextButton = new Button({
            className: ['next-button', 'button'],
            textContent: 'Next',
            handlerFunction: (): void => {
                this.clearWinnersContainer();
                this.clearWinners();
                this.pageNumber += 1;
                this.createWinnersComponents()
                    .then(() => this.createWinnersContainer(this.pageNumber))
                    .catch((error: Error) => console.log(error));
            },
        }).element;
        paginationButtons.append(previousButton, nextButton);
        return paginationButtons;
    }

    public async createWinnersComponents(): Promise<void> {
        this.createTableHeader();
        await this.populateWinnersTable();
    }
    public createTableHeader(): void {
        const number = new ElementBase({
            tag: 'p',
            className: ['header-number'],
            textContent: 'Number',
        }).element;
        const name = new ElementBase({
            tag: 'p',
            className: ['header-name'],
            textContent: 'Name',
        }).element;
        const car = new ElementBase({
            tag: 'p',
            className: ['header-car'],
            textContent: 'Car',
        }).element;
        const wins = new ElementBase({
            tag: 'p',
            className: ['header-time'],
            textContent: 'Wins',
        }).element;
        const time = new ElementBase({
            tag: 'p',
            className: ['header-time'],
            textContent: 'Time',
        }).element;
        this.winners.append(number, name, car, wins, time);
    }
    public createWinnerRow(id: number, car: Car, winner: Winner): void {
        const number = new ElementBase({
            tag: 'p',
            className: ['data-number'],
            textContent: `${id}`,
        }).element;
        const name = new ElementBase({
            tag: 'p',
            className: ['data-name'],
            textContent: `${car.name}`,
        }).element;
        const carImage = new ElementBase({
            tag: 'p',
            className: ['data-car'],
            textContent: `${car.color}`,
        }).element;
        const winsCount = new ElementBase({
            tag: 'p',
            className: ['data-wins'],
            textContent: `${winner.wins}`,
        }).element;
        const time = new ElementBase({
            tag: 'p',
            className: ['data-time'],
            textContent: `${winner.time}`,
        }).element;
        this.winners.append(number, name, carImage, winsCount, time);
    }

    public async populateWinnersTable(): Promise<void> {
        const responseData = await this.api.getWinners(this.pageNumber);
        const winners = responseData[0];
        const headers = responseData[1];
        if (headers instanceof Headers) {
            this.winnersCount = Number(headers.get('X-Total-Count'));
            console.log(this.winnersCount);
        }
        const carsData: Promise<unknown>[] = [];
        if (isWinners(winners)) {
            winners.forEach((winner) => {
                carsData.push(this.apiCars.getCar(winner.id));
            });
            Promise.all(carsData)
                .then((data) =>
                    data.forEach((car, i) => {
                        if (isCar(car)) {
                            this.createWinnerRow(i + 1, car, winners[i]);
                        }
                    })
                )
                .catch((error: Error) => console.log(error));
        }
    }
    public clearWinnersContainer(): void {
        [...this.winnersContainer.children].forEach((element) =>
            element.remove()
        );
    }
    public clearWinners(): void {
        [...this.winners.children].forEach((element) => element.remove());
    }
}
function createWinnersPageMenu(): CustomElement {
    const pageMenuContainer = new ElementBase({
        tag: 'div',
        className: ['winners-page-menu'],
    }).element;

    pageMenuContainer.append(createTopLevelButtons());

    return pageMenuContainer;
}
function createTopLevelButtons(): CustomElement {
    const toGarageButton = new Button({
        className: ['garage-button', 'button'],
        textContent: 'To Garage',
        handlerFunction: (): void => {},
    }).element;

    return toGarageButton;
}
