const imgInput = document.getElementById('img');
const saveButton = document.querySelector('.save');

const grid = document.querySelector('.grid')
const cardTemplate = document.getElementById('card-template')
// for (let i = 0; i < 10; i++) {
grid.append(cardTemplate.content.cloneNode(true))
// }


// setTimeout(() => {
//     document.querySelector(".loading_svg").classList.add("hide")
//     document.querySelector(".accountPage").classList.remove("hide")
// }, 500);


// // Fetching data of current user from firebase RDB
function fetchData() {
    let user = auth.currentUser

    if (user && user.uid) {
        const userRef = database.ref('users').child(user.uid);
        userRef.once('value').then((snapshot) => {
        const userData = snapshot.val();
        // console.log(userData)

        let utcSeconds = userData.last_login;
        let dateTime = new Date(utcSeconds);

        document.querySelector(".grid").innerHTML = ''
        document.querySelector(".user_img").src = userData.img
        document.querySelector(".user_profile").src = userData.img
        document.getElementById("user_name").innerHTML = `<span>Name: </span> ${userData.fullName}`
        document.getElementById("user_email").innerHTML = `<span>Email: </span> ${userData.email}`
        document.getElementById("user_login").innerHTML = `<span>Last Login:  </span> ${dateTime}`
    })
            .catch((error) => {
                // location.reload()
                console.error(error);

            });
    } else {
        firebase.auth().signOut()
            .then(() => {
                window.location.href = "/index.html";
            })
            .catch((error) => {
                alert("Error logging out:", error);
            });
    }

}

setTimeout(() => {
    fetchData()
}, 1200);

saveButton.addEventListener('click', () => {
    // Get the selected image file
    const file = imgInput.files[0];

    if (file) {
        // Create a reference to the Firebase Storage bucket
        const storageRef = firebase.storage().ref();
        uploading()
        // Create a child reference with a unique name (e.g., timestamp + file name)
        const fileRef = storageRef.child(`${Date.now()}_${file.name}`);

        // Upload the file to Firebase Storage
        fileRef.put(file).then((snapshot) => {
            console.log('File uploaded successfully!');

            // Get the download URL of the uploaded file
            snapshot.ref.getDownloadURL().then((downloadURL) => {

                let user = auth.currentUser
                let database_ref = database.ref()

                let user_data = {
                    img: downloadURL
                }

                database_ref.child('users/' + user.uid).update(user_data)

                uploaded()

            }).catch((error) => {
                console.error('Error getting download URL:', error);
            });
        }).catch((error) => {
            console.error('Error uploading file:', error);
        });
    }
});

const uploadTag = document.querySelector(".upload_notice")
const loadingDots = document.querySelector(".loading_dots")

function uploading() {
    loadingDots.classList.remove("hide")
}

function uploaded() {

    loadingDots.classList.add("hide")
    uploadTag.classList.remove("hide")

    setTimeout(() => {
        uploadTag.classList.add("hide")
        location.reload()
    }, 1200);


}

const userImage = document.querySelector(".user_img")

userImage.addEventListener("click", () => {

    const dropDown = userImage.nextElementSibling.classList
    dropDown.toggle("hide")

})

