// src/projects/Project3/pages/Page7.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "xUnit vs NUnit — Frameworks de tests unitaires",
    "answer": "**xUnit** : Standard Microsoft .NET moderne. Setup via constructeur, teardown via `IDisposable.Dispose()`. Attributs : `[Fact]` (test simple), `[Theory]` + `[InlineData]` (paramétré). Cmd : `dotnet test`. ◆ **NUnit** : Plus ancien. Attributs : `[SetUp]`, `[TearDown]`, `[Test]`, `[TestCase(val)]`. Compatible .NET & Mono."
  },
  {
    "question": "Moq — Mocking & Isolation de dépendances",
    "answer": "**Moq** : Librairie de mocking C# la plus répandue. `new Mock<ITradeService>()` crée le mock. ◆ `.Setup(x => x.Price(trade)).Returns(100m)` configure le retour simulé. ◆ `.Verify(x => x.Save(trade), Times.Once())` vérifie que la méthode a été appelée exactement 1 fois. ◆ **NSubstitute** : Alternative plus concise. `Substitute.For<ITradeRepository>()`."
  },
  {
    "question": "FluentAssertions — Assertions lisibles",
    "answer": "**FluentAssertions** : Librairie qui remplace les `Assert.AreEqual` verbeux par du langage naturel. ◆ `result.Should().Be(100m)` — égalité. ◆ `list.Should().HaveCount(3).And.Contain(trade)` — collection. ◆ `action.Should().Throw<InvalidOperationException>()` — exception. ◆ `dto.Should().BeEquivalentTo(expected)` — comparaison profonde d'objets."
  },
  {
    "question": "Cycle TDD — Red / Green / Refactor",
    "answer": "**Red** : Écrire un test qui échoue (la feature n'existe pas encore). But : définir le comportement attendu. ◆ **Green** : Écrire le code minimal pour faire passer le test. Pas d'optimisation. ◆ **Refactor** : Nettoyer et améliorer le code sans casser le test. Le test est le filet de sécurité."
  },
  {
    "question": "Tests d'Intégration — WebApplicationFactory",
    "answer": "**Package** : `Microsoft.AspNetCore.Mvc.Testing`. ◆ **WebApplicationFactory<Program>** : Lance toute l'application ASP.NET Core en mémoire (DI, middleware, routes). ◆ Crée un `HttpClient` de test pour appeler les endpoints réels sans déploiement. ◆ Remplacer la BDD réelle par `UseInMemoryDatabase` pour l'isolation."
  },
  {
    "question": "Tests de Non-Régression — Snapshot & Contract Tests",
    "answer": "**Non-régression** : Valider qu'un changement de code ne casse pas un comportement existant. Tout le pipeline CI doit passer avant un merge. ◆ **Snapshot Testing** : Capture le résultat JSON d'un calcul ou d'une API. Échoue si le résultat change. Librairie : *Verify* (C#). ◆ **Contract Testing** : Valide le contrat entre un consommateur et un producteur d'API. Librairie : *Pact.Net*."
  },
  {
    "question": "Tests E2E (End-to-End) — Playwright & Selenium",
    "answer": "**Playwright** : Outil Microsoft moderne pour tests E2E UI (browser automation). Supporte Chromium, Firefox, WebKit. ◆ `dotnet add package Microsoft.Playwright` puis `playwright install`. ◆ Simule un utilisateur réel : clic, saisie, navigation, assertion sur le DOM. ◆ **Selenium** : Outil classique E2E. Plus verbeux mais très répandu en environnement bancaire legacy."
  },
  {
    "question": "Tests de Performance & Charge — BenchmarkDotNet & k6",
    "answer": "**BenchmarkDotNet** : Mesure la performance de méthodes C# avec précision (nanosecondes). Attribut `[Benchmark]`. `dotnet run -c Release`. ◆ **k6** : Outil open-source de tests de charge HTTP (simule N utilisateurs virtuels, mesure latence p95/p99). ◆ **JMeter** : Alternative Java très répandue en environnement bancaire pour les tests de charge."
  },
  {
    "question": "Couverture de code & Pipeline CI — dotnet-coverage",
    "answer": "**dotnet test --collect:\"XPlat Code Coverage\"** : Génère un rapport de couverture XML. ◆ **ReportGenerator** : Convertit le XML en HTML lisible. `dotnet tool install -g dotnet-reportgenerator-globaltool`. ◆ **Seuil minimal** : Bloquer le pipeline CI/CD si la couverture descend en dessous de 80%. ◆ **CI GitHub Actions** : `dotnet test` + upload rapport dans le workflow YAML."
  }
];

