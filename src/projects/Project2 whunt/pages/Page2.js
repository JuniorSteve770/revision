// src/projects/Project2/pages/Page2.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

 {
    "question": "Quels sont les progiciels couramment utilisés pour le traitement post-trade front-to-back ?",
    "answer": "Summit, SOPHIS, Calypso, Murex et d'autres progiciels permettent une intégration front-to-back avec traçabilité de bout en bout des opérations de marché."
  },
  {
    "question": "Quelles sont les trois étapes principales du traitement post-trade ?",
    "answer": "1) Booking du trade, 2) Contrôle Middle Office, 3) Transmission aux infrastructures (CSD/ICSD via messages SWIFT)."
  },
  {
    "question": "Quels messages SWIFT sont utilisés pour les instructions de settlement ?",
    "answer": "MT540 à MT543 pour les instructions de settlement, MT548 pour le statut, et MT578 pour les trades matched/unmatched."
  },
  {
    "question": "Quelles sont les spécificités du traitement post-trade pour les Gov Bonds ?",
    "answer": "Déposés via Euroclear/Clearstream ou T2S, avec gestion spécifique des strips, maturité, et risk-weighted assets (RWA)."
  },
  {
    "question": "Quel module des progiciels gère le collatéral dans les opérations REPO ?",
    "answer": "Le module Collateral Management suit le collatéral, les appels de marge et les haircuts dans les opérations REPO."
  },
  {
    "question": "Qu'est-ce qu'un Buy-in dans le contexte post-trade ?",
    "answer": "Mécanisme imposé par CSDR si un règlement échoue après 4 jours: la contrepartie défaillante est remplacée par un achat sur le marché pour honorer le deal."
  },
  {
    "question": "Quel est le rôle des ICSD comme Euroclear et Clearstream ?",
    "answer": "Ce sont des banques dépositaires internationales qui gèrent les titres, les instructions et les flux de règlement-livraison."
  },
  {
    "question": "Qu'entend-on par 'Cut-off' dans le processus post-trade ?",
    "answer": "Heure limite d'envoi des instructions de règlement pour garantir un settlement le jour même (ex: 15h CET pour Euroclear)."
  },
  {
    "question": "Comment les progiciels gèrent-ils les corporate actions ?",
    "answer": "Via un module dédié qui intègre les événements sur titres comme les dividendes, splits et fusions, et met à jour les positions en conséquence."
  },
  {
    "question": "Quel est le rôle du DOM (Domestic Market) dans le post-trade ?",
    "answer": "Marché local souvent lié au CSD national (ex: Borsa Italiana/Monte Titoli), gérant les opérations et settlements domestiques."
  },
  {
    "question": "Quelle est la différence entre un CSD et un ICSD ?",
    "answer": "Un CSD (Central Securities Depository) gère les titres d'un marché domestique (ex: Euroclear France), tandis qu'un ICSD (International CSD) comme Euroclear Bank ou Clearstream Luxembourg gère les titres internationaux et multi-devises."
  },
  {
    "question": "Comment le module SSI fonctionne-t-il dans Summit/SOPHIS ?",
    "answer": "Le module SSI (Standard Settlement Instructions) stocke les paramètres des comptes custodians et contreparties pour générer automatiquement les instructions SWIFT (ex: MT54x) sans saisie manuelle."
  },
  {
    "question": "Quels sont les 3 types de settlement pour les equities ?",
    "answer": "1) DVP (Delivery vs Payment), 2) RVP (Receive vs Payment), 3) Free of Payment (FoP) - selon si le transfert de titres et cash est lié ou non."
  },
  {
    "question": "Pourquoi les repos utilisent-ils souvent un collateral management tripartite ?",
    "answer": "Pour déléguer la gestion du collatéral (sélection, valorisation, substitutions) à un tiers neutre (ex: Euroclear GC Pooling), réduisant le risque de contrepartie et automatisant les appels de marge."
  },
  {
    "question": "Que signifie 'Fail de règlement' et comment le gère-t-on ?",
    "answer": "Échec du settlement à J+2 (pour les equities). Le progiciel relance l'instruction modifiée, applique des pénalités CSDR, et peut déclencher un buy-in si le fail persiste."
  },
  {
    "question": "Quel est l'impact de T2S sur le post-trade en Europe ?",
    "answer": "Target2-Securities harmonise le settlement en Europe via une plateforme unique (en banque centrale money), réduisant les coûts et les délais pour les cross-border settlements."
  },
  {
    "question": "Comment les corporate actions sont-elles traitées dans Calypso ?",
    "answer": "Via un module dédié qui : 1) Capture les annonces (SWIFT MT564), 2) Met à jour les positions, 3) Gère les élections (options de corporate actions), 4) Génère les instructions de paiement."
  },
  {
    "question": "Quels champs sont obligatoires pour le booking d'un trade repo ?",
    "answer": "ISIN du collatéral, taux repo, date de démarrage/terme, contrepartie, haircut, type de collatéral (GC/specific), et compte custodian pour le settlement."
  },
  {
    "question": "Quelle est la différence entre MT540 et MT543 en SWIFT ?",
    "answer": "MT540 = instruction de settlement initiale, MT543 = modification/cancellation d'une instruction existante (ex: pour corriger un fail)."
  },
  {
    "question": "Comment Summit gère-t-il les coupons d'obligations ?",
    "answer": "1) Calcule l'intérêt couru (ACT/ACT ou 30/360), 2) Génère un événement à la date de coupon, 3) Émet une instruction SWIFT MT54x pour le paiement via le custodian."
  },
  {
    "question": "Qu'est-ce que le 'position keeping' et pourquoi est-il critique ?",
    "answer": "Suivi en temps réel des positions titres/cash par portefeuille. Critique pour : 1) Le risque (couverture), 2) La liquidité, 3) La conformité (limites réglementaires)."
  },
  {
    "question": "Qui sont les acteurs clés dans le traitement d'un equity trade ?",
    "answer": "1) Le broker (exécution), 2) Le CSD local (settlement), 3) La contrepartie, 4) Le custodian (tenue de compte), 5) Le MO (vérification)."
  },
  {
    "question": "Pourquoi les Gov Bonds ont-ils un traitement post-trade spécifique ?",
    "answer": "Car ils : 1) Sont souvent déposés en ICSD, 2) Ont des règles de collateral particulières (ex: haircut 0% pour EGBs), 3) Sont utilisés pour la liquidité bancaire (LCR/NSFR)."
  },
  {
    "question": "Comment un système comme Calypso intègre-t-il la comptabilité ?",
    "answer": "Via un module générant des écritures : 1) Au trading date (comptes d'ordre), 2) Au settlement date (mouvements réels), selon les normes IFRS ou locales."
  }
  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
  {
    "question": "Quel est le rôle principal d’un progiciel comme Summit ou SOPHIS dans le post-trade ?",
    "options": [
      "Effectuer l’analyse financière des actifs",
      "Garantir une traçabilité front-to-back de l’opération",
      "Optimiser les rendements des portefeuilles",
      "Répartir les tâches entre traders"
    ],
    "answer": "Garantir une traçabilité front-to-back de l’opération",
    "explanation": "Les progiciels front-to-back assurent un suivi complet de la transaction, du booking initial jusqu’à l’intégration comptable."
  },
  {
    "question": "Quel message SWIFT est utilisé pour transmettre une instruction de règlement ?",
    "options": [
      "MT103",
      "MT548",
      "MT540",
      "MT799"
    ],
    "answer": "MT540",
    "explanation": "Les messages MT540 à MT543 sont utilisés pour transmettre les instructions de règlement DVP/RVP dans les systèmes post-trade."
  },
  {
    "question": "Quelle étape suit généralement le booking d’un trade par le Front Office ?",
    "options": [
      "Le règlement par Clearstream",
      "Le contrôle Middle Office",
      "L’intégration comptable",
      "L’envoi automatique au client"
    ],
    "answer": "Le contrôle Middle Office",
    "explanation": "Le Middle Office vérifie les paramètres du trade, enrichit les données (SSI, broker ID…) et génère les instructions de règlement."
  },
  {
    "question": "Quelle est une fonctionnalité clé du module ‘Collateral Management’ ?",
    "options": [
      "Gérer les dividendes",
      "Calculer les taux d’intérêt",
      "Suivre les appels de marge",
      "Attribuer les ISIN"
    ],
    "answer": "Suivre les appels de marge",
    "explanation": "Le module de gestion du collatéral surveille les appels de marge, les haircuts, et assure l’allocation dynamique des garanties."
  },
  {
    "question": "Quel type d’actif nécessite une gestion des strips et des Risk-Weighted Assets (RWA) ?",
    "options": [
      "Equity",
      "Cash",
      "Government Bonds",
      "Repos"
    ],
    "answer": "Government Bonds",
    "explanation": "Les obligations d’État (Gov Bonds) ont des particularités post-trade comme la gestion des strips et le calcul de leur pondération en risque."
  },
  {
    "question": "Quelle conséquence peut entraîner un cut-off raté ?",
    "options": [
      "Le trade est annulé",
      "Le settlement est repoussé à J+1",
      "Une instruction MT578 est générée",
      "Le deal passe directement au DOM"
    ],
    "answer": "Le settlement est repoussé à J+1",
    "explanation": "Si l’instruction de règlement est envoyée après l’heure limite (cut-off), le règlement est décalé au jour de règlement suivant."
  },
  {
    "question": "Quel acteur est responsable du règlement-livraison en monnaie banque centrale via T2S ?",
    "options": [
      "Broker",
      "CSD local",
      "Clearstream Triparty",
      "T2S"
    ],
    "answer": "T2S",
    "explanation": "T2S est une plateforme européenne de règlement en monnaie centrale, connectant les CSDs comme Euroclear ou Clearstream."
  },
  {
    "question": "En cas de fail prolongé, quel mécanisme est déclenché selon CSDR ?",
    "options": [
      "Rebooking",
      "Buy-In",
      "Blocking",
      "MT578"
    ],
    "answer": "Buy-In",
    "explanation": "Le Buy-In consiste à acheter l’actif sur le marché pour compenser un fail persistant au-delà de 4 jours ouvrés, selon la régulation CSDR."
  },
  {
    "question": "Quel message SWIFT informe d’un échec ou succès de règlement ?",
    "options": [
      "MT103",
      "MT548",
      "MT540",
      "MT599"
    ],
    "answer": "MT548",
    "explanation": "Le message MT548 est utilisé pour notifier le statut d’une instruction de règlement : settled, pending, failed, etc."
  },
  {
    "question": "Quel module progiciel permet de configurer les comptes de règlement des contreparties ?",
    "options": [
      "Accounting",
      "Trade Blotter",
      "SSI",
      "Position Keeping"
    ],
    "answer": "SSI",
    "explanation": "Le module SSI (Standard Settlement Instructions) centralise les données de règlement (comptes, banques, dépositaires) par contrepartie."
  }
  ],
  avance: [
     {
    "question": "Quel est le rôle d’un ICSD comme Euroclear Bank ?",
    "options": [
      "Gérer les ordres de marché primaire",
      "Fournir des analyses financières",
      "Assurer la conservation et le règlement-livraison de titres internationaux",
      "Calculer les intérêts courus"
    ],
    "answer": "Assurer la conservation et le règlement-livraison de titres internationaux",
    "explanation": "Les ICSDs (International Central Securities Depositories) comme Euroclear Bank gèrent la détention et le règlement des titres à l’échelle internationale."
  },
  {
    "question": "Quel type de message SWIFT est généré pour notifier le matching ou non-matching d’un trade ?",
    "options": [
      "MT540",
      "MT548",
      "MT578",
      "MT202"
    ],
    "answer": "MT578",
    "explanation": "Le message MT578 informe du statut de matching d’une transaction (matched/unmatched) dans les systèmes de règlement."
  },
  {
    "question": "Quel type d’actif implique une gestion du netting des paiements ?",
    "options": [
      "Gov Bonds",
      "Equities",
      "Cash",
      "Repos"
    ],
    "answer": "Cash",
    "explanation": "Les paiements en cash peuvent être regroupés (netting) pour optimiser les flux financiers dans les systèmes de trésorerie."
  },
  {
    "question": "Quelle est la conséquence directe d’un fail de règlement ?",
    "options": [
      "Aucun impact",
      "Une pénalité et reprocessing de l’instruction",
      "Le trade est annulé automatiquement",
      "Les titres sont revendus"
    ],
    "answer": "Une pénalité et reprocessing de l’instruction",
    "explanation": "Un fail déclenche des pénalités CSDR et nécessite un retraitement de l’instruction dans le progiciel BO (Back Office)."
  },
  {
    "question": "Quel module d’un progiciel est responsable du suivi des positions cash et titres ?",
    "options": [
      "Trade Blotter",
      "Settlement Engine",
      "Position Keeping",
      "Collateral Management"
    ],
    "answer": "Position Keeping",
    "explanation": "Ce module permet de visualiser et suivre les positions détenues en titres ou en liquidités dans le portefeuille du client ou de la banque."
  },
  {
    "question": "Quel acteur assure le lien entre une entreprise émettrice et les marchés pour ses actions ?",
    "options": [
      "Clearstream",
      "Corporate Broking",
      "CSD",
      "Broker Retail"
    ],
    "answer": "Corporate Broking",
    "explanation": "Le corporate broker accompagne les sociétés cotées dans leurs relations avec les investisseurs et le marché (dividendes, émissions, fusions…)."
  },
  {
    "question": "Quel est le rôle d’un CSD local comme Euroclear France ?",
    "options": [
      "Effectuer les trades de marché",
      "Gérer la trésorerie centrale",
      "Assurer le règlement-livraison des titres domestiques",
      "Proposer des produits dérivés"
    ],
    "answer": "Assurer le règlement-livraison des titres domestiques",
    "explanation": "Un CSD (Central Securities Depository) local gère les titres d’un marché domestique et leur règlement-livraison."
  },
  {
    "question": "Quelle instruction SWIFT est utilisée pour un paiement interbancaire en cash ?",
    "options": [
      "MT103",
      "MT540",
      "MT548",
      "MT202"
    ],
    "answer": "MT202",
    "explanation": "Le message MT202 est utilisé pour les paiements interbancaires liés à des règlements de titres ou à des opérations de trésorerie."
  },
  {
    "question": "Quel outil ou canal est principalement utilisé pour transmettre les instructions aux CSD ?",
    "options": [
      "Email sécurisé",
      "API REST",
      "Module SWIFT intégré au progiciel",
      "FTP externe"
    ],
    "answer": "Module SWIFT intégré au progiciel",
    "explanation": "Les instructions sont transmises via le module SWIFT (MT540-549) intégré aux progiciels comme Summit, SOPHIS ou Calypso."
  },
  {
    "question": "Que se passe-t-il en cas d’erreur de booking détectée en post-trade ?",
    "options": [
      "Le trade est annulé dans le marché",
      "L’erreur est corrigée via rebooking ou workflow MO",
      "Une nouvelle devise est automatiquement affectée",
      "Le settlement est validé malgré l’erreur"
    ],
    "answer": "L’erreur est corrigée via rebooking ou workflow MO",
    "explanation": "Le Middle Office peut corriger l’erreur via un rebooking ou une annulation suivie d’une nouvelle saisie dans le système."
  },
  {
    "question": "Quel est l’objectif principal du module Collateral Management dans un progiciel post-trade ?",
    "options": [
      "Suivre les flux de trésorerie",
      "Gérer les appels de marge et les garanties (collatéral)",
      "Générer les écritures comptables",
      "Valider les ordres de trading"
    ],
    "answer": "Gérer les appels de marge et les garanties (collatéral)",
    "explanation": "Le module Collateral Management assure le suivi des garanties apportées, des appels de marge et des haircuts pour sécuriser les opérations financières."
  },
  {
    "question": "Quelle est la fonction principale du Settlement Engine dans les progiciels comme Summit ou Calypso ?",
    "options": [
      "Créer les ordres de trading",
      "Générer automatiquement les instructions de règlement-livraison SWIFT",
      "Calculer les intérêts courus",
      "Réaliser les contrôles de conformité"
    ],
    "answer": "Générer automatiquement les instructions de règlement-livraison SWIFT",
    "explanation": "Le Settlement Engine produit les messages SWIFT MT54x nécessaires au règlement des opérations post-trade."
  },
  {
    "question": "Quelle est la conséquence d’un cut-off raté pour une instruction de règlement ?",
    "options": [
      "L’instruction est annulée définitivement",
      "Le règlement est repoussé au jour ouvré suivant (J+1)",
      "Le trade est automatiquement remboursé",
      "Le client reçoit une pénalité"
    ],
    "answer": "Le règlement est repoussé au jour ouvré suivant (J+1)",
    "explanation": "Si l’instruction est envoyée après l’heure limite (cut-off), le règlement est reporté au prochain jour ouvré pour garantir la bonne exécution."
  },
  {
    "question": "Quel type de message SWIFT informe du statut d’un règlement (ex: matched, settled) ?",
    "options": [
      "MT548",
      "MT103",
      "MT202",
      "MT540"
    ],
    "answer": "MT548",
    "explanation": "Le message MT548 informe des statuts de settlement comme matched, settled, pending ou cancelled."
  },
  {
    "question": "Que désigne le terme « Buy-in » dans la gestion des incidents post-trade ?",
    "options": [
      "L’achat de titres en bourse pour une nouvelle position",
      "L’obligation d’acheter sur le marché pour couvrir un fail de règlement persistant",
      "La clôture anticipée d’un repo",
      "Un transfert automatique de collatéral"
    ],
    "answer": "L’obligation d’acheter sur le marché pour couvrir un fail de règlement persistant",
    "explanation": "Le buy-in est une procédure imposée par la réglementation CSDR pour pallier un fail persistant en achetant les titres sur le marché."
  },
  {
    "question": "Qu’est-ce que les Standard Settlement Instructions (SSI) dans un progiciel front-to-back ?",
    "options": [
      "Des paramètres préenregistrés des comptes de contrepartie et custodians pour le règlement",
      "Un rapport financier trimestriel",
      "Une liste des ordres de trading",
      "Un manuel d’utilisation du logiciel"
    ],
    "answer": "Des paramètres préenregistrés des comptes de contrepartie et custodians pour le règlement",
    "explanation": "Les SSI facilitent l’automatisation et la cohérence des instructions de règlement en enregistrant les coordonnées bancaires et comptes de chaque contrepartie."
  },
  {
    "question": "Quel acteur est principalement responsable de l’exécution des ordres pour le client ?",
    "options": [
      "Broker",
      "CSD",
      "Corporate Broking",
      "ICSD"
    ],
    "answer": "Broker",
    "explanation": "Le broker exécute les ordres du client sur les marchés et fournit la confirmation d’exécution."
  },
  {
    "question": "Dans quel système européen harmonisé les règlements-livraisons sont-ils effectués en monnaie centrale ?",
    "options": [
      "Clearstream",
      "T2S (Target2-Securities)",
      "Euroclear Bank",
      "Monte Titoli"
    ],
    "answer": "T2S (Target2-Securities)",
    "explanation": "T2S est la plateforme paneuropéenne qui centralise le règlement-livraison en monnaie centrale des titres."
  },
  {
    "question": "Quels paramètres sont généralement renseignés lors du booking d’un trade post-trade ?",
    "options": [
      "ISIN, volume, prix, devise, date valeur, contrepartie",
      "Le nom du trader uniquement",
      "Le montant en devise locale uniquement",
      "Le type d’ordre et la marge seulement"
    ],
    "answer": "ISIN, volume, prix, devise, date valeur, contrepartie",
    "explanation": "Ces informations clés permettent de qualifier et de tracer l’opération dans le système post-trade."
  },
  {
    "question": "Que signifie la notion de « Settlement Status » dans le contexte post-trade ?",
    "options": [
      "Le niveau de risque d’un trade",
      "Le suivi du statut d’exécution d’une instruction de règlement",
      "Le type de collateral utilisé",
      "Le code d’identification du broker"
    ],
    "answer": "Le suivi du statut d’exécution d’une instruction de règlement",
    "explanation": "Le Settlement Status indique si une instruction est matched, unmatched, settled, pending ou annulée."
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

export default Page2;