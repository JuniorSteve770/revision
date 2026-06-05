// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
  "question": "Pourquoi éviter 'Select' et 'Activate' en VBA ?",
  "answer": "Ces méthodes :\n1. Ralentissent l'exécution et Sont fragiles car dépendent de la sélection active)\n3. Alternative : Travailler directement avec les objets\nExle à éviter :\nRange(\"A1\").Select\nSelection.Value = 10\n\nExemple propre :\nRange(\"A1\").Value = 10"
},
{
    "question": "Contrôle de flux : Différence entre Exit For/Exit Sub ET Optimisation des performances",
    "answer": "1) Exit For : Sortie de boucle\n   Exit Sub : Sortie de procédure\n   Exemple : If condition Then Exit For\n"
  },
  {
    "question": "Structures de boucle : For Each/For Next/Do While ET Gestion d'erreurs",
    "answer": "1) Boucles :\n   - For Each (Collections)\n   - For Next (Compteur)\n   - Do While (Condition)\n\n2) Gestion erreurs :\n   On Error GoTo Handler\n   ...\nHandler:\n   MsgBox Err.Description\nMots-clés : Loop structures, Error handling"
  },
  {
    "question": "Structures de données : Collections vs Tableaux ET Dictionnaires",
    "answer": "1) Collections :\n   - Redimension dynamique\n   - Méthodes Add/Remove\n\n2) Dictionnaires :\n   - Clés uniques\n   - Performance O(1)\n   - Exists/Keys/Items\nMots-clés : Data structures, Efficiency"
  },
  {
    "question": "Tableaux dynamiques ET Techniques de débogage",
    "answer": "1) Tableaux :\n   Redim Preserve arr(1 To n)\n\n2) Débogage :\n   - Points d'arrêt (F9)\n   - Fenêtre Exécution (Ctrl+G)\n   - Debug.Print\nMots-clés : Arrays, Debugging"
  },
  {
    "question": "Modularité : Subs vs Functions ET Sécurité des fichiers",
    "answer": "1) Subs : Actions\n   Functions : Retours\n  "
  },
{
    "question": "Comment traiter des plages non contiguës ET optimiser les performances pour grandes plages ?",
    "answer": "1) Plages discontinues :\nFor Each area In Selection.Areas\n   'Traitement...\nNext area\n\n2) Optimisation :\n- ScreenUpdating=False\n- Traitement par blocs avec Step\n"
  },
  {
    "question": "Gestion de colonnes de tailles différentes ET validation croisée",
    "answer": "1) Taille variable :\nmaxRow = Application.Max(lastRowA, lastRowB)\n\n2) Validation :\nFor i=1 To maxRow\n   If Cells(i,1)<>Cells(i,2) Then 'Différence...\n"
  },
  {
    "question": "Boucles avancées : Séquences croissantes ET nested loops optimisés",
    "answer": "1) Séquences :\nIf Cells(i,1)<Cells(i+1,1) Then i=i+2 'Saut\n\n2) Nested loops :\nFor i=1 To lastRow\n   For j=i+1 To lastRow 'Évite redondance\nMots-clés : Algorithmie, Optimisation"
  },
  {
    "question": "Gestion d'erreurs professionnelle ET debugging",
    "answer": "1) Error handling :\nOn Error GoTo ErrorHandler\n...\nErrorHandler:\n   Log Err.Description\n\n2) Debugging :\n- Points d'arrêt (F9)\n- Fenêtre Exécution (Ctrl+G)\nMots-clés : Robustesse, Debug.Print"
  },
   {
    "question": "À quoi servent les mots-clés Sub et Dim ?",
    "answer": "**Sub** définit une macro exécutée automatiquement : `Sub Test()` ... `End Sub`. **Dim** déclare une variable avec un type : `Dim x As Integer`. Obligatoire pour un code propre et typé."
  },
  {
    "question": "Quelle est la différence entre Range et Cells ? Et comment remplir une colonne ?",
    "answer": "**Range(\"A1\")** est une référence fixe, **Cells(1,1)** est indexée (A1). Pr rmplir une col : `For i = 1 To 10 : Cells(i,1).Value = i : Next i`."
  },
  {
    "question": "Comment structurer une condition ? Et colorier une cellule si paire ?",
    "answer": "`If ... Then ... Else` permet de tester une valeur. Exemple : `If x > 5 Then MsgBox \"OK\"`. Pour colorier en vert : `If i Mod 2 = 0 Then Cells(i,1).Interior.Color = vbGreen`."
  },
  {
    "question": "Comment interagir avec l’utilisateur avec MsgBox et InputBox ?",
    "answer": "`MsgBox` affiche un message : `MsgBox \"Opération réussie\"`. `InputBox` récupère une saisie : `nom = InputBox(\"Votre nom ?\")`."
  },
  {
    "question": "Comment tester si une cellule est vide ou numérique ?",
    "answer": "`IsEmpty(Range(\"A1\"))` vérifie le vide. `IsNumeric(val)` teste si val est un nombre. Utile pour valider des saisies."
  },
  {
    "question": "Comment quitter une macro ou éviter une erreur ?",
    "answer": "`Exit Sub` stoppe la macro (ex : si champ vide). `On Error GoTo GestionErreur` redirige les erreurs. Afficher l'erreur avec `Err.Description`."
  },
  {
    "question": "Comment parcourir une sélection et tronquer du texte ?",
    "answer": "`For Each cell In Selection` parcourt chaque cellule. `Left(cell.Value, 5)` garde les 5 premiers caractères. Vérifie d'abord que `IsEmpty(cell) = False`."
  },
  {
    "question": "Comment activer une feuille et insérer une valeur ?",
    "answer": "`Worksheets(\"Feuil1\").Activate` change de feuille. `Range(\"A1\").Value = 42` insère une valeur dans une cellule."
  },
  {
    "question": "Comment détecter la dernière ligne et trier une colonne ?",
    "answer": "`Cells(Rows.Count, 1).End(xlUp).Row` donne la dernière ligne utilisée. Pour trier A : `Range(\"A1:A\" & n).Sort Key1:=Range(\"A1\")`."
  },
  {
    "question": "Pourquoi éviter Select/Activate ? Et comment optimiser du code ?",
    "answer": "`Select` ralentit et rend le code fragile. Préfère `With Range(\"A1\") .Value = 1 .Font.Bold = True End With` pour grouper les actions sur un objet."
  },
  {
    "question": "Comment afficher un UserForm et à quoi sert-il ?",
    "answer": "`UserForm1.Show` affiche une interface utilisateur. Il permet de saisir des données, gérer des boutons, afficher dynamiquement dans Excel."
  }

];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

   {
    "question": "Quelle méthode permet de quitter immédiatement toute une procédure VBA ?",
    "options": [
      "A. Exit For",
      "B. Exit Function",
      "C. Exit Sub",
      "D. End"
    ],
    "answer": "C",
    "explanation": "Exit Sub termine l'exécution de la procédure courante. Exit For ne sort que de la boucle actuelle, Exit Sub est la bonne réponse car plus globale qu'Exit Function qui ne s'applique qu'aux fonctions. End est à éviter car peut causer des problèmes de nettoyage."
  },
  {
    "question": "Quelle technique NE fait PAS partie des optimisations recommandées pour les macros VBA ?",
    "options": [
      "A. Désactiver ScreenUpdating",
      "B. Utiliser des tableaux mémoire",
      "C. Activer Calculation automatique",
      "D. Traiter par blocs de données"
    ],
    "answer": "C",
    "explanation": "Il faut au contraire désactiver les calculs automatiques (xlCalculationManual) pour optimiser les performances. Les autres options sont des bonnes pratiques d'optimisation."
  },
  {
    "question": "Quelle structure de boucle est la plus adaptée pour itérer sur une collection d'objets ?",
    "options": [
      "A. For Next",
      "B. Do Until",
      "C. For Each",
      "D. While Wend"
    ],
    "answer": "C",
    "explanation": "For Each est spécialement conçu pour itérer sur des collections (Range, Worksheets, etc.). For Next utilise un compteur numérique, Do Until et While Wend sont des boucles conditionnelles."
  },
  {
    "question": "Quelle syntaxe correcte pour gérer les erreurs en VBA ?",
    "options": [
      "A. On Error Resume",
      "B. On Error GoTo Label",
      "C. Try Catch Finally",
      "D. Error Handle"
    ],
    "answer": "B",
    "explanation": "La syntaxe correcte est On Error GoTo Label. VBA n'utilise pas Try-Catch (syntaxe C#). On Error Resume existe mais sans gestion structurée."
  },
  {
    "question": "Quel avantage principal offre un Dictionary par rapport à une Collection ?",
    "options": [
      "A. Méthode Remove plus efficace",
      "B. Test d'existence de clé (Exists)",
      "C. Meilleure gestion des doublons",
      "D. Tri automatique des éléments"
    ],
    "answer": "B",
    "explanation": "La méthode Exists permet de vérifier une clé en O(1). Les Collections nécessitent un parcours manuel pour cette vérification. Les autres options sont incorrectes ou secondaires."
  },
  {
    "question": "Quelle complexité algorithmique pour une recherche binaire bien implémentée ?",
    "options": [
      "A. O(1)",
      "B. O(n)",
      "C. O(log n)",
      "D. O(n²)"
    ],
    "answer": "C",
    "explanation": "La recherche binaire a une complexité logarithmique O(log n) car elle divise l'espace de recherche par 2 à chaque itération. C'est bien plus efficace qu'une recherche linéaire O(n)."
  },
  {
    "question": "Quelle convention de nommage est recommandée pour une variable de type String ?",
    "options": [
      "A. sNom",
      "B. strNom",
      "C. stringNom",
      "D. NomStr"
    ],
    "answer": "B",
    "explanation": "Le préfixe 'str' est la convention standard pour les String (strNom). 's' est trop court, 'string' trop long, et le suffixe 'Str' moins lisible."
  },
  {
    "question": "Comment redimensionner un tableau en conservant son contenu existant ?",
    "options": [
      "A. ReDim",
      "B. ReDim Keep",
      "C. ReDim Preserve",
      "D. Resize Array"
    ],
    "answer": "C",
    "explanation": "ReDim Preserve est la seule syntaxe valide pour redimensionner en gardant les données. ReDim seul réinitialise le tableau. Les autres options n'existent pas en VBA."
  },
  {
    "question": "Quel outil permet d'inspecter des valeurs pendant l'exécution en VBA ?",
    "options": [
      "A. Immediate Window (Ctrl+G)",
      "B. Data Inspector",
      "C. Variable Explorer",
      "D. Code Profiler"
    ],
    "answer": "A",
    "explanation": "La fenêtre Exécution (Immediate Window) accessible par Ctrl+G permet d'évaluer des expressions et variables durant le débogage. Les autres outils n'existent pas dans l'IDE VBA standard."
  },
  {
    "question": "Quelle pratique améliore la sécurité des accès fichiers en VBA ?",
    "options": [
      "A. Toujours utiliser ReadOnly:=False",
      "B. Supprimer le fichier après usage",
      "C. Valider l'existence avec Dir() avant ouverture",
      "D. Désactiver les alertes Excel"
    ],
    "answer": "C",
    "explanation": "La validation avec Dir() évite les erreurs sur fichiers inexistants. ReadOnly:=True est recommandé (pas False). La suppression est risquée et désactiver les alertes réduit la sécurité."
  },
  ],
  avance: [
     {
    "question": "Quel outil permet d'exécuter du code pas à pas en sautant les appels de procédures ?",
    "options": [
      "A. Step Into (F8)",
      "B. Step Over (Maj+F8)",
      "C. Step Out (Ctrl+Maj+F8)",
      "D. Run To Cursor (Ctrl+F8)"
    ],
    "answer": "B",
    "explanation": "Step Over (Maj+F8) exécute la procédure appelée sans entrer dans son code, contrairement à Step Into. Step Out sort de la procédure courante, Run To Cursor exécute jusqu'au point d'insertion."
  },
  {
    "question": "Quelle fenêtre permet d'évaluer instantanément des expressions pendant le débogage ?",
    "options": [
      "A. Fenêtre Exécution (Ctrl+G)",
      "B. Fenêtre Espion",
      "C. Fenêtre Variables locales",
      "D. Fenêtre Projet"
    ],
    "answer": "A",
    "explanation": "La fenêtre Exécution (Immediate Window) permet d'évaluer des expressions avec ? ou Print. Les fenêtres Espion et Variables locales sont en lecture seule."
  },
  {
    "question": "Comment ajouter un espion sur une variable complexe comme un objet Collection ?",
    "options": [
      "A. Via Watch Window > Add Watch",
      "B. Debug.AddEspion",
      "C. En préfixant la variable par 'Watch:'",
      "D. Impossible pour les Collections"
    ],
    "answer": "A",
    "explanation": "La fenêtre Espion (Watch Window) permet d'ajouter des surveillances même pour des objets complexes. Il faut sélectionner 'Add Watch' et configurer le contexte."
  },
  {
    "question": "Quelle technique permet de tracer l'exécution sans points d'arrêt ?",
    "options": [
      "A. Debug.Print",
      "B. MsgBox",
      "C. LogEvent API",
      "D. Stop instruction"
    ],
    "answer": "A",
    "explanation": "Debug.Print envoie des traces vers la fenêtre Exécution sans bloquer l'exécution comme MsgBox. Stop équivaut à un point d'arrêt codé en dur."
  },
  {
    "question": "Comment déboguer un événement Worksheet_Change qui se déclenche trop souvent ?",
    "options": [
      "A. Désactiver les événements avant le traitement",
      "B. Utiliser Application.EnableEvents = False",
      "C. Ajouter un flag booléen de contrôle",
      "D. Toutes ces réponses"
    ],
    "answer": "D",
    "explanation": "Toutes ces techniques sont valables : désactivation temporaire des événements, flag pour ignorer les déclenchements récursifs, ou désactivation globale contrôlée."
  },
  {
    "question": "Quel outil permet d'inspecter la pile d'appels (call stack) en VBA ?",
    "options": [
      "A. Fenêtre Call Stack (Ctrl+L)",
      "B. Debug.CallStack",
      "C. Log manuel avec des étiquettes",
      "D. VBA ne gère pas la pile d'appels"
    ],
    "answer": "A",
    "explanation": "La fenêtre Call Stack (Ctrl+L) affiche la hiérarchie des appels. Elle n'est visible qu'en mode débogage avec des points d'arrêt actifs."
  },
  {
    "question": "Comment capturer une erreur sans interrompre l'exécution ?",
    "options": [
      "A. On Error Resume Next",
      "B. Try/Catch hidden",
      "C. ErrorHandler global",
      "D. IgnoreErrors instruction"
    ],
    "answer": "A",
    "explanation": "On Error Resume Next permet de continuer après une erreur. VBA n'a pas de Try/Catch. Un handler global nécessite toujours On Error."
  },
  {
    "question": "Quelle méthode pour déboguer une macro lancée via un bouton Excel ?",
    "options": [
      "A. Point d'arrêt avant l'appel",
      "B. Déclencher manuellement depuis l'IDE",
      "C. Ajouter un paramètre de débogage",
      "D. Toutes ces réponses"
    ],
    "answer": "D",
    "explanation": "Toutes ces techniques fonctionnent : point d'arrêt stratégique, exécution contrôlée depuis l'éditeur, ou paramètre conditionnel pour activer le mode debug."
  },
  {
    "question": "Comment inspecter les propriétés d'un objet Excel non reconnu en mode débogage ?",
    "options": [
      "A. Utiliser TypeName() dans la fenêtre Exécution",
      "B. Ajouter à la fenêtre Espion avec l'option 'All Properties'",
      "C. Activer l'explorateur d'objets",
      "D. Convertir en Dictionary"
    ],
    "answer": "B",
    "explanation": "La fenêtre Espion permet d'explorer toutes les propriétés via l'option dédiée. TypeName donne juste le type, pas les détails."
  },
  {
    "question": "Quelle pratique évite le débogage fastidieux des erreurs 'Objet requis' ?",
    "options": [
      "A. Toujours utiliser Option Explicit",
      "B. Vérifier Is Nothing avant usage",
      "C. Activer 'Break on All Errors'",
      "D. Toutes ces réponses"
    ],
    "answer": "D",
    "explanation": "Option Explicit force la déclaration des variables, Is Nothing teste les objets, et 'Break on All Errors' dans les options VBA intercepte les erreurs tôt."
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

const handleAnswerClick = (option, index) => {
    if (message) return;
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

export default Page1;
