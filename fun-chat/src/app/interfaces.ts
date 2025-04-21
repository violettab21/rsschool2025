interface Properties {
    tag: string;
    className: string[];
    textContent?: string;
}
interface ButtonProperties {
    className: string[];
    textContent: string;
    handlerFunction: (event?: Event) => void;
}

interface UserPayloadClient {
    user: User;
}
interface UserPayloadServer {
    user: { login: string; isLogined: boolean };
}

interface UserPayloadServerUsers {
    users: { login: string; isLogined: boolean }[];
}

interface ErrorTest {
    error: string;
}
interface User {
    login: string;
    password: string;
}
interface GeneralMessage {
    id: string;
    type: string;
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

interface MessagePayloadClient {
    message: {
        to: string;
        text: string;
    };
}

interface MessagePayloadServer {
    message: {
        id: string;
        from: string;
        to: string;
        text: string;
        datetime: number;
        status: Status;
    };
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

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;
interface Route {
    url: string;
    handler: () => void;
}
interface ChatState {
    currentUser: Partial<User>;
    activeChatWith: Partial<User>;
}
export {
    Properties,
    ButtonProperties,
    CustomElement,
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
};
