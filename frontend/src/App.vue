<template>
    <div id="app">
        <header v-if="showHeaderFooter">
            <div class="navbar">
                <div class="logo">
                    <img src="./assets/logo.png" width="100px">
                    <h1>Le Coin DLS</h1>
                </div>
                <nav>
                    <ul class="nav-links">
                        <li><i class="fa-solid fa-house"></i><router-link to="/">Accueil</router-link></li>
                        <li><i class="fa-solid fa-rectangle-list"></i><router-link to="/annonce">Annonces</router-link></li>
                        <li><i class="fa-solid fa-circle-plus"></i><router-link to="/annonce/creation">Créer une annonce</router-link></li>
                        <li><i class="fa-solid fa-comments"></i><router-link to="/message">Messages</router-link></li>
                        <li><i class="fa-solid fa-user"></i><router-link to="/profil">Profil</router-link></li>
                    </ul>
                </nav>
                <div class="hamburger" @click="toggleMenu">
                    <i class="fa fa-bars"></i>
                </div>
            </div>
        </header>
        <main>
            <router-view/>
        </main>

        <footer v-if="showHeaderFooter">
            <p>&copy; 2024 Le Coin DLS. Tous droits réservés.</p>
            <ul class="footer-links">
                <li><router-link to="/mentions-legales">Mentions Légales</router-link></li>
                <li><router-link to="/confidentialite">Politique de confidentialité</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
            </ul>
        </footer>
    </div>
</template>

<script>
export default {
    computed: {
        showHeaderFooter() {
            return this.$route.path !== '/connexion';
        }
    },
    methods: {
        toggleMenu() {
            const navLinks = this.$el.querySelector('.nav-links');
            navLinks.classList.toggle('show'); // Ajoute ou enlève la classe "show" au menu
        }
    },
    mounted() {
        // Ajout du code Matomo après le montage de l'application
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
            var u="https://matomo.lecoindls.site/";  // Remplace par l'URL de ton instance Matomo
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '1']);  // Remplace par l'ID de ton site Matomo
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
        })();
    }
}
</script>

<style scoped>
/* Pour assurer que le footer reste en bas */
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
}

/* Style du Header */
header {
    background-color: #2C3E50;
    color: white;
    padding: 1rem 2rem;
}

.logo {
    display: flex;
    align-items: center;
}

.logo img {
    margin-right: 50px;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Styles pour la navigation */
.nav-links {
    display: flex;
    gap: 5px;
}

.nav-links li {
    display: inline;
    padding: 8px 15px;
    border-radius: 4px;
    transition: background-color 0.6s;
}

.nav-links li:hover {
    background-color: #34495E;
}

.nav-links a {
    color: white;
    font-size: 20px;
    font-weight: 600;
    padding: 8px 15px;
    border-radius: 4px;
    transition: background-color 0.6s;
}
  
/* Hamburger Menu */
.hamburger {
    display: none;
    cursor: pointer;
}

.hamburger i {
    font-size: 28px;
    color: white;
}

/* Style du Footer */
footer {
    background-color: #2C3E50;
    color: white;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ddd;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
}

.footer-links a {
    color: white;
    font-size: 14px;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: #2980B9;
}
  
/* Responsive Design */

/* Pour les tablettes et mobiles */
@media (max-width: 768px) {
    .logo img{
        display: none; 
    }
    .nav-links {
        display: none;
        flex-direction: column;
        width: 100%;
        background-color: #2C3E50;
        position: absolute;
        top: 60px; /* Ajuster selon la hauteur de la navbar */
        left: 0;
        padding: 0;
        z-index: 1000;
    }

    .nav-links li {
        text-align: center;
        padding: 15px 0;
        border-bottom: 1px solid #34495E;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .hamburger {
        display: block;
    }

    .nav-links.show {
        display: flex; /* Affiche le menu lorsque la classe 'show' est ajoutée */
    }

}
  
</style>
