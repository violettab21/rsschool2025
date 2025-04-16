import type {
    GeneralMessage,
    UserPayloadClient,
    UserPayloadServer,
    ErrorTest,
} from './interfaces';

function isGeneralMessage(data: unknown): data is GeneralMessage {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    if (!('id' in data) || !('type' in data) || !('payload' in data))
        return false;

    if (typeof data.payload !== 'object' || data.payload === null) return false;

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

export {
    isGeneralMessage,
    isUserPayloadServer,
    isUserPayloadClient,
    isErrorPayload,
};
