// src/projects/Project1/pages/Page3.js
// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie Solid OOP Multithreadx
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "Qu’est-ce que le principe de responsabilité unique (SRP) ?",
    "answer": "Une classe doit avoir **une seule responsabilité** métier (un seul rôle).\n🔑 Mauvais : `ClientService` gère tout (validation, stockage, mails).\n🔑 Bon :\n```csharp\npublic class EmailService { public void Envoyer(...) {...} }\n```"
  },
  {
    "question": "Qu’est-ce que le principe Open/Closed (OCP) ?",
    "answer": "Une classe doit être **ouverte à l’extension**, mais **fermée à la modification**.\n🔑 On utilise **l’héritage ou l’abstraction**.\n```csharp\npublic abstract class Paiement { public abstract void Payer(); }\npublic class PaiementCarte : Paiement { public override void Payer() => Console.WriteLine(\"CB\"); }\n```"
  },
  {
    "question": "Qu’est-ce que le principe de substitution de Liskov (LSP) ?",
    "answer": "Une sous-classe doit pouvoir **remplacer** la classe de base **sans altérer le comportement**.\n🔴 Mauvais : `class Pingouin : Oiseau` avec une méthode `Voler()` qui jette une exception.\n✅ Solution :\n```csharp\npublic interface IVolant { void Voler(); }\n```"
  },
  {
    "question": "Qu’est-ce que l’Interface Segregation Principle (ISP) ?",
    "answer": "Il faut **éviter les interfaces trop larges** : une classe ne doit implémenter **que ce dont elle a besoin**.\n🔑 Mauvais :\n```csharp\ninterface IEmploye { void Travailler(); void Cuisiner(); }\n```\n✅ Bon :\n```csharp\ninterface ICuisinier { void Cuisiner(); }\ninterface IDeveloppeur { void Programmer(); }\n```"
  },
  {
    "question": "Qu’est-ce que le Dependency Inversion Principle (DIP) ?",
    "answer": "Les modules haut niveau doivent **dépendre d’abstractions**, pas de classes concrètes.\n✅ On utilise **l’injection de dépendances** :\n```csharp\npublic interface IDatabase { void Sauvegarder(); }\npublic class Service { private readonly IDatabase _db;\npublic Service(IDatabase db) { _db = db; } }\n```"
  },
  {
    "question": "Comment appliquer concrètement les principes SOLID en C# ?",
    "answer": "✅ Modulariser les rôles métier (SRP)\n✅ Étendre via héritage (OCP)\n✅ Respecter l’héritage logique (LSP)\n✅ Diviser les interfaces (ISP)\n✅ Injecter les dépendances via interfaces (DIP)\n🔑 Exemple combiné :\n```csharp\npublic interface ILogger { void Log(string msg); }\npublic class FichierLogger : ILogger { ... }\npublic class MonService { public MonService(ILogger logger) { ... } }\n```"
  },
  {
    "question": "Quelle est une bonne métaphore pour les principes SOLID ?",
    "answer": "🔹 **SRP** : Un employé ≠ facturation + livraison + support.\n🔹 **OCP** : Ajouter une nouvelle prise sans démonter l’appareil.\n🔹 **LSP** : Une voiture électrique remplace une thermique sans changer sa conduite.\n🔹 **ISP** : Une imprimante ≠ scanner ≠ fax → interfaces séparées.\n🔹 **DIP** : Piloter une voiture sans dépendre de la marque (interface)."
  },
  {
    "question": "Quels sont les 4 piliers de la POO ?",
    "answer": "**Encapsulation** (masquer les données internes), **Héritage** (réutiliser les comportements), **Polymorphisme** (comportement adaptable), **Abstraction** (exposer uniquement l'essentiel).\n🔑 Exemple :\n```csharp\npublic class Animal { public virtual void Crier() {} }\npublic class Chien : Animal { public override void Crier() => Console.WriteLine(\"Wouf\"); }\n```"
  },
  {
    "question": "Encapsulation : définition + exemple ?",
    "answer": "**Masquer les données internes** via des propriétés.\n🔑 Code : `private string nom; public string Nom { get; set; }`"
  },
  {
    "question": "Héritage : principe + exemple ?",
    "answer": "**Réutiliser** les attributs/méthodes d’une classe parente.\n🔑 Code : `class Chien : Animal { }`"
  },
  {
    "question": "Polymorphisme : utilité + exemple ?",
    "answer": "**Appeler une méthode** via une référence générique.\n🔑 Code : `Animal a = new Chien(); a.Crier();`"
  },
  {
    "question": "Abstraction : but + exemple ?",
    "answer": "**Cacher les détails** d’implémentation, exposer l’essentiel.\n🔑 Code : `interface IAnimal { void Crier(); }`"
  },
  {
    "question": "Quelle différence entre Thread et Task en C# ? Quand les utiliser ?",
    "answer": "**Thread** = exécution bas niveau, manuel. **Task** = abstraction haut niveau, plus facile à gérer et chaînable avec `await`.\n🔑 Thread : `new Thread(MaMethode).Start();`\n🔑 Task : `Task.Run(() => {...});`"
  },
  {
    "question": "À quoi servent `async` et `await` ? Quelle relation entre eux ?",
    "answer": "`async` permet de déclarer une méthode asynchrone, `await` suspend la méthode sans bloquer le thread.\n🔑 Code : `async Task MaMethode() { await Task.Delay(1000); }`"
  },
  {
    "question": "Qu’est-ce que le parallélisme et comment le mettre en œuvre ?",
    "answer": "**Parallélisme** = exécution simultanée sur plusieurs cœurs (CPU-bound).\n🔑 Exemple : `Parallel.Invoke(() => ..., () => ...);`, `Parallel.For(0, 100, i => {...});`"
  },
  {
    "question": "Différences entre `Thread.Sleep()` et `Task.Delay()` ?",
    "answer": "`Thread.Sleep()` bloque le thread. `Task.Delay()` attend sans bloquer (asynchrone).\n🔑 Bloquant : `Thread.Sleep(1000);`\n🔑 Non bloquant : `await Task.Delay(1000);`"
  },
  {
    "question": "Comment rendre le `Main` asynchrone et pourquoi ?",
    "answer": "`async Main()` permet l’utilisation directe de `await` au démarrage du programme (C# 7.1+).\n🔑 Code : `static async Task Main() { await ...; }`"
  },
  {
    "question": "Quels types de tâches conviennent au parallélisme avec `Parallel.For` ?",
    "answer": "**Tâches CPU-bound indépendantes**, ex : calculs, traitement par lot, simulations.\n🔑 Code : `Parallel.For(0, n, i => { ... });`"
  },
  {
    "question": "Quels sont les inconvénients de gérer les threads manuellement ?",
    "answer": "**Complexité élevée** : création, synchronisation, erreurs. Risques de **bugs de concurrence**.\n🔑 Code : `Thread t = new Thread(...); t.Start();`"
  },
  {
    "question": "Qu’est-ce qu’un `Task<T>` et comment obtenir sa valeur ?",
    "answer": "`Task<T>` est une tâche async qui retourne une **valeur**.\n🔑 Code : `async Task<int> Calcul() => 2 + 2;`\n🔑 Appel : `int res = await Calcul();`"
  },
  {
    "question": "Quand préférer `async/await` à un thread ?",
    "answer": "`async/await` est idéal pour les **opérations I/O non bloquantes** (fichiers, API), tandis que les threads sont adaptés aux **tâches parallèles intensives** (CPU-bound)."
  },
  {
    "question": "Donne une métaphore pédagogique de `async/await` vs Thread",
    "answer": "`Thread` = ouvrier actif qu’on contrôle manuellement. `async/await` = déléguer un travail et continuer, être averti à la fin. Comme envoyer un mail et ne pas attendre devant la boîte."
  },
  {
    "question": "Qu’est-ce que LINQ en C# et à quoi sert-il ?",
    "answer": "**LINQ** = Language Integrated Query. Permet de filtrer, projeter et agréger des collections de manière déclarative.\n🔑 Exemple : `var even = list.Where(x => x % 2 == 0);`"
  },
  {
    "question": "Qu’est-ce que PLINQ et comment l'utiliser ?",
    "answer": "**PLINQ** = Parallel LINQ. Extension de LINQ pour exécuter les requêtes **en parallèle**.\n🔑 Exemple : `var result = data.AsParallel().Where(x => x > 10);`"
  },
  {
    "question": "Quand préférer `async/await` à un thread ?",
    "answer": "`async/await` est idéal pour les **opérations I/O non bloquantes** (fichiers, API), tandis que les threads sont adaptés aux **tâches parallèles intensives** (CPU-bound)."
  },
  {
    "question": "Donne une métaphore pédagogique de `async/await` vs Thread",
    "answer": "`Thread` = ouvrier actif qu’on contrôle manuellement. `async/await` = déléguer un travail et continuer, être averti à la fin. Comme envoyer un mail et ne pas attendre devant la boîte."
  }


];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

       {
    "question": "Quel principe SOLID stipule qu'une classe ne doit avoir qu'une seule responsabilité ?",
    "options": [
      "Open/Closed Principle",
      "Liskov Substitution Principle",
      "Single Responsibility Principle",
      "Interface Segregation Principle"
    ],
    "answer": "Single Responsibility Principle",
    "explanation": "Le SRP (Single Responsibility Principle) est le premier principe SOLID qui impose qu'une classe ne doit avoir qu'une seule raison de changer, c'est-à-dire une seule responsabilité."
  },
  {
    "question": "Comment appliquer le principe Open/Closed en C# ?",
    "options": [
      "En modifiant directement la classe existante",
      "En utilisant l'héritage et l'abstraction",
      "En copiant-collant le code",
      "En utilisant des méthodes statiques"
    ],
    "answer": "En utilisant l'héritage et l'abstraction",
    "explanation": "Le principe Open/Closed recommande d'étendre le comportement via l'héritage ou l'abstraction (interfaces, classes abstraites) plutôt que de modifier le code existant."
  },
  {
    "question": "Quelle situation viole le principe de substitution de Liskov ?",
    "options": [
      "Une sous-classe qui étend toutes les méthodes de sa classe mère",
      "Une sous-classe qui lance une exception dans une méthode override",
      "Une sous-classe qui ajoute de nouvelles méthodes",
      "Une sous-classe qui implémente une interface"
    ],
    "answer": "Une sous-classe qui lance une exception dans une méthode override",
    "explanation": "Le LSP exige qu'une sous-classe puisse remplacer sa classe mère sans altérer le comportement attendu. Lancer une exception dans une méthode override est une violation typique."
  },
  {
    "question": "Quel est le but principal de l'encapsulation en POO ?",
    "options": [
      "Rendre le code plus difficile à comprendre",
      "Masquer les détails d'implémentation",
      "Augmenter les performances",
      "Réduire le nombre de classes"
    ],
    "answer": "Masquer les détails d'implémentation",
    "explanation": "L'encapsulation permet de cacher les détails internes d'une classe et de n'exposer que ce qui est nécessaire, via des propriétés et méthodes publiques."
  },
  {
    "question": "Quelle syntaxe C# illustre le mieux le polymorphisme ?",
    "options": [
      "class Animal {} class Chien : Animal {}",
      "Animal a = new Animal();",
      "Animal a = new Chien(); a.Crier();",
      "interface IAnimal {}"
    ],
    "answer": "Animal a = new Chien(); a.Crier();",
    "explanation": "Le polymorphisme permet d'utiliser une instance de classe dérivée via une référence de classe de base, avec un comportement spécifique à la classe dérivée."
  },
  {
    "question": "Quelle est la différence principale entre Thread et Task en C# ?",
    "options": [
      "Thread est plus moderne que Task",
      "Task est une abstraction de plus haut niveau",
      "Thread ne peut pas être annulé",
      "Task est toujours synchrone"
    ],
    "answer": "Task est une abstraction de plus haut niveau",
    "explanation": "Task représente une opération asynchrone et fournit un modèle de programmation plus simple que la gestion directe des threads, avec support natif de await/async."
  },
  {
    "question": "Quand doit-on utiliser async/await plutôt que des threads ?",
    "options": [
      "Pour les calculs intensifs sur CPU",
      "Pour les opérations I/O bound",
      "Pour les opérations nécessitant un contrôle précis des threads",
      "Pour les opérations nécessitant Thread.Sleep"
    ],
    "answer": "Pour les opérations I/O bound",
    "explanation": "async/await est optimisé pour les opérations I/O bound (accès réseau, fichiers) car il permet de libérer les threads pendant les attentes."
  },
  {
    "question": "Quelle méthode permet d'attendre une tâche sans bloquer le thread ?",
    "options": [
      "Thread.Sleep(1000)",
      "Task.Delay(1000).Wait()",
      "await Task.Delay(1000)",
      "Thread.Yield()"
    ],
    "answer": "await Task.Delay(1000)",
    "explanation": "await Task.Delay() est la méthode non-bloquante pour attendre, contrairement à Thread.Sleep() ou Wait() qui bloquent le thread."
  },
  {
    "question": "Quel est l'avantage principal de LINQ ?",
    "options": [
      "Améliorer les performances",
      "Remplacer les boucles for",
      "Fournir une syntaxe déclarative pour les requêtes",
      "Réduire la taille du code exécutable"
    ],
    "answer": "Fournir une syntaxe déclarative pour les requêtes",
    "explanation": "LINQ permet d'écrire des requêtes sur des collections de manière déclarative et lisible, similaire au SQL, plutôt qu'avec des boucles impératives."
  },
  {
    "question": "Quand doit-on utiliser PLINQ plutôt que LINQ ?",
    "options": [
      "Pour les petites collections",
      "Pour les requêtes simples",
      "Pour les opérations CPU-bound sur grandes collections",
      "Pour les opérations I/O bound"
    ],
    "answer": "Pour les opérations CPU-bound sur grandes collections",
    "explanation": "PLINQ (Parallel LINQ) est utile pour paralléliser le traitement de grandes collections lorsque les opérations sont intensives en CPU."
  },
  {
    "question": "Comment implémenter correctement le Dependency Inversion Principle ?",
    "options": [
      "En instanciant directement les dépendances",
      "En utilisant le pattern Singleton",
      "En dépendant d'abstractions et utilisant l'injection de dépendances",
      "En rendant toutes les méthodes statiques"
    ],
    "answer": "En dépendant d'abstractions et utilisant l'injection de dépendances",
    "explanation": "Le DIP recommande de dépendre d'interfaces ou classes abstraites, avec des dépendances injectées (typiquement via le constructeur) plutôt qu'instanciées directement."
  },
  {
    "question": "Quelle est la caractéristique principale d'une interface bien conçue selon l'ISP ?",
    "options": [
      "Elle doit contenir le plus de méthodes possible",
      "Elle doit être petite et ciblée",
      "Elle doit implémenter des méthodes par défaut",
      "Elle doit hériter d'au moins une autre interface"
    ],
    "answer": "Elle doit être petite et ciblée",
    "explanation": "L'Interface Segregation Principle recommande de créer des interfaces petites et spécifiques plutôt que des interfaces larges contenant des méthodes inutiles pour certains clients."
  },
  {
    "question": "Quelle est la différence entre abstraction et encapsulation ?",
    "options": [
      "L'abstraction cache les détails, l'encapsulation montre tout",
      "L'encapsulation cache les détails, l'abstraction simplifie le modèle",
      "Il n'y a pas de différence",
      "L'abstraction concerne l'héritage, l'encapsulation les interfaces"
    ],
    "answer": "L'encapsulation cache les détails, l'abstraction simplifie le modèle",
    "explanation": "L'encapsulation protège les données internes, tandis que l'abstraction fournit un modèle simplifié en cachant la complexité de l'implémentation."
  },
  {
    "question": "Pourquoi éviter Thread.Sleep() dans du code asynchrone ?",
    "options": [
      "Parce que c'est obsolète",
      "Parce que ça bloque le thread",
      "Parce que c'est plus lent que Task.Delay",
      "Parce que ça consomme plus de mémoire"
    ],
    "answer": "Parce que ça bloque le thread",
    "explanation": "Thread.Sleep() bloque le thread courant, ce qui annule les bénéfices de l'asynchronisme, contrairement à await Task.Delay() qui est non-bloquant."
  },
  {
    "question": "Quelle est la meilleure pratique pour gérer les dépendances selon SOLID ?",
    "options": [
      "Utiliser le pattern Singleton partout",
      "Instancier les dépendances dans les constructeurs",
      "Utiliser l'injection de dépendances via des interfaces",
      "Déclarer toutes les dépendances comme statiques"
    ],
    "answer": "Utiliser l'injection de dépendances via des interfaces",
    "explanation": "L'injection de dépendances via des interfaces permet de respecter le Dependency Inversion Principle et rend le code plus testable et modulaire."
  },
  ],
  avance: 
  [
  {
    "question": "Quelle violation du LSP se cache dans ce code ?\n```csharp\nclass Rectangle { virtual int Width {get;set;} virtual int Height {get;set;} }\nclass Square : Rectangle { override int Width { set { base.Width = base.Height = value; } } }\n```",
    "options": [
      "Square modifie le comportement des setters",
      "Rectangle devrait être sealed",
      "Square ne peut pas substituer Rectangle car cela brise les invariants",
      "Aucune violation, c'est une bonne implémentation"
    ],
    "answer": "Square ne peut pas substituer Rectangle car cela brise les invariants",
    "explanation": "Un carré ne peut pas être un substitut valide de rectangle car modifier une dimension affecte l'autre, ce qui viole les attentes du code client conçu pour Rectangle."
  },
  {
    "question": "Quel problème résout ce pattern dans une hiérarchie SOLID ?\n```csharp\ninterface IWorker { void Work(); }\ninterface IEater { void Eat(); }\nclass Human : IWorker, IEater { ... }\nclass Robot : IWorker { ... }\n```",
    "options": [
      "Violation du SRP",
      "Respect strict du LSP",
      "Application de l'ISP",
      "Optimisation pour le cache CPU"
    ],
    "answer": "Application de l'ISP",
    "explanation": "La séparation en interfaces fines (IWorker/IEater) plutôt qu'une grosse interface 'IHumanoid' illustre parfaitement l'Interface Segregation Principle."
  },
  {
    "question": "Pourquoi ce code viole-t-il l'OCP ?\n```csharp\nclass ReportGenerator {\n  public void Generate(string type) {\n    if (type == \"PDF\") { /* PDF */ }\n    else if (type == \"HTML\") { /* HTML */ }\n  }\n}```",
    "options": [
      "Il utilise des strings au lieu d'enums",
      "Il nécessite de modifier la classe pour ajouter un nouveau type",
      "Il ne respecte pas le SRP",
      "Il devrait être static"
    ],
    "answer": "Il nécessite de modifier la classe pour ajouter un nouveau type",
    "explanation": "Pour ajouter un format (ex: CSV), il faut modifier la classe existante, ce qui viole l'Open/Closed Principle. Une solution serait d'utiliser une abstraction (IReportGenerator)."
  },
  {
    "question": "Quel est le problème de ce décorateur ?\n```csharp\nclass CachedService : IService {\n  private IService _service;\n  private Dictionary<string, object> _cache = new();\n  public CachedService(IService s) { _service = s; }\n  public object Get(string key) {\n    if (!_cache.ContainsKey(key)) _cache[key] = _service.Get(key);\n    return _cache[key];\n  }\n}```",
    "options": [
      "Violation du SRP (cache + service)",
      "Problème de concurrence (non thread-safe)",
      "Les deux réponses précédentes",
      "Aucun problème, c'est une bonne implémentation"
    ],
    "answer": "Les deux réponses précédentes",
    "explanation": "1) Le cache devrait être externalisé pour respecter le SRP. 2) L'accès au dictionnaire n'est pas synchronisé, ce qui est dangereux en multi-thread."
  },
  {
    "question": "Comment corriger ce code pour respecter le DIP ?\n```csharp\nclass OrderProcessor {\n  private SqlDatabase _db = new SqlDatabase();\n  public void Process(Order o) { _db.Save(o); }\n}```",
    "options": [
      "Rendre _db static",
      "Injecter IDatabase dans le constructeur",
      "Implémenter un pattern Singleton",
      "Utiliser des méthodes d'extension"
    ],
    "answer": "Injecter IDatabase dans le constructeur",
    "explanation": "Pour respecter le Dependency Inversion Principle, il faut dépendre d'une abstraction (IDatabase) injectée plutôt que de l'implémentation concrète (SqlDatabase)."
  },
  {
    "question": "Quel anti-pattern illustre ce code async ?\n```csharp\nasync Task<int> Compute() {\n  var result = await Task.Run(() => {\n    Thread.Sleep(1000);\n    return 42;\n  });\n  return result;\n}```",
    "options": [
      "Async-over-sync",
      "Sync-over-async",
      "Double await inutile",
      "Mauvaise gestion des erreurs"
    ],
    "answer": "Async-over-sync",
    "explanation": "C'est un anti-pattern 'async-over-sync' : on encapsule du code synchrone (Thread.Sleep) dans Task.Run, ce qui consomme inutilement un thread pool."
  },
  {
    "question": "Pourquoi ce code est-il dangereux ?\n```csharp\nasync void Button_Click(object s, EventArgs e) {\n  await SomeAsyncOperation();\n}```",
    "options": [
      "Les exceptions sont ingérables",
      "Il bloque l'UI thread",
      "Il nécessite C# 9+",
      "Le mot-clé async est inutile"
    ],
    "answer": "Les exceptions sont ingérables",
    "explanation": "async void ne permet pas d'attendre ni de catcher les exceptions correctement. Il devrait retourner Task dans les handlers d'événements."
  },
  {
    "question": "Quelle technique permet de déboguer ce deadlock ?\n```csharp\nasync Task Deadlock() {\n  var task = WaitAsync();\n  task.Wait(); // Bloque ici\n}\nasync Task WaitAsync() {\n  await Task.Delay(1000);\n}```",
    "options": [
      "Inspecter la fenêtre Parallel Stacks",
      "Utiliser ConfigureAwait(false)",
      "Remplacer Wait() par await",
      "Toutes ces solutions"
    ],
    "answer": "Toutes ces solutions",
    "explanation": "1) Parallel Stacks montre les dépendances entre threads. 2) ConfigureAwait(false) évite le contexte de synchronisation. 3) await est la solution propre."
  },
  {
    "question": "Quelle optimisation apporte ce code PLINQ ?\n```csharp\nvar results = data.AsParallel()\n  .WithDegreeOfParallelism(Environment.ProcessorCount)\n  .Where(x => ExpensiveFilter(x))\n  .ToList();```",
    "options": [
      "Meilleure gestion de la mémoire",
      "Limitation explicite du parallélisme",
      "Exécution séquentielle forcée",
      "Cache des résultats intermédiaires"
    ],
    "answer": "Limitation explicite du parallélisme",
    "explanation": "WithDegreeOfParallelism() évite la surcharge en limitant le nombre de threads utilisés, particulièrement utile pour les opérations CPU-bound."
  },
  {
    "question": "Quel est l'effet de 'WithCancellation' dans cette requête PLINQ ?\n```csharp\nvar results = source.AsParallel()\n  .WithCancellation(cts.Token)\n  .Select(x => Transform(x));```",
    "options": [
      "Améliore les performances",
      "Permet d'annuler la requête",
      "Force l'exécution séquentielle",
      "Active le logging détaillé"
    ],
    "answer": "Permet d'annuler la requête",
    "explanation": "WithCancellation permet d'interrompre une requête PLINQ longue via un CancellationToken, essentiel pour les UIs ou services interruptibles."
  },
  {
    "question": "Pourquoi préférer ce pattern pour les factories async ?\n```csharp\ninterface IAsyncFactory<T> {\n  Task<T> CreateAsync();\n}```",
    "options": [
      "Pour supporter l'injection de dépendances",
      "Pour permettre l'initialisation asynchrone",
      "Pour respecter le SRP",
      "Pour améliorer les performances"
    ],
    "answer": "Pour permettre l'initialisation asynchrone",
    "explanation": "Certaines ressources nécessitent une initialisation asynchrone (fichiers, DB). Ce pattern permet de l'encapsuler proprement plutôt que d'utiliser des constructeurs sync."
  },
  {
    "question": "Quel est le risque de ce ValueTask ?\n```csharp\npublic ValueTask<int> Compute() {\n  if (_cache.TryGetValue(key, out var result))\n    return new ValueTask<int>(result); // Cas sync\n  return new ValueTask<int>(ComputeAsync()); // Cas async\n}```",
    "options": [
      "Double allocation mémoire",
      "Appel simultané impossible",
      "Le ValueTask peut être consommé une seule fois",
      "Gestion compliquée des erreurs"
    ],
    "answer": "Le ValueTask peut être consommé une seule fois",
    "explanation": "Un ValueTask ne doit être awaité qu'une seule fois. Si le résultat est réutilisé, il faut convertir en Task via .AsTask() ou recréer le ValueTask."
  },
  {
    "question": "Comment garantir qu'une méthode est pure en C# ?\n```csharp\n[Pure]\nint Calculate(int a, int b) {\n  return a + b;\n}```",
    "options": [
      "Avec l'attribut [Pure] (System.Diagnostics.Contracts)",
      "En la marquant static",
      "Avec readonly struct",
      "C'est impossible à garantir"
    ],
    "answer": "Avec l'attribut [Pure] (System.Diagnostics.Contracts)",
    "explanation": "L'attribut [Pure] indique que la fonction ne modifie pas l'état observable (pas de side-effects). Les analyseurs de code peuvent vérifier cette propriété."
  },
  {
    "question": "Quelle technique permet de déboguer efficacement ce code ?\n```csharp\nvar result = await FetchDataAsync().ConfigureAwait(false);\nUpdateUI(result); // Crash ici```",
    "options": [
      "Vérifier le SynchronizationContext",
      "Inspecter la pile d'appels asynchrone",
      "Utiliser Visual Studio's Parallel Stacks",
      "Toutes ces réponses"
    ],
    "answer": "Toutes ces réponses",
    "explanation": "Le crash vient probablement d'une tentative de mettre à jour l'UI depuis un thread non-UI. Ces techniques aident à tracer le flux d'exécution asynchrone."
  },
  {
    "question": "Quelle est la particularité de ce pipeline LINQ ?\n```csharp\nvar query = data.Where(x => x.IsValid)\n  .AsParallel()\n  .Select(x => Transform(x))\n  .AsSequential()\n  .OrderBy(x => x.Date);```",
    "options": [
      "Il mélange traitement parallèle et séquentiel",
      "Il est optimisé pour les petites collections",
      "Il implémente le pattern Producer/Consumer",
      "Il nécessite C# 10"
    ],
    "answer": "Il mélange traitement parallèle et séquentiel",
    "explanation": "AsParallel() active le traitement parallèle pour le filtrage et la transformation, tandis que AsSequential() désactive le parallélisme pour le tri final qui nécessite un traitement séquentiel."
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
    <strong>Question : </strong>
    
    <strong>
      <p>
        <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
          {slide.question}
        </code>
      </p>
    </strong>  
      <pre style={{ margin: '0', padding: '2px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
        <p>
          <strong>Réponse :</strong> {slide.answer}
        </p>
      </pre>
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
const Page2 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

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

  const handleNextQuestion = () => {
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
  };

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


export default Page2;