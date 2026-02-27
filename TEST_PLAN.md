# TEST_PLAN.md

## 1. Objectif

Ce document décrit le plan de tests pour valider les modules de validation (validator.js, errorMessages.js) et le composant PersonForm, les fonctions API (personService.js) ainsi que les parcours utilisateurs via E2E. 

Objectifs principaux :
- Vérifier toutes les validations unitaires.
- Vérifier l’affichage des erreurs dans le DOM.
- Vérifier le comportement global du formulaire : activation/désactivation du bouton, sauvegarde dans `localStorage`, affichage du toast de succès.
- Vérifier la persistance des données et la navigation entre les pages (SPA).
- Tester la résilience de l’interface face aux erreurs serveur (400, 500).

---

## 2. Portée

### 2.1 Unit Tests (UT)
- `calculateAge`
- `validatePerson`
- `validateAge`
- `validateZipCode`
- `validateCity`
- `validateName`
- `validateEmail`
- `getErrorMessage`

### 2.2 Integration Tests (IT)
- Composant `PersonForm`
- Gestion des erreurs dans le DOM
- Activation/désactivation du bouton submit
- Sauvegarde dans `localStorage`
- Affichage du toast de succès
- Vérification des messages d’erreur
- Persistance via API JSONPlaceholder mockée avec Axios 
- Fonction fetchUsers et createUser avec jest.mock('axios')

### 2..3 End-to-End (E2E) Tests
- Navigation multi-pages (/ et /register)
- Scénarios Nominal et Erreur
- Vérification des messages d’erreur côté UI
- Vérification du compteur et de la liste d’utilisateurs après chaque action
- Tous les appels API sont bouchonnés via cy.intercept (GET /users, POST /users)
- Gestion des erreurs serveur 400 et 500

---

## 3. Stratégie de test

### 3.1 Tests Unitaires (UT)

- **calculateAge**
    - Retourne l’âge correct pour un objet `{ birth: Date }`
    - Gestion des erreurs : paramètre manquant, type incorrect, champ `birth` absent, date invalide

- **validatePerson**
    - Cas positif : objet `person` complet et valide
    - Cas négatifs : paramètre manquant, champs manquants, mauvais type de champs

- **validateAge**
    - Cas positif : adulte ≥ 18 ans
    - Cas négatifs : âge < 18, date invalide, date future

- **validateZipCode**
    - Cas positif : 5 chiffres
    - Cas négatifs : moins ou plus de chiffres, lettres, null

- **validateCity**
    - Cas positif : noms de ville corrects (lettres, accents)
    - Cas négatifs : chiffres, symboles, XSS

- **validateName**
    - Cas positif : lettres, accents, tirets
    - Cas négatifs : chiffres, symboles, XSS, type invalide

- **validateEmail**
    - Cas positif : email correct
    - Cas négatifs : format incorrect, null

- **getErrorMessage**
  - Cas positif : erreur reconnue
  - Cas négatifs : erreur inconnue

- **personService.js** 
  - fetchUsers → renvoie liste transformée 
  - createUser → succès, email déjà existant local, erreur serveur 500, erreur serveur 400 simulant validation back-end

Tests mockés avec jest.mock('axios')
---

### 3.2 Tests d’intégration (IT)

**Formulaire complet**
  - Champs vides → bouton `Soumettre` désactivé
  - Saisie de valeurs invalides → affichage du message d’erreur sous le champ
  - Correction progressive → disparition des erreurs
  - Formulaire valide → bouton `Soumettre` activé
  - Soumission → toast de succès visible
  - Soumission → `localStorage` mis à jour
  - Soumission → champs vidés après soumission

**Cas spécifiques**
  - Age < 18 → message `"Vous devez avoir au moins 18 ans"`
  - Date future → message `"La date de naissance ne peut pas être dans le futur"`
  - Date < 1900 → message `"La date de naissance est trop ancienne"`
  - Zip invalide → message `"Le code postal doit contenir 5 chiffres"`
  - Ville invalide → message `"Le nom de la ville n'est pas valide"`
  - Email invalide → message `"L'email n'est pas valide"`
  - Email déjà utilisé → message `"Cet email est déjà utilisé"`
  - Injection XSS (firstName / city) → message `"Caractères interdits détectés"`

**API et MOCKS**
- fetchUsers mockée → liste d’utilisateurs renvoyée
- createUser mockée → succès ou rejets simulant erreurs
- existingEmails optionnel, validé côté front
- Gestion des erreurs serveur : 400 et 500

---

# 3.3 Tests End-to-End (E2E)

## Scénario Nominal

- Accueil (/) → vérifier compteur = 0 et liste vide ([data-cy=user-count], [data-cy=user-list])
- Cliquer sur “Inscription” → navigation vers /register
- Remplir formulaire avec données valides
- Soumission → toast visible (#success-toast)
- Retour à l’Accueil → compteur = 1 et nouvel utilisateur affiché

## Scénario d’Erreur

- Accueil avec 1 utilisateur existant
- Navigation vers /register
- Tentatives d’ajout invalide :
  - Champs vides → bouton submit désactivé
  - Email déjà utilisé → message "Cet email est déjà utilisé"
  - Date < 1900 → message "Date de naissance trop ancienne"
- Retour à l'accueil → compteur = 1

## Mocks E2E

- GET /users et POST /users bouchonnés via cy.intercept 
- Simulation des réponses: 200, 400, 500 
- Vérification que l’application ne plante pas pour erreurs serveur

### 3.4 Objectifs de couverture

- Couverture maximale **unit tests** : toutes les validations.
- Couverture maximale **integration tests** : tous les flux utilisateurs, erreurs, corrections et Soumission.
- Vérification du toast et de `localStorage`.
- Couverture E2E : navigation SPA, persistance des données, toast et messages d’erreur affichés