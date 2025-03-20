<template>
    <div class="details-page">
        <section class="details-annonce">
            <div id="annonce-details" v-if="annonce">
                <div class="image-container" @mouseover="showButtons = true" @mouseleave="showButtons = false">
                    <button v-if="annonce.Images.length > 1" class="nav-button left" @click="changeImage(-1)"
                        :class="{ 'visible': showButtons }">&#10094;</button>
                    <img :src="'data:image/jpeg;base64,' + annonce.Images[currentImageIndex].image_base64"
                        id="current-image" @click="openImageModal" />
                    <button v-if="annonce.Images.length > 1" class="nav-button right" @click="changeImage(1)"
                        :class="{ 'visible': showButtons }">&#10095;</button>
                </div>

                <div class="title-price-container">
                    <h2>{{ annonce.title }}</h2>
                    <p class="date-publication">{{ annonce.creation_date }}</p>
                    <p class="prix">{{ annonce.prix }} €</p>
                </div>
                <div class="info-container">
                    <p><strong>Catégorie :</strong> {{ annonce.Categorie.name }}</p>
                    <p><strong>État :</strong> {{ annonce.etat }}</p>
                </div>
                <div class="description-container">
                    <p><strong>Description :</strong></p>
                    <p v-html="formattedDescription"></p>
                </div>
                <button @click="toggleReport" class="btn-transparent">...</button>
                <div v-if="showReport" class="dropdown-menu">
                    <button @click="reportAnnonce" class="btn-danger">Signaler l'annonce</button>
                    <button v-if="canDeleteAnnonce" @click="deleteAnnonce" class="btn-danger">Supprimer
                        l'annonce</button>
                </div>
            </div>

            <div v-if="showModal" class="modal" @click="closeImageModal">
                <span class="close">&times;</span>
                <img class="modal-content"
                    :src="'data:image/jpeg;base64,' + annonce.Images[currentImageIndex].image_base64" />
            </div>
        </section>

        <div class="user-card" v-if="user">
            <router-link :to="{ name: 'ProfilDetail', params: { id: user.id } }">
                <h3>{{ user.identifiant }}</h3>
            </router-link>
            <p v-if="user.Annonces.length > 1">{{ user.Annonces.length }} annonces postées</p>
            <p>Dernière connexion : {{ user.last_connexion }}</p>
            <button v-if="canSendMessage" @click="sendMessage" class="btn-primary">Envoyer un message</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { getAuthToken } from '../services/auth';

