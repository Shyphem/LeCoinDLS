<template>
    <div class="loginBox">
        <!-- Zone de connexion -->
        <div class="container">
            <div class="project-name">
                <h1>Le Coin DLS</h1>
            </div>
            <h2>Connexion</h2>
            <form @submit.prevent="login">
                <label for="login-email">Adresse email</label>
                <input type="email" id="login-email" v-model="email" placeholder="xxx.x@lyceedelasalle.fr" required>

                <label for="login-password">Mot de passe</label>
                <input type="password" id="login-password" v-model="password" placeholder="Votre mot de passe" required>

                <button type="submit">Se connecter</button>
            </form>
            <div v-if="error" style="color: red;" class="error-message">{{ error }}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            error: '',
        };
    },
    methods: {
        async login() {
            console.log('Tentative de connexion avec:', this.email);
            try {
                const response = await axios.post('https://api.lecoindls.site/auth/login', {
                    mail: this.email,
                    password: this.password,
                }, { withCredentials: true });
                console.log('Connexion réussie, redirection vers la page d\'accueil');
                this.$router.push('/');
            } catch (error) {
                if (error.response) {
                    // La requête a été faite et le serveur a répondu avec un statut différent de 2xx
                    console.log('Erreur de réponse:', error.response.data.message);
                    this.error = error.response.data.message;
                } else if (error.request) {
                    // La requête a été faite mais aucune réponse n'a été reçue
                    console.log('Erreur de requête:', error.request);
                    this.error = 'Erreur de connexion au serveur. Veuillez réessayer plus tard.';
                } else {
                    // Quelque chose s'est passé lors de la configuration de la requête qui a déclenché une erreur
                    console.log('Erreur:', error.message);
                    this.error = 'Une erreur est survenue. Veuillez réessayer.';
                }
            }
        },
    },
};
</script>

<style scoped>
/* Style général pour la page de connexion */
.loginBox {
    font-family: 'Poppins', sans-serif;
    background-color: #0056b3;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 400px;
}

h1 {
    text-align: center;
    color: #007bff;
    margin-bottom: 20px;
    font-size: 35px;
}

.project-name {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

input {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

.signup-link {
    text-align: center;
    margin-top: 10px;
}

.signup-link a {
    color: #007bff;
    text-decoration: none;
}

.signup-link a:hover {
    text-decoration: underline;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9f9f9;
}

.login-box {
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    text-align: center;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #333;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

button {
    background-color: #0056b3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #004494;
}

p {
    margin-top: 20px;
}

a {
    color: #0056b3;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>