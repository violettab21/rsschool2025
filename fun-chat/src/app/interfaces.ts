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
        | UserPayloadServerUsers;
}

interface Listeners {
    [index: string]: ((event: MessageEvent) => void)[];
}

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;
interface Route {
    url: string;
    handler: () => void;
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
};
