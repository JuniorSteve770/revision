// src/projects/BackendInterview/PerformanceOptimizationCoreQCM.js
// Contexte : .NET Core / .NET 5+ (EF Core, RabbitMQ/Azure Service Bus — pas de MSMQ)

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Optimisation performance C# (.NET Core / .NET 5+)",
    answer:
      "◆ **Définition** : optimiser un système .NET moderne, c'est agir aux bons niveaux dans le bon ORDRE\n◆ **Niveau 1** : algorithme et structures de données\n◆ **Niveau 2** : concurrence (threads, Task, parallélisme) + outils bas niveau natifs à Core (Span, Hardware Intrinsics)\n◆ **Niveau 3** : accès aux données (SQL brut, LINQ, EF Core)\n◆ **Niveau 4** : architecture de communication (REST sync/async, messaging Kafka/RabbitMQ/Azure Service Bus)\n◆ **⚠️ Piège général** : optimiser l'architecture avant d'avoir corrigé un problème algorithmique de base reste un gaspillage d'effort, quel que soit le runtime",
  },
  {
    question: "Mesurer avant d'optimiser — Big O",
    answer:
      "◆ **Définition** : la complexité algorithmique (Big O) prédit comment le temps d'exécution évolue avec la taille des données\n◆ **O(1)** constant, **O(log n)** logarithmique, **O(n)** linéaire, **O(n log n)** quasi-linéaire, **O(n²)** quadratique\n◆ **⚠️ Piège** : une micro-optimisation via Hardware Intrinsics sur du code O(1) est inutile si un O(n²) plus loin domine totalement le temps d'exécution\n◆ **Cas d'usage** : avant d'exploiter du SIMD ou du parallélisme, vérifier si l'algorithme peut passer de O(n²) à O(n log n)",
  },
  {
    question: "BenchmarkDotNet & Stopwatch — mesurer avant/après",
    answer:
      "◆ **Définition** : jamais optimiser 'à l'instinct' — toujours mesurer avant ET après un changement\n◆ **Stopwatch** : mesure simple, sensible au bruit (GC, JIT warmup, tiered compilation)\n◆ **BenchmarkDotNet** : gère le warmup, isole les mesures, produit des résultats statistiquement fiables — particulièrement utile sur .NET moderne où la 'tiered compilation' peut fausser un premier run\n◆ **⚠️ Piège** : .NET Core/.NET 5+ utilise la compilation par paliers (tiered JIT) — un run isolé peut mesurer du code encore en Tier 0 (non optimisé), donnant une fausse impression de lenteur\n◆ **Cas d'usage** : BenchmarkDotNet pour valider un gain réel avant/après un changement de structure de données ou d'algorithme",
  },
  {
    question: "Où chercher le vrai goulot — CPU vs I/O vs mémoire",
    answer:
      "◆ **Définition** : un ralentissement a toujours UNE cause dominante — l'identifier avant d'agir\n◆ **CPU-bound** : le calcul lui-même est lent → paralléliser (Parallel, PLINQ), voire vectoriser (SIMD)\n◆ **I/O-bound** : attente réseau/disque/DB → async/await, pas de parallélisation CPU\n◆ **Mémoire** : pression du Garbage Collector → réduire les allocations (Span<T>, struct, ArrayPool<T>, natif et optimisé sur Core)\n◆ **⚠️ Piège** : paralléliser du code I/O-bound avec Task.Run ne résout rien — le problème n'est pas le CPU\n◆ **Cas d'usage** : dotnet-trace / dotnet-counters (outils natifs Core) pour identifier CPU, GC, ou attentes réseau en production",
  },
  {
    question: "Mono vs Multithread — transformation & cœurs CPU",
    answer:
      "◆ **Définition** : transformer du code monothread en multithread nécessite d'identifier des unités de travail INDÉPENDANTES\n◆ **Environment.ProcessorCount** : nombre de cœurs logiques disponibles, plafond réel du parallélisme CPU-bound\n◆ **Loi d'Amdahl** : le gain de parallélisation est limité par la portion de code intrinsèquement séquentielle\n◆ **⚠️ Piège** : créer plus de threads que de cœurs disponibles pour du CPU-bound n'accélère rien, ajoute du changement de contexte\n◆ **Cas d'usage** : Parallel.ForEach avec MaxDegreeOfParallelism = Environment.ProcessorCount pour un calcul de pricing sur des milliers d'instruments",
  },
  {
    question: "Span<T>, Memory<T> & Hardware Intrinsics — spécificités Core",
    answer:
      "◆ **Définition** : outils bas niveau natifs et pleinement optimisés sur .NET Core/.NET 5+ (disponibles via NuGet mais moins performants sur Framework)\n◆ **Span<T> / Memory<T>** : manipulation de données sans allocation supplémentaire (parsing, découpage de buffers) — évite la pression GC\n◆ **System.Runtime.Intrinsics (AVX/SSE)** : accès explicite aux instructions vectorielles du CPU, exclusif à .NET Core/.NET 5+, pour du calcul numérique massif\n◆ **⚠️ Piège** : croire que Span<T> fonctionne uniquement sur des tableaux — il fonctionne aussi sur des chaînes (ReadOnlySpan<char>) et de la mémoire non managée\n◆ **Cas d'usage** : parser un flux de messages réseau (ex: FIX) avec Span<T> pour éviter d'allouer une sous-chaîne par champ extrait",
  },
  {
    question: "Boîte à outils concurrence — vue de synthèse",
    answer:
      "◆ **Thread** : bas niveau, coûteux, rarement utilisé directement\n◆ **ThreadPool / Task.Run** : CPU-bound ponctuel\n◆ **Parallel.For/ForEach** : CPU-bound sur une collection\n◆ **PLINQ (.AsParallel())** : CPU-bound dans un pipeline LINQ déclaratif\n◆ **async/await** : I/O-bound, libère le thread pendant l'attente\n◆ **⚠️ Règle d'or identique à Framework** : CPU-bound → Parallel/PLINQ ; I/O-bound → async/await — le choix ne dépend pas du runtime, seule l'implémentation sous-jacente diffère légèrement",
  },
  {
    question: "SQL brut (ADO.NET) vs LINQ vs Entity Framework Core",
    answer:
      "◆ **ADO.NET / SQL brut** : contrôle total, le plus rapide, verbeux\n◆ **LINQ to Objects** : opère sur des données déjà en mémoire\n◆ **Entity Framework Core** : traduit du LINQ en SQL, ajoute tracking et mapping — réécrit de zéro par rapport à EF6, avec un moteur de traduction de requêtes différent\n◆ **⚠️ Différence clé avec EF6** : EF Core a longtemps eu un lazy loading DÉSACTIVÉ par défaut (contrairement à EF6), réduisant naturellement le risque de N+1 accidentel — mais reste activable explicitement\n◆ **Cas d'usage** : ADO.NET pour un batch critique très haute fréquence, EF Core pour la majorité du CRUD applicatif",
  },
  {
    question: "EF Core — tracking, requêtes générées, coûts cachés",
    answer:
      "◆ **Tracking** : EF Core maintient un snapshot de chaque entité chargée — coûteux en lecture pure\n◆ **AsNoTracking()** : désactive ce suivi, gain direct en lecture seule\n◆ **Compiled queries / requêtes optimisées** : EF Core génère généralement un SQL plus proche de l'optimal qu'EF6 sur des requêtes complexes, grâce à un pipeline de traduction retravaillé\n◆ **⚠️ Piège identique à EF6** : un `.Where()` après un `.ToList()` s'exécute en LINQ to Objects, pas en SQL — toute la table est d'abord rapatriée\n◆ **Cas d'usage** : toujours filtrer AVANT le ToList()/ToListAsync() pour que le filtre soit traduit en SQL WHERE",
  },
  {
    question: "API — synchrone vs asynchrone",
    answer:
      "◆ **Synchrone** : chaque requête HTTP bloque un thread du pool jusqu'à sa complétion\n◆ **Asynchrone (async/await)** : le thread est libéré pendant l'attente I/O\n◆ **Kestrel** (serveur web natif de .NET Core/.NET 5+) : conçu dès l'origine pour un modèle asynchrone à haute performance, contrairement à IIS/ASP.NET classique historiquement plus orienté synchrone\n◆ **⚠️ Piège identique à Framework** : rendre une méthode async sans opération I/O réelle n'apporte aucun gain\n◆ **Cas d'usage** : les minimal APIs de .NET moderne encouragent nativement l'écriture de endpoints asynchrones dès la conception",
  },
  {
    question: "Timeout, retry & appels en cascade",
    answer:
      "◆ **Définition** : un appel bloquant en cascade propage la lenteur du service le plus lent jusqu'au client initial\n◆ **Timeout** : limite le temps d'attente maximal\n◆ **Retry avec backoff** : retente avec un délai croissant, pour ne pas aggraver une surcharge\n◆ **Polly** : librairie .NET (fonctionne sur Framework et Core) pour implémenter timeout/retry/circuit breaker, avec une intégration native dans HttpClientFactory sur .NET Core/.NET 5+ (AddPolicyHandler)\n◆ **⚠️ Piège** : un retry sans backoff sur un service déjà surchargé aggrave la panne ('retry storm')\n◆ **Cas d'usage** : IHttpClientFactory + Polly pour un HttpClient résilient configuré une seule fois pour toute l'application",
  },
  {
    question: "Messaging — Kafka",
    answer:
      "◆ **Définition** : plateforme de streaming distribué, débit très élevé, rétention configurable des messages\n◆ **Partitions** : un topic Kafka est découpé en partitions pour un traitement parallèle par plusieurs consommateurs\n◆ **At-least-once par défaut** : un message peut être redélivré, exactly-once nécessite une configuration spécifique\n◆ **Client .NET** : Confluent.Kafka, fonctionne identiquement sur Framework et Core (client TCP indépendant du runtime)\n◆ **Cas d'usage** : diffuser un flux de market data à de nombreux consommateurs indépendants, avec rejeu possible de l'historique",
  },
  {
    question: "Messaging — RabbitMQ / Azure Service Bus (remplaçants de MSMQ sur Core)",
    answer:
      "◆ **⚠️ Point clé** : MSMQ n'existe PAS sur .NET Core/.NET 5+ (techno Windows-only jamais portée) — RabbitMQ et Azure Service Bus sont les alternatives modernes cross-plateforme\n◆ **RabbitMQ** : broker de messages open-source, supporte plusieurs patterns (queue point-à-point, publish/subscribe, routing avancé)\n◆ **Azure Service Bus** : service de messagerie managé cloud, avec garanties de livraison, sessions, dead-letter queue intégrées\n◆ **Différence avec Kafka** : RabbitMQ/Service Bus sont orientés 'file de messages' classique (message consommé puis retiré), Kafka est un log distribué (rejouable, multi-consommateurs indépendants)\n◆ **Cas d'usage** : RabbitMQ/Azure Service Bus pour une file de tâches point-à-point ou du pub/sub applicatif classique, Kafka pour du streaming à très fort volume avec rejouabilité",
  },
  {
    question: "Synthèse — arbre de décision senior",
    answer:
      "◆ **Étape 1** : mesurer (BenchmarkDotNet/dotnet-trace) — ne jamais optimiser à l'aveugle\n◆ **Étape 2** : identifier la nature du goulot (algorithme, CPU, I/O, mémoire)\n◆ **Étape 3** : corriger l'algorithme/structure de données AVANT de paralléliser\n◆ **Étape 4** : paralléliser le CPU-bound (Parallel/PLINQ/SIMD si pertinent), rendre asynchrone l'I/O-bound\n◆ **Étape 5** : optimiser l'accès aux données (EF Core AsNoTracking, projection)\n◆ **Étape 6** : si le couplage architecture devient le goulot, découpler via messaging (Kafka/RabbitMQ/Service Bus selon le besoin réel)\n◆ **Cas d'usage** : la démarche est identique à .NET Framework — seuls les outils concrets de chaque étape diffèrent selon le runtime",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: MESURE & BIG O ====================
    {
      question: "[Mesure] Pourquoi la 'tiered compilation' (compilation par paliers) de .NET Core/.NET 5+ peut-elle fausser une mesure de performance faite avec un simple Stopwatch sur un seul run ?",
      options: [
        "La tiered compilation n'existe pas en .NET Core",
        "Le code peut être exécuté initialement dans un Tier 0 (compilation rapide, non optimisée) avant d'être recompilé en Tier 1 (optimisé) après plusieurs exécutions — un run isolé mesuré trop tôt peut donc capturer une version non optimisée du code",
        "Stopwatch ne peut techniquement pas être utilisé sur .NET Core",
        "La tiered compilation ralentit toujours le code de façon permanente",
      ],
      answer: "Le code peut être exécuté initialement dans un Tier 0 (compilation rapide, non optimisée) avant d'être recompilé en Tier 1 (optimisé) après plusieurs exécutions — un run isolé mesuré trop tôt peut donc capturer une version non optimisée du code",
      explanation:
        "La compilation par paliers de .NET Core/.NET 5+ démarre par une version rapide à compiler mais peu optimisée (Tier 0), puis recompile en JIT optimisé (Tier 1) le code fréquemment exécuté. BenchmarkDotNet gère ce warmup automatiquement, contrairement à un simple Stopwatch sur un run unique.",
    },
    {
      question: "[Big O] Pourquoi optimiser une portion de code O(1) est-il souvent inutile si le programme contient par ailleurs une boucle O(n²) ?",
      options: [
        "O(1) est toujours plus lent que O(n²) en pratique",
        "Sur des données de taille suffisante, le O(n²) domine totalement le temps d'exécution total ; micro-optimiser le O(1) n'a un effet mesurable négligeable sur le temps global",
        "O(1) et O(n²) ont toujours le même temps d'exécution",
        "Il est impossible d'avoir à la fois du O(1) et du O(n²) dans le même programme",
      ],
      answer: "Sur des données de taille suffisante, le O(n²) domine totalement le temps d'exécution total ; micro-optimiser le O(1) n'a un effet mesurable négligeable sur le temps global",
      explanation:
        "C'est le principe du goulot d'étranglement : le O(n²) croît beaucoup plus vite avec la taille des données et finit par représenter la quasi-totalité du temps d'exécution, rendant les gains sur le O(1) insignifiants en comparaison.",
    },
    {
      question: "[Goulot] Un service passe le plus clair de son temps à attendre une réponse d'une API externe. De quel type de goulot s'agit-il, et quelle est la bonne réponse ?",
      options: [
        "CPU-bound, il faut paralléliser avec Parallel.ForEach",
        "I/O-bound, il faut utiliser async/await pour libérer le thread pendant l'attente réseau",
        "Un problème de mémoire, il faut réduire les allocations",
        "Aucune action n'est possible sur ce type de goulot",
      ],
      answer: "I/O-bound, il faut utiliser async/await pour libérer le thread pendant l'attente réseau",
      explanation:
        "Une attente réseau vers une API externe est un cas classique d'I/O-bound. async/await libère le thread pour traiter autre chose pendant l'attente, contrairement à Parallel qui n'apporterait aucun bénéfice ici.",
    },

    // ==================== SECTION B: MONO/MULTITHREAD & CŒURS ====================
    {
      question: "[Cœurs CPU] Que se passe-t-il si on lance un calcul CPU-bound avec 20 threads sur une machine à 4 cœurs logiques ?",
      options: [
        "Le calcul est 20 fois plus rapide",
        "Seuls 4 threads peuvent s'exécuter réellement en même temps ; les 16 autres attendent leur tour par changement de contexte, sans gain réel et avec un léger surcoût",
        "Le programme plante automatiquement",
        ".NET Core limite silencieusement à 4 threads sans que le développeur ne le sache",
      ],
      answer: "Seuls 4 threads peuvent s'exécuter réellement en même temps ; les 16 autres attendent leur tour par changement de contexte, sans gain réel et avec un léger surcoût",
      explanation:
        "Le nombre de cœurs logiques plafonne le parallélisme réel pour du CPU-bound, quel que soit le runtime (.NET Framework ou Core). Au-delà de ce nombre, les threads supplémentaires se partagent le CPU disponible.",
    },
    {
      question: "[Span<T>] Pourquoi Span<T> peut-il réduire significativement la pression sur le Garbage Collector lors d'un parsing intensif ?",
      options: [
        "Span<T> exécute automatiquement le code sur plusieurs threads",
        "Span<T> permet de référencer une portion de mémoire existante sans allouer de nouvelles sous-chaînes/sous-tableaux, contrairement à Substring ou Split qui créent de nouvelles allocations à chaque appel",
        "Span<T> ne fonctionne que sur des types de référence comme string",
        "Span<T> remplace complètement le besoin de Garbage Collector",
      ],
      answer: "Span<T> permet de référencer une portion de mémoire existante sans allouer de nouvelles sous-chaînes/sous-tableaux, contrairement à Substring ou Split qui créent de nouvelles allocations à chaque appel",
      explanation:
        "Un parsing classique (Substring, Split) alloue une nouvelle chaîne à chaque découpe. Span<T> (et ReadOnlySpan<char>) permet de 'pointer' vers une portion de la mémoire existante sans copie, réduisant fortement les allocations dans un hot path de parsing.",
    },

    // ==================== SECTION C: BOITE A OUTILS CONCURRENCE ====================
    {
      question: "[Boîte à outils] Pour un calcul CPU intensif appliqué indépendamment à chaque élément d'une grande collection, quel outil est le plus adapté ?",
      options: [
        "async/await sur chaque élément",
        "Parallel.ForEach ou PLINQ, qui répartissent le calcul CPU-bound sur les cœurs disponibles",
        "Un simple foreach avec ConfigureAwait(false)",
        "RabbitMQ pour distribuer le calcul",
      ],
      answer: "Parallel.ForEach ou PLINQ, qui répartissent le calcul CPU-bound sur les cœurs disponibles",
      explanation:
        "Pour du CPU-bound massivement parallélisable, Parallel.ForEach ou PLINQ exploitent efficacement plusieurs cœurs localement. async/await n'apporte rien pour du calcul pur, et RabbitMQ est un outil de messaging distribué, pas de calcul parallèle local.",
    },
    {
      question: "[Boîte à outils] Pourquoi async/await n'accélère-t-il PAS un calcul CPU intensif comme le ferait Parallel.ForEach ?",
      options: [
        "async/await est en réalité plus rapide que Parallel.ForEach pour tout type de calcul",
        "async/await libère un thread pendant une attente I/O, mais un calcul CPU pur n'a pas d'attente à libérer — il continue de consommer un thread pendant toute sa durée",
        "async/await ne peut techniquement pas être utilisé avec du calcul",
        "Parallel.ForEach et async/await sont strictement identiques en interne",
      ],
      answer: "async/await libère un thread pendant une attente I/O, mais un calcul CPU pur n'a pas d'attente à libérer — il continue de consommer un thread pendant toute sa durée",
      explanation:
        "async/await résout un problème de blocage de thread pendant une ATTENTE (I/O). Un calcul CPU-bound n'attend rien : il occupe activement un cœur pendant toute sa durée. Seule une vraie répartition sur plusieurs cœurs peut l'accélérer.",
    },

    // ==================== SECTION D: SQL BRUT / LINQ / EF CORE ====================
    {
      question: "[EF Core] Quelle est une différence de comportement par défaut notable entre EF6 et EF Core concernant le lazy loading ?",
      options: [
        "Il n'y a aucune différence, le comportement par défaut est identique",
        "EF Core a longtemps eu le lazy loading DÉSACTIVÉ par défaut (nécessitant un package et une configuration explicites pour l'activer), réduisant naturellement le risque de problème N+1 accidentel, contrairement à EF6 où il est actif par défaut",
        "EF Core ne supporte techniquement pas le lazy loading, sous aucune configuration",
        "EF6 a le lazy loading désactivé par défaut, EF Core l'active par défaut",
      ],
      answer: "EF Core a longtemps eu le lazy loading DÉSACTIVÉ par défaut (nécessitant un package et une configuration explicites pour l'activer), réduisant naturellement le risque de problème N+1 accidentel, contrairement à EF6 où il est actif par défaut",
      explanation:
        "C'est un piège de confusion fréquent entre les deux ORM : EF Core nécessite d'installer le package Microsoft.EntityFrameworkCore.Proxies et de l'activer explicitement pour le lazy loading, alors qu'EF6 l'active par défaut, rendant le problème N+1 plus facile à introduire accidentellement sur EF6.",
    },
    {
      question: "[LINQ/EF Core] Que se passe-t-il si on écrit `context.Orders.ToList().Where(o => o.Symbol == \"AAPL\")` au lieu de `context.Orders.Where(o => o.Symbol == \"AAPL\").ToListAsync()` ?",
      options: [
        "Les deux requêtes génèrent exactement le même SQL et ont la même performance",
        "La première version rapatrie TOUTE la table Orders en mémoire avant de filtrer en LINQ to Objects, alors que la seconde traduit le filtre en clause WHERE SQL, ne rapatriant que les lignes pertinentes",
        "La première version est toujours plus rapide car elle évite un aller-retour réseau supplémentaire",
        "Ce piège n'existe pas sur EF Core, contrairement à EF6",
      ],
      answer: "La première version rapatrie TOUTE la table Orders en mémoire avant de filtrer en LINQ to Objects, alors que la seconde traduit le filtre en clause WHERE SQL, ne rapatriant que les lignes pertinentes",
      explanation:
        "Ce piège existe de façon identique sur EF Core et EF6 : dès que .ToList() est appelé, tout ce qui suit s'exécute en mémoire (LINQ to Objects), pas en SQL. Filtrer AVANT le ToList()/ToListAsync() garantit que le filtre est traduit en SQL.",
    },

    // ==================== SECTION E: API SYNC/ASYNC ====================
    {
      question: "[API sync/async] Pourquoi Kestrel (le serveur web natif de .NET Core/.NET 5+) est-il particulièrement adapté à un modèle asynchrone à haute performance ?",
      options: [
        "Kestrel ne supporte que le mode synchrone",
        "Kestrel a été conçu dès l'origine autour d'un modèle non bloquant, tirant pleinement parti d'async/await pour maximiser le nombre de requêtes concurrentes traitées avec un nombre limité de threads",
        "Kestrel n'a aucun rapport avec la performance des requêtes HTTP",
        "Kestrel force obligatoirement toutes les requêtes à être traitées séquentiellement",
      ],
      answer: "Kestrel a été conçu dès l'origine autour d'un modèle non bloquant, tirant pleinement parti d'async/await pour maximiser le nombre de requêtes concurrentes traitées avec un nombre limité de threads",
      explanation:
        "Contrairement à IIS/ASP.NET classique historiquement plus orienté synchrone, Kestrel a été architecturé nativement pour un modèle asynchrone haute performance, ce qui en fait un des serveurs web les plus rapides du marché sur les benchmarks (TechEmpower).",
    },
    {
      question: "[API sync/async] Pourquoi rendre une méthode `async` sans qu'elle contienne réellement d'opération I/O asynchrone n'apporte-t-il aucun gain de performance ?",
      options: [
        "Le mot-clé async accélère toujours le code, peu importe son contenu",
        "async/await ne fait que gérer la libération du thread PENDANT une attente I/O réelle ; sans attente I/O réelle à l'intérieur, il n'y a rien à libérer, et la méthode reste aussi lente (voire ajoute un léger overhead de machine à états)",
        "Une méthode async sans opération I/O ne compile pas en C#",
        "async ralentit systématiquement toute méthode qui l'utilise",
      ],
      answer: "async/await ne fait que gérer la libération du thread PENDANT une attente I/O réelle ; sans attente I/O réelle à l'intérieur, il n'y a rien à libérer, et la méthode reste aussi lente (voire ajoute un léger overhead de machine à états)",
      explanation:
        "async/await est un outil pour gérer l'attente I/O, pas un accélérateur magique. Une méthode async qui ne fait que du calcul CPU pur n'obtient aucun bénéfice de performance, quel que soit le runtime.",
    },

    // ==================== SECTION F: MESSAGING ====================
    {
      question: "[Messaging] Pourquoi ne peut-on pas utiliser MSMQ dans une application .NET Core/.NET 5+ ?",
      options: [
        "MSMQ fonctionne parfaitement sur .NET Core, il suffit d'ajouter un package NuGet",
        "MSMQ est une technologie Windows-only qui n'a jamais été portée sur .NET Core/.NET 5+ — RabbitMQ ou Azure Service Bus sont les alternatives modernes cross-plateforme à utiliser à la place",
        "MSMQ n'a jamais existé, c'est une confusion avec Kafka",
        "MSMQ fonctionne uniquement en mode conteneur Docker sur .NET Core",
      ],
      answer: "MSMQ est une technologie Windows-only qui n'a jamais été portée sur .NET Core/.NET 5+ — RabbitMQ ou Azure Service Bus sont les alternatives modernes cross-plateforme à utiliser à la place",
      explanation:
        "MSMQ est une API Windows historique, jamais portée sur .NET Core/.NET 5+ (qui vise le cross-plateforme). C'est un point de vigilance important lors d'une migration Framework → Core : tout code s'appuyant sur MSMQ doit être remplacé, typiquement par RabbitMQ ou Azure Service Bus.",
    },
  ],

  avance: [
    // ==================== SECTION G: MESURE AVANCE ====================
    {
      question: "[Mesure] Pourquoi un outil comme dotnet-trace apporte-t-il une information que BenchmarkDotNet seul ne donne pas, en particulier en production ?",
      options: [
        "dotnet-trace ne fait que mesurer le temps total, comme BenchmarkDotNet",
        "dotnet-trace permet de capturer un profil de performance directement sur un processus .NET EN COURS D'EXÉCUTION en production (sans redéployer de code instrumenté), révélant où le temps est réellement consommé dans des conditions réelles de charge",
        "dotnet-trace accélère automatiquement le code analysé",
        "BenchmarkDotNet et dotnet-trace font exactement la même chose",
      ],
      answer: "dotnet-trace permet de capturer un profil de performance directement sur un processus .NET EN COURS D'EXÉCUTION en production (sans redéployer de code instrumenté), révélant où le temps est réellement consommé dans des conditions réelles de charge",
      explanation:
        "BenchmarkDotNet mesure un code isolé dans un environnement contrôlé. dotnet-trace (et dotnet-counters) sont des outils de diagnostic natifs .NET Core permettant d'observer un processus réel en production sans le modifier, révélant des goulots qui n'apparaissent parfois qu'en conditions réelles (charge concurrente, données réelles).",
    },
    {
      question: "[Mesure] Pourquoi mesurer un algorithme uniquement sur un petit jeu de données de test peut-il induire en erreur sur sa complexité réelle ?",
      options: [
        "Un petit jeu de données donne toujours une mesure représentative de tous les volumes",
        "Sur un petit volume, les différences de complexité asymptotique (O(n) vs O(n²)) peuvent être masquées par des coûts constants ou l'overhead de setup, alors qu'elles deviennent déterminantes à grande échelle",
        "Il est impossible de mesurer la performance sur un petit jeu de données",
        "BenchmarkDotNet refuse d'exécuter des tests sur de petits volumes",
      ],
      answer: "Sur un petit volume, les différences de complexité asymptotique (O(n) vs O(n²)) peuvent être masquées par des coûts constants ou l'overhead de setup, alors qu'elles deviennent déterminantes à grande échelle",
      explanation:
        "Un algorithme O(n²) peut sembler tout aussi rapide qu'un O(n) sur 100 éléments, mais devenir dramatiquement plus lent sur 1 million d'éléments. Il faut toujours tester sur des volumes représentatifs de la production.",
    },

    // ==================== SECTION H: CONCURRENCE/SIMD AVANCE ====================
    {
      question: "[Concurrence] Pourquoi la loi d'Amdahl limite-t-elle le gain de parallélisation même avec un nombre de cœurs illimité ?",
      options: [
        "Elle ne s'applique qu'aux très vieux processeurs",
        "Parce que toute portion de code intrinsèquement séquentielle reste un goulot incompressible, quel que soit le nombre de cœurs ajoutés pour paralléliser le reste",
        "Parce qu'ajouter des cœurs ralentit toujours le programme",
        "Elle ne s'applique qu'au code I/O-bound, jamais au CPU-bound",
      ],
      answer: "Parce que toute portion de code intrinsèquement séquentielle reste un goulot incompressible, quel que soit le nombre de cœurs ajoutés pour paralléliser le reste",
      explanation:
        "Si 10% d'un algorithme est nécessairement séquentiel, ce 10% imposera toujours un temps minimal incompressible, peu importe combien de cœurs on ajoute pour paralléliser les 90% restants.",
    },
    {
      question: "[SIMD/Intrinsics] Dans quel scénario System.Runtime.Intrinsics (AVX/SSE) apporte-t-il un gain de performance que Parallel.ForEach ne peut pas offrir ?",
      options: [
        "Jamais, Parallel.ForEach est toujours équivalent ou supérieur",
        "SIMD (Single Instruction, Multiple Data) exécute une même opération arithmétique sur PLUSIEURS valeurs SIMULTANÉMENT au sein d'un seul cœur CPU (parallélisme au niveau des données/instructions), complémentaire au parallélisme multi-cœurs de Parallel.ForEach — utile pour du calcul numérique intensif sur de larges tableaux (ex: calculs financiers vectorisables)",
        "SIMD ne fonctionne que sur des chaînes de caractères",
        "SIMD remplace complètement le besoin de tout autre outil de concurrence",
      ],
      answer: "SIMD (Single Instruction, Multiple Data) exécute une même opération arithmétique sur PLUSIEURS valeurs SIMULTANÉMENT au sein d'un seul cœur CPU (parallélisme au niveau des données/instructions), complémentaire au parallélisme multi-cœurs de Parallel.ForEach — utile pour du calcul numérique intensif sur de larges tableaux (ex: calculs financiers vectorisables)",
      explanation:
        "SIMD opère à un niveau différent : au lieu de répartir le travail sur plusieurs cœurs (comme Parallel.ForEach), il exploite le fait qu'un seul cœur peut traiter plusieurs valeurs numériques en une seule instruction CPU. Les deux approches sont complémentaires et peuvent être combinées pour un gain maximal sur du calcul numérique massif.",
    },

    // ==================== SECTION I: EF CORE AVANCE ====================
    {
      question: "[EF Core] Pourquoi le fait qu'EF Core désactive le lazy loading par défaut ne garantit-il PAS l'absence totale de problème N+1 ?",
      options: [
        "Le problème N+1 n'existe techniquement pas sur EF Core",
        "Même sans lazy loading activé, un développeur peut reproduire un pattern équivalent au N+1 en exécutant manuellement une requête dans une boucle (ex: appeler context.Executions.Where(...).ToListAsync() pour chaque ordre au sein d'un foreach)",
        "EF Core empêche techniquement d'écrire une requête dans une boucle",
        "Le lazy loading désactivé élimine structurellement tout risque de requêtes multiples",
      ],
      answer: "Même sans lazy loading activé, un développeur peut reproduire un pattern équivalent au N+1 en exécutant manuellement une requête dans une boucle (ex: appeler context.Executions.Where(...).ToListAsync() pour chaque ordre au sein d'un foreach)",
      explanation:
        "Désactiver le lazy loading par défaut réduit le risque d'un N+1 ACCIDENTEL via une propriété de navigation, mais n'empêche pas un développeur d'introduire manuellement le même anti-pattern en appelant explicitement une requête à l'intérieur d'une boucle — la vigilance reste nécessaire.",
    },
    {
      question: "[EF Core/PLINQ] Pourquoi utiliser PLINQ (.AsParallel()) directement sur `context.Orders` (un DbSet EF Core) est-il généralement une mauvaise idée ?",
      options: [
        "PLINQ n'existe pas en .NET Core",
        "PLINQ est conçu pour paralléliser un traitement CPU-bound sur des données déjà en mémoire, pas pour paralléliser l'exécution d'une requête SQL distante — il faut d'abord matérialiser les données (ToListAsync) avant d'envisager PLINQ dessus si un vrai traitement CPU-bound le justifie",
        "PLINQ est toujours plus rapide qu'EF Core sur n'importe quel type de données",
        "context.Orders ne peut jamais être itéré avec PLINQ pour des raisons de sécurité",
      ],
      answer: "PLINQ est conçu pour paralléliser un traitement CPU-bound sur des données déjà en mémoire, pas pour paralléliser l'exécution d'une requête SQL distante — il faut d'abord matérialiser les données (ToListAsync) avant d'envisager PLINQ dessus si un vrai traitement CPU-bound le justifie",
      explanation:
        "Ce piège est identique sur EF Core et EF6 : PLINQ agit sur des séquences en mémoire. Appliqué directement sur un DbSet (IQueryable), le comportement est inattendu — il faut d'abord rapatrier les données (ToListAsync), puis envisager PLINQ sur le résultat en mémoire pour un vrai traitement CPU-bound.",
    },

    // ==================== SECTION J: API/MESSAGING AVANCE ====================
    {
      question: "[Timeout/Retry] Comment IHttpClientFactory combiné à Polly simplifie-t-il la mise en place de résilience (timeout/retry) par rapport à une gestion manuelle sur chaque HttpClient ?",
      options: [
        "IHttpClientFactory élimine complètement le besoin de gérer les erreurs réseau",
        "IHttpClientFactory permet d'attacher une politique Polly (timeout, retry, circuit breaker) UNE SEULE FOIS à la configuration nommée d'un client HTTP, appliquée automatiquement à chaque instance créée, plutôt que de dupliquer cette logique dans chaque appel",
        "Polly ne fonctionne que sur .NET Framework, jamais sur .NET Core",
        "IHttpClientFactory ralentit systématiquement les appels HTTP",
      ],
      answer: "IHttpClientFactory permet d'attacher une politique Polly (timeout, retry, circuit breaker) UNE SEULE FOIS à la configuration nommée d'un client HTTP, appliquée automatiquement à chaque instance créée, plutôt que de dupliquer cette logique dans chaque appel",
      explanation:
        "L'intégration AddHttpClient(...).AddPolicyHandler(...) permet de centraliser la politique de résilience (retry, timeout, circuit breaker) au niveau de la configuration du client, évitant de dupliquer ce code partout où le client HTTP est utilisé — un gain de maintenabilité et de cohérence important.",
    },
    {
      question: "[Messaging] Pourquoi découpler deux services via une queue (Kafka/RabbitMQ/Azure Service Bus) plutôt qu'un appel REST synchrone direct améliore-t-il la résilience globale du système ?",
      options: [
        "Une queue élimine complètement le besoin de gérer les erreurs",
        "Le découplage permet à l'émetteur de continuer à fonctionner même si le récepteur est temporairement indisponible ou lent (le message attend dans la queue), et absorbe les pics de charge sans faire échouer l'appel immédiatement",
        "Une queue rend systématiquement les communications plus rapides qu'un appel REST",
        "Le découplage n'apporte aucun avantage par rapport à un appel REST direct",
      ],
      answer: "Le découplage permet à l'émetteur de continuer à fonctionner même si le récepteur est temporairement indisponible ou lent (le message attend dans la queue), et absorbe les pics de charge sans faire échouer l'appel immédiatement",
      explanation:
        "Avec un appel REST synchrone direct, la disponibilité de l'émetteur dépend directement de celle du récepteur. Avec une queue, l'émetteur dépose son message et continue son travail : le récepteur le traitera dès qu'il sera disponible.",
    },
  ],

  expert: [
    // ==================== SECTION K: SCENARIOS D'ARCHITECTURE ====================
    {
      question:
        "[Scénario] Votre API minimal ASP.NET Core (sur Kestrel) commence à timeout sous forte charge. Le CPU du conteneur n'est qu'à 25% d'utilisation. Quelle est la piste d'investigation la plus pertinente en priorité ?",
      options: [
        "Ajouter davantage de cœurs CPU au conteneur, car le CPU est manifestement le goulot",
        "Vérifier si le service est I/O-bound (attentes DB/appels externes) et si le pool de connexions ou le ThreadPool est saturé par des appels synchrones bloquants — convertir ces appels en async/await libérerait la capacité sans ajouter de ressources",
        "Réécrire immédiatement toute la logique métier en Parallel.ForEach",
        "Passer directement à une architecture Kafka sans autre analyse",
      ],
      answer: "Vérifier si le service est I/O-bound (attentes DB/appels externes) et si le pool de connexions ou le ThreadPool est saturé par des appels synchrones bloquants — convertir ces appels en async/await libérerait la capacité sans ajouter de ressources",
      explanation:
        "Un CPU à 25% avec des timeouts sous charge indique presque toujours un goulot I/O-bound (ThreadPool ou pool de connexions DB saturé par des attentes bloquantes), pas un manque de CPU. Kestrel lui-même est très performant en async — le problème vient généralement de code applicatif encore synchrone dans la chaîne d'appels.",
    },
    {
      question:
        "[Scénario] Une équipe migre une application .NET Framework (EF6 + MSMQ) vers .NET 8. Le code MSMQ ne compile plus. Quelle approche de migration est la plus appropriée pour le composant de messaging ?",
      options: [
        "Réécrire une implémentation MSMQ maison en pur C# pour contourner l'absence de support",
        "Analyser le besoin réel du composant (file point-à-point simple vs besoin de streaming/rejeu) et migrer vers RabbitMQ ou Azure Service Bus (usage similaire à MSMQ) plutôt que vers Kafka si le besoin reste une simple file de tâches",
        "Abandonner la migration vers .NET Core, c'est techniquement impossible avec du messaging",
        "Utiliser Kafka systématiquement, car c'est la seule alternative existante à MSMQ",
      ],
      answer: "Analyser le besoin réel du composant (file point-à-point simple vs besoin de streaming/rejeu) et migrer vers RabbitMQ ou Azure Service Bus (usage similaire à MSMQ) plutôt que vers Kafka si le besoin reste une simple file de tâches",
      explanation:
        "MSMQ étant une file point-à-point classique, RabbitMQ ou Azure Service Bus sont les remplaçants les plus proches conceptuellement, avec une complexité de migration moindre. Kafka n'est justifié que si le besoin réel évolue vers du streaming à grande échelle avec rejouabilité — sinon c'est une complexité opérationnelle superflue.",
    },
    {
      question:
        "[Scénario] Une procédure EF Core charge 500 000 ordres avec tracking activé, les filtre en mémoire avec `.ToListAsync().Result.Where(...)`, puis effectue un calcul CPU intensif sur le résultat filtré. Le tout prend 35 secondes. Dans quel ordre corrigeriez-vous les problèmes pour un gain maximal ?",
      options: [
        "Directement paralléliser le calcul final avec Parallel.ForEach, sans toucher au reste",
        "D'abord corriger le `.Result` bloquant en un vrai `await`, déplacer le filtre AVANT le ToListAsync() pour qu'il soit traduit en SQL, désactiver le tracking avec AsNoTracking(), puis, si le calcul CPU restant est significatif, envisager Parallel.ForEach sur le résultat final réduit",
        "Ajouter immédiatement Kafka pour distribuer le traitement",
        "Remplacer EF Core par ADO.NET sans aucune autre analyse",
      ],
      answer: "D'abord corriger le `.Result` bloquant en un vrai `await`, déplacer le filtre AVANT le ToListAsync() pour qu'il soit traduit en SQL, désactiver le tracking avec AsNoTracking(), puis, si le calcul CPU restant est significatif, envisager Parallel.ForEach sur le résultat final réduit",
      explanation:
        "Plusieurs problèmes cumulés ici : le `.Result` bloque un thread inutilement (piège async/await), le filtre après ToListAsync() rapatrie tout en mémoire, et le tracking est inutile en lecture. Les corriger dans cet ordre (async correct, filtre SQL, no-tracking) réduit drastiquement le travail avant même d'envisager la parallélisation du reste.",
    },
    {
      question:
        "[Scénario] Deux microservices .NET 8 doivent communiquer : le Service A calcule un risque de portefeuille (30 secondes de calcul) et le Service B doit être notifié pour mettre à jour un dashboard. L'équipe a initialement implémenté un appel HttpClient synchrone-bloquant de A vers B (via .Result). Pourquoi est-ce un mauvais choix, et quelle alternative envisager ?",
      options: [
        "Le choix est parfait, aucun changement n'est nécessaire",
        "Un appel bloquant de 30 secondes immobilise un thread du Service A pendant tout ce temps et couple fortement la disponibilité des deux services ; utiliser une queue (Kafka/RabbitMQ/Azure Service Bus) permettrait à A de déposer le résultat de façon asynchrone dès qu'il est prêt, sans bloquer, et à B de le consommer indépendamment",
        "Il faut remplacer HttpClient par gRPC pour résoudre ce problème automatiquement",
        "La seule solution est de rendre le calcul de 30 secondes instantané",
      ],
      answer: "Un appel bloquant de 30 secondes immobilise un thread du Service A pendant tout ce temps et couple fortement la disponibilité des deux services ; utiliser une queue (Kafka/RabbitMQ/Azure Service Bus) permettrait à A de déposer le résultat de façon asynchrone dès qu'il est prêt, sans bloquer, et à B de le consommer indépendamment",
      explanation:
        "Qu'il soit implémenté en .NET Framework ou Core, un traitement long ne devrait jamais être exposé comme un appel bloquant synchrone. Le pattern classique reste le découplage via messaging, indépendamment du choix technologique précis (Kafka, RabbitMQ, ou Azure Service Bus selon le besoin réel).",
    },
    {
      question:
        "[Scénario combiné] Un batch de traitement de 2 millions de lignes de market data doit tourner en conteneur Kubernetes avec des ressources CPU limitées (2 vCPU alloués). Le calcul par ligne est intensif et vectorisable (opérations arithmétiques répétées). Quelle combinaison de leviers est la plus pertinente, en tenant compte de la contrainte de ressources ?",
      options: [
        "Lancer Parallel.ForEach avec MaxDegreeOfParallelism = 32 pour maximiser le parallélisme, indépendamment des 2 vCPU alloués",
        "Dimensionner Parallel.ForEach avec MaxDegreeOfParallelism proche des 2 vCPU réellement alloués au conteneur (pas Environment.ProcessorCount qui peut refléter la machine hôte plutôt que les limites du conteneur), et envisager du SIMD (System.Runtime.Intrinsics) pour exploiter le calcul vectoriel au sein de chaque cœur disponible, en complément du parallélisme limité",
        "Ignorer les contraintes de ressources et ajouter simplement plus de Task.Run",
        "Remplacer tout le calcul par une requête SQL, sans analyse de faisabilité",
      ],
      answer: "Dimensionner Parallel.ForEach avec MaxDegreeOfParallelism proche des 2 vCPU réellement alloués au conteneur (pas Environment.ProcessorCount qui peut refléter la machine hôte plutôt que les limites du conteneur), et envisager du SIMD (System.Runtime.Intrinsics) pour exploiter le calcul vectoriel au sein de chaque cœur disponible, en complément du parallélisme limité",
      explanation:
        "C'est un piège spécifique aux environnements conteneurisés : Environment.ProcessorCount peut ne pas refléter les limites CPU réellement imposées par Kubernetes (cgroups). Avec un parallélisme limité (2 vCPU), exploiter le SIMD pour accélérer le calcul AU SEIN de chaque cœur devient un levier complémentaire précieux, plutôt que de compter uniquement sur plus de threads qui n'apporteraient rien au-delà des ressources allouées.",
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
        ? <h3 className="success">🚀 Excellent ! Optimisation performance .NET Core/.NET 5+ maîtrisée.</h3>
        : <p className="fail">📚 Révisez l'ordre des leviers d'optimisation et pourquoi MSMQ n'existe pas sur Core.</p>
      }
    </div>
  );
};

const PerformanceOptimizationCoreQCM = () => {
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
            Optimisation Performance — .NET Core/.NET 5+ 🔹 {level === "basic"
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

export default PerformanceOptimizationCoreQCM;