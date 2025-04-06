import type { NewWinner, Winner } from '../interfaces';

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

    public async sortWinners(
        pageNumber: number,
        sortColumn: string,
        sortType: string
    ): Promise<unknown[]> {
        const response = await fetch(
            this.url +
                `?_page=${pageNumber}&_limit=10&_sort=${sortColumn}&_order=${sortType}`,
            {
                method: 'GET',
            }
        );
        const json: unknown = await response.json();
        const headers = response.headers;
        const result = [json, headers];
        return result;
    }

    public async getWinner(id: number): Promise<unknown> {
        const response = await fetch(this.url + `/${id}`, {
            method: 'GET',
        });
        const json: unknown = await response.json();

        return json;
    }

    public async updateWinner(id: number, winner: Winner): Promise<void> {
        const winnerToSave: NewWinner = {
            wins: winner.wins,
            time: winner.time,
        };
        await fetch(this.url + `/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winnerToSave),
        });
    }

    public async removeWinner(id: number): Promise<void> {
        await fetch(this.url + `/${id}`, {
            method: 'DELETE',
        });
    }

    public async addWinner(winner: Winner): Promise<unknown> {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(winner),
        });

        const json: unknown = await response.json();
        return json;
    }
}
