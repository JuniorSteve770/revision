// src/projects/Project3/pages/Page8_SQL.js

import React, { useState, useEffect } from "react";
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
    }
  ],
  avance: [
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
    },
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
    }
  ]
};

const Flashcard = ({ slide }) => (
  <div className="flashcard">
    <h3 className="question">{slide.question}</h3>
    <p className="answer" style={{ whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: "1.5" }}
      dangerouslySetInnerHTML={{ __html: slide.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>") }}
    />
  </div>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <div className="timer">⏱ {timeLeft}s</div>
    <h3 className="question" style={{ fontSize: "12px" }}>{question}</h3>
    <div className="options">
      {options.map((opt, i) => (
        <button key={i} className="option-btn" onClick={() => onAnswerClick(opt)}
          style={{ fontSize: "11px", textAlign: "left", padding: "6px 10px", marginBottom: "4px", width: "100%" }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Results = ({ scores }) => (
  <div className="results">
    <h2>🎯 Résultats</h2>
    <p>Niveau Moyen : {scores.moyen} / {questions.moyen.length}</p>
    <p>Niveau Avancé : {scores.avance} / {questions.avance.length}</p>
    <p>Total : {scores.moyen + scores.avance} / {questions.moyen.length + questions.avance.length}</p>
  </div>
);

const Page8_SQL = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
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
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
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
      } else {
        handleNextQuestion();
      }
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
      }, 12000);
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
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            SQL Senior 🔹{" "}
            {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
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
          {message && (
            <p className="message" style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page8_SQL;
