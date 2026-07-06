const signUpBtn = document.getElementById('signUpBtn')
const usernameInput = document.getElementById("usernameInput");
const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

signUpBtn.addEventListener("click", async() => {
       const data = {
        userName: usernameInput.value,
        fullName: fullNameInput.value,
        email: emailInput.value,
        password: passwordInput.value
};
try {
      const response = await fetch(
        "http://localhost:4000/api/v1/users/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
     );

     const result = await response.json();
     console.log(result);
     if (response.ok){
        usernameInput.value = "";
        fullNameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
 
       location.href = "./index.html"
     }else{
        result.message
     }
} catch (error) {
     console.error(error);
}
    
})