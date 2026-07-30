// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Les 4 piliers de la POO — vue d'ensemble",
    answer:
      "◆ **Encapsulation** : regrouper données et comportements, cacher l'implémentation ◆ **Héritage** : une classe hérite des attributs et méthodes d'une autre ◆ **Polymorphisme** : une même interface peut avoir plusieurs comportements ◆ **Abstraction** : ne montrer que l'essentiel, cacher les détails ⚠️ Les 4 piliers = fondement de la POO",
  },
  {
    question: "Mots-clés Python POO à maîtriser",
    answer:
      "◆ **Classe** : plan/moule pour créer des objets ◆ **Objet/Instance** : réalisation concrète d'une classe ◆ **self** : référence à l'instance courante ◆ **__init__** : constructeur ◆ **@property** : getter/setter élégant ◆ **__str__ / __repr__** : représentation texte ◆ **@classmethod / @staticmethod** : méthodes de classe ◆ **public / _protected / __private** : conventions de visibilité",
  },
  {
    question: "Anti-patterns POO à éviter",
    answer:
      "◆ **God Object** : classe qui fait tout ◆ **Anemic Domain Model** : classes sans comportement, juste des getters/setters ◆ **Trop d'héritage** : hiérarchies profondes et complexes ◆ **Héritage pour réutiliser** : préférer composition ◆ **Setters publics** : casser l'encapsulation ⚠️ Composition > Héritage quand c'est possible",
  },
];

