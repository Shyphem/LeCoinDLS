<template>
    <section class="conversations">
        <h2>Mes Conversations :</h2>
        <div id="conversation-list">
            <conv-card v-for="conversation in conversations" :key="conversation.id" :conversation="conversation" />
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import ConvCard from '../components/ConvCard.vue';

export default {
    components: {
        ConvCard
    },
    data() {
        return {
            conversations: []
        };
    },
    async created() {
        try {
            console.log('Récupération des conversations');
            const response = await axios.get('https://api.lecoindls.site/messages/conversations', {
                withCredentials: true
            });
            console.log('Conversations récupérées:', response.data);
            this.conversations = response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
        }
    }
};
</script>

<style scoped>
h2 {
    font-size: 28px;
    margin-bottom: 20px;
    text-align: center;
}

.conversations {
    padding: 20px;
    background-color: #f9f9f9;
    display: flex;
    /* Utilise Flexbox pour aligner */
    flex-direction: column;
    /* Les cartes restent empilées verticalement */
    align-items: center;
    /* Centre les cartes horizontalement */
    justify-content: center;
}

#conversation-list {
    display: flex;
    flex-direction: column;
    /* Les cartes seront en colonne, donc une sous l'autre */
    gap: 20px;
    /* Espacement entre les cartes */
}

/* Responsive pour les écrans de moins de 768px */
@media screen and (max-width: 768px) {
    #conversation-list {
        flex-direction: column;
        /* Colonne par défaut */
        align-items: center;
        /* Centre les cartes */
    }
}
</style>