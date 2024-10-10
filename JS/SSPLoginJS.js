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

 

//const url = 'https://innovaid.dev/api/login';



//document.getElementById('signupForm').addEventListener('submit', async function (e) {
//    e.preventDefault(); //prevent form from submitting the traditional way


//    //Get values from the form
//    const email = document.getElementById('signUpEmail').value;
//    const password = document.getElementById('signUpPassword').value;
//    const usertype = document.getElementById('signup-user-types').value;

//    console.log(usertype);

//});

//document.getElementById('loginForm').addEventListener('submit', async function (e)
//{
//    //When the user clicks the submit button, capture
//    //the form data and send it as a Post request to backend
//    //API using fectch. send user's details as JSON to the server
//    e.preventDefault(); 

//    //get values from the form


   



//}