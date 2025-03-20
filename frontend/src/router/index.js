import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '../services/auth';

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: () => import('../views/Accueil.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/annonce',
    name: 'Annonce',
    component: () => import('../views/Annonce.vue')
  },
  {
    path: '/annonce/creation',
    name: 'Creation Annonce',
    component: () => import('../views/AnnonceCreation.vue')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('../views/Message.vue')
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('../views/Profil.vue')
  },
  {
    path: '/mentions-legales',
    name: 'Mentions Légales',
    component: () => import('../views/MentionLegal.vue')
  },
  {
    path: '/confidentialite',
    name: 'Politique de confidentialité',
    component: () => import('../views/Confidentialite.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/connexion',
    name: 'Connexion',
    component: () => import('../views/Connexion.vue')
  },
  {
    path: '/annonce/:id',
    name: 'AnnonceDetail',
    component: () => import('../components/AnnonceDetail.vue'),
    props: true
  },
  {
    path: '/profil/:id',
    name: 'ProfilDetail',
    component: () => import('../components/ProfilDetail.vue'),
    props: true
  },
  {
    path: '/message/:id',
    name: 'MessageDetail',
    component: () => import('../components/MessageDetail.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  console.log('Navigation vers:', to.path);
  const publicPages = ['/connexion', '/mentions-legales', '/confidentialite', '/contact']; // routes publiques
  const authRequired = !publicPages.includes(to.path); // Détermine si la route nécessite une authentification
  const loggedIn = isAuthenticated();

  // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté, redirige vers /connexion
  if (authRequired && !loggedIn) {
    console.log('Accès refusé, redirection vers /connexion');
    return next({ path: '/connexion', query: { redirect: to.fullPath } });
  }

  next(); // continue la navigation
});

export default router;
