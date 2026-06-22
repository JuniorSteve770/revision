// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== GIL & THREADS ====================
  {
    question: "GIL et Threads — Concepts clés",
    answer:
      "◆ **GIL** : Global Interpreter Lock — verrou global qui permet à un seul thread d'exécuter du bytecode Python à la fois ◆ **Thread** : unité d'exécution légère, partage la mémoire du processus ◆ **Multithreading** : utile pour les I/O-bound (attente réseau/BDD), limité pour le CPU-bound par le GIL ◆ **Multiprocessing** : contourne le GIL en utilisant des processus séparés ◆ **Asyncio** : concurrence sans threads, event loop, idéal pour I/O-bound ◆ **Thread-safe** : code qui peut être exécuté par plusieurs threads sans corruption ⚠️ Le GIL n'existe pas en Jython ou IronPython",
  },
  // ==================== ARCHITECTURE HEXAGONALE ====================
  {
    question: "Architecture Hexagonale — Ports & Adapters",
    answer:
      "◆ **Domaine** : cœur métier pur, sans dépendances externes ◆ **Ports** : interfaces qui définissent ce que le domaine attend de l'extérieur ◆ **Adapters** : implémentations concrètes des ports (BDD, API, UI) ◆ **Couches** : Domaine (interne) → Ports → Adapters (externe) ◆ **Avantages** : testabilité maximale, isolation du métier ◆ **BDD vs TDD** : BDD = conception pilotée par le comportement, TDD = conception pilotée par les tests ⚠️ L'hexagonale isole le métier des détails techniques (BDD, API, etc.)",
  },
  // ==================== DEPLOIEMENT PIP & GITHUB ====================
  {
    question: "Déploiement — Pip, GitHub, CI/CD",
    answer:
      "◆ **pip** : gestionnaire de paquets Python ◆ **requirements.txt** : liste des dépendances ◆ **setup.py / pyproject.toml** : définition du paquet ◆ **GitHub** : hébergement de code, versionnement ◆ **CI/CD** : GitHub Actions, GitLab CI, Jenkins ◆ **Étapes** : commit → push → build → test → package → deploy ◆ **Environnements** : dev, staging, production ◆ **Secrets** : variables d'environnement, GitHub Secrets ⚠️ Le déploiement standard : pip install -r requirements.txt, puis exécution de l'app",
  },
  // ==================== SLOTS ====================
  {
    question: "__slots__ — Définition et mécanisme",
    answer:
      "◆ **__slots__** : attribut de classe qui limite les attributs d'instance ◆ **Mécanisme** : remplace __dict__ par un tableau fixe, économise de la mémoire ◆ **Utilisation** : `__slots__ = ('attr1', 'attr2')` ◆ **Avantages** : mémoire réduite, accès plus rapide ◆ **Inconvénients** : pas d'attributs dynamiques, héritage complexe ◆ **Cas d'usage** : millions d'instances, objets simples ◆ **Héritage** : les slots ne sont pas hérités automatiquement ⚠️ Les slots sont une optimisation mémoire, pas une sécurité",
  },
  // ==================== DUNDER METHODS ====================
  {
    question: "Dunder Methods — Les plus utilisés",
    answer:
      "◆ **__init__** : constructeur ◆ **__str__** : représentation lisible (print()) ◆ **__repr__** : représentation technique (débogage) ◆ **__eq__** : égalité (==) ◆ **__lt__** : inférieur (<) pour le tri ◆ **__len__** : longueur (len()) ◆ **__getitem__** : accès indexé (obj[key]) ◆ **__call__** : rendre l'objet appelable comme une fonction ◆ **__enter__ / __exit__** : context manager (with) ◆ **__new__** : création d'instance (avant __init__) ⚠️ Les dunder methods sont les 'méthodes magiques' de Python",
  },
  // ==================== QUESTIONS D'ENTRETIEN ====================
  {
    question: "Questions d'entretien — Synthèse Senior",
    answer:
      "◆ **GIL** : comment le contourner ? multiprocessing, asyncio, extensions C ◆ **Thread safe** : locks, queues, immutabilité ◆ **Architecture hexagonale** : pourquoi isoler le domaine ? testabilité, évolutivité ◆ **Slots** : quand les utiliser ? millions d'instances, optimisation mémoire ◆ **Dunder methods** : connaître __init__, __str__, __repr__, __eq__, __lt__ ◆ **Déploiement** : pipeline CI/CD, tests, rollback ◆ **BDD vs TDD** : BDD = comportement métier, TDD = conception technique ◆ **Le piège** : le code est la partie la plus simple du travail ⚠️ Un senior justifie ses choix techniques, il ne les applique pas sans réfléchir",
  },
];

