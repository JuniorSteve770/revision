// src/projects/Project3/pages/Page6.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "async / await & Task",
    "answer": "**async / await** : Libère le thread courant pendant l'I/O (BDD, sockets). Le thread est rendu au pool et la méthode reprend sur un thread disponible après la réponse. ◆ **Task.WhenAll(t1, t2)** : Lance plusieurs tâches indépendantes en parallèle et attend leur complétion commune. ◆ **Task.Run(() => ...)** : Pousse du calcul CPU-bound sur le thread pool."
  },
  {
    "question": "lock (Monitor) — Synchronisation synchrone",
    "answer": "**lock(obj) { ... }** : Accès exclusif à une ressource partagée. Synchrone — le thread attend activement (spin-wait). ◆ *Règle* : Sections critiques ultra-courtes seulement (quelques µs). JAMAIS d'`await` à l'intérieur — risque de deadlock garanti."
  },
  {
    "question": "SemaphoreSlim — Synchronisation asynchrone",
    "answer": "**SemaphoreSlim(1,1)** : Équivalent asynchrone du `lock`. Suspend le thread de façon non-bloquante. ◆ *Usage* : `await _semaphore.WaitAsync();` puis `finally { _semaphore.Release(); }`. Indispensable dans du code `async/await`."
  },
  {
    "question": "ReaderWriterLockSlim — N lecteurs / 1 écrivain",
    "answer": "**EnterReadLock()** / **ExitReadLock()** : Autorise N lectures concurrentes. ◆ **EnterWriteLock()** / **ExitWriteLock()** : Accès exclusif à l'écriture, bloque les lecteurs. ◆ *Cas typique* : Cache de prix Bloomberg lu par 50 threads de calcul, écrit par 1 thread de feed."
  },
  {
    "question": "Parallel.ForEach — Parallélisme CPU-bound",
    "answer": "**Parallel.ForEach(list, item => ...)** : Distribue le traitement sur tous les cœurs CPU. ◆ *Quand l'utiliser* : Calcul intensif sans I/O (Monte Carlo, Black-Scholes sur 10 000 options). ◆ *Éviter* : Sur les opérations I/O-bound — utiliser `async/await` + `Task.WhenAll` à la place."
  },
  {
    "question": "Channel<T> & BackgroundService — Pipelines",
    "answer": "**Channel<T>** : File d'attente mémoire thread-safe et async. Lie un producteur (flux FIX entrant) à un consommateur (moteur de booking) sans bloquer. ◆ **BackgroundService** : Service résident .NET, tourne indéfiniment. Arrêt propre via `CancellationToken` (`stoppingToken.IsCancellationRequested`)."
  },
  {
    "question": "ConcurrentDictionary & Interlocked",
    "answer": "**ConcurrentDictionary<K,V>** : Dictionnaire thread-safe natif. Méthodes atomiques : `AddOrUpdate`, `GetOrAdd`. ◆ **Interlocked.Increment(ref count)** : Incrémentation atomique d'un compteur sans `lock`. Extrêmement rapide (instruction CPU atomique)."
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
      "explanation": "lock is tied to the current physical thread. After an await, the thread can change. Therefore, it is forbidden to use await in a lock block. Use SemaphoreSlim instead."
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
      "explanation": "Parallel.ForEach blocks physical threads for I/O operations. Task.WhenAll with async/await releases the thread pool threads during network wait, which is much more efficient."
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
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Concurrence C# maîtrisée.</h3> : <p className="fail">📚 Révisez la synchronisation de threads.</p>}
    </div>
  );
};

const Page6 = () => {
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
            C# Concurrence 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
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

export default Page6;
