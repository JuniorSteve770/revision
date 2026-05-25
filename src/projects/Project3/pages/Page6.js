// src/projects/Project3/pages/Page6.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "async / await & Task",
    "answer": "- **async / await** : Libère le thread courant pendant l'I/O (BDD, sockets). Le thread est rendu au pool et la méthode reprend sur un thread disponible après la réponse.- **Task.WhenAll(t1, t2)** : Lance plusieurs tâches indépendantes en parallèle et attend leur complétion commune.- **Task.Run(() => ...)** : Pousse du calcul CPU-bound sur le thread pool."
  },
  {
    "question": "lock (Monitor) — Synchronisation synchrone",
    "answer": "- **lock(obj) { ... }** : Accès exclusif à une ressource partagée. Synchrone — le thread attend activement (spin-wait).- *Règle* : Sections critiques ultra-courtes seulement (quelques µs). JAMAIS d'`await` à l'intérieur — risque de deadlock garanti."
  },
  {
    "question": "SemaphoreSlim — Synchronisation asynchrone",
    "answer": "- **SemaphoreSlim(1,1)** : Équivalent asynchrone du `lock`. Suspend le thread de façon non-bloquante.- *Usage* : `await _semaphore.WaitAsync();` puis `finally { _semaphore.Release(); }`. Indispensable dans du code `async/await`."
  },
  {
    "question": "ReaderWriterLockSlim — N lecteurs / 1 écrivain",
    "answer": "- **EnterReadLock()** / **ExitReadLock()** : Autorise N lectures concurrentes.- **EnterWriteLock()** / **ExitWriteLock()** : Accès exclusif à l'écriture, bloque les lecteurs.- *Cas typique* : Cache de prix Bloomberg lu par 50 threads de calcul, écrit par 1 thread de feed."
  },
  {
    "question": "Parallel.ForEach — Parallélisme CPU-bound",
    "answer": "- **Parallel.ForEach(list, item => ...)** : Distribue le traitement sur tous les cœurs CPU.- *Quand l'utiliser* : Calcul intensif sans I/O (Monte Carlo, Black-Scholes sur 10 000 options).- *Éviter* : Sur les opérations I/O-bound — utiliser `async/await` + `Task.WhenAll` à la place."
  },
  {
    "question": "Channel<T> & BackgroundService — Pipelines",
    "answer": "- **Channel<T>** : File d'attente mémoire thread-safe et async. Lie un producteur (flux FIX entrant) à un consommateur (moteur de booking) sans bloquer.- **BackgroundService** : Service résident .NET, tourne indéfiniment. Arrêt propre via `CancellationToken` (`stoppingToken.IsCancellationRequested`)."
  },
  {
    "question": "ConcurrentDictionary & Interlocked",
    "answer": "- **ConcurrentDictionary<K,V>** : Dictionnaire thread-safe natif. Méthodes atomiques : `AddOrUpdate`, `GetOrAdd`.- **Interlocked.Increment(ref count)** : Incrémentation atomique d'un compteur sans `lock`. Extrêmement rapide (instruction CPU atomique)."
  }
];

const questions = {
  moyen: [
    {
      "question": "Quel mécanisme est idéal pour un cache de prix lu par 50 threads et écrit par 1 seul thread ?",
      "options": ["lock standard (lock(obj))", "ReaderWriterLockSlim", "SemaphoreSlim(1,1)", "volatile seul"],
      "answer": "ReaderWriterLockSlim",
      "explanation": "ReaderWriterLockSlim autorise les lectures parallèles non-bloquantes et garantit l'exclusivité uniquement lors des écritures du flux Bloomberg."
    },
    {
      "question": "Pourquoi est-il interdit d'appeler await dans un bloc lock en C# ?",
      "options": [
        "await n'est supporté que pour les types decimal.",
        "L'exécution peut reprendre sur un autre thread, rendant impossible la libération du verrou original — deadlock garanti.",
        "lock ralentit le Garbage Collector.",
        "lock est restreint à Entity Framework."
      ],
      "answer": "L'exécution peut reprendre sur un autre thread, rendant impossible la libération du verrou original — deadlock garanti.",
      "explanation": "lock est lié au thread physique courant. Après un await, le thread change. Il faut utiliser SemaphoreSlim.WaitAsync() dans du code async."
    }
  ],
  avance: [
    {
      "question": "Quand doit-on préférer Task.WhenAll à Parallel.ForEach ?",
      "options": [
        "Pour des calculs Monte Carlo sur 10 000 scénarios.",
        "Pour des opérations I/O-bound concurrentes (1 000 appels HTTP ou requêtes DB en parallèle).",
        "Pour des traitements séquentiels avec dépendances de données.",
        "Pour forcer l'exécution mono-thread sur un seul cœur."
      ],
      "answer": "Pour des opérations I/O-bound concurrentes (1 000 appels HTTP ou requêtes DB en parallèle).",
      "explanation": "Parallel.ForEach bloque des threads pour de l'I/O — contre-productif. Task.WhenAll avec async/await libère les threads pendant l'attente réseau, permettant des milliers d'appels concurrents sans saturer le thread pool."
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
        <h3 className="success">🚀 Vous maîtrisez la concurrence C# !</h3>
      ) : (
        <p className="fail">📚 Revoyez les différences entre verrous synchrones et asynchrones.</p>
      )}
    </div>
  );
};

const Page6 = () => {
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
            C# Concurrence 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
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

export default Page6;
