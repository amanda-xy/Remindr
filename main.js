// Selectors

const movieBtn = document.querySelector('.movie-btn');
const todoBtn = document.querySelector('.todo-btn');

// Todos
const todoList = document.getElementById('todo-list');
const todosPage = document.getElementById('todos-page');

// New Todo
const addTodoBtn = document.getElementById('add-todo-btn');
const newTodoPage = document.getElementById('new-todo-page');
const newTodoCancelBtn = document.getElementById('new-todo-cancel-btn');
const newTodoPriorityBtnsDiv = document.getElementById('new-todo-priority-btns');
const newTodoPriorityBtns = document.querySelectorAll('.priority-btn');
const todoTypeBtns = document.querySelectorAll('.type.new-todo');
const newTodoSaveBtn = document.getElementById('new-todo-save-btn');


// Watchlist
const watchlistPage = document.getElementById('watchlist-page');
const addMovieBtn = document.getElementById('add-movie-btn');
const watchlist = document.getElementById('watchlist');


// Add movie
const addMoviePage = document.getElementById('add-movie-page');
const addMovieSearchBtn = document.getElementById('add-movie-search-btn');
const addMovieList = document.getElementById('add-movie-list');
const modal = document.querySelector('.movie-details-modal');
const modalContent = document.querySelector('.modal-content'); 
const closeModalButton = document.querySelector('.close-btn');
const closeAddMovieBtn = document.getElementById('close-add-movie-page');



// Events

// Todo
addTodoBtn.addEventListener('click', getNewTodoPage);
newTodoCancelBtn.addEventListener('click', cancelNewTodo);
newTodoSaveBtn.addEventListener('click', createNewTodo);

newTodoPriorityBtnsDiv.addEventListener('click', priorityBtnClicked);

todoTypeBtns.forEach(type => {
    type.addEventListener('click', todoTypeBtnClicked);
});

movieBtn.addEventListener('click', movieBtnClicked);
todoBtn.addEventListener('click', todoBtnClicked);

// Watchlist
addMovieBtn.addEventListener('click', getAddMoviePage);
watchlistPage.addEventListener('click', watchlistPageClicked);

// Add movie
addMoviePage.addEventListener('click', addMoviePageClicked);

// Modal
modal.addEventListener('click', modalClicked);



// Functions

function movieBtnClicked() {
    const gotWatchList = getWatchlistPage();

    if (gotWatchList) {
        movieBtn.setAttribute('style', 'display:none');
        todoBtn.setAttribute('style', 'display:block');

        todosPage.classList.remove('adjust-display');
        todosPage.classList.remove('display');
        todosPage.classList.add('adjust-display');
        watchlistPage.classList.remove('adjust-display');
        watchlistPage.classList.remove('display');
        watchlistPage.classList.add('display');
    }
}

function todoBtnClicked() {
    todoBtn.setAttribute('style', 'display:none');
    movieBtn.setAttribute('style', 'display:block');

    todosPage.classList.remove('display');
    todosPage.classList.remove('adjust-display');
    todosPage.classList.add('display');
    watchlistPage.classList.remove('display');
    watchlistPage.classList.remove('adjust-display');
    watchlistPage.classList.add('adjust-display');
}

// New Todo

function getNewTodoPage() {
    if (editingTodos())
    {
        alert('Please save todo changes first');
    } else {
        todosPage.classList.remove('adjust-display');
        todosPage.classList.remove('display');
        todosPage.classList.add('display');
        watchlistPage.classList.remove('adjust-display');
        watchlistPage.classList.remove('display');
        watchlistPage.classList.add('hidden');
        newTodoPage.classList.remove('hidden');
        newTodoPage.classList.add('display');
    }
};

function editingTodos() {
    const todos = todoList.getElementsByTagName('li');
    for (i = 0; i < todos.length; i++) {
        if (todos[i].classList.contains('editing')) {
            return true;
        }
    }
    return false;
}

function cancelNewTodo() {
    clearNewTodoForm();
    newTodoPage.classList.remove('display');
    newTodoPage.classList.add('hidden');
    watchlistPage.classList.remove('hidden');
    watchlistPage.classList.add('adjust-display');
};

