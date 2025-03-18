document.addEventListener("DOMContentLoaded", () => {
    afficherMessages();
});

function ajouterMessage() {
    let message = document.getElementById("message").value;
    if (message.trim() !== "") {
        localStorage.setItem(Date.now(), message);
        document.getElementById("message").value = "";
        afficherMessages();
    }
}

function afficherMessages() {
    let forum = document.getElementById("forum");
    forum.innerHTML = "";
    Object.keys(localStorage).sort().forEach(key => {
        let p = document.createElement("p");
        p.textContent = localStorage.getItem(key);
        forum.appendChild(p);
    });
}

