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
    // ==================== PHASES (4 questions) ====================
    {
      question:
        "[Phases] Quelle est la différence fondamentale entre un junior et un senior face à un énoncé ?",
      options: [
        "Le senior code plus vite que le junior",
        "Le junior pose des questions, le senior code immédiatement",
        "Le senior pose des questions, analyse, conçoit, justifie puis code",
        "Il n'y a aucune différence entre les deux",
      ],
      answer: "Le senior pose des questions, analyse, conçoit, justifie puis code",
      explanation:
        "Un junior reçoit l'énoncé et code immédiatement. Un senior pose des questions, analyse, conçoit, justifie puis code. Le code devient la partie la plus simple du travail.",
    },
    {
      question:
        "[Phases] Dans quel ordre se déroulent les 7 phases du processus ?",
      options: [
        "Code → Tests → Déploiement → Besoin → Analyse → Conception → Technique",
        "Analyse → Besoin → Conception → Technique → Code → Tests → Déploiement",
        "Besoin → Analyse → Conception → Technique → Code → Tests → Déploiement",
        "Besoin → Conception → Analyse → Technique → Code → Tests → Déploiement",
      ],
      answer: "Besoin → Analyse → Conception → Technique → Code → Tests → Déploiement",
      explanation:
        "L'ordre est : P1 Besoin, P2 Analyse fonctionnelle, P3 Conception de la solution, P4 Conception technique, P5 Développement, P6 Validation, P7 Déploiement.",
    },
    {
      question:
        "[Phases] Quelle phase est la source numéro un d'échecs projet quand elle est bâclée ?",
      options: [
        "Phase 5 — Développement (code mal écrit)",
        "Phase 6 — Tests (tests insuffisants)",
        "Phase 1 — Compréhension du besoin (besoin mal compris)",
        "Phase 7 — Déploiement (erreur de prod)",
      ],
      answer: "Phase 1 — Compréhension du besoin (besoin mal compris)",
      explanation:
        "La compréhension du besoin est la source numéro un d'échecs projet. Si le besoin est mal compris, tout le reste est faux, même si le code est parfait.",
    },
    {
      question:
        "[Phases] À quelle phase les risques techniques (race condition, double requête) doivent-ils être identifiés ?",
      options: [
        "Phase 5 — Développement (quand on écrit le code)",
        "Phase 2 — Analyse fonctionnelle (dès que possible)",
        "Phase 7 — Déploiement (quand c'est en prod)",
        "Phase 4 — Conception technique (quand on choisit la BDD)",
      ],
      answer: "Phase 2 — Analyse fonctionnelle (dès que possible)",
      explanation:
        "Les risques techniques doivent être identifiés dès la phase 2 (Analyse fonctionnelle), pas en phase 5. C'est là qu'on peut les anticiper et les mitiger.",
    },

    // ==================== UML vs MERISE (4 questions) ====================
    {
      question:
        "[UML vs Merise] Quelle est l'origine d'UML ?",
      options: [
        "France (années 80) — créé par l'INRIA",
        "International (OMG) — standard mondial",
        "États-Unis (années 90) — créé par Microsoft",
        "Allemagne (années 70) — créé par SAP",
      ],
      answer: "International (OMG) — standard mondial",
      explanation:
        "UML est un standard international créé par l'OMG (Object Management Group). C'est le standard de modélisation le plus utilisé dans le monde.",
    },
    {
      question:
        "[UML vs Merise] Pour quel type de projet UML est-il le plus adapté ?",
      options: [
        "Uniquement pour les bases de données relationnelles",
        "Applications orientées objet, APIs REST et microservices",
        "Uniquement pour les systèmes d'information non orientés objet",
        "Projets purement fonctionnels sans code",
      ],
      answer: "Applications orientées objet, APIs REST et microservices",
      explanation:
        "UML est adapté pour les applications orientées objet, les APIs REST et les microservices. Merise est plus adapté aux bases de données relationnelles.",
    },
    {
      question:
        "[UML vs Merise] Quel diagramme UML est le plus pertinent pour modéliser les acteurs de Free Market (Vendeur, Acheteur) ?",
      options: [
        "Class Diagram (diagramme de classes)",
        "Sequence Diagram (diagramme de séquence)",
        "Use Case Diagram (diagramme des cas d'usage)",
        "Activity Diagram (diagramme d'activité)",
      ],
      answer: "Use Case Diagram (diagramme des cas d'usage)",
      explanation:
        "Le Use Case Diagram identifie les acteurs (Vendeur, Acheteur) et leurs interactions avec le système. C'est le diagramme le plus pertinent pour modéliser les acteurs.",
    },
    {
      question:
        "[UML vs Merise] Pour Free Market, pourquoi UML a-t-il été choisi plutôt que Merise ?",
      options: [
        "Parce que Merise est plus récent et plus moderne",
        "Parce que Free Market est une application OOP avec API REST, pas une simple BDD",
        "Parce que UML est le seul standard français accepté",
        "Parce que Merise ne fonctionne pas avec PostgreSQL",
      ],
      answer: "Parce que Free Market est une application OOP avec API REST, pas une simple BDD",
      explanation:
        "Free Market est une application orientée objet avec API REST, donc UML est plus adapté. Merise conviendrait si on modélisait uniquement le schéma relationnel.",
    },

    // ==================== VOLUMES (4 questions) ====================
    {
      question:
        "[Volumes] Quelle solution est adaptée pour moins de 1 000 objets ?",
      options: [
        "PostgreSQL avec sharding sur plusieurs serveurs",
        "SQLite ou dict Python en mémoire (léger et simple)",
        "Kafka + workers + PostgreSQL (trop lourd)",
        "Redis distribué avec cluster de 10 nœuds",
      ],
      answer: "SQLite ou dict Python en mémoire (léger et simple)",
      explanation:
        "Pour moins de 1 000 objets, un dict Python en mémoire ou SQLite suffit. Pas besoin d'infrastructure lourde. On garde simple et rapide.",
    },
    {
      question:
        "[Volumes] Quelle solution est adaptée pour 10k à 100k objets avec recherche rapide ?",
      options: [
        "SQLite sans index (trop lent)",
        "PostgreSQL + index sur les colonnes de recherche",
        "Redis uniquement (pas de persistance)",
        "Fichier JSON lu à chaque requête",
      ],
      answer: "PostgreSQL + index sur les colonnes de recherche",
      explanation:
        "Pour 10k à 100k objets, PostgreSQL avec des index (notamment sur titre et status) est la solution adaptée. Les index B-Tree donnent des recherches O(log n).",
    },
    {
      question:
        "[Volumes] Quelle solution est adaptée pour des millions de transactions par jour en temps réel ?",
      options: [
        "SQLite avec des index (pas assez performant)",
        "PostgreSQL seul (va saturer)",
        "Kafka + workers + PostgreSQL (traitement asynchrone)",
        "Dict Python avec sauvegarde journalière",
      ],
      answer: "Kafka + workers + PostgreSQL (traitement asynchrone)",
      explanation:
        "Pour des millions de transactions par jour, il faut un traitement asynchrone avec Kafka + workers + PostgreSQL. Le flux est découplé et les workers traitent en parallèle.",
    },
    {
      question:
        "[Volumes] Pour Free Market, quelle évolutivité a été choisie comme objectif ?",
      options: [
        "Jusqu'à 1 000 objets (pas d'évolution prévue)",
        "Jusqu'à 1 million d'objets (objectif d'évolutivité)",
        "Jusqu'à 100 millions d'objets (sharding dès le départ)",
        "Aucune évolutivité prévue (architecture figée)",
      ],
      answer: "Jusqu'à 1 million d'objets (objectif d'évolutivité)",
      explanation:
        "L'hypothèse de base est 1 000 objets avec 100 utilisateurs simultanés. L'évolutivité visée est jusqu'à 1 million d'objets avec PostgreSQL + index.",
    },

    // ==================== RISQUES (4 questions) ====================
    {
      question:
        "[Risques] Comment protéger Free Market contre la race condition (double achat simultané) ?",
      options: [
        "Utiliser un lock global Python (bloque tout)",
        "UPDATE atomique WHERE status='available' (une seule ligne modifiée)",
        "Ajouter un sleep aléatoire de 2 secondes (solution hasardeuse)",
        "Utiliser une file d'attente FIFO (complexe et lent)",
      ],
      answer: "UPDATE atomique WHERE status='available' (une seule ligne modifiée)",
      explanation:
        "L'UPDATE atomique avec condition WHERE status='available' garantit qu'une seule requête réussit. rows_affected=1 → OK, rows_affected=0 → KO. C'est simple et efficace.",
    },
    {
      question:
        "[Risques] Comment protéger Free Market contre la double soumission HTTP (navigateur qui envoie deux fois) ?",
      options: [
        "Ignorer la seconde requête (perte de données)",
        "Utiliser une idempotency key par requête (dédoublonnage)",
        "Bloquer l'IP du client après chaque requête (trop strict)",
        "Ajouter un captcha à chaque achat (lourd pour l'utilisateur)",
      ],
      answer: "Utiliser une idempotency key par requête (dédoublonnage)",
      explanation:
        "Une idempotency key unique par requête permet de dédoublonner : même si le navigateur soumet deux fois, la seconde requête est reconnue et ignorée.",
    },
    {
      question:
        "[Risques] Comment protéger Free Market contre l'auto-achat (vendeur qui achète son propre objet) ?",
      options: [
        "Ignorer le problème (pas grave)",
        "Vérifier que vendeur != acheteur dans la logique métier",
        "Bloquer tous les achats (solution radicale)",
        "Utiliser un mot de passe spécifique pour chaque vente",
      ],
      answer: "Vérifier que vendeur != acheteur dans la logique métier",
      explanation:
        "Une vérification métier simple : if login == vendeur: return 'KO: auto-achat interdit'. C'est une règle implicite à implémenter.",
    },
    {
      question:
        "[Risques] Quelle est la conséquence d'une validation insuffisante des entrées API ?",
      options: [
        "Les performances sont légèrement meilleures",
        "Le code est plus court et plus simple",
        "Données invalides (titre vide, prix négatif) peuvent corrompre l'état du système",
        "Les tests sont plus faciles à écrire",
      ],
      answer: "Données invalides (titre vide, prix négatif) peuvent corrompre l'état du système",
      explanation:
        "Sans validation en entrée, des données invalides (titre vide, prix négatif, login null) peuvent être insérées et corrompre l'état du système.",
    },

    // ==================== STRUCTURES (8 questions) ====================
    {
      question:
        "[Structures] Quelle structure est la plus adaptée pour une recherche O(1) par clé (ex: trouver un objet par son titre) ?",
      options: [
        "list (accès par index O(1) mais recherche O(n))",
        "dict / HashMap (table de hachage, accès par clé O(1))",
        "heap / tas (priorité, O(log n) pour le min)",
        "deque (file doublement chaînée, O(1) aux extrémités)",
      ],
      answer: "dict / HashMap (table de hachage, accès par clé O(1))",
      explanation:
        "dict permet un accès O(1) par clé. C'est parfait pour indexer les objets par titre (ex: { 'livre': Item }). On appelle ça une table de hachage (hashmap).",
    },
    {
      question:
        "[Structures] Quelle structure est la plus adaptée pour détecter des doublons en O(1) (ex: titres déjà vendus) ?",
      options: [
        "list (recherche O(n), trop lent)",
        "dict (stocke clé+valeur, plus lourd que nécessaire)",
        "set (collection d'éléments uniques, test O(1))",
        "heap (structure de priorité, pas adaptée)",
      ],
      answer: "set (collection d'éléments uniques, test O(1))",
      explanation:
        "set offre une insertion et une recherche en O(1). C'est parfait pour sold_titles (titres déjà vendus). Un set = collection non ordonnée d'éléments uniques.",
    },
    {
      question:
        "[Structures] Quelle structure est la plus adaptée pour trouver l'élément le plus petit en O(log n) (ex: meilleur prix vendeur) ?",
      options: [
        "list (tri O(n log n) à chaque insertion)",
        "dict (recherche par clé, pas de notion de min)",
        "set (pas d'ordre, impossible de trouver le min)",
        "heap / tas (tas minimal, min en tête, insertion O(log n))",
      ],
      answer: "heap / tas (tas minimal, min en tête, insertion O(log n))",
      explanation:
        "heap (tas) maintient le minimum en tête. L'insertion est O(log n), l'extraction du min est O(log n). Syn : tas, file de priorité (priority queue).",
    },
    {
      question:
        "[Structures] En BDD, quel index est utilisé pour une recherche O(log n) sur une colonne (ex: titre) ?",
      options: [
        "Hash index (O(1) mais pas de tri)",
        "B-Tree index (arbre équilibré, recherche O(log n))",
        "Bitmap index (pour les colonnes à faibles cardinalités)",
        "GIN index (pour les types complexes comme JSON)",
      ],
      answer: "B-Tree index (arbre équilibré, recherche O(log n))",
      explanation:
        "B-Tree index (arbre équilibré) permet une recherche, une insertion et une suppression en O(log n). C'est l'index standard pour les colonnes de recherche.",
    },
    {
      question:
        "[Structures] Quelle est la complexité de l'insertion en fin de liste (list.append()) ?",
      options: [
        "O(1) en moyenne (amorti)",
        "O(log n)",
        "O(n)",
        "O(n log n)",
      ],
      answer: "O(1) en moyenne (amorti)",
      explanation:
        "list.append() est O(1) en moyenne (amorti). La liste alloue plus de mémoire que nécessaire, donc l'insertion en fin est très rapide.",
    },
    {
      question:
        "[Structures] Quelle est la complexité de la recherche d'un élément dans une liste non triée ?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n) (recherche linéaire)",
        "O(n log n)",
      ],
      answer: "O(n) (recherche linéaire)",
      explanation:
        "La recherche dans une liste non triée est O(n). On doit parcourir toute la liste jusqu'à trouver l'élément. Syn : recherche linéaire, parcours séquentiel.",
    },
    {
      question:
        "[Structures] Quelle est la complexité de l'extraction du minimum dans un heap (heap.pop()) ?",
      options: [
        "O(1) (le min est toujours en tête)",
        "O(log n) (il faut rééquilibrer le tas)",
        "O(n) (parcours complet)",
        "O(n log n) (tri complet)",
      ],
      answer: "O(log n) (il faut rééquilibrer le tas)",
      explanation:
        "L'extraction du minimum dans un heap est O(log n). Après avoir retiré la racine, il faut rééquilibrer le tas (heapify). C'est le coût de maintenance.",
    },
    {
      question:
        "[Structures] Pour Free Market, quel est l'usage du dict (table de hachage) ?",
      options: [
        "Trouver le meilleur prix vendeur rapidement",
        "Rechercher un objet par son titre en O(1)",
        "Détecter les titres déjà vendus",
        "Maintenir une file de priorité des ordres",
      ],
      answer: "Rechercher un objet par son titre en O(1)",
      explanation:
        "dict { titre: Item } permet une recherche O(1) par titre. Syn : table de hachage, hashmap, dictionnaire. C'est l'usage principal du dict dans Free Market.",
    },

    // ==================== ARCHITECTURE (3 questions) ====================
    {
      question:
        "[Architecture] Quelle architecture isole le domaine métier des détails techniques (ex: BDD, API) ?",
      options: [
        "Procédurale (tout en un seul script)",
        "Hexagonale / Ports & Adapters (domaine isolé, très testable)",
        "Microservices (services indépendants)",
        "Monolithe simple (tout dans une seule application)",
      ],
      answer: "Hexagonale / Ports & Adapters (domaine isolé, très testable)",
      explanation:
        "L'architecture hexagonale (ou Ports & Adapters) isole le domaine métier des détails techniques. Le domaine est pur, la BDD, l'API, etc. sont des adaptateurs. Très testable.",
    },
    {
      question:
        "[Architecture] Quelle architecture est adaptée pour une grande équipe avec forte scalabilité et indépendance des services ?",
      options: [
        "Procédurale (trop simple)",
        "MVC (séparation des couches, mais tout dans une app)",
        "Microservices (services indépendants, scalables, teams autonomes)",
        "Hexagonale (domaine isolé, pas de scalabilité native)",
      ],
      answer: "Microservices (services indépendants, scalables, teams autonomes)",
      explanation:
        "Les microservices permettent la scalabilité indépendante et la séparation des équipes. Chaque service est déployé séparément. Overhead réseau est le principal inconvénient.",
    },
    {
      question:
        "[Architecture] Pour Free Market, quelle architecture a été choisie ?",
      options: [
        "Microservices (trop complexe pour le besoin)",
        "Event-Driven (asynchrone, mais pas nécessaire)",
        "Architecture en couches (MVC étendu : API → Service → Repository → Modèle)",
        "Hexagonale (domaine pur, mais sur-engineering)",
      ],
      answer: "Architecture en couches (MVC étendu : API → Service → Repository → Modèle)",
      explanation:
        "Architecture en couches : API → Service → Repository → Modèle. Adapté à un projet de taille moyenne, équipe réduite, besoin de testabilité. C'est un MVC étendu.",
    },

    // ==================== STATELESS vs STATEFUL (2 questions) ====================
    {
      question:
        "[Stateless vs Stateful] Qu'est-ce qu'une API stateless ?",
      options: [
        "Une API qui conserve l'état utilisateur en session serveur (stateful)",
        "Une API où chaque requête est indépendante et ne dépend pas d'un état serveur",
        "Une API qui utilise des WebSockets pour maintenir une connexion persistante",
        "Une API qui ne peut pas être scalée horizontalement",
      ],
      answer: "Une API où chaque requête est indépendante et ne dépend pas d'un état serveur",
      explanation:
        "Stateless = pas de session serveur. Chaque requête contient toutes les informations nécessaires. L'état est stocké en BDD, pas en mémoire serveur. Syn : sans état, sans session.",
    },
    {
      question:
        "[Stateless vs Stateful] Pour Free Market, quel choix a été fait et pourquoi ?",
      options: [
        "Stateful avec WebSockets (temps réel)",
        "Stateless avec API REST et état en BDD (scalabilité horizontale facile)",
        "Stateful avec sticky sessions (coller un client à un serveur)",
        "Hybride (stateless pour les lectures, stateful pour les écritures)",
      ],
      answer: "Stateless avec API REST et état en BDD (scalabilité horizontale facile)",
      explanation:
        "Free Market utilise API REST Stateless. L'état (objet vendu/disponible) est stocké en BDD, pas en mémoire serveur. 10 instances peuvent répondre à n'importe quelle requête.",
    },

    // ==================== TYPES D'APIS (2 questions) ====================
    {
      question:
        "[APIs] Pour Free Market, quel type d'API a été choisi ?",
      options: [
        "GraphQL (flexible mais complexe)",
        "gRPC (rapide mais lourd pour un petit projet)",
        "REST (simple, universel, adapté)",
        "WebSocket (temps réel mais pas nécessaire)",
      ],
      answer: "REST (simple, universel, adapté)",
      explanation:
        "REST a été choisi car simple, universel, adapté au volume et aux cas d'usage du projet. C'est le standard pour les APIs publiques CRUD.",
    },
    {
      question:
        "[APIs] Quel protocole utilise gRPC pour la communication inter-services ?",
      options: [
        "HTTP + JSON (REST)",
        "HTTP/2 + Protobuf (binaire, schéma strict, rapide)",
        "TCP persistant (WebSocket)",
        "TCP + broker (Kafka)",
      ],
      answer: "HTTP/2 + Protobuf (binaire, schéma strict, rapide)",
      explanation:
        "gRPC utilise HTTP/2 et Protobuf (Protocol Buffers) pour la sérialisation binaire. C'est rapide, avec un schéma strict (.proto). Idéal pour la communication inter-services.",
    },

    // ==================== COHERENCE DISTRIBUEE (3 questions) ====================
    {
      question:
        "[Cohérence] Quel mécanisme Free Market utilise-t-il pour protéger contre le double achat ?",
      options: [
        "Optimistic locking (vérification de version)",
        "Pessimistic locking (SELECT FOR UPDATE, bloque la ligne)",
        "UPDATE atomique WHERE status='available' (simple et atomique)",
        "Saga pattern (pour les transactions distribuées)",
      ],
      answer: "UPDATE atomique WHERE status='available' (simple et atomique)",
      explanation:
        "UPDATE atomique avec condition WHERE status='available' est simple, sans surcoût, atomique en SQL. C'est le choix pour Free Market. Syn : UPDATE conditionnel, verrouillage au niveau de la ligne.",
    },
    {
      question:
        "[Cohérence] Quel mécanisme est adapté pour les paiements en ligne (dédoublonnage des requêtes) ?",
      options: [
        "UPDATE atomique WHERE status='available'",
        "Optimistic locking (vérification de version)",
        "Idempotency key (clé unique par requête)",
        "Saga pattern (séquence de transactions compensables)",
      ],
      answer: "Idempotency key (clé unique par requête)",
      explanation:
        "Une idempotency key unique par requête permet de dédoublonner les paiements. Si la même requête arrive deux fois, elle est reconnue. Syn : clé de dédoublonnage, token idempotent.",
    },
    {
      question:
        "[Cohérence] Quel mécanisme est adapté pour des transactions distribuées entre microservices (ex: paiement + livraison) ?",
      options: [
        "UPDATE atomique (une seule table)",
        "Optimistic locking (une seule BDD)",
        "Saga pattern (séquence de transactions compensables)",
        "Pessimistic locking (verrouillage de lignes)",
      ],
      answer: "Saga pattern (séquence de transactions compensables)",
      explanation:
        "Le Saga pattern gère les transactions distribuées avec des séquences de transactions compensables. Chaque microservice exécute son étape, et peut la compenser si nécessaire.",
    },

    // ==================== STACKS TECHNO (4 questions) ====================
    {
      question:
        "[Stacks] Quelle stack est majoritairement utilisée pour les API REST et data applications (marketplace, Django) ?",
      options: [
        "C# + SQL Server (finance Windows)",
        "Python + PostgreSQL (API REST, data, marketplace)",
        "Java + Oracle (core banking, assurance)",
        "Go + Kafka + PostgreSQL (microservices haute dispo)",
      ],
      answer: "Python + PostgreSQL (API REST, data, marketplace)",
      explanation:
        "Python + PostgreSQL est la stack majoritaire pour les API REST, marketplace, et data applications (ex: Django, FastAPI, Flask). Rapide à développer, lisible.",
    },
    {
      question:
        "[Stacks] Quelle stack est majoritairement utilisée pour le core banking (banques, assurances) ?",
      options: [
        "Python + PostgreSQL (trop simple)",
        "Java + Oracle (robuste, éprouvé, conforme)",
        "C# + SQL Server (finance Windows)",
        "Go + Kafka + PostgreSQL (moderne mais moins éprouvé)",
      ],
      answer: "Java + Oracle (robuste, éprouvé, conforme)",
      explanation:
        "Java + Oracle est la stack majoritaire pour le core banking, les grandes banques et les assurances. Java est robuste, Oracle est fiable et conforme aux régulations.",
    },
    {
      question:
        "[Stacks] Quelle stack est majoritairement utilisée pour les microservices haute disponibilité et fort trafic ?",
      options: [
        "Python + PostgreSQL (pas assez performant)",
        "Java + Oracle (trop lourd pour des microservices)",
        "C# + SQL Server (écosystème Microsoft)",
        "Go + Kafka + PostgreSQL (moderne, scalable, concurrent)",
      ],
      answer: "Go + Kafka + PostgreSQL (moderne, scalable, concurrent)",
      explanation:
        "Go + Kafka + PostgreSQL est une stack moderne pour les microservices haute disponibilité et fort trafic (fintech, e-commerce). Go a une concurrence native, Kafka pour le streaming.",
    },
    {
      question:
        "[Stacks] Pour Free Market, quelle stack a été choisie et pourquoi ?",
      options: [
        "Java + Oracle (trop lourd pour un petit projet)",
        "C# + SQL Server (pas adapté au contexte)",
        "Python + FastAPI + PostgreSQL (rapide à prototyper, lisible, cohérent)",
        "Go + Kafka + PostgreSQL (sur-engineering)",
      ],
      answer: "Python + FastAPI + PostgreSQL (rapide à prototyper, lisible, cohérent)",
      explanation:
        "Python + FastAPI + PostgreSQL a été choisi car rapide à prototyper, lisible, cohérent avec le besoin de Free Market. FastAPI est moderne, Python est accessible, PostgreSQL est fiable.",
    },

    // ==================== TYPES DE TESTS (3 questions) ====================
    {
      question:
        "[Tests] Quel type de test est le plus rapide et le moins coûteux (teste une fonction isolée) ?",
      options: [
        "E2E (flux complet utilisateur, lent et coûteux)",
        "Intégration (API + BDD, moyen)",
        "Unitaire (fonction isolée, sans dépendances externes, très rapide)",
        "Charge (1000 req/sec, très lent et coûteux)",
      ],
      answer: "Unitaire (fonction isolée, sans dépendances externes, très rapide)",
      explanation:
        "Les tests unitaires sont très rapides et peu coûteux. Ils testent une fonction isolée, sans dépendances externes (pas de BDD, pas d'API). Syn : test de boîte blanche, test de méthode.",
    },
    {
      question:
        "[Tests] Quel type de test valide le flux complet utilisateur (UI → BDD → réponse) ?",
      options: [
        "Unitaire (trop petit pour un flux complet)",
        "Intégration (API + BDD, pas l'UI)",
        "E2E / End-to-End (flux complet, du clic utilisateur à la réponse)",
        "Contrat (interface entre services)",
      ],
      answer: "E2E / End-to-End (flux complet, du clic utilisateur à la réponse)",
      explanation:
        "E2E valide le flux complet utilisateur. C'est le plus lent et le plus coûteux mais le plus proche de la réalité. Syn : test de bout en bout, test système.",
    },
    {
      question:
        "[Tests] Pour Free Market, quel mix de tests a été choisi ?",
      options: [
        "Unitaires uniquement (pas assez de couverture)",
        "Unitaires + Intégration (E2E et Charge pas nécessaires)",
        "Unitaires + Intégration + E2E + Charge (couverture complète)",
        "E2E uniquement (trop lent pour le développement)",
      ],
      answer: "Unitaires + Intégration + E2E + Charge (couverture complète)",
      explanation:
        "Free Market utilise : Unitaires (nombreux, rapides), Intégration (API → BDD), E2E (flux complet), Charge (1000 achat/sec). Chaque type de test apporte une valeur différente.",
    },

    // ==================== MECANISMES DE PROTECTION (2 questions) ====================
    {
      question:
        "[Protection] Quelle requête SQL protège contre le double achat ?",
      options: [
        "SELECT * FROM items WHERE titre = :titre (lecture seule)",
        "UPDATE items SET status='sold' WHERE titre = :titre AND status='available' (atomique)",
        "DELETE FROM items WHERE titre = :titre (suppression au lieu de vente)",
        "INSERT INTO transactions VALUES (...) (enregistrement après coup)",
      ],
      answer: "UPDATE items SET status='sold' WHERE titre = :titre AND status='available' (atomique)",
      explanation:
        "Cette UPDATE atomique garantit qu'une seule requête réussit. rows_affected=1 → OK, rows_affected=0 → KO. Syn : UPDATE conditionnel, verrouillage de ligne en BDD.",
    },
    {
      question:
        "[Protection] Que signifie 'rows_affected == 0' après un UPDATE conditionnel ?",
      options: [
        "La base de données est hors ligne",
        "L'achat a réussi (un objet a été vendu)",
        "L'achat a échoué (objet déjà vendu ou inexistant)",
        "L'acheteur n'existe pas",
      ],
      answer: "L'achat a échoué (objet déjà vendu ou inexistant)",
      explanation:
        "rows_affected == 0 signifie qu'aucune ligne n'a été modifiée. Donc soit l'objet était déjà vendu (status != 'available'), soit il n'existe pas.",
    },
  ],
  avance: [
    // ==================== STRUCTURES AVANCEES ====================
    {
      question:
        "[Avancé] Quelle est la complexité de l'insertion dans un heap (tas) ?",
      options: [
        "O(1) — comme une insertion en fin de liste",
        "O(log n) — remontée du tas pour maintenir la propriété",
        "O(n) — parcours complet du tas",
        "O(n log n) — tri complet du tas",
      ],
      answer: "O(log n) — remontée du tas pour maintenir la propriété",
      explanation:
        "L'insertion dans un heap est O(log n) car l'élément doit 'remonter' le tas (sift up) pour maintenir la propriété de tas (parent < enfant pour un min-heap).",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre optimistic locking et pessimistic locking ?",
      options: [
        "Optimistic = verrouille la ligne, Pessimistic = vérifie la version",
        "Optimistic = vérifie la version avant écriture, Pessimistic = verrouille la ligne (SELECT FOR UPDATE)",
        "Optimistic est plus lent que Pessimistic (contraire)",
        "Optimistic est utilisé pour les lectures, Pessimistic pour les écritures",
      ],
      answer: "Optimistic = vérifie la version avant écriture, Pessimistic = verrouille la ligne (SELECT FOR UPDATE)",
      explanation:
        "Optimistic : on lit, on vérifie que la version n'a pas changé avant d'écrire. Pessimistic : on verrouille la ligne (SELECT FOR UPDATE) pour empêcher toute autre écriture.",
    },
    {
      question:
        "[Avancé] Quelle architecture serait adaptée si Free Market devait gérer des millions de transactions par jour en temps réel ?",
      options: [
        "Monolithe en Python (simple mais limité)",
        "Event-Driven + Kafka + workers (asynchrone, scalable)",
        "Procédurale (script unique)",
        "MVC simple (pas assez scalable)",
      ],
      answer: "Event-Driven + Kafka + workers (asynchrone, scalable)",
      explanation:
        "Pour des millions de transactions par jour, il faut une architecture asynchrone avec Event-Driven + Kafka + workers. Le flux est découplé, les workers traitent en parallèle.",
    },
    {
      question:
        "[Avancé] Que signifie le pattern CQRS (Command Query Responsibility Segregation) ?",
      options: [
        "Séparer le code en deux fichiers (front/back)",
        "Séparer les modèles de lecture (Query) et d'écriture (Command)",
        "Séparer les tests unitaires et d'intégration (two-track)",
        "Séparer les APIs REST et GraphQL (multi-interface)",
      ],
      answer: "Séparer les modèles de lecture (Query) et d'écriture (Command)",
      explanation:
        "CQRS sépare le modèle de lecture (query) du modèle d'écriture (command). Utile pour des charges de lecture très élevées, ou quand lecture et écriture ont des contraintes différentes.",
    },
    {
      question:
        "[Avancé] Quelle est la complexité de l'extraction du minimum dans un heap (heapq.heappop) ?",
      options: [
        "O(1) — le min est toujours en tête",
        "O(log n) — il faut rééquilibrer le tas après extraction",
        "O(n) — il faut parcourir tout le tas",
        "O(n log n) — tri complet du tas",
      ],
      answer: "O(log n) — il faut rééquilibrer le tas après extraction",
      explanation:
        "heappop() est O(log n). Après avoir retiré la racine, le dernier élément est placé en tête, puis 'descend' (sift down) pour rééquilibrer le tas. Syn : heapify partiel.",
    },
    {
      question:
        "[Avancé] En BDD, un index B-Tree est particulièrement efficace pour :",
      options: [
        "Les égalités exactes uniquement (WHERE x = 5)",
        "Les égalités et les recherches par intervalle (WHERE x > 5 AND x < 10)",
        "Les recherches floues uniquement (LIKE '%pattern%')",
        "Les recherches dans des champs JSON uniquement",
      ],
      answer: "Les égalités et les recherches par intervalle (WHERE x > 5 AND x < 10)",
      explanation:
        "B-Tree est efficace pour les égalités exactes ET pour les recherches par intervalle (range queries). L'arbre équilibré permet de parcourir les feuilles dans l'ordre.",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre un set et un dict en Python en termes de performance mémoire ?",
      options: [
        "set utilise plus de mémoire que dict (contraire)",
        "dict utilise plus de mémoire car il stocke clés ET valeurs (set ne stocke que les éléments)",
        "Ils ont la même empreinte mémoire",
        "set n'utilise pas de table de hachage, dict si",
      ],
      answer: "dict utilise plus de mémoire car il stocke clés ET valeurs (set ne stocke que les éléments)",
      explanation:
        "dict stocke paires (clé, valeur) → plus de mémoire. set stocke uniquement les éléments → moins de mémoire. Les deux utilisent une table de hachage.",
    },
    {
      question:
        "[Avancé] Pourquoi le backoff exponentiel est-il recommandé dans les mécanismes de retry ?",
      options: [
        "Pour accélérer les tentatives (backoff = accélération)",
        "Pour éviter l'effet de 'thundering herd' (tous les clients réessaient en même temps)",
        "Pour réduire le code (moins de lignes)",
        "Pour améliorer la sécurité (temps d'attente variable)",
      ],
      answer: "Pour éviter l'effet de 'thundering herd' (tous les clients réessaient en même temps)",
      explanation:
        "Le backoff exponentiel (1s, 2s, 4s, 8s) espace les tentatives. Le jitter (hasard) ajoute une variation pour éviter que tous les clients réessaient exactement en même temps.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE Senior] Que doit faire un Tech Lead en entretien face à un énoncé simple de marketplace ?",
      options: [
        "Ouvrir son éditeur et coder immédiatement (solution rapide)",
        "Dérouler les 7 phases, justifier chaque choix, identifier les risques",
        "Donner une solution sans explication (timeboxing)",
        "Refuser l'exercice en disant que c'est trop simple",
      ],
      answer: "Dérouler les 7 phases, justifier chaque choix, identifier les risques",
      explanation:
        "Un Tech Lead déroule mentalement les 7 phases, justifie chaque choix (structure, architecture, langage, tests), et identifie les risques avant de coder. C'est ce qu'on attend d'un senior en entretien.",
    },
    {
      question:
        "[PIÈGE Senior] Si Free Market devient un microservice interne, quel type d'API est le plus adapté pour la communication rapide entre services avec un schéma strict ?",
      options: [
        "REST (standard mais verbeux)",
        "GraphQL (flexible mais lourd pour inter-services)",
        "gRPC (HTTP/2 + Protobuf, rapide et schéma strict)",
        "WebSocket (temps réel, mais pas adapté pour des appels RPC)",
      ],
      answer: "gRPC (HTTP/2 + Protobuf, rapide et schéma strict)",
      explanation:
        "gRPC est le plus adapté pour la communication inter-services rapide avec un schéma strict (Protobuf) et HTTP/2. Idéal pour des microservices qui s'appellent fréquemment.",
    },
    {
      question:
        "[PIÈGE Senior] Pourquoi le choix de la structure de données (dict vs list vs set) est-il crucial en conception ?",
      options: [
        "Parce que toutes les structures sont équivalentes",
        "Parce que le choix impacte la complexité algorithmique (O(1) vs O(n)) et donc la performance",
        "Parce que les structures Python sont toutes optimisées de la même façon",
        "Parce que le code est plus beau avec un dict",
      ],
      answer: "Parce que le choix impacte la complexité algorithmique (O(1) vs O(n)) et donc la performance",
      explanation:
        "Le choix de structure est crucial : dict = O(1) recherche, list = O(n) recherche. Un mauvais choix transforme un algorithme rapide en algorithme lent. Un senior connaît ces complexités.",
    },
    {
      question:
        "[PIÈGE Senior] Quel est le principal piège d'une API stateful dans un environnement cloud scalable ?",
      options: [
        "La sécurité est moins bonne",
        "La session est liée à un serveur spécifique → si le serveur tombe, la session est perdue",
        "Les requêtes sont plus rapides",
        "Le code est plus simple à écrire",
      ],
      answer: "La session est liée à un serveur spécifique → si le serveur tombe, la session est perdue",
      explanation:
        "Stateful = l'état est lié à un serveur spécifique. En cloud (load balancer), une requête peut aller à un autre serveur qui n'a pas l'état. Si le serveur tombe, la session est perdue.",
    },
    {
      question:
        "[PIÈGE Senior] Dans le modèle Free Market, pourquoi la colonne titre est-elle marquée UNIQUE ?",
      options: [
        "Pour que le titre soit plus long",
        "Pour empêcher deux objets avec le même titre (unicité naturelle d'un objet)",
        "Pour accélérer les requêtes SELECT",
        "Parce que c'est obligatoire en PostgreSQL",
      ],
      answer: "Pour empêcher deux objets avec le même titre (unicité naturelle d'un objet)",
      explanation:
        "titre est UNIQUE car un objet est identifié par son titre dans Free Market. Cela empêche la duplication et garantit l'intégrité référentielle au niveau BDD.",
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
