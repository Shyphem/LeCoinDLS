// routes/annonce.js
const express = require('express');
const { createAnnonce, getAnnonce, getAnnonces, searchAnnonces, getCategories, getEtats, getLatestAnnonces, getAnnoncesByUser, getAnnoncesByUserId, deleteAnnonce, reportAnnonce, getReportedAnnonces } = require('../controllers/annonceController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const upload = multer();

const router = express.Router();

/**
 * @route POST /annonces
 * @desc Crée une nouvelle annonce
 * @access Private
 * @body { user_id: number, categorie_id: number, title: string, prix: number, description: string }
 * @response { id: number, user_id: number, categorie_id: number, title: string, prix: number, description: string, etat: string, creation_date: string }
 * @error { message: string }
 */
router.post('/', authenticateToken, upload.array('images'), createAnnonce);

/**
 * @route GET /annonces/reported
 * @desc Récupère toutes les annonces signalées (reported = true)
 * @access Admin only
 * @response { annonces: array }
 * @error { message: string }
 */
router.get('/reported', authenticateToken, getReportedAnnonces);

/**
 * @route POST /annonces/report/:id
 * @desc Report une annonce
 * @access Private (nécessite authentification)
 * @params { id: number }
 * @response { message: string }
 * @error { message: string }
 */
router.post('/report/:id', authenticateToken, reportAnnonce);

/**
 * @route GET /annonces
 * @desc Récupère toutes les annonces
 * @access Public
 * @response { annonces: array }
 * @error { message: string }
 */
router.get('/all', getAnnonces);

/**
 * @route GET /latest
 * @desc Récupère les 10 dernières annonces
 * @access Public
 * @response { annonces: array }
 * @error { message: string }
 */
router.get('/latest', getLatestAnnonces);

/**
 * @route GET /annonces/search
 * @desc Recherche des annonces avec des filtres
 * @access Public
 * @query { query: string, categorie_id: number, etat: string, prix_max: number }
 * @response { annonces: array }
 * @error { message: string }
 */
router.get('/search', searchAnnonces);

/**
 * @route GET /categories
 * @desc Récupère toutes les catégories
 * @access Public
 * @response { categories: array }
 * @error { message: string }
 */
router.get('/categories', getCategories);

/**
 * @route GET /annonces/etats
 * @desc Récupère les états des annonces
 * @access Public
 * @params { id: number }
 * @response { etat: string }
 * @error { message: string }
 */
router.get('/etats', getEtats);

/**
 * @route GET /annonces/user
 * @desc Récupère toutes les annonces de l'utilisateur connecté
 * @access Private
 * @response { annonces: array }
 * @error { message: string }
 */
router.get('/user', authenticateToken, getAnnoncesByUser);

/**
 * @route GET /annonces/user/:id
 * @desc Récupère toutes les annonces d'un utilisateur par son ID
 * @access Public
 * @params { id: number }
 * @response { annonces: array }
 * @error { message: string }
 */
router.get('/user/:id', getAnnoncesByUserId);

/**
 * @route GET /annonces/:id
 * @desc Récupère une annonce par son ID
 * @access Public
 * @params { id: number }
 * @response { id: number, user_id: number, categorie_id: number, title: string, prix: number, description: string, etat: string, creation_date: string }
 * @error { message: string }
 */
router.get('/:id', getAnnonce);

/**
 * @route DELETE /annonces/:id
 * @desc Supprime une annonce par son ID
 * @access Private
 * @params { id: number }
 * @response { message: string }
 * @error { message: string }
 */
router.delete('/:id', authenticateToken, deleteAnnonce);

module.exports = router;