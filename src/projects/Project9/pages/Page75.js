// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — 20 fondations essentielles C#/.NET Finance/IT",
    "answer": "**Microservices** : découper une application en services indépendants (Trading, Risque, Reporting). Chaque service a sa propre DB, son déploiement, sa logique. ◆ **JSON** : format d'échange standard entre services — sérialisation/désérialisation `JsonSerializer`, contrats partagés. ◆ **MSMQ / RabbitMQ** : file de messages asynchrone — le producteur envoie, le consommateur traite quand il est prêt. Aucune perte si le service B est down. ◆ **async/await** : libère le thread pendant l'I/O (SQL, API, fichiers) — scalabilité sans threads bloqués. `Task` vs `Thread` : Task = léger, pool géré. Thread = lourd, manuel. ◆ **LINQ** : requêter des collections C# comme du SQL. `Where`, `Select`, `OrderBy`, `GroupBy`, `FirstOrDefault`. Traduit en SQL par Entity Framework. ◆ **Points de confusion clés** : `async void` vs `async Task`, `First()` vs `FirstOrDefault()`, `IQueryable` vs `IEnumerable`, `Serialize` vs `Deserialize`, `HTTP` vs `MSMQ`, producteur vs consommateur."
  },
  {
    "question": "Microservice — Définition, responsabilité unique, exemple Trading CIB",
    "answer": "**Définition** : un microservice est un service indépendant qui gère une responsabilité métier unique. Il a sa propre base de données, son propre déploiement, sa propre logique. Il ne partage RIEN avec les autres services directement. ◆ **Exemple CIB** : `TradeService` (créer/modifier/annuler les trades), `RiskService` (calculer VaR, Greeks, limites), `InstrumentService` (référentiel ISIN, caractéristiques), `ReportingService` (P&L, positions EOD). Chacun est un projet C# séparé déployé dans son propre container Docker. ◆ **Ce qu'un microservice NE fait PAS** : il ne lit pas directement la base d'un autre service, il ne partage pas ses objets internes, il ne connaît pas l'implémentation des autres. ◆ **Communication** : via REST API (synchrone) ou MessageQueue (asynchrone). Jamais via DB partagée — c'est l'anti-pattern n°1. ◆ **Règle de taille** : un microservice = ce qu'une petite équipe peut développer, déployer et comprendre complètement."
  },
  {
    "question": "Monolithe vs Microservices — Tableau comparatif et quand choisir",
    "answer": "**Monolithe** : une seule application, un seul déploiement, tout est couplé. Simple à démarrer, difficile à maintenir en équipe. Modifier le service Risque nécessite de redéployer toute l'application. ◆ **Microservices** : chaque service déployé indépendamment. `TradeService` peut être mis à jour sans toucher `RiskService`. Scalabilité : `RiskService` (CPU intensif) peut avoir 10 pods Kubernetes, `ReportingService` (utilisé 1×/jour) en a 1. ◆ **Quand choisir Microservices** : grande équipe (> 5 devs), plusieurs domaines métiers distincts, besoin de scalabilité différenciée, cycle de déploiement fréquent. ◆ **Quand garder un monolithe** : petite équipe, projet au démarrage (YAGNI), domaine métier non stabilisé — migrer vers microservices plus tard avec Strangler Fig. ◆ **⚠️ Point de confusion** : microservices ≠ meilleur dans tous les cas. Un monolithe bien structuré est préférable à des microservices mal découpés ('distributed monolith')."
  },
  {
    "question": "Communication synchrone vs asynchrone — HTTP REST vs Message Queue",
    "answer": "**HTTP REST (synchrone)** : `A → appelle B → attend la réponse → continue`. Si B est down : erreur immédiate pour A. Si B est lent (3s) : A attend 3s, thread bloqué. Utilisé quand : la réponse est nécessaire immédiatement pour continuer (`BookTrade` doit retourner le `TradeId`). ◆ **Message Queue (asynchrone)** : `A → envoie un message dans la queue → continue immédiatement`. B traite le message quand il est disponible. Si B est down : le message attend dans la queue, aucune perte. Utilisé quand : la réponse n'est pas nécessaire immédiatement (calcul de risk après booking, envoi d'email de confirmation). ◆ **Analogie** : HTTP = appel téléphonique (attend que l'autre décroche). Queue = envoyer un SMS (l'autre répond quand il peut). ◆ **⚠️ Point de confusion** : MSMQ et RabbitMQ ne remplacent PAS HTTP — ce sont des outils complémentaires. Certains flows nécessitent les deux dans le même système."
  },
  {
    "question": "JSON — Sérialisation, désérialisation, contrat, erreurs fréquentes",
    "answer": "**Sérialisation** : objet C# → texte JSON. `string json = JsonSerializer.Serialize(trade);` ◆ **Désérialisation** : texte JSON → objet C#. `Trade t = JsonSerializer.Deserialize<Trade>(json);` ◆ **Options importantes** : `new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = true, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull }` ◆ **Attributs** : `[JsonPropertyName(\"trade_id\")]` sur une propriété pour mapper un nom JSON différent du nom C#. `[JsonIgnore]` pour exclure un champ de la sérialisation. ◆ **Contrat JSON** : structure partagée entre services. Changer `TradeId` en `Id` dans le JSON casse tous les consommateurs. Versionner : `/api/v1/trades` garde l'ancien format, `/api/v2/trades` introduit le nouveau. ◆ **⚠️ Points de confusion** : `Serialize` = C# vers JSON (vers l'extérieur). `Deserialize` = JSON vers C# (depuis l'extérieur). `null` en JSON ≠ valeur absente — utiliser `[JsonIgnore]` ou `JsonIgnoreCondition`."
  },
  {
    "question": "MSMQ — Architecture, producteur, consommateur, persistance",
    "answer": "**MSMQ (Microsoft Message Queuing)** : système de files de messages intégré à Windows. Persistance locale — les messages survivent aux redémarrages. Transactionnel — envoi et réception atomiques. ◆ **Producteur** : `using System.Messaging; var queue = new MessageQueue(\".\\\\Private$\\\\TradeQueue\"); queue.Send(new Message(trade) { Label = \"NewTrade\", Formatter = new XmlMessageFormatter() });` ◆ **Consommateur** : `var msg = queue.Receive(TimeSpan.FromSeconds(10)); var trade = (Trade)msg.Body;` ◆ **Queue transactionnelle** : `queue.Send(msg, MessageQueueTransactionType.Single)` — si l'application plante après l'envoi mais avant le traitement, le message reste dans la queue. ◆ **Limitations MSMQ** : Windows uniquement, pas de broker centralisé, pas de monitoring web, pas de routing complexe, difficile à scaler horizontalement. ◆ **⚠️ Point de confusion** : MSMQ ≠ RabbitMQ. MSMQ = local, legacy, .NET Framework. RabbitMQ = broker centralisé, moderne, multi-langages, cloud-native."
  },
  {
    "question": "RabbitMQ — Exchange, Queue, Binding, patterns de routing",
    "answer": "**Concepts** : Producer → Exchange → Binding → Queue → Consumer. L'exchange reçoit les messages et les route vers les queues selon les bindings et le routingKey. ◆ **Direct exchange** : `channel.BasicPublish(exchange: \"trades\", routingKey: \"trade.booked\", body: payload)` → queue liée à exactement `\"trade.booked\"`. ◆ **Topic exchange** : `routingKey: \"trade.equity.booked\"` → queue abonnée à `\"trade.equity.*\"` ou `\"trade.#\"`. ◆ **Fanout exchange** : broadcast — toutes les queues liées reçoivent le message (audit, risk, reporting, blotter simultanément). ◆ **Acknowledgements** : `channel.BasicAck(deliveryTag, false)` après traitement réussi. `channel.BasicNack(deliveryTag, false, requeue: true)` si erreur → rejeu. ◆ **Dead-letter queue** : messages rejetés → `trades.dlq` pour inspection. ◆ **⚠️ Point de confusion** : l'exchange NE stocke PAS les messages — c'est la queue qui stocke. L'exchange route seulement. Un message non routé (aucune queue binding) est perdu."
  },
  {
    "question": "async/await — Fonctionnement interne, libération de thread, règles",
    "answer": "**Sans async (bloquant)** : `var data = GetData();` — le thread attend, immobilisé pendant toute la durée de l'I/O. Sur ASP.NET Core : si 200 requêtes simultanées chacune attendant 100ms SQL → 200 threads bloqués → pool de threads épuisé → nouvelles requêtes en attente. ◆ **Avec async** : `var data = await GetDataAsync();` — le thread est libéré pendant l'attente I/O, il revient dans le pool et peut traiter d'autres requêtes. Quand le résultat SQL arrive, un thread (pas forcément le même) reprend l'exécution après le `await`. ◆ **Règle du bout en bout** : si une méthode utilise `await`, elle doit être `async Task` jusqu'au contrôleur. Interrompre la chaîne avec `.Result` ou `.Wait()` = deadlock potentiel. ◆ **CancellationToken** : `async Task GetDataAsync(CancellationToken ct)` — si le client ferme la connexion, l'opération est annulée proprement. ◆ **⚠️ Point de confusion majeur** : `async` ne rend pas le code plus rapide pour une seule requête — il améliore la scalabilité (plus de requêtes simultanées avec moins de threads)."
  },
  {
    "question": "async void vs async Task — La confusion la plus dangereuse en C#",
    "answer": "**`async Task`** : méthode awaitable. Les exceptions sont capturées et propagées à l'appelant. `await MaMethodeAsync()` — l'appelant peut gérer l'exception avec `try/catch`. La méthode peut être attendue (testable, composable). ◆ **`async void`** : NON awaitable. Les exceptions NE sont PAS capturées — elles plantent le process entier sans possibilité de try/catch. Utilisable UNIQUEMENT pour les event handlers UI (obligation de signature) : `private async void Button_Click(object sender, EventArgs e)`. ◆ **Pourquoi c'est dangereux** : `private async void ProcessMessage(Message msg) { await _repo.SaveAsync(msg); }` → si `SaveAsync` lève une exception → le process crash → tous les messages en cours sont perdus. ◆ **Règle absolue** : toujours `async Task`, sauf event handlers. `async void` dans un service backend = bombe à retardement. ◆ **⚠️ Point de confusion** : les deux se compilent sans erreur — le compilateur n'avertit pas pour `async void`. C'est une erreur silencieuse."
  },
  {
    "question": "Task vs Thread — Différences fondamentales et quand utiliser chaque",
    "answer": "**Thread** : `new Thread(() => { DoWork(); }).Start()` — crée un thread OS dédié. Lourd (~1MB de stack), géré manuellement (Start, Join, Abort). Pas de valeur de retour native. Pas de composition. ◆ **Task** : `Task.Run(() => DoWork())` — utilise le ThreadPool géré par .NET. Léger, recyclé entre les opérations. Valeur de retour (`Task<T>`). Composable (`Task.WhenAll`, `ContinueWith`). ◆ **Quand utiliser Thread** : opérations longues (thread dédié pour un consommateur RabbitMQ qui tourne indéfiniment), cas où le contrôle précis du thread est nécessaire. ◆ **Quand utiliser Task** : tout le reste — calculs parallèles, opérations async, parallélisme logique. ◆ **ThreadPool** : `Thread` crée un thread neuf. `Task.Run` prend un thread du pool (déjà créé). Créer 1000 `Thread` = 1000 threads OS = ~1GB de stack. 1000 `Task.Run` = réutilise ~20-50 threads du pool. ◆ **⚠️ Point de confusion** : `await` ne crée PAS un thread — il libère un thread. La confusion entre 'parallélisme' et 'asynchronisme' est très fréquente."
  },
  {
    "question": "LINQ — Where, Select, OrderBy, GroupBy, FirstOrDefault — Syntaxe et pièges",
    "answer": "**Where** : `trades.Where(t => t.Price > 100 && t.Status == \"Active\")` — filtre, retourne `IEnumerable<T>`. ◆ **Select** : `trades.Select(t => new TradeDto(t.Id, t.Price))` — projection, transforme chaque élément. `Select` retourne toujours autant d'éléments qu'en entrée. ◆ **SelectMany** : aplatit une collection de collections. `desks.SelectMany(d => d.Trades)` — toutes les trades de tous les desks en une seule liste. ◆ **OrderBy / ThenBy** : `trades.OrderBy(t => t.Maturity).ThenBy(t => t.Strike)` — tri multi-niveaux. ◆ **GroupBy** : `trades.GroupBy(t => t.Desk).Select(g => new { Desk = g.Key, Total = g.Sum(t => t.Notional) })` ◆ **FirstOrDefault / SingleOrDefault** : `FirstOrDefault()` = premier élément ou `null` si vide. `SingleOrDefault()` = un seul élément attendu, exception si plusieurs. ◆ **⚠️ Point de confusion** : `Select` ≠ filtre — c'est une projection. Pour filtrer : `Where`. `First()` lève une exception si la collection est vide. `FirstOrDefault()` retourne `null`."
  },
  {
    "question": "LINQ — Exécution différée vs immédiate — Le piège des IEnumerable",
    "answer": "**Exécution différée** : `IEnumerable<T>` — la requête n'est PAS exécutée à la ligne du `Where`/`Select`. Elle est exécutée au moment de l'itération (`foreach`, `.ToList()`, `.Count()`, `.Any()`). ◆ **Démonstration** : `var query = trades.Where(t => t.Price > 100);` ← requête construite, pas exécutée. `var result = query.ToList();` ← requête exécutée ici. ◆ **Conséquence piège** : `var q = trades.Where(t => t.Price > 100); trades.Clear(); var list = q.ToList();` → la liste est vide — la requête lit `trades` au moment de `.ToList()`, pas au moment du `Where`. ◆ **Exécution immédiate** : `.ToList()`, `.ToArray()`, `.Count()`, `.Any()`, `.First()`, `.Sum()`, `.Max()`, `.Min()` — forcent l'exécution. ◆ **IQueryable vs IEnumerable** : `IQueryable` traduit en SQL (exécuté côté serveur). `IEnumerable` exécuté côté client après chargement. `db.Trades.Where(...)` = `IQueryable` → SQL filtré. `db.Trades.ToList().Where(...)` = `IEnumerable` → TOUT chargé en mémoire, puis filtré en C#. ◆ **⚠️ Point de confusion** : appeler `.ToList()` trop tôt est l'une des erreurs de performance LINQ les plus fréquentes."
  },
  {
    "question": "First() vs FirstOrDefault() vs Single() vs SingleOrDefault() — Tableau des différences",
    "answer": "**`First()`** : premier élément — lance `InvalidOperationException` si la collection est VIDE. ◆ **`FirstOrDefault()`** : premier élément ou `null` (ou valeur par défaut du type) si vide — ne plante JAMAIS. ◆ **`Single()`** : exactement un seul élément — lance `InvalidOperationException` si vide OU si plus d'un élément. ◆ **`SingleOrDefault()`** : zéro ou un élément — retourne `null` si vide, lance si plus d'un. ◆ **Quand utiliser quoi** : `First()` = je sais que la collection n'est pas vide (données critiques, logique garantie). `FirstOrDefault()` = la collection peut être vide (recherche optionnelle). `Single()` = je veux exactement 1 résultat et c'est une erreur s'il y en a 0 ou 2 (chercher par clé primaire). `SingleOrDefault()` = 0 ou 1 résultat attendu. ◆ **Exemple CIB** : `var trade = trades.FirstOrDefault(t => t.Id == id);` puis `if (trade == null) return NotFound();`. NE PAS faire : `var trade = trades.First(t => t.Id == id)` si l'ID peut ne pas exister — exception en production. ◆ **⚠️ Point de confusion** : `First()` n'est PAS 'meilleur' que `FirstOrDefault()`. Utiliser le bon selon le contrat métier."
  },
  {
    "question": "Producteur et Consommateur — Pattern fondamental des architectures distribuées",
    "answer": "**Producteur** : service qui crée et envoie des messages. `TradeService` crée un trade et publie `TradeBooked` sur RabbitMQ. Il n'attend pas que le message soit traité — il continue immédiatement. ◆ **Consommateur** : service qui lit et traite les messages. `RiskService` écoute `TradeBooked`, calcule les Greeks, vérifie les limites. Il traite à son propre rythme. ◆ **Backpressure** : si le producteur est plus rapide que le consommateur, la queue grossit. Solutions : ajouter des consommateurs (scale out), ou bounded queue avec rejet/attente. ◆ **Competing consumers** : plusieurs instances de `RiskService` consomment la même queue — chaque message est traité par un seul consommateur. RabbitMQ distribue les messages en round-robin. ◆ **Fan-out** : un message `TradeBooked` consommé par `RiskService` ET `AuditService` ET `BlotterService` simultanément — chacun a sa propre queue. ◆ **⚠️ Point de confusion** : dans RabbitMQ, un message est délivré à UNE SEULE queue par défaut (Direct/Topic). Pour le fan-out, utiliser un Fanout Exchange ou plusieurs bindings."
  },
  {
    "question": "Résilience et gestion d'erreurs — Retry, Circuit Breaker, Dead-Letter Queue",
    "answer": "**Retry** : retenter automatiquement les opérations transitoires. Avec Polly : `Policy.Handle<HttpRequestException>().WaitAndRetry(3, r => TimeSpan.FromSeconds(Math.Pow(2, r)))` — 3 tentatives avec backoff exponentiel (2s, 4s, 8s). Ne pas retenter les erreurs permanentes (401, 404). ◆ **Circuit Breaker** : après N erreurs consécutives, ouvrir le circuit 30s. Le service ne tente plus d'appeler le service down — réponse immédiate de refus. Se referme progressivement (half-open) pour tester la récupération. ◆ **Dead-Letter Queue** : message en erreur après N tentatives → redirigé vers la DLQ. L'équipe inspecte, corrige l'anomalie, rejoue. Sans DLQ : le message est perdu ou bloque la queue. ◆ **Timeout** : toujours configurer un timeout sur les `HttpClient`. Sans timeout : si le service distant ne répond jamais, le thread est bloqué indéfiniment. `client.Timeout = TimeSpan.FromSeconds(5)` ◆ **⚠️ Point de confusion** : Circuit Breaker ≠ Retry. Le retry retente sur erreur transitoire. Le circuit breaker arrête de tenter quand le service est clairement down — économise les ressources et accélère la détection de pannes."
  },
  {
    "question": "Versioning d'API REST — URL, Header, négociation de contenu",
    "answer": "**URL versioning** : `/api/v1/trades`, `/api/v2/trades` — le plus explicite. Visible dans les logs, simple à tester, simple à documenter. ◆ **Header versioning** : `Api-Version: 2` dans le header HTTP — URL propre, moins visible. `[ApiVersion(\"2.0\")][MapToApiVersion(\"2.0\")] public IActionResult GetV2()` ◆ **Query string** : `/api/trades?api-version=2` — facile à tester dans un navigateur, peu recommandé en production. ◆ **Pourquoi versionner** : un contrat JSON modifié (ajout de champ obligatoire, renommage) casse les clients qui n'ont pas encore migré. V1 doit rester stable pendant la période de migration. ◆ **Stratégie de dépréciation** : `Deprecation: true` header + `Sunset: 2025-06-01` — les clients ont un délai pour migrer. ◆ **⚠️ Point de confusion** : ajouter un champ OPTIONNEL au JSON est backward compatible (V1 clients ignorent le nouveau champ). Rendre un champ obligatoire ou le renommer est un breaking change nécessitant une nouvelle version."
  },
  {
    "question": "Sécurité des échanges — HTTPS, JWT, Validation des inputs, Secrets",
    "answer": "**HTTPS** : chiffre les données en transit. Obligatoire en finance. `app.UseHsts(); app.UseHttpsRedirection();` ◆ **JWT (JSON Web Token)** : token signé contenant des claims (userId, rôle, desk, expiration). Vérifié côté serveur sans accès DB — stateless. `[Authorize] [HttpPost] public IActionResult BookTrade(...)` — 401 si token absent ou invalide. ◆ **Validation des inputs** : `[Required][Range(0.01, 1_000_000)] public decimal Notional { get; set; }` — `[ApiController]` retourne 400 automatiquement si invalide. FluentValidation pour les règles métier complexes. ◆ **Secrets** : jamais de credentials dans le code source ou les fichiers appSettings versionnés. Utiliser `User Secrets` (dev), `Azure Key Vault` ou variables d'environnement (prod). ◆ **SQL Injection** : utiliser uniquement des requêtes paramétrées ou ORM. `WHERE Id = @id` (Dapper) ou `Where(t => t.Id == id)` (EF Core) — jamais concaténer des inputs utilisateur dans du SQL. ◆ **⚠️ Point de confusion** : JWT ≠ chiffrement — le payload est lisible (Base64), pas secret. JWT = signé (authentification). Utiliser HTTPS pour le chiffrement."
  },
  {
    "question": "Traçabilité inter-services — Correlation ID, Structured Logging, Distributed Tracing",
    "answer": "**Correlation ID** : UUID généré à l'entrée du système, propagé dans tous les headers et logs. `X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000` — permet de retrouver tous les événements d'une requête dans tous les services. ◆ **Structured Logging** : `_logger.LogInformation(\"Trade booked {TradeId} {ISIN} {Desk} {Notional}\", trade.Id, trade.Isin, trade.Desk, trade.Notional)` — chaque propriété est indexée séparément dans Elasticsearch. Recherche `TradeId=12345` retrouve tous les logs liés. ◆ **Serilog** : `Log.ForContext(\"TradeId\", id).ForContext(\"Service\", \"BookingService\").Information(\"Processing...\")` ◆ **OpenTelemetry** : standard de tracing distribué. Chaque service crée un span. Jaeger/Zipkin reconstituent le chemin complet. ◆ **⚠️ Point de confusion** : les logs textuels (sans structured logging) ne peuvent pas être filtrés efficacement. `LogError(\"Error for trade \" + tradeId)` = texte non indexé. `LogError(\"Error for trade {TradeId}\", tradeId)` = propriété indexée."
  },
  {
    "question": "Entity Framework Core + LINQ — Requêtes efficaces sur la base de données",
    "answer": "**DbContext** : `public class MapsDbContext : DbContext { public DbSet<Trade> Trades { get; set; } public DbSet<Instrument> Instruments { get; set; } }` ◆ **Requête simple** : `var trades = await _ctx.Trades.Where(t => t.DeskId == deskId && t.TradeDate >= DateTime.Today).AsNoTracking().ToListAsync(ct);` ◆ **Include (jointure)** : `var trades = await _ctx.Trades.Include(t => t.Instrument).Where(...).ToListAsync();` — charge les instruments en même temps (évite N+1). ◆ **Projection** : `var dtos = await _ctx.Trades.Select(t => new TradeDto(t.Id, t.Instrument.Isin, t.Notional)).ToListAsync();` — SQL ne charge que les colonnes nécessaires. ◆ **AsNoTracking** : pour les lectures seules — EF Core ne surveille pas les modifications, 2× plus rapide. ◆ **⚠️ Anti-pattern N+1** : `foreach(var trade in trades) { var instr = _ctx.Instruments.Find(trade.InstrumentId); }` → 1 requête pour les trades + N requêtes pour les instruments. Correction : `Include(t => t.Instrument)` = 1 seule requête SQL avec JOIN."
  },
  {
    "question": "Cas pratique complet — Trade CIB de la saisie à la base de données",
    "answer": "**Étape 1 — Saisie** : le trader POSTs `{ TradeId: 1, ISIN: \"FR0000131104\", Notional: 500000, Price: 52.3 }` sur `POST /api/v1/trades`. ◆ **Étape 2 — API REST** : `[Authorize][HttpPost] public async Task<IActionResult> Book([FromBody] BookingRequest req, CancellationToken ct)` — JWT validé, inputs validés (Notional > 0), ISIN format vérifié. ◆ **Étape 3 — Service** : `var isin = await _isinService.ResolveAsync(req.Isin, ct)` (cache Redis → Sophis). `var trade = await _tradeService.BookAsync(req, ct)`. ◆ **Étape 4 — Sérialisation JSON** : `JsonSerializer.Serialize(trade)` pour la publication sur RabbitMQ. ◆ **Étape 5 — MSMQ/RabbitMQ** : `await _bus.PublishAsync(\"trade.booked\", trade, ct)` — `RiskService`, `AuditService`, `BlotterService` consomment l'événement. ◆ **Étape 6 — async/await** : tous les appels DB, Sophis, RabbitMQ sont `await` — aucun thread bloqué. ◆ **Étape 7 — LINQ** : `_ctx.Trades.Where(t => t.DeskId == deskId).Sum(t => t.Notional)` — exposition nette du desk mise à jour. ◆ **Étape 8 — Réponse** : 201 Created + `{ tradeId: \"...\", location: \"/api/v1/trades/...\" }`."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un microservice dans une architecture CIB comme MAPS ?",
      "options": [
        "Une petite classe C# qui fait une seule chose.",
        "Un service indépendant avec sa propre base de données, sa propre logique métier et son propre déploiement, communicant avec les autres via API ou MessageQueue.",
        "Un service qui dépend d'une base de données partagée avec tous les autres services.",
        "Un composant interne d'une application monolithique."
      ],
      "answer": "Un service indépendant avec sa propre base de données, sa propre logique métier et son propre déploiement, communicant avec les autres via API ou MessageQueue.",
      "explanation": "Le principe fondamental d'un microservice : indépendance totale. Il ne partage pas sa DB, n'appelle pas directement les objets internes des autres services. En CIB : `TradeService`, `RiskService`, `InstrumentService` sont des projets C# séparés, déployés dans leurs propres containers Docker, communiquant via REST ou RabbitMQ. La DB partagée est l'anti-pattern n°1 des microservices — elle réintroduit le couplage qu'on cherchait à éliminer."
    },
    {
      "question": "[Confusion] En C#, `JsonSerializer.Serialize(trade)` et `JsonSerializer.Deserialize<Trade>(json)` — laquelle transforme l'objet C# en texte JSON ?",
      "options": [
        "Deserialize — elle lit et reconstruit l'objet.",
        "Serialize — elle transforme l'objet C# en texte JSON (vers l'extérieur).",
        "Les deux font la même chose dans des sens différents.",
        "Aucune des deux — JSON.Parse est la méthode correcte en C#."
      ],
      "answer": "Serialize — elle transforme l'objet C# en texte JSON (vers l'extérieur).",
      "explanation": "Moyen mnémotechnique : Serialize = 'mettre en série' = transformer en texte plat pour transmettre. Deserialize = 'défaire la série' = reconstruire l'objet depuis le texte. En CIB : avant d'envoyer un trade sur RabbitMQ, on `Serialize` → texte JSON. Quand `RiskService` reçoit le message de la queue, il `Deserialize` → objet Trade C# qu'il peut manipuler."
    },
    {
      "question": "[Confusion] Quelle est la différence entre `async void` et `async Task` en C# ?",
      "options": [
        "Aucune différence — les deux s'utilisent indifféremment.",
        "`async Task` est awaitable et propage les exceptions. `async void` n'est pas awaitable et les exceptions crashent le process — à utiliser SEULEMENT dans les event handlers UI.",
        "`async void` est plus rapide car il ne crée pas de Task.",
        "`async Task` bloque le thread, `async void` le libère."
      ],
      "answer": "`async Task` est awaitable et propage les exceptions. `async void` n'est pas awaitable et les exceptions crashent le process — à utiliser SEULEMENT dans les event handlers UI.",
      "explanation": "Piège classique en entretien CIB : `async void ProcessMessage()` dans un service RabbitMQ → si une exception est lancée → le process crash sans catchable exception → messages perdus, service redémarre silencieusement. Règle absolue : toujours `async Task` dans les services backend. `async void` = event handlers WinForms/WPF uniquement (`Button_Click`). Le compilateur accepte les deux sans avertissement — erreur silencieuse."
    },
    {
      "question": "[Confusion] `First()` vs `FirstOrDefault()` sur une collection LINQ — Que se passe-t-il si la collection est vide ?",
      "options": [
        "Les deux retournent `null` si la collection est vide.",
        "`First()` lance `InvalidOperationException`. `FirstOrDefault()` retourne `null` (ou la valeur par défaut du type).",
        "`First()` retourne `null`, `FirstOrDefault()` retourne la valeur par défaut.",
        "Les deux lancent une exception si la collection est vide."
      ],
      "answer": "`First()` lance `InvalidOperationException`. `FirstOrDefault()` retourne `null` (ou la valeur par défaut du type).",
      "explanation": "En production CIB : `trades.First(t => t.Id == id)` → si l'ID n'existe pas → exception non gérée → 500 Internal Server Error pour le trader. `trades.FirstOrDefault(t => t.Id == id)` → `null` → le code peut gérer le cas avec `if (trade == null) return NotFound()`. Règle : utiliser `FirstOrDefault()` pour les recherches et vérifier le null. Utiliser `First()` uniquement quand l'absence est une erreur logique garantie (ex: après un `Any()` qui a confirmé l'existence)."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que MSMQ et pourquoi est-il utilisé dans MAPS plutôt qu'un appel HTTP direct ?",
      "options": [
        "MSMQ est une base de données rapide pour les messages temporaires.",
        "MSMQ est une file de messages — si le service destinataire est down, le message attend. Avec HTTP direct, si le service est down, l'appel échoue immédiatement.",
        "MSMQ est plus rapide qu'un appel HTTP pour tous les types de requêtes.",
        "MSMQ est utilisé uniquement pour les communications entre bases de données."
      ],
      "answer": "MSMQ est une file de messages — si le service destinataire est down, le message attend. Avec HTTP direct, si le service est down, l'appel échoue immédiatement.",
      "explanation": "Scénario CIB : `TradeService` book un trade et doit notifier `RiskService`. Si `RiskService` est en maintenance, HTTP = erreur immédiate, trade potentiellement non risqué. MSMQ = le message `TradeBooked` attend dans la queue. Quand `RiskService` redémarre, il traite tous les messages en attente — aucun trade n'est passé sous le radar. Ce découplage temporel est la valeur principale des message queues."
    },
    {
      "question": "[Confusion] Quelle est la différence entre `IQueryable<T>` et `IEnumerable<T>` dans une requête EF Core sur la table des trades ?",
      "options": [
        "Ce sont des types identiques — seule la syntaxe LINQ diffère.",
        "`IQueryable<T>` traduit le filtre en SQL (exécuté en base). `IEnumerable<T>` charge TOUT en mémoire, puis filtre côté C#.",
        "`IEnumerable<T>` est plus rapide car il n'a pas besoin de connexion SQL.",
        "`IQueryable<T>` ne supporte pas le `Where` et le `Select`."
      ],
      "answer": "`IQueryable<T>` traduit le filtre en SQL (exécuté en base). `IEnumerable<T>` charge TOUT en mémoire, puis filtre côté C#.",
      "explanation": "Anti-pattern fréquent en CIB : `_ctx.Trades.ToList().Where(t => t.DeskId == deskId)` → `.ToList()` force l'exécution → `SELECT * FROM Trades` → charge 500 000 trades en RAM → `Where` filtre en C# les 50 qui appartiennent au desk. Correct : `_ctx.Trades.Where(t => t.DeskId == deskId).ToList()` → EF Core génère `SELECT * FROM Trades WHERE DeskId = @id` → 50 lignes en RAM. Sur une table de millions de trades en CIB, la différence est critique."
    },
    {
      "question": "[Terme → Définition] Pourquoi utiliser `async/await` dans un controller ASP.NET Core qui appelle une base SQL ?",
      "options": [
        "Pour rendre la requête SQL plus rapide.",
        "Pour libérer le thread HTTP pendant l'attente SQL — Kestrel peut traiter d'autres requêtes avec le même thread, augmentant la scalabilité de l'API.",
        "Pour exécuter la requête SQL sur un thread séparé.",
        "Pour permettre plusieurs connections SQL simultanées."
      ],
      "answer": "Pour libérer le thread HTTP pendant l'attente SQL — Kestrel peut traiter d'autres requêtes avec le même thread, augmentant la scalabilité de l'API.",
      "explanation": "`async` ne rend pas UNE requête plus rapide — c'est une erreur de compréhension fréquente. Il permet à BEAUCOUP de requêtes d'être traitées simultanement avec peu de threads. Sans async : 500 req/sec × 10ms SQL = 5 threads constamment bloqués. Avec async : ces 5 threads, pendant qu'ils attendent SQL, servent 10-20 autres requêtes. En CIB à l'ouverture des marchés (pic de trafic) : la différence entre async et synchrone peut faire crasher ou non le service."
    },
    {
      "question": "[Correspondance] Associez : `where` → ? / `select` → ? / `groupby` → ?",
      "options": [
        "Trier / Projeter / Filtrer",
        "Filtrer / Projeter / Regrouper",
        "Projeter / Filtrer / Trier",
        "Regrouper / Trier / Projeter"
      ],
      "answer": "Filtrer / Projeter / Regrouper",
      "explanation": "`Where` = filtre (réduit le nombre d'éléments). `Select` = projection (transforme chaque élément, ne réduit pas le nombre). `GroupBy` = regroupe les éléments par une clé. En CIB : `trades.Where(t => t.Price > 100)` → filtre. `trades.Select(t => t.Isin)` → liste des ISIN seulement. `trades.GroupBy(t => t.Desk).Select(g => new { g.Key, Total = g.Sum(t => t.Notional) })` → notionnel total par desk."
    },
    {
      "question": "[Confusion] Quelle est la différence entre HTTP synchrone et message queue asynchrone dans l'architecture MAPS ?",
      "options": [
        "HTTP est toujours meilleur car plus rapide.",
        "HTTP (sync) : A attend la réponse de B, erreur si B est down. Queue (async) : A envoie le message et continue, B traite quand disponible, message conservé si B est down.",
        "Message Queue est toujours meilleur car plus résilient.",
        "HTTP et Message Queue servent exactement les mêmes cas d'usage."
      ],
      "answer": "HTTP (sync) : A attend la réponse de B, erreur si B est down. Queue (async) : A envoie le message et continue, B traite quand disponible, message conservé si B est down.",
      "explanation": "Choix du bon outil selon le cas d'usage : `POST /api/v1/trades` (HTTP) retourne le `TradeId` — le client a besoin de la réponse immédiatement pour confirmer le booking → HTTP obligatoire. `TradeBooked` → calcul des Greeks (RabbitMQ) — le trader n'attend pas que le risk soit calculé pour confirmer le booking → queue. Les deux coexistent dans MAPS. L'erreur est de vouloir tout mettre dans une queue ou tout en HTTP."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un contrat JSON dans une architecture microservices ?",
      "options": [
        "Un fichier de configuration JSON pour les microservices.",
        "La structure JSON partagée entre le producteur et le consommateur — changer un champ requis sans versioning casse les consommateurs qui attendaient l'ancien format.",
        "Un document légal définissant les SLAs entre services.",
        "Un schéma SQL stocké en JSON."
      ],
      "answer": "La structure JSON partagée entre le producteur et le consommateur — changer un champ requis sans versioning casse les consommateurs qui attendaient l'ancien format.",
      "explanation": "En CIB : `TradeService` publie `{ TradeId: 1, ISIN: \"FR...\", Notional: 500000 }` sur RabbitMQ. `RiskService` désérialise en supposant que `Notional` existe. Si `TradeService` renomme `Notional` en `Amount`, `RiskService` reçoit `Amount: 500000` et `Notional: null` → calcul de risque à 0 → trades non risqués → incident majeur. Le contrat JSON doit être versionné ou modifier uniquement de façon backward-compatible (ajouter des champs optionnels)."
    },
    {
      "question": "[Confusion] `Task.Run()` vs `await` — est-ce que `await` crée un nouveau thread ?",
      "options": [
        "Oui — `await` crée toujours un nouveau thread pour l'opération.",
        "Non — `await` LIBÈRE le thread actuel pendant l'attente I/O. Il ne crée pas de thread. `Task.Run()` soumet un travail au ThreadPool.",
        "`await` et `Task.Run()` créent tous les deux des threads.",
        "`await` est uniquement pour les opérations SQL, `Task.Run()` pour le reste."
      ],
      "answer": "Non — `await` LIBÈRE le thread actuel pendant l'attente I/O. Il ne crée pas de thread. `Task.Run()` soumet un travail au ThreadPool.",
      "explanation": "Confusion très fréquente en entretien. `await GetDataAsync()` : quand le thread atteint le `await`, il est libéré dans le pool. Quand les données SQL arrivent, un thread (souvent différent) reprend l'exécution. Aucun thread créé. `Task.Run(() => HeavyCalc())` : soumet `HeavyCalc` à un thread du ThreadPool — là, un thread de pool est utilisé. `await Task.Run(...)` = utilise un thread du pool + libère le thread appelant. En CIB : `await _ctx.SaveChangesAsync()` → zéro thread créé, un thread libéré."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que l'exécution différée en LINQ et pourquoi est-ce un piège fréquent ?",
      "options": [
        "LINQ s'exécute toujours au moment de la définition de la requête.",
        "La requête LINQ n'est PAS exécutée à la ligne du `Where` — elle est exécutée au moment de l'itération (`foreach`, `.ToList()`). Si la source change entre les deux, le résultat reflète l'état au moment de l'itération.",
        "L'exécution différée signifie que LINQ attend 100ms avant de s'exécuter.",
        "L'exécution différée ne s'applique qu'aux requêtes EF Core, pas aux collections en mémoire."
      ],
      "answer": "La requête LINQ n'est PAS exécutée à la ligne du `Where` — elle est exécutée au moment de l'itération (`foreach`, `.ToList()`). Si la source change entre les deux, le résultat reflète l'état au moment de l'itération.",
      "explanation": "Piège en CIB : `var activeTradesQuery = trades.Where(t => t.Status == \"Active\");` — requête construite. Si entre cette ligne et `activeTradesQuery.ToList()`, un autre thread modifie la liste `trades` (trade cancelled), le résultat contiendra l'état modifié — surprise ! Pour les IQueryable EF Core : le SQL est envoyé à la base seulement au `.ToListAsync()`. Si le DbContext a été modifié entre les deux, la requête peut retourner des données différentes de ce qu'on attendait."
    },
    {
      "question": "[Confusion] Producteur vs Consommateur dans RabbitMQ — qui crée le message et qui le traite ?",
      "options": [
        "Le consommateur crée le message, le producteur le traite.",
        "Le producteur crée et envoie le message dans la queue. Le consommateur lit et traite le message depuis la queue.",
        "Les deux peuvent être producteur et consommateur simultanément dans la même opération.",
        "Dans RabbitMQ, le broker est aussi le producteur."
      ],
      "answer": "Le producteur crée et envoie le message dans la queue. Le consommateur lit et traite le message depuis la queue.",
      "explanation": "`TradeService` (producteur) : `channel.BasicPublish(exchange, routingKey, body: Serialize(trade))` — envoie et oublie. `RiskService` (consommateur) : `channel.BasicConsume(queue, autoAck: false, consumer)` — lit et traite. En CIB, un service peut être les deux : `TradeService` consomme `MarketDataUpdated` pour enrichir les trades ET produit `TradeBooked` pour le risk. La séparation producteur/consommateur est logique, pas physique — un même service peut avoir les deux rôles."
    },
    {
      "question": "[Terme → Définition] Pourquoi ne jamais concaténer une entrée utilisateur dans une requête SQL en C# ?",
      "options": [
        "Pour des raisons de performance uniquement.",
        "Pour éviter l'injection SQL — un input malveillant peut modifier la requête pour lire, modifier ou supprimer des données non autorisées. Les requêtes paramétrées ou ORM séparent code SQL et données.",
        "Les entrées utilisateur contiennent toujours des caractères invalides pour SQL.",
        "La concaténation SQL est interdite par le standard C# depuis .NET 5."
      ],
      "answer": "Pour éviter l'injection SQL — un input malveillant peut modifier la requête pour lire, modifier ou supprimer des données non autorisées. Les requêtes paramétrées ou ORM séparent code SQL et données.",
      "explanation": "Exemple d'injection : `\"SELECT * FROM Trades WHERE Isin = '\" + userInput + \"'\"`. Si `userInput = \"'; DROP TABLE Trades; --\"` → `SELECT * FROM Trades WHERE Isin = ''; DROP TABLE Trades; --'` → destruction de la table Trades. En CIB, une telle attaque sur la table des positions serait catastrophique. Correction : Dapper `WHERE Isin = @isin` + `new { isin = userInput }` ou EF Core `.Where(t => t.Isin == userInput)` — le driver paramétrise automatiquement."
    },
    {
      "question": "[Confusion] La difference entre `Single()` et `First()` dans LINQ — dans quel cas `Single()` est-il préférable ?",
      "options": [
        "`Single()` est toujours préférable à `First()` car plus strict.",
        "`Single()` vérifie qu'il n'y a exactement qu'un résultat — utile pour chercher par clé primaire où plusieurs résultats seraient une erreur de données. `First()` prend le premier même si plusieurs existent.",
        "`Single()` retourne `null` si la collection est vide, `First()` lance une exception.",
        "`Single()` et `First()` sont identiques sauf pour les performances."
      ],
      "answer": "`Single()` vérifie qu'il n'y a exactement qu'un résultat — utile pour chercher par clé primaire où plusieurs résultats seraient une erreur de données. `First()` prend le premier même si plusieurs existent.",
      "explanation": "En CIB : `_ctx.Trades.Single(t => t.Id == tradeId)` — si deux trades ont le même ID (corruption de données), `Single()` lance une exception immédiatement — bug détecté. `First()` retournerait silencieusement le premier sans signaler le doublon. Règle : `Single()` pour les clés uniques (GUID, clé primaire) → sécurité de données. `First()` / `FirstOrDefault()` pour les cas où plusieurs résultats sont acceptables (tri par date, prendre le plus récent)."
    },
    {
      "question": "[Confusion] `SelectMany()` vs `Select()` en LINQ — quelle est la différence clé ?",
      "options": [
        "`SelectMany()` sélectionne plusieurs colonnes, `Select()` en sélectionne une.",
        "`Select()` retourne une collection de collections. `SelectMany()` aplatit — retourne tous les éléments imbriqués dans une seule collection.",
        "`SelectMany()` filtre en plus de projeter.",
        "`Select()` est pour les types simples, `SelectMany()` pour les objets complexes."
      ],
      "answer": "`Select()` retourne une collection de collections. `SelectMany()` aplatit — retourne tous les éléments imbriqués dans une seule collection.",
      "explanation": "En CIB : `desks.Select(d => d.Trades)` retourne `IEnumerable<IEnumerable<Trade>>` — une liste de listes. `desks.SelectMany(d => d.Trades)` retourne `IEnumerable<Trade>` — toutes les trades de tous les desks en une seule liste plate. Utile pour : calculer le notionnel total cross-desks `desks.SelectMany(d => d.Trades).Sum(t => t.Notional)`, ou pour obtenir tous les ISIN uniques de tous les portefeuilles `funds.SelectMany(f => f.Positions).Select(p => p.Isin).Distinct()`."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un acknowledgement (ACK) dans RabbitMQ et pourquoi est-il critique ?",
      "options": [
        "Un message de confirmation envoyé par le producteur après publication.",
        "Une confirmation envoyée par le consommateur après traitement réussi — sans ACK, RabbitMQ considère le message non traité et le redélivre. Permet d'éviter la perte de messages si le consommateur crash pendant le traitement.",
        "Un token d'authentification pour accéder à RabbitMQ.",
        "Un header JSON confirmant que le message a bien été désérialisé."
      ],
      "answer": "Une confirmation envoyée par le consommateur après traitement réussi — sans ACK, RabbitMQ considère le message non traité et le redélivre. Permet d'éviter la perte de messages si le consommateur crash pendant le traitement.",
      "explanation": "Scénario CIB sans ACK : `RiskService` reçoit un message `TradeBooked`, commence à calculer les Greeks, crash à mi-chemin. Sans ACK, RabbitMQ pense que le message a été traité — trade non risqué, position incorrecte. Avec ACK manuel (`autoAck: false`) : le message est redelivré à une autre instance de `RiskService`. `BasicAck(deliveryTag)` = traitement réussi, RabbitMQ supprime le message. `BasicNack(deliveryTag, requeue: false)` = échec, envoyer vers la DLQ. `autoAck: true` = dangereux en CIB (trade perdu si crash)."
    },
    {
      "question": "[Confusion] JWT — pourquoi le payload du token est-il visible en Base64 mais pas sécurisé comme un mot de passe ?",
      "options": [
        "Le payload JWT est chiffré — il est illisible sans la clé secrète.",
        "Le payload JWT est encodé en Base64 (lisible) mais SIGNÉ — quiconque peut le lire, mais personne ne peut le modifier sans invalider la signature. Les données sensibles (mot de passe) ne doivent jamais être dans le JWT.",
        "JWT chiffre automatiquement les données sensibles dans le payload.",
        "Le payload JWT est illisible — seul le serveur peut le déchiffrer."
      ],
      "answer": "Le payload JWT est encodé en Base64 (lisible) mais SIGNÉ — quiconque peut le lire, mais personne ne peut le modifier sans invalider la signature. Les données sensibles (mot de passe) ne doivent jamais être dans le JWT.",
      "explanation": "JWT = 3 parties séparées par `.` : Header.Payload.Signature. Le payload `{ userId: 123, role: TRADER, desk: equity }` est décodable par n'importe qui avec Base64. La signature (HMAC-SHA256 avec la clé secrète serveur) garantit l'intégrité — si quelqu'un modifie `role: ADMIN`, la signature ne correspond plus → rejet. HTTPS chiffre le token en transit. Ne jamais mettre un mot de passe, numéro de carte ou donnée confidentielle dans le JWT payload — visible."
    },
    {
      "question": "[Terme → Définition] Quelle est l'utilité d'un Correlation ID dans une architecture microservices ?",
      "options": [
        "Un identifiant de corrélation entre une table SQL et une entité C#.",
        "Un UUID généré à l'entrée du système et propagé dans tous les logs et headers de tous les services — permet de retrouver tous les événements d'une requête en filtrant sur cet ID dans les logs centralisés.",
        "Un token de sécurité alternatif au JWT pour les appels inter-services.",
        "Un identifiant de version pour les contrats JSON."
      ],
      "answer": "Un UUID généré à l'entrée du système et propagé dans tous les logs et headers de tous les services — permet de retrouver tous les événements d'une requête en filtrant sur cet ID dans les logs centralisés.",
      "explanation": "Sans Correlation ID en CIB : un trade échoue, le trader appelle le support. Le support regarde les logs de `BookingService` → trouve l'erreur, mais ne sait pas quel appel `RiskService` a été fait, ni quel message `RabbitMQ` a été publié. Avec Correlation ID : `X-Correlation-ID: 550e8400-...` propagé dans tous les headers → dans Elasticsearch, filtrer `correlationId=\"550e8400\"` → voir tous les logs de tous les services pour ce trade spécifique. Débogage en secondes au lieu d'heures."
    },
    {
      "question": "[Confusion] `AsNoTracking()` dans EF Core — dans quel cas NE PAS l'utiliser ?",
      "options": [
        "Ne jamais utiliser `AsNoTracking()` — il est dangereux.",
        "Ne pas utiliser `AsNoTracking()` quand on veut MODIFIER les entités chargées — le change tracking détecte les modifications et les sauvegarde avec `SaveChanges()`. Pour les lectures seules, `AsNoTracking()` est recommandé.",
        "`AsNoTracking()` ne fonctionne pas avec `Include()` pour les jointures.",
        "`AsNoTracking()` doit être utilisé uniquement pour les tables de plus de 1000 lignes."
      ],
      "answer": "Ne pas utiliser `AsNoTracking()` quand on veut MODIFIER les entités chargées — le change tracking détecte les modifications et les sauvegarde avec `SaveChanges()`. Pour les lectures seules, `AsNoTracking()` est recommandé.",
      "explanation": "Avec change tracking (sans `AsNoTracking`) : `var trade = _ctx.Trades.First(t => t.Id == id); trade.Status = \"Cancelled\"; await _ctx.SaveChangesAsync();` → EF Core détecte la modification et génère `UPDATE Trades SET Status='Cancelled' WHERE Id=@id`. Avec `AsNoTracking()` : `trade.Status = \"Cancelled\"` → pas de suivi → `SaveChanges()` ne sauvegarde rien. En CIB : les endpoints GET (liste des positions, référentiel ISIN) → `AsNoTracking()`. Les endpoints POST/PATCH (booking, modification) → sans `AsNoTracking()`."
    },
    {
      "question": "[Confusion] `.Result` et `.Wait()` sur une Task async en C# — pourquoi sont-ils dangereux dans ASP.NET Core ?",
      "options": [
        "Ils sont identiques à `await` — simple préférence de syntaxe.",
        "Ils bloquent le thread appelant de façon synchrone, et dans ASP.NET Core provoquent un deadlock : le thread HTTP attend la Task, mais la continuation de la Task attend d'être schedulée sur ce même thread — impasse totale.",
        "Ils sont dangereux uniquement dans les applications console, pas dans ASP.NET Core.",
        "Ils causent uniquement une légère dégradation de performance."
      ],
      "answer": "Ils bloquent le thread appelant de façon synchrone, et dans ASP.NET Core provoquent un deadlock : le thread HTTP attend la Task, mais la continuation de la Task attend d'être schedulée sur ce même thread — impasse totale.",
      "explanation": "Deadlock classique en CIB : `public IActionResult BookTrade() { var result = _service.BookAsync().Result; return Ok(result); }`. Le thread HTTP appelle `.Result` → se bloque en attendant. La continuation de `BookAsync()` essaie de reprendre sur le contexte de synchronisation ASP.NET (le même thread) → impasse. La requête ne revient jamais. Correction : `await _service.BookAsync()` jusqu'au bout de la chaîne. Si du code synchrone doit appeler du code async : `Task.Run(() => _service.BookAsync()).Result` (thread pool séparé) — mais mieux vaut refactoriser toute la chaîne en async."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `Any()` et `Count() > 0` en LINQ pour vérifier si une collection contient des éléments ?",
      "options": [
        "Ce sont des équivalents stricts — le compilateur les optimise de la même façon.",
        "`Any()` s'arrête dès qu'il trouve un premier élément (court-circuit). `Count() > 0` parcourt TOUTE la collection pour compter. Sur 1M d'éléments, `Any()` peut s'arrêter au premier, `Count()` parcourt tout.",
        "`Count()` est recommandé car il retourne un entier réutilisable.",
        "`Any()` ne fonctionne pas avec les `IQueryable` EF Core."
      ],
      "answer": "`Any()` s'arrête dès qu'il trouve un premier élément (court-circuit). `Count() > 0` parcourt TOUTE la collection pour compter. Sur 1M d'éléments, `Any()` peut s'arrêter au premier, `Count()` parcourt tout.",
      "explanation": "En CIB sur `IQueryable` : `_ctx.Trades.Where(t => t.DeskId == id).Any()` génère `SELECT TOP 1 1 FROM Trades WHERE DeskId=@id` — SQL s'arrête dès le premier résultat. `_ctx.Trades.Where(t => t.DeskId == id).Count() > 0` génère `SELECT COUNT(*) FROM Trades WHERE DeskId=@id` — SQL compte tous les enregistrements. Sur une table de 10M trades, `Any()` retourne en microsecondes, `Count()` en secondes. Règle : pour une vérification d'existence → toujours `Any()`. Pour connaître le nombre exact → `Count()`."
    },
    {
      "question": "[Confusion] Dans RabbitMQ, quelle est la différence entre une queue `durable` et `autoDelete` ?",
      "options": [
        "Ce sont des options contradictoires qui ne peuvent pas coexister.",
        "`durable: true` = la queue survit au redémarrage du broker (persistée sur disque). `autoDelete: true` = la queue est supprimée quand le dernier consommateur se déconnecte. En CIB, les queues de booking doivent être `durable: true, autoDelete: false`.",
        "`durable` concerne les messages, `autoDelete` concerne les exchanges.",
        "`autoDelete` supprime les messages non consommés après un TTL."
      ],
      "answer": "`durable: true` = la queue survit au redémarrage du broker (persistée sur disque). `autoDelete: true` = la queue est supprimée quand le dernier consommateur se déconnecte. En CIB, les queues de booking doivent être `durable: true, autoDelete: false`.",
      "explanation": "Scénario CIB sans `durable` : RabbitMQ redémarre (maintenance), la queue `trade.booked` est supprimée → tous les messages non consommés sont perdus → trades non risqués. Avec `durable: true` : la queue et ses messages survivent au redémarrage. Note : les messages eux-mêmes doivent aussi être persistants (`deliveryMode: 2`) pour survivre au redémarrage. `autoDelete: true` est utile pour les queues temporaires de réponse (pattern RPC), jamais pour les queues métier critiques en CIB."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le principe DRY (Don't Repeat Yourself) appliqué aux contrats JSON entre microservices ?",
      "options": [
        "Ne jamais définir deux endpoints REST qui retournent le même type de données.",
        "Partager les DTOs et contrats JSON dans un package NuGet commun entre les services — évite de dupliquer les définitions `TradeBookedEvent` dans `TradeService` et `RiskService`, source d'incohérence si l'un est mis à jour et pas l'autre.",
        "DRY s'applique uniquement au code C#, pas aux structures JSON.",
        "Utiliser un seul endpoint qui retourne tous les types de données possibles."
      ],
      "answer": "Partager les DTOs et contrats JSON dans un package NuGet commun entre les services — évite de dupliquer les définitions `TradeBookedEvent` dans `TradeService` et `RiskService`, source d'incohérence si l'un est mis à jour et pas l'autre.",
      "explanation": "Anti-pattern en CIB : `TradeService` définit `class TradeBookedEvent { string TradeId; decimal Notional; }` et `RiskService` définit sa propre copie `class TradeBookedEvent { string TradeId; decimal Amount; }`. Quand `TradeService` publie `Notional: 500000`, `RiskService` désérialise `Amount: null` → calcul de risque incorrect. Solution : package NuGet `Maps.Contracts` avec les classes partagées, référencé par les deux services. Inconvénient : couplage de build — toute modification du contrat nécessite de republier le package et mettre à jour tous les consommateurs."
    }
  ],
  avance: [
    {
      "question": "[Architecture] Pourquoi le pattern 'Base de données partagée' est-il l'anti-pattern n°1 des microservices en CIB ?",
      "options": [
        "C'est uniquement un problème de performance.",
        "La DB partagée réintroduit le couplage que les microservices cherchent à éliminer : une migration SQL affecte tous les services simultanément, les services ne peuvent pas être déployés indépendamment, et les transactions cross-services créent des dépendances cachées.",
        "Deux services peuvent partager la même DB s'ils lisent les mêmes tables.",
        "La DB partagée est acceptable si les services sont dans le même datacenter."
      ],
      "answer": "La DB partagée réintroduit le couplage que les microservices cherchent à éliminer : une migration SQL affecte tous les services simultanément, les services ne peuvent pas être déployés indépendamment, et les transactions cross-services créent des dépendances cachées.",
      "explanation": "Anti-pattern 'Distributed Monolith' : `TradeService` et `RiskService` partagent `TradesDB`. `TradeService` ajoute une colonne NOT NULL → `RiskService` plante immédiatement (colonne inconnue). Les deux doivent être déployés ensemble. `ALTER TABLE` nécessite de tester et déployer les deux services. Correct : chaque service a sa propre DB. La communication se fait via API REST ou événements RabbitMQ. Le `RiskService` maintient sa propre copie des données de trade (eventual consistency) mise à jour via l'événement `TradeBooked`."
    },
    {
      "question": "[Anti-pattern] Un développeur écrit `var risks = await Task.Run(() => trades.Where(t => t.Price > 100).Select(t => CalculateRisk(t)).ToList());` pour un calcul de risque. Quel problème architectural ?",
      "options": [
        "Le code est correct et optimal.",
        "`Task.Run` avec du LINQ sur une `IEnumerable` charge en mémoire + calcul sur le ThreadPool = deux problèmes : LINQ non optimisé (pas IQueryable) ET `Task.Run` sur du CPU-bound sans `Parallel.For` = séquentiel sur un thread de pool. Correction : `Parallel.ForEach(trades, t => results.Add(CalculateRisk(t)))` pour CPU-bound.",
        "Le seul problème est l'absence de `CancellationToken`.",
        "`Task.Run` ne peut pas être awaitable dans ASP.NET Core."
      ],
      "answer": "`Task.Run` avec du LINQ sur une `IEnumerable` charge en mémoire + calcul sur le ThreadPool = deux problèmes : LINQ non optimisé (pas IQueryable) ET `Task.Run` sur du CPU-bound sans `Parallel.For` = séquentiel sur un thread de pool. Correction : `Parallel.ForEach(trades, t => results.Add(CalculateRisk(t)))` pour CPU-bound.",
      "explanation": "Double anti-pattern CIB : (1) `Task.Run` sur une opération CPU-bound (calcul de risque) ne parallélise pas — le calcul reste séquentiel sur un thread du pool. Pour le parallélisme CPU : `var results = new ConcurrentBag<Risk>(); Parallel.ForEach(trades, t => results.Add(CalculateRisk(t)));`. (2) `Task.Run` dans ASP.NET Core sur des opérations qui sont déjà async = ThreadPool thread starvation (prend un thread pour libérer un autre). Règle : async/await pour I/O-bound (DB, réseau). `Parallel.For/ForEach` pour CPU-bound (calculs numériques)."
    },
    {
      "question": "[Code → Identification] `var notionnel = await _ctx.Trades.Where(t => t.DeskId == deskId && t.Status == \"Active\").AsNoTracking().SumAsync(t => t.Notional, ct);`. Identifiez tous les patterns utilisés.",
      "options": [
        "Seul async/await est utilisé.",
        "IQueryable (SQL côté serveur) + async/await (libération thread) + AsNoTracking (lecture seule, 2× plus rapide) + CancellationToken (annulation propre) + projection directe SumAsync (SQL `SUM()` côté DB).",
        "EF Core + LINQ + Repository Pattern.",
        "Unit of Work + IQueryable + Circuit Breaker."
      ],
      "answer": "IQueryable (SQL côté serveur) + async/await (libération thread) + AsNoTracking (lecture seule, 2× plus rapide) + CancellationToken (annulation propre) + projection directe SumAsync (SQL `SUM()` côté DB).",
      "explanation": "Analyse ligne par ligne : `_ctx.Trades` = `IQueryable<Trade>` (pas encore exécuté). `.Where(...)` = filtre traduit en `WHERE` SQL. `.AsNoTracking()` = pas de change tracking (lecture seule). `.SumAsync(t => t.Notional, ct)` = traduit en `SELECT SUM(Notional) FROM Trades WHERE DeskId=@d AND Status=@s` — UNE seule ligne retournée par SQL (pas 50k lignes en RAM). `await` = libère le thread pendant l'I/O SQL. `ct` = si le client ferme la connexion → SQL annulé. SQL généré très efficace pour une table de millions de trades."
    },
    {
      "question": "[Refactoring] Un service MAPS publie un message RabbitMQ avec `channel.BasicPublish(...)` directement dans le controller. Comment refactoriser pour la testabilité et la résilience ?",
      "options": [
        "Déplacer le `BasicPublish` dans une méthode privée du controller.",
        "Extraire `IMessageBus { Task PublishAsync<T>(string routingKey, T message, CancellationToken ct); }` + implémenter `RabbitMqMessageBus` + injecter dans le controller. En test : mocker `IMessageBus`. En prod : ajouter Polly retry sur `RabbitMqMessageBus`.",
        "Utiliser un static helper `MessageBusHelper.Publish(...)` accessible partout.",
        "Publisher directement depuis `DbContext.SaveChanges()` via un hook EF Core."
      ],
      "answer": "Extraire `IMessageBus { Task PublishAsync<T>(string routingKey, T message, CancellationToken ct); }` + implémenter `RabbitMqMessageBus` + injecter dans le controller. En test : mocker `IMessageBus`. En prod : ajouter Polly retry sur `RabbitMqMessageBus`.",
      "explanation": "SRP + DIP + Testabilité : le controller ne doit pas connaître RabbitMQ directement. Avec `IMessageBus` injectée : test unitaire → `new Mock<IMessageBus>().Verify(m => m.PublishAsync(\"trade.booked\", trade, ct), Times.Once)`. `RabbitMqMessageBus` = implémentation concrète avec retry Polly (`Policy.Handle<BrokerUnreachableException>().WaitAndRetry(3, ...)`). Migration MSMQ→RabbitMQ : créer `RabbitMqMessageBus : IMessageBus` → le controller change zéro ligne. La mission mentionne explicitement MSMQ et RabbitMQ coexistants — cette abstraction est la clé."
    },
    {
      "question": "[Situation → Architecture] `RiskService` crash pendant le traitement d'un message `TradeBooked`. Le message avait `autoAck: true`. Conséquences et correction.",
      "options": [
        "Aucune conséquence — RabbitMQ redélivre le message automatiquement.",
        "Avec `autoAck: true`, RabbitMQ supprime le message dès sa réception — si le service crash pendant le calcul, le message est perdu. Le trade n'est jamais risqué. Correction : `autoAck: false` + `BasicAck()` après traitement réussi + DLQ pour les rejets.",
        "Le message est conservé dans la mémoire du serveur jusqu'au redémarrage.",
        "RabbitMQ envoie automatiquement un NACK si le consommateur crash."
      ],
      "answer": "Avec `autoAck: true`, RabbitMQ supprime le message dès sa réception — si le service crash pendant le calcul, le message est perdu. Le trade n'est jamais risqué. Correction : `autoAck: false` + `BasicAck()` après traitement réussi + DLQ pour les rejets.",
      "explanation": "Scenario CIB : 100 trades sont bookés pendant un pic d'activité. `RiskService` reçoit les messages mais crash (OOM) à mi-traitement. Avec `autoAck: true` : les 50 premiers messages déjà reçus = perdus → 50 trades sans calcul de risque → exposition inconnue → incident majeur (MiFID II). Avec `autoAck: false` : les messages non ACKés sont redelivrés à une autre instance de `RiskService`. DLQ : si un message échoue 3× (donnée corrompue), il va en dead-letter pour inspection manuelle — pas de loop infinie."
    },
    {
      "question": "[Anti-pattern] Un développeur définit `[JsonIgnore]` sur la propriété `Notional` d'un DTO de réponse de booking. Quel impact sur les clients RabbitMQ ?",
      "options": [
        "Aucun impact — `JsonIgnore` n'affecte pas la désérialisation.",
        "`[JsonIgnore]` exclut le champ lors de la sérialisation ET désérialisation — le JSON publié sur RabbitMQ ne contient pas `Notional`. `RiskService` qui lit ce champ reçoit `0` ou `null` → calcul de risque incorrect sur tous les trades.",
        "`[JsonIgnore]` masque uniquement l'affichage, pas la valeur réelle.",
        "`[JsonIgnore]` génère une erreur de compilation si le champ est requis."
      ],
      "answer": "`[JsonIgnore]` exclut le champ lors de la sérialisation ET désérialisation — le JSON publié sur RabbitMQ ne contient pas `Notional`. `RiskService` qui lit ce champ reçoit `0` ou `null` → calcul de risque incorrect sur tous les trades.",
      "explanation": "Contrat JSON brisé silencieusement : `TradeService` sérialise `BookedTradeEvent` avec `[JsonIgnore]` sur `Notional`. JSON publié : `{ TradeId: 1, ISIN: 'FR...' }` — sans Notional. `RiskService` désérialise → `trade.Notional = 0`. Calcul VaR à 0. Trades passent toutes les limites. Bug silencieux car aucune exception n'est lancée. Correction : utiliser `[JsonIgnore]` uniquement pour les données qui ne doivent JAMAIS être partagées (ex: hash de mot de passe dans un DTO utilisateur). Si `Notional` doit être dans le message interne mais pas dans la réponse HTTP, créer deux DTOs séparés."
    },
    {
      "question": "[Multi-concepts] Comment implémenter un pipeline de traitement de trade en C# qui : (1) valide asynchonement, (2) calcule les Greeks en parallèle, (3) publie sur RabbitMQ, (4) persiste en SQL — en moins de 200ms ?",
      "options": [
        "Exécuter chaque étape séquentiellement avec `await` pour chaque appel.",
        "`await ValidateAsync(trade, ct)` → `await Task.WhenAll(ComputeDeltaAsync(), ComputeVegaAsync(), CheckLimitsAsync())` → `await Task.WhenAll(_bus.PublishAsync(), _ctx.SaveChangesAsync(ct))` — validation séquentielle (nécessite le résultat) + Greeks en parallèle + publish+save en parallèle.",
        "Utiliser `Parallel.ForEach` pour toutes les étapes.",
        "Créer 4 threads séparés avec `new Thread()`."
      ],
      "answer": "`await ValidateAsync(trade, ct)` → `await Task.WhenAll(ComputeDeltaAsync(), ComputeVegaAsync(), CheckLimitsAsync())` → `await Task.WhenAll(_bus.PublishAsync(), _ctx.SaveChangesAsync(ct))` — validation séquentielle (nécessaire car les étapes suivantes en dépendent) + Greeks en parallèle + publish+save en parallèle.",
      "explanation": "Optimisation du pipeline : validation d'abord (séquentielle — pas la peine de calculer les Greeks si le trade est invalide). Greeks calculés en parallèle (`Task.WhenAll`) — si Delta=20ms, Vega=25ms, limites=15ms → total=25ms au lieu de 60ms. Publication RabbitMQ + save SQL en parallèle (indépendants l'un de l'autre) — si publish=5ms, save=10ms → total=10ms au lieu de 15ms. Résultat : ~50ms au lieu de ~100ms séquentiel. `CancellationToken` propagé partout — si annulation, toutes les Tasks sont annulées proprement."
    },
    {
      "question": "[Thème ↔ Concept] Comment le pattern Outbox Pattern résout-il le problème de cohérence entre `SaveChangesAsync()` (SQL) et `PublishAsync()` (RabbitMQ) ?",
      "options": [
        "En utilisant une transaction distribuée XA entre SQL et RabbitMQ.",
        "Écrire le message dans une table `OutboxMessages` SQL dans la même transaction que le trade. Un background service lit et publie les messages non envoyés sur RabbitMQ. Si RabbitMQ est down, les messages attendent en SQL — aucune incohérence.",
        "Utiliser `Task.WhenAll(save, publish)` garantit l'atomicité.",
        "Le problème n'existe pas — SQL et RabbitMQ peuvent être traités indépendamment."
      ],
      "answer": "Écrire le message dans une table `OutboxMessages` SQL dans la même transaction que le trade. Un background service lit et publie les messages non envoyés sur RabbitMQ. Si RabbitMQ est down, les messages attendent en SQL — aucune incohérence.",
      "explanation": "Problème CIB : `await _ctx.SaveChangesAsync()` réussit (trade en base) puis RabbitMQ est down → `await _bus.PublishAsync()` échoue → `RiskService` ne reçoit jamais `TradeBooked` → trade non risqué. `Task.WhenAll` ne garantit pas l'atomicité — si publish échoue, le save est déjà committé. Outbox Pattern : transaction SQL atomique `{ INSERT INTO Trades, INSERT INTO OutboxMessages }`. `IHostedService` lit l'Outbox toutes les secondes, publie sur RabbitMQ, marque les messages comme envoyés. Guaranteed delivery sans transaction distribuée."
    },
    {
      "question": "[Confusion + Performance] `GroupBy` suivi de `Count()` en LINQ sur IQueryable vs IEnumerable — quelle est la différence de SQL généré ?",
      "options": [
        "Les deux génèrent le même SQL.",
        "Sur `IQueryable` : `SELECT DeskId, COUNT(*) FROM Trades GROUP BY DeskId` — SQL côté serveur. Sur `IEnumerable` (après `.ToList()`) : charge TOUTES les trades en mémoire, groupe en C#. Sur 1M de trades, la différence est de secondes vs millisecondes.",
        "`GroupBy` n'est pas supporté sur `IQueryable` — uniquement `IEnumerable`.",
        "`GroupBy` sur `IQueryable` génère N+1 requêtes SQL."
      ],
      "answer": "Sur `IQueryable` : `SELECT DeskId, COUNT(*) FROM Trades GROUP BY DeskId` — SQL côté serveur. Sur `IEnumerable` (après `.ToList()`) : charge TOUTES les trades en mémoire, groupe en C#. Sur 1M de trades, la différence est de secondes vs millisecondes.",
      "explanation": "Démonstration : `_ctx.Trades.GroupBy(t => t.DeskId).Select(g => new { Desk = g.Key, Count = g.Count() })` → SQL : `SELECT DeskId, COUNT(*) FROM Trades GROUP BY DeskId` → retourne N lignes (une par desk). `_ctx.Trades.ToList().GroupBy(...)` → SQL : `SELECT * FROM Trades` → 1M lignes en RAM → groupe en C# → 1M objets Trade créés pour obtenir le même N-lignes résultat. En CIB avec une table de positions historiques (10M lignes), la version `ToList()` avant `GroupBy` peut provoquer un OutOfMemoryException."
    },
    {
      "question": "[Anti-pattern] Un service publie `{ TradeId: 1, EmployeeSalary: 85000, JwtSecret: \"abc123\" }` dans un message RabbitMQ. Quels problèmes ?",
      "options": [
        "Aucun problème — les messages RabbitMQ sont chiffrés.",
        "Surcharge du contrat JSON (données non nécessaires pour les consommateurs) + fuite d'informations sensibles (salaire, secret JWT) lisibles par tous les services consommateurs et dans les logs de monitoring RabbitMQ.",
        "Le seul problème est la taille excessive du message.",
        "Le problème est uniquement de sécurité — chiffrer le message suffit."
      ],
      "answer": "Surcharge du contrat JSON (données non nécessaires pour les consommateurs) + fuite d'informations sensibles (salaire, secret JWT) lisibles par tous les services consommateurs et dans les logs de monitoring RabbitMQ.",
      "explanation": "Principe de minimisation (RGPD + sécurité) : les messages doivent contenir uniquement ce dont les consommateurs ont besoin. `RiskService` a besoin de `TradeId`, `ISIN`, `Notional`, pas du salaire. `JwtSecret` dans un message = catastrophe sécurité — visible dans les logs RabbitMQ management, dans les logs des consommateurs (Serilog), potentiellement stocké en DLQ. Règle : créer un DTO spécifique au message `TradeBookedEvent { TradeId, ISIN, Notional, Desk, Timestamp }` — seuls les champs nécessaires aux consommateurs."
    },
    {
      "question": "[Situation → Pattern] Le `RiskService` a besoin des données d'un trade pour calculer le risque, mais il ne partage pas la DB avec `TradeService`. Comment maintenir sa copie locale des trades ?",
      "options": [
        "Appeler `GET /api/v1/trades/{id}` à chaque calcul de risque.",
        "Pattern CQRS + Event Sourcing : consommer l'événement `TradeBooked` depuis RabbitMQ → stocker une copie locale dans la DB du `RiskService` (sa propre table `Trades_Risk`) → lire localement pour les calculs. Eventual consistency acceptable.",
        "Accéder directement à la DB de `TradeService` en lecture seule.",
        "Utiliser une transaction distribuée XA pour synchroniser les deux DBs."
      ],
      "answer": "Pattern CQRS + Event Sourcing : consommer l'événement `TradeBooked` depuis RabbitMQ → stocker une copie locale dans la DB du `RiskService` (sa propre table `Trades_Risk`) → lire localement pour les calculs. Eventual consistency acceptable.",
      "explanation": "DB per service + eventual consistency : `RiskService` a sa propre table `TradesForRisk { TradeId, ISIN, Notional, DeskId }` (uniquement les champs nécessaires au calcul de risque). `IHostedService` consomme `TradeBooked` depuis RabbitMQ → `INSERT OR UPDATE TradesForRisk`. Avantages : lecture locale ultra-rapide (pas d'appel HTTP vers `TradeService`), pas de couplage runtime, résilience (`TradeService` peut être down pendant le calcul de risque). Eventual consistency : le `RiskService` peut avoir quelques secondes de délai — acceptable en finance post-trade."
    },
    {
      "question": "[Refactoring] Un `BookingController` de 400 lignes gère : désérialisation JSON, validation métier, appel Sophis, save SQL, publish RabbitMQ, logging, gestion d'erreurs. Refactorisez en SOLID.",
      "options": [
        "Diviser en méthodes privées dans le même controller.",
        "SRP : `IBookingValidator` (validation), `IIsinService` (Sophis), `ITradeRepository` (SQL), `IEventPublisher` (RabbitMQ). `BookingController` = orchestrateur 20 lignes qui appelle chaque service injecté. DIP : interfaces injectées par constructeur. Tests : mocker chaque interface indépendamment.",
        "Créer un service `BookingHelper` statique avec toutes les méthodes.",
        "Utiliser des middlewares ASP.NET Core pour chaque responsabilité."
      ],
      "answer": "SRP : `IBookingValidator` (validation), `IIsinService` (Sophis), `ITradeRepository` (SQL), `IEventPublisher` (RabbitMQ). `BookingController` = orchestrateur 20 lignes qui appelle chaque service injecté. DIP : interfaces injectées par constructeur. Tests : mocker chaque interface indépendamment.",
      "explanation": "SRP sur le controller : un controller 400 lignes = 5 raisons de changer = fragile. Après refactoring : `BookingController` → `await _validator.ValidateAsync(req)` → `var isin = await _isinService.ResolveAsync(req.Isin)` → `var trade = await _tradeRepo.CreateAsync(trade)` → `await _eventPublisher.PublishAsync(\"trade.booked\", trade)`. Chaque service testable isolément avec `Mock<IIsinService>`. Si Sophis change d'API : modifier uniquement `SophisIsinService`, zéro modification du controller. DIP : le controller dépend d'abstractions, pas des implémentations concrètes."
    },
    {
      "question": "[Architecture] Comment versionner un contrat JSON publié sur RabbitMQ sans casser les consommateurs existants ?",
      "options": [
        "Modifier directement le JSON — les consommateurs s'adapteront automatiquement.",
        "Ajouter les nouveaux champs en optionnel (backward compatible). Pour les breaking changes : créer un nouveau routingKey `trade.booked.v2`, les anciens consommateurs gardent leur abonnement `trade.booked.v1`, les nouveaux s'abonnent à `v2`. Dual-publish pendant la transition.",
        "Utiliser une transaction distribuée pour migrer tous les consommateurs simultanément.",
        "Supprimer la queue et recréer — les messages en attente sont perdus."
      ],
      "answer": "Ajouter les nouveaux champs en optionnel (backward compatible). Pour les breaking changes : créer un nouveau routingKey `trade.booked.v2`, les anciens consommateurs gardent leur abonnement `trade.booked.v1`, les nouveaux s'abonnent à `v2`. Dual-publish pendant la transition.",
      "explanation": "Versioning de contrat de message en CIB : Backward compatible (ajouter champ optionnel `CurrencyCode?`) — tous les consommateurs l'ignorent ou l'utilisent s'ils en ont besoin. Breaking change (renommer `Notional` → `Amount`) → dual-publish : `TradeService` publie sur `trade.booked` (format v1 pour les anciens) ET `trade.booked.v2` (format v2 pour les nouveaux). Quand tous les consommateurs ont migré, retirer le dual-publish. Timeline : 2-4 semaines de transition. Documenter le changelog avec la date de dépréciation de v1."
    },
    {
      "question": "[Confusion + Architecture] Quelle est la différence entre `Competing Consumers` et `Publish-Subscribe` dans RabbitMQ ?",
      "options": [
        "Ce sont deux noms pour le même pattern.",
        "Competing Consumers : plusieurs instances du même service partagent une queue — chaque message traité par UN seul consommateur (load balancing). Publish-Subscribe : chaque service a SA propre queue (Fanout Exchange) — chaque message reçu par TOUS les abonnés.",
        "Competing Consumers utilise Topic Exchange, Publish-Subscribe utilise Direct Exchange.",
        "Publish-Subscribe est uniquement pour les messages prioritaires."
      ],
      "answer": "Competing Consumers : plusieurs instances du même service partagent une queue — chaque message traité par UN seul consommateur (load balancing). Publish-Subscribe : chaque service a SA propre queue (Fanout Exchange) — chaque message reçu par TOUS les abonnés.",
      "explanation": "Cas d'usage CIB : Competing Consumers → `RiskService` a 3 instances qui consomment toutes `risk.trade.booked` (une seule queue). Un message `TradeBooked` est traité par une seule des 3 instances — scale out horizontal, chaque trade risqué une seule fois. Publish-Subscribe → `TradeBooked` doit être reçu par `RiskService` ET `AuditService` ET `BlotterService` — Fanout Exchange copie le message dans 3 queues dédiées. Mélange des deux : `risk.trade.booked` (unique, 3 instances en competing consumers) + `audit.trade.booked` (unique) + `blotter.trade.booked` (unique)."
    },
    {
      "question": "[Code → Analyse] `services.AddScoped<ITradeRepository, EfTradeRepository>()`. Que signifie `Scoped` et pourquoi est-ce le bon choix pour un `DbContext` EF Core ?",
      "options": [
        "Scoped = une seule instance pour toute la durée de vie de l'application (même chose que Singleton).",
        "Scoped = une instance créée par requête HTTP et partagée dans cette requête. Le `DbContext` EF Core est conçu pour une seule unité de travail (une requête) — réutiliser le même DbContext entre plusieurs requêtes causerait des incohérences de change tracking.",
        "Scoped = une nouvelle instance créée à chaque injection (même chose que Transient).",
        "Scoped s'applique uniquement aux services qui accèdent au cache Redis."
      ],
      "answer": "Scoped = une instance créée par requête HTTP et partagée dans cette requête. Le `DbContext` EF Core est conçu pour une seule unité de travail (une requête) — réutiliser le même DbContext entre plusieurs requêtes causerait des incohérences de change tracking.",
      "explanation": "Cycles de vie DI en ASP.NET Core : Singleton = une instance pour toute l'app (pour les services stateless : `IMessageBus`, `IHttpClientFactory`). Scoped = une instance par requête HTTP (pour `DbContext` EF Core, `ITradeRepository`). Transient = nouvelle instance à chaque injection (pour les services légers sans état). Piège : injecter un service Scoped dans un Singleton → exception à l'exécution (`IServiceScopeFactory` obligatoire). En CIB : `DbContext` Scoped garantit que le change tracking d'une requête de booking n'interfère pas avec la requête suivante."
    },
    {
      "question": "[Situation → Architecture] Un `RiskService` appelle `TradeService` via HTTP pour chaque calcul de risque (100 appels/seconde). `TradeService` est down 5 minutes. Comment concevoir la résilience ?",
      "options": [
        "Augmenter le timeout HTTP à 5 minutes pour attendre le retour de `TradeService`.",
        "Circuit Breaker Polly : après 5 erreurs consécutives, ouvrir le circuit 30s (réponse immédiate de refus). Fallback : utiliser les données de trade en cache local. Retry avec backoff exponentiel pour les erreurs transitoires. Alert monitoring quand le circuit s'ouvre.",
        "Supprimer l'appel HTTP et accéder directement à la DB de `TradeService`.",
        "Retry infini toutes les 100ms — `TradeService` finira par répondre."
      ],
      "answer": "Circuit Breaker Polly : après 5 erreurs consécutives, ouvrir le circuit 30s (réponse immédiate de refus). Fallback : utiliser les données de trade en cache local. Retry avec backoff exponentiel pour les erreurs transitoires. Alert monitoring quand le circuit s'ouvre.",
      "explanation": "Sans circuit breaker : 100 appels/s × 5 minutes = 30 000 requêtes bloquées pendant le timeout (ex: 10s chacune) → 100 threads bloqués en permanence → `RiskService` crash également. Cascade de pannes. Circuit Breaker Polly : `services.AddHttpClient<ITradeServiceClient>().AddResilienceHandler(\"trade\", b => b.AddCircuitBreaker(new CircuitBreakerStrategyOptions { FailureRatio = 0.5, SamplingDuration = TimeSpan.FromSeconds(10), MinimumThroughput = 5, BreakDuration = TimeSpan.FromSeconds(30) }))`. Circuit ouvert → `RiskService` répond immédiatement avec données cache → reste disponible. Retry exponentiel (2s, 4s, 8s) pour les erreurs réseau transitoires seulement."
    },
    {
      "question": "[Anti-pattern + LINQ] Un développeur filtre une liste de 50k trades avec `trades.Where(t => t.Desk == \"Equity\").Count()` dans une boucle appelée 1000 fois. Quel problème et quelle correction ?",
      "options": [
        "Aucun problème — LINQ est optimisé par le compilateur.",
        "Exécution différée mal exploitée : `Count()` exécute le `Where` à chaque appel → O(n) × 1000 = 50M itérations. Correction : `var equityCount = trades.Where(t => t.Desk == \"Equity\").Count()` UNE FOIS hors de la boucle, ou `trades.GroupBy(t => t.Desk).ToDictionary(g => g.Key, g => g.Count())` pour tous les desks en une passe.",
        "Le seul problème est que `Count()` devrait être remplacé par `Any()`.",
        "Utiliser `Parallel.ForEach` sur la boucle résout le problème."
      ],
      "answer": "Exécution différée mal exploitée : `Count()` exécute le `Where` à chaque appel → O(n) × 1000 = 50M itérations. Correction : `var equityCount = trades.Where(t => t.Desk == \"Equity\").Count()` UNE FOIS hors de la boucle, ou `trades.GroupBy(t => t.Desk).ToDictionary(g => g.Key, g => g.Count())` pour tous les desks en une passe.",
      "explanation": "Exécution différée + boucle = piège de performance classique. En CIB pour un rapport de positions : calculer le nombre de trades par desk dans une boucle de 1000 itérations sur 50k trades = 50M comparaisons. Optimisation : matérialiser le résultat une fois (`var counts = trades.GroupBy(t => t.Desk).ToDictionary(g => g.Key, g => g.Count())`) → une seule passe sur 50k trades. Puis dans la boucle : `counts.GetValueOrDefault(\"Equity\", 0)` → O(1). Gain : 50M itérations → 50k + 1000 lookups O(1)."
    }
  ],
  expert: [
    {
      "question": "[Architecture + Multi-concepts] Concevez un système garantissant qu'un trade booké dans MAPS est toujours risqué, même si RabbitMQ est temporairement indisponible. Nommez tous les patterns utilisés.",
      "options": [
        "Retry infini sur la publication RabbitMQ.",
        "Outbox Pattern (message stocké en SQL dans la même transaction que le trade) + IHostedService (polling Outbox → publish RabbitMQ quand disponible) + Idempotency Key (RiskService ne recalcule pas deux fois le même trade) + Circuit Breaker sur RabbitMQ (ne pas bloquer le booking si RabbitMQ est down).",
        "Transaction distribuée XA entre SQL Server et RabbitMQ.",
        "Synchroniser directement les DBs de TradeService et RiskService."
      ],
      "answer": "Outbox Pattern (message stocké en SQL dans la même transaction que le trade) + IHostedService (polling Outbox → publish RabbitMQ quand disponible) + Idempotency Key (RiskService ne recalcule pas deux fois le même trade) + Circuit Breaker sur RabbitMQ (ne pas bloquer le booking si RabbitMQ est down).",
      "explanation": "Architecture garantie de livraison : (1) Outbox : `BEGIN TRANSACTION; INSERT INTO Trades; INSERT INTO OutboxMessages (tradeId, payload, sentAt=null); COMMIT;` — atomique. (2) `IHostedService` : toutes les 5s, `SELECT TOP 100 FROM OutboxMessages WHERE sentAt IS NULL` → publie → `UPDATE sentAt=NOW`. (3) Si RabbitMQ est down : le trade est en DB, l'OutboxMessage attend. Quand RabbitMQ revient : publication automatique. (4) Idempotency Key sur `RiskService` : si l'Outbox publie deux fois (retry) → `RiskService` vérifie `ProcessedTradeIds` → ignore le doublon. (5) Circuit Breaker Polly : si RabbitMQ down → circuit ouvert → publish échoue vite → Outbox conserve en SQL."
    },
    {
      "question": "[Nommage inversé] Un mécanisme garantit que si `SaveChangesAsync()` (SQL) réussit mais que `PublishAsync()` (RabbitMQ) échoue, le message sera quand même publié — éventuellement, sans transaction distribuée. Quel est ce mécanisme ?",
      "options": [
        "Two-Phase Commit (2PC) distribué",
        "Outbox Pattern — le message est persisté dans la même transaction SQL que l'entité métier. Il est publié asynchronement par un background service. La cohérence est éventuelle mais garantie.",
        "Saga Pattern avec compensation",
        "Dead-Letter Queue avec retry automatique"
      ],
      "answer": "Outbox Pattern — le message est persisté dans la même transaction SQL que l'entité métier. Il est publié asynchronement par un background service. La cohérence est éventuelle mais garantie.",
      "explanation": "Outbox Pattern résout le problème 'dual write' : deux systèmes (SQL + RabbitMQ) qui doivent être mis à jour de façon cohérente sans transaction distribuée. La table `OutboxMessages { Id, Payload, RoutingKey, CreatedAt, PublishedAt? }` est dans la même DB que les trades. Transaction SQL atomique : trade + outbox message ensemble. Le background service (`IHostedService`) assure la publication avec retry. Idempotency Key côté consommateur gère les éventuels doublons. 2PC distribué (option A) = trop lourd, verrouille les deux systèmes."
    },
    {
      "question": "[Situation → Multi-concepts] 10 services consomment l'événement `TradeBooked`. Chacun doit le recevoir indépendamment. Décrivez l'architecture RabbitMQ complète.",
      "options": [
        "Une seule queue `trade.booked` partagée entre les 10 services — round-robin.",
        "Fanout Exchange `trades.events` → 10 queues dédiées (`risk.trade.booked`, `audit.trade.booked`, `blotter.trade.booked`, etc.) via bindings. Chaque service a sa propre queue — indépendance totale, chaque service reçoit tous les messages.",
        "Direct Exchange avec 10 routingKeys différents — le producteur publie 10 fois.",
        "Un seul message copié manuellement vers 10 services via HTTP."
      ],
      "answer": "Fanout Exchange `trades.events` → 10 queues dédiées (`risk.trade.booked`, `audit.trade.booked`, `blotter.trade.booked`, etc.) via bindings. Chaque service a sa propre queue — indépendance totale, chaque service reçoit tous les messages.",
      "explanation": "Fan-out architecture CIB : `TradeService` publie UNE fois sur `trades.events` (Fanout Exchange). RabbitMQ copie le message dans les 10 queues liées. Chaque service consomme SA propre queue à son propre rythme. Si `AuditService` est lent, sa queue grossit — les autres services ne sont pas affectés. Si `BlotterService` est down 1h, ses messages attendent dans `blotter.trade.booked` — retrouvés au redémarrage. Une queue partagée (Competing Consumers) = chaque message traité par UN SEUL consommateur (load balancing). Fanout = chaque message traité par TOUS les consommateurs."
    },
    {
      "question": "[Anti-pattern + Sécurité] Un développeur expose `GET /api/v1/trades?linq=trades.Where(t => t.Desk == {userInput}).ToList()` et évalue l'expression LINQ dynamiquement. Diagnostiquez.",
      "options": [
        "Acceptable si l'endpoint est protégé par JWT.",
        "Code Injection identique au RCE — l'expression LINQ est compilée et exécutée avec tous les droits du process. Un attaquant peut accéder à `_ctx.Users`, `_ctx.AuditLogs`, exécuter des méthodes système. Correction : paramètres typés (`deskId`, `status`, `dateFrom`) + LINQ hardcodé + validation whitelist.",
        "Le seul risque est que l'expression LINQ soit incorrecte.",
        "L'expression LINQ est sécurisée car elle n'accède pas au SQL directement."
      ],
      "answer": "Code Injection identique au RCE — l'expression LINQ est compilée et exécutée avec tous les droits du process. Un attaquant peut accéder à `_ctx.Users`, `_ctx.AuditLogs`, exécuter des méthodes système. Correction : paramètres typés (`deskId`, `status`, `dateFrom`) + LINQ hardcodé + validation whitelist.",
      "explanation": "LINQ dynamique évalué avec Roslyn/ExpressionBuilder = vecteur d'injection critique. Expression malveillante : `trades.Where(t => t.Desk == \"equity\"); _ctx.Users.ToList()` — double expression, accès à la table Users. Ou plus grave : utilisation des méthodes de réflexion pour accéder aux objets non exposés. En CIB : données de position, trades confidentiels, noms des traders, limites de risque. Architecture correcte : `GET /api/v1/trades?deskId=equity&status=Active&dateFrom=2024-01-01` → validation enum pour `deskId`, validation date pour `dateFrom` → LINQ hardcodé `.Where(t => t.DeskId == deskId && t.Status == status)` → pas d'injection possible."
    },
    {
      "question": "[Multi-concepts] Décrivez comment implémenter un système de traçabilité end-to-end (de la saisie du trader jusqu'aux logs de compliance) pour un trade CIB, en nommant chaque composant.",
      "options": [
        "Console.WriteLine dans chaque méthode.",
        "1. Middleware génère `X-Correlation-ID` (UUID). 2. JWT claims propagent `userId + desk`. 3. Serilog enrichit chaque log avec `{CorrelationId, UserId, TradeId, ISIN, Service}`. 4. `X-Correlation-ID` propagé dans tous les headers RabbitMQ + HTTP. 5. OpenTelemetry spans sur chaque appel. 6. Elasticsearch indexe les logs. 7. Grafana/Kibana filtre par `correlationId`. 8. Immutable SQL audit table (INSERT-only).",
        "Logs en fichiers texte sur chaque serveur, agrégés manuellement.",
        "Utiliser `Debug.WriteLine` avec le mode verbose activé en production."
      ],
      "answer": "1. Middleware génère `X-Correlation-ID` (UUID). 2. JWT claims propagent `userId + desk`. 3. Serilog enrichit chaque log avec `{CorrelationId, UserId, TradeId, ISIN, Service}`. 4. `X-Correlation-ID` propagé dans tous les headers RabbitMQ + HTTP. 5. OpenTelemetry spans sur chaque appel. 6. Elasticsearch indexe les logs. 7. Grafana/Kibana filtre par `correlationId`. 8. Immutable SQL audit table (INSERT-only).",
      "explanation": "Traçabilité CIB complète (MiFID II) : (1) Chaque requête HTTP reçoit un UUID `X-Correlation-ID` en entrée. (2) Le JWT porte `userId`, `desk`, `role`. (3) Serilog avec `LogContext.PushProperty` enrichit automatiquement tous les logs du contexte avec `CorrelationId + UserId`. (4) Les messages RabbitMQ portent le `CorrelationId` dans les headers AMQP. (5) OpenTelemetry crée un span par service traversé — `BookingService (50ms) → IsinService (5ms) → SophisAdapter (30ms) → RabbitMQ.Publish (1ms)`. (6) Table `AuditLogs { Id, TradeId, UserId, Action, Timestamp, OldValues, NewValues }` append-only — conforme MiFID II (5 ans de rétention)."
    },
    {
      "question": "[Ordre de dépendance] Pour construire le système MAPS complet (API REST + MSMQ/RabbitMQ + SQL + async + LINQ), dans quel ordre les fondations doivent-elles être maîtrisées ?",
      "options": [
        "Docker → Kubernetes → CI/CD → Code",
        "1. C# OOP (classes, interfaces, async/await) → 2. LINQ (requêtes sur collections) → 3. SQL Server + EF Core (persistance) → 4. API REST ASP.NET Core (exposition) → 5. MSMQ/RabbitMQ (messaging async) → 6. Microservices patterns (DIP, SRP, Outbox) → 7. Docker + CI/CD (infrastructure).",
        "Microservices → APIs → Bases de données → C# de base",
        "Docker → API REST → SQL → C# OOP"
      ],
      "answer": "1. C# OOP (classes, interfaces, async/await) → 2. LINQ (requêtes sur collections) → 3. SQL Server + EF Core (persistance) → 4. API REST ASP.NET Core (exposition) → 5. MSMQ/RabbitMQ (messaging async) → 6. Microservices patterns (DIP, SRP, Outbox) → 7. Docker + CI/CD (infrastructure).",
      "explanation": "Ordre de dépendance des fondations : Sans C# OOP solide (classes, interfaces, async/await), aucune autre compétence ne tient. LINQ est utilisé dans EF Core — doit être maîtrisé avant. EF Core (SQL) est la persistance de toutes les API — avant les controllers. L'API REST utilise les services (DIP) qui utilisent EF Core et async. RabbitMQ s'appuie sur async/await et la sérialisation JSON. Les patterns microservices (Outbox, CQRS) nécessitent de maîtriser les briques de base. Docker = empaqueter ce qui fonctionne déjà. Tentative inverse fréquente : apprendre Docker sans maîtriser async/await = impossible de diagnostiquer les problèmes."
    },
    {
      "question": "[Confusion profonde] Quelle est la différence entre `await Task.WhenAll(t1, t2)` et `await t1; await t2;` pour deux appels simultanés dans un service de pricing ?",
      "options": [
        "Aucune différence — les deux exécutent les tâches en parallèle.",
        "`await t1; await t2` exécute les tâches SÉQUENTIELLEMENT (attend t1 entièrement, puis lance t2). `await Task.WhenAll(t1, t2)` lance les DEUX simultanément et attend que la plus lente finisse — gain de temps = durée de la plus longue, pas la somme.",
        "`Task.WhenAll` est plus lent car il crée plus de threads.",
        "`await t1; await t2` est recommandé pour éviter les race conditions."
      ],
      "answer": "`await t1; await t2` exécute les tâches SÉQUENTIELLEMENT (attend t1 entièrement, puis lance t2). `await Task.WhenAll(t1, t2)` lance les DEUX simultanément et attend que la plus lente finisse — gain de temps = durée de la plus longue, pas la somme.",
      "explanation": "Confusion critique en CIB : `var delta = await ComputeDeltaAsync(); var vega = await ComputeVegaAsync();` → 20ms + 25ms = 45ms séquentiel. `await Task.WhenAll(ComputeDeltaAsync(), ComputeVegaAsync())` → 25ms (la plus longue), les deux partent simultanément. Important : les Tasks doivent être créées AVANT le `WhenAll` pour vraiment démarrer simultanément. `await Task.WhenAll(ComputeDeltaAsync(), ComputeVegaAsync())` = correct. `var t1 = ComputeDeltaAsync(); var t2 = ComputeVegaAsync(); await Task.WhenAll(t1, t2)` = idem. Si une Task lève une exception, `WhenAll` propage la première exception — les autres continuent quand même."
    },
    {
      "question": "[Architecture complète] Un trade est créé en 3 étapes : validation (10ms), booking Sophis (150ms), publication RabbitMQ (5ms). Comment architecturer pour répondre au client le plus vite possible tout en garantissant la persistance et la notification ?",
      "options": [
        "Exécuter les 3 étapes de façon séquentielle et bloquer le client 165ms.",
        "Validation (await, 10ms) → Booking Sophis (await, 150ms) → répondre 201 Created avec TradeId → publication RabbitMQ en fire-and-forget avec Outbox Pattern (si RabbitMQ down, le message est en SQL) → total ressenti client : 160ms, publication garantie.",
        "Répondre immédiatement au client sans validation ni booking.",
        "Tout exécuter en `Task.WhenAll` — validation, booking et publication simultanément."
      ],
      "answer": "Validation (await, 10ms) → Booking Sophis (await, 150ms) → répondre 201 Created avec TradeId → publication RabbitMQ en fire-and-forget avec Outbox Pattern (si RabbitMQ down, le message est en SQL) → total ressenti client : 160ms, publication garantie.",
      "explanation": "Architecture optimale : certaines étapes sont bloquantes par nature (validation doit précéder le booking ; Sophis doit retourner un TradeId). La publication RabbitMQ peut être découplée de la réponse HTTP avec l'Outbox Pattern — le message est inséré dans la même transaction SQL que le trade (atomique), puis publié par un `IHostedService`. Le client reçoit 201 en 160ms. Si RabbitMQ est down : le trade est en DB, le message attend dans `OutboxMessages`. Quand RabbitMQ revient : publication automatique. Le `RiskService` reçoit le message 5-10 secondes plus tard — eventual consistency acceptable pour le calcul de risque post-trade. On NE peut PAS mettre validation et booking en `Task.WhenAll` car la logique est séquentielle (booking nécessite validation préalable)."
    },
    {
      "question": "[Nommage inversé + Confusion] Un mécanisme C# permet à un service de s'enregistrer comme dépendance et d'être injecté automatiquement dans les constructeurs sans que le consommateur sache quelle implémentation concrète est utilisée. Comment s'appelle ce mécanisme et quel en est l'avantage clé en tests ?",
      "options": [
        "Le pattern Singleton — une seule instance partagée entre tous les services.",
        "L'Injection de Dépendances (DI) via `IServiceCollection` — `services.AddScoped<ITradeRepository, EfTradeRepository>()`. En tests : remplacer `EfTradeRepository` par `MockTradeRepository` sans modifier le code du service testé.",
        "La réflexion .NET — `Activator.CreateInstance(typeof(TradeRepository))`.",
        "Le pattern Service Locator — `ServiceLocator.GetService<ITradeRepository>()`."
      ],
      "answer": "L'Injection de Dépendances (DI) via `IServiceCollection` — `services.AddScoped<ITradeRepository, EfTradeRepository>()`. En tests : remplacer `EfTradeRepository` par `MockTradeRepository` sans modifier le code du service testé.",
      "explanation": "DI + testabilité en CIB : `BookingService(ITradeRepository repo, IMessageBus bus, IIsinService isin)` — le service dépend d'abstractions, pas d'implémentations. En production : DI injecte `EfTradeRepository`, `RabbitMqMessageBus`, `SophisIsinService`. En test unitaire : `new BookingService(new Mock<ITradeRepository>().Object, new Mock<IMessageBus>().Object, new Mock<IIsinService>().Object)` — aucun SQL, aucun RabbitMQ, aucun Sophis instancié. Test rapide, isolé, reproductible. Service Locator (anti-pattern) = le service appelle lui-même `ServiceLocator.Get<ITradeRepository>()` → couplage caché, impossible à mocker sans modifier le service. La DI par constructeur est le pattern recommandé en ASP.NET Core."
    }
  ]
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
  }, [level, currentQuestion]);

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, handleNextQuestion, message]);

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
