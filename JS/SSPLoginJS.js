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

 



const message = document.getElementById('message');

// Helper function to display messages
function displayMessage(msg, isSuccess = true) {
    message.innerHTML = msg;
    message.className = isSuccess ? 'success' : 'error';
    message.style.display = 'block';
}


// Event listener for form submission (register)
document.getElementById('signupForm').addEventListener('submit',function (e) {
    e.preventDefault(); //prevent form from submitting the traditional way


    //Get values from the form
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const usertype = document.getElementById('signup-user-types').value;
    
    
    //Create a signup payload
    const signUpData = {
        email: email,
        password: password,
        usertype: usertype

    };

    // Use Axios to make the API request

    axios.post('https://innovaid.dev/api/user/register', signUpData)
        .then(function (response) {
            // Handle successful signup
            console.log('Sign Up successful', response.data);
            displayMessage('Sign Up successful');
        })
        .catch(function (error) {
            //handle signup error
            console.error('Error Signing Up:', error.response ? error.response.data : error.message);
            displayMessage('Sign Up unsuccessful', false);
        });
});

    
//When the user clicks the submit button, capture
//the form data and send it as a Post request to backend
// Event listener for form submission (login)
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    // Get values from the form
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('LoginPassword').value;

    //Create a login payload
    const logInData = {
        email: email,
        password:password
    }

    //Use Axios to make the API request
    axios.post('https://innovaid.dev/api/user/login', logInData)

        .then(function (response) {
            //Handle successful login
            console.log('Login successful', response.data);

            // Store the token in localStorage
            const token = response.data.token;  // Assuming the token is in response.data.token?
            localStorage.setItem('token', token);  // Save token to localStorage

            // Check if the token is successfully stored
            if (localStorage.getItem('token')) {
                console.log('Token stored successfully:', localStorage.getItem('token'));
            }
            else {
                console.log('Token not stored');
            }

            displayMessage('Login successful');
             
        })
        .catch(function (error) {

            //handle login error
            console.error('Error Logging in:', error.response ? error.response.data : error.message);
            displayMessage('Login unsuccessful', false);
        });


});

