const signupButton = document.querySelector('.signup');
const loginButton = document.querySelector('.login');
const slider = document.querySelector('.slider');
const formSection = document.querySelector('.form-section');

// Function to update slider position
function updateSliderPosition(targetButton) {
    slider.style.width = `${targetButton.offsetWidth}px`; 
    slider.style.left = `${targetButton.offsetLeft}px`; 
}

// Event listener for Signup button
signupButton.addEventListener('click', () => {
    updateSliderPosition(signupButton);
    formSection.classList.add("form-section-move");
});
// Event listener for Login button
loginButton.addEventListener('click', () => {
    updateSliderPosition(loginButton);
    formSection.classList.remove("form-section-move");
});
// Initial setup - set the slider position to the login button by default
updateSliderPosition(loginButton);
 



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
        user_type: usertype

    };

    // Use Axios to make the API request

    axios.post('https://innovaid.dev/api/user/register', signUpData)
        .then(function (response) {
            // Handle successful signup
            console.log('Sign Up successful', response.data);
            displayMessage('Sign Up successful');
            window.location.href = '../HTML/SSPVerifyAccountPage.html';
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

            const role = response.data.role; 

            localStorage.setItem('role', role); //save role to local storage

            // Check if the token is successfully stored
            if (localStorage.getItem('token')) {
                console.log('Token stored successfully:', localStorage.getItem('token'));
            }
            else {
                console.log('Token not stored');
            }

            // Check if the role is successfully stored
            if (localStorage.getItem('role')) {
                console.log('Role stored successfully:', localStorage.getItem('role'));
            }
            else {
                console.log('Role not stored');
            }


            window.location.href = "../HTML/SSPLandingpage.html"; //Redirect to the landing page


            displayMessage('Login successful');
             
        })
        .catch(function (error) {

            //handle login error
            console.error('Error Logging in:', error.response ? error.response.data : error.message);
            displayMessage('Login unsuccessful', false);
        });


});

