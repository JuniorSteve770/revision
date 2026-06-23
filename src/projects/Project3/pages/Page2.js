// src/projects/Project2/pages/Page2.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

 
  {
      "question": "Quelle phrase simple utiliser pour encourager un échange ouvert avec un collègue ?",
      "answer": "Peux-tu m’expliquer comment tu vois ce point ?\nMots-clés : écoute active, ouverture, valorisation.\nContexte : montrer de l’intérêt pour la vision de l’autre, faciliter le dialogue."
    },
    {
      "question": "Comment remercier un collègue qui vous donne un retour constructif ?",
      "answer": "Merci pour ton retour, cela m’aide à mieux comprendre la situation.\nMots-clés : feedback constructif, reconnaissance, transparence.\nEffet : valoriser l’échange pour favoriser la collaboration."
    },
    {
      "question": "Quelle phrase simple proposer pour offrir de l’aide à un collègue débordé ?",
      "answer": "N’hésite pas à me solliciter si tu as besoin d’un coup de main sur ce dossier.\nMots-clés : bienveillance, collaboration, soutien.\nContexte : créer un climat d’entraide accessible."
    },
    {
      "question": "Comment encourager la communication directe pour éviter les malentendus ?",
      "answer": "Je préfère qu’on échange directement plutôt que par mail pour éviter les malentendus.\nMots-clés : communication claire, réactivité, transparence.\nUsage : dans un environnement où la rapidité compte, comme le trading."
    },
    {
      "question": "Quelle phrase simple inviter à exprimer son ressenti sur un projet ?",
      "answer": "Comment tu ressens l’évolution de ce projet jusqu’à présent ?\nMots-clés : écoute empathique, feedback, collaboration.\nBut : favoriser l’expression personnelle pour mieux comprendre les enjeux."
    },
    {
      "question": "Comment nuancer une demande de clarification en valorisant la collaboration ?",
      "answer": "J’aimerais clarifier certains points ensemble afin d’aligner nos visions et optimiser le pricing de manière collaborative.\nMots-clés : collaboration, alignement, rigueur.\nContexte : trading, gestion des risques."
    },
    {
      "question": "Quelle phrase montre de la reconnaissance tout en demandant plus de détails techniques ?",
      "answer": "Ton analyse sur le stress test est pertinente ; pourrais-tu détailler les hypothèses sous-jacentes pour que nous soyons pleinement transparents dans le reporting ?\nMots-clés : valorisation, transparence, rigueur.\nUsage : échanges entre équipes quant et risk management."
    },
    {
      "question": "Comment exprimer de l’empathie face à des contraintes réglementaires complexes ?",
      "answer": "Je comprends la complexité des contraintes réglementaires ; abordons-les étape par étape pour assurer une gestion des risques efficace et partagée.\nMots-clés : empathie, pédagogie, gestion des risques.\nEffet : apaiser et structurer la discussion."
    },
    {
      "question": "Quelle formulation propose un cadre bienveillant pour un suivi d’équipe ?",
      "answer": "Pour faciliter la prise de décision, je te propose un point de suivi régulier où chacun pourra exprimer ses observations sans jugement.\nMots-clés : bienveillance, organisation, communication.\nContexte : réunions périodiques dans un environnement exigeant."
    },
    {
      "question": "Comment valoriser une contribution technique en soulignant son impact concret ?",
      "answer": "En intégrant vos retours sur les modèles GARCH, nous pourrons affiner notre stratégie tout en respectant les contraintes opérationnelles du front office.\nMots-clés : valorisation, impact, rigueur.\nUsage : échanges entre risk managers et traders."
    },
     {
    "question": "Quelle phrase permet d’encourager un échange ouvert avec un collègue en finance ?",
    "answer": "Peux-tu m’expliquer comment tu vois ce point ?\nMots-clés : écoute active, valorisation, ouverture.\nExemple : lors d’une discussion sur un pricing complexe, cette phrase invite l’autre à détailler son raisonnement."
  },
  {
    "question": "Quelle formulation est adaptée pour remercier un collègue qui a donné un feedback sur un rapport de stress tests ?",
    "answer": "Merci pour ton retour, cela m’aide à mieux comprendre la situation.\nMots-clés : feedback constructif, reconnaissance, transparence.\nExplication : la reconnaissance du retour facilite les échanges futurs."
  },
  {
    "question": "Comment proposer une communication plus directe pour éviter les malentendus dans une équipe trading ?",
    "answer": "Je préfère qu’on échange directement plutôt que par mail pour éviter les malentendus.\nMots-clés : communication directe, clarté, réactivité.\nExemple : lors d’une question urgente sur un pricing en temps réel."
  },
  {
    "question": "Quelle phrase avancée montre de l’empathie tout en abordant un sujet réglementaire complexe ?",
    "answer": "Je comprends la complexité des contraintes réglementaires ; abordons-les étape par étape pour assurer une gestion des risques efficace et partagée.\nMots-clés : empathie, pédagogie, gestion des risques.\nExplication : cela apaise et structure la discussion."
  },
  {
    "question": "Comment valoriser la contribution d’un collègue tout en demandant plus de détails dans un environnement de gestion des risques ?",
    "answer": "Ton analyse sur le stress test est pertinente ; pourrais-tu détailler les hypothèses sous-jacentes pour que nous soyons pleinement transparents dans le reporting ?\nMots-clés : valorisation, transparence, rigueur.\nExemple : demander des précisions techniques sans jugement."
  },

];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
  {
    "question": "Quelle phrase est la plus adaptée pour montrer de l’écoute active lors d’un échange sur une nouvelle méthodologie de pricing ?",
    "options": [
      "Je ne suis pas d’accord, il faut suivre ma méthode.",
      "Peux-tu m’expliquer comment tu vois ce point ?",
      "On n’a pas le temps pour ça, passons à autre chose.",
      "Je vais faire comme je veux sans discuter."
    ],
    "answer": "Peux-tu m’expliquer comment tu vois ce point ?",
    "explanation": "Cette phrase encourage l’échange et montre une vraie volonté d’écoute et de compréhension."
  },
  {
    "question": "Face à un collègue stressé par un reporting complexe, que dire pour instaurer un climat bienveillant ?",
    "options": [
      "Ne t’inquiète pas, tout le monde est dans le même cas.",
      "Je comprends la complexité des contraintes réglementaires ; abordons-les étape par étape pour assurer une gestion des risques efficace et partagée.",
      "Ce n’est pas mon problème, concentre-toi sur ton travail.",
      "On n’a pas le temps pour tes questions."
    ],
    "answer": "Je comprends la complexité des contraintes réglementaires ; abordons-les étape par étape pour assurer une gestion des risques efficace et partagée.",
    "explanation": "Cette phrase montre de l’empathie et propose une approche structurée pour avancer ensemble."
  },
  {
    "question": "Quelle attitude est la plus efficace pour gérer une demande urgente d’un trader tout en respectant les délais IT ?",
    "options": [
      "Promettre une résolution rapide sans validation.",
      "Proposer une solution intermédiaire et alerter la DSI.",
      "Ignorer la demande du trader.",
      "Reporter la demande sans explication."
    ],
    "answer": "Proposer une solution intermédiaire et alerter la DSI.",
    "explanation": "Cela permet de gérer la pression tout en maintenant une communication claire et responsable."
  },
  {
    "question": "Dans un mail, quelle formule est la plus claire pour inviter à un échange direct afin d’éviter des malentendus ?",
    "options": [
      "Je préfère qu’on échange directement plutôt que par mail pour éviter les malentendus.",
      "Tu devrais comprendre tout seul, pas besoin de réunion.",
      "Écris-moi quand tu as du temps, je ne suis pas pressé.",
      "Ignore ce mail, on verra plus tard."
    ],
    "answer": "Je préfère qu’on échange directement plutôt que par mail pour éviter les malentendus.",
    "explanation": "Encourager la communication directe améliore la compréhension et réduit les erreurs."
  }
  ],
  avance: [
     {
    "question": "Lors d’une réunion sur la gestion des risques, un collègue exprime un désaccord sur le modèle GARCH utilisé. Quelle phrase est la plus adaptée pour maintenir un dialogue ouvert et constructif ?",
    "options": [
      "Tu te trompes, on utilise ce modèle depuis des années.",
      "Peux-tu m’expliquer comment tu vois ce point ?",
      "On n’a pas le temps pour ça, passons à autre chose."
    ],
    "answer": "Peux-tu m’expliquer comment tu vois ce point ?",
    "explanation": "Cette formulation invite à clarifier le désaccord tout en valorisant l’échange."
  },
  {
    "question": "Un collègue du front office semble débordé par les derniers stress tests et vous demande de l’aide. Comment lui répondre de manière accessible et bienveillante ?",
    "options": [
      "N’hésite pas à me solliciter si tu as besoin d’un coup de main sur ce dossier.",
      "Je suis trop occupé pour ça, débrouille-toi.",
      "Tu devrais mieux t’organiser la prochaine fois."
    ],
    "answer": "N’hésite pas à me solliciter si tu as besoin d’un coup de main sur ce dossier.",
    "explanation": "Proposer son aide sans jugement favorise un bon esprit d’équipe."
  },
  {
    "question": "Vous recevez un mail confus d’un collègue sur un problème de pricing. Quelle phrase conviendrait pour demander des précisions de manière professionnelle ?",
    "options": [
      "Ton mail est incompréhensible, renvoie-moi quelque chose de clair.",
      "Peux-tu préciser certains points afin que je comprenne mieux ta demande ?",
      "Fais attention à ce que tu écris, c’est important."
    ],
    "answer": "Peux-tu préciser certains points afin que je comprenne mieux ta demande ?",
    "explanation": "Cette phrase encourage une communication claire et respectueuse."
  },
  {
    "question": "En fin de réunion, vous voulez proposer un suivi régulier pour améliorer la collaboration autour des reportings. Quelle phrase utiliseriez-vous ?",
    "options": [
      "Je propose un point de suivi régulier où chacun pourra exprimer ses observations sans jugement.",
      "On fera ça quand on aura le temps, ce n’est pas urgent.",
      "Chacun fait son boulot, inutile de perdre du temps en réunions."
    ],
    "answer": "Je propose un point de suivi régulier où chacun pourra exprimer ses observations sans jugement.",
    "explanation": "Instaurer un cadre bienveillant favorise l’expression et la collaboration."
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
const Page2 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
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
  }, [level, currentQuestion]);

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && !message && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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
    if (message) return;
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

export default Page2;