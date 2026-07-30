// src/projects/Project3/pages/Page6_TechInterview.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";


const basicSlides = [
  {
    question: "Le décorateur Retry — vue d'ensemble",
    answer:
      "◆ **retry** : mécanisme de réexécution automatique en cas d'échec ◆ **Pourquoi ?** : serveurs instables, API indisponibles, DB saturées ◆ **Fonctionnement** : le décorateur reçoit la fonction, crée un wrapper, exécute dans un try/except, attend, réessaie ◆ **Mots-clés** : decorator, wrapper, args, kwargs, try, except, sleep, backoff, raise, wraps ⚠️ Retry = donner plusieurs chances à une fonction qui peut échouer temporairement",
  },
  {
    question: "Les 10 mots-clés du décorateur Retry — à mémoriser",
    answer:
      "◆ **retry** : le mécanisme global (réessayer plusieurs fois) ◆ **decorator** : le pattern qui encapsule la fonction ◆ **wrapper** : l'intermédiaire qui surveille l'exécution ◆ **args / kwargs** : transmission des paramètres ◆ **try** : tentative d'exécution ◆ **except** : capture de l'erreur ◆ **sleep** : pause entre les tentatives ◆ **backoff** : augmentation progressive du délai ◆ **raise** : relance de l'exception finale ◆ **wraps** : conservation de l'identité de la fonction ⚠️ Mnémotechnique : 'Recevoir, encapsuler, exécuter, capturer, attendre, réessayer, relancer, préserver'",
  },
  {
    question: "Association mentale — l'employé qui envoie un email",
    answer:
      "◆ **retry** : le responsable lui dit de réessayer plusieurs fois ◆ **decorator** : la procédure de réessai ◆ **wrapper** : l'assistant qui surveille l'envoi ◆ **args/kwargs** : les informations de l'email ◆ **try** : tentative d'envoi ◆ **except** : détection d'un échec ◆ **sleep** : attente avant un nouvel essai ◆ **backoff** : attente de plus en plus longue ◆ **raise** : remontée du problème au manager ◆ **wraps** : conservation du nom du véritable expéditeur ⚠️ Visualiser cette scène aide à mémoriser chaque composant",
  },
];

