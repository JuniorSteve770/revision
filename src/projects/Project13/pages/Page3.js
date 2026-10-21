// src/projects/CIBPricing/CIBPricingPreTradeQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — Entretien C++ Build / Édition de liens / CI-CD",
    "answer": "**Contexte mission** : maintenir et optimiser la compilation, l'édition de liens et la gestion de dépendances d'une solution C++, puis automatiser build, packaging, tests et déploiement dans une chaîne CI/CD. ◆ **Bloc 1 — Le langage** : construction vs affectation, syntaxes d'initialisation, classes abstraites, types incomplets, durée de vie (références pendantes), `static`, `new`/`delete`. ◆ **Bloc 2 — Le build** : préprocesseur → compilation → édition de liens → lancement. Savoir dire à quelle étape une erreur se produit. ◆ **Bloc 3 — Les librairies** : statique `.a` vs dynamique `.so`, recherche au link (`-L`) vs recherche au lancement (`ld.so`). ◆ **Bloc 4 — CMake** : cibles, `target_link_libraries`, `PRIVATE`/`PUBLIC`/`INTERFACE`. ◆ **Fil rouge à l'oral** : symptôme → étape en échec → hypothèse → outil → correction → validation."
  },
  {
    "question": "Construction vs affectation — La règle d'or",
    "answer": "**Question unique à se poser** : l'objet est-il en train de naître sur cette ligne, ou existe-t-il déjà ? ◆ **Indice visuel** : si le type est écrit devant le nom (`Account c = b;`), l'objet naît → **constructeur**. Si seul le nom apparaît (`d = b;`), l'objet existe → **opérateur d'affectation**. ◆ **Le signe `=` ne décide rien** : dans une déclaration, c'est une initialisation. ◆ **Exemple ligne par ligne** : `Account a;` → constructeur par défaut. `Account b(100);` → constructeur paramétré. `Account c = b;` → constructeur de copie. `Account d; d = b;` → défaut, puis `operator=`. ◆ **Copie ou déplacement** : `b` est une variable nommée (lvalue) → copie. Pour déplacer, il faut `std::move(b)`. ◆ **Phrase d'entretien** : « Je lis ligne par ligne, je regarde si l'objet existe déjà, puis je choisis entre constructeur et affectation. »"
  },
  {
    "question": "Les syntaxes d'initialisation — Ce que fait chacune",
    "answer": "**`T t;`** : default-initialization. Appelle le constructeur par défaut. Pour un `int` local ou un membre non initialisé par le constructeur, la valeur est **indéterminée**. ◆ **`T t{};`** : value-initialization. Constructeur par défaut, ou mise à zéro s'il n'y en a pas de fourni. ◆ **`T t(5);`** : initialisation directe, appelle le constructeur qui prend un `int`. ◆ **`T t{5};`** : initialisation directe par liste, interdit les conversions rétrécissantes. ◆ **`T t = {5};`** : copy-list-initialization, refusée si le constructeur est `explicit`. ◆ **`T t = T(5);`** : depuis C++17, élision garantie : un seul objet construit, aucune copie. ◆ **`T t; t = T(5);`** : deux opérations distinctes, une construction puis une affectation. ◆ **Exemple clé** : `struct Example { int x; }; Example a;` → `a.x` indéterminé. `Example b{};` → `b.x == 0`. Une variable globale ou `static` est toujours mise à zéro."
  },
  {
    "question": "Pièges d'initialisation — Ce que l'examinateur teste vraiment",
    "answer": "**Most vexing parse** : `T t();` déclare une **fonction** `t` qui retourne un `T`, aucun objet n'est créé. L'erreur apparaît plus loin, sur `t.value`. Correction : `T t;` ou `T t{};`. ◆ **Conversion rétrécissante** : `int a(3.7);` compile et tronque à 3. `int b{3.7};` est une **erreur de compilation**. C'est l'argument principal pour préférer `{}`. ◆ **explicit** : avec `explicit S(int)`, `S a(5);` et `S b{5};` compilent, mais `S c = 5;` et `S d = {5};` échouent, car le `=` demande une conversion implicite. ◆ **Le piège `initializer_list`** : `std::vector<int> v1(3, 1);` donne `{1, 1, 1}`, alors que `std::vector<int> v2{3, 1};` donne `{3, 1}`. Avec des accolades, le constructeur `initializer_list` est prioritaire. ◆ **Phrase d'entretien** : « Je préfère `{}` car il bloque les conversions dangereuses, mais je fais attention aux conteneurs à cause d'`initializer_list`. »"
  },
  {
    "question": "Analyse du code A/B — Les 5 erreurs à repérer",
    "answer": "**Code** : `class B; class A { private: A(); A(int i = 0); public: virtual void doIt() = 0; B& getInstance() { B b; return b; } };` puis `A a; B b = A::getInstance();` ◆ **Erreur 1 — Constructeurs privés** : `A a;` ne peut pas les appeler depuis `main`. ◆ **Erreur 2 — Classe abstraite** : `doIt() = 0` rend `A` non instanciable, indépendamment de l'erreur 1. ◆ **Erreur 3 — Ambiguïté cachée** : `A()` et `A(int i = 0)` sont tous deux appelables sans argument, donc `A a;` est ambigu. ◆ **Erreur 4 — Type incomplet** : avec seulement `class B;`, on ne peut pas écrire `B b;`. ◆ **Erreur 5 — Référence pendante** : `b` est local, la référence retournée pointe vers un objet détruit. ◆ **Erreur 6 — Appel non statique** : `A::getInstance()` exige un objet, la méthode n'est pas `static`. ◆ **Méthode orale** : séparer les erreurs de compilation (accès, abstraction, ambiguïté, type incomplet, appel) des erreurs de durée de vie (référence pendante), qui compilent avec un simple warning."
  },
  {
    "question": "Classe abstraite, accès, type incomplet — Les règles",
    "answer": "**Classe abstraite** : une seule fonction virtuelle pure (`= 0`) suffit. Jamais instanciable directement. Il faut une classe dérivée qui implémente toutes les fonctions pures : `class Derived : public A { void doIt() override {} };`. ◆ **override** : le compilateur vérifie que la méthode redéfinit bien une virtuelle de la base, ce qui évite les fautes de signature silencieuses. ◆ **Destructeur virtuel** : obligatoire dans une base polymorphe (`virtual ~A() = default;`), sinon `delete` via un pointeur de base est un comportement indéfini. ◆ **Constructeur privé** : accessible seulement aux membres et aux amis. Usage légitime : singleton, factory. ◆ **Déclaration anticipée `class B;`** : autorise les pointeurs (`B* p`), les références (`B&`) et les déclarations de fonctions. Interdit `B b;`, `sizeof(B)` et l'accès aux membres. ◆ **Intérêt en build** : la déclaration anticipée réduit les `#include` dans les headers, donc les dépendances et les temps de compilation."
  },
  {
    "question": "Durée de vie — Références pendantes et retour par valeur",
    "answer": "**Principe** : une référence ne crée pas d'objet et ne prolonge pas sa vie. Elle désigne un objet qui doit exister plus longtemps qu'elle. ◆ **Le bug** : `B& getInstance() { B b; return b; }`. `b` est détruit à la sortie de la fonction. Le code compile (warning), mais utiliser la référence est un **comportement indéfini**. ◆ **Correction 1** : retourner par valeur, `B getInstance() const { return B{}; }`. ◆ **Pourquoi c'est performant** : depuis C++17, retourner un temporaire bénéficie de l'élision garantie, l'objet est construit directement chez l'appelant. Pour une variable locale nommée, c'est le NRVO, presque toujours appliqué. ◆ **Correction 2** : retourner une référence vers un objet qui survit (membre de la classe, variable `static`). ◆ **Même famille de bugs** : pointeur vers une variable locale, `std::string_view` vers une chaîne temporaire, itérateur après modification du conteneur."
  },
  {
    "question": "static — Portée vs durée de vie",
    "answer": "**Membre de classe `static`** : une seule variable pour toute la classe, partagée par toutes les instances. `struct Compteur { static inline int valeur = 10; }; a.valeur = 20;` → `b.valeur` vaut aussi 20. ◆ **Écriture recommandée** : `Compteur::valeur`, plus claire que via une instance. ◆ **Déclaration vs définition** : avant C++17, `static int count;` dans la classe n'est qu'une déclaration. Sans `int Config::count = 0;` dans **un seul** `.cpp`, on obtient `undefined reference`. En C++17 : `static inline`. ◆ **Méthode `static`** : pas de `this`, appelable via `Classe::methode()`. Une méthode non statique exige un objet. ◆ **Variable locale `static`** : `int next() { static int n = 0; return ++n; }`. Initialisée une seule fois (thread-safe depuis C++11), elle conserve sa valeur : trois appels retournent 3. ◆ **À distinguer** : la **portée** (où le nom est visible) et la **durée de vie** (combien de temps l'objet existe). ◆ **C# vs C++** : en C#, `static` signifie aussi « attaché à la classe », mais la mémoire est gérée par le garbage collector."
  },
  {
    "question": "new / delete — Les règles mémoire",
    "answer": "**Paires obligatoires** : `new` ↔ `delete`, `new[]` ↔ `delete[]`. Les mélanger compile, mais c'est un comportement indéfini. ◆ **Fuite mémoire** : un `new` sans `delete` correspondant. ◆ **Use-after-free** : `int* p = new int(5); delete p; std::cout << p[0];` → `delete` libère la mémoire sans modifier `p`, qui garde l'adresse. Lire est un comportement indéfini. ◆ **Double delete** : libérer deux fois le même pointeur, autre comportement indéfini. Mettre `p = nullptr` après `delete` limite ce risque (`delete nullptr` ne fait rien). ◆ **C++ moderne (RAII)** : `std::unique_ptr<T>` (propriétaire unique), `std::shared_ptr<T>` (propriété partagée), `std::vector<T>` au lieu de `new T[n]`. La libération est automatique à la sortie de portée. ◆ **Outillage CI** : AddressSanitizer (`-fsanitize=address`) détecte fuites, use-after-free et mauvais `delete` pendant les tests."
  },
  {
    "question": "La chaîne de build C++ — Quelle erreur à quelle étape",
    "answer": "**1. Préprocesseur** : traite `#include`, `#define`, `#ifdef`. Erreur type : `fatal error: Foo.h: No such file or directory` → chemin `-I` ou `target_include_directories` manquant. ◆ **2. Compilation** : chaque `.cpp` devient un `.o`, **indépendamment des autres**. Erreurs types : syntaxe, `'bar' was not declared in this scope`, type incomplet, classe abstraite. ◆ **3. Édition de liens** : le linker assemble les `.o` et les librairies et résout chaque symbole utilisé. Erreurs types : `undefined reference` (zéro définition), `multiple definition` (plusieurs). ◆ **4. Lancement** : le chargeur `ld.so` charge les `.so`. Erreurs types : `cannot open shared object file`, `undefined symbol`. ◆ **Clé de compréhension** : le compilateur se contente d'une **déclaration** (vue dans le header). Le linker exige une **définition** (présente dans un `.o` ou une librairie). ◆ **Commandes séparées** : `g++ -c main.cpp -o main.o`, `g++ -c Foo.cpp -o Foo.o`, `g++ main.o Foo.o -o app`."
  },
  {
    "question": "undefined reference — Les causes classiques",
    "answer": "**Sens exact** : un `.o` utilise un symbole, mais aucun fichier passé au linker ne le définit. Le code est syntaxiquement correct, c'est la composition du build qui est fausse. ◆ **Cause 1 — Définition absente** : `Foo::bar()` est déclarée dans le header mais jamais implémentée. ◆ **Cause 2 — Fichier oublié** : `Foo.cpp` n'est pas compilé ou pas lié (`g++ main.cpp -o app`). Correction : `g++ main.cpp Foo.cpp -o app`, ou ajouter le fichier à la cible CMake. ◆ **Cause 3 — Librairie non liée** : la fonction est dans `mylib` mais il manque `target_link_libraries(app PRIVATE mylib)`. ◆ **Cause 4 — Signature différente** : pour une fonction libre, `void process(long)` défini au lieu de `void process(int)`, ou définition hors du namespace (`void init()` au lieu de `void net::init()`) → c'est une **autre** fonction, l'erreur n'apparaît qu'au link. ◆ **Cause 5 — Ordre des librairies statiques** : `g++ -lmylib main.o` échoue, `g++ main.o -lmylib` réussit (le linker GNU lit de gauche à droite). ◆ **Cause 6 — Build incompatible** : objet issu d'une autre configuration, architecture ou version."
  },
  {
    "question": "undefined reference — Les cas avancés (et l'erreur inverse)",
    "answer": "**Template défini dans le `.cpp`** : `undefined reference to 'Stack<int>::push(int)'`. Un template est instancié là où il est utilisé. Correction : définition dans le header, ou `template class Stack<int>;` dans le `.cpp`. ◆ **vtable** : `undefined reference to 'vtable for Foo'` → une fonction virtuelle non pure (souvent le destructeur) est déclarée sans corps. La vtable est émise avec la première fonction virtuelle non inline. ◆ **Membre `static` non défini** : `static int count;` sans `int Config::count = 0;` dans un `.cpp`. ◆ **C appelé depuis C++** : sans `extern \"C\"`, le C++ cherche le nom décoré `_Z7computei` alors que la librairie C exporte `compute`. ◆ **L'erreur inverse — multiple definition** : une fonction définie dans un header sans `inline` et incluse dans deux `.cpp` donne deux définitions, ce qui viole l'ODR. Les include guards ne protègent qu'à l'intérieur d'un même `.cpp`. ◆ **Résumé** : zéro définition → « undefined », deux définitions → « multiple »."
  },
  {
    "question": "Diagnostiquer un problème de link — Les outils",
    "answer": "**`nm -C fichier.o`** : liste les symboles, `-C` démangle (`Foo::bar()` au lieu de `_ZN3Foo3barEv`). ◆ **Lire `nm`** : `U` = utilisé mais non défini ici (attendu ailleurs). `T` = défini dans la section code. Chaque `U` doit trouver un `T` dans un autre fichier de la ligne de link. ◆ **Cas typiques** : `U Foo::bar()` dans `main.o` et aucun `T` nulle part → définition absente. `T` présent dans `Foo.o` mais erreur quand même → `Foo.o` n'est pas sur la ligne de link. ◆ **Voir la vraie commande** : `cmake --build build --verbose` ou `make VERBOSE=1`. On vérifie quels `.o` et quelles librairies sont réellement passés au linker, et dans quel ordre. ◆ **Librairies** : `nm -C libmylib.a` pour une archive statique, `nm -D -C libmylib.so` pour les symboles exportés d'une `.so`. ◆ **Démangler un nom** : `c++filt _ZN3Foo3barEv`. ◆ **Phrase d'entretien** : « Je vérifie que la fonction est définie, que son fichier est compilé et lié, puis la signature et les dépendances de la cible, avec `nm -C` et la commande de link en mode verbose. »"
  },
  {
    "question": "Librairie statique vs dynamique — Les différences",
    "answer": "**Statique (`.a` Linux, `.lib` Windows)** : archive de `.o`. Au link, le linker **copie dans l'exécutable** les objets qui résolvent des symboles. Le binaire n'a plus besoin du `.a` ensuite. ◆ **Dynamique (`.so` Linux, `.dll` Windows)** : reste un fichier séparé. Le binaire garde une entrée `NEEDED`, et le chargeur `ld.so` charge la librairie au lancement. ◆ **Avantages statique** : déploiement simple, pas de problème de chemin au lancement. Inconvénients : binaire plus gros, mise à jour de la librairie = nouveau link. ◆ **Avantages dynamique** : binaire plus léger, librairie partagée entre programmes, mise à jour sans relink si l'ABI reste compatible. Inconvénients : chemins de recherche, versions, ABI à gérer au déploiement. ◆ **Piège Windows** : un `.lib` peut aussi être une **librairie d'import** pour une DLL, pas forcément une librairie statique. ◆ **Statique ≠ autonome** : si `libmylib.a` utilise `libssl.so`, l'exécutable dépend toujours de `libssl.so` (visible avec `ldd`). ◆ **CMake** : `add_library(mylib STATIC ...)` ou `SHARED`. Sans type, statique par défaut sauf si `BUILD_SHARED_LIBS=ON`."
  },
  {
    "question": "Librairie dynamique introuvable — Link-time vs runtime",
    "answer": "**Symptôme** : `./app: error while loading shared libraries: libmylib.so: cannot open shared object file`. Le build a réussi, le programme s'arrête **avant `main()`**. ◆ **La confusion n°1** : `-L/opt/mylib/lib` ne sert qu'au **linker** pendant le build. Le chargeur `ld.so` au lancement ne connaît pas ce chemin. Il y a deux recherches distinctes. ◆ **Ordre de recherche de `ld.so` (glibc)** : DT_RPATH (s'il n'y a pas de RUNPATH) → `LD_LIBRARY_PATH` → DT_RUNPATH → cache `ld.so.cache` (ldconfig) → `/lib`, `/usr/lib`. ◆ **Diagnostic** : `ldd ./app` affiche chaque `.so` avec son chemin ou `not found` (à utiliser sur un binaire de confiance). `readelf -d ./app` affiche `NEEDED`, `RPATH` et `RUNPATH` sans exécuter le binaire. ◆ **Test rapide** : `export LD_LIBRARY_PATH=/opt/mylib/lib:$LD_LIBRARY_PATH` puis relancer. Si ça fonctionne, c'est bien un problème de chemin. ◆ **À ne pas confondre** : `dlopen()` charge une librairie à la demande pendant l'exécution et renvoie `NULL` en cas d'échec, sans empêcher le démarrage."
  },
  {
    "question": "Librairies en production — Corrections durables et pièges",
    "answer": "**LD_LIBRARY_PATH** : outil de diagnostic, pas une solution de production. Il dépend du shell, il est absent d'un service systemd ou d'un cron, et il passe devant RUNPATH, donc il peut charger une mauvaise version. ◆ **Solution 1 — Configuration système** : fichier dans `/etc/ld.so.conf.d/mylib.conf` contenant le chemin, puis `sudo ldconfig`. ◆ **Solution 2 — RUNPATH relatif** : `-Wl,-rpath,'$ORIGIN/../lib'`. Le binaire cherche dans `lib/` à côté de `bin/`, le paquet devient relocalisable. En CMake : propriété `INSTALL_RPATH`. ◆ **Librairie trouvée mais incompatible** : `symbol lookup error: undefined symbol: ...` → mauvaise version de la `.so`. Vérifier avec `nm -D -C libmylib.so`. Prévention : SONAME versionné (`libmylib.so.1`), ne pas casser l'ABI sans changer de version majeure. ◆ **-fPIC** : une `.so` doit être compilée en code indépendant de la position, y compris les `.a` qu'on y intègre. Erreur type : `recompile with -fPIC`. CMake : `POSITION_INDEPENDENT_CODE ON`. ◆ **Phrase d'entretien** : « Je vérifie les dépendances avec `ldd`, les chemins avec `readelf -d`, puis je corrige le packaging ou la configuration du chargeur, pas l'environnement du shell. »"
  },
  {
    "question": "CMake — Le CMakeLists.txt minimal app + mylib",
    "answer": "**Rôle de CMake** : générateur de système de build. Il produit des Makefiles, des fichiers Ninja ou une solution Visual Studio, qui pilotent ensuite le compilateur et le linker. Il ne compile pas lui-même. ◆ **Version un seul fichier** : `cmake_minimum_required(VERSION 3.16)` / `project(MonProjet LANGUAGES CXX)` / `set(CMAKE_CXX_STANDARD 17)` / `set(CMAKE_CXX_STANDARD_REQUIRED ON)` / `add_library(mylib mylib.cpp)` / `target_include_directories(mylib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})` / `add_executable(app main.cpp)` / `target_link_libraries(app PRIVATE mylib)`. ◆ **Version sous-dossiers** : à la racine, `add_subdirectory(mylib)` puis `add_executable(app app/main.cpp)` et `target_link_libraries(app PRIVATE mylib)`. Dans `mylib/CMakeLists.txt` : `add_library(mylib STATIC mylib.cpp)` et `target_include_directories(mylib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})`. ◆ **Construire** : `cmake -S . -B build` (configuration, build hors source) puis `cmake --build build` (appelle make ou ninja). Lancer : `./build/app`. ◆ **Phrase d'entretien** : « Je déclare deux cibles, j'exprime la dépendance avec `target_link_libraries`, et je mets les includes sur la cible pour qu'ils se propagent. »"
  },
  {
    "question": "CMake — Les distinctions qui piègent",
    "answer": "**`target_link_libraries` vs `add_dependencies`** : le premier lie réellement et propage les usage requirements. Le second impose seulement un ordre de construction, sans rien ajouter au link, ce qui donne un `undefined reference`. ◆ **`link_directories`** : ajoute un chemin `-L`, ne lie rien. À éviter en CMake moderne. ◆ **PRIVATE** : dépendance utilisée seulement dans les `.cpp` de la cible, non propagée. ◆ **PUBLIC** : utilisée dans les `.cpp` **et** visible dans les headers publics, propagée aux cibles qui lient. Exemple : si `mylib.h` inclut `<fmt/format.h>`, il faut `target_link_libraries(mylib PUBLIC fmt::fmt)`, sinon `app` ne trouve pas le header. ◆ **INTERFACE** : utilisée seulement par les consommateurs, typique d'une librairie header-only. ◆ **`target_include_directories` vs `include_directories`** : le premier est attaché à la cible et suit les dépendances. Le second s'applique globalement à tout le répertoire, sans notion de dépendance. ◆ **Type par défaut** : `add_library(mylib ...)` crée une librairie STATIC, sauf si `-DBUILD_SHARED_LIBS=ON`, ce qui permet de basculer tout le projet depuis la CI."
  },
  {
    "question": "CI/CD et méthode de diagnostic — Ce qu'il faut savoir dire",
    "answer": "**Pipeline type C++** : checkout → configuration (`cmake -S . -B build`) → build (`cmake --build build`) → tests (`ctest --test-dir build`) → analyse statique et sanitizers → packaging → publication des artefacts → déploiement. ◆ **Reproductibilité** : build dans une image Docker figée, dossier de build propre, mêmes options qu'en local. Les dépendances sont versionnées, pas installées à la main sur le poste. ◆ **« Ça marche chez moi, pas en CI »** : reproduire un build propre dans la même image (`rm -rf build`, `cmake --build build --verbose`). Causes typiques : ancien `.o` réutilisé localement, nouveau `.cpp` absent du `CMakeLists`, `file(GLOB)` non réévalué, librairie installée sur le poste mais pas dans l'image. ◆ **Méthode en 4 temps** : (1) identifier l'étape en échec ; (2) formuler une hypothèse ; (3) utiliser l'outil de cette étape ; (4) corriger, reconstruire proprement, relancer les tests. ◆ **Outil par symptôme** : header introuvable → `-I` / `target_include_directories`. `undefined reference` → `nm -C` + commande de link verbose. `.so` introuvable → `ldd` / `readelf -d`. ◆ **Réflexe d'entretien** : ne jamais donner seulement une définition. Expliquer le symptôme, le diagnostic, la correction et la validation."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Piège — Construction vs affectation] `Account b(100); Account c = b; Account d; d = b;` — Quelle fonction est appelée par `Account c = b;` ?",
      "options": [
        "L'opérateur d'affectation `operator=`, à cause du signe `=`.",
        "Le constructeur de copie : `c` est en train de naître sur cette ligne, le `=` d'une déclaration est une initialisation, pas une affectation.",
        "Le constructeur par défaut, puis l'opérateur d'affectation.",
        "Le constructeur de déplacement, car `b` est une variable locale."
      ],
      "answer": "Le constructeur de copie : `c` est en train de naître sur cette ligne, le `=` d'une déclaration est une initialisation, pas une affectation.",
      "explanation": "Règle d'or : le type est-il écrit devant le nom ? Si oui, l'objet naît → constructeur. Sinon, l'objet existe déjà → `operator=`. Le `=` ne décide rien. `b` est une lvalue nommée : c'est une copie, pas un déplacement (il faudrait `std::move(b)`)."
    },
    {
      "question": "[Comptage] Même code : `Account b(100); Account c = b; Account d; d = b;` — Combien de constructions et d'affectations ?",
      "options": [
        "2 constructions, 2 affectations.",
        "4 constructions, 0 affectation.",
        "3 constructions (paramétré, copie, défaut) et 1 affectation (`d = b`).",
        "2 constructions, 1 affectation."
      ],
      "answer": "3 constructions (paramétré, copie, défaut) et 1 affectation (`d = b`).",
      "explanation": "`b(100)` → constructeur paramétré. `c = b` dans une déclaration → constructeur de copie. `Account d;` → constructeur par défaut. `d = b;` → `d` existe déjà, donc opérateur d'affectation. Méthode orale : ligne par ligne, « l'objet existe-t-il déjà ? »."
    },
    {
      "question": "[Piège — Most vexing parse] Que fait exactement la ligne `SomeType t();` ?",
      "options": [
        "Elle crée `t` avec le constructeur par défaut.",
        "Elle value-initialise `t`, donc ses membres valent 0.",
        "Elle provoque immédiatement une erreur de compilation.",
        "Elle déclare une fonction `t` sans paramètre qui retourne un `SomeType` : aucun objet n'est créé."
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
        "Les deux compilent et valent 3.",
        "Les deux compilent et valent 4 (arrondi).",
        "`a` compile et vaut 3 (troncature, éventuel warning), `b` provoque une erreur : les accolades interdisent les conversions rétrécissantes.",
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
        "`Foo.cpp` n'est ni compilé ni lié : le linker ne voit que `main.o`. Correction : `g++ main.cpp Foo.cpp -o app` (ou ajouter `Foo.cpp` à la cible CMake).",
        "Il manque `#pragma once` dans `Foo.h`.",
        "Il faut écrire `#include \"Foo.cpp\"` dans `main.cpp`.",
        "`bar()` doit être déclarée `static`."
      ],
      "answer": "`Foo.cpp` n'est ni compilé ni lié : le linker ne voit que `main.o`. Correction : `g++ main.cpp Foo.cpp -o app` (ou ajouter `Foo.cpp` à la cible CMake).",
      "explanation": "Inclure le header suffit au compilateur, pas au linker. Inclure un `.cpp` est une mauvaise pratique qui provoque des « multiple definition » dès que deux fichiers l'incluent. Les include guards protègent contre la double inclusion dans un même `.cpp`, pas contre un fichier oublié."
    },
    {
      "question": "[Outil] `nm -C main.o` affiche `U Foo::bar()` et `nm -C Foo.o` affiche `T Foo::bar()`. Comment l'interpréter ?",
      "options": [
        "`U` signifie « utilisé », `T` signifie « testé ».",
        "`U` : symbole référencé mais non défini dans ce fichier (attendu ailleurs). `T` : symbole défini dans la section code. Si `Foo.o` est passé au linker, `Foo::bar()` sera résolu.",
        "`U` signifie « unique », `T` signifie « template ».",
        "Les deux fichiers définissent `bar()` : risque de « multiple definition »."
      ],
      "answer": "`U` : symbole référencé mais non défini dans ce fichier (attendu ailleurs). `T` : symbole défini dans la section code. Si `Foo.o` est passé au linker, `Foo::bar()` sera résolu.",
      "explanation": "C'est le diagnostic de base : chaque `U` d'un fichier doit correspondre à un `T` (ou un autre symbole défini) dans un autre `.o` ou une librairie de la ligne de link. `-C` démangle les noms : sans lui, on voit `_ZN3Foo3barEv`. Si le `T` existe mais que l'erreur persiste, c'est que `Foo.o` ou la librairie n'est pas sur la ligne de link."
    },
    {
      "question": "[Statique] Quand le code d'une librairie statique `libmylib.a` est-il intégré au programme ?",
      "options": [
        "Au lancement, par le chargeur dynamique `ld.so`.",
        "Lors de la compilation de chaque `.cpp` qui inclut `mylib.h`.",
        "Jamais : le binaire garde un lien vers le fichier `.a`.",
        "À l'édition de liens : le linker copie dans l'exécutable les `.o` de l'archive qui résolvent des symboles."
      ],
      "answer": "À l'édition de liens : le linker copie dans l'exécutable les `.o` de l'archive qui résolvent des symboles.",
      "explanation": "Un `.a` est une archive de `.o`. Au link, seuls les objets nécessaires sont extraits et copiés dans le binaire, qui n'a ensuite plus besoin du `.a`. Une librairie dynamique `.so` reste au contraire un fichier séparé, chargé au lancement par `ld.so`."
    },
    {
      "question": "[Symptôme runtime] `./app: error while loading shared libraries: libmylib.so: cannot open shared object file`. À quel moment cette erreur se produit-elle ?",
      "options": [
        "À la compilation de `main.cpp`.",
        "À l'édition de liens.",
        "Au lancement, avant même `main()` : le build a réussi, mais le chargeur dynamique ne trouve pas la `.so`.",
        "Pendant l'exécution, au premier appel d'une fonction de `mylib`."
      ],
      "answer": "Au lancement, avant même `main()` : le build a réussi, mais le chargeur dynamique ne trouve pas la `.so`.",
      "explanation": "Le binaire contient une entrée `NEEDED libmylib.so`. Au démarrage, `ld.so` doit charger toutes ces librairies. S'il en manque une, le processus s'arrête avant `main()`. Il ne faut pas confondre avec `dlopen()`, qui charge à la demande pendant l'exécution et renvoie `NULL` en cas d'échec."
    },
    {
      "question": "[Outil] Quelle commande affiche les librairies dynamiques dont dépend `./app`, avec `not found` pour celles qui sont introuvables ?",
      "options": [
        "`nm -C ./app`",
        "`ldd ./app`",
        "`cmake --build build --verbose`",
        "`g++ -v ./app`"
      ],
      "answer": "`ldd ./app`",
      "explanation": "`ldd` simule la résolution du chargeur et affiche chaque `.so` avec le chemin trouvé, ou `not found`. `nm` sert aux symboles (problèmes de link), `--verbose` montre les commandes de build. Remarque de sécurité : `ldd` peut exécuter du code, il faut donc l'utiliser sur un binaire de confiance. Sinon, `readelf -d ./app` fait l'affaire."
    },
    {
      "question": "[Terme → Définition] Quel est le rôle de CMake ?",
      "options": [
        "C'est un compilateur C++ concurrent de g++ et clang.",
        "C'est un générateur de système de build : il produit des Makefiles, des fichiers Ninja ou une solution Visual Studio, qui pilotent ensuite le compilateur et le linker.",
        "C'est un gestionnaire de paquets qui télécharge les dépendances.",
        "C'est un linker qui remplace `ld`."
      ],
      "answer": "C'est un générateur de système de build : il produit des Makefiles, des fichiers Ninja ou une solution Visual Studio, qui pilotent ensuite le compilateur et le linker.",
      "explanation": "Il y a deux phases : `cmake -S . -B build` configure et génère, puis `cmake --build build` lance l'outil de build (make, ninja…) qui appelle g++ et ld. CMake décrit des cibles et leurs dépendances de façon portable."
    },
    {
      "question": "[Piège CMake] Quelle commande fait réellement lier `app` à la librairie `mylib` du même projet ?",
      "options": [
        "`add_dependencies(app mylib)`",
        "`link_directories(mylib)`",
        "`target_link_libraries(app PRIVATE mylib)`",
        "`include_directories(mylib)`"
      ],
      "answer": "`target_link_libraries(app PRIVATE mylib)`",
      "explanation": "Piège classique : `add_dependencies` impose seulement un ordre de construction (mylib avant app) et n'ajoute rien à la ligne de link, donc on obtient un undefined reference. `link_directories` ajoute un chemin de recherche `-L` sans lier quoi que ce soit. `include_directories` concerne les headers. Seul `target_link_libraries` lie la librairie et propage ses usage requirements."
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
      "question": "[static local] `int next() { static int n = 0; return ++n; }` — Après `next(); next();`, que retourne `next()` ?",
      "options": [
        "1, car `n` est remis à 0 à chaque appel.",
        "0",
        "3, car `n` est initialisée une seule fois et conserve sa valeur jusqu'à la fin du programme.",
        "Comportement indéfini."
      ],
      "answer": "3, car `n` est initialisée une seule fois et conserve sa valeur jusqu'à la fin du programme.",
      "explanation": "Une variable locale `static` a la portée du bloc mais la durée de vie du programme. L'initialisation `= 0` n'a lieu qu'au premier passage (et elle est thread-safe depuis C++11). Ce qu'il faut distinguer : la portée (où le nom est visible) et la durée de vie (combien de temps l'objet existe)."
    }
    ],

  avance: [
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
      "question": "[Type incomplet] Avec seulement `class B;` (déclaration anticipée), laquelle de ces lignes est autorisée ?",
      "options": [
        "`B b;`",
        "`B* p = nullptr;`",
        "`auto n = sizeof(B);`",
        "`p->methode();`"
      ],
      "answer": "`B* p = nullptr;`",
      "explanation": "Une déclaration anticipée annonce que le type existe, sans donner sa taille ni ses membres. On peut déclarer des pointeurs et des références, ou des fonctions qui prennent ou retournent `B`. On ne peut pas créer d'objet, appeler `sizeof` ni accéder aux membres : il faut la définition complète. C'est l'erreur « B est un type incomplet » de l'exercice."
    },
    {
      "question": "[Durée de vie] `B& getInstance() { B b; return b; }` — Quel est le problème ?",
      "options": [
        "Erreur de compilation systématique.",
        "Référence pendante : `b` est détruit à la sortie de la fonction. Le code compile (avec un warning), mais utiliser la référence est un comportement indéfini.",
        "Aucun : la référence prolonge la durée de vie de `b`.",
        "`b` est automatiquement copié dans l'appelant."
      ],
      "answer": "Référence pendante : `b` est détruit à la sortie de la fonction. Le code compile (avec un warning), mais utiliser la référence est un comportement indéfini.",
      "explanation": "Une référence ne crée pas d'objet et ne le rend pas « plus vivant ». Elle désigne un objet existant. Une fois `b` détruit, la référence pointe vers de la mémoire morte. Correction : retourner par valeur (`B getInstance()`), ou retourner une référence vers un objet dont la durée de vie est garantie (membre, `static`)."
    },
    {
      "question": "[Appel] `B getInstance()` est une méthode non statique de `A`. Que dire de `B b = A::getInstance();` ?",
      "options": [
        "C'est correct : `::` permet d'appeler n'importe quelle méthode.",
        "C'est une erreur de compilation : une méthode non statique a besoin d'un objet (`this`). Il faut écrire `obj.getInstance()`, ou déclarer la méthode `static` si elle n'utilise aucun membre.",
        "Cela compile mais `this` vaut `nullptr`.",
        "Il suffit d'ajouter `virtual`."
      ],
      "answer": "C'est une erreur de compilation : une méthode non statique a besoin d'un objet (`this`). Il faut écrire `obj.getInstance()`, ou déclarer la méthode `static` si elle n'utilise aucun membre.",
      "explanation": "`Classe::methode()` n'est valable que pour une méthode `static`, ou depuis une autre méthode de la classe. Une méthode non statique reçoit implicitement `this`, donc elle doit être appelée sur une instance."
    },
    {
      "question": "[Retour par valeur] `B getInstance() const { return B{}; }` — Combien de copies ou de déplacements de `B` en C++17 ?",
      "options": [
        "Deux copies : une au `return`, une à l'affectation.",
        "Une copie obligatoire.",
        "Aucune : C++17 garantit l'élision de copie pour un prvalue retourné, l'objet est construit directement chez l'appelant.",
        "Aucune, car on retourne en fait une référence."
      ],
      "answer": "Aucune : C++17 garantit l'élision de copie pour un prvalue retourné, l'objet est construit directement chez l'appelant.",
      "explanation": "Retourner un temporaire (`return B{};`) bénéficie de l'élision garantie depuis C++17. Retourner une variable locale nommée relève du NRVO, que le compilateur fait presque toujours sans que ce soit garanti. Retourner par valeur est donc sûr et performant, alors que la version par référence était pendante."
    },
    {
      "question": "[new / delete] `int* p = new int(5); delete p; std::cout << *p;` — Que se passe-t-il ?",
      "options": [
        "Affiche 5 : `delete` ne touche pas à la valeur.",
        "`p` vaut automatiquement `nullptr` après `delete`.",
        "Comportement indéfini (use-after-free) : `p` contient toujours l'adresse, mais l'objet n'existe plus. Il faut mettre `p = nullptr`, ou mieux utiliser `std::unique_ptr`.",
        "Erreur de compilation."
      ],
      "answer": "Comportement indéfini (use-after-free) : `p` contient toujours l'adresse, mais l'objet n'existe plus. Il faut mettre `p = nullptr`, ou mieux utiliser `std::unique_ptr`.",
      "explanation": "`delete` libère la mémoire mais ne modifie pas le pointeur, qui devient pendant. Le programme peut afficher 5, une autre valeur ou planter : c'est un comportement indéfini. Les règles : un `new` correspond à un `delete`, sinon fuite mémoire ; jamais deux `delete` ; jamais d'accès après `delete`. En C++ moderne, on préfère RAII et smart pointers."
    },
    {
      "question": "[new[] / delete] `int* t = new int[10]; delete t;` — Qu'en penser ?",
      "options": [
        "C'est correct : `delete` libère tout le bloc.",
        "C'est un comportement indéfini : un `new[]` doit être libéré par `delete[]`. Encore mieux : `std::vector<int>` ou `std::unique_ptr<int[]>`.",
        "Seul le premier élément est libéré, ce qui est sans danger.",
        "Erreur de compilation."
      ],
      "answer": "C'est un comportement indéfini : un `new[]` doit être libéré par `delete[]`. Encore mieux : `std::vector<int>` ou `std::unique_ptr<int[]>`.",
      "explanation": "Les paires sont `new`/`delete` et `new[]`/`delete[]`. Les mélanger compile mais donne un comportement indéfini (destructeurs non appelés pour les types non triviaux, corruption du tas). Le compilateur ne le détecte pas toujours ; AddressSanitizer (`-fsanitize=address`) le signale."
    },
    {
      "question": "[Signature] Header : `namespace net { void init(); }`. `net.cpp` : `#include \"net.h\"` puis `void init() { }` (sans namespace). `main` appelle `net::init()`. Résultat ?",
      "options": [
        "Ça fonctionne : `init` est retrouvée automatiquement.",
        "Erreur de compilation dans `net.cpp`.",
        "`undefined reference to 'net::init()'` : `net.cpp` définit une autre fonction, `::init()` dans le namespace global, et `net::init()` n'est jamais définie.",
        "`multiple definition of 'init'`."
      ],
      "answer": "`undefined reference to 'net::init()'` : `net.cpp` définit une autre fonction, `::init()` dans le namespace global, et `net::init()` n'est jamais définie.",
      "explanation": "Pour une fonction libre, une définition qui ne correspond pas exactement (namespace, type de paramètre, `long` au lieu de `int`…) crée une nouvelle fonction sans erreur de compilation. Le décalage n'apparaît qu'au link. Correction : `void net::init() { }` ou `namespace net { void init() { } }`. Pour une fonction membre, une définition hors classe sans déclaration correspondante est en revanche une erreur de compilation."
    },
    {
      "question": "[Template] `Stack.h` déclare `template<class T> class Stack { void push(T); };` et `Stack.cpp` définit `push`. `main.cpp` utilise `Stack<int>`. Erreur : `undefined reference to 'Stack<int>::push(int)'`. Pourquoi ?",
      "options": [
        "Parce que `Stack.cpp` n'est pas dans le build.",
        "Parce que les templates sont instanciés là où ils sont utilisés : `main.cpp` ne voit pas le corps de `push`, et `Stack.cpp` ne sait pas qu'il faut générer `Stack<int>`. Il faut définir le template dans le header, ou ajouter une instanciation explicite.",
        "Parce que `int` n'est pas un type autorisé pour un template.",
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
        "Le link a échoué silencieusement.",
        "`-L` ne sert qu'au linker pendant le build. Au lancement, le chargeur `ld.so` cherche dans d'autres emplacements (RPATH/RUNPATH, `LD_LIBRARY_PATH`, cache `ldconfig`, `/lib`, `/usr/lib`) et ne connaît pas `/opt/mylib/lib`.",
        "Il fallait compiler avec `-static`.",
        "La librairie est corrompue."
      ],
      "answer": "`-L` ne sert qu'au linker pendant le build. Au lancement, le chargeur `ld.so` cherche dans d'autres emplacements (RPATH/RUNPATH, `LD_LIBRARY_PATH`, cache `ldconfig`, `/lib`, `/usr/lib`) et ne connaît pas `/opt/mylib/lib`.",
      "explanation": "C'est la confusion la plus fréquente : il y a deux recherches distinctes. Au link, `ld` utilise `-L`. À l'exécution, `ld.so` utilise ses propres chemins. Corrections : `-Wl,-rpath,/opt/mylib/lib` (RUNPATH), un fichier dans `/etc/ld.so.conf.d/` suivi de `sudo ldconfig`, ou `LD_LIBRARY_PATH` pour un test ponctuel."
    },
    {
      "question": "[Correction durable] En production, quelle correction est la plus propre pour une `.so` introuvable ?",
      "options": [
        "Ajouter `export LD_LIBRARY_PATH=...` dans le `.bashrc` de chaque serveur.",
        "Renommer `libmylib.so` en `libc.so` pour qu'elle soit trouvée.",
        "Installer la librairie dans un chemin connu du chargeur (fichier dans `/etc/ld.so.conf.d/` puis `ldconfig`), ou embarquer un RUNPATH relatif comme `$ORIGIN/../lib` dans le binaire.",
        "Relancer le programme jusqu'à ce qu'il trouve la librairie."
      ],
      "answer": "Installer la librairie dans un chemin connu du chargeur (fichier dans `/etc/ld.so.conf.d/` puis `ldconfig`), ou embarquer un RUNPATH relatif comme `$ORIGIN/../lib` dans le binaire.",
      "explanation": "`LD_LIBRARY_PATH` sert au diagnostic : il dépend de l'environnement du shell, il est absent d'un service systemd ou d'un cron, et il peut masquer d'autres librairies. Les solutions durables sont la configuration système du chargeur (`ldconfig`) ou un RUNPATH `$ORIGIN`, qui rend le paquet relocalisable (`app/bin` + `app/lib`). En CMake : `INSTALL_RPATH`."
    },
    {
      "question": "[CMake — type par défaut] `add_library(mylib mylib.cpp)` sans `STATIC` ni `SHARED` : quel type de librairie est créé ?",
      "options": [
        "Toujours `SHARED`.",
        "`STATIC` par défaut, sauf si la variable `BUILD_SHARED_LIBS` est à `ON`, auquel cas elle est `SHARED`.",
        "`INTERFACE`.",
        "CMake refuse : le type est obligatoire."
      ],
      "answer": "`STATIC` par défaut, sauf si la variable `BUILD_SHARED_LIBS` est à `ON`, auquel cas elle est `SHARED`.",
      "explanation": "Laisser le type implicite permet de basculer tout le projet avec `-DBUILD_SHARED_LIBS=ON` au moment de la configuration, ce qui est pratique en CI. Pour imposer un type, on écrit `add_library(mylib STATIC ...)` ou `SHARED`."
    },
    {
      "question": "[CMake — cycle] Quelles commandes configurent puis construisent le projet hors source ?",
      "options": [
        "`cmake --build .` puis `make`",
        "`cmake -S . -B build` puis `cmake --build build`",
        "`g++ CMakeLists.txt -o app`",
        "`make` seul dans la racine du projet"
      ],
      "answer": "`cmake -S . -B build` puis `cmake --build build`",
      "explanation": "`-S` désigne la source (où se trouve `CMakeLists.txt`) et `-B` le dossier de build, séparé des sources. `cmake --build` appelle le bon outil (make, ninja, msbuild), ce qui le rend portable dans une CI. En diagnostic, on ajoute `--verbose` pour voir les vraies commandes g++ et de link."
    }
    ],

  expert: [
    {
      "question": "[Erreur de link spécifique] `undefined reference to 'vtable for Foo'`. Cause la plus probable ?",
      "options": [
        "`Foo` n'a aucune fonction virtuelle.",
        "Une fonction virtuelle non pure de `Foo` (souvent le destructeur virtuel) est déclarée mais jamais définie, ou le `.cpp` qui la définit n'est pas lié. La vtable est émise avec la première fonction virtuelle non inline.",
        "Le header `Foo.h` est inclus deux fois.",
        "`Foo` est une classe abstraite."
      ],
      "answer": "Une fonction virtuelle non pure de `Foo` (souvent le destructeur virtuel) est déclarée mais jamais définie, ou le `.cpp` qui la définit n'est pas lié. La vtable est émise avec la première fonction virtuelle non inline.",
      "explanation": "Avec l'ABI Itanium (GCC/Clang), le compilateur émet la vtable dans le `.o` qui définit la « key function », c'est-à-dire la première fonction virtuelle non pure et non inline. Si elle n'est jamais définie, aucun `.o` ne contient la vtable. Le message est trompeur car il ne nomme pas la fonction. Il faut vérifier chaque `virtual`, en particulier `virtual ~Foo();` sans corps."
    },
    {
      "question": "[Membre statique] Avant C++17 : `struct Config { static int count; };` utilisé dans `main`, sans autre ligne. Résultat ?",
      "options": [
        "`count` vaut 0 automatiquement.",
        "Erreur de compilation.",
        "`undefined reference to 'Config::count'` : la ligne dans la classe n'est qu'une déclaration. Il faut une définition dans un seul `.cpp` (`int Config::count = 0;`) ou, en C++17, `static inline int count = 0;`.",
        "Chaque `.cpp` crée sa propre copie de `count`."
      ],
      "answer": "`undefined reference to 'Config::count'` : la ligne dans la classe n'est qu'une déclaration. Il faut une définition dans un seul `.cpp` (`int Config::count = 0;`) ou, en C++17, `static inline int count = 0;`.",
      "explanation": "On retrouve la distinction déclaration / définition. Le compilateur accepte l'usage grâce à la déclaration, mais aucun `.o` ne réserve la variable. Il ne faut pas la définir dans le header sans `inline` : chaque `.cpp` qui l'inclut la définirait, ce qui donne un « multiple definition »."
    },
    {
      "question": "[Erreur inverse] `utils.h` contient `int square(int x) { return x * x; }` (sans `inline`) et est inclus dans `a.cpp` et `b.cpp`. Résultat au link ?",
      "options": [
        "`undefined reference to 'square(int)'`",
        "`multiple definition of 'square(int)'` : chaque `.cpp` qui inclut le header produit sa propre définition, ce qui viole la règle d'une seule définition (ODR). Correction : `inline`, ou déclaration dans le header et définition dans un `.cpp`.",
        "Aucun problème grâce aux include guards.",
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
    },
    {
      "question": "[CMake — PRIVATE vs PUBLIC] Le header public `mylib.h` fait `#include <fmt/format.h>`, et on a écrit `target_link_libraries(mylib PRIVATE fmt::fmt)`. `app` (lié à `mylib`) échoue avec `fmt/format.h: No such file`. Pourquoi ?",
      "options": [
        "fmt n'est pas installée.",
        "`PRIVATE` signifie que fmt sert uniquement à construire `mylib` : ses répertoires d'include ne sont pas propagés. Comme fmt apparaît dans un header public de `mylib`, il faut `PUBLIC`.",
        "Il faut ajouter `add_dependencies(app fmt)`.",
        "Il faut lier fmt directement à `app` avec `PRIVATE`."
      ],
      "answer": "`PRIVATE` signifie que fmt sert uniquement à construire `mylib` : ses répertoires d'include ne sont pas propagés. Comme fmt apparaît dans un header public de `mylib`, il faut `PUBLIC`.",
      "explanation": "Règle : `PRIVATE` pour une dépendance utilisée seulement dans les `.cpp` ; `PUBLIC` si elle apparaît dans les headers publics (utilisée et exposée) ; `INTERFACE` si elle n'est utilisée que par les consommateurs (librairie header-only). Lier fmt directement à `app` masque le problème au lieu de décrire correctement `mylib`."
    },
    {
      "question": "[CMake moderne] Pourquoi préférer `target_include_directories(mylib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})` à `include_directories(${CMAKE_CURRENT_SOURCE_DIR})` ?",
      "options": [
        "C'est seulement une question de style, le résultat est identique.",
        "La version `target_*` attache le chemin à la cible `mylib` et le propage automatiquement aux cibles qui la lient. `include_directories` s'applique à toutes les cibles du répertoire, sans notion de dépendance.",
        "`include_directories` n'existe plus.",
        "`target_include_directories` compile plus vite."
      ],
      "answer": "La version `target_*` attache le chemin à la cible `mylib` et le propage automatiquement aux cibles qui la lient. `include_directories` s'applique à toutes les cibles du répertoire, sans notion de dépendance.",
      "explanation": "Le CMake moderne raisonne en cibles et en usage requirements (includes, définitions, options, dépendances), propagés via `target_link_libraries`. Écrire `target_link_libraries(app PRIVATE mylib)` suffit alors pour que `app` trouve `mylib.h`. Les commandes globales (`include_directories`, `link_directories`, `add_definitions`) créent un couplage implicite difficile à maintenir."
    },
    {
      "question": "[Ordre de recherche ld.so] Le binaire a un RUNPATH vers `/opt/app/lib` et `LD_LIBRARY_PATH=/tmp/test` contient aussi une `libmylib.so`. Laquelle est chargée ?",
      "options": [
        "Celle du RUNPATH, qui est toujours prioritaire.",
        "Celle de `LD_LIBRARY_PATH` : il est consulté avant RUNPATH. Seul l'ancien RPATH (utilisé quand il n'y a pas de RUNPATH) passe avant `LD_LIBRARY_PATH`.",
        "Celle de `/usr/lib`.",
        "Le chargeur s'arrête en signalant un conflit."
      ],
      "answer": "Celle de `LD_LIBRARY_PATH` : il est consulté avant RUNPATH. Seul l'ancien RPATH (utilisé quand il n'y a pas de RUNPATH) passe avant `LD_LIBRARY_PATH`.",
      "explanation": "Ordre glibc : DT_RPATH (s'il n'y a pas de DT_RUNPATH), puis `LD_LIBRARY_PATH`, puis DT_RUNPATH, puis le cache `ld.so.cache` (ldconfig), puis `/lib` et `/usr/lib`. Pour vérifier ce que contient le binaire : `readelf -d app | grep -E 'NEEDED|RPATH|RUNPATH'`. Une variable `LD_LIBRARY_PATH` oubliée en CI ou en prod peut ainsi charger une mauvaise version."
    },
    {
      "question": "[Présente mais incompatible] `./app` démarre puis échoue avec `symbol lookup error: ./app: undefined symbol: _ZN5mylib3fooEv`. Diagnostic ?",
      "options": [
        "La `.so` est introuvable.",
        "La `.so` est bien trouvée, mais ce n'est pas la bonne version : elle n'exporte pas `mylib::foo()`, qui existait dans la version utilisée au link. C'est une incompatibilité d'ABI ou de version, à vérifier avec `nm -D -C libmylib.so` et `ldd`.",
        "Il faut recompiler `main.cpp`.",
        "C'est une erreur de compilation."
      ],
      "answer": "La `.so` est bien trouvée, mais ce n'est pas la bonne version : elle n'exporte pas `mylib::foo()`, qui existait dans la version utilisée au link. C'est une incompatibilité d'ABI ou de version, à vérifier avec `nm -D -C libmylib.so` et `ldd`.",
      "explanation": "Il faut distinguer deux échecs runtime : « cannot open shared object file » (fichier introuvable) et « undefined symbol / symbol lookup error » (fichier trouvé mais incompatible). Prévention : versionner la librairie via son SONAME (`libmylib.so.1`), ne jamais casser l'ABI sans changer de version majeure, et déployer le binaire avec les librairies du même build (artefact CI)."
    },
    {
      "question": "[Statique ≠ autonome] `app` est lié à `libmylib.a`, qui utilise OpenSSL en dynamique. `ldd ./app` liste encore `libssl.so`. Pourquoi ?",
      "options": [
        "Le link statique a échoué.",
        "Lier `mylib` statiquement ne copie que le code de `mylib`. Ses propres dépendances dynamiques (`libssl.so`) deviennent des dépendances de `app` et doivent être présentes au lancement.",
        "C'est un bug de `ldd`.",
        "Les `.a` contiennent toujours `libssl`."
      ],
      "answer": "Lier `mylib` statiquement ne copie que le code de `mylib`. Ses propres dépendances dynamiques (`libssl.so`) deviennent des dépendances de `app` et doivent être présentes au lancement.",
      "explanation": "Une librairie statique n'a pas de liste de dépendances : quand on la lie, il faut aussi fournir ses dépendances au linker (CMake le fait via `target_link_libraries` sur `mylib`). Elles restent dynamiques. L'application n'est donc pas autonome tant que toutes les dépendances ne sont pas statiques, et même alors, la libc pose ses propres contraintes."
    },
    {
      "question": "[-fPIC] Construction de `libmylib.so` en y liant `libcore.a` : `relocation R_X86_64_32 against '.rodata' can not be used when making a shared object; recompile with -fPIC`. Correction ?",
      "options": [
        "Passer `mylib` en `STATIC`, c'est la seule solution.",
        "Compiler `core` en code indépendant de la position : `set_target_properties(core PROPERTIES POSITION_INDEPENDENT_CODE ON)` (ou `CMAKE_POSITION_INDEPENDENT_CODE ON`). CMake ne l'active automatiquement que pour les cibles `SHARED`.",
        "Ajouter `-static` au link.",
        "Supprimer `.rodata`."
      ],
      "answer": "Compiler `core` en code indépendant de la position : `set_target_properties(core PROPERTIES POSITION_INDEPENDENT_CODE ON)` (ou `CMAKE_POSITION_INDEPENDENT_CODE ON`). CMake ne l'active automatiquement que pour les cibles `SHARED`.",
      "explanation": "Une `.so` peut être chargée à n'importe quelle adresse, donc tout le code qu'elle contient doit être compilé en PIC, y compris celui des `.a` qu'on y intègre. Une cible `STATIC` n'est pas en PIC par défaut. C'est une erreur fréquente quand un projet passe une sous-librairie de STATIC à SHARED."
    },
    {
      "question": "[CI/CD] Le build passe sur ton poste mais casse en CI avec `undefined reference`. Quelle démarche adopter en premier ?",
      "options": [
        "Relancer la pipeline jusqu'à ce qu'elle passe.",
        "Reproduire un build propre dans le même environnement que la CI (même image Docker, `rm -rf build`, `cmake -S . -B build`, `cmake --build build --verbose`) : un build incrémental local peut réutiliser d'anciens artefacts, ou une dépendance peut être installée localement mais absente de l'image.",
        "Désactiver l'étape de link en CI.",
        "Copier le dossier `build` local dans le dépôt."
      ],
      "answer": "Reproduire un build propre dans le même environnement que la CI (même image Docker, `rm -rf build`, `cmake -S . -B build`, `cmake --build build --verbose`) : un build incrémental local peut réutiliser d'anciens artefacts, ou une dépendance peut être installée localement mais absente de l'image.",
      "explanation": "Causes typiques de « ça marche chez moi » : un nouveau `.cpp` non ajouté au `CMakeLists` mais présent dans un ancien build local, un `file(GLOB)` non réévalué, une librairie installée sur le poste et pas dans l'image, ou un autre compilateur ou une autre configuration. Le principe CI : build reproductible, environnement figé, logs `--verbose` pour comparer les lignes de link."
    },
    {
      "question": "[Pattern diagnostic] Quel couple symptôme → outil est entièrement correct ?",
      "options": [
        "Header introuvable → `ldd` ; undefined reference → `ldconfig` ; `.so` introuvable → `nm -C`.",
        "Header introuvable → chemins `-I` / `target_include_directories` ; undefined reference → `nm -C` + ligne de link (`--verbose`) ; `.so` introuvable au lancement → `ldd` / `readelf -d`.",
        "Header introuvable → `nm -C` ; undefined reference → `ldd` ; `.so` introuvable → `cmake --build`.",
        "Tous les cas → relancer `make` sans option."
      ],
      "answer": "Header introuvable → chemins `-I` / `target_include_directories` ; undefined reference → `nm -C` + ligne de link (`--verbose`) ; `.so` introuvable au lancement → `ldd` / `readelf -d`.",
      "explanation": "Méthode en 4 temps : (1) identifier l'étape en échec (préprocesseur, compilation, link ou lancement) ; (2) formuler une hypothèse (fichier oublié, signature, ordre, chemin) ; (3) utiliser l'outil adapté à cette étape ; (4) corriger, reconstruire proprement et relancer les tests. Utiliser un outil d'une autre étape, par exemple `ldd` pour une erreur de link, est un signal négatif en entretien."
    },
    {
      "question": "[Initialisation + explicit] `struct S { explicit S(int); };` — Parmi `S a(5);`, `S b{5};`, `S c = 5;`, `S d = {5};`, lesquelles échouent ?",
      "options": [
        "Aucune.",
        "Seulement `S c = 5;`",
        "`S c = 5;` et `S d = {5};` : l'initialisation par copie (avec `=`) ne peut pas utiliser un constructeur `explicit`.",
        "Toutes sauf `S a(5);`"
      ],
      "answer": "`S c = 5;` et `S d = {5};` : l'initialisation par copie (avec `=`) ne peut pas utiliser un constructeur `explicit`.",
      "explanation": "`a(5)` et `b{5}` sont des initialisations directes, autorisées avec `explicit`. `c = 5` (copy-initialization) et `d = {5}` (copy-list-initialization) demandent une conversion implicite, que `explicit` interdit. C'est la vraie différence entre `T t{x}` et `T t = {x}`, souvent présentés à tort comme identiques."
    },
    {
      "question": "[Piège accolades] `std::vector<int> v1(3, 1); std::vector<int> v2{3, 1};` — Que contiennent `v1` et `v2` ?",
      "options": [
        "Les deux contiennent `{1, 1, 1}`.",
        "Les deux contiennent `{3, 1}`.",
        "`v1` = `{1, 1, 1}` (3 éléments valant 1), `v2` = `{3, 1}` (2 éléments) : avec des accolades, le constructeur `std::initializer_list` est prioritaire.",
        "`v1` = `{3, 1}`, `v2` = `{1, 1, 1}`."
      ],
      "answer": "`v1` = `{1, 1, 1}` (3 éléments valant 1), `v2` = `{3, 1}` (2 éléments) : avec des accolades, le constructeur `std::initializer_list` est prioritaire.",
      "explanation": "C'est la principale exception à « préférer `{}` » : dès qu'une classe a un constructeur `initializer_list`, les accolades le choisissent en priorité. Pour une taille et une valeur, il faut les parenthèses. Phrase à dire à l'oral : « `{}` protège des conversions rétrécissantes, mais attention aux conteneurs à cause d'`initializer_list`. »"
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
      }, 20000);
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

export default CIBPricingPreTradeQCM;
