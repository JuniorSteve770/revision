// src/projects/Project1/pages/Page2.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "Qu'est-ce qu'une classe et à quoi servent ses attributs ?",
    "answer": "**Classe** = modèle. Elle contient des **attributs** (ex. : nom, âge) qui stockent les **données internes** d’un objet."
  },
  {
    "question": "Quel est le rôle des méthodes et comment agissent-elles dans une classe ?",
    "answer": "**Méthodes** = actions. Elles permettent à l’objet de **faire des opérations** (ex. : afficher(), calculer())."
  },
  {
    "question": "Comment une classe peut être utilisée dans une autre ? Qu’est-ce que la composition ?",
    "answer": "**Réutilisation** : via **héritage**, **appel direct** si `public`, ou **composition** (ex. : `Voiture` a un `Moteur`)."
  },
  {
    "question": "Qu’est-ce que l’héritage et la composition en POO ?",
    "answer": "**Héritage** = classe enfant reprend le contenu de la classe parente. **Composition** = classe contient un **objet d’une autre**."
  },
  {
    "question": "Comment modifier les données d’un objet ? Et à quoi sert un setter ?",
    "answer": "On utilise un **setter** (ex. : `setNom(\"Pierre\")`) pour **changer un attribut** tout en gardant le contrôle (encapsulation)."
  },
  {
    "question": "Comment créer un objet à partir d’une classe ?",
    "answer": "On utilise `new` ➜ Ex. : `Compte c = new Compte();` ➜ **Objet = instance** concrète de la classe."
  },
  {
    "question": "Quelles sont les règles de visibilité d’un attribut ou d’une méthode ?",
    "answer": "`public` = partout, `private` = classe seule, `protected` = classe + enfants. ➜ Contrôle de l’**accès**."
  },
  {
    "question": "Quelle est la différence entre une classe et un objet ?",
    "answer": "**Classe** = plan général. **Objet** = version réelle construite à partir de ce plan."
  },
  {
    "question": "Peut-on modifier tout dans une classe ? Que signifient private et final ?",
    "answer": "**Tout est modifiable**, sauf si bloqué par `private` (pas visible) ou `final` (non modifiable)."
  },
  {
    "question": "Pourquoi ce modèle est utile pour un trader ?",
    "answer": "**Classe/objet** = comme un **produit structuré** : un modèle commun, avec des données (prix, échéance) et des fonctions (payoff, calculs)."
  },
  
  {
    "question": "1. Quels sont les 4 piliers de la POO et que représente l'encapsulation ?",
    "answer": "Les 4 piliers sont : Encapsulation, Héritage, Polymorphisme, Abstraction. L'encapsulation protège les attributs via des modificateurs d'accès (private, protected...) et expose uniquement les méthodes nécessaires."
  },
  {
    "question": "2. Quels sont les modificateurs d’accès en POO et comment les utiliser ? Donne un exemple d'encapsulation.",
    "answer": "Modificateurs : private (classe), protected (classe + enfants), public (partout), internal (même module). Exemple : une classe Compte avec solde privé et méthodes Deposer/GetSolde."
  },
  {
    "question": "3. Qu'est-ce que l’héritage en POO et quels en sont les différents types ?",
    "answer": "L’héritage permet à une classe d’hériter d’une autre (réutilisation). Types : simple (1 parent), multiple (C++), hiérarchique (1 parent, plusieurs enfants), multilevel (chaîné)."
  },
  {
    "question": "4. Donne un exemple d’héritage en C# et explique l’intérêt du mécanisme.",
    "answer": "Exemple : `class Etudiant : Personne {}` hérite des propriétés de Personne. Intérêt : réutilisation de code, logique hiérarchique (Est-un)."
  },
  {
    "question": "5. Qu’est-ce que le polymorphisme et quels en sont les types principaux ?",
    "answer": "Polymorphisme = même méthode pour différents objets. Types : surcharge (signatures différentes), redéfinition (override), substitution (objet enfant via type parent)."
  },
  {
    "question": "6. Donne un exemple de polymorphisme (override) et pourquoi c’est important en architecture ?",
    "answer": "Exemple : `class Chien : Animal` redéfinit `Crier()`. Utilité : code générique, extensible, favorise l'ouverture/fermeture (principe SOLID)."
  },
  {
    "question": "7. Qu’est-ce que l’abstraction en POO et quelle est la différence entre interface et classe abstraite ?",
    "answer": "Abstraction = cacher l’implémentation, montrer l’essentiel. Interface = contrat sans code, Classe abstraite = peut contenir du code. On hérite d’une seule classe abstraite mais on implémente plusieurs interfaces."
  },
  {
    "question": "8. Donne un exemple d’abstraction en C# via une interface, et une comparaison concrète.",
    "answer": "Exemple : `IAnimal` avec méthode `Crier()`, implémentée dans `Chat`. Métaphore : interface = contrat, classe abstraite = modèle partiel. L’abstraction simplifie les interactions."
  },
  {
    "question": "9. Quelles métaphores résument les 4 piliers de la POO et comment les mémoriser ?",
    "answer": "Encapsulation = coffre-fort, Héritage = arbre généalogique, Polymorphisme = caméléon, Abstraction = contrat. Ces images facilitent la compréhension des concepts."
  },
   {
    "question": "1. Que signifie le principe S de SOLID (Single Responsibility) et pourquoi est-il crucial ?",
    "answer": "S = Single Responsibility Principle : une classe = une seule responsabilité (rôle unique). But : éviter les classes 'fourre-tout', faciliter la maintenance/test."
  },
  {
    "question": "2. Donne un exemple du principe SRP et compare avec une mauvaise pratique.",
    "answer": "✅ Classe Facture : calcule le total. ❌ Elle ne doit pas aussi imprimer ou sauvegarder. Séparer en : Facture, FacturePrinter, FactureRepository."
  },
  {
    "question": "3. Que signifie le principe O de SOLID (Open/Closed) et comment l'appliquer ?",
    "answer": "O = Open/Closed Principle : une entité doit être ouverte à l’extension, fermée à la modification. But : ne pas casser l’existant lors de l'ajout de fonctionnalités."
  },
  {
    "question": "4. Donne un exemple du principe OCP avec stratégie d’extension.",
    "answer": "Ex : une méthode `CalculerSalaire()` qui dépend d’un type d’employé → préférer une classe abstraite et dériver par type (CDI, CDD) sans modifier le code de base."
  },
  {
    "question": "5. Que signifie le principe L (Liskov Substitution) et que garantit-il ?",
    "answer": "L = Liskov Substitution Principle : une sous-classe doit pouvoir remplacer sa classe mère sans perturber le programme. C’est une garantie de substituabilité."
  },
  {
    "question": "6. Donne un exemple du LSP et une violation typique.",
    "answer": "❌ Rectangle r = new Carré() → setter Hauteur/Largeur casse la logique. ✅ Carré et Rectangle doivent être séparés si comportements différents."
  },
  {
    "question": "7. Que signifie le principe I (Interface Segregation) et pourquoi éviter les interfaces trop larges ?",
    "answer": "I = Interface Segregation Principle : préférer plusieurs interfaces spécifiques plutôt qu’une seule grosse. Évite aux classes d’implémenter ce qu’elles n’utilisent pas."
  },
  {
    "question": "8. Donne un exemple de séparation d’interface (ISP).",
    "answer": "❌ Interface `IEmployé` avec `Travailler()` et `Manager()` → tous les employés n’encadrent pas. ✅ Créer `ITravailleur` et `IManager`."
  },
  {
    "question": "9. Que signifie le principe D (Dependency Inversion) et comment l’appliquer ?",
    "answer": "D = Dependency Inversion Principle : dépendre d’abstractions, pas de classes concrètes. Utiliser des interfaces + injection de dépendance pour plus de flexibilité/testabilité."
  },
   {
    "question": "1. Que sont les Design Patterns et quelle différence entre création et structure ?",
    "answer": "Les Design Patterns sont des solutions réutilisables à des problèmes de conception. Création (ex : Singleton, Factory) gèrent l’instanciation ; Structure (ex : Adapter, Composite) organisent les relations entre classes."
  },
  {
    "question": "2. Qu’est-ce que le Singleton et quand l’utiliser ? Donne un exemple.",
    "answer": "Singleton = instance unique, accessible globalement (logs, config, DB). Exemple C# : `public static Logger Instance => instance ??= new Logger();`"
  },
  {
    "question": "3. Qu’est-ce que le Factory Method et pourquoi l’utiliser ? Donne un exemple.",
    "answer": "Factory = encapsule la création d’objets selon un type. Ex : `IAnimal Creer(string type) => type == \"chien\" ? new Chien() : new Chat();`"
  },
  {
    "question": "4. Qu’est-ce que le Builder Pattern et dans quel cas est-il utile ? Donne un exemple.",
    "answer": "Builder = construit un objet complexe étape par étape (objets immuables). Exemple : `new PizzaBuilder().WithSauce().WithFromage().Build();`"
  },
  {
    "question": "5. Qu’est-ce que le pattern Adapter ? À quoi sert-il ? Donne un exemple.",
    "answer": "Adapter = rend compatible deux interfaces différentes (ex : API externe). Il adapte une classe existante sans la modifier. Implémente une interface cible en encapsulant l’objet source."
  },
  {
    "question": "6. Qu’est-ce que le Composite Pattern et quand l’utiliser ? Donne un exemple.",
    "answer": "Composite = traite objets simples et composites de façon uniforme (ex : Fichiers/Dossiers). Interface commune `INode`, utilisée par Fichier et Dossier récursivement."
  },
  {
    "question": "7. Qu’est-ce que le Strategy Pattern et pourquoi est-il utile ? Donne un exemple en C#.",
    "answer": "Strategy = change dynamiquement l’algorithme utilisé (flexibilité comportementale). Ex : `class Gestionnaire { ITri algo; void Executer() => algo.Trier(liste); }`"
  },
  {
    "question": "8. Qu’est-ce que le pattern Observer et comment l’implémente-t-on en C# ?",
    "answer": "Observer = sujet notifie automatiquement ses abonnés (UI, événements). C# : via `event`/`delegate`, ou `Notify()` sur une liste d’observateurs."
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
{
    "question": "Quel principe de la POO permet de protéger les données internes d’un objet ?",
    "options": [
      "Héritage",
      "Encapsulation",
      "Abstraction",
      "Polymorphisme"
    ],
    "answer": "Encapsulation",
    "explanation": "L'encapsulation masque les données via des modificateurs d'accès (private, protected...) et permet un accès contrôlé via des méthodes publiques."
  },
  {
    "question": "Quel modificateur d’accès permet de rendre un attribut visible uniquement au sein de sa classe en C# ?",
    "options": [
      "public",
      "protected",
      "internal",
      "private"
    ],
    "answer": "private",
    "explanation": "`private` restreint l'accès à l’attribut à l’intérieur de la classe uniquement, ce qui garantit l’encapsulation."
  },
  {
    "question": "Quel principe SOLID impose qu’une classe ait une seule et unique responsabilité ?",
    "options": [
      "Open/Closed Principle",
      "Single Responsibility Principle",
      "Interface Segregation Principle",
      "Dependency Inversion Principle"
    ],
    "answer": "Single Responsibility Principle",
    "explanation": "Le SRP stipule qu’une classe ne doit avoir qu’une seule raison de changer, ce qui améliore lisibilité, testabilité et maintenance."
  },
  {
    "question": "Quelle option illustre une violation du principe Liskov Substitution ?",
    "options": [
      "Utiliser une interface pour injecter un service",
      "Utiliser une classe Carré qui hérite de Rectangle",
      "Utiliser plusieurs interfaces spécifiques pour chaque type d’employé",
      "Utiliser une fabrique abstraite pour créer des objets"
    ],
    "answer": "Utiliser une classe Carré qui hérite de Rectangle",
    "explanation": "Le Carré ne respecte pas la logique du Rectangle avec hauteur ≠ largeur, ce qui casse la substituabilité attendue (violation du LSP)."
  },
  {
    "question": "Pourquoi le pattern Strategy est-il préféré face à un long bloc conditionnel `if`/`switch` ?",
    "options": [
      "Il permet d’écrire moins de lignes",
      "Il permet de réutiliser les conditions",
      "Il permet de séparer les algorithmes et de les interchanger dynamiquement",
      "Il remplace complètement les classes abstraites"
    ],
    "answer": "Il permet de séparer les algorithmes et de les interchanger dynamiquement",
    "explanation": "Le Strategy pattern encapsule les comportements dans des classes dédiées, permettant de les modifier à l'exécution sans toucher au reste du code."
  },
  {
    "question": "Quel Design Pattern garantit qu'une classe a une seule instance accessible globalement ?",
    "options": [
      "Factory Method",
      "Adapter",
      "Singleton",
      "Observer"
    ],
    "answer": "Singleton",
    "explanation": "Le Singleton contrôle la création d'une instance unique et fournit un point d’accès global — souvent utilisé pour des logs ou la configuration."
  },
  {
    "question": "Quel patron est utilisé pour rendre compatible une classe avec une interface qu'elle ne respecte pas nativement ?",
    "options": [
      "Observer",
      "Composite",
      "Adapter",
      "Strategy"
    ],
    "answer": "Adapter",
    "explanation": "L’Adapter sert de pont entre une classe existante et une interface cible — il convertit l’interface d’un composant externe ou ancien."
  },
  {
    "question": "Quel principe SOLID recommande de dépendre d’interfaces plutôt que de classes concrètes ?",
    "options": [
      "Open/Closed",
      "Dependency Inversion",
      "Interface Segregation",
      "Single Responsibility"
    ],
    "answer": "Dependency Inversion",
    "explanation": "La DIP impose que les classes haut niveau ne dépendent que d’abstractions (interfaces), ce qui rend le code plus testable et flexible."
  },
  {
    "question": "Quel Design Pattern permet de composer une arborescence d’objets manipulés uniformément ?",
    "options": [
      "Builder",
      "Composite",
      "Factory",
      "Singleton"
    ],
    "answer": "Composite",
    "explanation": "Le Composite Pattern permet de traiter de manière uniforme des objets simples et composés dans une structure arborescente, comme des fichiers ou des menus."
  },
  {
    "question": "Quelle combinaison décrit correctement la différence entre interface et classe abstraite ?",
    "options": [
      "Interface = implémentation partielle / Classe abstraite = 100% abstraite",
      "Interface = héritage simple / Classe abstraite = multiple",
      "Interface = contrat pur / Classe abstraite = peut contenir du code",
      "Interface = compile plus vite / Classe abstraite = runtime"
    ],
    "answer": "Interface = contrat pur / Classe abstraite = peut contenir du code",
    "explanation": "Une interface est un contrat sans implémentation, tandis qu’une classe abstraite peut définir une structure partielle avec code et membres abstraits."
  }
  ],
  avance: [
    {
    "question": "Quel est l'effet de ce code sur la variable `solde` ?\n```csharp\nclass Compte {\n    private double solde = 100;\n    public void Retirer(double montant) {\n        solde -= montant;\n    }\n}\nCompte c = new Compte();\nc.Retirer(50);\nConsole.WriteLine(c.solde);\n```",
    "options": [
      "Affiche 50",
      "Erreur de compilation",
      "Affiche 100",
      "Affiche 0"
    ],
    "answer": "Erreur de compilation",
    "explanation": "L’attribut `solde` est `private`, donc inaccessible directement depuis `Main`. Il faut un getter ou une méthode publique pour y accéder."
  },
  {
    "question": "Quel sera l’affichage de ce code ?\n```csharp\nclass Animal {\n    public virtual void Parler() => Console.Write(\"Animal\");\n}\nclass Chat : Animal {\n    public override void Parler() => Console.Write(\"Miaou\");\n}\nAnimal a = new Chat();\na.Parler();\n```",
    "options": [
      "Animal",
      "Miaou",
      "Erreur",
      "AnimalMiaou"
    ],
    "answer": "Miaou",
    "explanation": "Le polymorphisme permet à l’objet `a` de se comporter comme un `Chat`, donc la méthode override est appelée."
  },
  {
    "question": "Ce code respecte-t-il l'encapsulation ?\n```csharp\nclass Personne {\n    public string nom;\n    public int age;\n}\n```",
    "options": [
      "Oui, car les attributs sont publics",
      "Non, car les données sont exposées directement",
      "Oui, car la classe est simple",
      "Non, car il manque un constructeur"
    ],
    "answer": "Non, car les données sont exposées directement",
    "explanation": "L'encapsulation impose que les attributs soient privés et accessibles via des méthodes publiques (getters/setters)."
  },
  {
    "question": "Quel sera le résultat de ce code ?\n```csharp\nabstract class Vehicule {\n    public abstract void Demarrer();\n}\nclass Voiture : Vehicule {\n    public override void Demarrer() {\n        Console.WriteLine(\"Vroum\");\n    }\n}\nVehicule v = new Voiture();\nv.Demarrer();\n```",
    "options": [
      "Erreur car Vehicule est abstrait",
      "Affiche Vroum",
      "Erreur car Voiture ne peut pas hériter",
      "Affiche rien"
    ],
    "answer": "Affiche Vroum",
    "explanation": "La classe abstraite permet une implémentation obligatoire dans les classes dérivées. `Voiture` fournit l’implémentation de `Demarrer()`."
  },
  {
    "question": "Que permet ce code ?\n```csharp\ninterface ICalcul {\n    int Executer(int x, int y);\n}\nclass Addition : ICalcul {\n    public int Executer(int x, int y) => x + y;\n}\n```",
    "options": [
      "D’utiliser l’héritage multiple",
      "De créer une classe abstraite",
      "D’appliquer l’abstraction via une interface",
      "D'utiliser l'encapsulation"
    ],
    "answer": "D’appliquer l’abstraction via une interface",
    "explanation": "L’interface `ICalcul` définit un contrat. `Addition` fournit l’implémentation. C’est un exemple d’abstraction."
  },
  {
    "question": "Quel type d’héritage ce code représente-t-il ?\n```csharp\nclass Employe {}\nclass Manager : Employe {}\nclass Directeur : Manager {}\n```",
    "options": [
      "Héritage multiple",
      "Héritage hiérarchique",
      "Héritage simple",
      "Héritage multilevel (en chaîne)"
    ],
    "answer": "Héritage multilevel (en chaîne)",
    "explanation": "Chaque classe hérite d’une seule autre classe dans une chaîne (Employe → Manager → Directeur), ce qui est un héritage en cascade."
  },
  // SOLID (avec code)
  {
    "question": "Ce code respecte-t-il le principe de responsabilité unique (SRP) ?\n```csharp\nclass Rapport {\n    public void Generer() { /* création PDF */ }\n    public void Imprimer() { /* impression */ }\n    public void EnvoyerMail() { /* envoi par email */ }\n}\n```",
    "options": [
      "Oui, chaque méthode a une responsabilité claire",
      "Non, la classe viole SRP en gérant plusieurs responsabilités",
      "Oui, c'est acceptable pour un petit projet",
      "Non, car elle hérite d'une mauvaise classe"
    ],
    "answer": "Non, la classe viole SRP en gérant plusieurs responsabilités",
    "explanation": "SRP impose qu'une classe n’ait qu’un rôle. Ici, `Rapport` gère génération, impression et envoi — ces rôles doivent être séparés."
  },
  {
    "question": "Quel principe SOLID ce code applique-t-il ?\n```csharp\ninterface IEmploye {\n    void Travailler();\n}\ninterface IManager {\n    void Manager();\n}\nclass Dev : IEmploye {\n    public void Travailler() { }\n}\nclass Chef : IEmploye, IManager {\n    public void Travailler() { }\n    public void Manager() { }\n}\n```",
    "options": [
      "Open/Closed Principle",
      "Liskov Substitution Principle",
      "Interface Segregation Principle",
      "Dependency Inversion Principle"
    ],
    "answer": "Interface Segregation Principle",
    "explanation": "Chaque classe implémente uniquement les interfaces dont elle a besoin. L’ISP évite d’imposer à une classe des méthodes inutiles."
  },
  //Design Pattern
  {
    "question": "Quel pattern est utilisé ici ?\n```csharp\nclass Connection {\n    private static Connection instance;\n    private Connection() {}\n    public static Connection GetInstance() {\n        if (instance == null)\n            instance = new Connection();\n        return instance;\n    }\n}\n```",
    "options": [
      "Factory",
      "Builder",
      "Strategy",
      "Singleton"
    ],
    "answer": "Singleton",
    "explanation": "Le code limite l’instanciation à une seule instance avec un constructeur privé. C’est l’implémentation typique du Singleton."
  },
  {
    "question": "Quel pattern est implémenté ci-dessous ?\n```csharp\ninterface IStrategy {\n    void Executer();\n}\nclass StrategieA : IStrategy {\n    public void Executer() => Console.WriteLine(\"A\");\n}\nclass StrategieB : IStrategy {\n    public void Executer() => Console.WriteLine(\"B\");\n}\nclass Contexte {\n    public IStrategy Strategie;\n    public void Lancer() => Strategie.Executer();\n}\n```",
    "options": [
      "Adapter",
      "Observer",
      "Strategy",
      "Factory"
    ],
    "answer": "Strategy",
    "explanation": "Le comportement `Executer()` est interchangeable dynamiquement selon la stratégie injectée dans `Contexte`. C’est le principe du Strategy Pattern."
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
const Page2 = () => {
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
      setTimeLeft(15);
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
              OOP/Solid/Patron 🔹 Niveau : {level.toUpperCase()}
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

export default Page2;