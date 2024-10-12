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

// Function to register the user
async function registerUser(email, password, usertype) {
    try {
        const response = await fetch('https://innovaid.dev/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, usertype }),
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage(data.message);  // Successful registration
            console.log('Verification will be sent to:', email);
        } else {
            displayMessage(data.message || 'Registration failed', false);
        }
    } catch (error) {
        console.error('Error:', error);
        displayMessage('An error occurred during registration.', false);
    }
}


// Event listener for form submission (register)
document.getElementById('signupForm').addEventListener('submit',function (e) {
    e.preventDefault(); //prevent form from submitting the traditional way


    //Get values from the form
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const usertype = document.getElementById('signup-user-types').value;
    
    
    // Register the user by sending data to the backend
    registerUser(email, password, usertype);


});

//document.getElementById('loginForm').addEventListener('submit', async function (e)//    
//When the user clicks the submit button, capture
//the form data and send it as a Post request to backend
// Event listener for form submission (login)
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form from submitting the traditional way

    // Get values from the form
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Log the user in by sending data to the backend
    loginUser(email, password);
});

// Function to log the user in
async function loginUser(email, password) {
    try {
        const response = await fetch('https://innovaid.dev/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage('Login successful!'); // Show a success message to the user
             // Store the token in localStorage for future use 
            localStorage.setItem('authToken', data.token);
              // Redirect user to a protected page (optional)
            // window.location.href = '/dashboard';
        }
        else{
            displayMessage(data.message || 'Login failed', false); // Show error message if login failed
        }}
        catch (error) {
            console.error('Error:', error);
            displayMessage('An error occurred during login.', false); // Handle network errors
        }
    }
