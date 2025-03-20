<template>
    <section class="profil">
        <h1>Mon Profil : </h1>
        <p><strong>Email :</strong> <span id="user-email">{{ user.mail }}</span></p>
        <p><strong>Pseudo :</strong> <span id="user-pseudo">{{ user.identifiant }}</span></p>
        <p><strong>Date d'inscription :</strong> <span id="user-date">{{ user.inscription_date }}</span></p>
        <button @click="deleteAccount" id="supprimer-compte" class="btn-danger">Supprimer mon compte</button>
        <button @click="logout" id="deconnexion" class="btn-secondary">Déconnexion</button>
        <h2>Mes Annonces : </h2>
        <div class="annonces-container">
            <annonce-card v-for="annonce in annonces" :key="annonce.id" :annonce="annonce" />
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { logout } from '../services/auth';
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
            },
            annonces: []
        };
    },
    async created() {
        try {
            console.log('Récupération du profil de l\'utilisateur');
            const response = await axios.get('https://api.lecoindls.site/users/profile', {
                withCredentials: true,
            });
            this.user = response.data;

            // Récupérer les annonces de l'utilisateur connecté
            console.log('Récupération des annonces de l\'utilisateur');
            const annoncesResponse = await axios.get('https://api.lecoindls.site/annonces/user', {
                withCredentials: true,
            });
            this.annonces = annoncesResponse.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
        }
    },
    methods: {
        async deleteAccount() {
            try {
                console.log('Suppression du compte de l\'utilisateur');
                await axios.delete('https://api.lecoindls.site/users/profile', {
                    withCredentials: true,
                });
                alert('Compte supprimé avec succès');
                this.logout();
            } catch (error) {
                console.error('Erreur lors de la suppression du compte:', error);
            }
        },
        logout() {
            console.log('Déconnexion de l\'utilisateur');
            logout();
            this.$router.push('/connexion');
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
    margin-top: 10px;
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