function priorityBtnClicked(e) {
    if (e.target.tagName.toLowerCase() == 'img') {
        priorityChanged(e.target);
    }
};

function priorityChanged(button) {
    const selected = document.querySelector('.priority-btn.selected');
    if (selected != null && selected != undefined) {
        selected.classList.remove('selected');
    }

    button.classList.add('selected');

    if (button.parentElement.classList.contains('edit-priority-div')) {
        changePriority(button, button.parentElement.parentElement.parentElement.parentElement);
    }
}

function todoTypeBtnClicked(e) {
    const selected = document.querySelector('.type.new-todo.selected');
    if (selected != null || selected != undefined) {
        selected.classList.remove('selected');
    }

    const type = e.target;
    type.classList.add('selected');
};

function createNewTodo() {
    const task = document.getElementById('new-todo-task-input');
    const selectedPriority = btnSelected(newTodoPriorityBtns);
    const selectedType = btnSelected(todoTypeBtns);
    const description = document.getElementById('new-todo-description-input');

    if (task.value === '' || !task.value.trim()) {
        alert('Please enter a task!');
        return;
    } 
    if (!selectedPriority) {
        alert('Please select a priority for your todo');
        return;
    }
    if (!selectedType) {
        alert('Please select a type for your todo');
        return;
    }
    
    const li = document.createElement('li');
    li.classList = 'todo-item';
    
    const outerDiv = document.createElement('div');
    outerDiv.classList = 'card todo-list-item row d-flex';
    outerDiv.setAttribute('style', 'position: relative');
    li.appendChild(outerDiv);
    
    const priorityIconDiv = document.createElement('div');
    priorityIconDiv.classList = 'col-1 priority-div ';
    outerDiv.appendChild(priorityIconDiv);

    const priorityIcon = document.createElement('img');
    priorityIcon.classList = `priority-btn ${selectedPriority.name}`;
    priorityIcon.src = `/images/${selectedPriority.name}-icon.png`;
    priorityIcon.alt = `${(selectedPriority.name.charAt(0).toUpperCase() + selectedPriority.name.slice(1)).replace('-', ' ')}`;
    priorityIcon.name = `${selectedPriority.name}`
    priorityIconDiv.appendChild(priorityIcon);

    const taskDiv = document.createElement('div');
    taskDiv.classList = 'col-sm-8 col-7 task-div';
    outerDiv.appendChild(taskDiv);

    const taskLabel = document.createElement('label');
    taskLabel.classList = 'text task clickable line-clamp';
    taskLabel.innerText = task.value;
    taskLabel.name = task.value.replaceAll(' ', '-');
    taskDiv.appendChild(taskLabel);

    const editPriorityDiv = document.createElement('div');
    editPriorityDiv.classList.add('edit-priority-div');
    editPriorityDiv.setAttribute('style', 'display:none');
    taskDiv.appendChild(editPriorityDiv);

    const highestPriority = document.createElement('img');
    highestPriority.classList = `priority-btn highest-priority`;
    highestPriority.src = `/images/highest-priority-icon.png`;
    highestPriority.alt = `Highest priority`;
    highestPriority.name = 'highest-priority';
    editPriorityDiv.appendChild(highestPriority);

    const highPriority = document.createElement('img');
    highPriority.classList = `priority-btn high-priority`;
    highPriority.src = `/images/high-priority-icon.png`;
    highPriority.alt = `High priority`;
    highPriority.name = 'high-priority';
    editPriorityDiv.appendChild(highPriority);

    const mediumPriority = document.createElement('img');
    mediumPriority.classList = `priority-btn medium-priority`;
    mediumPriority.src = `/images/medium-priority-icon.png`;
    mediumPriority.alt = `Medium priority`;
    mediumPriority.name = 'medium-priority';
    editPriorityDiv.appendChild(mediumPriority);

    const lowPriority = document.createElement('img');
    lowPriority.classList = `priority-btn low-priority`;
    lowPriority.src = `/images/low-priority-icon.png`;
    lowPriority.alt = `low priority`;
    lowPriority.name = 'low-priority';
    editPriorityDiv.appendChild(lowPriority);

    const editTaskDiv = document.createElement('div');
    editTaskDiv.setAttribute('style', 'margin-top: -2%; margin-left: -2%');
    taskDiv.appendChild(editTaskDiv);

    const editTaskInput = document.createElement('input');
    editTaskInput.classList = 'edit-input';
    editTaskInput.setAttribute('style', 'display:none');
    editTaskDiv.appendChild(editTaskInput);

    const endDiv = document.createElement('div');
    endDiv.classList = 'col-lg-3 col-sm-2 col-3 end-div';
    outerDiv.appendChild(endDiv);

    const todoTypeDiv = document.createElement('div');
    todoTypeDiv.classList = 'row todo-type-div';
    endDiv.appendChild(todoTypeDiv);

    const todoTypeLbl = document.createElement('label');
    todoTypeLbl.classList = `type ${selectedType.id}`; 
    todoTypeLbl.id = 'type-chosen';
    todoTypeLbl.innerText = selectedType.id;
    todoTypeLbl.setAttribute('style', 'display:block');
    todoTypeDiv.appendChild(todoTypeLbl);

    const todoTypePersonal = document.createElement('label');
    todoTypePersonal.classList = 'type personal clickable'; 
    todoTypePersonal.innerText = 'personal';
    todoTypePersonal.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypePersonal);

    const todoTypeSchool = document.createElement('label');
    todoTypeSchool.classList = 'type school clickable'; 
    todoTypeSchool.innerText = 'school';
    todoTypeSchool.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypeSchool);

    const todoTypeWork = document.createElement('label');
    todoTypeWork.classList = 'type work clickable'; 
    todoTypeWork.innerText = 'work';
    todoTypeWork.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypeWork);

    const todoTypeSocial = document.createElement('label');
    todoTypeSocial.classList = 'type social clickable'; 
    todoTypeSocial.innerText = 'social';
    todoTypeSocial.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypeSocial);

    const todoTypeFamily = document.createElement('label');
    todoTypeFamily.classList = 'type family clickable'; 
    todoTypeFamily.innerText = 'family';
    todoTypeFamily.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypeFamily);

    const todoTypeSports = document.createElement('label');
    todoTypeSports.classList = 'type sports clickable'; 
    todoTypeSports.innerText = 'sports';
    todoTypeSports.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypeSports);

    const todoTypeOther = document.createElement('label');
    todoTypeOther.classList = 'type other clickable'; 
    todoTypeOther.innerText = 'other';
    todoTypeOther.setAttribute('style', 'display:none');
    todoTypeDiv.appendChild(todoTypeOther);

    const editDeleteDiv = document.createElement('div');
    editDeleteDiv.classList = 'row edit-delete-div';
    editDeleteDiv.setAttribute('style', 'padding-top: 5%;');
    endDiv.appendChild(editDeleteDiv);

    const editBtnDiv = document.createElement('div');
    editBtnDiv.classList = 'col-lg-5 col-sm-5 col-5';
    editDeleteDiv.appendChild(editBtnDiv);

    const editBtn = document.createElement('img');
    editBtn.src = '/images/edit-icon.png';
    editBtn.alt = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtnDiv.appendChild(editBtn);

    const saveBtn = document.createElement('img');
    saveBtn.src = '/images/save-icon.png';
    saveBtn.alt = 'Save';
    saveBtn.classList.add('save-btn');
    saveBtn.setAttribute('style', 'display:none');
    editBtnDiv.appendChild(saveBtn);

    const deleteBtnDiv = document.createElement('div');
    deleteBtnDiv.classList = 'col-lg-6 col-6';
    editDeleteDiv.appendChild(deleteBtnDiv);

    const deleteBtn = document.createElement('img');
    deleteBtn.src = '/images/trash-icon.png';
    deleteBtn.alt = 'Delete';
    deleteBtn.classList.add('trash-btn');
    deleteBtnDiv.appendChild(deleteBtn);

    const exitBtn = document.createElement('img');
    exitBtn.src = '/images/exit-icon.png';
    exitBtn.alt = 'Exit';
    exitBtn.classList.add('exit-btn');
    exitBtn.setAttribute('style', 'display:none');
    deleteBtnDiv.appendChild(exitBtn);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList = 'description-div';
    descriptionDiv.setAttribute('style', 'display:none');
    li.appendChild(descriptionDiv);

    const descriptionPara = document.createElement('p');
    descriptionPara.innerText = description.value;
    descriptionPara.classList = 'description-text'
    if (description.value.trim() === '') {
        descriptionPara.innerText = 'No description';
    }
    descriptionDiv.appendChild(descriptionPara);

    const editDescription = document.createElement('textarea');
    editDescription.classList = 'edit-input';
    editDescription.setAttribute('rows', '3');
    editDescription.setAttribute('style', 'display:none');
    editDescription.id = 'edit-description';
    descriptionDiv.appendChild(editDescription);

    li.addEventListener('click', todoClicked);

    let inserted;
    for(i = 0; i < todoList.children.length; i++) {
        if (todoList.children[i].classList.contains('finished')) {
            todoList.insertBefore(li, todoList.children[i]);
            inserted = true;
        }
    }

    if (!inserted) {
        todoList.appendChild(li);
    }
    


    clearNewTodoForm();
    newTodoPage.classList.remove('display');
    newTodoPage.classList.add('hidden');
    watchlistPage.classList.remove('hidden');
    watchlistPage.classList.add('adjust-display');
}

