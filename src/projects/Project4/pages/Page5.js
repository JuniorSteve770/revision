// src/projects/Project3/pages/Page5.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Vue d'ensemble — L'écosystème technique d'une salle de marché",
    "answer": "**Systèmes métier** : OMS (ordres), EMS (exécution), PMS (portefeuille), RMS (risque), TMS (trésorerie). ◆ **Couches techniques** : Market Data (prix temps réel), Bases de données (SQL, kdb+, Redis), Messaging (Kafka, RabbitMQ), Protocoles (FIX, gRPC, REST). ◆ **Architectures** : Monolithe modulaire, Microservices, Hexagonale, Event-Driven. ◆ **Langages** : C# (moteur transactionnel, latence faible), Python (quant, ML, visualisation), Angular/React (frontend trading)."
  },
  {
    "question": "OMS / EMS / TMS / PMS / RMS — Qui fait quoi ?",
    "answer": "**OMS** (Order Management System) : cycle de vie des ordres — saisie, validation, routage, exécution via FIX. Source of truth pour les ordres. ◆ **EMS** (Execution Management System) : Smart Order Routing, algos d'exécution (TWAP, VWAP, Iceberg), connexion directe aux venues (LSE, Euronext, dark pools). ◆ **PMS** (Portfolio Management System) : NAV, allocation, exposition par asset class, rebalancing. ◆ **RMS** (Risk Management System) : VaR, Greeks temps réel, stress test, limites de risque. ◆ **TMS** (Trade Management System) : trésorerie, collatéral, financement post-trade."
  },
  {
    "question": "PMS — Portfolio Management System",
    "answer": "**Rôle** : gérer les positions agrégées, calculer la NAV (Net Asset Value), suivre l'exposition par asset class (actions, taux, crédit, FX). ◆ **Composants clés** : moteur de valorisation (pricing engine), référentiel instruments, flux de dividendes/coupons, module de rebalancing. ◆ **Connexions** : reçoit les exécutions de l'OMS, alimente le RMS en positions, pousse les valorisations vers le reporting. ◆ **Stack typique** : C# backend + SQL Server (positions) + Redis (cache NAV intraday) + Python (analytics, attribution de performance) + Excel/SFTP (reporting gérant)."
  },
  {
    "question": "RMS — Risk Management System",
    "answer": "**Rôle** : mesurer et contrôler le risque en temps réel — VaR historique/Monte Carlo, Greeks (Delta, Gamma, Vega, Theta), stress test sur scénarios macro. ◆ **Particularité** : seul système autorisé à bloquer un ordre si la limite de risque est dépassée — position centrale dans le flow. ◆ **Connexions** : consomme les positions du PMS, les prix du Market Data feed, produit des alertes vers l'OMS et le front desk. ◆ **Stack typique** : C# (moteur temps réel, faible latence) + Python (modèles statistiques, Monte Carlo) + kdb+ (stockage tick data) + Kafka (alertes asynchrones)."
  },
  {
    "question": "EMS — Execution Management System",
    "answer": "**Rôle** : recevoir les ordres de l'OMS et les exécuter intelligemment sur les marchés — minimiser le market impact. ◆ **Algos d'exécution** : TWAP (Time Weighted Average Price), VWAP (Volume Weighted Average Price), Iceberg (ordre fractionné), POV (Participation Of Volume). ◆ **Smart Order Routing** : choisit automatiquement la meilleure venue (prix, liquidité, frais) parmi LSE, Euronext, CBOE, dark pools. ◆ **Protocole** : FIX 4.2/4.4 vers les brokers/venues. ◆ **Stack typique** : C# haute performance + FIX Engine (QuickFIX/n) + Redis (cache order book) + UDP multicast (diffusion prix interne)."
  },
  {
    "question": "Market Data — Bloomberg, Refinitiv, NBBO",
    "answer": "**Bloomberg BLPAPI** : API C#/Python pour prix, courbes de taux, données fondamentales. ◆ **Refinitiv (LSEG)** : flux temps réel via RFA (Reuters Foundation API) ou Elektron. Concurrent direct Bloomberg. ◆ **NBBO** (National Best Bid and Offer) : meilleur prix bid/ask consolidé sur toutes les venues US — référence d'exécution MiFID II. ◆ **Temps réel vs End-of-Day** : temps réel (latence < 100ms) pour trading et risk, EOD pour PMS, comptabilité, reporting. ◆ **Normalisation** : le Market Data Handler uniformise les formats hétérogènes → flux interne standardisé consommé par OMS, RMS, PMS."
  },
  {
    "question": "Bases de données en trading — Quel outil pour quoi ?",
    "answer": "**SQL Server / PostgreSQL** : référentiel instruments, trades exécutés, positions EOD. ACID garanti, requêtes relationnelles. ◆ **kdb+/q** : standard HFT et quant pour tick data. Colonne-oriented, requêtes vectorielles ultra-rapides sur milliards de ticks. ◆ **InfluxDB** : time-series open-source pour métriques système et prix. ◆ **Arctic (Man Group)** : surcouche MongoDB pour stocker des DataFrames Pandas (séries de prix, matrices de corrélation). ◆ **Redis** : cache in-memory, latence < 1ms. Utilisé pour NAV intraday, sessions, order book en mémoire, pub/sub léger."
  },
  {
    "question": "Event-Driven Architecture — pub/sub vs point-to-point",
    "answer": "**Point-to-point** (queue) : un message envoyé → lu par un seul consommateur. Ex : RabbitMQ queue. Utilisé pour ordres d'exécution où un seul service doit traiter. ◆ **Pub/Sub** (topic) : un message publié → diffusé à N abonnés. Ex : Kafka topic `market-data.prices`. Utilisé pour diffuser les prix à l'OMS, RMS, PMS simultanément. ◆ **Kafka vs RabbitMQ** : Kafka = log immuable rejouable (audit trail, reconstruction de positions). RabbitMQ = broker de messages avec routage complexe (fan-out, headers). ◆ **En salle de marché** : Kafka pour les événements de marché, RabbitMQ pour les workflows applicatifs internes."
  },
  {
    "question": "Latence & Performance — nanoseconde, microseconde, milliseconde",
    "answer": "**Nanoseconde (HFT)** : FPGA, kernel bypass (DPDK, RDMA), co-location dans le datacenter de la bourse. Langage : C++ ou FPGA firmware. ◆ **Microseconde (Low Latency)** : C# avec `unsafe` + `Span<T>`, zero-allocation, socket UDP, lock-free queues. Co-location recommandée. ◆ **Milliseconde (Standard)** : C# ou Java standard, TCP/FIX, REST acceptable. Desk actions, obligations, dérivés listés. ◆ **Co-location** : placer ses serveurs dans le datacenter de la bourse (ex : Equinix LD4 pour LSE) pour réduire la latence réseau à < 100µs. ◆ **Règle** : chaque millisecondes de latence = perte d'edge concurrentiel en market making."
  },
  {
    "question": "Architectures — Monolithe, Microservices, Hexagonale",
    "answer": "**Monolithe Modulaire** : OMS + RMS + PMS dans le même processus. ✅ Latence in-process nulle, ACID simple, déploiement unique. ⚠️ Scaling global obligatoire, un bug impacte tout. ◆ **Microservices** : OMS, RMS, PMS = services indépendants. ✅ Déploiement indépendant, scaling ciblé, résilience isolée. ⚠️ Complexité réseau, transactions distribuées (pattern Saga). ◆ **Architecture Hexagonale** : domaine métier au centre, adapters en périphérie (FIX adapter, DB adapter, API adapter). ✅ Domaine testable sans infrastructure, swap d'adapter sans toucher au métier. Idéale pour un OMS."
  },
  {
    "question": "Protocoles — FIX, gRPC, REST, WebSocket",
    "answer": "**FIX** : standard mondial ordres bourse (TCP). Heartbeats, replay, séquences. 4.2/4.4 pour equities, 5.0 pour dérivés. ◆ **gRPC** : binaire HTTP/2, contrat `.proto`. ✅ Streaming bidirectionnel, ultra-rapide pour Greeks ou ticks internes. ⚠️ Non lisible humainement, besoin d'outillage. ◆ **REST/JSON** : couplage lâche, standard APIs internes et externes. ✅ Simple, universel. ⚠️ Trop lent pour haute fréquence. ◆ **WebSocket** : canal full-duplex persistant vers le frontend. Idéal pour streamer les prix et P&L en temps réel vers Angular/React."
  },
  {
    "question": "Messaging — Kafka, RabbitMQ, MSMQ",
    "answer": "**Kafka** : log d'événements immuable et distribué. Messages persistés sur disque, rejouables à volonté. Topics partitionnés pour le scaling. ✅ Audit trail, reconstruction de positions, Event Sourcing. ⚠️ Complexité opérationnelle (ZooKeeper/KRaft). ◆ **RabbitMQ** : broker de messages avec routage avancé (direct, fan-out, topic, headers). Messages supprimés après ACK. ✅ Patterns complexes, fiabilité. ⚠️ Non rejouable nativement. ◆ **MSMQ** : legacy Windows, simple. ⚠️ Non distribué, non scalable, à remplacer."
  },
  {
    "question": "Formats de données — JSON, XML, Protobuf, FIX",
    "answer": "**JSON** : standard REST, lisible. ✅ Universel, tooling riche. ⚠️ Verbeux, lent à parser en haute fréquence. ◆ **XML** : réglementaire. *SWIFT ISO 20022* (paiements), *FpML* (dérivés OTC), *XBRL* (rapports BCE). ◆ **Protobuf** : binaire typé ~6x plus compact que JSON. ✅ Ultra-rapide, versionnable. Utilisé avec gRPC. ⚠️ Non lisible sans outillage. ◆ **FIX Tag=Value** : format texte `8=FIX4.2|35=D|49=CLIENT|56=BROKER|...`. Lisible, debuggable, mais verbeux. Standard universel ordres."
  },
  {
    "question": "Stacks combinées — C# + SQL + Python + Excel/SFTP",
    "answer": "**Cas d'usage** : reporting de gestion, PMS, comptabilité post-trade. ◆ **Stack** : C# backend (API REST) → SQL Server (EF Core, positions/trades) → Python (Pandas, calculs P&L, agrégation) → Excel via `openpyxl`/`xlsxwriter` → SFTP vers gérant ou régulateur. ◆ ✅ Simple, maîtrisé par les équipes, compatible systèmes legacy. ◆ ⚠️ Excel = fragilité (formules cassées, versions), SFTP = pas temps réel, SQL = goulot si volumes élevés. ◆ **Pattern** : Python joue le rôle d'ETL (Extract-Transform-Load) entre le SQL et le fichier de sortie."
  },
  {
    "question": "Stacks combinées — C# + Kafka + Python + Plotly + React",
    "answer": "**Cas d'usage** : dashboard de risk temps réel, monitoring P&L intraday. ◆ **Stack** : Market Data feed → Kafka topic `prices` → C# RMS (calcul VaR, Greeks) → Kafka topic `risk-alerts` → Python consommateur (agrégation, Pandas) → API FastAPI → React frontend (Plotly.js graphiques temps réel via WebSocket). ◆ ✅ Temps réel, découplé, chaque composant scalable indépendamment. ◆ ⚠️ Complexité opérationnelle Kafka, latence accumulée à chaque saut, debugging distribué difficile. ◆ **Pattern** : Event-Driven + CQRS — lecture séparée de l'écriture."
  },
  {
    "question": "Stacks combinées — Python quant + API intermédiaire + C# OMS",
    "answer": "**Cas d'usage** : signaux de trading algorithmique générés en Python, exécutés via l'OMS C#. ◆ **Stack** : Python (NumPy/Pandas/scipy, modèle alpha) → REST API ou gRPC → C# OMS (validation, gestion risque, FIX Engine) → venue d'exécution. ◆ **Variante avec DB** : Python écrit le signal dans PostgreSQL/Redis → C# OMS le consomme en polling ou via notification. ◆ ✅ Chaque langage dans son domaine d'excellence. Python = cerveau quant. C# = muscle transactionnel. ◆ ⚠️ Latence de la couche intermédiaire (API/DB) = inacceptable en HFT. Acceptable pour stratégies basse fréquence (daily, intraday > 100ms)."
  },
  {
    "question": "Stacks combinées — Architecture Hexagonale OMS",
    "answer": "**Principe** : le domaine OMS (règles métier : validation d'ordre, gestion du cycle de vie) est au centre — zéro dépendance vers l'infrastructure. ◆ **Adapters entrants** : FIX Adapter (ordres broker), REST Adapter (front desk Angular/React), gRPC Adapter (signaux Python). ◆ **Adapters sortants** : SQL Adapter (EF Core → SQL Server), Kafka Adapter (publication événements), FIX Adapter (envoi vers venues). ◆ ✅ Domaine testable sans FIX ni SQL (injection d'adapters mock). Swap de venue = nouveau FIX Adapter, zéro modification du domaine. ◆ **Lien SOLID** : DIP appliqué à l'échelle architecturale — le domaine dépend d'interfaces (`IOrderRepository`, `IExecutionVenue`), jamais des implémentations concrètes."
  }
];

