window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('serverModalShown')) {
        serverModal.showModal();
        localStorage.setItem('serverModalShown', 'true');
    }
})