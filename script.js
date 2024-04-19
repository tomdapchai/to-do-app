document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".to-do-container");
  const listButton = document.querySelector(".list");
  const listsDropdown = document.querySelector(".lists-dropdown");

  function createToDoList(name) {
    const newListContainer = document.createElement("div");
    newListContainer.classList.add("todo-list-container");

    const newListText = document.createElement("h2");
    newListText.classList.add("todo-list-text");
    newListText.textContent = name;

    const taskInput = document.createElement("div");
    taskInput.classList.add("task-input");
    taskInput.innerHTML = `
      <input type="text" placeholder="Add a new task">
      <button class="task-adder">+</button>
      <button class="task-removeAll">Remove all</button>
    `;

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    newListContainer.appendChild(newListText);
    newListContainer.appendChild(taskInput);
    newListContainer.appendChild(taskContainer);

    container.innerHTML = ""; // Clear existing content
    container.appendChild(newListContainer);

    const input = taskInput.querySelector("input");
    const taskAdder = taskInput.querySelector(".task-adder");
    const removeAll = taskInput.querySelector(".task-removeAll");

    taskAdder.addEventListener("click", () => {
      if (input.value != "") {
        const task = document.createElement("div");
        task.className = "task";

        const content = document.createElement("div");
        content.className = "task-content";
        content.innerText = input.value;

        const actionContainer = document.createElement("div");
        actionContainer.className = "action-container";

        const doneBtn = document.createElement("button");
        doneBtn.className = "status";
        doneBtn.innerHTML = "Done";

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove";
        removeBtn.innerHTML = "&times";

        actionContainer.appendChild(doneBtn);
        actionContainer.appendChild(removeBtn);

        task.appendChild(content);
        task.appendChild(actionContainer);

        taskContainer.appendChild(task);

        // Save task to local storage
        saveTasks(name, taskContainer);

        input.value = "";
      }
      input.focus();
    });

    removeAll.addEventListener("click", () => {
      taskContainer.innerHTML = "";
      // Remove tasks from local storage
      removeTasks(name);
      input.focus();
    });

    // Event delegation for mark as done and remove task
    taskContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("status")) {
        const statusBtn = e.target;
        if (statusBtn.innerText === "Done") {
          statusBtn.innerText = "Undo";
          statusBtn.style.backgroundColor = "green";
        } else {
          statusBtn.innerText = "Done";
          statusBtn.style.backgroundColor = "rgb(144, 144, 232)";
        }
        // Update task status in local storage
        saveTasks(name, taskContainer);
      } else if (e.target.classList.contains("remove")) {
        e.target.parentNode.parentNode.remove();
        // Remove task from local storage
        saveTasks(name, taskContainer);
      }
    });

    // Load tasks from local storage when the page loads
    loadTasks(name, taskContainer);
  }

  // Function to save tasks to local storage
  function saveTasks(listName, taskContainer) {
    localStorage.setItem(listName, taskContainer.innerHTML);
  }

  // Function to remove tasks from local storage
  function removeTasks(listName) {
    localStorage.removeItem(listName);
  }

  // Function to load tasks from local storage
  function loadTasks(listName, taskContainer) {
    const savedTasks = localStorage.getItem(listName);
    if (savedTasks) {
      taskContainer.innerHTML = savedTasks;
    }
  }

  function addNewList() {
    const newListName = prompt("Enter the name for your new list:");
    if (newListName) {
      // Add the new list to the lists array
      lists.push(newListName);
      // Create the new to-do list with the provided name
      const taskContainer = document.createElement("div");
      createToDoList(newListName);
      // Save the updated lists array to local storage
      localStorage.setItem("lists", JSON.stringify(lists));
    }
  }

  // Sample lists (You can replace this with dynamic data)
  let lists = JSON.parse(localStorage.getItem("lists")) || [
    "Work",
    "Personal",
    "Shopping",
  ];

  // Load tasks for each list when the page loads
  lists.forEach((list) => {
    const taskContainer = document.createElement("div");
    createToDoList(list);
    loadTasks(list, taskContainer);
  });

  // Create button to add new list
  const addListButton = document.createElement("button");
  addListButton.className = "addList";
  addListButton.textContent = "Add New List";
  addListButton.addEventListener("click", addNewList);
  document.body.appendChild(addListButton);

  function deleteList(listName) {
    const confirmDelete = confirm(
      `Are you sure you want to delete the list "${listName}"?`
    );
    if (confirmDelete) {
      // Remove the list from the lists array
      lists = lists.filter((list) => list !== listName);
      // Remove the list from local storage
      localStorage.setItem("lists", JSON.stringify(lists));
      // Reload the page to reflect the changes
      location.reload();
    }
  }
  // Function to display the lists dropdown
  function showListsDropdown() {
    listsDropdown.innerHTML = ""; // Clear existing content
    lists.forEach((list) => {
      const listElement = document.createElement("div");
      listElement.className = "list-element";
      listElement.textContent = list;
      listElement.addEventListener("click", () => {
        createToDoList(list);
        hideListsDropdown();
      });
      const deleteListBtn = document.createElement("button");
      deleteListBtn.innerText = "Delete";
      deleteListBtn.className = "delete-list";

      deleteListBtn.addEventListener("click", () => deleteList(list));
      listElement.appendChild(deleteListBtn);
      listsDropdown.appendChild(listElement);
    });
    listsDropdown.style.display = "block";
  }

  // Function to hide the lists dropdown
  function hideListsDropdown() {
    listsDropdown.style.display = "none";
  }

  // Event listener for list button click
  listButton.addEventListener("click", () => {
    if (
      listsDropdown.style.display === "none" ||
      listsDropdown.style.display === ""
    ) {
      showListsDropdown();
    } else {
      hideListsDropdown();
    }
  });

  // Close the dropdown if the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (!event.target.matches(".list")) {
      hideListsDropdown();
    }
  });
});
