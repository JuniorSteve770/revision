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
    }
