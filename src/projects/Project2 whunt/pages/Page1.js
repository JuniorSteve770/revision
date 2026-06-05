// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// https://www.youtube.com/watch?v=s9Qh9fWeOAk

const basicSlides = [
{
    "question": "Quel est le rôle principal du Front Office dans le cycle de traitement des actifs ?",
    "answer": "Saisie/importation des ordres, vérification des paramètres, pricing et booking dans le système."
  },
  {
    "question": "Quelles sont les responsabilités du Middle Office dans le traitement d’un ordre ?",
    "answer": "Contrôle/validation des ordres, matching des trades, contrôle des limites, préparation du règlement-livraison."
  },
  {
    "question": "Que fait le Back Office dans le traitement des actifs ?",
    "answer": "Envoie les instructions de règlement, contrôle les règlements, gère les paiements d’intérêts/coupons, suit les flux cash, génère les écritures comptables."
  },
  {
    "question": "Comment traite-t-on un actif de type Cash dans un progiciel front-to-back ?",
    "answer": "Par des virements (ex : MT202), affectation sur compte, et gestion du taux d’intérêt."
  },
  {
    "question": "Quels sont les traitements spécifiques aux actions (Equity) ?",
    "answer": "Vérification du nombre d’actions, des droits de vote, et des dividendes."
  },
  {
    "question": "Quels éléments sont importants pour le traitement des obligations ?",
    "answer": "Coupons, maturité, amortissement, traitement fiscal."
  },
  {
    "question": "Quelles sont les caractéristiques spécifiques à prendre en compte pour les Government Bonds ?",
    "answer": "ISIN, échéance, taux fixe ou flottant."
  },
  {
    "question": "Comment sont gérés les repos/reverses ?",
    "answer": "Gestion du collatéral, date de retour, marge, substitution."
  },
  {
    "question": "Que faire en cas de fail de règlement ?",
    "answer": "Investigation via SWIFT MT548 ou DSMatch, notification du broker."
  },
  {
    "question": "Comment gère-t-on un mismatch de trade ?",
    "answer": "Reconciliation avec la contrepartie, correction manuelle possible."
  },
  {
    "question": "Que signifie un blocage dans T2S/Euroclear/Clearstream ?",
    "answer": "C’est une suspension ou un blocage nécessitant une analyse du statut de settlement."
  },
  {
    "question": "Qu’est-ce qu’un cash break ou un break titres ?",
    "answer": "Une différence à réconcilier entre les systèmes Back Office et le custodian (cash ou titres)."
  },
  {
    "question": "Comment traiter une corporate action non prise en compte ?",
    "answer": "Mise à jour manuelle, éventuellement rebooking de l’opération."
  },
  {
    "question": "Quel est le rôle principal d’un Broker ?",
    "answer": "Intermédiaire exécutant, souvent impliqué dans les opérations de repo."
  },
  {
    "question": "Quel est le rôle d’Euroclear ?",
    "answer": "CSD pour titres européens, assure la détention et le règlement-livraison des titres."
  },
  {
    "question": "Quelle est la mission principale de Clearstream ?",
    "answer": "CSD international, gère obligations, equities, cash et repos."
  },
  {
    "question": "Quel est le rôle de T2S ?",
    "answer": "Plateforme européenne de règlement-livraison en monnaie centrale."
  },
  {
    "question": "Quelles sont les étapes d’un traitement de Repo via Summit ?",
    "answer": "Booking FO, validation MO, transmission Clearstream, allocation collatéral, suivi flux, substitution éventuelle, unwinding final."
  },
  {
    "question": "Quels sont les rôles du Front et du Middle Office dans le traitement des ordres ?",
    "answer": "🔹 **Front Office** : saisie/importation des ordres, vérification (instrument, prix…), pricing & booking. 🔹 **Middle Office** : validation (4-eyes), matching avec contrepartie, contrôle des limites, préparation du règlement."
  },
  {
    "question": "Quelles sont les fonctions clés du Back Office et comment traite-t-il les flux cash ?",
    "answer": "📦 **Back Office** : envoie les instructions de règlement, contrôle des règlements, gestion des coupons/intérêts, suivi cash, génération comptable. ⚙️ Pour les actifs **cash** : virements (MT202), affectation de compte, taux d’intérêt."
  },
  {
    "question": "Comment traite-t-on les actions (Equity) et obligations dans un progiciel front-to-back ?",
    "answer": "📈 **Equity** : contrôle du nombre d’actions, droits de vote, dividendes. 💵 **Obligations** : suivi des coupons, maturité, amortissements, fiscalité."
  },
  {
    "question": "Quelles sont les spécificités de traitement des Government Bonds et des Repos ?",
    "answer": "🏛 **Gov Bonds** : gestion via ISIN, échéance, taux fixe/flottant. 🔁 **Repos** : gestion du collatéral, date de retour, marge, substitution."
  },
  {
    "question": "Comment réagir face à un fail de règlement ou un mismatch de trade ?",
    "answer": "⚠️ **Fail règlement** : investigation via **MT548**, notification broker. 🔄 **Mismatch** : réconciliation avec contrepartie, correction manuelle si besoin."
  },
  {
    "question": "Comment traiter les blocages settlement et les différences cash/titres ?",
    "answer": "🛑 **Blocage T2S/Euroclear/Clearstream** : analyse du statut settlement. 💰📊 **Breaks cash/titres** : rapprochement Back Office vs custodian."
  },
  {
    "question": "Que faire lorsqu’une corporate action est oubliée ou manquante ?",
    "answer": "📝 Mise à jour **manuelle** du trade, ou **rebooking** si nécessaire pour refléter correctement l’événement corporate."
  },
  {
    "question": "Quels rôles jouent les Brokers et Euroclear dans les marchés financiers ?",
    "answer": "👨‍💼 **Broker** : exécutant d’ordres, souvent présent dans les legs de repo. 🏦 **Euroclear** : CSD pour titres européens, assure détention & règlement-livraison."
  },
  {
    "question": "Quelle est la différence entre Clearstream et T2S ?",
    "answer": "🌍 **Clearstream** : CSD international pour obligations, actions, cash et repos. 💶 **T2S** : plateforme européenne de **règlement-livraison en monnaie centrale**."
  },
  {
    "question": "Quelles sont les étapes de traitement d’un repo via Summit ?",
    "answer": "📊 Booking FO (montant, collatéral), validation MO, transmission Clearstream, allocation automatique de collatéral, suivi flux, substitution possible, **unwinding à échéance**."
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

     {
    "question": "Quel est le rôle principal du Front Office dans un système front-to-back ?",
    "options": [
      "Assurer le règlement des transactions",
      "Gérer la comptabilité",
      "Saisir et valoriser les ordres",
      "Effectuer les rapprochements cash"
    ],
    "answer": "Saisir et valoriser les ordres",
    "explanation": "Le Front Office est responsable de la saisie, vérification et valorisation (pricing) des ordres financiers dans le système."
  },
  {
    "question": "Quelle tâche est typiquement réalisée par le Middle Office ?",
    "options": [
      "Envoi d'instructions à la banque dépositaire",
      "Contrôle des règlements",
      "Matching des ordres avec la contrepartie",
      "Paiement des coupons"
    ],
    "answer": "Matching des ordres avec la contrepartie",
    "explanation": "Le Middle Office est en charge de la validation et du rapprochement (matching) des ordres avec les contreparties, avant règlement."
  },
  {
    "question": "Quel message SWIFT est utilisé pour notifier un fail de règlement ?",
    "options": [
      "MT103",
      "MT202",
      "MT548",
      "MT300"
    ],
    "answer": "MT548",
    "explanation": "Le message SWIFT MT548 est utilisé pour les notifications d’état, notamment pour les échecs de règlement (fails)."
  },
  {
    "question": "Quel élément est spécifique à la gestion d’un repo ?",
    "options": [
      "Taux de dividende",
      "Amortissement",
      "Date de retour et collatéral",
      "Coupon fixe"
    ],
    "answer": "Date de retour et collatéral",
    "explanation": "Les repos impliquent un prêt de titres garanti par un collatéral avec une date de retour prévue."
  },
  {
    "question": "Quel acteur est responsable du règlement-livraison des titres européens ?",
    "options": [
      "Clearstream",
      "T2",
      "Euroclear",
      "SWIFT"
    ],
    "answer": "Euroclear",
    "explanation": "Euroclear est une infrastructure de marché (CSD) spécialisée dans le règlement-livraison de titres européens."
  },
  {
    "question": "Quelle option décrit une cause typique d’un mismatch de trade ?",
    "options": [
      "Différence de devise",
      "Erreur de saisie d’un paramètre (prix, quantité...)",
      "Blocage dans T2S",
      "Retard de règlement"
    ],
    "answer": "Erreur de saisie d’un paramètre (prix, quantité...)",
    "explanation": "Un mismatch se produit souvent lorsqu’il y a une différence de paramètre entre deux systèmes (prix, quantité, ISIN…)."
  },
  {
    "question": "Quel est le rôle principal de T2S ?",
    "options": [
      "Plateforme de gestion de change",
      "CSD américain",
      "Règlement-livraison en monnaie centrale",
      "Plateforme de trading pour actions"
    ],
    "answer": "Règlement-livraison en monnaie centrale",
    "explanation": "T2S est la plateforme européenne qui centralise le règlement-livraison de titres en monnaie banque centrale."
  },

  ],
  avance: [
  {
    "question": "Comment traite-t-on une corporate action oubliée dans le système ?",
    "options": [
      "On attend la fin du trimestre",
      "On annule le trade concerné",
      "On contacte la bourse",
      "On fait une mise à jour manuelle ou un rebooking"
    ],
    "answer": "On fait une mise à jour manuelle ou un rebooking",
    "explanation": "Les corporate actions non prises en compte doivent être traitées manuellement, parfois en recréant le trade (rebooking)."
  },
  {
    "question": "Quelle opération est typiquement associée à un actif de type Cash ?",
    "options": [
      "Paiement de dividendes",
      "Substitution de collatéral",
      "Virement via SWIFT MT202",
      "Gestion d’ISIN"
    ],
    "answer": "Virement via SWIFT MT202",
    "explanation": "Les actifs cash sont souvent traités via des virements bancaires comme les messages SWIFT MT202."
  },
  {
    "question": "Quel système est souvent utilisé pour booker un repo en Front Office ?",
    "options": [
      "Clearstream",
      "Summit",
      "Euroclear",
      "T2S"
    ],
    "answer": "Summit",
    "explanation": "Summit est un progiciel couramment utilisé pour la saisie et le suivi des opérations de marché comme les repos."
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
  }, [level, currentQuestion]);;

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
