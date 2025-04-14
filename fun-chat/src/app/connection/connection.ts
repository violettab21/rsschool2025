export class Connection {
    public url: string;
    public connection: WebSocket;
    constructor() {
        this.url = 'ws://localhost:4000';
        this.connection = new WebSocket(this.url);
        this.configureOpenState();
        this.configureCloseState();
        this.configureMessageState();
    }
    public configureOpenState(): void {
        this.connection.addEventListener('open', () => {
            console.log('connection is open');
        });
    }
    public configureCloseState(): void {
        this.connection.addEventListener('close', () => {
            console.log('connection is closed');
        });
    }
    public configureMessageState(): void {
        this.connection.addEventListener('message', (event) => {
            console.log(event.data);
        });
    }
}
