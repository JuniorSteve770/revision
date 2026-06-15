// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Les classes de données — vue d'ensemble",
    answer:
      "◆ **dataclass** : Python 3.7+, réduit le boilerplate (__init__, __repr__, __eq__) ◆ **NamedTuple** : immutable, léger, comme un tuple avec noms ◆ **attrs** : librairie externe, plus de fonctionnalités ◆ **Pydantic** : validation de données, parsing, typage fort ◆ **@dataclass(frozen=True)** : immutabilité ◆ **field()** : configuration fine des attributs ◆ **__post_init__** : validation post-initialisation ◆ **replace()** : copie modifiée d'un objet frozen",
  },
  {
    question: "Mots-clés dataclass à maîtriser",
    answer:
      "◆ **@dataclass** : décorateur principal ◆ **field()** : paramètres par attribut (default, default_factory, init, repr, compare) ◆ **frozen=True** : objet immutable ◆ **order=True** : génère __lt__, __le__, __gt__, __ge__ ◆ **unsafe_hash=True** : force le calcul du hash ◆ **__post_init__** : validation et normalisation ◆ **replace()** : copie avec modifications ◆ **KW_ONLY** : paramètres nommés obligatoires (Python 3.10+)",
  },
  {
    question: "Code smells Dataclass — les reconnaître",
    answer:
      "◆ **Liste en default** : `items: list = []` → partagée entre instances (utiliser `default_factory=list`) ◆ **Dict mutable** : `mapping: dict = {}` → même problème ◆ **Type manquant** : omission des annotations de type ◆ **Frozen avec dict** : `frozen=True` mais contient un dict mutable ◆ **__post_init__ trop complexe** : contient trop de logique métier ◆ **Héritage mal géré** : ordre des champs dans l'héritage ⚠️ Dataclass = conteneur de données, pas de logique métier complexe",
  },
];

