import React, { useState, useEffect, useCallback } from "react";
import "./QCMStyles.css";

// Flashcards pour Options
const basicSlides = [
  {
    question: "Qu'est-ce qu'une option Knock-In ? Quel est son principal avantage et risque ?",
    answer: "Définition: Option qui s'active SEULEMENT si le sous-jacent atteint une barrière prédéfinie.\nAvantage: Prime moins chère qu'une option vanille.\nRisque: Peut ne jamais s'activer (perte de la prime).\nExemple: Knock-In Call à 120% du spot pour profiter d'une hausse explosive."
  },
  {
    question: "Pourquoi utiliser une option Asian dans un contexte de couverture ?",
    answer: "Réponse: Elle lisse le risque de volatilité ponctuelle en utilisant la MOYENNE des prix (vs prix final).\nUsage typique: Couvrir des flux trésoreries mensuels.\nLimite: Gains plafonnés vs une option vanille en tendance forte."
  },
  {
    question: "Expliquez le mécanisme d'un Cliquet avec un exemple concret.",
    answer: "Mécanisme: Gains verrouillés à des intervalles (paliers).\nExemple: Produit structuré avec gain annuel capé à 10%, même si le sous-jacent monte de 20%.\nRisque: Coût élevé + sous-performance en marché directionnel."
  },
  {
    question: "Quelle est la différence entre un Straddle et un Strangle ? Quand les utiliser ?",
    answer: "Différence:\n- Straddle: Même strike (coût élevé).\n- Strangle: Strikes différents (moins cher).\nUsage: Anticiper une forte volatilité (Straddle pour choc majeur, Strangle pour mouvement modéré).\nRisque: Perte totale si le marché reste stable."
  },
  {
    question: "Pourquoi une Double Barrier Option est-elle complexe à pricer ?",
    answer: "Raison: Dépend de la probabilité que le sous-jacent reste dans un couloir (2 barrières).\nOutils: Modèles stochastiques (Monte Carlo) nécessaires.\nRisque: Sensibilité extrême aux paramètres de volatilité/corrélations."
  },
  {
    question: "Quand vendre un Put non couvert est-il catastrophique ?",
    answer: "Scénario: Crash du sous-jacent → obligation d'acheter à un prix bien supérieur au marché.\nExemple: Vente de Put sur une action à 100€ (strike 90€) qui chute à 50€ → perte de 40€ par action.\nSolution: Couverture delta ou marge suffisante."
  },
  {
    question: "Comment une Digital Option est-elle utilisée dans les produits structurés ?",
    answer: "Usage: Paiement binaire (ex: 100€ si l'action > strike à l'échéance).\nAvantage: Simplicité pour l'investisseur.\nRisque: Perte totale si la condition n'est pas remplie (peu adapté aux marchés volatils)."
  },
  {
    question: "Pourquoi le Theta est-il l'ennemi des acheteurs de Straddle ?",
    answer: "Explication: Le Straddle combine 2 options (call + put) → décroissance accélérée de la valeur temps.\nImpact: Perte de valeur même si le marché ne bouge pas.\nChiffre: Theta peut atteindre -0.5% par jour en fin de vie."
  },
  {
    question: "Comment le Gamma impacte-t-il une position short en options ?",
    answer: "Effet: Gamma élevé → Delta varie brutalement → nécessite une réallocation fréquente du hedge.\nRisque: Coûts de transaction élevés + exposition soudaine à un mouvement violent.\nExemple: Vente de Call ATM proche de l'échéance."
  },
  {
    question: "Pourquoi vendre un call couvert (covered call) est-il considéré comme une stratégie conservative ?",
    answer: "Principe: Vendre un call sur un actif que l'on possède déjà.\nAvantage: Génère un revenu (prime) tout en limitant le risque.\nRisque: Gain plafonné si l'actif monte fortement.\nExemple: Posséder Apple à 150$ + vendre un call 180$ → prime immédiate mais obligation de vendre à 180$ si exercé."
  },
  {
    question: "Quelle est la pire situation pour un vendeur de put non couvert ?",
    answer: "Scénario: Effondrement du sous-jacent (ex: -50%).\nConséquence: Obligation d'acheter à un prix bien supérieur au marché.\nExemple: Vente put Tesla à 200$, crash à 100$ → perte de 100$ par action moins la prime perçue."
  },
  {
    question: "Comment fonctionne une option 'Lookback' et dans quel contexte l'utiliser ?",
    answer: "Mécanisme: Permet d'exercer au meilleur prix atteint pendant la vie de l'option.\nUtilité: Profiter des extrêmes dans des marchés volatils (ex: matières premières).\nCoût: Très élevé en raison de l'avantage supplémentaire.\nExemple: Lookback call sur l'or → exercice possible au plus bas du marché."
  },
  {
    question: "Quel est l'avantage d'une option 'Chooser' pour un hedge fund ?",
    answer: "Flexibilité: Permet de décider plus tard si l'option sera un call ou un put.\nUsage: Couvrir des événements incertains (ex: résultats trimestriels).\nComplexité: Prix dépendant de la volatilité future anticipée."
  },
  {
    question: "Pourquoi le Vega est-il crucial pour les options barrières ?",
    answer: "Sensibilité: Les barrières dépendent fortement de la volatilité implicite.\nRisque: Une baisse de volatilité peut rendre une barrière inaccessible.\nExemple: Knock-In call → Vega élevé car dépend de la probabilité de toucher la barrière."
  },
  {
    question: "Comment le Rho affecte-t-il les options longues en période de hausse des taux ?",
    answer: "Impact: Hausse des taux → augmentation de la valeur des calls, baisse des puts.\nRaison: Coût du carry plus élevé pour les positions short.\nExemple: Call 1 an sur indice → +0.5% de valeur si taux +1%."
  },
  {
    question: "Pourquoi éviter d'acheter des options deep out-of-the-money peu avant expiration ?",
    answer: "Problème: Probabilité quasi-nulle d'être dans la monnaie + décroissance exponentielle du Theta.\nStatistique: >90% des options OTM expirent sans valeur.\nExemple: Achat call SP500 à +20% avec 1 semaine restante → gaspillage de prime."
  },
  {
    question: "Quel est le danger des strangles vendus en période de faible volatilité ?",
    answer: "Risque: Récompense limitée (prime) mais pertes illimitées si gros mouvement.\nPiège: La volatilité peut exploser après des périodes calmes (effet 'vol clustering').\nExemple: Vente strangle sur Bitcoin après 1 mois plat → risque de krach ou rallye violent."
  },

];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
    {
      "question": "Quel est le gain maximum pour l'acheteur d'un call vanille ?",
      "options": [
        "Limitée à la prime payée",
        "Illimité si le sous-jacent monte",
        "Strike - prime payée",
        "Prix du sous-jacent - strike"
      ],
      "answer": "Illimité si le sous-jacent monte",
      "explanation": "Un call donne le droit d'acheter à un prix fixe (strike). Si le sous-jacent monte indéfiniment, le profit potentiel est théoriquement infini."
    },
    {
      "question": "Quelle stratégie implique d'acheter simultanément un call et un put au même strike ?",
      "options": [
        "Strangle",
        "Straddle",
        "Butterfly Spread",
        "Iron Condor"
      ],
      "answer": "Straddle",
      "explanation": "Le straddle (achat call + put même strike) profite d'une forte volatilité. Coût élevé mais gain illimité dans les deux directions."
    },
    {
      "question": "Une option Knock-In devient active :",
      "options": [
        "Dès l'émission",
        "Si le sous-jacent touche la barrière",
        "À l'échéance seulement",
        "Si la volatilité dépasse 50%"
      ],
      "answer": "Si le sous-jacent touche la barrière",
      "explanation": 'Le "knock-in" est un mécanisme de barrière : l\'option n\'existe que si le niveau prédéfini est touché avant échéance.'
    },
    {
      "question": "Quel grec mesure la sensibilité d'une option aux mouvements du sous-jacent ?",
      "options": [
        "Theta",
        "Vega",
        "Delta",
        "Gamma"
      ],
      "answer": "Delta",
      "explanation": "Delta = variation du prix de l'option pour 1$ de mouvement du sous-jacent. Call vanille : delta entre 0 et 1 ; Put : entre -1 et 0."
    },
    {
      "question": "Pourquoi vendre un put non couvert est risqué ?",
      "options": [
        "Prime trop faible",
        "Risque de baisse illimitée",
        "Obligation d'acheter en cas de chute",
        "Exposition au risque de change"
      ],
      "answer": "Obligation d'acheter en cas de chute",
      "explanation": "Le vendeur de put doit acheter le sous-jacent au strike si l'acheteur exerce. Risque = strike - prix marché (ex: strike 100€, marché à 70€ → perte 30€)."
    },
    {
      "question": "Quelle option utilise la moyenne des prix plutôt que le prix final ?",
      "options": [
        "Barrier",
        "Asian",
        "Digital",
        "Cliquet"
      ],
      "answer": "Asian",
      "explanation": "L'option asiatique calcule le payoff sur la moyenne des prix observés (ex: moyenne mensuelle), réduisant l'impact de la volatilité ponctuelle."
    },
    {
      "question": "Quelle stratégie limite à la fois les gains et les pertes ?",
      "options": [
        "Straddle long",
        "Call nu",
        "Bull Spread",
        "Strangle short"
      ],
      "answer": "Bull Spread",
      "explanation": "Le bull spread (achat call bas + vente call haut) plafonne les gains (différence entre strikes - prime nette) et les pertes (prime nette payée)."
    },
    {
      "question": "Quel risque majeur pour un vendeur de call couvert ?",
      "options": [
        "Hausse brutale du sous-jacent",
        "Baisse de la volatilité",
        "Dépassement du strike",
        "Opportunité manquée si forte hausse"
      ],
      "answer": "Opportunité manquée si forte hausse",
      "explanation": "Si le sous-jacent dépasse largement le strike, le vendeur doit livrer l'actif et ne profite pas de la hausse au-delà (gain limité à strike - prix d'achat + prime)."
    },
    {
      "question": "Quel produit convient pour parier sur un range de trading ?",
      "options": [
        "Double Barrier Option",
        "Call vanilla",
        "Straddle long",
        "Put américain"
      ],
      "answer": "Double Barrier Option",
      "explanation": "La double barrière (knock-out si dépassement haut OU bas) est idéale pour les marchés sans tendance claire évoluant dans un couloir."
    },
    {
      "question": "Que mesure le Gamma d'une option ?",
      "options": [
        "Sensibilité du Delta aux mouvements du sous-jacent",
        "Impact des taux d'intérêt",
        "Décroissance temporelle",
        "Effet de la volatilité implicite"
      ],
      "answer": "Sensibilité du Delta aux mouvements du sous-jacent",
      "explanation": "Gamma = variation du Delta pour 1$ de mouvement. Élevé près du strike à l'échéance → risque de déséquilibre rapide du hedge."
    }
  ],
  avance: [
    {
      "question": "Quelle est la sensibilité d'une option barrier 'up-and-in call' à la volatilité implicite (Vega) lorsque le spot est loin de la barrière ?",
      "options": [
        "Vega toujours positif et constant",
        "Vega proche de zéro (dépend de la probabilité de toucher la barrière)",
        "Vega négatif car la barrière réduit la valeur",
        "Vega identique à un call vanille de même strike"
      ],
      "answer": "Vega proche de zéro (dépend de la probabilité de toucher la barrière)",
      "explanation": "Le Vega d'une option barrière est non linéaire : il dépend de la probabilité conditionnelle de toucher la barrière (formule de Kou). Loin de la barrière, cette probabilité est faible → Vega ≈ 0."
    },
    {
      "question": "Pourquoi le pricing d'une option asiatique nécessite-t-il des méthodes numériques dans le cas discret ?",
      "options": [
        "La moyenne arithmétique brise la log-normalité du sous-jacent",
        "Absence de formule fermée pour la distribution de la moyenne",
        "Dépendance path-dependent des observations",
        "Toutes ces réponses"
      ],
      "answer": "Toutes ces réponses",
      "explanation": "La moyenne arithmétique (vs géométrique) : 1) N'est pas log-normale 2) N'a pas de solution analytique exacte 3) Nécessite de modéliser chaque point de fixation → Monte Carlo ou PDE nécessaire."
    },
    {
      "question": "Quel effet a un saut de volatilité sur le Gamma d'un straddle à l'échéance ?",
      "options": [
        "Augmente exponentiellement (effet 'Gamma explosion')",
        "Devient négatif à cause du saut",
        "Ne change pas car le Gamma est constant",
        "Dépend uniquement du Delta"
      ],
      "answer": "Augmente exponentiellement (effet 'Gamma explosion')",
      "explanation": "Proche de l'échéance, le Gamma d'un straddle ATM tend vers l'infini (sensibilité extrême au spot). Un saut de volatilité amplifie ce phénomène → nécessite un rebalancing fréquent du delta-hedge."
    },
    {
      "question": "Dans un cliquet ratchet, comment le strike est-il typiquement déterminé pour chaque période ?",
      "options": [
        "Toujours fixe (strike initial)",
        "Reset au spot en début de chaque période",
        "Moyenne mobile sur 3 périodes",
        "Minimum entre le spot et le strike précédent"
      ],
      "answer": "Reset au spot en début de chaque période",
      "explanation": "Le cliquet ratchet (à strike glissant) réinitialise le strike à chaque nouvelle période → permet de 'locker' les gains intermédiaires. Ex: Si l'actif passe de 100 à 120 en P1, le nouveau strike devient 120 pour P2."
    },
    {
      "question": "Quelle est l'erreur courante dans le hedging d'une double barrier option ?",
      "options": [
        "Ignorer la corrélation entre les barrières",
        "Surpondérer le Delta et sous-estimer le Vega",
        "Négliger le rebond probabiliste près des barrières",
        "Utiliser un modèle sans sauts"
      ],
      "answer": "Négliger le rebond probabiliste près des barrières",
      "explanation": "Près d'une barrière, le sous-jacent a une probabilité non-nulle de rebondir (effet de 'overshoot') → les modèles classiques (type Black-Scholes) sous-estiment ce risque → nécessité d'ajuster le hedge ratio."
    },
    {
      "question": "Comment évolue le Theta d'un butterfly spread en fonction du temps ?",
      "options": [
        "Toujours négatif et linéaire",
        "Positif en début de vie puis négatif",
        "En cloche (d'abord négatif puis positif près de l'échéance)",
        "Dépend exclusivement de la volatilité"
      ],
      "answer": "En cloche (d'abord négatif puis positif près de l'échéance)",
      "explanation": "Le butterfly a un Theta non monotone : négatif initialement (décroissance des options longues dominantes) puis positif en fin de vie (décroissance plus rapide des options short centrales)."
    },
    {
      "question": "Quelle méthode est critique pour pricer une option digitale avec barrière ?",
      "options": [
        "Arbres binomiaux avec ajustement de Derman",
        "Formule de Garman-Kohlhagen",
        "Transformée de Fourier (méthode Carr-Madan)",
        "Modèle de Heston avec sauts"
      ],
      "answer": "Arbres binomiaux avec ajustement de Derman",
      "explanation": "Les digitals avec barrière souffrent du 'problème de discrétisation' (faux déclenchements) → l'ajustement de Derman-Kani dans les arbres binomiaux permet de corriger ce biais en interpolant précisément la barrière."
    },
    {
      "question": "Dans un corridor option, que se passe-t-il si le sous-jacent sort du couloir avant l'échéance ?",
      "options": [
        "L'option devient un call standard",
        "Paiement partiel proportionnel au temps passé dans le couloir",
        "Expiration anticipée sans valeur",
        "Transformation en put ratchet"
      ],
      "answer": "Expiration anticipée sans valeur",
      "explanation": "Le corridor (ou range accrual) s'annule dès que le sous-jacent touche une barrière → produit très sensible à la volatilité locale près des barrières."
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
const Page0 = () => {
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


export default Page0;