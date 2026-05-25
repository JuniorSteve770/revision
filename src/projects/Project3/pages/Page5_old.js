// src/projects/Project3/pages/Page5.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "OMS vs TMS vs ORM",
    "answer": "**OMS** (Order Management System) : Cycle de vie des ordres — saisie, validation, exécution via FIX. ◆ **TMS** (Trade Management System) : Gère la trésorerie, la liquidité, le collatéral et le financement post-trade. ◆ **ORM** (Object-Relational Mapping) : Pont entre objets métier et tables SQL. C# : *Entity Framework Core*. Python : *SQLAlchemy*."
  },
  {
    "question": "Intercommunication Python & C#",
    "answer": "**Python** : Modèles quantitatifs, machine learning, prototypage (NumPy, Pandas, scipy). ◆ **C#/.NET** : Moteur transactionnel, latence ultra-faible, robustesse multithread. ◆ **Interconnexion** : `gRPC` + Protobuf (binaire, rapide), `RabbitMQ`/`Kafka` (files de messages), `REST` (couplage lâche)."
  },
  {
    "question": "Monolithe Modulaire vs Microservices",
    "answer": "**Monolithe Modulaire** : Tout dans le même processus. Latence in-process nulle, ACID simple, déploiement unique. ◆ **Microservices** : Processus distribués. Déploiement indépendant, résilience isolée, mais complexité réseau élevée. Transactions distribuées via pattern *Saga*."
  },
  {
    "question": "FIX Protocol vs gRPC",
    "answer": "**FIX** : Standard textuel mondial (socket TCP) pour ordres bourse. Session robuste : heartbeats, numéros de séquence, replay. ◆ **gRPC** : Protocole binaire interne (HTTP/2) basé sur contrat `.proto`. Idéal pour streamer des Greeks ou des ticks haute fréquence."
  },
  {
    "question": "RabbitMQ vs MSMQ vs Kafka",
    "answer": "**RabbitMQ** : Broker moderne, distribué, multiplateforme. Routage complexe (exchanges, fan-out). Messages supprimés après traitement. ◆ **Kafka** : Log d'événements immuable. Messages persistés sur disque, rejouables. Idéal pour audit trail et reconstruction de positions. ◆ **MSMQ** : Legacy Windows. Simple mais non scalable."
  },
  {
    "question": "JSON vs XML vs Protobuf",
    "answer": "**JSON** : Standard REST, lisible, mais volumineux et lent en parsing haute fréquence. ◆ **XML** : Réglementaire : *SWIFT ISO 20022*, *FpML* (dérivés OTC), *XBRL* (rapports BCE/régulateur). ◆ **Protobuf** : Binaire ultra-compact (~6x plus petit que JSON), typé, ultra-rapide CPU. Utilisé avec gRPC."
  }
];

const questions = {
  moyen: [
    {
      "question": "Quel standard XML décrit les paramètres des dérivés OTC (Swaps, CDS) ?",
      "options": ["FpML (Financial products Markup Language)", "ISO 20022", "XBRL", "Protobuf"],
      "answer": "FpML (Financial products Markup Language)",
      "explanation": "FpML est le format XML mondial pour décrire les dérivés de taux (IRS), crédit (CDS), et actions OTC."
    },
    {
      "question": "Pourquoi préfère-t-on RabbitMQ/Kafka à un appel HTTP direct entre Python et C# ?",
      "options": [
        "HTTP n'autorise pas les nombres décimaux.",
        "Pour découpler les services : si le service Python est indisponible, les messages s'accumulent sans bloquer l'OMS C#.",
        "Les brokers convertissent le code Python en C# automatiquement.",
        "HTTP/2 est restreint au format XML."
      ],
      "answer": "Pour découpler les services : si le service Python est indisponible, les messages s'accumulent sans bloquer l'OMS C#.",
      "explanation": "L'architecture événementielle asynchrone offre isolation aux pannes et absorbe les pics du marché."
    }
  ],
  avance: [
    {
      "question": "Dans une architecture microservices, quel pattern compense l'absence de transaction ACID distribuée ?",
      "options": ["Le pattern Repository", "Le pattern Saga (avec transactions compensatoires locales)", "Le pattern Singleton thread-safe", "Le pattern Observer distribué"],
      "answer": "Le pattern Saga (avec transactions compensatoires locales)",
      "explanation": "Le pattern Saga coordonne des transactions locales successives. Si une étape échoue, la Saga déclenche des compensations (annulations logiques) pour rétablir la cohérence."
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
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Composants système maîtrisés.</h3> : <p className="fail">📚 Révisez l'architecture système.</p>}
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

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") { setLevel("avance"); } else { setShowResult(true); }
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

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
            Arch & OMS 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
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
