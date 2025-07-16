document.addEventListener('DOMContentLoaded', () => {
    
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const loadingGif = document.querySelector('.loading-gif');

    const GIF_DURATION = 5300;
    const FALLBACK_TIMEOUT = 8000; 
    const FADE_DURATION = 800; 

    const showMainContent = () => {
        mainContent.classList.add('fade-in');
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), FADE_DURATION);
    };

    const handleGifEnd = () => {
        loadingGif.src = 'assets/images/Logo No Background.png';
        setTimeout(showMainContent, 1000);
    };

    const handleLoading = () => {
        setTimeout(handleGifEnd, GIF_DURATION);

        setTimeout(showMainContent, FALLBACK_TIMEOUT);
    };

    if (loadingGif.complete) {
        handleLoading();
    } else {
        loadingGif.addEventListener('load', handleLoading);
    }

    const addButton = document.getElementById('add-todo-button');
        addButton.addEventListener('click', () => {
        if (!document.getElementById('todo-input').value.trim()) {
            return;
        }
        const todoInput = document.getElementById('todo-input');
        const todoText = todoInput.value.trim();

        const todoList = document.getElementById('todo-items');
        var todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <span class="todo-text">${todoText}</span>
            <button class="complete-button">Complete</button>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;
        todoList.appendChild(todoItem);
        todoInput.value = '';

        const deleteButton = todoItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            todoList.removeChild(todoItem);
        });
    });
});
