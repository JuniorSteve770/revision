// src/projects/Project1/pages/Page3.js
import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

  {
    "question": "Qu'est-ce que l'overthreading en C# ? / Quelle différence entre Thread et Task en C# ?",
    "answer": "L'overthreading désigne la création excessive de threads, provoquant surcharge CPU, contentions mémoire et ralentissements. Ex : créer 1000 threads simultanés via new Thread(...). | Un Thread est une unité d'exécution manuelle, tandis qu'un Task est une abstraction légère basée sur le ThreadPool. Task = Task.Run(...), plus efficace et asynchrone."
  },
  {
    "question": "Qu'est-ce que le ThreadPool en .NET ? / Pourquoi éviter les context switches ?",
    "answer": "Le ThreadPool est un pool géré de threads réutilisables, évitant la surcharge de création/destruction. Il optimise les performances des Task et async. | Chaque changement de thread (context switch) consomme du CPU pour sauvegarder et restaurer les états, ce qui nuit aux performances s'ils sont trop fréquents."
  },
  {
    "question": "Quels sont les signes d'un overthreading ? / Comment limiter le nombre de tâches concurrentes ?",
    "answer": "CPU élevé, deadlocks, threads bloqués, exceptions type OutOfMemoryException, lenteurs générales. Ex : pic de CPU à 100% sans activité utilisateur. | Utiliser SemaphoreSlim ou ParallelOptions.MaxDegreeOfParallelism pour restreindre les tâches simultanées. Ex : limiter à 4 threads."
  },
  {
    "question": "Quelle différence entre I/O-bound et CPU-bound ? / Pourquoi utiliser async/await ?",
    "answer": "I/O-bound = tâches en attente d’entrées-sorties (ex: requêtes HTTP) → async/await. CPU-bound = calculs lourds → Parallel, Task.Run(). | async/await libère les threads pendant les I/O. Évite de bloquer le thread principal et améliore la scalabilité des applications web."
  },
  {
    "question": "Donne un exemple de mauvaise pratique en threading. / À quoi sert ConfigureAwait(false) ?",
    "answer": "Créer des centaines de threads avec new Thread(() => { }) au lieu d'utiliser Task.Run() ou Parallel.ForEach. | Évite de reprendre sur le contexte original (ex : UI thread), utile dans les bibliothèques pour éviter les blocages inutiles."
  },
  {
    "question": "Qu’est-ce qu’un test unitaire ? / Qu’est-ce qu’un test d’intégration ?",
    "answer": "Test d'une méthode isolée. Ex : tester Add(2,3) renvoie 5. Outils : xUnit, NUnit, MSTest. | Vérifie les interactions entre composants (ex: API + DB). Teste les connexions réelles ou simulées."
  },
  {
    "question": "Qu’est-ce qu’un test fonctionnel ? / Quels outils pour tests UI ?",
    "answer": "Teste une fonctionnalité complète, comme une commande e-commerce. Peut inclure plusieurs services ou couches logiques. | Ex : Selenium, Playwright, WinAppDriver. Ils automatisent l’interaction avec les interfaces graphiques."
  },
  {
    "question": "Pourquoi faire des tests de régression ? / Cite 3 outils de tests de performance.",
    "answer": "Pour s'assurer qu’une modification n’a pas introduit de bug dans une fonctionnalité existante. Intégration continue essentielle. | JMeter, k6, Visual Studio Load Test. Ils simulent une charge pour évaluer la résistance du système."
  },
  {
    "question": "Quelle est la pyramide des tests ? / À quoi sert un test de sécurité ?",
    "answer": "Base : 70% tests unitaires, milieu : 20% tests d’intégration, sommet : 10% tests E2E/UI. Optimise rapidité et fiabilité. | Détecte des vulnérabilités comme les injections SQL/XSS. Outils : OWASP ZAP, Burp Suite."
  },
  {
    "question": "Pourquoi utiliser FluentAssertions ? / Qu’est-ce qu’un microservice ?",
    "answer": "Rend les assertions lisibles : result.Should().Be(42);. Améliore la clarté des tests unitaires. | Unité logicielle autonome réalisant une fonction précise. Communication via REST/gRPC. Déployable indépendamment."
  },
  {
    "question": "Donne un exemple de microservice. / Pourquoi découper une application en microservices ?",
    "answer": "OrderService, UserService, ProductService avec chacun leur base de données et API REST dédiée. | Pour améliorer la scalabilité, la maintenabilité et le déploiement indépendant. Chaque service peut évoluer séparément."
  },
  {
    "question": "Qu’est-ce qu’une API Gateway ? / Quel est le rôle d’un message broker ?",
    "answer": "Point d’entrée unique pour les clients. Route les requêtes vers les bons microservices. Ex : Ocelot, YARP. | Facilite la communication asynchrone entre services. Ex : RabbitMQ, Kafka pour l’envoi de messages sans bloquer."
  },
  {
    "question": "Pourquoi chaque microservice a-t-il sa base de données ? / Quels outils pour les microservices en .NET ?",
    "answer": "Pour garantir l’autonomie et l’indépendance. Évite les conflits et optimise l’isolation des données. | ASP.NET Core, Docker, Ocelot, gRPC, MassTransit, Entity Framework, Serilog, OpenTelemetry."
  },
  {
    "question": "Qu’est-ce que Dapr ? / Quelle est la différence REST vs gRPC ?",
    "answer": "Framework facilitant la création de microservices distribués. Abstrait la communication, le stockage d’état, pub/sub, etc. | REST = HTTP + JSON, facile à tester. gRPC = binaire, rapide, basé sur Protobuf, idéal pour microservices internes."
  },
  {
    "question": "Quels sont les risques de microservices mal gérés ? / Pourquoi utiliser Docker avec des microservices ?",
    "answer": "Complexité accrue, duplication de logique, problèmes de communication, surcharge réseau, tests plus difficiles. | Permet un déploiement isolé, rapide et reproductible. Chaque service tourne dans un conteneur dédié."
  },


  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     {
    "question": "Qu'est-ce que l'overthreading en C# ?",
    "options": [
      "Une technique d'optimisation de threads",
      "L'utilisation excessive de `async`",
      "La création incontrôlée de nombreux threads",
      "Un outil de surveillance du CPU"
    ],
    "answer": "La création incontrôlée de nombreux threads",
    "explanation": "L'overthreading survient lorsqu'un programme crée trop de threads, entraînant des ralentissements, des contentions, et une surcharge CPU."
  },
  {
    "question": "Quelle est la meilleure méthode pour gérer des tâches I/O-bound en C# ?",
    "options": [
      "Utiliser `new Thread()`",
      "Utiliser `async/await`",
      "Utiliser `Thread.Sleep()`",
      "Utiliser `SpinWait`"
    ],
    "answer": "Utiliser `async/await`",
    "explanation": "`async/await` libère le thread en attendant une I/O, évitant ainsi de bloquer inutilement les ressources."
  },
  {
    "question": "À quoi sert le ThreadPool en .NET ?",
    "options": [
      "Créer une interface graphique multi-threadée",
      "Partager des threads entre applications",
      "Réutiliser des threads pour améliorer les performances",
      "Bloquer les tâches longues"
    ],
    "answer": "Réutiliser des threads pour améliorer les performances",
    "explanation": "Le ThreadPool permet de réutiliser les threads existants pour éviter la surcharge de création/destruction."
  },
  {
    "question": "Quel outil limite le nombre de tâches parallèles ?",
    "options": [
      "SemaphoreSlim",
      "Thread.Sleep()",
      "Task.Delay()",
      "AsyncAwaitLimiter"
    ],
    "answer": "SemaphoreSlim",
    "explanation": "`SemaphoreSlim` permet de contrôler le nombre maximum de tâches exécutées en parallèle."
  },
  {
    "question": "Quelle est la bonne pratique pour lancer 1000 tâches ?",
    "options": [
      "Créer 1000 threads avec `new Thread()`",
      "Utiliser `Task.Run()` avec throttling",
      "Utiliser `Thread.Sleep()`",
      "Utiliser `while(true)` pour les tâches"
    ],
    "answer": "Utiliser `Task.Run()` avec throttling",
    "explanation": "`Task.Run()` utilise le ThreadPool. Combiné à `SemaphoreSlim`, il permet de contrôler la charge."
  },
  {
    "question": "Quelle est la bonne pratique pour lancer 1000 tâches ?",
    "options": [
      "Créer 1000 threads avec `new Thread()`",
      "Utiliser `Task.Run()` avec throttling",
      "Utiliser `Thread.Sleep()`",
      "Utiliser `while(true)` pour les tâches"
    ],
    "answer": "Utiliser `Task.Run()` avec throttling",
    "explanation": "`Task.Run()` utilise le ThreadPool. Combiné à `SemaphoreSlim`, il permet de contrôler la charge."
  },
  {
    "question": "Qu'est-ce qu'un test unitaire en C# ?",
    "options": [
      "Un test de performance du système",
      "Un test d'une méthode isolée",
      "Un test sur plusieurs services",
      "Un test de base de données"
    ],
    "answer": "Un test d'une méthode isolée",
    "explanation": "Un test unitaire vérifie qu’une méthode retourne un résultat correct, de façon isolée. Outils : xUnit, NUnit, MSTest."
  },
  {
    "question": "Quel outil est utilisé pour tester l'interface graphique ?",
    "options": [
      "FluentAssertions",
      "JMeter",
      "Selenium",
      "Moq"
    ],
    "answer": "Selenium",
    "explanation": "Selenium permet d’automatiser les interactions avec l’interface graphique (clics, formulaires, navigation)."
  },
  {
    "question": "À quoi sert un test de régression ?",
    "options": [
      "Tester les performances sous forte charge",
      "Vérifier la stabilité de l’interface graphique",
      "S’assurer qu’aucun bug n’est réintroduit après modification",
      "Mesurer la couverture de code"
    ],
    "answer": "S’assurer qu’aucun bug n’est réintroduit après modification",
    "explanation": "Un test de régression garantit que les anciennes fonctionnalités continuent de fonctionner après un changement de code."
  },
  {
    "question": "Quel type de test couvre une fonctionnalité métier complète ?",
    "options": [
      "Test unitaire",
      "Test d’intégration",
      "Test fonctionnel",
      "Test de charge"
    ],
    "answer": "Test fonctionnel",
    "explanation": "Un test fonctionnel simule un scénario métier réel, impliquant potentiellement plusieurs composants ou services."
  },
  {
    "question": "Quelle est la base de la pyramide des tests ?",
    "options": [
      "Tests de charge",
      "Tests unitaires",
      "Tests E2E",
      "Tests UI"
    ],
    "answer": "Tests unitaires",
    "explanation": "Les tests unitaires sont rapides, nombreux et constituent la base de la pyramide des tests pour détecter rapidement les erreurs."
  },
  {
    "question": "Quel outil mesure la résistance sous charge ?",
    "options": [
      "xUnit",
      "JMeter",
      "Moq",
      "NUnit"
    ],
    "answer": "JMeter",
    "explanation": "JMeter permet de simuler des centaines d’utilisateurs simultanés pour tester la charge et la performance du système."
  },
  {
    "question": "Quelle caractéristique est essentielle dans un microservice ?",
    "options": [
      "Partage de base de données",
      "Interface graphique commune",
      "Indépendance et autonomie",
      "Exécution synchrone uniquement"
    ],
    "answer": "Indépendance et autonomie",
    "explanation": "Un microservice est conçu pour être autonome, avec sa propre logique, base de données, et déploiement."
  },
  {
    "question": "Quel composant redirige les requêtes vers les bons microservices ?",
    "options": [
      "Service Registry",
      "API Gateway",
      "Message Broker",
      "Database Router"
    ],
    "answer": "API Gateway",
    "explanation": "L'API Gateway sert de point d’entrée unique et redirige les requêtes vers les microservices appropriés."
  },
  {
    "question": "Pourquoi chaque microservice possède-t-il sa base de données ?",
    "options": [
      "Pour partager les ressources",
      "Pour éviter la duplication",
      "Pour garantir l’isolation et l’autonomie",
      "Pour faciliter les tests UI"
    ],
    "answer": "Pour garantir l’isolation et l’autonomie",
    "explanation": "Chaque microservice doit pouvoir évoluer et fonctionner indépendamment, ce qui impose d’avoir sa propre base de données."
  },
  ],
  avance: [
     {
    "question": "Quel protocole est le plus rapide pour la communication interne entre microservices ?",
    "options": [
      "SOAP",
      "REST",
      "gRPC",
      "FTP"
    ],
    "answer": "gRPC",
    "explanation": "gRPC utilise des messages binaires (Protobuf) et est plus rapide que REST (texte JSON), idéal pour les communications internes."
  },
  {
    "question": "Quel outil facilite la communication entre microservices via messages ?",
    "options": [
      "xUnit",
      "RabbitMQ",
      "Dapper",
      "Swagger"
    ],
    "answer": "RabbitMQ",
    "explanation": "RabbitMQ est un message broker permettant une communication asynchrone fiable entre services distribués."
  },
  {
    "question": "Qu’est-ce que Dapr en contexte microservices ?",
    "options": [
      "Un ORM",
      "Un serveur de base de données",
      "Un framework de communication distribuée",
      "Un outil de test unitaire"
    ],
    "answer": "Un framework de communication distribuée",
    "explanation": "Dapr est un framework facilitant la communication, la persistance d’état, le pub/sub dans les architectures distribuées."
  },
  {
    "question": "Quel outil est utilisé pour tracer les logs dans un microservice .NET ?",
    "options": [
      "Serilog",
      "AutoMapper",
      "Entity Framework",
      "MassTransit"
    ],
    "answer": "Serilog",
    "explanation": "Serilog est un outil de logging structuré, utilisé pour tracer les événements dans les applications .NET."
  },
  {
    "question": "Que permet `ConfigureAwait(false)` ?",
    "options": [
      "Changer le nom d’un thread",
      "Attendre un délai sans bloquer",
      "Ne pas reprendre sur le contexte original",
      "Activer le multithreading"
    ],
    "answer": "Ne pas reprendre sur le contexte original",
    "explanation": "`ConfigureAwait(false)` est utilisé pour éviter les blocages liés au thread UI ou au SynchronizationContext."
  },
  {
    "question": "Quel type de test vérifie le dialogue entre plusieurs modules ?",
    "options": [
      "Test unitaire",
      "Test fonctionnel",
      "Test d’intégration",
      "Test de charge"
    ],
    "answer": "Test d’intégration",
    "explanation": "Un test d’intégration vérifie la cohérence des interactions entre différents composants ou services."
  },
  {
    "question": "Pourquoi utilise-t-on Docker pour les microservices ?",
    "options": [
      "Pour gérer les erreurs réseau",
      "Pour tester le code C#",
      "Pour encapsuler et isoler chaque service",
      "Pour centraliser les logs"
    ],
    "answer": "Pour encapsuler et isoler chaque service",
    "explanation": "Docker permet de déployer chaque microservice dans un conteneur isolé et reproductible."
  },
  {
    "question": "Quel outil est recommandé pour les tests C# orientés objets ?",
    "options": [
      "Moq",
      "Swagger",
      "Dapper",
      "Grafana"
    ],
    "answer": "Moq",
    "explanation": "Moq est une bibliothèque de mocking permettant de simuler des dépendances dans les tests unitaires orientés objets."
  },
  {
    "question": "Quel outil décrit une API REST de manière interactive ?",
    "options": [
      "Swagger",
      "RabbitMQ",
      "Moq",
      "gRPC"
    ],
    "answer": "Swagger",
    "explanation": "Swagger (OpenAPI) génère une documentation interactive permettant de tester facilement une API REST."
  },
  {
    "question": "Pourquoi éviter `new Thread()` en boucle ?",
    "options": [
      "C’est plus lent que `Thread.Sleep()`",
      "Cela consomme excessivement les ressources",
      "Cela bloque les opérations I/O",
      "Cela désactive le garbage collector"
    ],
    "answer": "Cela consomme excessivement les ressources",
    "explanation": "Créer de nombreux threads avec `new Thread()` surcharge le système. Il vaut mieux utiliser `Task.Run()` ou le ThreadPool."
  },
  {
    "question": "Comment garantir la scalabilité dans une architecture microservices ?",
    "options": [
      "En centralisant les bases de données",
      "En augmentant le nombre de tests UI",
      "En permettant un déploiement indépendant de chaque service",
      "En utilisant uniquement des appels REST"
    ],
    "answer": "En permettant un déploiement indépendant de chaque service",
    "explanation": "La scalabilité repose sur la capacité à déployer, dupliquer et faire évoluer chaque service indépendamment."
  },
  {
    "question": "Quel outil est recommandé pour les tests C# orientés objets ?",
    "options": [
      "Moq",
      "Swagger",
      "Dapper",
      "Grafana"
    ],
    "answer": "Moq",
    "explanation": "Moq est une bibliothèque de mocking permettant de simuler des dépendances dans les tests unitaires orientés objets."
  },
  {
    "question": "Quel outil décrit une API REST de manière interactive ?",
    "options": [
      "Swagger",
      "RabbitMQ",
      "Moq",
      "gRPC"
    ],
    "answer": "Swagger",
    "explanation": "Swagger (OpenAPI) génère une documentation interactive permettant de tester facilement une API REST."
  },
  {
    "question": "Pourquoi éviter `new Thread()` en boucle ?",
    "options": [
      "C’est plus lent que `Thread.Sleep()`",
      "Cela consomme excessivement les ressources",
      "Cela bloque les opérations I/O",
      "Cela désactive le garbage collector"
    ],
    "answer": "Cela consomme excessivement les ressources",
    "explanation": "Créer de nombreux threads avec `new Thread()` surcharge le système. Il vaut mieux utiliser `Task.Run()` ou le ThreadPool."
  },
  {
    "question": "Comment garantir la scalabilité dans une architecture microservices ?",
    "options": [
      "En centralisant les bases de données",
      "En augmentant le nombre de tests UI",
      "En permettant un déploiement indépendant de chaque service",
      "En utilisant uniquement des appels REST"
    ],
    "answer": "En permettant un déploiement indépendant de chaque service",
    "explanation": "La scalabilité repose sur la capacité à déployer, dupliquer et faire évoluer chaque service indépendamment."
  },
  {
    "question": "Comment réagir si un développeur refuse de corriger un bug que vous avez identifié ?",
    "options": [
      "Le signaler immédiatement à la direction",
      "Expliquer l’impact métier du bug et chercher une solution ensemble",
      "Corriger le bug vous-même sans prévenir",
      "Ignorer le bug s’il n’est pas critique"
    ],
    "answer": "Expliquer l’impact métier du bug et chercher une solution ensemble",
    "explanation": "L’approche collaborative permet de valoriser le travail d’équipe et de faire avancer le projet efficacement."
  },
  {
    "question": "Lors d’un daily scrum, un collègue expose un blocage technique que vous connaissez. Que faites-vous ?",
    "options": [
      "Lui proposer une solution après la réunion",
      "Le corriger publiquement",
      "Ignorer la situation",
      "Changer de sujet"
    ],
    "answer": "Lui proposer une solution après la réunion",
    "explanation": "Le daily doit rester bref ; apporter une aide ciblée en privé est plus efficace et respectueux."
  },
  {
    "question": "Comment prioriser vos tâches quand tout semble urgent ?",
    "options": [
      "Traiter les tâches au hasard",
      "Demander l’ordre de priorité à votre responsable",
      "Commencer par la tâche la plus facile",
      "Tout faire en même temps"
    ],
    "answer": "Demander l’ordre de priorité à votre responsable",
    "explanation": "Clarifier les priorités permet de mieux organiser votre travail et de répondre aux attentes de l’équipe."
  },
  {
    "question": "Que faites-vous si un test unitaire passe localement mais échoue dans le pipeline CI/CD ?",
    "options": [
      "Supprimer le test",
      "Ignorer l’échec",
      "Reproduire l’environnement CI localement pour investiguer",
      "Modifier aléatoirement le code pour que ça passe"
    ],
    "answer": "Reproduire l’environnement CI localement pour investiguer",
    "explanation": "L’échec en CI peut révéler des différences d’environnement. Il faut comprendre avant de corriger."
  },
  {
    "question": "Comment expliquez-vous un concept technique à un non-technique ?",
    "options": [
      "Avec des métaphores simples et des analogies concrètes",
      "Avec du code et des schémas UML",
      "En utilisant des termes spécialisés",
      "En montrant la documentation officielle"
    ],
    "answer": "Avec des métaphores simples et des analogies concrètes",
    "explanation": "Adapter le langage à votre interlocuteur renforce la compréhension et facilite la collaboration."
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
const Page3 = () => {
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

export default Page3;