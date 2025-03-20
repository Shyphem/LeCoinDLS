<template>

    <!-- Section principale avec les mentions légales -->
    <section class="mentions-legales">
        <h1>Mentions Légales : </h1>

        <h2>1. Éditeur du site</h2>
        <p>Nom du site : Le Coin DLS<br>
            URL : www.lecoindls.fr<br>
            Responsable de la publication : REY Evan, VILLENEUVE Briac, QUERE Erwan<br>
            Email : lecoindls@lyceedelasalle.fr<br></p>

        <h2>2. Hébergeur du site</h2>
        <p>Le site est hébergé par :<br>
            Nom de l'hébergeur : Le Groupe Saint-Jean<br>
            Adresse de l'hébergeur : 5 Rue de la Motte Brûlon CS 60624, 35706 Rennes<br>
            Numéro de téléphone de l'hébergeur : +33 02 99 87 12 12</p>

        <h2>3. Propriété intellectuelle</h2>
        <p>L'ensemble du contenu du site www.lecoin-dls.fr, y compris les textes, images, graphismes, logos et icônes,
            est la propriété exclusive du Groupe Saint-Jean. Toute reproduction, distribution, modification, adaptation,
            retransmission ou publication de ces éléments, même partielle, est strictement interdite sans l'accord écrit
            de Groupe Saint-Jean.</p>

        <h2>4. Collecte des données</h2>
        <p>Le site peut collecter des informations personnelles concernant l'utilisateur lors de son inscription ou de
            l'utilisation des services proposés. Ces informations sont traitées conformément à notre <router-link to="/confidentialite"><a>Politique de Confidentialité</a>.</router-link></p>

        <h2>5. Limitation de responsabilité</h2>
        <p>Le Groupe Saint-Jean ne pourra être tenu responsable de tout dommage direct ou indirect résultant de l'accès
            au site ou de l'utilisation des services, y compris en cas de virus pouvant affecter l'équipement
            informatique de l'utilisateur.De plus il ne pourra être tenu des transactions</p>

        <h2>6. Droit applicable</h2>
        <p>Les présentes mentions légales sont régies par la loi française. Tout litige relatif à l'interprétation ou à
            l'exécution des présentes mentions légales sera soumis aux tribunaux compétents de Rennes. De plus le Groupe
            Saint-Jean se réserve le droit d'appliquer une sanction en cas d'abus sur les annonces ou messages.</p>

        <h2>7. Contact</h2>
        <p>Pour toute question ou information relative aux mentions légales, vous pouvez nous contacter à l'adresse
            suivante : lecoindls@lyceedelasalle.fr</p>
    </section>

</template>

<style scoped>
.mentions-legales {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mentions-legales h1 {
    color: #2980B9;
    text-align: center;
    font-size: 35px;
}

.mentions-legales h2 {
    color: #1e6391;
    margin-top: 30px;
}

.mentions-legales p,
.mentions-legales ul {
    line-height: 1.6;
    margin-bottom: 20px;
}

.mentions-legales a {
    color: #2980B9;
    text-decoration: underline;
}
</style>