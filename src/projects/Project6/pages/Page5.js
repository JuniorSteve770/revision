// src/projects/CSharpAsync/AsyncProgrammingQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — Feuille de route complète : Threads → Async → Parallel",
    "answer": "**Processus** : instance d'exécution isolée — mémoire séparée, indépendance totale. ◆ **Thread** : unité d'exécution DANS un processus — mémoire partagée, accès aux mêmes objets. ◆ **Parallélisme** : plusieurs threads sur plusieurs cœurs CPU en même temps → problèmes CPU-bound (rendu, calcul). Nécessite plusieurs cœurs. ◆ **Asynchronisme** : un thread qui ne BLOQUE pas pendant les I/O (réseau, disque, BD) → libère le CPU pour autre chose. Ne nécessite PAS plusieurs cœurs. ◆ **Agenda complet** : Multithreading (Thread, ThreadPool, Task) → Async/Await → Parallel.For/ForEach → Parallel.Invoke → Parallel LINQ (PLINQ). ◆ **⚠️ La confusion n°1** : async ≠ parallélisme. Async = ne pas BLOQUER. Parallèle = faire SIMULTANÉMENT. Un seul cœur suffit pour l'async. Le parallélisme réel nécessite plusieurs cœurs."
  },
  {
    "question": "Processus vs Thread — Mémoire, isolation, ordonnanceur OS",
    "answer": "**Processus** : programme en cours d'exécution. Chaque processus a sa propre mémoire isolée — le processus A ne peut PAS lire la mémoire du processus B. Si un processus crash, l'autre continue. ◆ **Thread** : 'fil d'exécution' à l'intérieur d'un processus. Plusieurs threads PARTAGENT la même mémoire du processus. `List<string> maListe` créée dans le thread 1 est visible par les threads 2 et 3 → risque de race conditions. ◆ **Thread Local Storage** : exception — données privées à un thread spécifique. ◆ **Ordonnanceur OS** : distribue le temps CPU entre tous les processus et threads. Sur 2 cœurs, 20 processus peuvent tourner grâce au time-slicing — l'OS bascule très rapidement entre eux. ◆ **Thread pool .NET** : pool de threads pré-créés réutilisables. Créer un thread coûte cher (~1MB RAM). Le pool réutilise les threads existants. Par défaut : taille ≈ nombre de cœurs CPU."
  },
  {
    "question": "Programmation Parallèle — Quand, Pourquoi, Mécanisme CPU-bound",
    "answer": "**Définition** : exécuter plusieurs calculs VRAIMENT en même temps sur plusieurs cœurs CPU. ◆ **Prérequis absolu** : plusieurs cœurs CPU. Sans eux, le parallélisme n'apporte rien (l'OS simule avec du time-slicing). ◆ **Cas d'usage** : calculs intensifs CPU — rendu 3D (diviser l'image en zones), simulations Monte Carlo, calcul de Greeks sur 1000 options, traitement d'images. ◆ **Mécanisme** : `Thread 1 sur CPU1` calcule la moitié supérieure de l'image PENDANT QUE `Thread 2 sur CPU2` calcule la moitié inférieure. Les deux s'exécutent littéralement en même temps. ◆ **Outils .NET** : `Parallel.For`, `Parallel.ForEach`, `Parallel.Invoke`, PLINQ (`.AsParallel()`). ◆ **⚠️ Serveur web** : le développeur n'a PAS besoin de programmer le parallélisme explicitement — le serveur web distribue automatiquement les requêtes HTTP sur les threads du pool, qui sont répartis sur les cœurs. Le parallélisme 'global' vient du cloud (Docker containers multiples)."
  },
  {
    "question": "Programmation Asynchrone — Quand, Pourquoi, Mécanisme I/O-bound",
    "answer": "**Problème** : une requête SQL prend 200ms. Sans async, le thread attend 200ms en faisant RIEN — il bloque le CPU inutilement. ◆ **Solution async** : le thread lance la requête SQL, LIBÈRE le thread dans le pool, et est notifié quand la réponse arrive. ◆ **Mécanisme sur 1 seul cœur** : Thread 1 reçoit HTTP GET → lance requête BD → retourne au pool libre → Thread 1 reçoit HTTP GET 2 → lance requête BD 2 → retourne au pool → résultat BD 1 arrive → Thread 1 (ou n'importe quel thread libre) traite et envoie la réponse. ◆ **Pas besoin de plusieurs cœurs** : tout ça fonctionne sur UN seul cœur — l'astuce est de ne jamais bloquer, pas de faire tourner 2 choses en même temps. ◆ **Cas d'usage** : TOUT ce qui touche le réseau, les fichiers, la BD, les APIs externes. ◆ **Analogie** : commander un café, ne pas rester debout à fixer la machine — aller faire autre chose et revenir quand c'est prêt."
  },
  {
    "question": "Thread vs Task — La bonne abstraction pour l'asynchronisme C#",
    "answer": "**`Thread`** (bas niveau) : `new Thread(() => { DoWork(); }).Start()` — crée un NOUVEAU thread OS. Coûteux (~1MB stack), géré manuellement (Start, Join, Abort), pas de valeur de retour native. À utiliser : consommateur qui tourne indéfiniment (service Windows), contrôle précis. ◆ **`Task`** (recommandé) : `Task.Run(() => DoWork())` — utilise le ThreadPool existant. Léger, recyclé, valeur de retour `Task<T>`, composable (`WhenAll`, `WhenAny`, `ContinueWith`). ◆ **`Task.Run()` vs `await`** : `Task.Run` soumet du travail CPU-bound au pool. `await` libère le thread pendant une I/O. Ce sont deux choses différentes. ◆ **ThreadPool .NET** : géré automatiquement. Crée des threads à la demande (jusqu'à une limite), les recycle. `Task.Run(() => calc())` prend un thread libre du pool — si tous sont occupés, la Task attend qu'un thread se libère. ◆ **Règle** : préférer `Task` et `async/await` dans 95% des cas. `Thread` direct = cas rares et spéciaux."
  },
  {
    "question": "async / await — Mécanisme interne, machine à états, règles fondamentales",
    "answer": "**Syntaxe** : `async Task<string> GetDataAsync() { var result = await httpClient.GetStringAsync(url); return result; }` ◆ **Ce que fait le compilateur** : transforme la méthode en une machine à états (state machine). À chaque `await`, le compilateur génère un point de continuation — le thread est libéré, et quand l'opération I/O termine, un thread reprend à ce point exact. ◆ **Règle fondamentale** : si tu `await` quelque chose, ta méthode DOIT être `async`. Si ta méthode est `async`, elle DOIT retourner `Task`, `Task<T>`, ou `ValueTask<T>`. ◆ **Chaîne async** : `Controller → async Service → async Repository → async DbContext`. Briser la chaîne avec `.Result` ou `.Wait()` = deadlock potentiel. ◆ **`await` libère, ne crée pas** : `await sql.QueryAsync()` ne crée PAS de thread — il LIBÈRE le thread appelant pendant l'attente I/O. ◆ **ConfigureAwait(false)** : dans les bibliothèques (pas les apps UI), ajouter `.ConfigureAwait(false)` évite de capturer inutilement le contexte de synchronisation."
  },
  {
    "question": "async void vs async Task — La confusion la plus dangereuse",
    "answer": "**`async Task`** : méthode awaitable. Les exceptions sont capturées dans la Task et propagées à l'appelant via `try/catch`. La méthode peut être attendue, testée, composée. ◆ **`async void`** : NON awaitable. Les exceptions ne sont PAS capturées dans la Task — elles sont lancées directement sur le SynchronizationContext → crash du process entier sans possibilité de try/catch. ◆ **SEUL usage légitime de `async void`** : event handlers UI obligatoires : `private async void Button_Click(object sender, EventArgs e)`. La signature est imposée par le framework. ◆ **Erreur classique** : `private async void ProcessMessage(Message msg) { await repo.SaveAsync(msg); }` → si `SaveAsync` lève une exception → process crash → messages perdus. ◆ **Le piège silencieux** : le compilateur compile `async void` sans erreur NI avertissement. C'est une bombe à retardement qui ne se manifeste qu'en production sous charge. ◆ **Règle absolue** : dans tout code non-UI, si tu veux écrire `async void` → écris `async Task` à la place."
  },
  {
    "question": "Task.WhenAll vs Task.WhenAny — Parallélisme logique async",
    "answer": "**`Task.WhenAll`** : lance N tâches async SIMULTANÉMENT, attend que TOUTES soient terminées. `await Task.WhenAll(t1, t2, t3)` — durée totale = durée de la plus LONGUE (pas la somme). ◆ **Exemple** : `var t1 = ComputeDeltaAsync(); var t2 = ComputeVegaAsync(); var t3 = CheckLimitsAsync(); await Task.WhenAll(t1, t2, t3)` — 20ms + 25ms + 15ms → 25ms au lieu de 60ms séquentiel. ◆ **Erreur fréquente** : `await t1; await t2; await t3;` — séquentiel ! t1 doit finir avant que t2 commence. ◆ **`Task.WhenAny`** : attend que LA PREMIÈRE tâche se termine. Utile pour : timeout (`Task.WhenAny(operation, Task.Delay(5000))` — prendre le résultat si l'opération finit avant 5s). ◆ **Exceptions dans WhenAll** : si une tâche lève une exception, `WhenAll` collecte toutes les exceptions dans une `AggregateException`. Les autres tâches continuent quand même jusqu'à leur fin. ◆ **`Task.WhenAll` ≠ parallélisme CPU** : les tâches sont async I/O-bound — elles attendent des résultats réseau/BD, pas du calcul CPU."
  },
  {
    "question": "Parallel.For et Parallel.ForEach — Parallélisme CPU-bound",
    "answer": "**Usage** : remplacer une boucle `for/foreach` séquentielle par une exécution parallèle sur tous les cœurs CPU. ◆ **`Parallel.For`** : `Parallel.For(0, N_SIMULATIONS, i => { payoffs[i] = SimulatePath(option, marketData); });` — .NET découpe automatiquement les itérations entre les cœurs. Sur 8 cœurs : ~8× plus rapide pour du calcul pur. ◆ **`Parallel.ForEach`** : `var results = new ConcurrentBag<Greeks>(); Parallel.ForEach(optionsBook, opt => { results.Add(opt.ComputeGreeks(marketData)); });` ◆ **`ParallelOptions`** : `new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount }` — limiter le nombre de threads pour ne pas saturer le CPU. ◆ **⚠️ Thread-safety obligatoire** : les lambdas partagent la mémoire du processus — utiliser `ConcurrentBag<T>`, `ConcurrentDictionary<K,V>`, `Interlocked`, ou des variables locales indexées (`decimal[] results = new decimal[N]` + accès par index). ◆ **⚠️ NE PAS utiliser** sur des I/O-bound (DB, réseau) — utiliser `async/await` + `Task.WhenAll` à la place. `Parallel.For` est fait pour du CPU pur."
  },
  {
    "question": "Parallel.Invoke — Lancer des méthodes différentes en parallèle",
    "answer": "**Usage** : exécuter plusieurs méthodes DIFFÉRENTES en parallèle (pas des itérations sur une collection). ◆ **Syntaxe** : `Parallel.Invoke( () => LoadMarketData(), () => LoadPositions(), () => LoadRiskLimits() );` — les trois méthodes s'exécutent simultanément sur des threads séparés, `Parallel.Invoke` attend que toutes soient terminées. ◆ **Différence avec `Task.WhenAll`** : `Parallel.Invoke` est synchrone (bloque le thread appelant jusqu'à la fin de toutes les actions). `Task.WhenAll` est async (libère le thread appelant pendant l'attente). ◆ **Cas d'usage** : initialisation parallèle au démarrage d'une application (charger plusieurs données indépendantes en même temps), opérations CPU-bound distinctes. ◆ **Retour de valeurs** : `Parallel.Invoke` ne retourne pas de valeur. Pour récupérer des résultats, utiliser des variables capturées par les lambdas ou `Task.WhenAll` avec `Task<T>`. ◆ **⚠️ Attention** : les actions partagent la mémoire — synchroniser les accès aux variables partagées."
  },
  {
    "question": "PLINQ — Parallel LINQ, AsParallel(), requêtes parallèles sur collections",
    "answer": "**PLINQ** : version parallèle de LINQ. Ajouter `.AsParallel()` à une requête LINQ pour la distribuer sur plusieurs cœurs. ◆ **Syntaxe** : `var results = options.AsParallel().Where(o => o.Delta > 0.5m).Select(o => o.ComputeGreeks(md)).ToList();` — .NET découpe la collection, distribue sur les cœurs, réassemble les résultats. ◆ **`.AsOrdered()`** : `options.AsParallel().AsOrdered().Select(...)` — préserve l'ordre original des éléments (au coût d'une synchronisation supplémentaire). ◆ **`.WithDegreeOfParallelism(n)`** : `options.AsParallel().WithDegreeOfParallelism(4).Select(...)` — limiter à 4 threads. ◆ **`.ForAll()`** : alternative parallèle à `foreach` dans PLINQ — `options.AsParallel().ForAll(o => process(o))` — plus rapide que `.ToList()` + `foreach` si on n'a pas besoin du résultat. ◆ **⚠️ Quand NE PAS utiliser PLINQ** : collections petites (< quelques milliers d'éléments) — l'overhead de parallélisation dépasse le gain. Collections ordonnées où l'ordre importe. Opérations avec effets de bord non thread-safe."
  },
  {
    "question": "CancellationToken — Annulation coopérative des opérations async",
    "answer": "**Problème** : un client HTTP ferme la connexion pendant un calcul long. Sans annulation : le serveur continue à calculer → gaspillage de ressources. ◆ **`CancellationTokenSource`** : crée et contrôle l'annulation. `var cts = new CancellationTokenSource(); cts.CancelAfter(TimeSpan.FromSeconds(5)); var ct = cts.Token;` ◆ **Propagation** : `async Task<decimal> ComputeVarAsync(Portfolio p, CancellationToken ct) { await Task.Delay(1000, ct); /* simulation */ ct.ThrowIfCancellationRequested(); return result; }` ◆ **Dans ASP.NET Core** : le controller reçoit automatiquement `HttpContext.RequestAborted` comme `CancellationToken` — si le client ferme la connexion, le token est annulé → propagé aux appels SQL/réseau en aval. `public async Task<IActionResult> Get(CancellationToken ct) { var data = await _service.GetAsync(ct); }` ◆ **Annulation coopérative** : le token ne FORCE pas l'arrêt — il signale l'intention. Le code doit vérifier `ct.IsCancellationRequested` ou appeler `ct.ThrowIfCancellationRequested()` aux points d'annulation. ◆ **`OperationCanceledException`** : exception levée lors de l'annulation — l'attraper séparément des autres exceptions."
  },
  {
    "question": "Thread-safety — Race conditions, lock, ConcurrentDictionary, Interlocked",
    "answer": "**Race condition** : deux threads lisent-modifient-écrivent la même variable simultanément → résultat imprévisible. `count++` n'est PAS atomique (lire, incrémenter, écrire = 3 opérations). ◆ **`lock`** : `private readonly object _syncObj = new(); lock(_syncObj) { _cache[key] = value; }` — garantit qu'un seul thread exécute le bloc à la fois. Simple mais bloquant. ◆ **`Interlocked`** : opérations atomiques sans lock. `Interlocked.Increment(ref _counter)` — incrément thread-safe. `Interlocked.Exchange(ref _surface, newSurface)` — swap atomique d'une référence. ◆ **`ConcurrentDictionary<K,V>`** : `_cache.GetOrAdd(isin, _ => LoadFromDb(isin))` — thread-safe sans lock explicite. ◆ **`ConcurrentBag<T>`** : collection thread-safe pour ajouts parallèles sans ordre garanti. Idéal avec `Parallel.ForEach`. ◆ **`volatile`** : indique au compilateur de ne pas mettre en cache la variable — garantit la visibilité entre threads. `private volatile bool _isRunning;` ◆ **⚠️ Règle d'or** : minimiser les données partagées entre threads. Préférer les variables locales (thread-local) aux variables partagées."
  },
  {
    "question": "Async sur serveur web — ASP.NET Core, ThreadPool, scalabilité",
    "answer": "**Serveur web synchrone (problème)** : 500 req/sec × 200ms SQL = 100 threads bloqués en permanence. Le ThreadPool s'épuise → nouvelles requêtes attendent → latence explose → crash. Historiquement, .NET avait cette réputation d'inefficacité vs Node.js. ◆ **Serveur web async (solution)** : Thread reçoit la requête HTTP → lance `await sql.QueryAsync()` → retourne AU POOL libre → thread 2 reçoit la requête HTTP 2 → lance `await sql.QueryAsync()` → retourne au pool → résultat SQL 1 arrive → n'importe quel thread libre traite et répond. Avec 2 threads, on peut gérer 100 requêtes simultanées ! ◆ **Node.js comparison** : JavaScript mono-thread, forcé d'être async depuis le début → très efficient en web. .NET multi-thread mais souvent mal utilisé (synchrone). Avec async/await, ASP.NET Core est aussi efficace que Node.js. ◆ **Docker + cloud** : scalabilité horizontale — pas besoin de plus de threads sur une machine. Ajouter plus de containers Docker. Chaque container peut avoir 1 seul cœur virtuel. ◆ **Pas besoin de Parallel** : le parallélisme web est géré AUTOMATIQUEMENT par le serveur (distribution HTTP sur les threads du pool). Le développeur doit seulement écrire async/await."
  },
  {
    "question": "ValueTask vs Task — Optimisation pour les chemins de code fréquents",
    "answer": "**`Task`** : toujours alloué sur le heap — même si le résultat est disponible immédiatement (cache hit). Pour 1M de calls/sec, 1M d'allocations Task → pression GC. ◆ **`ValueTask<T>`** : struct (type valeur) — si le résultat est disponible synchronement (cache hit), ZÉRO allocation. `public ValueTask<string> GetFromCacheAsync(string key) { if(_cache.TryGetValue(key, out var val)) return new ValueTask<string>(val); return new ValueTask<string>(LoadFromDatabaseAsync(key)); }` ◆ **Quand utiliser `ValueTask`** : méthodes appelées très fréquemment avec un chemin de code synchrone commun (cache, hot path). ◆ **Quand garder `Task`** : la grande majorité des cas. `ValueTask` a des restrictions : ne peut être `await`-é qu'UNE SEULE FOIS, ne peut pas être mis en cache/partagé entre plusieurs awaiters. ◆ **`Task.FromResult()`** : créer une Task déjà complète avec une valeur. `return Task.FromResult(cachedValue);` — pour les implémentations synchrones d'interfaces async. ◆ **`Task.CompletedTask`** : Task déjà complète sans valeur. Pour les méthodes `async Task` qui n'ont rien à await."
  },
  {
    "question": "Deadlocks async — .Result, .Wait(), et le contexte de synchronisation",
    "answer": "**Deadlock classique** : `public string GetData() { return GetDataAsync().Result; }` dans ASP.NET Framework ou WPF. ◆ **Pourquoi ça bloque** : `GetDataAsync()` est awaité sur le contexte de synchronisation (thread UI ou thread ASP.NET). `.Result` bloque CE thread en attendant. La continuation de `GetDataAsync()` a besoin de se réexécuter sur CE MÊME thread → impasse totale. ◆ **Cas où `.Result` est 'safe'** : dans une application console (pas de contexte de sync), dans une méthode `static void Main` (avant .NET 5). ◆ **Solution correcte** : `await` jusqu'au bout de la chaîne. Jamais `.Result` ni `.Wait()` dans du code async. ◆ **`ConfigureAwait(false)`** : `await GetDataAsync().ConfigureAwait(false)` — ne capture pas le contexte de sync → la continuation peut s'exécuter sur n'importe quel thread → évite le deadlock dans les bibliothèques. À utiliser dans les libraries/NuGet packages, PAS dans le code UI ou les controllers ASP.NET Core (ASP.NET Core n'a plus de SynchronizationContext de toute façon). ◆ **Outils de diagnostic** : Visual Studio Debugger → onglet Threads → identifier les threads en attente."
  },
  {
    "question": "async Main, IAsyncEnumerable et les nouveautés async C#",
    "answer": "**`async Main`** (C# 7.1+) : `static async Task Main(string[] args) { await RunAsync(); }` — le point d'entrée peut être async. Avant : obligation de `.GetAwaiter().GetResult()` dans Main → deadlock possible. ◆ **`IAsyncEnumerable<T>`** (C# 8+) : énumérable async — `await foreach(var item in GetItemsAsync()) { process(item); }`. Utile pour : lire des lignes d'un fichier volumineux une par une, streamer des résultats de BD, lire un flux réseau progressivement sans tout charger en mémoire. ◆ **`yield return` async** : `async IAsyncEnumerable<Trade> GetTradesAsync() { await foreach(var row in db.QueryAsync(sql)) { yield return MapTrade(row); } }` ◆ **`Channel<T>`** (remplace `ConcurrentQueue` + polling) : `Channel<Order>.CreateBounded(1000)` — pipeline producteur/consommateur async avec backpressure. Le producteur `await writer.WriteAsync(order)` — attend si plein. Le consommateur `await foreach(var order in reader.ReadAllAsync())` — attend s'il n'y a rien. ◆ **`SemaphoreSlim` async** : `await semaphore.WaitAsync(ct)` — limiter le nombre de tâches parallèles (throttling). Utile pour ne pas envoyer 1000 requêtes simultanées à une API externe."
  },
  {
    "question": "Parallel LINQ (PLINQ) avancé — Partitionnement, ordre, exceptions",
    "answer": "**Partitionnement automatique** : PLINQ divise la collection en partitions (une par thread). Par défaut : partitions de taille égale (Range partitioning). Pour des tâches de durée inégale : `Partitioner.Create(collection, EnumerablePartitionerOptions.NoBuffering)` — partitionnement dynamique (les threads 'rapides' prennent plus d'éléments). ◆ **Gestion des exceptions** : si plusieurs tâches lèvent des exceptions, PLINQ les collecte dans une `AggregateException`. `try { options.AsParallel().ForAll(o => o.ComputeGreeks()); } catch(AggregateException ae) { foreach(var ex in ae.InnerExceptions) logger.Log(ex); }` ◆ **`.WithCancellation(ct)`** : `options.AsParallel().WithCancellation(ct).Select(...)` — annuler la requête parallèle via un token. ◆ **Mesure des gains** : `Stopwatch.StartNew()` + benchmarks. PLINQ peut être PLUS LENT que LINQ normal pour : petites collections (< 1000 éléments), opérations très rapides (overhead de synchronisation > gain), collections non-indexables (LinkedList). ◆ **`AsSequential()`** : forcer une partie de la pipeline PLINQ à s'exécuter séquentiellement (ex: opérations ordonnées, effets de bord)."
  },
  {
    "question": "Patterns d'architecture async — Fire-and-forget, Outbox, IHostedService",
    "answer": "**Fire-and-forget (dangereux)** : `_ = SendNotificationAsync(trade)` — lancer sans attendre. Problème : les exceptions sont silencieusement avalées, les erreurs passent inaperçues. À éviter dans le code de production. ◆ **Fire-and-forget SAFE** : `_ = SendNotificationAsync(trade).ContinueWith(t => logger.LogError(t.Exception, \"Notification failed\"), TaskContinuationOptions.OnlyOnFaulted);` — logger les erreurs. ◆ **`IHostedService` / `BackgroundService`** : le pattern correct pour les tâches de fond en ASP.NET Core. `protected override async Task ExecuteAsync(CancellationToken ct) { while(!ct.IsCancellationRequested) { await ProcessQueueAsync(ct); await Task.Delay(1000, ct); } }` ◆ **Outbox Pattern** : au lieu de publier directement sur RabbitMQ (deux opérations non atomiques), sauvegarder le message dans la DB (même transaction que l'entité), puis un `IHostedService` publie les messages non-envoyés. Garantie de livraison sans transaction distribuée. ◆ **`Channel<T>` comme pipeline** : le controller écrit dans le channel (`await writer.WriteAsync(req, ct)`), un `IHostedService` lit et traite (`await foreach(var req in reader.ReadAllAsync(ct))`). Découplage parfait, backpressure native."
  },
  {
    "question": "Comparaison C# vs JavaScript — Async, threads, architecture web",
    "answer": "**JavaScript** : mono-thread par conception. TOUTE l'exécution est sur un seul thread. Async est la SEULE façon de ne pas bloquer. Event loop : une queue de callbacks exécutés séquentiellement. `await fetch(url)` → callback mis en queue quand la réponse arrive. ◆ **C#** : multi-threads natif. Async est une OPTION (pas une obligation) mais une bonne pratique. ThreadPool géré par le runtime. SynchronizationContext pour les apps UI. ◆ **Node.js vs ASP.NET Core** : Node.js a longtemps été plus efficace car les devs .NET codaient en synchrone. Aujourd'hui, ASP.NET Core avec async/await est aussi efficace (ou plus) que Node.js. ◆ **Pourquoi Node.js était plus rapide** : les développeurs .NET classiques n'utilisaient pas async → threads bloqués → ThreadPool épuisé → latence. Node.js forcé d'être async → efficace par défaut. ◆ **Scalabilité cloud** : Docker containers avec 1 cœur virtuel × 100 containers = parallélisme horizontal. Chaque container avec async/await = efficace sur son cœur unique. Plus besoin de parallélisme intra-machine pour le web. ◆ **Conclusion** : C# offre async ET parallèle. JavaScript : async uniquement (Workers pour le parallèle). Les deux sont excellents en web avec async/await."
  },
  {
    "question": "Récapitulatif — Choisir le bon outil : async vs Task.Run vs Parallel vs PLINQ",
    "answer": "**I/O-bound (réseau, BD, fichiers)** → `async/await` + `Task.WhenAll` pour plusieurs I/O simultanées. NE PAS utiliser `Task.Run` ni `Parallel` pour l'I/O — gaspillage de threads CPU. ◆ **CPU-bound, itérations sur collection** → `Parallel.For` / `Parallel.ForEach` / PLINQ. ◆ **CPU-bound, méthodes différentes en parallèle** → `Parallel.Invoke`. ◆ **CPU-bound depuis contexte async** → `await Task.Run(() => HeavyCalc())` — libère le thread async et soumet le calcul au ThreadPool. ◆ **Flux de données continu** → `IAsyncEnumerable<T>` + `await foreach`. ◆ **Pipeline producteur/consommateur** → `Channel<T>`. ◆ **Tâche de fond récurrente** → `BackgroundService` / `IHostedService`. ◆ **⚠️ Anti-patterns à bannir** : `async void` (sauf event handlers), `.Result` / `.Wait()` sur du code async, `Parallel.ForEach` sur des I/O-bound, `Task.Run` inutile wrappant du code déjà async, fire-and-forget sans gestion d'erreur."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Confusion fondamentale] Quelle est la différence entre programmation asynchrone et programmation parallèle ?",
      "options": [
        "Ce sont deux termes synonymes — les deux font tourner des tâches simultanément.",
        "L'asynchronisme évite de BLOQUER un thread pendant une attente (I/O). Le parallélisme exécute plusieurs calculs SIMULTANÉMENT sur plusieurs cœurs CPU. L'async ne nécessite PAS plusieurs cœurs.",
        "Le parallélisme est pour le serveur, l'async est pour le client.",
        "L'async utilise des threads, le parallélisme utilise des processus."
      ],
      "answer": "L'asynchronisme évite de BLOQUER un thread pendant une attente (I/O). Le parallélisme exécute plusieurs calculs SIMULTANÉMENT sur plusieurs cœurs CPU. L'async ne nécessite PAS plusieurs cœurs.",
      "explanation": "C'est LA distinction fondamentale du cours. Async = libérer un thread pendant qu'il attend (réseau, BD, disque) → scalabilité. Parallèle = plusieurs cœurs calculent en même temps → vitesse de calcul. Sur un serveur avec 1 seul cœur virtuel (cloud), l'async est indispensable, le parallélisme est impossible. Exemple : await sql.QueryAsync() = async (libère le thread 200ms). Parallel.For(calcul Monte Carlo) = parallèle (utilise les 8 cœurs)."
    },
    {
      "question": "[Confusion] Que fait `await` sur un thread ? Crée-t-il un nouveau thread ?",
      "options": [
        "Oui — `await` crée un nouveau thread en arrière-plan pour exécuter l'opération.",
        "Non — `await` LIBÈRE le thread appelant dans le pool pendant l'attente I/O. Aucun thread n'est créé. Quand l'opération termine, un thread libre (pas forcément le même) reprend l'exécution.",
        "`await` met le thread en veille (Sleep) jusqu'à ce que la tâche soit terminée.",
        "`await` bloque le thread appelant et attend la fin de l'opération."
      ],
      "answer": "Non — `await` LIBÈRE le thread appelant dans le pool pendant l'attente I/O. Aucun thread n'est créé. Quand l'opération termine, un thread libre (pas forcément le même) reprend l'exécution.",
      "explanation": "Confusion ultra-fréquente. `await` = 'libère le thread, continue quand c'est prêt'. Pas de création de thread. Le thread devient disponible pour d'autres requêtes HTTP pendant que la BD répond. C'est pourquoi 2 threads peuvent gérer 100 requêtes simultanées avec async : les threads ne sont jamais bloqués à attendre. `Task.Run()` lui, soumet un travail à un thread du pool (n'en crée pas non plus, mais utilise un thread existant)."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un Thread Pool en .NET ?",
      "options": [
        "Une bibliothèque de gestion de bases de données.",
        "Un ensemble de threads pré-créés et réutilisables — évite le coût de création/destruction de nouveaux threads à chaque opération. Le runtime .NET le gère automatiquement.",
        "Un pool de connexions SQL Server partagées entre les threads.",
        "Un groupe de processus qui partagent la même mémoire."
      ],
      "answer": "Un ensemble de threads pré-créés et réutilisables — évite le coût de création/destruction de nouveaux threads à chaque opération. Le runtime .NET le gère automatiquement.",
      "explanation": "Créer un thread coûte environ 1MB de RAM (stack) + temps d'initialisation OS. Avec le ThreadPool : les threads sont créés une fois au démarrage et réutilisés. `Task.Run(...)` prend un thread du pool, l'utilise, le remet. ASP.NET Core utilise le ThreadPool pour gérer les requêtes HTTP. Par défaut, le pool commence avec ~nombre_de_cœurs threads et peut grandir à la demande. C'est pour ça que l'async est crucial : éviter de monopoliser ces threads précieux en les bloquant sur des I/O."
    },
    {
      "question": "[Confusion] `await t1; await t2;` — Est-ce que les deux tâches s'exécutent en parallèle ?",
      "options": [
        "Oui — les deux tâches sont lancées simultanément dès que le code est atteint.",
        "Non — `await t1` attend que t1 soit TERMINÉE avant de lancer t2. C'est séquentiel. Pour le parallélisme async, utiliser `await Task.WhenAll(t1, t2)`.",
        "Cela dépend du nombre de cœurs CPU disponibles.",
        "Oui, si les deux méthodes sont marquées `async`."
      ],
      "answer": "Non — `await t1` attend que t1 soit TERMINÉE avant de lancer t2. C'est séquentiel. Pour le parallélisme async, utiliser `await Task.WhenAll(t1, t2)`.",
      "explanation": "Erreur très fréquente. `await t1; await t2;` = t1 finit → t2 commence. Si t1 = 20ms et t2 = 25ms → total 45ms. `await Task.WhenAll(t1, t2)` = t1 et t2 démarrent ensemble → total 25ms (la plus longue). Important : pour le vrai parallélisme, créer les Tasks AVANT le WhenAll : `var t1 = ComputeAsync1(); var t2 = ComputeAsync2(); await Task.WhenAll(t1, t2)`. Si on écrit `await Task.WhenAll(ComputeAsync1(), ComputeAsync2())` c'est aussi correct — les deux appels sont évalués avant d'entrer dans WhenAll."
    },
    {
      "question": "[Confusion critique] Pourquoi `async void` est-il dangereux dans un service ?",
      "options": [
        "Il est plus lent que `async Task`.",
        "Les exceptions d'une `async void` ne peuvent pas être catchées avec try/catch — elles crashent le process entier. La méthode ne peut pas être await-ée ni testée.",
        "Il bloque le thread UI.",
        "Il n'est pas supporté dans ASP.NET Core."
      ],
      "answer": "Les exceptions d'une `async void` ne peuvent pas être catchées avec try/catch — elles crashent le process entier. La méthode ne peut pas être await-ée ni testée.",
      "explanation": "`async void ProcessMessage(msg)` : si une exception se lève dans cette méthode, elle est lancée directement sur le SynchronizationContext → `UnhandledExceptionHandler` → le process crash. Pas moyen de faire `try { await ProcessMessage(msg); } catch(...)` car `async void` n'est pas awaitable. En production : le service plante silencieusement, tous les messages en cours perdus. Solution toujours : `async Task ProcessMessageAsync(msg)` + l'appeler avec `await`. Exception unique : event handlers UI (`Button_Click`) où la signature est imposée par le framework."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que `Parallel.ForEach` et pour quel type d'opération est-il fait ?",
      "options": [
        "Une version async de `foreach` pour les opérations réseau.",
        "Une boucle foreach qui distribue les itérations sur plusieurs threads CPU simultanément — pour les opérations CPU-bound (calcul intensif). NE PAS utiliser pour les I/O (réseau, BD).",
        "Un foreach qui annule automatiquement si une itération échoue.",
        "Un foreach thread-safe qui utilise un lock interne sur chaque élément."
      ],
      "answer": "Une boucle foreach qui distribue les itérations sur plusieurs threads CPU simultanément — pour les opérations CPU-bound (calcul intensif). NE PAS utiliser pour les I/O (réseau, BD).",
      "explanation": "`Parallel.ForEach(options, opt => opt.ComputeGreeks(marketData))` — .NET découpe automatiquement la liste entre les cœurs. Sur 8 cœurs : 8 options calculées en même temps → ~8× plus rapide. À NE PAS utiliser pour `await sql.QueryAsync()` dans la lambda — les threads CPU se bloqueraient sur des I/O, gaspillage total. Pour I/O parallèles : `await Task.WhenAll(options.Select(o => o.PriceAsync()))`. Attention : les lambdas partagent la mémoire → utiliser ConcurrentBag ou tableaux indexés pour stocker les résultats."
    },
    {
      "question": "[Correspondance] Associez l'outil C# à son usage correct : `async/await` → ? / `Parallel.For` → ? / `Channel<T>` → ?",
      "options": [
        "Calcul CPU / Attente I/O / Pipeline producteur-consommateur",
        "Attente I/O sans bloquer / Calcul CPU sur plusieurs cœurs / Pipeline producteur-consommateur avec backpressure",
        "Attente I/O / Flux de données / Annulation",
        "Threading / Async / Collections thread-safe"
      ],
      "answer": "Attente I/O sans bloquer / Calcul CPU sur plusieurs cœurs / Pipeline producteur-consommateur avec backpressure",
      "explanation": "Trois outils, trois usages distincts : `async/await` = libérer le thread pendant une attente I/O (BD, réseau, fichiers). Aucun gain sur du calcul pur. `Parallel.For` = distribuer un calcul CPU intensif sur tous les cœurs — aucun sens pour de l'I/O. `Channel<T>` = pipeline producteur/consommateur avec backpressure native — le producteur attend si le channel est plein (bounded), le consommateur attend s'il est vide. Remplace avantageusement ConcurrentQueue + polling actif."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que la backpressure dans un `Channel<T>` borné ?",
      "options": [
        "Un mécanisme qui compresse les données pour réduire l'usage mémoire.",
        "Quand le channel est plein (capacité atteinte), le producteur est automatiquement ralenti — `await writer.WriteAsync(item)` attend qu'une place se libère. Évite la surcharge du consommateur.",
        "Un mécanisme de retry automatique si le consommateur échoue.",
        "La pression du cache CPU sur les threads secondaires."
      ],
      "answer": "Quand le channel est plein (capacité atteinte), le producteur est automatiquement ralenti — `await writer.WriteAsync(item)` attend qu'une place se libère. Évite la surcharge du consommateur.",
      "explanation": "Sans backpressure (unbounded queue) : le producteur inonde le consommateur → mémoire saturée → OutOfMemoryException. Avec `Channel.CreateBounded(1000)` : si la queue a 1000 éléments, `await writer.WriteAsync(item, ct)` attend qu'un slot se libère — naturellement. C'est plus propre que de gérer manuellement une `ConcurrentQueue` + vérifier la taille + `Thread.Sleep`. Exemple : en CIB, les requêtes de pricing arrivent en rafale à l'ouverture des marchés — le channel absorbe les bursts sans exploser."
    },
    {
      "question": "[Confusion] Quelle est la différence entre `Process` et `Thread` en .NET ?",
      "options": [
        "Un process est plus léger qu'un thread.",
        "Un process a une mémoire ISOLÉE — deux processes ne peuvent pas accéder à la mémoire l'un de l'autre. Des threads dans le même process PARTAGENT la même mémoire.",
        "Un process peut avoir plusieurs threads, mais un thread ne peut appartenir qu'à un seul process. La différence principale est l'isolation mémoire.",
        "Les réponses B et C sont toutes les deux correctes."
      ],
      "answer": "Les réponses B et C sont toutes les deux correctes.",
      "explanation": "Les deux réponses B et C décrivent des caractéristiques réelles et complémentaires. Process = isolation mémoire (sécurité, stabilité — un crash ne contamine pas l'autre). Thread = mémoire partagée dans le même process (efficace pour partager des données, mais risque de race conditions). Un process peut avoir N threads. Un thread appartient à UN seul process. La mémoire partagée entre threads est le principal avantage ET le principal danger du multithreading."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un `CancellationToken` et pourquoi le propager dans la chaîne async ?",
      "options": [
        "Un token de sécurité pour authentifier les appels async.",
        "Un signal coopératif d'annulation — si le client HTTP déconnecte, le token est annulé et propagé à tous les appels en aval (SQL, réseau) pour arrêter proprement le travail inutile.",
        "Un timeout automatique sur les méthodes async.",
        "Un identifiant unique pour suivre une opération async dans les logs."
      ],
      "answer": "Un signal coopératif d'annulation — si le client HTTP déconnecte, le token est annulé et propagé à tous les appels en aval (SQL, réseau) pour arrêter proprement le travail inutile.",
      "explanation": "Sans CancellationToken : le client ferme son navigateur pendant un calcul de 30s → le serveur continue de calculer → gaspillage de CPU, threads et connexions BD. Avec CancellationToken propagé : `await _ctx.Trades.Where(...).ToListAsync(ct)` → si ct est annulé, la requête SQL est interrompue, le thread libéré immédiatement. Dans ASP.NET Core : `HttpContext.RequestAborted` est déjà un CancellationToken prêt à l'emploi. Règle : toujours accepter et propager `CancellationToken ct` dans toutes les méthodes async d'un service."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que PLINQ et quand l'utiliser ?",
      "options": [
        "PLINQ est une version async de LINQ pour les requêtes de base de données.",
        "PLINQ (Parallel LINQ) ajoute `.AsParallel()` à une requête LINQ pour distribuer le traitement sur plusieurs cœurs CPU. À utiliser pour des calculs intensifs sur de grandes collections en mémoire.",
        "PLINQ est uniquement disponible dans .NET 6 et supérieur.",
        "PLINQ est automatiquement activé sur toutes les requêtes LINQ en mode Release."
      ],
      "answer": "PLINQ (Parallel LINQ) ajoute `.AsParallel()` à une requête LINQ pour distribuer le traitement sur plusieurs cœurs CPU. À utiliser pour des calculs intensifs sur de grandes collections en mémoire.",
      "explanation": "PLINQ = `.AsParallel()` sur n'importe quelle collection. `options.AsParallel().Select(o => o.ComputeGreeks(md)).ToList()` — .NET partitionne la collection, distribue sur les cœurs, réassemble. Gain réel sur : grandes collections (>1000 éléments), opérations coûteuses par élément (calcul Black-Scholes, Monte Carlo partiel). PAS utile pour : petites collections (overhead > gain), opérations très rapides, accès BD (I/O-bound → utiliser async/await). `.AsOrdered()` pour préserver l'ordre des éléments (avec coût de synchronisation)."
    },
    {
      "question": "[Confusion] `Task.Run(() => calc())` vs `await calcAsync()` — quelle différence fondamentale ?",
      "options": [
        "Aucune différence — les deux libèrent le thread appelant.",
        "`Task.Run(() => calc())` soumet un travail CPU-bound sur un thread du pool (parallélisme). `await calcAsync()` libère le thread pendant une attente I/O. Le premier UTILISE un thread, le second en LIBÈRE un.",
        "`Task.Run` est déprécié depuis .NET 5 — utiliser uniquement `await`.",
        "`Task.Run` est pour les méthodes synchrones, `await` pour les méthodes async uniquement."
      ],
      "answer": "`Task.Run(() => calc())` soumet un travail CPU-bound sur un thread du pool (parallélisme). `await calcAsync()` libère le thread pendant une attente I/O. Le premier UTILISE un thread, le second en LIBÈRE un.",
      "explanation": "Distinction critique. `Task.Run(() => HeavyCalc())` = prend un thread du pool et l'utilise pour exécuter le calcul — le thread est OCCUPÉ pendant le calcul. Utile pour libérer le thread UI ou le thread HTTP principal d'un calcul long. `await sql.QueryAsync()` = lance la requête SQL puis LIBÈRE totalement le thread — aucun thread utilisé pendant l'attente. La confusion vient du fait que les deux permettent de 'ne pas bloquer le thread appelant' mais pour des raisons totalement différentes."
    },
    {
      "question": "[Terme → Définition] Pourquoi le serveur web gère-t-il automatiquement le parallélisme sans que le développeur ait besoin de programmer des threads ?",
      "options": [
        "Parce que ASP.NET Core utilise JavaScript en interne.",
        "Le serveur web assigne chaque requête HTTP à un thread disponible du pool — la distribution sur les cœurs CPU est gérée automatiquement par l'OS et le runtime. Le développeur doit seulement veiller à ne pas bloquer ces threads (async/await).",
        "Parce que les requêtes HTTP sont traitées dans un seul thread en file d'attente.",
        "Le parallélisme web est géré par Docker, pas par le code C#."
      ],
      "answer": "Le serveur web assigne chaque requête HTTP à un thread disponible du pool — la distribution sur les cœurs CPU est gérée automatiquement par l'OS et le runtime. Le développeur doit seulement veiller à ne pas bloquer ces threads (async/await).",
      "explanation": "Kestrel (serveur ASP.NET Core) : chaque requête HTTP entrante est assignée à un thread libre du ThreadPool. Le scheduler OS distribue ces threads sur les cœurs disponibles. Si un cœur est libre et un thread est prêt → le thread s'exécute dessus. Le développeur n'a pas besoin de faire `new Thread()` ou `Parallel.For` pour gérer plusieurs requêtes simultanées. Son seul travail : rendre ces threads le plus disponibles possible → async/await partout → thread libéré pendant les I/O → plus de requêtes traitées avec les mêmes threads."
    },
    {
      "question": "[Confusion] `.Result` sur une Task dans ASP.NET Core — quel risque ?",
      "options": [
        "Aucun risque — `.Result` est équivalent à `await`.",
        "Deadlock potentiel : `.Result` bloque le thread en attendant la Task. Si la continuation de la Task a besoin du même thread (SynchronizationContext), impasse totale. De plus, si la Task lève une exception, elle est enveloppée dans AggregateException.",
        "`.Result` n'est pas supporté dans ASP.NET Core.",
        "`.Result` force une exécution synchrone plus lente mais sûre."
      ],
      "answer": "Deadlock potentiel : `.Result` bloque le thread en attendant la Task. Si la continuation de la Task a besoin du même thread (SynchronizationContext), impasse totale. De plus, si la Task lève une exception, elle est enveloppée dans AggregateException.",
      "explanation": "Scénario de deadlock classique : `public string Get() { return GetAsync().Result; }`. Le thread HTTP appelle `.Result` → bloqué. La continuation de `GetAsync()` essaie de reprendre sur ce même thread (ASP.NET Framework, WPF) → impossible → impasse. La requête ne répond jamais (timeout). Solution : `await GetAsync()` jusqu'au bout. Note : dans ASP.NET Core (pas Framework), il n'y a plus de SynchronizationContext → `.Result` peut ne pas deadlocker. Mais c'est quand même une mauvaise pratique (gaspille un thread, AggregateException au lieu de l'exception directe)."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre `Parallel.Invoke` et `Task.WhenAll` ?",
      "options": [
        "Ce sont des synonymes — deux syntaxes pour la même opération.",
        "`Parallel.Invoke` est synchrone (bloque le thread appelant). `Task.WhenAll` est async (libère le thread appelant). Parallel.Invoke pour CPU-bound. Task.WhenAll pour I/O-bound async.",
        "`Parallel.Invoke` peut prendre des valeurs de retour, `Task.WhenAll` non.",
        "`Task.WhenAll` exécute les tâches séquentiellement, `Parallel.Invoke` en parallèle."
      ],
      "answer": "`Parallel.Invoke` est synchrone (bloque le thread appelant). `Task.WhenAll` est async (libère le thread appelant). Parallel.Invoke pour CPU-bound. Task.WhenAll pour I/O-bound async.",
      "explanation": "`Parallel.Invoke(() => LoadA(), () => LoadB())` — le thread appelant est bloqué jusqu'à ce que LoadA et LoadB finissent. Utilise le ThreadPool pour les deux actions. Synchrone. `await Task.WhenAll(LoadAAsync(), LoadBAsync())` — le thread est libéré pendant l'attente. Les deux tâches async s'exécutent 'en parallèle' (attente I/O simultanée). Règle : actions CPU-bound → `Parallel.Invoke` ou `Task.Run` + `WhenAll`. Actions I/O-bound async → `Task.WhenAll` directement."
    },
    {
      "question": "[Confusion] Peut-on utiliser `async/await` sur un ordinateur avec un seul cœur CPU ?",
      "options": [
        "Non — async/await nécessite plusieurs cœurs pour libérer des threads.",
        "Oui — async/await fonctionne parfaitement sur un seul cœur. Il libère le thread pendant l'attente I/O, et un seul thread peut gérer plusieurs requêtes simultanées en attendant les I/O.",
        "Oui mais avec des performances réduites — un seul cœur ne peut pas vraiment libérer de threads.",
        "Seulement si le code utilise ConfigureAwait(false)."
      ],
      "answer": "Oui — async/await fonctionne parfaitement sur un seul cœur. Il libère le thread pendant l'attente I/O, et un seul thread peut gérer plusieurs requêtes simultanées en attendant les I/O.",
      "explanation": "Exemple du cours : serveur web dans le cloud avec 1 seul cœur virtuel. Thread 1 reçoit Requête 1 → lance `await db.QueryAsync()` → libère Thread 1. Thread 1 reçoit Requête 2 → lance `await db.QueryAsync()` → libère Thread 1. Résultat BD 1 arrive → Thread 1 traite et répond. Résultat BD 2 arrive → Thread 1 traite et répond. Avec 1 seul thread sur 1 seul cœur, 2 requêtes simultanées gérées efficacement. C'est exactement ce que fait Node.js en JavaScript (mono-thread). Le parallélisme (plusieurs calculs CPU simultanés) lui nécessite plusieurs cœurs — mais c'est une autre chose."
    },
    {
      "question": "[Confusion] Quel est l'usage CORRECT de `async void` en C# ?",
      "options": [
        "Toujours — `async void` est plus simple à écrire que `async Task`.",
        "Jamais — `async void` est toujours dangereux et doit être évité.",
        "UNIQUEMENT pour les event handlers UI dont la signature est imposée par le framework : `private async void Button_Click(object sender, EventArgs e)`. Dans TOUS les autres cas : `async Task`.",
        "Pour les méthodes qui ne retournent pas de valeur et ne nécessitent pas d'être attendues."
      ],
      "answer": "UNIQUEMENT pour les event handlers UI dont la signature est imposée par le framework : `private async void Button_Click(object sender, EventArgs e)`. Dans TOUS les autres cas : `async Task`.",
      "explanation": "La signature `void Button_Click(object sender, EventArgs e)` est définie par le framework WPF/WinForms/Blazor — on ne peut pas la changer en `Task`. D'où l'exception `async void`. Dans TOUS les autres cas : `async Task` obligatoire. Cas piège : `Timer.Elapsed += async (s,e) => { await DoWorkAsync(); }` — c'est un event handler, donc `async void` acceptable ici. Mais : tout service, toute méthode métier, tout repository, tout controller → `async Task` ou `async Task<T>`."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que `IAsyncEnumerable<T>` et `await foreach` ?",
      "options": [
        "Une collection async qui charge tous les éléments en mémoire avant d'itérer.",
        "Un énumérable async qui produit les éléments UN PAR UN de façon asynchrone. `await foreach(var item in GetItemsAsync())` attend chaque élément individuellement — idéal pour streamer de grandes quantités de données sans tout charger en RAM.",
        "Un remplacement async de `List<T>` pour les collections thread-safe.",
        "Une interface uniquement disponible dans .NET 8 et supérieur."
      ],
      "answer": "Un énumérable async qui produit les éléments UN PAR UN de façon asynchrone. `await foreach(var item in GetItemsAsync())` attend chaque élément individuellement — idéal pour streamer de grandes quantités de données sans tout charger en RAM.",
      "explanation": "Cas d'usage concret : lire 1 million de trades depuis la BD. `ToListAsync()` charge 1M d'objets en RAM → OutOfMemoryException potentiel. Avec `IAsyncEnumerable` : `async IAsyncEnumerable<Trade> StreamTradesAsync() { await foreach(var row in db.QueryUnbufferedAsync(sql)) { yield return MapTrade(row); } }`. Le consommateur traite chaque trade un par un, la mémoire utilisée reste constante. Utile aussi : SignalR (streamer des prix de marché en temps réel), lire un fichier CSV ligne par ligne, paginer une API externe."
    },
    {
      "question": "[Confusion] `Parallel.For` avec `async` dans la lambda — est-ce correct ?",
      "options": [
        "Oui — `Parallel.For(0, N, async i => { await ProcessAsync(i); })` exécute correctement N tâches async en parallèle.",
        "Non — `Parallel.For` n'attend PAS les lambdas async. `async void` implicite → exceptions silencieuses → le `Parallel.For` retourne avant la fin de toutes les tâches. Pour des I/O parallèles, utiliser `Task.WhenAll`.",
        "Oui, mais seulement si `MaxDegreeOfParallelism` est spécifié.",
        "Non — `Parallel.For` ne supporte pas du tout les lambdas."
      ],
      "answer": "Non — `Parallel.For` n'attend PAS les lambdas async. `async void` implicite → exceptions silencieuses → le `Parallel.For` retourne avant la fin de toutes les tâches. Pour des I/O parallèles, utiliser `Task.WhenAll`.",
      "explanation": "Piège subtil : `Parallel.For(0, N, async i => { await SaveAsync(i); })` — la lambda est `async void` implicitement (Parallel.For prend une Action, pas une Func<Task>). Résultat : Parallel.For lance N tâches et RETOURNE IMMÉDIATEMENT sans attendre. Les saves async continuent en arrière-plan → race conditions, exceptions perdues. Solution pour N I/O parallèles : `await Task.WhenAll(Enumerable.Range(0, N).Select(i => SaveAsync(i)))`. Limiter à MaxConcurrency avec SemaphoreSlim si besoin."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que `ConfigureAwait(false)` et dans quel contexte l'utiliser ?",
      "options": [
        "Une option pour désactiver la vérification de thread-safety dans les méthodes async.",
        "Indique à `await` de ne pas capturer le contexte de synchronisation actuel — la continuation peut reprendre sur n'importe quel thread. À utiliser dans les bibliothèques/packages NuGet pour éviter les deadlocks. PAS dans le code UI ou controllers ASP.NET Core.",
        "Active le mode de configuration automatique pour les paramètres async.",
        "Permet à une méthode async de s'exécuter sans CancellationToken."
      ],
      "answer": "Indique à `await` de ne pas capturer le contexte de synchronisation actuel — la continuation peut reprendre sur n'importe quel thread. À utiliser dans les bibliothèques/packages NuGet pour éviter les deadlocks. PAS dans le code UI ou controllers ASP.NET Core.",
      "explanation": "Contexte de synchronisation : dans WPF/WinForms, `await` capture le contexte du thread UI → la continuation s'exécute sur le thread UI (pour mettre à jour les contrôles). Si quelqu'un appelle `.Result` sur une Task qui utilise le thread UI pour sa continuation → deadlock. Dans une bibliothèque NuGet : utiliser `await someOperation.ConfigureAwait(false)` → la continuation se passe sur un thread pool quelconque, pas forcément le thread UI → pas de deadlock possible. Dans ASP.NET Core : pas de SynchronizationContext → `ConfigureAwait(false)` n'a pas d'impact mais reste une bonne pratique pour la portabilité des libs."
    }
  ],
  avance: [
    {
      "question": "[Architecture] Un serveur ASP.NET Core reçoit 500 requêtes/sec, chacune faisant une requête SQL de 100ms. Combien de threads sont nécessaires avec et sans async/await ?",
      "options": [
        "Avec ou sans async : 500 threads nécessaires.",
        "Sans async : 50 threads bloqués en permanence (500 req/s × 100ms = 50 threads). Avec async : ~2-4 threads suffisent (libérés pendant l'attente SQL, disponibles pour de nouvelles requêtes).",
        "Sans async : 500 threads. Avec async : 500 threads mais non-bloquants.",
        "Sans async : 1 thread (file d'attente séquentielle). Avec async : 500 threads (un par requête)."
      ],
      "answer": "Sans async : 50 threads bloqués en permanence (500 req/s × 100ms = 50 threads). Avec async : ~2-4 threads suffisent (libérés pendant l'attente SQL, disponibles pour de nouvelles requêtes).",
      "explanation": "Calcul : 500 req/s × 100ms d'attente = en moyenne, 50 requêtes en cours simultanément = 50 threads bloqués en permanence sans async. Avec async : Thread 1 lance `await db.QueryAsync()` → libéré immédiatement → traite une autre requête → résultat revient → thread libre traite la réponse. En pratique avec 2-4 threads et async, on peut gérer 50 requêtes simultanées en I/O car les threads ne sont bloqués que pour le CPU processing (quelques µs), pas pour l'attente BD (100ms)."
    },
    {
      "question": "[Anti-pattern] Un développeur écrit `Parallel.ForEach(trades, async trade => { await _db.SaveAsync(trade); });`. Quel est le problème et la correction ?",
      "options": [
        "Le code est correct — Parallel.ForEach gère bien les lambdas async.",
        "Lambda async dans Parallel.ForEach = `async void` implicite. Parallel.ForEach retourne immédiatement sans attendre les saves. Exceptions perdues. Correction : `await Task.WhenAll(trades.Select(t => _db.SaveAsync(t)))` avec un SemaphoreSlim si besoin de limiter la concurrence.",
        "Parallel.ForEach ne supporte pas EF Core — utiliser une boucle for classique.",
        "Il manque `MaxDegreeOfParallelism = 1` pour éviter les conflits."
      ],
      "answer": "Lambda async dans Parallel.ForEach = `async void` implicite. Parallel.ForEach retourne immédiatement sans attendre les saves. Exceptions perdues. Correction : `await Task.WhenAll(trades.Select(t => _db.SaveAsync(t)))` avec un SemaphoreSlim si besoin de limiter la concurrence.",
      "explanation": "Parallel.ForEach accepte `Action` (pas `Func<Task>`). Une lambda `async trade => { await ... }` devient `async void` → Parallel.ForEach lance les tâches et retourne sans attendre. Les saves continuent en arrière-plan → le code appelant croit que tout est sauvegardé alors que rien ne l'est. Exceptions silencieusement perdues. Correction avec throttling : `var semaphore = new SemaphoreSlim(10); await Task.WhenAll(trades.Select(async t => { await semaphore.WaitAsync(); try { await _db.SaveAsync(t); } finally { semaphore.Release(); } }))` — max 10 saves simultanés."
    },
    {
      "question": "[Code → Analyse] `var t1 = ComputeGreeksAsync(opt1); var t2 = ComputeGreeksAsync(opt2); var results = await Task.WhenAll(t1, t2);`. Combien de threads sont créés ? Sont-ils exécutés en parallèle ?",
      "options": [
        "2 threads créés, exécution parallèle garantie sur 2 cœurs.",
        "Aucun thread créé. Si `ComputeGreeksAsync` est purement async/await I/O-bound, les deux tâches partagent les threads du pool. Si elle contient `Task.Run(calc)`, chaque Task.Run utilise un thread du pool. L'exécution 'parallèle' dépend des ressources disponibles.",
        "1 thread créé partagé entre les deux tâches.",
        "Le nombre de threads créés dépend du nombre de cœurs CPU."
      ],
      "answer": "Aucun thread créé. Si `ComputeGreeksAsync` est purement async/await I/O-bound, les deux tâches partagent les threads du pool. Si elle contient `Task.Run(calc)`, chaque Task.Run utilise un thread du pool. L'exécution 'parallèle' dépend des ressources disponibles.",
      "explanation": "Nuance importante : `await Task.WhenAll(t1, t2)` ne crée PAS de threads. Il dit juste 'attends que les deux soient finies'. Si t1 et t2 sont des I/O (await http.GetAsync), elles peuvent s'exécuter 'simultanément' sur un seul thread (thread libéré puis reprend). Si t1 et t2 contiennent `Task.Run(cpuCalc)`, deux threads du pool sont utilisés simultanément (si disponibles). La 'parallélisme' dans Task.WhenAll vient soit du scheduling I/O (OS), soit de Task.Run (ThreadPool). WhenAll lui-même ne crée rien."
    },
    {
      "question": "[Situation → Architecture] Un service de pricing doit calculer les Greeks de 10 000 options au démarrage. `ComputeGreeks` est CPU-bound (10ms par option). Quelle approche optimale sur un serveur 8 cœurs ?",
      "options": [
        "10 000 `await Task.Run(() => option.ComputeGreeks())` avec Task.WhenAll.",
        "`Parallel.ForEach(options, new ParallelOptions { MaxDegreeOfParallelism = 8 }, opt => results[i] = opt.ComputeGreeks())` ou PLINQ — distribue les calculs sur les 8 cœurs. Temps : ~10 000 × 10ms / 8 = ~12.5 secondes au lieu de 100 secondes.",
        "Une boucle `foreach` classique — plus lisible et assez rapide.",
        "Async/await sur chaque option — libère les threads pendant le calcul."
      ],
      "answer": "`Parallel.ForEach(options, new ParallelOptions { MaxDegreeOfParallelism = 8 }, opt => results[i] = opt.ComputeGreeks())` ou PLINQ — distribue les calculs sur les 8 cœurs. Temps : ~10 000 × 10ms / 8 = ~12.5 secondes au lieu de 100 secondes.",
      "explanation": "CPU-bound pur → Parallel. `ComputeGreeks` utilise 100% du CPU pendant 10ms → `await` ne servirait à rien (pas d'I/O à attendre). Avec `Parallel.ForEach` sur 8 cœurs : 8 options calculées simultanément → gain théorique ×8. `results = new Greeks[10000]; Parallel.For(0, options.Count, i => results[i] = options[i].ComputeGreeks())` — utiliser un tableau indexé (thread-safe par index unique). Ou PLINQ : `var results = options.AsParallel().WithDegreeOfParallelism(8).Select(o => o.ComputeGreeks()).ToArray()`. `Task.WhenAll` avec 10 000 Task.Run serait trop lourd (overhead de création de tasks)."
    },
    {
      "question": "[Anti-pattern] Identifier tous les problèmes dans `public string GetTrades() { return GetTradesAsync().Result; }` dans un contrôleur ASP.NET Framework.",
      "options": [
        "Aucun problème — `.Result` est un moyen valide d'appeler du code async depuis du code synchrone.",
        "Deadlock : le thread HTTP appelle `.Result` et bloque. La continuation de `GetTradesAsync()` tente de reprendre sur ce même thread (SynchronizationContext ASP.NET Framework) → impasse. AggregateException au lieu de l'exception directe. Gaspillage de thread. Correction : `async Task<string> GetTrades()` + `await GetTradesAsync()`.",
        "Seul problème : la méthode devrait être `async void GetTrades()`.",
        "Problème de performance uniquement — pas de deadlock possible."
      ],
      "answer": "Deadlock : le thread HTTP appelle `.Result` et bloque. La continuation de `GetTradesAsync()` tente de reprendre sur ce même thread (SynchronizationContext ASP.NET Framework) → impasse. AggregateException au lieu de l'exception directe. Gaspillage de thread. Correction : `async Task<string> GetTrades()` + `await GetTradesAsync()`.",
      "explanation": "3 problèmes : (1) Deadlock dans ASP.NET Framework (pas Core) : SynchronizationContext capture le thread HTTP, la continuation en a besoin, `.Result` le bloque → impasse. La requête ne répond JAMAIS. (2) AggregateException : `.Result` enveloppe les exceptions dans AggregateException → besoin de `.InnerException` pour l'exception réelle. `await` donne l'exception directement. (3) Thread gaspillé : un thread du pool précieux est monopolisé pendant toute l'attente, sans servir d'autres requêtes. Note : en ASP.NET Core (pas Framework), le deadlock n'arrive pas (pas de SynchronizationContext), mais les problèmes 2 et 3 persistent."
    },
    {
      "question": "[Architecture] Comment implémenter un pipeline de traitement de messages avec backpressure en C# ?",
      "options": [
        "Une `ConcurrentQueue<T>` avec un `while(true)` qui poll toutes les 10ms.",
        "`Channel<T>.CreateBounded(capacity)` : producteur `await writer.WriteAsync(msg, ct)` — attend si plein (backpressure). Consommateur `await foreach(var msg in reader.ReadAllAsync(ct))` — attend si vide. Zéro polling, backpressure native.",
        "Une `BlockingCollection<T>` avec `Take()` synchrone dans un thread dédié.",
        "`Task.WhenAll` avec une liste de Task en attente d'éléments."
      ],
      "answer": "`Channel<T>.CreateBounded(capacity)` : producteur `await writer.WriteAsync(msg, ct)` — attend si plein (backpressure). Consommateur `await foreach(var msg in reader.ReadAllAsync(ct))` — attend si vide. Zéro polling, backpressure native.",
      "explanation": "Comparaison : ConcurrentQueue + while(true)/polling → consomme du CPU inutilement quand la queue est vide. BlockingCollection.Take() → bloque un thread dédié (synchrone, gaspillage). Channel<T> async : le consommateur `await foreach(var msg in reader.ReadAllAsync(ct))` est VRAIMENT async — le thread est libéré pendant l'attente, pas de polling, pas de thread bloqué. Backpressure : `Channel.CreateBounded(1000)` → si 1000 messages en queue, `await writer.WriteAsync()` attend qu'une place se libère — naturellement ralentit le producteur. Pour les pics de trafic en CIB (ouverture des marchés), c'est exactement ce qu'il faut."
    },
    {
      "question": "[Refactoring] Un service calcule VaR pour 100 portefeuilles (CPU-bound, 50ms chacun) puis envoie une notification HTTP pour chacun (I/O-bound, 200ms). Comment optimiser les deux phases séquentiellement ?",
      "options": [
        "Tout en séquentiel — le plus simple.",
        "Phase 1 CPU-bound : `var vars = options.AsParallel().WithDegreeOfParallelism(Environment.ProcessorCount).Select(p => ComputeVaR(p)).ToArray()` (Parallel LINQ). Phase 2 I/O-bound : `await Task.WhenAll(vars.Select((v, i) => SendNotificationAsync(portfolios[i], v)))`. Les 100 notifications partent simultanément.",
        "Tout en `Task.WhenAll` avec `Task.Run` pour les calculs.",
        "Utiliser `Parallel.ForEach` pour les deux phases avec des lambdas async."
      ],
      "answer": "Phase 1 CPU-bound : `var vars = options.AsParallel().WithDegreeOfParallelism(Environment.ProcessorCount).Select(p => ComputeVaR(p)).ToArray()` (Parallel LINQ). Phase 2 I/O-bound : `await Task.WhenAll(vars.Select((v, i) => SendNotificationAsync(portfolios[i], v)))`. Les 100 notifications partent simultanément.",
      "explanation": "Deux phases, deux outils différents : Phase calcul (CPU-bound, 50ms × 100 = 5s séquentiel) → PLINQ sur tous les cœurs → ~5s/n_cores. Phase notification (I/O-bound, 200ms × 100 = 20s séquentiel) → Task.WhenAll lance les 100 requêtes HTTP simultanément → ~200ms (la plus longue). Total optimisé : ~625ms + 200ms vs 5000ms + 20000ms. `Parallel.ForEach` avec lambda async (option D) ne fonctionne pas correctement (async void piège). `Task.Run` pour le calcul (option C) aurait trop d'overhead pour 100 tasks."
    },
    {
      "question": "[Thème ↔ Concept] En quoi l'architecture horizontale Docker (plusieurs containers) remplace-t-elle le besoin de parallélisme sur un seul serveur en développement web ?",
      "options": [
        "Elle ne remplace pas le parallélisme — Docker et le parallélisme sont complémentaires obligatoires.",
        "Chaque container Docker peut avoir 1 seul cœur virtuel et utilise async pour gérer plusieurs requêtes. Ajouter des containers = ajouter des cœurs 'logiques'. Kubernetes scale automatiquement selon la charge. Le parallélisme intra-machine devient secondaire.",
        "Docker élimine le besoin d'async/await car les containers isolent les requêtes.",
        "Docker containers utilisent automatiquement Parallel.For pour les requêtes HTTP."
      ],
      "answer": "Chaque container Docker peut avoir 1 seul cœur virtuel et utilise async pour gérer plusieurs requêtes. Ajouter des containers = ajouter des cœurs 'logiques'. Kubernetes scale automatiquement selon la charge. Le parallélisme intra-machine devient secondaire.",
      "explanation": "Philosophie cloud moderne : au lieu d'un serveur avec 32 cœurs utilisant Parallel.For pour tout, déployer 32 containers avec 1 cœur chacun. Chaque container est simple, async, scale horizontalement. Kubernetes HPA : si CPU > 70%, ajouter des containers → élasticité totale. Si trafic chute, retirer des containers. Le parallélisme CPU (Parallel.For) reste utile pour les calculs intensifs internes (Monte Carlo, calcul de surface de vol), mais le parallélisme web est géré par l'orchestration. C'est exactement pourquoi Node.js (mono-thread) était populaire en cloud — architecture naturellement compatible avec les containers unitaires."
    },
    {
      "question": "[Multi-concepts] Quelle est la différence entre `lock`, `ConcurrentDictionary` et `Interlocked` pour la thread-safety ?",
      "options": [
        "Ce sont trois syntaxes différentes pour la même opération — utiliser la plus lisible.",
        "`lock` : exclusion mutuelle bloquante (un seul thread à la fois). `ConcurrentDictionary` : structure lock-free pour les dictionnaires (opérations atomiques). `Interlocked` : opérations atomiques sur des valeurs simples (inc, dec, exchange). Choisir selon la granularité.",
        "`lock` est déprécié depuis .NET 5 — utiliser uniquement `ConcurrentDictionary`.",
        "`Interlocked` est uniquement pour les entiers, `ConcurrentDictionary` uniquement pour les strings."
      ],
      "answer": "`lock` : exclusion mutuelle bloquante (un seul thread à la fois). `ConcurrentDictionary` : structure lock-free pour les dictionnaires (opérations atomiques). `Interlocked` : opérations atomiques sur des valeurs simples (inc, dec, exchange). Choisir selon la granularité.",
      "explanation": "Trois niveaux de granularité : `lock(obj) { bloc de code }` — gros grain, flexible, bloquant (les autres threads attendent). Utiliser pour les blocs de logique complexe avec plusieurs opérations interdépendantes. `ConcurrentDictionary.GetOrAdd(key, factory)` — thread-safe atomiquement pour les opérations dictionnaire. Pas besoin de `lock` manuel. `Interlocked.Increment(ref counter)` — ultra-fin, atomique, non-bloquant. Pour un simple compteur partagé. Règle : préférer le plus fin possible. `Interlocked` > `ConcurrentDictionary` > `lock`. Éviter `lock` sur hot paths (contention → performance dégradée)."
    },
    {
      "question": "[Confusion + Architecture] Un développeur wrappe du code async dans `Task.Run` dans un controller ASP.NET Core : `return await Task.Run(() => await GetDataAsync())`. Quel est le problème ?",
      "options": [
        "Ce code est correct et optimal.",
        "Double overhead inutile : `Task.Run` utilise un thread du pool pour exécuter du code qui va immédiatement libérer ce thread avec `await`. On prend un thread pour... le libérer. En ASP.NET Core, il n'y a pas de SynchronizationContext — `await GetDataAsync()` directement est parfait.",
        "Le problème est que `Task.Run` ne peut pas contenir de code async.",
        "Ce code provoque un deadlock systématique."
      ],
      "answer": "Double overhead inutile : `Task.Run` utilise un thread du pool pour exécuter du code qui va immédiatement libérer ce thread avec `await`. On prend un thread pour... le libérer. En ASP.NET Core, il n'y a pas de SynchronizationContext — `await GetDataAsync()` directement est parfait.",
      "explanation": "`Task.Run(() => await GetDataAsync())` dans un controller ASP.NET Core : (1) Thread du pool A exécute le controller. (2) Task.Run prend Thread B du pool pour exécuter la lambda. (3) Thread B execute `await GetDataAsync()` → se libère. (4) Thread A attend la Task.Run → bloqué inutilement. (5) Un thread du pool est gaspillé juste pour lancer un await. Solution : `return await GetDataAsync()` directement. `Task.Run` dans un controller est utile UNIQUEMENT si GetDataAsync contient un calcul CPU synchrone long qui bloquerait le thread HTTP (cas rare, mieux vaut que la méthode soit nativement async)."
    },
    {
      "question": "[Thème ↔ Pattern] Comment utiliser `SemaphoreSlim` pour limiter la concurrence à 10 opérations async simultanées parmi 1000 ?",
      "options": [
        "Utiliser `Parallel.ForEach` avec `MaxDegreeOfParallelism = 10`.",
        "`var sem = new SemaphoreSlim(10); await Task.WhenAll(items.Select(async item => { await sem.WaitAsync(ct); try { await ProcessAsync(item); } finally { sem.Release(); } }));` — max 10 tâches concurrentes à tout moment.",
        "Diviser la liste en chunks de 10 et `await Task.WhenAll` sur chaque chunk séquentiellement.",
        "Utiliser `Channel<T>.CreateBounded(10)` avec 10 consommateurs."
      ],
      "answer": "`var sem = new SemaphoreSlim(10); await Task.WhenAll(items.Select(async item => { await sem.WaitAsync(ct); try { await ProcessAsync(item); } finally { sem.Release(); } }));` — max 10 tâches concurrentes à tout moment.",
      "explanation": "Throttling async avec SemaphoreSlim : `SemaphoreSlim(10)` = au plus 10 `WaitAsync()` peuvent continuer simultanément. Les 990 autres await sur `WaitAsync()` libèrent leurs threads (aucun bloqué) et reprennent quand une Release() arrive. Comparaison : Chunking (option C) = attendre que les 10 soient finis pour lancer les 10 suivants — certains pourraient finir rapidement, thread inutilisé. SemaphoreSlim = dès qu'une tâche finit, la suivante démarre → saturation optimale. `Parallel.ForEach` (option A) = synchrone, pas de vrai async."
    },
    {
      "question": "[Code → Debug] Une application WPF avec un `Button_Click` qui appelle `.Result` sur une Task async ne répond plus après le clic. Diagnostiquez et corrigez.",
      "options": [
        "Problème de performance — utiliser `Task.Run` pour déplacer le calcul.",
        "Deadlock classique UI : le thread UI appelle `.Result` → bloqué. La continuation de la Task tente de reprendre sur le thread UI (SynchronizationContext WPF) → impasse. Correction : `private async void Button_Click(object sender, EventArgs e) { var result = await GetDataAsync(); label.Text = result; }`",
        "Le problème est que `async void` n'est pas supporté sur les event handlers WPF.",
        "Augmenter le timeout de la Task avec `CancellationTokenSource(TimeSpan.FromSeconds(30))`."
      ],
      "answer": "Deadlock classique UI : le thread UI appelle `.Result` → bloqué. La continuation de la Task tente de reprendre sur le thread UI (SynchronizationContext WPF) → impasse. Correction : `private async void Button_Click(object sender, EventArgs e) { var result = await GetDataAsync(); label.Text = result; }`",
      "explanation": "Deadlock WPF en 4 étapes : (1) Thread UI exécute Button_Click. (2) `task.Result` bloque le thread UI en attendant. (3) GetDataAsync() finit, sa continuation tente de s'exécuter sur le thread UI (pour mettre à jour les contrôles de façon thread-safe). (4) Thread UI est bloqué sur `.Result` → ne peut pas exécuter la continuation → impasse. Solution : `async void Button_Click` (seul usage légitime d'async void !). `await GetDataAsync()` libère le thread UI → peut exécuter d'autres messages (fenêtre reste réactive). La continuation reprend sur le thread UI après l'await → mise à jour de `label.Text` thread-safe."
    },
    {
      "question": "[Situation → Outil] 500 000 trades en mémoire, calcul de P&L (CPU-bound, 1ms chacun) sur 16 cœurs. PLINQ vs Parallel.ForEach vs Task.WhenAll — quel est le plus adapté ?",
      "options": [
        "Task.WhenAll — le plus simple à écrire.",
        "PLINQ (`trades.AsParallel().WithDegreeOfParallelism(16).Select(t => ComputePnL(t)).ToArray()`) ou Parallel.ForEach avec tableau indexé. Temps : 500 000 × 1ms / 16 = ~31 secondes au lieu de 500 secondes. Task.WhenAll inadapté (CPU-bound, pas I/O).",
        "Une boucle foreach classique — évite la complexité du parallélisme.",
        "Parallel.ForEach avec `async trade => await Task.Run(() => ComputePnL(trade))`."
      ],
      "answer": "PLINQ (`trades.AsParallel().WithDegreeOfParallelism(16).Select(t => ComputePnL(t)).ToArray()`) ou Parallel.ForEach avec tableau indexé. Temps : 500 000 × 1ms / 16 = ~31 secondes au lieu de 500 secondes. Task.WhenAll inadapté (CPU-bound, pas I/O).",
      "explanation": "500k × 1ms = 500s séquentiel → inacceptable. Calcul P&L = pur CPU → Parallel ou PLINQ. PLINQ : syntaxe élégante, partitionnement automatique. `WithDegreeOfParallelism(16)` limite aux 16 cœurs. `.ToArray()` force l'exécution et réassemble dans l'ordre. Alternative : `decimal[] results = new decimal[500000]; Parallel.For(0, trades.Count, i => results[i] = ComputePnL(trades[i]))` — tableau pré-alloué, accès indexé thread-safe. Task.WhenAll avec Task.Run overhead = 500k Tasks créées → GC pressure massive. Option D = Parallel.ForEach avec async void dans lambda → anti-pattern (voir question précédente)."
    }
  ],
  expert: [
    {
      "question": "[Architecture complète] Concevez un pipeline de pricing haute performance : 10 000 options, calcul Black-Scholes (CPU, 5ms), puis sauvegarde BD (I/O, 20ms), puis notification SignalR (I/O, 5ms).",
      "options": [
        "Une boucle foreach avec await sur chaque étape.",
        "Phase 1 (CPU) : `var greeks = options.AsParallel().WithDegreeOfParallelism(cores).Select(o => ComputeBS(o)).ToArray()` → 5ms × 10000 / cores. Phase 2 (I/O BD) : `await Task.WhenAll(greeks.Chunk(100).Select(batch => _db.BulkSaveAsync(batch, ct)))` → batches de 100 en parallèle. Phase 3 (I/O SignalR) : `await Task.WhenAll(greeks.Select(g => _hub.SendAsync(\"greeks\", g, ct)))` → toutes les notifications simultanées.",
        "Tout en Parallel.ForEach avec lambdas async.",
        "Un seul `await Task.WhenAll` sur les 10 000 opérations complètes."
      ],
      "answer": "Phase 1 (CPU) : `var greeks = options.AsParallel().WithDegreeOfParallelism(cores).Select(o => ComputeBS(o)).ToArray()` → 5ms × 10000 / cores. Phase 2 (I/O BD) : `await Task.WhenAll(greeks.Chunk(100).Select(batch => _db.BulkSaveAsync(batch, ct)))` → batches de 100 en parallèle. Phase 3 (I/O SignalR) : `await Task.WhenAll(greeks.Select(g => _hub.SendAsync(\"greeks\", g, ct)))` → toutes les notifications simultanées.",
      "explanation": "Architecture 3 phases distinctes : PLINQ pour le CPU (utilise tous les cœurs, simple, composable). Bulk + WhenAll pour la BD (10k saves individuels = 10k connexions BD → trop. Batches de 100 = 100 batch saves en parallèle → 100 connexions, efficace). WhenAll pour SignalR (10k notifications I/O légères → toutes simultanées, chacune 5ms → total ~5ms). Alternative Phase 2 : `var sem = new SemaphoreSlim(50); await Task.WhenAll(greeks.Select(async g => { await sem.WaitAsync(); try { await _db.SaveAsync(g); } finally { sem.Release(); } }))` — throttling à 50 connexions max."
    },
    {
      "question": "[Nommage inversé] Un pattern garantit que les opérations async I/O-bound de plusieurs Tasks 'partagent' effectivement un seul thread sur un serveur avec 1 cœur, permettant à 100 requêtes HTTP d'être en cours simultanément. Comment s'appelle ce mécanisme ?",
      "options": [
        "Thread pooling — les threads sont réutilisés du pool.",
        "I/O Completion Ports (IOCP) + async/await State Machine — le kernel OS notifie quand l'I/O est prête (IOCP), la state machine générée par le compilateur reprend l'exécution au bon endroit sans thread dédié pendant l'attente.",
        "Context switching — l'OS bascule très vite entre les threads.",
        "Cooperative multitasking — chaque thread cède volontairement le CPU."
      ],
      "answer": "I/O Completion Ports (IOCP) + async/await State Machine — le kernel OS notifie quand l'I/O est prête (IOCP), la state machine générée par le compilateur reprend l'exécution au bon endroit sans thread dédié pendant l'attente.",
      "explanation": "Mécanisme sous async/await sur Windows : (1) `await db.QueryAsync()` → .NET envoie la requête BD via IOCP (mécanisme kernel Windows d'I/O non-bloquant). (2) Thread libéré dans le pool — AUCUN thread ne 'surveille' la BD. (3) Quand la BD répond, le kernel notifie l'IOCP. (4) Un thread du pool récupère la notification, retrouve la continuation grâce à la state machine générée par le compilateur, et reprend l'exécution exactement après le `await`. Sur Linux : epoll/io_uring jouent le même rôle. C'est pour ça que 1 thread peut gérer 100 I/O simultanées : aucun thread n'attend activement, c'est le kernel qui notifie."
    },
    {
      "question": "[Multi-concepts + Architecture] Comparez Node.js et ASP.NET Core en termes de modèle de threading, de scalabilité et de cas d'usage optimal, en mentionnant l'impact de Docker.",
      "options": [
        "Node.js est toujours supérieur pour le web, ASP.NET Core pour les APIs.",
        "Node.js : event loop mono-thread, async forcé, excellente scalabilité I/O-bound, limité pour CPU-bound (Workers). ASP.NET Core : multi-thread pool, async optionnel mais crucial, aussi scalable avec async/await, puissant pour CPU-bound (Parallel). Docker efface la différence : chaque container = 1 cœur → les deux architectures se comportent de façon similaire.",
        "ASP.NET Core est toujours supérieur car multi-thread.",
        "Les deux utilisent le même modèle interne — différence uniquement syntaxique."
      ],
      "answer": "Node.js : event loop mono-thread, async forcé, excellente scalabilité I/O-bound, limité pour CPU-bound (Workers). ASP.NET Core : multi-thread pool, async optionnel mais crucial, aussi scalable avec async/await, puissant pour CPU-bound (Parallel). Docker efface la différence : chaque container = 1 cœur → les deux architectures se comportent de façon similaire.",
      "explanation": "Histoire : Node.js a dominé le web temps car les devs .NET codaient synchrone → ThreadPool épuisé. Avec ASP.NET Core + async/await : même efficacité que Node.js pour l'I/O. Avantage .NET : calculs intensifs (Parallel.For, PLINQ) là où Node.js utilise des Worker Threads plus lourds. Docker : dans Kubernetes avec 1 cœur par container × 1000 containers → parallélisme horizontal pur. Chaque container Node.js OU ASP.NET Core gère ses requêtes avec async → comportement quasi-identique. Le choix devient surtout ecosystem/team/tooling, pas scalabilité."
    },
    {
      "question": "[Architecture + Confusion] Expliquez pourquoi `async/await` améliore la scalabilité mais PAS la latence d'une requête individuelle.",
      "options": [
        "async/await améliore les deux — une requête individuelle sera plus rapide.",
        "Async libère le thread pendant l'attente I/O — la LATENCE d'une requête reste identique (le temps SQL ne change pas). Ce qui change : pendant ces 100ms d'attente SQL, le thread sert d'autres requêtes → plus de requêtes simultanées avec le même nombre de threads → THROUGHPUT et SCALABILITÉ améliorés.",
        "async améliore la latence mais pas le throughput.",
        "async améliore uniquement la mémoire utilisée, pas les performances."
      ],
      "answer": "Async libère le thread pendant l'attente I/O — la LATENCE d'une requête reste identique (le temps SQL ne change pas). Ce qui change : pendant ces 100ms d'attente SQL, le thread sert d'autres requêtes → plus de requêtes simultanées avec le même nombre de threads → THROUGHPUT et SCALABILITÉ améliorés.",
      "explanation": "Distinction latence vs throughput : `await db.QueryAsync()` → la requête SQL prend toujours 100ms. Async ne rend pas le SQL plus rapide. MAIS : pendant ces 100ms, le thread est libre pour d'autres requêtes. Sans async avec 10 threads : 10 requêtes en cours max. Avec async avec 10 threads : potentiellement 100+ requêtes en cours (chaque thread traite le CPU processing, l'I/O attend en arrière-plan). Throughput ×10 avec le même hardware. Pour réduire la LATENCE d'une requête individuelle : optimiser la requête SQL, ajouter un index, mettre en cache le résultat — pas async."
    },
    {
      "question": "[Nommage inversé] Quel mécanisme C# permet à une méthode de 'suspendre' son exécution, retourner le contrôle à l'appelant avec une valeur intermédiaire, puis reprendre là où elle s'était arrêtée lors du prochain appel ?",
      "options": [
        "async/await — suspension et reprise des méthodes async.",
        "`yield return` dans un itérateur (`IEnumerable`) / `yield return` async dans `IAsyncEnumerable` — la méthode produit des éléments un par un sans créer de collection intermédiaire. Le compilateur génère une state machine similaire à async.",
        "Coroutines — le mécanisme Unity pour les opérations longues.",
        "Callbacks — la méthode appelle une fonction quand elle a un résultat."
      ],
      "answer": "`yield return` dans un itérateur (`IEnumerable`) / `yield return` async dans `IAsyncEnumerable` — la méthode produit des éléments un par un sans créer de collection intermédiaire. Le compilateur génère une state machine similaire à async.",
      "explanation": "`yield return` : `IEnumerable<Trade> GetTrades() { foreach(var row in db.Query(sql)) { yield return MapTrade(row); } }` — la méthode s'arrête après chaque `yield return` et reprend au `foreach` suivant. Pas de `List<Trade>` créée en mémoire. Version async : `async IAsyncEnumerable<Trade> GetTradesAsync(CancellationToken ct) { await foreach(var row in db.QueryAsync(sql, ct)) { yield return MapTrade(row); } }`. Le compilateur transforme les deux en state machines. Lien avec async : `await` et `yield return` utilisent le même mécanisme de state machine généré par le compilateur — c'est pour ça que `IAsyncEnumerable` combine les deux avec `await yield return`."
    },
    {
      "question": "[Ordre de dépendance] Dans quel ordre faut-il maîtriser les concepts pour comprendre Entity Framework avec async ?",
      "options": [
        "Entity Framework → async → LINQ → threads.",
        "Threads/ThreadPool (comprendre la ressource) → I/O blocking problem (pourquoi c'est grave) → async/await (la solution) → Task/WhenAll (parallélisme async) → CancellationToken → LINQ → EF Core avec async (ToListAsync, SaveChangesAsync, IAsyncEnumerable).",
        "LINQ → EF Core → async → threads.",
        "Docker → microservices → async → EF Core."
      ],
      "answer": "Threads/ThreadPool (comprendre la ressource) → I/O blocking problem (pourquoi c'est grave) → async/await (la solution) → Task/WhenAll (parallélisme async) → CancellationToken → LINQ → EF Core avec async (ToListAsync, SaveChangesAsync, IAsyncEnumerable).",
      "explanation": "Ordre de dépendance pédagogique (exactement celui du formateur dans la vidéo) : sans comprendre qu'un thread est une ressource précieuse (~1MB, pool limité), on ne comprend pas POURQUOI async est important. Sans le problème I/O blocking, async semble inutile. Avec le problème compris, async/await devient la solution évidente. WhenAll et CancellationToken enrichissent l'usage. LINQ est nécessaire pour lire les requêtes EF Core. EF Core est la destination finale qui utilise TOUT : `_ctx.Trades.Where(linq).OrderBy(linq).ToListAsync(cancellationToken)`. Sauter des étapes = confusion (c'est exactement le problème décrit dans la transcription)."
    },
    {
      "question": "[Architecture + Performance] Comment implémenter un calcul de VaR sur 1M de simulations Monte Carlo avec un pipeline async/parallel complet en C# ?",
      "options": [
        "1M de `await Task.Run(() => simulate())` avec Task.WhenAll.",
        "Phase 1 Génération (CPU) : `Parallel.For(0, 1_000_000, new ParallelOptions { MaxDegreeOfParallelism = cores }, i => { payoffs[i] = Simulate(option, rng); })` avec `ArrayPool<double>`. Phase 2 Agrégation (CPU léger) : `var var95 = payoffs.AsParallel().OrderBy(x => x).ElementAt((int)(0.05 * N))`. Phase 3 Sauvegarde (I/O) : `await _db.SaveVaRAsync(portfolioId, var95, ct)`.",
        "Un seul thread avec `while(i < 1M)` et await sur chaque simulation.",
        "PLINQ uniquement sur toutes les phases."
      ],
      "answer": "Phase 1 Génération (CPU) : `Parallel.For(0, 1_000_000, new ParallelOptions { MaxDegreeOfParallelism = cores }, i => { payoffs[i] = Simulate(option, rng); })` avec `ArrayPool<double>`. Phase 2 Agrégation (CPU léger) : `var var95 = payoffs.AsParallel().OrderBy(x => x).ElementAt((int)(0.05 * N))`. Phase 3 Sauvegarde (I/O) : `await _db.SaveVaRAsync(portfolioId, var95, ct)`.",
      "explanation": "Trois phases, trois outils : Parallel.For (CPU-bound pur, distribue 1M simulations sur tous les cœurs). `ArrayPool<double>.Shared.Rent(1_000_000)` → évite 8MB d'allocation heap + GC. `var rng = new Random(seed + i)` (ou ThreadLocal<Random>) → chaque thread a son RNG indépendant (thread-safety). PLINQ pour le tri parallèle (OrderBy sur 1M éléments en parallèle). `await _db.SaveVaRAsync(ct)` → I/O-bound, libère le thread pendant la sauvegarde. 1M Task.Run (option A) = overhead massif (création de 1M Tasks, GC pressure, scheduler overhead) → anti-pattern."
    }
  ]
};

