// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [

  // ==================== FRAMEWORKS ====================
  {
    question: "Frameworks Python — Vue d'ensemble",
    answer:
      "◆ **Flask** : microframework léger, minimaliste, idéal pour APIs simples et prototypes ◆ **FastAPI** : moderne, asynchrone, validation Pydantic, documentation OpenAPI auto-générée ◆ **Django** : framework complet (batteries included), ORM intégré, admin panel, sécurité ◆ **Choix** : Flask = minimal, FastAPI = performance/async, Django = full-stack ◆ **Performance** : FastAPI > Flask ~ Django (selon configuration) ⚠️ FastAPI est le plus rapide grâce à Starlette (ASGI) et Pydantic",
  },
  // ==================== ORM ====================
  {
    question: "ORM — SQLAlchemy vs Django ORM",
    answer:
      "◆ **SQLAlchemy** : ORM puissant et flexible, SQL Expression Language, supports async (1.4+), utilisé avec Flask/FastAPI ◆ **Django ORM** : intégré à Django, plus simple, moins flexible, migrations intégrées ◆ **SqlAlchemy Core** : couche bas niveau SQL, sans mapping ORM ◆ **Choix** : SQLAlchemy = flexibilité et contrôle, Django ORM = rapidité et convention ◆ **Migrations** : SQLAlchemy → Alembic, Django ORM → migrations intégrées ⚠️ SQLAlchemy 2.0 a un style asynchrone moderne",
  },
  // ==================== DEPLOIEMENT ====================
  {
    question: "Déploiement — Docker, K8s, Cloud",
    answer:
      "◆ **Docker** : conteneurisation, image, container, docker build/run/push ◆ **Kubernetes (K8s)** : orchestration, pods, deployments, services, ingress, scaling ◆ **AWS** : ECS, EKS, RDS, S3, Lambda, EC2 ◆ **Azure** : AKS, App Service, Cosmos DB, Blob Storage ◆ **GCP** : GKE, Cloud Run, Cloud SQL, Cloud Storage ◆ **CI/CD** : GitHub Actions, GitLab CI, Jenkins, ArgoCD ⚠️ Docker + K8s = stack standard en entreprise",
  },
  // ==================== APIS ====================
  {
    question: "Types d'APIs — REST, GraphQL, gRPC, Kafka",
    answer:
      "◆ **REST** : HTTP + JSON, CRUD, standard, simple ◆ **GraphQL** : HTTP + JSON, requêtes flexibles, schéma défini, frontend flexible ◆ **gRPC** : HTTP/2 + Protobuf, schéma strict (.proto), inter-services rapide ◆ **Kafka** : message broker, streaming asynchrone, découplage, event-driven ◆ **Synchrone** : REST, GraphQL, gRPC (attente réponse) ◆ **Asynchrone** : Kafka (publish/subscribe) ⚠️ gRPC est le plus rapide pour inter-services, REST reste le plus universel",
  },
  // ==================== SYNCHRONE/ASYNCHRONE ====================
  {
    question: "Synchrone vs Asynchrone — Python",
    answer:
      "◆ **Synchrone (Flask, Django WSGI)** : blocant, un thread par requête, GIL, simple ◆ **Asynchrone (FastAPI, Django ASGI)** : non-blocant, event loop, plusieurs requêtes par thread ◆ **async/await** : mots-clés Python pour l'asynchrone ◆ **GIL** : Global Interpreter Lock, limite le parallélisme CPU ◆ **Use case** : I/O bound (API, BDD) → asynchrone, CPU bound (calcul) → multiprocessing ⚠️ FastAPI est le leader des frameworks asynchrones Python",
  },
  // ==================== CLOUD ====================
  {
    question: "Cloud — AWS, Azure, GCP — services clés",
    answer:
      "◆ **AWS** : EC2 (VM), RDS (BDD), S3 (stockage), Lambda (serverless), EKS (Kubernetes) ◆ **Azure** : Virtual Machines, SQL Database, Blob Storage, Functions, AKS ◆ **GCP** : Compute Engine, Cloud SQL, Cloud Storage, Cloud Run, GKE ◆ **Serverless** : AWS Lambda, Azure Functions, Cloud Functions ◆ **Containers** : ECS/EKS, AKS, GKE ◆ **BDD managée** : RDS, Azure SQL, Cloud SQL ⚠️ AWS est le leader de marché, GCP est très présent en data/ML",
  },
];

