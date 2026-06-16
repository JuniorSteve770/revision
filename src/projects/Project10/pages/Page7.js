// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "SQLAlchemy — vue d'ensemble",
    answer:
      "◆ **ORM** : Object-Relational Mapping — mapper des classes Python vers des tables SQL ◆ **Core** : couche bas niveau (SQL Expression Language) ◆ **Engine** : point d'entrée vers la base de données ◆ **Session** : unité de travail (transactions) ◆ **Declarative Base** : définit les modèles ◆ **Relationship** : liens entre tables (one-to-many, many-to-many) ◆ **Query** : API de requêtage (ou select() en 2.0) ◆ **Migration** : Alembic pour gérer les schémas",
  },
  {
    question: "Mots-clés SQLAlchemy à maîtriser",
    answer:
      "◆ **create_engine()** : connexion DB ◆ **sessionmaker()** : fabrique de sessions ◆ **Base = declarative_base()** : classe de base pour les modèles ◆ **Column()** : définit une colonne ◆ **Integer, String, DateTime** : types de colonnes ◆ **relationship()** : lien entre tables ◆ **back_populates / backref** : navigation bidirectionnelle ◆ **select()** : requête (SQLAlchemy 2.0 style) ◆ **filter() / where()** : conditions ◆ **join()** : jointures ◆ **foreign_key()** : clé étrangère",
  },
  {
    question: "Bonnes pratiques SQLAlchemy",
    answer:
      "◆ **Session par requête** : créer une session par opération (ou par requête HTTP) ◆ **Context Manager** : utiliser `with session.begin():` pour les transactions ◆ **N+1 Problem** : utiliser `joinedload()` ou `selectinload()` ◆ **Indexes** : ajouter des indexes sur les colonnes fréquemment requêtées ◆ **Migrations** : utiliser Alembic pour versionner le schéma ◆ **Éviter les requêtes nues** : préférer l'ORM pour la sécurité ◆ **Lazy vs Eager** : choisir le bon chargement des relations",
  },
];

