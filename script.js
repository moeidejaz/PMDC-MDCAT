const error = document.querySelectorAll(".error")
const signUpError = document.getElementById("signUpError")
const loginError = document.getElementById("loginError")

const firebaseConfig = {
    apiKey: "AIzaSyDP6i_6y2Eujy8uFb3hiqTDwDYhTF5Caio",
    authDomain: "pmdc-258e3.firebaseapp.com",
    databaseURL: "https://pmdc-258e3-default-rtdb.firebaseio.com",
    projectId: "pmdc-258e3",
    storageBucket: "pmdc-258e3.appspot.com",
    messagingSenderId: "954900129766",
    appId: "1:954900129766:web:89cbd9e1ffb9d384dd1827"
};


firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const database = firebase.database()

const currentUrl = window.location.href;

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (currentUrl.endsWith("index.html") || currentUrl.endsWith("app/")) {
            login()
        } else {
            register()
        }
    }

})

function register() {

    fullName = document.getElementById("fullName").value
    email = document.getElementById("email").value
    password = document.getElementById("password").value
    const signupBtn = document.getElementById("signup")

    validator()

    // signupBtn.style.width = "170px"
    signupBtn.style.filter = "brightness(90%)"
    signupBtn.innerText = "Signing up..."

    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            let user = auth.currentUser
            // alert("User Created!!")

            // Add this user to firebase database
            let database_ref = database.ref()
            // Create user data
            let user_data = {
                fullName: fullName,
                email: email,
                img: "",
                last_login: Date.now()
            }

            database_ref.child('users/' + user.uid).set(user_data)

            // alert("user created!")

            setTimeout(() => {
                document.getElementById("alert").style.display = "flex"
            }, 100);

            setTimeout(() => {
                userInitials(fullName)
            }, 1500);

        })
        .catch(function (error) {
            let error_code = error.code
            let error_message = error.message
            // alert(error_message)
            signUpError.innerHTML = `${error_message}`
            signupBtn.style.filter = "brightness(100%)"
            signupBtn.innerText = "Sign up"
        })
}

function login() {
    // Get all our input fields


    const loginBtn = document.getElementById("login")
    email = document.getElementById('email').value
    password = document.getElementById('password').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        // alert('Please Enter valid Email/Password')
    }

    loginBtn.style.filter = "brightness(90%)"
    loginBtn.innerText = "Signing in..."

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            let user = auth.currentUser

            // Add this user to Firebase Database
            let database_ref = database.ref()

            // Create User data
            let user_data = {
                last_login: Date.now()
            }

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).update(user_data)
            setTimeout(() => {
                redirectToAccountPage()
            }, 500);
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message

            // alert(error_message)
            loginError.innerHTML = `${error_message}`
            loginBtn.style.filter = "brightness(100%)"
            loginBtn.innerText = "Sign in"
        })
}

function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "/index.html";
        })
        .catch((error) => {
            alert("Error logging out:", error);
        });
}

function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/

    if (expression.test(email)) {
        return true
    } else {
        return false
    }
}

const validate_password = (password) => {

    if (password < 6) {

        return false
    } else {

        return true
    }
}

function validate_field(field) {

    if (field === null) {
        return false
    } else if (field.length <= 0) {
        return false
    } else {
        return true
    }
}


function validator() {
    if (validate_email(email) === false || validate_password(password) === false) {
        // alert("Please enter correct email/password")
        error.forEach(item => {
            item.innerHTML = `Please Enter valid Email/Password`
        })
    }

    if (validate_field(fullName) === false) {
        // alert("Please Enter your name!!")
        error.forEach(item => {
            item.innerHTML = `Please Enter your name!!`
        })
    }
}


function redirectToAccountPage() {
    window.location.href = `account.html`
}

function redirectToLoginPage() {
    window.location.href = `index.html`
}

function userInitials(fullName) {

    let user = auth.currentUser
    let database_ref = database.ref()

    let result = fullName.slice(0, 1);

    fetch(`https://ui-avatars.com/api/name=${result}&background=AB47BC&color=FFFFFF&rounded=true&bold=true&length=1&size=100`)
        .then(response => {
            let user_data = {
                img: response.url
            }

            database_ref.child('users/' + user.uid).update(user_data)
        })

    setTimeout(() => {
        (window.location.href = '/success.html')
    }, 1000);
}