const questions = {
  moyen: [
    // ==================== FRAMEWORKS (6 questions) ====================
    {
      question:
        "[Frameworks] Quel framework Python est considéré comme le plus minimaliste et léger pour une API simple ?",
      options: [
        "Django (framework complet et structuré)",
        "Flask (microframework, minimaliste)",
        "FastAPI (moderne, asynchrone, complet)",
        "Pyramid (framework flexible mais plus lourd)",
      ],
      answer: "Flask (microframework, minimaliste)",
      explanation:
        "Flask est un microframework minimaliste. Il fournit l'essentiel (routing, requêtes/réponses) mais laisse le choix des composants (ORM, validation). Idéal pour les APIs simples, prototypes et microservices légers.",
    },
    {
      question:
        "[Frameworks] Quel framework Python est le plus adapté pour une API REST performante avec validation automatique et documentation OpenAPI intégrée ?",
      options: [
        "Flask (trop minimaliste, nécessite des extensions)",
        "FastAPI (moderne, asynchrone, Pydantic, OpenAPI intégré)",
        "Django (trop lourd pour une API pure)",
        "Tornado (spécialisé WebSocket, moins adapté)",
      ],
      answer: "FastAPI (moderne, asynchrone, Pydantic, OpenAPI intégré)",
      explanation:
        "FastAPI est le framework moderne par excellence : asynchrone, validation Pydantic, documentation OpenAPI auto-générée, très performant (Starlette + Pydantic). C'est le choix standard pour les APIs en 2024.",
    },
    {
      question:
        "[Frameworks] Quel framework Python est dit 'batteries included' (tout est inclus) ?",
      options: [
        "Flask (microframework, extensions optionnelles)",
        "FastAPI (moderne mais minimaliste sur l'ORM)",
        "Django (framework complet, ORM, admin, sécurité, migrations)",
        "Bottle (encore plus minimaliste que Flask)",
      ],
      answer: "Django (framework complet, ORM, admin, sécurité, migrations)",
      explanation:
        "Django est 'batteries included' : ORM intégré, admin panel, système d'authentification, migrations, sécurité CSRF/XSS. Tout est prêt à l'emploi. Idéal pour des applications full-stack.",
    },
    {
      question:
        "[Frameworks] En termes de performance pure (requêtes/sec), quel framework Python est le plus rapide ?",
      options: [
        "Flask (synchrone, WSGI, limité par le GIL)",
        "Django (synchrone en WSGI, plus lent que FastAPI)",
        "FastAPI (ASGI, asynchrone, Starlette, très performant)",
        "Tous ont des performances similaires",
      ],
      answer: "FastAPI (ASGI, asynchrone, Starlette, très performant)",
      explanation:
        "FastAPI est le plus rapide des frameworks Python grâce à son architecture ASGI (asynchrone) et Starlette. Il peut gérer plusieurs milliers de requêtes par seconde. Flask et Django sont plus lents (WSGI synchrone).",
    },
    {
      question:
        "[Frameworks] Flask et FastAPI utilisent tous les deux quel mécanisme pour la validation des données (selon la version) ?",
      options: [
        "Aucun, validation manuelle uniquement",
        "FastAPI utilise Pydantic, Flask peut utiliser Pydantic via des extensions comme pydantic-flask",
        "Les deux utilisent Marshmallow",
        "Flask utilise Pydantic nativement, FastAPI utilise Marshmallow",
      ],
      answer: "FastAPI utilise Pydantic, Flask peut utiliser Pydantic via des extensions comme pydantic-flask",
      explanation:
        "FastAPI utilise Pydantic nativement pour la validation. Flask n'a pas de validation intégrée, mais on peut ajouter Pydantic via des extensions ou manuellement. C'est un des avantages de FastAPI.",
    },
    {
      question:
        "[Frameworks] Django est généralement associé à quel ORM ?",
      options: [
        "SQLAlchemy (ORM externe)",
        "Django ORM (intégré, 'batteries included')",
        "Peewee (ORM léger)",
        "Tortoise ORM (asynchrone)",
      ],
      answer: "Django ORM (intégré, 'batteries included')",
      explanation:
        "Django a son propre ORM intégré, très bien intégré avec le framework. C'est l'ORM le plus utilisé avec Django. SQLAlchemy est plus utilisé avec Flask/FastAPI.",
    },

    // ==================== ORM (4 questions) ====================
    {
      question:
        "[ORM] Quel ORM est généralement utilisé avec FastAPI pour la flexibilité et le support asynchrone ?",
      options: [
        "Django ORM (intégré à Django, pas adapté à FastAPI)",
        "SQLAlchemy (ORM puissant, support async depuis 1.4)",
        "Peewee (ORM léger, pas asynchrone)",
        "Tortoise ORM (asynchrone mais moins mature)",
      ],
      answer: "SQLAlchemy (ORM puissant, support async depuis 1.4)",
      explanation:
        "SQLAlchemy est l'ORM de référence avec FastAPI. Il est très flexible, supporte l'asynchrone (1.4+), et s'intègre bien avec Pydantic. C'est le choix standard en entreprise.",
    },
    {
      question:
        "[ORM] Quel outil est utilisé pour les migrations avec SQLAlchemy ?",
      options: [
        "Django migrations (intégré à Django)",
        "Alembic (outil de migration pour SQLAlchemy)",
        "Flyway (outil Java)",
        "Liquibase (outil cross-platform)",
      ],
      answer: "Alembic (outil de migration pour SQLAlchemy)",
      explanation:
        "Alembic est l'outil de migration standard pour SQLAlchemy. Il permet de versionner le schéma BDD, créer des migrations, appliquer des rollbacks. C'est l'équivalent de Django migrations.",
    },
    {
      question:
        "[ORM] Quelle est la différence principale entre SQLAlchemy Core et SQLAlchemy ORM ?",
      options: [
        "Core est pour les bases NoSQL, ORM pour SQL",
        "Core est la couche bas niveau (SQL Expression Language), ORM est la couche haut niveau (classes Python)",
        "Core est plus lent que ORM",
        "Il n'y a pas de différence",
      ],
      answer: "Core est la couche bas niveau (SQL Expression Language), ORM est la couche haut niveau (classes Python)",
      explanation:
        "SQLAlchemy Core : couche bas niveau, génération SQL, tables. SQLAlchemy ORM : couche haut niveau, mapping classes Python vers tables. On peut utiliser les deux selon le besoin.",
    },
    {
      question:
        "[ORM] En Django ORM, comment définit-on une relation ManyToMany ?",
      options: [
        "models.ManyToManyField('AutreModele')",
        "models.ForeignKey('AutreModele')",
        "models.OneToOneField('AutreModele')",
        "models.Relation('AutreModele', type='many')",
      ],
      answer: "models.ManyToManyField('AutreModele')",
      explanation:
        "Django ORM utilise ManyToManyField pour les relations ManyToMany. Une table d'association est créée automatiquement. C'est plus simple que SQLAlchemy où il faut définir explicitement la table d'association.",
    },

    // ==================== DEPLOIEMENT (4 questions) ====================
    {
      question:
        "[Déploiement] Quelle commande Docker permet de construire une image à partir d'un Dockerfile ?",
      options: [
        "docker run (exécute un container)",
        "docker build (construit une image à partir d'un Dockerfile)",
        "docker push (pousse une image vers un registry)",
        "docker pull (récupère une image d'un registry)",
      ],
      answer: "docker build (construit une image à partir d'un Dockerfile)",
      explanation:
        "docker build lit le Dockerfile et construit une image. docker run exécute un container à partir d'une image. docker push/pull transfèrent des images vers/depuis un registry.",
    },
    {
      question:
        "[Déploiement] En Kubernetes, quel objet permet de faire tourner plusieurs réplicas d'un container avec auto-scaling ?",
      options: [
        "Pod (unité de base, un ou plusieurs containers)",
        "Deployment (gère les réplicas, rolling updates, rollback)",
        "Service (expose les pods en réseau)",
        "Ingress (routeur HTTP pour l'extérieur)",
      ],
      answer: "Deployment (gère les réplicas, rolling updates, rollback)",
      explanation:
        "Le Deployment est l'objet K8s qui gère les réplicas, les rolling updates et les rollbacks. Il assure que le nombre souhaité de pods tourne. Pod est l'unité de base, Service expose, Ingress route.",
    },
    {
      question:
        "[Déploiement] Quel service AWS est équivalent à Kubernetes managé (cluster K8s) ?",
      options: [
        "EC2 (VM classique)",
        "EKS (Elastic Kubernetes Service)",
        "ECS (Elastic Container Service, Docker sans K8s)",
        "Lambda (serverless)",
      ],
      answer: "EKS (Elastic Kubernetes Service)",
      explanation:
        "AWS EKS est le service Kubernetes managé d'AWS. Il gère le control plane K8s. ECS est le service container AWS sans K8s. EC2 est des VMs, Lambda est serverless.",
    },
    {
      question:
        "[Déploiement] En Azure, quel service est l'équivalent de AWS EKS ?",
      options: [
        "Azure Virtual Machines (VMs)",
        "Azure Kubernetes Service (AKS)",
        "Azure Container Instances (ACI)",
        "Azure Functions (serverless)",
      ],
      answer: "Azure Kubernetes Service (AKS)",
      explanation:
        "Azure AKS (Azure Kubernetes Service) est le service Kubernetes managé de Microsoft Azure. C'est l'équivalent direct de AWS EKS et GCP GKE.",
    },

    // ==================== APIS (5 questions) ====================
    {
      question:
        "[APIs] Quel protocole est utilisé par gRPC pour la communication ?",
      options: [
        "HTTP + JSON (comme REST)",
        "HTTP/2 + Protobuf (binaire, schéma strict)",
        "TCP persistant (comme WebSocket)",
        "UDP (datagrammes)",
      ],
      answer: "HTTP/2 + Protobuf (binaire, schéma strict)",
      explanation:
        "gRPC utilise HTTP/2 pour le transport et Protobuf (Protocol Buffers) pour la sérialisation. C'est binaire, rapide, avec un schéma strict défini dans un fichier .proto.",
    },
    {
      question:
        "[APIs] Quel type d'API est le plus adapté pour des requêtes frontend variables (ex: un client web qui demande des champs spécifiques) ?",
      options: [
        "REST (standard mais renvoie toujours les mêmes champs)",
        "GraphQL (permet de demander exactement les champs souhaités)",
        "gRPC (schéma strict, pas de flexibilité)",
        "Kafka (asynchrone, pas adapté aux requêtes)",
      ],
      answer: "GraphQL (permet de demander exactement les champs souhaités)",
      explanation:
        "GraphQL permet au client de demander exactement les champs dont il a besoin. C'est très flexible pour les frontends. REST renvoie toujours la même structure (over-fetching/under-fetching).",
    },
    {
      question:
        "[APIs] Quel outil est un message broker pour les architectures event-driven et asynchrones ?",
      options: [
        "REST (synchrone, requête-réponse)",
        "GraphQL (synchrone, requêtes flexibles)",
        "Kafka (asynchrone, publish/subscribe, streaming)",
        "gRPC (synchrone, inter-services rapide)",
      ],
      answer: "Kafka (asynchrone, publish/subscribe, streaming)",
      explanation:
        "Kafka est un message broker distribué. Il permet la communication asynchrone via publish/subscribe. C'est la base des architectures event-driven. REST/GraphQL/gRPC sont synchrones.",
    },
    {
      question:
        "[APIs] Quelle API est la plus rapide pour la communication entre microservices (inter-services) ?",
      options: [
        "REST (standard mais sérialisation JSON verbeuse)",
        "GraphQL (trop complexe pour inter-services)",
        "gRPC (HTTP/2 + Protobuf, binaire, très rapide)",
        "WebSocket (temps réel mais pas pour RPC)",
      ],
      answer: "gRPC (HTTP/2 + Protobuf, binaire, très rapide)",
      explanation:
        "gRPC est le plus rapide pour l'inter-services car il utilise HTTP/2 et Protobuf binaire. Il a un schéma strict et est optimisé pour les appels RPC entre services.",
    },
    {
      question:
        "[APIs] En FastAPI, comment génère-t-on automatiquement la documentation OpenAPI ?",
      options: [
        "Elle est générée automatiquement à partir des annotations de type et des paramètres des routes",
        "Il faut écrire manuellement un fichier swagger.json",
        "FastAPI utilise Sphinx pour la documentation",
        "FastAPI ne supporte pas OpenAPI nativement",
            ],
      answer: "Elle est générée automatiquement à partir des annotations de type et des paramètres des routes",
      explanation:
        "FastAPI génère automatiquement la documentation OpenAPI (Swagger) à partir des annotations de type, des paramètres des routes et des modèles Pydantic. La documentation est accessible sur /docs.",
    },
    {
      question:
        "[Synchrone/Asynchrone] Quel est le principal avantage de l'asynchrone en Python pour une API web ?",
      options: [
        "Calculs CPU plus rapides (pas bloqué par le GIL)",
        "Meilleure gestion des I/O (connexions BDD, API externes) sans bloquer le thread",
        "Moins de mémoire utilisée",
        "Plus simple à déboguer",
      ],
      answer: "Meilleure gestion des I/O (connexions BDD, API externes) sans bloquer le thread",
      explanation:
        "L'asynchrone permet de gérer des I/O sans bloquer le thread. Pendant qu'une requête attend une réponse BDD ou API externe, le thread peut traiter d'autres requêtes. C'est idéal pour les I/O bound.",
    },
    {
      question:
        "[Synchrone/Asynchrone] Quel mot-clé Python est utilisé pour définir une fonction asynchrone ?",
      options: [
        "def (définition synchrone standard)",
        "async def (définition asynchrone)",
        "await def (définition en attente)",
        "asyncio def (définition avec asyncio)",
      ],
      answer: "async def (définition asynchrone)",
      explanation:
        "async def définit une fonction asynchrone (coroutine). await est utilisé à l'intérieur pour attendre un résultat asynchrone. asyncio est la bibliothèque qui gère l'event loop.",
    },
    {
      question:
        "[Synchrone/Asynchrone] Flask est un framework WSGI, ce qui signifie qu'il est :",
      options: [
        "Asynchrone (non-blocant, plusieurs requêtes par thread)",
        "Synchrone (blocant, un thread par requête)",
        "Parallèle (plusieurs threads pour une même requête)",
        "Réactif (event-driven comme Node.js)",
      ],
      answer: "Synchrone (blocant, un thread par requête)",
      explanation:
        "Flask est WSGI (Web Server Gateway Interface), donc synchrone. Chaque requête occupe un thread complet. Si une requête fait une requête BDD lente, le thread est bloqué. C'est la limite de Flask.",
    },
    {
      question:
        "[Synchrone/Asynchrone] FastAPI est un framework ASGI, ce qui signifie qu'il est :",
      options: [
        "Synchrone (blocant comme Flask)",
        "Asynchrone (non-blocant, event loop)",
        "Uniquement pour les WebSockets",
        "Plus lent que WSGI",
      ],
      answer: "Asynchrone (non-blocant, event loop)",
      explanation:
        "FastAPI est ASGI (Asynchronous Server Gateway Interface), donc asynchrone. Il utilise une event loop (comme Node.js) pour gérer plusieurs requêtes simultanément sans bloquer. C'est plus performant pour les I/O.",
    },

    // ==================== CLOUD (3 questions) ====================
    {
      question:
        "[Cloud] Quel service AWS est utilisé pour le stockage d'objets (fichiers, images) ?",
      options: [
        "EC2 (VM, pas de stockage objet)",
        "S3 (Simple Storage Service, stockage objet)",
        "RDS (base de données relationnelle)",
        "EBS (stockage bloc pour EC2)",
      ],
      answer: "S3 (Simple Storage Service, stockage objet)",
      explanation:
        "AWS S3 est le service de stockage objet. Il est utilisé pour les fichiers, images, sauvegardes. RDS est pour les BDD, EBS pour le stockage bloc (disques), EC2 pour les VMs.",
    },
    {
      question:
        "[Cloud] Quel service Google Cloud est l'équivalent de AWS Lambda (serverless) ?",
      options: [
        "Google Compute Engine (VMs)",
        "Google Cloud Functions (serverless)",
        "Google Kubernetes Engine (K8s)",
        "Google Cloud Storage (stockage objet)",
      ],
      answer: "Google Cloud Functions (serverless)",
      explanation:
        "Google Cloud Functions est le service serverless de GCP, équivalent d'AWS Lambda et Azure Functions. Compute Engine = VMs, GKE = K8s, Cloud Storage = stockage objet.",
    },
    {
      question:
        "[Cloud] Quel service Azure est utilisé pour les bases de données relationnelles managées ?",
      options: [
        "Azure Blob Storage (stockage objet)",
        "Azure SQL Database (BDD relationnelle managée)",
        "Azure Cosmos DB (NoSQL)",
        "Azure Virtual Machines (VMs)",
      ],
      answer: "Azure SQL Database (BDD relationnelle managée)",
      explanation:
        "Azure SQL Database est le service de BDD relationnelle managée de Microsoft Azure. Blob Storage = stockage objet, Cosmos DB = NoSQL, Virtual Machines = VMs.",
    },

    // ==================== CLASSES (3 questions) ====================
    {
      question:
        "[Classes] Qu'est-ce qu'une classe abstraite en Python (ABC) ?",
      options: [
        "Une classe qui n'a pas de constructeur",
        "Une classe qui ne peut pas être instanciée et sert de contrat pour les sous-classes",
        "Une classe qui ne peut avoir que des méthodes statiques",
        "Une classe qui est automatiquement générée par Python",
      ],
      answer: "Une classe qui ne peut pas être instanciée et sert de contrat pour les sous-classes",
      explanation:
        "Une classe abstraite (ABC, Abstract Base Class) est un contrat. Elle ne peut pas être instanciée. Elle définit des méthodes abstraites que les sous-classes doivent implémenter. C'est le pattern Template Method.",
    },
    {
      question:
        "[Classes] En Python, comment déclare-t-on une méthode abstraite dans une classe abstraite ?",
      options: [
        "def methode_abstraite(self): pass  # méthode vide",
        "@abstractmethod\ndef methode_abstraite(self): pass",
        "abstract def methode_abstraite(self): pass",
        "async def methode_abstraite(self): pass",
      ],
      answer: "@abstractmethod\ndef methode_abstraite(self): pass",
      explanation:
        "On utilise le décorateur @abstractmethod du module abc. La méthode n'a pas d'implémentation (ou une implémentation minimale). Les sous-classes doivent la surcharger.",
    },
    {
      question:
        "[Classes] Une classe normale (non abstraite) peut-elle hériter d'une classe abstraite ?",
      options: [
        "Non, seules les classes abstraites peuvent hériter d'une classe abstraite",
        "Oui, mais elle doit implémenter toutes les méthodes abstraites pour être instanciable",
        "Oui, automatiquement, sans rien implémenter",
        "Non, Python interdit l'héritage de classes abstraites",
      ],
      answer: "Oui, mais elle doit implémenter toutes les méthodes abstraites pour être instanciable",
      explanation:
        "Une classe concrète peut hériter d'une classe abstraite. Pour être instanciable, elle doit implémenter toutes les méthodes abstraites héritées. Sinon, elle reste abstraite.",
    },

    // ==================== BASE DE DONNEES (3 questions) ====================
    {
      question:
        "[BDD] En PostgreSQL, quel type de données est recommandé pour stocker des prix (ex: 10.99, 150.50) ?",
      options: [
        "FLOAT (approximatif, problèmes d'arrondi)",
        "DECIMAL / NUMERIC (précis, idéal pour les prix)",
        "INTEGER (pas de décimales)",
        "VARCHAR (stockage textuel)",
      ],
      answer: "DECIMAL / NUMERIC (précis, idéal pour les prix)",
      explanation:
        "DECIMAL (ou NUMERIC) est le type recommandé pour les prix et les montants financiers. Il est précis et n'a pas de problèmes d'arrondi. FLOAT est approximatif, INTEGER n'a pas de décimales.",
    },
    {
      question:
        "[BDD] Quel type d'index est le plus adapté pour une recherche par titre exact (WHERE titre = 'livre') ?",
      options: [
        "B-Tree index (recherche équilibrée O(log n))",
        "Hash index (recherche O(1) pour les égalités)",
        "GIN index (pour les types complexes)",
        "Bitmap index (pour les colonnes à faible cardinalité)",
      ],
      answer: "Hash index (recherche O(1) pour les égalités)",
      explanation:
        "L'index Hash est O(1) pour les recherches par égalité exacte. Mais en PostgreSQL, l'index B-Tree est plus utilisé car il supporte aussi les recherches par intervalle. Le B-Tree est le standard.",
    },
    {
      question:
        "[BDD] Que signifie 'acid' en base de données ?",
      options: [
        "Atomicity, Consistency, Isolation, Durability (les 4 propriétés des transactions)",
        "Aspect, Context, Interface, Data (principes de conception)",
        "Abstract, Concrete, Inherit, Delegate (principes OOP)",
        "Application, Cache, Index, Database (composants d'une app)",
      ],
      answer: "Atomicity, Consistency, Isolation, Durability (les 4 propriétés des transactions)",
      explanation:
        "ACID : Atomicité (tout ou rien), Cohérence (règles métier), Isolation (transactions parallèles), Durabilité (persistance). Ce sont les propriétés garanties par les bases de données transactionnelles (PostgreSQL, Oracle).",
    },
  ],
  avance: [
    // ==================== FRAMEWORKS AVANCES ====================
    {
      question:
        "[Avancé] Quelle est la différence de paradigme entre WSGI (Flask) et ASGI (FastAPI) ?",
      options: [
        "WSGI est asynchrone, ASGI est synchrone",
        "WSGI est synchrone (un thread par requête), ASGI est asynchrone (event loop)",
        "WSGI est pour les APIs, ASGI pour les sites web",
        "Il n'y a pas de différence, ce sont des synonymes",
      ],
      answer: "WSGI est synchrone (un thread par requête), ASGI est asynchrone (event loop)",
      explanation:
        "WSGI : synchrone, un thread par requête. ASGI : asynchrone, event loop, plusieurs requêtes par thread. ASGI est plus performant pour les I/O mais plus complexe. FastAPI est ASGI, Flask est WSGI.",
    },
    {
      question:
        "[Avancé] En SQLAlchemy, quelle option permet de charger automatiquement une relation pour éviter le N+1 problem ?",
      options: [
        "lazy=True (défaut, charge à l'accès)",
        "joinedload() ou selectinload() (chargement anticipé)",
        "eager=True (chargement immédiat)",
        "prefetch_related() (spécifique Django)",
      ],
      answer: "joinedload() ou selectinload() (chargement anticipé)",
      explanation:
        "joinedload() et selectinload() permettent le chargement anticipé (eager loading) des relations. joinedload utilise une jointure SQL, selectinload utilise une sous-requête. Les deux évitent le N+1 problem.",
    },
    {
      question:
        "[Avancé] En Kubernetes, quelle ressource permet de scaler automatiquement les pods selon le CPU ou la mémoire ?",
      options: [
        "Deployment (gère les réplicas mais sans auto-scaling)",
        "Horizontal Pod Autoscaler (HPA, scaling automatique)",
        "Service (expose les pods)",
        "Ingress (router HTTP)",
      ],
      answer: "Horizontal Pod Autoscaler (HPA, scaling automatique)",
      explanation:
        "Le Horizontal Pod Autoscaler (HPA) est la ressource K8s qui ajuste automatiquement le nombre de réplicas d'un Deployment en fonction du CPU, de la mémoire ou de métriques personnalisées.",
    },
    {
      question:
        "[Avancé] Qu'est-ce que Pydantic dans l'écosystème FastAPI ?",
      options: [
        "Un ORM pour FastAPI",
        "La bibliothèque de validation de données utilisée par FastAPI",
        "Un serveur HTTP pour FastAPI",
        "Un outil de migration pour FastAPI",
      ],
      answer: "La bibliothèque de validation de données utilisée par FastAPI",
      explanation:
        "Pydantic est la bibliothèque de validation de données. FastAPI l'utilise nativement pour valider les requêtes, les paramètres et les réponses. C'est le cœur de la validation de FastAPI.",
    },
    {
      question:
        "[Avancé] En asynchrone Python, que se passe-t-il si une fonction async appelle une fonction synchrone bloquante (ex: requests.get) ?",
      options: [
        "Tout fonctionne normalement, sans conséquence",
        "La fonction asynchrone bloque l'event loop entier, annulant l'intérêt de l'asynchrone",
        "Python lève une erreur automatiquement",
        "La fonction synchrone est automatiquement convertie en asynchrone",
      ],
      answer: "La fonction asynchrone bloque l'event loop entier, annulant l'intérêt de l'asynchrone",
      explanation:
        "Appeler une fonction synchrone bloquante (requests.get, time.sleep) dans une fonction async bloque l'event loop. Toutes les autres requêtes sont bloquées. Il faut utiliser des bibliothèques asynchrones (httpx, aiohttp).",
    },
    {
      question:
        "[Avancé] En SQLAlchemy 2.0, comment exécute-t-on une requête asynchrone ?",
      options: [
        "session.execute(select(User)) (synchrone)",
        "await session.execute(select(User)) (asynchrone, avec AsyncSession)",
        "session.query(User).all() (style 1.x)",
        "User.query.all() (style Flask)",
      ],
      answer: "await session.execute(select(User)) (asynchrone, avec AsyncSession)",
      explanation:
        "SQLAlchemy 2.0 supporte l'asynchrone avec AsyncSession. La syntaxe est await session.execute(select(User)). Il faut utiliser create_async_engine et AsyncSession.",
    },

    // ==================== CLOUD AVANCES ====================
    {
      question:
        "[Avancé] En AWS, quel service permet d'exécuter du code sans gérer de serveurs (serverless) ?",
      options: [
        "EC2 (serveur virtuel)",
        "Lambda (serverless, exécution de code à la demande)",
        "EKS (Kubernetes managé)",
        "RDS (base de données)",
      ],
      answer: "Lambda (serverless, exécution de code à la demande)",
      explanation:
        "AWS Lambda est le service serverless d'AWS. Il exécute du code à la demande, sans gérer de serveurs. Idéal pour des fonctions simples et des événements. EC2 = VMs, EKS = K8s, RDS = BDD.",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre un Deployment et un StatefulSet en Kubernetes ?",
      options: [
        "Deployment pour stateful, StatefulSet pour stateless",
        "Deployment pour stateless (pods interchangeables), StatefulSet pour stateful (pods avec identité persistante)",
        "Il n'y a pas de différence",
        "Deployment est pour les applications, StatefulSet pour les bases de données uniquement",
      ],
      answer: "Deployment pour stateless (pods interchangeables), StatefulSet pour stateful (pods avec identité persistante)",
      explanation:
        "Deployment : pods interchangeables, sans identité persistante. StatefulSet : pods avec identité unique et persistante (ex: base de données, Kafka). Les StatefulSets ont des volumes persistants par pod.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE Python] Quelle est la conséquence du GIL (Global Interpreter Lock) sur les applications Python asynchrones comme FastAPI ?",
      options: [
        "Le GIL bloque complètement l'asynchrone",
        "Le GIL n'affecte pas l'asynchrone car l'asynchrone est I/O bound (pas CPU), et le GIL est relâché lors des I/O",
        "Le GIL rend FastAPI plus lent que Flask",
        "Le GIL n'existe pas en Python 3.10+",
      ],
      answer: "Le GIL n'affecte pas l'asynchrone car l'asynchrone est I/O bound (pas CPU), et le GIL est relâché lors des I/O",
      explanation:
        "Le GIL est relâché pendant les opérations I/O (lecture BDD, requête API, etc.). L'asynchrone est principalement I/O bound, donc le GIL n'est pas un problème. Le GIL est un problème pour le CPU bound (calculs).",
    },
    {
      question:
        "[PIÈGE Python] Pourquoi FastAPI est-il plus rapide que Flask pour les APIs JSON ?",
      options: [
        "FastAPI utilise moins de RAM",
        "FastAPI utilise Starlette (ASGI) et Pydantic (validation en Rust via pydantic-core)",
        "FastAPI est écrit en C",
        "FastAPI utilise moins de bibliothèques",
      ],
      answer: "FastAPI utilise Starlette (ASGI) et Pydantic (validation en Rust via pydantic-core)",
      explanation:
        "FastAPI est basé sur Starlette (ASGI, performant) et Pydantic (validation avec pydantic-core en Rust). Flask est WSGI (synchrone) et n'a pas de validation intégrée. C'est la combinaison qui rend FastAPI plus rapide.",
    },
    {
      question:
        "[PIÈGE K8s] En Kubernetes, que signifie 'rollout undo' ?",
      options: [
        "Supprimer complètement le déploiement",
        "Revenir à la version précédente du déploiement (rollback)",
        "Redémarrer les pods",
        "Mettre à jour les secrets",
      ],
      answer: "Revenir à la version précédente du déploiement (rollback)",
      explanation:
        "'kubectl rollout undo deployment/nom' permet de revenir à la version précédente d'un déploiement. C'est le rollback standard en Kubernetes. C'est rapide et permet de corriger un déploiement défectueux.",
    },
    {
      question:
        "[PIÈGE API] En gRPC, qu'est-ce qu'un fichier .proto ?",
      options: [
        "Un fichier de configuration JSON",
        "Un fichier qui définit le schéma des services et messages (Protobuf)",
        "Un fichier de migration de base de données",
        "Un fichier de déploiement Kubernetes",
      ],
      answer: "Un fichier qui définit le schéma des services et messages (Protobuf)",
      explanation:
        "Le fichier .proto est le fichier de définition de Protobuf. Il définit les services, les méthodes RPC et les messages (structures de données). C'est le contrat de l'API gRPC.",
    },
    {
      question:
        "[PIÈGE Cloud] Quelle est la différence entre un conteneur Docker et une VM (Virtual Machine) ?",
      options: [
        "Docker est plus lent qu'une VM",
        "Docker partage le noyau de l'hôte (plus léger, démarrage rapide), VM a son propre noyau (plus lourd, isolation plus forte)",
        "Il n'y a pas de différence, ce sont des synonymes",
        "Les VM sont plus légères que les conteneurs",
      ],
      answer: "Docker partage le noyau de l'hôte (plus léger, démarrage rapide), VM a son propre noyau (plus lourd, isolation plus forte)",
      explanation:
        "Docker : conteneur, partage le noyau de l'hôte, démarrage en millisecondes, léger. VM : virtualisation complète, son propre noyau, démarrage en minutes, plus lourd, meilleure isolation. C'est la différence fondamentale.",
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
