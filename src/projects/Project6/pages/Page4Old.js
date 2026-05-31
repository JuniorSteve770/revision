// src/projects/Project3/pages/Page4.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — POO, SOLID, ACID & Design Patterns",
    "answer": "**POO** : organiser le code avec des objets réutilisables, protégés et flexibles. Piliers : Encapsulation, Abstraction, Héritage, Polymorphisme. ◆ **SOLID** : concevoir un code propre, maintenable et évolutif. Principes : SRP, OCP, LSP, ISP, DIP. ◆ **ACID** : garantir des transactions fiables et sécurisées en base de données. Propriétés : Atomicité, Cohérence, Isolation, Durabilité. ◆ **Design Patterns** : utiliser des solutions réutilisables aux problèmes fréquents de conception logicielle. Patterns clés : Builder, Singleton, Observer, Strategy, Chain of Responsibility, Repository."
  },
  {
    "question": "POO — Encapsulation",
    "answer": "**◆** : regrouper les données et comportements dans une classe tout en contrôlant l'accès via des getters/setters. ◆ : `private` (données inaccessibles de l'extérieur), `public` (accès autorisé), `get` / `set` (contrôle en lecture/écriture). ◆  : `Order._price` est `private`. Seule la méthode `Execute()` peut modifier le statut — aucun code externe ne peut corrompre un ordre en cours."
  },
  {
    "question": "POO — Abstraction",
    "answer": "**◆** : exposer uniquement les comportements essentiels sans montrer les détails internes. ◆ : `interface` (contrat pur — que des signatures, pas de code), `abstract class` (contrat + code commun partageable). ◆ **Règle** : deux classes partagent du code → `abstract class`. Elles partagent un contrat seulement → `interface`. ◆  : `IPricingEngine` expose `Calculate(trade)`. Le desk appelle la méthode sans savoir si c'est Black-Scholes ou Monte Carlo."
  },
  {
    "question": "POO — Héritage",
    "answer": "**◆** : permettre à une classe fille d'hériter des propriétés et méthodes d'une classe mère pour réutiliser le code. ◆ : `:` (étendre une classe), `base` (appeler le constructeur ou une méthode du parent), `protected` (accessible par la classe et ses enfants uniquement). ◆  : `EquityOption : Derivative` hérite automatiquement de toute la gestion du cycle de vie d'un dérivé sans réécrire la logique commune."
  },
  {
    "question": "POO — Polymorphisme",
    "answer": "**◆** : permettre à une méthode d'avoir plusieurs comportements selon l'objet utilisé. ◆ : `virtual` (autorise la redéfinition dans une classe enfant), `override` (redéfinit le comportement), `new` (masque la méthode parente — sans polymorphisme, à éviter). ◆  : une `List<Instrument>` contient actions, obligations, futures. Appeler `Evaluate()` sur chacun déclenche la bonne formule selon l'instrument réel."
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
    "answer": "**Observer** : notifier automatiquement des abonnés lorsqu'un événement se produit, sans couplage direct entre la source et les écouteurs. ◆ En C# : `event`, `EventHandler<T>`, `IObservable<T>`. ◆ : un changement de prix notifie l'UI, le moteur de risk et les alertes simultanément. ◆ **Strategy** : changer d'algorithme à la volée en injectant une implémentation différente. ◆ En C# : injection d'`IRiskStrategy` au runtime. ◆  : basculer de `StandardVaRStrategy` à `StressTestStrategy` lors d'une annonce Fed — sans recompiler."
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
      "explanation": "Sans `virtual`, `override` est interdit par le compilateur. La classe enfant est forcée d'utiliser `new`, qui masque sans polymorphisme. En trading : `Derivative d = new EquityOption()` appellera `Derivative.Evaluate()`, pas la formule de l'option. Toujours `virtual` + `override` pour un dispatch correct."
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
      "explanation": "Encapsulation = contrôler l'accès aux données d'une classe. `private` verrouille les champs internes, `public` expose ce qui doit l'être, `get`/`set` permettent un contrôle fin en lecture/écriture. En trading : `Order._price` est `private`, la propriété `Price { get; private set; }` empêche toute modification externe."
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
      "explanation": "Héritage : `:` pour étendre une classe (`EquityOption : Derivative`), `base` pour appeler le constructeur ou une méthode du parent, `protected` pour partager un membre avec les enfants sans l'exposer publiquement. Ces trois mots-clés structurent la relation parent-enfant."
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
      "explanation": "Abstraction = exposer l'essentiel, cacher la complexité. `interface` définit un contrat pur (signatures uniquement), `abstract` permet une classe hybride avec code commun + méthodes à implémenter. En trading : `IPricingEngine` expose `Calculate(trade)` — le desk ne sait pas si c'est Black-Scholes ou Monte Carlo."
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
      "question": "Dans ACID, quelle propriété garantit qu'un trade reste enregistré même après un crash serveur ?",
      "options": [
        "Atomicité",
        "Cohérence",
        "Isolation",
        "Durabilité"
      ],
      "answer": "Durabilité",
      "explanation": "Durabilité = un trade confirmé (committed) survit à n'importe quel crash. Le moteur SQL Server écrit sur disque avant de confirmer la transaction. Le transaction log garantit qu'aucune donnée committée ne peut être perdue, même en cas de coupure électrique ou redémarrage serveur."
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
      "question": "Le code suivant respecte quel principe SOLID : `class RiskEngine { private IMarketDataService _mds; RiskEngine(IMarketDataService mds) { _mds = mds; } }` ?",
      "options": [
        "SRP — une seule responsabilité.",
        "OCP — ouvert à l'extension.",
        "DIP — dépendre d'abstractions plutôt que d'implémentations.",
        "LSP — substitution de Liskov."
      ],
      "answer": "DIP — dépendre d'abstractions plutôt que d'implémentations.",
      "explanation": "DIP : le `RiskEngine` reçoit `IMarketDataService` (interface) par injection, jamais `new MarketDataService()` en dur. Changer de source de données (Bloomberg → Reuters) ne touche pas au moteur de risk. C'est le fondement de l'architecture découplée et testable."
    },
    {
      "question": "[Nommage inversé] Une classe dont le constructeur est `private`, qui expose une propriété `static`, et dont l'instance est partagée dans tout le processus s'appelle ?",
      "options": [
        "Factory Method",
        "Builder",
        "Singleton",
        "Prototype"
      ],
      "answer": "Singleton",
      "explanation": "Ces trois propriétés ensemble définissent le Singleton : constructeur `private` (personne ne peut instancier de l'extérieur), propriété `static Instance` (point d'accès unique), instance partagée dans tout le process. En C#, on ajoute `Lazy<T>` pour la thread-safety. Reconnaître ces propriétés abstraites permet d'identifier le pattern sans voir le nom de la classe."
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
      "question": "[Anti-pattern] Un dev écrit `public List<Trade> Trades` dans sa classe `Portfolio`. Quel principe est violé ?",
      "options": [
        "DIP — il devrait dépendre d'une interface.",
        "SRP — la liste a trop de responsabilités.",
        "Encapsulation — exposer `List<T>` permet à n'importe quel code de modifier la collection sans passer par la classe.",
        "LSP — `List<Trade>` ne respecte pas le contrat du parent."
      ],
      "answer": "Encapsulation — exposer `List<T>` permet à n'importe quel code de modifier la collection sans passer par la classe.",
      "explanation": "Anti-pattern classique : `public List<Trade>` expose la collection brute — n'importe quel code peut appeler `Trades.Add()`, `Trades.Clear()` ou `Trades.Remove()` sans passer par les règles métier du `Portfolio`. Solution : `public IReadOnlyCollection<Trade> Trades` + méthode `AddTrade(Trade t)` qui valide les invariants avant d'insérer."
    },
    {
      "question": "[Ordre de dépendance] Le principe DIP est inutilisable sans quel concept POO fondamental ?",
      "options": [
        "Héritage — pour étendre les classes concrètes.",
        "Polymorphisme — pour redéfinir les méthodes.",
        "Abstraction (`interface` / `abstract class`) — sans elle, il n'existe pas d'abstraction sur laquelle dépendre.",
        "Encapsulation — pour cacher les détails d'implémentation."
      ],
      "answer": "Abstraction (`interface` / `abstract class`) — sans elle, il n'existe pas d'abstraction sur laquelle dépendre.",
      "explanation": "DIP dit 'dépendre d'abstractions'. Mais si on n'a pas d'`interface` ou de `abstract class`, il n'y a pas d'abstraction à laquelle se référer — DIP est inapplicable. L'Abstraction POO est le prérequis technique qui rend le principe DIP concrètement réalisable en C#."
    },
    {
      "question": "[ACID ↔ POO] La propriété d'Isolation dans ACID ressemble à quel pilier POO, et pourquoi ?",
      "options": [
        "Héritage — chaque transaction hérite de l'état précédent.",
        "Polymorphisme — chaque transaction se comporte différemment.",
        "Encapsulation — chaque transaction cache son état intermédiaire aux autres transactions.",
        "Abstraction — chaque transaction expose uniquement le résultat final."
      ],
      "answer": "Encapsulation — chaque transaction cache son état intermédiaire aux autres transactions.",
      "explanation": "L'Isolation en ACID fonctionne exactement comme l'Encapsulation en POO : une transaction en cours cache ses modifications intermédiaires aux autres transactions, exactement comme un objet cache ses champs `private`. Personne ne voit l'état interne tant que la transaction n'est pas committée — tout comme personne ne voit un champ `private` tant que l'objet ne l'expose pas via un getter."
    },
    {
      "question": "[ACID ↔ SOLID] Quel principe SOLID garantit que la logique de transaction (`TransactionScope`) ne se trouve pas dans la classe métier `TradeService` ?",
      "options": [
        "OCP — le service est ouvert à l'extension.",
        "LSP — le service peut être remplacé.",
        "SRP — la gestion des transactions est une responsabilité distincte de la logique métier.",
        "ISP — l'interface de transaction est séparée."
      ],
      "answer": "SRP — la gestion des transactions est une responsabilité distincte de la logique métier.",
      "explanation": "SRP : `TradeService` a pour responsabilité la logique métier du trade — pas la gestion des transactions. Mélanger les deux crée une classe avec deux raisons de changer : l'évolution des règles métier ET l'évolution de la stratégie transactionnelle. Solution : déléguer la gestion ACID à une couche Infrastructure ou à un `UnitOfWork`."
    },
    {
      "question": "[Erreur de conception trading] Un dev enregistre un `PositionTracker` contenant le portefeuille du trader connecté avec `AddSingleton`. Quel concept POO a-t-il ignoré ?",
      "options": [
        "Héritage — le tracker devrait hériter d'une classe parente.",
        "Polymorphisme — le tracker devrait avoir plusieurs comportements.",
        "Encapsulation — l'état du trader (données privées) est partagé entre tous les utilisateurs de l'application.",
        "Abstraction — le tracker devrait dépendre d'une interface."
      ],
      "answer": "Encapsulation — l'état du trader (données privées) est partagé entre tous les utilisateurs de l'application.",
      "explanation": "AddSingleton = une seule instance pour tout le processus. Si cette instance contient l'état du trader (ses positions, son portefeuille), tous les traders partagent le même objet en mémoire — les positions se mélangent. L'Encapsulation exige que les données d'un trader soient privées à sa session. Solution : `AddScoped` pour une instance par requête HTTP."
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
      "explanation": "Indicateurs clés : `event`, handlers d'abonnement/désabonnement, notification automatique des abonnés. Observer = une source notifie N abonnés sans les connaître directement. En trading : le market feed publie `PriceChanged`, l'UI, le moteur risk et les alertes s'abonnent indépendamment."
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
      "explanation": "Le polymorphisme permet à la source d'appeler `OnPriceChanged()` sur une liste d'`IObserver` sans savoir si c'est l'UI, le moteur risk ou les alertes. Chaque abonné implémente sa propre réaction. C'est la puissance du dispatch dynamique appliqué au pattern Observer."
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
      "explanation": "Indicateurs clés : référence vers le `_next` handler, méthode `SetNext()` pour chaîner, propagation conditionnelle (`_next?.Validate(o)`). Chain of Responsibility = chaque handler traite ce qu'il peut et passe au suivant. En trading : limite de position → KYC → liquidité, chaque règle dans son propre handler."
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
      "question": "Le principe OCP est rendu possible par quels mécanismes POO ? (Ordre de dépendance)",
      "options": [
        "Encapsulation + Héritage — cacher les données et étendre les classes.",
        "Abstraction + Polymorphisme — définir une interface, fournir de nouvelles implémentations sans modifier le code appelant.",
        "Héritage seul — créer une classe fille qui surcharge tout.",
        "Polymorphisme seul — redéfinir les méthodes existantes."
      ],
      "answer": "Abstraction + Polymorphisme — définir une interface, fournir de nouvelles implémentations sans modifier le code appelant.",
      "explanation": "OCP est impossible sans ces deux prérequis POO. Abstraction (`IFeeCalculator`) = le code appelant dépend d'un contrat stable. Polymorphisme = chaque nouvelle implémentation produit un résultat différent sans modifier le code appelant. Sans Abstraction, il faudrait modifier le code existant pour chaque ajout — OCP ne peut pas s'appliquer."
    },
    {
      "question": "[Anti-pattern] Lequel de ces codes implémente un Singleton thread-unsafe en C# ?",
      "options": [
        "`private static readonly Lazy<T> _instance = new Lazy<T>();`",
        "`private static T _instance; public static T Instance { get { if (_instance == null) _instance = new T(); return _instance; } }`",
        "`private static readonly T _instance = new T();`",
        "`private static T _instance = null; private static readonly object _lock = new object();`"
      ],
      "answer": "`private static T _instance; public static T Instance { get { if (_instance == null) _instance = new T(); return _instance; } }`",
      "explanation": "Anti-pattern : le check `if (_instance == null)` sans verrou permet à deux threads d'entrer simultanément et de créer deux instances distinctes. C'est le Singleton sans protection multithread. Solutions correctes : `Lazy<T>` (option A), champ `static readonly` initialisé à la déclaration (option C), ou double-checked locking avec `lock` + `volatile` (option D incomplète mais dans la bonne direction)."
    },
    {
      "question": "[ACID ↔ POO] L'Atomicité dans ACID correspond à quel concept POO ? Justifiez.",
      "options": [
        "Polymorphisme — les opérations peuvent avoir plusieurs comportements.",
        "Héritage — les opérations héritent des propriétés de la transaction parente.",
        "Encapsulation — `TransactionScope` encapsule plusieurs opérations en une seule unité indivisible.",
        "Abstraction — la transaction masque les détails d'implémentation SQL."
      ],
      "answer": "Encapsulation — `TransactionScope` encapsule plusieurs opérations en une seule unité indivisible.",
      "explanation": "L'Atomicité fonctionne comme l'Encapsulation : `TransactionScope` regroupe débiter + enregistrer + mettre à jour la position dans une seule unité logique opaque. De l'extérieur, on ne voit que le résultat final (commit ou rollback) — jamais l'état intermédiaire. Exactement comme un objet encapsule son état interne et n'expose que le résultat de ses méthodes."
    },
    {
      "question": "[ACID ↔ SOLID] Comment OCP s'applique-t-il au choix d'`IsolationLevel` dans un système de trading ?",
      "options": [
        "On modifie `IsolationLevel` directement dans chaque méthode selon le contexte.",
        "On crée une `ITransactionStrategy` avec des implémentations `ReadCommittedStrategy`, `SerializableStrategy` — le code appelant ne change pas.",
        "On utilise un `switch/case` sur le type d'opération pour sélectionner le niveau.",
        "On enregistre le niveau d'isolation en base de données et on le relit à chaque transaction."
      ],
      "answer": "On crée une `ITransactionStrategy` avec des implémentations `ReadCommittedStrategy`, `SerializableStrategy` — le code appelant ne change pas.",
      "explanation": "OCP appliqué à ACID : l'isolation est une stratégie variable. `ITransactionStrategy` définit le contrat, `ReadCommittedStrategy` et `SerializableStrategy` l'implémentent. Ajouter `SnapshotIsolationStrategy` pour les réconciliations = nouvelle classe, zéro modification du code appelant. OCP + Strategy + ACID ensemble — c'est l'architecture trading extensible."
    },
    {
      "question": "[ACID ↔ Design Pattern] Quel pattern garantit que `SaveChanges()` n'est appelé qu'une seule fois pour plusieurs Repositories dans une même transaction ?",
      "options": [
        "Singleton — un seul `DbContext` dans tout le processus.",
        "Repository seul — chaque Repository gère sa propre transaction.",
        "Unit of Work — un `DbContext` partagé entre Repositories, un seul `SaveChanges()` depuis la couche Application.",
        "Builder — on construit la transaction étape par étape."
      ],
      "answer": "Unit of Work — un `DbContext` partagé entre Repositories, un seul `SaveChanges()` depuis la couche Application.",
      "explanation": "Unit of Work implémente l'Atomicité ACID au niveau applicatif. Un `DbContext` partagé (AddScoped) entre `TradeRepository` et `PositionRepository` traque toutes les modifications. La couche Application appelle `SaveChanges()` une seule fois — tout commit ensemble ou tout rollback. Chaque Repository ne committe jamais indépendamment."
    },
    {
      "question": "[Refactoring] Ce code viole SRP : `class TradeManager { public void Execute(Trade t) {...} public string GenerateReport(Trade t) {...} public void SendEmail(Trade t) {...} }`. Quelle est la bonne refactorisation ?",
      "options": [
        "Créer une interface `ITradeManager` avec les trois méthodes.",
        "Séparer en `TradeExecutor`, `TradeReporter` et `TradeNotifier` — chacun avec une seule responsabilité.",
        "Marquer les méthodes `protected` pour limiter l'accès.",
        "Utiliser `abstract` pour forcer les sous-classes à implémenter chaque méthode."
      ],
      "answer": "Séparer en `TradeExecutor`, `TradeReporter` et `TradeNotifier` — chacun avec une seule responsabilité.",
      "explanation": "SRP : une classe = une seule raison de changer. `TradeManager` en a trois. Refactorisation : `TradeExecutor` (logique d'exécution), `TradeReporter` (génération de rapport), `TradeNotifier` (envoi email). Chaque classe est plus petite, testable indépendamment, et peut évoluer sans impacter les autres. C'est la refactorisation SRP canonique."
    },
    {
      "question": "[Erreur de conception trading] Un dev utilise `public List<Trade> Trades` dans son agrégat `Portfolio`. Quel problème architectural cela crée-t-il ?",
      "options": [
        "DIP — il devrait dépendre d'une interface `IList<Trade>`.",
        "Encapsulation rompue — tout code externe peut modifier la liste sans passer par les invariants de `Portfolio`.",
        "SRP — la liste a trop de responsabilités.",
        "LSP — `List<Trade>` ne respecte pas le contrat du parent."
      ],
      "answer": "Encapsulation rompue — tout code externe peut modifier la liste sans passer par les invariants de `Portfolio`.",
      "explanation": "`public List<Trade>` = n'importe quel code peut appeler `Trades.Add()`, `Trades.Clear()`, `Trades.Remove()` sans que `Portfolio` le sache. Les règles métier (limite de position, validation du trade) sont court-circuitées. Solution : `public IReadOnlyCollection<Trade> Trades` + méthode `AddTrade(Trade t)` qui valide les invariants. C'est SRP + Encapsulation appliqués au domaine."
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
      "question": "Vous lisez : `services.AddTransient<IPricingEngine, BlackScholesPricingEngine>();`. Quels principes SOLID sont appliqués ?",
      "options": [
        "SRP uniquement — la classe a une seule responsabilité.",
        "DIP + OCP — dépendre d'une abstraction (`IPricingEngine`) et pouvoir changer d'implémentation sans modifier le code appelant.",
        "LSP + ISP — substitution et interface séparée.",
        "OCP uniquement — le code est ouvert à l'extension."
      ],
      "answer": "DIP + OCP — dépendre d'une abstraction (`IPricingEngine`) et pouvoir changer d'implémentation sans modifier le code appelant.",
      "explanation": "DIP : le code appelant dépend de `IPricingEngine`, pas de `BlackScholesPricingEngine` directement. OCP : pour utiliser Monte Carlo, on crée `MonteCarloPricingEngine : IPricingEngine` et on change l'enregistrement DI — zéro modification dans le code métier. Ces deux principes fonctionnent naturellement ensemble."
    },
    {
      "question": "[Anti-pattern] Ce code viole quel principe SOLID : `class PricingService { public decimal Calculate(Trade t) { if (t.Type == \"Equity\") return EquityPrice(t); if (t.Type == \"Option\") return OptionPrice(t); if (t.Type == \"Future\") return FuturePrice(t); ... } }` ?",
      "options": [
        "LSP — les types ne respectent pas le contrat du parent.",
        "OCP — ajouter un nouveau type d'instrument nécessite de modifier `PricingService`.",
        "ISP — l'interface est trop grande.",
        "SRP — la méthode `Calculate` a trop de responsabilités."
      ],
      "answer": "OCP — ajouter un nouveau type d'instrument nécessite de modifier `PricingService`.",
      "explanation": "Anti-pattern OCP : le `switch/if` sur le type est le signe classique d'une violation OCP. Ajouter un instrument crypto = modifier `PricingService` = risque de régression sur tous les autres types. Solution : `IPricingEngine` implémentée par `EquityPricingEngine`, `OptionPricingEngine`, `FuturePricingEngine`. Ajouter crypto = nouvelle classe, zéro modification."
    },
    {
      "question": "[Ordre de dépendance] Quels concepts POO sont prérequis pour que le LSP soit respecté ?",
      "options": [
        "Encapsulation seule — cacher l'état interne.",
        "Abstraction seule — définir une interface commune.",
        "Héritage (`:`) + Abstraction (interface/abstract) — il faut une relation parent-enfant ET un contrat à honorer.",
        "Polymorphisme seul — redéfinir les méthodes."
      ],
      "answer": "Héritage (`:`) + Abstraction (interface/abstract) — il faut une relation parent-enfant ET un contrat à honorer.",
      "explanation": "LSP ne s'applique que s'il y a une relation d'héritage (`:`) ou d'implémentation d'interface — sans Héritage, pas de substitution possible. Et sans Abstraction (contrat défini par interface/abstract), il n'y a pas de règles à honorer. LSP est la règle d'or qui gouverne comment Héritage et Abstraction doivent être utilisés ensemble."
    },
    {
      "question": "[ACID ↔ Design Pattern] Comment Repository + TransactionScope implémentent-ils les propriétés ACID ensemble en C# ?",
      "options": [
        "Repository gère l'Atomicité, TransactionScope gère la Durabilité.",
        "Repository abstrait l'accès aux données (découplage) ; TransactionScope enveloppe les opérations Repository pour garantir l'Atomicité — ensemble ils couvrent A, C, I, D.",
        "TransactionScope remplace Repository pour les opérations critiques.",
        "Repository implémente Isolation, TransactionScope implémente Cohérence uniquement."
      ],
      "answer": "Repository abstrait l'accès aux données (découplage) ; TransactionScope enveloppe les opérations Repository pour garantir l'Atomicité — ensemble ils couvrent A, C, I, D.",
      "explanation": "Repository fournit l'abstraction (DIP) et la testabilité. `TransactionScope` enveloppe plusieurs appels Repository : si `TradeRepository.Save()` et `PositionRepository.Update()` échouent, rollback automatique (Atomicité). SQL Server garantit Cohérence (contraintes), Isolation (`IsolationLevel`), Durabilité (transaction log). Repository + TransactionScope = couche applicative + ACID de bout en bout."
    },
    {
      "question": "[Refactoring] Ce code utilise `new` au lieu de `override` : `class EquityOption : Derivative { public new decimal Evaluate() { return Strike * Multiplier; } }`. Quel est l'impact sur le polymorphisme, et comment corriger ?",
      "options": [
        "Aucun impact — `new` et `override` sont équivalents en C#.",
        "`new` masque sans polymorphisme : `Derivative d = new EquityOption()` appelle `Derivative.Evaluate()`. Correction : déclarer `virtual` dans `Derivative` et `override` dans `EquityOption`.",
        "`new` déclenche une exception au runtime si la variable est déclarée `Derivative`.",
        "`new` est obligatoire quand `Evaluate()` n'est pas `abstract` dans le parent."
      ],
      "answer": "`new` masque sans polymorphisme : `Derivative d = new EquityOption()` appelle `Derivative.Evaluate()`. Correction : déclarer `virtual` dans `Derivative` et `override` dans `EquityOption`.",
      "explanation": "Refactoring : remplacer `new decimal Evaluate()` par `public override decimal Evaluate()` dans `EquityOption`, et ajouter `virtual` à `Derivative.Evaluate()`. Résultat : `Derivative d = new EquityOption()` appellera désormais la formule de l'option — dispatch dynamique actif. En trading, cette correction garantit que la bonne formule de pricing s'exécute quel que soit le type déclaré de la variable."
    },
    {
      "question": "[Erreur de conception trading] Un dev injecte `DbContext` directement dans son `RiskCalculator` via `AddScoped`. Quel problème architectural cela crée-t-il ?",
      "options": [
        "DbContext n'est pas thread-safe — AddScoped est insuffisant.",
        "DIP violé : `RiskCalculator` dépend d'une implémentation concrète (EF Core) au lieu d'une abstraction (`ITradeRepository`). Tester sans base de données devient impossible.",
        "ACID violé : DbContext ne supporte pas les transactions.",
        "SRP respecté — DbContext a une seule responsabilité d'accès aux données."
      ],
      "answer": "DIP violé : `RiskCalculator` dépend d'une implémentation concrète (EF Core) au lieu d'une abstraction (`ITradeRepository`). Tester sans base de données devient impossible.",
      "explanation": "Injecter `DbContext` directement = couplage fort à EF Core. `RiskCalculator` ne peut être testé qu'avec une vraie base de données. DIP exige une abstraction : injecter `ITradeRepository` permet d'injecter `InMemoryTradeRepository` en tests. C'est l'erreur de conception la plus fréquente chez les devs C# juniors en banque — elle rend le CI/CD lent et fragile."
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
      "question": "[Nommage inversé] Une classe qui permet de construire un objet complexe étape par étape, expose des méthodes chaînables, et dont la méthode finale valide les invariants avant de retourner l'objet s'appelle ?",
      "options": [
        "Factory Method",
        "Builder",
        "Prototype",
        "Abstract Factory"
      ],
      "answer": "Builder",
      "explanation": "Ces propriétés définissent le Builder : construction étape par étape (Fluent API), méthodes chaînables (`ForSymbol().Strike().Buy()`), validation centralisée dans `Build()`. Sans voir le nom de la classe, ces trois caractéristiques suffisent à identifier le pattern. En trading : `new OrderBuilder().ForSymbol(\"BNP\").Strike(50).Buy(100).Build()` — lisible, sûr, sans constructeur à 12 paramètres."
    },
    {
      "question": "[ACID ↔ POO] La propriété de Cohérence dans ACID est analogue à quel mécanisme POO, et pourquoi ?",
      "options": [
        "Polymorphisme — la base de données peut avoir plusieurs comportements.",
        "Héritage — les contraintes héritent des règles de la transaction parente.",
        "Encapsulation + Abstraction — les invariants de la base (contraintes, clés étrangères) sont encapsulés dans le schéma et abstraits du code applicatif.",
        "Héritage seul — les tables héritent des contraintes du parent."
      ],
      "answer": "Encapsulation + Abstraction — les invariants de la base (contraintes, clés étrangères) sont encapsulés dans le schéma et abstraits du code applicatif.",
      "explanation": "Cohérence ACID = la base reste dans un état valide après chaque transaction (contraintes NOT NULL, clés étrangères, règles CHECK). C'est l'Encapsulation des règles métier dans le schéma (cachées du code applicatif) combinée à l'Abstraction (le code appelle `SaveChanges()` sans connaître toutes les règles de validation). Les deux piliers POO protègent l'intégrité de la base comme ils protègent l'état d'un objet."
    }
  ],
  expert: [
    {
      "question": "Vous analysez ce code : `public interface IPricingEngine { decimal Calculate(Trade t); }` + `class BSEngine : IPricingEngine { public decimal Calculate(Trade t) => ...; }` + injection DI. Identifiez tous les concepts présents.",
      "options": [
        "Abstraction (`interface`) + DIP (injection) + OCP (nouvelle implémentation sans modifier le code appelant).",
        "Héritage + SRP + Singleton.",
        "Polymorphisme + Encapsulation + LSP uniquement.",
        "Observer + Strategy + Builder."
      ],
      "answer": "Abstraction (`interface`) + DIP (injection) + OCP (nouvelle implémentation sans modifier le code appelant).",
      "explanation": "`interface` = Abstraction POO. Injection de `IPricingEngine` = DIP. Créer `MonteCarloPricingEngine : IPricingEngine` sans toucher au code appelant = OCP. Ce triptyque Abstraction + DIP + OCP est la base de toute architecture de trading extensible et testable."
    },
    {
      "question": "Vous voyez ce code dans un handler de commande : `public class PlaceOrderHandler { private readonly IOrderRepository _repo; private readonly IRiskStrategy _risk; PlaceOrderHandler(IOrderRepository r, IRiskStrategy s) {...} }`. Identifiez patterns et principes.",
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
      "question": "[ACID ↔ POO — Expert] Mappez les quatre propriétés ACID à leurs piliers POO correspondants.",
      "options": [
        "A=Polymorphisme / C=Héritage / I=Abstraction / D=Encapsulation",
        "A=Encapsulation (unité indivisible) / C=Encapsulation+Abstraction (invariants cachés) / I=Encapsulation (état intermédiaire caché) / D=Abstraction (le code ne gère pas la persistance)",
        "A=Héritage / C=Polymorphisme / I=Héritage / D=Polymorphisme",
        "A=Abstraction / C=Polymorphisme / I=Héritage / D=Encapsulation"
      ],
      "answer": "A=Encapsulation (unité indivisible) / C=Encapsulation+Abstraction (invariants cachés) / I=Encapsulation (état intermédiaire caché) / D=Abstraction (le code ne gère pas la persistance)",
      "explanation": "Atomicité = Encapsulation : `TransactionScope` encapsule N opérations en une unité. Cohérence = Encapsulation + Abstraction : les contraintes BD sont encapsulées dans le schéma, abstraites du code. Isolation = Encapsulation : chaque transaction cache son état intermédiaire. Durabilité = Abstraction : le code appelle `Commit()` sans savoir comment SQL Server persiste sur disque. ACID est SOLID pour les bases de données."
    },
    {
      "question": "[Anti-pattern complet] Analysez ce code et identifiez toutes les violations : `class TradingSystem { public static TradingSystem Instance; public List<Trade> Trades = new List<Trade>(); public void Execute(Trade t) { Trades.Add(t); SqlHelper.Run(\"INSERT INTO...\"); SendEmail(t); } }`",
      "options": [
        "Aucune violation — le code est simple et lisible.",
        "Singleton mal implémenté (pas de `private` constructeur) + Encapsulation rompue (`public` champs mutables) + SRP violé (exécute, persiste ET notifie) + DIP violé (dépendance directe à `SqlHelper`).",
        "LSP violé uniquement — la classe ne peut pas être substituée.",
        "ISP violé — l'interface est trop grande."
      ],
      "answer": "Singleton mal implémenté (pas de `private` constructeur) + Encapsulation rompue (`public` champs mutables) + SRP violé (exécute, persiste ET notifie) + DIP violé (dépendance directe à `SqlHelper`).",
      "explanation": "4 violations simultanées : (1) `public static Instance` sans constructeur `private` = Singleton cassé, n'importe qui peut créer une autre instance. (2) `public List<Trade> Trades` = Encapsulation rompue, l'état est modifiable de l'extérieur. (3) `Execute()` fait trois choses = SRP violé. (4) `SqlHelper.Run()` en dur = DIP violé, impossible de tester sans base. Ce type de code 'God class' est le pattern d'architecture le plus destructeur en trading."
    },
    {
      "question": "Vous lisez : `abstract class BaseInstrument { protected decimal _notional; public abstract decimal Evaluate(); public string GetCurrency() => _currency; }`. Quels concepts POO identifiez-vous et quels patterns cela suggère-t-il ?",
      "options": [
        "Encapsulation uniquement — les champs sont protected.",
        "Abstraction (`abstract`) + Encapsulation (`protected`) + Héritage implicite. Suggère Template Method ou Strategy.",
        "Polymorphisme uniquement — `Evaluate()` est abstraite.",
        "Héritage + Singleton — l'instance est partagée."
      ],
      "answer": "Abstraction (`abstract`) + Encapsulation (`protected`) + Héritage implicite. Suggère Template Method ou Strategy.",
      "explanation": "`abstract class` = Abstraction. `protected _notional` = Encapsulation partagée avec les enfants. `abstract decimal Evaluate()` = contrat que chaque instrument doit implémenter. Ce combo est la signature du Template Method (squelette commun, variation dans les enfants) ou d'une base pour Strategy. Reconnaître ces couches permet de diagnostiquer et maintenir le code efficacement."
    },
    {
      "question": "[Refactoring — SOLID + ACID] Ce code viole DIP et ne respecte pas l'Atomicité ACID : `class OrderService { public void Place(Order o) { new SqlOrderRepo().Save(o); new SqlPositionRepo().Update(o); } }`. Quelle est la correction complète ?",
      "options": [
        "Ajouter `try/catch` autour des deux appels.",
        "Injecter `IOrderRepository` et `IPositionRepository` + envelopper dans `TransactionScope` ou partager un `DbContext` (Unit of Work) pour garantir l'Atomicité.",
        "Utiliser `async/await` pour exécuter les deux opérations en parallèle.",
        "Marquer la méthode `virtual` pour permettre la redéfinition."
      ],
      "answer": "Injecter `IOrderRepository` et `IPositionRepository` + envelopper dans `TransactionScope` ou partager un `DbContext` (Unit of Work) pour garantir l'Atomicité.",
      "explanation": "Deux problèmes à corriger simultanément : (1) DIP : `new SqlOrderRepo()` crée un couplage fort — injecter les interfaces via constructeur. (2) ACID/Atomicité : si `Update(o)` échoue après `Save(o)`, l'ordre est enregistré mais la position n'est pas mise à jour — incohérence critique. Solution : `TransactionScope` ou `DbContext` partagé (Unit of Work). DIP + ACID doivent être corrigés ensemble."
    },
    {
      "question": "[Nommage inversé — Expert] Une classe qui publie des événements sans connaître ses abonnés, où les abonnés s'enregistrent/désenregistrent dynamiquement, et où chaque abonné réagit différemment au même événement s'appelle ?",
      "options": [
        "Chain of Responsibility",
        "Mediator",
        "Observer",
        "Strategy"
      ],
      "answer": "Observer",
      "explanation": "Trois propriétés définissent l'Observer sans voir le code : publication sans connaissance des abonnés (découplage source-écouteurs), enregistrement/désenregistrement dynamique (`+=`/`-=`), réactions différentes au même événement (Polymorphisme). En trading : le market feed publie `PriceChanged` — l'UI, le moteur risk, les alertes ont chacun leur propre handler. Reconnaître ces propriétés permet d'identifier le pattern dans n'importe quelle implémentation."
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
      "explanation": "Sans Encapsulation, le Singleton est impossible. Le constructeur `private` est l'encapsulation qui empêche toute instanciation externe. La propriété `static` est le point d'accès contrôlé. `Lazy<T>` encapsule la logique thread-safe d'initialisation. Retirer l'encapsulation = n'importe quel code peut créer plusieurs instances — le pattern est détruit."
    },
    {
      "question": "[ACID ↔ SOLID — Expert] Quel principe SOLID, combiné à ACID, justifie de créer une couche `Infrastructure` dédiée pour gérer `TransactionScope` et `IsolationLevel` ?",
      "options": [
        "OCP — la couche Infrastructure est ouverte à l'extension.",
        "SRP + DIP — SRP : la logique ACID est séparée du domaine métier. DIP : le domaine dépend d'abstractions de transaction, pas de `TransactionScope` directement.",
        "LSP — la couche Infrastructure peut remplacer la couche métier.",
        "ISP — les interfaces ACID sont séparées des interfaces métier."
      ],
      "answer": "SRP + DIP — SRP : la logique ACID est séparée du domaine métier. DIP : le domaine dépend d'abstractions de transaction, pas de `TransactionScope` directement.",
      "explanation": "SRP : le domaine métier (`TradeService`) n'a pas à gérer `TransactionScope`, `IsolationLevel` ou le rollback — c'est la responsabilité de l'Infrastructure. DIP : le domaine dépend d'`IUnitOfWork` (abstraction), pas de `TransactionScope` directement — testable sans base. SRP + DIP + ACID ensemble = architecture en couches propre : Domain ← Application ← Infrastructure."
    },
    {
      "question": "[Erreur de conception trading — Expert] Vous reviewez ce code en prod : `class BloombergFeed { private static BloombergFeed _instance; public Dictionary<string, decimal> Prices = new Dictionary<string, decimal>(); ... }`. Listez toutes les violations.",
      "options": [
        "Aucune violation — Singleton simple et efficace.",
        "Singleton thread-unsafe (pas de `Lazy<T>` ni de `lock`) + Encapsulation rompue (`public Dictionary` mutable) + race conditions garanties sous charge (Dictionary non thread-safe).",
        "DIP violé uniquement — devrait dépendre d'une interface.",
        "ISP violé — le Dictionary expose trop de méthodes."
      ],
      "answer": "Singleton thread-unsafe (pas de `Lazy<T>` ni de `lock`) + Encapsulation rompue (`public Dictionary` mutable) + race conditions garanties sous charge (Dictionary non thread-safe).",
      "explanation": "Trois violations critiques en production HFT : (1) Singleton sans `Lazy<T>` ni `lock` = deux threads peuvent créer deux instances simultanément. (2) `public Dictionary<string, decimal> Prices` = n'importe quel composant peut modifier les prix directement, sans validation. (3) `Dictionary` non thread-safe sous charge = `InvalidOperationException` ou corruption mémoire lors des resize. Correction : `Lazy<T>` + `private` champ + `ConcurrentDictionary` + propriété `IReadOnlyDictionary`."
    },
    {
      "question": "[Ordre de dépendance — Expert] Établissez la chaîne de dépendance correcte : quel concept POO est prérequis à quel principe SOLID, lui-même prérequis à quel pattern ?",
      "options": [
        "Héritage → SRP → Singleton",
        "Abstraction → DIP → Repository (le domaine dépend d'une interface, pas d'EF Core)",
        "Polymorphisme → LSP → Chain of Responsibility",
        "Encapsulation → ISP → Builder"
      ],
      "answer": "Abstraction → DIP → Repository (le domaine dépend d'une interface, pas d'EF Core)",
      "explanation": "Chaîne de dépendance : Abstraction (`interface ITradeRepository`) est le mécanisme POO prérequis. DIP (dépendre de cette abstraction) est le principe SOLID qui l'exploite. Repository est le pattern qui concrétise DIP pour l'accès aux données. Sans Abstraction, DIP est une intention vide. Sans DIP, le Repository n'apporte pas de valeur architecturale. Les trois niveaux (POO → SOLID → Pattern) forment une chaîne logique indissociable."
    },
    {
      "question": "Analysez : `class OrderValidationPipeline { private readonly IEnumerable<IOrderValidator> _validators; void Validate(Order o) { foreach(var v in _validators) v.Validate(o); } }`. Quels patterns et principes identifiez-vous ?",
      "options": [
        "Singleton + AddSingleton + SRP.",
        "Chain of Responsibility (collection de validators) + ISP (`IOrderValidator` ciblée) + DIP (injection de la liste) + SRP (chaque validator = une règle).",
        "Observer + Strategy + OCP.",
        "Builder + Repository + LSP."
      ],
      "answer": "Chain of Responsibility (collection de validators) + ISP (`IOrderValidator` ciblée) + DIP (injection de la liste) + SRP (chaque validator = une règle).",
      "explanation": "Collection d'`IOrderValidator` = Chain of Responsibility simplifié. `IOrderValidator` petite et ciblée = ISP. Injection via constructeur = DIP. Chaque implémentation = une seule règle = SRP. Ce code applique simultanément 4 principes SOLID via 1 pattern — architecture de validation typique d'un système d'ordres en trading."
    },
    {
      "question": "[Refactoring — Anti-pattern + ACID] Ce code ne garantit pas l'Atomicité : `class SettlementService { async Task Settle(Trade t) { await _tradeRepo.MarkSettled(t); await _accountRepo.Debit(t.Amount); await _positionRepo.Close(t); } }`. Quel est le risque et comment corriger ?",
      "options": [
        "Aucun risque — `async/await` garantit l'ordre d'exécution.",
        "Si `Debit` ou `Close` échoue, `MarkSettled` est déjà committée — incohérence comptable. Correction : envelopper dans une `TransactionScope` ou utiliser un `DbContext` partagé (Unit of Work) avec un seul `SaveChanges()`.",
        "Utiliser `Task.WhenAll()` pour exécuter les trois en parallèle.",
        "Marquer le service `AddSingleton` pour garantir l'unicité de la transaction."
      ],
      "answer": "Si `Debit` ou `Close` échoue, `MarkSettled` est déjà committée — incohérence comptable. Correction : envelopper dans une `TransactionScope` ou utiliser un `DbContext` partagé (Unit of Work) avec un seul `SaveChanges()`.",
      "explanation": "Violation ACID Atomicité : si `Debit` plante après `MarkSettled`, le trade est marqué réglé mais le compte n'est pas débité — catastrophique en comptabilité trading. `async/await` ne garantit pas l'atomicité des transactions. Correction : Unit of Work avec `DbContext` partagé (AddScoped) + `SaveChanges()` unique à la fin, ou `TransactionScope` autour des trois opérations. L'Atomicité ACID est indépendante de l'asynchronisme."
    },
    {
      "question": "[Expert global] Quel est le lien entre l'Encapsulation POO, le principe SRP, le pattern Repository et la propriété d'Isolation ACID ?",
      "options": [
        "Ils sont indépendants — chacun opère sur une couche différente.",
        "Tous quatre expriment le même principe à des niveaux différents : protéger un état ou une responsabilité des interférences extérieures.",
        "SRP dépend de Repository, Repository dépend d'Isolation, Isolation dépend d'Encapsulation.",
        "Seuls SRP et Encapsulation sont liés — Repository et Isolation sont indépendants."
      ],
      "answer": "Tous quatre expriment le même principe à des niveaux différents : protéger un état ou une responsabilité des interférences extérieures.",
      "explanation": "Vision unifiée : Encapsulation = protéger l'état d'un objet (niveau classe). SRP = protéger une responsabilité des changements extérieurs (niveau architecture). Repository = protéger le domaine des détails d'infrastructure (niveau couche). Isolation ACID = protéger une transaction des interférences des autres (niveau base de données). Le même principe — isolation et protection contre les interférences — se retrouve à tous les niveaux d'une architecture C# bien conçue."
    },
    {
      "question": "[Nommage inversé — Expert] Une solution architecturale qui : abstrait l'accès aux données, dépend d'une interface, permet d'injecter une implémentation in-memory en tests, respecte DIP, et couvre la propriété d'Isolation ACID au niveau applicatif s'appelle ?",
      "options": [
        "Singleton",
        "Observer",
        "Repository (+ Unit of Work pour l'Atomicité)",
        "Strategy"
      ],
      "answer": "Repository (+ Unit of Work pour l'Atomicité)",
      "explanation": "Ces propriétés définissent le Repository : abstraction de l'accès aux données (`ITradeRepository`), injection d'implémentation différente selon le contexte (DIP), in-memory pour les tests, EF Core en prod. L'Isolation ACID au niveau applicatif est assurée par le `DbContext` partagé entre Repositories (Unit of Work) — chaque transaction voit un état cohérent. Repository + Unit of Work = DIP + ACID dans une architecture C# propre."
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
      "explanation": "Mediator + CQRS : les controllers envoient des `Command`/`Query` sans connaître les handlers. Les `IPipelineBehavior` permettent d'injecter logging, validation FluentValidation, retry Polly en cross-cutting concern — sans toucher aux handlers métier. SRP et OCP appliqués à la couche Application."
    },
    {
      "question": "Vous analysez un système complet : `abstract class BasePricingModel { protected decimal _vol; public abstract decimal Price(); }` + `class BSModel : BasePricingModel` + injection via `IPricingEngine` + `TransactionScope` autour du calcul et de la persistance. Listez tous les concepts POO, SOLID, ACID et patterns présents.",
      "options": [
        "Singleton + Builder + Observer.",
        "Abstraction + Héritage + Encapsulation + Polymorphisme + Strategy + DIP + OCP + SRP + Atomicité ACID.",
        "SRP + OCP + LSP uniquement.",
        "Chain of Responsibility + Repository + Template Method."
      ],
      "answer": "Abstraction + Héritage + Encapsulation + Polymorphisme + Strategy + DIP + OCP + SRP + Atomicité ACID.",
      "explanation": "`abstract class` = Abstraction. `:` = Héritage. `protected _vol` = Encapsulation. `abstract Price()` + `override` dans BSModel = Polymorphisme. Injection via `IPricingEngine` = Strategy + DIP. Nouvelle implémentation sans modifier le code = OCP. Chaque modèle a une responsabilité = SRP. `TransactionScope` = Atomicité ACID. C'est l'architecture de pricing complète d'un trading desk : les 4 piliers POO + 3 principes SOLID + 1 pattern + 1 propriété ACID coexistent dans un seul système cohérent."
    },
    {
      "question": "Quelle combinaison de concepts permet à une architecture microservices de trading d'être testable, évolutive et découplée ?",
      "options": [
        "Singleton + Héritage + Serializable.",
        "DIP (interfaces partout) + Repository (accès données abstrait) + Strategy (algorithmes interchangeables) + Observer/Events (communication découplée) + ACID (intégrité transactionnelle).",
        "OCP + `new` + `static` + `TransactionScope`.",
        "LSP + `AddScoped` + `abstract class` uniquement."
      ],
      "answer": "DIP (interfaces partout) + Repository (accès données abstrait) + Strategy (algorithmes interchangeables) + Observer/Events (communication découplée) + ACID (intégrité transactionnelle).",
      "explanation": "L'architecture testable + évolutive + découplée repose sur ce quintette : DIP (tout dépend d'abstractions = testabilité). Repository (swap infrastructure prod/test). Strategy (swap algorithmes VaR, pricing). Observer/Events (changement d'un service sans impacter les autres). ACID (intégrité des données sous charge concurrente). Ces 5 éléments couvrent les trois axes de qualité architecturale d'une salle de marché en C#."
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

const SLIDE_DURATION = 12000;
const QUESTION_TIME = 25;
const LEVELS = ["moyen", "avance", "expert"];

const Page4 = () => {
  // Single source of truth: one state object avoids inter-render race conditions
  const [phase, setPhase] = useState("basic"); // "basic" | "moyen" | "avance" | "expert" | "results"
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answered, setAnswered] = useState(false); // locks input after answer
  const [message, setMessage] = useState("");

  // Derived safe accessors — never crash even mid-transition
  const isQcm = phase !== "basic" && phase !== "results";
  const currentQs = isQcm ? (questions[phase] || []) : [];
  const safeIdx = Math.min(currentQuestion, currentQs.length - 1);
  const currentQ = currentQs[safeIdx] || null;

  // ── Slide auto-advance ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "basic") return;
    const timer = setTimeout(() => {
      if (currentSlide + 1 < basicSlides.length) {
        setCurrentSlide(s => s + 1);
      } else {
        // All slides done → start QCM
        setPhase("moyen");
        setCurrentQuestion(0);
        setTimeLeft(QUESTION_TIME);
        setAnswered(false);
        setMessage("");
      }
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [phase, currentSlide]);

  // ── Question countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isQcm || answered) return;
    if (timeLeft <= 0) { advanceQuestion(false); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isQcm, answered]);

  // ── Navigation helpers ──────────────────────────────────────────────────────
  const advanceQuestion = (scored) => {
    const qs = questions[phase] || [];
    const nextIdx = safeIdx + 1;
    if (nextIdx < qs.length) {
      setCurrentQuestion(nextIdx);
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
      setMessage("");
    } else {
      const nextLevelIdx = LEVELS.indexOf(phase) + 1;
      if (nextLevelIdx < LEVELS.length) {
        const nextLevel = LEVELS[nextLevelIdx];
        setPhase(nextLevel);
        setCurrentQuestion(0);
        setTimeLeft(QUESTION_TIME);
        setAnswered(false);
        setMessage("");
      } else {
        setPhase("results");
      }
    }
  };

  const handleAnswerClick = (option) => {
    if (answered || !currentQ) return; // guard against double-click or missing question
    setAnswered(true);
    const correct = option === currentQ.answer;
    if (correct) {
      setScores(p => ({ ...p, [phase]: p[phase] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ ${currentQ.answer}\n\nℹ️ ${currentQ.explanation}`);
    }
    setTimeout(() => advanceQuestion(correct), 4000);
  };

  const handleSlideNext = () => {
    if (currentSlide + 1 < basicSlides.length) {
      setCurrentSlide(s => s + 1);
    } else {
      setPhase("moyen");
      setCurrentQuestion(0);
      setTimeLeft(QUESTION_TIME);
      setAnswered(false);
      setMessage("");
    }
  };

  const handleSlidePrev = () => {
    if (currentSlide > 0) setCurrentSlide(s => s - 1);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <div className="qcm-container">
        <Results scores={scores} />
      </div>
    );
  }

  if (phase === "basic") {
    return (
      <div className="qcm-container">
        <Flashcard slide={basicSlides[currentSlide]} />
{/*         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <button
            onClick={handleSlidePrev}
            disabled={currentSlide === 0}
            className="option-button"
            style={{ width: 'auto', padding: '4px 14px', fontSize: '12px', opacity: currentSlide === 0 ? 0.4 : 1 }}
          >
            ← Précédent
          </button>
          <button
            onClick={handleSlideNext}
            className="option-button"
            style={{ width: 'auto', padding: '4px 14px', fontSize: '12px' }}
          >
            {currentSlide + 1 < basicSlides.length ? 'Suivant →' : 'Démarrer le QCM →'}
          </button>
        </div> */}
      </div>
    );
  }

  // QCM phase — currentQ is guaranteed non-null here
  if (!currentQ) return null;

  return (
    <div className="qcm-container">
      <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
        QCM {phase.toUpperCase()} 🔹 Q{safeIdx + 1}/{currentQs.length}
      </h4>
      <QuestionCard
        question={currentQ.question}
        options={currentQ.options}
        onAnswerClick={handleAnswerClick}
        timeLeft={timeLeft}
      />
      {message && (
        <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Page4;
