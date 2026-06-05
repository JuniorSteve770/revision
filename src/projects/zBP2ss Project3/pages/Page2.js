// src/projects/Project1/pages/Page3.js
// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
 {
    "question": "Quel est le rôle de BP2S et à qui s’adresse-t-il ?",
    "answer": "BP2S (BNP Paribas Securities Services) est un prestataire **post-trade** dédié au **buy side** (asset managers, assureurs, fonds). Il gère : custody (conservation d’actifs), middle/back office, valorisation des portefeuilles, gestion du risque opérationnel et reporting réglementaire."
  },
  {
    "question": "BP2S est-il un dépositaire ? Quel est son rôle ?",
    "answer": "**Oui.** En tant que **dépositaire**, BP2S conserve les titres, vérifie la conformité réglementaire des opérations, assure le règlement-livraison et protège les investisseurs (ex : contrôle des mouvements pour un OPCVM)."
  },
  {
    "question": "Quels produits Forex BP2S traite-t-il et pourquoi ?",
    "answer": "BP2S suit opérationnellement les produits FX : **spot, forward, swap, options**. Ces instruments sont utilisés par ses clients pour **gérer le risque de change** et la **liquidité multi-devises** dans les portefeuilles."
  },
  {
    "question": "Quels risques BP2S couvre-t-il sur le Forex ?",
    "answer": "BP2S gère : le **risque de règlement (Herstatt)**, le **risque d’exposition de change** (variations des taux), et le **risque opérationnel** (matching, fails). Il valorise aussi les positions FX en mark-to-market."
  },
  {
    "question": "Quel est le rôle de BP2S dans les opérations REPO ?",
    "answer": "BP2S intervient **post-exécution** : matching, gestion du **collatéral**, règlement-livraison, **valorisation** et **reporting SFTR**. Il déclenche aussi les appels de marge selon la variation de la valeur du collatéral."
  },
  {
    "question": "Comment BP2S suit une opération FX après exécution ?",
    "answer": "Étapes : 1) **Matching** des détails, 2) **Gestion des flux** devises (settlement), 3) Suivi de l’exposition FX, 4) **Valorisation MTM**, 5) Reporting **EMIR / MiFID II**. Objectif : limiter erreurs, couvrir les risques."
  },
  {
    "question": "Comment BP2S gère le PnL d’un portefeuille ?",
    "answer": "Il calcule le **PnL réalisé** (positions clôturées) et **non réalisé** (MTM), les **attribue par stratégie**, intègre les flux (dividendes, coupons), et convertit les devises pour produire les **rapports client**."
  },
  {
    "question": "Quels types de risques BP2S suit-il au quotidien ?",
    "answer": "BP2S surveille : **risques opérationnels** (erreurs, fails, écarts de cash), **risques de marché** (change, taux), **règlements** et **risques réglementaires** (EMIR, SFTR, AIFMD)."
  },
  {
    "question": "Qu’est-ce que le rapprochement comptabilité vs marché ?",
    "answer": "**Rapprochement quotidien** entre la valorisation de marché (MTM) et les données comptables. Objectif : détecter anomalies, oublis d’opérations, erreurs de pricing."
  },
  {
    "question": "Quel est le rôle de BP2S dans le suivi des suspens ?",
    "answer": "BP2S suit les **fails de règlement**, relance les contreparties, classe les anomalies par **impact, ancienneté, devise**, et réduit les risques de pénalité (ex : règlement CSDR)."
  },
  {
    "question": "Quels reportings réglementaires sont pris en charge par BP2S ?",
    "answer": "BP2S produit les reportings : **EMIR (dérivés), SFTR (REPOs), AIFMD, MiFID II, UCITS, FATCA/CRS**. Il s’assure de la qualité et conformité des données déclarées aux régulateurs (AMF, ESMA...)."
  },
  {
    "question": "Pourquoi Excel est-il encore massivement utilisé chez BP2S ?",
    "answer": "Excel offre une **flexibilité** pour gérer les exceptions, **prototyper des rapports**, automatiser des contrôles avec **VBA**, et faire du **data cleansing**. Il reste un pont entre le SI et les utilisateurs métiers."
  },
  {
    "question": "Quelles tâches opérationnelles sont faites avec Excel ?",
    "answer": "Excel est utilisé pour : **matching d’opérations**, suivi de **suspens**, **valorisation FX**, calcul de PnL, contrôle qualité et **reporting client**. Outils : **VLOOKUP**, **SUMIFS**, **Power Query**, **macros**."
  },
  {
    "question": "Quelles macros VBA sont utiles chez BP2S ?",
    "answer": "Automatisation de : **exports CSV**, **fusion de fichiers**, **alertes de seuils**, **préparation de reportings PnL**, **simulations de stress test (taux, FX)**, et **contrôles conditionnels** sur gros volumes de données."
  },
  {
    "question": "Quels risques et indicateurs sont simulés avec Excel ?",
    "answer": "Exemples : **DV01**, **durée modifiée**, **Value at Risk simple**, **stress test FX / taux**, **calcul d’exposition devises**, **marges collatérales**. Outils : formules, solver, graphiques de simulation."
  },
 
  {
    "question": "Qu'est-ce que la VaR (Value at Risk) en gestion du risque de marché ?",
    "answer": "**VaR (Value at Risk)** : mesure la perte maximale potentielle sur un portefeuille à un **seuil de confiance donné** (ex : 99%) sur une **durée donnée** (ex : 1 jour). Formule simplifiée : `VaR = σ * z * √t * V`. Méthodes : **paramétrique**, **historique**, **simulation de Monte Carlo**. ⚠️ Ne tient pas compte des pertes extrêmes au-delà du seuil."
  },
  {
    "question": "Quelles sont les principales méthodes de calcul de la VaR ?",
    "answer": "**Méthodes VaR** : 1) **Paramétrique** (hypothèse de distribution normale), 2) **Historique** (utilisation des données passées), 3) **Simulation de Monte Carlo** (génération de scénarios aléatoires). Chaque méthode a ses forces et ses limites selon la nature du portefeuille."
  },
  {
    "question": "Quelles sont les métriques de gestion de portefeuille pertinentes pour le Forex ?",
    "answer": "**Métriques Forex** : Volatilité (σ), Tracking Error, Beta, Stress Test / Backtest." ,
  },
  {
    "question": "Quel est le rôle du ratio de Sharpe en finance ?",
    "answer": "**Sharpe Ratio** = `(R - Rf) / σ` : mesure la performance excédentaire par rapport à l’actif sans risque, ajustée par la **volatilité totale**. ➤ Utilisé quand les rendements sont **symétriques** et normalement distribués. ⚠️ Ne distingue pas les hausses et baisses."
  },
  {
    "question": "En quoi le ratio de Sortino est-il différent du ratio de Sharpe ?",
    "answer": "**Sortino Ratio** = `(R - Rf) / σ-` : comme le Sharpe, mais ne prend en compte que la **volatilité négative** (**σ- = downside deviation**). ➤ Mieux adapté aux stratégies avec **rendements asymétriques**. ➤ Ex : utile pour un portefeuille Forex orienté haussier."
  },
  {
    "question": "Quel ratio de performance est utile pour mesurer le risque de perte maximale ?",
    "answer": "**Calmar Ratio** = `Rendement annualisé / Max Drawdown` : indique la performance par rapport à la **plus forte perte subie**. ➤ Pertinent en **Forex**, où les retracements sont fréquents. ➤ Plus le ratio est élevé, meilleure est la résilience du portefeuille."
  },
  {
    "question": "Comment interpréter l'Information Ratio dans une stratégie de trading ?",
    "answer": "**Information Ratio** = `(Rp - Rb) / Tracking Error` : mesure la **surperformance** d’un portefeuille par rapport à un benchmark, corrigée du **risque de suivi**. ➤ Plus il est élevé, plus la gestion est active et efficace."
  },
  {
    "question": "Quels sont les principaux risques spécifiques au marché Forex ?",
    "answer": "**Risques Forex** : Risque directionnel, Corrélation croisée, Effet de levier, Slippage / Liquidité, Risque macro/politique, Carry Trade Risk, Gap de marché."
  }


];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

     {
    "question": "Quel est le rôle principal de BP2S dans la chaîne financière ?",
    "options": [
      "Exécuter les ordres de marché pour les traders",
      "Fournir des services post-trade aux acteurs institutionnels",
      "Gérer des portefeuilles pour le compte des clients",
      "Offrir des prêts aux particuliers"
    ],
    "answer": "Fournir des services post-trade aux acteurs institutionnels",
    "explanation": "BP2S fournit des services post-trade : custody, middle/back office, valorisation, gestion des risques opérationnels et reporting réglementaire."
  },
  {
    "question": "BP2S est principalement rattaché à quel type d’acteurs ?",
    "options": [
      "Aux clients particuliers",
      "Aux salles de marché (sell side)",
      "Aux gestionnaires d’actifs et investisseurs institutionnels",
      "Aux fintechs de paiement"
    ],
    "answer": "Aux gestionnaires d’actifs et investisseurs institutionnels",
    "explanation": "BP2S sert le buy side (fonds, assureurs, sociétés de gestion) avec un support opérationnel post-trade."
  },
  {
    "question": "Quels produits FOREX sont suivis opérationnellement par BP2S ?",
    "options": [
      "Uniquement les produits dérivés",
      "FX Spot, Forward, Swap, Options",
      "Actions et obligations",
      "ETF uniquement"
    ],
    "answer": "FX Spot, Forward, Swap, Options",
    "explanation": "BP2S assure le suivi post-trade des produits FX utilisés pour les besoins de change et de couverture."
  },
  {
    "question": "Quel est un des risques majeurs dans les opérations de change ?",
    "options": [
      "Risque de durée",
      "Risque Herstatt (non-livraison contre paiement)",
      "Risque de fiscalité",
      "Risque de réputation"
    ],
    "answer": "Risque Herstatt (non-livraison contre paiement)",
    "explanation": "Le risque Herstatt correspond à un défaut de livraison dans une opération de change ; BP2S le gère via CLS et des mécanismes de compensation."
  },
  {
    "question": "Quel est le rôle de BP2S dans une opération REPO ?",
    "options": [
      "Passer les ordres sur le marché",
      "Assurer le post-trade : confirmation, collatéral, règlement, valorisation",
      "Créer des produits dérivés",
      "Agir comme contrepartie centrale"
    ],
    "answer": "Assurer le post-trade : confirmation, collatéral, règlement, valorisation",
    "explanation": "BP2S intervient en post-trade : validation, gestion du collatéral, règlement, valorisation mark-to-market, et reporting SFTR."
  },
  {
    "question": "Qu'est-ce qu'un PnL non réalisé ?",
    "options": [
      "Un gain/perte sur une position clôturée",
      "Une erreur comptable à corriger",
      "Une valorisation théorique d'une position ouverte",
      "Un dividende non versé"
    ],
    "answer": "Une valorisation théorique d'une position ouverte",
    "explanation": "Le PnL non réalisé reflète les gains ou pertes latents sur les positions ouvertes, en fonction du mark-to-market (MTM)."
  },
  {
    "question": "Quelle plateforme est utilisée pour le matching des opérations FX ?",
    "options": [
      "Amazon Web Services",
      "SWIFT MT300 / FXGO / MarkitWire",
      "MetaTrader 5",
      "Excel uniquement"
    ],
    "answer": "SWIFT MT300 / FXGO / MarkitWire",
    "explanation": "BP2S utilise des plateformes comme SWIFT, Bloomberg FXGO et MarkitWire pour assurer la confirmation des opérations FX."
  },
  {
    "question": "Qu’est-ce qu’un fail dans un contexte post-trade ?",
    "options": [
      "Une erreur de saisie client",
      "Une perte définitive de titres",
      "Un échec de règlement/livraison",
      "Un bug logiciel sans impact"
    ],
    "answer": "Un échec de règlement/livraison",
    "explanation": "Un 'fail' désigne une transaction non réglée à temps ; les équipes BP2S les suivent pour éviter des pénalités ou des risques opérationnels."
  },
  {
    "question": "Pourquoi Excel est-il encore largement utilisé chez BP2S ?",
    "options": [
      "Parce que les autres outils sont trop chers",
      "Pour prototyper rapidement et gérer les cas non couverts par le SI",
      "Parce qu'il n'y a pas d'autres solutions",
      "Pour créer des bases de données centralisées"
    ],
    "answer": "Pour prototyper rapidement et gérer les cas non couverts par le SI",
    "explanation": "Excel reste indispensable pour sa flexibilité, sa rapidité d’adaptation, et sa capacité à automatiser via VBA dans les flux post-trade."
  },
  {
    "question": "Quel type de reporting réglementaire BP2S produit-il ?",
    "options": [
      "Déclarations fiscales personnelles",
      "EMIR, SFTR, AIFMD, MiFID II, FATCA",
      "Rapports internes uniquement",
      "Prospectus des fonds"
    ],
    "answer": "EMIR, SFTR, AIFMD, MiFID II, FATCA",
    "explanation": "BP2S prend en charge le reporting règlementaire pour ses clients buy side conformément aux normes européennes et internationales."
  },
  ],
  avance: [
     {
    "question": "Un client buy side t’informe d’un écart de PnL anormal sur son portefeuille. Quelle est ta première réaction ?",
    "options": [
      "Recalculer le PnL avec Excel à la main",
      "Transmettre le problème au département comptable",
      "Analyser les flux, valorisations et FX pour détecter l’origine de l’écart",
      "Annuler l’opération litigieuse immédiatement"
    ],
    "answer": "Analyser les flux, valorisations et FX pour détecter l’origine de l’écart",
    "explanation": "Le rôle du middle/back office est de tracer les flux (cash, titres), vérifier la valorisation, et contrôler la conversion devises avant d’escalader si nécessaire."
  },
  {
    "question": "Lors d’un rapprochement, tu détectes un écart de valorisation entre le système comptable et celui de marché. Que fais-tu ?",
    "options": [
      "Corriger la comptabilité manuellement",
      "Notifier l’écart sans vérification",
      "Comparer les sources de prix, valider les dates, vérifier les coupons/dividendes",
      "Ignorer si l’écart est faible"
    ],
    "answer": "Comparer les sources de prix, valider les dates, vérifier les coupons/dividendes",
    "explanation": "Le rapprochement compta/MTM implique une vérification rigoureuse : source de données, devises, dates de valeur, OST éventuels."
  },
  {
    "question": "Que fais-tu si une opération FX spot ne se règle pas dans les temps (fail) ?",
    "options": [
      "Laisser la contrepartie relancer",
      "Émettre une alerte de règlement et contacter immédiatement la contrepartie",
      "Annuler l’opération",
      "Réexécuter l’ordre à la place du client"
    ],
    "answer": "Émettre une alerte de règlement et contacter immédiatement la contrepartie",
    "explanation": "Un fail de règlement FX est critique ; il faut identifier la cause (IBAN, devise, date valeur, instructions SWIFT) et relancer les parties prenantes."
  },
  {
    "question": "Comment sécuriser une macro Excel destinée au calcul du PnL quotidien ?",
    "options": [
      "Cacher les feuilles de calcul",
      "Utiliser des mots de passe forts",
      "Documenter le code, gérer les erreurs, limiter les entrées utilisateurs",
      "Empêcher l'accès à Internet"
    ],
    "answer": "Documenter le code, gérer les erreurs, limiter les entrées utilisateurs",
    "explanation": "En environnement critique, une macro doit être robuste : logs, contrôles, commentaires, gestion d'erreurs, vérifications d'entrée et procédures de rollback."
  },
  {
    "question": "En période de clôture mensuelle, un client demande un reporting personnalisé urgent. Comment réagis-tu ?",
    "options": [
      "Refuser la demande car ce n’est pas prévu",
      "Demander une dérogation à ton responsable et prioriser selon impact client",
      "Reporter à la semaine suivante",
      "Lancer une extraction brute sans contrôle"
    ],
    "answer": "Demander une dérogation à ton responsable et prioriser selon impact client",
    "explanation": "Tu dois rester orienté client tout en respectant la hiérarchie. Il faut évaluer l’urgence, discuter des arbitrages avec ton manager, et sécuriser la production."
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
const Page2 = () => {
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


export default Page2;