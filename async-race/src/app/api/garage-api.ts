import type { NewCar } from '../interfaces';

export class GarageAPI {
    protected urlGarage: string;
    protected urlEngine: string;
    constructor() {
        this.urlGarage = 'http://127.0.0.1:3000/garage';
        this.urlEngine = 'http://127.0.0.1:3000/engine';
    }

    public async createCar(car: NewCar): Promise<unknown> {
        const response = await fetch(this.urlGarage, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
        });
        const json: unknown = await response.json();
        return json;
    }

    public async getCars(page: number, limit: number): Promise<unknown> {
        const response = await fetch(
            this.urlGarage + `?_page=${page}&_limit=${limit}`,
            {
                method: 'GET',
            }
        );
        const json: unknown = await response.json();
        return json;
    }

    public async getAllCars(): Promise<unknown> {
        const response = await fetch(this.urlGarage, {
            method: 'GET',
        });
        const json: unknown = await response.json();
        return json;
    }

    public async getCar(id: number): Promise<unknown> {
        const response = await fetch(this.urlGarage + `/${id}`, {
            method: 'GET',
        });
        const json: unknown = await response.json();
        return json;
    }

    public async removeCar(id: number): Promise<void> {
        await fetch(this.urlGarage + `/${id}`, {
            method: 'DELETE',
        });
    }

    public async updateCar(id: number, car: NewCar): Promise<void> {
        await fetch(this.urlGarage + `/${id}`, {
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

    public async driveEngine(id: number): Promise<Response> {
        const response = await fetch(
            this.urlEngine + `/?id=${id}&status=drive`,
            {
                method: 'PATCH',
            }
        );
        return response;
    }
}
