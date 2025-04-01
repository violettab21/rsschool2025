import type { NewCar } from '../interfaces';

export class GarageAPI {
    protected url: string;
    constructor() {
        this.url = 'http://127.0.0.1:3000/garage';
    }

    public async createCar(car: NewCar): Promise<unknown> {
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
        });
        const json: unknown = await response.json();
        return json;
    }

    public async getCars(page: number): Promise<unknown> {
        const response = await fetch(this.url + `?_page=${page}&_limit=7`, {
            method: 'GET',
        });
        const json: unknown = await response.json();
        return json;
    }
}
