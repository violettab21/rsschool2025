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
    user: { login: string; password: string };
}
interface UserPayloadServer {
    user: { login: string; isLogined: boolean };
}
interface ErrorTest {
    error: string;
}

interface GeneralMessage {
    id: string;
    type: string;
    payload: UserPayloadClient | UserPayloadServer | ErrorTest;
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
};
