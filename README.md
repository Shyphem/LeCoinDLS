# **Le-Coin-DLS**

Bienvenue sur Le Coin DLS, une plateforme de petites annonces dédiée aux élèves du Groupe Saint-Jean. Inspiré par des sites comme Le Bon Coin, ce projet vise à faciliter l'achat, la vente et l'échange de manuels scolaires, de fournitures et d'autres articles entre les étudiants. Cette plateforme interne rend les échanges pratiques, sécurisés et adaptés aux besoins des élèves..

---

📌 **Objectifs du projet**

- Faciliter la revente et l'achat de fournitures scolaires : Permettre aux étudiants de publier des annonces pour vendre leurs manuels et autres articles scolaires.
- Créer un environnement sécurisé pour les élèves : Restreindre l'accès à la plateforme aux étudiants du Groupe Saint-Jean.
- Offrir une interface agréable et intuitive : Permettre une navigation facile et un affichage clair des annonces.

---

✨ **Fonctionnalités**

- Création et gestion d'annonces : Les utilisateurs peuvent poster des annonces, incluant des images, descriptions, prix et état des articles.
- Recherche d'annonces : Un système de recherche par mots-clés et filtrage permet de trouver rapidement les annonces correspondantes.
- Profil utilisateur : Chaque utilisateur dispose d'une page de profil qui affiche ses informations, ainsi que la liste de ses annonces avec la possibilité de les supprimer.
- Système de messagerie : Les utilisateurs peuvent contacter les vendeurs via une fonctionnalité de chat intégré, avec stockage des messages en local pour suivre les conversations.
- Système d'authentification : Inscription et connexion sécurisées pour restreindre l'accès à la plateforme.

---

📄 **Pages et Structure**

- Page d'accueil [index.html](https://github.com/Shyphem/Le-Coin-DLS/blob/main/Le_Coin_DLS/public/index.html) : Affiche les dernières annonces publiées et propose une barre de recherche pour filtrer les annonces.
- Page d'annonces [liste-annonce.html](https://github.com/Shyphem/Le-Coin-DLS/blob/main/Le_Coin_DLS/public/liste-annonce.html) : Liste l'ensemble des annonces disponibles, avec un affichage cohérent et une taille d'image ajustée automatiquement.
- Détail de l'annonce [view-annonce.html](https://github.com/Shyphem/Le-Coin-DLS/blob/main/Le_Coin_DLS/public/view-annonce.html) : Affiche une annonce spécifique avec ses détails complets, ainsi que l'option de contacter le vendeur.
- Page de profil [profil.html](https://github.com/Shyphem/Le-Coin-DLS/blob/main/Le_Coin_DLS/public/profil.html) : Affiche les informations de l'utilisateur connecté, telles que son pseudo, email, et la liste de ses annonces.
- Chat en ligne [chat.html](https://github.com/Shyphem/Le-Coin-DLS/blob/main/Le_Coin_DLS/public/chat.html) : Permet une communication directe entre l'acheteur et le vendeur.

---

🛠️ **Technologies utilisées**

- Frontend : HTML, CSS, JavaScript
- Backend : Node.js avec Express pour gérer les requêtes de chat en direct
- Base de données : MySQL pour stocker les utilisateurs et leurs annonces
- Authentification : Système de gestion de comptes sécurisé avec génération de pseudonymes
