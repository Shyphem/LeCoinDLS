<template>
    <section class="creer-annonce">
        <div class="container">
            <h2>Créer une annonce</h2>
            <form @submit.prevent="submitAnnonce">
                <div class="form-group">
                    <label for="titre">Titre de l'annonce :</label>
                    <input type="text" id="titre" v-model="titre" placeholder="Ex: Manuel de Mathématiques" required>
                </div>

                <div class="form-group">
                    <label for="categorie">Catégorie :</label>
                    <select id="categorie" v-model="categorie" required>
                        <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">
                            {{ categorie.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="etat">État :</label>
                    <select id="etat" v-model="etat" required>
                        <option v-for="etat in etats" :key="etat" :value="etat">
                            {{ etat }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="prix">Prix (en €) :</label>
                    <input type="number" id="prix" v-model="prix" placeholder="Ex: 20" required>
                </div>

                <div class="form-group">
                    <label for="description">Description :</label>
                    <textarea id="description" v-model="description" rows="4" placeholder="Décrivez l'article..."
                        required></textarea>
                </div>

                <div class="form-group">
                    <label for="image" class="custom-file-upload">
                        <i class="fa fa-cloud-upload-alt"></i> Ajouter des images
                    </label>
                    <input type="file" id="image" @change="handleImageUpload" accept="image/*" multiple>
                    <span id="file-count" style="margin-left: 10px; font-size: 14px; color: #555;">Aucun fichier
                        sélectionné</span>
                    <div id="image-preview-container" style="display: flex; gap: 10px; margin-top: 10px;">
                        <img v-for="image in imagePreviews" :src="image" :key="image"
                            style="max-width: 100px; max-height: 100px; border-radius: 8px;">
                    </div>
                </div>

                <button type="submit" class="btn">Poster l'annonce</button>
            </form>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { getAuthToken } from '../services/auth';

export default {
    data() {
        return {
            titre: '',
            categorie: '',
            etat: '',
            prix: '',
            description: '',
            images: [],
            imagePreviews: [],
            categories: [],
            etats: [] // États possibles du produit
        };
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('https://api.lecoindls.site/annonces/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
            }
        },
        async fetchEtats() {
            try {
                const response = await axios.get('https://api.lecoindls.site/annonces/etats');
                this.etats = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des états:', error);
            }
        },
        handleImageUpload(event) {
            const files = event.target.files;
            this.images = [];
            this.imagePreviews = [];

            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(files[i]);
                this.images.push(files[i]);
            }
        },
        async submitAnnonce() {
            const formData = new FormData();
            formData.append('title', this.titre);
            formData.append('categorie_id', this.categorie);
            formData.append('etat', this.etat); // Assurez-vous que l'état est bien ajouté
            formData.append('prix', this.prix);
            formData.append('description', this.description.replace(/\n/g, '<br>')); // Convertir les sauts de ligne en <br>

            for (let i = 0; i < this.images.length; i++) {
                formData.append('images', this.images[i]);
            }

            try {
                const token = getAuthToken();
                const response = await axios.post('https://api.lecoindls.site/annonces', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                console.log('Annonce créée avec succès:', response.data);
                this.$router.push(`/annonce/${response.data.id}`);
            } catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message === 'Votre annonce contient des insultes') {
                    alert('Votre annonce contient des insultes. Veuillez les retirer avant de soumettre.');
                } else {
                    console.error('Erreur lors de la création de l\'annonce:', error);
                }
            }
        }
    },
    mounted() {
        this.fetchCategories();
        this.fetchEtats(); // Récupérez les états possibles lors du montage du composant
    }
};
</script>

<style scoped>
/* Styles pour la page de création d'annonce */
.creer-annonce {
    padding: 60px 20px;
    background-color: #f4f4f4;
    text-align: center;
}

.creer-annonce .container {
    background-color: white;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.creer-annonce h2 {
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
    color: #2980B9;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #2980B9;
    border-radius: 5px;
    box-sizing: border-box;
}

.custom-file-upload {
    color: white;
    display: inline-block;
    padding: 10px 20px;
    cursor: pointer;
    background-color: #2980B9;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.custom-file-upload:hover {
    background-color: #1e6391;
    color: white;
}

input[type="file"] {
    display: none;
}

textarea {
    resize: vertical;
}

.btn {
    display: inline-block;
    padding: 12px 30px;
    background-color: #2980B9;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.6s;
}

.btn:hover {
    background-color: #1e6391;
}
</style>