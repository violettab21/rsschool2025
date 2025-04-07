export class Pagination {
    public limit: number;
    public pageNumber: number;
    constructor(limit: number, pageNumber: number) {
        this.limit = limit;
        this.pageNumber = pageNumber;
    }

    public setPrevButtonState(button: HTMLButtonElement): void {
        button.disabled = this.pageNumber === 1;
    }
    public setNextButtonState(
        button: HTMLButtonElement,
        countOfItems: number
    ): void {
        const pagesCount = Math.ceil(countOfItems / this.limit);
        button.disabled = this.pageNumber === pagesCount;
    }
}
