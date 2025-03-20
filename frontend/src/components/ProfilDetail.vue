<template>
    <section class="profil">
        <h1>Profil de l'utilisateur : </h1>
        <p><strong>Email :</strong> <span id="user-email">{{ user.mail }}</span></p>
        <p><strong>Pseudo :</strong> <span id="user-pseudo">{{ user.identifiant }}</span></p>
        <p><strong>Date d'inscription :</strong> <span id="user-date">{{ user.inscription_date }}</span></p>
        <p><strong>Dernière connexion :</strong> <span id="user-date">{{ user.last_connexion }}</span></p>
        <h2>Ses Annonces : </h2>
        <div class="annonces-container">
            <annonce-card v-for="annonce in annonces" :key="annonce.id" :annonce="annonce" />
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import AnnonceCard from '../components/AnnonceCard.vue';

export default {
    components: {
        AnnonceCard
    },
    data() {
        return {
            user: {
                mail: '',
                identifiant: '',
                inscription_date: '',
                last_connexion: ''
            },
            annonces: []
        };
    },
    async created() {
        const userId = this.$route.params.id;
        try {
            const response = await axios.get(`https://api.lecoindls.site/users/${userId}`);
            this.user = response.data;

            // Récupérer les annonces de l'utilisateur par ID
            const annoncesResponse = await axios.get(`https://api.lecoindls.site/annonces/user/${userId}`);
            this.annonces = annoncesResponse.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        }
    }
};
</script>

<style scoped>
/* Styles pour la page de profil */
.profil {
    padding: 50px 0;
    background-color: #f9f9f9;
    text-align: center;
}

.profil-card {
    display: inline-block;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
}

.profil h2,
h3 {
    text-align: center;
}

.profil p {
    font-size: 18px;
    margin: 10px 0;
}

.profil p strong {
    color: #0056b3;
}

.profil span {
    color: #333;
}

.profil button {
    display: inline-block;
    padding: 12px 30px;
    background-color: #ad1328;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.6s;
}

.profil button.btn-secondary {
    background-color: #6c757d;
    margin-left: 10px;
}

.profil button:hover {
    background-color: #0056b3;
}

.annonces-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}
</style>