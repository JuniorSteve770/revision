// src/projects/BackendInterview/PerformanceOptimizationFrameworkQCM.js
// Contexte : .NET Framework (EF6, MSMQ)

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Optimisation performance C# (.NET Framework)",
    answer:
      "◆ **Définition** : optimiser un système, c'est agir aux bons niveaux — code, concurrence, accès données, communication — dans le bon ORDRE\n◆ **Niveau 1** : algorithme et structures de données (souvent le plus gros gain)\n◆ **Niveau 2** : concurrence (threads, Task, parallélisme)\n◆ **Niveau 3** : accès aux données (SQL brut, LINQ, EF6)\n◆ **Niveau 4** : architecture de communication (REST sync/async, messaging Kafka/MSMQ)\n◆ **⚠️ Piège général** : optimiser le niveau 4 (architecture) avant d'avoir corrigé un problème algorithmique niveau 1 est un gaspillage d'effort classique",
  },
  {
    question: "Mesurer avant d'optimiser — Big O",
    answer:
      "◆ **Définition** : la complexité algorithmique (Big O) prédit comment le temps d'exécution évolue avec la taille des données\n◆ **O(1)** constant, **O(log n)** logarithmique, **O(n)** linéaire, **O(n log n)** quasi-linéaire, **O(n²)** quadratique\n◆ **⚠️ Piège** : une micro-optimisation sur du code O(1) est inutile si un O(n²) plus loin domine totalement le temps d'exécution total\n◆ **Cas d'usage** : avant d'ajouter du parallélisme, vérifier si l'algorithme lui-même peut passer de O(n²) à O(n log n) ou O(n) — souvent un gain bien supérieur",
  },
  {
    question: "BenchmarkDotNet & Stopwatch — mesurer avant/après",
    answer:
      "◆ **Définition** : jamais optimiser 'à l'instinct' — toujours mesurer avant ET après un changement\n◆ **Stopwatch** : mesure simple et rapide, mais sensible au bruit (GC, JIT warmup, autres processus)\n◆ **BenchmarkDotNet** : librairie dédiée qui gère le warmup, isole les mesures, produit des résultats statistiquement fiables (moyenne, écart-type)\n◆ **⚠️ Piège** : mesurer avec Stopwatch un seul run inclut souvent le coût du JIT warmup, faussant la mesure réelle en régime de croisière\n◆ **Cas d'usage** : BenchmarkDotNet pour valider qu'un changement de structure de données apporte un gain réel et mesurable, pas juste supposé",
  },
  {
    question: "Où chercher le vrai goulot — CPU vs I/O vs mémoire",
    answer:
      "◆ **Définition** : un ralentissement a toujours UNE cause dominante — l'identifier avant d'agir\n◆ **CPU-bound** : le processeur est à 100%, le calcul lui-même est lent → paralléliser, optimiser l'algorithme\n◆ **I/O-bound** : le CPU attend un réseau/disque/DB → async/await, pas de parallélisation CPU\n◆ **Mémoire** : pression du Garbage Collector (trop d'allocations) → réduire les allocations (Span, struct, ArrayPool)\n◆ **⚠️ Piège** : paralléliser du code I/O-bound avec Task.Run ne résout rien — le problème n'est pas le CPU\n◆ **Cas d'usage** : un profiler (dotTrace, PerfView) révèle si le temps est passé en calcul, en attente réseau, ou en GC",
  },
  {
    question: "Mono vs Multithread — transformation & cœurs CPU",
    answer:
      "◆ **Définition** : transformer du code monothread en multithread nécessite d'identifier des unités de travail INDÉPENDANTES\n◆ **Environment.ProcessorCount** : nombre de cœurs logiques disponibles, plafond réel du parallélisme CPU-bound\n◆ **Loi d'Amdahl** : le gain de parallélisation est limité par la portion de code intrinsèquement séquentielle\n◆ **⚠️ Piège** : créer plus de threads que de cœurs disponibles pour du CPU-bound n'accélère rien, ajoute du changement de contexte\n◆ **Cas d'usage** : Parallel.ForEach avec MaxDegreeOfParallelism = Environment.ProcessorCount pour un calcul de pricing sur des milliers d'instruments",
  },
  {
    question: "Boîte à outils concurrence C# — vue de synthèse",
    answer:
      "◆ **Thread** : bas niveau, coûteux à créer, rarement utilisé directement aujourd'hui\n◆ **ThreadPool / Task.Run** : pour du CPU-bound ponctuel, réutilise des threads existants\n◆ **Parallel.For/ForEach** : CPU-bound sur une collection, répartit automatiquement sur les cœurs\n◆ **PLINQ (.AsParallel())** : CPU-bound dans un pipeline LINQ déclaratif (filtrer/transformer/agréger)\n◆ **async/await** : I/O-bound, libère le thread pendant l'attente réseau/disque/DB\n◆ **⚠️ Règle d'or** : CPU-bound → Parallel/PLINQ/Task.Run ; I/O-bound → async/await ; ne jamais mélanger les deux sans raison",
  },
  {
    question: "SQL brut (ADO.NET) vs LINQ vs Entity Framework 6",
    answer:
      "◆ **ADO.NET / SQL brut** : contrôle total, le plus rapide, mais verbeux et sans typage fort du résultat\n◆ **LINQ to Objects** : opère sur des données déjà en mémoire (List, Array) — n'a rien à voir avec la DB\n◆ **Entity Framework 6 (LINQ to Entities)** : traduit du LINQ en SQL, ajoute du tracking et du mapping objet-relationnel\n◆ **⚠️ Piège** : croire qu'EF6 est TOUJOURS plus lent que le SQL brut — avec AsNoTracking() et une requête bien écrite, l'écart de performance peut être minime ; c'est surtout le tracking et le N+1 mal maîtrisés qui coûtent cher\n◆ **Cas d'usage** : ADO.NET pour un batch critique à très haute fréquence, EF6 pour la majorité du CRUD applicatif avec un bon niveau de productivité",
  },
  {
    question: "EF6 — tracking, requêtes générées, coûts cachés",
    answer:
      "◆ **Tracking** : EF6 maintient un snapshot de chaque entité chargée pour détecter les changements — coûteux en lecture pure\n◆ **AsNoTracking()** : désactive ce suivi pour la lecture seule, gain de performance direct\n◆ **Requête générée** : EF6 traduit LINQ en SQL — parfois un SQL non optimal (jointures inutiles, SELECT * implicite) selon la requête LINQ écrite\n◆ **⚠️ Piège** : un `.Where()` après un `.ToList()` s'exécute en mémoire (LINQ to Objects), pas en SQL — toute la table est d'abord rapatriée, un piège de performance fréquent\n◆ **Cas d'usage** : toujours filtrer AVANT le ToList() pour que le filtre soit traduit en SQL WHERE, pas exécuté en mémoire après un rapatriement complet",
  },
  {
    question: "API — synchrone vs asynchrone",
    answer:
      "◆ **Synchrone** : chaque requête HTTP bloque un thread du pool jusqu'à sa complétion\n◆ **Asynchrone (async/await)** : le thread est libéré pendant l'attente I/O, peut traiter une autre requête entre-temps\n◆ **Impact throughput** : sous forte charge, un service synchrone épuise son ThreadPool bien plus vite qu'un service asynchrone pour le même volume de requêtes I/O-bound\n◆ **⚠️ Piège** : rendre une méthode async sans qu'elle appelle réellement d'I/O asynchrone n'apporte AUCUN gain — async ne rend pas le CPU plus rapide\n◆ **Cas d'usage** : une API qui interroge une base de données doit utiliser des méthodes async (ex: ToListAsync() en EF6) de bout en bout pour bénéficier du gain de throughput",
  },
  {
    question: "Timeout, retry & appels en cascade",
    answer:
      "◆ **Définition** : un appel bloquant en cascade (Service A appelle B qui appelle C) propage la lenteur de C jusqu'à A\n◆ **Timeout** : limite le temps d'attente maximal, évite qu'un appel bloqué indéfiniment ne consomme des ressources sans fin\n◆ **Retry** : retente automatiquement un appel échoué, avec un backoff (délai croissant) pour ne pas aggraver une surcharge existante\n◆ **⚠️ Piège** : un retry sans backoff sur un service déjà surchargé aggrave la panne (effet de cascade, 'retry storm')\n◆ **Cas d'usage** : Polly (librairie .NET) pour implémenter timeout + retry avec backoff exponentiel autour d'un appel HTTP",
  },
  {
    question: "Messaging — Kafka",
    answer:
      "◆ **Définition** : plateforme de streaming distribué, conçue pour un débit très élevé et la rétention de messages sur une durée configurable\n◆ **Partitions** : un topic Kafka est découpé en partitions, permettant un traitement parallèle par plusieurs consommateurs\n◆ **At-least-once par défaut** : un message peut être délivré plusieurs fois en cas de re-consommation, exactly-once nécessite une configuration spécifique\n◆ **Cas d'usage** : diffuser un flux de market data (ticks de prix) à de nombreux consommateurs indépendants, avec possibilité de rejouer l'historique",
  },
  {
    question: "Messaging — MSMQ & Kafka vs MSMQ",
    answer:
      "◆ **Définition** : MSMQ (Microsoft Message Queuing) est une file de messages point-à-point native Windows, disponible sur .NET Framework\n◆ **Différence clé** : MSMQ est une file (chaque message consommé une fois, disparaît), Kafka est un log distribué (les messages restent disponibles pour rejeu, plusieurs consommateurs indépendants peuvent relire le même flux)\n◆ **⚠️ Piège** : croire que Kafka et MSMQ sont interchangeables — MSMQ convient à du traitement de tâches point-à-point simple, Kafka convient au streaming/diffusion à grande échelle avec rejouabilité\n◆ **Pourquoi découpler avec une queue plutôt qu'un appel REST synchrone** : absorbe les pics de charge, découple la disponibilité de l'émetteur et du récepteur, permet un traitement asynchrone résilient\n◆ **Cas d'usage** : MSMQ pour une file de tâches internes simples sur un système Windows existant, Kafka pour un flux d'événements de trading à fort volume et multi-consommateurs",
  },
  {
    question: "Synthèse — arbre de décision senior",
    answer:
      "◆ **Étape 1** : mesurer (BenchmarkDotNet/profiler) — ne jamais optimiser à l'aveugle\n◆ **Étape 2** : identifier la nature du goulot (algorithme, CPU, I/O, mémoire)\n◆ **Étape 3** : corriger l'algorithme/structure de données AVANT de paralléliser\n◆ **Étape 4** : paralléliser le CPU-bound restant, rendre asynchrone l'I/O-bound\n◆ **Étape 5** : optimiser l'accès aux données (AsNoTracking, projection, requêtes ciblées)\n◆ **Étape 6** : si le couplage architecture devient le goulot (appels synchrones en cascade), envisager le découplage via messaging\n◆ **Cas d'usage** : ne jamais sauter directement à 'ajoutons Kafka' sans avoir vérifié les étapes 1 à 5 en amont",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: MESURE & BIG O ====================
    {
      question: "[Mesure] Pourquoi faut-il toujours mesurer AVANT et APRÈS une optimisation, plutôt que de se fier à l'intuition ?",
      options: [
        "Parce que l'intuition est toujours fausse en programmation",
        "Parce qu'une optimisation supposée peut en réalité ne rien changer, voire dégrader la performance, et seule une mesure objective peut le confirmer",
        "Parce que BenchmarkDotNet est obligatoire pour compiler du C#",
        "Parce que mesurer accélère automatiquement le code",
      ],
      answer: "Parce qu'une optimisation supposée peut en réalité ne rien changer, voire dégrader la performance, et seule une mesure objective peut le confirmer",
      explanation:
        "L'intuition sur la performance est souvent trompeuse (JIT, cache CPU, GC ont des effets contre-intuitifs). Seule une mesure rigoureuse avant/après permet de confirmer qu'un changement apporte un gain réel.",
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
      question: "[BenchmarkDotNet] Pourquoi préférer BenchmarkDotNet à un simple Stopwatch pour mesurer la performance d'une méthode ?",
      options: [
        "Stopwatch ne peut techniquement pas mesurer du code C#",
        "BenchmarkDotNet gère le warmup JIT et isole les mesures statistiquement, évitant les biais qu'un simple run avec Stopwatch peut introduire (premier appel plus lent, bruit du GC)",
        "BenchmarkDotNet est plus rapide à exécuter que Stopwatch",
        "Les deux outils donnent toujours des résultats strictement identiques",
      ],
      answer: "BenchmarkDotNet gère le warmup JIT et isole les mesures statistiquement, évitant les biais qu'un simple run avec Stopwatch peut introduire (premier appel plus lent, bruit du GC)",
      explanation:
        "Un simple Stopwatch mesure souvent le premier appel, qui inclut le coût de compilation JIT et n'est pas représentatif du régime de croisière. BenchmarkDotNet effectue plusieurs itérations, un warmup, et produit des statistiques fiables (moyenne, écart-type).",
    },
    {
      question: "[Goulot] Un service passe le plus clair de son temps à attendre une réponse d'une base de données distante. De quel type de goulot s'agit-il, et quelle est la bonne réponse ?",
      options: [
        "CPU-bound, il faut paralléliser avec Parallel.ForEach",
        "I/O-bound, il faut utiliser async/await pour libérer le thread pendant l'attente réseau",
        "Un problème de mémoire, il faut réduire les allocations",
        "Aucune action n'est possible sur ce type de goulot",
      ],
      answer: "I/O-bound, il faut utiliser async/await pour libérer le thread pendant l'attente réseau",
      explanation:
        "Une attente réseau/DB est un cas classique d'I/O-bound. Le CPU n'a rien à faire pendant cette attente : async/await libère le thread pour traiter autre chose, contrairement à Parallel qui n'apporterait aucun bénéfice ici.",
    },

    // ==================== SECTION B: MONO/MULTITHREAD & CŒURS ====================
    {
      question: "[Cœurs CPU] Que se passe-t-il si on lance un calcul CPU-bound avec 20 threads sur une machine à 4 cœurs logiques ?",
      options: [
        "Le calcul est 20 fois plus rapide",
        "Seuls 4 threads peuvent s'exécuter réellement en même temps ; les 16 autres attendent leur tour par changement de contexte, sans gain réel et avec un léger surcoût",
        "Le programme plante automatiquement",
        "Windows limite silencieusement à 4 threads sans que le développeur ne le sache",
      ],
      answer: "Seuls 4 threads peuvent s'exécuter réellement en même temps ; les 16 autres attendent leur tour par changement de contexte, sans gain réel et avec un léger surcoût",
      explanation:
        "Le nombre de cœurs logiques plafonne le parallélisme réel pour du CPU-bound. Au-delà de ce nombre, les threads supplémentaires se partagent le CPU disponible, sans accélérer le calcul et en ajoutant un coût de changement de contexte.",
    },
    {
      question: "[Mono/Multithread] Quelle est la première question à se poser avant de transformer une boucle séquentielle en Parallel.ForEach ?",
      options: [
        "Combien de lignes de code fait la boucle",
        "Les itérations sont-elles indépendantes entre elles, sans dépendance de données ni d'ordre imposé",
        "La boucle contient-elle un commentaire",
        "Le nom de la variable de boucle est-il i ou index",
      ],
      answer: "Les itérations sont-elles indépendantes entre elles, sans dépendance de données ni d'ordre imposé",
      explanation:
        "Paralléliser des itérations dépendantes entre elles (où le résultat d'une itération influence la suivante) sans restructuration produit des résultats incorrects ou des race conditions. L'indépendance est la condition préalable indispensable.",
    },

    // ==================== SECTION C: BOITE A OUTILS CONCURRENCE ====================
    {
      question: "[Boîte à outils] Pour un calcul CPU intensif appliqué indépendamment à chaque élément d'une grande collection, quel outil est le plus adapté ?",
      options: [
        "async/await sur chaque élément",
        "Parallel.ForEach ou PLINQ, qui répartissent le calcul CPU-bound sur les cœurs disponibles",
        "Un simple foreach avec ConfigureAwait(false)",
        "MSMQ pour distribuer le calcul",
      ],
      answer: "Parallel.ForEach ou PLINQ, qui répartissent le calcul CPU-bound sur les cœurs disponibles",
      explanation:
        "Pour du CPU-bound massivement parallélisable, Parallel.ForEach (impératif) ou PLINQ (déclaratif façon LINQ) exploitent efficacement plusieurs cœurs. async/await n'apporte rien pour du calcul pur, et MSMQ est un outil de messaging, pas de calcul parallèle local.",
    },
    {
      question: "[Boîte à outils] Pourquoi async/await n'accélère-t-il PAS un calcul CPU intensif comme le ferait Parallel.ForEach ?",
      options: [
        "async/await est en réalité plus rapide que Parallel.ForEach pour tout type de calcul",
        "async/await libère un thread pendant une attente I/O, mais un calcul CPU pur n'a pas d'attente à libérer — il continue de consommer un thread pendant toute sa durée, qu'il soit awaité ou non",
        "async/await ne peut techniquement pas être utilisé avec du calcul",
        "Parallel.ForEach et async/await sont strictement identiques en interne",
      ],
      answer: "async/await libère un thread pendant une attente I/O, mais un calcul CPU pur n'a pas d'attente à libérer — il continue de consommer un thread pendant toute sa durée, qu'il soit awaité ou non",
      explanation:
        "async/await résout un problème de blocage de thread pendant une ATTENTE (I/O). Un calcul CPU-bound n'attend rien : il occupe activement un cœur pendant toute sa durée. Seule une vraie répartition sur plusieurs cœurs (Parallel, PLINQ) peut l'accélérer.",
    },

    // ==================== SECTION D: SQL BRUT / LINQ / EF6 ====================
    {
      question: "[SQL/EF6] Pourquoi croire qu'Entity Framework 6 est TOUJOURS plus lent que du SQL brut (ADO.NET) est une généralisation excessive ?",
      options: [
        "C'est vrai sans exception, EF6 est toujours plus lent",
        "Avec AsNoTracking() et une requête LINQ bien écrite, l'écart de performance avec du SQL brut équivalent peut être minime — ce sont surtout le tracking non désactivé et le problème N+1 mal maîtrisés qui creusent l'écart",
        "EF6 génère toujours un SQL plus rapide que du SQL écrit à la main",
        "Il n'existe aucune différence de performance entre EF6 et ADO.NET, dans tous les cas",
      ],
      answer: "Avec AsNoTracking() et une requête LINQ bien écrite, l'écart de performance avec du SQL brut équivalent peut être minime — ce sont surtout le tracking non désactivé et le problème N+1 mal maîtrisés qui creusent l'écart",
      explanation:
        "La lenteur perçue d'EF6 vient rarement du framework lui-même, mais de son mauvais usage : tracking laissé actif en lecture seule, lazy loading en boucle (N+1), requêtes LINQ mal formées générant un SQL sous-optimal. Bien utilisé, l'écart avec ADO.NET reste souvent faible.",
    },
    {
      question: "[LINQ/EF6] Que se passe-t-il si on écrit `context.Orders.ToList().Where(o => o.Symbol == \"AAPL\")` au lieu de `context.Orders.Where(o => o.Symbol == \"AAPL\").ToList()` ?",
      options: [
        "Les deux requêtes génèrent exactement le même SQL et ont la même performance",
        "La première version rapatrie TOUTE la table Orders en mémoire avant de filtrer en LINQ to Objects, alors que la seconde traduit le filtre en clause WHERE SQL, ne rapatriant que les lignes pertinentes",
        "La première version est toujours plus rapide car elle évite un aller-retour réseau supplémentaire",
        "ToList() ne peut être utilisé qu'à la fin d'une requête LINQ, cette syntaxe ne compile pas",
      ],
      answer: "La première version rapatrie TOUTE la table Orders en mémoire avant de filtrer en LINQ to Objects, alors que la seconde traduit le filtre en clause WHERE SQL, ne rapatriant que les lignes pertinentes",
      explanation:
        "C'est un piège de performance classique : dès que .ToList() (ou .ToArray(), .AsEnumerable()) est appelé, tout ce qui suit s'exécute en mémoire (LINQ to Objects), pas en SQL. Filtrer AVANT le ToList() garantit que le filtre est traduit en SQL, limitant les données transférées.",
    },

    // ==================== SECTION E: API SYNC/ASYNC ====================
    {
      question: "[API sync/async] Sous forte charge, pourquoi un service REST synchrone épuise-t-il son ThreadPool plus vite qu'un service asynchrone traitant le même volume de requêtes I/O-bound ?",
      options: [
        "Un service synchrone n'utilise techniquement aucun thread",
        "Chaque requête synchrone bloque un thread du pool jusqu'à la fin de son traitement (y compris pendant l'attente I/O), alors qu'un service asynchrone libère ce thread pendant l'attente, permettant de traiter davantage de requêtes concurrentes avec le même nombre de threads",
        "Un service asynchrone crée automatiquement plus de threads qu'un service synchrone",
        "Il n'y a aucune différence de consommation de threads entre les deux approches",
      ],
      answer: "Chaque requête synchrone bloque un thread du pool jusqu'à la fin de son traitement (y compris pendant l'attente I/O), alors qu'un service asynchrone libère ce thread pendant l'attente, permettant de traiter davantage de requêtes concurrentes avec le même nombre de threads",
      explanation:
        "C'est l'argument principal en faveur de l'async pour un service web à fort trafic : en libérant le thread pendant les attentes I/O (DB, appels externes), un service asynchrone peut gérer un throughput bien supérieur avec le même nombre de threads disponibles dans le pool.",
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
        "async/await est un outil pour gérer l'attente I/O, pas un accélérateur magique. Une méthode async qui ne fait que du calcul CPU pur n'obtient aucun bénéfice de performance — le compilateur génère même une machine à états avec un léger coût supplémentaire pour rien.",
    },

    // ==================== SECTION F: MESSAGING ====================
    {
      question: "[Messaging] Quelle est la différence fondamentale entre MSMQ et Kafka ?",
      options: [
        "Il n'y a aucune différence, ce sont deux noms pour la même technologie",
        "MSMQ est une file de messages point-à-point (chaque message consommé une fois puis retiré), Kafka est un log distribué qui conserve les messages pour permettre à plusieurs consommateurs indépendants de les relire",
        "Kafka ne peut être utilisé qu'avec .NET Framework, MSMQ fonctionne partout",
        "MSMQ est toujours plus performant que Kafka pour tout usage",
      ],
      answer: "MSMQ est une file de messages point-à-point (chaque message consommé une fois puis retiré), Kafka est un log distribué qui conserve les messages pour permettre à plusieurs consommateurs indépendants de les relire",
      explanation:
        "MSMQ fonctionne comme une file d'attente classique : un message consommé disparaît. Kafka fonctionne comme un journal (log) persistant : les messages restent disponibles pendant une durée configurable, permettant à plusieurs consommateurs de lire indépendamment le même flux, voire de le rejouer.",
    },
  ],

  avance: [
    // ==================== SECTION G: MESURE AVANCE ====================
    {
      question: "[Mesure] Pourquoi un profiler (dotTrace, PerfView) apporte-t-il une information que Stopwatch/BenchmarkDotNet seuls ne donnent pas ?",
      options: [
        "Un profiler ne fait que mesurer le temps total, comme Stopwatch",
        "Un profiler décompose le temps d'exécution par méthode/ligne de code, révélant PRÉCISÉMENT où le temps est consommé (calcul, allocation, appel réseau), alors qu'un simple chronométrage global ne montre qu'un temps total sans localisation",
        "Un profiler accélère automatiquement le code analysé",
        "BenchmarkDotNet et un profiler mesurent exactement la même chose",
      ],
      answer: "Un profiler décompose le temps d'exécution par méthode/ligne de code, révélant PRÉCISÉMENT où le temps est consommé (calcul, allocation, appel réseau), alors qu'un simple chronométrage global ne montre qu'un temps total sans localisation",
      explanation:
        "Stopwatch/BenchmarkDotNet répondent à 'combien de temps ?', un profiler répond à 'où exactement ce temps est-il passé ?' (call stack, allocations, temps CPU vs attente), ce qui est indispensable pour cibler la bonne optimisation plutôt que de deviner.",
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
        "Un algorithme O(n²) peut sembler tout aussi rapide qu'un O(n) sur 100 éléments, mais devenir dramatiquement plus lent sur 1 million d'éléments. Il faut toujours tester sur des volumes représentatifs de la production pour révéler le vrai comportement asymptotique.",
    },

    // ==================== SECTION H: CONCURRENCE AVANCE ====================
    {
      question: "[Concurrence] Pourquoi la loi d'Amdahl limite-t-elle le gain de parallélisation même avec un nombre de cœurs illimité ?",
      options: [
        "Elle ne s'applique qu'aux très vieux processeurs",
        "Parce que toute portion de code intrinsèquement séquentielle (qui ne peut pas être parallélisée) reste un goulot incompressible, quel que soit le nombre de cœurs ajoutés pour paralléliser le reste",
        "Parce qu'ajouter des cœurs ralentit toujours le programme",
        "Elle ne s'applique qu'au code I/O-bound, jamais au CPU-bound",
      ],
      answer: "Parce que toute portion de code intrinsèquement séquentielle (qui ne peut pas être parallélisée) reste un goulot incompressible, quel que soit le nombre de cœurs ajoutés pour paralléliser le reste",
      explanation:
        "Si 10% d'un algorithme est nécessairement séquentiel, ce 10% imposera toujours un temps minimal incompressible, peu importe combien de cœurs on ajoute pour paralléliser les 90% restants — le gain total plafonne mathématiquement.",
    },
    {
      question: "[Concurrence] Un développeur remplace un simple foreach par Parallel.ForEach sur une petite collection de 50 éléments avec un traitement très léger par élément. Pourquoi le résultat peut-il être PLUS LENT qu'avant ?",
      options: [
        "Parallel.ForEach est toujours plus rapide, ce scénario est impossible",
        "L'overhead de gestion du parallélisme (répartition du travail, synchronisation, changement de contexte entre threads) peut dépasser le gain obtenu sur un travail trop léger ou une collection trop petite pour amortir ce coût",
        "Parallel.ForEach ne fonctionne que sur des collections de plus de 1000 éléments",
        "Ce ralentissement ne peut survenir qu'avec PLINQ, jamais avec Parallel.ForEach",
      ],
      answer: "L'overhead de gestion du parallélisme (répartition du travail, synchronisation, changement de contexte entre threads) peut dépasser le gain obtenu sur un travail trop léger ou une collection trop petite pour amortir ce coût",
      explanation:
        "Paralléliser a un coût fixe (dispatching du travail, synchronisation). Sur une petite collection avec un traitement très léger par élément, ce coût fixe peut dépasser le gain de parallélisation, rendant le code séquentiel plus rapide en pratique.",
    },

    // ==================== SECTION I: SQL/EF6 AVANCE ====================
    {
      question: "[EF6] Pourquoi le lazy loading activé par défaut sur une collection de navigation peut-il devenir un problème de performance majeur dans une boucle ?",
      options: [
        "Le lazy loading n'a aucun impact sur la performance",
        "Chaque accès à la propriété de navigation dans la boucle déclenche une requête SQL séparée (problème N+1) : 1 requête pour charger N entités + N requêtes supplémentaires pour leurs relations",
        "Le lazy loading charge automatiquement toutes les relations en une seule requête optimisée",
        "Le lazy loading ne peut être activé qu'en dehors d'une boucle",
      ],
      answer: "Chaque accès à la propriété de navigation dans la boucle déclenche une requête SQL séparée (problème N+1) : 1 requête pour charger N entités + N requêtes supplémentaires pour leurs relations",
      explanation:
        "C'est le problème N+1 classique : sans Include() explicite, chaque accès à une propriété de navigation dans une boucle sur N entités génère une requête SQL individuelle, transformant 1 requête initiale en N+1 requêtes au total.",
    },
    {
      question: "[EF6/PLINQ] Pourquoi utiliser PLINQ (.AsParallel()) directement sur `context.Orders` (une IQueryable EF6) est-il généralement une mauvaise idée ?",
      options: [
        "PLINQ n'existe pas en .NET Framework",
        "PLINQ est conçu pour paralléliser un traitement CPU-bound sur des données déjà en mémoire (IEnumerable), pas pour paralléliser l'exécution d'une requête SQL distante — il faut d'abord matérialiser les données (ToList) avant d'envisager PLINQ dessus, si un vrai traitement CPU-bound le justifie",
        "PLINQ est toujours plus rapide qu'EF6 sur n'importe quel type de données",
        "context.Orders ne peut jamais être itéré avec PLINQ pour des raisons de sécurité",
      ],
      answer: "PLINQ est conçu pour paralléliser un traitement CPU-bound sur des données déjà en mémoire (IEnumerable), pas pour paralléliser l'exécution d'une requête SQL distante — il faut d'abord matérialiser les données (ToList) avant d'envisager PLINQ dessus, si un vrai traitement CPU-bound le justifie",
      explanation:
        "PLINQ agit sur des séquences en mémoire. Appliqué directement sur un IQueryable EF6, cela peut provoquer un comportement inattendu (matérialisation forcée non optimisée, voire tentative de parallélisation d'une seule connexion SQL). PLINQ n'a de sens qu'APRÈS avoir rapatrié les données en mémoire, pour un traitement CPU-bound ultérieur.",
    },

    // ==================== SECTION J: API/MESSAGING AVANCE ====================
    {
      question: "[Timeout/Retry] Pourquoi un mécanisme de retry SANS backoff (délai croissant) peut-il aggraver une panne existante plutôt que la résoudre ?",
      options: [
        "Un retry sans backoff résout toujours le problème plus rapidement",
        "Si le service appelé est déjà surchargé, des retries immédiats et répétés de nombreux clients simultanément ajoutent une charge supplémentaire massive et instantanée, aggravant la surcharge ('retry storm') plutôt que de laisser le service récupérer",
        "Le backoff n'a aucun impact sur le comportement du système sous charge",
        "Un retry sans backoff est techniquement impossible à implémenter en C#",
      ],
      answer: "Si le service appelé est déjà surchargé, des retries immédiats et répétés de nombreux clients simultanément ajoutent une charge supplémentaire massive et instantanée, aggravant la surcharge ('retry storm') plutôt que de laisser le service récupérer",
      explanation:
        "C'est le phénomène de 'retry storm' : sans délai croissant entre les tentatives, tous les clients en échec retentent en même temps, créant des vagues de charge synchronisées qui empêchent le service en difficulté de se rétablir. Un backoff exponentiel (souvent avec un peu de jitter aléatoire) évite cet effet.",
    },
    {
      question: "[Messaging] Pourquoi découpler deux services via une queue (Kafka/MSMQ) plutôt qu'un appel REST synchrone direct améliore-t-il la résilience globale du système ?",
      options: [
        "Une queue élimine complètement le besoin de gérer les erreurs",
        "Le découplage permet à l'émetteur de continuer à fonctionner même si le récepteur est temporairement indisponible ou lent (le message attend dans la queue), et absorbe les pics de charge sans faire échouer l'appel immédiatement",
        "Une queue rend systématiquement les communications plus rapides qu'un appel REST",
        "Le découplage n'apporte aucun avantage par rapport à un appel REST direct",
      ],
      answer: "Le découplage permet à l'émetteur de continuer à fonctionner même si le récepteur est temporairement indisponible ou lent (le message attend dans la queue), et absorbe les pics de charge sans faire échouer l'appel immédiatement",
      explanation:
        "Avec un appel REST synchrone direct, la disponibilité de l'émetteur dépend directement de celle du récepteur. Avec une queue, l'émetteur dépose son message et continue son travail : le récepteur le traitera dès qu'il sera disponible, absorbant à la fois les pannes temporaires et les pics de charge.",
    },
  ],

  expert: [
    // ==================== SECTION K: SCENARIOS D'ARCHITECTURE ====================
    {
      question:
        "[Scénario] Votre API REST synchrone commence à timeout sous forte charge (pic de trafic en ouverture de marché). Le CPU du serveur n'est qu'à 20% d'utilisation. Quelle est la piste d'investigation la plus pertinente en priorité ?",
      options: [
        "Ajouter davantage de cœurs CPU au serveur, car le CPU est manifestement le goulot",
        "Vérifier si le service est I/O-bound (attentes DB/réseau) et si le ThreadPool est épuisé par des appels synchrones bloquants — dans ce cas, convertir les appels I/O en async/await libérerait des threads sans ajouter de matériel",
        "Réécrire immédiatement toute la logique métier en Parallel.ForEach",
        "Passer directement à une architecture Kafka sans autre analyse",
      ],
      answer: "Vérifier si le service est I/O-bound (attentes DB/réseau) et si le ThreadPool est épuisé par des appels synchrones bloquants — dans ce cas, convertir les appels I/O en async/away libérerait des threads sans ajouter de matériel",
      explanation:
        "Un CPU à 20% avec des timeouts sous charge est le signe classique d'un épuisement du ThreadPool par des appels synchrones bloquants (I/O-bound mal géré), pas d'un manque de puissance CPU. Ajouter du CPU ou du parallélisme CPU-bound ne résoudrait rien ici — il faut d'abord convertir les appels bloquants en async/await.",
    },
    {
      question:
        "[Scénario] Une procédure EF6 charge 500 000 ordres avec tracking activé, les filtre en mémoire avec `.ToList().Where(...)`, puis effectue un calcul CPU intensif sur le résultat filtré avec un simple foreach. Le tout prend 40 secondes. Dans quel ordre corrigeriez-vous les problèmes pour un gain maximal ?",
      options: [
        "Directement paralléliser le foreach final avec Parallel.ForEach, sans toucher au reste",
        "D'abord déplacer le filtre AVANT le ToList() pour qu'il soit traduit en SQL (réduisant drastiquement les données rapatriées), puis désactiver le tracking avec AsNoTracking() pour la lecture, et enfin, si le calcul CPU restant est encore significatif, envisager Parallel.ForEach sur le résultat final réduit",
        "Ajouter immédiatement Kafka pour distribuer le traitement",
        "Remplacer EF6 par ADO.NET sans aucune autre analyse, c'est toujours la solution la plus rapide",
      ],
      answer: "D'abord déplacer le filtre AVANT le ToList() pour qu'il soit traduit en SQL (réduisant drastiquement les données rapatriées), puis désactiver le tracking avec AsNoTracking() pour la lecture, et enfin, si le calcul CPU restant est encore significatif, envisager Parallel.ForEach sur le résultat final réduit",
      explanation:
        "L'ordre compte : corriger d'abord le plus gros goulot (rapatrier 500 000 lignes puis filtrer en mémoire, alors qu'un WHERE SQL réduirait ce volume dès la source), puis le tracking inutile, et seulement ENSUITE envisager la parallélisation du calcul CPU restant sur un volume déjà réduit — paralléliser un problème mal dimensionné en amont est un gaspillage d'effort.",
    },
    {
      question:
        "[Scénario] Deux services doivent communiquer : le Service A calcule un risque de portefeuille (30 secondes de calcul) et le Service B doit être notifié du résultat pour mettre à jour un dashboard. L'équipe a initialement implémenté un appel REST synchrone de A vers B. Pourquoi est-ce probablement un mauvais choix architectural, et quelle alternative envisager ?",
      options: [
        "Le choix REST synchrone est parfait, aucun changement n'est nécessaire",
        "Un appel REST synchrone de 30 secondes bloque un thread du Service A pendant tout ce temps et couple fortement la disponibilité des deux services ; utiliser une queue (Kafka/MSMQ) permettrait à A de déposer le résultat de façon asynchrone dès qu'il est prêt, sans bloquer, et à B de le consommer indépendamment",
        "Il faut remplacer REST par du SOAP pour résoudre ce problème",
        "La seule solution est de rendre le calcul de 30 secondes instantané",
      ],
      answer: "Un appel REST synchrone de 30 secondes bloque un thread du Service A pendant tout ce temps et couple fortement la disponibilité des deux services ; utiliser une queue (Kafka/MSMQ) permettrait à A de déposer le résultat de façon asynchrone dès qu'il est prêt, sans bloquer, et à B de le consommer indépendamment",
      explanation:
        "Un traitement long (30 secondes) ne devrait jamais être exposé comme un appel REST synchrone bloquant — cela immobilise des ressources et couple la disponibilité des deux services. Le pattern classique est de découpler via messaging : A publie le résultat quand il est prêt, B le consomme à son rythme, sans dépendance temporelle directe entre les deux.",
    },
    {
      question:
        "[Scénario] Votre équipe envisage de migrer un système de traitement d'ordres MSMQ existant vers Kafka, en argumentant 'Kafka est plus moderne, donc meilleur'. Quelle question critique manque à cette analyse ?",
      options: [
        "Aucune, Kafka est toujours objectivement meilleur que MSMQ dans tous les contextes",
        "Le besoin réel : a-t-on besoin de rejouabilité des messages, de plusieurs consommateurs indépendants lisant le même flux, et d'un débit massif — ou le besoin est-il simplement une file de tâches point-à-point simple, pour laquelle MSMQ suffit largement sans la complexité opérationnelle supplémentaire de Kafka (cluster, partitions, ZooKeeper/KRaft) ?",
        "Uniquement le coût de licence de chaque technologie",
        "La couleur du logo de chaque technologie",
      ],
      answer: "Le besoin réel : a-t-on besoin de rejouabilité des messages, de plusieurs consommateurs indépendants lisant le même flux, et d'un débit massif — ou le besoin est-il simplement une file de tâches point-à-point simple, pour laquelle MSMQ suffit largement sans la complexité opérationnelle supplémentaire de Kafka (cluster, partitions, ZooKeeper/KRaft) ?",
      explanation:
        "Un choix technologique 'parce que c'est plus moderne' sans analyse du besoin réel est un piège d'architecture classique. Kafka apporte une complexité opérationnelle réelle (cluster à maintenir, partitions à dimensionner) qui n'est justifiée que si les besoins de streaming/rejeu/multi-consommateurs sont réels — sinon, MSMQ (ou une simple queue) reste plus simple et suffisant.",
    },
    {
      question:
        "[Scénario combiné] Un batch nocturne traite 2 millions de lignes : lecture depuis SQL Server via EF6, calcul CPU par ligne, puis écriture des résultats. Le batch dure 3 heures et doit tenir dans une fenêtre de 1 heure. Quelle combinaison de leviers, appliqués dans le bon ordre, offre le plus de chances d'atteindre l'objectif ?",
      options: [
        "Ajouter uniquement plus de RAM au serveur, sans autre changement",
        "1) Vérifier/optimiser la requête EF6 (AsNoTracking, projection, filtre traduit en SQL) pour réduire le volume et le temps de lecture ; 2) paralléliser le calcul CPU-bound par ligne avec Parallel.ForEach dimensionné sur Environment.ProcessorCount ; 3) grouper les écritures en batchs plutôt qu'une insertion ligne par ligne",
        "Réécrire tout le batch en Kafka streaming sans analyse préalable des goulots réels",
        "Remplacer immédiatement SQL Server par une autre base de données, sans mesurer où le temps est réellement passé",
      ],
      answer: "1) Vérifier/optimiser la requête EF6 (AsNoTracking, projection, filtre traduit en SQL) pour réduire le volume et le temps de lecture ; 2) paralléliser le calcul CPU-bound par ligne avec Parallel.ForEach dimensionné sur Environment.ProcessorCount ; 3) grouper les écritures en batchs plutôt qu'une insertion ligne par ligne",
      explanation:
        "C'est l'application concrète de l'arbre de décision senior : d'abord réduire/optimiser l'accès aux données (souvent le plus gros gain), puis paralléliser le CPU-bound réellement indépendant, puis optimiser l'écriture (batching plutôt qu'insertion unitaire) — dans cet ordre, chaque étape amplifie le gain de la précédente plutôt que de le diluer.",
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
        ? <h3 className="success">🚀 Excellent ! Optimisation performance .NET Framework maîtrisée.</h3>
        : <p className="fail">📚 Révisez l'ordre des leviers d'optimisation et la différence Kafka/MSMQ.</p>
      }
    </div>
  );
};

const PerformanceOptimizationFrameworkQCM = () => {
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
            Optimisation Performance — .NET Framework 🔹 {level === "basic"
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

export default PerformanceOptimizationFrameworkQCM;