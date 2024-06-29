const taskInput = document.getElementById('taskInput'); // Referencia al campo de entrada para la tarea
const dueDateInput = document.getElementById('dueDateInput'); // Referencia al campo de entrada para la fecha límite
const addTaskButton = document.getElementById('addTaskButton'); // Referencia al botón para agregar tarea
const taskList = document.getElementById('taskList'); // Referencia a la lista donde se mostrarán las tareas

// Evento al cargar la página para cargar las tareas guardadas en localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Obtener las tareas guardadas del localStorage o inicializar un array vacío si no hay tareas guardadas
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Iterar sobre cada tarea y crear elementos HTML para mostrarlas en la lista
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.dueDate, task.status);
        taskList.appendChild(taskItem);
    });
});

// Evento al hacer clic en el botón de agregar tarea
addTaskButton.addEventListener('click', function() {
    const taskText = taskInput.value.trim(); // Obtener el texto de la tarea y limpiar espacios al principio y al final
    const dueDate = dueDateInput.value; // Obtener la fecha límite de la tarea

    // Verificar si el campo de texto no está vacío
    if (taskText !== '') {
        // Crear un elemento HTML para la tarea y agregarlo a la lista
        const taskItem = createTaskElement(taskText, dueDate, 'incomplete');
        taskList.appendChild(taskItem);
        
        // Guardar la nueva tarea en localStorage
        saveTaskToLocalStorage(taskText, dueDate, 'incomplete');
        
        // Limpiar los campos de texto después de agregar la tarea
        taskInput.value = '';
        dueDateInput.value = '';
    } else {
        // Mostrar una alerta si el campo de texto está vacío
        alert('Por favor, ingresa una tarea.');
    }
});

// Función para crear un elemento de tarea HTML con el texto, fecha límite y estado dados
function createTaskElement(text, dueDate, status) {
    const taskItem = document.createElement('li'); // Crear un elemento <li> para la tarea
    taskItem.innerHTML = `
        <span>${text}</span> <!-- Mostrar el texto de la tarea -->
        <span class="due-date">${dueDate}</span> <!-- Mostrar la fecha límite de la tarea -->
        <div>
            <!-- Botones de estado para marcar como 'Incompleta', 'En curso' y 'Completada' -->
            <button class="statusButton incomplete">Incompleta</button>
            <button class="statusButton in-progress">En curso</button>
            <button class="statusButton completed">Completada</button>
            <!-- Botón para eliminar la tarea -->
            <button class="deleteButton">Eliminar</button>
        </div>
    `;
    
    taskItem.classList.add(status); // Agregar la clase de estado correspondiente a la tarea
    
    // Añadir event listeners a los botones de estado para cambiar el estado de la tarea
    const statusButtons = taskItem.querySelectorAll('.statusButton');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleTaskStatus(button, taskItem); // Llamar a la función para manejar el cambio de estado
        });
    });
    
    // Añadir event listener al botón de eliminar para eliminar la tarea
    const deleteButton = taskItem.querySelector('.deleteButton');
    deleteButton.addEventListener('click', function() {
        taskItem.remove(); // Eliminar el elemento HTML de la tarea
        updateLocalStorage(); // Actualizar las tareas guardadas en localStorage
    });

    return taskItem; // Retornar el elemento <li> de la tarea creada
}

// Función para manejar el cambio de estado de la tarea al hacer clic en los botones de estado
function handleTaskStatus(button, taskItem) {
    taskItem.classList.remove('incomplete', 'in-progress', 'completed'); // Remover todas las clases de estado actuales
    
    // Agregar la clase de estado correspondiente al botón de estado seleccionado
    if (button.classList.contains('incomplete')) {
        taskItem.classList.add('incomplete'); // Tarea marcada como 'Incompleta'
    } else if (button.classList.contains('in-progress')) {
        taskItem.classList.add('in-progress'); // Tarea marcada como 'En curso'
    } else if (button.classList.contains('completed')) {
        taskItem.classList.add('completed'); // Tarea marcada como 'Completada'
    }

    updateLocalStorage(); // Actualizar las tareas guardadas en localStorage después del cambio de estado
}

// Función para guardar la nueva tarea en localStorage
function saveTaskToLocalStorage(text, dueDate, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Obtener las tareas guardadas o inicializar un array vacío
    const newTask = { text, dueDate, status }; // Crear un objeto con el texto, fecha límite y estado de la nueva tarea
    tasks.push(newTask); // Agregar la nueva tarea al array de tareas
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar las tareas actualizadas en localStorage como JSON
}

// Función para actualizar las tareas guardadas en localStorage
function updateLocalStorage() {
    const taskItems = taskList.querySelectorAll('li'); // Obtener todos los elementos <li> de la lista de tareas
    const tasks = []; // Inicializar un array para almacenar las tareas actualizadas

    // Iterar sobre cada elemento <li> de tarea y guardar su texto, fecha límite y estado en el array de tareas
    taskItems.forEach(taskItem => {
        const text = taskItem.querySelector('span').textContent; // Obtener el texto de la tarea
        const dueDate = taskItem.querySelector('.due-date').textContent; // Obtener la fecha límite de la tarea
        let status = ''; // Inicializar una variable para el estado de la tarea
        
        // Determinar el estado actual de la tarea y asignarlo a la variable 'status'
        if (taskItem.classList.contains('incomplete')) {
            status = 'incomplete'; // Tarea marcada como 'Incompleta'
        } else if (taskItem.classList.contains('in-progress')) {
            status = 'in-progress'; // Tarea marcada como 'En curso'
        } else if (taskItem.classList.contains('completed')) {
            status = 'completed'; // Tarea marcada como 'Completada'
        }
        
        tasks.push({ text, dueDate, status }); // Agregar la tarea con su texto, fecha límite y estado al array de tareas
    });

    localStorage.setItem('tasks', JSON.stringify(tasks)); // Guardar las tareas actualizadas en localStorage como JSON
}