const questions = {
  moyen: [
    // ==================== BASES & DECORATEUR ====================
    {
      question:
        "[Dataclass] Que fait le décorateur @dataclass ?",
      options: [
        "Rend la classe immutable",
        "Génère automatiquement les méthodes __init__, __repr__, __eq__ et autres",
        "Convertit la classe en dictionnaire",
        "Rend la classe abstraite",
      ],
      answer: "Génère automatiquement les méthodes __init__, __repr__, __eq__ et autres",
      explanation:
        "@dataclass génère du code boilerplate comme __init__, __repr__, __eq__, __hash__, etc. selon les paramètres.",
    },
    {
      question:
        "[Dataclass] Quelle version de Python a introduit les dataclasses ?",
      options: [
        "Python 3.5",
        "Python 3.6",
        "Python 3.7",
        "Python 3.8",
      ],
      answer: "Python 3.7",
      explanation:
        "Les dataclasses ont été introduites en Python 3.7 via la PEP 557. Elles sont disponibles dans le module 'dataclasses'.",
    },
    {
      question:
        "[Dataclass] Quelle est la syntaxe correcte pour définir une dataclass ?",
      options: [
        "class Point: x: int, y: int",
        "@data class Point: x: int, y: int",
        "@dataclass\nclass Point:\n    x: int\n    y: int",
        "dataclass Point(x: int, y: int)",
      ],
      answer: "@dataclass\nclass Point:\n    x: int\n    y: int",
      explanation:
        "On utilise le décorateur @dataclass avant la définition de la classe, avec des attributs typés.",
    },
    {
      question:
        "[Dataclass] Que génère automatiquement @dataclass par défaut ?",
      options: [
        "__init__, __str__, __len__",
        "__init__, __repr__, __eq__",
        "__new__, __del__, __hash__",
        "__add__, __sub__, __mul__",
      ],
      answer: "__init__, __repr__, __eq__",
      explanation:
        "Par défaut, @dataclass génère __init__, __repr__, et __eq__. On peut ajouter d'autres méthodes avec des paramètres.",
    },
    {
      question:
        "[Dataclass] Dans une dataclass, comment déclarer un attribut avec une valeur par défaut ?",
      options: [
        "nom: str = default('Jean')",
        "nom: str = field(default='Jean')",
        "nom: str = 'Jean'",
        "nom = 'Jean'",
      ],
      answer: "nom: str = 'Jean'",
      explanation:
        "On peut assigner directement une valeur par défaut comme dans une classe normale. field() est utile pour plus de contrôle.",
    },
    {
      question:
        "[Dataclass] Que se passe-t-il si on utilise une liste mutable comme valeur par défaut ?\n\n@dataclass\nclass Panier:\n    items: list = []",
      options: [
        "C'est parfait, chaque instance a sa propre liste",
        "Python lève une erreur TypeError",
        "La liste est partagée entre toutes les instances (bug classique)",
        "La liste est automatiquement convertie en tuple immutable",
      ],
      answer: "La liste est partagée entre toutes les instances (bug classique)",
      explanation:
        "Comme en Python standard, les valeurs par défaut mutables sont partagées. Solution : items: list = field(default_factory=list).",
    },
    {
      question:
        "[Dataclass] Comment corriger le problème de la liste mutable partagée ?",
      options: [
        "items: list = []  # ça passe",
        "items: list = None",
        "items: list = field(default=list)",
        "items: list = field(default_factory=list)",
      ],
      answer: "items: list = field(default_factory=list)",
      explanation:
        "field(default_factory=list) crée une nouvelle liste pour chaque instance. C'est la solution standard.",
    },
    {
      question:
        "[Dataclass] À quoi sert la fonction field() dans une dataclass ?",
      options: [
        "À créer une clé étrangère vers une autre table",
        "À configurer finement un attribut (default_factory, init, repr, compare, etc.)",
        "À déclarer un champ calculé",
        "À rendre un attribut privé",
      ],
      answer: "À configurer finement un attribut (default_factory, init, repr, compare, etc.)",
      explanation:
        "field() permet de personnaliser le comportement de chaque attribut : exclusion du __init__, du __repr__, comparaison, etc.",
    },
    {
      question:
        "[Dataclass] Que fait le paramètre init=False dans field() ?",
      options: [
        "L'attribut n'apparaît pas dans le constructeur __init__",
        "L'attribut est initialisé à None",
        "L'attribut est supprimé après l'initialisation",
        "L'attribut devient en lecture seule",
      ],
      answer: "L'attribut n'apparaît pas dans le constructeur __init__",
      explanation:
        "init=False signifie que l'attribut ne sera pas un paramètre du __init__ généré. Il doit avoir une valeur par défaut.",
    },
    {
      question:
        "[Dataclass] À quoi sert le paramètre repr=False dans field() ?",
      options: [
        "L'attribut est exclus de la représentation __repr__",
        "L'attribut ne peut pas être affiché",
        "L'attribut est supprimé du dictionnaire de l'objet",
        "L'attribut devient privé",
      ],
      answer: "L'attribut est exclus de la représentation __repr__",
      explanation:
        "repr=False permet d'exclure certains attributs du __repr__ (utile pour éviter d'afficher des données volumineuses ou sensibles).",
    },
    {
      question:
        "[Dataclass] Avec order=True, quelles méthodes sont générées ?",
      options: [
        "__lt__, __le__, __gt__, __ge__ uniquement",
        "__eq__ et __hash__",
        "__lt__, __le__, __eq__, __ne__, __gt__, __ge__",
        "Aucune, il faut les écrire manuellement",
      ],
      answer: "__lt__, __le__, __eq__, __ne__, __gt__, __ge__",
      explanation:
        "order=True génère toutes les méthodes de comparaison : __lt__, __le__, __eq__, __ne__, __gt__, __ge__.",
    },
    {
      question:
        "[Dataclass] Que fait frozen=True dans @dataclass ?",
      options: [
        "L'objet ne peut pas être modifié après création (attributs en lecture seule)",
        "La classe ne peut pas être héritée",
        "La classe ne peut pas être instanciée",
        "Les attributs sont automatiquement convertis en float",
      ],
      answer: "L'objet ne peut pas être modifié après création (attributs en lecture seule)",
      explanation:
        "frozen=True rend l'instance immutable : on ne peut pas réassigner les attributs après __init__.",
    },

    // ==================== NAMEDTUPLE ====================
    {
      question:
        "[NamedTuple] Qu'est-ce qu'un NamedTuple en Python ?",
      options: [
        "Un tuple avec des noms pour chaque élément, immutable et léger",
        "Une dataclass dépréciée",
        "Une classe spéciale pour les bases de données",
        "Un tuple avec des méthodes supplémentaires",
      ],
      answer: "Un tuple avec des noms pour chaque élément, immutable et léger",
      explanation:
        "NamedTuple combine les avantages du tuple (immutabilité, légèreté) avec des noms d'attributs pour plus de clarté.",
    },
    {
      question:
        "[NamedTuple] Comment créer un NamedTuple nommé 'Point' avec x et y ?",
      options: [
        "NamedTuple('Point', x=int, y=int)",
        "class Point(NamedTuple):\n    x: int\n    y: int",
        "Point = namedtuple('Point', x, y)",
        "from typing import NamedTuple\nPoint = NamedTuple('Point', [('x', int), ('y', int)])",
      ],
      answer: "class Point(NamedTuple):\n    x: int\n    y: int",
      explanation:
        "La syntaxe recommandée est d'hériter de NamedTuple avec des attributs typés. La version fonctionnelle namedtuple existe aussi.",
    },
    {
      question:
        "[NamedTuple] Quelle est la principale différence de performance entre NamedTuple et dataclass ?",
      options: [
        "NamedTuple est plus lent car immutable",
        "Dataclass est plus lent car génère plus de code",
        "NamedTuple est généralement plus léger et plus rapide car basé sur tuple",
        "Il n'y a pas de différence notable",
      ],
      answer: "NamedTuple est généralement plus léger et plus rapide car basé sur tuple",
      explanation:
        "NamedTuple hérite de tuple, donc il a l'empreinte mémoire et les performances d'un tuple standard.",
    },
    {
      question:
        "[NamedTuple] Un NamedTuple est-il mutable ou immutable ?",
      options: [
        "Mutable comme une liste",
        "Mutable mais avec restrictions",
        "Immutable (on ne peut pas modifier les attributs après création)",
        "Dépend du paramètre frozen",
      ],
      answer: "Immutable (on ne peut pas modifier les attributs après création)",
      explanation:
        "NamedTuple hérite de tuple qui est immutable. Les attributs ne peuvent pas être modifiés après la création de l'instance.",
    },
    {
      question:
        "[NamedTuple] Quand faut-il préférer NamedTuple à dataclass ?",
      options: [
        "Quand on a besoin d'héritage multiple",
        "Quand on a besoin de validation des données",
        "Quand on veut un conteneur très léger, immutable, et qu'on veut exploiter les avantages des tuples (hashable, ordonné)",
        "Jamais, dataclass est toujours meilleur",
      ],
      answer: "Quand on veut un conteneur très léger, immutable, et qu'on veut exploiter les avantages des tuples (hashable, ordonné)",
      explanation:
        "NamedTuple est idéal pour des clés de dictionnaire, des retours de fonction simples, des structures immutable très légères.",
    },

    // ==================== POST_INIT & VALIDATION ====================
    {
      question:
        "[__post_init__] À quoi sert la méthode __post_init__ dans une dataclass ?",
      options: [
        "À définir des actions après la sauvegarde en base de données",
        "À exécuter du code après l'initialisation (validation, normalisation, calculs dérivés)",
        "À initialiser les attributs avant le constructeur",
        "À détruire l'objet",
      ],
      answer: "À exécuter du code après l'initialisation (validation, normalisation, calculs dérivés)",
      explanation:
        "__post_init__ est appelé automatiquement après __init__. C'est l'endroit idéal pour la validation et les calculs dérivés.",
    },
    {
      question:
        "[__post_init__] Dans quel ordre sont exécutés __init__ et __post_init__ ?",
      options: [
        "__post_init__ puis __init__",
        "Seul __post_init__ existe, __init__ n'est pas généré",
        "__init__ est exécuté, puis __post_init__ est appelé automatiquement",
        "L'ordre dépend de frozen=True",
      ],
      answer: "__init__ est exécuté, puis __post_init__ est appelé automatiquement",
      explanation:
        "@dataclass génère __init__ qui initialise les attributs, puis appelle automatiquement __post_init__ s'il existe.",
    },
    {
      question:
        "[__post_init__] Pourquoi utiliser __post_init__ plutôt que de mettre la validation directement dans __init__ ?",
      options: [
        "Parce que __post_init__ est plus rapide",
        "Parce que __post_init__ permet d'accéder à super() facilement",
        "Parce que __post_init__ est appelée automatiquement et permet de centraliser la post-logique sans surcharger __init__",
        "Parce que __init__ n'existe pas dans les dataclasses",
      ],
      answer: "Parce que __post_init__ est appelée automatiquement et permet de centraliser la post-logique sans surcharger __init__",
      explanation:
        "__post_init__ est un hook standardisé. Si on surcharge __init__ manuellement, on perd l'avantage de la génération automatique.",
    },
    {
      question:
        "[__post_init__] Comment accéder à un attribut dans __post_init__ ?",
      options: [
        "Uniquement via self.__dict__",
        "Directement via self.nom_attribut",
        "Via des paramètres passés à __post_init__",
        "Ce n'est pas possible",
      ],
      answer: "Directement via self.nom_attribut",
      explanation:
        "__post_init__ est une méthode d'instance normale. On accède aux attributs via self, comme dans toute méthode.",
    },
    {
      question:
        "[Validation] Comment implémenter une validation simple dans une dataclass ?",
      options: [
        "Utiliser un décorateur @validate avant @dataclass",
        "Mettre des assertions directement dans __post_init__",
        "Créer une méthode validate() à appeler manuellement",
        "La validation n'est pas possible avec dataclass",
      ],
      answer: "Mettre des assertions directement dans __post_init__",
      explanation:
        "La validation est souvent placée dans __post_init__ avec des assert ou des if qui lèvent ValueError.",
    },
    {
      question:
        "[Validation] Dans une dataclass frozen, où placer la validation ?",
      options: [
        "Dans __init__ (surchargé)",
        "Dans __setattr__",
        "Dans __post_init__ avec object.__setattr__ pour les champs calculés",
        "La validation est impossible avec frozen=True",
      ],
      answer: "Dans __post_init__ avec object.__setattr__ pour les champs calculés",
      explanation:
        "Avec frozen=True, __post_init__ peut valider et utiliser object.__setattr__ pour créer des champs dérivés.",
    },

    // ==================== FROZEN & IMMUTABILITE ====================
    {
      question:
        "[Frozen] Que se passe-t-il si on essaie de modifier un attribut d'une dataclass frozen ?",
      options: [
        "La modification est ignorée silencieusement",
        "Python lève une TypeError",
        "Python lève une FrozenInstanceError",
        "L'attribut est automatiquement débloqué",
      ],
      answer: "Python lève une FrozenInstanceError",
      explanation:
        "frozen=True rend les instances immutables. Toute tentative de réassignation d'attribut lève FrozenInstanceError.",
    },
    {
      question:
        "[Frozen] Comment 'modifier' un objet frozen (créer une copie modifiée) ?",
      options: [
        "def __setattr__ override",
        "Utiliser la fonction replace() du module dataclasses",
        "Convertir en dict, modifier, recréer",
        "C'est impossible",
      ],
      answer: "Utiliser la fonction replace() du module dataclasses",
      explanation:
        "replace(objet, attribut=nouvelle_valeur) crée une copie avec l'attribut modifié. L'original reste inchangé.",
    },
    {
      question:
        "[Frozen] Pourquoi dit-on que frozen=True offre une thread-safety implicite ?",
      options: [
        "Parce que les objets frozen ne peuvent pas être partagés entre threads",
        "Parce que les objets frozen ne peuvent pas être modifiés, donc pas besoin de lock",
        "Parce que Python gère automatiquement les locks",
        "Parce que frozen désactive le GIL",
      ],
      answer: "Parce que les objets frozen ne peuvent pas être modifiés, donc pas besoin de lock",
      explanation:
        "Aucun thread ne peut modifier un objet frozen. On peut les partager sans risque de race condition.",
    },
    {
      question:
        "[Frozen] Peut-on utiliser un objet frozen comme clé de dictionnaire ?",
      options: [
        "Oui, si tous ses attributs sont hashables",
        "Non, frozen n'implique pas hashable",
        "Oui, mais uniquement si order=True",
        "Non, les dataclasses ne sont jamais hashables",
      ],
      answer: "Oui, si tous ses attributs sont hashables",
      explanation:
        "frozen=True rend l'objet hashable si tous ses attributs le sont. On peut alors l'utiliser comme clé de dict.",
    },
    {
      question:
        "[Frozen] Y a-t-il un piège avec frozen=True et un attribut de type dict ?",
      options: [
        "Non, dict est immutable avec frozen",
        "Oui, frozen empêche la réassignation du dict, mais son contenu reste modifiable",
        "Python lève une erreur à la définition",
        "Le dict est automatiquement converti en MappingProxyType",
      ],
      answer: "Oui, frozen empêche la réassignation du dict, mais son contenu reste modifiable",
      explanation:
        "Piège classique : frozen=True bloque p.ma_dict = {...}, mais p.ma_dict['cle'] = valeur fonctionne. Attention !",
    },

    // ==================== HERITAGE & DATACLASS ====================
    {
      question:
        "[Héritage] Une dataclass peut-elle hériter d'une autre dataclass ?",
      options: [
        "Non, les dataclasses ne supportent pas l'héritage",
        "Oui, mais l'ordre des champs peut être surprenant",
        "Oui, parfaitement, sans aucune subtilité",
        "Oui, mais uniquement avec frozen=True",
      ],
      answer: "Oui, mais l'ordre des champs peut être surprenant",
      explanation:
        "L'héritage fonctionne, mais l'ordre des champs dans __init__ est : champs du parent (dans leur ordre), puis champs de l'enfant.",
    },
    {
      question:
        "[Héritage] Que se passe-t-il si l'enfant redéfinit un attribut avec une valeur par défaut différente ?",
      options: [
        "Python lève une erreur",
        "La valeur de l'enfant écrase celle du parent",
        "Les deux valeurs coexistent",
        "La valeur du parent est prioritaire",
      ],
      answer: "La valeur de l'enfant écrase celle du parent",
      explanation:
        "L'attribut redéfini dans l'enfant remplace celui du parent. C'est un comportement standard de l'héritage.",
    },

    // ==================== PYDANTIC ====================
    {
      question:
        "[Pydantic] À quoi sert principalement Pydantic ?",
      options: [
        "À remplacer completement les dataclasses",
        "À la validation automatique des données et au parsing de types",
        "À la création d'interfaces graphiques",
        "À l'optimisation des performances",
      ],
      answer: "À la validation automatique des données et au parsing de types",
      explanation:
        "Pydantic est spécialisé dans la validation de données et la conversion de types. C'est la librairie derrière FastAPI.",
    },
    {
      question:
        "[Pydantic] Comment définit-on un modèle Pydantic simple ?",
      options: [
        "@pydantic\nclass User: name: str, age: int",
        "@dataclass\nclass User(BaseModel): name: str; age: int",
        "from pydantic import BaseModel\nclass User(BaseModel):\n    name: str\n    age: int",
        "class User(PydanticModel): name: str, age: int",
      ],
      answer: "from pydantic import BaseModel\nclass User(BaseModel):\n    name: str\n    age: int",
      explanation:
        "Un modèle Pydantic hérite de BaseModel et utilise des annotations de type. La validation est automatique.",
    },
    {
      question:
        "[Pydantic] Que fait Pydantic si on passe une chaîne '123' à un champ de type int ?",
      options: [
        "Lève une erreur de validation",
        "Ignore la valeur",
        "Convertit automatiquement '123' en 123 (parsing intelligent)",
        "Stocke la chaîne telle quelle",
      ],
      answer: "Convertit automatiquement '123' en 123 (parsing intelligent)",
      explanation:
        "Pydantic fait du parsing automatique : '123' devient 123, 'true' devient True, etc. C'est très pratique pour les données externes.",
    },
    {
      question:
        "[Pydantic] Comment valider qu'un email a un format correct dans Pydantic ?",
      options: [
        "from pydantic import EmailStr\ndans le champ: email: EmailStr",
        "email: str(validator='email')",
        "@validate_email\ndef email(self): pass",
        "C'est impossible, il faut une bibliothèque externe",
      ],
      answer: "from pydantic import EmailStr\ndans le champ: email: EmailStr",
      explanation:
        "Pydantic fournit des types spéciaux comme EmailStr, HttpUrl, UUID, etc. pour des validations prêtes à l'emploi.",
    },
    {
      question:
        "[Pydantic] Quelle méthode Pydantic valide et crée une instance à partir d'un dict ?",
      options: [
        "User.build(donnees)",
        "User.from_dict(donnees)",
        "User(donnees)",
        "User.parse_obj(donnees)",
      ],
      answer: "User.parse_obj(donnees)",
      explanation:
        "parse_obj() est la méthode standard pour créer un modèle à partir d'un dictionnaire. User(**dict) fonctionne aussi.",
    },
    {
      question:
        "[Pydantic] À quoi sert @validator dans Pydantic ?",
      options: [
        "À définir une validation personnalisée sur un champ",
        "À déclarer une méthode de classe",
        "À rendre un champ optionnel",
        "À définir la valeur par défaut d'un champ",
      ],
      answer: "À définir une validation personnalisée sur un champ",
      explanation:
        "@validator permet d'écrire des règles de validation complexes qui ne sont pas couvertes par les types standards.",
    },
  ],
  avance: [
    {
      question:
        "[Dataclass Avancé] Comment exclure un attribut de la comparaison __eq__ ?",
      options: [
        "compare=False dans field()",
        "eq=False dans field()",
        "exclude_from_eq=True",
        "ignore_compare=True",
      ],
      answer: "compare=False dans field()",
      explanation:
        "field(compare=False) exclut l'attribut des méthodes de comparaison générées (__eq__, __lt__, etc.).",
    },
    {
      question:
        "[Dataclass Avancé] Comment rendre un attribut optionnel avec une valeur par défaut None ?",
      options: [
        "nom: Optional[str] = None",
        "nom: str | None",
        "nom = field(default=None)",
        "nom: str = None",
      ],
      answer: "nom: Optional[str] = None",
      explanation:
        "L'annotation Optional[str] ou str | None avec = None est la façon standard de rendre un attribut optionnel.",
    },
    {
      question:
        "[Dataclass Avancé] Que signifie KW_ONLY dans une dataclass (Python 3.10+) ?",
      options: [
        "Tous les attributs deviennent des mots-clés",
        "Les attributs après KW_ONLY doivent être passés comme arguments nommés au constructeur",
        "Les attributs deviennent privés",
        "Les attributs sont exclus du __repr__",
      ],
      answer: "Les attributs après KW_ONLY doivent être passés comme arguments nommés au constructeur",
      explanation:
        "KW_ONLY (from dataclasses import KW_ONLY) force les paramètres suivants à être nommés, améliorant la clarté des appels.",
    },
    {
      question:
        "[Dataclass Avancé] Comment créer une copie superficielle d'une dataclass ?",
      options: [
        "copy.copy(objet)",
        "objet.copy()",
        "dataclasses.copy(objet)",
        "replace(objet) sans paramètres",
      ],
      answer: "copy.copy(objet)",
      explanation:
        "copy.copy() fonctionne sur les dataclasses. replace() sans paramètres crée aussi une copie, mais est plus spécifique.",
    },
    {
      question:
        "[Dataclass Avancé] Y a-t-il un moyen d'avoir une dataclass avec des attributs privés (convention _attribut) ?",
      options: [
        "Non, les dataclasses n'acceptent pas les attributs privés",
        "Oui, mais ils doivent être dans le __init__",
        "Oui, on peut utiliser _attribut: int = field(init=False)",
        "Oui, avec __attribut (double underscore)",
      ],
      answer: "Oui, on peut utiliser _attribut: int = field(init=False)",
      explanation:
        "On peut déclarer des attributs avec underscore, souvent avec init=False pour qu'ils ne soient pas dans le constructeur.",
    },
    {
      question:
        "[Dataclass Avancé] Quelle est la différence entre asdict() et astuple() ?",
      options: [
        "asdict() retourne un dict, astuple() retourne un tuple",
        "asdict() retourne un tuple, astuple() retourne un dict",
        "asdict() convertit en JSON, astuple() en base de données",
        "Aucune différence",
      ],
      answer: "asdict() retourne un dict, astuple() retourne un tuple",
      explanation:
        "dataclasses.asdict() convertit en dictionnaire récursivement. dataclasses.astuple() convertit en tuple.",
    },
    {
      question:
        "[NamedTuple Avancé] Un NamedTuple peut-il avoir des méthodes ?",
      options: [
        "Non, seulement des attributs",
        "Oui, comme une classe normale",
        "Oui, mais uniquement des méthodes statiques",
        "Oui, mais elles ne peuvent pas accéder aux attributs",
      ],
      answer: "Oui, comme une classe normale",
      explanation:
        "NamedTuple est une classe comme une autre. On peut lui ajouter des méthodes (ex: ._replace(), ou méthodes personnalisées).",
    },
    {
      question:
        "[NamedTuple Avancé] Comment créer un NamedTuple avec des valeurs par défaut ?",
      options: [
        "Point = namedtuple('Point', ['x', 'y'], defaults=[0, 0])",
        "class Point(NamedTuple):\n    x: int = 0\n    y: int = 0",
        "Les deux syntaxes sont possibles",
        "Aucune des deux",
      ],
      answer: "Les deux syntaxes sont possibles",
      explanation:
        "La syntaxe de classe avec valeurs par défaut est plus lisible. La version fonctionnelle accepte defaults=[...].",
    },
    {
      question:
        "[Pydantic Avancé] Comment définir une validation au niveau du modèle entier (entre plusieurs champs) ?",
      options: [
        "@validator sur la classe",
        "@root_validator",
        "@model_validator (Pydantic v2)",
        "@field_validator avec multiple champs",
      ],
      answer: "@model_validator (Pydantic v2)",
      explanation:
        "Pydantic v2 utilise @model_validator pour les validations qui impliquent plusieurs champs. V1 utilisait @root_validator.",
    },
    {
      question:
        "[Pydantic Avancé] Que fait ConfigDict dans un modèle Pydantic ?",
      options: [
        "Configure la connexion à la base de données",
        "Permet de définir des options globales comme frozen, extra, populate_by_name",
        "Définit les routes API",
        "Configure le logging",
      ],
      answer: "Permet de définir des options globales comme frozen, extra, populate_by_name",
      explanation:
        "class Config: (v1) ou model_config = ConfigDict(...) (v2) permet de configurer le comportement du modèle.",
    },
    {
      question:
        "[Performance] Entre dataclass simple, NamedTuple, et Pydantic, lequel est le plus rapide pour la création d'objets ?",
      options: [
        "Pydantic (très optimisé)",
        "Dataclass (génération Python pure)",
        "NamedTuple (basé sur tuple, très léger)",
        "Ils ont des performances similaires",
      ],
      answer: "NamedTuple (basé sur tuple, très léger)",
      explanation:
        "NamedTuple est le plus léger car basé sur tuple, une structure C native. Dataclass est moyen. Pydantic est plus lent à la création car fait de la validation.",
    },
    {
      question:
        "[Bonnes pratiques] Que dit la PEP 557 sur l'utilisation des dataclasses ?",
      options: [
        "Elles doivent être utilisées pour toutes les classes",
        "Elles sont principalement pour des classes qui sont principalement des conteneurs de données avec peu de logique",
        "Elles remplacent totalement les classes normales",
        "Elles sont dépréciées depuis Python 3.10",
      ],
      answer: "Elles sont principalement pour des classes qui sont principalement des conteneurs de données avec peu de logique",
      explanation:
        "Les dataclasses sont conçues pour les classes qui stockent principalement des données. Pour de la logique complexe, une classe normale est plus adaptée.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE Dataclass] Quelle est la sortie de ce code ?\n\n@dataclass\nclass Parent:\n    x: int = 1\n\n@dataclass\nclass Enfant(Parent):\n    y: int = 2\n\nprint(Enfant())",
      options: [
        "Enfant(x=1, y=2)",
        "Enfant(y=2)",
        "Parent(x=1)",
        "Erreur TypeError",
      ],
      answer: "Enfant(x=1, y=2)",
      explanation:
        "L'enfant hérite de l'attribut x du parent. Les valeurs par défaut sont conservées. L'ordre est : champs du parent, puis champs de l'enfant.",
    },
    {
      question:
        "[PIÈGE Dataclass] Que se passe-t-il avec cet héritage problématique ?\n\n@dataclass\nclass Parent:\n    x: int\n\n@dataclass\nclass Enfant(Parent):\n    y: int = 2",
      options: [
        "Tout fonctionne normalement",
        "Erreur : les attributs sans défaut (x) ne peuvent pas suivre des attributs avec défaut (y) dans le __init__",
        "Erreur : héritage impossible avec dataclass",
        "x prend automatiquement la valeur 0",
      ],
      answer: "Erreur : les attributs sans défaut (x) ne peuvent pas suivre des attributs avec défaut (y) dans le __init__",
      explanation:
        "L'ordre des paramètres dans __init__ est : x (Parent, sans défaut), puis y (Enfant, avec défaut). C'est invalide car un paramètre sans défaut ne peut pas suivre un paramètre avec défaut.",
    },
    {
      question:
        "[PIÈGE Dataclass] Comment corriger l'erreur précédente (attribut sans défaut après attribut avec défaut) ?",
      options: [
        "Mettre y: int = 2 avant x: int",
        "Donner une valeur par défaut à x (x: int = 0)",
        "Réorganiser l'ordre d'héritage",
        "Utiliser field(default=0) sur x",
      ],
      answer: "Donner une valeur par défaut à x (x: int = 0)",
      explanation:
        "En donnant une valeur par défaut à x, tous les paramètres ont des défauts, résolvant le problème d'ordre.",
    },
    {
      question:
        "[PIÈGE Frozen + Dict] Ce code est-il vraiment immutable ?\n\n@dataclass(frozen=True)\nclass Configuration:\n    params: dict[str, int]\n\nconfig = Configuration({'a': 1})\nconfig.params['b'] = 2\nprint(config.params)",
      options: [
        "Lève FrozenInstanceError",
        "Affiche {'a': 1}",
        "Affiche {'a': 1, 'b': 2} (le dict a été modifié)",
        "Affiche None",
      ],
      answer: "Affiche {'a': 1, 'b': 2} (le dict a été modifié)",
      explanation:
        "Piège classique : frozen=True empêche config.params = {...}, mais pas config.params['b'] = 2. Le dict reste mutable.",
    },
    {
      question:
        "[PIÈGE Default Factory] Quelle est la sortie de ce code ?\n\n@dataclass\nclass Panier:\n    items: list = field(default_factory=list)\n\na = Panier()\nb = Panier()\na.items.append('pomme')\nprint(b.items)",
      options: [
        "['pomme']",
        "[]",
        "None",
        "Erreur AttributeError",
      ],
      answer: "[]",
      explanation:
        "default_factory=list crée une nouvelle liste pour chaque instance. a et b ont des listes indépendantes. C'est le comportement voulu.",
    },
    {
      question:
        "[PIÈGE Dataclass vs NamedTuple] Que se passe-t-il quand on modifie un attribut d'un NamedTuple ?",
      options: [
        "La modification réussit silencieusement",
        "Lève AttributeError",
        "Lève TypeError",
        "Convertit automatiquement en dataclass",
      ],
      answer: "Lève AttributeError",
      explanation:
        "NamedTuple est immutable. Tenter de modifier un attribut lève AttributeError: can't set attribute.",
    },
    {
      question:
        "[PIÈGE MRO] Quel est l'ordre des champs dans __init__ avec cette hiérarchie ?\n\n@dataclass\nclass A:\n    a: int\n\n@dataclass\nclass B(A):\n    b: int\n\n@dataclass\nclass C(A):\n    c: int\n\n@dataclass\nclass D(B, C):\n    d: int",
      options: [
        "a, b, c, d",
        "a, b, d, c",
        "a, c, b, d",
        "b, c, a, d",
      ],
      answer: "a, b, c, d",
      explanation:
        "L'ordre des champs dans une dataclass avec héritage multiple suit l'ordre MRO. Les champs de A (ancêtre commun) apparaissent une seule fois au début.",
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
