import type { Connection } from '../connection/connection';
import type { UserRequest } from '../interfaces';

export class UserService {
    public connection: Connection;
    constructor(connection: Connection) {
        this.connection = connection;
    }
    public userLogin(userRequest: UserRequest): void {
        this.connection.connection.send(JSON.stringify(userRequest));
    }
}
