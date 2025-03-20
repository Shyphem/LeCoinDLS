<template>
    <div class="details-page">
        <section class="details-messages">
            <div id="message-details">
                <h2 v-if="annonce.User">
                    Conversation avec {{ annonce.User.identifiant }} pour l'annonce "{{ annonce.title }}"
                </h2>
                <div class="messages" ref="messagesContainer">
                    <div v-for="message in messages" :key="message.id"
                        :class="{ 'message-sent': message.sender_id === userId, 'message-received': message.sender_id !== userId }">
                        <p>{{ message.content }}</p>
                        <span>{{ formatDate(message.created_at) }}</span>
                    </div>
                </div>
                <form @submit.prevent="envoyerMessage">
                    <div id="form-message">
                        <textarea v-model="nouveauMessage" placeholder="Écrire un message..."
                            @keydown="handleKeyDown"></textarea>
                        <button type="submit"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </form>
            </div>
        </section>

        <div class="user-card" v-if="user">
            <router-link :to="{ name: 'ProfilDetail', params: { id: user.id } }">
                <h3>{{ user.identifiant }}</h3>
            </router-link>
            <p v-if="user.Annonces && user.Annonces.length > 1">
                {{ user.Annonces.length }} annonces postées
            </p>
            <p>Dernière connexion : {{ user.last_connexion }}</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import socket from "../services/socket";

export default {
    data() {
        return {
            annonce: {},
            messages: [],
            nouveauMessage: "",
            userId: null,
            user: null,
        };
    },
    async created() {
        const conversationId = this.$route.params.id;

        try {
            // Charger les messages de la conversation
            const response = await axios.get(
                `https://api.lecoindls.site/messages/conversation/${conversationId}`,
                { withCredentials: true }
            );
            this.messages = response.data;

            if (this.messages.length > 0) {
                this.annonce = this.messages[0]?.Conversation?.Annonce || {};
                this.userId = this.messages[0].sender_id;
                await this.fetchUser(this.annonce.user_id);
            }

            // Rejoindre la conversation via WebSocket
            socket.emit("joinConversation", conversationId);

            // Écouter les nouveaux messages
            socket.on("newMessage", (message) => {
                this.messages.push(message);
                this.scrollToBottom();
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    },
    beforeDestroy() {
        // Quitter la conversation lors de la destruction du composant
        const conversationId = this.$route.params.id;
        socket.emit("leaveConversation", conversationId);
        socket.off("newMessage");
    },
    methods: {
        async fetchUser(userId) {
            try {
                const response = await axios.get(`https://api.lecoindls.site/users/${userId}`);
                this.user = response.data;
            } catch (error) {
                console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
            }
        },
        async envoyerMessage() {
            if (this.nouveauMessage.trim() === "") return;

            const message = {
                conversation_id: this.$route.params.id,
                content: this.nouveauMessage,
            };

            // Envoyer le message via le socket
            socket.emit("sendMessage", message, (response) => {
                if (response.status === "ok") {
                    this.nouveauMessage = ""; // Réinitialiser le champ
                    this.scrollToBottom();
                } else {
                    if (response.error === 'Votre message contient des insultes') {
                        alert('Votre message contient des insultes. Veuillez le modifier.');
                        console.error("Erreur lors de l'envoi du message :", response.error);
                    } else {
                        console.error("Erreur lors de l'envoi du message :", response.error);
                    }
                }
            });
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleString();
        },
        handleKeyDown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.envoyerMessage();
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                container.scrollTop = container.scrollHeight;
            });
        }
    },
    watch: {
        messages() {
            this.scrollToBottom();
        }
    },
    mounted() {
        this.scrollToBottom();
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

.details-messages {
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-width: 800px;
    width: 100%;
    position: relative;
}

#message-details {
    width: 100%;
}

.messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
}

.message-sent {
    text-align: right;
    background-color: #e0f7fa;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.message-received {
    text-align: left;
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
}

#form-message {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
}

textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    background-color: #fff;
    margin-right: 10px;
    font-family: 'Poppins', sans-serif;
}

button {
    background-color: #2980B9;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
}

button i {
    margin-right: 3px;
}

button:hover {
    background-color: #1e6391;
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

/* Responsive pour téléphones */
@media (max-width: 768px) {
    .details-page {
        padding: 10px;
    }

    .details-messages {
        padding: 10px;
    }

    .messages {
        max-height: 250px;
    }

    #form-message {
        flex-direction: column;
        /* Passer le formulaire en colonne pour plus d'espace */
        gap: 8px;
        /* Ajouter un espacement entre les éléments */
    }

    textarea {
        margin-right: 0;
        font-size: 14px;
    }

    button {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }

    .user-card {
        display: none;
    }

    .user-card h3 {
        font-size: 16px;
    }

    .user-card p {
        font-size: 14px;
    }
}
</style>