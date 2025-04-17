function createBaseContainer(): void {
    const container = document.createElement('div');
    container.className = 'wrapper';
    document.body.append(container);
}
export { createBaseContainer };
