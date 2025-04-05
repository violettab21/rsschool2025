export class WinnersAPI {
    protected url: string;
    constructor() {
        this.url = 'http://127.0.0.1:3000/winners';
    }

    public async getWinners(pageNumber: number): Promise<unknown[]> {
        const response = await fetch(
            this.url + `?_page=${pageNumber}&_limit=10`,
            {
                method: 'GET',
            }
        );
        const json: unknown = await response.json();
        const headers = response.headers;
        const result = [json, headers];
        return result;
    }
}
