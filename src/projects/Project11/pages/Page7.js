// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== PHASE 1 ====================
  {
    question: "P1 — Compréhension du besoin — L'essentiel",
    answer:
      "◆ **Junior** : reçoit l'énoncé → code immédiatement ◆ **Senior** : pose des questions → analyse → conçoit → justifie → code ◆ **Besoin implicite** : extraire ce qui n'est pas écrit (double achat, auto-achat) ◆ **Règles métier** : explicites (prix acheteur >= prix vendeur) + implicites (objet vendu une seule fois) ◆ **Documents** : Expression de besoin, User Stories, Process métier ⚠️ 70% des échecs projet viennent d'un besoin mal compris",
  },
  // ==================== PHASE 2 ====================
  {
    question: "P2 — Analyse fonctionnelle — L'essentiel",
    answer:
      "◆ **UML** : standard international, orienté objet, Use Case/Class/Sequence — adapté aux APIs REST ◆ **Merise** : standard français, orienté BDD, MCD/MLD/MCT — adapté aux bases relationnelles ◆ **Volumes** : < 1000 objets → dict/SQLite, 10k-100k → PostgreSQL + index, 100M+ → sharding + Redis ◆ **Risques** : race condition (UPDATE atomique), double requête (idempotency key), auto-achat (vérification) ◆ **Use Cases** : prix suffisant + disponible → OK, sinon KO ⚠️ L'analyse des risques commence en phase 2, pas en phase 5",
  },
  // ==================== PHASE 3 ====================
  {
    question: "P3 — Conception de la solution — L'essentiel",
    answer:
      "◆ **Structures** : dict O(1), list O(n), set O(1) unicité, heap O(log n) priorité, B-Tree O(log n) BDD ◆ **Architecture** : MVC/Hexagonale pour domaine complexe, Microservices pour grande équipe/scalabilité, Event-Driven pour asynchrone ◆ **Stateless** : aucune session serveur, chaque requête est indépendante — scalabilité horizontale facile ◆ **APIs** : REST (standard), GraphQL (frontend flexible), gRPC (inter-services), WebSocket (temps réel) ◆ **Cohérence** : UPDATE atomique WHERE status='available' — simple, efficace, sans surcoût ⚠️ Un dict bien utilisé remplace souvent une double boucle",
  },
  // ==================== PHASE 4 ====================
  {
    question: "P4 — Conception technique détaillée — L'essentiel",
    answer:
      "◆ **Langages** : Python (API/data), Java/C# (banque/assurance), Go (microservices), Rust/C++ (haute performance) ◆ **Stacks majoritaires** : Python+PostgreSQL (API REST), Java+Oracle (core banking), C#+SQL Server (finance Windows), Go+Kafka+PostgreSQL (microservices) ◆ **TDD** : classes, responsabilités, interactions — plan de construction ◆ **API Contract** : Swagger/OpenAPI → documentation + validation automatique ◆ **Modèle BDD** : items(id, titre, prix, status, vendeur), transactions(id, item_id, acheteur, prix_final) ◆ **Double achat** : UPDATE WHERE status='available' — rows_affected=1 → OK, 0 → KO ⚠️ Le choix du langage dépend du contexte, pas du goût personnel",
  },
  // ==================== PHASE 5 ====================
  {
    question: "P5 — Développement — L'essentiel",
    answer:
      "◆ **Architecture en couches** : API → Service → Repository → Modèle ◆ **Marketplace** : heap pour ordres (prix min), set pour sold (O(1)), dict pour lookup ◆ **Validation** : entrée → prix>0, titre non vide; métier → auto-achat interdit, objet disponible ◆ **Documentation** : README, Swagger (auto-généré), ADR (choix justifiés), Wiki (règles métier) ◆ **Code = traduction** : chaque décision des phases précédentes devient du code ⚠️ Le code devient simple quand le problème est bien compris",
  },
  // ==================== PHASE 6 ====================
  {
    question: "P6 — Validation — L'essentiel",
    answer:
      "◆ **Unitaires** : fonctions isolées, sans BDD — rapides, nombreux ◆ **Intégration** : API + BDD réelle — valide le flux ◆ **E2E** : flux complet utilisateur — UI → BDD → réponse ◆ **Charge** : comportement sous stress — 1000 req/sec ◆ **Mix Free Market** : unitaire +++, intégration ++, E2E +, charge + ◆ **Tests à écrire** : cas nominaux, cas d'erreur (prix insuffisant, objet introuvable, auto-achat), concurrence (double achat) ⚠️ Le coût d'un bug en production = 100x le coût d'un test",
  },
  // ==================== PHASE 7 ====================
  {
    question: "P7 — Déploiement — L'essentiel",
    answer:
      "◆ **Docker** : build → push → déployer ◆ **Kubernetes** : apply deployment.yaml → rollout status ◆ **Health check** : /health → { status: ok, version, db: connected } ◆ **Runbook** : app ne répond pas → rollout undo, latence > 500ms → EXPLAIN + index, 500 en masse → logs ◆ **Monitoring** : latence P95 (<200ms), taux erreur 5xx (<1%), tx/min (alerte si chute 50%) ◆ **Rollback** : kubectl rollout undo — rapide, sûr, indispensable ⚠️ Un bon déploiement n'est pas une fin, c'est un début (monitoring, alertes, runbook)",
  },
];

