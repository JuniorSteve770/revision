// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// https://www.youtube.com/watch?v=s9Qh9fWeOAk

const basicSlides = [
{
    "question": "Qu’est-ce que l’architecture client-serveur et comment le DNS permet-il au client de localiser un serveur ?",
    "answer": "📡 Le modèle client-serveur repose sur un client (navigateur/app) qui envoie une requête à un serveur en écoute. Le DNS (Domain Name System) convertit les noms lisibles (ex: google.com) en adresses IP pour localiser le serveur cible. Exemple : accéder à un site web depuis un navigateur passe par une requête DNS."
  },
  {
    "question": "Quelle est la différence entre proxy et reverse proxy, et quel est leur rôle dans un réseau ?",
    "answer": "🔁 Le proxy protège le client (anonymat, filtrage), tandis que le reverse proxy protège les serveurs (distribution des requêtes, sécurité, caching). Il redirige les requêtes entrantes vers le bon serveur backend selon des règles définies (ex: load balancing)."
  },
  {
    "question": "Qu’est-ce que la latence réseau et comment un CDN permet-il de la réduire ?",
    "answer": "⏱ La latence est le temps entre la requête d’un client et la réponse du serveur, influencée par la distance et la charge. 🌍 Un CDN (Content Delivery Network) réduit la latence en servant les fichiers (images, vidéos, scripts) depuis des nœuds proches de l’utilisateur."
  },
  {
    "question": "Quelle est la différence entre HTTP et HTTPS et pourquoi est-elle cruciale pour la sécurité ?",
    "answer": "🔐 HTTPS chiffre les échanges via SSL/TLS, empêchant leur interception, contrairement à HTTP. Indispensable pour les données sensibles (ex: formulaires de paiement)."
  },
  {
    "question": "Quel est le rôle d’un API Gateway et en quoi REST facilite-t-il la structuration des échanges ?",
    "answer": "🛡 L'API Gateway centralise les requêtes vers les microservices (authentification, sécurité, contrôle). 🧱 REST structure les API autour de ressources et utilise des verbes HTTP standards (GET, POST, PUT, DELETE), en mode stateless."
  },
  {
    "question": "Pourquoi GraphQL est-il souvent préféré à REST dans les interfaces complexes ?",
    "answer": "🎯 GraphQL permet aux clients de demander exactement les champs nécessaires, en une seule requête, réduisant la surcharge réseau. Exemple : récupérer un utilisateur et ses posts récents en un seul appel."
  },
  {
    "question": "Comment fonctionne le cache-aside et quel est le rôle du TTL dans cette stratégie ?",
    "answer": "⚡️ Le cache-aside vérifie d’abord le cache (ex: Redis), puis la base, puis stocke le résultat. ⏳ Le TTL (Time To Live) fixe combien de temps la donnée reste dans le cache, évitant les données obsolètes. Exemple : taux de change mis en cache pour 10 minutes."
  },
  {
    "question": "Comment l’indexation et la réplication améliorent-elles les performances d'une base de données ?",
    "answer": "📚 L’indexation crée des pointeurs vers les données sur des colonnes fréquentes, accélérant les lectures. 🔁 La réplication duplique la base principale vers des réplicas en lecture seule pour répartir la charge et assurer la continuité en cas de panne."
  },
  {
    "question": "Qu’est-ce que le sharding et en quoi diffère-t-il de la scalabilité verticale ?",
    "answer": "⚙️ Le sharding divise horizontalement les données (ex: par ID utilisateur) sur plusieurs serveurs. 🌆 La scalabilité verticale augmente les ressources d’un seul serveur, tandis que l’horizontale (sharding) répartit la charge sur plusieurs machines."
  },
  {
    "question": "Quel est le rôle d’un Load Balancer et comment aide-t-il à répartir la charge ?",
    "answer": "🔀 Le Load Balancer distribue intelligemment les requêtes entre plusieurs serveurs backend selon des algorithmes (round-robin, least connections), assurant performance et résilience."
  },
  {
    "question": "Quelle est la différence entre WebSocket et Webhook dans les communications temps réel ?",
    "answer": "🔄 WebSocket : connexion persistante et bidirectionnelle pour les apps temps réel (ex: chat, trading). 🔔 Webhook : notification automatique d’un serveur vers un autre lors d’un événement (ex: confirmation de paiement Stripe)."
  },
  {
    "question": "Qu’exprime le théorème CAP dans un système distribué et quels compromis implique-t-il ?",
    "answer": "⚖️ CAP : un système distribué ne peut garantir simultanément la Cohérence (C), la Disponibilité (A) et la Tolérance au Partitionnement (P). Il faut choisir deux sur trois selon les priorités du système."
  },
  {
    "question": "Pourquoi utilise-t-on une Message Queue et comment elle améliore la résilience des microservices ?",
    "answer": "📨 Une Message Queue (ex: Kafka, RabbitMQ) permet aux services de communiquer de façon asynchrone et non bloquante, évitant les appels directs et favorisant la tolérance aux pannes et pics de trafic."
  },
  {
    "question": "Qu’est-ce que l’idempotence et pourquoi est-elle critique pour les appels API sensibles ?",
    "answer": "✅ Une opération est idempotente si elle produit le même résultat même si elle est répétée. Essentiel pour éviter les effets secondaires comme un double paiement sur rafraîchissement de page."
  },
  {
    "question": "Pourquoi mettre en place un rate limiting dans une architecture web ?",
    "answer": "🚫 Le rate limiting limite le nombre de requêtes par utilisateur/IP dans un intervalle (ex: 100/min) pour éviter les abus ou attaques. Algorithmes : Token Bucket, Fixed Window, Sliding Window."
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

    {
    "question": "Quel est le rôle principal d'un serveur dans une architecture client-serveur ?",
    "options": [
      "Contrôler les DNS publics",
      "Effectuer des requêtes vers le client",
      "Attendre et répondre aux requêtes du client",
      "Générer des adresses IP pour les clients"
    ],
    "answer": "Attendre et répondre aux requêtes du client",
    "explanation": "Dans l’architecture client-serveur, le serveur reste actif pour répondre aux requêtes entrantes des clients comme les navigateurs ou applications."
  },
  {
    "question": "Pourquoi utilise-t-on un DNS ?",
    "options": [
      "Pour sécuriser les communications HTTP",
      "Pour convertir une adresse IP en nom de domaine",
      "Pour attribuer des ports aux serveurs",
      "Pour résoudre un nom de domaine en adresse IP"
    ],
    "answer": "Pour résoudre un nom de domaine en adresse IP",
    "explanation": "Le DNS traduit les noms de domaine en adresses IP afin que les clients puissent localiser les serveurs sur Internet."
  },
  {
    "question": "Quelle différence majeure distingue un proxy d’un reverse proxy ?",
    "options": [
      "Le reverse proxy chiffre les données, le proxy non",
      "Le proxy protège les serveurs, le reverse proxy protège les clients",
      "Le proxy relaie les requêtes du client, le reverse proxy les requêtes vers les serveurs",
      "Le proxy est utilisé uniquement en local"
    ],
    "answer": "Le proxy relaie les requêtes du client, le reverse proxy les requêtes vers les serveurs",
    "explanation": "Le proxy agit pour le client, tandis que le reverse proxy est placé devant les serveurs pour gérer le trafic entrant."
  },
  {
    "question": "Quel est le principal objectif d’un CDN ?",
    "options": [
      "Accélérer les traitements SQL",
      "Chiffrer les communications",
      "Réduire la latence via la distribution géographique",
      "Filtrer les paquets réseau"
    ],
    "answer": "Réduire la latence via la distribution géographique",
    "explanation": "Un CDN sert les contenus statiques à partir de serveurs proches de l’utilisateur final, réduisant ainsi la latence."
  },
  {
    "question": "Que permet le protocole HTTPS par rapport à HTTP ?",
    "options": [
      "Plus de vitesse",
      "Compression des réponses",
      "Chiffrement des données échangées",
      "Passage automatique via CDN"
    ],
    "answer": "Chiffrement des données échangées",
    "explanation": "HTTPS ajoute une couche de sécurité en chiffrant les données via SSL/TLS pour protéger les communications entre client et serveur."
  },
  {
    "question": "À quoi sert une API Gateway dans une architecture microservices ?",
    "options": [
      "À héberger les bases de données",
      "À effectuer le load balancing uniquement",
      "À centraliser l’authentification, le routage et la surveillance des appels API",
      "À stocker les fichiers volumineux"
    ],
    "answer": "À centraliser l’authentification, le routage et la surveillance des appels API",
    "explanation": "L’API Gateway gère les appels clients, applique la sécurité, la journalisation et répartit les requêtes vers les bons microservices."
  },
  {
    "question": "Quelle propriété caractérise les API REST ?",
    "options": [
      "Stateless et orientées ressource",
      "Basées sur WebSocket",
      "Utilisent toujours GraphQL",
      "Couplées à une seule base NoSQL"
    ],
    "answer": "Stateless et orientées ressource",
    "explanation": "Les APIs REST sont sans état (stateless) et utilisent les verbes HTTP pour manipuler des ressources (GET, POST, etc.)."
  },
  {
    "question": "Quel est le principal avantage de GraphQL par rapport à REST ?",
    "options": [
      "La suppression automatique du cache",
      "L’obligation d’utiliser XML",
      "La possibilité de demander exactement les données nécessaires",
      "L’usage unique dans les bases SQL"
    ],
    "answer": "La possibilité de demander exactement les données nécessaires",
    "explanation": "GraphQL permet au client de spécifier les champs à retourner, ce qui optimise les performances et réduit le surcoût réseau."
  },
  {
    "question": "Quel est le rôle du cache dans une architecture web ?",
    "options": [
      "Sauvegarder les bases de données",
      "Répliquer les serveurs",
      "Accélérer l’accès aux données fréquemment demandées",
      "Créer des adresses IP temporaires"
    ],
    "answer": "Accélérer l’accès aux données fréquemment demandées",
    "explanation": "Le cache permet de stocker temporairement les données afin de réduire les temps de réponse et la charge sur les bases de données."
  },
  {
    "question": "À quoi sert le TTL (Time To Live) dans le cache ?",
    "options": [
      "Bloquer les utilisateurs inactifs",
      "Limiter le nombre de requêtes",
      "Définir combien de temps une donnée reste dans le cache",
      "Gérer la réplication"
    ],
    "answer": "Définir combien de temps une donnée reste dans le cache",
    "explanation": "Le TTL permet d’éviter que le cache ne renvoie des données périmées en fixant une durée de validité."
  },
  {
    "question": "Qu’est-ce que l’indexation en base de données ?",
    "options": [
      "Sauvegarde automatique de la base",
      "Duplication des données",
      "Optimisation de la lecture via un pointeur sur colonnes clés",
      "Mise à jour automatique des relations"
    ],
    "answer": "Optimisation de la lecture via un pointeur sur colonnes clés",
    "explanation": "L’index permet de retrouver plus rapidement les lignes concernées sans balayer toute la table."
  },
  {
    "question": "Pourquoi utiliser la réplication en base de données ?",
    "options": [
      "Pour écrire plus rapidement",
      "Pour supprimer les sauvegardes",
      "Pour améliorer la lecture et la tolérance aux pannes",
      "Pour ajouter un CDN"
    ],
    "answer": "Pour améliorer la lecture et la tolérance aux pannes",
    "explanation": "La réplication crée des copies de la base pour répartir les lectures et prendre le relais en cas de panne du serveur principal."
  },
  {
    "question": "Qu’est-ce que le sharding ?",
    "options": [
      "Compression des bases SQL",
      "Partitionnement horizontal des données sur plusieurs serveurs",
      "Envoi de logs vers un CDN",
      "Définition d’un TTL automatique"
    ],
    "answer": "Partitionnement horizontal des données sur plusieurs serveurs",
    "explanation": "Le sharding consiste à diviser les données en fragments (shards) selon une clé (ex: ID client) pour répartir la charge."
  },
  {
    "question": "Quand préfère-t-on la scalabilité horizontale à la verticale ?",
    "options": [
      "Quand les bases sont trop petites",
      "Quand on souhaite réduire les performances",
      "Quand un serveur atteint ses limites physiques",
      "Quand on veut éviter HTTPS"
    ],
    "answer": "Quand un serveur atteint ses limites physiques",
    "explanation": "La scalabilité horizontale permet d’ajouter plusieurs machines pour gérer une charge croissante, au contraire de la verticale."
  },
  {
    "question": "Quel est le rôle d’un load balancer ?",
    "options": [
      "Créer un cache pour le client",
      "Répandre la charge entre plusieurs serveurs backend",
      "Générer des adresses IP aléatoires",
      "Superviser les bases NoSQL"
    ],
    "answer": "Répandre la charge entre plusieurs serveurs backend",
    "explanation": "Un load balancer distribue intelligemment les requêtes pour éviter la surcharge d’un seul serveur."
  },
  {
    "question": "Quel protocole permet une communication bidirectionnelle en temps réel ?",
    "options": [
      "HTTPS",
      "WebSocket",
      "DNS",
      "REST"
    ],
    "answer": "WebSocket",
    "explanation": "WebSocket établit une connexion persistante qui permet au serveur d’envoyer des données au client sans requête active."
  },
  {
    "question": "Quel mécanisme permet à un service de notifier un autre service lorsqu’un événement survient ?",
    "options": [
      "GraphQL",
      "Polling",
      "Webhook",
      "Load Balancer"
    ],
    "answer": "Webhook",
    "explanation": "Le webhook permet une notification automatique sans devoir interroger régulièrement l’autre service (contrairement au polling)."
  },
  {
    "question": "Que dit le théorème CAP ?",
    "options": [
      "On peut tout avoir : performance, sécurité et latence",
      "On ne peut pas garantir en même temps cohérence, disponibilité et tolérance aux pannes réseau",
      "Les bases SQL ne peuvent pas être scalables",
      "Chaque microservice doit avoir son API Gateway"
    ],
    "answer": "On ne peut pas garantir en même temps cohérence, disponibilité et tolérance aux pannes réseau",
    "explanation": "Le théorème CAP impose un compromis dans les systèmes distribués entre 3 propriétés fondamentales."
  },
  {
    "question": "Pourquoi utilise-t-on une Message Queue ?",
    "options": [
      "Pour relier deux bases SQL",
      "Pour stocker des images",
      "Pour décorréler le producteur du consommateur",
      "Pour enregistrer les sessions utilisateur"
    ],
    "answer": "Pour décorréler le producteur du consommateur",
    "explanation": "La file de message permet une communication asynchrone où le producteur n’attend pas que le message soit traité."
  },
  ],
  avance: [
     {
    "question": "Quel est le but du rate limiting ?",
    "options": [
      "Ajouter des Webhooks",
      "Améliorer la réplication",
      "Limiter les abus et protéger les services contre la surcharge",
      "Répliquer les API Gateways"
    ],
    "answer": "Limiter les abus et protéger les services contre la surcharge",
    "explanation": "Le rate limiting empêche un utilisateur ou un bot d’envoyer trop de requêtes et de nuire à la performance du système."
  },
  {
    "question": "Que signifie l’idempotence dans une API ?",
    "options": [
      "Chaque requête doit avoir un cache",
      "Les requêtes POST doivent être aléatoires",
      "Une requête répétée produit le même résultat sans effet secondaire",
      "La base NoSQL est figée"
    ],
    "answer": "Une requête répétée produit le même résultat sans effet secondaire",
    "explanation": "C’est essentiel pour éviter les doublons en cas de rechargement ou d’échec de communication (ex: paiement)."
  },
  {
    "question": "Quel type de stockage est adapté aux images et vidéos volumineuses ?",
    "options": [
      "Base SQL",
      "CDN",
      "Blob Storage",
      "API REST"
    ],
    "answer": "Blob Storage",
    "explanation": "Le Blob Storage (ex : Amazon S3) permet de stocker de grands fichiers non structurés avec un accès rapide via URL."
  },
  {
    "question": "Quel type d’API est le plus adapté pour une application mobile qui nécessite peu de données bien ciblées ?",
    "options": [
      "REST",
      "GraphQL",
      "WebSocket",
      "SOAP"
    ],
    "answer": "GraphQL",
    "explanation": "GraphQL permet de récupérer uniquement les données nécessaires, ce qui optimise la bande passante et la batterie côté mobile."
  },
  {
    "question": "Pourquoi préfère-t-on souvent dénormaliser certaines tables en lecture intensive ?",
    "options": [
      "Pour réduire la taille des tables",
      "Pour éviter les index",
      "Pour éviter les jointures coûteuses",
      "Pour améliorer l’authentification"
    ],
    "answer": "Pour éviter les jointures coûteuses",
    "explanation": "Dénormaliser consiste à regrouper les données souvent accédées ensemble, ce qui accélère les requêtes."
  },
  {
    "question": "Lors d’un entretien, on vous demande d’optimiser un site web lent pour les utilisateurs internationaux. Que proposez-vous en priorité ?",
    "options": [
      "Augmenter le TTL des cookies",
      "Ajouter des serveurs plus puissants dans un datacenter",
      "Intégrer un CDN pour rapprocher les contenus statiques des utilisateurs",
      "Migrer toute l’application vers une base NoSQL"
    ],
    "answer": "Intégrer un CDN pour rapprocher les contenus statiques des utilisateurs",
    "explanation": "Un CDN réduit significativement la latence en servant les ressources statiques à partir de nœuds géographiquement proches des utilisateurs."
  },
  {
    "question": "Vous devez concevoir une API destinée à des services front-end variés (mobile, web, dashboard). Quelle technologie est la plus adaptée ?",
    "options": [
      "REST avec JSON",
      "SOAP avec XML",
      "GraphQL",
      "FTP"
    ],
    "answer": "GraphQL",
    "explanation": "GraphQL est particulièrement adapté lorsque les clients ont des besoins de données différents : il permet de spécifier exactement les champs nécessaires."
  },
  {
    "question": "En entretien, on vous interroge sur la cohérence dans un système distribué. Que signifie 'consistency' dans le théorème CAP ?",
    "options": [
      "Chaque nœud est disponible 24h/24",
      "Tous les nœuds voient les mêmes données en même temps",
      "Les messages sont toujours ordonnés",
      "La base est sauvegardée toutes les heures"
    ],
    "answer": "Tous les nœuds voient les mêmes données en même temps",
    "explanation": "Dans CAP, 'Consistency' signifie qu’après un succès d’écriture, toutes les lectures suivantes retournent la même donnée à travers tous les nœuds."
  },
  {
    "question": "Un recruteur vous demande comment vous gérez un trafic API qui explose temporairement. Que recommandez-vous ?",
    "options": [
      "Refuser toutes les requêtes",
      "Passer sur une base SQL plus rapide",
      "Mettre en place un système de rate limiting et un cache",
      "Recompiler le backend"
    ],
    "answer": "Mettre en place un système de rate limiting et un cache",
    "explanation": "Le rate limiting protège les ressources, tandis que le cache soulage les bases en servant les données fréquentes plus rapidement."
  },
  {
    "question": "Quelle solution privilégier pour rendre un système hautement disponible même en cas de panne réseau entre datacenters ?",
    "options": [
      "Base unique centralisée",
      "Load balancer régional sans réplication",
      "Architecture multi-région avec tolérance au partitionnement",
      "API REST stateless dans un monolithe"
    ],
    "answer": "Architecture multi-région avec tolérance au partitionnement",
    "explanation": "Pour la haute disponibilité, il faut répliquer les services sur plusieurs régions avec des systèmes capables de fonctionner en partition."
  },
  {
    "question": "Dans une architecture microservices, pourquoi recommande-t-on d’utiliser une file de message comme Kafka ?",
    "options": [
      "Pour interroger les bases de données directement",
      "Pour synchroniser les caches",
      "Pour permettre une communication asynchrone entre services",
      "Pour empêcher les erreurs HTTP"
    ],
    "answer": "Pour permettre une communication asynchrone entre services",
    "explanation": "Les files de messages permettent de découpler les services et d’absorber les pics de charge sans blocage entre producteurs et consommateurs."
  },
  {
    "question": "Un entretien technique vous demande d'expliquer pourquoi une base SQL avec schéma strict peut poser problème à grande échelle. Que répondez-vous ?",
    "options": [
      "Parce que SQL est trop lent en général",
      "Car les schémas rigides limitent l’évolution rapide des données et nuisent à la flexibilité",
      "Parce que la syntaxe est trop complexe",
      "Parce que les bases SQL n’indexent pas les données"
    ],
    "answer": "Car les schémas rigides limitent l’évolution rapide des données et nuisent à la flexibilité",
    "explanation": "Dans les applications en évolution rapide, les bases NoSQL offrent une flexibilité de schéma supérieure, facilitant les changements de structure."
  },
  {
    "question": "Comment garantir qu’un appel API ne soit pas exécuté deux fois accidentellement (ex: double paiement) ?",
    "options": [
      "Utiliser WebSocket",
      "Ajouter une clé idempotente à chaque requête",
      "Limiter les appels à 1 requête par IP",
      "Passer à GraphQL"
    ],
    "answer": "Ajouter une clé idempotente à chaque requête",
    "explanation": "L’idempotence garantit qu’un appel répété ne produit pas d’effet secondaire. On identifie les requêtes uniques avec une clé idempotente."
  },
  {
    "question": "Vous êtes face à une API lente dont les requêtes lisent des données rarement mises à jour. Quelle solution prioritaire proposez-vous ?",
    "options": [
      "Remplacer REST par GraphQL",
      "Réécrire l’application en C++",
      "Mettre en cache les réponses les plus fréquentes",
      "Désactiver la pagination"
    ],
    "answer": "Mettre en cache les réponses les plus fréquentes",
    "explanation": "Mettre en cache les résultats de lecture permet d’éviter des accès redondants à la base de données et d’améliorer les temps de réponse."
  },
  {
    "question": "Comment réagir si un serveur principal (primary DB) tombe dans un système avec réplication ?",
    "options": [
      "Redémarrer la machine",
      "Promouvoir une réplique en nouveau master",
      "Réinstaller la base",
      "Attendre la synchronisation manuelle"
    ],
    "answer": "Promouvoir une réplique en nouveau master",
    "explanation": "Une bonne architecture de réplication permet à une réplique de devenir la nouvelle base principale pour garantir la continuité du service."
  }
   
  ]
};


