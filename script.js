document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("pseudo")) {
        document.getElementById("pseudo").value = localStorage.getItem("pseudo");
    }
    afficherMessages();
});

function verifierPseudo() {
    let pseudo = document.getElementById("pseudo").value;
    let passwordField = document.getElementById("password");

    if (pseudo === "Administrateur") {
        passwordField.style.display = "block";
    } else {
        passwordField.style.display = "none";
        passwordField.value = ""; // Effacer le champ mot de passe
    }
}

function ajouterMessage() {
    let pseudo = document.getElementById("pseudo").value.trim();
    let password = document.getElementById("password").value;
    let message = document.getElementById("message").value.trim();

    if (pseudo === "" || message === "") {
        alert("Merci de remplir tous les champs !");
        return;
    }

    // Vérification du mot de passe si le pseudo est "Administrateur"
    if (pseudo === "Administrateur" && password !== "Mignon13!") {
        alert("Mot de passe incorrect !");
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

            // Vérification si le pseudo est "Administrateur"
            let pseudoClass = data.pseudo === "Administrateur" ? "admin" : "pseudo";
            div.innerHTML = `<span class="${pseudoClass}">${data.pseudo} :</span> ${data.message}`;
            forum.appendChild(div);
        }
    });
}
