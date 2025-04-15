import type { Connection } from '../connection/connection';
import type { Main } from '../components/main';
import { ElementBase } from '../components/elements';
import type { CustomElement } from '../interfaces';
import { Button } from '../components/buttons';

export class LoginPage {
    public connection: Connection;
    constructor(connection: Connection, mainElement: Main) {
        this.connection = connection;
        configurePage(mainElement);
    }
}
function configurePage(mainElement: Main): void {
    const form = renderLoginForm();
    mainElement.main.append(form);
}
function renderLoginForm(): CustomElement {
    const form = new ElementBase({
        tag: 'form',
        className: ['auth-form'],
    }).element;

    const userName = createUserNameField();
    const password = createPasswordField();
    const loginButton = new Button({
        className: ['login-button'],
        textContent: 'Login',
        handlerFunction: (): void => {
            event?.preventDefault();
            console.log('login');
        },
    }).element;

    form.append(userName, password, loginButton);

    return form;
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
