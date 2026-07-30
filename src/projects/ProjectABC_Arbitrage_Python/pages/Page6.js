// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Les 3 bibliothèques de classes de données — vue d'ensemble",
    answer:
      "◆ **dataclasses** : module standard Python 3.7+ — léger, intégré, sans dépendances ◆ **attrs** : bibliothèque externe mature — plus de fonctionnalités que dataclasses, décorateurs puissants, validators ◆ **Pydantic** : validation et parsing de données — idéal pour API, configs, données externes ◆ **Quand choisir ?** : dataclasses = projet simple sans dépendance, attrs = besoin de features avancées, Pydantic = validation/parsing de données externes ⚠️ Les 3 partagent le même concept : réduire le boilerplate des classes de données",
  },
  {
    question: "Comparaison des fonctionnalités principales",
    answer:
      "◆ **__init__ auto** : ✅ attrs, ✅ dataclasses, ✅ Pydantic ◆ **Validateurs** : ✅ attrs (validators), ✅ Pydantic (@validator), ❌ dataclasses (__post_init__ manuel) ◆ **Parsing type** : ❌ attrs, ❌ dataclasses, ✅ Pydantic (auto-conversion) ◆ **Immutabilité** : ✅ attrs (frozen=True), ✅ dataclasses (frozen=True), ✅ Pydantic (frozen=True) ◆ **Sérialisation JSON** : ❌ attrs (via cattrs), ❌ dataclasses (manuelle), ✅ Pydantic (.model_dump_json()) ◆ **Performance** : dataclasses ≈ attrs > Pydantic (plus lent à l'instanciation)",
  },
  {
    question: "Cas d'usage — quand choisir quoi ?",
    answer:
      "◆ **dataclasses** : projet standard, pas de dépendances externes, usage simple ◆ **attrs** : projet nécessitant des features avancées (validators, converters, slots), code legacy ◆ **Pydantic** : API REST (FastAPI), validation de données externes (JSON, YAML, env), parsing automatique ◆ **Règle simple** : données internes = dataclasses/attrs, données externes = Pydantic ◆ **Migration** : dataclasses → attrs → Pydantic (si besoin de validation forte)",
  },
  {
    question: "Mots-clés et syntaxes à retenir",
    answer:
      "◆ **dataclasses** : `@dataclass`, `field()`, `frozen=True`, `__post_init__` ◆ **attrs** : `@define` (ou `@attr.s`), `field()` (ou `attr.ib`), `validators=`, `converter=`, `slots=True` ◆ **Pydantic v2** : `BaseModel`, `Field()`, `@field_validator`, `@model_validator`, `model_dump()`, `model_dump_json()` ◆ **Common** : tous supportent `frozen=True` pour l'immutabilité",
  },
  {
    question: "Pièges courants à éviter",
    answer:
      "◆ **default mutable** : `[]` ou `{}` en valeur par défaut → partagé (utiliser `field(default_factory=list)`) ◆ **Pydantic + Optional** : utiliser `Optional[str] = None` ou `str | None = None` ◆ **attrs validators** : ne pas oublier d'importer `attrs.validators` ◆ **dataclasses héritage** : attention à l'ordre des champs ◆ **Pydantic v1 vs v2** : syntaxe différente (`@validator` vs `@field_validator`, `Config` vs `ConfigDict`)",
  },
  {
    question: "Import et installation — résumé",
    answer:
      "◆ **dataclasses** : `from dataclasses import dataclass, field` — intégré, pas d'installation ◆ **attrs** : `pip install attrs` puis `from attrs import define, field` ◆ **Pydantic** : `pip install pydantic` puis `from pydantic import BaseModel, Field, field_validator` ◆ **Version conseillée** : dataclasses (Python 3.7+), attrs (21.4+), Pydantic v2 (2.0+) ⚠️ Pydantic v2 a changé beaucoup de syntaxe par rapport à v1",
  },

  {
    question: "Les 3 bibliothèques de classes de données — vue d'ensemble",
    answer:
      "◆ **dataclasses** : module standard Python 3.7+ — léger, intégré, sans dépendances ◆ **attrs** : bibliothèque externe mature — plus de fonctionnalités que dataclasses, décorateurs puissants, validators ◆ **Pydantic** : validation et parsing de données — idéal pour API, configs, données externes ◆ **Quand choisir ?** : dataclasses = projet simple sans dépendance, attrs = besoin de features avancées, Pydantic = validation/parsing de données externes ⚠️ Les 3 partagent le même concept : réduire le boilerplate des classes de données",
  },
  {
    question: "Comparaison des fonctionnalités principales",
    answer:
      "◆ **__init__ auto** : ✅ attrs, ✅ dataclasses, ✅ Pydantic ◆ **Validateurs** : ✅ attrs (validators), ✅ Pydantic (@validator), ❌ dataclasses (__post_init__ manuel) ◆ **Parsing type** : ❌ attrs, ❌ dataclasses, ✅ Pydantic (auto-conversion) ◆ **Immutabilité** : ✅ attrs (frozen=True), ✅ dataclasses (frozen=True), ✅ Pydantic (frozen=True) ◆ **Sérialisation JSON** : ❌ attrs (via cattrs), ❌ dataclasses (manuelle), ✅ Pydantic (.model_dump_json()) ◆ **Performance** : dataclasses ≈ attrs > Pydantic (plus lent à l'instanciation)",
  },
  {
    question: "Cas d'usage — quand choisir quoi ?",
    answer:
      "◆ **dataclasses** : projet standard, pas de dépendances externes, usage simple ◆ **attrs** : projet nécessitant des features avancées (validators, converters, slots), code legacy ◆ **Pydantic** : API REST (FastAPI), validation de données externes (JSON, YAML, env), parsing automatique ◆ **Règle simple** : données internes = dataclasses/attrs, données externes = Pydantic ◆ **Migration** : dataclasses → attrs → Pydantic (si besoin de validation forte)",
  },
  {
    question: "Mots-clés et syntaxes à retenir",
    answer:
      "◆ **dataclasses** : `@dataclass`, `field()`, `frozen=True`, `__post_init__` ◆ **attrs** : `@define` (ou `@attr.s`), `field()` (ou `attr.ib`), `validators=`, `converter=`, `slots=True` ◆ **Pydantic v2** : `BaseModel`, `Field()`, `@field_validator`, `@model_validator`, `model_dump()`, `model_dump_json()` ◆ **Common** : tous supportent `frozen=True` pour l'immutabilité",
  },
  {
    question: "Pièges courants à éviter",
    answer:
      "◆ **default mutable** : `[]` ou `{}` en valeur par défaut → partagé (utiliser `field(default_factory=list)`) ◆ **Pydantic + Optional** : utiliser `Optional[str] = None` ou `str | None = None` ◆ **attrs validators** : ne pas oublier d'importer `attrs.validators` ◆ **dataclasses héritage** : attention à l'ordre des champs ◆ **Pydantic v1 vs v2** : syntaxe différente (`@validator` vs `@field_validator`, `Config` vs `ConfigDict`)",
  },
  {
    question: "Import et installation — résumé",
    answer:
      "◆ **dataclasses** : `from dataclasses import dataclass, field` — intégré, pas d'installation ◆ **attrs** : `pip install attrs` puis `from attrs import define, field` ◆ **Pydantic** : `pip install pydantic` puis `from pydantic import BaseModel, Field, field_validator` ◆ **Version conseillée** : dataclasses (Python 3.7+), attrs (21.4+), Pydantic v2 (2.0+) ⚠️ Pydantic v2 a changé beaucoup de syntaxe par rapport à v1",
  },
  // ==================== NOUVEAUX SLIDES EXEMPLES ====================
  {
    question: "Exemple dataclasses — syntaxe de base",
    answer:
      "```python\nfrom dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    age: int = 0\n    email: str = field(default='')\n    tags: list = field(default_factory=list)\n    \n    def __post_init__(self):\n        if self.age < 0:\n            raise ValueError('Age must be positive')\n\n# Création\nuser = User('Alice', 30)\nprint(user)  # User(name='Alice', age=30, email='', tags=[])\n\n# Immutable\n@dataclass(frozen=True)\nclass ImmutableUser:\n    name: str\n    age: int\n```\n◆ **Caractéristiques** : intégré, léger, __post_init__ pour validation ◆ **Limite** : validation manuelle",
  },
  {
    question: "Exemple attrs — syntaxe moderne et validations",
    answer:
      "```python\nfrom attrs import define, field, validators\n\n@define(slots=True)\nclass User:\n    name: str\n    age: int = field(\n        default=0,\n        validator=validators.ge(0)\n    )\n    email: str = field(default='')\n    tags: list = field(factory=list)\n    \n    @age.validator\n    def _validate_age(self, attribute, value):\n        if value > 150:\n            raise ValueError('Age seems too high')\n\n# Création\nuser = User('Alice', 30)\nprint(user)  # User(name='Alice', age=30, email='', tags=[])\n\n# Immutable\n@define(frozen=True)\nclass ImmutableUser:\n    name: str\n    age: int\n```\n◆ **Caractéristiques** : validators intégrés, slots=True pour performance, converter ◆ **Avantage** : plus de fonctionnalités que dataclasses",
  },
  {
    question: "Exemple Pydantic — validation et parsing automatiques",
    answer:
      "```python\nfrom pydantic import BaseModel, Field, field_validator, EmailStr\n\nclass User(BaseModel):\n    name: str\n    age: int = Field(gt=0, lt=150)\n    email: EmailStr\n    tags: list[str] = Field(default_factory=list)\n    \n    @field_validator('name')\n    def name_must_be_capitalized(cls, v):\n        if not v[0].isupper():\n            raise ValueError('Name must start with uppercase')\n        return v\n\n# Parsing automatique\nuser = User(\n    name='Alice',\n    age='30',  # string -> int automatiquement\n    email='alice@example.com'\n)\n\n# Sérialisation JSON\nprint(user.model_dump_json())\n# {\"name\":\"Alice\",\"age\":30,\"email\":\"alice@example.com\",\"tags\":[]}\n```\n◆ **Caractéristiques** : validation intégrée, parsing automatique, sérialisation JSON native ◆ **Avantage** : idéal pour API et données externes",
  },
  {
    question: "Comparaison côte à côte — même modèle avec les 3",
    answer:
      "```python\n# DATACLASSES\n@dataclass\nclass UserDC:\n    name: str\n    age: int = 0\n\n# ATTRS\n@define\nclass UserAttr:\n    name: str\n    age: int = 0\n\n# PYDANTIC\nclass UserPyd(BaseModel):\n    name: str\n    age: int = 0\n\n# Création\ndc = UserDC('Alice', 30)\nattr = UserAttr('Alice', 30)\npyd = UserPyd(name='Alice', age=30)\n\n# Modification (sauf frozen)\ndc.age = 31\nattr.age = 31\npyd.age = 31  # Pydantic valide avant modification\n```\n◆ **Syntaxe** : très similaire entre les 3 ◆ **Différence** : Pydantic valide à la création ET à la modification",
  },
  {
    question: "Héritage — comparaison entre les 3 bibliothèques",
    answer:
      "```python\n# DATACLASSES — attention à l'ordre des champs !\n@dataclass\nclass ParentDC:\n    x: int = 0  # doit avoir une valeur par défaut\n\n@dataclass\nclass ChildDC(ParentDC):\n    y: int = 2\n\n# ATTRS — gère l'ordre automatiquement\n@define\nclass ParentAttr:\n    x: int\n\n@define\nclass ChildAttr(ParentAttr):\n    y: int = 2\n\n# PYDANTIC — héritage standard\nclass ParentPyd(BaseModel):\n    x: int\n\nclass ChildPyd(ParentPyd):\n    y: int = 2\n\nprint(ChildDC())  # ChildDC(x=0, y=2)\nprint(ChildAttr(1))  # ChildAttr(x=1, y=2)\nprint(ChildPyd(x=1))  # x=1 y=2\n```\n◆ **dataclasses** : nécessite des valeurs par défaut si l'enfant en a ◆ **attrs** : gère l'ordre automatiquement ◆ **Pydantic** : héritage standard",
  },
  {
    question: "Cas d'usage — quand utiliser chaque bibliothèque",
    answer:
      "```python\n# DATACLASSES — projet simple, pas de dépendances\n@dataclass\nclass Config:\n    host: str = 'localhost'\n    port: int = 8080\n\n# ATTRS — besoin de validations et de performance\n@define(slots=True)\nclass Trade:\n    symbol: str\n    price: float = field(validator=validators.gt(0))\n\n# PYDANTIC — API, données externes, parsing automatique\nclass UserRequest(BaseModel):\n    username: str = Field(min_length=3, max_length=20)\n    email: EmailStr\n    age: int = Field(gt=0, lt=120)\n\n# Flask / FastAPI\n@app.post('/users')\ndef create_user(data: UserRequest):\n    return data.model_dump()\n```\n◆ **Dataclasses** : interne, sans dépendances ◆ **attrs** : besoin de features avancées ◆ **Pydantic** : validation forte, données externes, API",
  },
];


