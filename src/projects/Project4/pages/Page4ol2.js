// src/projects/Project3/pages/Page4.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "POO — Encapsulation",
    "answer": " ◆ :Regrouper les données et comportements dans une classe tout en contrôlant l'accès via des getters/setters. ◆ : `private` (données inaccessibles de l'extérieur), `public` (accès autorisé), `get` / `set` (contrôle en lecture/écriture). ◆ **ex:** : `Order._price` est `private`. Seule la méthode `Execute()` peut modifier le statut — aucun code externe ne peut corrompre un ordre en cours."
  },
  {
    "question": "POO — Abstraction",
    "answer": " ◆ :Exposer uniquement les comportements essentiels sans montrer les détails internes. ◆ : `interface` (contrat pur — que des signatures, pas de code), `abstract class` (contrat + code commun partageable). ◆ **Règle** : deux classes partagent du code → `abstract class`. Elles partagent un contrat seulement → `interface`. ◆ **ex:** : `IPricingEngine` expose `Calculate(trade)`. Le desk appelle la méthode sans savoir si c'est Black-Scholes ou Monte Carlo."
  },
  {
    "question": "POO — Héritage",
    "answer": " ◆ :Permettre à une classe fille d'hériter des propriétés et méthodes d'une classe mère pour réutiliser le code. ◆ : `:` (étendre une classe), `base` (appeler le constructeur ou une méthode du parent), `protected` (accessible par la classe et ses enfants uniquement). ◆ **ex:** : `EquityOption : Derivative` hérite automatiquement de toute la gestion du cycle de vie d'un dérivé sans réécrire la logique commune."
  },
  {
    "question": "POO — Polymorphisme",
    "answer": " ◆ :Permettre à une méthode d'avoir plusieurs comportements selon l'objet utilisé. ◆ : `virtual` (autorise la redéfinition dans une classe enfant), `override` (redéfinit le comportement), `new` (masque la méthode parente — sans polymorphisme, à éviter). ◆ **ex:** : une `List<Instrument>` contient actions, obligations, futures. Appeler `Evaluate()` sur chacun déclenche la bonne formule selon l'instrument réel."
  },
  {
    "question": "SOLID — SRP & OCP",
    "answer": "**SRP** (Single Responsibility) : une classe = une seule responsabilité. ◆ Une classe `TradeReporter` qui calcule le P&L, génère le PDF et envoie l'email a trois raisons de changer — découpez-la en trois classes distinctes. ◆ **OCP** (Open/Closed) : ouvert à l'extension, fermé à la modification. ◆ Ajouter un nouveau broker → créer `NewBrokerFeeCalculator : IFeeCalculator`. Aucune ligne du moteur existant n'est modifiée — zéro régression possible."
  },
  {
    "question": "SOLID — LSP & ISP",
    "answer": "**LSP** (Liskov Substitution) : une classe dérivée doit pouvoir remplacer sa classe parent sans casser le programme. ◆ Si `FuturesEngine.ComputeGreeks()` lève `NotImplementedException`, le programme se brise — violation LSP. Revoir la hiérarchie ou utiliser une interface plus ciblée. ◆ **ISP** (Interface Segregation) : préférer plusieurs interfaces spécialisées plutôt qu'une grosse interface générale. ◆ `IOrderReader`, `IOrderWriter`, `IOrderNotifier` — un service de reporting n'implémente que ce dont il a besoin."
  },
  {
    "question": "SOLID — DIP & Injection de dépendances",
    "answer": "**DIP** (Dependency Inversion) : dépendre d'abstractions plutôt que d'implémentations concrètes. ◆ Le moteur de risk reçoit `IMarketDataService` — pas `new MarketDataService()`. Changer de source de données ne touche pas au domaine métier. ◆ **Durées de vie DI** : `AddTransient` (nouvelle instance à chaque appel), `AddScoped` (une instance par requête HTTP — idéal pour `DbContext`), `AddSingleton` (une seule instance pour toute la durée du process). ◆ **Piège** : service avec état utilisateur en `AddSingleton` → partage involontaire entre traders."
  },
  {
    "question": "ACID — Intégrité des transactions",
    "answer": "**A**tomicité : tout ou rien — débiter le compte ET enregistrer le trade forment une seule unité. ◆ **C**ohérence : la base reste dans un état valide après chaque transaction. ◆ **I**solation : deux trades concurrents ne se lisent pas à mi-chemin. ◆ **D**urabilité : un trade confirmé survit à un crash serveur. ◆ **En C#** : `TransactionScope` (atomicité), `IsolationLevel.ReadCommitted` (défaut SQL Server — bloque les dirty reads), `IsolationLevel.Serializable` (le plus strict — risque de deadlocks sous charge)."
  },
  {
    "question": "Design Patterns — Builder & Singleton",
    "answer": "**Builder** : construire un objet complexe étape par étape via une Fluent API. ◆ `new OrderBuilder().ForSymbol(\"BNP\").Strike(50).Buy(100).Build()` — lisible, validé dans `Build()`, sans constructeur à 12 paramètres. ◆ **Singleton** : garantir une seule instance dans tout le process. ◆ En C# : `Lazy<T>` assure l'initialisation thread-safe sans `lock` explicite. ◆ : constructeur `private`, instance exposée via propriété statique, `Lazy<T>` pour la sécurité multi-thread."
  },
  {
    "question": "Design Patterns — Observer & Strategy",
    "answer": "**Observer** : notifier automatiquement des abonnés lorsqu'un événement se produit, sans couplage direct entre la source et les écouteurs. ◆ En C# : `event`, `EventHandler<T>`, `IObservable<T>`. ◆ **ex:** : un changement de prix notifie l'UI, le moteur de risk et les alertes simultanément. ◆ **Strategy** : changer d'algorithme à la volée en injectant une implémentation différente. ◆ En C# : injection d'`IRiskStrategy` au runtime. ◆ **ex:** : basculer de `StandardVaRStrategy` à `StressTestStrategy` lors d'une annonce Fed — sans recompiler."
  },
  {
    "question": "Design Patterns — Chain of Responsibility & Repository",
    "answer": "**Chain of Responsibility** : faire passer une requête à travers une chaîne de handlers, chacun ayant une seule responsabilité. ◆ Un ordre traverse : limite de position → KYC → heure de marché → liquidité. Si un handler échoue, la chaîne s'arrête avec un motif clair. ◆ **Repository** : abstraire l'accès aux données derrière une interface pour découpler le domaine métier de l'infrastructure. ◆ `ITradeRepository` en prod → EF Core. En tests → `InMemoryTradeRepository`. Même code métier, deux infrastructures."
  }
];