const questions = {
  moyen: [
    // ==================== BASES ET DEFINITION ====================
    {
      question:
        "[Retry] Quel est le rôle principal du décorateur retry ?",
      options: [
        "Rendre la fonction plus rapide",
        "Donner plusieurs chances à une fonction qui peut échouer temporairement",
        "Empêcher toute erreur dans la fonction",
        "Supprimer les erreurs silencieusement",
      ],
      answer: "Donner plusieurs chances à une fonction qui peut échouer temporairement",
      explanation:
        "Le retry permet de réexécuter automatiquement une fonction en cas d'échec (API indisponible, DB saturée, réseau instable).",
    },
    {
      question:
        "[Retry] Que fait un décorateur retry en premier lieu ?",
      options: [
        "Exécute directement la fonction",
        "Reçoit la fonction à protéger",
        "Attend avant d'exécuter",
        "Ignore la fonction",
      ],
      answer: "Reçoit la fonction à protéger",
      explanation:
        "Le décorateur reçoit d'abord la fonction qu'il doit protéger. C'est le premier paramètre du décorateur.",
    },
    {
      question:
        "[Retry] Qu'est-ce que le wrapper dans le contexte du décorateur retry ?",
      options: [
        "Un paquet cadeau autour de la fonction",
        "Un intermédiaire qui agit comme un gardien devant la fonction originale",
        "Une nouvelle fonction qui remplace complètement l'originale",
        "Un conteneur de données",
      ],
      answer: "Un intermédiaire qui agit comme un gardien devant la fonction originale",
      explanation:
        "Le wrapper est créé par le décorateur. Il se place devant la fonction originale et intercepte tous les appels.",
    },
    {
      question:
        "[Retry] Pourquoi le wrapper utilise-t-il *args et **kwargs ?",
      options: [
        "Pour rendre le code plus rapide",
        "Pour accepter n'importe quelle combinaison de paramètres et les transmettre sans modification",
        "Pour ignorer les paramètres",
        "Pour modifier les paramètres avant de les transmettre",
      ],
      answer: "Pour accepter n'importe quelle combinaison de paramètres et les transmettre sans modification",
      explanation:
        "args et kwargs permettent au wrapper d'être universel : il accepte tous les paramètres possibles et les transmet fidèlement à la fonction originale.",
    },
    {
      question:
        "[Retry] Que signifie *args dans une fonction Python ?",
      options: [
        "Un argument nommé",
        "Une liste d'arguments positionnels variables",
        "Un dictionnaire d'arguments nommés",
        "Un argument optionnel",
      ],
      answer: "Une liste d'arguments positionnels variables",
      explanation:
        "*args capture tous les arguments positionnels supplémentaires sous forme de tuple. **kwargs capture les arguments nommés sous forme de dict.",
    },

    // ==================== TRY / EXCEPT / SLEEP ====================
    {
      question:
        "[Retry] Où se trouve l'exécution de la fonction dans le wrapper ?",
      options: [
        "Dans un bloc if/else",
        "Dans un bloc try",
        "Dans un bloc while",
        "Dans un bloc for",
      ],
      answer: "Dans un bloc try",
      explanation:
        "La fonction est exécutée dans un bloc try. Cela permet de capturer les erreurs dans le bloc except si l'exécution échoue.",
    },
    {
      question:
        "[Retry] Que fait le bloc except dans le wrapper retry ?",
      options: [
        "Affiche l'erreur et continue",
        "Capture l'erreur et déclenche une nouvelle tentative",
        "Arrête immédiatement le programme",
        "Ignore complètement l'erreur",
      ],
      answer: "Capture l'erreur et déclenche une nouvelle tentative",
      explanation:
        "Le except capture l'erreur. Au lieu d'abandonner, il incrémente un compteur et prépare une nouvelle tentative.",
    },
    {
      question:
        "[Retry] À quoi sert la fonction sleep dans le mécanisme retry ?",
      options: [
        "Mettre la fonction en veille définitive",
        "Attendre quelques secondes avant de réessayer",
        "Accélérer l'exécution",
        "Fermer la connexion",
      ],
      answer: "Attendre quelques secondes avant de réessayer",
      explanation:
        "sleep() crée une pause entre les tentatives. Cela évite de surcharger un système déjà en difficulté.",
    },
    {
      question:
        "[Retry] Quelle est la raison de mettre une pause (sleep) entre les tentatives ?",
      options: [
        "Pour laisser le temps à l'utilisateur de réagir",
        "Pour éviter de surcharger un système déjà en difficulté",
        "Pour économiser des ressources système",
        "Pour que le code soit plus lisible",
      ],
      answer: "Pour éviter de surcharger un système déjà en difficulté",
      explanation:
        "Si un serveur est saturé, le spammer de requêtes aggrave le problème. La pause permet au système de se rétablir.",
    },

    // ==================== BACKOFF ====================
    {
      question:
        "[Retry] Qu'est-ce que le backoff dans le contexte du retry ?",
      options: [
        "Un retour en arrière dans le code",
        "Une augmentation progressive du délai d'attente entre les tentatives",
        "Une diminution du nombre de tentatives",
        "Un arrêt définitif des tentatives",
      ],
      answer: "Une augmentation progressive du délai d'attente entre les tentatives",
      explanation:
        "Le backoff augmente le temps d'attente à chaque échec : 1s, 2s, 4s, 8s... Cela évite de surcharger le système cible.",
    },
    {
      question:
        "[Retry] Quel est l'avantage du backoff exponentiel ?",
      options: [
        "Il rend les tentatives plus rapides",
        "Il réduit la charge sur le système cible en espaçant les tentatives",
        "Il garantit le succès à chaque tentative",
        "Il supprime les erreurs",
      ],
      answer: "Il réduit la charge sur le système cible en espaçant les tentatives",
      explanation:
        "Le backoff exponentiel (1s, 2s, 4s, 8s) permet au système de se rétablir progressivement sans être submergé de requêtes.",
    },
    {
      question:
        "[Retry] Si la première tentative échoue et que le backoff est de 1s, 2s, 4s, combien de temps attend-on avant la 3ème tentative ?",
      options: [
        "1 seconde",
        "2 secondes",
        "4 secondes",
        "8 secondes",
      ],
      answer: "4 secondes",
      explanation:
        "Le backoff exponentiel : 1er échec → 1s d'attente, 2ème échec → 2s, 3ème tentative → 4s d'attente avant la 3ème tentative (si nécessaire).",
    },

    // ==================== RAISE ====================
    {
      question:
        "[Retry] Que fait le wrapper si la fonction échoue après toutes les tentatives ?",
      options: [
        "Retourne None",
        "Ignore l'erreur et continue",
        "Utilise raise pour renvoyer l'erreur au programme appelant",
        "Redémarre le programme",
      ],
      answer: "Utilise raise pour renvoyer l'erreur au programme appelant",
      explanation:
        "Si toutes les tentatives échouent, le wrapper relance l'exception avec raise. Le programme appelant doit la gérer.",
    },
    {
      question:
        "[Retry] Pourquoi utilise-t-on raise plutôt que de simplement retourner l'erreur ?",
      options: [
        "Parce que c'est la seule façon de transmettre une erreur",
        "Pour que l'appelant soit informé de l'échec et puisse le gérer correctement",
        "Parce que raise est plus rapide",
        "Pour éviter les erreurs de type",
      ],
      answer: "Pour que l'appelant soit informé de l'échec et puisse le gérer correctement",
      explanation:
        "raise transmet l'exception à l'appelant. Cela permet à l'appelant de décider comment gérer l'échec (log, fallback, notification).",
    },

    // ==================== WRAPS ====================
    {
      question:
        "[Retry] À quoi sert functools.wraps dans un décorateur ?",
      options: [
        "À accélérer la fonction",
        "À préserver l'identité de la fonction originale (nom, documentation, etc.)",
        "À supprimer la fonction originale",
        "À créer une copie de la fonction",
      ],
      answer: "À préserver l'identité de la fonction originale (nom, documentation, etc.)",
      explanation:
        "Sans wraps, Python considère que la fonction est devenue le wrapper. wraps conserve le nom, la docstring et les métadonnées.",
    },
    {
      question:
        "[Retry] Que se passe-t-il si on n'utilise pas wraps dans un décorateur ?",
      options: [
        "La fonction ne fonctionne plus",
        "La fonction perd son nom et sa documentation (au profit du wrapper)",
        "La fonction devient plus rapide",
        "La fonction devient immutable",
      ],
      answer: "La fonction perd son nom et sa documentation (au profit du wrapper)",
      explanation:
        "Sans wraps, la fonction décorée devient 'wrapper' dans les traces de débogage et perd sa docstring. wraps préserve ces métadonnées.",
    },

    // ==================== SYNTAXE ====================
    {
      question:
        "[Retry] Quelle est la syntaxe Python pour utiliser un décorateur retry ?",
      options: [
        "retry def ma_fonction():",
        "@retry\ndef ma_fonction():",
        "def ma_fonction():\n    retry",
        "decorator retry def ma_fonction():",
      ],
      answer: "@retry\ndef ma_fonction():",
      explanation:
        "En Python, les décorateurs s'utilisent avec la syntaxe @nom_du_decorateur avant la définition de la fonction.",
    },
    {
      question:
        "[Retry] Si retry est un décorateur avec paramètres (ex: retry(max_attempts=5)), comment l'utilise-t-on ?",
      options: [
        "@retry(max_attempts=5)\ndef ma_fonction():",
        "retry(max_attempts=5) def ma_fonction():",
        "@retry(max_attempts)\ndef ma_fonction():",
        "def ma_fonction():\n    retry(max_attempts=5)",
      ],
      answer: "@retry(max_attempts=5)\ndef ma_fonction():",
      explanation:
        "Les décorateurs paramétrés s'utilisent avec @nom(paramètres). Le décorateur reçoit d'abord les paramètres, puis la fonction.",
    },

    // ==================== CAS D'USAGE ====================
    {
      question:
        "[Retry] Dans quels cas d'usage le décorateur retry est-il particulièrement utile ?",
      options: [
        "Pour les fonctions mathématiques simples",
        "Pour les appels à des API externes, des bases de données ou des services réseau",
        "Pour les opérations de calcul CPU intensive",
        "Pour le traitement d'images",
      ],
      answer: "Pour les appels à des API externes, des bases de données ou des services réseau",
      explanation:
        "Retry est indispensable pour les opérations réseau qui peuvent échouer temporairement (API instable, DB saturée, timeout).",
    },
    {
      question:
        "[Retry] Quel problème le retry ne peut-il pas résoudre ?",
      options: [
        "Les erreurs temporaires (réseau, timeout)",
        "Les erreurs permanentes (mauvaise authentification, ressource inexistante)",
        "Les erreurs de base de données temporaires",
        "Les timeouts API",
      ],
      answer: "Les erreurs permanentes (mauvaise authentification, ressource inexistante)",
      explanation:
        "Retry est conçu pour les erreurs temporaires (réseau, timeout). Les erreurs permanentes continueront d'échouer à chaque tentative.",
    },
  ],
  avance: [
    {
      question:
        "[Retry Avancé] Comment implémenter un retry qui n'essaie que sur certaines exceptions spécifiques (ex: ConnectionError) ?",
      options: [
        "C'est impossible en Python",
        "En spécifiant les exceptions à capturer dans le except",
        "En utilisant if Exception == ConnectionError",
        "En utilisant une liste blanche d'exceptions",
      ],
      answer: "En spécifiant les exceptions à capturer dans le except",
      explanation:
        "On peut capturer uniquement certaines exceptions : except (ConnectionError, TimeoutError):. Les autres exceptions seront propagées immédiatement.",
    },
    {
      question:
        "[Retry Avancé] Que signifie un backoff avec jitter (hasard) ?",
      options: [
        "Le backoff est supprimé",
        "On ajoute un peu de hasard au délai d'attente pour éviter l'effet de 'thundering herd'",
        "Le backoff devient plus long",
        "Le backoff devient plus court",
      ],
      answer: "On ajoute un peu de hasard au délai d'attente pour éviter l'effet de 'thundering herd'",
      explanation:
        "Le jitter ajoute un temps aléatoire au délai de backoff. Cela évite que plusieurs clients réessaient en même temps (effet de troupeau).",
    },
    {
      question:
        "[Retry Avancé] Quel est l'effet de thundering herd dans le contexte du retry ?",
      options: [
        "Un serveur qui est saturé de requêtes",
        "De nombreux clients qui réessaient exactement en même temps, submergeant le système",
        "Un système qui ne répond plus",
        "Une perte de connexion réseau",
      ],
      answer: "De nombreux clients qui réessaient exactement en même temps, submergeant le système",
      explanation:
        "Le thundering herd se produit quand tous les clients retry avec le même timing, créant un pic de requêtes qui peut submerger le serveur.",
    },
    {
      question:
        "[Retry Avancé] Pourquoi le retry est-il souvent combiné avec un circuit breaker ?",
      options: [
        "Pour rendre le code plus complexe",
        "Pour éviter d'essayer indéfiniment un service qui est clairement en panne",
        "Pour améliorer les performances",
        "Pour réduire le code",
      ],
      answer: "Pour éviter d'essayer indéfiniment un service qui est clairement en panne",
      explanation:
        "Le circuit breaker ouvre le circuit après un certain nombre d'échecs. Retry peut réessayer, mais le circuit breaker peut stopper les tentatives si le service est hors ligne.",
    },
    {
      question:
        "[Retry Avancé] Quel paramètre permet de limiter le nombre total de tentatives d'un retry ?",
      options: [
        "max_delay",
        "max_attempts (ou max_retries)",
        "timeout",
        "backoff_multiplier",
      ],
      answer: "max_attempts (ou max_retries)",
      explanation:
        "max_attempts ou max_retries définit le nombre maximum de tentatives. Au-delà, l'exception est propagée avec raise.",
    },
  ],
  expert: [
    {
      question:
        "[PIÈGE Retry] Si retry est appliqué sur une fonction qui échoue avec une exception non temporaire (ex: ValueError), que doit faire un bon retry ?",
      options: [
        "Réessayer quand même",
        "Propager immédiatement l'exception (raise) car réessayer ne résoudra pas le problème",
        "Ignorer l'erreur",
        "Réessayer avec un backoff plus long",
      ],
      answer: "Propager immédiatement l'exception (raise) car réessayer ne résoudra pas le problème",
      explanation:
        "Les exceptions de validation (ValueError, TypeError) ne seront pas résolues par une nouvelle tentative. Il faut les propager immédiatement.",
    },
    {
      question:
        "[PIÈGE Retry] Pourquoi utiliser @wraps est-il particulièrement important pour les décorateurs retry ?",
      options: [
        "Pour améliorer les performances",
        "Pour que la fonction décorée garde son nom et sa docstring (utile pour le debugging et la documentation)",
        "Pour que le retry fonctionne",
        "Pour que Python reconnaisse le décorateur",
      ],
      answer: "Pour que la fonction décorée garde son nom et sa docstring (utile pour le debugging et la documentation)",
      explanation:
        "Sans wraps, la fonction perd ses métadonnées. Cela rend le debugging difficile et les outils comme Sphinx ne fonctionnent plus correctement.",
    },
    {
      question:
        "[PIÈGE Retry] Que se passe-t-il si une fonction retry a un effet de bord (ex: écriture en base) et échoue après avoir partiellement effectué son travail ?",
      options: [
        "La fonction est réexécutée depuis le début, ce qui peut causer des doublons",
        "La fonction reprend où elle s'est arrêtée",
        "La fonction ne s'exécute plus",
        "Le retry annule automatiquement les effets de bord",
      ],
      answer: "La fonction est réexécutée depuis le début, ce qui peut causer des doublons",
      explanation:
        "C'est un piège classique : retry réexécute toute la fonction. Si elle a déjà effectué des actions (insertion, envoi), il faut de l'idempotence.",
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
        ? <h3 className="success">🚀 Mission CIB Pricing Pre-Trade maîtrisée !</h3>
        : <p className="fail">📚 Révisez C#, dérivés actions et architecture CIB.</p>
      }
    </div>
  );
};

const Page6_TechInterview = () => {
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
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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
      }, 25000);
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
            CIB Pricing Pre-Trade 🔹 {level === "basic"
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

export default Page6_TechInterview;


