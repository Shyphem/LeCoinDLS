<template>
    <div class="annonce-card">
        <div class="image-container">
            <img 
                v-if="annonce.Images && annonce.Images.length > 0" 
                :src="'data:image/jpeg;base64,' + annonce.Images[0].image_base64" 
                alt="Image de l'annonce" 
            />
            <p v-else>Pas d'image disponible</p>
        </div>
        <h2>{{ annonce.title || 'Titre non disponible' }}</h2>
        <p><strong>Prix :</strong> {{ annonce.prix || 'Non précisé' }}€</p>
        <button @click="voirAnnonce(annonce.id)">Voir l'annonce</button>
    </div>
</template>


<script>
export default {
    props: {
        annonce: {
            type: Object,
            required: true
        }
    },
    methods: {
        voirAnnonce(id) {
            this.$router.push(`/annonce/${id}`);
        }
    }
};
</script>

<style scoped>
.annonce-card {
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    text-align: center;
    margin: 10px;
    width: 300px;
    /* Fixe la largeur de la carte */
}

.image-container {
    width: 100%;
    height: 200px;
    /* Fixe la hauteur de l'image */
    overflow: hidden;
    border-radius: 10px;
    margin-bottom: 20px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* L'image prend toute la largeur et hauteur de la carte */
}

.annonce-card h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
}

.annonce-card p {
    font-size: 16px;
    margin-bottom: 10px;
    color: #666;
}

.annonce-card button {
    padding: 10px 20px;
    background-color: #2980B9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.annonce-card button:hover {
    background-color: #1e6391;
}
</style>