// src/projects/BackendInterview/CSharpFundamentalsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Collections — List<T>, Dictionary<K,V>, HashSet<T>",
    answer:
      "◆ **Définition** : 3 structures de données génériques du namespace System.Collections.Generic\n◆ **List<T>** : liste ordonnée, taille dynamique, accès par index O(1), doublons autorisés\n◆ **Dictionary<K,V>** : association clé→valeur, accès par clé O(1) en moyenne\n◆ **HashSet<T>** : ensemble non ordonné, unicité garantie, Contains O(1)\n◆ **Cas d'usage** : List pour une liste de commandes, Dictionary pour indexer des clients par ID, HashSet pour dédupliquer des identifiants\n\n```csharp\nvar list = new List<int> { 1, 2, 3 };\nvar dict = new Dictionary<string, int> { [\"Alice\"] = 30 };\nvar set = new HashSet<int> { 1, 2, 2 }; // {1, 2}\n```",
  },
  {
    question: "List<T> — Opérations et complexité",
    answer:
      "◆ **Définition** : tableau dynamique qui se redimensionne automatiquement\n◆ **Add** : O(1) amorti (réallocation rare)\n◆ **Contains / IndexOf** : O(n), recherche linéaire\n◆ **Insert(0, x)** : O(n), décale tous les éléments\n◆ **Cas d'usage** : accumuler des résultats au fil d'un traitement (parsing, agrégation)\n\n```csharp\nvar clients = new List<Client>();\nclients.Add(new Client(\"Bob\"));\nbool exists = clients.Any(c => c.Name == \"Bob\"); // O(n)\n```\n⚠️ Pour des recherches fréquentes, préférer Dictionary ou HashSet à List.Contains",
  },
  {
    question: "Dictionary<K,V> — TryGetValue vs ContainsKey",
    answer:
      "◆ **Définition** : table de hachage clé→valeur\n◆ **ContainsKey + indexeur** : 2 accès au dictionnaire (2 hachages)\n◆ **TryGetValue** : 1 seul accès, plus performant\n◆ **KeyNotFoundException** : levée si on accède à une clé absente via l'indexeur\n◆ **Cas d'usage** : cache en mémoire, index de recherche rapide par identifiant\n\n```csharp\nif (dict.TryGetValue(\"Alice\", out int age))\n    Console.WriteLine(age);\nelse\n    Console.WriteLine(\"Non trouvé\");\n```",
  },
  {
    question: "HashSet<T> — Unicité et opérations d'ensemble",
    answer:
      "◆ **Définition** : ensemble mathématique, aucun doublon possible\n◆ **Add** : ignore silencieusement si l'élément existe déjà\n◆ **UnionWith / IntersectWith / ExceptWith** : opérations ensemblistes\n◆ **Cas d'usage** : détecter les doublons, calculer une intersection entre deux listes en O(n) au lieu de O(n²)\n\n```csharp\nvar a = new HashSet<int> { 1, 2, 3 };\nvar b = new HashSet<int> { 2, 3, 4 };\na.IntersectWith(b); // a = {2, 3}\n```",
  },
  {
    question: "Threads — Thread et gestion bas niveau",
    answer:
      "◆ **Définition** : un Thread représente un fil d'exécution du système d'exploitation\n◆ **Coût** : ~1 Mo de pile par thread, création/destruction coûteuses\n◆ **lock** : synchronise l'accès à une ressource partagée entre threads\n◆ **Cas d'usage** : rarement utilisé directement aujourd'hui — préférer Task / Thread Pool pour la plupart des besoins\n\n```csharp\nvar t = new Thread(() => Console.WriteLine(\"Hello\"));\nt.Start();\nt.Join(); // attend la fin du thread\n\nlock (_syncRoot)\n{\n    _compteur++;\n}\n```\n⚠️ Créer manuellement des Thread est aujourd'hui rare : Task/ThreadPool sont préférés",
  },
  {
    question: "Task — Abstraction au-dessus des threads",
    answer:
      "◆ **Définition** : représente une opération asynchrone qui peut s'exécuter sur le Thread Pool\n◆ **Task vs Thread** : Task est plus léger, réutilise des threads du pool, supporte la composition (ContinueWith, WhenAll)\n◆ **Task<T>** : Task qui retourne une valeur de type T\n◆ **Cas d'usage** : lancer un appel réseau ou un calcul en tâche de fond sans bloquer\n\n```csharp\nTask<int> task = Task.Run(() => CalculLong());\nint resultat = await task;\n\nawait Task.WhenAll(task1, task2, task3);\n```",
  },
  {
    question: "async/await — Programmation asynchrone",
    answer:
      "◆ **Définition** : sucre syntaxique pour écrire du code asynchrone de façon linéaire (sans callbacks imbriqués)\n◆ **async** : marque une méthode comme asynchrone, retourne Task ou Task<T>\n◆ **await** : suspend l'exécution jusqu'à la fin de la Task, sans bloquer le thread appelant\n◆ **ConfigureAwait(false)** : évite de revenir sur le contexte de synchronisation d'origine (utile en libs)\n◆ **Cas d'usage** : appeler une API REST sans bloquer le thread UI ou un thread du pool serveur\n\n```csharp\npublic async Task<OrderDto> GetOrderAsync(string id)\n{\n    var response = await _client.GetAsync($\"orders/{id}\");\n    return await response.Content.ReadFromJsonAsync<OrderDto>();\n}\n```\n⚠️ Ne jamais utiliser `.Result` ou `.Wait()` sur une Task : risque de deadlock",
  },
  {
    question: "Entity Framework 6 — DbContext et DbSet",
    answer:
      "◆ **Définition** : ORM .NET qui mappe des classes C# vers des tables SQL\n◆ **DbContext** : représente une session avec la base (unité de travail)\n◆ **DbSet<T>** : représente une table, permet des requêtes LINQ to Entities\n◆ **SaveChanges()** : persiste les changements trackés en une transaction\n◆ **Cas d'usage** : lire/écrire les ordres d'un client dans la base sans écrire de SQL manuel\n\n```csharp\npublic class TradingContext : DbContext\n{\n    public DbSet<Order> Orders { get; set; }\n}\n\nusing var ctx = new TradingContext();\nvar order = ctx.Orders.FirstOrDefault(o => o.Id == 42);\norder.Status = \"Filled\";\nctx.SaveChanges();\n```",
  },
  {
    question: "Entity Framework 6 — Chargement des données",
    answer:
      "◆ **Définition** : plusieurs stratégies pour charger les entités liées\n◆ **Lazy Loading** : chargement à la demande (au premier accès à la propriété de navigation)\n◆ **Eager Loading (.Include())** : charge les données liées en une seule requête\n◆ **Explicit Loading** : chargement manuel via .Load()\n◆ **Cas d'usage** : charger un ordre avec son client via Include pour éviter le problème N+1\n\n```csharp\nvar orders = ctx.Orders\n    .Include(o => o.Client)\n    .Where(o => o.Status == \"New\")\n    .ToList();\n```\n⚠️ Lazy Loading mal maîtrisé = problème N+1 (une requête SQL par entité liée)",
  },
  {
    question: "try / catch / finally — Gestion des exceptions",
    answer:
      "◆ **Définition** : mécanisme structuré de gestion des erreurs en C#\n◆ **try** : bloc de code surveillé\n◆ **catch (TypeException ex)** : intercepte un type d'exception précis, du plus spécifique au plus général\n◆ **finally** : s'exécute toujours, même en cas d'exception ou de return dans le try\n◆ **Cas d'usage** : libérer une ressource (connexion, fichier) même si une erreur survient\n\n```csharp\ntry\n{\n    connection.Open();\n    ExecuteQuery();\n}\ncatch (SqlException ex)\n{\n    Log(ex);\n    throw; // relance en préservant la stack trace\n}\nfinally\n{\n    connection.Close();\n}\n```\n⚠️ `throw ex;` casse la stack trace originale — toujours préférer `throw;` seul",
  },
  {
    question: "IDENTITY, @@IDENTITY, SCOPE_IDENTITY, IDENT_CURRENT",
    answer:
      "◆ **Définition** : mécanismes SQL Server pour générer et récupérer des clés auto-incrémentées\n◆ **IDENTITY(seed, increment)** : définit la valeur de départ et le pas d'incrémentation d'une colonne\n◆ **@@IDENTITY** : dernière valeur générée sur la connexion, TOUTES tables/triggers confondus (risqué)\n◆ **SCOPE_IDENTITY()** : dernière valeur générée dans le même scope (même procédure/batch) — le plus fiable\n◆ **IDENT_CURRENT('Table')** : dernière valeur générée pour une table donnée, toutes connexions confondues\n◆ **Cas d'usage** : récupérer l'ID généré juste après un INSERT pour l'utiliser immédiatement\n\n```sql\nCREATE TABLE Orders (Id INT IDENTITY(1,1) PRIMARY KEY, Symbol NVARCHAR(10));\nINSERT INTO Orders (Symbol) VALUES ('AAPL');\nSELECT SCOPE_IDENTITY(); -- valeur fiable pour CE insert\n```",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: COLLECTIONS ====================
    {
      question: "[Collections] Quelle est la complexité de Dictionary<K,V>.TryGetValue en moyenne ?",
      options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
      answer: "O(1)",
      explanation:
        "Dictionary utilise une table de hachage. TryGetValue calcule le hash de la clé et accède directement au bucket correspondant, ce qui donne une complexité O(1) en moyenne.",
    },
    {
      question: "[Collections] Pourquoi utiliser TryGetValue plutôt que ContainsKey suivi de l'indexeur ?",
      options: [
        "TryGetValue est obsolète en C# moderne",
        "Il n'y a aucune différence de performance",
        "ContainsKey ne fonctionne qu'avec des clés de type string",
        "TryGetValue effectue un seul accès au dictionnaire au lieu de deux",
      ],
      answer: "TryGetValue effectue un seul accès au dictionnaire au lieu de deux",
      explanation:
        "ContainsKey(clé) puis dict[clé] effectuent deux recherches de hachage distinctes. TryGetValue combine la vérification et la récupération en un seul accès, ce qui est plus performant.",
    },
    {
      question: "[Collections] Que se passe-t-il si on ajoute deux fois la même valeur dans un HashSet<int> ?",
      options: [
        "Une exception InvalidOperationException est levée",
        "La deuxième insertion est ignorée silencieusement, l'ensemble ne contient qu'une occurrence",
        "La valeur est stockée deux fois",
        "Le HashSet se transforme automatiquement en List",
      ],
      answer: "La deuxième insertion est ignorée silencieusement, l'ensemble ne contient qu'une occurrence",
      explanation:
        "HashSet<T>.Add() retourne un booléen indiquant si l'élément a été ajouté. S'il existe déjà, l'ajout est simplement ignoré sans erreur, garantissant l'unicité des éléments.",
    },
    {
      question: "[Collections] Quelle structure choisir pour regrouper des commandes par pays (plusieurs commandes par pays) ?",
      options: [
        "HashSet<Commande>",
        "Array<Commande>",
        "List<Commande> filtrée à chaque recherche",
        "Dictionary<string, List<Commande>>",
      ],
      answer: "Dictionary<string, List<Commande>>",
      explanation:
        "La clé (pays) pointe vers une liste de commandes. Cette structure permet un accès O(1) par pays et l'ajout de nouvelles commandes dans la bonne liste sans reparcourir toutes les données.",
    },

    // ==================== SECTION B: THREADS ====================
    {
      question: "[Threads] Pourquoi utilise-t-on un `lock` en C# ?",
      options: [
        "Pour accélérer l'exécution d'une boucle",
        "Pour empêcher plusieurs threads d'accéder simultanément à une ressource partagée et provoquer une corruption de données",
        "Pour créer un nouveau thread automatiquement",
        "Pour convertir une méthode synchrone en méthode asynchrone",
      ],
      answer: "Pour empêcher plusieurs threads d'accéder simultanément à une ressource partagée et provoquer une corruption de données",
      explanation:
        "Le mot-clé lock garantit qu'un seul thread à la fois peut exécuter le bloc de code protégé, évitant les accès concurrents non synchronisés à une variable ou structure partagée (race condition).",
    },
    {
      question: "[Threads] Quel est le principal inconvénient de créer manuellement de nombreux objets Thread ?",
      options: [
        "Les Thread ne peuvent pas exécuter de code asynchrone",
        "Chaque Thread consomme une quantité significative de mémoire (pile) et leur création/destruction est coûteuse en ressources",
        "Un Thread ne peut être utilisé qu'une seule fois dans toute l'application",
        "Les Thread sont automatiquement supprimés après 1 seconde",
      ],
      answer: "Chaque Thread consomme une quantité significative de mémoire (pile) et leur création/destruction est coûteuse en ressources",
      explanation:
        "Un Thread OS réserve environ 1 Mo de pile et son cycle de vie (création, changement de contexte, destruction) a un coût non négligeable. C'est pourquoi le Thread Pool et les Task sont préférés pour la plupart des scénarios.",
    },
    {
      question: "[Threads] Que fait la méthode Thread.Join() ?",
      options: [
        "Elle fusionne deux threads en un seul",
        "Elle bloque le thread appelant jusqu'à ce que le thread ciblé termine son exécution",
        "Elle démarre l'exécution du thread",
        "Elle met le thread en pause définitivement",
      ],
      answer: "Elle bloque le thread appelant jusqu'à ce que le thread ciblé termine son exécution",
      explanation:
        "Join() est un mécanisme de synchronisation : l'appelant attend que le thread cible se termine avant de continuer sa propre exécution.",
    },

    // ==================== SECTION C: TASK ====================
    {
      question: "[Task] Quelle est la principale différence entre Task et Thread ?",
      options: [
        "Task et Thread sont strictement identiques en C#",
        "Un Thread ne peut jamais retourner de valeur, une Task si",
        "Task est une abstraction de plus haut niveau qui s'exécute généralement sur le Thread Pool et supporte la composition (WhenAll, ContinueWith)",
        "Task ne peut être utilisée que dans les applications web",
      ],
      answer: "Task est une abstraction de plus haut niveau qui s'exécute généralement sur le Thread Pool et supporte la composition (WhenAll, ContinueWith)",
      explanation:
        "Task représente une unité de travail asynchrone qui réutilise des threads du pool plutôt que d'en créer systématiquement de nouveaux, et offre des API de composition (WhenAll, WhenAny, ContinueWith) absentes de la classe Thread.",
    },
    {
      question: "[Task] Que fait Task.WhenAll(task1, task2, task3) ?",
      options: [
        "Elle annule toutes les tâches en cours",
        "Elle exécute les tâches une par une, séquentiellement",
        "Elle retourne une Task qui se termine dès que la PREMIÈRE des trois tâches se termine",
        "Elle retourne une Task qui se termine uniquement quand LES TROIS tâches sont terminées",
      ],
      answer: "Elle retourne une Task qui se termine uniquement quand LES TROIS tâches sont terminées",
      explanation:
        "Task.WhenAll attend la complétion de toutes les tâches fournies. C'est utile pour paralléliser plusieurs opérations indépendantes et attendre qu'elles soient toutes finies avant de continuer.",
    },
    {
      question: "[Task] Que retourne une méthode asynchrone déclarée `async Task<int> CalculerAsync()` ?",
      options: [
        "Un int directement, de façon synchrone",
        "Void",
        "Une Task<int> représentant une opération asynchrone qui produira un int",
        "Un Thread contenant le résultat",
      ],
      answer: "Une Task<int> représentant une opération asynchrone qui produira un int",
      explanation:
        "Une méthode async Task<T> retourne immédiatement une Task<T> représentant l'opération en cours. La valeur de type T n'est disponible qu'une fois la Task terminée, via await ou .Result.",
    },

    // ==================== SECTION D: ASYNC/AWAIT ====================
    {
      question: "[async/await] Que fait le mot-clé `await` devant un appel de méthode asynchrone ?",
      options: [
        "Il bloque le thread appelant jusqu'à la fin de l'opération",
        "Il transforme automatiquement la méthode en méthode synchrone",
        "Il suspend l'exécution de la méthode courante jusqu'à la fin de la Task, sans bloquer le thread qui peut être réutilisé entre-temps",
        "Il crée un nouveau Thread pour exécuter l'opération",
      ],
      answer: "Il suspend l'exécution de la méthode courante jusqu'à la fin de la Task, sans bloquer le thread qui peut être réutilisé entre-temps",
      explanation:
        "await ne bloque pas le thread : il enregistre une continuation et libère le thread, qui peut traiter d'autres travaux. Quand la Task se termine, l'exécution reprend (potentiellement sur un autre thread du pool).",
    },
    {
      question: "[async/await] Pourquoi évite-t-on d'appeler `.Result` ou `.Wait()` sur une Task dans du code synchrone ?",
      options: [
        ".Result et .Wait() n'existent pas en C#",
        "Cela peut provoquer un deadlock, notamment dans des contextes avec SynchronizationContext (UI, ASP.NET classique)",
        "Cela ralentit le compilateur",
        ".Result ne fonctionne que sur les Task<T> jamais sur Task",
      ],
      answer: "Cela peut provoquer un deadlock, notamment dans des contextes avec SynchronizationContext (UI, ASP.NET classique)",
      explanation:
        "Bloquer de façon synchrone sur une Task peut créer un deadlock : le thread appelant attend la Task, mais la continuation de la Task a besoin du même contexte de synchronisation, occupé par le thread bloqué.",
    },
    {
      question: "[async/await] Quel est l'intérêt de `ConfigureAwait(false)` ?",
      options: [
        "Il annule automatiquement la Task en cas d'erreur",
        "Il évite de revenir sur le contexte de synchronisation d'origine après l'await, utile notamment dans du code de librairie",
        "Il transforme une méthode async en méthode synchrone",
        "Il force l'exécution sur le thread principal de l'UI",
      ],
      answer: "Il évite de revenir sur le contexte de synchronisation d'origine après l'await, utile notamment dans du code de librairie",
      explanation:
        "Par défaut, après un await, l'exécution tente de revenir sur le contexte capturé (ex: thread UI). ConfigureAwait(false) désactive ce comportement, ce qui améliore les performances et évite certains deadlocks dans du code de bibliothèque qui n'a pas besoin de ce contexte.",
    },
    {
      question: "[async/await] Une méthode `async void MaMethode()` est généralement déconseillée sauf dans quel cas ?",
      options: [
        "Pour toutes les méthodes appelées depuis un contrôleur REST",
        "Pour les gestionnaires d'événements (event handlers), car ils ne peuvent pas retourner de Task",
        "Pour les méthodes qui font des appels réseau",
        "async void est toujours recommandé en C#",
      ],
      answer: "Pour les gestionnaires d'événements (event handlers), car ils ne peuvent pas retourner de Task",
      explanation:
        "async void empêche l'appelant d'attendre la fin de l'opération et complique la gestion des exceptions. La seule exception acceptée est celle des event handlers, dont la signature imposée par les frameworks ne permet pas de retourner Task.",
    },
  ],

  avance: [
    // ==================== SECTION E: ENTITY FRAMEWORK 6 ====================
    {
      question: "[EF6] Que représente un DbContext dans Entity Framework 6 ?",
      options: [
        "Une simple classe utilitaire de logging",
        "Une session de travail avec la base de données, qui suit les changements des entités chargées (change tracking)",
        "Un fichier de configuration XML",
        "Un type de collection C# spécifique à EF",
      ],
      answer: "Une session de travail avec la base de données, qui suit les changements des entités chargées (change tracking)",
      explanation:
        "Le DbContext représente une unité de travail : il gère la connexion, suit les modifications apportées aux entités chargées, et traduit les appels LINQ en requêtes SQL via les DbSet.",
    },
    {
      question: "[EF6] Qu'est-ce que le 'problème N+1' en Entity Framework ?",
      options: [
        "Une erreur de compilation liée à un DbSet mal typé",
        "Une limite de 1 seule requête par DbContext",
        "Le fait qu'une requête initiale (1) déclenche ensuite N requêtes supplémentaires à cause du Lazy Loading sur chaque entité liée",
        "Un bug connu qui n'existe que dans EF Core, pas dans EF6",
      ],
      answer: "Le fait qu'une requête initiale (1) déclenche ensuite N requêtes supplémentaires à cause du Lazy Loading sur chaque entité liée",
      explanation:
        "Avec le Lazy Loading, accéder à la propriété de navigation de chaque entité dans une boucle déclenche une requête SQL séparée par entité, ce qui multiplie fortement le nombre de requêtes (1 requête principale + N requêtes liées).",
    },
    {
      question: "[EF6] Comment évite-t-on le problème N+1 avec une requête LINQ to Entities ?",
      options: [
        "En utilisant .Include() pour charger les données liées en une seule requête (Eager Loading)",
        "En désactivant complètement le DbContext",
        "En utilisant uniquement des Array au lieu de List",
        "Ce problème ne peut pas être évité en EF6",
      ],
      answer: "En utilisant .Include() pour charger les données liées en une seule requête (Eager Loading)",
      explanation:
        ".Include() indique à EF de charger les entités liées via une jointure SQL dans la même requête, évitant ainsi le déclenchement d'une requête séparée pour chaque entité liée.",
    },
    {
      question: "[EF6] Que fait la méthode SaveChanges() sur un DbContext ?",
      options: [
        "Elle affiche les changements dans la console sans les persister",
        "Elle supprime toutes les entités trackées",
        "Elle recharge toutes les données depuis la base",
        "Elle persiste en base, dans une transaction, tous les changements détectés sur les entités trackées (ajouts, modifications, suppressions)",
      ],
      answer: "Elle persiste en base, dans une transaction, tous les changements détectés sur les entités trackées (ajouts, modifications, suppressions)",
      explanation:
        "SaveChanges() analyse l'état de toutes les entités suivies par le DbContext (Added, Modified, Deleted) et génère les instructions SQL correspondantes (INSERT, UPDATE, DELETE), exécutées dans une transaction.",
    },
    {
      question: "[EF6] Quelle est la différence entre Lazy Loading et Eager Loading ?",
      options: [
        "Il n'y a aucune différence, ce sont deux noms pour le même mécanisme",
        "Lazy Loading charge tout immédiatement, Eager Loading charge à la demande",
        "Lazy Loading charge les données liées à la demande (au premier accès), Eager Loading les charge immédiatement via .Include()",
        "Eager Loading n'existe pas en Entity Framework 6",
      ],
      answer: "Lazy Loading charge les données liées à la demande (au premier accès), Eager Loading les charge immédiatement via .Include()",
      explanation:
        "Lazy Loading diffère le chargement d'une propriété de navigation jusqu'à son premier accès (une requête SQL supplémentaire à ce moment-là). Eager Loading, via .Include(), charge tout en une seule requête dès le départ.",
    },

    // ==================== SECTION F: TRY/CATCH/FINALLY ====================
    {
      question: "[Exceptions] Dans quel ordre C# évalue-t-il plusieurs blocs `catch` successifs ?",
      options: [
        "Aléatoirement",
        "Du plus général au plus spécifique",
        "Du plus spécifique au plus général, dans l'ordre où ils sont écrits",
        "Tous les blocs catch correspondants sont exécutés en même temps",
      ],
      answer: "Du plus spécifique au plus général, dans l'ordre où ils sont écrits",
      explanation:
        "C# évalue les blocs catch dans l'ordre d'écriture et exécute le premier dont le type correspond (ou est un ancêtre) du type de l'exception levée. Il faut donc toujours placer les catch les plus spécifiques avant les plus généraux (ex: catch(SqlException) avant catch(Exception)).",
    },
    {
      question: "[Exceptions] Le bloc `finally` s'exécute-t-il si le bloc `try` contient un `return` ?",
      options: [
        "Non, jamais",
        "Oui, toujours, sauf en cas d'arrêt brutal du processus (ex: Environment.FailFast)",
        "Seulement si aucune exception n'a été levée",
        "Seulement en mode Debug",
      ],
      answer: "Oui, toujours, sauf en cas d'arrêt brutal du processus (ex: Environment.FailFast)",
      explanation:
        "Le bloc finally est conçu pour s'exécuter dans presque tous les cas : succès, exception interceptée, exception non interceptée, ou même un return dans le try. Seuls des cas extrêmes (crash du processus) l'empêchent de s'exécuter.",
    },
    {
      question: "[Exceptions] Pourquoi `throw ex;` est-il déconseillé par rapport à `throw;` seul dans un bloc catch ?",
      options: [
        "throw ex; est plus rapide à l'exécution",
        "throw; ne fonctionne que pour les exceptions personnalisées",
        "throw ex; réinitialise la stack trace, ce qui masque l'origine réelle de l'erreur ; throw; seul la préserve",
        "Il n'y a aucune différence entre les deux syntaxes",
      ],
      answer: "throw ex; réinitialise la stack trace, ce qui masque l'origine réelle de l'erreur ; throw; seul la préserve",
      explanation:
        "throw ex; traite l'exception comme si elle était levée à cet endroit précis, écrasant la stack trace d'origine. throw; (sans argument) relance l'exception capturée en conservant sa stack trace complète, ce qui facilite grandement le débogage.",
    },
    {
      question: "[Exceptions] Que se passe-t-il si une exception est levée à l'intérieur d'un bloc `finally` ?",
      options: [
        "C'est impossible, le compilateur l'interdit",
        "Elle est automatiquement ignorée",
        "Cette nouvelle exception peut masquer une exception déjà en cours de propagation depuis le try/catch",
        "Le programme s'arrête immédiatement sans message d'erreur",
      ],
      answer: "Cette nouvelle exception peut masquer une exception déjà en cours de propagation depuis le try/catch",
      explanation:
        "Si une exception est déjà en cours de propagation et qu'une nouvelle exception survient dans finally, c'est cette nouvelle exception qui se propage, masquant potentiellement l'erreur originale. Il faut donc éviter le code risqué dans un bloc finally.",
    },

    // ==================== SECTION G: SQL IDENTITY ====================
    {
      question: "[SQL] Que définissent les paramètres de IDENTITY(seed, increment) sur une colonne SQL Server ?",
      options: [
        "seed = nombre maximum de lignes, increment = type de la colonne",
        "seed = la valeur de départ, increment = le pas d'incrémentation entre deux valeurs",
        "seed = le nom de la table, increment = la clé étrangère associée",
        "Ces paramètres ne concernent que les colonnes de type texte",
      ],
      answer: "seed = la valeur de départ, increment = le pas d'incrémentation entre deux valeurs",
      explanation:
        "IDENTITY(1,1) signifie que la première ligne insérée aura la valeur 1, puis chaque insertion suivante incrémentera de 1. IDENTITY(1000,5) démarrerait à 1000 et incrémenterait de 5 à chaque fois.",
    },
    {
      question: "[SQL] Pourquoi SCOPE_IDENTITY() est-elle généralement préférée à @@IDENTITY ?",
      options: [
        "SCOPE_IDENTITY() est plus rapide à exécuter dans tous les cas",
        "@@IDENTITY n'existe plus dans les versions récentes de SQL Server",
        "SCOPE_IDENTITY() se limite au scope courant (même procédure/batch), alors que @@IDENTITY peut renvoyer une valeur générée par un trigger sur une autre table, ce qui est risqué",
        "Il n'y a aucune différence pratique entre les deux",
      ],
      answer: "SCOPE_IDENTITY() se limite au scope courant (même procédure/batch), alors que @@IDENTITY peut renvoyer une valeur générée par un trigger sur une autre table, ce qui est risqué",
      explanation:
        "Si un INSERT déclenche un trigger qui insère dans une autre table avec sa propre colonne IDENTITY, @@IDENTITY renverra la valeur générée par le trigger, pas celle de l'insertion initiale. SCOPE_IDENTITY() reste fiable car elle se limite au scope courant.",
    },
    {
      question: "[SQL] Que renvoie IDENT_CURRENT('Orders') par rapport à SCOPE_IDENTITY() ?",
      options: [
        "Exactement la même valeur dans tous les cas, ce sont des synonymes",
        "La dernière valeur IDENTITY générée pour la table Orders, toutes sessions/connexions confondues, contrairement à SCOPE_IDENTITY() qui est limitée au scope courant",
        "IDENT_CURRENT ne fonctionne qu'avec des colonnes de type texte",
        "Le nombre total de lignes dans la table Orders",
      ],
      answer: "La dernière valeur IDENTITY générée pour la table Orders, toutes sessions/connexions confondues, contrairement à SCOPE_IDENTITY() qui est limitée au scope courant",
      explanation:
        "IDENT_CURRENT('Table') retourne la dernière valeur IDENTITY générée pour une table donnée, indépendamment de la session ou du scope — ce qui la rend moins fiable dans un contexte concurrent avec plusieurs utilisateurs insérant simultanément.",
    },
  ],

  expert: [
    // ==================== SECTION H: SCENARIOS COMBINES ====================
    {
      question:
        "[Scénario combiné] Un service C# doit envoyer 50 requêtes HTTP indépendantes vers une API externe le plus rapidement possible. Quelle approche est la plus adaptée ?",
      options: [
        "Créer 50 objets Thread manuellement, un par requête",
        "Faire 50 appels séquentiels avec await, un par un",
        "Utiliser Task.WhenAll sur une liste de 50 Task issues d'appels HttpClient asynchrones",
        "Utiliser une boucle for avec .Result sur chaque appel",
      ],
      answer: "Utiliser Task.WhenAll sur une liste de 50 Task issues d'appels HttpClient asynchrones",
      explanation:
        "Task.WhenAll permet de lancer les 50 appels en parallèle (sans bloquer de threads dédiés, HttpClient étant asynchrone en I/O) et d'attendre leur complétion collective — bien plus efficace que 50 Thread ou des appels séquentiels.",
    },
    {
      question:
        "[Scénario combiné] Dans une méthode qui charge une liste de 10 000 ordres depuis EF6 puis vérifie l'existence de chaque ClientId dans une liste de clients VIP, quelle structure évite un ralentissement O(n²) ?",
      options: [
        "Garder la liste de clients VIP sous forme de List<int> et utiliser Contains dans la boucle",
        "Convertir la liste de clients VIP en HashSet<int> avant la boucle, puis utiliser Contains dessus",
        "Recharger la liste de clients VIP depuis la base à chaque itération",
        "Trier la liste des ordres par ClientId avant de vérifier",
      ],
      answer: "Convertir la liste de clients VIP en HashSet<int> avant la boucle, puis utiliser Contains dessus",
      explanation:
        "List<int>.Contains() est O(n), donc vérifier 10 000 ordres contre une liste donnerait du O(n×m). En convertissant les clients VIP en HashSet<int>, Contains devient O(1), ramenant le traitement global à O(n).",
    },
    {
      question:
        "[Scénario combiné] Une méthode ASP.NET (ancien Framework, avec SynchronizationContext) appelle `var result = GetDataAsync().Result;` dans son corps. Quel est le risque principal ?",
      options: [
        "Aucun risque, c'est une pratique recommandée en ASP.NET classique",
        "Un deadlock : le thread appelant est bloqué en attendant la Task, tandis que la continuation de GetDataAsync a besoin du même SynchronizationContext, occupé",
        "Le code ne compilera simplement pas",
        "La méthode s'exécutera deux fois",
      ],
      answer: "Un deadlock : le thread appelant est bloqué en attendant la Task, tandis que la continuation de GetDataAsync a besoin du même SynchronizationContext, occupé",
      explanation:
        "C'est le scénario classique de deadlock async/await en ASP.NET classique (avec SynchronizationContext) : bloquer sur .Result empêche le contexte d'exécuter la suite de la méthode async, créant une attente circulaire.",
    },

    // ==================== SECTION I: BUGS A REPERER ====================
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce code ?\n\n```csharp\nvar occurrences = new Dictionary<string, int>();\nforeach (string mot in mots)\n{\n    occurrences[mot]++;\n}\n```",
      options: [
        "La syntaxe occurrences[mot]++ est invalide en C#",
        "Il faut utiliser un HashSet au lieu d'un Dictionary",
        "KeyNotFoundException si le mot n'existe pas encore dans le dictionnaire — il faut initialiser à 0 avant d'incrémenter (ex: via TryGetValue ou l'opérateur ??)",
        "Aucune erreur, le code fonctionne parfaitement",
      ],
      answer: "KeyNotFoundException si le mot n'existe pas encore dans le dictionnaire — il faut initialiser à 0 avant d'incrémenter (ex: via TryGetValue ou l'opérateur ??)",
      explanation:
        "occurrences[mot]++ nécessite que la clé existe déjà (car il faut lire puis écrire). Si le mot n'a jamais été vu, l'accès en lecture lève une KeyNotFoundException. Il faut initialiser (ex: occurrences.TryGetValue(mot, out var c); occurrences[mot] = c + 1;).",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans cette méthode async ?\n\n```csharp\npublic async void ProcessOrder(Order order)\n{\n    await _repository.SaveAsync(order);\n    await _notifier.NotifyAsync(order);\n}\n```",
      options: [
        "Aucun problème, c'est la bonne pratique standard",
        "async void empêche l'appelant d'attendre la fin du traitement et rend la gestion des exceptions très difficile (elles ne peuvent pas être capturées normalement) — il faut retourner Task",
        "Il ne peut pas y avoir deux await dans la même méthode",
        "NotifyAsync doit obligatoirement être appelé avant SaveAsync",
      ],
      answer: "async void empêche l'appelant d'attendre la fin du traitement et rend la gestion des exceptions très difficile (elles ne peuvent pas être capturées normalement) — il faut retourner Task",
      explanation:
        "Une méthode async void ne peut pas être awaited par l'appelant, et toute exception qu'elle lève ne peut pas être capturée par un try/catch classique autour de l'appel — elle remonte directement au SynchronizationContext. Sauf pour un event handler, il faut utiliser async Task.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce code EF6 exécuté dans une boucle ?\n\n```csharp\nforeach (var id in orderIds)\n{\n    var order = ctx.Orders.Find(id);\n    Console.WriteLine(order.Client.Name);\n}\n```",
      options: [
        "Find() n'existe pas en Entity Framework 6",
        "Ce code déclenche potentiellement une requête SQL par accès à order.Client (Lazy Loading) en plus d'une requête par Find, générant un problème N+1",
        "Il faut obligatoirement utiliser une boucle for et non foreach avec EF6",
        "Aucun problème, ce code est optimal",
      ],
      answer: "Ce code déclenche potentiellement une requête SQL par accès à order.Client (Lazy Loading) en plus d'une requête par Find, générant un problème N+1",
      explanation:
        "Sans Eager Loading (.Include(o => o.Client)), chaque accès à order.Client déclenche une requête SQL séparée à cause du Lazy Loading, en plus de la requête de Find pour chaque id. Pour n identifiants, cela peut générer jusqu'à 2n requêtes au lieu d'une ou deux.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce bloc try/catch ?\n\n```csharp\ntry\n{\n    ProcessOrder(order);\n}\ncatch (Exception ex)\n{\n    throw ex;\n}\nfinally\n{\n    connection.Close();\n}\n```",
      options: [
        "finally ne peut pas contenir connection.Close()",
        "Le catch générique attrape toutes les exceptions sans distinction et `throw ex;` réinitialise la stack trace, masquant l'origine réelle de l'erreur",
        "Il est interdit d'avoir un catch et un finally dans le même bloc try",
        "Aucun problème, c'est la bonne pratique standard",
      ],
      answer: "Le catch générique attrape toutes les exceptions sans distinction et `throw ex;` réinitialise la stack trace, masquant l'origine réelle de l'erreur",
      explanation:
        "Capturer Exception de façon générique masque des erreurs qu'on ne sait pas gérer correctement, et throw ex; efface la stack trace d'origine (il faudrait throw; seul). Un catch générique inutile qui ne fait que relancer devrait d'ailleurs souvent être supprimé.",
    },

    // ==================== SECTION J: COMPARAISONS APPROFONDIES ====================
    {
      question:
        "[Comparaison] Pourquoi dit-on que `await` en C# n'est pas équivalent à un simple appel bloquant malgré une écriture linéaire similaire ?",
      options: [
        "Parce que await empêche complètement toute erreur de survenir",
        "Parce que await libère le thread pendant l'attente (il peut traiter d'autres opérations), alors qu'un appel bloquant immobilise le thread jusqu'à la fin",
        "Parce que await ne peut être utilisé qu'une seule fois par méthode",
        "Il n'y a en réalité aucune différence entre les deux approches",
      ],
      answer: "Parce que await libère le thread pendant l'attente (il peut traiter d'autres opérations), alors qu'un appel bloquant immobilise le thread jusqu'à la fin",
      explanation:
        "C'est la différence clé de l'asynchronisme non-bloquant : await transforme la méthode en machine à états qui libère le thread pendant l'attente d'une opération I/O, permettant au thread de servir d'autres requêtes — essentiel pour la scalabilité d'un serveur.",
    },
    {
      question:
        "[Comparaison] Quelle est la différence de fiabilité entre @@IDENTITY et SCOPE_IDENTITY() dans un contexte avec des triggers actifs sur la table cible ?",
      options: [
        "SCOPE_IDENTITY() peut être faussée par un trigger, @@IDENTITY jamais",
        "@@IDENTITY peut renvoyer la valeur générée par un trigger sur une autre table plutôt que celle de l'INSERT d'origine, alors que SCOPE_IDENTITY() reste fiable en se limitant au scope de l'exécution courante",
        "Les deux fonctions sont exactement équivalentes en présence de triggers",
        "Aucune des deux fonctions ne fonctionne si un trigger est présent",
      ],
      answer: "@@IDENTITY peut renvoyer la valeur générée par un trigger sur une autre table plutôt que celle de l'INSERT d'origine, alors que SCOPE_IDENTITY() reste fiable en se limitant au scope de l'exécution courante",
      explanation:
        "C'est le piège classique de @@IDENTITY : si l'INSERT déclenche un trigger qui insère dans une autre table possédant elle-même une colonne IDENTITY, @@IDENTITY renverra cette dernière valeur, pas celle attendue. SCOPE_IDENTITY() évite ce piège.",
    },
    {
      question:
        "[Comparaison] Pourquoi le Lazy Loading d'EF6 est-il souvent déconseillé dans du code exécuté en boucle, contrairement à un accès ponctuel isolé ?",
      options: [
        "Le Lazy Loading est toujours interdit en Entity Framework 6",
        "Le Lazy Loading ne fonctionne que sur les propriétés de type chaîne de caractères",
        "Dans une boucle, chaque itération peut déclencher sa propre requête SQL supplémentaire (problème N+1), alors qu'un accès ponctuel isolé ne coûte qu'une seule requête additionnelle acceptable",
        "Le Lazy Loading est plus rapide que l'Eager Loading dans tous les cas",
      ],
      answer: "Dans une boucle, chaque itération peut déclencher sa propre requête SQL supplémentaire (problème N+1), alors qu'un accès ponctuel isolé ne coûte qu'une seule requête additionnelle acceptable",
      explanation:
        "Le coût du Lazy Loading est proportionnel au nombre d'accès aux propriétés de navigation. Un seul accès isolé a un coût négligeable, mais répété sur des centaines d'entités dans une boucle, cela génère autant de requêtes SQL supplémentaires — d'où l'intérêt de l'Eager Loading (.Include()) dans ce cas.",
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
        ? <h3 className="success">🚀 Excellent ! Fondamentaux C# maîtrisés.</h3>
        : <p className="fail">📚 Révisez async/await, le problème N+1 en EF6, et SCOPE_IDENTITY().</p>
      }
    </div>
  );
};

const CSharpFundamentalsQCM = () => {
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
            Collections / Async / EF6 / Exceptions / SQL 🔹 {level === "basic"
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

export default CSharpFundamentalsQCM;
