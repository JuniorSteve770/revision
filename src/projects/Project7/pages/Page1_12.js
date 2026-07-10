// src/projects/BackendInterview/SQLServerQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — SQL Server avancé",
    answer:
      "◆ **Définition** : structure des données (index, PK/FK, colonnes) et logique de requêtage (agrégation, CTE, procédures) dans SQL Server\n◆ **Index & clés** : accélèrent la recherche, garantissent l'intégrité référentielle\n◆ **OLAP vs OLTP** : deux modèles d'usage d'une base de données très différents\n◆ **Requêtes avancées** : GROUP BY, HAVING, CTE, procédures stockées\n◆ **CRUD** : les 4 opérations fondamentales sur les données\n◆ **IDENTITY** : génération automatique de clés, avec ses pièges classiques",
  },
  {
    question: "PK, FK — les bases de l'intégrité relationnelle",
    answer:
      "◆ **Définition** : deux contraintes fondamentales pour structurer des tables liées\n◆ **PRIMARY KEY (PK)** : identifie de façon unique chaque ligne, ne peut pas être NULL\n◆ **FOREIGN KEY (FK)** : référence la PK d'une autre table, garantit l'intégrité référentielle\n◆ **Cas d'usage** : la colonne OrderId (PK) de Orders est référencée par la colonne OrderId (FK) de la table Executions\n\n```sql\nCREATE TABLE Executions (\n    ExecId INT IDENTITY PRIMARY KEY,\n    OrderId INT FOREIGN KEY REFERENCES Orders(OrderId)\n);\n```",
  },
  {
    question: "Index — clustered vs non-clustered",
    answer:
      "◆ **Définition** : un index accélère la recherche, mais ralentit légèrement l'écriture\n◆ **Clustered index** : détermine l'ordre physique de stockage des données sur le disque — une seule par table (souvent la PK)\n◆ **Non-clustered index** : structure séparée qui pointe vers les lignes, on peut en créer plusieurs par table\n◆ **Cas d'usage** : clustered sur OrderId (PK), non-clustered sur Symbol pour accélérer les recherches par instrument\n\n```sql\nCREATE NONCLUSTERED INDEX IX_Orders_Symbol ON Orders(Symbol);\n```",
  },
  {
    question: "Index couvrants (INCLUDE) & index filtrés",
    answer:
      "◆ **Définition** : deux optimisations avancées d'index non-clustered\n◆ **Index couvrant (covering index)** : via INCLUDE, ajoute des colonnes supplémentaires à l'index pour répondre à une requête SANS retourner à la table (évite un Key Lookup)\n◆ **Index filtré** : n'indexe qu'un sous-ensemble de lignes via une clause WHERE, plus léger et plus rapide sur ce sous-ensemble\n◆ **Cas d'usage** : indexer uniquement les ordres actifs (Status='Open') plutôt que toute la table\n\n```sql\nCREATE NONCLUSTERED INDEX IX_Orders_Symbol_Covering\n    ON Orders(Symbol) INCLUDE (Price, Quantity);\n\nCREATE NONCLUSTERED INDEX IX_Orders_Open\n    ON Orders(Symbol) WHERE Status = 'Open';\n```",
  },
  {
    question: "OLAP vs OLTP",
    answer:
      "◆ **Définition** : deux modèles d'usage très différents d'une base de données\n◆ **OLTP (Online Transaction Processing)** : nombreuses petites transactions rapides (INSERT/UPDATE), typique d'une base de production (ex: passage d'ordres)\n◆ **OLAP (Online Analytical Processing)** : requêtes complexes d'agrégation sur de gros volumes, typique d'un entrepôt de données (reporting, BI)\n◆ **Cas d'usage** : la base de l'OMS en production est OLTP, un data warehouse alimenté chaque nuit pour l'analyse de performance de trading est OLAP\n◆ **Impact structure** : OLTP privilégie la normalisation, OLAP privilégie souvent la dénormalisation (star schema) pour accélérer les agrégations",
  },
  {
    question: "Colonnes — création & manipulation",
    answer:
      "◆ **Définition** : ajouter, modifier ou supprimer une colonne, et poser des contraintes\n◆ **ALTER TABLE ... ADD** : ajouter une colonne\n◆ **NOT NULL / DEFAULT / UNIQUE / CHECK** : contraintes courantes sur une colonne\n◆ **IDENTITY** : génère automatiquement une valeur incrémentale (auto-increment)\n◆ **Cas d'usage** : ajouter une colonne CreatedAt avec une valeur par défaut à la date courante\n\n```sql\nALTER TABLE Orders ADD CreatedAt DATETIME NOT NULL DEFAULT GETDATE();\n```",
  },
  {
    question: "GROUP BY, HAVING & fonctions d'agrégation",
    answer:
      "◆ **Définition** : regrouper des lignes pour calculer des agrégats\n◆ **GROUP BY** : regroupe les lignes par une ou plusieurs colonnes\n◆ **Fonctions d'agrégation** : COUNT, SUM, AVG, MIN, MAX\n◆ **HAVING** : filtre APRÈS le regroupement (contrairement à WHERE qui filtre avant)\n◆ **Cas d'usage** : trouver les symboles ayant plus de 100 ordres exécutés\n\n```sql\nSELECT Symbol, COUNT(*) AS NbOrdres\nFROM Orders\nGROUP BY Symbol\nHAVING COUNT(*) > 100;\n```",
  },
  {
    question: "CTE, procédures stockées",
    answer:
      "◆ **Définition** : deux outils pour structurer une logique SQL complexe et réutilisable\n◆ **CTE (Common Table Expression)** : requête nommée temporaire définie avec WITH, améliore la lisibilité, peut être récursive\n◆ **Procédure stockée** : bloc de code SQL précompilé, réutilisable, paramétrable, exécuté côté serveur\n◆ **Cas d'usage** : une CTE pour calculer un total intermédiaire, une procédure stockée pour encapsuler la logique de création d'ordre\n\n```sql\nWITH TotalParSymbole AS (\n    SELECT Symbol, SUM(Quantity) AS Total\n    FROM Orders GROUP BY Symbol\n)\nSELECT * FROM TotalParSymbole WHERE Total > 1000;\n```",
  },
  {
    question: "Table temporaire vs variable de table vs CTE vs colonne calculée",
    answer:
      "◆ **Définition** : 4 façons différentes de manipuler des données intermédiaires en SQL Server\n◆ **#TempTable** : table temporaire physique dans tempdb, visible dans toute la session/procédure, peut être indexée\n◆ **@TableVariable** : structure en mémoire, portée plus limitée (le batch courant), moins d'optimisation statistique\n◆ **CTE (WITH ... AS)** : requête nommée temporaire, n'existe que le temps de LA requête suivante, non indexable\n◆ **Colonne calculée (computed column)** : colonne dont la valeur est dérivée d'une expression sur d'autres colonnes de la même table\n◆ **Cas d'usage** : #temp pour un traitement multi-étapes volumineux, CTE pour une requête ponctuelle lisible, colonne calculée pour un TotalPrice = Price * Quantity toujours synchronisé\n\n```sql\nALTER TABLE Orders ADD TotalPrice AS (Price * Quantity);\n```",
  },
  {
    question: "IDENTITY(seed, increment) — rappel",
    answer:
      "◆ **Définition** : génère automatiquement une valeur numérique croissante unique à chaque insertion\n◆ **seed** : valeur de départ\n◆ **increment** : pas entre deux valeurs\n◆ **Cas d'usage** : clé primaire auto-générée, sans avoir à la fournir explicitement dans l'INSERT\n\n```sql\nCREATE TABLE Orders (OrderId INT IDENTITY(1,1) PRIMARY KEY, Symbol NVARCHAR(10));\n```",
  },
  {
    question: "@@IDENTITY vs SCOPE_IDENTITY() vs IDENT_CURRENT()",
    answer:
      "◆ **Définition** : trois façons de récupérer la dernière valeur IDENTITY générée, avec des portées différentes\n◆ **@@IDENTITY** : dernière IDENTITY sur la connexion, tous scopes confondus — risquée avec des triggers\n◆ **SCOPE_IDENTITY()** : dernière IDENTITY dans le même scope que l'appel — la plus fiable en pratique\n◆ **IDENT_CURRENT('Table')** : dernière IDENTITY sur une table donnée, toutes sessions confondues — risquée en environnement concurrent\n◆ **Cas d'usage** : toujours privilégier SCOPE_IDENTITY() après un INSERT pour récupérer l'ID de SA PROPRE insertion de façon fiable",
  },
  {
  question: "Fonction vs CTE vs Procédure stockée",
  answer:
    "◆ **Fonction** : retourne UNE valeur (scalaire) ou UNE table, utilisable DANS une requête (SELECT, WHERE, JOIN)\n◆ **CTE** : requête nommée temporaire, valable UNE seule fois, pour LA requête suivante uniquement\n◆ **Procédure stockée** : bloc de code exécuté À PART, peut FAIRE des actions (INSERT/UPDATE/DELETE), pas utilisable dans un SELECT\n◆ **Retenir** : Fonction = réutilisable partout | CTE = jetable, lisibilité | Procédure = actions, orchestration\n\n```sql\n-- Fonction : utilisable dans une requête\nSELECT dbo.CalculFrais(Price) FROM Orders;\n-- CTE : jetable, une seule requête\nWITH Top AS (SELECT TOP 10 * FROM Orders) SELECT * FROM Top;\n-- Procédure : exécutée à part\nEXEC CreerOrdre @Symbol='AAPL', @Qty=100;\n```",
},
];

