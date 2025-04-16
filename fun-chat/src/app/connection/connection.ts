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
        this.connection.addEventListener('open', () => {
            console.log('connection is open');
        });
        this.connection.addEventListener('close', () => {
            console.log('connection is closed');
        });
        this.connection.addEventListener('message', (event: MessageEvent) => {
            this.listeners.message.forEach((callback) => callback(event));
        });
    }

    public addHandlerPerEvent(
        event: string,
        callback: (event: MessageEvent) => void
    ): void {
        if (event in this.listeners) {
            this.listeners[event].push(callback);
        } else {
            this.listeners[event] = [callback];
        }
    }
}
