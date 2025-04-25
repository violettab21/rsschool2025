import image from '../../assets/close.svg';

function createErrorMessage(text: string): void {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'dark-view';
    const modal = document.createElement('div');
    modal.className = 'modal';

    const cross = document.createElement('span');
    cross.className = 'icon-close';

    cross.addEventListener('click', closeModal);

    const crossImage = new Image();
    crossImage.src = image;

    const modalText = document.createElement('p');
    modalText.textContent = text;
    modalText.className = 'modal-text';

    cross.append(crossImage);
    modalContainer.append(modal);
    modal.append(cross, modalText);
    document.body.append(modalContainer);
    closeModalOnEsc();
}

function closeModal(): void {
    const modalContainer = document.querySelector('.dark-view');
    if (modalContainer) modalContainer.remove();
}

function closeModalOnEsc(): void {
    document.addEventListener('keydown', (event) => {
        if (event.code == 'Escape') {
            closeModal();
        }
    });
}

export { createErrorMessage };