const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={`${keyPrefix}-${idx}`} style={{ display: "inline", fontWeight: "bold" }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={`${keyPrefix}-${idx}`} style={{ display: "inline", backgroundColor: "#eef2f7", padding: "1px 5px", borderRadius: "3px", fontFamily: "monospace", color: "#e01e5a", fontWeight: "bold", fontSize: "13px" }}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={`${keyPrefix}-${idx}`} style={{ display: "inline" }}>{part.slice(1, -1)}</em>;
    return part;
  });
};

const renderFormattedText = (text) => {
  if (!text) return null;
  let clean = text.replace(/\r?\n- /g, " ◆ ").replace(/\r?\n• /g, " ◆ ").replace(/\r?\n/g, " ").replace(/\.-\s*\*\*/g, " ◆ **").replace(/-\s*\*\*/g, " ◆ **");
  if (clean.startsWith(" ◆ ")) clean = clean.substring(3);
  if (clean.startsWith("- ")) clean = clean.substring(2);
  const segs = clean.split(" ◆ ");
  return (
    <span style={{ display: "block", lineHeight: "1.7" }}>
      {segs.map((seg, i) => (
        <span key={i} style={{ display: "block", marginBottom: i < segs.length - 1 ? "6px" : "0" }}>
          {i > 0 && <span style={{ color: "#1a73e8", fontWeight: "bold", marginRight: "5px" }}>◆</span>}
          {renderInlineTokens(seg, `s${i}`)}
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
      {options.map((opt, i) => (
        <button key={i} onClick={() => onAnswerClick(opt)} className="option-button">
          {String.fromCharCode(65 + i)}. {opt}
        </button>
      ))}
    </div>
  </div>
);

const Flashcard = ({ slide }) => (
  <div className="question-card" style={{ fontSize: "14px", margin: "0" }}>
    <p style={{ fontWeight: "bold", fontSize: "15px", color: "#1a73e8", margin: "0 0 10px 0" }}>{slide.question}</p>
    <div style={{ padding: "12px 15px", background: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #1a73e8", textAlign: "left" }}>
      {renderFormattedText(slide.answer)}
    </div>
  </div>
);

const Results = ({ scores }) => {
  const total = scores.moyen + scores.avance + scores.expert;
  const max = questions.moyen.length + questions.avance.length + questions.expert.length;
  return (
    <div className="results">
      <h3>🎯 Score : {total} / {max}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length} | ✅ Expert : {scores.expert}/{questions.expert.length}</p>
      {total >= Math.floor(max * 0.6)
        ? <h3 className="success">🚀 Async · Parallel · Threading C# maîtrisés !</h3>
        : <p className="fail">📚 Révisez les slides — particulièrement les distinctions async vs parallel.</p>}
    </div>
  );
};

const AsyncProgrammingQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNext = useCallback(() => {
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
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(p => p - 1), 1000); return () => clearTimeout(t); }
      else handleNext();
    }
  }, [timeLeft, level, showResult, message, handleNext]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const iv = setInterval(() => {
        setCurrentSlide(p => {
          if (p + 1 < basicSlides.length) return p + 1;
          setLevel("moyen"); setCurrentQuestion(0); setTimeLeft(25); return 0;
        });
      }, 20000);
      return () => clearInterval(iv);
    }
  }, [level, showResult]);

  const handleAnswer = (opt) => {
    if (message) return;
    const cur = questions[level][currentQuestion];
    if (opt === cur.answer) { setScores(p => ({ ...p, [level]: p[level] + 1 })); setMessage("✅ Correct !"); }
    else { setMessage(`❌ ${cur.answer}\n\nℹ️ ${cur.explanation}`); }
    setTimeout(handleNext, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            Async · Parallel · Threading C# 🔹{" "}
            {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {level === "basic"
            ? <Flashcard slide={basicSlides[currentSlide]} />
            : <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswer} timeLeft={timeLeft} />}
          {message && <p className="message" style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default AsyncProgrammingQCM;