const questions = {
  moyen: [
    // ==================== PHASES ====================
    {
      question:
        "[Phases] Quelle est la différence fondamentale entre un junior et un senior face à un énoncé ?",
      options: [
        "Le senior code plus vite",
        "Le junior pose des questions, le senior code immédiatement",
        "Le senior pose des questions, analyse, conçoit, justifie puis code",
        "Il n'y a pas de différence",
      ],
      answer: "Le senior pose des questions, analyse, conçoit, justifie puis code",
      explanation:
        "Un junior reçoit l'énoncé et code immédiatement. Un senior pose des questions, analyse, conçoit, justifie puis code. Le code devient la partie la plus simple du travail.",
    },
    {
      question:
        "[Phases] Dans quel ordre se déroulent les 7 phases ?",
      options: [
        "Code → Tests → Déploiement → Besoin → Analyse → Conception → Tech",
        "Besoin → Analyse → Conception → Tech → Code → Tests → Déploiement",
        "Analyse → Besoin → Conception → Tech → Code → Tests → Déploiement",
        "Besoin → Conception → Analyse → Tech → Code → Tests → Déploiement",
      ],
      answer: "Besoin → Analyse → Conception → Tech → Code → Tests → Déploiement",
      explanation:
        "L'ordre est : P1 Besoin, P2 Analyse fonctionnelle, P3 Conception de la solution, P4 Conception technique, P5 Développement, P6 Validation, P7 Déploiement.",
    },
    {
      question:
        "[Phases] Quelle phase est la source numéro un d'échecs projet quand elle est bâclée ?",
      options: [
        "Phase 5 — Développement",
        "Phase 6 — Tests",
        "Phase 1 — Compréhension du besoin",
        "Phase 7 — Déploiement",
      ],
      answer: "Phase 1 — Compréhension du besoin",
      explanation:
        "La compréhension du besoin est la source numéro un d'échecs projet. Si le besoin est mal compris, tout le reste est faux.",
    },
    {
      question:
        "[Phases] À quelle phase les risques techniques doivent-ils être identifiés ?",
      options: [
        "Phase 5 — Développement",
        "Phase 2 — Analyse fonctionnelle",
        "Phase 7 — Déploiement",
        "Phase 4 — Conception technique",
      ],
      answer: "Phase 2 — Analyse fonctionnelle",
      explanation:
        "Les risques techniques (race condition, double requête HTTP, auto-achat) doivent être identifiés dès la phase 2, pas en phase 5.",
    },

    // ==================== UML vs MERISE ====================
    {
      question:
        "[UML vs Merise] Quelle est l'origine d'UML ?",
      options: [
        "France (années 80)",
        "International (OMG)",
        "États-Unis (années 90)",
        "Allemagne (années 70)",
      ],
      answer: "International (OMG)",
      explanation:
        "UML est un standard international créé par l'OMG (Object Management Group). Merise est un standard français des années 80.",
    },
    {
      question:
        "[UML vs Merise] Pour quel type de projet UML est-il le plus adapté ?",
      options: [
        "Base de données relationnelles uniquement",
        "Applications orientées objet, APIs, microservices",
        "Systèmes d'information non orientés objet",
        "Projets purement fonctionnels sans code",
      ],
      answer: "Applications orientées objet, APIs, microservices",
      explanation:
        "UML est adapté pour les applications orientées objet, les APIs REST et les microservices. Merise est plus adapté aux bases de données relationnelles.",
    },
    {
      question:
        "[UML vs Merise] Quel diagramme UML est le plus pertinent pour modéliser les acteurs de Free Market ?",
      options: [
        "Class Diagram",
        "Sequence Diagram",
        "Use Case Diagram",
        "Activity Diagram",
      ],
      answer: "Use Case Diagram",
      explanation:
        "Le Use Case Diagram identifie les acteurs (Vendeur, Acheteur) et leurs interactions avec le système. C'est le diagramme le plus pertinent pour les acteurs.",
    },
    {
      question:
        "[UML vs Merise] Pour Free Market, pourquoi UML a-t-il été choisi plutôt que Merise ?",
      options: [
        "Parce que Merise est plus récent",
        "Parce que Free Market est une application OOP avec API REST",
        "Parce que UML est français",
        "Parce que Merise ne fonctionne pas avec PostgreSQL",
      ],
      answer: "Parce que Free Market est une application OOP avec API REST",
      explanation:
        "Free Market est une application orientée objet avec API REST, donc UML est plus adapté. Merise conviendrait si on modélisait uniquement le schéma relationnel.",
    },

    // ==================== VOLUMES ====================
    {
      question:
        "[Volumes] Quelle solution est adaptée pour moins de 1 000 objets ?",
      options: [
        "PostgreSQL avec sharding",
        "SQLite ou dict Python en mémoire",
        "Kafka + workers",
        "Redis distribué",
      ],
      answer: "SQLite ou dict Python en mémoire",
      explanation:
        "Pour moins de 1 000 objets, un dict Python en mémoire ou SQLite suffit. Pas besoin d'infrastructure lourde.",
    },
    {
      question:
        "[Volumes] Quelle solution est adaptée pour 10k à 100k objets ?",
      options: [
        "SQLite",
        "PostgreSQL + index",
        "Redis uniquement",
        "Fichier JSON",
      ],
      answer: "PostgreSQL + index",
      explanation:
        "Pour 10k à 100k objets, PostgreSQL avec des index (notamment sur titre et status) est la solution adaptée.",
    },
    {
      question:
        "[Volumes] Quelle solution est adaptée pour des millions de transactions par jour ?",
      options: [
        "SQLite",
        "PostgreSQL seul",
        "Kafka + workers + PostgreSQL",
        "Dict Python",
      ],
      answer: "Kafka + workers + PostgreSQL",
      explanation:
        "Pour des millions de transactions par jour, il faut un traitement asynchrone avec Kafka + workers + PostgreSQL.",
    },
    {
      question:
        "[Volumes] Pour Free Market, quelle évolutivité a été choisie ?",
      options: [
        "Jusqu'à 1 000 objets",
        "Jusqu'à 1 million d'objets",
        "Jusqu'à 100 millions d'objets",
        "Aucune évolutivité prévue",
      ],
      answer: "Jusqu'à 1 million d'objets",
      explanation:
        "L'hypothèse de base est 1 000 objets avec 100 utilisateurs simultanés. L'évolutivité visée est jusqu'à 1 million d'objets.",
    },

    // ==================== RISQUES ====================
    {
      question:
        "[Risques] Comment protéger Free Market contre la race condition (double achat) ?",
      options: [
        "Utiliser un lock Python global",
        "UPDATE atomique WHERE status='available'",
        "Ajouter un sleep aléatoire",
        "Utiliser une file d'attente",
      ],
      answer: "UPDATE atomique WHERE status='available'",
      explanation:
        "L'UPDATE atomique avec condition WHERE status='available' garantit qu'une seule requête réussit. rows_affected=1 → OK, 0 → KO.",
    },
    {
      question:
        "[Risques] Comment protéger Free Market contre la double soumission HTTP ?",
      options: [
        "Ignorer la seconde requête",
        "Utiliser une idempotency key par requête",
        "Bloquer l'IP du client",
        "Ajouter un captcha",
      ],
      answer: "Utiliser une idempotency key par requête",
      explanation:
        "Une idempotency key unique par requête permet de dédoublonner : même si le navigateur soumet deux fois, le résultat est le même.",
    },
    {
      question:
        "[Risques] Comment protéger Free Market contre l'auto-achat ?",
      options: [
        "Ignorer le problème",
        "Vérifier que vendeur != acheteur dans la logique métier",
        "Bloquer tous les achats",
        "Utiliser un mot de passe pour chaque vente",
      ],
      answer: "Vérifier que vendeur != acheteur dans la logique métier",
      explanation:
        "Une vérification métier simple : si login == vendeur, retourner 'KO: auto-achat interdit'.",
    },

    // ==================== STRUCTURES DE DONNEES ====================
    {
      question:
        "[Structures] Quelle structure permet une recherche O(1) par clé ?",
      options: [
        "list",
        "dict / HashMap",
        "heap",
        "deque",
      ],
      answer: "dict / HashMap",
      explanation:
        "dict permet un accès O(1) par clé. C'est parfait pour indexer les objets par titre (ex: { titre: Item }).",
    },
    {
      question:
        "[Structures] Quelle structure est la plus adaptée pour détecter les doublons en O(1) ?",
      options: [
        "list",
        "dict",
        "set",
        "heap",
      ],
      answer: "set",
      explanation:
        "set offre une insertion et une recherche en O(1). Utilisé pour sold_titles (titres déjà vendus).",
    },
    {
      question:
        "[Structures] Quelle structure est la plus adaptée pour trouver le prix le plus bas en O(log n) ?",
      options: [
        "list",
        "dict",
        "set",
        "heap",
      ],
      answer: "heap",
      explanation:
        "heap (tas) maintient le minimum en tête. L'insertion est O(log n), l'extraction du min est O(log n) — idéal pour un carnet d'ordres.",
    },
    {
      question:
        "[Structures] En BDD, quel index est utilisé pour une recherche O(log n) ?",
      options: [
        "Hash index",
        "B-Tree index",
        "Bitmap index",
        "GIN index",
      ],
      answer: "B-Tree index",
      explanation:
        "B-Tree index permet une recherche, une insertion et une suppression en O(log n). C'est l'index standard pour les colonnes de recherche.",
    },
    {
      question:
        "[Structures] Quelle structure Python a une insertion en O(1) en fin de liste ?",
      options: [
        "list (append)",
        "set",
        "dict",
        "heap",
      ],
      answer: "list (append)",
      explanation:
        "list.append() est O(1) en moyenne. list est adaptée pour les collections ordonnées simples.",
    },
    {
      question:
        "[Structures] Pour Free Market, quel est l'usage du dict ?",
      options: [
        "Recherche d'un objet par titre en O(1)",
        "Tri des objets par prix",
        "Détection des doublons",
        "File de priorité",
      ],
      answer: "Recherche d'un objet par titre en O(1)",
      explanation:
        "dict { titre: Item } permet une recherche O(1) par titre. C'est l'usage principal du dict dans Free Market.",
    },
    {
      question:
        "[Structures] Pour Free Market, quel est l'usage du set ?",
      options: [
        "Recherche d'un objet par titre",
        "Détection des titres déjà vendus en O(1)",
        "Tri des prix",
        "File de priorité",
      ],
      answer: "Détection des titres déjà vendus en O(1)",
      explanation:
        "sold = set() permet de vérifier en O(1) si un titre est déjà vendu. C'est l'usage principal du set.",
    },
    {
      question:
        "[Structures] Pour Free Market, quel est l'usage du heap ?",
      options: [
        "Recherche d'un objet par titre",
        "Détection des doublons",
        "Matching du meilleur prix vendeur en O(log n)",
        "Stockage des utilisateurs",
      ],
      answer: "Matching du meilleur prix vendeur en O(log n)",
      explanation:
        "heap pour sell_orders permet de matcher le meilleur prix vendeur en O(log n). Chaque order est (prix, titre, vendeur).",
    },

    // ==================== ARCHITECTURE ====================
    {
      question:
        "[Architecture] Quelle architecture est adaptée pour un domaine métier complexe ?",
      options: [
        "Procédurale",
        "Hexagonale (ports & adapters)",
        "Microservices",
        "Monolithique simple",
      ],
      answer: "Hexagonale (ports & adapters)",
      explanation:
        "L'architecture hexagonale isole le domaine métier des détails techniques. Elle est adaptée pour un domaine métier complexe et est très testable.",
    },
    {
      question:
        "[Architecture] Quelle architecture est adaptée pour une grande équipe avec fort trafic ?",
      options: [
        "Procédurale",
        "MVC",
        "Microservices",
        "Hexagonale",
      ],
      answer: "Microservices",
      explanation:
        "Les microservices permettent la scalabilité indépendante et la séparation des équipes. L'overhead réseau est le principal inconvénient.",
    },
    {
      question:
        "[Architecture] Quelle architecture est adaptée pour un système asynchrone et découplé ?",
      options: [
        "MVC",
        "Microservices",
        "Event-Driven",
        "Hexagonale",
      ],
      answer: "Event-Driven",
      explanation:
        "L'architecture Event-Driven est asynchrone et résiliente. Elle est adaptée pour les flux d'événements, temps réel, découplage fort.",
    },
    {
      question:
        "[Architecture] Pour Free Market, quelle architecture a été choisie ?",
      options: [
        "Microservices",
        "Event-Driven",
        "Architecture en couches (MVC étendu)",
        "Hexagonale",
      ],
      answer: "Architecture en couches (MVC étendu)",
      explanation:
        "Architecture en couches : API → Service → Repository → Modèle. Adapté à un projet de taille moyenne, équipe réduite, besoin de testabilité.",
    },

    // ==================== STATELESS vs STATEFUL ====================
    {
      question:
        "[Stateless vs Stateful] Qu'est-ce qu'une API stateless ?",
      options: [
        "Une API qui conserve l'état utilisateur en session serveur",
        "Une API où chaque requête est indépendante et ne dépend pas d'un état serveur",
        "Une API qui utilise des WebSockets",
        "Une API qui ne peut pas être scalée",
      ],
      answer: "Une API où chaque requête est indépendante et ne dépend pas d'un état serveur",
      explanation:
        "Stateless = pas de session serveur. Chaque requête contient toutes les informations nécessaires. L'état est stocké en BDD.",
    },
    {
      question:
        "[Stateless vs Stateful] Quel est l'avantage principal d'une architecture stateless ?",
      options: [
        "Plus rapide à exécuter",
        "Scalabilité horizontale facile (n'importe quel nœud répond)",
        "Meilleure sécurité",
        "Moins de code à écrire",
      ],
      answer: "Scalabilité horizontale facile (n'importe quel nœud répond)",
      explanation:
        "Stateless permet à n'importe quel nœud de répondre à n'importe quelle requête. La scalabilité horizontale est donc facile.",
    },
    {
      question:
        "[Stateless vs Stateful] Pour Free Market, quel choix a été fait ?",
      options: [
        "Stateful avec sessions WebSocket",
        "Stateless avec API REST et état en BDD",
        "Stateful avec sticky sessions",
        "Hybride",
      ],
      answer: "Stateless avec API REST et état en BDD",
      explanation:
        "Free Market utilise API REST Stateless. L'état (objet vendu/disponible) est stocké en BDD, pas en mémoire serveur.",
    },

    // ==================== TYPES D'APIS ====================
    {
      question:
        "[APIs] Pour Free Market, quel type d'API a été choisi ?",
      options: [
        "GraphQL",
        "gRPC",
        "REST",
        "WebSocket",
      ],
      answer: "REST",
      explanation:
        "REST a été choisi car simple, universel, adapté au volume et aux cas d'usage du projet.",
    },
    {
      question:
        "[APIs] Quel protocole utilise gRPC ?",
      options: [
        "HTTP + JSON",
        "HTTP/2 + Protobuf",
        "TCP persistant",
        "TCP + broker",
      ],
      answer: "HTTP/2 + Protobuf",
      explanation:
        "gRPC utilise HTTP/2 et Protobuf pour la sérialisation. C'est rapide et avec un schéma strict.",
    },
    {
      question:
        "[APIs] Quel type d'API est adapté pour des requêtes flexibles avec des champs variables ?",
      options: [
        "REST",
        "GraphQL",
        "gRPC",
        "WebSocket",
      ],
      answer: "GraphQL",
      explanation:
        "GraphQL permet au frontend de demander exactement les champs dont il a besoin. C'est flexible pour des requêtes variables.",
    },

    // ==================== COHERENCE DISTRIBUEE ====================
    {
      question:
        "[Cohérence] Quel mécanisme Free Market utilise-t-il pour protéger contre le double achat ?",
      options: [
        "Optimistic locking",
        "Pessimistic locking (SELECT FOR UPDATE)",
        "UPDATE atomique WHERE status='available'",
        "Saga pattern",
      ],
      answer: "UPDATE atomique WHERE status='available'",
      explanation:
        "UPDATE atomique avec condition WHERE status='available' est simple, sans surcoût, atomique en SQL. C'est le choix pour Free Market.",
    },
    {
      question:
        "[Cohérence] Quel mécanisme est adapté pour les paiements en ligne (dédoublonnage) ?",
      options: [
        "UPDATE atomique",
        "Optimistic locking",
        "Idempotency key",
        "Saga pattern",
      ],
      answer: "Idempotency key",
      explanation:
        "Une idempotency key unique par requête permet de dédoublonner les paiements. Si la même requête arrive deux fois, elle est reconnue.",
    },
    {
      question:
        "[Cohérence] Quel mécanisme est adapté pour des transactions distribuées entre microservices ?",
      options: [
        "UPDATE atomique",
        "Optimistic locking",
        "Saga pattern",
        "Pessimistic locking",
      ],
      answer: "Saga pattern",
      explanation:
        "Le Saga pattern gère les transactions distribuées avec des séquences de transactions compensables. Adapté aux microservices.",
    },

    // ==================== STACKS TECHNO ====================
    {
      question:
        "[Stacks] Quelle stack est majoritairement utilisée pour les API REST ?",
      options: [
        "C# + SQL Server",
        "Python + PostgreSQL",
        "Java + Oracle",
        "Go + Kafka + PostgreSQL",
      ],
      answer: "Python + PostgreSQL",
      explanation:
        "Python + PostgreSQL est la stack majoritaire pour les API REST, marketplace, et data applications (ex: Django, FastAPI).",
    },
    {
      question:
        "[Stacks] Quelle stack est majoritairement utilisée pour le core banking (banque) ?",
      options: [
        "Python + PostgreSQL",
        "Java + Oracle",
        "C# + SQL Server",
        "Go + Kafka + PostgreSQL",
      ],
      answer: "Java + Oracle",
      explanation:
        "Java + Oracle est la stack majoritaire pour le core banking, les grandes banques et les assurances. Java est robuste, Oracle est fiable.",
    },
    {
      question:
        "[Stacks] Quelle stack est majoritairement utilisée pour les microservices haute disponibilité ?",
      options: [
        "Python + PostgreSQL",
        "Java + Oracle",
        "C# + SQL Server",
        "Go + Kafka + PostgreSQL",
      ],
      answer: "Go + Kafka + PostgreSQL",
      explanation:
        "Go + Kafka + PostgreSQL est une stack moderne pour les microservices haute disponibilité et fort trafic (fintech, e-commerce).",
    },
    {
      question:
        "[Stacks] Pour Free Market, quelle stack a été choisie ?",
      options: [
        "Java + Oracle",
        "C# + SQL Server",
        "Python + FastAPI + PostgreSQL",
        "Go + Kafka + PostgreSQL",
      ],
      answer: "Python + FastAPI + PostgreSQL",
      explanation:
        "Python + FastAPI + PostgreSQL — rapide à prototyper, lisible, cohérent avec le besoin de Free Market.",
    },

    // ==================== TYPES DE TESTS ====================
    {
      question:
        "[Tests] Quel type de test est le plus rapide et le moins coûteux ?",
      options: [
        "E2E",
        "Intégration",
        "Unitaire",
        "Charge",
      ],
      answer: "Unitaire",
      explanation:
        "Les tests unitaires sont très rapides et peu coûteux. Ils testent une fonction isolée, sans dépendances externes.",
    },
    {
      question:
        "[Tests] Quel type de test valide le flux complet utilisateur (UI → BDD → réponse) ?",
      options: [
        "Unitaire",
        "Intégration",
        "E2E (End-to-End)",
        "Contrat",
      ],
      answer: "E2E (End-to-End)",
      explanation:
        "E2E valide le flux complet utilisateur. C'est le plus lent et le plus coûteux mais le plus proche de la réalité.",
    },
    {
      question:
        "[Tests] Quel type de test valide le comportement sous stress (1000 req/sec) ?",
      options: [
        "Unitaire",
        "Intégration",
        "Charge / Performance",
        "Contrat",
      ],
      answer: "Charge / Performance",
      explanation:
        "Les tests de charge simulent un trafic élevé pour valider le comportement sous stress. Ils sont très lents et coûteux.",
    },
    {
      question:
        "[Tests] Pour Free Market, quel mix de tests a été choisi ?",
      options: [
        "Unitaires uniquement",
        "Unitaires + Intégration",
        "Unitaires + Intégration + E2E + Charge",
        "E2E uniquement",
      ],
      answer: "Unitaires + Intégration + E2E + Charge",
      explanation:
        "Free Market utilise : Unitaires (nombreux, rapides), Intégration (API → BDD), E2E (flux complet), Charge (1000 achat/sec).",
    },

    // ==================== MECANISMES DE PROTECTION ====================
    {
      question:
        "[Protection] Quelle requête SQL protège contre le double achat ?",
      options: [
        "SELECT * FROM items WHERE titre = :titre",
        "UPDATE items SET status='sold' WHERE titre = :titre AND status='available'",
        "DELETE FROM items WHERE titre = :titre",
        "INSERT INTO transactions VALUES (...)",
      ],
      answer: "UPDATE items SET status='sold' WHERE titre = :titre AND status='available'",
      explanation:
        "Cette UPDATE atomique garantit qu'une seule requête réussit. rows_affected=1 → OK, rows_affected=0 → KO.",
    },
    {
      question:
        "[Protection] Que vérifie la condition 'rows_affected == 1' après un UPDATE ?",
      options: [
        "Que la base de données fonctionne",
        "Que l'achat a réussi (un objet a été modifié)",
        "Que l'acheteur existe",
        "Que le prix est suffisant",
      ],
      answer: "Que l'achat a réussi (un objet a été modifié)",
      explanation:
        "rows_affected == 1 signifie qu'un objet était disponible et a été vendu. rows_affected == 0 signifie qu'il était déjà vendu.",
    },
  ],
  avance: [
    {
      question:
        "[Avancé] Quelle est la complexité de l'insertion dans un heap (tas) ?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)",
      ],
      answer: "O(log n)",
      explanation:
        "L'insertion dans un heap est O(log n) car l'élément doit remonter le tas pour maintenir la propriété de tas.",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre optimistic locking et pessimistic locking ?",
      options: [
        "Optimistic = verrouille la ligne, Pessimistic = vérifie la version",
        "Optimistic = vérifie la version avant écriture, Pessimistic = verrouille la ligne",
        "Optimistic = plus lent, Pessimistic = plus rapide",
        "Optimistic = utilisé pour les écritures, Pessimistic = pour les lectures",
      ],
      answer: "Optimistic = vérifie la version avant écriture, Pessimistic = verrouille la ligne",
      explanation:
        "Optimistic : on lit, on vérifie que la version n'a pas changé avant d'écrire. Pessimistic : on verrouille la ligne (SELECT FOR UPDATE).",
    },
    {
      question:
        "[Avancé] Pourquoi le jitter est-il important dans un backoff exponentiel ?",
      options: [
        "Pour accélérer les tentatives",
        "Pour éviter l'effet de 'thundering herd' (tous les clients réessaient en même temps)",
        "Pour réduire le code",
        "Pour améliorer la sécurité",
      ],
      answer: "Pour éviter l'effet de 'thundering herd' (tous les clients réessaient en même temps)",
      explanation:
        "Le jitter ajoute un peu de hasard au délai. Cela évite que tous les clients réessaient exactement en même temps, ce qui pourrait submerger le système.",
    },
    {
      question:
        "[Avancé] Pour Free Market, que permet l'utilisation d'une idempotency key sur /buy ?",
      options: [
        "Augmenter la vitesse des requêtes",
        "Empêcher la double soumission HTTP (même requête = même résultat)",
        "Réduire la charge BDD",
        "Permettre l'annulation des achats",
      ],
      answer: "Empêcher la double soumission HTTP (même requête = même résultat)",
      explanation:
        "L'idempotency key permet de dédoublonner : si le navigateur soumet deux fois la même requête, le résultat est le même (idempotent).",
    },
    {
      question:
        "[Avancé] Quelle architecture serait adaptée si Free Market devait gérer des millions de transactions par jour ?",
      options: [
        "Monolithe en Python",
        "Event-Driven + Kafka + workers",
        "Procédurale",
        "MVC simple",
      ],
      answer: "Event-Driven + Kafka + workers",
      explanation:
        "Pour des millions de transactions par jour, il faut une architecture asynchrone avec Event-Driven + Kafka + workers.",
    },
    {
      question:
        "[Avancé] Que signifie le pattern CQRS (Command Query Responsibility Segregation) ?",
      options: [
        "Séparer le code en deux fichiers",
        "Séparer les modèles de lecture et d'écriture",
        "Séparer les tests unitaires et d'intégration",
        "Séparer les APIs REST et GraphQL",
      ],
      answer: "Séparer les modèles de lecture et d'écriture",
      explanation:
        "CQRS sépare le modèle de lecture (query) du modèle d'écriture (command). Utile pour des charges de lecture très élevées.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE Senior] Que doit faire un senior en entretien face à un énoncé simple de marketplace ?",
      options: [
        "Ouvrir son éditeur et coder immédiatement",
        "Dérouler les 7 phases, justifier chaque choix, identifier les risques",
        "Donner une solution sans explication",
        "Dire que c'est trop simple",
      ],
      answer: "Dérouler les 7 phases, justifier chaque choix, identifier les risques",
      explanation:
        "Un senior déroule mentalement les 7 phases, justifie chaque choix (structure, architecture, langage, tests), et identifie les risques avant de coder.",
    },
    {
      question:
        "[PIÈGE Senior] Pourquoi le senior ne code-t-il pas immédiatement face à un énoncé ?",
      options: [
        "Il est plus lent que le junior",
        "Il préfère réfléchir avant de coder pour éviter de coder la mauvaise solution",
        "Il ne sait pas coder",
        "Il attend qu'on lui donne le code",
      ],
      answer: "Il préfère réfléchir avant de coder pour éviter de coder la mauvaise solution",
      explanation:
        "Le senior sait que le code devient simple quand le problème est bien compris. Il préfère comprendre, analyser et concevoir avant de coder.",
    },
    {
      question:
        "[PIÈGE Senior] Si Free Market devient un microservice interne, quel type d'API serait le plus adapté pour une communication rapide entre services ?",
      options: [
        "REST",
        "GraphQL",
        "gRPC",
        "WebSocket",
      ],
      answer: "gRPC",
      explanation:
        "gRPC est le plus adapté pour la communication inter-services rapide avec un schéma strict (Protobuf) et HTTP/2.",
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
