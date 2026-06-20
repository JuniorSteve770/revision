// src/projects/Project3/pages/Page12_Architecture.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Phase 1 — Comprendre le contexte du projet",
    "answer": "**Avant tout outil ou archi, poser les bonnes questions.** ◆ **Type de projet** : Web ? Mobile ? Data pipeline ? Système embarqué ? API B2B ? ◆ **Taille d'équipe** : 1 dev solo → monolithe. 50 devs → découpage nécessaire. ◆ **Horizon de maintenance** : MVP 3 mois vs produit 10 ans → complexité acceptable très différente. ◆ **Contraintes imposées** : stack client fixée, réglementation (RGPD, SOX, MiFID II), budget licences, cloud provider imposé. ◆ **Questions clés** : Quel est le domaine métier principal ? Quelle est la criticité (downtime toléré ?) ? Qui sont les utilisateurs (nombre, profil) ? Y a-t-il des pics de charge prévisibles ? ◆ **Erreur classique** : choisir les outils avant de comprendre les contraintes → over-engineering ou under-engineering. ◆ **Livrable** : une fiche contexte partagée avec l'équipe avant la moindre décision technique."
  },
  {
    "question": "Phase 2 — Choisir un style d'architecture",
    "answer": "**L'architecture dicte les besoins en outillage — pas l'inverse.** ◆ **Monolithique** : tout en un seul déployable. Simple à développer/debugger. Problème de scalabilité à grande échelle. Idéal pour les petites équipes et les MVPs. ◆ **Microservices** : services indépendants communicant via API/messages. Scalabilité fine, déploiement indépendant. Complexité opérationnelle élevée (réseau, observabilité, données distribuées). ◆ **Serverless** : fonctions déclenchées par événements, pas de serveur à gérer. Coût à l'usage, scalabilité automatique. Cold start, vendor lock-in, debug difficile. ◆ **Event-driven** : communication asynchrone via événements (Kafka, RabbitMQ). Découplage fort, résilience. Cohérence éventuelle. ◆ **Patterns structurants** : CQRS (séparation lecture/écriture), Clean Architecture (règle de dépendance vers le centre), Hexagonale (ports & adapters), MVC (séparation UI/logique/données). ◆ **Critères** : couplage, scalabilité nécessaire, complexité opérationnelle acceptable, compétences de l'équipe."
  },
  {
    "question": "Phase 3 — Sélectionner les outils de modélisation",
    "answer": "**Modéliser avant de coder = aligner l'équipe sur la vision.** ◆ **C4 Model** : 4 niveaux de zoom. L1 = Contexte (système + acteurs externes). L2 = Conteneurs (apps, DBs, services). L3 = Composants (modules internes d'un conteneur). L4 = Code (classes, fonctions — rarement nécessaire). ◆ **Mermaid** : diagrammes en Markdown, intégré dans GitHub/GitLab/Notion. Versionnable en Git. Courbe d'apprentissage faible. ◆ **PlantUML** : plus expressif, syntaxe textuelle, nombreux types de diagrammes. Nécessite un serveur de rendu. ◆ **draw.io / Lucidchart** : GUI drag & drop, facile d'accès pour les non-techniques. Moins intégré au code. ◆ **Figma / Balsamiq** : prototypage UI, wireframes. ◆ **Critères de choix** : courbe d'apprentissage, intégration CI/CD et Git, collaboration temps réel, licence (open source vs payant), adoption réelle dans l'équipe. ◆ **Règle** : préférer les outils as-code (Mermaid, PlantUML) pour la maintenabilité."
  },
  {
    "question": "Phase 4 — Choisir les outils de développement et CI/CD",
    "answer": "**4 critères qui comptent vraiment : maturité, coût total, intégration CI/CD, support long terme.** ◆ **Langages & frameworks** : choisir selon la compétence de l'équipe, l'écosystème (librairies disponibles), les performances requises. Ne pas choisir le dernier framework hype si l'équipe ne le maîtrise pas. ◆ **Gestionnaires de dépendances** : npm/yarn/pnpm (JS/TS), Poetry/pip-tools (Python), Maven/Gradle (Java). Lockfile obligatoire pour la reproductibilité. ◆ **CI/CD** : GitHub Actions (intégré, gratuit pour open source), GitLab CI (self-hosted possible), CircleCI, Jenkins (legacy mais répandu). Critères : coût, intégration native avec le repo, marketplace de plugins. ◆ **Infrastructure** : Docker (conteneurisation), Kubernetes (orchestration — attention over-engineering), Terraform (IaC déclaratif), cloud provider (AWS, GCP, Azure). ◆ **Coût total (TCO)** : licences + apprentissage + opérations + migration future. Un outil gratuit avec une courbe d'apprentissage de 6 mois peut coûter plus cher qu'un outil payant."
  },
  {
    "question": "Phase 5 — Valider, documenter et itérer (ADR)",
    "answer": "**Les décisions architecturales oubliées sont les dettes techniques de demain.** ◆ **ADR (Architecture Decision Record)** : un fichier Markdown par décision clé. Structure : Titre, Statut (proposé/accepté/déprécié), Contexte, Décision, Conséquences. Stocker dans `/docs/adr/` versionné en Git. ◆ **Quand créer un ADR** : choix de base de données, changement d'architecture, adoption d'un nouveau framework, décision de sécurité. ◆ **Prototype / Spike** : valider une hypothèse technique avant de l'adopter. Spike = exploration timeboxée (ex: 2 jours pour évaluer Kafka vs RabbitMQ). Prototype = version simplifiée pour valider la faisabilité. ◆ **Revues régulières** : l'outil se résiste-t-il à l'évolution du projet ? Feedback équipe = adoption réelle vs théorique. ◆ **Règle d'or** : un outil familier et maîtrisé par l'équipe vaut mieux qu'un outil techniquement supérieur mais inconnu. ◆ **GitOps** : la config infrastructure est dans Git, les déploiements sont déclenchés par des commits."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Phase 1] Quelle est la première question à poser avant de choisir une architecture ?",
      "options": [
        "Quel framework est le plus populaire en ce moment ?",
        "Quel est le contexte du projet : domaine métier, taille d'équipe, contraintes imposées, horizon de maintenance ?",
        "Quel cloud provider offre le meilleur prix ?",
        "Quelle architecture utilisent les GAFAM ?"
      ],
      "answer": "Quel est le contexte du projet : domaine métier, taille d'équipe, contraintes imposées, horizon de maintenance ?",
      "explanation": "L'erreur classique est de choisir des outils ou une architecture avant de comprendre les contraintes. Un MVP solo avec un horizon de 3 mois n'a pas les mêmes besoins qu'un système bancaire avec 50 développeurs. Les contraintes imposées (stack client, réglementation, budget) peuvent d'emblée éliminer de nombreuses options. La fiche contexte est le livrable de cette phase — partagée avec toute l'équipe avant la moindre décision technique."
    },
    {
      "question": "[Phase 1] Qu'est-ce qu'une contrainte imposée dans le contexte d'un projet ?",
      "options": [
        "Une contrainte que l'équipe s'impose elle-même pour la qualité du code.",
        "Une stack, réglementation ou budget fixé par le client, la loi ou l'organisation — qui réduit l'espace de décision technique.",
        "Un délai de livraison serré.",
        "Une limitation de performance du système."
      ],
      "answer": "Une stack, réglementation ou budget fixé par le client, la loi ou l'organisation — qui réduit l'espace de décision technique.",
      "explanation": "Exemples : client imposant AWS uniquement, réglementation MiFID II imposant l'audit trail, budget licences nul → open source uniquement, stack Java imposée par le DSI. Identifier ces contraintes en premier évite de passer des semaines à évaluer des options impossibles. En finance : SOX, MiFID II, RGPD sont des contraintes qui impactent directement les choix de base de données, de logging, de chiffrement."
    },
    {
      "question": "[Phase 2] Quel style d'architecture est le plus adapté pour un MVP développé par une équipe de 2 personnes ?",
      "options": [
        "Microservices — pour être prêt à scaler dès le début.",
        "Monolithique — simple à développer, déployer et déboguer. La complexité opérationnelle des microservices est injustifiée à ce stade.",
        "Event-driven — pour le découplage.",
        "Serverless — pour éviter la gestion de serveurs."
      ],
      "answer": "Monolithique — simple à développer, déployer et déboguer. La complexité opérationnelle des microservices est injustifiée à ce stade.",
      "explanation": "Martin Fowler : 'Don't start with microservices'. Une petite équipe perd plus de temps à gérer la complexité réseau, l'observabilité distribuée et les transactions distribuées qu'elle n'en gagne. Un monolithe bien structuré (modulaire) peut évoluer vers des microservices quand les besoins réels de scalabilité et de déploiement indépendant apparaissent. Le monolithe modulaire est souvent le meilleur compromis initial."
    },
    {
      "question": "[Phase 2] Quelle est la principale différence entre une architecture monolithique et une architecture microservices ?",
      "options": [
        "Le monolithe est écrit en un seul langage, les microservices peuvent en utiliser plusieurs.",
        "Monolithe : tout déployé ensemble en un seul artefact. Microservices : services indépendants déployés séparément, communicant via API ou messages.",
        "Les microservices sont toujours plus rapides que les monolithes.",
        "Un monolithe ne peut pas avoir de base de données."
      ],
      "answer": "Monolithe : tout déployé ensemble en un seul artefact. Microservices : services indépendants déployés séparément, communicant via API ou messages.",
      "explanation": "Monolithe : un seul déployable, une base de code partagée, transactions ACID natives, debug simple. Microservices : chaque service = son propre déploiement, sa propre base de données, sa propre stack potentiellement. Avantages microservices : scalabilité fine par service, déploiement indépendant, isolation des pannes. Inconvénients : latence réseau, cohérence distribuée, complexité opérationnelle (service mesh, tracing distribué)."
    },
    {
      "question": "[Phase 2] Dans quel cas le pattern Event-Driven est-il particulièrement adapté ?",
      "options": [
        "Quand on veut simplifier l'architecture.",
        "Quand plusieurs systèmes doivent réagir à des événements de manière asynchrone et découplée — ex: un trade exécuté déclenche la mise à jour des positions, du P&L, et l'envoi d'une confirmation.",
        "Quand on a besoin de requêtes SQL complexes.",
        "Quand l'équipe est petite et le projet simple."
      ],
      "answer": "Quand plusieurs systèmes doivent réagir à des événements de manière asynchrone et découplée — ex: un trade exécuté déclenche la mise à jour des positions, du P&L, et l'envoi d'une confirmation.",
      "explanation": "Event-driven : le producteur émet un événement (TradeExecuted) sans savoir qui le consomme. Plusieurs consommateurs réagissent indépendamment. Avantages : découplage fort, résilience (le consommateur peut être down et rattraper), extensibilité (ajouter un nouveau consommateur sans modifier le producteur). Inconvénients : cohérence éventuelle (pas immédiate), debug plus complexe (tracing des événements), ordre des messages. Kafka, RabbitMQ, AWS SNS/SQS sont les brokers courants."
    },
    {
      "question": "[Phase 2] Qu'est-ce que le couplage en architecture logicielle ?",
      "options": [
        "La vitesse de communication entre deux services.",
        "Le degré de dépendance entre deux modules ou services — couplage fort = un changement dans A nécessite un changement dans B. Objectif : couplage faible.",
        "Le nombre de connexions simultanées qu'un système peut gérer.",
        "La taille du code partagé entre deux équipes."
      ],
      "answer": "Le degré de dépendance entre deux modules ou services — couplage fort = un changement dans A nécessite un changement dans B. Objectif : couplage faible.",
      "explanation": "Couplage fort : le service de trading appelle directement le service de risk en HTTP synchrone avec des objets partagés — si Risk change son API, Trading doit changer. Couplage faible : Trading publie un événement, Risk le consomme — chacun peut évoluer indépendamment. Techniques de découplage : interfaces/contrats, événements asynchrones, injection de dépendances. En architecture : préférer le couplage par données (partager des structures simples) au couplage par code (partager des classes ou librairies)."
    },
    {
      "question": "[Phase 3] Quels sont les 4 niveaux du C4 Model ?",
      "options": [
        "Classe, Module, Package, Application.",
        "Contexte, Conteneurs, Composants, Code — du plus haut niveau (système dans son environnement) au plus bas (implémentation).",
        "Frontend, Backend, Database, Infrastructure.",
        "Conception, Développement, Test, Production."
      ],
      "answer": "Contexte, Conteneurs, Composants, Code — du plus haut niveau (système dans son environnement) au plus bas (implémentation).",
      "explanation": "L1 Contexte : le système dans son environnement (utilisateurs, systèmes externes). Visible par les non-techniques. L2 Conteneurs : applications, bases de données, services qui composent le système. L3 Composants : modules internes d'un conteneur (ex: les modules d'une application Spring). L4 Code : classes, fonctions — rarement nécessaire, souvent généré depuis le code. La force du C4 : chaque niveau s'adresse à une audience différente. L1 pour le business, L2 pour les architectes, L3 pour les développeurs."
    },
    {
      "question": "[Phase 3] Quel est l'avantage principal de Mermaid par rapport à draw.io ?",
      "options": [
        "Mermaid produit des diagrammes plus beaux.",
        "Mermaid est du texte (Markdown) — versionnable en Git, intégré nativement dans GitHub/GitLab/Notion, modifiable sans outil graphique.",
        "Mermaid supporte plus de types de diagrammes.",
        "Mermaid est plus rapide à utiliser pour les non-développeurs."
      ],
      "answer": "Mermaid est du texte (Markdown) — versionnable en Git, intégré nativement dans GitHub/GitLab/Notion, modifiable sans outil graphique.",
      "explanation": "Diagramme as code : le source est du texte, versionnable comme le code source. Diff Git lisible. Intégré dans les README, les wikis, les PRs. draw.io produit des fichiers binaires XML — diff Git illisible, nécessite l'outil graphique pour modifier. Mermaid dans GitHub : les blocs ```mermaid sont rendus directement. PlantUML : similaire mais nécessite un serveur de rendu ou un plugin. En pratique : Mermaid pour les diagrammes simples et collaboratifs, draw.io pour les diagrammes complexes ou ad hoc."
    },
    {
      "question": "[Phase 3] Quel outil est le plus adapté pour créer des wireframes d'interface utilisateur ?",
      "options": [
        "Mermaid — pour les diagrammes de flux UI.",
        "Figma ou Balsamiq — outils de prototypage UI avec composants réutilisables, collaboration temps réel, et partage de liens.",
        "PlantUML — pour les diagrammes de séquence d'interface.",
        "draw.io — pour les wireframes techniques."
      ],
      "answer": "Figma ou Balsamiq — outils de prototypage UI avec composants réutilisables, collaboration temps réel, et partage de liens.",
      "explanation": "Figma : prototypage haute fidélité, design system, collaboration temps réel, liens partageables pour les reviews. Balsamiq : wireframes basse fidélité (aspect 'esquissé' intentionnel pour ne pas se perdre dans les détails visuels). Adobe XD : alternative à Figma, plus intégré à l'écosystème Adobe. Critères de choix : niveau de fidélité souhaité, budget (Figma gratuit jusqu'à 3 projets), courbe d'apprentissage, compatibilité avec le workflow de l'équipe."
    },
    {
      "question": "[Phase 4] Qu'est-ce qu'un lockfile (package-lock.json, poetry.lock) et pourquoi est-il obligatoire ?",
      "options": [
        "Un fichier qui protège le code source contre les modifications.",
        "Un fichier qui enregistre les versions exactes de toutes les dépendances transitives — garantit que tous les membres de l'équipe et la CI ont exactement les mêmes versions.",
        "Un fichier de configuration pour verrouiller les droits d'accès.",
        "Un lockfile empêche les mises à jour automatiques des dépendances."
      ],
      "answer": "Un fichier qui enregistre les versions exactes de toutes les dépendances transitives — garantit que tous les membres de l'équipe et la CI ont exactement les mêmes versions.",
      "explanation": "Sans lockfile : npm install peut donner des versions différentes selon le moment d'installation ('works on my machine'). Avec lockfile : même commit → mêmes versions → comportement identique. À toujours committer dans Git (contrairement à node_modules). Régénéré automatiquement lors des mises à jour de dépendances. En Data Engineering : poetry.lock pour Python, package-lock.json pour Node, pom.xml avec versions fixes pour Maven."
    },
    {
      "question": "[Phase 4] Quelle est la différence entre Docker et Kubernetes ?",
      "options": [
        "Docker et Kubernetes font la même chose.",
        "Docker : conteneurisation (packaging d'une application et ses dépendances). Kubernetes : orchestration de conteneurs (déploiement, scaling, load balancing, auto-restart) à grande échelle.",
        "Kubernetes remplace Docker depuis 2023.",
        "Docker est pour le développement, Kubernetes pour les tests."
      ],
      "answer": "Docker : conteneurisation (packaging d'une application et ses dépendances). Kubernetes : orchestration de conteneurs (déploiement, scaling, load balancing, auto-restart) à grande échelle.",
      "explanation": "Docker : `docker build` → image. `docker run` → conteneur. Garantit la reproductibilité de l'environnement. Kubernetes (K8s) : gère des clusters de conteneurs. Fonctionnalités : auto-scaling horizontal, rolling deployments, health checks, service discovery, secrets management. Kubernetes est souvent over-engineering pour des équipes de moins de 10 personnes ou des projets sans besoins de haute disponibilité. Alternative plus simple : Docker Compose (dev), AWS ECS, Railway, Render, Fly.io."
    },
    {
      "question": "[Phase 4] Qu'est-ce que le Coût Total de Possession (TCO) d'un outil ?",
      "options": [
        "Le prix de la licence annuelle de l'outil.",
        "Licences + coût d'apprentissage de l'équipe + opérations quotidiennes + coût de migration future — la somme réelle sur la durée de vie de l'outil.",
        "Le nombre d'heures passées à configurer l'outil.",
        "Le coût de l'infrastructure hébergeant l'outil."
      ],
      "answer": "Licences + coût d'apprentissage de l'équipe + opérations quotidiennes + coût de migration future — la somme réelle sur la durée de vie de l'outil.",
      "explanation": "Un outil open source 'gratuit' peut avoir un TCO élevé : 3 mois d'apprentissage de l'équipe, ops complexes, migration difficile si on veut en changer. Un outil SaaS payant peut avoir un TCO faible : zero ops, support inclus, adoption immédiate. Exemple : Kubernetes open source mais TCO élevé (ingénieurs DevOps dédiés) vs AWS ECS managé (moins flexible mais TCO réduit). En phase 4 : toujours calculer le TCO, pas seulement le prix de la licence."
    },
    {
      "question": "[Phase 4] Qu'est-ce que l'Infrastructure as Code (IaC) et quel outil utiliser ?",
      "options": [
        "Documenter l'infrastructure dans un fichier texte.",
        "Décrire l'infrastructure dans des fichiers de configuration versionnés (Terraform, Pulumi, AWS CDK) — reproductible, versionnable en Git, auditable, déployable automatiquement.",
        "Écrire des scripts bash pour provisionner les serveurs.",
        "IaC est uniquement pour les environnements cloud."
      ],
      "answer": "Décrire l'infrastructure dans des fichiers de configuration versionnés (Terraform, Pulumi, AWS CDK) — reproductible, versionnable en Git, auditable, déployable automatiquement.",
      "explanation": "Terraform (HCL) : le standard de facto. Déclaratif — on décrit l'état désiré, Terraform calcule les changements. Multi-cloud. Pulumi : IaC avec des langages réels (Python, TypeScript). AWS CDK : IaC pour AWS avec Python/TypeScript. Avantages IaC vs scripts manuels : reproductibilité (recréer l'env identique), drift detection (écart entre code et réalité), code review des changements infra, disaster recovery rapide. Critique en production : une infra non codifiée est une dette opérationnelle."
    },
    {
      "question": "[Phase 5] Qu'est-ce qu'un ADR (Architecture Decision Record) ?",
      "options": [
        "Un rapport annuel sur l'état de l'architecture.",
        "Un court fichier Markdown documentant une décision architecturale : contexte, décision prise, et conséquences — stocké en Git avec le code.",
        "Un ticket JIRA pour les tâches d'architecture.",
        "Un diagramme UML de l'architecture du système."
      ],
      "answer": "Un court fichier Markdown documentant une décision architecturale : contexte, décision prise, et conséquences — stocké en Git avec le code.",
      "explanation": "Format minimal d'un ADR : # ADR-001 Utiliser PostgreSQL comme base de données principale. Statut: Accepté. Contexte: Besoin de transactions ACID, équipe familière avec SQL. Décision: PostgreSQL. Conséquences: +ACID, +maturité, -scalabilité horizontale native. Stocké dans /docs/adr/. Invaluable 6 mois plus tard quand on se demande 'pourquoi on avait choisi ça'. Michael Nygard a popularisé ce format. Les ADRs créent une mémoire institutionnelle et facilitent l'onboarding."
    },
    {
      "question": "[Phase 5] Quelle est la différence entre un prototype et un spike ?",
      "options": [
        "Un prototype est plus complexe qu'un spike.",
        "Spike : exploration timeboxée (ex: 2 jours) pour répondre à une question technique spécifique. Prototype : version simplifiée fonctionnelle pour valider la faisabilité globale. Les deux sont jetables.",
        "Un prototype est livré aux utilisateurs, un spike non.",
        "Spike et prototype sont des termes interchangeables."
      ],
      "answer": "Spike : exploration timeboxée (ex: 2 jours) pour répondre à une question technique spécifique. Prototype : version simplifiée fonctionnelle pour valider la faisabilité globale. Les deux sont jetables.",
      "explanation": "Spike (terme XP/Agile) : 'On a 2 jours pour évaluer si Kafka peut gérer notre volume de messages'. Focalisé sur une question précise, livrable = rapport/démo. Prototype : 'Construire une version simplifiée du pipeline pour montrer que l'approche fonctionne'. Plus large. Les deux sont timeboxés et le code est considéré jetable (pas de code de prod). En pratique : spike avant d'adopter une nouvelle technologie risquée. Prototyper l'UI avant de coder la logique métier."
    },
    {
      "question": "[Phase 5] Qu'est-ce que la règle d'or des outils techniques ?",
      "options": [
        "Toujours utiliser les outils les plus récents et les plus populaires.",
        "Un outil familier et maîtrisé par l'équipe vaut mieux qu'un outil techniquement supérieur mais inconnu — la courbe d'apprentissage et l'adoption réelle comptent plus que les benchmarks.",
        "Toujours choisir l'outil open source.",
        "L'outil le moins cher est toujours le meilleur choix."
      ],
      "answer": "Un outil familier et maîtrisé par l'équipe vaut mieux qu'un outil techniquement supérieur mais inconnu — la courbe d'apprentissage et l'adoption réelle comptent plus que les benchmarks.",
      "explanation": "Exemples : une équipe Java senior productive en Spring Boot ne devrait pas migrer vers un framework Rust 'plus performant' sans raison critique. PostgreSQL maîtrisé > CockroachDB 'supérieur' inconnu. La productivité d'une équipe maîtrisant son outil dépasse souvent la performance théorique d'un outil nouveau. Exceptions : quand l'outil existant atteint une limite réelle (scalabilité, performance mesurée), ou quand la roadmap impose une migration. La formation et le temps d'adoption ont un coût réel."
    },
    {
      "question": "[Phase 2] Qu'est-ce que le pattern MVC ?",
      "options": [
        "Model-View-Controller : séparation entre la logique métier (Model), l'affichage (View) et l'orchestration (Controller).",
        "Multi-Version Control : gestion des versions d'une API.",
        "Modular-Vertical-Component : organisation du code en modules verticaux.",
        "Message-Value-Cache : pattern de mise en cache des messages."
      ],
      "answer": "Model-View-Controller : séparation entre la logique métier (Model), l'affichage (View) et l'orchestration (Controller).",
      "explanation": "MVC : le Controller reçoit la requête, appelle le Model (logique métier / données), retourne le résultat à la View (affichage). Exemples : Django (Python), Spring MVC (Java), Rails (Ruby), ASP.NET MVC. Avantages : séparation des préoccupations, testabilité du Model indépendamment de la View. Évolutions : MVP (Presenter), MVVM (ViewModel pour les UIs réactives), Flux/Redux (flux de données unidirectionnel pour React). En pratique : MVC est un bon point de départ mais peut devenir insuffisant pour les domaines métier complexes (→ Clean Architecture, DDD)."
    },
    {
      "question": "[Phase 4] Qu'est-ce que GitHub Actions dans un pipeline CI/CD ?",
      "options": [
        "Un outil pour gérer les branches Git.",
        "Une plateforme CI/CD intégrée à GitHub — workflows déclenchés par des événements Git (push, PR, tag) définis en YAML, avec un marketplace d'actions réutilisables.",
        "Un service de déploiement automatique sur AWS uniquement.",
        "Un outil de code review automatisé."
      ],
      "answer": "Une plateforme CI/CD intégrée à GitHub — workflows déclenchés par des événements Git (push, PR, tag) définis en YAML, avec un marketplace d'actions réutilisables.",
      "explanation": ".github/workflows/ci.yml : on: [push, pull_request] → jobs: lint → test → build → deploy. Actions marketplace : actions/checkout, actions/setup-python, docker/build-push-action. Gratuit pour les repos publics, minutes limitées pour les privés. Avantages : zéro configuration externe, intégré nativement à GitHub, grande communauté d'actions réutilisables. Alternatives : GitLab CI (self-hosted possible), CircleCI (plus flexible), Jenkins (legacy, très répandu en enterprise). Critère clé : où est hébergé le code source → privilégier l'outil natif."
    },
    {
      "question": "[Phase 3] Pourquoi préférer les outils de modélisation 'as-code' (Mermaid, PlantUML) aux outils graphiques ?",
      "options": [
        "Parce qu'ils produisent de plus beaux diagrammes.",
        "Les diagrammes textuels sont versionnables en Git (diff lisible), modifiables sans outil graphique, intégrables dans la documentation, et évoluent avec le code.",
        "Les outils graphiques ne supportent pas le C4 Model.",
        "Parce qu'ils sont toujours gratuits contrairement aux outils graphiques."
      ],
      "answer": "Les diagrammes textuels sont versionnables en Git (diff lisible), modifiables sans outil graphique, intégrables dans la documentation, et évoluent avec le code.",
      "explanation": "Problème des outils graphiques : le fichier .drawio ou .vsdx est binaire → diff Git illisible → merge conflicts impossibles à résoudre → les diagrammes deviennent vite outdated. Diagramme as-code : le source est du texte → diff Git lisible → reviewable en PR → intégrable dans README/docs → peut être généré depuis le code (ex: diagramme de classes depuis le code source). Règle pratique : Mermaid pour les diagrammes simples dans les docs, draw.io pour les diagrammes complexes ponctuels."
    },
    {
      "question": "[Phase 5] Quand doit-on créer un nouvel ADR ?",
      "options": [
        "Pour chaque commit dans le repository.",
        "Pour chaque décision architecturale significative et irréversible : choix de base de données, d'architecture, de framework majeur, de pattern de sécurité — pas pour les décisions facilement réversibles.",
        "Une fois par sprint, pour documenter les décisions de la semaine.",
        "Uniquement lors des changements de version majeure."
      ],
      "answer": "Pour chaque décision architecturale significative et irréversible : choix de base de données, d'architecture, de framework majeur, de pattern de sécurité — pas pour les décisions facilement réversibles.",
      "explanation": "Décisions qui méritent un ADR : choisir PostgreSQL vs MongoDB, adopter une architecture event-driven, utiliser JWT vs sessions, adopter Kafka. Décisions qui n'en méritent pas : quel nom donner à une variable, quelle bibliothèque de date utiliser (facilement remplaçable). Critère : si dans 6 mois un nouveau dev se demande 'pourquoi on a fait ça ?', c'est un ADR. Le statut évolue : Proposé → Accepté → Déprécié (quand la décision est révisée). Les ADRs dépréciés restent — ils montrent l'évolution de la pensée architecturale."
    }
  ],
  avance: [
    {
      "question": "[CQRS] Qu'est-ce que CQRS et quel problème résout-il ?",
      "options": [
        "Command Queue Retry System — un pattern de gestion des erreurs.",
        "Command Query Responsibility Segregation — séparer les opérations d'écriture (Commands) des opérations de lecture (Queries) avec des modèles et potentiellement des bases de données différentes.",
        "Un pattern de cache pour les requêtes fréquentes.",
        "CQRS est un framework de test pour les architectures distribuées."
      ],
      "answer": "Command Query Responsibility Segregation — séparer les opérations d'écriture (Commands) des opérations de lecture (Queries) avec des modèles et potentiellement des bases de données différentes.",
      "explanation": "Problème : un modèle unique pour la lecture et l'écriture crée des compromis. Les lectures sont souvent 80% du trafic mais ont des besoins différents (agrégats dénormalisés) des écritures (validations, transactions). CQRS : Commands → modèle d'écriture optimisé (normalisé, transactionnel). Queries → modèle de lecture optimisé (dénormalisé, Redis, Elasticsearch). Avantages : scalabilité indépendante, optimisation spécifique. Inconvénients : complexité accrue, cohérence éventuelle entre les modèles. Souvent combiné avec Event Sourcing. En finance : le modèle de risque en lecture peut être très différent du modèle de trade en écriture."
    },
    {
      "question": "[Clean Architecture] Quelle est la règle de dépendance en Clean Architecture ?",
      "options": [
        "Les dépendances pointent de l'extérieur vers l'intérieur — le domaine central ne connaît pas les frameworks, bases de données ou interfaces externes.",
        "Les couches externes dépendent des couches internes et vice versa.",
        "La règle de dépendance interdit l'utilisation de frameworks dans le domaine.",
        "Les dépendances sont circulaires pour faciliter la communication."
      ],
      "answer": "Les dépendances pointent de l'extérieur vers l'intérieur — le domaine central ne connaît pas les frameworks, bases de données ou interfaces externes.",
      "explanation": "Cercles concentriques : Entities (règles métier pures) → Use Cases (orchestration) → Interface Adapters (controllers, presenters, gateways) → Frameworks & Drivers (DB, web, UI). La règle : le code d'une couche interne ne peut pas dépendre d'une couche externe. La DB est un détail — le domaine ne sait pas si c'est PostgreSQL ou MongoDB. Avantage : le domaine est testable sans infrastructure. Changer de base de données = changer uniquement la couche externe. En Data Engineering : les pipelines de calcul ne connaissent pas S3 ou GCS — ils utilisent une interface Storage."
    },
    {
      "question": "[Architecture Hexagonale] Qu'est-ce que le pattern Ports & Adapters ?",
      "options": [
        "Un pattern réseau pour les connexions entre microservices.",
        "Le domaine expose des Ports (interfaces abstraites). Les Adapters implémentent ces ports pour chaque technologie concrète (DB, API, UI) — le domaine est isolé de toute technologie.",
        "Les ports sont les endpoints HTTP et les adapters les contrôleurs REST.",
        "Ports & Adapters est un ancien nom pour MVC."
      ],
      "answer": "Le domaine expose des Ports (interfaces abstraites). Les Adapters implémentent ces ports pour chaque technologie concrète (DB, API, UI) — le domaine est isolé de toute technologie.",
      "explanation": "Port (interface) : TradeRepository avec des méthodes save(), findById(). Adapter entrant (driving) : contrôleur REST qui appelle le domaine. Adapter sortant (driven) : PostgresTradeRepository qui implémente TradeRepository. En test : FakeTradeRepository remplace PostgresTradeRepository → tests unitaires du domaine sans DB. Changer de base de données = écrire un nouvel Adapter, zero modification du domaine. Architecture Hexagonale = Clean Architecture = Ports & Adapters = la même idée avec des terminologies différentes."
    },
    {
      "question": "[Microservices] Quels sont les vrais coûts cachés des microservices ?",
      "options": [
        "Les microservices n'ont pas de coûts cachés — c'est toujours une meilleure architecture.",
        "Complexité réseau (latence, timeouts, retries), transactions distribuées (pas d'ACID natif), observabilité (tracing distribué), tests d'intégration complexes, overhead opérationnel (un service = une pipeline CI/CD).",
        "Le seul coût est le prix des serveurs supplémentaires.",
        "Les microservices sont plus difficiles à sécuriser que les monolithes."
      ],
      "answer": "Complexité réseau (latence, timeouts, retries), transactions distribuées (pas d'ACID natif), observabilité (tracing distribué), tests d'intégration complexes, overhead opérationnel (un service = une pipeline CI/CD).",
      "explanation": "Coûts réels : 1) Réseau : chaque appel synchrone entre services peut échouer → circuit breakers, retry, timeout. 2) Transactions : saga pattern au lieu des transactions ACID. 3) Observabilité : un appel utilisateur → 10 services → tracing distribué (Jaeger, Zipkin) obligatoire. 4) Tests : tester l'intégration de 10 services est complexe (consumer-driven contract tests). 5) Ops : chaque service = sa propre CI/CD, ses logs, ses métriques, son infra. Sam Newman : commencer par un monolithe modulaire et extraire des services quand les besoins réels apparaissent."
    },
    {
      "question": "[Serverless] Qu'est-ce que le cold start en architecture serverless et comment le mitiger ?",
      "options": [
        "Le cold start est le temps de démarrage du serveur physique.",
        "Délai lors de la première invocation (ou après inactivité) d'une fonction — le runtime doit être initialisé. Mitigation : provisioned concurrency, fonctions légères, éviter les langages JVM à froid.",
        "Le cold start est un problème de sécurité spécifique au serverless.",
        "Cold start signifie que la fonction démarre sans données en cache."
      ],
      "answer": "Délai lors de la première invocation (ou après inactivité) d'une fonction — le runtime doit être initialisé. Mitigation : provisioned concurrency, fonctions légères, éviter les langages JVM à froid.",
      "explanation": "Cold start : AWS Lambda Node.js ~100ms, Python ~100ms, Java ~1-3s (JVM). Problématique pour les APIs latency-sensitive. Mitigations : 1) Provisioned concurrency (garder des instances chaudes, coût +). 2) Fonctions légères (moins de dépendances = démarrage plus rapide). 3) Langages à démarrage rapide (Node, Python, Go) vs Java. 4) Keep-alive : déclencher la fonction périodiquement (hack). 5) SnapStart (AWS Lambda pour Java) : snapshots de l'état initialisé. En trading : serverless inadapté pour les calculs time-sensitive. Adapté pour les traitements batch asynchrones."
    },
    {
      "question": "[Kubernetes] Dans quel cas Kubernetes est-il de l'over-engineering ?",
      "options": [
        "Kubernetes est toujours justifié dès qu'on utilise des conteneurs.",
        "Quand l'équipe est petite (<10 devs), le trafic modeste, et qu'il n'y a pas de besoin réel de scalabilité automatique ou de haute disponibilité — la complexité opérationnelle dépasse les bénéfices.",
        "Kubernetes est over-engineering uniquement pour les applications monolithiques.",
        "Kubernetes est over-engineering quand on utilise AWS."
      ],
      "answer": "Quand l'équipe est petite (<10 devs), le trafic modeste, et qu'il n'y a pas de besoin réel de scalabilité automatique ou de haute disponibilité — la complexité opérationnelle dépasse les bénéfices.",
      "explanation": "Kubernetes demande : des ingénieurs DevOps/SRE dédiés, une courbe d'apprentissage de 3-6 mois, une gestion de la complexité réseau (ingress, service mesh), des outils supplémentaires (Helm, ArgoCD). Alternatives plus simples selon le contexte : Docker Compose (dev/staging), AWS ECS Fargate (managé), Railway/Render/Fly.io (PaaS simples), AWS Lambda (serverless). Kubernetes justifié : 100+ services, besoins de scalabilité automatique fine, équipe DevOps dédiée, haute disponibilité critique. Question à poser : 'Avons-nous réellement les besoins qui justifient K8s ?'"
    },
    {
      "question": "[Théorème CAP] Qu'est-ce que le théorème CAP et son impact sur les choix architecturaux ?",
      "options": [
        "CAP = Consistance, Availability, Performance — les trois propriétés d'un bon système.",
        "Un système distribué ne peut garantir que 2 des 3 propriétés : Consistency (toutes les lectures voient la dernière écriture), Availability (chaque requête reçoit une réponse), Partition tolerance (le système fonctionne malgré les coupures réseau).",
        "CAP Theory est un framework de développement agile.",
        "CAP signifie que les systèmes distribués sont toujours moins fiables que les systèmes centralisés."
      ],
      "answer": "Un système distribué ne peut garantir que 2 des 3 propriétés : Consistency (toutes les lectures voient la dernière écriture), Availability (chaque requête reçoit une réponse), Partition tolerance (le système fonctionne malgré les coupures réseau).",
      "explanation": "En pratique : Partition tolerance est non-négociable dans un système distribué (le réseau peut échouer). Donc le vrai choix est CP vs AP. CP (Consistency + Partition) : sacrifice l'availability en cas de partition. Exemple : HBase, Zookeeper, etcd. AP (Availability + Partition) : sacrifice la consistency (cohérence éventuelle). Exemple : Cassandra, DynamoDB, CouchDB. PostgreSQL/MySQL classique : CA (pas distribué). En finance : les systèmes de trading préfèrent CP (la cohérence du prix est critique). Les systèmes de market data peuvent être AP (une légère incohérence momentanée est acceptable)."
    },
    {
      "question": "[Event Sourcing] Quelle est la différence entre Event Sourcing et une approche CRUD classique ?",
      "options": [
        "Event Sourcing est identique au CRUD mais plus rapide.",
        "CRUD : on stocke l'état actuel (UPDATE écrase). Event Sourcing : on stocke tous les événements qui ont conduit à cet état — l'état est recalculé en rejouant les événements.",
        "Event Sourcing ne supporte pas les opérations de lecture.",
        "CRUD est pour les petites applications, Event Sourcing pour les grandes."
      ],
      "answer": "CRUD : on stocke l'état actuel (UPDATE écrase). Event Sourcing : on stocke tous les événements qui ont conduit à cet état — l'état est recalculé en rejouant les événements.",
      "explanation": "CRUD : `UPDATE positions SET qty = 100 WHERE id = 1` — l'historique est perdu. Event Sourcing : stocker TradeExecuted(+50), TradeExecuted(-30), DividendReceived → l'état actuel qty=120 est calculé en rejouant. Avantages : audit trail complet (réglementaire en finance), possibilité de recalculer l'état à n'importe quel point dans le temps, event replay pour les migrations. Inconvénients : complexité accrue, requêtes de lecture complexes (→ CQRS pour les vues dénormalisées), volume de stockage. En finance : idéal pour les positions, les ordres, les transactions — audit réglementaire natif."
    },
    {
      "question": "[GitOps] Qu'est-ce que le pattern GitOps ?",
      "options": [
        "Utiliser Git pour stocker le code source uniquement.",
        "Git comme source de vérité pour toute la configuration infrastructure et applicative — les déploiements sont déclenchés automatiquement par des commits/merges dans des branches spécifiques.",
        "GitOps est un outil concurrent à GitHub Actions.",
        "GitOps signifie que les ops utilisent Git pour gérer les tickets."
      ],
      "answer": "Git comme source de vérité pour toute la configuration infrastructure et applicative — les déploiements sont déclenchés automatiquement par des commits/merges dans des branches spécifiques.",
      "explanation": "GitOps : l'état désiré de l'infrastructure et des applications est décrit en Git. Un opérateur (ArgoCD, Flux) surveille le repo et applique automatiquement les changements. Merge dans main → déploiement automatique. Avantages : audit trail complet (qui a déployé quoi quand), rollback = revert Git, drift detection (état réel vs état désiré), revue des changements infra via PR. Outils : ArgoCD (Kubernetes GitOps), Flux, AWS CodePipeline. Différence avec CI/CD classique : GitOps est pull-based (l'opérateur tire les changements) vs push-based (la CI pousse les changements)."
    },
    {
      "question": "[Modélisation] À quel niveau du C4 Model s'adresse-t-on pour expliquer l'architecture à un CTO non-technique ?",
      "options": [
        "Niveau 4 (Code) — pour montrer la qualité du code.",
        "Niveau 1 (Contexte) — montre le système dans son environnement avec ses acteurs externes et les systèmes avec lesquels il interagit. Aucun détail technique.",
        "Niveau 3 (Composants) — pour la vue d'ensemble.",
        "Niveau 2 (Conteneurs) — pour les bases de données et APIs."
      ],
      "answer": "Niveau 1 (Contexte) — montre le système dans son environnement avec ses acteurs externes et les systèmes avec lesquels il interagit. Aucun détail technique.",
      "explanation": "C4 L1 Contexte : 'Voici notre système de gestion des trades. Il reçoit des ordres des traders (via l'interface web), se connecte au système de marché (Bloomberg), et envoie les confirmations au système comptable.' Aucun choix technologique visible. Compréhensible par n'importe qui. C4 L2 (Conteneurs) : pour les architectes et tech leads. C4 L3 (Composants) : pour les développeurs. C4 L4 (Code) : rarement nécessaire, souvent généré depuis les outils. La force du C4 : chaque niveau est auto-suffisant — pas besoin de voir le L4 pour comprendre le L1."
    },
    {
      "question": "[Architecture] Quelle est la différence entre un monolithe modulaire et des microservices ?",
      "options": [
        "Un monolithe modulaire est juste un microservice très gros.",
        "Monolithe modulaire : un seul déployable avec des modules bien séparés (frontières claires, dépendances contrôlées). Microservices : services séparés déployés indépendamment. Le monolithe modulaire donne 80% des bénéfices pour 20% de la complexité.",
        "Un monolithe modulaire utilise toujours une seule base de données.",
        "Les microservices sont une version distribuée du monolithe modulaire."
      ],
      "answer": "Monolithe modulaire : un seul déployable avec des modules bien séparés (frontières claires, dépendances contrôlées). Microservices : services séparés déployés indépendamment. Le monolithe modulaire donne 80% des bénéfices pour 20% de la complexité.",
      "explanation": "Monolithe modulaire : les modules communiquent via des interfaces bien définies (pas d'import direct entre modules internes), les frontières sont enforced par les outils de build. Un seul déploiement, transactions ACID natives. Migration future vers microservices facilitée car les frontières sont déjà claires. Microservices : déploiement indépendant (réel avantage), isolation des pannes (réel avantage), mais tout le coût opérationnel. Sam Newman recommande : commencer par un monolithe modulaire, extraire un service quand un besoin réel de déploiement indépendant ou de scalabilité différenciée apparaît."
    },
    {
      "question": "[CI/CD] Quelle est la différence entre Continuous Integration, Continuous Delivery et Continuous Deployment ?",
      "options": [
        "Ce sont trois termes pour la même chose.",
        "CI : intégrer et tester automatiquement à chaque commit. CD (Delivery) : artefact toujours prêt à déployer, déploiement manuel en prod. CD (Deployment) : déploiement automatique en prod à chaque commit validé.",
        "CI est pour le code, CD est pour l'infrastructure.",
        "Continuous Deployment est uniquement pour les applications cloud-native."
      ],
      "answer": "CI : intégrer et tester automatiquement à chaque commit. CD (Delivery) : artefact toujours prêt à déployer, déploiement manuel en prod. CD (Deployment) : déploiement automatique en prod à chaque commit validé.",
      "explanation": "CI : lint → tests → build → rapport. Détecte les régressions rapidement. Continuous Delivery : la pipeline va jusqu'à un environnement de staging, l'équipe peut déployer en prod en un clic mais ne le fait pas automatiquement. Continuous Deployment : chaque commit qui passe les tests est automatiquement déployé en prod. Nécessite une très haute confiance dans les tests automatisés et un feature flag system pour les fonctionnalités incomplètes. En finance : Continuous Delivery est souvent le maximum acceptable (validation humaine avant prod imposée par les réglementations)."
    },
    {
      "question": "[Décision] Comment évaluer si une technologie est 'mature' pour un projet de production ?",
      "options": [
        "Si elle a plus de 1000 étoiles sur GitHub.",
        "Critères : âge et stabilité de l'API, taille et activité de la communauté, adoption en entreprise, disponibilité de talent sur le marché, support commercial disponible, track record en production.",
        "Si elle est utilisée par une startup connue.",
        "La maturité est uniquement liée au numéro de version (1.0+ = mature)."
      ],
      "answer": "Critères : âge et stabilité de l'API, taille et activité de la communauté, adoption en entreprise, disponibilité de talent sur le marché, support commercial disponible, track record en production.",
      "explanation": "Critères concrets : 1) API stable (pas de breaking changes fréquents). 2) Issues GitHub actives (bugs résolus rapidement). 3) Utilisé en production par des entreprises reconnues (case studies). 4) CVEs et sécurité (réponse rapide aux vulnérabilités). 5) Talent disponible (peut-on recruter des experts ?). 6) Support long terme annoncé. 7) Mises à jour régulières (ni abandonnée ni en flux constant de breaking changes). Technology Radar de ThoughtWorks : bon indicateur du niveau de maturité perçu par l'industrie."
    },
    {
      "question": "[Phase 1] Pourquoi l'horizon de maintenance impacte-t-il le choix d'architecture ?",
      "options": [
        "L'horizon de maintenance n'a aucun impact sur l'architecture.",
        "MVP 3 mois : la simplicité prime, dette technique acceptable. Système 10 ans : la maintenabilité, l'évolutivité et la documentation sont critiques — une architecture plus robuste justifie l'investissement initial.",
        "Un horizon long nécessite toujours des microservices.",
        "L'horizon de maintenance impacte uniquement le choix de la base de données."
      ],
      "answer": "MVP 3 mois : la simplicité prime, dette technique acceptable. Système 10 ans : la maintenabilité, l'évolutivité et la documentation sont critiques — une architecture plus robuste justifie l'investissement initial.",
      "explanation": "MVP court terme : une architecture simple (monolithe, framework standard) livrée rapidement vaut plus qu'une architecture parfaite livrée trop tard. La dette technique est acceptable si elle est consciente et planifiée. Système long terme : les économies initiales (pas de tests, architecture spaghetti) se paient avec intérêts. La Clean Architecture, les ADRs, les tests automatisés deviennent rentables sur 10 ans. En pratique : anticiper l'évolution probable (une startup peut devenir un système critique en 2 ans). Architecturer pour l'état suivant probable, pas pour l'état final idéal."
    },
    {
      "question": "[Performance] Qu'est-ce que le 'strangler fig pattern' et quand l'utiliser ?",
      "options": [
        "Un pattern de sécurité pour isoler les services vulnérables.",
        "Migrer progressivement un système legacy en remplaçant fonctionnalité par fonctionnalité — le nouveau système 'étrangle' l'ancien jusqu'à le remplacer complètement, sans big bang rewrite.",
        "Un pattern de cache pour les systèmes haute performance.",
        "Strangler Fig est un outil de migration de bases de données."
      ],
      "answer": "Migrer progressivement un système legacy en remplaçant fonctionnalité par fonctionnalité — le nouveau système 'étrangle' l'ancien jusqu'à le remplacer complètement, sans big bang rewrite.",
      "explanation": "Façade / proxy devant le système existant. Les nouvelles fonctionnalités sont développées dans le nouveau système. Progressivement, les anciennes fonctionnalités sont migrées. Le proxy route vers l'ancien ou le nouveau système. À terme, l'ancien système est éteint. Avantages vs Big Bang Rewrite : risque réduit (les deux systèmes coexistent), valeur livrée en continu, rollback possible. Joel Spolsky : 'Never rewrite from scratch' — les rewrites complets échouent souvent. En pratique : migrer d'un monolithe vers des microservices via Strangler Fig est la stratégie recommandée."
    },
    {
      "question": "[ADR] Que contient la section 'Conséquences' d'un ADR ?",
      "options": [
        "Les conséquences pénales en cas de non-respect de la décision.",
        "Les impacts positifs ET négatifs de la décision — trade-offs acceptés, risques identifiés, actions de mitigation, impact sur l'équipe et les systèmes adjacents.",
        "La liste des personnes responsables de la décision.",
        "Les conséquences techniques uniquement, pas organisationnelles."
      ],
      "answer": "Les impacts positifs ET négatifs de la décision — trade-offs acceptés, risques identifiés, actions de mitigation, impact sur l'équipe et les systèmes adjacents.",
      "explanation": "Section Conséquences d'un ADR : +Avantages : ACID natif, équipe familière, écosystème riche. -Inconvénients : scalabilité horizontale limitée, licence commerciale. Risques : vendor lock-in si on dépasse les 10k transactions/sec. Mitigation : architecture avec couche d'abstraction permettant de changer de DB. Impact : nécessite une formation de 2 jours pour l'équipe. Cette section est la plus importante — elle force l'équipe à être honnête sur les trade-offs et montre que la décision a été mûrement réfléchie, pas prise par défaut."
    },
    {
      "question": "[Phase 2] Qu'est-ce que la cohérence éventuelle (eventual consistency) et quand l'accepter ?",
      "options": [
        "La cohérence éventuelle signifie que les données sont toujours correctes.",
        "L'état du système sera cohérent à terme, mais pas immédiatement après une écriture — acceptable pour les données non-critiques (catalogue, profil utilisateur) mais inacceptable pour les transactions financières.",
        "La cohérence éventuelle est uniquement un problème de performance.",
        "Eventual consistency est un problème résolu par Kubernetes."
      ],
      "answer": "L'état du système sera cohérent à terme, mais pas immédiatement après une écriture — acceptable pour les données non-critiques (catalogue, profil utilisateur) mais inacceptable pour les transactions financières.",
      "explanation": "Dans un système distribué (microservices, bases répliquées) : après une écriture, différentes instances peuvent retourner des valeurs différentes pendant quelques millisecondes à secondes. Acceptable : un utilisateur voit son profil mis à jour avec 1 seconde de délai — pas grave. Inacceptable : après un virement bancaire, le solde doit immédiatement refléter la transaction. En finance : les positions doivent être cohérentes immédiatement (CP). Le cours d'une action peut être légèrement en retard (AP). La cohérence éventuelle est une conséquence de l'architecture distribuée, pas un choix arbitraire — il faut en être conscient."
    },
    {
      "question": "[Phase 4] Qu'est-ce que le 'feature flag' et quel est son rôle dans le CI/CD ?",
      "options": [
        "Un indicateur dans les logs qui signale une fonctionnalité en cours de développement.",
        "Un mécanisme permettant d'activer/désactiver une fonctionnalité en production sans déploiement — permet le Continuous Deployment en séparant le déploiement du code de l'activation de la feature.",
        "Un flag Git pour marquer les commits liés à une feature.",
        "Feature flag est un pattern uniquement pour les applications mobiles."
      ],
      "answer": "Un mécanisme permettant d'activer/désactiver une fonctionnalité en production sans déploiement — permet le Continuous Deployment en séparant le déploiement du code de l'activation de la feature.",
      "explanation": "Feature flags (feature toggles) : `if (featureFlags.newPricingEngine) { ... } else { ... }`. Le code est déployé mais désactivé. Activation progressive : 1% des utilisateurs → 10% → 100% (canary release). A/B testing. Rollback immédiat si problème (désactiver le flag, pas de rollback de déploiement). Outils : LaunchDarkly, Flagsmith (open source), AWS AppConfig. En finance : déployer le nouveau moteur de pricing en production mais ne l'activer que pour les tests internes avant le go-live. Évite les gros bang deployments en fin de sprint."
    },
    {
      "question": "[DDD] Qu'est-ce que le Domain-Driven Design et pourquoi l'aligner avec l'architecture ?",
      "options": [
        "DDD est un framework de développement frontend.",
        "DDD : modéliser le logiciel autour du domaine métier. Les Bounded Contexts sont des candidats naturels aux frontières de microservices.",
        "DDD impose une architecture microservices.",
        "DDD est uniquement utile pour les bases de données."
      ],
      "answer": "DDD : modéliser le logiciel autour du domaine métier. Les Bounded Contexts sont des candidats naturels aux frontières de microservices.",
      "explanation": "DDD concepts : Ubiquitous Language (même vocabulaire devs + métier), Bounded Context (frontière d'un modèle de domaine), Aggregate, Domain Events. Bounded Context → microservice candidat : si 'Trading' et 'Risk' ont des modèles différents d'un Trade, ce sont deux Bounded Contexts. Event Storming : atelier pour identifier les événements métier et les Bounded Contexts. En finance : DDD est particulièrement adapté car le domaine métier est complexe et très spécifique."
    },
    {
      "question": "[Phase 3] Comment le C4 Model s'intègre-t-il dans un workflow Git avec Mermaid ?",
      "options": [
        "Les diagrammes C4 doivent être dans un outil externe séparé du code.",
        "Les diagrammes Mermaid dans les fichiers Markdown (ARCHITECTURE.md, ADRs) sont versionnés avec le code — les PR incluent les mises à jour de diagrammes, reviewables dans le diff Git.",
        "C4 Model ne supporte pas Mermaid — uniquement draw.io.",
        "Les diagrammes C4 sont générés automatiquement depuis le code sans intervention."
      ],
      "answer": "Les diagrammes Mermaid dans les fichiers Markdown (ARCHITECTURE.md, ADRs) sont versionnés avec le code — les PR incluent les mises à jour de diagrammes, reviewables dans le diff Git.",
      "explanation": "Workflow : /docs/architecture/CONTEXT.md avec le diagramme C4 L1 en Mermaid. /docs/adr/ADR-001-postgres.md avec le diagramme L2 pertinent. Quand l'architecture change → PR qui modifie le code ET les diagrammes → review visible dans le diff → merge. Avantage : les diagrammes ne sont jamais en retard sur le code (ils évoluent dans la même PR). Rendu GitHub : les blocs ```mermaid sont automatiquement affichés. Intégration dans les wikis Confluence/Notion qui supportent Mermaid. Alternative structurée : Structurizr (outil C4 officiel) avec DSL textuel versionnable."
    }
  ]
};

