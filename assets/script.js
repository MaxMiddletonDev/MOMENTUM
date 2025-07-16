// ========================================
// CONFIGURATION & STATE
// ========================================
const CONFIG = {
    GIF_DURATION: 5300,
    FALLBACK_TIMEOUT: 8000,
    FADE_DURATION: 800
};

let gameState = {
    experience: 0
};

// ========================================
// LOADING SCREEN MODULE
// ========================================
const LoadingScreen = {
    elements: {
        loadingScreen: null,
        mainContent: null,
        loadingGif: null
    },

    init() {
        this.elements.loadingScreen = document.getElementById('loading-screen');
        this.elements.mainContent = document.getElementById('main-content');
        this.elements.loadingGif = document.querySelector('.loading-gif');
        
        this.setupLoading();
    },

    showMainContent() {
        this.elements.mainContent.classList.add('fade-in');
        this.elements.loadingScreen.classList.add('hidden');
        setTimeout(() => this.elements.loadingScreen.remove(), CONFIG.FADE_DURATION);
    },

    handleGifEnd() {
        this.elements.loadingGif.src = 'assets/images/Logo No Background.png';
        setTimeout(() => this.showMainContent(), 1000);
    },

    handleLoading() {
        setTimeout(() => this.handleGifEnd(), CONFIG.GIF_DURATION);
        setTimeout(() => this.showMainContent(), CONFIG.FALLBACK_TIMEOUT);
    },

    setupLoading() {
        if (this.elements.loadingGif.complete) {
            this.handleLoading();
        } else {
            this.elements.loadingGif.addEventListener('load', () => this.handleLoading());
        }
    }
};

// ========================================
// EXPERIENCE SYSTEM MODULE
// ========================================
const ExperienceSystem = {
    addExperience() {
        const points = Math.floor(Math.random() * 9) + 1;
        gameState.experience += points;
        console.log(`Experience points: ${gameState.experience}`);
        return points;
    },

    getExperience() {
        return gameState.experience;
    }
};

// ========================================
// TODO ITEM MODULE
// ========================================
const TodoItem = {
    create(text) {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <span class="todo-text">${text}</span>
            <button class="complete-button">Complete</button>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;
        
        this.attachEventListeners(todoItem);
        return todoItem;
    },

    attachEventListeners(todoItem) {
        const completeButton = todoItem.querySelector('.complete-button');
        const editButton = todoItem.querySelector('.edit-button');
        const deleteButton = todoItem.querySelector('.delete-button');
        const todoList = document.getElementById('todo-items');

        completeButton.addEventListener('click', () => {
            this.handleComplete(todoItem, todoList);
        });

        editButton.addEventListener('click', () => {
            this.handleEdit(todoItem);
        });

        deleteButton.addEventListener('click', () => {
            this.handleDelete(todoItem, todoList);
        });
    },

    handleComplete(todoItem, todoList) {
        todoList.removeChild(todoItem);
        ExperienceSystem.addExperience();
    },

    handleEdit(todoItem) {
        const todoTextSpan = todoItem.querySelector('.todo-text');
        const currentText = todoTextSpan.textContent;
        const newText = prompt('Edit your task:', currentText);
        
        if (newText !== null && newText.trim() !== '') {
            todoTextSpan.textContent = newText.trim();
        }
    },

    handleDelete(todoItem, todoList) {
        todoList.removeChild(todoItem);
    }
};

// ========================================
// TODO LIST MODULE
// ========================================
const TodoList = {
    elements: {
        addButton: null,
        todoInput: null,
        todoList: null
    },

    init() {
        this.elements.addButton = document.getElementById('add-todo-button');
        this.elements.todoInput = document.getElementById('todo-input');
        this.elements.todoList = document.getElementById('todo-items');
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.elements.addButton.addEventListener('click', () => this.addTodo());
        this.elements.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    },

    addTodo() {
        const todoText = this.elements.todoInput.value.trim();
        
        if (!todoText) {
            return;
        }

        const todoItem = TodoItem.create(todoText);
        this.elements.todoList.appendChild(todoItem);
        this.elements.todoInput.value = '';
    }
};

// ========================================
// APPLICATION INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();
    TodoList.init();
});
