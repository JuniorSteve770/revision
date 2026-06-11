// src/projects/Project3/pages/Page7_Cpp.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Pointeurs & Références — Bases absolues",
    "answer": "**Pointeur** : variable contenant une adresse mémoire. Peut être `nullptr`, réassignable, arithmétique possible. `int* p = &x; *p = 42;` ◆ **Référence** : alias sur une variable existante. Jamais `nullptr`, non réassignable après init. `int& r = x; r = 42;` ◆ **`const T*`** : pointeur vers T immuable — on ne peut pas modifier la valeur. ◆ **`T* const`** : pointeur immuable — on ne peut pas changer où il pointe. ◆ **`const T* const`** : les deux sont figés. ◆ **Règle d'usage** : passer un gros objet en lecture → `const T&` (pas de copie, pas de nullptr). Nullable ou réassignable → pointeur. ◆ **⚠️ Piège** : `int& r;` est une erreur de compilation — une référence doit toujours être initialisée."
  },
  {
    "question": "Stack vs Heap — Mémoire en trading",
    "answer": "**Stack** : allocation automatique au démarrage du scope, libération automatique à la sortie. Ultra-rapide (décrément de pointeur). Taille limitée (~1–8 MB). `int x = 5;` ◆ **Heap** : `new`/`delete`. Durée de vie manuelle. Plus lent (appel malloc interne). Fragmentation possible. ◆ **Pourquoi éviter `new` en hot path** : malloc peut déclencher un appel système → jitter de latence non déterministe. Inacceptable sur un path critique à la microseconde. ◆ **Garbage-free programming** : tout alloué au démarrage (object pools, `std::array`), réutilisé pendant la session. Zéro allocation en runtime. ◆ **Memory leak** : `new` sans `delete` correspondant → mémoire jamais libérée, process grossit indéfiniment → OOM."
  },
  {
    "question": "Règle des 5 — Copie & Move",
    "answer": "**Copie superficielle (shallow)** : copy constructor par défaut copie les pointeurs — deux objets partagent la même mémoire = double-free à la destruction. ◆ **Copie profonde (deep)** : allouer une nouvelle zone et copier le contenu. ◆ **Règle des 5** : si tu définis un destructeur, définis aussi : copy constructor, copy assignment, move constructor, move assignment. ◆ **Move semantics (C++11)** : `std::move()` transfère la propriété sans copier. `Trade(Trade&& o) noexcept` — move constructor. L'objet source est laissé vide mais valide. ◆ **Quand move > copy** : retourner un `vector<Quote>` d'une fonction — move = O(1), copy = O(n). ◆ **RVO** : le compilateur évite souvent la copie/move automatiquement (Return Value Optimization)."
  },
  {
    "question": "Smart Pointers — unique_ptr / shared_ptr / weak_ptr",
    "answer": "**`unique_ptr<T>`** : propriété exclusive. Détruit à la sortie du scope. Pas de copie, seulement `std::move`. Zéro overhead. À préférer par défaut. ◆ **`shared_ptr<T>`** : propriété partagée via compteur de références atomique. Détruit quand compteur = 0. ◆ **`weak_ptr<T>`** : observe sans posséder — ne prévient pas la destruction. `lock()` retourne un `shared_ptr` si l'objet existe encore. ◆ **Cycle A → B → A** : les deux shared_ptr ne tombent jamais à 0 = memory leak silencieux. Casser avec `weak_ptr`. ◆ **En hot path** : éviter `shared_ptr` (incrément atomique du compteur = coût). Préférer `unique_ptr` ou ownership manuel avec pool. ◆ **`make_unique` / `make_shared`** : toujours préférer à `new` direct — exception-safe."
  },
  {
    "question": "const Correctness — Indispensable en production",
    "answer": "**`const` après une méthode** : `double getBid() const;` → la méthode ne modifie pas l'état de l'objet. Appelable sur un objet `const` ou une `const&`. ◆ **Règle** : tout getter doit être `const`. Si la méthode ne modifie rien, elle doit être `const`. ◆ **Avantages** : interface auto-documentée (lecture vs écriture), erreurs détectées à la compilation, permet le passage en `const&`. ◆ **`mutable`** : exception — un membre `mutable` peut être modifié dans une méthode `const` (ex: cache interne, mutex). ◆ **`constexpr`** : évaluation garantie à la compilation. `constexpr int POOL_SIZE = 10000;` → taille d'un pool allouée à la compile, pas au runtime. ◆ **⚠️ Erreur classique** : oublier `const` sur les getters empêche de passer l'objet en `const&` à une fonction."
  },
  {
    "question": "Multithreading — mutex, atomic, race condition",
    "answer": "**Race condition** : deux threads accèdent au même objet, au moins un en écriture, sans synchronisation → undefined behavior. ◆ **`std::mutex`** : verrou exclusif. `lock()` / `unlock()`. ◆ **`std::lock_guard<std::mutex>`** : RAII wrapper — déverrouille automatiquement à la sortie du scope, même si exception. ◆ **`std::atomic<T>`** : opération atomique sans verrou pour les types simples (int, bool, pointer). Plus léger qu'un mutex. ◆ **Mutex vs atomic** : atomic pour un compteur/flag simple. Mutex quand plusieurs variables doivent être modifiées ensemble de façon cohérente. ◆ **Deadlock** : thread A attend mutex de B, thread B attend mutex de A → blocage infini. Prévention : toujours acquérir les mutex dans le même ordre. ◆ **`std::lock(m1, m2)`** : acquisition atomique de deux mutex sans deadlock."
  },
  {
    "question": "STL Containers — Complexités clés",
    "answer": "**`std::vector`** : tableau contigu. `push_back` O(1) amorti. `operator[]` O(1). `find` O(n). Meilleure cache locality de tous les containers. ◆ **`std::map`** : arbre rouge-noir trié. `find` / `insert` / `erase` O(log n). Clés toujours triées. ◆ **`std::unordered_map`** : hash table. `find` / `insert` O(1) moyen, O(n) pire cas. Pas d'ordre. ◆ **`std::list`** : doublement chaîné. `insert`/`erase` O(1) si iterator. `find` O(n). Mauvais cache (nœuds épars). Rarement justifié en practice. ◆ **`std::deque`** : push_front/push_back O(1). Accès O(1). ◆ **Règle pratique** : préférer `vector` par défaut. `unordered_map` pour le lookup rapide par clé. `map` si l'ordre trié est nécessaire (order book par prix)."
  },
  {
    "question": "Polymorphisme — virtual, vtable, RAII",
    "answer": "**`virtual`** : méthode surchargeable dans les classes dérivées. Résolu au runtime via vtable. ◆ **vtable** : table de pointeurs de fonctions, une par classe. Chaque objet a un vptr. Appel virtuel = déréférence vptr + lecture vtable + call indirect = 2 accès mémoire. ◆ **Coût** : cache miss potentiel. Éviter dans les hot paths critiques. ◆ **Destructeur virtuel** : **obligatoire** dans toute classe de base si destruction via pointeur de base. Sans `virtual ~Base()`, `delete base_ptr` n'appelle que `~Base()` → les membres de Derived sont leakés. ◆ **`override`** (C++11) : vérifie à la compile que la méthode surcharge bien une virtuelle. ◆ **Classe abstraite** : contient au moins une pure virtual `= 0`. Non instanciable directement. ◆ **Polymorphisme statique (templates/CRTP)** : résolu à la compile, zéro overhead vtable — préférer pour les hot paths."
  },
  {
    "question": "Templates & Move — Programmation générique",
    "answer": "**Template de fonction** : `template<typename T> T max(T a, T b)` — une définition, code généré par type à la compilation. Zéro overhead runtime. ◆ **Template de classe** : `template<typename T, size_t N> class RingBuffer` — buffer circulaire de taille fixe, allouable sur stack. ◆ **`noexcept`** : indique que la fonction ne lève pas d'exception. Requis par la STL pour utiliser le move constructor lors du redimensionnement d'un vector (sinon copy). Performance critique. ◆ **SFINAE / `if constexpr`** : code conditionnel à la compilation selon le type. ◆ **`std::forward<T>`** : perfect forwarding — transmet un argument comme lvalue ou rvalue selon son type original. ◆ **`auto`** : déduction de type à la compilation. `auto it = map.find(key);` — lisible et correct sans redondance."
  },
  {
    "question": "RAII & Undefined Behavior — Pièges d'entretien",
    "answer": "**RAII** (Resource Acquisition Is Initialization) : lier la durée de vie d'une ressource à un objet. Destructeur toujours appelé → pas de ressource orpheline même en cas d'exception. `lock_guard`, `unique_ptr`, `fstream` sont tous RAII. ◆ **Undefined Behavior (UB)** : le standard ne définit pas le comportement. Peut crasher, corrompre silencieusement, ou sembler fonctionner. UB classiques : déréférence nullptr, accès hors bornes, integer overflow signé, data race, utilisation après free. ◆ **Tools de détection** : `valgrind --leak-check=full` (leaks), `AddressSanitizer -fsanitize=address` (out-of-bounds, use-after-free), `ThreadSanitizer -fsanitize=thread` (data races), `UBSan -fsanitize=undefined`. ◆ **False sharing** : deux threads accèdent à des variables différentes sur la même cache line → invalidation croisée. Fix : `alignas(64)`."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Pointeurs] Peut-on avoir une référence nulle en C++ ?",
      "options": [
        "Oui, en faisant `int& r = *((int*)nullptr);`",
        "Non — une référence doit toujours être initialisée avec un objet valide. Une référence nulle est undefined behavior.",
        "Oui, en déclarant `int& r = nullptr;`",
        "Non, mais on peut créer une référence à 0 avec `int& r = 0;`"
      ],
      "answer": "Non — une référence doit toujours être initialisée avec un objet valide. Une référence nulle est undefined behavior.",
      "explanation": "Par définition, une référence en C++ est un alias vers un objet existant. Techniquement `int& r = *((int*)nullptr)` compile mais est UB dès qu'on utilise r. Pour représenter l'absence de valeur, utiliser `int*` (nullable) ou `std::optional<int>` (C++17). C'est pourquoi en entretien : pointeur quand nullité possible, référence quand l'objet est garanti de ne pas être null."
    },
    {
      "question": "[Const] Quelle est la différence entre `const int*` et `int* const` ?",
      "options": [
        "Il n'y a pas de différence.",
        "`const int*` : pointeur vers entier immuable (on ne peut pas modifier *p). `int* const` : pointeur immuable (on ne peut pas changer p), mais *p est modifiable.",
        "`const int*` : pointeur immuable. `int* const` : valeur immuable.",
        "Seul `int* const` est valide en C++ moderne."
      ],
      "answer": "`const int*` : pointeur vers entier immuable (on ne peut pas modifier *p). `int* const` : pointeur immuable (on ne peut pas changer p), mais *p est modifiable.",
      "explanation": "Règle de lecture droite-gauche : `int* const p` → p est const (pointeur fixe). `const int* p` → *p est const (valeur fixe). `const int* const p` → tout est const. En trading : `const Quote* feed` permet de changer vers quelle quote on pointe mais pas de modifier la quote. `Quote* const feed` fixe le pointeur mais permet de modifier la quote. Question très fréquente en entretien."
    },
    {
      "question": "[Mémoire] Quelle est la différence principale entre stack et heap ?",
      "options": [
        "La stack est pour les types primitifs, le heap pour les objets.",
        "Stack : allocation/libération automatique et instantanée (scope), taille limitée. Heap : `new`/`delete`, durée de vie manuelle, potentiellement lent (appel OS).",
        "La stack est plus grande que le heap sur les serveurs modernes.",
        "Le heap est thread-safe, la stack ne l'est pas."
      ],
      "answer": "Stack : allocation/libération automatique et instantanée (scope), taille limitée. Heap : `new`/`delete`, durée de vie manuelle, potentiellement lent (appel OS).",
      "explanation": "Stack : décrément/incrément du stack pointer = nanoseconde. Heap : malloc appelle éventuellement l'OS pour obtenir de la mémoire → jitter. En AMM low latency, on évite new/delete sur le hot path. Tout est pré-alloué au démarrage (object pools). `int arr[1000]` sur la stack si taille connue à la compilation. `std::array<Quote, 1024>` — stack allocation, zéro overhead."
    },
    {
      "question": "[Copy] Qu'est-ce qu'un double-free et comment le provoquer ?",
      "options": [
        "Appeler `delete` deux fois sur le même pointeur — undefined behavior pouvant corrompre le heap ou crasher.",
        "Allouer deux fois le même bloc mémoire avec `new`.",
        "Copier un objet deux fois au lieu d'une.",
        "Utiliser `free()` et `delete` sur le même pointeur."
      ],
      "answer": "Appeler `delete` deux fois sur le même pointeur — undefined behavior pouvant corrompre le heap ou crasher.",
      "explanation": "Double-free classique avec le copy constructor par défaut : `class A { int* data; };`. `A a1; A a2 = a1;` → a1.data et a2.data pointent au même bloc. À la destruction : `delete a1.data` puis `delete a2.data` = double-free = UB. Solution : copy constructor avec copie profonde, ou utiliser `unique_ptr` qui interdit la copie. Rule of 5 : si tu as un destructeur qui libère, définis les 4 autres opérations spéciales."
    },
    {
      "question": "[Smart Pointers] Que se passe-t-il si on tente de copier un `unique_ptr` ?",
      "options": [
        "La copie crée un second unique_ptr partageant la propriété.",
        "Erreur de compilation — unique_ptr est non-copiable. Il faut utiliser `std::move()` pour transférer la propriété.",
        "La copie est autorisée mais le pointeur source devient nullptr.",
        "Le compilateur génère automatiquement un shared_ptr."
      ],
      "answer": "Erreur de compilation — unique_ptr est non-copiable. Il faut utiliser `std::move()` pour transférer la propriété.",
      "explanation": "unique_ptr a son copy constructor supprimé (`= delete`). `auto p2 = p1;` → erreur de compilation. `auto p2 = std::move(p1);` → transfert : p1 devient nullptr, p2 possède l'objet. Ce design enforcer l'unicité de propriété à la compilation. Pour partager, utiliser shared_ptr. En pratique : passer un unique_ptr à une fonction = `void f(std::unique_ptr<T> p)` → l'appelant cède la propriété explicitement via std::move."
    },
    {
      "question": "[Smart Pointers] Quand `shared_ptr` peut-il causer une fuite mémoire ?",
      "options": [
        "Quand on l'utilise avec un tableau.",
        "En cas de cycle de références : A contient un shared_ptr vers B, B contient un shared_ptr vers A — le compteur de référence ne tombe jamais à 0.",
        "Quand le shared_ptr est déclaré dans un thread secondaire.",
        "shared_ptr ne cause jamais de fuite mémoire."
      ],
      "answer": "En cas de cycle de références : A contient un shared_ptr vers B, B contient un shared_ptr vers A — le compteur de référence ne tombe jamais à 0.",
      "explanation": "Cycle A → B → A : les compteurs restent à 1 même quand tout le code utilisateur a fini. Les objets ne sont jamais détruits. Solution : briser le cycle avec `weak_ptr`. Dans un graphe de nœuds : les enfants pointent vers le parent avec weak_ptr, le parent pointe vers ses enfants avec shared_ptr. weak_ptr.lock() retourne un shared_ptr valide si l'objet existe encore, nullptr sinon."
    },
    {
      "question": "[Multithreading] Deux threads incrémentent `int counter = 0` simultanément. Que se passe-t-il ?",
      "options": [
        "counter = 2 garanti car les incréments sont séquentiels.",
        "Race condition : `counter++` est read-modify-write (non atomique). Les deux threads peuvent lire la même valeur → un incrément est perdu. Résultat indéterminé.",
        "Le compilateur détecte automatiquement le data race et le corrige.",
        "counter = 2 sur x86 car l'architecture garantit l'atomicité des entiers."
      ],
      "answer": "Race condition : `counter++` est read-modify-write (non atomique). Les deux threads peuvent lire la même valeur → un incrément est perdu. Résultat indéterminé.",
      "explanation": "counter++ = 3 opérations : LOAD counter → ADD 1 → STORE. Si thread A et B lisent tous les deux 0, l'un stocke 1, l'autre stocke 1 → résultat 1 au lieu de 2. Même si x86 garantit la cohérence de cache, la norme C++ dit : data race sur non-atomic = UB. Solutions : `std::atomic<int> counter` (plus léger) ou `std::mutex` + `lock_guard` (si plusieurs variables liées)."
    },
    {
      "question": "[Multithreading] À quoi sert `std::lock_guard` par rapport à `std::mutex` direct ?",
      "options": [
        "lock_guard est plus performant que le mutex direct.",
        "lock_guard est un wrapper RAII : il verrouille le mutex dans son constructeur et le déverrouille automatiquement dans son destructeur — même en cas d'exception.",
        "lock_guard permet de verrouiller plusieurs mutex simultanément.",
        "lock_guard fonctionne uniquement avec les variables atomiques."
      ],
      "answer": "lock_guard est un wrapper RAII : il verrouille le mutex dans son constructeur et le déverrouille automatiquement dans son destructeur — même en cas d'exception.",
      "explanation": "Sans lock_guard : `m.lock(); doWork(); m.unlock();` → si doWork() lève une exception, unlock() n'est jamais appelé = deadlock. Avec lock_guard : `std::lock_guard<std::mutex> lg(m);` → unlock garanti à la sortie du scope. `std::unique_lock` : plus flexible (trylock, unlock/relock manuels, transfer). `std::scoped_lock` (C++17) : plusieurs mutex sans deadlock."
    },
    {
      "question": "[STL] Quelle est la complexité de `std::vector::push_back` ?",
      "options": [
        "O(n) à chaque appel car le vecteur se redimensionne.",
        "O(1) garanti car le vecteur pré-alloue toujours assez.",
        "O(1) amorti — O(n) lors d'un redimensionnement, mais le doublement de capacité garantit O(1) en moyenne.",
        "O(log n) car le vecteur maintient une structure triée."
      ],
      "answer": "O(1) amorti — O(n) lors d'un redimensionnement, mais le doublement de capacité garantit O(1) en moyenne.",
      "explanation": "Quand capacity est atteinte, vector alloue 2× et copie. Coût O(n) mais rare. Amorti sur n insertions : chaque élément est copié en moyenne 1 fois → O(1) par insertion. `reserve(n)` évite les réallocations si la taille est connue. En trading : `trades.reserve(100000)` au démarrage → aucune réallocation pendant la session. Sans reserve, une réallocation au milieu de la session = pause de quelques ms."
    },
    {
      "question": "[STL] Quand choisir `std::unordered_map` plutôt que `std::map` ?",
      "options": [
        "Quand les clés sont des entiers.",
        "Quand on a besoin de lookup O(1) et que l'ordre des clés n'importe pas. map si les clés doivent être triées.",
        "unordered_map est toujours préférable car plus rapide.",
        "map est préférable car unordered_map peut avoir des collisions."
      ],
      "answer": "Quand on a besoin de lookup O(1) et que l'ordre des clés n'importe pas. map si les clés doivent être triées.",
      "explanation": "unordered_map : O(1) moyen, O(n) pire cas (collisions). map : O(log n) garanti, clés toujours triées. En trading : lookup de prix par ISIN → unordered_map (O(1) essentiel sur le hot path). Order book → map<double, vector<Order>> (prix triés pour trouver best bid/ask). Pour les clés sans hash function disponible ou pour l'itération ordonnée : map."
    },
    {
      "question": "[Virtual] Pourquoi un destructeur de classe de base doit-il être `virtual` ?",
      "options": [
        "Pour améliorer les performances de destruction.",
        "Sans `virtual`, `delete base_ptr` sur un objet Derived n'appelle que `~Base()` — les ressources allouées par Derived ne sont jamais libérées.",
        "C'est une convention de style, pas une obligation.",
        "virtual destructor est nécessaire uniquement si la classe dérivée a des membres dynamiques."
      ],
      "answer": "Sans `virtual`, `delete base_ptr` sur un objet Derived n'appelle que `~Base()` — les ressources allouées par Derived ne sont jamais libérées.",
      "explanation": "Classique d'entretien : `Base* p = new Derived(); delete p;`. Sans `virtual ~Base()` : seul ~Base() est appelé, ~Derived() est ignoré → si Derived alloue de la mémoire, elle n'est jamais libérée. Règle : toute classe destinée à être héritée doit avoir un destructeur virtual. Exception : si la classe n'a pas de membres virtuels et que l'héritage est purement statique (CRTP), pas nécessaire. `= default` suffit si pas de ressources manuelles."
    },
    {
      "question": "[RAII] Qu'est-ce que RAII et pourquoi est-ce fondamental en C++ ?",
      "options": [
        "Un pattern de design pour les systèmes en temps réel.",
        "Resource Acquisition Is Initialization : lier la durée de vie d'une ressource à un objet. Le destructeur libère toujours la ressource, même si une exception est levée.",
        "Un acronyme pour Random Access Interface Iterator.",
        "Une technique d'optimisation pour réduire les allocations heap."
      ],
      "answer": "Resource Acquisition Is Initialization : lier la durée de vie d'une ressource à un objet. Le destructeur libère toujours la ressource, même si une exception est levée.",
      "explanation": "RAII est le pilier de la gestion des ressources en C++. Exemples : unique_ptr (mémoire), lock_guard (mutex), fstream (fichier), connection wrapper (DB). Sans RAII : si une exception est levée après `m.lock()` et avant `m.unlock()` → deadlock permanent. Avec lock_guard : unlock garanti dans le destructeur. Règle : ne jamais gérer les ressources manuellement quand un wrapper RAII existe."
    },
    {
      "question": "[Move] Dans quel cas `std::move()` améliore-t-il les performances ?",
      "options": [
        "Quand on veut copier un objet deux fois plus vite.",
        "Pour transférer la propriété d'une ressource (vecteur, string, unique_ptr) sans copier les données — O(1) au lieu de O(n).",
        "std::move améliore les performances uniquement avec les smart pointers.",
        "std::move est utile uniquement dans les move constructors."
      ],
      "answer": "Pour transférer la propriété d'une ressource (vecteur, string, unique_ptr) sans copier les données — O(1) au lieu de O(n).",
      "explanation": "`vector<Quote> quotes = build_quotes();` → sans move, copie de N éléments. Avec RVO/move : le compilateur ou le move constructor transfère le buffer interne (simple échange de pointeur). `std::move(v)` caste en rvalue reference → déclenche le move constructor. L'objet source est laissé dans un état valide mais vide (empty vector). En trading : retourner de gros buffers de données de marché depuis une fonction sans copie."
    },
    {
      "question": "[Undefined Behavior] Lequel de ces codes produit un undefined behavior ?",
      "options": [
        "`int arr[5]; arr[4] = 0;`",
        "`int arr[5]; arr[5] = 0;`",
        "`int* p = new int(5); delete p; p = nullptr;`",
        "`std::vector<int> v; v.push_back(1);`"
      ],
      "answer": "`int arr[5]; arr[5] = 0;`",
      "explanation": "arr[5] sur un tableau de 5 éléments (indices 0-4) = accès hors bornes = undefined behavior. Peut écraser la stack, corrompre d'autres variables, ou crasher. Le compilateur n'ajoute pas de bound check par défaut (contrairement à Java). `arr[4] = 0` : index valide (dernier élément). `delete p; p = nullptr` : bonne pratique (dangling pointer sécurisé). Utiliser `std::vector` avec `.at(i)` pour un accès avec vérification (lance `std::out_of_range`)."
    },
    {
      "question": "[Templates] À quoi sert un template en C++ ?",
      "options": [
        "À créer des copies d'une classe pour différents fichiers du projet.",
        "À écrire du code générique résolu à la compilation pour différents types, sans overhead runtime.",
        "À implémenter le polymorphisme runtime sans vtable.",
        "À automatiser la gestion mémoire pour les types génériques."
      ],
      "answer": "À écrire du code générique résolu à la compilation pour différents types, sans overhead runtime.",
      "explanation": "`template<typename T> T max(T a, T b)` génère une version pour chaque type utilisé. Zéro overhead runtime contrairement aux fonctions virtuelles. `template<size_t N> class RingBuffer` — buffer de taille N fixée à la compilation, allouable sur stack. CRTP (Curiously Recurring Template Pattern) : polymorphisme statique sans vtable. En AMM : `RingBuffer<Quote, 1024>` — toute la structure sur la stack, taille déterminée à la compile, accès O(1) garanti."
    }
  ],
  avance: [
    {
      "question": "[Cache Locality] Pourquoi `std::vector` est-il généralement plus rapide que `std::list` même pour des insertions fréquentes ?",
      "options": [
        "vector utilise moins de mémoire que list.",
        "vector est contigu en mémoire → cache locality excellente. list = nœuds épars → cache miss à chaque élément. L'overhead du cache miss dépasse souvent le coût du déplacement des éléments.",
        "vector est thread-safe contrairement à list.",
        "list effectue plus d'allocations dynamiques que vector."
      ],
      "answer": "vector est contigu en mémoire → cache locality excellente. list = nœuds épars → cache miss à chaque élément. L'overhead du cache miss dépasse souvent le coût du déplacement des éléments.",
      "explanation": "Cache line = 64 bytes. Un vector<int> : 16 entiers par cache line, balayage séquentiel ultra-rapide. Une list : chaque nœud alloué séparément sur le heap → chaque accès potentiellement dans une page différente → cache miss (100-200 cycles vs 4 cycles hit). Benchmarks montrent que vector::insert (O(n)) bat souvent list::insert (O(1)) sur des petites collections grâce au cache. En AMM : données de marché toujours en vector."
    },
    {
      "question": "[False Sharing] Qu'est-ce que le false sharing et pourquoi dégrade-t-il les performances ?",
      "options": [
        "Deux threads partagent accidentellement des données car les noms de variables sont similaires.",
        "Deux threads accèdent à des variables différentes situées sur la même cache line — l'invalidation de cache entre CPU cores dégrade les performances même sans vrai partage de données.",
        "Un thread lit des données stale depuis un cache L2.",
        "Deux shared_ptr partagent le même objet sans synchronisation."
      ],
      "answer": "Deux threads accèdent à des variables différentes situées sur la même cache line — l'invalidation de cache entre CPU cores dégrade les performances même sans vrai partage de données.",
      "explanation": "Cache line = 64 bytes. `struct { int a; int b; }` : a et b sur la même cache line. Thread 1 écrit a, Thread 2 écrit b → invalidation mutuelle des caches même si les données sont distinctes → ping-pong de cache = dégradation sévère. Solution C++17 : `alignas(64) int a; alignas(64) int b;` — chaque variable sur sa propre cache line. En AMM : structures partagées entre thread de réception et thread de pricing doivent être alignées."
    },
    {
      "question": "[Atomic] Quelle est la différence entre `memory_order_relaxed` et `memory_order_seq_cst` dans une opération atomique ?",
      "options": [
        "Il n'y a pas de différence fonctionnelle — c'est juste un hint au compilateur.",
        "`relaxed` : atomicité garantie mais aucun ordre de mémoire — pas de synchronisation entre threads. `seq_cst` : ordre total séquentiel — le plus fort, mais le plus coûteux (barrière mémoire complète).",
        "`relaxed` est plus sûr car il évite les deadlocks.",
        "`seq_cst` est uniquement pour les architectures ARM, inutile sur x86."
      ],
      "answer": "`relaxed` : atomicité garantie mais aucun ordre de mémoire — pas de synchronisation entre threads. `seq_cst` : ordre total séquentiel — le plus fort, mais le plus coûteux (barrière mémoire complète).",
      "explanation": "Memory order : seq_cst (défaut) = barrière mémoire complète, visible de tous les threads dans le même ordre. acquire/release : synchronisation entre producteur et consommateur. relaxed : uniquement l'atomicité de l'opération, aucune garantie d'ordre. En AMM : counter de performance → `fetch_add(1, memory_order_relaxed)` (pas besoin de synchronisation inter-thread). Flag d'arrêt → `memory_order_release` en écriture, `memory_order_acquire` en lecture."
    },
    {
      "question": "[Lock-Free] Qu'est-ce qu'une SPSC queue et pourquoi l'utilise-t-on en trading ?",
      "options": [
        "Single Process Single Core — une queue optimisée pour un seul core.",
        "Single Producer Single Consumer — queue lock-free avec un seul thread qui écrit et un seul qui lit. Utilise un ring buffer + atomics, zéro mutex sur le hot path.",
        "Synchronized Processor Socket Cache — cache L3 partagé entre sockets CPU.",
        "Standard Priority Safe Container — conteneur STL thread-safe."
      ],
      "answer": "Single Producer Single Consumer — queue lock-free avec un seul thread qui écrit et un seul qui lit. Utilise un ring buffer + atomics, zéro mutex sur le hot path.",
      "explanation": "SPSC Queue : le cas le plus simple de lock-free. Un pointeur head (lu par le consumer), un pointeur tail (écrit par le producer). Pas de contention. Implémentation : ring buffer pré-alloué + `std::atomic<size_t>` pour head et tail. En AMM : thread de réception des market data → SPSC Queue → thread de stratégie. Latence : < 100ns. Avec mutex : 1-5µs. Bibliothèques : Intel TBB, Boost.Lockfree, ou implémenter soi-même (~30 lignes)."
    },
    {
      "question": "[Memory Order] Qu'est-ce qu'un memory barrier (barrière mémoire) ?",
      "options": [
        "Une zone mémoire protégée par un mutex.",
        "Une instruction qui empêche le compilateur et le CPU de réordonner les accès mémoire au-delà de ce point — garantit la visibilité des écritures passées.",
        "Une limite de taille sur la mémoire allouable par thread.",
        "Un mécanisme de protection contre les buffer overflows."
      ],
      "answer": "Une instruction qui empêche le compilateur et le CPU de réordonner les accès mémoire au-delà de ce point — garantit la visibilité des écritures passées.",
      "explanation": "Le CPU et le compilateur réordonnent les instructions pour optimiser les performances. Sans barrière : le thread B peut lire des données stale même après que le thread A les ait 'écrites' (car en cache L1 non propagé). `std::atomic` avec les bons memory orders insère des barrières implicites. `std::atomic_thread_fence(memory_order_seq_cst)` : barrière explicite. En low latency : choisir le memory order minimal nécessaire pour éviter les barrières inutiles."
    },
    {
      "question": "[Move Semantics] Qu'est-ce que la Perfect Forwarding et à quoi sert `std::forward` ?",
      "options": [
        "Une optimisation du compilateur pour éviter les copies dans les boucles.",
        "Transmettre un argument à une autre fonction en préservant sa catégorie de valeur (lvalue ou rvalue) — `std::forward<T>(arg)` est utilisé dans les templates variadiques.",
        "std::forward est identique à std::move.",
        "Une technique pour forwarder des appels entre threads."
      ],
      "answer": "Transmettre un argument à une autre fonction en préservant sa catégorie de valeur (lvalue ou rvalue) — `std::forward<T>(arg)` est utilisé dans les templates variadiques.",
      "explanation": "Problème : dans un template `template<typename T> void wrapper(T&& arg) { target(arg); }`, arg est toujours une lvalue à l'intérieur. std::forward<T>(arg) transmet arg comme rvalue si T est une rvalue reference, lvalue sinon. `template<typename... Args> auto make(Args&&... args) { return T(std::forward<Args>(args)...); }` — factory parfaite. En trading : factory de messages FIX qui forward les arguments au constructeur sans copie intermédiaire."
    },
    {
      "question": "[noexcept] Pourquoi `noexcept` sur un move constructor est-il critique pour `std::vector` ?",
      "options": [
        "Sans noexcept, le move constructor n'est pas appelé — c'est juste une convention.",
        "std::vector utilise le move constructor lors du redimensionnement SEULEMENT s'il est noexcept — sinon il utilise la copie (pour la strong exception guarantee). Sans noexcept, les redimensionnements sont O(n) copies.",
        "noexcept améliore les performances du move en désactivant les vérifications.",
        "noexcept est obligatoire uniquement sur le copy constructor."
      ],
      "answer": "std::vector utilise le move constructor lors du redimensionnement SEULEMENT s'il est noexcept — sinon il utilise la copie (pour la strong exception guarantee). Sans noexcept, les redimensionnements sont O(n) copies.",
      "explanation": "Strong exception guarantee : si une exception est levée pendant le redimensionnement, le vector doit rester dans son état original. Avec move non-noexcept : si move A réussit et move B lève, l'état original est irrémédiablement corrompu. Donc vector copie (rollbackable) quand move peut lancer. `Trade(Trade&&) noexcept = default;` → vector peut move toute la collection en O(n) moves au lieu de O(n) copies. Toujours annoter `noexcept` les move constructors et move assignments."
    },
    {
      "question": "[CRTP] Qu'est-ce que le CRTP et quel problème résout-il ?",
      "options": [
        "Curiously Recurring Template Pattern : une classe hérite d'un template paramétré par elle-même — permet le polymorphisme statique sans vtable, résolu à la compilation.",
        "Common Runtime Type Pattern : un mécanisme de reflection en C++.",
        "Cached Runtime Template Pattern : mise en cache des instanciations de templates.",
        "CRTP est un anti-pattern à éviter en C++ moderne."
      ],
      "answer": "Curiously Recurring Template Pattern : une classe hérite d'un template paramétré par elle-même — permet le polymorphisme statique sans vtable, résolu à la compilation.",
      "explanation": "`template<typename Derived> class Strategy { void execute() { static_cast<Derived*>(this)->execute_impl(); } }` puis `class MarketMaker : public Strategy<MarketMaker>`. L'appel est résolu à la compilation → zéro indirection vtable → inlinable. Comparaison : virtual function = 2 indirections mémoire (vptr + vtable). CRTP = 0 indirection. En AMM hot path : stratégies de pricing comme CRTP. Utilisé dans Eigen (algèbre linéaire), Boost.Spirit. Trade-off : code plus complexe, temps de compilation plus long."
    },
    {
      "question": "[Placement new] À quoi sert le placement new et dans quel contexte l'utilise-t-on ?",
      "options": [
        "À placer un objet sur la stack au lieu du heap.",
        "À construire un objet dans une zone mémoire déjà allouée — utilisé dans les object pools pour réutiliser la mémoire sans malloc/free.",
        "À créer plusieurs copies d'un objet à des adresses consécutives.",
        "Un alias pour `new` avec une adresse spécifique, sans usage pratique."
      ],
      "answer": "À construire un objet dans une zone mémoire déjà allouée — utilisé dans les object pools pour réutiliser la mémoire sans malloc/free.",
      "explanation": "`new (ptr) T(args)` : construit T à l'adresse ptr sans allocation. Destruction explicite : `ptr->~T()`. Object pool : `alignas(T) char buf[N * sizeof(T)];` → `new (buf + i*sizeof(T)) T(args)`. En AMM : pool de messages FIX pré-alloués au démarrage. Recevoir un message → prendre un slot du pool, `new (slot) FIXMessage(data)`. Libérer → `msg->~FIXMessage()`, retourner le slot au pool. Zéro malloc/free sur le hot path."
    },
    {
      "question": "[Template Metaprogramming] Qu'est-ce que `if constexpr` (C++17) et pourquoi est-ce utile ?",
      "options": [
        "Une condition vérifiée à l'exécution dans un template.",
        "Une branche conditionnelle évaluée à la compilation dans un template — permet d'avoir des comportements différents selon le type sans instancier les branches invalides.",
        "Un équivalent de `#ifdef` pour les templates.",
        "Une façon de désactiver des assertions en release."
      ],
      "answer": "Une branche conditionnelle évaluée à la compilation dans un template — permet d'avoir des comportements différents selon le type sans instancier les branches invalides.",
      "explanation": "`template<typename T> void serialize(T val) { if constexpr (std::is_integral_v<T>) { write_int(val); } else { write_float(val); } }`. Sans `if constexpr`, les deux branches doivent compiler pour tout T. Avec `if constexpr`, seule la branche sélectionnée est compilée. Remplace SFINAE dans beaucoup de cas — plus lisible. En trading : sérialisation de messages FIX avec types variés, optimisations spécifiques selon le type de données de marché."
    },
    {
      "question": "[Undefined Behavior] Un ingénieur senior dit 'ça marche chez moi en debug, mais crash en release'. Quelle est la cause probable ?",
      "options": [
        "Le mode release compile pour un OS différent.",
        "Undefined behavior — en debug, le compilateur est moins agressif. En release (-O2/-O3), il optimise en supposant qu'il n'y a pas d'UB, ce qui peut transformer un UB 'silencieux' en comportement inattendu ou crash.",
        "Le mode release active les exceptions que le debug désactive.",
        "C'est une différence de version de compilateur entre debug et release."
      ],
      "answer": "Undefined behavior — en debug, le compilateur est moins agressif. En release (-O2/-O3), il optimise en supposant qu'il n'y a pas d'UB, ce qui peut transformer un UB 'silencieux' en comportement inattendu ou crash.",
      "explanation": "L'optimiseur peut supprimer des boucles entières si leurs effets sont UB, éliminer des null checks jugés 'impossibles', réordonner des accès mémoire. Exemple classique : accès à un pointeur après free → en debug, la mémoire est souvent encore accessible → marche. En release, le compilateur réutilise le registre → crash. Solution : AddressSanitizer (`-fsanitize=address`) tourne en release-like avec détection UB. Toujours tester avec les sanitizers avant prod."
    },
    {
      "question": "[Memory Model] En C++, qu'est-ce que le 'sequence point' et pourquoi `a[i] = i++` est-il UB ?",
      "options": [
        "C'est une règle de style sans impact réel.",
        "Un sequence point délimite l'ordre d'évaluation. `a[i] = i++` modifie i et l'utilise dans la même expression sans sequence point entre eux — l'ordre d'évaluation est indéterminé = UB.",
        "i++ est une opération atomique donc il n'y a pas de problème.",
        "C'est UB uniquement si i et a sont dans des threads différents."
      ],
      "answer": "Un sequence point délimite l'ordre d'évaluation. `a[i] = i++` modifie i et l'utilise dans la même expression sans sequence point entre eux — l'ordre d'évaluation est indéterminé = UB.",
      "explanation": "En C++17, les règles d'évaluation ont été clarifiées mais beaucoup d'expressions restent UB. `a[i] = i++` : i est lu pour l'index ET modifié par ++ dans la même expression. Le compilateur peut évaluer dans n'importe quel ordre. Même problème : `f(i++, i++)` — UB car deux modifications de i entre sequence points. Règle simple : ne modifier une variable qu'une seule fois par expression, et ne pas l'utiliser ailleurs dans la même expression."
    },
    {
      "question": "[Concurrence] Qu'est-ce qu'un spin-lock et quand l'utiliser par rapport à un mutex ?",
      "options": [
        "Un spin-lock est plus sûr qu'un mutex car il ne peut pas causer de deadlock.",
        "Un spin-lock tourne activement en boucle tant que le lock est pris (busy-wait) — pas de context switch. Utile pour des sections critiques très courtes en low-latency. Mutex met le thread en sleep (context switch coûteux).",
        "Un spin-lock est identique à un mutex mais consomme moins de mémoire.",
        "Les spin-locks ne sont utilisables qu'en kernel space."
      ],
      "answer": "Un spin-lock tourne activement en boucle tant que le lock est pris (busy-wait) — pas de context switch. Utile pour des sections critiques très courtes en low-latency. Mutex met le thread en sleep (context switch coûteux).",
      "explanation": "Spin-lock : `while(flag.test_and_set(memory_order_acquire)) {}` — CPU tourne à 100% mais latence de prise minimale (~10-30 ns). Mutex : si pris, le thread est mis en sleep par l'OS (context switch ~1-5µs). En AMM : spin-lock pour protéger la mise à jour de prix (section critique < 100ns). Mutex pour les opérations plus longues. Attention : spin-lock sur single-core = livelock. `_mm_pause()` entre tentatives pour réduire la consommation d'énergie et améliorer l'hyperthreading."
    },
    {
      "question": "[Debug Prod] Comment investiguer une fuite mémoire en production sur un engine de trading C++ ?",
      "options": [
        "Redémarrer le serveur toutes les heures.",
        "Surveiller l'évolution de la RSS (Resident Set Size) avec `top`/`/proc/PID/status`. Reproduire avec `valgrind --leak-check=full` sur un environnement de staging. Utiliser `AddressSanitizer` en pre-prod. Analyser avec `heaptrack` ou `gperftools`.",
        "Activer le mode debug et chercher les `new` sans `delete` dans le code.",
        "Les leaks se corrigent automatiquement quand le processus se termine."
      ],
      "answer": "Surveiller l'évolution de la RSS (Resident Set Size) avec `top`/`/proc/PID/status`. Reproduire avec `valgrind --leak-check=full` sur un environnement de staging. Utiliser `AddressSanitizer` en pre-prod. Analyser avec `heaptrack` ou `gperftools`.",
      "explanation": "Approche méthodique : 1) Confirmer le leak en graphant la RSS au cours du temps — croissance linéaire = leak. 2) valgrind en staging : trace chaque malloc sans free correspondant. 3) AddressSanitizer (-fsanitize=address) : overhead x2 mais utilisable en pre-prod. 4) heaptrack : profiling heap à faible overhead. 5) Review du code : chercher les raw pointers, les shared_ptr cycliques, les static containers qui grossissent. En trading : les leaks qui crashent pendant la session = incident critique."
    },
    {
      "question": "[Performance] Qu'est-ce que le branch misprediction et comment l'éviter ?",
      "options": [
        "Une erreur de compilation quand les branches d'un if/else sont mal typées.",
        "Quand le CPU prédit incorrectement la branche d'un if et doit annuler le travail pré-exécuté — coût ~15-20 cycles. Éviter avec data-driven design, branchless code (`?:`, cmov), ou `[[likely]]`/`[[unlikely]]` (C++20).",
        "Un bug dans les instructions de saut du code assembleur.",
        "Branch misprediction est uniquement un problème sur ARM, pas sur x86."
      ],
      "answer": "Quand le CPU prédit incorrectement la branche d'un if et doit annuler le travail pré-exécuté — coût ~15-20 cycles. Éviter avec data-driven design, branchless code (`?:`, cmov), ou `[[likely]]`/`[[unlikely]]` (C++20).",
      "explanation": "Modern CPU = pipeline profond. Il prédit la branche et exécute en avance (speculative execution). Si mauvaise prédiction : flush du pipeline = ~15-20 cycles perdus. En AMM : `if (price > threshold) buy() else sell()` avec des données aléatoires = 50% de mauvaises prédictions. Solutions : 1) Trier les données pour rendre les branches prévisibles. 2) Branchless : `int sign = (price > threshold) - (price <= threshold)`. 3) `[[likely]]` hint au compilateur. 4) Lookup table."
    },
    {
      "question": "[C++ vs Python] Pourquoi C++ et pas Python pour le core engine de trading AMM ?",
      "options": [
        "Python n'existe pas sur les serveurs Linux.",
        "C++ : exécution directe (nanoseconde), contrôle mémoire total, pas de GIL, latence déterministe. Python : interpréteur (~100x plus lent en boucles), GIL limite le parallélisme CPU, GC imprévisible.",
        "Python ne supporte pas les classes ni l'héritage.",
        "Les régulateurs imposent C++ pour les systèmes de trading."
      ],
      "answer": "C++ : exécution directe (nanoseconde), contrôle mémoire total, pas de GIL, latence déterministe. Python : interpréteur (~100x plus lent en boucles), GIL limite le parallélisme CPU, GC imprévisible.",
      "explanation": "Question piège classique d'entretien AMM. Path critique AMM : réception market data → décision → envoi ordre < 10µs. Python ne peut pas atteindre ces latences. GIL Python : un seul thread exécute du bytecode à la fois → pas de vrai parallélisme CPU. GC Python : pauses imprévisibles. Architecture réelle : C++ pour tout ce qui est temps réel (hot path). Python pour backtesting, analyse alpha, reporting, scripts de gestion. R ou Python pour la modélisation quantitative."
    },
    {
      "question": "[Concurrence] Quelle est la différence entre `std::mutex`, `std::shared_mutex` et `std::recursive_mutex` ?",
      "options": [
        "Ce sont trois noms différents pour la même implémentation.",
        "`mutex` : exclusif (un seul thread). `shared_mutex` : lecture concurrente (plusieurs readers) OU écriture exclusive (un writer). `recursive_mutex` : le même thread peut le verrouiller plusieurs fois sans deadlock.",
        "`shared_mutex` est partagé entre plusieurs processus.",
        "`recursive_mutex` permet de verrouiller depuis plusieurs threads simultanément."
      ],
      "answer": "`mutex` : exclusif (un seul thread). `shared_mutex` : lecture concurrente (plusieurs readers) OU écriture exclusive (un writer). `recursive_mutex` : le même thread peut le verrouiller plusieurs fois sans deadlock.",
      "explanation": "shared_mutex (readers-writer lock) : `shared_lock<shared_mutex>` pour la lecture (concurrent). `unique_lock<shared_mutex>` pour l'écriture (exclusif). Idéal pour une structure lue très souvent, rarement écrite (order book lu par 10 threads de stratégie, écrit par 1 thread de reception). recursive_mutex : utile quand une fonction verrouillée appelle une autre fonction qui verrouille le même mutex. Plus lent que mutex normal → éviter si possible (signe d'un design à revoir)."
    },
    {
      "question": "[Optimisation] Qu'est-ce que l'inlining et pourquoi est-il important en low latency ?",
      "options": [
        "Inlining = inclure un header dans plusieurs fichiers .cpp.",
        "Inlining = copier le corps d'une fonction à l'endroit de l'appel — élimine le overhead de l'appel (setup/teardown du stack frame), permet à l'optimiseur de voir le contexte complet.",
        "Inlining est uniquement possible sur les fonctions template.",
        "Inlining augmente les performances en réduisant la taille de l'exécutable."
      ],
      "answer": "Inlining = copier le corps d'une fonction à l'endroit de l'appel — élimine le overhead de l'appel (setup/teardown du stack frame), permet à l'optimiseur de voir le contexte complet.",
      "explanation": "Appel de fonction non-inline : push arguments, call, setup stack frame, return = ~5-10 instructions overhead. Inliné : zéro overhead, et le compilateur peut further optimiser (constante folding, dead code elimination). `inline` : hint au compilateur (peut ignorer). `__attribute__((always_inline))` / `__forceinline` : force l'inline. `-O2` / `-O3` : le compilateur inline automatiquement les petites fonctions. Virtual functions ne peuvent pas être inlinées (call indirect). CRTP : appels inlinables = avantage majeur."
    },
    {
      "question": "[Design] Comment implémenter un object pool en C++ pour un système low-latency ?",
      "options": [
        "Utiliser `std::allocator` directement.",
        "Pré-allouer un tableau d'objets au démarrage. Maintenir une free list (stack de slots disponibles). `acquire()` : pop de la free list + placement new. `release()` : destructeur explicite + push sur la free list. Zéro malloc/free pendant la session.",
        "Hériter de `std::allocator` et surcharger `allocate()`.",
        "Utiliser `std::pmr::memory_resource` avec un buffer statique."
      ],
      "answer": "Pré-allouer un tableau d'objets au démarrage. Maintenir une free list (stack de slots disponibles). `acquire()` : pop de la free list + placement new. `release()` : destructeur explicite + push sur la free list. Zéro malloc/free pendant la session.",
      "explanation": "Object pool pattern : `alignas(T) char storage[N * sizeof(T)]` — mémoire brute. `std::array<T*, N> free_list` — pointeurs vers les slots libres. `T* acquire(Args&&... args) { T* slot = free_list[--top]; return new(slot) T(std::forward<Args>(args)...); }`. `void release(T* obj) { obj->~T(); free_list[top++] = obj; }`. En AMM : pool de messages FIX (taille fixe connue), pool d'ordres, pool de quotes. Bénéfice : latence de acquire() = quelques nanosecondes vs malloc = plusieurs centaines."
    },
    {
      "question": "[Compilation] Quelle est la différence entre compilation, linkage et chargement (loading) ?",
      "options": [
        "Ce sont trois termes pour la même étape dans le processus de build.",
        "Compilation : .cpp → .o (code objet). Linkage : .o + libs → exécutable (résout les symboles externes). Loading : l'OS charge l'exécutable en mémoire et résout les libs dynamiques (.so).",
        "Linkage est uniquement nécessaire pour les librairies dynamiques.",
        "Le loading est effectué par le compilateur, pas l'OS."
      ],
      "answer": "Compilation : .cpp → .o (code objet). Linkage : .o + libs → exécutable (résout les symboles externes). Loading : l'OS charge l'exécutable en mémoire et résout les libs dynamiques (.so).",
      "explanation": "Compilation (g++ -c) : preprocessing → AST → IR → code objet (.o). Chaque .cpp = un .o. Linkage (g++) : combine les .o, résout les symboles (définitions des fonctions déclarées ailleurs), produit l'exécutable. Static linkage (.a) : code inclus dans l'exe. Dynamic linkage (.so/.dll) : résolu au chargement ou à l'appel. ODR (One Definition Rule) : chaque symbole doit avoir exactement une définition dans le programme. Erreur 'undefined reference' = symbole non trouvé au linkage."
    },
    {
      "question": "[Robustesse] Que fais-tu si ton engine C++ crash en pleine session de trading ?",
      "options": [
        "Redémarrer manuellement et espérer que ça repart.",
        "Système de supervision (watchdog) redémarre l'engine automatiquement. Logs de crash analysés (coredump + `gdb`, `addr2line`). Position snapshot régulier pour recovery. Circuit breaker coupe les ordres en attente. Post-mortem: reproduire le bug en staging avec les logs.",
        "Activer le mode debug et relancer en production.",
        "Chercher le bug dans le code avant de redémarrer."
      ],
      "answer": "Système de supervision (watchdog) redémarre l'engine automatiquement. Logs de crash analysés (coredump + `gdb`, `addr2line`). Position snapshot régulier pour recovery. Circuit breaker coupe les ordres en attente. Post-mortem: reproduire le bug en staging avec les logs.",
      "explanation": "Question de maturité production très fréquente. Watchdog : processus qui surveille l'engine et le redémarre si il ne répond plus. Core dump : `ulimit -c unlimited` pour activer. `gdb ./engine core` pour analyser la stack trace. `addr2line -e engine 0xADDR` pour retrouver la ligne de code. Position snapshot : sauvegarder l'état toutes les N secondes → recovery possible. Circuit breaker : annuler automatiquement les ordres en attente si l'engine ne confirme pas. Alertes ops : PagerDuty / Slack."
    },
    {
      "question": "[const] Qu'est-ce que `constexpr` et en quoi diffère-t-il de `const` ?",
      "options": [
        "constexpr et const sont identiques depuis C++11.",
        "`const` : valeur immuable, initialisée au runtime possible. `constexpr` : valeur garantie évaluée à la compilation — permet des tailles de tableaux, template parameters, et optimisations zero-cost.",
        "`constexpr` est uniquement pour les fonctions, `const` pour les variables.",
        "`constexpr` remplace `#define` uniquement pour les entiers."
      ],
      "answer": "`const` : valeur immuable, initialisée au runtime possible. `constexpr` : valeur garantie évaluée à la compilation — permet des tailles de tableaux, template parameters, et optimisations zero-cost.",
      "explanation": "`const int n = getSize();` : n est const mais initialisé au runtime. `constexpr int N = 1024;` : N est évalué à la compilation. `std::array<Quote, N>` : N doit être constexpr. `constexpr double PI = 3.14159;` vs `#define PI 3.14159` : constexpr est typé, scopé, debuggable. `constexpr` function : peut être évaluée à la compile si les arguments sont constexpr. En AMM : tailles des pools, ring buffers, constantes de pricing — tout en constexpr pour des allocations stack et zéro overhead."
    },
    {
      "question": "[STL] Quelle est la différence entre `std::array` et `std::vector` ?",
      "options": [
        "std::array est plus lent car il vérifie les bounds automatiquement.",
        "`std::array<T,N>` : taille fixe connue à la compilation, alloué sur la stack (ou inline), zéro overhead. `std::vector<T>` : taille dynamique, alloué sur le heap, gestion de capacité automatique.",
        "std::vector est toujours préférable à std::array.",
        "std::array ne supporte pas les itérateurs STL."
      ],
      "answer": "`std::array<T,N>` : taille fixe connue à la compilation, alloué sur la stack (ou inline), zéro overhead. `std::vector<T>` : taille dynamique, alloué sur le heap, gestion de capacité automatique.",
      "explanation": "std::array<Quote, 256> : N connu à la compile. Mémoire contiguë sur la stack. Pas d'allocation dynamique. Taille immuable. std::vector<Quote> : peut grandir. Heap allocation. Meilleur pour les tailles inconnues à la compilation. En AMM low latency : `std::array<Level, 10> bid_levels` pour les 10 meilleurs niveaux du carnet (taille connue). `std::vector<Trade>` pour les trades de la journée (taille variable). std::array supporte les algorithmes STL et les range-for comme vector."
    },
    {
      "question": "[Move] Qu'est-ce que la RVO (Return Value Optimization) ?",
      "options": [
        "Une optimisation qui réduit la valeur de retour d'une fonction.",
        "Une optimisation du compilateur qui construit l'objet de retour directement dans l'espace de l'appelant — élimine la copie/move même sans std::move.",
        "Une règle qui force l'utilisation de références pour les valeurs de retour.",
        "RVO est uniquement applicable aux types primitifs (int, double)."
      ],
      "answer": "Une optimisation du compilateur qui construit l'objet de retour directement dans l'espace de l'appelant — élimine la copie/move même sans std::move.",
      "explanation": "RVO (copy elision) : `vector<Quote> buildQuotes() { vector<Quote> v; ...; return v; }` — sans RVO : v est construit localement, puis move/copié vers l'appelant. Avec RVO (garanti depuis C++17 pour les cas simples) : v est construit directement dans l'espace de l'appelant = zéro copie/move. NRVO (Named RVO) : même chose pour les variables nommées — non garanti mais appliqué par la plupart des compilateurs. Conséquence : ne pas écrire `return std::move(v)` — ça désactive RVO en forçant un move."
    }
  ]
};
      "options": [
        "Ce sont trois syntaxes identiques pour initialiser un objet.",
        "Par valeur `T()` : zero-init pour les scalaires + init par défaut. Par défaut : appel du constructeur sans arguments. Par liste `T{a, b}` : aggregate init ou std::initializer_list — interdit le narrowing.",
        "L'initialisation par liste est uniquement pour les conteneurs STL.",
        "Par valeur appelle le copy constructor, par liste appelle le move constructor."
      ],
      "answer": "Par valeur `T()` : zero-init pour les scalaires + init par défaut. Par défaut : appel du constructeur sans arguments. Par liste `T{a, b}` : aggregate init ou std::initializer_list — interdit le narrowing.",
      "explanation": "`int x;` : valeur indéterminée (UB si lue). `int x = 0;` ou `int x{}` : zero-init. `int x(5.5)` : narrowing silencieux. `int x{5.5}` : erreur de compilation (narrowing interdit). `vector<int>{1,2,3}` → std::initializer_list. `Widget w{arg1, arg2}` → aggregate init si pas de constructeur user-defined. Préférer `{}` en C++ moderne — plus sûr (no narrowing), plus uniforme. Piège : `vector<int>(5)` = 5 zéros. `vector<int>{5}` = un élément valant 5."
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

const Page7_Cpp = () => {
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
            C++ Entretien 🔹{" "}
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

export default Page7_Cpp;
