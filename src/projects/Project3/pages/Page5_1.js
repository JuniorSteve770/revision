// src/projects/Project3/pages/Page5_1.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — Flux de données en salle de marché CIB & AM",
    "answer": "**CIB (Corporate & Investment Banking)** : desks de trading propres (actions, taux, crédit, FX, dérivés), market making, structuration. Latence critique, C# dominant, FIX/gRPC, kdb+. ◆ **Asset Management** : gestion de portefeuilles OPCVM/fonds, rebalancing, reporting gérant. Moins de latence, Python central, SQL Server/Access, VBA encore présent, SFTP. ◆ **Acteurs du flux** : Portfolio Manager → OMS → RMS → EMS → Broker → Venue → Confirmation → PMS → Reporting. ◆ **Technologies transversales** : C# (moteur transactionnel), Python (quant/analytics), SQL Server (référentiel), Redis (cache), Kafka (événements), Angular/React (frontend), Excel/SFTP (reporting)."
  },
  {
    "question": "Classe Order en C# — Structure, getters filtrés, cycle de vie",
    "answer": "**Classe Order** : objet central de tout le système. Encapsule l'état d'un ordre et contrôle les modifications via des propriétés. ◆ **Getters filtrés** : `public decimal Quantity => _quantity > 0 ? _quantity : 0;` — jamais de quantité négative exposée. `public decimal LimitPrice => _type == OrderType.Limit ? _price : throw new InvalidOperationException();` ◆ **Propriétés clés** : `OrderId` (GUID), `Symbol` (ISIN/ticker), `Side` (Buy/Sell), `OrderType` (Market/Limit/Stop), `Status` (enum), `FilledQuantity`, `RemainingQuantity => Quantity - FilledQuantity`. ◆ **Cycle de vie** : `Created → Validated → SentToBroker → PartiallyFilled → Filled` ou `Rejected` / `Cancelled`. Seules les méthodes internes (`Execute()`, `Cancel()`) peuvent changer le statut — Encapsulation."
  },
  {
    "question": "Flux FIX — De l'OMS C# au broker",
    "answer": "**FIX NewOrderSingle (35=D)** : message envoyé par l'OMS pour passer un ordre. Tags clés : `49=CLIENT` (sender), `56=BROKER` (target), `55=BNPP.PA` (symbol), `54=1` (Buy), `38=10000` (qty), `40=2` (Limit), `44=58.50` (price), `11=ORD-20240115-001` (ClOrdID unique). ◆ **FIX ExecutionReport (35=8)** : réponse du broker. Tag `39` = statut : `0` (New), `1` (PartialFill), `2` (Fill), `4` (Cancelled), `8` (Rejected). Tag `14` = cumQty exécutée, `6` = avgPx. ◆ **C# QuickFIX/n** : `Application.OnMessage(ExecutionReport msg, SessionID id)` → parse les tags → dispatche vers l'OMS. ◆ **FIX Drop Copy** : copie de tous les messages vers le RMS et le desk surveillance — monitoring en temps réel sans interférer avec le flux d'exécution."
  },
  {
    "question": "Traitement simultané des ordres — async/await, Channel<T>, ConcurrentQueue",
    "answer": "**Problème** : l'OMS reçoit 500 ordres/seconde depuis plusieurs desks et brokers. Traitement séquentiel = goulot d'étranglement. ◆ **`Channel<Order>`** : pipeline producteur/consommateur lock-free. `Channel<Order>.Writer.WriteAsync(order)` depuis les threads FIX. `Channel<Order>.Reader.ReadAllAsync()` dans le moteur de traitement. Backpressure intégrée. ◆ **`async/await`** : `await orderRepo.SaveAsync(order)` libère le thread pendant l'I/O SQL. `await Task.WhenAll(validateRisk, validateData, checkLimits)` exécute les validations en parallèle. ◆ **`ConcurrentQueue<Order>`** : file thread-safe pour les ordres en attente d'enrichissement Market Data. ◆ **Règle** : jamais de `Thread.Sleep()` ni d'appel synchrone dans un hot path — toujours `async/await` ou `Channel<T>`."
  },
  {
    "question": "Interconnexion entre desks — Kafka topics dédiés",
    "answer": "**Architecture multi-desk** : chaque desk publie sur son propre topic Kafka. `desk.equity.orders`, `desk.rates.orders`, `desk.credit.orders`. ◆ **Services partagés** : Market Data Handler (une instance, tous les desks consomment `market.prices`). RMS centralisé (consomme tous les topics, calcule le risque agrégé). PMS central (consolide les positions cross-desk). ◆ **Cross-desk netting** : si le desk equity est long BNPP et le desk crédit est short BNPP CDS, le RMS central calcule l'exposition nette. Kafka topic `risk.consolidated.positions` — consommé par le reporting direction. ◆ **Isolation** : un incident sur le desk FX (pic de messages) ne dégrade pas le desk taux — partitions Kafka séparées, consumer groups indépendants."
  },
  {
    "question": "Interconnexion inter-salles — Paris, Londres, New York",
    "answer": "**Topologie** : chaque salle a son cluster Kafka local. Kafka MirrorMaker 2 réplique les topics critiques entre datacenters. `market.prices` répliqué de Londres vers Paris en < 50ms. ◆ **Latence géographique** : Paris ↔ Londres ~10ms (fibre dédiée). Paris ↔ New York ~80ms (transatlantique). Impact : les positions de New York sont visibles à Paris avec un délai — le RMS central doit horodater les événements. ◆ **FIX drop copy cross-salle** : tous les trades exécutés dans toutes les salles sont copiés vers le système de compliance central (Paris). ◆ **Heure de clôture** : New York clôture à 22h Paris — le PMS central agrège les positions mondiales après chaque fermeture de marché via un batch Python Pandas → SQL Server → rapport PDF Plotly."
  },
  {
    "question": "Desk Options — Classe abstraite, polymorphisme, pricing",
    "answer": "**Hiérarchie de classes** : `abstract class BaseOption { protected decimal _strike; protected DateTime _expiry; public abstract decimal Price(MarketData md); public abstract Greeks ComputeGreeks(MarketData md); }`. ◆ **Implémentations** : `class EuropeanCall : BaseOption { public override decimal Price(MarketData md) => BlackScholes.Call(_strike, md.Spot, md.Vol, ...); }`. `class BarrierOption : BaseOption`, `class AsianOption : BaseOption`. ◆ **Polymorphisme** : `List<BaseOption> book = desk.GetBook(); Parallel.ForEach(book, opt => opt.ComputeGreeks(marketData));` — chaque option calcule ses propres Greeks. ◆ **Pattern Strategy** : `IPricingModel` injectée — `BlackScholesModel`, `HestonModel`, `SABRModel` sont interchangeables sans modifier `BaseOption`."
  },
  {
    "question": "Surface de volatilité — Construction, interpolation, visualisation",
    "answer": "**Construction** : grille de volatilités implicites extraites des options cotées. Axes : `Strike` (ou moneyness K/S) × `Expiry` (en jours). Valeur : vol implicite `σ(K,T)` obtenue par inversion Black-Scholes sur les prix de marché. ◆ **Classe C#** : `class VolatilitySurface { private decimal[,] _grid; public decimal GetVol(decimal strike, DateTime expiry) => Interpolate(strike, expiry); private decimal Interpolate(...) => /* cubic spline ou bilinear */ }` ◆ **Getters protégés** : `public decimal GetVol(decimal K, DateTime T) => _grid[i,j] > 0 ? _grid[i,j] : throw new VolSurfaceException(\"Negative vol\");` ◆ **Visualisation Python Plotly** : `go.Surface(x=strikes, y=maturities, z=vols_matrix, colorscale='RdYlGn')` → surface 3D interactive. Dash app ou export HTML embarqué dans Angular via iframe. ◆ **Arbitrage** : la surface doit être calendar-spread et butterfly-spread monotone — validation à chaque mise à jour."
  },
  {
    "question": "Greeks — Calcul parallèle, async/await, Parallel.ForEach",
    "answer": "**Greeks** : Delta (∂V/∂S), Gamma (∂²V/∂S²), Vega (∂V/∂σ), Theta (∂V/∂t), Rho (∂V/∂r). ◆ **Différences finies C#** : `decimal delta = (Price(S+dS) - Price(S-dS)) / (2*dS);` — nécessite 2N+1 évaluations pour N Greeks. ◆ **Parallélisme** : `async Task<Greeks> ComputeAllGreeksAsync(BaseOption opt, MarketData md) { var tasks = new[] { Task.Run(() => ComputeDelta(opt,md)), Task.Run(() => ComputeVega(opt,md)), Task.Run(() => ComputeTheta(opt,md)) }; await Task.WhenAll(tasks); }` ◆ **Book entier** : `var results = new ConcurrentBag<Greeks>(); await Task.WhenAll(book.Select(opt => Task.Run(() => { results.Add(opt.ComputeGreeks(md)); })));` ◆ **Python** : `from concurrent.futures import ThreadPoolExecutor; greeks = list(executor.map(compute_greeks, options_book))` → DataFrame Pandas → heatmap Plotly."
  },
  {
    "question": "Produits Structurés — Payoffs, coupons, IPayoffCalculator",
    "answer": "**Interface** : `interface IPayoffCalculator { decimal ComputePayoff(decimal[] underlyingPath); decimal ComputeCoupon(int observationDate, decimal[] fixings); }` ◆ **Vanilla** : `class CallPayoff : IPayoffCalculator { public decimal ComputePayoff(decimal[] path) => Math.Max(path.Last() - _strike, 0) * _notional; }` ◆ **Autocall** : `class AutocallPayoff : IPayoffCalculator { public decimal ComputePayoff(decimal[] path) { foreach(var (level, coupon) in _barriers) if(path[i] >= level) return _notional * (1 + coupon); return Math.Max(path.Last() - _strike, 0); } }` ◆ **Coupons** : `IFixedCoupon` (taux fixe × notional × DCF), `IFloatingCoupon` (SOFR/Euribor + spread), `IConditionalCoupon` (payé si sous-jacent > barrière à date d'observation). ◆ **Monte Carlo C#** : `Parallel.For(0, N_SIMULATIONS, i => { var path = GeneratePath(); payoffs[i] = payoff.ComputePayoff(path); }); decimal price = payoffs.Average() * DiscountFactor;`"
  },
  {
    "question": "VaR & Stress Test — C# multithreading + Python analytics",
    "answer": "**VaR Historique** : Python. `returns = prices.pct_change().dropna()` → `portfolio_returns = (returns * weights).sum(axis=1)` → `var_95 = np.percentile(portfolio_returns, 5)`. Source de données : kdb+ via `qpython` ou SQL Server EOD. ◆ **VaR Monte Carlo C#** : `var payoffs = new decimal[N]; Parallel.For(0, N, i => { var scenario = GenerateCorrelatedScenario(cholesky); payoffs[i] = portfolio.RevalueUnder(scenario); }); decimal var = Percentile(payoffs, 0.05m);` ◆ **Stress Test** : scénarios macro prédéfinis. `class StressScenario { string Name; Dictionary<string,decimal> ShockFactors; }` — `TaperTantrum2013` (+200bp taux), `Covid2020` (equity -35%), `Volmageddon2018` (VIX ×3). `portfolio.RevalueUnder(scenario)` → impact P&L. ◆ **Limites** : `IRiskLimit.Check(position) → bool` — Chain of Responsibility. `VaRLimit → DeltaLimit → ConcentrationLimit`."
  },
  {
    "question": "Risk Architecture — IRiskLimit, Chain of Responsibility, alertes",
    "answer": "**Interface** : `interface IRiskLimit { bool Check(Position pos, RiskMetrics metrics); string LimitName { get; } decimal Threshold { get; } }` ◆ **Implémentations** : `class VaRLimit : IRiskLimit`, `class DeltaLimit : IRiskLimit`, `class ConcentrationLimit : IRiskLimit`, `class SectorLimit : IRiskLimit`. ◆ **Chain of Responsibility** : `class RiskValidationPipeline { private readonly IEnumerable<IRiskLimit> _limits; public RiskResult Validate(Position p, RiskMetrics m) { foreach(var limit in _limits) { if(!limit.Check(p,m)) return RiskResult.Reject(limit.LimitName); } return RiskResult.Approve(); } }` ◆ **Alertes** : si limite dépassée → publish `RiskAlert` sur Kafka topic `risk.alerts` → C# WebSocket pousse vers React dashboard → Redux action `RISK_ALERT_RECEIVED` → composant `RiskGauge` se re-rend rouge. ◆ **DIP** : `RiskEngine` dépend de `IEnumerable<IRiskLimit>` injectée — nouvelles limites sans modifier le moteur."
  },
  {
    "question": "Visualisation — Plotly Python, Plotly.js React, surface 3D, heatmaps",
    "answer": "**Surface de volatilité 3D (Python)** : `fig = go.Figure(go.Surface(x=strikes, y=maturities, z=vol_matrix, colorscale='Viridis')); fig.update_layout(scene=dict(xaxis_title='Strike', yaxis_title='Maturity', zaxis_title='Vol'))` ◆ **P&L Ladder (Python)** : `go.Heatmap(x=strikes, y=dates, z=pnl_matrix, colorscale='RdYlGn')` — visualise le P&L par strike et date d'observation. ◆ **Stress Test Dashboard (React+Plotly.js)** : `<Plot data={[{type:'bar', x:scenarios, y:impacts, marker:{color:impacts.map(v=>v<0?'red':'green')}}]} />` ◆ **Greeks par strike (heatmap React)** : Delta/Gamma/Vega dans une grille colorée, mise à jour via WebSocket. Redux action `GREEKS_UPDATED` → selector mémoïsé → Plotly re-render partiel. ◆ **Export Dash** : app Python Dash pour les quants — graphiques interactifs sans frontend Angular/React."
  },
  {
    "question": "CIB vs Asset Management — Environnements et outils",
    "answer": "**CIB** : latence critique (< 10ms), C# dominant pour les moteurs transactionnels, kdb+ pour tick data, FIX/gRPC pour les protocoles, Redis pour le cache, Kafka pour les événements, React+Redux pour les blotters, co-location possible. Python pour les modèles quant (Greeks, VaR). ◆ **Asset Management** : latence moins critique (secondes acceptables), Python central (Pandas, Jupyter, Plotly), SQL Server pour le référentiel et les positions, Excel/VBA encore très présents pour les reporting gérants, SFTP pour la livraison des rapports, Access pour les petites structures. C# pour les applications web Angular (portail gérant). ◆ **Commun aux deux** : Python Pandas pour les analytics EOD, SQL Server pour les données de référence, Git pour le versioning (remplace progressivement VBA non versionné)."
  },
  {
    "question": "Excel, VBA, Access, SFTP — Environnement AM legacy",
    "answer": "**Excel + VBA** : omniprésent en AM. `Sub ComputeNAV(): For Each pos In Positions: pos.Value = GetPrice(pos.ISIN) * pos.Quantity: Next: End Sub`. ⚠️ Non versionné, fragile (formules cassées), non testable, dangereux en production. ◆ **Access** : petites structures AM. Tables `Trades`, `Positions`, `Instruments`. Connexion depuis Python via `pyodbc`. Limite : non scalable, mono-utilisateur, pas de transactions robustes. ◆ **Migration** : VBA → Python + SQL Server. `openpyxl` génère les fichiers Excel sans Excel installé côté serveur. `xlwings` permet d'appeler Python depuis Excel — chemin de migration progressif. ◆ **SFTP Python** : `import paramiko; sftp.put('report_20240115.xlsx', '/remote/reporting/report_20240115.xlsx')` → livraison automatique au gérant ou au régulateur. ◆ **Règle AM** : SQL Server pour la vérité, Excel pour la présentation — jamais l'inverse."
  },
  {
    "question": "Stack complète CIB — Desk Options front office",
    "answer": "**Flux** : trader saisit l'ordre dans Angular → REST API C# ASP.NET Core → `Order` object créé, validé (getters filtrés) → `Channel<Order>` writer → moteur C# async → RMS vérifie `VaRLimit` + `DeltaLimit` (Chain of Responsibility) → `RiskApproved` sur Kafka → EMS routes via FIX → broker confirme `ExecutionReport 35=8` → `OrderFilled` publié sur Kafka → PMS C# met à jour les positions → Python recalcule la VolSurface → Redis cache mis à jour → WebSocket pousse Greeks + P&L vers React+Redux blotter → Plotly.js heatmap re-rendue. ◆ **Multithread** : `Task.WhenAll` pour Greeks simultanés. `Parallel.For` pour Monte Carlo VaR. `Channel<T>` pour le pipeline d'ordres. `async/await` pour tous les accès DB et réseau. ◆ **DB** : SQL Server (référentiel), Redis (cache intraday), kdb+ (tick data Greeks historiques)."
  },
  {
    "question": "Stack complète AM — Gestion de portefeuille",
    "answer": "**Flux EOD** : clôture des marchés → Python télécharge les prix EOD depuis Bloomberg BLPAPI (`blpapi.Session`) → Pandas calcule NAV par fonds → `openpyxl` génère rapport Excel → `paramiko` SFTP vers gérant → SQL Server mis à jour (positions, NAV historique). ◆ **Rebalancing** : Portfolio Manager dans Angular décide → C# OMS crée les ordres → validation light (pas de co-location) → FIX vers broker → confirmation → PMS Python met à jour → Plotly dashboard attribution de performance. ◆ **Stress Test AM** : Python scénarios (Pandas + NumPy) sur positions SQL Server → résultats dans DataFrame → Plotly graphiques interactifs dans Jupyter pour le risk manager. ◆ **VBA legacy → Python** : `xlwings` permet aux gérants de cliquer un bouton Excel qui appelle Python → calcul Pandas → résultats injectés dans la feuille Excel. Migration progressive sans rupture."
  },
  {
    "question": "Multithread C# — Patterns pour le front office",
    "answer": "**`async/await`** : pour toute opération I/O (DB, réseau, FIX). `await orderRepo.SaveAsync(order)` libère le thread. Règle : méthodes async jusqu'au bout de la chaîne — pas de `.Result` ou `.Wait()` (deadlock). ◆ **`Task.WhenAll`** : parallélisme logique. `await Task.WhenAll(ComputeDeltaAsync(), ComputeVegaAsync(), CheckRiskLimitsAsync())` — les trois partent simultanément. ◆ **`Parallel.For/ForEach`** : parallélisme CPU-bound. Monte Carlo (N=100 000 simulations), calcul de Greeks sur un book de 1000 options. Utilise tous les cœurs. ◆ **`Channel<T>`** : pipeline producteur/consommateur haute performance. Remplace `ConcurrentQueue` pour les scénarios avec backpressure. ◆ **`ConcurrentDictionary`** : cache thread-safe des Greeks par option. `_cache.AddOrUpdate(optionId, greeks, (k,v) => greeks)`. ◆ **`lock` / `SemaphoreSlim`** : à éviter sur les hot paths — préférer les structures lock-free."
  },
  {
    "question": "Python async — asyncio, aiohttp, appels Bloomberg simultanés",
    "answer": "**`asyncio`** : boucle événementielle Python pour les I/O concurrentes. `async def get_price(isin): async with aiohttp.ClientSession() as s: resp = await s.get(f'/api/prices/{isin}'); return await resp.json()` ◆ **Appels Bloomberg simultanés** : `async def enrich_portfolio(positions): tasks = [get_bloomberg_data(p.isin) for p in positions]; results = await asyncio.gather(*tasks)` — tous les appels Bloomberg partent en parallèle. Sans async : 500 positions × 100ms = 50 secondes. Avec asyncio : ~200ms total. ◆ **FastAPI** : framework async natif pour exposer les résultats Python (Greeks, VaR) vers le frontend Angular/React. `@app.get('/risk/var') async def get_var(desk: str): return await risk_engine.compute_var(desk)` ◆ **Pandas + async** : calculs CPU-bound dans un `ThreadPoolExecutor` pour ne pas bloquer la boucle asyncio. `loop.run_in_executor(executor, compute_var_pandas, df)`"
  },
  {
    "question": "Connexion Python ↔ C# — gRPC, REST, DB partagée, Redis",
    "answer": "**gRPC (recommandé pour CIB)** : contrat `.proto` versionné. `service PricingService { rpc ComputeGreeks(OptionRequest) returns (GreeksResponse); rpc StreamMarketData(Empty) returns (stream PriceUpdate); }` C# serveur, Python client `grpc`. Binaire, rapide, streaming. ◆ **REST/FastAPI (AM)** : Python expose `GET /greeks/{option_id}`, C# consomme via `HttpClient`. Simple, acceptable si latence > 100ms. ◆ **Redis partagé** : C# OMS écrit les ordres validés dans Redis. Python RMS lit et calcule le risque. Découplage temporel. `redis.set('order:12345', json.dumps(order_dict), ex=3600)`. ◆ **SQL Server partagé** : ⚠️ couplage de données fort — acceptable en AM (une seule équipe), à éviter en CIB microservices. ◆ **Kafka** : C# produit `OrderCreated`, Python consomme via `confluent-kafka`. Découplage total, rejouable."
  },
  {
    "question": "Sécurité et cohérence des données — Immutabilité, validation, audit",
    "answer": "**Immutabilité des ordres** : `record Order(Guid Id, string Symbol, decimal Qty, OrderStatus Status)` — `record` C# = immutable par défaut. Modifier un ordre = créer un nouvel objet (Event Sourcing). ◆ **Validation en entrée** : `private void Validate() { if(Quantity <= 0) throw new DomainException(\"Qty must be positive\"); if(string.IsNullOrEmpty(Symbol)) throw new DomainException(\"Symbol required\"); }` — appelé dans le constructeur, jamais d'ordre invalide créé. ◆ **Audit trail** : chaque changement de statut est un événement Kafka immuable. `OrderStatusChanged { OrderId, OldStatus, NewStatus, Timestamp, UserId }` — rejoué pour reconstituer l'historique complet. ◆ **Réglementation** : MiFID II exige la conservation de tous les ordres et modifications pendant 5 ans. Kafka + S3/Azure Blob = archive immuable et rejouable. ◆ **Python** : `@dataclass(frozen=True) class OptionSnapshot:` — immutable pour les snapshots de valorisation."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un getter filtré dans une classe Order C# en front office ?",
      "options": [
        "Une méthode qui filtre les ordres dans une liste.",
        "Une propriété qui contrôle la valeur retournée — ex : `public decimal Qty => _qty > 0 ? _qty : 0` garantit qu'on n'expose jamais une quantité négative.",
        "Un filtre SQL qui récupère uniquement les ordres actifs.",
        "Une méthode async qui récupère l'ordre depuis la base de données."
      ],
      "answer": "Une propriété qui contrôle la valeur retournée — ex : `public decimal Qty => _qty > 0 ? _qty : 0` garantit qu'on n'expose jamais une quantité négative.",
      "explanation": "Getter filtré = Encapsulation appliquée à la validation. Le champ `_qty` est `private`, la propriété publique filtre avant d'exposer. En front office, cela évite qu'un bug dans le moteur de pricing reçoive une quantité négative et génère un trade inversé. Pattern fondamental dans les classes métier : Order, Position, OptionContract."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le FIX tag `35=D` dans le flux d'un ordre ?",
      "options": [
        "Le délai de traitement de l'ordre en millisecondes.",
        "Le type de message FIX : `D` = NewOrderSingle — message envoyé par l'OMS C# pour passer un ordre d'achat ou de vente.",
        "Le desk d'origine de l'ordre (D = Derivatives).",
        "Le statut de l'ordre après exécution."
      ],
      "answer": "Le type de message FIX : `D` = NewOrderSingle — message envoyé par l'OMS C# pour passer un ordre d'achat ou de vente.",
      "explanation": "En FIX Protocol, le tag 35 (MsgType) identifie le type de message. `35=D` = NewOrderSingle = demande de passage d'ordre. `35=8` = ExecutionReport = réponse du broker. `35=F` = OrderCancelRequest. Connaître ces tags est essentiel pour débugger un flux FIX en front office CIB."
    },
    {
      "question": "[Définition → Terme] Dans une classe C# d'options, une méthode déclarée `abstract` dans la classe parente et redéfinie avec `override` dans chaque type d'option (Call, Put, Barrier) pour calculer un prix différent illustre quel pilier POO ?",
      "options": [
        "Encapsulation — les données de pricing sont cachées.",
        "Héritage seul — la classe enfant étend la classe parente.",
        "Polymorphisme — une même signature `Price()` produit un résultat différent selon le type réel de l'option.",
        "Abstraction — l'interface masque la complexité."
      ],
      "answer": "Polymorphisme — une même signature `Price()` produit un résultat différent selon le type réel de l'option.",
      "explanation": "Polymorphisme appliqué au desk options : `List<BaseOption> book` → `Parallel.ForEach(book, opt => opt.Price(md))` — chaque option exécute sa propre formule. EuropeanCall utilise Black-Scholes, BarrierOption utilise une PDE, AsianOption utilise une moyenne de chemin. Même appel, N comportements différents. C'est ce qui permet de valoriser un book hétérogène sans `switch/case`."
    },
    {
      "question": "[Définition → Terme] Un mécanisme C# qui permet de lancer `ComputeDelta()`, `ComputeVega()` et `ComputeTheta()` en parallèle et d'attendre que les trois soient terminés avant de continuer s'appelle ?",
      "options": [
        "`Thread.Sleep()` avec un délai fixe.",
        "`Task.WhenAll(deltaTask, vegaTask, thetaTask)` — attend la complétion de toutes les tâches simultanées.",
        "`ConcurrentQueue.Enqueue()` pour chaque calcul.",
        "`Parallel.For()` avec un index pour chaque Greek."
      ],
      "answer": "`Task.WhenAll(deltaTask, vegaTask, thetaTask)` — attend la complétion de toutes les tâches simultanées.",
      "explanation": "`Task.WhenAll` est l'outil pour le parallélisme logique I/O-bound ou CPU-bound léger. Pour le desk options, calculer 5 Greeks séquentiellement sur 500 options = goulot d'étranglement. `Task.WhenAll` les lance tous simultanément et retourne quand le plus lent est terminé. Différent de `Parallel.ForEach` qui est optimisé pour le CPU-bound pur (Monte Carlo)."
    },
    {
      "question": "[Caractéristiques → Concept] `abstract class`, méthode `abstract Price()`, implémentations `EuropeanCall`, `BarrierOption`, `AsianOption`, `override` dans chaque sous-classe, `List<BaseOption>` itérée uniformément. Quel pattern d'architecture ?",
      "options": [
        "Singleton — une seule instance du moteur de pricing.",
        "Builder — construction étape par étape de l'option.",
        "Template Method + Polymorphisme — squelette commun dans la classe abstraite, variations dans les sous-classes.",
        "Observer — les options notifient les abonnés des changements de prix."
      ],
      "answer": "Template Method + Polymorphisme — squelette commun dans la classe abstraite, variations dans les sous-classes.",
      "explanation": "Template Method : `BaseOption` définit le squelette du processus de pricing (validation des inputs, calcul du discount factor, appel à `Price()` abstraite). Chaque sous-classe fournit sa variation dans `Price()`. Polymorphisme : l'itération sur `List<BaseOption>` appelle la bonne formule pour chaque type. Ce pattern est omniprésent dans les moteurs de pricing CIB."
    },
    {
      "question": "[Caractéristiques → Concept] `Parallel.For(0, N_SIMULATIONS, i => { ... payoffs[i] = ... })`, `ConcurrentBag<decimal>`, `N=100000`, calcul de distribution de P&L, percentile 5%. Quel type de calcul risk ?",
      "options": [
        "VaR Historique — rejouer les rendements passés.",
        "Stress Test — scénario macro prédéfini.",
        "VaR Monte Carlo — simulation de N chemins aléatoires pour estimer la distribution de P&L.",
        "Greeks par différences finies."
      ],
      "answer": "VaR Monte Carlo — simulation de N chemins aléatoires pour estimer la distribution de P&L.",
      "explanation": "Indicateurs : N simulations parallèles (Parallel.For), stockage thread-safe (ConcurrentBag), calcul de percentile 5% = VaR à 95%. Le Monte Carlo génère N chemins de prix aléatoires (souvent via décomposition de Cholesky pour les corrélations), revalorise le portfolio sur chaque chemin, puis prend le 5ème percentile de la distribution. Parallel.For utilise tous les cœurs CPU disponibles — critique pour la performance en CIB."
    },
    {
      "question": "Quelle est la différence entre `Task.WhenAll` et `Parallel.ForEach` pour le calcul de Greeks en C# ?",
      "options": [
        "Ce sont des synonymes — seule la syntaxe diffère.",
        "`Task.WhenAll` est pour les opérations I/O-bound (DB, réseau) en parallèle. `Parallel.ForEach` est pour les calculs CPU-bound intensifs (valorisation de 1000 options).",
        "`Task.WhenAll` est plus rapide que `Parallel.ForEach` dans tous les cas.",
        "`Parallel.ForEach` est réservé aux listes, `Task.WhenAll` aux tableaux."
      ],
      "answer": "`Task.WhenAll` est pour les opérations I/O-bound (DB, réseau) en parallèle. `Parallel.ForEach` est pour les calculs CPU-bound intensifs (valorisation de 1000 options).",
      "explanation": "Distinction fondamentale en C# front office : `Task.WhenAll` libère les threads pendant l'attente I/O — idéal pour `await Task.WhenAll(getBBGPrice, getSQLPosition, checkRiskLimit)`. `Parallel.ForEach` utilise le ThreadPool pour saturer les cœurs CPU — idéal pour valoriser 1000 options ou simuler 100 000 scénarios Monte Carlo. Utiliser `Task.WhenAll` pour du CPU-bound = threads occupés sans gain de performance."
    },
    {
      "question": "Dans un environnement AM, pourquoi `xlwings` est-il préférable à remplacer brutalement tous les fichiers VBA Excel ?",
      "options": [
        "xlwings est plus rapide que VBA pour les calculs.",
        "xlwings permet d'appeler Python depuis Excel via un bouton — migration progressive sans rupture : les gérants gardent leurs feuilles Excel habituelles, Python remplace les calculs VBA en arrière-plan.",
        "xlwings génère automatiquement du code C# depuis VBA.",
        "xlwings remplace SQL Server pour le stockage des données."
      ],
      "answer": "xlwings permet d'appeler Python depuis Excel via un bouton — migration progressive sans rupture : les gérants gardent leurs feuilles Excel habituelles, Python remplace les calculs VBA en arrière-plan.",
      "explanation": "En AM, les gérants ont 10 ans de feuilles Excel métier. Remplacer brutalement par une app web = résistance au changement et risque opérationnel. xlwings = migration douce : un bouton Excel appelle Python, Python (Pandas, NumPy) exécute le calcul, les résultats sont injectés dans la feuille. Les gérants voient le même Excel, les équipes IT gèrent du Python versionné et testable. Progressivement, Excel devient une interface, Python devient la vérité."
    },
    {
      "question": "Quelle est la surface de volatilité et pourquoi est-elle critique pour le pricing des options en front office CIB ?",
      "options": [
        "Un graphique 2D montrant l'évolution du prix d'une action dans le temps.",
        "Une grille 3D de volatilités implicites (axe strike × axe maturité) extraite des prix d'options cotées — entrée essentielle de tout modèle de pricing (Black-Scholes, Heston).",
        "Une mesure de la volatilité réalisée d'un portefeuille d'actions.",
        "Un indicateur de risque équivalent à la VaR."
      ],
      "answer": "Une grille 3D de volatilités implicites (axe strike × axe maturité) extraite des prix d'options cotées — entrée essentielle de tout modèle de pricing (Black-Scholes, Heston).",
      "explanation": "La VolSurface est le cœur du desk options : chaque option cotée donne une volatilité implicite σ(K,T). La grille complète permet de pricer n'importe quelle option non cotée par interpolation. Sans VolSurface cohérente, le pricing est faux et les Greeks sont biaisés. La mettre à jour en temps réel (chaque tick de prix d'option) est le rôle du Market Data Handler couplé au moteur C# de calibration."
    },
    {
      "question": "[Concept → Caractéristiques] Quels sont les composants d'une VaR Monte Carlo implémentée en C# pour un desk options CIB ?",
      "options": [
        "SQL Server + SFTP + Excel.",
        "N simulations de chemins de prix (corrélés via Cholesky) + revalorisation du portfolio sur chaque chemin (`Parallel.For`) + stockage thread-safe (`ConcurrentBag`) + percentile 5% du P&L distribué.",
        "Python Pandas + `np.percentile` + kdb+ source data.",
        "FIX Protocol + Redis + Kafka."
      ],
      "answer": "N simulations de chemins de prix (corrélés via Cholesky) + revalorisation du portfolio sur chaque chemin (`Parallel.For`) + stockage thread-safe (`ConcurrentBag`) + percentile 5% du P&L distribué.",
      "explanation": "VaR Monte Carlo C# : (1) Générer N chemins aléatoires corrélés via décomposition de Cholesky (corrélations entre sous-jacents). (2) Pour chaque chemin, revatoriser tout le portfolio (`BaseOption.Price(scenario)`). (3) `ConcurrentBag` pour stocker les P&L en thread-safe. (4) Trier et prendre le 5ème percentile = VaR 95%. `Parallel.For` utilise tous les cœurs CPU — 100 000 simulations en < 1 seconde sur un serveur 32 cœurs."
    },
    {
      "question": "Quel mécanisme C# garantit qu'une quantité d'ordre ne peut jamais être négative, même si un bug interne calcule mal ?",
      "options": [
        "Un test unitaire qui vérifie la valeur.",
        "Un getter filtré : `public decimal Quantity => _quantity > 0 ? _quantity : 0` — la propriété publique filtre le champ privé avant exposition.",
        "Un attribut `[Required]` sur la propriété.",
        "Un `if` dans chaque méthode qui utilise la quantité."
      ],
      "answer": "Un getter filtré : `public decimal Quantity => _quantity > 0 ? _quantity : 0` — la propriété publique filtre le champ privé avant exposition.",
      "explanation": "Encapsulation défensive : le champ `_quantity` est `private`, la propriété contrôle ce qui sort. Même si un bug interne assigne -500 à `_quantity`, toute lecture externe via `Quantity` retourne 0 — l'ordre ne sera jamais envoyé avec une quantité négative. En front office, cette protection évite des trades accidentels inversés qui peuvent coûter des millions. Compléter avec une validation dans le constructeur : `if(quantity <= 0) throw new DomainException(...)`."
    },
    {
      "question": "Dans un flux front office CIB, quel est le rôle du FIX Drop Copy ?",
      "options": [
        "Une copie de sauvegarde des fichiers FIX en cas de panne.",
        "Une copie en temps réel de tous les messages FIX envoyés vers le système de surveillance/compliance et le RMS — sans interférer avec le flux d'exécution.",
        "Un mécanisme de rejeu des ordres FIX en cas d'erreur.",
        "Un format FIX spécial pour les ordres d'options."
      ],
      "answer": "Une copie en temps réel de tous les messages FIX envoyés vers le système de surveillance/compliance et le RMS — sans interférer avec le flux d'exécution.",
      "explanation": "FIX Drop Copy = monitoring passif. Chaque message FIX (ordres, exécutions, annulations) est copié vers un troisième destinataire (compliance, RMS, surveillance desk) en plus du broker cible. Le flux principal n'est pas modifié. En CIB, c'est le mécanisme standard pour que le risk manager voie en temps réel tous les trades du desk sans être dans le chemin critique d'exécution."
    },
    {
      "question": "Pourquoi Python `asyncio.gather()` est-il préférable à des appels Bloomberg séquentiels pour enrichir 500 positions en AM ?",
      "options": [
        "Bloomberg ne supporte pas les appels séquentiels.",
        "Séquentiel : 500 × 100ms = 50 secondes. `asyncio.gather(*tasks)` lance tous les appels simultanément : ~200ms total — tous les appels I/O partent en parallèle sans bloquer.",
        "asyncio est plus rapide que les threads Python.",
        "Bloomberg BLPAPI exige l'utilisation d'asyncio."
      ],
      "answer": "Séquentiel : 500 × 100ms = 50 secondes. `asyncio.gather(*tasks)` lance tous les appels simultanément : ~200ms total — tous les appels I/O partent en parallèle sans bloquer.",
      "explanation": "Gain de performance fondamental en AM pour les calculs EOD : enrichir 500 positions séquentiellement prend 50 secondes. `asyncio.gather` lance tous les appels Bloomberg simultanément — la latence totale ≈ la latence du plus lent, pas la somme. Applicable à tous les appels I/O (REST APIs, DB). Pour les calculs CPU-bound (Pandas, NumPy), utiliser `ThreadPoolExecutor` car asyncio ne parallélise pas le CPU (GIL Python)."
    },
    {
      "question": "[Ordre de dépendance] Dans un moteur de pricing C# pour le desk options, quel mécanisme POO est prérequis pour pouvoir itérer `Parallel.ForEach(book, opt => opt.Price(md))` sur un book hétérogène ?",
      "options": [
        "Encapsulation — les données de prix sont privées.",
        "Polymorphisme + Abstraction — `BaseOption` abstrait avec `abstract decimal Price()` est prérequis pour que chaque type d'option soit traité uniformément sans `switch/case`.",
        "Héritage seul — les options héritent d'une classe commune.",
        "Singleton — une seule instance du moteur de pricing."
      ],
      "answer": "Polymorphisme + Abstraction — `BaseOption` abstrait avec `abstract decimal Price()` est prérequis pour que chaque type d'option soit traité uniformément sans `switch/case`.",
      "explanation": "Ordre de dépendance : pour itérer uniformément sur `List<BaseOption>`, il faut (1) Abstraction : `BaseOption` avec `abstract decimal Price()` — le contrat commun. (2) Polymorphisme : chaque sous-classe (`EuropeanCall`, `BarrierOption`) `override` `Price()`. Sans ces deux prérequis, l'itération `Parallel.ForEach` est impossible — il faudrait un `switch(opt.GetType())` qui viole OCP et ne scale pas."
    },
    {
      "question": "[Erreur de contexte AM] Un gérant AM utilise une feuille Excel Access (`.mdb`) comme base de données principale pour stocker 10 ans de positions de fonds. Quelle erreur commet-il ?",
      "options": [
        "Excel Access est parfaitement adapté pour stocker des positions financières.",
        "Access = mono-utilisateur, pas de transactions robustes, non scalable, non versionné, risque de corruption — inacceptable comme source de vérité pour des positions réglementées (OPCVM, reporting AMF).",
        "La seule erreur est l'absence de backup automatique.",
        "Access ne supporte pas les nombres décimaux — les prix seront arrondis."
      ],
      "answer": "Access = mono-utilisateur, pas de transactions robustes, non scalable, non versionné, risque de corruption — inacceptable comme source de vérité pour des positions réglementées (OPCVM, reporting AMF).",
      "explanation": "Anti-pattern AM classique : Access comme base de production. Problèmes : (1) Mono-utilisateur — deux gestionnaires simultanés corrompent le fichier. (2) Pas de transactions ACID — une mise à jour partielle laisse des données incohérentes. (3) Non versionné — impossible de savoir qui a modifié quoi. (4) Réglementaire : l'AMF exige la traçabilité et l'intégrité des données OPCVM. Solution : SQL Server avec EF Core C# + audit trail Kafka."
    }
  ],
  avance: [
    {
      "question": "[Thème A → Thème B] Comment la classe `Order` C# avec getters filtrés applique-t-elle le principe DDD (Domain-Driven Design) de protection des invariants métier ?",
      "options": [
        "En utilisant des annotations `[Required]` sur les propriétés.",
        "Constructeur `private` + factory method `Order.Create()` qui valide les invariants + getters filtrés (`Qty > 0`) + méthodes `Execute()`/`Cancel()` seules autorisées à changer le statut — l'objet est toujours dans un état valide.",
        "En sérialisant l'ordre en JSON et le revalidant à chaque lecture.",
        "En utilisant un middleware ASP.NET Core pour valider les ordres."
      ],
      "answer": "Constructeur `private` + factory method `Order.Create()` qui valide les invariants + getters filtrés (`Qty > 0`) + méthodes `Execute()`/`Cancel()` seules autorisées à changer le statut — l'objet est toujours dans un état valide.",
      "explanation": "DDD tactique appliqué à l'Order : (1) Constructeur `private` = personne ne crée un Order partiellement initialisé. (2) `Order.Create(symbol, qty, price)` = factory qui valide avant construction. (3) Getters filtrés = défense en profondeur contre les états invalides. (4) `Execute()` et `Cancel()` = seuls chemins pour changer le statut, avec leurs propres validations. L'objet est sa propre protection — pas besoin de valider à l'extérieur."
    },
    {
      "question": "[Anti-pattern + Multithread] Un dev CIB implémente `public static Dictionary<string, decimal> VolCache = new();` dans le moteur de pricing C# multi-thread. Listez toutes les violations.",
      "options": [
        "Aucune — `static` est plus performant.",
        "Encapsulation rompue (public mutable) + race conditions (Dictionary non thread-safe sous charge) + DIP violé (couplage statique non mockable) + Singleton mal implémenté (pas de contrôle).",
        "SRP violé uniquement.",
        "Performance insuffisante — Dictionary est trop lent."
      ],
      "answer": "Encapsulation rompue (public mutable) + race conditions (Dictionary non thread-safe sous charge) + DIP violé (couplage statique non mockable) + Singleton mal implémenté (pas de contrôle).",
      "explanation": "4 violations dans un desk options : (1) `public` = n'importe quel thread modifie les vols directement — une mise à jour partielle de la VolSurface peut donner des vols incohérentes. (2) `Dictionary` non thread-safe : sous `Parallel.ForEach` 1000 options, les opérations concurrentes corrompent la structure. (3) Classe statique = impossible de mocker en tests. (4) Pas de Lazy<T> ni de lock = création non contrôlée. Solution : `ICacheService` injectée, `ConcurrentDictionary<string,decimal>`, `IVolatilitySurfaceCache`."
    },
    {
      "question": "[Concept → Pattern + Architecture] Comment `IPayoffCalculator` injectée dans le moteur de produits structurés applique-t-il simultanément Strategy, DIP et OCP ?",
      "options": [
        "Strategy seul — l'algorithme est interchangeable.",
        "Strategy (algorithme payoff interchangeable) + DIP (moteur dépend de `IPayoffCalculator`, pas de `AutocallPayoff` concrète) + OCP (ajouter un nouveau produit structuré = nouvelle classe `IPayoffCalculator`, zéro modification du moteur).",
        "Builder + Singleton.",
        "Observer + Chain of Responsibility."
      ],
      "answer": "Strategy (algorithme interchangeable) + DIP (moteur dépend de `IPayoffCalculator`, pas de `AutocallPayoff` concrète) + OCP (nouveau produit = nouvelle classe, zéro modification moteur).",
      "explanation": "Triple application sur le desk structurés : Strategy = `IPayoffCalculator` est swappable (`VanillaCallPayoff`, `AutocallPayoff`, `ReverseConvertible`). DIP = le moteur Monte Carlo reçoit `IPayoffCalculator` par injection — il ignore l'implémentation concrète. OCP = lancer un nouveau produit structuré (ex : `PhoenixAutocall`) = créer `PhoenixPayoff : IPayoffCalculator`, enregistrer dans le DI. Zéro modification du moteur de simulation — zéro régression sur les produits existants."
    },
    {
      "question": "[Refactoring + async] Un moteur de Greeks CIB calcule Delta, Gamma, Vega, Theta séquentiellement via des appels async à la VolSurface. Le calcul prend 800ms pour 500 options. Comment refactoriser ?",
      "options": [
        "Utiliser `Thread.Sleep(0)` entre les calculs pour libérer le CPU.",
        "Remplacer le calcul séquentiel par `await Task.WhenAll(book.Select(opt => Task.Run(() => opt.ComputeGreeks(md))))` — tous les Greeks partent en parallèle, latence ≈ celle du calcul le plus lent.",
        "Ajouter plus de RAM au serveur.",
        "Utiliser `Parallel.For` avec un index au lieu de `Task.WhenAll`."
      ],
      "answer": "Remplacer le calcul séquentiel par `await Task.WhenAll(book.Select(opt => Task.Run(() => opt.ComputeGreeks(md))))` — tous les Greeks partent en parallèle, latence ≈ celle du calcul le plus lent.",
      "explanation": "Refactoring parallélisme : séquentiel = 500 × 1.6ms = 800ms. `Task.WhenAll` sur 500 `Task.Run` = tous les calculs CPU-bound partent sur le ThreadPool simultanément. Avec 32 cœurs : 500/32 ≈ 16 batches × 1.6ms ≈ 25ms. Gain : ×32 sur la latence. `ConcurrentBag<Greeks>` pour stocker les résultats thread-safe. En production CIB, ce type de refactoring est la différence entre un moteur de risk utilisable et un moteur trop lent pour le marché ouvert."
    },
    {
      "question": "[Thème A → Thème B] Comment le pattern Chain of Responsibility pour les limites de risk (`IRiskLimit`) applique-t-il SRP et OCP simultanément ?",
      "options": [
        "SRP seul — chaque limite a une responsabilité.",
        "SRP (chaque `IRiskLimit` contient une seule règle : VaR, Delta, Concentration) + OCP (ajouter une limite ESG = créer `ESGConcentrationLimit : IRiskLimit`, insérer dans le pipeline — zéro modification du moteur existant).",
        "DIP seul — le moteur dépend d'une interface.",
        "LSP + ISP uniquement."
      ],
      "answer": "SRP (chaque `IRiskLimit` = une règle) + OCP (nouvelle limite = nouvelle classe, zéro modification du moteur).",
      "explanation": "Chain of Responsibility + SOLID en risk management : SRP = `VaRLimit` ne vérifie que la VaR, `DeltaLimit` ne vérifie que le Delta. Si la règle VaR change, seule `VaRLimit` est modifiée — pas les autres. OCP = la direction risk demande une nouvelle limite secteur tech (GAFAM) → créer `TechSectorConcentrationLimit : IRiskLimit`, l'ajouter à la collection injectée. Le `RiskValidationPipeline` ne change pas. Extensible sans risque de régression."
    },
    {
      "question": "[Code → Identification] `async Task<decimal> ComputeNAVAsync(Portfolio p) { var pricesTasks = p.Positions.Select(pos => GetPriceAsync(pos.ISIN)); var prices = await Task.WhenAll(pricesTasks); return prices.Zip(p.Positions, (price,pos) => price * pos.Qty).Sum(); }`. Qu'illustre ce code dans un contexte AM ?",
      "options": [
        "Un calcul de VaR Monte Carlo multi-thread.",
        "Un calcul de NAV (Net Asset Value) asynchrone — tous les prix Bloomberg sont récupérés en parallèle via `Task.WhenAll`, puis la NAV est calculée comme somme des prix × quantités.",
        "Un stress test sur scénarios macro.",
        "Un calcul de Greeks via différences finies."
      ],
      "answer": "Un calcul de NAV asynchrone — tous les prix Bloomberg sont récupérés en parallèle via `Task.WhenAll`, puis la NAV = somme(prix × quantités).",
      "explanation": "Lecture de code en contexte AM : `Select(pos => GetPriceAsync(pos.ISIN))` crée N tâches asynchrones (appels Bloomberg ou SQL). `Task.WhenAll` les lance toutes simultanément. `prices.Zip(positions, (price,pos) => price * pos.Qty).Sum()` = NAV = Σ(prix × quantité). Pattern classique AM pour le calcul EOD. En AM, 500 positions × 100ms séquentiel = 50s. Avec `Task.WhenAll` : ~200ms. Critique pour les fonds avec calcul NAV quotidien à heure fixe."
    },
    {
      "question": "[Erreur de contexte CIB] Un dev place un appel synchrone `VolSurface.Recalibrate()` (500ms) dans le thread de traitement des ordres FIX de l'OMS C#. Quel impact en production ?",
      "options": [
        "Aucun — la recalibration est rapide.",
        "Le thread FIX est bloqué 500ms à chaque recalibration — l'OMS ne peut pas accepter de nouveaux ordres pendant ce temps. À fort débit, les ordres s'accumulent et les brokers reçoivent des timeouts FIX (heartbeat manquant).",
        "La VolSurface sera incorrecte si recalibrée dans le thread FIX.",
        "Cela viole le protocole FIX 4.4."
      ],
      "answer": "Le thread FIX est bloqué 500ms — l'OMS ne peut pas accepter de nouveaux ordres pendant ce temps. Timeouts FIX (heartbeat manquant) et accumulation d'ordres.",
      "explanation": "Anti-pattern critique CIB : opération longue dans le hot path FIX. Le session FIX attend des heartbeats toutes les 30 secondes — si le thread est bloqué 500ms, les heartbeats sont retardés et le broker peut couper la session. Solution architecture : la recalibration VolSurface s'exécute dans un service dédié avec son propre scheduler (Timer ou Kafka event). Le thread FIX lit la VolSurface depuis un cache Redis mis à jour asynchroniquement — lecture < 1ms."
    },
    {
      "question": "[Multi-concepts] Une `VolatilitySurface` C# avec `private decimal[,] _grid`, `public decimal GetVol(decimal K, DateTime T) => Interpolate(K,T)`, et `private decimal Interpolate(...)` identifie quels concepts POO et quel pattern ?",
      "options": [
        "Singleton + Builder.",
        "Encapsulation (`private _grid`, getters contrôlés) + Abstraction (le consommateur appelle `GetVol()` sans connaître l'interpolation) + Value Object (la surface est immutable après construction).",
        "Observer + Strategy.",
        "Héritage + Polymorphisme."
      ],
      "answer": "Encapsulation (`private _grid`) + Abstraction (`GetVol()` masque l'interpolation) + Value Object (immutable après construction).",
      "explanation": "Analyse POO de VolatilitySurface : `private decimal[,] _grid` = Encapsulation (la grille brute n'est jamais exposée directement). `GetVol(K,T)` = Abstraction (le trader appelle `GetVol(55, T+30j)` sans savoir si c'est cubic spline ou bilinear). Value Object = une fois construite, la surface ne change pas — on en crée une nouvelle à chaque recalibration. Cela garantit la cohérence lors des calculs parallèles : plusieurs threads lisent la même instance immuable sans race condition."
    },
    {
      "question": "[Correspondance — Architecture → Use Case] Associez chaque contexte front office à son stack de visualisation optimal.",
      "options": [
        "Tous utilisent React+Redux+Plotly.js.",
        "Surface vol 3D quant → Python Plotly/Dash. Greeks temps réel trader → React+Redux+Plotly.js+WebSocket. Reporting EOD gérant AM → Python openpyxl+Excel/SFTP. Stress test risk manager → Jupyter+Plotly interactif.",
        "Surface vol → Angular. Greeks → VBA Excel. Reporting → kdb+. Stress test → SQL Server.",
        "Tout en Angular pour uniformiser le frontend."
      ],
      "answer": "Surface vol quant → Python Plotly/Dash. Greeks temps réel → React+Redux+Plotly.js+WebSocket. Reporting EOD gérant → Python openpyxl+Excel/SFTP. Stress test risk → Jupyter+Plotly.",
      "explanation": "Chaque use case a son outil optimal : Surface vol = Dash Python car le quant travaille en Python, pas besoin de couche API. Greeks temps réel = React+Redux pour l'état complexe + WebSocket pour le push. Reporting EOD gérant = Excel reste le standard de livraison en AM — Python génère, SFTP livre. Stress test risk manager = Jupyter pour l'exploration interactive et la modification de scénarios. One size fits all = compromis partout."
    },
    {
      "question": "[Refactoring CIB → AM] Un desk options CIB utilise `Parallel.ForEach` pour 100k simulations Monte Carlo en C#. Une petite structure AM veut le même calcul en Python. Quelle adaptation ?",
      "options": [
        "Réécrire toute la logique en VBA Excel.",
        "Python `numpy` vectorisé (opérations sur matrices) remplace `Parallel.ForEach` — `scenarios = np.random.multivariate_normal(mu, cov, N)` → `payoffs = np.maximum(scenarios - strike, 0)` → `var = np.percentile(payoffs, 5)`. Plus simple, sans multithreading explicite.",
        "Utiliser `asyncio.gather` pour les simulations Monte Carlo.",
        "Python ne peut pas faire du Monte Carlo — utiliser R."
      ],
      "answer": "Python NumPy vectorisé — `scenarios = np.random.multivariate_normal(mu, cov, N)` → opérations matricielles → `np.percentile(payoffs, 5)`. Sans multithreading explicite.",
      "explanation": "Adaptation CIB C# → AM Python : en C#, `Parallel.ForEach` utilise les threads pour paralléliser les simulations scalaires. En Python, le GIL empêche le vrai parallélisme thread, mais NumPy exécute les opérations matricielles en C sous-jacent sur tous les cœurs — vectorisation native. `np.random.multivariate_normal(mu, cov, 100000)` génère 100k scénarios en une opération. Plus simple à écrire, performances comparables. Pour les simulations vraiment complexes (chemins dépendants du chemin), utiliser `joblib.Parallel`."
    },
    {
      "question": "[Ordre de dépendance] Dans le flux complet d'un ordre CIB (Angular → C# OMS → RMS → EMS → FIX → Broker), quel composant est prérequis pour que le RMS puisse bloquer un ordre avant envoi FIX ?",
      "options": [
        "La base kdb+ pour les tick data historiques.",
        "Le cache Redis des Greeks et positions courantes, alimenté en temps réel — sans lui, le RMS n'a pas les données nécessaires pour évaluer l'impact du nouvel ordre sur la VaR et les limites.",
        "Le frontend Angular pour afficher la confirmation.",
        "Le SFTP pour envoyer le rapport de compliance."
      ],
      "answer": "Le cache Redis des Greeks et positions courantes — sans lui, le RMS n'a pas les données pour évaluer l'impact VaR.",
      "explanation": "Ordre de dépendance dans le flux : le RMS doit évaluer `VaR_actuelle + impact(nouvel_ordre) < limite`. Pour cela, il a besoin des positions courantes et des Greeks du book. Si Redis (cache temps réel) est vide ou non maintenu, le RMS travaille avec des données périmées — soit il bloque des ordres légitimes, soit il laisse passer des ordres dépassant les limites. Redis est le prérequis technique du contrôle de risque temps réel. Sans Redis, le RMS doit requêter SQL Server à chaque ordre — latence × 50."
    },
    {
      "question": "[Code → Multi-concepts] Ce pipeline Python : `df = pd.read_sql(query, conn)` → `greeks_df = compute_greeks(df)` → `fig = go.Figure(go.Heatmap(z=greeks_df.values))` → `fig.write_html('greeks.html')` → `sftp.put('greeks.html', '/remote/report.html')`. Identifiez les couches technologiques et leur rôle.",
      "options": [
        "Un seul outil Python qui fait tout.",
        "SQL Server (source données positions) → Pandas (calcul Greeks/agrégation) → Plotly (visualisation heatmap) → HTML (format livraison) → SFTP (transport vers gérant AM). Chaque outil joue son rôle dans la chaîne ETL-visualisation-livraison.",
        "kdb+ → Python → React → Kafka → FIX.",
        "C# → Redis → WebSocket → Angular."
      ],
      "answer": "SQL Server (source) → Pandas (calcul/agrégation) → Plotly (heatmap) → HTML → SFTP (livraison gérant AM).",
      "explanation": "Pipeline ETL AM complet en Python : `pd.read_sql` = Extract depuis SQL Server. `compute_greeks(df)` = Transform (calcul Greeks sur les positions, agrégation par sous-jacent). `go.Heatmap` = Load/Visualize (heatmap des Greeks en HTML interactif). `write_html` = format livrable sans serveur. `sftp.put` = livraison automatique au gérant ou au risk manager AM. Ce pipeline représente une journée de travail AM typique — comprendre chaque outil et son rôle est fondamental."
    },
    {
      "question": "[Anti-pattern inter-salle] L'équipe Paris et l'équipe Londres partagent le même topic Kafka `all-orders` sans versioning des schémas. Londres ajoute un champ `LEI` dans l'événement `OrderCreated`. Quel problème ?",
      "options": [
        "Kafka ne supporte pas les champs ajoutés.",
        "Couplage de contrat : le consommateur Paris (C# OMS) reçoit un champ inconnu et peut lever une exception de désérialisation — les ordres de Londres ne sont plus traités à Paris jusqu'au redéploiement synchronisé.",
        "Le champ LEI n'est pas compatible avec FIX Protocol.",
        "Kafka MirrorMaker 2 ne réplique pas les nouveaux champs."
      ],
      "answer": "Couplage de contrat : le consommateur Paris reçoit un champ inconnu et peut lever une exception de désérialisation — ordres Londres non traités jusqu'au redéploiement synchronisé.",
      "explanation": "Couplage de contrat inter-salle : sans Schema Registry (Avro + compatibilité backward), chaque changement de structure d'événement casse les consommateurs qui ne connaissent pas le nouveau champ. Solution : Schema Registry avec compatibilité `BACKWARD` — les nouveaux champs ont une valeur par défaut, les anciens consommateurs ignorent les champs inconnus. En pratique en CIB multi-salle : `BACKWARD_TRANSITIVE` compatibility + version dans le nom du topic (`orders.v2.created`) + migration progressive."
    },
    {
      "question": "[Refactoring AM → CIB] Un système AM calcule la VaR en batch Python nocturne (30 minutes). Le desk CIB a besoin de la même VaR en < 2 secondes en intraday. Quelle transformation architecturale ?",
      "options": [
        "Acheter un serveur plus rapide.",
        "AM batch → CIB temps réel : Python Pandas batch → C# `Parallel.For` Monte Carlo (zero-allocation) + précalcul incrémental (recalculer uniquement l'impact du nouvel ordre) + Redis cache des résultats + Kafka trigger sur chaque `OrderCreated`.",
        "Utiliser kdb+ à la place de Python.",
        "Augmenter le nombre de workers Python avec `multiprocessing`."
      ],
      "answer": "Python Pandas batch → C# `Parallel.For` Monte Carlo + précalcul incrémental + Redis cache + Kafka trigger sur `OrderCreated`.",
      "explanation": "Transformation batch → temps réel : (1) Langage : Python Pandas est excellent pour le batch mais C# avec `Parallel.For` et zero-allocation est 10-100x plus rapide pour les calculs répétitifs. (2) Architecture : ne pas recalculer la VaR entière à chaque ordre — calculer l'impact marginal du nouvel ordre sur la VaR existante (VaR incrémentale). (3) Cache : stocker la VaR courante dans Redis, la mettre à jour incrementalement. (4) Trigger : Kafka event `OrderCreated` → C# RMS calcule la VaR incrémentale → Redis mis à jour → WebSocket push vers le trader. < 2 secondes atteignable."
    },
    {
      "question": "[Multi-concepts — flux complet] Dans le flux `Angular (ordre) → C# OMS (Channel<Order>) → RMS (IRiskLimit Chain) → EMS (IExecutionVenue Strategy) → FIX → Broker → ExecutionReport → Kafka OrderFilled → PMS → Redis → WebSocket → Angular`, identifiez 5 patterns et principes.",
      "options": [
        "Singleton + Builder + Observer + Adapter + Facade.",
        "Channel<T> producteur/consommateur + Chain of Responsibility (IRiskLimit) + Strategy (IExecutionVenue SOR) + DIP (toutes les dépendances par interface) + Observer/EDA (Kafka OrderFilled → PMS/Redis/WebSocket).",
        "REST + SQL + SFTP + VBA + Excel.",
        "MVC + Repository + Factory + Prototype + Decorator."
      ],
      "answer": "Channel<T> producteur/consommateur + Chain of Responsibility (IRiskLimit) + Strategy (IExecutionVenue SOR) + DIP (dépendances par interface) + Observer/EDA (Kafka OrderFilled → PMS/Redis/WebSocket).",
      "explanation": "Analyse du flux CIB complet : `Channel<Order>` = pipeline producteur/consommateur lock-free (haute performance). `IRiskLimit` en chaîne = Chain of Responsibility (VaR → Delta → Concentration). `IExecutionVenue` injectée dans l'EMS = Strategy pattern (LSE, Euronext, dark pool interchangeables). Toutes les dépendances par interface = DIP. `OrderFilled` Kafka → PMS/Redis/WebSocket = Observer distribué (EDA). Ce flux est l'architecture de référence d'un desk CIB moderne — chaque composant est découplé, testable et remplaçable indépendamment."
    },
    {
      "question": "[Erreur de contexte + OOP] Un quant AM déclare `class VolatilitySurface: def __init__(self): self.grid = {}` en Python et modifie directement `surface.grid['BNPP']['1M'] = 0.25` depuis plusieurs scripts. Quel problème architectural ?",
      "options": [
        "Python ne supporte pas les dictionnaires imbriqués.",
        "Encapsulation rompue : `grid` public mutable accessible de l'extérieur. Plusieurs scripts peuvent écrire des vols incohérentes simultanément. Solution : `@property` + méthode `update_vol(symbol, tenor, vol)` avec validation (vol > 0, consistance calendar spread).",
        "Les performances sont insuffisantes avec un dictionnaire.",
        "Il faut utiliser NumPy arrays à la place d'un dictionnaire."
      ],
      "answer": "Encapsulation rompue : `grid` public mutable. Plusieurs scripts écrivent des vols incohérentes. Solution : `@property` + `update_vol()` avec validation.",
      "explanation": "Encapsulation Python : même principe qu'en C#. `self.grid = {}` public = n'importe quel script peut écrire `surface.grid['BNPP']['1M'] = -0.05` (vol négative !). En AM, si le script de calibration et le script de stress test écrivent simultanément (threads ou Jupyter notebooks ouverts en parallèle), la surface devient incohérente. Solution Python : `self._grid = {}` (convention privé), `@property` en lecture seule pour l'extérieur, `def update_vol(self, symbol, tenor, vol): assert vol > 0, 'Negative vol'; self._grid[symbol][tenor] = vol`."
    },
    {
      "question": "[Ordre de dépendance — CIB vs AM] Pourquoi la `VolatilitySurface` immutable est-elle prérequise pour la thread-safety dans le moteur de Greeks C# ?",
      "options": [
        "L'immutabilité améliore les performances de cache CPU.",
        "Une VolSurface immutable peut être lue simultanément par N threads `Parallel.ForEach` sans lock — si elle était mutable, chaque thread devrait acquérir un lock avant lecture, éliminant le bénéfice du parallélisme.",
        "L'immutabilité garantit que les Greeks sont toujours positifs.",
        "L'immutabilité est requise par le protocole FIX pour les données de marché."
      ],
      "answer": "VolSurface immutable = lecture simultanée par N threads sans lock — mutable nécessiterait des locks qui éliminent le bénéfice du parallélisme.",
      "explanation": "Ordre de dépendance : l'immutabilité est le prérequis de la thread-safety en lecture. Pattern : à chaque recalibration, on crée une *nouvelle* instance `VolatilitySurface` et on swape l'ancienne atomiquement (`Interlocked.Exchange` ou simple remplacement de référence). Pendant le calcul parallèle (`Parallel.ForEach` sur 1000 options), tous les threads lisent la même instance immuable — zéro lock, zéro contention. C'est le pattern Immutable Object, fondamental pour la performance en CIB. En AM Python : `@dataclass(frozen=True)` pour le même effet."
    },
    {
      "question": "[Flux inter-desk] Comment le netting cross-desk (equity long BNPP + credit short BNPP CDS) est-il architecturalement réalisé en temps réel dans un CIB multi-desk ?",
      "options": [
        "Un fichier Excel partagé entre les desks mis à jour manuellement.",
        "Chaque desk publie ses positions sur son topic Kafka dédié (`desk.equity.positions`, `desk.credit.positions`) → un service de netting C# consomme les deux topics → agrège les expositions nettes → publie sur `risk.net.positions` → RMS central calcule la VaR nette → Redis cache → dashboard risk direction.",
        "Un appel HTTP synchrone entre le desk equity et le desk credit à chaque trade.",
        "SQL Server partagé entre tous les desks — join query pour le netting."
      ],
      "answer": "Chaque desk publie sur son topic Kafka → service de netting C# consomme les deux → agrège → publie `risk.net.positions` → RMS central → Redis → dashboard.",
      "explanation": "Architecture netting temps réel : topics Kafka séparés par desk évitent le couplage. Le service de netting est un microservice C# dédié qui consomme N topics de positions et maintient un état agrégé. Pattern CQRS : l'écriture (chaque desk) est séparée de la lecture (position nette centrale). Redis cache la dernière position nette — le dashboard risk la lit en < 1ms. Si le desk credit est down, le service de netting continue avec les dernières positions connues — résilience par isolation."
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
  const totalScore = scores.moyen + scores.avance;
  const qMoyen = questions.moyen.length;
  const qAvance = questions.avance.length;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Écosystème technique salle de marché maîtrisé.</h3> : <p className="fail">📚 Révisez les systèmes et architectures de trading.</p>}
    </div>
  );
};

const Page5_1 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") { setLevel("avance"); } else { setShowResult(true); }
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

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
            Arch & Systèmes Trading 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
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

export default Page5_1;
