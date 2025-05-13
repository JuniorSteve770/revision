// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "Définition d’un swap + types principaux ?",
    "answer": "**Swap** = contrat d’échange de **flux financiers** (taux, devises, rendement...).\n🔹 Types : **IRS**, **Currency Swap**, **Basis Swap**, **TRS**, **Inflation Swap**, **Cross Currency IRS**."
  },
  {
    "question": "Fonctionnement d’un IRS + formule de calcul ?",
    "answer": "**IRS** = échange **taux fixe vs taux variable** sur un nominal.\n🔹 Formules :\n- Fixe : `flux = nominal × taux fixe × période`\n- Variable : `flux = nominal × taux var × période`"
  },
  {
    "question": "Objectifs d’un swap + exemple d’utilisation ?",
    "answer": "**Utilités** : **hedging**, **spéculation**, **arbitrage**, ou ajustement de bilan.\n🔹 Ex : A veut stabilité → échange taux variable contre taux fixe avec B."
  },
  {
    "question": "Différences IRS vs Currency Swap ?",
    "answer": "**IRS** : même devise, pas de nominal échangé.\n**Currency Swap** : **devises différentes** + **échange de nominal** (intérêts + capital)."
  },
  {
    "question": "Qu’est-ce qu’un TRS + à quoi sert-il ?",
    "answer": "**TRS (Total Return Swap)** = échange de la **performance d’un actif** (ex : action) contre un taux fixe ou variable.\n💡 Utilisé pour s’exposer à un actif sans le posséder."
  },
  {
    "question": "Quels sont les risques + comment valoriser un swap ?",
    "answer": "**Risques** : taux, change, contrepartie, liquidité (souvent OTC).\n🔹 **Valorisation** = VAN obtenue en actualisant les flux avec les **courbes de taux ZC**."
  },
  {
    "question": "Définition d’un equity + types d’actions ?",
    "answer": "**Equity** = titre de **propriété** d’entreprise (actions). Donne droit à **dividendes**, **vote**, **valeur résiduelle**.\n🔹 Types : **ordinaires** (vote + dividende variable), **préférentielles** (dividende fixe, pas de vote), **croissance** (valorisation élevée), **rendement** (dividendes réguliers)."
  },
  {
    "question": "Dividendes + dilution d’actions : explication ?",
    "answer": "**Dividende** = part du bénéfice redistribuée (non garantie).\n**Dilution** = perte de part relative après émission de nouvelles actions.\n📌 Exemple : émission de 1M actions → chaque action existante représente une part plus faible."
  },
  {
    "question": "Split, regroupement + augmentation de capital : effet ?",
    "answer": "**Split** : division des actions (prix ↓, quantité ↑).\n**Regroupement** : fusion d’actions (prix ↑, quantité ↓).\n**Augmentation de capital** : nouvelle émission → **dilution possible**."
  },
  {
    "question": "Indicateurs clés pour analyser une action ?",
    "answer": "**PER** = Price/Earnings (valorisation), **BPA (EPS)** = bénéfice/nb d’actions, **rendement** = dividende/prix, **bêta** = sensibilité au marché."
  },
  {
    "question": "Quels produits dérivés sur actions + usage ?",
    "answer": "**Options**, **futures**, **CFDs**, **swaps**, **forwards** → servent à **couvrir, spéculer ou répliquer** la performance d’un titre sans le posséder."
  },
  {
    "question": "Qu’est-ce qu’un equity swap + son usage ?",
    "answer": "**Equity Swap** = échange de la **performance totale** (dividendes + plus-value) contre un **taux fixe/variable**. Utile pour **exposition sans détention réelle**."
  },
  {
    "question": "Quels risques sont liés aux actions ?",
    "answer": "**Volatilité**, **absence de dividende**, **baisse du marché**, **dilution**, **risque spécifique** (faillite, scandale...)."
  },
  {
    "question": "Exemple concret d’investissement + rendement ?",
    "answer": "Achat 100 actions à 50 € → dividende 3 € = **rendement 6%**.\nSi vente à 60 €, **plus-value = 1000 €**.\n📌 Exemple : stratégie simple de gain en capital + revenu passif."
  },
  {
    "question": "Différences actions vs obligations et matières premières ?",
    "answer": "**Actions** : rendement élevé, risque élevé. **Obligations** : revenu fixe, risque modéré. **Matières premières** : volatiles, pas de revenu régulier."
  },
  {
    "question": "Stratégies sur actions : exemples ?",
    "answer": "**Buy & Hold** (long terme), **swing trading** (moyen terme), **short selling** (parier à la baisse), **options** pour couverture (ex : put protecteur)."
  },
  {
    "question": "Définition Equity vs Fixed Income + rémunération ?",
    "answer": "**Equity** = part de propriété (actions), rémunérée par **dividendes** + plus-value. **Fixed Income** = titre de dette, rémunéré par **coupons réguliers** + capital remboursé à l’échéance."
  },
  {
    "question": "Exemples de produits Equity et Fixed Income ?",
    "answer": "**Equity** : actions ordinaires/préférentielles, ETFs, options, CFDs. **Fixed Income** : obligations d’État/corporate, TCN, CDS, futures sur taux."
  },
  {
    "question": "Priorité de remboursement + durée des actifs ?",
    "answer": "**Fixed Income** : remboursé **avant** Equity en cas de faillite. **Equity** = durée **illimitée**, **Fixed Income** = durée **définie** (échéance connue)."
  },
  {
    "question": "Indicateurs d’analyse pour actions vs obligations ?",
    "answer": "**Equity** : PER, BPA, rendement dividende, bêta. **Fixed Income** : coupon, YTM, duration, spread de crédit."
  },
  {
    "question": "Exemple investissement en actions + obligations ?",
    "answer": "**Equity** : 100 actions à 40€, dividende 2€ = rendement 5%. Vente à 45€ → plus-value 500€.\n**Fixed Income** : obligation 1000€, coupon 3% → 30€/an + 1000€ à l’échéance."
  },
  {
    "question": "Risques liés aux Equity et Fixed Income ?",
    "answer": "**Equity** : volatilité, dividende non garanti, dilution, faillite. **Fixed Income** : taux d’intérêt, défaut de crédit, inflation, liquidité."
  },
  {
    "question": "Produits hybrides + stratégie portefeuille mixte ?",
    "answer": "**Hybrides** : obligations convertibles, preferred shares, callable bonds, CDS.\n**Portefeuille mixte** : associer **actions pour croissance** et **obligations pour stabilité/rendement régulier**."
  },
  {
    "question": "Pourquoi choisir Equity ou Fixed Income ?",
    "answer": "**Equity** : rendement élevé, risque fort, idéal pour croissance. **Fixed Income** : flux stables, risque plus modéré, idéal pour revenu sécurisé."
  }
 

];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen:[
  {
    "question": "Quel est le rôle principal d’un swap en finance ?",
    "options": [
      "Acheter un actif à effet de levier",
      "Échanger des flux financiers selon des modalités définies",
      "Garantir un rendement fixe",
      "Remplacer un prêt bancaire"
    ],
    "answer": "Échanger des flux financiers selon des modalités définies",
    "explanation": "Un swap est un contrat dérivé où deux parties s’échangent des flux (taux d’intérêt, devises, rendement…)."
  },
  {
    "question": "Quel type de swap consiste à échanger taux fixe contre taux variable ?",
    "options": [
      "Currency Swap",
      "Interest Rate Swap",
      "Total Return Swap",
      "Credit Default Swap"
    ],
    "answer": "Interest Rate Swap",
    "explanation": "Un Interest Rate Swap (IRS) est un échange d’un taux fixe contre un taux variable sur un nominal donné."
  },
  {
    "question": "Quel swap inclut un échange de devises et du nominal ?",
    "options": [
      "Inflation Swap",
      "Basis Swap",
      "Currency Swap",
      "Interest Rate Swap"
    ],
    "answer": "Currency Swap",
    "explanation": "Un Currency Swap implique deux devises différentes et inclut l’échange du nominal et des flux d’intérêts."
  },
  {
    "question": "Quelle formule permet de calculer un flux de taux fixe dans un IRS ?",
    "options": [
      "Flux = Nominal × taux variable × période",
      "Flux = taux ref × période",
      "Flux = Nominal × taux fixe × période",
      "Flux = taux fixe ÷ nominal"
    ],
    "answer": "Flux = Nominal × taux fixe × période",
    "explanation": "Le calcul du flux fixe utilise la formule : nominal × taux fixe × durée entre les échéances."
  },
  {
    "question": "Pourquoi une entreprise utiliserait-elle un IRS ?",
    "options": [
      "Pour augmenter sa marge brute",
      "Pour convertir sa dette en devise étrangère",
      "Pour spéculer sur les taux de change",
      "Pour stabiliser ses charges d’intérêt"
    ],
    "answer": "Pour stabiliser ses charges d’intérêt",
    "explanation": "Un IRS est souvent utilisé pour passer d’un taux variable à un taux fixe afin de sécuriser les coûts futurs."
  },
  {
    "question": "Dans un Total Return Swap (TRS), que reçoit l’une des parties ?",
    "options": [
      "Un flux indexé sur l’inflation",
      "Un taux fixe uniquement",
      "Le rendement total d’un actif (dividendes + plus-values)",
      "Un taux fixe contre un nominal"
    ],
    "answer": "Le rendement total d’un actif (dividendes + plus-values)",
    "explanation": "Un TRS permet de recevoir le rendement complet d’un actif sans en posséder la propriété."
  },
  {
    "question": "Quel risque principal un swap de taux cherche-t-il à couvrir ?",
    "options": [
      "Le risque de liquidité",
      "Le risque de crédit",
      "Le risque de taux d’intérêt",
      "Le risque fiscal"
    ],
    "answer": "Le risque de taux d’intérêt",
    "explanation": "Le but d’un IRS est de se protéger contre les fluctuations futures des taux d’intérêt (hausse ou baisse)."
  },
  {
    "question": "Quelle caractéristique distingue un Basis Swap ?",
    "options": [
      "Il échange un taux fixe contre un taux flottant",
      "Il convertit une devise en une autre",
      "Il échange deux taux variables de référence différents",
      "Il inclut le transfert du nominal"
    ],
    "answer": "Il échange deux taux variables de référence différents",
    "explanation": "Un Basis Swap consiste à échanger deux taux variables (ex : Euribor 3M contre Euribor 6M)."
  },
  {
    "question": "Quel swap est le mieux adapté pour couvrir l’inflation ?",
    "options": [
      "Currency Swap",
      "Interest Rate Swap",
      "Inflation Swap",
      "TRS"
    ],
    "answer": "Inflation Swap",
    "explanation": "Un Inflation Swap permet d’échanger un taux fixe contre un taux indexé à l’inflation (ex : IPC France)."
  },
  {
    "question": "Quelle est la nature juridique d’un swap ?",
    "options": [
      "Action cotée",
      "Contrat d’assurance",
      "Instrument structuré passif",
      "Contrat dérivé"
    ],
    "answer": "Contrat dérivé",
    "explanation": "Les swaps sont des **contrats dérivés** : leur valeur dépend de la variation d’un ou plusieurs sous-jacents (taux, devises, etc.)."
  },
  
],
  avance:
   [
  {
    "question": "Quelle est la différence fondamentale entre une action (equity) et une obligation (fixed income) ?",
    "options": [
      "Les deux sont des dettes",
      "L'action donne un droit de propriété, l'obligation est un prêt",
      "Les actions ont un coupon garanti",
      "Les obligations permettent de voter en AG"
    ],
    "answer": "L'action donne un droit de propriété, l'obligation est un prêt",
    "explanation": "Les actions (equity) représentent une part dans l’entreprise, alors que les obligations sont un prêt contracté par l’émetteur envers l’investisseur."
  },
  {
    "question": "Quel produit appartient à la catégorie Fixed Income ?",
    "options": [
      "Actions ordinaires",
      "Options sur actions",
      "Obligations d’État",
      "Futures sur indices"
    ],
    "answer": "Obligations d’État",
    "explanation": "Les obligations d’État font partie des titres à revenu fixe car elles versent des coupons à échéance régulière."
  },
  {
    "question": "Quelle est la principale source de revenu d’un investisseur en actions ?",
    "options": [
      "Coupons fixes",
      "Plus-value et dividendes variables",
      "Remboursement du nominal",
      "Frais d’émission"
    ],
    "answer": "Plus-value et dividendes variables",
    "explanation": "Les actions offrent un revenu par dividendes et un potentiel de plus-value si le cours monte, mais ces revenus ne sont pas garantis."
  },
  {
    "question": "Quel indicateur permet d’évaluer la sensibilité d'une obligation aux taux ?",
    "options": [
      "Bêta",
      "PER",
      "Spread",
      "Duration"
    ],
    "answer": "Duration",
    "explanation": "La duration mesure la sensibilité du prix d'une obligation aux variations des taux d’intérêt."
  },
  {
    "question": "Quelle est la priorité de remboursement entre equity et fixed income en cas de faillite ?",
    "options": [
      "Les actionnaires sont remboursés en premier",
      "Les créanciers obligataires passent avant les actionnaires",
      "Tous sont traités à égalité",
      "Les détenteurs de futures sont prioritaires"
    ],
    "answer": "Les créanciers obligataires passent avant les actionnaires",
    "explanation": "En cas de faillite, les créanciers (obligataires) sont prioritaires sur les actionnaires dans l’ordre de remboursement."
  },
  {
    "question": "Qu’est-ce qu’un equity swap ?",
    "options": [
      "L’achat d’une obligation convertible",
      "Un prêt interbancaire",
      "L’échange de performance d’une action contre un taux",
      "Une fusion entre deux actions"
    ],
    "answer": "L’échange de performance d’une action contre un taux",
    "explanation": "Un equity swap permet à une partie de recevoir la performance d'une action (plus-value + dividende) contre un taux fixe ou variable."
  },
  {
    "question": "Quel indicateur évalue la valorisation d’une action par rapport à son bénéfice ?",
    "options": [
      "PER",
      "EPS",
      "YTM",
      "Spread de crédit"
    ],
    "answer": "PER",
    "explanation": "Le Price/Earnings Ratio (PER) compare le prix de l’action à son bénéfice annuel, utile pour mesurer la valorisation relative."
  },
  {
    "question": "Quel risque est plus spécifique aux obligations qu’aux actions ?",
    "options": [
      "Volatilité des prix",
      "Risque de défaut de l’émetteur",
      "Dilution",
      "Risque sectoriel"
    ],
    "answer": "Risque de défaut de l’émetteur",
    "explanation": "Les obligations sont exposées au risque de **défaut de paiement** de l’émetteur, ce qui est moins direct pour une action."
  },
  {
    "question": "Pourquoi investir dans une obligation plutôt qu’une action ?",
    "options": [
      "Pour un revenu variable",
      "Pour voter en assemblée",
      "Pour un revenu plus stable",
      "Pour une croissance rapide"
    ],
    "answer": "Pour un revenu plus stable",
    "explanation": "Les obligations offrent des **coupons réguliers**, donc un revenu plus prévisible que les actions, au prix d’un potentiel de gain plus limité."
  },
  {
    "question": "Quel est un exemple de produit hybride entre equity et fixed income ?",
    "options": [
      "ETF sur matières premières",
      "Obligation zéro-coupon",
      "Obligation convertible",
      "Option call classique"
    ],
    "answer": "Obligation convertible",
    "explanation": "Une obligation convertible peut être transformée en actions, combinant **revenu fixe initial** et **potentiel de croissance** via l’action."
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