const questions = {
  moyen: [
    // ==================== BASES ET CONFIGURATION ====================
    {
      question:
        "[SQLAlchemy] Quelle est la fonction pour créer une connexion à une base de données ?",
      options: [
        "connect_db()",
        "create_engine()",
        "get_connection()",
        "Database.connect()",
      ],
      answer: "create_engine()",
      explanation:
        "create_engine() est la fonction principale pour créer une connexion à une base de données. Elle prend une URL de connexion en paramètre.",
    },
    {
      question:
        "[SQLAlchemy] Quelle est la syntaxe correcte pour une URL de connexion PostgreSQL ?",
      options: [
        "postgresql://user:password@localhost/dbname",
        "postgres://user:password@localhost/dbname",
        "psql://user:password@localhost/dbname",
        "pg://user:password@localhost/dbname",
      ],
      answer: "postgresql://user:password@localhost/dbname",
      explanation:
        "SQLAlchemy utilise 'postgresql://' pour PostgreSQL. 'postgres://' est aussi accepté mais 'postgresql://' est la forme standard.",
    },
    {
      question:
        "[SQLAlchemy] Que fait la fonction sessionmaker() ?",
      options: [
        "Crée une nouvelle base de données",
        "Crée une fabrique de sessions liée à un engine",
        "Exécute une requête SQL",
        "Ferme toutes les connexions",
      ],
      answer: "Crée une fabrique de sessions liée à un engine",
      explanation:
        "sessionmaker() est une usine à sessions. Elle est configurée avec un engine et permet de créer des sessions à la demande.",
    },
    {
      question:
        "[SQLAlchemy] Quelle classe doit hériter un modèle SQLAlchemy ?",
      options: [
        "sqlalchemy.Model",
        "declarative_base() (ou Base)",
        "sqlalchemy.Entity",
        "sqlalchemy.Table",
      ],
      answer: "declarative_base() (ou Base)",
      explanation:
        "Les modèles héritent de la classe retournée par declarative_base(). C'est la classe de base pour tous les modèles ORM.",
    },
    {
      question:
        "[SQLAlchemy] Que représente une Session en SQLAlchemy ?",
      options: [
        "Une connexion unique à la base de données",
        "Une unité de travail (transaction) pour les opérations ORM",
        "La configuration de la base de données",
        "Le pool de connexions",
      ],
      answer: "Une unité de travail (transaction) pour les opérations ORM",
      explanation:
        "La Session est l'unité de travail en SQLAlchemy. Elle gère les transactions et les opérations ORM (ajout, modification, suppression).",
    },
    {
      question:
        "[SQLAlchemy] Comment ajouter un objet à la session pour l'insertion ?",
      options: [
        "session.insert(objet)",
        "session.save(objet)",
        "session.add(objet)",
        "session.append(objet)",
      ],
      answer: "session.add(objet)",
      explanation:
        "session.add() ajoute un objet à la session. Il sera inséré lors du prochain commit (session.commit()).",
    },
    {
      question:
        "[SQLAlchemy] Comment valider (commit) une transaction en SQLAlchemy ?",
      options: [
        "session.flush()",
        "session.commit()",
        "session.save()",
        "session.end()",
      ],
      answer: "session.commit()",
      explanation:
        "session.commit() valide la transaction et persiste toutes les modifications en base de données.",
    },
    {
      question:
        "[SQLAlchemy] Quelle est la meilleure pratique pour gérer une session ?",
      options: [
        "Une session globale unique pour toute l'application",
        "Une session par requête/opération (context manager)",
        "Une session par table",
        "Une session par utilisateur",
      ],
      answer: "Une session par requête/opération (context manager)",
      explanation:
        "La meilleure pratique est de créer une session par requête ou opération. On utilise souvent un context manager (with session.begin():).",
    },
    {
      question:
        "[SQLAlchemy] Comment définir une colonne de type Integer avec une contrainte NOT NULL ?",
      options: [
        "age = Column(Integer, nullable=False)",
        "age = Column(Integer, not_null=True)",
        "age = Column(Integer, required=True)",
        "age = Column(Integer, null=False)",
      ],
      answer: "age = Column(Integer, nullable=False)",
      explanation:
        "nullable=False est le paramètre pour rendre une colonne NOT NULL en SQLAlchemy.",
    },
    {
      question:
        "[SQLAlchemy] Comment définir une clé primaire auto-incrémentée en SQLAlchemy ?",
      options: [
        "id = Column(Integer, primary_key=True, autoincrement=True)",
        "id = Column(Integer, primary_key=True)",
        "id = Column(Integer, auto_increment=True)",
        "id = Column(Integer, primary_key=True, identity=True)",
      ],
      answer: "id = Column(Integer, primary_key=True)",
      explanation:
        "primary_key=True suffit généralement. autoid='auto' (ou True) est le comportement par défaut pour Integer.",
    },

    // ==================== REQUETES ET FILTRES ====================
    {
      question:
        "[SQLAlchemy] Comment récupérer tous les utilisateurs avec SQLAlchemy 2.0 ?",
      options: [
        "session.query(User).all()  # style 1.x",
        "session.execute(select(User)).scalars().all()  # style 2.0",
        "session.get(User).all()",
        "User.query.all()  # Flask-SQLAlchemy style",
      ],
      answer: "session.execute(select(User)).scalars().all()  # style 2.0",
      explanation:
        "SQLAlchemy 2.0 utilise select() de SQLAlchemy Core. session.execute(select(User)).scalars().all() est la syntaxe recommandée.",
    },
    {
      question:
        "[SQLAlchemy] Comment filtrer les utilisateurs par nom avec SQLAlchemy 2.0 ?",
      options: [
        "session.query(User).filter(User.name == 'Alice')",
        "session.execute(select(User).where(User.name == 'Alice')).scalars().all()",
        "session.get(User, name='Alice')",
        "User.filter(name='Alice').all()",
      ],
      answer: "session.execute(select(User).where(User.name == 'Alice')).scalars().all()",
      explanation:
        "SQLAlchemy 2.0 utilise .where() sur la select() pour filtrer. La syntaxe 1.x (query().filter()) fonctionne encore mais est dépréciée.",
    },
    {
      question:
        "[SQLAlchemy] Comment faire une jointure entre User et Address en SQLAlchemy 2.0 ?",
      options: [
        "session.query(User).join(Address)",
        "session.execute(select(User, Address).join(Address)).all()",
        "session.execute(select(User).join(Address).where(User.id == Address.user_id)).scalars().all()",
        "session.execute(select(User).join(Address, User.id == Address.user_id)).scalars().all()",
      ],
      answer: "session.execute(select(User).join(Address, User.id == Address.user_id)).scalars().all()",
      explanation:
        "SQLAlchemy 2.0 utilise .join() sur la select(). La condition de jointure peut être spécifiée explicitement.",
    },
    {
      question:
        "[SQLAlchemy] Quelle méthode SQLAlchemy permet de charger automatiquement une relation (évite le N+1) ?",
      options: [
        "select().join()",
        "select().options(joinedload()) ou selectinload()",
        "select().with_relationship()",
        "select().eager_load()",
      ],
      answer: "select().options(joinedload()) ou selectinload()",
      explanation:
        "options(joinedload()) ou selectinload() permet de charger les relations en une seule requête. selectinload() est souvent plus efficace pour les collections.",
    },
    {
      question:
        "[SQLAlchemy] Que fait la méthode scalars() sur le résultat d'une exécution ?",
      options: [
        "Retourne une liste de dictionnaires",
        "Retourne une liste des objets (ou valeurs scalaires) du résultat",
        "Retourne le nombre de lignes",
        "Retourne un DataFrame pandas",
      ],
      answer: "Retourne une liste des objets (ou valeurs scalaires) du résultat",
      explanation:
        "scalars() extrait les objets du résultat. .all() donne une liste. Les résultats sont des objets ORM.",
    },
    {
      question:
        "[SQLAlchemy] Comment récupérer un seul utilisateur par son ID en SQLAlchemy 2.0 ?",
      options: [
        "session.get(User, id)",
        "session.query(User).get(id)  # style 1.x",
        "session.execute(select(User).where(User.id == id)).scalar_one()",
        "Toutes les réponses ci-dessus sont valides selon la version",
      ],
      answer: "Toutes les réponses ci-dessus sont valides selon la version",
      explanation:
        "session.get() existe en SQLAlchemy 2.0. query().get() est la syntaxe 1.x. select().scalar_one() est le style Core 2.0.",
    },

    // ==================== RELATIONSHIPS ====================
    {
      question:
        "[SQLAlchemy] Comment définir une relation one-to-many entre User et Address ?",
      options: [
        "addresses = relationship('Address', back_populates='user')",
        "addresses = Column(Address, foreign_key=True)",
        "addresses = relationship('Address', lazy=True)",
        "addresses = Column(Address, many=True)",
      ],
      answer: "addresses = relationship('Address', back_populates='user')",
      explanation:
        "relationship() définit la relation. back_populates permet la navigation bidirectionnelle. 'User' aura addresses, 'Address' aura user.",
    },
    {
      question:
        "[SQLAlchemy] Comment définir une relation many-to-one (la clé étrangère) ?",
      options: [
        "user_id = Column(Integer, ForeignKey('users.id'))",
        "user_id = Column(Integer, foreign_key=True)",
        "user_id = relationship('User')",
        "user_id = Column(ForeignKey('users.id'))",
      ],
      answer: "user_id = Column(Integer, ForeignKey('users.id'))",
      explanation:
        "ForeignKey('users.id') définit la clé étrangère. Le type Integer est explicite, et la référence est au format 'table.colonne'.",
    },
    {
      question:
        "[SQLAlchemy] Comment définir une relation many-to-many en SQLAlchemy ?",
      options: [
        "Utiliser une table d'association et secondary dans relationship()",
        "Utiliser relationship() sans paramètre",
        "Utiliser une colonne d'array",
        "Utiliser une jointure directe",
      ],
      answer: "Utiliser une table d'association et secondary dans relationship()",
      explanation:
        "Les relations many-to-many utilisent une table d'association. Le paramètre secondary de relationship() pointe vers cette table.",
    },
    {
      question:
        "[SQLAlchemy] Que fait back_populates dans une relationship ?",
      options: [
        "Crée une colonne de sauvegarde",
        "Permet la navigation bidirectionnelle entre les classes",
        "Définit la jointure automatique",
        "Active le lazy loading",
      ],
      answer: "Permet la navigation bidirectionnelle entre les classes",
      explanation:
        "back_populates rend la relation navigable dans les deux sens. user.addresses et address.user fonctionnent tous les deux.",
    },

    // ==================== UPDATE ET DELETE ====================
    {
      question:
        "[SQLAlchemy] Comment mettre à jour un attribut d'un objet en SQLAlchemy ?",
      options: [
        "user.name = 'NewName' puis session.commit()",
        "session.update(user, {'name': 'NewName'})",
        "user.update(name='NewName')",
        "session.modify(user, name='NewName')",
      ],
      answer: "user.name = 'NewName' puis session.commit()",
      explanation:
        "La modification se fait directement sur l'objet. SQLAlchemy détecte le changement via le dirty tracking et le persiste au commit.",
    },
    {
      question:
        "[SQLAlchemy] Comment supprimer un objet de la base de données ?",
      options: [
        "session.delete(user)",
        "session.remove(user)",
        "session.destroy(user)",
        "session.pop(user)",
      ],
      answer: "session.delete(user)",
      explanation:
        "session.delete() marque l'objet pour suppression. La suppression effective a lieu lors du commit.",
    },
    {
      question:
        "[SQLAlchemy] Que fait session.flush() ?",
      options: [
        "Valide la transaction et ferme la session",
        "Envoie les requêtes SQL en base sans valider la transaction (commit)",
        "Annule toutes les modifications",
        "Rafraîchit l'objet avec les données de la base",
      ],
      answer: "Envoie les requêtes SQL en base sans valider la transaction (commit)",
      explanation:
        "flush() synchronise les modifications avec la base de données mais ne valide pas la transaction. Le commit reste à faire.",
    },

    // ==================== SQLALCHEMY CORE ====================
    {
      question:
        "[SQLAlchemy Core] Quelle est la syntaxe pour exécuter une requête SQL brute (raw SQL) en SQLAlchemy Core ?",
      options: [
        "session.execute('SELECT * FROM users')",
        "engine.execute(text('SELECT * FROM users'))",
        "session.raw('SELECT * FROM users')",
        "db.execute('SELECT * FROM users')",
      ],
      answer: "engine.execute(text('SELECT * FROM users'))",
      explanation:
        "SQLAlchemy Core utilise engine.execute() avec text() pour les requêtes SQL brutes. C'est la couche Core (non ORM).",
    },
    {
      question:
        "[SQLAlchemy Core] Comment créer une table avec SQLAlchemy Core (sans ORM) ?",
      options: [
        "Table('users', metadata, Column(...))",
        "create_table('users', {'id': int, 'name': str})",
        "Table('users').add_column(...)",
        "Model.__table__.create(engine)",
      ],
      answer: "Table('users', metadata, Column(...))",
      explanation:
        "Le Core utilise Table() et Column() de sqlalchemy. Le metadata contient la définition du schéma.",
    },
    {
      question:
        "[SQLAlchemy] Quelle est la différence entre SQLAlchemy Core et ORM ?",
      options: [
        "Core est plus lent que ORM",
        "Core est bas niveau (SQL Expression Language), ORM est haut niveau (classes Python)",
        "ORM ne supporte pas les transactions",
        "Il n'y a pas de différence",
      ],
      answer: "Core est bas niveau (SQL Expression Language), ORM est haut niveau (classes Python)",
      explanation:
        "Le Core manipule des SQL directement via des expressions. L'ORM mappe des classes Python vers des tables et gère les sessions.",
    },

    // ==================== INDEXES ET PERFORMANCE ====================
    {
      question:
        "[SQLAlchemy] Comment ajouter un index sur une colonne en SQLAlchemy ?",
      options: [
        "age = Column(Integer, index=True)",
        "age = Column(Integer, add_index=True)",
        "age = Column(Integer, indexed=True)",
        "age = Column(Integer, index=create_index())",
      ],
      answer: "age = Column(Integer, index=True)",
      explanation:
        "Le paramètre index=True sur une colonne crée automatiquement un index en base de données.",
    },
    {
      question:
        "[SQLAlchemy] Que permet d'éviter l'utilisation de selectinload() ou joinedload() ?",
      options: [
        "Le problème de connexions",
        "Le problème N+1 (trop de requêtes)",
        "Les fuites de mémoire",
        "Les problèmes de types",
      ],
      answer: "Le problème N+1 (trop de requêtes)",
      explanation:
        "Le N+1 problem se produit quand on charge une liste d'objets puis qu'on accède à leurs relations, causant N requêtes supplémentaires. joinedload/selectinload permettent un chargement anticipé.",
    },
    {
      question:
        "[SQLAlchemy] Quelle est la méthode recommandée pour gérer les migrations de schéma ?",
      options: [
        "SQLAlchemy Migrate",
        "Alembic",
        "South",
        "MigrateDB",
      ],
      answer: "Alembic",
      explanation:
        "Alembic est l'outil de migration officiel pour SQLAlchemy. Il permet de versionner et d'appliquer les modifications de schéma.",
    },
  ],
  avance: [
    {
      question:
        "[SQLAlchemy Avancé] Que fait le paramètre lazy='select' dans une relationship ?",
      options: [
        "Charge la relation immédiatement",
        "Charge la relation à la demande (lazy loading) lorsque l'attribut est accédé",
        "Ne charge jamais la relation",
        "Charge la relation en une seule requête",
      ],
      answer: "Charge la relation à la demande (lazy loading) lorsque l'attribut est accédé",
      explanation:
        "lazy='select' est le comportement par défaut. La relation est chargée par une requête supplémentaire quand on y accède pour la première fois.",
    },
    {
      question:
        "[SQLAlchemy Avancé] Quelle est la différence entre joinedload() et selectinload() ?",
      options: [
        "joinedload utilise une jointure, selectinload une sous-requête",
        "selectinload est plus rapide que joinedload",
        "joinedload est plus récent",
        "Il n'y a pas de différence",
      ],
      answer: "joinedload utilise une jointure, selectinload une sous-requête",
      explanation:
        "joinedload() utilise SQL JOIN pour charger en une seule requête. selectinload() utilise une sous-requête (SELECT ... IN), souvent plus efficace pour les collections.",
    },
    {
      question:
        "[SQLAlchemy Avancé] Comment activer le mode 'asynchronous' (async) avec SQLAlchemy ?",
      options: [
        "from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession",
        "async_engine = create_engine(async=True)",
        "session = AsyncSession(engine)",
        "Toutes les réponses sont correctes selon la version",
      ],
      answer: "from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession",
      explanation:
        "SQLAlchemy 1.4+ supporte asyncio via sqlalchemy.ext.asyncio. Il faut utiliser create_async_engine et AsyncSession.",
    },
    {
      question:
        "[SQLAlchemy Avancé] Que fait session.refresh(objet) ?",
      options: [
        "Sauvegarde l'objet en base",
        "Rafraîchit l'objet avec les données de la base (ré-exécute la requête)",
        "Supprime l'objet de la session",
        "Crée une nouvelle copie de l'objet",
      ],
      answer: "Rafraîchit l'objet avec les données de la base (ré-exécute la requête)",
      explanation:
        "refresh() re-exécute la requête pour récupérer l'état actuel de l'objet en base. Utile quand d'autres sessions ont modifié les données.",
    },
    {
      question:
        "[SQLAlchemy Avancé] Que permet l'utilisation de avec session.begin(): ?",
      options: [
        "Démarre une transaction auto-committée",
        "Démarre une transaction qui sera commitée automatiquement à la sortie du bloc, ou rollback en cas d'erreur",
        "Démarre une transaction en lecture seule",
        "Crée une nouvelle connexion",
      ],
      answer: "Démarre une transaction qui sera commitée automatiquement à la sortie du bloc, ou rollback en cas d'erreur",
      explanation:
        "session.begin() en context manager assure le commit automatique en cas de succès, et le rollback en cas d'exception.",
    },
    {
      question:
        "[SQLAlchemy Avancé] Comment gérer les relations circulaires (objets qui se référencent) avec SQLAlchemy ?",
      options: [
        "Utiliser backref au lieu de back_populates",
        "Définir la relation après la classe (post-declaration)",
        "Utiliser des chaînes de caractères pour les noms de classe et des forward references",
        "C'est impossible en SQLAlchemy",
      ],
      answer: "Utiliser des chaînes de caractères pour les noms de classe et des forward references",
      explanation:
        "SQLAlchemy accepte des chaînes de caractères pour les noms de classe dans relationship(), résolvant ainsi les références circulaires.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE SQLAlchemy] Ce code va-t-il lever une erreur ?\n\nuser = session.get(User, 1)\nuser.name = 'NewName'\n# Pas de session.commit()",
      options: [
        "Oui, il faut commit pour que la modification soit effectuée",
        "Non, la modification est automatiquement persistée à la fin du bloc",
        "Oui, si le paramètre autocommit=True n'est pas défini",
        "La modification n'est pas persistée mais l'objet a changé en mémoire",
      ],
      answer: "La modification n'est pas persistée mais l'objet a changé en mémoire",
      explanation:
        "Sans commit, la modification n'est pas persistée. L'objet en session est modifié (dirty tracking) mais la base n'est pas mise à jour.",
    },
    {
      question:
        "[PIÈGE SQLAlchemy] Que se passe-t-il si on fait session.add(user) alors que user existe déjà en base ?",
      options: [
        "SQLAlchemy lève une erreur de clé primaire",
        "SQLAlchemy détecte que l'objet est déjà dans la session",
        "SQLAlchemy insère un doublon en base",
        "SQLAlchemy ignore l'opération",
      ],
      answer: "SQLAlchemy détecte que l'objet est déjà dans la session",
      explanation:
        "Si l'objet est déjà dans la session (tracké), session.add() ne fait rien. SQLAlchemy gère l'état de l'objet.",
    },
    {
      question:
        "[PIÈGE SQLAlchemy] Quelle est la différence entre session.query(User).first() et session.get(User, id) ?",
      options: [
        "first() retourne une liste, get() retourne un objet",
        "get() utilise le cache d'identité (identity map), first() exécute une requête LIMIT 1",
        "first() est plus rapide que get()",
        "Il n'y a pas de différence",
      ],
      answer: "get() utilise le cache d'identité (identity map), first() exécute une requête LIMIT 1",
      explanation:
        "get() vérifie d'abord le cache d'identité de la session. first() exécute toujours une requête SQL avec LIMIT 1.",
    },
    {
      question:
        "[PIÈGE SQLAlchemy] Avec selectinload(), combien de requêtes sont exécutées pour charger 100 utilisateurs et leurs adresses ?",
      options: [
        "100 requêtes (N+1)",
        "1 requête (jointure)",
        "2 requêtes (users + adresses)",
        "Dépend du paramètre lazy",
      ],
      answer: "2 requêtes (users + adresses)",
      explanation:
        "selectinload() utilise 2 requêtes : une pour les utilisateurs, une pour les adresses avec IN (SELECT ... IN (...)). C'est efficace pour les collections.",
    },
    {
      question:
        "[PIÈGE SQLAlchemy] Comment rendre une requête SQLAlchemy insensible à la casse (LIKE) ?",
      options: [
        "User.name.like('%alice%')  # est sensible à la casse",
        "func.lower(User.name).like('%alice%')",
        "User.name.ilike('%alice%')  # PostgreSQL seulement",
        "User.name.lower().like('%alice%')",
      ],
      answer: "User.name.ilike('%alice%')  # PostgreSQL seulement",
      explanation:
        "ilike() est l'équivalent insensible à la casse de LIKE, supporté par PostgreSQL, SQLite, MySQL. Ou func.lower() pour une approche plus universelle.",
    },
    {
      question:
        "[PIÈGE SQLAlchemy] Que fait session.expire_all() ?",
      options: [
        "Ferme toutes les sessions",
        "Expire tous les objets de la session (ils seront rechargés à la prochaine utilisation)",
        "Supprime tous les objets de la base",
        "Rafraîchit toutes les connexions",
      ],
      answer: "Expire tous les objets de la session (ils seront rechargés à la prochaine utilisation)",
      explanation:
        "expire_all() marque tous les objets comme 'expirés'. À la prochaine utilisation, ils seront automatiquement rechargés depuis la base.",
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
