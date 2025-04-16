import type { Connection } from '../connection/connection';
import type { UserService } from './user-service';
import type { GeneralMessage } from '../interfaces';

function renderLoginContent(
    Connection: Connection,
    UserService: UserService
): void {
    document
        .querySelector('.main')
        ?.append(createLoginForm(Connection, UserService));
    const userName = document.querySelector('.user-name-input');

    const password = document.querySelector('.password-input');
    if (
        userName instanceof HTMLInputElement &&
        password instanceof HTMLInputElement
    ) {
        if (
            userName.validity.valid === false ||
            password.validity.valid === false
        )
            disableLoginButton();
        else enableLoginButton();
    }
}

function createLoginForm(
    Connection: Connection,
    UserService: UserService
): HTMLElement {
    const form = document.createElement('form');
    form.className = 'auth-form';
    const userName = createUserNameField();
    const password = createPasswordField();

    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.addEventListener('click', (event) => {
        event?.preventDefault();
        const request = prepareUserRequest(Connection, UserService);
        UserService.userLogin(request);
    });

    form.append(userName, password, loginButton);

    return form;
}

function createUserNameField(): HTMLElement {
    const userNameContainer = document.createElement('div');
    userNameContainer.className = 'user-name-row';

    const labelUserName = document.createElement('label');
    labelUserName.className = 'user-name-label';
    labelUserName.textContent = 'User Name';

    const inputUserName = document.createElement('input');
    inputUserName.className = 'user-name-input';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'user-name-error';

    if (inputUserName instanceof HTMLInputElement) {
        inputUserName.required = true;
        inputUserName.minLength = 2;
        inputUserName.maxLength = 10;
        inputUserName.addEventListener('input', () => {
            validateUserName(inputUserName, errorMessage);
        });
    }
    userNameContainer.append(labelUserName, inputUserName, errorMessage);

    return userNameContainer;
}

function createPasswordField(): HTMLElement {
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-row';

    const labelPassword = document.createElement('label');
    labelPassword.className = 'password-label';
    labelPassword.textContent = 'Password';

    const inputPassword = document.createElement('input');
    inputPassword.className = 'password-input';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'password-error';

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

function prepareUserRequest(
    connection: Connection,
    userService: UserService
): GeneralMessage {
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

    connection.userIdRequest = crypto.randomUUID();
    userService.currentUserName = loginValue;
    return userRequest;
}

function disableLoginButton(): void {
    const button = document.querySelector('.login-button');
    console.log(button);
    if (button instanceof HTMLButtonElement) button.disabled = true;
}

function enableLoginButton(): void {
    const button = document.querySelector('.login-button');
    console.log(button);
    if (button instanceof HTMLButtonElement) button.disabled = false;
}

export { renderLoginContent };
