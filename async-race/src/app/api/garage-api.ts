import type { NewCar } from '../interfaces';

export class GarageAPI {
    protected url: string;
    protected urlEngine: string;
    constructor() {
        this.url = 'http://127.0.0.1:3000/garage';
        this.urlEngine = 'http://127.0.0.1:3000/engine';
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
    public async getAllCars(): Promise<unknown> {
        const response = await fetch(this.url, {
            method: 'GET',
        });
        const json: unknown = await response.json();
        return json;
    }

    public async getCar(id: number): Promise<unknown> {
        const response = await fetch(this.url + `/${id}`, {
            method: 'GET',
        });
        const json: unknown = await response.json();
        return json;
    }

    public async removeCar(id: number): Promise<void> {
        await fetch(this.url + `/${id}`, {
            method: 'DELETE',
        });
    }

    public async updateCar(id: number, car: NewCar): Promise<void> {
        await fetch(this.url + `/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
        });
    }

    public async startEngine(id: number): Promise<unknown> {
        const response = await fetch(
            this.urlEngine + `/?id=${id}&status=started`,
            {
                method: 'PATCH',
            }
        );
        const json: unknown = await response.json();
        return json;
    }

    public async stopEngine(id: number): Promise<unknown> {
        const response = await fetch(
            this.urlEngine + `/?id=${id}&status=stopped`,
            {
                method: 'PATCH',
            }
        );
        const json: unknown = await response.json();
        return json;
    }

    public async draveEngine(id: number): Promise<Response> {
        const response = await fetch(
            this.urlEngine + `/?id=${id}&status=drive`,
            {
                method: 'PATCH',
            }
        );
        return response;
    }
}
