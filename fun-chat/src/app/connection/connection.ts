import type { Listeners } from '../interfaces';

export class Connection {
    public url: string;
    public connection: WebSocket | null;
    public userIdRequest: string | null;
    public listeners: Listeners;
    constructor() {
        this.userIdRequest = null;
        this.url = 'ws://localhost:4000';
        this.connection = null;
        this.listeners = {};
    }
    public connect(): void {
        this.connection = new WebSocket(this.url);
        this.connection.addEventListener('open', (event: Event) => {
            this.listeners.open.forEach((callback) => callback(event));
        });
        this.connection.addEventListener('close', (event: Event) => {
            this.listeners.close.forEach((callback) => callback(event));
        });
        this.connection.addEventListener('error', (event: Event) => {
            this.listeners.error.forEach((callback) => callback(event));
        });
        this.connection.addEventListener('message', (event: MessageEvent) => {
            this.listeners.message.forEach((callback) => callback(event));
        });
    }

    public addHandlerPerEvent(
        event: string,
        callback: (event: MessageEvent | Event) => void
    ): void {
        if (event in this.listeners) {
            this.listeners[event].push(callback);
        } else {
            this.listeners[event] = [callback];
        }
    }
}
