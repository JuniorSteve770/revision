// src/projects/BackendInterview/MarketProtocolsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Les 4 protocoles en finance de marché",
    answer:
      "◆ **Définition** : 4 protocoles qui cohabitent dans un OMS selon le type de système à connecter\n◆ **REST + JSON** : entre applications récentes (microservices, API internes/externes)\n◆ **SOAP + XML** : avec les systèmes legacy (back-office historique, référentiels)\n◆ **FIX** : envoi d'ordres vers brokers, marchés, plateformes de trading\n◆ **WebSocket** : diffusion temps réel (cours, statuts d'ordres)\n◆ **Cas d'usage** : un OMS combine généralement les 4 — FIX vers les marchés, REST pour les apps modernes, SOAP vers le legacy, WebSocket vers les postes traders",
  },
  {
    question: "REST — Les verbes HTTP",
    answer:
      "◆ **Définition** : REST utilise les verbes HTTP pour exprimer une action sur une ressource\n◆ **GET** : lire une ressource (idempotent)\n◆ **POST** : créer une ressource (non idempotent)\n◆ **PUT** : remplacer une ressource (idempotent)\n◆ **PATCH** : modifier partiellement (non idempotent en général)\n◆ **DELETE** : supprimer (idempotent)\n◆ **Cas d'usage** : POST /orders pour créer un ordre, GET /orders/{id} pour consulter son statut\n\n```csharp\n[HttpPost]\npublic async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderRequest r)\n{\n    var order = await _orderService.CreateAsync(r);\n    return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);\n}\n```\n⚠️ Idempotent = même résultat si on répète l'appel plusieurs fois",
  },
  {
    question: "REST — Client HttpClient en C#",
    answer:
      "◆ **Définition** : HttpClient est le client .NET standard pour consommer une API REST\n◆ **PostAsJsonAsync** : sérialise l'objet en JSON automatiquement\n◆ **ReadFromJsonAsync<T>** : désérialise la réponse\n◆ **EnsureSuccessStatusCode** : lève une exception si code ≥ 400\n◆ **Cas d'usage** : un front web appelle l'OMS pour passer un ordre depuis une page trader\n\n```csharp\nvar response = await client.PostAsJsonAsync(\"orders\", new CreateOrderRequest\n{\n    Symbol = \"AAPL\", Side = \"BUY\", Quantity = 100, Price = 189.50m\n});\nresponse.EnsureSuccessStatusCode();\nvar order = await response.Content.ReadFromJsonAsync<OrderDto>();\n```\n⚠️ System.Text.Json = plus performant que Newtonsoft.Json (moins d'allocations)",
  },
  {
    question: "SOAP + XML — Pourquoi ça survit en finance",
    answer:
      "◆ **Définition** : SOAP est un protocole d'échange basé sur une enveloppe XML stricte, décrite par un contrat WSDL\n◆ **Enveloppe SOAP** : Envelope / Header / Body en XML\n◆ **WS-Security** : standards de sécurité enterprise natifs\n◆ **Cas d'usage** : interroger un référentiel produit ou un système de compensation vieux de 15-20 ans, trop critique pour être réécrit\n\n```xml\n<soapenv:Envelope xmlns:soapenv=\"...\">\n  <soapenv:Body>\n    <GetOrderStatusRequest>\n      <OrderId>ORD-2026-000123</OrderId>\n    </GetOrderStatusRequest>\n  </soapenv:Body>\n</soapenv:Envelope>\n```\n⚠️ SOAP = typage fort + contrat figé, REST = plus léger + plus rapide à développer",
  },
  {
    question: "SOAP — Consommer un service en C#",
    answer:
      "◆ **Définition** : deux façons de consommer un WSDL depuis C#\n◆ **Client généré** : depuis le WSDL via dotnet-svcutil ou Visual Studio\n◆ **Appel manuel** : via HttpClient + StringContent en dernier recours\n◆ **SOAPAction** : header requis pour indiquer l'opération appelée\n◆ **SOAP Fault** : équivalent des codes d'erreur HTTP côté SOAP\n◆ **Cas d'usage** : interroger le statut d'un ordre historique stocké dans un mainframe\n\n```csharp\nvar client = new LegacyOrderServiceClient(\n    LegacyOrderServiceClient.EndpointConfiguration.LegacyOrderServiceSoap);\nvar response = await client.GetOrderStatusAsync(\n    new GetOrderStatusRequest { OrderId = \"ORD-2026-000123\" });\n```\n⚠️ XmlSerializer vs DataContractSerializer : deux façons de (dé)sérialiser du XML en .NET",
  },
  {
    question: "FIX — Structure d'un message",
    answer:
      "◆ **Définition** : FIX = protocole texte tag=valeur, conçu en 1992 pour la basse latence\n◆ **Format** : tag=valeur séparés par SOH (\\x01)\n◆ **Tag 35 (MsgType)** : D=New Order, 8=Execution Report, F=Cancel Request\n◆ **Tag 11 (ClOrdID)** : identifiant client de l'ordre\n◆ **Tag 55/54/38/44** : Symbol / Side / OrderQty / Price\n◆ **Cas d'usage** : un buy-side envoie un ordre limité sur AAPL à son broker\n\n```\n8=FIX.4.4|35=D|49=CLIENT12|56=BROKER03|11=ORD00001|\n55=AAPL|54=1|38=100|40=2|44=189.50|10=128|\n```",
  },
  {
    question: "FIX — Cycle de vie d'un ordre (OrdStatus, tag 39)",
    answer:
      "◆ **Définition** : le tag 39 (OrdStatus) reflète l'état courant d'un ordre côté marché/broker\n◆ **0 = New** : ordre reçu et accepté\n◆ **1 = Partially filled** : exécution partielle\n◆ **2 = Filled** : exécution complète\n◆ **4 = Canceled** : ordre annulé\n◆ **8 = Rejected** : ordre rejeté\n◆ **Cas d'usage** : suivre en direct l'avancement d'un ordre volumineux exécuté par tranches\n\n```\nNew (0) → PartiallyFilled (1) → Filled (2)\n       ou → Canceled (4) / Rejected (8)\n```\n⚠️ C'est LA question la plus posée en entretien sur FIX",
  },
  {
    question: "FIX — Session layer vs Application layer",
    answer:
      "◆ **Définition** : FIX sépare la gestion de connexion (session) de l'information métier (application)\n◆ **Messages de session** : Logon(A), Heartbeat(0), Logout(5), ResendRequest(2), SequenceReset(4)\n◆ **Messages applicatifs** : NewOrderSingle(D), ExecutionReport(8), OrderCancelRequest(F), OrderCancelReplaceRequest(G)\n◆ **MsgSeqNum (tag 34)** : garantit qu'aucun message n'est perdu\n◆ **Cas d'usage** : après une coupure réseau, la session redémarre et un ResendRequest rejoue les messages manqués\n\n```csharp\npublic void SendNewOrder(string symbol, char side, decimal qty, decimal price)\n{\n    var order = new QuickFix.FIX44.NewOrderSingle(\n        new ClOrdID(Guid.NewGuid().ToString()),\n        new Side(side), new TransactTime(DateTime.UtcNow),\n        new OrdType(OrdType.LIMIT));\n    Session.SendToTarget(order, _sessionId);\n}\n```\n⚠️ QuickFIX/n = moteur FIX le plus utilisé en .NET (on ne parse jamais FIX à la main)",
  },
  {
    question: "WebSocket — Push vs Pull",
    answer:
      "◆ **Définition** : WebSocket ouvre une connexion bidirectionnelle persistante après un handshake HTTP (upgrade HTTP→WS)\n◆ **REST** = pull : le client demande, le serveur répond\n◆ **WebSocket** = push : le serveur pousse dès qu'il y a un événement\n◆ **wss://** : WebSocket sécurisé (TLS)\n◆ **Cas d'usage** : diffuser en continu les variations de prix d'un instrument sur l'écran d'un trader\n\n```csharp\nawait socket.SendAsync(bytes, WebSocketMessageType.Text, true, ct);\n// côté client\nvar result = await client.ReceiveAsync(buffer, CancellationToken.None);\n```\n⚠️ Alternatives : SSE (unidirectionnel), gRPC streaming, long polling, SignalR (abstraction .NET)",
  },
  {
    question: "Synthèse comparative — Quel protocole pour quel besoin ?",
    answer:
      "◆ **Définition** : chaque protocole répond à un besoin précis dans l'architecture de trading\n◆ **REST** : stateless, requête/réponse, apps modernes\n◆ **SOAP** : stateless, requête/réponse, legacy/back-office\n◆ **FIX** : stateful (contrôle de séquence), session persistante, ordres/exécutions\n◆ **WebSocket** : stateful, connexion ouverte, cours/statuts temps réel\n◆ **Cas d'usage** : savoir dessiner ce schéma à l'oral vaut souvent plus que la syntaxe de chaque techno\n\n```\n[Front Trader] --REST/WS--> [OMS .NET] --FIX--> [Brokers/Marchés]\n                                  |--SOAP--> [Legacy/Back-office]\n```",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: REST ====================
    {
      question:
        "[REST] Quelle est la principale caractéristique d'une requête PUT par rapport à une requête PATCH ?",
      options: [
        "PUT et PATCH sont strictement identiques",
        "PUT sert uniquement à créer, PATCH uniquement à lire",
        "PUT remplace intégralement la ressource, PATCH la modifie partiellement",
        "PUT est idempotent, PATCH ne l'est jamais dans aucun cas",
      ],
      answer: "PUT remplace intégralement la ressource, PATCH la modifie partiellement",
      explanation:
        "PUT remplace la ressource entière (donc idempotent : renvoyer la même requête donne le même résultat). PATCH applique une modification partielle et n'est en général pas idempotent.",
    },
    {
      question:
        "[REST] Qu'est-ce que la notion de 'statelessness' (sans état) en REST ?",
      options: [
        "Chaque requête est autonome et contient toute l'information nécessaire, sans dépendre d'une session serveur",
        "Le serveur garde en mémoire l'historique de toutes les requêtes du client",
        "Le client ne peut envoyer qu'une seule requête par connexion TCP",
        "REST ne peut pas gérer l'authentification",
      ],
      answer: "Chaque requête est autonome et contient toute l'information nécessaire, sans dépendre d'une session serveur",
      explanation:
        "Le principe stateless signifie que le serveur ne conserve aucun contexte entre deux requêtes. Chaque appel doit porter toute l'info nécessaire (ex: token d'authentification dans le header).",
    },
    {
      question:
        "[REST] Que fait la méthode HttpClient.PostAsJsonAsync en C# ?",
      options: [
        "Elle télécharge un fichier JSON depuis le serveur",
        "Elle convertit une réponse XML en JSON",
        "Elle envoie une requête GET avec les paramètres en query string",
        "Elle sérialise automatiquement l'objet en JSON et envoie une requête POST",
      ],
      answer: "Elle sérialise automatiquement l'objet en JSON et envoie une requête POST",
      explanation:
        "PostAsJsonAsync (extension de HttpClient) sérialise l'objet C# passé en paramètre en JSON, puis envoie une requête HTTP POST avec ce JSON comme corps de la requête.",
    },
    {
      question:
        "[REST] Quel code HTTP est typiquement renvoyé après une création réussie via POST ?",
      options: ["301 Moved Permanently", "200 OK", "201 Created", "204 No Content"],
      answer: "201 Created",
      explanation:
        "201 Created indique que la ressource a été créée avec succès. La réponse contient généralement un header Location pointant vers la nouvelle ressource (via CreatedAtAction en ASP.NET Core).",
    },

    // ==================== SECTION B: SOAP / XML ====================
    {
      question:
        "[SOAP] Pourquoi une banque garde-t-elle encore des services SOAP en production aujourd'hui ?",
      options: [
        "Parce que JSON n'est pas supporté par .NET",
        "Parce que SOAP n'existe que depuis 2020",
        "Parce que SOAP est plus rapide que REST en toutes circonstances",
        "Parce que réécrire des systèmes critiques (compensation, référentiels) est risqué et coûteux, et que le contrat WSDL est figé",
      ],
      answer: "Parce que réécrire des systèmes critiques (compensation, référentiels) est risqué et coûteux, et que le contrat WSDL est figé",
      explanation:
        "Les systèmes legacy en SOAP sont souvent des back-offices ou référentiels critiques et certifiés. Le risque et le coût de migration sont trop élevés par rapport au bénéfice, donc ils restent en place.",
    },
    {
      question: "[SOAP] Que décrit un fichier WSDL ?",
      options: [
        "Les logs d'erreurs du service",
        "Le contrat du service SOAP : opérations disponibles, types de données, format des messages",
        "Le style visuel de l'application cliente",
        "La configuration réseau du serveur",
      ],
      answer: "Le contrat du service SOAP : opérations disponibles, types de données, format des messages",
      explanation:
        "WSDL (Web Services Description Language) est un document XML qui décrit précisément le contrat d'un service SOAP : quelles opérations sont exposées, quels types de données elles attendent et renvoient.",
    },
    {
      question:
        "[SOAP] Quel est l'équivalent, côté SOAP, des codes d'erreur HTTP (400, 500...) côté REST ?",
      options: ["Le SOAP Header", "Le SOAPAction", "Le WSDL", "Le SOAP Fault"],
      answer: "Le SOAP Fault",
      explanation:
        "Un SOAP Fault est un élément XML spécial retourné dans le Body de la réponse SOAP pour signaler une erreur (code, message, détail), jouant un rôle analogue aux codes HTTP 4xx/5xx en REST.",
    },
    {
      question:
        "[SOAP] En C#, quelle est une façon standard de consommer un service SOAP décrit par un WSDL ?",
      options: [
        "SOAP n'est pas consommable depuis C#",
        "Utiliser WebSocket avec un handshake spécial",
        "Utiliser uniquement System.Text.Json",
        "Générer un client via dotnet-svcutil ou 'Add Connected Service' dans Visual Studio",
      ],
      answer: "Générer un client via dotnet-svcutil ou 'Add Connected Service' dans Visual Studio",
      explanation:
        "La méthode standard consiste à générer un client fortement typé à partir du WSDL, via l'outil dotnet-svcutil ou la fonctionnalité 'Add Connected Service' de Visual Studio.",
    },

    // ==================== SECTION C: FIX ====================
    {
      question: "[FIX] À quoi correspond le tag 35 (MsgType) dans un message FIX ?",
      options: [
        "Le prix de l'ordre",
        "L'identifiant unique du message",
        "Le nom du broker destinataire",
        "Le type du message : D=New Order Single, 8=Execution Report, F=Cancel Request...",
      ],
      answer: "Le type du message : D=New Order Single, 8=Execution Report, F=Cancel Request...",
      explanation:
        "Le tag 35 (MsgType) indique la nature du message applicatif : 'D' pour un nouvel ordre, '8' pour un rapport d'exécution, 'F' pour une demande d'annulation, 'G' pour un remplacement, etc.",
    },
    {
      question: "[FIX] Quel est le rôle du tag 34 (MsgSeqNum) dans une session FIX ?",
      options: [
        "Il identifie le symbole tradé",
        "Il sert uniquement à l'authentification initiale",
        "Il indique le prix de l'ordre",
        "Il numérote les messages pour garantir qu'aucun n'est perdu et permettre un ResendRequest en cas de trou",
      ],
      answer: "Il numérote les messages pour garantir qu'aucun n'est perdu et permettre un ResendRequest en cas de trou",
      explanation:
        "Le MsgSeqNum permet de détecter les pertes de messages : si un destinataire constate un trou dans la séquence, il envoie un ResendRequest pour obtenir les messages manquants.",
    },
    {
      question: "[FIX] Quel est le cycle de vie typique d'un ordre via le tag 39 (OrdStatus) ?",
      options: [
        "Canceled(4) → New(0) → PartiallyFilled(1)",
        "Filled(2) → New(0) → Rejected(8)",
        "New(0) → PartiallyFilled(1) → Filled(2), ou New(0) → Canceled(4)/Rejected(8)",
        "Le tag 39 n'existe pas en FIX",
      ],
      answer: "New(0) → PartiallyFilled(1) → Filled(2), ou New(0) → Canceled(4)/Rejected(8)",
      explanation:
        "Un ordre part de New (accepté), peut passer par PartiallyFilled (exécution partielle) puis Filled (exécution complète), ou être Canceled/Rejected à tout moment avant complétion totale.",
    },
    {
      question:
        "[FIX] Quelle est la différence entre les messages de 'session layer' et 'application layer' en FIX ?",
      options: [
        "Les messages applicatifs ne sont utilisés que pour l'authentification",
        "Les messages de session sont en XML, les messages applicatifs en JSON",
        "Il n'y a pas de différence, tous les messages FIX sont identiques",
        "Les messages de session (Logon, Heartbeat, Logout) gèrent la connexion, les messages applicatifs (NewOrderSingle, ExecutionReport) portent le métier",
      ],
      answer: "Les messages de session (Logon, Heartbeat, Logout) gèrent la connexion, les messages applicatifs (NewOrderSingle, ExecutionReport) portent le métier",
      explanation:
        "La couche session gère la vivacité et la fiabilité de la connexion (Logon, Heartbeat, Logout, ResendRequest). La couche applicative transporte l'information métier : ordres, exécutions, annulations.",
    },
    {
      question: "[FIX] Pourquoi utilise-t-on FIX plutôt que REST pour l'envoi d'ordres vers les marchés ?",
      options: [
        "FIX ne nécessite aucune connexion réseau",
        "REST n'existe pas encore dans les systèmes de trading",
        "FIX est plus lisible pour un humain que JSON",
        "FIX offre une latence plus faible, un format compact, et un contrôle de séquence garantissant qu'aucun ordre n'est perdu",
      ],
      answer: "FIX offre une latence plus faible, un format compact, et un contrôle de séquence garantissant qu'aucun ordre n'est perdu",
      explanation:
        "FIX a été conçu spécifiquement pour le trading : format texte compact, très faible latence, et fiabilité de session via le MsgSeqNum — des propriétés critiques pour l'envoi d'ordres.",
    },
    {
      question: "[FIX] Que représente le tag 44 (Price) dans un message NewOrderSingle avec OrdType=2 (Limit) ?",
      options: [
        "Le prix de clôture de la veille",
        "Les frais de courtage",
        "Le prix n'est jamais transmis en FIX",
        "Le prix limite auquel l'ordre doit être exécuté",
      ],
      answer: "Le prix limite auquel l'ordre doit être exécuté",
      explanation:
        "Pour un ordre à cours limité (OrdType=2), le tag 44 (Price) précise le prix limite. Pour un ordre au marché (OrdType=1), ce tag n'est généralement pas nécessaire.",
    },
  ],

  avance: [
    // ==================== SECTION D: WEBSOCKET ====================
    {
      question:
        "[WebSocket] Quelle est la différence fondamentale entre REST et WebSocket pour la diffusion de cours en temps réel ?",
      options: [
        "Il n'y a aucune différence de modèle entre les deux",
        "WebSocket ne peut pas transporter de JSON",
        "REST fonctionne en mode push, WebSocket en mode pull",
        "REST fonctionne en mode pull (le client demande), WebSocket en mode push (le serveur envoie dès qu'un événement survient)",
      ],
      answer: "REST fonctionne en mode pull (le client demande), WebSocket en mode push (le serveur envoie dès qu'un événement survient)",
      explanation:
        "En REST, le client doit initier chaque requête (pull), ce qui est inefficace pour du temps réel (polling). WebSocket maintient une connexion ouverte permettant au serveur de pousser (push) les mises à jour dès qu'elles surviennent.",
    },
    {
      question: "[WebSocket] Comment s'établit une connexion WebSocket ?",
      options: [
        "Il n'y a pas de handshake, la connexion est directe en TCP brut",
        "Via un appel SOAP initial",
        "Via un message FIX de type Logon",
        "Via un handshake HTTP qui est ensuite mis à niveau (upgrade) vers le protocole WebSocket",
      ],
      answer: "Via un handshake HTTP qui est ensuite mis à niveau (upgrade) vers le protocole WebSocket",
      explanation:
        "La connexion WebSocket démarre par une requête HTTP classique contenant un header 'Upgrade: websocket'. Si le serveur accepte, la connexion bascule en mode WebSocket, persistante et bidirectionnelle.",
    },
    {
      question:
        "[WebSocket] Quelle abstraction .NET permet de gérer automatiquement le fallback WebSocket / SSE / long-polling ?",
      options: ["AutoMapper", "Entity Framework", "SignalR", "QuickFIX/n"],
      answer: "SignalR",
      explanation:
        "SignalR est la librairie .NET qui abstrait la communication temps réel : elle utilise WebSocket quand disponible, et bascule automatiquement sur SSE ou long-polling sinon, tout en gérant la reconnexion.",
    },
    {
      question:
        "[WebSocket] Pourquoi implémente-t-on un mécanisme de ping/pong (heartbeat) sur une connexion WebSocket ?",
      options: [
        "Ce mécanisme n'existe pas en WebSocket",
        "Pour accélérer le transfert de données",
        "Pour chiffrer les données échangées",
        "Pour détecter qu'une connexion est morte/inactive et déclencher une reconnexion",
      ],
      answer: "Pour détecter qu'une connexion est morte/inactive et déclencher une reconnexion",
      explanation:
        "Un ping/pong régulier permet de vérifier que la connexion est toujours active. En l'absence de pong dans un délai donné, le client ou le serveur considère la connexion perdue et tente une reconnexion.",
    },

    // ==================== SECTION E: SYNTHESE ====================
    {
      question: "[Synthèse] Dans un OMS typique, quel protocole est utilisé pour envoyer un ordre vers un broker ou un marché ?",
      options: ["WebSocket", "REST", "SOAP", "FIX"],
      answer: "FIX",
      explanation:
        "FIX est le standard historique et quasi-universel pour l'envoi d'ordres et la réception d'exécutions entre buy-side, sell-side (brokers) et marchés (bourses, MTF, dark pools).",
    },
    {
      question:
        "[Synthèse] Quel protocole est le plus adapté pour pousser en continu les mises à jour du carnet d'ordres vers le poste d'un trader ?",
      options: ["FTP", "SOAP", "WebSocket", "REST"],
      answer: "WebSocket",
      explanation:
        "WebSocket maintient une connexion persistante permettant au serveur de pousser les mises à jour du carnet d'ordres en temps réel, sans que le client ait à interroger le serveur en boucle (polling).",
    },
    {
      question:
        "[Synthèse] Quel protocole choisirait-on pour interfacer une nouvelle application web avec un vieux système de référentiel produit datant des années 2000 ?",
      options: ["Aucun, c'est impossible", "FIX", "WebSocket", "SOAP"],
      answer: "SOAP",
      explanation:
        "Les systèmes legacy des années 2000 exposent très souvent des services SOAP avec contrat WSDL. C'est le protocole naturel pour s'y interfacer sans réécrire le système historique.",
    },
    {
      question:
        "[Synthèse] Parmi REST, SOAP, FIX et WebSocket, lesquels sont 'stateful' (nécessitent le maintien d'un état de connexion/session) ?",
      options: [
        "Seul REST est stateful",
        "Les 4 protocoles sont stateless",
        "REST et SOAP",
        "FIX et WebSocket",
      ],
      answer: "FIX et WebSocket",
      explanation:
        "REST et SOAP sont conçus comme stateless (chaque requête est autonome). FIX maintient une session avec contrôle de séquence (MsgSeqNum), et WebSocket maintient une connexion ouverte persistante : les deux sont stateful.",
    },
    {
      question: "[Synthèse] Quel est le format de sérialisation utilisé respectivement par REST et par SOAP ?",
      options: [
        "Les deux utilisent uniquement du texte tag=valeur",
        "REST utilise XML, SOAP utilise JSON",
        "Les deux utilisent uniquement JSON",
        "REST utilise JSON, SOAP utilise XML",
      ],
      answer: "REST utilise JSON, SOAP utilise XML",
      explanation:
        "REST s'appuie typiquement sur JSON (léger, lisible, facilement mappable en objets C#), tandis que SOAP repose sur une enveloppe XML stricte définie par le contrat WSDL.",
    },

    // ==================== SECTION F: DECODAGE FIX ====================
    {
      question:
        "[FIX - Décodage] Voici un message FIX :\n`8=FIX.4.4|35=8|11=ORD00001|17=EXEC001|39=1|151=40|14=60|55=AAPL|10=201|`\nQue signifie ce message ?",
      options: [
        "Un message de Logon de session",
        "Une demande d'annulation d'ordre",
        "Un nouvel ordre (New Order Single) sur AAPL",
        "Un rapport d'exécution (35=8) indiquant un fill partiel (39=1) avec 40 titres restants (151) et 60 déjà exécutés (14)",
      ],
      answer: "Un rapport d'exécution (35=8) indiquant un fill partiel (39=1) avec 40 titres restants (151) et 60 déjà exécutés (14)",
      explanation:
        "Tag 35=8 signifie ExecutionReport. Tag 39=1 signifie PartiallyFilled. Tag 151 (LeavesQty) = quantité restante = 40. Tag 14 (CumQty) = quantité cumulée exécutée = 60. C'est donc un fill partiel sur un ordre AAPL.",
    },
    {
      question:
        "[FIX - Décodage] Un client envoie un message avec MsgSeqNum (34) = 105, mais le dernier numéro reçu par le serveur était 102. Que doit-il se passer ?",
      options: [
        "Le message 105 est automatiquement renuméroté en 103",
        "La session FIX est immédiatement et définitivement fermée sans possibilité de reprise",
        "Le serveur ignore silencieusement le trou et traite le message 105 normalement",
        "Le serveur envoie un ResendRequest(2) pour demander les messages 103 et 104 manquants avant de traiter 105",
      ],
      answer: "Le serveur envoie un ResendRequest(2) pour demander les messages 103 et 104 manquants avant de traiter 105",
      explanation:
        "Le contrôle de séquence FIX détecte le trou (103, 104 manquants) et déclenche un ResendRequest pour garantir qu'aucun message n'est perdu avant de continuer le traitement normal du flux.",
    },
    {
      question:
        "[FIX - Décodage] Quelle est la différence entre `OrderCancelRequest (F)` et `OrderCancelReplaceRequest (G)` ?",
      options: [
        "G ne peut être utilisé que pour les ordres au marché",
        "F sert à créer un ordre, G à le supprimer",
        "F et G font exactement la même chose",
        "F annule complètement l'ordre, G modifie un ordre existant (ex: changer le prix ou la quantité) sans l'annuler",
      ],
      answer: "F annule complètement l'ordre, G modifie un ordre existant (ex: changer le prix ou la quantité) sans l'annuler",
      explanation:
        "OrderCancelRequest (F) demande l'annulation totale de l'ordre. OrderCancelReplaceRequest (G), aussi appelé 'Cancel/Replace', permet de modifier certains paramètres (prix, quantité) d'un ordre déjà en marché sans perdre sa priorité totalement.",
    },
  ],

  expert: [
    // ==================== SECTION G: SCENARIOS COMBINES ====================
    {
      question:
        "[Scénario combiné] Un trader passe un ordre depuis l'interface web de l'OMS. L'ordre part vers le marché, puis le statut doit s'afficher en direct sur l'écran du trader. Quelle chaîne de protocoles est la plus cohérente ?",
      options: [
        "Web → WebSocket vers l'OMS → SOAP vers le marché → REST pour le statut",
        "Web → SOAP vers l'OMS → REST vers le marché → FIX pour le statut",
        "Web → FIX vers l'OMS → WebSocket vers le marché → SOAP pour le statut",
        "Web → REST vers l'OMS → FIX vers le marché → WebSocket pour pousser le statut au trader",
      ],
      answer: "Web → REST vers l'OMS → FIX vers le marché → WebSocket pour pousser le statut au trader",
      explanation:
        "L'app web moderne communique en REST avec l'OMS. L'OMS envoie ensuite l'ordre au marché via FIX (protocole d'ordres). Enfin, l'OMS pousse la mise à jour de statut au trader via WebSocket (temps réel), plutôt que de faire du polling REST.",
    },
    {
      question:
        "[Scénario combiné] L'OMS doit vérifier l'identité d'un client auprès d'un vieux système KYC datant de 2008, avant d'accepter un ordre reçu en FIX. Quel protocole utilise-t-on probablement pour cette vérification ?",
      options: [
        "Aucun protocole n'est nécessaire, l'OMS accède directement à la base de données",
        "FIX, car c'est le seul protocole disponible en finance",
        "WebSocket, car il faut une réponse en temps réel",
        "SOAP, car les vieux systèmes d'entreprise de cette époque exposent typiquement des services avec contrat WSDL",
      ],
      answer: "SOAP, car les vieux systèmes d'entreprise de cette époque exposent typiquement des services avec contrat WSDL",
      explanation:
        "Un système KYC legacy de 2008 est un candidat typique pour une interface SOAP : c'était le standard d'interopérabilité d'entreprise à cette époque, avec contrat WSDL et souvent des exigences de sécurité WS-Security.",
    },
    {
      question:
        "[Scénario combiné] Pourquoi ne diffuse-t-on généralement PAS les cours de marché (market data) via une API REST classique ?",
      options: [
        "Parce que REST ne peut pas être utilisé en HTTPS",
        "Parce que les cours de marché doivent obligatoirement être en XML",
        "Parce que REST ne supporte pas le format JSON pour les prix",
        "Parce que REST est un modèle pull, inadapté à un flux de données qui change en continu ; WebSocket (push) est bien plus efficace",
      ],
      answer: "Parce que REST est un modèle pull, inadapté à un flux de données qui change en continu ; WebSocket (push) est bien plus efficace",
      explanation:
        "Faire du polling REST pour des cours qui bougent plusieurs fois par seconde générerait une charge énorme et une latence inacceptable. WebSocket permet au serveur de pousser chaque tick dès qu'il survient.",
    },

    // ==================== SECTION H: BUGS DANS DU CODE MIXTE ====================
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce code C# ?\n\n```csharp\nvar response = await client.PostAsJsonAsync(\"orders\", request);\nvar order = await response.Content.ReadFromJsonAsync<OrderDto>();\nif (order.Status == \"REJECTED\") { ... }\n```",
      options: [
        "ReadFromJsonAsync ne fonctionne que pour les requêtes GET",
        "PostAsJsonAsync ne peut pas être utilisé avec await",
        "Il n'y a aucun problème, le code est correct",
        "Il manque un `response.EnsureSuccessStatusCode()` (ou vérification équivalente) avant de lire le contenu — en cas d'erreur HTTP, order peut être null ou invalide",
      ],
      answer: "Il manque un `response.EnsureSuccessStatusCode()` (ou vérification équivalente) avant de lire le contenu — en cas d'erreur HTTP, order peut être null ou invalide",
      explanation:
        "Si le serveur répond 400/500, le body ne contiendra pas un OrderDto valide et la désérialisation échouera ou renverra un objet incohérent. Il faut vérifier le code de statut (EnsureSuccessStatusCode ou IsSuccessStatusCode) avant de traiter la réponse.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans ce code d'appel SOAP ?\n\n```csharp\nvar content = new StringContent(xml, Encoding.UTF8, \"text/xml\");\nvar response = await httpClient.PostAsync(\"https://legacy.bank.com/OrderService.asmx\", content);\n```",
      options: [
        "text/xml n'est pas un content-type valide",
        "Il faut utiliser GET et non POST pour SOAP",
        "StringContent ne peut pas envoyer du XML",
        "Il manque le header SOAPAction, souvent requis par le serveur pour identifier l'opération SOAP appelée",
      ],
      answer: "Il manque le header SOAPAction, souvent requis par le serveur pour identifier l'opération SOAP appelée",
      explanation:
        "De nombreux services SOAP (notamment ASMX .NET) exigent un header SOAPAction indiquant quelle opération du contrat WSDL est invoquée. Sans lui, le serveur peut rejeter la requête ou ne pas savoir quelle méthode exécuter.",
    },
    {
      question:
        "[Bug à repérer] Quel est le problème dans cette boucle de réception WebSocket ?\n\n```csharp\nwhile (true)\n{\n    var result = await client.ReceiveAsync(buffer, CancellationToken.None);\n    var tick = JsonSerializer.Deserialize<PriceTick>(Encoding.UTF8.GetString(buffer, 0, result.Count));\n}\n```",
      options: [
        "Deserialize doit obligatoirement être appelé de façon synchrone",
        "ReceiveAsync ne peut pas être utilisé dans une boucle while",
        "Aucun problème, le code est parfaitement robuste en production",
        "Il n'y a aucune gestion de la déconnexion (WebSocketState.Closed) ni de reconnexion automatique, ni de CancellationToken réel pour arrêter proprement la boucle",
      ],
      answer: "Il n'y a aucune gestion de la déconnexion (WebSocketState.Closed) ni de reconnexion automatique, ni de CancellationToken réel pour arrêter proprement la boucle",
      explanation:
        "En production, il faut vérifier l'état du socket (client.State == WebSocketState.Open), gérer les messages de type Close, implémenter une logique de reconnexion en cas de coupure, et utiliser un vrai CancellationToken plutôt que CancellationToken.None.",
    },
    {
      question:
        "[Bug à repérer] Dans ce pseudo-code d'envoi FIX, quel élément critique manque ?\n\n```csharp\nvar order = new NewOrderSingle(new ClOrdID(orderId), new Side(side),\n    new TransactTime(DateTime.UtcNow), new OrdType(OrdType.LIMIT));\norder.Symbol = new Symbol(\"AAPL\");\norder.OrderQty = new OrderQty(100);\nSession.SendToTarget(order, sessionId);\n```",
      options: [
        "SendToTarget ne peut être appelé qu'une seule fois par session",
        "TransactTime doit toujours être en heure locale, jamais en UTC",
        "Le ClOrdID ne devrait jamais être un GUID",
        "Le prix (Price, tag 44) n'est pas défini alors que OrdType=LIMIT l'exige — l'ordre sera probablement rejeté",
      ],
      answer: "Le prix (Price, tag 44) n'est pas défini alors que OrdType=LIMIT l'exige — l'ordre sera probablement rejeté",
      explanation:
        "Un ordre à cours limité (OrdType.LIMIT) doit obligatoirement porter un Price (tag 44). Sans lui, le message est structurellement incomplet et sera très probablement rejeté par le broker ou le marché.",
    },

    // ==================== SECTION I: COMPARAISONS APPROFONDIES ====================
    {
      question:
        "[Comparaison] Un ordre FIX rejeté (OrdStatus=8) et une réponse REST 400 Bad Request jouent un rôle similaire. Quelle nuance les distingue malgré tout ?",
      options: [
        "FIX ne peut jamais rejeter un ordre, uniquement l'annuler",
        "REST 400 signifie toujours une erreur réseau, jamais une erreur métier",
        "Elles sont strictement identiques dans tous les cas d'usage",
        "Le rejet FIX (35=8, 39=8) reste un message applicatif métier échangé DANS une session déjà établie, alors qu'un 400 REST est une réponse au niveau du protocole de transport HTTP pour CETTE requête précise",
      ],
      answer: "Le rejet FIX (35=8, 39=8) reste un message applicatif métier échangé DANS une session déjà établie, alors qu'un 400 REST est une réponse au niveau du protocole de transport HTTP pour CETTE requête précise",
      explanation:
        "En FIX, le rejet d'ordre est un message métier (ExecutionReport avec OrdStatus=Rejected) circulant dans une session déjà ouverte et durable. En REST, chaque requête HTTP est indépendante et le code 400 est une réponse ponctuelle au niveau transport, sans notion de session persistante.",
    },
    {
      question:
        "[Comparaison] Pourquoi dit-on que FIX et WebSocket sont tous deux 'stateful', mais pour des raisons différentes ?",
      options: [
        "Aucun des deux n'est réellement stateful",
        "FIX est stateful car il utilise XML, WebSocket car il utilise JSON",
        "Les deux sont stateful pour exactement la même raison technique",
        "FIX est stateful à cause du contrôle de séquence (MsgSeqNum) sur une session logique ; WebSocket est stateful car il maintient une connexion réseau ouverte en continu",
      ],
      answer: "FIX est stateful à cause du contrôle de séquence (MsgSeqNum) sur une session logique ; WebSocket est stateful car il maintient une connexion réseau ouverte en continu",
      explanation:
        "FIX maintient un état logique de session (numérotation, heartbeat, capacité de resynchronisation même après reconnexion TCP). WebSocket, lui, est stateful essentiellement parce que la connexion réseau elle-même reste ouverte tant que la session dure.",
    },
    {
      question: "[Comparaison] Un système Drop Copy en FIX sert à quoi dans une architecture de trading ?",
      options: [
        "À remplacer totalement le protocole WebSocket",
        "À sauvegarder le code source de l'application FIX",
        "À copier-coller manuellement les ordres dans un tableur",
        "À dupliquer le flux des exécutions vers le middle/back-office, sans que ce dernier participe activement au trading",
      ],
      answer: "À dupliquer le flux des exécutions vers le middle/back-office, sans que ce dernier participe activement au trading",
      explanation:
        "Le Drop Copy est une session FIX en lecture seule qui reçoit une copie de tous les messages d'exécution, permettant au middle-office et au back-office de suivre l'activité de trading pour la comptabilité, le contrôle des risques et le règlement-livraison, sans jamais émettre d'ordres eux-mêmes.",
    },
  ],
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
        ? <h3 className="success">🚀 Excellent ! Protocoles de trading maîtrisés.</h3>
        : <p className="fail">📚 Révisez le cycle de vie des ordres FIX et la synthèse comparative.</p>
      }
    </div>
  );
};

const MarketProtocolsQCM = () => {
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
            Protocoles Finance de Marché 🔹 {level === "basic"
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

export default MarketProtocolsQCM;