const Flashcard = ({ slide }) => (
  <div className="flashcard">
    <h3 className="question">{slide.question}</h3>
    <p className="answer" style={{ whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: "1.5" }}
      dangerouslySetInnerHTML={{ __html: slide.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>") }}
    />
  </div>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <div className="timer">⏱ {timeLeft}s</div>
    <h3 className="question" style={{ fontSize: "12px" }}>{question}</h3>
    <div className="options">
      {options.map((opt, i) => (
        <button key={i} className="option-btn" onClick={() => onAnswerClick(opt)}
          style={{ fontSize: "11px", textAlign: "left", padding: "6px 10px", marginBottom: "4px", width: "100%" }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Results = ({ scores }) => (
  <div className="results">
    <h2>🎯 Résultats</h2>
    <p>Niveau Moyen : {scores.moyen} / {questions.moyen.length}</p>
    <p>Niveau Avancé : {scores.avance} / {questions.avance.length}</p>
    <p>Total : {scores.moyen + scores.avance} / {questions.moyen.length + questions.avance.length}</p>
  </div>
);

const Page12_Architecture = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(25);
      setMessage("");
    } else {
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else {
        handleNextQuestion();
      }
    }
  }, [timeLeft, level, showResult]);

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
      }, 12000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
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
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            Architecture & Stack 🔹{" "}
            {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
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
          {message && (
            <p className="message" style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page12_Architecture;
