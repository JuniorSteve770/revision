// src/projects/Project3/pages/Page6_TechInterview.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ── C++ FONDAMENTAUX ──
  {
    "question": "Pointeur vs Référence en C++ | AMM/Trading",
    "answer": "**Pointeur** : variable qui stocke une adresse mémoire. Peut être `nullptr`, réassignable, arithmétique possible. ◆ **Référence** : alias d'une variable existante. Ne peut pas être `nullptr`, ne peut pas être réassignée, pas d'arithmétique. ◆ **Syntaxe** : `int* ptr = &x;` vs `int& ref = x;`. ◆ **Quand utiliser** : référence quand la valeur ne peut pas être nulle (performance, clarté). Pointeur quand l'objet peut ne pas exister (`nullptr` check). ◆ **const T*** : pointeur vers un T constant (la valeur pointée ne change pas). **T* const** : pointeur constant (l'adresse ne change pas). **const T&** : référence constante (lecture seule, passe des objets lourds sans copie). ◆ **AMM/Trading** : `const OrderBook& book` pour passer l'order book sans copie coûteuse."
  },
  {
    "question": "Const Correctness en C++ | AMM/Trading",
    "answer": "**Const method** : `double getPrice() const;` — garantit que la méthode ne modifie pas l'état de l'objet. Le compilateur l'applique. ◆ **Pourquoi essentiel en production** : (1) Documente l'intention, (2) Permet l'appel sur des objets `const`, (3) Active des optimisations compilateur. ◆ **Const propagation** : `const Trade& t` → seules les méthodes `const` de `Trade` peuvent être appelées. ◆ **mutable** : exception — un membre `mutable` peut être modifié même dans une méthode `const` (ex : cache interne, mutex). ◆ **AMM/Trading** : `PriceFeed::getLastPrice() const` — le market data feed ne doit jamais être modifié lors d'une lecture. `OrderBook::getBestBid() const`. ◆ **Règle** : marquer `const` tout ce qui peut l'être."
  },
  {
    "question": "Copy Constructor & Deep Copy en C++ | AMM/Trading",
    "answer": "**Copy constructor** : `MyClass(const MyClass& other)` — crée un nouvel objet identique. Appelé lors de `MyClass b = a;`, passage par valeur, retour par valeur. ◆ **Shallow copy (défaut)** : copie bit à bit — les pointeurs pointent vers la même mémoire. **Dangereux** : si l'original est détruit, le pointeur devient dangling. ◆ **Deep copy** : alloue une nouvelle mémoire et copie les données pointées. ◆ **Rule of Three** : si vous définissez destructor, copy constructor ou copy assignment → définir les trois. ◆ **Rule of Five (C++11)** : + move constructor + move assignment. ◆ **AMM/Trading** : un `OrderBook` avec des vecteurs de `Order*` — shallow copy = deux OrderBooks partagent les mêmes ordres. Deep copy = chaque OrderBook a ses propres ordres. ◆ **Préférer** : move semantics pour les objets lourds."
  },
  {
    "question": "Stack vs Heap — Allocation Mémoire | AMM/Trading",
    "answer": "**Stack** : mémoire automatique, LIFO, taille fixe (~1-8MB), allocation/désallocation O(1) (incrément du stack pointer). Variables locales, paramètres, objets automatiques. ◆ **Heap** : mémoire dynamique, taille illimitée (RAM), allocation/désallocation lente (syscall, fragmentation). `new`/`delete`. ◆ **Pourquoi éviter `new` en trading** : (1) Allocation heap = ~100-1000ns vs ~1ns pour stack. (2) Fragmentation mémoire au fil du temps. (3) Risk de memory leak. ◆ **Alternatives** : Object pooling (pre-allouer), stack allocation, `std::array` vs `std::vector`, placement new. ◆ **AMM/Trading** : Pour les systèmes low-latency, pré-allouer tous les objets au démarrage, ne plus allouer pendant la session de trading. `Order orders[MAX_ORDERS]` sur stack ou pool pré-alloué."
  },
  {
    "question": "Smart Pointers : unique_ptr, shared_ptr, weak_ptr | AMM/Trading",
    "answer": "**unique_ptr** : propriété unique, non copiable, déplaceable. `std::unique_ptr<Order> order = std::make_unique<Order>(...)`. Destruction automatique à la sortie du scope. ◆ **shared_ptr** : propriété partagée via reference counting. Détruit quand le dernier shared_ptr est détruit. ◆ **weak_ptr** : référence non-propriétaire vers un shared_ptr. Permet de briser les cycles. ◆ **Danger du shared_ptr en production** : (1) Overhead du ref counting (atomic increment/decrement), (2) **Cycles de référence** → memory leak si A→B et B→A avec shared_ptr. Solution : weak_ptr pour briser le cycle. ◆ **AMM/Trading** : `unique_ptr` pour les objets dont la propriété est claire. `shared_ptr` avec parcimonie pour les objets partagés (MarketDataFeed). `weak_ptr` pour les observers qui ne doivent pas empêcher la destruction."
  },
  {
    "question": "Cache Locality & Performance | AMM/Trading",
    "answer": "**Cache CPU** : L1 (~1ns, 32KB), L2 (~5ns, 256KB), L3 (~20ns, 8MB), RAM (~100ns). ◆ **Locality temporelle** : accéder aux mêmes données plusieurs fois → garder en cache. ◆ **Locality spatiale** : accéder à des données contiguës en mémoire → prefetch cache line (64 bytes). ◆ **std::vector vs std::list** : `vector` = données contiguës en mémoire = cache-friendly, itération O(n) rapide. `list` = nœuds éparpillés = cache miss à chaque nœud = 10-100x plus lent en pratique. ◆ **AoS vs SoA** : Array of Structs vs Struct of Arrays. Pour le traitement vectorisé SIMD, SoA est préférable. ◆ **AMM/Trading** : Order book implémenté avec `std::vector<PriceLevel>` trié → accès séquentiel cache-friendly. Éviter `std::map` (arbre rouge-noir, nœuds éparpillés) pour les chemins chauds."
  },
  {
    "question": "Low Latency C++ : Techniques Essentielles | AMM/Trading",
    "answer": "**Allocation-free runtime** : pré-allouer tous les objets au démarrage (object pool, memory arena). Zéro `new`/`delete` pendant la session. ◆ **Branch prediction** : éviter les branches imprévisibles dans les chemins chauds. `[[likely]]`/`[[unlikely]]` en C++20. ◆ **Inline functions** : éviter l'overhead des appels de fonction. `inline` ou templates. ◆ **Lock-free data structures** : `std::atomic`, CAS (compare-and-swap) pour les structures partagées sans mutex. ◆ **NUMA awareness** : sur serveurs multi-socket, affecter les threads aux cœurs proches de leur mémoire. ◆ **CPU Affinity** : `pthread_setaffinity_np` pour fixer un thread sur un cœur. ◆ **Busy-waiting** : au lieu de `sleep`, spinner en boucle pour réduire la latence de réveil. ◆ **AMM/Trading** : tick-to-trade < 1µs pour les market makers nécessite toutes ces techniques combinées."
  },
  {
    "question": "Multithreading : Mutex, Race Condition, Lock | AMM/Trading",
    "answer": "**Thread** : unité d'exécution légère partageant la mémoire du processus. **Process** : espace mémoire isolé. ◆ **Race condition** : deux threads accèdent à la même variable simultanément sans synchronisation, résultat indéterministe. ◆ **Data race** : comportement indéfini (UB) en C++ — accès concurrent non protégé à une variable. ◆ **std::mutex** : verrou exclusif. `lock()` / `unlock()`. ◆ **std::lock_guard** : RAII wrapper pour mutex — unlock automatique à la sortie du scope, même si exception. ◆ **std::unique_lock** : lock flexible (peut être unlocked temporairement, utilisé avec condition_variable). ◆ **AMM/Trading** : `std::mutex mtx; std::lock_guard<std::mutex> lg(mtx);` pour protéger la mise à jour d'un order book partagé entre threads. ◆ **Préférer** : lock-free avec `std::atomic` si possible, éviter les contention points."
  },
  {
    "question": "std::atomic & Lock-Free Programming | AMM/Trading",
    "answer": "**std::atomic<T>** : opérations atomiques garanties sans race condition. `std::atomic<int> counter{0}; counter.fetch_add(1);`. ◆ **Différence atomic vs mutex** : atomic opère sur une seule variable, opération indivisible. Mutex protège un bloc de code (section critique). Atomic ~5-10ns, mutex lock ~25-100ns. ◆ **Memory ordering** : `memory_order_relaxed` (sans synchronisation), `memory_order_acquire`/`release` (synchronisation acquire-release), `memory_order_seq_cst` (défaut, le plus fort). ◆ **CAS** : Compare-And-Swap — `compare_exchange_strong(expected, desired)` — opération fondamentale du lock-free. ◆ **AMM/Trading** : compteur de trades par seconde (`std::atomic<int> tradeCount`), flags de contrôle (`std::atomic<bool> running`), séquence d'ordre book (`std::atomic<uint64_t> seqNum`). ◆ **Attention** : lock-free ≠ wait-free. ABA problem."
  },
  // ── STL ──
  {
    "question": "STL Containers : Complexités & Cas d'Usage | AMM/Trading",
    "answer": "**std::vector** : tableau dynamique continu. Accès O(1), push_back amorti O(1), insertion milieu O(n). Cache-friendly. ◆ **std::deque** : double-ended queue. Push front/back O(1). Moins cache-friendly que vector. ◆ **std::list** : liste doublement chaînée. Insertion/suppression O(1) avec iterator. Accès O(n). Cache-hostile. ◆ **std::map** : arbre rouge-noir trié. Toutes opérations O(log n). Ordered iteration. ◆ **std::unordered_map** : hash table. Opérations O(1) moyen, O(n) pire cas (collisions). ◆ **Quand unordered_map vs map** : unordered_map pour la performance pure (lookup O(1)). map quand l'ordre est nécessaire ou que la clé ne peut pas être hashée. ◆ **AMM/Trading** : `unordered_map<string, double>` pour lookup de prix par ISIN. `map<double, vector<Order>>` pour order book trié par prix. `vector<Trade>` pour historique de trades."
  },
  // ── LINUX ──
  {
    "question": "Commandes Linux Essentielles | Trading Systems",
    "answer": "**ls / ls -l** : lister les fichiers. `-l` affiche permissions, owner, taille, date. ◆ **grep** : rechercher un pattern. `grep 'ERROR' app.log`. `-v` inverse (exclure). `-r` récursif. `-i` insensible à la casse. ◆ **head / tail** : head affiche les N premières lignes, tail les N dernières. `tail -f app.log` suit en temps réel. ◆ **find** : `find /var/log -name '*.log' -mtime -1` (logs modifiés dans les dernières 24h). ◆ **ps aux** : tous les processus avec CPU/mémoire. `pgrep trading_engine`. ◆ **top / htop** : monitoring temps réel CPU/mémoire. ◆ **netstat / ss** : connexions réseau. `ss -tlnp` ports en écoute. ◆ **Trading** : `tail -f trade.log | grep 'REJECT'` pour surveiller les rejets en temps réel. `ps aux | grep market_maker` pour vérifier que le processus tourne."
  },
  {
    "question": "Permissions Linux : chmod, chown | Sécurité",
    "answer": "**Format** : `rwxrwxrwx` = propriétaire | groupe | autres. ◆ **Valeurs numériques** : r=4, w=2, x=1. ◆ **chmod 755** : propriétaire=7(rwx), groupe=5(r-x), autres=5(r-x). ◆ **chmod 644** : propriétaire=6(rw-), groupe=4(r--), autres=4(r--). ◆ **chmod 777** : tous les droits pour tout le monde — **dangereux en production**. ◆ **chmod 600** : lecture/écriture propriétaire uniquement — pour les fichiers de config sensibles (clés API). ◆ **chown user:group fichier** : changer le propriétaire. ◆ **Cas Trading** : `chmod 600 /etc/trading/api_keys.conf` — seul le processus owner peut lire les clés Bloomberg. `chmod 755 /opt/trading/bin/market_maker` — exécutable par tous mais modifiable uniquement par l'admin."
  },
  {
    "question": "Redirection & Pipes Linux | Monitoring Trading",
    "answer": "**>** : redirige stdout vers fichier (écrase). `ls > liste.txt`. ◆ **>>** : redirige stdout vers fichier (append). `echo 'trade' >> trades.log`. ◆ **2>** : redirige stderr. `./trading_engine 2> errors.log`. ◆ **2>&1** : redirige stderr vers stdout. `./app > all.log 2>&1`. ◆ **|** (pipe) : connecte stdout d'une commande à stdin de la suivante. ◆ **Exemples trading** : `tail -f market.log | grep 'FILL' | awk '{print $5}'` — extraire les prix des fills. `cat trades.csv | sort -k3 -n | head -10` — top 10 trades par volume. `ps aux | grep java | awk '{sum += $4} END {print sum}'` — CPU total des processus Java. ◆ **tee** : écrit dans un fichier ET affiche. `./engine 2>&1 | tee session.log`."
  },

  // ── PYTHON ──
  {
    "question": "Python : Structures de Données Essentielles | Finance/Data",
    "answer": "**Liste []** : mutable, ordonnée, doublons autorisés. `[1, 2, 3]`. Accès O(1), append O(1) amorti. ◆ **Tuple ()** : immuable, ordonnée. `(1, 2, 3)`. Plus rapide que liste. Hashable (utilisable comme clé dict). ◆ **Set {}** : non ordonnée, pas de doublons. `{1, 2, 3}`. Membership O(1). ◆ **Dict {}** : clé-valeur, depuis Python 3.7 ordonnée par insertion. Lookup O(1). ◆ **Déclaration set** : `mon_set = {1, 2, 3}` — **pas** `[]` (liste) ni `{}` seul (dict vide). ◆ **List comprehension** : `[x**2 for x in range(10) if x % 2 == 0]`. ◆ **Dict comprehension** : `{k: v for k, v in zip(isins, prices)}`. ◆ **Finance** : `prices = {'BNPP.PA': 58.2, 'SAN.PA': 32.1}`. `all_isins = {t.isin for t in trades}` — set pour dédupliquer."
  },
  {
    "question": "Python OOP : __init__, Dunder Methods, Héritage | Finance",
    "answer": "**__init__** : constructeur, appelé à l'instanciation. `def __init__(self, isin, price): self.isin = isin; self.price = price`. ◆ **Dunder (magic) methods** : `__str__` (str(obj), print), `__repr__` (repr(obj), debug), `__len__` (len(obj)), `__eq__` (comparaison ==), `__lt__` (comparaison <), `__hash__` (hashabilité), `__call__` (obj()). ◆ **@property** : accès attribut comme propriété calculée. ◆ **@classmethod** vs **@staticmethod** : classmethod reçoit `cls`, staticmethod ni self ni cls. ◆ **Héritage** : `class Option(Instrument):` → `super().__init__(...)`. ◆ **Finance** : `class Trade: def __lt__(self, other): return self.timestamp < other.timestamp` → `sorted(trades)` fonctionne. `__repr__` pour debug des positions."
  },
  {
    "question": "Python : map(), filter(), lambda, functools | Data",
    "answer": "**map(func, iterable)** : applique func à chaque élément. `list(map(lambda x: x*1.1, prices))` — augmente tous les prix de 10%. ◆ **filter(func, iterable)** : garde les éléments où func retourne True. `list(filter(lambda t: t.pnl > 0, trades))` — trades profitables. ◆ **lambda** : fonction anonyme. `lambda x, y: x + y`. ◆ **reduce** : `from functools import reduce; reduce(lambda acc, x: acc + x, values, 0)` — somme. ◆ **zip** : couple des itérables. `list(zip(isins, prices))`. ◆ **enumerate** : index + valeur. `for i, trade in enumerate(trades):`. ◆ **sorted avec key** : `sorted(trades, key=lambda t: t.notional, reverse=True)` — trier par notionnel décroissant. ◆ **Finance** : `total_pnl = sum(map(lambda t: t.pnl, trades))`. `best_trades = sorted(filter(lambda t: t.pnl > 0, trades), key=lambda t: t.pnl)[-5:]`."
  },
  {
    "question": "NumPy & Pandas : Fondamentaux | Quantitative Finance",
    "answer": "**NumPy** : arrays N-dimensionnels, opérations vectorisées (C sous le capot). `np.array([1,2,3])`. Broadcasting, slicing. ◆ **Vitesse** : boucle Python = lente (~µs/op), NumPy vectorisé = rapide (~ns/op). ◆ **Opérations clés** : `np.mean()`, `np.std()`, `np.dot()`, `np.linalg.eig()`. ◆ **Pandas DataFrame** : table de données étiquetée. Colonnes typées. `df['pnl'].mean()`, `df.groupby('desk')['pnl'].sum()`. ◆ **Sélection** : `df.loc[condition]`, `df.iloc[0:5]`. ◆ **Finance** : `returns = prices.pct_change()`. `VaR_95 = np.percentile(returns, 5) * portfolio_value`. `df.groupby('counterparty')['exposure'].sum()`. ◆ **Matplotlib** : `plt.plot(pnl_series)`, `plt.hist(returns, bins=50)` — distribution des rendements."
  },
  {
    "question": "Python : Gestion des Exceptions & Context Managers | Finance",
    "answer": "**try/except/finally** : `try: price = get_price(isin) except PriceNotFoundException as e: logger.error(e); price = fallback_price finally: release_connection()`. ◆ **Exception hiérarchie** : `Exception` > `ValueError` > `KeyError` > `TypeError`. ◆ **Context Manager (with)** : garantit l'exécution du cleanup. `with open('trades.csv') as f:` — fermeture auto. `with db.transaction():` — commit/rollback auto. ◆ **__enter__ / __exit__** : protocole context manager. ◆ **@contextmanager** : décorateur pour créer des context managers avec `yield`. ◆ **Finance** : `with bloomberg_session() as bbg:` — connexion Bloomberg fermée même si exception. `try: execute_order(order) except InsufficientFundsError: reject_order() except MarketClosedError: queue_order() except Exception as e: alert_risk_manager(e)`."
  },
  // ── SQL ──
  {
    "question": "SQL : SELECT, WHERE, GROUP BY, HAVING | Finance",
    "answer": "**Ordre logique d'exécution** : FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. ◆ **WHERE** : filtre les lignes avant agrégation. ◆ **GROUP BY** : regroupe les lignes pour les fonctions d'agrégation. ◆ **HAVING** : filtre les groupes après agrégation (là où WHERE ne peut pas utiliser les agrégats). ◆ **Fonctions d'agrégation** : COUNT(), SUM(), AVG(), MAX(), MIN(). ◆ **Exemple Finance** : `SELECT desk, SUM(pnl) as total_pnl, COUNT(*) as nb_trades FROM trades WHERE trade_date = CURRENT_DATE GROUP BY desk HAVING SUM(pnl) > 100000 ORDER BY total_pnl DESC` — desks profitables du jour. ◆ **Différence WHERE vs HAVING** : `WHERE age > 30` filtre avant. `HAVING AVG(salary) > 50000` filtre les groupes après agrégation."
  },
  {
    "question": "SQL : JOINs — INNER, LEFT, RIGHT, FULL OUTER | Finance",
    "answer": "**INNER JOIN** : uniquement les lignes avec correspondance dans les deux tables. ◆ **LEFT JOIN** : toutes les lignes de la table gauche + correspondances droite (NULL si pas de correspondance). ◆ **RIGHT JOIN** : inverse de LEFT JOIN. ◆ **FULL OUTER JOIN** : toutes les lignes des deux tables, NULL là où pas de correspondance. ◆ **CROSS JOIN** : produit cartésien. ◆ **Exemple Finance** : `SELECT t.trade_id, c.name, t.notional FROM trades t LEFT JOIN counterparties c ON t.counterparty_id = c.id` — tous les trades même si la contrepartie est inconnue. ◆ **Self JOIN** : `SELECT e.name, m.name as manager FROM employees e JOIN employees m ON e.manager_id = m.id`. ◆ **Performance** : s'assurer que les colonnes de JOIN sont indexées. `EXPLAIN` pour analyser le plan d'exécution."
  },
  {
    "question": "SQL : Subqueries, CTEs, Window Functions | Finance Avancé",
    "answer": "**Subquery** : requête imbriquée. `SELECT * FROM trades WHERE notional > (SELECT AVG(notional) FROM trades)`. ◆ **CTE (Common Table Expression)** : `WITH big_trades AS (SELECT * FROM trades WHERE notional > 1000000) SELECT desk, COUNT(*) FROM big_trades GROUP BY desk`. Plus lisible, réutilisable dans la même requête. ◆ **Window Functions** : calculs sur un ensemble de lignes liées sans GROUP BY. `ROW_NUMBER() OVER (PARTITION BY desk ORDER BY pnl DESC)` — rang des traders par desk. `LAG(price, 1) OVER (ORDER BY date)` — prix de la veille. `SUM(pnl) OVER (PARTITION BY desk)` — total du desk pour chaque ligne. ◆ **Finance** : `SELECT trade_id, pnl, SUM(pnl) OVER (ORDER BY trade_date) as cumulative_pnl FROM trades` — PnL cumulatif."
  },
  {
    "question": "SQL : Index, Performance & EXPLAIN | Trading Systems",
    "answer": "**Index** : structure de données (B-tree par défaut) accélérant les lookups. `CREATE INDEX idx_trades_isin ON trades(isin)`. ◆ **Quand indexer** : colonnes utilisées dans WHERE, JOIN ON, ORDER BY, GROUP BY. ◆ **Trade-off** : index accélère les SELECT, ralentit les INSERT/UPDATE/DELETE (maintenance de l'index). ◆ **Composite index** : `CREATE INDEX idx_trades_desk_date ON trades(desk, trade_date)`. Utilisé si la query filtre sur desk, ou desk+date. Pas utilisé si filtre sur date seul. ◆ **EXPLAIN / EXPLAIN ANALYZE** : plan d'exécution. Seq Scan = mauvais pour grandes tables. Index Scan = bon. Nested Loop vs Hash Join. ◆ **Finance** : table trades avec 100M lignes — sans index sur `counterparty_id`, chaque calcul d'exposition = full table scan = minutes. Avec index = millisecondes. ◆ **Covering index** : index contient toutes les colonnes nécessaires."
  },
  {
    "question": "C++ : Virtual Destructor & Polymorphisme | AMM",
    "answer": "**Virtual destructor** : `virtual ~Base();` — indispensable quand une classe a des méthodes virtuelles et peut être utilisée via un pointeur de base. ◆ **Pourquoi** : `Base* b = new Derived(); delete b;` — sans virtual destructor, seul ~Base() est appelé. ~Derived() n'est jamais appelé → **memory leak** si Derived a des ressources. ◆ **Règle** : toute classe avec une méthode virtuelle doit avoir un destructeur virtuel. ◆ **Pure virtual** : `virtual double compute() = 0;` → classe abstraite, ne peut pas être instanciée. ◆ **vptr/vtable** : le compilateur ajoute un pointeur vers la vtable pour chaque objet polymorphique. Overhead : 1 pointeur par objet + indirect call. ◆ **AMM/Trading** : `class Instrument { virtual ~Instrument(); virtual double price() = 0; }` → `class Bond : public Instrument`, `class Option : public Instrument`. Delete via `Instrument*` → virtual destructor obligatoire."
  },
  {
    "question": "C++ vs Python : Pourquoi C++ pour le Core Trading ? | AMM",
    "answer": "**Latence** : C++ compiled → exécution directe en assembleur. Python interpreted → overhead de l'interpréteur + GIL. C++ = nanosecondes. Python = microsecondes à millisecondes. ◆ **GIL** : Global Interpreter Lock Python — un seul thread exécute du Python à la fois. Impossible de paralléliser sur plusieurs cœurs en pur Python. ◆ **Gestion mémoire** : C++ contrôle total (RAII, smart pointers, arenas). Python = GC non déterministe avec pauses. Inacceptable pour low-latency. ◆ **Prédictibilité** : C++ pas de GC, pas de JIT warmup, latence déterministe. Python GC peut déclencher à tout moment. ◆ **Mémoire** : C++ struct = taille exacte définie. Python object = 28+ bytes overhead + pointeur. ◆ **AMM/Trading** : Core (order routing, pricing, risk) en C++. Analytics, reporting, backtest en Python (NumPy/Pandas). Les deux coexistent : Python appelle C++ via bindings (pybind11, Cython)."
  },
  {
    "question": "SQL : Transactions, ACID, Isolation | Finance",
    "answer": "**Transaction** : groupe d'opérations atomiques. `BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;` ◆ **ACID** : (A) Atomicité — tout ou rien. (C) Cohérence — contraintes respectées. (I) Isolation — transactions concurrentes ne se voient pas. (D) Durabilité — commit = persisté. ◆ **Niveaux d'isolation** : READ UNCOMMITTED (dirty reads), READ COMMITTED (défaut PostgreSQL), REPEATABLE READ, SERIALIZABLE. ◆ **Dirty read** : lire des données d'une transaction non commitée. **Non-repeatable read** : relire une ligne et obtenir une valeur différente. **Phantom read** : nouvelles lignes apparaissent entre deux lectures. ◆ **Finance** : transfert d'argent = transaction ACID obligatoire. Une mise à jour partielle de position est catastrophique. `ROLLBACK` si une des deux jambes du trade échoue."
  },
  {
    "question": "Python : Décorateurs & Générateurs | Finance",
    "answer": "**Décorateur** : fonction qui wrap une autre fonction. `@timing` mesure le temps d'exécution. `@retry(3)` relance 3 fois en cas d'échec. ◆ `def decorator(func): def wrapper(*args, **kwargs): # avant; result = func(*args, **kwargs); # après; return result; return wrapper`. ◆ **@functools.wraps** : préserver le nom et docstring de la fonction décorée. ◆ **Générateur** : fonction avec `yield`. Produit des valeurs à la demande (lazy evaluation). Économise la mémoire. `def trade_stream(): for t in db.query_all(): yield t`. ◆ **yield from** : déléguer à un sous-générateur. ◆ **Finance** : `@cache_result(ttl=60)` pour cacher les prix Bloomberg 60 secondes. Générateur pour streamer des millions de trades sans tout charger en mémoire : `sum(t.pnl for t in trade_stream())`."
  },
  {
    "question": "Linux : Debug Production & Monitoring | Trading",
    "answer": "**strace** : trace les appels système d'un processus. `strace -p PID` — voir ce que fait un processus bloqué. ◆ **lsof** : liste les fichiers/sockets ouverts. `lsof -p PID` — connexions réseau, fichiers ouverts. ◆ **perf** : profiling CPU Linux. `perf top -p PID` — voir les fonctions qui consomment le plus. ◆ **valgrind** : détection memory leaks, accès invalides. `valgrind --leak-check=full ./trading_engine`. ◆ **gdb** : debugger. `gdb ./engine core` pour analyser un core dump. `bt` (backtrace). ◆ **Analyser un crash en trading** : (1) Vérifier les logs `tail -1000 trading.log | grep ERROR`. (2) Core dump : `ulimit -c unlimited`. (3) `gdb ./engine core.12345` → `bt full`. (4) Vérifier les positions ouvertes avant de redémarrer. ◆ **journalctl** : `journalctl -u trading-engine -since '1 hour ago'` — logs systemd."
  },
  {
    "question": "C++ : Move Semantics & Perfect Forwarding | AMM",
    "answer": "**Move semantics (C++11)** : transférer la propriété des ressources sans copie. `std::move(obj)` transforme une lvalue en rvalue. ◆ **Move constructor** : `MyClass(MyClass&& other) noexcept : data(other.data) { other.data = nullptr; }` — vole les ressources de `other`. ◆ **Move assignment** : `operator=(MyClass&& other) noexcept`. ◆ **Pourquoi** : `return vector<Order>{...}` — sans move, copie coûteuse. Avec NRVO (Named Return Value Optimization) + move, aucune copie. ◆ **Perfect forwarding** : `template<typename T> void forward(T&& t) { inner(std::forward<T>(t)); }` — préserve la value category. ◆ **noexcept** : indique que le move ne lance pas d'exception → conteneurs STL utilisent le move au lieu de la copie si `noexcept`. ◆ **AMM/Trading** : `push_back(std::move(order))` pour insérer sans copier dans le vecteur d'ordres."
  },
  {
    "question": "SQL : Optimisation des Requêtes Finance | Reporting",
    "answer": "**Éviter SELECT *** : sélectionner uniquement les colonnes nécessaires → moins de data transféré, index covering possible. ◆ **Pagination** : `LIMIT 100 OFFSET 200` — mais OFFSET inefficace pour grandes tables. Préférer `WHERE id > last_seen_id LIMIT 100` (keyset pagination). ◆ **N+1 problem** : pour chaque trade, 1 requête séparée pour la contrepartie = N+1 requêtes. Solution : JOIN ou batch load. ◆ **Partitionnement** : `PARTITION BY RANGE (trade_date)` — tables partitionnées par date. Queries sur une période = scan d'une seule partition. ◆ **Materialized Views** : résultat pré-calculé d'une requête complexe. `REFRESH MATERIALIZED VIEW mv_daily_pnl`. ◆ **Analyse plan** : `EXPLAIN ANALYZE SELECT...` → chercher Seq Scan sur grandes tables, Nested Loop avec gros datasets. ◆ **Finance** : rapport de PnL quotidien sur 100M trades = doit utiliser index sur `trade_date` + partitionnement."
  }
];

