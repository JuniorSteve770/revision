// src/projects/Project1/pages/Page3.js
import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

  {
    "question": "Formule une phrase pour remercier un collègue après un échange constructif.",
    "answer": "Merci pour ton retour, c'était très utile.\nMots-clés associés : feedback, reconnaissance, collaboration.\nContexte : fin de réunion ou échange en binôme."
  },
  {
    "question": "Formule une phrase pour demander des précisions sur une tâche.",
    "answer": "Tu peux m’expliquer un peu plus ce point ? Je veux être sûr de bien comprendre.\nMots-clés : clarification, transparence, écoute active.\nContexte : mail ou échange oral sur une tâche en cours."
  },
  {
    "question": "Formule une phrase pour encourager un collègue qui débute.",
    "answer": "Tu t’en sors bien, c’est normal de poser des questions au début.\nMots-clés : bienveillance, soutien, intégration.\nContexte : onboarding ou passation."
  },
  {
    "question": "Formule une phrase pour proposer de l’aide à un collègue en surcharge.",
    "answer": "Si tu veux, je peux t’aider sur une partie.\nMots-clés : entraide, coopération, esprit d’équipe.\nContexte : surcharge ponctuelle ou projet commun."
  },
  {
    "question": "Formule une phrase pour poser une question sur le contexte d’un reporting.",
    "answer": "Tu sais à qui est destiné ce rapport ?\nMots-clés : clarification, alignement, objectif.\nContexte : préparation d’un livrable."
  },
  {
    "question": "Formule une phrase pour relancer une demande poliment.",
    "answer": "Je me permets de revenir vers toi concernant ma demande de mardi.\nMots-clés : relance, politesse, gestion du temps.\nContexte : relance mail ou Slack."
  },
  {
    "question": "Formule une phrase pour proposer une réunion de clarification.",
    "answer": "On peut se caler 10 minutes pour faire le point ?\nMots-clés : proactivité, clarté, synchronisation.\nContexte : désalignement ou question ouverte."
  },
  {
    "question": "Formule une phrase pour réagir à une erreur sans accuser.",
    "answer": "Il semble qu’il y ait eu un petit décalage, on peut revoir ça ensemble ?\nMots-clés : gestion de conflit, diplomatie, solution.\nContexte : erreur de saisie, deadline manquée."
  },
  {
    "question": "Formule une phrase pour introduire une remarque en réunion.",
    "answer": "Je me permets d’ajouter un point.\nMots-clés : assertivité, contribution, réunion.\nContexte : prise de parole en groupe."
  },
  {
    "question": "Formule une phrase pour clore une réunion efficacement.",
    "answer": "Merci à tous, je récapitule les points-clés et les prochaines étapes.\nMots-clés : clarté, synthèse, leadership.\nContexte : fin de réunion."
  },
  {
    "question": "Formule une phrase pour challenger une décision en restant constructif.",
    "answer": "As-tu envisagé l’impact sur la volatilité du portefeuille si on opte pour cette option ?\nMots-clés : feedback constructif, gestion des risques, assertivité.\nContexte : comité de décision, gestion d’actifs."
  },
  {
    "question": "Formule une phrase pour demander un retour sur une présentation technique.",
    "answer": "Aurais-tu un feedback rapide sur les éléments que j’aurais pu mieux synthétiser ?\nMots-clés : feedback, amélioration continue, transparence.\nContexte : présentation de reporting ou d’analyse de risque."
  },
  {
    "question": "Formule une phrase pour reformuler une consigne technique.",
    "answer": "Si je résume : on doit prioriser les flux OTC avant jeudi, avec un reporting consolidé.\nMots-clés : reformulation, clarté, priorisation.\nContexte : consigne de manager ou chef de projet."
  },
  {
    "question": "Formule une phrase pour répondre à une critique de façon posée.",
    "answer": "Merci pour ton retour, je vais creuser ce point pour mieux l’intégrer dans la prochaine version.\nMots-clés : écoute active, professionnalisme, résilience.\nContexte : retour sur travail ou présentation."
  },
  {
    "question": "Formule une phrase pour synthétiser une réunion de trading.",
    "answer": "En résumé, nous adaptons la stratégie sur les taux US en fonction du CPI, avec révision lundi.\nMots-clés : clarté, synthèse, marché.\nContexte : salle des marchés, morning meeting."
  },
  {
    "question": "Formule une phrase pour recadrer un échange sans tension.",
    "answer": "Je te propose qu’on se concentre sur les points validés pour avancer efficacement.\nMots-clés : diplomatie, gestion du temps, collaboration.\nContexte : réunion agitée ou digressive."
  },
  {
    "question": "Formule une phrase pour poser une question stratégique en comité.",
    "answer": "Comment cette orientation s’inscrit-elle dans la gestion du stress test Bâle III ?\nMots-clés : vision, compliance, alignement stratégique.\nContexte : comité risque ou conformité."
  },
  {
    "question": "Formule une phrase pour valoriser une idée en réunion.",
    "answer": "Je trouve l’approche pertinente, surtout pour améliorer notre ratio Sharpe à court terme.\nMots-clés : écoute active, valorisation, performance.\nContexte : brainstorm produit ou stratégie."
  },
  {
    "question": "Formule une phrase pour proposer un feedback post-meeting.",
    "answer": "Tu es ouvert à un rapide retour sur le pitch ? Quelques points m’ont semblé perfectibles.\nMots-clés : feedback constructif, amélioration, respect.\nContexte : présentation client ou interne."
  },
  {
    "question": "Formule une phrase pour lancer une discussion informelle.",
    "answer": "Tu as deux minutes pour un café ? J’aimerais avoir ton avis sur un truc rapide.\nMots-clés : présence sociale, lien, échange informel.\nContexte : gestion de réseau interne."
  },


  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     {
    "question": "Quelle formulation est la plus claire pour demander un éclaircissement sur une consigne ?",
    "options": [
      "Tu peux répéter ?",
      "C’est flou ton truc.",
      "Je ne comprends rien.",
      "Tu peux préciser ce que tu attends exactement ?"
    ],
    "answer": "D",
    "explanation": "La réponse D est précise, polie et favorise une clarification sans jugement."
  },
  {
    "question": "Comment introduire une remarque en réunion sans couper la parole ?",
    "options": [
      "Attends, je parle !",
      "Je me permets d’ajouter quelque chose après ce point.",
      "Laisse-moi finir.",
      "On s’en fiche de ce que tu dis."
    ],
    "answer": "B",
    "explanation": "La réponse B montre du respect, une volonté de contribuer et une posture professionnelle."
  },
  {
    "question": "Quelle formulation exprime un feedback positif constructif ?",
    "options": [
      "Franchement, c’était pas trop mal.",
      "Bien joué pour la clarté du slide sur les risques.",
      "Tu pourrais mieux faire.",
      "Ça passe pour cette fois."
    ],
    "answer": "B",
    "explanation": "La réponse B est précise et valorise un point fort identifié."
  },
  {
    "question": "En cas d'erreur dans un fichier Excel, quelle réponse est la plus collaborative ?",
    "options": [
      "Tu t’es trompé encore.",
      "Faut vraiment que tu fasses attention.",
      "On peut revoir ensemble ce fichier, il semble y avoir un écart.",
      "C’est pas mon problème."
    ],
    "answer": "C",
    "explanation": "La réponse C propose une solution sans blâme et favorise la coopération."
  },
  {
    "question": "Mise en situation : En salle des marchés, votre collègue partage une nouvelle stratégie. Quelle est la réaction la plus adaptée ?",
    "options": [
      "Bof, ça ne marchera pas.",
      "Pourquoi pas, tu as des backtests ?",
      "C’est trop risqué, laisse tomber.",
      "Tu rêves, mec."
    ],
    "answer": "B",
    "explanation": "La réponse B montre de l’intérêt tout en demandant une validation méthodique."
  },
  {
    "question": "Mise en situation : Vous êtes en retard sur une deadline. Quelle est la meilleure façon de prévenir ?",
    "options": [
      "Désolé, j’ai zappé.",
      "Je t’envoie ça demain.",
      "Je suis en retard, mais je travaille dessus et je te tiens au courant rapidement.",
      "Je ne peux pas, trop de trucs."
    ],
    "answer": "C",
    "explanation": "La réponse C est responsable, proactive et transparente."
  },
  {
    "question": "Quelle phrase montre une bonne écoute active ?",
    "options": [
      "Ouais ouais.",
      "OK, tu dis donc que le client veut un reporting hebdo ?",
      "Je t’entends.",
      "On verra plus tard."
    ],
    "answer": "B",
    "explanation": "La reformulation dans la réponse B montre une vraie écoute et compréhension."
  },
  {
    "question": "Comment valoriser un collègue après une bonne présentation ?",
    "options": [
      "C’était top, clair et synthétique.",
      "Trop long mais bon.",
      "T’as survécu !",
      "Moi j’aurais fait mieux."
    ],
    "answer": "A",
    "explanation": "La réponse A valorise les qualités sans sarcasme."
  },
  {
    "question": "Quel mot-clé correspond à la capacité à exprimer un désaccord avec respect ?",
    "options": [
      "Réactivité",
      "Empathie",
      "Assertivité",
      "Volatilité"
    ],
    "answer": "C",
    "explanation": "L’assertivité permet de défendre un point de vue sans agressivité."
  },
  {
    "question": "Quelle phrase correspond à un feedback constructif ?",
    "options": [
      "Tu t’es trompé.",
      "Ce point peut être amélioré en clarifiant la partie sur les expositions.",
      "C’est nul.",
      "Trop vague."
    ],
    "answer": "B",
    "explanation": "La réponse B propose une amélioration concrète et bienveillante."
  },
  ],
  avance: [
      {
    "question": "Mise en situation : En réunion de suivi, un collègue monopolise la parole. Quelle est la meilleure réponse ?",
    "options": [
      "Tu peux laisser parler les autres ?",
      "On va laisser la parole à chacun, si tu veux bien.",
      "C’est bon, on a compris.",
      "Tu parles trop, désolé."
    ],
    "answer": "B",
    "explanation": "La réponse B permet de recadrer avec politesse et de rétablir l’équilibre sans conflit."
  },
  {
    "question": "Quelle expression est la plus adaptée pour relancer poliment un manager occupé ?",
    "options": [
      "Alors ? Toujours pas ?",
      "Tu comptes répondre ?",
      "Je comprends que tu sois très sollicité, je me permets de relancer.",
      "C’est urgent, bouge-toi."
    ],
    "answer": "C",
    "explanation": "La réponse C allie empathie et assertivité, adaptée aux environnements à forte charge de travail."
  },
  {
    "question": "Mise en situation : En call client, vous ne comprenez pas un acronyme. Que faire ?",
    "options": [
      "Laisser couler.",
      "Faire semblant de comprendre.",
      "Poser calmement la question : 'Pardon, que signifie cet acronyme ?'",
      "Changer de sujet."
    ],
    "answer": "C",
    "explanation": "Poser la question montre de la rigueur et évite les malentendus. C’est un réflexe pro."
  },
  {
    "question": "Quelle formulation montre une attitude proactive ?",
    "options": [
      "On verra bien.",
      "J’attends les infos.",
      "Je propose de préparer une première version d’ici demain.",
      "Ce n’est pas clair."
    ],
    "answer": "C",
    "explanation": "La réponse C illustre l’initiative et la prise de responsabilité attendue en finance."
  },
  {
    "question": "Quel mot-clé désigne la capacité à reformuler pour s’assurer d’avoir compris ?",
    "options": [
      "Collaboration",
      "Transparence",
      "Écoute active",
      "Concentration"
    ],
    "answer": "C",
    "explanation": "L’écoute active implique souvent une reformulation pour vérifier la compréhension mutuelle."
  },
  {
    "question": "Mise en situation : Vous sentez des tensions entre collègues. Quelle est l’attitude la plus efficace ?",
    "options": [
      "Ignorer, ça passera.",
      "Prendre parti pour l’un.",
      "Proposer un point à trois pour clarifier calmement la situation.",
      "Transférer le problème au manager sans prévenir."
    ],
    "answer": "C",
    "explanation": "La réponse C favorise la transparence et la résolution directe des tensions, en autonomie."
  },
  {
    "question": "Quelle phrase est la plus adaptée pour corriger un collègue en réunion ?",
    "options": [
      "Ce que tu dis est faux.",
      "Tu te trompes totalement.",
      "Je me permets de nuancer ce point avec une autre lecture possible.",
      "T’as pas lu le dossier ?"
    ],
    "answer": "C",
    "explanation": "La réponse C permet de corriger sans blesser ni créer de conflit frontal."
  },
  {
    "question": "Quel mot-clé désigne l’attitude de rendre visibles ses intentions et décisions ?",
    "options": [
      "Transparence",
      "Assertivité",
      "Feedback",
      "Discrétion"
    ],
    "answer": "A",
    "explanation": "La transparence permet de clarifier les intentions, décisions et justifications dans un cadre professionnel."
  },
  {
    "question": "Mise en situation : Un collègue vous interrompt sans cesse. Quelle réaction est la plus professionnelle ?",
    "options": [
      "Tu peux arrêter de couper ?",
      "Je peux juste terminer ce point, et je te laisse enchaîner ?",
      "Tu fais toujours ça !",
      "On n’est pas chez toi."
    ],
    "answer": "B",
    "explanation": "La réponse B est posée, assertive et recentre l’attention sans générer de conflit."
  },
  {
    "question": "Quelle phrase exprime clairement une demande de feedback ?",
    "options": [
      "C’était bon ?",
      "T’en penses quoi ?",
      "Je suis preneur d’un retour sur ce que je peux améliorer.",
      "J’ai tout bien fait ?"
    ],
    "answer": "C",
    "explanation": "La réponse C est formulée de manière ouverte, constructive et professionnelle."
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
const Page3 = () => {
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

export default Page3;