const questions = {
  moyen: [
    // ==================== DATACLASSES ====================
    {
      question:
        "[dataclasses] Quelle est la syntaxe correcte pour définir une dataclass simple ?",
      options: [
        "class User: name: str; age: int",
        "@dataclass\nclass User:\n    name: str\n    age: int",
        "@data class User(name: str, age: int)",
        "dataclass User:\n    name: str\n    age: int",
      ],
      answer: "@dataclass\nclass User:\n    name: str\n    age: int",
      explanation:
        "On utilise le décorateur @dataclass avant la définition de la classe. Les attributs sont typés avec des annotations.",
    },
    {
      question:
        "[dataclasses] Quelle version de Python est requise pour utiliser dataclasses ?",
      options: [
        "Python 3.5",
        "Python 3.6",
        "Python 3.7",
        "Python 3.10",
      ],
      answer: "Python 3.7",
      explanation:
        "dataclasses a été introduit en Python 3.7 via la PEP 557. C'est un module standard depuis cette version.",
    },
    {
      question:
        "[dataclasses] Comment empêcher la modification d'une dataclass après création ?",
      options: [
        "@dataclass(immutable=True)",
        "@dataclass(lock=True)",
        "@dataclass(frozen=True)",
        "@dataclass(readonly=True)",
      ],
      answer: "@dataclass(frozen=True)",
      explanation:
        "frozen=True rend l'instance immutable. Toute tentative de modification lève FrozenInstanceError.",
    },
    {
      question:
        "[dataclasses] Que génère automatiquement @dataclass par défaut ?",
      options: [
        "__init__ uniquement",
        "__init__, __repr__, __eq__",
        "__init__, __repr__, __eq__, __hash__",
        "__new__, __del__, __str__",
      ],
      answer: "__init__, __repr__, __eq__",
      explanation:
        "Par défaut, @dataclass génère __init__, __repr__, et __eq__. __hash__ est généré uniquement si frozen=True.",
    },
    {
      question:
        "[dataclasses] Comment déclarer un attribut avec une valeur par défaut qui est une liste mutable ?",
      options: [
        "items: list = []  # ça fonctionne",
        "items: list = field(default=[])\n# avec field importé",
        "items: list = field(default_factory=list)\n# avec field importé",
        "items: list = factory(list)",
      ],
      answer: "items: list = field(default_factory=list)\n# avec field importé",
      explanation:
        "default_factory=list crée une nouvelle liste pour chaque instance. C'est la solution recommandée pour les valeurs mutables.",
    },
    {
      question:
        "[dataclasses] À quoi sert __post_init__ dans une dataclass ?",
      options: [
        "À initialiser les attributs avant la création",
        "À effectuer des validations ou des calculs après l'initialisation",
        "À sauvegarder l'objet en base de données",
        "À détruire l'objet après usage",
      ],
      answer: "À effectuer des validations ou des calculs après l'initialisation",
      explanation:
        "__post_init__ est un hook appelé automatiquement après __init__. C'est l'endroit idéal pour valider et normaliser les données.",
    },

    // ==================== ATTRS ====================
    {
      question:
        "[attrs] Quelle est la syntaxe moderne pour définir une classe attrs ?",
      options: [
        "@attr.s\nclass User:\n    name = attr.ib(type=str)\n    age = attr.ib(type=int)",
        "@define\nclass User:\n    name: str\n    age: int",
        "@attrs\nclass User:\n    name: str\n    age: int",
        "class User(AttrClass):\n    name: str\n    age: int",
      ],
      answer: "@define\nclass User:\n    name: str\n    age: int",
      explanation:
        "La syntaxe moderne utilise @define (introduite en attrs 20.1.0) avec des annotations de type, très similaire à dataclass.",
    },
    {
      question:
        "[attrs] Quelle est la syntaxe classique (encore utilisée) pour attrs ?",
      options: [
        "@attrs\nclass User:\n    name: str\n    age: int",
        "@attr.s\nclass User:\n    name = attr.ib()\n    age = attr.ib()",
        "@define(legacy=True)\nclass User:\n    name: str\n    age: int",
        "class User(AttrBase):\n    name = attr.field()\n    age = attr.field()",
      ],
      answer: "@attr.s\nclass User:\n    name = attr.ib()\n    age = attr.ib()",
      explanation:
        "La syntaxe classique attrs utilise @attr.s et attr.ib() (ou attr.field()). C'est encore largement rencontrée dans les bases de code anciennes.",
    },
    {
      question:
        "[attrs] Comment attrs permet-il d'ajouter une validation à un attribut ?",
      options: [
        "def __validate__(self)",
        "name: str = field(validator=validators.instance_of(str))",
        "name: str = field(validate=True)",
        "name: str = validators.str()",
      ],
      answer: "name: str = field(validator=validators.instance_of(str))",
      explanation:
        "attrs fournit un paramètre validator dans field(), avec des validateurs intégrés comme instance_of, in_, gt, lt, etc.",
    },
    {
      question:
        "[attrs] Que fait l'option slots=True dans @define ?",
      options: [
        "Active l'utilisation de __slots__ pour économiser la mémoire",
        "Crée des espaces réservés pour les attributs",
        "Permet l'héritage multiple",
        "Désactive la génération de __init__",
      ],
      answer: "Active l'utilisation de __slots__ pour économiser la mémoire",
      explanation:
        "slots=True (ou @define(slots=True)) rend la classe plus économe en mémoire en utilisant __slots__ au lieu de __dict__.",
    },
    {
      question:
        "[attrs] Comment attrs se compare-t-il à dataclasses en termes de performance ?",
      options: [
        "attrs est beaucoup plus lent",
        "attrs est légèrement plus rapide que dataclasses dans la plupart des cas",
        "Ils ont des performances identiques",
        "dataclasses est toujours plus rapide",
      ],
      answer: "attrs est légèrement plus rapide que dataclasses dans la plupart des cas",
      explanation:
        "attrs est généralement plus rapide, surtout avec slots=True, car il génère du code C optimisé. La différence est souvent minime.",
    },
    {
      question:
        "[attrs] Quelle fonctionnalité attrs n'est PAS disponible dans dataclasses standard ?",
      options: [
        "frozen=True",
        "validators intégrés",
        "default_factory",
        "__post_init__ (équivalent)",
      ],
      answer: "validators intégrés",
      explanation:
        "dataclasses n'a pas de système de validation intégré. On doit utiliser __post_init__ manuellement. attrs a des validators prêts à l'emploi.",
    },

    // ==================== PYDANTIC ====================
    {
      question:
        "[Pydantic] Quelle est la syntaxe correcte pour définir un modèle Pydantic ?",
      options: [
        "@pydantic\nclass User:\n    name: str\n    age: int",
        "class User(BaseModel):\n    name: str\n    age: int",
        "@dataclass\nclass User:\n    name: str\n    age: int",
        "class User(PydanticModel):\n    name: str\n    age: int",
      ],
      answer: "class User(BaseModel):\n    name: str\n    age: int",
      explanation:
        "Un modèle Pydantic hérite de BaseModel. Les attributs sont définis avec des annotations de type.",
    },
    {
      question:
        "[Pydantic] Que fait Pydantic si on passe une chaîne '123' à un champ de type int ?",
      options: [
        "Lève une erreur de validation",
        "Ignore la valeur",
        "Convertit automatiquement '123' en 123",
        "Stocke la valeur comme chaîne",
      ],
      answer: "Convertit automatiquement '123' en 123",
      explanation:
        "Pydantic fait du parsing automatique : '123' devient 123, 'true' devient True, '2024-01-01' devient date. C'est très pratique pour les données externes.",
    },
    {
      question:
        "[Pydantic] Comment valider un email dans un modèle Pydantic ?",
      options: [
        "email: EmailStr (importé de pydantic)",
        "email: str(validator='email')",
        "@validate_email\ndef email(self): pass",
        "email: str (validation automatique par Pydantic)",
      ],
      answer: "email: EmailStr (importé de pydantic)",
      explanation:
        "Pydantic fournit des types spéciaux comme EmailStr, HttpUrl, UUID, etc. pour des validations prêtes à l'emploi.",
    },
    {
      question:
        "[Pydantic] Comment créer une instance de modèle Pydantic à partir d'un dictionnaire ?",
      options: [
        "User.build(dict)",
        "User.from_dict(dict)",
        "User.parse_obj(dict)  # v1 / User(**dict)  # v1/v2",
        "User.create(dict)",
      ],
      answer: "User.parse_obj(dict)  # v1 / User(**dict)  # v1/v2",
      explanation:
        "Pydantic v1 utilise parse_obj(). Pydantic v2 accepte directement User(**dict). Les deux sont valides selon la version.",
    },
    {
      question:
        "[Pydantic] Comment sérialiser un modèle Pydantic en JSON ?",
      options: [
        "user.to_json()",
        "user.serialize_json()",
        "user.json()  # v1 / user.model_dump_json()  # v2",
        "user.dump_json()",
      ],
      answer: "user.json()  # v1 / user.model_dump_json()  # v2",
      explanation:
        "Pydantic v1 utilise .json(). Pydantic v2 utilise .model_dump_json(). Les deux sont valides selon la version.",
    },
    {
      question:
        "[Pydantic] Quelle est la principale force de Pydantic par rapport à dataclasses/attrs ?",
      options: [
        "Sa vitesse d'exécution",
        "Sa validation et son parsing automatiques de types",
        "Son faible encombrement mémoire",
        "Sa compatibilité avec toutes les versions de Python",
      ],
      answer: "Sa validation et son parsing automatiques de types",
      explanation:
        "Pydantic excelle dans la validation et la conversion de types. Il est conçu pour les données provenant de sources externes (API, fichiers, env).",
    },
  ],
  avance: [
    // ==================== COMPARAISONS ====================
    {
      question:
        "[Comparaison] Laquelle de ces affirmations est vraie concernant les 3 bibliothèques ?",
      options: [
        "Toutes les 3 supportent la validation intégrée",
        "Toutes les 3 supportent frozen=True",
        "Toutes les 3 supportent la sérialisation JSON native",
        "Toutes les 3 sont des modules standard Python",
      ],
      answer: "Toutes les 3 supportent frozen=True",
      explanation:
        "dataclasses (frozen=True), attrs (frozen=True), et Pydantic (frozen=True) supportent tous l'immutabilité.",
    },
    {
      question:
        "[Comparaison] Laquelle de ces bibliothèques est la plus légère en mémoire ?",
      options: [
        "dataclasses (standard Python)",
        "attrs avec slots=True",
        "Pydantic (BaseModel)",
        "Ils ont tous une empreinte similaire",
      ],
      answer: "attrs avec slots=True",
      explanation:
        "attrs avec slots=True utilise __slots__ ce qui le rend très économe en mémoire. dataclasses est standard. Pydantic est plus lourd à cause de la validation.",
    },
    {
      question:
        "[Comparaison] Quelle bibliothèque est la plus lente à l'instanciation ?",
      options: [
        "dataclasses",
        "attrs",
        "Pydantic",
        "Elles ont des vitesses similaires",
      ],
      answer: "Pydantic",
      explanation:
        "Pydantic est plus lent à l'instanciation car il fait de la validation et du parsing à la création. dataclasses et attrs sont plus rapides.",
    },
    {
      question:
        "[Comparaison] Pour un projet simple sans dépendances externes, quelle bibliothèque choisir ?",
      options: [
        "Pydantic (le plus complet)",
        "attrs (le plus performant)",
        "dataclasses (standard, sans dépendance)",
        "Aucune, utiliser des dicts",
      ],
      answer: "dataclasses (standard, sans dépendance)",
      explanation:
        "dataclasses est dans la bibliothèque standard. Pas d'installation de dépendances, minimaliste mais suffisant pour beaucoup de cas.",
    },
    {
      question:
        "[Comparaison] Pour une API REST avec validation de données entrantes, quelle bibliothèque est la plus adaptée ?",
      options: [
        "dataclasses",
        "attrs",
        "Pydantic (utilisé par FastAPI)",
        "Aucune, utiliser des types natifs",
      ],
      answer: "Pydantic (utilisé par FastAPI)",
      explanation:
        "Pydantic est la bibliothèque de référence pour la validation de données dans les API. FastAPI l'utilise nativement.",
    },
    {
      question:
        "[Comparaison] Quelle bibliothèque offre le meilleur support pour la sérialisation JSON ?",
      options: [
        "dataclasses (via dataclasses.asdict)",
        "attrs (via attr.asdict)",
        "Pydantic (via .model_dump_json()/json())",
        "Toutes offrent un support similaire",
      ],
      answer: "Pydantic (via .model_dump_json()/json())",
      explanation:
        "Pydantic a un support JSON natif et robuste, avec gestion des dates, enums, etc. Les autres nécessitent plus de code ou des bibliothèques auxiliaires.",
    },

    // ==================== SYNTAXE AVANCEE ====================
    {
      question:
        "[Pydantic v2] En Pydantic v2, comment configurer un modèle (remplace Config de v1) ?",
      options: [
        "class Meta: ...",
        "model_config = ConfigDict(...)",
        "config = Config(...)",
        "@config(...)",
      ],
      answer: "model_config = ConfigDict(...)",
      explanation:
        "Pydantic v2 utilise model_config = ConfigDict(...) à l'intérieur de la classe, au lieu de la classe Config de v1.",
    },
    {
      question:
        "[Pydantic v2] En Pydantic v2, quelle est la syntaxe pour un validateur de champ ?",
      options: [
        "@validator",
        "@field_validator",
        "@validate_field",
        "@check_field",
      ],
      answer: "@field_validator",
      explanation:
        "Pydantic v2 utilise @field_validator au lieu de @validator en v1. La signature a légèrement changé.",
    },
    {
      question:
        "[Pydantic v2] En Pydantic v2, comment valider plusieurs champs ensemble ?",
      options: [
        "@root_validator",
        "@model_validator",
        "@multi_validator",
        "@all_validator",
      ],
      answer: "@model_validator",
      explanation:
        "Pydantic v2 utilise @model_validator pour les validations qui impliquent plusieurs champs. v1 utilisait @root_validator.",
    },
    {
      question:
        "[attrs] Quelle fonctionnalité d'attrs est particulièrement utile pour l'héritage de classes ?",
      options: [
        "auto_attribs=True",
        "field(init=False)",
        "attrs.define avec `field(converter=...)` pour normaliser les données enfant",
        "Héritage multi-classe natif",
      ],
      answer: "attrs.define avec `field(converter=...)` pour normaliser les données enfant",
      explanation:
        "attrs permet d'utiliser des converters pour normaliser automatiquement les données lors de l'héritage, assurant la cohérence entre classes parent/enfant.",
    },
    {
      question:
        "[attrs] Que fait `field(converter=int)` dans attrs ?",
      options: [
        "Convertit la valeur en int à l'initialisation",
        "Valide que la valeur est un int",
        "Définit la valeur par défaut à 0",
        "Crée une clé étrangère vers int",
      ],
      answer: "Convertit la valeur en int à l'initialisation",
      explanation:
        "converter=... transforme automatiquement la valeur avant de l'assigner à l'attribut. Exemple : int('123') → 123.",
    },
    {
      question:
        "[Héritage Pydantic] Comment un modèle Pydantic hérite-t-il d'un autre ?",
      options: [
        "class Enfant(Parent): ...  # comme une classe normale",
        "class Enfant(ParentModel): ...  # héritage avec suffixe",
        "class Enfant(BaseModel, Parent): ...  # héritage multiple",
        "L'héritage n'est pas supporté",
      ],
      answer: "class Enfant(Parent): ...  # comme une classe normale",
      explanation:
        "Les modèles Pydantic s'héritent comme des classes normales. Les champs du parent sont automatiquement inclus.",
    },
  ],
  expert: [
    // ==================== PIEGES ET SUBTILITES ====================
    {
      question:
        "[PIÈGE] Ce code avec dataclasses fonctionne-t-il ?\n\n@dataclass\nclass Parent:\n    x: int\n\n@dataclass\nclass Enfant(Parent):\n    y: int = 2",
      options: [
        "Oui, tout fonctionne",
        "Non, erreur : x n'a pas de valeur par défaut, y en a une",
        "Oui, x prend la valeur 0 automatiquement",
        "Non, l'héritage est impossible avec dataclasses",
      ],
      answer: "Non, erreur : x n'a pas de valeur par défaut, y en a une",
      explanation:
        "L'ordre des paramètres dans __init__ : x (sans défaut) vient avant y (avec défaut), ce qui est invalide en Python. Il faut donner une valeur par défaut à x.",
    },
    {
      question:
        "[PIÈGE] Ce code avec attrs fonctionne-t-il ?\n\n@define\nclass Parent:\n    x: int\n\n@define\nclass Enfant(Parent):\n    y: int = 2",
      options: [
        "Oui, attrs gère l'ordre automatiquement",
        "Non, même problème qu'avec dataclasses",
        "Oui, mais x devient optionnel",
        "Non, attrs n'accepte pas les valeurs par défaut",
      ],
      answer: "Oui, attrs gère l'ordre automatiquement",
      explanation:
        "attrs est plus intelligent que dataclasses. Il réorganise les paramètres automatiquement pour éviter ce problème d'ordre.",
    },
    {
      question:
        "[PIÈGE] Ce code Pydantic est-il valide ?\n\nclass User(BaseModel):\n    name: str = None",
      options: [
        "Oui, c'est valide, name sera None",
        "Non, il faut utiliser Optional[str] = None",
        "Oui, Pydantic convertit automatiquement en Optional",
        "Non, les valeurs par défaut ne sont pas acceptées",
      ],
      answer: "Non, il faut utiliser Optional[str] = None",
      explanation:
        "En Pydantic (comme en Python), si une annotation est str, la valeur None est invalide. Il faut utiliser Optional[str] = None.",
    },
    {
      question:
        "[PIÈGE] Que se passe-t-il avec ce code Pydantic ?\n\nclass User(BaseModel):\n    name: str\n    age: int = Field(gt=0)\n\nUser(name='Alice', age=-5)",
      options: [
        "L'instance est créée avec age=-5",
        "Lève une ValidationError (age doit être > 0)",
        "Convertit -5 en 5",
        "Lève une TypeError",
      ],
      answer: "Lève une ValidationError (age doit être > 0)",
      explanation:
        "Field(gt=0) valide que age doit être supérieur à 0. Pydantic lève une ValidationError détaillée.",
    },
    {
      question:
        "[PIÈGE] Avec frozen=True, ce code fonctionne-t-il ?\n\n@dataclass(frozen=True)\nclass Config:\n    params: dict\n\nc = Config({'a': 1})\nc.params['b'] = 2",
      options: [
        "Lève FrozenInstanceError",
        "Le dict est modifié (params est mutable)",
        "Lève AttributeError",
        "Crée une nouvelle instance immuable",
      ],
      answer: "Le dict est modifié (params est mutable)",
      explanation:
        "Piège classique : frozen=True empêche la réassignation de l'attribut (c.params = {...}) mais pas la modification du contenu du dict.",
    },
    {
      question:
        "[PIÈGE] Comment rendre un dict véritablement immutable dans une dataclass frozen ?",
      options: [
        "Utiliser dict au lieu de dict",
        "Utiliser MappingProxyType(dict) pour créer une vue en lecture seule",
        "Utiliser list à la place",
        "C'est impossible",
      ],
      answer: "Utiliser MappingProxyType(dict) pour créer une vue en lecture seule",
      explanation:
        "MappingProxyType (de types) crée une vue en lecture seule d'un dict. Les modifications lèveraient TypeError.",
    },
    {
      question:
        "[PIÈGE] Quelle est la performance relative de Pydantic avec des modèles complexes ?",
      options: [
        "Pydantic est le plus rapide grâce à Rust",
        "Pydantic est plus lent mais offre plus de fonctionnalités",
        "Pydantic est plus rapide que dataclasses",
        "Pydantic est plus lent que attrs mais plus rapide que dataclasses",
      ],
      answer: "Pydantic est plus lent mais offre plus de fonctionnalités",
      explanation:
        "Pydantic fait beaucoup de validation et de parsing à l'instanciation. Il est généralement plus lent que dataclasses et attrs.",
    },
    {
      question:
        "[PIÈGE] Comment attrs se compare-t-il à dataclasses pour l'héritage multiple ?",
      options: [
        "attrs ne supporte pas l'héritage multiple",
        "dataclasses ne supporte pas l'héritage multiple",
        "Les deux supportent l'héritage multiple",
        "Seul Pydantic supporte l'héritage multiple",
      ],
      answer: "Les deux supportent l'héritage multiple",
      explanation:
        "dataclasses et attrs supportent l'héritage multiple. Pydantic supporte aussi l'héritage multiple.",
    },
    {
      question:
        "[PIÈGE] Que fait field(init=False) dans dataclasses ?",
      options: [
        "L'attribut n'est pas inclus dans __init__",
        "L'attribut est initialisé à False",
        "L'attribut est supprimé après création",
        "L'attribut devient privé",
      ],
      answer: "L'attribut n'est pas inclus dans __init__",
      explanation:
        "init=False signifie que l'attribut ne sera pas un paramètre de __init__. Il doit avoir une valeur par défaut.",
    },
    {
      question:
        "[PIÈGE] Dans Pydantic, comment rendre un champ optionnel avec une valeur par défaut ?",
      options: [
        "name: str = None",
        "name: str | None = None",
        "name: Optional[str] = None",
        "Les deux B et C sont valides",
      ],
      answer: "Les deux B et C sont valides",
      explanation:
        "En Python 3.10+, str | None = None est valide. En versions antérieures, on utilise Optional[str] = None.",
    },
    {
      question:
        "[PIÈGE] Que se passe-t-il avec @define(slots=True) dans attrs ?",
      options: [
        "Rend la classe immuable",
        "Crée __slots__ pour une meilleure performance mémoire",
        "Désactive l'héritage",
        "Génère des méthodes de comparaison",
      ],
      answer: "Crée __slots__ pour une meilleure performance mémoire",
      explanation:
        "slots=True active l'utilisation de __slots__ dans la classe, ce qui réduit la mémoire utilisée.",
    },
    {
      question:
        "[PIÈGE] Laquelle de ces bibliothèques est la plus adaptée pour des données qui doivent être immutables et hashables ?",
      options: [
        "dataclasses (frozen=True)",
        "attrs (frozen=True)",
        "Pydantic (frozen=True)",
        "Toutes les trois offrent des solutions similaires",
      ],
      answer: "Toutes les trois offrent des solutions similaires",
      explanation:
        "Les trois bibliothèques supportent frozen=True et sont hashables si tous les champs sont hashables. Le choix dépend d'autres critères.",
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
