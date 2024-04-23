document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".to-do-container");
  const listButton = document.querySelector(".list");
  const listsDropdown = document.querySelector(".lists-dropdown");

  let lists = JSON.parse(localStorage.getItem("lists")) || [];

  const testDiv = document.createElement("div");
  testDiv.className = "testDiv";
  document.body.appendChild(testDiv);

  function createToDoList(name) {
    const newListContainer = document.createElement("div");
    newListContainer.classList.add("todo-list-container");

    const newListText = document.createElement("input");
    newListText.classList.add("todo-list-text");
    newListText.type = "text";
    newListText.value = name;
    newListText.setAttribute("value", name);
    newListText.setAttribute("readonly", "readonly");

    const taskInput = document.createElement("div");
    taskInput.classList.add("task-input");

    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";

    inputContainer.innerHTML = `
      <input type="text" placeholder="New task">
    `;

    const listAction = document.createElement("div");
    listAction.classList.add("list-action");
    listAction.innerHTML = `
      <button class="task-adder">Add</button>
      <button class="task-removeAll">Remove all</button>
    `;

    taskInput.appendChild(inputContainer);
    taskInput.appendChild(listAction);
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    newListContainer.appendChild(newListText);
    newListContainer.appendChild(taskInput);
    newListContainer.appendChild(taskContainer);

    container.innerHTML = ""; // Clear existing content
    defaultAddListBtn();

    container.appendChild(newListContainer);

    const input = taskInput.querySelector("input");
    const taskAdder = taskInput.querySelector(".task-adder");
    const removeAll = taskInput.querySelector(".task-removeAll");

    function sortTask() {
      const tasks = Array.from(taskContainer.querySelectorAll(".task"));
      tasks.sort((a, b) => {
        const aIsStarred = a.classList.contains("starred");
        const bIsStarred = b.classList.contains("starred");
        const aIsDone = a.classList.contains("done");
        const bIsDone = b.classList.contains("done");

        // Check if a task is starred
        if (aIsStarred && !bIsStarred) {
          if (aIsDone && !bIsDone) return 1;
          else return -1; // Move a to the top
        } else if (!aIsStarred && bIsStarred) {
          if (bIsDone && !aIsDone) return -1;
          else return 1; // Move b to the top
        }

        // If both tasks are starred or both are not starred,
        // check if they are done
        if (aIsDone && !bIsDone) {
          return 1; // Move a to the bottom
        } else if (!aIsDone && bIsDone) {
          return -1; // Move b to the bottom
        }

        return 0;
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
        content.setAttribute("value", content.value);
        content.setAttribute("readonly", "readonly");

        const actionContainer = document.createElement("div");
        actionContainer.className = "action-container";

        const doneBtn = document.createElement("button");
        doneBtn.className = "status";

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove";
        removeBtn.innerHTML = "&times";

        const starBtn = document.createElement("button");
        starBtn.className = "priority";
        starBtn.innerHTML = "&#x2605;";

        actionContainer.appendChild(doneBtn);
        actionContainer.appendChild(removeBtn);
        actionContainer.appendChild(starBtn);

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
        currentTask.classList.toggle("done");
        if (currentTask.classList.contains("done")) {
          statusBtn.style.border = "3px solid rgb(238, 238, 238)";
          statusBtn.style.backgroundColor = "#1f2937";
        } else {
          statusBtn.style.border = "0";
          statusBtn.style.backgroundColor = "rgb(238, 238, 238)";
        }
        // Reorder tasks based on the presence of the "done" class
        sortTask();
        saveTasks(name, taskContainer);
      } else if (e.target.classList.contains("remove")) {
        e.target.parentNode.parentNode.remove();
        // Remove task from local storage
        saveTasks(name, taskContainer);
      } else if (e.target.classList.contains("task-content")) {
        const content = e.target;
        content.removeAttribute("readonly");
        content.focus();
        const changeTaskContent = () => {
          content.setAttribute("value", content.value);
          content.setAttribute("readonly", "readonly");
        };
        content.addEventListener("keyup", (e) => {
          if (e.key == "Enter") {
            changeTaskContent();
          }
          saveTasks(name, taskContainer);
        });

        document.addEventListener("click", (ev) => {
          if (ev.target != e.target) {
            changeTaskContent();
          }
          saveTasks(name, taskContainer);
        });

        saveTasks(name, taskContainer);
      } else if (e.target.classList.contains("priority")) {
        const starBtn = e.target;
        const currentTask = starBtn.closest(".task");
        currentTask.classList.toggle("starred");
        if (currentTask.classList.contains("starred")) {
          starBtn.style.color = "rgb(235, 239, 14)";
        } else {
          starBtn.style.color = "rgb(238, 238, 238)";
        }
        sortTask();
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

  function saveLists() {
    localStorage.setItem("lists", JSON.stringify(lists));
  }

  const addListButton = document.querySelector(".addList");

  function defaultAddListBtn() {
    // set default properites of addList button after task created
    addListButton.style.position = "fixed";
    addListButton.style.removeProperty("top");
    addListButton.style.removeProperty("left");
    addListButton.style.right = "20px";
    addListButton.style.bottom = "20px";
    addListButton.style.transform = "translate(0, 0)";
    addListButton.style.width = "60px";
    addListButton.style.height = "60px";
    addListButton.innerHTML = "+";
    addListButton.style.fontSize = "2.5rem";
    listButton.style.visibility = "visible";
  }

  function addNewList() {
    var newListName;
    while (true) {
      newListName = prompt(
        "Enter new list name, cannot be the same with existing lists:",
        "New title"
      );
      if (newListName === null) {
        // User clicked cancel, exit the function
        return;
      }
      if (newListName && !lists.includes(newListName)) {
        break; // Valid input, exit the loop
      }
    }
    lists.push(newListName);
    // Create the new to-do list with the provided name
    const taskContainer = document.createElement("div");
    createToDoList(newListName);
    // Save the updated lists array to local storage
    localStorage.setItem("lists", JSON.stringify(lists));

    defaultAddListBtn();
    const input = document.querySelector("input");
    input.focus();
    // Add the new list to the lists array
  }

  addListButton.addEventListener("click", addNewList);

  if (lists.length == 0) {
    addListButton.style.position = "absolute";
    addListButton.style.width = "300px";
    addListButton.style.height = "100px";
    addListButton.style.left = "50%";
    addListButton.style.top = "calc(35vh + 200px)";
    addListButton.style.fontSize = "1.5rem";
    addListButton.style.transform = "translate(-50%, -50%)";

    listButton.style.visibility = "hidden";
  } else {
    defaultAddListBtn();
  }

  // Edit name of list
  window.addEventListener("click", (e) => {
    if (e.target.matches(".todo-list-text")) {
      // find the index of current list in lists array
      // if the new name == lists[i].name that i != the index => don't allow
      // else u good
      var index = 0;
      for (
        index;
        index < lists.length && lists[index] != e.target.value;
        index++
      );
      /* console.log(index);
      console.log(lists[index]); */
      const oldTitle = e.target.value;
      const taskContainer = document.querySelector(".task-container");
      e.target.removeAttribute("readonly");
      e.target.focus();
      const validTitle = (title) => {
        var checkIndex = 0;
        while (checkIndex < lists.length) {
          if (lists[checkIndex] == title) {
            if (checkIndex != index) break;
          }
          checkIndex++;
        }
        return checkIndex == lists.length;
      };
      const savedNewTitle = () => {
        e.target.setAttribute("value", e.target.value);
        e.target.setAttribute("readonly", "readonly");
        for (var i = 0; i < lists.length; i++) {
          if (lists[i] == oldTitle) lists[i] = e.target.value;
        }
        saveTasks(e.target.value, taskContainer);
        removeTasks(oldTitle);
        saveLists();
      };
      e.target.addEventListener("keyup", (ev) => {
        if (ev.key == "Enter") {
          if (e.target.value != "" && validTitle(e.target.value))
            savedNewTitle();
        }
      });
      document.addEventListener("click", (ev) => {
        if (
          ev.target != e.target &&
          e.target.value != "" &&
          validTitle(e.target.value)
        )
          savedNewTitle();
      });
    }
  });
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
      listButton.style.width = "320px";
      setTimeout(() => showListsDropdown(), 200);
    } else {
      setTimeout(() => hideListsDropdown(), 200);
      listButton.style.width = "200px";
    }
  });

  // Close the dropdown if the user clicks outside of it
  window.addEventListener("click", function (event) {
    if (!event.target.matches(".list")) {
      hideListsDropdown();
      listButton.style.width = "200px";
    }
  });
});