const questions = {
  moyen: [
    // ── C++ FONDAMENTAUX (Q1–Q15) ──
    {
      "question": "[C++ Pointeurs] Quelle est la différence entre `const int*` et `int* const` ?",
      "options": [
        "`const int*` et `int* const` sont identiques en C++.",
        "`const int*` : pointeur vers un entier constant (la valeur ne peut pas être modifiée). `int* const` : pointeur constant (l'adresse ne peut pas être changée, mais la valeur si).",
        "`const int*` : le pointeur lui-même est constant. `int* const` : la valeur pointée est constante.",
        "`int* const` ne compile pas en C++ moderne."
      ],
      "answer": "`const int*` : pointeur vers un entier constant (la valeur ne peut pas être modifiée). `int* const` : pointeur constant (l'adresse ne peut pas être changée, mais la valeur si).",
      "explanation": "Lire de droite à gauche : `const int*` = pointeur (vers) int constant. `int* const` = pointeur-constant (vers) int. `const int* const` = pointeur constant vers int constant. En trading : `const Order* order` = je ne peux pas modifier l'ordre. `Order* const ptr = &order` = je ne peux pas changer vers quel ordre pointe ptr."
    },
    {
      "question": "[C++ Références] Peut-on avoir une référence nulle en C++ ?",
      "options": [
        "Oui, `int& ref = nullptr;` est valide.",
        "Non — une référence doit toujours être liée à un objet valide. Une référence nulle est un comportement indéfini (UB).",
        "Oui, mais seulement avec `std::optional<int&>`.",
        "Non, sauf pour les références rvalue (`int&&`)."
      ],
      "answer": "Non — une référence doit toujours être liée à un objet valide. Une référence nulle est un comportement indéfini (UB).",
      "explanation": "Contrairement aux pointeurs, une référence ne peut pas être null. `int& ref = *ptr` où ptr est nullptr = UB. C'est une garantie du langage : si vous avez une référence, elle pointe vers quelque chose de valide. C'est pourquoi les références sont préférées aux pointeurs quand l'argument ne peut pas être nul."
    },
    {
      "question": "[C++ Const Method] Que signifie `const` après une méthode membre ?",
      "options": [
        "La méthode retourne une valeur constante.",
        "La méthode peut seulement être appelée sur des objets constants.",
        "La méthode garantit qu'elle ne modifie pas l'état de l'objet (`this` est traité comme `const`).",
        "La méthode ne peut pas être surchargée."
      ],
      "answer": "La méthode garantit qu'elle ne modifie pas l'état de l'objet (`this` est traité comme `const`).",
      "explanation": "`double getPrice() const` : à l'intérieur, `this` est `const MyClass*`. Le compilateur empêche toute modification des membres. Avantages : (1) documenter l'intention, (2) permettre l'appel sur des `const MyClass& obj`, (3) optimisations compilateur. `mutable` est le seul moyen de modifier un membre dans une const method (ex: mutex, cache)."
    },
    {
      "question": "[C++ Copy] Quand la copie superficielle (shallow copy) est-elle dangereuse ?",
      "options": [
        "Toujours — il faut toujours utiliser une copie profonde.",
        "Quand la classe contient des pointeurs bruts vers de la mémoire allouée dynamiquement — deux objets partagent le même pointeur, double-delete ou dangling pointer.",
        "Seulement avec les conteneurs STL.",
        "Jamais si on utilise des smart pointers exclusivement."
      ],
      "answer": "Quand la classe contient des pointeurs bruts vers de la mémoire allouée dynamiquement — deux objets partagent le même pointeur, double-delete ou dangling pointer.",
      "explanation": "Exemple : `class Buffer { int* data; };` — shallow copy copie le pointeur. Si l'original est détruit, `delete[] data`, la copie a un dangling pointer. Solution : (1) Rule of Three : implémenter copy constructor, copy assignment, destructor avec deep copy. (2) Utiliser smart pointers (`unique_ptr` force la sémantique de move). (3) RAII."
    },
    {
      "question": "[C++ Stack/Heap] Pourquoi éviter `new` dans un système de trading low-latency ?",
      "options": [
        "Parce que `new` n'est pas disponible en C++ moderne.",
        "L'allocation heap est non-déterministe (syscall, recherche d'espace libre, fragmentation) — latence variable de 100ns à plusieurs µs, inacceptable pour le tick-to-trade.",
        "Parce que `new` ne fonctionne pas avec les smart pointers.",
        "Parce que le heap est limité à 1MB sur les systèmes Linux."
      ],
      "answer": "L'allocation heap est non-déterministe (syscall, recherche d'espace libre, fragmentation) — latence variable de 100ns à plusieurs µs, inacceptable pour le tick-to-trade.",
      "explanation": "En low-latency trading, on pré-alloue tout au démarrage (warm up phase) : object pools, ring buffers, memory arenas. Pendant la session, zéro allocation dynamique. Garbage-free programming = pas de GC, pas de `new`/`delete` en runtime. Résultat : latence déterministe et reproductible."
    },
    {
      "question": "[C++ Smart Pointers] Quelle est la différence entre `unique_ptr` et `shared_ptr` ?",
      "options": [
        "`unique_ptr` est pour les types primitifs, `shared_ptr` pour les objets.",
        "`unique_ptr` : propriété unique, non copiable, overhead nul. `shared_ptr` : propriété partagée via reference counting atomique, overhead de ~2x pointeurs + atomic ops.",
        "`shared_ptr` est toujours préférable car plus sûr.",
        "`unique_ptr` nécessite un custom deleter obligatoire."
      ],
      "answer": "`unique_ptr` : propriété unique, non copiable, overhead nul. `shared_ptr` : propriété partagée via reference counting atomique, overhead de ~2x pointeurs + atomic ops.",
      "explanation": "Préférer `unique_ptr` quand la propriété est claire et unique — overhead nul, même performance qu'un pointeur brut. `shared_ptr` quand plusieurs propriétaires. Danger `shared_ptr` : (1) cycles de référence → memory leak (solution : `weak_ptr`). (2) Overhead atomic ref counting sur chemins chauds. En AMM : `unique_ptr<Order>` pour un ordre appartenant à un seul composant."
    },
    {
      "question": "[C++ STL] Pourquoi `std::vector` est-il généralement préféré à `std::list` en trading ?",
      "options": [
        "Parce que `std::list` n'existe plus en C++ moderne.",
        "`std::vector` stocke les éléments de façon contiguë → cache-friendly. `std::list` éparpille les nœuds en mémoire → cache miss à chaque nœud = 10-100x plus lent en itération.",
        "`std::vector` a une meilleure complexité pour toutes les opérations.",
        "`std::list` est thread-safe contrairement à `std::vector`."
      ],
      "answer": "`std::vector` stocke les éléments de façon contiguë → cache-friendly. `std::list` éparpille les nœuds en mémoire → cache miss à chaque nœud = 10-100x plus lent en itération.",
      "explanation": "Cache line = 64 bytes. Avec `vector<int>`, 16 entiers tiennent dans une cache line. Avec `list<int>`, chaque nœud = données + 2 pointeurs (prev/next) = données éparpillées, chaque accès potentiellement un cache miss (~100ns). En pratique, même pour les insertions/suppressions fréquentes, vector avec move peut battre list grâce à la cache locality."
    },
    {
      "question": "[C++ Atomic] À quoi sert `std::atomic<T>` et en quoi diffère-t-il d'un mutex ?",
      "options": [
        "`std::atomic` et mutex sont identiques, juste une syntaxe différente.",
        "`std::atomic` : opération atomique sur une variable (indivisible, ~5-10ns). Mutex : protège une section critique de code (plus lent, ~25-100ns, peut bloquer un thread).",
        "`std::atomic` ne fonctionne que pour les entiers.",
        "Mutex est préférable dans tous les cas pour la clarté."
      ],
      "answer": "`std::atomic` : opération atomique sur une variable (indivisible, ~5-10ns). Mutex : protège une section critique de code (plus lent, ~25-100ns, peut bloquer un thread).",
      "explanation": "Utiliser `std::atomic` pour : compteurs, flags booléens, séquences de messages. `std::atomic<int> seq_num;` — incrément thread-safe sans mutex. Mutex pour des opérations composées sur plusieurs variables ou structures complexes. En AMM : `std::atomic<bool> market_open{false}` pour un flag de session partagé entre threads."
    },
    {
      "question": "[C++ Race Condition] Que se passe-t-il si deux threads modifient la même `int` sans protection ?",
      "options": [
        "L'opération est thread-safe car les entiers sont atomiques sur x86.",
        "C'est un data race — comportement indéfini (UB) en C++. En pratique, la valeur finale peut être n'importe quoi. Le compilateur peut optimiser sous l'hypothèse qu'il n'y a pas de data race.",
        "Le thread le plus rapide gagne, le résultat est déterministe.",
        "L'OS détecte automatiquement le conflit et le résout."
      ],
      "answer": "C'est un data race — comportement indéfini (UB) en C++. En pratique, la valeur finale peut être n'importe quoi. Le compilateur peut optimiser sous l'hypothèse qu'il n'y a pas de data race.",
      "explanation": "Même `i++` n'est pas atomique : read → increment → write = 3 opérations. Deux threads : T1 lit 5, T2 lit 5, T1 écrit 6, T2 écrit 6 → résultat 6 au lieu de 7. Solutions : `std::atomic<int>`, `std::mutex` + `lock_guard`, ou design sans partage de données (message passing)."
    },
    {
      "question": "[C++ unordered_map vs map] Quand choisir `std::unordered_map` plutôt que `std::map` ?",
      "options": [
        "Toujours — `unordered_map` est toujours plus rapide.",
        "`unordered_map` pour la performance pure (lookup O(1) moyen). `map` quand l'ordre des clés est nécessaire (itération ordonnée) ou quand la clé n'est pas hashable.",
        "`map` pour les types entiers, `unordered_map` pour les strings.",
        "`unordered_map` est thread-safe, pas `map`."
      ],
      "answer": "`unordered_map` pour la performance pure (lookup O(1) moyen). `map` quand l'ordre des clés est nécessaire (itération ordonnée) ou quand la clé n'est pas hashable.",
      "explanation": "Order book : `std::map<double, vector<Order>, greater<double>>` pour les bids (prix décroissants, itération ordonnée obligatoire). Cache ISIN → prix : `std::unordered_map<string, double>` pour lookup O(1). Attention : `unordered_map` peut dégénérer en O(n) avec collisions de hash — réserver de la capacité et utiliser un bon hash."
    },
    // ── LINUX (Q11–Q20) ──
    {
      "question": "[Linux grep] Quelle commande permet de trouver toutes les lignes contenant 'ERROR' dans tous les fichiers .log d'un répertoire ?",
      "options": [
        "`find ERROR *.log`",
        "`grep -r 'ERROR' /var/log/*.log`",
        "`ls -l | grep ERROR`",
        "`cat *.log | find ERROR`"
      ],
      "answer": "`grep -r 'ERROR' /var/log/*.log`",
      "explanation": "`grep -r` : recherche récursive. `-i` : insensible à la casse. `-n` : numéro de ligne. `-l` : afficher uniquement les noms de fichiers. `-v` : inverser (exclure le pattern). Cas trading : `grep -r 'REJECT\\|ERROR\\|FATAL' /var/log/trading/ | tail -50` — dernières erreurs toutes sources confondues."
    },
    {
      "question": "[Linux permissions] Quelle permission correspond à `chmod 640` sur un fichier ?",
      "options": [
        "Propriétaire : rwx, Groupe : r--, Autres : ---",
        "Propriétaire : rw-, Groupe : r--, Autres : ---",
        "Propriétaire : rw-, Groupe : rw-, Autres : ---",
        "Propriétaire : r-x, Groupe : r--, Autres : ---"
      ],
      "answer": "Propriétaire : rw-, Groupe : r--, Autres : ---",
      "explanation": "6 = 4+2 = rw- (lecture + écriture). 4 = r-- (lecture seule). 0 = --- (aucun droit). Donc 640 : propriétaire peut lire et écrire, groupe peut seulement lire, autres n'ont aucun droit. Idéal pour des fichiers de configuration contenant des paramètres sensibles."
    },
    {
      "question": "[Linux processus] Comment trouver le PID d'un processus nommé 'market_maker' en cours d'exécution ?",
      "options": [
        "`ls -l /proc | grep market_maker`",
        "`pgrep market_maker` ou `ps aux | grep market_maker`",
        "`find /proc -name market_maker`",
        "`top -n market_maker`"
      ],
      "answer": "`pgrep market_maker` ou `ps aux | grep market_maker`",
      "explanation": "`pgrep nom` : retourne directement le(s) PID. Plus précis que grep car cherche le nom du processus. `ps aux` : affiche tous les processus (a=tous les users, u=format lisible, x=pas de terminal). `pidof market_maker` aussi possible. Ensuite : `kill -SIGTERM $(pgrep market_maker)` pour arrêt propre."
    },
    {
      "question": "[Linux redirection] Quelle commande redirige stdout ET stderr vers un fichier log en ajoutant à la suite ?",
      "options": [
        "`./engine > logfile.txt`",
        "`./engine >> logfile.txt 2>&1`",
        "`./engine 2> logfile.txt`",
        "`./engine | logfile.txt`"
      ],
      "answer": "`./engine >> logfile.txt 2>&1`",
      "explanation": "`>>` : append (ne pas écraser). `2>&1` : rediriger stderr (fd 2) vers stdout (fd 1). L'ordre est important : `>> file 2>&1` fonctionne. `2>&1 >> file` ne fonctionne pas comme attendu. Pour monitoring trading : `./trading_engine >> /var/log/trading/session_$(date +%Y%m%d).log 2>&1 &` — démarrer en background avec logs datés."
    },
    {
      "question": "[Linux Thread vs Process] Quelle est la principale différence entre un processus et un thread sous Linux ?",
      "options": [
        "Un thread est plus lent qu'un processus car il utilise plus de ressources.",
        "Un processus possède son propre espace mémoire virtuel isolé. Les threads d'un même processus partagent la mémoire — communication plus rapide mais risque de race conditions.",
        "Linux ne supporte pas les threads, uniquement les processus.",
        "Un processus peut avoir un seul thread maximum."
      ],
      "answer": "Un processus possède son propre espace mémoire virtuel isolé. Les threads d'un même processus partagent la mémoire — communication plus rapide mais risque de race conditions.",
      "explanation": "Processus : isolation totale (crash d'un processus n'affecte pas les autres), IPC via sockets/pipes/shared memory. Threads : mémoire partagée → communication rapide mais synchronisation nécessaire. En trading : processus séparés pour l'isolation (crash du PnL engine n'affecte pas l'OMS). Threads pour le parallélisme dans un même composant (plusieurs feeds de marché)."
    },
    {
      "question": "[Linux tail] Comment surveiller en temps réel les nouvelles lignes d'un fichier de log trading ?",
      "options": [
        "`cat -f trading.log`",
        "`tail -f trading.log`",
        "`watch cat trading.log`",
        "`grep -l trading.log`"
      ],
      "answer": "`tail -f trading.log`",
      "explanation": "`tail -f` (follow) : affiche les dernières lignes et continue d'afficher les nouvelles lignes ajoutées. `tail -F` : suit le fichier même s'il est renommé (rotation de logs). Combinaison utile : `tail -f trading.log | grep --line-buffered 'FILL\\|REJECT'` — surveiller uniquement les fills et rejets en temps réel."
    },
    // ── PYTHON (Q17–Q30) ──
    {
      "question": "[Python] Quelle est la différence entre une liste et un tuple en Python ?",
      "options": [
        "Liste : numérique uniquement. Tuple : peut contenir n'importe quel type.",
        "Liste `[]` : mutable (modifiable après création). Tuple `()` : immuable. Tuple est hashable (peut être clé de dict), plus léger en mémoire, légèrement plus rapide.",
        "Tuple : ordonné. Liste : non ordonnée.",
        "Il n'y a pas de différence pratique entre liste et tuple."
      ],
      "answer": "Liste `[]` : mutable (modifiable après création). Tuple `()` : immuable. Tuple est hashable (peut être clé de dict), plus léger en mémoire, légèrement plus rapide.",
      "explanation": "Cas d'usage : liste pour une collection qui évolue (historique de trades). Tuple pour des données fixes (coordonnées, ISIN+date comme clé). `{('BNPP.PA', '2024-01-15'): price}` — tuple comme clé de dict. `list` ne peut pas être clé. Unpacking : `isin, price, volume = ('BNPP.PA', 58.2, 1000)` — tuple unpacking."
    },
    {
      "question": "[Python] Comment déclarer un set en Python ? Quelle est la différence avec un dict ?",
      "options": [
        "`mon_set = [1, 2, 3]` — les crochets créent un set.",
        "`mon_set = {1, 2, 3}` — accolades sans paires clé:valeur. `{}` seul crée un dict vide, pas un set vide.",
        "`mon_set = set()` est la seule façon correcte.",
        "`mon_set = (1, 2, 3)` — parenthèses pour les sets."
      ],
      "answer": "`mon_set = {1, 2, 3}` — accolades sans paires clé:valeur. `{}` seul crée un dict vide, pas un set vide.",
      "explanation": "Set vide : `set()` obligatoire (pas `{}`). Set = collection non ordonnée sans doublons, opérations O(1). Utilisation finance : `all_counterparties = {t.counterparty for t in trades}` — set des contreparties uniques. Opérations ensemblistes : `active_isins & watchlist` (intersection), `all_isins - traded_isins` (différence)."
    },
    {
      "question": "[Python map()] Que retourne `list(map(lambda x: x**2, [1, 2, 3, 4]))` ?",
      "options": [
        "`[1, 4, 9, 16]`",
        "`[2, 4, 6, 8]`",
        "`[1, 2, 3, 4]`",
        "`16` — seulement le dernier résultat."
      ],
      "answer": "`[1, 4, 9, 16]`",
      "explanation": "`map(func, iterable)` applique `func` à chaque élément. `lambda x: x**2` élève au carré. Résultat paresseux (lazy iterator), `list()` force l'évaluation. Équivalent list comprehension : `[x**2 for x in [1,2,3,4]]`. En finance : `list(map(lambda p: p * 1.05, prices))` — augmenter tous les prix de 5%."
    },
    {
      "question": "[Python __init__] À quoi sert la méthode `__init__` ?",
      "options": [
        "C'est le destructeur de la classe, appelé lors de la suppression.",
        "C'est le constructeur de la classe — appelé automatiquement lors de l'instanciation (`Trade()`), initialise les attributs de l'instance.",
        "C'est une méthode de classe qui ne prend pas `self`.",
        "Elle est appelée uniquement si on hérite d'une autre classe."
      ],
      "answer": "C'est le constructeur de la classe — appelé automatiquement lors de l'instanciation (`Trade()`), initialise les attributs de l'instance.",
      "explanation": "`def __init__(self, isin, notional): self.isin = isin; self.notional = notional` — `self` = référence à l'instance. `__del__` est le destructeur (peu utilisé en Python). `__new__` est appelé avant `__init__` pour créer l'instance. Finance : `class Trade: def __init__(self, isin, notional, counterparty): ...`"
    },
    {
      "question": "[Python list comprehension] Que retourne `[x for x in range(10) if x % 2 == 0]` ?",
      "options": [
        "`[1, 3, 5, 7, 9]` — les nombres impairs.",
        "`[0, 2, 4, 6, 8]` — les nombres pairs de 0 à 9.",
        "`[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]` — tous les nombres.",
        "`[2, 4, 6, 8, 10]` — les pairs jusqu'à 10."
      ],
      "answer": "`[0, 2, 4, 6, 8]` — les nombres pairs de 0 à 9.",
      "explanation": "`range(10)` = 0 à 9. `x % 2 == 0` garde seulement les pairs. List comprehension = syntaxe concise pour créer des listes. Finance : `profitable_trades = [t for t in trades if t.pnl > 0]`. `isins = [t.isin for t in trades if t.desk == 'RATES']`."
    },
    // ── SQL (Q21–35) ──
    {
      "question": "[SQL GROUP BY] Comment calculer le salaire moyen par département, uniquement pour les employés de plus de 30 ans ?",
      "options": [
        "`SELECT department, AVG(salary) FROM employees GROUP BY department HAVING age > 30`",
        "`SELECT department, AVG(salary) FROM employees WHERE age > 30 GROUP BY department`",
        "`SELECT department, AVG(salary) FROM employees GROUP BY department WHERE age > 30`",
        "`SELECT department, AVG(salary) FROM employees FILTER age > 30 GROUP BY department`"
      ],
      "answer": "`SELECT department, AVG(salary) FROM employees WHERE age > 30 GROUP BY department`",
      "explanation": "WHERE filtre les lignes AVANT le GROUP BY. Ordre correct : FROM → WHERE → GROUP BY → SELECT. `HAVING` filtre APRÈS GROUP BY — utilisé pour filtrer sur des agrégats (`HAVING AVG(salary) > 50000`). `WHERE AVG(salary) > 50000` est une erreur — les fonctions d'agrégat ne peuvent pas être dans WHERE."
    },
    {
      "question": "[SQL HAVING] Quelle est la différence entre WHERE et HAVING en SQL ?",
      "options": [
        "WHERE et HAVING sont synonymes, utilisables indifféremment.",
        "WHERE filtre les lignes individuelles avant agrégation. HAVING filtre les groupes après agrégation — seul HAVING peut utiliser des fonctions d'agrégat (COUNT, SUM, AVG...).",
        "HAVING est uniquement pour les jointures, WHERE pour les filtres simples.",
        "WHERE est pour les colonnes numériques, HAVING pour les colonnes texte."
      ],
      "answer": "WHERE filtre les lignes individuelles avant agrégation. HAVING filtre les groupes après agrégation — seul HAVING peut utiliser des fonctions d'agrégat (COUNT, SUM, AVG...).",
      "explanation": "Ordre d'exécution SQL : FROM → WHERE → GROUP BY → HAVING → SELECT. `WHERE AVG(salary) > 50000` = erreur (pas encore agrégé). `HAVING AVG(salary) > 50000` = correct. Finance : `HAVING SUM(exposure) > 10000000` — desks avec exposition > 10M. `WHERE trade_date > '2024-01-01'` — filtrer les trades récents avant d'agréger."
    },
    {
      "question": "[SQL INNER JOIN] Quelle requête retourne uniquement les trades ayant une contrepartie connue dans la table `counterparties` ?",
      "options": [
        "`SELECT * FROM trades LEFT JOIN counterparties ON trades.cpty_id = counterparties.id`",
        "`SELECT * FROM trades INNER JOIN counterparties ON trades.cpty_id = counterparties.id`",
        "`SELECT * FROM trades FULL OUTER JOIN counterparties ON trades.cpty_id = counterparties.id`",
        "`SELECT * FROM trades, counterparties WHERE trades.cpty_id = counterparties.id`"
      ],
      "answer": "`SELECT * FROM trades INNER JOIN counterparties ON trades.cpty_id = counterparties.id`",
      "explanation": "INNER JOIN = intersection — seulement les lignes avec correspondance dans les deux tables. Trades sans contrepartie connue sont exclus. LEFT JOIN = tous les trades, même sans contrepartie (NULL). Note : `SELECT * FROM trades, counterparties WHERE ...` (implicit join) est équivalent à INNER JOIN mais moins lisible — préférer la syntaxe explicite."
    },
    {
      "question": "[SQL LEFT JOIN] Que retourne un LEFT JOIN si aucune correspondance n'est trouvée dans la table de droite ?",
      "options": [
        "La ligne de gauche est exclue du résultat.",
        "La ligne de gauche est conservée avec des valeurs NULL pour toutes les colonnes de la table de droite.",
        "Une erreur SQL est levée.",
        "La ligne de gauche est remplacée par une valeur par défaut."
      ],
      "answer": "La ligne de gauche est conservée avec des valeurs NULL pour toutes les colonnes de la table de droite.",
      "explanation": "LEFT JOIN : TOUTES les lignes de la table gauche, correspondances ou non. Sans correspondance → colonnes droite = NULL. Finance : `SELECT t.*, c.credit_rating FROM trades t LEFT JOIN credit_ratings c ON t.cpty_id = c.cpty_id` — tous les trades, rating NULL si la contrepartie n'a pas de notation. Utile pour détecter les données manquantes : `WHERE c.credit_rating IS NULL`."
    },
    {
      "question": "[SQL AVG + GROUP BY] Quelle requête affiche les départements dont le salaire moyen dépasse 50 000€ ?",
      "options": [
        "`SELECT department FROM employees WHERE AVG(salary) > 50000 GROUP BY department`",
        "`SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 50000`",
        "`SELECT department, AVG(salary) FROM employees HAVING AVG(salary) > 50000`",
        "`SELECT department FROM employees GROUP BY department WHERE AVG(salary) > 50000`"
      ],
      "answer": "`SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 50000`",
      "explanation": "HAVING est obligatoire pour filtrer sur un agrégat. Ordre : GROUP BY d'abord, puis HAVING filtre les groupes. Sans GROUP BY, HAVING s'applique à l'ensemble des lignes comme un seul groupe. Finance : `HAVING SUM(pnl) < -500000` — desks en perte significative."
    },
    {
      "question": "[Python Pandas] Que fait `df.groupby('desk')['pnl'].sum()` ?",
      "options": [
        "Filtre les lignes où 'desk' est égal à 'pnl'.",
        "Groupe les lignes par valeur de la colonne 'desk', puis calcule la somme de 'pnl' pour chaque groupe.",
        "Trie le DataFrame par 'desk' puis par 'pnl'.",
        "Calcule la somme totale de 'pnl' sans regroupement."
      ],
      "answer": "Groupe les lignes par valeur de la colonne 'desk', puis calcule la somme de 'pnl' pour chaque groupe.",
      "explanation": "Équivalent SQL : `SELECT desk, SUM(pnl) FROM trades GROUP BY desk`. `groupby()` retourne un GroupBy object. `.sum()`, `.mean()`, `.count()`, `.agg({'pnl': 'sum', 'notional': 'mean'})`. Finance : PnL par desk, exposition par contrepartie, volume par instrument."
    },
    {
      "question": "[C++ virtual destructor] Pourquoi un destructeur virtuel est-il nécessaire en C++ ?",
      "options": [
        "Pour améliorer les performances de destruction d'objets.",
        "Sans destructeur virtuel, `delete base_ptr` (où base_ptr pointe vers un objet Derived) n'appelle que ~Base(), pas ~Derived() → memory leak et ressources non libérées.",
        "Le destructeur virtuel est obligatoire pour toute classe C++.",
        "Pour empêcher la copie des objets polymorphiques."
      ],
      "answer": "Sans destructeur virtuel, `delete base_ptr` (où base_ptr pointe vers un objet Derived) n'appelle que ~Base(), pas ~Derived() → memory leak et ressources non libérées.",
      "explanation": "Règle : toute classe avec une méthode virtuelle doit avoir `virtual ~Base()`. Exemple : `Instrument* i = new Bond(); delete i;` — sans virtual destructor, ~Bond() non appelé, ressources de Bond non libérées. Solution : `virtual ~Instrument() = default;`. Alternative : `final` sur les classes feuilles."
    },
    {
      "question": "[Linux grep -v] Que fait l'option `-v` de grep ?",
      "options": [
        "Affiche le numéro de ligne de chaque résultat.",
        "Inverse le filtre — affiche les lignes qui NE contiennent PAS le pattern.",
        "Rend la recherche insensible à la casse.",
        "Affiche uniquement les noms des fichiers correspondants."
      ],
      "answer": "Inverse le filtre — affiche les lignes qui NE contiennent PAS le pattern.",
      "explanation": "`grep -v 'DEBUG' app.log` : tout sauf les lignes DEBUG. `grep -v '^#' config.ini` : exclure les commentaires. Options utiles : `-i` (case insensitive), `-n` (numéro de ligne), `-l` (noms de fichiers), `-r` (récursif), `-E` (regex étendue). Trading : `tail -f trading.log | grep -v 'HEARTBEAT'` — filtrer les heartbeats parasites."
    },
    {
      "question": "[Python NumPy] Quelle opération NumPy calcule le 5e percentile d'un array de rendements pour la VaR ?",
      "options": [
        "`np.min(returns) * 0.05`",
        "`np.percentile(returns, 5)`",
        "`np.quantile(returns, 95)`",
        "`returns.sort()[int(len(returns)*0.05)]`"
      ],
      "answer": "`np.percentile(returns, 5)`",
      "explanation": "`np.percentile(array, q)` calcule le qième percentile. VaR historique 95% = percentile 5 des rendements (5% des jours les plus mauvais). `np.percentile(returns, 5) * portfolio_value` = perte maximale avec 95% de confiance. `np.quantile(returns, 0.05)` est équivalent."
    },
    {
      "question": "[SQL complexité] Quelle est la complexité de recherche d'une clé dans `std::map` (C++) vs `std::unordered_map` ?",
      "options": [
        "`std::map` : O(1), `std::unordered_map` : O(log n)",
        "`std::map` : O(log n), `std::unordered_map` : O(1) moyen / O(n) pire cas",
        "Les deux : O(log n)",
        "Les deux : O(1)"
      ],
      "answer": "`std::map` : O(log n), `std::unordered_map` : O(1) moyen / O(n) pire cas",
      "explanation": "`std::map` = arbre rouge-noir, log n comparaisons pour trouver une clé. `std::unordered_map` = hash table, hash puis accès direct = O(1) en moyenne. Pire cas O(n) si toutes les clés ont le même hash (collisions). `std::vector::push_back` : O(1) amorti (réallocation occasionnelle O(n))."
    },
    {
      "question": "[C++ Iterators] Quelle est la différence entre un iterator et un pointeur en C++ ?",
      "options": [
        "Les iterators sont des pointeurs avec un nom différent.",
        "Un iterator est une abstraction généralisant le concept de pointeur pour tous les conteneurs STL. Supporte `++`, `*`, `==`. Certains iterators (vector) sont des pointeurs. D'autres (list, map) sont des objets complexes.",
        "Les pointeurs sont plus lents que les iterators.",
        "Les iterators sont uniquement pour les conteneurs triés."
      ],
      "answer": "Un iterator est une abstraction généralisant le concept de pointeur pour tous les conteneurs STL. Supporte `++`, `*`, `==`. Certains iterators (vector) sont des pointeurs. D'autres (list, map) sont des objets complexes.",
      "explanation": "Catégories d'iterators : input/output (one-pass), forward (multi-pass), bidirectional (++ et --), random access (+ n, < comparaison). `vector::iterator` = random access. `list::iterator` = bidirectional. Invalidation : un `push_back` sur vector peut invalider tous les iterators (réallocation). Finance : `for(auto it = orders.begin(); it != orders.end(); ++it)` ou range-for `for(auto& o : orders)`."
    },
    {
      "question": "[Python] Quelle est la différence entre `__str__` et `__repr__` ?",
      "options": [
        "Ce sont des synonymes en Python moderne.",
        "`__str__` : représentation lisible pour l'utilisateur (`str(obj)`, `print`). `__repr__` : représentation non ambiguë pour le développeur (`repr(obj)`, REPL). Si `__str__` absent, Python utilise `__repr__`.",
        "`__repr__` est appelé uniquement dans les logs.",
        "`__str__` est pour les nombres, `__repr__` pour les objets."
      ],
      "answer": "`__str__` : représentation lisible pour l'utilisateur (`str(obj)`, `print`). `__repr__` : représentation non ambiguë pour le développeur (`repr(obj)`, REPL). Si `__str__` absent, Python utilise `__repr__`.",
      "explanation": "Bonne pratique : `__repr__` retourne quelque chose comme `Trade(isin='BNPP.PA', notional=1000000)` — idéalement évaluable avec `eval()`. `__str__` retourne `Trade BNPP.PA 1M€`. Finance : `__repr__` indispensable pour debugger des listes de trades dans le REPL. `logger.debug(repr(trade))` donne tous les détails."
    },
    {
      "question": "[SQL] Quelle est la différence entre `COUNT(*)` et `COUNT(colonne)` ?",
      "options": [
        "Elles sont identiques dans tous les cas.",
        "`COUNT(*)` compte toutes les lignes y compris celles avec NULL. `COUNT(colonne)` compte seulement les lignes où `colonne` n'est pas NULL.",
        "`COUNT(*)` est plus lent que `COUNT(colonne)`.",
        "`COUNT(colonne)` compte les valeurs distinctes uniquement."
      ],
      "answer": "`COUNT(*)` compte toutes les lignes y compris celles avec NULL. `COUNT(colonne)` compte seulement les lignes où `colonne` n'est pas NULL.",
      "explanation": "`COUNT(DISTINCT colonne)` compte les valeurs uniques non-NULL. Finance : `SELECT COUNT(*) FROM trades` = nombre total de trades. `SELECT COUNT(counterparty_id) FROM trades` = trades avec contrepartie renseignée. `SELECT COUNT(DISTINCT isin) FROM trades` = nombre d'instruments tradés."
    },
    {
      "question": "[Linux] Que fait la commande `kill -SIGTERM PID` vs `kill -9 PID` ?",
      "options": [
        "Les deux arrêtent immédiatement le processus.",
        "SIGTERM (15) : signal d'arrêt que le processus peut intercepter pour se nettoyer (flush buffers, fermer connexions, annuler ordres ouverts). SIGKILL (9) : arrêt forcé immédiat, ne peut pas être intercepté.",
        "SIGTERM arrête tous les processus du système.",
        "`kill -9` est uniquement pour les processus zombie."
      ],
      "answer": "SIGTERM (15) : signal d'arrêt que le processus peut intercepter pour se nettoyer (flush buffers, fermer connexions, annuler ordres ouverts). SIGKILL (9) : arrêt forcé immédiat, ne peut pas être intercepté.",
      "explanation": "En trading : toujours commencer par SIGTERM. Le processus peut envoyer des cancel orders au marché, écrire l'état en base, fermer les connexions FIX proprement. Attendre 30 secondes. Si toujours actif → SIGKILL. SIGKILL sans cleanup = ordres ouverts orphelins = risque opérationnel. `trap 'cleanup' SIGTERM` dans les scripts bash."
    },
    {
      "question": "[Python] Que fait `sorted(trades, key=lambda t: t.pnl, reverse=True)` ?",
      "options": [
        "Modifie la liste `trades` en place par ordre de PnL décroissant.",
        "Retourne une nouvelle liste triée par PnL décroissant. `trades` n'est pas modifié. `list.sort()` trie en place, `sorted()` retourne une nouvelle liste.",
        "Retourne le trade avec le PnL maximum.",
        "Trie par PnL croissant car `reverse=True` inverse la clé."
      ],
      "answer": "Retourne une nouvelle liste triée par PnL décroissant. `trades` n'est pas modifié. `list.sort()` trie en place, `sorted()` retourne une nouvelle liste.",
      "explanation": "`sorted()` = immutable (nouvelle liste). `.sort()` = in-place (modifie la liste). `key=` : fonction appliquée à chaque élément pour obtenir la clé de tri. `reverse=True` : ordre décroissant. Finance : `top5 = sorted(trades, key=lambda t: t.pnl, reverse=True)[:5]` — 5 meilleurs trades de la journée."
    },
    {
      "question": "[SQL NULL] Comment filtrer les lignes où `counterparty` est NULL en SQL ?",
      "options": [
        "`WHERE counterparty = NULL`",
        "`WHERE counterparty IS NULL`",
        "`WHERE counterparty == NULL`",
        "`WHERE ISNULL(counterparty) = 1`"
      ],
      "answer": "`WHERE counterparty IS NULL`",
      "explanation": "NULL ne peut pas être comparé avec `=` — NULL = NULL retourne NULL (pas TRUE). Utiliser `IS NULL` et `IS NOT NULL`. `COALESCE(counterparty, 'UNKNOWN')` remplace NULL par une valeur par défaut. Finance : `SELECT * FROM trades WHERE desk IS NULL` — trades sans desk assigné = anomalie à investiguer."
    },
    {
      "question": "[C++ std::lock_guard] Pourquoi utiliser `std::lock_guard` plutôt que `mutex.lock()` / `mutex.unlock()` manuellement ?",
      "options": [
        "`lock_guard` est plus rapide que le lock/unlock manuel.",
        "`lock_guard` est un RAII wrapper : unlock automatique à la sortie du scope, même si une exception est levée. Le unlock manuel peut être oublié ou ne pas être atteint en cas d'exception → deadlock.",
        "`lock_guard` fonctionne avec plusieurs mutex simultanément.",
        "Le lock/unlock manuel n'est pas disponible en C++ moderne."
      ],
      "answer": "`lock_guard` est un RAII wrapper : unlock automatique à la sortie du scope, même si une exception est levée. Le unlock manuel peut être oublié ou ne pas être atteint en cas d'exception → deadlock.",
      "explanation": "Exception safety : `mutex.lock(); processOrder(order); mutex.unlock()` — si `processOrder` lance une exception, unlock n'est jamais appelé → deadlock. `{ std::lock_guard<mutex> lg(mtx); processOrder(order); }` — unlock garanti par le destructeur de `lock_guard`. `std::unique_lock` : plus flexible (trylock, timed lock, condition_variable)."
    },
    {
      "question": "[Python filter()] Que retourne `list(filter(lambda t: t.pnl > 0, trades))` ?",
      "options": [
        "La somme des PnL positifs.",
        "Une nouvelle liste contenant uniquement les trades dont `pnl > 0`.",
        "Un booléen indiquant si tous les trades sont profitables.",
        "Le premier trade profitable trouvé."
      ],
      "answer": "Une nouvelle liste contenant uniquement les trades dont `pnl > 0`.",
      "explanation": "`filter(func, iterable)` garde les éléments pour lesquels `func` retourne True. Retourne un iterator lazy → `list()` force l'évaluation. Équivalent : `[t for t in trades if t.pnl > 0]`. Finance : `losing_trades = list(filter(lambda t: t.pnl < -10000, trades))` — trades en perte significative."
    },
    {
      "question": "[SQL ORDER BY] Comment retourner les 10 trades avec le plus grand notionnel, parmi les trades du desk 'RATES' ?",
      "options": [
        "`SELECT * FROM trades LIMIT 10 WHERE desk='RATES' ORDER BY notional`",
        "`SELECT * FROM trades WHERE desk='RATES' ORDER BY notional DESC LIMIT 10`",
        "`SELECT TOP 10 * FROM trades WHERE desk='RATES' ORDER BY notional DESC`",
        "`SELECT * FROM trades WHERE desk='RATES' HAVING notional > 0 LIMIT 10`"
      ],
      "answer": "`SELECT * FROM trades WHERE desk='RATES' ORDER BY notional DESC LIMIT 10`",
      "explanation": "Ordre SQL : WHERE filtre → ORDER BY trie → LIMIT tronque. `DESC` = décroissant (plus grand en premier). `TOP 10` = syntaxe SQL Server/T-SQL. `LIMIT 10` = MySQL/PostgreSQL. `FETCH FIRST 10 ROWS ONLY` = standard SQL. Finance : top 10 trades par notionnel du desk taux pour vérification manuelle."
    },
    {
      "question": "[Linux find] Comment trouver tous les fichiers .log modifiés dans les dernières 24h dans /var/log ?",
      "options": [
        "`ls -lt /var/log/*.log | head -10`",
        "`find /var/log -name '*.log' -mtime -1`",
        "`grep -r '' /var/log --include='*.log' -l`",
        "`locate /var/log/*.log -newer today`"
      ],
      "answer": "`find /var/log -name '*.log' -mtime -1`",
      "explanation": "`find` : `-name` pattern de nom. `-mtime -1` = modifié il y a moins de 1 jour. `-mtime +7` = plus vieux que 7 jours. `-size +100M` = plus grand que 100MB. `-type f` = fichiers seulement. `-type d` = répertoires. Trading : `find /var/log/trading -name '*.log' -mtime -1 -exec grep -l 'FATAL' {} \\;` — logs récents avec erreurs fatales."
    },
    {
      "question": "[Python] Que fait `zip([1,2,3], ['a','b','c'])` ?",
      "options": [
        "Compresse les deux listes en un fichier ZIP.",
        "Retourne un iterator de tuples `(1,'a'), (2,'b'), (3,'c')` — associe les éléments par position. S'arrête à la liste la plus courte.",
        "Concatène les deux listes `[1,2,3,'a','b','c']`.",
        "Retourne un dictionnaire `{1:'a', 2:'b', 3:'c'}`."
      ],
      "answer": "Retourne un iterator de tuples `(1,'a'), (2,'b'), (3,'c')` — associe les éléments par position. S'arrête à la liste la plus courte.",
      "explanation": "`dict(zip(isins, prices))` = crée un dictionnaire ISIN→prix. `for isin, price in zip(isins, prices)` = itération parallèle. `zip_longest` (itertools) = continue avec la liste la plus longue, rempli `None`. Finance : `portfolio = dict(zip(isins, quantities))`. `list(zip(trade_ids, fills))` pour associer IDs et confirmations."
    },
    {
      "question": "[SQL DISTINCT] Quelle requête compte le nombre de contreparties uniques ayant tradé aujourd'hui ?",
      "options": [
        "`SELECT COUNT(*) FROM trades WHERE trade_date = CURRENT_DATE`",
        "`SELECT COUNT(DISTINCT counterparty_id) FROM trades WHERE trade_date = CURRENT_DATE`",
        "`SELECT DISTINCT COUNT(counterparty_id) FROM trades WHERE trade_date = CURRENT_DATE`",
        "`SELECT COUNT(counterparty_id) UNIQUE FROM trades WHERE trade_date = CURRENT_DATE`"
      ],
      "answer": "`SELECT COUNT(DISTINCT counterparty_id) FROM trades WHERE trade_date = CURRENT_DATE`",
      "explanation": "`COUNT(DISTINCT col)` = compte les valeurs uniques non-NULL. Diffère de `COUNT(*)` (toutes lignes) et `COUNT(col)` (lignes non-NULL). Finance : nombre de contreparties actives = métrique de liquidité. `SELECT desk, COUNT(DISTINCT counterparty_id) FROM trades GROUP BY desk` — diversification par desk."
    },
    {
      "question": "[C++ Memory Leak] Comment détecter un memory leak en C++ ?",
      "options": [
        "Un memory leak est automatiquement détecté par le compilateur C++.",
        "Valgrind (`--leak-check=full`), AddressSanitizer (`-fsanitize=address`), ou overloader `operator new`/`delete` avec un compteur. En production : surveiller la croissance de la mémoire du processus.",
        "Les memory leaks ne sont possibles qu'avec des pointeurs bruts, pas avec smart pointers.",
        "Le runtime C++ libère automatiquement la mémoire non référencée."
      ],
      "answer": "Valgrind (`--leak-check=full`), AddressSanitizer (`-fsanitize=address`), ou overloader `operator new`/`delete` avec un compteur. En production : surveiller la croissance de la mémoire du processus.",
      "explanation": "C++ n'a pas de GC — la mémoire allouée avec `new` doit être libérée avec `delete`. Smart pointers préviennent la plupart des leaks mais pas tous (cycles avec shared_ptr). En dev : Valgrind ou ASan détectent à l'exécution. En prod : `cat /proc/PID/status | grep VmRSS` — surveillance de la mémoire résidente. Croissance continue = probable memory leak."
    },
    {
      "question": "[Python pandas] Que fait `df['pnl'].fillna(0)` ?",
      "options": [
        "Supprime les lignes où `pnl` est NaN.",
        "Remplace les valeurs NaN dans la colonne `pnl` par 0. Ne modifie pas `df` en place sauf avec `inplace=True`.",
        "Remplace les valeurs nulles par la moyenne de la colonne.",
        "Retourne True si la colonne contient des NaN."
      ],
      "answer": "Remplace les valeurs NaN dans la colonne `pnl` par 0. Ne modifie pas `df` en place sauf avec `inplace=True`.",
      "explanation": "Gestion des NaN : `fillna(value)`, `fillna(method='ffill')` (forward fill), `fillna(method='bfill')`. `dropna()` supprime les lignes avec NaN. `isna()` / `notna()` : masque booléen. Finance : `df['pnl'].fillna(0)` pour les instruments sans PnL calculé. `df['price'].fillna(method='ffill')` pour propager le dernier prix connu."
    },
    {
      "question": "[SQL UPDATE] Comment mettre à jour le statut de tous les trades non confirmés de plus de 30 minutes ?",
      "options": [
        "`SELECT status FROM trades WHERE status = 'PENDING' AND age > 30`",
        "`UPDATE trades SET status = 'EXPIRED' WHERE status = 'PENDING' AND created_at < NOW() - INTERVAL '30 minutes'`",
        "`ALTER TABLE trades SET status = 'EXPIRED' WHERE PENDING`",
        "`UPDATE trades status = 'EXPIRED' WHERE status = 'PENDING'"
      ],
      "answer": "`UPDATE trades SET status = 'EXPIRED' WHERE status = 'PENDING' AND created_at < NOW() - INTERVAL '30 minutes'`",
      "explanation": "Syntaxe UPDATE : `UPDATE table SET col = val WHERE condition`. `NOW()` = timestamp courant (PostgreSQL). `INTERVAL '30 minutes'` = durée. MySQL : `NOW() - INTERVAL 30 MINUTE`. En trading : purger les ordres périmés, mettre à jour les statuts. Toujours dans une transaction avec log d'audit : `BEGIN; INSERT INTO audit_log SELECT * FROM trades WHERE ...; UPDATE trades SET ...; COMMIT;`"
    },
    {
      "question": "[Linux] Comment afficher les 5 processus consommant le plus de CPU sur un serveur Linux ?",
      "options": [
        "`ls -l /proc | sort -k5`",
        "`ps aux --sort=-%cpu | head -6`",
        "`top -n 5 -1`",
        "`grep CPU /proc/*/stat | sort | tail -5`"
      ],
      "answer": "`ps aux --sort=-%cpu | head -6`",
      "explanation": "`ps aux` : tous les processus. `--sort=-%cpu` : tri par CPU décroissant (`-` = décroissant). `head -6` : header + 5 processus. Alternative : `ps aux | sort -k3 -rn | head -6` (colonne 3 = %CPU). `top -bn1 | sort -k9 -rn | head -10` (one-shot). Trading : diagnostiquer quel processus sature le CPU d'un serveur de trading."
    },
    {
      "question": "[Python] Comment lire un fichier CSV de trades avec Pandas ?",
      "options": [
        "`import csv; reader = csv.reader('trades.csv')`",
        "`import pandas as pd; df = pd.read_csv('trades.csv')`",
        "`df = pandas.load('trades.csv')`",
        "`with open('trades.csv') as f: df = f.read_csv()`"
      ],
      "answer": "`import pandas as pd; df = pd.read_csv('trades.csv')`",
      "explanation": "`pd.read_csv()` : `sep=','` (séparateur), `header=0` (première ligne = colonnes), `parse_dates=['trade_date']` (convertir les dates), `dtype={'isin': str, 'notional': float}` (types forcés), `nrows=1000` (lire seulement N lignes), `skiprows=1` (sauter des lignes). Finance : `df = pd.read_csv('eod_trades.csv', parse_dates=['trade_date'], dtype={'isin': str})`."
    },
    {
      "question": "[SQL] Que retourne `SELECT COALESCE(NULL, NULL, 'default', 'other')` ?",
      "options": [
        "NULL",
        "`'default'` — COALESCE retourne la première valeur non-NULL.",
        "`'other'` — COALESCE retourne la dernière valeur.",
        "Une erreur — COALESCE ne peut pas prendre plus de 2 arguments."
      ],
      "answer": "`'default'` — COALESCE retourne la première valeur non-NULL.",
      "explanation": "`COALESCE(val1, val2, ..., valN)` retourne le premier argument non-NULL. Équivalent à des CASE WHEN imbriqués. Finance : `COALESCE(bloomberg_price, reuters_price, last_known_price, 0)` — cascade de sources de prix. `SELECT COALESCE(middle_name, '') FROM employees` — remplacer NULL par chaîne vide."
    },
    {
      "question": "[C++] Quelle est la complexité de `std::vector::push_back` en C++ ?",
      "options": [
        "O(n) — le vecteur est réalloué à chaque push_back.",
        "O(1) amorti — réallocation occasionnelle O(n), mais suffisamment rare pour que le coût moyen soit O(1). La capacité double à chaque réallocation.",
        "O(log n) — le vecteur maintient un arbre interne.",
        "O(1) garanti — jamais de réallocation."
      ],
      "answer": "O(1) amorti — réallocation occasionnelle O(n), mais suffisamment rare pour que le coût moyen soit O(1). La capacité double à chaque réallocation.",
      "explanation": "Stratégie de doublement : 1, 2, 4, 8, 16... Réallocation après N push_backs = N copies totales sur toute la vie du vecteur. Coût amorti = N copies / N push_backs = O(1). Optimisation : `vector.reserve(expected_size)` pour éviter les réallocations si on connaît la taille finale. Finance : `trades.reserve(100000)` avant de charger les trades du jour."
    }
  ],
  avance: [
    // ── C++ AVANCÉ (Q1–15) ──
    {
      "question": "[C++ Memory Model] Quelle est la différence entre `memory_order_relaxed` et `memory_order_seq_cst` ?",
      "options": [
        "Ce sont des synonymes, les deux garantissent la cohérence séquentielle.",
        "`relaxed` : pas de synchronisation inter-threads, seulement l'atomicité de l'opération (le plus rapide). `seq_cst` : ordre total sur toutes les opérations atomiques dans tous les threads (le plus fort, le plus lent).",
        "`relaxed` est pour les lectures, `seq_cst` pour les écritures.",
        "`memory_order_seq_cst` n'est disponible qu'en C++20."
      ],
      "answer": "`relaxed` : pas de synchronisation inter-threads, seulement l'atomicité de l'opération (le plus rapide). `seq_cst` : ordre total sur toutes les opérations atomiques dans tous les threads (le plus fort, le plus lent).",
      "explanation": "Hiérarchie : relaxed < acquire/release < seq_cst. `acquire/release` : synchronisation producteur/consommateur (le plus courant). `relaxed` : compteurs où l'ordre ne compte pas (`fetch_add(1, relaxed)` pour stats). `seq_cst` : quand on a besoin d'un ordre global (rarement nécessaire, overhead significatif sur ARM multi-socket). AMM : flag `market_open` avec `seq_cst` pour garantir que tous les threads voient le changement immédiatement."
    },
    {
      "question": "[C++ Template Metaprogramming] Pourquoi utiliser des templates en C++ pour un système de trading low-latency ?",
      "options": [
        "Les templates rendent le code plus lisible uniquement.",
        "Les templates permettent la spécialisation à la compilation — zéro overhead runtime, inlining agressif, virtualité évitée. Un `RingBuffer<Order, 1024>` est plus performant qu'un `RingBuffer` polymorphique.",
        "Les templates sont nécessaires uniquement pour les conteneurs STL.",
        "Les templates ralentissent la compilation sans gain à l'exécution."
      ],
      "answer": "Les templates permettent la spécialisation à la compilation — zéro overhead runtime, inlining agressif, virtualité évitée. Un `RingBuffer<Order, 1024>` est plus performant qu'un `RingBuffer` polymorphique.",
      "explanation": "Polymorphisme statique vs dynamique : virtual dispatch = indirect call via vtable = branch misprediction = ~5-10ns overhead. Templates = dispatch à la compilation = inlining = 0 overhead. En low-latency : `template<typename Strategy> class PricingEngine { void price(const Order& o) { Strategy::compute(o); } }` — Strategy est résolue à la compilation, code inliné directement."
    },
    {
      "question": "[C++ RAII] Qu'est-ce que RAII et pourquoi est-ce crucial en trading ?",
      "options": [
        "Resource Allocation Is Immediate — allouer les ressources le plus tôt possible.",
        "Resource Acquisition Is Initialization — les ressources sont acquises dans le constructeur et libérées dans le destructeur. Garantit la libération même en cas d'exception.",
        "RAII est un pattern uniquement pour la gestion des fichiers.",
        "RAII et smart pointers sont des concepts opposés."
      ],
      "answer": "Resource Acquisition Is Initialization — les ressources sont acquises dans le constructeur et libérées dans le destructeur. Garantit la libération même en cas d'exception.",
      "explanation": "RAII = pas de memory leak, pas de resource leak, exception-safe. `std::lock_guard<mutex>` = RAII pour mutex (unlock garanti). `std::unique_ptr` = RAII pour mémoire. `class DatabaseConnection { Connection* conn; DatabaseConnection() { conn = open(); } ~DatabaseConnection() { conn->close(); } }`. En trading : connexion Bloomberg fermée même si pricing plante. Ordre annulé si exception pendant l'envoi."
    },
    {
      "question": "[C++ Lock-Free] Qu'est-ce que le problème ABA dans les structures lock-free ?",
      "options": [
        "ABA = 'Always Block Atomically' — règle de sécurité pour les atomics.",
        "Un thread lit A, un autre change A→B→A. Le premier thread voit toujours A et pense qu'il n'y a pas eu de changement, mais la structure a été modifiée entre-temps.",
        "ABA est uniquement un problème sur les architectures ARM.",
        "ABA se produit uniquement avec `shared_ptr`."
      ],
      "answer": "Un thread lit A, un autre change A→B→A. Le premier thread voit toujours A et pense qu'il n'y a pas eu de changement, mais la structure a été modifiée entre-temps.",
      "explanation": "Exemple : file lock-free, T1 lit la tête=nœud_A, T2 pop A, push B, pop B, push A (même adresse). T1 CAS réussit car adresse = A, mais le contenu a changé. Solution : tagged pointer (ajouter un compteur de version dans les bits non utilisés du pointeur, garantit l'unicité). `std::atomic<TaggedPtr>` avec alignement 16 bytes sur x86-64."
    },
    {
      "question": "[C++ Object Pool] Pourquoi un object pool est-il préférable à `new`/`delete` répétés en AMM ?",
      "options": [
        "Un object pool est plus simple à implémenter que `new`/`delete`.",
        "L'object pool pré-alloue N objets au démarrage (allocation unique). Pendant la session, get/release = simple manipulation de pointeur (~1ns). Pas de fragmentation, pas de syscall, latence déterministe.",
        "L'object pool utilise moins de mémoire totale.",
        "L'object pool est thread-safe automatiquement."
      ],
      "answer": "L'object pool pré-alloue N objets au démarrage (allocation unique). Pendant la session, get/release = simple manipulation de pointeur (~1ns). Pas de fragmentation, pas de syscall, latence déterministe.",
      "explanation": "Pattern AMM : `OrderPool pool(10000)` au démarrage. `Order* o = pool.acquire()` = pop d'un free-list. `pool.release(o)` = push. Réutilise les mêmes adresses = cache warm = meilleures performances. Implémentation : tableau fixe + stack de pointeurs libres + atomic pour thread-safety. Critique pour tick-to-trade < 1µs."
    },
    {
      "question": "[C++ False Sharing] Qu'est-ce que le false sharing et comment l'éviter ?",
      "options": [
        "False sharing = partage incorrect de shared_ptr entre threads.",
        "Deux threads modifient des variables différentes qui partagent la même cache line (64 bytes) — la cache line est invalidée à chaque modification = ping-pong entre les caches = overhead de 10-100x.",
        "False sharing se produit quand deux threads lisent la même variable.",
        "False sharing = utiliser shared_ptr quand unique_ptr suffit."
      ],
      "answer": "Deux threads modifient des variables différentes qui partagent la même cache line (64 bytes) — la cache line est invalidée à chaque modification = ping-pong entre les caches = overhead de 10-100x.",
      "explanation": "Solution : `alignas(64) std::atomic<int> counter1; alignas(64) std::atomic<int> counter2;` — chaque variable sur sa propre cache line. Ou padding : `struct { std::atomic<int> val; char pad[60]; }`. En AMM : si le thread de pricing et le thread de risk modifient des variables dans la même struct, aligner chaque variable sur 64 bytes."
    },
    {
      "question": "[C++ Garbage-Free] Qu'est-ce que le 'garbage-free programming' en C++ pour le trading ?",
      "options": [
        "Programmer sans commentaires inutiles dans le code.",
        "Programmer sans aucune allocation/désallocation dynamique pendant la session de trading : utiliser object pools, stack allocation, pre-allocated buffers. Zéro appel `new`/`delete` en runtime = latence déterministe.",
        "Utiliser des smart pointers au lieu de pointeurs bruts.",
        "Éviter les variables globales pour réduire les fuites mémoire."
      ],
      "answer": "Programmer sans aucune allocation/désallocation dynamique pendant la session de trading : utiliser object pools, stack allocation, pre-allocated buffers. Zéro appel `new`/`delete` en runtime = latence déterministe.",
      "explanation": "Phases : (1) Warm-up (avant ouverture des marchés) : allouer tous les objets, remplir les caches, établir les connexions. (2) Hot path (session) : zéro allocation, opérations sur des buffers pré-alloués. (3) Cleanup (fin de session) : libérer les ressources. Outils : jemalloc/tcmalloc pour les allocations inévitables, heap profiling pour détecter les allocations cachées (string temporaire, std::function, etc.)."
    },
    // ── LINUX AVANCÉ (Q8–12) ──
    {
      "question": "[Linux strace/perf] Comment diagnostiquer un trading engine qui consomme 100% CPU sans répondre ?",
      "options": [
        "Redémarrer le processus immédiatement.",
        "`perf top -p PID` pour voir les fonctions CPU-intensive. `strace -p PID` pour voir les syscalls. `pstack PID` / `gdb -p PID bt` pour le stack trace. Identifier si c'est une boucle infinie, une attente busy-wait, ou un syscall bloquant.",
        "`kill -9 PID` pour libérer le CPU rapidement.",
        "`nice -n 19 PID` pour baisser la priorité du processus."
      ],
      "answer": "`perf top -p PID` pour voir les fonctions CPU-intensive. `strace -p PID` pour voir les syscalls. `pstack PID` / `gdb -p PID bt` pour le stack trace. Identifier si c'est une boucle infinie, une attente busy-wait, ou un syscall bloquant.",
      "explanation": "Procédure diagnostic : 1) `perf top -p PID` → voir quelle fonction consomme le CPU. 2) `strace -cp PID` → résumé des syscalls avec temps. 3) Si boucle infinie dans le code applicatif → core dump avec `gcore PID`. 4) Si deadlock → `pstack PID` (stack de tous les threads) → voir les threads bloqués sur mutex. Trading : ne jamais tuer sans avoir d'abord vérifié les ordres ouverts."
    },
    {
      "question": "[Linux Réseau] Comment vérifier quels ports un trading engine écoute et ses connexions actives ?",
      "options": [
        "`ping localhost` pour tester les ports.",
        "`ss -tlnp` pour les ports en écoute (TCP). `ss -tnp state established` pour les connexions actives. `netstat -an` (plus vieux, moins rapide).",
        "`lsof /proc/net` pour les connexions réseau.",
        "`ifconfig -a` pour voir tous les ports ouverts."
      ],
      "answer": "`ss -tlnp` pour les ports en écoute (TCP). `ss -tnp state established` pour les connexions actives. `netstat -an` (plus vieux, moins rapide).",
      "explanation": "`ss` (socket statistics) = remplacement moderne de `netstat`. `ss -tlnp` : t=TCP, l=listening, n=numérique (pas de résolution DNS), p=processus. Cas trading : vérifier que le market data feed (port 7788) est bien connecté à Bloomberg, que le FIX engine (port 4200) est connecté au broker. `ss -s` = résumé statistiques sockets."
    },
    {
      "question": "[Linux Scheduling] Pourquoi utiliser `SCHED_FIFO` avec `chrt` pour un thread de trading low-latency ?",
      "options": [
        "Pour que le thread consomme moins de CPU.",
        "`SCHED_FIFO` = politique temps-réel. Le thread ne peut pas être préempté par un thread SCHED_OTHER (normal). Latence de scheduling déterministe, pas de jitter dû aux autres processus. `chrt -f 90 -p PID` — priorité 90.",
        "`SCHED_FIFO` augmente automatiquement la fréquence CPU.",
        "Pour partager le CPU équitablement entre tous les threads."
      ],
      "answer": "`SCHED_FIFO` = politique temps-réel. Le thread ne peut pas être préempté par un thread SCHED_OTHER (normal). Latence de scheduling déterministe, pas de jitter dû aux autres processus. `chrt -f 90 -p PID` — priorité 90.",
      "explanation": "Stack low-latency Linux : `SCHED_FIFO` + CPU affinity (`taskset -c 3 ./engine`) + huge pages (`/proc/sys/vm/nr_hugepages`) + IRQ isolation (`isolcpus=3` dans grub) + NUMA affinity. Résultat : jitter scheduling < 1µs. Sans ces optimisations, l'OS peut préempter le thread de trading pour des tâches kernel, causant des spikes de 100µs+."
    },
    // ── PYTHON AVANCÉ (Q11–18) ──
    {
      "question": "[Python GIL] Pourquoi le GIL Python est-il problématique pour les systèmes de trading parallèles ?",
      "options": [
        "Le GIL empêche l'utilisation de NumPy.",
        "Le GIL (Global Interpreter Lock) n'autorise qu'un seul thread Python à exécuter du bytecode à la fois. Multi-threading Python ne parallélise pas le CPU pour du code pur Python — utiliser multiprocessing, ou des extensions C/C++ (NumPy/Cython libèrent le GIL).",
        "Le GIL ralentit les opérations I/O.",
        "Le GIL n'existe que sur Python 2."
      ],
      "answer": "Le GIL (Global Interpreter Lock) n'autorise qu'un seul thread Python à exécuter du bytecode à la fois. Multi-threading Python ne parallélise pas le CPU pour du code pur Python — utiliser multiprocessing, ou des extensions C/C++ (NumPy/Cython libèrent le GIL).",
      "explanation": "Solutions : (1) `multiprocessing` : plusieurs processus Python, chacun avec son GIL. (2) NumPy/Pandas libèrent le GIL pour les opérations vectorisées → vrai parallélisme. (3) `concurrent.futures.ProcessPoolExecutor` pour CPU-bound. (4) `ThreadPoolExecutor` pour I/O-bound (requests réseau, où le thread dort). Python 3.13+ : expérimental no-GIL mode (free-threaded)."
    },
    {
      "question": "[Python Async] Quelle est la différence entre `threading` et `asyncio` en Python ?",
      "options": [
        "`asyncio` est plus rapide car il utilise plusieurs cœurs CPU.",
        "`threading` : parallélisme préemptif (OS switche les threads). `asyncio` : concurrence coopérative (event loop, yield au I/O). `asyncio` idéal pour I/O-bound (API calls, DB queries) avec moins d'overhead qu'un thread par connexion.",
        "`asyncio` remplace `threading` dans toutes les situations.",
        "`threading` est pour Python 2, `asyncio` pour Python 3 uniquement."
      ],
      "answer": "`threading` : parallélisme préemptif (OS switche les threads). `asyncio` : concurrence coopérative (event loop, yield au I/O). `asyncio` idéal pour I/O-bound (API calls, DB queries) avec moins d'overhead qu'un thread par connexion.",
      "explanation": "Finance use case : `asyncio` pour un aggregateur de prix qui interroge 50 sources simultanément — 50 coroutines sur 1 thread vs 50 threads. `async def get_price(isin): result = await bloomberg_api.get(isin); return result`. `await asyncio.gather(*[get_price(i) for i in isins])` — toutes les requêtes en parallèle."
    }
  ],
  expert: [
    {
      "question": "[Python Dataclass] Quel avantage offre `@dataclass` pour modéliser un Trade ?",
      "options": [
        "`@dataclass` génère automatiquement le code SQL de persistance.",
        "`@dataclass` génère automatiquement `__init__`, `__repr__`, `__eq__` (et optionnellement `__hash__`, `__lt__` avec `order=True`) — moins de boilerplate, immutabilité avec `frozen=True`.",
        "`@dataclass` convertit automatiquement les types.",
        "`@dataclass` est uniquement pour les classes sans méthodes."
      ],
      "answer": "`@dataclass` génère automatiquement `__init__`, `__repr__`, `__eq__` (et optionnellement `__hash__`, `__lt__` avec `order=True`) — moins de boilerplate, immutabilité avec `frozen=True`.",
      "explanation": "`@dataclass(frozen=True) class Trade: isin: str; notional: float; timestamp: datetime` → immuable, hashable, comparable. `@dataclass(order=True)` → génère `__lt__`, `__gt__` pour `sorted()`. Vs `NamedTuple` : dataclass supporte l'héritage, valeurs par défaut, post_init. Finance : `Trade` immuable = thread-safe par construction."
    },
    {
      "question": "[Python Performance] Comment accélérer une boucle Python qui calcule le PnL de 10M trades ?",
      "options": [
        "Utiliser `for i in range(len(trades))` au lieu de `for trade in trades`.",
        "Vectoriser avec NumPy (`np.sum(pnl_array)`), Pandas (`df['pnl'].sum()`), ou Cython/Numba pour le code custom. Éviter les boucles Python pures sur grandes collections.",
        "Augmenter le nombre de threads Python.",
        "Convertir les trades en strings JSON pour accélérer le calcul."
      ],
      "answer": "Vectoriser avec NumPy (`np.sum(pnl_array)`), Pandas (`df['pnl'].sum()`), ou Cython/Numba pour le code custom. Éviter les boucles Python pures sur grandes collections.",
      "explanation": "Boucle Python : ~100ns/itération. NumPy vectorisé : ~1ns/élément (SIMD). Sur 10M éléments : boucle Python = 1 seconde. NumPy = 10ms. Numba `@jit` : compile le code Python en LLVM = vitesse proche du C. Pandas `apply()` = boucle Python déguisée — utiliser les opérations vectorisées natives. Finance : `df['pnl'].groupby(df['desk']).sum()` vs boucle = 100x plus rapide."
    },
    // ── SQL AVANCÉ (Q15–25) ──
    {
      "question": "[SQL Window Functions] Que fait `ROW_NUMBER() OVER (PARTITION BY desk ORDER BY pnl DESC)` ?",
      "options": [
        "Calcule la somme du PnL par desk.",
        "Attribue un numéro de ligne à chaque trade, remis à 1 pour chaque desk (PARTITION BY), numérotant les trades du plus profitable au moins profitable au sein de chaque desk.",
        "Sélectionne le trade avec le PnL maximum par desk.",
        "Trie l'ensemble du tableau par desk puis par PnL."
      ],
      "answer": "Attribue un numéro de ligne à chaque trade, remis à 1 pour chaque desk (PARTITION BY), numérotant les trades du plus profitable au moins profitable au sein de chaque desk.",
      "explanation": "Window function : calcul sur un ensemble de lignes liées sans réduire le nombre de lignes. `ROW_NUMBER()` : numéro unique. `RANK()` : ex-aequo partagent le même rang. `DENSE_RANK()` : sans saut de rang. Finance : `WHERE rn = 1` après ROW_NUMBER → top trade par desk. `LAG(price) OVER (ORDER BY date)` → prix J-1 pour calculer le return journalier."
    },
    {
      "question": "[SQL CTE] Quel avantage offre un CTE (WITH clause) par rapport à une subquery ?",
      "options": [
        "Un CTE est toujours plus performant qu'une subquery.",
        "Le CTE améliore la lisibilité (requête nommée, réutilisable dans la même requête) et peut être récursif (graphes, hiérarchies). Performance similaire à une subquery dans la plupart des SGBD.",
        "Un CTE est mis en cache sur le disque automatiquement.",
        "Un CTE ne peut être utilisé qu'une seule fois dans la requête."
      ],
      "answer": "Le CTE améliore la lisibilité (requête nommée, réutilisable dans la même requête) et peut être récursif (graphes, hiérarchies). Performance similaire à une subquery dans la plupart des SGBD.",
      "explanation": "CTE récursif : `WITH RECURSIVE hierarchy AS (SELECT id, name, manager_id, 0 as level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.manager_id, h.level+1 FROM employees e JOIN hierarchy h ON e.manager_id = h.id) SELECT * FROM hierarchy` — arbre organisationnel complet. Finance : chaîne de garanties, graphe de contreparties liées."
    },
    {
      "question": "[SQL Index Composite] Un index sur `(desk, trade_date)` est-il utilisé pour `WHERE trade_date = '2024-01-15'` ?",
      "options": [
        "Oui, l'index composite est toujours utilisé quelle que soit la colonne filtrée.",
        "Non — un index composite `(desk, trade_date)` est utilisé si le filtre commence par `desk` (leading column rule). Filtrer sur `trade_date` seul ne peut pas utiliser cet index efficacement.",
        "Oui, mais seulement si trade_date est la dernière colonne de l'index.",
        "Cela dépend de la taille de la table."
      ],
      "answer": "Non — un index composite `(desk, trade_date)` est utilisé si le filtre commence par `desk` (leading column rule). Filtrer sur `trade_date` seul ne peut pas utiliser cet index efficacement.",
      "explanation": "Règle du préfixe gauche : `(desk, trade_date)` est utilisé pour : `WHERE desk = 'RATES'`, `WHERE desk = 'RATES' AND trade_date = ...`. Non utilisé pour `WHERE trade_date = ...` seul. Solution : créer un index séparé sur `trade_date` ou inverser `(trade_date, desk)` si le filtre par date est plus fréquent. Finance : analyser les patterns de requête avant de créer les index."
    },
    {
      "question": "[SQL Transactions] Dans une mise à jour de position de trading, pourquoi utiliser une transaction ?",
      "options": [
        "Pour améliorer les performances de mise à jour.",
        "Garantir l'atomicité : `UPDATE position SET quantity = quantity + 100; UPDATE cash SET balance = balance - 100*price` — si la seconde mise à jour échoue, la première est annulée (ROLLBACK). Évite une position incohérente.",
        "Les transactions ne sont utiles que pour les opérations SELECT.",
        "Pour permettre à plusieurs utilisateurs de modifier simultanément."
      ],
      "answer": "Garantir l'atomicité : `UPDATE position SET quantity = quantity + 100; UPDATE cash SET balance = balance - 100*price` — si la seconde mise à jour échoue, la première est annulée (ROLLBACK). Évite une position incohérente.",
      "explanation": "ACID en trading : une position sans le cash correspondant = état incohérent = risque opérationnel. `BEGIN; UPDATE positions ...; UPDATE cash ...; INSERT INTO audit_log ...; COMMIT;` — tout ou rien. En cas de crash après la première UPDATE, le crash recovery (WAL/journalisation) annule la transaction incomplète. Finance : toute modification multi-table doit être dans une transaction."
    },
    {
      "question": "[SQL EXPLAIN] Dans un EXPLAIN ANALYZE, que signifie 'Seq Scan' sur une grande table ?",
      "options": [
        "Seq Scan est le mode le plus performant pour les grandes tables.",
        "Seq Scan = scan séquentiel complet de la table (Full Table Scan). Sur une grande table = lecture de tous les blocs disque = lent. Indique l'absence d'index utilisable ou une sélectivité insuffisante.",
        "Seq Scan = lecture en parallèle sur plusieurs cœurs.",
        "Seq Scan = lecture depuis le cache mémoire uniquement."
      ],
      "answer": "Seq Scan = scan séquentiel complet de la table (Full Table Scan). Sur une grande table = lecture de tous les blocs disque = lent. Indique l'absence d'index utilisable ou une sélectivité insuffisante.",
      "explanation": "Index Scan = bon (utilise un index B-tree). Bitmap Index Scan = bon pour les faibles sélectivités. Seq Scan = acceptable pour les petites tables ou quand >10-20% des lignes sont retournées (index moins efficace). Solutions : créer l'index manquant, réécrire la query pour améliorer la sélectivité, utiliser des partitions. Finance : `EXPLAIN ANALYZE SELECT * FROM trades WHERE trade_date = '2024-01-15'` → si Seq Scan = créer index sur trade_date."
    },
    {
      "question": "[SQL Partitionnement] Pourquoi partitionner une table `trades` de 500M lignes par `trade_date` ?",
      "options": [
        "Le partitionnement réduit automatiquement la taille des données.",
        "Partition pruning : une query `WHERE trade_date = TODAY` ne scanne que la partition du jour (ex: 100K lignes) au lieu des 500M. Maintenance facilitée (archivage, purge par drop de partition). Parallelisme possible sur plusieurs partitions.",
        "Le partitionnement est obligatoire pour les tables > 1M lignes.",
        "Le partitionnement améliore les performances des INSERT."
      ],
      "answer": "Partition pruning : une query `WHERE trade_date = TODAY` ne scanne que la partition du jour (ex: 100K lignes) au lieu des 500M. Maintenance facilitée (archivage, purge par drop de partition). Parallelisme possible sur plusieurs partitions.",
      "explanation": "PostgreSQL : `CREATE TABLE trades PARTITION BY RANGE (trade_date); CREATE TABLE trades_2024_01 PARTITION OF trades FOR VALUES FROM ('2024-01-01') TO ('2024-02-01')`. Archivage : `DROP TABLE trades_2020` = instantané. Sans partition = `DELETE FROM trades WHERE trade_date < '2020-01-01'` sur 500M lignes = heures de lock. Finance : rapport de PnL mensuel = scan d'une seule partition."
    },
    {
      "question": "[C++ Heap Profiling] Comment détecter une allocation cachée dans le hot path d'un market maker ?",
      "options": [
        "Utiliser `valgrind --leak-check=full` pendant la session de trading.",
        "Utiliser `perf record -e malloc` ou un custom allocator qui log chaque allocation. Chercher les sources cachées : `std::string` (SSO overflow), `std::function`, `std::any`, `std::shared_ptr` (control block), exceptions.",
        "Compter manuellement les `new` dans le code source.",
        "Les allocations cachées sont impossibles à détecter sans le code source complet."
      ],
      "answer": "Utiliser `perf record -e malloc` ou un custom allocator qui log chaque allocation. Chercher les sources cachées : `std::string` (SSO overflow), `std::function`, `std::any`, `std::shared_ptr` (control block), exceptions.",
      "explanation": "Sources d'allocations cachées en C++ : (1) `std::string` > 15 chars (SSO déborde sur heap). (2) `std::function` avec closure capturant des objets. (3) `std::shared_ptr` = allocation du control block séparée (solution : `std::make_shared`). (4) `throw exception` = allocation. (5) `std::vector::push_back` au-delà de la capacité. Outil : `-fsanitize=address` en dev, custom overload de `operator new` avec compteur atomique en prod."
    },
    {
      "question": "[Python + C++ Integration] Comment appeler du code C++ depuis Python dans un système de trading hybride ?",
      "options": [
        "C'est impossible — Python et C++ ne peuvent pas communiquer directement.",
        "Pybind11 (le plus moderne, header-only) ou Cython (compile Python-like en C). ctypes/cffi pour les libs C existantes. Le hot path reste en C++, Python orchestre, backteste, analyse les résultats.",
        "Utiliser subprocess pour appeler un exécutable C++ depuis Python.",
        "Compiler Python en C++ avec Transpyler."
      ],
      "answer": "Pybind11 (le plus moderne, header-only) ou Cython (compile Python-like en C). ctypes/cffi pour les libs C existantes. Le hot path reste en C++, Python orchestre, backteste, analyse les résultats.",
      "explanation": "Architecture hybride typique AMM : C++ core (order router, pricing engine, risk calc) expose une API Python via pybind11. Python : backtesting (Pandas/NumPy), calibration des modèles (scipy), reporting (matplotlib), monitoring (scripts). `#include <pybind11/pybind11.h> PYBIND11_MODULE(pricing, m) { m.def(\"price_option\", &priceOption); }` → `import pricing; pricing.price_option(...)` depuis Python."
    },
    {
      "question": "[SQL + Python] Comment charger efficacement 10M trades depuis PostgreSQL vers Pandas ?",
      "options": [
        "`df = pd.read_sql('SELECT * FROM trades', conn)` suffit toujours.",
        "Utiliser `COPY TO STDOUT` (bulk export) + `pd.read_csv()`, ou `pd.read_sql` avec `chunksize` pour itérer par batch, ou `psycopg2` avec `fetchmany()`. Éviter `fetchall()` sur 10M lignes (mémoire).",
        "Exporter en JSON puis charger avec `pd.read_json()`.",
        "Les DataFrames Pandas ne peuvent pas dépasser 1M lignes."
      ],
      "answer": "Utiliser `COPY TO STDOUT` (bulk export) + `pd.read_csv()`, ou `pd.read_sql` avec `chunksize` pour itérer par batch, ou `psycopg2` avec `fetchmany()`. Éviter `fetchall()` sur 10M lignes (mémoire).",
      "explanation": "Stratégies pour gros volumes : (1) `COPY (SELECT ...) TO '/tmp/trades.csv' CSV HEADER` + `pd.read_csv('/tmp/trades.csv')` = 10x plus rapide que JDBC/psycopg2 row-by-row. (2) `pd.read_sql(query, conn, chunksize=100000)` = iterator de DataFrames. (3) PyArrow + Parquet : format columaire, 10x plus compact. Finance : rapport end-of-day sur 10M trades doit finir en < 5 minutes."
    },
    {
      "question": "[C++ constexpr] Quelle est la différence entre `const` et `constexpr` en C++ ?",
      "options": [
        "Ce sont des synonymes depuis C++11.",
        "`const` : valeur constante à l'exécution (ou compile-time si initialisée par une constante). `constexpr` : valeur ou fonction évaluée obligatoirement à la compilation. `constexpr` permet l'optimisation maximale du compilateur.",
        "`constexpr` est uniquement pour les fonctions, `const` pour les variables.",
        "`const` est plus performant que `constexpr` car plus simple."
      ],
      "answer": "`const` : valeur constante à l'exécution (ou compile-time si initialisée par une constante). `constexpr` : valeur ou fonction évaluée obligatoirement à la compilation. `constexpr` permet l'optimisation maximale du compilateur.",
      "explanation": "`constexpr int MAX_ORDERS = 10000;` = constante compile-time. `constexpr double PI = 3.14159265...;`. `constexpr` function : `constexpr int square(int n) { return n*n; }` → évaluée à la compilation si l'argument est connu. AMM : `constexpr size_t RING_BUFFER_SIZE = 1 << 20;` — taille du buffer calculée à la compilation, optimisation du code généré."
    },
    {
      "question": "[C++ Placement New] Qu'est-ce que le 'placement new' et pourquoi est-il utilisé en trading ?",
      "options": [
        "Placement new = créer un objet dans une position spécifique du code source.",
        "Placement new construit un objet dans une mémoire déjà allouée sans appeler l'allocateur système. `new(ptr) Order(args)` construit dans `ptr`. Permet d'utiliser des memory pools pré-alloués sans overhead d'allocation.",
        "Placement new est uniquement pour les tableaux dynamiques.",
        "Placement new est une fonctionnalité dépréciée en C++17."
      ],
      "answer": "Placement new construit un objet dans une mémoire déjà allouée sans appeler l'allocateur système. `new(ptr) Order(args)` construit dans `ptr`. Permet d'utiliser des memory pools pré-alloués sans overhead d'allocation.",
      "explanation": "Object pool avec placement new : `char pool[sizeof(Order) * MAX_ORDERS]; Order* getOrder(int i) { return reinterpret_cast<Order*>(pool + i * sizeof(Order)); } void constructOrder(int i, ...) { new(getOrder(i)) Order(...); }`. Destruction explicite requise : `order->~Order()`. AMM : ring buffer d'ordres entièrement sur mémoire stack ou pre-allocated heap — zéro allocation pendant la session."
    },
    {
      "question": "[C++ Move vs Copy] Dans quel cas C++ choisit-il automatiquement le move constructor plutôt que le copy constructor ?",
      "options": [
        "Jamais — il faut toujours appeler `std::move()` explicitement.",
        "Automatiquement pour les rvalues (temporaires, retours de fonction, `std::move(obj)`). NRVO/RVO permet d'éliminer même le move dans les retours de fonction.",
        "Seulement pour les conteneurs STL.",
        "Uniquement si le copy constructor est supprimé (`= delete`)."
      ],
      "answer": "Automatiquement pour les rvalues (temporaires, retours de fonction, `std::move(obj)`). NRVO/RVO permet d'éliminer même le move dans les retours de fonction.",
      "explanation": "Rvalue = valeur sans nom (temporaire). `vector<Order> getOrders() { vector<Order> v; ...; return v; }` → NRVO élimine la copie, retour direct. `vector<Order> v2 = getOrders();` → move si NRVO échoue. `push_back(Order(args))` → move du temporaire. `push_back(std::move(existingOrder))` → move explicite. Finance : retourner un `vector<Trade>` depuis une fonction par valeur = move implicite, pas de copie."
    },
    {
      "question": "[Linux Kernel] Qu'est-ce qu'un huge page et pourquoi l'utiliser pour un trading engine ?",
      "options": [
        "Huge page = un grand fichier de swap pour économiser la RAM.",
        "Huge page = page mémoire de 2MB au lieu de 4KB standard. Réduit le nombre d'entrées TLB nécessaires pour mapper la mémoire. Moins de TLB misses = moins de latence pour les accès mémoire fréquents sur de grandes zones.",
        "Huge page = allouer plus de mémoire que la RAM disponible.",
        "Huge page n'est disponible que sur les serveurs avec >256GB RAM."
      ],
      "answer": "Huge page = page mémoire de 2MB au lieu de 4KB standard. Réduit le nombre d'entrées TLB nécessaires pour mapper la mémoire. Moins de TLB misses = moins de latence pour les accès mémoire fréquents sur de grandes zones.",
      "explanation": "TLB (Translation Lookaside Buffer) : cache des traductions adresse virtuelle → physique. Taille limitée (~1000 entrées). Avec 4KB pages : 1000 * 4KB = 4MB couverts. Avec 2MB huge pages : 1000 * 2MB = 2GB couverts. Pour un order book de 500MB → huge pages = beaucoup moins de TLB misses. Config : `echo 512 > /proc/sys/vm/nr_hugepages`. `mmap` avec `MAP_HUGETLB`."
    },
    {
      "question": "[Linux CPU Affinity] Pourquoi isoler des CPU cores pour le trading avec `isolcpus` ?",
      "options": [
        "Pour empêcher d'autres processus de voir les données de trading.",
        "Les CPU isolés ne reçoivent pas les interruptions kernel ni le scheduler OS — le thread de trading n'est jamais préempté par le kernel, éliminant le jitter de scheduling (source principale de latence variable).",
        "Pour économiser de l'énergie sur les cores inutilisés.",
        "L'isolation CPU est uniquement utile pour les applications temps-réel certifiées."
      ],
      "answer": "Les CPU isolés ne reçoivent pas les interruptions kernel ni le scheduler OS — le thread de trading n'est jamais préempté par le kernel, éliminant le jitter de scheduling (source principale de latence variable).",
      "explanation": "Stack complète low-latency : `isolcpus=2,3,4,5` dans /etc/default/grub → cores 2-5 exclus du scheduler OS. `taskset -c 2 ./market_maker` → fixer le process sur core 2. `chrt -f 99 -p PID` → priorité temps-réel. `ethtool -C eth0 rx-usecs 0` → désactiver interrupt coalescing. Résultat : latence tail (p99.9) < 2µs au lieu de ~100µs."
    },
    {
      "question": "[Python Descriptors] Qu'est-ce qu'un descripteur Python et comment est-il utilisé en finance ?",
      "options": [
        "Un descripteur est une documentation automatique de classe.",
        "Un descripteur est un objet implémentant `__get__`, `__set__`, `__delete__`. Permet une logique d'accès aux attributs réutilisable. `@property` est un descripteur built-in.",
        "Les descripteurs sont uniquement pour les métaclasses.",
        "Un descripteur est synonyme de décorateur en Python."
      ],
      "answer": "Un descripteur est un objet implémentant `__get__`, `__set__`, `__delete__`. Permet une logique d'accès aux attributs réutilisable. `@property` est un descripteur built-in.",
      "explanation": "Finance : `class PositiveValue: def __set__(self, obj, val): if val < 0: raise ValueError('Must be positive'); obj.__dict__[self.name] = val`. `class Trade: notional = PositiveValue(); price = PositiveValue()` — validation réutilisable sur tous les champs numériques. Plus puissant que `@property` car réutilisable sur plusieurs attributs de plusieurs classes."
    },
    {
      "question": "[Python Metaclasses] Dans quel cas utiliser une métaclasse en Python pour un système financier ?",
      "options": [
        "Les métaclasses sont trop complexes, jamais en production.",
        "Pour valider la structure des classes à la définition (ex: vérifier qu'une classe de stratégie implémente toutes les méthodes requises), enregistrement automatique de plugins, ORM (SQLAlchemy utilise des métaclasses).",
        "Pour remplacer les décorateurs de classe.",
        "Les métaclasses ne fonctionnent qu'avec Python 2."
      ],
      "answer": "Pour valider la structure des classes à la définition (ex: vérifier qu'une classe de stratégie implémente toutes les méthodes requises), enregistrement automatique de plugins, ORM (SQLAlchemy utilise des métaclasses).",
      "explanation": "Cas d'usage réel : `class StrategyMeta(type): def __new__(mcs, name, bases, namespace): if 'compute' not in namespace: raise TypeError(f'{name} doit implémenter compute()'); return super().__new__(...)`. Toute classe héritant de `BaseStrategy` est vérifiée à la définition. Alternative moderne : `__init_subclass__` (plus simple). Finance : ORM Peewee/SQLAlchemy utilisent des métaclasses pour mapper les classes Python aux tables SQL."
    },
    {
      "question": "[SQL Recursive CTE] Comment modéliser une hiérarchie de garanties (collateral) avec un CTE récursif ?",
      "options": [
        "Les CTE récursifs ne peuvent pas modéliser des hiérarchies.",
        "`WITH RECURSIVE chain AS (SELECT id, parent_id, asset FROM collateral WHERE parent_id IS NULL UNION ALL SELECT c.id, c.parent_id, c.asset FROM collateral c JOIN chain ON c.parent_id = chain.id) SELECT * FROM chain` — traverse l'arbre jusqu'aux feuilles.",
        "Utiliser une boucle `WHILE` SQL pour la récursion.",
        "Les hiérarchies en SQL doivent utiliser des triggers."
      ],
      "answer": "`WITH RECURSIVE chain AS (SELECT id, parent_id, asset FROM collateral WHERE parent_id IS NULL UNION ALL SELECT c.id, c.parent_id, c.asset FROM collateral c JOIN chain ON c.parent_id = chain.id) SELECT * FROM chain` — traverse l'arbre jusqu'aux feuilles.",
      "explanation": "Structure CTE récursif : (1) Cas de base (anchor) : lignes sans parent. (2) UNION ALL : jointure récursive jusqu'à épuisement. Finance : graphe de garanties cross-collatéral, hiérarchie légale de contreparties (holding → subsidiaires), cascade de déclencheurs de margin call. Limiter la profondeur : `WHERE level < 10` pour éviter les boucles infinies."
    },
    {
      "question": "[SQL JSONB] PostgreSQL stocke les metadata de trades en JSONB. Comment indexer et requêter efficacement ?",
      "options": [
        "JSONB ne peut pas être indexé — utiliser TEXT à la place.",
        "Index GIN sur la colonne JSONB (`CREATE INDEX ON trades USING GIN (metadata)`). Requête : `WHERE metadata @> '{\"strategy\": \"delta_hedge\"}'` ou `metadata->>'desk' = 'RATES'`. GIN permet la recherche dans les clés/valeurs.",
        "JSONB est automatiquement indexé par PostgreSQL.",
        "Utiliser `LIKE '%strategy%'` pour rechercher dans JSONB."
      ],
      "answer": "Index GIN sur la colonne JSONB (`CREATE INDEX ON trades USING GIN (metadata)`). Requête : `WHERE metadata @> '{\"strategy\": \"delta_hedge\"}'` ou `metadata->>'desk' = 'RATES'`. GIN permet la recherche dans les clés/valeurs.",
      "explanation": "JSONB vs JSON : JSONB stocke en binaire décomposé (indexable, plus rapide à requêter). JSON stocke le texte brut. Opérateurs JSONB : `->` retourne JSON, `->>` retourne text, `@>` contient, `?` clé existe. Index partiel sur path : `CREATE INDEX ON trades ((metadata->>'desk'))`. Finance : stocker les paramètres custom d'un trade sans modifier le schéma."
    },
    {
      "question": "[C++ Coroutines] Qu'apportent les coroutines C++20 pour les systèmes de trading asynchrones ?",
      "options": [
        "Les coroutines C++20 remplacent les threads pour le parallélisme CPU.",
        "Les coroutines permettent d'écrire du code asynchrone I/O en style séquentiel (co_await), sans callback hell, avec overhead minimal. Idéal pour les market data feeds et les requêtes async à plusieurs sources.",
        "Les coroutines C++20 sont uniquement pour les jeux vidéo.",
        "Les coroutines nécessitent un runtime spécial comme Node.js."
      ],
      "answer": "Les coroutines permettent d'écrire du code asynchrone I/O en style séquentiel (co_await), sans callback hell, avec overhead minimal. Idéal pour les market data feeds et les requêtes async à plusieurs sources.",
      "explanation": "`Task<Price> fetchPrice(string isin) { auto data = co_await bloomberg.getAsync(isin); co_return parsePrice(data); }`. Vs callbacks : lisible, debuggable, pas de heap allocation par défaut. Vs threads : pas de context switch OS, stack légère. Finance : agrégateur de prix qui `co_await` 100 sources simultanément sur un seul thread, traitement dans l'ordre de réception."
    },
    {
      "question": "[Linux Networking] Qu'est-ce que le kernel bypass (DPDK/Solarflare) et pourquoi est-il crucial en HFT ?",
      "options": [
        "Le kernel bypass est une technique pour contourner les firewall.",
        "Le kernel bypass permet d'accéder directement à la carte réseau depuis l'espace utilisateur, sans passer par le stack réseau Linux (syscall, interruptions, buffer kernel). Latence réseau : ~100µs avec kernel → ~1µs avec DPDK/OpenOnload.",
        "Le kernel bypass est uniquement pour améliorer la sécurité réseau.",
        "DPDK est un protocole réseau propriétaire."
      ],
      "answer": "Le kernel bypass permet d'accéder directement à la carte réseau depuis l'espace utilisateur, sans passer par le stack réseau Linux (syscall, interruptions, buffer kernel). Latence réseau : ~100µs avec kernel → ~1µs avec DPDK/OpenOnload.",
      "explanation": "Stack réseau kernel : NIC → interrupt → kernel → socket buffer → application. Latence totale ~50-200µs. DPDK/Solarflare OpenOnload : NIC → application directement (polling). Latence ~1-5µs. Techniques complémentaires : RDMA (Remote Direct Memory Access) pour communication inter-serveurs sans CPU. Multicast pour market data (un paquet reçu par N applications simultanément)."
    },
    {
      "question": "[Python Protocol] Quelle est la différence entre une Abstract Base Class (ABC) et un Protocol en Python ?",
      "options": [
        "ABC et Protocol sont synonymes depuis Python 3.8.",
        "ABC (héritage nominal) : la classe doit hériter explicitement de l'ABC. Protocol (duck typing structurel) : toute classe implémentant les méthodes requises est conforme, sans héritage. Protocols = typing statique sans couplage de classe.",
        "Protocol est uniquement pour les annotations de type, sans effet à l'exécution.",
        "ABC est plus performant que Protocol."
      ],
      "answer": "ABC (héritage nominal) : la classe doit hériter explicitement de l'ABC. Protocol (duck typing structurel) : toute classe implémentant les méthodes requises est conforme, sans héritage. Protocols = typing statique sans couplage de classe.",
      "explanation": "`class Priceable(Protocol): def price(self) -> float: ...`. N'importe quelle classe avec une méthode `price() -> float` satisfait le Protocol sans hériter. Vérification par mypy/pyright. Finance : `class Bond: def price(self) -> float: return ...` satisfait `Priceable` sans `class Bond(Priceable)`. Avantage : intégrer des librairies tierces dans votre système de types."
    },
    {
      "question": "[SQL Materialized Views] Quand utiliser une materialized view plutôt qu'une view ordinaire pour le PnL reporting ?",
      "options": [
        "Toujours — les materialized views sont toujours meilleures.",
        "Materialized view quand la requête est coûteuse (agrégation de 100M trades) et les données peuvent être légèrement stales (refresh toutes les 5 minutes). View ordinaire quand les données doivent être temps-réel.",
        "Materialized views ne supportent pas les JOINs.",
        "Views ordinaires ne peuvent pas utiliser GROUP BY."
      ],
      "answer": "Materialized view quand la requête est coûteuse (agrégation de 100M trades) et les données peuvent être légèrement stales (refresh toutes les 5 minutes). View ordinaire quand les données doivent être temps-réel.",
      "explanation": "`CREATE MATERIALIZED VIEW mv_daily_pnl AS SELECT desk, SUM(pnl) FROM trades GROUP BY desk;`. `REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_pnl;` — refresh sans lock. Index sur la materialized view = performances optimales. Finance : rapport PnL par desk recalculé toutes les 5 minutes au lieu de chaque fois qu'un trader consulte le dashboard."
    },
    {
      "question": "[C++ Template Specialization] Qu'est-ce que la spécialisation partielle de template et son utilité en finance ?",
      "options": [
        "La spécialisation partielle n'existe pas en C++.",
        "Fournir une implémentation différente d'un template pour un sous-ensemble de types. `template<typename T> class Serializer<std::vector<T>>` — comportement spécialisé pour les vectors. Optimisations type-spécifiques à la compilation.",
        "La spécialisation partielle ralentit la compilation.",
        "La spécialisation partielle est uniquement pour les fonctions, pas les classes."
      ],
      "answer": "Fournir une implémentation différente d'un template pour un sous-ensemble de types. `template<typename T> class Serializer<std::vector<T>>` — comportement spécialisé pour les vectors. Optimisations type-spécifiques à la compilation.",
      "explanation": "Finance : `template<typename Instrument> struct PricingTraits;` → spécialisations : `template<> struct PricingTraits<Bond> { using Model = DCFModel; static constexpr bool needsYieldCurve = true; };` `template<> struct PricingTraits<Option> { using Model = BSModel; static constexpr bool needsVolSurface = true; };`. Le moteur de pricing sélectionne automatiquement le bon modèle à la compilation selon le type d'instrument."
    },
    {
      "question": "[Linux Profiling] Quelle est la différence entre `perf stat` et `perf record` pour analyser un trading engine ?",
      "options": [
        "Ce sont des synonymes.",
        "`perf stat` : statistiques CPU globales (cache misses, branch mispredictions, IPC) sur toute l'exécution. `perf record` : échantillonnage des call stacks pendant l'exécution → `perf report` identifie les fonctions hot.",
        "`perf stat` est pour les processus, `perf record` pour les threads.",
        "`perf record` nécessite les droits root, `perf stat` non."
      ],
      "answer": "`perf stat` : statistiques CPU globales (cache misses, branch mispredictions, IPC) sur toute l'exécution. `perf record` : échantillonnage des call stacks pendant l'exécution → `perf report` identifie les fonctions hot.",
      "explanation": "`perf stat -e cache-misses,cache-references,branch-misses ./engine` → ratio de cache miss. `perf record -g -p PID sleep 30` → sample 30 secondes. `perf report --sort=dso,sym` → flamegraph. Interpréter : IPC < 1 = memory-bound. Beaucoup de cache misses = mauvaise locality. Flamegraph plat = beaucoup de fonctions = difficile à optimiser. Finance : identifier si le pricing ou le risk engine est le bottleneck."
    },
    {
      "question": "[Python Type Hints] Quelle est l'utilité des type hints Python en environnement de trading d'équipe ?",
      "options": [
        "Les type hints ralentissent l'exécution Python.",
        "Type hints = documentation exécutable (mypy, pyright détectent les erreurs à la compilation). Autocomplétion IDE précise. `def price(instrument: Instrument, curve: YieldCurve) -> float` — contrat clair. Catch des bugs avant l'exécution.",
        "Les type hints sont uniquement pour les débutants Python.",
        "Python ignore complètement les type hints à l'exécution."
      ],
      "answer": "Type hints = documentation exécutable (mypy, pyright détectent les erreurs à la compilation). Autocomplétion IDE précise. `def price(instrument: Instrument, curve: YieldCurve) -> float` — contrat clair. Catch des bugs avant l'exécution.",
      "explanation": "Python ignore les hints à l'exécution (pas de coût) mais mypy/pyright les vérifient statiquement. `from typing import Optional, List, Dict, Union, TypeVar, Generic`. `List[Trade]`, `Dict[str, float]`, `Optional[Price]` (= `Price | None`). Finance : `def calculate_var(portfolio: Portfolio, confidence: float = 0.95) -> VaRResult` — interface claire, erreur si on passe un float au lieu d'un Portfolio."
    },
    {
      "question": "[SQL Advisory Locks] Comment utiliser les advisory locks PostgreSQL pour éviter le double-processing d'un batch de trades ?",
      "options": [
        "PostgreSQL n'a pas de mécanisme de locking applicatif.",
        "`SELECT pg_try_advisory_lock(batch_id)` — retourne true si le lock est acquis, false si déjà pris. Permet à plusieurs instances de s'éviter mutuellement sans modifier les tables. `pg_advisory_unlock()` pour libérer.",
        "Utiliser `LOCK TABLE trades IN EXCLUSIVE MODE` pour éviter le double-processing.",
        "Les advisory locks sont réservés aux superusers PostgreSQL."
      ],
      "answer": "`SELECT pg_try_advisory_lock(batch_id)` — retourne true si le lock est acquis, false si déjà pris. Permet à plusieurs instances de s'éviter mutuellement sans modifier les tables. `pg_advisory_unlock()` pour libérer.",
      "explanation": "Cas d'usage : plusieurs instances du rapport EOD démarrent simultanément. `IF NOT pg_try_advisory_lock(42) THEN RAISE NOTICE 'Already running'; RETURN; END IF;` — seulement une instance s'exécute. Session-level : lock libéré si la connexion se ferme (failsafe). Transaction-level : `pg_try_advisory_xact_lock()` libéré au COMMIT/ROLLBACK. Finance : éviter le double-calcul de PnL, le double-envoi de rapports réglementaires."
    },
    {
      "question": "[C++ CRTP] Qu'est-ce que le CRTP (Curiously Recurring Template Pattern) et son avantage en trading ?",
      "options": [
        "CRTP est un design pattern uniquement pour les UI frameworks.",
        "CRTP : `template<typename Derived> class Base { void method() { static_cast<Derived*>(this)->impl(); } }`. Polymorphisme statique (compile-time) : zéro overhead vtable, fonctions inline, performances maximales.",
        "CRTP remplace l'héritage multiple en C++.",
        "CRTP n'est disponible qu'en C++20."
      ],
      "answer": "CRTP : `template<typename Derived> class Base { void method() { static_cast<Derived*>(this)->impl(); } }`. Polymorphisme statique (compile-time) : zéro overhead vtable, fonctions inline, performances maximales.",
      "explanation": "Vs virtual dispatch : vtable = indirect call = ~5ns + branch misprediction. CRTP = direct call résolu à la compilation = 0 overhead + inlining. Finance : `template<typename Derived> class Instrument { double price() { return static_cast<Derived*>(this)->computePrice(); } }` → `class Bond : public Instrument<Bond>`. Chaque `bond.price()` = appel direct à `Bond::computePrice()`. Sur millions de calculs par seconde, la différence est significative."
    },
    {
      "question": "[Python __slots__] Pourquoi utiliser `__slots__` dans une classe Python représentant un Trade ?",
      "options": [
        "`__slots__` ajoute des méthodes automatiquement à la classe.",
        "`__slots__ = ['isin', 'notional', 'price']` : supprime le `__dict__` par instance → économise ~200 bytes/instance, accès attributs légèrement plus rapide. Essentiel pour des millions d'instances.",
        "`__slots__` empêche la création de nouvelles instances.",
        "`__slots__` est uniquement pour les classes immuables."
      ],
      "answer": "`__slots__ = ['isin', 'notional', 'price']` : supprime le `__dict__` par instance → économise ~200 bytes/instance, accès attributs légèrement plus rapide. Essentiel pour des millions d'instances.",
      "explanation": "Sans `__slots__` : chaque instance a un `__dict__` (dictionnaire hash) = ~232 bytes overhead. Avec `__slots__` : attributs stockés directement = ~56 bytes. Sur 1M trades : sans = 232MB overhead. Avec = 56MB. Bonus : empêche l'ajout d'attributs non déclarés (protection contre les typos). Limitation : pas de `__dict__`, héritage complexe. Finance : `class MarketDataTick` avec `__slots__` pour un cache de millions de ticks."
    },
    {
      "question": "[Linux Huge Pages Transparent] Quelle est la différence entre Transparent Huge Pages (THP) et Explicit Huge Pages en trading ?",
      "options": [
        "Il n'y a pas de différence pratique.",
        "THP : activé par défaut, l'OS consolide automatiquement les pages en 2MB. Problème : la consolidation se fait en background → latency spikes imprévisibles. Explicit : `mmap(MAP_HUGETLB)` = contrôle total, pas de consolidation async.",
        "THP est plus performant que les explicit huge pages.",
        "THP est uniquement pour les bases de données."
      ],
      "answer": "THP : activé par défaut, l'OS consolide automatiquement les pages en 2MB. Problème : la consolidation se fait en background → latency spikes imprévisibles. Explicit : `mmap(MAP_HUGETLB)` = contrôle total, pas de consolidation async.",
      "explanation": "En production HFT : `echo never > /sys/kernel/mm/transparent_hugepage/enabled` — désactiver THP. `echo never > /sys/kernel/mm/transparent_hugepage/defrag`. Utiliser explicit huge pages pour les zones critiques (order book, ring buffers). THP + khugepaged (démon de consolidation) = source de latency jitter de 1-10ms périodiques. Inacceptable pour tick-to-trade."
    },
    {
      "question": "[Python asyncio] Comment implémenter un agregateur de prix qui surveille 100 ISINs simultanément avec asyncio ?",
      "options": [
        "Créer 100 threads, un par ISIN.",
        "`asyncio.gather(*[fetch_price(isin) for isin in isins])` — lance 100 coroutines concurrentes sur un seul thread. `aiohttp` pour les requêtes HTTP async. `asyncio.wait_for(coro, timeout=0.1)` pour les timeouts.",
        "Utiliser `multiprocessing.Pool(100)` pour 100 processus parallèles.",
        "asyncio ne supporte pas plus de 10 coroutines simultanées."
      ],
      "answer": "`asyncio.gather(*[fetch_price(isin) for isin in isins])` — lance 100 coroutines concurrentes sur un seul thread. `aiohttp` pour les requêtes HTTP async. `asyncio.wait_for(coro, timeout=0.1)` pour les timeouts.",
      "explanation": "`async def main(): prices = await asyncio.gather(*[fetch_price(isin) for isin in isins], return_exceptions=True)`. `return_exceptions=True` : les exceptions ne stoppent pas les autres coroutines. `asyncio.as_completed()` : traiter les résultats dans l'ordre d'arrivée. Finance : pricing 100 options en parallèle via API REST, chaque requête ~50ms → total ~50ms au lieu de 5 secondes séquentiel."
    },
    {
      "question": "[C++ Sanitizers] Quels sanitizers compiler activer en développement d'un trading engine C++ ?",
      "options": [
        "Les sanitizers ralentissent trop le code pour être utiles.",
        "AddressSanitizer (`-fsanitize=address`) : buffer overflows, use-after-free. ThreadSanitizer (`-fsanitize=thread`) : data races. UBSanitizer (`-fsanitize=undefined`) : comportements indéfinis. Indispensables en CI.",
        "Uniquement valgrind — les sanitizers sont moins précis.",
        "Les sanitizers sont uniquement disponibles sur clang, pas gcc."
      ],
      "answer": "AddressSanitizer (`-fsanitize=address`) : buffer overflows, use-after-free. ThreadSanitizer (`-fsanitize=thread`) : data races. UBSanitizer (`-fsanitize=undefined`) : comportements indéfinis. Indispensables en CI.",
      "explanation": "Workflow dev : (1) Dev local : `-fsanitize=address,undefined` → catch les bugs à l'exécution. (2) Tests multi-thread : `-fsanitize=thread` → détecter les data races que valgrind manque. (3) Production : build sans sanitizers (overhead 2-10x). ASan détecte les accès mémoire invalides immédiatement. TSan détecte les race conditions même peu probables. Finance : un buffer overflow dans l'order router = possible corruptions silencieuses de prix."
    },
    {
      "question": "[SQL Time-Series] Comment stocker et requêter efficacement des tick data (prix toutes les millisecondes) en PostgreSQL ?",
      "options": [
        "Une table normale `CREATE TABLE ticks (ts TIMESTAMP, price FLOAT)` suffit.",
        "Partitionnement par range de temps (par jour/heure). Extension TimescaleDB pour compression automatique et fonctions time-series (`time_bucket`, `first/last`). Index BRIN (block range) plus compact que B-tree pour les timestamps croissants.",
        "Stocker les ticks en JSON dans une colonne TEXT.",
        "PostgreSQL ne peut pas stocker des données haute fréquence."
      ],
      "answer": "Partitionnement par range de temps (par jour/heure). Extension TimescaleDB pour compression automatique et fonctions time-series (`time_bucket`, `first/last`). Index BRIN (block range) plus compact que B-tree pour les timestamps croissants.",
      "explanation": "TimescaleDB : `SELECT time_bucket('1 minute', ts) as bucket, first(price, ts), last(price, ts), max(price), min(price) FROM ticks WHERE isin='BNPP.PA' AND ts > NOW() - INTERVAL '1 day' GROUP BY bucket ORDER BY bucket`. BRIN index : ~100x plus petit qu'un B-tree pour les données temporelles croissantes. Compression TimescaleDB : ratio 10-20x. Finance : 1M ticks/jour par ISIN × 500 ISINs = 500M ticks/jour → TimescaleDB gère plusieurs TB."
    },
    {
      "question": "[C++ Concepts (C++20)] Qu'apportent les Concepts C++20 pour les systèmes de trading ?",
      "options": [
        "Les Concepts remplacent l'héritage en C++20.",
        "Les Concepts = contraintes sur les paramètres de template, vérifiées à la compilation. `concept Priceable = requires(T t) { { t.price() } -> std::convertible_to<double>; }`. Erreurs de template lisibles, interfaces documentées.",
        "Les Concepts sont uniquement pour les algorithmes STL.",
        "Les Concepts sont une fonctionnalité expérimentale non disponible en production."
      ],
      "answer": "Les Concepts = contraintes sur les paramètres de template, vérifiées à la compilation. `concept Priceable = requires(T t) { { t.price() } -> std::convertible_to<double>; }`. Erreurs de template lisibles, interfaces documentées.",
      "explanation": "`template<Priceable T> double markToMarket(const T& instrument) { return instrument.price() * quantity; }`. Sans Concepts : erreur template illisible. Avec Concepts : `error: T does not satisfy Priceable`. Finance : `concept RiskMeasure = requires(T rm, Portfolio p) { { rm.compute(p) } -> std::same_as<RiskResult>; }`. Documentation as code, sécurité de type maximale."
    },
    {
      "question": "[Python Caching] Comment implémenter un cache LRU pour les prix Bloomberg en Python ?",
      "options": [
        "Utiliser un dictionnaire Python standard avec une liste de keys.",
        "`from functools import lru_cache; @lru_cache(maxsize=1000)` ou `@cache` (Python 3.9+). Pour les méthodes d'instance : utiliser `functools.cached_property` ou `cachetools.TTLCache` pour les caches avec expiration.",
        "Le cache LRU n'est pas disponible en Python standard.",
        "Utiliser `@staticmethod` avec un dict global."
      ],
      "answer": "`from functools import lru_cache; @lru_cache(maxsize=1000)` ou `@cache` (Python 3.9+). Pour les méthodes d'instance : utiliser `functools.cached_property` ou `cachetools.TTLCache` pour les caches avec expiration.",
      "explanation": "`@lru_cache(maxsize=1000)` : Least Recently Used, thread-safe, intégré. `@cache` = `@lru_cache(maxsize=None)` (unbounded). Finance : `@lru_cache(maxsize=500) def get_yield_curve(currency, date): return bloomberg.fetch(...)` — courbes de taux cachées. `cachetools.TTLCache(maxsize=1000, ttl=60)` : cache expirant toutes les 60 secondes = prix rafraîchis régulièrement."
    },
    {
      "question": "[SQL Deadlock] Comment éviter les deadlocks dans une base de données de trading avec mises à jour concurrentes ?",
      "options": [
        "Les deadlocks sont impossibles si on utilise des transactions courtes.",
        "Toujours acquérir les locks dans le même ordre (ex: toujours mettre à jour position avant cash). Utiliser `SELECT ... FOR UPDATE` avec un timeout. Réduire la durée des transactions. `NOWAIT` ou `SKIP LOCKED` pour les workers concurrents.",
        "Utiliser des triggers pour éviter les accès concurrents.",
        "Augmenter le timeout de transaction résout les deadlocks."
      ],
      "answer": "Toujours acquérir les locks dans le même ordre (ex: toujours mettre à jour position avant cash). Utiliser `SELECT ... FOR UPDATE` avec un timeout. Réduire la durée des transactions. `NOWAIT` ou `SKIP LOCKED` pour les workers concurrents.",
      "explanation": "Deadlock classique : T1 lock A puis B, T2 lock B puis A → deadlock. Solution : ordre total sur les ressources. `SELECT * FROM trades WHERE id = 42 FOR UPDATE NOWAIT` → échoue immédiatement si verrouillé au lieu d'attendre. `SKIP LOCKED` : `SELECT * FROM queue WHERE status='PENDING' FOR UPDATE SKIP LOCKED LIMIT 1` — pattern worker queue sans deadlock. Finance : file de trades à traiter par plusieurs workers."
    },
    {
      "question": "[Linux + Trading] Qu'est-ce que le 'warm-up' d'un trading engine avant l'ouverture des marchés ?",
      "options": [
        "Augmenter la température du serveur pour de meilleures performances.",
        "Phase d'initialisation avant la session : pré-allouer tous les objets (memory pools), remplir les caches CPU (exécuter les chemins chauds), établir les connexions (FIX, Bloomberg), charger les référentiels en RAM, calibrer les CPU clocks (turbo boost). But : zéro cold-start latency pendant la session.",
        "Warm-up = redémarrer le serveur pour libérer la mémoire.",
        "Warm-up = tester le système avec des données réelles avant d'aller en production."
      ],
      "answer": "Phase d'initialisation avant la session : pré-allouer tous les objets (memory pools), remplir les caches CPU (exécuter les chemins chauds), établir les connexions (FIX, Bloomberg), charger les référentiels en RAM, calibrer les CPU clocks (turbo boost). But : zéro cold-start latency pendant la session.",
      "explanation": "Activités warm-up (T-30min avant ouverture) : (1) Allocation mémoire : `orderPool.preallocate(100000)`. (2) Cache warm-up : exécuter le hot path avec des ordres fictifs pour remplir l'i-cache et le d-cache. (3) JIT-free : tout le code C++ est déjà compilé, mais les branches prédicteur apprennent. (4) Connexions : FIX sessions établies et heartbeating. (5) Référentiels : ISINs, counterparties chargés depuis Oracle en mémoire. Résultat : premier vrai ordre traité en < 1µs."
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

const Page6_TechInterview = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
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
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
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
      } else handleNextQuestion();
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
      }, 25000);
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

export default Page6_TechInterview;


