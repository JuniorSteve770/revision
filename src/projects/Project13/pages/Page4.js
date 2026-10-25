// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
{
    "question": "RAII — Une ressource, un propriétaire",
    "answer": "**Principe** : acquérir dans le constructeur, libérer dans le destructeur. ◆ **Évite** : fuite (`new` sans `delete`), double `delete`, use-after-free. ◆ **Par défaut** : `std::unique_ptr` via `std::make_unique`. `shared_ptr` seulement si la propriété est partagée. ◆ **C#** : `using` / `Dispose`, le GC ne ferme pas une connexion."
  },
  {
    "question": "Règle du zéro — Copie générée",
    "answer": "**Règle du zéro** : membres RAII (`string`, `vector`, `unique_ptr`) → aucune fonction spéciale à écrire. ◆ **Piège `double*`** : la copie générée copie le pointeur → double libération. ◆ **Correction** : `std::vector<double>`, ou copie interdite avec `= delete`. ◆ **Ordre des membres** : ordre de déclaration, pas celui de la liste d'initialisation."
  },
  {
    "question": "Polymorphisme — Destructeur virtuel et slicing",
    "answer": "**Base polymorphe** : `virtual ~Base() = default;`, sinon `delete` via `Base*` est un UB. ◆ **Slicing** : passer une dérivée par valeur garde seulement la partie `Base` → passer par `const Base&`. ◆ **`protected`** : visible des dérivées, pas de l'extérieur. ◆ **Méthode de la base** : `Base::methode()`."
  },
  {
    "question": "const, auto, move — Lire et passer",
    "answer": "**Lire de droite à gauche** : `const T*` → cible constante ; `T* const` → pointeur constant. ◆ **Gros objet en lecture** : `const T&`. ◆ **`auto`** enlève `&` et `const` → copie ; garder la référence : `const auto&`. ◆ **`std::move`** : un simple cast, il ne déplace rien. ◆ **`-1 < 0u`** est faux : conversion en non signé."
  },
  {
    "question": "Conteneurs STL — Pièges",
    "answer": "**`map[k]`** crée la clé si elle est absente → lire avec `find()` ou `at()`. ◆ **O(1) par clé** : `unordered_map` (`map` = O(log n), trié). ◆ **`push_back`** peut réallouer → itérateurs invalides. ◆ **Jamais** de référence retournée vers un local."
  },
  {
    "question": "Exceptions — Capturer, relancer, frontières",
    "answer": "**Capturer** par `const&`, du plus précis au plus général. ◆ **`throw;`** relance l'exception en cours ; `throw e;` crée une copie (slicing). ◆ **`try` dans la boucle** : une erreur n'arrête que l'élément. ◆ **API C** : aucune exception ne la traverse → code retour, `extern \"C\"` (pas de mangling)."
  },
  {
    "question": "C# — Les pièges",
    "answer": "**`struct`** : type valeur, copié. ◆ **Montants** : `decimal`. ◆ **GC** : libère la mémoire, pas une connexion → `using` / `Dispose`. ◆ **LINQ** : exécuté à l'énumération. ◆ **UI figée** : `.Result` sur le thread UI → `await`. `async void` seulement pour les événements. ◆ **Appeler du C++** : `[DllImport]` sur une fonction `extern \"C\"`."
  },
  {
    "question": "Finance — Montants et arrondis",
    "answer": "**Montants** : centimes entiers (C++) ou `decimal` (C#), jamais `double`. ◆ **ACT/360** : jours réels / 360. ◆ **Demi-pair** : 2,5 → 2 ; 3,5 → 4. ◆ **Répartir** : plus fort reste, la somme reste exacte."
  },
  {
    "question": "Finance — Marché et titrisation",
    "answer": "**Coupon couru** : intérêts acquis depuis le dernier coupon. ◆ **Confirmation** : message qui officialise le deal. ◆ **Balance comptable** : débit = crédit. ◆ **Titrisation** : créances transformées en titres, découpés en tranches. ◆ **Waterfall** : ordre de paiement des tranches, la senior en premier."
  },
  {
    "question": "Support — SQL et shell",
    "answer": "**SQL** : `HAVING` après agrégat, `LEFT JOIN … WHERE b.id IS NULL`, `COALESCE`, `FETCH FIRST n ROWS ONLY`. En prod : lecture seule, toujours un `WHERE`. ◆ **Shell** : `$?`, `tail -f`, `sort | uniq -c`, `awk '{print $4}'`, `df -h`, `find -mmin -30`. ◆ **Code batch** : 1 = partiel (on continue), 2 = échec (on arrête)."
  },
  {
    "question": "Support — Rôles et incidents",
    "answer": "**MOA** : besoin métier. **MOE** : réalisation technique. ◆ **Support N1** : qualifier, diagnostiquer, corriger le simple, orienter. ◆ **Incident de données** : corrigé par la MOA / les utilisateurs. ◆ **6 étapes** : qualifier → reproduire → diagnostiquer → corriger/orienter → communiquer → documenter. ◆ **Reprise** : relancer, puis vérifier l'aval. **Régression** : ce qui marchait ne marche plus après une livraison."
  },
  {
    "question": "Build — Étapes et erreurs",
    "answer": "**Préprocesseur** : header introuvable. ◆ **Compilation** : `was not declared`. ◆ **Link** : `undefined reference` → définition absente, fichier non lié ou librairie non liée ; outil `nm -C`. `multiple definition` → définition dans un header sans `inline`. ◆ **Chargement** : `.so` introuvable → `ldd`, `readelf -d`, RUNPATH `$ORIGIN/../lib`. `-L` ne sert qu'au link."
  },
  {
    "question": "Makefile — Dépendances",
    "answer": "**Règle** : `cible: dépendances`, puis recette indentée par tabulation. ◆ **Piège** : header modifié, rien n'est recompilé. ◆ **Correction** : `-MMD -MP` + `-include *.d`. ◆ **`make -j` instable** : une dépendance n'est pas déclarée."
  },
  {
    "question": "Débogage — gdb et sanitizers",
    "answer": "**gdb** : compiler en `-g`, puis `bt` → `frame N` (première frame de notre code) → `print x`. ◆ **Codes** : 139 = segfault, 134 = abort, 127 = introuvable. ◆ **Sanitizers** : `address` (mémoire, fuites), `undefined` (UB), `thread` (data races, job séparé). Valgrind : sans recompiler, mais lent. ◆ **Bug seulement en `-O2`** : chercher un UB, pas un bug du compilateur."
  },
  {
    "question": "Déploiement — Livrer proprement",
    "answer": "**Build once, deploy many** : un seul artefact CI, versionné, promu jusqu'en prod. ◆ **Paquet** : `bin/` + `lib/` du même build, RUNPATH relatif. ◆ **Avant livraison** : `ldd` sans `not found`, tests sur l'artefact. ◆ **Après** : smoke test, logs ; en cas de régression, rollback d'abord, analyse ensuite."
  }
];