const questions = {
  moyen: [
    // ==================== ENCAPSULATION ====================
    {
      question:
        "[Encapsulation] Que signifie l'encapsulation en POO ?",
      options: [
        "Une classe ne peut hériter que d'une seule autre classe",
        "Regrouper les données et les méthodes qui les manipulent, et cacher l'implémentation interne",
        "Une méthode peut avoir plusieurs formes différentes",
        "Une classe doit avoir une seule responsabilité",
      ],
      answer: "Regrouper les données et les méthodes qui les manipulent, et cacher l'implémentation interne",
      explanation:
        "L'encapsulation consiste à regrouper les données (attributs) avec les méthodes qui les manipulent, et à protéger l'accès direct aux données.",
    },
    {
      question:
        "[Encapsulation] En Python, comment indique-t-on qu'un attribut est 'privé' (convention) ?",
      options: [
        "private nom_attribut",
        "nom_attribut (rien de spécial)",
        "__nom_attribut__ (double underscores des deux côtés)",
        "_nom_attribut (un underscore)",
      ],
      answer: "_nom_attribut (un underscore)",
      explanation:
        "Par convention, un underscore préfixé signifie 'protégé' (ne pas toucher de l'extérieur). Double underscore __nom active le name mangling.",
    },
    {
      question:
        "[Encapsulation] Que fait le double underscore '__' devant un attribut en Python ?",
      options: [
        "Rend l'attribut strictement privé (impossible d'accéder)",
        "Déclare un attribut de classe (static)",
        "Déclare un attribut en lecture seule",
        "Active le 'name mangling' : le nom est transformé en _Classe__attribut",
      ],
      answer: "Active le 'name mangling' : le nom est transformé en _Classe__attribut",
      explanation:
        "Le name mangling rend l'accès plus difficile (mais pas impossible) en renommant l'attribut en interne. C'est une protection forte mais pas absolue.",
    },
    {
      question:
        "[Encapsulation] Quel est l'avantage principal d'utiliser des getters/setters (ou @property) ?",
      options: [
        "Rendre le code plus long et plus complexe",
        "Rendre les attributs invisibles de l'extérieur",
        "Améliorer les performances d'accès aux données",
        "Permettre d'ajouter de la logique (validation, calcul) lors de l'accès ou de la modification",
      ],
      answer: "Permettre d'ajouter de la logique (validation, calcul) lors de l'accès ou de la modification",
      explanation:
        "Les getters/setters permettent d'ajouter des contrôles (validation, transformation) sans changer l'interface publique.",
    },
    {
      question:
        "[Encapsulation] Que produit ce code ?\n\nclass Compte:\n    def __init__(self):\n        self.__solde = 100\n\nc = Compte()\nprint(c.__solde)",
      options: [
        "Affiche 100",
        "Affiche 0",
        "Affiche 'c.__solde'",
        "Lève une AttributeError car __solde est masqué",
      ],
      answer: "Lève une AttributeError car __solde est masqué",
      explanation:
        "L'attribut __solde subit un name mangling et devient _Compte__solde. On ne peut pas y accéder directement depuis l'extérieur.",
    },
    {
      question:
        "[Encapsulation] Le décorateur @property en Python sert à :",
      options: [
        "Définir une méthode de classe",
        "Définir une méthode statique",
        "Déclarer un attribut abstrait",
        "Transformer une méthode en attribut accessible comme une propriété (getter élégant)",
      ],
      answer: "Transformer une méthode en attribut accessible comme une propriété (getter élégant)",
      explanation:
        "@property permet d'appeler une méthode sans parenthèses, comme si c'était un attribut, tout en conservant la logique.",
    },
    {
      question:
        "[Encapsulation] Lequel de ces codes respecte le mieux l'encapsulation ?",
      options: [
        "class User:\n    def __init__(self, age):\n        self.age = age",
        "class User:\n    def __init__(self, age):\n        pass",
        "class User:\n    def __init__(self, age):\n        self.__age = age\n    def get_age(self): return self.__age\n    def set_age(self, age): self.__age = age",
        "class User:\n    def __init__(self, age):\n        self._age = age\n    @property\n    def age(self): return self._age\n    @age.setter\n    def age(self, value):\n        if value >= 0: self._age = value",
      ],
      answer: "class User:\n    def __init__(self, age):\n        self._age = age\n    @property\n    def age(self): return self._age\n    @age.setter\n    def age(self, value):\n        if value >= 0: self._age = value",
      explanation:
        "Cette version utilise la convention _age pour stockage, @property pour le getter, et une validation dans le setter. C'est l'encapsulation Pythonic.",
    },
    {
      question:
        "[Encapsulation] Une classe avec tous ses attributs publics (self.name = name) :",
      options: [
        "Respecte parfaitement l'encapsulation",
        "Est plus rapide à l'exécution",
        "Est recommandée pour tous les projets",
        "Permet de modifier les attributs sans contrôle, ce qui peut fragiliser le code",
      ],
      answer: "Permet de modifier les attributs sans contrôle, ce qui peut fragiliser le code",
      explanation:
        "Des attributs publics exposent les détails internes et permettent des modifications incontrôlées, violant l'encapsulation.",
    },
    {
      question:
        "[Encapsulation] Quelle est la différence entre _attribut et __attribut ?",
      options: [
        "Il n'y a pas de différence",
        "_attribut est public, __attribut est privé",
        "_attribut ne peut être utilisé qu'en dehors de la classe, __attribut seulement dedans",
        "_attribut est une convention pour usage interne, __attribut active le name mangling",
      ],
      answer: "_attribut est une convention pour usage interne, __attribut active le name mangling",
      explanation:
        "_attribut = convention (protégé), __attribut = name mangling (plus difficilement accessible).",
    },
    {
      question:
        "[Encapsulation] Que permet d'éviter une bonne encapsulation ?",
      options: [
        "Les boucles infinies",
        "Les fuites de mémoire",
        "Les conflits de noms entre classes",
        "Les états incohérents d'un objet (validation des données à la modification)",
      ],
      answer: "Les états incohérents d'un objet (validation des données à la modification)",
      explanation:
        "L'encapsulation avec validation dans les setters empêche de mettre l'objet dans un état invalide.",
    },
    {
      question:
        "[Encapsulation] En Python, une méthode avec un underscore préfixé (_methode) est :",
      options: [
        "Strictement privée, inaccessible",
        "Une méthode abstraite",
        "Une méthode de classe",
        "Une convention indiquant qu'elle est destinée à un usage interne (non publique)",
      ],
      answer: "Une convention indiquant qu'elle est destinée à un usage interne (non publique)",
      explanation:
        "L'underscore est une convention : 'c'est interne, utilise à tes risques et périls'.",
    },
    {
      question:
        "[Encapsulation] Le nom mangling (__attribut) a quel effet concret ?",
      options: [
        "L'attribut devient totalement inaccessible",
        "L'attribut devient accessible uniquement en lecture",
        "L'attribut est automatiquement supprimé à la fin de la méthode",
        "Le nom est transformé en _Classe__attribut, rendant l'accès externe plus difficile",
      ],
      answer: "Le nom est transformé en _Classe__attribut, rendant l'accès externe plus difficile",
      explanation:
        "Le name mangling renomme l'attribut avec le nom de la classe pour éviter les collisions accidentelles.",
    },

    // ==================== HERITAGE ====================
    {
      question:
        "[Héritage] Que permet l'héritage en POO ?",
      options: [
        "Créer plusieurs objets à partir d'une même classe",
        "Cacher les détails d'implémentation",
        "Donner plusieurs comportements à une même méthode",
        "Faire qu'une classe hérite des attributs et méthodes d'une autre classe",
      ],
      answer: "Faire qu'une classe hérite des attributs et méthodes d'une autre classe",
      explanation:
        "L'héritage permet de réutiliser et d'étendre le comportement d'une classe existante.",
    },
    {
      question:
        "[Héritage] Quel mot-clé Python utilise-t-on dans une classe enfant pour appeler une méthode du parent ?",
      options: [
        "parent",
        "self",
        "base()",
        "super()",
      ],
      answer: "super()",
      explanation:
        "super() renvoie un proxy vers la classe parent, permettant d'appeler ses méthodes.",
    },
    {
      question:
        "[Héritage] Que signifie l'héritage multiple en Python ?",
      options: [
        "Une classe peut avoir plusieurs constructeurs",
        "Plusieurs classes peuvent hériter d'une même classe parent",
        "Une méthode peut appeler plusieurs autres méthodes",
        "Une classe peut hériter de plusieurs classes parents",
      ],
      answer: "Une classe peut hériter de plusieurs classes parents",
      explanation:
        "Python supporte l'héritage multiple : class Enfant(Parent1, Parent2).",
    },
    {
      question:
        "[Héritage] Quelle est l'utilité de super().__init__() ?",
      options: [
        "Détruire l'objet parent",
        "Rendre la classe enfant immutable",
        "Déclarer une méthode abstraite",
        "Initialiser les attributs hérités du parent dans l'enfant",
      ],
      answer: "Initialiser les attributs hérités du parent dans l'enfant",
      explanation:
        "super().__init__() appelle le constructeur du parent pour initialiser correctement la partie héritée.",
    },
    {
      question:
        "[Héritage] Que se passe-t-il si l'enfant ne définit pas de méthode __init__ ?",
      options: [
        "L'objet ne peut pas être instancié",
        "L'enfant n'aura aucun attribut",
        "Python lève une erreur",
        "Le constructeur du parent est automatiquement appelé",
      ],
      answer: "Le constructeur du parent est automatiquement appelé",
      explanation:
        "Si l'enfant n'a pas de __init__, Python cherche dans le parent et appelle son constructeur automatiquement.",
    },
    {
      question:
        "[Héritage] Quelle est la différence entre héritage et composition ?",
      options: [
        "Héritage = relation 'a-un', Composition = relation 'est-un'",
        "Ce sont deux noms pour la même chose",
        "Héritage n'existe qu'en Java, composition en Python",
        "Héritage = relation 'est-un', Composition = relation 'a-un'",
      ],
      answer: "Héritage = relation 'est-un', Composition = relation 'a-un'",
      explanation:
        "Héritage : Un Chien EST-UN Animal. Composition : Une Voiture A-UN Moteur.",
    },
    {
      question:
        "[Héritage] Le code suivant pose un problème. Lequel ?\n\nclass Stack(list):\n    def push(self, item):\n        self.append(item)\n    def pop(self):\n        return super().pop()",
      options: [
        "Aucun problème, c'est un bon usage",
        "Stack hérite de list mais ajoute des méthodes qui existent déjà",
        "Il manque l'appel à super().__init__()",
        "Stack hérite de list alors qu'une pile n'est pas une liste (violation LSP)",
      ],
      answer: "Stack hérite de list alors qu'une pile n'est pas une liste (violation LSP)",
      explanation:
        "Une pile a un comportement différent (LIFO) et on peut accéder aux méthodes de list comme insert() qui cassent la logique pile. Composition serait meilleure.",
    },
    {
      question:
        "[Héritage] L'héritage doit être utilisé quand :",
      options: [
        "On veut réutiliser du code à tout prix",
        "On veut éviter d'écrire des interfaces",
        "La classe parent a moins de 10 méthodes",
        "Il existe une relation claire 'est-un' et le comportement est partagé",
      ],
      answer: "Il existe une relation claire 'est-un' et le comportement est partagé",
      explanation:
        "L'héritage est justifié quand il y a une véritable relation 'est-un' et que le comportement est naturellement hérité.",
    },
    {
      question:
        "[Héritage] En Python, toutes les classes héritent implicitement de :",
      options: [
        "type",
        "Base",
        "Any",
        "object",
      ],
      answer: "object",
      explanation:
        "En Python 3, toutes les classes héritent de 'object' (la classe de base universelle).",
    },
    {
      question:
        "[Héritage] L'héritage multiple peut causer quel problème spécifique ?",
      options: [
        "Fuites de mémoire",
        "Impossibilité d'instancier les objets",
        "Perte de l'encapsulation",
        "Diamond problem / conflit de résolution de méthodes",
      ],
      answer: "Diamond problem / conflit de résolution de méthodes",
      explanation:
        "L'héritage multiple peut créer des ambiguïtés si deux parents ont la même méthode. Python résout ça avec l'ordre MRO.",
    },
    {
      question:
        "[Héritage] L'ordre de résolution des méthodes (MRO) en Python détermine :",
      options: [
        "L'ordre dans lequel les attributs sont initialisés",
        "La vitesse d'exécution des méthodes",
        "Le nom des méthodes dans l'enfant",
        "L'ordre dans lequel Python cherche les méthodes dans la hiérarchie d'héritage",
      ],
      answer: "L'ordre dans lequel Python cherche les méthodes dans la hiérarchie d'héritage",
      explanation:
        "Le MRO (Method Resolution Order) définit l'ordre de parcours des classes parentes pour trouver une méthode.",
    },
    {
      question:
        "[Héritage] Le pattern 'Template Method' utilise l'héritage pour :",
      options: [
        "Éviter complètement l'héritage",
        "Injecter des dépendances",
        "Rendre les classes immutables",
        "Définir le squelette d'un algorithme dans une méthode de base, les détails dans les sous-classes",
      ],
      answer: "Définir le squelette d'un algorithme dans une méthode de base, les détails dans les sous-classes",
      explanation:
        "Le Template Method est un bon cas d'usage de l'héritage : le parent définit la structure, les enfants implémentent les variations.",
    },

    // ==================== POLYMORPHISME ====================
    {
      question:
        "[Polymorphisme] Que signifie le polymorphisme en POO ?",
      options: [
        "Une classe peut avoir plusieurs constructeurs",
        "Un objet peut changer de type à l'exécution",
        "Plusieurs classes peuvent partager le même nom",
        "Une même interface (méthode) peut avoir des comportements différents selon l'objet qui l'appelle",
      ],
      answer: "Une même interface (méthode) peut avoir des comportements différents selon l'objet qui l'appelle",
      explanation:
        "Le polymorphisme permet d'appeler la même méthode sur différents types d'objets et d'obtenir des comportements adaptés.",
    },
    {
      question:
        "[Polymorphisme] Quel mécanisme Python illustre le polymorphisme ?",
      options: [
        "Les décorateurs",
        "Les context managers (with)",
        "La surcharge de méthodes (plusieurs méthodes avec le même nom mais paramètres différents)",
        "Le duck typing : si un objet a une méthode 'parler()', on peut l'appeler quel que soit son type",
      ],
      answer: "Le duck typing : si un objet a une méthode 'parler()', on peut l'appeler quel que soit son type",
      explanation:
        "Le duck typing ('si ça marche comme un canard...') est une forme de polymorphisme : on se base sur les méthodes disponibles, pas sur le type.",
    },
    {
      question:
        "[Polymorphisme] L'exemple suivant illustre quel concept ?\n\ndef faire_parler(animal):\n    print(animal.parler())\n\nclass Chien:\n    def parler(self): return 'Woof'\n\nclass Chat:\n    def parler(self): return 'Meow'\n\nfaire_parler(Chien()) # Woof\nfaire_parler(Chat()) # Meow",
      options: [
        "Encapsulation",
        "Héritage",
        "Abstraction",
        "Polymorphisme (duck typing)",
      ],
      answer: "Polymorphisme (duck typing)",
      explanation:
        "La même fonction faire_parler() fonctionne avec des objets de types différents car ils implémentent tous la méthode parler().",
    },
    {
      question:
        "[Polymorphisme] Python ne supporte pas nativement la surcharge de méthodes (plusieurs méthodes avec mêmes nom/signatures différentes). Comment contourne-t-on cela ?",
      options: [
        "En utilisant des décorateurs @overload",
        "C'est impossible en Python",
        "En utilisant des classes abstraites",
        "En utilisant des arguments par défaut ou *args/**kwargs",
      ],
      answer: "En utilisant des arguments par défaut ou *args/**kwargs",
      explanation:
        "Python n'a pas de surcharge de méthodes à la Java. On simule avec des valeurs par défaut, *args, **kwargs, ou isinstance().",
    },
    {
      question:
        "[Polymorphisme] Le 'duck typing' signifie :",
      options: [
        "Tous les objets doivent hériter d'une classe Duck",
        "Il faut toujours vérifier le type avec isinstance()",
        "Les méthodes doivent être déclarées comme 'duck'",
        "Si un objet a les méthodes attendues, on l'utilise sans vérifier son type",
      ],
      answer: "Si un objet a les méthodes attendues, on l'utilise sans vérifier son type",
      explanation:
        "Duck typing : 'Si ça marche comme un canard, que ça nage comme un canard, alors c'est un canard.'",
    },
    {
      question:
        "[Polymorphisme] En Python, le polymorphisme est principalement possible grâce à :",
      options: [
        "La compilation statique",
        "L'absence totale de types",
        "Les décorateurs",
        "Le typage dynamique (les types sont vérifiés à l'exécution, pas à la compilation)",
      ],
      answer: "Le typage dynamique (les types sont vérifiés à l'exécution, pas à la compilation)",
      explanation:
        "Le typage dynamique permet au polymorphisme de fonctionner : on n'a pas besoin de déclarer qu'un objet implémente une interface.",
    },
    {
      question:
        "[Polymorphisme] Comment appelle-t-on le polymorphisme où la méthode appelée est déterminée à l'exécution ?",
      options: [
        "Polymorphisme statique",
        "Polymorphisme d'héritage",
        "Polymorphisme d'interface",
        "Polymorphisme dynamique (late binding)",
      ],
      answer: "Polymorphisme dynamique (late binding)",
      explanation:
        "Le polymorphisme dynamique signifie que la méthode exacte à appeler est déterminée à l'exécution en fonction du type réel de l'objet.",
    },
    {
      question:
        "[Polymorphisme] Avec le duck typing, que se passe-t-il si un objet ne possède pas la méthode attendue ?",
      options: [
        "Python ignore silencieusement l'appel",
        "Python appelle une méthode par défaut",
        "Python convertit automatiquement l'objet",
        "Python lève une AttributeError",
      ],
      answer: "Python lève une AttributeError",
      explanation:
        "Si la méthode n'existe pas, Python lève une AttributeError à l'exécution.",
    },
    {
      question:
        "[Polymorphisme] Le polymorphisme est utile pour :",
      options: [
        "Rendre le code plus rapide",
        "Rendre les classes plus petites",
        "Éviter d'écrire des tests",
        "Écrire du code générique qui fonctionne avec plusieurs types d'objets",
      ],
      answer: "Écrire du code générique qui fonctionne avec plusieurs types d'objets",
      explanation:
        "Le polymorphisme permet d'écrire du code flexible et réutilisable qui ne dépend pas de types concrets.",
    },
    {
      question:
        "[Polymorphisme] Une même méthode de classe peut avoir des comportements différents selon la classe. Cela s'appelle :",
      options: [
        "Héritage simple",
        "Encapsulation",
        "Composition",
        "Polymorphisme de sous-typage",
      ],
      answer: "Polymorphisme de sous-typage",
      explanation:
        "C'est le polymorphisme classique : une méthode déclarée dans une classe parent est redéfinie dans les enfants.",
    },
    {
      question:
        "[Polymorphisme] Lequel n'est PAS un type de polymorphisme reconnu ?",
      options: [
        "Polymorphisme de sous-typage (héritage)",
        "Polymorphisme paramétrique (génériques)",
        "Polymorphisme ad hoc (surcharge)",
        "Polymorphisme quantique",
      ],
      answer: "Polymorphisme quantique",
      explanation:
        "Le polymorphisme quantique n'existe pas. Les trois autres sont des formes classiques de polymorphisme.",
    },
    {
      question:
        "[Polymorphisme] Avec Protocol (typing), on peut :",
      options: [
        "Forcer l'héritage entre classes",
        "Rendre les classes immutables",
        "Créer des singletons",
        "Définir une interface implicite pour le duck typing avec vérification statique (mypy)",
      ],
      answer: "Définir une interface implicite pour le duck typing avec vérification statique (mypy)",
      explanation:
        "Protocol permet de typer statiquement le duck typing : on déclare l'interface attendue sans héritage.",
    },

    // ==================== ABSTRACTION ====================
    {
      question:
        "[Abstraction] Que signifie l'abstraction en POO ?",
      options: [
        "Rendre toutes les méthodes privées",
        "Supprimer les attributs inutiles",
        "Créer des classes sans méthodes",
        "Cacher les détails d'implémentation et ne montrer que l'essentiel",
      ],
      answer: "Cacher les détails d'implémentation et ne montrer que l'essentiel",
      explanation:
        "L'abstraction consiste à masquer la complexité interne et à exposer une interface simple et claire.",
    },
    {
      question:
        "[Abstraction] En Python, une classe abstraite est une classe qui :",
      options: [
        "N'a aucun attribut",
        "Hérite de plusieurs parents",
        "A tous ses attributs privés",
        "Ne peut pas être instanciée directement et contient des méthodes abstraites",
      ],
      answer: "Ne peut pas être instanciée directement et contient des méthodes abstraites",
      explanation:
        "Une classe abstraite sert de modèle pour les classes filles. Elle peut contenir des méthodes abstraites (sans implémentation).",
    },
    {
      question:
        "[Abstraction] Quel module Python permet de créer des classes abstraites ?",
      options: [
        "typing",
        "dataclasses",
        "collections",
        "abc (Abstract Base Classes)",
      ],
      answer: "abc (Abstract Base Classes)",
      explanation:
        "Le module 'abc' fournit ABC et @abstractmethod pour définir des classes abstraites.",
    },
    {
      question:
        "[Abstraction] Que se passe-t-il si on essaie d'instancier une classe abstraite qui a des méthodes abstraites non implémentées ?",
      options: [
        "L'instance est créée mais les méthodes abstraites sont ignorées",
        "Python appelle automatiquement super()",
        "Les méthodes abstraites deviennent des méthodes vides",
        "Python lève une TypeError",
      ],
      answer: "Python lève une TypeError",
      explanation:
        "TypeError: Can't instantiate abstract class X with abstract methods Y. C'est le comportement attendu.",
    },
    {
      question:
        "[Abstraction] Une interface (au sens POO) est :",
      options: [
        "Un type particulier d'héritage multiple",
        "Une classe avec uniquement des attributs",
        "Une méthode sans paramètres",
        "Un contrat définissant quelles méthodes une classe doit implémenter, sans fournir d'implémentation",
      ],
      answer: "Un contrat définissant quelles méthodes une classe doit implémenter, sans fournir d'implémentation",
      explanation:
        "Une interface définit le 'quoi' (les méthodes attendues) sans le 'comment' (l'implémentation).",
    },
    {
      question:
        "[Abstraction] En Python, comment déclare-t-on une méthode abstraite ?",
      options: [
        "def methode(self): pass",
        "def methode(self): raise NotImplementedError",
        "abstract def methode(self)",
        "@abstractmethod\ndef methode(self): pass",
      ],
      answer: "@abstractmethod\ndef methode(self): pass",
      explanation:
        "Le décorateur @abstractmethod du module abc indique que la méthode doit être implémentée dans les sous-classes.",
    },
    {
      question:
        "[Abstraction] Lequel est un bon exemple d'abstraction ?",
      options: [
        "Une classe Utilisateur avec tous ses attributs publics",
        "Une classe qui affiche directement des logs sur la console",
        "Une classe qui contient 500 lignes de code",
        "Une classe DatabaseConnection qui expose connect(), query(), disconnect() mais cache les détails du protocole",
      ],
      answer: "Une classe DatabaseConnection qui expose connect(), query(), disconnect() mais cache les détails du protocole",
      explanation:
        "L'abstraction consiste à cacher la complexité (comment se connecte-t-on ?) derrière une interface simple.",
    },
    {
      question:
        "[Abstraction] Une classe qui hérite d'une classe abstraite DOIT :",
      options: [
        "Avoir le même nombre de méthodes que la classe parent",
        "Appeler super().__init__()",
        "Être elle-même abstraite",
        "Implémenter toutes les méthodes abstraites",
      ],
      answer: "Implémenter toutes les méthodes abstraites",
      explanation:
        "Pour être concrète (instanciable), une sous-classe doit implémenter toutes les méthodes abstraites héritées.",
    },
    {
      question:
        "[Abstraction] La différence principale entre classe abstraite et interface (Protocol) est :",
      options: [
        "Il n'y a pas de différence",
        "Un Protocol ne peut être utilisé qu'avec des classes concrètes",
        "Une classe abstraite ne permet pas l'héritage multiple",
        "Une classe abstraite peut contenir des méthodes implémentées (concrètes), un Protocol non",
      ],
      answer: "Une classe abstraite peut contenir des méthodes implémentées (concrètes), un Protocol non",
      explanation:
        "Une classe abstraite peut avoir un mélange de méthodes abstraites et concrètes. Un Protocol définit juste la structure (interface implicite).",
    },
    {
      question:
        "[Abstraction] Pourquoi utilise-t-on des classes/interfaces abstraites ?",
      options: [
        "Pour améliorer les performances",
        "Pour cacher toutes les méthodes",
        "Pour empêcher totalement l'héritage",
        "Pour définir un contrat que les sous-classes doivent respecter, garantissant une certaine interface",
      ],
      answer: "Pour définir un contrat que les sous-classes doivent respecter, garantissant une certaine interface",
      explanation:
        "L'abstraction via des classes/interfaces garantit que toutes les sous-classes respectent un contrat commun.",
    },
    {
      question:
        "[Abstraction] Une méthode abstraite peut-elle avoir une implémentation par défaut en Python ?",
      options: [
        "Non, @abstractmethod force l'absence d'implémentation",
        "Oui, mais uniquement si la classe parent n'est pas instanciable",
        "Non, Python lève une erreur de syntaxe",
        "Oui, on peut écrire @abstractmethod puis définir un corps, les sous-classes peuvent l'ignorer (mais c'est rare)",
      ],
      answer: "Oui, on peut écrire @abstractmethod puis définir un corps, les sous-classes peuvent l'ignorer (mais c'est rare)",
      explanation:
        "En Python, on peut combiner @abstractmethod avec une implémentation. La sous-classe n'est pas obligée de la surcharger.",
    },
    {
      question:
        "[Abstraction] Le pattern 'Strategy' (défini dans ton cours SOLID) est un exemple d'utilisation de :",
      options: [
        "Héritage pur",
        "Encapsulation stricte",
        "Polymorphisme quantique",
        "Abstraction (on dépend de l'interface, pas de l'implémentation concrète)",
      ],
      answer: "Abstraction (on dépend de l'interface, pas de l'implémentation concrète)",
      explanation:
        "Le Strategy Pattern utilise une abstraction (interface) pour laquelle on peut injecter différentes implémentations concrètes.",
    },
  ],
  avance: [
    {
      question:
        "[POO Avancé] Que fait le mot-clé 'self' dans une méthode d'instance ?",
      options: [
        "C'est un mot-clé réservé pour désigner la classe elle-même",
        "C'est une variable globale accessible dans toute la classe",
        "C'est le constructeur de la classe",
        "C'est une référence à l'instance courante de la classe (l'objet sur lequel on travaille)",
      ],
      answer: "C'est une référence à l'instance courante de la classe (l'objet sur lequel on travaille)",
      explanation:
        "'self' est le premier paramètre de chaque méthode d'instance et fait référence à l'objet lui-même.",
    },
    {
      question:
        "[POO Avancé] À quoi sert la méthode __init__ en Python ?",
      options: [
        "Détruire un objet",
        "Représenter l'objet sous forme de chaîne",
        "Comparer deux objets entre eux",
        "Initialiser les attributs d'une nouvelle instance (constructeur)",
      ],
      answer: "Initialiser les attributs d'une nouvelle instance (constructeur)",
      explanation:
        "__init__ est appelé automatiquement après la création de l'instance pour initialiser son état.",
    },
    {
      question:
        "[POO Avancé] Quelle est la différence entre @classmethod et @staticmethod ?",
      options: [
        "Il n'y a pas de différence",
        "@staticmethod reçoit la classe, @classmethod ne reçoit rien",
        "@classmethod ne peut être utilisé qu'avec des classes abstraites",
        "@classmethod reçoit la classe (cls) en premier paramètre, @staticmethod ne reçoit rien de spécial",
      ],
      answer: "@classmethod reçoit la classe (cls) en premier paramètre, @staticmethod ne reçoit rien de spécial",
      explanation:
        "@classmethod peut accéder/modifier l'état de la classe. @staticmethod est juste une fonction rangée dans la classe.",
    },
    {
      question:
        "[POO Avancé] Que signifie le 'God Object' (anti-pattern) ?",
      options: [
        "Un objet qui ne sert à rien",
        "Un objet trop petit pour être utile",
        "Une classe avec seulement des méthodes statiques",
        "Une classe qui fait tout (trop de responsabilités), violant SRP",
      ],
      answer: "Une classe qui fait tout (trop de responsabilités), violant SRP",
      explanation:
        "Le God Object concentre trop de responsabilités, devenant difficile à maintenir, tester et comprendre.",
    },
    {
      question:
        "[POO Avancé] Pourquoi 'Composition > Héritage' est un mantra en POO ?",
      options: [
        "L'héritage est toujours mauvais",
        "La composition est plus rapide",
        "L'héritage n'existe pas en Python",
        "La composition offre plus de flexibilité (changement à l'exécution, pas de hiérarchie rigide)",
      ],
      answer: "La composition offre plus de flexibilité (changement à l'exécution, pas de hiérarchie rigide)",
      explanation:
        "La composition permet d'assembler des comportements dynamiquement sans créer de hiérarchies figées et souvent trop complexes.",
    },
    {
      question:
        "[POO Avancé] À quoi sert la méthode __str__ ?",
      options: [
        "À créer une nouvelle instance",
        "À détruire l'objet",
        "À définir la représentation 'technique' (utile pour déboguer)",
        "À définir la représentation textuelle 'amicale' de l'objet (print() l'utilise)",
      ],
      answer: "À définir la représentation textuelle 'amicale' de l'objet (print() l'utilise)",
      explanation:
        "__str__ est utilisé par print() et str() pour une représentation lisible par l'utilisateur.",
    },
    {
      question:
        "[POO Avancé] L'Anti-pattern 'Anemic Domain Model' désigne :",
      options: [
        "Une classe avec trop de méthodes",
        "Une classe qui hérite de trop de parents",
        "Une classe sans constructeur",
        "Une classe avec uniquement des attributs (getters/setters) mais aucune logique métier",
      ],
      answer: "Une classe avec uniquement des attributs (getters/setters) mais aucune logique métier",
      explanation:
        "L'Anemic Domain Model est une classe qui sert juste de conteneur de données, la logique métier étant ailleurs.",
    },
    {
      question:
        "[POO Avancé] Comment appelle-t-on une classe qui ne peut pas être instanciée et sert uniquement de modèle ?",
      options: [
        "Classe concrète",
        "Classe statique",
        "Singleton",
        "Classe abstraite",
      ],
      answer: "Classe abstraite",
      explanation:
        "Une classe abstraite définit un contrat pour les sous-classes et ne peut être instanciée directement.",
    },
    {
      question:
        "[POO Avancé] Le pattern 'Factory' est utile pour :",
      options: [
        "Détruire des objets",
        "Trier des collections",
        "Gérer les exceptions",
        "Créer des objets sans exposer la logique d'instanciation au client",
      ],
      answer: "Créer des objets sans exposer la logique d'instanciation au client",
      explanation:
        "Une Factory encapsule la création d'objets, ce qui est utile pour l'OCP (ajouter des types sans modifier le client).",
    },
    {
      question:
        "[POO Avancé] Le pattern 'Singleton' garantit qu'une classe :",
      options: [
        "A au moins deux instances",
        "Peut être héritée",
        "Est immutable",
        "N'a qu'une seule instance",
      ],
      answer: "N'a qu'une seule instance",
      explanation:
        "Le Singleton est un design pattern qui garantit qu'une classe n'a qu'une seule instance globalement accessible.",
    },
    {
      question:
        "[POO Avancé] Pourquoi éviter les getters/setters publics simples (sans logique) en Python ?",
      options: [
        "Parce que Python n'a pas de getters/setters",
        "Parce que ça casse l'encapsulation",
        "Parce que c'est impossible",
        "Parce qu'il vaut mieux exposer directement l'attribut public (Pythonic)",
      ],
      answer: "Parce qu'il vaut mieux exposer directement l'attribut public (Pythonic)",
      explanation:
        "En Python, on utilise directement l'attribut public. Si besoin de logique, on passe à @property sans changer l'interface.",
    },
    {
      question:
        "[POO Avancé] Laquelle de ces affirmations sur 'classmethod' est vraie ?",
      options: [
        "classmethod ne peut pas accéder aux attributs de classe",
        "classmethod reçoit l'instance (self) en premier paramètre",
        "classmethod est identique à staticmethod",
        "classmethod peut être appelée sans instance (sur la classe elle-même)",
      ],
      answer: "classmethod peut être appelée sans instance (sur la classe elle-même)",
      explanation:
        "classmethod s'utilise sur la classe directement (ex: MaClasse.ma_methode_de_classe()). Elle reçoit la classe en premier paramètre (cls).",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE POO] Quelle est la sortie de ce code ?\n\nclass A:\n    def test(self):\n        return 'A'\n\nclass B(A):\n    def test(self):\n        return 'B'\n\nclass C(A):\n    def test(self):\n        return 'C'\n\nclass D(B, C):\n    pass\n\nprint(D().test())",
      options: [
        "'A'",
        "'C'",
        "AttributeError",
        "'B'",
      ],
      answer: "'B'",
      explanation:
        "L'ordre MRO de D est D -> B -> C -> A. Python cherche test() dans B en premier et trouve 'B'. C'est l'ordre de résolution des méthodes (MRO).",
    },
    {
      question:
        "[PIÈGE POO] Que se passe-t-il avec cet attribut de classe mutable ?\n\nclass MaClasse:\n    attribut_partage = []\n\na = MaClasse()\nb = MaClasse()\na.attribut_partage.append(1)\nprint(b.attribut_partage)",
      options: [
        "[]",
        "None",
        "Lève une AttributeError",
        "[1]",
      ],
      answer: "[1]",
      explanation:
        "attribut_partage est un attribut de classe (partagé entre toutes les instances). Modifier via a le modifie aussi pour b.",
    },
    {
      question:
        "[PIÈGE POO] Quelle est la différence entre __str__ et __repr__ ?",
      options: [
        "Il n'y a pas de différence",
        "__str__ est pour les développeurs, __repr__ pour les utilisateurs",
        "__str__ ne peut être utilisé que dans les classes abstraites",
        "__repr__ est pour les développeurs (représentation non ambiguë), __str__ pour les utilisateurs",
      ],
      answer: "__repr__ est pour les développeurs (reprÃ©sentation non ambiguë), __str__ pour les utilisateurs",
      explanation:
        "__repr__ doit être non ambiguë (utile pour déboguer), __str__ est pour l'affichage utilisateur. Si __str__ manque, Python utilise __repr__.",
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
