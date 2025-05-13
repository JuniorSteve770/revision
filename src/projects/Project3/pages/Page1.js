// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie Pile Stack GC et Mecanisme de Gestion d'erreur
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "Différences entre stack et heap ? Quels types y sont stockés ?",
    "answer": "**Stack** : mémoire rapide, stocke les **types valeur** (`int`, `bool`, `struct`). **Heap** : mémoire lente, gérée par le **Garbage Collector**, stocke les **types référence** (`class`, `string`, `array`)."
  },
  {
    "question": "Que contient la stack et la heap lors d’un appel d’objet ?",
    "answer": "La **stack** contient la **référence** de l’objet, la **heap** contient l’**instance**. Exemple : `string s = \"abc\";` → s est sur la stack, mais l’objet string est sur le heap."
  },
  {
    "question": "Rôle et fonctionnement du Garbage Collector (GC) ?",
    "answer": "Le **GC** libère la mémoire des objets **inaccessibles** du heap. Fonctionne par cycles : **Mark**, **Sweep**, **Compact**. Optimisé pour limiter l'impact sur les performances."
  },
  {
    "question": "Quelles sont les 3 générations du GC et leur rôle ?",
    "answer": "**Gen 0** : objets récents. **Gen 1** : objets survivants. **Gen 2** : objets durables (singleton, cache). Plus la génération est élevée, moins le GC la collecte souvent."
  },
  {
    "question": "Dispose() vs Finalize() : quand et pourquoi les utiliser ?",
    "answer": "**Dispose()** : appel manuel, rapide, pour libérer des **ressources non managées**. **Finalize()** : déclenché par le **GC**, lent et non garanti. Implémenter `IDisposable` pour contrôler la libération."
  },
  {
    "question": "Comment garantir l’appel de Dispose() automatiquement ?",
    "answer": "Utiliser le mot-clé **`using`** : exécute `Dispose()` à la fin du bloc. Ex : `using (var f = new StreamReader(...)) { }` → fichier automatiquement fermé."
  },
  {
    "question": "Pourquoi éviter GC.Collect() et les cycles de référence ?",
    "answer": "**GC.Collect()** force la collecte manuellement, ce qui **détériore les performances**. Les **références circulaires** compliquent le nettoyage automatique par le GC."
  },
  {
    "question": "Quelles ressources doivent être libérées manuellement ?",
    "answer": "**Ressources non managées** : fichiers, sockets, connexions. Sans `Dispose()`, on risque des **fuites mémoire** ou un **verrouillage système**."
  },
  {
    "question": "Différences entre type valeur et référence à l'affectation ?",
    "answer": "**Valeur** : copie du contenu (ex : `int a = b`). **Référence** : copie de l’**adresse mémoire**, les deux variables pointent vers le **même objet** sur le heap."
  },
  {
    "question": "Métaphores pédagogiques pour stack et heap ?",
    "answer": "**Stack** : pile d’assiettes (LIFO, rapide). **Heap** : entrepôt géré par un robot (GC) qui nettoie les objets inutilisés."
  },
    {
    "question": "PARTIE débogueur Visual STUDIO ",
    "answer": ""
  },
  {
    "question": "Quels sont les types de points d'arrêt (standard/conditionnel/fonctionnel) et comment inspecter une variable rapidement ?",
    "answer": "Points d'arrêt : 1) Standard (ligne), 2) Conditionnel (if x>5), 3) Fonctionnel (appel méthode). Inspection : Infobulles (survol) ou fenêtres Autos/Locals. Mots-clés : Breakpoint, variable contextuelle."
  },
  {
    "question": "Différence F10/F11 et utilité de Maj+F11 ?",
    "answer": "F10 (ignore les fonctions), F11 (entre dans les fonctions), Maj+F11 (sort de la fonction actuelle). Mots-clés : Pas à pas, granularité. Exemple : F10 pour éviter System.*."
  },
  {
    "question": "Comment redémarrer vite un débogage (Ctrl+Maj+F5) et exécuter jusqu'au curseur ?",
    "answer": "Redémarrage : Ctrl+Maj+F5. Exécution rapide : Ctrl+F10 ou bouton 'Run to Cursor'. Optimise les tests itératifs sans points d'arrêt."
  },
  {
    "question": "Quels outils pour déboguer en prod (Snapshot) et analyser l'historique (IntelliTrace) ?",
    "answer": "Snapshot Debugger : Capture l'état en prod. IntelliTrace : 'Machine à remonter le temps'. Mots-clés : Enterprise, diagnostics temps réel."
  },
  {
    "question": "Modifier du code à chaud (Edit and Continue) et déboguer du cloud (Azure) ?",
    "answer": "Hot edit : Edit and Continue (C#) / Hot Reload (XAML). Cloud : Attacher le débogueur à Azure App Service. Prérequis : Symboles de debug."
  },
  {
    "question": "Comment utiliser la pile des appels et surveiller des expressions complexes ?",
    "answer": "Call Stack (Alt+7) pour le flux d'exécution. Watch pour expressions (ex: items.Count(x=>x.IsActive)). Mots-clés : Hiérarchie, évaluation dynamique."
  },
  {
    "question": "Outils de performance (CPU/Mémoire) et assistance IA (Copilot) ?",
    "answer": "Diagnostics Tools (Alt+F2) : CPU Usage et Memory Analyzer. Copilot : Explications d'erreurs via 'Ask Copilot'. Nécessite abonnement."
  },

];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

   {
    "question": "Quel type de point d'arrêt se déclenche uniquement si une condition est vraie ?",
    "options": [
      "Point d'arrêt standard",
      "Point d'arrêt conditionnel",
      "Point d'arrêt fonctionnel",
      "Point d'arrêt temporaire"
    ],
    "answer": "Point d'arrêt conditionnel",
    "explanation": "Un point d'arrêt conditionnel (ex: 'if x > 5') permet de cibler des cas spécifiques sans interrompre l'exécution à chaque passage."
  },
  {
    "question": "Quelle touche permet d'ignorer le code des fonctions appelées pendant le débogage ?",
    "options": [
      "F5",
      "F10",
      "F11",
      "F9"
    ],
    "answer": "F10",
    "explanation": "F10 (Pas à pas principal) évite d'entrer dans les fonctions secondaires, contrairement à F11 (Pas à pas détaillé) qui explore chaque appel."
  },
  {
    "question": "Comment afficher rapidement la valeur d'une variable sans ajouter de watch ?",
    "options": [
      "Double-cliquer sur la variable",
      "Survoler la variable avec la souris",
      "Appuyer sur Ctrl+W",
      "Utiliser la fenêtre Call Stack"
    ],
    "answer": "Survoler la variable avec la souris",
    "explanation": "Les infobulles de données (data tips) apparaissent au survol et fournissent un accès instantané aux valeurs des variables."
  },
  {
    "question": "Quel outil permet de capturer l'état d'une application en production sans l'interrompre ?",
    "options": [
      "IntelliTrace",
      "Snapshot Debugger",
      "Hot Reload",
      "Diagnostics Tools"
    ],
    "answer": "Snapshot Debugger",
    "explanation": "Le Snapshot Debugger (Visual Studio Enterprise) prend des instantanés de l'application en prod pour analyser des bugs complexes."
  },
  {
    "question": "Quelle combinaison de touches redémarre rapidement une session de débogage ?",
    "options": [
      "Ctrl+F5",
      "Ctrl+Maj+F5",
      "Alt+F5",
      "F5+Maj"
    ],
    "answer": "Ctrl+Maj+F5",
    "explanation": "Ctrl+Maj+F5 permet de redémarrer immédiatement le débogage sans passer par l'arrêt complet de l'application."
  },
  {
    "question": "Quelle fonctionnalité permet de modifier du code C# pendant son exécution ?",
    "options": [
      "Live Share",
      "Edit and Continue",
      "Hot Reload",
      "Time Travel Debugging"
    ],
    "answer": "Edit and Continue",
    "explanation": "'Edit and Continue' permet de corriger le code source pendant une pause dans le débogage, sans perdre l'état actuel de l'application."
  },
  {
    "question": "Quelle fenêtre affiche la hiérarchie des appels de méthodes ?",
    "options": [
      "Watch",
      "Locals",
      "Call Stack",
      "Autos"
    ],
    "answer": "Call Stack",
    "explanation": "La fenêtre Call Stack (Alt+7) montre l'ordre des appels de méthodes, essentielle pour comprendre le flux d'exécution."
  },
  {
    "question": "Quel outil analyse spécifiquement les fuites de mémoire ?",
    "options": [
      "CPU Usage",
      "Memory Analyzer",
      "IntelliTrace",
      "Snapshot Debugger"
    ],
    "answer": "Memory Analyzer",
    "explanation": "Le Memory Analyzer (via Diagnostics Tools) identifie les allocations anormales et les objets non libérés."
  },
  {
    "question": "Comment déboguer une application ASP.NET déployée sur Azure ?",
    "options": [
      "Avec le Snapshot Debugger",
      "En attachant le débogueur à Azure App Service",
      "Via Live Share",
      "En utilisant Copilot"
    ],
    "answer": "En attachant le débogueur à Azure App Service",
    "explanation": "Visual Studio permet d'attacher son débogueur à une instance Azure App Service, à condition que les symboles de debug soient disponibles."
  },
  {
    "question": "Quelle fonctionnalité Enterprise enregistre l'historique d'exécution pour le rejouer ?",
    "options": [
      "Hot Reload",
      "IntelliTrace",
      "Watch Window",
      "Data Tips"
    ],
    "answer": "IntelliTrace",
    "explanation": "IntelliTrace capture des événements et des états pour permettre un 'débogage temporel', utile pour les bugs intermittents."
  },
  {
    "question": "Quelle commande exécute le code jusqu'à la ligne du curseur ?",
    "options": [
      "F5",
      "F10",
      "Ctrl+F10",
      "Maj+F11"
    ],
    "answer": "Ctrl+F10",
    "explanation": "'Run to Cursor' (Ctrl+F10) exécute le programme jusqu'à la position du curseur, évitant les points d'arrêt intermédiaires."
  },
  {
    "question": "Quel outil fournit des suggestions contextuelles pendant le débogage ?",
    "options": [
      "IntelliSense",
      "Copilot",
      "CodeLens",
      "Roslyn Analyzer"
    ],
    "answer": "Copilot",
    "explanation": "Copilot (via 'Ask Copilot') explique les erreurs et propose des corrections en temps réel pendant le débogage."
  },
  {
    "question": "Que fait la commande Maj+F11 pendant le débogage ?",
    "options": [
      "Entre dans une fonction",
      "Ignore une fonction",
      "Sort de la fonction actuelle",
      "Ajoute un watch"
    ],
    "answer": "Sort de la fonction actuelle",
    "explanation": "Maj+F11 (Pas à pas sortant) termine l'exécution de la fonction courante et s'arrête à l'appelant, utile pour sortir des méthodes longues."
  },
  {
    "question": "Quelle fenêtre permet de surveiller une expression personnalisée ?",
    "options": [
      "Autos",
      "Locals",
      "Watch",
      "Immediate"
    ],
    "answer": "Watch",
    "explanation": "La fenêtre Watch permet d'ajouter des expressions complexes (ex: 'items.Count(x => x.IsActive)') et d'en suivre l'évolution."
  },
  {
    "question": "Quel outil combine profilage CPU et analyse mémoire ?",
    "options": [
      "IntelliTrace",
      "Diagnostics Tools",
      "Live Share",
      "Code Metrics"
    ],
    "answer": "Diagnostics Tools",
    "explanation": "Les Diagnostics Tools (Alt+F2) regroupent le CPU Usage, Memory Usage et d'autres analyseurs de performance."
  },
  ],
  avance: [
  {
    "question": "Quels types de données sont généralement stockés dans la stack ?",
    "options": [
      "Les objets instanciés avec new",
      "Les fichiers et connexions",
      "Les types valeur comme int, bool, struct",
      "Les tableaux et chaînes de caractères"
    ],
    "answer": "Les types valeur comme int, bool, struct",
    "explanation": "La stack est utilisée pour les types valeur, car ils sont plus petits et rapidement alloués/désalloués à la fin d'une portée."
  },
  {
    "question": "Que contient la stack lorsqu’un objet de type référence est instancié ?",
    "options": [
      "L'objet entier",
      "La copie de l'objet",
      "L’adresse de l’objet sur le heap",
      "Rien, l’objet est uniquement sur le heap"
    ],
    "answer": "L’adresse de l’objet sur le heap",
    "explanation": "La stack contient uniquement la référence (adresse) de l’objet ; son contenu est stocké dans le heap."
  },
  {
    "question": "Quelle est la fonction principale du Garbage Collector (GC) en C# ?",
    "options": [
      "Libérer les fichiers ouverts",
      "Gérer les accès concurrents à la mémoire",
      "Libérer la mémoire des objets inaccessibles",
      "Compresser les fichiers inutilisés"
    ],
    "answer": "Libérer la mémoire des objets inaccessibles",
    "explanation": "Le GC automatise la libération de la mémoire utilisée par les objets qui ne sont plus référencés dans le code."
  },
  {
    "question": "Quel est le rôle de la génération 2 dans le GC ?",
    "options": [
      "Gérer les objets très temporaires",
      "Optimiser les accès aux variables locales",
      "Stocker les objets persistants comme les singletons",
      "Supprimer les références circulaires"
    ],
    "answer": "Stocker les objets persistants comme les singletons",
    "explanation": "Les objets de génération 2 sont rarement collectés et sont souvent des objets à longue durée de vie comme les caches ou singletons."
  },
  {
    "question": "Quelle méthode permet de libérer immédiatement une ressource non managée ?",
    "options": [
      "Finalize()",
      "Dispose()",
      "GC.Collect()",
      "Release()"
    ],
    "answer": "Dispose()",
    "explanation": "Dispose() est appelée manuellement pour libérer des ressources comme des fichiers ou connexions, contrairement à Finalize() qui dépend du GC."
  },
  {
    "question": "Quel mot-clé C# appelle automatiquement Dispose() à la fin d’un bloc ?",
    "options": [
      "auto",
      "release",
      "finalize",
      "using"
    ],
    "answer": "using",
    "explanation": "`using` garantit que Dispose() est appelée, même en cas d’exception, ce qui est essentiel pour les ressources critiques."
  },
  {
    "question": "Pourquoi est-il déconseillé d’utiliser GC.Collect() manuellement ?",
    "options": [
      "Cela efface la stack",
      "Cela peut créer des fuites mémoire",
      "Cela détériore les performances",
      "Cela libère les ressources managées prématurément"
    ],
    "answer": "Cela détériore les performances",
    "explanation": "Forcer la collecte manuelle interrompt l’optimisation automatique du GC, ce qui peut ralentir l’exécution du programme."
  },
  {
    "question": "Quelles sont les conséquences de ne pas appeler Dispose() sur une ressource non managée ?",
    "options": [
      "Le compilateur génère une erreur",
      "La ressource est automatiquement libérée",
      "Le GC la libère immédiatement",
      "On risque des fuites mémoire ou des verrous système"
    ],
    "answer": "On risque des fuites mémoire ou des verrous système",
    "explanation": "Les ressources non managées ne sont pas sous la responsabilité du GC et doivent être libérées explicitement pour éviter les blocages."
  },
  {
    "question": "Quelle est la différence principale entre type valeur et type référence à l’affectation ?",
    "options": [
      "Les deux sont copiés par adresse",
      "Les types valeur copient les données, les références copient l’adresse",
      "Les types référence créent une copie indépendante",
      "Les types valeur ne sont jamais copiés"
    ],
    "answer": "Les types valeur copient les données, les références copient l’adresse",
    "explanation": "Les types valeur créent une nouvelle copie, alors que les références partagent la même instance en mémoire."
  },
  {
    "question": "Quelle image pédagogique illustre le fonctionnement de la stack ?",
    "options": [
      "Un entrepôt avec un robot nettoyeur",
      "Un sac sans fond",
      "Une pile d’assiettes (LIFO)",
      "Un flux de données en continu"
    ],
    "answer": "Une pile d’assiettes (LIFO)",
    "explanation": "La stack fonctionne comme une pile LIFO (Last In, First Out), où chaque appel de méthode ajoute une nouvelle 'assiette'."
  }
   
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
    <strong>Question : </strong>
    
    <strong>
      <p>
        <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
          {slide.question}
        </code>
      </p>
    </strong>  
      <pre style={{ margin: '0', padding: '2px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
        <p>
          <strong>Réponse :</strong> {slide.answer}
        </p>
      </pre>
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

export default Page1;
