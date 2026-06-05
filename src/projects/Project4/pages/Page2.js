// src/projects/Project3/pages/Page2.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "SOLID en Finance de Marché",
    "answer": "**SRP** : `TradeValidator` valide, `TradeRepository` persiste. Pas de classe fourre-tout. ◆ **OCP** : Ajouter un nouveau type d'option (ex: *BarrierOption*) sans modifier le moteur de pricing existant en utilisant une interface `IPricingEngine`."
  },
  {
    "question": "SOLID — LSP, ISP, DIP",
    "answer": "**LSP** : Une classe dérivée `FutureContract` ne doit pas lever de `NotImplementedException` sur des méthodes de son parent `FinancialInstrument`. ◆ **ISP** : Diviser les interfaces volumineuses. `IFixSender` séparé de `IFixReceiver`. ◆ **DIP** : Les contrôleurs dépendent de l'interface `IBookingService`, pas d'une classe d'implémentation directe."
  },
  {
    "question": "Piliers de la POO",
    "answer": "**Encapsulation** : Restreindre l'accès direct aux champs de position via des accesseurs `get/set` contrôlant les limites de risque. ◆ **Abstraction** : Exposer un contrat d'exécution `IExecutionVenue` sans exposer le protocole réseau sous-jacent (FIX, API REST)."
  },
  {
    "question": "Piliers de la POO — Héritage & Polymorphisme",
    "answer": "**Héritage** : Réutiliser le code commun (ex: `BaseOrder` étendu en `MarketOrder` et `LimitOrder`). ◆ **Polymorphisme** : Appeler une méthode de pricing `Price()` sur une collection d'instruments génériques `List<FinancialInstrument>`."
  },
  {
    "question": "Thread vs Task (Gestion Asynchrone)",
    "answer": "**Thread** : Ressource physique lourde gérée par l'OS (1 Mo de stack). ◆ **Task** : Abstraction logique légère gérée par le `TaskScheduler` de .NET sur un thread pool. Idéal pour optimiser l'I/O réseau des flux d'ordres."
  },
  {
    "question": "LINQ vs PLINQ en Trading",
    "answer": "**LINQ** : Requêtes expressives et lisibles sur des flux de données en mémoire. ◆ **PLINQ** : Exécution parallèle automatique sur plusieurs cœurs physiques du processeur. Idéal pour traiter de gros volumes de trades historiques ou calculer des statistiques de portefeuille."
  }
];

const questions = {
  moyen: [
    {
      "question": "Comment applique-t-on le principe Open/Closed (OCP) lors du développement d'un système de calcul de taxes sur les transactions financières ?",
      "options": [
        "En ajoutant des blocs if-else dans la classe principale à chaque nouveau pays fiscal",
        "En créant une interface ITaxCalculator implémentée par des classes de calcul spécifiques à chaque juridiction",
        "En rendant toutes les variables de calcul globales et statiques",
        "En sérialisant les données fiscales en JSON"
      ],
      "answer": "En créant une interface ITaxCalculator implémentée par des classes de calcul spécifiques à chaque juridiction",
      "explanation": "Pour ajouter de nouveaux pays sans modifier le code existant, on injecte une liste de ITaxCalculator. Le code est fermé à la modification mais ouvert à l'extension par ajout de classes."
    },
    {
      "question": "Quelle méthode de pricing enfreint le principe de Substitution de Liskov (LSP) ?",
      "options": [
        "Une méthode Price() qui calcule le prix d'un Swap de taux",
        "Une classe EuropeanOption héritant d'Option qui lève NotImplementedException dans sa méthode exerciseEarly()",
        "Une classe dérivée qui renvoie un nombre décimal",
        "L'utilisation de méthodes virtuelles"
      ],
      "answer": "Une classe EuropeanOption héritant d'Option qui lève NotImplementedException dans sa méthode exerciseEarly()",
      "explanation": "LSP stipule que le comportement du parent doit être préservé. Jeter une exception pour une méthode essentielle de la classe de base montre une mauvaise hiérarchie (une option européenne ne supporte pas l'exercice anticipé)."
    },
    {
      "question": "Pourquoi PLINQ peut-il parfois être plus lent qu'un simple LINQ synchrone sur une collection de transactions ?",
      "options": [
        "Parce que PLINQ n'est pas optimisé pour les processeurs modernes",
        "À cause du coût de synchronisation, du découpage des threads et de la fusion des résultats sur des collections de petite taille",
        "Parce que PLINQ bloque le Garbage Collector pendant le calcul",
        "Parce que PLINQ nécessite une licence Microsoft payante"
      ],
      "answer": "À cause du coût de synchronisation, du découpage des threads et de la fusion des résultats sur des collections de petite taille",
      "explanation": "Pour de petites collections, le temps passé à distribuer les tâches sur différents threads et à rassembler les résultats (surcharge de coordination) dépasse le gain de performance du calcul parallèle."
    }
  ],
  avance: [
    {
      "question": "Vous implémentez un moteur d'arbitrage qui écoute 5 flux de prix externes. Comment orchestrer les appels asynchrones pour réagir dès que l'un d'entre eux répond, sans attendre les autres ?",
      "options": [
        "En faisant un Task.WaitAll()",
        "En utilisant await Task.WhenAny(tasks) pour récupérer et traiter la première tâche complétée",
        "En lançant des Threads en boucle infinie avec Thread.Sleep(1)",
        "En utilisant Parallel.ForEach"
      ],
      "answer": "En utilisant await Task.WhenAny(tasks) pour récupérer et traiter la première tâche complétée",
      "explanation": "Task.WhenAny renvoie la première tâche terminée parmi une liste de tâches en cours. C'est le pattern standard pour réagir immédiatement à l'opportunité de marché la plus rapide."
    },
    {
      "question": "Dans le cadre du multithreading .NET, quel est le danger d'exécuter un code LINQ paresseux (Deferred Execution) accédant à une liste partagée modifiable sans verrou ?",
      "options": [
        "La liste est automatiquement vidée",
        "Une InvalidOperationException ('Collection was modified') ou une corruption silencieuse des index au moment de l'évaluation",
        "Le Garbage Collector s'arrête",
        "La variable de retour devient nulle"
      ],
      "answer": "Une InvalidOperationException ('Collection was modified') ou une corruption silencieuse des index au moment de l'évaluation",
      "explanation": "LINQ n'exécute le filtre/projection qu'au moment de l'itération (ex: ToList() ou foreach). Si un autre thread modifie la collection sous-jacente entre-temps, une exception de concurrence se produit."
    }
  ]
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

  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = cleanText.split(regex);

  return (
    <span style={{ display: 'inline', lineHeight: '1.5' }}>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={idx} style={{ 
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
          return <em key={idx} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
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
      <p>✅ Moyen : {scores.moyen} | ✅ Avancé : {scores.avance}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Félicitations ! Principes SOLID & concurrence maîtrisés.</h3> : <p className="fail">📚 Révisez la POO et le parallélisme.</p>}
    </div>
  );
};

const Page2 = () => {
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
            SOLID & POO 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
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

export default Page2;