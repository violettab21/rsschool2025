export class Connection {
    public url: string;
    public connection: WebSocket;
    public userIdRequest: string | null;
    constructor() {
        this.userIdRequest = null;
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
            const receivedData: unknown = event.data;
            let data: unknown;
            if (typeof receivedData === 'string')
                data = JSON.parse(receivedData);
            if (
                typeof data === 'object' &&
                data !== null &&
                'id' in data &&
                'type' in data &&
                'payload' in data
            ) {
                console.log(this.userIdRequest);
                if (data.id === this.userIdRequest) {
                    if (
                        data.type === 'ERROR' &&
                        typeof data.payload === 'object' &&
                        data.payload !== null &&
                        'error' in data.payload
                    ) {
                        console.log(data.payload.error);
                    } else console.log('success login, we can show chat');
                } else console.log('process other responses');
            }
        });
    }
}
