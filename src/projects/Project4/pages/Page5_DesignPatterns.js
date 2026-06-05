// src/projects/Project3/pages/Page5_DesignPatterns.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Singleton — Une seule instance | Natixis/Finance",
    "answer": "**Problème résolu** : garantir qu'une seule instance d'une classe existe dans toute l'application. ◆ **Principes OOP** : Encapsulation (constructeur privé, accès contrôlé). ◆ **SOLID associé** : SRP (parfois). ◆ **Mots-clés C#** : `static`, `private constructor`, `sealed`, `lock`. ◆ **Implémentation thread-safe** : `private static readonly Singleton _instance = new();` ou double-checked locking avec `lock(_lock)`. ◆ **Cas d'usage Natixis/Finance** : Logger (une seule instance écrit tous les logs), Configuration (paramètres applicatifs chargés une fois), Cache (instance unique du cache Redis client). ◆ **⚠️ Confusion fréquente** : Singleton ≠ variable globale. Le Singleton contrôle l'instanciation via encapsulation. Factory crée des objets sans en limiter le nombre. Repository isole l'accès aux données mais peut avoir plusieurs instances. ◆ **Anti-pattern** : surutil du Singleton rend le code difficile à tester (pas d'injection possible) — préférer l'injection de dépendances en production."
  },
  {
    "question": "Factory — Créer des objets sans exposer leur création | Natixis/Finance",
    "answer": "**Problème résolu** : créer des objets sans que le client connaisse la classe concrète instanciée. ◆ **Principes OOP** : Abstraction, Polymorphisme. ◆ **SOLID associé** : OCP (ouvert à l'extension), DIP (dépend d'abstractions). ◆ **Mots-clés C#** : `interface`, `abstract`, `switch`, `new`. ◆ **Pattern** : `interface IRiskStrategy { decimal Compute(Trade t); }` → `class RiskStrategyFactory { public static IRiskStrategy Create(string type) => type switch { \"SACCR\" => new SACCRStrategy(), \"NetExposure\" => new NetExposureStrategy(), _ => throw new ArgumentException() }; }`. ◆ **Cas d'usage Natixis/Finance** : Création de stratégies de calcul de risque (SA-CCR, Net Exposure, Gross Exposure), instanciation de connecteurs Bloomberg/Reuters selon configuration. ◆ **⚠️ Confusion fréquente** : Factory ≠ Builder. Factory crée en une étape, Builder construit étape par étape. Factory ≠ Singleton : Factory peut créer plusieurs objets différents."
  },
  {
    "question": "Strategy — Changer d'algorithme dynamiquement | Natixis/Finance",
    "answer": "**Problème résolu** : permuter un algorithme à l'exécution sans modifier le code client. ◆ **Principes OOP** : Polymorphisme. ◆ **SOLID associé** : OCP (ajouter une stratégie sans modifier l'existant). ◆ **Mots-clés C#** : `interface`, `override`, `inject`. ◆ **Pattern** : `interface IExposureStrategy { decimal Compute(Portfolio p); }` → `class NetExposureStrategy : IExposureStrategy`, `class GrossExposureStrategy : IExposureStrategy`, `class SACCRStrategy : IExposureStrategy`. Le moteur de risque reçoit la stratégie par injection. ◆ **Cas d'usage Natixis/Finance** : Net Exposure, Gross Exposure, SA-CCR — même moteur, différentes formules réglementaires selon le type de contrepartie. ◆ **⚠️ Confusion fréquente** : Strategy ≠ Factory. Strategy choisit l'algorithme, Factory choisit l'objet à créer. Strategy ≠ Decorator : Decorator ajoute des fonctionnalités en enveloppant, Strategy remplace l'algorithme entier."
  },
  {
    "question": "Repository — Isoler l'accès aux données | Natixis/Finance",
    "answer": "**Problème résolu** : isoler la logique métier de la couche d'accès aux données. ◆ **Principes OOP** : Abstraction. ◆ **SOLID associé** : DIP (le service dépend de l'interface, pas de SQL Server). ◆ **Mots-clés C#** : `interface`, `DbContext`, `IQueryable`. ◆ **Pattern** : `interface IExposureRepository { Task<IEnumerable<Exposure>> GetByCounterpartyAsync(string cpty); Task SaveAsync(Exposure e); }` → implémentation `OracleExposureRepository : IExposureRepository` ou `SqlExposureRepository`. ◆ **Cas d'usage Natixis/Finance** : Oracle Exposure Repository (lecture des expositions depuis Oracle), accès aux trades, positions, référentiels. ◆ **⚠️ Confusion fréquente** : Repository ≠ Facade. Repository isole les données, Facade simplifie une interface complexe. Repository ≠ Singleton : le Repository peut être instancié plusieurs fois et injecté."
  },
  {
    "question": "Builder — Construire des objets complexes | Natixis/Finance",
    "answer": "**Problème résolu** : construire un objet complexe étape par étape, sans constructeur à 15 paramètres. ◆ **Principes OOP** : Encapsulation. ◆ **SOLID associé** : SRP (chaque étape de construction a une responsabilité). ◆ **Mots-clés C#** : `Build()`, `WithX()`, `return this` (fluent interface). ◆ **Pattern** : `class TradeBuilder { private Trade _trade = new(); public TradeBuilder WithNotional(decimal n) { _trade.Notional = n; return this; } public TradeBuilder WithCounterparty(string c) { _trade.Counterparty = c; return this; } public Trade Build() => _trade; }` → usage : `new TradeBuilder().WithNotional(1_000_000).WithCounterparty(\"BNPP\").Build()`. ◆ **Cas d'usage Natixis/Finance** : Construction d'un Trade complexe (Swap de taux, CDS, options) avec de nombreux paramètres optionnels. ◆ **⚠️ Confusion fréquente** : Builder ≠ Factory. Factory crée en une étape, Builder construit progressivement. Builder ≠ Constructor avec paramètres optionnels."
  },
  {
    "question": "Facade — Simplifier un système complexe | Natixis/Finance",
    "answer": "**Problème résolu** : fournir une interface unique et simplifiée à un sous-système complexe. ◆ **Principes OOP** : Encapsulation. ◆ **SOLID associé** : ISP (interface spécialisée et simple pour le client). ◆ **Mots-clés C#** : `public service unique`. ◆ **Pattern** : `class FermatFacade { private readonly PricingEngine _pricer; private readonly RiskEngine _risk; private readonly ReportingService _report; public decimal ComputeAndReport(Trade t) { var price = _pricer.Price(t); var risk = _risk.Compute(t); _report.Generate(price, risk); return price; } }`. ◆ **Cas d'usage Natixis/Finance** : Point d'entrée FERMAT (système de risque Natixis) — le front office appelle une méthode unique qui orchestre pricing, calcul de risque, reporting. ◆ **⚠️ Confusion fréquente** : Facade ≠ Adapter. Facade simplifie, Adapter connecte deux interfaces incompatibles. Facade ≠ Repository : Facade orchestre plusieurs services, Repository isole une source de données."
  },
  {
    "question": "Adapter — Connecter deux systèmes incompatibles | Natixis/Finance",
    "answer": "**Problème résolu** : permettre à deux interfaces incompatibles de fonctionner ensemble sans modifier leur code. ◆ **Principes OOP** : Composition. ◆ **SOLID associé** : OCP (le système existant n'est pas modifié). ◆ **Mots-clés C#** : `wrapper`, `composition`. ◆ **Pattern** : `interface IMarketDataProvider { Quote GetQuote(string isin); }` → `class BloombergAdapter : IMarketDataProvider { private readonly BloombergAPI _bbg = new(); public Quote GetQuote(string isin) => ConvertToQuote(_bbg.GetData(new BbgRequest(isin))); }`. ◆ **Cas d'usage Natixis/Finance** : Bloomberg API Adapter (adapte l'API Bloomberg propriétaire vers l'interface interne standard), Reuters Adapter, connecteurs legacy. ◆ **⚠️ Confusion fréquente** : Adapter ≠ Facade. Adapter traduit une interface existante, Facade en crée une nouvelle simplifiée. Adapter ≠ Decorator : Decorator ajoute des comportements, Adapter change l'interface."
  },
  {
    "question": "Decorator — Ajouter des fonctionnalités dynamiquement | Natixis/Finance",
    "answer": "**Problème résolu** : ajouter des comportements à un objet sans modifier sa classe, en l'enveloppant. ◆ **Principes OOP** : Composition. ◆ **SOLID associé** : OCP (étendre sans modifier). ◆ **Mots-clés C#** : `wrap`, `delegate`. ◆ **Pattern** : `class AuditRepositoryDecorator : ITradeRepository { private readonly ITradeRepository _inner; private readonly IAuditLogger _audit; public async Task SaveAsync(Trade t) { await _inner.SaveAsync(t); await _audit.LogAsync($\"Trade {t.Id} saved\"); } }`. Le client utilise le decorator comme s'il utilisait le repository normal. ◆ **Cas d'usage Natixis/Finance** : Audit (logger chaque accès aux données sans modifier le repository), Logging (tracer les appels), Cache decorator (mettre en cache les résultats). ◆ **⚠️ Confusion fréquente** : Decorator ≠ Adapter. Decorator conserve l'interface et ajoute du comportement. Decorator ≠ Observer : Observer notifie des abonnés externes, Decorator agit dans la chaîne d'appel."
  },
  {
    "question": "Observer — Notification automatique | Natixis/Finance",
    "answer": "**Problème résolu** : notifier automatiquement plusieurs abonnés quand l'état d'un objet change. ◆ **Principes OOP** : Polymorphisme. ◆ **SOLID associé** : OCP (ajouter des abonnés sans modifier le sujet). ◆ **Mots-clés C#** : `event`, `delegate`, `Action`. ◆ **Pattern** : `class RiskMonitor { public event Action<RiskAlert> OnLimitBreached; public void CheckLimits(Position p) { if(p.VaR > _limit) OnLimitBreached?.Invoke(new RiskAlert(p)); } }` → abonnés : `monitor.OnLimitBreached += alert => SendEmail(alert);` `monitor.OnLimitBreached += alert => PublishToKafka(alert);`. ◆ **Cas d'usage Natixis/Finance** : Alertes limites de crédit (notifier le trader, le risk manager, le compliance quand une limite est dépassée), Market Data broadcast (notifier tous les systèmes d'un nouveau prix). ◆ **⚠️ Confusion fréquente** : Observer ≠ Strategy. Observer notifie des changements, Strategy remplace un algorithme. Observer ≠ Decorator : Decorator enveloppe dans la chaîne d'appel, Observer découple via événements."
  },
  {
    "question": "Dependency Injection — Découpler les dépendances | Natixis/Finance",
    "answer": "**Problème résolu** : découpler les classes de leurs dépendances concrètes pour faciliter les tests et la modularité. ◆ **Principes OOP** : Abstraction. ◆ **SOLID associé** : DIP (les classes de haut niveau ne dépendent pas des classes de bas niveau, mais d'abstractions). ◆ **Mots-clés C#** : `constructor injection`, `IServiceCollection`. ◆ **Pattern** : `class RiskEngine { private readonly IRiskRepository _repo; private readonly IExposureStrategy _strategy; public RiskEngine(IRiskRepository repo, IExposureStrategy strategy) { _repo = repo; _strategy = strategy; } }` → configuration : `services.AddScoped<IRiskRepository, OracleRiskRepository>(); services.AddScoped<IExposureStrategy, SACCRStrategy>();`. ◆ **Cas d'usage Natixis/Finance** : Injection Repository (OracleRiskRepository, SqlTradeRepository), injection de stratégies de calcul, injection de loggers. ◆ **⚠️ Confusion fréquente** : DI ≠ Factory. DI configure le conteneur IoC, Factory crée des instances à la demande. DI ≠ Singleton : DI peut gérer des lifetimes (Singleton, Scoped, Transient)."
  }
];

