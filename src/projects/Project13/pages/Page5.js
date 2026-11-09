// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = 
[
{
"question": "B1 — Lire du code existant",
"answer": "Déclaration : lire depuis le nom. const Deal* d → objet constant ; Deal* const d → pointeur constant ; const Deal* const d → les deux. ◆ Passage : valeur = copie ; Deal& = alias modifiable ; const Deal& = lecture sans copie ; Deal* = adresse potentiellement nulle (nullptr). ◆ Accès : *p = objet pointé ; p->x = membre de l'objet. ◆ Durée de vie : ne jamais utiliser un pointeur ou une référence vers un objet détruit (dangling). ◆ Propriété : identifier qui possède et libère la ressource ; un pointeur brut reçu en paramètre n'implique pas la propriété. ◆ Legacy : typedef, NULL, new/delete : ancien, pas forcément faux ; préférer using, nullptr et les outils modernes."
},
{
"question": "B2 — Mémoire et cycle de vie",
"answer": "Durée de vie : un objet local automatique est détruit à la fin de sa portée } ; un objet dynamique vit jusqu'à sa destruction. ◆ new/delete : oubli de libération = fuite ; double delete ou accès après libération = comportement indéfini. ◆ RAII : une ressource est libérée automatiquement avec la destruction de son propriétaire. ◆ unique_ptr : propriété exclusive ; make_unique crée, std::move transfère. ◆ shared_ptr : propriété partagée ; weak_ptr observe sans prolonger la durée de vie. ◆ Règle du 0 : privilégier string, vector et les smart pointers pour éviter d'écrire destructeur, constructeur de copie et opérateur d'affectation."
},
{
"question": "B3 — Classes et polymorphisme",
"answer": "Destructeur virtuel : virtual ~Base() = default; permet de détruire correctement une dérivée via un Base*. ◆ override : vérifie la redéfinition d'une fonction virtuelle. ◆ Abstraite : virtual void f() = 0; → classe non instanciable. ◆ Polymorphisme : utiliser une interface de base via Base& ou Base*. ◆ Slicing : copier une dérivée dans un objet de base par valeur perd sa partie dérivée ; préférer const Base& pour lire sans copier."
},
{
"question": "B4 — STL et données",
"answer": "Conteneurs : vector par défaut ; map = clés triées ; unordered_map = recherche moyenne rapide par clé. ◆ Accès : m[k] insère une valeur par défaut si la clé manque ; at() vérifie et peut lever une exception ; find() teste l'existence. ◆ Effacement : it = v.erase(it); pour continuer correctement un parcours de vector. ◆ Invalidation : push_back peut invalider les pointeurs et itérateurs du vector si une réallocation survient. ◆ Parcours : for (const auto& x : v) évite les copies si la lecture suffit."
},
{
"question": "B5 — Calculs financiers",
"answer": "Montants : utiliser des unités entières adaptées (int64_t, par exemple en centimes) ou une représentation décimale maîtrisée ; éviter double pour les montants exacts. ◆ Bases : ACT/360 = jours réels / 360 ; 30/360 = convention de décompte des jours. ◆ Arrondi : std::round(2.5) = 3 ; static_cast<int>(2.9) = 2 (troncature vers zéro). ◆ Répartition : la méthode du plus fort reste permet de répartir des unités entières tout en conservant le total. ◆ Vérification : contrôler les unités, les conventions, les débordements et les règles d'arrondi."
},
{
"question": "B6 — Erreurs et codes retour",
"answer": "Exceptions : placer le try dans la boucle si chaque deal doit échouer indépendamment et que le lot doit continuer. ◆ catch : capturer généralement par const&, du type le plus précis au plus général. ◆ Relance : throw; relance l'exception courante sans la copier. ◆ Codes retour : définir une convention explicite, par exemple 0 = succès, 1 = succès partiel, 2 = échec. ◆ main : intercepter les exceptions non traitées au niveau applicatif et retourner un code d'échec. ◆ Ressources : RAII garantit leur libération même si une exception survient."
},
{
"question": "B7 — Build et librairies",
"answer": "Étapes : préprocesseur (header introuvable) → compilation (not declared) → édition de liens (undefined reference) → lancement (bibliothèque .so introuvable). ◆ undefined reference : définition manquante, fichier objet non lié ou bibliothèque absente. Outil : nm -C. ◆ Ordre : placer généralement les objets avant les bibliothèques avec les linkers sensibles à l'ordre. ◆ -I : chemins des headers ; -L : chemins des bibliothèques au link ; -l : bibliothèque à lier. ◆ À l'exécution : ldd inspecte les dépendances dynamiques ; RUNPATH et la configuration du chargeur aident à les localiser."
},
{
"question": "B8 — Débogage",
"answer": "Préparer : compiler avec -g, idéalement sans optimisation pour débuter. ◆ GDB : bt = pile d'appels ; frame n = sélectionner une frame ; print x = inspecter une variable ; break main = poser un point d'arrêt. ◆ Outils : ASan = erreurs mémoire ; UBSan = comportements indéfinis détectés ; TSan = courses de données ; Valgrind = analyse mémoire sans instrumentation de compilation spécifique. ◆ Code 139 : souvent une terminaison par SIGSEGV sous Linux. ◆ Bug en -O2 seulement : rechercher notamment comportement indéfini, variable non initialisée ou course de données."
},
{
"question": "B9 — Performance et threads",
"answer": "Mesurer avant d'optimiser ; vérifier que les résultats restent identiques. ◆ Recherche répétée : remplacer les recherches coûteuses par un index adapté, par exemple unordered_map. ◆ Data race : accès concurrents à la même mémoire, avec au moins une écriture, sans synchronisation appropriée → comportement indéfini. ◆ Protection : std::mutex avec std::lock_guard ou std::scoped_lock ; sinon, partitionner les données. ◆ C++ moderne : auto, lambdas, std::optional, std::thread et for (auto& [k, v] : m). ◆ Performance : éviter les copies inutiles, choisir le bon conteneur et profiler avant de modifier le code."
},
{
"question": "Make — Les bases",
"answer": "Règle : cible: dépendances, puis commande indentée par une tabulation. ◆ Principe : reconstruire une cible lorsque ses dépendances sont plus récentes ou que la cible manque. ◆ Headers : -MMD -MP génère les dépendances entre .cpp et .h ; inclure les fichiers .d générés. ◆ Variables : CXX = compilateur C++ ; CXXFLAGS = options de compilation ; LDFLAGS = options de link. ◆ Avant livraison : make clean && make && ./tests."
},
{
"question": "CMake — Les bases",
"answer": "Rôle : configure le projet et génère le système de build (Make ou Ninja) ; le compilateur effectue la compilation. ◆ Cibles : add_executable(app main.cpp) ; add_library(mylib mylib.cpp) ; target_link_libraries(app PRIVATE mylib). ◆ Includes : target_include_directories() ; standard C++ : target_compile_features(app PRIVATE cxx_std_20). ◆ Commandes : cmake -S . -B build puis cmake --build build ; ajouter --verbose pour voir les commandes. ◆ Configuration : -DCMAKE_BUILD_TYPE=Debug ou Release avec les générateurs mono-configuration, comme Make ou Ninja classique. ◆ Bon réflexe : configurer les options au niveau des cibles plutôt que globalement."
}
]

