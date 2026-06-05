// src/projects/sql/Page_SQL.js
import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — SQL : Du DDL au CTE",
    answer:
      "◆ **Niveau 1** : DCL, DDL, DML, DQL — les 4 familles SQL ◆ **Niveau 2** : SELECT, WHERE, ORDER BY, GROUP BY, COUNT, AVG, ROUND, UPDATE ◆ **Niveau 3** : CREATE TABLE, clés primaires/étrangères, INNER JOIN, LEFT JOIN ◆ **Niveau 4** : Sous-requêtes, Vues (VIEW), Fonctions stockées, CTE (WITH...AS), Index, Triggers, Procédures stockées",
  },
  {
    question: "Les 4 familles SQL : DDL, DML, DQL, DCL",
    answer:
      "◆ **DDL** (Data Definition Language) : définit la structure — `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE` ◆ **DML** (Data Manipulation Language) : modifie les données — `INSERT`, `UPDATE`, `DELETE` ◆ **DQL** (Data Query Language) : interroge les données — `SELECT` ◆ **DCL** (Data Control Language) : gère les droits — `GRANT`, `REVOKE` ◆ Exemple BDD étudiants : DDL crée la table `etudiants`, DML insère Jean Dupont, DQL liste les étudiants en Licence ⚠️ UPDATE est DML, pas DDL — il modifie des lignes, pas la structure",
  },
  {
    question: "SELECT et WHERE — Filtrer les données",
    answer:
      "◆ **SELECT** : choisit les colonnes à afficher — `SELECT e.nom, e.prenom FROM etudiants e` ◆ **WHERE** : filtre les lignes selon une condition — `WHERE niveau = 'Licence'` ◆ Mécanisme : le moteur SQL évalue chaque ligne, ne retourne que celles où la condition est vraie ◆ Exemple : `SELECT * FROM etudiants WHERE age > 22` retourne tous les étudiants majeurs ⚠️ WHERE s'applique AVANT le GROUP BY — utiliser HAVING pour filtrer après agrégation",
  },
  {
    question: "ORDER BY, GROUP BY — Trier et regrouper",
    answer:
      "◆ **ORDER BY** : trie les résultats — `ORDER BY age DESC` pour décroissant, `ASC` par défaut ◆ **GROUP BY** : regroupe les lignes partageant une même valeur pour appliquer une fonction d'agrégation ◆ Mécanisme : GROUP BY crée des 'buckets' de lignes, puis COUNT/AVG/SUM opèrent sur chaque bucket ◆ Exemple : `SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau` — compte par niveau ⚠️ Toute colonne dans SELECT sans agrégat doit être dans GROUP BY",
  },
  {
    question: "COUNT(), AVG(), ROUND() — Fonctions d'agrégation",
    answer:
      "◆ **COUNT(*)** : compte toutes les lignes, y compris NULL — **COUNT(col)** ignore les NULL ◆ **AVG(col)** : calcule la moyenne des valeurs non-NULL d'une colonne ◆ **ROUND(valeur, décimales)** : arrondit — `ROUND(AVG(note), 2)` arrondit à 2 décimales ◆ Exemple : `ROUND(AVG(CASE WHEN matiere='Maths' THEN note END), 2) AS moyenne_maths` — moyenne Maths par étudiant ⚠️ AVG(note) et ROUND(AVG(note),0) peuvent différer — ROUND arrondit après le calcul de la moyenne",
  },
  {
    question: "UPDATE — Modifier des données existantes",
    answer:
      "◆ **UPDATE** modifie des lignes existantes : `UPDATE notes SET note = note + 1 WHERE id_etudiant IN (...)` ◆ Mécanisme : identifie les lignes via WHERE, applique SET, valide la transaction ◆ Contexte : mettre à jour les notes des étudiants dont la moyenne est < 13 (sous-requête dans WHERE) ◆ Exemple exercice : `UPDATE notes SET note = note + 1 WHERE id_etudiant IN (SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 13)` ⚠️ Sans clause WHERE, UPDATE modifie TOUTES les lignes de la table",
  },
  {
    question: "CREATE TABLE, Clés primaires et étrangères",
    answer:
      "◆ **CREATE TABLE** définit la structure : colonnes, types, contraintes ◆ **PRIMARY KEY** : identifiant unique d'une ligne, souvent `INT AUTO_INCREMENT` ◆ **FOREIGN KEY** : lien vers la PRIMARY KEY d'une autre table — garantit l'intégrité référentielle ◆ Exemple : `FOREIGN KEY (id_etudiant) REFERENCES etudiants(id)` dans la table `inscriptions` ◆ Problème résolu : impossible d'inscrire un étudiant qui n'existe pas ⚠️ L'ordre de création compte — créer la table parent avant la table enfant",
  },
  {
    question: "INNER JOIN et LEFT JOIN — Jointures",
    answer:
      "◆ **INNER JOIN** : retourne uniquement les lignes qui ont une correspondance dans les deux tables ◆ **LEFT JOIN** : retourne TOUTES les lignes de la table gauche, avec NULL si pas de correspondance à droite ◆ Exemple INNER : liste des étudiants inscrits avec leur cours — exclut les non-inscrits ◆ Exemple LEFT : tous les cours avec nb d'inscrits — les cours sans étudiant apparaissent avec 0 ⚠️ `LEFT JOIN` + `WHERE right_table.col IS NULL` = étudiants sans cours (anti-jointure)",
  },
  {
    question: "Sous-requêtes — Requêtes imbriquées",
    answer:
      "◆ Une **sous-requête** est un SELECT dans un autre SELECT, WHERE, ou FROM ◆ Types : scalaire (retourne 1 valeur), en liste (retourne plusieurs valeurs pour IN), corrélée (référence la requête externe) ◆ Exemple : `WHERE id_etudiant IN (SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 13)` ◆ Problème résolu : filtrer sur une agrégation calculée dynamiquement ⚠️ Une sous-requête corrélée est recalculée pour chaque ligne — peut être lente sur grandes tables",
  },
  {
    question: "VIEW — Vues SQL",
    answer:
      "◆ Une **VIEW** est une requête sauvegardée sous un nom, interrogeable comme une table ◆ Mécanisme : `CREATE VIEW etudiants_majeurs AS SELECT * FROM etudiants WHERE age > 22` ◆ Avantages : simplification des requêtes complexes, sécurité (cacher certaines colonnes), réutilisabilité ◆ Exemple : `SELECT * FROM etudiants_majeurs` — cache la complexité du filtre ⚠️ Une vue simple ne stocke pas les données — elle est recalculée à chaque appel (sauf MATERIALIZED VIEW)",
  },
  {
    question: "Fonctions stockées — FUNCTION et DELIMITER",
    answer:
      "◆ Une **fonction stockée** est du code SQL réutilisable qui retourne une valeur ◆ Syntaxe : `DELIMITER $$ ... CREATE FUNCTION nb_etudiants() RETURNS INT BEGIN ... RETURN total; END$$ DELIMITER ;` ◆ `DELIMITER $$` évite que MySQL interprète le `;` interne comme fin de requête ◆ Appel : `SELECT nb_etudiants();` — retourne le COUNT(*) de la table etudiants ⚠️ FUNCTION retourne une valeur, PROCEDURE ne retourne rien (utilise OUT) — ne pas confondre",
  },
  {
    question: "CTE — Common Table Expression (WITH ... AS)",
    answer:
      "◆ Un **CTE** est une table temporaire nommée, définie avec `WITH nom AS (SELECT ...)` ◆ Mécanisme : le CTE est calculé une fois, puis référencé dans la requête principale ◆ Exemple : `WITH majeurs AS (SELECT * FROM etudiants WHERE age >= 21) SELECT m.nom, n.note FROM majeurs m JOIN notes n ON m.id = n.id_etudiant WHERE n.matiere = 'Physique' AND n.note > 14` ◆ Avantage sur sous-requête : lisibilité, réutilisabilité dans la même requête ⚠️ Un CTE n'est visible QUE dans la requête qui le suit — pas réutilisable dans une autre requête",
  },
  {
    question: "Index, Triggers, Procédures stockées — Niveau avancé",
    answer:
      "◆ **Index** : structure qui accélère les recherches — `CREATE INDEX idx_matiere ON notes(matiere)` — évite le full scan ◆ **Trigger** : code SQL exécuté automatiquement avant/après INSERT/UPDATE/DELETE ◆ **Procédure stockée** : bloc de code SQL avec paramètres IN/OUT, exécuté avec `CALL` — ne retourne pas de valeur contrairement à FUNCTION ◆ Cas d'usage : trigger pour journaliser les modifications, procédure pour inscrire un étudiant en validant les prérequis ⚠️ Trop d'index ralentissent les INSERT/UPDATE — choisir les colonnes de filtrage et jointure",
  },
  {
  question: "Questions pièges — DDL, DML, DQL, DCL",
  answer:
    "◆ `ALTER TABLE` appartient au **DDL** car il modifie la structure d'une table ◆ `DROP TABLE` appartient également au **DDL** car il supprime la structure entière ◆ `UPDATE` appartient au **DML** car il modifie les données et non la structure ◆ `SELECT` appartient au **DQL** car il interroge les données ◆ `GRANT` et `REVOKE` appartiennent au **DCL** car ils gèrent les permissions ⚠️ Piège classique : UPDATE modifie quelque chose mais reste du DML, pas du DDL",
},
{
  question: "DELETE vs DROP vs TRUNCATE",
  answer:
    "◆ `DELETE` supprime les lignes une par une et peut utiliser un WHERE ◆ `TRUNCATE` supprime toutes les lignes d'une table sans WHERE et plus rapidement qu'un DELETE massif ◆ `DROP TABLE` supprime complètement la table et sa structure ◆ DELETE = données uniquement ◆ TRUNCATE = vidage complet ◆ DROP = destruction de l'objet ⚠️ DROP ne peut pas être annulé aussi facilement qu'un DELETE transactionnel",
},
{
  question: "WHERE ou HAVING ?",
  answer:
    "◆ `WHERE` filtre les lignes AVANT un GROUP BY ◆ `HAVING` filtre les groupes APRÈS un GROUP BY ◆ Exemple : `WHERE note > 10` élimine certaines lignes avant calcul ◆ `HAVING AVG(note) > 12` élimine certains groupes après calcul ◆ WHERE travaille sur les données brutes ◆ HAVING travaille sur le résultat agrégé ⚠️ `WHERE AVG(note) > 12` provoque une erreur SQL",
},
{
  question: "GROUP BY ou PARTITION BY ?",
  answer:
    "◆ `GROUP BY` regroupe les lignes et réduit le nombre de résultats ◆ `PARTITION BY` crée des groupes analytiques tout en conservant chaque ligne ◆ GROUP BY produit généralement une ligne par groupe ◆ PARTITION BY conserve toutes les lignes originales ◆ Exemple : moyenne par niveau avec GROUP BY retourne 2 lignes, avec PARTITION BY retourne tous les étudiants avec leur moyenne de niveau ⚠️ PARTITION BY n'est pas un remplacement de GROUP BY",
},
{
  question: "INNER JOIN ou LEFT JOIN ?",
  answer:
    "◆ `INNER JOIN` conserve uniquement les correspondances présentes dans les deux tables ◆ `LEFT JOIN` conserve toutes les lignes de la table de gauche même sans correspondance ◆ Si un étudiant n'a aucune inscription, INNER JOIN le supprime du résultat ◆ LEFT JOIN le conserve avec des valeurs NULL à droite ⚠️ Beaucoup de bugs métier proviennent d'un INNER JOIN utilisé à la place d'un LEFT JOIN",
},
{
  question: "Function ou Procedure ?",
  answer:
    "◆ Une FUNCTION retourne obligatoirement une valeur via RETURN ◆ Une PROCEDURE exécute un traitement complet et peut utiliser des paramètres IN, OUT ou INOUT ◆ Une fonction peut souvent être utilisée dans un SELECT ◆ Une procédure s'appelle avec CALL ◆ Exemple : `SELECT calcul_taxe()` pour une fonction ◆ `CALL inscrire_etudiant()` pour une procédure ⚠️ Une FUNCTION n'est pas simplement une petite PROCEDURE",
},
{
  question: "CTE, Vue ou Sous-requête ?",
  answer:
    "◆ Une sous-requête existe uniquement à l'endroit où elle est écrite ◆ Un CTE (`WITH ... AS`) existe uniquement pendant l'exécution de la requête qui suit ◆ Une VIEW est enregistrée dans la base et réutilisable dans plusieurs requêtes ◆ Le CTE améliore souvent la lisibilité ◆ La vue améliore la réutilisabilité ⚠️ Un CTE n'est pas stocké dans la base contrairement à une VIEW",
},
{
  question: "ROW_NUMBER(), RANK() ou DENSE_RANK() ?",
  answer:
    "◆ `ROW_NUMBER()` attribue toujours un numéro unique ◆ `RANK()` attribue le même rang aux égalités mais saute les positions suivantes ◆ `DENSE_RANK()` attribue le même rang aux égalités sans saut ◆ Exemple : notes 18,18,15 → ROW_NUMBER = 1,2,3 ◆ RANK = 1,1,3 ◆ DENSE_RANK = 1,1,2 ⚠️ Confusion extrêmement fréquente en entretien SQL",
},
{
  question: "LAG() ou LEAD() ?",
  answer:
    "◆ `LAG()` permet d'accéder à la ligne précédente ◆ `LEAD()` permet d'accéder à la ligne suivante ◆ LAG est souvent utilisé pour calculer une variation par rapport à la veille ◆ LEAD est souvent utilisé pour trouver la prochaine échéance ou le prochain événement ◆ Les deux sont des fonctions analytiques utilisant OVER() ⚠️ Beaucoup de candidats inversent systématiquement les deux",
},
{
  question: "Index ou Clé primaire ?",
  answer:
    "◆ Une PRIMARY KEY garantit l'unicité d'une ligne ◆ Un INDEX accélère les recherches ◆ Une clé primaire crée généralement un index automatiquement ◆ Tous les index ne sont pas des clés primaires ◆ Une table peut avoir plusieurs index mais une seule clé primaire ⚠️ Un index n'assure pas forcément l'unicité",
},
{
  question: "EXPLAIN et optimisation SQL",
  answer:
    "◆ `EXPLAIN` permet d'analyser le plan d'exécution d'une requête ◆ Il indique les tables consultées, les index utilisés et le nombre estimé de lignes parcourues ◆ Un `type = ALL` signifie généralement un scan complet de la table ◆ Un `type = ref` ou `range` indique souvent une meilleure utilisation des index ◆ EXPLAIN sert à comprendre pourquoi une requête est lente ⚠️ Une requête correcte fonctionnellement peut être catastrophique en performance",
},
{
  question: "Colonnes indexées et pièges courants",
  answer:
    "◆ Les index sont particulièrement utiles sur les colonnes utilisées dans WHERE, JOIN, ORDER BY et GROUP BY ◆ Les colonnes très peu sélectives profitent moins des index ◆ Les fonctions appliquées sur une colonne indexée peuvent empêcher l'utilisation de l'index ◆ Exemple : `YEAR(date_operation)` empêche souvent l'optimiseur d'utiliser l'index de date ◆ Une réécriture avec un intervalle de dates est généralement préférable ⚠️ Ajouter un index partout dégrade les performances d'INSERT et UPDATE",
},
];

