import React, { useState, useEffect } from "react";
import "./QCMStyles.css";

// Flashcards pour le niveau basic
const basicSlides = [
  {
    "question": "1. Produits de taux ou Fixed Income sont: \n\n( Oblig souveraines (OAT, Bunds, Treasuries)\n   Oblig Entrep (Investment Grade, High Yield)\n\n Titres adossés à des actifs (ABS, MBS, CDO)\n Swaps de taux d'intérêt (IRS, basis swaps)\n\n Futures de taux, FRAs\nCaps, Floors, Swaptions",
    "answer": "."
  },
  {
    "question": "Définissez EQUITY OPTIONS. Quels sont les deux types et leur différence majeure ?",
    "answer": "DÉF : Contrats donnant le DROIT (non l'obligation) d'acheter (CALL) ou vendre (PUT) une action à un PRIX FIXÉ (strike). TYPES : Américaines (exercice à tout moment) vs Européennes (exercice à l'échéance)."
  },
  {
    "question": "Qu'est-ce qu'un EQUITY FUTURE ? Pourquoi son EFFET DE LEVIER est-il plus risqué que les options ?",
    "answer": "DÉF : Engagement à acheter/vendre un INDICE ou ACTION à une date/préfixée. RISQUE : Obligation (non un choix) + Règlement quotidien (mark-to-market) → Pertes potentielles illimitées."
  },
  {
    "question": "Expliquez EQUITY SWAP avec un exemple. Quel risque domine ?",
    "answer": "DÉF : Échange de flux (RENDEMENT D'UNE ACTION contre TAUX FIXE/VARIABLE). EXEMPLE : Fonds paie LIBOR+2% pour recevoir le rendement de l'action X. RISQUE PRINCIPAL : CONTREPARTIE."
  },
  {
    "question": "Définissez CONVERTIBLE BOND. Pourquoi est-elle HYBRIDE ?",
    "answer": "DÉF : Obligation convertible en ACTIONS si le cours dépasse un SEUIL. HYBRIDE : Combine COUPONS (dette) + POTENTIEL DE HAUSSE (équité)."
  },
  {
    "question": "Qu'est-ce qu'un WARRANT ? En quoi diffère-t-il d'une OPTION classique ?",
    "answer": "DÉF : Option LONG TERME émise par une SOCIÉTÉ. DIFFÉRENCES : Durée (5-15 ans vs <1 an), Émetteur (la société vs marché), DILUTION à l'exercice."
  },
  {
    "question": "Décrivez TOTAL RETURN SWAP (TRS). Qui l'utilise et pourquoi ?",
    "answer": "DÉF : Contrat où une partie paie le RENDEMENT TOTAL (dividendes + gains) d'un ACTIF contre un TAUX. UTILISATEURS : Hedge funds pour exposition SYNTHÉTIQUE sans détention."
  },
  {
    "question": "Quels sont les 3 facteurs influençant le prix d'une OPTION ? Et d'une CONVERTIBLE BOND ?",
    "answer": "OPTION : VOLATILITÉ, TEMPS, PRIX DE L'ACTION. CONVERTIBLE : TAUX D'INTÉRÊT, COURS DE L'ACTION, VOLATILITÉ."
  },
  {
    "question": "Pourquoi utiliser un SWAP plutôt qu'un FUTURE pour couvrir un portefeuille d'actions ?",
    "answer": "SWAP : Personnalisable (tailored), PAS DE MARGES quotidiennes, accès à des ACTIFS ILLIQUIDES. FUTURE : Standardisé, liquidité élevée, mais marges obligatoires."
  },
  {
    "question": "Quel instrument donne le DROIT (non l'obligation) d'acheter/vendre une ACTION à un PRIX FIXÉ ? Citez un exemple d'utilisation.",
    "answer": "EQUITY OPTIONS (Options sur actions). Exemple : HEDGER un portefeuille d'actions avec des PUTS."
  },
  {
    "question": "Quelle est la différence entre FUTURES et OPTIONS sur actions en termes d'OBLIGATION ?",
    "answer": "FUTURES : OBLIGATION d'acheter/vendre. OPTIONS : DROIT (non obligation). Effet de LEVIER sur les deux."
  },
  {
    "question": "Quel produit permet d'échanger des FLUX basés sur la PERFORMANCE d'une action contre un TAUX FIXE ? Qui l'utilise ?",
    "answer": "EQUITY SWAPS (Swaps sur actions). Utilisé par les INVESTISSEURS INSTITUTIONNELS pour gérer l'EXPOSITION."
  },
  {
    "question": "Nommez un HYBRIDE DETTE/ACTIONS convertible en TITRES sous certaines CONDITIONS.",
    "answer": "CONVERTIBLE BONDS (Obligations convertibles). Combinent COUPONS et DROIT de CONVERSION."
  },
  {
    "question": "Quel DÉRIVÉ émis par une SOCIÉTÉ permet d'acheter ses ACTIONS à long terme ? Quel avantage pour l'émetteur ?",
    "answer": "WARRANTS. Avantage : LEVIER FINANCIER sans DILUTION immédiate."
  },
  {
    "question": "Quel instrument synthetique permet de recevoir le RENDEMENT TOTAL d'une ACTION sans la détenir ? Risque principal ?",
    "answer": "TOTAL RETURN SWAPS (TRS). Risque : CONTREPARTIE (défaillance de l'autre partie)."
  },
  {
    "question": "Quels deux facteurs influencent le PRIX d'une OPTION sur action ? Et celui d'une OBLIGATION CONVERTIBLE ?",
    "answer": "OPTION : VOLATILITÉ et TEMPS. CONVERTIBLE : TAUX D'INTÉRÊT et COURS DE L'ACTION."
  },
  {
    "question": "Pourquoi préférer un FUTURE sur INDICE plutôt qu'une OPTION pour SPÉCULER sur le marché ?",
    "answer": "FUTURE : COÛTS INITIAUX inférieurs (marge seulement), EFFET DE LEVIER direct, pas de DÉCHÉANCE comme les options."
  },
];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     
    {
        "question": "Quel est le principal avantage des Equity Options pour un investisseur ?",
        "options": [
            "Obligation d'acheter/vendre l'actif sous-jacent",
            "Droit (non obligation) d'acheter/vendre à un prix fixé",
            "Règlement quotidien obligatoire",
            "Effet de levier illimité sans risque"
        ],
        "answer": "Droit (non obligation) d'acheter/vendre à un prix fixé",
        "explanation": "Les options donnent le droit mais pas l'obligation, ce qui limite le risque à la prime payée pour l'acheteur."
    },
    {
        "question": "Quelle caractéristique différencie fondamentalement les Futures des Options ?",
        "options": [
            "Les Futures offrent un potentiel de gain illimité",
            "Les Futures impliquent une obligation d'acheter/vendre",
            "Les Options sont toujours plus liquides",
            "Les Futures n'ont pas de date d'expiration"
        ],
        "answer": "Les Futures impliquent une obligation d'acheter/vendre",
        "explanation": "Contrairement aux Options, les Futures créent une obligation contractuelle de livraison à l'échéance."
    },
    {
        "question": "Dans un Equity Swap, que reçoit typiquement la partie qui paie le rendement d'une action ?",
        "options": [
            "Un taux de référence (LIBOR/EURIBOR) plus un spread",
            "Le droit d'acheter l'action à prix fixe",
            "La propriété légale de l'action sous-jacente",
            "Des dividendes capitalisés"
        ],
        "answer": "Un taux de référence (LIBOR/EURIBOR) plus un spread",
        "explanation": "Les Equity Swaps impliquent l'échange du rendement total de l'action contre des paiements basés sur un taux de référence."
    },
    {
        "question": "Quel élément déclenche généralement la conversion d'une Convertible Bond ?",
        "options": [
            "La baisse des taux d'intérêt",
            "L'augmentation du cours de l'action sous-jacente",
            "La décision de l'émetteur",
            "Le paiement d'un coupon exceptionnel"
        ],
        "answer": "L'augmentation du cours de l'action sous-jacente",
        "explanation": "La conversion devient attractive quand le cours de l'action dépasse le prix de conversion, permettant de profiter de la hausse."
    },
    {
        "question": "Quelle institution réglemente principalement les dérivés sur actions aux États-Unis ?",
        "options": [
            "SEC (Securities and Exchange Commission)",
            "FED (Federal Reserve)",
            "CFTC (Commodity Futures Trading Commission)",
            "DTCC (Depository Trust & Clearing Corporation)"
        ],
        "answer": "CFTC (Commodity Futures Trading Commission)",
        "explanation": "La CFTC supervise les marchés à terme (Futures) tandis que la SEC régule les options sur actions."
    },
    {
        "question": "Pourquoi les Warrants sont-ils souvent émis avec des obligations ?",
        "options": [
            "Pour garantir le remboursement du principal",
            "Pour réduire le coût de la dette en offrant un potentiel de hausse",
            "Pour éviter la dilution des actionnaires",
            "Pour se protéger contre le risque de taux"
        ],
        "answer": "Pour réduire le coût de la dette en offrant un potentiel de hausse",
        "explanation": "Les Warrants ajoutent une composante equity attractive, permettant d'émettre des obligations avec un coupon plus faible."
    },
    {
        "question": "Dans un Total Return Swap (TRS), qui supporte le risque de crédit de l'actif sous-jacent ?",
        "options": [
            "Le vendeur de protection uniquement",
            "L'acheteur de protection uniquement",
            "La chambre de compensation",
            "Le payeur du rendement total (généralement la banque)"
        ],
        "answer": "Le payeur du rendement total (généralement la banque)",
        "explanation": "Le payeur du TRS assume le risque de crédit car il doit compenser l'autre partie même si l'émetteur de l'actif fait défaut."
    },
  ],
  avance: [
    {
        "question": "Dans le pricing d'une option européenne (Black-Scholes), quelle formule calcule la probabilité d'exercice N(d2) ? Avec d2 = [ln(S/K) + (r - σ²/2)T] / (σ√T)",
        "options": [
            "Probabilité que l'option expire dans la monnaie",
            "Probabilité que le sous-jacent atteigne le strike à un moment avant T",
            "Facteur d'actualisation des flux à l'échéance",
            "Sensibilité du delta aux mouvements du sous-jacent"
        ],
        "answer": "Probabilité que l'option expire dans la monnaie",
        "explanation": "N(d2) dans Black-Scholes représente la probabilité risk-neutral que S(T) > K. Exemple : Pour S=100, K=110, r=5%, σ=20%, T=1 an, d2 ≈ -0.5 → N(d2) ≈ 31%."
    },
    {
        "question": "Quelle formule décrit le payoff d'un call à l'échéance ?",
        "options": [
            "max(0, K - S)",
            "max(0, S - K) - prime",
            "max(0, S - K)",
            "(S - K) / σ√T"
        ],
        "answer": "max(0, S - K)",
        "explanation": "Payoff brut = max(S-K, 0). Profit net = max(S-K,0) - prime. Exemple : Si S=120, K=100 → Payoff = 20. Si prime=5 → Profit=15."
    },
    {
        "question": "Dans un future sur indice, comment calcule-t-on le prix théorique ? (Formule de coût de portage)",
        "options": [
            "F = S × (1 + r × T) - Dividendes",
            "F = S × e^(rT) + Coûts de stockage",
            "F = S × (1 + (r - d) × T)",
            "F = S × e^((r - d)T)"
        ],
        "answer": "F = S × e^((r - d)T)",
        "explanation": "r = taux sans risque, d = dividend yield continu. Exemple : S=5000, r=3%, d=1.5%, T=0.5 → F ≈ 5000 × e^(0.015×0.5) ≈ 5037.6."
    },
    {
        "question": "Pour une obligation convertible, comment calcule-t-on le parity (valeur action intrinsèque) ?",
        "options": [
            "(Prix obligation / conversion ratio) - cours action",
            "cours action × conversion ratio",
            "(Prix obligation × conversion ratio) / cours action",
            "cours action / conversion ratio"
        ],
        "answer": "cours action × conversion ratio",
        "explanation": "Parity = Valeur si conversion immédiate. Exemple : action à 50€, ratio 20 → parity = 1000€. Si l'obligation cote à 1050€, la prime est de 5%."
    },
    {
        "question": "Dans un equity swap, si le rendement total de l'action est R = (S1 - S0 + D)/S0, comment calcule-t-on le flux pour le receiver de performance ?",
        "options": [
            "Notional × (R - LIBOR - spread)",
            "Notional × (LIBOR + spread - R)",
            "Notional × R",
            "Notional × (R - max(0, S1/S0 - 1))"
        ],
        "answer": "Notional × R",
        "explanation": "Le receiver de performance reçoit Notional×R et paie Notional×(LIBOR+spread). Exemple : Notional=1M€, S0=100, S1=110, D=2 → R=12% → Flux reçu = 120k€."
    },
    {
        "question": "Quelle formule décrit le delta (Δ) d'une option dans le modèle Black-Scholes ? (Δ = ∂C/∂S)",
        "options": [
            "N'(d1) × σ√T",
            "N(d1) pour un call, -N(-d1) pour un put",
            "e^(-rT) × N(d2)",
            "(C(S+h) - C(S-h)) / (2h)"
        ],
        "answer": "N(d1) pour un call, -N(-d1) pour un put",
        "explanation": "Δ call ≈ N(d1), Δ put ≈ Δ call - 1. Exemple : Si d1=0.25 → N(d1)≈0.60 → Δ call ≈ 0.60, Δ put ≈ -0.40."
    },
    {
        "question": "Pour un warrant avec levier L = (S/prix warrant) × Δ, comment évolue L quand S augmente ? (Δ = delta)",
        "options": [
            "Le levier diminue car Δ → 1",
            "Le levier double proportionnellement à S",
            "Le levier est constant par conception",
            "Le levier augmente exponentiellement"
        ],
        "answer": "Le levier diminue car Δ → 1",
        "explanation": "Quand S >> K, Δ → 1 et levier → S/(S-K). Exemple : Warrant à K=50, S=60 → Δ≈0.8, L=4. Si S=80 → Δ≈0.95 → L≈2.7."
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
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {index + 1}. {option}
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
const OOp_Python = () => {
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

  const handleAnswerClick = (option) => {
    const currentQuestions = questions[level];
    const current = currentQuestions[currentQuestion];
    if (option === current.answer) {
      setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ Incorrect ! La bonne réponse était : ${current.answer}\n ℹ️ ${current.explanation}`);
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

export default OOp_Python;