const questions = {
  moyen: [
    // ==================== GIL & THREADS (6 questions) ====================
    {
      question:
        "[GIL] Que signifie l'acronyme GIL en Python ?",
      options: [
        "Global Interface Library (bibliothèque d'interface globale)",
        "Global Interpreter Lock (verrou global de l'interpréteur)",
        "General Input Language (langage d'entrée général)",
        "Graphical Interface Layer (couche d'interface graphique)",
      ],
      answer: "Global Interpreter Lock (verrou global de l'interpréteur)",
      explanation:
        "Le GIL est un verrou global qui permet à un seul thread d'exécuter du bytecode Python à la fois. C'est une particularité de CPython (l'implémentation de référence).",
    },
    {
      question:
        "[GIL] Quel est l'impact principal du GIL sur les applications Python ?",
      options: [
        "Aucun impact, le GIL est purement théorique",
        "Il limite les performances pour les calculs CPU-bound (multi-thread)",
        "Il améliore les performances pour les calculs CPU-bound",
        "Il bloque complètement l'utilisation des threads",
      ],
      answer: "Il limite les performances pour les calculs CPU-bound (multi-thread)",
      explanation:
        "Le GIL limite les performances pour les calculs CPU-bound en multithreading car un seul thread peut s'exécuter à la fois. Pour les I/O-bound, le GIL est relâché pendant les opérations I/O.",
    },
    {
      question:
        "[Thread] Quelle est la différence entre un thread et un processus ?",
      options: [
        "Un thread est plus lourd qu'un processus",
        "Un processus partage la mémoire, un thread a sa propre mémoire",
        "Un thread partage la mémoire du processus, un processus a sa propre mémoire isolée",
        "Il n'y a pas de différence",
      ],
      answer: "Un thread partage la mémoire du processus, un processus a sa propre mémoire isolée",
      explanation:
        "Les threads partagent la mémoire du processus (plus légers). Les processus ont leur propre espace mémoire isolé (plus lourds, mais plus sûrs et contournent le GIL).",
    },
    {
      question:
        "[GIL] Comment contourner le GIL pour des calculs CPU intensifs en Python ?",
      options: [
        "Utiliser plus de threads (le GIL n'est pas un problème)",
        "Utiliser le module multiprocessing (processus séparés)",
        "Utiliser asyncio (concurrence sans threads)",
        "Le GIL ne peut pas être contourné",
      ],
      answer: "Utiliser le module multiprocessing (processus séparés)",
      explanation:
        "multiprocessing crée des processus séparés, chacun avec son propre GIL. C'est la solution standard pour les calculs CPU-bound. Chaque processus tourne sur un cœur différent.",
    },
    {
      question:
        "[Thread] Quand le multithreading Python est-il efficace malgré le GIL ?",
      options: [
        "Jamais, le GIL rend le multithreading inutile",
        "Pour les opérations I/O-bound (requêtes réseau, lectures BDD)",
        "Uniquement pour les calculs mathématiques",
        "Pour les opérations de lecture de fichiers",
      ],
      answer: "Pour les opérations I/O-bound (requêtes réseau, lectures BDD)",
      explanation:
        "Le GIL est relâché pendant les opérations I/O (lecture réseau, BDD). Le multithreading est donc efficace pour les I/O-bound. Un thread peut attendre une réponse tandis qu'un autre s'exécute.",
    },
    {
      question:
        "[GIL] Quelle implémentation de Python n'a PAS de GIL ?",
      options: [
        "CPython (l'implémentation de référence)",
        "Jython (implémentation sur JVM) ou IronPython (sur .NET)",
        "PyPy (implémentation JIT)",
        "Toutes les implémentations ont un GIL",
      ],
      answer: "Jython (implémentation sur JVM) ou IronPython (sur .NET)",
      explanation:
        "Jython et IronPython n'ont pas de GIL car ils utilisent les mécanismes de threading de la JVM et .NET. CPython et PyPy ont un GIL.",
    },

    // ==================== ARCHITECTURE HEXAGONALE (4 questions) ====================
    {
      question:
        "[Architecture hexagonale] Quel est le cœur de l'architecture hexagonale ?",
      options: [
        "La base de données (tout tourne autour)",
        "Le domaine métier (isolé des détails techniques)",
        "L'API REST (point d'entrée principal)",
        "Les adaptateurs techniques",
      ],
      answer: "Le domaine métier (isolé des détails techniques)",
      explanation:
        "Le domaine métier est le cœur de l'architecture hexagonale. Il est isolé des détails techniques (BDD, API, UI) via des ports et adaptateurs.",
    },
    {
      question:
        "[Architecture hexagonale] Que sont les 'ports' dans l'architecture hexagonale ?",
      options: [
        "Des bases de données",
        "Des interfaces qui définissent ce que le domaine attend de l'extérieur",
        "Des adaptateurs techniques",
        "Des endpoints API",
      ],
      answer: "Des interfaces qui définissent ce que le domaine attend de l'extérieur",
      explanation:
        "Les ports sont des interfaces définies par le domaine. Exemple : interface IRepository (ce que le domaine attend). L'adaptateur est l'implémentation concrète (PostgresRepository).",
    },
    {
      question:
        "[Architecture hexagonale] Quel est l'avantage principal de l'architecture hexagonale ?",
      options: [
        "Elle est plus rapide à l'exécution",
        "Elle isole le métier pour une testabilité et évolutivité maximales",
        "Elle utilise moins de code",
        "Elle est plus simple à mettre en place",
      ],
      answer: "Elle isole le métier pour une testabilité et évolutivité maximales",
      explanation:
        "L'architecture hexagonale isole le domaine métier des détails techniques. On peut tester le métier sans BDD, remplacer la BDD, changer l'API sans impacter le métier. C'est le grand avantage.",
    },
    {
      question:
        "[BDD vs TDD] Quelle est la différence principale entre BDD et TDD ?",
      options: [
        "BDD est pour les bases de données, TDD pour les tests unitaires",
        "BDD est orienté comportement métier (langage métier), TDD est orienté conception technique (tests unitaires)",
        "BDD est plus rapide que TDD",
        "TDD est pour les seniors, BDD pour les juniors",
      ],
      answer: "BDD est orienté comportement métier (langage métier), TDD est orienté conception technique (tests unitaires)",
      explanation:
        "BDD (Behavior-Driven Development) : tests en langage métier (Given/When/Then). TDD (Test-Driven Development) : tests unitaires techniques qui guident la conception. BDD est une extension de TDD.",
    },

    // ==================== DEPLOIEMENT PIP & GITHUB (4 questions) ====================
    {
      question:
        "[Déploiement] Quel fichier contient les dépendances Python pour le déploiement ?",
      options: [
        "package.json (fichier Node.js)",
        "requirements.txt (liste des dépendances pip)",
        "Gemfile (fichier Ruby)",
        "Pipfile (alternative moderne)",
      ],
      answer: "requirements.txt (liste des dépendances pip)",
      explanation:
        "requirements.txt est le fichier standard qui liste les dépendances Python (pip install -r requirements.txt). C'est le fichier le plus utilisé pour le déploiement.",
    },
    {
      question:
        "[Déploiement] Où stocke-t-on les secrets (clés API, mots de passe) dans un projet Python déployé ?",
      options: [
        "Dans le code source (au milieu du fichier)",
        "Dans requirements.txt",
        "Dans des variables d'environnement ou GitHub Secrets",
        "Dans un fichier .txt public",
      ],
      answer: "Dans des variables d'environnement ou GitHub Secrets",
      explanation:
        "Les secrets ne doivent jamais être dans le code. On utilise des variables d'environnement (os.getenv()) ou GitHub Secrets pour les CI/CD. C'est une règle de sécurité fondamentale.",
    },
    {
      question:
        "[GitHub] Quelle est la séquence typique d'un flux de déploiement GitHub ?",
      options: [
        "Deploy → Test → Build → Push",
        "Push → Build → Test → Deploy",
        "Build → Deploy → Push → Test",
        "Test → Push → Deploy → Build",
      ],
      answer: "Push → Build → Test → Deploy",
      explanation:
        "Le flux standard : on push le code, la CI build (construit l'app), exécute les tests, et déploie si les tests passent. C'est la base du CI/CD.",
    },
    {
      question:
        "[Déploiement] Que signifie 'CI/CD' ?",
      options: [
        "Continuous Integration / Continuous Deployment (intégration et déploiement continus)",
        "Code Integration / Code Deployment (intégration et déploiement du code)",
        "Continuous Interface / Continuous Data (interface et données continues)",
        "Centralized Integration / Centralized Deployment (intégration et déploiement centralisés)",
      ],
      answer: "Continuous Integration / Continuous Deployment (intégration et déploiement continus)",
      explanation:
        "CI/CD est une pratique d'automatisation. CI = intégration continue (tests automatiques à chaque push). CD = déploiement continu (déploiement automatique après tests réussis).",
    },

    // ==================== SLOTS (3 questions) ====================
    {
      question:
        "[__slots__] Que fait l'attribut __slots__ dans une classe Python ?",
      options: [
        "Il rend la classe plus lente",
        "Il limite les attributs d'instance pour économiser de la mémoire",
        "Il rend la classe immutable",
        "Il active le débogage automatique",
      ],
      answer: "Il limite les attributs d'instance pour économiser de la mémoire",
      explanation:
        "__slots__ remplace __dict__ par un tableau fixe. Les attributs sont limités à ceux listés dans __slots__. La mémoire est réduite, l'accès est un peu plus rapide.",
    },
    {
      question:
        "[__slots__] Quelle est la syntaxe correcte pour utiliser __slots__ ?",
      options: [
        "__slots__ = ['attr1', 'attr2'] (ou tuple)",
        "__slots__(attr1, attr2)",
        "slots = ('attr1', 'attr2')",
        "@slots(['attr1', 'attr2'])",
      ],
      answer: "__slots__ = ['attr1', 'attr2'] (ou tuple)",
      explanation:
        "__slots__ est un attribut de classe qui prend une liste ou un tuple de noms d'attributs. Exemple : __slots__ = ('nom', 'age') ou __slots__ = ['nom', 'age'].",
    },
    {
      question:
        "[__slots__] Quel est l'inconvénient principal de l'utilisation de __slots__ ?",
      options: [
        "La classe devient plus lente",
        "On ne peut pas ajouter d'attributs dynamiques à l'instance",
        "La classe ne peut pas être héritée",
        "La mémoire utilisée augmente",
      ],
      answer: "On ne peut pas ajouter d'attributs dynamiques à l'instance",
      explanation:
        "Avec __slots__, on ne peut pas ajouter d'attributs dynamiques (ex: obj.nouvel_attribut = 1). C'est le prix à payer pour l'économie de mémoire. Parfois on utilise __slots__ = ('__dict__',) pour garder la flexibilité.",
    },

    // ==================== DUNDER METHODS (6 questions) ====================
    {
      question:
        "[Dunder] Quelle méthode est appelée automatiquement à la création d'une instance (constructeur) ?",
      options: [
        "__new__ (création de l'objet)",
        "__init__ (initialisation de l'instance)",
        "__call__ (rend l'objet appelable)",
        "__str__ (représentation textuelle)",
      ],
      answer: "__init__ (initialisation de l'instance)",
      explanation:
        "__init__ est appelé automatiquement après la création de l'instance pour l'initialiser. C'est le constructeur le plus utilisé. __new__ crée l'objet avant __init__.",
    },
    {
      question:
        "[Dunder] Quelle méthode Python est utilisée par print() pour afficher un objet ?",
      options: [
        "__repr__ (représentation technique)",
        "__str__ (représentation lisible pour l'utilisateur)",
        "__format__ (formatage personnalisé)",
        "__call__ (affichage en appelant l'objet)",
      ],
      answer: "__str__ (représentation lisible pour l'utilisateur)",
      explanation:
        "print() utilise __str__ pour une représentation lisible. Si __str__ n'est pas défini, Python utilise __repr__ en fallback. __repr__ est pour le débogage.",
    },
    {
      question:
        "[Dunder] Quelle est la différence entre __str__ et __repr__ ?",
      options: [
        "__str__ est pour les développeurs, __repr__ pour les utilisateurs",
        "__repr__ est pour les développeurs (représentation non ambiguë), __str__ pour les utilisateurs (représentation lisible)",
        "Il n'y a pas de différence",
        "__str__ est utilisé par eval(), __repr__ par print()",
      ],
      answer: "__repr__ est pour les développeurs (représentation non ambiguë), __str__ pour les utilisateurs (représentation lisible)",
      explanation:
        "__repr__ doit être non ambiguë, idéalement eval(repr(obj)) == obj (représentation technique). __str__ est lisible pour l'utilisateur. __repr__ est utilisé en fallback si __str__ manque.",
    },
    {
      question:
        "[Dunder] Quelle méthode est utilisée pour la comparaison d'égalité (==) ?",
      options: [
        "__eq__ (égalité)",
        "__lt__ (inférieur)",
        "__cmp__ (comparaison générique)",
        "__ne__ (différent)",
      ],
      answer: "__eq__ (égalité)",
      explanation:
        "__eq__ définit le comportement de l'opérateur ==. Si __eq__ n'est pas défini, Python compare les identités des objets (is). __ne__ (!=) peut être défini séparément.",
    },
    {
      question:
        "[Dunder] Quelle méthode permet à un objet d'être utilisé comme un context manager (with) ?",
      options: [
        "__enter__ et __exit__ (gestion des contextes)",
        "__call__ (appel comme fonction)",
        "__enter__ uniquement",
        "__with__ (méthode de contexte)",
      ],
      answer: "__enter__ et __exit__ (gestion des contextes)",
      explanation:
        "__enter__ est appelé à l'entrée du bloc with, __exit__ à la sortie (même en cas d'exception). C'est le pattern de gestion des ressources (fichiers, connexions BDD).",
    },
    {
      question:
        "[Dunder] Quelle méthode est appelée quand on utilise len(objet) ?",
      options: [
        "__len__ (longueur de l'objet)",
        "__getitem__ (accès à un élément)",
        "__length__ (méthode alternative)",
        "__call__ (appel comme fonction)",
      ],
      answer: "__len__ (longueur de l'objet)",
      explanation:
        "__len__ doit retourner un entier positif. C'est ce que len() appelle. Souvent utilisé avec __getitem__ pour créer des collections personnalisées.",
    },

    // ==================== QUESTIONS D'ENTRETIEN (7 questions) ====================
    {
      question:
        "[Entretien] Comment répondriez-vous à 'Que fait le GIL et comment le contournez-vous ?' ?",
      options: [
        "Le GIL est un verrou qui bloque tous les threads, je n'utilise pas de threads",
        "Le GIL est un verrou global. Pour le contourner : multiprocessing pour CPU-bound, asyncio ou threads pour I/O-bound",
        "Le GIL est un concept qui n'existe plus en Python 3",
        "Le GIL est un problème qui n'a pas de solution",
      ],
      answer: "Le GIL est un verrou global. Pour le contourner : multiprocessing pour CPU-bound, asyncio ou threads pour I/O-bound",
      explanation:
        "C'est la réponse attendue d'un senior : connaître le GIL, ses impacts, et les solutions (multiprocessing pour CPU, asyncio/threads pour I/O).",
    },
    {
      question:
        "[Entretien] Pourquoi isoler le domaine métier des détails techniques (architecture hexagonale) ?",
      options: [
        "Pour que le code soit plus court",
        "Pour pouvoir tester le métier sans BDD/API, et changer de technologie facilement",
        "Pour utiliser moins de bibliothèques",
        "Pour que les développeurs écrivent moins de code",
      ],
      answer: "Pour pouvoir tester le métier sans BDD/API, et changer de technologie facilement",
      explanation:
        "L'architecture hexagonale isole le métier pour la testabilité et l'évolutivité. On peut tester le domaine sans base de données, remplacer PostgreSQL par MongoDB, etc.",
    },
    {
      question:
        "[Entretien] Quand utiliser __slots__ dans une classe Python ?",
      options: [
        "Jamais, __slots__ est déprécié",
        "Quand on a des millions d'instances et qu'on veut optimiser la mémoire",
        "Toujours, pour rendre la classe plus rapide",
        "Quand on veut empêcher l'héritage",
      ],
      answer: "Quand on a des millions d'instances et qu'on veut optimiser la mémoire",
      explanation:
        "__slots__ est une optimisation mémoire. À utiliser quand on crée beaucoup d'instances (millions) et qu'on veut réduire l'empreinte mémoire. Pas de gain pour les petites applications.",
    },
    {
      question:
        "[Entretien] Quelle est la différence entre TDD et BDD ?",
      options: [
        "TDD est pour les tests, BDD pour les bugs",
        "TDD guide la conception technique, BDD guide le comportement métier (langage métier)",
        "TDD est plus rapide, BDD est plus lent",
        "TDD s'utilise avec Python, BDD avec Java",
      ],
      answer: "TDD guide la conception technique, BDD guide le comportement métier (langage métier)",
      explanation:
        "TDD (Test-Driven Development) : des tests unitaires techniques guident la conception. BDD (Behavior-Driven Development) : des tests en langage métier (Given/When/Then) guident le comportement.",
    },
    {
      question:
        "[Entretien] Quelle est la séquence typique d'un déploiement Python en entreprise ?",
      options: [
        "push → build → test → deploy",
        "test → push → build → deploy",
        "deploy → test → build → push",
        "build → push → test → deploy",
      ],
      answer: "push → build → test → deploy",
      explanation:
        "Séquence standard : push du code, build de l'image, tests (unitaires/intégration), déploiement si tests passent. C'est le pipeline CI/CD typique.",
    },
    {
      question:
        "[Entretien] Quels sont les dunder methods que vous utilisez le plus souvent ?",
      options: [
        "__init__, __str__, __repr__, __eq__ (les plus courants)",
        "__main__, __import__, __all__ (les plus importants)",
        "__add__, __sub__, __mul__ (pour les maths)",
        "__dict__, __class__, __name__ (les attributs spéciaux)",
      ],
      answer: "__init__, __str__, __repr__, __eq__ (les plus courants)",
      explanation:
        "Les dunder methods les plus utilisés sont __init__ (constructeur), __str__ (affichage lisible), __repr__ (débogage), __eq__ (égalité). Ce sont les 4 à connaître impérativement.",
    },
    {
      question:
        "[Entretien] Que signifie 'Le code devient simple quand le problème est bien compris' ?",
      options: [
        "Il faut écrire du code complexe pour résoudre des problèmes complexes",
        "L'analyse et la conception (7 phases) rendent le code plus simple à écrire",
        "Le code doit toujours être simple, même pour des problèmes complexes",
        "Il ne faut pas trop réfléchir avant de coder",
      ],
      answer: "L'analyse et la conception (7 phases) rendent le code plus simple à écrire",
      explanation:
        "C'est la philosophie du document : un senior réfléchit avant de coder. L'analyse, la conception, la justification des choix rendent le code final simple. Le code est la partie la plus facile du travail.",
    },
  ],
  avance: [
    // ==================== GIL AVANCE ====================
    {
      question:
        "[Avancé] Pourquoi le GIL est-il relâché pendant les opérations I/O ?",
      options: [
        "Parce que le GIL n'est pas nécessaire pendant les I/O, le thread peut attendre sans bloquer les autres",
        "Parce que Python détecte automatiquement les I/O et désactive le GIL",
        "Parce que le GIL est un mythe",
        "Parce que les I/O sont plus rapides sans GIL",
      ],
      answer: "Parce que le GIL n'est pas nécessaire pendant les I/O, le thread peut attendre sans bloquer les autres",
      explanation:
        "Le GIL est relâché lors des appels I/O (lecture réseau, BDD) car le thread va attendre. Pendant cette attente, d'autres threads peuvent s'exécuter. C'est pourquoi le multithreading est efficace pour les I/O.",
    },
    {
      question:
        "[Avancé] En architecture hexagonale, comment teste-t-on le domaine métier sans BDD ?",
      options: [
        "En utilisant une vraie BDD de test (lourde)",
        "En utilisant des mocks ou des adaptateurs in-memory qui implémentent les ports",
        "En ne testant pas le domaine, on teste uniquement l'API",
        "En utilisant une BDD SQLite en mémoire",
      ],
      answer: "En utilisant des mocks ou des adaptateurs in-memory qui implémentent les ports",
      explanation:
        "On injecte un adaptateur in-memory (ex: InMemoryRepository) qui implémente le même port (interface) que la vraie BDD. Le domaine n'a pas besoin de savoir si c'est PostgreSQL ou en mémoire.",
    },
    {
      question:
        "[Avancé] Avec __slots__, que se passe-t-il en cas d'héritage ?",
      options: [
        "Les slots sont hérités automatiquement",
        "Les slots ne sont pas hérités automatiquement, chaque classe doit définir ses propres slots",
        "L'héritage est impossible avec __slots__",
        "Les slots du parent sont fusionnés avec ceux de l'enfant",
      ],
      answer: "Les slots ne sont pas hérités automatiquement, chaque classe doit définir ses propres slots",
      explanation:
        "Les __slots__ ne sont pas hérités. Si une classe enfant ne définit pas ses propres __slots__, elle aura un __dict__ (annulant l'optimisation). Il faut définir __slots__ dans chaque classe.",
    },
  ],
  expert: [
    // ==================== PIEGES ====================
    {
      question:
        "[PIÈGE] Que se passe-t-il si on utilise __slots__ et qu'on essaie d'ajouter un attribut dynamique ?",
      options: [
        "L'attribut est ajouté silencieusement",
        "Python lève une AttributeError",
        "Python lève une TypeError",
        "Python ignore l'attribut et continue",
      ],
      answer: "Python lève une AttributeError",
      explanation:
        "Avec __slots__, on ne peut pas ajouter d'attributs dynamiques. Python lève AttributeError: 'MaClasse' object has no attribute 'nouvel_attribut'. C'est une protection mémoire.",
    },
    {
      question:
        "[PIÈGE] En Python, quelle est la différence entre __init__ et __new__ ?",
      options: [
        "__init__ crée l'objet, __new__ l'initialise",
        "__new__ crée l'objet (allocation mémoire), __init__ l'initialise",
        "__init__ et __new__ sont identiques",
        "__init__ est appelé avant __new__",
      ],
      answer: "__new__ crée l'objet (allocation mémoire), __init__ l'initialise",
      explanation:
        "__new__ est appelé en premier pour créer l'objet (allocation mémoire). __init__ est appelé ensuite pour initialiser l'objet. __new__ est rarement surchargé sauf pour les singletons.",
    },
    {
      question:
        "[PIÈGE] Pourquoi un senior dit-il 'Le code est la partie la plus simple du travail' ?",
      options: [
        "Parce que le senior ne code pas",
        "Parce que le travail d'analyse et de conception (les 7 phases) est plus important que le code lui-même",
        "Parce que le code est toujours simple à écrire",
        "Parce que le senior délègue le code aux juniors",
      ],
      answer: "Parce que le travail d'analyse et de conception (les 7 phases) est plus important que le code lui-même",
      explanation:
        "C'est la philosophie centrale du document. L'analyse du besoin, la conception, l'architecture, les justifications de choix sont plus importantes. Quand on a bien compris le problème, le code devient évident.",
    },
  ],
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
      }, 15000);
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