const questions = {
  moyen: [
    {
      question: "[Terme → Définition] Que signifie DDL en SQL ?",
      options: [
        "Data Display Language — commandes d'affichage des données",
        "Data Definition Language — commandes qui définissent la structure de la base (CREATE, ALTER, DROP)",
        "Data Deletion Language — commandes de suppression de données",
        "Data Duplication Language — commandes de réplication",
      ],
      answer:
        "Data Definition Language — commandes qui définissent la structure de la base (CREATE, ALTER, DROP)",
      explanation:
        "DDL définit la structure : CREATE TABLE, ALTER TABLE, DROP TABLE. DML (INSERT, UPDATE, DELETE) modifie les données. Dans notre BDD étudiants, CREATE TABLE etudiants est DDL, INSERT INTO etudiants est DML.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre WHERE et HAVING ?",
      options: [
        "WHERE filtre avant agrégation, HAVING filtre après agrégation",
        "HAVING filtre avant agrégation, WHERE filtre après agrégation",
        "WHERE et HAVING sont interchangeables dans tous les contextes",
        "WHERE s'applique aux colonnes numériques, HAVING aux colonnes texte",
      ],
      answer:
        "WHERE filtre avant agrégation, HAVING filtre après agrégation",
      explanation:
        "WHERE élimine les lignes avant que GROUP BY calcule les agrégats. HAVING filtre les groupes après. Ex : `WHERE note > 10 GROUP BY id_etudiant HAVING AVG(note) < 13` — WHERE écarte d'abord les notes ≤ 10, HAVING filtre ensuite les groupes.",
    },
    {
      question:
        "[Confusion] Quelle commande SQL appartient à DML et non DDL ?",
      options: [
        "CREATE TABLE",
        "ALTER TABLE",
        "UPDATE",
        "DROP TABLE",
      ],
      answer: "UPDATE",
      explanation:
        "UPDATE modifie des lignes existantes → DML. CREATE, ALTER, DROP modifient la structure de la table → DDL. Piège classique : on pense que UPDATE 'définit' quelque chose, mais il manipule des données.",
    },
    {
      question:
        "[Terme → Définition] Que retourne `COUNT(*)` vs `COUNT(colonne)` ?",
      options: [
        "Ils retournent toujours le même résultat",
        "COUNT(*) compte toutes les lignes, COUNT(col) ignore les valeurs NULL",
        "COUNT(*) ignore les doublons, COUNT(col) les compte",
        "COUNT(col) est plus rapide car il ne lit qu'une colonne",
      ],
      answer:
        "COUNT(*) compte toutes les lignes, COUNT(col) ignore les valeurs NULL",
      explanation:
        "COUNT(*) compte chaque ligne quelle que soit la valeur. COUNT(id_cours) ignorerait les étudiants sans cours (NULL). Dans l'exercice LEFT JOIN cours/inscriptions, COUNT(*) et COUNT(i.id_etudiant) donnent des résultats différents.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre INNER JOIN et LEFT JOIN ?",
      options: [
        "INNER JOIN retourne toutes les lignes de la table gauche, LEFT JOIN seulement les correspondances",
        "LEFT JOIN retourne toutes les lignes de la table gauche avec NULL si pas de correspondance, INNER JOIN n'inclut que les correspondances",
        "Ils retournent les mêmes résultats si les tables ont une clé étrangère valide",
        "LEFT JOIN est plus lent car il lit plus de données",
      ],
      answer:
        "LEFT JOIN retourne toutes les lignes de la table gauche avec NULL si pas de correspondance, INNER JOIN n'inclut que les correspondances",
      explanation:
        "INNER JOIN = intersection. LEFT JOIN = table gauche complète. Dans l'exercice 'cours avec nombre d'inscrits', LEFT JOIN est nécessaire pour afficher les cours sans aucun étudiant inscrit (nb_inscrits = 0).",
    },
    {
      question:
        "[Terme → Définition] Qu'est-ce qu'une PRIMARY KEY ?",
      options: [
        "Une colonne dont les valeurs sont toutes différentes mais peuvent être NULL",
        "Un identifiant unique et non NULL qui identifie chaque ligne de la table",
        "La première colonne déclarée dans CREATE TABLE",
        "Une clé qui fait référence à une autre table",
      ],
      answer:
        "Un identifiant unique et non NULL qui identifie chaque ligne de la table",
      explanation:
        "PRIMARY KEY = UNIQUE + NOT NULL. Souvent `id INT AUTO_INCREMENT`. La FOREIGN KEY, elle, référence la PRIMARY KEY d'une autre table. Confondre les deux est une erreur très fréquente.",
    },
    {
      question:
        "[Définition → Terme] Quelle commande trie les résultats par ordre décroissant d'âge ?",
      options: [
        "GROUP BY age DESC",
        "ORDER BY age DESC",
        "SORT BY age DESC",
        "WHERE age DESC",
      ],
      answer: "ORDER BY age DESC",
      explanation:
        "ORDER BY trie les résultats. DESC = décroissant, ASC = croissant (défaut). GROUP BY regroupe pour agrégation, ne trie pas. SORT BY n'existe pas en SQL standard.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre une VIEW et une TABLE ?",
      options: [
        "Une VIEW stocke les données physiquement comme une TABLE",
        "Une VIEW est une requête sauvegardée recalculée à chaque appel, sans stockage physique",
        "Une VIEW est plus rapide qu'une TABLE car elle est indexée automatiquement",
        "Une VIEW peut être modifiée avec INSERT et UPDATE sans restriction",
      ],
      answer:
        "Une VIEW est une requête sauvegardée recalculée à chaque appel, sans stockage physique",
      explanation:
        "Une VIEW simple est un alias de requête : `CREATE VIEW etudiants_majeurs AS SELECT * FROM etudiants WHERE age > 22`. Chaque `SELECT * FROM etudiants_majeurs` réexécute la requête. Les MATERIALIZED VIEWS (PostgreSQL) stockent physiquement, pas MySQL standard.",
    },
    {
      question:
        "[Terme → Définition] À quoi sert ROUND(AVG(note), 2) ?",
      options: [
        "Calcule la moyenne et l'arrondit à l'entier le plus proche",
        "Calcule la moyenne et l'arrondit à 2 décimales",
        "Arrondit chaque note à 2 décimales avant de calculer la moyenne",
        "Retourne les 2 meilleures notes de la liste",
      ],
      answer: "Calcule la moyenne et l'arrondit à 2 décimales",
      explanation:
        "ROUND(valeur, n) arrondit après le calcul. ROUND(AVG(note), 2) = calculer AVG d'abord, puis arrondir. Dans l'exercice pivot, `ROUND(AVG(CASE WHEN matiere='Maths' THEN note END), 2) AS moyenne_maths` affiche la moyenne Maths à 2 décimales.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre DELETE et DROP ?",
      options: [
        "DELETE supprime la table entière, DROP supprime des lignes",
        "DROP supprime la structure de la table, DELETE supprime des lignes (DML)",
        "Ils font la même chose mais DROP est plus rapide",
        "DELETE est DDL, DROP est DML",
      ],
      answer:
        "DROP supprime la structure de la table, DELETE supprime des lignes (DML)",
      explanation:
        "DROP TABLE = DDL, supprime définitivement la table et toutes ses données. DELETE = DML, supprime des lignes (filtrables avec WHERE). DELETE sans WHERE vide la table mais la structure reste. Confondre les deux peut être catastrophique.",
    },
  ],
  avance: [
    {
      question:
        "[Code → Analyse] Quel problème résout ce code ?\n`UPDATE notes SET note = note + 1 WHERE id_etudiant IN (SELECT id_etudiant FROM notes GROUP BY id_etudiant HAVING AVG(note) < 13);`",
      options: [
        "Met à jour toutes les notes à +1 sans condition",
        "Augmente de 1 point les notes des étudiants dont la moyenne globale est inférieure à 13",
        "Augmente de 1 point la note moyenne calculée dans la table",
        "Sélectionne les étudiants avec une moyenne < 13 sans modifier leurs notes",
      ],
      answer:
        "Augmente de 1 point les notes des étudiants dont la moyenne globale est inférieure à 13",
      explanation:
        "La sous-requête `SELECT id_etudiant ... HAVING AVG(note) < 13` identifie les IDs des étudiants en difficulté. UPDATE applique +1 à TOUTES leurs notes (pas seulement la plus basse). C'est un cas classique de DML avec sous-requête corrélée.",
    },
    {
      question:
        "[Anti-pattern] Quel problème y a-t-il dans cette requête ?\n`SELECT nom, matiere, AVG(note) FROM notes GROUP BY nom;`",
      options: [
        "AVG ne peut pas s'utiliser avec GROUP BY",
        "La colonne 'matiere' n'est pas dans GROUP BY ni dans une agrégation — résultat non déterministe",
        "Il faut utiliser COUNT au lieu de AVG",
        "nom doit être dans une fonction d'agrégation",
      ],
      answer:
        "La colonne 'matiere' n'est pas dans GROUP BY ni dans une agrégation — résultat non déterministe",
      explanation:
        "En SQL strict (mode ONLY_FULL_GROUP_BY de MySQL), toute colonne SELECT sans agrégat doit être dans GROUP BY. 'matiere' peut valoir 'Maths' ou 'Physique' pour un même étudiant — MySQL choisit une valeur arbitraire. Ajouter GROUP BY nom, matiere ou utiliser GROUP_CONCAT(matiere).",
    },
    {
      question:
        "[Situation → Outil] Vous devez afficher TOUS les cours avec le nombre d'inscrits, y compris les cours sans aucun étudiant. Quelle jointure utiliser ?",
      options: [
        "INNER JOIN inscriptions ON cours.id = inscriptions.id_cours",
        "LEFT JOIN inscriptions ON cours.id = inscriptions.id_cours, avec COUNT(i.id_etudiant)",
        "RIGHT JOIN inscriptions ON cours.id = inscriptions.id_cours",
        "FULL OUTER JOIN inscriptions ON cours.id = inscriptions.id_cours",
      ],
      answer:
        "LEFT JOIN inscriptions ON cours.id = inscriptions.id_cours, avec COUNT(i.id_etudiant)",
      explanation:
        "LEFT JOIN garde tous les cours. COUNT(i.id_etudiant) retourne 0 pour les cours sans inscrits car il ignore les NULL (contrairement à COUNT(*)). INNER JOIN exclurait les cours vides. FULL OUTER JOIN n'est pas supporté nativement en MySQL.",
    },
    {
      question:
        "[Refactoring] Cette sous-requête est répétée 3 fois dans une requête. Quel outil SQL améliore la lisibilité ?\n`(SELECT * FROM etudiants WHERE age >= 21)`",
      options: [
        "Créer un INDEX sur la colonne age",
        "Utiliser un CTE avec `WITH majeurs AS (SELECT * FROM etudiants WHERE age >= 21)`",
        "Créer une PROCEDURE stockée qui retourne les étudiants majeurs",
        "Utiliser ORDER BY age >= 21",
      ],
      answer:
        "Utiliser un CTE avec `WITH majeurs AS (SELECT * FROM etudiants WHERE age >= 21)`",
      explanation:
        "Le CTE (Common Table Expression) nomme une sous-requête pour la réutiliser dans la même requête principale sans répétition. Une procédure stockée retourne un résultat mais ne se substitue pas à une sous-requête dans un SELECT. L'INDEX accélère mais ne simplifie pas.",
    },
    {
      question:
        "[Situation → Multi-concepts] Pour trouver l'étudiant avec la meilleure note en Maths, quelle combinaison est correcte ?",
      options: [
        "`SELECT MAX(note) FROM notes WHERE matiere='Maths'` suffit",
        "`SELECT e.nom, e.prenom, n.note FROM notes n JOIN etudiants e ON n.id_etudiant=e.id WHERE n.matiere='Maths' ORDER BY n.note DESC LIMIT 1`",
        "`SELECT * FROM etudiants HAVING MAX(note) WHERE matiere='Maths'`",
        "`SELECT nom FROM etudiants WHERE note=(SELECT MAX FROM notes)`",
      ],
      answer:
        "`SELECT e.nom, e.prenom, n.note FROM notes n JOIN etudiants e ON n.id_etudiant=e.id WHERE n.matiere='Maths' ORDER BY n.note DESC LIMIT 1`",
      explanation:
        "Il faut JOIN pour ramener le nom depuis etudiants, WHERE pour filtrer la matière, ORDER BY DESC pour trier, LIMIT 1 pour le premier. MAX(note) seul ne donne pas le nom. HAVING s'utilise avec GROUP BY, pas WHERE.",
    },
    {
      question:
        "[Anti-pattern] Pourquoi ce DELIMITER est-il nécessaire ?\n`DELIMITER $$` avant `CREATE FUNCTION`",
      options: [
        "Il indique que la fonction retourne un entier",
        "Il change le délimiteur de fin d'instruction pour que MySQL n'interprète pas les `;` internes comme fin de la fonction",
        "Il crée un espace de nommage pour la fonction",
        "Il est obligatoire uniquement pour les PROCEDURE, pas les FUNCTION",
      ],
      answer:
        "Il change le délimiteur de fin d'instruction pour que MySQL n'interprète pas les `;` internes comme fin de la fonction",
      explanation:
        "Sans DELIMITER $$, MySQL voit le premier `;` dans le corps de la fonction et pense que la commande est finie, causant une erreur de syntaxe. DELIMITER $$ dit 'la vraie fin est $$'. On remet DELIMITER ; à la fin. C'est spécifique au client MySQL en ligne de commande.",
    },
    {
      question:
        "[Code → Analyse] Que retourne cette requête ?\n`SELECT e.id, e.nom FROM etudiants e LEFT JOIN inscriptions i ON e.id=i.id_etudiant WHERE i.id_cours IS NULL;`",
      options: [
        "Tous les étudiants avec leurs cours",
        "Les étudiants inscrits à au moins un cours",
        "Les étudiants qui ne sont inscrits à aucun cours",
        "Les cours sans aucun étudiant inscrit",
      ],
      answer: "Les étudiants qui ne sont inscrits à aucun cours",
      explanation:
        "C'est l'anti-jointure classique : LEFT JOIN + WHERE colonne_droite IS NULL. LEFT JOIN garde tous les étudiants. Ceux sans cours ont NULL dans i.id_cours. WHERE IS NULL filtre pour ne garder que ceux-là. C'est l'exercice 2 du cours.",
    },
  ],
  expert: [
    {
      question:
        "[Architecture] Vous concevez une BDD pour gérer des étudiants, cours, notes et inscriptions. Dans quel ordre créer les tables ?",
      options: [
        "notes → inscriptions → cours → etudiants",
        "etudiants → cours → inscriptions → notes",
        "inscriptions → etudiants → notes → cours",
        "cours → notes → inscriptions → etudiants",
      ],
      answer: "etudiants → cours → inscriptions → notes",
      explanation:
        "Les FOREIGN KEY exigent que la table parent existe avant la table enfant. `inscriptions` référence `etudiants` et `cours` → créer ces deux en premier. `notes` référence `etudiants` → etudiants avant notes. Inverser l'ordre provoque une erreur 'referenced table does not exist'.",
    },
    {
      question:
        "[Ordre de dépendance] Pour exécuter un UPDATE avec sous-requête HAVING, quels concepts doivent être maîtrisés d'abord ?",
      options: [
        "VIEW et CTE uniquement",
        "SELECT de base uniquement",
        "SELECT, WHERE, GROUP BY, AVG, HAVING, puis sous-requête, puis UPDATE",
        "CREATE TABLE, INSERT, puis UPDATE directement",
      ],
      answer:
        "SELECT, WHERE, GROUP BY, AVG, HAVING, puis sous-requête, puis UPDATE",
      explanation:
        "La sous-requête `SELECT id FROM notes GROUP BY id HAVING AVG(note) < 13` présuppose GROUP BY, AVG et HAVING. UPDATE présuppose DML de base. Introduire UPDATE avec sous-requête sans ces prérequis crée une incompréhension structurelle — c'est pourquoi le cours suit ce chemin précis.",
    },
    {
      question:
        "[Nommage inversé] Quel concept SQL a ces propriétés : exécution automatique, déclenché par un événement DML, invisible à l'appelant, ne retourne pas de valeur ?",
      options: [
        "Une procédure stockée (PROCEDURE)",
        "Une fonction stockée (FUNCTION)",
        "Un trigger",
        "Un index partiel",
      ],
      answer: "Un trigger",
      explanation:
        "Un TRIGGER se déclenche automatiquement sur INSERT/UPDATE/DELETE. Il est invisible pour l'application appelante et n'a pas de valeur de retour. Une PROCEDURE se déclenche avec CALL (explicite). Une FUNCTION retourne une valeur. Utile pour journaliser les modifications de notes.",
    },
    {
      question:
        "[Architecture] Dans quel cas préférer un CTE à une sous-requête imbriquée ?",
      options: [
        "Toujours — le CTE est toujours plus performant",
        "Jamais — les sous-requêtes sont plus portables entre SGBD",
        "Quand la même logique est réutilisée plusieurs fois ou que la requête dépasse 3 niveaux d'imbrication",
        "Uniquement pour les requêtes récursives",
      ],
      answer:
        "Quand la même logique est réutilisée plusieurs fois ou que la requête dépasse 3 niveaux d'imbrication",
      explanation:
        "Le CTE améliore la lisibilité et évite la répétition. Il n'est PAS toujours plus performant — en MySQL 8+, le CTE non-récursif est souvent matérialisé une fois, mais l'optimiseur peut le traiter comme une sous-requête. Les CTEs récursifs (WITH RECURSIVE) traitent les hiérarchies comme les catégories imbriquées.",
    },
    {
      question:
        "[Situation → Multi-concepts] Vous ajoutez un INDEX sur `notes.matiere` mais les INSERT deviennent plus lents. Expliquez le trade-off.",
      options: [
        "L'INDEX est mal configuré — un bon INDEX n'a aucun impact sur INSERT",
        "L'INDEX accélère les SELECT mais ralentit INSERT/UPDATE/DELETE car l'index doit être maintenu à chaque modification",
        "Il faut désactiver l'INDEX avant chaque INSERT et le réactiver après",
        "Ce comportement indique une corruption de la base — reconstruire l'INDEX",
      ],
      answer:
        "L'INDEX accélère les SELECT mais ralentit INSERT/UPDATE/DELETE car l'index doit être maintenu à chaque modification",
      explanation:
        "Un INDEX crée une structure B-tree qui est reconstruite partiellement à chaque modification. Plus d'index = lectures plus rapides, écritures plus lentes. Dans une BDD notes avec de nombreux INSERT quotidiens (nouvelles évaluations), indexer uniquement les colonnes de jointure et filtrage les plus fréquentes.",
    },
    {
      question:
        "[Architecture] Quelle est la différence architecturale fondamentale entre FUNCTION et PROCEDURE en MySQL ?",
      options: [
        "FUNCTION peut utiliser SELECT, PROCEDURE non",
        "FUNCTION retourne une valeur scalaire et s'utilise dans une expression SQL, PROCEDURE ne retourne rien mais peut avoir des paramètres OUT",
        "PROCEDURE est plus rapide car compilée, FUNCTION est interprétée",
        "FUNCTION et PROCEDURE sont identiques, seul le mot-clé diffère",
      ],
      answer:
        "FUNCTION retourne une valeur scalaire et s'utilise dans une expression SQL, PROCEDURE ne retourne rien mais peut avoir des paramètres OUT",
      explanation:
        "FUNCTION : `SELECT nb_etudiants()` dans une requête — retourne un scalaire. PROCEDURE : `CALL inscrire_etudiant(1, 3)` — exécute un bloc avec effets de bord, paramètres OUT pour 'retourner' plusieurs valeurs. Utiliser PROCEDURE pour encapsuler une inscription complète (vérifier prérequis + INSERT).",
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

  const handleNextQuestion = useCallback(() => {
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
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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
    if (message) return;
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