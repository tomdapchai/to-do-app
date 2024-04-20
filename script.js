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
      <input type="text" placeholder="New task">
    `;

    const listAction = document.createElement("div");
    listAction.classList.add("list-action");
    listAction.innerHTML = `
      <button class="task-adder">Add</button>
      <button class="task-removeAll">Remove all</button>
    `;

    taskInput.appendChild(listAction);
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

    function sortTask() {
      const tasks = Array.from(taskContainer.querySelectorAll(".task"));
      tasks.sort((a, b) => {
        const aIsDone = a.classList.contains("done");
        const bIsDone = b.classList.contains("done");
        if (aIsDone && !bIsDone) {
          return 1; // Move a to the bottom
        } else if (!aIsDone && bIsDone) {
          return -1; // Move b to the bottom
        }
        return 0; // Preserve order for other cases
      });

      // Append the sorted tasks back to the container
      tasks.forEach((task) => taskContainer.appendChild(task));
    }

    function addTask() {
      if (input.value.trim() !== "") {
        const task = document.createElement("div");
        task.className = "task";

        const content = document.createElement("input");
        content.className = "task-content";
        content.type = "text";
        content.value = input.value.trim();
        content.setAttribute("value", `${content.value}`);
        content.setAttribute("readonly", "readonly");

        const actionContainer = document.createElement("div");
        actionContainer.className = "action-container";

        const doneBtn = document.createElement("button");
        doneBtn.className = "status";
        doneBtn.innerHTML = "Done";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-task";
        editBtn.innerHTML = "Edit";

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove";
        removeBtn.innerHTML = "Remove";

        actionContainer.appendChild(doneBtn);
        actionContainer.appendChild(removeBtn);
        actionContainer.appendChild(editBtn);

        task.appendChild(content);
        task.appendChild(actionContainer);

        taskContainer.appendChild(task);

        // Save task to local storage
        saveTasks(name, taskContainer);

        input.value = "";
      }
      sortTask();
      input.focus();
    }

    // Add event listener for "Enter" key press
    input.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        addTask(); // Execute the same code as .task-adder
      }
    });

    // Add event listener for .task-adder button click
    taskAdder.addEventListener("click", addTask);

    removeAll.addEventListener("click", () => {
      const removeConfirm = confirm(
        "Do you want to remove all tasks of this list?"
      );
      if (removeConfirm) {
        taskContainer.innerHTML = "";
        // Remove tasks from local storage
        removeTasks(name);
      }
      input.focus();
    });

    // Event delegation for mark as done and remove task
    taskContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("status")) {
        const statusBtn = e.target;
        const currentTask = e.target.closest(".task");
        const currentContent = currentTask.querySelector(".task-content");
        currentTask.classList.toggle("done");
        if (statusBtn.innerHTML == "Done") {
          currentContent.style.color = "var(--dark)";
          statusBtn.innerHTML = "Undo";
        } else {
          currentContent.style.color = "var(--light)";
          statusBtn.innerHTML = "Done";
        }
        // Reorder tasks based on the presence of the "done" class
        sortTask();
        saveTasks(name, taskContainer);
      } else if (e.target.classList.contains("remove")) {
        e.target.parentNode.parentNode.remove();
        // Remove task from local storage
        saveTasks(name, taskContainer);
      } else if (e.target.classList.contains("edit-task")) {
        const editBtn = e.target;
        const content =
          e.target.parentElement.parentElement.querySelector(".task-content");
        if (editBtn.innerHTML == "Edit") {
          editBtn.innerHTML = "Save";
          content.removeAttribute("readonly");
          content.focus();
          content.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
              content.setAttribute("value", content.value);
              content.setAttribute("readonly", "readonly");
              editBtn.innerHTML = "Edit";
            }
            saveTasks(name, taskContainer);
          });
        } else if (editBtn.innerHTML == "Save") {
          editBtn.innerHTML = "Edit";
          content.setAttribute("value", content.value);
          content.setAttribute("readonly", "readonly");
        }
        saveTasks(name, taskContainer);
      }
    });

    // Load tasks from local storage when the page loads
    loadTasks(name, taskContainer);
    input.focus();
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

  const addListButton = document.querySelector(".addList");

  function defaultAddListBtn() {
    // set default properites of addList button after task created
    addListButton.style.removeProperty("top");
    addListButton.style.removeProperty("left");
    addListButton.style.right = "5px";
    addListButton.style.bottom = "5px";
    addListButton.style.transform = "translate(0, 0)";
    addListButton.style.width = "50px";
    addListButton.style.height = "50px";
    addListButton.innerHTML = "+";
    addListButton.style.fontSize = "2rem";
    listButton.style.visibility = "visible";
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

      defaultAddListBtn();
      const input = document.querySelector("input");
      input.focus();
    }
  }

  addListButton.addEventListener("click", addNewList);

  let lists = JSON.parse(localStorage.getItem("lists")) || [];

  if (lists.length == 0) {
    // Perform task here:
    var createNewList = document.createElement("div");
    createNewList.className = "todo-list-container";
    createNewList.innerHTML =
      "Your list is empty, please create a new one by clicking the button below";
    container.appendChild(createNewList);
    addListButton.style.width = "300px";
    addListButton.style.height = "50px";
    addListButton.style.left = "50%";
    addListButton.style.top = "30%";
    addListButton.style.fontSize = "1rem";
    addListButton.style.transform = "translate(-50%, -60%)";
    listButton.style.visibility = "hidden";
  } else {
    defaultAddListBtn();
  }
  // Load tasks for each list when the page loads
  lists.forEach((list) => {
    const taskContainer = document.createElement("div");
    createToDoList(list);
    loadTasks(list, taskContainer);
  });

  //button to add new list

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
