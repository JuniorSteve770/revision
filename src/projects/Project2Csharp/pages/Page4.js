// src/projects/Project1/pages/Page3.js
import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

  {
    "question": "REST vs SOAP - Avantages clés & cas d'usage",
    "answer": "REST : Simple, scalable (JSON/HTTP). Ex: APIs web/mobile.\nSOAP : Sécurité/contrats stricts (XML/WSDL). Ex: banque/santé."
  },
  {
    "question": "HTTP/2 - 3 optimisations majeures vs HTTP/1.1",
    "answer": "1) Multiplexage (requêtes parallèles)\n2) Compression headers\n3) Server push (pré-chargement ressources)."
  },
  {
    "question": "GraphQL - Problème résolu & limite principale",
    "answer": "+ Évite over/under-fetching (requêtes sur-mesure)\n- Risque de N+1 queries (solution: Dataloader)."
  },
  {
    "question": "REST + HTTP/2 - Synergie clé",
    "answer": "HTTP/2 compense les faiblesses de REST (latence multiples appels) via le multiplexage. Ex: app mobile avec nombreux endpoints."
  },
  {
    "question": "SOAP vs GraphQL - Format données & flexibilité",
    "answer": "SOAP : XML rigide (WSDL obligatoire)\nGraphQL : JSON flexible (schéma client-driven)."
  },
  {
    "question": "C# et SDK .NET | Définition et utilisation",
    "answer": "C# : Langage orienté objet moderne (Microsoft) pour web, desktop, mobile, cloud et jeux (Unity). SDK .NET : Outils incluant compilateur C#, bibliothèques et CLI pour compiler/exécuter du code."
  },
  {
    "question": "Commandes CLI .NET essentielles | Création et exécution",
    "answer": "Créer un projet : `dotnet new console -n MonProjet`. Exécuter : `dotnet run`."
  },
  {
    "question": "Environnements de développement & types d'applications en C#",
    "answer": "IDE : Visual Studio (complet) ou VS Code (léger). Applications possibles : console, web (ASP.NET), API, mobile (Xamarin), jeux (Unity)."
  },
  {
    "question": "Dates et énumérations en C# | Utilisation",
    "answer": "Dates : `DateTime.Now.AddDays(7)`. Enums : ensemble de constantes nommées (`enum Jours {Lundi, Mardi}`)."
  },
  {
    "question": "Projets pratiques en console | Exercices",
    "answer": "1. Calculatrice : `switch` pour opérations. 2. TODO list : `List<string>` pour gérer tâches."
  },
  {
    "question": "POO en C# | Classes et objets",
    "answer": "Classe : blueprint (modèle). Objet : instance d'une classe. Exemple : `Voiture v = new Voiture();`."
  },
  {
    "question": "Encapsulation en C# | Getters/Setters",
    "answer": "Protéger les données via propriétés : `public int Age {get; set;}` (meilleur que champs publics)."
  },
  {
    "question": "Héritage et polymorphisme | Concepts clés",
    "answer": "Héritage : `class Enfant : Parent`. Polymorphisme : `override` pour redéfinir des méthodes."
  },
  {
    "question": "Interfaces et génériques | Réutilisabilité",
    "answer": "Interface : contrat (`class MaClasse : IInterface`). Génériques : `List<T>` pour types flexibles."
  },
  {
    "question": "Types valeur vs référence | Différences",
    "answer": "Valeur : `int` (pile). Référence : `class` (tas). Comportement différent à l'affectation."
  },
  {
    "question": "SOLID et bonnes pratiques | Qualité du code",
    "answer": "SOLID : 5 principes de conception (ex: Single Responsibility). Conventions : PascalCase (classes), camelCase (variables)."
  },
  {
    "question": "Tests et documentation | Maintenance",
    "answer": "Tests unitaires : valider chaque composant. Commentaires XML : générer une documentation automatique."
  },
  {
    "question": "Délégués et événements | Programmation événementielle",
    "answer": "Délégué : référence vers méthode (`delegate void Action(string)`). Événement : notification basée sur délégué."
  },
  {
    "question": "Méthodes d'extension et tuples | Syntaxe moderne",
    "answer": "Extensions : ajouter des méthodes à des types existants (`this string`). Tuples : `(string nom, int age) = (\"Alice\", 30);`."
  },
  {
    "question": "Programmation asynchrone | async/await",
    "answer": "Exécuter des tâches longues sans bloquer : `await Task.Delay(1000);`. Essentiel pour les appels réseau."
  },
  {
    "question": "Accès aux données | ORM et SQL",
    "answer": "ADO.NET : accès direct SQL. Entity Framework : ORM pour mapper objets/tables. LINQ : requêtes intégrées au langage."
  },
  {
    "question": "Interfaces graphiques | WinForms vs WPF",
    "answer": "WinForms : simple (boutons/événements). WPF : moderne (XAML, databinding). Exemple : `<Button Click=\"Handler\">`."
  },
  {
    "question": "API REST avec ASP.NET Core | Création",
    "answer": "Contrôleurs + routes : `[HttpGet] public IActionResult Get()`. DTOs pour échanges structurés."
  },
  {
    "question": "Projet structuré | Organisation",
    "answer": "Couches : Présentation (UI), Métier (logique), Accès données (DB). Injection de dépendances pour modularité."
  },

  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     {
    "question": "Quel est l'avantage principal de REST par rapport à SOAP ?",
    "options": [
      "Meilleure sécurité avec WSDL",
      "Support natif des transactions ACID",
      "Simplicité et compatibilité avec le caching HTTP",
      "Requêtes en XML strict"
    ],
    "answer": "Simplicité et compatibilité avec le caching HTTP",
    "explanation": "REST utilise JSON/HTTP, ce qui le rend plus léger et scalable que SOAP (basé sur XML). Son stateless nature permet aussi un caching efficace."
  },
  {
    "question": "Quelle fonctionnalité de HTTP/2 réduit la latence des APIs REST ?",
    "options": [
      "Le format XML",
      "Le multiplexage (multiplexing)",
      "Les schémas WSDL",
      "Les subscriptions GraphQL"
    ],
    "answer": "Le multiplexage (multiplexing)",
    "explanation": "HTTP/2 permet d'envoyer plusieurs requêtes en parallèle sur une même connexion, réduisant la latence des apps avec nombreux appels REST (ex: mobile)."
  },
  {
    "question": "Pourquoi GraphQL évite-t-il l'over-fetching ?",
    "options": [
      "Il impose un format XML",
      "Le client demande uniquement les champs nécessaires",
      "Il utilise exclusivement HTTP/1.1",
      "Il génère automatiquement un WSDL"
    ],
    "answer": "Le client demande uniquement les champs nécessaires",
    "explanation": "Contrairement à REST (réponses prédéfinies), GraphQL permet des requêtes sur-mesure, optimisant le transfert de données."
  },
  {
    "question": "Dans quel cas privilégier SOAP plutôt que GraphQL ?",
    "options": [
      "Pour une API mobile avec faible bande passante",
      "Pour un système bancaire nécessitant des contrats stricts (WSDL)",
      "Pour une application temps-réel avec subscriptions",
      "Pour une API publique simple à documenter"
    ],
    "answer": "Pour un système bancaire nécessitant des contrats stricts (WSDL)",
    "explanation": "SOAP excelle dans les environnements enterprise où la sécurité (WS-Security) et les contrats rigides (WSDL) sont critiques (ex: transactions financières)."
  },
  {
    "question": "Quel outil résout le problème N+1 de GraphQL ?",
    "options": [
      "Postman",
      "Dataloader",
      "Swagger",
      "SOAP UI"
    ],
    "answer": "Dataloader",
    "explanation": "Dataloader regroupe (batching) et cache les requêtes pour éviter les appels redondants lors de la résolution de champs imbriqués."
  },
  {
    "question": "Quelle technologie utilise exclusivement XML ?",
    "options": [
      "REST",
      "GraphQL",
      "SOAP",
      "HTTP/2"
    ],
    "answer": "SOAP",
    "explanation": "SOAP impose le XML pour les requêtes/réponses et s'appuie sur WSDL pour décrire l'API, contrairement à REST/GraphQL (flexibles)."
  },
  {
    "question": "Quelle amélioration HTTP/2 bénéficie directement à REST ?",
    "options": [
      "Les subscriptions temps-réel",
      "Le server push (pré-chargement des ressources)",
      "Le support natif de GraphQL",
      "L'élimination du besoin de caching"
    ],
    "answer": "Le server push (pré-chargement des ressources)",
    "explanation": "HTTP/2 permet au serveur d'envoyer des ressources anticipées (ex: CSS/JS), réduisant les allers-retours pour les apps REST classiques."
  },
  {
    "question": "Quel est un désavantage de GraphQL ?",
    "options": [
      "Impossible à utiliser avec HTTP/2",
      "Requêtes complexes peuvent surcharger le serveur",
      "Nécessite obligatoirement un WSDL",
      "Limitée aux APIs enterprise"
    ],
    "answer": "Requêtes complexes peuvent surcharger le serveur",
    "explanation": "Des requêtes imbriquées (ex: récursives) ou mal optimisées (N+1) peuvent impacter les performances, d'où l'importance de outils comme Dataloader."
  },
  {
    "question": "Quelle combinaison est idéale pour une API mobile ?",
    "options": [
      "SOAP + XML",
      "REST + HTTP/1.1",
      "GraphQL + HTTP/2",
      "WSDL + Dataloader"
    ],
    "answer": "GraphQL + HTTP/2",
    "explanation": "GraphQL minimise le traffic (idéal pour mobile) et HTTP/2 améliore les performances avec le multiplexage, même sur réseaux lents."
  },
  {
    "question": "Quelle technologie est associée à 'stateless' et 'resource-based' ?",
    "options": [
      "SOAP",
      "GraphQL",
      "REST",
      "WSDL"
    ],
    "answer": "REST",
    "explanation": "REST repose sur des ressources (URLs) et est stateless : chaque requête contient toutes les infos nécessaires, simplifiant la scalabilité."
  },
    {
        "question": "Quelle est la sortie du code suivant ?\n\n```csharp\nint x = 10;\nint y = x;\ny = 20;\nConsole.WriteLine(x);```",
        "options": [
          "10",
          "20",
          "Erreur de compilation",
          "Null"
        ],
        "answer": "10",
        "explanation": "Les types valeur (comme int) sont copiés par valeur. Modifier 'y' ne change pas 'x'."
      },
      {
        "question": "Quelle est la sortie du code suivant ?\n\n```csharp\npublic class Personne {\n    public string Nom { get; set; }\n}\n\nPersonne p1 = new Personne { Nom = \"Alice\" };\nPersonne p2 = p1;\np2.Nom = \"Bob\";\nConsole.WriteLine(p1.Nom);```",
        "options": [
          "Alice",
          "Bob",
          "Erreur de compilation",
          "Null"
        ],
        "answer": "Bob",
        "explanation": "Les types référence (comme les classes) partagent la même référence en mémoire. Modifier 'p2' affecte également 'p1'."
      },
      {
        "question": "Quelle méthode implémente correctement l'encapsulation pour une propriété privée ?\n\n```csharp\n// Option 1\npublic class Compte {\n    private double solde;\n    public double GetSolde() => solde;\n    public void SetSolde(double value) => solde = value;\n}\n\n// Option 2\npublic class Compte {\n    public double Solde { get; private set; }\n}\n\n// Option 3\npublic class Compte {\n    public double Solde { get; set; }\n}```",
        "options": [
          "Option 1",
          "Option 2",
          "Option 3",
          "Aucune des options"
        ],
        "answer": "Option 2",
        "explanation": "L'encapsulation est mieux réalisée avec des propriétés auto-implémentées ayant un accesseur privé ('private set'), garantissant un contrôle sur les modifications."
      },
      {
        "question": "Quelle est la sortie du code suivant ?\n\n```csharp\npublic abstract class Animal {\n    public virtual void Parler() {\n        Console.WriteLine(\"Animal parle\");\n    }\n}\n\npublic class Chien : Animal {\n    public override void Parler() {\n        Console.WriteLine(\"Chien aboie\");\n    }\n}\n\nAnimal monAnimal = new Chien();\nmonAnimal.Parler();```",
        "options": [
          "Animal parle",
          "Chien aboie",
          "Erreur de compilation",
          "Null"
        ],
        "answer": "Chien aboie",
        "explanation": "Le polymorphisme permet à la méthode 'Parler' de la classe dérivée (Chien) de remplacer celle de la classe de base (Animal)."
      },
      {
        "question": "Quelle interface doit être implémentée pour créer une collection personnalisée énumérable en C# ?\n\n```csharp\npublic class MaCollection<T> : ??? {\n    // Implémentation ici\n}```",
        "options": [
          "`IEnumerable<T>`",
          "`ICollection<T>`",
          "`IList<T>`",
          "`IDisposable`"
        ],
        "answer": "`IEnumerable<T>`",
        "explanation": "Pour rendre une collection énumérable, il faut implémenter l'interface `IEnumerable<T>`, qui permet l'utilisation de boucles `foreach`."
      },
      {
        "question": "Quelle est la meilleure façon d'injecter une dépendance dans une classe en C# ?\n\n```csharp\n// Option 1\npublic class Service {\n    private readonly ILogger logger;\n    public Service(ILogger logger) {\n        this.logger = logger;\n    }\n}\n\n// Option 2\npublic class Service {\n    private static readonly ILogger logger = new ConsoleLogger();\n}```",
        "options": [
          "Option 1",
          "Option 2",
          "Les deux sont équivalentes",
          "Aucune des options"
        ],
        "answer": "Option 1",
        "explanation": "L'injection de dépendances via le constructeur (Option 1) favorise la modularité et la testabilité, contrairement à l'instanciation directe (Option 2)."
      },
      {
        "question": "Quelle est la sortie du code suivant ?\n\n```csharp\npublic class Boite<T> {\n    public T Contenu { get; set; }\n}\n\nBoite<int> boiteEntier = new Boite<int>();\nboiteEntier.Contenu = 42;\nConsole.WriteLine(boiteEntier.Contenu);```",
        "options": [
          "42",
          "Erreur de compilation",
          "Null",
          "Boite`1"
        ],
        "answer": "42",
        "explanation": "Les types génériques permettent de créer des classes réutilisables pour différents types. Ici, `Boite<int>` stocke un entier."
      },
      {
        "question": "Quelle est la différence entre les deux méthodes suivantes ?\n\n```csharp\npublic void Afficher(string message) {\n    Console.WriteLine(message);\n}\n\npublic void Afficher(object message) {\n    Console.WriteLine(message.ToString());\n}```",
        "options": [
          "Aucune différence",
          "La première méthode est spécifique aux chaînes, la deuxième accepte tout type",
          "La première méthode est plus rapide",
          "La deuxième méthode provoque une erreur de compilation"
        ],
        "answer": "La première méthode est spécifique aux chaînes, la deuxième accepte tout type",
        "explanation": "La surcharge de méthodes permet de définir plusieurs versions d'une méthode avec des paramètres différents. La deuxième méthode accepte n'importe quel type grâce au type 'object'."
      },
      {
        "question": "Quelle est la sortie du code suivant ?\n\n```csharp\npublic interface IVolant {\n    void Voler();\n}\n\npublic class Avion : IVolant {\n    public void Voler() {\n        Console.WriteLine(\"Avion vole\");\n    }\n}\n\nIVolant volant = new Avion();\nvolant.Voler();```",
        "options": [
          "Avion vole",
          "Erreur de compilation",
          "Null",
          "IVolant vole"
        ],
        "answer": "Avion vole",
        "explanation": "Une interface définit un contrat que les classes doivent implémenter. L'objet 'volant' utilise l'implémentation de la classe 'Avion'."
      },
      {
        "question": "Quelle est la meilleure pratique pour structurer un projet en couches ?\n\n```plaintext\nOption 1:\nMonProjet/\n├── Controllers/\n├── Services/\n├── DataAccess/\n└── Models/\n\nOption 2:\nMonProjet/\n├── Clients/\n│   ├── ClientController.cs\n│   ├── ClientService.cs\n│   └── ClientRepository.cs\n└── Produits/\n    ├── ProduitController.cs\n    ├── ProduitService.cs\n    └── ProduitRepository.cs```",
        "options": [
          "Option 1",
          "Option 2",
          "Les deux sont équivalentes",
          "Aucune des options"
        ],
        "answer": "Option 2",
        "explanation": "Organiser le code par fonctionnalité (Option 2) améliore la lisibilité et la maintenabilité, car tous les fichiers liés à une fonctionnalité sont regroupés."
      },
    {
        "question": "Quel est le rôle du Modèle Conceptuel des Données (MCD) dans Merise ?",
        "options": [
          "Décrire le code source",
          "Représenter les processus métier",
          "Représenter les entités et leurs relations",
          "Créer des interfaces utilisateur"
        ],
        "answer": "Représenter les entités et leurs relations",
        "explanation": "Le MCD modélise la structure logique des données avec entités, associations et cardinalités."
      },
      {
        "question": "Quelle est une limite principale de la méthode Merise ?",
        "options": [
          "Elle n’est pas adaptée aux bases de données relationnelles",
          "Elle ne prend pas en compte les traitements métier",
          "Elle est peu compatible avec les méthodes agiles",
          "Elle ne propose pas de représentation graphique"
        ],
        "answer": "Elle est peu compatible avec les méthodes agiles",
        "explanation": "Sa structure rigide et documentaire rend son usage difficile dans les environnements agiles."
      },
      {
        "question": "Quel diagramme UML permet de représenter les classes, attributs, méthodes et relations ?",
        "options": [
          "Diagramme d’activités",
          "Diagramme de classes",
          "Diagramme d’états",
          "Diagramme de séquence"
        ],
        "answer": "Diagramme de classes",
        "explanation": "Le diagramme de classes est un diagramme structurel montrant les classes et leurs relations."
      },
      {
        "question": "Quel diagramme UML est utilisé pour représenter le comportement temporel entre objets ?",
        "options": [
          "Diagramme de composants",
          "Diagramme de séquence",
          "Diagramme d’objets",
          "Diagramme de déploiement"
        ],
        "answer": "Diagramme de séquence",
        "explanation": "Le diagramme de séquence représente les échanges temporels entre objets pour un scénario donné."
      },
      {
        "question": "Quel est l’objectif du test UAT ?",
        "options": [
          "Tester l'intégration des composants",
          "Vérifier la logique métier par les développeurs",
          "Valider que le système répond aux besoins métier",
          "Mesurer la performance du backend"
        ],
        "answer": "Valider que le système répond aux besoins métier",
        "explanation": "UAT est réalisé par les utilisateurs pour s'assurer que le produit est conforme aux attentes fonctionnelles."
      },
      {
        "question": "Quelle est la première étape du cycle TDD ?",
        "options": [
          "Implémenter le code",
          "Refactoriser",
          "Écrire un test qui passe",
          "Écrire un test qui échoue"
        ],
        "answer": "Écrire un test qui échoue",
        "explanation": "Le cycle TDD commence toujours par l’écriture d’un test qui échoue pour guider le développement."
      },
      {
        "question": "Quelle est la principale différence entre BDD et TDD ?",
        "options": [
          "TDD est manuel, BDD est automatique",
          "BDD se concentre sur les comportements métiers, TDD sur le code",
          "TDD utilise Gherkin, BDD utilise JUnit",
          "BDD est fait après le développement, TDD avant"
        ],
        "answer": "BDD se concentre sur les comportements métiers, TDD sur le code",
        "explanation": "BDD exprime les comportements attendus en langage naturel, tandis que TDD teste des unités de code."
      },
      {
        "question": "Quel outil est utilisé pour les tests E2E ?",
        "options": [
          "pytest",
          "Selenium",
          "JUnit",
          "Cucumber"
        ],
        "answer": "Selenium",
        "explanation": "Selenium est un outil populaire pour l’automatisation de scénarios utilisateur en E2E Testing."
      },
      {
        "question": "Quels tests sont utilisés pour vérifier qu’aucune fonctionnalité existante n’est cassée après modification ?",
        "options": [
          "UT",
          "RT",
          "TDD",
          "BDD"
        ],
        "answer": "RT",
        "explanation": "Le Regression Testing (RT) permet de vérifier qu’aucune régression n’a été introduite dans le code existant."
      },
      {
        "question": "Quel type de test permet de valider l’intégration complète entre tous les composants ?",
        "options": [
          "Unit Testing",
          "End-to-End Testing",
          "BDD",
          "Mock Testing"
        ],
        "answer": "End-to-End Testing",
        "explanation": "L’E2E Testing simule un parcours utilisateur complet à travers tous les composants du système."
      },

  ],
  avance: [

    {
      "question": "Quelle est la complexité temporelle d'un algorithme qui parcourt un tableau de taille n deux fois ?",
      "options": [
          "O(n)",
          "O(n²)",
          "O(2n)",
          "O(log n)"
      ],
      "answer": "O(n)",
      "explanation": "Bien que le tableau soit parcouru deux fois, cela reste linéaire par rapport à la taille des données. Les constantes comme '2' sont ignorées dans la notation Big-O."
  },
  {
      "question": "Quelle est la différence entre List<T> et Array en C# ?",
      "options": [
          "List<T> est immuable, Array est mutable.",
          "List<T> a une taille fixe, Array peut changer de taille.",
          "List<T> peut changer de taille, Array a une taille fixe.",
          "Aucune différence, elles sont interchangeables."
      ],
      "answer": "List<T> peut changer de taille, Array a une taille fixe.",
      "explanation": "List<T> est une collection dynamique qui peut être redimensionnée, tandis qu'un Array a une taille fixe définie lors de sa création."
  },
  {
      "question": "Quelle méthode LINQ permet de filtrer des éléments d'une collection ?",
      "options": [
          "Where()",
          "Select()",
          "OrderBy()",
          "GroupBy()"
      ],
      "answer": "Where()",
      "explanation": "La méthode Where() est utilisée pour filtrer les éléments d'une collection en fonction d'une condition spécifiée."
  },
  {
      "question": "Quelle est la sortie du code suivant ?\n\n```csharp\nint[] nombres = { 1, 2, 3, 4, 5 };\nvar result = nombres.Where(n => n % 2 == 0);\nforeach (var n in result) Console.Write(n + \" \");```",
      "options": [
          "1 2 3 4 5",
          "2 4",
          "1 3 5",
          "Erreur de compilation"
      ],
      "answer": "2 4",
      "explanation": "La méthode Where() filtre les nombres pairs (divisibles par 2), donc la sortie est '2 4'."
  },
  {
      "question": "Quel mot-clé est utilisé pour déclarer un délégué en C# ?",
      "options": [
          "delegate",
          "event",
          "async",
          "await"
      ],
      "answer": "delegate",
      "explanation": "Le mot-clé 'delegate' est utilisé pour déclarer un délégué, qui représente une référence vers une méthode."
  },
  {
      "question": "Quelle est la principale utilité des événements en C# ?",
      "options": [
          "Stocker des données dans une base.",
          "Notifier des actions ou des changements dans une application.",
          "Exécuter des tâches asynchrones.",
          "Manipuler des chaînes de caractères."
      ],
      "answer": "Notifier des actions ou des changements dans une application.",
      "explanation": "Les événements permettent de notifier des actions ou des changements dans une application, souvent utilisés dans les interfaces graphiques."
  },
  {
      "question": "Quelle est la syntaxe correcte pour créer un tuple en C# ?",
      "options": [
          "var tuple = (Nom: \"Alice\", Age: 30);",
          "var tuple = new Tuple<string, int>(\"Alice\", 30);",
          "var tuple = Tuple.Create(\"Alice\", 30);",
          "Toutes les réponses ci-dessus."
      ],
      "answer": "Toutes les réponses ci-dessus.",
      "explanation": "En C#, vous pouvez créer des tuples avec une syntaxe simplifiée (nommée), avec Tuple.Create, ou en utilisant le constructeur Tuple."
  },
  {
      "question": "Quelle est la sortie du code suivant ?\n\n```csharp\nvar personne = (Nom: \"Alice\", Age: 30);\nConsole.WriteLine(personne.Nom);```",
      "options": [
          "Alice",
          "30",
          "(Alice, 30)",
          "Erreur de compilation"
      ],
      "answer": "Alice",
      "explanation": "Le tuple nommé permet d'accéder aux valeurs via leurs noms de propriétés, donc 'personne.Nom' affiche 'Alice'."
  },
  {
      "question": "Quel mot-clé est utilisé pour exécuter une tâche asynchrone en C# ?",
      "options": [
          "async",
          "await",
          "task",
          "run"
      ],
      "answer": "async",
      "explanation": "Le mot-clé 'async' est utilisé pour marquer une méthode comme asynchrone, permettant l'utilisation de 'await' pour attendre des tâches asynchrones."
  },
  {
      "question": "Quelle est la sortie du code suivant ?\n\n```csharp\npublic static async Task Main() {\n    Console.WriteLine(\"Début\");\n    await Task.Delay(1000);\n    Console.WriteLine(\"Fin\");\n}```",
      "options": [
          "Début Fin",
          "Fin Début",
          "Début (pause de 1 seconde) Fin",
          "Erreur de compilation"
      ],
      "answer": "Début (pause de 1 seconde) Fin",
      "explanation": "La méthode Main() affiche 'Début', attend 1 seconde avec Task.Delay, puis affiche 'Fin'."
  },
  {
      "question": "Quelle technologie est utilisée pour créer des interfaces graphiques modernes en C# ?",
      "options": [
          "WinForms",
          "WPF",
          "Console",
          "ASP.NET"
      ],
      "answer": "WPF",
      "explanation": "WPF (Windows Presentation Foundation) est une technologie moderne pour créer des interfaces graphiques riches et interactives."
  },
  {
      "question": "Quelle est la principale utilité d'Entity Framework en C# ?",
      "options": [
          "Gérer les threads.",
          "Simplifier l'accès aux bases de données.",
          "Créer des interfaces graphiques.",
          "Exécuter des tâches asynchrones."
      ],
      "answer": "Simplifier l'accès aux bases de données.",
      "explanation": "Entity Framework est un ORM (Object-Relational Mapping) qui simplifie l'accès aux bases de données en mappant des objets C# à des tables de base de données."
  },
  {
      "question": "Quelle est la différence entre First() et FirstOrDefault() en LINQ ?",
      "options": [
          "First() lève une exception si aucun élément n'est trouvé, FirstOrDefault() retourne la valeur par défaut.",
          "FirstOrDefault() lève une exception, First() ne lève pas d'exception.",
          "Aucune différence.",
          "First() est utilisé uniquement avec les tableaux."
      ],
      "answer": "First() lève une exception si aucun élément n'est trouvé, FirstOrDefault() retourne la valeur par défaut.",
      "explanation": "First() lève une InvalidOperationException si aucun élément ne correspond, tandis que FirstOrDefault() retourne la valeur par défaut (null ou 0)."
  },
  {
      "question": "Quelle est la sortie du code suivant ?\n\n```csharp\nstring texte = \"Mon numéro est 123-456-7890.\";\nRegex regex = new Regex(@\"\\d{3}-\\d{3}-\\d{4}\");\nMatch match = regex.Match(texte);\nif (match.Success) Console.WriteLine(match.Value);```",
      "options": [
          "123-456-7890",
          "Mon numéro est",
          "Erreur de compilation",
          "Aucune sortie"
      ],
      "answer": "123-456-7890",
      "explanation": "L'expression régulière recherche un numéro de téléphone au format XXX-XXX-XXXX, donc la sortie est '123-456-7890'."
  },
  {
      "question": "Quelle est la principale utilité des tests unitaires en C# ?",
      "options": [
          "Valider chaque composant individuellement.",
          "Interroger une base de données.",
          "Créer des interfaces graphiques.",
          "Exécuter des tâches asynchrones."
      ],
      "answer": "Valider chaque composant individuellement.",
      "explanation": "Les tests unitaires permettent de vérifier qu'une unité spécifique de code (méthode ou fonction) fonctionne correctement de manière isolée."
  },
    {
      "question": "Quel est le rôle principal d'un délégué en C# ?",
      "options": [
        "Stocker des données",
        "Référencer une méthode avec une signature spécifique",
        "Créer une nouvelle classe",
        "Gérer les exceptions"
      ],
      "answer": "Référencer une méthode avec une signature spécifique",
      "explanation": "Un délégué est un type qui référence une méthode avec une signature donnée, permettant de passer des méthodes comme arguments ou de les assigner à des variables."
    },
    {
      "question": "Comment déclare-t-on une méthode d'extension en C# ?",
      "options": [
        "En utilisant le mot-clé 'extend'",
        "En définissant une méthode statique dans une classe statique avec le mot-clé 'this' devant le premier paramètre",
        "En héritant de la classe à étendre",
        "En utilisant des interfaces"
      ],
      "answer": "En définissant une méthode statique dans une classe statique avec le mot-clé 'this' devant le premier paramètre",
      "explanation": "Les méthodes d'extension sont des méthodes statiques définies dans des classes statiques, où le premier paramètre est précédé du mot-clé 'this' pour indiquer le type à étendre."
    },
    {
      "question": "Quelle est la sortie du code suivant ?\n\n```csharp\n(int, int) tuple = (5, 10);\nConsole.WriteLine(tuple.Item1 + tuple.Item2);\n```",
      "options": [
        "15",
        "510",
        "Erreur de compilation",
        "0"
      ],
      "answer": "15",
      "explanation": "Le tuple contient deux entiers, 5 et 10. La somme de tuple.Item1 et tuple.Item2 est 15."
    },
    {
      "question": "Quel est l'avantage principal de l'utilisation de async/await en C# ?",
      "options": [
        "Améliorer la sécurité du code",
        "Simplifier l'écriture de code asynchrone en le rendant plus lisible",
        "Augmenter la vitesse d'exécution du code",
        "Permettre l'héritage multiple"
      ],
      "answer": "Simplifier l'écriture de code asynchrone en le rendant plus lisible",
      "explanation": "Les mots-clés async et await permettent d'écrire du code asynchrone de manière plus lisible et maintenable, en évitant les callbacks complexes."
    },
    {
      "question": "Quelle technologie est un ORM complet pour gérer les données en C# ?",
      "options": [
        "ADO.NET",
        "Entity Framework",
        "LINQ",
        "Dapper"
      ],
      "answer": "Entity Framework",
      "explanation": "Entity Framework est un ORM (Object-Relational Mapper) complet qui facilite la gestion des données en mappant les objets C# aux tables de la base de données."
    },
    {
      "question": "Quel est le rôle d'un délégué en C# ?",
      "options": [
        "Il permet de définir une méthode abstraite.",
        "Il représente une référence à une méthode.",
        "Il est utilisé pour créer des classes génériques.",
        "Il sert à gérer les exceptions."
      ],
      "answer": "Il représente une référence à une méthode.",
      "explanation": "Un délégué est un type qui représente une référence à une méthode avec une signature spécifique, permettant de passer des méthodes en tant que paramètres."
    },
    {
      "question": "Comment déclare-t-on un événement en C# ?",
      "options": [
        "public delegate void MonEvenement();",
        "public event EventHandler MonEvenement;",
        "public void event MonEvenement();",
        "event public EventHandler MonEvenement;"
      ],
      "answer": "public event EventHandler MonEvenement;",
      "explanation": "La déclaration correcte d'un événement utilise le mot-clé 'event' suivi du type de délégué, généralement 'EventHandler'."
    },
    {
      "question": "Quelle est la syntaxe correcte pour une méthode d'extension ?",
      "options": [
        "public static void MaMethode(this string s) {}",
        "public void MaMethode(string s) {}",
        "static void MaMethode(this string s) {}",
        "public static void MaMethode(string s) {}"
      ],
      "answer": "public static void MaMethode(this string s) {}",
      "explanation": "Une méthode d'extension doit être une méthode statique dans une classe statique, avec le premier paramètre précédé du mot-clé 'this'."
    },
    {
      "question": "Comment déclare-t-on un tuple en C# ?",
      "options": [
        "var monTuple = (\"texte\", 123);",
        "Tuple monTuple = (\"texte\", 123);",
        "var monTuple = Tuple(\"texte\", 123);",
        "tuple monTuple = [\"texte\", 123];"
      ],
      "answer": "var monTuple = (\"texte\", 123);",
      "explanation": "Depuis C# 7.0, on peut déclarer un tuple en utilisant la syntaxe '(valeur1, valeur2)'."
    },
    {
      "question": "Quel est le rôle des expressions régulières en C# ?",
      "options": [
        "Elles permettent de gérer les exceptions.",
        "Elles servent à effectuer des opérations mathématiques.",
        "Elles permettent de valider et de manipuler des chaînes de caractères.",
        "Elles sont utilisées pour créer des interfaces graphiques."
      ],
      "answer": "Elles permettent de valider et de manipuler des chaînes de caractères.",
      "explanation": "Les expressions régulières sont utilisées pour rechercher, valider et manipuler des motifs spécifiques dans des chaînes de caractères."
    },
    {
      "question": "Quelle est la fonction de 'async' et 'await' en C# ?",
      "options": [
        "Ils permettent de définir des classes abstraites.",
        "Ils sont utilisés pour la gestion des exceptions.",
        "Ils facilitent la programmation asynchrone en permettant d'attendre des tâches sans bloquer le thread principal.",
        "Ils servent à créer des interfaces graphiques."
      ],
      "answer": "Ils facilitent la programmation asynchrone en permettant d'attendre des tâches sans bloquer le thread principal.",
      "explanation": "Les mots-clés 'async' et 'await' permettent d'écrire du code asynchrone de manière plus lisible, en évitant de bloquer le thread principal pendant l'attente de tâches longues."
    },
    {
      "question": "Quelle technologie utiliseriez-vous pour créer une interface graphique en C# ?",
      "options": [
        "ASP.NET Core",
        "Entity Framework",
        "WinForms ou WPF",
        "LINQ to SQL"
      ],
      "answer": "WinForms ou WPF",
      "explanation": "WinForms et WPF sont des technologies de Microsoft pour créer des interfaces graphiques desktop en C#."
    },
    {
      "question": "Quel framework est utilisé pour développer des API REST en C# ?",
      "options": [
        "WinForms",
        "WPF",
        "ASP.NET Web API",
        "Entity Framework"
      ],
      "answer": "ASP.NET Web API",
      "explanation": "ASP.NET Web API est un framework permettant de créer des services HTTP accessibles via des API RESTful."
    },
    {
      "question": "Quelle est la principale différence entre ADO.NET et Entity Framework ?",
      "options": [
        "ADO.NET est un ORM, tandis qu'Entity Framework ne l'est pas.",
        "Entity Framework est un ORM qui simplifie l'accès aux données, tandis qu'ADO.NET nécessite plus de code manuel.",
        "ADO.NET est utilisé uniquement pour les bases de données NoSQL.",
        "Entity Framework ne prend pas en charge les bases de données relationnelles."
      ],
      "answer": "Entity Framework est un ORM qui simplifie l'accès aux données, tandis qu'ADO.NET nécessite plus de code manuel.",
      "explanation": "Entity Framework est un ORM (Object-Relational Mapping) qui permet de travailler avec des bases de données en utilisant des objets .NET, réduisant ainsi le besoin de code SQL manuel requis avec ADO.NET."
    },
    {
      "question": "Comment effectuer une requête LINQ pour sélectionner tous les clients dont le nom commence par 'A' ?",
      "options": [
        "var result = clients.Where(c => c.Name.StartsWith(\"A\"));",
        "var result = clients.Select(c => c.Name == \"A\");",
        "var result = clients.FindAll(c => c.Name == \"A\");",
        "var result = clients.Get(c => c.Name.StartsWith(\"A\"));"
      ],
      "answer": "var result = clients.Where(c => c.Name.StartsWith(\"A\"));",
      "explanation": "La méthode 'Where' de LINQ permet de filtrer les éléments d'une collection en fonction d'une condition spécifiée."
    }
  ]
};


