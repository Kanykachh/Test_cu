USE ynov_ci;

INSERT INTO utilisateur (nom, email)
VALUES ('Alice Martin', 'alice.martin@example.com')
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom);
