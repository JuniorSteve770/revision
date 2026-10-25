// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "B1 — Lire du code existant",
    "answer": "**Déclaration** : lire depuis le nom, à droite puis à gauche. `const Deal* d` → cible constante ; `Deal* const d` → pointeur constant. ◆ **Passage** : valeur = copie ; `&` = modifie l'original ; `const&` = lit sans copier ; `*` = peut être nul → tester. ◆ **Propriétaire** : celui qui fait `delete`. Un pointeur nu reçu en paramètre ne se libère pas. ◆ **Legacy C++98** : `typedef`, `NULL`, itérateurs écrits en entier. Ancien, pas faux. ◆ **Moderniser** : figer la sortie avant, comparer après (`diff`)."
  },
  {
    "question": "B2 — Mémoire et cycle de vie",
    "answer": "**Pile** : détruit à la fin du bloc. **Tas** : détruit par son propriétaire. ◆ **`new` sans `delete`** = fuite ; **deux `delete`** = crash. ◆ **Exception** entre `new` et `delete` → le `delete` est sauté ; seuls les destructeurs sont garantis. ◆ **`unique_ptr`** : propriétaire par défaut, transfert avec `std::move` (la source devient `nullptr`) ; `.get()` = observateur. ◆ **Règle du 0**, sinon règle du 5 si pointeur brut possédé. ◆ **Preuve** : ASan ou Valgrind."
  },
  {
    "question": "B3 — Classes et polymorphisme",
    "answer": "**Base polymorphe** : `virtual ~Base() = default;` et `override` sur chaque redéfinition. ◆ **Abstraite** : une virtuelle pure `= 0` → non instanciable. ◆ **Polymorphisme** par `&`, `*` ou smart pointer, jamais par valeur (slicing). ◆ **Accès** : `private` (classe), `protected` (+ dérivées), `public` ; défaut `private` en `class`, `public` en `struct`. ◆ **Membres** construits dans l'ordre de déclaration. ◆ **Factory** : code produit → `unique_ptr<Base>`."
  },
  {
    "question": "B4 — STL et données",
    "answer": "**Conteneur** : `vector` par défaut ; `map` si ordre (O(log n)) ; `unordered_map` si recherche rapide (O(1)). ◆ **`map[k]`** crée la clé → lire avec `find` ou `at`. ◆ **Clé composée** : `std::pair` / `std::tuple`. ◆ **Fichier** : `getline` + `istringstream` + `getline(ss, champ, ';')`. ◆ **Rapprochement** : indexer A, parcourir B, effacer les trouvés ; le reste = absent de B. ◆ **Itérateurs** : invalides après `push_back` ; effacer avec `it = v.erase(it)`."
  },
  {
    "question": "B5 — Calculs financiers",
    "answer": "**Montants** : centimes `int64_t`, jamais `==` entre `double`. ◆ **Bases** : ACT/360, ACT/365 (jours réels) ; 30/360 (mois de 30 j). 15/03 → 15/06 = 92 j réels, 90 j en 30/360. ◆ **Arrondi** : `std::round(2.5)` = 3 ; demi-pair 2,5 → 2 ; `static_cast<int>(2.9)` = 2 (troncature). La règle vient de la MOA. ◆ **Plus fort reste** : somme des parts = total. ◆ **Cascade** : chaque rang reçoit `min(dû, dispo)`, l'equity le reliquat ; contrôle versé = encaissé."
  },
  {
    "question": "B6 — Erreurs et codes retour",
    "answer": "**`try` dans la boucle** : on rejette le deal, le lot continue. ◆ **`catch`** par `const&`, du plus précis au plus général. ◆ **Hiérarchie** : `ErreurDonnee` → MOA, `ErreurTechnique` → MOE. ◆ **Traduire** : `catch` technique, `throw` d'un message métier. ◆ **Code retour** : 0 OK, 1 partiel, 2 échec ; rien ne sort de `main` (sinon `std::terminate`). ◆ **Remontée** : les destructeurs s'exécutent ; un destructeur ne lève jamais. ◆ **`throw;`** relance sans copie."
  },
  {
    "question": "B7 — Build et librairies",
    "answer": "**Étape** : header introuvable = préprocesseur ; `not declared` = compilation ; `undefined reference` = link ; `.so` introuvable = chargement. ◆ **3 causes d'undefined reference** : non définie, `.cpp` non lié, librairie absente ou mal placée. Preuve : `nm -C` (`T` défini, `U` utilisé). ◆ **Ordre** : librairie après les `.o`. ◆ **Makefile** : `-MMD -MP`. ◆ **`-L`** = build ; au lancement : RUNPATH, `ldd`, `readelf -d`. ◆ **Avant livraison** : `make clean && make && ./tests`."
  },
  {
    "question": "B8 — Débogage",
    "answer": "**Préparer** : `-g` et `ulimit -c unlimited`. ◆ **gdb** : `gdb ./batch core` → `bt` → `frame n` (première frame de notre code) → `print`, `info locals`. ◆ **Outils** : ASan (mémoire), UBSan (UB), TSan (data race), Valgrind (sans recompiler, lent). ◆ **Bug seulement en `-O2`** : souvent un UB (variable non initialisée). ◆ **139** = segfault, très souvent un pointeur nul non testé."
  },
  {
    "question": "B9 — Performance et concurrence",
    "answer": "**Mesurer** avant d'optimiser (`steady_clock`), vérifier la même sortie après. ◆ **Recherche dans une boucle** = O(n×m) → construire un index `unordered_map` une fois. ◆ **Data race** : chaque thread écrit dans ses propres données, on combine après `join`. ◆ **Preuve** : TSan, pas un test qui passe. ◆ **C++ moderne** : `auto`, lambdas, `std::optional`, structured bindings, `if` avec initialiseur."
  }
];


