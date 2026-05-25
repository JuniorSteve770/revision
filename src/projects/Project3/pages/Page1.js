// src/projects/Project3/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Stack vs Heap (Allocation Mémoire C#)",
    "answer": "**Stack** : Stockage LIFO ultra-rapide des types valeur (`struct`, `int`, `double`, refs du heap). Nettoyage auto à la sortie du scope. ◆ **Heap** : Stockage dynamique des types référence (`class`, `string`, `array`). Géré par le Garbage Collector."
  },
  {
    "question": "Moteurs de Pricing & Garbage Collector",
    "answer": "**GC** : Cycle non-déterministe Mark, Sweep, Compact. Bloque l'application (Stop-the-world) en cas de collection majeure (Gen 2 / LOH). ◆ **Impact Finance** : Les pics de latence induits par le GC détruisent les performances de trading."
  },
  {
    "question": "Générations GC & Large Object Heap (LOH)",
    "answer": "**Gen 0** : Objets éphémères (collectes rapides). ◆ **Gen 1** : Zone tampon. ◆ **Gen 2** : Objets durables (Singletons, Caches). ◆ **LOH** : Objets > 85 Ko alloués directement en Gen 2. Pas de compaction par défaut (fragmentation)."
  },
  {
    "question": "Libération des Ressources & IDisposable",
    "answer": "**Dispose()** : Libère immédiatement les connexions DB ou sockets réseau sans attendre le GC. ◆ **GC.SuppressFinalize(this)** : Empêche le GC d'appeler le finaliseur, économisant un cycle coûteux de promotion en Gen 2."
  },
  {
    "question": "Points d'arrêt & Débogage Avancé",
    "answer": "**Conditionnel** : Filtre sur condition logique (ex: `trade.Quantity > 1000000`). ◆ **Hit Count** : Stop au N-ième passage. ◆ **Tracepoint** : Log un message dans la console de debug sans stopper l'exécution."
  },
  {
    "question": "Navigation & Outils de Profilage VS",
    "answer": "**F10/F11** : Step over / Step into. ◆ **Maj+F11** : Step out. ◆ **Parallel Stacks** : Visualise les deadlocks multi-threads. ◆ **Memory Usage** : Permet de comparer des snapshots pour identifier les fuites de mémoire."
  }
];

const questions = {
  moyen: [
    {
      "question": "Dans un moteur de market data C#, comment éviter les allocations excessives dans la Gen 0 lors de la réception de millions de ticks par seconde ?",
      "options": [
        "En appelant GC.Collect() après chaque tick reçu",
        "En utilisant l'ArrayPool<byte> pour recycler les buffers de désérialisation",
        "En remplaçant tous les structs par des classes",
        "En passant toutes les méthodes de pricing en statique"
      ],
      "answer": "En utilisant l'ArrayPool<byte> pour recycler les buffers de désérialisation",
      "explanation": "L'utilisation de pools de buffers (ArrayPool) permet de réutiliser la mémoire plutôt que d'allouer de nouveaux objets en permanence, ce qui réduit la pression sur la Gen 0 et évite les pauses GC."
    },
    {
      "question": "Quelle est la conséquence de l'absence d'appel à SuppressFinalize dans la méthode Dispose() d'un wrapper de bibliothèque C++ quantitative ?",
      "options": [
        "L'application lève immédiatement une NullReferenceException",
        "L'objet est promu en Gen 2 et son nettoyage par le GC est retardé",
        "La mémoire non managée ne sera jamais libérée",
        "La compilation échoue"
      ],
      "answer": "L'objet est promu en Gen 2 et son nettoyage par le GC est retardé",
      "explanation": "Sans SuppressFinalize, le GC doit exécuter le finaliseur de l'objet, ce qui l'oblige à survivre à la collecte courante et à être promu à la génération suivante."
    },
    {
      "question": "Quel outil de débogage Visual Studio permet d'identifier quel thread détient un verrou bloquant un autre thread ?",
      "options": [
        "La fenêtre de Watch",
        "La fenêtre Parallel Stacks",
        "Le Snapshot Debugger",
        "La console Immediate"
      ],
      "answer": "La fenêtre Parallel Stacks",
      "explanation": "Parallel Stacks regroupe les threads par pile d'appels et met en évidence graphiquement les conflits de verrous (deadlocks) et les attentes de synchronisation."
    }
  ],
  avance: [
    {
      "question": "Pourquoi l'allocation fréquente de tableaux de double de grande taille (ex: double[12000]) dans un calcul de risque de Monte Carlo provoque-t-elle des plantages OutOfMemory ?",
      "options": [
        "Parce que double est un type valeur non supporté par la Heap",
        "Parce qu'ils sont alloués sur le Large Object Heap (LOH) qui se fragmente rapidement sans compaction automatique",
        "Parce que le GC ne collecte jamais les objets de plus de 50 Ko",
        "Parce que le thread pool sature à cause des calculs"
      ],
      "answer": "Parce qu'ils sont alloués sur le Large Object Heap (LOH) qui se fragmente rapidement sans compaction automatique",
      "explanation": "Les objets de plus de 85 000 octets (comme un double[12000] qui pèse 96 Ko) vont directement sur le LOH. Comme le LOH n'est pas compacté par défaut, l'allocation répétée crée des trous et provoque un OutOfMemory."
    },
    {
      "question": "Comment profiler une application de trading à ultra-basse latence en production sans perturber le trafic réel ?",
      "options": [
        "En attachant Visual Studio Enterprise avec le Snapshot Debugger pour capturer l'état sans bloquer le processus",
        "En exécutant GC.Collect() à intervalles réguliers",
        "En activant le mode Debug en production",
        "En utilisant des Console.WriteLine sur chaque transaction"
      ],
      "answer": "En attachant Visual Studio Enterprise avec le Snapshot Debugger pour capturer l'état sans bloquer le processus",
      "explanation": "Le Snapshot Debugger prend un instantané de la mémoire lors du déclenchement d'une règle (ex: exception ou latence élevée) en quelques millisecondes, puis détache le débogueur pour laisser l'application tourner."
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
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Niveau senior validé.</h3> : <p className="fail">📚 Révisez les mécanismes de gestion de mémoire.</p>}
    </div>
  );
};

const Page1 = () => {
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
            GC & Debug C# 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
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

export default Page1;
