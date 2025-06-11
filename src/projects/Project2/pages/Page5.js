// src/projects/Project1/pages/Page3.js
import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [

    {
    "question": "Quelle est la première étape pour combiner économétrie et ML ?",
    "answer": "Définir l'objectif économique et choisir un cadre théorique (ex: modèle de demande, théorie des prix)"
  },
  {
    "question": "Comment utiliser les résultats économétriques dans un modèle ML ?",
    "answer": "Ajouter les prédictions/résidus du modèle écon comme features (ex: élasticité-prix en input d'un Random Forest)"
  },
  {
    "question": "Quelle méthode économétrique permet de vérifier la causalité pour un modèle ML ?",
    "answer": "Test de Granger ou Différence-en-Différences (DID) - Évite les corrélations fallacieuses"
  },
  {
    "question": "Pourquoi créer des variables retardées (lags) ?",
    "answer": "Capturer des effets temporels (ex: prix_t-1) comme en économétrie des séries temporelles"
  },
  {
    "question": "Comment valider la stabilité d'un modèle hybride ?",
    "answer": "Backtesting + tests de rupture structurelle (ex: Chow test) pour vérifier la constance des paramètres"
  },
  {
    "question": "Quel outil utiliser pour l'analyse économétrique avant le ML ?",
    "answer": "Statsmodels (Python) ou R (lm/plm) - Pour régressions OLS, ARIMA, tests de stationnarité"
  },
  {
    "question": "Quelle technique combine économétrie et ML ?",
    "answer": "Stacking : Utiliser les prédictions économétriques comme input d'un modèle ML (ex: XGBoost)"
  },
  {
    "question": "Comment gérer des données macroéconomiques non-stationnaires ?",
    "answer": "Appliquer des tests ADF/KPSS et différenciation - Comme en économétrie des séries temporelles"
  },
  {
    "question": "Quel risque principal à éviter ?",
    "answer": "Confondre corrélation et causalité - Toujours valider avec des méthodes économétriques"
  },
  {
    "question": "Exemple concret de modèle hybride ?",
    "answer": "Prédiction des ventes = Équation de demande économétrique + Features non-linéaires (météo) via ML"
  },
   {
    "question": "Comment intégrer un modèle de régression linéaire dans un pipeline ML ?",
    "answer": "Utiliser les résidus ou prédictions OLS comme features additionnelles dans le modèle ML"
  },
  {
    "question": "Quelle valeur d'un modèle ARIMA peut servir de feature en ML ?",
    "answer": "Les résidus ou composantes AR/MA après détrending/désaisonnalisation"
  },
  {
    "question": "Comment exploiter les effets fixes d'un modèle panel en ML ?",
    "answer": "Convertir les effets fixes (entités/périodes) en embeddings ou variables catégorielles"
  },
  {
    "question": "Qu'apporte un modèle VAR à un système ML multi-sorties ?",
    "answer": "Des prédictions interdépendantes entre séries temporelles comme inputs"
  },
  {
    "question": "Comment utiliser la cointégration Engle-Granger en ML ?",
    "answer": "Ajouter le terme de correction d'équilibre (ECM) comme feature de régularisation"
  },
  {
    "question": "Quelle information d'un modèle Logit/Probit est utile en ML ?",
    "answer": "Les probabilités prédites comme feature pour un classifieur (ex: XGBoost)"
  },
  {
    "question": "Comment exploiter un modèle SEM (équations structurelles) en ML ?",
    "answer": "Extraire les variables latentes estimées pour enrichir les features"
  },
  {
    "question": "Quel modèle économétrique est utile pour le feature engineering en finance ?",
    "answer": "GARCH - Sa mesure de volatilité comme feature pour prédire le risque"
  },
  {
    "question": "Comment combiner OLS et XGBoost efficacement ?",
    "answer": "Stacking : Entraîner l'OLS en première couche, XGBoost en méta-modèle"
  },
  {
    "question": "Quel test appliquer avant d'intégrer des séries macroéconomiques en ML ?",
    "answer": "Tests de stationnarité (ADF/KPSS) + différenciation si nécessaire"
  },
  {
    "question": "Qu'est-ce qu'une Régression Linéaire ?",
    "answer": "Un modèle qui prédit une valeur continue en établissant une relation linéaire entre les variables indépendantes et dépendantes."
  },
  {
    "question": "Comment fonctionne une Régression Logistique ?",
    "answer": "C'est un modèle de classification qui estime la probabilité d'une classe en utilisant une fonction logistique (sigmoïde)."
  },
  {
    "question": "Quel est l'avantage des Arbres de Décision ?",
    "answer": "Ils sont faciles à interpréter, gèrent les données non linéaires et ne nécessitent pas de normalisation."
  },
  {
    "question": "Pourquoi utiliser un Random Forest ?",
    "answer": "Il combine plusieurs arbres de décision pour réduire le surajustement (overfitting) et améliorer la précision."
  },
  {
    "question": "Quand utiliser SVM (Machines à Vecteurs de Support) ?",
    "answer": "Pour des problèmes de classification ou régression avec des frontières complexes, grâce aux kernels (linéaire, RBF, etc.)."
  },
  {
    "question": "Qu'est-ce qu'un Gradient Boosting (XGBoost, LightGBM) ?",
    "answer": "Une méthode ensembliste qui combine séquentiellement des modèles faibles (arbres) pour corriger les erreurs résiduelles."
  },
  {
    "question": "Quel est l'usage des Réseaux de Neurones (Deep Learning) ?",
    "answer": "Pour modéliser des relations complexes (images, texte, séries temporelles) via des couches de neurones artificiels."
  },
{
    "question": "Quel est le but du Clustering K-Means ?",
    "answer": "Grouper des données similaires en 'k' clusters basés sur la distance euclidienne."
  },
  {
    "question": "Comment fonctionne le Clustering Hiérarchique ?",
    "answer": "Il crée une hiérarchie de clusters (dendrogramme) via des fusions (agglomératif) ou divisions (divisif)."
  },
  {
    "question": "Quand utiliser DBSCAN plutôt que K-Means ?",
    "answer": "Pour des clusters de formes arbitraires ou détecter des outliers (ex : données spatiales)."
  },
  {
    "question": "Qu'est-ce qu'une ACP (Analyse en Composantes Principales) ?",
    "answer": "Une méthode de réduction de dimension qui projette les données sur des axes orthogonaux de variance maximale."
  },
  {
    "question": "Comment fonctionne t-SNE ?",
    "answer": "Il réduit la dimension en préservant les similarités locales (idéal pour la visualisation en 2D/3D)."
  },
  {
    "question": "Quel est l'objectif des Autoencodeurs ?",
    "answer": "Apprendre une représentation compressée (embedding) des données via un réseau de neurones encoder-decoder."
  },
  {
    "question": "Quand utiliser LDA (Latent Dirichlet Allocation) ?",
    "answer": "Pour modéliser des topics (thèmes) dans des données textuelles (ex : analyse de documents)."
  },
{
    "question": "Qu'est-ce qu'un modèle Semi-Supervisé ?",
    "answer": "Une approche combinant peu de données étiquetées et beaucoup de données non étiquetées (ex : Self-Training, Label Propagation)."
  },
   {
    "question": "Régression Linéaire vs Logistique - Objectifs principaux",
    "answer": "Linéaire : Prédire une valeur continue (ex: prix). Logistique : Classer des probabilités (ex: spam/non-spam) via une sigmoïde."
  },
  {
    "question": "Arbres de Décision vs Random Forest - Avantages comparés",
    "answer": "Arbres : Simplicité et interprétabilité. Random Forest : Réduction du surajustement par bagging + moyenne des prédictions."
  },
  {
    "question": "SVM vs XGBoost - Cas d'usage typiques",
    "answer": "SVM : Frontières complexes (kernel trick). XGBoost : Performance optimale sur données structurées (ex: compétitions Kaggle)."
  },
  {
    "question": "K-Means vs DBSCAN - Forces et limites",
    "answer": "K-Means : Rapidité (clusters sphériques). DBSCAN : Détection de formes arbitraires et outliers (ex: données GPS)."
  },
  {
    "question": "ACP vs t-SNE - Utilités en réduction de dimension",
    "answer": "ACP : Variance maximale (visualisation/compression). t-SNE : Préservation des voisinages (exploration de clusters)."
  },
  {
    "question": "Autoencodeurs vs LDA - Applications non-supervisées",
    "answer": "Autoencodeurs : Compression non-linéaire (ex: images). LDA : Modélisation de topics (ex: analyse de textes)."
  },
  {
    "question": "Réseaux de Neurones vs Modèles Linéaires - Quand choisir ?",
    "answer": "Réseaux : Données complexes (images/texte). Linéaires : Données structurées + interprétabilité critique."
  }

  
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
     {
    "question": "Quelle est la principale différence entre une régression linéaire et une régression logistique ?",
    "options": [
      "La régression linéaire utilise des arbres de décision",
      "La régression logistique prédit des probabilités pour des classes",
      "La régression linéaire ne fonctionne qu'avec des données textuelles",
      "La régression logistique nécessite moins de données"
    ],
    "answer": "La régression logistique prédit des probabilités pour des classes",
    "explanation": "La régression linéaire prédit des valeurs continues tandis que la logistique utilise une sigmoïde pour classifier en probabilités."
  },
  {
    "question": "Pourquoi préférer un Random Forest à un simple arbre de décision ?",
    "options": [
      "Il est plus rapide à entraîner",
      "Il réduit le risque de surajustement (overfitting)",
      "Il nécessite moins de mémoire",
      "Il ne nécessite pas de paramétrage"
    ],
    "answer": "Il réduit le risque de surajustement (overfitting)",
    "explanation": "Le Random Forest combine plusieurs arbres (bagging) pour moyenner leurs prédictions, ce qui réduit la variance."
  },
  {
    "question": "Quand utiliser DBSCAN plutôt que K-Means ?",
    "options": [
      "Quand on connaît exactement le nombre de clusters",
      "Pour détecter des outliers et clusters de formes irrégulières",
      "Pour des données parfaitement sphériques",
      "Quand la vitesse d'exécution est le critère principal"
    ],
    "answer": "Pour détecter des outliers et clusters de formes irrégulières",
    "explanation": "DBSCAN est idéal pour des clusters de densité variable et détecte automatiquement les points aberrants."
  },
  {
    "question": "Quelle technique est optimale pour visualiser des données haute dimension en 2D ?",
    "options": [
      "Régression linéaire",
      "Analyse en Composantes Principales (ACP)",
      "t-SNE",
      "K-Means"
    ],
    "answer": "t-SNE",
    "explanation": "t-SNE préserve les similarités locales, idéal pour la visualisation, contrairement à l'ACP qui maximise la variance globale."
  },
  {
    "question": "Quel modèle utiliser pour classer des images ?",
    "options": [
      "Régression logistique",
      "Réseaux de Neurones Convolutifs (CNN)",
      "K-Means",
      "ACP"
    ],
    "answer": "Réseaux de Neurones Convolutifs (CNN)",
    "explanation": "Les CNN sont spécialisés dans l'extraction de motifs spatiaux (contours, textures) via des filtres convolutifs."
  },
  {
    "question": "Quelle est l'utilité principale des autoencodeurs ?",
    "options": [
      "Classer des emails en spam/non-spam",
      "Apprendre des représentations compressées des données",
      "Prédire le prix des actions",
      "Générer des clusters sphériques"
    ],
    "answer": "Apprendre des représentations compressées des données",
    "explanation": "Les autoencodeurs réduisent la dimension via un goulot d'étranglement (bottleneck) encoder-decoder."
  },
  {
    "question": "Quel algorithme est adapté à l'analyse thématique de documents ?",
    "options": [
      "SVM",
      "LDA (Latent Dirichlet Allocation)",
      "Régression linéaire",
      "DBSCAN"
    ],
    "answer": "LDA (Latent Dirichlet Allocation)",
    "explanation": "LDA modélise les documents comme mélange de topics (thèmes) via des distributions probabilistes."
  },
  {
    "question": "Pourquoi utiliser XGBoost plutôt qu'un SVM pour un dataset structuré ?",
    "options": [
      "XGBoost gère mieux les données manquantes et est souvent plus performant",
      "SVM est toujours plus précis sur les données tabulaires",
      "XGBoost ne nécessite aucun réglage",
      "SVM est plus rapide sur les grands datasets"
    ],
    "answer": "XGBoost gère mieux les données manquantes et est souvent plus performant",
    "explanation": "XGBoost (boosting) domine souvent sur les données structurées grâce à sa robustesse et ses mécanismes de régularisation."
  },
  {
    "question": "Quelle méthode est semi-supervisée ?",
    "options": [
      "K-Means",
      "Label Propagation",
      "Régression linéaire",
      "ACP"
    ],
    "answer": "Label Propagation",
    "explanation": "Elle propage des labels initiaux aux données non-labellisées basée sur leur similarité (graphe)."
  },
  {
    "question": "Quel modèle économétrique est utile comme feature pour prédire des ventes ?",
    "options": [
      "Résidus d'un modèle ARIMA",
      "Clusters K-Means",
      "Sortie d'un DBSCAN",
      "Composantes t-SNE"
    ],
    "answer": "Résidus d'un modèle ARIMA",
    "explanation": "Les résidus ARIMA capturent les motifs temporels non expliqués, utiles comme input supplémentaire en ML."
  },{
    "question": "Quelle métrique utiliser pour évaluer un modèle de classification déséquilibré ?",
    "options": [
      "Précision (Accuracy)",
      "F1-Score",
      "R-Squared",
      "MSE (Mean Squared Error)"
    ],
    "answer": "F1-Score",
    "explanation": "Le F1-Score (moyenne harmonique de précision et rappel) est robuste aux déséquilibres de classes, contrairement à l'accuracy."
  },
  {
    "question": "Quelle technique permet de sélectionner automatiquement les features importantes ?",
    "options": [
      "K-Means",
      "PCA (Principal Component Analysis)",
      "Lasso Regression (L1 Regularization)",
      "t-SNE"
    ],
    "answer": "Lasso Regression (L1 Regularization)",
    "explanation": "La régularisation L1 dans Lasso réduit à zéro les coefficients des features non pertinentes, effectuant une sélection."
  },
  {
    "question": "Quel modèle est adapté pour prédire une série temporelle avec saisonnalité ?",
    "options": [
      "Linear Regression",
      "SARIMA (Seasonal ARIMA)",
      "K-Nearest Neighbors",
      "DBSCAN"
    ],
    "answer": "SARIMA (Seasonal ARIMA)",
    "explanation": "SARIMA intègre explicitement des composantes saisonnières (p, d, q saisonniers) contrairement aux modèles non temporels."
  },
  {
    "question": "Quel algorithme utiliser pour détecter des anomalies dans des transactions financières ?",
    "options": [
      "Linear Regression",
      "Isolation Forest",
      "K-Means",
      "PCA"
    ],
    "answer": "Isolation Forest",
    "explanation": "Isolation Forest isole les anomalies via des splits aléatoires, efficace pour les données haute dimension."
  },
  {
    "question": "Quelle méthode permet de visualiser l'importance des features dans un Random Forest ?",
    "options": [
      "Matrice de confusion",
      "Feature Importance (Gini/Mean Decrease Impurity)",
      "Courbe ROC",
      "Dendrogramme"
    ],
    "answer": "Feature Importance (Gini/Mean Decrease Impurity)",
    "explanation": "Mesure la réduction moyenne de l'impureté (Gini) apportée par chaque feature à travers tous les arbres."
  },
  {
    "question": "Quel prétraitement est essentiel pour un modèle SVM avec noyau RBF ?",
    "options": [
      "Normalisation (moyenne=0, écart-type=1)",
      "Discrétisation en bins",
      "Suppression des outliers",
      "Augmentation des données"
    ],
    "answer": "Normalisation (moyenne=0, écart-type=1)",
    "explanation": "SVM/RBF est sensible aux échelles des features. La normalisation évite qu'une feature dominante biaise le noyau."
  },
  {
    "question": "Quelle architecture de réseau de neurones est adaptée au NLP (traitement du langage) ?",
    "options": [
      "CNN (Convolutional Neural Network)",
      "RNN/LSTM",
      "MLP (Multi-Layer Perceptron)",
      "Autoencodeur"
    ],
    "answer": "RNN/LSTM",
    "explanation": "Les RNN/LSTM capturent les dépendances séquentielles (mots, phrases) via des connexions récurrentes."
  },
  {
    "question": "Quel outil utiliser pour optimiser les hyperparamètres d'un modèle ?",
    "options": [
      "K-Means",
      "GridSearchCV/RandomizedSearchCV",
      "PCA",
      "DBSCAN"
    ],
    "answer": "GridSearchCV/RandomizedSearchCV",
    "explanation": "GridSearchCV teste exhaustivement des combinaisons, RandomizedSearchCV échantillonne aléatoirement (plus efficace)."
  },
  {
    "question": "Quelle technique permet de générer de nouvelles images réalistes ?",
    "options": [
      "Régression linéaire",
      "GAN (Generative Adversarial Network)",
      "K-Means",
      "SVM"
    ],
    "answer": "GAN (Generative Adversarial Network)",
    "explanation": "Les GANs utilisent un générateur et un discriminateur en compétition pour produire des données synthétiques réalistes."
  },
  {
    "question": "Comment interpréter une courbe ROC avec AUC=0.8 ?",
    "options": [
      "Le modèle est inutile (aléatoire)",
      "Le modèle a 80% de précision",
      "Le modèle a 80% de chance de bien classer une paire aléatoire (positive/négative)",
      "Le modèle met 0.8s à prédire"
    ],
    "answer": "Le modèle a 80% de chance de bien classer une paire aléatoire (positive/négative)",
    "explanation": "AUC (Area Under Curve) mesure la capacité à distinguer les classes. 0.8 = bon modèle (0.5 = aléatoire, 1 = parfait)."
  },

  ],
  avance: [

    
    {
      "question": "Comment effectuer une requête LINQ pour sélectionner tous les clients dont le nom commence par 'A' ?",
      "options": [
        "var result = clients.Where(c => c.Name.StartsWith(\"A\"));",
        "var result = clients.Select(c => c.Name == \"A\");",
        "var result = clients.FindAll(c => c.Name == \"A\");",
        "var result = clients.Get(c => c.Name.StartsWith(\"A\"));"
      ],
      "answer": "var result = clients.Where(c => c.Name.StartsWith(\"A\"));",
      "explanation": "La méthode 'Where' de LINQ permet de filtrer les éléments d'une collection en fonction d'une condition spécifiée."
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
const Page4 = () => {
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

export default Page4;