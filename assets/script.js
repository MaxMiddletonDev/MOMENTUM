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
    addExperience(todoItem) {
        const points = todoItem.dataset.difficulty ? parseInt(todoItem.dataset.difficulty) : Math.floor(Math.random() * 9) + 1;
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
    create(todoData) {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <span class="todo-text">${todoData.text || todoData}</span>
            <button class="complete-button">Complete</button>
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;

        if (typeof todoData === 'object') {
            todoItem.dataset.description = todoData.description || '';
            todoItem.dataset.difficulty = todoData.difficulty || '';
        } else {

            todoItem.dataset.description = '';
            todoItem.dataset.difficulty = '';
        }
        
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
        ExperienceSystem.addExperience(todoItem);
    },

    handleEdit(todoItem) {
        const todoTextSpan = todoItem.querySelector('.todo-text');
        const todoText = todoTextSpan.textContent;
        const todoDescription = todoItem.dataset.description || '';
        const todoDifficulty = todoItem.dataset.difficulty || '';
        const todoInput = document.getElementById('todo-input');
        const todoDescriptionInput = document.getElementById('todo-description');
        const todoDifficultyInput = document.getElementById('difficulty');
        todoInput.value = todoText;
        todoDescriptionInput.value = todoDescription;
        todoDifficultyInput.value = todoDifficulty;
        todoInput.focus();

        todoInput.addEventListener('change', () => {
            todoTextSpan.textContent = todoInput.value;
            todoItem.dataset.description = todoDescriptionInput.value;
            todoItem.dataset.difficulty = todoDifficultyInput.value;
            todoInput.value = '';
            todoDescriptionInput.value = '';
            todoDifficultyInput.value = '';
        }, { once: true });
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
        todoDescription: null,
        todoDifficulty: null,
        addButton: null,
        todoInput: null,
        todoList: null
    },

    init() {
        this.elements.addButton = document.getElementById('add-todo-button');
        this.elements.todoInput = document.getElementById('todo-input');
        this.elements.todoList = document.getElementById('todo-items');
        this.elements.todoDescription = document.getElementById('todo-description');
        this.elements.todoDifficulty = document.getElementById('difficulty');
        
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
        
        const todoDescription = this.elements.todoDescription.value.trim();
        const todoDifficulty = this.elements.todoDifficulty.value.trim();
        
        const todoData = {
            text: todoText,
            description: todoDescription,
            difficulty: todoDifficulty
        };
        
        const todoItem = TodoItem.create(todoData);
        this.elements.todoList.appendChild(todoItem);
        this.elements.todoInput.value = '';
        this.elements.todoDescription.value = '';
        this.elements.todoDifficulty.value = '';
    }
};

// ========================================
// APPLICATION INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();
    TodoList.init();
});
