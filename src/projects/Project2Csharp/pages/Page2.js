// src/projects/Project2/pages/Page2.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

   {
    "question": "Quelles nouveautés ont apporté .NET 3.0 et .NET 3.5 ?",
    "answer": " .NET 3.0 (2006) introduit **WPF** (UI), **WCF** (services), **WF** (workflow) et **CardSpace** (identité). 📊 .NET 3.5 (2007) apporte **LINQ** (requêtes intégrées au langage) et **ASP.NET AJAX** (web interactif)."
  },
  {
    "question": "Quelles évolutions ont marqué .NET 4.0 et .NET 4.5 ?",
    "answer": " .NET 4.0 (2010) introduit **PLINQ** et la **Task Parallel Library** pour le **parallélisme**. ⏳ .NET 4.5 (2012) intègre **async/await** et **Web API** pour les applis web modernes asynchrones."
  },
  {
    "question": "Quelle est la différence entre .NET Framework et .NET Core ?",
    "answer": "**.NET Framework** : pour applis Windows legacy, ❌ modulaire, ❌ open source. 🧩 **.NET Core** : multiplateforme (Win/Linux/mac), ✅ modulaire, ✅ open source. Usage : développement moderne avant .NET 5."
  },
  {
    "question": "Pourquoi .NET ≥ 5 est-il recommandé pour les projets récents ?",
    "answer": " **.NET 5 et suivants** unifient toutes les plateformes (desktop, web, mobile, cloud), sont **modulaires**, **open source**, **cross-platform**, et **recommandés** pour tout nouveau projet."
  },
   {
    "question": "Qu'est-ce que Git et pourquoi est-il indispensable dans le développement logiciel ?",
    "answer": " Git est un système de contrôle de version **distribué**. Il permet de suivre l’historique des modifications de code, collaborer avec d'autres développeurs via des **branches**, fusionner des versions avec **merge**, et expérimenter sans risquer le code principal. Exemple : un développeur crée une branche `feature-login`, code dessus, puis fusionne via une Pull Request. 🔑 Mots-clés : commit, branche, merge, revert, versioning distribué."
  },
  {
    "question": "Qu'est-ce qu'un pipeline CI/CD et pourquoi est-il essentiel ?",
    "answer": " Un pipeline CI/CD est une **chaîne automatisée** qui permet de tester, compiler, et déployer une application. CI = Continuous Integration : exécution de tests unitaires/linting à chaque commit. CD = Continuous Delivery/Deployment : déploiement automatique vers staging/production. Exemple : GitHub Actions déclenche un build et un test dès qu’un push est fait sur `main`. 🔑 Concepts : jobs, steps, runners, artefacts, stages."
  },
  {
    "question": "Quelle est la différence entre GitHub Actions et GitLab CI/CD ?",
    "answer": " GitHub Actions est un outil d’automatisation **intégré à GitHub**, utilisant des fichiers `.yml` dans `.github/workflows/`. GitLab CI/CD repose sur un fichier `.gitlab-ci.yml`, avec une vue pipeline intégrée. GitLab permet des étapes conditionnelles complexes, GitHub est plus simple à configurer pour les petits projets. 🔑 Mots-clés : déclencheur (`on: push`), runner, cache, matrix build."
  },
  {
    "question": "Quels sont les composants d’un workflow GitHub Actions ?",
    "answer": " Un workflow GitHub Actions est composé de : **events** (déclencheurs : push, PR, cron), **jobs** (unités d'exécution), **steps** (commandes), **actions** (réutilisables). Exemple : un job nommé `test` contient 3 steps : `checkout`, `install`, `run tests`. 🔑 Syntaxe : YAML, environnement GitHub-hosted, secrets pour les tokens."
  },
  {
    "question": "Qu'est-ce qu'une API REST et pourquoi est-elle largement utilisée ?",
    "answer": " Une **API REST** repose sur le protocole **HTTP** et suit des conventions : chaque ressource (ex: /users/12) est accessible via des **verbes** (GET, POST, PUT, DELETE). Elle est **stateless** : chaque requête contient toutes les informations nécessaires. Avantages : simple, lisible, compatible avec les navigateurs. Exemple : `GET /api/products` retourne une liste de produits au format JSON. 🔑 Mots-clés : endpoint, URI, stateless, JSON, status code HTTP."
  },
  {
    "question": "Quelles sont les différences fondamentales entre REST, SOAP et gRPC ?",
    "answer": " **REST** : HTTP + JSON, simple à consommer. **SOAP** : XML + WSDL, utilisé dans les systèmes anciens (banques, ERP). **gRPC** : HTTP/2 + Protobuf, très rapide et compact, idéal pour microservices internes. REST est mieux pour les APIs web publiques, gRPC pour l'interne haute performance. 🔑 Mots-clés : Protobuf, stateless, contrat, XML vs JSON, compatibilité navigateur."
  },
  {
    "question": "Pourquoi utiliser gRPC dans une architecture microservices ?",
    "answer": " gRPC utilise **HTTP/2** et **Protocol Buffers**, ce qui permet une **communication binaire rapide**, du **streaming** bidirectionnel et une **vérification forte des types**. Il est idéal dans un réseau d’entreprise entre microservices : login, panier, paiement. Exemple : `rpc Checkout (CartRequest) returns (PaymentStatus)` avec `.proto` généré automatiquement. 🔑 Concepts : stub, service definition, contract first, streaming."
  },
  {
    "question": "Qu’est-ce qu’un fichier .proto en gRPC et à quoi sert-il ?",
    "answer": " Le fichier `.proto` définit le contrat du service gRPC. Il décrit les messages (`message`) et les appels (`rpc`) de manière **typée et structurée**, ensuite compilé automatiquement pour générer du code client et serveur. 🔑 Exemple : `message User { int32 id = 1; string name = 2; }` suivi de `service UserService { rpc GetUser (UserRequest) returns (User); }`."
  },
   {
    "question": "Qu'est-ce que SQL et pourquoi est-il indispensable ?",
    "answer": " SQL est un **langage déclaratif** qui permet de manipuler des bases de données relationnelles. Il permet d’effectuer des requêtes (`SELECT`), insérer des données (`INSERT`), modifier (`UPDATE`) et supprimer (`DELETE`). Exemple : `SELECT name FROM clients WHERE pays = 'France';` 🔑 Concepts : table, colonne, ligne, schéma, CRUD."
  },
  {
    "question": "Qu'est-ce que le modèle relationnel dans une base de données ?",
    "answer": " Le modèle relationnel repose sur l'organisation des données en **tables**, liées entre elles par des **clés étrangères**. Chaque table représente une entité (ex: `users`, `orders`). 🔑 Avantage : cohérence, requêtes complexes avec `JOIN`, intégrité des données. Exemple : `orders.user_id` référence `users.id`."
  },
  {
    "question": "Que signifie le principe ACID dans les bases de données relationnelles ?",
    "answer": " ACID = **Atomicité** (tout ou rien), **Cohérence** (respect des règles), **Isolation** (pas de conflits entre transactions), **Durabilité** (les données sont persistantes même après crash). Cela garantit l'intégrité des transactions. Exemple : transfert bancaire entre deux comptes."
  },
  {
    "question": "Pourquoi PostgreSQL est-il souvent préféré à MySQL ou SQL Server ?",
    "answer": " PostgreSQL est **open source**, très **conforme au standard SQL**, offre des types avancés (JSON, géodonnées), des index efficaces, des vues matérialisées et un moteur transactionnel robuste. SQL Server est puissant mais propriétaire. 🔑 Usage : systèmes critiques, data warehouses, projets cloud-first."
  },
  {
    "question": "Quel est le rôle des index en SQL ?",
    "answer": " Un **index** améliore les performances de lecture en accélérant les recherches sur une ou plusieurs colonnes. Comparable à l’index d’un livre. Exemple : `CREATE INDEX idx_name ON clients(name);` 🔑 Types : B-tree (par défaut), Hash, GIN (PostgreSQL)."
  },


  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
   {
    "question": "Quel est le rôle principal de Git dans un projet logiciel ?",
    "options": [
      "Gérer les déploiements automatiques",
      "Assurer la sécurité du code source",
      "Suivre les modifications et versions du code",
      "Compiler les programmes"
    ],
    "answer": "Suivre les modifications et versions du code",
    "explanation": "Git est un système de versionnage distribué qui permet de suivre l’évolution du code, gérer des branches et fusionner les modifications en toute sécurité."
  },
  {
    "question": "Que signifie CI dans CI/CD ?",
    "options": [
      "Code Integration",
      "Continuous Integration",
      "Centralized Integration",
      "Checked Integration"
    ],
    "answer": "Continuous Integration",
    "explanation": "CI signifie 'Continuous Integration', un processus d’automatisation permettant de tester et valider du code à chaque modification dans le dépôt."
  },
  {
    "question": "Quel fichier déclenche les workflows dans GitHub Actions ?",
    "options": [
      ".gitlab-ci.yml",
      "docker-compose.yml",
      "workflow.json",
      ".github/workflows/*.yml"
    ],
    "answer": ".github/workflows/*.yml",
    "explanation": "Les workflows GitHub Actions sont définis dans des fichiers YAML placés dans le dossier `.github/workflows/`."
  },
  {
    "question": "Quel composant n'est pas propre à un pipeline CI/CD ?",
    "options": [
      "Jobs",
      "Branches",
      "Stages",
      "Runners"
    ],
    "answer": "Branches",
    "explanation": "Les branches appartiennent à Git, pas directement aux pipelines CI/CD qui se composent plutôt de jobs, stages et runners."
  },
  {
    "question": "Quelle est la différence entre GitHub Actions et GitLab CI/CD ?",
    "options": [
      "GitLab CI est uniquement pour Python",
      "GitHub Actions est propriétaire de GitLab",
      "GitHub Actions est intégré à GitHub, GitLab CI est intégré à GitLab",
      "GitHub Actions ne permet pas le déploiement"
    ],
    "answer": "GitHub Actions est intégré à GitHub, GitLab CI est intégré à GitLab",
    "explanation": "GitHub Actions fonctionne dans GitHub, tandis que GitLab CI/CD est natif de GitLab. Tous deux permettent tests et déploiement via des fichiers YAML."
  },
  {
    "question": "Quel format d'échange est utilisé par défaut dans une API REST ?",
    "options": [
      "YAML",
      "JSON",
      "Protobuf",
      "CSV"
    ],
    "answer": "JSON",
    "explanation": "Les APIs REST utilisent généralement le format JSON car il est léger, lisible et largement supporté."
  },
  {
    "question": "Qu’est-ce qu’une API stateless ?",
    "options": [
      "Qui utilise des identifiants",
      "Qui conserve l'état de session",
      "Qui n'a pas de sécurité",
      "Qui ne conserve pas l'état entre les requêtes"
    ],
    "answer": "Qui ne conserve pas l'état entre les requêtes",
    "explanation": "Une API stateless ne stocke pas d'informations de session ; chaque requête contient toutes les infos nécessaires à son traitement."
  },
  {
    "question": "Quel protocole est utilisé par gRPC ?",
    "options": [
      "HTTP/1.1",
      "SOAP",
      "HTTP/2",
      "FTP"
    ],
    "answer": "HTTP/2",
    "explanation": "gRPC utilise HTTP/2 pour permettre des communications rapides, bidirectionnelles et multiplexées entre services."
  },
  {
    "question": "Pourquoi utiliser gRPC plutôt que REST ?",
    "options": [
      "Car il est basé sur XML",
      "Car il est plus lent",
      "Pour des communications internes très rapides",
      "Pour remplacer SOAP"
    ],
    "answer": "Pour des communications internes très rapides",
    "explanation": "gRPC est optimisé pour des appels entre services internes grâce à HTTP/2 et Protobuf."
  },
  {
    "question": "Que contient un fichier .proto en gRPC ?",
    "options": [
      "Le code source du serveur",
      "La définition des routes REST",
      "La documentation API",
      "La définition des messages et services"
    ],
    "answer": "La définition des messages et services",
    "explanation": "Un fichier `.proto` définit les types de messages et les services (RPC) utilisés dans une application gRPC."
  }
  ],
  avance: [
    {
    "question": "Quel est le rôle principal de Git dans un projet logiciel ?",
    "options": [
      "Gérer les déploiements automatiques",
      "Assurer la sécurité du code source",
      "Suivre les modifications et versions du code",
      "Compiler les programmes"
    ],
    "answer": "Suivre les modifications et versions du code",
    "explanation": "Git est un système de versionnage distribué qui permet de suivre l’évolution du code, gérer des branches et fusionner les modifications en toute sécurité."
  },
  {
    "question": "Que signifie CI dans CI/CD ?",
    "options": [
      "Code Integration",
      "Continuous Integration",
      "Centralized Integration",
      "Checked Integration"
    ],
    "answer": "Continuous Integration",
    "explanation": "CI signifie 'Continuous Integration', un processus d’automatisation permettant de tester et valider du code à chaque modification dans le dépôt."
  },
  {
    "question": "Quel fichier déclenche les workflows dans GitHub Actions ?",
    "options": [
      ".gitlab-ci.yml",
      "docker-compose.yml",
      "workflow.json",
      ".github/workflows/*.yml"
    ],
    "answer": ".github/workflows/*.yml",
    "explanation": "Les workflows GitHub Actions sont définis dans des fichiers YAML placés dans le dossier `.github/workflows/`."
  },
  {
    "question": "Quel composant n'est pas propre à un pipeline CI/CD ?",
    "options": [
      "Jobs",
      "Branches",
      "Stages",
      "Runners"
    ],
    "answer": "Branches",
    "explanation": "Les branches appartiennent à Git, pas directement aux pipelines CI/CD qui se composent plutôt de jobs, stages et runners."
  },
  {
    "question": "Quelle est la différence entre GitHub Actions et GitLab CI/CD ?",
    "options": [
      "GitLab CI est uniquement pour Python",
      "GitHub Actions est propriétaire de GitLab",
      "GitHub Actions est intégré à GitHub, GitLab CI est intégré à GitLab",
      "GitHub Actions ne permet pas le déploiement"
    ],
    "answer": "GitHub Actions est intégré à GitHub, GitLab CI est intégré à GitLab",
    "explanation": "GitHub Actions fonctionne dans GitHub, tandis que GitLab CI/CD est natif de GitLab. Tous deux permettent tests et déploiement via des fichiers YAML."
  },
  {
    "question": "Quel format d'échange est utilisé par défaut dans une API REST ?",
    "options": [
      "YAML",
      "JSON",
      "Protobuf",
      "CSV"
    ],
    "answer": "JSON",
    "explanation": "Les APIs REST utilisent généralement le format JSON car il est léger, lisible et largement supporté."
  },
  {
    "question": "Qu’est-ce qu’une API stateless ?",
    "options": [
      "Qui utilise des identifiants",
      "Qui conserve l'état de session",
      "Qui n'a pas de sécurité",
      "Qui ne conserve pas l'état entre les requêtes"
    ],
    "answer": "Qui ne conserve pas l'état entre les requêtes",
    "explanation": "Une API stateless ne stocke pas d'informations de session ; chaque requête contient toutes les informations nécessaires."
  },
  {
    "question": "Quel protocole est utilisé par gRPC ?",
    "options": [
      "HTTP/1.1",
      "SOAP",
      "HTTP/2",
      "FTP"
    ],
    "answer": "HTTP/2",
    "explanation": "gRPC utilise HTTP/2 pour permettre des communications rapides, bidirectionnelles et multiplexées entre services."
  },
  {
    "question": "Pourquoi utiliser gRPC plutôt que REST ?",
    "options": [
      "Car il est basé sur XML",
      "Car il est plus lent",
      "Pour des communications internes très rapides",
      "Pour remplacer SOAP"
    ],
    "answer": "Pour des communications internes très rapides",
    "explanation": "gRPC est optimisé pour des appels entre services internes grâce à HTTP/2 et Protobuf."
  },
  {
    "question": "Que contient un fichier .proto en gRPC ?",
    "options": [
      "Le code source du serveur",
      "La définition des routes REST",
      "La documentation API",
      "La définition des messages et services"
    ],
    "answer": "La définition des messages et services",
    "explanation": "Un fichier `.proto` définit les types de messages et les services (RPC) utilisés dans une application gRPC."
  },
  {
    "question": "Qu'est-ce que SQL ?",
    "options": [
      "Un système de fichiers",
      "Un langage de programmation orienté objet",
      "Un langage pour interroger des bases de données relationnelles",
      "Un protocole réseau sécurisé"
    ],
    "answer": "Un langage pour interroger des bases de données relationnelles",
    "explanation": "SQL (Structured Query Language) est utilisé pour lire, insérer, mettre à jour et supprimer des données dans des bases relationnelles."
  },
  {
    "question": "Quel mot-clé SQL permet de joindre plusieurs tables ?",
    "options": [
      "MERGE",
      "COMBINE",
      "JOIN",
      "ATTACH"
    ],
    "answer": "JOIN",
    "explanation": "JOIN est utilisé pour combiner des lignes provenant de deux ou plusieurs tables, en utilisant une condition commune."
  },
  {
    "question": "Quel est l'intérêt de créer un index sur une colonne en SQL ?",
    "options": [
      "Gagner de l'espace disque",
      "Accélérer les requêtes de lecture",
      "Protéger la colonne contre les suppressions",
      "Ajouter des permissions utilisateur"
    ],
    "answer": "Accélérer les requêtes de lecture",
    "explanation": "Un index accélère les opérations de lecture en réduisant le nombre de lignes à scanner dans la table."
  },
  {
    "question": "Quel est le rôle de la clause WHERE dans une requête SQL ?",
    "options": [
      "Filtrer les lignes selon une condition",
      "Créer une table temporaire",
      "Ajouter une colonne à la table",
      "Lier deux bases de données"
    ],
    "answer": "Filtrer les lignes selon une condition",
    "explanation": "La clause WHERE permet de spécifier des conditions sur les lignes à sélectionner ou à modifier."
  },
  {
    "question": "Quelle commande permet d’insérer une ligne dans une table ?",
    "options": [
      "INSERT",
      "ADD",
      "UPDATE",
      "SELECT"
    ],
    "answer": "INSERT",
    "explanation": "INSERT INTO permet d’ajouter de nouvelles lignes dans une table existante."
  },
  {
    "question": "Que signifie l'acronyme ACID ?",
    "options": [
      "Association, Cohérence, Index, Durabilité",
      "Atomicité, Cohérence, Isolation, Durabilité",
      "Autonomie, Cohérence, Inversion, Disponibilité",
      "Accessibilité, Connexion, Indépendance, Disponibilité"
    ],
    "answer": "Atomicité, Cohérence, Isolation, Durabilité",
    "explanation": "ACID est un ensemble de propriétés qui garantissent la fiabilité des transactions dans une base de données."
  },
  {
    "question": "Pourquoi choisir PostgreSQL pour un projet open source ?",
    "options": [
      "Car il est payant",
      "Pour sa compatibilité avec Excel",
      "Pour ses performances, sa richesse fonctionnelle et sa licence libre",
      "Car il est uniquement compatible Windows"
    ],
    "answer": "Pour ses performances, sa richesse fonctionnelle et sa licence libre",
    "explanation": "PostgreSQL est une base robuste, riche en types avancés, et très utilisée dans les projets open source."
  },
  {
    "question": "Dans une base relationnelle, une clé primaire sert à :",
    "options": [
      "Lier deux tables entre elles",
      "Identifier de manière unique chaque ligne d'une table",
      "Créer une nouvelle colonne",
      "Sauvegarder la table automatiquement"
    ],
    "answer": "Identifier de manière unique chaque ligne d'une table",
    "explanation": "La clé primaire permet d’assurer l’unicité et l’intégrité des données d’une table."
  },
  {
    "question": "Quelle clause permet de trier les résultats d'une requête SQL ?",
    "options": [
      "SORT BY",
      "ORDER BY",
      "GROUP BY",
      "FILTER"
    ],
    "answer": "ORDER BY",
    "explanation": "ORDER BY trie les résultats d’une requête selon une ou plusieurs colonnes, en ordre croissant ou décroissant."
  },
  {
    "question": "Quelle clause SQL regroupe les lignes ayant des valeurs identiques ?",
    "options": [
      "UNION",
      "MERGE",
      "GROUP BY",
      "COLLECT"
    ],
    "answer": "GROUP BY",
    "explanation": "GROUP BY regroupe les lignes par valeur commune, souvent utilisée avec des fonctions d’agrégation comme COUNT ou SUM."
  },
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
    <strong>Question :</strong>
    <pre style={{ margin: '0', padding: '4px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
        {slide.question}
      </code>
    
    </pre>
    <strong>Réponse :</strong> {slide.answer}
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
const Page2 = () => {
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

export default Page2;