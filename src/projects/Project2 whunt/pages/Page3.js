// src/projects/Project1/pages/Page3.js
import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

    {
    "question": "Quels sont les principaux progiciels utilisés en environnement front-to-back ?",
    "answer": "Summit, SOPHIS, Calypso, Murex. Ils assurent la traçabilité de la négociation à la comptabilité."
  },
  {
    "question": "Quels paramètres clés sont renseignés lors du booking d'un trade ?",
    "answer": "ISIN, volume, prix, devise, date valeur, settlement type (FO/OTC), contrepartie, broker. Génère un deal ticket unique."
  },
  {
    "question": "Quelles sont les 3 étapes principales du traitement post-trade ?",
    "answer": "1) Booking du trade, 2) Contrôle Middle Office, 3) Transmission aux infrastructures (CSD/ICSD)."
  },
  {
    "question": "Que vérifie le Middle Office lors du contrôle d'un trade ?",
    "answer": "Sens, montant, date valeur, place de règlement. Complète les SSI, broker ID, account custodian."
  },
  {
    "question": "Quels messages SWIFT sont utilisés pour le settlement ?",
    "answer": "MT540-543 (instructions), MT548 (statut), MT578 (matched/unmatched). Envoyés via module SWIFT des progiciels."
  },
  {
    "question": "Quelle est la différence entre CSD et ICSD ? Donnez des exemples.",
    "answer": "CSD = dépôt domestique (Euroclear France), ICSD = international (Euroclear Bank, Clearstream Luxembourg)."
  },
  {
    "question": "Comment les equities sont-elles settlées ?",
    "answer": "En DVP/RVP (Delivery/Receive vs Payment), avec gestion des dividendes et corporate actions."
  },
  {
    "question": "Quelles spécificités pour les Gov Bonds ?",
    "answer": "Déposés via Euroclear/Clearstream/T2S. Gestion des strips, maturité, et risk-weighted assets (RWA)."
  },
  {
    "question": "Comment fonctionne le collateral management pour les REPOs ?",
    "answer": "Gestion tripartite (Clearstream Triparty, Euroclear GC Access) avec automatisation des appels de marge."
  },
  {
    "question": "Quel module gère les instructions de settlement ?",
    "answer": "Settlement Engine : génère automatiquement les instructions SWIFT MT54x à partir des SSI."
  },
  {
    "question": "À quoi sert le module SSI ?",
    "answer": "Stocker les paramètres des comptes custodians/contreparties pour automatiser les instructions de règlement."
  },
  {
    "question": "Que fait le module Corporate Actions ?",
    "answer": "Gère les événements sur titres : dividendes, splits, fusions. Intègre les annonces SWIFT MT564."
  },
  {
    "question": "Comment traiter un trade non matché ?",
    "answer": "Notification MT578/MT548. Correction via workflow MO/BO après vérification des divergences."
  },
  {
    "question": "Qu'est-ce qu'un buy-in sous CSDR ?",
    "answer": "Si fail persiste 4 jours, obligation d'acheter sur le marché pour honorer le deal. Pénalités associées."
  },
  {
    "question": "Que se passe-t-il si on rate le cut-off ?",
    "answer": "Settlement repoussé à J+1. Ex: cut-off à 15h CET pour Euroclear."
  },
  {
    "question": "Quel est le rôle d'un ICSD ?",
    "answer": "Euroclear/Clearstream : gèrent titres internationaux, instructions et flux multi-devises."
  },
  {
    "question": "Qu'apporte T2S au post-trade européen ?",
    "answer": "Plateforme harmonisée de settlement en banque centrale money. Réduit coûts et délais cross-border."
  },
  {
    "question": "Qu'est-ce que le DOM ?",
    "answer": "Domestic Market (ex: Borsa Italiana/Monte Titoli). Marché local lié à son CSD national."
  },
  {
    "question": "Comment calculer l'intérêt couru pour une obligation ?",
    "answer": "Méthodes ACT/ACT ou 30/360. Calculé automatiquement par les modules Accounting/Position Keeping."
  },
  {
    "question": "Quels sont les statuts possibles d'un settlement ?",
    "answer": "Matched, unmatched, settled, pending, cancelled. Suivis via MT548."
  },


  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     {
    "question": "Quel message SWIFT est utilisé pour les instructions de settlement initiales ?",
    "options": [
      "MT103",
      "MT540",
      "MT578",
      "MT202"
    ],
    "answer": "MT540",
    "explanation": "Le MT540 est le message SWIFT standard pour les instructions de settlement initiales, alors que MT578 concerne le matching status et MT103/202 les paiements cash."
  },
  {
    "question": "Quelle infrastructure gère les titres internationaux ?",
    "options": [
      "CSD local",
      "T2S",
      "ICSD",
      "DOM"
    ],
    "answer": "ICSD",
    "explanation": "Les ICSD (International Central Securities Depositories) comme Euroclear Bank ou Clearstream Luxembourg gèrent les titres transfrontaliers, contrairement aux CSD locaux."
  },
  {
    "question": "Que déclenche un fail de règlement après 4 jours sous CSDR ?",
    "options": [
      "Un reprocessing automatique",
      "Un buy-in obligatoire",
      "L'annulation du trade",
      "Une pénalité de 1% du montant"
    ],
    "answer": "Un buy-in obligatoire",
    "explanation": "Le règlement CSDR impose un buy-in (rachat forcé sur le marché) lorsque le settlement échoue après 4 jours ouvrés."
  },
  {
    "question": "Quel module du progiciel gère les appels de marge sur les REPOs ?",
    "options": [
      "Settlement Engine",
      "Corporate Actions",
      "Collateral Management",
      "Position Keeping"
    ],
    "answer": "Collateral Management",
    "explanation": "Le module Collateral Management calcule les haircuts, suit les valeurs collatérales et génère les appels de marge."
  },
  {
    "question": "Quelle méthode de settlement utilise-t-on typiquement pour les equities ?",
    "options": [
      "FoP (Free of Payment)",
      "DVP (Delivery vs Payment)",
      "Netting bilatéral",
      "Payment vs Payment"
    ],
    "answer": "DVP (Delivery vs Payment)",
    "explanation": "Le DVP (livraison contre paiement) est le standard pour les equities, liant le transfert de titres au paiement en cash pour réduire le risque."
  },
  {
    "question": "Que signifie un statut MT548 'Unmatched' ?",
    "options": [
      "Le trade est settlé",
      "Les contreparties ont des divergences",
      "Le collatéral est insuffisant",
      "L'instruction est en attente"
    ],
    "answer": "Les contreparties ont des divergences",
    "explanation": "Unmatched indique une discordance entre les instructions des contreparties (prix, quantité, date...). Nécessite une réconciliation via MT578."
  },
  {
    "question": "Quel acteur est responsable de l'exécution d'un ordre ?",
    "options": [
      "Le CSD",
      "Le broker",
      "L'ICSD",
      "Le corporate broking"
    ],
    "answer": "Le broker",
    "explanation": "Le broker exécute l'ordre sur le marché et fournit la confirmation d'exécution (contrairement au CSD/ICSD qui gèrent le settlement)."
  },
  {
    "question": "Que gère spécifiquement le module SSI ?",
    "options": [
      "Les positions titres",
      "Les comptes de contreparties",
      "Les corporate actions",
      "Les calculs d'intérêt couru"
    ],
    "answer": "Les comptes de contreparties",
    "explanation": "Le SSI (Standard Settlement Instructions) stocke les références des comptes custodians et contreparties pour automatiser les instructions."
  },
  {
    "question": "Quelle plateforme harmonise le settlement en Europe ?",
    "options": [
      "Euroclear",
      "T2S (Target2-Securities)",
      "Clearstream",
      "ESMA"
    ],
    "answer": "T2S (Target2-Securities)",
    "explanation": "T2S est la plateforme de la BCE pour un settlement harmonisé en Europe, utilisant de la monnaie banque centrale."
  },
  {
    "question": "Quel traitement pour un coupon d'obligation ?",
    "options": [
      "Géré par Corporate Actions",
      "Calculé via Position Keeping",
      "Payé via MT103",
      "Toutes ces réponses"
    ],
    "answer": "Toutes ces réponses",
    "explanation": "Les coupons impliquent : 1) Calcul (Position Keeping), 2) Événement (Corporate Actions), 3) Paiement (MT103 via Settlement Engine)."
  },
  ],
  avance: [
       {
    "question": "Quel est le principal avantage d'un REPO tripartite ?",
    "options": [
      "Réduction des coûts de transaction",
      "Délégation de la gestion du collatéral à un tiers neutre",
      "Exemption des règles CSDR",
      "Settlement instantané"
    ],
    "answer": "Délégation de la gestion du collatéral à un tiers neutre",
    "explanation": "Le REPO tripartite (via Euroclear GC Pooling ou Clearstream Triparty) externalise la sélection, valorisation et substitutions du collatéral, réduisant les risques opérationnels."
  },
  {
    "question": "Quelle norme comptable impacte le traitement des Gov Bonds ?",
    "options": [
      "IFRS 9",
      "French GAAP",
      "US GAAP",
      "Toutes ces réponses"
    ],
    "answer": "Toutes ces réponses",
    "explanation": "Les Gov Bonds sont concernés par : IFRS 9 (classification/valorisation), French GAAP (normes locales), et US GAAP pour les entités américaines."
  },
  {
    "question": "Que se passe-t-il si un trade dépasse le cut-off de settlement ?",
    "options": [
      "Pénalité automatique de 0.5%",
      "Le trade est annulé",
      "Settlement reporté à J+1",
      "Déclenchement d'un buy-in"
    ],
    "answer": "Settlement reporté à J+1",
    "explanation": "Les instructions reçues après le cut-off (ex: 15h pour Euroclear) sont traitées le jour ouvrable suivant, sans pénalité immédiate."
  },
  {
    "question": "Quel module génère les écritures comptables dans Calypso ?",
    "options": [
      "Trade Capture",
      "Accounting Engine",
      "Settlement Engine",
      "Collateral Management"
    ],
    "answer": "Accounting Engine",
    "explanation": "L'Accounting Engine transforme les flux économiques en écritures comptables selon les normes (IFRS, GAAP...) avec un report vers les grands livres."
  },
  {
    "question": "Quelle information cruciale manque dans un ticket de trade REPO ?",
    "options": [
      "ISIN du collatéral",
      "Taux repo",
      "Date de valeur",
      "Numéro de compte custodian"
    ],
    "answer": "Numéro de compte custodian",
    "explanation": "L'absence du compte custodian (champ SSI) empêche la génération des instructions SWIFT, bloquant le settlement malgré la présence des autres données."
  },
  {
    "question": "Comment sont settlées les corporate actions ?",
    "options": [
      "Via MT54x comme les trades normaux",
      "Exclusivement en FoP (Free of Payment)",
      "Selon le type d'événement (MT56x)",
      "Uniquement via des virements internes"
    ],
    "answer": "Selon le type d'événement (MT56x)",
    "explanation": "Les corporate actions utilisent la série MT56x (ex: MT564 pour les annonces) avec des règles spécifiques selon l'événement (dividende, split...)."
  },
  {
    "question": "Qui est responsable du matching pré-settlement ?",
    "options": [
      "Le CSD",
      "La contrepartie",
      "Le broker",
      "Le système de matching (ex: DTCC, Euroclear)"
    ],
    "answer": "Le système de matching (ex: DTCC, Euroclear)",
    "explanation": "Les plateformes de matching comparent les instructions des contreparties avant settlement, générant des MT578 pour signaler les divergences."
  },
  {
    "question": "Quel risque réduit le DVP (Delivery vs Payment) ?",
    "options": [
      "Risque de crédit",
      "Risque de change",
      "Risque de règlement",
      "Risque opérationnel"
    ],
    "answer": "Risque de règlement",
    "explanation": "Le DVP élimine le risque principal de règlement en synchronisant transfert de titres et paiement, évitant qu'une partie livre sans être payée."
  },
  {
    "question": "Que gère le module Position Keeping ?",
    "options": [
      "Les historiques de trading",
      "Les soldes titres/cash en temps réel",
      "Les contacts des contreparties",
      "Les documents contractuels"
    ],
    "answer": "Les soldes titres/cash en temps réel",
    "explanation": "Ce module suit les positions brutes/nettes par portefeuille, instrument et contrepartie, crucial pour le risque et la liquidité."
  },
  {
    "question": "Quelle est la première action face à un trade unmatched ?",
    "options": [
      "Lancer un buy-in",
      "Vérifier les champs divergents via MT578",
      "Annuler le trade",
      "Contacter le régulateur"
    ],
    "answer": "Vérifier les champs divergents via MT578",
    "explanation": "Le MT578 détaille les divergences (prix, quantité...). La correction passe par une nouvelle instruction MT543 avant d'envisager des mesures radicales."
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