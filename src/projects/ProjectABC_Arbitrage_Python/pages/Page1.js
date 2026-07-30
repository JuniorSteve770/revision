// src/projects/Project3/pages/Page6_TechInterview.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";


const basicSlides = [
  {
    question: "Les 5 principes SOLID — vue d'ensemble",
    answer:
      "◆ **S - SRP** : Une classe = une seule raison de changer ◆ **O - OCP** : Ouvert à l'extension, fermé à la modification ◆ **L - LSP** : Un sous-type doit pouvoir remplacer son parent ◆ **I - ISP** : Ne pas forcer des méthodes inutiles ◆ **D - DIP** : Dépendre des abstractions, pas des implémentations ⚠️ Mnémotechnique : 'SOLID = code qui tient debout'",
  },
  {
    question: "Les mots-clés Python par principe SOLID",
    answer:
      "◆ **SRP** : `Validator`, `Repository`, `Service` — responsabilités séparées ◆ **OCP** : `ABC`, `@abstractmethod`, Strategy Pattern — ajouter sans modifier ◆ **LSP** : `super().__init__()`, héritage cohérent — remplacer sans casser ◆ **ISP** : `Protocol`, Mixin, interfaces multiples — petites interfaces spécialisées ◆ **DIP** : injection constructeur, `Mock`, dépendre de l'abstrait ⚠️ En entretien : savoir citer 2 mots-clés par principe",
  },
  {
    question: "Code smells SOLID — les reconnaître instantanément",
    answer:
      "◆ **SRP** : `class UserManager` qui valide + sauvegarde + envoie des emails ◆ **OCP** : cascade `if/elif` pour chaque nouveau type ◆ **LSP** : `raise NotImplementedError` dans une sous-classe ◆ **ISP** : interface `Worker` avec `eat()`, `sleep()`, `work()` pour un robot ◆ **DIP** : `self.db = PostgresDB()` en dur dans `__init__` ⚠️ Un code smell = un signal qu'un principe est violé",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[SRP] Quelle phrase décrit le mieux le SRP ?",
      options: [
        "Une classe doit avoir le moins de méthodes possible",
        "Une classe ne doit dépendre que d'une seule autre classe",
        "Une classe doit avoir une seule raison de changer",
        "Une classe doit être immutable",
      ],
      answer: "Une classe doit avoir une seule raison de changer",
      explanation:
        "C'est la définition historique de Robert C. Martin. 'Une seule raison de changer' = une seule responsabilité.",
    },
    {
      question:
        "[SRP] Quel est le problème principal dans cette classe ?\n\nclass Invoice:\n    def calculate_total(self): ...\n    def save_to_db(self): ...\n    def print_invoice(self): ...",
      options: [
        "Trop de paramètres dans les méthodes",
        "Absence d'interface abstraite",
        "Pas d'injection de dépendances",
        "Violation SRP : plusieurs responsabilités (calcul, persistance, affichage)",
      ],
      answer: "Violation SRP : plusieurs responsabilités (calcul, persistance, affichage)",
      explanation:
        "La classe mélange calcul métier, persistance base de données et impression. Trois raisons distinctes de changer = violation SRP.",
    },
    {
      question:
        "[SRP] Dans une architecture respectant le SRP, quel suffixe de classe indique une responsabilité unique ?",
      options: [
        "Manager, Handler, Processor",
        "Helper, Utils, Common",
        "Base, Abstract, Mixin",
        "Validator, Repository, Service",
      ],
      answer: "Validator, Repository, Service",
      explanation:
        "Ces suffixes indiquent des responsabilités spécifiques : validation, persistance, logique métier. 'Manager' est souvent un signe de violation.",
    },
    {
      question:
        "[SRP] Le SRP est violé si :",
      options: [
        "Une classe a plus de 10 méthodes",
        "Une classe change pour des raisons différentes (ex: changement DB ET changement règle métier)",
        "Une classe utilise une autre classe",
        "Une classe n'a pas de constructeur explicite",
      ],
      answer: "Une classe change pour des raisons différentes (ex: changement DB ET changement règle métier)",
      explanation:
        "C'est la définition : si la classe a plusieurs 'raisons de changer', elle viole SRP.",
    },
    {
      question:
        "[SRP] Laquelle de ces refactorisations respecte le SRP ?\n\n# Code initial\nclass Report:\n    def fetch_data(self): ...\n    def format_html(self): ...\n    def send_email(self): ...",
      options: [
        "Une seule classe ReportService avec tout dedans",
        "Report hérite de BaseReport",
        "Report devient @dataclass",
        "DataFetcher, HtmlFormatter, EmailSender — trois classes distinctes",
      ],
      answer: "DataFetcher, HtmlFormatter, EmailSender — trois classes distinctes",
      explanation:
        "Chaque classe a une responsabilité unique : récupération, mise en forme, envoi. C'est l'essence du SRP.",
    },
    {
      question:
        "[SRP] 'Separation of concerns' signifie :",
      options: [
        "Séparer les classes en différents fichiers",
        "Éviter les méthodes privées",
        "Utiliser des interfaces partout",
        "Séparer les préoccupations métier, techniques et d'infrastructure",
      ],
      answer: "Séparer les préoccupations métier, techniques et d'infrastructure",
      explanation:
        "C'est le principe architectural sous-jacent au SRP : chaque préoccupation (concern) est isolée.",
    },
    {
      question:
        "[SRP] Lequel de ces rôles N'EST PAS une responsabilité unique acceptable ?",
      options: [
        "UserValidator",
        "UserService",
        "UserAndOrderManager",
        "UserRepository",
      ],
      answer: "UserAndOrderManager",
      explanation:
        "Le nom suggère que la classe gère à la fois les utilisateurs ET les commandes → deux responsabilités.",
    },
    {
      question:
        "[SRP] Une classe Order (commande métier) doit :",
      options: [
        "Calculer sa TVA ET sauvegarder en base",
        "Envoyer une confirmation par email",
        "Gérer les logs système",
        "Uniquement représenter les données métier (prix, quantité, produit)",
      ],
      answer: "Uniquement représenter les données métier (prix, quantité, produit)",
      explanation:
        "Dans une architecture SRP, l'entité métier ne doit pas gérer la persistance ni les notifications.",
    },
    {
      question:
        "[SRP] Le SRP est un principe :",
      options: [
        "De performance mémoire",
        "De sécurité des threads",
        "D'héritage multiple",
        "D'organisation des responsabilités pour faciliter la maintenance",
      ],
      answer: "D'organisation des responsabilités pour faciliter la maintenance",
      explanation:
        "Le SRP vise à rendre le code plus maintenable en isolant ce qui change pour des raisons différentes.",
    },
    {
      question:
        "[SRP] Quelle phrase est fausse concernant le SRP ?",
      options: [
        "Une classe avec 3 méthodes peut respecter le SRP",
        "SRP réduit l'impact des changements",
        "SRP facilite les tests unitaires",
        "SRP interdit d'avoir plusieurs méthodes publiques",
      ],
      answer: "SRP interdit d'avoir plusieurs méthodes publiques",
      explanation:
        "Une classe peut avoir plusieurs méthodes publiques tant qu'elles servent la même responsabilité.",
    },
    {
      question:
        "[SRP] Refactoriser selon SRP rend le code :",
      options: [
        "Plus long mais plus sûr",
        "Plus lent à l'exécution",
        "Impossible à étendre",
        "Plus testable et plus lisible",
      ],
      answer: "Plus testable et plus lisible",
      explanation:
        "Les bénéfices concrets du SRP sont une meilleure testabilité et une lisibilité accrue.",
    },
    {
      question:
        "[SRP] Le SRP prépare naturellement à quel autre principe SOLID ?",
      options: [
        "Uniquement LSP",
        "Uniquement OCP",
        "Aucun",
        "Tous, car chaque principe s'applique à une classe à responsabilité unique",
      ],
      answer: "Tous, car chaque principe s'applique à une classe à responsabilité unique",
      explanation:
        "SRP est souvent la première étape avant d'appliquer OCP, LSP, ISP, DIP.",
    },
    {
      question:
        "[OCP] Que signifie 'ouvert à l'extension, fermé à la modification' ?",
      options: [
        "On peut modifier le code existant librement",
        "On ne peut jamais modifier une classe",
        "On doit figer l'API après la première version",
        "On peut ajouter du comportement sans modifier le code existant",
      ],
      answer: "On peut ajouter du comportement sans modifier le code existant",
      explanation:
        "C'est la définition exacte de l'OCP : le code existant reste intact, on ajoute de nouvelles classes.",
    },
    {
      question:
        "[OCP] Quel pattern est LA solution typique à l'OCP ?",
      options: [
        "Singleton",
        "Factory Method uniquement",
        "Observer Pattern",
        "Strategy Pattern / Registry Pattern",
      ],
      answer: "Strategy Pattern / Registry Pattern",
      explanation:
        "Strategy permet d'ajouter de nouvelles implémentations sans modifier le code client.",
    },
    {
      question:
        "[OCP] Le code suivant viole quel principe ?\n\ndef process_payment(method, amount):\n    if method == 'card': ...\n    elif method == 'paypal': ...\n    elif method == 'crypto': ...",
      options: [
        "SRP",
        "LSP",
        "DIP",
        "OCP",
      ],
      answer: "OCP",
      explanation:
        "Chaque nouveau moyen de paiement nécessite de modifier la fonction → violation OCP.",
    },
    {
      question:
        "[OCP] Comment corriger ce problème OCP ?",
      options: [
        "Ajouter un else",
        "Utiliser un match/case (Python 3.10)",
        "Tout mettre dans une seule classe",
        "Créer une abstraction PaymentProcessor et des classes concrètes",
      ],
      answer: "Créer une abstraction PaymentProcessor et des classes concrètes",
      explanation:
        "L'abstraction permet d'étendre : chaque nouvelle implémentation est une nouvelle classe.",
    },
    {
      question:
        "[OCP] Dans une architecture OCP, où se fait l'enregistrement des nouvelles implémentations ?",
      options: [
        "Directement dans le code client avec des if",
        "Dans une variable globale modifiable",
        "Dans le constructeur de l'abstraction",
        "Dans un registre (Registry Pattern) ou via injection",
      ],
      answer: "Dans un registre (Registry Pattern) ou via injection",
      explanation:
        "Le registre ou l'injection permettent d'ajouter des stratégies sans modifier le cœur.",
    },
    {
      question:
        "[OCP] Lequel de ces mots-clés est associé à l'OCP ?",
      options: [
        "@dataclass(frozen=True)",
        "__slots__",
        "global",
        "@abstractmethod",
      ],
      answer: "@abstractmethod",
      explanation:
        "@abstractmethod définit le contrat extensible que les sous-classes doivent implémenter.",
    },
    {
      question:
        "[OCP] L'OCP est violé si :",
      options: [
        "On utilise l'héritage",
        "On a plus de 3 classes",
        "On injecte des dépendances",
        "On modifie une classe existante pour ajouter un nouveau cas",
      ],
      answer: "On modifie une classe existante pour ajouter un nouveau cas",
      explanation:
        "C'est exactement la violation : le code existant devrait être fermé à la modification.",
    },
    {
      question:
        "[OCP] L'OCP repose principalement sur :",
      options: [
        "Les variables globales",
        "Les fonctions imbriquées",
        "Les listes chaînées",
        "Le polymorphisme",
      ],
      answer: "Le polymorphisme",
      explanation:
        "Le polymorphisme permet d'ajouter de nouveaux comportements sans conditionnelles.",
    },
    {
      question:
        "[OCP] checkout(processor: PaymentProcessor, amount: float) respecte l'OCP car :",
      options: [
        "Le paramètre est typé avec une abstraction",
        "On peut passer n'importe quelle classe qui hérite de PaymentProcessor",
        "On n'a pas besoin de modifier checkout pour ajouter un nouveau moyen de paiement",
        "Toutes les réponses ci-dessus",
      ],
      answer: "Toutes les réponses ci-dessus",
      explanation:
        "Tout est correct : abstraction, polymorphisme, extension sans modification.",
    },
    {
      question:
        "[OCP] Que signifie 'zéro risque de régression' dans un contexte OCP ?",
      options: [
        "Le code ne change jamais",
        "On teste après chaque modification",
        "On utilise le duck typing",
        "On n'ajoute que de nouvelles classes, on ne modifie pas l'existant → on ne casse rien",
      ],
      answer: "On n'ajoute que de nouvelles classes, on ne modifie pas l'existant → on ne casse rien",
      explanation:
        "L'OCP protège le code existant car on ne le modifie pas.",
    },
    {
      question:
        "[OCP] Le 'Registry Pattern' est utile pour l'OCP car :",
      options: [
        "Il évite les if/elif",
        "Il centralise l'enregistrement des stratégies",
        "Il permet d'ajouter une stratégie avec un simple décorateur @register",
        "Toutes les réponses ci-dessus",
      ],
      answer: "Toutes les réponses ci-dessus",
      explanation:
        "Le registre est une implémentation pratique de l'OCP avec tous ces avantages.",
    },
    {
      question:
        "[OCP] Lequel n'est PAS un indicateur de violation OCP ?",
      options: [
        "Une longue chaîne if/elif sur un type",
        "L'ajout systématique de elif pour chaque nouveau cas",
        "Une classe PaymentProcessor qui grandit à chaque nouvelle demande",
        "L'utilisation de @abstractmethod",
      ],
      answer: "L'utilisation de @abstractmethod",
      explanation:
        "@abstractmethod est au contraire un bon signe d'OCP (création d'abstraction).",
    },
    {
      question:
        "[LSP] Que dit le principe de substitution de Liskov (LSP) ?",
      options: [
        "Un enfant doit être plus petit que son parent",
        "Toute classe doit avoir un parent",
        "Une classe ne doit pas hériter de plus d'une classe",
        "Un sous-type doit pouvoir remplacer son parent sans casser le programme",
      ],
      answer: "Un sous-type doit pouvoir remplacer son parent sans casser le programme",
      explanation:
        "C'est la définition exacte du LSP : le parent et l'enfant sont interchangeables.",
    },
    {
      question:
        "[LSP] Quel code viole clairement LSP ?\n\nclass Bird:\n    def fly(self): ...\n\nclass Penguin(Bird):\n    def fly(self):\n        raise NotImplementedError()",
      options: [
        "Aucune violation",
        "Violation SRP",
        "Violation DIP",
        "Violation LSP car Penguin ne peut pas voler",
      ],
      answer: "Violation LSP car Penguin ne peut pas voler",
      explanation:
        "Penguin ne peut pas remplacer Bird partout car tout code appelant fly() échouera.",
    },
    {
      question:
        "[LSP] Comment corriger la hiérarchie Penguin / Bird ?",
      options: [
        "Laisser Penguin hériter mais gérer l'exception",
        "Ne pas utiliser l'héritage",
        "Ajouter une méthode swim() dans Bird",
        "Créer une classe Animal avec move() abstrait, puis FlyingBird et Penguin",
      ],
      answer: "Créer une classe Animal avec move() abstrait, puis FlyingBird et Penguin",
      explanation:
        "On crée une abstraction plus générale qui ne suppose pas le vol.",
    },
    {
      question:
        "[LSP] isinstance(obj, Parent) est utile pour :",
      options: [
        "Vérifier le respect du SRP",
        "Forcer l'OCP",
        "Inverser les dépendances",
        "Vérifier la compatibilité de type (mais LSP préfère éviter ces tests)",
      ],
      answer: "Vérifier la compatibilité de type (mais LSP préfère éviter ces tests)",
      explanation:
        "LSP encourage plutôt des comportements uniformes sans tests de type explicites.",
    },
    {
      question:
        "[LSP] LSP est violé si :",
      options: [
        "Une sous-classe ajoute une nouvelle méthode",
        "Une sous-classe a le même nom que le parent",
        "Une sous-classe utilise super()",
        "Une sous-classe restreint les types des paramètres",
      ],
      answer: "Une sous-classe restreint les types des paramètres",
      explanation:
        "Restreindre les préconditions ou affaiblir les postconditions viole LSP.",
    },
    {
      question:
        "[LSP] Que signifie 'le contrat du parent' pour LSP ?",
      options: [
        "Le nom de la classe",
        "La liste des imports",
        "Le nombre de méthodes",
        "Les préconditions, postconditions et invariants",
      ],
      answer: "Les préconditions, postconditions et invariants",
      explanation:
        "LSP assure que le sous-type respecte ces contrats.",
    },
    {
      question:
        "[LSP] Le code suivant viole-t-il LSP ?\n\nclass Rectangle:\n    def set_width(self, w): self.w = w\n    def set_height(self, h): self.h = h\n\nclass Square(Rectangle):\n    def set_width(self, w): self.w = self.h = w\n    def set_height(self, h): self.w = self.h = h",
      options: [
        "Non",
        "Oui, car Square n'a pas de constructeur",
        "Non, c'est un exemple classique valide",
        "Oui, car Square change le comportement attendu d'un Rectangle",
      ],
      answer: "Oui, car Square change le comportement attendu d'un Rectangle",
      explanation:
        "C'est la violation LSP classique : un carré ne peut pas remplacer un rectangle (largeur/hauteur liées).",
    },
    {
      question:
        "[LSP] super().__init__() est utilisé pour :",
      options: [
        "Violer LSP",
        "Éviter l'héritage multiple",
        "Rendre la classe immutable",
        "Appeler le constructeur parent et garantir l'initialisation du contrat parent",
      ],
      answer: "Appeler le constructeur parent et garantir l'initialisation du contrat parent",
      explanation:
        "C'est une bonne pratique pour respecter LSP.",
    },
    {
      question:
        "[LSP] Une sous-classe respecte LSP si :",
      options: [
        "Elle supprime certaines méthodes",
        "Elle change complètement le type de retour",
        "Elle ajoute des préconditions plus strictes",
        "Elle lève des exceptions plus spécifiques (jamais de nouvelles inattendues)",
      ],
      answer: "Elle lève des exceptions plus spécifiques (jamais de nouvelles inattendues)",
      explanation:
        "Lever des exceptions plus spécifiques est acceptable, mais pas des exceptions totalement nouvelles.",
    },
    {
      question:
        "[LSP] 'f(Parent) doit marcher avec f(Enfant)' signifie :",
      options: [
        "Les fonctions doivent être privées",
        "Les enfants doivent être plus lents",
        "Les parents doivent hériter des enfants",
        "Toute fonction qui utilise le parent doit fonctionner avec l'enfant",
      ],
      answer: "Toute fonction qui utilise le parent doit fonctionner avec l'enfant",
      explanation:
        "C'est la traduction pratique du LSP.",
    },
    {
      question:
        "[LSP] Lequel est un bon candidat pour LSP ?",
      options: [
        "Penguin hérite de Bird sans méthode fly",
        "Manager hérite de Employee mais supprime calculate_salary()",
        "Cat hérite de Dog",
        "Car hérite de Vehicle avec start_engine() commun",
      ],
      answer: "Car hérite de Vehicle avec start_engine() commun",
      explanation:
        "Le contrat commun est respecté : toute voiture est un véhicule.",
    },
    {
      question:
        "[LSP] Pourquoi raise NotImplementedError dans une sous-classe est souvent un problème LSP ?",
      options: [
        "Parce que c'est trop lent",
        "Parce que ça rend le code plus long",
        "Parce que ça force l'usage de try/except",
        "Parce que la méthode devrait exister ou l'abstraction être repensée",
      ],
      answer: "Parce que la méthode devrait exister ou l'abstraction être repensée",
      explanation:
        "Si une sous-classe ne peut pas implémenter une méthode, le contrat parent est trop large.",
    },
    {
      question:
        "[ISP] Que dit l'ISP ?",
      options: [
        "Une interface doit être unique",
        "Toute classe doit avoir au moins 2 interfaces",
        "Les interfaces doivent être privées",
        "Une classe ne doit pas être forcée d'implémenter des méthodes qu'elle n'utilise pas",
      ],
      answer: "Une classe ne doit pas être forcée d'implémenter des méthodes qu'elle n'utilise pas",
      explanation:
        "C'est la définition de l'ISP : ne pas imposer de méthodes inutiles.",
    },
    {
      question:
        "[ISP] Le code suivant viole quel principe ?\n\nclass Worker(ABC):\n    @abstractmethod\n    def work(self): ...\n    @abstractmethod\n    def eat(self): ...\n    @abstractmethod\n    def sleep(self): ...\n\nclass RobotWorker(Worker):\n    def work(self): ...\n    def eat(self): raise NotImplementedError\n    def sleep(self): raise NotImplementedError",
      options: [
        "SRP",
        "OCP",
        "LSP",
        "ISP",
      ],
      answer: "ISP",
      explanation:
        "RobotWorker est forcé d'implémenter eat() et sleep() dont il n'a pas besoin.",
    },
    {
      question:
        "[ISP] Comment corriger cette violation ISP ?",
      options: [
        "Mettre pass dans eat() et sleep()",
        "Supprimer eat() et sleep() de Worker",
        "Utiliser @abstractproperty",
        "Créer plusieurs interfaces minimales : Workable, Eatable, Sleepable",
      ],
      answer: "Créer plusieurs interfaces minimales : Workable, Eatable, Sleepable",
      explanation:
        "La ségrégation des interfaces : chaque classe implémente uniquement ce dont elle a besoin.",
    },
    {
      question:
        "[ISP] En Python, quel mécanisme permet de créer des interfaces légères sans héritage ?",
      options: [
        "type()",
        "@staticmethod",
        "__slots__",
        "Protocol (typing)",
      ],
      answer: "Protocol (typing)",
      explanation:
        "Protocol permet le duck typing structurel (interfaces implicites).",
    },
    {
      question:
        "[ISP] Une interface 'grasse' (bloated) signifie :",
      options: [
        "Trop de méthodes abstraites",
        "Des méthodes sans implémentation",
        "Une interface avec beaucoup de documentation",
        "Une interface qui force des classes à implémenter des comportements non pertinents",
      ],
      answer: "Une interface qui force des classes à implémenter des comportements non pertinents",
      explanation:
        "C'est le problème que l'ISP résout.",
    },
    {
      question:
        "[ISP] Les Mixin sont utiles dans le cadre de l'ISP car :",
      options: [
        "Ils remplacent les interfaces",
        "Ils rendent les classes finales",
        "Ils améliorent les performances",
        "Ils permettent la composition de comportements optionnels",
      ],
      answer: "Ils permettent la composition de comportements optionnels",
      explanation:
        "Un mixin ajoute un comportement sans forcer toutes les classes.",
    },
    {
      question:
        "[ISP] L'ISP est particulièrement lié à :",
      options: [
        "L'héritage simple",
        "Les variables globales",
        "Les décorateurs",
        "La composition et la ségrégation des contrats",
      ],
      answer: "La composition et la ségrégation des contrats",
      explanation:
        "ISP encourage plusieurs petits contrats plutôt qu'un seul gros.",
    },
    {
      question:
        "[ISP] Lequel est un signe de violation ISP ?",
      options: [
        "Une classe avec __init__",
        "Une classe avec 2 méthodes",
        "Une classe sans attributs",
        "Une classe qui utilise pass pour des méthodes abstraites",
      ],
      answer: "Une classe qui utilise pass pour des méthodes abstraites",
      explanation:
        "pass ou NotImplementedError pour des méthodes inutiles = ISP violé.",
    },
    {
      question:
        "[ISP] En Python 3.8+, Protocol permet :",
      options: [
        "De forcer l'héritage",
        "De rendre les classes immutables",
        "De créer des singletons",
        "De définir des interfaces implicites (duck typing)",
      ],
      answer: "De définir des interfaces implicites (duck typing)",
      explanation:
        "Protocol est une forme d'interface structurelle.",
    },
    {
      question:
        "[ISP] HumanWorker(Workable, Eatable, Sleepable) respecte l'ISP car :",
      options: [
        "Il n'implémente rien",
        "Il a un nom long",
        "Il utilise @dataclass",
        "Il hérite de trois interfaces spécialisées",
      ],
      answer: "Il hérite de trois interfaces spécialisées",
      explanation:
        "Chaque interface a une seule responsabilité de contrat.",
    },
    {
      question:
        "[ISP] L'ISP est proche de quel autre principe ?",
      options: [
        "OCP",
        "LSP",
        "DIP",
        "SRP (mais au niveau des interfaces)",
      ],
      answer: "SRP (mais au niveau des interfaces)",
      explanation:
        "SRP s'applique aux classes, ISP aux interfaces (contrats).",
    },
    {
      question:
        "[ISP] Une interface Machine avec start(), stop(), refuel() est mauvaise pour un Robot électrique car :",
      options: [
        "start() est trop court",
        "stop() est inutile",
        "L'interface est trop petite",
        "refuel() n'a pas de sens",
      ],
      answer: "refuel() n'a pas de sens",
      explanation:
        "Violation ISP : un robot électrique n'a pas besoin de refuel().",
    },
    {
      question:
        "[DIP] Que dit le DIP ?",
      options: [
        "Dépendre des implémentations concrètes",
        "Ne jamais utiliser l'injection",
        "Toujours instancier les dépendances dans le constructeur",
        "Dépendre des abstractions, pas des implémentations",
      ],
      answer: "Dépendre des abstractions, pas des implémentations",
      explanation:
        "C'est la définition du Dependency Inversion Principle.",
    },
    {
      question:
        "[DIP] Le code suivant viole quel principe ?\n\nclass NotificationService:\n    def __init__(self):\n        self.sender = EmailSender()",
      options: [
        "SRP",
        "OCP",
        "LSP",
        "DIP",
      ],
      answer: "DIP",
      explanation:
        "Dépendance concrète en dur, pas d'injection → violation DIP.",
    },
    {
      question:
        "[DIP] Comment corriger cette violation DIP ?",
      options: [
        "Remplacer EmailSender par SMSSender en dur",
        "Ajouter un if pour choisir le sender",
        "Supprimer NotificationService",
        "Injecter sender: MessageSender dans le constructeur",
      ],
      answer: "Injecter sender: MessageSender dans le constructeur",
      explanation:
        "L'injection de dépendance via l'abstraction est la correction standard.",
    },
    {
      question:
        "[DIP] Le DIP facilite les tests car :",
      options: [
        "Les tests sont plus lents",
        "On teste directement la base de données",
        "On n'a pas besoin de tester",
        "On peut remplacer la dépendance réelle par un Mock ou Stub",
      ],
      answer: "On peut remplacer la dépendance réelle par un Mock ou Stub",
      explanation:
        "L'injection permet d'isoler la classe testée.",
    },
    {
      question:
        "[DIP] unittest.mock.Mock() est utilisé pour :",
      options: [
        "Violer le DIP",
        "Créer une vraie base de données",
        "Rendre une classe finale",
        "Remplacer une dépendance concrète en test",
      ],
      answer: "Remplacer une dépendance concrète en test",
      explanation:
        "Le mock simule l'abstraction pour les tests unitaires.",
    },
    {
      question:
        "[DIP] Le DIP repose sur le principe d'inversion de contrôle (IoC) :",
      options: [
        "Faux",
        "Uniquement pour les bases de données",
        "Seulement en Java",
        "Vrai",
      ],
      answer: "Vrai",
      explanation:
        "IoC (Inversion of Control) est le fondement du DIP.",
    },
    {
      question:
        "[DIP] Une abstraction en Python peut être :",
      options: [
        "ABC avec @abstractmethod",
        "Protocol",
        "Une classe parente simple (duck typing)",
        "Toutes les réponses ci-dessus",
      ],
      answer: "Toutes les réponses ci-dessus",
      explanation:
        "Python est flexible : ABC, Protocol ou duck typing informel.",
    },
    {
      question:
        "[DIP] Le DIP est violé si :",
      options: [
        "On injecte une dépendance abstraite",
        "On utilise super()",
        "On définit une interface",
        "On fait self.db = PostgresDB() dans __init__",
      ],
      answer: "On fait self.db = PostgresDB() dans __init__",
      explanation:
        "Couplage fort à une implémentation concrète = violation DIP.",
    },
    {
      question:
        "[DIP] L'injection par constructeur (__init__) permet :",
      options: [
        "De figer les dépendances",
        "D'éviter l'utilisation d'interfaces",
        "De cacher les dépendances",
        "De rendre la classe flexible et testable",
      ],
      answer: "De rendre la classe flexible et testable",
      explanation:
        "C'est le but principal de l'injection de dépendances.",
    },
    {
      question:
        "[DIP] DIP + OCP ensemble permettent :",
      options: [
        "De multiplier les if/elif",
        "D'écrire moins de classes",
        "D'éviter l'héritage",
        "D'ajouter de nouvelles implémentations sans modifier le code client",
      ],
      answer: "D'ajouter de nouvelles implémentations sans modifier le code client",
      explanation:
        "DIP fournit l'abstraction, OCP permet l'extension.",
    },
    {
      question:
        "[DIP] Lequel est un bénéfice direct du DIP ?",
      options: [
        "Code plus rapide",
        "Moins de classes",
        "Plus de variables globales",
        "Code découplé, remplaçable, testable",
      ],
      answer: "Code découplé, remplaçable, testable",
      explanation:
        "Le DIP réduit le couplage et améliore la testabilité.",
    },
    {
      question:
        "[DIP] 'Inversion' dans DIP signifie :",
      options: [
        "Inverser l'ordre des méthodes",
        "Inverser l'héritage",
        "Inverser les noms de classes",
        "Les modules de haut niveau ne dépendent plus des modules de bas niveau, mais tous dépendent d'abstractions",
      ],
      answer: "Les modules de haut niveau ne dépendent plus des modules de bas niveau, mais tous dépendent d'abstractions",
      explanation:
        "C'est le sens de l'inversion des dépendances.",
    },
  ],
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


