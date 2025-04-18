import type {
    GeneralMessage,
    UserPayloadClient,
    UserPayloadServer,
    ErrorTest,
    UserPayloadServerUsers,
    MessagePayloadServer,
} from './interfaces';

function isGeneralMessage(data: unknown): data is GeneralMessage {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('id' in data) || !('type' in data) || !('payload' in data))
        return false;

    return true;
}

function isUserPayloadServer(data: unknown): data is UserPayloadServer {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('user' in data)) return false;

    const userObject = data.user;
    if (
        typeof userObject !== 'object' ||
        userObject === null ||
        !('isLogined' in userObject) ||
        !('login' in userObject)
    )
        return false;
    return typeof userObject.isLogined === 'boolean';
}

function isUsersPayloadServer(data: unknown): data is UserPayloadServerUsers {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('users' in data)) return false;

    const usersObject = data.users;
    if (
        typeof usersObject !== 'object' ||
        usersObject === null ||
        !Array.isArray(usersObject)
    )
        return false;

    const userObject: unknown = usersObject[0];
    if (
        typeof userObject !== 'object' ||
        userObject === null ||
        !('isLogined' in userObject) ||
        !('login' in userObject)
    )
        return false;
    return typeof userObject.isLogined === 'boolean';
}

function isUserPayloadClient(data: unknown): data is UserPayloadClient {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('user' in data)) return false;

    const userObject = data.user;
    if (
        typeof userObject !== 'object' ||
        userObject === null ||
        !('password' in userObject) ||
        !('login' in userObject)
    )
        return false;
    return typeof userObject.password === 'string';
}

function isErrorPayload(data: unknown): data is ErrorTest {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('error' in data)) return false;

    const error = data.error;
    if (typeof error !== 'string') return false;
    return true;
}

function isMessagePayloadServer(data: unknown): data is MessagePayloadServer {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('message' in data)) return false;

    const messageObject = data.message;
    if (typeof messageObject !== 'object' || messageObject === null)
        return false;

    if (
        !('id' in messageObject) ||
        !('from' in messageObject) ||
        !('to' in messageObject) ||
        !('text' in messageObject) ||
        !('datetime' in messageObject) ||
        !('status' in messageObject)
    )
        return false;
    return typeof messageObject.text === 'string';
}

export {
    isGeneralMessage,
    isUserPayloadServer,
    isUserPayloadClient,
    isErrorPayload,
    isUsersPayloadServer,
    isMessagePayloadServer,
};
