// src/projects/BackendInterview/CollectionsConcurrencyQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Collections & Concurrence en C#",
    answer:
      "◆ **Définition** : deux familles d'outils qui déterminent la performance d'un code C# — les structures de données (collections) et les modèles d'exécution (threads/Task/async)\n◆ **Collections** : List, Dictionary, HashSet — le choix impacte directement la complexité algorithmique\n◆ **Threads** : exécution parallèle bas niveau, pour du calcul CPU-bound\n◆ **Task / async-await** : abstraction moderne au-dessus des threads, idéale pour l'I/O (réseau, disque, DB)\n◆ **Cas d'usage** : un OMS qui traite des milliers d'ordres par seconde doit combiner les deux familles pour rester performant",
  },
  {
    question: "List<T> vs Dictionary<K,V> vs HashSet<T>",
    answer:
      "◆ **Définition** : trois collections aux complexités très différentes selon l'opération\n◆ **List<T>** : accès par index O(1), Contains O(n)\n◆ **Dictionary<K,V>** : accès par clé O(1), idéal pour une association clé→valeur\n◆ **HashSet<T>** : Contains O(1), garantit l'unicité automatiquement\n◆ **Cas d'usage** : Dictionary pour indexer des ordres par ClOrdID, HashSet pour dédupliquer des symboles reçus en flux\n\n```csharp\nvar ordersById = new Dictionary<string, Order>();\nvar seenSymbols = new HashSet<string>();\n```",
  },
  {
    question: "Pièges classiques des collections",
    answer:
      "◆ **Définition** : erreurs fréquentes qui cassent la performance ou plantent en production\n◆ **Modifier pendant un foreach** : InvalidOperationException — parcourir à l'envers avec for pour supprimer\n◆ **List.Contains en boucle** : transforme un algorithme en O(n²), remplacer par HashSet\n◆ **ContainsKey + indexeur** : 2 accès au Dictionary, préférer TryGetValue (1 seul accès)\n◆ **Cas d'usage** : dédupliquer 100 000 IDs avec HashSet.Contains plutôt que List.Contains évite un ralentissement massif\n\n```csharp\nif (!dict.TryGetValue(key, out var value)) { ... }\n```",
  },
  {
    question: "Threads & multithreading — les bases",
    answer:
      "◆ **Définition** : un Thread est un fil d'exécution indépendant géré par l'OS ; le multithreading permet d'exécuter plusieurs tâches en parallèle sur plusieurs cœurs\n◆ **lock** : garantit qu'une seule section critique est exécutée à la fois (mutex logique)\n◆ **Coût** : créer un Thread manuellement est coûteux (allocation mémoire, changement de contexte)\n◆ **Cas d'usage** : calcul intensif (pricing, risk) réparti sur plusieurs cœurs CPU\n\n```csharp\nprivate readonly object _lock = new object();\nlock (_lock) { compteur++; }\n```",
  },
  {
    question: "Race conditions & Deadlocks",
    answer:
      "◆ **Définition** : deux bugs classiques du multithreading\n◆ **Race condition** : plusieurs threads modifient la même donnée sans synchronisation → résultat imprévisible\n◆ **Deadlock** : deux threads s'attendent mutuellement, bloqués indéfiniment (ex: lock A puis B, et B puis A dans l'autre thread)\n◆ **Cas d'usage** : un compteur de positions partagé entre threads sans lock donnera un total faux sous forte charge\n◆ **Prévention** : toujours verrouiller les ressources partagées dans le même ordre",
  },
  {
    question: "ThreadPool — le pool de threads sous-jacent",
    answer:
      "◆ **Définition** : un pool de threads réutilisables géré par le CLR, évite le coût de création/destruction répétée de threads\n◆ **Task.Run** : soumet du travail au ThreadPool plutôt que de créer un Thread manuel\n◆ **Cas d'usage** : exécuter un calcul CPU-bound sans bloquer le thread principal (UI ou requête HTTP)\n\n```csharp\nawait Task.Run(() => CalculerRisque(portefeuille));\n```\n⚠️ Le ThreadPool a une taille limitée — l'y bloquer avec du code I/O (attente réseau) l'épuise inutilement",
  },
  {
    question: "Task — WhenAll, WhenAny, ContinueWith",
    answer:
      "◆ **Définition** : Task représente une opération asynchrone dont on peut composer/orchestrer l'exécution\n◆ **Task.WhenAll** : attend que toutes les tasks soient terminées\n◆ **Task.WhenAny** : se déclenche dès qu'une seule task se termine\n◆ **ContinueWith** : enchaîne une action après la fin d'une task (moins utilisé depuis async/await)\n◆ **Cas d'usage** : interroger 3 brokers en parallèle et attendre les 3 réponses avant d'agréger le meilleur prix\n\n```csharp\nvar prices = await Task.WhenAll(GetPriceAsync(\"BrokerA\"), GetPriceAsync(\"BrokerB\"));\n```",
  },
  {
    question: "async/await — principes",
    answer:
      "◆ **Définition** : sucre syntaxique qui permet d'écrire du code asynchrone de façon linéaire, sans bloquer le thread appelant\n◆ **I/O-bound** (réseau, DB, fichier) : utiliser async/await, libère le thread pendant l'attente\n◆ **CPU-bound** (calcul intensif) : utiliser Task.Run pour paralléliser sur le ThreadPool\n◆ **Cas d'usage** : appeler une API REST ou une base de données sans geler le thread qui aurait pu traiter une autre requête\n\n```csharp\npublic async Task<OrderDto> GetOrderAsync(string id)\n{\n    var order = await _db.Orders.FindAsync(id);\n    return Map(order);\n}\n```",
  },
  {
    question: "Pièges classiques async/await",
    answer:
      "◆ **Définition** : erreurs fréquentes qui cassent la fiabilité ou provoquent des deadlocks\n◆ **async void** : à éviter sauf pour les event handlers — les exceptions ne peuvent pas être awaited/catchées normalement\n◆ **.Result / .Wait()** : bloque le thread appelant et peut provoquer un deadlock (contexte de synchronisation ASP.NET/UI)\n◆ **ConfigureAwait(false)** : évite de capturer le contexte de synchronisation, utile dans les librairies\n◆ **Cas d'usage** : dans un contrôleur ASP.NET, toujours `await`, jamais `.Result`, pour ne pas geler la requête\n\n```csharp\n// ❌ risque de deadlock\nvar order = GetOrderAsync(id).Result;\n// ✅\nvar order = await GetOrderAsync(id);\n```",
  },
  {
    question: "Monothread vs Multithread — et comment transformer l'un en l'autre",
    answer:
      "◆ **Définition** : un programme monothread exécute ses instructions en séquence sur un seul fil d'exécution ; un programme multithread répartit le travail sur plusieurs fils exécutés en parallèle\n◆ **Étape 1 pour transformer** : identifier les portions de travail INDÉPENDANTES entre elles (pas de dépendance de données, pas d'ordre imposé)\n◆ **Étape 2** : découper le travail en unités (Parallel.For/ForEach, Task.Run par lot) plutôt qu'en threads manuels\n◆ **Étape 3** : éliminer ou protéger l'état partagé (variables mutables communes) — sinon race conditions garanties\n◆ **Piège** : paralléliser du code avec des dépendances séquentielles (ex: calcul cumulatif où chaque étape dépend de la précédente) ne fonctionne pas sans restructuration\n\n```csharp\n// Monothread\nforeach (var item in items) Traiter(item);\n// Multithread — items indépendants entre eux\nParallel.ForEach(items, item => Traiter(item));\n```",
  },
  {
    question: "Lien entre threads et cœurs du processeur",
    answer:
      "◆ **Définition** : un cœur CPU physique exécute réellement UN fil d'instruction à la fois (deux avec l'hyper-threading, qui simule 2 threads logiques par cœur)\n◆ **Environment.ProcessorCount** : nombre de cœurs logiques disponibles, souvent utilisé pour dimensionner le degré de parallélisme\n◆ **Plus de threads que de cœurs** : au-delà du nombre de cœurs disponibles, les threads supplémentaires se partagent le temps CPU par changement de contexte (context switching), coûteux et sans gain réel pour du CPU-bound\n◆ **Loi d'Amdahl** : le gain de parallélisation est limité par la portion de code qui reste forcément séquentielle — paralléliser à l'infini n'accélère pas indéfiniment\n◆ **Cas d'usage** : Parallel.ForEach utilise par défaut environ Environment.ProcessorCount threads, pas plus, pour éviter le sur-threading\n\n```csharp\nvar options = new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount };\nParallel.ForEach(items, options, item => Traiter(item));\n```",
  },
  {
    question: "Outils de performance pure en C#",
    answer:
      "◆ **Définition** : au-delà de async/Task, des outils bas niveau existent pour exploiter le CPU au maximum\n◆ **Parallel.For / Parallel.ForEach** : distribue du travail CPU-bound indépendant sur plusieurs cœurs automatiquement\n◆ **PLINQ (.AsParallel())** : version parallèle de LINQ, utile pour des pipelines de traitement de données volumineux\n◆ **Span<T> / Memory<T>** : manipulation de données sans allocation supplémentaire (évite la pression GC)\n◆ **System.Numerics.Vector / SIMD** : exécute une même opération sur plusieurs valeurs simultanément au niveau du CPU (calcul vectoriel)\n◆ **ArrayPool<T>** : réutilise des tableaux plutôt que d'en allouer de nouveaux à chaque fois\n◆ **Cas d'usage** : PLINQ pour agréger des millions de ticks de marché, Span<T> pour parser un message FIX sans allouer de sous-chaînes",
  },
  {
    question: "Combos performance — écrire du code C# rapide",
    answer:
      "◆ **Définition** : la vitesse d'exécution vient de la combinaison structure de données + modèle d'exécution adaptés au problème\n◆ **Règle 1** : bonne structure d'abord (HashSet pour Contains, Dictionary pour lookup) — souvent plus impactant que la parallélisation\n◆ **Règle 2** : I/O-bound → async/await ; CPU-bound → Parallel.For / Task.Run\n◆ **Règle 3** : éviter les allocations inutiles dans les boucles chaudes (pas de LINQ dans un hot path critique)\n◆ **Cas d'usage** : transformer une double boucle O(n²) de comparaison en O(n) avec un HashSet, puis paralléliser le traitement CPU-bound restant avec Parallel.ForEach\n\n```csharp\nvar setB = new HashSet<int>(listeB); // O(n)\nParallel.ForEach(listeA, a => { if (setB.Contains(a)) ... }); // O(n) + parallèle\n```",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: COLLECTIONS ====================
    {
      question: "[Collections] Quelle structure choisir pour retrouver un ordre par son identifiant en O(1) ?",
      options: ["List<Order>", "HashSet<Order>", "Array<Order>", "Dictionary<string, Order>"],
      answer: "Dictionary<string, Order>",
      explanation:
        "Dictionary<K,V> offre un accès O(1) par clé. Pour retrouver un ordre par son ID rapidement, c'est la structure adaptée, contrairement à List ou Array qui nécessiteraient un parcours O(n).",
    },
    {
      question: "[Collections] Pourquoi HashSet<T> est-il préférable à List<T> pour tester l'appartenance d'un élément (Contains) ?",
      options: [
        "HashSet ne peut contenir que des types numériques",
        "List.Contains() est toujours plus rapide que HashSet.Contains()",
        "Il n'y a aucune différence de performance",
        "HashSet.Contains() est O(1) en moyenne alors que List.Contains() est O(n)",
      ],
      answer: "HashSet.Contains() est O(1) en moyenne alors que List.Contains() est O(n)",
      explanation:
        "HashSet utilise une table de hachage, rendant Contains quasi instantané en moyenne. List doit parcourir ses éléments un par un, donc Contains coûte O(n).",
    },
    {
      question: "[Collections] Quelle est la complexité de List<T>.Add() en fin de liste, dans le cas général ?",
      options: [
        "O(n²), car la liste est réallouée à chaque ajout",
        "O(log n), via une structure d'arbre équilibré",
        "O(n), car chaque élément est recopié",
        "O(1) amorti, car la capacité interne est redimensionnée rarement",
      ],
      answer: "O(1) amorti, car la capacité interne est redimensionnée rarement",
      explanation:
        "List<T> maintient une capacité interne plus grande que sa taille actuelle. L'ajout est O(1) la plupart du temps ; la réallocation (O(n)) ne survient qu'occasionnellement, d'où le terme 'amorti'.",
    },
    {
      question: "[Collections] Que se passe-t-il si on supprime un élément d'une List<T> pendant un foreach dessus ?",
      options: [
        "L'élément suivant est automatiquement ignoré sans erreur",
        "Rien, foreach gère nativement les suppressions",
        "Une InvalidOperationException est levée, car la collection a été modifiée pendant son énumération",
        "Seuls les éléments pairs sont affectés",
      ],
      answer: "Une InvalidOperationException est levée, car la collection a été modifiée pendant son énumération",
      explanation:
        "foreach utilise un énumérateur qui détecte toute modification de la collection sous-jacente pendant le parcours et lève une exception. Pour supprimer en itérant, il faut utiliser une boucle for à l'envers.",
    },

    // ==================== SECTION B: THREADS ====================
    {
      question: "[Threads] À quoi sert le mot-clé `lock` en C# ?",
      options: [
        "À garantir qu'une seule section de code (critique) est exécutée par un seul thread à la fois",
        "À accélérer l'exécution d'une boucle",
        "À empêcher la garbage collection d'un objet",
        "À convertir du code synchrone en code asynchrone",
      ],
      answer: "À garantir qu'une seule section de code (critique) est exécutée par un seul thread à la fois",
      explanation:
        "lock (sucre syntaxique pour Monitor.Enter/Exit) protège une section critique : un seul thread peut y entrer à la fois, évitant les race conditions sur une ressource partagée.",
    },
    {
      question: "[Threads] Qu'est-ce qu'une race condition ?",
      options: [
        "Une erreur de compilation liée aux threads",
        "Une situation où plusieurs threads accèdent et modifient une donnée partagée sans synchronisation, produisant un résultat imprévisible",
        "Un thread qui s'exécute plus vite que prévu",
        "Un deadlock entre deux processus",
      ],
      answer: "Une situation où plusieurs threads accèdent et modifient une donnée partagée sans synchronisation, produisant un résultat imprévisible",
      explanation:
        "Une race condition survient quand le résultat d'un programme dépend de l'ordre d'exécution non garanti de threads concurrents accédant à une même ressource, souvent sans lock.",
    },
    {
      question: "[Threads] Quelle est la cause typique d'un deadlock ?",
      options: [
        "L'utilisation excessive de foreach",
        "Un thread qui ne fait aucun appel réseau",
        "Deux threads qui acquièrent les mêmes locks dans un ordre inversé, s'attendant mutuellement indéfiniment",
        "L'absence totale de threads dans l'application",
      ],
      answer: "Deux threads qui acquièrent les mêmes locks dans un ordre inversé, s'attendant mutuellement indéfiniment",
      explanation:
        "Un deadlock classique se produit quand le thread 1 tient le lock A et attend le lock B, tandis que le thread 2 tient le lock B et attend le lock A. Aucun ne peut avancer.",
    },
    {
      question: "[Threads] Pourquoi préfère-t-on généralement le ThreadPool (via Task.Run) à la création manuelle de Thread ?",
      options: [
        "Un Thread manuel s'exécute toujours plus vite",
        "Le ThreadPool réutilise des threads existants, évitant le coût de création/destruction répétée",
        "Le ThreadPool ne peut exécuter qu'un seul thread à la fois",
        "Il n'y a aucune différence pratique entre les deux",
      ],
      answer: "Le ThreadPool réutilise des threads existants, évitant le coût de création/destruction répétée",
      explanation:
        "Créer un Thread manuellement a un coût non négligeable (allocation, changement de contexte). Le ThreadPool maintient un pool de threads réutilisables, ce qui est bien plus efficace pour de nombreuses tâches courtes.",
    },
    {
      question: "[Mono/Multithread] Quelle est la première étape pour transformer un foreach séquentiel en traitement parallèle ?",
      options: [
        "Ajouter directement Parallel.ForEach sans analyse préalable, cela fonctionne toujours",
        "Vérifier que les itérations sont indépendantes entre elles (pas de dépendance de données ni d'ordre imposé) avant de paralléliser",
        "Remplacer foreach par un for classique, qui est automatiquement parallèle",
        "Ajouter le mot-clé async devant la boucle",
      ],
      answer: "Vérifier que les itérations sont indépendantes entre elles (pas de dépendance de données ni d'ordre imposé) avant de paralléliser",
      explanation:
        "Paralléliser sans vérifier l'indépendance des itérations est une source classique de bugs (race conditions, résultats incorrects). Si une itération dépend du résultat de la précédente, la paralléliser directement casse la logique.",
    },
    {
      question: "[Cœurs CPU] Que se passe-t-il si on crée volontairement 50 threads CPU-bound sur une machine avec seulement 8 cœurs logiques ?",
      options: [
        "Les 50 threads s'exécutent réellement en parallèle simultané, la performance est 50 fois meilleure",
        "Seuls 8 threads peuvent s'exécuter physiquement en même temps ; les autres attendent leur tour via des changements de contexte, ce qui n'apporte aucun gain réel et ajoute même de l'overhead",
        "Le programme plante automatiquement au-delà de 8 threads",
        "Windows bloque la création du 9ème thread",
      ],
      answer: "Seuls 8 threads peuvent s'exécuter physiquement en même temps ; les autres attendent leur tour via des changements de contexte, ce qui n'apporte aucun gain réel et ajoute même de l'overhead",
      explanation:
        "Un cœur logique exécute un seul fil à la fois. Au-delà du nombre de cœurs disponibles, les threads supplémentaires se partagent le CPU par changement de contexte (context switching), ce qui coûte des ressources sans accélérer un travail CPU-bound.",
    },
    {
      question: "[Mono/Multithread] Pourquoi dit-on que 'plus de threads = toujours plus rapide' est une idée fausse ?",
      options: [
        "C'est vrai, plus de threads est toujours strictement meilleur, sans exception",
        "Au-delà du nombre de cœurs disponibles, les threads supplémentaires n'accélèrent pas le calcul CPU-bound et ajoutent du coût de changement de contexte ; de plus, la loi d'Amdahl limite le gain à la portion réellement parallélisable du code",
        "Les threads ralentissent toujours un programme, quel que soit leur nombre",
        "Cette affirmation est correcte uniquement pour les opérations I/O-bound",
      ],
      answer: "Au-delà du nombre de cœurs disponibles, les threads supplémentaires n'accélèrent pas le calcul CPU-bound et ajoutent du coût de changement de contexte ; de plus, la loi d'Amdahl limite le gain à la portion réellement parallélisable du code",
      explanation:
        "Deux limites combinées : le nombre de cœurs physiques plafonne le parallélisme réel, et la loi d'Amdahl rappelle que la portion de code intrinsèquement séquentielle borne le gain total, même avec un nombre de threads illimité.",
    },

    // ==================== SECTION C: TASK ====================
    {
      question: "[Task] À quoi sert principalement Task.Run() ?",
      options: [
        "À exécuter du code de façon synchrone et bloquante",
        "À supprimer une Task en cours",
        "À soumettre un travail CPU-bound au ThreadPool sans bloquer le thread appelant",
        "À créer une connexion réseau"
      ],
      answer: "À soumettre un travail CPU-bound au ThreadPool sans bloquer le thread appelant",
      explanation:
        "Task.Run() délègue l'exécution d'une fonction au ThreadPool, idéal pour du calcul intensif (CPU-bound) qu'on ne veut pas exécuter sur le thread principal.",
    },
    {
      question: "[Task] Quelle est la différence entre Task.WhenAll et Task.WhenAny ?",
      options: [
        "WhenAll attend que toutes les tasks se terminent, WhenAny se déclenche dès qu'une seule est terminée",
        "WhenAll et WhenAny sont strictement identiques",
        "WhenAny attend toutes les tasks, WhenAll s'arrête à la première",
        "WhenAll ne peut prendre qu'une seule task en paramètre",
      ],
      answer: "WhenAll attend que toutes les tasks se terminent, WhenAny se déclenche dès qu'une seule est terminée",
      explanation:
        "Task.WhenAll(tasks) retourne une Task qui se complète quand toutes les tasks passées sont terminées. Task.WhenAny(tasks) se complète dès que la première d'entre elles se termine.",
    },
    {
      question: "[Task] Comment sont typiquement propagées les exceptions levées dans une Task, lorsqu'on utilise await ?",
      options: [
        "Elles sont silencieusement ignorées",
        "Elles ne peuvent jamais être catchées",
        "L'exception d'origine est directement relancée (unwrapped) au point d'await, capturable via try/catch classique",
        "Elles font planter le processus immédiatement sans possibilité de gestion",
      ],
      answer: "L'exception d'origine est directement relancée (unwrapped) au point d'await, capturable via try/catch classique",
      explanation:
        "Contrairement à .Wait()/.Result qui enveloppent l'exception dans une AggregateException, await 'déballe' l'exception d'origine, ce qui permet de la catcher normalement avec un try/catch.",
    },

    // ==================== SECTION D: ASYNC/AWAIT ====================
    {
      question: "[async/await] Pourquoi utilise-t-on async/await pour des opérations I/O-bound (réseau, base de données) ?",
      options: [
        "Parce que cela accélère le calcul CPU",
        "Parce que cela libère le thread pendant l'attente, permettant de traiter d'autres requêtes en parallèle",
        "Parce que async/await est requis pour compiler du C#",
        "Parce que cela empêche toute exception de se produire",
      ],
      answer: "Parce que cela libère le thread pendant l'attente, permettant de traiter d'autres requêtes en parallèle",
      explanation:
        "Pendant une opération I/O-bound (attente réseau, disque, DB), le thread n'a rien à faire. async/await libère ce thread pour qu'il traite autre chose, au lieu de rester bloqué à attendre.",
    },
    {
      question: "[async/await] Pourquoi une méthode `async void` est-elle généralement déconseillée (sauf pour les event handlers) ?",
      options: [
        "Parce que async void s'exécute deux fois plus lentement",
        "Parce qu'elle ne peut pas être compilée en C#",
        "Parce que les exceptions levées dans une méthode async void ne peuvent pas être capturées normalement par l'appelant",
        "Parce qu'elle empêche l'utilisation de HttpClient",
      ],
      answer: "Parce que les exceptions levées dans une méthode async void ne peuvent pas être capturées normalement par l'appelant",
      explanation:
        "Une méthode async void ne retourne pas de Task, donc l'appelant ne peut pas await ni catcher ses exceptions via un try/catch classique. Elles remontent directement au SynchronizationContext, souvent en faisant planter l'application.",
    },
    {
      question: "[async/await] Pourquoi appeler `.Result` ou `.Wait()` sur une Task peut-il provoquer un deadlock dans une application ASP.NET classique ?",
      options: [
        "Parce que .Result et .Wait() bloquent le thread appelant, qui peut être le même thread nécessaire pour reprendre l'exécution après l'await interne",
        "Parce que .Result ne fonctionne que dans les applications console",
        "Parce que .Wait() supprime automatiquement la Task",
        "Ce risque n'existe pas en C#",
      ],
      answer: "Parce que .Result et .Wait() bloquent le thread appelant, qui peut être le même thread nécessaire pour reprendre l'exécution après l'await interne",
      explanation:
        "Dans un contexte avec SynchronizationContext (ASP.NET classique, UI), bloquer avec .Result peut empêcher le thread de revenir exécuter la suite de la Task après son await interne, créant un deadlock classique.",
    },
  ],

  avance: [
    // ==================== SECTION E: COLLECTIONS AVANCE ====================
    {
      question: "[Collections] Pourquoi TryGetValue est-il préférable à ContainsKey suivi de l'indexeur ?",
      options: [
        "TryGetValue ne fonctionne que sur les List<T>",
        "ContainsKey + indexeur effectuent 2 accès au Dictionary, TryGetValue n'en effectue qu'un seul",
        "ContainsKey est déprécié en C#",
        "Il n'y a aucune différence de performance mesurable",
      ],
      answer: "ContainsKey + indexeur effectuent 2 accès au Dictionary, TryGetValue n'en effectue qu'un seul",
      explanation:
        "ContainsKey(key) puis dict[key] effectuent deux recherches dans la table de hachage. TryGetValue combine la vérification et la récupération en un seul accès, plus performant.",
    },
    {
      question: "[Collections] Que signifie 'O(1) en moyenne' pour HashSet<T>.Contains(), et pourquoi ce n'est pas garanti dans le pire cas ?",
      options: [
        "HashSet.Contains est toujours O(n), 'en moyenne' est trompeur",
        "En cas de collisions de hachage nombreuses, la complexité peut se dégrader vers O(n) dans le pire cas théorique",
        "O(1) en moyenne signifie que la structure est réinitialisée à chaque appel",
        "Cela ne concerne que les HashSet contenant des types de référence",
      ],
      answer: "En cas de collisions de hachage nombreuses, la complexité peut se dégrader vers O(n) dans le pire cas théorique",
      explanation:
        "HashSet repose sur une fonction de hachage. Avec une bonne fonction de hachage et une distribution uniforme, Contains est O(1) en moyenne. En cas de mauvaises fonctions de hachage ou d'attaques ciblées, les collisions peuvent dégrader la performance vers O(n).",
    },
    {
      question: "[Collections] Dans quel contexte une LinkedList<T> peut-elle être préférable à une List<T> ?",
      options: [
        "Quand on a besoin d'un accès O(1) par index",
        "Quand on fait beaucoup d'insertions/suppressions au milieu de la collection, sans besoin d'accès par index",
        "LinkedList<T> est toujours strictement supérieure à List<T>",
        "Quand on veut garantir l'unicité des éléments",
      ],
      answer: "Quand on fait beaucoup d'insertions/suppressions au milieu de la collection, sans besoin d'accès par index",
      explanation:
        "LinkedList<T> permet une insertion/suppression O(1) à un endroit donné (via un nœud), sans décalage des éléments, contrairement à List<T> où insérer au milieu coûte O(n). En contrepartie, elle perd l'accès O(1) par index.",
    },

    // ==================== SECTION F: THREADS AVANCE ====================
    {
      question: "[Threads] Que représente réellement le mot-clé `lock` en C# au niveau du compilateur ?",
      options: [
        "Un appel direct au système d'exploitation, sans lien avec .NET",
        "Du sucre syntaxique équivalent à Monitor.Enter(obj) / Monitor.Exit(obj) dans un try/finally",
        "Une instruction qui n'a aucun effet réel en release",
        "Un remplacement de async/await",
      ],
      answer: "Du sucre syntaxique équivalent à Monitor.Enter(obj) / Monitor.Exit(obj) dans un try/finally",
      explanation:
        "Le mot-clé lock est compilé en un appel à Monitor.Enter, encapsulé dans un try/finally garantissant Monitor.Exit même en cas d'exception, ce qui évite un verrou qui resterait bloqué.",
    },
    {
      question: "[Threads] À quoi sert le mot-clé `volatile` en C# ?",
      options: [
        "À accélérer la compilation",
        "À empêcher toute optimisation du compilateur ou du CPU qui mettrait en cache une valeur localement, garantissant sa visibilité entre threads",
        "À convertir un champ en propriété automatiquement",
        "À rendre un objet thread-safe complètement",
      ],
      answer: "À empêcher toute optimisation du compilateur ou du CPU qui mettrait en cache une valeur localement, garantissant sa visibilité entre threads",
      explanation:
        "volatile indique que le champ peut être modifié par plusieurs threads simultanément et empêche certaines optimisations (réordonnancement, mise en cache dans un registre) qui rendraient les changements invisibles à d'autres threads.",
    },
    {
      question: "[Threads] Pourquoi utiliser la classe Interlocked plutôt qu'un lock pour incrémenter un simple compteur partagé ?",
      options: [
        "Interlocked est plus lisible mais toujours plus lent",
        "Interlocked fournit des opérations atomiques bas niveau (ex: Interlocked.Increment), plus légères qu'un lock complet pour des opérations simples",
        "Interlocked remplace complètement le multithreading",
        "Il n'y a aucun avantage, lock est toujours préférable",
      ],
      answer: "Interlocked fournit des opérations atomiques bas niveau (ex: Interlocked.Increment), plus légères qu'un lock complet pour des opérations simples",
      explanation:
        "Interlocked.Increment/Decrement/Exchange utilisent des instructions CPU atomiques dédiées, évitant le coût d'acquisition/libération d'un lock complet pour des opérations aussi simples qu'incrémenter un compteur.",
    },
    {
      question: "[Mono/Multithread] Pourquoi un algorithme avec une forte dépendance séquentielle (ex: chaque étape dépend du résultat cumulé de la précédente) résiste-t-il mal à une transformation naïve en multithread ?",
      options: [
        "Ce n'est pas vrai, tout algorithme peut être parallélisé sans restructuration",
        "La dépendance de données impose un ordre d'exécution strict entre les étapes, ce qui empêche de les exécuter simultanément sans risquer un résultat incorrect — il faut souvent restructurer l'algorithme (ex: découpage en étapes indépendantes, réduction en arbre) pour en tirer parti",
        "Il suffit d'ajouter lock autour de chaque étape pour paralléliser sans risque",
        "Ce type d'algorithme ne peut être exécuté que sur un seul cœur, quelle que soit l'approche",
      ],
      answer: "La dépendance de données impose un ordre d'exécution strict entre les étapes, ce qui empêche de les exécuter simultanément sans risquer un résultat incorrect — il faut souvent restructurer l'algorithme (ex: découpage en étapes indépendantes, réduction en arbre) pour en tirer parti",
      explanation:
        "Un simple lock ne suffit pas : il forcerait à nouveau une exécution séquentielle, annulant tout gain de parallélisme. La vraie solution est de repenser l'algorithme (ex: transformer une somme cumulative séquentielle en une réduction en arbre parallélisable par blocs).",
    },
    {
      question: "[Outils performance] Quelle est la différence entre Parallel.ForEach et PLINQ (.AsParallel()) ?",
      options: [
        "Elles sont strictement interchangeables dans tous les cas d'usage",
        "Parallel.ForEach est orienté action impérative sur chaque élément (side effects), tandis que PLINQ s'intègre dans un pipeline LINQ déclaratif (Where, Select...) et gère automatiquement l'agrégation/le fusionnement des résultats parallèles",
        "PLINQ ne peut être utilisé que sur des tableaux, jamais sur des List<T>",
        "Parallel.ForEach ne fonctionne que sur des types numériques",
      ],
      answer: "Parallel.ForEach est orienté action impérative sur chaque élément (side effects), tandis que PLINQ s'intègre dans un pipeline LINQ déclaratif (Where, Select...) et gère automatiquement l'agrégation/le fusionnement des résultats parallèles",
      explanation:
        "Parallel.ForEach convient bien à une action à effectuer sur chaque élément (ex: écrire dans une base). PLINQ convient mieux à une transformation/agrégation de données façon LINQ (filtrer, projeter, sommer), en parallélisant tout le pipeline.",
    },
    {
      question: "[Outils performance] Pourquoi Span<T> peut-il améliorer significativement la performance d'un parsing intensif (ex: parser des messages FIX en boucle) ?",
      options: [
        "Span<T> permet de travailler sur une portion de mémoire existante sans allouer de nouvelles sous-chaînes/sous-tableaux, réduisant la pression sur le Garbage Collector",
        "Span<T> exécute automatiquement le code sur plusieurs threads",
        "Span<T> remplace complètement le besoin de tests unitaires",
        "Span<T> ne fonctionne qu'avec les types de référence comme string",
      ],
      answer: "Span<T> permet de travailler sur une portion de mémoire existante sans allouer de nouvelles sous-chaînes/sous-tableaux, réduisant la pression sur le Garbage Collector",
      explanation:
        "Un parsing classique (ex: string.Split ou Substring) alloue de nouvelles chaînes à chaque découpe. Span<T> permet de référencer des portions de la mémoire existante sans copie ni allocation, ce qui réduit fortement la pression GC dans un hot path de parsing intensif.",
    },

    // ==================== SECTION G: TASK AVANCE ====================
    {
      question: "[Task] À quoi sert ConfigureAwait(false) et dans quel contexte l'utilise-t-on typiquement ?",
      options: [
        "Il annule la Task immédiatement",
        "Il force l'exécution synchrone de la Task",
        "Il évite de capturer le contexte de synchronisation d'origine, utile dans le code de librairie pour améliorer la performance et éviter certains deadlocks",
        "Il n'a aucun effet en .NET moderne",
      ],
      answer: "Il évite de capturer le contexte de synchronisation d'origine, utile dans le code de librairie pour améliorer la performance et éviter certains deadlocks",
      explanation:
        "ConfigureAwait(false) indique que la suite du code après l'await n'a pas besoin de reprendre sur le SynchronizationContext d'origine (thread UI, contexte ASP.NET classique), ce qui réduit les changements de contexte inutiles et certains risques de deadlock.",
    },
    {
      question: "[Task] Quelle est la relation entre Task et Thread ?",
      options: [
        "Task et Thread sont des synonymes stricts",
        "Task est une abstraction de plus haut niveau représentant une opération asynchrone, qui s'exécute généralement sur un thread du ThreadPool, sans y être forcément lié en permanence",
        "Une Task crée toujours un nouveau Thread dédié",
        "Thread est une sous-classe de Task en .NET",
      ],
      answer: "Task est une abstraction de plus haut niveau représentant une opération asynchrone, qui s'exécute généralement sur un thread du ThreadPool, sans y être forcément lié en permanence",
      explanation:
        "Une Task ne correspond pas à un Thread dédié. Le CLR peut suspendre/reprendre son exécution sur différents threads du ThreadPool au fil du temps, notamment autour des points d'await.",
    },
    {
      question: "[Task] Quelle est la différence essentielle entre Task.Delay(1000) et Thread.Sleep(1000) ?",
      options: [
        "Task.Delay bloque le thread, Thread.Sleep ne bloque rien",
        "Task.Delay ne libère pas le thread pendant l'attente, contrairement à Thread.Sleep",
        "Task.Delay est non-bloquant (le thread est libéré pendant l'attente), alors que Thread.Sleep bloque le thread appelant pendant toute la durée",
        "Les deux sont strictement identiques en performance",
      ],
      answer: "Task.Delay est non-bloquant (le thread est libéré pendant l'attente), alors que Thread.Sleep bloque le thread appelant pendant toute la durée",
      explanation:
        "await Task.Delay(1000) libère le thread pendant l'attente (il peut traiter autre chose), alors que Thread.Sleep(1000) bloque complètement le thread appelant, qui reste inutilisé pendant toute la durée.",
    },

    // ==================== SECTION H: ASYNC/AWAIT AVANCE ====================
    {
      question: "[async/await] Pourquoi dit-on qu'on doit choisir entre async/await et Task.Run selon que le travail est I/O-bound ou CPU-bound ?",
      options: [
        "Parce que async/await est réservé aux applications web uniquement",
        "Parce que Task.Run(calcul) offloade un vrai travail CPU sur le ThreadPool, tandis qu'await sur une opération I/O ne consomme pas de thread pendant l'attente elle-même",
        "Parce que les deux approches sont interchangeables sans aucune conséquence",
        "Parce que Task.Run ne fonctionne que pour les appels réseau",
      ],
      answer: "Parce que Task.Run(calcul) offloade un vrai travail CPU sur le ThreadPool, tandis qu'await sur une opération I/O ne consomme pas de thread pendant l'attente elle-même",
      explanation:
        "Pour du CPU-bound, Task.Run utilise réellement un thread du pool pendant le calcul. Pour de l'I/O-bound (réseau, disque), l'opération asynchrone sous-jacente ne mobilise généralement pas de thread pendant l'attente — le mélange des deux approches est une source classique d'inefficacité.",
    },
    {
      question: "[async/await] Que génère concrètement le compilateur C# à partir d'une méthode marquée async ?",
      options: [
        "Rien de spécial, async est purement documentaire",
        "Une machine à états (state machine) qui gère la suspension et la reprise de l'exécution autour des points d'await",
        "Un nouveau Thread dédié à chaque appel",
        "Une copie synchrone de la méthode, exécutée en parallèle"
      ],
      answer: "Une machine à états (state machine) qui gère la suspension et la reprise de l'exécution autour des points d'await",
      explanation:
        "Le compilateur transforme une méthode async en une machine à états qui capture le contexte d'exécution à chaque await, permet de suspendre le travail, et de le reprendre plus tard sans bloquer de thread pendant l'attente.",
    },
    {
      question: "[async/await] Si une exception est levée dans une méthode async profondément imbriquée dans une chaîne d'appels avec await, comment se comporte-t-elle ?",
      options: [
        "Elle est automatiquement journalisée puis ignorée",
        "Elle bloque définitivement l'application sans remonter",
        "Elle se propage naturellement à travers chaque niveau d'await, comme une exception synchrone classique, jusqu'à être catchée ou remonter à l'appelant final",
        "Elle est convertie en valeur de retour null",
      ],
      answer: "Elle se propage naturellement à travers chaque niveau d'await, comme une exception synchrone classique, jusqu'à être catchée ou remonter à l'appelant final",
      explanation:
        "Grâce à await, les exceptions se propagent de façon similaire au code synchrone : chaque niveau peut la catcher avec un try/catch classique, ou la laisser remonter à l'appelant suivant, sans avoir besoin de gérer une AggregateException.",
    },
  ],

  expert: [
    // ==================== SECTION I: BUGS A REPERER ====================
    {
      question:
        "[Bug à repérer] Quel est le problème de performance dans ce code qui traite un flux d'ordres réseau ?\n\n```csharp\npublic async Task ProcessOrderAsync(Order order)\n{\n    var result = await Task.Run(() => _httpClient.PostAsJsonAsync(\"orders\", order));\n}\n```",
      options: [
        "Task.Run est obligatoire pour tout appel HttpClient",
        "Il manque un await devant PostAsJsonAsync",
        "PostAsJsonAsync est I/O-bound : l'envelopper dans Task.Run gaspille inutilement un thread du ThreadPool pendant l'attente réseau",
        "Ce code est parfaitement optimal",
      ],
      answer: "PostAsJsonAsync est I/O-bound : l'envelopper dans Task.Run gaspille inutilement un thread du ThreadPool pendant l'attente réseau",
      explanation:
        "PostAsJsonAsync est déjà asynchrone et I/O-bound. L'entourer de Task.Run mobilise un thread du ThreadPool pour rien pendant l'attente réseau — il suffit d'awaiter directement l'appel HTTP.",
    },
    {
      question:
        "[Bug à repérer] Que risque ce code exécuté dans un event handler WinForms/WPF ?\n\n```csharp\nprivate async void Button_Click(object sender, EventArgs e)\n{\n    var data = await FetchRiskyDataAsync();\n    if (data == null) throw new InvalidOperationException(\"Data manquante\");\n}\n```",
      options: [
        "Rien, ce code est sûr car async void est le seul modificateur autorisé pour les event handlers",
        "Le bouton devient inutilisable après le premier clic",
        "L'exception FetchRiskyDataAsync ne pourra jamais être levée",
        "Si l'exception est levée, elle ne peut pas être catchée par un try/catch appelant classique — elle remontera directement au SynchronizationContext et fera potentiellement planter l'application",
      ],
      answer: "Si l'exception est levée, elle ne peut pas être catchée par un try/catch appelant classique — elle remontera directement au SynchronizationContext et fera potentiellement planter l'application",
      explanation:
        "async void est acceptable pour un event handler, mais toute exception non catchée À L'INTÉRIEUR de la méthode remonte au SynchronizationContext plutôt qu'à un appelant, souvent avec un crash. Il faut envelopper le corps dans un try/catch interne.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème de cette recherche de doublons sur deux grandes listes ?\n\n```csharp\nvar doublons = new List<int>();\nforeach (int a in listeA)\n    foreach (int b in listeB)\n        if (a == b) doublons.Add(a);\n```",
      options: [
        "Le code est déjà optimal, aucune amélioration possible",
        "Complexité O(n×m) : pour de grandes listes, convertir listeB en HashSet<int> ramène le tout à O(n+m)",
        "Il faut absolument paralléliser avec Task.Run pour corriger le problème",
        "List<int> ne peut pas contenir de doublons",
      ],
      answer: "Complexité O(n×m) : pour de grandes listes, convertir listeB en HashSet<int> ramène le tout à O(n+m)",
      explanation:
        "La bonne structure de données résout le problème avant même de penser à la parallélisation : `var setB = new HashSet<int>(listeB); foreach (int a in listeA) if (setB.Contains(a)) doublons.Add(a);` ramène la complexité de O(n×m) à O(n+m).",
    },

    // ==================== SECTION J-BIS: MONO/MULTITHREAD & OUTILS PERFORMANCE ====================
    {
      question:
        "[Scénario] Une machine possède 4 cœurs physiques avec hyper-threading (8 cœurs logiques). Vous lancez Parallel.ForEach sur un calcul CPU-bound massivement parallélisable avec MaxDegreeOfParallelism = 32. Que risque-t-il de se passer par rapport à une valeur de 8 ?",
      options: [
        "Le calcul sera exactement 4 fois plus rapide grâce aux 32 threads",
        "Au-delà du nombre de cœurs logiques disponibles (8), les threads supplémentaires se partagent le même CPU par changement de contexte, ce qui n'accélère pas le calcul CPU-bound et peut même le ralentir légèrement à cause de l'overhead de scheduling",
        "Le programme lève automatiquement une exception au-delà de 8 threads",
        "Cela n'a aucun impact car .NET ignore silencieusement les threads en trop",
      ],
      answer: "Au-delà du nombre de cœurs logiques disponibles (8), les threads supplémentaires se partagent le même CPU par changement de contexte, ce qui n'accélère pas le calcul CPU-bound et peut même le ralentir légèrement à cause de l'overhead de scheduling",
      explanation:
        "Pour du CPU-bound pur, le parallélisme réel est plafonné par le nombre de cœurs logiques (ici 8 avec hyper-threading). Fixer MaxDegreeOfParallelism à 32 ne fait qu'ajouter du changement de contexte inutile sans accélérer le calcul — souvent laisser la valeur par défaut (liée à Environment.ProcessorCount) est préférable.",
    },
    {
      question:
        "[Scénario] Vous devez transformer un pipeline de traitement séquentiel (lecture d'un fichier CSV → parsing → calcul → écriture en base) en version parallèle pour accélérer le traitement de 10 millions de lignes. Quelle étape du pipeline est la MOINS naturellement parallélisable telle quelle ?",
      options: [
        "Le parsing de chaque ligne, car chaque ligne est indépendante des autres",
        "Le calcul CPU-bound sur chaque ligne parsée, indépendant des autres lignes",
        "La lecture séquentielle du fichier ligne par ligne (l'ordre de lecture du flux lui-même reste intrinsèquement séquentiel, même si le TRAITEMENT de chaque ligne une fois lue peut être parallélisé)",
        "Toutes les étapes sont strictement identiques en termes de parallélisation",
      ],
      answer: "La lecture séquentielle du fichier ligne par ligne (l'ordre de lecture du flux lui-même reste intrinsèquement séquentiel, même si le TRAITEMENT de chaque ligne une fois lue peut être parallélisé)",
      explanation:
        "C'est un point subtil et souvent source de confusion : la lecture d'un flux (Stream) est par nature séquentielle. La bonne architecture consiste à lire séquentiellement mais à paralléliser le TRAITEMENT de chaque ligne une fois lue (ex: via un pipeline producteur-consommateur ou Parallel.ForEach sur un buffer de lignes déjà lues), plutôt que d'essayer de paralléliser la lecture elle-même.",
    },
    {
      question:
        "[Scénario combiné] Un calcul de pricing CPU-bound s'exécute sur 1 million d'instruments, actuellement en foreach séquentiel dans un hot path critique. Quelle combinaison d'outils est la plus appropriée pour maximiser la performance, en tenant compte à la fois du parallélisme ET des allocations mémoire ?",
      options: [
        "async/await sur chaque instrument, car async accélère toujours le CPU",
        "Parallel.ForEach (ou PLINQ) avec MaxDegreeOfParallelism proche de Environment.ProcessorCount pour exploiter les cœurs disponibles, combiné à Span<T>/évitement du LINQ dans le calcul interne pour limiter la pression sur le Garbage Collector",
        "Créer 1 million de Thread pour un parallélisme maximal",
        "Un simple foreach avec ConfigureAwait(false), suffisant pour tout paralléliser",
      ],
      answer: "Parallel.ForEach (ou PLINQ) avec MaxDegreeOfParallelism proche de Environment.ProcessorCount pour exploiter les cœurs disponibles, combiné à Span<T>/évitement du LINQ dans le calcul interne pour limiter la pression sur le Garbage Collector",
      explanation:
        "La performance maximale dans ce scénario combine deux leviers distincts : la parallélisation CPU-bound bornée par le nombre de cœurs réels (Parallel.ForEach dimensionné correctement), ET la réduction des allocations dans le calcul interne (Span<T>, éviter LINQ) pour ne pas ajouter de pression GC qui contrebalancerait le gain de parallélisme. async/await n'apporte ici aucun bénéfice, ce n'est pas de l'I/O-bound.",
    },

    // ==================== SECTION J: COMBOS PERFORMANCE ====================
    {
      question:
        "[Optimisation] Vous devez traiter 1 million d'enregistrements en appliquant un calcul CPU intensif indépendant sur chacun. Quelle approche est la plus adaptée ?",
      options: [
        "Un simple foreach séquentiel, car la parallélisation n'apporte jamais de gain",
        "async/await sur chaque enregistrement, car async accélère toujours le CPU",
        "Parallel.ForEach (ou PLINQ) pour répartir le calcul CPU-bound sur plusieurs cœurs du ThreadPool",
        "Créer manuellement 1 million de Thread, un par enregistrement",
      ],
      answer: "Parallel.ForEach (ou PLINQ) pour répartir le calcul CPU-bound sur plusieurs cœurs du ThreadPool",
      explanation:
        "Pour un travail CPU-bound massivement parallélisable et indépendant, Parallel.ForEach (ou PLINQ avec .AsParallel()) exploite efficacement plusieurs cœurs via le ThreadPool, sans le coût prohibitif de créer un Thread par élément.",
    },
    {
      question:
        "[Optimisation] Votre OMS doit interroger 5 brokers différents via HTTP pour obtenir leurs meilleurs prix, puis choisir le meilleur. Quelle approche minimise le temps total d'attente ?",
      options: [
        "Appeler les 5 brokers séquentiellement avec await, l'un après l'autre",
        "Lancer les 5 appels sans await puis les attendre tous ensemble avec Task.WhenAll",
        "Utiliser 5 Thread manuels dédiés à chaque appel",
        "Utiliser Task.Run pour chaque appel HTTP",
      ],
      answer: "Lancer les 5 appels sans await puis les attendre tous ensemble avec Task.WhenAll",
      explanation:
        "En lançant les 5 tasks HTTP sans await immédiat puis en les combinant avec Task.WhenAll, elles s'exécutent en parallèle logique (I/O-bound), et le temps total est proche du plus lent des 5 appels plutôt que la somme des 5.",
    },
    {
      question:
        "[Optimisation] Dans un hot path (code exécuté des millions de fois par seconde), pourquoi évite-t-on souvent LINQ (Where, Select...) au profit d'une boucle for classique ?",
      options: [
        "LINQ est interdit par le compilateur dans les boucles",
        "LINQ génère des allocations supplémentaires (délégués, énumérateurs, itérateurs) qui peuvent peser sur la performance et la pression du Garbage Collector à très haute fréquence",
        "LINQ ne fonctionne pas avec les collections génériques",
        "Une boucle for est toujours plus lisible, c'est la seule raison",
      ],
      answer: "LINQ génère des allocations supplémentaires (délégués, énumérateurs, itérateurs) qui peuvent peser sur la performance et la pression du Garbage Collector à très haute fréquence",
      explanation:
        "Dans un chemin critique exécuté à très haute fréquence (ex: traitement de market data tick par tick), les allocations induites par LINQ (closures, itérateurs) peuvent générer une pression GC mesurable ; une boucle for évite ces allocations.",
    },
    {
      question:
        "[Optimisation] Plusieurs threads doivent lire et écrire simultanément dans un dictionnaire partagé de positions de trading. Quelle structure est la plus adaptée pour éviter à la fois les race conditions et un goulot d'étranglement excessif ?",
      options: [
        "Un Dictionary<K,V> classique sans aucune synchronisation",
        "Un Dictionary<K,V> protégé par un seul lock global autour de chaque accès, même en lecture",
        "ConcurrentDictionary<K,V>, conçu pour un accès concurrent thread-safe avec un verrouillage plus fin que verrouiller tout le dictionnaire",
        "Une List<KeyValuePair<K,V>> parcourue linéairement à chaque accès",
      ],
      answer: "ConcurrentDictionary<K,V>, conçu pour un accès concurrent thread-safe avec un verrouillage plus fin que verrouiller tout le dictionnaire",
      explanation:
        "ConcurrentDictionary utilise un verrouillage interne fin (par segment) plutôt qu'un verrou global, offrant de bien meilleures performances qu'un Dictionary protégé par un lock unique dans un contexte fortement concurrent.",
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
        ? <h3 className="success">🚀 Excellent ! Collections & Concurrence maîtrisées.</h3>
        : <p className="fail">📚 Révisez les pièges async/await et les combos d'optimisation.</p>
      }
    </div>
  );
};

const CollectionsConcurrencyQCM = () => {
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
            Collections & Concurrence C# 🔹 {level === "basic"
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

export default CollectionsConcurrencyQCM;