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



document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault(); //prevent form from submitting the traditional way


    //Get values from the form
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const usertype = document.getElementById('signup-user-types').value;
    const message = document.getElementById('message');
    // Clear previous messages
    message.innerHTML = '';
    message.style.display = 'none';
    try {
        //make the post request
        const response = await fetch('url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                usertype: usertype,
            }),
        });

        const data = await response.json();

        // Show success or error message
        message.innerHTML = data.message;  // Set the message text
        message.style.display = 'block';  // Show the message div

        if (response.ok) {
            message.className = 'success';  // Apply success class
            console.log('Verification URL:', data.verification_url);  // Log verification URL
        } else {
            message.className = 'error';  // Apply error class
        }
    } catch (error) {
        console.error('Error:', error);
        message.innerHTML = 'An error occurred during registration.';  // Set error message
        message.className = 'error';  // Apply error class
        message.style.display = 'block';  // Show the message div
    }
    

    // Display user type in the UI
    //const messageDisplay = document.createElement('p');
    //messageDisplay.innerText = `User Type: ${usertype}`;
    //document.body.appendChild(messageDisplay);  //works tested




});

//document.getElementById('loginForm').addEventListener('submit', async function (e)
//{
//    //When the user clicks the submit button, capture
//    //the form data and send it as a Post request to backend
//    //API using fectch. send user's details as JSON to the server
//    e.preventDefault(); 

//    //get values from the form


   



//}