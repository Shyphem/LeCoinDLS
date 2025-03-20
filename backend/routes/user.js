// routes/user.js
const express = require('express');
const { getUserInfo, getUserProfile, deleteUserAccount } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const { deleteAnnonce } = require('../controllers/annonceController');

const router = express.Router();

/**
 * @route GET /users/profile
 * @desc Récupère le profil de l'utilisateur connecté
 * @access Private
 * @response { mail: string, identifiant: string, inscription_date: string, annonces: [{ id: number, user_id: number, title: string, categorie: string, prix: number, description: string, etat: string, creation_date: string }] }
 * @error { message: string }
 */
router.get('/profile', authenticateToken, getUserProfile);

/**
 * @route GET /users/:id
 * @desc Récupère les informations d'un utilisateur par son ID
 * @access Public
 * @params { id: number }
 * @response { id: number, mail: string, password: string, level: string, identifiant: string, inscription_date: string, last_connexion: string, statut: string, Annonces: [{ id: number, user_id: number, title: string, categorie: string, prix: number, description: string, etat: string, creation_date: string }] }
 * @error { message: string }
 */
router.get('/:id', getUserInfo);

/**
 * @route DELETE /users/profile
 * @desc Supprime le compte de l'utilisateur connecté
 * @access Private
 * @response { message: string }
 * @error { message: string }
 */
router.delete('/profile', authenticateToken, deleteUserAccount);

module.exports = router;