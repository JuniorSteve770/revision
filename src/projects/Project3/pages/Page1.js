// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// https://www.youtube.com/watch?v=s9Qh9fWeOAk

const basicSlides = [
  {
    "question": "https://www.youtube.com/watch?v=7SzMoPRsuqA&t=343s",
    "answer": "Shttps://www.youtube.com/watch?v=jZTkpKUbTHk&list=PLDcqwuHclh-LCWuFMrcqZkrknyl5BjLwU"
  },
  {
    "question": "Qu'est-ce que le delta (Δ) d'une option ?",
    "answer": "Sensibilité du prix de l'option aux variations du sous-jacent. Exemple : Un delta de 0.6 signifie que l'option gagne 0.6€ pour chaque 1€ de hausse du sous-jacent. Mots-clés : Risque directionnel, couverture linéaire."
  },
  {
    "question": "Comment fonctionne le delta-hedging pour un vendeur de call ?",
    "answer": "Le vendeur achète des actions pour neutraliser le delta. Exemple : Pour un call de delta 0.6, on achète 60% d'une action. Mots-clés : Neutralité delta, rééquilibrage dynamique."
  },
  {
    "question": "Pourquoi le gamma (Γ) est-il dangereux pour le vendeur d'options ?",
    "answer": "Le gamma négatif entraîne des pertes convexes lors de gros mouvements. Exemple : -0.05 gamma → perte accélérée si le sous-jacent varie fortement. Mots-clés : Convexité, risque non-linéaire."
  },
  {
    "question": "Quel est l'effet du theta (Θ) pour un vendeur de call ?",
    "answer": "Positif : l'option perd de la valeur avec le temps → profit journalier. Exemple : Theta de +0.2€/jour. Mots-clés : Décroissance temporelle, avantage vendeur."
  },
  {
    "question": "Comparaison gamma : vendeur vs acheteur d'options",
    "answer": "Vendeur : gamma négatif (perte des deux côtés). Acheteur : gamma positif (gains accélérés, pertes limitées). Métaphore : Airbag (acheteur) vs corde raide (vendeur)."
  },
  {
    "question": "Quels sont les coûts cachés du delta-hedging ?",
    "answer": "1) Intérêts sur les actions achetées 2) Spread bid-ask 3) Réajustements fréquents. Exemple : Coût de portage de 60€ pour un delta de 0.6."
  },
  {
    "question": "Que se passe-t-il après 1 jour si le sous-jacent reste stable ? (exemple BSM)",
    "answer": "Profit theta pur : +0.2€ (valeur option baisse sans mouvement). Mots-clés : Décroissance temporelle, marché calme."
  },
  {
    "question": "Pourquoi le delta-hedging ne protège-t-il pas contre la volatilité ?",
    "answer": "Il neutralise seulement le risque linéaire (delta), pas la convexité (gamma). Métaphore : Équilibre la planche mais pas les coups de vent."
  },
  {
    "question": "Quelle stratégie profite du theta ? Quand l'éviter ?",
    "answer": "Vente d'options en range (ex. strangle). À éviter avant des événements volatils (résultats trimestriels). Mots-clés : Vendeur d'options, marché stable."
  },
  {
    "question": "Comment calculer la P&L journalière avec gamma et theta ?",
    "answer": "P&L ≈ (0.5 × Γ × ΔS²) + Θ. Exemple : Γ=-0.05, ΔS=1€ → -0.025€ + 0.2€ = +0.175€."
  },
  {
    "question": "Comment le gamma négatif impacte-t-il la fréquence de rééquilibrage du delta-hedging ?",
    "answer": "Plus le gamma est élevé (en valeur absolue), plus le delta change rapidement → Rééquilibrages plus fréquents. Exemple : Gamma de -0.1 nécessite des ajustements 2x plus fréquents qu'un gamma de -0.05 pour maintenir la neutralité. Mots-clés : Coûts de transaction, slippage."
  },
  {
    "question": "Quelle est la relation entre gamma et vega (ν) pour un market maker short option ?",
    "answer": "Gamma et vega sont corrélés via la volatilité implicite. Un gamma négatif implique un vega négatif → Le market maker perd si la volatilité implicite augmente. Formule : ν ≈ Γ × σ × S²√T. Mots-clés : Smile de volatilité, risque de volatilité."
  },
  {
    "question": "Comment calculer le 'break-even move' pour un delta-hedged short call ?",
    "answer": "Mouvement nécessaire pour annuler le gain theta : ΔS = √(2Θ/|Γ|). Exemple : Θ=0.2€, Γ=-0.05 → ΔS = √(8) ≈ 2.83€. Au-delà, le gamma domine. Mots-clés : Seuil de rentabilité, optimisation de couverture."
  },
  {
    "question": "Pourquoi les options ATM ont-elles le gamma le plus élevé ? Comment exploiter ceci ?",
    "answer": "Le gamma est maximal à la monnaie (delta change le plus vite). Stratégie : Short gamma sur options ATM pour capturer plus de theta, mais avec un risque accru. Mots-clés : Peak gamma, gestion des wings."
  },
  {
    "question": "Comment le taux sans risque (r) influence-t-il le P&L d'un delta-hedged short call ?",
    "answer": "Double effet : 1) Coût de portage des actions (r × S × Δ) 2) Intérêt sur la prime reçue (r × premium). En pratique, le coût domine → P&L réduit de ≈ r×(ΔS - premium). Mots-clés : Rho, coût du capital."
  },
  {
    "question": "Quelle stratégie permet de neutraliser simultanément delta ET gamma ?",
    "answer": "Utiliser une option complémentaire : Acheter un put/call de même gamma mais delta opposé. Exemple : Short call (Γ=-0.05, Δ=+0.6) + Long call (Γ=+0.03, Δ=+0.4) → Gamma net -0.02, delta net +1.0. Mots-clés : Hedge multi-grecques, portefeuille neutre."
  },
  {
    "question": "1) Définissez delta (Δ) et gamma (Γ) 2) Pourquoi le gamma est-il risqué pour le vendeur ?",
    "answer": "1) Δ = Sensibilité au sous-jacent (ex: Δ=0.6 → +0.6€ pour +1€ action). Γ = Taux de changement du delta (convexité). 2) Gamma négatif → Pertes accélérées en cas de gros mouvements (ex: Γ=-0.05). Mots-clés : Risque directionnel, convexité."
  },
  {
    "question": "1) Fonctionnement du delta-hedging 2) Ses limites face à la volatilité",
    "answer": "1) Achat/vente d'actions pour annuler le delta (ex: Δ=0.6 → 60% d'action). 2) Neutralise seulement les petits mouvements (delta), pas les effets convexes (gamma). Métaphore : Parapluie contre la bruine, pas contre l'orage."
  },
  {
    "question": "1) Effet theta (Θ) pour le vendeur 2) Stratégie pour en profiter",
    "answer": "1) Θ positif → Option se déprécie avec le temps (ex: +0.2€/jour). 2) Vendre des options en range (strangle) en marché stable. À éviter avant les résultats trimestriels. Mots-clés : Décroissance temporelle, vendeur d'options."
  },
  {
    "question": "1) Coûts cachés du delta-hedging 2) Impact des taux sans risque (r)",
    "answer": "1) Coûts de portage (intérêts sur actions), spread bid-ask, réajustements. 2) r augmente le coût net : P&L ≈ r×(ΔS - premium). Exemple : r=5% → Coût supplémentaire sur 60€ de hedge."
  },
  {
    "question": "1) Différence gamma vendeur/acheteur 2) Pourquoi peak gamma en ATM ?",
    "answer": "1) Vendeur : gamma négatif (risque). Acheteur : gamma positif (airbag). 2) Delta change le plus vite à la monnaie → Gamma maximal. Stratégie : Cibler les options ATM pour plus de theta."
  },
  {
    "question": "1) Calcul du break-even move 2) Formule P&L journalière",
    "answer": "1) ΔS = √(2Θ/|Γ|) (ex: Θ=0.2€, Γ=-0.05 → ΔS≈2.83€). 2) P&L ≈ (0.5×Γ×ΔS²) + Θ. Exemple : ΔS=1€ → -0.025€ + 0.2€ = +0.175€."
  },
  {
    "question": "1) Relation gamma-vega (ν) 2) Neutraliser delta + gamma",
    "answer": "1) ν ≈ Γ×σ×S²√T → Gamma négatif = vega négatif (risque volatilité). 2) Combiner options : ex: Short call (Γ=-0.05) + Long call (Γ=+0.03) → Gamma net -0.02."
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

    {
    "question": "Que représente le delta (Δ) d'une option ?",
    "options": [
      "La sensibilité du prix de l'option aux variations de la volatilité",
      "La sensibilité du prix de l'option aux variations du sous-jacent",
      "Le temps restant avant l'expiration de l'option",
      "Le niveau de risque de contrepartie de l'option"
    ],
    "answer": "B",
    "explanation": "Le delta mesure comment le prix de l'option évolue avec le sous-jacent. Un delta de 0.6 signifie que l'option gagne 0.6€ pour chaque 1€ de hausse du sous-jacent."
  },
  {
    "question": "Pour un call vendu avec un delta de 0.7, comment effectuer un delta-hedging ?",
    "options": [
      "Vendre 70% d'une action",
      "Acheter 70% d'une action",
      "Acheter un put avec delta -0.7",
      "Ne rien faire - le delta se compense automatiquement"
    ],
    "answer": "B",
    "explanation": "Le delta-hedging consiste à acheter des actions proportionnellement au delta. Ici, acheter 0.7 action compense le risque directionnel."
  },
  {
    "question": "Pourquoi le gamma est-il dangereux pour le vendeur d'options ?",
    "options": [
      "Il augmente le risque de contrepartie",
      "Il crée des pertes convexes lors de gros mouvements",
      "Il réduit l'effet du theta",
      "Il impose des paiements de dividendes"
    ],
    "answer": "B",
    "explanation": "Le gamma négatif du vendeur entraîne des pertes qui s'accélèrent avec l'amplitude des mouvements (effet convexe), même après delta-hedging."
  },
  {
    "question": "Quel est l'effet du theta (Θ) pour un vendeur d'options ?",
    "options": [
      "Négatif - l'option prend de la valeur avec le temps",
      "Positif - l'option perd de la valeur avec le temps",
      "Neutre - le temps n'affecte pas la valeur",
      "Variable - dépend de la volatilité"
    ],
    "answer": "B",
    "explanation": "Le theta est positif pour le vendeur : la valeur temps de l'option s'érode, ce qui profite au vendeur (tout autre chose égale par ailleurs)."
  },
  {
    "question": "Quelle situation décrit correctement l'exposition au gamma ?",
    "options": [
      "Acheteur : gamma positif - Vendeur : gamma positif",
      "Acheteur : gamma négatif - Vendeur : gamma négatif",
      "Acheteur : gamma positif - Vendeur : gamma négatif",
      "Acheteur : gamma négatif - Vendeur : gamma positif"
    ],
    "answer": "C",
    "explanation": "L'acheteur bénéficie de gamma positif (gains convexes), tandis que le vendeur subit du gamma négatif (pertes convexes)."
  },
  {
    "question": "Quel est le principal coût caché du delta-hedging ?",
    "options": [
      "Frais de courtage uniquement",
      "Spread bid-ask et intérêts sur position hedge",
      "Coûts de dividendes",
      "Taxes sur transactions"
    ],
    "answer": "B",
    "explanation": "Les coûts principaux sont : 1) le spread entre prix d'achat/vente 2) les intérêts sur la position de couverture (coût de portage)."
  },
  {
    "question": "Si le sous-jacent reste stable, que gagne un vendeur de call delta-hedgé ?",
    "options": [
      "Rien - le P&L est nul",
      "Le gain theta uniquement",
      "La prime initiale moins les frais",
      "Le gain gamma multiplié par le temps"
    ],
    "answer": "B",
    "explanation": "Sans mouvement du sous-jacent, seul l'effet theta joue → profit égal à la décroissance temporelle (ex: +0.2€/jour)."
  },
  {
    "question": "Pourquoi le delta-hedging ne protège-t-il pas contre la volatilité ?",
    "options": [
      "Il ignore le risque de taux",
      "Il ne couvre pas le gamma (convexité)",
      "Il est trop coûteux à mettre en œuvre",
      "Il ne fonctionne que sur les options américaines"
    ],
    "answer": "B",
    "explanation": "Le delta-hedging neutralise le risque linéaire (delta) mais pas la convexité (gamma), qui cause des pertes lors de gros mouvements."
  },
  {
    "question": "Comment calculer le P&L journalier d'une position delta-hedgée ?",
    "options": [
      "P&L = Δ × ΔS",
      "P&L = (0.5 × Γ × ΔS) + Θ",
      "P&L = (0.5 × Γ × ΔS²) + Θ",
      "P&L = ν × Δσ"
    ],
    "answer": "C",
    "explanation": "La formule correcte intègre : 1) l'effet gamma (convexité, en ΔS²) 2) l'effet theta (décroissance temporelle)."
  },
  {
    "question": "Quelle stratégie permet de réduire à la fois le delta ET le gamma ?",
    "options": [
      "Acheter une option de même type",
      "Vendre des futures uniquement",
      "Utiliser une option complémentaire avec gamma opposé",
      "Augmenter la taille du delta-hedge"
    ],
    "answer": "C",
    "explanation": "L'achat d'une option avec gamma opposé (ex: long call pour couvrir un short call) permet d'ajuster simultanément delta et gamma."
  },

  ],
  avance: [
    {
    "question": "Qu'arrive-t-il au gamma d'une option à l'approche de son expiration ?",
    "options": [
      "Il diminue progressivement",
      "Il augmente exponentiellement pour les options ATM",
      "Il devient nul quelle que soit la position",
      "Il se stabilise autour de 0.5"
    ],
    "answer": "B",
    "explanation": "Le gamma explose pour les options à la monnaie (ATM) près de l'expiration en raison du changement brutal de probabilité d'exercice."
  },
  {
    "question": "Comment évolue le theta d'une option ATM à 1 jour vs 1 mois de l'expiration ?",
    "options": [
      "Constant quel que soit le temps restant",
      "Plus élevé à 1 jour qu'à 1 mois",
      "Négligeable dans les deux cas",
      "Plus élevé à 1 mois qu'à 1 jour"
    ],
    "answer": "B",
    "explanation": "Le theta est non-linéaire et accélère drastiquement en fin de vie (décroissance en 1/√T). À 1 jour, il peut être 5x plus important qu'à 1 mois."
  },
  {
    "question": "Quelle est la relation entre vega et gamma pour des options OTM ?",
    "options": [
      "Vega et gamma sont indépendants",
      "Vega diminue quand gamma augmente",
      "Vega et gamma sont proportionnels",
      "Vega augmente alors que gamma diminue"
    ],
    "answer": "D",
    "explanation": "Les options OTM voient leur vega diminuer (moins sensibles à la volatilité) mais gardent un gamma significatif près de l'expiration."
  },
  {
    "question": "Quel impact a une hausse des taux d'intérêt sur le delta d'un call ?",
    "options": [
      "Le delta diminue",
      "Le delta augmente",
      "Aucun impact sur le delta",
      "Impact variable selon la maturité"
    ],
    "answer": "B",
    "explanation": "Les taux plus élevés augmentent la valeur actuelle du prix d'exercice, rendant le call plus attractif → delta augmente (plus proche de 1)."
  },
  {
    "question": "Pour un straddle vendu, comment évolue le gamma lorsque le sous-jacent s'éloigne du strike ?",
    "options": [
      "Gamma devient positif",
      "Gamma s'annule",
      "Gamma reste constant",
      "Gamma devient asymétrique"
    ],
    "answer": "D",
    "explanation": "Le gamma d'un straddle devient asymétrique : plus négatif du côté du call/put qui se rapproche de la monnaie, moins de l'autre côté."
  },
  {
    "question": "Quelle stratégie combine volontairement un gamma positif et un theta négatif ?",
    "options": [
      "Iron condor",
      "Strangle acheté",
      "Covered call",
      "Ratio spread"
    ],
    "answer": "B",
    "explanation": "Un strangle acheté (long OTM call + put) offre gamma positif (bénéfice sur gros mouvements) mais theta négatif (coût temps)."
  },
  {
    "question": "Comment le smile de volatilité affecte-t-il le gamma des options OTM ?",
    "options": [
      "Augmente le gamma des puts OTM",
      "Réduit le gamma de toutes les options",
      "Crée un gamma variable selon la skew",
      "Aucun impact mesurable"
    ],
    "answer": "C",
    "explanation": "Le smile implique que le gamma varie selon la skew : généralement plus élevé pour les puts OTM que les calls OTM en marché baissier."
  },
  {
    "question": "Quelle est la sensibilité (3ème ordre) qui mesure le changement de gamma ?",
    "options": [
      "Vanna (∂Γ/∂σ)",
      "Speed (∂Γ/∂S)",
      "Color (∂Γ/∂t)",
      "Ultima (∂ν/∂σ)"
    ],
    "answer": "B",
    "speed": "La speed mesure comment le gamma change avec le sous-jacent (∂Γ/∂S). Crucial pour les market makers ajustant fréquemment leurs hedges."
  },
  {
    "question": "Dans un environnement de taux négatifs, quel est l'effet sur le rho d'un put ?",
    "options": [
      "Rho devient positif",
      "Rho devient non calculable",
      "Rho s'inverse par rapport au cas standard",
      "L'effet dépend du moneyness"
    ],
    "answer": "A",
    "explanation": "Avec des taux négatifs, le rho des puts devient positif (contrairement au cas standard) car le put profite du discount accru sur le strike."
  },
  {
    "question": "Quelle grecque mesure l'impact des dividendes sur le delta ?",
    "options": [
      "Charm (∂Δ/∂t)",
      "Vomma (∂ν/∂σ)",
      "Delta bleed (∂Δ/∂D)",
      "Zomma (∂Γ/∂σ)"
    ],
    "answer": "C",
    "explanation": "Le 'delta bleed' (non-officiel mais utilisé en pratique) capture comment les dividendes attendus affectent le delta, surtout pour les actions haute dividend yield."
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

export default Page1;
