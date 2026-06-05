// src/projects/Project3/pages/Page4.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "POO — Encapsulation & Abstraction",
    "answer": "**Encapsulation** : Masquer l'état interne. Mots-clés : `private` (champs), `public` (propriétés), `get`/`set` (contrôle). ◆ **Abstraction** : Exposer uniquement l'essentiel. Mots-clés : `interface` (contrat pur sans état), `abstract` (classe hybride avec état/comportement)."
  },
  {
    "question": "POO — Héritage & Polymorphisme",
    "answer": "**Héritage** : `:` (étendre), `base` (accès parent), `protected` (visible par les enfants). ◆ **Polymorphisme** : `virtual` (autorise la redéfinition), `override` (redéfinit), `new` (masque)."
  },
  {
    "question": "SOLID — S, O, L",
    "answer": "**SRP** (Single Responsibility) : 1 seule raison de changer. Classes hautement cohésives. ◆ **OCP** (Open/Closed) : Ouvert à l'extension, fermé à la modification. Utiliser `interface` + polymorphisme. ◆ **LSP** (Liskov Substitution) : Un enfant remplace son parent sans casser le programme. Éviter `throw new NotImplementedException()`."
  },
  {
    "question": "SOLID — I, D & Injection C#",
    "answer": "**ISP** (Interface Segregation) : Plusieurs interfaces ciblées > une interface obèse. ◆ **DIP** (Dependency Inversion) : Dépendre d'abstractions. Durées de vie DI : `AddTransient` (recréé à chaque fois), `AddScoped` (par requête), `AddSingleton` (unique dans le process)."
  },
  {
    "question": "ACID — Transactions",
    "answer": "**A**tomicity (tout ou rien), **C**onsistency (état valide), **I**solation (indépendance), **D**urability (persistance). ◆ C# : `TransactionScope` (atomicité), `IsolationLevel.ReadCommitted` (pas de dirty reads), `IsolationLevel.Serializable` (le plus strict)."
  },
  {
    "question": "Design Patterns — Création (Builder & Singleton)",
    "answer": "**Builder** : Construction d'objets complexes étape par étape. Fluent API : `builder.AddA().AddB().Build()`. ◆ **Singleton** : Instance unique. C# : `Lazy<T>` pour être thread-safe sans `lock` explicite."
  },
  {
    "question": "Design Patterns — Comportement (Observer & Strategy)",
    "answer": "**Observer** : Notifier des abonnés sur un événement. C# : `event`, `EventHandler`, `IObservable<T>`. ◆ **Strategy** : Alterner d'algorithme à la volée. C# : injection d'interface (`IPricingStrategy`) au runtime."
  },
  {
    "question": "Design Patterns — Comportement & Accès (Chain of Resp & Repository)",
    "answer": "**Chain of Responsibility** : Valider en cascade via handlers chaînés. Chaque handler = 1 seule règle (SRP). ◆ **Repository** : Abstraire l'accès aux données (`ITradeRepository`). Découple le code métier d'Entity Framework Core (`DbContext`)."
  }
];

const questions = {
  moyen: [
    {
      "question": "Quelle est la différence fondamentale entre une interface et une classe abstraite en C# ?",
      "options": [
        "Une interface peut stocker des champs d'état, pas une classe abstraite.",
        "Une classe abstraite peut contenir du code et des champs d'état, tandis qu'une interface ne définit qu'un contrat pur.",
        "Une interface est thread-safe par défaut.",
        "On peut hériter de plusieurs classes abstraites."
      ],
      "answer": "Une classe abstraite peut contenir du code et des champs d'état, tandis qu'une interface ne définit qu'un contrat pur.",
      "explanation": "C# n'autorise pas l'héritage multiple de classes mais permet d'implémenter plusieurs interfaces. Les classes abstraites sont idéales pour partager de l'état/code commun dans une hiérarchie."
    },
    {
      "question": "Quelle durée de vie DI crée une unique instance partagée par toute l'application ?",
      "options": ["Transient (AddTransient)", "Scoped (AddScoped)", "Singleton (AddSingleton)", "Static (AddStatic)"],
      "answer": "Singleton (AddSingleton)",
      "explanation": "AddSingleton crée une instance unique vivant pendant toute la durée du processus. AddScoped est par requête HTTP, AddTransient recrée à chaque injection."
    },
    {
      "question": "Quel principe SOLID est violé si 'Pingouin' hérite de 'Oiseau' mais jette une exception dans 'Voler()' ?",
      "options": ["Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle", "Dependency Inversion Principle"],
      "answer": "Liskov Substitution Principle",
      "explanation": "Le LSP exige qu'un enfant puisse remplacer son parent sans casser le programme. Jeter NotImplementedException viole ce principe."
    }
  ],
  avance: [
    {
      "question": "En C#, comment implémenter un Singleton thread-safe sans lock explicite ?",
      "options": [
        "En déclarant l'instance volatile dans le constructeur.",
        "En utilisant Lazy<T> avec l'initialisation tardive thread-safe intégrée par .NET.",
        "En marquant la classe avec le mot-clé static uniquement.",
        "En sérialisant l'accès via un mutex distribué."
      ],
      "answer": "En utilisant Lazy<T> avec l'initialisation tardive thread-safe intégrée par .NET.",
      "explanation": "Lazy<T> garantit nativement qu'un seul thread peut instancier l'objet, protégeant l'unicité du Singleton sans verrous manuels."
    },
    {
      "question": "Dans ACID, quel IsolationLevel protège contre les Dirty Reads mais autorise les Phantom Reads ?",
      "options": ["ReadUncommitted", "ReadCommitted", "RepeatableRead", "Serializable"],
      "answer": "ReadCommitted",
      "explanation": "ReadCommitted empêche la lecture de transactions non validées. Pour éviter les Phantom Reads, il faut Serializable ou RepeatableRead."
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
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Principes SOLID & design patterns validés.</h3> : <p className="fail">📚 Révisez la conception de code.</p>}
    </div>
  );
};

const Page4 = () => {
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

export default Page4;