const questions = {
  moyen: [
   {
      "question": "[new / delete] Que provoque un `new` sans `delete` correspondant ?",
      "options": [
        "Une erreur de compilation.",
        "Une fuite mémoire : le bloc reste alloué jusqu'à la fin du processus.",
        "Un crash immédiat.",
        "Rien : le C++ libère automatiquement à la sortie de portée."
      ],
      "answer": "Une fuite mémoire : le bloc reste alloué jusqu'à la fin du processus.",
      "explanation": "La mémoire allouée par `new` n'est jamais libérée automatiquement : seul l'objet pointeur disparaît. Dans un service qui tourne longtemps, la consommation mémoire monte. Correction : `std::unique_ptr` / `std::make_unique`."
    },
    {
      "question": "[new / delete] Que se passe-t-il si on fait deux `delete` sur le même pointeur ?",
      "options": [
        "Double libération : comportement indéfini (crash, corruption du tas).",
        "Le second `delete` est ignoré.",
        "Erreur de compilation.",
        "La mémoire est libérée deux fois plus vite."
      ],
      "answer": "Double libération : comportement indéfini (crash, corruption du tas).",
      "explanation": "Le second `delete` libère un bloc déjà rendu à l'allocateur. Le symptôme peut apparaître bien plus tard. `delete nullptr` est en revanche sans effet, d'où l'habitude `p = nullptr;` après `delete`, et surtout l'usage de RAII. ASan le détecte (`attempting double-free`)."
    },
    {
      "question": "[RAII] Quel est le propriétaire par défaut d'un objet alloué sur le tas en C++ moderne ?",
      "options": [
        "`std::shared_ptr<T>`",
        "Un pointeur brut `T*`",
        "`std::weak_ptr<T>`",
        "`std::unique_ptr<T>`"
      ],
      "answer": "`std::unique_ptr<T>`",
      "explanation": "`std::unique_ptr` exprime une propriété unique, sans surcoût par rapport à un pointeur brut, et libère à la sortie de portée. `shared_ptr` est réservé à la propriété réellement partagée ; `weak_ptr` observe sans posséder."
    },
    {
      "question": "[Move] Que fait exactement `std::move(x)` ?",
      "options": [
        "Il copie `x` puis le détruit.",
        "Il déplace `x` dans une nouvelle zone mémoire.",
        "C'est un cast vers une rvalue : il autorise un déplacement, mais ne déplace rien lui-même.",
        "Il met `x` à zéro."
      ],
      "answer": "C'est un cast vers une rvalue : il autorise un déplacement, mais ne déplace rien lui-même.",
      "explanation": "Le déplacement est réalisé par le constructeur ou l'opérateur de déplacement choisi grâce au cast. Si le type n'a pas de déplacement, ou si `x` est `const`, c'est une copie qui a lieu."
    },
    {
      "question": "[Polymorphisme] Pourquoi déclarer un destructeur `virtual` dans une classe de base ?",
      "options": [
        "Pour rendre la classe abstraite.",
        "Pour que `delete` via un pointeur de base appelle aussi le destructeur de la dérivée.",
        "Pour accélérer la destruction.",
        "Pour interdire l'héritage."
      ],
      "answer": "Pour que `delete` via un pointeur de base appelle aussi le destructeur de la dérivée.",
      "explanation": "Sans destructeur virtuel, `Base* p = new Derived; delete p;` est un comportement indéfini : en pratique seul `~Base()` s'exécute, et les ressources de `Derived` fuient. Règle : base polymorphe → `virtual ~Base() = default;`."
    },
    {
      "question": "[Classe] Dans quel ordre les membres d'une classe sont-ils construits ?",
      "options": [
        "Dans l'ordre de déclaration dans la classe.",
        "Dans l'ordre de la liste d'initialisation du constructeur.",
        "Par ordre alphabétique.",
        "Dans un ordre choisi par le compilateur."
      ],
      "answer": "Dans l'ordre de déclaration dans la classe.",
      "explanation": "L'ordre de la liste d'initialisation est ignoré. Si un membre est initialisé à partir d'un autre déclaré après lui, il lit une valeur indéterminée. `-Wreorder` (inclus dans `-Wall`) signale l'écart."
    },
    {
      "question": "[Montants] `0.1 + 0.2 == 0.3` en `double` : quel résultat, et comment stocker un montant ?",
      "options": [
        "`true`, un `double` suffit pour des montants.",
        "`false`, il faut utiliser `float`.",
        "Erreur de compilation.",
        "`false` : 0.1 n'est pas représentable exactement en binaire. On stocke les montants en centimes entiers (ou `decimal` en C#)."
      ],
      "answer": "`false` : 0.1 n'est pas représentable exactement en binaire. On stocke les montants en centimes entiers (ou `decimal` en C#).",
      "explanation": "Les erreurs de représentation s'accumulent et font perdre des centimes dans les sommes et les comparaisons. Un `int64_t` en centimes, ou un type décimal, rend les calculs exacts."
    },
    {
      "question": "[Shell] Après une commande, quelle variable contient son code retour ?",
      "options": [
        "`$0`",
        "`$#`",
        "`$?`",
        "`$!`"
      ],
      "answer": "`$?`",
      "explanation": "`$?` vaut 0 en cas de succès, une autre valeur en cas d'échec. `$0` est le nom du script, `$#` le nombre d'arguments, `$!` le PID du dernier processus en arrière-plan. À lire immédiatement : la commande suivante l'écrase."
    },
    {
      "question": "[gdb] Le programme vient de planter sous gdb. Quelle est la première commande à taper ?",
      "options": [
        "`print`",
        "`bt`",
        "`run`",
        "`quit`"
      ],
      "answer": "`bt`",
      "explanation": "`bt` (backtrace) affiche la pile d'appels au moment du crash. On repère ensuite la première frame de notre propre code avec `frame N`, puis on inspecte les variables avec `print` ou `info locals`."
    },
    {
      "question": "[Code retour] Un test en CI se termine avec le code 139. Qu'est-ce que cela signifie ?",
      "options": [
        "Segmentation fault : 139 = 128 + 11 (SIGSEGV).",
        "Le test a échoué sur une assertion.",
        "La commande est introuvable.",
        "Timeout de la pipeline."
      ],
      "answer": "Segmentation fault : 139 = 128 + 11 (SIGSEGV).",
      "explanation": "Un processus tué par un signal renvoie 128 + numéro du signal. 11 = SIGSEGV, 6 = SIGABRT (134, souvent une assertion), 127 = commande ou librairie introuvable. Étape suivante : core dump + `gdb` + `bt`, ou relancer sous ASan."
    }, {
      "question": "[Piège — Construction vs affectation] `Account b(100); Account c = b; Account d; d = b;` — Quelle fonction est appelée par `Account c = b;` ?",
      "options": [
        "L'opérateur d'affectation `operator=`, à cause du signe `=`.",
        "Le constructeur par défaut, puis l'opérateur d'affectation.",
        "Le constructeur de déplacement, car `b` est une variable locale.",
        "Le constructeur de copie : `c` est en train de naître sur cette ligne, le `=` d'une déclaration est une initialisation, pas une affectation."
      ],
      "answer": "Le constructeur de copie : `c` est en train de naître sur cette ligne, le `=` d'une déclaration est une initialisation, pas une affectation.",
      "explanation": "Règle d'or : le type est-il écrit devant le nom ? Si oui, l'objet naît → constructeur. Sinon, l'objet existe déjà → `operator=`. Le `=` ne décide rien. `b` est une lvalue nommée : c'est une copie, pas un déplacement (il faudrait `std::move(b)`)."
    },
    {
      "question": "[Piège — Most vexing parse] Que fait exactement la ligne `SomeType t();` ?",
      "options": [
        "Elle crée `t` avec le constructeur par défaut.",
        "Elle value-initialise `t`, donc ses membres valent 0.",
        "Elle déclare une fonction `t` sans paramètre qui retourne un `SomeType` : aucun objet n'est créé.",
        "Elle provoque immédiatement une erreur de compilation."
      ],
      "answer": "Elle déclare une fonction `t` sans paramètre qui retourne un `SomeType` : aucun objet n'est créé.",
      "explanation": "C'est le « most vexing parse » : tout ce qui peut être lu comme une déclaration de fonction l'est. L'erreur n'apparaît que plus loin, par exemple sur `t.value`. Pour un objet, il faut écrire `SomeType t;` ou `SomeType t{};`."
    },
    {
      "question": "[Distinguer] Variables locales : `struct Example { int x; }; Example a; Example b{};` — Que valent `a.x` et `b.x` ?",
      "options": [
        "`a.x` et `b.x` valent 0.",
        "`a.x` a une valeur indéterminée, `b.x` vaut 0.",
        "`a.x` vaut 0, `b.x` a une valeur indéterminée.",
        "Les deux sont indéterminés."
      ],
      "answer": "`a.x` a une valeur indéterminée, `b.x` vaut 0.",
      "explanation": "`Example a;` est une default-initialization : sans constructeur qui initialise `x`, un `int` local n'est pas initialisé, et le lire est un comportement indéfini. `Example b{};` est une value/aggregate initialization : `x` vaut 0. Nuance : une variable globale ou `static` est toujours mise à zéro."
    },
    {
      "question": "[Piège — Conversion rétrécissante] `int a(3.7); int b{3.7};` — Que se passe-t-il ?",
      "options": [
        "`a` compile et vaut 3 (troncature, éventuel warning), `b` provoque une erreur : les accolades interdisent les conversions rétrécissantes.",
        "Les deux compilent et valent 3.",
        "Les deux compilent et valent 4 (arrondi).",
        "`a` provoque une erreur, `b` compile et vaut 3."
      ],
      "answer": "`a` compile et vaut 3 (troncature, éventuel warning), `b` provoque une erreur : les accolades interdisent les conversions rétrécissantes.",
      "explanation": "C'est l'argument principal pour préférer `{}` : le compilateur refuse les conversions qui perdent de l'information (double → int, long → short…). Les parenthèses tronquent silencieusement."
    },
    {
      "question": "[Terme → Étape] `undefined reference to 'Foo::bar()'` : à quelle étape du build cette erreur apparaît-elle ?",
      "options": [
        "Au préprocesseur : le header `Foo.h` est introuvable.",
        "À la compilation : la syntaxe de `bar()` est incorrecte.",
        "À l'exécution : la fonction plante au premier appel.",
        "À l'édition de liens : la déclaration a été vue, mais le linker ne trouve la définition du symbole dans aucun `.o` ni aucune librairie reçus."
      ],
      "answer": "À l'édition de liens : la déclaration a été vue, mais le linker ne trouve la définition du symbole dans aucun `.o` ni aucune librairie reçus.",
      "explanation": "Le compilateur traite un `.cpp` à la fois et se contente de la déclaration du header. Le linker assemble ensuite les `.o` et les librairies, et doit trouver une définition pour chaque symbole utilisé. Le code est donc syntaxiquement correct : c'est la composition du build qui pose problème."
    },
    {
      "question": "[Distinguer les erreurs] Lequel de ces messages n'est PAS une erreur d'édition de liens ?",
      "options": [
        "`undefined reference to 'Foo::bar()'`",
        "`multiple definition of 'Foo::bar()'`",
        "`'bar' was not declared in this scope`",
        "`undefined reference to 'vtable for Foo'`"
      ],
      "answer": "`'bar' was not declared in this scope`",
      "explanation": "« was not declared » est une erreur de compilation : le compilateur ne connaît pas le nom (header manquant, faute de frappe, namespace). « undefined reference » signifie que le symbole est déclaré mais pas défini, « multiple definition » qu'il est défini plusieurs fois, et « vtable » vient d'une fonction virtuelle non définie : ces trois-là sont des erreurs de linker."
    },
    {
      "question": "[Cause classique] `Foo.h` déclare `bar()`, `Foo.cpp` la définit, et tu lances `g++ main.cpp -o app`. Tu obtiens `undefined reference to 'Foo::bar()'`. Pourquoi ?",
      "options": [
        "Il manque `#pragma once` dans `Foo.h`.",
        "`Foo.cpp` n'est ni compilé ni lié : le linker ne voit que `main.o`. Correction : `g++ main.cpp Foo.cpp -o app` (ou ajouter `Foo.cpp` à la cible CMake).",
        "Il faut écrire `#include \"Foo.cpp\"` dans `main.cpp`.",
        "`bar()` doit être déclarée `static`."
      ],
      "answer": "`Foo.cpp` n'est ni compilé ni lié : le linker ne voit que `main.o`. Correction : `g++ main.cpp Foo.cpp -o app` (ou ajouter `Foo.cpp` à la cible CMake).",
      "explanation": "Inclure le header suffit au compilateur, pas au linker. Inclure un `.cpp` est une mauvaise pratique qui provoque des « multiple definition » dès que deux fichiers l'incluent. Les include guards protègent contre la double inclusion dans un même `.cpp`, pas contre un fichier oublié."
    },
    {
      "question": "[Outil] `nm -C main.o` affiche `U Foo::bar()` et `nm -C Foo.o` affiche `T Foo::bar()`. Comment l'interpréter ?",
      "options": [
        "`U` : symbole référencé mais non défini dans ce fichier (attendu ailleurs). `T` : symbole défini dans la section code. Si `Foo.o` est passé au linker, `Foo::bar()` sera résolu.",
        "`U` signifie « utilisé », `T` signifie « testé ».",
        "`U` signifie « unique », `T` signifie « template ».",
        "Les deux fichiers définissent `bar()` : risque de « multiple definition »."
      ],
      "answer": "`U` : symbole référencé mais non défini dans ce fichier (attendu ailleurs). `T` : symbole défini dans la section code. Si `Foo.o` est passé au linker, `Foo::bar()` sera résolu.",
      "explanation": "C'est le diagnostic de base : chaque `U` d'un fichier doit correspondre à un `T` (ou un autre symbole défini) dans un autre `.o` ou une librairie de la ligne de link. `-C` démangle les noms : sans lui, on voit `_ZN3Foo3barEv`. Si le `T` existe mais que l'erreur persiste, c'est que `Foo.o` ou la librairie n'est pas sur la ligne de link."
    },
    {
      "question": "[Symptôme runtime] `./app: error while loading shared libraries: libmylib.so: cannot open shared object file`. À quel moment cette erreur se produit-elle ?",
      "options": [
        "À la compilation de `main.cpp`.",
        "À l'édition de liens.",
        "Pendant l'exécution, au premier appel d'une fonction de `mylib`.",
        "Au lancement, avant même `main()` : le build a réussi, mais le chargeur dynamique ne trouve pas la `.so`."
      ],
      "answer": "Au lancement, avant même `main()` : le build a réussi, mais le chargeur dynamique ne trouve pas la `.so`.",
      "explanation": "Le binaire contient une entrée `NEEDED libmylib.so`. Au démarrage, `ld.so` doit charger toutes ces librairies. S'il en manque une, le processus s'arrête avant `main()`. Il ne faut pas confondre avec `dlopen()`, qui charge à la demande pendant l'exécution et renvoie `NULL` en cas d'échec."
    },
    {
      "question": "[Outil] Quelle commande affiche les librairies dynamiques dont dépend `./app`, avec `not found` pour celles qui sont introuvables ?",
      "options": [
        "`nm -C ./app`",
        "`cmake --build build --verbose`",
        "`ldd ./app`",
        "`g++ -v ./app`"
      ],
      "answer": "`ldd ./app`",
      "explanation": "`ldd` simule la résolution du chargeur et affiche chaque `.so` avec le chemin trouvé, ou `not found`. `nm` sert aux symboles (problèmes de link), `--verbose` montre les commandes de build. Remarque de sécurité : `ldd` peut exécuter du code, il faut donc l'utiliser sur un binaire de confiance. Sinon, `readelf -d ./app` fait l'affaire."
    },
    {
      "question": "[static membre] `struct Compteur { static inline int valeur = 10; }; Compteur a, b; a.valeur = 20; std::cout << b.valeur;` — Qu'est-ce qui est affiché ?",
      "options": [
        "10, car chaque instance a sa propre copie.",
        "20, car un membre `static` appartient à la classe et est partagé par toutes les instances.",
        "0, car `b` n'a jamais été modifié.",
        "Erreur de compilation : on ne peut pas accéder à un `static` via une instance."
      ],
      "answer": "20, car un membre `static` appartient à la classe et est partagé par toutes les instances.",
      "explanation": "Il n'existe qu'une seule variable `Compteur::valeur`. `a.valeur` et `b.valeur` désignent la même case mémoire (l'écriture `Compteur::valeur` est plus claire). Sans `static`, chaque objet aurait la sienne. `inline` (C++17) permet de l'initialiser dans la classe sans définition séparée dans un `.cpp`."
    },
    {
      "question": "[Slicing] `void show(Base b) { b.name(); }` appelée avec un `Derived` (où `name()` est virtuelle). Quelle version de `name()` s'exécute ?",
      "options": [
        "`Base::name()` : le passage par valeur copie uniquement la partie `Base`, l'objet reçu est réellement un `Base`.",
        "`Derived::name()`, grâce à `virtual`.",
        "Erreur de compilation.",
        "Comportement indéfini."
      ],
      "answer": "`Base::name()` : le passage par valeur copie uniquement la partie `Base`, l'objet reçu est réellement un `Base`.",
      "explanation": "C'est le slicing. `virtual` ne fonctionne qu'à travers une référence ou un pointeur. Correction : `void show(const Base& b)`. Même piège avec `catch (std::exception e)`."
    },
    {
      "question": "[Règle du zéro] Une classe ne contient que `std::string`, `std::vector<int>` et `std::unique_ptr<Conn>`. Quelles fonctions spéciales faut-il écrire ?",
      "options": [
        "Destructeur, copie et affectation (règle des trois).",
        "Les cinq fonctions spéciales.",
        "Seulement le destructeur.",
        "Aucune : tous les membres gèrent leurs ressources (règle du zéro). La classe sera déplaçable et non copiable à cause du `unique_ptr`."
      ],
      "answer": "Aucune : tous les membres gèrent leurs ressources (règle du zéro). La classe sera déplaçable et non copiable à cause du `unique_ptr`.",
      "explanation": "Les versions générées font la bonne chose membre par membre. Écrire un destructeur vide empêcherait même la génération automatique du déplacement. On n'écrit les fonctions spéciales que pour une classe qui gère elle-même une ressource brute."
    },
    {
      "question": "[Combo — map + const] `int lire(const std::map<std::string,int>& m) { return m[\"EUR\"]; }` — Résultat ?",
      "options": [
        "Retourne 0 si la clé est absente.",
        "Crée la clé \"EUR\" avec la valeur 0 puis la retourne.",
        "Erreur de compilation : `operator[]` peut insérer une clé, il n'existe pas en version `const`. Il faut `m.at(\"EUR\")` ou `m.find(\"EUR\")`.",
        "Lève `std::out_of_range` si la clé est absente."
      ],
      "answer": "Erreur de compilation : `operator[]` peut insérer une clé, il n'existe pas en version `const`. Il faut `m.at(\"EUR\")` ou `m.find(\"EUR\")`.",
      "explanation": "Deux pièges combinés : `map[k]` crée la clé si elle est absente, c'est justement pour cela qu'il n'est pas utilisable sur une map `const`. `at()` lève `std::out_of_range`, `find()` permet de tester sans exception."
    },
    {
      "question": "[Itérateurs] `auto it = v.begin(); v.push_back(42); std::cout << *it;` — Qu'en penser ?",
      "options": [
        "Toujours correct : `it` pointe sur le premier élément.",
        "Possible comportement indéfini : si `push_back` réalloue le stockage, `it` devient invalide.",
        "Erreur de compilation.",
        "`it` est automatiquement mis à jour."
      ],
      "answer": "Possible comportement indéfini : si `push_back` réalloue le stockage, `it` devient invalide.",
      "explanation": "Quand la capacité est atteinte, le vector alloue un nouveau bloc, déplace les éléments et libère l'ancien. Itérateurs, pointeurs et références vers les éléments deviennent pendants. Le bug dépend de la capacité, donc il est intermittent ; ASan le révèle."
    },
    {
      "question": "[auto] `const BigObject& get();` puis `auto x = get(); x.modify();` — Que se passe-t-il ?",
      "options": [
        "`x` est une copie modifiable : `auto` enlève la référence et le `const` de premier niveau.",
        "Erreur de compilation : `x` est `const`.",
        "`x` est une référence, l'objet d'origine est modifié.",
        "Comportement indéfini."
      ],
      "answer": "`x` est une copie modifiable : `auto` enlève la référence et le `const` de premier niveau.",
      "explanation": "La déduction de `auto` suit celle des templates par valeur. Pour garder la référence sans copie : `const auto& x = get();` (et alors `modify()` ne compile plus). Piège fréquent de performance sur de gros objets."
    },
    {
      "question": "[Conversion] `if (-1 < 0u) std::cout << \"oui\"; else std::cout << \"non\";` — Qu'est-ce qui est affiché ?",
      "options": [
        "« oui », car -1 est inférieur à 0.",
        "Erreur de compilation.",
        "Comportement indéfini.",
        "« non » : `-1` est converti en `unsigned`, il devient la plus grande valeur possible."
      ],
      "answer": "« non » : `-1` est converti en `unsigned`, il devient la plus grande valeur possible.",
      "explanation": "Quand un signé et un non signé de même rang sont comparés, le signé est converti en non signé. Piège typique avec `i < v.size()` quand `i` est négatif. `-Wsign-compare` le signale ; C++20 propose `std::cmp_less`."
    },
    {
      "question": "[Déclarations] `const int* p1;` et `int* const p2 = &x;` — Quelle affirmation est vraie ?",
      "options": [
        "`p1` ne peut pas changer d'adresse, `*p2` ne peut pas être modifié.",
        "Les deux déclarations sont équivalentes.",
        "`*p1` ne peut pas être modifié mais `p1` peut pointer ailleurs ; `p2` ne peut pas pointer ailleurs mais `*p2` est modifiable.",
        "Aucun des deux ne permet de modifier quoi que ce soit."
      ],
      "answer": "`*p1` ne peut pas être modifié mais `p1` peut pointer ailleurs ; `p2` ne peut pas pointer ailleurs mais `*p2` est modifiable.",
      "explanation": "On lit de droite à gauche depuis le nom : `p1` est un pointeur vers un `int` constant ; `p2` est un pointeur constant vers un `int`. `const int*` et `int const*` sont identiques ; c'est la position du `const` par rapport à `*` qui compte."
    },
    {
      "question": "[Combo — destructeur virtuel + unique_ptr] `struct Base { ~Base(); }; struct Derived : Base { std::vector<int> data; };` puis `std::unique_ptr<Base> p = std::make_unique<Derived>();`. Que se passe-t-il à la destruction de `p` ?",
      "options": [
        "Tout est correct : `unique_ptr` connaît le vrai type.",
        "Comportement indéfini : le destructeur de `Base` n'est pas virtuel, `unique_ptr<Base>` appelle `~Base()` seulement, `data` n'est pas libéré.",
        "Erreur de compilation à la conversion.",
        "Double libération de `data`."
      ],
      "answer": "Comportement indéfini : le destructeur de `Base` n'est pas virtuel, `unique_ptr<Base>` appelle `~Base()` seulement, `data` n'est pas libéré.",
      "explanation": "Piège : on pense que le smart pointer protège de tout. `unique_ptr<Base>` fait `delete` sur un `Base*`, donc il faut `virtual ~Base()`. (`shared_ptr` créé par `make_shared<Derived>` mémorise le bon deleter, mais il ne faut pas compter dessus.)"
    },
    {
      "question": "[Combo — copie générée + double delete] `class Buf { double* d; public: Buf() : d(new double[10]) {} ~Buf() { delete[] d; } };` puis `{ Buf a; Buf b = a; }`. Résultat ?",
      "options": [
        "Double libération : la copie générée copie le pointeur, `a` et `b` font chacun `delete[]` sur le même bloc.",
        "Aucun problème : `b` reçoit son propre tableau.",
        "Fuite mémoire uniquement.",
        "Erreur de compilation : la copie est interdite."
      ],
      "answer": "Double libération : la copie générée copie le pointeur, `a` et `b` font chacun `delete[]` sur le même bloc.",
      "explanation": "La copie générée est superficielle (membre par membre). Corrections : remplacer `double*` par `std::vector<double>` (règle du zéro), ou écrire copie et affectation profondes (règle des trois/cinq), ou interdire la copie avec `= delete`."
    },
    {
      "question": "[Build/Deploy — Makefile] Tu modifies `foo.h`, inclus par `main.cpp`, et `make` répond « rien à faire ». Pourquoi, et quelle correction ?",
      "options": [
        "`make` ne gère pas le C++.",
        "Il faut toujours lancer `make clean` avant `make`.",
        "Il faut ajouter `#pragma once` dans `foo.h`.",
        "La règle `%.o: %.cpp` ne connaît pas les headers. Correction : compiler avec `-MMD -MP` et ajouter `-include $(OBJS:.o=.d)` pour que Make lise les dépendances générées."
      ],
      "answer": "La règle `%.o: %.cpp` ne connaît pas les headers. Correction : compiler avec `-MMD -MP` et ajouter `-include $(OBJS:.o=.d)` pour que Make lise les dépendances générées.",
      "explanation": "Make ne reconstruit une cible que si une dépendance déclarée est plus récente. `-MMD` fait écrire au compilateur un `main.d` du type `main.o: main.cpp foo.h`. Un `make clean` systématique masque le problème et ralentit chaque build."
    },
  ],
  avance: [
    {
      "question": "[Build/Deploy — Code retour] Dans un script CI, `./app; echo $?` affiche 127. Quelles causes faut-il envisager ?",
      "options": [
        "Une segmentation fault.",
        "Une assertion échouée.",
        "Commande introuvable (mauvais chemin, binaire non construit), ou librairie dynamique introuvable au chargement (`error while loading shared libraries`).",
        "Le test a réussi avec des warnings."
      ],
      "answer": "Commande introuvable (mauvais chemin, binaire non construit), ou librairie dynamique introuvable au chargement (`error while loading shared libraries`).",
      "explanation": "127 est le code de « not found » : le shell ne trouve pas la commande, ou le chargeur ne trouve pas une `.so` avant `main()`. Vérifier le chemin du binaire, puis `ldd ./app`. À distinguer de 139 (SIGSEGV) et 134 (SIGABRT)."
    },
    {
      "question": "[Build/Deploy — gdb] `bt` affiche : `#0 memcpy (libc)` `#1 std::vector<...>::_M_realloc (STL)` `#2 Pricer::addLeg (pricer.cpp:88)` `#3 main`. Que faire ensuite ?",
      "options": [
        "Ouvrir un ticket sur la libc.",
        "`frame 2` puis `print` / `info locals` : la première frame de notre code est celle où chercher le bug.",
        "`frame 0` puis `print` sur les registres.",
        "Recompiler en `-O3`."
      ],
      "answer": "`frame 2` puis `print` / `info locals` : la première frame de notre code est celle où chercher le bug.",
      "explanation": "Les frames du haut sont presque toujours dans la libc ou la STL, qui reçoivent des arguments invalides. On remonte jusqu'à notre code, on inspecte les variables (`print leg`, `print this->legs.size()`) et le source (`list`)."
    },
    {
      "question": "[Build/Deploy — Sanitizers] Quel flag permet de détecter une data race entre deux threads ?",
      "options": [
        "`-fsanitize=thread`",
        "`-fsanitize=address`",
        "`-fsanitize=undefined`",
        "`-Wall -Wextra`"
      ],
      "answer": "`-fsanitize=thread`",
      "explanation": "ThreadSanitizer instrumente les accès mémoire et la synchronisation. Il ne peut pas être combiné avec AddressSanitizer dans le même binaire : en CI, on prévoit un job ASan+UBSan et un job TSan séparés."
    },
    {
      "question": "[Build/Deploy — Livraison] Quelle pratique de déploiement est correcte ?",
      "options": [
        "Recompiler sur chaque serveur de production pour adapter le binaire.",
        "Copier le dossier `build` d'un poste développeur.",
        "Recompiler en production avec `-O0` pour pouvoir déboguer.",
        "Construire un artefact unique en CI, versionné, puis promouvoir ce même artefact de la recette vers la production."
      ],
      "answer": "Construire un artefact unique en CI, versionné, puis promouvoir ce même artefact de la recette vers la production.",
      "explanation": "« Build once, deploy many » : ce qui a été testé est exactement ce qui part en production, avec la traçabilité commit + options + dépendances. Recompiler sur place introduit un environnement non testé, et rend une régression difficile à reproduire ou à annuler."
    },
    {
      "question": "[Analyse de code] `class A { private: A(); A(int i = 0); public: virtual void doIt() = 0; };` puis `A a;` dans `main`. Pourquoi est-ce refusé ?",
      "options": [
        "Uniquement parce que les constructeurs sont privés.",
        "Uniquement parce que `A` est abstraite.",
        "Pour deux raisons indépendantes : les constructeurs sont privés ET `A` est abstraite (fonction virtuelle pure). Corriger l'une ne suffit pas.",
        "Ce code compile : `A a;` appelle simplement `A()`."
      ],
      "answer": "Pour deux raisons indépendantes : les constructeurs sont privés ET `A` est abstraite (fonction virtuelle pure). Corriger l'une ne suffit pas.",
      "explanation": "Une classe qui a une fonction virtuelle pure (`= 0`) ne peut jamais être instanciée directement : il faut une classe dérivée qui implémente `doIt()`. Indépendamment, un constructeur privé n'est accessible qu'aux membres et aux amis de la classe. Correction : constructeurs publics (ou `protected`) et `class Derived : public A { void doIt() override {} };`."
    },
    {
      "question": "[Piège caché] Même en rendant `A` publique et non abstraite, `A(); A(int i = 0);` puis `A a;` pose encore problème. Lequel ?",
      "options": [
        "Aucun problème : `A()` est prioritaire.",
        "Appel ambigu : les deux constructeurs peuvent être appelés sans argument, le compilateur ne peut pas choisir.",
        "`A(int i = 0)` est prioritaire car il est déclaré en dernier.",
        "Les valeurs par défaut sont interdites dans les constructeurs."
      ],
      "answer": "Appel ambigu : les deux constructeurs peuvent être appelés sans argument, le compilateur ne peut pas choisir.",
      "explanation": "Avec un paramètre par défaut, `A(int = 0)` est aussi un constructeur par défaut. Déclarer les deux compile, mais tout appel sans argument est ambigu. Correction : garder un seul des deux. C'est une erreur que peu de candidats repèrent dans l'exercice."
    },
    {
      "question": "[Durée de vie] `B& getInstance() { B b; return b; }` — Quel est le problème ?",
      "options": [
        "Référence pendante : `b` est détruit à la sortie de la fonction. Le code compile (avec un warning), mais utiliser la référence est un comportement indéfini.",
        "Erreur de compilation systématique.",
        "Aucun : la référence prolonge la durée de vie de `b`.",
        "`b` est automatiquement copié dans l'appelant."
      ],
      "answer": "Référence pendante : `b` est détruit à la sortie de la fonction. Le code compile (avec un warning), mais utiliser la référence est un comportement indéfini.",
      "explanation": "Une référence ne crée pas d'objet et ne le rend pas « plus vivant ». Elle désigne un objet existant. Une fois `b` détruit, la référence pointe vers de la mémoire morte. Correction : retourner par valeur (`B getInstance()`), ou retourner une référence vers un objet dont la durée de vie est garantie (membre, `static`)."
    },
    {
      "question": "[Signature] Header : `namespace net { void init(); }`. `net.cpp` : `#include \"net.h\"` puis `void init() { }` (sans namespace). `main` appelle `net::init()`. Résultat ?",
      "options": [
        "Ça fonctionne : `init` est retrouvée automatiquement.",
        "Erreur de compilation dans `net.cpp`.",
        "`multiple definition of 'init'`.",
        "`undefined reference to 'net::init()'` : `net.cpp` définit une autre fonction, `::init()` dans le namespace global, et `net::init()` n'est jamais définie."
      ],
      "answer": "`undefined reference to 'net::init()'` : `net.cpp` définit une autre fonction, `::init()` dans le namespace global, et `net::init()` n'est jamais définie.",
      "explanation": "Pour une fonction libre, une définition qui ne correspond pas exactement (namespace, type de paramètre, `long` au lieu de `int`…) crée une nouvelle fonction sans erreur de compilation. Le décalage n'apparaît qu'au link. Correction : `void net::init() { }` ou `namespace net { void init() { } }`. Pour une fonction membre, une définition hors classe sans déclaration correspondante est en revanche une erreur de compilation."
    },
    {
      "question": "[Template] `Stack.h` déclare `template<class T> class Stack { void push(T); };` et `Stack.cpp` définit `push`. `main.cpp` utilise `Stack<int>`. Erreur : `undefined reference to 'Stack<int>::push(int)'`. Pourquoi ?",
      "options": [
        "Parce que `Stack.cpp` n'est pas dans le build.",
        "Parce que `int` n'est pas un type autorisé pour un template.",
        "Parce que les templates sont instanciés là où ils sont utilisés : `main.cpp` ne voit pas le corps de `push`, et `Stack.cpp` ne sait pas qu'il faut générer `Stack<int>`. Il faut définir le template dans le header, ou ajouter une instanciation explicite.",
        "Parce qu'il manque le mot-clé `virtual`."
      ],
      "answer": "Parce que les templates sont instanciés là où ils sont utilisés : `main.cpp` ne voit pas le corps de `push`, et `Stack.cpp` ne sait pas qu'il faut générer `Stack<int>`. Il faut définir le template dans le header, ou ajouter une instanciation explicite.",
      "explanation": "C'est un piège classique, car `Stack.cpp` est bien compilé et lié. Mais un template n'est pas du code tant qu'il n'est pas instancié. Solutions : tout mettre dans le header (`.h`/`.hpp`), ou ajouter `template class Stack<int>;` à la fin de `Stack.cpp`."
    },
    {
      "question": "[Ordre des librairies] `g++ -L. -lmylib main.o -o app` avec `libmylib.a` donne `undefined reference to 'Foo::bar()'`, alors que `bar` est dans `libmylib.a`. Pourquoi ?",
      "options": [
        "Parce que `-L.` est interdit.",
        "Parce que le linker GNU lit de gauche à droite : quand il traite `libmylib.a`, aucun symbole n'est encore demandé, donc il n'en extrait rien. La librairie doit être placée après les objets qui l'utilisent : `g++ main.o -L. -lmylib -o app`.",
        "Parce qu'une librairie statique ne peut pas contenir de méthodes de classe.",
        "Parce qu'il faut remplacer `-lmylib` par `-lmylib.a`."
      ],
      "answer": "Parce que le linker GNU lit de gauche à droite : quand il traite `libmylib.a`, aucun symbole n'est encore demandé, donc il n'en extrait rien. La librairie doit être placée après les objets qui l'utilisent : `g++ main.o -L. -lmylib -o app`.",
      "explanation": "Pour une archive statique, `ld` n'extrait que les `.o` qui résolvent des symboles déjà en attente. Règle : l'utilisateur d'abord, la dépendance ensuite. Si A dépend de B : `-lA -lB`. Avec CMake et `target_link_libraries`, l'ordre est géré automatiquement, ce qui est un argument de plus pour l'utiliser."
    },
    {
      "question": "[Link-time vs runtime] `g++ main.o -L/opt/mylib/lib -lmylib -o app` réussit, mais `./app` échoue avec `libmylib.so: cannot open shared object file`. Pourquoi ?",
      "options": [
        "`-L` ne sert qu'au linker pendant le build. Au lancement, le chargeur `ld.so` cherche dans d'autres emplacements (RPATH/RUNPATH, `LD_LIBRARY_PATH`, cache `ldconfig`, `/lib`, `/usr/lib`) et ne connaît pas `/opt/mylib/lib`.",
        "Le link a échoué silencieusement.",
        "Il fallait compiler avec `-static`.",
        "La librairie est corrompue."
      ],
      "answer": "`-L` ne sert qu'au linker pendant le build. Au lancement, le chargeur `ld.so` cherche dans d'autres emplacements (RPATH/RUNPATH, `LD_LIBRARY_PATH`, cache `ldconfig`, `/lib`, `/usr/lib`) et ne connaît pas `/opt/mylib/lib`.",
      "explanation": "C'est la confusion la plus fréquente : il y a deux recherches distinctes. Au link, `ld` utilise `-L`. À l'exécution, `ld.so` utilise ses propres chemins. Corrections : `-Wl,-rpath,/opt/mylib/lib` (RUNPATH), un fichier dans `/etc/ld.so.conf.d/` suivi de `sudo ldconfig`, ou `LD_LIBRARY_PATH` pour un test ponctuel."
    },
    {
      "question": "[Erreur de link spécifique] `undefined reference to 'vtable for Foo'`. Cause la plus probable ?",
      "options": [
        "`Foo` n'a aucune fonction virtuelle.",
        "Le header `Foo.h` est inclus deux fois.",
        "`Foo` est une classe abstraite.",
        "Une fonction virtuelle non pure de `Foo` (souvent le destructeur virtuel) est déclarée mais jamais définie, ou le `.cpp` qui la définit n'est pas lié. La vtable est émise avec la première fonction virtuelle non inline."
      ],
      "answer": "Une fonction virtuelle non pure de `Foo` (souvent le destructeur virtuel) est déclarée mais jamais définie, ou le `.cpp` qui la définit n'est pas lié. La vtable est émise avec la première fonction virtuelle non inline.",
      "explanation": "Avec l'ABI Itanium (GCC/Clang), le compilateur émet la vtable dans le `.o` qui définit la « key function », c'est-à-dire la première fonction virtuelle non pure et non inline. Si elle n'est jamais définie, aucun `.o` ne contient la vtable. Le message est trompeur car il ne nomme pas la fonction. Il faut vérifier chaque `virtual`, en particulier `virtual ~Foo();` sans corps."
    },
    {
      "question": "[Erreur inverse] `utils.h` contient `int square(int x) { return x * x; }` (sans `inline`) et est inclus dans `a.cpp` et `b.cpp`. Résultat au link ?",
      "options": [
        "`undefined reference to 'square(int)'`",
        "Aucun problème grâce aux include guards.",
        "`multiple definition of 'square(int)'` : chaque `.cpp` qui inclut le header produit sa propre définition, ce qui viole la règle d'une seule définition (ODR). Correction : `inline`, ou déclaration dans le header et définition dans un `.cpp`.",
        "Le linker garde silencieusement la première définition."
      ],
      "answer": "`multiple definition of 'square(int)'` : chaque `.cpp` qui inclut le header produit sa propre définition, ce qui viole la règle d'une seule définition (ODR). Correction : `inline`, ou déclaration dans le header et définition dans un `.cpp`.",
      "explanation": "C'est l'inverse de l'undefined reference : zéro définition donne « undefined », deux définitions donnent « multiple ». Les include guards empêchent seulement la double inclusion dans un même `.cpp`, pas entre deux `.cpp` différents. `inline` autorise plusieurs définitions identiques ; c'est implicite pour les méthodes définies dans la classe et pour les templates."
    },
    {
      "question": "[C / C++] Une librairie C fournit `compute(int)`. Un `main.cpp` l'appelle via un header sans `extern \"C\"`. `nm` montre `T compute` dans la lib et `U compute(int)` dans `main.o`. Diagnostic ?",
      "options": [
        "La librairie C n'est pas liée.",
        "Problème de name mangling : le C++ cherche le symbole décoré `_Z7computei`, alors que la lib C exporte `compute`. Il faut entourer les déclarations de `extern \"C\" { ... }` dans le header (avec `#ifdef __cplusplus`).",
        "Il faut recompiler la librairie C avec g++.",
        "Il faut déclarer `compute` en `static`."
      ],
      "answer": "Problème de name mangling : le C++ cherche le symbole décoré `_Z7computei`, alors que la lib C exporte `compute`. Il faut entourer les déclarations de `extern \"C\" { ... }` dans le header (avec `#ifdef __cplusplus`).",
      "explanation": "Le C++ encode le namespace, la classe et les types des paramètres dans le nom du symbole pour permettre la surcharge. Le C ne le fait pas. `nm -C` fait apparaître la différence : `compute(int)` avec signature d'un côté, `compute` brut de l'autre. Ce piège apparaît souvent quand on intègre des dépendances C (OpenSSL, zlib…)."
    }
  ],
  expert: [
    {
      "question": "[CMake — PRIVATE vs PUBLIC] Le header public `mylib.h` fait `#include <fmt/format.h>`, et on a écrit `target_link_libraries(mylib PRIVATE fmt::fmt)`. `app` (lié à `mylib`) échoue avec `fmt/format.h: No such file`. Pourquoi ?",
      "options": [
        "`PRIVATE` signifie que fmt sert uniquement à construire `mylib` : ses répertoires d'include ne sont pas propagés. Comme fmt apparaît dans un header public de `mylib`, il faut `PUBLIC`.",
        "fmt n'est pas installée.",
        "Il faut ajouter `add_dependencies(app fmt)`.",
        "Il faut lier fmt directement à `app` avec `PRIVATE`."
      ],
      "answer": "`PRIVATE` signifie que fmt sert uniquement à construire `mylib` : ses répertoires d'include ne sont pas propagés. Comme fmt apparaît dans un header public de `mylib`, il faut `PUBLIC`.",
      "explanation": "Règle : `PRIVATE` pour une dépendance utilisée seulement dans les `.cpp` ; `PUBLIC` si elle apparaît dans les headers publics (utilisée et exposée) ; `INTERFACE` si elle n'est utilisée que par les consommateurs (librairie header-only). Lier fmt directement à `app` masque le problème au lieu de décrire correctement `mylib`."
    },
    {
      "question": "[Ordre de recherche ld.so] Le binaire a un RUNPATH vers `/opt/app/lib` et `LD_LIBRARY_PATH=/tmp/test` contient aussi une `libmylib.so`. Laquelle est chargée ?",
      "options": [
        "Celle du RUNPATH, qui est toujours prioritaire.",
        "Celle de `/usr/lib`.",
        "Le chargeur s'arrête en signalant un conflit.",
        "Celle de `LD_LIBRARY_PATH` : il est consulté avant RUNPATH. Seul l'ancien RPATH (utilisé quand il n'y a pas de RUNPATH) passe avant `LD_LIBRARY_PATH`."
      ],
      "answer": "Celle de `LD_LIBRARY_PATH` : il est consulté avant RUNPATH. Seul l'ancien RPATH (utilisé quand il n'y a pas de RUNPATH) passe avant `LD_LIBRARY_PATH`.",
      "explanation": "Ordre glibc : DT_RPATH (s'il n'y a pas de DT_RUNPATH), puis `LD_LIBRARY_PATH`, puis DT_RUNPATH, puis le cache `ld.so.cache` (ldconfig), puis `/lib` et `/usr/lib`. Pour vérifier ce que contient le binaire : `readelf -d app | grep -E 'NEEDED|RPATH|RUNPATH'`. Une variable `LD_LIBRARY_PATH` oubliée en CI ou en prod peut ainsi charger une mauvaise version."
    },
    {
      "question": "[Présente mais incompatible] `./app` démarre puis échoue avec `symbol lookup error: ./app: undefined symbol: _ZN5mylib3fooEv`. Diagnostic ?",
      "options": [
        "La `.so` est introuvable.",
        "Il faut recompiler `main.cpp`.",
        "La `.so` est bien trouvée, mais ce n'est pas la bonne version : elle n'exporte pas `mylib::foo()`, qui existait dans la version utilisée au link. C'est une incompatibilité d'ABI ou de version, à vérifier avec `nm -D -C libmylib.so` et `ldd`.",
        "C'est une erreur de compilation."
      ],
      "answer": "La `.so` est bien trouvée, mais ce n'est pas la bonne version : elle n'exporte pas `mylib::foo()`, qui existait dans la version utilisée au link. C'est une incompatibilité d'ABI ou de version, à vérifier avec `nm -D -C libmylib.so` et `ldd`.",
      "explanation": "Il faut distinguer deux échecs runtime : « cannot open shared object file » (fichier introuvable) et « undefined symbol / symbol lookup error » (fichier trouvé mais incompatible). Prévention : versionner la librairie via son SONAME (`libmylib.so.1`), ne jamais casser l'ABI sans changer de version majeure, et déployer le binaire avec les librairies du même build (artefact CI)."
    },
    {
      "question": "[Initialisation + explicit] `struct S { explicit S(int); };` — Parmi `S a(5);`, `S b{5};`, `S c = 5;`, `S d = {5};`, lesquelles échouent ?",
      "options": [
        "Aucune.",
        "`S c = 5;` et `S d = {5};` : l'initialisation par copie (avec `=`) ne peut pas utiliser un constructeur `explicit`.",
        "Seulement `S c = 5;`",
        "Toutes sauf `S a(5);`"
      ],
      "answer": "`S c = 5;` et `S d = {5};` : l'initialisation par copie (avec `=`) ne peut pas utiliser un constructeur `explicit`.",
      "explanation": "`a(5)` et `b{5}` sont des initialisations directes, autorisées avec `explicit`. `c = 5` (copy-initialization) et `d = {5}` (copy-list-initialization) demandent une conversion implicite, que `explicit` interdit. C'est la vraie différence entre `T t{x}` et `T t = {x}`, souvent présentés à tort comme identiques."
    },
    {
      "question": "[Piège accolades] `std::vector<int> v1(3, 1); std::vector<int> v2{3, 1};` — Que contiennent `v1` et `v2` ?",
      "options": [
        "`v1` = `{1, 1, 1}` (3 éléments valant 1), `v2` = `{3, 1}` (2 éléments) : avec des accolades, le constructeur `std::initializer_list` est prioritaire.",
        "Les deux contiennent `{1, 1, 1}`.",
        "Les deux contiennent `{3, 1}`.",
        "`v1` = `{3, 1}`, `v2` = `{1, 1, 1}`."
      ],
      "answer": "`v1` = `{1, 1, 1}` (3 éléments valant 1), `v2` = `{3, 1}` (2 éléments) : avec des accolades, le constructeur `std::initializer_list` est prioritaire.",
      "explanation": "C'est la principale exception à « préférer `{}` » : dès qu'une classe a un constructeur `initializer_list`, les accolades le choisissent en priorité. Pour une taille et une valeur, il faut les parenthèses. Phrase à dire à l'oral : « `{}` protège des conversions rétrécissantes, mais attention aux conteneurs à cause d'`initializer_list`. »"
    },
    {
      "question": "[Combo — rethrow + slicing] `catch (const std::exception& e) { log(e); throw e; }` alors que l'exception lancée était un `std::out_of_range`. Que reçoit l'appelant ?",
      "options": [
        "Le `std::out_of_range` d'origine.",
        "Rien : relancer depuis un `catch` est interdit.",
        "Une erreur de compilation.",
        "Une copie de type `std::exception` : `throw e;` copie selon le type statique de `e`, le type réel est perdu. Il faut `throw;`."
      ],
      "answer": "Une copie de type `std::exception` : `throw e;` copie selon le type statique de `e`, le type réel est perdu. Il faut `throw;`.",
      "explanation": "`throw;` relance l'objet exception en cours, sans copie et avec son type réel. `throw e;` crée une nouvelle exception copiée depuis la partie `std::exception` : un `catch (const std::out_of_range&)` plus haut ne la capture plus."
    },
    {
      "question": "[Combo — try + boucle] Un batch traite 10 000 trades ; un trade invalide lève une exception. On veut traiter tous les autres et rapporter les erreurs. Où placer le `try` ?",
      "options": [
        "Autour de la boucle, pour un seul bloc `catch`.",
        "Il ne faut pas de `try` : on laisse le programme s'arrêter.",
        "Dans la boucle, autour du traitement d'un trade : l'erreur n'arrête que l'élément courant, on journalise et on continue. Le code retour final signale un succès partiel.",
        "Dans le destructeur de chaque trade."
      ],
      "answer": "Dans la boucle, autour du traitement d'un trade : l'erreur n'arrête que l'élément courant, on journalise et on continue. Le code retour final signale un succès partiel.",
      "explanation": "`try` autour de la boucle : la première erreur arrête tout (adapté si une erreur rend la suite invalide). `try` dedans : traitement par lot tolérant. On capture par `const&`, et on remonte un code retour distinct (ex. 1 = partiel, 2 = échec) à l'ordonnanceur."
    },
    {
      "question": "[Combo — montants + répartition] On répartit 100,00 € entre 3 contreparties. Quelle approche est correcte ?",
      "options": [
        "`double part = 100.0 / 3;` pour chacune, puis arrondi à 2 décimales.",
        "Travailler en centimes entiers : 10 000 / 3 = 3 333 reste 1 ; le centime restant va à la part de plus fort reste → 3 334 / 3 333 / 3 333.",
        "Arrondir chaque part au centime supérieur.",
        "Arrondir chaque part au demi-pair."
      ],
      "answer": "Travailler en centimes entiers : 10 000 / 3 = 3 333 reste 1 ; le centime restant va à la part de plus fort reste → 3 334 / 3 333 / 3 333.",
      "explanation": "Arrondir chaque part séparément donne 99,99 € ou 100,02 € : la somme ne retombe pas sur le total. Le plus fort reste garantit que la somme est exacte. L'arrondi demi-pair réduit le biais sur de grands volumes, mais ne garantit pas une somme exacte."
    },
    {
      "question": "[Combo — C++ / C / C#] Une DLL C++ est appelée depuis C# via `[DllImport]`. Une fonction exportée peut lever une exception. Quelle conception est correcte ?",
      "options": [
        "Exporter une fonction `extern \"C\"` qui capture toutes les exceptions (`catch (...)`) et retourne un code retour ; côté C#, tester le code et lever une exception .NET si besoin.",
        "Laisser l'exception C++ remonter : C# la convertit en exception .NET.",
        "Exporter directement une méthode de classe C++ avec son nom décoré.",
        "Utiliser `async void` côté C# pour isoler l'erreur."
      ],
      "answer": "Exporter une fonction `extern \"C\"` qui capture toutes les exceptions (`catch (...)`) et retourne un code retour ; côté C#, tester le code et lever une exception .NET si besoin.",
      "explanation": "Trois règles combinées : une exception ne traverse jamais une frontière d'API C (comportement indéfini, souvent un crash) ; `extern \"C\"` donne un nom de symbole stable, sans mangling ; l'interface se limite à des types simples et à un code retour."
    },
    {
      "question": "[Combo — -O2 + non initialisée] Un calcul est faux uniquement en Release (`-O2`), correct en Debug. Le code contient `double total; for (...) total += x;`. Diagnostic et démarche ?",
      "options": [
        "Bug de l'optimiseur : livrer en `-O0`.",
        "Ajouter `volatile` sur `total`.",
        "Relancer le build jusqu'à obtenir le bon résultat.",
        "Comportement indéfini : `total` n'est pas initialisée. En `-O0`, la pile contient souvent 0 par hasard. Compiler avec `-Wall -Wmaybe-uninitialized` (efficace en `-O2`), corriger en `double total = 0.0;` et ajouter un test."
      ],
      "answer": "Comportement indéfini : `total` n'est pas initialisée. En `-O0`, la pile contient souvent 0 par hasard. Compiler avec `-Wall -Wmaybe-uninitialized` (efficace en `-O2`), corriger en `double total = 0.0;` et ajouter un test.",
      "explanation": "Un écart Debug/Release signale presque toujours un UB. Le warning d'initialisation est plus fiable avec l'optimisation, car il s'appuie sur l'analyse de flux. Valgrind ou MemorySanitizer le confirment à l'exécution."
    },
    {
      "question": "[Build/Deploy — -MP] À quoi sert précisément `-MP` en plus de `-MMD` ?",
      "options": [
        "À générer les dépendances vers les headers système.",
        "À paralléliser la compilation.",
        "À ajouter une cible vide pour chaque header : si un header est supprimé ou renommé, Make n'échoue plus avec `No rule to make target 'foo.h'`.",
        "À compiler en code indépendant de la position."
      ],
      "answer": "À ajouter une cible vide pour chaque header : si un header est supprimé ou renommé, Make n'échoue plus avec `No rule to make target 'foo.h'`.",
      "explanation": "Sans `-MP`, l'ancien `.d` mentionne encore `foo.h` ; Make cherche à le reconstruire, ne trouve aucune règle et s'arrête. `-MMD` (et non `-MD`) exclut les headers système, ce qui allège les fichiers `.d`."
    },
    {
      "question": "[Build/Deploy — make -j] `make` fonctionne toujours, mais `make -j8` échoue une fois sur trois avec `cannot find -lcore`. Cause la plus probable ?",
      "options": [
        "Pas assez de mémoire.",
        "Une dépendance non déclarée : la cible `app` utilise `libcore.a` sans la lister comme dépendance. En séquentiel, l'ordre d'écriture masque l'erreur ; en parallèle, le link démarre avant que la librairie existe.",
        "Un bug de `make`.",
        "Il faut `-j1` en CI."
      ],
      "answer": "Une dépendance non déclarée : la cible `app` utilise `libcore.a` sans la lister comme dépendance. En séquentiel, l'ordre d'écriture masque l'erreur ; en parallèle, le link démarre avant que la librairie existe.",
      "explanation": "Un échec intermittent en parallèle indique presque toujours un graphe de dépendances incomplet. Correction : `app: main.o libcore.a`. Avec CMake, `target_link_libraries` déclare cette dépendance automatiquement. Forcer `-j1` masque le défaut et ralentit la CI."
    },
    {
      "question": "[Build/Deploy — Combo crash Release] Un test CI finit en 139 uniquement en Release. Quelle démarche est la plus efficace ?",
      "options": [
        "Reproduire dans l'image CI en `-O2 -g`, récupérer le core (`ulimit -c unlimited`) et faire `bt` dans gdb, puis relancer le test sous ASan + UBSan pour identifier le comportement indéfini.",
        "Passer la CI en Debug pour que le test passe.",
        "Ajouter des `printf` jusqu'à trouver la ligne.",
        "Augmenter le timeout du test."
      ],
      "answer": "Reproduire dans l'image CI en `-O2 -g`, récupérer le core (`ulimit -c unlimited`) et faire `bt` dans gdb, puis relancer le test sous ASan + UBSan pour identifier le comportement indéfini.",
      "explanation": "139 = SIGSEGV. Release seulement = probablement un UB (accès hors limites, référence pendante, non initialisée). `-g` reste compatible avec `-O2`. Les sanitizers pointent souvent la cause réelle, alors que gdb montre où le crash survient, parfois bien après."
    },
    {
      "question": "[Build/Deploy — Packaging] On livre `app/bin/app` et `app/lib/libpricing.so`, et le paquet peut être installé dans n'importe quel dossier. Quelle configuration est correcte ?",
      "options": [
        "Ajouter `LD_LIBRARY_PATH` dans le script de lancement de chaque serveur.",
        "Copier `libpricing.so` dans `/usr/lib` à la main.",
        "Lier avec `-L../lib` uniquement.",
        "Embarquer un RUNPATH relatif `$ORIGIN/../lib` (CMake : `INSTALL_RPATH \"$ORIGIN/../lib\"`) et vérifier avec `readelf -d bin/app` puis `ldd bin/app` avant livraison."
      ],
      "answer": "Embarquer un RUNPATH relatif `$ORIGIN/../lib` (CMake : `INSTALL_RPATH \"$ORIGIN/../lib\"`) et vérifier avec `readelf -d bin/app` puis `ldd bin/app` avant livraison.",
      "explanation": "`$ORIGIN` est remplacé au lancement par le dossier du binaire : le paquet est relocalisable. `-L` ne sert qu'au link. `LD_LIBRARY_PATH` est fragile (absent sous systemd ou cron, prioritaire sur RUNPATH)."
    },
    {
      "question": "[Build/Deploy — ASan vs Valgrind] Quelle affirmation est correcte ?",
      "options": [
        "Valgrind et ASan détectent les data races.",
        "ASan fonctionne sur n'importe quel binaire sans recompilation.",
        "ASan nécessite une recompilation (`-fsanitize=address` à la compilation et au link) et coûte environ ×2 ; Valgrind analyse le binaire existant sans recompilation, mais 20 à 50 fois plus lentement. On ne lance pas un binaire ASan sous Valgrind.",
        "Valgrind est plus rapide qu'ASan."
      ],
      "answer": "ASan nécessite une recompilation (`-fsanitize=address` à la compilation et au link) et coûte environ ×2 ; Valgrind analyse le binaire existant sans recompilation, mais 20 à 50 fois plus lentement. On ne lance pas un binaire ASan sous Valgrind.",
      "explanation": "ASan est le bon outil pour la CI (rapide, messages précis). Valgrind dépanne quand on ne peut pas recompiler (binaire livré, librairie tierce). Pour les data races : TSan, ou Helgrind côté Valgrind."
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
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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