export default {
    data() {
        return {
            annonce: null,
            user: null,
            currentImageIndex: 0,
            showButtons: false,
            showModal: false,
            showReport: false,
            currentUser: null
        };
    },
    computed: {
        formattedDescription() {
            return this.annonce.description.replace(/\n/g, '<br>');
        },
        canDeleteAnnonce() {
            console.log('currentUser:', this.currentUser.id);
            console.log('annonce.user_id:', this.annonce.user_id);
            return this.currentUser && (this.currentUser.id === this.annonce.user_id || this.currentUser.level === 'admin');
        },
        canSendMessage() {
            console.log('currentUser:', this.currentUser.id);
            console.log('annonce.user_id:', this.annonce.user_id);
            if (this.currentUser && (this.currentUser.id === this.annonce.user_id)) {
                if (this.currentUser && (this.currentUser.level === 'admin')) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
            return
        }
    },
    async created() {
        const id = this.$route.params.id;
        try {
            const response = await axios.get(`https://api.lecoindls.site/annonces/${id}`);
            this.annonce = response.data;
            this.fetchUser(this.annonce.user_id);
            this.fetchCurrentUser();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'annonce:', error);
        }
    },
    methods: {
        async fetchUser(userId) {
            try {
                const response = await axios.get(`https://api.lecoindls.site/users/${userId}`);
                this.user = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
            }
        },
        async fetchCurrentUser() {
            try {
                const response = await axios.get('https://api.lecoindls.site/users/profile', {
                    withCredentials: true,
                });
                this.currentUser = response.data;
                console.log('currentUser fetched:', this.currentUser);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'utilisateur connecté:', error);
            }
        },
        changeImage(direction) {
            const totalImages = this.annonce.Images.length;
            this.currentImageIndex = (this.currentImageIndex + direction + totalImages) % totalImages;
        },
        openImageModal() {
            this.showModal = true;
        },
        closeImageModal() {
            this.showModal = false;
        },
        async sendMessage() {
            try {
                const token = getAuthToken();
                const response = await axios.post('https://api.lecoindls.site/messages/conversation', {
                    annonce_id: this.annonce.id,
                    destinataire_id: this.annonce.user_id,
                    content: `Bonjour, je suis intéressé par votre annonce "${this.annonce.title}".`
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                this.$router.push(`/message/${response.data.conversation_id}`);
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
            }
        },
        toggleReport() {
            this.showReport = !this.showReport;
        },
        reportAnnonce() {
            // Confirmer avec l'utilisateur avant de signaler
            if (confirm('Êtes-vous sûr de vouloir signaler cette annonce ?')) {
                const token = getAuthToken();
                axios.post(`https://api.lecoindls.site/annonces/report/${this.annonce.id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                })
                    .then(response => {
                        alert('Annonce signalée avec succès');
                        this.showReport = false;
                    })
                    .catch(error => {
                        console.error('Erreur lors du signalement de l\'annonce:', error);
                        alert('Erreur lors du signalement de l\'annonce');
                    });
            }
        },
        async deleteAnnonce() {
            try {
                const token = getAuthToken();
                await axios.delete(`https://api.lecoindls.site/annonces/${this.annonce.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                this.$router.push('/annonce');
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'annonce:', error);
            }
        }
    }
};
</script>

<style scoped>
.details-page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.details-annonce {
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-width: 800px;
    width: 100%;
    position: relative;
}

#annonce-details {
    width: 100%;
}

#annonce-details img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 10px;
    margin-bottom: 20px;
    cursor: pointer;
}

.title-price-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
}

#annonce-details h2 {
    font-size: 28px;
    margin-bottom: 2px;
    color: #333;
}

.date-publication {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
}

.prix {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}

.info-container {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.info-container p {
    font-size: 16px;
    color: #666;
    margin: 5px 0;
}

.info-container p strong {
    font-size: 16px;
}

.description-container {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.description-container p {
    font-size: 16px;
    color: #666;
    margin: 5px 0;
}

.description-container p strong {
    font-size: 16px;
}

.image-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: 400px;
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: #2980B9;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s ease, opacity 0.3s ease;
    opacity: 0;
}

.nav-button.visible {
    opacity: 1;
}

.nav-button:hover {
    background-color: #1e6391;
}

.nav-button.left {
    left: 10px;
}

.nav-button.right {
    right: 10px;
}

.btn-transparent {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.dropdown-menu {
    position: absolute;
    top: 40px;
    right: 10px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px;
    z-index: 1000;
}

.btn-danger {
    background-color: #ad1328;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-danger:hover {
    background-color: #8b0f20;
}

.user-card {
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-left: 20px;
    text-align: center;
    align-self: flex-start;
}

.user-card h3 {
    font-size: 24px;
    margin-bottom: 10px;
}

.user-card p {
    font-size: 16px;
    margin-bottom: 10px;
    color: #666;
}

.user-card .btn-primary {
    background-color: #2980B9;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}

.user-card .btn-primary:hover {
    background-color: #1e6391;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
}

.close {
    position: absolute;
    top: 20px;
    right: 35px;
    color: white;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
}

@media (max-width: 768px) {
    .details-page {
        flex-direction: column;
        align-items: center;
    }

    .details-annonce {
        width: 100%;
    }

    .btn-danger {
        background-color: #ad1328;
        color: white;
        padding: 10px 20px;
        margin-right: 5px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .user-card {
        order: 1;
        /* Place user-card après annonce-details */
        margin-top: 20px;
        width: 100%;
        /* Assure un affichage optimisé sur mobile */
        max-width: 800px;
        margin-left: -20px;
    }

    #annonce-details {
        order: 0;
        /* Place annonce-details en haut */
    }
}
</style>