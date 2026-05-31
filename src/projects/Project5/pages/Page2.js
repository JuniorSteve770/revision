// src/projects/CIBPricing/CIBPricingPreTradeQCM.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — Développeur C# Pricing Pre-Trade / Equity Derivatives CIB",
    "answer": "**Domaine fonctionnel** : Equity Derivatives — options vanilles (Call/Put), produits structurés (Autocall, Barrier), Greeks (Delta/Gamma/Vega/Theta), surface de volatilité implicite, pricing pré-trade. ◆ **Architecture technique** : C#/.NET Framework 4.8 + .NET 8, REST API ASP.NET Core, SQL Server, Sophis/RISQUE comme référentiel, DataSynapse pour le calcul distribué. ◆ **Messaging** : MSMQ (legacy, .NET Framework) et RabbitMQ (moderne, AMQP) pour la communication inter-services. ◆ **Performance** : Multithreading (`Task.WhenAll`, `Parallel.For`, `Channel<T>`), gestion mémoire (Span<T>, ArrayPool, `IDisposable`). ◆ **DevOps** : Azure DevOps pipelines CI/CD, TFS (Team Foundation Server), sécurité API REST (JWT, OAuth2, HTTPS). ◆ **ISIN & Booking** : récupération d'ISIN depuis le référentiel, service de booking via REST API, refactoring et optimisation du référentiel de données."
  },
  {
    "question": "Equity Derivatives — Produits et cycle de vie pré-trade",
    "answer": "**Options vanilles** : Call (droit d'acheter) et Put (droit de vendre) un sous-jacent (action, indice) à un prix fixé (strike) jusqu'à une date d'échéance. Exercice européen (à maturité seulement) ou américain (à tout moment). ◆ **Produits structurés** : Autocall (remboursement anticipé si sous-jacent franchit une barrière à la date d'observation + coupon). Barrier options (activation/désactivation selon un niveau). Capital protected notes. ◆ **Cycle pré-trade** : le trader saisit les paramètres → le système de pricing (MAPS/Sophis) calcule le prix théorique et les Greeks → validation RMS → envoi vers l'OMS. ◆ **ISIN** : International Securities Identification Number — identifiant unique d'un instrument financier (FR0000131104 = BNP Paribas). Prérequis du booking."
  },
  {
    "question": "Greeks — Delta, Gamma, Vega, Theta, Rho",
    "answer": "**Delta (Δ)** : sensibilité du prix de l'option au prix du sous-jacent. `∂V/∂S`. Call Delta ∈ [0,1], Put Delta ∈ [-1,0]. Utilité : delta hedging. ◆ **Gamma (Γ)** : taux de variation du Delta. `∂²V/∂S²`. Mesure la convexité — élevé près du strike à maturité. ◆ **Vega (ν)** : sensibilité au niveau de volatilité implicite. `∂V/∂σ`. Critique pour les desks vol. ◆ **Theta (Θ)** : valeur temps perdue par jour. `∂V/∂t`. Négatif pour les options longues (time decay). ◆ **Rho (ρ)** : sensibilité au taux d'intérêt. `∂V/∂r`. Moins critique en equity. ◆ **Calcul C#** : différences finies — `delta = (Price(S+dS) - Price(S-dS)) / (2*dS)`. Calcul parallèle via `Task.WhenAll`."
  },
  {
    "question": "Black-Scholes — Modèle et implémentation C#",
    "answer": "**Formule** : `C = S·N(d1) - K·e^(-rT)·N(d2)` avec `d1 = (ln(S/K) + (r + σ²/2)T) / σ√T`, `d2 = d1 - σ√T`. ◆ **Inputs** : S (spot), K (strike), r (taux sans risque), σ (volatilité implicite), T (maturité en années). ◆ **Implémentation C#** : `public static class BlackScholes { public static decimal Call(decimal S, decimal K, decimal r, decimal sigma, decimal T) { var d1 = (Math.Log((double)(S/K)) + (double)((r + sigma*sigma/2)*T)) / (double)(sigma*Math.Sqrt((double)T)); var d2 = d1 - (double)(sigma*Math.Sqrt((double)T)); return S * (decimal)NormalCDF(d1) - K * (decimal)Math.Exp(-(double)(r*T)) * (decimal)NormalCDF(d2); } }` ◆ **Limites** : volatilité constante (non respectée en pratique), pas de dividendes (correction Merton). Utilisé comme base de référence et pour extraire la vol implicite."
  },
  {
    "question": "Surface de volatilité implicite — Construction et utilisation",
    "answer": "**Définition** : grille 3D σ(K, T) — volatilité implicite extraite par inversion Black-Scholes pour chaque option cotée sur le marché. Axes : Strike (ou moneyness) × Maturité. ◆ **Construction** : pour chaque option cotée, résoudre `MarketPrice = BlackScholes(S, K, r, σ_impl, T)` par algorithme de Newton-Raphson ou bissection. ◆ **Interpolation C#** : `public decimal GetVol(decimal strike, DateTime expiry) => BilinearInterpolate(_grid, strike, expiry)` — jamais extrapoler sans vérification. ◆ **Smile et skew** : le skew (pente en strike) reflète la prime de risque de baisse. Le smile (forme en U) reflète les queues épaisses. ◆ **Arbitrage-free** : la surface doit respecter les conditions calendar-spread (σ croissante en T) et butterfly-spread (convexité en K). ◆ **Usage** : entrée principale du moteur de pricing MAPS/Sophis."
  },
  {
    "question": "C# — Architecture d'une classe Option avec abstraction et getters filtrés",
    "answer": "**Classe abstraite** : `abstract class BaseOption { protected decimal _strike; protected DateTime _expiry; protected decimal _notional; public abstract decimal Price(MarketData md); public abstract Greeks ComputeGreeks(MarketData md); public decimal Strike => _strike > 0 ? _strike : throw new DomainException(\"Strike must be positive\"); }` ◆ **Getters filtrés** : protègent les invariants métier sans validation externe. `public decimal Notional => _notional > 0 ? _notional : throw new DomainException(\"Notional must be positive\");` ◆ **Implémentations** : `class EuropeanCall : BaseOption`, `class AutocallNote : BaseOption`, `class BarrierOption : BaseOption`. ◆ **Polymorphisme** : `List<BaseOption> book; Parallel.ForEach(book, opt => results.Add(opt.Price(md)));` ◆ **Factory** : `OptionFactory.Create(type, params)` — jamais de `new EuropeanCall()` directement dans les services."
  },
  {
    "question": "REST API ASP.NET Core — Service de booking et récupération d'ISIN",
    "answer": "**Service Booking** : `[ApiController][Route(\"api/v1/booking\")] public class BookingController : ControllerBase { [HttpPost] public async Task<IActionResult> BookTrade([FromBody] BookingRequest req) { var isin = await _isinService.ResolveAsync(req.InstrumentId); var result = await _bookingService.BookAsync(isin, req); return result.IsSuccess ? Ok(result.TradeId) : BadRequest(result.Error); } }` ◆ **Service ISIN** : `public class IsinService : IIsinService { private readonly IMemoryCache _cache; public async Task<string> ResolveAsync(string instrumentId) { return await _cache.GetOrCreateAsync($\"isin:{instrumentId}\", async entry => { entry.SlidingExpiration = TimeSpan.FromMinutes(30); return await _referentielRepo.GetIsinAsync(instrumentId); }); } }` ◆ **Sécurité** : JWT Bearer + HTTPS + validation des inputs. ◆ **Versioning** : `/api/v1/` — backward compatible."
  },
  {
    "question": "Multithreading C# — Patterns pour le Pricing Pre-Trade",
    "answer": "**`Task.WhenAll`** : calcul simultané des Greeks. `await Task.WhenAll(ComputeDeltaAsync(opt, md), ComputeVegaAsync(opt, md), ComputeThetaAsync(opt, md))` — les trois partent en parallèle, résultat quand le plus lent finit. ◆ **`Parallel.For`** : Monte Carlo pour VaR. `Parallel.For(0, N_SIMS, i => { payoffs[i] = SimulatePath(option, md); })` — utilise tous les cœurs CPU. ◆ **`Channel<T>`** : pipeline de pricing lock-free. `Channel<PricingRequest>.Writer.WriteAsync(req)` depuis l'API, `ReadAllAsync()` dans le moteur. ◆ **`ConcurrentDictionary`** : cache thread-safe des vols implicites. `_volCache.GetOrAdd(key, _ => ComputeImpliedVol(key))` ◆ **Règle** : jamais de `.Result` ou `.Wait()` dans un contexte async (deadlock). Jamais de `Thread.Sleep()` dans un hot path."
  },
  {
    "question": "Gestion mémoire C# — Optimisation du référentiel de données",
    "answer": "**`Span<T>` et `Memory<T>`** : manipulation de tableaux sans allocation heap. `Span<double> prices = stackalloc double[100];` — idéal pour les calculs de Greeks sur de petits arrays. ◆ **`ArrayPool<T>`** : réutilisation de buffers pour éviter la pression GC. `var buffer = ArrayPool<double>.Shared.Rent(N_SIMS); try { /* calcul Monte Carlo */ } finally { ArrayPool<double>.Shared.Return(buffer); }` ◆ **`IDisposable` / `using`** : libération des ressources non managées (connexions SQL, streams). `using var conn = new SqlConnection(cs);` ◆ **GC tuning** : `GCSettings.LatencyMode = GCLatencyMode.LowLatency` pendant les fenêtres de marché critiques. ◆ **Object pooling** : `ObjectPool<PricingEngine>` pour les instances coûteuses à créer. ◆ **Struct vs class** : les Greeks (5 doubles) en `struct` évitent l'allocation heap et la pression GC."
  },
  {
    "question": "MSMQ vs RabbitMQ — Messaging dans l'environnement CIB",
    "answer": "**MSMQ (Microsoft Message Queuing)** : legacy Windows, .NET Framework. Messaging transactionnel, persistance locale, pas de broker centralisé. `MessageQueue mq = new MessageQueue(\".\\\\Private$\\\\PricingRequests\"); mq.Send(request);` — déprécié, non cloud-native, difficile à scaler. ◆ **RabbitMQ (AMQP)** : broker centralisé, exchanges et queues découplés, bindings flexibles, acknowledgements, dead-letter queues. `IConnection → IChannel → channel.BasicPublish(exchange, routingKey, body)`. ◆ **Migration MSMQ → RabbitMQ** : abstraction `IMessageBus` injectée — le code métier ne connaît pas l'implémentation. ◆ **Patterns RabbitMQ** : Direct (routage exact), Topic (wildcard), Fanout (broadcast). Dead-letter queue pour les messages en erreur. ◆ **Dans MAPS** : events `PricingRequested`, `GreeksComputed`, `BookingConfirmed` sur des topics dédiés."
  },
  {
    "question": "Sophis RISQUE / DataSynapse — Contexte applicatif",
    "answer": "**Sophis RISQUE** : référentiel de marché et de positions pour les dérivés actions et taux. Stocke les instruments (options, structurés), les trades, les positions, les données de marché (prix, vols). API COM/C# pour l'intégration. Souvent utilisé comme source de vérité pour les ISIN et les caractéristiques des instruments. ◆ **DataSynapse GridServer** : middleware de calcul distribué — répartit les tâches de pricing sur une grille de serveurs de calcul. Le service C# soumet des jobs (`PricingJob`) et récupère les résultats de manière asynchrone. ◆ **Pattern** : `IDataSynapseClient.SubmitJob(job) → jobId → PollResult(jobId) → Greeks[]` ◆ **Alternative moderne** : Azure Batch ou Kubernetes Jobs pour le calcul distribué. ◆ **MAPS** : plateforme de pricing propriétaire intégrant Sophis comme référentiel et DataSynapse pour le calcul."
  },
  {
    "question": "Sécurité API REST — JWT, OAuth2, HTTPS dans le contexte CIB",
    "answer": "**JWT Bearer** : `[Authorize] [HttpPost(\"booking\")] public IActionResult Book(...)` — le middleware ASP.NET Core valide le token à chaque requête. Token contient : userId, desk, rôles (TRADER, RISK, BACKOFFICE), expiration. ◆ **OAuth2 / OpenID Connect** : le trader s'authentifie via l'IdP de la banque (AD FS, Okta). Le token est délégué aux services MAPS. ◆ **HTTPS obligatoire** : toutes les API REST en CIB sont sur TLS 1.2+. ◆ **Autorisation fine** : `[Authorize(Policy = \"CanBook\")] [Authorize(Policy = \"EquityDesk\")]` — un trader actions ne peut pas booker sur le desk taux. ◆ **Validation des inputs** : `[ApiController]` + FluentValidation pour les `BookingRequest`. ◆ **Audit trail** : chaque booking logué avec userId, timestamp, instrument, notional — réglementation MiFID II."
  },
  {
    "question": "Azure DevOps & TFS — Pipelines CI/CD pour MAPS",
    "answer": "**TFS (Team Foundation Server)** : source control legacy de Microsoft (TFVC ou Git), work items, builds. ◆ **Azure DevOps** : évolution cloud de TFS — Repos (Git), Pipelines (CI/CD), Boards (Agile), Artifacts (NuGet). ◆ **Pipeline CI MAPS** : `trigger: [main, release/*] → steps: dotnet restore → dotnet build → dotnet test → publish artifacts`. ◆ **Pipeline CD** : artifacts → déploiement IIS/Kubernetes → smoke tests → validation UAT. ◆ **Multi-target** : `<TargetFrameworks>net48;net8.0</TargetFrameworks>` — compilé pour .NET Framework 4.8 (Sophis legacy) ET .NET 8 (nouveaux services). ◆ **NuGet packages** : référentiels internes pour les librairies partagées (pricing models, messaging abstractions). ◆ **Feature branches** : `feature/booking-rest-api` → PR → code review → merge main → CI automatique."
  },
  {
    "question": "SQL Server — Référentiel de données et optimisation",
    "answer": "**Référentiel instruments** : tables `Instruments` (ISIN, type, sous-jacent, maturité, strike), `MarketData` (spots, taux, divs), `Positions` (desk, trader, quantité), `Trades` (booking, statut, contrepartie). ◆ **Index stratégiques** : `CREATE INDEX IX_Instruments_ISIN ON Instruments(ISIN) INCLUDE (Strike, Maturity, UnderlyingId)` — covering index pour les requêtes de pricing. ◆ **Stored procedures** : `usp_GetInstrumentByISIN` — logique SQL encapsulée, plan d'exécution mis en cache. ◆ **Connection pooling** : `SqlConnection` réutilise les connexions du pool — ne jamais créer de connexion par requête de pricing. ◆ **async/await SQL** : `await conn.QueryAsync<Instrument>(sql, params)` avec Dapper — libère le thread pendant l'I/O. ◆ **ISIN lookup** : `SELECT ISIN FROM Instruments WHERE InternalId = @id` — requête la plus fréquente du service de booking, à mettre en cache Redis ou `IMemoryCache`."
  },
  {
    "question": "Refactoring C# — SOLID appliqué au moteur de pricing",
    "answer": "**SRP** : séparer `PricingEngine` (calcul) de `PricingRepository` (données) de `PricingNotifier` (messaging). ◆ **OCP** : `IPricingModel` injectée — ajouter `HestonModel` sans modifier `PricingEngine`. Pas de `switch(modelType)` dans le moteur. ◆ **LSP** : `BarrierOption : BaseOption` — partout où `BaseOption` est attendue, `BarrierOption` fonctionne sans surprise. ◆ **ISP** : `IPricer` (Price), `IGreeksCalculator` (ComputeGreeks), `ICalibrator` (Calibrate) — interfaces séparées, pas une mega-interface. ◆ **DIP** : le moteur dépend de `IPricingModel`, `IMarketDataRepository`, `IMessageBus` — jamais des classes concrètes. Injection via constructeur. ◆ **Refactoring Sophis** : extraire l'accès Sophis derrière `ISophisAdapter` — testable via mock, remplaçable sans modifier la logique métier."
  },
  {
    "question": "Monte Carlo — Pricing de produits structurés en C#",
    "answer": "**Principe** : simuler N chemins de prix pour le sous-jacent, calculer le payoff sur chaque chemin, actualiser la moyenne. ◆ **Simulation GBM** : `S(t+dt) = S(t) * exp((r - σ²/2)*dt + σ*√dt*Z)` avec Z ~ N(0,1). ◆ **Implémentation C#** : `decimal[] payoffs = new decimal[N]; Parallel.For(0, N, i => { var path = GeneratePath(S0, r, sigma, T, steps); payoffs[i] = payoff.Compute(path); }); decimal price = payoffs.Average() * DiscountFactor(r, T);` ◆ **ArrayPool** : `var buffer = ArrayPool<double>.Shared.Rent(steps)` pour éviter l'allocation de N×steps doubles sur le heap. ◆ **Corrélations** : décomposition de Cholesky pour les options basket (corrélations entre sous-jacents). ◆ **DataSynapse** : les N simulations réparties sur la grille de calcul — chaque nœud traite un batch de chemins."
  },
  {
    "question": "Autocall — Structure, barrières et payoff C#",
    "answer": "**Définition** : produit structuré qui rembourse le capital + coupon si le sous-jacent dépasse un niveau barrière à une date d'observation. Sinon, continue jusqu'à la prochaine date. ◆ **Dates d'observation** : typiquement trimestrielles ou annuelles. Barrière autocall souvent à 100% ou 110% du spot initial. ◆ **Protection capital** : barrière de protection (ex: 60% du spot initial) — si le sous-jacent ne franchit jamais ce niveau, le capital est protégé. ◆ **Payoff C#** : `public decimal ComputePayoff(decimal[] path) { for(int i = 0; i < _obsDates.Length; i++) { if(path[_obsDates[i]] >= _autocallBarrier) return _notional * (1 + _coupon * (i+1)); } if(path.Last() >= _protectionBarrier) return _notional; return _notional * path.Last() / _initialSpot; }` ◆ **Greeks** : Delta négatif si structure protection (short put implicite). Vega élevé. Theta positif (coupon s'accumule). ◆ **Pricing** : Monte Carlo ou PDE selon la complexité."
  },
  {
    "question": "Gestion des erreurs et patterns de résilience en C# CIB",
    "answer": "**Circuit Breaker** : évite les cascades de pannes. `Polly.CircuitBreakerAsync(exceptionsAllowedBeforeBreaking: 5, durationOfBreak: TimeSpan.FromSeconds(30))` — si Sophis est down, le circuit s'ouvre 30s puis tente de récupérer. ◆ **Retry avec backoff** : `Polly.WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)))` — 1s, 2s, 4s. ◆ **Timeout** : `Polly.TimeoutAsync(TimeSpan.FromSeconds(5))` sur les appels Sophis/DataSynapse. ◆ **Fallback** : si le service de volatilité est indisponible, utiliser la dernière surface connue depuis Redis. ◆ **Dead-letter queue** : les messages RabbitMQ en erreur (booking échoué, ISIN introuvable) redirigés vers une DLQ pour analyse et rejeu manuel. ◆ **Structured logging** : `_logger.LogError(ex, \"BookingFailed {TradeId} {ISIN} {Error}\", tradeId, isin, ex.Message)` — Serilog + Elasticsearch."
  },
  {
    "question": ".NET Framework 4.8 vs .NET 8 — Migration et coexistence",
    "answer": "**Contexte MAPS** : .NET Framework 4.8 pour les composants legacy (intégration Sophis COM, MSMQ, libs tierces non migrées). .NET 8 pour les nouveaux services REST API et les composants refactorisés. ◆ **Différences clés** : .NET 8 = cross-platform (Linux containers), performances améliorées (AOT, Span improvements), `IHostedService` natif, `Minimal APIs`. .NET Framework 4.8 = Windows uniquement, pas de Minimal APIs. ◆ **Multi-target** : `<TargetFrameworks>net48;net8.0</TargetFrameworks>` + `#if NET48 / #if NET8_0` pour les différences. ◆ **Migration stratégique** : abstraire l'accès Sophis derrière `ISophisAdapter` → implémenter en .NET Framework 4.8 → le reste du service en .NET 8. ◆ **NuGet** : packages compatibles avec les deux TFMs — vérifier les `<TargetFramework>` dans les dépendances."
  },
  {
    "question": "Patterns d'architecture — Service de récupération d'ISIN",
    "answer": "**Problème** : l'ISIN est nécessaire avant tout booking. Le référentiel Sophis est lent (appel COM, latence réseau). ◆ **Solution Cache-Aside** : `async Task<string> ResolveISINAsync(string internalId) { if(_cache.TryGetValue($\"isin:{internalId}\", out string isin)) return isin; isin = await _sophisAdapter.GetISINAsync(internalId); _cache.Set($\"isin:{internalId}\", isin, TimeSpan.FromHours(4)); return isin; }` ◆ **Cache distribué** : Redis pour partager le cache ISIN entre plusieurs instances du service. `IDistributedCache` ASP.NET Core. ◆ **Invalidation** : les ISIN ne changent pas — TTL long (4h-24h). En cas de modification, event Kafka `ISINUpdated` invalide le cache. ◆ **Fallback** : si Redis est down, `IMemoryCache` local par instance. ◆ **Monitoring** : métriques cache hit/miss ratio via Prometheus/Grafana — objectif > 95% hit rate en période de marché."
  },
  {
    "question": "Tests en environnement CIB — Stratégies et outils",
    "answer": "**Tests unitaires** : `xUnit` + `Moq`. Tester la logique de pricing sans dépendances externes. `var mockRepo = new Mock<IMarketDataRepository>(); mockRepo.Setup(r => r.GetVolAsync(\"BNPP\", It.IsAny<decimal>(), It.IsAny<DateTime>())).ReturnsAsync(0.25m); var engine = new PricingEngine(mockRepo.Object); var price = await engine.PriceAsync(option);` ◆ **Tests d'intégration** : appels réels à SQL Server (base de test), Testcontainers pour RabbitMQ. ◆ **Tests de performance** : BenchmarkDotNet pour mesurer les gains de refactoring. `[Benchmark] public void PriceBook_Sequential()` vs `[Benchmark] public void PriceBook_Parallel()`. ◆ **Tests de contrat** : Pact pour les API REST — le consommateur (OMS) et le producteur (MAPS) partagent un contrat de message. ◆ **Smoke tests** : après déploiement, `GET /health` + `POST /api/v1/pricing/test-option` avec un option de référence."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un ISIN et pourquoi est-il indispensable dans le service de booking d'un desk Equity Derivatives ?",
      "options": [
        "Un identifiant interne à Sophis pour les options.",
        "L'International Securities Identification Number — identifiant unique à 12 caractères d'un instrument financier, prérequis obligatoire pour booker un trade dans le référentiel.",
        "Un code Bloomberg pour les données de marché.",
        "Un identifiant de transaction généré par l'OMS à chaque booking."
      ],
      "answer": "L'International Securities Identification Number — identifiant unique à 12 caractères d'un instrument financier, prérequis obligatoire pour booker un trade dans le référentiel.",
      "explanation": "En CIB Equity Derivatives, chaque instrument (option, structured note) est identifié par son ISIN dans le référentiel (Sophis, Bloomberg). Le service de booking ne peut pas créer un trade sans ISIN valide — c'est le lien entre l'instrument métier et le système de post-trade. La mission décrit explicitement 'mise en place d'un service de récupération d'ISIN nécessaire pour le booking'."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le Delta d'une option et quelle est son utilité pratique pour un trader CIB ?",
      "options": [
        "La valeur actuelle de l'option.",
        "La sensibilité du prix de l'option au prix du sous-jacent — un Delta de 0.5 signifie que si l'action monte de 1€, l'option monte de 0.50€. Utilisé pour le delta hedging.",
        "La durée de vie restante de l'option jusqu'à l'échéance.",
        "Le volume de transactions sur l'option dans la journée."
      ],
      "answer": "La sensibilité du prix de l'option au prix du sous-jacent — un Delta de 0.5 signifie que si l'action monte de 1€, l'option monte de 0.50€. Utilisé pour le delta hedging.",
      "explanation": "Le Delta est le Greek le plus utilisé au quotidien. Un Call a un Delta positif (∈ [0,1]), un Put négatif (∈ [-1,0]). Le delta hedging consiste à acheter/vendre le sous-jacent en proportion du Delta pour neutraliser l'exposition directionnelle. En pré-trade, le Delta calculé par MAPS permet au trader d'évaluer le hedge nécessaire avant d'exécuter l'option."
    },
    {
      "question": "[Définition → Terme] Dans Black-Scholes, le paramètre extrait du prix de marché d'une option (non observable directement) par inversion de la formule s'appelle ?",
      "options": [
        "La volatilité historique (réalisée)",
        "La volatilité implicite",
        "Le taux sans risque",
        "Le dividende implicite"
      ],
      "answer": "La volatilité implicite",
      "explanation": "La volatilité implicite σ_impl est la valeur de σ qui, introduite dans Black-Scholes, reproduit le prix de marché observé. C'est une quantité 'extraite' par inversion numérique (Newton-Raphson, bissection). Contrairement à la volatilité historique (calculée sur les prix passés), elle reflète les anticipations du marché. C'est l'input clé de la surface de volatilité dans MAPS."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre MSMQ et RabbitMQ dans le contexte de l'environnement technique MAPS ?",
      "options": [
        "MSMQ est plus rapide que RabbitMQ dans tous les cas.",
        "MSMQ est un système de messaging Windows legacy (.NET Framework, local), RabbitMQ est un broker AMQP moderne (centralisé, cloud-native, scalable, dead-letter queues).",
        "RabbitMQ est uniquement utilisé pour les bases de données.",
        "MSMQ supporte le pattern pub/sub, RabbitMQ non."
      ],
      "answer": "MSMQ est un système de messaging Windows legacy (.NET Framework, local), RabbitMQ est un broker AMQP moderne (centralisé, cloud-native, scalable, dead-letter queues).",
      "explanation": "Dans la mission MAPS : MSMQ est le système historique (.NET Framework 4.8, Windows uniquement, pas de broker centralisé, difficile à monitorer et scaler). RabbitMQ est l'évolution — broker centralisé AMQP, exchanges/queues flexibles, dead-letter queues pour les messages en erreur, monitoring via plugin de management. La coexistence des deux est typique d'une migration progressive."
    },
    {
      "question": "[Caractéristiques → Concept] `abstract decimal Price()`, `EuropeanCall : BaseOption`, `BarrierOption : BaseOption`, `Parallel.ForEach(book, opt => opt.Price(md))`. Quel mécanisme C# est indispensable ici ?",
      "options": [
        "Encapsulation uniquement — les données sont privées.",
        "Polymorphisme — un même appel `opt.Price(md)` exécute la formule correcte selon le type réel de l'option, sans switch/case.",
        "Singleton — une seule instance du moteur de pricing.",
        "Sérialisation JSON des options dans la queue."
      ],
      "answer": "Polymorphisme — un même appel `opt.Price(md)` exécute la formule correcte selon le type réel de l'option, sans switch/case.",
      "explanation": "Le polymorphisme est fondamental dans un moteur de pricing hétérogène : un book contient des calls, des puts, des barriers, des autocalls. Avec `List<BaseOption>`, le `Parallel.ForEach` appelle `Price()` sur chaque option — chacune exécute sa propre formule (Black-Scholes pour EuropeanCall, PDE pour BarrierOption, Monte Carlo pour Autocall). Sans polymorphisme, le code serait un `switch(opt.Type)` impossible à maintenir."
    },
    {
      "question": "[Définition → Terme] Dans ASP.NET Core, quel attribut protège un endpoint de booking contre les accès non authentifiés ?",
      "options": [
        "`[HttpPost]`",
        "`[Authorize]` — vérifie la présence d'un token JWT valide avant d'exécuter la méthode.",
        "`[ApiController]`",
        "`[Route]`"
      ],
      "answer": "`[Authorize]` — vérifie la présence d'un token JWT valide avant d'exécuter la méthode.",
      "explanation": "En C# ASP.NET Core, `[Authorize]` active le middleware d'authentification sur cet endpoint. Sans token JWT valide dans le header `Authorization: Bearer <token>`, le serveur répond 401 Unauthorized. On peut affiner : `[Authorize(Roles = \"TRADER\")]` ou `[Authorize(Policy = \"CanBookEquity\")]` pour une autorisation granulaire par desk ou rôle. Indispensable sur tous les endpoints de booking en CIB (réglementation MiFID II)."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que `Task.WhenAll` et en quoi améliore-t-il le calcul de Greeks dans un moteur de pricing C# ?",
      "options": [
        "Il exécute les tâches une par une dans l'ordre.",
        "Il lance toutes les tâches simultanément et attend que la dernière soit terminée — les Greeks (Delta, Vega, Theta) sont calculés en parallèle, réduisant la latence totale à celle du calcul le plus lent.",
        "Il annule les tâches si l'une d'elles échoue.",
        "Il répartit les tâches sur les nœuds DataSynapse automatiquement."
      ],
      "answer": "Il lance toutes les tâches simultanément et attend que la dernière soit terminée — les Greeks (Delta, Vega, Theta) sont calculés en parallèle, réduisant la latence totale à celle du calcul le plus lent.",
      "explanation": "Sans `Task.WhenAll` : Delta(1ms) + Vega(1ms) + Theta(1ms) = 3ms séquentiel. Avec `Task.WhenAll` : 1ms total (le plus lent). Sur un book de 500 options avec 5 Greeks chacune, le gain est ×5. `Task.WhenAll` est adapté aux opérations I/O-bound ou à la parallélisation logique légère — pour le CPU-bound pur (Monte Carlo 100k simulations), `Parallel.For` est plus adapté."
    },
    {
      "question": "[Caractéristiques → Concept] Un service C# garde en cache les ISIN avec un TTL de 4h dans `IMemoryCache` et retombe sur Sophis en cas de miss. Quel pattern est utilisé ?",
      "options": [
        "Write-through cache",
        "Cache-aside (lazy loading) — le cache est peuplé à la demande uniquement lors d'un miss, sans écriture anticipée.",
        "Read-through cache",
        "Event-driven invalidation"
      ],
      "answer": "Cache-aside (lazy loading) — le cache est peuplé à la demande uniquement lors d'un miss, sans écriture anticipée.",
      "explanation": "Cache-aside : l'application gère le cache elle-même. 1) Lire le cache — si hit, retourner. 2) Si miss, lire Sophis. 3) Écrire dans le cache avec TTL. 4) Retourner. Avantage : simple, le cache ne contient que les données réellement demandées. Pour les ISIN (stables, peu changeants), TTL de 4h est raisonnable. Alternative : write-through (écriture simultanée cache + DB) — plus complexe mais cohérence immédiate."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que `ArrayPool<T>` et pourquoi est-il critique dans un service de Monte Carlo C# à haute fréquence ?",
      "options": [
        "Un tableau fixe alloué une fois au démarrage de l'application.",
        "Un mécanisme de réutilisation de buffers pré-alloués — évite les allocations répétées sur le heap et réduit la pression sur le Garbage Collector pendant les calculs Monte Carlo.",
        "Un pool de connexions SQL pour les accès au référentiel.",
        "Une structure de données thread-safe pour les Greeks concurrents."
      ],
      "answer": "Un mécanisme de réutilisation de buffers pré-alloués — évite les allocations répétées sur le heap et réduit la pression sur le Garbage Collector pendant les calculs Monte Carlo.",
      "explanation": "Monte Carlo : N=100 000 simulations, chaque chemin nécessite un tableau de 252 doubles (trading days). Sans ArrayPool : 100 000 × 252 × 8 bytes = 200MB alloués et collectés à chaque pricing → GC pressure → pauses GC → latence imprévisible. Avec `ArrayPool<double>.Shared.Rent(252)` + `Return()` : les buffers sont réutilisés — allocation proche de zéro en régime permanent. Critique en CIB où la latence de pricing doit être déterministe."
    },
    {
      "question": "[Erreur contextuelle] Un développeur appelle `sophisAdapter.GetISIN(internalId)` (appel synchrone, 150ms) directement dans le thread de traitement des requêtes HTTP de l'API de booking. Quel problème ?",
      "options": [
        "Aucun — 150ms est acceptable.",
        "Le thread HTTP est bloqué 150ms par requête — à 100 req/sec, 15 threads bloqués en permanence. L'API devient non-scalable et les requêtes s'accumulent. Correction : `await sophisAdapter.GetISINAsync(internalId)`.",
        "Sophis ne supporte pas les appels depuis ASP.NET Core.",
        "L'ISIN retourné sera incorrect si l'appel est async."
      ],
      "answer": "Le thread HTTP est bloqué 150ms par requête — à 100 req/sec, 15 threads bloqués en permanence. L'API devient non-scalable et les requêtes s'accumulent. Correction : `await sophisAdapter.GetISINAsync(internalId)`.",
      "explanation": "Thread starvation en ASP.NET Core : le pool de threads HTTP est limité. Un appel synchrone de 150ms monopolise le thread entier. `async/await` libère le thread pendant l'attente I/O — le thread peut traiter d'autres requêtes. Correction complète : `await sophisAdapter.GetISINAsync(id)` + cache Redis pour éviter l'appel Sophis à chaque requête (hit rate > 95% en période de marché)."
    },
    {
      "question": "[Définition → Terme] Dans le cadre du refactoring du moteur de pricing, quel principe SOLID garantit qu'ajouter un nouveau modèle (ex: Heston) ne nécessite aucune modification du `PricingEngine` existant ?",
      "options": [
        "SRP — Single Responsibility Principle",
        "OCP — Open/Closed Principle : ouvert à l'extension (nouvelle classe `HestonModel : IPricingModel`), fermé à la modification (PricingEngine inchangé).",
        "LSP — Liskov Substitution Principle",
        "DIP — Dependency Inversion Principle"
      ],
      "answer": "OCP — Open/Closed Principle : ouvert à l'extension (nouvelle classe `HestonModel : IPricingModel`), fermé à la modification (PricingEngine inchangé).",
      "explanation": "OCP est crucial dans un moteur de pricing CIB : les modèles évoluent (Black-Scholes → Heston → SABR → Bergomi). Sans OCP, chaque nouveau modèle modifie le `PricingEngine` central — risque de régression sur tous les produits existants. Avec `IPricingModel` injectée et OCP : créer `HestonModel : IPricingModel`, enregistrer dans le DI container, zéro modification du moteur. La mission 'refactoring du code' vise exactement cet objectif."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'une dead-letter queue dans RabbitMQ et quel cas d'usage couvre-t-elle en CIB ?",
      "options": [
        "Une queue pour les messages urgents à traiter en priorité.",
        "Une queue de destination pour les messages rejetés ou expirés — un booking échoué (ISIN invalide, limite dépassée) est redirigé vers la DLQ pour analyse et rejeu manuel.",
        "Une queue archivée pour l'audit réglementaire MiFID II.",
        "Une queue de backup en cas de panne du broker principal."
      ],
      "answer": "Une queue de destination pour les messages rejetés ou expirés — un booking échoué (ISIN invalide, limite dépassée) est redirigé vers la DLQ pour analyse et rejeu manuel.",
      "explanation": "En CIB, un message de booking peut échouer pour plusieurs raisons : ISIN introuvable dans Sophis, limite de risque dépassée, timeout de DataSynapse. Sans DLQ, le message serait perdu silencieusement. Avec une DLQ configurée : le message rejeté est routé vers `booking.dead-letter` avec les métadonnées d'erreur. L'équipe support peut analyser, corriger l'anomalie et rejouer le message. Essentiel pour la traçabilité réglementaire."
    },
    {
      "question": "[Caractéristiques → Concept] `Polly.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30))` autour des appels Sophis. Quel problème architectural résout ce pattern ?",
      "options": [
        "Il améliore les performances des appels Sophis.",
        "Il évite la cascade de pannes — si Sophis est down, le circuit s'ouvre après 5 erreurs et rejette immédiatement les appels suivants 30s. Le service MAPS reste disponible avec des données dégradées.",
        "Il compresse les données échangées avec Sophis.",
        "Il garantit que les appels Sophis sont toujours synchrones."
      ],
      "answer": "Il évite la cascade de pannes — si Sophis est down, le circuit s'ouvre après 5 erreurs et rejette immédiatement les appels suivants 30s. Le service MAPS reste disponible avec des données dégradées.",
      "explanation": "Circuit breaker dans un contexte CIB : Sophis/DataSynapse sont des dépendances critiques mais potentiellement instables (redémarrages, maintenances). Sans circuit breaker, chaque appel échoue après son timeout (ex: 5s) — si 100 req/sec, 100 threads bloqués 5s = 500 threads occupés → saturation totale. Avec le circuit breaker : après 5 erreurs, rejet immédiat (< 1ms) pendant 30s → le service reste opérationnel en mode dégradé (fallback sur cache Redis)."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `.NET Framework 4.8` et `.NET 8` dans le contexte de la mission MAPS, et pourquoi les deux coexistent-ils ?",
      "options": [
        "Ce sont des versions identiques avec un numéro de build différent.",
        ".NET Framework 4.8 = Windows uniquement, nécessaire pour Sophis COM et MSMQ legacy. .NET 8 = cross-platform, performant, pour les nouveaux services REST API. Coexistence pendant la migration progressive.",
        ".NET 8 ne supporte pas SQL Server.",
        ".NET Framework 4.8 est uniquement pour les tests, .NET 8 pour la production."
      ],
      "answer": ".NET Framework 4.8 = Windows uniquement, nécessaire pour Sophis COM et MSMQ legacy. .NET 8 = cross-platform, performant, pour les nouveaux services REST API. Coexistence pendant la migration progressive.",
      "explanation": "Réalité terrain en CIB : Sophis expose une API COM (Windows uniquement) et MSMQ est natif .NET Framework. Impossible de migrer en un coup. La stratégie multi-target (`<TargetFrameworks>net48;net8.0</TargetFrameworks>`) compile les deux versions. Les abstractions (`ISophisAdapter`) permettent d'isoler le code .NET Framework 4.8 derrière une interface — le reste du service tourne en .NET 8. La mission mentionne explicitement les deux versions."
    },
    {
      "question": "[Erreur contextuelle] Un développeur déclare `public Dictionary<string, decimal> VolCache = new Dictionary<string, decimal>();` comme champ statique public dans le service de pricing C# multithreadé. Quelles violations ?",
      "options": [
        "Aucune violation — static est plus performant.",
        "Race condition (Dictionary non thread-safe sous lectures/écritures concurrentes) + Encapsulation rompue (public mutable) + Singleton mal contrôlé. Correction : `private readonly ConcurrentDictionary<string, decimal> _volCache`.",
        "Seul problème : le champ aurait dû être `readonly`.",
        "La performance est insuffisante — utiliser `Hashtable` à la place."
      ],
      "answer": "Race condition (Dictionary non thread-safe sous lectures/écritures concurrentes) + Encapsulation rompue (public mutable) + Singleton mal contrôlé. Correction : `private readonly ConcurrentDictionary<string, decimal> _volCache`.",
      "explanation": "3 violations critiques en CIB multithreadé : (1) `Dictionary<K,V>` : sous `Parallel.ForEach`, les lectures/écritures concurrentes corrompent la structure interne → exception ou données silencieusement incorrectes. Solution : `ConcurrentDictionary`. (2) `public` mutable : n'importe quel service modifie le cache directement. (3) `static` : cycle de vie non contrôlé. Sur un desk options, une volatilité corrompue dans le cache signifie des prix incorrects → pertes potentielles."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que Sophis RISQUE dans l'environnement CIB de la mission MAPS et quel rôle joue-t-il ?",
      "options": [
        "Un outil de CI/CD pour déployer les services de pricing.",
        "Un référentiel de marché et de positions pour les dérivés — stocke les instruments (ISIN, strike, maturité), les trades bookés et les données de marché. Source de vérité pour le service de récupération d'ISIN.",
        "Un framework de tests pour les modèles de pricing C#.",
        "Un protocole de messaging pour remplacer RabbitMQ."
      ],
      "answer": "Un référentiel de marché et de positions pour les dérivés — stocke les instruments (ISIN, strike, maturité), les trades bookés et les données de marché. Source de vérité pour le service de récupération d'ISIN.",
      "explanation": "Sophis RISQUE (maintenant Finastra) est un PGRM (Progiciel de Gestion des Risques de Marché) standard en CIB pour les dérivés. Il centralise : le référentiel d'instruments (chaque option a un ISIN dans Sophis), les positions courantes, les données de marché (spots, vols, taux). Le service de récupération d'ISIN de la mission interroge Sophis via son API COM/C# pour résoudre un identifiant interne en ISIN standard."
    },
    {
      "question": "[Terme → Définition] Dans Azure DevOps, quelle est la différence entre CI (Continuous Integration) et CD (Continuous Deployment) dans le pipeline MAPS ?",
      "options": [
        "CI et CD sont deux noms pour la même chose.",
        "CI = build + tests automatisés déclenchés à chaque commit. CD = déploiement automatique en staging/production si CI passe. Pipeline complet : commit → CI → artefacts → CD → environnement.",
        "CI est pour les tests, CD est pour la documentation.",
        "CI nécessite TFS, CD nécessite Azure DevOps — ils ne peuvent pas coexister."
      ],
      "answer": "CI = build + tests automatisés déclenchés à chaque commit. CD = déploiement automatique en staging/production si CI passe. Pipeline complet : commit → CI → artefacts → CD → environnement.",
      "explanation": "Dans le contexte MAPS (mention explicite Azure DevOps dans la mission) : CI garantit que chaque commit ne casse pas le build ni les tests — détection immédiate des régressions. CD automatise le déploiement des artefacts validés vers les environnements (UAT, production). La mention 'bases des pipeline Azure DevOps et MAPS' indique une connaissance attendue des deux. TFS est l'ancienne version on-premise, Azure DevOps est le successeur cloud."
    },
    {
      "question": "[Caractéristiques → Concept] Un book d'options avec 500 instruments est revalurisé avec `Parallel.ForEach(book, opt => results.Add(opt.Price(md)))`. Pourquoi `ConcurrentBag<decimal>` est-il nécessaire à la place de `List<decimal>` ?",
      "options": [
        "`ConcurrentBag` est plus rapide que `List` dans tous les cas.",
        "`List<decimal>` n'est pas thread-safe — des ajouts simultanés corrompent la structure interne. `ConcurrentBag<decimal>` garantit des ajouts thread-safe sous `Parallel.ForEach`.",
        "`List<decimal>` ne supporte pas les types `decimal` en mode parallèle.",
        "`ConcurrentBag` maintient l'ordre des éléments, `List` non."
      ],
      "answer": "`List<decimal>` n'est pas thread-safe — des ajouts simultanés corrompent la structure interne. `ConcurrentBag<decimal>` garantit des ajouts thread-safe sous `Parallel.ForEach`.",
      "explanation": "`List<T>` : `Add()` n'est pas atomique (resize interne, index non synchronisé). Sous `Parallel.ForEach` : deux threads qui `Add()` simultanément peuvent écrire au même index ou corrompre le resize. `ConcurrentBag<T>` utilise des structures lock-free adaptées au producteur/consommateur multi-thread. Attention : `ConcurrentBag` ne garantit pas l'ordre — si l'ordre importait (pour associer option[i] à result[i]), utiliser un tableau pré-alloué `decimal[] results = new decimal[book.Count]` et indexer par `i`."
    },
    {
      "question": "[Erreur contextuelle] Dans un pipeline Azure DevOps, un développeur commit directement sur `main` sans passer par une Pull Request. Quel problème dans un contexte CIB ?",
      "options": [
        "Aucun problème — commit direct est plus rapide.",
        "Absence de code review (risque de bug en production), contournement des tests CI obligatoires, violation des politiques de ségrégation des rôles imposées par la compliance bancaire.",
        "Le pipeline Azure DevOps ne supporte pas les commits directs sur main.",
        "La seule contrainte est qu'il faut un build tag sur le commit."
      ],
      "answer": "Absence de code review (risque de bug en production), contournement des tests CI obligatoires, violation des politiques de ségrégation des rôles imposées par la compliance bancaire.",
      "explanation": "En CIB, les politiques de développement sont strictes pour des raisons réglementaires (SOX, MiFID II) : les branches protégées sur `main` exigent une PR avec approbation, les tests CI doivent passer, et il doit y avoir une ségrégation entre le développeur et l'approbateur. Un bug direct en production sur un service de booking peut générer des trades incorrects — impact financier et réglementaire. Azure DevOps Branch Policies enforce ces règles : minimum reviewers, build validation obligatoire."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le Vega d'une option et pourquoi est-il particulièrement critique pour un desk de structurés CIB ?",
      "options": [
        "La vitesse d'exécution du calcul de pricing.",
        "La sensibilité du prix de l'option à la volatilité implicite — un Vega positif signifie que si la vol monte de 1%, le prix de l'option monte d'une valeur égale au Vega.",
        "Le volume de notionnel en euros du portefeuille d'options.",
        "La sensibilité au taux d'intérêt à court terme."
      ],
      "answer": "La sensibilité du prix de l'option à la volatilité implicite — un Vega positif signifie que si la vol monte de 1%, le prix de l'option monte d'une valeur égale au Vega.",
      "explanation": "Le Vega est critique pour les desks de structurés car les autocalls et produits à barrière ont des Vega importants — leur prix est très sensible à la surface de volatilité. Un changement de surface (vol spike, crise de marché) impacte massivement le P&L. Le desk doit monitorer son exposition Vega agrégée et la hedger via des options vanilla. En pré-trade, MAPS calcule le Vega du nouveau deal pour que le trader évalue l'impact sur son book existant."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `IMemoryCache` et `IDistributedCache` dans ASP.NET Core pour le service d'ISIN ?",
      "options": [
        "Ce sont deux interfaces identiques avec des noms différents.",
        "`IMemoryCache` = cache en mémoire locale de l'instance (non partagé). `IDistributedCache` = cache partagé entre toutes les instances (Redis) — nécessaire si plusieurs instances du service de booking tournent en parallèle.",
        "`IDistributedCache` est plus lent mais plus fiable que `IMemoryCache`.",
        "`IMemoryCache` nécessite Redis, `IDistributedCache` est local."
      ],
      "answer": "`IMemoryCache` = cache en mémoire locale de l'instance (non partagé). `IDistributedCache` = cache partagé entre toutes les instances (Redis) — nécessaire si plusieurs instances du service de booking tournent en parallèle.",
      "explanation": "En déploiement multi-instance (load balancing) : `IMemoryCache` local → chaque instance a son propre cache ISIN → si l'instance 1 a résolu un ISIN, l'instance 2 doit re-interroger Sophis → appels redondants et incohérences potentielles. `IDistributedCache` (Redis) → toutes les instances partagent le même cache → un seul appel Sophis pour chaque ISIN, même avec 10 instances. En CIB, les services critiques tournent souvent en mode haute disponibilité avec plusieurs instances."
    }
  ],
  avance: [
    {
      "question": "[Concept → Pattern] Comment implémenter le service `IIsinService` en respectant DIP et en garantissant la testabilité dans le contexte MAPS ?",
      "options": [
        "Instancier directement `new SophisAdapter()` dans le constructeur du service.",
        "Injecter `ISophisAdapter` par constructeur, implémenter `IIsinService` avec cache-aside, mocker `ISophisAdapter` dans les tests — le service ne connaît pas Sophis directement.",
        "Accéder à Sophis via un champ statique partagé entre tous les services.",
        "Utiliser `ServiceLocator.GetService<ISophisAdapter>()` à l'intérieur de la méthode."
      ],
      "answer": "Injecter `ISophisAdapter` par constructeur, implémenter `IIsinService` avec cache-aside, mocker `ISophisAdapter` dans les tests — le service ne connaît pas Sophis directement.",
      "explanation": "DIP appliqué au service ISIN : `public class IsinService : IIsinService { private readonly ISophisAdapter _sophis; private readonly IDistributedCache _cache; public IsinService(ISophisAdapter sophis, IDistributedCache cache) { _sophis = sophis; _cache = cache; } }`. Test unitaire : `new IsinService(Mock<ISophisAdapter>().Object, Mock<IDistributedCache>().Object)` — Sophis n'est pas instancié. La mission 'refactoring du code' vise exactement cette inversion de dépendance pour découpler du Sophis réel."
    },
    {
      "question": "[Refactoring + Performance] Le service de référentiel SQL exécute une requête `SELECT * FROM Instruments` à chaque appel de pricing (200ms, 50k lignes). Comment optimiser ?",
      "options": [
        "Migrer la table vers MongoDB pour des lectures plus rapides.",
        "Index covering sur les colonnes de filtrage (`ISIN`, `UnderlyingId`) + `SELECT` uniquement les colonnes nécessaires + cache Redis avec TTL (données stables) + `async/await` pour libérer les threads pendant l'I/O SQL.",
        "Augmenter le timeout SQL de 30s à 120s.",
        "Utiliser `Parallel.ForEach` sur les résultats SQL."
      ],
      "answer": "Index covering sur les colonnes de filtrage (`ISIN`, `UnderlyingId`) + `SELECT` uniquement les colonnes nécessaires + cache Redis avec TTL (données stables) + `async/await` pour libérer les threads pendant l'I/O SQL.",
      "explanation": "Optimisation du référentiel (mission explicite) : (1) `SELECT *` → `SELECT ISIN, Strike, Maturity, UnderlyingId` — réduction du payload réseau et utilisation possible d'un covering index. (2) Index : `CREATE INDEX IX_Instruments_ISIN ON Instruments(ISIN) INCLUDE(Strike, Maturity)` — O(log n) au lieu de full scan. (3) Cache Redis : les instruments ne changent pas en intraday — TTL de 4h, un seul appel SQL par ISIN. (4) `await conn.QueryAsync()` (Dapper) — libère les threads HTTP pendant l'I/O. Combinaison : 200ms → < 1ms (cache hit)."
    },
    {
      "question": "[Anti-pattern + Multithreading] Un développeur utilise `lock(this)` dans la méthode `Price()` d'une `EuropeanCall` pour protéger l'accès à la `VolatilitySurface`. Quelle violation commet-il ?",
      "options": [
        "Aucune — `lock(this)` est la bonne pratique pour la thread-safety.",
        "`lock(this)` dans `Price()` sérialise toutes les évaluations parallèles — le gain de `Parallel.ForEach` est annulé. Solution : `VolatilitySurface` immutable lue sans lock par N threads simultanément.",
        "Le lock doit être sur la `VolatilitySurface`, pas sur `this`.",
        "Il faut utiliser `SemaphoreSlim` à la place de `lock`."
      ],
      "answer": "`lock(this)` dans `Price()` sérialise toutes les évaluations parallèles — le gain de `Parallel.ForEach` est annulé. Solution : `VolatilitySurface` immutable lue sans lock par N threads simultanément.",
      "explanation": "Anti-pattern classique en moteur de pricing : `lock(this)` dans `Price()` → toutes les options du book s'exécutent séquentiellement, éliminant le bénéfice du parallélisme. Solution correcte : rendre `VolatilitySurface` immutable (pattern Immutable Object). À chaque recalibration, créer une nouvelle instance et swapper atomiquement (`Interlocked.Exchange`). Les lectures parallèles sur une instance immutable sont thread-safe sans lock — zéro contention. Performance : book de 500 options → calcul ×32 plus rapide sur un serveur 32 cœurs."
    },
    {
      "question": "[Code → Identification] `channel.BasicPublish(exchange: \"pricing\", routingKey: \"greeks.computed\", body: Encoding.UTF8.GetBytes(JsonSerializer.Serialize(greeks)))`. Quel pattern d'architecture illustre ce code RabbitMQ ?",
      "options": [
        "Request-Response synchrone entre deux services.",
        "Event-Driven Architecture — le service de pricing publie un événement `GreeksComputed` sur RabbitMQ, découplant le producteur (calcul) des consommateurs (blotter, RMS, PMS).",
        "Batch processing — les Greeks sont accumulés avant d'être envoyés.",
        "Circuit breaker — le message est envoyé seulement si RabbitMQ est disponible."
      ],
      "answer": "Event-Driven Architecture — le service de pricing publie un événement `GreeksComputed` sur RabbitMQ, découplant le producteur (calcul) des consommateurs (blotter, RMS, PMS).",
      "explanation": "EDA appliqué au pricing CIB : le service MAPS calcule les Greeks et publie `greeks.computed` sur l'exchange RabbitMQ. Le blotter React s'abonne et rafraîchit l'affichage. Le RMS s'abonne et recalcule les limites de risque. Le PMS s'abonne et met à jour les positions. Chaque consommateur est indépendant — si le blotter est down, le RMS continue. Le routingKey `greeks.computed` permet aux consumers de filtrer les événements qui les intéressent. Ce découplage est fondamental dans une architecture microservices CIB."
    },
    {
      "question": "[Situation → Architecture] Le service de booking reçoit la même requête deux fois à cause d'un retry réseau (timeout de 5s). Comment garantir qu'un seul trade est créé dans Sophis ?",
      "options": [
        "Utiliser un `lock` autour de l'appel Sophis.",
        "Idempotency-Key : le client génère un UUID par intention de booking, le service vérifie en base si cette clé existe déjà — si oui, retourner le résultat précédent sans re-booker dans Sophis.",
        "Configurer le timeout réseau à 30s pour éviter les retries.",
        "Utiliser `Parallel.For` pour détecter les doublons."
      ],
      "answer": "Idempotency-Key : le client génère un UUID par intention de booking, le service vérifie en base si cette clé existe déjà — si oui, retourner le résultat précédent sans re-booker dans Sophis.",
      "explanation": "Idempotence de l'API booking CIB : un double booking dans Sophis = deux trades réels dans le référentiel → erreur de position, impactant le P&L et les limites de risque. Pattern : `POST /api/v1/booking` avec header `Idempotency-Key: uuid`. Le service stocke `(key → tradeId)` en base. Retry avec la même clé → retourne le tradeId déjà créé. Clé différente → nouveau trade. TTL 24h pour les clés. Critique pour tous les endpoints de mutation en CIB."
    },
    {
      "question": "[Thème A → Thème B] Comment le principe `ISP` (Interface Segregation) s'applique-t-il lors du refactoring de l'interface monolithique `ISophisService` qui expose 30 méthodes ?",
      "options": [
        "Garder l'interface monolithique — plus simple à maintenir.",
        "Décomposer en interfaces spécialisées : `ISophisInstrumentRepository` (GetISIN, GetInstrument), `ISophisMarketDataProvider` (GetSpot, GetVol), `ISophisBookingService` (BookTrade) — chaque service dépend uniquement de l'interface qu'il utilise.",
        "Supprimer toutes les interfaces et accéder à Sophis directement.",
        "Créer une interface héritant de toutes les autres."
      ],
      "answer": "Décomposer en interfaces spécialisées : `ISophisInstrumentRepository` (GetISIN, GetInstrument), `ISophisMarketDataProvider` (GetSpot, GetVol), `ISophisBookingService` (BookTrade) — chaque service dépend uniquement de l'interface qu'il utilise.",
      "explanation": "ISP appliqué au refactoring Sophis : une interface de 30 méthodes force chaque service à dépendre de méthodes inutilisées. Le service ISIN n'a besoin que de `GetISIN` et `GetInstrument`. Le service de pricing n'a besoin que de `GetSpot` et `GetVol`. En test unitaire : mocker `ISophisInstrumentRepository` (2 méthodes) est trivial ; mocker `ISophisService` (30 méthodes) est un cauchemar. ISP réduit le couplage, simplifie les tests et rend explicites les dépendances de chaque service."
    },
    {
      "question": "[Situation → Multi-concepts] Un service de pricing MAPS recalcule la surface de volatilité toutes les 30 secondes via DataSynapse, publie sur RabbitMQ, et un service de booking lit la dernière surface depuis Redis avant de pricer. Identifiez les patterns.",
      "options": [
        "CRUD + REST + SQL",
        "Calcul distribué (DataSynapse) + EDA (RabbitMQ publish) + Cache-aside (Redis lecture) + Eventual consistency (délai propagation vol surface) + Immutable Value Object (surface immuable)",
        "Singleton + Factory + Observer",
        "Blue-green deployment + CI/CD + HTTPS"
      ],
      "answer": "Calcul distribué (DataSynapse) + EDA (RabbitMQ publish) + Cache-aside (Redis lecture) + Eventual consistency (délai propagation vol surface) + Immutable Value Object (surface immuable)",
      "explanation": "Analyse multi-patterns : DataSynapse = calcul distribué sur grille de serveurs (parallélisme massif pour la calibration). RabbitMQ publish = EDA, les consumers (booking, risk) reçoivent l'update sans polling. Redis = cache-aside pour la lecture rapide de la surface. Eventual consistency : entre la calibration et la mise à jour Redis, il y a un délai — le service de booking peut pricer avec une surface légèrement périmée (acceptable si < 30s). Immutable Object : une fois créée, la surface n'est jamais modifiée — thread-safety sans lock."
    },
    {
      "question": "[Anti-pattern + .NET] Un service ASP.NET Core utilise `HttpContext.Current` pour récupérer l'identité du trader dans une méthode appelée par `Parallel.ForEach`. Quel problème ?",
      "options": [
        "Aucun — `HttpContext.Current` est thread-safe.",
        "`HttpContext.Current` est un static context lié au thread de la requête HTTP — sous `Parallel.ForEach`, les threads de travail n'ont pas ce contexte. Il retourne null ou le mauvais contexte. Solution : capturer `HttpContext` en dehors et le passer explicitement.",
        "Le problème est uniquement de performance.",
        "`HttpContext.Current` n'existe pas dans .NET 8."
      ],
      "answer": "`HttpContext.Current` est un static context lié au thread de la requête HTTP — sous `Parallel.ForEach`, les threads de travail n'ont pas ce contexte. Il retourne null ou le mauvais contexte. Solution : capturer `HttpContext` en dehors et le passer explicitement.",
      "explanation": "Anti-pattern critique en CIB : l'identité du trader est nécessaire pour l'audit trail MiFID II et les vérifications d'autorisation. `HttpContext.Current` (pattern .NET Framework) est un ambient context stocké dans le TLS (Thread Local Storage) du thread de la requête. Sous `Parallel.ForEach`, les worker threads n'ont pas ce TLS. Solution : `var userId = User.Identity.Name;` dans le controller (thread HTTP), puis passer `userId` explicitement aux méthodes parallèles. En .NET 8/ASP.NET Core : `IHttpContextAccessor` injecté (thread-safe avec `AsyncLocal`)."
    },
    {
      "question": "[Refactoring + Architecture] Le service de pricing appelle synchroniquement le service de booking, le service de risk et le service de position après chaque calcul. La latence totale est 800ms. Comment refactoriser ?",
      "options": [
        "Augmenter le timeout à 2000ms.",
        "Remplacer les appels synchrones chaînés par la publication d'un événement `PricingCompleted` sur RabbitMQ — booking, risk et position consomment de façon asynchrone et indépendante. Latence réduite à celle du calcul seul.",
        "Utiliser `Task.WhenAll` sur les 3 appels synchrones.",
        "Migrer vers gRPC pour réduire la latence des appels."
      ],
      "answer": "Remplacer les appels synchrones chaînés par la publication d'un événement `PricingCompleted` sur RabbitMQ — booking, risk et position consomment de façon asynchrone et indépendante. Latence réduite à celle du calcul seul.",
      "explanation": "Refactoring EDA : appels synchrones chaînés = couplage temporel fort et latence cumulative (200ms + 300ms + 300ms = 800ms). Le service de pricing attend que booking, risk et position aient tous répondu. Avec RabbitMQ : le pricing publie `PricingCompleted` (< 1ms) et répond immédiatement au trader. Booking, risk et position consomment en async et indépendamment. Si un service est lent/down, les autres continuent. Gain : latence de réponse = temps de calcul seul (ex: 50ms). `Task.WhenAll` (option C) aide mais maintient le couplage temporel."
    },
    {
      "question": "[Code → Identification] `var policy = Policy.Handle<SophisException>().WaitAndRetryAsync(3, i => TimeSpan.FromSeconds(Math.Pow(2, i))).WrapAsync(Policy.TimeoutAsync(TimeSpan.FromSeconds(5)));`. Qu'implémente ce code Polly ?",
      "options": [
        "Un circuit breaker qui coupe les appels après 3 erreurs.",
        "Un retry avec backoff exponentiel (1s, 2s, 4s) combiné avec un timeout global de 5s par tentative — résilience pour les appels Sophis instables.",
        "Un rate limiter à 3 requêtes par seconde vers Sophis.",
        "Un load balancer entre plusieurs instances Sophis."
      ],
      "answer": "Un retry avec backoff exponentiel (1s, 2s, 4s) combiné avec un timeout global de 5s par tentative — résilience pour les appels Sophis instables.",
      "explanation": "Polly combiné : `WaitAndRetryAsync(3, i => Math.Pow(2, i))` → si l'appel Sophis échoue, réessayer après 2^1=2s, 2^2=4s, 2^3=8s. Le backoff exponentiel évite de saturer Sophis qui se remet en route. `TimeoutAsync(5)` → chaque tentative est timeout après 5s (évite de bloquer un thread 30s sur un Sophis bloqué). Combiné avec `.WrapAsync()` : l'ordre d'application est timeout > retry. En CIB, les appels aux systèmes legacy (Sophis, DataSynapse) nécessitent impérativement ce type de politique de résilience."
    },
    {
      "question": "[Erreur contextuelle + MiFID II] Un service de booking ne logge pas l'identité du trader, l'horodatage et l'instrument pour chaque trade booké. Quelle violation réglementaire en CIB ?",
      "options": [
        "Aucune — les logs sont optionnels en CIB.",
        "Violation MiFID II Article 25 : obligation de conservation de tous les ordres et trades (identité, horodatage, instrument, prix, quantité) pendant 5 ans pour les audits régulateurs.",
        "Violation uniquement du RGPD — les identités ne doivent pas être loguées.",
        "Violation interne uniquement, sans conséquence réglementaire."
      ],
      "answer": "Violation MiFID II Article 25 : obligation de conservation de tous les ordres et trades (identité, horodatage, instrument, prix, quantité) pendant 5 ans pour les audits régulateurs.",
      "explanation": "MiFID II (Markets in Financial Instruments Directive II) impose des obligations d'archivage strictes en CIB : chaque booking doit être tracé avec l'identité du trader/sales, l'horodatage précis (microsecondes pour certains instruments), l'ISIN, la quantité, le prix, la contrepartie. Conservation 5 ans minimum. Défaut = sanction AMF/FCA potentiellement très lourde. Dans MAPS : structured logging `_logger.LogInformation(\"Trade booked {TradeId} {ISIN} {Trader} {Notional} {Timestamp}\", ...)` + export vers un store d'archivage immuable (Kafka + S3)."
    },
    {
      "question": "[Thème A → Thème B] Comment le modèle de Heston améliore-t-il Black-Scholes pour pricer un Autocall sur un sous-jacent avec skew prononcé ?",
      "options": [
        "Heston est identique à Black-Scholes mais plus rapide à calculer.",
        "Black-Scholes suppose σ constante (surface plate) — Heston modélise la volatilité comme un processus stochastique (CIR), permettant de reproduire le skew et le terme structure de la surface implicite observée. Critique pour les produits sensibles à la vol (autocalls).",
        "Heston est uniquement adapté aux options américaines.",
        "Black-Scholes et Heston donnent le même prix pour les autocalls."
      ],
      "answer": "Black-Scholes suppose σ constante (surface plate) — Heston modélise la volatilité comme un processus stochastique (CIR), permettant de reproduire le skew et le terme structure de la surface implicite observée. Critique pour les produits sensibles à la vol (autocalls).",
      "explanation": "Limitation Black-Scholes en pratique : volatilité implicite non constante en K et T (smile/skew). Heston (1993) : `dv = κ(θ-v)dt + ξ√v dW_v` où v est la variance stochastique. Paramètres : κ (vitesse de retour à la moyenne), θ (variance à long terme), ξ (vol de vol), ρ (corrélation spot-vol). Avantage : reproduit naturellement le skew négatif des actions (put implicite) et la term structure. Pour les autocalls (très sensibles à la volatilité sur des maturités 1-5 ans), Heston donne des prix plus fiables que Black-Scholes. Implémenté dans MAPS via calibration sur la surface de marché."
    },
    {
      "question": "[Situation → Multi-concepts] Dans le pipeline Azure DevOps de MAPS, le build cible `net48;net8.0`. La CI échoue sur le target `net8.0` car une lib MSMQ n'est pas compatible. Comment résoudre ?",
      "options": [
        "Supprimer la cible net8.0 du pipeline.",
        "Wrapper l'import MSMQ dans une directive `#if NET48` + créer `IMsmqAdapter` + implémenter `RabbitMqAdapter` pour net8.0 — la CI passe sur les deux targets.",
        "Downgrader toute la solution vers net48.",
        "Ignorer l'erreur net8.0 dans le pipeline YAML."
      ],
      "answer": "Wrapper l'import MSMQ dans une directive `#if NET48` + créer `IMsmqAdapter` + implémenter `RabbitMqAdapter` pour net8.0 — la CI passe sur les deux targets.",
      "explanation": "Multi-target avec incompatibilité : MSMQ (`System.Messaging`) n'existe pas sur .NET 8/Linux. Solution : abstraction `IMessageBus` avec deux implémentations — `MsmqMessageBus` compilée uniquement pour net48 (`#if NET48`), `RabbitMqMessageBus` pour net8.0. Dans le projet : `<ItemGroup Condition=\"'$(TargetFramework)' == 'net48'\"><PackageReference Include=\"System.Messaging\" /></ItemGroup>`. Le DI container charge l'implémentation correcte selon le runtime. La CI valide les deux targets indépendamment. C'est le pattern de migration progressive décrit dans la mission."
    },
    {
      "question": "[Ordre de dépendance] Dans le flux complet `REST API booking → IsinService → SophisAdapter → SQL Référentiel → RabbitMQ → Sophis`, quel composant est le prérequis bloquant de tous les autres ?",
      "options": [
        "RabbitMQ — sans messaging, rien ne peut être publié.",
        "La résolution de l'ISIN via `IsinService`/`SophisAdapter` — sans ISIN valide, le booking ne peut pas progresser dans Sophis ni dans le référentiel SQL.",
        "SQL Server — sans base de données, le service ne démarre pas.",
        "Azure DevOps — sans CI/CD, le service ne peut pas être déployé."
      ],
      "answer": "La résolution de l'ISIN via `IsinService`/`SophisAdapter` — sans ISIN valide, le booking ne peut pas progresser dans Sophis ni dans le référentiel SQL.",
      "explanation": "Ordre de dépendance fonctionnel dans le service de booking (mission explicite) : l'ISIN est la clé de voûte. Sans ISIN : impossible d'interroger le référentiel SQL (identifiant manquant), impossible de booker dans Sophis (ISIN requis par l'API Sophis), impossible de publier l'événement sur RabbitMQ (payload incomplet). C'est pourquoi la mission mentionne séparément 'mise en place d'un service de récupération d'ISIN nécessaire pour le booking' — ce service est le prérequis critique de tout le flux."
    },
    {
      "question": "[Refactoring] Un `PricingController` de 800 lignes gère la validation des inputs, le pricing Black-Scholes, l'accès SQL, la publication RabbitMQ et le logging. Comment refactoriser en respectant SOLID ?",
      "options": [
        "Diviser en 2 controllers de 400 lignes chacun.",
        "SRP : extraire `IPricingService` (calcul), `IMarketDataRepository` (SQL), `IEventPublisher` (RabbitMQ), `IPricingValidator` (validation). Le Controller devient orchestrateur léger de 20 lignes. DIP : toutes les dépendances injectées par constructeur.",
        "Déplacer toute la logique dans les méthodes privées du Controller.",
        "Utiliser des annotations `[PricingFilter]` pour externaliser la logique."
      ],
      "answer": "SRP : extraire `IPricingService` (calcul), `IMarketDataRepository` (SQL), `IEventPublisher` (RabbitMQ), `IPricingValidator` (validation). Le Controller devient orchestrateur léger de 20 lignes. DIP : toutes les dépendances injectées par constructeur.",
      "explanation": "SRP sur le Controller : un Controller 800 lignes = 5+ responsabilités = 5+ raisons de changer = fragilité. Après refactoring : `PricingController` reçoit `IPricingService, IEventPublisher, IPricingValidator` par injection, appelle les méthodes, retourne le résultat HTTP. `PricingService` contient uniquement le calcul (Black-Scholes, Greeks). `MarketDataRepository` = SQL uniquement. `EventPublisher` = RabbitMQ uniquement. Chaque classe a une seule raison de changer. Tests unitaires : mocker chaque interface séparément. La mission 'refactoring du code' décrit exactement ce type d'intervention."
    },
    {
      "question": "[Anti-pattern + Sécurité] Une API REST de pricing accepte `{\"model\": \"BlackScholes\", \"codeToEvaluate\": \"S * 1.1\"}` et l'évalue dynamiquement avec `Roslyn CSharpScript.EvaluateAsync(request.codeToEvaluate)`. Quel risque critique ?",
      "options": [
        "Aucun risque — Roslyn est sécurisé.",
        "Remote Code Execution (RCE) — un attaquant peut envoyer du code arbitraire exécuté sur le serveur : accès au système de fichiers, exécution de processus, exfiltration de données de marché confidentielles.",
        "Le seul risque est une dégradation des performances.",
        "Roslyn ne supporte pas l'exécution de code avec des inputs externes."
      ],
      "answer": "Remote Code Execution (RCE) — un attaquant peut envoyer du code arbitraire exécuté sur le serveur : accès au système de fichiers, exécution de processus, exfiltration de données de marché confidentielles.",
      "explanation": "RCE critique en CIB : `CSharpScript.EvaluateAsync(userInput)` exécute littéralement n'importe quel code C# sur le serveur. Payload malveillant : `System.IO.File.ReadAllText(\"/app/config/sophis-credentials.json\")` ou `System.Diagnostics.Process.Start(\"cmd.exe\", \"/c whoami\")`. Dans un environnement bancaire : accès aux credentials Sophis, aux données de position, aux clés API. Correction : whitelist des modèles autorisés (`if(model not in [\"BlackScholes\", \"Heston\"]) return BadRequest()`), paramétrage des inputs (strike, vol, etc.), jamais d'évaluation dynamique de code externe."
    },
    {
      "question": "[Thème ↔ Outil] Quel outil mesure précisément les gains de performance du refactoring du service de référentiel de données en C# ?",
      "options": [
        "xUnit avec des tests unitaires classiques.",
        "BenchmarkDotNet — compare les implémentations (séquentielle vs parallèle, avec/sans cache, avant/après refactoring) avec des métriques précises : moyenne, percentiles, allocations GC.",
        "Azure DevOps Pipeline — les logs de build montrent les gains de performance.",
        "Visual Studio Profiler uniquement en mode Release."
      ],
      "answer": "BenchmarkDotNet — compare les implémentations (séquentielle vs parallèle, avec/sans cache, avant/après refactoring) avec des métriques précises : moyenne, percentiles, allocations GC.",
      "explanation": "BenchmarkDotNet est le standard .NET pour les benchmarks de performance. `[Benchmark] public void PriceBook_Before()` vs `[Benchmark] public void PriceBook_After()` → résultats : Mean time, StdDev, Gen0/Gen1/Gen2 (GC pressure), Allocated. La mission mentionne 'optimisation des performances' + 'multithreading' + 'gestion de la mémoire' — mesurer les gains avant/après est indispensable pour valider les optimisations. Exemple concret : `ArrayPool<T>` réduit Gen0 de 500MB à 0 pour une simulation Monte Carlo."
    }
  ],
  expert: [
    {
      "question": "[Situation → Multi-concepts] Un Autocall 3 ans sur le CAC40 (barrière autocall 100%, protection 60%, coupon 8%/an) doit être pricé et ses Greeks calculés dans MAPS. Identifiez le moteur de pricing, les défis techniques et l'architecture C# optimale.",
      "options": [
        "Black-Scholes analytique + calcul séquentiel + SQL direct.",
        "Monte Carlo C# (`Parallel.For` + `ArrayPool`) sous modèle Heston (skew/smile), Greeks par différences finies parallèles (`Task.WhenAll`), surface implicite immutable depuis Redis, publication `PricingCompleted` sur RabbitMQ — latence < 200ms.",
        "Formule fermée Black-Scholes + `Thread.Sleep(0)` pour libérer le CPU.",
        "DataSynapse uniquement, sans calcul local."
      ],
      "answer": "Monte Carlo C# (`Parallel.For` + `ArrayPool`) sous modèle Heston (skew/smile), Greeks par différences finies parallèles (`Task.WhenAll`), surface implicite immutable depuis Redis, publication `PricingCompleted` sur RabbitMQ — latence < 200ms.",
      "explanation": "Architecture complète pour un Autocall : (1) Heston obligatoire (Autocall très sensible au skew/terme structure de vol). (2) Monte Carlo (pas de formule fermée pour les autocalls). (3) `Parallel.For(0, N, i => { path = GeneratePath(); payoffs[i] = ComputePayoff(path); })` + `ArrayPool<double>` pour éviter les allocations. (4) Greeks par bump-and-reprice : ±1% spot pour Delta, ±1bp vol pour Vega, -1 jour pour Theta — `Task.WhenAll` pour les 5 Greeks simultanément. (5) VolSurface Heston depuis Redis (immutable, thread-safe). (6) Résultat publié sur RabbitMQ pour le blotter."
    },
    {
      "question": "[Architecture + .NET] Comment concevoir le service `IPricingEngine` pour supporter Black-Scholes (.NET 8), Heston (DataSynapse/net48), et un futur modèle stochastique local, sans modifier les couches supérieures ?",
      "options": [
        "Un `switch(modelName)` dans le controller.",
        "Strategy pattern : `IPricingModel` injectée + factory `IPricingModelFactory.Create(modelName)`. `BlackScholesModel` (.NET 8), `HestonDataSynapseModel` (netstandard2.0, compatible net48/net8), nouveau modèle = nouvelle classe. OCP total.",
        "Un seul service fat avec `if/else if` pour chaque modèle.",
        "Dupliquer le `PricingEngine` pour chaque modèle."
      ],
      "answer": "Strategy pattern : `IPricingModel` injectée + factory `IPricingModelFactory.Create(modelName)`. `BlackScholesModel` (.NET 8), `HestonDataSynapseModel` (netstandard2.0, compatible net48/net8), nouveau modèle = nouvelle classe. OCP total.",
      "explanation": "Design évolutif du moteur de pricing : `interface IPricingModel { Task<decimal> PriceAsync(BaseOption option, MarketData md); Task<Greeks> ComputeGreeksAsync(BaseOption option, MarketData md); }`. Factory enregistrée dans DI : `services.AddKeyedSingleton<IPricingModel, BlackScholesModel>(\"BlackScholes\")`. Pour DataSynapse (net48) : `HestonDataSynapseModel : IPricingModel` compilé en netstandard2.0, soumit les jobs via l'API DataSynapse. OCP : un nouveau modèle SABR = créer `SABRModel : IPricingModel` + enregistrer dans DI. Zéro modification du `PricingEngine` ou du Controller. C'est exactement l'objectif du 'refactoring du code' dans la mission."
    },
    {
      "question": "[Nommage inversé] Un concept garantit qu'une `VolatilitySurface` partiellement recalibrée (état intermédiaire incohérent) n'est jamais visible par les threads de pricing parallèles, sans aucun verrou. Quel est ce concept ?",
      "options": [
        "Pessimistic locking avec `ReaderWriterLockSlim`",
        "Immutable Object pattern + swap atomique (`Interlocked.Exchange`) — la surface en cours de recalibration est une nouvelle instance privée, swappée atomiquement quand elle est prête. Les threads de pricing lisent toujours une instance complète cohérente.",
        "Double-checked locking sur la référence de la surface",
        "Eventual consistency — les threads acceptent des données légèrement périmées"
      ],
      "answer": "Immutable Object pattern + swap atomique (`Interlocked.Exchange`) — la surface en cours de recalibration est une nouvelle instance privée, swappée atomiquement quand elle est prête. Les threads de pricing lisent toujours une instance complète cohérente.",
      "explanation": "Pattern Immutable Object + atomic swap : `private volatile VolatilitySurface _currentSurface;`. Lors de la recalibration : `var newSurface = new VolatilitySurface(calibratedGrid)` (construction privée, complète). `Interlocked.Exchange(ref _currentSurface, newSurface)` — swap atomique. Tous les threads de pricing qui ont capturé une référence à l'ancienne surface continuent de l'utiliser jusqu'à leur prochain appel (cohérence garantie sur leur calcul). Aucun lock = zéro contention = scalabilité parfaite pour N threads parallèles. C'est le pattern fondamental pour les données partagées read-heavy en CIB."
    },
    {
      "question": "[Anti-pattern + Performance] Un service C# alloue `new decimal[252]` à chaque itération de `Parallel.For(0, 100000, i => { var path = new decimal[252]; ... })` pour simuler 100k chemins Monte Carlo. Impact et correction.",
      "options": [
        "Aucun impact — le GC est efficace en .NET 8.",
        "100k allocations × 252 × 16 bytes = ~400MB sur le heap à chaque pricing → GC Gen2 fréquents → pauses GC de 50-200ms → latence non déterministe inacceptable en CIB. Correction : `ArrayPool<decimal>.Shared.Rent(252)` + `Return()` après chaque chemin.",
        "La correction est d'utiliser `List<decimal>` à la place de tableaux.",
        "Seul le mode `GCSettings.LatencyMode.Batch` résout ce problème."
      ],
      "answer": "100k allocations × 252 × 16 bytes = ~400MB sur le heap à chaque pricing → GC Gen2 fréquents → pauses GC de 50-200ms → latence non déterministe inacceptable en CIB. Correction : `ArrayPool<decimal>.Shared.Rent(252)` + `Return()` après chaque chemin.",
      "explanation": "Calcul : 100k × 252 × 16 bytes = ~403MB alloués et abandonnés à chaque pricing. Sur un serveur CIB qui price toutes les 30 secondes : cycles GC Gen2 continus. `GC.Collect()` peut prendre 50-200ms → latence de pricing non déterministe → le trader attend. Correction : `ArrayPool<decimal>.Shared` maintient un pool de tableaux pré-alloués. `Rent(252)` retourne un tableau du pool (O(1), no allocation). `Return(buffer)` le remet dans le pool. BenchmarkDotNet avant/après : Gen0 passe de ~400MB à 0. En production : `GCSettings.LatencyMode = GCLatencyMode.LowLatency` pendant les fenêtres de marché critiques comme filet de sécurité."
    },
    {
      "question": "[Thème ↔ Architecture] Comment architecturer la migration de MSMQ vers RabbitMQ dans MAPS sans interruption de service et sans modifier les services consommateurs existants ?",
      "options": [
        "Arrêter MSMQ, déployer RabbitMQ, redémarrer tous les services.",
        "Pattern Strangler : abstraction `IMessageBus` devant MSMQ existant → implémenter `RabbitMqMessageBus : IMessageBus` → dual-write (MSMQ + RabbitMQ en parallèle) → migrer les consumers un par un → retirer MSMQ quand tous les consumers sont migrés.",
        "Dupliquer tous les services en version RabbitMQ et déployer en blue-green.",
        "Créer un bridge MSMQ↔RabbitMQ et garder les deux en production définitivement."
      ],
      "answer": "Pattern Strangler : abstraction `IMessageBus` devant MSMQ existant → implémenter `RabbitMqMessageBus : IMessageBus` → dual-write (MSMQ + RabbitMQ en parallèle) → migrer les consumers un par un → retirer MSMQ quand tous les consumers sont migrés.",
      "explanation": "Migration sans interruption (objectif mission) : (1) Introduire `IMessageBus` (DIP) devant MSMQ — les consumers ne changent pas, ils dépendent de l'abstraction. (2) Implémenter `RabbitMqMessageBus`. (3) Dual-write : un `DualMessageBus` publie sur MSMQ ET RabbitMQ — validation en production parallèle. (4) Migrer les consumers un par un vers RabbitMQ consumer group. (5) Monitoring : vérifier que tous les messages RabbitMQ sont consommés. (6) Désactiver MSMQ. Rollback à chaque étape : basculer `DualMessageBus` vers MSMQ only. Cette approche incremental est le Strangler Fig appliqué au messaging."
    },
    {
      "question": "[Ordre de dépendance + Architecture] Pour implémenter le nouveau service REST API de booking (mention explicite de la mission), dans quel ordre les composants doivent-ils être développés et testés ?",
      "options": [
        "L'ordre n'a pas d'importance en développement agile.",
        "1. Contrat OpenAPI/Swagger → 2. `IBookingService` + tests unitaires (mock Sophis) → 3. `IIsinService` + cache → 4. Validation `BookingRequest` (FluentValidation) → 5. Sécurité JWT + autorisation → 6. Intégration Sophis → 7. Publication RabbitMQ → 8. Tests d'intégration → 9. Pipeline Azure DevOps.",
        "1. Base de données → 2. Sophis → 3. RabbitMQ → 4. API → 5. Tests.",
        "1. Interface Angular → 2. API → 3. Tests → 4. Sophis."
      ],
      "answer": "1. Contrat OpenAPI/Swagger → 2. `IBookingService` + tests unitaires (mock Sophis) → 3. `IIsinService` + cache → 4. Validation `BookingRequest` (FluentValidation) → 5. Sécurité JWT + autorisation → 6. Intégration Sophis → 7. Publication RabbitMQ → 8. Tests d'intégration → 9. Pipeline Azure DevOps.",
      "explanation": "Ordre de dépendance pour le service de booking (mission MAPS) : contrat OpenAPI first = l'OMS et le blotter peuvent développer en parallèle contre le contrat. Tests unitaires avec mocks avant l'intégration Sophis = développement découplé de la disponibilité de Sophis. IsinService + cache avant l'intégration Sophis complète = layer de résilience. Validation avant la logique métier = fail-fast. JWT/AuthZ avant mise en production = sécurité non négociable. Sophis (step 6) et RabbitMQ (step 7) sont les intégrations à risque — développées après que la logique métier soit prouvée. CI/CD en dernier = automatisation d'un processus déjà validé."
    },
    {
      "question": "[Multi-concepts + CIB] Un trade Autocall est booké dans Sophis via le REST API MAPS. Identifiez les 6 composants techniques traversés et leur rôle, dans l'ordre du flux.",
      "options": [
        "Excel → VBA → Access → SFTP → SQL → Email",
        "1. REST API C# (validation JWT + inputs) → 2. IIsinService (résolution ISIN + cache Redis) → 3. IPricingService (Monte Carlo Heston, Greeks) → 4. ISophisAdapter (booking dans le référentiel) → 5. SQL Server (persistance audit trail MiFID II) → 6. RabbitMQ (événement `TradeBooked` → blotter, RMS, PMS).",
        "FIX Protocol → Broker → Exchange → Clearing → Settlement → Reporting",
        "Angular → ASP.NET → Redis → DataSynapse → Kafka → PostgreSQL"
      ],
      "answer": "1. REST API C# (validation JWT + inputs) → 2. IIsinService (résolution ISIN + cache Redis) → 3. IPricingService (Monte Carlo Heston, Greeks) → 4. ISophisAdapter (booking dans le référentiel) → 5. SQL Server (persistance audit trail MiFID II) → 6. RabbitMQ (événement `TradeBooked` → blotter, RMS, PMS).",
      "explanation": "Flux complet du booking Autocall dans MAPS : (1) JWT validé, `BookingRequest` validé (FluentValidation). (2) ISIN résolu depuis Redis (hit) ou Sophis (miss) — prérequis bloquant. (3) Pricing Monte Carlo Heston pour le prix théorique et les Greeks (validation pré-trade). (4) Sophis COM/API : création du trade dans le référentiel (ISIN, notional, maturité, barrières). (5) SQL Server : insertion dans `Trades` avec userId, timestamp, ISIN, Greeks — audit trail MiFID II immuable. (6) `channel.BasicPublish(\"trading\", \"trade.booked\", payload)` — le blotter React affiche le nouveau trade, le RMS recalcule les limites, le PMS met à jour les positions. Chaque composant correspond à un élément de la stack technique de la mission."
    },
    {
      "question": "[Erreur contextuelle + Architecture] Le service de pricing MAPS expose `GET /api/v1/pricing/volatility-surface` qui retourne la surface complète (50KB JSON) à chaque appel depuis le blotter toutes les secondes pour 100 traders. Problème et correction.",
      "options": [
        "Aucun problème — REST GET est toujours optimal.",
        "100 traders × 1 req/sec × 50KB = 5MB/sec de polling inutile. Correction : WebSocket push ou Server-Sent Events (SSE) depuis le service MAPS — la surface est poussée uniquement quand elle change (toutes les 30s), réduisant le trafic de ×30 et la latence de 1s à quasi-zéro.",
        "La correction est de compresser le JSON à 5KB.",
        "Utiliser HTTP/2 multiplexing résout entièrement le problème."
      ],
      "answer": "100 traders × 1 req/sec × 50KB = 5MB/sec de polling inutile. Correction : WebSocket push ou Server-Sent Events (SSE) depuis le service MAPS — la surface est poussée uniquement quand elle change (toutes les 30s), réduisant le trafic de ×30 et la latence de 1s à quasi-zéro.",
      "explanation": "Polling anti-pattern en CIB : 100 traders qui polling toutes les secondes génèrent 100 req/sec sur le service de vol — serveur chargé inutilement, données souvent identiques entre deux requêtes (la surface ne change que toutes les 30s). Solution WebSocket (ASP.NET Core SignalR ou `System.Net.WebSockets`) : le service MAPS push la surface uniquement lors de la recalibration. Latence quasi-zéro (push immédiat vs polling à 1s). Charge réseau : 1 push toutes les 30s × 50KB = ~1.7KB/s. SignalR dans MAPS est standard pour les blotters temps réel."
    },
    {
      "question": "[Nommage inversé + C#] Un mécanisme garantit que tous les services enregistrés dans le DI container ASP.NET Core reçoivent leurs dépendances sans les instancier eux-mêmes, et permet de les remplacer par des mocks en test. Quel est ce mécanisme ?",
      "options": [
        "Le pattern Service Locator — `ServiceLocator.Current.GetInstance<T>()`",
        "L'Injection de dépendances par constructeur (Constructor Injection) via `IServiceCollection` — couplage minimal, testabilité maximale, cycle de vie contrôlé (Singleton/Scoped/Transient).",
        "Le pattern Singleton statique — `Instance` property sur chaque service.",
        "La réflexion .NET — `Activator.CreateInstance(typeof(T))`"
      ],
      "answer": "L'Injection de dépendances par constructeur (Constructor Injection) via `IServiceCollection` — couplage minimal, testabilité maximale, cycle de vie contrôlé (Singleton/Scoped/Transient).",
      "explanation": "DI container ASP.NET Core : `services.AddScoped<IIsinService, IsinService>()` + `services.AddSingleton<ISophisAdapter, SophisAdapter>()`. Le framework instancie et injecte automatiquement. Avantages : (1) Le service ne connaît pas ses dépendances concrètes (DIP). (2) Test unitaire : `new IsinService(mock.Object, mockCache.Object)` — injection manuelle du mock. (3) Cycle de vie : Singleton (une instance, VolSurface cache), Scoped (par requête HTTP, identité trader), Transient (nouveau à chaque injection, PricingRequest). Service Locator (anti-pattern) = le service s'appelle lui-même `ServiceLocator.Get<T>()` — couplage caché, non testable."
    },
    {
      "question": "[Thème ↔ Principe] Quel principe garantit que l'ajout d'un nouveau type de produit (ex: Asian Option) dans le moteur MAPS ne nécessite ni modification de `PricingEngine` ni régression sur les options existantes ?",
      "options": [
        "SRP — chaque classe a une seule responsabilité",
        "OCP + Polymorphisme + DIP ensemble : `AsianOption : BaseOption` avec `override Price()` + `PricingEngine` dépend de `IPricingModel` + factory enregistre `AsianOption` dans DI. Zéro ligne modifiée dans le moteur existant.",
        "LSP uniquement — la substitution garantit la non-régression",
        "ISP — les interfaces sont séparées par fonctionnalité"
      ],
      "answer": "OCP + Polymorphisme + DIP ensemble : `AsianOption : BaseOption` avec `override Price()` + `PricingEngine` dépend de `IPricingModel` + factory enregistre `AsianOption` dans DI. Zéro ligne modifiée dans le moteur existant.",
      "explanation": "Triple principe pour l'extensibilité du moteur MAPS : OCP = `PricingEngine` est fermé à la modification, ouvert à l'extension. Polymorphisme = `Parallel.ForEach(book, opt => opt.Price(md))` appelle automatiquement `AsianOption.Price()` sans `if/switch`. DIP = le moteur dépend de `BaseOption`/`IPricingModel` (abstractions), jamais des implémentations concrètes. Résultat : ajouter `AsianOption` = créer la classe, enregistrer dans DI, déployer. Les 200 tests unitaires des options existantes continuent de passer — zéro régression. C'est la définition opérationnelle du 'refactoring du code' dans la mission."
    },
    {
      "question": "[Erreur contextuelle + Sécurité CIB] Une API REST MAPS accepte `?model=BlackScholes&underlyingId=../../../../etc/passwd` comme paramètre. Quel type d'attaque et quelle correction ?",
      "options": [
        "Pas d'attaque — les paramètres URL sont toujours sécurisés.",
        "Path traversal / injection via `../` : si le paramètre est utilisé dans un accès fichier ou une requête, un attaquant peut accéder à des ressources non prévues. Correction : whitelist stricte des valeurs autorisées + validation enum pour `model` + `Guid.TryParse()` pour `underlyingId`.",
        "Le seul risque est une erreur 404 si le fichier n'existe pas.",
        "HTTPS empêche ce type d'attaque."
      ],
      "answer": "Path traversal / injection via `../` : si le paramètre est utilisé dans un accès fichier ou une requête, l'attaquant peut accéder à des ressources non prévues. Correction : whitelist stricte des valeurs autorisées + validation enum pour `model` + `Guid.TryParse()` pour `underlyingId`.",
      "explanation": "Path traversal en CIB : si `underlyingId` est utilisé dans `File.ReadAllText($\"/data/instruments/{underlyingId}.json\")`, l'input `../../../../etc/passwd` retournerait `/etc/passwd`. Même risque pour les requêtes SQL si non paramétrées. Corrections pour l'API MAPS : (1) `model` → validation enum : `if (!Enum.TryParse<PricingModel>(request.Model, out var model)) return BadRequest()`. (2) `underlyingId` → `Guid.TryParse(id, out var guid)` ou regex `[A-Z0-9]{6,12}`. (3) FluentValidation sur `BookingRequest`. (4) Ne jamais utiliser un paramètre externe directement dans un chemin de fichier ou une requête non paramétrée. Defense in depth."
    },
    {
      "question": "[Multi-concepts] Dans le contexte de la mission 'optimisation des performances du service de référentiel de données : Multithreading + Gestion de la mémoire', proposez une architecture complète pour réduire la latence de 500ms à < 10ms.",
      "options": [
        "Migrer vers une base de données NoSQL.",
        "Index SQL covering + `IDistributedCache` Redis (cache-aside, TTL 4h) + `async/await` Dapper + `IMemoryCache` L1 (TTL 30s) + `ConcurrentDictionary` pour les lookups ISIN les plus fréquents + `Span<T>` pour le parsing des réponses + BenchmarkDotNet pour valider.",
        "Augmenter le nombre de CPUs du serveur SQL.",
        "Transformer toutes les requêtes en stored procedures."
      ],
      "answer": "Index SQL covering + `IDistributedCache` Redis (cache-aside, TTL 4h) + `async/await` Dapper + `IMemoryCache` L1 (TTL 30s) + `ConcurrentDictionary` pour les lookups ISIN les plus fréquents + `Span<T>` pour le parsing des réponses + BenchmarkDotNet pour valider.",
      "explanation": "Architecture de cache multi-niveau (L1/L2/L3) pour le référentiel : L1 = `ConcurrentDictionary` en mémoire locale (< 0.1ms, pour les 100 ISIN les plus fréquents). L2 = `IMemoryCache` (< 0.5ms, tous les ISIN du jour). L3 = Redis `IDistributedCache` (< 2ms, partagé entre instances). L4 = SQL Server avec covering index (10-50ms, uniquement en miss). Miss path : SQL → Redis → MemoryCache → ConcurrentDictionary. Hit path L1 : 0.1ms. `async/await` Dapper libère les threads pendant l'I/O SQL. `Span<T>` évite les allocations dans le parsing. BenchmarkDotNet mesure chaque couche. 500ms → < 1ms en hit L1 = ×500 d'amélioration. Exactement 'optimisation des performances + multithreading + gestion de la mémoire'."
    },
    {
      "question": "[Ordre de dépendance + Réglementation] Dans le cadre MiFID II, quel prérequis technique doit absolument être en place avant la mise en production du service de booking MAPS ?",
      "options": [
        "L'interface Angular du blotter doit être déployée.",
        "L'audit trail complet (structured logging immuable, archivage SQL/Kafka, identité trader, ISIN, notional, timestamp microsecondes, traçabilité des modifications) doit être opérationnel et testé avant le premier trade en production.",
        "DataSynapse doit être entièrement migré vers .NET 8.",
        "Le pipeline Azure DevOps doit déployer automatiquement toutes les heures."
      ],
      "answer": "L'audit trail complet (structured logging immuable, archivage SQL/Kafka, identité trader, ISIN, notional, timestamp microsecondes, traçabilité des modifications) doit être opérationnel et testé avant le premier trade en production.",
      "explanation": "MiFID II est un prérequis non-négociable à la mise en production : l'article 25 impose la conservation de toutes les transactions (ordre, modification, annulation) avec un horodatage précis, l'identité complète du trader, les caractéristiques de l'instrument. Sanction en cas d'absence : l'AMF/FCA peut suspendre l'activité de trading. Ordre de dépendance : sans audit trail, le service ne peut pas être mis en production légalement. L'audit trail dans MAPS = `_logger.LogInformation` structuré + `INSERT INTO Trades (AuditLog)` SQL + event Kafka `TradeBooked` persisté (immuable, rejouable). Tests obligatoires : vérifier que chaque booking produit un enregistrement complet dans les 3 couches."
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
  const totalQuestions = questions.moyen.length + questions.avance.length + questions.expert.length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length} | ✅ Expert : {scores.expert}/{questions.expert.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6)
        ? <h3 className="success">🚀 Mission CIB Pricing Pre-Trade maîtrisée !</h3>
        : <p className="fail">📚 Révisez C#, dérivés actions et architecture CIB.</p>
      }
    </div>
  );
};

const CIBPricingPreTradeQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
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
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

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
            CIB Pricing Pre-Trade 🔹 {level === "basic"
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

export default CIBPricingPreTradeQCM;