function btnSelected(btns) {
    
    for(i = 0; i < btns.length; i++) 
    {
        if (btns[i].classList.contains('selected')) {
            return btns[i];
        };
    }
    
    return null;
};

function clearNewTodoForm() {
    document.getElementById('new-todo-task-input').value = '';
    document.getElementById('new-todo-description-input').value = '';

    const selectedPriority = document.querySelector('.priority-btn.selected');
    if (selectedPriority) {
        selectedPriority.classList.remove('selected');
    }

    const selectedType = document.querySelector('.type.new-todo.selected');
    if (selectedType) {
        selectedType.classList.remove('selected');
    }
}

// Todos

function todoClicked(e) {
    const target = e.target;
    let todo = target;

    while (!todo.classList.contains('todo-item')) {
        todo = todo.parentElement;
    }
    
    console.log(target);
    if (target.classList.contains('edit-btn')) {
        editTodo(todo);

    } else if (target.classList.contains('priority-btn')) {
        if (target.classList.contains('edit')) {
            editPriority(todo);
        } else if (target.parentElement.classList.contains('edit-priority-div')) {
            priorityChanged(target);
        } else if (target.classList.contains('finished')) {
            todoNotFinished(todo);
        } else {
            todoFinished(todo, target);
        }
    } else if (target.classList.contains('save-btn')) {
        editTodoSaveChanges(todo);
    } else if (target.classList.contains('exit-btn')) {
        editTodoCancel(todo);
    } else if (target.classList.contains('type') && target.classList.contains('clickable')) {
        editTodoType(todo);
    } else if (target.classList.contains('trash-btn')) {
        deleteTodo(todo);
    } else if (target.classList.contains('text')) {
        taskLabelClicked(todo, target);
    } 
}