// Timer
const Timer = ({ timeLeft }) => (
  <p className="timer">⏳ Temps restant : <span>{timeLeft}s</span></p>
);

// Composant QCM
const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option, index)} className="option-button">
          {String.fromCharCode(65 + index)}.{option}
        </button>
      ))}
    </div>
  </div>
);

// Composant Flashcard
const Flashcard = ({ slide, index, total }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    {/* <h5>🧠 Flashcard {index + 1} / {total}</h5> */}
    <strong>Question : </strong>
    
    <strong>
      <p>
        <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
          {slide.question}
        </code>
      </p>
    </strong>  
      <pre style={{ margin: '0', padding: '2px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
        <p>
          <strong>Réponse :</strong> {slide.answer}
        </p>
      </pre>
  </div>
);




// Composant Résultat
const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score final : {totalScore} / {totalQuestions}</h3>
      <p>✅ Niveau Moyen : {scores.moyen}</p>
      <p>✅ Niveau Avancé : {scores.avance}</p>
      {totalScore > 3 ? (
        <h3 className="success">🚀 Excellent travail ! Vous maîtrisez bien les Produits !</h3>
      ) : (
        <p className="fail">📚 Révisez encore un peu pour bien comprendre les concepts, ou retournez voir les flashcards !</p>
      )}
    </div>
  );
};

