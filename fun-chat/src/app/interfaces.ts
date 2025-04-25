import type { ResponseTypesChat, ResponseTypesUsers } from '../types';
interface GeneralMessage {
    id: string;
    type: ResponseTypesUsers | ResponseTypesChat;
    payload:
        | UserPayloadClient
        | UserPayloadServer
        | ErrorTest
        | null
        | UserPayloadServerUsers
        | MessagePayloadClient
        | MessagePayloadServer
        | MessagesPayloadServer;
}
interface UserPayloadClient {
    user: UserClient;
}
interface UserPayloadServer {
    user: UserServer;
}

interface UserPayloadServerUsers {
    users: UserServer[];
}

interface ErrorTest {
    error: string;
}
interface User {
    login: string;
    password?: string;
    isLogined?: boolean;
}

type UserClient = Required<Pick<User, 'login' | 'password'>>;
type UserServer = Required<Pick<User, 'login' | 'isLogined'>>;
interface MessagePayloadClient {
    message: {
        to: string;
        text: string;
    };
}

interface MessagePayloadServer {
    message: Message;
}

interface MessagePayloadServerStatus {
    message: {
        id: string;
        text?: string;
        status: Status;
    };
}

interface Status {
    isDelivered?: boolean;
    isReaded?: boolean;
    isEdited?: boolean;
}

interface MessagesPayloadServer {
    messages: Message[];
}

interface Message {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: Status;
}

interface Listeners {
    [index: string]: ((event: MessageEvent | Event) => void)[];
}

interface Route {
    url: string;
    handler: () => void;
}
interface ChatState {
    currentUser: Partial<User>;
}
export {
    GeneralMessage,
    UserPayloadClient,
    UserPayloadServer,
    ErrorTest,
    Listeners,
    Route,
    User,
    UserPayloadServerUsers,
    MessagePayloadClient,
    MessagePayloadServer,
    Message,
    MessagesPayloadServer,
    MessagePayloadServerStatus,
    Status,
    ChatState,
    UserServer,
};
