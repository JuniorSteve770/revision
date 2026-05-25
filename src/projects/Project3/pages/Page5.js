// src/projects/Project3/pages/Page5.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "OMS vs TMS vs ORM",
    "answer": "- **OMS** (Order Management System) : Cycle de vie des ordres — saisie, validation, exécution via FIX.- **TMS** (Trade Management System) : Gère la trésorerie, la liquidité, le collatéral et le financement post-trade.- **ORM** (Object-Relational Mapping) : Pont entre objets métier et tables SQL. C# : *Entity Framework Core*. Python : *SQLAlchemy*."
  },
  {
    "question": "Intercommunication Python & C#",
    "answer": "- **Python** : Modèles quantitatifs, machine learning, prototypage (NumPy, Pandas, scipy).- **C#/.NET** : Moteur transactionnel, latence ultra-faible, robustesse multithread.- **Interconnexion** : `gRPC` + Protobuf (binaire, rapide), `RabbitMQ`/`Kafka` (files de messages), `REST` (couplage lâche)."
  },
  {
    "question": "Monolithe Modulaire vs Microservices",
    "answer": "- **Monolithe Modulaire** : Tout dans le même processus. Latence in-process nulle, ACID simple, déploiement unique.- **Microservices** : Processus distribués. Déploiement indépendant, résilience isolée, mais complexité réseau élevée. Transactions distribuées via pattern *Saga*."
  },
  {
    "question": "FIX Protocol vs gRPC",
    "answer": "- **FIX** : Standard textuel mondial (socket TCP) pour ordres bourse. Session robuste : heartbeats, numéros de séquence, replay.- **gRPC** : Protocole binaire interne (HTTP/2) basé sur contrat `.proto`. Idéal pour streamer des Greeks ou des ticks haute fréquence."
  },
  {
    "question": "RabbitMQ vs MSMQ vs Kafka",
    "answer": "- **RabbitMQ** : Broker moderne, distribué, multiplateforme. Routage complexe (exchanges, fan-out). Messages supprimés après traitement.- **Kafka** : Log d'événements immuable. Messages persistés sur disque, rejouables. Idéal pour audit trail et reconstruction de positions.- **MSMQ** : Legacy Windows. Simple mais non scalable."
  },
  {
    "question": "JSON vs XML vs Protobuf",
    "answer": "- **JSON** : Standard REST, lisible, mais volumineux et lent en parsing haute fréquence.- **XML** : Réglementaire : *SWIFT ISO 20022*, *FpML* (dérivés OTC), *XBRL* (rapports BCE/régulateur).- **Protobuf** : Binaire ultra-compact (~6x plus petit que JSON), typé, ultra-rapide CPU. Utilisé avec gRPC."
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
  const lines = text.split(/(?=- \*\*)/);
  const items = [];
  lines.forEach((line, idx) => {
    let clean = line.trim().replace(/^- /, "");
    if (!clean) return;
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    const segments = clean.split(regex);
    const content = segments.map((seg, sIdx) => {
      if (seg.startsWith("**") && seg.endsWith("**")) return <strong key={sIdx}>{seg.slice(2, -2)}</strong>;
      if (seg.startsWith("`") && seg.endsWith("`")) return <code key={sIdx} style={{ backgroundColor: '#eef2f7', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', color: '#e01e5a', fontWeight: 'bold', fontSize: '13px' }}>{seg.slice(1, -1)}</code>;
      if (seg.startsWith("*") && seg.endsWith("*")) return <em key={sIdx}>{seg.slice(1, -1)}</em>;
      return seg;
    });
    if (idx > 0) items.push(<span key={`sep-${idx}`} style={{ color: '#bbb', margin: '0 6px' }}>◆</span>);
    items.push(<span key={idx}>{content}</span>);
  });
  return <span style={{ lineHeight: '1.7' }}>{items}</span>;
};

const Timer = ({ timeLeft }) => (
  <p className="timer">⏳ <span>{timeLeft}s</span></p>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option, index)} className="option-button">
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
      {totalScore >= 2 ? (
        <h3 className="success">🚀 Les composants d'architecture n'ont plus de secret !</h3>
      ) : (
        <p className="fail">📚 Révisez les protocoles et le découplage.</p>
      )}
    </div>
  );
};

const Page5 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const currentQuestions = questions[level];
    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1); setTimeLeft(20); setMessage("");
    } else {
      if (level === "moyen") { setLevel("avance"); } else { setShowResult(true); }
      setCurrentQuestion(0); setTimeLeft(20); setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    } else if (level !== "basic" && timeLeft === 0) { handleNextQuestion(); }
  }, [timeLeft, level, showResult, currentQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen"); setCurrentQuestion(0); setTimeLeft(20); return 0;
        });
      }, 12000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    const current = questions[level][currentQuestion];
    const isCorrect = option === current.answer;
    if (isCorrect) {
      setScores((p) => ({ ...p, [level]: p[level] + 1 }));
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
            Arch & OMS 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
          </h4>
          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} />
          ) : (
            <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page5;