const questions = {
  moyen: [
    // ==================== SECTION A: PK, FK, INDEX ====================
    {
      question: "[PK/FK] Que garantit une contrainte PRIMARY KEY sur une colonne ?",
      options: [
        "Que la colonne accepte des valeurs NULL en illimité",
        "Que chaque valeur de la colonne est unique et non-NULL, identifiant chaque ligne de façon univoque",
        "Que la colonne référence automatiquement une autre table",
        "Que la table ne peut contenir qu'une seule ligne",
      ],
      answer: "Que chaque valeur de la colonne est unique et non-NULL, identifiant chaque ligne de façon univoque",
      explanation:
        "PRIMARY KEY impose l'unicité ET la non-nullité de la colonne (ou combinaison de colonnes), garantissant qu'aucune ligne ne peut être confondue avec une autre.",
    },
    {
      question: "[PK/FK] À quoi sert une contrainte FOREIGN KEY ?",
      options: [
        "À accélérer automatiquement toutes les requêtes de la table",
        "À garantir l'intégrité référentielle : la valeur de la colonne doit exister dans la table référencée (ou être NULL si autorisé)",
        "À dupliquer automatiquement les données entre deux tables",
        "À empêcher toute insertion dans la table",
      ],
      answer: "À garantir l'intégrité référentielle : la valeur de la colonne doit exister dans la table référencée (ou être NULL si autorisé)",
      explanation:
        "FOREIGN KEY empêche d'insérer une valeur qui ne correspond à aucune ligne existante dans la table référencée, garantissant la cohérence entre tables liées (ex: pas d'exécution sans ordre correspondant).",
    },
    {
      question: "[Index] Quelle est la différence fondamentale entre un index clustered et un index non-clustered ?",
      options: [
        "Un clustered index détermine l'ordre physique de stockage des données sur le disque, un non-clustered index est une structure séparée qui pointe vers les lignes",
        "Il ne peut jamais y avoir plus d'un index non-clustered par table",
        "Le clustered index ne peut être créé que sur des colonnes de type texte",
        "Les deux types d'index sont strictement identiques en interne",
      ],
      answer: "Un clustered index détermine l'ordre physique de stockage des données sur le disque, un non-clustered index est une structure séparée qui pointe vers les lignes",
      explanation:
        "Une table ne peut avoir qu'UN SEUL clustered index (car les données ne peuvent être physiquement triées que d'une seule façon), mais peut avoir plusieurs index non-clustered, chacun étant une structure séparée pointant vers les lignes de la table.",
    },
    {
      question: "[Index] Qu'est-ce qu'un index couvrant (covering index) créé avec INCLUDE ?",
      options: [
        "Un index qui couvre automatiquement toutes les colonnes de la table",
        "Un index non-clustered qui inclut des colonnes supplémentaires pour répondre entièrement à une requête sans retourner à la table (évite un Key Lookup)",
        "Un synonyme de clustered index",
        "Un type d'index réservé aux clés primaires",
      ],
      answer: "Un index non-clustered qui inclut des colonnes supplémentaires pour répondre entièrement à une requête sans retourner à la table (évite un Key Lookup)",
      explanation:
        "INCLUDE ajoute des colonnes à un index non-clustered sans qu'elles fassent partie de la clé de tri de l'index. Si toutes les colonnes nécessaires à une requête sont présentes (clé + INCLUDE), SQL Server n'a pas besoin d'aller lire la table (Key Lookup), ce qui accélère la requête.",
    },
    {
      question: "[Index] À quoi sert un index filtré (filtered index) ?",
      options: [
        "À indexer uniquement un sous-ensemble de lignes correspondant à une condition WHERE, le rendant plus petit et plus rapide sur ce sous-ensemble",
        "À supprimer automatiquement les lignes ne correspondant pas au filtre",
        "À filtrer les résultats d'une requête SELECT sans rapport avec les index",
        "Un index filtré est identique à un index clustered",
      ],
      answer: "À indexer uniquement un sous-ensemble de lignes correspondant à une condition WHERE, le rendant plus petit et plus rapide sur ce sous-ensemble",
      explanation:
        "Un index filtré (CREATE INDEX ... WHERE condition) n'indexe que les lignes satisfaisant la condition, ce qui le rend plus compact et plus performant pour les requêtes ciblant précisément ce sous-ensemble (ex: uniquement les ordres 'Open').",
    },

    // ==================== SECTION B: OLAP VS OLTP ====================
    {
      question: "[OLAP/OLTP] Quelle est la caractéristique principale d'un système OLTP ?",
      options: [
        "De nombreuses transactions courtes et rapides (INSERT/UPDATE), typiques d'une base de production opérationnelle",
        "Des requêtes d'agrégation complexes sur des millions de lignes historiques",
        "L'absence totale de contraintes d'intégrité",
        "Un usage exclusivement en lecture seule",
      ],
      answer: "De nombreuses transactions courtes et rapides (INSERT/UPDATE), typiques d'une base de production opérationnelle",
      explanation:
        "OLTP (Online Transaction Processing) est optimisé pour de nombreuses petites transactions rapides et concurrentes, typiques d'une application opérationnelle comme un OMS qui crée/modifie des ordres en continu.",
    },
    {
      question: "[OLAP/OLTP] Pourquoi une base OLAP privilégie-t-elle souvent la dénormalisation (ex: star schema) par rapport à une base OLTP normalisée ?",
      options: [
        "Parce que la dénormalisation est interdite en OLTP",
        "Parce que dénormaliser réduit le nombre de jointures nécessaires pour les requêtes d'agrégation massives, ce qui accélère les analyses même si cela augmente la redondance des données",
        "Parce que OLAP ne peut fonctionner qu'avec une seule table",
        "Il n'y a aucune différence de modélisation entre OLAP et OLTP",
      ],
      answer: "Parce que dénormaliser réduit le nombre de jointures nécessaires pour les requêtes d'agrégation massives, ce qui accélère les analyses even si cela augmente la redondance des données",
      explanation:
        "En OLAP, la priorité est la rapidité des requêtes analytiques sur de gros volumes. Réduire les jointures via une modélisation dénormalisée (star schema : table de faits + dimensions) accélère ces requêtes, au prix d'une redondance de données acceptable dans ce contexte.",
    },

    // ==================== SECTION C: COLONNES ====================
    {
      question: "[Colonnes] Quelle instruction permet d'ajouter une nouvelle colonne à une table existante ?",
      options: ["CREATE COLUMN", "ALTER TABLE ... ADD", "INSERT COLUMN", "MODIFY TABLE ... NEW"],
      answer: "ALTER TABLE ... ADD",
      explanation:
        "ALTER TABLE NomTable ADD NomColonne Type [contraintes] est la syntaxe standard pour ajouter une colonne à une table existante en SQL Server.",
    },
    {
      question: "[Colonnes] Que fait la contrainte DEFAULT sur une colonne ?",
      options: [
        "Elle empêche toute insertion dans la colonne",
        "Elle définit une valeur automatiquement utilisée si aucune valeur n'est fournie explicitement lors de l'INSERT",
        "Elle rend la colonne obligatoire à chaque UPDATE",
        "Elle supprime automatiquement la colonne après un certain délai",
      ],
      answer: "Elle définit une valeur automatiquement utilisée si aucune valeur n'est fournie explicitement lors de l'INSERT",
      explanation:
        "DEFAULT permet de fournir une valeur par défaut (ex: GETDATE() pour un timestamp de création) utilisée automatiquement si l'INSERT ne précise pas de valeur pour cette colonne.",
    },

    // ==================== SECTION D: GROUP BY / HAVING / CTE / PROC ====================
    {
      question: "[GROUP BY/HAVING] Quelle est la différence entre WHERE et HAVING ?",
      options: [
        "WHERE filtre les lignes AVANT le regroupement (GROUP BY), HAVING filtre les groupes APRÈS le regroupement",
        "HAVING et WHERE sont strictement interchangeables",
        "WHERE ne peut être utilisé qu'avec des fonctions d'agrégation",
        "HAVING filtre avant le GROUP BY, WHERE après",
      ],
      answer: "WHERE filtre les lignes AVANT le regroupement (GROUP BY), HAVING filtre les groupes APRÈS le regroupement",
      explanation:
        "WHERE s'applique aux lignes individuelles avant tout regroupement. HAVING s'applique aux groupes résultants du GROUP BY, ce qui permet de filtrer sur le résultat d'une fonction d'agrégation (ex: HAVING COUNT(*) > 100).",
    },
    {
      question: "[CTE] Qu'est-ce qu'une CTE (Common Table Expression) en SQL Server ?",
      options: [
        "Une procédure stockée compilée en avance",
        "Une requête nommée temporaire définie avec WITH ... AS, utilisable dans la requête qui suit immédiatement",
        "Un type d'index spécial",
        "Une contrainte de clé étrangère",
      ],
      answer: "Une requête nommée temporaire définie avec WITH ... AS, utilisable dans la requête qui suit immédiatement",
      explanation:
        "Une CTE (WITH nom AS (SELECT ...)) définit un résultat intermédiaire nommé, réutilisable dans la requête SQL suivante, améliorant la lisibilité de requêtes complexes ou permettant une récursivité.",
    },
    {
      question: "[Procédures stockées] Quel est l'avantage principal d'une procédure stockée par rapport à une requête SQL envoyée directement depuis l'application ?",
      options: [
        "Elle est précompilée et réutilisable côté serveur, réduit les allers-retours réseau et centralise la logique métier liée aux données",
        "Elle ne peut jamais accepter de paramètres",
        "Elle s'exécute uniquement côté client",
        "Elle remplace complètement le besoin d'index",
      ],
      answer: "Elle est précompilée et réutilisable côté serveur, réduit les allers-retours réseau et centralise la logique métier liée aux données",
      explanation:
        "Une procédure stockée est un bloc SQL nommé, paramétrable et précompilé côté serveur. Elle permet d'exécuter une logique complexe en un seul appel réseau, et centralise cette logique pour être réutilisée par plusieurs applications clientes.",
    },

    // ==================== SECTION E: CRUD ====================
    {
      question: "[CRUD] Pourquoi est-il dangereux d'exécuter un UPDATE ou un DELETE sans clause WHERE ?",
      options: [
        "Cela provoque systématiquement une erreur de syntaxe",
        "L'opération affecte TOUTES les lignes de la table, ce qui peut modifier ou supprimer massivement des données par erreur",
        "SQL Server empêche automatiquement ce type de requête",
        "Cela n'a aucun impact particulier tant qu'on est en environnement de test",
      ],
      answer: "L'opération affecte TOUTES les lignes de la table, ce qui peut modifier ou supprimer massivement des données par erreur",
      explanation:
        "Sans WHERE, UPDATE et DELETE s'appliquent à l'ensemble des lignes de la table. C'est une erreur classique et dangereuse en production — il est recommandé de toujours tester avec un SELECT équivalent avant d'exécuter l'UPDATE/DELETE réel.",
    },

    // ==================== SECTION F: IDENTITY ====================
    {
      question: "[IDENTITY] Que définit le paramètre 'seed' dans IDENTITY(seed, increment) ?",
      options: [
        "Le nombre maximal de lignes autorisées dans la table",
        "La valeur de départ de la séquence générée",
        "Le nom de la colonne IDENTITY",
        "Le type de données de la colonne",
      ],
      answer: "La valeur de départ de la séquence générée",
      explanation:
        "IDENTITY(seed, increment) : seed est la première valeur générée (ex: 1), increment est le pas entre deux valeurs consécutives (ex: 1 pour 1,2,3... ou 10 pour 1,11,21...).",
    },
  ],

  avance: [
    // ==================== SECTION G: INDEX AVANCE ====================
    {
      question: "[Index] Pourquoi une table ne peut-elle avoir qu'un seul clustered index, contrairement aux index non-clustered ?",
      options: [
        "Parce que SQL Server limite arbitrairement à un seul index par table",
        "Parce que le clustered index détermine l'ordre physique de stockage des lignes sur le disque, et les données ne peuvent être triées physiquement que d'une seule façon à la fois",
        "Parce que les clustered index sont plus lents que les non-clustered",
        "Ce n'est pas vrai, on peut avoir plusieurs clustered index par table",
      ],
      answer: "Parce que le clustered index détermine l'ordre physique de stockage des lignes sur le disque, et les données ne peuvent être triées physiquement que d'une seule façon à la fois",
      explanation:
        "Le clustered index EST la table, physiquement triée selon sa clé. Il ne peut donc y en avoir qu'un seul par nature. Les index non-clustered sont des structures séparées (comme un index de livre) qui pointent vers les lignes, on peut en avoir plusieurs.",
    },
    {
      question: "[Index] Dans quel scénario un index filtré est-il particulièrement avantageux ?",
      options: [
        "Quand on interroge fréquemment un petit sous-ensemble de lignes sur une grande table (ex: uniquement les ordres 'Open' parmi des millions d'ordres historiques)",
        "Quand toutes les lignes de la table sont interrogées de façon égale",
        "Uniquement sur les colonnes de type texte",
        "Les index filtrés n'offrent jamais d'avantage réel en pratique",
      ],
      answer: "Quand on interroge fréquemment un petit sous-ensemble de lignes sur une grande table (ex: uniquement les ordres 'Open' parmi des millions d'ordres historiques)",
      explanation:
        "Un index filtré sur Status='Open' reste petit et rapide même si la table Orders contient des millions de lignes historiques, car il n'indexe que le sous-ensemble pertinent (les ordres actifs), qui est généralement bien plus petit.",
    },

    // ==================== SECTION H: OLAP/OLTP AVANCE ====================
    {
      question: "[OLAP/OLTP] Pourquoi exécuter de lourdes requêtes analytiques (reporting) directement sur une base OLTP de production est-il généralement déconseillé ?",
      options: [
        "Ces requêtes lourdes peuvent consommer des ressources et verrouiller des tables, dégradant les performances des transactions opérationnelles critiques (ex: passage d'ordres en temps réel)",
        "SQL Server interdit techniquement d'exécuter des SELECT complexes sur une base OLTP",
        "Il n'y a aucun risque, OLTP et OLAP sont conçus pour un usage identique",
        "Les requêtes analytiques sont toujours plus rapides sur une base OLTP",
      ],
      answer: "Ces requêtes lourdes peuvent consommer des ressources et verrouiller des tables, dégradant les performances des transactions opérationnelles critiques (ex: passage d'ordres en temps réel)",
      explanation:
        "Une base OLTP est optimisée pour des transactions courtes et fréquentes. Une requête analytique lourde peut monopoliser des ressources (CPU, I/O, verrous), ralentissant voire bloquant les opérations critiques de production — d'où l'intérêt de répliquer les données vers un entrepôt OLAP dédié.",
    },

    // ==================== SECTION I: GROUP BY / CTE AVANCE ====================
    {
      question: "[GROUP BY] Que se passe-t-il si on inclut dans le SELECT une colonne qui n'est ni dans le GROUP BY ni dans une fonction d'agrégation ?",
      options: [
        "SQL Server retourne automatiquement la première valeur rencontrée sans erreur",
        "Cela provoque une erreur de syntaxe car SQL Server ne sait pas quelle valeur retourner pour cette colonne au sein du groupe",
        "La colonne est automatiquement ignorée",
        "Cela fonctionne toujours parfaitement sans distinction",
      ],
      answer: "Cela provoque une erreur de syntaxe car SQL Server ne sait pas quelle valeur retourner pour cette colonne au sein du groupe",
      explanation:
        "En SQL Server (mode standard), toute colonne du SELECT doit soit faire partie du GROUP BY, soit être enveloppée dans une fonction d'agrégation (SUM, COUNT...), sinon la requête est rejetée car ambiguë : quelle valeur choisir parmi les lignes du groupe ?",
    },
    {
      question: "[CTE] Qu'est-ce qu'une CTE récursive et à quoi sert-elle typiquement ?",
      options: [
        "Une CTE qui s'appelle elle-même pour parcourir une structure hiérarchique (ex: une arborescence de catégories, un organigramme)",
        "Une CTE qui s'exécute plusieurs fois en parallèle",
        "Une CTE qui ne peut contenir aucune jointure",
        "Un synonyme de procédure stockée récursive",
      ],
      answer: "Une CTE qui s'appelle elle-même pour parcourir une structure hiérarchique (ex: une arborescence de catégories, un organigramme)",
      explanation:
        "Une CTE récursive combine une ancre (cas de base) et une partie récursive qui référence la CTE elle-même, permettant de parcourir des structures hiérarchiques comme un organigramme ou une arborescence de catégories.",
    },

    // ==================== SECTION J: TEMP TABLE / TABLE VARIABLE / CTE / COLONNE CALCULEE ====================
    {
      question: "[Structures temporaires] Quelle est la différence principale entre une table temporaire (#TempTable) et une variable de table (@TableVariable) ?",
      options: [
        "Il n'y a aucune différence, ce sont deux syntaxes équivalentes",
        "#TempTable existe physiquement dans tempdb et peut être indexée explicitement, tandis que @TableVariable a une portée plus limitée (le batch courant) et une optimisation statistique généralement plus faible",
        "@TableVariable ne peut contenir aucune donnée",
        "#TempTable ne peut être utilisée que dans une procédure stockée",
      ],
      answer: "#TempTable existe physiquement dans tempdb et peut être indexée explicitement, tandis que @TableVariable a une portée plus limitée (le batch courant) et une optimisation statistique généralement plus faible",
      explanation:
        "#TempTable est visible dans toute la session/procédure appelante et supporte des index explicites et des statistiques, la rendant préférable pour de gros volumes. @TableVariable est limitée au batch courant, plus légère, mais avec des statistiques limitées pouvant affecter le plan d'exécution sur de gros volumes.",
    },
    {
      question: "[Structures temporaires] En quoi une CTE diffère-t-elle fondamentalement d'une table temporaire (#TempTable) ?",
      options: [
        "Une CTE persiste les données sur disque comme une #TempTable",
        "Une CTE n'existe que le temps de LA requête qui la suit immédiatement, n'est pas matérialisée en tant que structure indexable, contrairement à une #TempTable qui persiste et peut être réutilisée dans plusieurs requêtes de la même session",
        "Une CTE et une #TempTable sont strictement identiques en termes de portée et de performance",
        "Une CTE ne peut jamais contenir de jointure",
      ],
      answer: "Une CTE n'existe que le temps de LA requête qui la suit immédiatement, n'est pas matérialisée en tant que structure indexable, contrairement à une #TempTable qui persiste et peut être réutilisée dans plusieurs requêtes de la même session",
      explanation:
        "Une CTE est une simple définition de requête nommée, valable uniquement pour l'instruction SQL immédiatement suivante — elle n'est pas stockée physiquement ni indexable. Une #TempTable, elle, persiste en tempdb et peut être interrogée par plusieurs requêtes successives dans la même session.",
    },
    {
      question: "[Colonne calculée] Qu'est-ce qu'une colonne calculée (computed column) et quel est son avantage ?",
      options: [
        "Une colonne remplie manuellement par l'utilisateur à chaque INSERT",
        "Une colonne dont la valeur est automatiquement dérivée d'une expression sur d'autres colonnes de la même table, garantissant que sa valeur reste toujours synchronisée sans logique applicative dupliquée",
        "Une colonne qui ne peut contenir que des valeurs numériques",
        "Une colonne qui se comporte comme une table temporaire",
      ],
      answer: "Une colonne dont la valeur est automatiquement dérivée d'une expression sur d'autres colonnes de la même table, garantissant que sa valeur reste toujours synchronisée sans logique applicative dupliquée",
      explanation:
        "Une colonne calculée (ex: TotalPrice AS (Price * Quantity)) est automatiquement recalculée par SQL Server à partir des autres colonnes, évitant d'avoir à dupliquer et maintenir cette logique de calcul côté application, avec un risque de désynchronisation.",
    },
    {
      question: "[Fonction vs CTE vs Procédure] Laquelle des trois peut être appelée directement à l'intérieur d'un SELECT, comme une colonne calculée ?",
      options: [
        "Une procédure stockée uniquement",
        "Une CTE uniquement",
        "Une fonction (scalaire ou table-valued)",
        "Aucune des trois, il faut toujours une variable intermédiaire",
      ],
      answer: "Une fonction (scalaire ou table-valued)",
      explanation:
        "Une fonction est conçue pour être utilisée à l'intérieur d'une requête (SELECT dbo.MaFonction(x)). Une CTE existe seulement pour la requête suivante, une procédure stockée s'exécute à part avec EXEC et ne peut pas être insérée dans un SELECT.",
    },
    {
      question: "[Fonction vs CTE vs Procédure] Pourquoi une procédure stockée peut-elle faire un INSERT/UPDATE/DELETE, contrairement à une fonction ou une CTE ?",
      options: [
        "Parce qu'une procédure stockée est conçue pour exécuter des actions et de la logique métier, alors qu'une fonction doit rester sans effet de bord (déterministe) et une CTE n'est qu'une définition de requête de lecture",
        "Ce n'est pas vrai, une fonction peut aussi faire des INSERT en SQL Server",
        "Une CTE peut faire des INSERT si elle est récursive",
        "Il n'y a aucune différence entre les trois sur ce point",
      ],
      answer: "Parce qu'une procédure stockée est conçue pour exécuter des actions et de la logique métier, alors qu'une fonction doit rester sans effet de bord (déterministe) et une CTE n'est qu'une définition de requête de lecture",
      explanation:
        "Une fonction en SQL Server ne peut pas modifier l'état de la base (pas d'INSERT/UPDATE/DELETE) car elle doit pouvoir être utilisée librement dans une requête sans effet de bord imprévisible. Une CTE n'est qu'un raccourci de lecture. Seule la procédure stockée est faite pour orchestrer des actions.",
    },
    {
      question: "[Fonction vs CTE vs Procédure] Une CTE définie avec WITH peut-elle être réutilisée dans une deuxième requête SELECT plus bas dans le même script ?",
      options: [
        "Oui, une CTE reste disponible pour tout le reste du script une fois définie",
        "Non, une CTE n'est valable que pour la requête qui la suit immédiatement — pour réutiliser une logique dans plusieurs requêtes, une fonction ou une vue est plus adaptée",
        "Oui, mais uniquement si elle est déclarée comme récursive",
        "Non, une CTE ne peut être utilisée qu'une seule fois même dans la requête qui suit",
      ],
      answer: "Non, une CTE n'est valable que pour la requête qui la suit immédiatement — pour réutiliser une logique dans plusieurs requêtes, une fonction ou une vue est plus adaptée",
      explanation:
        "C'est une limite structurelle de la CTE : sa portée s'arrête à la fin de l'instruction SQL qui la suit. Si le même besoin doit être réutilisé dans plusieurs requêtes séparées, il vaut mieux créer une fonction table-valued ou une vue.",
    },
  ],

  expert: [
    // ==================== SECTION K: SCENARIOS COMBINES ====================
    {
      question:
        "[Scénario] Une table Orders contient 50 millions de lignes historiques, mais 99% des requêtes de l'application ne portent que sur les ordres du jour avec Status='Open'. Quelle stratégie d'index est la plus adaptée ?",
      options: [
        "Créer un index clustered supplémentaire sur Status",
        "Créer un index filtré non-clustered sur (Symbol) WHERE Status = 'Open', idéalement avec INCLUDE des colonnes fréquemment lues, pour rester compact et rapide sur ce sous-ensemble",
        "Ne créer aucun index, les 50 millions de lignes rendent tout index inutile",
        "Créer un index sur chaque colonne de la table sans distinction",
      ],
      answer: "Créer un index filtré non-clustered sur (Symbol) WHERE Status = 'Open', idéalement avec INCLUDE des colonnes fréquemment lues, pour rester compact et rapide sur ce sous-ensemble",
      explanation:
        "Combiner un index filtré (ne cible que les lignes 'Open', un petit sous-ensemble) avec INCLUDE (évite un Key Lookup pour les colonnes couramment lues) donne un index compact, très rapide, parfaitement adapté à ce pattern d'usage à 99% concentré sur les ordres actifs.",
    },
    {
      question:
        "[Scénario] Vous devez migrer une partie des données de production (OLTP) vers un entrepôt de reporting (OLAP) chaque nuit. Pourquoi ne pas simplement pointer les outils de BI directement sur la base de production ?",
      options: [
        "Parce que c'est techniquement impossible en SQL Server",
        "Parce que les requêtes analytiques lourdes de BI risqueraient de dégrader les performances des transactions OLTP critiques en journée, d'où l'intérêt de répliquer vers une base séparée, souvent dénormalisée pour les analyses",
        "Parce que OLAP et OLTP utilisent des langages SQL totalement différents",
        "Parce qu'une base OLTP ne peut techniquement pas contenir de données historiques",
      ],
      answer: "Parce que les requêtes analytiques lourdes de BI risqueraient de dégrader les performances des transactions OLTP critiques en journée, d'où l'intérêt de répliquer vers une base séparée, souvent dénormalisée pour les analyses",
      explanation:
        "Séparer OLTP (production, transactions critiques) et OLAP (analyse, reporting) évite que les requêtes lourdes d'agrégation ne pénalisent les performances de la base opérationnelle. La réplication nocturne permet de dénormaliser et d'optimiser la structure pour l'analyse sans impacter la production.",
    },
    {
      question:
        "[Scénario] Vous devez traiter en plusieurs étapes 2 millions de lignes intermédiaires (filtrage, agrégation partielle, puis jointure finale) au sein d'une procédure stockée. Quelle structure choisir plutôt qu'une CTE ?",
      options: [
        "Une CTE, car elle est toujours la plus performante quel que soit le volume",
        "Une #TempTable, car elle peut être indexée et ses statistiques permettent à l'optimiseur de mieux planifier les étapes suivantes sur un tel volume, contrairement à une CTE non matérialisée",
        "Une variable de table @TableVariable, car elle est systématiquement plus rapide qu'une #TempTable sur de gros volumes",
        "Aucune des trois, il faut obligatoirement une table permanente",
      ],
      answer: "Une #TempTable, car elle peut être indexée et ses statistiques permettent à l'optimiseur de mieux planifier les étapes suivantes sur un tel volume, contrairement à une CTE non matérialisée",
      explanation:
        "Sur un volume important (2 millions de lignes) traité en plusieurs étapes, une #TempTable indexable avec des statistiques à jour permet à l'optimiseur SQL Server de choisir un meilleur plan d'exécution pour les étapes suivantes, ce qu'une CTE non matérialisée (recalculée à chaque référence) ne permet pas aussi efficacement.",
    },

    // ==================== SECTION L: IDENTITY & BUGS ====================
    {
      question:
        "[Bug à repérer] Une procédure stockée insère un ordre, puis un trigger AFTER INSERT sur la table Orders insère une ligne d'audit dans une table AuditLog également IDENTITY. La procédure utilise ensuite `SELECT @@IDENTITY` pour retourner l'ID généré à l'application. Quel est le problème ?",
      options: [
        "Aucun problème, @@IDENTITY est toujours fiable dans ce contexte",
        "@@IDENTITY va très probablement retourner l'ID généré par le trigger d'audit plutôt que l'ID de l'ordre inséré — il faut utiliser SCOPE_IDENTITY() à la place",
        "Un trigger AFTER INSERT ne peut jamais insérer dans une autre table IDENTITY",
        "SELECT @@IDENTITY provoque une erreur de syntaxe après un trigger",
      ],
      answer: "@@IDENTITY va très probablement retourner l'ID généré par le trigger d'audit plutôt que l'ID de l'ordre inséré — il faut utiliser SCOPE_IDENTITY() à la place",
      explanation:
        "C'est le piège classique : @@IDENTITY ignore la notion de scope et retourne la toute dernière IDENTITY générée sur la connexion, y compris celle produite par le trigger d'audit exécuté après l'INSERT d'origine. SCOPE_IDENTITY() reste cantonnée au scope de l'INSERT initial et retourne le bon ID.",
    },
    {
      question:
        "[Bug à repérer] Dans un environnement à forte concurrence (plusieurs utilisateurs insérant simultanément dans la même table), pourquoi ce code est-il risqué ?\n\n```sql\nINSERT INTO Orders (Symbol) VALUES ('AAPL');\nSELECT IDENT_CURRENT('Orders');\n```",
      options: [
        "Aucun risque, IDENT_CURRENT est conçue spécifiquement pour la concurrence",
        "IDENT_CURRENT('Orders') retourne la dernière IDENTITY générée sur la table par N'IMPORTE QUELLE session — un autre utilisateur peut avoir inséré une ligne entre les deux instructions, faussant totalement l'ID récupéré",
        "IDENT_CURRENT ne peut être utilisée qu'une seule fois par jour",
        "Ce code est équivalent à SCOPE_IDENTITY() en tout point",
      ],
      answer: "IDENT_CURRENT('Orders') retourne la dernière IDENTITY générée sur la table par N'IMPORTE QUELLE session — un autre utilisateur peut avoir inséré une ligne entre les deux instructions, faussant totalement l'ID récupéré",
      explanation:
        "IDENT_CURRENT n'a aucune notion de session ni de scope, contrairement à SCOPE_IDENTITY(). En environnement concurrent, une autre transaction peut insérer une ligne entre l'INSERT et le SELECT IDENT_CURRENT, retournant un ID qui n'est pas celui de VOTRE insertion.",
    },
    {
      question:
        "[Optimisation] Vous devez insérer 100 000 lignes dans une table avec plusieurs index non-clustered existants. Quelle stratégie limite le mieux l'impact sur la performance ?",
      options: [
        "Insérer ligne par ligne avec un INSERT séparé pour chacune, dans une transaction distincte à chaque fois",
        "Désactiver temporairement les index non-clustered (ou les supprimer), effectuer l'insertion en masse (bulk insert / batch), puis recréer les index une fois l'insertion terminée",
        "Créer davantage d'index non-clustered avant l'insertion pour accélérer le processus",
        "Utiliser exclusivement des CTE pour l'insertion",
      ],
      answer: "Désactiver temporairement les index non-clustered (ou les supprimer), effectuer l'insertion en masse (bulk insert / batch), puis recréer les index une fois l'insertion terminée",
      explanation:
        "Chaque index doit être mis à jour à chaque INSERT, ce qui ralentit fortement une insertion massive. Désactiver (DISABLE) ou supprimer temporairement les index non-critiques, insérer en masse, puis reconstruire (REBUILD) les index à la fin est une stratégie standard pour les gros chargements de données.",
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
        ? <h3 className="success">🚀 Excellent ! SQL Server maîtrisé.</h3>
        : <p className="fail">📚 Révisez les index couvrants/filtrés et la différence SCOPE_IDENTITY() / @@IDENTITY / IDENT_CURRENT().</p>
      }
    </div>
  );
};

const SQLServerQCM = () => {
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
            SQL Server 🔹 {level === "basic"
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

export default SQLServerQCM;
