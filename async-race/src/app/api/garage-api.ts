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

    public async getCars(): Promise<unknown> {
        const response = await fetch(this.url, {
            method: 'GET',
        });
        const json: unknown = await response.json();
        return json;
    }
}
