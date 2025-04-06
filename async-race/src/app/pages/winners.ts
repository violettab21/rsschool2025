import type { Main } from '../components/main';
import type { CustomElement, WinnersState } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
import type { Car, Winner } from '../interfaces';
import { WinnersAPI } from '../api/winners-api';
import { GarageAPI } from '../api/garage-api';
import { isWinners, isCar } from '../utilities';
import { createCarImage } from './garage';
import imageUp from '../../assets/up.svg';
import imageDown from '../../assets/down.svg';
import type { Router } from '../components/router';
import type { State } from '../state/state';
export class Winners {
    public winnersCount: number;
    public winnersContainer: CustomElement;
    public state: State;
    public pageNumber: number;
    public winners: CustomElement;
    public api: WinnersAPI;
    public apiCars: GarageAPI;
    constructor(main: Main, router: Router, state: State) {
        this.state = state;
        this.winnersCount = 0;
        this.api = new WinnersAPI();
        this.apiCars = new GarageAPI();
        const winnersData = this.state.getWinnersState();
        this.pageNumber = winnersData ? winnersData.pageNumber : 1;

        this.winnersContainer = new ElementBase({
            tag: 'div',
            className: ['winners-container'],
        }).element;
        this.winners = new ElementBase({
            tag: 'div',
            className: ['winners'],
        }).element;
        this.configurePage(main, router);
    }
    public configurePage(main: Main, router: Router): void {
        const winnersPageMenu = this.createWinnersPageMenu(router);
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
                    .then(() => {
                        this.createWinnersContainer(this.pageNumber);
                        this.saveWinnersState();
                    })
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
                    .then(() => {
                        this.createWinnersContainer(this.pageNumber);
                        this.saveWinnersState();
                    })
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
            textContent: 'Best Time',
        }).element;
        wins.addEventListener('click', () => {
            if (time) removeSortIcon(time);

            this.showSortedWinners(wins, 'wins');
            this.saveWinnersState();
        });
        time.addEventListener('click', () => {
            if (wins) removeSortIcon(wins);
            this.showSortedWinners(time, 'time');
            this.saveWinnersState();
        });
        this.setSortingFromState(wins, time);
        this.winners.append(number, name, car, wins, time);
    }
    public showSortedWinners(column: CustomElement, name: string): void {
        this.clearWinnersWithoutHeader();

        let sortParameter = '';
        if (!column.dataset.sort || column.dataset.sort === 'DESC') {
            sortParameter = 'ASC';
            column.dataset.sort = 'ASC';
            if (column instanceof HTMLElement) {
                [...column.children].forEach((child) => child.remove());
                column.append(createSortingIconUp());
            }
        } else {
            sortParameter = 'DESC';
            column.dataset.sort = 'DESC';
            if (column instanceof HTMLElement) {
                [...column.children].forEach((child) => child.remove());
                column.append(createSortingIconDown());
            }
        }
        this.sortByColumnHandler(name, sortParameter)
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
    }
    public async sortByColumnHandler(
        column: string,
        sortParameter: string
    ): Promise<void> {
        const responseData = await this.api.sortWinners(
            this.pageNumber,
            column,
            sortParameter
        );
        const winners = responseData[0];
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
        const carImage = createCarImage(car.color);
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
        const winnersData = this.state.getWinnersState();
        let responseData: unknown[];
        if (winnersData) {
            const sortColumn = getSortValues(winnersData)[0],
                sortType = getSortValues(winnersData)[1];
            responseData =
                sortColumn && sortType
                    ? await this.api.sortWinners(
                          this.pageNumber,
                          sortColumn,
                          sortType
                      )
                    : await this.api.getWinners(this.pageNumber);
        } else {
            responseData = await this.api.getWinners(this.pageNumber);
        }

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
    public clearWinnersWithoutHeader(): void {
        [...this.winners.children]
            .slice(5)
            .forEach((element) => element.remove());
    }
    public saveWinnersState(): void {
        const pageNumber = this.pageNumber;
        let winsSort = '';
        let timeSort = '';

        const listOfWinnersElements = [...this.winners.children];
        if (listOfWinnersElements[3] instanceof HTMLElement) {
            winsSort = listOfWinnersElements[3].dataset.sort
                ? listOfWinnersElements[3].dataset.sort
                : '';
        }
        if (listOfWinnersElements[4] instanceof HTMLElement) {
            timeSort = listOfWinnersElements[4].dataset.sort
                ? listOfWinnersElements[4].dataset.sort
                : '';
        }
        const objectToSave: WinnersState = {
            pageNumber: pageNumber,
            winsSort: winsSort,
            timeSort: timeSort,
        };
        this.state.saveWinnersState(objectToSave);
    }
    public createTopLevelButtons(router: Router): CustomElement {
        const toGarageButton = new Button({
            className: ['garage-button', 'button'],
            textContent: 'To Garage',
            handlerFunction: (): void => {
                this.saveWinnersState();
                router.openPage('/');
            },
        }).element;

        return toGarageButton;
    }
    public createWinnersPageMenu(router: Router): CustomElement {
        const pageMenuContainer = new ElementBase({
            tag: 'div',
            className: ['winners-page-menu'],
        }).element;

        pageMenuContainer.append(this.createTopLevelButtons(router));

        return pageMenuContainer;
    }
    public setSortingFromState(wins: CustomElement, time: CustomElement): void {
        const winnersData = this.state.getWinnersState();
        if (winnersData) {
            wins.dataset.sort = winnersData.winsSort;
            time.dataset.sort = winnersData.timeSort;
            showIconSortIconBasedOnSortType(wins);
            showIconSortIconBasedOnSortType(time);
        }
    }
}
function removeSortIcon(column: CustomElement): void {
    if (column instanceof HTMLElement) {
        column.dataset.sort = '';
        [...column.children].forEach((child) => child.remove());
    }
}
function getSortValues(winnersData: WinnersState): string[] {
    let sortColumn = '',
        sortType = '';
    if (winnersData.timeSort) {
        sortColumn = 'time';
        sortType = winnersData.timeSort;
    } else if (winnersData.winsSort) {
        sortColumn = 'wins';
        sortType = winnersData.winsSort;
    }
    return [sortColumn, sortType];
}
function showIconSortIconBasedOnSortType(column: CustomElement): void {
    const sortType = column.dataset.sort;
    if (sortType === 'ASC' && column instanceof HTMLElement) {
        [...column.children].forEach((child) => child.remove());
        column.append(createSortingIconUp());
    } else if (sortType === 'DESC' && column instanceof HTMLElement) {
        [...column.children].forEach((child) => child.remove());
        column.append(createSortingIconDown());
    }
}

function createSortingIconUp(): CustomElement {
    const sortImage = new ElementBase({
        tag: 'span',
        className: ['sort-icon-up'],
    }).element;
    if (sortImage instanceof HTMLElement)
        sortImage.style.backgroundImage = `url(${imageUp})`;
    return sortImage;
}

function createSortingIconDown(): CustomElement {
    const sortImage = new ElementBase({
        tag: 'span',
        className: ['sort-icon-down'],
    }).element;
    if (sortImage instanceof HTMLElement)
        sortImage.style.backgroundImage = `url(${imageDown})`;
    return sortImage;
}
