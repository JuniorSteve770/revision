// src/projects/BackendInterview/EFDataAccessQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Entity Framework 6 — DbContext & DbSet",
    answer:
      "◆ **Définition** : DbContext représente une session avec la base, DbSet<T> représente une table mappée à une entité\n◆ **Cycle de vie** : DbContext est léger, on l'instancie souvent par unité de travail (ex: par requête HTTP)\n◆ **SaveChanges** : traduit les modifications en tracking en instructions SQL (INSERT/UPDATE/DELETE)\n◆ **Cas d'usage** : un repository d'ordres expose un DbSet<Order> pour créer/lire/modifier des ordres en base\n\n```csharp\npublic class TradingContext : DbContext\n{\n    public DbSet<Order> Orders { get; set; }\n}\n```",
  },
  {
    question: "EF6 — Lazy loading vs Eager loading (Include)",
    answer:
      "◆ **Définition** : deux stratégies de chargement des entités liées (relations)\n◆ **Lazy loading** : les données liées sont chargées automatiquement au premier accès à la propriété de navigation\n◆ **Eager loading (Include)** : les données liées sont chargées en une seule requête avec l'entité principale\n◆ **Piège** : le lazy loading en boucle génère le problème N+1 (1 requête + N requêtes supplémentaires)\n◆ **Cas d'usage** : charger un ordre avec ses exécutions en une seule requête via Include plutôt qu'une requête par exécution\n\n```csharp\nvar orders = context.Orders.Include(o => o.Executions).ToList();\n```",
  },
  {
    question: "EF6 — Tracking vs No-Tracking (performance)",
    answer:
      "◆ **Définition** : le tracking permet à EF de détecter les changements sur une entité pour générer un UPDATE au SaveChanges\n◆ **AsNoTracking()** : désactive le suivi, plus rapide pour de la lecture pure (pas de modification prévue)\n◆ **Coût du tracking** : EF maintient un snapshot de chaque entité suivie, ce qui consomme mémoire et CPU\n◆ **Cas d'usage** : une API qui affiche une liste d'ordres en lecture seule doit utiliser AsNoTracking pour aller plus vite\n\n```csharp\nvar orders = context.Orders.AsNoTracking().Where(o => o.Status == \"Filled\").ToList();\n```",
  },
  {
    question: "try / catch / finally — ordre d'exécution",
    answer:
      "◆ **Définition** : try exécute le code à risque, catch capture une exception spécifique, finally s'exécute toujours (avec ou sans exception)\n◆ **Ordre** : try → (catch si exception) → finally, toujours en dernier\n◆ **Piège** : un `return` dans try/catch n'empêche PAS le bloc finally de s'exécuter avant de sortir réellement de la méthode\n◆ **Cas d'usage** : fermer une connexion réseau ou un fichier dans finally, quoi qu'il arrive dans le try\n\n```csharp\ntry { EnvoyerOrdre(); }\ncatch (TimeoutException ex) { Log(ex); }\nfinally { connexion.Close(); }\n```",
  },
  {
    question: "try / catch / finally — using vs finally pour les ressources",
    answer:
      "◆ **Définition** : `using` est une syntaxe dédiée pour garantir la libération déterministe d'une ressource IDisposable\n◆ **Équivalence** : `using (var r = ...) { ... }` est compilé en un try/finally qui appelle Dispose() automatiquement\n◆ **Recommandation** : préférer `using` à un finally manuel pour toute ressource IDisposable (connexion DB, fichier, HttpClient)\n◆ **Cas d'usage** : ouvrir une connexion SQL avec using garantit sa fermeture même en cas d'exception\n\n```csharp\nusing var connection = new SqlConnection(connStr);\nconnection.Open();\n```",
  },
  {
    question: "SQL Server — IDENTITY(seed, increment)",
    answer:
      "◆ **Définition** : propriété de colonne qui génère automatiquement une valeur numérique unique et croissante à chaque insertion\n◆ **seed** : valeur de départ (ex: 1)\n◆ **increment** : pas d'incrémentation entre deux valeurs (ex: 1)\n◆ **Cas d'usage** : la clé primaire OrderId d'une table Orders, générée automatiquement sans devoir la fournir à l'INSERT\n\n```sql\nCREATE TABLE Orders (\n    OrderId INT IDENTITY(1,1) PRIMARY KEY,\n    Symbol NVARCHAR(10)\n);\n```",
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
    question: "SQL Server — @@IDENTITY vs SCOPE_IDENTITY() vs IDENT_CURRENT()",
    answer:
      "◆ **Définition** : trois fonctions pour récupérer la dernière valeur IDENTITY générée, avec des portées différentes\n◆ **@@IDENTITY** : dernière IDENTITY générée sur la connexion, TOUTES tables et TOUS scopes confondus (dangereux avec des triggers)\n◆ **SCOPE_IDENTITY()** : dernière IDENTITY générée dans le même scope (batch/procédure) que l'appel — la plus sûre en pratique\n◆ **IDENT_CURRENT('Table')** : dernière IDENTITY générée sur une table précise, toutes sessions confondues (risque en environnement concurrent)\n◆ **Cas d'usage** : après un INSERT d'ordre avec trigger d'audit, SCOPE_IDENTITY() garantit de récupérer l'ID de l'ordre, pas celui généré par le trigger",
  },
  {
    question: "EF6 — Bonnes pratiques de performance",
    answer:
      "◆ **Définition** : combiner les bons réflexes EF pour éviter les requêtes lentes ou inutiles\n◆ **AsNoTracking** : pour toute lecture sans modification prévue\n◆ **Include ciblé** : éviter le N+1, mais aussi éviter de charger des relations inutiles\n◆ **Select (projection)** : ne charger que les colonnes nécessaires plutôt que l'entité complète\n◆ **Cas d'usage** : un dashboard qui liste 10 000 ordres doit projeter uniquement Id/Symbol/Status, pas l'entité Order complète avec toutes ses relations\n\n```csharp\nvar résumé = context.Orders.AsNoTracking()\n    .Select(o => new { o.Id, o.Symbol, o.Status })\n    .ToList();\n```",
  },
  {
    question: "Combos performance — écrire un accès aux données rapide et fiable",
    answer:
      "◆ **Définition** : la vitesse et la fiabilité viennent de la combinaison EF optimisé + gestion d'erreurs propre + bon usage d'Identity\n◆ **Règle 1** : AsNoTracking + projection Select pour toute lecture en masse\n◆ **Règle 2** : using/try-finally pour libérer systématiquement connexions et transactions\n◆ **Règle 3** : SCOPE_IDENTITY() plutôt que @@IDENTITY dans un contexte avec triggers, pour éviter de récupérer le mauvais ID\n◆ **Cas d'usage** : un batch d'insertion de milliers d'ordres doit désactiver le tracking, insérer par lots (batching), et vérifier chaque ID généré avec SCOPE_IDENTITY() plutôt que de faire confiance à @@IDENTITY\n\n```csharp\nusing var transaction = context.Database.BeginTransaction();\ntry\n{\n    context.SaveChanges();\n    transaction.Commit();\n}\ncatch { transaction.Rollback(); throw; }\n```",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: ENTITY FRAMEWORK 6 ====================
    {
      question: "[EF6] Que représente un DbSet<T> dans un DbContext ?",
      options: [
        "Un fichier de configuration XML",
        "Une table de la base de données mappée à l'entité T",
        "Une exception spécifique à Entity Framework",
        "Une connexion réseau vers le serveur SQL",
      ],
      answer: "Une table de la base de données mappée à l'entité T",
      explanation:
        "DbSet<T> représente une collection d'entités de type T correspondant à une table en base. On l'utilise pour interroger (LINQ) et manipuler (Add, Remove) les enregistrements de cette table.",
    },
    {
      question: "[EF6] Quelle est la différence entre lazy loading et eager loading (Include) ?",
      options: [
        "Il n'y a aucune différence, ce sont deux noms pour la même chose",
        "Le lazy loading est toujours plus rapide que Include",
        "Le lazy loading charge les entités liées au premier accès à la propriété de navigation, alors qu'Include les charge en une seule requête avec l'entité principale",
        "Include ne fonctionne que sur les clés primaires",
      ],
      answer: "Le lazy loading charge les entités liées au premier accès à la propriété de navigation, alors qu'Include les charge en une seule requête avec l'entité principale",
      explanation:
        "Le lazy loading déclenche une requête supplémentaire à chaque accès à une propriété de navigation non chargée. Include(o => o.Relation) charge tout en une seule requête (JOIN), évitant le problème N+1.",
    },
    {
      question: "[EF6] Quel est le problème N+1 en Entity Framework ?",
      options: [
        "Une erreur de compilation liée aux migrations",
        "Une seule requête initiale suivie de N requêtes supplémentaires (une par entité liée), typiquement causé par un lazy loading non maîtrisé dans une boucle",
        "Un bug qui empêche EF de démarrer",
        "Une limite du nombre maximal de colonnes dans une table",
      ],
      answer: "Une seule requête initiale suivie de N requêtes supplémentaires (une par entité liée), typiquement causé par un lazy loading non maîtrisé dans une boucle",
      explanation:
        "Le problème N+1 survient quand on charge N entités puis qu'on accède à une propriété de navigation dans une boucle : chaque accès déclenche une requête supplémentaire (lazy loading), au lieu d'une seule requête avec Include.",
    },
    {
      question: "[EF6] Pourquoi utiliser AsNoTracking() lors d'une lecture en lecture seule ?",
      options: [
        "Parce que sans AsNoTracking, EF refuse d'exécuter la requête",
        "Parce que cela chiffre automatiquement les données",
        "Parce que cela désactive le suivi des modifications, réduisant la charge mémoire/CPU quand on ne prévoit aucune mise à jour",
        "Parce que cela est obligatoire pour utiliser LINQ",
      ],
      answer: "Parce que cela désactive le suivi des modifications, réduisant la charge mémoire/CPU quand on ne prévoit aucune mise à jour",
      explanation:
        "Sans AsNoTracking, EF maintient un snapshot de chaque entité chargée pour détecter les changements au SaveChanges. Pour de la pure lecture, ce suivi est inutile et coûte des ressources — AsNoTracking l'évite.",
    },

    // ==================== SECTION B: TRY/CATCH/FINALLY ====================
    {
      question: "[try/catch/finally] Dans quel ordre s'exécutent les blocs lorsqu'une exception est levée dans le try et catchée ?",
      options: [
        "finally, puis catch, puis try",
        "catch, puis try, puis finally",
        "try, puis catch, puis finally",
        "Seul le bloc catch s'exécute, jamais finally",
      ],
      answer: "try, puis catch, puis finally",
      explanation:
        "Le bloc try s'exécute d'abord. Si une exception est levée et correspond au type catché, le bloc catch s'exécute. Le bloc finally s'exécute ensuite systématiquement, qu'il y ait eu exception ou non.",
    },
    {
      question: "[try/catch/finally] Le bloc finally s'exécute-t-il si le bloc try contient un `return` ?",
      options: [
        "Non, un return dans try annule totalement l'exécution du finally",
        "Oui, le finally s'exécute avant que la méthode ne retourne réellement sa valeur",
        "Seulement si aucune exception n'a été levée",
        "Seulement si le bloc catch a également un return",
      ],
      answer: "Oui, le finally s'exécute avant que la méthode ne retourne réellement sa valeur",
      explanation:
        "Même avec un return dans try (ou catch), le bloc finally s'exécute toujours avant que la méthode ne rende réellement la main à l'appelant. C'est justement ce qui garantit la libération de ressources.",
    },
    {
      question: "[try/catch/finally] Que fait `using (var conn = new SqlConnection(...)) { ... }` en interne ?",
      options: [
        "Il ouvre automatiquement une transaction distribuée",
        "Il désactive toute gestion d'exception dans le bloc",
        "Il est compilé en un try/finally qui appelle Dispose() sur la connexion à la sortie du bloc, même en cas d'exception",
        "Il empêche la connexion d'être fermée avant la fin du programme",
      ],
      answer: "Il est compilé en un try/finally qui appelle Dispose() sur la connexion à la sortie du bloc, même en cas d'exception",
      explanation:
        "using est un raccourci syntaxique équivalent à un try/finally qui appelle Dispose() sur l'objet IDisposable, garantissant la libération de la ressource (fermeture de connexion) même si une exception survient dans le bloc.",
    },
    {
      question: "[try/catch/finally] Pourquoi est-il déconseillé de catcher `catch (Exception ex)` de façon systématique et générique partout dans le code ?",
      options: [
        "Parce que C# interdit techniquement de catcher Exception",
        "Parce que catcher une exception trop générique masque les erreurs spécifiques et peut cacher des bugs graves, rendant le diagnostic plus difficile",
        "Parce que catch (Exception ex) ralentit systématiquement le programme de façon significative",
        "Parce que finally ne peut pas être utilisé avec catch (Exception ex)",
      ],
      answer: "Parce que catcher une exception trop générique masque les erreurs spécifiques et peut cacher des bugs graves, rendant le diagnostic plus difficile",
      explanation:
        "Catcher systématiquement Exception (la classe la plus générale) risque d'avaler silencieusement des erreurs imprévues (NullReferenceException, bugs de logique) qu'il aurait fallu laisser remonter ou traiter spécifiquement.",
    },

    // ==================== SECTION C: SQL IDENTITY ====================
    {
      question: "[SQL Identity] Que définissent le seed et l'increment dans IDENTITY(seed, increment) ?",
      options: [
        "seed = nombre maximal de lignes, increment = taille de la table",
        "seed = valeur de départ de la séquence, increment = pas entre deux valeurs générées",
        "seed = nom de la colonne, increment = type de données",
        "seed et increment n'ont aucun effet réel sur la génération des valeurs",
      ],
      answer: "seed = valeur de départ de la séquence, increment = pas entre deux valeurs générées",
      explanation:
        "IDENTITY(1,1) démarre à 1 (seed) et incrémente de 1 (increment) à chaque insertion. IDENTITY(1000,5) démarrerait à 1000 et incrémenterait de 5 à chaque fois.",
    },
    {
      question: "[SQL Identity] Pourquoi @@IDENTITY est-elle considérée comme risquée en présence de triggers sur la table ?",
      options: [
        "@@IDENTITY ne fonctionne que sur les tables sans clé primaire",
        "@@IDENTITY retourne la dernière IDENTITY générée sur la connexion tous scopes confondus — si un trigger insère dans une autre table avec IDENTITY, elle peut retourner l'ID du trigger et non celui de l'INSERT d'origine",
        "@@IDENTITY est en réalité identique à SCOPE_IDENTITY() dans tous les cas",
        "@@IDENTITY provoque systématiquement une erreur de syntaxe",
      ],
      answer: "@@IDENTITY retourne la dernière IDENTITY générée sur la connexion tous scopes confondus — si un trigger insère dans une autre table avec IDENTITY, elle peut retourner l'ID du trigger et non celui de l'INSERT d'origine",
      explanation:
        "@@IDENTITY a une portée globale à la connexion, sans respecter le 'scope' (batch/procédure). Si un trigger déclenché par l'INSERT insère lui-même dans une autre table IDENTITY, @@IDENTITY retournera cet ID-là, pas celui attendu.",
    },
    {
      question: "[SQL Identity] Que retourne SCOPE_IDENTITY() par rapport à @@IDENTITY ?",
      options: [
        "Exactement la même valeur qu'@@IDENTITY, sans aucune différence",
        "La dernière IDENTITY générée dans le même scope (même batch/procédure/déclencheur appelant), ignorant les IDENTITY générées par des triggers dans un scope différent",
        "La toute première valeur IDENTITY jamais générée sur la table",
        "Une valeur aléatoire à chaque appel",
      ],
      answer: "La dernière IDENTITY générée dans le même scope (même batch/procédure/déclencheur appelant), ignorant les IDENTITY générées par des triggers dans un scope différent",
      explanation:
        "SCOPE_IDENTITY() limite la recherche au scope courant (le batch SQL ou la procédure qui vient d'exécuter l'INSERT), ce qui la rend fiable même en présence de triggers déclenchant d'autres insertions IDENTITY ailleurs.",
    },
    {
      question: "[SQL Identity] Qu'est-ce qui distingue IDENT_CURRENT('Table') de SCOPE_IDENTITY() ?",
      options: [
        "IDENT_CURRENT donne la dernière IDENTITY générée sur une TABLE précise, toutes sessions et tous scopes confondus, alors que SCOPE_IDENTITY() est limitée à la session et au scope courants",
        "Les deux fonctions sont rigoureusement équivalentes",
        "IDENT_CURRENT ne fonctionne que sur les colonnes non-IDENTITY",
        "SCOPE_IDENTITY() ignore complètement la notion de table",
      ],
      answer: "IDENT_CURRENT donne la dernière IDENTITY générée sur une TABLE précise, toutes sessions et tous scopes confondus, alors que SCOPE_IDENTITY() est limitée à la session et au scope courants",
      explanation:
        "IDENT_CURRENT('Table') interroge directement la table, sans notion de session ni de scope — en environnement multi-utilisateur concurrent, un autre utilisateur peut avoir inséré une ligne entre-temps, rendant IDENT_CURRENT peu fiable pour récupérer 'son propre' ID inséré.",
    },
  ],

  avance: [
    // ==================== SECTION D: EF6 AVANCE ====================
    {
      question: "[EF6] Que fait concrètement SaveChanges() au niveau de la base de données ?",
      options: [
        "Il exécute immédiatement chaque modification dès qu'elle est faite en mémoire, sans attendre",
        "Il supprime toutes les entités trackées",
        "Il analyse le ChangeTracker pour détecter les entités Added/Modified/Deleted, puis génère et exécute les instructions SQL correspondantes dans une transaction implicite",
        "Il recompile le modèle EF à chaque appel",
      ],
      answer: "Il analyse le ChangeTracker pour détecter les entités Added/Modified/Deleted, puis génère et exécute les instructions SQL correspondantes dans une transaction implicite",
      explanation:
        "EF suit l'état de chaque entité trackée (Added, Modified, Deleted, Unchanged). SaveChanges() parcourt ce ChangeTracker, génère les instructions SQL adaptées, et les exécute typiquement dans une transaction implicite unique.",
    },
    {
      question: "[EF6] Pourquoi le fait d'utiliser Include(a => a.B).Include(a => a.C) sur plusieurs collections peut-il dégrader la performance (explosion cartésienne) ?",
      options: [
        "Include ne peut jamais être combiné avec plusieurs relations",
        "Inclure plusieurs collections en une seule requête via des JOIN peut générer une explosion du nombre de lignes retournées (produit cartésien), ralentissant la requête et le mapping",
        "Include ignore silencieusement le second appel",
        "Cela provoque systématiquement une exception SQL",
      ],
      answer: "Inclure plusieurs collections en une seule requête via des JOIN peut générer une explosion du nombre de lignes retournées (produit cartésien), ralentissant la requête et le mapping",
      explanation:
        "Quand on Include plusieurs collections (one-to-many) sur la même entité racine, EF génère des JOIN qui peuvent multiplier le nombre de lignes retournées (produit cartésien), ce qui peut être bien plus coûteux que des requêtes séparées.",
    },
    {
      question: "[EF6] Pourquoi préférer une projection (Select vers un DTO) plutôt que de charger l'entité complète pour un affichage en lecture seule ?",
      options: [
        "Une projection ne rapatrie que les colonnes nécessaires depuis la base, réduisant la bande passante réseau et le travail de mapping, contrairement au chargement de l'entité complète",
        "Une projection charge automatiquement toutes les relations",
        "Il n'y a aucune différence de performance entre les deux approches",
        "Select ne peut être utilisé qu'avec AsNoTracking désactivé",
      ],
      answer: "Une projection ne rapatrie que les colonnes nécessaires depuis la base, réduisant la bande passante réseau et le travail de mapping, contrairement au chargement de l'entité complète",
      explanation:
        "context.Orders.Select(o => new { o.Id, o.Symbol }) génère une requête SQL qui ne sélectionne que ces colonnes, contrairement à charger l'entité Order complète avec toutes ses propriétés et relations potentielles.",
    },

    // ==================== SECTION E: TRY/CATCH AVANCE ====================
    {
      question: "[try/catch/finally] Si un bloc catch lève lui-même une nouvelle exception, le bloc finally s'exécute-t-il quand même ?",
      options: [
        "Non, une exception dans catch annule le finally correspondant",
        "Oui, le finally s'exécute toujours avant que la nouvelle exception ne continue à se propager vers l'appelant",
        "Seulement si le catch utilise explicitement un mot-clé spécial",
        "Le comportement dépend de la version de .NET utilisée",
      ],
      answer: "Oui, le finally s'exécute toujours avant que la nouvelle exception ne continue à se propager vers l'appelant",
      explanation:
        "Le bloc finally est garanti de s'exécuter avant que le contrôle ne quitte réellement le bloc try/catch/finally, que ce soit via un return normal, une exception d'origine, ou une nouvelle exception levée dans catch.",
    },
    {
      question: "[try/catch/finally] Pourquoi capturer des exceptions spécifiques (ex: SqlException, TimeoutException) est-il préférable à catcher uniquement Exception ?",
      options: [
        "Parce que Exception ne compile pas en C#",
        "Parce que capturer des types spécifiques permet d'appliquer une stratégie de gestion adaptée à chaque cas (retry, log, alerte) sans masquer les erreurs imprévues qui devraient remonter",
        "Parce que Exception est plus lente à instancier que SqlException",
        "Il n'y a aucune différence pratique",
      ],
      answer: "Parce que capturer des types spécifiques permet d'appliquer une stratégie de gestion adaptée à chaque cas (retry, log, alerte) sans masquer les erreurs imprévues qui devraient remonter",
      explanation:
        "Catcher SqlException séparément permet par exemple de retenter une connexion, alors qu'une NullReferenceException imprévue devrait plutôt remonter pour révéler un bug. Catcher uniquement Exception traite tout de la même façon, ce qui est rarement souhaitable.",
    },
    {
      question: "[try/catch/finally] Dans une méthode qui ouvre une transaction EF (BeginTransaction), où doit-on placer le Commit et le Rollback pour garantir la cohérence ?",
      options: [
        "Le Commit dans finally et le Rollback n'est jamais nécessaire",
        "Le Commit dans le bloc try après SaveChanges réussi, et le Rollback dans le bloc catch en cas d'exception, avant de relancer ou logger l'erreur",
        "Le Commit et le Rollback doivent tous les deux être dans finally",
        "La transaction se gère automatiquement sans code explicite dans EF6",
      ],
      answer: "Le Commit dans le bloc try après SaveChanges réussi, et le Rollback dans le bloc catch en cas d'exception, avant de relancer ou logger l'erreur",
      explanation:
        "Le pattern standard consiste à Commit à la fin du try si tout s'est bien passé, et à Rollback dans le catch si une exception survient, afin de ne jamais laisser une transaction partiellement appliquée en base.",
    },

    // ==================== SECTION F: IDENTITY AVANCE ====================
    {
      question: "[SQL Identity] Dans un environnement multi-utilisateur à forte concurrence, pourquoi IDENT_CURRENT('Table') est-elle dangereuse pour récupérer 'son propre' ID inséré ?",
      options: [
        "IDENT_CURRENT est plus lente que les autres fonctions, sans risque de résultat faux",
        "IDENT_CURRENT retourne la dernière valeur générée sur la table, indépendamment de qui l'a insérée — un autre utilisateur peut avoir inséré une ligne juste après vous, faussant le résultat",
        "IDENT_CURRENT ne peut être utilisée qu'une seule fois par session SQL",
        "IDENT_CURRENT ne fonctionne pas avec les tables ayant un trigger",
      ],
      answer: "IDENT_CURRENT retourne la dernière valeur générée sur la table, indépendamment de qui l'a insérée — un autre utilisateur peut avoir inséré une ligne juste après vous, faussant le résultat",
      explanation:
        "IDENT_CURRENT n'a pas de notion de session ni de scope : elle regarde uniquement l'état actuel de la table. Dans un contexte concurrent, entre votre INSERT et votre appel à IDENT_CURRENT, un autre utilisateur peut avoir inséré une ligne, faussant totalement le résultat.",
    },
    {
      question: "[SQL Identity] En Entity Framework 6, comment le framework récupère-t-il typiquement la valeur générée par IDENTITY après un Add + SaveChanges ?",
      options: [
        "EF ne peut jamais récupérer une valeur IDENTITY générée par la base",
        "L'utilisateur doit obligatoirement appeler SCOPE_IDENTITY() manuellement en SQL brut",
        "EF6 exécute en interne, autour de l'INSERT, une récupération équivalente à SCOPE_IDENTITY() puis met automatiquement à jour la propriété clé de l'entité en mémoire",
        "EF6 utilise systématiquement @@IDENTITY, jamais SCOPE_IDENTITY()",
      ],
      answer: "EF6 exécute en interne, autour de l'INSERT, une récupération équivalente à SCOPE_IDENTITY() puis met automatiquement à jour la propriété clé de l'entité en mémoire",
      explanation:
        "Quand une propriété est configurée comme DatabaseGeneratedOption.Identity, EF6 génère automatiquement le SQL nécessaire pour récupérer la valeur IDENTITY générée (équivalent à SCOPE_IDENTITY()) et hydrate la propriété correspondante sur l'objet .NET après l'insertion.",
    },
    {
      question: "[SQL Identity] Pourquoi SCOPE_IDENTITY() est-elle presque toujours recommandée en pratique par rapport à @@IDENTITY et IDENT_CURRENT() ?",
      options: [
        "Parce qu'elle est plus rapide à exécuter en termes de temps CPU",
        "Parce qu'elle offre le bon compromis : elle respecte le scope courant (contrairement à @@IDENTITY perturbée par les triggers) et n'est pas affectée par les autres sessions concurrentes (contrairement à IDENT_CURRENT)",
        "Parce que c'est la seule fonction supportée par Entity Framework",
        "Parce qu'elle fonctionne uniquement sur les tables sans triggers",
      ],
      answer: "Parce qu'elle offre le bon compromis : elle respecte le scope courant (contrairement à @@IDENTITY perturbée par les triggers) et n'est pas affectée par les autres sessions concurrentes (contrairement à IDENT_CURRENT)",
      explanation:
        "SCOPE_IDENTITY() est le juste milieu : assez précise pour ignorer les IDENTITY générées par des triggers dans un autre scope (contrairement à @@IDENTITY), et assez isolée pour ne pas être polluée par d'autres sessions concurrentes (contrairement à IDENT_CURRENT).",
    },
  ],

  expert: [
    // ==================== SECTION G: BUGS A REPERER ====================
    {
      question:
        "[Bug à repérer] Quel est le problème de performance dans ce code qui affiche la liste des ordres avec le nom de leur client ?\n\n```csharp\nvar orders = context.Orders.ToList();\nforeach (var order in orders)\n{\n    Console.WriteLine(order.Client.Name); // accès à une propriété de navigation\n}\n```",
      options: [
        "Aucun problème, ToList() charge déjà tout",
        "Il manque un await devant ToList()",
        "Console.WriteLine ne peut pas accéder aux propriétés de navigation",
        "Sans Include, chaque accès à order.Client déclenche une requête SQL supplémentaire (lazy loading) — problème N+1 classique",
      ],
      answer: "Sans Include, chaque accès à order.Client déclenche une requête SQL supplémentaire (lazy loading) — problème N+1 classique",
      explanation:
        "Si le lazy loading est activé et qu'aucun Include(o => o.Client) n'a été fait, chaque accès à order.Client dans la boucle déclenche sa propre requête SQL vers la base : 1 requête pour charger les ordres + N requêtes pour les clients.",
    },
    {
      question:
        "[Bug à repérer] Quel est le risque dans ce code d'insertion avec récupération d'ID ?\n\n```sql\nINSERT INTO Orders (Symbol, Qty) VALUES ('AAPL', 100);\nSELECT @@IDENTITY;\n```\nSachant que la table Orders possède un trigger AFTER INSERT qui insère une ligne d'audit dans une autre table également IDENTITY.",
      options: [
        "Aucun risque, @@IDENTITY est toujours fiable quel que soit le contexte",
        "@@IDENTITY risque de retourner l'ID généré par le trigger d'audit plutôt que l'ID de l'ordre inséré — il faut utiliser SCOPE_IDENTITY() à la place",
        "Le trigger empêche totalement l'INSERT de fonctionner",
        "@@IDENTITY ne fonctionne qu'avec des triggers INSTEAD OF",
      ],
      answer: "@@IDENTITY risque de retourner l'ID généré par le trigger d'audit plutôt que l'ID de l'ordre inséré — il faut utiliser SCOPE_IDENTITY() à la place",
      explanation:
        "@@IDENTITY ignore la notion de scope : si le trigger déclenché par l'INSERT génère lui-même une valeur IDENTITY (dans la table d'audit), @@IDENTITY retournera cette dernière valeur plutôt que celle de l'ordre. SCOPE_IDENTITY() reste cantonnée au scope de l'INSERT d'origine.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce code de gestion de transaction ?\n\n```csharp\nvar transaction = context.Database.BeginTransaction();\ncontext.Orders.Add(order);\ncontext.SaveChanges();\ntransaction.Commit();\n```",
      options: [
        "Add() ne peut jamais être utilisé avec une transaction explicite",
        "Il n'y a aucun problème, ce code est complet",
        "Il manque un try/catch avec Rollback en cas d'échec de SaveChanges, et un using/Dispose pour libérer la transaction quoi qu'il arrive",
        "BeginTransaction() doit obligatoirement être appelé après SaveChanges()",
      ],
      answer: "Il manque un try/catch avec Rollback en cas d'échec de SaveChanges, et un using/Dispose pour libérer la transaction quoi qu'il arrive",
      explanation:
        "Si SaveChanges() échoue (contrainte violée, timeout...), ce code laisse la transaction ouverte sans Rollback ni libération de ressource. Il faut envelopper cela dans try/catch/finally (ou using) pour garantir Rollback et Dispose en cas d'erreur.",
    },

    // ==================== SECTION H: COMBOS PERFORMANCE ====================
    {
      question:
        "[Optimisation] Vous devez insérer 50 000 nouveaux ordres en base via Entity Framework 6. Quelle approche est la plus performante ?",
      options: [
        "Appeler context.Orders.Add(order) puis context.SaveChanges() individuellement pour chacun des 50 000 ordres",
        "Ajouter tous les ordres au contexte avec Add(), désactiver AutoDetectChangesEnabled pendant l'ajout, puis appeler SaveChanges() une seule fois (ou par lots) à la fin",
        "Utiliser exclusivement AsNoTracking() pour l'insertion",
        "Créer 50 000 DbContext différents, un par ordre",
      ],
      answer: "Ajouter tous les ordres au contexte avec Add(), désactiver AutoDetectChangesEnabled pendant l'ajout, puis appeler SaveChanges() une seule fois (ou par lots) à la fin",
      explanation:
        "Appeler SaveChanges() à chaque ordre génère un aller-retour réseau par ordre — extrêmement lent à grande échelle. Désactiver temporairement AutoDetectChangesEnabled pendant les Add() répétés évite aussi un coût de détection de changements O(n) à chaque ajout, et batcher les SaveChanges() réduit drastiquement le nombre d'allers-retours.",
    },
    {
      question:
        "[Optimisation] Une API expose une liste paginée de 100 000 ordres en lecture seule. Quelle combinaison EF est la plus rapide ?",
      options: [
        "context.Orders.ToList() puis pagination et projection en mémoire côté C#",
        "context.Orders.Include(o => o.Client).Include(o => o.Executions).ToList() puis filtrage manuel",
        "context.Orders.AsNoTracking().OrderBy(o => o.Id).Skip(page * size).Take(size).Select(o => new OrderSummaryDto {...})",
        "Charger toute la table en mémoire dans un cache statique au démarrage de l'application",
      ],
      answer: "context.Orders.AsNoTracking().OrderBy(o => o.Id).Skip(page * size).Take(size).Select(o => new OrderSummaryDto {...})",
      explanation:
        "AsNoTracking() évite le coût du tracking pour de la lecture seule, la pagination (Skip/Take) est appliquée côté SQL (donc seules les lignes nécessaires sont transférées), et la projection Select ne rapatrie que les colonnes utiles au DTO — c'est la combinaison la plus efficace pour ce cas d'usage.",
    },
    {
      question:
        "[Optimisation] Vous insérez un ordre puis devez immédiatement l'utiliser dans un second INSERT lié (ex: table d'exécution) dans le même batch SQL. Quelle fonction utiliser pour garantir la fiabilité, même en présence de triggers d'audit sur la table Orders ?",
      options: [
        "@@IDENTITY, car elle est la plus simple à écrire",
        "IDENT_CURRENT('Orders'), car elle cible explicitement la bonne table",
        "SCOPE_IDENTITY(), car elle reste cantonnée au scope du batch courant, insensible aux IDENTITY générées par des triggers ou d'autres sessions",
        "Aucune des trois n'est fiable dans ce contexte, il faut faire un SELECT MAX(Id) séparé",
      ],
      answer: "SCOPE_IDENTITY(), car elle reste cantonnée au scope du batch courant, insensible aux IDENTITY générées par des triggers ou d'autres sessions",
      explanation:
        "C'est le scénario typique où @@IDENTITY et IDENT_CURRENT échouent : @@IDENTITY serait perturbée par le trigger d'audit, IDENT_CURRENT par la concurrence d'autres sessions. SCOPE_IDENTITY() est conçue précisément pour ce cas — récupérer de façon fiable l'ID généré par SON PROPRE INSERT dans le batch courant.",
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
        ? <h3 className="success">🚀 Excellent ! EF6, exceptions et Identity SQL maîtrisés.</h3>
        : <p className="fail">📚 Révisez la différence SCOPE_IDENTITY() / @@IDENTITY / IDENT_CURRENT() et les combos de performance EF.</p>
      }
    </div>
  );
};

const EFDataAccessQCM = () => {
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
            EF6 / Exceptions / SQL Identity 🔹 {level === "basic"
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

export default EFDataAccessQCM;
