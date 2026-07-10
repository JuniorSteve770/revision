// src/projects/BackendInterview/SQLAdvancedSeniorQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — SQL Server niveau senior",
    answer:
      "◆ **Définition** : 7 domaines qui séparent un profil confirmé d'un profil senior sur SQL Server\n◆ **Jointures & agrégation** : au-delà de la syntaxe, comprendre les effets de bord (doublons, NULL)\n◆ **CTE & fonctions de fenêtre** : requêtage analytique moderne, souvent mal maîtrisé\n◆ **Index & plans d'exécution** : comprendre POURQUOI une requête est lente, pas juste l'écrire\n◆ **Objets de base** : vues, fonctions, procédures, triggers — savoir quand NE PAS les utiliser\n⚠️ Ce fichier contient volontairement des questions à distracteurs proches — lisez chaque option jusqu'au bout",
  },
  {
    question: "Jointures complexes — LEFT JOIN et le piège du WHERE",
    answer:
      "◆ **Définition** : INNER ne garde que les correspondances des deux côtés, LEFT garde toutes les lignes de gauche même sans correspondance (NULL à droite)\n◆ **SELF JOIN** : une table jointe à elle-même (ex: comparer un employé à son manager dans la même table)\n◆ **FULL JOIN** : garde toutes les lignes des deux côtés, avec NULL là où il n'y a pas de correspondance\n◆ **⚠️ PIÈGE** : `LEFT JOIN B ON ... WHERE B.Col = X` annule l'effet du LEFT JOIN — les lignes sans correspondance (B.Col = NULL) sont éliminées par le WHERE, ce qui revient à un INNER JOIN déguisé\n◆ **Cas d'usage** : pour filtrer sur B tout en gardant l'effet LEFT, il faut mettre la condition dans le ON, pas dans le WHERE\n\n```sql\n-- Piège : redevient un INNER JOIN\nSELECT * FROM Orders o LEFT JOIN Executions e ON o.Id = e.OrderId WHERE e.Status = 'Filled';\n-- Correct : garde le LEFT JOIN\nSELECT * FROM Orders o LEFT JOIN Executions e ON o.Id = e.OrderId AND e.Status = 'Filled';\n```",
  },
  {
    question: "GROUP BY / HAVING / agrégats — les subtilités avec NULL",
    answer:
      "◆ **Définition** : les fonctions d'agrégation (SUM, AVG, COUNT) ignorent les NULL, sauf COUNT(*)\n◆ **COUNT(*)** : compte TOUTES les lignes, y compris celles avec des colonnes NULL\n◆ **COUNT(colonne)** : compte uniquement les lignes où cette colonne N'EST PAS NULL\n◆ **⚠️ PIÈGE** : COUNT(*) et COUNT(colonne) peuvent donner des résultats différents sur la même table si la colonne contient des NULL\n◆ **HAVING sans agrégat** : possible mais rare, équivalent alors à un WHERE appliqué après regroupement\n◆ **Cas d'usage** : COUNT(ExecutedPrice) pour compter uniquement les ordres réellement exécutés (prix renseigné), vs COUNT(*) pour tous les ordres",
  },
  {
    question: "CTE récursives — ancre, récursion, MAXRECURSION",
    answer:
      "◆ **Définition** : une CTE récursive combine une requête ancre (cas de base) et une requête récursive (référence à elle-même), unies par UNION ALL\n◆ **MAXRECURSION** : limite le nombre d'itérations (défaut 100), évite une boucle infinie\n◆ **⚠️ PIÈGE** : une CTE (récursive ou non) n'est PAS matérialisée en mémoire comme une table temp — elle est réévaluée à chaque référence, sauf optimisation du moteur\n◆ **Cas d'usage** : parcourir une hiérarchie (organigramme, arborescence de catégories, dépendances entre ordres liés)\n\n```sql\nWITH Hierarchie AS (\n    SELECT EmployeeId, ManagerId, 0 AS Niveau FROM Employees WHERE ManagerId IS NULL\n    UNION ALL\n    SELECT e.EmployeeId, e.ManagerId, h.Niveau + 1\n    FROM Employees e JOIN Hierarchie h ON e.ManagerId = h.EmployeeId\n)\nSELECT * FROM Hierarchie OPTION (MAXRECURSION 50);\n```",
  },
  {
    question: "Fonctions de fenêtre — ROW_NUMBER vs RANK vs DENSE_RANK",
    answer:
      "◆ **Définition** : trois fonctions de classement qui se comportent différemment face aux ex-aequo (valeurs égales)\n◆ **ROW_NUMBER()** : numérotation unique et continue, MÊME en cas d'égalité (1,2,3,4...)\n◆ **RANK()** : égalité = même rang, mais SAUTE les rangs suivants (1,2,2,4...)\n◆ **DENSE_RANK()** : égalité = même rang, SANS sauter de rang (1,2,2,3...)\n◆ **⚠️ PIÈGE CLASSIQUE** : confondre RANK et DENSE_RANK sur un jeu de données avec égalités — c'est LA question senior par excellence\n◆ **Cas d'usage** : classer les meilleurs prix par symbole avec ROW_NUMBER() OVER (PARTITION BY Symbol ORDER BY Price)",
  },
  {
    question: "Fonctions de fenêtre — LAG, LEAD, PARTITION BY vs GROUP BY",
    answer:
      "◆ **Définition** : LAG accède à la ligne précédente, LEAD à la ligne suivante, selon un ORDER BY défini dans OVER\n◆ **PARTITION BY** : découpe le jeu de résultats en groupes pour le calcul de la fonction fenêtre, SANS réduire le nombre de lignes retournées\n◆ **⚠️ PIÈGE MAJEUR** : contrairement à GROUP BY qui condense les lignes en un résultat par groupe, PARTITION BY conserve TOUTES les lignes d'origine, chacune enrichie du résultat de la fonction fenêtre\n◆ **Cas d'usage** : calculer la variation de prix entre deux exécutions consécutives d'un même ordre avec LAG\n\n```sql\nSELECT OrderId, Price,\n    LAG(Price) OVER (PARTITION BY OrderId ORDER BY ExecTime) AS PrixPrecedent\nFROM Executions;\n```",
  },
  {
    question: "Index composites — l'ordre des colonnes compte",
    answer:
      "◆ **Définition** : un index composite (multi-colonnes) suit la règle du 'left-most prefix' — il n'est pleinement exploitable que si la requête filtre en commençant par la première colonne de l'index\n◆ **⚠️ PIÈGE** : un index sur (Symbol, Status) sert efficacement une requête filtrant sur Symbol seul OU sur Symbol+Status, mais PAS une requête filtrant uniquement sur Status\n◆ **INCLUDE** : ajoute des colonnes à l'index sans qu'elles participent au tri/recherche, évite un Key Lookup\n◆ **Cas d'usage** : index (Symbol, Status) INCLUDE (Price) pour des requêtes filtrant par Symbol puis Status, retournant aussi le Price\n\n```sql\nCREATE NONCLUSTERED INDEX IX_Orders_Symbol_Status\n    ON Orders(Symbol, Status) INCLUDE (Price);\n```",
  },
  {
    question: "Plans d'exécution — Seek vs Scan, Hash Match vs Nested Loop",
    answer:
      "◆ **Définition** : le plan d'exécution montre COMMENT SQL Server accède aux données et les combine\n◆ **Index Seek** : accès ciblé via un index, très efficace pour peu de lignes\n◆ **Table Scan / Index Scan** : parcours de toute la table/index — pas toujours mauvais si on doit lire presque toutes les lignes\n◆ **Nested Loop** : efficace quand une des deux tables jointes est petite\n◆ **Hash Match** : efficace pour joindre deux grands ensembles sans index utile, mais coûteux en mémoire\n◆ **⚠️ PIÈGE** : un Table Scan n'est PAS automatiquement un problème — sur une petite table ou quand on lit 90% des lignes, il peut être plus rapide qu'un Seek + Key Lookup répété",
  },
  {
    question: "Vues — simples vs indexées, un piège de conception fréquent",
    answer:
      "◆ **Définition** : une vue standard est une requête SQL nommée, réexécutée à chaque appel — elle ne stocke AUCUNE donnée physiquement\n◆ **Vue indexée (materialized view)** : matérialise réellement les données sur disque via un index clustered unique, avec des contraintes strictes de création\n◆ **⚠️ PIÈGE** : croire qu'une vue standard 'accélère' une requête — elle ne fait qu'encapsuler du SQL, sans optimisation propre, sauf si elle est indexée\n◆ **Cas d'usage** : une vue standard pour simplifier une requête complexe répétée, une vue indexée pour un agrégat coûteux fréquemment interrogé en lecture",
  },
  {
    question: "Fonctions — scalaires vs table-valued, impact performance",
    answer:
      "◆ **Définition** : deux types de fonctions utilisateur aux implications de performance très différentes\n◆ **Fonction scalaire (retourne une valeur unique)** : appelée LIGNE PAR LIGNE dans un SELECT, souvent désastreuse en performance sur de gros volumes (avant SQL Server 2019 et son inlining)\n◆ **Fonction table-valued inline (retourne une table via une seule requête)** : optimisée par SQL Server presque comme une vue, bien plus performante\n◆ **⚠️ PIÈGE** : utiliser une fonction scalaire dans le SELECT ou le WHERE d'une requête sur une grande table peut transformer un Index Seek en exécution ligne par ligne cachée (RBAR — Row By Agonizing Row)\n◆ **Cas d'usage** : préférer une fonction table-valued inline ou une vue à une fonction scalaire pour tout calcul répété sur beaucoup de lignes",
  },
  {
    question: "Triggers — AFTER vs INSTEAD OF",
    answer:
      "◆ **Définition** : un trigger exécute du code automatiquement en réaction à un événement (INSERT/UPDATE/DELETE)\n◆ **AFTER (ou FOR)** : s'exécute APRÈS que l'opération a été appliquée — utilisable uniquement sur des tables\n◆ **INSTEAD OF** : REMPLACE l'opération d'origine par le code du trigger — utilisable sur des tables ET des vues (notamment pour rendre modifiable une vue complexe)\n◆ **⚠️ PIÈGE** : un trigger AFTER INSERT peut lui-même déclencher une IDENTITY sur une autre table, perturbant @@IDENTITY côté application (voir SCOPE_IDENTITY())\n◆ **Cas d'usage** : INSTEAD OF pour permettre l'UPDATE d'une vue joignant plusieurs tables, AFTER pour un audit automatique après modification",
  },
  {
    question: "Procédures stockées — quand elles ne sont PAS le bon choix",
    answer:
      "◆ **Définition** : bloc SQL précompilé, paramétrable, réutilisable côté serveur\n◆ **Avantage classique** : réduit les allers-retours réseau, centralise la logique, plan d'exécution mis en cache\n◆ **⚠️ PIÈGE 'parameter sniffing'** : le premier plan d'exécution généré est mis en cache selon les PREMIERS paramètres utilisés — si les volumes de données varient énormément selon les paramètres, ce plan peut devenir très inefficace pour d'autres appels\n◆ **Cas d'usage** : `OPTION (RECOMPILE)` ou des variables locales pour contourner un mauvais parameter sniffing sur une procédure sensible aux volumes",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: JOINTURES ====================
    {
      question:
        "[Jointures] Que retourne cette requête si un ordre n'a AUCUNE exécution correspondante dans la table Executions ?\n\n```sql\nSELECT o.OrderId, e.ExecId\nFROM Orders o\nLEFT JOIN Executions e ON o.OrderId = e.OrderId;\n```",
      options: [
        "L'ordre n'apparaît pas du tout dans le résultat",
        "Une erreur SQL est levée",
        "L'ordre apparaît avec e.ExecId = NULL",
        "L'ordre apparaît en double",
      ],
      answer: "L'ordre apparaît avec e.ExecId = NULL",
      explanation:
        "LEFT JOIN garantit que toutes les lignes de la table de gauche (Orders) apparaissent, même sans correspondance à droite. Dans ce cas, les colonnes de la table de droite (e.ExecId) sont simplement NULL.",
    },
    {
      question:
        "[Jointures] Quel est l'effet réel de cette requête, en apparence un LEFT JOIN ?\n\n```sql\nSELECT o.OrderId, e.ExecId\nFROM Orders o\nLEFT JOIN Executions e ON o.OrderId = e.OrderId\nWHERE e.Status = 'Filled';\n```",
      options: [
        "Elle se comporte exactement comme un vrai LEFT JOIN, incluant les ordres sans exécution",
        "Le WHERE sur e.Status élimine les lignes où e.Status est NULL (ordres sans exécution), rendant cette requête équivalente à un INNER JOIN",
        "Elle provoque une erreur car WHERE ne peut pas filtrer une colonne d'une table jointe en LEFT JOIN",
        "Elle retourne uniquement les ordres SANS exécution",
      ],
      answer: "Le WHERE sur e.Status élimine les lignes où e.Status est NULL (ordres sans exécution), rendant cette requête équivalente à un INNER JOIN",
      explanation:
        "C'est le piège classique : le WHERE s'applique APRÈS la jointure. Pour les ordres sans exécution, e.Status vaut NULL, et NULL = 'Filled' n'est jamais vrai — ces lignes sont donc éliminées, annulant l'effet recherché du LEFT JOIN.",
    },
    {
      question:
        "[Jointures] Dans un SELF JOIN classique comparant chaque employé à son manager (table Employees avec colonne ManagerId), quelle syntaxe est correcte ?",
      options: [
        "SELECT e.Name, m.Name FROM Employees e SELF JOIN Employees m ON e.ManagerId = m.EmployeeId",
        "SELECT e.Name, m.Name FROM Employees e JOIN Employees m ON e.ManagerId = m.EmployeeId",
        "SELECT e.Name, m.Name FROM Employees SELF",
        "Un SELF JOIN nécessite obligatoirement deux tables physiquement distinctes",
      ],
      answer: "SELECT e.Name, m.Name FROM Employees e JOIN Employees m ON e.ManagerId = m.EmployeeId",
      explanation:
        "Il n'existe pas de mot-clé SQL 'SELF JOIN' — un SELF JOIN est simplement une jointure classique (INNER, LEFT...) où la même table est référencée deux fois avec des alias différents (e et m ici).",
    },
    {
      question:
        "[Jointures] Quelle est la différence entre INNER JOIN et FULL JOIN sur deux tables A et B ?",
      options: [
        "Il n'y a aucune différence, ce sont deux syntaxes équivalentes",
        "INNER JOIN ne garde que les lignes ayant une correspondance dans les deux tables, FULL JOIN garde toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance",
        "FULL JOIN est toujours plus rapide qu'INNER JOIN",
        "INNER JOIN garde toutes les lignes, FULL JOIN seulement les correspondances",
      ],
      answer: "INNER JOIN ne garde que les lignes ayant une correspondance dans les deux tables, FULL JOIN garde toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance",
      explanation:
        "INNER JOIN est le plus restrictif (intersection). FULL JOIN (FULL OUTER JOIN) est le plus permissif : il combine l'effet d'un LEFT JOIN et d'un RIGHT JOIN, gardant toutes les lignes des deux côtés.",
    },

    // ==================== SECTION B: GROUP BY / HAVING ====================
    {
      question:
        "[GROUP BY] Sur une table Orders où 20% des lignes ont ExecutedPrice = NULL, quelle différence attendre entre COUNT(*) et COUNT(ExecutedPrice) ?",
      options: [
        "Aucune différence, COUNT(*) et COUNT(colonne) donnent toujours le même résultat",
        "COUNT(*) compte toutes les lignes (y compris ExecutedPrice NULL), COUNT(ExecutedPrice) ne compte que les lignes où ExecutedPrice n'est pas NULL, donc un résultat plus faible",
        "COUNT(ExecutedPrice) provoque une erreur si la colonne contient des NULL",
        "COUNT(*) ignore les NULL, COUNT(ExecutedPrice) les compte",
      ],
      answer: "COUNT(*) compte toutes les lignes (y compris ExecutedPrice NULL), COUNT(ExecutedPrice) ne compte que les lignes où ExecutedPrice n'est pas NULL, donc un résultat plus faible",
      explanation:
        "COUNT(*) compte le nombre de lignes sans considération de colonne. COUNT(colonne) ignore les valeurs NULL de cette colonne spécifique — sur cette table, COUNT(ExecutedPrice) sera donc inférieur de 20% à COUNT(*).",
    },
    {
      question:
        "[HAVING] Pourquoi cette requête est-elle invalide ?\n\n```sql\nSELECT Symbol, Price\nFROM Orders\nGROUP BY Symbol\nHAVING COUNT(*) > 10;\n```",
      options: [
        "HAVING ne peut jamais être utilisé avec GROUP BY",
        "Price n'est ni dans le GROUP BY, ni enveloppé dans une fonction d'agrégation — SQL Server ne peut pas déterminer quelle valeur de Price retourner pour chaque groupe",
        "COUNT(*) > 10 est une syntaxe interdite dans HAVING",
        "Il manque un WHERE avant le GROUP BY",
      ],
      answer: "Price n'est ni dans le GROUP BY, ni enveloppé dans une fonction d'agrégation — SQL Server ne peut pas déterminer quelle valeur de Price retourner pour chaque groupe",
      explanation:
        "En mode standard, toute colonne du SELECT doit soit apparaître dans le GROUP BY, soit être agrégée (SUM, MAX, AVG...). Ici Price ne remplit aucune des deux conditions : la requête est ambiguë et donc rejetée.",
    },
    {
      question:
        "[GROUP BY] Quelle est la différence entre GROUP BY Symbol, Status et GROUP BY Symbol tout seul ?",
      options: [
        "Aucune différence de résultat",
        "GROUP BY Symbol, Status crée un groupe distinct pour chaque COMBINAISON unique de Symbol et Status, alors que GROUP BY Symbol crée un seul groupe par Symbol, agrégeant tous les Status ensemble",
        "GROUP BY Symbol, Status est une syntaxe invalide en SQL Server",
        "GROUP BY Symbol, Status ignore automatiquement la colonne Status",
      ],
      answer: "GROUP BY Symbol, Status crée un groupe distinct pour chaque COMBINAISON unique de Symbol et Status, alors que GROUP BY Symbol crée un seul groupe par Symbol, agrégeant tous les Status ensemble",
      explanation:
        "GROUP BY multi-colonnes regroupe sur la combinaison de toutes les colonnes listées. Un même Symbol peut donc apparaître plusieurs fois dans le résultat (une ligne par Status différent), contrairement à GROUP BY Symbol seul qui produit une unique ligne par Symbol.",
    },

    // ==================== SECTION C: CTE / CTE RECURSIVES ====================
    {
      question:
        "[CTE] Quels sont les deux composants obligatoires d'une CTE récursive ?",
      options: [
        "Une clause WHERE et une clause GROUP BY",
        "Une requête ancre (cas de base, sans référence à la CTE) et une requête récursive (référence à la CTE elle-même), unies par UNION ALL",
        "Deux CTE distinctes, l'une appelant l'autre",
        "Une procédure stockée et une fonction",
      ],
      answer: "Une requête ancre (cas de base, sans référence à la CTE) et une requête récursive (référence à la CTE elle-même), unies par UNION ALL",
      explanation:
        "Une CTE récursive suit toujours le pattern : ancre UNION ALL requête récursive référençant la CTE. L'ancre définit le point de départ, la partie récursive construit les niveaux suivants jusqu'à ce qu'elle ne retourne plus de lignes.",
    },
    {
      question:
        "[CTE] Que fait l'option MAXRECURSION dans une CTE récursive ?",
      options: [
        "Elle accélère systématiquement l'exécution de la CTE",
        "Elle limite le nombre maximal d'itérations récursives autorisées (défaut 100), évitant une boucle potentiellement infinie",
        "Elle transforme la CTE récursive en table temporaire",
        "Elle est obligatoire pour toute CTE, même non récursive",
      ],
      answer: "Elle limite le nombre maximal d'itérations récursives autorisées (défaut 100), évitant une boucle potentiellement infinie",
      explanation:
        "MAXRECURSION (via OPTION (MAXRECURSION n)) protège contre une récursion infinie (ex: données cycliques mal formées). La valeur 0 désactive complètement la limite (à utiliser avec prudence).",
    },
    {
      question:
        "[CTE] Une CTE (non récursive) est-elle matérialisée en mémoire comme une table temporaire, une fois définie avec WITH ?",
      options: [
        "Oui, systématiquement, dès sa définition",
        "Non, une CTE est une définition de requête réévaluée à chaque référence dans la requête suivante — elle n'est pas physiquement stockée ni indexable comme une #TempTable",
        "Oui, mais uniquement si elle contient un ORDER BY",
        "Cela dépend uniquement de la version de SQL Server utilisée",
      ],
      answer: "Non, une CTE est une définition de requête réévaluée à chaque référence dans la requête suivante — elle n'est pas physiquement stockée ni indexable comme une #TempTable",
      explanation:
        "Contrairement à une idée reçue fréquente, une CTE n'est PAS matérialisée par défaut. C'est essentiellement une macro SQL réutilisable dans la requête immédiatement suivante, sans structure physique indexable.",
    },

    // ==================== SECTION D: FONCTIONS DE FENETRE ====================
    {
      question:
        "[Fonctions fenêtre] Sur un jeu de données où deux lignes ont exactement le même Price (ex-aequo), quelle est la différence entre RANK() et DENSE_RANK() ?",
      options: [
        "Il n'y a aucune différence, elles produisent toujours le même résultat",
        "RANK() attribue le même rang aux ex-aequo puis SAUTE le(s) rang(s) suivant(s) (1,2,2,4), DENSE_RANK() attribue le même rang aux ex-aequo SANS sauter de rang (1,2,2,3)",
        "DENSE_RANK() saute des rangs, RANK() n'en saute jamais",
        "RANK() ne peut pas gérer les ex-aequo, seul DENSE_RANK() le peut",
      ],
      answer: "RANK() attribue le même rang aux ex-aequo puis SAUTE le(s) rang(s) suivant(s) (1,2,2,4), DENSE_RANK() attribue le même rang aux ex-aequo SANS sauter de rang (1,2,2,3)",
      explanation:
        "C'est LA distinction classique à connaître : avec 2 lignes classées 2ème ex-aequo, RANK() donnera 1,2,2,4 (le rang 3 est 'sauté'), tandis que DENSE_RANK() donnera 1,2,2,3 (pas de trou dans la numérotation).",
    },
    {
      question:
        "[Fonctions fenêtre] Que fait ROW_NUMBER() en présence de valeurs ex-aequo dans la colonne de tri (ORDER BY) ?",
      options: [
        "Elle attribue le même numéro à toutes les lignes ex-aequo",
        "Elle attribue un numéro unique et strictement croissant à chaque ligne, même en cas d'égalité (l'ordre entre elles dépend alors d'un critère non garanti sauf tri explicite supplémentaire)",
        "Elle lève une exception en cas d'ex-aequo",
        "Elle se comporte exactement comme DENSE_RANK()",
      ],
      answer: "Elle attribue un numéro unique et strictement croissant à chaque ligne, même en cas d'égalité (l'ordre entre elles dépend alors d'un critère non garanti sauf tri explicite supplémentaire)",
      explanation:
        "ROW_NUMBER() garantit toujours une numérotation unique (1,2,3,4...), quel que soit le nombre d'ex-aequo. Contrairement à RANK/DENSE_RANK, il n'y a jamais de doublon de numéro — mais l'ordre exact entre deux valeurs ex-aequo n'est pas garanti sans critère de tri supplémentaire.",
    },
    {
      question:
        "[Fonctions fenêtre] Quelle est la différence essentielle entre PARTITION BY (dans une fonction fenêtre) et GROUP BY ?",
      options: [
        "PARTITION BY et GROUP BY sont strictement interchangeables",
        "GROUP BY condense les lignes en une seule ligne par groupe, alors que PARTITION BY conserve TOUTES les lignes d'origine, chacune enrichie du résultat calculé pour sa partition",
        "PARTITION BY ne peut être utilisé qu'avec COUNT",
        "GROUP BY conserve toutes les lignes, PARTITION BY les condense",
      ],
      answer: "GROUP BY condense les lignes en une seule ligne par groupe, alors que PARTITION BY conserve TOUTES les lignes d'origine, chacune enrichie du résultat calculé pour sa partition",
      explanation:
        "C'est une confusion très fréquente chez les profils intermédiaires : GROUP BY réduit le nombre de lignes du résultat à un par groupe. PARTITION BY (utilisé dans OVER()) ne réduit RIEN — chaque ligne d'origine reste présente, avec en plus la valeur calculée pour sa partition.",
    },

    // ==================== SECTION E: INDEX AVANCES ====================
    {
      question:
        "[Index composites] Un index composite existe sur (Symbol, Status). Cette requête peut-elle pleinement exploiter cet index ?\n\n```sql\nSELECT * FROM Orders WHERE Status = 'Open';\n```",
      options: [
        "Oui, un index composite peut toujours être utilisé quelle que soit la colonne filtrée",
        "Non, car la requête ne filtre pas sur Symbol (la première colonne de l'index) — l'index composite (Symbol, Status) ne peut pas être pleinement exploité pour une recherche uniquement sur Status",
        "Oui, car Status fait partie de l'index, peu importe sa position",
        "Cela dépend uniquement de la version de SQL Server",
      ],
      answer: "Non, car la requête ne filtre pas sur Symbol (la première colonne de l'index) — l'index composite (Symbol, Status) ne peut pas être pleinement exploité pour une recherche uniquement sur Status",
      explanation:
        "Un index composite suit la règle du 'left-most prefix' : il est trié d'abord par Symbol, puis par Status au sein de chaque Symbol. Chercher uniquement sur Status équivaut à chercher un mot dans un dictionnaire trié par ordre alphabétique mais en ne connaissant que sa deuxième lettre — l'index ne peut pas être utilisé efficacement.",
    },
    {
      question:
        "[Index] Que permet la clause INCLUDE dans la création d'un index non-clustered ?",
      options: [
        "D'ajouter des colonnes supplémentaires à l'index (hors clé de tri) pour répondre entièrement à une requête sans retourner à la table (évite un Key Lookup)",
        "D'inclure automatiquement toutes les colonnes de la table dans l'index",
        "De fusionner deux index existants en un seul",
        "INCLUDE est réservé exclusivement aux index clustered",
      ],
      answer: "D'ajouter des colonnes supplémentaires à l'index (hors clé de tri) pour répondre entièrement à une requête sans retourner à la table (évite un Key Lookup)",
      explanation:
        "INCLUDE ajoute des colonnes 'passagères' à l'index, non triées mais disponibles en lecture. Si toutes les colonnes nécessaires à une requête sont couvertes par la clé + INCLUDE, SQL Server n'a pas besoin de retourner à la table (Key Lookup), ce qui accélère significativement la requête.",
    },

    // ==================== SECTION F: PLANS D'EXECUTION ====================
    {
      question:
        "[Plans d'exécution] Un Table Scan apparaît dans le plan d'exécution d'une requête. Cela signifie-t-il automatiquement que la requête est mal optimisée ?",
      options: [
        "Oui, un Table Scan est toujours le signe d'un problème de performance à corriger",
        "Pas nécessairement — sur une petite table, ou quand la requête doit lire la grande majorité des lignes, un Table Scan peut être plus efficace qu'un Index Seek combiné à de nombreux Key Lookups",
        "Un Table Scan ne peut jamais apparaître si un index existe sur la table",
        "Un Table Scan signifie que la requête contient une erreur de syntaxe",
      ],
      answer: "Pas nécessairement — sur une petite table, ou quand la requête doit lire la grande majorité des lignes, un Table Scan peut être plus efficace qu'un Index Seek combiné à de nombreux Key Lookups",
      explanation:
        "C'est un piège classique en entretien senior : un Table Scan n'est pas intrinsèquement mauvais. Pour une petite table ou une requête qui retourne la majorité des lignes, parcourir toute la table peut être moins coûteux que de nombreux accès aléatoires via un index.",
    },
  ],

  avance: [
    // ==================== SECTION G: JOINTURES AVANCE ====================
    {
      question:
        "[Jointures] Une jointure entre Orders (1 million de lignes) et Executions (5 millions de lignes, plusieurs exécutions par ordre) produit un résultat de 5 millions de lignes. Pourquoi ce nombre, et non 1 million ?",
      options: [
        "C'est une erreur, une jointure ne peut jamais retourner plus de lignes que la plus petite table",
        "Une relation one-to-many entre Orders et Executions signifie que chaque ordre ayant plusieurs exécutions apparaît une fois PAR exécution correspondante dans le résultat de la jointure, d'où potentiellement plus de lignes que la table Orders elle-même",
        "SQL Server déduplique automatiquement les résultats de jointure",
        "Cela ne peut se produire qu'avec un FULL JOIN",
      ],
      answer: "Une relation one-to-many entre Orders et Executions signifie que chaque ordre ayant plusieurs exécutions apparaît une fois PAR exécution correspondante dans le résultat de la jointure, d'où potentiellement plus de lignes que la table Orders elle-même",
      explanation:
        "C'est un effet de bord courant et parfois source de bugs (ex: un SUM ultérieur sur une colonne d'Orders serait faussé par la duplication) : une jointure one-to-many multiplie mécaniquement les lignes du côté 'one' par le nombre de correspondances côté 'many'.",
    },
    {
      question:
        "[Jointures] Dans un SELF JOIN visant à trouver tous les ordres ayant le même Symbol et le même Price qu'un autre ordre (mais avec un OrderId différent), pourquoi la condition `a.OrderId <> b.OrderId` est-elle indispensable ?",
      options: [
        "Elle ne sert à rien, c'est une condition facultative",
        "Sans cette condition, chaque ordre serait comparé à lui-même, produisant systématiquement une correspondance triviale (un ordre a toujours le même Symbol/Price que lui-même)",
        "Cette condition sert uniquement à trier les résultats",
        "OrderId <> OrderId provoque toujours une erreur de syntaxe en SQL Server",
      ],
      answer: "Sans cette condition, chaque ordre serait comparé à lui-même, produisant systématiquement une correspondance triviale (un ordre a toujours le même Symbol/Price que lui-même)",
      explanation:
        "Dans un SELF JOIN, sans exclusion explicite de la comparaison d'une ligne avec elle-même, chaque ligne matchera automatiquement sa propre copie (mêmes valeurs), polluant le résultat avec des paires triviales sans intérêt.",
    },

    // ==================== SECTION H: GROUP BY / CTE AVANCE ====================
    {
      question:
        "[GROUP BY] Que fait exactement COUNT(DISTINCT Symbol) par rapport à COUNT(Symbol) sur une table où plusieurs ordres partagent le même Symbol ?",
      options: [
        "Les deux retournent toujours le même résultat",
        "COUNT(Symbol) compte toutes les lignes où Symbol n'est pas NULL (avec doublons), COUNT(DISTINCT Symbol) compte le nombre de VALEURS DISTINCTES de Symbol, sans compter les doublons",
        "COUNT(DISTINCT Symbol) est une syntaxe invalide en SQL Server",
        "COUNT(DISTINCT Symbol) compte uniquement les valeurs NULL",
      ],
      answer: "COUNT(Symbol) compte toutes les lignes où Symbol n'est pas NULL (avec doublons), COUNT(DISTINCT Symbol) compte le nombre de VALEURS DISTINCTES de Symbol, sans compter les doublons",
      explanation:
        "Sur une table de 1000 ordres répartis sur seulement 50 symboles distincts, COUNT(Symbol) retournerait 1000 (ou moins si NULL présents), tandis que COUNT(DISTINCT Symbol) retournerait 50 — le nombre de valeurs uniques.",
    },
    {
      question:
        "[CTE] Peut-on chaîner plusieurs CTE dans une seule clause WITH, chacune pouvant référencer les précédentes ?",
      options: [
        "Non, une seule CTE est autorisée par requête",
        "Oui, en les séparant par des virgules : WITH CTE1 AS (...), CTE2 AS (SELECT ... FROM CTE1 ...), chaque CTE pouvant référencer celles définies avant elle",
        "Oui, mais chaque CTE doit obligatoirement être récursive",
        "Non, il faut créer une #TempTable intermédiaire pour chaîner des requêtes",
      ],
      answer: "Oui, en les séparant par des virgules : WITH CTE1 AS (...), CTE2 AS (SELECT ... FROM CTE1 ...), chaque CTE pouvant référencer celles définies avant elle",
      explanation:
        "SQL Server permet de définir plusieurs CTE dans une seule clause WITH, séparées par des virgules. Chaque CTE peut référencer les CTE précédemment définies dans la même clause, ce qui permet de décomposer une requête complexe en étapes lisibles.",
    },

    // ==================== SECTION I: FONCTIONS FENETRE AVANCE ====================
    {
      question:
        "[Fonctions fenêtre] Quelle est la différence entre `SUM(Price) OVER (PARTITION BY Symbol)` et `SUM(Price) OVER (PARTITION BY Symbol ORDER BY ExecTime)` (sans ROWS/RANGE explicite) ?",
      options: [
        "Il n'y a aucune différence, les deux calculent toujours la somme totale de la partition",
        "Sans ORDER BY, la somme totale de la partition est calculée pour chaque ligne. Avec ORDER BY (et sans ROWS/RANGE explicite), le comportement par défaut calcule une somme CUMULATIVE (running total) jusqu'à la ligne courante",
        "L'ajout d'un ORDER BY dans OVER() provoque systématiquement une erreur avec SUM",
        "ORDER BY dans OVER() trie uniquement l'affichage final, sans impact sur le calcul",
      ],
      answer: "Sans ORDER BY, la somme totale de la partition est calculée pour chaque ligne. Avec ORDER BY (et sans ROWS/RANGE explicite), le comportement par défaut calcule une somme CUMULATIVE (running total) jusqu'à la ligne courante",
      explanation:
        "C'est une nuance senior très fréquemment mal comprise : ajouter un ORDER BY à l'intérieur de OVER() change le cadre de calcul par défaut (RANGE UNBOUNDED PRECEDING AND CURRENT ROW), transformant une somme totale en somme cumulative ligne par ligne.",
    },
    {
      question:
        "[Fonctions fenêtre] Que retourne LAG(Price, 2) OVER (PARTITION BY OrderId ORDER BY ExecTime) pour la première ligne de chaque partition ?",
      options: [
        "Une erreur d'exécution, car il n'y a pas de ligne 2 positions avant",
        "NULL, car il n'existe pas de ligne 2 positions avant la première ligne de la partition (sauf si une valeur par défaut est explicitement fournie en 3ème paramètre)",
        "La valeur de la dernière ligne de la partition précédente",
        "0, valeur par défaut systématique de LAG",
      ],
      answer: "NULL, car il n'existe pas de ligne 2 positions avant la première ligne de la partition (sauf si une valeur par défaut est explicitement fournie en 3ème paramètre)",
      explanation:
        "LAG(colonne, offset) retourne NULL par défaut quand il n'y a pas de ligne à la position demandée (ici, 2 lignes avant la première). On peut fournir un 3ème paramètre optionnel pour définir une valeur de repli à la place de NULL.",
    },

    // ==================== SECTION J: INDEX / PLANS AVANCE ====================
    {
      question:
        "[Index] Pourquoi un Hash Match peut-il être choisi par l'optimiseur plutôt qu'un Nested Loop pour joindre deux tables volumineuses sans index utile sur la colonne de jointure ?",
      options: [
        "Un Hash Match est toujours interdit sur de grandes tables",
        "Un Nested Loop devient très coûteux quand il doit parcourir la table interne un grand nombre de fois (une fois par ligne de la table externe) sans index pour accélérer chaque recherche ; un Hash Match construit une table de hachage en une passe, plus efficace dans ce cas malgré son coût mémoire",
        "Hash Match ne peut être utilisé qu'avec des CTE récursives",
        "Nested Loop est toujours plus rapide, peu importe le volume de données",
      ],
      answer: "Un Nested Loop devient très coûteux quand il doit parcourir la table interne un grand nombre de fois (une fois par ligne de la table externe) sans index pour accélérer chaque recherche ; un Hash Match construit une table de hachage en une passe, plus efficace dans ce cas malgré son coût mémoire",
      explanation:
        "Nested Loop est excellent quand une des deux tables est petite (peu d'itérations) ou bien indexée sur la clé de jointure. Sans index, chaque itération de la boucle nécessiterait un scan complet de la table interne — Hash Match, qui ne fait qu'une passe sur chaque table, devient alors plus efficace malgré sa consommation mémoire.",
    },
    {
      question:
        "[Plans d'exécution] Que signifie un opérateur 'Key Lookup' (ou RID Lookup) dans un plan d'exécution, et pourquoi est-il souvent ciblé pour optimisation ?",
      options: [
        "Il indique que la requête contient une erreur de clé étrangère",
        "Il signifie que, après un Index Seek sur un index non-clustered, SQL Server doit retourner à la table (ou au clustered index) pour récupérer des colonnes non couvertes par cet index — répété pour chaque ligne, cela peut devenir très coûteux",
        "Il indique que la table n'a aucun index du tout",
        "Il signifie que la requête utilise obligatoirement une CTE",
      ],
      answer: "Il signifie que, après un Index Seek sur un index non-clustered, SQL Server doit retourner à la table (ou au clustered index) pour récupérer des colonnes non couvertes par cet index — répété pour chaque ligne, cela peut devenir très coûteux",
      explanation:
        "Un Key Lookup répété (une fois par ligne trouvée par le Seek) peut devenir aussi coûteux, voire plus, que le Seek lui-même sur de nombreuses lignes. La solution classique est d'ajouter les colonnes manquantes à l'index via INCLUDE, créant un index couvrant qui élimine ce Key Lookup.",
    },

    // ==================== SECTION K: OBJETS DE BASE AVANCE ====================
    {
      question:
        "[Vues] Pourquoi croire qu'une vue standard (non indexée) 'accélère' automatiquement les requêtes qui l'utilisent est une erreur fréquente ?",
      options: [
        "Une vue standard ne stocke aucune donnée physiquement — elle est réexécutée comme la requête SQL sous-jacente à chaque appel, sans optimisation propre au-delà de ce que ferait la requête directe",
        "Les vues sont en réalité toujours plus lentes qu'une requête directe, sans exception",
        "Une vue standard précalcule et stocke systématiquement ses résultats",
        "Les vues ne peuvent jamais être utilisées dans une jointure",
      ],
      answer: "Une vue standard ne stocke aucune donnée physiquement — elle est réexécutée comme la requête SQL sous-jacente à chaque appel, sans optimisation propre au-delà de ce que ferait la requête directe",
      explanation:
        "Une vue standard est essentiellement un raccourci syntaxique pour une requête SQL. Elle n'apporte aucun gain de performance intrinsèque par rapport à écrire directement la requête équivalente — pour un vrai gain, il faut une vue INDEXÉE (matérialisée physiquement).",
    },
    {
      question:
        "[Fonctions] Pourquoi une fonction scalaire utilisateur appelée dans le SELECT d'une requête sur 1 million de lignes peut-elle dégrader drastiquement la performance (avant SQL Server 2019) ?",
      options: [
        "Une fonction scalaire est exécutée UNE SEULE FOIS pour toute la requête, donc son coût est négligeable",
        "Une fonction scalaire est généralement exécutée ligne par ligne (RBAR — Row By Agonizing Row), empêchant l'optimiseur de paralléliser ou d'optimiser efficacement l'exécution globale, contrairement à une expression SQL native",
        "Les fonctions scalaires ne peuvent techniquement pas être utilisées dans un SELECT",
        "Le problème ne concerne que les fonctions table-valued, jamais les fonctions scalaires",
      ],
      answer: "Une fonction scalaire est généralement exécutée ligne par ligne (RBAR — Row By Agonizing Row), empêchant l'optimiseur de paralléliser ou d'optimiser efficacement l'exécution globale, contrairement à une expression SQL native",
      explanation:
        "Avant l'inlining de fonctions scalaires introduit dans SQL Server 2019, une fonction scalaire dans un SELECT était appelée séparément pour chaque ligne du résultat, empêchant la parallélisation et rendant l'exécution linéairement coûteuse sur de gros volumes — un piège de performance classique.",
    },
  ],

  expert: [
    // ==================== SECTION L: SCENARIOS COMBINES SENIOR ====================
    {
      question:
        "[Scénario combiné] Une CTE récursive calcule une hiérarchie sur 500 000 lignes, puis le résultat est joint à une fonction de fenêtre RANK() PARTITION BY Niveau. La requête est lente. Quelle est la piste d'investigation la PLUS pertinente en premier lieu ?",
      options: [
        "Remplacer immédiatement RANK() par DENSE_RANK(), cela résout systématiquement les problèmes de performance",
        "Examiner le plan d'exécution pour vérifier si la CTE récursive génère un nombre d'itérations ou de lignes intermédiaires disproportionné, et envisager de matérialiser le résultat de la CTE dans une #TempTable indexée avant d'appliquer la fonction fenêtre",
        "Supprimer purement et simplement la clause PARTITION BY sans analyse",
        "Une CTE récursive ne peut techniquement pas être combinée à une fonction de fenêtre",
      ],
      answer: "Examiner le plan d'exécution pour vérifier si la CTE récursive génère un nombre d'itérations ou de lignes intermédiaires disproportionné, et envisager de matérialiser le résultat de la CTE dans une #TempTable indexée avant d'appliquer la fonction fenêtre",
      explanation:
        "Une CTE récursive sur un gros volume est souvent réexécutée à chaque itération sans matérialisation, ce qui peut exploser en nombre de lignes intermédiaires. Le réflexe senior est d'analyser le plan d'exécution, puis d'envisager une #TempTable indexée comme étape intermédiaire pour stabiliser et accélérer les étapes suivantes (dont la fonction fenêtre).",
    },
    {
      question:
        "[Scénario combiné] Une procédure stockée est rapide pour la plupart des clients, mais devient très lente pour un client dont les données représentent 40% du volume total de la table. Quelle est l'explication la plus probable ?",
      options: [
        "La procédure contient une erreur de syntaxe qui n'apparaît que pour ce client",
        "Le parameter sniffing : le plan d'exécution a été mis en cache lors d'un premier appel avec un client à faible volume, et ce plan (optimisé pour peu de lignes, ex: via Index Seek + Nested Loop) est réutilisé de façon sous-optimale pour le client à fort volume qui aurait bénéficié d'un Table Scan/Hash Match",
        "SQL Server limite arbitrairement les procédures stockées à 40% du volume d'une table",
        "Il faut nécessairement transformer la procédure stockée en fonction table-valued",
      ],
      answer: "Le parameter sniffing : le plan d'exécution a été mis en cache lors d'un premier appel avec un client à faible volume, et ce plan (optimisé pour peu de lignes, ex: via Index Seek + Nested Loop) est réutilisé de façon sous-optimale pour le client à fort volume qui aurait bénéficié d'un Table Scan/Hash Match",
      explanation:
        "C'est le scénario classique du parameter sniffing : SQL Server met en cache le plan généré lors du premier appel. Si ce plan est optimal pour un petit volume mais réutilisé pour un très gros volume, les performances se dégradent fortement. OPTION (RECOMPILE), des statistiques à jour, ou des hints ciblés sont les pistes de résolution classiques.",
    },
    {
      question:
        "[Scénario combiné] Un index composite (Symbol, ExecTime) INCLUDE (Price) existe sur Executions. Une requête filtre sur Symbol et trie sur ExecTime DESC, en projetant Symbol, ExecTime, Price. Le plan d'exécution montre pourtant un Key Lookup. Quelle en est la cause la plus probable ?",
      options: [
        "Un Key Lookup est impossible avec un index INCLUDE, il doit s'agir d'une erreur d'interprétation du plan",
        "Une colonne supplémentaire projetée ou filtrée dans la requête (ex: une colonne comme OrderId ou Status) n'est ni dans la clé de l'index ni dans son INCLUDE, forçant SQL Server à retourner à la table pour la récupérer",
        "Le tri DESC est systématiquement incompatible avec un index composite",
        "Cela ne peut se produire que si la table n'a aucun clustered index",
      ],
      answer: "Une colonne supplémentaire projetée ou filtrée dans la requête (ex: une colonne comme OrderId ou Status) n'est ni dans la clé de l'index ni dans son INCLUDE, forçant SQL Server à retourner à la table pour la récupérer",
      explanation:
        "Un Key Lookup apparaît dès qu'au moins une colonne nécessaire à la requête (SELECT, WHERE additionnel, ORDER BY...) n'est pas couverte par l'index utilisé (ni dans sa clé, ni dans son INCLUDE). Le correctif classique est d'élargir la clause INCLUDE pour couvrir entièrement la requête et obtenir un index réellement 'couvrant'.",
    },
    {
      question:
        "[Scénario combiné] Vous devez remplacer une fonction scalaire lente (utilisée dans le SELECT d'une requête sur des millions de lignes, calculant une commission à partir de plusieurs colonnes) par une alternative plus performante. Quelle est la meilleure approche ?",
      options: [
        "Convertir la logique en une fonction table-valued inline (retournant une table via une seule requête SELECT), ou directement intégrer le calcul comme une expression SQL native (éventuellement via une colonne calculée), permettant à l'optimiseur de traiter le calcul de façon ensembliste plutôt que ligne par ligne",
        "Garder la fonction scalaire mais l'appeler deux fois pour vérifier le résultat",
        "Transformer la fonction scalaire en trigger AFTER INSERT",
        "Aucune alternative n'existe, les fonctions scalaires sont toujours la seule option pour un calcul complexe",
      ],
      answer: "Convertir la logique en une fonction table-valued inline (retournant une table via une seule requête SELECT), ou directement intégrer le calcul comme une expression SQL native (éventuellement via une colonne calculée), permettant à l'optimiseur de traiter le calcul de façon ensembliste plutôt que ligne par ligne",
      explanation:
        "Le remède classique au RBAR causé par une fonction scalaire est de reformuler la logique en une expression SQL ensembliste (inline table-valued function, colonne calculée, ou CASE/expression directe dans la requête), permettant à l'optimiseur SQL Server de traiter le calcul globalement plutôt que ligne par ligne.",
    },
    {
      question:
        "[Scénario combiné] Une vue joint 5 tables avec plusieurs LEFT JOIN, et est ensuite filtrée par une application via `SELECT * FROM MaVue WHERE Symbol = 'AAPL'`. Pourquoi cette approche peut-elle être moins performante qu'attendu, malgré le filtre apparemment sélectif ?",
      options: [
        "SQL Server ne peut techniquement pas filtrer une vue, la requête échouera",
        "Une vue standard n'étant qu'une définition de requête, SQL Server doit généralement exécuter l'intégralité de la logique des 5 jointures AVANT d'appliquer le filtre WHERE, sauf si l'optimiseur parvient à repousser (predicate pushdown) le filtre plus tôt dans le plan — ce qui n'est pas toujours garanti selon la complexité de la vue",
        "Les vues appliquent toujours le filtre WHERE avant d'exécuter la moindre jointure, sans exception",
        "Le problème vient uniquement du nombre de LEFT JOIN, qui doit être strictement inférieur à 3",
      ],
      answer: "Une vue standard n'étant qu'une définition de requête, SQL Server doit généralement exécuter l'intégralité de la logique des 5 jointures AVANT d'appliquer le filtre WHERE, sauf si l'optimiseur parvient à repousser (predicate pushdown) le filtre plus tôt dans le plan — ce qui n'est pas toujours garanti selon la complexité de la vue",
      explanation:
        "Bien que l'optimiseur tente souvent de repousser les prédicats (predicate pushdown) au plus tôt dans le plan d'exécution, ce n'est pas garanti pour des vues complexes (agrégats, LEFT JOIN multiples, sous-requêtes). Il faut examiner le plan réel plutôt que de supposer que le WHERE final s'applique efficacement dès le départ.",
    },
    {
      question:
        "[Scénario combiné] Une requête utilise `ROW_NUMBER() OVER (PARTITION BY Symbol ORDER BY ExecTime DESC) AS rn` puis filtre `WHERE rn = 1` dans une CTE englobante, pour obtenir la dernière exécution par symbole. Pourquoi ne peut-on pas écrire directement `WHERE ROW_NUMBER() OVER (...) = 1` dans le WHERE de la requête principale ?",
      options: [
        "Ce n'est techniquement pas une restriction, cela fonctionne parfaitement dans le WHERE direct",
        "Les fonctions de fenêtre ne peuvent pas être utilisées directement dans une clause WHERE (ni GROUP BY, ni HAVING) — elles doivent d'abord être calculées dans le SELECT d'une sous-requête ou CTE, puis filtrées dans une requête englobante",
        "ROW_NUMBER() ne peut être utilisé qu'avec des CTE récursives",
        "PARTITION BY est incompatible avec ORDER BY DESC",
      ],
      answer: "Les fonctions de fenêtre ne peuvent pas être utilisées directement dans une clause WHERE (ni GROUP BY, ni HAVING) — elles doivent d'abord être calculées dans le SELECT d'une sous-requête ou CTE, puis filtrées dans une requête englobante",
      explanation:
        "C'est une contrainte du langage SQL liée à l'ordre logique d'évaluation des clauses : WHERE est évalué avant que les fonctions de fenêtre (calculées au niveau du SELECT) n'existent. Le pattern standard est donc de calculer ROW_NUMBER() dans une CTE/sous-requête, puis de filtrer dans la requête englobante.",
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
        ? <h3 className="success">🚀 Excellent ! Niveau senior SQL Server confirmé.</h3>
        : <p className="fail">📚 Révisez RANK/DENSE_RANK, le piège LEFT JOIN + WHERE, et les Key Lookups.</p>
      }
    </div>
  );
};

const SQLAdvancedSeniorQCM = () => {
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
  }, [level, currentQuestion]);

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, handleNextQuestion, message]);

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
      }, 15000);
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
            SQL Server — Niveau Senior 🔹 {level === "basic"
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

export default SQLAdvancedSeniorQCM;
