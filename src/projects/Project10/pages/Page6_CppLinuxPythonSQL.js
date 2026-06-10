// src/projects/Project3/pages/Page6_CppLinuxPythonSQL.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  // ── C++ FONDAMENTAUX ──
  {
    "question": "Pointeurs vs Références — C++ Fondamentaux",
    "answer": "**Pointeur** : variable qui contient une adresse mémoire. Peut être `nullptr`, réassignable, arithmétique possible. `int* p = &x;` ◆ **Référence** : alias vers une variable existante. Ne peut pas être `nullptr`, non réassignable après initialisation. `int& r = x;` ◆ **Règle d'usage** : référence quand la valeur existe toujours, pointeur quand nullité possible ou réassignation nécessaire. ◆ **Const correctness** : `const T*` = pointeur vers T immuable. `T* const` = pointeur immuable vers T mutable. `const T&` = référence vers T immuable (passage de gros objets sans copie). ◆ **En trading** : passer les Market Data en `const Quote&` évite les copies inutiles."
  },
  {
    "question": "Const Correctness — C++ Production",
    "answer": "**`const` après une méthode** : `double getPrice() const;` → la méthode ne modifie pas l'état de l'objet. Permet d'appeler la méthode sur un objet `const`. ◆ **Pourquoi important** : interface claire (lecture vs écriture), permet le passage en `const&`, détecte les bugs à la compilation. ◆ **Règle** : toute méthode qui ne modifie pas l'état doit être `const`. ◆ **Cas trading** : `double OrderBook::getBestBid() const;` — garantit que lire le meilleur bid ne modifie pas l'order book. ◆ **Piège** : un membre `mutable` peut être modifié même dans une méthode `const` (ex: cache interne)."
  },
  {
    "question": "Copie Profonde vs Superficielle — C++",
    "answer": "**Copy constructor** : appelé lors de la copie d'un objet. Par défaut, copie membre par membre. ◆ **Copie superficielle (shallow)** : copie les pointeurs — deux objets partagent la même mémoire. Dangereux : double-free à la destruction. ◆ **Copie profonde (deep)** : alloue une nouvelle mémoire et copie le contenu. `new int[size]` dans le copy constructor. ◆ **Règle des 5** : si tu définis un destructeur, définis aussi copy constructor, copy assignment, move constructor, move assignment. ◆ **En trading** : une `PriceFeed` avec un buffer dynamique nécessite une copie profonde pour éviter des corruptions mémoire."
  },
  {
    "question": "Stack vs Heap — Performance C++ Trading",
    "answer": "**Stack** : allocation automatique, durée de vie liée au scope, très rapide (décrément de SP). Taille limitée (~1-8 MB). ◆ **Heap** : `new`/`delete`, durée de vie contrôlée manuellement, plus lent (malloc interne), fragmentation possible. ◆ **Pourquoi éviter `new` en trading** : allocation dynamique = appel système potentiel, latence non déterministe, risque de memory leak. ◆ **Alternatives** : stack allocation, object pool pré-alloué, `std::array` au lieu de `std::vector` pour tailles fixes. ◆ **Garbage-free programming** : ne pas allouer/désallouer en runtime — tout alloué au démarrage, réutilisé pendant la session."
  },
  {
    "question": "Smart Pointers — unique_ptr / shared_ptr / weak_ptr",
    "answer": "**`unique_ptr`** : propriété exclusive. Destruction automatique à la sortie du scope. Pas de copie possible, seulement `move`. Coût zéro overhead. ◆ **`shared_ptr`** : propriété partagée via compteur de références. Destruction quand compteur = 0. ◆ **`weak_ptr`** : observateur sans propriété — ne prévient pas la destruction. Casse les cycles de références. ◆ **Danger `shared_ptr`** : cycle A → B → A = les deux ne sont jamais détruits = memory leak. Détecter avec `weak_ptr`. ◆ **En trading** : préférer `unique_ptr` (zéro overhead). `shared_ptr` uniquement si propriété partagée réelle. Éviter en hot path (compteur de références = opération atomique = coût)."
  },
  {
    "question": "Cache Locality — Performance Mémoire C++",
    "answer": "**Principe** : le CPU charge la mémoire par blocs (cache lines, ~64 bytes). Accès contigus = cache hits = très rapide. Accès épars = cache misses = 100-200x plus lent. ◆ **`std::vector` vs `std::list`** : vector = mémoire contiguë = excellent cache locality. list = nœuds épars dans la heap = cache miss à chaque nœud. Même pour des insertions, vector est souvent plus rapide grâce au cache. ◆ **En AMM trading** : order book stocké en vector trié = balayage rapide pour trouver le meilleur prix. Structure of Arrays (SoA) plutôt qu'Array of Structures (AoS) pour les calculs vectorisés. ◆ **Règle** : pour les hot paths, toujours mesurer avec perf ou valgrind --cachegrind."
  },
  // ── C++ LOW LATENCY ──
  {
    "question": "Multithreading — Race Condition & Mutex",
    "answer": "**Race condition** : deux threads accèdent au même objet simultanément, au moins un en écriture, sans synchronisation. Comportement indéfini (undefined behavior). ◆ **`std::mutex`** : verrou exclusif. `lock()` / `unlock()`. ◆ **`std::lock_guard`** : RAII wrapper sur mutex — déverrouille automatiquement à la sortie du scope. ◆ **`std::atomic<T>`** : opération atomique sans mutex pour types simples (int, bool, pointer). Plus léger qu'un mutex. ◆ **Mutex vs Atomic** : atomic pour compteurs/flags simples. Mutex pour sections critiques complexes (modification de plusieurs variables ensemble). ◆ **En trading** : order book partagé entre threads de réception et d'exécution — mutex ou lock-free data structure."
  },
  {
    "question": "STL — Containers et Complexité",
    "answer": "**`std::vector`** : tableau dynamique contigu. `push_back` amortized O(1). `find` O(n). ◆ **`std::map`** : arbre rouge-noir trié. `find`/`insert`/`erase` O(log n). Clés toujours triées. ◆ **`std::unordered_map`** : table de hachage. `find`/`insert` O(1) moyen, O(n) pire cas. Pas d'ordre garanti. ◆ **`std::list`** : liste doublement chaînée. `insert`/`erase` O(1) si iterator. `find` O(n). Mauvais cache. ◆ **`std::deque`** : double-ended queue. `push_front`/`push_back` O(1). Accès O(1). ◆ **Choix AMM** : `unordered_map` pour lookup prix par ISIN. `vector` pour listes d'ordres. `map` si ordre trié nécessaire (order book par prix)."
  },
  // ── LINUX ──
  {
    "question": "Commandes Linux — Essentielles",
    "answer": "**`ls`** : liste le contenu d'un répertoire. `ls -l` : format long (permissions, taille, date). `ls -la` : inclut les fichiers cachés. ◆ **`head`** : affiche les N premières lignes d'un fichier (défaut: 10). `head -n 20 file.log`. ◆ **`tail`** : affiche les N dernières lignes. `tail -f file.log` : suit le fichier en temps réel — indispensable pour surveiller les logs en production trading. ◆ **`grep`** : recherche de pattern. `grep 'ERROR' app.log`. `grep -v 'DEBUG'` : exclut les lignes avec DEBUG. `grep -r 'pattern' ./` : récursif. ◆ **`ps aux`** : liste tous les processus avec PID, CPU, mémoire. `pgrep nom` : retourne le PID directement."
  },
  {
    "question": "Permissions Linux — chmod",
    "answer": "**Format** : `rwxrwxrwx` = propriétaire | groupe | autres. ◆ **Valeurs** : r(read)=4, w(write)=2, x(execute)=1. ◆ **Décomposition** : 7=rwx(4+2+1), 6=rw-(4+2), 5=r-x(4+1), 4=r--(4), 0=---. ◆ **chmod 755** : propriétaire rwx(7), groupe r-x(5), autres r-x(5) — typique pour les exécutables. ◆ **chmod 644** : propriétaire rw-(6), groupe r--(4), autres r--(4) — typique pour les fichiers de config. ◆ **chmod 777** : tout le monde peut tout faire — dangereux en production. ◆ **`chown user:group file`** : change le propriétaire. `sudo` nécessaire pour changer d'autres propriétaires."
  },
  {
    "question": "Redirection & Pipes — Linux",
    "answer": "**`>`** : redirige la sortie vers un fichier, **écrase** le contenu existant. `ls > liste.txt`. ◆ **`>>`** : redirige la sortie, **ajoute** à la fin du fichier. `echo 'log' >> app.log`. ◆ **`|` (pipe)** : envoie la sortie d'une commande en entrée de la suivante. `ps aux | grep trading_engine`. ◆ **`2>`** : redirige stderr. `./script 2> errors.txt`. ◆ **`2>&1`** : redirige stderr vers stdout. `./script > all.log 2>&1`. ◆ **En trading/prod** : `tail -f app.log | grep 'FILL'` — surveiller les fills en temps réel. `./engine >> session.log 2>&1 &` — lancer en arrière-plan avec logs."
  },
  {
    "question": "Processus & Threads — Linux",
    "answer": "**Processus** : instance d'un programme en exécution. Espace mémoire propre (isolation totale). Communication via IPC (pipes, sockets, shared memory). Création coûteuse (fork). ◆ **Thread** : unité d'exécution dans un processus. Partage la mémoire du processus. Création légère. Communication directe (mais risque de race conditions). ◆ **`ps aux`** : liste les processus. Colonnes : PID, %CPU, %MEM, COMMAND. ◆ **`pgrep trading_engine`** : trouve le PID. `kill PID` : envoie SIGTERM. `kill -9 PID` : SIGKILL (force). ◆ **`top` / `htop`** : monitoring temps réel CPU/mémoire par processus. ◆ **En trading** : engine de market data = processus séparé. Threads pour les différentes stratégies dans un même engine."
  },
  // ── PYTHON ──
  {
    "question": "Python — Types de Données Fondamentaux",
    "answer": "**Liste `[]`** : mutable, ordonnée, indexable, doublons autorisés. `[1, 2, 3]`. ◆ **Tuple `()`** : immuable, ordonné, indexable. `(1, 2, 3)`. Plus rapide que liste, hashable (utilisable comme clé de dict). ◆ **Set `{}`** : mutable, non ordonné, pas de doublons, O(1) pour `in`. `{1, 2, 3}`. ⚠️ `{}` crée un dict, pas un set vide — utiliser `set()`. ◆ **Dict `{k: v}`** : mutable, clés uniques et hashables, O(1) lookup depuis Python 3.7+ ordonné par insertion. ◆ **Règle** : tuple pour données fixes (coordonnées, RGBA), liste pour collections modifiables, set pour unicité/appartenance, dict pour mapping."
  },
  {
    "question": "Python — POO et Méthodes Magiques",
    "answer": "**`__init__`** : constructeur, appelé à la création de l'instance. ◆ **`__str__`** : appelé par `str(obj)` et `print(obj)` — représentation lisible pour l'utilisateur. ◆ **`__repr__`** : appelé par `repr(obj)` — représentation non ambiguë pour les développeurs. ◆ **`__len__`** : appelé par `len(obj)`. ◆ **`__eq__`** : définit `==`. ◆ **`__lt__`, `__gt__`** : comparaisons pour tri. ◆ **`self`** : référence à l'instance courante (convention, pas un mot-clé). ◆ **Exemple trading** : `class Trade: def __init__(self, isin, qty, price): ...` `def __repr__(self): return f'Trade({self.isin}, {self.qty}@{self.price})'`"
  },
  {
    "question": "Python — Fonctions Utilitaires",
    "answer": "**`map(func, iterable)`** : applique une fonction à chaque élément. `list(map(lambda x: x*2, [1,2,3]))` → `[2,4,6]`. Lazy evaluation (itérateur). ◆ **`filter(func, iterable)`** : garde les éléments où func retourne True. `list(filter(lambda x: x>0, [-1,2,-3,4]))` → `[2,4]`. ◆ **`zip(a, b)`** : combine deux itérables élément par élément. ◆ **Compréhension de liste** : `[x**2 for x in range(10) if x%2==0]` — plus lisible que map/filter. ◆ **`sorted(iterable, key=..., reverse=...)`** : tri sans modification. `sort()` trie en place. ◆ **En trading** : `sorted(trades, key=lambda t: t.price, reverse=True)` — trier les trades par prix décroissant."
  },
  {
    "question": "Python — Bibliothèques Data Science / Finance",
    "answer": "**NumPy** : tableaux N-dimensionnels, opérations vectorisées, algèbre linéaire. Base de Pandas/sklearn. ◆ **Pandas** : DataFrames pour données tabulaires, séries temporelles, lecture CSV/Excel. Incontournable en finance pour l'analyse de données. ◆ **Matplotlib** : visualisation (courbes, histogrammes, scatter plots). ◆ **Scikit-learn** : machine learning (régression, classification, clustering). ◆ **TensorFlow / PyTorch** : deep learning. ◆ **Streamlit** : créer des dashboards web en Python pur — utile pour les outils de risk reporting internes. ◆ **OpenPyXL** : lire/écrire des fichiers Excel. ◆ **En AMM** : Pandas pour backtesting, NumPy pour calculs matriciels (corrélations, VaR), Matplotlib pour P&L charts."
  },
  // ── SQL ──
  {
    "question": "SQL — Agrégations et GROUP BY",
    "answer": "**`GROUP BY`** : regroupe les lignes par valeur d'une colonne, puis applique une fonction d'agrégation à chaque groupe. ◆ **Fonctions d'agrégation** : `AVG()`, `SUM()`, `COUNT()`, `MAX()`, `MIN()`. ◆ **Exemple** : `SELECT department, AVG(salary) FROM employees GROUP BY department;` ◆ **`WHERE` vs `HAVING`** : WHERE filtre **avant** le groupement (sur les lignes individuelles). HAVING filtre **après** le groupement (sur les résultats agrégés). ◆ **Exemple HAVING** : `SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 50000;` ◆ **Ordre d'exécution SQL** : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY."
  },
  {
    "question": "SQL — Jointures",
    "answer": "**INNER JOIN** : retourne uniquement les lignes ayant une correspondance dans les deux tables. ◆ **LEFT JOIN** : toutes les lignes de la table gauche + correspondances droite (NULL si pas de match). ◆ **RIGHT JOIN** : toutes les lignes de la table droite + correspondances gauche. ◆ **FULL OUTER JOIN** : toutes les lignes des deux tables, NULL de chaque côté si pas de correspondance. ◆ **CROSS JOIN** : produit cartésien — toutes les combinaisons possibles. ◆ **Exemple** : `SELECT t.id, c.name FROM trades t LEFT JOIN counterparties c ON t.cpty_id = c.id;` — tous les trades, même ceux sans contrepartie dans le référentiel. ◆ **En finance** : LEFT JOIN utile pour détecter les données manquantes (orphelins)."
  },
  // ── C++ AVANCÉ ──
  {
    "question": "Move Semantics — C++11",
    "answer": "**Problème** : copier un gros objet (vector de 1M éléments) juste pour le retourner = allocation + copie inutile. ◆ **Move semantics** : `std::move()` transfère la propriété des ressources au lieu de les copier. L'objet source est laissé dans un état valide mais indéterminé. ◆ **Rvalue reference `&&`** : `Trade(Trade&& other)` — move constructor. `Trade& operator=(Trade&& other)` — move assignment. ◆ **RVO (Return Value Optimization)** : le compilateur évite souvent la copie même sans `move` explicite. ◆ **En trading** : `void processOrder(Order&& order)` — passer un ordre par move évite la copie du buffer de données de marché. Critique pour la latence sur le hot path."
  },
  {
    "question": "Templates & Generic Programming — C++",
    "answer": "**Template de fonction** : `template<typename T> T max(T a, T b) { return a > b ? a : b; }` — une définition, plusieurs types. ◆ **Template de classe** : `template<typename T, size_t N> class RingBuffer { ... }` — buffer circulaire générique de taille fixe. ◆ **Avantage** : zéro overhead runtime (généré à la compilation). ◆ **`constexpr`** : évaluation à la compilation. `constexpr int SIZE = 1024;` ◆ **En AMM** : `RingBuffer<Quote, 1024>` — buffer de quotes de taille fixe connue à la compilation = allocation stack = latence minimale. ◆ **CRTP** (Curiously Recurring Template Pattern) : polymorphisme statique sans vtable = zéro overhead."
  },
  {
    "question": "Virtual Functions & Polymorphisme Runtime",
    "answer": "**`virtual`** : permet le polymorphisme runtime. `virtual double compute() = 0;` = fonction virtuelle pure (classe abstraite). ◆ **vtable** : table de fonctions virtuelles, une par classe. Chaque objet a un vptr (pointeur vers la vtable). Overhead : indirection supplémentaire = cache miss potentiel. ◆ **Virtual destructor** : **obligatoire** dans une classe de base si destruction via pointeur de base. Sans `virtual ~Base()`, seul le destructeur de Base est appelé → fuite mémoire des membres de Derived. ◆ **`override`** : mot-clé C++11 qui vérifie à la compilation que la méthode surcharge bien une virtuelle. ◆ **En trading low latency** : préférer le polymorphisme statique (templates/CRTP) pour les hot paths — évite l'indirection vtable."
  },
  {
    "question": "RAII — Resource Acquisition Is Initialization",
    "answer": "**Principe** : lier la durée de vie d'une ressource (mémoire, fichier, mutex, connexion DB) à la durée de vie d'un objet. Acquisition dans le constructeur, libération dans le destructeur. ◆ **Pourquoi** : même en cas d'exception, le destructeur est toujours appelé → pas de ressource orpheline. ◆ **Exemples** : `std::unique_ptr` (mémoire), `std::lock_guard` (mutex), `std::fstream` (fichier), `std::shared_lock` (shared mutex). ◆ **En trading** : `DatabaseConnection conn(config);` — la connexion Oracle est fermée à la sortie du scope, même si une exception est levée pendant le calcul de risque. ◆ **Règle** : ne jamais gérer les ressources manuellement si un wrapper RAII existe."
  },
  // ── LINUX AVANCÉ ──
  {
    "question": "Linux — Monitoring et Debugging Production",
    "answer": "**`top` / `htop`** : CPU/mémoire temps réel par processus. `htop` : interactif, tri par CPU/MEM, kill direct. ◆ **`strace -p PID`** : trace les appels système d'un processus en cours — utile pour détecter les blocages I/O. ◆ **`lsof -p PID`** : liste les fichiers ouverts par un processus (fichiers, sockets, pipes). ◆ **`netstat -tulpn`** : connexions réseau actives avec PID. ◆ **`df -h`** : espace disque. `du -sh *` : taille de chaque dossier. ◆ **`ulimit -n`** : nombre max de fichiers ouverts (important pour les systèmes avec nombreuses connexions). ◆ **En trading prod** : `tail -f trading.log | grep -E 'ERROR|FATAL'` — monitorer les erreurs critiques pendant la session."
  },
  {
    "question": "Linux — Scripts et Automatisation",
    "answer": "**Shebang** : `#!/bin/bash` — première ligne d'un script bash. ◆ **Variables** : `NAME='trading'`. `$NAME` pour utiliser. `$1`, `$2` : arguments du script. ◆ **Conditions** : `if [ $? -eq 0 ]; then echo 'OK'; fi` — `$?` = code retour de la dernière commande. ◆ **Boucle** : `for f in *.log; do gzip $f; done` — compresser tous les logs. ◆ **`cron`** : planification de tâches. `crontab -e`. `0 18 * * 1-5 /opt/trading/eod_report.sh` — rapport fin de journée à 18h du lundi au vendredi. ◆ **`nohup cmd &`** : lancer un processus qui continue après déconnexion SSH. ◆ **En AMM** : script de démarrage automatique du market data feed, archivage des logs de session."
  },
  // ── PYTHON AVANCÉ ──
  {
    "question": "Python — Décorateurs",
    "answer": "**Décorateur** : fonction qui enveloppe une autre fonction pour en modifier le comportement. `@decorator` est du sucre syntaxique pour `func = decorator(func)`. ◆ **Exemple timing** : `from functools import wraps` `def timer(func):` `  @wraps(func)` `  def wrapper(*args, **kwargs):` `    t0 = time.time(); result = func(*args, **kwargs); print(time.time()-t0); return result` `  return wrapper` ◆ **`@property`** : transforme une méthode en attribut calculé. ◆ **`@staticmethod`** : méthode sans accès à self/cls. `@classmethod` : méthode qui reçoit la classe. ◆ **En finance** : `@retry(max_attempts=3)` pour les appels API Bloomberg, `@log_execution` pour auditer les calculs de risque."
  },
  {
    "question": "Python — Gestion des Exceptions",
    "answer": "**`try/except/finally`** : `try` — code qui peut échouer. `except ExceptionType as e` — gestion de l'erreur. `finally` — toujours exécuté (nettoyage). ◆ **Hiérarchie** : `Exception` → `ValueError`, `TypeError`, `KeyError`, `IndexError`, `FileNotFoundError`... ◆ **Bonnes pratiques** : catcher des exceptions spécifiques, jamais `except:` nu. Logger l'erreur avant de la gérer. ◆ **`raise`** : relève l'exception. `raise ValueError('Prix négatif impossible')`. ◆ **Context manager `with`** : `with open('file') as f:` — ferme automatiquement. ◆ **En trading** : `try: price = feed.get_price(isin)` `except PriceNotAvailable: price = fallback_pricer.compute(isin)` — gestion du fallback sur source de prix alternative."
  },
  // ── SQL AVANCÉ ──
  {
    "question": "SQL — Sous-requêtes et CTEs",
    "answer": "**Sous-requête** : requête imbriquée dans une autre. `SELECT * FROM trades WHERE salary > (SELECT AVG(salary) FROM trades);` ◆ **CTE (Common Table Expression)** : avec `WITH`. Améliore la lisibilité, réutilisable dans la requête. `WITH avg_sal AS (SELECT department, AVG(salary) as avg FROM employees GROUP BY department) SELECT e.*, a.avg FROM employees e JOIN avg_sal a ON e.department = a.department;` ◆ **CTE récursive** : `WITH RECURSIVE` — pour les hiérarchies (organigrammes, chaînes de dépendances). ◆ **Window functions** : `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)` — rang par département sans GROUP BY. ◆ **En finance** : calcul du P&L cumulatif, ranking des traders par performance."
  },
  {
    "question": "SQL — Index et Performance",
    "answer": "**Index** : structure de données (B-tree par défaut) qui accélère les recherches. Sans index : full table scan O(n). Avec index : O(log n). ◆ **`CREATE INDEX idx_trade_date ON trades(trade_date);`** ◆ **Index composite** : `CREATE INDEX idx ON trades(date, isin)` — utile si on filtre toujours par date ET isin. ◆ **Quand NE PAS indexer** : petites tables, colonnes très peu sélectives (ex: colonne booléenne), tables avec beaucoup d'inserts (maintenance de l'index coûteuse). ◆ **`EXPLAIN`** : affiche le plan d'exécution. Chercher les `Seq Scan` (scan complet) sur les grandes tables — signe qu'un index manque. ◆ **En trading** : index sur `trade_date`, `isin`, `counterparty_id` — les filtres les plus fréquents des requêtes de risk."
  },
  {
    "question": "SQL — Transactions et ACID",
    "answer": "**Transaction** : séquence d'opérations traitées comme une unité atomique. `BEGIN; ... COMMIT;` ou `ROLLBACK;`. ◆ **ACID** : **A**tomicité (tout ou rien), **C**ohérence (état valide avant/après), **I**solation (transactions concurrentes ne s'interfèrent pas), **D**urabilité (commit = persisté même si crash). ◆ **Niveaux d'isolation** : READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE (plus restrictif = moins de concurrence). ◆ **Dirty read** : lire des données non committées d'une autre transaction. ◆ **En trading** : `BEGIN; UPDATE positions SET quantity = quantity - 100 WHERE isin = 'FR0000...'; INSERT INTO trades ...; COMMIT;` — atomicité critique pour la cohérence du book."
  },
  {
    "question": "C++ vs Python — Pourquoi C++ pour le core trading system ?",
    "answer": "**Latence** : C++ compilé = exécution directe en instructions machine. Python interprété = overhead de l'interpréteur (10-100x plus lent sur les boucles). ◆ **Contrôle mémoire** : C++ = pas de GC, pas de GIL, allocations contrôlées. Python = GC, GIL limite le vrai parallélisme CPU. ◆ **Déterminisme** : C++ = latence prévisible (si garbage-free). Python = pauses GC imprévisibles. ◆ **Utilisation réelle** : C++ pour le hot path (réception market data → décision → envoi ordre). Python pour l'analyse offline (backtesting, reporting, recherche alpha). ◆ **Question piège d'entretien** : 'Pourquoi pas Python ?' → citer la latence, le GIL, le GC — montrer qu'on connaît les trade-offs."
  }
];

