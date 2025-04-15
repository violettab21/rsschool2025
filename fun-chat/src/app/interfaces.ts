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

interface UserRequest {
    id: string;
    type: string;
    payload: {
        user: User;
    };
}

interface User {
    login: string;
    password: string;
}

interface UserResponse {
    id: string;
    type: string;
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
}

type CustomElement = HTMLElement | HTMLInputElement | HTMLButtonElement;

export {
    Properties,
    ButtonProperties,
    CustomElement,
    UserRequest,
    User,
    UserResponse,
};