const questions = {
  moyen: [
    {
      "question": "[B1] `void c(const Deal& d);` — Que fait la fonction avec `d` ?",
      "options": [
        "Elle le lit sans le copier ni le modifier.",
        "Elle travaille sur une copie.",
        "Elle peut le modifier.",
        "Elle peut recevoir `nullptr`."
      ],
      "answer": "Elle le lit sans le copier ni le modifier.",
      "explanation": "`const&` = lecture sans copie. C'est le passage habituel pour un gros objet en lecture."
    },
    {
      "question": "[B1] Dans `Deal* const d2 = p;`, qu'est-ce qui est constant ?",
      "options": [
        "Le Deal pointé.",
        "Le pointeur : `d2` ne peut pas pointer ailleurs.",
        "Les deux.",
        "Rien."
      ],
      "answer": "Le pointeur : `d2` ne peut pas pointer ailleurs.",
      "explanation": "On lit depuis le nom : `d2` est un pointeur constant vers un Deal. `const Deal*` rendrait le Deal constant."
    },
    {
      "question": "[B2] Que provoque un `new` sans `delete` ?",
      "options": [
        "Une erreur de compilation.",
        "Un crash immédiat.",
        "Une fuite mémoire.",
        "Rien, la mémoire est libérée à la fin du bloc."
      ],
      "answer": "Une fuite mémoire.",
      "explanation": "La mémoire reste réservée : un batch qui tourne longtemps grossit jusqu'à être tué."
    },
    {
      "question": "[B2] Quel est le propriétaire par défaut d'un objet créé sur le tas en C++ moderne ?",
      "options": [
        "Un pointeur nu `Deal*`.",
        "`std::shared_ptr`",
        "`std::weak_ptr`",
        "`std::unique_ptr`"
      ],
      "answer": "`std::unique_ptr`",
      "explanation": "`unique_ptr` libère automatiquement à la fin de sa portée. `shared_ptr` seulement si la propriété est partagée."
    },
    {
      "question": "[B3] Pourquoi déclarer le destructeur `virtual` dans une classe de base ?",
      "options": [
        "Pour que `delete` via un pointeur de base appelle aussi le destructeur de la dérivée.",
        "Pour rendre la classe abstraite.",
        "Pour accélérer la destruction.",
        "Pour interdire l'héritage."
      ],
      "answer": "Pour que `delete` via un pointeur de base appelle aussi le destructeur de la dérivée.",
      "explanation": "Sans destructeur virtuel, seul `~Base()` est appelé : les ressources de la dérivée ne sont pas libérées."
    },
    {
      "question": "[B3] Une classe qui contient `virtual double valoriser() const = 0;` est…",
      "options": [
        "concrète.",
        "abstraite : on ne peut pas l'instancier.",
        "finale.",
        "statique."
      ],
      "answer": "abstraite : on ne peut pas l'instancier.",
      "explanation": "Une fonction virtuelle pure suffit. On instancie une classe dérivée qui l'implémente."
    },
    {
      "question": "[B4] Quel conteneur pour retrouver rapidement un deal par son id ?",
      "options": [
        "`std::vector`",
        "`std::list`",
        "`std::unordered_map`",
        "`std::set`"
      ],
      "answer": "`std::unordered_map`",
      "explanation": "`unordered_map` : recherche en temps constant en moyenne. `vector` imposerait de tout parcourir."
    },
    {
      "question": "[B4] Que fait `m[\"USD\"]` si la clé n'existe pas dans une `std::map` ?",
      "options": [
        "Elle lève une exception.",
        "Elle renvoie une valeur aléatoire.",
        "Erreur de compilation.",
        "Elle crée la clé avec la valeur 0."
      ],
      "answer": "Elle crée la clé avec la valeur 0.",
      "explanation": "Pratique pour cumuler, dangereux pour lire. Pour lire sans créer : `find` ou `at`."
    },
    {
      "question": "[B5] Comment stocker un montant de façon exacte en C++ ?",
      "options": [
        "En centimes dans un `int64_t`.",
        "Dans un `double`.",
        "Dans un `float`.",
        "Dans une `std::string`."
      ],
      "answer": "En centimes dans un `int64_t`.",
      "explanation": "`double` est une approximation : `0.1 + 0.2 == 0.3` est faux. Les entiers sont exacts."
    },
    {
      "question": "[B6] Un batch a traité son lot avec quelques rejets. Quel code retour ?",
      "options": [
        "0",
        "1",
        "2",
        "139"
      ],
      "answer": "1",
      "explanation": "Convention : 0 OK, 1 partiel, 2 échec. L'ordonnanceur le lit via `$?`."
    },
    {
      "question": "[B7] `undefined reference to 'valoriser'` apparaît à quelle étape ?",
      "options": [
        "Préprocesseur",
        "Compilation",
        "Édition de liens",
        "Lancement"
      ],
      "answer": "Édition de liens",
      "explanation": "Le compilateur a vu la déclaration ; le linker ne trouve pas la définition."
    },
    {
      "question": "[B8] Le programme a planté sous gdb. Première commande ?",
      "options": [
        "`print`",
        "`run`",
        "`list`",
        "`bt`"
      ],
      "answer": "`bt`",
      "explanation": "`bt` affiche la pile d'appels au moment du crash. Ensuite `frame n` et `print`."
    },
    {
      "question": "[Make] À quoi sert `make` ?",
      "options": [
        "À reconstruire uniquement ce qui a changé, d'après les dépendances.",
        "À compiler sans compilateur.",
        "À installer des librairies.",
        "À déboguer un crash."
      ],
      "answer": "À reconstruire uniquement ce qui a changé, d'après les dépendances.",
      "explanation": "Make compare les dates : une cible est refaite si une de ses dépendances est plus récente."
    },
    {
      "question": "[CMake] Quel est le rôle de CMake ?",
      "options": [
        "C'est un compilateur.",
        "Il génère les fichiers de build (Makefile, Ninja…).",
        "C'est un débogueur.",
        "Il remplace le linker."
      ],
      "answer": "Il génère les fichiers de build (Makefile, Ninja…).",
      "explanation": "CMake décrit les cibles ; make ou ninja appellent ensuite le compilateur et le linker."
    },
    {
      "question": "[CMake] Après `cmake -S . -B build`, quelle commande compile le projet ?",
      "options": [
        "`make install`",
        "`cmake build`",
        "`cmake --build build`",
        "`g++ CMakeLists.txt`"
      ],
      "answer": "`cmake --build build`",
      "explanation": "Première commande : configuration. Deuxième : `cmake --build build` lance la compilation."
    }
  ],
  avance: [
    {
      "question": "[B1] `void e(Deal* d);` — Que faut-il faire avant d'utiliser `d` ?",
      "options": [
        "Rien de particulier.",
        "Faire `delete d` à la fin.",
        "Le copier.",
        "Tester `if (d)`, car il peut être nul."
      ],
      "answer": "Tester `if (d)`, car il peut être nul.",
      "explanation": "Un pointeur peut valoir `nullptr`. Une référence, elle, n'est jamais nulle."
    },
    {
      "question": "[B2] `Deal* d = new Deal; delete d; delete d;` — Résultat ?",
      "options": [
        "Double libération : crash, souvent plus loin.",
        "Le second `delete` est ignoré.",
        "Fuite mémoire.",
        "Erreur de compilation."
      ],
      "answer": "Double libération : crash, souvent plus loin.",
      "explanation": "Correctif minimal : `d = nullptr;` après `delete`. Mieux : `std::unique_ptr`."
    },
    {
      "question": "[B2] `auto d = std::make_unique<Deal>(); v.push_back(std::move(d));` — Que vaut `d` ensuite ?",
      "options": [
        "Une copie du Deal.",
        "`nullptr` : la propriété est passée au vector.",
        "Le même Deal que dans le vector.",
        "Erreur de compilation."
      ],
      "answer": "`nullptr` : la propriété est passée au vector.",
      "explanation": "`unique_ptr` ne se copie pas, il se transfère avec `std::move`."
    },
    {
      "question": "[B3] `void f(Produit p);` reçoit une `Obligation`. Que se passe-t-il ?",
      "options": [
        "`Obligation::valoriser` est appelée.",
        "Erreur à l'exécution.",
        "Slicing : seule la partie `Produit` est copiée.",
        "Le compilateur passe une référence."
      ],
      "answer": "Slicing : seule la partie `Produit` est copiée.",
      "explanation": "Le polymorphisme fonctionne par référence ou pointeur. Correction : `void f(const Produit& p)`."
    },
    {
      "question": "[B3] Quel est l'intérêt du mot-clé `override` ?",
      "options": [
        "Il rend la fonction plus rapide.",
        "Il rend la classe abstraite.",
        "Il interdit l'héritage.",
        "La compilation échoue si la signature ne correspond à aucune fonction virtuelle de la base."
      ],
      "answer": "La compilation échoue si la signature ne correspond à aucune fonction virtuelle de la base.",
      "explanation": "Sans `override`, une faute de signature crée silencieusement une nouvelle fonction."
    },
    {
      "question": "[B4] Comment effacer les deals annulés en parcourant un `vector` ?",
      "options": [
        "`if (it->annule) it = v.erase(it); else ++it;`",
        "`v.erase(it); ++it;`",
        "`for (auto& d : v) v.erase(d);`",
        "`delete it;`"
      ],
      "answer": "`if (it->annule) it = v.erase(it); else ++it;`",
      "explanation": "`erase` invalide l'itérateur courant et renvoie le suivant. Alternative C++20 : `std::erase_if`."
    },
    {
      "question": "[B4] Comment lire une valeur d'une `map` sans risquer de créer la clé ?",
      "options": [
        "`m[k]`",
        "`m.find(k)` puis tester `!= m.end()`",
        "`m.insert(k)`",
        "`m.push_back(k)`"
      ],
      "answer": "`m.find(k)` puis tester `!= m.end()`",
      "explanation": "`find` cherche sans créer. `at` fonctionne aussi mais lève `std::out_of_range` si la clé manque."
    },
    {
      "question": "[B5] Du 15/03 au 15/06, combien de jours compte la base ACT/360 ?",
      "options": [
        "90",
        "91",
        "92",
        "93"
      ],
      "answer": "92",
      "explanation": "ACT = jours réels : 16 + 30 + 31 + 15 = 92. En 30/360, on compterait 90."
    },
    {
      "question": "[B5] Que vaut `static_cast<int>(2.9)` ?",
      "options": [
        "3",
        "2,9",
        "Erreur de compilation",
        "2"
      ],
      "answer": "2",
      "explanation": "C'est une troncature, pas un arrondi. Pour arrondir : `std::round`."
    },
    {
      "question": "[B6] Comment capturer une exception ?",
      "options": [
        "Par référence constante : `catch (const std::exception& e)`.",
        "Par valeur : `catch (std::exception e)`.",
        "Par pointeur : `catch (std::exception* e)`.",
        "Peu importe."
      ],
      "answer": "Par référence constante : `catch (const std::exception& e)`.",
      "explanation": "Par valeur, l'exception est copiée et peut perdre son type réel (slicing)."
    },
    {
      "question": "[B7] Dans `nm -C main.o`, que signifie la lettre `U` devant un symbole ?",
      "options": [
        "Symbole défini ici.",
        "Symbole utilisé ici mais défini ailleurs.",
        "Symbole inutilisé.",
        "Symbole unique."
      ],
      "answer": "Symbole utilisé ici mais défini ailleurs.",
      "explanation": "`U` = utilisé, non défini. `T` = défini. Chaque `U` doit trouver son `T` au link."
    },
    {
      "question": "[B8] Un batch se termine avec le code 139. Qu'est-ce que cela signifie ?",
      "options": [
        "Échec métier.",
        "Commande introuvable.",
        "Segmentation fault.",
        "Succès partiel."
      ],
      "answer": "Segmentation fault.",
      "explanation": "139 = 128 + 11 (SIGSEGV). Cause fréquente : un pointeur nul non testé."
    },
    {
      "question": "[Make] On modifie `deal.h`, mais `make` ne recompile rien. Que faut-il ajouter ?",
      "options": [
        "`-O2`",
        "`-g`",
        "`-Wall`",
        "`-MMD -MP`"
      ],
      "answer": "`-MMD -MP`",
      "explanation": "`-MMD -MP` génère les dépendances vers les headers : Make sait alors quels `.cpp` recompiler."
    },
    {
      "question": "[CMake] Quelle ligne fait lier `app` à la librairie `mylib` ?",
      "options": [
        "`target_link_libraries(app PRIVATE mylib)`",
        "`add_dependencies(app mylib)`",
        "`include_directories(mylib)`",
        "`add_library(app mylib)`"
      ],
      "answer": "`target_link_libraries(app PRIVATE mylib)`",
      "explanation": "`add_dependencies` impose seulement un ordre de construction, sans lier : on obtient un `undefined reference`."
    },
    {
      "question": "[Make] Quelle commande lancer avant de livrer un binaire ?",
      "options": [
        "`make` seul.",
        "`make clean && make && ./tests`",
        "`make -n`",
        "`make install` sans tests."
      ],
      "answer": "`make clean && make && ./tests`",
      "explanation": "Un build propre évite de livrer avec d'anciens `.o`, et les tests valident le résultat."
    }
  ],
  expert: [
    {
      "question": "[B2] `Deal* d = new Deal; valoriser(*d); delete d;` — `valoriser` lève une exception. Résultat ?",
      "options": [
        "Le `delete` est exécuté quand même.",
        "Double libération.",
        "Fuite : le `delete` n'est jamais atteint.",
        "Erreur de compilation."
      ],
      "answer": "Fuite : le `delete` n'est jamais atteint.",
      "explanation": "Une exception saute la suite du code. Avec `std::make_unique`, la libération est garantie."
    },
    {
      "question": "[B2] Une classe contient `char* p` et fait `delete[] p` dans son destructeur. On copie un objet. Risque ?",
      "options": [
        "Aucun.",
        "Fuite uniquement.",
        "Erreur de compilation.",
        "Double libération : la copie partage le même pointeur."
      ],
      "answer": "Double libération : la copie partage le même pointeur.",
      "explanation": "La copie par défaut copie le pointeur, pas le contenu. Solution simple : `std::string` ou `std::vector<char>`."
    },
    {
      "question": "[B3] `struct X { int a; int b; X() : b(1), a(b) {} };` — Dans quel ordre les membres sont-ils initialisés ?",
      "options": [
        "Dans l'ordre de déclaration : `a` puis `b`, donc `a` lit un `b` non initialisé.",
        "Dans l'ordre de la liste : `b` puis `a`, donc `a` vaut 1.",
        "Dans un ordre aléatoire.",
        "Erreur de compilation."
      ],
      "answer": "Dans l'ordre de déclaration : `a` puis `b`, donc `a` lit un `b` non initialisé.",
      "explanation": "L'ordre de la liste d'initialisation est ignoré. `-Wall` signale l'écart (`-Wreorder`)."
    },
    {
      "question": "[B4] Rapprocher 100 000 deals avec un fichier de 100 000 lignes. Quelle approche ?",
      "options": [
        "Une boucle sur le fichier avec `std::find` dans les deals.",
        "Mettre les deals dans une `unordered_map` par id, puis parcourir le fichier.",
        "Trier le fichier à chaque ligne.",
        "Deux boucles imbriquées."
      ],
      "answer": "Mettre les deals dans une `unordered_map` par id, puis parcourir le fichier.",
      "explanation": "La recherche dans une boucle fait 10 milliards de comparaisons. L'index fait environ 200 000 opérations."
    },
    {
      "question": "[B5] On répartit 100,00 € en 3 parts. Quel résultat est correct ?",
      "options": [
        "33,33 / 33,33 / 33,33",
        "33,34 / 33,34 / 33,32",
        "33,34 / 33,33 / 33,33",
        "33,40 / 33,30 / 33,30"
      ],
      "answer": "33,34 / 33,33 / 33,33",
      "explanation": "La somme doit faire 100,00 €. Le centime restant va à une seule part (plus fort reste)."
    },
    {
      "question": "[B6] Un deal invalide lève une exception. On veut traiter tous les autres. Où placer le `try` ?",
      "options": [
        "Autour de toute la boucle.",
        "Dans `main` uniquement.",
        "Nulle part.",
        "Dans la boucle, autour du traitement d'un deal."
      ],
      "answer": "Dans la boucle, autour du traitement d'un deal.",
      "explanation": "Autour de la boucle, la première erreur arrête tout. Dans la boucle : on journalise, on compte le rejet, on continue."
    },
    {
      "question": "[B6] Une exception n'est capturée nulle part, même pas dans `main`. Que se passe-t-il ?",
      "options": [
        "`std::terminate` : arrêt brutal du programme.",
        "Le programme rend 0.",
        "L'exception est ignorée.",
        "Le programme rend 2 automatiquement."
      ],
      "answer": "`std::terminate` : arrêt brutal du programme.",
      "explanation": "Il faut un `try/catch` dans `main` qui journalise et renvoie 2."
    },
    {
      "question": "[B7] `g++ -L. -lvalo main.o -o batch` donne `undefined reference`, alors que la fonction est dans `libvalo.a`. Correction ?",
      "options": [
        "Supprimer `-L.`.",
        "Placer la librairie après les objets : `g++ main.o -L. -lvalo -o batch`.",
        "Ajouter `-g`.",
        "Renommer la librairie."
      ],
      "answer": "Placer la librairie après les objets : `g++ main.o -L. -lvalo -o batch`.",
      "explanation": "Le linker lit de gauche à droite : la librairie doit venir après le code qui l'utilise."
    },
    {
      "question": "[B7] Le build passe, mais au lancement : `libvalo.so: cannot open shared object file`. Pourquoi ?",
      "options": [
        "Le code ne compile pas.",
        "La fonction n'est pas définie.",
        "`-L` ne sert qu'au build ; au lancement, le système ne sait pas où trouver la `.so`.",
        "Il manque `-g`."
      ],
      "answer": "`-L` ne sert qu'au build ; au lancement, le système ne sait pas où trouver la `.so`.",
      "explanation": "Vérifier avec `ldd ./batch`. Corriger avec un RUNPATH (`-Wl,-rpath,'$ORIGIN/lib'`) ou `ldconfig`."
    },
    {
      "question": "[B8] Un calcul est juste en Debug mais faux en Release (`-O2`). Cause la plus probable ?",
      "options": [
        "Un bug du compilateur.",
        "Un problème de disque.",
        "Le binaire Release est corrompu.",
        "Une variable non initialisée (comportement indéfini)."
      ],
      "answer": "Une variable non initialisée (comportement indéfini).",
      "explanation": "Exemple : `double total;` sans `= 0.0`. Activer `-Wall -Wextra` et tester avec UBSan ou Valgrind."
    },
    {
      "question": "[B8] `bt` affiche `#0 std::string::size()`, `#1 Confirmation::bic() confirm.cpp:57`. Où chercher le bug ?",
      "options": [
        "Dans `Confirmation::bic()`, la première frame de notre code.",
        "Dans `std::string`.",
        "Dans le compilateur.",
        "Dans le système d'exploitation."
      ],
      "answer": "Dans `Confirmation::bic()`, la première frame de notre code.",
      "explanation": "La librairie standard est rarement fautive. `frame 1` puis `print` pour inspecter les variables."
    },
    {
      "question": "[B9] Deux threads font `total += x` sur la même variable. Problème et solution ?",
      "options": [
        "Aucun problème.",
        "Data race : chaque thread cumule dans sa propre variable, puis on additionne après `join`.",
        "Il faut `detach` les threads.",
        "Il faut compiler en `-O0`."
      ],
      "answer": "Data race : chaque thread cumule dans sa propre variable, puis on additionne après `join`.",
      "explanation": "Sinon, protéger avec un `std::mutex`. TSan (`-fsanitize=thread`) détecte ce type d'erreur."
    },
    {
      "question": "[CMake] Pour voir les vraies commandes de compilation et de link lancées par CMake ?",
      "options": [
        "`cmake --help`",
        "`cmake -S .`",
        "`cmake --build build --verbose`",
        "`make clean`"
      ],
      "answer": "`cmake --build build --verbose`",
      "explanation": "Utile pour vérifier quels fichiers et quelles librairies sont réellement passés au linker."
    },
    {
      "question": "[CMake] Comment compiler un projet CMake en mode optimisé ?",
      "options": [
        "`cmake --build build --fast`",
        "`make -O2`",
        "Ajouter `-g` dans le code.",
        "`cmake -S . -B build -DCMAKE_BUILD_TYPE=Release`"
      ],
      "answer": "`cmake -S . -B build -DCMAKE_BUILD_TYPE=Release`",
      "explanation": "`Debug` ajoute les symboles sans optimisation ; `Release` active les optimisations."
    },
    {
      "question": "[Make] Que signifient `$@` et `$<` dans une règle de Makefile ?",
      "options": [
        "`$@` = la cible, `$<` = la première dépendance.",
        "`$@` = tous les fichiers, `$<` = le dernier.",
        "`$@` = le compilateur, `$<` = les options.",
        "Ce sont des commentaires."
      ],
      "answer": "`$@` = la cible, `$<` = la première dépendance.",
      "explanation": "Exemple : `%.o: %.cpp` puis `$(CXX) -c $< -o $@` compile le `.cpp` en `.o`."
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
