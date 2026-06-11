// src/projects/BackendInterview/BackendInterviewQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "DDL & DCL — Définir et contrôler la structure",
    "answer": "**DDL — Data Definition Language** : définit la structure de la base. ◆ `CREATE TABLE trades (id SERIAL PRIMARY KEY, isin VARCHAR(12) NOT NULL, qty INT, price DECIMAL(15,4), trade_date DATE DEFAULT CURRENT_DATE);` ◆ `ALTER TABLE trades ADD COLUMN desk VARCHAR(50);` ◆ `DROP TABLE trades;` — supprime structure + données ⚠️ ◆ `TRUNCATE TABLE staging;` — vide toutes les lignes, rapide, peu journalisé ◆ `CREATE INDEX idx_isin ON trades(isin);` — B-tree par défaut, O(log n) ◆ **DCL — Data Control Language** : gestion des droits d'accès. ◆ `GRANT SELECT, INSERT ON trades TO analyst_role;` ◆ `REVOKE DELETE ON trades FROM junior_dev;` ◆ `CREATE ROLE risk_reader; GRANT risk_reader TO alice;` ◆ **⚠️ DDL vs DML** : DDL modifie la structure (auto-commit dans la plupart des SGBD). DML modifie les données (transactionnel, rollbackable)."
  },
  {
    "question": "DML — Manipuler les données",
    "answer": "**DML — Data Manipulation Language** : lire et modifier les données. ◆ **INSERT** : `INSERT INTO trades (isin, qty, price) VALUES ('FR0000131104', 100, 58.50);` ◆ `INSERT INTO archive SELECT * FROM trades WHERE trade_date < '2023-01-01';` ◆ **UPDATE** : `UPDATE positions SET qty = qty - 100 WHERE isin = 'FR...' AND desk = 'RATES';` ◆ **⚠️ UPDATE sans WHERE = mise à jour de toutes les lignes** — erreur critique ◆ **DELETE** : `DELETE FROM trades WHERE trade_date < CURRENT_DATE - INTERVAL '7 years';` ◆ **UPSERT** (INSERT ou UPDATE) : `INSERT INTO prices (isin, price) VALUES ('FR...', 58.5) ON CONFLICT (isin) DO UPDATE SET price = EXCLUDED.price;` ◆ **Transactions** : `BEGIN; UPDATE positions ...; INSERT INTO trades ...; COMMIT;` — atomicité critique en trading. ◆ **ROLLBACK** : annule toutes les modifications depuis le BEGIN."
  },
  {
    "question": "DQL — Interroger les données (SELECT avancé)",
    "answer": "**DQL — Data Query Language** : SELECT et ses clauses. ◆ **Ordre d'exécution SQL** : FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT ◆ **WHERE** : filtre les lignes avant groupement. ◆ **GROUP BY** : regroupe les lignes par valeur commune. ◆ **HAVING** : filtre les groupes après agrégation (WHERE sur les résultats de GROUP BY). ◆ **Exemple** : `SELECT desk, COUNT(*) as nb_trades, AVG(price) as avg_price, SUM(qty * price) as notional FROM trades WHERE trade_date = CURRENT_DATE GROUP BY desk HAVING SUM(qty * price) > 1000000 ORDER BY notional DESC;` ◆ **DISTINCT** : `SELECT DISTINCT counterparty FROM trades;` ◆ **CASE WHEN** : `SELECT id, CASE WHEN pnl > 0 THEN 'Profit' WHEN pnl < 0 THEN 'Loss' ELSE 'Flat' END as result FROM trades;`"
  },
  {
    "question": "Jointures & Sous-requêtes — Connecter les tables",
    "answer": "**INNER JOIN** : uniquement les lignes avec correspondance dans les deux tables. ◆ **LEFT JOIN** : toutes les lignes de gauche + correspondances droite (NULL si absent). ◆ **FULL OUTER JOIN** : toutes les lignes des deux tables, NULL des deux côtés si pas de match — utile pour la réconciliation. ◆ **SELF JOIN** : jointure d'une table avec elle-même. `SELECT e1.name, e2.name as manager FROM employees e1 JOIN employees e2 ON e1.manager_id = e2.id;` ◆ **Sous-requête corrélée** : `SELECT * FROM trades t WHERE price > (SELECT AVG(price) FROM trades WHERE desk = t.desk);` — recalculée pour chaque ligne de t. ◆ **EXISTS** : `SELECT * FROM desks d WHERE EXISTS (SELECT 1 FROM trades t WHERE t.desk_id = d.id);` — plus efficace que IN sur les grands jeux. ◆ **IN vs EXISTS** : IN matérialise toute la sous-requête. EXISTS s'arrête dès la première correspondance trouvée."
  },
  {
    "question": "CTE, Window Functions, Views, Procédures & Index",
    "answer": "**CTE** (`WITH`) : sous-requête nommée réutilisable. `WITH top_desks AS (SELECT desk, SUM(pnl) pnl FROM trades GROUP BY desk ORDER BY pnl DESC LIMIT 5) SELECT * FROM top_desks JOIN desks d ON d.name = top_desks.desk;` ◆ **CTE récursive** : hiérarchies, chaînes. `WITH RECURSIVE subordinates AS (SELECT id, name, manager_id FROM employees WHERE id = 1 UNION ALL SELECT e.id, e.name, e.manager_id FROM employees e JOIN subordinates s ON e.manager_id = s.id) SELECT * FROM subordinates;` ◆ **Window Functions** : `ROW_NUMBER() OVER (PARTITION BY desk ORDER BY pnl DESC)` — rang par desk sans GROUP BY. `SUM(pnl) OVER (ORDER BY trade_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` — P&L cumulatif. ◆ **VIEW** : `CREATE VIEW v_daily_pnl AS SELECT desk, SUM(pnl) FROM trades GROUP BY desk;` ◆ **Procédure stockée** : logique métier côté serveur, réutilisable, paramétrable. ◆ **INDEX** : `CREATE UNIQUE INDEX` interdit les doublons. Index composite : l'ordre des colonnes importe."
  }
];

