const success = document.getElementById("success")
const svg = document.getElementById("loading-svg")

const confirmation = () => {

    setTimeout(() => {
        success.classList.remove("hide")
    }, 2000);

    setTimeout(() => {
        // svg.classList.add("hide")
    }, 1990);
}

confirmation()