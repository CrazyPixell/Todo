import * as functions from './modules/functions.js';
import $ from 'jquery';

functions.isSupportWebp();

const createTodoMarkup = function (todoText) {
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo__item');
  todoItem.innerHTML = `<button class="btn btn--check"></button>
  <span class="todo__text">${todoText}</span>
  <button class="delete-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
      <path
        fill="#494C6B"
        fill-rule="evenodd"
        d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
      />
    </svg>
  </button>`;
  todoItem.classList.add('todo__item--appear');
  return todoItem;
};

const checkStorage = () => {
  let todos;
  if (!localStorage.getItem('todos')) todos = [];
  else todos = JSON.parse(localStorage.getItem('todos'));
  return todos;
};

const saveTodosToStorage = todo => {
  const todos = checkStorage();

  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
};

const removeFromStorage = todo => {
  const todos = checkStorage();

  const todoIndex = todos.findIndex(todoEl => todoEl === todo);

  todos.splice(todoIndex, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
};

const getTodosFromStorage = () => {
  const todos = checkStorage();

  todos.map(todo => {
    const todoMarkup = createTodoMarkup(todo);
    document.querySelector('.todo__list').prepend(todoMarkup);
  });
};

$(function () {
  getTodosFromStorage();

  // Theme selectors
  const themeToggleBtn = $('.header__theme-switcher');
  const body = $('body');

  // Add todo selectors
  const todoInput = $('.header__todo-input');
  const addTodoBtn = $('.btn--add');
  const todoList = $('.todo__list');

  // Todo filter selectors
  const showActiveBtn = $('.todo__option.active');
  const showAllBtn = $('.todo__option.all');
  const showCompletedBtn = $('.todo__option.completed');

  // Clear selector
  const clearCompleted = $('.todo__clear');

  // Theme toggle
  themeToggleBtn.on('click', function () {
    if (body.hasClass('light-theme')) {
      body.removeClass('light-theme');
      body.addClass('dark-theme');
    } else {
      body.removeClass('dark-theme');
      body.addClass('light-theme');
    }
  });

  let todoCount = $('.todo__list').children('.todo__item').length;
  $('.todo__misc span').text(`${todoCount} items left`);

  // Add todo handler
  addTodoBtn.on('click', function (e) {
    e.preventDefault();

    if (todoInput.val() === '') {
      todoInput.attr('placeholder', 'Type something...');
      return;
    }

    const todoItem = createTodoMarkup(todoInput.val().trim());

    todoList.prepend(todoItem);
    saveTodosToStorage(todoInput.val().trim());

    todoInput.attr('placeholder', 'Create a new todo...');
    todoInput.val('');

    todoCount = ++todoCount;

    $('.todo__misc span').text(`${todoCount} items left`);
  });

  // Check todo handler
  $(document).on('click', '.btn--check', function () {
    $(this).closest('li').toggleClass('todo__item--checked');

    if ($(this).closest('li').hasClass('todo__item--checked')) {
      todoCount = --todoCount;
      $('.todo__misc span').text(`${todoCount} items left`);
    } else {
      todoCount = ++todoCount;
      $('.todo__misc span').text(`${todoCount} items left`);
    }
  });

  // Delete todo handler
  $(document).on('click', '.delete-btn', function () {
    const todo = $(this).closest('li');
    todo.addClass('todo__item--remove');
    setTimeout(function () {
      todo.remove();
    }, 500);

    removeFromStorage(todo.text().trim());

    todoCount = --todoCount;
    if (todoCount === 0) todoCount = 0;
    $('.todo__misc span').text(`${todoCount} items left`);
  });

  // Filter todos handler
  showCompletedBtn.on('click', function () {
    const todos = $('.todo__item');

    $('.todo__option').each(function () {
      $(this).removeClass('todo__option--active');
    });
    $(this).addClass('todo__option--active');

    todos.each(function () {
      if ($(this).hasClass('todo__item--checked')) {
        $(this).css('display', 'flex');
      } else {
        $(this).css('display', 'none');
      }
    });
  });

  showActiveBtn.on('click', function () {
    const todos = $('.todo__item');

    $('.todo__option').each(function () {
      $(this).removeClass('todo__option--active');
    });
    $(this).addClass('todo__option--active');

    todos.each(function () {
      if ($(this).hasClass('todo__item--checked')) {
        $(this).css('display', 'none');
      } else {
        $(this).css('display', 'flex');
      }
    });
  });

  showAllBtn.on('click', function () {
    const todos = $('.todo__item');

    $('.todo__option').each(function () {
      $(this).removeClass('todo__option--active');
    });
    $(this).addClass('todo__option--active');

    todos.each(function () {
      $(this).css('display', 'flex');
    });
  });

  // Clear completed todos
  clearCompleted.on('click', function () {
    const todos = $('.todo__item');

    todos.each(function () {
      if ($(this).hasClass('todo__item--checked')) {
        $(this).remove();

        todoCount = --todoCount;
        if (todoCount == 0) {
          todoCount = 0;
          $('.todo__misc span').text(`${todoCount} items left`);
        } else {
          $('.todo__misc span').text(`${todoCount} items left`);
        }
      }
    });
  });
});
