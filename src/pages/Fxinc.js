import React, { useState, useEffect, useCallback } from "react";
import "./QCMStyles.css";

// Flashcards pour le niveau basic
const basicSlides = [
  {
    "question": "DCM (DEBT CAPITAL MARKETS) vise la levée de DETTE via des TAUX ou OBLIGATIONS, avec des DÉRIVÉS DE TAUX ou CRÉDIT, pour le FINANCEMENT ou un EFFET DE LEVIER.",
    "answer": "ECM (EQUITY CAPITAL MARKETS) sert à lever des FONDS PROPRES via des ACTIONS, avec des DÉRIVÉS ACTIONS pour couvrir, dans un objectif de CROISSANCE ou de BOURSE."
  },
  {
    "question": "1.DCM (Debt Capital Markets), Uniquement au PRIMAIRE. \n\nObjectif	Lever de la dette (obligations) pour le compte d’un émetteur (entreprise, État, banque). [Obligations (corporate, souveraines), EMTN, High Yield, Green bonds]",
    "answer": "2.ECM (Equity Capital Markets), Marché primaire pr actions, \n\nLever des fonds propres (actions) pour une entreprise. [IPO, augmentations de capital, émissions de convertibles, produits equity-linked]  "
  },
  {
    "question": "1. Produits de taux ou Fixed Income sont: \n\n( Oblig souveraines (OAT, Bunds, Treasuries)\n   Oblig Entrep (Investment Grade, High Yield)\n\n Titres adossés à des actifs (ABS, MBS, CDO)\n Swaps de taux d'intérêt (IRS, basis swaps)\n\n Futures de taux, FRAs\nCaps, Floors, Swaptions",
    "answer": "."
  },
  {
    "question": "2.Produits  Actions (Equity) \n\nActions cotées (cash equity)\nIndices boursiers (CAC 40, EuroStoxx, S&P 500) \n\nProduits structurés actions (autocallables, reverse convertibles…)\n",
    "answer": "Produits dérivés actions :(Futures et options/Equity Swaps/CFD (Contracts for Difference)"
  },
  {
    "question": "3. Produits  Devises (FX) Spot FX (EUR/USD, USD/JPY…)\nForwards /Options de change",
    "answer": " Swaps de devises (FX swaps, cross-currency swaps)"
  },
  {
    "question": "4. Crédit (Credit Instruments): \n CDS (Credit Default Swaps) \n TRS (Total Return Swaps)",
    "answer": " Produits dérivés sur indices de crédit (iTraxx, CDX)"
  },
  {
    "question": "5. Produits à capital garanti ou partiellement protégé; \n Autocallables, phoenix, barrier reverse convertibles \n Notes hybrides multi-actifs",
    "answer": "Produits liés à des indices propriétaires"
  },
  {
    "question": "Qu'est-ce qu'une obligation souveraine et comment se calcule son prix ?",
    "answer": "Une obligation souveraine est émise par un État pour se financer. Son prix se calcule par actualisation des flux futurs : Prix = Σ(C/(1+y)^t) + F/(1+y)^n, où C=coupon, F=nominal, y=yield."
  },
  {
    "question": "Quelle est la différence entre les obligations Investment Grade et High Yield ?",
    "answer": "Les Investment Grade (notation ≥ BBB-) ont un risque de crédit modéré, tandis que les High Yield (notation < BBB-) offrent un rendement plus élevé mais avec un risque de défaut accru."
  },
  {
    "question": "Comment calcule-t-on le spread de crédit d'une obligation corporate ?",
    "answer": "Spread = Rendement de l'obligation corporate - Rendement de l'obligation souveraine de même maturité. Il reflète le risque supplémentaire de l'émetteur corporate."
  },
  {
    "question": "Que sont les ABS et MBS, et quel risque principal présentent-ils ?",
    "answer": "Les ABS (Asset-Backed Securities) et MBS (Mortgage-Backed Securities) sont des titres adossés à des actifs (prêts, hypothèques). Risque principal : défaut des sous-jacents et complexité des modèles de cash flows."
  },
  {
    "question": "Comment fonctionne un swap de taux (IRS) et comment le valorise-t-on ?",
    "answer": "Un IRS échange des flux fixes contre variables. Sa valeur est : V_swap = Σ(C_fixe - C_variable) × DF(t), où DF=facteur d'actualisation."
  },
  {
    "question": "Quelle formule utilise-t-on pour évaluer un Cap ou un Floor avec le modèle Black ?",
    "answer": "Formule de Black pour un Cap : C = N × Σ DF(t) × [f × N(d1) - K × N(d2)], où f=taux forward, K=strike, N()=fonction de répartition normale."
  },
  {
    "question": "Qu'est-ce qu'un FRA et comment se calcule son taux forward ?",
    "answer": "Un FRA (Forward Rate Agreement) verrouille un taux futur. Taux forward = [(1 + T2×r2)/(1 + T1×r1) - 1] × (360/(T2-T1)), où r1 et r2 sont les taux spots pour les maturités T1 et T2."
  },
  {
    "question": "Comment calcule-t-on la valeur liquidative (NAV) d'un ETF obligataire ?",
    "answer": "NAV = (Valeur totale des actifs - Passifs) / Nombre de parts. Les actifs incluent les obligations détenues dans le portefeuille."
  },
  {
    "question": "Quels sont les risques principaux des obligations convertibles ?",
    "answer": "Risque de crédit (comme une obligation) + risque d'équité (lié à la conversion en actions). Le prix dépend aussi de la volatilité de l'action sous-jacente."
  },
  {
    "question": "Pourquoi les CDO ont-ils été au cœur de la crise de 2008 ?",
    "answer": "En raison de leur complexité (tranches senior/mezzanine/equity), de la sous-estimation des risques de défaut, et des notations excessivement optimistes des agences de rating."
  },
];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     {
        "question": "Quel est le principal risque des obligations souveraines (OAT, Bunds, Treasuries) ?",
        "options": [
            "Risque de crédit élevé",
            "Risque de taux",
            "Risque de change",
            "Risque de liquidité"
        ],
        "answer": "Risque de taux",
        "explanation": "Les obligations souveraines ont un risque de crédit faible (sauf défaut souverain), mais leur prix est sensible aux variations des taux d'intérêt."
    },
    {
        "question": "Quelle formule calcule le prix d'une obligation à coupon fixe ?",
        "options": [
            "P = C × (1 - (1 + y)^-n) / y + F / (1 + y)^n",
            "P = F × e^(r × t)",
            "P = (C + F) / (1 + y)",
            "P = ∑ (C / (1 + r)^t) + F / y"
        ],
        "answer": "P = C × (1 - (1 + y)^-n) / y + F / (1 + y)^n",
        "explanation": "Cette formule actualise les coupons (C) et le nominal (F) au yield-to-maturity (y), avec n = nombre de périodes."
    },
    {
        "question": "Que mesure le spread de crédit d'une obligation corporate ?",
        "options": [
            "La différence entre son rendement et l'inflation",
            "La différence entre son rendement et celui d'une obligation souveraine de même maturité",
            "La volatilité du prix de l'obligation",
            "Le montant du coupon annuel"
        ],
        "answer": "La différence entre son rendement et celui d'une obligation souveraine de même maturité",
        "explanation": "Le spread de crédit reflète le risque supplémentaire par rapport à une obligation 'sans risque' (souveraine)."
    },
    {
        "question": "Quelle est l'utilité principale d'un swap de taux (IRS) ?",
        "options": [
            "Convertir une obligation en actions",
            "Échanger des flux d'intérêts fixes contre variables pour couvrir le risque de taux",
            "Spéculer sur le prix des matières premières",
            "Garantir un rendement minimum"
        ],
        "answer": "Échanger des flux d'intérêts fixes contre variables pour couvrir le risque de taux",
        "explanation": "Les IRS permettent aux entreprises de transformer des dettes à taux variable en taux fixe (ou inversement)."
    },
    {
        "question": "Quel modèle est utilisé pour évaluer un Cap (option sur taux) ?",
        "options": [
            "Modèle de Black-Scholes",
            "Modèle de Black (1976)",
            "Modèle de Vasicek",
            "Modèle binomial"
        ],
        "answer": "Modèle de Black (1976)",
        "explanation": "Le modèle de Black adapté aux options sur taux (Caps/Floors) utilise la volatilité des taux forward."
    },
    {
        "question": "Dans la formule d'un FRA (Forward Rate Agreement), que représente 'r' ?",
        "options": [
            "Le taux spot actuel",
            "Le taux forward convenu contractuellement",
            "Le rendement d'une obligation",
            "Le taux de défaut"
        ],
        "answer": "Le taux forward convenu contractuellement",
        "explanation": "Le FRA verrouille un taux futur (r) pour une période donnée, protégeant contre les fluctuations."
    },
    {
        "question": "Qu'est-ce qu'une swaption ?",
        "options": [
            "Une option sur un swap de taux",
            "Un swap avec paiement différé",
            "Un type de CDO",
            "Un ETF obligataire"
        ],
        "answer": "Une option sur un swap de taux",
        "explanation": "La swaption donne le droit (pas l'obligation) d'entrer dans un swap à une date future."
    },
    {
        "question": "Comment calcule-t-on la valeur liquidative (NAV) d'un ETF obligataire ?",
        "options": [
            "NAV = Prix de marché × nombre de parts",
            "NAV = (Valeur des actifs - Passifs) / Nombre de parts",
            "NAV = ∑ (Coupons) / Nombre de parts",
            "NAV = Rendement annualisé × 100"
        ],
        "answer": "NAV = (Valeur des actifs - Passifs) / Nombre de parts",
        "explanation": "La NAV reflète la valeur sous-jacente de l'ETF, ajustée des passifs."
    },
    {
        "question": "Quelle tranche d'un CDO absorbe les premières pertes ?",
        "options": [
            "Tranche senior",
            "Tranche mezzanine",
            "Tranche equity (junior)",
            "Tranche super-senior"
        ],
        "answer": "Tranche equity (junior)",
        "explanation": "La tranche equity est la première impactée en cas de défaut, mais offre les rendements les plus élevés."
    },
    {
        "question": "Que représente 'PD' dans la formule de taux de défaut λ = -ln(1-PD)/T ?",
        "options": [
            "Price Duration",
            "Probability of Default",
            "Premium Discount",
            "Parity Delta"
        ],
        "answer": "Probability of Default",
        "explanation": "PD = Probabilité de défaut sur la période T. La formule convertit cette probabilité en taux de défaut continu (λ)."
    }
  ],
  avance: [
    {
      "question": "Dans la formule de pricing d'une obligation à coupon zéro \( P = \frac{F}{(1+y)^T} \), que se passe-t-il si le yield (y) augmente ?",
      "options": [
          "Le prix (P) augmente de façon linéaire",
          "Le prix (P) diminue de façon convexe",
          "Le prix (P) reste inchangé",
          "Le prix (P) augmente de façon exponentielle"
      ],
      "answer": "Le prix (P) diminue de façon convexe",
      "explanation": "La relation prix/yield est convexe : \( \frac{dP}{dy} < 0 \) et \( \frac{d^2P}{dy^2} > 0 \). Une hausse de y réduit P, avec une sensibilité accrue pour les maturités longues."
  },
  {
      "question": "Quelle formule calcule la duration de Macaulay (D) d'une obligation à coupon fixe ?",
      "options": [
          "\( D = \sum_{t=1}^T \frac{t \cdot C_t}{(1+y)^t} / P \)",
          "\( D = -\frac{\Delta P / P}{\Delta y} \)",
          "\( D = \frac{C \cdot T}{F} \)",
          "\( D = \ln(P) / y \)"
      ],
      "answer": "\( D = \sum_{t=1}^T \frac{t \cdot C_t}{(1+y)^t} / P \)",
      "explanation": "La duration de Macaulay est la moyenne pondérée des dates de flux, actualisées par le yield (y). Elle mesure la sensibilité du prix aux taux."
  },
  {
      "question": "Dans un swap de taux (IRS), comment calcule-t-on le taux fixe équitable (parité) ?",
      "options": [
          "\( r_{\text{fixe}} = \frac{\sum_{i=1}^n DF(t_i) \cdot r_{\text{flottant}}(t_i)}{\sum_{i=1}^n DF(t_i)} \)",
          "\( r_{\text{fixe}} = \text{LIBOR} + 50 \text{bps} \)",
          "\( r_{\text{fixe}} = \frac{FV_{\text{flottant}}}{T} \)",
          "\( r_{\text{fixe}} = \frac{1 - DF(t_n)}{\sum_{i=1}^n DF(t_i)} \)"
      ],
      "answer": "\( r_{\text{fixe}} = \frac{1 - DF(t_n)}{\sum_{i=1}^n DF(t_i)} \)",
      "explanation": "Le taux fixe équitable est celui qui égalise la valeur actuelle des flux fixes et flottants. \( DF(t_i) \) = facteur d'actualisation à la date \( t_i \)."
  },
  {
      "question": "Quelle est la formule du taux forward implicite entre deux dates \( T_1 \) et \( T_2 \) ?",
      "options": [
          "\( F(T_1,T_2) = \frac{(1 + L(T_2))^{T_2}}{(1 + L(T_1))^{T_1}} - 1 \)",
          "\( F(T_1,T_2) = \frac{L(T_2) - L(T_1)}{T_2 - T_1} \)",
          "\( F(T_1,T_2) = \frac{DF(T_1)}{DF(T_2)} - 1 \)",
          "\( F(T_1,T_2) = \left( \frac{(1 + L(T_2) \cdot T_2)}{(1 + L(T_1) \cdot T_1)} \right)^{\frac{1}{T_2-T_1}} - 1 \)"
      ],
      "answer": "\( F(T_1,T_2) = \left( \frac{(1 + L(T_2) \cdot T_2)}{(1 + L(T_1) \cdot T_1)} \right)^{\frac{1}{T_2-T_1}} - 1 \)",
      "explanation": "Le taux forward est dérivé des taux spots \( L(T_1) \) et \( L(T_2) \), avec ajustement pour la maturité."
  },
  {
      "question": "Comment calcule-t-on la valeur d'un Caplet avec le modèle de Black (1976) ?",
      "options": [
          "\( C = N \cdot DF(T) \cdot [F \cdot N(d_1) - K \cdot N(d_2)] \cdot \alpha \)",
          "\( C = \max(F - K, 0) \cdot DF(T) \)",
          "\( C = N \cdot \sigma \sqrt{T} \cdot (F - K) \)",
          "\( C = \frac{F + K}{2} \cdot DF(T) \)"
      ],
      "answer": "\( C = N \cdot DF(T) \cdot [F \cdot N(d_1) - K \cdot N(d_2)] \cdot \alpha \)",
      "explanation": "Formule analogue à Black-Scholes, où \( F \) = taux forward, \( K \) = strike, \( \alpha \) = fraction d'année, \( N(d) \) = fonction de répartition gaussienne."
  },
  {
      "question": "Quelle est l'expression de la duration modifiée (MD) ?",
      "options": [
          "\( MD = \frac{D}{1 + y} \)",
          "\( MD = D \cdot (1 + y) \)",
          "\( MD = -\frac{\Delta P / P}{\Delta y} \)",
          "\( MD = \frac{C}{P} \cdot T \)"
      ],
      "answer": "\( MD = \frac{D}{1 + y} \)",
      "explanation": "La duration modifiée ajuste la duration de Macaulay (D) pour estimer la variation relative de prix (\( \Delta P/P \)) pour un petit \( \Delta y \)."
  },
  {
      "question": "Dans un CDO, comment calcule-t-on la perte attendue de la tranche equity ?",
      "options": [
          "\( EL_{\text{equity}} = \int_0^{K_1} (x - K_0) \cdot f(x) \, dx \)",
          "\( EL_{\text{equity}} = K_1 - K_0 \)",
          "\( EL_{\text{equity}} = PD \times LGD \)",
          "\( EL_{\text{equity}} = \max(0, K_1 - K_0) \)"
      ],
      "answer": "\( EL_{\text{equity}} = \int_0^{K_1} (x - K_0) \cdot f(x) \, dx \)",
      "explanation": "La perte attendue intègre la distribution des pertes (\( f(x) \)) entre les points d'attache (\( K_0 \)) et de détachement (\( K_1 \)) de la tranche."
  },
  {
      "question": "Quelle formule lie le spread de crédit (s) et la probabilité de défaut (PD) dans un modèle réduit ?",
      "options": [
          "\( s = \frac{PD}{1 - R} \)",
          "\( s = -\ln(1 - PD) / T \)",
          "\( s = PD \times LGD \)",
          "\( s = \frac{LGD \cdot PD}{1 - PD} \)"
      ],
      "answer": "\( s \approx LGD \cdot PD \)",
      "explanation": "En première approximation, le spread compensant le risque de défaut est le produit de la perte en cas de défaut (LGD) et de la probabilité de défaut (PD)."
  },
  {
      "question": "Comment calcule-t-on le taux implicite d'un Futures sur obligations ?",
      "options": [
          "\( r_{\text{futures}} = \frac{100 - \text{Price}_{\text{futures}}}{\text{Duration}} \)",
          "\( r_{\text{futures}} = \left( \frac{FV}{P_{\text{spot}}} \right)^{\frac{1}{T}} - 1 \)",
          "\( r_{\text{futures}} = \frac{1 - DF(T)}{T} \)",
          "\( r_{\text{futures}} = \text{Forward Rate} + \text{Basis} \)"
      ],
      "answer": "\( r_{\text{futures}} = \frac{100 - \text{Price}_{\text{futures}}}{\text{Duration}} \)",
      "explanation": "Le prix d'un future sur obligations est converti en taux via une approximation linéaire utilisant la duration."
  },
  {
      "question": "Quelle est la formule de la convexité (C) d'une obligation ?",
      "options": [
          "\( C = \sum_{t=1}^T \frac{t(t+1) \cdot C_t}{(1+y)^{t+2}} / P \)",
          "\( C = \frac{d^2P}{dy^2} \cdot \frac{1}{P} \)",
          "\( C = \frac{MD^2}{2} \)",
          "\( C = \frac{\Delta P / P}{(\Delta y)^2} \)"
      ],
      "answer": "\( C = \sum_{t=1}^T \frac{t(t+1) \cdot C_t}{(1+y)^{t+2}} / P \)",
      "explanation": "La convexité mesure la courbure de la relation prix/yield. Elle corrige l'approximation linéaire de la duration pour de grands \( \Delta y \)."
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
const Blogs = () => {
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

  const handleAnswerClick = (option) => {
    if (message) return;
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

export default Blogs;