// Page principale
const Page1 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

  // Slide auto pour les flashcards
  useEffect(() => {
    if (level === "basic" && !showResult) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev + 1 < basicSlides.length) {
            return prev + 1;
          } else {
            setLevel("moyen");
            setCurrentQuestion(0);
            setTimeLeft(20);
            return 0;
          }
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [level, showResult]);

const handleAnswerClick = (option, index) => {
  const currentQuestions = questions[level];
  const current = currentQuestions[currentQuestion];
  const correctAnswer = current.answer;

  const isCorrect =
    /^[A-D]$/.test(correctAnswer) // Si c’est une lettre
      ? index === correctAnswer.charCodeAt(0) - 65
      : option === correctAnswer; // Sinon compare le texte

  if (isCorrect) {
    setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
    setMessage("✅ Correct !");
  } else {
    setMessage(`❌ Incorrect ! La bonne réponse était : ${correctAnswer}\n ℹ️ ${current.explanation}`);
  }

  setTimeout(handleNextQuestion, 2500);
};

  const handleNextQuestion = () => {
    const currentQuestions = questions[level];
    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20);
      setMessage("");
    } else {
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(20);
      setMessage("");
    }
  };

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0' }}>
              Fixed Inc! 🔹 Niveau : {level.toUpperCase()}
          </h4>

          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} index={currentSlide} total={basicSlides.length} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page1;
