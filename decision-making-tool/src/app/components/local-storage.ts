export class LocalStorage {
    public key: string;
    constructor(key: string) {
        this.key = key;
    }

    public saveData<T>(object: T): void {
        localStorage.setItem(this.key, JSON.stringify(object));
    }

    public getData(): unknown {
        const data = localStorage.getItem(this.key);
        if (data === null) {
            return null;
        }
        const object: unknown = JSON.parse(data);
        return object;
    }
}
