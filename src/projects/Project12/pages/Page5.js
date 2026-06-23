// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [

  // ==================== C# BASES ====================
  {
    question: "C# — Vue d'ensemble du langage",
    answer:
      "◆ **C#** : langage orienté objet, moderne, développé par Microsoft ◆ **Type-safe** : vérification stricte des types ◆ **Garbage Collector (GC)** : gestion automatique de la mémoire ◆ **LINQ** : requêtes intégrées au langage (Language Integrated Query) ◆ **Async/await** : programmation asynchrone native ◆ **Properties** : getters/setters simplifiés ◆ **Delegates & Events** : programmation événementielle ◆ **Exception handling** : try/catch/finally ⚠️ C# est un langage multi-paradigme (OOP, fonctionnel, impératif)",
  },
  // ==================== .NET vs .NET CORE ====================
  {
    question: ".NET Framework vs .NET Core vs .NET 5+",
    answer:
      "◆ **.NET Framework** : Windows uniquement, monolithique, legacy ◆ **.NET Core** : cross-platform (Windows, Linux, macOS), open-source, modulaire ◆ **.NET 5/6/7/8** : unification (.NET Core + .NET Framework), une seule plateforme ◆ **ASP.NET Core** : framework web cross-platform, moderne, performant ◆ **Entity Framework Core** : ORM cross-platform ◆ **Choix** : .NET Core/5+ pour les nouveaux projets, .NET Framework pour le legacy Windows ⚠️ .NET 6 est LTS (Long Term Support) — recommandé pour la production",
  },
  // ==================== ASP.NET CORE ====================
  {
    question: "ASP.NET Core — Framework web moderne",
    answer:
      "◆ **ASP.NET Core** : framework web cross-platform ◆ **MVC** : Modèle-Vue-Contrôleur ◆ **Razor Pages** : pages HTML avec C# intégré ◆ **Web API** : création d'APIs REST ◆ **Minimal APIs** : APIs légères (minimaliste) ◆ **Dependency Injection (DI)** : intégrée nativement ◆ **Middleware** : pipeline de traitement des requêtes ◆ **Configuration** : appsettings.json, variables d'environnement ◆ **Kestrel** : serveur web intégré, performant ⚠️ ASP.NET Core est plus rapide que ASP.NET (classique)",
  },
  // ==================== ENTITY FRAMEWORK ====================
  {
    question: "Entity Framework Core — ORM",
    answer:
      "◆ **EF Core** : ORM cross-platform ◆ **Code First** : créer les tables à partir des classes C# ◆ **Database First** : générer les classes à partir des tables existantes ◆ **Migrations** : gérer les évolutions du schéma ◆ **LINQ** : requêtes en C# traduites en SQL ◆ **DbContext** : point d'entrée vers la BDD ◆ **Relations** : One-to-Many, Many-to-Many, One-to-One ◆ **Lazy/Eager Loading** : chargement des relations ⚠️ EF Core 6+ supporte les tables SQL Server, PostgreSQL, MySQL, SQLite",
  },
  // ==================== DEPLOIEMENT ====================
  {
    question: "Déploiement .NET — Outils et processus",
    answer:
      "◆ **dotnet CLI** : outil en ligne de commande (dotnet build, dotnet run, dotnet publish) ◆ **NuGet** : gestionnaire de paquets (équivalent de pip/npm) ◆ **MSBuild** : système de build ◆ **Docker** : conteneurisation des applications .NET ◆ **Azure DevOps / GitHub Actions** : CI/CD ◆ **IIS** : serveur web Windows (legacy) ◆ **Kestrel** : serveur web cross-platform ◆ **App Service** : Azure PaaS pour .NET ⚠️ dotnet publish génère une version déployable prête pour la production",
  },
  // ==================== SYNCHRONE/ASYNCHRONE ====================
  {
    question: "Synchrone vs Asynchrone en C#",
    answer:
      "◆ **async/await** : programmation asynchrone native en C# ◆ **Task** : représente une opération asynchrone ◆ **ThreadPool** : pool de threads géré automatiquement ◆ **async Task** : méthode asynchrone qui retourne un résultat ◆ **async void** : méthode asynchrone sans retour (à éviter sauf événements) ◆ **await** : attend le résultat d'une Task sans bloquer le thread ◆ **ConfigureAwait(false)** : évite le marshalling vers le thread principal ◆ **I/O-bound** : asynchrone recommandé (BDD, API, réseau) ◆ **CPU-bound** : Task.Run() pour déléguer au ThreadPool ⚠️ await libère le thread pendant l'attente I/O, contrairement à .Wait() ou .Result qui bloquent",
  },
];

