document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("pseudo")) {
        document.getElementById("pseudo").value = localStorage.getItem("pseudo");
    }
    afficherMessages();
});

function ajouterMessage() {
    let pseudo = document.getElementById("pseudo").value.trim();
    let message = document.getElementById("message").value.trim();

    if (pseudo === "" || message === "") {
        alert("Merci de remplir tous les champs !");
        return;
    }

    localStorage.setItem("pseudo", pseudo); // Sauvegarde du pseudo
    let timestamp = Date.now();
    localStorage.setItem(timestamp, JSON.stringify({ pseudo, message }));

    document.getElementById("message").value = "";
    afficherMessages();
}

function afficherMessages() {
    let forum = document.getElementById("forum");
    forum.innerHTML = "";
    Object.keys(localStorage).sort().forEach(key => {
        if (!isNaN(key)) {
            let data = JSON.parse(localStorage.getItem(key));
            let div = document.createElement("div");
            div.classList.add("message");
            div.innerHTML = `<span class="pseudo">${data.pseudo} :</span> ${data.message}`;
            forum.appendChild(div);
        }
    });
}
