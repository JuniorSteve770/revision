// src/projects/BackendInterview/BackendInterviewQCM.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — SQL Pratique : Du SELECT au CTE",
    answer:
      "◆ **Niveau Débutant** : SELECT, FROM, WHERE, ORDER BY — lire et filtrer des données ◆ **Niveau Intermédiaire** : GROUP BY, HAVING, COUNT/SUM/AVG/MIN/MAX, CASE WHEN, INNER JOIN, LEFT JOIN ◆ **Niveau Avancé** : Sous-requêtes (IN, EXISTS, corrélées), UPDATE avec sous-requête, VIEW, CTE (WITH ... AS) ◆ **Niveau Expert** : Fonctions analytiques ROW_NUMBER / RANK / DENSE_RANK / LAG / LEAD, optimisation EXPLAIN, fonctions stockées ◆ Contexte fil rouge : BDD `etudiants`, `notes`, `cours`, `inscriptions`",
  },
  {
    question: "SELECT & FROM — La requête de base",
    answer:
      "◆ **Syntaxe minimale** : `SELECT colonne FROM table` — au minimum ces deux mots-clés ◆ **Tout afficher** : `SELECT * FROM etudiants` — éviter en production (coûteux) ◆ **Alias** : `SELECT e.nom, e.prenom FROM etudiants AS e` — améliore la lisibilité et est obligatoire quand on joint plusieurs tables ◆ **Colonnes calculées** : `SELECT nom, age * 12 AS age_en_mois FROM etudiants` ◆ **DISTINCT** : `SELECT DISTINCT niveau FROM etudiants` — élimine les doublons ⚠️ `SELECT *` en production = colonnes inutiles transportées, requêtes plus lentes",
  },
  {
    question: "WHERE — Filtrer les lignes",
    answer:
      "◆ **Opérateurs** : `=`, `!=`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL` ◆ **Exemple** : `SELECT * FROM etudiants WHERE niveau = 'Licence' AND age > 20` ◆ **LIKE** : `WHERE nom LIKE 'Du%'` — tous les noms commençant par 'Du' ◆ **IN** : `WHERE niveau IN ('Licence', 'Master')` — équivalent à OR multiples ◆ **IS NULL** : `WHERE note IS NULL` — NE PAS utiliser `= NULL` ◆ **BETWEEN** : `WHERE age BETWEEN 18 AND 25` — bornes incluses ⚠️ `WHERE = NULL` ne retourne jamais de résultat — toujours utiliser `IS NULL`",
  },
  {
    question: "ORDER BY — Trier les résultats",
    answer:
      "◆ **Croissant (défaut)** : `ORDER BY nom ASC` ou simplement `ORDER BY nom` ◆ **Décroissant** : `ORDER BY note DESC` ◆ **Multi-colonnes** : `ORDER BY niveau ASC, note DESC` — trie par niveau puis par note décroissante au sein de chaque niveau ◆ **Par position** : `ORDER BY 2` — trie par la 2ème colonne du SELECT (déconseillé, peu lisible) ◆ **NULL en dernier** : `ORDER BY note DESC NULLS LAST` (PostgreSQL) ⚠️ Sans ORDER BY, l'ordre des lignes est imprévisible — ne jamais supposer un ordre naturel",
  },
  {
    question: "GROUP BY & Fonctions d'agrégation",
    answer:
      "◆ **GROUP BY** : regroupe les lignes partageant une même valeur — `SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau` ◆ **COUNT(*)** : compte toutes les lignes y compris NULL ◆ **COUNT(col)** : ignore les NULL — `COUNT(id_cours)` retourne 0 si cours IS NULL ◆ **SUM, AVG, MIN, MAX** : `SELECT matiere, AVG(note), MAX(note), MIN(note) FROM notes GROUP BY matiere` ◆ **ROUND** : `ROUND(AVG(note), 2)` arrondit à 2 décimales ⚠️ Toute colonne dans SELECT sans agrégat DOIT être dans GROUP BY — sinon erreur SQL",
  },
  {
    question: "HAVING — Filtrer après agrégation",
    answer:
      "◆ **HAVING vs WHERE** : WHERE filtre les lignes AVANT GROUP BY, HAVING filtre les groupes APRÈS ◆ **Syntaxe** : `SELECT matiere, AVG(note) FROM notes GROUP BY matiere HAVING AVG(note) > 12` ◆ **Combiné** : `WHERE note > 5 GROUP BY id_etudiant HAVING AVG(note) < 13` — WHERE écarte d'abord les notes ≤ 5, puis HAVING filtre les groupes ◆ **Cas pratique** : trouver les matières où la moyenne est insuffisante ⚠️ `WHERE AVG(note) > 12` provoque une ERREUR — les fonctions d'agrégation ne peuvent pas être dans WHERE",
  },
  {
    question: "CASE WHEN — Logique conditionnelle",
    answer:
      "◆ **Syntaxe** : `CASE WHEN condition THEN valeur ELSE autre_valeur END` ◆ **Dans SELECT** : `SELECT nom, CASE WHEN note >= 10 THEN 'Admis' ELSE 'Refusé' END AS statut FROM notes` ◆ **Agrégation conditionnelle** : `SUM(CASE WHEN matiere='Maths' THEN note ELSE 0 END) AS total_maths` ◆ **Pivot** : `AVG(CASE WHEN matiere='Maths' THEN note END) AS moy_maths, AVG(CASE WHEN matiere='Physique' THEN note END) AS moy_physique` ◆ **CASE simple** : `CASE niveau WHEN 'L1' THEN 1 WHEN 'L2' THEN 2 ELSE 3 END` ⚠️ CASE WHEN sans ELSE retourne NULL si aucune condition n'est vraie",
  },
  {
    question: "INNER JOIN & LEFT JOIN",
    answer:
      "◆ **INNER JOIN** : uniquement les lignes correspondantes dans les deux tables ◆ **Syntaxe** : `SELECT e.nom, c.nom_cours FROM inscriptions i INNER JOIN etudiants e ON i.id_etudiant = e.id INNER JOIN cours c ON i.id_cours = c.id` ◆ **LEFT JOIN** : toutes les lignes de la table gauche + NULL si pas de correspondance à droite ◆ **Anti-jointure** : `LEFT JOIN inscriptions i ON e.id = i.id_etudiant WHERE i.id_cours IS NULL` → étudiants sans cours ◆ **Compter avec LEFT JOIN** : `COUNT(i.id_etudiant)` retourne 0 pour les cours sans inscrits ⚠️ INNER JOIN = intersection ; LEFT JOIN = table gauche complète — confondre les deux cause des résultats manquants",
  },
  {
    question: "Sous-requêtes — IN, EXISTS, corrélées",
    answer:
      "◆ **IN** : `WHERE id_etudiant IN (SELECT id_etudiant FROM notes HAVING AVG(note) < 10)` ◆ **NOT IN** : `WHERE id NOT IN (SELECT id_etudiant FROM inscriptions)` — étudiants non inscrits ⚠️ NOT IN avec un NULL dans la sous-requête retourne toujours vide — préférer NOT EXISTS ◆ **EXISTS** : `WHERE EXISTS (SELECT 1 FROM inscriptions WHERE id_etudiant = e.id)` — plus performant sur grandes tables ◆ **Corrélée** : la sous-requête référence la requête externe — recalculée pour chaque ligne ◆ **Scalaire** : `SELECT nom, (SELECT AVG(note) FROM notes WHERE id_etudiant = e.id) AS moyenne FROM etudiants e`",
  },
  {
    question: "VIEW & CTE",
    answer:
      "◆ **VIEW** : requête sauvegardée et réutilisable — `CREATE VIEW etudiants_majeurs AS SELECT * FROM etudiants WHERE age > 22` ◆ Usage : `SELECT * FROM etudiants_majeurs` — simplifie, sécurise, réutilisable dans de nombreuses requêtes ◆ **CTE** : `WITH majeurs AS (SELECT * FROM etudiants WHERE age >= 21) SELECT m.nom, n.note FROM majeurs m JOIN notes n ON m.id = n.id_etudiant` ◆ **Différence clé** : VIEW = stockée en BDD, CTE = temporaire pour une seule requête ◆ **CTE chaîné** : `WITH a AS (...), b AS (...) SELECT ...` — plusieurs CTEs dans la même requête ⚠️ Un CTE n'est visible QUE dans la requête qui suit sa définition",
  },
  {
    question: "UPDATE & DELETE avec sous-requêtes",
    answer:
      "◆ **UPDATE simple** : `UPDATE etudiants SET niveau = 'Master' WHERE id = 5` ◆ **UPDATE avec sous-requête** : `UPDATE notes SET note = note + 1 WHERE id_etudiant IN (SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 13)` ◆ **DELETE ciblé** : `DELETE FROM inscriptions WHERE id_etudiant IN (SELECT id FROM etudiants WHERE niveau = 'Licence' AND age > 30)` ◆ **TRUNCATE** : vide toute la table sans WHERE — plus rapide que DELETE massif ⚠️ Sans WHERE, UPDATE et DELETE affectent TOUTES les lignes — toujours tester le SELECT correspondant avant",
  },
  {
    question: "Fonctions analytiques — ROW_NUMBER, RANK, DENSE_RANK",
    answer:
      "◆ **Syntaxe** : `fonction() OVER (PARTITION BY col ORDER BY col)` ◆ **ROW_NUMBER()** : numéro unique même en cas d'égalité — 1, 2, 3, 4 ◆ **RANK()** : même rang aux égaux, saute les suivants — 1, 1, 3, 4 ◆ **DENSE_RANK()** : même rang aux égaux, sans saut — 1, 1, 2, 3 ◆ **Exemple** : top 3 par matière : `WHERE rn <= 3` sur un CTE avec ROW_NUMBER ◆ **PARTITION BY** : applique la numérotation indépendamment dans chaque groupe (ex: par matière) ⚠️ ROW_NUMBER / RANK / DENSE_RANK ne peuvent pas être dans WHERE — utiliser un CTE ou sous-requête",
  },
  {
    question: "Fonctions analytiques — LAG, LEAD",
    answer:
      "◆ **LAG(col, n)** : accède à la valeur de la ligne N positions AVANT dans la partition ◆ **LEAD(col, n)** : accède à la valeur de la ligne N positions APRÈS ◆ **Exemple variation** : `LAG(note) OVER (PARTITION BY id_etudiant ORDER BY date_examen)` — note de l'examen précédent ◆ **Calcul écart** : `note - LAG(note) OVER (...) AS progression` ◆ **Valeur par défaut** : `LAG(note, 1, 0)` — retourne 0 si pas de ligne précédente ⚠️ LAG regarde en ARRIÈRE, LEAD regarde en AVANT — confusion très fréquente en entretien",
  },
  {
    question: "Fonctions stockées & Optimisation EXPLAIN",
    answer:
      "◆ **FUNCTION** : `CREATE FUNCTION moyenne_etudiant(p_id INT) RETURNS DECIMAL(5,2) BEGIN DECLARE moy DECIMAL(5,2); SELECT AVG(note) INTO moy FROM notes WHERE id_etudiant = p_id; RETURN moy; END` ◆ **Appel** : `SELECT nom, moyenne_etudiant(id) AS moyenne FROM etudiants` ◆ **EXPLAIN** : `EXPLAIN SELECT * FROM notes WHERE matiere = 'Maths'` — affiche le plan d'exécution ◆ **Lire EXPLAIN** : `type = ALL` = scan complet (lent) ; `type = ref` = index utilisé (rapide) ◆ **INDEX** : `CREATE INDEX idx_matiere ON notes(matiere)` — accélère les filtres et jointures ⚠️ Appliquer une fonction sur une colonne indexée (ex: `YEAR(date)`) désactive l'utilisation de l'index",
  },
  {
    question: "WHERE, GROUP BY, HAVING — Quand les utiliser et dans quel ordre ?",
    answer:
      "◆ **Ordre logique SQL** : `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY` ◆ **WHERE** : filtre les lignes AVANT tout regroupement — `SELECT * FROM notes WHERE note > 10` ◆ Utiliser WHERE lorsque la condition porte sur une ligne individuelle ◆ **GROUP BY** : regroupe les lignes pour calculer des agrégats — `SELECT matiere, AVG(note) FROM notes GROUP BY matiere` ◆ Utiliser GROUP BY dès qu'une fonction comme COUNT, AVG, SUM, MIN ou MAX doit être calculée par catégorie ◆ **HAVING** : filtre les groupes APRÈS calcul des agrégats — `HAVING AVG(note) > 12` ◆ Utiliser HAVING lorsqu'on filtre sur un résultat calculé (AVG, COUNT, SUM...) ⚠️ `WHERE AVG(note) > 12` est invalide car AVG n'existe pas encore au moment où WHERE s'exécute",
  },
  {
    question: "WHERE — Filtrer les lignes avant calcul",
    answer:
      "◆ **Rôle** : sélectionner uniquement les lignes utiles avant toute agrégation ◆ Exemple simple : `SELECT * FROM etudiants WHERE age > 22` ◆ Exemple multiple : `WHERE niveau = 'Master' AND age > 24` ◆ Exemple avec LIKE : `WHERE nom LIKE 'D%'` ◆ Exemple avec BETWEEN : `WHERE note BETWEEN 10 AND 15` ◆ Exemple avec IN : `WHERE niveau IN ('Licence','Master')` ◆ Utiliser WHERE lorsque la condition concerne une valeur présente dans une ligne spécifique ⚠️ WHERE ne peut pas utiliser directement AVG, COUNT, SUM ou toute autre fonction d'agrégation",
  },
  {
    question: "GROUP BY — Regrouper les données",
    answer:
      "◆ **Rôle** : créer des groupes de lignes partageant une même valeur ◆ Exemple : `SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau` ◆ Résultat : une ligne par niveau avec son nombre d'étudiants ◆ Exemple : `SELECT matiere, AVG(note) FROM notes GROUP BY matiere` ◆ GROUP BY est presque toujours utilisé avec COUNT, AVG, SUM, MIN ou MAX ◆ Toute colonne présente dans SELECT sans agrégat doit également apparaître dans GROUP BY ◆ Utiliser GROUP BY lorsqu'on souhaite obtenir des statistiques par catégorie ⚠️ Oublier une colonne dans GROUP BY provoque souvent une erreur SQL ou un résultat incohérent",
  },
  {
    question: "HAVING — Filtrer après agrégation",
    answer:
      "◆ **Rôle** : filtrer les groupes créés par GROUP BY ◆ Exemple : `SELECT matiere, AVG(note) FROM notes GROUP BY matiere HAVING AVG(note) > 12` ◆ Ici, toutes les matières sont regroupées puis seules celles dont la moyenne dépasse 12 sont conservées ◆ Exemple : `SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau HAVING COUNT(*) > 50` ◆ Utiliser HAVING dès qu'une condition dépend d'un calcul agrégé ◆ HAVING peut également être utilisé avec SUM, MIN, MAX ou COUNT ◆ Pensée pratique : WHERE filtre les lignes, HAVING filtre les groupes ⚠️ HAVING sans GROUP BY est autorisé dans certains SGBD mais rarement nécessaire",
  },
  {
    question: "WHERE ou HAVING ? — Le bon réflexe",
    answer:
      "◆ Condition sur une ligne individuelle ? → utiliser WHERE ◆ Exemple : `WHERE note > 10` ◆ Condition sur une moyenne, un total ou un comptage ? → utiliser HAVING ◆ Exemple : `HAVING AVG(note) > 12` ◆ Mauvais exemple : `WHERE COUNT(*) > 5` ❌ ◆ Bon exemple : `GROUP BY niveau HAVING COUNT(*) > 5` ✅ ◆ Astuce entretien : demander 'est-ce que je filtre une ligne ou un groupe ?' ◆ Ligne = WHERE ◆ Groupe = HAVING ⚠️ C'est l'une des questions les plus fréquentes en entretien SQL",
  },
  {
    question: "Combiner WHERE + GROUP BY + HAVING",
    answer:
      "◆ Cas réel : trouver les matières dont la moyenne est supérieure à 12 en ne gardant que les notes supérieures à 5 ◆ Requête : `SELECT matiere, AVG(note) FROM notes WHERE note > 5 GROUP BY matiere HAVING AVG(note) > 12` ◆ Étape 1 : WHERE supprime les notes ≤ 5 ◆ Étape 2 : GROUP BY regroupe les notes restantes par matière ◆ Étape 3 : AVG calcule la moyenne de chaque matière ◆ Étape 4 : HAVING conserve uniquement les matières dont la moyenne dépasse 12 ◆ Comprendre cet ordre d'exécution est fondamental pour écrire des requêtes complexes ⚠️ Inverser WHERE et HAVING modifie complètement le résultat",
  },
  {
    question: "Erreurs fréquentes avec WHERE, GROUP BY et HAVING",
    answer:
      "◆ Erreur 1 : `WHERE AVG(note) > 12` ❌ → utiliser HAVING ◆ Erreur 2 : oublier GROUP BY lorsqu'on mélange colonnes et agrégats ◆ Exemple incorrect : `SELECT matiere, AVG(note) FROM notes` ❌ ◆ Exemple correct : `SELECT matiere, AVG(note) FROM notes GROUP BY matiere` ✅ ◆ Erreur 3 : mettre HAVING avant GROUP BY ◆ Ordre correct : `GROUP BY ... HAVING ...` ◆ Erreur 4 : utiliser HAVING pour filtrer des lignes simples alors que WHERE est plus efficace ◆ Exemple : `HAVING age > 20` est généralement moins performant que `WHERE age > 20` ⚠️ En entretien, ces erreurs sont souvent utilisées pour tester la compréhension réelle de SQL",
  },
  {
    question: "Méthode rapide pour choisir WHERE, GROUP BY ou HAVING",
    answer:
      "◆ Étape 1 : Ai-je besoin d'une moyenne, d'un total ou d'un comptage ? → ajouter GROUP BY ◆ Étape 2 : Dois-je filtrer des lignes individuelles ? → utiliser WHERE ◆ Étape 3 : Dois-je filtrer un résultat calculé avec AVG, COUNT ou SUM ? → utiliser HAVING ◆ Exemple : étudiants de Master avec moyenne > 14 ◆ WHERE niveau='Master' → filtre les lignes ◆ GROUP BY id_etudiant → calcule une moyenne par étudiant ◆ HAVING AVG(note) > 14 → conserve les meilleurs étudiants ◆ Cette logique couvre plus de 80% des requêtes SQL rencontrées en entreprise ⚠️ Toujours réfléchir dans l'ordre : WHERE → GROUP BY → HAVING",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[SELECT pratique] Quelle requête affiche le nom et le prénom de tous les étudiants en Licence, triés alphabétiquement par nom ?",
      options: [
        "SELECT * FROM etudiants WHERE niveau = 'Licence'",
        "SELECT nom, prenom FROM etudiants WHERE niveau = 'Licence' ORDER BY nom ASC",
        "SELECT nom, prenom FROM etudiants ORDER BY nom WHERE niveau = 'Licence'",
        "SELECT nom, prenom FROM etudiants HAVING niveau = 'Licence' ORDER BY nom",
      ],
      answer:
        "SELECT nom, prenom FROM etudiants WHERE niveau = 'Licence' ORDER BY nom ASC",
      explanation:
        "SELECT choisit les colonnes, WHERE filtre les lignes avant tri, ORDER BY trie. L'ordre des clauses est obligatoire : SELECT → FROM → WHERE → ORDER BY. HAVING ne s'utilise qu'avec GROUP BY pour filtrer des agrégats, pas des lignes brutes.",
    },
    {
      question:
        "[WHERE pratique] Quelle requête affiche les notes comprises entre 10 et 15 inclus en Maths, sans utiliser BETWEEN ?",
      options: [
        "SELECT * FROM notes WHERE matiere = 'Maths' AND note >= 10 AND note <= 15",
        "SELECT * FROM notes WHERE matiere = 'Maths' OR note >= 10 OR note <= 15",
        "SELECT * FROM notes WHERE matiere = 'Maths' AND note > 10 AND note < 15",
        "SELECT * FROM notes HAVING matiere = 'Maths' AND note >= 10 AND note <= 15",
      ],
      answer:
        "SELECT * FROM notes WHERE matiere = 'Maths' AND note >= 10 AND note <= 15",
      explanation:
        "BETWEEN 10 AND 15 est équivalent à >= 10 AND <= 15 (bornes incluses). Utiliser OR au lieu de AND retournerait les notes Maths OU les notes >= 10 OU les notes <= 15 — soit presque tout. Les opérateurs > et < excluraient 10 et 15.",
    },
    {
      question:
        "[ORDER BY pratique] Compléter : afficher les étudiants triés par niveau croissant, puis par âge décroissant dans chaque niveau.\n`SELECT nom, niveau, age FROM etudiants ORDER BY ___`",
      options: [
        "niveau, age",
        "niveau ASC, age DESC",
        "niveau DESC, age ASC",
        "ORDER BY niveau, ORDER BY age DESC",
      ],
      answer: "niveau ASC, age DESC",
      explanation:
        "ORDER BY accepte plusieurs colonnes séparées par des virgules, chacune avec son propre ASC/DESC. Sans précision, ASC est le défaut — mais le préciser explicitement améliore la lisibilité. On ne peut pas écrire ORDER BY deux fois.",
    },
    {
      question:
        "[GROUP BY pratique] Quelle requête compte le nombre d'étudiants par niveau ?",
      options: [
        "SELECT niveau, COUNT(niveau) FROM etudiants",
        "SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau",
        "SELECT niveau, COUNT(*) FROM etudiants HAVING niveau",
        "SELECT COUNT(*) FROM etudiants WHERE niveau GROUP BY niveau",
      ],
      answer: "SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau",
      explanation:
        "GROUP BY regroupe les lignes par valeur de 'niveau'. COUNT(*) compte les lignes dans chaque groupe. Sans GROUP BY, COUNT(*) compte toutes les lignes. La colonne 'niveau' doit être dans GROUP BY car elle n'est pas dans une agrégation.",
    },
    {
      question:
        "[HAVING pratique] Quelle requête affiche uniquement les matières dont la moyenne des notes dépasse 12 ?",
      options: [
        "SELECT matiere, AVG(note) FROM notes WHERE AVG(note) > 12 GROUP BY matiere",
        "SELECT matiere, AVG(note) FROM notes GROUP BY matiere HAVING AVG(note) > 12",
        "SELECT matiere FROM notes GROUP BY matiere WHERE AVG(note) > 12",
        "SELECT matiere, AVG(note) FROM notes HAVING note > 12 GROUP BY matiere",
      ],
      answer:
        "SELECT matiere, AVG(note) FROM notes GROUP BY matiere HAVING AVG(note) > 12",
      explanation:
        "HAVING filtre les groupes APRÈS le calcul de GROUP BY. WHERE ne peut pas contenir de fonctions d'agrégation comme AVG(). L'ordre des clauses est strict : FROM → WHERE → GROUP BY → HAVING → ORDER BY.",
    },
    {
      question:
        "[CASE WHEN pratique] Compléter pour afficher 'Admis' si note >= 10, 'Ajourné' sinon :\n`SELECT nom, note, ___ AS statut FROM notes n JOIN etudiants e ON n.id_etudiant = e.id`",
      options: [
        "IF(note >= 10, 'Admis', 'Ajourné')",
        "CASE WHEN note >= 10 THEN 'Admis' ELSE 'Ajourné' END",
        "WHEN note >= 10 THEN 'Admis' ELSE 'Ajourné'",
        "CASE note >= 10 THEN 'Admis' END",
      ],
      answer: "CASE WHEN note >= 10 THEN 'Admis' ELSE 'Ajourné' END",
      explanation:
        "CASE WHEN est la syntaxe standard SQL pour les conditions. IF() existe en MySQL mais n'est pas standard. La structure complète est : CASE WHEN condition THEN résultat [WHEN ... THEN ...] ELSE résultat_défaut END. Le ELSE évite les NULL inattendus.",
    },
    {
      question:
        "[JOIN pratique] Quelle requête affiche le nom de l'étudiant et le nom du cours pour chaque inscription ?",
      options: [
        "SELECT e.nom, c.nom_cours FROM etudiants e, cours c WHERE e.id = c.id",
        "SELECT e.nom, c.nom_cours FROM inscriptions i INNER JOIN etudiants e ON i.id_etudiant = e.id INNER JOIN cours c ON i.id_cours = c.id",
        "SELECT e.nom, c.nom_cours FROM etudiants e LEFT JOIN cours c ON e.id = c.id",
        "SELECT nom, nom_cours FROM etudiants JOIN cours",
      ],
      answer:
        "SELECT e.nom, c.nom_cours FROM inscriptions i INNER JOIN etudiants e ON i.id_etudiant = e.id INNER JOIN cours c ON i.id_cours = c.id",
      explanation:
        "La table de liaison est 'inscriptions'. Pour relier étudiants et cours, il faut passer par inscriptions avec deux JOIN. La syntaxe virgule (FROM a, b WHERE a.id = b.id) est une vieille syntaxe implicite à éviter. LEFT JOIN ici inclurait des lignes sans cours — INNER JOIN est correct si on veut uniquement les inscrits.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre WHERE et HAVING pour filtrer par matière ?",
      options: [
        "WHERE matiere = 'Maths' et HAVING matiere = 'Maths' sont identiques",
        "WHERE filtre les lignes avant GROUP BY (données brutes) — HAVING filtre les groupes après agrégation",
        "HAVING est plus rapide que WHERE sur les grandes tables",
        "WHERE s'applique aux colonnes texte, HAVING aux colonnes numériques",
      ],
      answer:
        "WHERE filtre les lignes avant GROUP BY (données brutes) — HAVING filtre les groupes après agrégation",
      explanation:
        "Pour filtrer sur matière = 'Maths', WHERE est correct et plus efficace (filtre avant le calcul). HAVING matiere = 'Maths' fonctionnerait mais est sémantiquement incorrect — on filtre une valeur brute, pas un agrégat. La règle : si on peut utiliser WHERE, on l'utilise.",
    },
    {
      question:
        "[AVG / COUNT pratique] Quelle requête affiche la moyenne des notes par étudiant, uniquement pour ceux ayant au moins 3 notes ?",
      options: [
        "SELECT id_etudiant, AVG(note) FROM notes WHERE COUNT(*) >= 3 GROUP BY id_etudiant",
        "SELECT id_etudiant, AVG(note) FROM notes GROUP BY id_etudiant HAVING COUNT(*) >= 3",
        "SELECT id_etudiant, AVG(note) FROM notes HAVING COUNT(*) >= 3",
        "SELECT id_etudiant, AVG(note) FROM notes GROUP BY id_etudiant WHERE nb >= 3",
      ],
      answer:
        "SELECT id_etudiant, AVG(note) FROM notes GROUP BY id_etudiant HAVING COUNT(*) >= 3",
      explanation:
        "COUNT(*) est une agrégation — elle ne peut pas être dans WHERE. HAVING filtre les groupes après GROUP BY et COUNT. Sans GROUP BY, HAVING ne sait pas sur quels groupes appliquer la condition.",
    },
    {
      question:
        "[LEFT JOIN pratique] Quelle requête liste TOUS les cours avec le nombre d'inscrits, y compris les cours sans aucun étudiant (afficher 0) ?",
      options: [
        "SELECT c.nom_cours, COUNT(*) FROM cours c INNER JOIN inscriptions i ON c.id = i.id_cours GROUP BY c.id",
        "SELECT c.nom_cours, COUNT(i.id_etudiant) FROM cours c LEFT JOIN inscriptions i ON c.id = i.id_cours GROUP BY c.id",
        "SELECT c.nom_cours, COUNT(i.id_etudiant) FROM inscriptions i RIGHT JOIN cours c ON c.id = i.id_cours",
        "SELECT c.nom_cours, COUNT(*) FROM cours c LEFT JOIN inscriptions i ON c.id = i.id_cours",
      ],
      answer:
        "SELECT c.nom_cours, COUNT(i.id_etudiant) FROM cours c LEFT JOIN inscriptions i ON c.id = i.id_cours GROUP BY c.id",
      explanation:
        "LEFT JOIN garde tous les cours même sans inscription. COUNT(i.id_etudiant) retourne 0 quand i.id_etudiant est NULL (cours sans inscrits). COUNT(*) compterait 1 même sans inscrits car la ligne du cours existe. GROUP BY c.id regroupe par cours.",
    },
  ],
  avance: [
    {
      question:
        "[Sous-requête IN] Quelle requête affiche les noms des étudiants dont la moyenne générale est inférieure à 10 ?",
      options: [
        "SELECT nom FROM etudiants WHERE AVG(note) < 10",
        "SELECT nom FROM etudiants WHERE id IN (SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 10)",
        "SELECT nom FROM etudiants JOIN notes ON id = id_etudiant HAVING AVG(note) < 10",
        "SELECT nom FROM etudiants WHERE id = (SELECT id_etudiant FROM notes WHERE AVG(note) < 10)",
      ],
      answer:
        "SELECT nom FROM etudiants WHERE id IN (SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 10)",
      explanation:
        "La sous-requête calcule les IDs des étudiants avec moyenne < 10 via GROUP BY + HAVING. La requête externe récupère les noms avec IN. AVG() ne peut pas être dans WHERE directement. La sous-requête scalaire avec = ne fonctionnerait que si elle retourne une seule valeur.",
    },
    {
      question:
        "[UPDATE sous-requête] Compléter l'UPDATE qui augmente de 2 points toutes les notes des étudiants ayant une moyenne < 8 :\n`UPDATE notes SET note = note + 2 WHERE id_etudiant IN (___)`",
      options: [
        "SELECT id_etudiant FROM notes WHERE AVG(note) < 8",
        "SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 8",
        "SELECT id FROM etudiants WHERE note < 8",
        "SELECT id_etudiant FROM notes HAVING note < 8 GROUP BY id_etudiant",
      ],
      answer:
        "SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 8",
      explanation:
        "La sous-requête doit retourner la liste des id_etudiant dont la moyenne est < 8. Elle nécessite GROUP BY pour regrouper par étudiant puis HAVING pour filtrer sur la moyenne calculée. Sans GROUP BY, AVG() calculerait la moyenne de toutes les notes et HAVING ne s'appliquerait pas par étudiant.",
    },
    {
      question:
        "[EXISTS vs IN] Quelle requête est plus correcte pour afficher les étudiants inscrits à au moins un cours, en évitant les problèmes avec NULL ?",
      options: [
        "SELECT nom FROM etudiants WHERE id IN (SELECT id_etudiant FROM inscriptions)",
        "SELECT nom FROM etudiants e WHERE EXISTS (SELECT 1 FROM inscriptions i WHERE i.id_etudiant = e.id)",
        "SELECT nom FROM etudiants WHERE id NOT IN (SELECT id_etudiant FROM inscriptions WHERE id_etudiant IS NULL)",
        "SELECT nom FROM etudiants e JOIN inscriptions i ON e.id = i.id_etudiant",
      ],
      answer:
        "SELECT nom FROM etudiants e WHERE EXISTS (SELECT 1 FROM inscriptions i WHERE i.id_etudiant = e.id)",
      explanation:
        "EXISTS est plus robuste que IN face aux NULL : si la sous-requête IN contient un NULL, NOT IN retourne vide. EXISTS vérifie uniquement l'existence d'au moins une ligne — SELECT 1 est une convention (le contenu n'importe pas). EXISTS est souvent plus performant sur grandes tables car il s'arrête dès le premier résultat.",
    },
    {
      question:
        "[CTE pratique] Compléter le CTE qui affiche les étudiants de plus de 21 ans avec leurs notes en Physique > 14 :\n`WITH ___ AS (SELECT * FROM etudiants WHERE age >= 21)\nSELECT m.nom, n.note FROM ___ m JOIN notes n ON m.id = n.id_etudiant WHERE n.matiere = 'Physique' AND n.note > 14`",
      options: [
        "etudiants_view / etudiants_view",
        "majeurs / majeurs",
        "tmp / etudiants",
        "sub / sub_query",
      ],
      answer: "majeurs / majeurs",
      explanation:
        "Le nom du CTE (ici 'majeurs') est défini après WITH et réutilisé dans la requête principale comme s'il s'agissait d'une table. Le même nom doit être utilisé dans la définition et dans la référence. Le CTE évite de répéter la sous-requête et améliore la lisibilité.",
    },
    {
      question:
        "[VIEW pratique] Quelle instruction crée une vue qui affiche le nom, prénom et la moyenne générale de chaque étudiant ?",
      options: [
        "SAVE VIEW vue_moyennes AS SELECT e.nom, e.prenom, AVG(n.note) FROM etudiants e JOIN notes n ON e.id = n.id_etudiant",
        "CREATE VIEW vue_moyennes AS SELECT e.nom, e.prenom, ROUND(AVG(n.note),2) AS moyenne FROM etudiants e JOIN notes n ON e.id = n.id_etudiant GROUP BY e.id, e.nom, e.prenom",
        "CREATE VIEW vue_moyennes SELECT e.nom, AVG(n.note) FROM etudiants e JOIN notes n GROUP BY e.id",
        "CREATE TABLE vue_moyennes AS SELECT e.nom, AVG(n.note) AS moyenne FROM etudiants e JOIN notes n ON e.id = n.id_etudiant GROUP BY e.id",
      ],
      answer:
        "CREATE VIEW vue_moyennes AS SELECT e.nom, e.prenom, ROUND(AVG(n.note),2) AS moyenne FROM etudiants e JOIN notes n ON e.id = n.id_etudiant GROUP BY e.id, e.nom, e.prenom",
      explanation:
        "CREATE VIEW nécessite le mot-clé AS. Les colonnes non-agrégées (nom, prenom) doivent être dans GROUP BY. ROUND(AVG(),2) arrondit proprement. CREATE TABLE créerait une vraie table avec une copie statique des données — pas une vue dynamique.",
    },
    {
      question:
        "[Sous-requête corrélée] Quelle requête affiche chaque étudiant avec sa note la plus haute, sans utiliser MAX() directement dans le SELECT principal ?",
      options: [
        "SELECT e.nom, MAX(n.note) FROM etudiants e JOIN notes n ON e.id = n.id_etudiant GROUP BY e.id",
        "SELECT e.nom, (SELECT MAX(note) FROM notes WHERE id_etudiant = e.id) AS meilleure_note FROM etudiants e",
        "SELECT e.nom, n.note FROM etudiants e JOIN notes n ON e.id = n.id_etudiant WHERE n.note = MAX(n.note)",
        "SELECT e.nom, MAX(note) FROM etudiants e, notes n WHERE e.id = n.id_etudiant",
      ],
      answer:
        "SELECT e.nom, (SELECT MAX(note) FROM notes WHERE id_etudiant = e.id) AS meilleure_note FROM etudiants e",
      explanation:
        "C'est une sous-requête corrélée scalaire : elle est recalculée pour chaque ligne de la requête externe, en utilisant e.id de la requête externe. Elle retourne une seule valeur (MAX) pour chaque étudiant. L'alternative avec GROUP BY est plus performante sur grandes tables.",
    },
    {
      question:
        "[CASE WHEN agrégation] Quelle requête affiche une colonne 'nb_admis' (note >= 10) et 'nb_ajournes' (note < 10) pour chaque matière ?",
      options: [
        "SELECT matiere, COUNT(CASE WHEN note >= 10 THEN 1 END) AS nb_admis, COUNT(CASE WHEN note < 10 THEN 1 END) AS nb_ajournes FROM notes GROUP BY matiere",
        "SELECT matiere, COUNT(*) WHERE note >= 10 AS nb_admis FROM notes GROUP BY matiere",
        "SELECT matiere, SUM(note >= 10) AS nb_admis, SUM(note < 10) AS nb_ajournes FROM notes",
        "SELECT matiere, COUNT(note >= 10) AS nb_admis, COUNT(note < 10) AS nb_ajournes FROM notes GROUP BY matiere",
      ],
      answer:
        "SELECT matiere, COUNT(CASE WHEN note >= 10 THEN 1 END) AS nb_admis, COUNT(CASE WHEN note < 10 THEN 1 END) AS nb_ajournes FROM notes GROUP BY matiere",
      explanation:
        "COUNT(CASE WHEN condition THEN 1 END) est le pattern standard : CASE retourne 1 si vrai, NULL sinon — et COUNT ignore les NULL. SUM(condition booléenne) fonctionne en MySQL mais pas en SQL standard. COUNT(note >= 10) compterait toutes les valeurs non-NULL sans filtrer.",
    },
    {
      question:
        "[Anti-pattern GROUP BY] Quel est le problème dans cette requête ?\n`SELECT nom, matiere, AVG(note) FROM notes GROUP BY nom`",
      options: [
        "AVG ne peut pas s'utiliser avec GROUP BY",
        "La colonne 'matiere' n'est pas dans GROUP BY ni dans une agrégation — résultat non déterministe",
        "Il faut utiliser COUNT au lieu de AVG",
        "GROUP BY doit venir avant le SELECT",
      ],
      answer:
        "La colonne 'matiere' n'est pas dans GROUP BY ni dans une agrégation — résultat non déterministe",
      explanation:
        "En mode SQL strict (ONLY_FULL_GROUP_BY de MySQL 5.7+), toute colonne dans SELECT sans agrégat doit être dans GROUP BY. 'matiere' peut avoir plusieurs valeurs pour un même étudiant — MySQL choisirait arbitrairement. Solution : GROUP BY nom, matiere pour un résultat déterministe.",
    },
  ],
  expert: [
    {
      question:
        "[ROW_NUMBER pratique] Quelle requête affiche les 2 meilleures notes par matière avec le nom de l'étudiant ?",
      options: [
        "SELECT matiere, note FROM notes ORDER BY note DESC LIMIT 2",
        "WITH ranked AS (SELECT n.matiere, e.nom, n.note, ROW_NUMBER() OVER (PARTITION BY n.matiere ORDER BY n.note DESC) AS rn FROM notes n JOIN etudiants e ON n.id_etudiant = e.id) SELECT matiere, nom, note FROM ranked WHERE rn <= 2",
        "SELECT matiere, nom, note FROM notes JOIN etudiants ON id_etudiant = id GROUP BY matiere HAVING RANK() <= 2",
        "SELECT matiere, MAX(note), MIN(note) FROM notes GROUP BY matiere",
      ],
      answer:
        "WITH ranked AS (SELECT n.matiere, e.nom, n.note, ROW_NUMBER() OVER (PARTITION BY n.matiere ORDER BY n.note DESC) AS rn FROM notes n JOIN etudiants e ON n.id_etudiant = e.id) SELECT matiere, nom, note FROM ranked WHERE rn <= 2",
      explanation:
        "ROW_NUMBER() OVER (PARTITION BY matiere ORDER BY note DESC) numérote les notes au sein de chaque matière. Le CTE stocke le résultat avec la numérotation. Le WHERE rn <= 2 final filtre les 2 meilleures. ROW_NUMBER ne peut pas être dans WHERE directement — d'où le CTE obligatoire.",
    },
    {
      question:
        "[RANK vs DENSE_RANK] Notes : 18, 18, 15, 12. Quels rangs RANK() et DENSE_RANK() donnent-ils respectivement ?",
      options: [
        "RANK = 1,1,2,3 — DENSE_RANK = 1,1,2,3",
        "RANK = 1,2,3,4 — DENSE_RANK = 1,1,2,3",
        "RANK = 1,1,3,4 — DENSE_RANK = 1,1,2,3",
        "RANK = 1,1,2,3 — DENSE_RANK = 1,1,3,4",
      ],
      answer: "RANK = 1,1,3,4 — DENSE_RANK = 1,1,2,3",
      explanation:
        "RANK() : les deux 18 partagent le rang 1, le rang 2 est sauté, 15 = rang 3, 12 = rang 4. DENSE_RANK() : les deux 18 partagent le rang 1, 15 = rang 2 (pas de saut), 12 = rang 3. ROW_NUMBER() donnerait 1,2,3,4 sans égalités. Question classique d'entretien SQL.",
    },
    {
      question:
        "[LAG pratique] Quelle requête calcule la progression de note entre deux examens pour chaque étudiant en Maths, triée par date ?",
      options: [
        "SELECT id_etudiant, note - AVG(note) OVER (PARTITION BY id_etudiant) AS progression FROM notes WHERE matiere = 'Maths'",
        "SELECT id_etudiant, date_examen, note, note - LAG(note) OVER (PARTITION BY id_etudiant ORDER BY date_examen) AS progression FROM notes WHERE matiere = 'Maths'",
        "SELECT id_etudiant, note - LEAD(note) OVER (PARTITION BY id_etudiant ORDER BY date_examen) AS progression FROM notes WHERE matiere = 'Maths'",
        "SELECT id_etudiant, LAG(note) - note OVER (ORDER BY date_examen) AS progression FROM notes WHERE matiere = 'Maths'",
      ],
      answer:
        "SELECT id_etudiant, date_examen, note, note - LAG(note) OVER (PARTITION BY id_etudiant ORDER BY date_examen) AS progression FROM notes WHERE matiere = 'Maths'",
      explanation:
        "LAG(note) accède à la note de l'examen précédent. note - LAG(note) calcule la progression (positif = amélioration). PARTITION BY id_etudiant garantit que LAG reste dans le même étudiant. LEAD regarderait vers l'examen suivant — pas vers le précédent.",
    },
    {
      question:
        "[NOT EXISTS entretien] Quelle requête affiche les étudiants qui ne sont inscrits à AUCUN cours, en utilisant NOT EXISTS ?",
      options: [
        "SELECT nom FROM etudiants WHERE id NOT IN (SELECT id_etudiant FROM inscriptions)",
        "SELECT nom FROM etudiants e WHERE NOT EXISTS (SELECT 1 FROM inscriptions i WHERE i.id_etudiant = e.id)",
        "SELECT nom FROM etudiants e LEFT JOIN inscriptions i ON e.id = i.id_etudiant WHERE i.id IS NULL",
        "SELECT nom FROM etudiants WHERE id IN (SELECT id FROM etudiants EXCEPT SELECT id_etudiant FROM inscriptions)",
      ],
      answer:
        "SELECT nom FROM etudiants e WHERE NOT EXISTS (SELECT 1 FROM inscriptions i WHERE i.id_etudiant = e.id)",
      explanation:
        "NOT EXISTS est la solution la plus robuste : si inscriptions.id_etudiant peut contenir des NULL, NOT IN retournerait toujours vide (règle des trois valeurs SQL). NOT EXISTS vérifie l'absence de lignes sans être affecté par les NULL. Les trois options sont sémantiquement équivalentes mais NOT EXISTS est préféré en entretien.",
    },
    {
      question:
        "[CTE chaîné avancé] Quelle requête utilise deux CTEs pour : 1) calculer la moyenne par étudiant, 2) afficher uniquement ceux au-dessus de la moyenne générale ?",
      options: [
        "WITH moy_etu AS (SELECT id_etudiant, AVG(note) AS moyenne FROM notes GROUP BY id_etudiant), moy_gen AS (SELECT AVG(note) AS moy_globale FROM notes) SELECT e.nom, m.moyenne FROM moy_etu m JOIN etudiants e ON m.id_etudiant = e.id, moy_gen WHERE m.moyenne > moy_gen.moy_globale",
        "WITH moy_etu AS (SELECT id_etudiant, AVG(note) AS moyenne FROM notes GROUP BY id_etudiant) SELECT nom FROM etudiants WHERE moyenne > (SELECT AVG(note) FROM notes)",
        "SELECT nom FROM etudiants WHERE AVG(note) > (SELECT AVG(note) FROM notes) GROUP BY id",
        "WITH moy AS (SELECT AVG(note) FROM notes) SELECT nom FROM etudiants WHERE note > moy",
      ],
      answer:
        "WITH moy_etu AS (SELECT id_etudiant, AVG(note) AS moyenne FROM notes GROUP BY id_etudiant), moy_gen AS (SELECT AVG(note) AS moy_globale FROM notes) SELECT e.nom, m.moyenne FROM moy_etu m JOIN etudiants e ON m.id_etudiant = e.id, moy_gen WHERE m.moyenne > moy_gen.moy_globale",
      explanation:
        "Deux CTEs séparés par une virgule : moy_etu calcule la moyenne par étudiant, moy_gen calcule la moyenne globale. La requête principale les joint et filtre. La virgule entre les CTEs permet de les chaîner. Le JOIN sans ON sur moy_gen (qui retourne 1 ligne) effectue un produit cartésien d'une ligne — technique valide ici.",
    },
    {
      question:
        "[Fonction stockée] Compléter la fonction qui retourne la moyenne d'un étudiant donné par son ID :\n`DELIMITER $$\nCREATE FUNCTION get_moyenne(p_id INT) RETURNS DECIMAL(5,2)\nBEGIN\n  DECLARE moy DECIMAL(5,2);\n  ___ INTO moy FROM notes WHERE id_etudiant = p_id;\n  RETURN moy;\nEND$$`",
      options: [
        "SELECT AVG(note)",
        "SELECT ROUND(AVG(note), 2)",
        "GET AVG(note)",
        "COMPUTE ROUND(AVG(note),2)",
      ],
      answer: "SELECT ROUND(AVG(note), 2)",
      explanation:
        "Dans une fonction stockée MySQL, SELECT ... INTO variable assigne le résultat à la variable déclarée. ROUND(AVG(note), 2) arrondit à 2 décimales pour correspondre au type DECIMAL(5,2). DELIMITER $$ est nécessaire pour que MySQL n'interprète pas le ; interne comme fin de commande.",
    },
    {
      question:
        "[Optimisation EXPLAIN] EXPLAIN sur une requête montre type=ALL sur la table notes avec 50 000 lignes. Quelle action est la plus appropriée ?",
      options: [
        "Réécrire la requête en CTE pour améliorer la performance",
        "Analyser quelle colonne est utilisée dans le WHERE/JOIN puis créer un index ciblé avec CREATE INDEX",
        "Ajouter LIMIT 1000 pour réduire les lignes retournées",
        "Utiliser SELECT * au lieu de colonnes précises pour réduire le parsing",
      ],
      answer:
        "Analyser quelle colonne est utilisée dans le WHERE/JOIN puis créer un index ciblé avec CREATE INDEX",
      explanation:
        "type=ALL = full table scan = toutes les 50 000 lignes parcourues. Solution : CREATE INDEX idx_matiere ON notes(matiere) si le WHERE filtre sur matiere. EXPLAIN montrera ensuite type=ref ou range. Un CTE n'améliore pas les performances d'accès aux données. LIMIT aide à afficher moins de résultats mais ne change pas le scan interne.",
    },
    {
      question:
        "[Entretien SQL — cas réel] Quelle requête affiche pour chaque étudiant son nom, sa meilleure note, et le rang de cette note parmi TOUS les étudiants (1 = meilleure) ?",
      options: [
        "SELECT e.nom, MAX(n.note) AS meilleure, RANK() OVER (ORDER BY MAX(n.note) DESC) AS rang FROM notes n JOIN etudiants e ON n.id_etudiant = e.id GROUP BY e.id, e.nom",
        "SELECT e.nom, n.note, ROW_NUMBER() OVER (ORDER BY n.note DESC) AS rang FROM notes n JOIN etudiants e ON n.id_etudiant = e.id",
        "SELECT nom, MAX(note) AS meilleure FROM etudiants JOIN notes ON id = id_etudiant GROUP BY id ORDER BY meilleure DESC",
        "SELECT e.nom, MAX(n.note) AS meilleure, DENSE_RANK() OVER (ORDER BY note DESC) FROM etudiants e JOIN notes n ON e.id = n.id_etudiant",
      ],
      answer:
        "SELECT e.nom, MAX(n.note) AS meilleure, RANK() OVER (ORDER BY MAX(n.note) DESC) AS rang FROM notes n JOIN etudiants e ON n.id_etudiant = e.id GROUP BY e.id, e.nom",
      explanation:
        "GROUP BY calcule d'abord MAX(note) par étudiant. RANK() OVER (ORDER BY MAX(note) DESC) classe ensuite les étudiants par leur meilleure note. Les fonctions analytiques s'appliquent APRÈS GROUP BY — c'est un cas avancé d'entretien. Sans GROUP BY, ROW_NUMBER rangerait chaque ligne de note individuelle, pas par étudiant.",
    },
  ],
};