const questions = {
  moyen: [
    {
      "question": "[DDL] Quelle est la différence entre `DROP TABLE` et `TRUNCATE TABLE` ?",
      "options": [
        "DROP et TRUNCATE sont identiques — les deux suppriment toutes les données.",
        "DROP supprime la table entière (structure + données + index + contraintes). TRUNCATE supprime uniquement toutes les lignes, la structure reste intact — plus rapide et moins journalisé.",
        "TRUNCATE est rollbackable, DROP ne l'est jamais.",
        "DROP fonctionne uniquement avec les tables vides."
      ],
      "answer": "DROP supprime la table entière (structure + données + index + contraintes). TRUNCATE supprime uniquement toutes les lignes, la structure reste intact — plus rapide et moins journalisé.",
      "explanation": "DROP TABLE : la table n'existe plus. TRUNCATE TABLE : reset les données mais la structure (colonnes, contraintes, index) reste. TRUNCATE réinitialise aussi les séquences (auto-increment). Plus rapide que DELETE car ne journalise pas ligne par ligne. Selon le SGBD, TRUNCATE peut ou non être rollbacké (PostgreSQL : oui dans une transaction. Oracle/MySQL : non, DDL auto-commit). DELETE FROM table : supprime ligne par ligne, journalisé, toujours rollbackable."
    },
    {
      "question": "[DDL] Que fait `ALTER TABLE trades ADD COLUMN desk VARCHAR(50) DEFAULT 'UNKNOWN' NOT NULL` ?",
      "options": [
        "Modifie la colonne 'desk' existante pour la rendre NOT NULL.",
        "Ajoute une nouvelle colonne 'desk' à la table existante avec une valeur par défaut 'UNKNOWN' — les lignes existantes reçoivent la valeur DEFAULT.",
        "Crée une nouvelle table 'desk' liée à 'trades'.",
        "ALTER TABLE échoue si la table contient déjà des données."
      ],
      "answer": "Ajoute une nouvelle colonne 'desk' à la table existante avec une valeur par défaut 'UNKNOWN' — les lignes existantes reçoivent la valeur DEFAULT.",
      "explanation": "ALTER TABLE est l'instruction DDL pour modifier la structure d'une table existante. ADD COLUMN : ajoute une colonne. DROP COLUMN : supprime une colonne. RENAME COLUMN : renomme. MODIFY / ALTER COLUMN : change le type ou les contraintes. DEFAULT 'UNKNOWN' : les lignes existantes reçoivent cette valeur (sinon NULL qui violerait NOT NULL). En production : ALTER TABLE sur une grande table peut être lent (lock) — préférer des migrations progressives ou des outils comme `pg_repack`."
    },
    {
      "question": "[DML] Qu'est-ce qu'un UPSERT et dans quel cas l'utilise-t-on ?",
      "options": [
        "Une suppression douce (soft delete) — marquer les lignes comme supprimées sans les effacer.",
        "INSERT ou UPDATE selon que la ligne existe déjà — atomique, évite la race condition d'un SELECT puis INSERT/UPDATE séparé.",
        "Un UPDATE avec une condition UNION.",
        "Une opération uniquement disponible sur PostgreSQL."
      ],
      "answer": "INSERT ou UPDATE selon que la ligne existe déjà — atomique, évite la race condition d'un SELECT puis INSERT/UPDATE séparé.",
      "explanation": "PostgreSQL : `INSERT INTO prices (isin, price) VALUES ('FR...', 58.5) ON CONFLICT (isin) DO UPDATE SET price = EXCLUDED.price, updated_at = NOW();`. MySQL : `INSERT ... ON DUPLICATE KEY UPDATE`. SQL Server : `MERGE`. EXCLUDED : référence les valeurs qu'on tentait d'insérer. En trading : mise à jour du prix de marché — si l'ISIN existe déjà dans la table de prix, on update. Sinon, on insère. Atomique = pas de problème de concurrence entre deux processus."
    },
    {
      "question": "[DML] Pourquoi un UPDATE sans clause WHERE est-il dangereux ?",
      "options": [
        "Il est plus lent qu'un UPDATE avec WHERE.",
        "Il met à jour TOUTES les lignes de la table — erreur irréversible si pas dans une transaction. En production trading, cela peut corrompre toutes les positions ou tous les prix.",
        "Il viole les contraintes d'intégrité référentielle.",
        "SQL interdit les UPDATE sans WHERE en production."
      ],
      "answer": "Il met à jour TOUTES les lignes de la table — erreur irréversible si pas dans une transaction. En production trading, cela peut corrompre toutes les positions ou tous les prix.",
      "explanation": "`UPDATE positions SET qty = 0;` — toutes les positions remises à 0. Catastrophique en trading. Bonnes pratiques : toujours vérifier le WHERE avant d'exécuter. Utiliser `BEGIN; UPDATE ...; SELECT COUNT(*) FROM ...;` pour vérifier avant COMMIT. Certains outils (SQL*Plus, pgAdmin) ont un mode 'safe update' qui refuse les UPDATE/DELETE sans WHERE. En production : droits limités, tout UPDATE critique via procédure stockée qui valide les paramètres."
    },
    {
      "question": "[DQL] Quelle est la différence entre `WHERE` et `HAVING` ?",
      "options": [
        "WHERE et HAVING sont interchangeables.",
        "WHERE filtre les lignes individuelles AVANT le GROUP BY. HAVING filtre les groupes APRÈS l'agrégation — ne peut référencer que des fonctions d'agrégation ou les colonnes du GROUP BY.",
        "HAVING est plus performant car il filtre moins de données.",
        "WHERE est pour les jointures, HAVING pour les agrégations."
      ],
      "answer": "WHERE filtre les lignes individuelles AVANT le GROUP BY. HAVING filtre les groupes APRÈS l'agrégation — ne peut référencer que des fonctions d'agrégation ou les colonnes du GROUP BY.",
      "explanation": "Ordre d'exécution : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. `WHERE AVG(salary) > 50000` → erreur SQL (AVG pas encore calculé à l'étape WHERE). `HAVING AVG(salary) > 50000` → correct (après GROUP BY). Performance : préférer WHERE quand possible — réduit les données avant le groupement. HAVING ne peut filtrer que sur ce qui est dans le GROUP BY ou sur des agrégats. Exemple : `WHERE age > 30 ... HAVING COUNT(*) > 5` — filtrer les employés > 30 ans ET les départements avec plus de 5 personnes."
    },
    {
      "question": "[DQL] Quelle requête calcule le P&L total par desk pour aujourd'hui, uniquement pour les desks dont le P&L dépasse 500 000 € ?",
      "options": [
        "SELECT desk, SUM(pnl) FROM trades WHERE pnl > 500000 AND trade_date = CURRENT_DATE GROUP BY desk;",
        "SELECT desk, SUM(pnl) as total_pnl FROM trades WHERE trade_date = CURRENT_DATE GROUP BY desk HAVING SUM(pnl) > 500000;",
        "SELECT desk, SUM(pnl) FROM trades GROUP BY desk WHERE SUM(pnl) > 500000 AND trade_date = CURRENT_DATE;",
        "SELECT desk, SUM(pnl) FROM trades WHERE trade_date = CURRENT_DATE HAVING pnl > 500000 GROUP BY desk;"
      ],
      "answer": "SELECT desk, SUM(pnl) as total_pnl FROM trades WHERE trade_date = CURRENT_DATE GROUP BY desk HAVING SUM(pnl) > 500000;",
      "explanation": "Décomposition : WHERE trade_date = CURRENT_DATE filtre d'abord les trades du jour. GROUP BY desk regroupe par desk. SUM(pnl) calcule le P&L total par groupe. HAVING SUM(pnl) > 500000 filtre les groupes. L'ordre des clauses est imposé par SQL : WHERE avant GROUP BY avant HAVING. `WHERE pnl > 500000` serait faux — filtrerait les trades individuels avec pnl > 500k, pas les desks dont la somme dépasse 500k."
    },
    {
      "question": "[Jointures] Que retourne un LEFT JOIN quand il n'y a pas de correspondance dans la table de droite ?",
      "options": [
        "La ligne de gauche est exclue du résultat.",
        "La ligne de gauche est incluse avec NULL pour toutes les colonnes de la table de droite.",
        "Une erreur SQL est levée.",
        "La ligne est dupliquée avec les valeurs de la première ligne de droite."
      ],
      "answer": "La ligne de gauche est incluse avec NULL pour toutes les colonnes de la table de droite.",
      "explanation": "LEFT JOIN : toutes les lignes de la table gauche sont retournées. Si pas de correspondance à droite, les colonnes de droite valent NULL. Cas d'usage : `SELECT t.id, c.name FROM trades t LEFT JOIN counterparties c ON t.cpty_id = c.id WHERE c.id IS NULL` — trades sans contrepartie dans le référentiel (orphelins). En finance : détecter les données manquantes, identifier des incohérences entre les referentiels. INNER JOIN exclut ces lignes orphelines."
    },
    {
      "question": "[Jointures] Quelle jointure utilise-t-on pour une réconciliation entre deux systèmes ?",
      "options": [
        "INNER JOIN",
        "FULL OUTER JOIN — retourne toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance dans l'autre.",
        "CROSS JOIN",
        "SELF JOIN"
      ],
      "answer": "FULL OUTER JOIN — retourne toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance dans l'autre.",
      "explanation": "FULL OUTER JOIN = LEFT JOIN + RIGHT JOIN. En réconciliation : `SELECT a.trade_id, b.trade_id FROM system_a a FULL OUTER JOIN system_b b ON a.trade_id = b.trade_id WHERE a.trade_id IS NULL OR b.trade_id IS NULL` — trades présents dans A mais pas B (IS NULL côté B) et vice versa. En trading : réconciliation entre le système de middle office et le système comptable. Les discordances = trades à investiguer."
    },
    {
      "question": "[INDEX] Dans quelle situation un index améliore-t-il les performances ?",
      "options": [
        "Toujours — un index améliore toujours les performances.",
        "Pour les SELECT avec WHERE sur des colonnes très sélectives dans de grandes tables. Contre-productif pour les petites tables ou les colonnes à faible cardinalité (ex: booléen).",
        "Uniquement pour les clés primaires.",
        "Seulement pour les colonnes de type numérique."
      ],
      "answer": "Pour les SELECT avec WHERE sur des colonnes très sélectives dans de grandes tables. Contre-productif pour les petites tables ou les colonnes à faible cardinalité (ex: booléen).",
      "explanation": "Index B-tree : transforme un scan O(n) en recherche O(log n). Utile sur `trade_date`, `isin`, `counterparty_id`. Inutile sur `is_active` (booléen) — 50% des lignes sont retournées, scan souvent plus rapide. Coût maintenance : chaque INSERT/UPDATE/DELETE met aussi à jour l'index. Sur une table très fréquemment écrite : trop d'index = dégradation des écritures. EXPLAIN ANALYZE révèle si l'index est utilisé. `CREATE INDEX CONCURRENTLY` en PostgreSQL pour créer sans lock."
    },
    {
      "question": "[NULL] Pourquoi `WHERE salary = NULL` ne retourne aucun résultat ?",
      "options": [
        "Car NULL est un mot-clé réservé non comparable.",
        "Car NULL représente 'valeur inconnue'. Toute comparaison avec NULL retourne NULL (pas TRUE), donc WHERE n'inclut pas ces lignes. Utiliser `IS NULL` ou `IS NOT NULL`.",
        "Car `= NULL` est une erreur de syntaxe SQL.",
        "Car les colonnes NULL ne sont pas indexées."
      ],
      "answer": "Car NULL représente 'valeur inconnue'. Toute comparaison avec NULL retourne NULL (pas TRUE), donc WHERE n'inclut pas ces lignes. Utiliser `IS NULL` ou `IS NOT NULL`.",
      "explanation": "Logique tri-valuée SQL : TRUE, FALSE, NULL. NULL = NULL retourne NULL (pas TRUE). La clause WHERE ne garde que TRUE. `WHERE salary IS NULL` : correct. `WHERE salary IS NOT NULL` : correct. `WHERE salary != NULL` : retourne 0 lignes (même problème). `COALESCE(salary, 0)` : substitue NULL par 0 dans les calculs. `COUNT(salary)` ignore les NULL. `COUNT(*)` les inclut. Piège classique : `WHERE NOT IN (SELECT ...)` si la sous-requête contient un NULL → aucun résultat (NOT NULL = NULL → pas TRUE)."
    },
    {
      "question": "[DCL] Quelle est la différence entre `GRANT` et `REVOKE` ?",
      "options": [
        "GRANT crée un utilisateur, REVOKE le supprime.",
        "GRANT accorde des privilèges sur un objet à un utilisateur/rôle. REVOKE retire ces privilèges.",
        "GRANT est pour les tables, REVOKE pour les procédures stockées.",
        "REVOKE supprime les données accessibles à l'utilisateur."
      ],
      "answer": "GRANT accorde des privilèges sur un objet à un utilisateur/rôle. REVOKE retire ces privilèges.",
      "explanation": "GRANT SELECT, INSERT ON trades TO analyst_role : le rôle analyst peut lire et insérer. REVOKE DELETE ON trades FROM junior_dev : retire le droit de supprimer. Privilèges SQL : SELECT, INSERT, UPDATE, DELETE, EXECUTE (procédures), REFERENCES (clés étrangères), ALL PRIVILEGES. Best practice : principe du moindre privilège — donner uniquement les droits nécessaires. En finance : les analystes ont SELECT uniquement. Les applications métier ont INSERT/UPDATE. Seuls les admins ont DELETE/DROP."
    },

    {
      "question": "[CTE] Quelle est la différence entre une CTE et une sous-requête ?",
      "options": [
        "Les CTEs sont toujours plus performantes car elles sont matérialisées.",
        "Une CTE (`WITH name AS`) est nommée, lisible, réutilisable plusieurs fois dans la requête. Une sous-requête est inline et non réutilisable. Performances équivalentes dans la plupart des cas (CTE non matérialisée par défaut en PostgreSQL).",
        "Les CTEs ne peuvent pas être utilisées dans les UPDATE.",
        "Une sous-requête peut être récursive, une CTE ne le peut pas."
      ],
      "answer": "Une CTE (`WITH name AS`) est nommée, lisible, réutilisable plusieurs fois dans la requête. Une sous-requête est inline et non réutilisable. Performances équivalentes dans la plupart des cas (CTE non matérialisée par défaut en PostgreSQL).",
      "explanation": "CTE avantages : lisibilité (nommer des étapes logiques), réutilisation dans la même requête, récursivité. PostgreSQL : CTE non matérialisée par défaut depuis v12 (l'optimiseur peut les inliner). `WITH MATERIALIZED AS` force la matérialisation (exécutée une fois, résultat mis en cache). CTE récursive : `WITH RECURSIVE` pour les hiérarchies. Sous-requête dans SELECT (scalar), FROM (derived table) ou WHERE (correlated). En pratique : CTE pour la lisibilité et la maintenance. Sous-requête pour les cas simples inline."
    },
    {
      "question": "[CTE Récursive] Comment fonctionne une CTE récursive ?",
      "options": [
        "Elle s'appelle elle-même indéfiniment jusqu'à un LIMIT.",
        "Elle a deux parties unies par UNION ALL : un cas de base (ancre) et une partie récursive qui référence la CTE elle-même. Elle s'arrête quand la partie récursive ne retourne plus de lignes.",
        "Elle utilise une variable de compteur interne pour s'arrêter.",
        "CTE récursive est uniquement supportée par Oracle et SQL Server."
      ],
      "answer": "Elle a deux parties unies par UNION ALL : un cas de base (ancre) et une partie récursive qui référence la CTE elle-même. Elle s'arrête quand la partie récursive ne retourne plus de lignes.",
      "explanation": "Structure : `WITH RECURSIVE cte AS ( SELECT id, name, 0 as level FROM employees WHERE manager_id IS NULL -- ancre UNION ALL SELECT e.id, e.name, s.level + 1 FROM employees e JOIN cte s ON e.manager_id = s.id -- récursif ) SELECT * FROM cte;`. L'ancre initialise. La partie récursive s'exécute sur les résultats précédents. S'arrête quand aucune nouvelle ligne. Cas d'usage : organigrammes, gammes de produits, dépendances. `MAXRECURSION` (SQL Server) ou `SET max_recursion` limite la profondeur pour éviter les boucles infinies."
    },
    {
      "question": "[Window Functions] Quelle est la différence entre `ROW_NUMBER()`, `RANK()` et `DENSE_RANK()` ?",
      "options": [
        "Ce sont trois fonctions identiques avec des noms différents.",
        "ROW_NUMBER() : rang unique sans ex-aequo (1,2,3,4). RANK() : ex-aequo reçoivent le même rang, le suivant saute (1,1,3,4). DENSE_RANK() : ex-aequo même rang, pas de saut (1,1,2,3).",
        "RANK() est le plus performant, ROW_NUMBER() le moins.",
        "DENSE_RANK() fonctionne uniquement avec PARTITION BY."
      ],
      "answer": "ROW_NUMBER() : rang unique sans ex-aequo (1,2,3,4). RANK() : ex-aequo reçoivent le même rang, le suivant saute (1,1,3,4). DENSE_RANK() : ex-aequo même rang, pas de saut (1,1,2,3).",
      "explanation": "Exemple avec salaires [100, 100, 80, 70] : ROW_NUMBER : 1,2,3,4 (ordre arbitraire pour ex-aequo). RANK : 1,1,3,4 (deux premiers ex-aequo, rang 2 sauté). DENSE_RANK : 1,1,2,3 (deux premiers ex-aequo, pas de saut). En finance : `DENSE_RANK() OVER (PARTITION BY desk ORDER BY pnl DESC)` — ranger les traders par P&L au sein de chaque desk, sans trous dans le classement. ROW_NUMBER pour dédoublonner (`WHERE rn = 1`)."
    },
    {
      "question": "[Window Functions] Qu'est-ce que `LAG()` et `LEAD()` et à quoi servent-elles ?",
      "options": [
        "Des fonctions d'agrégation pour les valeurs minimales et maximales.",
        "LAG(col, n) : accède à la valeur de la ligne n positions avant dans la fenêtre. LEAD(col, n) : la ligne n positions après. Permettent de comparer une ligne avec la précédente sans auto-jointure.",
        "LAG et LEAD sont des synonymes de FIRST_VALUE et LAST_VALUE.",
        "Fonctions réservées aux séries temporelles uniquement disponibles sous Oracle."
      ],
      "answer": "LAG(col, n) : accède à la valeur de la ligne n positions avant dans la fenêtre. LEAD(col, n) : la ligne n positions après. Permettent de comparer une ligne avec la précédente sans auto-jointure.",
      "explanation": "Sans LAG : `SELECT t1.price, t2.price as prev_price FROM prices t1 JOIN prices t2 ON t1.date = t2.date + 1` — auto-jointure complexe. Avec LAG : `SELECT date, price, LAG(price, 1) OVER (ORDER BY date) as prev_price, price - LAG(price,1) OVER (ORDER BY date) as daily_return FROM prices;`. En finance : calcul des rendements journaliers, variation de P&L d'un jour à l'autre, détection de sauts de prix. `LAG(price, 1, 0)` : valeur par défaut si pas de ligne précédente."
    },
    {
      "question": "[Window Functions] Comment calculer un P&L cumulatif par date avec les window functions ?",
      "options": [
        "SELECT date, SUM(pnl) FROM trades GROUP BY date ORDER BY date;",
        "SELECT date, pnl, SUM(pnl) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cumulative_pnl FROM daily_pnl;",
        "SELECT date, CUMSUM(pnl) OVER (ORDER BY date) FROM daily_pnl;",
        "SELECT date, pnl, SUM(pnl) OVER (PARTITION BY date) as cumulative_pnl FROM daily_pnl;"
      ],
      "answer": "SELECT date, pnl, SUM(pnl) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as cumulative_pnl FROM daily_pnl;",
      "explanation": "Window frame : définit les lignes incluses dans la fenêtre pour chaque ligne. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` : de la première ligne jusqu'à la ligne courante = somme cumulative. `ROWS BETWEEN 7 PRECEDING AND CURRENT ROW` : moyenne glissante sur 7 jours. `RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW` : fenêtre temporelle. Sans ORDER BY dans OVER() : toute la partition est incluse = résultat identique à GROUP BY. En finance : P&L cumulatif YTD, drawdown maximal, volatilité glissante."
    },
    {
      "question": "[VIEW] Quelle est la différence entre une VIEW ordinaire et une MATERIALIZED VIEW ?",
      "options": [
        "Les deux sont identiques — MATERIALIZED est juste un alias plus moderne.",
        "VIEW : requête stockée, réexécutée à chaque appel — toujours à jour, pas de stockage. MATERIALIZED VIEW : résultat stocké physiquement, très rapide à lire, mais nécessite un REFRESH pour se mettre à jour.",
        "MATERIALIZED VIEW ne peut pas être mise à jour (read-only).",
        "VIEW est pour PostgreSQL, MATERIALIZED VIEW pour Oracle uniquement."
      ],
      "answer": "VIEW : requête stockée, réexécutée à chaque appel — toujours à jour, pas de stockage. MATERIALIZED VIEW : résultat stocké physiquement, très rapide à lire, mais nécessite un REFRESH pour se mettre à jour.",
      "explanation": "VIEW : `CREATE VIEW v_risk AS SELECT desk, SUM(notional) FROM trades GROUP BY desk;`. Chaque SELECT sur la vue réexécute la requête. Toujours les données fraîches. MATERIALIZED VIEW : `CREATE MATERIALIZED VIEW mv_risk AS ...`. Snapshot en cache. `REFRESH MATERIALIZED VIEW mv_risk` pour mettre à jour (manuel ou scheduled). `REFRESH MATERIALIZED VIEW CONCURRENTLY` : refresh sans lock (PostgreSQL). En finance : rapport de risque quotidien → MV rafraîchie à 8h chaque matin. Requête temps réel → VIEW ordinaire."
    },
    {
      "question": "[Procédure Stockée] Quelle est la différence entre une procédure stockée et une fonction SQL ?",
      "options": [
        "Ce sont deux termes pour la même chose.",
        "Fonction : retourne une valeur scalaire ou un tableau, utilisable dans un SELECT. Procédure : ne retourne pas de valeur (ou via OUT params), appelée avec CALL/EXEC, peut gérer des transactions.",
        "Les procédures stockées sont uniquement pour SQL Server, les fonctions pour PostgreSQL.",
        "Une fonction peut modifier les données, une procédure ne le peut pas."
      ],
      "answer": "Fonction : retourne une valeur scalaire ou un tableau, utilisable dans un SELECT. Procédure : ne retourne pas de valeur (ou via OUT params), appelée avec CALL/EXEC, peut gérer des transactions.",
      "explanation": "Fonction : `CREATE FUNCTION get_pnl(desk_id INT) RETURNS DECIMAL AS $$ SELECT SUM(pnl) FROM trades WHERE desk = desk_id; $$`. Utilisable : `SELECT get_pnl(42)`. Procédure : `CREATE PROCEDURE close_positions(p_desk VARCHAR, p_date DATE) LANGUAGE plpgsql AS $$ BEGIN UPDATE positions SET status='CLOSED' WHERE desk=p_desk AND date=p_date; INSERT INTO audit_log ...; END; $$`. Appelée : `CALL close_positions('RATES', CURRENT_DATE)`. Procédure : gère BEGIN/COMMIT, paramètres OUT. En finance : procédure de clôture, calcul de risk en batch."
    },
    {
      "question": "[Procédure Stockée] Quels sont les avantages des procédures stockées en environnement de trading ?",
      "options": [
        "Elles sont plus faciles à déboguer que les requêtes inline.",
        "Logique complexe côté serveur (réduit les aller-retours réseau), pré-compilée (plus rapide), sécurité (EXECUTE only, pas d'accès direct aux tables), encapsulation de la logique métier.",
        "Elles remplacent les transactions ACID.",
        "Les procédures stockées sont automatiquement optimisées par l'optimiseur SQL."
      ],
      "answer": "Logique complexe côté serveur (réduit les aller-retours réseau), pré-compilée (plus rapide), sécurité (EXECUTE only, pas d'accès direct aux tables), encapsulation de la logique métier.",
      "explanation": "Avantages : 1) Performance : plan d'exécution mis en cache, une seule requête réseau pour N opérations. 2) Sécurité : GRANT EXECUTE sur la procédure, pas besoin de GRANT sur les tables sous-jacentes. 3) Encapsulation : la règle métier 'comment calculer la marge' est au même endroit. 4) Réutilisabilité : appelable depuis différentes applications. Inconvénients : logique métier en base difficile à versionner (Git), debug complexe, vendor lock-in (syntaxe différente entre SGBD). En trading : procédures pour les calculs de risque en batch, clôture journalière."
    },
    {
      "question": "[Procédure / Fonction] Comment gérer les erreurs dans une procédure PostgreSQL ?",
      "options": [
        "Les erreurs SQL sont ignorées automatiquement dans les procédures.",
        "Bloc `EXCEPTION` dans le corps PL/pgSQL : `BEGIN ... EXCEPTION WHEN division_by_zero THEN ... WHEN OTHERS THEN RAISE NOTICE 'Erreur: %', SQLERRM; END;`",
        "Utiliser TRY/CATCH comme en Python.",
        "Les procédures PostgreSQL ne supportent pas la gestion d'erreurs."
      ],
      "answer": "Bloc `EXCEPTION` dans le corps PL/pgSQL : `BEGIN ... EXCEPTION WHEN division_by_zero THEN ... WHEN OTHERS THEN RAISE NOTICE 'Erreur: %', SQLERRM; END;`",
      "explanation": "PL/pgSQL : `BEGIN [instructions] EXCEPTION WHEN condition THEN [gestion] END;`. SQLERRM : message d'erreur. SQLSTATE : code d'erreur (ex: '22012' = division by zero). `RAISE EXCEPTION 'Message %', variable` : lever une erreur customisée. `RAISE NOTICE` : log sans exception. `GET DIAGNOSTICS row_count = ROW_COUNT` : nombre de lignes affectées. En trading : procédure de calcul de P&L — si division par zero (prix = 0), log l'erreur et skip le trade au lieu de tout faire crasher."
    },
    {
      "question": "[INDEX] Qu'est-ce qu'un index composite et quel est l'impact de l'ordre des colonnes ?",
      "options": [
        "Un index composite est un index sur toutes les colonnes de la table automatiquement.",
        "Un index sur plusieurs colonnes. L'ordre importe : `INDEX(a, b)` accélère les requêtes sur `WHERE a=...`, `WHERE a=... AND b=...`, mais PAS `WHERE b=...` seul.",
        "L'ordre des colonnes dans un index composite n'a aucune importance.",
        "Un index composite remplace les index séparés sur chaque colonne."
      ],
      "answer": "Un index composite est un index sur plusieurs colonnes. L'ordre importe : `INDEX(a, b)` accélère les requêtes sur `WHERE a=...`, `WHERE a=... AND b=...`, mais PAS `WHERE b=...` seul.",
      "explanation": "Index composite `(trade_date, isin)` : efficace pour `WHERE trade_date = ... AND isin = ...` ou `WHERE trade_date = ...` seul (leftmost prefix rule). Pas efficace pour `WHERE isin = ...` seul. Ordre à choisir : colonne la plus sélective ou la plus souvent filtrée en premier. Index partiel : `CREATE INDEX ON trades(isin) WHERE status = 'ACTIVE'` — index uniquement sur les trades actifs, plus petit et plus rapide. Index covering : inclure des colonnes supplémentaires avec INCLUDE pour éviter les heap fetches."
    },
    {
      "question": "[Performances] Qu'est-ce que le plan d'exécution SQL et comment l'analyser ?",
      "options": [
        "Un document de spécification pour les développeurs.",
        "`EXPLAIN` affiche le plan prévu sans exécuter. `EXPLAIN ANALYZE` exécute et compare prévu vs réel. Chercher : Seq Scan sur grandes tables (index manquant), Hash Join vs Nested Loop, rows estimates loin de la réalité.",
        "Le plan d'exécution est uniquement accessible aux administrateurs DBA.",
        "EXPLAIN ne fonctionne que sur les SELECT, pas les UPDATE/DELETE."
      ],
      "answer": "`EXPLAIN` affiche le plan prévu sans exécuter. `EXPLAIN ANALYZE` exécute et compare prévu vs réel. Chercher : Seq Scan sur grandes tables (index manquant), Hash Join vs Nested Loop, rows estimates loin de la réalité.",
      "explanation": "EXPLAIN ANALYZE output clé : Seq Scan (scan complet, mauvais sur grandes tables) vs Index Scan (utilise un index, bon). Hash Join (grandes tables) vs Nested Loop (petites tables ou index disponible). Rows : estimation vs actual — si écart important, statistiques obsolètes (`ANALYZE table` pour les mettre à jour). Cost : en unités arbitraires du planificateur. Actual time : temps réel en ms. En SQL senior : savoir lire un plan d'exécution est essentiel pour optimiser les requêtes de reporting de risque qui prennent trop longtemps."
    },
    {
      "question": "[Transactions] Quels sont les problèmes de concurrence liés aux niveaux d'isolation SQL ?",
      "options": [
        "Les transactions SQL ne peuvent pas avoir de problèmes de concurrence.",
        "Dirty read (lire données non committées), Non-repeatable read (même SELECT donne des résultats différents), Phantom read (nouvelles lignes apparaissent entre deux lectures). Chaque niveau d'isolation prévient certains de ces problèmes.",
        "Ces problèmes n'existent que sur Oracle.",
        "Le niveau SERIALIZABLE résout les problèmes sans impact sur les performances."
      ],
      "answer": "Dirty read (lire données non committées), Non-repeatable read (même SELECT donne des résultats différents), Phantom read (nouvelles lignes apparaissent entre deux lectures). Chaque niveau d'isolation prévient certains de ces problèmes.",
      "explanation": "Niveaux (du moins au plus strict) : READ UNCOMMITTED : dirty reads possibles. READ COMMITTED (défaut PG) : pas de dirty read. REPEATABLE READ : pas de non-repeatable read. SERIALIZABLE : pas de phantom read. Plus strict = moins de concurrence = moins de throughput. En trading : READ COMMITTED pour les rapports standards. SERIALIZABLE pour les opérations critiques (calcul de marge, clôture). PostgreSQL utilise MVCC (Multi-Version Concurrency Control) — les lecteurs ne bloquent jamais les écrivains."
    },
    {
      "question": "[CREATE TABLE] Que signifient les contraintes `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK` et `NOT NULL` ?",
      "options": [
        "Ce sont des indexes différents.",
        "PRIMARY KEY : unicité + non-null, identifiant de la ligne. FOREIGN KEY : intégrité référentielle. UNIQUE : unicité (null autorisé). CHECK : condition booléenne sur la valeur. NOT NULL : valeur obligatoire.",
        "Ces contraintes n'ont d'effet que lors des INSERT.",
        "Seuls PRIMARY KEY et FOREIGN KEY sont des vraies contraintes, les autres sont des hints."
      ],
      "answer": "PRIMARY KEY : unicité + non-null, identifiant de la ligne. FOREIGN KEY : intégrité référentielle. UNIQUE : unicité (null autorisé). CHECK : condition booléenne sur la valeur. NOT NULL : valeur obligatoire.",
      "explanation": "Exemple complet : `CREATE TABLE trades (id SERIAL PRIMARY KEY, isin VARCHAR(12) NOT NULL, qty INT CHECK (qty > 0), price DECIMAL(15,4) CHECK (price > 0), desk_id INT REFERENCES desks(id) ON DELETE RESTRICT, status VARCHAR(20) CHECK (status IN ('PENDING','FILLED','CANCELLED')), CONSTRAINT uq_trade_ref UNIQUE (isin, trade_date, desk_id));`. ON DELETE RESTRICT : interdit de supprimer un desk qui a des trades. ON DELETE CASCADE : supprimerait les trades. En finance : les contraintes de base protègent contre les données invalides avant même d'atteindre la logique applicative."
    },
    {
      "question": "[Optimisation] Qu'est-ce que le problème N+1 en SQL et comment l'éviter ?",
      "options": [
        "Exécuter N+1 transactions au lieu d'une seule.",
        "Pour N entités, exécuter 1 requête pour les récupérer puis N requêtes pour leurs détails — totalement inefficace. Solution : JOIN ou IN clause dans une seule requête.",
        "Un index B-tree avec N+1 niveaux de profondeur.",
        "Le problème N+1 ne concerne que les ORMs, pas le SQL pur."
      ],
      "answer": "Pour N entités, exécuter 1 requête pour les récupérer puis N requêtes pour leurs détails — totalement inefficace. Solution : JOIN ou IN clause dans une seule requête.",
      "explanation": "N+1 : `SELECT * FROM desks` (1 requête, 20 desks), puis pour chaque desk : `SELECT * FROM trades WHERE desk_id = ?` (20 requêtes). Total : 21 requêtes. Solution JOIN : `SELECT d.*, t.* FROM desks d LEFT JOIN trades t ON t.desk_id = d.id WHERE t.trade_date = CURRENT_DATE` — 1 seule requête. Solution IN : `SELECT * FROM trades WHERE desk_id IN (1,2,...,20)` — 1 requête. En ORM : lazy loading provoque du N+1 silencieux. En finance : rapport de risque qui charge les positions desk par desk = N+1 classique, potentiellement catastrophique avec 100+ desks."
    },
    {
      "question": "[Avancé] Comment supprimer les doublons d'une table en conservant une seule ligne par groupe ?",
      "options": [
        "DELETE DUPLICATES FROM table;",
        "DELETE FROM trades WHERE id NOT IN (SELECT MIN(id) FROM trades GROUP BY isin, trade_date, desk);",
        "CREATE TABLE clean AS SELECT DISTINCT * FROM trades; DROP TABLE trades;",
        "UPDATE trades SET duplicate = true WHERE rownum > 1;"
      ],
      "answer": "DELETE FROM trades WHERE id NOT IN (SELECT MIN(id) FROM trades GROUP BY isin, trade_date, desk);",
      "explanation": "Stratégie : garder le MIN(id) de chaque groupe de doublons, supprimer les autres. Alternative avec CTE (plus lisible) : `WITH dupes AS (SELECT id, ROW_NUMBER() OVER (PARTITION BY isin, trade_date, desk ORDER BY id) as rn FROM trades) DELETE FROM trades WHERE id IN (SELECT id FROM dupes WHERE rn > 1)`. PARTITION BY définit ce qui constitue un doublon. ROW_NUMBER() numérote les doublons. Supprimer ceux avec rn > 1. Plus robuste que DISTINCT (DISTINCT crée une copie, ne gère pas la table originale). Toujours tester dans une transaction avec SELECT d'abord."
    },
    {
      "question": "[Avancé] Comment faire une requête `PIVOT` en SQL (transformer des lignes en colonnes) ?",
      "options": [
        "Utiliser la commande PIVOT qui existe dans tous les SGBD.",
        "Via CASE WHEN + GROUP BY : `SELECT desk, SUM(CASE WHEN asset_class='RATES' THEN pnl END) as rates_pnl, SUM(CASE WHEN asset_class='EQUITY' THEN pnl END) as eq_pnl FROM trades GROUP BY desk;`",
        "Le pivot n'est pas possible en SQL pur — nécessite du Python.",
        "Utiliser un FULL OUTER JOIN entre les différentes valeurs."
      ],
      "answer": "Via CASE WHEN + GROUP BY : `SELECT desk, SUM(CASE WHEN asset_class='RATES' THEN pnl END) as rates_pnl, SUM(CASE WHEN asset_class='EQUITY' THEN pnl END) as eq_pnl FROM trades GROUP BY desk;`",
      "explanation": "PIVOT = transformer des valeurs de lignes en colonnes. Technique universelle : CASE WHEN + GROUP BY. SQL Server a `PIVOT` natif. PostgreSQL : `crosstab()` dans l'extension tablefunc. Oracle : `PIVOT` natif. CASE WHEN dans SUM/COUNT : pour chaque ligne, retourne la valeur si la condition est vraie, NULL sinon. SUM ignore les NULL → somme uniquement les lignes qui matchent. En finance : rapport de P&L par desk × asset class (matrice), exposition par counterparty × currency."
    },
    {
      "question": "[Avancé] Qu'est-ce que le `EXPLAIN ANALYZE` révèle sur une requête lente avec un Hash Join ?",
      "options": [
        "Hash Join signifie toujours qu'il manque un index.",
        "Hash Join est approprié pour les jointures sur de grandes tables sans index adapté. Si le temps de build hash est élevé, augmenter `work_mem`. Si l'estimation de lignes est très erronée, `ANALYZE` la table pour mettre à jour les statistiques.",
        "Hash Join peut être désactivé avec un hint SQL standard.",
        "Hash Join est toujours plus lent que Nested Loop."
      ],
      "answer": "Hash Join est approprié pour les jointures sur de grandes tables sans index adapté. Si le temps de build hash est élevé, augmenter `work_mem`. Si l'estimation de lignes est très erronée, `ANALYZE` la table pour mettre à jour les statistiques.",
      "explanation": "Types de jointures dans EXPLAIN : Hash Join (grandes tables, construit une hash table), Nested Loop (petites tables ou index disponible), Merge Join (les deux côtés déjà triés). Hash Join lent : peut indiquer work_mem trop faible (spill to disk). `SET work_mem = '256MB'` pour la session. Statistiques obsolètes → mauvaise estimation de cardinalité → mauvais plan. `ANALYZE trades;` ou `VACUUM ANALYZE trades;` met à jour les statistiques. En production : slow query log + pg_stat_statements pour identifier les requêtes les plus coûteuses."
    }
    ],
  avance: [
    {
      "question": "[Avancé] Comment trouver le deuxième salaire le plus élevé sans utiliser LIMIT/OFFSET ?",
      "options": [
        "SELECT MAX(salary) FROM employees WHERE salary < MAX(salary);",
        "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
        "SELECT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;",
        "SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM employees) sub WHERE rnk = 2 LIMIT 1;"
      ],
      "answer": "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
      "explanation": "Méthode sous-requête : MAX parmi les salaires inférieurs au MAX global = 2ème max. Simple mais ne gère pas les ex-aequo proprement. Méthode DENSE_RANK : `SELECT DISTINCT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) rk FROM employees) WHERE rk = 2` — gère les ex-aequo (DENSE_RANK, pas RANK). Méthode N-ième max générique : remplacer 2 par N. LIMIT/OFFSET fonctionne mais est spécifique au SGBD (TOP en SQL Server, ROWNUM en Oracle). Question classique d'entretien SQL senior — connaître plusieurs approches."
    },
    {
      "question": "[Avancé] Comment optimiser une requête de reporting qui jointure 5 tables et prend 30 secondes ?",
      "options": [
        "Ajouter NOLOCK sur toutes les tables.",
        "Analyser EXPLAIN ANALYZE : vérifier les Seq Scan (ajouter des index), s'assurer que les stats sont à jour (ANALYZE), envisager une Materialized View pré-calculée, partitionner les grandes tables par date.",
        "Diviser la requête en 5 requêtes séparées et les assembler en application.",
        "Augmenter la RAM du serveur SQL."
      ],
      "answer": "Analyser EXPLAIN ANALYZE : vérifier les Seq Scan (ajouter des index), s'assurer que les stats sont à jour (ANALYZE), envisager une Materialized View pré-calculée, partitionner les grandes tables par date.",
      "explanation": "Approche méthodique : 1) EXPLAIN ANALYZE → identifier les Seq Scan coûteux → créer les index manquants. 2) ANALYZE → statistiques à jour → meilleur plan d'optimisation. 3) Partitionnement de table par date : `CREATE TABLE trades_2024 PARTITION OF trades FOR VALUES FROM ('2024-01-01') TO ('2025-01-01')` → les requêtes sur trades WHERE trade_date = '2024-...' ne scannent que la partition 2024. 4) Materialized View : pré-calculer les agrégats coûteux, rafraîchir la nuit. 5) Vérifier work_mem pour les Hash Join. 6) Derniers recours : hints, parallel query. En finance : rapports de risque souvent les plus lents — MV + partitionnement quasi-obligatoires."
    },
    {
      "question": "[Avancé] Qu'est-ce que le partitionnement de table et quand l'utiliser ?",
      "options": [
        "Diviser une table en plusieurs bases de données.",
        "Diviser physiquement une grande table en sous-tables (partitions) selon un critère (date, range, liste, hash). Le moteur scanne uniquement les partitions pertinentes (partition pruning).",
        "Le partitionnement est uniquement utile pour les tables > 1 milliard de lignes.",
        "Le partitionnement automatique de PostgreSQL est activé par défaut."
      ],
      "answer": "Diviser physiquement une grande table en sous-tables (partitions) selon un critère (date, range, liste, hash). Le moteur scanne uniquement les partitions pertinentes (partition pruning).",
      "explanation": "Partition by RANGE : `CREATE TABLE trades (id INT, trade_date DATE) PARTITION BY RANGE (trade_date)`. Chaque partition = une année/mois. `WHERE trade_date BETWEEN '2024-01-01' AND '2024-12-31'` → scanne uniquement la partition 2024 (partition pruning). Partition by LIST : par valeur fixe (desk, currency). Partition by HASH : distribution uniforme. Avantages : requêtes plus rapides, maintenance facilitée (DROP partition au lieu de DELETE), archivage simple. En finance : trades partitionnés par année → 5 ans de données, requêtes quotidiennes ne touchent que la partition en cours."
    },
    {
      "question": "[Avancé] Comment écrire une requête qui détecte les transactions suspectes (montant > 3 fois la moyenne du client) ?",
      "options": [
        "SELECT * FROM transactions WHERE amount > 3 * AVG(amount);",
        "SELECT t.* FROM transactions t WHERE t.amount > 3 * (SELECT AVG(amount) FROM transactions WHERE client_id = t.client_id);",
        "SELECT * FROM transactions HAVING amount > 3 * AVG(amount) GROUP BY client_id;",
        "SELECT * FROM transactions t JOIN (SELECT client_id, AVG(amount)*3 as threshold FROM transactions GROUP BY client_id) avg ON t.client_id = avg.client_id AND t.amount > avg.threshold;"
      ],
      "answer": "SELECT t.* FROM transactions t WHERE t.amount > 3 * (SELECT AVG(amount) FROM transactions WHERE client_id = t.client_id);",
      "explanation": "Deux approches valides : Sous-requête corrélée (option B) : recalcule la moyenne pour chaque transaction — lisible mais peut être lent sur de grandes tables. JOIN avec CTE/sous-requête (option D) : calcule toutes les moyennes en une passe puis jointure — plus performant. Avec window : `SELECT * FROM (SELECT *, amount / AVG(amount) OVER (PARTITION BY client_id) as ratio FROM transactions) t WHERE ratio > 3` — élégant et performant. En finance/KYC : détecter les transactions inhabituelles, alertes AML (Anti-Money Laundering)."
    },
    {
      "question": "[VIEW] Pourquoi utiliser une VIEW plutôt que répéter une requête complexe partout ?",
      "options": [
        "Les VIEWs sont plus rapides car elles sont pré-compilées.",
        "Encapsulation : la logique complexe est définie une fois et réutilisée. Sécurité : exposer uniquement les colonnes autorisées sans accès direct aux tables. Maintenance : modifier la logique en un seul endroit.",
        "Les VIEWs permettent de modifier les données sous-jacentes facilement.",
        "Une VIEW matérialise automatiquement les données pour de meilleures performances."
      ],
      "answer": "Encapsulation : la logique complexe est définie une fois et réutilisée. Sécurité : exposer uniquement les colonnes autorisées sans accès direct aux tables. Maintenance : modifier la logique en un seul endroit.",
      "explanation": "VIEW avantages : 1) Réutilisabilité — `SELECT * FROM v_risk_positions` au lieu de répéter une jointure de 5 tables. 2) Sécurité — GRANT SELECT ON v_risk_positions TO analyst (sans accéder aux tables brutes confidentielles). 3) Maintenance — changer la logique de calcul du P&L dans la VIEW met à jour tous les rapports qui l'utilisent. 4) Abstraction — l'application ne connaît pas la structure physique des tables. VIEW updatable : sous conditions (une seule table, pas de GROUP BY/DISTINCT/HAVING). `WITH CHECK OPTION` : les UPDATE/INSERT via la vue doivent satisfaire la condition WHERE de la vue."
    },
    {
      "question": "[Avancé] Comment utiliser une window function pour calculer le pourcentage de contribution de chaque trade au P&L total du desk ?",
      "options": [
        "SELECT desk, pnl, pnl / SUM(pnl) * 100 FROM trades GROUP BY desk, pnl;",
        "SELECT trade_id, desk, pnl, pnl * 100.0 / SUM(pnl) OVER (PARTITION BY desk) as pct_contribution FROM trades WHERE trade_date = CURRENT_DATE;",
        "SELECT trade_id, pnl / (SELECT SUM(pnl) FROM trades) * 100 FROM trades;",
        "SELECT trade_id, PERCENT_RANK() OVER (PARTITION BY desk ORDER BY pnl) FROM trades;"
      ],
      "answer": "SELECT trade_id, desk, pnl, pnl * 100.0 / SUM(pnl) OVER (PARTITION BY desk) as pct_contribution FROM trades WHERE trade_date = CURRENT_DATE;",
      "explanation": "SUM(pnl) OVER (PARTITION BY desk) : calcule la somme du P&L pour le desk de chaque ligne sans GROUP BY — toutes les lignes individuelles sont conservées. On divise chaque pnl par cette somme de desk → pourcentage de contribution. Sans window function : nécessiterait une auto-jointure ou sous-requête corrélée. Avec window : une seule passe sur les données. Extension : `SUM(pnl) OVER ()` (sans PARTITION) = % du P&L total toutes desk confondues. `SUM(pnl) OVER (PARTITION BY desk, asset_class)` = % par desk × asset class."
    },
    {
      "question": "[Avancé] Quelle est la différence entre `UNION`, `UNION ALL`, `INTERSECT` et `EXCEPT` ?",
      "options": [
        "Ce sont quatre syntaxes pour la même opération.",
        "UNION : combine + déduplique. UNION ALL : combine sans déduplication (plus rapide). INTERSECT : lignes présentes dans les DEUX requêtes. EXCEPT : lignes de la première absentes de la seconde.",
        "INTERSECT et EXCEPT ne sont disponibles que sous Oracle.",
        "UNION ALL peut combiner des tables avec des structures différentes."
      ],
      "answer": "UNION : combine + déduplique. UNION ALL : combine sans déduplication (plus rapide). INTERSECT : lignes présentes dans les DEUX requêtes. EXCEPT : lignes de la première absentes de la seconde.",
      "explanation": "UNION ALL : préférer quand les doublons sont impossibles ou acceptables — pas de tri interne. INTERSECT : `SELECT isin FROM book_a INTERSECT SELECT isin FROM book_b` — ISINs dans les deux books. EXCEPT (MINUS en Oracle) : `SELECT isin FROM expected_trades EXCEPT SELECT isin FROM actual_trades` — trades attendus mais non arrivés. En finance : EXCEPT pour les réconciliations (ce qui est dans le référentiel mais pas dans le système). Les quatre opérateurs nécessitent des colonnes compatibles (même nombre, types compatibles)."
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
    // 20 QCM SQL Senior — à ajouter dans questions.avance[]

    {
      "question": "[INDEX] Qu'est-ce qu'un index couvrant (covering index) ?",
      "options": [
        "Un index qui couvre toutes les colonnes de la table.",
        "Un index qui contient toutes les colonnes nécessaires à la requête — le moteur répond sans accéder à la table (index-only scan).",
        "Un index créé automatiquement par le SGBD sur les clés étrangères.",
        "Un index partiel qui couvre une plage de valeurs."
      ],
      "answer": "Un index qui contient toutes les colonnes nécessaires à la requête — le moteur répond sans accéder à la table (index-only scan).",
      "explanation": "PostgreSQL : `CREATE INDEX idx_covering ON trades(trade_date, desk) INCLUDE (pnl, qty)`. Requête `SELECT pnl, qty FROM trades WHERE trade_date = CURRENT_DATE AND desk = 'RATES'` → index-only scan, la table n'est jamais lue. Gain : élimination des heap fetches (accès aléatoires à la table). SQL Server : `CREATE INDEX ... ON ... INCLUDE (col)`. En finance : requête de reporting sur des colonnes fréquentes → index couvrant réduit les I/O de 90%."
    },
    {
      "question": "[TRANSACTIONS] Qu'est-ce que le MVCC (Multi-Version Concurrency Control) ?",
      "options": [
        "Un système de sauvegarde multi-version des tables.",
        "Chaque transaction voit un snapshot cohérent des données au moment où elle a commencé — les lecteurs ne bloquent pas les écrivains et vice versa.",
        "Un mécanisme de réplication vers plusieurs serveurs.",
        "Une technique de partitionnement horizontal des tables."
      ],
      "answer": "Chaque transaction voit un snapshot cohérent des données au moment où elle a commencé — les lecteurs ne bloquent pas les écrivains et vice versa.",
      "explanation": "MVCC (PostgreSQL, Oracle, MySQL InnoDB) : au lieu de verrous exclusifs, chaque écriture crée une nouvelle version de la ligne. Les lecteurs voient la version cohérente avec leur timestamp de début. Avantage : pas de blocage read/write → haute concurrence. Coût : VACUUM (PostgreSQL) pour nettoyer les vieilles versions (dead tuples). En trading : les rapports de risque lisent les positions sans bloquer les mises à jour de prix en temps réel."
    },
    {
      "question": "[WINDOW] Quelle est la différence entre `ROWS` et `RANGE` dans une window frame ?",
      "options": [
        "ROWS et RANGE sont identiques.",
        "ROWS : compte physiquement N lignes avant/après. RANGE : inclut toutes les lignes avec la même valeur d'ORDER BY que la borne. ROWS est plus prévisible.",
        "RANGE est pour les dates, ROWS pour les entiers.",
        "ROWS est plus performant car il utilise moins de mémoire."
      ],
      "answer": "ROWS : compte physiquement N lignes avant/après. RANGE : inclut toutes les lignes avec la même valeur d'ORDER BY que la borne. ROWS est plus prévisible.",
      "explanation": "Avec `ORDER BY date` et deux lignes au même date : `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW` → exactement 2 lignes. `RANGE BETWEEN 1 PRECEDING AND CURRENT ROW` → toutes les lignes avec la même date que la courante. `RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW` → fenêtre temporelle de 7 jours. En finance : moyenne glissante sur les 5 derniers jours calendaires → RANGE. Moyenne sur exactement les 5 lignes précédentes → ROWS."
    },
    {
      "question": "[DDL] Quelle est la différence entre `ON DELETE CASCADE` et `ON DELETE RESTRICT` sur une FOREIGN KEY ?",
      "options": [
        "CASCADE et RESTRICT font la même chose.",
        "CASCADE : supprimer le parent supprime automatiquement les enfants. RESTRICT : interdit la suppression du parent s'il a des enfants — lève une erreur.",
        "RESTRICT supprime les enfants après confirmation. CASCADE lève une erreur.",
        "CASCADE est uniquement pour les UPDATE, RESTRICT pour les DELETE."
      ],
      "answer": "CASCADE : supprimer le parent supprime automatiquement les enfants. RESTRICT : interdit la suppression du parent s'il a des enfants — lève une erreur.",
      "explanation": "Options FOREIGN KEY : ON DELETE CASCADE (supprimer desk → supprimer tous ses trades), ON DELETE SET NULL (desk_id mis à NULL), ON DELETE RESTRICT (erreur si le desk a des trades), ON DELETE NO ACTION (comportement par défaut = RESTRICT). Même options pour ON UPDATE. En finance : rarement CASCADE sur les données métier (trop dangereux). RESTRICT protège contre les suppressions accidentelles de référentiels. SET NULL utile si la relation est optionnelle."
    },
    {
      "question": "[PERFORMANCE] Qu'est-ce que le problème du `SELECT *` en production ?",
      "options": [
        "SELECT * est interdit en SQL standard.",
        "Récupère toutes les colonnes y compris les inutiles — overhead réseau et mémoire, rend impossible les index couvrants, casse le code si la structure de la table change.",
        "SELECT * est plus lent uniquement s'il y a plus de 10 colonnes.",
        "SELECT * empêche l'utilisation des index."
      ],
      "answer": "Récupère toutes les colonnes y compris les inutiles — overhead réseau et mémoire, rend impossible les index couvrants, casse le code si la structure de la table change.",
      "explanation": "Problèmes : 1) Performance : transfert de toutes les colonnes même inutiles (colonnes BLOB/TEXT volumineuses). 2) Index couvrant impossible : le moteur doit toujours aller lire la table. 3) Fragilité : `SELECT * FROM trades` dans une application — si on ajoute une colonne, le code qui mappe les colonnes par position se casse. 4) Maintenabilité : impossible de savoir quelles colonnes sont réellement utilisées. Best practice : toujours lister les colonnes explicitement en production."
    },
    {
      "question": "[CTE] Comment utiliser une CTE dans un UPDATE ?",
      "options": [
        "Les CTEs ne fonctionnent qu'avec les SELECT.",
        "`WITH recalc AS (SELECT id, SUM(qty)*price as new_notional FROM trades GROUP BY id, price) UPDATE positions p SET notional = r.new_notional FROM recalc r WHERE p.id = r.id;`",
        "Il faut créer une VIEW temporaire avant de pouvoir UPDATE.",
        "Un UPDATE avec CTE nécessite une procédure stockée."
      ],
      "answer": "`WITH recalc AS (SELECT id, SUM(qty)*price as new_notional FROM trades GROUP BY id, price) UPDATE positions p SET notional = r.new_notional FROM recalc r WHERE p.id = r.id;`",
      "explanation": "CTEs utilisables dans UPDATE, DELETE, INSERT. Syntaxe PostgreSQL : `WITH cte AS (...) UPDATE table SET ... FROM cte WHERE ...`. SQL Server : `WITH cte AS (...) UPDATE cte SET ...` (update direct sur la CTE). Puissant pour les mises à jour complexes : calculer d'abord les nouvelles valeurs dans la CTE, puis mettre à jour en une seule opération atomique. En trading : recalculer les positions agrégées depuis les trades puis mettre à jour la table de positions."
    },
    {
      "question": "[NULL] Que retourne `NOT IN` si la sous-requête contient un NULL ?",
      "options": [
        "NOT IN ignore les NULL dans la sous-requête.",
        "Aucune ligne — car `x NOT IN (..., NULL)` équivaut à `x != NULL` qui retourne NULL (jamais TRUE) pour toutes les lignes.",
        "Une erreur SQL est levée.",
        "Seules les lignes avec NULL sont retournées."
      ],
      "answer": "Aucune ligne — car `x NOT IN (..., NULL)` équivaut à `x != NULL` qui retourne NULL (jamais TRUE) pour toutes les lignes.",
      "explanation": "Piège classique : `SELECT * FROM a WHERE id NOT IN (SELECT id FROM b)`. Si b contient une ligne avec id NULL → NOT IN (1, 2, NULL) → x!=1 AND x!=2 AND x!=NULL → le dernier terme est NULL → AND NULL = NULL → jamais TRUE → 0 lignes. Solution : `WHERE NOT EXISTS (SELECT 1 FROM b WHERE b.id = a.id)` ou `WHERE id NOT IN (SELECT id FROM b WHERE id IS NOT NULL)`. EXISTS/NOT EXISTS gère correctement les NULL. Question piège très fréquente en entretien senior."
    },
    {
      "question": "[SCHEMA] Quelle est la différence entre un schéma en étoile (star schema) et en flocon (snowflake) ?",
      "options": [
        "Ce sont deux noms pour le même modèle.",
        "Star schema : table de faits centrale + tables de dimensions dénormalisées (jointures simples, rapide). Snowflake : dimensions normalisées en sous-tables (économise l'espace, jointures plus complexes, moins performant en lecture).",
        "Snowflake schema est uniquement pour les bases NoSQL.",
        "Star schema est utilisé pour l'OLTP, snowflake pour l'OLAP."
      ],
      "answer": "Star schema : table de faits centrale + tables de dimensions dénormalisées (jointures simples, rapide). Snowflake : dimensions normalisées en sous-tables (économise l'espace, jointures plus complexes, moins performant en lecture).",
      "explanation": "Star schema : `fact_trades` jointure directe avec `dim_counterparty`, `dim_desk`, `dim_date`. Simple, rapide (peu de jointures), redondance des données. Snowflake : `dim_counterparty` → `dim_country` → `dim_region`. Normalisé, économise l'espace, mais 3 jointures au lieu d'1 pour accéder au nom de la région. En finance BI/datawarehouse : star schema souvent préféré pour les rapports analytiques (performance > économie d'espace)."
    },
    {
      "question": "[FONCTION] Comment créer une fonction SQL qui retourne le P&L d'un desk pour une date donnée ?",
      "options": [
        "CREATE FUNCTION pnl(desk TEXT, dt DATE) AS SELECT SUM(pnl) FROM trades WHERE desk=$1 AND trade_date=$2;",
        "CREATE OR REPLACE FUNCTION get_desk_pnl(p_desk VARCHAR, p_date DATE) RETURNS DECIMAL LANGUAGE sql AS $$ SELECT COALESCE(SUM(pnl), 0) FROM trades WHERE desk = p_desk AND trade_date = p_date; $$;",
        "FUNCTION get_pnl(desk, date) RETURN NUMBER IS BEGIN SELECT SUM(pnl) INTO v FROM trades; END;",
        "CREATE VIEW get_pnl AS SELECT SUM(pnl) FROM trades GROUP BY desk, trade_date;"
      ],
      "answer": "CREATE OR REPLACE FUNCTION get_desk_pnl(p_desk VARCHAR, p_date DATE) RETURNS DECIMAL LANGUAGE sql AS $$ SELECT COALESCE(SUM(pnl), 0) FROM trades WHERE desk = p_desk AND trade_date = p_date; $$;",
      "explanation": "PostgreSQL : `CREATE OR REPLACE FUNCTION` remplace si existe. `LANGUAGE sql` : SQL pur. `LANGUAGE plpgsql` : avec variables, boucles, conditions. `RETURNS DECIMAL` : type de retour. `$$` : délimiteur du corps. COALESCE(..., 0) : retourne 0 si aucun trade au lieu de NULL. Utilisation : `SELECT get_desk_pnl('RATES', CURRENT_DATE)` ou dans une requête : `SELECT desk, get_desk_pnl(desk, CURRENT_DATE) FROM desks`. En finance : fonctions pour les calculs standardisés (VaR, notionnel, duration)."
    },
    {
      "question": "[PERFORMANCE] Qu'est-ce que `pg_stat_statements` et comment l'utiliser pour optimiser ?",
      "options": [
        "Une table système qui stocke l'historique de tous les SELECT.",
        "Une extension PostgreSQL qui agrège les statistiques d'exécution par requête normalisée (temps total, appels, rows) — identifie les requêtes les plus coûteuses cumulativement.",
        "Un outil de monitoring externe pour PostgreSQL.",
        "Une vue qui affiche les requêtes en cours d'exécution."
      ],
      "answer": "Une extension PostgreSQL qui agrège les statistiques d'exécution par requête normalisée (temps total, appels, rows) — identifie les requêtes les plus coûteuses cumulativement.",
      "explanation": "`SELECT query, calls, total_exec_time, mean_exec_time, rows FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;` → top 10 requêtes les plus coûteuses au total. `mean_exec_time` élevé + `calls` élevé = cible d'optimisation prioritaire. Les paramètres sont remplacés par $1, $2 (normalisation). Compléments : `pg_stat_activity` (requêtes en cours), `pg_locks` (verrous), `auto_explain.log_min_duration` (EXPLAIN automatique des requêtes lentes). En finance : identifier les rapports de risque qui ralentissent le système."
    },
    {
      "question": "[DDL] Comment ajouter une contrainte CHECK à une table existante ?",
      "options": [
        "MODIFY TABLE trades ADD CHECK (qty > 0);",
        "ALTER TABLE trades ADD CONSTRAINT chk_qty_positive CHECK (qty > 0);",
        "UPDATE trades SET CHECK qty > 0;",
        "CREATE CHECK CONSTRAINT ON trades (qty > 0);"
      ],
      "answer": "ALTER TABLE trades ADD CONSTRAINT chk_qty_positive CHECK (qty > 0);",
      "explanation": "ALTER TABLE ... ADD CONSTRAINT : ajoute une contrainte sur une table existante. Si des données existantes violent la contrainte, l'ALTER échoue. `ADD CONSTRAINT chk_qty_positive CHECK (qty > 0 AND qty < 1000000)` : nommer la contrainte permet de la supprimer plus tard (`DROP CONSTRAINT chk_qty_positive`). `NOT VALID` (PostgreSQL) : ajoute la contrainte sans vérifier les données existantes, validation différée avec `VALIDATE CONSTRAINT`. Utile sur les grandes tables pour éviter le lock prolongé."
    },
    {
      "question": "[WINDOW] Comment calculer une moyenne mobile sur 7 jours en SQL ?",
      "options": [
        "SELECT date, AVG(price) FROM prices GROUP BY date, date-7;",
        "SELECT date, price, AVG(price) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d FROM daily_prices;",
        "SELECT date, MOVING_AVG(price, 7) OVER (ORDER BY date) FROM daily_prices;",
        "SELECT date, price, (SELECT AVG(price) FROM daily_prices p2 WHERE p2.date BETWEEN p1.date-7 AND p1.date) FROM daily_prices p1;"
      ],
      "answer": "SELECT date, price, AVG(price) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d FROM daily_prices;",
      "explanation": "`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` : la ligne courante + les 6 précédentes = 7 lignes. `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` : moyenne centrée. `RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW` : 7 jours calendaires (même si des jours manquent). La sous-requête corrélée (option D) fonctionne mais est O(n²). Window function : O(n). En finance : moyenne mobile sur les prix de clôture, volatilité glissante, VaR historique."
    },
    {
      "question": "[TRANSACTION] Qu'est-ce qu'un SAVEPOINT ?",
      "options": [
        "Un point de sauvegarde automatique créé par le SGBD.",
        "Un marqueur à l'intérieur d'une transaction qui permet un ROLLBACK partiel jusqu'à ce point sans annuler toute la transaction.",
        "Un snapshot de la base de données pour la restauration.",
        "Un alias pour BEGIN TRANSACTION."
      ],
      "answer": "Un marqueur à l'intérieur d'une transaction qui permet un ROLLBACK partiel jusqu'à ce point sans annuler toute la transaction.",
      "explanation": "`BEGIN; INSERT INTO trades ...; SAVEPOINT sp1; UPDATE positions ...; SAVEPOINT sp2; DELETE FROM staging ...; ROLLBACK TO sp1;` — annule le UPDATE et le DELETE, mais conserve l'INSERT. `RELEASE SAVEPOINT sp1` : supprime le savepoint (libère les ressources). Utile pour les transactions longues avec des étapes optionnelles. En trading : charger les trades (garder), recalculer les positions (potentiellement rollbacker si erreur), sans perdre les trades chargés."
    },
    {
      "question": "[AVANCÉ] Comment implémenter une SCD Type 2 (Slowly Changing Dimension) en SQL ?",
      "options": [
        "Utiliser TRUNCATE + INSERT pour remplacer les données à chaque mise à jour.",
        "Conserver l'historique avec valid_from, valid_to et is_current. INSERT nouvelle ligne avec valid_from=NOW(), UPDATE ancienne ligne avec valid_to=NOW() et is_current=false.",
        "Utiliser une colonne VERSION incrémentale et garder uniquement la dernière.",
        "SCD Type 2 n'est pas implémentable en SQL standard."
      ],
      "answer": "Conserver l'historique avec valid_from, valid_to et is_current. INSERT nouvelle ligne avec valid_from=NOW(), UPDATE ancienne ligne avec valid_to=NOW() et is_current=false.",
      "explanation": "SCD2 structure : `counterparty_key, name, credit_rating, valid_from, valid_to, is_current`. Quand le rating de BNP change : `UPDATE counterparty SET valid_to = NOW(), is_current = false WHERE name='BNP' AND is_current = true` + `INSERT INTO counterparty VALUES ('BNP', 'AA', NOW(), NULL, true)`. Requête courante : `WHERE is_current = true`. Requête historique : `WHERE valid_from <= trade_date AND (valid_to > trade_date OR valid_to IS NULL)`. En finance : historique des ratings, limites de crédit, appartenance à un desk."
    },
    {
      "question": "[AVANCÉ] Qu'est-ce que `LATERAL` en SQL et quand l'utiliser ?",
      "options": [
        "Un type de jointure similaire à CROSS JOIN.",
        "Permet à une sous-requête dans le FROM de référencer les colonnes des tables précédentes dans le même FROM — comme une boucle corrélée mais en set-based.",
        "LATERAL est uniquement disponible sur PostgreSQL.",
        "Un alias pour LEFT JOIN OUTER."
      ],
      "answer": "Permet à une sous-requête dans le FROM de référencer les colonnes des tables précédentes dans le même FROM — comme une boucle corrélée mais en set-based.",
      "explanation": "`SELECT d.name, top_trades.* FROM desks d LEFT JOIN LATERAL (SELECT trade_id, pnl FROM trades WHERE desk_id = d.id ORDER BY pnl DESC LIMIT 3) AS top_trades ON true;` → top 3 trades par desk. Impossible sans LATERAL car la sous-requête référence `d.id`. Équivalent corrigé de `ROW_NUMBER() OVER (PARTITION BY ...)` dans certains cas. Cas d'usage : top-N par groupe, appeler une fonction set-returning pour chaque ligne, pagination par groupe. PostgreSQL, SQL Server (CROSS/OUTER APPLY), Oracle (LATERAL)."
    },
    {
      "question": "[DCL] Qu'est-ce que le Row-Level Security (RLS) en PostgreSQL ?",
      "options": [
        "Un mécanisme de chiffrement des lignes sensibles.",
        "Des politiques qui filtrent automatiquement les lignes qu'un utilisateur peut voir ou modifier, transparentes pour l'application.",
        "Un index partiel qui protège certaines lignes.",
        "RLS est uniquement disponible dans PostgreSQL Enterprise."
      ],
      "answer": "Des politiques qui filtrent automatiquement les lignes qu'un utilisateur peut voir ou modifier, transparentes pour l'application.",
      "explanation": "`ALTER TABLE trades ENABLE ROW LEVEL SECURITY; CREATE POLICY trader_sees_own_desk ON trades USING (desk = current_setting('app.current_desk'));`. Quand un trader du desk RATES se connecte, `SELECT * FROM trades` retourne automatiquement uniquement les trades RATES. Transparent pour l'application. `FORCE ROW LEVEL SECURITY` : s'applique même aux superusers. En finance : isolation des données par desk, par entité légale, conformité réglementaire (accès limité aux données de position)."
    },
    {
      "question": "[AVANCÉ] Comment écrire un MERGE (upsert multi-conditions) en SQL ?",
      "options": [
        "MERGE n'existe pas en SQL standard.",
        "MERGE INTO target USING source ON condition WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ... WHEN NOT MATCHED BY SOURCE THEN DELETE;",
        "MERGE est uniquement disponible via ON CONFLICT en PostgreSQL.",
        "MERGE INTO target SELECT * FROM source ON DUPLICATE KEY UPDATE;"
      ],
      "answer": "MERGE INTO target USING source ON condition WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ... WHEN NOT MATCHED BY SOURCE THEN DELETE;",
      "explanation": "MERGE (SQL Server, Oracle, DB2) : `MERGE INTO positions p USING (SELECT desk, SUM(qty) qty FROM trades GROUP BY desk) s ON p.desk = s.desk WHEN MATCHED THEN UPDATE SET p.qty = s.qty WHEN NOT MATCHED THEN INSERT (desk, qty) VALUES (s.desk, s.qty) WHEN NOT MATCHED BY SOURCE THEN DELETE;` — met à jour les positions existantes, insère les nouvelles, supprime les positions sans trades. PostgreSQL : `INSERT ... ON CONFLICT DO UPDATE`. Puissant pour la synchronisation de tables. En trading : synchroniser la table de positions agrégées depuis les trades."
    },
    {
      "question": "[AVANCÉ] Comment détecter et résoudre un deadlock dans une base de données en production ?",
      "options": [
        "Redémarrer le SGBD pour libérer tous les verrous.",
        "Détecter via `pg_locks` + `pg_stat_activity`. Résoudre : le SGBD tue automatiquement la victime. Prévenir : ordre d'acquisition cohérent des tables, transactions courtes, index sur les colonnes de jointure des UPDATE.",
        "Augmenter le `lock_timeout` pour laisser plus de temps.",
        "Les deadlocks ne peuvent pas se produire si on utilise SERIALIZABLE."
      ],
      "answer": "Détecter via `pg_locks` + `pg_stat_activity`. Résoudre : le SGBD tue automatiquement la victime. Prévenir : ordre d'acquisition cohérent des tables, transactions courtes, index sur les colonnes de jointure des UPDATE.",
      "explanation": "Détection : `SELECT * FROM pg_locks l JOIN pg_stat_activity a ON l.pid = a.pid WHERE NOT granted` → verrous en attente. Le SGBD détecte automatiquement les cycles et tue la transaction victime (erreur : deadlock detected). Prévention : 1) Toujours UPDATE les tables dans le même ordre (trades avant positions). 2) Transactions courtes. 3) Index sur les colonnes filtrées dans les UPDATE (évite les lock d'index). 4) SELECT FOR UPDATE ... SKIP LOCKED pour les queues. 5) Niveaux d'isolation moins stricts quand possible."
    },
    {
      "question": "[AVANCÉ] Comment paginer efficacement de grands résultats sans `OFFSET` ?",
      "options": [
        "OFFSET est la seule méthode standard de pagination.",
        "Keyset pagination (seek method) : `WHERE (trade_date, id) > (:last_date, :last_id) ORDER BY trade_date, id LIMIT 100` — utilise un index, performance constante peu importe la page.",
        "Créer une table temporaire avec ROW_NUMBER() et filtrer par numéro de ligne.",
        "Utiliser PARTITION BY avec LIMIT pour chaque partition."
      ],
      "answer": "Keyset pagination (seek method) : `WHERE (trade_date, id) > (:last_date, :last_id) ORDER BY trade_date, id LIMIT 100` — utilise un index, performance constante peu importe la page.",
      "explanation": "Problème OFFSET : `LIMIT 100 OFFSET 10000` → le SGBD lit et jette 10000 lignes avant de retourner 100. Performance dégradée exponentiellement avec le numéro de page. Keyset pagination : on se souvient du dernier élément vu et on démarre de là. `WHERE id > :last_id LIMIT 100` si tri par id. Condition composite pour les tris multi-colonnes : `(trade_date, id) > (:last_date, :last_id)`. Performance : O(log n) via index peu importe la page. Limitation : pas de saut aléatoire vers la page 500. En finance : export par lots de données historiques."
    },
    {
      "question": "[AVANCÉ] Qu'est-ce que `EXPLAIN (BUFFERS, ANALYZE)` révèle en plus de `EXPLAIN ANALYZE` simple ?",
      "options": [
        "Il n'y a pas de différence.",
        "L'option BUFFERS affiche le nombre de pages lues depuis le cache (shared_buffers) et depuis le disque — révèle si la requête est limitée par le cache ou par les I/O disque.",
        "BUFFERS affiche la mémoire consommée par chaque nœud du plan.",
        "BUFFERS active automatiquement les index manquants."
      ],
      "answer": "L'option BUFFERS affiche le nombre de pages lues depuis le cache (shared_buffers) et depuis le disque — révèle si la requête est limitée par le cache ou par les I/O disque.",
      "explanation": "`EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` : `shared_hit` = pages lues depuis le cache PostgreSQL (rapide). `shared_read` = pages lues depuis le disque ou l'OS cache (lent). `shared_written` = pages écrites (dirty). Si `shared_read` est élevé → la table ne tient pas en mémoire → augmenter `shared_buffers` ou ajouter un index pour réduire les pages lues. `local_hit/read` : tables temporaires. En production : une requête avec beaucoup de `shared_read` sera lente au premier appel (cold cache) et rapide ensuite (warm cache)."
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
