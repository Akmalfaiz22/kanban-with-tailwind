const addTaskBtn = document.getElementById('addTask')
const inputBox = document.getElementById('inputBox')
const inputRemove = document.getElementById('inputRemove')
const addToDo = document.getElementById('addToDoBtn')
const addProgress = document.getElementById('addProgressBtn')
const addDone = document.getElementById('addDoneBtn')
const darkMode = document.getElementById('darkMode')
const dark = document.getElementById('mode')
const inputText = document.getElementById('inputText')
const inputSelect = document.getElementById('inputSelect')
const inputAddBtn = document.getElementById('inputAddBtn')
const toDoCount = document.getElementById('toDoCount')
const progressCount = document.getElementById('progressCount')
const doneCount = document.getElementById('doneCount')
const toDoList = document.getElementById('toDoList')
const progressList = document.getElementById('progressList')
const doneList = document.getElementById('doneList')
const changePassword = document.getElementById('chg-password')
const logOut = document.getElementById('logout')

let selected = null

function updatecount(){
  toDoCount.textContent = toDoList.children.length
  progressCount.textContent = progressList.children.length
  doneCount.textContent = doneList.children.length
}

addTaskBtn.addEventListener("click", () => {
  inputBox.classList.remove("hidden");
})

addToDo.addEventListener("click", () => {
  inputBox.classList.remove("hidden");
})

addProgress.addEventListener("click", () => {
  inputBox.classList.remove("hidden");
})

addDone.addEventListener("click", () => {
  inputBox.classList.remove("hidden");
})

inputRemove.addEventListener("click", () => {
    inputBox.classList.add("hidden");
})

darkMode.addEventListener("click", () => {
  dark.classList.toggle("dark");

    if (dark.classList.contains("dark")) {
    darkMode.innerHTML = '<i class="ri-sun-line"></i> Light Mode';
  } else {
    darkMode.innerHTML = '<i class="ri-moon-line"></i> Dark Mode';
  }
  
})

progressList.addEventListener("dragover", (e) => {
  e.preventDefault()
})
progressList.addEventListener("drop", ()  => {
    progressList.appendChild(selected)
    selected = null
    updatecount()
})

toDoList.addEventListener("dragover", (e) => {
  e.preventDefault()
})
toDoList.addEventListener("drop", ()  => {
    toDoList.appendChild(selected)
    selected = null
    updatecount()
})

doneList.addEventListener("dragover", (e) => {
  e.preventDefault()
})
doneList.addEventListener("drop", ()  => {
    doneList.appendChild(selected)
    selected = null
    updatecount()
})

inputAddBtn.addEventListener('click', () => {
  if (inputText.value === "") {
    alert('please Enter your Task')
  }
  else{
  const li = document.createElement("li") 
  li.classList.add(
   "bg-[#e7e7e9]", "my-3",  "mx-auto", "p-[4px]", "w-full", "rounded-md",
    "text-lg","dark:bg-[#111318]", "dark:border", "dark:border-[#2a2d35]", 
  ) ;
  li.style.position = "relative";
  li.innerHTML = inputText.value
  li.draggable = true

  const btn = document.createElement("button")
  btn.style.position = "absolute";
  btn.style.right = "12px";        
  btn.style.top = "50%";           
  btn.style.transform = "translateY(-50%)";
  btn.innerHTML = '<i class="ri-close-large-line"></i>'
  
  btn.addEventListener('click', () => {
    li.remove()
    updatecount()
  });

  li.addEventListener('dragstart', (e) => {
        // selected = li
        selected = e.target
  })

    if (inputSelect.value === "toDo") {
      toDoList.appendChild(li)
    }else if (inputSelect.value === "inProgress") {
      progressList.appendChild(li)
    }else if (inputSelect.value === "doneOne") {
       doneList.appendChild(li)
    }
    updatecount()

    li.appendChild(btn)
    inputText.value = ""
  }

})

updatecount()

changePassword.addEventListener('click', () => {
  location.href = "./password.html"
})

logOut.addEventListener("click", async() => {
  try {
    const response = await fetch(
        "http://localhost:4000/api/v1/users/logout",
        {
            method: "POST",
            credentials: "include",
            // headers: {
            //     "Content-Type": "application/json"
            // },
            // body: JSON.stringify(data)
        }
    );

    const result = await response.json();
    console.log(result);
    if(response.ok){
      location.href = "./landing.html"
    }
        
    
  } catch (error) {
    console.error(error);
  }
});

