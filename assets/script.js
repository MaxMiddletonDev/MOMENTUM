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
// USER DETAIL MODULES
// ========================================

const EditUserButton = {
    elements: {
        editButton: null,
        userName: null
    },
    init() {
        this.elements.editButton = document.getElementById('edit-user-button');
        this.elements.userName = document.getElementById('user-name');
        this.elements.editButton.addEventListener('click', () => {
            this.handleEditUser();
        });
    },

    handleEditUser() {
        const newUserName = prompt("Enter new user name:", this.elements.userName.textContent);
        if (newUserName) {
            this.elements.userName.textContent = newUserName;
        }
    }
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
        // Call the TodoList editTodo method to handle the edit workflow
        TodoList.editTodo(todoItem);
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
        saveButton: null,
        todoInput: null,
        todoList: null
    },
    
    currentEditingItem: null,

    init() {
        this.elements.addButton = document.getElementById('add-todo-button');
        this.elements.saveButton = document.getElementById('save-todo-button');
        this.elements.todoInput = document.getElementById('todo-input');
        this.elements.todoList = document.getElementById('todo-items');
        this.elements.todoDescription = document.getElementById('todo-description');
        this.elements.todoDifficulty = document.getElementById('difficulty');
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        this.elements.addButton.addEventListener('click', () => {
            if (this.currentEditingItem) {
                this.cancelEdit();
            } else {
                this.addTodo();
            }
        });
        
        this.elements.saveButton.addEventListener('click', () => {
            if (this.currentEditingItem) {
                this.saveTodo();
            } else {
                this.addTodo();
            }
        });
        
        this.elements.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (this.currentEditingItem) {
                    this.saveTodo();
                } else {
                    this.addTodo();
                }
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
        this.clearInputs();
    },
    
    editTodo(todoItem) {
        this.currentEditingItem = todoItem;
 
        const todoTextSpan = todoItem.querySelector('.todo-text');
        const todoText = todoTextSpan.textContent;
        const todoDescription = todoItem.dataset.description || '';
        const todoDifficulty = todoItem.dataset.difficulty || '';
        
        this.elements.todoInput.value = todoText;
        this.elements.todoDescription.value = todoDescription;
        this.elements.todoDifficulty.value = todoDifficulty;
        
        this.updateButtonStates();
        
        this.elements.todoInput.focus();
    },
    
    saveTodo() {
        if (!this.currentEditingItem) {
            this.addTodo();
            return;
        }
        
        const todoText = this.elements.todoInput.value.trim();
        
        if (!todoText) {
            return;
        }
        
        const todoDescription = this.elements.todoDescription.value.trim();
        const todoDifficulty = this.elements.todoDifficulty.value.trim();
        
        const todoTextSpan = this.currentEditingItem.querySelector('.todo-text');
        todoTextSpan.textContent = todoText;
        
        this.currentEditingItem.dataset.description = todoDescription;
        this.currentEditingItem.dataset.difficulty = todoDifficulty;
        
        this.clearInputs();
        this.currentEditingItem = null;
        this.updateButtonStates();
    },
    
    cancelEdit() {
        this.currentEditingItem = null;
        this.clearInputs();
        this.updateButtonStates();
    },
    
    clearInputs() {
        this.elements.todoInput.value = '';
        this.elements.todoDescription.value = '';
        this.elements.todoDifficulty.value = '';
    },
    
    updateButtonStates() {
        if (this.currentEditingItem) {
            this.elements.addButton.textContent = 'CANCEL';
            this.elements.saveButton.textContent = 'UPDATE';
        } else {
            this.elements.addButton.textContent = 'ADD';
            this.elements.saveButton.textContent = 'SAVE';
        }
    }
};

// ========================================
// APPLICATION INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();
    TodoList.init();
    EditUserButton.init();
});