const questions = {
  moyen: [
    // ── C++ FONDAMENTAUX (Q1–Q15) ──
    {
      "question": "[C++ Pointeurs] Quelle est la différence principale entre un pointeur et une référence en C++ ?",
      "options": [
        "Un pointeur peut être nullptr et réassigné, une référence ne peut pas être nullptr et ne peut pas être réassignée après initialisation.",
        "Un pointeur est plus rapide qu'une référence car il accède directement à la mémoire.",
        "Une référence peut pointer vers nullptr, un pointeur ne le peut pas.",
        "Il n'y a aucune différence, c'est juste une question de syntaxe."
      ],
      "answer": "Un pointeur peut être nullptr et réassigné, une référence ne peut pas être nullptr et ne peut pas être réassignée après initialisation.",
      "explanation": "Différence fondamentale : pointeur = adresse mémoire manipulable (nullptr possible, arithmétique possible, réassignable). Référence = alias d'une variable existante, toujours valide, jamais réassignable. En trading, on passe les gros objets en const& pour éviter les copies sans risquer un nullptr."
    },
    {
      "question": "[C++ Const] Que signifie `const` après une méthode : `double getPrice() const;` ?",
      "options": [
        "La méthode retourne toujours la même valeur.",
        "La méthode ne modifie pas l'état de l'objet — peut être appelée sur un objet const.",
        "La méthode est thread-safe automatiquement.",
        "La méthode ne peut pas être overridée dans une classe dérivée."
      ],
      "answer": "La méthode ne modifie pas l'état de l'objet — peut être appelée sur un objet const.",
      "explanation": "const après une méthode = promesse au compilateur que l'état de l'objet n'est pas modifié. Cela permet d'appeler la méthode sur un objet const ou une const reference. Toute méthode de lecture (getter) doit être const — c'est la const correctness. Sans cela, passer un OrderBook en const& et appeler getBestBid() ne compilerait pas."
    },
    {
      "question": "[C++ Copie] Quel est le danger d'un copy constructor par défaut pour une classe possédant un pointeur `int* data` ?",
      "options": [
        "La copie sera plus lente qu'une copie profonde.",
        "Le copy constructor par défaut copie le pointeur (adresse), pas les données — deux objets partagent la même mémoire = double-free à la destruction.",
        "Le compilateur refusera de compiler la copie.",
        "La copie par défaut est toujours une copie profonde en C++."
      ],
      "answer": "Le copy constructor par défaut copie le pointeur (adresse), pas les données — deux objets partagent la même mémoire = double-free à la destruction.",
      "explanation": "Copie superficielle (shallow copy) : `this->data = other.data` copie l'adresse. Quand les deux objets sont détruits, `delete[] data` est appelé deux fois sur la même adresse = undefined behavior / crash. Solution : copie profonde dans le copy constructor avec `this->data = new int[size]; memcpy(...)`. D'où la règle des 5 en C++11."
    },
    {
      "question": "[C++ Mémoire] Pourquoi évite-t-on `new` en hot path dans un système de trading ?",
      "options": [
        "Parce que `new` est interdit dans les systèmes embarqués.",
        "L'allocation dynamique (`new`) peut appeler le système d'exploitation → latence non déterministe. En AMM, on pré-alloue au démarrage et on réutilise.",
        "Parce que `new` ne fonctionne pas avec les smart pointers.",
        "`new` est plus lent que `malloc` en C++."
      ],
      "answer": "L'allocation dynamique (`new`) peut appeler le système d'exploitation → latence non déterministe. En AMM, on pré-alloue au démarrage et on réutilise.",
      "explanation": "En low latency trading : `new` peut déclencher `malloc` → appel système → jitter de quelques microsecondes à millisecondes. Inacceptable sur un hot path de pricing/exécution. Solution : object pools pré-alloués, placement new, std::array au lieu de std::vector pour les tailles connues. Garbage-free programming = zéro allocation dynamique pendant la session de trading."
    },
    {
      "question": "[C++ Smart Pointers] Quelle est la différence entre `unique_ptr` et `shared_ptr` ?",
      "options": [
        "`unique_ptr` est pour les tableaux, `shared_ptr` pour les objets simples.",
        "`unique_ptr` = propriété exclusive (pas de copie), `shared_ptr` = propriété partagée via compteur de références, détruit quand le compteur atteint 0.",
        "`shared_ptr` est plus performant car il utilise moins de mémoire.",
        "Les deux sont identiques mais `unique_ptr` est obsolète depuis C++17."
      ],
      "answer": "`unique_ptr` = propriété exclusive (pas de copie), `shared_ptr` = propriété partagée via compteur de références, détruit quand le compteur atteint 0.",
      "explanation": "unique_ptr : zéro overhead runtime, un seul propriétaire, pas de copie (seulement move). Préférer en trading. shared_ptr : compteur de références atomique = overhead, cycles de références possibles (memory leak). weak_ptr observe sans posséder et casse les cycles. En hot path, éviter shared_ptr (opération atomique sur le compteur à chaque copie)."
    },
    {
      "question": "[C++ Cache] Pourquoi `std::vector` est-il généralement préféré à `std::list` en trading ?",
      "options": [
        "Parce que vector supporte plus d'éléments que list.",
        "vector stocke les éléments de manière contiguë → excellente cache locality. list = nœuds épars = cache miss à chaque élément parcouru.",
        "vector est thread-safe contrairement à list.",
        "list ne supporte pas les iterators."
      ],
      "answer": "vector stocke les éléments de manière contiguë → excellente cache locality. list = nœuds épars = cache miss à chaque élément parcouru.",
      "explanation": "Le CPU charge la mémoire par cache lines (~64 bytes). Un vector = tableau contigu = les éléments successifs sont dans la même cache line = très rapide à parcourir. Une list = chaque nœud est un objet distinct sur la heap = chaque accès risque un cache miss (100-200x plus lent qu'un cache hit). Même pour des insertions fréquentes, vector est souvent plus rapide grâce au cache."
    },
    {
      "question": "[C++ Multithreading] Quelle est la différence entre `std::mutex` et `std::atomic<int>` ?",
      "options": [
        "`std::atomic` est plus puissant et peut remplacer `std::mutex` dans tous les cas.",
        "`std::mutex` protège des sections critiques complexes (plusieurs variables). `std::atomic` assure des opérations atomiques sur un type simple sans verrou — plus léger.",
        "`std::mutex` est obsolète depuis C++11, préférer `std::atomic`.",
        "`std::atomic` fonctionne uniquement avec les pointeurs."
      ],
      "answer": "`std::mutex` protège des sections critiques complexes (plusieurs variables). `std::atomic` assure des opérations atomiques sur un type simple sans verrou — plus léger.",
      "explanation": "atomic : parfait pour un compteur partagé, un flag booléen, un pointeur. Opération hardware atomique, pas de verrou. mutex : nécessaire quand plusieurs variables doivent être modifiées de manière cohérente (ex: bid ET ask de l'order book — doivent être mis à jour ensemble). En trading : atomic pour les compteurs de performance, mutex ou lock-free structure pour l'order book."
    },
    {
      "question": "[C++ STL] Quelle est la complexité de `std::unordered_map::find` vs `std::map::find` ?",
      "options": [
        "Les deux sont O(log n).",
        "unordered_map::find est O(1) en moyenne, map::find est O(log n).",
        "unordered_map::find est O(n), map::find est O(1).",
        "Les deux sont O(1) en C++17."
      ],
      "answer": "unordered_map::find est O(1) en moyenne, map::find est O(log n).",
      "explanation": "map = arbre rouge-noir trié → find en O(log n). unordered_map = table de hachage → find en O(1) moyen, O(n) pire cas (collisions). En trading : lookup de prix par ISIN → unordered_map pour la performance. Mais si on a besoin des données triées (order book par prix), map ou structure triée. Connaître ces complexités est essentiel pour les entretiens AMM."
    },
    {
      "question": "[C++ Race Condition] Deux threads incrémentent simultanément `int counter = 0;` sans synchronisation. Que se passe-t-il ?",
      "options": [
        "Le résultat est toujours correct car les incréments sont atomiques.",
        "Race condition : `counter++` n'est pas atomique (read-modify-write). Les deux threads peuvent lire la même valeur → un incrément est perdu.",
        "Le programme crashe immédiatement.",
        "C++ interdit la compilation de code avec des variables partagées."
      ],
      "answer": "Race condition : `counter++` n'est pas atomique (read-modify-write). Les deux threads peuvent lire la même valeur → un incrément est perdu.",
      "explanation": "counter++ = 3 opérations : charger counter, ajouter 1, stocker. Si deux threads exécutent simultanément : thread A lit 5, thread B lit 5, thread A stocke 6, thread B stocke 6. Résultat : 6 au lieu de 7. Solution : `std::atomic<int> counter` ou `std::lock_guard<std::mutex> lock(m)` autour de l'incrément. En trading : compteur de trades exécutés partagé entre threads."
    },
    {
      "question": "[C++ Virtual] Pourquoi un destructeur de classe de base doit-il être `virtual` ?",
      "options": [
        "Pour permettre à la classe dérivée d'overrider le constructeur.",
        "Sans `virtual`, détruire un objet Derived via un pointeur Base appelle uniquement ~Base() — les membres de Derived ne sont pas détruits = fuite mémoire.",
        "Les destructeurs virtuels améliorent les performances de destruction.",
        "C++11 rend tous les destructeurs virtuels automatiquement."
      ],
      "answer": "Sans `virtual`, détruire un objet Derived via un pointeur Base appelle uniquement ~Base() — les membres de Derived ne sont pas détruits = fuite mémoire.",
      "explanation": "Classique des entretiens C++ : `Base* obj = new Derived(); delete obj;`. Sans `virtual ~Base()`, seul ~Base() est appelé → si Derived alloue de la mémoire dans son constructeur, elle n'est jamais libérée. Avec `virtual ~Base()`, la vtable dispatch vers ~Derived() qui appelle ~Base() automatiquement. Règle : toute classe de base polymorphique doit avoir un destructeur virtuel."
    },
    {
      "question": "[C++ RAII] Qu'est-ce que le principe RAII en C++ ?",
      "options": [
        "Un pattern de threading pour éviter les deadlocks.",
        "Lier la durée de vie d'une ressource (mémoire, mutex, fichier) à la durée de vie d'un objet — acquisition dans le constructeur, libération dans le destructeur.",
        "Une technique d'optimisation pour éviter les copies.",
        "Un acronyme pour Random Access Interface Implementation."
      ],
      "answer": "Lier la durée de vie d'une ressource (mémoire, mutex, fichier) à la durée de vie d'un objet — acquisition dans le constructeur, libération dans le destructeur.",
      "explanation": "RAII = Resource Acquisition Is Initialization. Le destructeur est toujours appelé en C++, même si une exception est levée → pas de ressource orpheline. Exemples : unique_ptr libère la mémoire, lock_guard déverrouille le mutex, fstream ferme le fichier. En trading : connexion Oracle dans un RAII wrapper → fermée même si une exception est levée pendant le calcul de risque."
    },
    {
      "question": "[C++ Move] Quand utilise-t-on `std::move()` en C++ ?",
      "options": [
        "Pour déplacer physiquement un objet d'une adresse mémoire à une autre.",
        "Pour transférer la propriété des ressources d'un objet source vers un objet destination, en évitant une copie coûteuse. L'objet source est laissé dans un état valide mais vide.",
        "Pour copier un objet deux fois plus vite.",
        "`std::move()` est uniquement utile avec les smart pointers."
      ],
      "answer": "Pour transférer la propriété des ressources d'un objet source vers un objet destination, en évitant une copie coûteuse. L'objet source est laissé dans un état valide mais vide.",
      "explanation": "std::move caste en rvalue reference → déclenche le move constructor/assignment au lieu du copy. `vector<Quote> quotes = std::move(buffer)` transfère le tableau interne sans copier les éléments. Utilisé pour les retours de fonctions (RVO), passage de gros objets en ownership, et les conteneurs STL qui se redimensionnent. En low latency : éviter toute copie inutile sur le hot path."
    },
    {
      "question": "[C++ Const] Quelle est la différence entre `const T*`, `T* const` et `const T* const` ?",
      "options": [
        "Il n'y a pas de différence, les trois signifient que la valeur est constante.",
        "`const T*` = pointeur vers T immutable. `T* const` = pointeur immutable vers T mutable. `const T* const` = pointeur immutable vers T immutable.",
        "`const T*` = pointeur constant, `T* const` = valeur constante.",
        "Seul `const T*` est valide en C++ moderne."
      ],
      "answer": "`const T*` = pointeur vers T immutable. `T* const` = pointeur immutable vers T mutable. `const T* const` = pointeur immutable vers T immutable.",
      "explanation": "Lecture de droite à gauche : T* const p → p est const (pointeur fixe), la valeur peut changer. const T* p → *p est const (valeur fixe), le pointeur peut changer. const T* const p → les deux sont const. En trading : `const Quote* feed` = le pointeur peut pointer ailleurs mais on ne peut pas modifier la quote (sécurité de lecture)."
    },
    {
      "question": "[C++ Templates] À quoi sert un template en C++ ?",
      "options": [
        "À créer des copies d'une classe pour différents projets.",
        "À écrire du code générique qui fonctionne avec plusieurs types, résolu à la compilation sans overhead runtime.",
        "À accélérer la compilation en mise en cache des classes.",
        "À implémenter le polymorphisme runtime sans vtable."
      ],
      "answer": "À écrire du code générique qui fonctionne avec plusieurs types, résolu à la compilation sans overhead runtime.",
      "explanation": "Templates = polymorphisme statique. `template<typename T> T max(T a, T b)` génère une version pour chaque type utilisé à la compilation. Zéro overhead runtime contrairement aux fonctions virtuelles. En AMM : `RingBuffer<Quote, 1024>` — buffer circulaire de 1024 quotes alloué sur la stack, taille connue à la compilation. `template<typename Strategy>` pour le polymorphisme sans vtable dans les hot paths."
    },
    {
      "question": "[C++ Containers] Quand choisir `std::map` plutôt que `std::unordered_map` ?",
      "options": [
        "Quand les clés sont des entiers.",
        "Quand on a besoin que les clés soient toujours triées ou quand la clé n'est pas hashable.",
        "map est toujours préférable car plus stable.",
        "unordered_map ne supporte pas les clés de type string."
      ],
      "answer": "Quand on a besoin que les clés soient toujours triées ou quand la clé n'est pas hashable.",
      "explanation": "map = arbre B-tree, clés triées, O(log n). unordered_map = hash table, O(1) moyen, clés non triées. Choisir map : order book (prix triés pour trouver le best bid/ask), itération dans l'ordre, clé sans hash function disponible. Choisir unordered_map : lookup par ISIN, lookup par identifiant de trade — vitesse O(1) plus importante que l'ordre."
    },

    // ── LINUX (Q16–Q30) ──
    {
      "question": "[Linux] Quelle commande affiche les dernières lignes d'un fichier de log en temps réel ?",
      "options": [
        "`head -f app.log`",
        "`tail -f app.log`",
        "`watch app.log`",
        "`cat -live app.log`"
      ],
      "answer": "`tail -f app.log`",
      "explanation": "tail -f (follow) = suit le fichier et affiche les nouvelles lignes au fur et à mesure qu'elles sont écrites. Indispensable en production trading pour surveiller les logs de session. Combinaison puissante : `tail -f trading.log | grep 'ERROR'` — affiche uniquement les nouvelles erreurs en temps réel. head affiche les premières lignes (sans -f, pas de follow)."
    },
    {
      "question": "[Linux Permissions] Que signifient les permissions `chmod 755` sur un fichier ?",
      "options": [
        "Propriétaire : lecture seule (7), groupe : lecture/écriture (5), autres : lecture/écriture (5).",
        "Propriétaire : rwx (7=4+2+1), groupe : r-x (5=4+1), autres : r-x (5=4+1).",
        "Tout le monde a accès complet en lecture et écriture.",
        "Seul root peut exécuter le fichier."
      ],
      "answer": "Propriétaire : rwx (7=4+2+1), groupe : r-x (5=4+1), autres : r-x (5=4+1).",
      "explanation": "Décomposition : r=4, w=2, x=1. 7=4+2+1=rwx (tout). 5=4+1=r-x (lecture + exécution). chmod 755 = standard pour les exécutables : le propriétaire peut tout faire, les autres peuvent lire et exécuter. chmod 644 = standard pour les fichiers config/données : propriétaire peut lire/écrire, les autres lisent uniquement."
    },
    {
      "question": "[Linux grep] Que fait `grep -v 'DEBUG' app.log` ?",
      "options": [
        "Recherche les lignes qui contiennent 'DEBUG' et les affiche.",
        "Affiche toutes les lignes qui ne contiennent PAS 'DEBUG' (inversion du filtre).",
        "Compte le nombre de lignes contenant 'DEBUG'.",
        "Supprime les lignes contenant 'DEBUG' du fichier."
      ],
      "answer": "Affiche toutes les lignes qui ne contiennent PAS 'DEBUG' (inversion du filtre).",
      "explanation": "grep -v (invert) = exclut les lignes qui matchent. Très utile pour filtrer le bruit dans les logs. `grep 'ERROR' app.log` : uniquement les erreurs. `grep -v 'DEBUG' app.log` : tout sauf les debugs. `grep -E 'ERROR|FATAL' app.log` : erreurs ou fatals (regex étendue). `grep -c 'FILL' app.log` : compte les occurrences."
    },
    {
      "question": "[Linux Redirection] Quelle est la différence entre `>` et `>>` dans un terminal Linux ?",
      "options": [
        "`>` ajoute à la fin du fichier, `>>` écrase le contenu.",
        "`>` écrase le fichier existant, `>>` ajoute à la fin sans effacer.",
        "Les deux sont identiques mais `>>` est plus rapide.",
        "`>` redirige stdin, `>>` redirige stdout."
      ],
      "answer": "`>` écrase le fichier existant, `>>` ajoute à la fin sans effacer.",
      "explanation": "> : truncate puis écrit. Si le fichier existe, son contenu est perdu. >> : ouvre en mode append, ajoute à la fin. En trading : `./engine >> session.log 2>&1` — log de session avec append (on garde l'historique). `./engine > session.log 2>&1` — nouvelle session efface l'ancienne. Pour les logs de production, toujours >> ou un système de rotation (logrotate)."
    },
    {
      "question": "[Linux Processus] Comment retrouver le PID d'un processus nommé `trading_engine` ?",
      "options": [
        "`find /proc -name trading_engine`",
        "`pgrep trading_engine` ou `ps aux | grep trading_engine`",
        "`ls /proc | grep trading_engine`",
        "`pid trading_engine`"
      ],
      "answer": "`pgrep trading_engine` ou `ps aux | grep trading_engine`",
      "explanation": "pgrep trading_engine : retourne directement le(s) PID(s). Plus propre que ps|grep qui inclut aussi la ligne grep elle-même. ps aux | grep trading_engine : affiche plus d'infos (CPU, mémoire). ps aux | grep '[t]rading_engine' : le bracket trick évite d'afficher la ligne grep. kill $(pgrep trading_engine) : tuer le process directement."
    },
    {
      "question": "[Linux Process vs Thread] Quelle est la différence fondamentale entre un processus et un thread ?",
      "options": [
        "Un processus est plus rapide qu'un thread car il a plus de ressources.",
        "Un processus a son propre espace mémoire isolé. Les threads d'un même processus partagent la mémoire — plus légers mais risques de race conditions.",
        "Un thread peut exécuter plusieurs processus simultanément.",
        "Les processus sont pour Linux, les threads pour Windows."
      ],
      "answer": "Un processus a son propre espace mémoire isolé. Les threads d'un même processus partagent la mémoire — plus légers mais risques de race conditions.",
      "explanation": "Processus : espace mémoire propre, isolation totale, communication via IPC (pipes, sockets, shared memory), création coûteuse (fork). Threads : partagent la mémoire du processus, création légère, communication directe mais synchronisation nécessaire. En AMM : moteur de market data = processus séparé (isolation). Plusieurs stratégies dans un même moteur = threads (mémoire partagée pour les prix, mais mutex nécessaire)."
    },
    {
      "question": "[Linux] Que fait `ps aux | grep trading` ?",
      "options": [
        "Affiche uniquement les processus root liés au trading.",
        "Liste tous les processus en cours d'exécution (`ps aux`) puis filtre ceux dont la ligne contient 'trading'.",
        "Arrête tous les processus contenant 'trading' dans leur nom.",
        "Affiche les threads actifs du processus 'trading'."
      ],
      "answer": "Liste tous les processus en cours d'exécution (`ps aux`) puis filtre ceux dont la ligne contient 'trading'.",
      "explanation": "ps aux : a = tous les utilisateurs, u = format utilisateur (CPU, MEM), x = processus sans terminal de contrôle. | grep trading : filtre les lignes. La sortie montre : USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND. Note : `ps aux | grep trading` affiche aussi la ligne grep elle-même. Solution : `ps aux | grep '[t]rading'` ou utiliser pgrep."
    },
    {
      "question": "[Linux] À quoi sert `tail` et en quoi diffère-t-il de `head` ?",
      "options": [
        "`tail` affiche les premières lignes, `head` affiche les dernières.",
        "`head` affiche les N premières lignes d'un fichier, `tail` affiche les N dernières. `tail -f` suit le fichier en temps réel.",
        "`tail` et `head` affichent tous les deux les 10 premières lignes par défaut.",
        "`head` est pour les fichiers texte, `tail` pour les fichiers binaires."
      ],
      "answer": "`head` affiche les N premières lignes d'un fichier, `tail` affiche les N dernières. `tail -f` suit le fichier en temps réel.",
      "explanation": "head -n 20 file.log : les 20 premières lignes (entête de fichier, début de log). tail -n 20 file.log : les 20 dernières (événements récents). tail -f : suit les nouvelles lignes en temps réel — indispensable pour monitorer une application en production. Combo : `tail -n 100 -f app.log | grep 'FILL'` — les 100 dernières lignes + follow + filtre sur les fills."
    },
    {
      "question": "[Linux chmod] Que signifie `chmod 777` et pourquoi est-ce dangereux en production ?",
      "options": [
        "chmod 777 = lecture seule pour tout le monde — trop restrictif en production.",
        "chmod 777 = rwx pour le propriétaire, le groupe ET les autres — n'importe qui peut lire, modifier et exécuter le fichier. Risque de sécurité majeur.",
        "chmod 777 ne fonctionne que sur les répertoires.",
        "chmod 777 est le paramètre recommandé pour les applications web."
      ],
      "answer": "chmod 777 = rwx pour le propriétaire, le groupe ET les autres — n'importe qui peut lire, modifier et exécuter le fichier. Risque de sécurité majeur.",
      "explanation": "777 = 7(rwx)+7(rwx)+7(rwx). Tout le monde peut lire, modifier et exécuter. En production : un fichier de configuration avec les credentials Oracle en chmod 777 est accessible par tous les utilisateurs du système. Standard production : 640 pour les configs (propriétaire rw, groupe r, autres rien), 750 pour les exécutables (propriétaire rwx, groupe rx, autres rien)."
    },
    {
      "question": "[Linux pipe] Que fait la commande `ps aux | grep python | wc -l` ?",
      "options": [
        "Arrête tous les processus Python.",
        "Compte le nombre de processus dont la ligne contient 'python'.",
        "Affiche la mémoire utilisée par Python.",
        "Liste les fichiers Python en cours d'exécution."
      ],
      "answer": "Compte le nombre de processus dont la ligne contient 'python'.",
      "explanation": "Pipeline : ps aux liste tous les processus. | grep python filtre les lignes contenant 'python'. | wc -l compte le nombre de lignes résultantes. En trading : `ps aux | grep market_data | wc -l` — vérifier combien d'instances du feed de market data sont actives (doit être exactement 1 en production)."
    },
    {
      "question": "[Linux] Comment lancer un processus en arrière-plan qui continue après la déconnexion SSH ?",
      "options": [
        "`background ./trading_engine`",
        "`nohup ./trading_engine > trading.log 2>&1 &`",
        "`./trading_engine --daemon`",
        "`screen ./trading_engine` sans options supplémentaires"
      ],
      "answer": "`nohup ./trading_engine > trading.log 2>&1 &`",
      "explanation": "nohup (no hangup) : ignore le signal SIGHUP envoyé lors de la déconnexion SSH → le processus continue. > trading.log : redirige stdout. 2>&1 : redirige stderr vers stdout. & : exécute en arrière-plan. Alternative moderne : tmux/screen (sessions persistantes) ou systemd (service système). En AMM : les engines de trading tournent souvent en session tmux ou comme services systemd pour la résilience."
    },
    {
      "question": "[Linux] Quelle commande permet de chercher récursivement la chaîne 'OracleException' dans tous les fichiers .log du répertoire courant ?",
      "options": [
        "`find 'OracleException' *.log`",
        "`grep -r 'OracleException' ./ --include='*.log'`",
        "`search -r 'OracleException' .log`",
        "`cat *.log | find 'OracleException'`"
      ],
      "answer": "`grep -r 'OracleException' ./ --include='*.log'`",
      "explanation": "grep -r : récursif (descend dans les sous-répertoires). ./ : depuis le répertoire courant. --include='*.log' : filtre uniquement les fichiers .log. Variante utile : grep -r -n 'OracleException' ./ --include='*.log' affiche aussi le numéro de ligne (-n). En debug production : `grep -r 'CRITICAL\\|FATAL' /var/log/trading/ --include='*.log' | tail -50` — dernières erreurs critiques."
    },
    {
      "question": "[Linux] Quelle est la commande pour afficher l'espace disque disponible de manière lisible par l'humain ?",
      "options": [
        "`diskspace -human`",
        "`df -h`",
        "`ls -size`",
        "`free -disk`"
      ],
      "answer": "`df -h`",
      "explanation": "df (disk free) -h (human readable) : affiche l'espace par système de fichiers en KB/MB/GB. `du -sh *` : taille de chaque répertoire/fichier du dossier courant. `du -sh /var/log/trading/` : taille totale du dossier de logs. En production trading : surveiller que la partition des logs ne se remplit pas (les logs de market data peuvent être très volumineux — plusieurs GB par session)."
    },
    {
      "question": "[Linux strace] À quoi sert `strace -p PID` en débogage de production ?",
      "options": [
        "À arrêter proprement un processus en production.",
        "À tracer tous les appels système effectués par le processus en temps réel — utile pour détecter les I/O bloquantes ou les appels systèmes inattendus.",
        "À afficher la consommation CPU du processus.",
        "À redémarrer un processus sans interruption."
      ],
      "answer": "À tracer tous les appels système effectués par le processus en temps réel — utile pour détecter les I/O bloquantes ou les appels systèmes inattendus.",
      "explanation": "strace -p PID : s'attache à un processus existant et trace les syscalls (read, write, connect, select, etc.). En trading : si le moteur est lent, strace révèle s'il passe du temps en I/O (read bloquant sur un socket), en attente système, ou en malloc/free (allocations non prévues). À utiliser avec précaution en prod : overhead de strace peut impacter les performances."
    },
    {
      "question": "[Linux] Comment afficher les connexions réseau actives avec les PID associés ?",
      "options": [
        "`lsof -internet`",
        "`netstat -tulpn` ou `ss -tulpn`",
        "`ifconfig -connections`",
        "`ps aux --network`"
      ],
      "answer": "`netstat -tulpn` ou `ss -tulpn`",
      "explanation": "netstat -tulpn : t=TCP, u=UDP, l=listening, p=affiche le PID/programme, n=numérique (pas de résolution DNS). ss est le remplaçant moderne de netstat. En trading : vérifier que le feed Bloomberg écoute bien sur le port attendu, que les connexions FIX Engine sont établies. `netstat -tulpn | grep trading_engine` — voir sur quels ports l'engine écoute."
    },

    // ── PYTHON (Q31–Q50) ──
    {
      "question": "[Python] Quelle est la différence entre une liste et un tuple ?",
      "options": [
        "Les listes sont pour les nombres, les tuples pour les chaînes.",
        "Liste `[]` : mutable (modifiable). Tuple `()` : immuable (non modifiable après création). Le tuple est hashable et utilisable comme clé de dictionnaire.",
        "Il n'y a pas de différence pratique entre liste et tuple.",
        "Les tuples sont plus lents que les listes car ils vérifient l'immuabilité."
      ],
      "answer": "Liste `[]` : mutable (modifiable). Tuple `()` : immuable (non modifiable après création). Le tuple est hashable et utilisable comme clé de dictionnaire.",
      "explanation": "Liste : append, remove, sort possibles. Tuple : structure fixe, légèrement plus performant, hashable. Usage : liste pour des collections qui changent (ordres en attente). Tuple pour des données fixes (coordonnées, RGBA, clé composite dans un dict). tuple comme clé : `prices[(date, isin)] = 58.5` — impossible avec une liste."
    },
    {
      "question": "[Python Set] Comment créer un set vide en Python ?",
      "options": [
        "`s = {}`",
        "`s = set()`",
        "`s = []set`",
        "`s = empty_set()`"
      ],
      "answer": "`s = set()`",
      "explanation": "{} crée un dictionnaire vide, PAS un set vide. set() crée un set vide. {1, 2, 3} crée un set avec des éléments. Propriétés du set : pas de doublons, recherche O(1), non ordonné. En finance : `set(trades_today) & set(expected_trades)` — intersection pour trouver les trades manquants rapidement."
    },
    {
      "question": "[Python] À quoi sert la fonction `map()` ?",
      "options": [
        "À créer un dictionnaire à partir de deux listes.",
        "À appliquer une fonction à chaque élément d'un itérable, retourne un itérateur (lazy).",
        "À afficher les valeurs d'une liste.",
        "À mapper des clés vers des valeurs dans un dictionnaire."
      ],
      "answer": "À appliquer une fonction à chaque élément d'un itérable, retourne un itérateur (lazy).",
      "explanation": "map(func, iterable) : applique func à chaque élément. `list(map(lambda x: x**2, [1,2,3]))` → [1,4,9]. Retourne un itérateur (lazy evaluation = évalué à la demande). Souvent remplacé par une compréhension de liste : `[x**2 for x in [1,2,3]]` (plus lisible). En finance : `list(map(lambda t: t.pnl, trades))` — extraire les P&L de tous les trades."
    },
    {
      "question": "[Python] Qu'est-ce qu'une compréhension de liste et quel est son avantage ?",
      "options": [
        "Une méthode pour trier une liste en une ligne.",
        "Une syntaxe concise pour créer une liste : `[expression for item in iterable if condition]`. Plus lisible et légèrement plus rapide que map/filter.",
        "Une façon de créer un dictionnaire à partir d'une liste.",
        "Une méthode pour fusionner plusieurs listes en une seule."
      ],
      "answer": "Une syntaxe concise pour créer une liste : `[expression for item in iterable if condition]`. Plus lisible et légèrement plus rapide que map/filter.",
      "explanation": "Compréhension de liste : `[x**2 for x in range(10)]` → carrés de 0 à 9. `[x for x in trades if x.pnl > 0]` → trades profitables. Compréhension de dict : `{t.isin: t.pnl for t in trades}`. Compréhension de set : `{t.counterparty for t in trades}`. Générateur : `(x**2 for x in range(10))` — lazy, économise la mémoire pour les grands datasets."
    },
    {
      "question": "[Python POO] À quoi sert `__init__` en Python ?",
      "options": [
        "À définir une méthode de classe appelée automatiquement à la destruction de l'objet.",
        "Au constructeur : appelé automatiquement lors de la création d'une instance, initialise les attributs de l'objet.",
        "À rendre une classe immuable.",
        "À définir une méthode statique sur la classe."
      ],
      "answer": "Au constructeur : appelé automatiquement lors de la création d'une instance, initialise les attributs de l'objet.",
      "explanation": "__init__(self, ...) est le constructeur Python. Appelé automatiquement par `Trade(isin, qty, price)`. Initialise les attributs : `self.isin = isin`. self = référence à l'instance courante (convention, pas un mot-clé). Ne pas confondre avec __new__ (qui crée l'instance avant __init__). __del__ = destructeur (appelé à la destruction, moins fiable que RAII en C++)."
    },
    {
      "question": "[Python] Quelle bibliothèque Python est incontournable pour l'analyse de données tabulaires en finance ?",
      "options": [
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Scikit-learn"
      ],
      "answer": "Pandas",
      "explanation": "Pandas : DataFrames = tableaux 2D avec labels. `df.groupby('desk')['pnl'].sum()` — P&L par desk. `df[df['date'] == '2024-01-15']` — filtrer par date. read_csv, read_excel pour l'import. merge() pour les jointures SQL-like. NumPy = calcul numérique bas niveau (sous-jacent de Pandas). Matplotlib = visualisation. Scikit-learn = ML. En AMM : Pandas pour le backtesting, l'analyse de performance, le reporting risk."
    },
    {
      "question": "[Python] Quelle est la sortie de `list(map(lambda x: x**2, [1, 2, 3, 4]))` ?",
      "options": [
        "[1, 2, 3, 4]",
        "[1, 4, 9, 16]",
        "[2, 4, 6, 8]",
        "[(1,1), (2,4), (3,9), (4,16)]"
      ],
      "answer": "[1, 4, 9, 16]",
      "explanation": "lambda x: x**2 = fonction anonyme qui élève x au carré. map applique cette fonction à chaque élément : 1²=1, 2²=4, 3²=9, 4²=16. list() convertit l'itérateur map en liste. Équivalent compréhension : [x**2 for x in [1,2,3,4]]. En Python 3, map retourne un itérateur (lazy) — list() force l'évaluation."
    },
    {
      "question": "[Python] Qu'est-ce que `__str__` vs `__repr__` ?",
      "options": [
        "Les deux sont identiques — Python choisit arbitrairement lequel appeler.",
        "`__str__` = représentation lisible pour l'utilisateur (print). `__repr__` = représentation non ambiguë pour les développeurs (debug, REPL).",
        "`__repr__` est obligatoire, `__str__` est optionnel.",
        "`__str__` est pour les entiers, `__repr__` pour les objets complexes."
      ],
      "answer": "`__str__` = représentation lisible pour l'utilisateur (print). `__repr__` = représentation non ambiguë pour les développeurs (debug, REPL).",
      "explanation": "str(obj) → __str__ : 'Trade AAPL 100@58.5€'. repr(obj) → __repr__ : 'Trade(isin=\"FR0000131104\", qty=100, price=58.5)'. Si __str__ non défini, Python utilise __repr__. Bonne pratique : __repr__ doit être eval()-able quand possible. Dans le REPL Python, taper le nom d'un objet appelle __repr__. En finance : __repr__ inclut tous les champs pour le debugging."
    },
    {
      "question": "[Python Exceptions] Qu'est-ce que le bloc `finally` dans un try/except ?",
      "options": [
        "Code exécuté uniquement si une exception est levée.",
        "Code toujours exécuté, qu'il y ait exception ou non — idéal pour le nettoyage des ressources.",
        "Code exécuté si aucune exception n'est levée.",
        "Alternative à `except` pour les erreurs fatales."
      ],
      "answer": "Code toujours exécuté, qu'il y ait exception ou non — idéal pour le nettoyage des ressources.",
      "explanation": "try: code risqué. except: gestion de l'erreur. finally: nettoyage garanti. `try: conn.execute(query) except DatabaseError as e: log(e) finally: conn.close()` — la connexion est fermée même si une erreur SQL est levée. En Python, préférer `with` (context manager) qui fait le finally automatiquement : `with db.connect() as conn: conn.execute(query)`."
    },
    {
      "question": "[Python] Comment trier une liste de trades par prix décroissant ?",
      "options": [
        "`trades.sort(price=desc)`",
        "`sorted(trades, key=lambda t: t.price, reverse=True)`",
        "`trades.reverse().sort(key='price')`",
        "`trades.sort_by(lambda t: -t.price)`"
      ],
      "answer": "`sorted(trades, key=lambda t: t.price, reverse=True)`",
      "explanation": "sorted() retourne une nouvelle liste triée (non-destructif). sort() trie en place. key= : fonction qui extrait la valeur de comparaison. reverse=True : ordre décroissant. Alternative : `sorted(trades, key=lambda t: -t.price)`. Pour les tuples : `sorted(trades, key=lambda t: (t.date, t.price))` — tri multi-critères. En AMM : trier les ordres par prix pour construire l'order book."
    },
    {
      "question": "[Python Décorateurs] Que fait `@property` en Python ?",
      "options": [
        "Rend un attribut private.",
        "Transforme une méthode en attribut calculé accessible sans parenthèses, et permet de définir un getter/setter/deleter.",
        "Rend une méthode statique.",
        "Optimise automatiquement la méthode pour les performances."
      ],
      "answer": "Transforme une méthode en attribut calculé accessible sans parenthèses, et permet de définir un getter/setter/deleter.",
      "explanation": "@property : `trade.mid_price` au lieu de `trade.mid_price()`. Permet d'ajouter de la logique dans un getter sans changer l'interface. `@mid_price.setter` : valide avant d'assigner. En finance : `@property def mid_price(self): return (self.bid + self.ask) / 2` — calculé dynamiquement, se comporte comme un attribut. Utile pour la backward compatibility (remplacer un attribut par un calcul)."
    },
    {
      "question": "[Python] Quelle est la différence entre `@staticmethod` et `@classmethod` ?",
      "options": [
        "staticmethod et classmethod sont identiques.",
        "`@staticmethod` : pas d'accès à self ou cls — fonction utilitaire dans la classe. `@classmethod` : reçoit la classe (cls) en premier argument — utile pour les factory methods.",
        "`@staticmethod` reçoit cls, `@classmethod` reçoit self.",
        "`@classmethod` ne peut pas être hérité."
      ],
      "answer": "`@staticmethod` : pas d'accès à self ou cls — fonction utilitaire dans la classe. `@classmethod` : reçoit la classe (cls) en premier argument — utile pour les factory methods.",
      "explanation": "@staticmethod : pas d'accès à l'instance ou la classe. `Trade.validate_isin(isin)` — utilitaire. @classmethod : reçoit cls → peut appeler `cls()` pour créer des instances (factory). `Trade.from_fix_message(msg)` : classmethod qui parse un message FIX et retourne un Trade. Héritage : classmethod utilise cls (la classe réelle, pas la base) → factory correcte pour les sous-classes."
    },
    {
      "question": "[Python] Que fait `zip([1,2,3], ['a','b','c'])` ?",
      "options": [
        "Trie les deux listes ensemble.",
        "Combine les deux itérables élément par élément en tuples : `[(1,'a'), (2,'b'), (3,'c')]`.",
        "Fusionne les deux listes en une seule liste plate.",
        "Crée un dictionnaire de 1→'a', 2→'b', 3→'c'."
      ],
      "answer": "Combine les deux itérables élément par élément en tuples : `[(1,'a'), (2,'b'), (3,'c')]`.",
      "explanation": "zip() retourne un itérateur de tuples. `dict(zip(keys, values))` : créer un dict rapidement. S'arrête au plus court des itérables. zip_longest (itertools) : remplit avec None. En finance : `zip(dates, prices)` puis `dict(zip(isins, prices))` — mapper les ISINs aux prix. `for date, pnl in zip(dates, pnls): plot(date, pnl)` — itérer sur deux listes ensemble."
    },
    {
      "question": "[Python NumPy] À quoi sert NumPy par rapport aux listes Python classiques ?",
      "options": [
        "NumPy est uniquement utile pour le deep learning.",
        "NumPy fournit des tableaux N-dimensionnels avec des opérations vectorisées rapides — calculs sur tableaux entiers sans boucles Python, bien plus rapide.",
        "NumPy remplace Pandas pour les DataFrames.",
        "NumPy est plus lent que les listes Python car il utilise plus de mémoire."
      ],
      "answer": "NumPy fournit des tableaux N-dimensionnels avec des opérations vectorisées rapides — calculs sur tableaux entiers sans boucles Python, bien plus rapide.",
      "explanation": "NumPy array vs liste Python : np.array([1,2,3]) + 1 = [2,3,4] sans boucle. Opérations vectorisées : calcul en C, pas en Python → 10-100x plus rapide. `np.dot(A, B)` : produit matriciel. `np.corrcoef(returns)` : matrice de corrélation. En AMM : calcul de VaR paramétrique, corrélations de portefeuille, pricing de dérivés — tous ces calculs nécessitent NumPy pour les performances."
    },
    {
      "question": "[Python] Comment créer une compréhension de dictionnaire ?",
      "options": [
        "`dict([x: x**2 for x in range(5)])`",
        "`{x: x**2 for x in range(5)}`",
        "`dict.comprehension(x**2 for x in range(5))`",
        "`{(x, x**2) for x in range(5)}`"
      ],
      "answer": "`{x: x**2 for x in range(5)}`",
      "explanation": "{key_expr: val_expr for item in iterable if condition}. `{x: x**2 for x in range(5)}` → {0:0, 1:1, 2:4, 3:9, 4:16}. `{t.isin: t.price for t in trades}` — dictionnaire ISIN→prix. Compréhension de set : `{x**2 for x in range(5)}` → {0, 1, 4, 9, 16}. Génératrice : `(x**2 for x in range(5))` — lazy, pas de crochets/accolades."
    }
  ],
  avance: [
    // ── SQL (Q1–Q25) ──
    {
      "question": "[SQL] Quelle est la différence entre `WHERE` et `HAVING` ?",
      "options": [
        "WHERE et HAVING sont identiques — HAVING est juste plus lisible.",
        "WHERE filtre les lignes individuelles AVANT le GROUP BY. HAVING filtre les groupes APRÈS le GROUP BY (sur les résultats agrégés).",
        "HAVING filtre avant GROUP BY, WHERE filtre après.",
        "WHERE est pour les jointures, HAVING pour les agrégations."
      ],
      "answer": "WHERE filtre les lignes individuelles AVANT le GROUP BY. HAVING filtre les groupes APRÈS le GROUP BY (sur les résultats agrégés).",
      "explanation": "Ordre d'exécution : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. WHERE age > 30 filtre d'abord les employés. GROUP BY regroupe les survivants. HAVING AVG(salary) > 50000 filtre les groupes. Erreur classique : `WHERE AVG(salary) > 50000` → erreur SQL car AVG n'est pas encore calculé à l'étape WHERE. Toujours utiliser HAVING pour filtrer sur des agrégats."
    },
    {
      "question": "[SQL JOIN] Quelle jointure retourne TOUTES les lignes de la table gauche, même sans correspondance à droite ?",
      "options": [
        "INNER JOIN",
        "LEFT JOIN (LEFT OUTER JOIN)",
        "CROSS JOIN",
        "FULL JOIN"
      ],
      "answer": "LEFT JOIN (LEFT OUTER JOIN)",
      "explanation": "LEFT JOIN : toutes les lignes de la table gauche + correspondances droite. Si pas de correspondance, NULL pour les colonnes de droite. Utilité : détecter les orphelins. `SELECT t.id, c.name FROM trades t LEFT JOIN counterparties c ON t.cpty_id = c.id WHERE c.id IS NULL` — trades sans contrepartie dans le référentiel. INNER JOIN : uniquement les correspondances. FULL JOIN : tout des deux côtés."
    },
    {
      "question": "[SQL Agrégation] Quelle requête calcule le salaire moyen par département uniquement pour les employés de plus de 30 ans ?",
      "options": [
        "SELECT department, AVG(salary) FROM employees GROUP BY department HAVING age > 30;",
        "SELECT department, AVG(salary) FROM employees WHERE age > 30 GROUP BY department;",
        "SELECT department, AVG(salary) FROM employees GROUP BY department, age WHERE age > 30;",
        "SELECT department, AVG(salary WHERE age > 30) FROM employees GROUP BY department;"
      ],
      "answer": "SELECT department, AVG(salary) FROM employees WHERE age > 30 GROUP BY department;",
      "explanation": "WHERE age > 30 filtre d'abord les lignes individuelles (avant groupement). GROUP BY department regroupe les lignes restantes. AVG(salary) calcule la moyenne du groupe. Si on avait mis HAVING age > 30 : erreur car age n'est pas une agrégation et n'est plus accessible après GROUP BY (sauf si dans le SELECT). WHERE pour les colonnes brutes, HAVING pour les agrégats."
    },
    {
      "question": "[SQL Index] Dans quelle situation un index améliore-t-il les performances ?",
      "options": [
        "Toujours — un index améliore toujours les performances.",
        "Pour les recherches (SELECT avec WHERE) sur des colonnes très sélectives dans de grandes tables. Contre-indiqué pour les petites tables ou les colonnes à faible cardinalité.",
        "Uniquement pour les jointures.",
        "Seulement pour les colonnes de type INTEGER."
      ],
      "answer": "Pour les recherches (SELECT avec WHERE) sur des colonnes très sélectives dans de grandes tables. Contre-indiqué pour les petites tables ou les colonnes à faible cardinalité.",
      "explanation": "Index utile : `SELECT * FROM trades WHERE trade_date = '2024-01-15'` sur une table de millions de trades — index sur trade_date transforme un scan O(n) en recherche O(log n). Index contre-indiqué : colonne booléenne (50/50 → scan quand même), petites tables (overhead de maintenance > gain), tables avec beaucoup d'insertions (l'index est mis à jour à chaque INSERT). EXPLAIN révèle si l'index est utilisé."
    },
    {
      "question": "[SQL Window Functions] À quoi sert `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)` ?",
      "options": [
        "Calcule le nombre de lignes dans chaque département.",
        "Attribue un rang à chaque ligne dans chaque partition (département), ordonné par salaire décroissant — sans GROUP BY, toutes les lignes sont conservées.",
        "Supprime les doublons dans chaque département.",
        "Calcule la somme cumulée des salaires par département."
      ],
      "answer": "Attribue un rang à chaque ligne dans chaque partition (département), ordonné par salaire décroissant — sans GROUP BY, toutes les lignes sont conservées.",
      "explanation": "Window functions : calculent sur un 'fenêtre' de lignes sans réduire le nombre de lignes (contrairement à GROUP BY). ROW_NUMBER() : rang unique 1,2,3... RANK() : rang avec ex-aequo (1,1,3). DENSE_RANK() : rang dense (1,1,2). SUM() OVER () : somme cumulative. En finance : `ROW_NUMBER() OVER (PARTITION BY desk ORDER BY pnl DESC)` — ranger les traders par P&L au sein de chaque desk."
    },
    {
      "question": "[SQL CTE] Quel est l'avantage d'utiliser un CTE (`WITH`) plutôt qu'une sous-requête ?",
      "options": [
        "Les CTEs sont toujours plus rapides que les sous-requêtes.",
        "Un CTE est nommé et réutilisable dans la même requête, améliore la lisibilité et peut être référencé plusieurs fois (évite de dupliquer la logique).",
        "Les CTEs permettent des jointures que les sous-requêtes ne permettent pas.",
        "Un CTE est exécuté une seule fois et mis en cache — toujours plus performant."
      ],
      "answer": "Un CTE est nommé et réutilisable dans la même requête, améliore la lisibilité et peut être référencé plusieurs fois (évite de dupliquer la logique).",
      "explanation": "CTE `WITH name AS (SELECT ...)` : nommé, lisible, réutilisable plusieurs fois dans la même requête. Performance : selon le SGBD, le CTE peut être matérialisé (mis en cache) ou inliné comme une sous-requête — pas garanti d'être plus rapide. Avantage principal : lisibilité et maintenance. CTE récursif : possible avec `WITH RECURSIVE` pour hiérarchies. En finance : calculer des métriques intermédiaires (P&L journalier) puis les réutiliser."
    },
    {
      "question": "[SQL Transaction] Dans quel cas utilise-t-on une transaction en trading ?",
      "options": [
        "Uniquement pour les requêtes SELECT.",
        "Quand plusieurs opérations doivent être atomiques : si l'une échoue, toutes sont annulées (ROLLBACK). Ex: décrémenter la position ET enregistrer le trade doit se faire entièrement ou pas du tout.",
        "Les transactions ne sont utiles que pour les bases de données Oracle.",
        "Pour accélérer les requêtes INSERT."
      ],
      "answer": "Quand plusieurs opérations doivent être atomiques : si l'une échoue, toutes sont annulées (ROLLBACK). Ex: décrémenter la position ET enregistrer le trade doit se faire entièrement ou pas du tout.",
      "explanation": "ACID : Atomicité = tout ou rien. BEGIN; UPDATE positions SET qty = qty - 100; INSERT INTO trades ...; COMMIT; Si l'INSERT échoue, le ROLLBACK annule le UPDATE → position incohérente évitée. En trading, une incohérence position/trade est catastrophique : le desk pense être flat mais la DB montre une position. Les transactions garantissent la cohérence même en cas de crash."
    },
    {
      "question": "[SQL] Quelle est la différence entre `DELETE`, `TRUNCATE` et `DROP` ?",
      "options": [
        "Les trois font la même chose — suppriment des données.",
        "DELETE : supprime des lignes avec condition, journalisé, rollbackable. TRUNCATE : vide toute la table rapidement, peu journalisé. DROP : supprime la table entière (structure + données).",
        "TRUNCATE est plus lent que DELETE.",
        "DROP peut être rollbacké contrairement à TRUNCATE."
      ],
      "answer": "DELETE : supprime des lignes avec condition, journalisé, rollbackable. TRUNCATE : vide toute la table rapidement, peu journalisé. DROP : supprime la table entière (structure + données).",
      "explanation": "DELETE FROM trades WHERE date < '2020-01-01' : supprime les vieilles lignes, transactionnel. TRUNCATE TABLE staging_trades : vide toute la table en une opération (reset de l'auto-increment), peu ou pas rollbackable selon le SGBD. DROP TABLE trades : la table n'existe plus (structure + données + index). En production trading : DELETE pour archivage sélectif, TRUNCATE pour vider les tables de staging, DROP JAMAIS sans sauvegarde."
    },
    {
      "question": "[SQL] Comment afficher le département avec le salaire moyen le plus élevé ?",
      "options": [
        "SELECT department FROM employees WHERE salary = MAX(salary);",
        "SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department ORDER BY avg_sal DESC LIMIT 1;",
        "SELECT department, MAX(AVG(salary)) FROM employees GROUP BY department;",
        "SELECT TOP department FROM employees GROUP BY department HAVING MAX(salary);"
      ],
      "answer": "SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department ORDER BY avg_sal DESC LIMIT 1;",
      "explanation": "Calcul de la moyenne par département (GROUP BY), alias avg_sal, tri par ordre décroissant (ORDER BY avg_sal DESC), prendre seulement le premier (LIMIT 1). Alternative avec window function : `SELECT department, avg_sal FROM (SELECT department, AVG(salary) as avg_sal, RANK() OVER (ORDER BY AVG(salary) DESC) as rnk FROM employees GROUP BY department) sub WHERE rnk = 1` — gère les ex-aequo."
    },
    {
      "question": "[SQL INNER JOIN] Que retourne `SELECT t.id, c.name FROM trades t INNER JOIN counterparties c ON t.cpty_id = c.id` ?",
      "options": [
        "Tous les trades, même ceux sans contrepartie dans le référentiel.",
        "Uniquement les trades dont le cpty_id a une correspondance dans la table counterparties.",
        "Toutes les contreparties, même celles sans trade.",
        "Le produit cartésien de toutes les trades et contreparties."
      ],
      "answer": "Uniquement les trades dont le cpty_id a une correspondance dans la table counterparties.",
      "explanation": "INNER JOIN = intersection. Seules les lignes avec une correspondance dans LES DEUX tables sont retournées. Un trade avec cpty_id = 999 qui n'existe pas dans counterparties est exclu du résultat. Pour inclure ces trades orphelins : LEFT JOIN. En finance : INNER JOIN pour les rapports sur les trades valides, LEFT JOIN pour les contrôles de cohérence (détecter les trades sans contrepartie)."
    },
    {
      "question": "[SQL] Que fait `COUNT(*)` vs `COUNT(salary)` ?",
      "options": [
        "Les deux comptent la même chose.",
        "`COUNT(*)` compte toutes les lignes incluant les NULL. `COUNT(salary)` compte uniquement les lignes où salary est non NULL.",
        "`COUNT(*)` est plus lent car il lit toutes les colonnes.",
        "`COUNT(salary)` compte les valeurs distinctes de salary."
      ],
      "answer": "`COUNT(*)` compte toutes les lignes incluant les NULL. `COUNT(salary)` compte uniquement les lignes où salary est non NULL.",
      "explanation": "COUNT(*) : toutes les lignes de la table ou du groupe. COUNT(col) : ignores les NULL de col. `SELECT COUNT(*), COUNT(salary) FROM employees` : si certains employés n'ont pas de salaire (NULL), COUNT(salary) < COUNT(*). COUNT(DISTINCT salary) : nombre de salaires distincts. En finance : COUNT(*) pour le nombre total de trades, COUNT(settlement_date) pour les trades avec une date de règlement renseignée."
    },
    {
      "question": "[SQL FULL OUTER JOIN] Quand utilise-t-on un FULL OUTER JOIN ?",
      "options": [
        "Quand on veut uniquement les correspondances entre deux tables.",
        "Quand on veut toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance — utile pour des réconciliations.",
        "FULL OUTER JOIN est identique à CROSS JOIN.",
        "Pour les jointures sur plus de deux tables."
      ],
      "answer": "Quand on veut toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance — utile pour des réconciliations.",
      "explanation": "FULL OUTER JOIN = LEFT JOIN + RIGHT JOIN. Retourne : correspondances + lignes gauche sans match (NULL droite) + lignes droite sans match (NULL gauche). En finance : réconciliation entre trades système A et système B → FULL JOIN révèle les trades présents dans A mais pas B (NULL côté B) et vice versa. WHERE A.id IS NULL OR B.id IS NULL → uniquement les discordances."
    },
    {
      "question": "[SQL] Comment écrire une requête qui liste les employés dont le salaire est supérieur à la moyenne de leur département ?",
      "options": [
        "SELECT * FROM employees WHERE salary > AVG(salary);",
        "SELECT e.* FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);",
        "SELECT * FROM employees GROUP BY department HAVING salary > AVG(salary);",
        "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"
      ],
      "answer": "SELECT e.* FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);",
      "explanation": "Sous-requête corrélée : pour chaque employé e, calcule la moyenne de son département. Sous-requête non corrélée (sans WHERE department = e.department) calculerait la moyenne globale. Alternative avec CTE : WITH dept_avg AS (SELECT department, AVG(salary) avg FROM employees GROUP BY department) SELECT e.* FROM employees e JOIN dept_avg d ON e.department = d.department WHERE e.salary > d.avg. CTE = plus lisible et souvent plus performant."
    },
    {
      "question": "[SQL NULL] Pourquoi `WHERE salary = NULL` ne retourne-t-il aucune ligne ?",
      "options": [
        "Car NULL est un mot-clé réservé qui ne peut pas être comparé.",
        "Car NULL représente 'valeur inconnue' — toute comparaison avec NULL retourne NULL (pas TRUE ni FALSE). Il faut utiliser `IS NULL` ou `IS NOT NULL`.",
        "Car `= NULL` est une erreur de syntaxe SQL.",
        "Car les NULL sont stockés différemment des valeurs normales."
      ],
      "answer": "Car NULL représente 'valeur inconnue' — toute comparaison avec NULL retourne NULL (pas TRUE ni FALSE). Il faut utiliser `IS NULL` ou `IS NOT NULL`.",
      "explanation": "NULL = 'inconnu'. NULL = NULL retourne NULL (pas TRUE). NULL != NULL retourne NULL. La clause WHERE filtre sur TRUE uniquement → NULL est exclu. Syntaxe correcte : WHERE salary IS NULL (pas de salaire). WHERE salary IS NOT NULL (a un salaire). COALESCE(salary, 0) : remplace NULL par 0 dans les calculs. En finance : NULL sur un champ de prix = donnée manquante, à traiter différemment d'un prix à 0."
    },
    {
      "question": "[SQL] Comment obtenir la liste des départements avec le nombre d'employés dans chacun, triés par effectif décroissant ?",
      "options": [
        "SELECT department, COUNT(*) FROM employees ORDER BY COUNT(*) DESC;",
        "SELECT department, COUNT(*) as effectif FROM employees GROUP BY department ORDER BY effectif DESC;",
        "SELECT department, SUM(1) FROM employees GROUP BY department SORT BY effectif;",
        "SELECT DISTINCT department, COUNT(*) FROM employees;"
      ],
      "answer": "SELECT department, COUNT(*) as effectif FROM employees GROUP BY department ORDER BY effectif DESC;",
      "explanation": "GROUP BY department : un groupe par département. COUNT(*) as effectif : nombre d'employés par groupe. ORDER BY effectif DESC : tri par effectif décroissant (l'alias du SELECT est utilisable dans ORDER BY). HAVING peut s'ajouter : HAVING COUNT(*) > 10 pour ne garder que les départements avec plus de 10 personnes. En finance : `GROUP BY desk ORDER BY COUNT(*) DESC` — desks avec le plus de traders."
    },

    // ── C++ AVANCÉ (Q16–Q35) ──
    {
      "question": "[C++ Low Latency] Qu'est-ce que le 'garbage-free programming' en C++ trading ?",
      "options": [
        "Utiliser un garbage collector comme en Java pour éviter les leaks.",
        "Ne jamais allouer ou désallouer de mémoire dynamiquement pendant la session de trading — tout est pré-alloué au démarrage et réutilisé via des object pools.",
        "Utiliser uniquement des variables globales pour éviter les allocations stack.",
        "Activer l'optimisation du compilateur pour supprimer le code mort."
      ],
      "answer": "Ne jamais allouer ou désallouer de mémoire dynamiquement pendant la session de trading — tout est pré-alloué au démarrage et réutilisé via des object pools.",
      "explanation": "Garbage-free = zéro malloc/free en runtime. Au démarrage : pré-allouer tous les objets nécessaires (OrderPool, MessagePool). Pendant la session : réutiliser ces objets (reset et retourner au pool). Avantage : latence déterministe, pas de jitter GC (même en C++ sans GC, malloc peut être lent). En AMM : critical path entre réception du market data et envoi de l'ordre doit être entièrement garbage-free."
    },
    {
      "question": "[C++ Atomic] Pourquoi préférer `std::atomic<bool>` à `bool` pour un flag partagé entre threads ?",
      "options": [
        "atomic<bool> prend moins de mémoire.",
        "Sans atomic, la lecture/écriture d'un bool partagé entre threads est un data race = undefined behavior. atomic garantit la visibilité et l'atomicité sans mutex.",
        "atomic<bool> est plus rapide que bool car il utilise les registres CPU directement.",
        "bool ne peut pas être partagé entre threads en C++."
      ],
      "answer": "Sans atomic, la lecture/écriture d'un bool partagé entre threads est un data race = undefined behavior. atomic garantit la visibilité et l'atomicité sans mutex.",
      "explanation": "En C++, même lire un bool modifié par un autre thread sans synchronisation = undefined behavior. Le compilateur peut mettre le bool en registre et ne jamais relire la mémoire (optimisation). atomic force la lecture/écriture en mémoire et garantit la visibilité entre threads. Pour les flags simples, atomic est plus léger qu'un mutex. Exemple : `std::atomic<bool> running{true}` — flag d'arrêt partagé entre le thread principal et les worker threads."
    },
    {
      "question": "[C++ Performance] Qu'est-ce que le 'false sharing' et comment l'éviter ?",
      "options": [
        "Deux threads partagent des données par erreur car les noms de variables sont similaires.",
        "Deux threads accèdent à des variables différentes mais sur la même cache line — l'invalidation de cache entre CPUs dégrade les performances. Solution : aligner chaque variable sur une cache line séparée.",
        "Un thread lit des données stale d'un cache L2.",
        "Une variable atomique partagée entre plus de deux threads."
      ],
      "answer": "Deux threads accèdent à des variables différentes mais sur la même cache line — l'invalidation de cache entre CPUs dégrade les performances. Solution : aligner chaque variable sur une cache line séparée.",
      "explanation": "Cache line = 64 bytes. `struct { int counter_a; int counter_b; }` partagé entre 2 threads. Même si thread A n'écrit que counter_a et thread B que counter_b, ils partagent la même cache line → invalidation croisée → ping-pong de cache = dégradation sévère. Solution C++17 : `alignas(64) int counter_a; alignas(64) int counter_b;` — chaque compteur sur sa propre cache line. Critical en AMM pour les structures partagées entre le thread de réception et le thread de traitement."
    },
    {
      "question": "[C++] Qu'est-ce qu'un lock-free data structure ?",
      "options": [
        "Une structure de données qui ne peut jamais être accédée par plusieurs threads.",
        "Une structure de données sûre pour plusieurs threads qui utilise des opérations atomiques (CAS - Compare And Swap) au lieu de mutex — évite les blocages et réduit la latence.",
        "Une structure protégée par un spin-lock au lieu d'un mutex.",
        "Une structure de données qui copie ses données pour chaque thread."
      ],
      "answer": "Une structure de données sûre pour plusieurs threads qui utilise des opérations atomiques (CAS - Compare And Swap) au lieu de mutex — évite les blocages et réduit la latence.",
      "explanation": "Lock-free = au moins un thread progresse à tout moment (pas de deadlock possible). CAS (Compare And Swap) : opération hardware atomique. SPSC Queue (Single Producer Single Consumer) est la plus simple à implémenter correctement. En AMM : ring buffer lock-free entre le thread de réception des market data et les threads de stratégie — élimine la latence du mutex sur le hot path. Difficile à implémenter correctement : préférer les bibliothèques testées (Intel TBB, Boost.Lockfree)."
    },
    {
      "question": "[C++ STL] Quelle est la complexité amortie de `std::vector::push_back` ?",
      "options": [
        "O(n) à chaque appel.",
        "O(1) amorti — O(n) lors d'un redimensionnement (copie tous les éléments), mais le doublement de capacité garantit O(1) en moyenne sur n push_backs.",
        "O(log n) car le vecteur maintient un arbre interne.",
        "O(1) garanti sans exception."
      ],
      "answer": "O(1) amorti — O(n) lors d'un redimensionnement (copie tous les éléments), mais le doublement de capacité garantit O(1) en moyenne sur n push_backs.",
      "explanation": "Quand capacity est atteinte, vector alloue 2x la capacité actuelle et copie. Coût de la copie = O(n). Mais ce coût est amorti sur les n insertions précédentes → O(1) amorti. `reserve(n)` avant d'insérer évite les réallocations. En trading : créer un vector et push_back des trades pendant la journée → reserve(100000) au démarrage pour éviter les réallocations pendant la session."
    },
    {
      "question": "[C++] Qu'est-ce que `constexpr` et quel est son avantage ?",
      "options": [
        "Un type de variable immuable similaire à const.",
        "Une directive qui force l'évaluation d'une expression à la compilation — élimine le coût runtime de calculs constants.",
        "Une façon de définir des constantes globales thread-safe.",
        "Un mot-clé pour les méthodes qui ne lancent pas d'exceptions."
      ],
      "answer": "Une directive qui force l'évaluation d'une expression à la compilation — élimine le coût runtime de calculs constants.",
      "explanation": "constexpr int SIZE = 1024 * 1024 : calculé à la compilation, pas au runtime. constexpr function : peut être évaluée à la compilation si les arguments sont constants. `std::array<Quote, 1024>` : taille constexpr → allocation stack statique. En AMM : `constexpr int MAX_ORDERS = 10000;` — taille des pools pré-alloués déterminée à la compilation. Templates de taille constexpr : `RingBuffer<Quote, 1024>` — taille fixée à la compilation, zéro overhead."
    },
    {
      "question": "[C++ Exception] Qu'est-ce que `noexcept` et pourquoi est-il important pour les performances ?",
      "options": [
        "Empêche la fonction de lever des exceptions — le programme crash si une exception est levée quand même.",
        "Indique au compilateur que la fonction ne lève pas d'exceptions — permet des optimisations (pas de stack unwinding) et est requis par la STL pour les move constructors.",
        "Rend la fonction plus rapide en désactivant les checks.",
        "Identique à `throw()` en C++11."
      ],
      "answer": "Indique au compilateur que la fonction ne lève pas d'exceptions — permet des optimisations (pas de stack unwinding) et est requis par la STL pour les move constructors.",
      "explanation": "noexcept : le compilateur peut optimiser les chemins de code sans prévoir le stack unwinding. std::vector::push_back utilise le move constructor si et seulement si il est noexcept (sinon copy, pour la strong exception guarantee). `Trade(Trade&&) noexcept = default;` — move constructor noexcept → vector peut se redimensionner efficacement. En low latency : annoter les fonctions du hot path avec noexcept pour permettre les optimisations du compilateur."
    },
    {
      "question": "[C++ Multithreading] Qu'est-ce qu'un deadlock et comment l'éviter ?",
      "options": [
        "Un deadlock est quand un programme tourne indéfiniment sans produire de résultat.",
        "Un deadlock survient quand deux threads s'attendent mutuellement (A attend le mutex de B, B attend le mutex de A). Solution : toujours acquérir les mutex dans le même ordre, ou utiliser std::lock() pour l'acquisition atomique de plusieurs mutex.",
        "Un deadlock est une fuite mémoire causée par les mutex.",
        "Un deadlock peut être résolu en utilisant std::atomic au lieu de mutex."
      ],
      "answer": "Un deadlock survient quand deux threads s'attendent mutuellement (A attend le mutex de B, B attend le mutex de A). Solution : toujours acquérir les mutex dans le même ordre, ou utiliser std::lock() pour l'acquisition atomique de plusieurs mutex.",
      "explanation": "Deadlock classique : thread A : lock(mutex1) puis lock(mutex2). Thread B : lock(mutex2) puis lock(mutex1). Si A a mutex1 et B a mutex2, les deux bloquent indéfiniment. Solutions : 1) Toujours même ordre d'acquisition. 2) `std::lock(mutex1, mutex2)` acquiert les deux atomiquement. 3) try_lock avec backoff. 4) Architecture sans partage de state (message passing). En trading : deadlock = freeze du moteur = position non gérée = risque majeur."
    },
    {
      "question": "[C++ Polymorphisme] Quelle est la différence entre polymorphisme statique (templates) et polymorphisme dynamique (virtual) en termes de performance ?",
      "options": [
        "Le polymorphisme dynamique est toujours plus rapide car il utilise les registres CPU.",
        "Polymorphisme statique (templates) : résolu à la compilation, zéro overhead runtime, code dupliqué par type. Polymorphisme dynamique (virtual) : indirection via vtable, cache miss potentiel, but un seul code exécutable.",
        "Il n'y a pas de différence de performance entre les deux.",
        "Les templates sont plus lents car ils génèrent plus de code."
      ],
      "answer": "Polymorphisme statique (templates) : résolu à la compilation, zéro overhead runtime, code dupliqué par type. Polymorphisme dynamique (virtual) : indirection via vtable, cache miss potentiel, but un seul code exécutable.",
      "explanation": "Virtual function call : 1 déréférencement vptr + 1 lecture vtable + 1 call indirect = 2 accès mémoire potentiellement hors cache. Template (CRTP) : l'appel est résolu à la compilation, inlinable, pas d'indirection. En AMM hot path : CRTP pour le polymorphisme sans overhead. Virtual pour le code hors hot path (configuration, reporting). Trade-off : templates = temps de compilation plus long, code plus volumineux."
    },
    {
      "question": "[C++] Qu'est-ce que `std::optional` et dans quel cas l'utiliser ?",
      "options": [
        "Un smart pointer pour les objets qui peuvent être null.",
        "Un wrapper qui représente une valeur potentiellement absente — alternative aux pointeurs nullable ou aux valeurs sentinelles (-1, NaN) pour signaler l'absence d'une valeur.",
        "Un type qui peut contenir différents types de valeurs.",
        "Un conteneur thread-safe pour une valeur partagée."
      ],
      "answer": "Un wrapper qui représente une valeur potentiellement absente — alternative aux pointeurs nullable ou aux valeurs sentinelles (-1, NaN) pour signaler l'absence d'une valeur.",
      "explanation": "std::optional<double> price = getMarketPrice(isin); if(price.has_value()) use(*price); else handleMissingPrice(); Avantages : explicite (le type de retour dit 'peut être absent'), pas de risque de nullptr, pas de valeur sentinelle (-1 pourrait être un prix valide). En trading : `std::optional<Quote> getBestBid(const std::string& isin)` — retourne nullopt si aucun bid disponible. Plus sûr que retourner 0.0 ou NaN."
    },
    {
      "question": "[C++] Qu'est-ce que le pattern CRTP (Curiously Recurring Template Pattern) ?",
      "options": [
        "Un pattern pour créer des singletons avec des templates.",
        "Une technique de polymorphisme statique : `class Derived : public Base<Derived>` — la classe de base template connaît le type dérivé à la compilation, permettant des appels sans vtable.",
        "Un pattern pour éviter les copies dans les templates.",
        "Une façon d'implémenter le pattern Observer sans virtual."
      ],
      "answer": "Une technique de polymorphisme statique : `class Derived : public Base<Derived>` — la classe de base template connaît le type dérivé à la compilation, permettant des appels sans vtable.",
      "explanation": "CRTP : `template<typename Derived> class Strategy { void execute() { static_cast<Derived*>(this)->execute_impl(); } }` `class MarketMakerStrategy : public Strategy<MarketMakerStrategy>`. L'appel à execute_impl() est résolu à la compilation — zéro overhead vtable. En AMM : stratégies de trading comme CRTP pour éviter l'overhead virtual sur le hot path de traitement des market data. Utilisé dans les bibliothèques performantes (Eigen, Boost.Spirit)."
    },

    // ── PYTHON AVANCÉ (Q36–Q50) ──
    {
      "question": "[Python] Qu'est-ce qu'un générateur et quel est son avantage ?",
      "options": [
        "Un générateur est un type de liste immuable.",
        "Une fonction qui utilise `yield` pour produire des valeurs à la demande (lazy evaluation) — économise la mémoire pour les grands datasets sans tout charger en même temps.",
        "Un objet qui génère des nombres aléatoires.",
        "Un décorateur qui accélère les fonctions."
      ],
      "answer": "Une fonction qui utilise `yield` pour produire des valeurs à la demande (lazy evaluation) — économise la mémoire pour les grands datasets sans tout charger en même temps.",
      "explanation": "def trade_stream(): for trade in huge_file: yield parse(trade). Chaque appel à next() avance jusqu'au prochain yield. Avantage : pas besoin de charger tout le fichier en mémoire. Compréhension génératrice : (x**2 for x in range(1000000)) — lazy, pas de liste en mémoire. En finance : streamer des millions de ticks historiques pour le backtesting sans OutOfMemory."
    },
    {
      "question": "[Python] Qu'est-ce que le GIL (Global Interpreter Lock) en Python ?",
      "options": [
        "Un mécanisme de garbage collection automatique.",
        "Un verrou global qui empêche plusieurs threads Python d'exécuter du bytecode Python simultanément — limite le vrai parallélisme CPU. Contournement : multiprocessing ou C extensions (NumPy libère le GIL).",
        "Un système de logging global intégré à CPython.",
        "Un mécanisme de sécurité pour les accès aux fichiers."
      ],
      "answer": "Un verrou global qui empêche plusieurs threads Python d'exécuter du bytecode Python simultanément — limite le vrai parallélisme CPU. Contournement : multiprocessing ou C extensions (NumPy libère le GIL).",
      "explanation": "GIL : en CPython, un seul thread exécute du bytecode Python à la fois. Pour le CPU-bound : threads Python n'apportent pas de gain (GIL). Pour l'I/O-bound : threads utiles (le GIL est relâché pendant les I/O). Solutions : multiprocessing (plusieurs processus, chacun avec son GIL), NumPy/Pandas (code C libère le GIL), ou utiliser PyPy. En AMM : Python pour l'analyse offline. C++ pour le runtime critique (pas de GIL)."
    },
    {
      "question": "[Python] Quelle est la différence entre `deepcopy` et `copy` ?",
      "options": [
        "copy() est plus lent que deepcopy().",
        "`copy.copy()` : copie superficielle — copie l'objet mais pas les objets imbriqués (les références sont partagées). `copy.deepcopy()` : copie récursive complète de tous les objets imbriqués.",
        "deepcopy() fonctionne uniquement sur les listes.",
        "copy() copie la structure, deepcopy() copie les données."
      ],
      "answer": "`copy.copy()` : copie superficielle — copie l'objet mais pas les objets imbriqués (les références sont partagées). `copy.deepcopy()` : copie récursive complète de tous les objets imbriqués.",
      "explanation": "portfolio = Portfolio([Trade1, Trade2]). shallow = copy(portfolio) : nouveau Portfolio mais les mêmes objets Trade. Modifier shallow.trades[0].qty modifie aussi l'original. deep = deepcopy(portfolio) : tous les objets sont copiés → complètement indépendant. En finance : deepcopy pour sauvegarder un état de portefeuille avant une simulation (scenario analysis) — les modifications du scénario ne doivent pas affecter le portefeuille réel."
    },
    {
      "question": "[Python Context Manager] Qu'est-ce que `__enter__` et `__exit__` permettent de faire ?",
      "options": [
        "Définir comment un objet est initialisé et détruit.",
        "Implémenter le protocol `with` — `__enter__` s'exécute en entrant le bloc `with`, `__exit__` s'exécute en sortant (même en cas d'exception).",
        "Surcharger les opérateurs + et - d'une classe.",
        "Définir des méthodes de classe privées."
      ],
      "answer": "Implémenter le protocol `with` — `__enter__` s'exécute en entrant le bloc `with`, `__exit__` s'exécute en sortant (même en cas d'exception).",
      "explanation": "`with` = RAII Python. __enter__ : acquiert la ressource (ouvre connexion DB, lock mutex). __exit__(self, exc_type, exc_val, exc_tb) : libère la ressource même si exception. `with OracleConnection(config) as conn: conn.execute(query)` — connexion fermée garantie. `contextlib.contextmanager` : crée un context manager avec yield. En finance : transactions DB, locks sur les positions, timers de performance."
    },
    {
      "question": "[Python] Comment fonctionne l'héritage multiple en Python et qu'est-ce que le MRO ?",
      "options": [
        "Python ne supporte pas l'héritage multiple.",
        "Python supporte l'héritage multiple. Le MRO (Method Resolution Order) détermine l'ordre de recherche des méthodes — calculé par l'algorithme C3 linearization. `ClassName.__mro__` affiche l'ordre.",
        "L'héritage multiple n'est possible qu'avec des interfaces (classes abstraites).",
        "Le MRO est uniquement pour les méthodes __init__."
      ],
      "answer": "Python supporte l'héritage multiple. Le MRO (Method Resolution Order) détermine l'ordre de recherche des méthodes — calculé par l'algorithme C3 linearization. `ClassName.__mro__` affiche l'ordre.",
      "explanation": "class C(A, B) : hérite de A et B. Si A et B ont tous les deux une méthode foo(), Python utilise le MRO pour choisir. MRO C3 : gauche à droite, depth-first, en respectant la cohérence. `super()` suit le MRO. `C.__mro__` : (C, A, B, object). En finance : mixin pattern — `class AuditedTrade(Trade, AuditMixin, LogMixin)` combine comportements sans diamant problématique."
    },
    // ── C++ SUPPLÉMENTAIRES AVANCÉ ──
    {
      "question": "[C++] Pourquoi C++ et pas Python pour le moteur de trading en production ?",
      "options": [
        "Python n'existe pas sur Linux.",
        "C++ compilé = exécution directe, latence microseconde prévisible, contrôle mémoire total, pas de GIL. Python = overhead interpréteur, GIL limite le parallélisme CPU, GC imprévisible.",
        "Python ne supporte pas le multithreading.",
        "C++ est plus facile à déboguer que Python."
      ],
      "answer": "C++ compilé = exécution directe, latence microseconde prévisible, contrôle mémoire total, pas de GIL. Python = overhead interpréteur, GIL limite le parallélisme CPU, GC imprévisible.",
      "explanation": "Question piège classique en entretien AMM. C++ hot path : réception FIX → parsing → décision → envoi ordre en < 10µs. Python ne peut pas atteindre ces latences (interpréteur Python = ~100x plus lent sur les boucles). GIL Python empêche le vrai parallélisme CPU. GC Python = pauses imprévisibles. Répartition réelle : C++ pour tout ce qui est temps réel. Python pour backtesting, analyse, reporting, scripts de configuration."
    },
    {
      "question": "[C++ Trading] Comment diagnostiquer un programme C++ qui consomme trop de CPU en production ?",
      "options": [
        "Ajouter des `printf` partout dans le code.",
        "Utiliser `perf stat`/`perf record` + `perf report` pour profiler les fonctions les plus coûteuses, ou `valgrind --callgrind` pour l'analyse de cache.",
        "Compiler en mode Debug et relancer en production.",
        "Ajouter `sleep(1)` pour réduire la consommation CPU."
      ],
      "answer": "Utiliser `perf stat`/`perf record` + `perf report` pour profiler les fonctions les plus coûteuses, ou `valgrind --callgrind` pour l'analyse de cache.",
      "explanation": "Profiling C++ en production : `perf stat ./trading_engine` donne les statistiques globales (instructions, cache misses, branches). `perf record -g ./engine && perf report` : flame graph des fonctions les plus coûteuses. `valgrind --tool=callgrind --cache-sim=yes` : analyse les cache miss. `gprof` : profiling basique avec instrumentation à la compilation. En trading : identifier si le bottleneck est dans le parsing des messages FIX, le calcul de pricing, ou les I/O réseau."
    },
    {
      "question": "[C++ Memory] Qu'est-ce qu'un memory leak et comment le détecter ?",
      "options": [
        "Un bug qui fait que le programme écrit en dehors des bornes d'un tableau.",
        "Mémoire allouée dynamiquement (new/malloc) qui n'est jamais libérée (delete/free) — la mémoire du processus croît indéfiniment. Détection : valgrind --leak-check=full ou AddressSanitizer.",
        "Un bug qui fait que deux pointeurs pointent vers la même zone mémoire.",
        "Un buffer trop petit pour contenir les données reçues."
      ],
      "answer": "Mémoire allouée dynamiquement (new/malloc) qui n'est jamais libérée (delete/free) — la mémoire du processus croît indéfiniment. Détection : valgrind --leak-check=full ou AddressSanitizer.",
      "explanation": "Memory leak : `void tick() { auto* msg = new Message(data); process(msg); /* oubli delete msg */ }` appelé des milliers de fois/seconde → OOM (Out Of Memory) progressif. Détection : valgrind --leak-check=full trace chaque allocation non libérée. AddressSanitizer (ASan) : `-fsanitize=address` à la compilation, détecte au runtime avec overhead. En production : smart pointers (unique_ptr) éliminent les leaks par design — RAII garantit la libération."
    },
    {
      "question": "[C++ Undefined Behavior] Parmi ces opérations, laquelle est un undefined behavior en C++ ?",
      "options": [
        "Déclarer deux variables avec le même nom dans des scopes différents.",
        "Déréférencer un pointeur null (`*ptr` quand ptr == nullptr) ou accéder à un index hors bornes d'un array (`arr[size]`).",
        "Appeler une méthode virtuelle dans le destructeur.",
        "Créer un objet sur le stack dans une fonction qui retourne void."
      ],
      "answer": "Déréférencer un pointeur null (`*ptr` quand ptr == nullptr) ou accéder à un index hors bornes d'un array (`arr[size]`).",
      "explanation": "Undefined behavior (UB) en C++ = le standard ne définit pas le comportement. Le programme peut crasher, retourner des données corrompues, ou sembler fonctionner (le pire cas). UB classiques : déréférence nullptr, accès hors bornes, integer overflow signé, data race, utilisation après free. En trading : UB intermittent peut corrompre les prix ou les positions sans crash visible — catastrophique. Détecter avec UBSan (`-fsanitize=undefined`)."
    },

    // ── PYTHON SUPPLÉMENTAIRES AVANCÉ ──
    {
      "question": "[Python] Qu'est-ce que `*args` et `**kwargs` dans une définition de fonction ?",
      "options": [
        "Des pointeurs comme en C++.",
        "`*args` capture les arguments positionnels supplémentaires en tuple. `**kwargs` capture les arguments nommés supplémentaires en dictionnaire.",
        "`*args` est obligatoire, `**kwargs` est optionnel.",
        "Des décorateurs spéciaux pour les fonctions variadiques."
      ],
      "answer": "`*args` capture les arguments positionnels supplémentaires en tuple. `**kwargs` capture les arguments nommés supplémentaires en dictionnaire.",
      "explanation": "`def log(*args, **kwargs): print(args, kwargs)`. `log('ERROR', 'Trade failed', code=500, isin='FR...')` → args=('ERROR','Trade failed'), kwargs={'code':500,'isin':'FR...'}. `*` dans un appel dépack une liste : `func(*[1,2,3])` = `func(1,2,3)`. `**` dépack un dict : `func(**{'a':1})` = `func(a=1)`. Utile pour les wrappers/décorateurs qui passent les arguments sans les connaître."
    },
    {
      "question": "[Python] Quelle est la différence entre `is` et `==` en Python ?",
      "options": [
        "Il n'y a pas de différence — les deux testent l'égalité.",
        "`==` teste l'égalité de valeur (`__eq__`). `is` teste l'identité — même objet en mémoire (même adresse). `None` doit toujours être comparé avec `is None`.",
        "`is` est plus rapide que `==`.",
        "`is` est pour les types primitifs, `==` pour les objets."
      ],
      "answer": "`==` teste l'égalité de valeur (`__eq__`). `is` teste l'identité — même objet en mémoire (même adresse). `None` doit toujours être comparé avec `is None`.",
      "explanation": "a = [1,2,3]; b = [1,2,3] → a == b est True (même valeur). a is b est False (objets différents). a = b → a is b est True (même référence). Cas important : `x is None` pour tester None (PEP8). `x == None` fonctionne mais peut être surchargé par __eq__. Integer interning : Python réutilise les objets pour les petits entiers (-5 à 256) → `a = 256; b = 256; a is b` peut être True, mais c'est un détail d'implémentation, pas à exploiter."
    },
    {
      "question": "[Python] Qu'est-ce qu'un `dataclass` en Python et quel est son avantage ?",
      "options": [
        "Une classe qui ne peut contenir que des données (pas de méthodes).",
        "Un décorateur `@dataclass` qui génère automatiquement `__init__`, `__repr__`, `__eq__` à partir des annotations de type — réduit le boilerplate.",
        "Une classe immuable similaire à un namedtuple.",
        "Un type de dictionnaire optimisé pour les données structurées."
      ],
      "answer": "Un décorateur `@dataclass` qui génère automatiquement `__init__`, `__repr__`, `__eq__` à partir des annotations de type — réduit le boilerplate.",
      "explanation": "@dataclass class Trade: isin: str; qty: int; price: float. Python génère automatiquement : `__init__(self, isin, qty, price)`, `__repr__` lisible, `__eq__` par valeur. @dataclass(frozen=True) : immuable (hashable). @dataclass(order=True) : ajoute les comparaisons (<, >). En finance : représenter des structures de données (Quote, Order, Position) sans écrire le boilerplate à la main. Plus lisible qu'un namedtuple, moins verbeux qu'une classe normale."
    },
    {
      "question": "[Python] Comment gérer une requête HTTP vers une API externe (ex: Bloomberg) en Python ?",
      "options": [
        "Utiliser `import http` et gérer les sockets manuellement.",
        "Utiliser la bibliothèque `requests` : `response = requests.get(url, headers=headers)` puis `response.json()` ou `response.text`.",
        "Utiliser uniquement `urllib` car requests n'est pas inclus dans Python.",
        "Python ne peut pas faire de requêtes HTTP."
      ],
      "answer": "Utiliser la bibliothèque `requests` : `response = requests.get(url, headers=headers)` puis `response.json()` ou `response.text`.",
      "explanation": "requests est le standard de facto pour les requêtes HTTP en Python. `requests.get(url)`, `.post(url, json=data)`. `response.status_code` : 200=OK, 404=Not Found, 500=Server Error. `response.json()` : parse le JSON automatiquement. `response.raise_for_status()` : lève une exception si erreur HTTP. Pour les API async : `aiohttp` ou `httpx`. En finance : interroger des APIs REST (Bloomberg Data License, Reuters Eikon, API interne de risque)."
    },
    {
      "question": "[Python Pandas] Comment lire un fichier CSV avec Pandas et filtrer les lignes ?",
      "options": [
        "`pd.open('file.csv')` puis `.where(col > 0)`",
        "`df = pd.read_csv('trades.csv')` puis `df[df['pnl'] > 0]` pour filtrer.",
        "`df = pd.DataFrame.from_csv('file.csv')` puis `df.filter(pnl > 0)`",
        "Pandas ne peut pas lire les fichiers CSV."
      ],
      "answer": "`df = pd.read_csv('trades.csv')` puis `df[df['pnl'] > 0]` pour filtrer.",
      "explanation": "pd.read_csv() : lit un CSV en DataFrame. Options utiles : sep=';' (séparateur), parse_dates=['date'], dtype={'price': float}. df[condition] : filtre booléen. df[df['pnl'] > 0] retourne les lignes où pnl > 0. df.query('pnl > 0') : alternative plus lisible. Filtres multiples : df[(df['desk']=='RATES') & (df['pnl'] > 0)]. En AMM : lire les exports de trades Oracle, filtrer par desk/date/counterparty pour l'analyse P&L."
    },
    {
      "question": "[Python] Qu'est-ce que `asyncio` et dans quel contexte l'utiliser ?",
      "options": [
        "Un framework pour le calcul parallèle sur plusieurs CPU.",
        "Un module pour la programmation asynchrone avec `async/await` — idéal pour les I/O concurrentes (HTTP, WebSockets, DB) sans créer de threads pour chaque connexion.",
        "Un remplacement du module threading pour éviter le GIL.",
        "Un scheduler de tâches pour remplacer cron."
      ],
      "answer": "Un module pour la programmation asynchrone avec `async/await` — idéal pour les I/O concurrentes (HTTP, WebSockets, DB) sans créer de threads pour chaque connexion.",
      "explanation": "asyncio : event loop qui gère des coroutines. `async def fetch_price(isin): response = await session.get(url)`. Idéal I/O-bound : interroger 100 APIs simultanément sans 100 threads. `asyncio.gather(*[fetch(i) for i in isins])` : toutes les requêtes en parallèle. Pas adapté CPU-bound (GIL). En finance : scraper des prix de plusieurs sources simultanément, WebSocket pour les feeds de market data en temps réel, gestion de multiples connexions FIX."
    },

    // ── LINUX SUPPLÉMENTAIRES AVANCÉ ──
    {
      "question": "[Linux] Que fait `find /var/log -name '*.log' -mtime -1` ?",
      "options": [
        "Supprime tous les fichiers .log de plus d'un jour.",
        "Trouve tous les fichiers .log dans /var/log modifiés dans les dernières 24 heures.",
        "Liste les fichiers .log classés par taille.",
        "Cherche le mot 'mtime' dans les fichiers .log."
      ],
      "answer": "Trouve tous les fichiers .log dans /var/log modifiés dans les dernières 24 heures.",
      "explanation": "find chemin -options. -name '*.log' : fichiers dont le nom se termine par .log. -mtime -1 : modifiés il y a moins de 1 jour (24h). -mtime +7 : modifiés il y a plus de 7 jours. -size +100M : fichiers de plus de 100MB. -type f : fichiers uniquement (pas les dossiers). Combiner : `find /var/log -name '*.log' -mtime +30 -exec rm {} \\;` — supprimer les vieux logs. En trading : identifier quels fichiers de log ont été écrits pendant la session du jour."
    },

    // ── QUESTION FINALE ──
    {
      "question": "[Entretien AMM] Si deux threads modifient la même variable `double price` simultanément sans synchronisation, que se passe-t-il ?",
      "options": [
        "Rien — les doubles sont atomiques sur les processeurs modernes.",
        "Data race = undefined behavior en C++. Le résultat peut être n'importe quelle valeur, voire une valeur partiellement écrite (déchirement). Solution : std::atomic<double> ou mutex.",
        "Le dernier thread à écrire gagne toujours — résultat déterministe.",
        "Le programme crashe avec une SIGSEGV."
      ],
      "answer": "Data race = undefined behavior en C++. Le résultat peut être n'importe quelle valeur, voire une valeur partiellement écrite (déchirement). Solution : std::atomic<double> ou mutex.",
      "explanation": "Question piège d'entretien fréquente. double = 8 bytes. Sur certaines architectures, l'écriture de 8 bytes n'est pas atomique → un thread peut lire une valeur à moitié écrite (tearing). En C++, même si l'architecture garantit l'atomicité hardware, la norme C++ dit : data race = UB. Le compilateur peut réordonner les opérations, mettre en cache en registre, etc. Solution : `std::atomic<double>` (C++20) ou `std::mutex`. En trading : le prix partagé entre le thread de réception et le thread de décision doit être protégé."
    }

    // ── PYTHON AVANCÉ ──

      "options": [
        "Pandas est plus lisible mais pas plus rapide.",
        "Pandas utilise NumPy (code C vectorisé) en interne — les opérations sur colonnes entières sont 10-100x plus rapides que des boucles Python car elles évitent le bytecode Python et l'overhead de la boucle.",
        "Pandas est plus rapide car il utilise plusieurs threads automatiquement.",
        "Pandas compile Python en C++ à la volée."
      ],
      "answer": "Pandas utilise NumPy (code C vectorisé) en interne — les opérations sur colonnes entières sont 10-100x plus rapides que des boucles Python car elles évitent le bytecode Python et l'overhead de la boucle.",
      "explanation": "`for trade in trades: total += trade['pnl']` → lent (interprétation bytecode à chaque itération). `df['pnl'].sum()` → appel C vectorisé, 100x plus rapide. Vectorisation = opérations sur le tableau entier sans boucle Python. Règle Pandas : éviter `iterrows()` (lent), préférer `apply()` ou mieux les opérations vectorisées directes. En AMM : `df.groupby('desk')['pnl'].sum()` en quelques ms sur des millions de trades."
    },

    // ── LINUX AVANCÉ SUPPLÉMENTAIRES ──
    {
      "question": "[Linux] Quelle commande permet de compter le nombre de lignes dans un fichier ?",
      "options": [
        "`count file.txt`",
        "`wc -l file.txt`",
        "`lines file.txt`",
        "`grep -count file.txt`"
      ],
      "answer": "`wc -l file.txt`",
      "explanation": "wc (word count) avec -l compte les lignes. wc -w : mots. wc -c : octets. wc -m : caractères. `cat app.log | grep 'ERROR' | wc -l` : compter les erreurs dans un log. `wc -l *.log` : nombre de lignes dans chaque fichier de log. En trading : `grep 'FILL' session.log | wc -l` — combien d'ordres exécutés pendant la session."
    },
    {
      "question": "[Linux] Que fait la commande `kill -9 PID` ?",
      "options": [
        "Redemarre proprement le processus.",
        "Envoie SIGKILL — arrêt immédiat et forcé du processus, sans nettoyage. Le processus ne peut pas ignorer ce signal.",
        "Suspend le processus temporairement.",
        "Envoie SIGTERM — demande au processus de s'arrêter proprement."
      ],
      "answer": "Envoie SIGKILL — arrêt immédiat et forcé du processus, sans nettoyage. Le processus ne peut pas ignorer ce signal.",
      "explanation": "kill PID = SIGTERM (15) : demande polie d'arrêt, le processus peut le gérer (flush logs, fermer connexions). kill -9 PID = SIGKILL : arrêt immédiat, impossible à intercepter ou ignorer. En trading : toujours essayer SIGTERM d'abord pour un arrêt propre (flush des ordres en attente, fermeture des connexions FIX). SIGKILL uniquement si le processus ne répond pas — risque de laisser des données incomplètes."
    },
    {
      "question": "[Linux] Comment vérifier l'espace mémoire disponible sur un système Linux ?",
      "options": [
        "`meminfo`",
        "`free -h`",
        "`ram -available`",
        "`top --memory`"
      ],
      "answer": "`free -h`",
      "explanation": "free -h (human readable) : affiche RAM totale, utilisée, libre, buffers/cache, swap. Colonnes importantes : total, used, free, available (mémoire disponible pour de nouvelles applications = free + reclaimable cache). `cat /proc/meminfo` : information détaillée. `vmstat` : statistiques VM (swap, pages). En trading : monitorer la RAM d'un moteur de market data qui accumule les prix en mémoire toute la journée."
    },
    {
      "question": "[Linux Réseau] Quelle commande teste la connectivité réseau vers un host ?",
      "options": [
        "`connect hostname`",
        "`ping hostname`",
        "`network-test hostname`",
        "`check hostname`"
      ],
      "answer": "`ping hostname`",
      "explanation": "ping hostname : envoie des paquets ICMP et mesure le RTT (round-trip time). ping -c 4 host : 4 paquets seulement. traceroute host : trace la route réseau (chaque hop). telnet host port : teste la connectivité TCP sur un port spécifique (ex: `telnet bloomberg-api.com 8194`). netcat (nc) : plus flexible. En trading : `ping feed.bloomberg.com` → vérifier que le feed market data est joignable. `telnet fix-engine.broker.com 9000` → vérifier la connexion FIX."
    },
    {
      "question": "[Linux Cron] Comment planifier un script tous les jours à 18h du lundi au vendredi avec cron ?",
      "options": [
        "`daily 18:00 weekdays /opt/script.sh`",
        "`0 18 * * 1-5 /opt/script.sh`",
        "`18 0 * * mon-fri /opt/script.sh`",
        "`cron daily 18 /opt/script.sh`"
      ],
      "answer": "`0 18 * * 1-5 /opt/script.sh`",
      "explanation": "Format cron : minute heure jour_mois mois jour_semaine. 0 18 : à 18h00. * * : tous les jours du mois, tous les mois. 1-5 : lundi(1) à vendredi(5). Exemples : `*/5 * * * *` toutes les 5 minutes. `0 8 * * 1` chaque lundi à 8h. `crontab -e` pour éditer. `crontab -l` pour lister. En AMM : génération automatique du rapport de fin de journée, archivage des logs, envoi des P&L aux risk managers."
    },
    {
      "question": "[Linux] Que fait `chmod +x script.sh` ?",
      "options": [
        "Ajoute le droit d'écriture au fichier pour tous les utilisateurs.",
        "Ajoute le bit d'exécution au fichier pour le propriétaire, le groupe et les autres — rend le fichier exécutable.",
        "Rend le fichier en lecture seule.",
        "Change le propriétaire du fichier vers root."
      ],
      "answer": "Ajoute le bit d'exécution au fichier pour le propriétaire, le groupe et les autres — rend le fichier exécutable.",
      "explanation": "chmod +x : ajoute x (exécution) pour tous (u+g+o). chmod u+x : uniquement le propriétaire. chmod -x : retire le droit d'exécution. Un script shell doit être exécutable pour être lancé avec `./script.sh`. Sans +x : `bash script.sh` fonctionne encore (interprète explicitement bash). En pratique : après avoir créé un nouveau script de démarrage trading, toujours `chmod +x start_engine.sh`."
    },

    // ── SQL SUPPLÉMENTAIRES ──
    {
      "question": "[SQL] Qu'est-ce qu'une clé primaire (PRIMARY KEY) ?",
      "options": [
        "La première colonne d'une table par convention.",
        "Une contrainte qui garantit l'unicité et la non-nullité d'une colonne (ou combinaison de colonnes) — identifiant unique de chaque ligne.",
        "Un index optionnel pour accélérer les recherches.",
        "Une clé étrangère qui référence une autre table."
      ],
      "answer": "Une contrainte qui garantit l'unicité et la non-nullité d'une colonne (ou combinaison de colonnes) — identifiant unique de chaque ligne.",
      "explanation": "PRIMARY KEY = UNIQUE + NOT NULL. Chaque table devrait en avoir une. `trade_id SERIAL PRIMARY KEY` : auto-incrémenté. Clé composite : `PRIMARY KEY (date, isin)`. Clé étrangère (FOREIGN KEY) : référence la PRIMARY KEY d'une autre table → assure l'intégrité référentielle. Sans PK, impossible d'identifier une ligne précise pour UPDATE ou DELETE. En trading : trade_id, position_id, order_id — toujours une PK auto-générée."
    },
    {
      "question": "[SQL] Que fait `COALESCE(value, alternative)` ?",
      "options": [
        "Additionne les deux valeurs si elles sont des nombres.",
        "Retourne le premier argument non-NULL — permet de substituer une valeur par défaut quand NULL.",
        "Compare les deux valeurs et retourne la plus grande.",
        "Convertit NULL en chaîne vide."
      ],
      "answer": "Retourne le premier argument non-NULL — permet de substituer une valeur par défaut quand NULL.",
      "explanation": "COALESCE(settlement_price, last_price, 0) : retourne settlement_price si non-NULL, sinon last_price, sinon 0. Très utile dans les calculs où NULL propagerait la nullité. `SUM(COALESCE(pnl, 0))` : traite les P&L manquants comme 0. `COALESCE(nickname, first_name, 'Unknown')` : fallback en cascade. En finance : COALESCE pour les prix de fallback (prix de marché → prix modèle → prix de la veille)."
    },
    {
      "question": "[SQL] Comment écrire une requête qui retourne les 5 employés les mieux payés ?",
      "options": [
        "SELECT * FROM employees WHERE salary IN TOP(5);",
        "SELECT * FROM employees ORDER BY salary DESC LIMIT 5;",
        "SELECT TOP 5 * FROM employees SORT salary;",
        "SELECT * FROM employees GROUP BY salary HAVING rank <= 5;"
      ],
      "answer": "SELECT * FROM employees ORDER BY salary DESC LIMIT 5;",
      "explanation": "ORDER BY salary DESC : tri par salaire décroissant. LIMIT 5 (MySQL/PostgreSQL) ou TOP 5 (SQL Server) ou ROWNUM <= 5 (Oracle). Pour les ex-aequo : RANK() OVER (ORDER BY salary DESC) peut retourner plus de 5 lignes. DENSE_RANK() ou ROW_NUMBER() pour contrôle précis. En finance : `SELECT trader, SUM(pnl) as total_pnl FROM trades GROUP BY trader ORDER BY total_pnl DESC LIMIT 10` — top 10 traders par P&L."
    },
    {
      "question": "[SQL] Qu'est-ce qu'une clé étrangère (FOREIGN KEY) et à quoi sert-elle ?",
      "options": [
        "Un index sur une colonne d'une autre table.",
        "Une contrainte qui assure l'intégrité référentielle — la valeur dans la colonne doit correspondre à une valeur existante dans la table référencée (ou être NULL).",
        "Une clé primaire d'une table externe.",
        "Un synonyme pour une clé primaire composite."
      ],
      "answer": "Une contrainte qui assure l'intégrité référentielle — la valeur dans la colonne doit correspondre à une valeur existante dans la table référencée (ou être NULL).",
      "explanation": "FOREIGN KEY (cpty_id) REFERENCES counterparties(id) : impossible d'insérer un trade avec un cpty_id qui n'existe pas dans counterparties. CASCADE DELETE : supprimer une contrepartie supprime automatiquement ses trades. En finance : intégrité référentielle essentielle — un trade sans contrepartie valide est une erreur de données. ON DELETE RESTRICT : protège contre les suppressions accidentelles de données référencées."
    },
    {
      "question": "[SQL] Quelle est la différence entre `UNION` et `UNION ALL` ?",
      "options": [
        "UNION fusionne les tables, UNION ALL fusionne les colonnes.",
        "UNION supprime les doublons entre les deux résultats. UNION ALL conserve tous les doublons — plus rapide car pas de déduplication.",
        "UNION ALL est obsolète en SQL moderne.",
        "UNION fonctionne uniquement avec des tables de même structure."
      ],
      "answer": "UNION supprime les doublons entre les deux résultats. UNION ALL conserve tous les doublons — plus rapide car pas de déduplication.",
      "explanation": "UNION : combine les résultats + supprime les doublons (tri interne coûteux). UNION ALL : combine les résultats sans déduplication — préférable quand les doublons sont impossibles ou acceptables. `SELECT isin FROM book_a UNION SELECT isin FROM book_b` : ISINs uniques dans les deux books. `SELECT isin FROM book_a UNION ALL SELECT isin FROM book_b` : tous les ISINs avec doublons (pour compter). En finance : toujours UNION ALL si on sait qu'il n'y a pas de doublons — performance."
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

const Page6_CppLinuxPythonSQL = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
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
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
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
      } else {
        handleNextQuestion();
      }
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
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            C++ / Linux / Python / SQL 🔹{" "}
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

export default Page6_CppLinuxPythonSQL;
