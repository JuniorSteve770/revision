import React, { useState, useEffect } from "react";
import "./QCMStyles.css";

// Flashcards pour Produits structurés
const basicSlides = [
  {
    "question": "REST vs SOAP - Avantages clés & cas d'usage",
    "answer": "REST : Simple, scalable (JSON/HTTP). Ex: APIs web/mobile.\nSOAP : Sécurité/contrats stricts (XML/WSDL). Ex: banque/santé."
  },
  {
    "question": "HTTP/2 - 3 optimisations majeures vs HTTP/1.1",
    "answer": "1) Multiplexage (requêtes parallèles)\n2) Compression headers\n3) Server push (pré-chargement ressources)."
  },
  {
    "question": "GraphQL - Problème résolu & limite principale",
    "answer": "+ Évite over/under-fetching (requêtes sur-mesure)\n- Risque de N+1 queries (solution: Dataloader)."
  },
  {
    "question": "REST + HTTP/2 - Synergie clé",
    "answer": "HTTP/2 compense les faiblesses de REST (latence multiples appels) via le multiplexage. Ex: app mobile avec nombreux endpoints."
  },
  {
    "question": "SOAP vs GraphQL - Format données & flexibilité",
    "answer": "SOAP : XML rigide (WSDL obligatoire)\nGraphQL : JSON flexible (schéma client-driven)."
  },
  {
    "question": "Qu'est-ce qu'un produit structuré à capital garanti ?",
    "answer": "Un produit financier qui protège tout ou partie du capital investi, souvent en combinant une obligation avec des dérivés. Exemple : les obligations à capital garanti."
  },
  {
    "question": "Quels sont les deux principaux types de protection du capital dans les produits structurés ?",
    "answer": "1. Protection **totale** (100% du capital garanti).\n2. Protection **partielle** (ex : 80-90% du capital protégé)."
  },
  {
    "question": "Comment fonctionne un produit autocallable ?",
    "answer": "Il s'autodétruit (rembourse anticipativement) si le sous-jacent atteint un seuil prédéfini, avec un coupon bonus. Exemple : un autocallable sur indice actions."
  },
  {
    "question": "Quel est l'avantage principal d'un produit Phoenix ?",
    "answer": "Il verse des coupons réguliers tant que le sous-jacent ne franchit pas une barrière de baisse. Avantage : revenus récurrents en marché stable."
  },
  {
    "question": "Quel est le risque d'un Barrier Reverse Convertible ?",
    "answer": "Si le sous-jacent touche la barrière, l'investisseur reçoit des actions (souvent moins valorisées) au lieu du remboursement du capital."
  },
  {
    "question": "Pourquoi investir dans des notes hybrides multi-actifs ?",
    "answer": "Pour diversifier le risque en liant le produit à plusieurs classes d'actifs (actions, obligations, matières premières)."
  },
  {
    "question": "Quel est l'inconvénient des produits liés à des indices propriétaires ?",
    "answer": "Manque de transparence (méthodologie opaque) et risque de liquidation de l'indice par l'émetteur."
  },
  {
    "question": "Quel mécanisme amplifie les gains/pertes dans les produits à effet de levier ?",
    "answer": "L'utilisation de dérivés (options, futures) pour multiplier l'exposition au sous-jacent. Exemple : certificats 2x ou 3x."
  },
  {
    "question": "Quels sont les 3 risques non-financiers à considérer avec les produits structurés ?",
    "answer": "1. Risque de crédit (faillite de l'émetteur).\n2. Liquidité (difficile à revendre).\n3. Complexité (erreur de compréhension)."
  },
  {
    "question": "Pourquoi les produits structurés ont-ils souvent des frais élevés ?",
    "answer": "Ils combinent plusieurs instruments (obligations + dérivés) et nécessitent une gestion active pour ajuster les barrières ou les protections."
  },
  {
  "question": "Qu'est-ce qu'une API ? Donnez un exemple concret.",
  "answer": "Interface de programmation permettant à des systèmes de communiquer. Ex : API météo qui renvoie des données JSON à un site web."
},
{
    "question": "REST - 6 contraintes architecturales",
    "answer": "1. Client-Serveur 2. Sans état (stateless) 3. Cacheable 4. Interface uniforme 5. Système en couches 6. Code à la demande (optionnel)"
  },
  {
    "question": "Méthodes HTTP et équivalence CRUD",
    "answer": "GET (Read), POST (Create), PUT/PATCH (Update), DELETE (Delete). Ex : GET /api/users/1"
  },
  {
    "question": "Bonnes pratiques REST (3 exemples)",
    "answer": "1. Noms au pluriel (/users) 2. Codes HTTP (200 OK, 404 Not Found) 3. Versioning (/v1/users)"
  },
  {
  "question": "WebSocket vs REST : cas d'usage",
  "answer": "REST : requêtes ponctuelles (chargement page). WebSocket : communication temps réel (chat, notifications). Ex : const socket = new WebSocket('ws://example.com');"
  }, 
  {
    "question": "GraphQL - 3 avantages clés",
    "answer": "1. Requêtes sur-mesure 2. Évitement du sur-chargement 3. Schéma typé. Ex : query { user(id:1) { name } }"
  },
  {
    "question": "Différence Résolveurs (GraphQL) vs Contrôleurs (REST)",
    "answer": "Résolveur : fonction par champ. Contrôleur : fonction par endpoint. GraphQL permet d'éviter les multiples appels REST."
  },
  {
  "question": "gRPC - Caractéristiques techniques",
  "answer": "Protocole RPC haute performance :\n- Utilise HTTP/2 et Protobuf\n- Orienté streaming\n- Idéal microservices. Ex : service UserService { rpc GetUser (UserRequest) returns (User); }"
  },{
    "question": "JSON vs XML - Comparaison technique",
    "answer": "JSON : léger, facile à parser, base de JS. XML : verbose, namespaces, schémas XSD. Ex XML : <user><id>1</id></user>"
  },
  {
    "question": "Protobuf (gRPC) vs JSON - Quand choisir ?",
    "answer": "Protobuf : perf binaire (microservices). JSON : lisibilité (APIs web). Ex Protobuf : message User { int32 id = 1; }"
  },
  {
  "question": "Tableau comparatif : REST vs GraphQL vs gRPC",
  "answer": "| Critère       | REST       | GraphQL    | gRPC       |\n|--------------|------------|------------|------------|\n| Format       | JSON/XML   | GraphQL    | Protobuf   |\n| Performance  | Moyenne    | Flexible   | Élevée     |\n| Cas d'usage  | APIs web   | Data complexe | Microservices |"
}, 
{
    "question": "Sécurité API - 3 mesures essentielles",
    "answer": "1. HTTPS 2. Authentification (JWT/OAuth) 3. Rate limiting"
  },
  {
    "question": "Versioning API - 2 méthodes",
    "answer": "1. URI (/v1/users) 2. Headers (Accept: application/vnd.api.v1+json)"
  },
  {
  "question": "Outils pour tester/documenter les APIs",
  "answer": "Postman (tests), Swagger/OpenAPI (docs), Insomnia (alternatif à Postman), Wireshark (debug gRPC)"
},
{
    "question": "Exemple architecture moderne combinant ces technologies",
    "answer": "Frontend → GraphQL (aggregation) → Microservices gRPC\nWebSocket → Notifications temps réel\nStockage : JSON pour configs, Protobuf pour données internes"
  },
  {
    "question": "Erreur courante à éviter avec WebSockets",
    "answer": "Oublier la gestion reconnexion : implémenter heartbeat et retry logic. Ex : socket.addEventListener('close', () => reconnect());"
  },
  {
    "question": "Tests Unitaires - Définition et objectif",
    "answer": "Valider le bon fonctionnement isolé des composants (fonctions, classes). Objectif : détecter les bugs tôt et documenter le code."
  },
  {
    "question": "Étape 1 : Préparation",
    "answer": "1. Isoler le composant à tester\n2. Mocker les dépendances externes (BD, API)\n3. Définir cas de test (valides/invalides)"
  },
  {
    "question": "Étape 2 : Implémentation",
    "answer": "1. Écrire le test (AAA : Arrange-Act-Assert)\nEx (JavaScript) :\ntest('add(2,3) retourne 5', () => {\n  expect(add(2,3)).toBe(5);\n})"
  },
  {
    "question": "Étape 3 : Exécution",
    "answer": "1. Lancer les tests (jest, pytest, etc.)\n2. Vérifier la couverture de code (>80% idéal)\n3. Analyser les logs d'échec"
  },
  {
    "question": "Outils populaires",
    "answer": "JavaScript : Jest/Jasmine\nPython : pytest/unittest\nJava : JUnit\nC# : xUnit/NUnit"
  },
  {
    "question": "CI/CD - Définition en 2 parties",
    "answer": "CI : Automatiser build + tests à chaque commit\nCD : Livraison automatique en préprod/prod"
  },
  {
    "question": "Étape 1 : Intégration Continue (CI)",
    "answer": "1. Trigger sur push/PR\n2. Build le projet\n3. Lancer les tests unitaires/intégration\n4. Générer des artefacts (Docker, .jar)"
  },
  {
    "question": "Étape 2 : Livraison Continue (CD)",
    "answer": "1. Déployer en staging\n2. Tests E2E/Smoke\n3. Approbation manuelle/auto\n4. Rollout prod (canary/blue-green)"
  },
  {
    "question": "Exemple de pipeline (GitHub Actions)",
    "answer": "name: CI/CD\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install && npm test"
  },
  {
    "question": "Outils clés",
    "answer": "CI : Jenkins, GitHub Actions, GitLab CI\nCD : ArgoCD, Spinnaker, Flux\nMonitoring : Prometheus, Datadog"
  },
  {
    "question": "Validation - Objectif global",
    "answer": "S'assurer que la release est stable et répond aux exigences avant la prod"
  },
  {
    "question": "Étape 1 : Environnement de staging",
    "answer": "1. Copie conforme de la prod (data, configs)\n2. Déploiement de la nouvelle version\n3. Tests automatisés (E2E, performance)"
  },
  {
    "question": "Étape 2 : Tests Manuels",
    "answer": "1. Checklist UX/UI\n2. Scénarios métier critiques\n3. Tests cross-devices/browsers"
  },
  {
    "question": "Étape 3 : Revue et Approbation",
    "answer": "1. Analyse métriques (erreurs, perf)\n2. Validation PO/QA\n3. Go/No-Go meeting"
  },
  {
    "question": "Techniques de déploiement safe",
    "answer": "1. Feature flags\n2. Déploiement canari (5% des users)\n3. Rollback automatique si échec"
  },
  {
  "question": "Tableau : Rôles des 3 processus",
  "answer": "| Process           | Phase          | Outils Type       | Responsable      |\n|-------------------|----------------|-------------------|------------------|\n| Tests Unitaires   | Développement  | Jest, JUnit       | Devs             |\n| CI/CD            | Intégration    | Jenkins, GitHub   | DevOps           |\n| Validation Prod  | Pré-Prod       | Selenium, Datadog | QA/PO            |"
},

  
];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
    {
      "question": "Qu'est-ce qu'un produit structuré à capital garanti ?",
      "options": [
          "Un produit qui promet des rendements élevés sans risque",
          "Un produit qui protège tout ou partie du capital investi",
          "Un produit réservé aux investisseurs institutionnels",
          "Un produit sans aucune protection du capital"
      ],
      "answer": "Un produit qui protège tout ou partie du capital investi",
      "explanation": "Les produits à capital garanti combinent généralement une obligation (pour la protection) et des dérivés (pour le potentiel de rendement)."
  },
  {
      "question": "Quel type de produit structuré peut se rembourser automatiquement si un seuil est atteint ?",
      "options": [
          "Un Phoenix",
          "Un Autocallable",
          "Un Reverse Convertible",
          "Un produit à effet de levier"
      ],
      "answer": "Un Autocallable",
      "explanation": "Les autocallables prévoient un remboursement anticipé si le sous-jacent atteint un certain niveau, avec souvent un coupon bonus."
  },
  {
      "question": "Quel est le principal risque d'un Barrier Reverse Convertible ?",
      "options": [
          "Risque de change",
          "Risque de conversion en actions si la barrière est touchée",
          "Risque de taux d'intérêt",
          "Risque de liquidité nul"
      ],
      "answer": "Risque de conversion en actions si la barrière est touchée",
      "explanation": "Si le sous-jacent franchit la barrière de baisse, l'investisseur peut recevoir des actions au lieu du remboursement en cash."
  },
  {
      "question": "Quel avantage principal offrent les notes hybrides multi-actifs ?",
      "options": [
          "Rendements garantis",
          "Exposition à une seule classe d'actifs",
          "Diversification sur plusieurs classes d'actifs",
          "Protection totale contre l'inflation"
      ],
      "answer": "Diversification sur plusieurs classes d'actifs",
      "explanation": "Elles permettent de répartir le risque sur différents marchés (actions, obligations, matières premières...)."
  },
  {
      "question": "Pourquoi les produits liés à des indices propriétaires sont-ils risqués ?",
      "options": [
          "Parce qu'ils sont toujours à effet de levier",
          "À cause du manque de transparence et du risque de liquidation",
          "Car ils ne comportent aucune protection du capital",
          "Parce qu'ils sont impossibles à vendre avant échéance"
      ],
      "answer": "À cause du manque de transparence et du risque de liquidation",
      "explanation": "Les indices propriétaires sont créés par les émetteurs, avec des méthodologies parfois opaques, et peuvent être liquidés."
  },
  {
      "question": "Quel élément n'est PAS un avantage des produits structurés ?",
      "options": [
          "Personnalisation des profils risque/rendement",
          "Protection (totale ou partielle) du capital",
          "Frais de gestion généralement très bas",
          "Accès à des stratégies complexes"
      ],
      "answer": "Frais de gestion généralement très bas",
      "explanation": "Les produits structurés ont souvent des frais élevés dus à leur complexité et aux coûts des dérivés intégrés."
  },
  {
      "question": "Quel mécanisme permet aux produits à effet de levier d'amplifier les performances ?",
      "options": [
          "La réplication synthétique via des options",
          "L'investissement direct en actions",
          "La diversification géographique",
          "La protection du capital garantie"
      ],
      "answer": "La réplication synthétique via des options",
      "explanation": "Les produits à levier utilisent des dérivés (options, futures) pour multiplier l'exposition au sous-jacent."
  },
  {
      "question": "Quel est le risque principal pour un investisseur dans un produit à capital conditionnel (partiellement protégé) ?",
      "options": [
          "Perte totale du capital",
          "Perte partielle du capital en cas de marché défavorable",
          "Risque de change important",
          "Impossibilité de revendre le produit"
      ],
      "answer": "Perte partielle du capital en cas de marché défavorable",
      "explanation": "La protection n'étant que partielle (ex: 90%), l'investisseur peut subir des pertes limitées."
  }
  ],
  avance: [
    {
      "question": "Quelle formule décrit le payoff d'un produit à capital garanti (avec participation partielle au marché) ?",
      "options": [
          "Payoff = Capital initial × (1 + Max(0, α × (S_T/S_0 - 1)))",
          "Payoff = Capital initial × (1 + Rendement fixe)",
          "Payoff = Max(0, S_T - Strike)",
          "Payoff = Capital initial × (S_T/S_0)"
      ],
      "answer": "Payoff = Capital initial × (1 + Max(0, α × (S_T/S_0 - 1)))",
      "explanation": "α = taux de participation (ex: 80%), S_T = valeur sous-jacent à maturité. Formule typique avec protection du capital + participation partielle à la hausse."
  },
  {
      "question": "Comment calcule-t-on le coupon conditionnel d'un Autocallable si le sous-jacent est au-dessus de la barrière à la date d'observation ?",
      "options": [
          "Coupon = 0%",
          "Coupon = Taux fixe prédéfini",
          "Coupon = Max(0, (S_T - Strike)/Strike)",
          "Coupon = Taux variable × Nombre de dates déclenchées"
      ],
      "answer": "Coupon = Taux fixe prédéfini",
      "explanation": "Les Autocallables versent un coupon fixe si le sous-jacent est égal ou supérieur au niveau de barrière à la date d'observation."
  },
  {
      "question": "Quelle formule correspond au payoff d'un Reverse Convertible avec barrière ? (Knock-in à 70%)",
      "options": [
          "Si S_T ≥ Barrière : Payoff = Capital + Coupon | Sinon : Payoff = Nombre d'actions × S_T",
          "Si S_T ≥ Strike : Payoff = Capital × (1 + Coupon) | Sinon : Capital × (1 - (Strike - S_T)/Strike)",
          "Payoff = Capital × (1 + β × (S_T/S_0)) où β = levier",
          "Payoff = Min(Capital, Nombre d'actions × S_T)"
      ],
      "answer": "Si S_T ≥ Barrière : Payoff = Capital + Coupon | Sinon : Payoff = Nombre d'actions × S_T",
      "explanation": "Si la barrière n'est pas touchée, l'investisseur récupère capital + coupon. Sinon, il reçoit des actions (risque de perte en capital)."
  },
  {
      "question": "Comment est déterminé le payoff final d'un produit Phoenix (avec barrière à 60%) ?",
      "options": [
          "Payoff = Capital initial + Σ Coupons annuels tant que S_t > Barrière",
          "Payoff = Capital × (1 + Performance moyenne annuelle)",
          "Payoff = Max(0, S_T - Barrière)",
          "Payoff = Capital × (Nombre de dates où S_t > Barrière / Total dates)"
      ],
      "answer": "Payoff = Capital initial + Σ Coupons annuels tant que S_t > Barrière",
      "explanation": "Les Phoenix versent des coupons annuels si le sous-jacent reste au-dessus de la barrière. Le capital est remboursé à échéance (sauf événement de crédit)."
  },
  {
      "question": "Quelle est la formule de calcul du taux de participation (α) dans un produit à capital garanti ?",
      "options": [
          "α = (Coût de la protection du capital) / (Prime de l'option call)",
          "α = (Performance du sous-jacent) / (Taux sans risque)",
          "α = (Valeur du coupon) × (Nombre d'années)",
          "α = (Strike - S_0) / S_0"
      ],
      "answer": "α = (Coût de la protection du capital) / (Prime de l'option call)",
      "explanation": "Le taux de participation dépend du coût de la protection (obligation zéro-coupon) et du budget restant pour acheter des options."
  },
  {
      "question": "Comment calculer la valeur intrinsèque d'un certificat à effet de levier 2x à échéance ?",
      "options": [
          "Valeur = 2 × (S_T - S_0)",
          "Valeur = S_0 + 2 × (S_T - S_0)",
          "Valeur = Max(0, 2 × (S_T - Strike))",
          "Valeur = S_T × 2"
      ],
      "answer": "Valeur = S_0 + 2 × (S_T - S_0)",
      "explanation": "Un levier 2x amplifie la performance (positive ou négative) du sous-jacent. Formule : Prix d'émission + (2 × Variation du sous-jacent)."
  },
  {
      "question": "Quelle formule décrit le pire scénario pour un investisseur en produit à capital conditionnel (protection à 90%) ?",
      "options": [
          "Perte max = 0%",
          "Perte max = 10%",
          "Perte max = (1 - (S_T/S_0)) × 100%",
          "Perte max = 100%"
      ],
      "answer": "Perte max = 10%",
      "explanation": "Avec une protection à 90%, la perte maximale est limitée à 10% du capital investi, même si le sous-jacent chute de 50%."
  },
  {
      "question": "Si un indice propriétaire perd 20% et que le produit structuré a un plancher à -15%, quel est le payoff ?",
      "options": [
          "Payoff = Capital × (1 - 20%)",
          "Payoff = Capital × (1 - 15%)",
          "Payoff = Capital × (1 + 0%)",
          "Payoff = Capital × (1 - Max(15%, 20%))"
      ],
      "answer": "Payoff = Capital × (1 - 15%)",
      "explanation": "Le plancher limite la perte à -15%. Même si l'indice baisse de 20%, l'investisseur ne perd que 15%."
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


export default Page4;