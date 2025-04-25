function getDate(milliseconds: number): string {
    return new Intl.DateTimeFormat('default', {
        timeStyle: 'short',
        dateStyle: 'short',
    }).format(milliseconds);
}
function cancelEnterTextarea(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}

function getStatus(statusObject: {
    isDelivered?: boolean;
    isReaded?: boolean;
    isEdited?: boolean;
}): string {
    let status: string = '';
    if (statusObject?.isReaded) {
        status = 'read';
    } else if (statusObject?.isDelivered) {
        status = 'delivered';
    } else status = 'sent';
    return status;
}

export { getDate, cancelEnterTextarea, getStatus };
