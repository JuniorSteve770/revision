// src/projects/Project2/pages/Page1.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
 
  {
    "question": "Comment démarre-t-on une macro ou une fonction en VBA ?",
    "answer": "**Sub...End Sub** démarre une macro, **Function...End Function** une fonction. Exemple : `Sub Test()`...`End Sub`, `Function Ajout(a, b)`...`Ajout = a + b`."
  },
  {
    "question": "Comment déclare-t-on et affecte-t-on une variable ou un objet ?",
    "answer": "**Dim** déclare une variable : `Dim i As Integer`. **Set** affecte un objet : `Set ws = Worksheets(\"Feuil1\")`."
  },
  {
    "question": "Quelles structures conditionnelles utiliser ?",
    "answer": "**If...Then...Else** pour une condition simple, **Select Case** pour plusieurs cas. Exemple : `If x > 5 Then`, `Select Case score`."
  },
  {
    "question": "Quelles boucles pour répéter une action ?",
    "answer": "**For...Next** pour une boucle fixe : `For i = 1 To 10`. **Do While...Loop** pour une boucle conditionnelle : `Do While i < 5`."
  },
  {
    "question": "Comment cibler une cellule dans Excel ?",
    "answer": "**Range(\"A1\")** cible une cellule nommée, **Cells(1,1)** par index. Les deux permettent lecture/écriture via `.Value`."
  },
  {
    "question": "Comment optimiser le code avec un bloc ou désactiver l’affichage ?",
    "answer": "**With...End With** évite les répétitions : `With Range(\"A1\")...`. **Application.ScreenUpdating = False** accélère les macros."
  },
  {
    "question": "Comment afficher ou saisir une valeur utilisateur ?",
    "answer": "**MsgBox** affiche un message, **InputBox** demande une saisie. Exemple : `nom = InputBox(\"Nom ?\")`, `MsgBox \"Bonjour \" & nom`."
  },
  {
    "question": "Comment nettoyer et analyser du texte ?",
    "answer": "**Trim()** supprime les espaces, **Len()** compte les caractères, **UCase()/LCase()** modifient la casse. Exemple : `UCase(\"abc\") = \"ABC\"`."
  },
  {
    "question": "Comment trier et copier des données Excel ?",
    "answer": "**Sort** trie une plage : `Range(...).Sort`, **PasteSpecial** colle sans formules : `.PasteSpecial xlPasteValues`."
  },
  {
    "question": "Comment gérer les erreurs ou créer des feuilles dynamiquement ?",
    "answer": "**On Error Resume Next** ignore les erreurs, **Worksheets.Add** crée une feuille. À encadrer avec `On Error GoTo 0`."
  },
  {
    "question": "Comment créer une interface utilisateur en VBA ?",
    "answer": "**UserForm** avec **TextBox**, **ComboBox**, **CommandButton** permet la saisie. Code associé via `btnValider_Click()`."
  },
  {
    "question": "Comment générer un graphique depuis VBA ?",
    "answer": "**ChartObjects()** permet de modifier un graphique. Exemple : `Chart.SetSourceData Range(\"A1:B10\")`."
  },
  {
    "question": "Comment placer un point d'arrêt et exécuter le code ligne par ligne ?",
    "answer": "🛑 **Breakpoint (F9)** : Arrête l'exécution à une ligne. 🔁 **Step Into (F8)** : Exécute ligne par ligne, y compris sous-fonctions. **Step Over (Shift+F8)** : Ignore les sous-procédures. **Step Out (Ctrl+Shift+F8)** : Sort de la procédure actuelle."
  },
  {
    "question": "Quelles sont les fenêtres utiles pendant le débogage ?",
    "answer": "🪟 **Immediate (Ctrl+G)** : Tester du code, afficher avec `Debug.Print`. 👁️‍🗨️ **Watch** : Suivre une variable/expression. 📋 **Locals** : Affiche les variables locales en cours avec type et valeur."
  },
  {
    "question": "Quelles instructions permettent d’afficher des infos ou interrompre le code ?",
    "answer": "🖨️ **Debug.Print** : Affiche une valeur dans Immediate. 🛑 **Stop** : Interrompt l'exécution à une ligne précise. Exemple : `Debug.Print \"x = \" & x`."
  },
  {
    "question": "Comment gérer ou intercepter une erreur en VBA ?",
    "answer": "⚠️ **On Error Resume Next** : Ignore l’erreur, passe à la suite. 🔁 **On Error GoTo Label** : Redirige vers un bloc de traitement d’erreur (ex : `GestionErreur:`)."
  },
  {
    "question": "Comment afficher ou suivre la valeur d’une variable à l’arrêt ?",
    "answer": "🖱️ **Survol souris** : Affiche la valeur en infobulle. ✍️ **Édition à chaud** : Modifier le code pendant l’arrêt (hors boucles `For` déjà actives)."
  },
  {
    "question": "Comment compiler et vérifier son code avant exécution ?",
    "answer": "🔍 **Débogage > Compiler** : Vérifie les erreurs de syntaxe sans exécuter. ✅ Bon réflexe avant toute exécution."
  },
  {
    "question": "À quoi sert la barre d’outils Débogage et comment l'utiliser ?",
    "answer": "🔧 **Boutons Débogage** : ▶️ Exécuter, ⏸️ Pause, ⏹️ Stop. 📍 Inclut aussi les options Step Into/Over/Out pour le pas-à-pas (F8, Shift+F8, etc.)."
  },
  {
    "question": "Comment naviguer dans l’environnement VBA efficacement ?",
    "answer": "📁 **Ctrl + R** : Explorateur de projets. 🔍 **Ctrl + F** : Recherche rapide. 🧩 **Fenêtres Projets / Propriétés** : Gérer les modules, formulaires et attributs."
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [

   {
    "question": "Comment interrompre l'exécution d'une macro à une ligne précise dans VBA ?",
    "options": [
      "En utilisant la commande Pause",
      "En insérant un MsgBox",
      "En plaçant un point d'arrêt (breakpoint)",
      "En utilisant Exit Sub"
    ],
    "answer": "En plaçant un point d'arrêt (breakpoint)",
    "explanation": "Un breakpoint permet de suspendre l'exécution à une ligne donnée, facilitant l'analyse du code pendant le débogage."
  },
  {
    "question": "Quelle différence existe-t-il entre 'Step Into' et 'Step Over' ?",
    "options": [
      "Step Into exécute tout le module, Step Over l’ignore",
      "Step Into entre dans les fonctions appelées, Step Over les ignore",
      "Step Over affiche les erreurs, Step Into les corrige",
      "Aucune différence : ce sont deux noms pour la même action"
    ],
    "answer": "Step Into entre dans les fonctions appelées, Step Over les ignore",
    "explanation": "'Step Into' permet de suivre chaque appel de fonction en détail, tandis que 'Step Over' les exécute sans y entrer."
  },
  {
    "question": "À quoi sert la fenêtre 'Immediate' dans l’environnement VBA ?",
    "options": [
      "À lister les erreurs système",
      "À tester du code, afficher des résultats ou modifier des variables",
      "À afficher la hiérarchie des objets",
      "À afficher des messages de MsgBox"
    ],
    "answer": "À tester du code, afficher des résultats ou modifier des variables",
    "explanation": "La fenêtre Immediate est un outil puissant de test à la volée, très utile pour le débogage rapide et interactif."
  },
  {
    "question": "Quelle commande permet d’ignorer une erreur et de continuer l’exécution ?",
    "options": [
      "On Error GoTo",
      "Resume Next",
      "On Error Resume Next",
      "Err.Clear"
    ],
    "answer": "On Error Resume Next",
    "explanation": "Cette instruction ignore les erreurs qui se produisent et passe directement à la ligne suivante, sans interruption du code."
  },
  {
    "question": "Quel est le rôle de 'Stop' dans une procédure VBA ?",
    "options": [
      "Afficher une boîte de message",
      "Supprimer une erreur",
      "Redémarrer la macro",
      "Interrompre l'exécution comme un breakpoint"
    ],
    "answer": "Interrompre l'exécution comme un breakpoint",
    "explanation": "L’instruction Stop agit comme un point d’arrêt manuel et suspend le code à l’endroit spécifié."
  },
  {
    "question": "Comment activer la fenêtre de surveillance d'une variable ?",
    "options": [
      "Par Ctrl + W",
      "Via la Watch Window",
      "En utilisant Debug.Print",
      "Par la fenêtre de propriétés"
    ],
    "answer": "Via la Watch Window",
    "explanation": "La Watch Window permet de surveiller des variables spécifiques, avec conditions si besoin, pendant le débogage."
  },
  {
    "question": "Comment accéder rapidement à l’explorateur de projets VBA ?",
    "options": [
      "Avec Alt + F11",
      "Avec Ctrl + R",
      "Avec Ctrl + G",
      "Avec Shift + F8"
    ],
    "answer": "Avec Ctrl + R",
    "explanation": "Ctrl + R ouvre l’Explorateur de projets, permettant de naviguer rapidement entre les modules, formulaires et classes."
  },
  {
    "question": "Quelle fenêtre permet d’afficher toutes les variables en cours d’une procédure ?",
    "options": [
      "Watch Window",
      "Immediate Window",
      "Variables locales (Locals)",
      "Éditeur de code"
    ],
    "answer": "Variables locales (Locals)",
    "explanation": "La fenêtre Locals affiche dynamiquement toutes les variables, leur valeur, leur type et leur portée pendant l’exécution."
  },
  {
    "question": "Quel raccourci permet d’entrer dans une procédure ligne par ligne ?",
    "options": [
      "F5",
      "F9",
      "Shift + F8",
      "F8"
    ],
    "answer": "F8",
    "explanation": "F8 active le mode 'Step Into', qui exécute le code une ligne à la fois, y compris dans les sous-procédures appelées."
  },
  {
    "question": "Quelle est l'utilité de la commande 'Débogage > Compiler' ?",
    "options": [
      "Exécuter la macro automatiquement",
      "Corriger les erreurs de logique",
      "Vérifier les erreurs de syntaxe sans exécution",
      "Créer un fichier exécutable du projet"
    ],
    "answer": "Vérifier les erreurs de syntaxe sans exécution",
    "explanation": "Compiler le projet permet de détecter les erreurs de syntaxe avant même d’exécuter la macro, un outil préventif efficace."
  }
  ],
  avance: [
    {
      "question": "Quelle est la syntaxe correcte pour déclarer une variable de type chaîne de caractères en VBA ?",
      "options": [
        "Dim texte As String",
        "String texte;",
        "Var texte = String",
        "texte = \"\""
      ],
      "answer": "Dim texte As String",
      "explanation": "En VBA, on utilise 'Dim nom As Type' pour déclarer une variable. Le type String est utilisé pour le texte."
    },
    {
      "question": "Comment accéder à la valeur de la cellule A1 dans une feuille Excel en VBA ?",
      "options": [
        "Cells(\"A1\").Value",
        "Range(1, \"A\").Value",
        "Range(\"A1\").Value",
        "Sheet1!A1"
      ],
      "answer": "Range(\"A1\").Value",
      "explanation": "Range(\"A1\") est la méthode standard pour référencer une cellule. .Value permet d'accéder à son contenu."
    },
    {
      "question": "Quelle boucle permet d'itérer de 1 à 10 en VBA ?",
      "options": [
        "For i = 1 To 10 Step 1",
        "While i < 10 ...",
        "Do Until i = 10 ...",
        "For Each i In Range(1,10)"
      ],
      "answer": "For i = 1 To 10 Step 1",
      "explanation": "La boucle For/Next est optimale pour un nombre d'itérations connu. 'Step 1' est implicite et peut être omis."
    },
    {
      "question": "Comment filtrer un tableau Excel en VBA pour afficher les valeurs >1000 ?",
      "options": [
        "Range.AutoFilter Field:=1, Criteria1:=\">1000\"",
        "Range.Filter(1, \">1000\")",
        "Range.Find(\">1000\")",
        "Range.Sort(\">1000\")"
      ],
      "answer": "Range.AutoFilter Field:=1, Criteria1:=\">1000\"",
      "explanation": "AutoFilter est la méthode native avec paramètres : Field = colonne, Criteria1 = condition."
    },
    {
      "question": "Quelle instruction permet de gérer les erreurs d'exécution en VBA ?",
      "options": [
        "Try/Catch",
        "On Error Resume Next",
        "If Error Then ...",
        "ErrorHandler:"
      ],
      "answer": "On Error Resume Next",
      "explanation": "Structure spécifique à VBA qui ignore l'erreur et continue l'exécution. À utiliser avec précaution."
    },
    {
      "question": "Comment déclarer une fonction calculant la TVA (20%) en VBA ?",
      "options": [
        "Function TVA(ht) ht*1.2 End Function",
        "Function TVA(ht As Double) As Double\n Return ht*0.2\nEnd Function",
        "Sub TVA(ht)\n ht*0.2\nEnd Sub",
        "Function TVA(ht As Double) As Double\n TVA = ht * 0.2\nEnd Function"
      ],
      "answer": "Function TVA(ht As Double) As Double\n TVA = ht * 0.2\nEnd Function",
      "explanation": "Une fonction VBA doit déclarer son type de retour, utiliser '=' pour affecter le résultat, et se terminer par 'End Function'."
    },
    {
      "question": "Quelle méthode permet de trouver la dernière ligne utilisée dans la colonne A ?",
      "options": [
        "Cells(1,1).End(xlDown).Row",
        "Cells(Rows.Count,1).End(xlUp).Row",
        "Range(\"A:A\").Find(\"*\").Row",
        "Columns(1).LastRow"
      ],
      "answer": "Cells(Rows.Count,1).End(xlUp).Row",
      "explanation": "La méthode robuste : partir du bas de la feuille (Rows.Count) et remonter jusqu'à la première cellule non vide (xlUp)."
    },
    {
      "question": "Comment créer une nouvelle feuille nommée \"Rapport\" en VBA ?",
      "options": [
        "Sheets.Add(\"Rapport\")",
        "Worksheets.Add.Name = \"Rapport\"",
        "CreateWorksheet(\"Rapport\")",
        "New Worksheet(\"Rapport\")"
      ],
      "answer": "Worksheets.Add.Name = \"Rapport\"",
      "explanation": "Worksheets.Add crée la feuille, .Name permet de la renommer. Gérer le cas où le nom existe déjà."
    },
    {
      "question": "Quelle structure permet d'exécuter du code seulement si une condition est vraie ?",
      "options": [
        "For i = 1 To N ...",
        "If condition Then ... End If",
        "Select Case ...",
        "Do While ... Loop"
      ],
      "answer": "If condition Then ... End If",
      "explanation": "La structure conditionnelle de base en VBA. Peut être complétée par ElseIf et Else."
    },
    {
      "question": "Comment optimiser les performances d'une macro VBA ?",
      "options": [
        "Application.Speed = True",
        "Application.ScreenUpdating = False",
        "FastMode On",
        "OptimizeVBA True"
      ],
      "answer": "Application.ScreenUpdating = False",
      "explanation": "Désactive l'actualisation d'écran pendant l'exécution. À combiner avec Calculation = xlManual et EnableEvents = False."
    },
    {
      "question": "Comment trier les données de la colonne A par ordre décroissant ?",
      "options": [
        "Range(\"A:A\").Sort Order:=xlDescending",
        "Range(\"A1\").CurrentRegion.Sort Key1:=Range(\"A1\"), Order1:=xlDescending",
        "Columns(1).Sort Direction:=Down",
        "Sort Column A Z->A"
      ],
      "answer": "Range(\"A1\").CurrentRegion.Sort Key1:=Range(\"A1\"), Order1:=xlDescending",
      "explanation": "CurrentRegion détecte automatiquement le tableau adjacent. Key1 spécifie la colonne de tri, Order1 la direction."
    },
    {
      "question": "Comment afficher une boîte de dialogue de saisie en VBA ?",
      "options": [
        "MsgBox(\"Saisissez une valeur\")",
        "InputBox(\"Saisissez une valeur\")",
        "Dialog.Input(\"Saisie\")",
        "UserForm.Show"
      ],
      "answer": "InputBox(\"Saisissez une valeur\")",
      "explanation": "InputBox permet une saisie utilisateur simple. Toujours valider le résultat (IsEmpty, IsNumeric...)."
    },
    {
      "question": "Quelle syntaxe permet de parcourir toutes les feuilles d'un classeur ?",
      "options": [
        "For Each ws In Workbook.Sheets",
        "For Each ws In Worksheets",
        "For i = 1 To Sheets.Count",
        "For Each ws In Excel.Worksheets"
      ],
      "answer": "For Each ws In Worksheets",
      "explanation": "Worksheets est la collection native. 'ws' devient une variable objet Worksheet dans la boucle."
    },
    {
      "question": "Comment ajouter une mise en forme conditionnelle pour colorer en rouge les valeurs <0 ?",
      "options": [
        "Range.FormatConditions.Add Type:=xlCellValue, Operator:=xlLess, Formula1:=\"0\"",
        "Range.Style = \"Red\" If Value < 0",
        "ConditionalFormatting.Add(\"A1\", \"<0\").Color = Red",
        "FormatIfNegative Range(\"A1\")"
      ],
      "answer": "Range.FormatConditions.Add Type:=xlCellValue, Operator:=xlLess, Formula1:=\"0\"",
      "explanation": "FormatConditions est l'objet natif. Type xlCellValue + Operator xlLess permet de définir la condition."
    },
    {
      "question": "Comment copier-coller des valeurs (sans formules) en VBA ?",
      "options": [
        "Range.Copy Range.Paste",
        "Range.Copy Destination:=Range2",
        "Range.Copy\nRange.PasteSpecial xlPasteValues",
        "Range.Value = Range2.Value"
      ],
      "answer": "Range.Copy\nRange.PasteSpecial xlPasteValues",
      "explanation": "PasteSpecial avec xlPasteValues colle uniquement les valeurs. Nettoyer le clipboard après avec Application.CutCopyMode = False."
    },
    {
      "question": "Quelle méthode permet de créer un graphique en VBA ?",
      "options": [
        "Charts.Add",
        "Worksheets.AddChart",
        "Shapes.AddChart",
        "Set chart = ActiveSheet.ChartObjects.Add(Left, Top, Width, Height)"
      ],
      "answer": "Set chart = ActiveSheet.ChartObjects.Add(Left, Top, Width, Height)",
      "explanation": "ChartObjects.Add crée un objet graphique positionné. On peut ensuite définir son type et ses données via Chart.SetSourceData."
    },
    {
      "question": "Comment déclencher une macro lorsqu'un utilisateur clique sur un bouton ?",
      "options": [
        "AssignMacro dans l'éditeur de bouton",
        "Button.OnClick = \"Macro\"",
        "ActiveX CommandButton avec code dans l'événement Click",
        "Shapes(\"Button\").Macro = \"NomMacro\""
      ],
      "answer": "ActiveX CommandButton avec code dans l'événement Click",
      "explanation": "Soit via un bouton ActiveX (code dans Sheet) soit un bouton Form (macro assignée). La réponse couvre le cas ActiveX."
    },
    {
      "question": "Comment vérifier si un fichier existe avant de l'ouvrir ?",
      "options": [
        "If File.Exists(path) Then",
        "If Dir(path) <> \"\" Then",
        "If IsFile(path) Then",
        "If CanOpen(path) Then"
      ],
      "answer": "If Dir(path) <> \"\" Then",
      "explanation": "Dir() est la fonction VBA native qui retourne une chaîne vide si le fichier n'existe pas."
    },
    {
      "question": "Quelle structure permet de gérer plusieurs conditions mutuellement exclusives ?",
      "options": [
        "If...ElseIf...End If",
        "Select Case...End Select",
        "Choose(index, options)",
        "Switch(cond1, res1, cond2, res2)"
      ],
      "answer": "Select Case...End Select",
      "explanation": "Plus lisible que des If imbriqués quand on teste une variable contre plusieurs valeurs possibles."
    },
    {
      "question": "Comment arrêter proprement l'exécution d'une macro en cours ?",
      "options": [
        "Stop",
        "Exit Sub",
        "End",
        "CancelExecution"
      ],
      "answer": "Exit Sub",
      "explanation": "Quitte la procédure proprement. 'End' est à éviter (termine brutalement l'application). 'Stop' pause le débogueur."
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