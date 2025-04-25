import type { Router } from '../components/router';
import type { Connection } from '../connection/connection';
import type { UserService } from '../services/user-service';
import { prepareUserRequest } from '../services/user-service';
function infoButtonHandlerLogin(router: Router): (event: Event) => void {
    return (event: Event) => {
        event?.preventDefault();
        router.openPage('info');
    };
}
function loginHandler(
    Connection: Connection,
    UserService: UserService
): (event: Event) => void {
    return (event: Event) => {
        event?.preventDefault();
        const request = prepareUserRequest(Connection, UserService);
        UserService.sendUserMessage(request);
    };
}
function validatePassword(
    inputPassword: HTMLInputElement,
    errorMessage: HTMLElement
): void {
    if (inputPassword.validity.valid === false) {
        if (inputPassword.validity.valueMissing) {
            errorMessage.textContent = 'Password is required';
        } else if (inputPassword.validity.tooShort) {
            errorMessage.textContent =
                'Password should have at least 6 characters';
        } else if (inputPassword.validity.tooLong) {
            errorMessage.textContent = 'Password should have 10 characters max';
        } else if (inputPassword.validity.patternMismatch) {
            errorMessage.textContent =
                'Password can contain low letters, capital Letters and numbers';
        }
        disableLoginButton();
    } else {
        errorMessage.textContent = '';
        enableLoginButton();
    }
}

function validateUserName(
    inputUserName: HTMLInputElement,
    errorMessage: HTMLElement
): void {
    if (inputUserName.validity.valid === false) {
        if (inputUserName.validity.valueMissing)
            errorMessage.textContent = 'User Name is required';
        else if (inputUserName.validity.tooShort)
            errorMessage.textContent =
                'User Name should have at least 2 characters';
        else if (inputUserName.validity.tooLong)
            errorMessage.textContent =
                'User Name should have 10 characters max';
        disableLoginButton();
    } else {
        errorMessage.textContent = '';
        enableLoginButton();
    }
}

function disableLoginButton(): void {
    const button = document.querySelector('.login-button');

    if (button instanceof HTMLButtonElement) button.disabled = true;
}

function enableLoginButton(): void {
    const button = document.querySelector('.login-button');

    if (button instanceof HTMLButtonElement) button.disabled = false;
}

function passwordFieldHandler(
    inputPassword: HTMLInputElement,
    errorMessage: HTMLElement
): () => void {
    return () => {
        validatePassword(inputPassword, errorMessage);
    };
}
function userNameFieldHandler(
    input: HTMLInputElement,
    errorMessage: HTMLElement
): () => void {
    return () => {
        validateUserName(input, errorMessage);
    };
}
export {
    infoButtonHandlerLogin,
    loginHandler,
    validateUserName,
    validatePassword,
    disableLoginButton,
    enableLoginButton,
    passwordFieldHandler,
    userNameFieldHandler,
};