function taskLabelClicked(todo, target) {
    const div = todo.querySelector('.description-div');
    if (div.style.display === 'none') {
        div.setAttribute('style', 'display:block');
    } else {
        div.setAttribute('style', 'display:none');
    }
   
}

// Edit 

function editTodo(todo) {
    const taskLbl = todo.getElementsByClassName('task')[0];
    const taskDiv = taskLbl.parentElement;
    const input = taskDiv.getElementsByTagName('input')[0];
    const editBtn = todo.getElementsByClassName('edit-btn')[0];
    const editDiv = editBtn.parentElement;
    const saveBtn = editDiv.getElementsByClassName('save-btn')[0];
    const deleteBtn = todo.getElementsByClassName('trash-btn')[0];
    const deleteDiv = deleteBtn.parentElement;
    const exitBtn = deleteDiv.getElementsByClassName('exit-btn')[0];
    const priorityIcon = todo.getElementsByClassName('priority-btn')[0];
    const todoType = todo.querySelector('#type-chosen');
    const descriptionDiv = todo.getElementsByClassName('description-div')[0];
    const descriptionPara = descriptionDiv.getElementsByTagName('p')[0];
    const descriptionEdit = descriptionDiv.querySelector('#edit-description');

    taskLbl.setAttribute('style', 'display:none');
    input.setAttribute('style', 'display:block');
    input.value = taskLbl.innerText;

    todo.classList.add('editing');

    editBtn.setAttribute('style', 'display:none');
    saveBtn.setAttribute('style', 'display:block');

    deleteBtn.setAttribute('style', 'display:none');
    exitBtn.setAttribute('style', 'display:block');

    descriptionDiv.setAttribute('style', 'display:block');
    descriptionPara.setAttribute('style', 'display:none');
    descriptionEdit.setAttribute('style', 'display:block');
    descriptionEdit.value = descriptionPara.innerText;

    priorityIcon.classList.add('edit');

    todoType.classList.add('edit');

    const todoTypes = todo.getElementsByClassName('type');
    
    for(i = 0; i < todoTypes.length; i++) {
        todoTypes[i].classList.add('clickable');
    }
}

