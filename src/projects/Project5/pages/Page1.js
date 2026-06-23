// src/projects/Project1/pages/Page1.js
import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "1. Compréhension du Métier (Equity / Front Office) / Pouvez-vous expliquer le fonctionnement des marchés actions ?",
    "answer": "Marchés actions : financement des sociétés par titres ; investisseurs échangent sur Euronext, NYSE. Introduction métier Equity."
  },
  
  {
    "question": "Avez-vous utilisé Power BI, Tableau ? / Quels outils pour le suivi (JIRA, Confluence…) ?",
    "answer": "Reporting via Power BI/Tableau : KPIs, anomalies. JIRA pour suivi agile, Confluence pour documentation projets FO."
  },
  
  {
    "question": "Quelle est la différence entre Monte Carlo et arbre binomial pour le pricing d’options ?",
    "answer": "Monte Carlo : simulation aléatoire, bon pour options exotiques et haute dimension. Arbre binomial : discret, plus intuitif, bon pour options standards avec peu de dates d’exercice."
  }
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
{
    "question": "Quelle est l’interaction clé entre le BA et le Front Office lors de la phase de cadrage d’un projet ?",
    "options": [
      "Le BA observe uniquement les opérations du Front Office",
      "Le BA rédige des user stories sans échange direct",
      "Le BA recueille les besoins via ateliers et observation sur le floor",
      "Le BA délègue la collecte des besoins à la MOE"
    ],
    "answer": "Le BA recueille les besoins via ateliers et observation sur le floor",
    "explanation": "Le BA privilégie les interactions directes avec les traders et sales via ateliers, interviews et observation pour bien comprendre les besoins métier."
  },
  {
    "question": "Quel est le rôle du BA dans la priorisation des demandes des utilisateurs Front Office ?",
    "options": [
      "Il suit un ordre chronologique de réception des demandes",
      "Il demande aux développeurs de choisir",
      "Il évalue impact, fréquence et criticité pour arbitrer",
      "Il laisse les utilisateurs décider eux-mêmes"
    ],
    "answer": "Il évalue impact, fréquence et criticité pour arbitrer",
    "explanation": "Le BA analyse la valeur métier et la fréquence des demandes pour les prioriser avec les Product Owners ou responsables de desks."
  },
  {
    "question": "Quelle action le BA entreprend-il pour tester une nouvelle fonctionnalité de pricing ?",
    "options": [
      "Il demande à la MOE de tester seule",
      "Il crée des cas de test réalistes et valide avec les utilisateurs",
      "Il attend que le client signale un bug",
      "Il teste en production sans jeu de données"
    ],
    "answer": "Il crée des cas de test réalistes et valide avec les utilisateurs",
    "explanation": "Le BA définit des cas métiers, prépare des jeux de données et s’assure de la validation fonctionnelle en pré-production avec les utilisateurs clés."
  },
  {
    "question": "Quelle est la meilleure réponse à une incohérence entre un prix affiché sur l’outil FO et la donnée réelle ?",
    "options": [
      "Redémarrer l’application",
      "Demander aux traders de patienter",
      "Analyser les flux de données, logs et source (ex: Bloomberg)",
      "Attendre le retour de la DSI"
    ],
    "answer": "Analyser les flux de données, logs et source (ex: Bloomberg)",
    "explanation": "Le BA doit identifier l'origine du problème via les flux de données, vérifier la source et analyser les logs avant d’alerter les équipes techniques."
  },
  {
    "question": "Quelle attitude adopter face à un trader qui exige une solution immédiate alors que la DSI prévoit un délai ?",
    "options": [
      "Promettre une résolution rapide sans validation",
      "Proposer une solution intermédiaire et alerter la DSI",
      "Ignorer la demande du trader",
      "Transférer la demande à un autre BA"
    ],
    "answer": "Proposer une solution intermédiaire et alerter la DSI",
    "explanation": "Le BA doit gérer la pression en proposant un workaround, en maintenant une communication claire, et en impliquant rapidement la DSI."
  }
  ],
  avance: [
     {
    "question": "Quelle est la différence principale entre la variance et l’écart-type en finance ?",
    "options": [
      "La variance est toujours plus petite que l’écart-type",
      "L’écart-type est une moyenne absolue, la variance est une moyenne quadratique",
      "La variance s’exprime dans les mêmes unités que les données",
      "L’écart-type s’exprime dans les mêmes unités que les données, la variance est au carré"
    ],
    "answer": "L’écart-type s’exprime dans les mêmes unités que les données, la variance est au carré",
    "explanation": "L’écart-type est la racine carrée de la variance et a la même unité que les données, ce qui le rend plus interprétable pour mesurer le risque."
  },
  {
    "question": "Pourquoi le processus de Wiener est-il central dans les modèles de finance quantitative ?",
    "options": [
      "Il permet de calculer la prime de risque exacte",
      "Il modélise un comportement cyclique des actifs",
      "Il représente un aléa continu avec des incréments indépendants et normalement distribués",
      "Il est utilisé uniquement pour les actifs à revenu fixe"
    ],
    "answer": "Il représente un aléa continu avec des incréments indépendants et normalement distribués",
    "explanation": "Le processus de Wiener, ou mouvement brownien, est la base des modèles comme Black-Scholes car il modélise une évolution aléatoire continue des prix."
  },
  {
    "question": "Quelle méthode est typiquement utilisée pour calibrer une surface de volatilité implicite ?",
    "options": [
      "Lissage par moyenne mobile",
      "Interpolation et optimisation numérique à partir de prix d’options",
      "Régression linéaire sur les prix spot",
      "Transformation de Fourier inverse des prix d’options"
    ],
    "answer": "Interpolation et optimisation numérique à partir de prix d’options",
    "explanation": "La calibration consiste à extraire les volatilités implicites du marché via interpolation puis à ajuster un modèle à l’aide d’une méthode d’optimisation."
  },
  {
    "question": "Quelle est la différence majeure entre Monte Carlo et arbre binomial dans le pricing d’options ?",
    "options": [
      "Monte Carlo est plus rapide que l’arbre binomial",
      "L’arbre binomial est plus adapté aux options exotiques",
      "Monte Carlo gère mieux les options complexes à plusieurs variables",
      "Les deux méthodes sont équivalentes en termes d’application"
    ],
    "answer": "Monte Carlo gère mieux les options complexes à plusieurs variables",
    "explanation": "La méthode de Monte Carlo est idéale pour des options exotiques ou multidimensionnelles, contrairement aux arbres binomiaux, plus adaptés aux options simples."
  },
  {
    "question": "Quel est le rôle principal de la matrice de corrélation en gestion de portefeuille ?",
    "options": [
      "Mesurer le rendement attendu des actifs",
      "Identifier les relations de dépendance entre les actifs",
      "Optimiser la fiscalité du portefeuille",
      "Déterminer la volatilité historique individuelle"
    ],
    "answer": "Identifier les relations de dépendance entre les actifs",
    "explanation": "La matrice de corrélation aide à comprendre comment les actifs évoluent ensemble, ce qui est crucial pour la diversification du risque."
  },
  {
    "question": "Dans un modèle de Black-Scholes, quelle hypothèse est faite sur la volatilité ?",
    "options": [
      "Elle est nulle",
      "Elle varie en fonction du temps",
      "Elle est constante",
      "Elle suit une loi normale"
    ],
    "answer": "Elle est constante",
    "explanation": "Le modèle Black-Scholes suppose une volatilité constante sur toute la durée de vie de l’option, bien que cela soit une simplification."
  },
  {
    "question": "Pourquoi utilise-t-on le changement de mesure en probabilités neutres au risque ?",
    "options": [
      "Pour ignorer le temps dans les calculs de prix",
      "Pour éviter de devoir estimer la volatilité",
      "Pour valoriser les actifs en supprimant la prime de risque",
      "Pour simuler des scénarios plus pessimistes"
    ],
    "answer": "Pour valoriser les actifs en supprimant la prime de risque",
    "explanation": "Le passage à une mesure neutre au risque permet de valoriser les actifs en remplaçant les espérances réelles par celles sous mesure risque-neutre."
  },
  {
    "question": "Qu’indique un Sharpe Ratio négatif sur une période donnée ?",
    "options": [
      "Le portefeuille a surperformé le marché",
      "La volatilité du portefeuille est faible",
      "La performance est inférieure au taux sans risque",
      "Le portefeuille est parfaitement diversifié"
    ],
    "answer": "La performance est inférieure au taux sans risque",
    "explanation": "Un Sharpe Ratio négatif signifie que le rendement excédentaire est négatif, c’est-à-dire inférieur au rendement sans risque malgré la prise de risque."
  }, 
   {
      "question": "Quelle méthode utiliseriez-vous en priorité pour diagnostiquer un incident applicatif ?",
      "options": [
        "Lancer une analyse post-mortem immédiatement",
        "Extraire les logs et données métiers pertinentes",
        "Redémarrer immédiatement le serveur",
        "Contacter le support sans investigation"
      ],
      "answer": "Extraire les logs et données métiers pertinentes",
      "explanation": "L'extraction des logs et données critiques permet d'identifier la racine du problème avant toute action corrective."
    },
   
    {
      "question": "Quelle requête trouve les clients sans commande ?",
      "options": [
        "SELECT * FROM clients c INNER JOIN commandes co ON c.id = co.client_id",
        "SELECT * FROM clients c LEFT JOIN commandes co ON c.id = co.client_id WHERE co.id IS NULL",
        "SELECT COUNT(*) FROM clients",
        "DELETE FROM clients WHERE id NOT IN (SELECT client_id FROM commandes)"
      ],
      "answer": "SELECT * FROM clients c LEFT JOIN commandes co ON c.id = co.client_id WHERE co.id IS NULL",
      "explanation": "LEFT JOIN + WHERE IS NULL est le pattern classique pour trouver les absences de correspondance."
    },
    {
      "question": "Comment suivre les appels système d'un processus en cours ?",
      "options": [
        "strace -p <PID>",
        "tail -f /dev/null",
        "ping localhost",
        "chmod +x /proc/<PID>"
      ],
      "answer": "strace -p <PID>",
      "explanation": "strace trace les appels système (open/read/write) d'un processus, crucial pour le debugging."
    },
    {
      "question": "Pourquoi éviter 'SELECT *' en production ?",
      "options": [
        "Cela charge inutilement des colonnes non utilisées",
        "La syntaxe est obsolète en SQL:2023",
        "Cela corrompt les indexes",
        "Cela déclenche toujours un full table scan"
      ],
      "answer": "Cela charge inutilement des colonnes non utilisées",
      "explanation": "Sélectionner uniquement les colonnes nécessaires réduit la charge réseau/CPU."
    },
    {
      "question": "Quel outil permet de gérer l'infrastructure comme code ?",
      "options": [
        "Terraform",
        "Wireshark",
        "MySQL Workbench",
        "Nagios"
      ],
      "answer": "Terraform",
      "explanation": "Terraform (HCL) et Ansible (YAML) sont les standards pour l'IaC (Infrastructure as Code)."
    },
    {
      "question": "Comment vérifier les ports ouverts sur votre machine locale ?",
      "options": [
        "netstat -tuln",
        "ping 127.0.0.1",
        "curl ifconfig.me",
        "dig localhost"
      ],
      "answer": "netstat -tuln",
      "explanation": "netstat -tuln liste les ports en écoute (TCP/UDP) sans résolution DNS (-n)."
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
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {index + 1}. {option}
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
const Page1 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
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
  }, [level, currentQuestion]);

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && !message && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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

  const handleAnswerClick = (option) => {
    if (message) return;
    const currentQuestions = questions[level];
    const current = currentQuestions[currentQuestion];
    if (option === current.answer) {
      setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ Incorrect ! La bonne réponse était : ${current.answer}\n ℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 2500);
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