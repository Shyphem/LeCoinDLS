<template>
    <section class="banner">
        <div class="banner-content">
            <h1>Bienvenue sur Le Coin DLS</h1>
            <p>Achetez et vendez vos manuels et fournitures scolaires facilement.</p>
            <form id="search-form" @submit.prevent="rechercherAnnonces">
                <input type="text" id="search-bar" v-model="query" placeholder="Rechercher une annonce...">
                <button type="submit">Rechercher</button>
            </form>
        </div>
    </section>

    <section class="latest-annonces">
        <h2>Dernières annonces</h2>
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
            annonces: [],
            query: ''
        };
    },
    methods: {
        async fetchLatestAnnonces() {
            try {
                const response = await axios.get('https://api.lecoindls.site/annonces/latest');
                this.annonces = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des dernières annonces:', error);
            }
        },
        rechercherAnnonces() {
            this.$router.push({ name: 'Annonce', query: { query: this.query } });
        }
    },
    mounted() {
        this.fetchLatestAnnonces();
    }
};
</script>

<style scoped>
/* Styles pour la page d'accueil */
.banner {
    background-color: #2980B9;
    color: white;
    text-align: center;
    padding: 50px 20px;
}

.banner h1 {
    font-size: 36px;
    margin-bottom: 20px;
}

.banner p {
    font-size: 18px;
    margin-bottom: 35px;
}

/* Style du conteneur du formulaire de recherche */
#search-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto;
    padding: 10px;
    max-width: 600px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Style du champ de recherche */
#search-bar {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

#search-bar:focus {
    border-color: #0056b3;
    outline: none;
}

/* Style du bouton de recherche */
button[type="submit"] {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #2980B9;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    margin-left: 10px;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #1e6391;
}

.latest-annonces {
    padding: 20px;
    text-align: center;
}

.latest-annonces h2 {
    font-size: 28px;
    margin-bottom: 20px;
}

.annonces-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

/* Responsive pour téléphones */
@media (max-width: 480px) {
    .hero {
        padding: 20px 5px;
    }

    .hero h1 {
        font-size: 24px;
    }

    .hero p {
        font-size: 14px;
    }

    #search-form {
        max-width: 300px;
        padding: 5px;
    }

    #search-bar {
        font-size: 12px;
    }

    button[type="submit"] {
        font-size: 12px;
        padding: 8px 16px;
    }
}
</style>