const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${idx}`} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${keyPrefix}-${idx}`} style={{
          display: 'inline',
          backgroundColor: '#eef2f7',
          padding: '1px 5px',
          borderRadius: '3px',
          fontFamily: 'monospace',
          color: '#e01e5a',
          fontWeight: 'bold',
          fontSize: '13px'
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${idx}`} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;
  let cleanText = text
    .replace(/\r?\n- /g, " ◆ ")
    .replace(/\r?\n• /g, " ◆ ")
    .replace(/\r?\n/g, " ")
    .replace(/\.-\s*\*\*/g, " ◆ **")
    .replace(/-\s*\*\*/g, " ◆ **");

  if (cleanText.startsWith(" ◆ ")) cleanText = cleanText.substring(3);
  if (cleanText.startsWith("- ")) cleanText = cleanText.substring(2);

  const segments = cleanText.split(" ◆ ");

  return (
    <span style={{ display: 'block', lineHeight: '1.7' }}>
      {segments.map((segment, segIdx) => (
        <span key={segIdx} style={{ display: 'block', marginBottom: segIdx < segments.length - 1 ? '6px' : '0' }}>
          {segIdx > 0 && (
            <span style={{ color: '#1a73e8', fontWeight: 'bold', marginRight: '5px' }}>◆</span>
          )}
          {renderInlineTokens(segment, `seg-${segIdx}`)}
        </span>
      ))}
    </span>
  );
};

const Timer = ({ timeLeft }) => <p className="timer">⏳ <span>{timeLeft}s</span></p>;

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {String.fromCharCode(65 + index)}. {option}
        </button>
      ))}
    </div>
  </div>
);

const Flashcard = ({ slide }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a73e8', margin: '0 0 10px 0' }}>{slide.question}</p>
    <div style={{ padding: '12px 15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1a73e8', textAlign: 'left' }}>
      {renderFormattedText(slide.answer)}
    </div>
  </div>
);

const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance + scores.expert;
  const totalQuestions = questions.moyen.length + questions.avance.length + questions.expert.length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length} | ✅ Expert : {scores.expert}/{questions.expert.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6)
        ? <h3 className="success">🚀 Excellent ! Backend development maîtrisé.</h3>
        : <p className="fail">📚 Révisez les concepts backend fondamentaux et avancés.</p>
      }
    </div>
  );
};

const BackendInterviewQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(25);
      setMessage("");
    } else {
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen");
          setCurrentQuestion(0);
          setTimeLeft(25);
          return 0;
        });
      }, 20000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    const current = questions[level][currentQuestion];
    if (option === current.answer) {
      setScores(p => ({ ...p, [level]: p[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            Backend Interview 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`
            }
          </h4>
          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default BackendInterviewQCM;
