// src/projects/BackendInterview/BackendInterviewQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — Backend Development Interview",
    "answer": "**APIs & REST** : conception, versioning, sécurisation des interfaces serveur, méthodes HTTP, status codes. ◆ **Bases de données** : SQL vs NoSQL, transactions ACID, injection SQL, réplication, migrations de schéma. ◆ **Architecture** : microservices, message queues, caching distribué, reverse proxy, load balancing. ◆ **Sécurité** : SQL injection, HTTPS, authentification (JWT, OAuth, sessions), GDPR, chiffrement at-rest/in-transit. ◆ **Performance & scalabilité** : rate limiting, CI/CD, monitoring APM, scalabilité horizontale, containerisation. ◆ **Gestion d'état & sessions** : stateless HTTP, sticky sessions, store centralisé, CAP theorem, cohérence éventuelle."
  },
  {
    "question": "API Endpoint — Définition et rôle",
    "answer": "**Définition** : URL spécifique agissant comme point d'entrée vers une fonctionnalité d'un service backend. ◆ **Fonctionnement** : le client envoie une requête HTTP (avec payload optionnel), le serveur traite et retourne une réponse. Chaque endpoint mappe une fonctionnalité métier distincte. ◆ **Exemple** : `POST /v1/users` → crée un utilisateur. `GET /v1/orders/42` → retourne la commande 42. `DELETE /v1/sessions/{id}` → déconnecte l'utilisateur. ◆ **Bonne pratique** : nommer les endpoints par ressource (nom), pas par action (verbe) — le verbe HTTP fait le travail."
  },
  {
    "question": "RESTful API — Principes fondamentaux",
    "answer": "**Client-serveur** : séparation stricte des responsabilités. ◆ **Stateless** : chaque requête contient toutes les informations nécessaires — le serveur ne conserve aucun contexte. ◆ **Interface uniforme** : ressources identifiées par URI, représentation modifiable, messages auto-descriptifs, HATEOAS (liens vers actions disponibles). ◆ **Système en couches** : intermédiaires (cache, proxy) transparents pour le client. ◆ **Cacheable** : les réponses indiquent si elles peuvent être mises en cache (header `Cache-Control`). ◆ **Code on Demand** (optionnel) : le serveur peut envoyer du code exécutable au client."
  },
  {
    "question": "HTTP Request/Response Cycle",
    "answer": "**1. Ouverture TCP** : connexion sur port 80 (HTTP) ou 443 (HTTPS). ◆ **2. Envoi requête** : méthode (`GET`, `POST`, `PUT`, `DELETE`...) + URI + version HTTP + headers + body optionnel. ◆ **3. Traitement serveur** : parsing, authentification, logique métier, accès DB. ◆ **4. Envoi réponse** : version HTTP + status code (200, 201, 400, 401, 404, 429, 500...) + headers + body optionnel. ◆ **5. Fermeture connexion** : ou keep-alive avec HTTP/1.1, multiplexage avec HTTP/2. ◆ **Headers importants** : `Authorization`, `Content-Type`, `Cache-Control`, `X-Request-ID`."
  },
  {
    "question": "SQL vs NoSQL — Choisir la bonne base de données",
    "answer": "**SQL (relationnel)** : schéma prédéfini, tables et relations, transactions ACID, requêtes complexes (JOIN). Ex : PostgreSQL, MySQL, SQL Server. Idéal pour : données financières, e-commerce, tout domaine avec relations fortes. ◆ **NoSQL** : sans schéma fixe, collections flexibles, scalabilité horizontale native. Ex : MongoDB (documents), Redis (clé-valeur), Cassandra (colonnes), Neo4j (graphes). Idéal pour : logs, sessions, catalogs produits, réseaux sociaux. ◆ **Règle** : SQL = données structurées avec invariants forts. NoSQL = flexibilité et volume à l'échelle."
  },
  {
    "question": "Injection SQL — Attaque et protections",
    "answer": "**Attaque** : concaténation de données utilisateur non filtrées dans une requête SQL. `SELECT * FROM users WHERE name = '` + userInput → si `userInput = \"' OR 1=1 --\"` : accès complet. ◆ **Protection 1 — Requêtes paramétrées** : `SELECT * FROM users WHERE id = ?` + paramètre séparé. Le driver traite la donnée comme donnée, jamais comme code. ◆ **Protection 2 — ORM** : Hibernate, SQLAlchemy, Entity Framework génèrent des requêtes sécurisées automatiquement. ◆ **Protection 3 — Échappement** : liste noire de caractères spéciaux à neutraliser. Moins fiable — préférer les deux premières."
  },
  {
    "question": "Gestion des sessions — Fonctionnement complet",
    "answer": "**1. Création** : à la connexion, le backend génère un session ID unique. ◆ **2. Stockage** : session data indexée par ID dans Redis (haute performance I/O) ou en base. ◆ **3. Transmission** : session ID retourné au client via cookie `HttpOnly; Secure`. ◆ **4. Utilisation** : à chaque requête, le client envoie le cookie → le serveur récupère la session. ◆ **5. Fermeture** : à la déconnexion ou expiration, le session ID est supprimé. ◆ **Problème load balancing** : sticky sessions (même serveur toujours) ou store centralisé partagé (Redis)."
  },
  {
    "question": "Rate Limiting — Protection des APIs",
    "answer": "**Définition** : limiter le nombre de requêtes acceptées par client sur une fenêtre temporelle. ◆ **Algorithmes** : Fixed Window Counter (simple, vulnérable aux pics en bord de fenêtre), Sliding Log Window (précis, coûteux), Token Bucket (burst autorisé), Leaky Bucket (débit constant). ◆ **Implémentation** : compteurs stockés dans Redis par IP/clé API. Réponse standard : `429 Too Many Requests` + header `Retry-After`. ◆ **Exemple** : API publique → 100 req/min par IP. API authentifiée → 1000 req/min par token. ◆ **Complément** : API Gateway (Kong, AWS API GW) embarque souvent cette fonctionnalité."
  },
  {
    "question": "Authentification & Sécurisation d'API",
    "answer": "**Méthodes d'auth** : OAuth 2.0 (délégation d'autorisation tiers), JWT Bearer Token (stateless, auto-porteur), Session-based (stateful, cookie), API Key (services B2B). ◆ **HTTPS obligatoire** : chiffre les données en transit, empêche l'interception. Port 443. ◆ **CORS** : politique de même origine — configurer les domaines autorisés pour éviter les requêtes cross-site non voulues. ◆ **Authorization** : après authentification, vérifier que le client a accès à la ressource demandée (RBAC, ACL). ◆ **Headers sécurité** : `Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy`."
  },
  {
    "question": "Message Queue — Architecture événementielle",
    "answer": "**Définition** : composant d'architecture distribuée permettant la communication asynchrone entre services via des messages persistés dans une file. ◆ **Pattern pub/sub** : le producteur publie sur un topic, N consommateurs s'y abonnent indépendamment. ◆ **Avantages** : découplage temporel (producteur et consommateur n'ont pas besoin d'être disponibles simultanément), tolérance aux pannes (messages persistés), scalabilité des consommateurs. ◆ **Outils** : RabbitMQ (AMQP, simple), Kafka (haute performance, rejouable), Amazon SQS (managed). ◆ **Cas d'usage** : processus longs (email, paiement), inter-services communication, event sourcing."
  },
  {
    "question": "Microservices — Architecture et décomposition",
    "answer": "**Définition** : structurer une application comme une collection de services indépendants, chacun responsable d'un domaine métier précis et déployable séparément. ◆ **Avantages** : scalabilité indépendante, flexibilité technologique, déploiements rapides, isolation des pannes. ◆ **Inconvénients** : complexité orchestration, debugging difficile (trace cross-service), overhead de communication. ◆ **Décomposition d'un monolithe** : (1) identifier les bounded contexts, (2) définir les services par domaine, (3) découpler les bases de données, (4) refactoring incrémental. ◆ **Patterns associés** : API Gateway, Service Discovery, Circuit Breaker, Sidecar."
  },
  {
    "question": "Caching — Stratégies et implémentation",
    "answer": "**Pourquoi** : réduire la latence et la charge sur les systèmes sources (DB, APIs externes). ◆ **Cache distribué** : cluster Redis avec consistent hashing pour distribuer les clés, réplication pour la tolérance aux pannes. ◆ **Politiques d'éviction** : LRU (Least Recently Used — évince le plus ancien accès), LFU (Least Frequently Used), TTL (Time-To-Live), FIFO. ◆ **Cache invalidation** : le problème difficile. Stratégies : TTL court, invalidation sur écriture (write-through), invalidation événementielle (Kafka). ◆ **Cache-aside pattern** : l'application gère elle-même le cache : lire Redis → miss → lire DB → écrire Redis."
  },
  {
    "question": "CI/CD Pipeline — Intégration et déploiement continus",
    "answer": "**Déclencheur** : push sur une branche Git spécifique (main, release). ◆ **Étapes** : lint → tests unitaires → build (Docker image) → push registre → tests d'intégration → déploiement staging → smoke tests → déploiement production. ◆ **Outils** : GitHub Actions, GitLab CI/CD, CircleCI, Jenkins. ◆ **Artifacts** : stocker les livrables dans JFrog Artifactory ou ECR. ◆ **Rollback** : stratégie de retour arrière en cas d'échec (blue-green, feature flags). ◆ **Règle d'or** : si les tests échouent, le pipeline s'arrête — aucun code cassé n'atteint la production."
  },
  {
    "question": "Scalabilité horizontale — Load balancing et statelessness",
    "answer": "**Scaling horizontal** : ajouter des instances identiques derrière un load balancer plutôt que rendre une instance plus puissante. ◆ **Prérequis** : les services doivent être stateless — tout état externalisé (Redis, DB). ◆ **Load balancer** : Round Robin (tour à tour), Least Connections (vers l'instance la moins chargée), IP Hash (sticky sessions). ◆ **Sticky sessions** : rediriger toujours le même client vers la même instance (problème : distribution inégale). ◆ **Store centralisé** : externaliser les sessions dans Redis — toutes les instances lisent le même état. ◆ **Auto-scaling** : Kubernetes HPA (Horizontal Pod Autoscaler) scale selon la charge CPU/mémoire."
  },
  {
    "question": "CAP Theorem — Compromis des bases distribuées",
    "answer": "**Consistency (C)** : toute lecture retourne la version la plus récente écrite. ◆ **Availability (A)** : toute requête reçoit une réponse valide (pas forcément la plus récente). ◆ **Partition Tolerance (P)** : le système continue de fonctionner même si des nœuds sont isolés réseau. ◆ **Théorème** : un système distribué ne peut garantir que 2 des 3 simultanément. ◆ **CP** : cohérence + partition → peut refuser des requêtes si partition (HBase, Zookeeper). ◆ **AP** : disponibilité + partition → peut retourner des données périmées (CouchDB, DynamoDB en mode AP). ◆ **CA** : théorique uniquement — impossible en réseau distribué réel."
  },
  {
    "question": "Réplication de base de données — Haute disponibilité",
    "answer": "**Principe** : dupliquer les données sur plusieurs instances pour la tolérance aux pannes et les performances en lecture. ◆ **Master-slave (primary-replica)** : le master accepte les écritures, les slaves reçoivent les mises à jour par réplication. ◆ **Avantages** : failover automatique (un slave devient master si le master tombe), lecture distribuée sur les replicas (soulage le master). ◆ **Cohérence** : réplication synchrone (cohérence forte, latence d'écriture élevée) vs asynchrone (performances meilleures, petit délai de propagation). ◆ **Outils** : PostgreSQL streaming replication, MySQL binlog replication."
  },
  {
    "question": "Blue-Green Deployment — Déploiement sans interruption",
    "answer": "**Principe** : maintenir deux environnements de production identiques — Blue (actif, sert le trafic) et Green (idle ou en préparation). ◆ **Processus** : déployer la nouvelle version sur Green → tester Green → basculer le load balancer de Blue vers Green → Blue devient la backup. ◆ **Avantages** : zero downtime, rollback instantané (rebasculer vers Blue), test en production réelle avant bascule. ◆ **Inconvénients** : coût (deux environnements), problèmes de migrations DB (les deux versions doivent être compatibles pendant la transition). ◆ **Alternative** : Canary deployment (trafic graduel vers la nouvelle version)."
  },
  {
    "question": "Webhooks — Callbacks HTTP asynchrones",
    "answer": "**Définition** : callbacks HTTP définis par l'utilisateur, déclenchés par un événement dans un système source pour notifier un système cible. ◆ **Cas d'usage** : éviter de maintenir une connexion HTTP ouverte pour des processus longs (paiement Stripe, build CI/CD, livraison email). ◆ **Implémentation** : définir l'événement déclencheur + payload → créer un endpoint POST dans le système receveur → sécuriser via signature HMAC du payload. ◆ **Sécurité** : valider la signature (header `X-Signature`) avant de traiter. Renvoyer 200 rapidement, traiter en async. ◆ **Retry** : le système source renvoie si pas de 200 dans le délai imparti."
  },
  {
    "question": "GDPR — Conformité dans le backend",
    "answer": "**Minimisation des données** : ne collecter que ce qui est strictement nécessaire à la finalité déclarée et consentie. ◆ **Sécurité obligatoire** : données en transit (HTTPS), données au repos (chiffrement AES/RSA), audits sécurité réguliers. ◆ **Droits des utilisateurs** : accès (GET /me), rectification (PATCH /me), suppression (DELETE /me — droit à l'oubli). ◆ **Data at rest** : chiffrer avec AES-256, clés stockées dans un KMS (Key Management Service). ◆ **Data in transit** : TLS 1.2+ obligatoire. ◆ **Sanctions** : jusqu'à 4% du CA mondial ou 20M€. ◆ **DPO** : Data Protection Officer obligatoire pour certaines entreprises."
  },
  {
    "question": "Correlation IDs — Traçabilité distribuée",
    "answer": "**Définition** : identifiant unique généré à l'entrée d'un système distribué et propagé dans tous les appels inter-services pour tracer le chemin complet d'une requête. ◆ **Implémentation** : à l'entrée (API Gateway ou premier service), générer un UUID si absent du header `X-Correlation-ID`. Chaque service le propage dans les appels sortants et l'inclut dans tous ses logs. ◆ **Utilité** : débugger des problèmes cross-services, mesurer la latence par service, identifier les bottlenecks. ◆ **APM** : New Relic, Jaeger, Zipkin agrègent ces traces pour des visualisations de flamegraphs. ◆ **Standard** : OpenTelemetry normalise la propagation du contexte."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un API endpoint dans un service backend ?",
      "options": [
        "Un serveur physique hébergeant l'application backend.",
        "Une URL spécifique agissant comme point d'entrée vers une fonctionnalité d'un service — le client envoie une requête, le serveur retourne une réponse.",
        "Un protocole de communication entre bases de données.",
        "Un fichier de configuration définissant les routes d'une application."
      ],
      "answer": "Une URL spécifique agissant comme point d'entrée vers une fonctionnalité d'un service — le client envoie une requête, le serveur retourne une réponse.",
      "explanation": "Un endpoint est l'adresse d'une fonctionnalité précise exposée par le serveur. Exemple : `POST /v1/users` pour créer un utilisateur, `GET /v1/products/42` pour récupérer un produit. Chaque endpoint mappe une action métier. Un API peut avoir des dizaines d'endpoints, chacun indépendant."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le principe 'stateless' en HTTP et REST ?",
      "options": [
        "Le serveur garde en mémoire le contexte de chaque client entre les requêtes.",
        "Chaque requête contient toutes les informations nécessaires pour être traitée — le serveur ne conserve aucun état entre deux requêtes.",
        "Les données ne changent jamais après leur création.",
        "Les connexions TCP restent ouvertes indéfiniment."
      ],
      "answer": "Chaque requête contient toutes les informations nécessaires pour être traitée — le serveur ne conserve aucun état entre deux requêtes.",
      "explanation": "HTTP est stateless par design : chaque requête est autonome et indépendante. Conséquence directe : si une application a besoin d'état (panier, session, préférences), le backend doit l'implémenter lui-même — via cookies/JWT (côté client) ou Redis/DB (côté serveur). Le stateless facilite le scaling horizontal car n'importe quelle instance peut traiter n'importe quelle requête."
    },
    {
      "question": "[Définition → Terme] Un mécanisme limitant le nombre de requêtes acceptées par client sur une période définie, répondant `429` quand le seuil est dépassé, s'appelle ?",
      "options": [
        "Load balancing",
        "Rate limiting",
        "Circuit breaker",
        "API versioning"
      ],
      "answer": "Rate limiting",
      "explanation": "Le rate limiting protège l'API contre les abus (DDoS, scraping, surcharge involontaire). Il compte les requêtes par client (IP, clé API, token) via un compteur stocké dans Redis et répond `429 Too Many Requests` avec un header `Retry-After` quand le seuil est atteint. Les algorithmes courants : Token Bucket, Sliding Window, Fixed Window."
    },
    {
      "question": "[Caractéristiques → Concept] Schéma prédéfini, tables et colonnes, transactions ACID, support des JOIN, contraintes d'intégrité référentielle. Quel type de base de données ?",
      "options": [
        "NoSQL orienté documents",
        "Base de données relationnelle (SQL)",
        "Base de données clé-valeur",
        "Base de données en colonnes"
      ],
      "answer": "Base de données relationnelle (SQL)",
      "explanation": "Les bases SQL (PostgreSQL, MySQL, SQL Server) imposent un schéma strict et garantissent ACID : Atomicité (tout ou rien), Cohérence (invariants respectés), Isolation (transactions parallèles sans interférence), Durabilité (données persistées). Idéales pour les données financières, e-commerce, tout domaine avec des relations fortes et des contraintes d'intégrité."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un JWT (JSON Web Token) dans le contexte de l'authentification backend ?",
      "options": [
        "Un protocole de chiffrement des connexions réseau.",
        "Un token auto-porteur signé contenant les informations d'identité de l'utilisateur — stateless, vérifié par signature sans requête serveur.",
        "Un identifiant de session stocké côté serveur dans Redis.",
        "Un format de requête JSON pour les APIs REST."
      ],
      "answer": "Un token auto-porteur signé contenant les informations d'identité de l'utilisateur — stateless, vérifié par signature sans requête serveur.",
      "explanation": "Le JWT est composé de 3 parties encodées Base64 : Header (algo de signature), Payload (claims : userId, rôles, expiration), Signature (vérification d'intégrité). Le serveur valide la signature sans consulter de base de données — c'est ce qui le rend stateless et scalable. À envoyer dans le header `Authorization: Bearer <token>`. Ne pas stocker de données sensibles dans le payload (il est lisible, juste signé)."
    },
    {
      "question": "[Définition → Terme] Une stratégie de déploiement maintenant deux environnements de production identiques (l'un actif, l'autre en attente), permettant un rollback instantané, s'appelle ?",
      "options": [
        "Canary deployment",
        "Blue-green deployment",
        "Rolling update",
        "Feature flags"
      ],
      "answer": "Blue-green deployment",
      "explanation": "Blue-green : Blue sert le trafic, Green reçoit la nouvelle version. Après validation, le load balancer bascule de Blue vers Green — zero downtime. Si un bug apparaît, re-basculer vers Blue : rollback instantané. Le canary deployment déploie graduellement (5% → 25% → 100% du trafic) — différent. Le rolling update remplace les instances une par une sans environnement dédié."
    },
    {
      "question": "[Correspondance] Faites correspondre : `429 Too Many Requests` → ? / `401 Unauthorized` → ? / `404 Not Found` → ?",
      "options": [
        "Limite de débit dépassée / Non authentifié / Ressource inexistante",
        "Non authentifié / Limite de débit / Ressource inexistante",
        "Ressource inexistante / Limite de débit / Non authentifié",
        "Erreur serveur / Non authentifié / Ressource déplacée"
      ],
      "answer": "Limite de débit dépassée / Non authentifié / Ressource inexistante",
      "explanation": "Status codes HTTP à connaître : 200 OK, 201 Created, 400 Bad Request (requête invalide), 401 Unauthorized (non authentifié), 403 Forbidden (authentifié mais non autorisé), 404 Not Found, 429 Too Many Requests (rate limit), 500 Internal Server Error. Le 401 et 403 sont souvent confondus : 401 = 'vous devez vous identifier', 403 = 'vous êtes identifié mais n'avez pas le droit'."
    },
    {
      "question": "[Caractéristiques → Concept] Publication d'événements sur des topics, N consommateurs indépendants, communication asynchrone, découplage temporel entre services, messages persistés. Quel composant ?",
      "options": [
        "Un reverse proxy",
        "Une base de données Redis",
        "Un message queue / message broker",
        "Un API Gateway"
      ],
      "answer": "Un message queue / message broker",
      "explanation": "La message queue (RabbitMQ, Kafka, SQS) est le hub de communication asynchrone. Le producteur publie un message et continue sans attendre. Le(s) consommateur(s) traitent le message quand ils sont disponibles. Avantages : découplage (si le consommateur est down, le message attend), scalabilité (ajouter des consommateurs), rejouabilité (Kafka). Différent d'un appel HTTP synchrone où l'appelant attend la réponse."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un reverse proxy et quel est son rôle principal en backend ?",
      "options": [
        "Un proxy côté client qui cache les requêtes sortantes.",
        "Un serveur intermédiaire placé devant les serveurs backend, routant le trafic, gérant le load balancing, le cache et la protection DDoS.",
        "Un outil de debug pour intercepter les requêtes HTTP en développement.",
        "Un protocole pour inverser le sens des connexions TCP."
      ],
      "answer": "Un serveur intermédiaire placé devant les serveurs backend, routant le trafic, gérant le load balancing, le cache et la protection DDoS.",
      "explanation": "Le reverse proxy (Nginx, HAProxy, AWS ALB) est la première ligne de défense et de distribution. Il expose une interface publique unique tout en cachant la topologie interne. Fonctions : load balancing (distribuer la charge), terminaison TLS (gère HTTPS), cache statique, protection DDoS, URL rewriting. Le client parle au reverse proxy, qui parle aux instances backend — les IP des serveurs restent cachées."
    },
    {
      "question": "[Erreur contextuelle] Un développeur stocke les données de session utilisateur en mémoire locale de chaque instance backend dans un cluster avec load balancer. Quel problème cela crée-t-il ?",
      "options": [
        "Les sessions expirent trop rapidement.",
        "La session n'existe que sur l'instance qui l'a créée — si le load balancer envoie la requête suivante vers une autre instance, l'utilisateur est déconnecté.",
        "Les données de session ne peuvent pas être chiffrées en mémoire.",
        "Redis est obligatoire pour les sessions dans tous les cas."
      ],
      "answer": "La session n'existe que sur l'instance qui l'a créée — si le load balancer envoie la requête suivante vers une autre instance, l'utilisateur est déconnecté.",
      "explanation": "Problème classique en architecture distribuée. Solutions : (1) Sticky sessions — le load balancer redirige toujours le même client vers la même instance (simple, mais distribution inégale). (2) Store centralisé — externaliser les sessions dans Redis partagé par toutes les instances (recommandé). Avec JWT, ce problème disparaît : le token est auto-porteur, côté client, valide sur n'importe quelle instance."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que la containerisation (Docker) et quel avantage apporte-t-elle au développement backend ?",
      "options": [
        "Une méthode de virtualisation lourde créant des machines virtuelles complètes.",
        "Une méthode de virtualisation légère empaquetant une application et ses dépendances dans un conteneur portable, assurant un environnement identique partout.",
        "Un outil de compression des images Docker pour réduire leur taille.",
        "Un protocole réseau pour isoler les services backend."
      ],
      "answer": "Une méthode de virtualisation légère empaquetant une application et ses dépendances dans un conteneur portable, assurant un environnement identique partout.",
      "explanation": "Le conteneur embarque le code + runtime + dépendances + config. Avantages : 'ça marche sur ma machine' disparaît — l'image Docker tourne identiquement en dev, staging et prod. Léger (partagent le kernel OS, contrairement aux VMs). Rapide à démarrer. Base du scaling horizontal avec Kubernetes. Isolation des versions de librairies entre services."
    },
    {
      "question": "[Caractéristiques → Concept] Deux environnements de production identiques, bascule via load balancer, rollback instantané, zero downtime, nouveau déploiement testé avant bascule. Quel pattern ?",
      "options": [
        "Rolling deployment",
        "Blue-green deployment",
        "Canary deployment",
        "Feature toggle deployment"
      ],
      "answer": "Blue-green deployment",
      "explanation": "Blue-green = deux environnements complets en miroir. Permet de valider la nouvelle version en conditions réelles (environment Green) pendant que Blue continue de servir. La bascule est atomique (changement de config du load balancer). Rollback = re-basculer vers Blue en quelques secondes. Coût : deux fois l'infrastructure pendant la période de transition. Rolling = remplace les instances une par une. Canary = monte en charge progressivement."
    },
    {
      "question": "[Définition → Terme] Une protection contre les attaques SQL injection qui sépare structurellement le code SQL de ses paramètres, confiée au driver de base de données, s'appelle ?",
      "options": [
        "ORM (Object-Relational Mapping)",
        "Requête paramétrée (parameterized query / prepared statement)",
        "Échappement des caractères",
        "Whitelist de caractères autorisés"
      ],
      "answer": "Requête paramétrée (parameterized query / prepared statement)",
      "explanation": "Mécanisme le plus robuste contre l'injection SQL : `SELECT * FROM users WHERE id = ?` puis on fournit la valeur séparément. Le driver traite le paramètre comme de la donnée pure, jamais comme du code SQL exécutable. Même si l'utilisateur tape `' OR 1=1 --`, ce texte est cherché littéralement dans la base. Plus fiable que l'échappement manuel qui peut rater des cas edge."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que le GDPR impose comme obligation principale aux systèmes backend collectant des données personnelles ?",
      "options": [
        "Utiliser uniquement des bases de données SQL européennes.",
        "Minimiser la collecte (ne collecter que le nécessaire), sécuriser les données (transit + repos), donner aux utilisateurs droits d'accès, rectification et suppression.",
        "Stocker toutes les données sur des serveurs physiquement en Europe.",
        "Supprimer toutes les données personnelles après 30 jours."
      ],
      "answer": "Minimiser la collecte (ne collecter que le nécessaire), sécuriser les données (transit + repos), donner aux utilisateurs droits d'accès, rectification et suppression.",
      "explanation": "GDPR (General Data Protection Regulation) : principes clés — (1) Minimisation : collecter uniquement les données nécessaires à la finalité déclarée. (2) Sécurité : HTTPS (transit) + chiffrement AES-256 (repos). (3) Droits utilisateurs : accès, rectification, suppression (droit à l'oubli), portabilité. (4) Consentement explicite. Sanctions : jusqu'à 4% du CA mondial. Les serveurs peuvent être en dehors d'Europe si les transferts respectent les clauses contractuelles types (SCCs)."
    },
    {
      "question": "[Caractéristiques → Concept] Déclenché par push Git, exécute lint → tests → build → déploiement, s'arrête si les tests échouent, produit des artifacts versionnés. Quel système ?",
      "options": [
        "Un système de monitoring applicatif (APM)",
        "Un pipeline CI/CD (Continuous Integration / Continuous Deployment)",
        "Un système de gestion de versions (Git)",
        "Un orchestrateur de conteneurs (Kubernetes)"
      ],
      "answer": "Un pipeline CI/CD (Continuous Integration / Continuous Deployment)",
      "explanation": "CI/CD automatise le cycle build/test/deploy. CI = intégration continue : chaque commit déclenche build + tests automatisés — détection immédiate des régressions. CD = déploiement continu : si CI passe, déploiement automatique en staging puis production. Outils : GitHub Actions, GitLab CI, CircleCI. La règle d'or : aucun code non testé n'atteint la production. Réduction du time-to-market et du risque de déploiement."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce que l'API versioning et pourquoi est-il important ?",
      "options": [
        "Un système de backup automatique de l'API.",
        "Une pratique permettant d'évoluer une API sans casser les clients existants, via URL path (/v1/, /v2/) ou header dédié.",
        "Un outil pour mesurer les performances de différentes versions d'API.",
        "Un mécanisme de réplication des API entre data centers."
      ],
      "answer": "Une pratique permettant d'évoluer une API sans casser les clients existants, via URL path (/v1/, /v2/) ou header dédié.",
      "explanation": "Sans versioning, toute modification de l'API (changement de format, suppression de champ) casse les clients existants. Avec `/v1/orders` et `/v2/orders` en parallèle, les clients existants continuent d'utiliser v1 pendant leur migration. Les deux méthodes courantes : URL path (`/v1/`) — explicite et visible dans les logs — ou header personnalisé (`Api-Version: 2`) — URL propre mais moins visible. `/v1/` est la convention la plus répandue."
    },
    {
      "question": "[Définition → Terme] Un unique identifiant généré à l'entrée d'un système distribué et propagé dans les headers de tous les appels inter-services pour tracer le chemin d'une requête s'appelle ?",
      "options": [
        "Un session ID",
        "Un correlation ID (ou trace ID)",
        "Un idempotency key",
        "Un request token"
      ],
      "answer": "Un correlation ID (ou trace ID)",
      "explanation": "Dans une architecture microservices, une requête peut traverser 7 services avant de retourner une réponse. Sans correlation ID, débugger un problème est un cauchemar — impossible de reconstituer le chemin. Avec un UUID généré à l'entrée et propagé dans tous les headers (`X-Correlation-ID`), tous les logs peuvent être filtrés par cet ID. Les APMs comme Jaeger ou New Relic visualisent ces traces sous forme de flamegraphs."
    },
    {
      "question": "[Terme → Définition] Qu'est-ce qu'un webhook et en quoi diffère-t-il d'une requête API classique ?",
      "options": [
        "Un webhook est une requête API déclenchée par le client à intervalles réguliers (polling).",
        "Un webhook est un callback HTTP défini par le receveur et déclenché par un événement côté émetteur — sens inverse d'un appel API classique.",
        "Un webhook est un type de message queue pour les notifications.",
        "Un webhook est une API sécurisée nécessitant une authentification OAuth."
      ],
      "answer": "Un webhook est un callback HTTP défini par le receveur et déclenché par un événement côté émetteur — sens inverse d'un appel API classique.",
      "explanation": "API classique : le client demande (`pull`) — 'donne-moi les données'. Webhook : le serveur envoie (`push`) quand un événement se produit — 'voici les données quand elles changent'. Exemple : Stripe envoie un webhook sur ton endpoint quand un paiement aboutit. Avantage : pas besoin de polling constant. Implémentation : l'émetteur POST un payload sur ton URL dès l'événement — répondre 200 rapidement (traiter en async)."
    },
    {
      "question": "[Erreur contextuelle] Un développeur répond directement au client HTTP seulement après la fin d'un traitement de 45 secondes (génération de rapport). Quel problème architectural ?",
      "options": [
        "Le problème est uniquement côté base de données, pas dans l'architecture.",
        "La connexion HTTP tient 45 secondes — risque de timeout client, blocage d'un thread serveur pendant ce temps, mauvaise UX.",
        "HTTPS ne supporte pas les connexions longues.",
        "Un seul thread serveur suffit pour ce type de requête."
      ],
      "answer": "La connexion HTTP tient 45 secondes — risque de timeout client, blocage d'un thread serveur pendant ce temps, mauvaise UX.",
      "explanation": "Pattern correct pour les processus longs : répondre immédiatement `202 Accepted` avec un identifiant de job, publier le travail dans une message queue, le worker traite en async. Le client peut soit poller `GET /jobs/{id}` pour connaître l'état, soit recevoir une notification via webhook ou WebSocket quand c'est terminé. Ce pattern libère le thread serveur immédiatement et offre une meilleure UX."
    },
    {
      "question": "[Terme → Définition] Quelle est la différence entre l'authentification (AuthN) et l'autorisation (AuthZ) dans un backend ?",
      "options": [
        "Ce sont deux termes synonymes pour désigner la vérification d'identité.",
        "Authentification = vérifier QUI vous êtes (identité). Autorisation = vérifier CE QUE vous avez le droit de faire (permissions).",
        "Authentification concerne les APIs, autorisation concerne les bases de données.",
        "Authentification utilise JWT, autorisation utilise OAuth — toujours."
      ],
      "answer": "Authentification = vérifier QUI vous êtes (identité). Autorisation = vérifier CE QUE vous avez le droit de faire (permissions).",
      "explanation": "AuthN : 'Êtes-vous bien Alice ?' → login/password, JWT, OAuth. AuthZ : 'Alice peut-elle accéder à cette ressource ?' → RBAC (Role-Based Access Control), ACL. Les deux sont distincts et séquentiels : d'abord AuthN (qui), puis AuthZ (quoi). Un utilisateur peut être authentifié (401 résolu) mais non autorisé (403 Forbidden). Exemple : Alice est bien Alice, mais elle n'a pas le rôle ADMIN pour accéder à `DELETE /users`."
    }
  ],
  avance: [
    {
      "question": "[Concept → Pattern] Comment implémenter un rate limiting robuste pour une API publique avec Redis ?",
      "options": [
        "Stocker un compteur en mémoire locale de chaque instance backend.",
        "Redis stocke un compteur par clé client (IP/token) avec TTL — algorithme Sliding Window : incrémenter à chaque requête, refuser si > seuil, expiration automatique.",
        "Utiliser un middleware Express qui compte les requêtes en mémoire.",
        "Configurer le load balancer pour limiter le nombre de connexions TCP par IP."
      ],
      "answer": "Redis stocke un compteur par clé client (IP/token) avec TTL — algorithme Sliding Window : incrémenter à chaque requête, refuser si > seuil, expiration automatique.",
      "explanation": "Rate limiting distribué avec Redis : `INCR user:123:requests` + `EXPIRE` en TTL. Atomic grâce aux opérations Redis. Si plusieurs instances backend, toutes lisent le même compteur Redis — pas de double comptage. Sliding Window log : stocker les timestamps des N dernières requêtes, refuser si la fenêtre glissante dépasse le seuil. Token Bucket : bucket se remplit à taux fixe, chaque requête consomme un token — autorise les bursts. Répondre 429 + `Retry-After: X` secondes."
    },
    {
      "question": "[Anti-pattern] Un développeur crée des endpoints `GET /deleteUser?id=42` et `GET /getUser?id=42` pour toutes ses opérations. Quelles violations REST commet-il ?",
      "options": [
        "Aucune — GET peut être utilisé pour toutes les opérations.",
        "GET doit être safe (sans effet de bord) et idempotent — supprimer via GET viole ces contraintes + les verbes HTTP doivent exprimer l'action (GET, POST, PUT, DELETE) + les ressources s'identifient par URI, pas par query param d'action.",
        "La seule erreur est d'utiliser query params au lieu du body.",
        "GET ne peut pas accepter de paramètres dans l'URL."
      ],
      "answer": "GET doit être safe (sans effet de bord) et idempotent — supprimer via GET viole ces contraintes + les verbes HTTP doivent exprimer l'action (GET, POST, PUT, DELETE) + les ressources s'identifient par URI, pas par query param d'action.",
      "explanation": "Violations REST : (1) GET safe = ne modifie rien. `GET /deleteUser` détruit une ressource — violation grave (appels accidentels depuis un navigateur, bots de crawl). (2) Les verbes HTTP ont une sémantique précise : GET=lire, POST=créer, PUT=modifier, DELETE=supprimer. (3) L'action exprimée en URL viole l'interface uniforme REST. Correct : `GET /users/42`, `DELETE /users/42`. GET /deleteUser expose aussi l'opération dans les logs HTTP et l'historique navigateur — risque sécurité."
    },
    {
      "question": "[Situation → Outil] Une API de paiement reçoit parfois deux fois la même requête à cause de retries réseau. Comment garantir qu'un seul débit est effectué ?",
      "options": [
        "Utiliser une transaction SQL avec un niveau d'isolation SERIALIZABLE.",
        "Implémenter l'idempotence : le client envoie une `Idempotency-Key` unique par opération — si la clé est déjà en base, retourner le résultat précédent sans re-débiter.",
        "Limiter les retries côté client à un seul essai.",
        "Utiliser le pessimistic locking sur la table des transactions."
      ],
      "answer": "Implémenter l'idempotence : le client envoie une `Idempotency-Key` unique par opération — si la clé est déjà en base, retourner le résultat précédent sans re-débiter.",
      "explanation": "L'idempotence garantit que des appels identiques répétés produisent le même résultat qu'un seul appel. Pattern standard : le client génère un UUID par opération (ex: `Idempotency-Key: uuid-v4`) et l'envoie dans le header. Le serveur vérifie en base si cette clé existe déjà — si oui, retourne la réponse stockée. Si non, exécute et stocke (key + résultat). Stripe utilise exactement ce pattern. Les verbes GET, PUT, DELETE sont naturellement idempotents en REST."
    },
    {
      "question": "[Thème A → Thème B] Comment la cohérence éventuelle (eventual consistency) impacte-t-elle la conception d'une API distribuée ?",
      "options": [
        "Elle rend les transactions SQL impossibles.",
        "Une lecture immédiate après écriture peut retourner des données périmées — l'API doit le documenter et les clients concevoir en conséquence (ex: afficher 'traitement en cours').",
        "Elle impose d'utiliser des requêtes paramétrées pour toutes les lectures.",
        "Elle n'a d'impact que sur les bases NoSQL, pas sur les APIs REST."
      ],
      "answer": "Une lecture immédiate après écriture peut retourner des données périmées — l'API doit le documenter et les clients concevoir en conséquence (ex: afficher 'traitement en cours').",
      "explanation": "Eventual consistency (modèle AP du CAP theorem) : les données se propagent à toutes les répliques mais avec un délai. Conséquences API : `POST /orders` retourne 202, mais `GET /orders/42` immédiatement après peut retourner 404 (pas encore propagé). Stratégies : (1) Read-your-writes : rediriger les lectures vers le nœud ayant reçu l'écriture pendant un délai. (2) Tokens de cohérence. (3) Documenter le comportement. (4) Utiliser des queues avec confirmations."
    },
    {
      "question": "[Code → Identification] `nginx.conf : upstream backend { server app1:3000; server app2:3000; server app3:3000; } location /api { proxy_pass http://backend; }`. Qu'illustre cette configuration ?",
      "options": [
        "Un cluster Redis avec réplication.",
        "Un reverse proxy Nginx faisant du load balancing Round Robin vers 3 instances backend — distribue le trafic équitablement sans configuration additionnelle.",
        "Un API Gateway avec authentification JWT.",
        "Une configuration de base de données avec 3 shards."
      ],
      "answer": "Un reverse proxy Nginx faisant du load balancing Round Robin vers 3 instances backend — distribue le trafic équitablement sans configuration additionnelle.",
      "explanation": "Configuration Nginx classique : `upstream` définit le pool de serveurs backend. `proxy_pass http://backend` délègue toutes les requêtes `/api` vers ce pool. Par défaut, Nginx utilise Round Robin (app1, app2, app3, app1...). Pour Least Connections : ajouter `least_conn;`. Pour Sticky Sessions : `ip_hash;`. Nginx absorbe aussi la terminaison TLS, les headers de sécurité et le cache statique — avant que les requêtes atteignent les instances applicatives."
    },
    {
      "question": "[Refactoring] Un système batch recalcule la VaR (30 min) et envoie des notifications email après chaque trade. Comment refactoriser vers une architecture temps réel ?",
      "options": [
        "Utiliser des threads Java pour paralléliser les calculs.",
        "Kafka event `TradeExecuted` → consommateurs indépendants : RiskService (recalcul incrémental VaR) + NotificationService (email async). Chaque service scale indépendamment.",
        "Augmenter la fréquence du batch à toutes les 5 minutes.",
        "Stocker les trades en Redis et recalculer via un cron job."
      ],
      "answer": "Kafka event `TradeExecuted` → consommateurs indépendants : RiskService (recalcul incrémental VaR) + NotificationService (email async). Chaque service scale indépendamment.",
      "explanation": "Transformation batch → EDA (Event-Driven Architecture) : chaque trade publie un événement Kafka. Le RiskService consomme en temps réel et recalcule uniquement l'impact marginal (VaR incrémentale) plutôt que tout recalculer. Le NotificationService consomme indépendamment — si l'email service est down, les trades continuent. Chaque service a son consumer group Kafka, peut être scalé indépendamment, et repart du bon offset après un crash."
    },
    {
      "question": "[Anti-pattern + Sécurité] Un backend stocke les mots de passe utilisateurs en clair dans la base de données. Listez les violations et la correction.",
      "options": [
        "C'est acceptable si la base de données est chiffrée au repos.",
        "Violation critique : mot de passe en clair = une fuite DB expose tous les comptes. Solution : hacher avec bcrypt/Argon2 (one-way, salé) + jamais stocker/logger le mot de passe clair.",
        "La seule correction nécessaire est d'utiliser HTTPS.",
        "Chiffrer les mots de passe avec AES-256 est suffisant."
      ],
      "answer": "Violation critique : mot de passe en clair = une fuite DB expose tous les comptes. Solution : hacher avec bcrypt/Argon2 (one-way, salé) + jamais stocker/logger le mot de passe clair.",
      "explanation": "Hachage ≠ chiffrement. AES est réversible avec la clé — si la clé fuite, tous les mots de passe sont exposés. bcrypt/Argon2 sont des fonctions one-way intentionnellement lentes (résiste aux bruteforce). Le sel unique par utilisateur empêche les rainbow tables. À la connexion : `bcrypt.compare(plaintext, hash)`. Ne jamais logger le mot de passe en clair, même en dev. HTTPS protège le transit mais pas le stockage."
    },
    {
      "question": "[Situation → Multi-concepts] Un service reçoit 10 000 req/sec, distribue la charge sur 5 instances, met en cache les réponses fréquentes, limite les abus à 100 req/min par IP. Identifiez les concepts présents.",
      "options": [
        "CI/CD + blue-green deployment + webhooks",
        "Scalabilité horizontale (5 instances) + load balancing + caching + rate limiting",
        "Microservices + message queue + API versioning",
        "Réplication DB + cohérence éventuelle + idempotence"
      ],
      "answer": "Scalabilité horizontale (5 instances) + load balancing + caching + rate limiting",
      "explanation": "Analyse multi-concepts : 10 000 req/sec sur 5 instances = scaling horizontal (2 000 req/sec par instance). Distribution de charge = load balancing (Nginx, AWS ALB). Mise en cache des réponses fréquentes = caching (Redis, Varnish, header Cache-Control). Limite à 100 req/min par IP = rate limiting (Redis counters + 429). Ces quatre concepts coexistent naturellement dans une architecture haute performance."
    },
    {
      "question": "[Thème A → Thème B] Comment le CAP theorem influence-t-il le choix entre PostgreSQL (CP) et DynamoDB en mode AP pour une application e-commerce ?",
      "options": [
        "Le CAP theorem ne s'applique qu'aux bases NoSQL.",
        "Panier/commandes (cohérence critique — ne pas débiter deux fois) → PostgreSQL CP. Catalogue produits (disponibilité prioritaire, staleness acceptable) → DynamoDB AP. Choix guidé par les invariants métier.",
        "DynamoDB est toujours supérieur à PostgreSQL pour les applications web.",
        "PostgreSQL est CP uniquement avec des transactions distribuées XA."
      ],
      "answer": "Panier/commandes (cohérence critique — ne pas débiter deux fois) → PostgreSQL CP. Catalogue produits (disponibilité prioritaire, staleness acceptable) → DynamoDB AP. Choix guidé par les invariants métier.",
      "explanation": "Application pragmatique du CAP : le panier et le paiement ne tolèrent pas les données périmées (risque de double débit, incohérence de stock) → CP, cohérence forte, ACID. Le catalogue produits peut afficher un prix légèrement périmé 2 secondes — disponibilité prioritaire pour le trafic, staleness acceptable → AP. Une application complexe utilise souvent plusieurs bases avec des trade-offs différents selon le domaine (polyglot persistence)."
    },
    {
      "question": "[Ordre de dépendance] Quel prérequis est indispensable pour implémenter un SSO (Single Sign-On) entre plusieurs applications ?",
      "options": [
        "Un cluster Redis partagé entre toutes les applications.",
        "Un Identity Provider (IdP) centralisé implémentant un protocole standard (SAML, OpenID Connect) — sans lui, aucune application ne peut déléguer l'authentification.",
        "Un reverse proxy commun à toutes les applications.",
        "Une base de données partagée entre toutes les applications."
      ],
      "answer": "Un Identity Provider (IdP) centralisé implémentant un protocole standard (SAML, OpenID Connect) — sans lui, aucune application ne peut déléguer l'authentification.",
      "explanation": "SSO repose sur la délégation d'authentification à un tiers de confiance unique. L'IdP (Okta, Keycloak, Auth0) authentifie l'utilisateur et délivre un token (SAML assertion ou JWT OpenID Connect). Chaque application vérifie ce token auprès de l'IdP sans gérer ses propres credentials. Protocole SAML : XML-based, legacy. OpenID Connect : JWT-based, moderne. Sans IdP, chaque application gère ses propres comptes — pas de SSO. Redis seul ne suffit pas : il faut un protocole de fédération d'identité."
    },
    {
      "question": "[Refactoring] Une API n'a pas de versioning. La v2 change le format de `/orders` en ajoutant des champs obligatoires, cassant les clients existants. Comment corriger cette situation architecturalement ?",
      "options": [
        "Déployer la v2 et forcer tous les clients à migrer immédiatement.",
        "Créer `/v2/orders` avec le nouveau format, maintenir `/v1/orders` pendant une période de dépréciation définie, communiquer le calendrier de migration.",
        "Utiliser feature flags pour activer le nouveau format progressivement.",
        "Modifier uniquement le changelog sans changer l'URL."
      ],
      "answer": "Créer `/v2/orders` avec le nouveau format, maintenir `/v1/orders` pendant une période de dépréciation définie, communiquer le calendrier de migration.",
      "explanation": "Le versioning d'API est la réponse aux breaking changes. Maintenir v1 et v2 en parallèle : les clients existants continuent sur v1 (aucune régression), les nouveaux clients utilisent v2, les clients v1 ont un délai de migration communiqué (3-6 mois minimum). Header `Deprecation: true` + `Sunset: date` sur v1 pour avertir. En pratique, une v1 bien versionnée reste souvent en production bien au-delà du délai prévu — concevoir v2 en anticipant cette réalité."
    },
    {
      "question": "[Erreur contextuelle + Performance] Un développeur exécute une requête SQL non indexée qui fait un full table scan sur une table de 50 millions de lignes à chaque requête HTTP. Quel impact et quelle correction ?",
      "options": [
        "Aucun impact tant que la base de données a suffisamment de RAM.",
        "Latence élevée (secondes par requête), charge CPU/IO maximale sur la DB, timeout des requêtes HTTP. Correction : index sur les colonnes de filtrage/tri + EXPLAIN ANALYZE pour identifier le plan d'exécution.",
        "La seule correction est d'utiliser une base NoSQL.",
        "Ajouter plus de RAM résout le problème sans modification de requête."
      ],
      "answer": "Latence élevée (secondes par requête), charge CPU/IO maximale sur la DB, timeout des requêtes HTTP. Correction : index sur les colonnes de filtrage/tri + EXPLAIN ANALYZE pour identifier le plan d'exécution.",
      "explanation": "Full table scan sur 50M lignes = lire chaque ligne une par une. Impact : latence de 5-30 secondes, lock de pages DB, concurrence dégradée pour les autres requêtes. `EXPLAIN ANALYZE` révèle le plan d'exécution et les coûts. Index B-Tree sur la colonne WHERE : O(log n) au lieu de O(n). Pour les requêtes fréquentes : aussi envisager un cache Redis (résultats pré-calculés) ou une vue matérialisée. Les index ont un coût à l'écriture — créer uniquement sur les colonnes réellement filtrées."
    },
    {
      "question": "[Thème ↔ Outil] Quel outil assure la traçabilité complète d'une requête traversant 6 microservices dans une architecture distribuée ?",
      "options": [
        "Un reverse proxy Nginx avec access logs détaillés.",
        "Des correlation IDs propagés dans les headers + un système de distributed tracing (Jaeger, Zipkin, AWS X-Ray) agrégeant les spans par trace.",
        "Un message broker Kafka avec un topic dédié aux logs.",
        "Un APM qui monitore uniquement les temps de réponse par service."
      ],
      "answer": "Des correlation IDs propagés dans les headers + un système de distributed tracing (Jaeger, Zipkin, AWS X-Ray) agrégeant les spans par trace.",
      "explanation": "Distributed tracing : le correlation ID (trace ID) est injecté à l'entrée et propagé. Chaque service crée un 'span' (segment de trace) avec start/end time, metadata, erreurs éventuelles. L'outil de tracing agrège tous les spans d'un même trace ID pour reconstruire le chemin complet et afficher un flamegraph. Jaeger (open source, CNCF), Zipkin (Twitter), AWS X-Ray (managed). OpenTelemetry standardise l'instrumentation pour être outil-agnostique."
    },
    {
      "question": "[Multi-concepts — flux complet] Dans le flux `Client → API Gateway → AuthService → ProductService → InventoryService → DB → Cache`, identifiez 4 patterns d'architecture.",
      "options": [
        "Singleton + Builder + Observer + Factory.",
        "API Gateway (point d'entrée unique) + microservices (services indépendants) + séparation de responsabilités + caching (lecture rapide depuis le cache).",
        "REST + SQL + Redis + Kubernetes.",
        "MVC + Repository + CQRS + Event Sourcing."
      ],
      "answer": "API Gateway (point d'entrée unique) + microservices (services indépendants) + séparation de responsabilités + caching (lecture rapide depuis le cache).",
      "explanation": "Analyse d'architecture : API Gateway = point d'entrée unique gérant auth, rate limiting, routing. AuthService + ProductService + InventoryService = microservices, chacun avec sa responsabilité distincte (SRP à l'échelle service). DB + Cache = pattern Cache-Aside : lire le cache d'abord, si miss → DB → mettre en cache. La séparation entre ProductService et InventoryService = separation of concerns. Ce flux est une architecture microservices standard avec gateway et caching."
    },
    {
      "question": "[Erreur contextuelle] Un service backend communique avec d'autres microservices via des appels HTTP synchrones en chaîne (A → B → C → D). Quel problème architectural crée cette topologie ?",
      "options": [
        "Les appels HTTP ne sont pas supportés entre microservices.",
        "Couplage temporel fort : si D est lent ou down, A timeout aussi. La latence totale = somme des latences individuelles. Un seul service défaillant cascade en panne totale.",
        "La seule limitation est la bande passante réseau entre services.",
        "Les appels synchrones sont toujours préférables aux messages asynchrones."
      ],
      "answer": "Couplage temporel fort : si D est lent ou down, A timeout aussi. La latence totale = somme des latences individuelles. Un seul service défaillant cascade en panne totale.",
      "explanation": "Failure cascade (ou 'distributed monolith') : la chaîne synchrone A→B→C→D crée une dépendance de disponibilité totale. Si D prend 2s, la latence totale est 2s+. Si D est down, A reçoit un timeout. Latence totale = somme (100ms + 150ms + 200ms + ...). Solutions : (1) Circuit breaker (Hystrix, Resilience4j) — coupe le circuit si trop d'erreurs. (2) Async avec message queue pour les appels non critiques. (3) Bulkhead — isoler les ressources. (4) Timeout + fallback à chaque étape."
    },
    {
      "question": "[Concept → Architecture] Comment gérer des migrations de schéma SQL dans un pipeline CI/CD sans downtime en production ?",
      "options": [
        "Arrêter l'application, appliquer la migration manuellement, redémarrer.",
        "Versionner les migrations avec Flyway ou Liquibase, appliquer uniquement les nouvelles migrations au déploiement, concevoir les migrations en backward-compatible (expand-contract pattern).",
        "Utiliser uniquement des bases NoSQL qui n'ont pas de schéma.",
        "Créer une nouvelle base de données à chaque déploiement."
      ],
      "answer": "Versionner les migrations avec Flyway ou Liquibase, appliquer uniquement les nouvelles migrations au déploiement, concevoir les migrations en backward-compatible (expand-contract pattern).",
      "explanation": "Flyway/Liquibase : chaque migration est un fichier versionné (V001, V002...) tracké en base. Au démarrage, seules les nouvelles migrations s'exécutent. Expand-contract pattern pour zero-downtime : Phase 1 (Expand) — ajouter la nouvelle colonne nullable (compatible v1 et v2). Déployer v2 qui écrit dans les deux colonnes. Phase 2 (Contract) — migrer les données, rendre la colonne obligatoire, supprimer l'ancienne. Sans backward-compatibility, le déploiement blue-green peut casser une version pendant l'overlap."
    },
    {
      "question": "[Anti-pattern + Architecture] Un développeur expose directement les erreurs internes du serveur dans les réponses API (`NullPointerException at OrderService.java:142`). Quels problèmes ?",
      "options": [
        "Aucun problème — les messages d'erreur détaillés aident le debugging.",
        "Fuite d'informations : révèle la stack technique, les noms de classes/fichiers, aides à l'exploitation par des attaquants. Correction : messages d'erreur génériques côté client + logs détaillés uniquement côté serveur.",
        "Le seul problème est la mauvaise expérience utilisateur.",
        "HTTPS empêche les attaquants de lire les messages d'erreur."
      ],
      "answer": "Fuite d'informations : révèle la stack technique, les noms de classes/fichiers, aides à l'exploitation par des attaquants. Correction : messages d'erreur génériques côté client + logs détaillés uniquement côté serveur.",
      "explanation": "Information disclosure : les stack traces révèlent le langage (Java), le framework, la structure interne, parfois des chemins de fichiers. Un attaquant adapte ses techniques en conséquence. Pratique correcte : réponse API → message générique (`{error: 'Internal server error', requestId: 'uuid'}`) + code d'erreur. Logs serveur → stack trace complète + contexte. Le `requestId` permet de corréler la réponse client avec le log serveur pour le debugging sans exposer les détails."
    },
    {
      "question": "[Thème ↔ Principe] Quel principe de sécurité garantit que même si une couche de défense est compromise, les données restent protégées ?",
      "options": [
        "L'authentification OAuth2",
        "Defense in Depth (défense en profondeur) : HTTPS (transit) + chiffrement at-rest (stockage) + pare-feu réseau + WAF + authentification + autorisation — plusieurs couches indépendantes.",
        "Le rate limiting",
        "La validation des inputs côté serveur uniquement"
      ],
      "answer": "Defense in Depth (défense en profondeur) : HTTPS (transit) + chiffrement at-rest (stockage) + pare-feu réseau + WAF + authentification + autorisation — plusieurs couches indépendantes.",
      "explanation": "Defense in Depth : aucune couche de sécurité n'est parfaite — la stratégie est de multiplier les couches indépendantes. Si HTTPS est compromis (MITM), les données at-rest sont toujours chiffrées. Si un attaquant passe le réseau, il doit encore contourner l'authentification, puis les autorisations. En pratique : pare-feu réseau + WAF (Web Application Firewall) + validation inputs + parameterized queries + auth + authz + chiffrement at-rest + audit logs. Chaque couche est une friction supplémentaire pour l'attaquant."
    }
  ],
  expert: [
    {
      "question": "[Situation → Multi-concepts] Un système de paiement distribué doit garantir qu'un débit n'est effectué qu'une fois même en cas de retry réseau, tout en maintenant une disponibilité de 99.99%. Identifiez tous les concepts architecturaux en jeu.",
      "options": [
        "Caching + rate limiting + blue-green deployment",
        "Idempotence (Idempotency-Key) + cohérence forte (CP) + circuit breaker (disponibilité) + audit trail immuable (compliance) + deux-phase commit ou saga pattern (transactions distribuées).",
        "JWT + HTTPS + CORS + GDPR",
        "Microservices + API versioning + webhooks + CI/CD"
      ],
      "answer": "Idempotence (Idempotency-Key) + cohérence forte (CP) + circuit breaker (disponibilité) + audit trail immuable (compliance) + deux-phase commit ou saga pattern (transactions distribuées).",
      "explanation": "Analyse complète d'un système de paiement : Idempotency-Key = un UUID par transaction, si déjà traité → retourner le résultat stocké. CP du CAP = cohérence forte obligatoire (ne jamais débiter deux fois > disponibilité). Circuit breaker = couper les appels vers un service dégradé pour maintenir la disponibilité globale à 99.99%. Saga pattern = remplace le 2PC dans les microservices : chaque étape est compensable (si l'étape 3 échoue, annuler les étapes 1 et 2). Audit trail Kafka = chaque transaction = événement immuable rejouable pour la compliance."
    },
    {
      "question": "[Thème ↔ Principe] Un système de cache LRU doit évincer les entrées efficacement en O(1). Quel prérequis de structure de données est indispensable ?",
      "options": [
        "Un arbre B+ pour les accès ordonnés en O(log n).",
        "Une doubly linked list (ordre d'accès — O(1) move to front/remove) + un hashmap (lookup O(1) par clé) combinés — sans les deux, LRU ne peut pas fonctionner en O(1).",
        "Un tableau trié par timestamp d'accès.",
        "Une priority queue (heap) avec timestamp comme priorité."
      ],
      "answer": "Une doubly linked list (ordre d'accès — O(1) move to front/remove) + un hashmap (lookup O(1) par clé) combinés — sans les deux, LRU ne peut pas fonctionner en O(1).",
      "explanation": "LRU O(1) : (1) HashMap : `clé → nœud de la linked list` pour un accès en O(1) sans traversal. (2) Doubly linked list : maintient l'ordre d'accès. Accès à une clé → déplacer son nœud en tête O(1) grâce aux pointeurs prev/next. Eviction = supprimer le nœud en queue O(1). Sans la doubly linked list, déplacer un nœud est O(n). Sans le hashmap, chercher un nœud est O(n). La combinaison est la structure canonique : utilisée par Redis pour son implémentation LRU approximative et par les caches navigateur."
    },
    {
      "question": "[Anti-pattern + Architecture distribuée] Une architecture microservices utilise un schéma de base de données partagé entre 5 services. Listez toutes les violations et proposez la correction.",
      "options": [
        "Pas de violation — partager une DB réduit les coûts d'infrastructure.",
        "Couplage de données fort (migration schema casse tous les services simultanément) + déploiement impossible indépendamment + transactions distribuées non isolées + violation bounded contexts DDD. Correction : une DB par service, communication par API ou events.",
        "La seule violation est l'absence de réplication de la base partagée.",
        "La violation est uniquement de performance — partitionnement horizontal résout le problème."
      ],
      "answer": "Couplage de données fort (migration schema casse tous les services simultanément) + déploiement impossible indépendamment + transactions distribuées non isolées + violation bounded contexts DDD. Correction : une DB par service, communication par API ou events.",
      "explanation": "Database per service pattern : principe fondamental des microservices. Partager une DB = (1) Un ALTER TABLE casse tous les services — déploiements coordonnés obligatoires (retour au monolithe). (2) Impossible de choisir la bonne technologie par service (SQL vs NoSQL). (3) Un service lent sature les connexions DB pour tous. (4) Tightly coupled = distributed monolith. Solution : chaque service possède son schema. Communication inter-services : API REST (synchrone) ou events Kafka (async). Eventual consistency acceptée pour les données cross-services."
    },
    {
      "question": "[Nommage inversé] Un mécanisme garantit que : les appels répétés identiques produisent le même résultat qu'un seul appel, une clé unique par opération est stockée côté serveur, et il est utilisé pour les retries réseau sans effet de bord. Quel est ce mécanisme ?",
      "options": [
        "L'idempotence des verbes HTTP (PUT, DELETE)",
        "L'idempotence applicative via Idempotency-Key — distinct de l'idempotence HTTP native (GET/PUT/DELETE) car appliquée aux opérations POST non naturellement idempotentes.",
        "Le pessimistic locking sur les enregistrements modifiés",
        "Le circuit breaker pattern"
      ],
      "answer": "L'idempotence applicative via Idempotency-Key — distinct de l'idempotence HTTP native (GET/PUT/DELETE) car appliquée aux opérations POST non naturellement idempotentes.",
      "explanation": "Distinction importante : GET/PUT/DELETE sont idempotents par définition HTTP (répéter n'a pas d'effet supplémentaire). POST ne l'est pas — créer deux fois = deux ressources. L'idempotence applicative pallie ce manque : le client génère une clé unique par intention (pas par retry), l'envoie dans `Idempotency-Key: uuid`. Le serveur stocke `clé → résultat`. Retry avec la même clé = même résultat. Clé différente = nouvelle opération. Durée de vie de la clé : 24h-7j selon le cas métier. Stripe, Adyen, toutes les APIs de paiement l'implémentent."
    },
    {
      "question": "[Thème ↔ Outil] Quel outil et quelle stratégie permettent de migrer un monolithe vers des microservices sans interruption de service ni réécriture complète ?",
      "options": [
        "Réécrire tout le monolithe en une fois dans un nouveau langage.",
        "Strangler Fig Pattern : un reverse proxy (Nginx/API Gateway) redirige graduellement les requêtes du monolithe vers de nouveaux microservices — les fonctionnalités migrées sont étranglées du monolithe progressivement.",
        "Dupliquer le monolithe et le déployer en microservices simultanément.",
        "Utiliser des feature flags pour activer les nouveaux services."
      ],
      "answer": "Strangler Fig Pattern : un reverse proxy (Nginx/API Gateway) redirige graduellement les requêtes du monolithe vers de nouveaux microservices — les fonctionnalités migrées sont étranglées du monolithe progressivement.",
      "explanation": "Strangler Fig (Martin Fowler) : inspiré du figuier étrangleur qui pousse autour d'un arbre hôte jusqu'à le remplacer. Un proxy (API Gateway) intercepte toutes les requêtes. Initialement : 100% vers le monolithe. On extrait un service (ex: UserService) → le proxy redirige `/users/*` vers le nouveau service. Progressivement, le monolithe rétrécit. Avantages : zero downtime, progressif, rollback possible par reconfiguration du proxy. Risque : double maintenance pendant la transition. Alternatif : Branch by Abstraction pour les dépendances internes."
    },
    {
      "question": "[Erreur contextuelle + GDPR] Un service collecte l'historique complet des recherches, la localisation GPS précise toutes les 5 secondes, les données biométriques et les habitudes de navigation pour 'améliorer les recommandations produits'. Quelles violations GDPR ?",
      "options": [
        "Aucune violation si l'utilisateur a cliqué 'Accepter les cookies'.",
        "Violation du principe de minimisation (données excessives vs finalité), base légale insuffisante (consentement bouton générique ≠ consentement spécifique GDPR), données biométriques = catégorie spéciale nécessitant consentement explicite renforcé.",
        "La seule violation est l'absence de chiffrement des données.",
        "GDPR ne s'applique qu'aux données financières et médicales."
      ],
      "answer": "Violation du principe de minimisation (données excessives vs finalité), base légale insuffisante (consentement bouton générique ≠ consentement spécifique GDPR), données biométriques = catégorie spéciale nécessitant consentement explicite renforcé.",
      "explanation": "GDPR Article 5 — Data Minimisation : collecter uniquement les données strictement nécessaires à la finalité. GPS toutes les 5 secondes pour des recommandations produits = disproportionné. Données biométriques = Article 9 (catégorie spéciale) : consentement explicite, spécifique, révocable — pas un bouton 'J'accepte tout'. Le consentement GDPR doit être : libre (pas de coercition), spécifique (finalité par finalité), éclairé (information claire), univoque (action positive). Un cookie banner pré-coché viole le GDPR. DPO obligatoire pour ce type de traitement à grande échelle."
    },
    {
      "question": "[Ordre de dépendance + Architecture] Dans un système de messaging temps réel (chat), quels prérequis techniques doivent être en place avant d'implémenter la synchronisation multi-appareils ?",
      "options": [
        "Un cluster Redis et un load balancer suffisent.",
        "Persistance des messages (DB) + identifiants de message ordonnés (sequence numbers ou timestamps vectoriels) + protocole de sync (WebSocket ou SSE) + résolution de conflits (CRDT pour les messages simultanés) + reconnexion avec reprise depuis le dernier message connu.",
        "Un simple cache Redis avec TTL de 24h pour les messages.",
        "Une base SQL avec transactions ACID sur chaque message."
      ],
      "answer": "Persistance des messages (DB) + identifiants de message ordonnés (sequence numbers ou timestamps vectoriels) + protocole de sync (WebSocket ou SSE) + résolution de conflits (CRDT pour les messages simultanés) + reconnexion avec reprise depuis le dernier message connu.",
      "explanation": "Dépendances en cascade pour la sync multi-appareils : (1) Persistance DB = les messages survivent aux déconnexions. (2) Sequence numbers = chaque appareil sait exactement jusqu'où il est synchronisé. (3) WebSocket ou SSE = canal push temps réel. (4) CRDT = les messages envoyés depuis deux appareils simultanément convergent sans conflit. (5) Reprise de connexion = `GET /messages?since=last_seq` pour récupérer les manqués. Sans séquençage, impossible de savoir quels messages manquent. Sans persistance, les messages perdus pendant une déconnexion disparaissent."
    },
    {
      "question": "[Refactoring + Sécurité] Un service backend fait confiance aux données fournies par le client sans validation côté serveur (validation uniquement en JavaScript frontend). Diagnostiquez et corrigez.",
      "options": [
        "La validation frontend est suffisante pour la sécurité.",
        "La validation frontend est contournable via curl/Postman/Burp Suite — tout attaquant bypasse le navigateur. Correction : validation systématique côté serveur (schémas JSON, types, ranges, whitelist) indépendamment de toute validation frontend.",
        "La seule correction est d'utiliser HTTPS pour chiffrer les données.",
        "Ajouter un WAF (Web Application Firewall) remplace la validation serveur."
      ],
      "answer": "La validation frontend est contournable via curl/Postman/Burp Suite — tout attaquant bypasse le navigateur. Correction : validation systématique côté serveur (schémas JSON, types, ranges, whitelist) indépendamment de toute validation frontend.",
      "explanation": "Règle fondamentale : never trust client input. Un attaquant envoie directement des requêtes HTTP sans passer par le navigateur — toute validation JS est ignorée. Validation serveur obligatoire : types (string, int, boolean), ranges (quantité > 0 et < 10000), formats (email regex, IBAN checksum), longueurs (max 255 chars), whitelist (enum de valeurs autorisées). La validation frontend est une UX improvement, pas une mesure de sécurité. Le WAF est une couche supplémentaire utile mais ne remplace pas la validation applicative."
    },
    {
      "question": "[Situation → Multi-concepts] Un service reçoit 50 000 req/sec pendant les pics, doit garantir 99.9% d'uptime, persiste des données critiques, et doit se remettre de pannes partielles en < 30 secondes. Architecturez la solution.",
      "options": [
        "Un seul serveur très puissant (vertical scaling) avec PostgreSQL.",
        "Horizontal scaling (auto-scaling group) + load balancer + circuit breaker + DB répliquée (primary/replica) + caching Redis + health checks + déploiement blue-green + runbook de recovery.",
        "Une seule base Redis en mode cluster suffit.",
        "Microservices sans orchestration ni monitoring."
      ],
      "answer": "Horizontal scaling (auto-scaling group) + load balancer + circuit breaker + DB répliquée (primary/replica) + caching Redis + health checks + déploiement blue-green + runbook de recovery.",
      "explanation": "Architecture haute disponibilité : Auto-scaling group = instances s'ajoutent/retirent selon la charge, réponse < 60s aux pics. Load balancer avec health checks = exclut les instances unhealthy en < 30s. Circuit breaker = isole les pannes de services dépendants. DB primary/replica = failover automatique en < 30s si primary tombe. Redis = absorbe la charge en lecture, réduit la pression DB. Blue-green = déploiements sans downtime. 99.9% uptime = max 8h45 de downtime/an = chaque composant doit avoir un failover. La somme des défenses individuelles produit la résilience globale."
    },
    {
      "question": "[Nommage inversé] Un pattern garantit qu'après une suite d'opérations partiellement échouées dans un système distribué, les modifications réussies sont compensées pour revenir à un état cohérent, sans verrouillage global. Quel est ce pattern ?",
      "options": [
        "Two-Phase Commit (2PC)",
        "Saga pattern — séquence de transactions locales avec transactions de compensation en cas d'échec d'une étape. Alternative au 2PC sans coordinator de verrouillage.",
        "Pessimistic locking distribué",
        "Event Sourcing"
      ],
      "answer": "Saga pattern — séquence de transactions locales avec transactions de compensation en cas d'échec d'une étape. Alternative au 2PC sans coordinator de verrouillage.",
      "explanation": "Saga (Hector Garcia-Molina, 1987) : pour une commande e-commerce multi-services : (1) PaymentService.debit() → OK. (2) InventoryService.reserve() → OK. (3) ShippingService.schedule() → FAIL. Compensation : ShippingService ne nécessite pas de compensation (échoué). InventoryService.release(). PaymentService.refund(). Deux implémentations : Choreography (chaque service publie/écoute des événements Kafka) ou Orchestration (un Saga Orchestrator central). 2PC = verrouillage global bloquant. Saga = éventuellement cohérent, mais non bloquant. Idéal pour les microservices avec transactions métier longues."
    },
    {
      "question": "[Thème ↔ Concept] Comment le principe 'Defense in Depth' s'applique-t-il à la protection d'un endpoint d'upload de fichiers ?",
      "options": [
        "Il suffit de valider le Content-Type header envoyé par le client.",
        "Couche 1 : validation MIME type réelle (magic bytes, pas le header client). Couche 2 : limite de taille. Couche 3 : renommage du fichier (UUID). Couche 4 : stockage hors webroot. Couche 5 : scan antivirus. Couche 6 : HTTPS. Couche 7 : authentification + autorisation.",
        "HTTPS seul suffit pour sécuriser les uploads.",
        "Stocker les fichiers dans la base de données (BLOB) est plus sécurisé."
      ],
      "answer": "Couche 1 : validation MIME type réelle (magic bytes, pas le header client). Couche 2 : limite de taille. Couche 3 : renommage du fichier (UUID). Couche 4 : stockage hors webroot. Couche 5 : scan antivirus. Couche 6 : HTTPS. Couche 7 : authentification + autorisation.",
      "explanation": "Defense in Depth sur les uploads : (1) Magic bytes = lire les premiers octets du fichier pour détecter le vrai type (un fichier .jpg peut contenir du PHP). Le Content-Type header est fourni par le client — non fiable. (2) Taille max = évite les DoS par upload massif. (3) UUID renommage = évite la collision de noms et l'exécution via URL prévisible. (4) Hors webroot = un fichier malveillant uploadé ne peut pas être exécuté via URL directe. (5) Antivirus = ClamAV ou service cloud. Chaque couche compense la défaillance des autres."
    },
    {
      "question": "[Ordre de dépendance] Dans la mise en place d'un système d'audit trail conforme GDPR, quel est l'ordre de dépendance des composants ?",
      "options": [
        "L'ordre n'a pas d'importance — tous les composants peuvent être déployés simultanément.",
        "1. Définir les événements métier à auditer → 2. Implémenter l'émission d'événements immuables (Kafka/event store) → 3. Stocker avec horodatage non modifiable → 4. Mettre en place le contrôle d'accès aux logs → 5. Définir la politique de rétention (5 ans GDPR).",
        "1. Chiffrement → 2. Base de données → 3. API → 4. Authentification.",
        "1. CI/CD → 2. Tests → 3. Déploiement → 4. Audit."
      ],
      "answer": "1. Définir les événements métier à auditer → 2. Implémenter l'émission d'événements immuables (Kafka/event store) → 3. Stocker avec horodatage non modifiable → 4. Mettre en place le contrôle d'accès aux logs → 5. Définir la politique de rétention (5 ans GDPR).",
      "explanation": "Ordre de dépendance critique : sans définition des événements (1), on ne sait pas quoi capturer. Sans émission immuable (2), les logs peuvent être modifiés a posteriori — non conforme. Sans horodatage non modifiable (3), la chronologie peut être falsifiée. Sans contrôle d'accès (4), les logs d'audit peuvent être lus ou altérés par des non-autorisés (eux-mêmes à auditer). Sans politique de rétention (5), les données sont soit supprimées trop tôt (non conforme) soit conservées trop longtemps (violation minimisation GDPR). GDPR impose en pratique 5-7 ans pour les données transactionnelles."
    },
    {
      "question": "[Multi-concepts] Expliquez comment le CAP theorem, la cohérence éventuelle, et les CRDTs se combinent dans le contexte d'une application de collaboration temps réel (type Google Docs multi-utilisateurs).",
      "options": [
        "Ces concepts sont incompatibles avec les applications collaboratives.",
        "CAP → choix AP (disponibilité + partition tolerance). Eventual consistency → les modifications de chaque utilisateur se propagent sans garantie de délai. CRDTs (ex: CRJA ou Yjs) → structure de données qui converge automatiquement sans conflit même si des modifications simultanées arrivent dans n'importe quel ordre.",
        "Google Docs utilise un système CP avec verrouillage pessimiste.",
        "La cohérence forte est nécessaire pour la collaboration temps réel."
      ],
      "answer": "CAP → choix AP (disponibilité + partition tolerance). Eventual consistency → les modifications de chaque utilisateur se propagent sans garantie de délai. CRDTs (ex: CRJA ou Yjs) → structure de données qui converge automatiquement sans conflit même si des modifications simultanées arrivent dans n'importe quel ordre.",
      "explanation": "Architecture Google Docs : CAP trade-off AP = rester disponible même si un utilisateur est partitionné réseau (offline editing). Eventual consistency = les modifications d'Alice et Bob se propagent éventuellement à tous. CRDT (Conflict-free Replicated Data Type) : une structure mathématique où les opérations commutent — `Alice insère 'A' à position 5` + `Bob insère 'B' à position 5` convergent vers le même résultat quel que soit l'ordre d'application. Yjs, Automerge sont des implémentations CRDT pour les éditeurs collaboratifs. Operational Transformation (OT) = alternative plus complexe utilisée historiquement par Google Wave."
    },
    {
      "question": "[Erreur contextuelle + Performance] Un développeur utilise `SELECT *` dans toutes ses requêtes SQL et sérialise les objets complets (avec 50 champs) dans chaque réponse API. Diagnostiquez et corrigez.",
      "options": [
        "C'est une bonne pratique — retourner toutes les données évite de faire plusieurs requêtes.",
        "`SELECT *` = sur-fetch DB (colonnes inutiles, index non utilisés, large payload réseau). Réponse API avec 50 champs = sur-fetch client. Correction : SELECT uniquement les colonnes nécessaires + projections DTO côté API + GraphQL pour la flexibilité client.",
        "La seule correction est d'ajouter un index sur la table.",
        "Serialiser des objets larges améliore la performance du cache."
      ],
      "answer": "`SELECT *` = sur-fetch DB (colonnes inutiles, index non utilisés, large payload réseau). Réponse API avec 50 champs = sur-fetch client. Correction : SELECT uniquement les colonnes nécessaires + projections DTO côté API + GraphQL pour la flexibilité client.",
      "explanation": "Over-fetching : `SELECT *` charge toutes les colonnes même celles non utilisées — plus de données réseau DB→app, impossible d'utiliser des covering indexes (index qui contient toutes les colonnes du SELECT). Sur 50M lignes, la différence entre `SELECT id, name` et `SELECT *` (200 colonnes dont BLOB) peut être de 100x. Côté API, retourner 50 champs quand le client en utilise 3 = payload inutilement large, parsing côté client lent. Pattern DTO : mapper les entités DB vers des objets de transfert adaptés à chaque use case. GraphQL résout élégamment ce problème : le client demande exactement les champs qu'il veut."
    },
    {
      "question": "[Thème ↔ Architecture] Comment concevoir un système de sessions hautement disponible qui survit à la perte d'un datacenter, sans sticky sessions ?",
      "options": [
        "Répliquer les sessions en mémoire sur toutes les instances backend.",
        "Redis Cluster multi-zones avec réplication cross-datacenter, sessions stockées avec TTL, chiffrement des données de session, circuit breaker si Redis est indisponible avec fallback JWT.",
        "Utiliser des sticky sessions avec le load balancer pour éviter la réplication.",
        "Stocker les sessions en PostgreSQL avec réplication synchrone."
      ],
      "answer": "Redis Cluster multi-zones avec réplication cross-datacenter, sessions stockées avec TTL, chiffrement des données de session, circuit breaker si Redis est indisponible avec fallback JWT.",
      "explanation": "Architecture sessions HA : Redis Cluster = consistent hashing répartit les sessions sur N shards. Multi-zones = si datacenter A tombe, datacenter B a une réplique des sessions (réplication async, acceptable pour les sessions). TTL = expiration automatique des sessions inactives. Chiffrement = les données de session (userId, rôles, préférences) ne doivent pas être lisibles en clair dans Redis. Circuit breaker : si Redis est down, fallback vers JWT (stateless) — dégradation gracieuse au lieu de panne totale. PostgreSQL pour les sessions = trop lent (chaque requête = une lecture DB vs Redis = <1ms)."
    },
    {
      "question": "[Anti-pattern + Architecture] Un développeur utilise un appel HTTP synchrone dans le hot path d'une API pour appeler un service externe de notation de crédit qui répond en 3-8 secondes. Diagnostiquez et refactorisez.",
      "options": [
        "C'est acceptable si le timeout HTTP est configuré à 10 secondes.",
        "Le thread serveur est bloqué 3-8s par requête — à 100 req/sec = 300-800 threads bloqués simultanément → épuisement du pool de threads. Refactoring : réponse immédiate 202 + job async dans une queue + webhook/polling pour le résultat.",
        "La seule correction est d'augmenter le pool de threads.",
        "Utiliser async/await résout le problème de blocage des threads."
      ],
      "answer": "Le thread serveur est bloqué 3-8s par requête — à 100 req/sec = 300-800 threads bloqués simultanément → épuisement du pool de threads. Refactoring : réponse immédiate 202 + job async dans une queue + webhook/polling pour le résultat.",
      "explanation": "Thread starvation : avec un pool de 500 threads (Tomcat default), 100 req/sec × 5s moyenne = 500 threads occupés en permanence. La 501ème requête est mise en attente → latence en cascade → timeout côté client → retries → pire encore. Async/await (Node.js/Python) aide mais ne résout pas le problème fondamental : l'opération longue tient une connexion ouverte. Pattern correct : 202 Accepted + `Location: /jobs/{id}`. La notation crédit s'exécute en background worker. Le client poll `GET /jobs/{id}` ou reçoit un webhook quand c'est terminé. Le thread serveur est libre immédiatement après le 202."
    },
    {
      "question": "[Ordre de dépendance] Pour implémenter un système de webhook sécurisé côté émetteur (envoi de notifications à des systèmes tiers), quel est l'ordre de dépendance des composants ?",
      "options": [
        "L'ordre n'a pas d'importance.",
        "1. Définir les événements → 2. Persister les événements (DB) avant d'envoyer → 3. Implémenter le retry avec backoff exponentiel → 4. Signer les payloads (HMAC-SHA256) → 5. Logger les livraisons + statuts → 6. Exposer une interface de gestion des abonnements.",
        "1. Envoyer → 2. Logger → 3. Retry → 4. Sécurité.",
        "1. Sécurité → 2. Envoi → 3. Persistance → 4. Retry."
      ],
      "answer": "1. Définir les événements → 2. Persister les événements (DB) avant d'envoyer → 3. Implémenter le retry avec backoff exponentiel → 4. Signer les payloads (HMAC-SHA256) → 5. Logger les livraisons + statuts → 6. Exposer une interface de gestion des abonnements.",
      "explanation": "Ordre critique : persistance (2) avant envoi = si l'envoi échoue, l'événement n'est pas perdu — at-least-once delivery. Sans persistance, les événements émis pendant une indisponibilité du receveur sont perdus. Retry avec backoff (3) = 1s, 2s, 4s, 8s... évite de saturer un receveur en difficulté. HMAC-SHA256 (4) = le receveur vérifie `HMAC(secret, payload) == header signature` — authentifie que c'est bien vous l'émetteur. Logging des statuts (5) = monitoring de la santé des abonnements. Interface de gestion (6) = les clients gèrent leurs endpoints. Chaque étape dépend de la précédente pour être fiable."
    }
  ]
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
        ? <h3 className="success">🚀 Excellent ! Backend development maîtrisé.</h3>
        : <p className="fail">📚 Révisez les concepts backend fondamentaux et avancés.</p>
      }
    </div>
  );
};

const BackendInterviewQCM = () => {
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
  }, [level, currentQuestion]);

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, handleNextQuestion, message]);

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
      }, 20000);
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
            Backend Interview 🔹 {level === "basic"
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

export default BackendInterviewQCM;
