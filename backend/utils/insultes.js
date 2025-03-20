const fs = require('fs');

// Charger la liste d'insultes depuis le fichier JSON
const insultes = JSON.parse(fs.readFileSync('./utils/insultes.json', 'utf8')).insultes;

class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    searchInText(text) {
        for (let i = 0; i < text.length; i++) {
            let node = this.root;
            for (let j = i; j < text.length; j++) {
                if (!node.children[text[j]]) break;
                node = node.children[text[j]];
                if (node.isEndOfWord) return true;
            }
        }
        return false;
    }
}

// Initialisation des structures
const insultesSet = new Set();
const trie = new Trie();

// Charger la liste d'insultes dans les deux structures
insultes.forEach(insulte => {
    insultesSet.add(insulte);
    trie.insert(insulte);
});

function nettoyerTexte(message) {
    return message
        .toLowerCase()
        .normalize("NFD") // Supprime les accents
        .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
        .replace(/[^a-z0-9]/g, ''); // Supprime les caractères spéciaux
}

function contientInsulte(message) {
    // Prétraiter le texte
    const texteNettoye = nettoyerTexte(message);

    // Vérification rapide avec le Set (insultes exactes)
    const mots = texteNettoye.split(/\b/);
    if (mots.some(mot => insultesSet.has(mot))) return true;

    // Vérification avancée avec le Trie (variantes et mots cachés)
    return trie.searchInText(texteNettoye);
}

module.exports = { contientInsulte };