function editPriority(todo) {
    const taskInput = todo.getElementsByTagName('input')[0];
    const editPriorityDiv = todo.getElementsByClassName('edit-priority-div')[0];
    const editPriorityBtns = editPriorityDiv.children;
    const currentPriority = todo.getElementsByClassName('priority-btn edit')[0];
    taskInput.setAttribute('style', 'display:none');

    for(i = 0; i < editPriorityBtns.length; i++) {
        if (editPriorityBtns[i].src === currentPriority.src) {
            editPriorityBtns[i].classList.add('selected');
        }
    }
    editPriorityDiv.setAttribute('style', 'display:block');
}

function changePriority(newPriority, todo) {
    const editPriorityDiv = newPriority.parentElement;
    const currentPriority = todo.getElementsByClassName('priority-btn edit')[0];
    const currentPriorityDiv = currentPriority.parentElement;
    const updatedPriority = document.createElement('img');

    updatedPriority.classList = newPriority.classList + ' edit';
    updatedPriority.classList.remove('selected');
    updatedPriority.src = `/images/${newPriority.name}-icon.png`;
    updatedPriority.alt = newPriority.alt;
    updatedPriority.name = newPriority.name;
    
    currentPriority.setAttribute('style', 'display:none');
    currentPriorityDiv.appendChild(updatedPriority);

    if (!originalPriority(currentPriorityDiv)) {
        currentPriority.classList.add('original');
        currentPriority.setAttribute('style', 'display:none');
        currentPriority.classList.remove('edit');
    } else {
        currentPriority.parentElement.removeChild(currentPriority);
    }

    editPriorityDiv.setAttribute('style', 'display:none');
    const input = todo.getElementsByTagName('input')[0];
    input.setAttribute('style', 'display:block');
}

function originalPriority(priorityDiv) {
    const original = priorityDiv.getElementsByClassName('original')[0];
    return original;
}

function editTodoSaveChanges(todo) {
    const taskLbl = todo.getElementsByClassName('task')[0];
    const input = todo.getElementsByTagName('input')[0];
    const priorityOriginal = todo.getElementsByClassName('priority-btn original')[0];
    const descriptionPara = todo.getElementsByClassName('description-text')[0];
    const description = todo.querySelector('#edit-description');
    if (priorityOriginal) {
        priorityOriginal.parentElement.removeChild(priorityOriginal);
    }

    changeTodoType(todo);
    
    taskLbl.innerText = input.value;
    descriptionPara.innerText = description.value;

    closeEditMode(todo);
}

function editTodoCancel(todo) {
    const priorityOriginal = todo.getElementsByClassName('priority-btn original')[0];
    if (priorityOriginal) {
        const priorityBtn = todo.getElementsByClassName('priority-btn edit')[0];
        priorityBtn.parentElement.removeChild(priorityBtn);
        priorityOriginal.setAttribute('style', 'display;block');
        priorityOriginal.classList.remove('original');
    }

    const originalType = todo.querySelector('#type-chosen');
    originalType.classList.remove('selected');
    const selectedType = todo.getElementsByClassName('type selected')[0];

    if (selectedType) {
        selectedType.classList.remove('selected');
        selectedType.setAttribute('style', 'display:none');
    }

    originalType.setAttribute('style', 'display:block');

    closeEditMode(todo);
}