const questions = {
  moyen: [
    {
      "question": "En xUnit, quel attribut permet de passer plusieurs jeux de données à un même test ?",
      "options": ["[Fact]", "[Test]", "[Theory] + [InlineData]", "[TestCase]"],
      "answer": "[Theory] + [InlineData]",
      "explanation": "[Fact] = test sans paramètre. [Theory] + [InlineData(val1, val2)] = test paramétré qui s'exécute autant de fois qu'il y a de jeux de données."
    },
    {
      "question": "Quelle librairie Moq utilise-t-on pour vérifier qu'une méthode a été appelée exactement une fois ?",
      "options": [
        "mock.Assert(Times.Once())",
        "mock.Verify(x => x.Method(), Times.Once())",
        "mock.Check(x => x.Method()).Called(1)",
        "mock.Setup(Times.Once()).Returns()"
      ],
      "answer": "mock.Verify(x => x.Method(), Times.Once())",
      "explanation": "Moq utilise .Verify() pour les assertions comportementales : vérifier si une méthode a été appelée, combien de fois, et avec quels arguments."
    },
    {
      "question": "Quelle est la différence entre un test unitaire et un test d'intégration ?",
      "options": [
        "Un test unitaire teste l'UI, un test d'intégration teste la DB.",
        "Un test unitaire isole un seul composant (avec mocks), un test d'intégration teste plusieurs composants réels ensemble (DB, API, DI).",
        "Il n'y a pas de différence, les deux utilisent xUnit.",
        "Un test d'intégration s'exécute plus vite car il utilise moins de mocks."
      ],
      "answer": "Un test unitaire isole un seul composant (avec mocks), un test d'intégration teste plusieurs composants réels ensemble (DB, API, DI).",
      "explanation": "Les tests unitaires sont rapides et isolés. Les tests d'intégration sont plus lents mais testent les vraies interactions entre couches (ex: EF Core + SQL Server)."
    }
  ],
  avance: [
    {
      "question": "Comment xUnit gère-t-il le teardown (nettoyage) après chaque test, contrairement à NUnit ?",
      "options": [
        "Via une méthode marquée [TearDown].",
        "Via IDisposable.Dispose() — xUnit appelle Dispose() automatiquement après chaque test.",
        "Via un destructeur C# (~ClassName()).",
        "Via un appel manuel à GC.Collect() à la fin du test."
      ],
      "answer": "Via IDisposable.Dispose() — xUnit appelle Dispose() automatiquement après chaque test.",
      "explanation": "xUnit exploite les patterns C# natifs : constructeur = Setup, Dispose() = Teardown. NUnit utilise des attributs [SetUp]/[TearDown] qui sont moins idiomatiques."
    },
    {
      "question": "Quelle est la meilleure stratégie pour tester la couche contrôleur d'une API ASP.NET Core sans démarrer un vrai serveur HTTP ?",
      "options": [
        "Utiliser HttpClient avec l'URL de production.",
        "Utiliser WebApplicationFactory<Program> pour créer un serveur en mémoire et un HttpClient de test.",
        "Appeler directement les méthodes du contrôleur sans passer par HTTP.",
        "Utiliser Postman en mode automatisé."
      ],
      "answer": "Utiliser WebApplicationFactory<Program> pour créer un serveur en mémoire et un HttpClient de test.",
      "explanation": "WebApplicationFactory lance toute la stack ASP.NET Core (DI, middleware, routing) en mémoire. On peut remplacer les services réels (DB) par des mocks via builder.ConfigureTestServices()."
    }
  ]
};

const renderFormattedText = (text) => {
  if (!text) return null;
  let cleanText = text
    .replace(/\r?\n- /g, " ◆ ")
    .replace(/\r?\n• /g, " ◆ ")
    .replace(/\r?\n/g, " ")
    .replace(/\.-\s*\*\*/g, " ◆ **")
    .replace(/-\s*\*\*/g, " ◆ **");

  if (cleanText.startsWith(" ◆ ")) cleanText = cleanText.substring(3);
  if (cleanText.startsWith("- ")) cleanText = cleanText.substring(2);

  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = cleanText.split(regex);

  return (
    <span style={{ display: 'inline', lineHeight: '1.5' }}>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={idx} style={{ 
              display: 'inline', 
              backgroundColor: '#eef2f7', 
              padding: '1px 5px', 
              borderRadius: '3px', 
              fontFamily: 'monospace', 
              color: '#e01e5a', 
              fontWeight: 'bold', 
              fontSize: '13px' 
            }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={idx} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </span>
  );
};

const Timer = ({ timeLeft }) => <p className="timer">⏳ <span>{timeLeft}s</span></p>;

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {String.fromCharCode(65 + index)}. {option}
        </button>
      ))}
    </div>
  </div>
);

const Flashcard = ({ slide }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a73e8', margin: '0 0 10px 0' }}>{slide.question}</p>
    <div style={{ padding: '12px 15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1a73e8', textAlign: 'left' }}>
      {renderFormattedText(slide.answer)}
    </div>
  </div>
);

const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen} | ✅ Avancé : {scores.avance}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6) ? <h3 className="success">🚀 Excellent ! Tests et outils maîtrisés.</h3> : <p className="fail">📚 Révisez les frameworks de test.</p>}
    </div>
  );
};

const Page7 = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") { setLevel("avance"); } else { setShowResult(true); }
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen"); setCurrentQuestion(0); setTimeLeft(25); return 0;
        });
      }, 12000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
    const current = questions[level][currentQuestion];
    if (option === current.answer) { setScores(p => ({ ...p, [level]: p[level] + 1 })); setMessage("✅ Correct !"); }
    else { setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`); }
    setTimeout(handleNextQuestion, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            C# Tests & Outils 🔹 {level === "basic" ? `Slide ${currentSlide + 1}/${basicSlides.length}` : `QCM ${level.toUpperCase()}`}
          </h4>
          {level === "basic" ? <Flashcard slide={basicSlides[currentSlide]} /> : (
            <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Page7;
