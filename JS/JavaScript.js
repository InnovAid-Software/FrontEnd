let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});

login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});

 

const url = 'https://innovaid.dev/api/login';



document.getElementById('signupForm').addEventListener('submit', async function(e)
{
    e.preventDefault();

    const email = document.getElementById('signupForm').addEventListener('submit')
    const password =
    
}

document.getElementById('loginForm').addEventListener('submit', async function (e)
{
    //When the user clicks the submit button, capture
    //the form data and send it as a Post request to backend
    //API using fectch. send user's details as JSON to the server
    e.preventDefault(); 

    //get values from the form


    




}