function closeEditMode(todo) {
    const taskLbl = todo.getElementsByClassName('task')[0];
    const input = todo.getElementsByTagName('input')[0];
    input.setAttribute('style', 'display:none');
    taskLbl.setAttribute('style', 'display:block');

    const descriptionPara = todo.getElementsByClassName('description-text')[0];
    const description = todo.querySelector('#edit-description');
    description.setAttribute('style', 'display:none');
    descriptionPara.setAttribute('style', 'display:block');

    const saveBtn = todo.getElementsByClassName('save-btn')[0];
    const editBtn = todo.getElementsByClassName('edit-btn')[0];
    saveBtn.setAttribute('style', 'display:none');
    editBtn.setAttribute('style', 'display:block');

    const exitBtn = todo.getElementsByClassName('exit-btn')[0];
    const deleteBtn = todo.getElementsByClassName('trash-btn')[0];
    exitBtn.setAttribute('style', 'display:none');
    deleteBtn.setAttribute('style', 'display:block');
    todo.classList.remove('editing');

    const editPriorityDiv = todo.getElementsByClassName('edit-priority-div')[0];
    editPriorityDiv.setAttribute('style', 'display:none');

    const todoTypeBtns = todo.getElementsByClassName('type');
    for(i = 0; i < todoTypeBtns.length; i++) {
        todoTypeBtns[i].classList.remove('clickable');
    }

    const priorityBtn = todo.getElementsByClassName('priority-btn edit')[0];
    if (priorityBtn) {
        priorityBtn.classList.remove('edit');
    }

    const typeSelected = todo.getElementsByClassName('type selected')[0];
    if (typeSelected) {
        typeSelected.classList.remove('selected');
    }

    const typeEdit = todo.getElementsByClassName('type edit')[0];
    if (typeEdit) {
        typeEdit.classList.remove('edit');
    }

    const prioritySelected = todo.getElementsByClassName('priority-btn selected')[0];
    if (prioritySelected) {
        prioritySelected.classList.remove('selected');
    }
}

function editTodoType(todo) {
    const currentType = todo.getElementsByClassName('type edit')[0];
    const selected = todo.getElementsByClassName('type selected')[0];
    let newSelected;

    if (!selected) {
        currentType.setAttribute('style', 'display:none');
        newSelected = currentType.nextSibling;
    } else {
        selected.setAttribute('style', 'display:none');
        selected.classList.remove('selected');
        newSelected = selected.nextSibling;
    }

    if (!newSelected) {
        newSelected = currentType;
    } else if (newSelected.innerText.toLowerCase() === currentType.innerText.toLowerCase()) {
        newSelected = newSelected.nextSibling;

        if (!newSelected) {
            newSelected = currentType;
        }
    }

    newSelected.classList.add('selected');
    newSelected.setAttribute('style', 'display:block');
}

function changeTodoType(todo) {
    const oldType = todo.getElementsByClassName('type edit')[0];
    const newType = todo.getElementsByClassName('type selected')[0];

    if (newType) {
        oldType.classList = newType.classList;
        oldType.innerText = newType.innerText;
        newType.classList.remove('selected');
        newType.setAttribute('style', 'display:none');
        oldType.setAttribute('style', 'display:block');
    } else {
        oldType.classList.remove('selected');
    }
}

// Delete todo

function deleteTodo(todo) {
    todoList.removeChild(todo);
}

// Finish todo

function todoFinished(todo, btn) {
    const priorityType = btn.name;
    btn.src = `/images/finished-${priorityType}-icon.png`;
    console.log(btn.alt);
    btn.alt += ' finished'
    btn.classList.add('finished');
    todo.classList.add('finished');

    todoList.removeChild(todo);

    todoList.appendChild(todo);
}

