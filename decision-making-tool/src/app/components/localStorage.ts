export class LocalStorage {
    public key: string;
    constructor(key: string) {
        this.key = key;
    }

    public saveData<T>(object: T): void {
        localStorage.setItem(this.key, JSON.stringify(object));
    }

    public getData<T>(): T | null {
        const data = localStorage.getItem(this.key);
        if (data !== null) {
            return JSON.parse(data) as T;
        } else return null;
    }
}
