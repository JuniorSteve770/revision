import React, { useState, useEffect, useCallback } from "react";
import "./QCMStyles.css";

// Flashcards pour le niveau basic

// Flashcards pour Options
const basicSlides = [
  {
    "question": "Qu'est-ce qu'un **Straddle** et dans quel contexte l'utiliser ?",
    "answer": "Achat simultané d'un call et d'un put au même strike (ATM). Utilisé avant un événement incertain (résultats, annonce Fed) pour profiter d'une explosion de volatilité, peu importe la direction."
  },
  {
    "question": "Pourquoi choisir un **Strangle** plutôt qu'un Straddle ?",
    "answer": "Le Strangle (call OTM + put OTM) coûte moins cher car les strikes sont éloignés. Idéal si on anticipe un mouvement très violent, mais avec une probabilité plus faible."
  },
  {
    "question": "Comment un **Iron Condor** génère-t-il des profits ?",
    "answer": "En vendant un call OTM + un put OTM et en achetant un call/put plus loin OTM. Profit si le marché reste dans la fourchette des strikes vendus (primes perçues > primes payées)."
  },
  {
    "question": "Quel est le risque principal d'un **Butterfly** ?",
    "answer": "Gains limités (profit max = strike central - primes payées). Risque : perte des primes si le marché sort de la zone des ailes (strikes externes)."
  },
  {
    "question": "Quels indicateurs surveiller pour trader un **Ratio Spread** ?",
    "answer": "1) Delta pour l'exposition directionnelle. 2) Gamma pour ajuster le risque si le marché accélère. 3) Implied Volatility (IV) pour éviter les surcoûts."
  },
  {
    "question": "Quelle stratégie utiliser si on anticipe une **baisse de volatilité** ?",
    "answer": "Butterfly ou Iron Condor : ces stratégies profitent d'un marché stagnant et de la décroissance de la volatilité implicite (Vega négatif)."
  },
  {
    "question": "Expliquez l'impact du **Theta** sur un Straddle long.",
    "answer": "Négatif : le Straddle perd de la valeur chaque jour (décroissance temporelle). À éviter si l'événement anticipé est loin dans le temps."
  },
  {
    "question": "Comment calculer le **profit max** et la **perte max** d'un Iron Condor ?",
    "answer": "- **Profit max** = Prime nette reçue (strikes vendus - strikes achetés - coût). - **Perte max** = Écart entre les strikes vendus/achetés - prime reçue. Exemple : Si strikes call sont 100/110 et puts 90/80, perte max = (110-100) - prime."
  },
  {
    "question": "Pourquoi un Straddle peut-il perdre de l'argent même si le marché bouge ?",
    "answer": "À cause de la **décroissance de la volatilité implicite** (Vega) post-événement (ex: après des résultats). Le mouvement doit compenser la baisse de l'IV et le temps (Theta)."
  },
  {
    "question": "Qu'est-ce qu'un **Pin Risk** et comment l'éviter ?",
    "answer": "Risque où l'actif clôture pile au strike à l'expiration, rendant l'exercice des options incertain. Solution : Fermer la position avant l'expiration ou roll."
  },
  {
    "question": "Comment utiliser les **Grecs** pour comparer un Strangle et un Straddle ?",
    "answer": "- **Delta** : Similaire (~0 pour les deux). - **Gamma** : Plus élevé pour le Straddle (sensibilité au mouvement). - **Vega** : Plus élevé pour le Straddle. - **Theta** : Décroissance plus rapide pour le Straddle."
  },
  {
    "question": "Quelle stratégie utiliser si on anticipe une **hausse de volatilité avec mouvement haussier** ?",
    "answer": "Un **Call Ratio Spread** (acheter 1 call ITM, vendre 2 calls OTM) : Bénéficie de la hausse + volatilité, avec coût réduit."
  },
  {
    "question": "Expliquez l'impact des **dividendes** sur les stratégies d'options.",
    "answer": "Les dividendes baissent le prix du sous-jacent, donc : - **Calls** : Perte de valeur. - **Puts** : Gain de valeur. Ajuster les strikes avant la date ex-dividende."
  },

];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
    {
      "question": "Quelle stratégie d'options est optimale pour profiter d'une explosion de volatilité sans prédire la direction du marché ?",
      "options": [
        "Straddle",
        "Butterfly",
        "Iron Condor",
        "Ratio Spread"
      ],
      "answer": "Straddle",
      "explanation": "Le Straddle (achat simultané d'un call et d'un put au même strike) profite des mouvements forts, haussiers ou baissiers, grâce à la hausse de la volatilité implicite."
    },
    {
      "question": "Quel est l'objectif principal d'un Iron Condor ?",
      "options": [
        "Profiter d'un effondrement de la volatilité",
        "Capter une tendance haussière extrême",
        "Bénéficier d'un marché stable dans une fourchette de prix",
        "Hedger un portefeuille d'actions"
      ],
      "answer": "Bénéficier d'un marché stable dans une fourchette de prix",
      "explanation": "L'Iron Condor combine la vente d'un call spread et d'un put spread OTM pour générer des primes lorsque le marché évolue dans une range."
    },
    {
      "question": "Pourquoi un Strangle est-il généralement moins cher qu'un Straddle ?",
      "options": [
        "Il utilise des options hors du money (OTM)",
        "Il ne nécessite qu'une seule option",
        "Il ignore la volatilité implicite",
        "Il est toujours couvert par des actions sous-jacentes"
      ],
      "answer": "Il utilise des options hors du money (OTM)",
      "explanation": "Les options OTM (call et put) d'un Strangle ont des primes moins chères que les options ATM d'un Straddle, car leur probabilité de finir in the money est plus faible."
    },
    {
      "question": "Quel indicateur clé doit-on surveiller pour les stratégies longues en volatilité (ex: Straddle) ?",
      "options": [
        "Le Delta",
        "La Volatilité Implicite (IV)",
        "Le Dividende du sous-jacent",
        "Le Volume des options"
      ],
      "answer": "La Volatilité Implicite (IV)",
      "explanation": "Une IV basse rend les options moins chères, idéale pour acheter un Straddle. Une hausse ultérieure de l'IV boostera la valeur des options."
    },
    {
      "question": "Quelle stratégie limite à la fois les gains et les pertes dans une fourchette de prix ?",
      "options": [
        "Butterfly",
        "Strangle",
        "Covered Call",
        "Marteau Japonais"
      ],
      "answer": "Butterfly",
      "explanation": "Le Butterfly (avec 3 strikes) a un profit maximal si le sous-jacent clôture au strike central, et des pertes limitées aux primes payées."
    },
    {
      "question": "Si vous vendez un Iron Condor, que craignez-vous le plus ?",
      "options": [
        "Une baisse de la volatilité implicite",
        "Un mouvement violent du marché hors des strikes vendus",
        "Une stagnation du sous-jacent",
        "Une hausse des taux d'intérêt"
      ],
      "answer": "Un mouvement violent du marché hors des strikes vendus",
      "explanation": "Le vendeur d'Iron Condor encourt des pertes illimitées si le marché dépasse les strikes des options vendues (call ou put)."
    },
    {
      "question": "Quel ratio de Vega est favorable pour un Straddle acheteur ?",
      "options": [
        "Vega positif",
        "Vega négatif",
        "Vega neutre",
        "Vega proportionnel au Delta"
      ],
      "answer": "Vega positif",
      "explanation": "Un Vega positif signifie que la stratégie bénéficie d'une hausse de la volatilité implicite, ce qui est l'objectif d'un Straddle long."
    }
  ],
  avance: [
    {
      "question": "Quelle est la principale différence entre un Straddle et un Strangle ?",
      "options": [
        "Le Straddle utilise des options ATM, le Strangle des options OTM",
        "Le Strangle coûte toujours plus cher qu'un Straddle",
        "Le Straddle nécessite 4 options, le Strangle seulement 2",
        "Le Strangle ne profite pas des mouvements de volatilité"
      ],
      "answer": "Le Straddle utilise des options ATM, le Strangle des options OTM",
      "explanation": "Le Straddle combine un call et un put au même strike ATM, tandis que le Strangle utilise des strikes OTM différents, ce qui réduit son coût mais nécessite un mouvement plus important pour être profitable."
    },
    {
      "question": "Dans quel scénario un Butterfly rapporte-t-il son profit maximal ?",
      "options": [
        "Quand le sous-jacent clôture exactement au strike central à l'expiration",
        "Quand la volatilité implicite triple",
        "Quand le sous-jacent dépasse le strike le plus haut",
        "Quand les taux d'intérêt baissent brutalement"
      ],
      "answer": "Quand le sous-jacent clôture exactement au strike central à l'expiration",
      "explanation": "Le Butterfly est structuré pour maximiser ses gains si le prix du sous-jacent reste proche du strike central, où les options vendues expirent sans valeur tandis que les options achetées aux extrêmes limitent les pertes."
    },
    {
      "question": "Pourquoi l'Iron Condor est-il considéré comme une stratégie 'vendeuse de volatilité' ?",
      "options": [
        "Parce qu'il profite de la baisse de la volatilité implicite",
        "Car il nécessite l'achat d'options Vega négatives",
        "Parce qu'il est toujours exécuté sur des indices volatils",
        "Car il implique des options exotiques"
      ],
      "answer": "Parce qu'il profite de la baisse de la volatilité implicite",
      "explanation": "L'Iron Condor génère un profit maximal lorsque le sous-jacent reste dans une range et que la volatilité implicite diminue, ce qui fait baisser la valeur des options vendues."
    },
    {
      "question": "Quel paramètre grec est le plus crucial pour un acheteur de Straddle ?",
      "options": [
        "Vega (sensibilité à la volatilité implicite)",
        "Theta (sensibilité au temps)",
        "Rho (sensibilité aux taux d'intérêt)",
        "Delta (sensibilité au prix du sous-jacent)"
      ],
      "answer": "Vega (sensibilité à la volatilité implicite)",
      "explanation": "Un acheteur de Straddle veut que la volatilité implicite augmente (Vega positif), car cela augmente la valeur des options achetées, indépendamment de la direction du marché."
    },
    {
      "question": "Quelle stratégie est la plus adaptée si on anticipe une faible volatilité et un marché stagnant ?",
      "options": [
        "Vendre un Iron Condor",
        "Acheter un Straddle",
        "Vendre un Put nu",
        "Acheter un Call ratio spread"
      ],
      "answer": "Vendre un Iron Condor",
      "explanation": "Vendre un Iron Condor permet de capter les primes des options vendues lorsque le marché reste dans une fourchette étroite et que la volatilité diminue."
    },
    {
      "question": "Quelle est la pire situation pour un vendeur de Strangle ?",
      "options": [
        "Un mouvement violent du sous-jacent dans une direction quelconque",
        "Une hausse modérée de la volatilité implicite",
        "Un dividende exceptionnel versé",
        "Un écart de liquidité entre les strikes"
      ],
      "answer": "Un mouvement violent du sous-jacent dans une direction quelconque",
      "explanation": "Le vendeur de Strangle encourt des pertes illimitées si le marché évolue fortement au-delà du call OTM vendu ou en dessous du put OTM vendu."
    },
    {
      "question": "Comment le temps affecte-t-il un Butterfly acheteur ?",
      "options": [
        "Négativement (Theta négatif)",
        "Positivement (Theta positif)",
        "Seulement si les taux d'intérêt changent",
        "Le temps n'a aucun impact"
      ],
      "answer": "Négativement (Theta négatif)",
      "explanation": "Un Butterfly acheteur perd de la valeur avec le temps (Theta négatif), car la décroissance temporelle érode la valeur des options achetées plus qu'elle ne bénéficie aux options vendues."
    },
    {
      "question": "Quelle stratégie combine un call spread bearish et un put spread bullish ?",
      "options": [
        "Iron Condor",
        "Straddle inversé",
        "Butterfly asymétrique",
        "Ratio backspread"
      ],
      "answer": "Iron Condor",
      "explanation": "L'Iron Condor est construit en vendant un call spread bearish (call OTM vendu + call plus OTM acheté) et un put spread bullish (put OTM vendu + put plus OTM acheté)."
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
const SignUp = () => {
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
          VOL: Profite d'une explosion de volatilité(STRA/STRANGLE).
BUTTERFLY : Pari sur faible volatilité.
IRON CONDOR 🔹 Niveau : {level.toUpperCase()}
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

export default SignUp;