const questions = {
  moyen: [
    {
      "question": "À quoi sert le mot-clé `virtual` en C# ?",
      "options": [
        "Empêcher toute classe d'en hériter.",
        "Autoriser une classe enfant à redéfinir la méthode via `override`.",
        "Générer automatiquement une interface.",
        "Restreindre l'accès à la même assembly."
      ],
      "answer": "Autoriser une classe enfant à redéfinir la méthode via `override`.",
      "explanation": "Sans `virtual`, `override` est interdit par le compilateur. La classe enfant est forcée d'utiliser `new`, qui masque sans polymorphisme. ex: : `Derivative d = new EquityOption()` appellera `Derivative.Evaluate()`, pas la formule de l'option. Toujours `virtual` + `override` pour un dispatch correct."
    },
    {
      "question": "Quels sont les mots-clés caractéristiques du principe d'Encapsulation en C# ?",
      "options": [
        "`virtual`, `override`, `new`",
        "`private`, `public`, `get`, `set`",
        "`:`, `base`, `protected`",
        "`interface`, `abstract`, `sealed`"
      ],
      "answer": "`private`, `public`, `get`, `set`",
      "explanation": "Encapsulation = contrôler l'accès aux données d'une classe. `private` verrouille les champs internes, `public` expose ce qui doit l'être, `get`/`set` permettent un contrôle fin en lecture/écriture. ex: : `Order._price` est `private`, la propriété `Price { get; private set; }` empêche toute modification externe."
    },
    {
      "question": "Quels mots-clés sont caractéristiques de l'Héritage en C# ?",
      "options": [
        "`private`, `public`, `get`, `set`",
        "`virtual`, `override`, `sealed`",
        "`:`, `base`, `protected`",
        "`interface`, `abstract`, `new`"
      ],
      "answer": "`:`, `base`, `protected`",
      "explanation": "Héritage : `:` pour étendre une classe (`EquityOption : Derivative`), `base` pour appeler le constructeur ou une méthode du parent, `protected` pour partager un membre avec les classes enfants sans l'exposer publiquement. Ces trois mots-clés structurent la relation parent-enfant."
    },
    {
      "question": "Les mots-clés `virtual` et `override` sont les caractéristiques de quel concept POO ?",
      "options": [
        "Encapsulation",
        "Abstraction",
        "Héritage",
        "Polymorphisme"
      ],
      "answer": "Polymorphisme",
      "explanation": "Polymorphisme = une méthode, plusieurs comportements selon l'objet réel. `virtual` sur la méthode parente autorise la redéfinition ; `override` dans la classe enfant fournit la nouvelle implémentation. Sans ces deux mots-clés ensemble, il n'y a pas de polymorphisme réel — seulement du masquage (`new`)."
    },
    {
      "question": "Les mots-clés `interface` et `abstract` sont les caractéristiques de quel concept POO ?",
      "options": [
        "Polymorphisme",
        "Héritage",
        "Abstraction",
        "Encapsulation"
      ],
      "answer": "Abstraction",
      "explanation": "Abstraction = exposer l'essentiel, cacher la complexité. `interface` définit un contrat pur (signatures uniquement), `abstract` permet une classe hybride avec code commun + méthodes à implémenter. ex: : `IPricingEngine` expose `Calculate(trade)` — le desk ne sait pas si c'est Black-Scholes ou Monte Carlo."
    },
    {
      "question": "Quelle est la différence entre une `interface` et une `abstract class` en C# ?",
      "options": [
        "Une interface peut stocker des champs privés.",
        "Une abstract class peut contenir du code et un état partagé ; une interface définit un contrat pur.",
        "Une interface est thread-safe par défaut.",
        "On peut hériter de plusieurs abstract classes."
      ],
      "answer": "Une abstract class peut contenir du code et un état partagé ; une interface définit un contrat pur.",
      "explanation": "C# interdit l'héritage multiple de classes, mais autorise plusieurs interfaces. Règle pratique : plusieurs classes partagent du code → `abstract class`. Elles partagent seulement un contrat → `interface`. ex: : `abstract class BaseInstrument` partage la validation de notional ; `IPricingEngine` définit le contrat de calcul."
    },
    {
      "question": "Quelle durée de vie DI crée une seule instance partagée pour toute la durée du processus ?",
      "options": [
        "AddTransient",
        "AddScoped",
        "AddSingleton",
        "AddStatic"
      ],
      "answer": "AddSingleton",
      "explanation": "AddSingleton = une instance pour toute la vie du processus. AddScoped = une instance par requête HTTP (idéal pour DbContext EF Core). AddTransient = nouvelle instance à chaque injection (services légers, sans état). AddStatic n'existe pas dans ASP.NET Core."
    },
    {
      "question": "Quel principe SOLID est violé si `FuturesEngine` hérite de `DerivativeEngine` mais lève `NotImplementedException` dans `ComputeGreeks()` ?",
      "options": [
        "SRP — Single Responsibility Principle",
        "OCP — Open/Closed Principle",
        "LSP — Liskov Substitution Principle",
        "DIP — Dependency Inversion Principle"
      ],
      "answer": "LSP — Liskov Substitution Principle",
      "explanation": "LSP : une classe dérivée doit pouvoir remplacer sa classe parent sans casser le programme. `NotImplementedException` signifie que le contrat n'est pas honoré. Solution : revoir la hiérarchie ou utiliser une interface plus ciblée qui ne force pas `FuturesEngine` à implémenter ce qu'il ne sait pas faire."
    },
    {
      "question": "Dans ACID, que garantit l'Atomicité pour un trade en salle de marché ?",
      "options": [
        "Le trade s'exécute en moins d'une milliseconde.",
        "Toutes les opérations du trade réussissent ensemble ou aucune n'est enregistrée.",
        "Deux trades simultanés ne peuvent pas s'exécuter en même temps.",
        "Le trade est automatiquement chiffré en base."
      ],
      "answer": "Toutes les opérations du trade réussissent ensemble ou aucune n'est enregistrée.",
      "explanation": "Atomicité = tout ou rien. Débiter le compte ET enregistrer l'exécution forment une seule unité logique. Si la base plante entre les deux, `TransactionScope` déclenche un rollback automatique — aucun écart comptable possible."
    },
    {
      "question": "Quel principe SOLID justifie de séparer le calcul du P&L, la génération du PDF et l'envoi d'email en trois classes distinctes ?",
      "options": [
        "OCP — Open/Closed Principle",
        "LSP — Liskov Substitution Principle",
        "SRP — Single Responsibility Principle",
        "ISP — Interface Segregation Principle"
      ],
      "answer": "SRP — Single Responsibility Principle",
      "explanation": "SRP : une classe = une seule raison de changer. Une classe qui calcule, génère et envoie a trois raisons de changer. Si le format PDF évolue, on ne risque pas de casser le calcul du P&L. Découper = classes plus petites, plus testables, plus maintenables."
    },
    {
      "question": "Vous voyez ce code : `class FXOption : Derivative { protected decimal _notional; public override decimal Evaluate() { ... } }`. Quels concepts POO sont présents ?",
      "options": [
        "Encapsulation uniquement.",
        "Héritage (`:`), Encapsulation (`protected`), Polymorphisme (`override`).",
        "Abstraction (`abstract`) et Polymorphisme.",
        "Héritage et Abstraction uniquement."
      ],
      "answer": "Héritage (`:`), Encapsulation (`protected`), Polymorphisme (`override`).",
      "explanation": "`:` = Héritage (FXOption étend Derivative). `protected` = Encapsulation (le champ est partagé avec les enfants mais caché de l'extérieur). `override` = Polymorphisme (la méthode parente déclarée `virtual` est redéfinie). Lire un code et identifier ces mots-clés permet de diagnostiquer immédiatement la structure POO."
    },
    {
      "question": "Associez chaque mot-clé à son concept POO : `private` → ? / `override` → ? / `:` → ?",
      "options": [
        "`private` → Héritage / `override` → Encapsulation / `:` → Polymorphisme",
        "`private` → Encapsulation / `override` → Polymorphisme / `:` → Héritage",
        "`private` → Abstraction / `override` → Héritage / `:` → Encapsulation",
        "`private` → Polymorphisme / `override` → Abstraction / `:` → Encapsulation"
      ],
      "answer": "`private` → Encapsulation / `override` → Polymorphisme / `:` → Héritage",
      "explanation": "Correspondances fondamentales : `private`/`public`/`get`/`set` = Encapsulation. `virtual`/`override` = Polymorphisme. `:`/`base`/`protected` = Héritage. `interface`/`abstract` = Abstraction. Mémoriser ces associations permet d'identifier instantanément le concept derrière chaque mot-clé."
    },
    {
      "question": "Quel concept POO est activé uniquement quand les deux mots-clés `virtual` ET `override` sont présents ensemble ?",
      "options": [
        "Encapsulation",
        "Héritage",
        "Polymorphisme",
        "Abstraction"
      ],
      "answer": "Polymorphisme",
      "explanation": "`virtual` seul = permission de redéfinir, mais pas de polymorphisme actif. `override` seul = erreur de compilation (pas de `virtual` sur la méthode parente). C'est la combinaison `virtual` + `override` qui active le dispatch dynamique : l'objet réel détermine quelle méthode s'exécute, pas le type déclaré."
    },
    {
      "question": "Comment fonctionne le pattern Observer pour distribuer les mises à jour de prix ex: ?",
      "options": [
        "La source appelle directement les méthodes de mise à jour de chaque composant.",
        "Les composants s'abonnent via `event` ou `IObservable<T>` et sont notifiés automatiquement.",
        "Un thread dédié interroge la source toutes les secondes.",
        "Les prix sont stockés dans une variable `static` partagée."
      ],
      "answer": "Les composants s'abonnent via `event` ou `IObservable<T>` et sont notifiés automatiquement.",
      "explanation": "Observer découple la source (market feed) des abonnés (UI, moteur risk, alertes). `event`/`EventHandler<T>` pour les cas simples. `IObservable<T>` (Rx.NET) pour composer, filtrer et throttler le flux de ticks sans modifier la source. Zéro couplage direct — ajouter un abonné ne touche pas à la source."
    },
    {
      "question": "Quelle est la bonne façon de construire un ordre financier complexe via le pattern Builder ?",
      "options": [
        "Passer tous les paramètres dans un tableau `object[]`.",
        "Utiliser une Fluent API : `new OrderBuilder().ForSymbol(\"BNP\").Strike(50).Buy(100).Build()`.",
        "Créer une classe statique avec des méthodes Factory.",
        "Passer un `Dictionary<string, object>` au constructeur."
      ],
      "answer": "Utiliser une Fluent API : `new OrderBuilder().ForSymbol(\"BNP\").Strike(50).Buy(100).Build()`.",
      "explanation": "Builder = construire un objet complexe étape par étape via une Fluent API lisible. La validation est centralisée dans `Build()`. Les paramètres optionnels sont naturellement gérés. Un constructeur à 12 paramètres est illisible et source d'erreurs de positionnement."
    },
    {
      "question": "Quelle lettre de SOLID garantit qu'ajouter un nouveau broker ne nécessite pas de modifier le moteur de calcul des frais existant ?",
      "options": [
        "S — Single Responsibility",
        "O — Open/Closed",
        "L — Liskov Substitution",
        "I — Interface Segregation"
      ],
      "answer": "O — Open/Closed",
      "explanation": "OCP : ouvert à l'extension, fermé à la modification. Nouveau broker = nouvelle classe `NewBrokerFeeCalculator : IFeeCalculator`, enregistrée dans le DI. Zéro ligne modifiée dans le moteur existant = zéro régression. C'est l'essence de l'architecture évolutive ex:."
    },
    {
      "question": "À quoi sert `protected` dans une hiérarchie d'instruments financiers ?",
      "options": [
        "Il rend le membre accessible depuis toute l'assembly.",
        "Il permet aux classes enfants d'accéder au membre sans l'exposer publiquement.",
        "Il empêche toute redéfinition dans les classes dérivées.",
        "Il garantit la thread-safety du membre."
      ],
      "answer": "Il permet aux classes enfants d'accéder au membre sans l'exposer publiquement.",
      "explanation": "`protected` = Encapsulation + Héritage combinés. Le champ `_notional` dans `Derivative` est accessible par `EquityOption` et `FXOption`, mais invisible du reste du code. C'est la manière de partager un état commun dans une hiérarchie sans rompre l'encapsulation."
    },
    {
      "question": "Quelle est la différence concrète entre `AddScoped` et `AddTransient` dans ASP.NET Core ?",
      "options": [
        "AddScoped recrée le service à chaque injection, AddTransient le partage par requête.",
        "AddScoped crée une instance par requête HTTP ; AddTransient crée une nouvelle instance à chaque injection.",
        "AddScoped et AddTransient sont identiques, AddTransient est juste plus rapide.",
        "AddScoped est réservé aux services de base de données uniquement."
      ],
      "answer": "AddScoped crée une instance par requête HTTP ; AddTransient crée une nouvelle instance à chaque injection.",
      "explanation": "AddScoped garantit qu'un seul `DbContext` est utilisé dans toute la requête — cohérence de l'unité de travail. AddTransient convient aux services légers sans état (calculateurs, formateurs). Confondre les deux peut introduire des bugs subtils de partage d'état entre injections."
    },
    {
      "question": "Quel concept ACID assure qu'un trade reste enregistré même après un crash serveur ?",
      "options": [
        "Atomicité",
        "Cohérence",
        "Isolation",
        "Durabilité"
      ],
      "answer": "Durabilité",
      "explanation": "Durabilité = un trade confirmé (committed) survit à n'importe quel crash. Le moteur de base de données écrit sur disque avant de confirmer la transaction. En SQL Server, le transaction log garantit qu'aucune donnée committée ne peut être perdue, même en cas de coupure électrique."
    },
    {
      "question": "Quel principe SOLID est respecté quand on déclare `IOrderReader`, `IOrderWriter` et `IOrderNotifier` au lieu d'une seule interface `IOrderService` ?",
      "options": [
        "SRP — Single Responsibility",
        "OCP — Open/Closed",
        "LSP — Liskov Substitution",
        "ISP — Interface Segregation"
      ],
      "answer": "ISP — Interface Segregation",
      "explanation": "ISP : préférer plusieurs interfaces spécialisées à une grosse interface générale. Un service de reporting n'implémente que `IOrderReader`. Un service d'exécution implémente `IOrderWriter`. Chacun dépend uniquement de ce dont il a besoin — zéro méthode vide, zéro `NotImplementedException`."
    },
    {
      "question": "Le code suivant respecte quel principe SOLID : `class RiskEngine { private IMarketDataService _mds; RiskEngine(IMarketDataService mds) { _mds = mds; } }` ?",
      "options": [
        "SRP — une seule responsabilité.",
        "OCP — ouvert à l'extension.",
        "DIP — dépendre d'abstractions plutôt que d'implémentations.",
        "LSP — substitution de Liskov."
      ],
      "answer": "DIP — dépendre d'abstractions plutôt que d'implémentations.",
      "explanation": "DIP : le `RiskEngine` reçoit `IMarketDataService` (interface) par injection, jamais `new MarketDataService()` en dur. Changer de source de données (Bloomberg → Reuters) ne touche pas au moteur de risk. C'est le fondement de l'architecture découplée et testable."
    }
  ],
  avance: [
    {
      "question": "Vous voyez : `private static readonly Lazy<MarketDataFeed> _instance = new Lazy<MarketDataFeed>(() => new MarketDataFeed()); public static MarketDataFeed Instance => _instance.Value;`. Quel design pattern est implémenté ?",
      "options": [
        "Factory Method",
        "Builder",
        "Singleton",
        "Prototype"
      ],
      "answer": "Singleton",
      "explanation": "Indicateurs clés : constructeur `private`, instance `static` + `readonly`, `Lazy<T>` pour l'initialisation thread-safe. Ces trois éléments ensemble = Singleton. `Lazy<T>` garantit qu'un seul thread instancie l'objet. Idéal pour une connexion market data partagée dans tout le processus."
    },
    {
      "question": "Quel concept POO retrouve-t-on au cœur du pattern Singleton, et pourquoi ?",
      "options": [
        "Polymorphisme (`virtual`, `override`) — pour redéfinir l'instance.",
        "Encapsulation (`private` constructeur, `public` propriété statique) — pour contrôler la création.",
        "Héritage (`:`, `base`) — pour partager l'instance entre classes.",
        "Abstraction (`interface`) — pour définir le contrat de l'instance unique."
      ],
      "answer": "Encapsulation (`private` constructeur, `public` propriété statique) — pour contrôler la création.",
      "explanation": "Le Singleton repose entièrement sur l'Encapsulation : le constructeur `private` empêche toute instanciation externe, la propriété `static` expose le seul point d'accès contrôlé. Sans encapsulation, n'importe quel code pourrait créer plusieurs instances — le pattern serait cassé."
    },
    {
      "question": "Vous voyez une classe avec `event EventHandler<PriceChangedArgs> PriceChanged;` et des méthodes `Subscribe()`/`Unsubscribe()`. Quel pattern est implémenté ?",
      "options": [
        "Strategy",
        "Observer",
        "Chain of Responsibility",
        "Builder"
      ],
      "answer": "Observer",
      "explanation": "Indicateurs clés : `event`, handlers d'abonnement/désabonnement, notification automatique des abonnés. Observer = une source notifie N abonnés sans les connaître directement. ex: : le market feed publie `PriceChanged`, l'UI, le moteur risk et les alertes s'abonnent indépendamment."
    },
    {
      "question": "Quel concept POO est fondamental dans le pattern Observer, et pourquoi ?",
      "options": [
        "Encapsulation — pour cacher les abonnés à l'intérieur de la source.",
        "Polymorphisme — la source appelle une méthode de notification, chaque abonné l'implémente différemment.",
        "Héritage — tous les abonnés héritent d'une classe `Observer` commune.",
        "Abstraction — pour masquer la source de données aux abonnés."
      ],
      "answer": "Polymorphisme — la source appelle une méthode de notification, chaque abonné l'implémente différemment.",
      "explanation": "Le polymorphisme permet à la source d'appeler `OnPriceChanged()` sur une liste d'`IObserver` sans savoir si c'est l'UI, le moteur risk ou les alertes. Chaque abonné implémente sa propre réaction (`virtual`/`override` ou via interface). C'est la puissance du dispatch dynamique appliqué au pattern Observer."
    },
    {
      "question": "Vous voyez : `class OrderValidator { private IValidator _next; public void SetNext(IValidator next) { _next = next; } public void Validate(Order o) { if (!Check(o)) return; _next?.Validate(o); } }`. Quel pattern ?",
      "options": [
        "Observer",
        "Strategy",
        "Chain of Responsibility",
        "Decorator"
      ],
      "answer": "Chain of Responsibility",
      "explanation": "Indicateurs clés : référence vers le `_next` handler, méthode `SetNext()` pour chaîner, propagation conditionnelle (`_next?.Validate(o)`). Chain of Responsibility = chaque handler traite ce qu'il peut et passe au suivant. ex: : limite de position → KYC → liquidité, chaque règle dans son propre handler."
    },
    {
      "question": "Le pattern Strategy repose principalement sur quel(s) concept(s) POO ?",
      "options": [
        "Encapsulation uniquement — les algorithmes sont cachés dans des classes privées.",
        "Héritage — chaque stratégie hérite d'une classe Strategy commune.",
        "Abstraction + Polymorphisme — une interface commune, des implémentations différentes injectées au runtime.",
        "Héritage + Encapsulation uniquement."
      ],
      "answer": "Abstraction + Polymorphisme — une interface commune, des implémentations différentes injectées au runtime.",
      "explanation": "Strategy : `IRiskStrategy` (Abstraction) définit le contrat `Calculate()`. `StandardVaRStrategy` et `StressTestStrategy` l'implémentent différemment (Polymorphisme via `override`). Le moteur de risk appelle `_strategy.Calculate()` sans savoir laquelle s'exécute. DIP renforce : dépendre de l'interface, pas des classes concrètes."
    },
    {
      "question": "Quel concept POO est violé si on utilise `new` au lieu de `override` dans `EquityOption.Evaluate()` ?",
      "options": [
        "Encapsulation — les données de l'option sont exposées.",
        "Polymorphisme — la méthode exécutée dépend du type déclaré, pas de l'objet réel.",
        "Héritage — la classe enfant ne peut plus étendre la classe parente.",
        "Abstraction — le contrat de l'interface n'est plus respecté."
      ],
      "answer": "Polymorphisme — la méthode exécutée dépend du type déclaré, pas de l'objet réel.",
      "explanation": "`new` masque sans polymorphisme : `Derivative d = new EquityOption()` → `d.Evaluate()` appelle `Derivative.Evaluate()`, pas la formule de l'option. Bug silencieux, dangereux en pricing. `new` casse le polymorphisme car le dispatch est statique (type déclaré) plutôt que dynamique (objet réel)."
    },
    {
      "question": "Le principe SRP de SOLID est la version architecturale de quel concept POO ?",
      "options": [
        "Polymorphisme — chaque classe peut avoir plusieurs comportements.",
        "Encapsulation — chaque classe regroupe une seule responsabilité cohésive.",
        "Héritage — chaque classe hérite d'une seule classe parente.",
        "Abstraction — chaque classe expose une seule interface."
      ],
      "answer": "Encapsulation — chaque classe regroupe une seule responsabilité cohésive.",
      "explanation": "SRP est une application directe de l'Encapsulation à l'échelle architecturale : regrouper ce qui change ensemble, séparer ce qui change indépendamment. Une classe qui calcule le P&L ET envoie l'email mélange deux responsabilités distinctes. L'Encapsulation garantit que chaque classe est un bloc cohésif avec une seule raison de changer."
    },
    {
      "question": "Un service `PositionCache` (AddSingleton) contient un `Dictionary<string, decimal>` mis à jour en temps réel. Quel risque ?",
      "options": [
        "Le Dictionary se réinitialisera à chaque déploiement.",
        "Des race conditions provoqueront des corruptions silencieuses ou des exceptions en production.",
        "L'instance consommera trop de mémoire.",
        "ASP.NET Core interdira l'injection dans les controllers."
      ],
      "answer": "Des race conditions provoqueront des corruptions silencieuses ou des exceptions en production.",
      "explanation": "`Dictionary<TKey,TValue>` n'est pas thread-safe. Avec AddSingleton, plusieurs threads accèdent simultanément — les opérations de resize causent corruptions ou `InvalidOperationException`. Solution : `ConcurrentDictionary<TKey,TValue>`, ou `ReaderWriterLockSlim` pour optimiser lectures fréquentes / écritures rares."
    },
    {
      "question": "Comment implémenter un Singleton thread-safe en C# sans `lock` explicite ?",
      "options": [
        "Déclarer l'instance `volatile` dans le constructeur.",
        "Utiliser `Lazy<T>` — initialisation tardive thread-safe intégrée par .NET.",
        "Marquer la classe `sealed` et `static`.",
        "Sérialiser l'accès via un `Mutex` distribué Redis."
      ],
      "answer": "Utiliser `Lazy<T>` — initialisation tardive thread-safe intégrée par .NET.",
      "explanation": "`Lazy<T>` garantit qu'un seul thread instancie l'objet (mode `ExecutionAndPublication` par défaut). Plus lisible et plus sûr que le double-checked locking, qui produit des bugs subtils si `volatile` est oublié. Idéal pour une connexion market data ou une configuration de pricing partagée."
    },
    {
      "question": "Quel `IsolationLevel` protège contre les Dirty Reads tout en restant performant pour un desk à fort débit ?",
      "options": [
        "ReadUncommitted",
        "ReadCommitted",
        "RepeatableRead",
        "Serializable"
      ],
      "answer": "ReadCommitted",
      "explanation": "`ReadCommitted` (défaut SQL Server) interdit de lire des données non committées. Suffisant pour la majorité des lectures ex:. `Serializable` évite aussi les Phantom Reads mais génère des range locks et des deadlocks sous forte concurrence. `ReadUncommitted` est dangereux : on peut lire un trade annulé."
    },
    {
      "question": "Le pattern Repository repose sur quel principe SOLID pour permettre les tests unitaires sans base de données ?",
      "options": [
        "SRP — chaque repository a une seule responsabilité.",
        "OCP — le repository est ouvert à l'extension.",
        "DIP — le domaine dépend de `ITradeRepository` (abstraction), pas d'EF Core directement.",
        "LSP — le repository peut remplacer n'importe quel accès aux données."
      ],
      "answer": "DIP — le domaine dépend de `ITradeRepository` (abstraction), pas d'EF Core directement.",
      "explanation": "DIP + Repository = testabilité maximale. Le domaine dépend de `ITradeRepository`. En test : `InMemoryTradeRepository`. En prod : `EfCoreTradeRepository`. Le moteur de risk ne sait pas la différence. Changer d'ORM ne touche pas au domaine. C'est l'application directe du DIP à la couche d'accès aux données."
    },
    {
      "question": "Vous lisez ce code : `services.AddTransient<IPricingEngine, BlackScholesPricingEngine>();`. Quels principes SOLID sont appliqués ?",
      "options": [
        "SRP uniquement — la classe a une seule responsabilité.",
        "DIP + OCP — dépendre d'une abstraction (`IPricingEngine`) et pouvoir changer d'implémentation sans modifier le code appelant.",
        "LSP + ISP — substitution et interface séparée.",
        "OCP uniquement — le code est ouvert à l'extension."
      ],
      "answer": "DIP + OCP — dépendre d'une abstraction (`IPricingEngine`) et pouvoir changer d'implémentation sans modifier le code appelant.",
      "explanation": "DIP : le code appelant dépend de `IPricingEngine`, pas de `BlackScholesPricingEngine` directement. OCP : pour utiliser un modèle Monte Carlo, on crée `MonteCarloPricingEngine : IPricingEngine` et on change l'enregistrement DI — zéro modification dans le code métier. Ces deux principes fonctionnent naturellement ensemble."
    },
    {
      "question": "Quels principes SOLID sont renforcés quand chaque handler du Chain of Responsibility ne contient qu'une seule règle ?",
      "options": [
        "OCP uniquement.",
        "LSP uniquement.",
        "SRP (une règle par handler) et OCP (ajouter une règle = nouveau handler sans modifier les existants).",
        "DIP uniquement."
      ],
      "answer": "SRP (une règle par handler) et OCP (ajouter une règle = nouveau handler sans modifier les existants).",
      "explanation": "SRP : chaque handler a une seule règle de validation. OCP : ajouter une vérification ESG = créer un nouveau handler et l'insérer dans la chaîne, sans toucher aux existants. Chain of Responsibility est l'un des rares patterns qui renforce naturellement deux principes SOLID simultanément."
    },
    {
      "question": "Le principe OCP est la version SOLID de quel mécanisme POO ?",
      "options": [
        "Encapsulation — cacher les détails d'implémentation.",
        "Polymorphisme + Abstraction — étendre via de nouvelles implémentations d'une interface, sans modifier le code existant.",
        "Héritage — étendre une classe en créant une classe fille.",
        "Polymorphisme seul — redéfinir les méthodes existantes."
      ],
      "answer": "Polymorphisme + Abstraction — étendre via de nouvelles implémentations d'une interface, sans modifier le code existant.",
      "explanation": "OCP s'appuie sur l'Abstraction (interface `IFeeCalculator`) et le Polymorphisme (chaque implémentation produit un résultat différent). 'Ouvert à l'extension' = créer une nouvelle implémentation. 'Fermé à la modification' = le code appelant ne change pas car il dépend de l'interface. C'est le polymorphisme mis au service de l'architecture."
    },
    {
      "question": "Pourquoi préférer `IObservable<MarketTick>` à un `event` standard en haute fréquence ?",
      "options": [
        "Car `event` ne supporte pas le multi-threading.",
        "Car `IObservable<T>` permet de composer, filtrer et throttler le flux sans modifier la source.",
        "Car `IObservable<T>` est deux fois plus rapide que les delegates.",
        "Car les `event` sont dépréciés depuis .NET 6."
      ],
      "answer": "Car `IObservable<T>` permet de composer, filtrer et throttler le flux sans modifier la source.",
      "explanation": "`IObservable<T>` (Rx.NET) : `ticks.Where(t => t.Symbol == \"BNP\").Throttle(100ms).Subscribe(Update)`. Filtrage, groupement, rate-limiting — sans toucher la source. Un `event` standard ne permet pas cette composition. Pattern Observer puissant + SRP respecté = architecture réactive propre pour le market data."
    },
    {
      "question": "Comment le pattern Strategy repose-t-il sur DIP pour permettre le changement de modèle VaR sans modifier le moteur ?",
      "options": [
        "Via un `switch/case` sur le type de modèle.",
        "Le moteur dépend de `IRiskStrategy` (abstraction) ; une nouvelle implémentation est injectée sans toucher au moteur.",
        "En héritant du modèle précédent et en surchargeant toutes ses méthodes.",
        "En rechargeant la configuration JSON à chaud."
      ],
      "answer": "Le moteur dépend de `IRiskStrategy` (abstraction) ; une nouvelle implémentation est injectée sans toucher au moteur.",
      "explanation": "Strategy + DIP = le moteur de risk dépend de `IRiskStrategy`. On injecte `StandardVaRStrategy` en temps normal, `StressTestStrategy` lors d'une annonce Fed. DIP assure que le moteur ne connaît pas les implémentations concrètes. Strategy fournit le mécanisme d'échange. Les deux principes se complètent naturellement."
    },
    {
      "question": "Pourquoi une `IFinancialInstrument` avec 20 méthodes viole-t-elle ISP ?",
      "options": [
        "Elle ralentit les performances à cause du dispatch virtuel.",
        "Elle force chaque implémenteur à implémenter des méthodes non pertinentes pour son type.",
        "Elle empêche l'utilisation de Generics.",
        "Elle crée des problèmes de sérialisation JSON."
      ],
      "answer": "Elle force chaque implémenteur à implémenter des méthodes non pertinentes pour son type.",
      "explanation": "ISP : une action n'a pas de date d'expiry, un future n'a pas de coupon. Forcer tous les instruments à implémenter 20 méthodes produit des `NotImplementedException` et du code mort. Solution : `IExpirable`, `ICouponBearing`, `IMarginable` — interfaces ciblées et composables. Chaque classe implémente uniquement ce qui la concerne."
    },
    {
      "question": "Le LSP est la version SOLID de quel mécanisme POO, et quelle en est la condition ?",
      "options": [
        "Encapsulation — la classe enfant doit cacher plus de données que le parent.",
        "Héritage — la classe enfant peut étendre le parent sans jamais restreindre son comportement.",
        "Polymorphisme — la classe enfant redéfinit forcément toutes les méthodes du parent.",
        "Abstraction — la classe enfant implémente une interface différente du parent."
      ],
      "answer": "Héritage — la classe enfant peut étendre le parent sans jamais restreindre son comportement.",
      "explanation": "LSP est la règle d'or de l'Héritage : une classe dérivée doit honorer le contrat du parent. Étendre oui, restreindre non. `FuturesEngine` qui lève `NotImplementedException` dans `ComputeGreeks()` restreint le comportement — violation LSP. Le code client ne peut plus substituer `DerivativeEngine` par `FuturesEngine` sans risque."
    },
    {
      "question": "Pourquoi `TransactionScope` peut-il escalader vers une transaction distribuée (DTC) ?",
      "options": [
        "Car `TransactionScope` détecte les connexions multiples et active MS DTC si nécessaire.",
        "Car toutes les transactions SQL Server sont distribuées depuis .NET 5.",
        "Car `TransactionScope` utilise un lock pessimiste sur toutes les tables.",
        "Car le GC déclenche la promotion lors d'une collecte Gen2."
      ],
      "answer": "Car `TransactionScope` détecte les connexions multiples et active MS DTC si nécessaire.",
      "explanation": "`TransactionScope` surveille les connexions ouvertes. Deux connexions SQL différentes dans le même scope (base trades + base comptabilité) → escalade vers MS DTC. Cela peut être une surprise en production et nécessite que MS DTC soit configuré. Préférer une seule connexion par `TransactionScope` quand possible."
    },
    {
      "question": "Quels design patterns retrouve-t-on dans une architecture `ITradeRepository` + injection DI + tests via `InMemoryTradeRepository` ?",
      "options": [
        "Builder + Singleton.",
        "Repository + Strategy (on swap l'implémentation selon l'environnement).",
        "Observer + Chain of Responsibility.",
        "Factory Method + Prototype."
      ],
      "answer": "Repository + Strategy (on swap l'implémentation selon l'environnement).",
      "explanation": "Repository abstrait l'accès aux données derrière `ITradeRepository`. Strategy (au sens large) = l'implémentation concrète change selon le contexte : `EfCoreTradeRepository` en prod, `InMemoryTradeRepository` en tests. Les deux patterns s'appuient sur DIP et le polymorphisme pour permettre l'échange transparent d'implémentation."
    },
    {
      "question": "Pourquoi `IsolationLevel.Serializable` ne doit-il pas être le mode par défaut en salle de marché ?",
      "options": [
        "Car il désactive les index SQL Server.",
        "Car il pose des range locks qui génèrent des deadlocks sous forte concurrence.",
        "Car il est incompatible avec `TransactionScope`.",
        "Car il ne fonctionne qu'avec InnoDB."
      ],
      "answer": "Car il pose des range locks qui génèrent des deadlocks sous forte concurrence.",
      "explanation": "`Serializable` garantit zéro Phantom Read, mais au prix de range locks. Sous la charge d'une salle de marché (milliers de transactions/seconde), cela génère des deadlocks et timeouts. Compromis courant : `ReadCommitted` par défaut, `Serializable` uniquement pour les réconciliations comptables critiques."
    },
    {
      "question": "Pourquoi le Chain of Responsibility est-il préférable à un `if/else` monolithique pour valider un ordre ?",
      "options": [
        "Quand les règles sont fixes et ne changeront jamais.",
        "Quand chaque règle peut être ajoutée ou supprimée indépendamment sans modifier les autres.",
        "Quand toutes les règles doivent s'exécuter en parallèle.",
        "Quand la validation doit être sérialisée en JSON pour audit."
      ],
      "answer": "Quand chaque règle peut être ajoutée ou supprimée indépendamment sans modifier les autres.",
      "explanation": "Un `if/else` monolithique viole SRP et OCP : ajouter une règle implique de modifier et retester tout le bloc. Chain of Responsibility : ajouter une vérification ESG = créer un nouveau handler, l'insérer dans la chaîne. ex:, les règles de validation évoluent fréquemment (régulation, nouveaux produits) — ce pattern est naturellement adapté."
    },
    {
      "question": "Quel mécanisme POO retrouve-t-on dans le pattern Builder lorsqu'on appelle `.Build()` qui valide les invariants ?",
      "options": [
        "Polymorphisme — `.Build()` appelle des méthodes virtuelles.",
        "Encapsulation — le constructeur de l'objet final est `private`, seul `.Build()` peut le créer.",
        "Héritage — `OrderBuilder` hérite d'une classe `AbstractBuilder`.",
        "Abstraction — `.Build()` retourne une interface."
      ],
      "answer": "Encapsulation — le constructeur de l'objet final est `private`, seul `.Build()` peut le créer.",
      "explanation": "Builder utilise l'Encapsulation : le constructeur de `Order` est `private` (ou `internal`), seule la méthode `Build()` peut créer l'instance. Cela garantit que tout objet `Order` a passé la validation des invariants. Sans cette encapsulation, le pattern Builder n'offre aucune garantie d'intégrité."
    }
  ],
  expert: [
    {
      "question": "Vous analysez ce code : `public interface IPricingEngine { decimal Calculate(Trade t); }` + `class BSEngine : IPricingEngine { public decimal Calculate(Trade t) => ... }` + injection DI. Identifiez tous les concepts présents.",
      "options": [
        "Abstraction (`interface`) + DIP (injection) + OCP (nouvelle implémentation sans modifier le code appelant).",
        "Héritage + SRP + Singleton.",
        "Polymorphisme + Encapsulation + LSP uniquement.",
        "Observer + Strategy + Builder."
      ],
      "answer": "Abstraction (`interface`) + DIP (injection) + OCP (nouvelle implémentation sans modifier le code appelant).",
      "explanation": "`interface` = Abstraction POO. Injection de `IPricingEngine` = DIP (dépendre d'abstractions). Créer `MonteCarloPricingEngine : IPricingEngine` sans toucher au code appelant = OCP. Ce triptyque Abstraction + DIP + OCP est la base de toute architecture de trading extensible et testable."
    },
    {
      "question": "Pourquoi le pattern Repository améliore-t-il concrètement le respect du DIP dans une architecture C# ?",
      "options": [
        "Car il remplace `TransactionScope` par des appels HTTP REST.",
        "Car la logique métier dépend de `ITradeRepository` (abstraction) et non d'EF Core `DbContext` directement.",
        "Car il force l'utilisation de classes statiques pour l'accès aux données.",
        "Car il supprime le besoin d'interfaces dans la couche Domain."
      ],
      "answer": "Car la logique métier dépend de `ITradeRepository` (abstraction) et non d'EF Core `DbContext` directement.",
      "explanation": "DIP : le domaine dépend d'abstractions. Le moteur de risk appelle `ITradeRepository` — il ignore si les données viennent d'EF Core, d'Oracle ou d'un InMemory mock. Tests sans base, changement d'ORM sans toucher au domaine, architecture réellement découplée."
    },
    {
      "question": "Vous voyez ce code dans un handler de commande : `public class PlaceOrderHandler { private readonly IOrderRepository _repo; private readonly IRiskStrategy _risk; PlaceOrderHandler(IOrderRepository r, IRiskStrategy s) {...} }`. Identifiez les patterns et principes présents.",
      "options": [
        "Singleton + SRP uniquement.",
        "Repository + Strategy + DIP (injection par interface) + SRP (handler = une seule responsabilité).",
        "Observer + Builder + OCP.",
        "Chain of Responsibility + LSP + ISP."
      ],
      "answer": "Repository + Strategy + DIP (injection par interface) + SRP (handler = une seule responsabilité).",
      "explanation": "`IOrderRepository` = pattern Repository. `IRiskStrategy` = pattern Strategy. Injection par interfaces = DIP. Le handler n'a qu'une responsabilité : orchestrer la pose d'un ordre = SRP. C'est l'architecture CQRS typique d'un trading desk : chaque handler est une unité atomique, testable, découplée."
    },
    {
      "question": "En DDD, pourquoi l'agrégat `Order` ne doit-il jamais exposer `public List<Execution> Executions` directement ?",
      "options": [
        "Car `List<T>` n'est pas sérialisable par System.Text.Json.",
        "Car exposer la collection permet à du code externe de modifier l'agrégat sans passer par ses invariants métier.",
        "Car les performances de `List<T>` sont insuffisantes.",
        "Car EF Core ne peut pas mapper une `List<T>` publique."
      ],
      "answer": "Car exposer la collection permet à du code externe de modifier l'agrégat sans passer par ses invariants métier.",
      "explanation": "Encapsulation au niveau DDD : l'agrégat est le gardien de ses invariants. `Executions.Add()` depuis l'extérieur contourne les règles (ex : vérifier que l'ordre n'est pas `Filled`). Solution : `IReadOnlyCollection<Execution>` en propriété + méthode `AddExecution(e)` qui valide les invariants. C'est SRP + Encapsulation appliqués au domaine."
    },
    {
      "question": "Quel est le lien entre le pattern Singleton et l'Encapsulation POO ? Pourquoi ce lien est-il fondamental ?",
      "options": [
        "Le Singleton utilise l'Encapsulation pour protéger l'instance : constructeur `private`, accès via propriété `static` contrôlée.",
        "Le Singleton utilise le Polymorphisme pour permettre à chaque classe d'avoir sa propre instance.",
        "Le Singleton utilise l'Héritage pour partager l'instance entre classes filles.",
        "Le Singleton utilise l'Abstraction pour définir le contrat de l'instance unique."
      ],
      "answer": "Le Singleton utilise l'Encapsulation pour protéger l'instance : constructeur `private`, accès via propriété `static` contrôlée.",
      "explanation": "Sans Encapsulation, le Singleton est impossible. Le constructeur `private` est l'encapsulation qui empêche toute instanciation externe. La propriété `static` est le point d'accès contrôlé. `Lazy<T>` encapsule la logique thread-safe d'initialisation. Retirer l'encapsulation = n'importe quel code peut créer plusieurs instances."
    },
    {
      "question": "Vous lisez : `public abstract class BaseInstrument { protected decimal _notional; public abstract decimal Evaluate(); public string GetCurrency() => _currency; }`. Quels concepts POO identifiez-vous et quels patterns cela suggère-t-il ?",
      "options": [
        "Encapsulation uniquement — les champs sont protected.",
        "Abstraction (`abstract`) + Encapsulation (`protected`) + Héritage implicite. Suggère Template Method ou Strategy.",
        "Polymorphisme uniquement — `Evaluate()` est abstraite.",
        "Héritage + Singleton — l'instance est partagée."
      ],
      "answer": "Abstraction (`abstract`) + Encapsulation (`protected`) + Héritage implicite. Suggère Template Method ou Strategy.",
      "explanation": "`abstract class` = Abstraction. `protected _notional` = Encapsulation partagée avec les enfants. `abstract decimal Evaluate()` = contrat que chaque instrument doit implémenter. Ce combo `abstract class` + méthode abstraite est la signature du pattern Template Method (squelette commun, variation dans les enfants) ou d'une base pour Strategy."
    },
    {
      "question": "Quelle est la différence entre `override` et `new` en C#, et pourquoi `new` est-il dangereux dans un moteur de pricing ?",
      "options": [
        "`override` et `new` sont synonymes — seule la visibilité change.",
        "`new` masque la méthode parente sans polymorphisme : la méthode exécutée dépend du type déclaré, pas de l'objet réel.",
        "`new` est obligatoire quand la méthode parente n'est pas `virtual`.",
        "`override` ne fonctionne qu'avec des classes `abstract`."
      ],
      "answer": "`new` masque la méthode parente sans polymorphisme : la méthode exécutée dépend du type déclaré, pas de l'objet réel.",
      "explanation": "`Derivative d = new EquityOption()` → `d.Evaluate()` appelle `Derivative.Evaluate()`, pas la formule de l'option. Bug silencieux, catastrophique en pricing. `new` supprime le dispatch dynamique — le type déclaré gagne. ex:, toujours `virtual` + `override` pour que l'objet réel détermine le comportement."
    },
    {
      "question": "Pourquoi `Lazy<T>` est-il préférable au double-checked locking pour un Singleton en C# ?",
      "options": [
        "Car `Lazy<T>` utilise des registres CPU pour éviter les accès mémoire.",
        "Car `Lazy<T>` encapsule le pattern thread-safe et évite les bugs subtils du double-checked locking sans `volatile`.",
        "Car le double-checked locking est interdit depuis .NET 5.",
        "Car `Lazy<T>` est automatiquement sérialisable par EF Core."
      ],
      "answer": "Car `Lazy<T>` encapsule le pattern thread-safe et évite les bugs subtils du double-checked locking sans `volatile`.",
      "explanation": "Double-checked locking sans `volatile` peut produire une instance partiellement initialisée (modèle mémoire .NET). `Lazy<T>` (mode `ExecutionAndPublication`) gère cela en interne. Code plus lisible, plus sûr, moins de risques en revue de code. C'est l'Encapsulation de la complexité thread-safe."
    },
    {
      "question": "Vous voyez ACID appliqué à un trade : débiter le compte + enregistrer l'exécution + mettre à jour la position, le tout dans un `TransactionScope`. Quelle propriété ACID est prioritairement garantie, et quel concept C# l'implémente ?",
      "options": [
        "Isolation — `IsolationLevel.Serializable`.",
        "Atomicité — `TransactionScope` : tout ou rien, les trois opérations réussissent ensemble ou toutes sont rollback.",
        "Cohérence — les contraintes SQL Server.",
        "Durabilité — le transaction log SQL Server."
      ],
      "answer": "Atomicité — `TransactionScope` : tout ou rien, les trois opérations réussissent ensemble ou toutes sont rollback.",
      "explanation": "`TransactionScope` implémente l'Atomicité : débiter + exécuter + mettre à jour la position sont une seule unité logique. Si l'une échoue, `TransactionScope` rollback automatiquement les deux autres. Pas d'écart entre le compte et la position — intégrité comptable garantie. Cohérence, Isolation et Durabilité sont aussi présentes mais via d'autres mécanismes."
    },
    {
      "question": "Comment structurer les interfaces d'un service de trading pour respecter ISP dans une architecture CQRS ?",
      "options": [
        "Créer une seule interface `ITradingService` avec toutes les méthodes.",
        "Séparer `ITradeCommandService` (écriture) et `ITradeQueryService` (lecture), et les composer si nécessaire.",
        "Utiliser des abstract classes pour les commandes et des interfaces pour les queries.",
        "Implémenter une interface générique `IService<T>`."
      ],
      "answer": "Séparer `ITradeCommandService` (écriture) et `ITradeQueryService` (lecture), et les composer si nécessaire.",
      "explanation": "CQRS + ISP naturellement alignés. Les handlers de commandes dépendent de `ITradeCommandService`, les projections de `ITradeQueryService`. Un service de reporting n'a jamais besoin des méthodes d'écriture. Cette séparation facilite aussi le scaling : le côté query peut être répliqué indépendamment du côté command."
    },
    {
      "question": "Quel est le risque d'injecter un service `AddScoped` dans un `AddSingleton` dans ASP.NET Core (Captive Dependency) ?",
      "options": [
        "Le service Scoped sera recréé à chaque appel, annulant l'effet du Singleton.",
        "Le service Scoped sera capturé dans le Singleton et partagé entre toutes les requêtes.",
        "ASP.NET Core lèvera toujours une exception au démarrage.",
        "Le service Scoped sera automatiquement promu en Singleton."
      ],
      "answer": "Le service Scoped sera capturé dans le Singleton et partagé entre toutes les requêtes.",
      "explanation": "Captive Dependency : le Singleton capture l'instance Scoped à sa création. Cette instance unique est réutilisée pour toutes les requêtes suivantes. Un `DbContext` capturé ainsi partagera son `ChangeTracker` entre requêtes — corruption de données. ASP.NET Core détecte ce problème en mode Development via la validation du scope."
    },
    {
      "question": "Vous voyez ce pattern : `class KycHandler : IOrderValidator { private IOrderValidator _next; public void Validate(Order o) { if (!CheckKyc(o)) throw ...; _next?.Validate(o); } }`. Quel concept POO est fondamental ici, et quel principe SOLID est respecté ?",
      "options": [
        "Polymorphisme + SRP : chaque handler a une seule règle, le dispatch appelle le bon `Validate()`.",
        "Encapsulation + DIP : les données KYC sont cachées, le handler dépend d'une abstraction.",
        "Héritage + OCP : `KycHandler` hérite d'un handler abstrait.",
        "Abstraction + LSP : `IOrderValidator` garantit la substitution."
      ],
      "answer": "Polymorphisme + SRP : chaque handler a une seule règle, le dispatch appelle le bon `Validate()`.",
      "explanation": "Polymorphisme : `_next?.Validate(o)` appelle la méthode de l'objet réel dans la chaîne, que ce soit `LimitHandler`, `LiquidityHandler` ou `TimeHandler`. SRP : `KycHandler` ne contient que la règle KYC. Le dispatch dynamique via `IOrderValidator` permet à chaque handler d'être interchangeable et testable indépendamment."
    },
    {
      "question": "Comment implémenter correctement le pattern Unit of Work avec Repository pour garantir l'atomicité ?",
      "options": [
        "Ouvrir une transaction séparée dans chaque Repository.",
        "Partager un seul `DbContext` entre les Repositories, et appeler `SaveChanges()` une seule fois depuis la couche Application.",
        "Utiliser `TransactionScope` avec `Serializable` pour toutes les opérations.",
        "Injecter les Repositories en `AddSingleton` pour qu'ils partagent le même état."
      ],
      "answer": "Partager un seul `DbContext` entre les Repositories, et appeler `SaveChanges()` une seule fois depuis la couche Application.",
      "explanation": "Unit of Work = une seule transaction pour un ensemble d'opérations cohérentes. En EF Core, `DbContext` est naturellement une UnitOfWork : `SaveChanges()` committe toutes les modifications trackées. Les Repositories partagent le même `DbContext` (injecté en `AddScoped`). La couche Application appelle `SaveChanges()` une fois — jamais depuis les Repositories."
    },
    {
      "question": "Quel concept POO + quel pattern de conception retrouve-t-on quand `IRiskStrategy` est injectée dans `RiskEngine` et que l'implémentation change selon l'environnement (prod vs test) ?",
      "options": [
        "Encapsulation + Singleton.",
        "Polymorphisme + Strategy (+ DIP comme principe sous-jacent).",
        "Héritage + Template Method.",
        "Abstraction + Observer."
      ],
      "answer": "Polymorphisme + Strategy (+ DIP comme principe sous-jacent).",
      "explanation": "Polymorphisme : `_strategy.Calculate()` appelle la bonne formule selon l'implémentation injectée. Strategy : l'algorithme est interchangeable à runtime. DIP : `RiskEngine` dépend de `IRiskStrategy` (interface), pas d'une implémentation concrète. Ce triptyque permet de tester `RiskEngine` avec un `MockRiskStrategy` sans jamais lancer un vrai calcul VaR."
    },
    {
      "question": "Pourquoi le pattern Mediator (MediatR) est-il souvent combiné avec CQRS dans les applications de trading ASP.NET Core ?",
      "options": [
        "Car MediatR génère automatiquement le SQL pour EF Core.",
        "Car Mediator découple l'émetteur d'une commande de son handler, facilitant l'ajout de comportements transversaux sans modifier les handlers.",
        "Car MediatR remplace le conteneur DI natif.",
        "Car Mediator garantit l'isolation ACID sans TransactionScope."
      ],
      "answer": "Car Mediator découple l'émetteur d'une commande de son handler, facilitant l'ajout de comportements transversaux sans modifier les handlers.",
      "explanation": "Mediator + CQRS : les controllers envoient des `Command`/`Query` sans connaître les handlers. Les `IPipelineBehavior` permettent d'injecter logging, validation FluentValidation, retry Polly en cross-cutting concern — sans toucher aux handlers métier. Architecture propre, testable, extensible. SRP et OCP appliqués à la couche Application."
    },
    {
      "question": "Comment garantir qu'un agrégat `Order` ne peut jamais être créé dans un état incohérent ?",
      "options": [
        "En ajoutant des `[Required]` DataAnnotations.",
        "En rendant le constructeur `private` et en exposant des factory methods qui valident les invariants avant construction.",
        "En utilisant des commentaires XML documentant les règles.",
        "En sérialisant l'agrégat en JSON et le revalidant à chaque lecture."
      ],
      "answer": "En rendant le constructeur `private` et en exposant des factory methods qui valident les invariants avant construction.",
      "explanation": "Constructeur `private` + factory method `Order.Create(symbol, quantity)` : invariants validés avant construction. Si les règles ne sont pas respectées, `DomainException` explicite. Code client incapable de créer un `Order` partiellement initialisé. C'est l'Encapsulation portée au niveau du domaine (DDD tactique) + SRP."
    },
    {
      "question": "Quelle est la différence entre un Domain Event et un Integration Event dans une architecture microservices de trading ?",
      "options": [
        "Domain Events sont synchrones, Integration Events sont asynchrones uniquement.",
        "Domain Events expriment un fait dans le bounded context local ; Integration Events propagent ce fait vers d'autres services via un bus de messages.",
        "Domain Events sont stockés en base, Integration Events sont en mémoire.",
        "Integration Events remplacent les Domain Events en CQRS moderne."
      ],
      "answer": "Domain Events expriment un fait dans le bounded context local ; Integration Events propagent ce fait vers d'autres services via un bus de messages.",
      "explanation": "Domain Event (`OrderFilled`) : dispatché en mémoire via Mediator dans le même processus pour déclencher des side effects locaux (recalcul P&L, mise à jour position). Integration Event : publié sur RabbitMQ/Azure Service Bus pour informer Risk, Compliance, Reporting. La séparation évite le couplage fort entre bounded contexts. Pattern Observer à deux échelles : processus vs microservices."
    },
    {
      "question": "Comment OCP s'applique à l'ajout d'un nouveau type de frais dans un moteur de pricing C# existant ?",
      "options": [
        "En modifiant le `switch/case` existant dans `FeeCalculator`.",
        "En créant `NewBrokerFeeCalculator : IFeeCalculator` et l'enregistrant dans le DI — sans toucher au code existant.",
        "En héritant de `FeeCalculator` et overridant toutes ses méthodes.",
        "En ajoutant un booléen `UseNewFeeStructure`."
      ],
      "answer": "En créant `NewBrokerFeeCalculator : IFeeCalculator` et l'enregistrant dans le DI — sans toucher au code existant.",
      "explanation": "OCP : nouveau broker = nouvelle classe, nouvel enregistrement DI. Zéro ligne modifiée = zéro régression. C'est Abstraction (`IFeeCalculator`) + Polymorphisme (chaque implémentation calcule différemment) + DIP (le moteur dépend de l'interface) qui rendent OCP possible. Sans ces mécanismes POO, OCP reste une intention sans moyen de l'appliquer."
    },
    {
      "question": "Comment garantir qu'un calcul VaR (30s) n'impacte pas les autres requêtes HTTP en parallèle ?",
      "options": [
        "En marquant la méthode avec `[ThreadStatic]`.",
        "En utilisant `async/await` avec `Task.Run` pour déléguer le calcul CPU-bound au ThreadPool.",
        "En augmentant les workers Kestrel.",
        "En sérialisant les calculs dans Redis et bloquant le thread HTTP."
      ],
      "answer": "En utilisant `async/await` avec `Task.Run` pour déléguer le calcul CPU-bound au ThreadPool.",
      "explanation": "`async/await` libère le thread HTTP pendant l'attente I/O. `Task.Run()` délègue les calculs CPU-bound au ThreadPool sans bloquer Kestrel. 10 calculs VaR simultanés = 10 threads ThreadPool, les threads HTTP restent libres. Sans cette séparation, la salle de marché voit l'API non responsive pendant les calculs intensifs."
    },
    {
      "question": "Pourquoi utiliser un Value Object plutôt que `string` pour représenter un ISIN en DDD C# ?",
      "options": [
        "Car `string` n'est pas sérialisable en JSON dans .NET 6+.",
        "Car un Value Object encapsule la validation du format ISIN, l'égalité par valeur et évite la Primitive Obsession.",
        "Car les Value Objects sont automatiquement indexés par EF Core.",
        "Car `string` provoque des fuites mémoire dans les collections larges."
      ],
      "answer": "Car un Value Object encapsule la validation du format ISIN, l'égalité par valeur et évite la Primitive Obsession.",
      "explanation": "Primitive Obsession : passer `string isin` à une méthode attendant `string symbol` compile sans erreur mais inverse silencieusement les paramètres. `ISIN(string value)` valide le format à la construction, implémente l'égalité par valeur, rend le code auto-documenté. En C# moderne, `record struct` est idéal pour les Value Objects immutables."
    },
    {
      "question": "Vous analysez un système de pricing qui combine : `abstract class BasePricingModel { protected decimal _vol; public abstract decimal Price(); }` + `class BSModel : BasePricingModel` + injection via `IPricingEngine`. Listez tous les concepts POO et patterns présents.",
      "options": [
        "Singleton + Builder + Observer.",
        "Abstraction (`abstract`/`interface`) + Héritage (`:`) + Encapsulation (`protected`) + Polymorphisme (`override`) + Strategy (injection d'`IPricingEngine`) + DIP.",
        "SRP + OCP + LSP uniquement.",
        "Chain of Responsibility + Repository + Template Method."
      ],
      "answer": "Abstraction (`abstract`/`interface`) + Héritage (`:`) + Encapsulation (`protected`) + Polymorphisme (`override`) + Strategy (injection d'`IPricingEngine`) + DIP.",
      "explanation": "`abstract class` = Abstraction. `:` = Héritage. `protected _vol` = Encapsulation. `abstract Price()` + `override` dans `BSModel` = Polymorphisme. Injection via `IPricingEngine` = Strategy + DIP. C'est un exemple parfait d'architecture où les 4 piliers POO + 2 patterns + 1 principe SOLID coexistent. Reconnaître ces couches permet de diagnostiquer et maintenir le code efficacement."
    },
    {
      "question": "Dans une architecture HFT C#, pourquoi éviter les allocations heap dans les hot paths, et quels outils C# le permettent ?",
      "options": [
        "En utilisant des classes `sealed` pour réduire l'overhead du dispatch virtuel.",
        "En utilisant `struct`, `Span<T>` et `stackalloc` pour maintenir les données sur la stack et éviter la pression GC.",
        "En désactivant le GC via `GC.Collect()` dans les boucles critiques.",
        "En sérialisant toutes les données en `byte[]` avant traitement."
      ],
      "answer": "En utilisant `struct`, `Span<T>` et `stackalloc` pour maintenir les données sur la stack et éviter la pression GC.",
      "explanation": "Le GC provoque des pauses stop-the-world (Gen2) inacceptables en HFT. `struct` alloue sur la stack, `Span<T>` travaille sur des tranches mémoire sans allocation, `stackalloc` crée des buffers temporaires sur la stack. `ArrayPool<T>` réutilise les buffers. Ces techniques visent le zero-allocation sur les hot paths — microseconde gagnée = edge concurrentiel."
    },
    {
      "question": "Vous devez identifier le design pattern à partir de ces indices : constructeur `private`, propriété `static Instance`, `Lazy<T>`, utilisé pour la connexion Bloomberg. Quel est-il, et quel concept POO en est le fondement ?",
      "options": [
        "Factory Method — fondé sur le Polymorphisme.",
        "Singleton — fondé sur l'Encapsulation (constructeur privé + accès contrôlé).",
        "Prototype — fondé sur l'Héritage.",
        "Builder — fondé sur l'Abstraction."
      ],
      "answer": "Singleton — fondé sur l'Encapsulation (constructeur privé + accès contrôlé).",
      "explanation": "Indices de reconnaissance du Singleton : constructeur `private` (encapsulation de la création), `static Instance` (point d'accès unique), `Lazy<T>` (initialisation thread-safe tardive). Sans Encapsulation, impossible d'implémenter le Singleton — n'importe quel code pourrait appeler le constructeur. L'Encapsulation est le mécanisme POO qui rend ce pattern possible."
    },
    {
      "question": "Vous voyez `event EventHandler<OrderFilledArgs> OrderFilled` dans une classe, et plusieurs services qui s'y abonnent via `+=`. Quel concept POO + quel pattern identifiez-vous, et quel principe SOLID est respecté ?",
      "options": [
        "Encapsulation + Singleton + SRP.",
        "Polymorphisme (`event` dispatch dynamique) + Observer + OCP (ajouter un abonné sans modifier la source).",
        "Héritage + Builder + DIP.",
        "Abstraction + Chain of Responsibility + LSP."
      ],
      "answer": "Polymorphisme (`event` dispatch dynamique) + Observer + OCP (ajouter un abonné sans modifier la source).",
      "explanation": "`event` = mécanisme de Polymorphisme délégué : chaque abonné fournit sa propre implémentation du handler. Pattern Observer : source → N abonnés sans couplage direct. OCP : ajouter un nouvel abonné (ex : service de compliance) = `source.OrderFilled += OnOrderFilled`, sans modifier la source. Aucune ligne de la source ne change — extension pure."
    },
    {
      "question": "Analysez : `class OrderValidationPipeline { private readonly IEnumerable<IOrderValidator> _validators; void Validate(Order o) { foreach(var v in _validators) v.Validate(o); } }`. Quels patterns et principes identifiez-vous ?",
      "options": [
        "Singleton + AddSingleton + SRP.",
        "Chain of Responsibility (via collection de validators) + ISP (`IOrderValidator` ciblée) + DIP (injection de la liste) + SRP (chaque validator = une règle).",
        "Observer + Strategy + OCP.",
        "Builder + Repository + LSP."
      ],
      "answer": "Chain of Responsibility (via collection de validators) + ISP (`IOrderValidator` ciblée) + DIP (injection de la liste) + SRP (chaque validator = une règle).",
      "explanation": "Collection d'`IOrderValidator` = Chain of Responsibility simplifié (sans `SetNext` explicite). `IOrderValidator` petite et ciblée = ISP. Injection via constructeur = DIP. Chaque implémentation de `IOrderValidator` = une seule règle = SRP. Ce code applique simultanément 4 principes SOLID via 1 pattern — c'est l'architecture de validation typique d'un système d'ordres ex:."
    },
    {
      "question": "Quelle combinaison de concepts permet à une architecture microservices de trading d'être à la fois testable, évolutive et découplée ?",
      "options": [
        "Singleton + Héritage + Serializable.",
        "DIP (interfaces partout) + Repository (accès données abstrait) + Strategy (algorithmes interchangeables) + Observer/Events (communication découplée).",
        "OCP + `new` + `static` + `TransactionScope`.",
        "LSP + `AddScoped` + `abstract class` uniquement."
      ],
      "answer": "DIP (interfaces partout) + Repository (accès données abstrait) + Strategy (algorithmes interchangeables) + Observer/Events (communication découplée).",
      "explanation": "L'architecture testable + évolutive + découplée repose sur ce quartet : DIP garantit que tout dépend d'abstractions (testabilité). Repository permet le swap infrastructure (prod/test). Strategy permet le swap d'algorithmes (VaR, pricing). Observer/Events découple les composants (changer un service n'impacte pas les autres). Ces 4 éléments ensemble couvrent les 3 axes de la qualité architecturale en salle de marché."
    }
  ]
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
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length} | ✅ Expert : {scores.expert}/{questions.expert.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Principes SOLID & design patterns validés.</h3> : <p className="fail">📚 Révisez les parties où vous avez perdu des points.</p>}
    </div>
  );
};

const Page4 = () => {
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
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
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
      }, 12000);
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
            SOLID & POO 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {level === "basic" ? <Flashcard slide={basicSlides[currentSlide]} /> : (
            <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page4;
