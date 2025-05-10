import React, { useState, useEffect } from "react";
import "./QCMStyles.css";

// Flashcards pour le niveau basic
const basicSlides = [
    
   {
    "question": "1. Compréhension du Métier (Equity / Front Office)",
    "answer": "."
  },
  {
    "question": "Pouvez-vous expliquer le fonctionnement des marchés actions ?",
    "answer": "Les marchés actions permettent aux entreprises de lever des fonds en émettant des titres, et aux investisseurs d’acheter/vendre ces titres sur des marchés organisés comme Euronext ou le NYSE."
  },
  {
    "question": "Quelle est la différence entre un ordre au marché et un ordre limite ?",
    "answer": "Un ordre au marché est exécuté immédiatement au meilleur prix disponible, tandis qu’un ordre limite est exécuté uniquement si le prix atteint une limite définie par l’investisseur."
  },
  {
    "question": "Que savez-vous des produits Equity dérivés (options, futures, turbos…) ?",
    "answer": "Ce sont des instruments financiers dérivés d’actions sous-jacentes, utilisés pour se couvrir, spéculer ou optimiser un portefeuille. Ils incluent options, futures, turbos, warrants, etc."
  },
  {
    "question": "Quelle est la différence entre le cash equity et les produits structurés ?",
    "answer": "Le cash equity concerne l’achat/vente d’actions classiques. Les produits structurés combinent plusieurs instruments (souvent des dérivés) pour créer des profils de rendement spécifiques."
  },
  {
    "question": "Comment les traders utilisent-ils les systèmes Front Office au quotidien ?",
    "answer": "Ils les utilisent pour consulter les prix, exécuter des ordres, analyser le carnet d’ordres, visualiser les risques, suivre les positions et consulter les news ou données de marché."
  },
  {
    "question": "Avez-vous déjà travaillé avec des desks actions ou des sales/traders ?",
    "answer": "Oui, j’ai participé à des ateliers pour recueillir leurs besoins, suivi des incidents avec eux en production et contribué à l’évolution des outils de pricing ou de passage d’ordres."
  },
  {
    "question": "Comment assurez-vous la prise en compte de la réglementation (MiFID II, etc.) dans vos projets ?",
    "answer": "En intégrant les contraintes réglementaires dès le cadrage (reporting TCA, best execution, horodatage) et en collaborant avec les équipes conformité et juridiques."
  },
    {
    "question": " 2. Questions de Rôle BA (Spécifiques au Front Office)",
    "answer": "🧩"
  },
  {
    "question": "Comment recueillez-vous les besoins métier auprès des traders ou sales ?",
    "answer": "Je privilégie les échanges directs via ateliers, interviews, observation sur le floor et analyse des incidents ou usages récurrents."
  },
  {
    "question": "Quelle méthodologie utilisez-vous pour rédiger vos spécifications fonctionnelles (UML, user stories, etc.) ?",
    "answer": "Je m’adapte : user stories et critères d’acceptation en Agile, UML ou BPMN pour les processus plus complexes, et matrice de besoins pour les projets structurés."
  },
  {
    "question": "Avez-vous déjà modélisé des workflows de trading ou d’exécution ?",
    "answer": "Oui, j’ai utilisé des diagrammes de séquence ou de flux pour représenter les étapes clés entre l’ordre, le matching, l’exécution, l’alerte et le reporting."
  },
  {
    "question": "Comment gérez-vous les priorités entre plusieurs utilisateurs Front Office ?",
    "answer": "Je fais une qualification des impacts, fréquence et criticité, puis je priorise en lien avec les Product Owners ou les responsables de desk."
  },
  {
    "question": "Quelle est votre approche pour tester une fonctionnalité sur un outil de pricing ou de passage d’ordre ?",
    "answer": "Je définis des cas de test métiers, des jeux de données réalistes et je valide les résultats avec les utilisateurs clés en environnement de préproduction."
  },
  {
    "question": "Avez-vous participé à des phases de recette avec le Front Office ?",
    "answer": "Oui, en coordonnant les tests UAT avec les sales/traders, en rédigeant les plans de test et en centralisant les retours sur anomalies ou ergonomie."
  },
  {
    "question": "Comment identifiez-vous et documentez-vous les impacts d’un changement sur une chaîne Front to Back ?",
    "answer": "Je cartographie le flux métier complet, du Front (saisie de l’ordre) au Back (règlement/livraison) et j’identifie les dépendances applicatives ou humaines."
  },
  {
    "question": " 3. Compétences Techniques",
    "answer": "💻"
  },
  
  {
    "question": "Travaillez-vous avec des outils comme Bloomberg, Reuters, Fidessa, Murex ou Calypso ?",
    "answer": "Oui, je maîtrise l’environnement Bloomberg pour les prix, les ordres et les news. J’ai aussi eu des interactions avec Calypso sur les flux de dérivés."
  },
  {
    "question": "Connaissez-vous le langage FIX ? Avez-vous déjà analysé un message FIX ?",
    "answer": "Oui, j’ai analysé des messages FIX pour tracer des ordres (tag 35, 55, etc.) et investiguer des bugs d’exécution ou de booking dans les logs."
  },
  {
    "question": "Savez-vous lire ou écrire des requêtes SQL pour valider des données ?",
    "answer": "Oui, j’utilise régulièrement SQL pour valider des données, reconstruire un trade ou vérifier des écarts entre systèmes Front et Back."
  },
  {
    "question": "Avez-vous déjà utilisé des outils de BI (Power BI, Tableau) pour produire des reportings ?",
    "answer": "Oui, notamment pour suivre les KPIs d’activité des desks, analyser les anomalies ou agréger des données de performance ou de risque."
  },
  {
    "question": "Quels outils utilisez-vous pour suivre les demandes (JIRA, Confluence…) ?",
    "answer": "JIRA pour le suivi Agile des user stories et Confluence pour la documentation fonctionnelle, les workflows et les comptes-rendus d’ateliers."
  },
  {
    "question": "Avez-vous contribué à des projets Agile ? Quel était votre rôle dans les sprints ?",
    "answer": "Oui, en tant que BA, je rédigeais les user stories, participais aux plannings, revues et rétrospectives, et validais les livrables avec les PO et utilisateurs."
  },
  {
    "question": "4. Problèmes Concrets et Études de Cas",
    "answer": "💻"
  },
   {
    "question": "Un trader se plaint que les prix affichés sur l’outil de pricing ne sont pas à jour. Que faites-vous ?",
    "answer": "Je vérifie la source de données (ex : Bloomberg, feed interne), teste le flux en temps réel, consulte les logs et alerte si besoin les équipes techniques."
  },
  {
    "question": "Un utilisateur ne retrouve pas un trade exécuté. Comment analysez-vous le problème ?",
    "answer": "Je reconstitue le parcours du trade dans le système, vérifie les statuts, consulte les logs, les tables SQL et les éventuels rejets ou erreurs d’enrichissement."
  },
  {
    "question": "Comment structureriez-vous un projet de refonte d’un outil d’ordre Front Office ?",
    "answer": "Je commence par recueillir les besoins utilisateurs, cartographier les flux existants, prioriser les fonctionnalités clés, puis définir les phases MVP, tests et déploiement progressif."
  },
  {
    "question": "Donnez un exemple où vous avez dû faire le lien entre MOA, MOE et le Front Office pour résoudre un incident critique.",
    "answer": "Lors d’un incident de pricing erroné en salle des marchés, j’ai analysé les logs, confirmé le bug avec la MOE, sécurisé temporairement les flux, puis organisé la correction en urgence avec les traders."
  },
  {
    "question": "Vous devez intégrer un nouveau flux de données de marché dans l’outil de pricing. Quelles sont les étapes clés ?",
    "answer": "Analyser le format du flux, valider sa fréquence et sa qualité, définir le mapping vers le système cible, coordonner le développement avec la MOE, tester avec les utilisateurs et monitorer après mise en production."
  },
        {
    "question": " 5. Soft Skills & Communication",
    "answer": "💻"
  },
  {
    "question": "Comment gérez-vous une situation où le trader attend une solution immédiate mais la DSI vous demande du délai ?",
    "answer": "Je priorise la transparence : j’explique les contraintes techniques, propose une solution intermédiaire ou un workaround, tout en relayant l’urgence à la DSI."
  },
  {
    "question": "Quelle est votre approche pour vulgariser des contraintes techniques auprès du Front Office ?",
    "answer": "Je fais des analogies concrètes, utilise des schémas simples et me concentre sur les impacts métier plutôt que les détails techniques."
  },
  {
    "question": "Comment construisez-vous une relation de confiance avec les utilisateurs Front ?",
    "answer": "En étant réactif, en comprenant leurs contraintes métier, en tenant mes engagements et en communiquant régulièrement sur l’avancement ou les incidents."
  },
  {
    "question": "Donnez un exemple où vous avez contribué à la prise de décision fonctionnelle en salle des marchés.",
    "answer": "Lors du choix d’un module d’exécution rapide, j’ai organisé une démo, comparé les options et rédigé une synthèse claire qui a permis au desk de trancher rapidement."
  },

];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
{
    "question": "Quelle est l’interaction clé entre le BA et le Front Office lors de la phase de cadrage d’un projet ?",
    "options": [
      "Le BA observe uniquement les opérations du Front Office",
      "Le BA rédige des user stories sans échange direct",
      "Le BA recueille les besoins via ateliers et observation sur le floor",
      "Le BA délègue la collecte des besoins à la MOE"
    ],
    "answer": "Le BA recueille les besoins via ateliers et observation sur le floor",
    "explanation": "Le BA privilégie les interactions directes avec les traders et sales via ateliers, interviews et observation pour bien comprendre les besoins métier."
  },
  {
    "question": "Quel est le rôle du BA dans la priorisation des demandes des utilisateurs Front Office ?",
    "options": [
      "Il suit un ordre chronologique de réception des demandes",
      "Il demande aux développeurs de choisir",
      "Il évalue impact, fréquence et criticité pour arbitrer",
      "Il laisse les utilisateurs décider eux-mêmes"
    ],
    "answer": "Il évalue impact, fréquence et criticité pour arbitrer",
    "explanation": "Le BA analyse la valeur métier et la fréquence des demandes pour les prioriser avec les Product Owners ou responsables de desks."
  },
  {
    "question": "Quelle action le BA entreprend-il pour tester une nouvelle fonctionnalité de pricing ?",
    "options": [
      "Il demande à la MOE de tester seule",
      "Il crée des cas de test réalistes et valide avec les utilisateurs",
      "Il attend que le client signale un bug",
      "Il teste en production sans jeu de données"
    ],
    "answer": "Il crée des cas de test réalistes et valide avec les utilisateurs",
    "explanation": "Le BA définit des cas métiers, prépare des jeux de données et s’assure de la validation fonctionnelle en pré-production avec les utilisateurs clés."
  },
  {
    "question": "Quelle est la meilleure réponse à une incohérence entre un prix affiché sur l’outil FO et la donnée réelle ?",
    "options": [
      "Redémarrer l’application",
      "Demander aux traders de patienter",
      "Analyser les flux de données, logs et source (ex: Bloomberg)",
      "Attendre le retour de la DSI"
    ],
    "answer": "Analyser les flux de données, logs et source (ex: Bloomberg)",
    "explanation": "Le BA doit identifier l'origine du problème via les flux de données, vérifier la source et analyser les logs avant d’alerter les équipes techniques."
  },
  {
    "question": "Quelle attitude adopter face à un trader qui exige une solution immédiate alors que la DSI prévoit un délai ?",
    "options": [
      "Promettre une résolution rapide sans validation",
      "Proposer une solution intermédiaire et alerter la DSI",
      "Ignorer la demande du trader",
      "Transférer la demande à un autre BA"
    ],
    "answer": "Proposer une solution intermédiaire et alerter la DSI",
    "explanation": "Le BA doit gérer la pression en proposant un workaround, en maintenant une communication claire, et en impliquant rapidement la DSI."
  }
  ],
  avance: [
     {
    "question": "Quelle est la différence principale entre la variance et l’écart-type en finance ?",
    "options": [
      "La variance est toujours plus petite que l’écart-type",
      "L’écart-type est une moyenne absolue, la variance est une moyenne quadratique",
      "La variance s’exprime dans les mêmes unités que les données",
      "L’écart-type s’exprime dans les mêmes unités que les données, la variance est au carré"
    ],
    "answer": "L’écart-type s’exprime dans les mêmes unités que les données, la variance est au carré",
    "explanation": "L’écart-type est la racine carrée de la variance et a la même unité que les données, ce qui le rend plus interprétable pour mesurer le risque."
  },
  {
    "question": "Pourquoi le processus de Wiener est-il central dans les modèles de finance quantitative ?",
    "options": [
      "Il permet de calculer la prime de risque exacte",
      "Il modélise un comportement cyclique des actifs",
      "Il représente un aléa continu avec des incréments indépendants et normalement distribués",
      "Il est utilisé uniquement pour les actifs à revenu fixe"
    ],
    "answer": "Il représente un aléa continu avec des incréments indépendants et normalement distribués",
    "explanation": "Le processus de Wiener, ou mouvement brownien, est la base des modèles comme Black-Scholes car il modélise une évolution aléatoire continue des prix."
  },
  {
    "question": "Quelle méthode est typiquement utilisée pour calibrer une surface de volatilité implicite ?",
    "options": [
      "Lissage par moyenne mobile",
      "Interpolation et optimisation numérique à partir de prix d’options",
      "Régression linéaire sur les prix spot",
      "Transformation de Fourier inverse des prix d’options"
    ],
    "answer": "Interpolation et optimisation numérique à partir de prix d’options",
    "explanation": "La calibration consiste à extraire les volatilités implicites du marché via interpolation puis à ajuster un modèle à l’aide d’une méthode d’optimisation."
  },
  {
    "question": "Quelle est la différence majeure entre Monte Carlo et arbre binomial dans le pricing d’options ?",
    "options": [
      "Monte Carlo est plus rapide que l’arbre binomial",
      "L’arbre binomial est plus adapté aux options exotiques",
      "Monte Carlo gère mieux les options complexes à plusieurs variables",
      "Les deux méthodes sont équivalentes en termes d’application"
    ],
    "answer": "Monte Carlo gère mieux les options complexes à plusieurs variables",
    "explanation": "La méthode de Monte Carlo est idéale pour des options exotiques ou multidimensionnelles, contrairement aux arbres binomiaux, plus adaptés aux options simples."
  },
  {
    "question": "Quel est le rôle principal de la matrice de corrélation en gestion de portefeuille ?",
    "options": [
      "Mesurer le rendement attendu des actifs",
      "Identifier les relations de dépendance entre les actifs",
      "Optimiser la fiscalité du portefeuille",
      "Déterminer la volatilité historique individuelle"
    ],
    "answer": "Identifier les relations de dépendance entre les actifs",
    "explanation": "La matrice de corrélation aide à comprendre comment les actifs évoluent ensemble, ce qui est crucial pour la diversification du risque."
  },
  {
    "question": "Dans un modèle de Black-Scholes, quelle hypothèse est faite sur la volatilité ?",
    "options": [
      "Elle est nulle",
      "Elle varie en fonction du temps",
      "Elle est constante",
      "Elle suit une loi normale"
    ],
    "answer": "Elle est constante",
    "explanation": "Le modèle Black-Scholes suppose une volatilité constante sur toute la durée de vie de l’option, bien que cela soit une simplification."
  },
  {
    "question": "Pourquoi utilise-t-on le changement de mesure en probabilités neutres au risque ?",
    "options": [
      "Pour ignorer le temps dans les calculs de prix",
      "Pour éviter de devoir estimer la volatilité",
      "Pour valoriser les actifs en supprimant la prime de risque",
      "Pour simuler des scénarios plus pessimistes"
    ],
    "answer": "Pour valoriser les actifs en supprimant la prime de risque",
    "explanation": "Le passage à une mesure neutre au risque permet de valoriser les actifs en remplaçant les espérances réelles par celles sous mesure risque-neutre."
  },
  {
    "question": "Qu’indique un Sharpe Ratio négatif sur une période donnée ?",
    "options": [
      "Le portefeuille a surperformé le marché",
      "La volatilité du portefeuille est faible",
      "La performance est inférieure au taux sans risque",
      "Le portefeuille est parfaitement diversifié"
    ],
    "answer": "La performance est inférieure au taux sans risque",
    "explanation": "Un Sharpe Ratio négatif signifie que le rendement excédentaire est négatif, c’est-à-dire inférieur au rendement sans risque malgré la prise de risque."
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