const questions = {
  moyen: [
    // ==================== C# BASES (6 questions) ====================
    {
      question:
        "[C#] Quel est le type de base pour les nombres entiers en C# ?",
      options: [
        "int (32 bits)",
        "Integer (type Java)",
        "Int32 (alias de int)",
        "long (64 bits pour les grands nombres)",
      ],
      answer: "int (32 bits)",
      explanation:
        "int est le type standard pour les entiers 32 bits en C#. C'est un alias de System.Int32. long est pour les 64 bits.",
    },
    {
      question:
        "[C#] Que signifie 'type-safe' en C# ?",
      options: [
        "Le code est sécurisé contre les erreurs de type à la compilation",
        "Le code n'utilise pas de variables",
        "Le code peut modifier les types à l'exécution",
        "Le code est écrit en minuscules",
      ],
      answer: "Le code est sécurisé contre les erreurs de type à la compilation",
      explanation:
        "C# est type-safe : le compilateur vérifie que les types sont compatibles. On ne peut pas assigner un string à un int sans conversion explicite. Cela évite beaucoup d'erreurs.",
    },
    {
      question:
        "[C#] Quelle est la syntaxe correcte pour une propriété avec getter/setter en C# ?",
      options: [
        "public string Nom { get; set; }",
        "public string get_Nom() / public void set_Nom(string value)",
        "public property string Nom { get; set; }",
        "string Nom { get; set; } // sans public",
      ],
      answer: "public string Nom { get; set; }",
      explanation:
        "Les propriétés auto-implémentées sont la syntaxe standard : public string Nom { get; set; }. C'est équivalent à un champ privé + getter/setter, mais plus concis.",
    },
    {
      question:
        "[C#] Quelle est la différence entre une classe (class) et une structure (struct) en C# ?",
      options: [
        "class est un type référence (heap), struct est un type valeur (stack)",
        "class est un type valeur, struct est un type référence",
        "Il n'y a pas de différence, ce sont des synonymes",
        "class ne peut pas avoir de méthodes, struct si",
      ],
      answer: "class est un type référence (heap), struct est un type valeur (stack)",
      explanation:
        "class : type référence, alloué sur le heap, avec garbage collection. struct : type valeur, alloué sur la stack (ou inline), plus léger. Les structs sont idéaux pour les petits objets immutables.",
    },
    {
      question:
        "[C#] Quelle est la syntaxe pour une méthode qui ne retourne rien (void) ?",
      options: [
        "public void MaMethode() { }",
        "public null MaMethode() { }",
        "public void MaMethode() -> { }",
        "public nothing MaMethode() { }",
      ],
      answer: "public void MaMethode() { }",
      explanation:
        "void indique qu'une méthode ne retourne aucune valeur. C'est l'équivalent de 'None' en Python ou 'void' en C/C++. Les méthodes void peuvent utiliser return; sans valeur.",
    },
    {
      question:
        "[C#] Qu'est-ce que le Garbage Collector (GC) en C# ?",
      options: [
        "Un outil de nettoyage de code",
        "Un mécanisme automatique de gestion de la mémoire (libère les objets inutilisés)",
        "Un compilateur C#",
        "Un outil de profiling",
      ],
      answer: "Un mécanisme automatique de gestion de la mémoire (libère les objets inutilisés)",
      explanation:
        "Le Garbage Collector gère automatiquement la mémoire. Il libère les objets qui ne sont plus utilisés. On n'a pas besoin de free/delete comme en C++. C'est l'un des avantages de C#.",
    },

    // ==================== .NET vs .NET CORE (4 questions) ====================
    {
      question:
        "[.NET] Quelle est la principale différence entre .NET Framework et .NET Core ?",
      options: [
        ".NET Framework est cross-platform, .NET Core est Windows uniquement",
        ".NET Framework est Windows uniquement, .NET Core est cross-platform",
        ".NET Framework est open-source, .NET Core est propriétaire",
        "Il n'y a pas de différence",
      ],
      answer: ".NET Framework est Windows uniquement, .NET Core est cross-platform",
      explanation:
        ".NET Framework : Windows uniquement, monolithique, legacy. .NET Core : cross-platform (Windows, Linux, macOS), open-source, modulaire. C'est la différence fondamentale.",
    },
    {
      question:
        "[.NET] Quelle version de .NET est la plus récente avec LTS (Long Term Support) ?",
      options: [
        ".NET Framework 4.8",
        ".NET Core 3.1",
        ".NET 6 (LTS)",
        ".NET 5 (non-LTS)",
      ],
      answer: ".NET 6 (LTS)",
      explanation:
        ".NET 6 est la version LTS la plus récente (supportée jusqu'en 2024). .NET 8 est la version LTS la plus récente actuellement. .NET 5 n'est pas LTS, .NET Core 3.1 est en fin de vie.",
    },
    {
      question:
        "[.NET] Quel framework web utilise-t-on avec .NET Core/5+ pour des APIs REST ?",
      options: [
        "ASP.NET Core (moderne, cross-platform)",
        "ASP.NET (classique, Windows uniquement)",
        "MVC 5 (Windows uniquement)",
        "WebForms (legacy, Windows)",
      ],
      answer: "ASP.NET Core (moderne, cross-platform)",
      explanation:
        "ASP.NET Core est le framework web moderne pour .NET Core/5+. Il est cross-platform, performant, et supporte les APIs REST, MVC, Razor Pages, Minimal APIs. ASP.NET classique est Windows uniquement.",
    },
    {
      question:
        "[.NET] Quel est l'équivalent C# de pip (Python) ou npm (Node.js) ?",
      options: [
        "pip.net",
        "NuGet",
        "npm",
        "dotnet install",
      ],
      answer: "NuGet",
      explanation:
        "NuGet est le gestionnaire de paquets pour .NET (équivalent de pip pour Python ou npm pour Node.js). On installe des paquets avec dotnet add package NomDuPaquet.",
    },

    // ==================== ASP.NET CORE (4 questions) ====================
    {
      question:
        "[ASP.NET] Qu'est-ce que la Dependency Injection (DI) dans ASP.NET Core ?",
      options: [
        "Un outil de débogage",
        "Un système intégré pour injecter les dépendances (services) dans les classes",
        "Un ORM pour la base de données",
        "Un serveur web",
      ],
      answer: "Un système intégré pour injecter les dépendances (services) dans les classes",
      explanation:
        "La DI est intégrée nativement dans ASP.NET Core. On enregistre les services dans le conteneur (AddScoped, AddSingleton, AddTransient), et ils sont injectés automatiquement dans les constructeurs.",
    },
    {
      question:
        "[ASP.NET] Quel est le rôle des Middlewares dans ASP.NET Core ?",
      options: [
        "Gérer les requêtes HTTP dans une pipeline (authentification, logging, etc.)",
        "Créer les tables de la base de données",
        "Compiler le code C#",
        "Gérer les migrations",
      ],
      answer: "Gérer les requêtes HTTP dans une pipeline (authentification, logging, etc.)",
      explanation:
        "Les Middlewares forment une pipeline de traitement des requêtes HTTP. Chaque middleware peut traiter la requête, la modifier, ou passer à la suite. Ex : authentification, logging, compression, etc.",
    },
    {
      question:
        "[ASP.NET] Quel serveur web utilise ASP.NET Core par défaut ?",
      options: [
        "IIS (Internet Information Services)",
        "Kestrel (serveur cross-platform, performant)",
        "Apache",
        "Nginx",
      ],
      answer: "Kestrel (serveur cross-platform, performant)",
      explanation:
        "Kestrel est le serveur web intégré d'ASP.NET Core. Il est cross-platform, performant, et peut être utilisé seul ou derrière un reverse proxy (Nginx, IIS).",
    },
    {
      question:
        "[ASP.NET] Quelle est la syntaxe pour une Minimal API simple en ASP.NET Core ?",
      options: [
        "app.MapGet('/hello', () => 'Hello World!');",
        "app.Route('/hello', () => 'Hello World!');",
        "app.Get('/hello', () => 'Hello World!');",
        "app.Use('/hello', () => 'Hello World!');",
      ],
      answer: "app.MapGet('/hello', () => 'Hello World!');",
      explanation:
        "Minimal APIs utilisent app.MapGet, app.MapPost, etc. avec des lambdas. C'est la syntaxe minimaliste introduite dans .NET 6 pour des APIs légères.",
    },

    // ==================== ENTITY FRAMEWORK (4 questions) ====================
    {
      question:
        "[EF Core] Qu'est-ce que DbContext dans Entity Framework Core ?",
      options: [
        "Une classe qui représente la base de données, point d'entrée pour les requêtes",
        "Une table de la base de données",
        "Une colonne de la base de données",
        "Une classe de migration",
      ],
      answer: "Une classe qui représente la base de données, point d'entrée pour les requêtes",
      explanation:
        "DbContext est la classe principale d'EF Core. Elle représente la base de données. Elle contient les DbSet<T> qui représentent les tables. C'est le point d'entrée pour toutes les requêtes.",
    },
    {
      question:
        "[EF Core] Qu'est-ce qu'une migration en Entity Framework Core ?",
      options: [
        "Un déplacement de données d'une table à une autre",
        "Un moyen de gérer l'évolution du schéma de la base de données (ajout/modification de tables/colonnes)",
        "Une copie de sauvegarde de la base de données",
        "Un index sur une colonne",
      ],
      answer: "Un moyen de gérer l'évolution du schéma de la base de données (ajout/modification de tables/colonnes)",
      explanation:
        "Les migrations permettent de versionner le schéma BDD. dotnet ef migrations add NomMigration crée une migration. dotnet ef database update applique la migration. C'est l'équivalent d'Alembic pour SQLAlchemy.",
    },
    {
      question:
        "[EF Core] Comment définit-on une relation One-to-Many en EF Core ?",
      options: [
        "public List<Enfant> Enfants { get; set; } dans la classe parent",
        "public ICollection<Enfant> Enfants { get; set; } (navigation property)",
        "Utiliser ForeignKey attribute",
        "Toutes les réponses sont des façons correctes",
      ],
      answer: "Toutes les réponses sont des façons correctes",
      explanation:
        "On définit une collection de navigation (ICollection<Enfant>), et la propriété de clé étrangère dans l'enfant. On peut utiliser des annotations [ForeignKey] ou la convention de nommage.",
    },
    {
      question:
        "[EF Core] Quelle commande dotnet est utilisée pour créer une migration ?",
      options: [
        "dotnet ef migrations add NomMigration",
        "dotnet ef database update",
        "dotnet ef migration create NomMigration",
        "dotnet add migration NomMigration",
      ],
      answer: "dotnet ef migrations add NomMigration",
      explanation:
        "dotnet ef migrations add NomMigration crée une nouvelle migration. dotnet ef database update applique les migrations. Il faut d'abord installer dotnet ef (dotnet tool install --global dotnet-ef).",
    },

    // ==================== DEPLOIEMENT (3 questions) ====================
    {
      question:
        "[Déploiement] Quelle commande dotnet génère une version déployable prête pour la production ?",
      options: [
        "dotnet build (construit l'application)",
        "dotnet run (exécute en développement)",
        "dotnet publish (génère une version déployable)",
        "dotnet deploy (commande inexistante)",
      ],
      answer: "dotnet publish (génère une version déployable)",
      explanation:
        "dotnet publish génère les fichiers prêts pour le déploiement. On peut spécifier la configuration (Release) et le runtime. Les fichiers sont dans le dossier bin/Release/netX.x/publish.",
    },
    {
      question:
        "[Déploiement] Comment exécute-t-on une application .NET Core/5+ dans un conteneur Docker ?",
      options: [
        "Dockerfile avec FROM mcr.microsoft.com/dotnet/aspnet:6.0 (base image) + COPY publish/ app/ + ENTRYPOINT",
        "Dockerfile avec FROM microsoft/dotnet:latest",
        "Docker ne supporte pas .NET",
        "Il faut utiliser Windows containers uniquement",
      ],
      answer: "Dockerfile avec FROM mcr.microsoft.com/dotnet/aspnet:6.0 (base image) + COPY publish/ app/ + ENTRYPOINT",
      explanation:
        "Les images .NET officielles sont sur mcr.microsoft.com/dotnet/aspnet pour la runtime (production) et mcr.microsoft.com/dotnet/sdk pour le build. .NET Core/5+ tourne parfaitement en Linux containers.",
    },
    {
      question:
        "[Déploiement] Quel service Azure est idéal pour héberger une application ASP.NET Core ?",
      options: [
        "Azure Virtual Machines (IaaS, lourd)",
        "Azure App Service (PaaS, gestion automatique)",
        "Azure Kubernetes Service (AKS, orchestré)",
        "Azure Functions (serverless pour APIs simples)",
      ],
      answer: "Azure App Service (PaaS, gestion automatique)",
      explanation:
        "Azure App Service est le service PaaS pour héberger des applications web .NET. Il gère automatiquement le scaling, les déploiements, les certificats SSL. C'est le choix standard pour ASP.NET Core sur Azure.",
    },

    // ==================== SYNCHRONE/ASYNCHRONE (4 questions) ====================
    {
      question:
        "[Async] Quel mot-clé C# est utilisé pour définir une méthode asynchrone ?",
      options: [
        "async (indique une méthode asynchrone)",
        "await (attend un résultat asynchrone)",
        "Task (type de retour asynchrone)",
        "async await (les deux ensemble)",
      ],
      answer: "async (indique une méthode asynchrone)",
      explanation:
        "async est utilisé pour déclarer une méthode asynchrone. La méthode doit retourner Task, Task<T>, ou void (pour les événements). await est utilisé à l'intérieur pour attendre des résultats asynchrones.",
    },
    {
      question:
        "[Async] Que retourne une méthode async qui ne renvoie pas de valeur (void) ?",
      options: [
        "void (à éviter sauf événements)",
        "Task (recommandé pour la plupart des cas)",
        "Task<void> (équivalent à Task)",
        "None (comme en Python)",
      ],
      answer: "Task (recommandé pour la plupart des cas)",
      explanation:
        "Une méthode async qui ne retourne pas de valeur devrait retourner Task (recommandé) ou void (à éviter sauf pour les gestionnaires d'événements). Task permet d'attendre et de gérer les exceptions.",
    },
    {
      question:
        "[Async] Que se passe-t-il si on utilise .Result ou .Wait() sur une Task ?",
      options: [
        "L'opération s'exécute de manière asynchrone sans blocage",
        "Le thread courant est bloqué jusqu'à la fin de l'opération (risque de deadlock)",
        "L'opération est annulée",
        "L'opération est exécutée sur un autre thread",
      ],
      answer: "Le thread courant est bloqué jusqu'à la fin de l'opération (risque de deadlock)",
      explanation:
        ".Result et .Wait() bloquent le thread courant. Cela peut causer des deadlocks (si le thread UI attend une Task qui attend le retour sur le thread UI). Il faut préférer await.",
    },
    {
      question:
        "[Async] Dans un contexte web ASP.NET Core, que fait ConfigureAwait(false) ?",
      options: [
        "Configure la méthode pour échouer",
        "Indique que la continuation n'a pas besoin de retourner au contexte d'origine (meilleure performance)",
        "Configure la méthode pour être synchrone",
        "Configure le timeout de la méthode",
      ],
      answer: "Indique que la continuation n'a pas besoin de retourner au contexte d'origine (meilleure performance)",
      explanation:
        "ConfigureAwait(false) évite le marshalling vers le contexte d'origine (SynchronizationContext). Dans ASP.NET Core (sans context UI), c'est souvent inutile mais bon pour la performance. Dans WPF/WinForms, c'est important pour éviter les deadlocks.",
    },
  ],
  avance: [
    // ==================== C# AVANCE ====================
    {
      question:
        "[Avancé] Quelle est la différence entre ICollection<T>, IList<T> et IEnumerable<T> ?",
      options: [
        "ICollection<T> est un ensemble, IList<T> est une liste, IEnumerable<T> est une collection énumérable",
        "IEnumerable<T> est le plus bas niveau (énumération), ICollection<T> ajoute Count/Add/Remove, IList<T> ajoute l'accès par index",
        "IList<T> est un ensemble, ICollection<T> est une liste",
        "Il n'y a pas de différence",
      ],
      answer: "IEnumerable<T> est le plus bas niveau (énumération), ICollection<T> ajoute Count/Add/Remove, IList<T> ajoute l'accès par index",
      explanation:
        "IEnumerable<T> : énumération seule (foreach). ICollection<T> : ajoute Count, Add, Remove, Clear. IList<T> : ajoute l'accès par index (this[int index]). Plus une interface est haute, plus elle a de fonctionnalités.",
    },
    {
      question:
        "[Avancé] En Entity Framework Core, quelle option de chargement des relations est la plus efficace pour éviter le N+1 problem ?",
      options: [
        "Lazy Loading (chargement à l'accès, cause le N+1)",
        "Eager Loading (chargement anticipé avec Include/ThenInclude, une seule requête avec jointure)",
        "Explicit Loading (chargement manuel)",
        "Aucune, le N+1 n'existe pas en EF Core",
      ],
      answer: "Eager Loading (chargement anticipé avec Include/ThenInclude, une seule requête avec jointure)",
      explanation:
        "Eager Loading (.Include() / .ThenInclude()) charge les relations en une seule requête (ou en quelques requêtes). Cela évite le N+1 problem. Lazy Loading charge à la première utilisation, causant N requêtes supplémentaires.",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre AddTransient, AddScoped et AddSingleton en DI ASP.NET Core ?",
      options: [
        "AddTransient = nouvelle instance à chaque injection, AddScoped = même instance par requête, AddSingleton = une seule instance pour toute l'application",
        "AddTransient = singleton, AddScoped = transient, AddSingleton = scoped",
        "AddTransient = même instance par requête, AddScoped = nouvelle instance à chaque injection",
        "Tous sont équivalents",
      ],
      answer: "AddTransient = nouvelle instance à chaque injection, AddScoped = même instance par requête, AddSingleton = une seule instance pour toute l'application",
      explanation:
        "Transient : nouvelle instance à chaque fois. Scoped : même instance pendant la durée d'une requête HTTP. Singleton : une seule instance pour toute l'application. C'est essentiel pour la DI.",
    },
    {
      question:
        "[Avancé] En C#, quelle est la différence entre `int?` et `int` ?",
      options: [
        "int? est nullable (peut être null), int ne peut pas être null",
        "int est nullable, int? ne l'est pas",
        "int? est un type valeur, int est un type référence",
        "Il n'y a pas de différence",
      ],
      answer: "int? est nullable (peut être null), int ne peut pas être null",
      explanation:
        "int? est la syntaxe pour int? = Nullable<int> (peut être null). int est non-nullable. C'est utile pour les champs de BDD qui peuvent être NULL. En C# 8+, on peut aussi utiliser int? pour les références nullables.",
    },

    // ==================== .NET AVANCE ====================
    {
      question:
        "[Avancé] Qu'est-ce que le 'middleware' dans ASP.NET Core ?",
      options: [
        "Un composant dans la pipeline de traitement des requêtes HTTP",
        "Une base de données intermédiaire",
        "Un ORM léger",
        "Un serveur web alternatif",
      ],
      answer: "Un composant dans la pipeline de traitement des requêtes HTTP",
      explanation:
        "Un middleware est un composant qui traite les requêtes HTTP dans une pipeline. Chaque middleware peut traiter la requête, la modifier, ou passer à la suite. Ex : authentification, logging, compression, etc.",
    },
    {
      question:
        "[Avancé] En EF Core, qu'est-ce que le mode 'NoTracking' ?",
      options: [
        "Désactive le suivi des changements (meilleure performance pour les lectures)",
        "Active le suivi des changements (par défaut)",
        "Supprime les données de la base",
        "Bloque les requêtes",
      ],
      answer: "Désactive le suivi des changements (meilleure performance pour les lectures)",
      explanation:
        "AsNoTracking() désactive le suivi des entités par le DbContext. Les entités ne sont pas suivies, donc les modifications ne seront pas sauvegardées. C'est plus performant pour les lectures (requêtes en lecture seule).",
    },
  ],
  expert: [
    // ==================== PIEGES ====================
    {
      question:
        "[PIÈGE] Quelle est la différence entre .NET Core et .NET 5/6/7/8 ?",
      options: [
        ".NET Core est la version 3.x, .NET 5+ est la continuation (unification)",
        ".NET Core est Windows, .NET 5 est Linux",
        ".NET Core est plus récent que .NET 5",
        "Ce sont des noms différents pour la même chose",
      ],
      answer: ".NET Core est la version 3.x, .NET 5+ est la continuation (unification)",
      explanation:
        ".NET Core 3.1 était la dernière version de .NET Core. .NET 5 est la continuation qui unifie .NET Core et .NET Framework. .NET 6 est LTS, .NET 7 est STS, .NET 8 est LTS. On dit maintenant .NET, pas .NET Core.",
    },
    {
      question:
        "[PIÈGE] En C#, que se passe-t-il si on ne gère pas une exception (try/catch) ?",
      options: [
        "L'exception est automatiquement gérée par le Garbage Collector",
        "L'exception remonte jusqu'à ce qu'elle soit capturée, sinon l'application plante",
        "L'exception est ignorée silencieusement",
        "L'exception est convertie en erreur de compilation",
      ],
      answer: "L'exception remonte jusqu'à ce qu'elle soit capturée, sinon l'application plante",
      explanation:
        "Si une exception n'est pas capturée, elle remonte la pile des appels. Si elle atteint le niveau supérieur (Main) sans être capturée, l'application plante. Il faut donc gérer les exceptions.",
    },
    {
      question:
        "[PIÈGE] Pourquoi dit-on que 'async/await est contagieux' en C# ?",
      options: [
        "async/await se propage comme un virus dans le code",
        "async/await oblige toutes les méthodes appelantes à devenir async (ou à utiliser .Result/.Wait())",
        "async/await est une maladie du code",
        "async/await est utilisé uniquement dans les frameworks",
      ],
      answer: "async/await oblige toutes les méthodes appelantes à devenir async (ou à utiliser .Result/.Wait())",
      explanation:
        "async/await est 'contagieux' : si une méthode async appelle une méthode async, elle doit être async aussi (ou utiliser .Result/.Wait(), ce qui bloque). C'est un choix architectural important.",
    },
  ],
};