// Timer
const Timer = ({ timeLeft }) => (
  <p className="timer">⏳ Temps restant : <span>{timeLeft}s</span></p>
);

// Composant QCM
const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option, index)} className="option-button">
          {String.fromCharCode(65 + index)}.{option}
        </button>
      ))}
    </div>
  </div>
);

// Composant Flashcard
const Flashcard = ({ slide, index, total }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    {/* <h5>🧠 Flashcard {index + 1} / {total}</h5> */}
    <strong>Question :</strong>
    <pre style={{ margin: '0', padding: '4px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
        {slide.question}
      </code>
    
    </pre>
    <strong>Réponse :</strong> {slide.answer}
  </div>
);




// Composant Résultat
const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score final : {totalScore} / {totalQuestions}</h3>
      <p>✅ Niveau Moyen : {scores.moyen}</p>
      <p>✅ Niveau Avancé : {scores.avance}</p>
      {totalScore > 3 ? (
        <h3 className="success">🚀 Excellent travail ! Vous maîtrisez bien les Produits !</h3>
      ) : (
        <p className="fail">📚 Révisez encore un peu pour bien comprendre les concepts, ou retournez voir les flashcards !</p>
      )}
    </div>
  );
};

// Page principale
const Page4 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && !message && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  // Slide auto pour les flashcards
  useEffect(() => {
    if (level === "basic" && !showResult) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev + 1 < basicSlides.length) {
            return prev + 1;
          } else {
            setLevel("moyen");
            setCurrentQuestion(0);
            setTimeLeft(20);
            return 0;
          }
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [level, showResult]);

const handleAnswerClick = (option, index) => {
    if (message) return;
  const currentQuestions = questions[level];
  const current = currentQuestions[currentQuestion];
  const correctAnswer = current.answer;

  const isCorrect =
    /^[A-D]$/.test(correctAnswer) // Si c’est une lettre
      ? index === correctAnswer.charCodeAt(0) - 65
      : option === correctAnswer; // Sinon compare le texte

  if (isCorrect) {
    setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
    setMessage("✅ Correct !");
  } else {
    setMessage(`❌ Incorrect ! La bonne réponse était : ${correctAnswer}\n ℹ️ ${current.explanation}`);
  }

  setTimeout(handleNextQuestion, 2500);
};

  const handleNextQuestion = useCallback(() => {
    const currentQuestions = questions[level];
    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20);
      setMessage("");
    } else {
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(20);
      setMessage("");
    }
  }, [level, currentQuestion]);;

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0' }}>
              Fixed Inc! 🔹 Niveau : {level.toUpperCase()}
          </h4>

          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} index={currentSlide} total={basicSlides.length} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page4;