function todoNotFinished(todo) {
    const priorityBtn = todo.getElementsByClassName('priority-btn finished')[0];
    // console.log(priorityBtn);
    const priorityType = priorityBtn.name;
    priorityBtn.src = `/images/${priorityType}-icon.png`;
    priorityBtn.alt = priorityBtn.alt.replace(' finished', '');
    priorityBtn.classList.remove('finished');
    todo.classList.remove('finished');
} 


// Watchlist 
function getWatchlistPage() {
    if (editingTodos() || newTodoPage.style.display === 'block') {
        alert('Please save todo changes first');
        return false;
    } else {
        return true;
    }
}

function getAddMoviePage() {
    if (editingTodos()) {
        alert('Please save todo changes first');
        return false;
    } else {
        todosPage.classList.remove('display');
        todosPage.classList.remove('adjust-display');
        todosPage.classList.add('hidden');
        watchlistPage.classList.remove('adjust-display');
        watchlistPage.classList.remove('display');
        watchlistPage.classList.add('display');
        addMoviePage.classList.remove('hidden');
        addMoviePage.classList.add('display');
    }
}

async function addMovieToWatchlist(title) {
    let res = await axios.get(`http://www.omdbapi.com/?apikey=cd8e54f2&t=${title}&plot=full`);
    let data = res.data;
    const li = document.createElement('li');
    li.classList = 'watchlist-item';
    li.innerHTML = `
    <div class="card movie-list-item row d-flex flex-row">
        <div class="col-2 movie-poster-div">
        <img src="${data.Poster}" alt="" />
        </div>
        <div class="col-7 movie-info-short-div">
        <div class="row">
            <label class="movie-title line-clamp two">${data.Title}</label>
        </div>
        <div class="row">
            <label class="movie-rating-small" style="margin-top: 2px"
            ><span><img style="margin-top: -2%" class="star-small" src="/images/star.png" alt="" /></span>${data.imdbRating}</label
            >
        </div>
        </div>
        <div class="col-3 d-flex flex-column">
        <div class="col-12">
            <label class="movie-details-btn clickable">View details</label>
        </div>
        <div class="col-12">
            <img src="/images/bookmark-filled-icon.png" alt="" class="bookmark-icon filled" />
        </div>
        </div>
    </div>`;
    watchlist.appendChild(li);
}

function watchlistPageClicked (e) {
    const target = e.target;

    if (target.classList.contains('movie-details-btn')) {
        let listItem = target;
        while (!listItem.classList.contains('watchlist-item')) {
            listItem = listItem.parentElement;
        } 
        const title = listItem.querySelector('.movie-title');
        openModal(title.innerText, listItem);
    } else if (target.classList.contains('bookmark-icon')) {
        if (target.classList.contains('filled')) {
            removeFromWatchlist(target)
        }
    }
}


function removeFromWatchlist(bookmark) {
    bookmark.classList.remove('filled');
    bookmark.classList.add('unfilled');
    let listItem = bookmark;

    while (!listItem.classList.contains('watchlist-item')) {
        listItem = listItem.parentElement;
    } 
    watchlist.removeChild(listItem);

    const addMovieItems = addMovieList.getElementsByTagName('li');
    for(i = 0; i < addMovieItems.length; i++) {
        if (addMovieItems[i].querySelector('.movie-title').innerText === listItem.querySelector('.movie-title').innerText) {
            addMovieItems[i].querySelector('.bookmark-icon').classList.replace('filled', 'unfilled');
        }
    }
}

// Add movie page

function addMoviePageClicked(e) {
    const target = e.target;

    if (target.id === 'add-movie-search-btn') {
        addMovieSearch();
    } else if (target.classList.contains('movie-details-btn')) {
        const listItem = addMovieList.querySelector('.add-movie-list-item');
        const title = listItem.querySelector('.movie-title');
        openModal(title.innerText);
    } else if (target.classList.contains('bookmark-icon')) {
        if (target.classList.contains('unfilled')) {
            const listItem = addMovieList.querySelector('.add-movie-list-item');
            const title = listItem.querySelector('.movie-title');  
            target.classList.remove('unfilled');
            target.classList.add('filled'); 
            addMovieToWatchlist(title.innerText);
        } else if (target.classList.contains('filled')) {
            target.classList.replace('filled', 'unfilled');

            for(i = 0; i < watchlist.children.length; i++) {
                if (watchlist.children[i].querySelector('.movie-title').innerText === target.parentElement.parentElement.parentElement.querySelector('.movie-title').innerText) {
                    removeFromWatchlist(watchlist.children[i]);
                }
            }
        }
    } else if (target.id === 'close-add-movie-page') {
        addMoviePage.classList.remove('display');
        addMoviePage.classList.add('hidden');
        watchlistPage.classList.remove('hidden');
        watchlistPage.classList.add('display');
        todosPage.classList.remove('hidden');
        todosPage.classList.add('adjust-display');
        clearAddMoviePage();
    }
}

