import API_BASE_URL from "./config.js";

const loginBtn = document.getElementById('loginBtn')
const userName = document.getElementById('userName')
const password = document.getElementById('password')

loginBtn.addEventListener("click", async() => {
        const data = {
        userName: userName.value,
        password: password.value
    };
    try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/login`,
    
        {
            method: "POST",
            credentials: "include",
            headers: {
        "Content-Type": "application/json"
    },
            body: JSON.stringify(data)
        }
    );
    
    console.log("Status:", response.status);

    const result = await response.json();

    console.log("Response:", result);
//   const result = await response.json();
//   console.log(result);
    if(response.ok){
        userName.value = ""
        password.value = ""

    location.href = "./dashboard"
    }
    } catch (error) {
    console.error(error);
    alert("Please Enter your correct password")
    }      
})

async function checkLoggedIn() {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/users/current-user`,
        {
            credentials: "include"
        }
    );

    if (response.ok) {
        location.href = "./dashboard";
    }
}

checkLoggedIn();