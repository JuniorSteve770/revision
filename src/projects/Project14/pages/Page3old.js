// src/projects/Project3/pages/Page3.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "Swaps Financiers (Définition & Typologie)",
    "answer": "**Swap** : Contrat dérivé d'échange de flux financiers de gré à gré (OTC). ◆ **Types clés** : **IRS** (Taux fixe vs variable), **Currency Swap** (De devises différentes avec échange de nominal), **Basis Swap** (Deux taux variables différents, ex: Euribor 3M vs 6M), **TRS** (Total Return Swap - performance d'un actif contre taux)."
  },
  {
    "question": "IRS — Fonctionnement & Formules",
    "answer": "**IRS** : Pas d'échange de capital au départ. Flux nets compensés périodiquement. ◆ **Fixe** : `Flux = Nominal * Taux Fixe * Fraction d'année`. ◆ **Variable** : `Flux = Nominal * Taux de Réf (ex: Euribor/SOFR) * Fraction d'année`. ◆ **Valorisation (VAN)** : Actualisation des flux attendus avec les courbes de taux Zéro-Coupon."
  },
  {
    "question": "Total Return Swap (TRS) & Usage",
    "answer": "**TRS** : Une partie reçoit le rendement total d'un actif (dividendes + gain en capital) contre le paiement d'un taux monétaire standard + spread. ◆ **Usage** : Permet à un fonds spéculatif d'obtenir une exposition à un panier d'actions sans l'acheter physiquement et sans impact sur son bilan."
  },
  {
    "question": "Equity vs Fixed Income (Risques & Structure)",
    "answer": "**Equity (Actions)** : Droit de propriété, dividendes variables et non garantis, volatilité élevée, durée de vie infinie. ◆ **Fixed Income (Obligations)** : Titre de créance, coupons réguliers fixes ou variables, échéance définie. ◆ **Remboursement** : En cas de faillite, les créanciers obligataires sont payés prioritairement (dette senior) avant les actionnaires."
  },
  {
    "question": "Indicateurs d'Analyse (Equity vs Bond)",
    "answer": "**Equity** : PER (Price Earnings Ratio), BPA (Bénéfice par Action), Bêta (Sensibilité marché). ◆ **Fixed Income** : YTM (Yield to Maturity - rendement à l'échéance), Duration (Sensibilité du prix aux variations de taux d'intérêt), Spread de crédit."
  },
  {
    "question": "Produits Hybrides & Risques",
    "answer": "**Obligations Convertibles** : Obligation classique pouvant être convertie en actions à un prix prédéfini. ◆ **Preferred Shares** : Dividendes prioritaires mais sans droit de vote. ◆ **Risques Obligations** : Risque de taux (hausse des taux = baisse des prix), Risque de défaut (rating AAA à D), Risque d'inflation."
  }
];

const questions = {
  moyen: [
    {
      "question": "Dans le calcul des flux d'un swap de taux (IRS), pourquoi la méthode de comptage des jours (Day Count Convention) est-elle importante ?",
      "options": [
        "Elle détermine le fuseau horaire de la transaction",
        "Elle définit exactement le nombre de jours de la période pour calculer le prorata du taux (ex: Act/360 ou 30/360)",
        "Elle limite le montant nominal transféré",
        "Elle permet de calculer le spread de crédit"
      ],
      "answer": "Elle définit exactement le nombre de jours de la période pour calculer le prorata du taux (ex: Act/360 ou 30/360)",
      "explanation": "La fraction d'année (ex: nombre exact de jours divisé par 360 pour Act/360) multiplie le taux annuel pour obtenir le montant du flux. Une différence d'un jour sur un nominal de 100M€ représente des milliers d'euros."
    },
    {
      "question": "Quelle est la principale différence entre un Interest Rate Swap (IRS) et un Cross Currency Swap ?",
      "options": [
        "L'IRS se négocie en bourse, pas le Cross Currency Swap",
        "L'IRS implique une seule devise sans échange de nominal ; le Cross Currency Swap implique deux devises avec échange du nominal à l'initiation et à l'échéance",
        "Le Cross Currency Swap n'a pas de taux variable",
        "L'IRS est un produit hybride"
      ],
      "answer": "L'IRS implique une seule devise sans échange de nominal ; le Cross Currency Swap implique deux devises avec échange du nominal à l'initiation et à l'échéance",
      "explanation": "Dans un swap de devises croisées (Cross Currency Swap), les nominaux dans chaque devise sont physiquement échangés au début et à la fin pour couvrir le risque de change global, contrairement à l'IRS où les flux sont nets."
    },
    {
      "question": "Pourquoi la duration d'une obligation zéro-coupon est-elle exactement égale à sa maturité ?",
      "options": [
        "Parce qu'il n'y a pas de risque de crédit sur un zéro-coupon",
        "Parce qu'aucun flux intermédiaire (coupon) n'est versé avant l'échéance finale",
        "Parce que le taux d'intérêt est fixe et égal à zéro",
        "Parce que la valeur nominale est de 100"
      ],
      "answer": "Parce qu'aucun flux intermédiaire (coupon) n'est versé avant l'échéance finale",
      "explanation": "La duration est la moyenne pondérée du temps nécessaire pour recevoir tous les flux. Puisqu'une obligation zéro-coupon ne verse qu'un seul flux à l'échéance (remboursement final), sa duration est égale à sa maturité."
    }
  ],
  avance: [
    {
      "question": "Comment modélise-t-on le risque de contrepartie (CVA/DVA) d'un portefeuille de swaps de taux dans un système de gestion des risques (TMS) ?",
      "options": [
        "En appliquant un taux d'intérêt négatif constant",
        "En simulant les trajectoires futures des taux (Monte Carlo) pour calculer l'Exposition Positive Attendue (EPE) pondérée par les probabilités de défaut de la contrepartie",
        "En limitant les transactions au format XML",
        "En utilisant des threads séparés pour chaque swap"
      ],
      "answer": "En simulant les trajectoires futures des taux (Monte Carlo) pour calculer l'Exposition Positive Attendue (EPE) pondérée par les probabilités de défaut de la contrepartie",
      "explanation": "L'ajustement de valeur de crédit (CVA) quantifie le risque de défaut de la contrepartie. Il nécessite de simuler le portefeuille de swaps sous différents scénarios de taux pour connaître l'exposition future maximale potentielle."
    },
    {
      "question": "Dans quel cas un investisseur institutionnel préférera-t-il acheter une Obligation Convertible plutôt que l'action sous-jacente ?",
      "options": [
        "Pour éliminer totalement le risque de taux d'intérêt",
        "Pour participer au potentiel de hausse de l'action tout en bénéficiant d'un plancher de sécurité (remboursement obligataire) en cas de baisse",
        "Pour obtenir des droits de vote doubles aux assemblées",
        "Pour éviter le paiement de taxes sur les transactions"
      ],
      "answer": "Pour participer au potentiel de hausse de l'action tout en bénéficiant d'un plancher de sécurité (remboursement obligataire) en cas de baisse",
      "explanation": "L'obligation convertible offre un profil asymétrique (convexe) : si l'action s'effondre, l'investisseur garde la valeur intrinsèque de l'obligation (remboursement du nominal à maturité). Si l'action monte, il convertit."
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
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Impressionnant ! Vous maîtrisez les produits financiers de marché.</h3> : <p className="fail">📚 Révisez les concepts de swaps et de titres à revenu fixe.</p>}
    </div>
  );
};

const Page3 = () => {
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
            Produits de Marché 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
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

export default Page3;