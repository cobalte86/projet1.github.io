let db;

document.addEventListener("DOMContentLoaded", async () => {
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`
    });

    db = new SQL.Database();
    
    // Création des tables
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            message TEXT,
            timestamp TEXT
        );
    `);

    checkLogin();
});

function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}

function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

function signup() {
    let username = document.getElementById("signup-username").value.trim();
    let password = document.getElementById("signup-password").value;

    if (username === "" || password === "") {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    try {
        db.run("INSERT INTO users (username, password) VALUES (?, ?);", [username, password]);
        alert("Compte créé avec succès !");
        showLogin();
    } catch (error) {
        alert("Nom d'utilisateur déjà pris !");
    }
}

function login() {
    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value;

    let results = db.exec("SELECT id FROM users WHERE username = ? AND password = ?", [username, password]);
    
    if (results.length > 0) {
        localStorage.setItem("user", username);
        checkLogin();
    } else {
        alert("Identifiants incorrects !");
    }
}

function logout() {
    localStorage.removeItem("user");
    document.getElementById("forum-section").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

function checkLogin() {
    let user = localStorage.getItem("user");

    if (user) {
        document.getElementById("user-name").textContent = user;
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("forum-section").style.display = "block";
        afficherMessages();
    }
}

function ajouterMessage() {
    let user = localStorage.getItem("user");
    let message = document.getElementById("message").value.trim();

    if (!user || message === "") {
        alert("Vous devez être connecté et écrire un message !");
        return;
    }

    let results = db.exec("SELECT id FROM users WHERE username = ?", [user]);
    let userId = results[0].values[0][0];

    db.run("INSERT INTO messages (user_id, message, timestamp) VALUES (?, ?, datetime('now'))", [userId, message]);

    document.getElementById("message").value = "";
    afficherMessages();
}

function afficherMessages() {
    let forum = document.getElementById("forum");
    forum.innerHTML = "";

    let results = db.exec(`
        SELECT users.username, messages.message, messages.timestamp
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.timestamp ASC;
    `);

    if (results.length > 0) {
        results[0].values.forEach(row => {
            let [username, message, timestamp] = row;
            let pseudoClass = username === "Administrateur" ? "admin" : "pseudo";
            let div = document.createElement("div");
            div.classList.add("message");
            div.innerHTML = `<span class="${pseudoClass}">${username} :</span> ${message} <small>(${timestamp})</small>`;
            forum.appendChild(div);
        });
    }
}