const questions = {
  moyen: [
    {
      "question": "Quel système est responsable du Smart Order Routing et des algos d'exécution TWAP/VWAP ?",
      "options": [
        "OMS — Order Management System",
        "EMS — Execution Management System",
        "PMS — Portfolio Management System",
        "RMS — Risk Management System"
      ],
      "answer": "EMS — Execution Management System",
      "explanation": "L'EMS reçoit les ordres de l'OMS et les exécute intelligemment : il choisit la meilleure venue (Smart Order Routing) et applique les algos d'exécution (TWAP, VWAP, Iceberg) pour minimiser le market impact. L'OMS gère le cycle de vie, l'EMS optimise l'exécution."
    },
    {
      "question": "Quelle base de données est le standard de facto pour stocker des milliards de ticks en trading haute fréquence ?",
      "options": [
        "SQL Server — pour ses garanties ACID",
        "Redis — pour sa latence < 1ms",
        "kdb+/q — base colonne-oriented optimisée pour les séries temporelles financières",
        "MongoDB — pour sa flexibilité de schéma"
      ],
      "answer": "kdb+/q — base colonne-oriented optimisée pour les séries temporelles financières",
      "explanation": "kdb+ est le standard HFT et quant pour le stockage de tick data. Son langage q permet des requêtes vectorielles ultra-rapides sur des milliards d'enregistrements. SQL Server et Redis ont d'autres rôles : référentiel et cache respectivement."
    },
    {
      "question": "Quelle est la différence fondamentale entre un message Kafka et un message RabbitMQ ?",
      "options": [
        "Kafka est plus rapide, RabbitMQ est plus lent — c'est la seule différence.",
        "Kafka conserve les messages sur disque (rejouables), RabbitMQ supprime les messages après traitement.",
        "RabbitMQ supporte le format Protobuf, Kafka uniquement JSON.",
        "Kafka est réservé aux systèmes Windows, RabbitMQ est multiplateforme."
      ],
      "answer": "Kafka conserve les messages sur disque (rejouables), RabbitMQ supprime les messages après traitement.",
      "explanation": "C'est la différence architecturale clé : Kafka est un log d'événements immuable — on peut rejouer tous les trades d'une journée pour reconstruire les positions. RabbitMQ est un broker de messages transactionnels — le message disparaît après ACK du consommateur."
    },
    {
      "question": "Quel format de données utiliser pour un flux de 50 000 ticks/seconde entre deux services C# internes ?",
      "options": [
        "JSON — lisible et universel",
        "XML — standard réglementaire",
        "Protobuf via gRPC — binaire compact et ultra-rapide",
        "CSV — simple à parser"
      ],
      "answer": "Protobuf via gRPC — binaire compact et ultra-rapide",
      "explanation": "À 50 000 msg/sec, JSON est trop verbeux (parsing CPU-intensif). Protobuf est ~6x plus compact, typé, et se sérialise/désérialise 5-10x plus vite. gRPC supporte le streaming bidirectionnel sur HTTP/2. JSON et CSV sont adaptés aux APIs REST à faible débit."
    },
    {
      "question": "Quel système est responsable du calcul de la VaR et des Greeks en temps réel ?",
      "options": [
        "OMS — il valide les ordres avant exécution",
        "PMS — il calcule la NAV du portefeuille",
        "RMS — Risk Management System, seul autorisé à bloquer un ordre si limite dépassée",
        "TMS — il gère le collatéral et le financement"
      ],
      "answer": "RMS — Risk Management System, seul autorisé à bloquer un ordre si limite dépassée",
      "explanation": "Le RMS mesure le risque en temps réel : VaR, Greeks (Delta, Gamma, Vega), stress test. Il est le gardien des limites de risque — s'il détecte un dépassement, il peut bloquer l'ordre dans l'OMS avant exécution. C'est le système le plus critique pour la sécurité du desk."
    },
    {
      "question": "Dans quel cas utilise-t-on Redis plutôt que SQL Server dans une stack de trading ?",
      "options": [
        "Pour stocker les trades exécutés avec leurs détails complets.",
        "Pour le cache intraday (NAV, order book en mémoire) où la latence doit être < 1ms.",
        "Pour les rapports réglementaires MiFID II.",
        "Pour stocker les fichiers Excel générés par Python."
      ],
      "answer": "Pour le cache intraday (NAV, order book en mémoire) où la latence doit être < 1ms.",
      "explanation": "Redis est une base in-memory : lecture/écriture en < 1ms. Idéal pour la NAV intraday du PMS, l'order book en mémoire de l'EMS, les sessions utilisateur. SQL Server garantit la persistance ACID mais à 5-50ms — trop lent pour les hot paths du trading."
    },
    {
      "question": "Quel standard XML est utilisé pour décrire les paramètres des dérivés OTC (Swaps de taux, CDS) ?",
      "options": [
        "ISO 20022 — standard paiements SWIFT",
        "FpML (Financial products Markup Language)",
        "XBRL — rapports comptables régulateurs",
        "Protobuf — format binaire gRPC"
      ],
      "answer": "FpML (Financial products Markup Language)",
      "explanation": "FpML est le format XML mondial pour les dérivés OTC : IRS (Interest Rate Swap), CDS (Credit Default Swap), options exotiques. ISO 20022 couvre les paiements et titres. XBRL est pour les rapports financiers aux régulateurs (BCE, AMF)."
    },
    {
      "question": "Quelle est la stack typique pour un reporting de gestion hebdomadaire envoyé par SFTP ?",
      "options": [
        "kdb+ → Kafka → React frontend",
        "C# backend → SQL Server → Python (Pandas) → Excel → SFTP",
        "gRPC → Protobuf → Bloomberg BLPAPI",
        "Redis → WebSocket → Angular"
      ],
      "answer": "C# backend → SQL Server → Python (Pandas) → Excel → SFTP",
      "explanation": "Pour le reporting de gestion non temps réel : C# expose les données via API REST, SQL Server stocke les positions/trades, Python (Pandas + openpyxl) agrège et formate en Excel, SFTP livre le fichier au gérant ou au régulateur. Simple, robuste, maîtrisé par toutes les équipes."
    },
    {
      "question": "Qu'est-ce que le NBBO (National Best Bid and Offer) ?",
      "options": [
        "Un format de message FIX pour les ordres d'achat.",
        "Le meilleur prix bid/ask consolidé sur toutes les venues d'exécution.",
        "Un protocole de communication entre Bloomberg et l'OMS.",
        "Un algorithme d'exécution alternatif au VWAP."
      ],
      "answer": "Le meilleur prix bid/ask consolidé sur toutes les venues d'exécution.",
      "explanation": "Le NBBO consolide les meilleurs prix d'achat (bid) et de vente (ask) disponibles sur toutes les venues (NYSE, NASDAQ, CBOE…). C'est la référence de meilleure exécution MiFID II — l'EMS doit démontrer que l'exécution a respecté le NBBO."
    },
    {
      "question": "Quelle architecture permet de tester le domaine OMS sans FIX Engine ni base de données ?",
      "options": [
        "Architecture microservices — chaque service est indépendant.",
        "Architecture hexagonale — le domaine est au centre, les adapters (FIX, SQL) sont en périphérie.",
        "Architecture monolithique — tout est dans le même processus.",
        "Architecture event-driven — Kafka découple les composants."
      ],
      "answer": "Architecture hexagonale — le domaine est au centre, les adapters (FIX, SQL) sont en périphérie.",
      "explanation": "L'architecture hexagonale isole le domaine métier de l'infrastructure. FIX, SQL, Kafka sont des adapters interchangeables. En tests, on injecte des adapters mock — zéro besoin de FIX Engine ou de base de données. C'est DIP appliqué à l'échelle architecturale."
    },
    {
      "question": "Pourquoi préfère-t-on WebSocket à REST pour diffuser les prix en temps réel vers un frontend Angular/React ?",
      "options": [
        "REST ne supporte pas le format JSON.",
        "WebSocket est un canal full-duplex persistant — le serveur pousse les prix sans que le client redemande.",
        "Angular ne peut pas consommer des APIs REST.",
        "WebSocket est plus sécurisé que HTTPS."
      ],
      "answer": "WebSocket est un canal full-duplex persistant — le serveur pousse les prix sans que le client redemande.",
      "explanation": "REST = polling (le client demande → le serveur répond). Pour des prix qui changent 100x/seconde, le polling REST crée une latence et une charge inutile. WebSocket ouvre une connexion persistante : le serveur pousse chaque nouveau prix dès qu'il arrive — idéal pour les blotters de trading en temps réel."
    },
    {
      "question": "Dans quel ordre logique les systèmes traitent-ils un ordre passé par un portfolio manager ?",
      "options": [
        "EMS → OMS → RMS → venue d'exécution",
        "PMS (décision d'allocation) → OMS (validation, cycle de vie) → RMS (contrôle risque) → EMS (exécution optimisée) → venue",
        "RMS → PMS → EMS → OMS → venue",
        "OMS → EMS → PMS → RMS → venue"
      ],
      "answer": "PMS (décision d'allocation) → OMS (validation, cycle de vie) → RMS (contrôle risque) → EMS (exécution optimisée) → venue",
      "explanation": "Le flux standard : le PMS décide du rebalancing (ex : acheter 10 000 BNPP). L'OMS crée l'ordre et valide les données. Le RMS vérifie que la limite de risque n'est pas dépassée. L'EMS reçoit l'ordre validé et l'exécute intelligemment via FIX vers la venue. Chaque système a un rôle précis dans la chaîne."
    },
    {
      "question": "Quelle est la différence entre un topic Kafka et une queue RabbitMQ en termes de consommation ?",
      "options": [
        "Topic Kafka = un seul consommateur. Queue RabbitMQ = plusieurs consommateurs.",
        "Topic Kafka = N consommateurs indépendants reçoivent chacun le message. Queue RabbitMQ = un seul consommateur reçoit le message.",
        "Les deux sont identiques — seule la terminologie diffère.",
        "Kafka = synchrone. RabbitMQ = asynchrone."
      ],
      "answer": "Topic Kafka = N consommateurs indépendants reçoivent chacun le message. Queue RabbitMQ = un seul consommateur reçoit le message.",
      "explanation": "Kafka pub/sub : OMS, RMS et PMS peuvent tous consommer le topic `market-data.prices` — chacun reçoit tous les messages indépendamment. Queue RabbitMQ point-to-point : un seul worker prend l'ordre d'exécution — idéal pour éviter le double traitement."
    },
    {
      "question": "Pourquoi co-localiser ses serveurs dans le datacenter de la bourse (ex : Equinix LD4) ?",
      "options": [
        "Pour bénéficier de licences logicielles réduites.",
        "Pour réduire la latence réseau à < 100µs — chaque milliseconde perdue = perte d'edge en market making.",
        "Pour accéder à Bloomberg BLPAPI sans frais.",
        "Pour éviter les obligations réglementaires MiFID II."
      ],
      "answer": "Pour réduire la latence réseau à < 100µs — chaque milliseconde perdue = perte d'edge en market making.",
      "explanation": "La co-location place les serveurs à quelques mètres des moteurs de matching de la bourse. Latence réseau : < 100µs au lieu de 5-20ms depuis un datacenter distant. En market making, être 1ms plus lent que le concurrent signifie se faire exécuter à un prix défavorable systématiquement."
    },
    {
      "question": "[Croisement Système → DB] Quelle base de données est naturellement associée au PMS pour le cache de NAV intraday, et pourquoi ?",
      "options": [
        "kdb+ — pour ses requêtes vectorielles sur tick data.",
        "SQL Server — pour ses garanties ACID sur les positions.",
        "Redis — cache in-memory < 1ms, idéal pour des données lues très fréquemment et recalculées régulièrement.",
        "Arctic — pour stocker des DataFrames Pandas de séries de prix."
      ],
      "answer": "Redis — cache in-memory < 1ms, idéal pour des données lues très fréquemment et recalculées régulièrement.",
      "explanation": "La NAV intraday est recalculée à chaque tick de prix et consultée par de nombreux composants (frontend, RMS, reporting). Redis sert de cache entre le moteur de calcul C# et les consommateurs : chaque lecture = < 1ms. SQL Server persiste la NAV EOD. kdb+ stocke les ticks sources. Chaque DB joue son rôle dans la chaîne."
    },
    {
      "question": "[Croisement Architecture → Pattern OOP] L'architecture hexagonale applique quel principe SOLID à l'échelle du système ?",
      "options": [
        "SRP — chaque service a une seule responsabilité.",
        "OCP — le système est ouvert à l'extension.",
        "DIP — le domaine métier dépend d'abstractions (interfaces d'adapters), jamais des implémentations concrètes (FIX, SQL, Kafka).",
        "LSP — les adapters sont substituables."
      ],
      "answer": "DIP — le domaine métier dépend d'abstractions (interfaces d'adapters), jamais des implémentations concrètes (FIX, SQL, Kafka).",
      "explanation": "DIP à l'échelle système : le domaine OMS dépend de `IOrderRepository` et `IExecutionVenue` (abstractions). FIX Adapter, SQL Adapter, Kafka Adapter sont les implémentations concrètes branchées en périphérie. Changer de venue d'exécution = nouveau FIX Adapter, zéro modification du domaine. C'est exactement DIP, mais appliqué à l'architecture plutôt qu'à une classe."
    },
    {
      "question": "[Croisement Format → Contexte] Quel format est imposé par les régulateurs européens pour les rapports de dérivés OTC (EMIR) ?",
      "options": [
        "JSON — standard REST API",
        "Protobuf — format binaire gRPC",
        "XML ISO 20022 / FpML — formats réglementaires structurés",
        "CSV — simple et universel"
      ],
      "answer": "XML ISO 20022 / FpML — formats réglementaires structurés",
      "explanation": "EMIR (European Market Infrastructure Regulation) exige le reporting des dérivés OTC aux trade repositories (DTCC, REGIS-TR) en XML : FpML pour la description des instruments, ISO 20022 pour les messages de reporting. JSON et CSV ne sont pas acceptés par les régulateurs — la structure XML garantit la validation des schémas."
    }
  ],
  avance: [
    {
      "question": "Dans une architecture microservices de trading, quel pattern compense l'absence de transaction ACID distribuée entre l'OMS et le PMS ?",
      "options": [
        "Le pattern Repository — abstraction de l'accès aux données",
        "Le pattern Saga — transactions compensatoires locales successives",
        "Le pattern Singleton — instance unique partagée",
        "Le pattern Observer distribué via WebSocket"
      ],
      "answer": "Le pattern Saga — transactions compensatoires locales successives",
      "explanation": "Sans transaction ACID distribuée, la Saga coordonne des transactions locales : OMS crée l'ordre (T1), PMS met à jour la position (T2), RMS valide le risque (T3). Si T3 échoue, des compensations (T2-rollback, T1-cancel) rétablissent la cohérence. Deux variantes : Choreography (événements Kafka) et Orchestration (Mediator central)."
    },
    {
      "question": "[Croisement Architecture → SOLID] Pourquoi l'architecture hexagonale d'un OMS est-elle plus facile à tester qu'un monolithe ?",
      "options": [
        "Car les microservices sont naturellement plus testables.",
        "Car le domaine OMS dépend d'interfaces d'adapters (DIP) — on injecte des mocks FIX/SQL en tests sans infrastructure réelle.",
        "Car les tests unitaires ne sont possibles qu'en architecture hexagonale.",
        "Car le monolithe utilise des classes statiques non mockables."
      ],
      "answer": "Car le domaine OMS dépend d'interfaces d'adapters (DIP) — on injecte des mocks FIX/SQL en tests sans infrastructure réelle.",
      "explanation": "Hexagonal + DIP = testabilité maximale. Le domaine dépend de `IFIXAdapter`, `IOrderRepository` — jamais de QuickFIX/n ou SQL Server directement. En tests : `MockFIXAdapter`, `InMemoryOrderRepository`. Zéro connexion réseau, zéro base de données. Le même principe DIP qu'au niveau d'une classe, appliqué à toute l'architecture."
    },
    {
      "question": "[Anti-pattern] Un développeur appelle l'API Bloomberg BLPAPI de manière synchrone dans le thread d'exécution des ordres du C# OMS. Quel risque critique ?",
      "options": [
        "Bloomberg BLPAPI ne supporte pas les appels synchrones.",
        "Le thread d'exécution est bloqué pendant l'appel Bloomberg (50-500ms) — l'OMS ne peut pas traiter d'autres ordres pendant ce temps.",
        "Les prix Bloomberg sont incorrects si appelés depuis un thread d'exécution.",
        "Cela viole la licence Bloomberg BLPAPI."
      ],
      "answer": "Le thread d'exécution est bloqué pendant l'appel Bloomberg (50-500ms) — l'OMS ne peut pas traiter d'autres ordres pendant ce temps.",
      "explanation": "Anti-pattern classique : appel I/O synchrone dans un hot path. L'API Bloomberg peut prendre 50-500ms. Pendant ce temps, le thread d'exécution est gelé — aucun autre ordre ne peut être traité. Solution : architecture événementielle avec cache Redis des prix Bloomberg, mis à jour asynchroniquement par un service dédié. L'OMS lit le cache (< 1ms) sans jamais appeler Bloomberg directement."
    },
    {
      "question": "[Croisement Pattern → Architecture] Le pattern CQRS est-il naturellement adapté à un OMS ? Pourquoi ?",
      "options": [
        "Non — CQRS ajoute de la complexité inutile dans un OMS.",
        "Oui — les ordres (Command : PlaceOrder, CancelOrder) et les requêtes de blotter (Query : GetOpenOrders) ont des profils de charge très différents et peuvent être scalés indépendamment.",
        "Oui — mais uniquement si l'OMS utilise MongoDB.",
        "Non — CQRS est réservé aux bases de données NoSQL."
      ],
      "answer": "Oui — les ordres (Command : PlaceOrder, CancelOrder) et les requêtes de blotter (Query : GetOpenOrders) ont des profils de charge très différents et peuvent être scalés indépendamment.",
      "explanation": "CQRS dans l'OMS : les commandes (écriture d'ordres) transitent par Kafka vers le moteur d'exécution C#. Les queries (lecture du blotter par les traders) frappent un read model Redis ou SQL dénormalisé. Scaling indépendant : on peut multiplier les instances de lecture sans impacter le moteur d'écriture. Event Sourcing complète CQRS : chaque ordre est un événement rejoué pour reconstruire l'état."
    },
    {
      "question": "Quelle stack est la plus adaptée pour un signal de trading algorithmique à basse fréquence (exécution daily) ?",
      "options": [
        "FPGA + kernel bypass + UDP multicast",
        "Python (modèle alpha) → REST API → C# OMS → FIX → venue",
        "kdb+ → gRPC → C++ engine → co-location",
        "Redis pub/sub → WebSocket → Angular"
      ],
      "answer": "Python (modèle alpha) → REST API → C# OMS → FIX → venue",
      "explanation": "Pour une stratégie daily, la latence de 10-50ms d'un appel REST est parfaitement acceptable. Python gère le modèle quant (NumPy, Pandas, scipy). C# OMS valide et exécute via FIX. La complexité FPGA/kernel bypass est inutile et coûteuse pour ce cas d'usage. Simple = maintenable = moins d'erreurs en production."
    },
    {
      "question": "[Croisement DB → Use Case] Associez chaque système à sa base de données principale : RMS temps réel / PMS EOD / tick data HFT / cache order book.",
      "options": [
        "RMS→SQL Server / PMS→kdb+ / tick data→Redis / cache→MongoDB",
        "RMS→Redis (latence < 1ms pour alertes) / PMS→SQL Server (positions EOD) / tick data→kdb+ / cache order book→Redis",
        "RMS→kdb+ / PMS→Redis / tick data→SQL Server / cache→InfluxDB",
        "Tous utilisent SQL Server — ACID garanti partout."
      ],
      "answer": "RMS→Redis (latence < 1ms pour alertes) / PMS→SQL Server (positions EOD) / tick data→kdb+ / cache order book→Redis",
      "explanation": "Chaque DB joue son rôle : Redis pour le RMS (alertes de risque en < 1ms), SQL Server pour le PMS EOD (ACID, référentiel positions), kdb+ pour les tick data (requêtes vectorielles sur milliards de ticks), Redis également pour le cache order book de l'EMS. Utiliser SQL Server pour tout = goulot d'étranglement garanti."
    },
    {
      "question": "[Croisement OOP → Architecture] Comment le pattern Repository, combiné à l'architecture hexagonale, permet-il de swapper la base de données d'un OMS sans modifier le domaine ?",
      "options": [
        "On modifie le domaine pour supporter la nouvelle DB.",
        "Le domaine dépend de `IOrderRepository` (interface). L'adapter SQL peut être remplacé par un adapter kdb+ ou Redis sans toucher une ligne du domaine OMS.",
        "On utilise un ORM universel qui supporte toutes les bases de données.",
        "Le pattern Repository génère automatiquement le code d'accès à la nouvelle DB."
      ],
      "answer": "Le domaine dépend de `IOrderRepository` (interface). L'adapter SQL peut être remplacé par un adapter kdb+ ou Redis sans toucher une ligne du domaine OMS.",
      "explanation": "Repository + Hexagonal + DIP : le domaine OMS appelle `IOrderRepository.Save(order)` — il ignore complètement si c'est SQL Server, kdb+ ou un fichier flat. L'adapter est une implémentation concrète branchée en périphérie. Migrer de SQL Server à PostgreSQL = créer `PostgresOrderRepository : IOrderRepository`, enregistrer dans le DI. Zéro modification du domaine. OCP + DIP appliqués à l'infrastructure."
    },
    {
      "question": "Pourquoi Kafka est-il préféré à RabbitMQ pour l'audit trail et la reconstruction de positions en fin de journée ?",
      "options": [
        "Kafka est plus rapide que RabbitMQ pour tous les cas d'usage.",
        "Kafka conserve les messages sur disque de façon immuable et rejouable — on peut reconstruire toutes les positions en rejouant les événements du topic depuis le début de journée.",
        "RabbitMQ ne supporte pas les messages financiers.",
        "Kafka est le seul broker compatible avec FIX Protocol."
      ],
      "answer": "Kafka conserve les messages sur disque de façon immuable et rejouable — on peut reconstruire toutes les positions en rejouant les événements du topic depuis le début de journée.",
      "explanation": "Event Sourcing avec Kafka : chaque exécution de trade publiée sur le topic `executions` est conservée sur disque. En fin de journée, un processus rejoue tous les événements pour reconstruire les positions (réconciliation). En cas d'incident, on peut rejouer depuis n'importe quel point. RabbitMQ supprime les messages après ACK — reconstruction impossible."
    },
    {
      "question": "[Refactoring] Un monolithe gère OMS + RMS + PMS dans le même processus. La mise à jour du moteur de risk nécessite un redéploiement complet de l'OMS. Comment découper ?",
      "options": [
        "Ajouter des threads dédiés par module dans le même processus.",
        "Séparer OMS, RMS et PMS en microservices communiquant via Kafka — chaque service déployable indépendamment.",
        "Utiliser des classes statiques pour isoler les modules.",
        "Déplacer le RMS dans une base de données séparée."
      ],
      "answer": "Séparer OMS, RMS et PMS en microservices communiquant via Kafka — chaque service déployable indépendamment.",
      "explanation": "Refactoring microservices : OMS publie `OrderCreated` sur Kafka. RMS consomme l'événement, calcule le risque, publie `RiskApproved` ou `RiskRejected`. PMS consomme `OrderExecuted` pour mettre à jour les positions. Chaque service a son propre cycle de déploiement. Contrapartie : il faut implémenter le pattern Saga pour remplacer les transactions ACID du monolithe."
    },
    {
      "question": "[Croisement Latence → Choix technique] Pour un market maker qui doit répondre en < 10µs, quelle stack est la seule viable ?",
      "options": [
        "C# ASP.NET Core + REST API + SQL Server",
        "Python FastAPI + Pandas + PostgreSQL",
        "C++ ou FPGA + kernel bypass (DPDK/RDMA) + co-location + UDP multicast",
        "Java Spring Boot + Kafka + Redis"
      ],
      "answer": "C++ ou FPGA + kernel bypass (DPDK/RDMA) + co-location + UDP multicast",
      "explanation": "À < 10µs, le kernel Linux lui-même introduit trop de latence (context switches, interrupts). Le kernel bypass (DPDK) court-circuite le kernel pour accéder directement aux cartes réseau. FPGA élimine même le CPU. UDP multicast diffuse les prix sans overhead TCP. Co-location réduit la latence réseau à quelques µs. C#, Java, Python et REST sont exclus à ce niveau — leurs overhead GC et framework dépassent 10µs."
    },
    {
      "question": "[Croisement Design Pattern → EDA] Le pattern Observer et l'architecture Event-Driven partagent le même principe fondamental. Lequel ?",
      "options": [
        "Les deux utilisent Kafka comme broker de messages.",
        "Les deux découplent la source des consommateurs : la source publie sans connaître ses abonnés, les abonnés réagissent indépendamment.",
        "Les deux reposent sur des appels synchrones HTTP.",
        "Les deux nécessitent une base de données partagée."
      ],
      "answer": "Les deux découplent la source des consommateurs : la source publie sans connaître ses abonnés, les abonnés réagissent indépendamment.",
      "explanation": "Observer POO : `event PriceChanged` → OMS, RMS, PMS s'abonnent via `+=`. Event-Driven Architecture : Market Data Feed publie sur le topic Kafka `prices` → OMS, RMS, PMS consomment indépendamment. Même principe, deux échelles : Observer = in-process, EDA = distribué. L'EDA est le pattern Observer étendu à l'échelle d'un système distribué."
    },
    {
      "question": "Dans la stack Python quant + C# OMS, pourquoi une DB intermédiaire (PostgreSQL/Redis) est-elle préférable à un appel gRPC direct pour une stratégie intraday ?",
      "options": [
        "gRPC n'est pas compatible avec Python.",
        "La DB intermédiaire découple temporellement les deux systèmes — Python écrit le signal quand il est prêt, C# le consomme à son rythme, sans couplage direct ni risque de timeout.",
        "PostgreSQL est plus rapide que gRPC.",
        "Le C# OMS ne peut pas consommer de messages gRPC."
      ],
      "answer": "La DB intermédiaire découple temporellement les deux systèmes — Python écrit le signal quand il est prêt, C# le consomme à son rythme, sans couplage direct ni risque de timeout.",
      "explanation": "DB intermédiaire = découplage temporel. Si le C# OMS est en maintenance, Python continue d'écrire les signaux — ils s'accumulent et seront traités au redémarrage. Avec gRPC direct, si l'OMS est indisponible, Python échoue et perd le signal. Pour une stratégie intraday (latence > 100ms), cette approche est préférable. Redis convient pour des signaux fréquents, PostgreSQL pour des signaux moins fréquents avec historique."
    },
    {
      "question": "[Croisement SOLID → Microservices] Quel principe SOLID justifie de séparer le service Market Data du service OMS en deux microservices distincts ?",
      "options": [
        "LSP — les deux services doivent être substituables.",
        "ISP — l'interface Market Data est trop grande pour l'OMS.",
        "SRP — le service Market Data a une responsabilité (normaliser et distribuer les prix), l'OMS en a une autre (gérer le cycle de vie des ordres). Ils ont des raisons de changer différentes.",
        "OCP — le service Market Data est ouvert à l'extension."
      ],
      "answer": "SRP — le service Market Data a une responsabilité (normaliser et distribuer les prix), l'OMS en a une autre (gérer le cycle de vie des ordres). Ils ont des raisons de changer différentes.",
      "explanation": "SRP à l'échelle des microservices : changer de fournisseur de Market Data (Bloomberg → Refinitiv) ne doit pas impacter l'OMS. Changer la logique de validation d'ordre ne doit pas impacter le Market Data. Un seul service pour les deux = une modification dans l'OMS force le redéploiement du Market Data. SRP justifie la séparation, Kafka découple la communication."
    },
    {
      "question": "[Nommage inversé] Un service qui normalise les données de Bloomberg et Refinitiv vers un format interne unique, puis les distribue à l'OMS, RMS et PMS simultanément via un topic Kafka s'appelle ?",
      "options": [
        "Un EMS — Execution Management System",
        "Un Market Data Handler (ou Market Data Normalizer)",
        "Un ORM — Object Relational Mapper",
        "Un API Gateway"
      ],
      "answer": "Un Market Data Handler (ou Market Data Normalizer)",
      "explanation": "Le Market Data Handler est le composant qui : (1) consomme les feeds hétérogènes (Bloomberg BLPAPI, Refinitiv RFA), (2) normalise vers un format interne standard, (3) publie sur Kafka topics pour diffusion pub/sub vers OMS, RMS, PMS. Il applique le pattern Observer à l'échelle distribuée : N systèmes reçoivent les prix sans coupler directement avec Bloomberg."
    },
    {
      "question": "[Croisement OOP + Design Pattern → Architecture] Le Smart Order Routing d'un EMS implémente quel design pattern, et quel pilier POO en est le fondement ?",
      "options": [
        "Pattern Singleton (une seule instance de router) + Encapsulation.",
        "Pattern Strategy (algorithme de sélection de venue interchangeable) + Polymorphisme (chaque venue implémente `IExecutionVenue` différemment).",
        "Pattern Builder (construction de l'ordre) + Héritage.",
        "Pattern Observer (notification des venues) + Abstraction."
      ],
      "answer": "Pattern Strategy (algorithme de sélection de venue interchangeable) + Polymorphisme (chaque venue implémente `IExecutionVenue` différemment).",
      "explanation": "Le SOR est un Strategy pattern : `IVenueSelector.SelectBestVenue(order)` est implémenté par `BestPriceSelector`, `LiquiditySelector`, `CostSelector`. Chaque venue (LSE, Euronext, CBOE) implémente `IExecutionVenue.Submit(order)` — Polymorphisme. Ajouter une nouvelle venue = nouvelle implémentation `IExecutionVenue` (OCP). Le SOR n'est pas modifié. C'est Strategy + DIP + OCP + Polymorphisme en une seule architecture."
    },
    {
      "question": "[Anti-pattern Architecture] Un monolithe OMS/RMS partage son DbContext EF Core entre les deux modules via `AddSingleton`. Quels problèmes cela crée-t-il ?",
      "options": [
        "Aucun problème — un DbContext partagé améliore les performances.",
        "Captive Dependency : le DbContext Scoped est capturé dans le Singleton — toutes les requêtes partagent le même ChangeTracker, corrompant les données entre sessions.",
        "SQL Server ne supporte pas EF Core en mode Singleton.",
        "Le RMS ne peut pas lire les données de l'OMS si le DbContext est Singleton."
      ],
      "answer": "Captive Dependency : le DbContext Scoped est capturé dans le Singleton — toutes les requêtes partagent le même ChangeTracker, corrompant les données entre sessions.",
      "explanation": "Captive Dependency en contexte trading : DbContext doit être `AddScoped` (une instance par requête). Si capturé dans un `AddSingleton`, le ChangeTracker accumule toutes les modifications de toutes les requêtes — une mise à jour de position du RMS peut écraser une modification d'ordre de l'OMS sur la même entité. C'est l'une des violations DI les plus dangereuses en production trading."
    },
    {
      "question": "[Croisement Architecture → Event-Driven → OOP] Dans une architecture Event-Driven OMS, quel pattern POO et quel pattern de conception se combinent pour garantir qu'un OrderFilled event déclenche simultanément la mise à jour du PMS, du RMS et de l'audit trail ?",
      "options": [
        "Singleton + Builder — une seule instance construit les événements.",
        "Observer POO (event/delegate) étendu à Kafka pub/sub (EDA) — un événement `OrderFilled` publié sur un topic est consommé indépendamment par PMS, RMS et Audit Service.",
        "Chain of Responsibility — l'événement passe séquentiellement de PMS à RMS à Audit.",
        "Strategy + Repository — chaque service choisit sa stratégie de traitement."
      ],
      "answer": "Observer POO (event/delegate) étendu à Kafka pub/sub (EDA) — un événement `OrderFilled` publié sur un topic est consommé indépendamment par PMS, RMS et Audit Service.",
      "explanation": "Double niveau Observer : au niveau POO, le domaine OMS publie un `OrderFilledEvent` via `event` ou Mediator (Domain Event). Au niveau architectural, cet événement est projeté sur un topic Kafka `order.filled`. PMS consommer group 1, RMS consumer group 2, Audit consumer group 3 — chacun reçoit l'événement indépendamment, en parallèle, sans couplage. Observer POO = in-process. Kafka EDA = distributed Observer. Même principe, deux échelles."
    },
    {
      "question": "[Croisement Latence → Stack → OOP] Pour un RMS qui doit calculer les Greeks en temps réel (< 1ms par calcul), quelle combinaison technique et quel principe OOP garantissent l'extensibilité des modèles de pricing ?",
      "options": [
        "Python + Pandas + `if/else` sur le type d'instrument.",
        "C# avec `struct`/`Span<T>` (zero-allocation) + interface `IPricingModel` injectée (Strategy + DIP) — chaque modèle (BS, Heston, SABR) est une implémentation swappable sans modifier le moteur.",
        "Java + Spring Boot + annotations `@Pricing`.",
        "SQL stored procedures pour les calculs de Greeks."
      ],
      "answer": "C# avec `struct`/`Span<T>` (zero-allocation) + interface `IPricingModel` injectée (Strategy + DIP) — chaque modèle (BS, Heston, SABR) est une implémentation swappable sans modifier le moteur.",
      "explanation": "Deux exigences simultanées : performance (< 1ms) et extensibilité. `struct`/`Span<T>` = zero-allocation sur les hot paths, pas de pression GC. `IPricingModel` injectée = Strategy + DIP : `BlackScholesModel`, `HestonModel`, `SABRModel` sont des implémentations interchangeables. Ajouter un nouveau modèle = nouvelle classe, zéro modification du moteur RMS (OCP). Performance + architecture propre ne sont pas incompatibles."
    },
    {
      "question": "[Croisement Système → Système → Pattern] Comment l'OMS et le RMS communiquent-ils dans une architecture microservices, et quel pattern garantit la cohérence si le RMS rejette l'ordre après que l'OMS l'a déjà enregistré ?",
      "options": [
        "Appel HTTP synchrone OMS→RMS. Si rejet : le HTTP retourne une erreur et l'OMS annule.",
        "Kafka événements + pattern Saga : OMS publie `OrderCreated`, RMS consomme et publie `RiskApproved` ou `RiskRejected`. Si rejet, la Saga déclenche `OrderCancelled` (compensation) dans l'OMS.",
        "Shared database entre OMS et RMS — transaction SQL unique couvre les deux.",
        "gRPC synchrone OMS→RMS avec timeout de 5 secondes."
      ],
      "answer": "Kafka événements + pattern Saga : OMS publie `OrderCreated`, RMS consomme et publie `RiskApproved` ou `RiskRejected`. Si rejet, la Saga déclenche `OrderCancelled` (compensation) dans l'OMS.",
      "explanation": "Saga Choreography : OMS publie `OrderCreated` → Kafka. RMS consomme, calcule le risque, publie `RiskApproved` ou `RiskRejected`. Si `RiskRejected` : l'OMS consomme l'événement et passe l'ordre en statut `Cancelled` (transaction compensatoire). Chaque service ne connaît que ses événements — pas de couplage direct. Kafka garantit la livraison, la Saga garantit la cohérence finale même sans ACID distribué."
    },
    {
      "question": "[Croisement Anti-pattern → OOP → Architecture] Un dev utilise `public static class PricingCache { public static Dictionary<string, decimal> Prices; }` dans un OMS multithread. Identifiez toutes les violations.",
      "options": [
        "Aucune — les classes statiques sont plus performantes.",
        "Encapsulation rompue (champ public mutable) + Singleton mal implémenté (pas de contrôle d'accès) + race conditions garanties (Dictionary non thread-safe) + DIP violé (couplage direct à une classe statique, non mockable en tests).",
        "SRP violé uniquement — le cache a trop de responsabilités.",
        "OCP violé — on ne peut pas étendre une classe statique."
      ],
      "answer": "Encapsulation rompue (champ public mutable) + Singleton mal implémenté (pas de contrôle d'accès) + race conditions garanties (Dictionary non thread-safe) + DIP violé (couplage direct à une classe statique, non mockable en tests).",
      "explanation": "4 violations simultanées en contexte OMS : (1) `public static Dictionary` = n'importe quel thread modifie les prix directement — Encapsulation rompue. (2) Singleton sans `private` constructor ni `Lazy<T>` = pas de contrôle d'instantiation. (3) `Dictionary` non thread-safe sous charge HFT = corruptions mémoire. (4) Classe statique = impossible d'injecter un mock en tests — DIP violé. Solution : `ICacheService` injectée via DI, implémentée par `RedisCacheService` avec `ConcurrentDictionary` en fallback."
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
  const totalScore = scores.moyen + scores.avance;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Écosystème technique salle de marché maîtrisé.</h3> : <p className="fail">📚 Révisez les systèmes et architectures de trading.</p>}
    </div>
  );
};

const Page5 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") { setLevel("avance"); } else { setShowResult(true); }
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
      }, 12000);
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
            Arch & Systèmes Trading 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {level === "basic" ? <Flashcard slide={basicSlides[currentSlide]} /> : (
            <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page5;
