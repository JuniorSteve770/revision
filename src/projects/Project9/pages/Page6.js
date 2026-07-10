// src/projects/BackendInterview/CSharpAvanceQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — C# avancé",
    answer:
      "◆ **Définition** : 6 piliers du langage C# et de son runtime souvent testés en entretien\n◆ **Dictionnaires** : la structure clé→valeur la plus utilisée en pratique\n◆ **Types valeur vs référence** : détermine où et comment une donnée est stockée en mémoire\n◆ **Types de classes** : normale, abstraite, statique, sealed, partial — chacune a un rôle précis\n◆ **Opérateurs logiques** : && / || avec court-circuit vs & / | sans court-circuit\n◆ **Tests** : unitaires (isolés) vs intégration (bout en bout)\n◆ **Garbage Collector** : gestion automatique de la mémoire managée",
  },
  {
    question: "Dictionnaires — déclaration & accès",
    answer:
      "◆ **Définition** : Dictionary<K,V> associe une clé unique à une valeur, avec accès O(1)\n◆ **TryGetValue** : 1 seul accès, pas d'exception si la clé est absente\n◆ **ContainsKey + indexeur** : 2 accès, plus lent\n◆ **Piège** : accéder à une clé absente via l'indexeur lève une KeyNotFoundException\n◆ **Cas d'usage** : indexer des ordres par ClOrdID pour un accès instantané\n\n```csharp\nif (dict.TryGetValue(key, out var value)) { ... }\ndict[newKey] = newValue; // ajoute ou remplace\n```",
  },
  {
    question: "Dictionnaires — itération & cas d'usage avancés",
    answer:
      "◆ **Définition** : parcourir un Dictionary donne des KeyValuePair<K,V>\n◆ **Groupement** : Dictionary<string, List<T>> pour grouper des éléments par clé\n◆ **Cache** : Dictionary<K,V> comme mémoïsation de résultats coûteux à recalculer\n◆ **Doublons de clé** : Add() lève une exception si la clé existe déjà, l'indexeur écrase silencieusement\n◆ **Cas d'usage** : compter les occurrences d'un symbole tradé dans un flux d'ordres\n\n```csharp\nforeach (KeyValuePair<string, int> kv in compteur)\n    Console.WriteLine($\"{kv.Key}: {kv.Value}\");\n```",
  },
  {
    question: "Types valeur vs types référence — définition",
    answer:
      "◆ **Définition** : deux catégories de types en C#, avec un comportement mémoire différent\n◆ **Types valeur (struct, int, double, bool...)** : stockés sur la pile (stack) ou inline, copiés à chaque affectation\n◆ **Types référence (class, string, array...)** : stockés sur le tas (heap), la variable contient une référence (pointeur)\n◆ **Piège** : `string` est un type référence mais immuable — chaque modification crée une nouvelle instance\n◆ **Cas d'usage** : utiliser un struct pour un petit objet immuable fréquemment copié (ex: Point, Money)\n\n```csharp\nstruct Point { public int X, Y; } // type valeur\nclass Order { public string Symbol; } // type référence\n```",
  },
  {
    question: "Boxing / Unboxing & passage par paramètre",
    answer:
      "◆ **Définition** : le boxing convertit un type valeur en objet (heap), l'unboxing fait l'inverse\n◆ **Coût** : chaque boxing alloue de la mémoire sur le heap — à éviter dans un hot path\n◆ **Passage par défaut** : les types valeur sont copiés, les types référence passent 'par référence à l'objet' (mais la variable elle-même est copiée)\n◆ **ref / out** : forcent le passage par référence explicite, même pour un type valeur\n◆ **Cas d'usage** : éviter `ArrayList` (boxing implicite) au profit de `List<T>` générique\n\n```csharp\nobject boxed = 42;      // boxing\nint unboxed = (int)boxed; // unboxing\n```",
  },
  {
    question: "Types de classes C# — normale & abstraite",
    answer:
      "◆ **Définition** : deux formes de classes aux usages différents\n◆ **Classe normale** : instanciable directement, comportement concret\n◆ **Classe abstraite** : ne peut pas être instanciée, sert de base commune, peut contenir des méthodes abstraites (à implémenter) et concrètes\n◆ **Cas d'usage** : une classe abstraite `OrderBase` factorise la logique commune à `LimitOrder` et `MarketOrder`, qui l'héritent\n\n```csharp\npublic abstract class OrderBase\n{\n    public abstract decimal CalculateCost();\n}\npublic class LimitOrder : OrderBase\n{\n    public override decimal CalculateCost() => Price * Quantity;\n}\n```",
  },
  {
    question: "Types de classes C# — statique, sealed, partial",
    answer:
      "◆ **Définition** : trois autres formes de classes très fréquentes\n◆ **static** : ne peut pas être instanciée, contient uniquement des membres statiques (ex: classes utilitaires)\n◆ **sealed** : ne peut pas être héritée, empêche toute classe fille (souvent pour la sécurité ou l'optimisation)\n◆ **partial** : répartit la définition d'une classe sur plusieurs fichiers (ex: code généré + code métier)\n◆ **Cas d'usage** : `static class MathUtils` pour des fonctions utilitaires, `sealed class ImmutablePrice` pour empêcher l'héritage\n\n```csharp\npublic static class PriceCalculator { public static decimal ApplyFee(decimal p) => p * 1.001m; }\npublic sealed class ImmutablePrice { }\n```",
  },
  {
    question: "Opérateurs logiques — court-circuit",
    answer:
      "◆ **Définition** : `&&` et `||` évaluent le second opérande seulement si nécessaire (court-circuit), `&` et `|` évaluent toujours les deux\n◆ **&&** : s'arrête dès que le premier opérande est false\n◆ **||** : s'arrête dès que le premier opérande est true\n◆ **Piège** : `if (obj != null & obj.Value > 0)` peut lever une NullReferenceException, contrairement à `&&`\n◆ **Cas d'usage** : toujours préférer `&&`/`||` pour éviter des évaluations inutiles ou dangereuses\n\n```csharp\nif (order != null && order.Quantity > 0) { ... } // sûr\n```",
  },
  {
    question: "Tests unitaires — Arrange-Act-Assert & mocking",
    answer:
      "◆ **Définition** : un test unitaire vérifie une unité de code isolée, sans dépendances externes réelles\n◆ **Arrange-Act-Assert** : préparer les données, exécuter l'action, vérifier le résultat\n◆ **Mocking (Moq)** : simuler une dépendance (ex: repository, service externe) pour isoler le code testé\n◆ **Cas d'usage** : tester la logique de calcul d'un ordre sans toucher une vraie base de données\n\n```csharp\n[Fact]\npublic void CalculateCost_ShouldReturnCorrectValue()\n{\n    var order = new LimitOrder { Price = 10, Quantity = 5 };\n    Assert.Equal(50, order.CalculateCost());\n}\n```",
  },
  {
    question: "Tests d'intégration — différence avec les tests unitaires",
    answer:
      "◆ **Définition** : un test d'intégration vérifie que plusieurs composants réels fonctionnent bien ensemble (DB, API, fichiers)\n◆ **WebApplicationFactory** : démarre une instance de l'application ASP.NET en mémoire pour tester les endpoints réels\n◆ **InMemory EF** : simule une base de données en mémoire pour tester la couche de persistance sans vrai serveur SQL\n◆ **Cas d'usage** : vérifier qu'un POST /orders crée bien un ordre en base et retourne le bon statut HTTP\n\n```csharp\nvar factory = new WebApplicationFactory<Program>();\nvar client = factory.CreateClient();\nvar response = await client.PostAsJsonAsync(\"/orders\", newOrder);\n```",
  },
  {
    question: "Garbage Collector — générations & IDisposable",
    answer:
      "◆ **Définition** : le GC libère automatiquement la mémoire des objets managés qui ne sont plus référencés\n◆ **Génération 0** : objets récents, nettoyés fréquemment (rapide)\n◆ **Génération 1** : objets ayant survécu à un cycle\n◆ **Génération 2** : objets longue durée, nettoyés rarement (coûteux)\n◆ **IDisposable/Dispose** : pour les ressources NON managées (fichiers, connexions), le GC ne les libère pas automatiquement\n◆ **Cas d'usage** : toujours implémenter IDisposable pour une classe qui détient une connexion réseau ou un fichier",
  },
  {
    question: "GC — using vs Dispose, fuites mémoire courantes",
    answer:
      "◆ **Définition** : `using` garantit un Dispose() déterministe, contrairement au GC qui agit à un moment non prévisible\n◆ **Fuite classique 1** : event handler non désabonné (`obj.Event -= handler` oublié) — l'objet reste référencé indéfiniment\n◆ **Fuite classique 2** : collection statique qui grossit indéfiniment (cache jamais vidé)\n◆ **Cas d'usage** : désabonner un event dans Dispose() pour éviter qu'un objet écouteur ne soit jamais collecté\n\n```csharp\npublic void Dispose() { publisher.OnUpdate -= HandleUpdate; }\n```",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: DICTIONNAIRES ====================
    {
      question: "[Dictionnaires] Pourquoi TryGetValue est-il préférable à ContainsKey suivi de l'indexeur ?",
      options: [
        "TryGetValue ne fonctionne que sur les petits dictionnaires",
        "Il n'y a aucune différence de performance",
        "ContainsKey + indexeur effectuent 2 accès à la table de hachage, TryGetValue n'en effectue qu'un seul",
        "ContainsKey est obsolète en C#",
      ],
      answer: "ContainsKey + indexeur effectuent 2 accès à la table de hachage, TryGetValue n'en effectue qu'un seul",
      explanation:
        "ContainsKey(key) puis dict[key] font deux recherches. TryGetValue combine vérification et récupération en un seul accès, plus performant.",
    },
    {
      question: "[Dictionnaires] Que se passe-t-il si on accède à dict[\"clé_absente\"] via l'indexeur sur un Dictionary<K,V> ?",
      options: [
        "Une valeur par défaut (null ou 0) est silencieusement retournée",
        "Une KeyNotFoundException est levée",
        "La clé est automatiquement ajoutée avec une valeur par défaut",
        "Le programme se ferme immédiatement sans exception",
      ],
      answer: "Une KeyNotFoundException est levée",
      explanation:
        "L'indexeur d'un Dictionary lève une KeyNotFoundException si la clé n'existe pas. C'est pourquoi TryGetValue ou ContainsKey sont recommandés pour un accès sûr.",
    },
    {
      question: "[Dictionnaires] Quelle est la différence entre dict.Add(key, value) et dict[key] = value pour une clé déjà existante ?",
      options: [
        "Les deux syntaxes sont strictement équivalentes",
        "Add() écrase silencieusement l'ancienne valeur, l'indexeur lève une exception",
        "Add() lève une ArgumentException si la clé existe déjà, l'indexeur écrase silencieusement la valeur existante",
        "Add() ne fonctionne que pour les clés de type string",
      ],
      answer: "Add() lève une ArgumentException si la clé existe déjà, l'indexeur écrase silencieusement la valeur existante",
      explanation:
        "dict.Add() est strict et lève une exception en cas de doublon de clé. dict[key] = value est plus permissif : il ajoute la clé si absente, ou remplace la valeur si elle existe déjà.",
    },

    // ==================== SECTION B: TYPES VALEUR / REFERENCE ====================
    {
      question: "[Types] Quelle est la différence fondamentale entre un type valeur et un type référence en C# ?",
      options: [
        "Un type valeur est toujours plus lent qu'un type référence",
        "Un type valeur stocke la donnée directement (souvent sur la pile), un type référence stocke une référence vers la donnée sur le tas",
        "Il n'y a aucune différence pratique en C#",
        "Les types valeur ne peuvent pas être des paramètres de méthode",
      ],
      answer: "Un type valeur stocke la donnée directement (souvent sur la pile), un type référence stocke une référence vers la donnée sur le tas",
      explanation:
        "Un type valeur (struct, int, bool...) contient directement sa donnée. Un type référence (class, array...) contient une référence vers un objet alloué sur le tas (heap).",
    },
    {
      question: "[Types] Pourquoi dit-on que `string` a un comportement particulier bien que ce soit un type référence ?",
      options: [
        "string se comporte comme un type valeur car il est immuable : toute modification crée une nouvelle instance",
        "string est en réalité un type valeur déguisé en type référence",
        "string n'existe pas réellement en C#, c'est un alias",
        "string ne peut jamais être null",
      ],
      answer: "string se comporte comme un type valeur car il est immuable : toute modification crée une nouvelle instance",
      explanation:
        "string est bien un type référence (alloué sur le heap), mais son immuabilité fait qu'on ne peut jamais modifier son contenu en place : chaque opération (concaténation, etc.) crée une nouvelle chaîne, ce qui donne une impression de comportement 'valeur'.",
    },
    {
      question: "[Types] Qu'est-ce que le boxing en C# ?",
      options: [
        "La conversion d'un type valeur en objet (type référence), ce qui alloue de la mémoire sur le heap",
        "La compression des données en mémoire",
        "La conversion automatique d'un int en string",
        "Une opération réservée aux tableaux",
      ],
      answer: "La conversion d'un type valeur en objet (type référence), ce qui alloue de la mémoire sur le heap",
      explanation:
        "Le boxing convertit un type valeur (ex: int) en objet, l'enveloppant sur le heap. C'est une opération coûteuse à éviter dans du code performance-critique (ex: éviter ArrayList au profit de List<T>).",
    },

    // ==================== SECTION C: TYPES DE CLASSES ====================
    {
      question: "[Classes] Peut-on instancier directement une classe abstraite en C# ?",
      options: [
        "Oui, sans aucune restriction",
        "Non, une classe abstraite ne peut jamais être instanciée directement, seulement héritée",
        "Oui, mais uniquement avec le mot-clé new abstract",
        "Cela dépend du nombre de méthodes abstraites qu'elle contient",
      ],
      answer: "Non, une classe abstraite ne peut jamais être instanciée directement, seulement héritée",
      explanation:
        "Une classe abstract sert de modèle de base : elle définit une structure commune (et parfois des méthodes abstraites à implémenter), mais ne peut être instanciée directement — seules ses classes filles concrètes le peuvent.",
    },
    {
      question: "[Classes] À quoi sert une classe static en C# ?",
      options: [
        "À créer des instances multiples partageant le même état",
        "À contenir uniquement des membres statiques, sans possibilité d'instanciation, typiquement pour des fonctions utilitaires",
        "À empêcher toute méthode de retourner une valeur",
        "À forcer l'héritage multiple",
      ],
      answer: "À contenir uniquement des membres statiques, sans possibilité d'instanciation, typiquement pour des fonctions utilitaires",
      explanation:
        "Une classe static ne peut pas être instanciée avec new ; elle ne contient que des membres static, ce qui en fait un conteneur idéal pour des fonctions utilitaires ou des constantes (ex: Math, une classe PriceCalculator).",
    },
    {
      question: "[Classes] Quel est l'effet du mot-clé sealed sur une classe ?",
      options: [
        "Elle empêche toute instanciation de la classe",
        "Elle rend tous les membres de la classe privés",
        "Elle empêche toute autre classe d'hériter de cette classe",
        "Elle transforme la classe en interface",
      ],
      answer: "Elle empêche toute autre classe d'hériter de cette classe",
      explanation:
        "sealed empêche l'héritage : aucune classe ne peut dériver d'une classe sealed. Cela peut être utilisé pour des raisons de sécurité, de conception (empêcher une extension non prévue) ou d'optimisation.",
    },

    // ==================== SECTION D: OPERATEURS LOGIQUES ====================
    {
      question: "[Logique] Quelle est la différence entre && et & en C# dans une condition booléenne ?",
      options: [
        "Il n'y a aucune différence, ce sont deux syntaxes équivalentes",
        "&& utilise le court-circuit (n'évalue le second opérande que si nécessaire), & évalue toujours les deux opérandes",
        "& est plus rapide que && dans tous les cas",
        "&& ne peut être utilisé qu'avec des types numériques",
      ],
      answer: "&& utilise le court-circuit (n'évalue le second opérande que si nécessaire), & évalue toujours les deux opérandes",
      explanation:
        "&& (et logique avec court-circuit) n'évalue le second opérande que si le premier est true. & évalue toujours les deux opérandes, même si le résultat est déjà déterminé par le premier.",
    },
    {
      question: "[Logique] Pourquoi `if (order != null && order.Quantity > 0)` est-il plus sûr que `if (order != null & order.Quantity > 0)` ?",
      options: [
        "Les deux sont rigoureusement équivalents en termes de sécurité",
        "Avec &&, si order est null, order.Quantity n'est jamais évalué (évite une NullReferenceException) ; avec &, les deux expressions sont évaluées, provoquant potentiellement l'exception",
        "& provoque toujours une erreur de compilation",
        "&& ne fonctionne pas avec les objets, seulement les booléens simples",
      ],
      answer: "Avec &&, si order est null, order.Quantity n'est jamais évalué (évite une NullReferenceException) ; avec &, les deux expressions sont évaluées, provoquant potentiellement l'exception",
      explanation:
        "C'est le piège classique du court-circuit : && protège contre l'évaluation d'une expression dangereuse (accès à une propriété d'un objet potentiellement null) si la condition précédente est déjà fausse.",
    },

    // ==================== SECTION E: TESTS ====================
    {
      question: "[Tests] Que signifie le pattern Arrange-Act-Assert dans un test unitaire ?",
      options: [
        "Trois frameworks de test différents à combiner",
        "Préparer les données (Arrange), exécuter l'action testée (Act), vérifier le résultat (Assert)",
        "Trois types d'exceptions à gérer systématiquement",
        "Un pattern réservé uniquement aux tests d'intégration",
      ],
      answer: "Préparer les données (Arrange), exécuter l'action testée (Act), vérifier le résultat (Assert)",
      explanation:
        "Arrange-Act-Assert est la structure standard d'un test unitaire lisible : on prépare le contexte, on exécute l'action à tester, puis on vérifie que le résultat correspond aux attentes.",
    },
    {
      question: "[Tests] Pourquoi utilise-t-on le mocking (ex: avec Moq) dans un test unitaire ?",
      options: [
        "Pour ralentir volontairement l'exécution des tests",
        "Pour simuler une dépendance externe (DB, service, API) et isoler le code réellement testé de ses dépendances",
        "Pour remplacer complètement le besoin d'écrire des tests",
        "Le mocking n'est utilisé que dans les tests d'intégration, jamais en unitaire",
      ],
      answer: "Pour simuler une dépendance externe (DB, service, API) et isoler le code réellement testé de ses dépendances",
      explanation:
        "Le mocking permet de remplacer une dépendance réelle (ex: un repository qui accède à une DB) par une version simulée dont on contrôle le comportement, afin que le test unitaire ne dépende que du code qu'il vise à valider.",
    },
    {
      question: "[Tests] Quelle est la différence principale entre un test unitaire et un test d'intégration ?",
      options: [
        "Un test d'intégration est toujours plus rapide qu'un test unitaire",
        "Un test unitaire teste une unité de code isolée (avec mocks), un test d'intégration vérifie que plusieurs composants réels (DB, API) fonctionnent ensemble",
        "Un test unitaire ne peut jamais être automatisé",
        "Il n'y a aucune différence, ce sont des synonymes",
      ],
      answer: "Un test unitaire teste une unité de code isolée (avec mocks), un test d'intégration vérifie que plusieurs composants réels (DB, API) fonctionnent ensemble",
      explanation:
        "Le test unitaire isole une petite unité de code (souvent une méthode) de ses dépendances via des mocks. Le test d'intégration vérifie le comportement réel de plusieurs composants ensemble, souvent avec une vraie ou une fausse base de données proche du réel.",
    },

    // ==================== SECTION F: GARBAGE COLLECTOR ====================
    {
      question: "[GC] Que fait le Garbage Collector en .NET ?",
      options: [
        "Il compile le code C# en IL",
        "Il libère automatiquement la mémoire des objets managés qui ne sont plus référencés par le programme",
        "Il gère uniquement les fichiers ouverts",
        "Il optimise le code au moment de l'exécution (JIT)",
      ],
      answer: "Il libère automatiquement la mémoire des objets managés qui ne sont plus référencés par le programme",
      explanation:
        "Le GC surveille les objets alloués sur le heap managé et libère automatiquement la mémoire de ceux qui ne sont plus accessibles (aucune référence active), évitant au développeur de gérer manuellement cette libération.",
    },
    {
      question: "[GC] Pourquoi doit-on implémenter IDisposable pour une classe qui détient une connexion réseau ou un fichier ?",
      options: [
        "Parce que le Garbage Collector ne gère pas automatiquement les ressources non managées comme les fichiers ou connexions",
        "Parce que IDisposable est obligatoire pour toutes les classes C#",
        "Parce que le GC supprime le fichier physique automatiquement",
        "IDisposable n'a aucun rapport avec la gestion de la mémoire",
      ],
      answer: "Parce que le Garbage Collector ne gère pas automatiquement les ressources non managées comme les fichiers ou connexions",
      explanation:
        "Le GC gère la mémoire managée (objets .NET), mais pas les ressources non managées (handles de fichiers, connexions réseau, sockets). IDisposable/Dispose() permet de libérer explicitement ces ressources de façon déterministe.",
    },
  ],

  avance: [
    // ==================== SECTION G: DICTIONNAIRES AVANCE ====================
    {
      question: "[Dictionnaires] Pourquoi Dictionary<K,V>.Contains sur les clés est-il O(1) en moyenne mais pas garanti dans le pire cas théorique ?",
      options: [
        "Parce que Dictionary utilise en réalité une List en interne",
        "Parce qu'une mauvaise distribution du hachage (nombreuses collisions) peut dégrader la recherche vers O(n) dans le pire cas",
        "Parce que Contains n'existe pas sur les clés d'un Dictionary",
        "Parce que O(1) n'est valable que pour les Dictionary de moins de 10 éléments",
      ],
      answer: "Parce qu'une mauvaise distribution du hachage (nombreuses collisions) peut dégrader la recherche vers O(n) dans le pire cas",
      explanation:
        "Dictionary repose sur une table de hachage. Avec une bonne fonction de hachage et peu de collisions, l'accès est O(1) en moyenne. En cas de collisions massives (mauvaise fonction de hachage ou attaque ciblée), la complexité peut se dégrader.",
    },
    {
      question: "[Dictionnaires] Pourquoi Dictionary<K,V> ne garantit-il pas l'ordre d'itération des éléments ?",
      options: [
        "Parce que l'implémentation interne repose sur une table de hachage, dont l'ordre dépend du hachage des clés et non de l'ordre d'insertion",
        "Parce que .NET trie toujours les clés par ordre alphabétique",
        "Parce que l'itération est aléatoire à chaque appel",
        "Dictionary garantit en réalité l'ordre d'insertion, comme List<T>",
      ],
      answer: "Parce que l'implémentation interne repose sur une table de hachage, dont l'ordre dépend du hachage des clés et non de l'ordre d'insertion",
      explanation:
        "Contrairement à List<T>, Dictionary<K,V> ne garantit pas formellement l'ordre d'itération dans sa spécification, car l'organisation interne dépend du hachage des clés. Si l'ordre importe, il vaut mieux utiliser une structure ordonnée dédiée.",
    },

    // ==================== SECTION H: TYPES AVANCE ====================
    {
      question: "[Types] Dans quel cas privilégier un struct plutôt qu'une class pour un type de données ?",
      options: [
        "Quand l'objet est petit, immuable, et fréquemment copié, avec un cycle de vie court (ex: Point, Money, coordonnées)",
        "Toujours, un struct est systématiquement plus performant qu'une class",
        "Uniquement pour les collections de grande taille",
        "Un struct ne peut jamais contenir de méthodes",
      ],
      answer: "Quand l'objet est petit, immuable, et fréquemment copié, avec un cycle de vie court (ex: Point, Money, coordonnées)",
      explanation:
        "Un struct évite l'allocation heap et le passage par référence, ce qui peut être avantageux pour de petits objets fréquemment créés/copiés. Pour de gros objets ou des objets à identité (partagés, mutables), une class reste préférable.",
    },
    {
      question: "[Types] Que se passe-t-il lorsqu'on passe un objet de type référence en paramètre d'une méthode, sans mot-clé ref/out ?",
      options: [
        "La référence (l'adresse de l'objet) est copiée dans le paramètre, donc modifier les propriétés de l'objet à l'intérieur affecte l'objet original, mais réassigner le paramètre à un nouvel objet ne l'affecte pas",
        "L'objet entier est toujours copié en mémoire",
        "Il est impossible de modifier l'objet depuis la méthode",
        "Le comportement est strictement identique à un type valeur",
      ],
      answer: "La référence (l'adresse de l'objet) est copiée dans le paramètre, donc modifier les propriétés de l'objet à l'intérieur affecte l'objet original, mais réassigner le paramètre à un nouvel objet ne l'affecte pas",
      explanation:
        "La variable référence elle-même est passée par valeur (copie de l'adresse). Modifier l'état interne de l'objet pointé affecte bien l'objet d'origine, mais réassigner le paramètre local à un tout nouvel objet ne change pas la référence de l'appelant (sauf avec ref).",
    },

    // ==================== SECTION I: CLASSES AVANCE ====================
    {
      question: "[Classes] Pourquoi une classe abstraite peut-elle contenir à la fois des méthodes abstraites ET des méthodes concrètes, contrairement à une interface classique (pré-C# 8) ?",
      options: [
        "Une classe abstraite est en réalité identique à une interface",
        "Une classe abstraite factorise du code partagé (implémentation commune) tout en imposant un contrat via ses méthodes abstraites, alors qu'une interface classique ne définissait qu'un contrat sans implémentation",
        "Ce n'est pas possible, une classe abstraite ne peut contenir que des méthodes abstraites",
        "Les méthodes concrètes dans une classe abstraite sont interdites par le compilateur",
      ],
      answer: "Une classe abstraite factorise du code partagé (implémentation commune) tout en imposant un contrat via ses méthodes abstraites, alors qu'une interface classique ne définissait qu'un contrat sans implémentation",
      explanation:
        "C'est justement la force de la classe abstraite : elle peut fournir une implémentation par défaut pour certains membres, tout en forçant les classes filles à implémenter les méthodes marquées abstract, ce qu'une interface classique ne permettait pas avant C# 8 (default interface methods).",
    },
    {
      question: "[Classes] Pourquoi utilise-t-on couramment partial pour les classes générées par un outil (ex: Entity Framework, WinForms Designer) ?",
      options: [
        "Pour empêcher totalement l'utilisation de la classe",
        "Pour séparer le code généré automatiquement (dans un fichier) du code métier ajouté manuellement (dans un autre fichier), tout en formant une seule classe logique à la compilation",
        "partial rend la classe thread-safe automatiquement",
        "partial est un synonyme de sealed",
      ],
      answer: "Pour séparer le code généré automatiquement (dans un fichier) du code métier ajouté manuellement (dans un autre fichier), tout en formant une seule classe logique à la compilation",
      explanation:
        "partial permet de répartir une classe sur plusieurs fichiers physiques, ce qui est très utile quand un outil régénère un fichier automatiquement (ex: modèle EF) sans risquer d'écraser le code métier ajouté séparément par le développeur.",
    },

    // ==================== SECTION J: TESTS AVANCE ====================
    {
      question: "[Tests] Pourquoi préfère-t-on une base de données InMemory (ou un vrai conteneur de test) plutôt que la base de production pour un test d'intégration EF6 ?",
      options: [
        "Une base InMemory est toujours plus rapide en production également",
        "Pour isoler les tests des données réelles, éviter de polluer/corrompre la production, et garantir des tests reproductibles et indépendants entre eux",
        "EF6 ne peut fonctionner qu'avec une base InMemory",
        "Il n'y a aucune raison particulière, c'est une simple convention",
      ],
      answer: "Pour isoler les tests des données réelles, éviter de polluer/corrompre la production, et garantir des tests reproductibles et indépendants entre eux",
      explanation:
        "Tester contre la production est risqué (corruption de données, effets de bord) et peu reproductible (état changeant). Une base isolée (InMemory ou conteneur dédié) garantit un état contrôlé et propre à chaque exécution de test.",
    },
    {
      question: "[Tests] Comment teste-t-on correctement une méthode async en C# avec un framework comme xUnit ?",
      options: [
        "Il est impossible de tester une méthode async",
        "En marquant la méthode de test elle-même comme async Task et en awaitant la méthode testée, plutôt que d'utiliser .Result ou .Wait()",
        "En transformant systématiquement la méthode testée en méthode synchrone avant de la tester",
        "En utilisant uniquement Thread.Sleep pour attendre le résultat",
      ],
      answer: "En marquant la méthode de test elle-même comme async Task et en awaitant la méthode testée, plutôt que d'utiliser .Result ou .Wait()",
      explanation:
        "xUnit (et les frameworks modernes) supportent nativement les méthodes de test `async Task`. Il faut awaiter la méthode testée normalement, plutôt que d'utiliser .Result/.Wait() qui peuvent masquer des exceptions ou provoquer des deadlocks.",
    },

    // ==================== SECTION K: GC AVANCE ====================
    {
      question: "[GC] Pourquoi la génération 2 du Garbage Collector est-elle considérée comme la plus coûteuse à nettoyer ?",
      options: [
        "Parce qu'elle contient les objets de longue durée, et un passage du GC en génération 2 doit examiner potentiellement un tas mémoire bien plus large",
        "Parce que la génération 2 n'existe pas réellement en .NET",
        "Parce que la génération 2 est nettoyée à chaque allocation d'objet",
        "Parce que la génération 2 ne peut contenir que des types valeur",
      ],
      answer: "Parce qu'elle contient les objets de longue durée, et un passage du GC en génération 2 doit examiner potentiellement un tas mémoire bien plus large",
      explanation:
        "Le GC générationnel part du principe que la plupart des objets meurent jeunes (génération 0, nettoyée fréquemment et rapidement). Les objets qui survivent plusieurs cycles montent en génération 2, dont le nettoyage est plus rare mais bien plus coûteux car il couvre un tas plus large.",
    },
    {
      question: "[GC] Quelle est une cause fréquente de fuite mémoire en .NET malgré la présence d'un Garbage Collector ?",
      options: [
        "Le GC garantit qu'aucune fuite mémoire n'est jamais possible en .NET",
        "Un event handler jamais désabonné (`objet.Event += handler` sans `-=`), qui maintient artificiellement une référence vivante vers l'objet abonné, l'empêchant d'être collecté",
        "L'utilisation de using sur une ressource IDisposable",
        "La déclaration d'un struct plutôt que d'une class",
      ],
      answer: "Un event handler jamais désabonné (`objet.Event += handler` sans `-=`), qui maintient artificiellement une référence vivante vers l'objet abonné, l'empêchant d'être collecté",
      explanation:
        "Le GC ne collecte que les objets sans référence active. Si un objet 'publisher' garde une référence vers un handler d'un objet 'subscriber' jamais désabonné, ce dernier reste vivant tant que le publisher existe, même s'il n'est plus utilisé ailleurs — fuite mémoire classique en .NET.",
    },
    {
      question: "[GC] Quelle est la différence entre la libération via `using` (Dispose) et la libération via le Garbage Collector ?",
      options: [
        "Il n'y a strictement aucune différence, using appelle le GC immédiatement",
        "using garantit une libération déterministe (immédiate, à la sortie du bloc) des ressources, alors que le GC agit à un moment non déterministe décidé par le runtime",
        "using empêche définitivement le GC de s'exécuter",
        "Le GC est toujours plus rapide que using",
      ],
      answer: "using garantit une libération déterministe (immédiate, à la sortie du bloc) des ressources, alors que le GC agit à un moment non déterministe décidé par le runtime",
      explanation:
        "using (via Dispose) libère explicitement et immédiatement une ressource à la sortie du bloc. Le GC, lui, décide seul du moment où il va s'exécuter et collecter la mémoire managée, ce qui n'est pas prévisible ni immédiat — d'où l'importance de Dispose pour les ressources critiques (connexions, fichiers).",
    },
  ],

  expert: [
    // ==================== SECTION L: BUGS A REPERER ====================
    {
      question:
        "[Bug à repérer] Quel est le problème de ce code qui compte les occurrences d'un symbole dans un flux d'ordres ?\n\n```csharp\nvar compteur = new Dictionary<string, int>();\nforeach (var order in orders)\n{\n    compteur[order.Symbol]++;\n}\n```",
      options: [
        "Le code est parfaitement correct",
        "Une KeyNotFoundException sera levée dès la première rencontre d'un nouveau symbole, car compteur[order.Symbol]++ suppose que la clé existe déjà",
        "Dictionary ne peut pas stocker des int comme valeurs",
        "foreach ne peut pas être utilisé avec une liste d'ordres",
      ],
      answer: "Une KeyNotFoundException sera levée dès la première rencontre d'un nouveau symbole, car compteur[order.Symbol]++ suppose que la clé existe déjà",
      explanation:
        "compteur[order.Symbol]++ est équivalent à compteur[order.Symbol] = compteur[order.Symbol] + 1, ce qui nécessite de LIRE la valeur existante d'abord. Si le symbole n'existe pas encore, cela lève une exception. Il faut initialiser la clé à 0 (via TryGetValue ou CollectionsMarshal.GetValueRefOrAddDefault) avant d'incrémenter.",
    },
    {
      question:
        "[Bug à repérer] Quel est le risque de performance dans ce code qui traite un très grand nombre de petits objets Point immuables dans une boucle chaude ?\n\n```csharp\nclass Point { public int X, Y; } // classe, pas struct\nvar points = new List<Point>();\nfor (int i = 0; i < 10_000_000; i++)\n    points.Add(new Point { X = i, Y = i });\n```",
      options: [
        "Aucun problème, class est toujours préférable à struct",
        "Chaque Point est alloué individuellement sur le heap (10 millions d'allocations), augmentant la pression sur le Garbage Collector — un struct éviterait cette allocation individuelle",
        "List<Point> ne peut contenir que 1000 éléments maximum",
        "Le code ne compile pas",
      ],
      answer: "Chaque Point est alloué individuellement sur le heap (10 millions d'allocations), augmentant la pression sur le Garbage Collector — un struct éviterait cette allocation individuelle",
      explanation:
        "Pour un petit type immuable comme Point, utiliser une class force une allocation heap par instance. Avec un struct, les Point seraient stockés directement dans le tableau interne de la List, sans allocation individuelle, réduisant fortement la pression sur le GC.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce test unitaire censé être isolé ?\n\n```csharp\n[Fact]\npublic async Task GetOrder_ShouldReturnOrder()\n{\n    var context = new TradingContext(realConnectionString); // vraie base de prod\n    var service = new OrderService(context);\n    var order = await service.GetOrderAsync(\"ORD001\");\n    Assert.NotNull(order);\n}\n```",
      options: [
        "Ce test unitaire dépend d'une vraie base de données de production, ce n'est donc pas un test unitaire isolé mais un test d'intégration mal nommé — il faudrait mocker le contexte/repository",
        "Assert.NotNull ne peut jamais être utilisé dans un test async",
        "Le code ne compile pas car [Fact] n'accepte pas les méthodes async",
        "Il n'y a aucun problème, c'est un test unitaire parfaitement valide",
      ],
      answer: "Ce test unitaire dépend d'une vraie base de données de production, ce n'est donc pas un test unitaire isolé mais un test d'intégration mal nommé — il faudrait mocker le contexte/repository",
      explanation:
        "Un vrai test unitaire ne doit dépendre d'aucune ressource externe réelle (DB de prod, réseau). Ce test devrait soit mocker le repository/contexte, soit être reclassé comme test d'intégration utilisant une base isolée dédiée aux tests.",
    },

    // ==================== SECTION M: COMBOS & COMPARAISONS ====================
    {
      question:
        "[Combo] Pourquoi préfère-t-on souvent `sealed class` pour une classe représentant une valeur immuable (ex: Money, Price) dans un contexte de performance ?",
      options: [
        "sealed n'a aucun impact réel sur la performance",
        "sealed empêche la création de sous-classes imprévues (garantit l'immuabilité réelle) et peut permettre certaines optimisations JIT liées à l'absence de polymorphisme sur cette classe",
        "sealed transforme automatiquement la classe en struct",
        "sealed est obligatoire pour toute classe utilisée dans un Dictionary",
      ],
      answer: "sealed empêche la création de sous-classes imprévues (garantit l'immuabilité réelle) et peut permettre certaines optimisations JIT liées à l'absence de polymorphisme sur cette classe",
      explanation:
        "sealed garantit qu'aucune classe fille ne pourra casser le contrat d'immuabilité en ajoutant un état mutable, et le JIT peut parfois exploiter l'absence de polymorphisme (pas de vtable à consulter pour des appels virtuels) pour des micro-optimisations.",
    },
    {
      question:
        "[Combo] Un dictionnaire est partagé entre plusieurs threads dans un test d'intégration multithreadé. Le test échoue de façon aléatoire avec des exceptions internes au Dictionary. Quelle est la cause la plus probable ?",
      options: [
        "Dictionary<K,V> standard n'est pas thread-safe pour les écritures concurrentes ; il faut utiliser ConcurrentDictionary<K,V> ou synchroniser les accès avec lock",
        "Le test unitaire ne peut jamais échouer de façon aléatoire en C#",
        "Dictionary<K,V> devient thread-safe automatiquement dès qu'on utilise async/await",
        "Le problème vient nécessairement d'un mauvais GetHashCode sur les clés",
      ],
      answer: "Dictionary<K,V> standard n'est pas thread-safe pour les écritures concurrentes ; il faut utiliser ConcurrentDictionary<K,V> ou synchroniser les accès avec lock",
      explanation:
        "Dictionary<K,V> n'est pas conçu pour des écritures concurrentes non synchronisées : plusieurs threads modifiant la même table de hachage simultanément peuvent corrompre sa structure interne et lever des exceptions imprévisibles. ConcurrentDictionary ou un lock explicite résout ce problème.",
    },
    {
      question:
        "[Combo] Pourquoi les tests unitaires sont-ils généralement plus rapides à exécuter que les tests d'intégration, et pourquoi cette distinction impacte-t-elle la stratégie de test globale d'un projet C# ?",
      options: [
        "Les tests unitaires isolent le code via des mocks (pas d'I/O réelle : réseau, disque, DB), donc s'exécutent en mémoire pure ; les tests d'intégration impliquent de vraies dépendances plus lentes — on privilégie donc beaucoup de tests unitaires rapides et quelques tests d'intégration ciblés",
        "Les tests d'intégration sont toujours plus rapides car ils testent plus de choses en une fois",
        "Il n'y a aucune différence de vitesse entre les deux types de tests",
        "Les tests unitaires nécessitent toujours une vraie base de données pour fonctionner",
      ],
      answer: "Les tests unitaires isolent le code via des mocks (pas d'I/O réelle : réseau, disque, DB), donc s'exécutent en mémoire pure ; les tests d'intégration impliquent de vraies dépendances plus lentes — on privilégie donc beaucoup de tests unitaires rapides et quelques tests d'intégration ciblés",
      explanation:
        "C'est le principe de la 'pyramide des tests' : une large base de tests unitaires rapides (isolés, sans I/O) donne un retour immédiat, complétée par un nombre plus restreint de tests d'intégration plus lents mais qui valident le comportement réel bout en bout.",
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
        ? <h3 className="success">🚀 Excellent ! C# avancé maîtrisé.</h3>
        : <p className="fail">📚 Révisez les dictionnaires, les types de classes et le Garbage Collector.</p>
      }
    </div>
  );
};

const CSharpAvanceQCM = () => {
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
            C# Avancé 🔹 {level === "basic"
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

export default CSharpAvanceQCM;
