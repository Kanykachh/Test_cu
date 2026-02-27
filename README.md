# Test Cycle TDD – React + Vite

Ce projet est un exemple d’application React configurée avec Vite, intégrant :

- Tests unitaires et d’intégration avec Jest et React Testing Library
- Tests end-to-end (E2E) avec Cypress
- Suivi de couverture de code via Codecov
- Génération automatique de documentation technique avec JSDoc
- Workflow CI/CD GitHub Actions pour build, tests et déploiement sur GitHub Pages
- Gestion d’état global pour la liste des utilisateurs et persistance via localStorage

## Liens rapides

- Dépôt GitHub : https://github.com/Ynov-M1/Test_cycle_TDD
- Application déployée : https://ynov-m1.github.io/Test_cycle_TDD/
- Documentation technique (JSDoc) : https://ynov-m1.github.io/Test_cycle_TDD/docs/
- Tableau de bord Codecov : https://codecov.io/gh/Ynov-M1/Test_cycle_TDD

## Prérequis

- Node.js ≥ 20.x recommandé
- pnpm
- Git

## Installation et exécution en local

Clonez le dépôt :
```
git clone https://github.com/Ynov-M1/Test_cycle_TDD.git
```

Accédez au dossier de l’application :
```
cd app
```

Installez les dépendances :
```
pnpm install
```

Lancez l’application en mode développement :
```
pnpm run dev
```

Ouvrez votre navigateur à l’adresse indiquée par Vite (par défaut : http://localhost:5173)

L’application utilise React Router pour gérer plusieurs pages:

- Page d’accueil (/) : affiche un message de bienvenue, le compteur d’utilisateurs inscrits, et la liste des utilisateurs avec leur prénom et nom.
- Page Formulaire (/register) : contient le formulaire d’inscription.

L’état global de la liste des utilisateurs (persons) est remonté vers App.jsx (lift state up) pour que toutes les pages puissent accéder à la liste mise à jour.

La liste des utilisateurs est récupérée et ajoutée via l’API JSONPlaceholder (Axios).

Note : JSONPlaceholder ne persiste pas réellement les POST, la liste est donc simulée.

## Fonctionnalités clés

- Validation complète côté client : champs requis, email valide, code postal, ville, âge ≥ 18 ans, date de naissance non future et pas trop ancienne (>1900)
- Gestion des emails en double : le formulaire affiche une erreur si un email existe déjà
- Notifications toast (react-toastify) pour confirmer l’inscription réussie
- Sélecteurs data-cy robustes pour les tests E2E (firstName, lastName, email, birthDate, zip, city, submit, toast, back-home, user-count, user-list)

## Tests unitaires et d’intégration

Lancer tous les tests unitaires et d’intégration avec rapport de couverture:
```
pnpm run test
```

Les tests couvrent : validation des champs, intégration du formulaire et affichage des erreurs.

Les rapports sont générés dans app/coverage et envoyés automatiquement sur Codecov via GitHub Actions.

- Axios est mocké avec `jest.mock('axios')` pour isoler le front-end
- Les tests couvrent :
    - Succès (200/201)
    - Erreur métier (400) : email déjà existant
    - Crash serveur (500) : application ne plante pas
- Cas particuliers testés : noms incomplets ou vides, `existingEmails` non fourni

## Tests End-to-End (Cypress)

Le projet contient des scénarios E2E vérifiant la navigation et la cohérence des données.

- Routes GET /users et POST /users bouchonnées avec `cy.intercept`
- Scénarios testés :
    - Ajout d’un nouvel utilisateur valide
    - Email déjà existant → message d’erreur
    - Erreur serveur → alert, application ne plante pas
    - Retour à l’accueil → compteur et liste cohérents

### Scénario Nominal

- Navigation vers l’Accueil (/) → Vérifier 0 utilisateur inscrit et liste vide
- Cliquer sur “Inscription” → Navigation vers /register
- Ajouter un nouvel utilisateur valide → Vérifier toast de succès
- Retour à l’Accueil → Vérifier 1 utilisateur inscrit et affichage correct dans la liste

### Scénario d’Erreur

- Partant de 1 utilisateur déjà inscrit
- Navigation vers le formulaire → Tenter un ajout invalide (champ vide, email déjà utilisé, date trop ancienne)
- Vérifier l’affichage des messages d’erreur correspondants (INVALID_DATE, EMAIL_ALREADY_EXISTS, etc.)
- Retour à l’Accueil → Vérifier que la liste et le compteur restent inchangés

### Lancer les tests E2E
```
pnpm run cypress
```

## Documentation technique

La documentation est générée automatiquement avec JSDoc à chaque build CI/CD.

Pour la générer manuellement :
```
cd app  
pnpm run doc
```

## Pipeline CI/CD

- Build de l’application via Vite
- Exécution des tests unitaires, d’intégration et E2E (Cypress headless)
- Aucun appel réseau réel : Axios mocké en tests unitaires et cy.intercept en E2E
- Upload des rapports de couverture vers Codecov
- Déploiement sur GitHub Pages si tous les tests passentement storage permet de synchroniser l’état entre plusieurs onglets/fenêtres : si un utilisateur est ajouté dans un onglet, la liste se met à jour automatiquement dans les autres.