const questions = {
  moyen: [
    // ── SINGLETON (Q1–Q10) ──
    {
      "question": "[Singleton] Quelle caractéristique rend un Singleton thread-safe en C# ?",
      "options": [
        "Déclarer la classe `public` avec une propriété `Instance` publique.",
        "Utiliser `private static readonly Singleton _instance = new();` (initialisation statique) ou un `lock` avec double-checked locking.",
        "Utiliser `abstract` pour empêcher l'instanciation directe.",
        "Injecter le Singleton via `IServiceCollection` comme `AddScoped`."
      ],
      "answer": "Utiliser `private static readonly Singleton _instance = new();` (initialisation statique) ou un `lock` avec double-checked locking.",
      "explanation": "L'initialisation statique est thread-safe par le CLR .NET (garantie de l'initialisation avant le premier accès). Le double-checked locking avec `lock` est l'alternative pour les cas où l'initialisation est coûteuse. `AddScoped` n'est pas un Singleton — c'est une durée de vie différente dans DI. `abstract` empêche l'instanciation mais ne garantit pas l'unicité."
    },
    {
      "question": "[Singleton vs Factory] Dans un système de logging Natixis, pourquoi utilise-t-on Singleton plutôt que Factory pour le Logger ?",
      "options": [
        "Parce que Factory ne sait pas créer des loggers.",
        "Le Logger doit être unique dans toute l'application — une seule instance écrit dans le même fichier/stream sans conflit. Factory créerait plusieurs instances différentes.",
        "Parce que Singleton est plus rapide que Factory.",
        "Factory est réservé aux objets métier, pas aux services techniques."
      ],
      "answer": "Le Logger doit être unique dans toute l'application — une seule instance écrit dans le même fichier/stream sans conflit. Factory créerait plusieurs instances différentes.",
      "explanation": "Singleton garantit l'unicité : un seul Logger = un seul point d'écriture = pas de race condition sur le fichier de log. Factory résoudrait un problème différent : créer des objets variés sans exposer leur instanciation. Ici on veut UNE instance, pas des instances variées."
    },
    {
      "question": "[Singleton — Cas finance] Dans une application de cache de prix de marché, quel problème résout le pattern Singleton ?",
      "options": [
        "Permettre à chaque module d'avoir sa propre version du cache.",
        "Garantir que toutes les parties de l'application lisent les mêmes données de prix depuis une instance de cache unique — évite les incohérences si deux caches ont des prix différents.",
        "Accélérer les calculs de pricing en parallélisant le cache.",
        "Isoler l'accès à la base de données Oracle."
      ],
      "answer": "Garantir que toutes les parties de l'application lisent les mêmes données de prix depuis une instance de cache unique — évite les incohérences si deux caches ont des prix différents.",
      "explanation": "En finance, une incohérence de prix entre deux modules est catastrophique : le moteur de pricing voit BNPP.PA à 58€ pendant que le moteur de risque le voit à 56€. Le Singleton cache garantit une source de vérité unique. C'est pourquoi `RedisClient`, `ConfigurationManager`, `Logger` sont typiquement des Singletons."
    },
    {
      "question": "[Singleton — SOLID] Le Singleton respecte-t-il le DIP (Dependency Inversion Principle) ? Pourquoi ?",
      "options": [
        "Oui, car il utilise une interface pour s'exposer.",
        "Non, car les classes qui appellent `Singleton.Instance` dépendent directement de la classe concrète — couplage fort difficile à mocker en tests.",
        "Oui, car le constructeur privé inverse les dépendances.",
        "Non, car il viole le SRP en gérant à la fois l'instance et la logique."
      ],
      "answer": "Non, car les classes qui appellent `Singleton.Instance` dépendent directement de la classe concrète — couplage fort difficile à mocker en tests.",
      "explanation": "Anti-pattern du Singleton brut : `var logger = Logger.Instance;` crée un couplage direct à `Logger`. En tests unitaires, impossible de substituer un faux Logger. Solution : combiner Singleton avec DI — enregistrer le Singleton dans `IServiceCollection.AddSingleton<ILogger, Logger>()` et injecter `ILogger` partout. Ainsi, les classes dépendent de l'abstraction, pas de l'implémentation."
    },
    {
      "question": "[Confusion Singleton/Repository] Un développeur crée un `PositionRepository` en Singleton car 'la base de données est unique'. Est-ce correct ?",
      "options": [
        "Oui, une base de données unique justifie un Repository Singleton.",
        "Non — Repository et Singleton résolvent des problèmes différents. Repository isole l'accès aux données (abstraction). Singleton contrôle l'unicité d'instance. Un Repository peut être Scoped (une instance par requête HTTP) via DI.",
        "Oui, tous les repositories doivent être des Singletons pour la performance.",
        "Non, un Repository doit toujours être Transient."
      ],
      "answer": "Non — Repository et Singleton résolvent des problèmes différents. Repository isole l'accès aux données (abstraction). Singleton contrôle l'unicité d'instance. Un Repository peut être Scoped (une instance par requête HTTP) via DI.",
      "explanation": "Confusion classique : l'unicité de la base de données ne justifie pas de rendre le Repository Singleton. Le Repository est une abstraction (DIP) — sa durée de vie (Singleton/Scoped/Transient) est une décision séparée. En pratique, les Repositories qui utilisent `DbContext` doivent être Scoped car `DbContext` n'est pas thread-safe en Singleton."
    },
    {
      "question": "[Singleton — mots-clés C#] Que garantit `sealed` sur une classe Singleton en C# ?",
      "options": [
        "Que la classe ne peut pas être sérialisée.",
        "Que la classe ne peut pas être héritée — empêche de créer une sous-classe qui contourne le constructeur privé.",
        "Que tous les membres sont thread-safe automatiquement.",
        "Que l'instance est détruite à la fin du programme."
      ],
      "answer": "Que la classe ne peut pas être héritée — empêche de créer une sous-classe qui contourne le constructeur privé.",
      "explanation": "`sealed` est une protection supplémentaire : sans `sealed`, une sous-classe pourrait déclarer un constructeur `public` et contourner l'unicité garantie par le constructeur `private`. En combinant `sealed` + `private constructor` + `static readonly instance`, le Singleton est robuste contre les tentatives de contournement."
    },
    {
      "question": "[Singleton vs DI] En ASP.NET Core, `services.AddSingleton<IConfiguration, Configuration>()` est-il le pattern Singleton GoF ?",
      "options": [
        "Oui, c'est exactement le pattern Singleton avec constructeur privé.",
        "Non — c'est la durée de vie Singleton du conteneur DI : une seule instance par conteneur, mais sans constructeur privé. Le DI gère l'unicité, pas la classe elle-même.",
        "Non, c'est le pattern Factory qui crée une instance unique.",
        "Oui, et il viole DIP car il dépend d'une classe concrète."
      ],
      "answer": "Non — c'est la durée de vie Singleton du conteneur DI : une seule instance par conteneur, mais sans constructeur privé. Le DI gère l'unicité, pas la classe elle-même.",
      "explanation": "Différence importante : Singleton GoF = la classe elle-même contrôle son unicité (constructeur privé, instance statique). Singleton DI = le conteneur IoC garantit une seule instance — la classe est une classe normale injectable. En production Natixis, on préfère le Singleton DI : testable, injecte des interfaces, respecte DIP."
    },
    {
      "question": "[Singleton — Configuration Natixis] Un `ConfigurationManager` Singleton charge les paramètres (base Oracle, limites de risque) une seule fois au démarrage. Quel avantage en termes de performance ?",
      "options": [
        "Aucun — la configuration est lue à chaque appel.",
        "La configuration est lue une seule fois depuis la base Oracle au démarrage, puis en mémoire pour tous les appels suivants — élimine N requêtes DB répétées pendant la journée.",
        "La configuration est automatiquement mise à jour quand Oracle change.",
        "Plusieurs threads peuvent écrire la configuration simultanément."
      ],
      "answer": "La configuration est lue une seule fois depuis la base Oracle au démarrage, puis en mémoire pour tous les appels suivants — élimine N requêtes DB répétées pendant la journée.",
      "explanation": "Pattern Singleton Configuration : charger les limites de risque (VaR limit par desk, limites de concentration) depuis Oracle une seule fois = performances optimales. Sans Singleton, chaque calcul de risque requêterait Oracle. Attention : si la configuration change en cours de journée (modification d'une limite), il faut un mécanisme de rechargement — typiquement un événement Kafka `ConfigurationUpdated` qui force le rechargement."
    },
    {
      "question": "[Singleton — Encapsulation] Pourquoi le constructeur d'un Singleton doit-il être `private` ?",
      "options": [
        "Pour que la classe soit plus performante.",
        "Pour empêcher toute instanciation externe — seule la classe elle-même peut créer son instance via la propriété statique `Instance`, garantissant l'unicité.",
        "Pour respecter le SRP — un seul constructeur.",
        "Pour que la classe soit thread-safe automatiquement."
      ],
      "answer": "Pour empêcher toute instanciation externe — seule la classe elle-même peut créer son instance via la propriété statique `Instance`, garantissant l'unicité.",
      "explanation": "Le constructeur `private` est la pierre angulaire du Singleton : `new Logger()` depuis l'extérieur est une erreur de compilation. L'unique point d'accès est `Logger.Instance`. Sans `private`, n'importe quel code pourrait créer `new Logger()` et avoir une instance séparée — l'unicité ne serait plus garantie."
    },
    {
      "question": "[Singleton — Anti-pattern] Pourquoi le Singleton est-il considéré comme un anti-pattern dans une architecture microservices Natixis ?",
      "options": [
        "Parce que les microservices ne supportent pas C#.",
        "Dans des microservices scalés horizontalement (plusieurs instances du service), chaque instance a son propre Singleton — il n'y a plus d'unicité globale. Utiliser Redis ou un service externe pour la state partagée.",
        "Parce que le Singleton consomme trop de mémoire.",
        "Parce que les microservices doivent utiliser le pattern Factory."
      ],
      "answer": "Dans des microservices scalés horizontalement (plusieurs instances du service), chaque instance a son propre Singleton — il n'y a plus d'unicité globale. Utiliser Redis ou un service externe pour la state partagée.",
      "explanation": "Le Singleton est local au processus. En microservices avec 3 pods Kubernetes, il y a 3 Singletons différents. Pour un cache partagé : Redis. Pour une configuration partagée : consul/Vault ou SQL Server. Le Singleton reste valide pour l'état in-process (logger, configuration locale) mais pas pour la state distribuée."
    },

    // ── FACTORY (Q11–Q20) ──
    {
      "question": "[Factory] Quel problème résout le pattern Factory dans un moteur de risque Natixis ?",
      "options": [
        "Garantir qu'une seule instance du moteur de risque existe.",
        "Créer la bonne stratégie de calcul (SA-CCR, Net Exposure, Gross Exposure) sans que le code appelant connaisse la classe concrète — découplage de la création.",
        "Ajouter des fonctionnalités de logging au moteur de risque sans le modifier.",
        "Construire un objet Trade complexe étape par étape."
      ],
      "answer": "Créer la bonne stratégie de calcul (SA-CCR, Net Exposure, Gross Exposure) sans que le code appelant connaisse la classe concrète — découplage de la création.",
      "explanation": "Factory = encapsuler la logique de création. Le code appelant dit `RiskStrategyFactory.Create('SACCR')` et reçoit un `IRiskStrategy` sans savoir que c'est `SACCRStrategy`. Si une nouvelle réglementation exige `BaselIVStrategy`, on l'ajoute dans la Factory sans toucher au code appelant — OCP respecté."
    },
    {
      "question": "[Factory vs Builder] Quelle est la différence fondamentale entre Factory et Builder ?",
      "options": [
        "Factory est pour les objets simples, Builder pour les objets complexes — en termes de nombre de paramètres uniquement.",
        "Factory crée un objet en une étape (une méthode), Builder construit un objet étape par étape avec une interface fluente (`WithX().WithY().Build()`).",
        "Factory retourne toujours une interface, Builder retourne toujours une classe concrète.",
        "Builder utilise `abstract`, Factory utilise `interface`."
      ],
      "answer": "Factory crée un objet en une étape (une méthode), Builder construit un objet étape par étape avec une interface fluente (`WithX().WithY().Build()`).",
      "explanation": "Distinction clé : `RiskStrategyFactory.Create('SACCR')` → un appel, objet prêt. `new TradeBuilder().WithNotional(1M).WithCpty('BNPP').WithMaturity(DateTime.Now.AddYears(5)).Build()` → plusieurs étapes, chaque étape optionnelle. Factory = quel type d'objet créer. Builder = comment construire un objet complexe de même type."
    },
    {
      "question": "[Factory — OCP] Comment le pattern Factory respecte-t-il l'Open/Closed Principle dans un contexte réglementaire ?",
      "options": [
        "En rendant la Factory `sealed` pour éviter les modifications.",
        "En ajoutant un nouveau cas dans le `switch` de la Factory pour chaque nouvelle réglementation — fermé à la modification du code appelant, ouvert à l'extension dans la Factory.",
        "En créant une interface pour la Factory elle-même.",
        "En utilisant `abstract` sur la Factory pour permettre l'héritage."
      ],
      "answer": "En ajoutant un nouveau cas dans le `switch` de la Factory pour chaque nouvelle réglementation — fermé à la modification du code appelant, ouvert à l'extension dans la Factory.",
      "explanation": "OCP en pratique : quand Bâle IV exige un nouveau calcul d'exposition, on ajoute `'BaselIV' => new BaselIVStrategy()` dans la Factory. Tout le code qui utilise `RiskStrategyFactory.Create()` n'a pas besoin de changer — il reçoit automatiquement le bon type. Sans Factory, il faudrait modifier chaque `if/switch` dans le code métier."
    },
    {
      "question": "[Factory — DIP] Pourquoi Factory respecte-t-il le Dependency Inversion Principle ?",
      "options": [
        "Parce que la Factory dépend de classes abstraites.",
        "Parce que le code appelant reçoit une interface (`IRiskStrategy`) et ne dépend jamais des classes concrètes (`SACCRStrategy`, `GrossExposureStrategy`).",
        "Parce que la Factory est injectée via IServiceCollection.",
        "Parce que Factory utilise `abstract` sur toutes ses méthodes."
      ],
      "answer": "Parce que le code appelant reçoit une interface (`IRiskStrategy`) et ne dépend jamais des classes concrètes (`SACCRStrategy`, `GrossExposureStrategy`).",
      "explanation": "DIP : les modules de haut niveau (moteur de risque) ne dépendent pas des modules de bas niveau (SACCRStrategy). La Factory est le point de création qui connaît les concrétions — le reste du code ne voit que `IRiskStrategy`. Si on remplace `SACCRStrategy` par `SACCRv2Strategy`, le moteur de risque n'est pas recompilé."
    },
    {
      "question": "[Factory — Bloomberg Adapter] Un `MarketDataProviderFactory.Create('Bloomberg')` retourne `IMarketDataProvider`. Quelle confusion doit-on éviter ?",
      "options": [
        "Confondre Factory et Singleton — la Factory ne garantit pas l'unicité.",
        "Confondre Factory et Adapter — l'Adapter adapte une interface existante (Bloomberg API → IMarketDataProvider), la Factory décide quel provider instancier selon un paramètre.",
        "Confondre Factory et Repository — les deux isolent l'accès aux données.",
        "Confondre Factory et Observer — les deux notifient des changements."
      ],
      "answer": "Confondre Factory et Adapter — l'Adapter adapte une interface existante (Bloomberg API → IMarketDataProvider), la Factory décide quel provider instancier selon un paramètre.",
      "explanation": "Dans un système Natixis, les deux coexistent : `BloombergAdapter` traduit l'API Bloomberg propriétaire vers `IMarketDataProvider` (Adapter). `MarketDataProviderFactory.Create('Bloomberg')` instancie le bon Adapter selon la configuration (Factory). L'un adapte une interface, l'autre choisit quoi créer."
    },
    {
      "question": "[Factory — mots-clés C#] `interface`, `abstract`, `switch`, `new` — lequel de ces mots-clés N'EST PAS central au pattern Factory ?",
      "options": [
        "`interface` — Factory retourne toujours une interface.",
        "`lock` — le verrou de synchronisation n'est pas central au pattern Factory.",
        "`switch` — la Factory utilise souvent un switch pour choisir la classe.",
        "`new` — Factory encapsule les `new` des classes concrètes."
      ],
      "answer": "`lock` — le verrou de synchronisation n'est pas central au pattern Factory.",
      "explanation": "`lock` est le mot-clé du Singleton thread-safe, pas de Factory. Factory s'appuie sur : `interface` (type de retour abstrait), `switch` ou `if` (logique de sélection), `new` (instanciation encapsulée), `abstract` (classe de base optionnelle). Factory n'a pas besoin de synchronisation car elle ne maintient pas d'état partagé."
    },
    {
      "question": "[Factory — Cas Natixis] Pourquoi une Factory est-elle préférable à un `switch/case` direct dans le code métier pour choisir une stratégie de calcul ?",
      "options": [
        "La Factory est plus rapide à l'exécution.",
        "Centraliser la logique de création en un seul endroit : si la liste des stratégies change, on modifie uniquement la Factory — pas les 15 endroits du code métier qui avaient chacun leur `switch`.",
        "La Factory respecte le SRP car elle a une seule méthode.",
        "Le `switch` direct viole toujours le principe SOLID."
      ],
      "answer": "Centraliser la logique de création en un seul endroit : si la liste des stratégies change, on modifie uniquement la Factory — pas les 15 endroits du code métier qui avaient chacun leur `switch`.",
      "explanation": "Principe DRY (Don't Repeat Yourself) + OCP : sans Factory, le `switch` de sélection de stratégie est copié-collé partout. Quand SA-CCR évolue en SA-CCR+, il faut retrouver et modifier les 15 switchs. Avec Factory : `RiskStrategyFactory` est le seul endroit à modifier. Bénéfice additionnel : testabilité — on peut mocker la Factory en tests."
    },
    {
      "question": "[Factory vs Dependency Injection] Quelle est la différence entre Factory et DI pour créer une `IRiskStrategy` ?",
      "options": [
        "Ce sont des synonymes dans ASP.NET Core.",
        "Factory crée des objets à la demande avec un paramètre runtime (ex: type de calcul selon la contrepartie). DI configure des instances au démarrage de l'application — moins flexible pour des choix dynamiques.",
        "DI est toujours préférable à Factory.",
        "Factory est pour les interfaces, DI est pour les classes abstraites."
      ],
      "answer": "Factory crée des objets à la demande avec un paramètre runtime (ex: type de calcul selon la contrepartie). DI configure des instances au démarrage de l'application — moins flexible pour des choix dynamiques.",
      "explanation": "Complémentarité : DI est idéal quand le type est connu à la compilation (`AddScoped<IRiskRepo, OracleRiskRepo>`). Factory est nécessaire quand le type dépend d'une donnée runtime (le type de contrepartie lu depuis la DB). En pratique Natixis : on injecte la Factory via DI, et la Factory crée la bonne stratégie selon les données de la requête."
    },
    {
      "question": "[Factory — Abstract Factory] Qu'est-ce que l'Abstract Factory et quand l'utiliser à Natixis ?",
      "options": [
        "Une Factory avec un constructeur `abstract`.",
        "Une Factory de Factories — crée des familles d'objets cohérents. Ex: `IEuropeRiskFactory` (crée `IExposureStrategy` + `IRegulatoryReport` conformes EMIR) vs `IUSRiskFactory` (conformes Dodd-Frank).",
        "Une Factory qui retourne uniquement des classes `abstract`.",
        "Une Factory enregistrée comme `abstract` dans le DI container."
      ],
      "answer": "Une Factory de Factories — crée des familles d'objets cohérents. Ex: `IEuropeRiskFactory` (crée `IExposureStrategy` + `IRegulatoryReport` conformes EMIR) vs `IUSRiskFactory` (conformes Dodd-Frank).",
      "explanation": "Abstract Factory = cohérence de famille. Dans un contexte réglementaire multi-juridictions, Natixis (Paris) doit produire des objets cohérents EMIR, tandis que la filiale NY produit du Dodd-Frank. `IEuropeRiskFactory.CreateExposureStrategy()` + `IEuropeRiskFactory.CreateReport()` garantissent que la stratégie et le rapport sont compatibles EMIR. Changer de réglementation = changer de factory concrète."
    },
    {
      "question": "[Factory — Confusion avec Singleton] Un `LoggerFactory.GetLogger('RiskEngine')` retourne-t-il toujours la même instance ?",
      "options": [
        "Oui, c'est un Singleton déguisé en Factory.",
        "Cela dépend de l'implémentation — la Factory peut retourner une instance partagée (comportement Singleton pour un nom donné) ou une nouvelle instance. Les deux sont valides selon le besoin.",
        "Non, une Factory crée toujours une nouvelle instance.",
        "Oui, toutes les Factories sont des Singletons."
      ],
      "answer": "Cela dépend de l'implémentation — la Factory peut retourner une instance partagée (comportement Singleton pour un nom donné) ou une nouvelle instance. Les deux sont valides selon le besoin.",
      "explanation": "Une Factory peut maintenir un cache interne et retourner la même instance pour un nom donné — c'est le pattern Flyweight combiné avec Factory. Ce qui différencie Factory de Singleton : la Factory peut créer des instances DIFFÉRENTES selon les paramètres (`GetLogger('RiskEngine')` ≠ `GetLogger('PricingEngine')`). Le Singleton retourne toujours la même instance unique."
    },

    // ── STRATEGY (Q21–Q30) ──
    {
      "question": "[Strategy] Quelle est la différence entre Strategy et un `if/else` classique pour choisir un algorithme de calcul d'exposition ?",
      "options": [
        "Il n'y a pas de différence, Strategy est juste un if/else orienté objet.",
        "Strategy encapsule chaque algorithme dans une classe séparée, injectable et interchangeable à runtime — `if/else` est du code mort si un algorithme n'est pas testé indépendamment.",
        "Strategy est plus rapide que if/else.",
        "if/else respecte mieux OCP que Strategy."
      ],
      "answer": "Strategy encapsule chaque algorithme dans une classe séparée, injectable et interchangeable à runtime — `if/else` est du code mort si un algorithme n'est pas testé indépendamment.",
      "explanation": "Avantages Strategy sur if/else : (1) Testabilité — `SACCRStrategy` est testée en isolation avec des données de marché contrôlées. (2) OCP — ajouter `BaselIVStrategy` ne modifie pas le code existant. (3) Runtime swap — injecter une stratégie différente selon la contrepartie sans recompiler. (4) SRP — chaque stratégie a une seule responsabilité. Un if/else à 10 branches = classe God qui viole SRP."
    },
    {
      "question": "[Strategy — OCP] Un nouveau règlement Bâle IV exige un calcul d'exposition différent. Comment Strategy respecte-t-il OCP ?",
      "options": [
        "En modifiant la méthode `Compute()` dans la classe existante.",
        "En créant `BaselIVStrategy : IExposureStrategy` et en l'injectant dans le moteur de risque — le moteur de risque n'est pas modifié.",
        "En ajoutant un paramètre `basleVersion` à la méthode de calcul.",
        "En créant une sous-classe du moteur de risque qui override le calcul."
      ],
      "answer": "En créant `BaselIVStrategy : IExposureStrategy` et en l'injectant dans le moteur de risque — le moteur de risque n'est pas modifié.",
      "explanation": "OCP parfait avec Strategy : le moteur de risque est `closed` (aucune modification). La nouvelle stratégie `BaselIVStrategy` est l'`extension` (open). Le DI container est mis à jour : `services.AddScoped<IExposureStrategy, BaselIVStrategy>()`. Le moteur de risque en production continue de fonctionner sans recompilation pour les contreparties existantes."
    },
    {
      "question": "[Strategy vs Decorator] Quelle est la différence entre Strategy et Decorator pour ajouter du logging sur un calcul de risque ?",
      "options": [
        "Aucune différence — les deux ajoutent du comportement.",
        "Strategy remplace l'algorithme entier (autre formule de calcul). Decorator enveloppe l'existant pour ajouter du comportement (logging) sans changer l'algorithme.",
        "Strategy ajoute du comportement, Decorator le remplace.",
        "Decorator utilise `interface`, Strategy utilise `abstract class`."
      ],
      "answer": "Strategy remplace l'algorithme entier (autre formule de calcul). Decorator enveloppe l'existant pour ajouter du comportement (logging) sans changer l'algorithme.",
      "explanation": "Distinction essentielle : `SACCRStrategy` calcule différemment de `NetExposureStrategy` — c'est Strategy (remplacement). `LoggingStrategyDecorator` enveloppe `SACCRStrategy`, appelle `_inner.Compute()` puis loggue — c'est Decorator (enrichissement). En pratique, on peut combiner les deux : une Factory crée la Strategy et la wrapping dans un Decorator."
    },
    {
      "question": "[Strategy — injection] Comment injecter dynamiquement la bonne `IExposureStrategy` selon le type de contrepartie à runtime ?",
      "options": [
        "Créer un `if/else` dans le constructeur du moteur de risque.",
        "Injecter une `IExposureStrategyFactory` qui sélectionne la stratégie selon le type de contrepartie lue depuis la base — combinaison Strategy + Factory.",
        "Utiliser `switch` dans la méthode `Compute()` du moteur.",
        "Enregistrer toutes les stratégies comme Singleton et les appeler toutes."
      ],
      "answer": "Injecter une `IExposureStrategyFactory` qui sélectionne la stratégie selon le type de contrepartie lue depuis la base — combinaison Strategy + Factory.",
      "explanation": "Pattern combiné Strategy + Factory : au moment du calcul, on lit le type de contrepartie (Banque, Corporat, Souverain) depuis la base. La Factory sélectionne la stratégie correspondante. Le moteur de risque ne connaît que `IExposureStrategy` — découplage total. Si la réglementation change la stratégie pour les Corporats, seule la Factory est modifiée."
    },
    {
      "question": "[Strategy — mots-clés C#] Dans `class SACCRStrategy : IExposureStrategy { public decimal Compute(Portfolio p) => ... }`, quel est le rôle de `override` ?",
      "options": [
        "`override` est obligatoire pour implémenter une interface.",
        "`override` est utilisé quand la classe de base est `abstract` avec une méthode `abstract` ou `virtual` — pour une interface, le mot-clé est absent (implémentation implicite).",
        "`override` garantit que la méthode est thread-safe.",
        "`override` permet d'appeler la méthode de base avec `base.Compute()`."
      ],
      "answer": "`override` est utilisé quand la classe de base est `abstract` avec une méthode `abstract` ou `virtual` — pour une interface, le mot-clé est absent (implémentation implicite).",
      "explanation": "Nuance C# : pour une `interface`, l'implémentation est implicite — pas de `override` nécessaire. `override` est obligatoire pour redéfinir une méthode `abstract` ou `virtual` d'une classe de base. En Strategy, si la structure est `interface IExposureStrategy`, on implémente sans `override`. Si c'est `abstract class BaseStrategy`, les sous-classes utilisent `override`."
    },
    {
      "question": "[Strategy — Net vs Gross Exposure] Dans un desk de trading Natixis, quelle est la différence entre Net Exposure et Gross Exposure comme stratégies ?",
      "options": [
        "Ce sont des synonymes dans le calcul de risque.",
        "Net Exposure = positions longues − positions courtes sur la même contrepartie. Gross Exposure = somme des valeurs absolues (longues + courtes). Deux stratégies différentes, même interface `IExposureStrategy.Compute()`.",
        "Net Exposure est réglementaire, Gross Exposure est interne.",
        "Gross Exposure est calculé par le RMS, Net Exposure par le PMS."
      ],
      "answer": "Net Exposure = positions longues − positions courtes sur la même contrepartie. Gross Exposure = somme des valeurs absolues (longues + courtes). Deux stratégies différentes, même interface `IExposureStrategy.Compute()`.",
      "explanation": "Exemple parfait du pattern Strategy en finance : même interface, algorithmes radicalement différents. Desk equity long 10M€ BNPP, short 3M€ BNPP CDS : Net = 7M€, Gross = 13M€. Le choix dépend du contexte réglementaire et du type de limite appliquée. Le moteur de risque ne sait pas laquelle est utilisée — c'est la Factory qui décide selon le desk et la réglementation."
    },
    {
      "question": "[Strategy — SA-CCR] Pourquoi SA-CCR (Standardised Approach for Counterparty Credit Risk) est-il un exemple idéal de pattern Strategy ?",
      "options": [
        "Parce que SA-CCR est une classe `static` sans état.",
        "SA-CCR est une méthode réglementaire de calcul d'exposition qui peut être remplacée par IMM (Internal Model Method) selon les banques — même interface `IExposureStrategy`, formules complètement différentes.",
        "SA-CCR utilise le pattern Singleton car le calcul est identique pour toutes les contreparties.",
        "SA-CCR est implémenté en Python, pas en C#."
      ],
      "answer": "SA-CCR est une méthode réglementaire de calcul d'exposition qui peut être remplacée par IMM (Internal Model Method) selon les banques — même interface `IExposureStrategy`, formules complètement différentes.",
      "explanation": "Contexte réglementaire Natixis : les banques peuvent utiliser SA-CCR (méthode standard BIS) ou IMM (modèle interne validé par le régulateur, plus complexe). Strategy = même interface `Compute(Portfolio p) → decimal`, implémentations totalement différentes. Avantage : backtesting et comparaison des deux méthodes en parallèle en injectant les deux strategies sur le même portfolio."
    },
    {
      "question": "[Strategy — Polymorphisme] Comment le polymorphisme est-il utilisé dans le pattern Strategy ?",
      "options": [
        "Le polymorphisme n'est pas utilisé dans Strategy.",
        "La variable est de type `IExposureStrategy` (type abstrait). Selon l'instance concrète injectée (`SACCRStrategy` ou `NetExposureStrategy`), le bon `Compute()` est appelé — dispatch dynamique.",
        "Le polymorphisme est utilisé pour héritage uniquement.",
        "Strategy utilise le polymorphisme pour créer des objets différents."
      ],
      "answer": "La variable est de type `IExposureStrategy` (type abstrait). Selon l'instance concrète injectée (`SACCRStrategy` ou `NetExposureStrategy`), le bon `Compute()` est appelé — dispatch dynamique.",
      "explanation": "Polymorphisme en action : `IExposureStrategy strategy = new SACCRStrategy();` → `strategy.Compute(portfolio)` appelle `SACCRStrategy.Compute()`. Même code, comportement différent selon l'instance. C'est pourquoi Strategy s'appuie sur le polymorphisme OOP : l'interface définit le contrat, les implémentations définissent le comportement. Sans polymorphisme, Strategy se réduit à un `switch`."
    },
    {
      "question": "[Strategy vs Factory — Confusion] Un code fait `var s = new SACCRStrategy(); s.Compute(p);`. Quel pattern est absent et devrait être ajouté ?",
      "options": [
        "Observer — pour notifier des changements.",
        "Factory — pour encapsuler la création de `SACCRStrategy` et permettre de changer la stratégie sans modifier le code appelant.",
        "Singleton — pour garantir une seule instance.",
        "Builder — pour construire la stratégie en plusieurs étapes."
      ],
      "answer": "Factory — pour encapsuler la création de `SACCRStrategy` et permettre de changer la stratégie sans modifier le code appelant.",
      "explanation": "Anti-pattern : `new SACCRStrategy()` directement dans le code métier crée un couplage fort. Si la stratégie change, il faut retrouver tous les `new SACCRStrategy()`. Avec Factory : `RiskStrategyFactory.Create(cpty.Type)` → le code métier ne sait pas quel type concret il reçoit. Strategy + Factory = couplage minimal. Strategy + DI = encore mieux si le type est connu au démarrage."
    },
    {
      "question": "[Strategy — test] Comment tester unitairement que le moteur de risque utilise correctement la stratégie SA-CCR ?",
      "options": [
        "En démarrant une base Oracle de test avec des données réelles.",
        "En créant un mock `IExposureStrategy` qui retourne une valeur fixe, l'injectant dans le moteur de risque, et vérifiant que `RiskEngine.Compute()` retourne la bonne valeur.",
        "En testant `SACCRStrategy` directement dans le moteur de risque.",
        "Strategy ne peut pas être testé unitairement."
      ],
      "answer": "En créant un mock `IExposureStrategy` qui retourne une valeur fixe, l'injectant dans le moteur de risque, et vérifiant que `RiskEngine.Compute()` retourne la bonne valeur.",
      "explanation": "Testabilité = avantage clé de Strategy : `var mockStrategy = new Mock<IExposureStrategy>(); mockStrategy.Setup(s => s.Compute(It.IsAny<Portfolio>())).Returns(1_000_000m); var engine = new RiskEngine(mockStrategy.Object); Assert.Equal(expectedResult, engine.Compute(testPortfolio));` On teste la logique du moteur indépendamment de la formule SA-CCR. Test de `SACCRStrategy` séparément avec des données de marché connues."
    },

    // ── REPOSITORY (Q31–Q40) ──
    {
      "question": "[Repository] Pourquoi utiliser `IExposureRepository` plutôt que d'appeler directement `DbContext` dans le service de risque ?",
      "options": [
        "DbContext est plus lent qu'une interface.",
        "Respecter DIP : le service de risque dépend de `IExposureRepository` (abstraction), pas de `DbContext` (détail). En tests, on injecte un `FakeRepository` sans base de données.",
        "DbContext ne supporte pas Oracle.",
        "IExposureRepository est plus rapide car elle utilise un cache."
      ],
      "answer": "Respecter DIP : le service de risque dépend de `IExposureRepository` (abstraction), pas de `DbContext` (détail). En tests, on injecte un `FakeRepository` sans base de données.",
      "explanation": "DIP appliqué : `class RiskService { private readonly IExposureRepository _repo; }` → `RiskService` ne sait pas si les données viennent d'Oracle, SQL Server ou d'un fichier CSV. En tests : `new RiskService(new InMemoryExposureRepository())` → tests rapides sans base de données. En production : `new RiskService(new OracleExposureRepository(connection))`. Changer de base de données = changer l'implémentation, pas le service."
    },
    {
      "question": "[Repository vs Facade] Quelle est la différence entre Repository et Facade dans le contexte de FERMAT (système Natixis) ?",
      "options": [
        "Repository et Facade sont synonymes dans les systèmes financiers.",
        "Repository isole l'accès à une source de données (Oracle Exposure). Facade simplifie une interface complexe multi-services (FERMAT orchestre Pricing + Risk + Reporting en un appel).",
        "Repository est pour SQL Server, Facade est pour Oracle.",
        "Facade retourne des interfaces, Repository retourne des entités."
      ],
      "answer": "Repository isole l'accès à une source de données (Oracle Exposure). Facade simplifie une interface complexe multi-services (FERMAT orchestre Pricing + Risk + Reporting en un appel).",
      "explanation": "Distinction claire : `IExposureRepository.GetByCounterparty('BNPP')` = accès données isolé (Repository). `FermatFacade.ComputeAndReport(trade)` = orchestration de 3 sous-systèmes en un appel (Facade). Un système FERMAT peut utiliser les DEUX : la Facade orchestre les services, chaque service utilise son Repository pour accéder aux données."
    },
    {
      "question": "[Repository — IQueryable] Pourquoi retourner `IQueryable<Exposure>` plutôt que `IEnumerable<Exposure>` dans un Repository Oracle ?",
      "options": [
        "IQueryable est thread-safe, IEnumerable ne l'est pas.",
        "IQueryable permet au code appelant d'ajouter des filtres qui seront traduits en SQL — la requête s'exécute côté Oracle, pas en mémoire.",
        "IQueryable est plus simple à utiliser que IEnumerable.",
        "IEnumerable ne supporte pas LINQ."
      ],
      "answer": "IQueryable permet au code appelant d'ajouter des filtres qui seront traduits en SQL — la requête s'exécute côté Oracle, pas en mémoire.",
      "explanation": "Performance critique : `repo.GetAll()` retournant `IEnumerable` charge TOUTES les expositions en mémoire (millions de lignes). `IQueryable` : `repo.GetAll().Where(e => e.CounterpartyId == 'BNPP' && e.Notional > 1M)` génère `SELECT ... WHERE ... AND ...` exécuté par Oracle. Seules les lignes filtrées transitent sur le réseau. En finance, tables d'expositions = dizaines de millions de lignes — `IQueryable` n'est pas optionnel."
    },
    {
      "question": "[Repository — DbContext lifetime] Pourquoi `DbContext` ne doit-il pas être Singleton dans une API ASP.NET Core de risk management ?",
      "options": [
        "DbContext n'est pas thread-safe : partagé entre requêtes concurrentes, il peut mélanger les données de différents trades en cours de traitement.",
        "DbContext Singleton consomme trop de mémoire.",
        "DbContext Singleton ne supporte pas les transactions.",
        "Singleton DbContext viole OCP."
      ],
      "answer": "DbContext n'est pas thread-safe : partagé entre requêtes concurrentes, il peut mélanger les données de différents trades en cours de traitement.",
      "explanation": "Règle absolue EF Core : `DbContext` doit être `Scoped` (une instance par requête HTTP). Si Singleton : la requête du trader A et celle du trader B partagent le même `ChangeTracker` — les modifications de A peuvent apparaître dans la transaction de B. En risk management, cela peut causer des calculs d'exposition incorrects. `services.AddScoped<IExposureRepository, OracleExposureRepository>()` est la configuration correcte."
    },
    {
      "question": "[Repository — Oracle Exposure] Dans `OracleExposureRepository`, quelle est la responsabilité unique (SRP) de cette classe ?",
      "options": [
        "Calculer les expositions ET les stocker dans Oracle.",
        "Traduire les opérations CRUD sur les expositions en requêtes Oracle — lecture, écriture, mise à jour. Le calcul des expositions appartient au service de risque, pas au Repository.",
        "Gérer la connexion Oracle, le calcul et le reporting d'exposition.",
        "Valider les expositions avant de les stocker."
      ],
      "answer": "Traduire les opérations CRUD sur les expositions en requêtes Oracle — lecture, écriture, mise à jour. Le calcul des expositions appartient au service de risque, pas au Repository.",
      "explanation": "SRP pour Repository : une seule responsabilité = accès aux données. `GetByCounterparty()`, `SaveAsync()`, `UpdateAsync()` → SQL/Oracle. Tout le reste est hors scope : le calcul SA-CCR est dans `SACCRStrategy` (Strategy). La validation réglementaire est dans le service de risque. Le reporting est dans le service de reporting. Repository = couche d'accès données, rien de plus."
    },
    {
      "question": "[Repository — Tests] Comment tester unitairement un service de risque qui utilise `IExposureRepository` ?",
      "options": [
        "Créer une base Oracle de test avec des données fictives.",
        "Injecter un `Mock<IExposureRepository>` ou un `InMemoryRepository` qui retourne des données fixées — pas de base de données nécessaire.",
        "Désactiver le Repository dans les tests.",
        "Utiliser une vraie base SQL Server locale."
      ],
      "answer": "Injecter un `Mock<IExposureRepository>` ou un `InMemoryRepository` qui retourne des données fixées — pas de base de données nécessaire.",
      "explanation": "Testabilité = raison d'être du Repository : `var mockRepo = new Mock<IExposureRepository>(); mockRepo.Setup(r => r.GetByCounterpartyAsync('BNPP')).ReturnsAsync(testExposures); var service = new RiskService(mockRepo.Object, new SACCRStrategy()); var result = await service.ComputeVaRAsync('BNPP');` Tests rapides (ms vs secondes), reproductibles, sans réseau. L'interface `IExposureRepository` est le contrat — les mocks le respectent."
    },
    {
      "question": "[Repository — confusion avec DAO] Quelle est la différence entre Repository et DAO (Data Access Object) ?",
      "options": [
        "Ce sont des synonymes utilisés dans des contextes différents.",
        "Repository = concept DDD orienté collections d'entités du domaine (traite une `Exposure` comme un objet métier riche). DAO = accès données orienté table/procédure stockée (plus proche du schéma SQL).",
        "DAO est pour Oracle, Repository pour SQL Server.",
        "Repository utilise EF Core, DAO utilise ADO.NET."
      ],
      "answer": "Repository = concept DDD orienté collections d'entités du domaine (traite une `Exposure` comme un objet métier riche). DAO = accès données orienté table/procédure stockée (plus proche du schéma SQL).",
      "explanation": "Nuance DDD vs technique : Repository fait partie du domaine — `IExposureRepository` parle le langage métier (`GetByCounterparty`, `GetExposuresExceedingLimit`). DAO parle SQL (`ExecuteSelect`, `CallStoredProc`). En pratique Natixis : les systèmes legacy utilisent des DAO (procédures Oracle stockées). Les nouveaux services utilisent des Repositories avec EF Core — intention exprimée en termes métier."
    },
    {
      "question": "[Repository — Async] Pourquoi les méthodes de Repository doivent-elles être `async Task<T>` dans un OMS C# ?",
      "options": [
        "Pour respecter le pattern Repository correctement.",
        "L'accès base de données est I/O bound — `async/await` libère le thread pendant l'attente Oracle, permettant au thread de traiter d'autres requêtes entrantes simultanément.",
        "async est obligatoire avec EF Core.",
        "Pour respecter le SRP — les Repository synchrones violent SRP."
      ],
      "answer": "L'accès base de données est I/O bound — `async/await` libère le thread pendant l'attente Oracle, permettant au thread de traiter d'autres requêtes entrantes simultanément.",
      "explanation": "Scalabilité OMS : si `SaveExposureAsync` est synchrone et Oracle répond en 50ms, le thread ASP.NET est bloqué 50ms à ne rien faire. Avec `async Task`, le thread est libéré pendant ces 50ms et peut traiter 10 autres requêtes. Dans un OMS qui traite 500 ordres/seconde, la différence entre sync et async = saturation vs scalabilité linéaire."
    },
    {
      "question": "[Repository — confusion Singleton] Un `IExposureRepository` est-il typiquement un Singleton ?",
      "options": [
        "Oui, car la base Oracle est unique.",
        "Non — `Scoped` est standard (une instance par requête, car `DbContext` Scoped). Peut être Singleton si `DbContext` est géré manuellement, mais c'est risqué pour la thread-safety.",
        "Oui, pour la performance — éviter de créer l'instance à chaque requête.",
        "Non, Repository doit toujours être Transient."
      ],
      "answer": "Non — `Scoped` est standard (une instance par requête, car `DbContext` Scoped). Peut être Singleton si `DbContext` est géré manuellement, mais c'est risqué pour la thread-safety.",
      "explanation": "Durée de vie Repository : `AddScoped<IExposureRepository, OracleExposureRepository>()` car `DbContext` est Scoped. Repository Singleton + DbContext Scoped = injection de dépendance invalide (ASP.NET Core lève une exception ou crée des comportements inattendus). Repository Singleton avec `IDbConnectionFactory` (crée une connexion à chaque appel) est une alternative valide mais moins courante."
    },
    {
      "question": "[Repository — Oracle vs SQL Server] `OracleExposureRepository` et `SqlServerExposureRepository` implémentent toutes deux `IExposureRepository`. Quel principe SOLID cela démontre-t-il ?",
      "options": [
        "SRP — chaque classe a une responsabilité.",
        "DIP + LSP — les deux implémentations sont substituables (LSP) et le service dépend de l'abstraction (DIP). Changer d'Oracle à SQL Server = changer l'enregistrement DI, pas le code métier.",
        "OCP — la classe est fermée à la modification.",
        "ISP — interface ségrégée pour chaque type de base."
      ],
      "answer": "DIP + LSP — les deux implémentations sont substituables (LSP) et le service dépend de l'abstraction (DIP). Changer d'Oracle à SQL Server = changer l'enregistrement DI, pas le code métier.",
      "explanation": "LSP (Liskov Substitution Principle) : `SqlServerExposureRepository` peut remplacer `OracleExposureRepository` partout où `IExposureRepository` est attendu — le comportement reste identique du point de vue du service appelant. DIP : `RiskService` dépend de `IExposureRepository`, pas d'Oracle. Migration de base de données = une ligne de DI modifiée."
    },

    // ── BUILDER (Q41–Q50) ──
    {
      "question": "[Builder] Pourquoi utiliser Builder plutôt qu'un constructeur avec 15 paramètres pour créer un Trade complexe ?",
      "options": [
        "Builder est plus rapide qu'un constructeur à 15 paramètres.",
        "Builder + interface fluente rend le code lisible (`WithNotional().WithCounterparty().Build()`), les paramètres optionnels sont naturels, et on ne confond jamais l'ordre des paramètres.",
        "Un constructeur à 15 paramètres viole le DIP.",
        "Builder respecte OCP car on peut ajouter des champs sans modifier le constructeur."
      ],
      "answer": "Builder + interface fluente rend le code lisible (`WithNotional().WithCounterparty().Build()`), les paramètres optionnels sont naturels, et on ne confond jamais l'ordre des paramètres.",
      "explanation": "Anti-pattern : `new Trade(1_000_000m, 'BNPP', DateTime.Now, 'EUR', 'FIXED', 0.035m, null, null, 'EMIR', ...)` — impossible de savoir quel paramètre est quoi sans regarder la signature. Avec Builder : `new TradeBuilder().WithNotional(1_000_000m).WithCounterparty('BNPP').WithCurrency('EUR').WithFixedRate(0.035m).Build()` — auto-documenté. Paramètres optionnels = ne pas appeler la méthode `With...`."
    },
    {
      "question": "[Builder — return this] Pourquoi les méthodes `With...()` d'un Builder retournent-elles `this` ?",
      "options": [
        "Pour respecter SRP — chaque méthode retourne le Builder.",
        "Pour permettre le chaînage de méthodes (fluent interface) : `builder.WithA().WithB().WithC()` en une seule expression, sans variable intermédiaire.",
        "Pour être thread-safe — `this` évite les copies.",
        "Pour que `Build()` puisse accéder à l'objet en construction."
      ],
      "answer": "Pour permettre le chaînage de méthodes (fluent interface) : `builder.WithA().WithB().WithC()` en une seule expression, sans variable intermédiaire.",
      "explanation": "`return this` = fluent interface. Chaque `WithX()` modifie l'état interne du Builder ET retourne le Builder lui-même — l'appelant peut immédiatement chaîner un autre `WithY()`. Sans `return this`, il faudrait `builder.WithNotional(1M); builder.WithCounterparty('BNPP'); var trade = builder.Build();` — possible mais verbeux. Le chaînage est plus idiomatique en C# modern."
    },
    {
      "question": "[Builder — Build()] Que doit faire la méthode `Build()` dans un TradeBuilder pour un trade de taux Natixis ?",
      "options": [
        "Retourner le Builder lui-même pour continuer le chaînage.",
        "Valider que tous les champs obligatoires sont renseignés (notional > 0, counterparty non null, maturity > today), puis créer et retourner l'objet `Trade` immutable.",
        "Enregistrer le Trade dans Oracle.",
        "Déclencher le calcul SA-CCR sur le Trade créé."
      ],
      "answer": "Valider que tous les champs obligatoires sont renseignés (notional > 0, counterparty non null, maturity > today), puis créer et retourner l'objet `Trade` immutable.",
      "explanation": "Build() = finalisation + validation : `public Trade Build() { if(_notional <= 0) throw new BuilderException('Notional required'); if(string.IsNullOrEmpty(_counterparty)) throw new BuilderException('Counterparty required'); if(_maturity <= DateTime.Today) throw new BuilderException('Maturity must be future'); return new Trade(_notional, _counterparty, _maturity, _currency, ...); }` L'objet n'est JAMAIS créé dans un état invalide — invariants garantis par Build()."
    },
    {
      "question": "[Builder vs Factory] Un développeur hésite entre Factory et Builder pour créer différents types de Swaps (IRS, CDS, Equity Swap). Quel conseil donner ?",
      "options": [
        "Factory pour tous — plus simple.",
        "Factory pour choisir le TYPE de Swap à créer (IRS vs CDS). Builder pour construire chaque Swap avec ses nombreux paramètres optionnels. Combiner les deux : `SwapFactory.CreateBuilder('IRS').WithNotional(...).WithRate(...).Build()`.",
        "Builder pour tous — plus flexible.",
        "Utiliser le constructeur direct — Design Patterns = over-engineering."
      ],
      "answer": "Factory pour choisir le TYPE de Swap à créer (IRS vs CDS). Builder pour construire chaque Swap avec ses nombreux paramètres optionnels. Combiner les deux : `SwapFactory.CreateBuilder('IRS').WithNotional(...).WithRate(...).Build()`.",
      "explanation": "Complémentarité Factory + Builder : Factory répond à 'quel objet créer ?' (IRS vs CDS — types différents). Builder répond à 'comment le configurer ?' (notional, taux, fréquence de coupon, convention de jour — mêmes questions pour tous les Swaps). Combiner : `SwapFactory.CreateBuilder('IRS')` retourne un `IRSBuilder` avec des méthodes spécifiques. `SwapFactory.CreateBuilder('CDS')` retourne un `CDSBuilder`."
    },
    {
      "question": "[Builder — Immutabilité] Pourquoi l'objet `Trade` créé par `TradeBuilder.Build()` devrait-il être immutable ?",
      "options": [
        "Pour respecter le pattern Builder.",
        "Un Trade exécuté est un fait comptable immuable — le modifier après création crée des incohérences dans les systèmes downstream (PMS, Comptabilité, Compliance). Utiliser `record` C# ou readonly properties.",
        "Pour la performance — les objets immutables sont plus rapides.",
        "Pour respecter OCP — un Trade immutable est fermé à la modification."
      ],
      "answer": "Un Trade exécuté est un fait comptable immuable — le modifier après création crée des incohérences dans les systèmes downstream (PMS, Comptabilité, Compliance). Utiliser `record` C# ou readonly properties.",
      "explanation": "Domain-Driven Design + réglementation : MiFID II exige que les données de trade soient conservées intactes. `record Trade(Guid Id, decimal Notional, string Counterparty)` en C# = immutable par défaut. Pour modifier un Trade, on crée un nouveau (amendement = nouveau Trade avec référence à l'original). Event Sourcing : chaque changement est un événement, pas une mutation."
    },
    {
      "question": "[Builder — SRP] Comment le pattern Builder respecte-t-il le Single Responsibility Principle ?",
      "options": [
        "Le Builder a une seule méthode `Build()`.",
        "Le Builder a une seule responsabilité : construire l'objet Trade. La validation métier, le stockage Oracle, et le calcul de risque restent dans des classes séparées.",
        "SRP n'est pas applicable au Builder.",
        "Chaque méthode `With...()` a une seule responsabilité."
      ],
      "answer": "Le Builder a une seule responsabilité : construire l'objet Trade. La validation métier, le stockage Oracle, et le calcul de risque restent dans des classes séparées.",
      "explanation": "SRP Builder : `TradeBuilder` = construire et valider la cohérence de l'objet. Il ne doit PAS : enregistrer dans Oracle (→ Repository), calculer l'exposition (→ Strategy), envoyer vers le broker (→ EMS). Anti-pattern : `builder.Build().SaveToOracle().ComputeRisk()` — le Builder fait trop. Builder = construction, les autres responsabilités sont dans d'autres classes."
    },
    {
      "question": "[Builder — Confusion avec Decorator] Un code ajoute `WithLogging()` et `WithAudit()` à un Builder. Est-ce du Builder ou du Decorator ?",
      "options": [
        "C'est du Builder car les méthodes retournent `this`.",
        "Cela dépend : si `WithLogging()` configure une propriété de l'objet en construction (ex: niveau de log du Trade), c'est du Builder. Si `WithLogging()` enveloppe l'objet final dans un Decorator qui ajoute du logging, c'est du Decorator.",
        "C'est toujours du Decorator.",
        "Builder et Decorator ne peuvent pas coexister."
      ],
      "answer": "Cela dépend : si `WithLogging()` configure une propriété de l'objet en construction (ex: niveau de log du Trade), c'est du Builder. Si `WithLogging()` enveloppe l'objet final dans un Decorator qui ajoute du logging, c'est du Decorator.",
      "explanation": "Distinction subtile : `tradeBuilder.WithLoggingLevel(LogLevel.Debug)` = Builder (configure une propriété). `serviceBuilder.WithLogging()` qui retourne `new LoggingDecorator(service)` = Decorator (enveloppe l'objet). Les deux patterns peuvent coexister : un Builder configure un objet, et `Build()` peut retourner cet objet enveloppé dans un Decorator si nécessaire."
    },
    {
      "question": "[Builder — C# modern] Comment C# 9+ `record` et les `init` properties peuvent-ils remplacer le Builder dans certains cas ?",
      "options": [
        "Ils ne peuvent pas remplacer le Builder.",
        "`record Trade { public decimal Notional { get; init; } ... }` + `with` expression : `var amended = trade with { Notional = 2_000_000m }` — syntaxe compacte pour objets immutables simples. Builder reste préférable pour objets complexes avec validation.",
        "`record` et `init` sont des synonymes du Builder.",
        "`init` remplace `Build()` dans tous les cas."
      ],
      "answer": "`record Trade { public decimal Notional { get; init; } ... }` + `with` expression : `var amended = trade with { Notional = 2_000_000m }` — syntaxe compacte pour objets immutables simples. Builder reste préférable pour objets complexes avec validation.",
      "explanation": "C# moderne : `record` + `with` = copie immutable avec modifications. Approprié pour les DTOs simples. Builder reste nécessaire quand : (1) Validation complexe dans `Build()`. (2) Plus de 5-7 paramètres optionnels. (3) Logique de construction non triviale (générer un ID unique, calculer des champs dérivés). Les deux coexistent : `record` pour les entités de lecture, Builder pour la création d'agrégats DDD."
    },
    {
      "question": "[Builder — Test] Comment tester que `TradeBuilder.Build()` lève une exception si le notional est négatif ?",
      "options": [
        "Pas possible de tester la validation du Builder.",
        "`Assert.Throws<BuilderException>(() => new TradeBuilder().WithNotional(-1_000_000m).WithCounterparty('BNPP').Build());`",
        "Tester en passant un négatif dans le constructeur Trade directement.",
        "Utiliser un Mock de Trade pour simuler la validation."
      ],
      "answer": "`Assert.Throws<BuilderException>(() => new TradeBuilder().WithNotional(-1_000_000m).WithCounterparty('BNPP').Build());`",
      "explanation": "Test de la règle métier : un Trade avec notional négatif est invalide. `Build()` doit lever une exception — jamais créer un objet Trade invalide. xUnit : `Assert.Throws<BuilderException>(() => ...)` vérifie que l'exception est bien levée. NUnit : `Assert.Throws<BuilderException>(() => ...)`. Tester TOUS les invariants dans les tests de Builder : notional ≤ 0, contrepartie null/vide, maturité passée."
    },
    {
      "question": "[Builder — Natixis CDS] Pour construire un CDS (Credit Default Swap) avec `ReferenceEntity`, `Notional`, `Spread`, `Maturity`, `RecoveryRate`, pourquoi Builder est-il plus adapté qu'un constructeur direct ?",
      "options": [
        "Builder est toujours plus adapté.",
        "`RecoveryRate` a une valeur par défaut standard (40%) qui ne devrait pas être imposée dans le constructeur. Builder permet `WithRecoveryRate(0.40m)` optionnel — si non spécifié, la valeur par défaut est utilisée dans `Build()`.",
        "Un constructeur CDS ne peut pas avoir plus de 3 paramètres.",
        "Builder est adapté car CDS est un objet abstrait."
      ],
      "answer": "`RecoveryRate` a une valeur par défaut standard (40%) qui ne devrait pas être imposée dans le constructeur. Builder permet `WithRecoveryRate(0.40m)` optionnel — si non spécifié, la valeur par défaut est utilisée dans `Build()`.",
      "explanation": "Valeurs par défaut contextuelles : `RecoveryRate` standard = 40% (convention marché CDS). `Spread` peut être calculé depuis le marché si non fourni. `Currency` par défaut = EUR pour les CDS souverains européens. Builder gère élégamment ces cas : si `WithRecoveryRate()` n'est pas appelé, `Build()` applique la valeur par défaut standard. Constructeur obligerait à toujours fournir tous les paramètres."
    },

    // ── FACADE (Q51–Q60) ──
    {
      "question": "[Facade] Quel problème résout la Facade dans le contexte de FERMAT (système de risque Natixis) ?",
      "options": [
        "Garantir qu'une seule instance de FERMAT existe.",
        "Fournir un point d'entrée unique qui orchestre automatiquement Pricing, Risk Calculation, et Reporting — le front office appelle une seule méthode au lieu d'orchestrer 3 systèmes complexes.",
        "Permettre à FERMAT de changer d'algorithme de pricing dynamiquement.",
        "Adapter l'API FERMAT aux systèmes Bloomberg incompatibles."
      ],
      "answer": "Fournir un point d'entrée unique qui orchestre automatiquement Pricing, Risk Calculation, et Reporting — le front office appelle une seule méthode au lieu d'orchestrer 3 systèmes complexes.",
      "explanation": "FERMAT Facade : `fermat.ProcessTrade(trade)` → en interne : (1) `_pricer.Price(trade)` (2) `_riskEngine.Compute(trade)` (3) `_reporter.Generate(results)` (4) `_repository.Save(results)`. Le trader n'a pas besoin de connaître ces 4 systèmes ni leur ordre d'appel. Facade = simplification de l'interface externe d'un sous-système complexe."
    },
    {
      "question": "[Facade vs Adapter] Dans un système Natixis, quelle est la différence entre `BloombergAdapter` et `FermatFacade` ?",
      "options": [
        "BloombergAdapter simplifie, FermatFacade adapte.",
        "BloombergAdapter traduit l'API Bloomberg propriétaire vers `IMarketDataProvider` (même rôle, interface différente). FermatFacade simplifie l'accès à un ensemble de services complexes (plusieurs rôles, une interface unifiée).",
        "Les deux sont des Facades avec des noms différents.",
        "BloombergAdapter est côté données, FermatFacade est côté présentation."
      ],
      "answer": "BloombergAdapter traduit l'API Bloomberg propriétaire vers `IMarketDataProvider` (même rôle, interface différente). FermatFacade simplifie l'accès à un ensemble de services complexes (plusieurs rôles, une interface unifiée).",
      "explanation": "Adapter vs Facade : Adapter = compatibilité d'interface (même responsabilité, interface différente). Facade = simplification (plusieurs responsabilités, une interface simplifiée). BloombergAdapter fait UNE chose (fournir des données de marché) mais via une interface traduite. FermatFacade fait PLUSIEURS choses (prix + risque + rapport) via une interface simplifiée. Les deux améliorent la maintenabilité mais pour des raisons différentes."
    },
    {
      "question": "[Facade — ISP] Comment la Facade respecte-t-il l'Interface Segregation Principle ?",
      "options": [
        "La Facade viole ISP car elle expose trop de méthodes.",
        "La Facade expose uniquement les méthodes utiles au client front office — `ProcessTrade()`, `ComputeVaR()`, `GenerateReport()` — sans exposer les méthodes internes des sous-systèmes.",
        "ISP n'est pas applicable aux Facades.",
        "La Facade respecte ISP en ayant une seule méthode."
      ],
      "answer": "La Facade expose uniquement les méthodes utiles au client front office — `ProcessTrade()`, `ComputeVaR()`, `GenerateReport()` — sans exposer les méthodes internes des sous-systèmes.",
      "explanation": "ISP + Facade : le client (Angular front office) n'a pas besoin de voir `_pricingEngine.CalibrateVolSurface()`, `_riskEngine.RecomputeCholesky()`, ou `_reporter.OpenOutputStream()`. La Facade expose un sous-ensemble réduit et cohérent d'opérations. ISP = ne pas forcer un client à dépendre de méthodes qu'il n'utilise pas."
    },
    {
      "question": "[Facade — service unique] Pourquoi le client de la Facade ne doit-il pas avoir accès aux sous-systèmes directement ?",
      "options": [
        "Pour des raisons de sécurité uniquement.",
        "Pour éviter le couplage aux détails d'implémentation — si le sous-système change (Oracle → SQL Server, nouvelle version du pricing engine), le client ne change pas car il n'a jamais dépendu des sous-systèmes directement.",
        "Parce que les sous-systèmes sont dans des DLL séparées.",
        "Pour respecter SRP — un seul point d'entrée."
      ],
      "answer": "Pour éviter le couplage aux détails d'implémentation — si le sous-système change (Oracle → SQL Server, nouvelle version du pricing engine), le client ne change pas car il n'a jamais dépendu des sous-systèmes directement.",
      "explanation": "Découplage via Facade : le client Angular appelle `fermat.ProcessTrade(tradeDto)` — c'est tout. FERMAT peut refactorer son pricing engine de Black-Scholes vers Heston, migrer de Oracle vers SQL Server, optimiser le calcul VaR avec Monte Carlo — le client Angular n'est pas impacté. Sans Facade, chaque changement interne propage des modifications vers le client."
    },
    {
      "question": "[Facade — Confusion avec Repository] Un `TradeFacade` expose `GetTrade()`, `SaveTrade()`, `DeleteTrade()` — est-ce une Facade ou un Repository ?",
      "options": [
        "C'est une Facade car elle simplifie l'accès.",
        "C'est un Repository — il isole l'accès aux données d'une entité Trade. Une vraie Facade orchestrerait plusieurs sous-systèmes heterogènes, pas uniquement le CRUD d'une entité.",
        "C'est une Facade car elle cache la complexité.",
        "C'est les deux — Facade et Repository sont équivalents pour les entités."
      ],
      "answer": "C'est un Repository — il isole l'accès aux données d'une entité Trade. Une vraie Facade orchestrerait plusieurs sous-systèmes heterogènes, pas uniquement le CRUD d'une entité.",
      "explanation": "Critère de distinction : Repository = CRUD sur une entité (une seule source de données, opérations de lecture/écriture). Facade = orchestration de plusieurs sous-systèmes hétérogènes. `TradeFacade.ProcessTrade()` qui appelle PricingEngine + RiskEngine + Repository = Facade. `TradeRepository.GetById()` qui lit dans Oracle = Repository. Nommer 'Facade' un simple Repository est une confusion de pattern."
    },
    {
      "question": "[Facade — tests] Comment tester une Facade complexe comme FERMAT ?",
      "options": [
        "Tester en appelant le vrai FERMAT en production.",
        "Injecter des mocks des sous-systèmes (`Mock<IPricingEngine>`, `Mock<IRiskEngine>`, `Mock<IReportingService>`), appeler `facade.ProcessTrade(trade)`, et vérifier que chaque sous-système est appelé avec les bons paramètres.",
        "La Facade ne peut pas être testée unitairement.",
        "Utiliser une vraie base Oracle de test."
      ],
      "answer": "Injecter des mocks des sous-systèmes (`Mock<IPricingEngine>`, `Mock<IRiskEngine>`, `Mock<IReportingService>`), appeler `facade.ProcessTrade(trade)`, et vérifier que chaque sous-système est appelé avec les bons paramètres.",
      "explanation": "Test de Facade = test d'orchestration : `mockPricer.Verify(p => p.Price(trade), Times.Once())` vérifie que le pricing est appelé. `mockRisk.Verify(r => r.Compute(trade), Times.Once())` vérifie le risk. `mockReport.Verify(r => r.Generate(It.IsAny<RiskResult>()), Times.Once())` vérifie le reporting. On ne teste pas CE QUE font les sous-systèmes (leurs propres tests), mais QUE la Facade les appelle dans le bon ordre."
    },
    {
      "question": "[Facade — Natixis Front Office] Un trader Natixis appelle `fermat.BookTrade(tradeRequest)`. Quels sous-systèmes peuvent être orchestrés ?",
      "options": [
        "Uniquement la base Oracle.",
        "PricingEngine (calcule le mark-to-market), RiskEngine (vérifie VaR et limites), TradeRepository (persiste le trade), KafkaPublisher (publie l'événement TradeBooked), ComplianceService (vérifie MiFID II).",
        "Uniquement Kafka et Redis.",
        "Bloomberg API et FIX Protocol uniquement."
      ],
      "answer": "PricingEngine (calcule le mark-to-market), RiskEngine (vérifie VaR et limites), TradeRepository (persiste le trade), KafkaPublisher (publie l'événement TradeBooked), ComplianceService (vérifie MiFID II).",
      "explanation": "Facade en pratique CIB : `BookTrade()` orchestrerait : (1) Validation des données du trade (2) Pricing (mark-to-market initial) (3) Risk check (pas de dépassement de limites) (4) Persistence Oracle (5) Kafka event pour notifier PMS/RMS/Reporting (6) Compliance check MiFID II (best execution). 6 sous-systèmes, 1 appel façade. Sans Facade, le contrôleur Angular orchestre tout — couplage fort."
    },
    {
      "question": "[Facade — OCP] Comment étendre une Facade FERMAT sans modifier son code existant ?",
      "options": [
        "Modifier la méthode `ProcessTrade()` pour ajouter les nouvelles fonctionnalités.",
        "Injecter le nouveau sous-système dans le constructeur de la Facade et appeler sa méthode dans `ProcessTrade()` — si le contrat existant n'est pas modifié, les clients existants ne sont pas impactés.",
        "OCP ne s'applique pas aux Facades.",
        "Créer une sous-classe de FermatFacade qui override `ProcessTrade()`."
      ],
      "answer": "Injecter le nouveau sous-système dans le constructeur de la Facade et appeler sa méthode dans `ProcessTrade()` — si le contrat existant ne change pas (même signature, même comportement), les clients ne sont pas impactés.",
      "explanation": "Extension de Facade : ajouter `IComplianceService _compliance` injecté, appeler `await _compliance.Check(trade)` dans `ProcessTrade()`. Si la méthode `ProcessTrade()` garde la même signature et retourne le même type, tous les clients existants continuent de fonctionner sans modification. Risque OCP : si la Facade devient une God Class (50 sous-systèmes) — refactorer en sous-Facades spécialisées."
    },
    {
      "question": "[Facade — Encapsulation] Pourquoi dit-on que la Facade encapsule la complexité d'un sous-système ?",
      "options": [
        "Parce que la Facade utilise `private` sur toutes ses propriétés.",
        "La Facade cache les détails d'implémentation (quels sous-systèmes, dans quel ordre, avec quelles dépendances) derrière une interface simple — le client voit `ProcessTrade()`, pas `_pricer.Calibrate() → _risk.Compute() → _repo.Save()`.",
        "Parce que la Facade a un constructeur `private`.",
        "Encapsulation signifie que la Facade est un Singleton."
      ],
      "answer": "La Facade cache les détails d'implémentation (quels sous-systèmes, dans quel ordre, avec quelles dépendances) derrière une interface simple — le client voit `ProcessTrade()`, pas `_pricer.Calibrate() → _risk.Compute() → _repo.Save()`.",
      "explanation": "Encapsulation Facade : les champs `private readonly IPricingEngine _pricer`, `private readonly IRiskEngine _risk` etc. sont cachés au client. Le client ne sait pas combien de sous-systèmes existent, ni dans quel ordre ils sont appelés. C'est l'encapsulation au niveau système — la même idée qu'encapsuler un champ dans une classe, mais à l'échelle d'un ensemble de services."
    },
    {
      "question": "[Facade — Point d'entrée unique] Quelle est la valeur architecturale d'avoir un seul point d'entrée pour un système comme FERMAT ?",
      "options": [
        "Un seul point d'entrée est plus lent car tout passe par lui.",
        "Centraliser les préoccupations transversales (authentification, logging, métriques Prometheus) en un seul endroit — plus facile à sécuriser, monitorer, et versionner.",
        "Un seul point d'entrée viole ISP.",
        "La valeur est uniquement la simplification pour le développeur."
      ],
      "answer": "Centraliser les préoccupations transversales (authentification, logging, métriques Prometheus) en un seul endroit — plus facile à sécuriser, monitorer, et versionner.",
      "explanation": "Bénéfices architecturaux : Sécurité = vérifier les tokens JWT une fois dans la Facade. Logging = timer chaque appel et logguer les paramètres. Métriques = `Counter.Add(1)` pour Prometheus à chaque `ProcessTrade()`. Rate limiting = bloquer les appels excessifs. Sans Facade, ces préoccupations transversales seraient dupliquées dans chaque sous-système (violation DRY)."
    },

    // ── ADAPTER (Q61–Q70) ──
    {
      "question": "[Adapter] Quel problème résout le Bloomberg Adapter dans un système Natixis ?",
      "options": [
        "Garantir qu'une seule connexion Bloomberg existe.",
        "Traduire l'API Bloomberg propriétaire (`BloombergAPI.GetData(BbgRequest)`) vers l'interface interne standard (`IMarketDataProvider.GetQuote(string isin)`) — permet au système d'utiliser Bloomberg sans dépendre de son API.",
        "Simplifier l'accès à Bloomberg en orchestrant plusieurs appels.",
        "Construire un objet Quote Bloomberg en plusieurs étapes."
      ],
      "answer": "Traduire l'API Bloomberg propriétaire (`BloombergAPI.GetData(BbgRequest)`) vers l'interface interne standard (`IMarketDataProvider.GetQuote(string isin)`) — permet au système d'utiliser Bloomberg sans dépendre de son API.",
      "explanation": "Adapter = traducteur d'interface. Bloomberg BLPAPI a sa propre syntaxe. `IMarketDataProvider` est l'interface interne standard. `BloombergAdapter` fait le pont : `public Quote GetQuote(string isin) => ConvertToQuote(_bloomberg.GetData(new BbgRequest { SecurityId = isin, Fields = new[] { 'LAST_PRICE' } }));` Si Natixis remplace Bloomberg par Refinitiv, seul `RefinitivAdapter` est créé — aucun code métier ne change."
    },
    {
      "question": "[Adapter — OCP] Comment l'Adapter permet-il de respecter OCP lors du remplacement de Bloomberg par Refinitiv ?",
      "options": [
        "Modifier `BloombergAdapter` pour qu'il appelle Refinitiv.",
        "Créer `RefinitivAdapter : IMarketDataProvider` qui traduit l'API Refinitiv. Le reste du système n'est pas modifié — il dépend de `IMarketDataProvider`, pas de Bloomberg ou Refinitiv.",
        "Modifier l'interface `IMarketDataProvider` pour supporter les deux.",
        "Créer une sous-classe de `BloombergAdapter` pour Refinitiv."
      ],
      "answer": "Créer `RefinitivAdapter : IMarketDataProvider` qui traduit l'API Refinitiv. Le reste du système n'est pas modifié — il dépend de `IMarketDataProvider`, pas de Bloomberg ou Refinitiv.",
      "explanation": "OCP via Adapter : le système est fermé à la modification (aucun code métier ne change). L'extension = nouveau `RefinitivAdapter`. Le DI container change : `services.AddScoped<IMarketDataProvider, RefinitivAdapter>()`. Si Natixis utilise Bloomberg en production et Refinitiv comme fallback, un `AggregatedMarketDataAdapter` peut orchestrer les deux derrière la même interface."
    },
    {
      "question": "[Adapter vs Facade] Un développeur hésite entre Adapter et Facade pour intégrer un système externe legacy. Quel critère décide ?",
      "options": [
        "Adapter = système externe, Facade = système interne.",
        "Adapter = une interface existante (externe) traduite en une autre interface (interne) — 1:1. Facade = plusieurs sous-systèmes simplifiés en une interface unifiée — N:1.",
        "Adapter est pour les APIs tierces, Facade pour les APIs internes.",
        "Facade est toujours préférable à Adapter."
      ],
      "answer": "Adapter = une interface existante (externe) traduite en une autre interface (interne) — 1:1. Facade = plusieurs sous-systèmes simplifiés en une interface unifiée — N:1.",
      "explanation": "Critère de décision : Bloomberg (1 source) → IMarketDataProvider (1 cible) = Adapter. FERMAT (PricingEngine + RiskEngine + Reporting) → ProcessTrade() (1 opération) = Facade. Si l'adaptation implique un seul système externe qui doit respecter un contrat interne = Adapter. Si la simplification implique plusieurs systèmes internes orchestrés = Facade. Parfois les deux : `FermatFacade` utilise `BloombergAdapter` en interne."
    },
    {
      "question": "[Adapter — Composition] Pourquoi l'Adapter utilise-t-il la composition plutôt que l'héritage ?",
      "options": [
        "La composition est toujours préférable à l'héritage.",
        "On ne peut pas hériter de `BloombergAPI` (classe `sealed` ou sans constructeur public) — la composition (`private readonly BloombergAPI _api`) permet d'encapsuler l'API externe sans la modifier.",
        "L'héritage violerait DIP.",
        "La composition permet le polymorphisme avec `IMarketDataProvider`."
      ],
      "answer": "On ne peut pas hériter de `BloombergAPI` (classe `sealed` ou sans constructeur public) — la composition (`private readonly BloombergAPI _api`) permet d'encapsuler l'API externe sans la modifier.",
      "explanation": "Adapter = Composition over Inheritance en pratique : les APIs tierces (Bloomberg, Reuters, FIX engines) sont souvent `sealed` ou ont des dépendances incompatibles. L'Adapter contient une instance de l'API externe en composition, traduit les appels, et implémente l'interface interne. Avantage : l'API externe peut être mockée en tests (`Mock<BloombergAPI>`) en injectant dans l'Adapter."
    },
    {
      "question": "[Adapter — wrapper] Qu'est-ce que `wrapper` signifie dans le contexte du pattern Adapter ?",
      "options": [
        "L'Adapter emballe (`wrap`) l'objet adapté — il le contient en composition et expose une interface différente, comme un emballage qui change la forme extérieure sans modifier l'intérieur.",
        "Wrapper est un synonym de Decorator.",
        "Wrapper signifie que l'Adapter hérite de la classe adaptée.",
        "Wrapper signifie que l'Adapter est un Singleton."
      ],
      "answer": "L'Adapter emballe (`wrap`) l'objet adapté — il le contient en composition et expose une interface différente, comme un emballage qui change la forme extérieure sans modifier l'intérieur.",
      "explanation": "Métaphore wrapper : `BloombergAdapter` est l'emballage, `BloombergAPI` est l'objet emballé. De l'extérieur, on voit `IMarketDataProvider`. À l'intérieur, `BloombergAPI` fait le vrai travail — l'Adapter traduit. L'objet adapté n'est pas modifié. Cette métaphore s'applique aussi au Decorator (qui wraps également) — la différence : Adapter change l'interface, Decorator conserve l'interface et ajoute du comportement."
    },
    {
      "question": "[Adapter — FIX Protocol] Comment un Adapter FIX peut-il permettre à l'OMS C# d'envoyer des ordres vers plusieurs brokers avec des dialects FIX différents ?",
      "options": [
        "Envoyer le même message FIX à tous les brokers.",
        "Créer `IBrokerAdapter` avec `SendOrder(Order)`. Chaque broker a son Adapter : `GoldmanSachsAdapter`, `SocieteGeneraleAdapter` — chacun traduit `Order` en le dialect FIX spécifique du broker.",
        "Modifier le format FIX selon le broker dans l'OMS.",
        "Utiliser un seul format FIX standardisé pour tous."
      ],
      "answer": "Créer `IBrokerAdapter` avec `SendOrder(Order)`. Chaque broker a son Adapter : `GoldmanSachsAdapter`, `SocieteGeneraleAdapter` — chacun traduit `Order` en le dialect FIX spécifique du broker.",
      "explanation": "Adapter multi-brokers : bien que FIX soit un standard, chaque broker a des customizations (tags propriétaires, valeurs spécifiques). `GoldmanSachsAdapter.SendOrder(order)` génère un `FIX.NewOrderSingle` avec les tags GS spécifiques. L'OMS appelle `_brokerAdapter.SendOrder(order)` — la Factory choisit le bon Adapter selon le broker sélectionné pour le routing."
    },
    {
      "question": "[Adapter — test] Comment tester `BloombergAdapter.GetQuote('BNPP.PA')` sans connexion Bloomberg réelle ?",
      "options": [
        "Impossible de tester sans Bloomberg.",
        "Injecter un `Mock<BloombergAPI>` dans le constructeur de `BloombergAdapter` qui retourne des données fixes — `mockBbg.Setup(b => b.GetData(It.Is<BbgRequest>(r => r.SecurityId == 'BNPP.PA'))).Returns(testData)`.",
        "Utiliser une clé API Bloomberg sandbox.",
        "Tester directement la classe Bloomberg en isolation."
      ],
      "answer": "Injecter un `Mock<BloombergAPI>` dans le constructeur de `BloombergAdapter` qui retourne des données fixes — `mockBbg.Setup(b => b.GetData(It.Is<BbgRequest>(r => r.SecurityId == 'BNPP.PA'))).Returns(testData)`.",
      "explanation": "Testabilité de l'Adapter : si `BloombergAPI` est injectée dans le constructeur (pas `new BloombergAPI()` codé en dur), on peut la mocker. L'Adapter devient testable sans connexion réseau. Test = vérifier que la traduction est correcte : `var result = adapter.GetQuote('BNPP.PA'); Assert.Equal(58.50m, result.Price); Assert.Equal('BNPP.PA', result.Isin);`"
    },
    {
      "question": "[Adapter — Confusion Decorator] `BloombergAdapter` et `CachingMarketDataDecorator` implémentent tous deux `IMarketDataProvider`. Quelle est la différence d'intention ?",
      "options": [
        "Aucune — les deux sont des Adapters.",
        "BloombergAdapter traduit Bloomberg → IMarketDataProvider (adaptation d'interface). CachingDecorator enveloppe un `IMarketDataProvider` existant pour ajouter du cache — même interface, comportement enrichi.",
        "CachingDecorator est un meilleur Adapter.",
        "BloombergAdapter est côté données, Decorator côté calcul."
      ],
      "answer": "BloombergAdapter traduit Bloomberg → IMarketDataProvider (adaptation d'interface). CachingDecorator enveloppe un `IMarketDataProvider` existant pour ajouter du cache — même interface, comportement enrichi.",
      "explanation": "Coexistence Adapter + Decorator : `BloombergAdapter : IMarketDataProvider` → traduit Bloomberg. `CachingDecorator : IMarketDataProvider { private readonly IMarketDataProvider _inner; }` → wraps n'importe quel provider, ajoute du cache. Combinés : `new CachingDecorator(new BloombergAdapter(bbgApi))` — la Facade voit `IMarketDataProvider`, l'appel passe par le cache, puis par l'Adapter si cache miss."
    },
    {
      "question": "[Adapter — legacy systems] Un système de clearing Natixis legacy expose une API SOAP `.asmx` des années 2000. Comment l'intégrer dans une architecture C# moderne ?",
      "options": [
        "Réécrire entièrement le système legacy.",
        "Créer `LegacyClearingAdapter : IClearingService` qui appelle le SOAP service via `ServiceReference` générée, et traduit les types SOAP (DataSet, DataTable) vers les entités du domaine modernes (ClearingResult record).",
        "Exposer directement la référence SOAP au code métier.",
        "Utiliser Kafka pour faire communiquer le legacy et le nouveau système."
      ],
      "answer": "Créer `LegacyClearingAdapter : IClearingService` qui appelle le SOAP service via `ServiceReference` générée, et traduit les types SOAP (DataSet, DataTable) vers les entités du domaine modernes (ClearingResult record).",
      "explanation": "Adapter anti-corruption layer : le SOAP legacy retourne `DataSet` avec des colonnes nommées magiquement. L'Adapter fait la traduction : `public ClearingResult Clear(Trade t) { var soapRequest = BuildSoapRequest(t); var dataSet = _soapClient.Submit(soapRequest); return ParseDataSet(dataSet); }` Résultat : le code métier moderne manipule `ClearingResult` propre, totalement ignorant du SOAP legacy."
    },
    {
      "question": "[Adapter — DIP] Comment l'Adapter respecte-t-il le Dependency Inversion Principle ?",
      "options": [
        "L'Adapter viole DIP car il dépend de `BloombergAPI` (classe concrète).",
        "Le code métier dépend de `IMarketDataProvider` (abstraction), pas de `BloombergAPI` (concret). L'Adapter est le seul endroit qui dépend de la concrétude Bloomberg.",
        "DIP ne s'applique pas aux Adapters.",
        "L'Adapter respecte DIP uniquement si Bloomberg API est une interface."
      ],
      "answer": "Le code métier dépend de `IMarketDataProvider` (abstraction), pas de `BloombergAPI` (concret). L'Adapter est le seul endroit qui dépend de la concrétude Bloomberg.",
      "explanation": "DIP via Adapter : la dépendance sur Bloomberg est confinée dans `BloombergAdapter`. Tout le reste du système (`RiskService`, `PricingEngine`, `FermatFacade`) dépend uniquement de `IMarketDataProvider`. C'est précisément le rôle de l'Adapter dans l'architecture : être l'Anti-Corruption Layer qui isole la dépendance externe. Changer de provider = changer/ajouter un Adapter, pas refactorer les services métier."
    },

    // ── DECORATOR (Q71–Q80) ──
    {
      "question": "[Decorator] Comment `AuditRepositoryDecorator` ajoute-t-il de l'audit sans modifier `OracleTradeRepository` ?",
      "options": [
        "En héritant de `OracleTradeRepository` et en overridant `SaveAsync()`.",
        "En implémentant `ITradeRepository`, en composant `OracleTradeRepository`, et en appelant `await _inner.SaveAsync(trade)` puis `await _audit.LogAsync(...)` — l'original n'est pas touché.",
        "En modifiant `OracleTradeRepository.SaveAsync()` pour ajouter le logging.",
        "En utilisant un Singleton AuditLogger appelé depuis `OracleTradeRepository`."
      ],
      "answer": "En implémentant `ITradeRepository`, en composant `OracleTradeRepository`, et en appelant `await _inner.SaveAsync(trade)` puis `await _audit.LogAsync(...)` — l'original n'est pas touché.",
      "explanation": "Decorator = composition + même interface : `AuditRepositoryDecorator : ITradeRepository { private readonly ITradeRepository _inner; private readonly IAuditLogger _audit; public async Task SaveAsync(Trade t) { await _inner.SaveAsync(t); await _audit.LogAsync($'Trade {t.Id} booked by {_userId}'); } }` `OracleTradeRepository` n'est pas modifié — OCP respecté. L'audit est transparent pour le client."
    },
    {
      "question": "[Decorator — OCP] Comment le Decorator respecte-t-il l'Open/Closed Principle ?",
      "options": [
        "Le Decorator modifie la classe décorée pour l'étendre.",
        "La classe décorée est fermée à la modification. Le Decorator est l'extension — on ajoute du comportement sans toucher à l'existant, via composition.",
        "OCP interdit d'utiliser le Decorator dans les systèmes en production.",
        "Le Decorator ferme la classe décorée à tout changement futur."
      ],
      "answer": "La classe décorée est fermée à la modification. Le Decorator est l'extension — on ajoute du comportement sans toucher à l'existant, via composition.",
      "explanation": "OCP parfait avec Decorator : `OracleTradeRepository` est fermé — aucune ligne n'est modifiée. L'extension = `AuditRepositoryDecorator`. On peut empiler : `new CachingDecorator(new AuditDecorator(new OracleTradeRepository()))` — 3 couches de comportement, 0 modification. C'est pourquoi Decorator est idéal pour les préoccupations transversales (audit, logging, cache, retry)."
    },
    {
      "question": "[Decorator — Composition] Quel est l'avantage de `new CachingDecorator(new AuditDecorator(new OracleRepository()))` ?",
      "options": [
        "C'est une mauvaise pratique — trop de niveaux.",
        "Chaque couche a une responsabilité unique (SRP). L'ordre détermine le comportement : cache vérifié d'abord, audit si cache miss, puis Oracle. Sans Decorator, tout serait dans une seule classe.",
        "L'empilage de Decorators est moins performant que tout mettre dans OracleRepository.",
        "C'est un pattern Builder, pas Decorator."
      ],
      "answer": "Chaque couche a une responsabilité unique (SRP). L'ordre détermine le comportement : cache vérifié d'abord, audit si cache miss, puis Oracle. Sans Decorator, tout serait dans une seule classe.",
      "explanation": "SRP via Decorator : `CachingDecorator` = une responsabilité (cache). `AuditDecorator` = une responsabilité (audit). `OracleRepository` = une responsabilité (accès Oracle). L'ordre d'empilage est configurable selon les besoins : audit avant cache pour logguer toutes les tentatives, ou cache avant audit pour n'auditer que les vraies requêtes Oracle. Cette flexibilité est impossible avec l'héritage ou en tout mettant dans la même classe."
    },
    {
      "question": "[Decorator — Confusion avec Adapter] `LoggingDecorator` et `BloombergAdapter` implémentent tous deux une interface. Quelle est la différence ?",
      "options": [
        "Decorator hérite, Adapter compose.",
        "Decorator = même interface, même responsabilité, comportement enrichi. Adapter = interface différente traduite en interface cible — deux rôles incompatibles.",
        "Ils sont équivalents avec des noms différents.",
        "Decorator est pour les services, Adapter est pour les repositories."
      ],
      "answer": "Decorator = même interface, même responsabilité, comportement enrichi. Adapter = interface différente traduite en interface cible — deux rôles incompatibles.",
      "explanation": "Test de distinction : `LoggingDecorator : ITradeRepository` wrap un `ITradeRepository` — même interface, on ajoute du logging (Decorator). `BloombergAdapter : IMarketDataProvider` wrap une `BloombergAPI` (interface différente) — traduction d'interface (Adapter). Question clé : est-ce qu'on wraps quelque chose de la MÊME interface ? Oui = Decorator. Non, interface différente traduite ? = Adapter."
    },
    {
      "question": "[Decorator — delegate] Que signifie `delegate` dans le contexte du Decorator en C# ?",
      "options": [
        "Déléguer = appeler `_inner.Method()` — transmettre l'appel à l'objet décoré après avoir ajouté le comportement supplémentaire.",
        "Delegate est un type C# utilisé pour les événements Observer.",
        "Delegate signifie que le Decorator hérite de l'objet décoré.",
        "Delegate est la méthode `Build()` du Decorator."
      ],
      "answer": "Déléguer = appeler `_inner.Method()` — transmettre l'appel à l'objet décoré après avoir ajouté le comportement supplémentaire.",
      "explanation": "Delegation dans Decorator : `public async Task SaveAsync(Trade t) { // comportement ajouté await _audit.LogAsync(...); // délégation à l'inner await _inner.SaveAsync(t); }` La délégation est obligatoire — sans `await _inner.SaveAsync(t)`, le Decorator court-circuiterait l'opération principale. L'ordre (avant/après délégation) détermine si le comportement ajouté s'exécute avant ou après l'opération principale."
    },
    {
      "question": "[Decorator — Logging Finance] Un `LoggingTradeServiceDecorator` loggue chaque appel à `BookTrade()`. Quels éléments essentiels doit-il logguer en contexte Natixis ?",
      "options": [
        "Uniquement le timestamp et le résultat.",
        "Timestamp, UserId (trader), TradeId, Notional, Counterparty, durée d'exécution (ms), résultat (succès/échec), exception si erreur — pour l'audit MiFID II et le debugging.",
        "Uniquement les erreurs.",
        "Le code source de la méthode appelée."
      ],
      "answer": "Timestamp, UserId (trader), TradeId, Notional, Counterparty, durée d'exécution (ms), résultat (succès/échec), exception si erreur — pour l'audit MiFID II et le debugging.",
      "explanation": "Logging MiFID II : la réglementation exige de conserver l'identité de l'opérateur, l'heure exacte (à la milliseconde), les paramètres du trade, et le résultat. Le Decorator capture : `var sw = Stopwatch.StartNew(); try { await _inner.BookTrade(trade); _log.Info('BookTrade OK', userId, trade.Id, sw.ElapsedMs); } catch(ex) { _log.Error('BookTrade FAIL', userId, trade.Id, ex); throw; }` Le `throw` relaie l'exception — le Decorator ne doit pas avaler les exceptions."
    },
    {
      "question": "[Decorator — Retry] Comment un `RetryDecorator` peut-il améliorer la résilience d'un `OracleExposureRepository` ?",
      "options": [
        "En modifiant `OracleExposureRepository` pour ajouter des retry.",
        "`RetryDecorator : IExposureRepository { public async Task SaveAsync(Exposure e) { for(int i=0; i<3; i++) { try { await _inner.SaveAsync(e); return; } catch(OracleException) { await Task.Delay(100); } } throw; } }` — 3 tentatives sans toucher à Oracle.",
        "En configurant le retry dans Oracle directement.",
        "En utilisant Kafka pour les retry."
      ],
      "answer": "`RetryDecorator : IExposureRepository { public async Task SaveAsync(Exposure e) { for(int i=0; i<3; i++) { try { await _inner.SaveAsync(e); return; } catch(OracleException) { await Task.Delay(100); } } throw; } }` — 3 tentatives sans toucher à Oracle.",
      "explanation": "Résilience via Decorator : instabilités réseau Oracle peuvent causer des échecs ponctuels. `RetryDecorator` ajoute 3 tentatives avec délai sans modifier `OracleExposureRepository`. Empilé : `new RetryDecorator(new CircuitBreakerDecorator(new AuditDecorator(new OracleRepository())))`. En pratique, utiliser la librairie Polly : `services.AddScoped<IExposureRepository>(sp => new RetryDecorator(sp.GetService<OracleRepository>(), Policy.WaitAndRetryAsync(3, i => TimeSpan.FromMilliseconds(100))));`"
    },
    {
      "question": "[Decorator — vs Héritage] Pourquoi préférer `AuditDecorator` à `AuditableTradeRepository : OracleTradeRepository` (héritage) ?",
      "options": [
        "L'héritage est plus rapide.",
        "Flexibilité runtime : le Decorator s'applique à N'IMPORTE QUELLE implémentation de `ITradeRepository` (Oracle, SQL Server, InMemory). L'héritage couple `AuditableTradeRepository` à Oracle spécifiquement.",
        "C# ne supporte pas l'héritage pour les repositories.",
        "L'héritage viole OCP."
      ],
      "answer": "Flexibilité runtime : le Decorator s'applique à N'IMPORTE QUELLE implémentation de `ITradeRepository` (Oracle, SQL Server, InMemory). L'héritage couple `AuditableTradeRepository` à Oracle spécifiquement.",
      "explanation": "Composition vs héritage : `AuditDecorator(ITradeRepository inner)` fonctionne avec Oracle, SQL Server, InMemory — testable, flexible. `class AuditableTradeRepository : OracleTradeRepository` = couplage fort. Problème : si on ajoute `SqlServerTradeRepository`, il faut créer `AuditableSqlServerTradeRepository` — explosion combinatoire. Avec Decorator : 1 `AuditDecorator` s'applique à toutes les implémentations."
    },
    {
      "question": "[Decorator — Natixis Compliance] Un `ComplianceCheckDecorator` enveloppe `ITradeService`. Dans `BookTrade()`, il vérifie les règles MiFID II avant de déléguer. Que fait-il si la vérification échoue ?",
      "options": [
        "Il appelle quand même `_inner.BookTrade()` et loggue l'avertissement.",
        "Il lève une `ComplianceException` SANS appeler `_inner.BookTrade()` — le trade non conforme n'est jamais bookké.",
        "Il modifie le trade pour le rendre conforme avant de le déléguer.",
        "Il publie un événement Kafka et attend validation manuelle."
      ],
      "answer": "Il lève une `ComplianceException` SANS appeler `_inner.BookTrade()` — le trade non conforme n'est jamais bookké.",
      "explanation": "Gate Decorator : `public async Task BookTrade(Trade t) { var result = await _compliance.Check(t); if(!result.IsCompliant) throw new ComplianceException(result.Violations); await _inner.BookTrade(t); }` La délégation à `_inner` ne se fait QUE si la vérification passe. C'est un cas où le Decorator peut court-circuiter — différent du logging qui délègue toujours. En finance : MiFID II best execution, limites réglementaires = gates qu'on ne peut pas contourner."
    },
    {
      "question": "[Decorator — Cache] Un `CachingExposureDecorator` met en cache les expositions lues depuis Oracle. Comment fonctionne-t-il ?",
      "options": [
        "Il remplace Oracle par Redis complètement.",
        "`GetByCounterparty(cpty)` : cherche d'abord dans Redis, si trouvé retourne directement. Si cache miss, appelle `_inner.GetByCounterparty(cpty)`, stocke dans Redis, et retourne le résultat.",
        "Il met en cache uniquement les écritures, pas les lectures.",
        "Il utilise ConcurrentDictionary en mémoire, pas Redis."
      ],
      "answer": "`GetByCounterparty(cpty)` : cherche d'abord dans Redis, si trouvé retourne directement. Si cache miss, appelle `_inner.GetByCounterparty(cpty)`, stocke dans Redis, et retourne le résultat.",
      "explanation": "Cache-aside pattern via Decorator : `public async Task<IEnumerable<Exposure>> GetByCounterparty(string cpty) { var cached = await _redis.GetAsync(cpty); if(cached != null) return Deserialize(cached); var result = await _inner.GetByCounterparty(cpty); await _redis.SetAsync(cpty, Serialize(result), TimeSpan.FromMinutes(5)); return result; }` Transparent pour le client — il appelle toujours `IExposureRepository`. Oracle n'est sollicité qu'en cas de cache miss."
    },

    // ── OBSERVER (Q81–Q90) ──
    {
      "question": "[Observer] Comment les alertes de limites de crédit sont-elles implémentées avec le pattern Observer en C# ?",
      "options": [
        "En interrogeant la base Oracle toutes les secondes.",
        "`RiskMonitor` publie `event Action<RiskAlert> OnLimitBreached`. Abonnés : `monitor.OnLimitBreached += alert => SendEmail(alert)` et `monitor.OnLimitBreached += alert => PublishKafka(alert)` — découplage total.",
        "En utilisant un Singleton RiskAlertService.",
        "En créant un thread dédié qui vérifie les limites."
      ],
      "answer": "`RiskMonitor` publie `event Action<RiskAlert> OnLimitBreached`. Abonnés : `monitor.OnLimitBreached += alert => SendEmail(alert)` et `monitor.OnLimitBreached += alert => PublishKafka(alert)` — découplage total.",
      "explanation": "Observer en C# = `event` + `delegate`. Sujet : `RiskMonitor` publie des événements quand une limite est franchie. Observateurs : EmailNotifier, KafkaPublisher, ReactWebSocketPusher — chacun s'abonne indépendamment. Découplage : `RiskMonitor` ne connaît pas ses abonnés. Ajouter un SMS Notifier = une ligne `monitor.OnLimitBreached += alert => SendSMS(alert)` sans modifier `RiskMonitor`."
    },
    {
      "question": "[Observer — OCP] Comment le pattern Observer respecte-t-il OCP lors de l'ajout d'un nouveau canal de notification (ex: SMS) ?",
      "options": [
        "Modifier `RiskMonitor` pour ajouter l'envoi SMS.",
        "Créer le handler SMS et l'abonner : `monitor.OnLimitBreached += alert => _smsService.Send(alert)` — `RiskMonitor` n'est pas modifié.",
        "OCP ne s'applique pas aux événements C#.",
        "Créer une sous-classe de `RiskMonitor` qui ajoute le SMS."
      ],
      "answer": "Créer le handler SMS et l'abonner : `monitor.OnLimitBreached += alert => _smsService.Send(alert)` — `RiskMonitor` n'est pas modifié.",
      "explanation": "OCP via Observer : `RiskMonitor` est fermé — aucune modification. L'extension = nouveau handler `SmsNotificationHandler` qui s'abonne à `OnLimitBreached`. C'est précisément le point fort de l'Observer : le sujet ignore totalement ses observateurs, qui peuvent être ajoutés/retirés dynamiquement. En production Natixis, on pourrait configurer les notifications par desk ou par type d'alerte."
    },
    {
      "question": "[Observer — event vs delegate] Quelle est la différence entre `event Action<RiskAlert>` et `Action<RiskAlert>` en C# ?",
      "options": [
        "Ce sont des synonymes.",
        "`event` interdit l'invocation et la réaffectation depuis l'extérieur de la classe — seule la classe peut faire `OnLimitBreached?.Invoke(alert)`. `Action<RiskAlert>` sans `event` = n'importe qui peut l'invoquer ou le réinitialiser (`= null`).",
        "`event` est asynchrone, `Action` est synchrone.",
        "`event` est pour les interfaces, `Action` pour les classes."
      ],
      "answer": "`event` interdit l'invocation et la réaffectation depuis l'extérieur de la classe — seule la classe peut faire `OnLimitBreached?.Invoke(alert)`. `Action<RiskAlert>` sans `event` = n'importe qui peut l'invoquer ou le réinitialiser (`= null`).",
      "explanation": "Encapsulation avec `event` : `public event Action<RiskAlert> OnLimitBreached` — les abonnés externes peuvent uniquement faire `+= handler` ou `-= handler`. Ils ne peuvent PAS faire `monitor.OnLimitBreached = null` (effacerait tous les abonnements) ni `monitor.OnLimitBreached(alert)` (invoquer l'événement de l'extérieur). `event` = protection de l'encapsulation pour le pattern Observer."
    },
    {
      "question": "[Observer — Market Data] Comment le pattern Observer est-il utilisé pour distribuer les prix de marché en temps réel à Natixis ?",
      "options": [
        "Un thread poll Bloomberg toutes les secondes et envoie les prix par email.",
        "`MarketDataFeed` (sujet) publie `event Action<PriceUpdate> OnPriceReceived`. Abonnés : `PricingEngine`, `RiskEngine`, `BlotterService`, `VolSurfaceCalibrator` — tous reçoivent chaque tick instantanément.",
        "Les prix sont stockés dans Oracle et lus par chaque service séparément.",
        "Kafka remplace Observer pour les prix de marché."
      ],
      "answer": "`MarketDataFeed` (sujet) publie `event Action<PriceUpdate> OnPriceReceived`. Abonnés : `PricingEngine`, `RiskEngine`, `BlotterService`, `VolSurfaceCalibrator` — tous reçoivent chaque tick instantanément.",
      "explanation": "Market Data broadcast via Observer : un seul flux entrant (Bloomberg/Reuters), plusieurs consommateurs. `MarketDataFeed.OnPriceReceived` est déclenché pour chaque tick. En CIB, des milliers de ticks/seconde par symbole. Chaque abonné traite le tick indépendamment : PricingEngine recalcule le MTM, RiskEngine recalcule le Delta, VolSurface se recalibre. Observer = bus interne in-process, Kafka = bus externe inter-services."
    },
    {
      "question": "[Observer — Polymorphisme] Comment le polymorphisme est-il utilisé dans l'Observer ?",
      "options": [
        "Le polymorphisme n'est pas utilisé dans Observer.",
        "Chaque observateur implémente `IObserver<RiskAlert>` ou `IRiskAlertHandler`. Selon le type concret (`EmailHandler`, `KafkaHandler`, `SmsHandler`), le comportement de `Handle(alert)` est différent — dispatch dynamique.",
        "Polymorphisme = plusieurs sujets observés.",
        "Observer utilise le polymorphisme uniquement pour les événements."
      ],
      "answer": "Chaque observateur implémente `IObserver<RiskAlert>` ou `IRiskAlertHandler`. Selon le type concret (`EmailHandler`, `KafkaHandler`, `SmsHandler`), le comportement de `Handle(alert)` est différent — dispatch dynamique.",
      "explanation": "Polymorphisme Observer : `List<IRiskAlertHandler> _handlers`. Chaque `_handler.Handle(alert)` appelle la bonne implémentation selon le type concret. Ajout d'un nouveau canal = nouvelle classe `SlackHandler : IRiskAlertHandler`. L'iteration `foreach(var h in _handlers) h.Handle(alert)` ne change pas. Polymorphisme = même interface, comportements différents selon le type."
    },
    {
      "question": "[Observer — Désabonnement] Pourquoi est-il important de se désabonner d'un événement Observer quand l'observateur n'est plus nécessaire ?",
      "options": [
        "Le désabonnement est optionnel — le GC le gère.",
        "Un observateur abonné à un événement est retenu en mémoire par le sujet — si l'observateur est 'détruit' sans désabonnement (`-= handler`), il reste en vie en mémoire (memory leak) et continue de recevoir des événements.",
        "Le désabonnement empêche les race conditions.",
        "Le désabonnement est obligatoire uniquement dans les interfaces graphiques."
      ],
      "answer": "Un observateur abonné à un événement est retenu en mémoire par le sujet — si l'observateur est 'détruit' sans désabonnement (`-= handler`), il reste en vie en mémoire (memory leak) et continue de recevoir des événements.",
      "explanation": "Memory leak classique C# : `riskMonitor.OnLimitBreached += alert => handler.Handle(alert)` → `riskMonitor` contient une référence à `handler`. Tant que `riskMonitor` vit (souvent toute l'application), `handler` ne peut pas être collecté par le GC, même si on 'détruit' le handler. Solution : `IDisposable.Dispose()` appelle `-= handler`. En pratique Natixis : les handlers de blotter se désabonnent quand l'utilisateur ferme un écran."
    },
    {
      "question": "[Observer — vs Kafka] Quand utiliser un `event C#` (Observer interne) vs Kafka pour les alertes de limite à Natixis ?",
      "options": [
        "Kafka est toujours meilleur que les events C#.",
        "Events C# (Observer) = in-process, même service, latence < 1ms — idéal pour notifier plusieurs composants dans le même OMS C#. Kafka = inter-services, cross-salle, persistant, rejouable — pour notifier le RMS Python, le dashboard React, la salle de Londres.",
        "Events C# = synchrones, Kafka = asynchrones.",
        "Observer est deprecated — utiliser Kafka partout."
      ],
      "answer": "Events C# (Observer) = in-process, même service, latence < 1ms — idéal pour notifier plusieurs composants dans le même OMS C#. Kafka = inter-services, cross-salle, persistant, rejouable — pour notifier le RMS Python, le dashboard React, la salle de Londres.",
      "explanation": "Complémentarité Observer + Kafka : dans un OMS C#, `OnOrderFilled` event notifie instantanément `PnlCalculator`, `PositionManager`, `BlotterRefresher` — in-process, sous la milliseconde. L'`OnOrderFilled` handler publie aussi sur Kafka `order.filled` — notifie les services externes (RMS Python, PMS, Archive MiFID II). Observer = bus interne synchrone. Kafka = bus externe asynchrone persistant."
    },
    {
      "question": "[Observer — INotifyPropertyChanged] Quel est le lien entre `INotifyPropertyChanged` en WPF/Blazor et le pattern Observer ?",
      "options": [
        "INotifyPropertyChanged est un pattern différent.",
        "`INotifyPropertyChanged` est une implémentation standard de l'Observer — l'objet métier (sujet) notifie l'UI (observateur) via `PropertyChanged` event quand une propriété change. L'UI se met à jour automatiquement.",
        "INotifyPropertyChanged est pour les formulaires uniquement.",
        "INotifyPropertyChanged utilise Kafka pour notifier l'UI."
      ],
      "answer": "`INotifyPropertyChanged` est une implémentation standard de l'Observer — l'objet métier (sujet) notifie l'UI (observateur) via `PropertyChanged` event quand une propriété change. L'UI se met à jour automatiquement.",
      "explanation": "Pattern Observer en pratique UI : `class PositionViewModel : INotifyPropertyChanged { private decimal _mtm; public decimal Mtm { get => _mtm; set { _mtm = value; PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Mtm))); } } }` Quand `Mtm` change (nouveau prix de marché), le binding WPF/Blazor met à jour l'affichage automatiquement. Le sujet est `PositionViewModel`, l'observateur est le contrôle UI bindé."
    },
    {
      "question": "[Observer — Thread-safety] Dans un contexte CIB avec des ticks à haute fréquence, comment sécuriser l'invocation d'un event Observer ?",
      "options": [
        "Les events C# sont thread-safe par défaut.",
        "Copier la référence avant d'invoquer : `var handler = OnPriceReceived; handler?.Invoke(update);` — évite la race condition entre vérification null et invocation si un thread se désabonne simultanément.",
        "Utiliser `lock` sur l'event avant chaque invocation.",
        "Les events multi-thread doivent utiliser `SemaphoreSlim`."
      ],
      "answer": "Copier la référence avant d'invoquer : `var handler = OnPriceReceived; handler?.Invoke(update);` — évite la race condition entre vérification null et invocation si un thread se désabonne simultanément.",
      "explanation": "Race condition classique : Thread A vérifie `if(OnPriceReceived != null)` → vrai. Thread B fait `-= lastHandler` → OnPriceReceived devient null. Thread A appelle `OnPriceReceived(update)` → NullReferenceException. Solution : `var local = OnPriceReceived; local?.Invoke(update);` — la copie locale `local` est immuable. En C# moderne, `?.Invoke()` fait cette copie implicitement (mais explicite = plus lisible en finance)."
    },
    {
      "question": "[Observer — Test] Comment tester que `RiskMonitor` lève bien `OnLimitBreached` quand la VaR dépasse la limite ?",
      "options": [
        "Impossible de tester les events C#.",
        "S'abonner à l'event avant le test, stocker les alertes reçues dans une liste, appeler `monitor.CheckLimits(positionExceedingLimit)`, et vérifier que la liste contient la bonne alerte.",
        "Mocker l'event dans Moq directement.",
        "Tester en attente de l'événement avec `Thread.Sleep`."
      ],
      "answer": "S'abonner à l'event avant le test, stocker les alertes reçues dans une liste, appeler `monitor.CheckLimits(positionExceedingLimit)`, et vérifier que la liste contient la bonne alerte.",
      "explanation": "Test Observer : `var alerts = new List<RiskAlert>(); monitor.OnLimitBreached += a => alerts.Add(a); monitor.CheckLimits(new Position { VaR = 10_000_000m }); // excède la limite Assert.Single(alerts); Assert.Equal('VaRLimit', alerts[0].LimitName); Assert.Equal(10_000_000m, alerts[0].CurrentValue);` Pattern test Observer = subscribe → trigger → assert on received events."
    },

    // ── DEPENDENCY INJECTION (Q91–Q100) ──
    {
      "question": "[DI] Quelle est la différence entre `AddSingleton`, `AddScoped`, et `AddTransient` dans ASP.NET Core pour un Repository ?",
      "options": [
        "Ce sont des synonymes avec des noms différents.",
        "Singleton = une instance pour toute la durée de l'application. Scoped = une instance par requête HTTP (standard pour Repository avec DbContext). Transient = nouvelle instance à chaque injection.",
        "AddScoped = Singleton par utilisateur, AddTransient = Singleton par thread.",
        "AddSingleton est pour les interfaces, AddScoped pour les classes."
      ],
      "answer": "Singleton = une instance pour toute la durée de l'application. Scoped = une instance par requête HTTP (standard pour Repository avec DbContext). Transient = nouvelle instance à chaque injection.",
      "explanation": "Durées de vie DI en contexte finance : `IConfiguration` → Singleton (paramètres stables). `ITradeRepository` → Scoped (une instance par requête, aligné sur `DbContext`). `IExposureCalculator` → Transient (stateless, ok en Transient). Erreur classique : injecter un Scoped dans un Singleton (captive dependency). ASP.NET Core lève une exception en développement si `ASPNETCORE_ENVIRONMENT=Development`."
    },
    {
      "question": "[DI — DIP] Comment la Dependency Injection implémente-t-elle le Dependency Inversion Principle ?",
      "options": [
        "DI et DIP sont des concepts non liés.",
        "DI force les classes à recevoir leurs dépendances via le constructeur (`ITradeRepository repo`) plutôt que de les créer (`new OracleTradeRepository()`). La classe de haut niveau dépend de l'abstraction, pas du concret.",
        "DIP interdit l'utilisation de `new` — DI est l'implémentation obligatoire.",
        "DI respecte DIP uniquement avec `interface`, pas avec `abstract class`."
      ],
      "answer": "DI force les classes à recevoir leurs dépendances via le constructeur (`ITradeRepository repo`) plutôt que de les créer (`new OracleTradeRepository()`). La classe de haut niveau dépend de l'abstraction, pas du concret.",
      "explanation": "DIP via DI : `class RiskEngine(ITradeRepository repo, IExposureStrategy strategy)` → le constructeur déclare des ABSTRACTIONS. Le conteneur DI résout les concrétions : `repo` → `OracleTradeRepository`, `strategy` → `SACCRStrategy`. `RiskEngine` ne sait pas quelle base de données est utilisée, ni quelle formule réglementaire. C'est le conteneur IoC qui configure ce mapping — séparation des préoccupations."
    },
    {
      "question": "[DI — Constructor injection] Pourquoi la constructor injection est-elle préférée à la property injection dans un service de risque ?",
      "options": [
        "La property injection est interdite en C#.",
        "Constructor injection = dépendances obligatoires garanties à la création — l'objet ne peut jamais être créé sans ses dépendances (fail-fast). Property injection = dépendances optionnelles, risque de `NullReferenceException` si oubliées.",
        "Constructor injection est plus performante.",
        "Property injection viole DIP."
      ],
      "answer": "Constructor injection = dépendances obligatoires garanties à la création — l'objet ne peut jamais être créé sans ses dépendances (fail-fast). Property injection = dépendances optionnelles, risque de `NullReferenceException` si oubliées.",
      "explanation": "Fail-fast avec constructor injection : `new RiskEngine(null, null)` lève immédiatement `ArgumentNullException` dans le constructeur si on ajoute `if(repo == null) throw new ArgumentNullException(nameof(repo))`. Avec property injection, `riskEngine.Repository = null` (oubli) → `NullReferenceException` à la première utilisation, souvent en production. En finance, fail-fast dès le démarrage = préférable à un crash pendant le calcul de VaR."
    },
    {
      "question": "[DI — IServiceCollection] Que fait `services.AddScoped<IExposureStrategy, SACCRStrategy>()` ?",
      "options": [
        "Crée immédiatement une instance de `SACCRStrategy`.",
        "Enregistre le mapping : quand `IExposureStrategy` est demandée comme dépendance, le conteneur crée/retourne une `SACCRStrategy` (durée de vie Scoped).",
        "Rend `SACCRStrategy` publiquement accessible comme Singleton.",
        "Injecte `SACCRStrategy` dans toutes les classes qui héritent de `IExposureStrategy`."
      ],
      "answer": "Enregistre le mapping : quand `IExposureStrategy` est demandée comme dépendance, le conteneur crée/retourne une `SACCRStrategy` (durée de vie Scoped).",
      "explanation": "L'enregistrement DI est une CONFIGURATION, pas une création. `AddScoped<IExposureStrategy, SACCRStrategy>()` dit : 'Si quelqu'un demande `IExposureStrategy`, donne-lui une `SACCRStrategy`, une par requête HTTP'. La création n'a lieu que quand `RiskEngine` est instancié par le conteneur pour une requête réelle. Changer pour Bâle IV : `services.AddScoped<IExposureStrategy, BaselIVStrategy>()` — le reste du code est intact."
    },
    {
      "question": "[DI — vs Factory] Un service de risque doit choisir dynamiquement la stratégie selon le type de contrepartie lu depuis la DB. DI suffit-il ?",
      "options": [
        "Oui, DI peut choisir dynamiquement.",
        "Non — DI configure des types au démarrage, pas selon des données runtime. Solution : injecter une `IExposureStrategyFactory` qui lit le type de contrepartie et crée la bonne stratégie à l'exécution.",
        "Oui, en utilisant `AddTransient` pour chaque stratégie.",
        "Non, il faut un `switch` dans le service de risque."
      ],
      "answer": "Non — DI configure des types au démarrage, pas selon des données runtime. Solution : injecter une `IExposureStrategyFactory` qui lit le type de contrepartie et crée la bonne stratégie à l'exécution.",
      "explanation": "Limite de DI : `AddScoped<IExposureStrategy, SACCRStrategy>()` fixe la stratégie au démarrage. Si la logique est 'utiliser SA-CCR pour les banques, Net Exposure pour les corporates' (données runtime), DI ne suffit pas. Pattern combiné : `services.AddScoped<IExposureStrategyFactory, ExposureStrategyFactory>()` → la Factory est injectée → `factory.Create(counterparty.Type)` retourne la bonne stratégie. DI + Factory = flexibilité maximale."
    },
    {
      "question": "[DI — Tests] Comment DI facilite les tests unitaires d'un moteur de risque ?",
      "options": [
        "DI ne facilite pas les tests.",
        "En injectant des mocks via le constructeur : `new RiskEngine(mockRepo, mockStrategy)` — pas de base Oracle, pas de Bloomberg, tests en millisecondes.",
        "DI génère automatiquement les mocks.",
        "DI permet de démarrer l'application complète pour les tests."
      ],
      "answer": "En injectant des mocks via le constructeur : `new RiskEngine(mockRepo, mockStrategy)` — pas de base Oracle, pas de Bloomberg, tests en millisecondes.",
      "explanation": "Testabilité = bénéfice principal de DI : sans DI, `new RiskEngine()` crée `new OracleRepository()` en interne — impossible de mocker Oracle. Avec DI et constructor injection : `var mockRepo = new Mock<IExposureRepository>(); var mockStrategy = new Mock<IExposureStrategy>(); var engine = new RiskEngine(mockRepo.Object, mockStrategy.Object);` Tests = isolation totale, sans infrastructure."
    },
    {
      "question": "[DI — Injection Repository] `services.AddScoped<IExposureRepository, OracleExposureRepository>()` — où `OracleExposureRepository` doit-il déclarer sa connexion Oracle ?",
      "options": [
        "En dur dans le code source : `private string _connStr = 'Data Source=ORACLE_PROD;'`.",
        "Via constructor injection : `OracleExposureRepository(IConfiguration config)` → `_connStr = config['OracleConnectionString']` — la connexion est configurée dans `appsettings.json` et injectée.",
        "Via une variable d'environnement lue directement dans le constructeur.",
        "Via un fichier `.env` parsé manuellement."
      ],
      "answer": "Via constructor injection : `OracleExposureRepository(IConfiguration config)` → `_connStr = config['OracleConnectionString']` — la connexion est configurée dans `appsettings.json` et injectée.",
      "explanation": "Bonne pratique DI : la chaîne de connexion Oracle ne doit jamais être en dur dans le code (secret dans Git !). `IConfiguration` est injectée par le conteneur DI. `appsettings.Development.json` pointe vers l'Oracle de développement, `appsettings.Production.json` vers l'Oracle de production, `appsettings.Test.json` vers une DB de test. Aucun code ne change entre les environnements."
    },
    {
      "question": "[DI — Confusion Singleton] `services.AddSingleton<IRiskEngine, RiskEngine>()` — quel problème si `RiskEngine` dépend d'un `ITradeRepository` Scoped ?",
      "options": [
        "Aucun problème — Scoped est compatible avec Singleton.",
        "Captive dependency : le Singleton `RiskEngine` capture l'instance Scoped `ITradeRepository` créée pour la première requête — toutes les requêtes suivantes utilisent le même Repository (et son DbContext stale).",
        "Le conteneur lève une exception au démarrage dans tous les cas.",
        "Le Scoped Repository devient automatiquement Singleton."
      ],
      "answer": "Captive dependency : le Singleton `RiskEngine` capture l'instance Scoped `ITradeRepository` créée pour la première requête — toutes les requêtes suivantes utilisent le même Repository (et son DbContext stale).",
      "explanation": "Captive dependency = bug silencieux critique : `RiskEngine` Singleton est créé une fois avec une instance de `OracleTradeRepository` Scoped. Cette instance contient un `DbContext` de la première requête — ses connexions, transactions, change tracker sont stale. En ASP.NET Core avec `ASPNETCORE_ENVIRONMENT=Development`, le conteneur détecte et lève `InvalidOperationException`. Solution : rendre `RiskEngine` Scoped, ou injecter `IServiceScopeFactory` dans le Singleton."
    },
    {
      "question": "[DI — Combinaison patterns] Dans un service `RiskEngine` qui utilise DI + Strategy + Repository, comment les trois patterns coexistent-ils ?",
      "options": [
        "On ne peut pas utiliser trois patterns dans la même classe.",
        "DI injecte `IExposureStrategy` et `IExposureRepository` dans le constructeur. Strategy détermine l'algorithme de calcul. Repository isole l'accès Oracle. Les trois sont orthogonaux et se complètent.",
        "Strategy et Repository sont des sous-cas de DI.",
        "DI remplace Strategy et Repository en production."
      ],
      "answer": "DI injecte `IExposureStrategy` et `IExposureRepository` dans le constructeur. Strategy détermine l'algorithme de calcul. Repository isole l'accès Oracle. Les trois sont orthogonaux et se complètent.",
      "explanation": "Complémentarité en pratique : `class RiskEngine { public RiskEngine(IExposureStrategy strategy, IExposureRepository repo) {...} public async Task<decimal> ComputeExposure(string cpty) { var exposures = await _repo.GetByCounterparty(cpty); return _strategy.Compute(exposures); } }` DI = comment recevoir les dépendances. Strategy = quel algorithme. Repository = quelle source de données. Chaque pattern résout son propre problème. C'est cette composition qui produit du code maintenable et testable."
    },
    {
      "question": "[DI — Natixis complet] Dans une architecture Natixis complète, combien de patterns peuvent être actifs dans un seul appel à `fermat.ProcessTrade(trade)` ?",
      "options": [
        "Un seul — il faut choisir.",
        "Potentiellement tous : Facade (point d'entrée FERMAT), Strategy (algorithme SA-CCR), Repository (Oracle Exposure), Decorator (Audit + Logging), Factory (sélection stratégie), Observer (alerte si limite franchie), DI (injection de tout le graphe), Builder (construction du Trade).",
        "Maximum 3 — au-delà c'est du sur-engineering.",
        "2 patterns par classe au maximum."
      ],
      "answer": "Potentiellement tous : Facade (point d'entrée FERMAT), Strategy (algorithme SA-CCR), Repository (Oracle Exposure), Decorator (Audit + Logging), Factory (sélection stratégie), Observer (alerte si limite franchie), DI (injection de tout le graphe), Builder (construction du Trade).",
      "explanation": "Architecture réelle Natixis : `fermat.ProcessTrade(tradeRequest)` → Facade orchestre → Factory crée la Strategy SA-CCR → DI a injecté le Repository Oracle (wrappé dans un AuditDecorator et un CachingDecorator) → Strategy calcule l'exposition → RiskMonitor (Observer) publie une alerte si limite franchie → Trade construit via Builder. Les patterns se complètent, chacun résolvant son problème spécifique. C'est la maîtrise de leur combinaison qui distingue un architecte d'un développeur junior."
    }
  ],
  avance: [
    {
      "question": "[Singleton vs DI — Architecture] Dans une architecture microservices Natixis, pourquoi le Singleton GoF est-il souvent remplacé par `AddSingleton` DI ?",
      "options": [
        "Ils sont équivalents — juste une syntaxe différente.",
        "Singleton GoF = couplage fort (classe se crée elle-même, impossible à mocker). AddSingleton DI = unicité gérée par le conteneur, la classe reste injectable et testable — combine unicité + découplage.",
        "AddSingleton DI ne garantit pas l'unicité — plusieurs conteneurs = plusieurs instances.",
        "Le Singleton GoF est déprécié en .NET 6+."
      ],
      "answer": "Singleton GoF = couplage fort (classe se crée elle-même, impossible à mocker). AddSingleton DI = unicité gérée par le conteneur, la classe reste injectable et testable — combine unicité + découplage.",
      "explanation": "Evolution architecturale : Singleton GoF cache sa dépendance (`Logger.Instance`), impossible à tester (comment mocker un accès statique ?). AddSingleton DI : `services.AddSingleton<ILogger, Logger>()` → une seule instance dans le conteneur, mais `Logger` reçoit ses dépendances par injection. En test : `new RiskEngine(new Mock<ILogger>().Object)` — le 'Singleton' est mockable. Meilleur des deux mondes : unicité + testabilité."
    },
    {
      "question": "[Factory + Strategy — Design] Dans un desk multi-réglementations (EMIR en Europe, Dodd-Frank aux USA, MAS à Singapour), comment Factory et Strategy collaborent-ils ?",
      "options": [
        "Factory et Strategy ne peuvent pas collaborer.",
        "Strategy définit l'interface commune `IExposureStrategy`. Factory (ou Abstract Factory) crée la bonne implémentation selon la juridiction : `ExposureStrategyFactory.Create('EMIR')` → `EsmaExposureStrategy`. Le desk change de stratégie sans recompiler le moteur.",
        "Strategy définit les stratégies, Factory les stocke en Singleton.",
        "Factory crée les positions, Strategy calcule les positions."
      ],
      "answer": "Strategy définit l'interface commune `IExposureStrategy`. Factory crée la bonne implémentation selon la juridiction : `ExposureStrategyFactory.Create('EMIR')` → `EsmaExposureStrategy`. Le desk change de stratégie sans recompiler le moteur.",
      "explanation": "Architecture multi-réglementaire : même API interne (`IExposureStrategy.Compute()`), implémentations réglementaires différentes (EMIR, Dodd-Frank, MAS). Factory + Abstract Factory : `JurisdictionRiskFactory.Create('EU').CreateExposureStrategy()` retourne une stratégie conforme EMIR. `JurisdictionRiskFactory.Create('US').CreateExposureStrategy()` retourne du Dodd-Frank. Changer de réglementation = changer de factory, pas le moteur de risque."
    },
    {
      "question": "[Repository + Decorator — Pipeline] Comment construire un pipeline `CachingDecorator → RetryDecorator → AuditDecorator → OracleRepository` avec DI ?",
      "options": [
        "C'est impossible avec le conteneur DI standard.",
        "Enregistrer manuellement : `services.AddScoped<ITradeRepository>(sp => new CachingDecorator(new RetryDecorator(new AuditDecorator(sp.GetService<OracleRepository>()))))` — ou utiliser Scrutor pour la configuration déclarative.",
        "Utiliser AddSingleton pour chaque Decorator.",
        "Le pattern Decorator ne peut pas être configuré dans DI."
      ],
      "answer": "Enregistrer manuellement : `services.AddScoped<ITradeRepository>(sp => new CachingDecorator(new RetryDecorator(new AuditDecorator(sp.GetService<OracleRepository>()))))` — ou utiliser Scrutor pour la configuration déclarative.",
      "explanation": "DI + Decorator : le conteneur IoC standard ne supporte pas automatiquement les Decorators empilés — il faut configurer manuellement ou utiliser Scrutor (`services.Decorate<ITradeRepository, CachingDecorator>()`). L'ordre d'empilement est important : CachingDecorator (le plus externe) intercepte d'abord. En AOP (Aspect-Oriented Programming), ces Decorators sont des 'aspects' transversaux — cache, retry, audit."
    },
    {
      "question": "[Observer — Event Sourcing] Comment Observer et Event Sourcing se complètent-ils dans un OMS Natixis ?",
      "options": [
        "Observer et Event Sourcing s'excluent mutuellement.",
        "Observer distribue les événements aux consommateurs in-process (Observer = push local). Event Sourcing persiste chaque événement comme source de vérité. Les deux combinés : quand `RiskMonitor` publie `OnLimitBreached` (Observer), un handler persiste l'événement en Event Store (Event Sourcing).",
        "Event Sourcing remplace Observer en architecture moderne.",
        "Observer est la couche de présentation d'Event Sourcing."
      ],
      "answer": "Observer distribue les événements aux consommateurs in-process. Event Sourcing persiste chaque événement comme source de vérité. Combinés : l'Observer publie, un handler persiste en Event Store, d'autres handlers agissent.",
      "explanation": "Architecture event-driven Natixis : `OrderFilled` event → Observer distribue in-process : (1) `PnlCalculator.Handle(event)` (2) `PositionUpdater.Handle(event)` (3) `EventStoreWriter.Handle(event)` — ce dernier implémente Event Sourcing. L'Event Store (Kafka + S3) contient tous les événements depuis le début. Rejouer les événements depuis l'Event Store = reconstituer l'état exact à n'importe quel moment — exigence MiFID II."
    },
    {
      "question": "[Adapter + Facade — Integration Pattern] Dans un système d'intégration Bloomberg + Oracle + RiskEngine, comment Adapter et Facade coexistent-ils architecturalement ?",
      "options": [
        "Adapter et Facade ne peuvent pas coexister.",
        "Adapters traduit les interfaces externes (Bloomberg → IMarketDataProvider, Oracle → IRepository). Facade orchestre les appels aux services internes via ces Adapters — Facade = couche d'orchestration, Adapters = couche anti-corruption externe.",
        "La Facade remplace les Adapters.",
        "Les Adapters sont des sous-classes de la Facade."
      ],
      "answer": "Adapters traduit les interfaces externes (Bloomberg → IMarketDataProvider, Oracle → IRepository). Facade orchestre les appels aux services internes via ces Adapters — Facade = couche d'orchestration, Adapters = couche anti-corruption externe.",
      "explanation": "Architecture en couches avec Adapter + Facade : Couche externe → Adapters (BloombergAdapter, OracleAdapter, FIXAdapter) → Couche services internes (PricingService, RiskService, PositionService) → Facade (FermatFacade). Le client Angular appelle la Facade. La Facade appelle les services internes qui dépendent d'interfaces. Les Adapters implémentent ces interfaces pour les systèmes externes. Changement Bloomberg : remplacer BloombergAdapter, Facade inchangée, services internes inchangés."
    },
    {
      "question": "[Builder — Domain Object] Dans DDD (Domain-Driven Design), pourquoi utiliser Builder pour créer un `Aggregate Root` comme `Trade` ?",
      "options": [
        "Builder est obligatoire dans DDD.",
        "L'Aggregate Root Trade a des invariants complexes (notional > 0, contrepartie EMIR eligible, maturité cohérente). Builder valide ces invariants dans `Build()` — jamais de Trade dans un état invalide ne sort du domaine.",
        "Builder garantit la persistance automatique dans Oracle.",
        "Builder remplace le Domain Events dans DDD."
      ],
      "answer": "L'Aggregate Root Trade a des invariants complexes (notional > 0, contrepartie EMIR eligible, maturité cohérente). Builder valide ces invariants dans `Build()` — jamais de Trade dans un état invalide ne sort du domaine.",
      "explanation": "DDD + Builder : Trade est un Aggregate Root avec invariants métier stricts. `TradeBuilder.Build()` applique toutes les règles : `IsEMIREligible(counterparty)`, `IsMarketDay(settlementDate)`, `IsConsistentLegStructure(fixedLeg, floatingLeg)`. Si un invariant est violé, `BuilderException` — le Trade invalide n'existe jamais. Toute création de Trade passe par le Builder — il n'y a pas de constructeur public sur `Trade`."
    },
    {
      "question": "[Decorator vs AOP] Quelle est la relation entre le pattern Decorator et l'AOP (Aspect-Oriented Programming) ?",
      "options": [
        "Ce sont des paradigmes totalement différents.",
        "Le Decorator est une implémentation manuelle de l'AOP — il ajoute des préoccupations transversales (logging, cache, audit) en wrappant l'objet. L'AOP (via Castle DynamicProxy, PostSharp) génère automatiquement des Decorators à la compilation ou à l'exécution.",
        "AOP remplace le Decorator dans les architectures modernes.",
        "Decorator est meilleur que AOP car il est explicite."
      ],
      "answer": "Le Decorator est une implémentation manuelle de l'AOP — il ajoute des préoccupations transversales en wrappant l'objet. L'AOP génère automatiquement des Decorators via proxies dynamiques.",
      "explanation": "Continuité Decorator → AOP : Decorator = code explicite d'interception. AOP = génération automatique. `[Audit]` attribute avec Castle DynamicProxy = génère automatiquement l'Audit Decorator à l'exécution. Dans un OMS Natixis : `[MiFIDCompliant]`, `[RiskChecked]`, `[Audited]` attributes sur les méthodes → AOP génère les Decorators correspondants. Avantage Decorator manuel : lisible, debuggable. Avantage AOP : moins de boilerplate."
    },
    {
      "question": "[Strategy + Observer — Composite] Un `RiskEngine` utilise Strategy pour calculer la VaR et Observer pour notifier en cas de dépassement. Comment les connecter élégamment ?",
      "options": [
        "Ce n'est pas possible de combiner les deux.",
        "`RiskEngine` utilise `IVaRStrategy` pour calculer. Après calcul, si `var > _limit`, publie `OnVaRLimitBreached` event (Observer). La Strategy est interchangeable (Historical, MonteCarlo), les Observers sont extensibles (Email, Kafka, Dashboard). Les deux axes d'extension sont indépendants.",
        "Strategy remplace Observer dans ce contexte.",
        "Observer remplace Strategy — les abonnés implémentent l'algorithme."
      ],
      "answer": "`RiskEngine` utilise `IVaRStrategy` pour calculer. Après calcul, si `var > _limit`, publie `OnVaRLimitBreached` event. Strategy = axe d'extension de l'algorithme. Observer = axe d'extension des réactions. Indépendants.",
      "explanation": "Design orthogonal Strategy + Observer : `var result = _strategy.Compute(portfolio)` — Strategy choisit l'algorithme (Historical/MonteCarlo/Parametric). `if(result.VaR > _limit) OnVaRLimitBreached?.Invoke(new VaRAlert(...))` — Observer notifie les réactions. Changer d'algorithme VaR n'affecte pas les canaux de notification. Ajouter un canal de notification n'affecte pas l'algorithme. Deux axes d'évolution complètement découplés."
    },
    {
      "question": "[All Patterns — Anti-patterns] Un service `GodRiskService` fait : pricing, calcul VaR, mise à jour Oracle, envoi FIX, génération rapports, alertes. Quels patterns devraient être appliqués pour le refactorer ?",
      "options": [
        "Singleton pour avoir une seule instance du GodService.",
        "SRP : extraire Pricing → Strategy, Persistence → Repository, Alertes → Observer, Orchestration → Facade. DI pour injecter le tout. Decorator pour audit/logging. Factory pour créer les stratégies selon le contexte.",
        "Builder pour construire le GodService en plusieurs étapes.",
        "Observer pour que le GodService observe ses propres actions."
      ],
      "answer": "SRP : extraire Pricing → Strategy, Persistence → Repository, Alertes → Observer, Orchestration → Facade. DI pour injecter le tout. Decorator pour audit/logging. Factory pour créer les stratégies selon le contexte.",
      "explanation": "Refactoring God Class → patterns : Pricing = `IPricingStrategy` (Strategy). Persistance = `IRiskRepository` (Repository). Alertes = `OnRiskLimitBreached` event (Observer). Orchestration = `RiskFacade` (Facade). Création de stratégies = `RiskStrategyFactory` (Factory). Audit = `AuditDecorator` wrapping Repository (Decorator). DI inject tout. Résultat : 6 classes/interfaces de 50 lignes chacune vs 1 classe de 500 lignes indéboggable. SRP = chaque classe a UNE raison de changer."
    },
    {
      "question": "[DI + Factory — Keyed Services] En .NET 8+, `services.AddKeyedScoped<IExposureStrategy, SACCRStrategy>('SACCR')` remplace-t-il avantageusement le pattern Factory ?",
      "options": [
        "Oui — KeyedServices rend Factory obsolète.",
        "Partiellement — KeyedServices simplifie la résolution par clé statique (`_serviceProvider.GetKeyedService<IExposureStrategy>('SACCR')`). Factory reste nécessaire pour les clés dynamiques basées sur des données runtime (type de contrepartie lu depuis Oracle).",
        "Non — KeyedServices ne fonctionne qu'avec Singleton.",
        "KeyedServices et Factory sont identiques en .NET 8+."
      ],
      "answer": "Partiellement — KeyedServices simplifie la résolution par clé statique. Factory reste nécessaire pour les clés dynamiques basées sur des données runtime.",
      "explanation": ".NET 8 KeyedServices : `services.AddKeyedScoped<IExposureStrategy, SACCRStrategy>('SACCR')` + `[FromKeyedServices('SACCR')]` dans le constructeur. Simple et élégant pour des clés connues à la compilation. Factory nécessaire quand la clé est une donnée runtime : `var strategyKey = await _repo.GetCounterpartyType(cptyId)` — le type n'est connu qu'à l'exécution. Combinaison optimale : DI configure les stratégies avec clés, Factory orchestre la résolution dynamique."
    }
  ]
};

