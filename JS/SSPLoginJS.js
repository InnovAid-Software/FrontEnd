const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Toggle active class and form display
loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
});

signupBtn.addEventListener('click', () => {
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Function to update slider position
function updateSliderPosition(targetButton) {
    // Set the width of the slider to the button's width
    slider.style.width = `${targetButton.offsetWidth}px`;
    // Align the slider's left position with the button's offset
    slider.style.left = `${targetButton.offsetLeft}px`;
}

// Event listener for Signup button
signupBtn.addEventListener('click', () => {
    updateSliderPosition(signupBtn);
    formSection.classList.add("form-section-move");
});
// Event listener for Login button
loginBtn.addEventListener('click', () => {
    updateSliderPosition(loginBtn);
    formSection.classList.remove("form-section-move");
});
// Initial setup - set the slider position to the login button by default
window.addEventListener('load', () => updateSliderPosition(loginBtn));

// Update the slider position when resizing the window for responsiveness
window.addEventListener('resize', () => {
    const activeButton = formSection.classList.contains("form-section-move") ? signupBtn : loginBtn;
    updateSliderPosition(activeButton);
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
        user_type: usertype
    };

    // Use Axios to make the API request

    axios.post('https://innovaid.dev/api/user/register', signUpData)
        .then(function (response) {
            // Handle successful signup
            console.log('Sign Up successful', response.data);
            displayMessage('Sign Up successful');
            if (usertype == "Student") {
                window.location.href = '../HTML/SSPVerifyAccountPage.html';
            }
        })
        .catch(function (error) {
            //handle signup error
            console.error('Error Signing Up:', error.response ? error.response.data : error.message);
            // Check if it's a duplicate email error
            if (error.response && error.response.data.message === 'Email already registered') {
                displayMessage('This email is already registered', false);
            } else {
                displayMessage('Sign Up unsuccessful', false);
            }
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