const questions = {
  moyen: [
     {
          "question": "[B1] `void b(Deal& d);` — Que peut faire la fonction ?",
      "options": [
        "Travailler sur une copie.",
        "Modifier l'objet original de l'appelant.",
        "Recevoir `nullptr`.",
        "Seulement lire l'objet."
      ],
      "answer": "Modifier l'objet original de l'appelant.",
      "explanation": "`&` donne un autre nom à l'original. Copie = par valeur ; lecture seule = `const&` ; peut être nul = pointeur."
    },
    {
      "question": "[B1] Qui doit libérer un objet alloué avec `new` ?",
      "options": [
        "Son propriétaire.",
        "Toute fonction qui reçoit le pointeur.",
        "Le dernier qui l'utilise.",
        "Personne : le C++ s'en charge."
      ],
      "answer": "Son propriétaire.",
      "explanation": "Le propriétaire est celui qui doit libérer. Les autres observent. Un pointeur nu reçu en paramètre n'est en général pas à libérer."
    },
    {
      "question": "[B2] Un objet local `Deal a;` est détruit…",
      "options": [
        "à la fin du programme.",
        "par un `delete` explicite.",
        "par le garbage collector.",
        "à la fin du bloc `}`."
      ],
      "answer": "à la fin du bloc `}`.",
      "explanation": "Un objet sur la pile est détruit automatiquement à la sortie de son bloc. Seuls les objets du tas dépendent d'un propriétaire."
    },
    {
      "question": "[B2] Que provoque `delete d; delete d;` ?",
      "options": [
        "Rien : le second est ignoré.",
        "Une fuite mémoire.",
        "Une double libération : corruption du tas, crash souvent plus loin.",
        "Une erreur de compilation."
      ],
      "answer": "Une double libération : corruption du tas, crash souvent plus loin.",
      "explanation": "Correctif minimal : `d = nullptr;` après `delete`. Mieux : `std::unique_ptr`."
    },
    {
      "question": "[Confusion — pile/tas · fuite/double libération] `auto d = std::make_unique<Deal>();` et un batch qui grossit de 1 Go par nuit. Quelle lecture est juste ?",
      "options": [
        "Le Deal est sur la pile ; le batch fait une double libération.",
        "Le Deal et `d` sont sur le tas ; le batch a un débordement.",
        "`d` est sur la pile, le Deal sur le tas et libéré à la fin du bloc ; le batch qui grossit a une fuite (`new` sans `delete`).",
        "`d` est sur le tas ; une fuite provoque toujours un crash immédiat."
      ],
      "answer": "`d` est sur la pile, le Deal sur le tas et libéré à la fin du bloc ; le batch qui grossit a une fuite (`new` sans `delete`).",
      "explanation": "La fuite fait grossir le processus. La double libération corrompt le tas et provoque un crash, souvent plus loin."
    },
    {
      "question": "[B3] Une classe avec `virtual double valoriser() const = 0;` est…",
      "options": [
        "concrète.",
        "abstraite : non instanciable.",
        "une classe finale.",
        "une classe sans constructeur."
      ],
      "answer": "abstraite : non instanciable.",
      "explanation": "Une seule virtuelle pure suffit. Elle sert d'interface ; on instancie une dérivée qui l'implémente."
    },
    {
      "question": "[B3] En `class`, l'accès par défaut des membres est…",
      "options": [
        "`private`",
        "`public`",
        "`protected`",
        "dépend du compilateur"
      ],
      "answer": "`private`",
      "explanation": "`class` → `private` par défaut ; `struct` → `public`. C'est la seule différence entre les deux."
    },
    {
      "question": "[B4] Quel conteneur pour retrouver rapidement un deal par son id, sans besoin d'ordre ?",
      "options": [
        "`std::vector`",
        "`std::map`",
        "`std::list`",
        "`std::unordered_map`"
      ],
      "answer": "`std::unordered_map`",
      "explanation": "`unordered_map` : haché, O(1) en moyenne. `map` est trié, O(log n). `vector` imposerait une recherche linéaire."
    },
    {
      "question": "[B5] Pourquoi stocker les montants en centimes `int64_t` ?",
      "options": [
        "Pour gagner de la mémoire.",
        "Parce que `double` est interdit en C++.",
        "Parce que `double` est une approximation binaire : `0.1 + 0.2 == 0.3` est faux.",
        "Parce que c'est plus rapide à afficher."
      ],
      "answer": "Parce que `double` est une approximation binaire : `0.1 + 0.2 == 0.3` est faux.",
      "explanation": "Les erreurs s'accumulent dans les sommes et les comparaisons échouent. Les entiers sont exacts."
    },
    {
      "question": "[B6] Quel code retour doit rendre un batch qui a traité son lot avec quelques rejets ?",
      "options": [
        "0",
        "1",
        "2",
        "139"
      ],
      "answer": "1",
      "explanation": "Convention : 0 OK, 1 partiel, 2 échec. L'ordonnanceur lit ce code via `$?` pour décider de la suite."
    },
    {
      "question": "[Confusion — override/surcharge · exception/code retour · thread/processus] Quelle affirmation est entièrement vraie ?",
      "options": [
        "Surcharge = même nom, paramètres différents, choisie à la compilation ; l'ordonnanceur lit le code retour de `main`, pas l'exception ; les threads d'un processus partagent sa mémoire.",
        "`override` = même nom, paramètres différents ; l'ordonnanceur lit le message de l'exception ; chaque thread a sa mémoire.",
        "Surcharge = choisie à l'exécution ; l'ordonnanceur lit `stderr` ; les processus partagent leur mémoire.",
        "`override` = choisie à la compilation ; une exception sort du processus ; les threads ne partagent rien."
      ],
      "answer": "Surcharge = même nom, paramètres différents, choisie à la compilation ; l'ordonnanceur lit le code retour de `main`, pas l'exception ; les threads d'un processus partagent sa mémoire.",
      "explanation": "`override` redéfinit une virtuelle avec la **même** signature, choisie à l'exécution. Une exception ne sort pas du processus ; seul le code retour (0/1/2) est lu via `$?`."
    },
    {
      "question": "[B7] `undefined reference to 'valoriser'` : à quelle étape ?",
      "options": [
        "Édition de liens",
        "Préprocesseur",
        "Compilation",
        "Chargement"
      ],
      "answer": "Édition de liens",
      "explanation": "Le compilateur s'est contenté de la déclaration ; le linker ne trouve aucune définition."
    },
    {
      "question": "[B7] Dans `nm -C main.o`, que signifie `U valoriser(Deal const&)` ?",
      "options": [
        "Symbole unique.",
        "Symbole défini.",
        "Symbole inutilisé.",
        "Symbole utilisé mais non défini dans ce fichier."
      ],
      "answer": "Symbole utilisé mais non défini dans ce fichier.",
      "explanation": "`U` = utilisé, attendu ailleurs. `T` = défini dans la section code. Chaque `U` doit trouver un `T` sur la ligne de link."
    },
    {
      "question": "[Confusion — déclaration/définition · compilation/link] Quelle association est correcte ?",
      "options": [
        "Déclaration = corps dans le `.cpp`, exigée par le compilateur ; `g++ -c` fait le link.",
        "Déclaration = nom et type, suffit au compilateur ; définition = corps, exigée par le linker ; `g++ -c` compile un seul `.cpp` sans voir les autres.",
        "Définition et déclaration sont synonymes ; `g++ -c` compile et lie.",
        "Le linker se contente de la déclaration ; `g++ -c` produit l'exécutable."
      ],
      "answer": "Déclaration = nom et type, suffit au compilateur ; définition = corps, exigée par le linker ; `g++ -c` compile un seul `.cpp` sans voir les autres.",
      "explanation": "Sans définition, le compilateur passe mais le linker échoue : `undefined reference`. L'assemblage se fait ensuite avec `g++ main.o valo.o -o batch`."
    },
    {
      "question": "[B8] Un batch se termine avec le code 139. Cela signifie…",
      "options": [
        "Échec métier (code 2).",
        "Commande introuvable.",
        "Segmentation fault : 128 + 11 (SIGSEGV).",
        "Timeout."
      ],
      "answer": "Segmentation fault : 128 + 11 (SIGSEGV).",
      "explanation": "Cause la plus fréquente : un pointeur nul non testé. Suite : core + `gdb` + `bt`."
    },
    {
      "question": "[B8] Quelle option ajoute noms de fonctions et numéros de ligne au binaire ?",
      "options": [
        "`-O2`",
        "`-g`",
        "`-Wall`",
        "`-MMD`"
      ],
      "answer": "`-g`",
      "explanation": "`-g` ajoute les informations de débogage. Il reste compatible avec `-O2`."
    },
    {
      "question": "[B9] Quel outil prouve l'absence de data race ?",
      "options": [
        "TSan (`-fsanitize=thread`)",
        "Un test qui passe 100 fois.",
        "ASan",
        "Valgrind sans option"
      ],
      "answer": "TSan (`-fsanitize=thread`)",
      "explanation": "Une race peut n'apparaître qu'une fois sur mille. TSan la signale même quand le résultat est juste par chance."
    },
    {
      "question": "[B9] Que représente `std::optional<double>` ?",
      "options": [
        "Un `double` toujours initialisé à 0.",
        "Un pointeur vers un `double`.",
        "Un `double` thread-safe.",
        "Une valeur présente ou absente, sans valeur sentinelle."
      ],
      "answer": "Une valeur présente ou absente, sans valeur sentinelle.",
      "explanation": "On l'utilise par exemple pour un fixing absent (`std::nullopt`) au lieu d'un -1 ou d'un pointeur nul."
    },

  ],
  avance: [
         {
      "question": "[B1] `const Deal* d;` et `Deal* const d2 = p;` — Quelle affirmation est vraie ?",
      "options": [
        "`d` ne peut pas changer de cible ; `*d2` est en lecture seule.",
        "Les deux sont identiques.",
        "`*d` est en lecture seule mais `d` peut pointer ailleurs ; `d2` ne peut pas pointer ailleurs mais `*d2` est modifiable.",
        "Aucun des deux n'est modifiable."
      ],
      "answer": "`*d` est en lecture seule mais `d` peut pointer ailleurs ; `d2` ne peut pas pointer ailleurs mais `*d2` est modifiable.",
      "explanation": "On lit depuis le nom : `d` est un pointeur vers un Deal constant ; `d2` est un pointeur constant vers un Deal."
    },
    {
      "question": "[Confusion — référence/pointeur · pendante/nulle · const/constexpr] Quelle affirmation est vraie ?",
      "options": [
        "Une référence peut être nulle ; une référence pendante se teste avec `if` ; `const` = évalué à la compilation.",
        "Un pointeur ne peut pas être nul ; `constexpr` interdit la modification de l'objet.",
        "Référence et pointeur sont identiques ; une référence vers un local prolonge sa vie.",
        "Un pointeur peut être nul et se teste ; une référence pendante (vers un local détruit) ne se teste pas ; `double prix() const` ne modifie pas l'objet, `constexpr` = évaluable à la compilation."
      ],
      "answer": "Un pointeur peut être nul et se teste ; une référence pendante (vers un local détruit) ne se teste pas ; `double prix() const` ne modifie pas l'objet, `constexpr` = évaluable à la compilation.",
      "explanation": "Une référence n'est jamais nulle et ne change pas de cible. Correction d'une référence vers un local : retourner par valeur."
    },
    {
      "question": "[B1 + B5 — Piège] On remplace `new/delete` par `std::unique_ptr` dans un batch. Comment prouver qu'il n'y a pas de régression ?",
      "options": [
        "Le code compile, c'est suffisant.",
        "Relancer le batch sur le même jeu de données et comparer les sorties (`diff`).",
        "Vérifier qu'il n'y a plus de warning.",
        "Mesurer le temps d'exécution."
      ],
      "answer": "Relancer le batch sur le même jeu de données et comparer les sorties (`diff`).",
      "explanation": "Moderniser = ne pas changer le comportement. Un test qui fige la sortie avant, la même sortie après. Un résultat différent est une régression."
    },
    {
      "question": "[B2] `Deal* d = new Deal; valoriser(*d); delete d;` — `valoriser` lève une exception. Résultat ?",
      "options": [
        "Fuite : le `delete` n'est jamais atteint.",
        "Le `delete` est exécuté pendant la remontée.",
        "Le compilateur refuse ce code.",
        "Double libération."
      ],
      "answer": "Fuite : le `delete` n'est jamais atteint.",
      "explanation": "Une exception saute les instructions restantes ; seuls les destructeurs des objets locaux s'exécutent. Avec `make_unique`, la libération est garantie."
    },
    {
      "question": "[B2] `auto d = make_unique<Deal>(); v.push_back(std::move(d));` — Que vaut `d` ensuite ?",
      "options": [
        "Une copie du Deal.",
        "Un pointeur pendant.",
        "Erreur de compilation.",
        "`nullptr` : la propriété est passée au vector."
      ],
      "answer": "`nullptr` : la propriété est passée au vector.",
      "explanation": "`unique_ptr` n'est pas copiable ; `std::move` transfère et la source devient nulle. `v[0].get()` donne ensuite un simple observateur."
    },
    {
      "question": "[B2 — Piège règle du 5] `struct Buffer { char* p; ~Buffer() { delete[] p; } };` puis `Buffer b2 = b1;` — Conséquence ?",
      "options": [
        "Copie profonde automatique.",
        "Fuite mémoire uniquement.",
        "Double `delete[]` : la copie par défaut copie le pointeur (copie superficielle).",
        "Erreur de compilation."
      ],
      "answer": "Double `delete[]` : la copie par défaut copie le pointeur (copie superficielle).",
      "explanation": "Pointeur brut possédé → écrire les 5 fonctions spéciales, ou mieux, utiliser `std::vector<char>` / `std::string` (règle du 0)."
    },
    {
      "question": "[B3] `void f(Produit p);` appelée avec une `Obligation` (si `Produit` est concret). Que se passe-t-il ?",
      "options": [
        "`Obligation::valoriser` est appelée.",
        "Slicing : la partie dérivée est perdue, `Produit::valoriser` est appelée.",
        "Erreur à l'exécution.",
        "Le compilateur passe automatiquement une référence."
      ],
      "answer": "Slicing : la partie dérivée est perdue, `Produit::valoriser` est appelée.",
      "explanation": "Le polymorphisme passe par `&`, `*` ou smart pointer. Correction : `void f(const Produit& p)`."
    },
    {
      "question": "[B3 — Piège] `struct X { int a; int b; X() : b(1), a(b) {} };` — Que vaut `a` ?",
      "options": [
        "Une valeur indéterminée : `a` est construit avant `b`, dans l'ordre de déclaration.",
        "1",
        "0",
        "Erreur de compilation."
      ],
      "answer": "Une valeur indéterminée : `a` est construit avant `b`, dans l'ordre de déclaration.",
      "explanation": "L'ordre de la liste d'initialisation est ignoré. `-Wreorder` signale l'écart."
    },
    {
      "question": "[B4 — Piège] `std::map<std::string,double> tot; if (tot[\"USD\"] > 0) {}` — Effet de bord ?",
      "options": [
        "Aucun.",
        "Lève `std::out_of_range`.",
        "Erreur de compilation.",
        "Crée l'entrée \"USD\" = 0 dans la map."
      ],
      "answer": "Crée l'entrée \"USD\" = 0 dans la map.",
      "explanation": "`[]` crée la clé si elle est absente : parfait pour cumuler, dangereux pour lire. Lire avec `find` ou `at`."
    },
    {
      "question": "[B4] Comment effacer les deals annulés en parcourant un `vector` ?",
      "options": [
        "`for (auto& d : v) if (d.annule) v.erase(...);`",
        "`v.erase(it); ++it;`",
        "`if (it->annule) it = v.erase(it); else ++it;`",
        "Copier dans une `map` puis effacer."
      ],
      "answer": "`if (it->annule) it = v.erase(it); else ++it;`",
      "explanation": "`erase` invalide l'itérateur courant ; il renvoie l'itérateur suivant valide. Alternative C++20 : `std::erase_if`."
    },
    {
      "question": "[Confusion — unique/shared/weak · map/unordered_map] Une courbe partagée par plusieurs pricers, et un rapport par devise trié alphabétiquement. Quel choix ?",
      "options": [
        "`unique_ptr` dans chaque pricer ; `unordered_map`.",
        "`shared_ptr` pour la courbe ; `std::map` pour le rapport.",
        "`weak_ptr` dans chaque pricer ; `unordered_map`.",
        "Pointeur nu ; `std::vector` non trié."
      ],
      "answer": "`shared_ptr` pour la courbe ; `std::map` pour le rapport.",
      "explanation": "`shared_ptr` : l'objet meurt avec le dernier propriétaire ; `weak_ptr` observe sans garder en vie. `map` est trié ; `unordered_map` n'a aucun ordre."
    },
    {
      "question": "[B5] Du 15/03 au 15/06 : combien de jours en ACT/360 et en 30/360 ?",
      "options": [
        "90 et 92",
        "92 jours réels en ACT/360 ; 90 jours en 30/360",
        "92 et 92",
        "90 et 90"
      ],
      "answer": "92 jours réels en ACT/360 ; 90 jours en 30/360",
      "explanation": "ACT compte les jours réels (16 + 30 + 31 + 15 = 92). 30/360 compte 3 mois × 30 = 90."
    },
    {
      "question": "[B5 — Piège arrondis] Que valent `std::round(2.5)`, `std::nearbyint(2.5)` (mode par défaut) et `static_cast<int>(2.9)` ?",
      "options": [
        "3, 2, 2",
        "3, 3, 3",
        "2, 2, 3",
        "3, 2, 3"
      ],
      "answer": "3, 2, 2",
      "explanation": "`round` : demi loin de zéro → 3. `nearbyint` : demi-pair → 2. `static_cast` tronque → 2. La règle doit venir de la spécification MOA."
    },
    {
      "question": "[Confusion — ACT/360 vs ACT/365 · demi-haut vs demi-pair · throw; vs throw e;] Quelle série est correcte ?",
      "options": [
        "92 j → 0,2556 en ACT/360 et 0,2521 en ACT/365 ; demi-pair : 2,5 → 2 et 3,5 → 4 ; `throw;` relance l'exception d'origine sans copie.",
        "92 j → 0,2521 en ACT/360 ; demi-haut : 2,5 → 2 ; `throw e;` garde le vrai type.",
        "ACT/360 et ACT/365 donnent la même fraction ; demi-pair : 3,5 → 3 ; `throw;` crée une copie.",
        "92 j → 0,25 dans les deux bases ; les deux arrondis donnent 2,5 → 3 ; `throw e;` = `throw;`."
      ],
      "answer": "92 j → 0,2556 en ACT/360 et 0,2521 en ACT/365 ; demi-pair : 2,5 → 2 et 3,5 → 4 ; `throw;` relance l'exception d'origine sans copie.",
      "explanation": "Même numérateur (jours réels), dénominateur différent. Les arrondis ne diffèrent qu'au milieu. `throw e;` copie le type statique : slicing."
    },
    {
      "question": "[B6] Ordre des `catch` : `std::exception` en premier, puis `ErreurDonnee`. Problème ?",
      "options": [
        "Aucun : le plus précis est choisi.",
        "Erreur de compilation systématique.",
        "Les deux blocs s'exécutent.",
        "`ErreurDonnee` n'est jamais atteint : le premier `catch` compatible gagne."
      ],
      "answer": "`ErreurDonnee` n'est jamais atteint : le premier `catch` compatible gagne.",
      "explanation": "Du plus précis au plus général : `std::exception` toujours en dernier. Toujours par `const&`."
    },
    {
      "question": "[B6] Une exception n'est capturée nulle part, même pas dans `main`. Que se passe-t-il ?",
      "options": [
        "Le programme rend 0.",
        "Le programme rend 2.",
        "`std::terminate` : arrêt brutal, code retour non maîtrisé.",
        "L'exception est ignorée."
      ],
      "answer": "`std::terminate` : arrêt brutal, code retour non maîtrisé.",
      "explanation": "Un batch doit avoir un `try/catch` dans `main` qui journalise et renvoie 2."
    },
    {
      "question": "[B7] `g++ -L. -lvalo main.o -o batch` → `undefined reference`, alors que `valoriser` est dans `libvalo.a`. Pourquoi ?",
      "options": [
        "`-L.` est interdit.",
        "Le linker lit de gauche à droite : la librairie doit venir après les `.o` qui l'utilisent.",
        "Il faut écrire `-llibvalo.a`.",
        "La fonction doit être `static`."
      ],
      "answer": "Le linker lit de gauche à droite : la librairie doit venir après les `.o` qui l'utilisent.",
      "explanation": "Correct : `g++ main.o -L. -lvalo -o batch`. Pour une archive, `ld` n'extrait que ce qui est déjà demandé."
    },
    {
      "question": "[B7 + B8 — Combo] On modifie `deal.h` sans `-MMD -MP` ; le build incrémental passe, puis le batch plante de façon étrange. Explication ?",
      "options": [
        "Les `.cpp` qui incluent `deal.h` n'ont pas été recompilés : le binaire mélange deux versions de la structure. Corriger le Makefile et faire un build propre.",
        "Bug du compilateur.",
        "Le core dump est corrompu.",
        "Il manque `-g`."
      ],
      "answer": "Les `.cpp` qui incluent `deal.h` n'ont pas été recompilés : le binaire mélange deux versions de la structure. Corriger le Makefile et faire un build propre.",
      "explanation": "Sans dépendances vers les headers, Make ignore la modification. Avant livraison : `make clean && make && ./tests`."
    },
    {
      "question": "[B1 + B2 — Combo] `Portefeuille::ajouter(Deal* d) { deals_.push_back(d); }` et le destructeur fait `delete` de chaque deal. L'appelant écrit `Deal x; p.ajouter(&x);`. Résultat ?",
      "options": [
        "Correct : le portefeuille observe `x`.",
        "Fuite de `x`.",
        "Erreur de compilation.",
        "`delete` sur un objet de la pile : comportement indéfini à la destruction du portefeuille."
      ],
      "answer": "`delete` sur un objet de la pile : comportement indéfini à la destruction du portefeuille.",
      "explanation": "Le contrat de propriété n'est pas visible dans la signature. Avec `ajouter(std::unique_ptr<Deal> d)`, le transfert est explicite et ce bug devient impossible."
    },
    {
      "question": "[B2 — Piège ASan] Le batch tourne sans crash depuis des mois. ASan ne signale rien sur les tests. Que peut-on conclure ?",
      "options": [
        "Le code est sans erreur mémoire.",
        "Il faut désactiver ASan en prod.",
        "Rien sur le code non exécuté par les tests : un outil silencieux ne prouve rien hors des chemins parcourus.",
        "ASan est inutile ici."
      ],
      "answer": "Rien sur le code non exécuté par les tests : un outil silencieux ne prouve rien hors des chemins parcourus.",
      "explanation": "Un programme qui « marche » peut contenir un accès invalide. ASan prouve les erreurs sur les chemins réellement exécutés."
    },
    {
      "question": "[B3] `creer(\"FUTURE\")` est appelée alors que la factory ne connaît que BOND et SWAP. Comportement recommandé ?",
      "options": [
        "Renvoyer `nullptr` silencieusement.",
        "Lever `std::invalid_argument(\"produit inconnu: FUTURE\")`, à traduire en erreur de donnée.",
        "Créer un `Produit` par défaut.",
        "Appeler `exit(2)`."
      ],
      "answer": "Lever `std::invalid_argument(\"produit inconnu: FUTURE\")`, à traduire en erreur de donnée.",
      "explanation": "Un `nullptr` silencieux produit un crash 139 plus loin. Une exception explicite rejette le deal avec un message clair."
    },
    {
      "question": "[B3 — Piège] `struct Base { void f(); }; struct D : Base { void f(int); };` puis `D d; d.f();` — Résultat ?",
      "options": [
        "Erreur de compilation : `D::f(int)` masque `Base::f()`.",
        "Appelle `Base::f()`.",
        "Ambiguïté signalée à l'exécution.",
        "Appelle `D::f(0)`."
      ],
      "answer": "Erreur de compilation : `D::f(int)` masque `Base::f()`.",
      "explanation": "Ce n'est ni une redéfinition ni une surcharge entre classes : c'est un masquage de nom. `using Base::f;` dans `D` rend les deux visibles."
    }
 
  ],
  expert: [
       {
      "question": "[B4 + B9 — Combo] Rapprocher 100 000 deals avec 100 000 lignes d'un fichier. Quelle approche ?",
      "options": [
        "`std::find_if` dans A pour chaque ligne de B.",
        "Trier A à chaque ligne de B.",
        "Deux boucles imbriquées avec `break`.",
        "Indexer A dans une `unordered_map`, parcourir B, effacer les trouvés ; le reste est absent de B."
      ],
      "answer": "Indexer A dans une `unordered_map`, parcourir B, effacer les trouvés ; le reste est absent de B.",
      "explanation": "La recherche dans une boucle coûte O(n×m) = 10 milliards de comparaisons. L'index coûte ~200 000 opérations et donne aussi les absents des deux côtés."
    },
    {
      "question": "[Confusion — copie superficielle · slicing · masquage · composition] Quelle association est correcte ?",
      "options": [
        "Copie par défaut d'un `char*` = profonde ; `D::f(int)` qui cache `Base::f()` = slicing ; un Portefeuille hérite de Deal.",
        "Slicing = nom caché par une dérivée ; masquage = copie par valeur en base ; composition = « est un ».",
        "Copie par défaut d'un `char*` = superficielle (ressource partagée) ; copie d'une dérivée par valeur en base = slicing ; `D::f(int)` qui cache `Base::f()` = masquage (`using Base::f;`) ; Portefeuille « a des » Deal = composition.",
        "Toutes ces situations sont des erreurs de compilation."
      ],
      "answer": "Copie par défaut d'un `char*` = superficielle (ressource partagée) ; copie d'une dérivée par valeur en base = slicing ; `D::f(int)` qui cache `Base::f()` = masquage (`using Base::f;`) ; Portefeuille « a des » Deal = composition.",
      "explanation": "L'héritage public exprime « est un » (une Obligation est un Produit). Le masquage n'est ni une redéfinition ni une surcharge."
    },
    {
      "question": "[B4] Une `std::map<std::pair<std::string,std::string>, double>` sert à cumuler par (desk, devise). Pourquoi `pair` fonctionne comme clé ?",
      "options": [
        "`pair` est automatiquement haché.",
        "Toute structure peut servir de clé de `map`.",
        "`pair` sait se comparer (ordre lexicographique), ce que `map` exige.",
        "Il faut définir `operator<` à la main."
      ],
      "answer": "`pair` sait se comparer (ordre lexicographique), ce que `map` exige.",
      "explanation": "`map` demande un ordre strict. `pair` et `tuple` le fournissent. Une `struct` maison demanderait un `operator<`."
    },
    {
      "question": "[B5 — Combo] Cascade de titrisation : encaissé 100, senior dû 70, mezzanine dû 50. Que reçoit chacun ?",
      "options": [
        "Senior 58, mezzanine 42 (prorata).",
        "Senior 70, mezzanine 30, equity 0.",
        "Senior 70, mezzanine 50, equity -20.",
        "Senior 50, mezzanine 50."
      ],
      "answer": "Senior 70, mezzanine 30, equity 0.",
      "explanation": "Chaque rang reçoit `min(dû, dispo)` : 70, puis min(50, 30) = 30, l'equity reçoit le reliquat 0. Contrôle : 70 + 30 + 0 = 100 = encaissé."
    },
    {
      "question": "[B5] Répartir 100,00 € en 3 parts. Quel résultat respecte la méthode du plus fort reste ?",
      "options": [
        "33,34 / 33,33 / 33,33",
        "33,33 / 33,33 / 33,33",
        "33,34 / 33,34 / 33,32",
        "33,33 / 33,33 / 33,34 arrondi au demi-pair"
      ],
      "answer": "33,34 / 33,33 / 33,33",
      "explanation": "En centimes : 3 × 3 333 = 9 999 ; le centime restant va à la part au plus fort reste. Contrôle : somme = 10 000."
    },
    {
      "question": "[B6 — Piège] Le référentiel lève `std::out_of_range` quand un BIC manque. Où et comment traiter ?",
      "options": [
        "Laisser remonter jusqu'à `main`.",
        "L'ignorer avec `catch (...) {}`.",
        "Convertir en `exit(1)`.",
        "Au niveau qui sait ce que signifie l'opération : capturer et lever `ErreurDonnee(\"contrepartie X sans BIC\")`, détail technique dans le log."
      ],
      "answer": "Au niveau qui sait ce que signifie l'opération : capturer et lever `ErreurDonnee(\"contrepartie X sans BIC\")`, détail technique dans le log.",
      "explanation": "On traduit une erreur technique en message métier : la MOA sait quoi corriger. `catch (...) {}` cache l'erreur."
    },
    {
      "question": "[Confusion — subordination/séniorité · terminate/return 2 · undefined/multiple] Quelle série est correcte ?",
      "options": [
        "Pertes absorbées d'abord par la senior ; exception non capturée = sortie contrôlée ; fonction définie dans un header inclus deux fois = `undefined reference`.",
        "Senior payée en dernier ; `return 2` déclenche `std::terminate` ; les include guards évitent `multiple definition` entre deux `.cpp`.",
        "Pertes au prorata ; `std::terminate` rend 0 ; zéro définition = `multiple definition`.",
        "Senior payée en premier (séniorité), equity perd en premier (subordination) ; exception non capturée = `std::terminate`, arrêt brutal, alors que `return 2` est une sortie contrôlée ; fonction non `inline` dans un header inclus par deux `.cpp` = `multiple definition`."
      ],
      "answer": "Senior payée en premier (séniorité), equity perd en premier (subordination) ; exception non capturée = `std::terminate`, arrêt brutal, alors que `return 2` est une sortie contrôlée ; fonction non `inline` dans un header inclus par deux `.cpp` = `multiple definition`.",
      "explanation": "Zéro définition → undefined, deux → multiple. Les include guards ne protègent qu'à l'intérieur d'un même `.cpp`."
    },
    {
      "question": "[B6 + B2 — Combo] `std::ofstream out(\"rapport.txt\"); std::lock_guard g(m); calcul();` — `calcul()` lève. Que devient le fichier et le mutex ?",
      "options": [
        "Fichier ouvert et mutex verrouillé : il faut un `finally`.",
        "Seul le fichier est fermé.",
        "Fichier fermé et mutex relâché pendant la remontée : leurs destructeurs s'exécutent.",
        "Le programme s'arrête immédiatement."
      ],
      "answer": "Fichier fermé et mutex relâché pendant la remontée : leurs destructeurs s'exécutent.",
      "explanation": "C'est RAII : la remontée détruit les objets locaux. C'est aussi pourquoi un destructeur ne doit jamais lever."
    },
    {
      "question": "[B7] Le build passe avec `-L./lib -lvalo`, mais `./batch` affiche `libvalo.so: cannot open shared object file`. Correction durable ?",
      "options": [
        "Ajouter `-L` une deuxième fois.",
        "Inscrire un RUNPATH (`-Wl,-rpath,'$ORIGIN/lib'`), puis vérifier avec `ldd` et `readelf -d`.",
        "Compiler avec `-g`.",
        "Renommer la librairie."
      ],
      "answer": "Inscrire un RUNPATH (`-Wl,-rpath,'$ORIGIN/lib'`), puis vérifier avec `ldd` et `readelf -d`.",
      "explanation": "`-L` ne sert qu'au linker. Au lancement, c'est `ld.so` qui cherche : RUNPATH, `LD_LIBRARY_PATH` (diagnostic) ou `ldconfig`."
    },
    {
      "question": "[B7 — Piège C/C++] `nm -C` montre `T valoriser` dans une librairie C et `U valoriser(Deal const&)` dans `main.o`. Diagnostic ?",
      "options": [
        "Name mangling : il faut `extern \"C\"` autour de la déclaration côté C++.",
        "La librairie n'est pas liée.",
        "Mauvais ordre des librairies.",
        "Il manque `-MMD`."
      ],
      "answer": "Name mangling : il faut `extern \"C\"` autour de la déclaration côté C++.",
      "explanation": "Le C++ cherche le nom décoré (`_Z9valoriserRK4Deal`), la lib C exporte le nom brut. `extern \"C\"` aligne les deux."
    },
    {
      "question": "[B8] `bt` : `#0 std::string::size()`, `#1 Confirmation::bic() confirm.cpp:57`, `#2 envoyer()`. `print ctp_` donne `0x0`. Diagnostic et correction ?",
      "options": [
        "Bug de la librairie standard.",
        "Fuite mémoire dans `envoyer`.",
        "Il faut recompiler en `-O0`.",
        "Pointeur nul non testé dans `bic()` : tester `if (!ctp_)` et lever une `ErreurDonnee`."
      ],
      "answer": "Pointeur nul non testé dans `bic()` : tester `if (!ctp_)` et lever une `ErreurDonnee`.",
      "explanation": "On s'arrête sur la première frame de notre code (#1). Le crash 139 vient très souvent d'un accès non vérifié."
    },
    {
      "question": "[Confusion — invalidation/nul · segfault/exception · UB/non spécifié] `Deal* p = &v[0]; v.push_back(d); p->mt;` dans un `try { } catch (...) {}`. Quelle analyse ?",
      "options": [
        "`p` est nul, `if (p)` suffit ; `catch (...)` attrape le crash ; c'est un résultat non spécifié.",
        "`p` n'est pas nul mais invalidé par la réallocation ; l'accès est un UB (souvent segfault 139), qu'aucun `catch` ne rattrape.",
        "`push_back` met `p` à jour ; aucun problème.",
        "C'est une exception `std::bad_alloc`, capturée par `catch (...)`."
      ],
      "answer": "`p` n'est pas nul mais invalidé par la réallocation ; l'accès est un UB (souvent segfault 139), qu'aucun `catch` ne rattrape.",
      "explanation": "Un segfault est un signal du système, pas une exception C++. Non spécifié = un résultat valide parmi plusieurs ; UB = aucune garantie, comportement variable selon `-O2`."
    },
    {
      "question": "[B8 — Combo -O2] `double total; for (auto& d : deals) total += d.mt;` — Juste en Debug, faux en Release. Démarche ?",
      "options": [
        "Livrer en `-O0`.",
        "Ajouter `volatile`.",
        "UB : `total` non initialisée. Activer `-Wall -Wextra`, corriger `double total = 0.0;`, passer UBSan/Valgrind.",
        "Relancer jusqu'au bon résultat."
      ],
      "answer": "UB : `total` non initialisée. Activer `-Wall -Wextra`, corriger `double total = 0.0;`, passer UBSan/Valgrind.",
      "explanation": "En `-O0`, la valeur vaut souvent 0 par hasard. L'optimiseur suppose qu'il n'y a pas d'UB et produit un autre résultat."
    },
    {
      "question": "[Confusion — -L/RUNPATH · ASan/Valgrind/TSan · data race/race condition · join/detach] Quelle série est entièrement correcte ?",
      "options": [
        "`-L` = build, RUNPATH = inscrit dans le binaire ; binaire non recompilable + fuite → Valgrind ; data race = même donnée écrite sans synchronisation, race condition = résultat qui dépend de l'ordre ; `join` attend la fin du thread.",
        "`-L` est lu au lancement ; ASan s'utilise sans recompiler ; un mutex corrige aussi les races logiques ; `detach` garantit que le calcul est fini.",
        "RUNPATH est une variable d'environnement ; TSan détecte les fuites ; data race = race condition ; `join` lance le thread.",
        "`LD_LIBRARY_PATH` est inscrit dans le binaire ; Valgrind exige une recompilation ; `join` et `detach` sont équivalents."
      ],
      "answer": "`-L` = build, RUNPATH = inscrit dans le binaire ; binaire non recompilable + fuite → Valgrind ; data race = même donnée écrite sans synchronisation, race condition = résultat qui dépend de l'ordre ; `join` attend la fin du thread.",
      "explanation": "ASan et TSan s'activent à la compilation ; Valgrind analyse à l'exécution (20 à 50× plus lent). `LD_LIBRARY_PATH` vient de l'environnement, utile au diagnostic."
    },
    {
      "question": "[B9 — Combo] Deux threads font `total += v[i]` sur la même variable. Quelle correction évite le mutex ?",
      "options": [
        "Déclarer `total` en `static`.",
        "Chaque thread cumule dans sa propre case (`part[0]`, `part[1]`), puis on additionne après `join`.",
        "Appeler `detach` au lieu de `join`.",
        "Compiler en `-O0`."
      ],
      "answer": "Chaque thread cumule dans sa propre case (`part[0]`, `part[1]`), puis on additionne après `join`.",
      "explanation": "Partitionner supprime le partage. `detach` empêcherait de savoir quand lire les résultats. Prouver ensuite avec TSan."
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