const Flashcard = ({ slide }) => (
  <div className="flashcard">
    <h3 className="question">{slide.question}</h3>
    <p className="answer" style={{ whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: "1.5" }}
      dangerouslySetInnerHTML={{ __html: slide.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>") }}
    />
  </div>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <div className="timer">⏱ {timeLeft}s</div>
    <h3 className="question" style={{ fontSize: "12px" }}>{question}</h3>
    <div className="options">
      {options.map((opt, i) => (
        <button key={i} className="option-btn" onClick={() => onAnswerClick(opt)}
          style={{ fontSize: "11px", textAlign: "left", padding: "6px 10px", marginBottom: "4px", width: "100%" }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Results = ({ scores }) => (
  <div className="results">
    <h2>🎯 Résultats</h2>
    <p>Niveau Moyen : {scores.moyen} / {questions.moyen.length}</p>
    <p>Niveau Avancé : {scores.avance} / {questions.avance.length}</p>
    <p>Total : {scores.moyen + scores.avance} / {questions.moyen.length + questions.avance.length}</p>
  </div>
);

const Page5_DesignPatterns = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
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
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else {
        handleNextQuestion();
      }
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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
      }, 12000);
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
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            Design Patterns 🔹{" "}
            {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
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
          {message && (
            <p className="message" style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page5_DesignPatterns;