const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${keyPrefix}-${idx}`} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return (
      <code key={`${keyPrefix}-${idx}`} style={{ display: 'inline', backgroundColor: '#eef2f7', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', color: '#e01e5a', fontWeight: 'bold', fontSize: '13px' }}>
        {part.slice(1, -1)}
      </code>
    );
    if (part.startsWith("*") && part.endsWith("*")) return <em key={`${keyPrefix}-${idx}`} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;
  let cleanText = text
    .replace(/\r?\n- /g, " ◆ ").replace(/\r?\n• /g, " ◆ ").replace(/\r?\n/g, " ")
    .replace(/\.-\s*\*\*/g, " ◆ **").replace(/-\s*\*\*/g, " ◆ **");
  if (cleanText.startsWith(" ◆ ")) cleanText = cleanText.substring(3);
  if (cleanText.startsWith("- ")) cleanText = cleanText.substring(2);
  const segments = cleanText.split(" ◆ ");
  return (
    <span style={{ display: 'block', lineHeight: '1.7' }}>
      {segments.map((segment, segIdx) => (
        <span key={segIdx} style={{ display: 'block', marginBottom: segIdx < segments.length - 1 ? '6px' : '0' }}>
          {segIdx > 0 && <span style={{ color: '#1a73e8', fontWeight: 'bold', marginRight: '5px' }}>◆</span>}
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
        ? <h3 className="success">🚀 Fondations Microservices / JSON / async / LINQ maîtrisées !</h3>
        : <p className="fail">📚 Révisez les slides — focus sur les points de confusion marqués ⚠️.</p>}
    </div>
  );
};

const MicroservicesFoundationsQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") setLevel("avance");
      else if (level === "avance") setLevel("expert");
      else setShowResult(true);
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen"); setCurrentQuestion(0); setTimeLeft(25); return 0;
        });
      }, 20000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
    const current = questions[level][currentQuestion];
    if (option === current.answer) { setScores(p => ({ ...p, [level]: p[level] + 1 })); setMessage("✅ Correct !"); }
    else { setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`); }
    setTimeout(handleNextQuestion, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            Microservices · JSON · MSMQ · async · LINQ 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {level === "basic"
            ? <Flashcard slide={basicSlides[currentSlide]} />
            : <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default MicroservicesFoundationsQCM;
