<template>
    <div class="admin-dashboard">
        <h2>Annonces signalées</h2>
        <div class="reported-annonces" v-if="reportedAnnonces.length">
            <div v-for="annonce in reportedAnnonces" :key="annonce.id" class="reported-annonce">
                <h3>{{ annonce.title }}</h3>
                <p>Signalée le: {{ formatDate(annonce.updated_at) }}</p>
                <button @click="viewAnnonce(annonce.id)">Voir l'annonce</button>
                <button @click="removeReport(annonce.id)" class="btn-secondary">Ignorer le signalement</button>
                <button @click="deleteAnnonce(annonce.id)" class="btn-danger">Supprimer l'annonce</button>
            </div>
        </div>
        <p v-else>Aucune annonce signalée pour le moment.</p>
    </div>
</template>

<script>
import axios from 'axios';
import { getAuthToken } from '../services/auth';

export default {
    data() {
        return {
            reportedAnnonces: []
        };
    },
    methods: {
        async fetchReportedAnnonces() {
            try {
                const token = getAuthToken();
                const response = await axios.get('https://api.lecoindls.site/annonces/reported', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.reportedAnnonces = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des annonces signalées:', error);
            }
        },
        viewAnnonce(id) {
            this.$router.push(`/annonce/${id}`);
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
        // Autres méthodes pour gérer les signalements...
    },
    mounted() {
        this.fetchReportedAnnonces();
    }
};
</script>