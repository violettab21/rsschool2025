import type { Connection } from '../connection/connection';
import type { Main } from '../components/main';
import { ElementBase } from '../components/elements';
import type { CustomElement, GeneralMessage } from '../interfaces';
import { Button } from '../components/buttons';
import { UserService } from './user-service';

export class LoginPage {
    public connection: Connection;
    public userAPI: UserService;
    constructor(connection: Connection, mainElement: Main) {
        this.connection = connection;
        this.userAPI = new UserService(this.connection);
        this.configurePage(mainElement);
    }
    public renderLoginForm(): CustomElement {
        const form = new ElementBase({
            tag: 'form',
            className: ['auth-form'],
        }).element;

        const userName = createUserNameField();
        const password = createPasswordField();
        const loginButton = new Button({
            className: ['login-button'],
            textContent: 'Login',
            handlerFunction: (event): void => {
                event?.preventDefault();
                const request = this.prepareUserRequest();
                this.userAPI.userLogin(request);
            },
        }).element;

        form.append(userName, password, loginButton);

        return form;
    }
    public configurePage(mainElement: Main): void {
        const form = this.renderLoginForm();
        mainElement.main.append(form);
    }
    public prepareUserRequest(): GeneralMessage {
        const loginElement = document.querySelector('.user-name-input');
        const loginValue =
            loginElement instanceof HTMLInputElement ? loginElement.value : '';
        const passwordElement = document.querySelector('.password-input');
        const passwordValue =
            passwordElement instanceof HTMLInputElement
                ? passwordElement.value
                : '';
        const userRequest: GeneralMessage = {
            id: '123123',
            type: 'USER_LOGIN',
            payload: {
                user: {
                    login: loginValue,
                    password: passwordValue,
                },
            },
        };
        this.connection.userIdRequest = '123123';
        return userRequest;
    }
}

function createUserNameField(): CustomElement {
    const userNameContainer = new ElementBase({
        tag: 'div',
        className: ['user-name-row'],
    }).element;
    const labelUserName = new ElementBase({
        tag: 'label',
        className: ['user-name-label'],
        textContent: 'User Name',
    }).element;
    const inputUserName = new ElementBase({
        tag: 'input',
        className: ['user-name-input'],
    }).element;
    const errorMessage = new ElementBase({
        tag: 'p',
        className: ['user-name-error'],
        textContent: '',
    }).element;
    if (inputUserName instanceof HTMLInputElement) {
        inputUserName.required = true;
        inputUserName.minLength = 2;
        inputUserName.maxLength = 10;
        inputUserName.addEventListener('input', () => {
            if (inputUserName.validity.valid === false) {
                if (inputUserName.validity.valueMissing)
                    errorMessage.textContent = 'User Name is required';
                else if (inputUserName.validity.tooShort)
                    errorMessage.textContent =
                        'User Name should have at least 2 characters';
                else if (inputUserName.validity.tooLong)
                    errorMessage.textContent =
                        'User Name should have 10 characters max';
            } else errorMessage.textContent = '';
        });
    }
    userNameContainer.append(labelUserName, inputUserName, errorMessage);

    return userNameContainer;
}

function createPasswordField(): CustomElement {
    const passwordContainer = new ElementBase({
        tag: 'div',
        className: ['password-row'],
    }).element;
    const labelPassword = new ElementBase({
        tag: 'label',
        className: ['password-label'],
        textContent: 'Password',
    }).element;
    const inputPassword = new ElementBase({
        tag: 'input',
        className: ['password-input'],
    }).element;
    const errorMessage = new ElementBase({
        tag: 'p',
        className: ['password-error'],
        textContent: '',
    }).element;
    if (inputPassword instanceof HTMLInputElement) {
        inputPassword.required = true;
        inputPassword.minLength = 6;
        inputPassword.maxLength = 10;
        inputPassword.pattern = `[a-zA-Z0-9]{6,10}`;
        inputPassword.addEventListener('input', () => {
            validatePassword(inputPassword, errorMessage);
        });
    }
    passwordContainer.append(labelPassword, inputPassword, errorMessage);

    return passwordContainer;
}

function validatePassword(
    inputPassword: HTMLInputElement,
    errorMessage: CustomElement
): void {
    if (inputPassword.validity.valid === false) {
        if (inputPassword.validity.valueMissing)
            errorMessage.textContent = 'Password is required';
        else if (inputPassword.validity.tooShort)
            errorMessage.textContent =
                'Password should have at least 6 characters';
        else if (inputPassword.validity.tooLong)
            errorMessage.textContent = 'Password should have 10 characters max';
        else if (inputPassword.validity.patternMismatch)
            errorMessage.textContent =
                'Password can contain low letters, capital Letters and numbers';
    } else errorMessage.textContent = '';
}