async function addMovieSearch() {
    clearAddMovieList();
    const input = document.getElementById('add-movie-search-input');
    if (input.value.trim()) {
        let res = await axios.get(`http://www.omdbapi.com/?apikey=cd8e54f2&t=${input.value}&plot=full`);
        let data = res.data;
        const li = document.createElement('li');
        li.classList = 'add-movie-item';
        console.log(data);
        li.innerHTML = `
        <div class = "card add-movie-list-item row d-flex flex-row">
            <div class="col-2 movie-poster-div">
                <img src="${data.Poster}" alt="" />
            </div>
            <div class="col-7 movie-info-short-div">
                <div class="row">
                    <label class="movie-title line-clamp two">${data.Title}</label>
                </div>
                <div class="row">
                    <label class="movie-rating-small" style="margin-top: 2px"><span><img style="margin-top: -2%" class="star-small" src="/images/star.png" alt="" /></span>${data.imdbRating}</label>
                </div>
            </div>
            <div class="col-3 d-flex flex-column">
                <div class="col-12">
                    <label class="movie-details-btn clickable">View details</label>
                </div>
                <div class="col-12">
                    <img src="/images/bookmark-unfilled-icon.png" alt="" class="bookmark-icon unfilled" />
                </div>
        </div>`;
        const bookmark = li.querySelector('.bookmark-icon');
        let isBookmarked = false;
        const watchlistMovies = watchlist.getElementsByTagName('li');
        for(i = 0; i < watchlistMovies.length; i++) {
            if (watchlistMovies[i].querySelector('.movie-title').innerText === data.Title) {
                isBookmarked = true;
            }
        }

        if (isBookmarked) {
            bookmark.classList.remove('unfilled');
            bookmark.classList.add('filled');
        }
        
        addMovieList.appendChild(li);
    }
}

function clearAddMovieList() {
    for(i = 0; i < addMovieList.children.length; i++) {
        addMovieList.removeChild(addMovieList.children[i]);
    }
}

function clearAddMoviePage() {
    const input = addMoviePage.querySelector('input');
    input.value = '';

    clearAddMovieList();
}




// Modal

async function openModal(movieTitle) {
    let res = await axios.get(`http://www.omdbapi.com/?apikey=cd8e54f2&t=${movieTitle}&plot=full`);
    let data = res.data;

    const img = modalContent.querySelector('#movie-info-img');
    img.src = data.Poster;

    const title = modalContent.querySelector('.title-movie-info');
    title.innerText = data.Title;

    const rating = modalContent.querySelector('.rating-text');
    rating.innerText = data.imdbRating;

    const plot = modalContent.querySelector('.movie-plot');
    plot.innerText = data.Plot;

    const year = modalContent.querySelector('.movie-year');
    year.innerText = data.Year;

    const duration = modalContent.querySelector('.movie-duration');
    const durationNumber = data.Runtime.replace('min', '');
    const hours = Math.floor(Number(durationNumber / 60));
    const minutes = durationNumber - (hours * 60);

    duration.innerText = `${hours}h ${minutes}min`;

    const genresLbl = modalContent.querySelector('span.movie-genres');
    genresLbl.innerText = data.Genre;

    const actorsLbl = modalContent.querySelector('span.movie-actors');
    actorsLbl.innerText = data.Actors;



    toggleModal();
}
  
function toggleModal() {
modal.classList.toggle('hidden');
}

function modalClicked(e) {
    const target = e.target;
    if (target === closeModalButton || target === modal) {
        toggleModal();
    }
}

