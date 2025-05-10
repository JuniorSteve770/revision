// src/projects/Project2/pages/Page2.js

import React, { useState, useEffect } from "react";
import "./Page.css";
// partie 
// Flashcards pour le niveau basic

const basicSlides = [
  {
    "question": "Comment référencer une feuille et détecter dynamiquement la dernière ligne ?",
    "answer": "➡️ Utilise `Set ws = Sheets(\"NomFeuille\")` pour manipuler une feuille spécifique. \n➡️ Pour trouver la dernière cellule remplie : `ws.Cells(ws.Rows.Count, 1).End(xlUp).Row`. \n📌 **Mots-clés** : Set, Sheets, xlUp, dynamique. \n📎 **Exemple** : `Set baseWs = Sheets(\"Base\")`, `lastRow = ws.Cells(Rows.Count, 1).End(xlUp).Row`. \n⚠️ **Erreur à éviter** : `.End(xlDown)` saute les cellules vides."
  },
  {
    "question": "Comment créer une collection sans doublon et nommer une feuille dynamiquement ?",
    "answer": "➡️ Crée une `Collection` avec `On Error Resume Next` + `CStr(val)` comme clé : évite les doublons. \n➡️ Nomme la feuille avec `Left(\"Client_\" & client, 31)` pour respecter la limite Excel. \n📌 **Mots-clés** : Collection, unicité, nom de feuille, Left. \n📎 **Exemple** : `uniqueClients.Add cell.Value, CStr(cell.Value)`, `reportWs.Name = Left(\"Client_\" & client, 31)`."
  },
  {
    "question": "Comment filtrer des données par critère et copier les lignes correspondantes ?",
    "answer": "➡️ Parcours les cellules avec `For Each`, filtre avec `If cell.Value = critere` et copie la ligne : `cell.EntireRow.Copy Destination:=...`. \n📌 **Mots-clés** : boucle, filtre manuel, EntireRow, Destination. \n📎 **Exemple** : `If cell.Value = client Then cell.EntireRow.Copy Destination:=reportWs.Cells(..., 1)`. \n⚠️ **Attention** à bien gérer la ligne de destination (évite les doublons ou vides)."
  },
  {
    "question": "Comment insérer un logo et ajuster sa position dans une feuille Excel ?",
    "answer": "➡️ Utilise `Pictures.Insert(path).Select`, puis ajuste via `.ShapeRange.Left`, `.Top`, `.Height`. \n📌 **Mots-clés** : image, ShapeRange, position. \n📎 **Exemple** : `reportWs.Pictures.Insert(\"C:\\logo.png\")`, `.Left = Range(\"F1\").Left`, `.Height = 40`. \n⚠️ Le fichier image doit exister au chemin indiqué."
  },
  {
    "question": "Comment configurer une mise en page propre pour l'impression ?",
    "answer": "➡️ Utilise `.PageSetup` avec `.Orientation`, `.Zoom = False`, `.FitToPagesWide = 1`. \n📌 **Mots-clés** : PageSetup, impression, FitToPage. \n📎 **Exemple** : `With ws.PageSetup ... End With`. \n⚠️ N’oublie pas de désactiver `Zoom` pour que les options d’ajustement s’appliquent."
  },
  {
    "question": "Comment informer l'utilisateur à la fin de l'exécution d'une macro ?",
    "answer": "➡️ Utilise `MsgBox \"Texte\", vbInformation` pour confirmer la réussite ou notifier un état. \n📌 **Mots-clés** : MsgBox, feedback, utilisateur. \n📎 **Exemple** : `MsgBox \"Reportings générés avec succès !\"`. \n⚠️ Ajoute une icône (`vbInformation`) pour une interface plus claire."
  },
 {
    "question": "Comment référencer une feuille et détecter la dernière ligne non vide ?",
    "answer": "**Référencer** : `Set ws = Sheets(\"NomFeuille\")` permet de manipuler une feuille existante. \n**Dernière ligne** : `Cells(Rows.Count, 1).End(xlUp).Row` trouve la dernière cellule remplie d’une colonne. \nMots-clés : `Set`, `Sheets`, `xlUp`, dynamique. \nExemple : `Set baseWs = Sheets(\"Base\")` / `lastRow = ws.Cells(Rows.Count, 1).End(xlUp).Row`."
  },
  {
    "question": "Comment créer une collection unique et générer une feuille avec nom dynamique ?",
    "answer": "**Collection unique** : `uniqueClients.Add val, CStr(val)` + `On Error Resume Next` évite les doublons. \n**Nom dynamique** : `reportWs.Name = Left(\"Client_\" & client, 31)` limite à 31 caractères. \nMots-clés : `Collection`, `unicité`, `gestion d'erreur`, `nom de feuille`. \nExemple : `Sheets.Add`, `CStr(val)`."
  },
  {
    "question": "Comment filtrer manuellement et copier des lignes selon un critère ?",
    "answer": "Boucle sur les cellules : `If cell.Value = critere Then cell.EntireRow.Copy Destination:=...`. \nMots-clés : `filtrage`, `boucle`, `EntireRow`, `Destination`. \nExemple : copie uniquement les lignes du client sélectionné."
  },
  {
    "question": "Comment insérer une image avec positionnement personnalisé ?",
    "answer": "Utilise `Pictures.Insert(path).Select`, puis ajuste via `.ShapeRange`. \nMots-clés : `insertion image`, `ShapeRange`, `positionnement`. \nExemple : `.Left = Range(\"F1\").Left`, `.Height = 40`."
  },
  {
    "question": "Comment configurer la mise en page pour impression ?",
    "answer": "Utilise `PageSetup` avec `.Orientation = xlPortrait`, `.Zoom = False`, `.FitToPagesWide = 1`. \nMots-clés : `mise en page`, `impression`, `FitToPages`. \nExemple : une page de large, plusieurs pages de haut possibles."
  },
  {
    "question": "Comment afficher un message de confirmation en fin de macro ?",
    "answer": "Utilise `MsgBox \"Texte\", vbInformation`. \nMots-clés : `MsgBox`, `interface utilisateur`, `feedback`. \nExemple : `MsgBox \"Reportings générés avec succès !\"` informe l'utilisateur."
  },

{
    "question": "Comment vérifier une sélection ET itérer sur les cellules en VBA ?",
    "answer": "1. Vérification : `TypeName(Selection) <> \"Range\"` (Mots-clés : **TypeName, validation**)\n2. Itération : `For Each cell In plage` (Mots-clés : **boucle, Range**)"
  },
  {
    "question": "Comment gérer un tableau dynamique ET vérifier les valeurs numériques ?",
    "answer": "1. Tableau : `ReDim valeurs(1 To N)` / `ReDim Preserve` pour conserver (Mots-clés : **redimensionnement, tableau**)\n2. Vérification : `IsNumeric(cell.Value) And Not IsEmpty(cell.Value)` (Mots-clés : **validation, numérique**)"
  },
  {
    "question": "Quelles fonctions statistiques utiliser ET comment implémenter la coloration ?",
    "answer": "1. Stats : `Application.WorksheetFunction.Average/Median/Min/Max` (Ex: `moyenne = Average(valeurs)`)\n2. Coloration : `Select Case True` avec `Interior.Color` (Ex: `vbGreen` si > moyenne)"
  },
  {
    "question": "Comment déclarer une subroutine ET quitter prématurément ?",
    "answer": "1. Déclaration : `Sub NomMacro()` (Mots-clés : **début de macro**)\n2. Sortie : `Exit Sub` pour interruption (Mots-clés : **contrôle de flux**)"
  },
  {
    "question": "Quels types de données utiliser ET comment afficher des messages ?",
    "answer": "1. Types : `Range` (cellules), `Double` (décimaux), `Long` (entiers)\n2. Messages : `MsgBox \"Texte\", vbInformation` (Mots-clés : **interface utilisateur**)"
  },
  {
    "question": "Comment initialiser une feuille Excel et trouver la dernière ligne utilisée en VBA ?",
    "answer": "Syntaxe : `Set ws = Sheets(\"NomFeuille\")` et `lastRow = ws.Cells(ws.Rows.Count, \"A\").End(xlUp).Row`\nMots-clés : Référence de feuille, xlUp, dynamique\nExemple : Trouve la dernière ligne non-vide de la colonne A"
  },
  {
    "question": "Quelle méthode utiliser pour collecter des critères utilisateurs avec gestion des champs vides ?",
    "answer": "Syntaxe : `InputBox()` avec vérification de chaîne vide\nMots-clés : Interaction utilisateur, validation\nExemple : `nomCritere = InputBox(\"Entrez un nom\")` puis `IIf(nomCritere <> \"\", critère, \"\")`"
  },
  {
    "question": "Comment implémenter un filtre automatique avec critères partiels et dates en VBA ?",
    "answer": "Syntaxe : `.AutoFilter Field:=n, Criteria1:=\"*texte*\"` pour partiel ou date exacte\nMots-clés : AutoFilter, joker (*), IIf\nExemple : Filtre colonne 1 sur nom partiel : `\"*\" & nomCritere & \"*\"`"
  },
  {
    "question": "Quelle technique permet de copier uniquement les résultats filtrés vers une nouvelle feuille ?",
    "answer": "Syntaxe : `.SpecialCells(xlCellTypeVisible).Copy`\nMots-clés : Cellules visibles, copie filtrée\nExemple : Copie uniquement les lignes filtrées vers nouvelle feuille"
  },
  {
    "question": "Comment créer dynamiquement une feuille de résultats avec horodatage unique ?",
    "answer": "Syntaxe : `Sheets.Add` + `Format(Now, \"yyyymmdd_hhnnss\")`\nMots-clés : Horodatage, nom unique\nExemple : `wsResult.Name = \"Résultats_20240510_143022\"`"
  },
  {
    "question": "Quelle structure VBA optimise la gestion des plages filtrées ?",
    "answer": "Bloc `With` pour éviter les répétitions\nMots-clés : With-End With, optimisation\nExemple : Applique multiples filtres sur même plage sans répéter la référence"
  },
  {
    "question": "Comment réinitialiser proprement des filtres existants en VBA ?",
    "answer": "Syntaxe : `If ws.AutoFilterMode Then ws.AutoFilterMode = False`\nMots-clés : Nettoyage, réinitialisation\nExemple : Supprime tout filtre actif avant nouvelle application"
  },
  {
    "question": "Comment notifier l'utilisateur avec le nom exact de la feuille résultat ?",
    "answer": "Syntaxe : `MsgBox` avec concaténation de `ws.Name`\nMots-clés : Feedback utilisateur, communication\nExemple : Affiche \"Résultats dans 'Feuille1'\""
  },
  {
    "question": "Quel opérateur permet de gérer conditionnellement des critères vides ?",
    "answer": "Fonction `IIf(condition, si_vrai, si_faux)`\nMots-clés : Condition inline, ternaire\nExemple : `Criteria1:=IIf(critere=\"\", \"*\", critere)`"
  },
  {
    "question": "Pourquoi utiliser un horodatage dans le nom des feuilles résultats ?",
    "answer": "Avantages : Évite les conflits de noms, traçabilité\nFormat : AAAAMMJJ_HHMMSS\nExemple : \"Resultats_20240510_150045\" pour 15:00:45 le 10/05/2024"
  },
  {
    "question": "Comment détecter dynamiquement la plage source pour un TCD en VBA ?",
    "answer": "Utilise `lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row` et `lastCol = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column`. Mots-clés : xlUp, xlToLeft, plage dynamique. Exemple : Trouve la dernière ligne/colonne utilisée dans la feuille 'Base'."
  },
  {
    "question": "Comment créer un cache de données pour un TCD ?",
    "answer": "Utilise `Set pc = ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=plage)`. Mots-clés : PivotCache, xlDatabase. Exemple : Crée un cache sur une plage définie automatiquement."
  },
  {
    "question": "Comment affecter les champs à un TCD (ligne, colonne, valeur) ?",
    "answer": "Utilise `.PivotFields(\"X\").Orientation = xlRowField/xlColumnField/xlDataField`. Mots-clés : Orientation, PivotFields. Exemple : `.PivotFields(\"Montant\").Function = xlSum` pour sommer les montants."
  },
  {
    "question": "Quelle structure VBA simplifie la configuration d’un TCD ?",
    "answer": "Utilise `With pt ... End With` pour regrouper les réglages. Mots-clés : With-End With, PivotTable. Exemple : Permet d'ajuster tous les paramètres du TCD dans un bloc unique."
  },
  {
    "question": "Comment créer une feuille de résultats horodatée ?",
    "answer": "Utilise `Sheets.Add` + `Format(Now, \"yyyymmdd_hhnnss\")`. Mots-clés : Horodatage, nom unique. Exemple : Nom de feuille généré automatiquement comme \"TCD_20240510_143022\"."
  },
  {
    "question": "Comment récupérer les champs du TCD via l'utilisateur ?",
    "answer": "Utilise `InputBox` pour demander chaque champ. Mots-clés : Interaction utilisateur. Exemple : `champLigne = InputBox(\"Champ de ligne\")` permet une saisie manuelle."
  },
  {
    "question": "Comment définir la position du TCD dans une feuille ?",
    "answer": "Utilise `CreatePivotTable TableDestination:=ws.Range(\"A3\")`. Mots-clés : Ancrage, positionnement. Exemple : Le TCD commence en cellule A3 de la feuille résultat."
  },
  {
    "question": "Comment appliquer une fonction d’agrégation dans un TCD ?",
    "answer": "Utilise `.PivotFields(\"X\").Function = xlSum/xlCount/xlAverage`. Mots-clés : Agrégation, fonction. Exemple : `xlSum` additionne les montants dans le champ de valeur."
  },
];
// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
   {
    "question": "Quelle instruction permet de détecter la dernière ligne non vide dans une colonne ?",
    "options": [
      "Cells(1, 1).End(xlDown).Row",
      "Cells(Rows.Count, 1).End(xlUp).Row",
      "Rows(1).End(xlToLeft).Row",
      "Columns(1).End(xlUp).Row"
    ],
    "answer": "B",
    "explanation": "`Cells(Rows.Count, 1).End(xlUp).Row` remonte depuis le bas de la colonne pour trouver la dernière cellule non vide."
  },
  {
    "question": "Quelle méthode permet de créer un cache de données pour un TCD ?",
    "options": [
      "CreateObject(\"Pivot.Cache\")",
      "ThisWorkbook.PivotCaches.Create(...)",
      "Sheets(\"Feuille\").PivotTable.CreateCache(...)",
      "New PivotCache()"
    ],
    "answer": "B",
    "explanation": "`ThisWorkbook.PivotCaches.Create` est la méthode standard pour créer un cache de données avant d'initialiser un TCD."
  },
  {
    "question": "Quel mot-clé VBA empêche l’arrêt du code en cas d’erreur ?",
    "options": [
      "Stop On Error",
      "Resume Error",
      "On Error Resume Next",
      "Try Catch"
    ],
    "answer": "C",
    "explanation": "`On Error Resume Next` permet d’ignorer les erreurs et de continuer l’exécution, utile pour les ajouts uniques dans une Collection."
  },
  {
    "question": "Comment insérer une image dans une feuille Excel ?",
    "options": [
      "InsertImage()",
      "Shape.Insert()",
      "Pictures.Insert(path)",
      "Range.AddImage(path)"
    ],
    "answer": "C",
    "explanation": "`Pictures.Insert(path)` est la méthode utilisée pour insérer une image à partir d’un chemin local."
  },
  {
    "question": "Quelle propriété permet d’appliquer une fonction de somme sur un champ de TCD ?",
    "options": [
      ".Orientation = xlSum",
      ".Function = xlSum",
      ".AddField(\"Somme\")",
      ".Calculation = xlSum"
    ],
    "answer": "B",
    "explanation": "On utilise `.Function = xlSum` sur un champ défini comme `xlDataField` pour agréger les valeurs."
  },
  {
    "question": "Quel format de date garantit un nom de feuille unique avec horodatage ?",
    "options": [
      "Now()",
      "Format(Now, \"ddmmyyyy\")",
      "Format(Now, \"yyyymmdd_hhnnss\")",
      "Date & Time"
    ],
    "answer": "C",
    "explanation": "`Format(Now, \"yyyymmdd_hhnnss\")` garantit un nom unique et triable selon l’ordre chronologique."
  },
  {
    "question": "Quelle syntaxe permet d’itérer sur une plage de cellules ?",
    "options": [
      "While cell in Range",
      "For Each cell In plage",
      "Each cell Do",
      "Loop cell from plage"
    ],
    "answer": "B",
    "explanation": "`For Each cell In plage` est la syntaxe correcte pour boucler sur chaque cellule d'une plage définie."
  },
  {
    "question": "Quelle fonction teste si une cellule contient un nombre ?",
    "options": [
      "IsValue(cell)",
      "IsNumber(cell)",
      "IsNumeric(cell.Value)",
      "IsDigit(cell)"
    ],
    "answer": "C",
    "explanation": "`IsNumeric(cell.Value)` retourne True si la cellule contient un nombre valide."
  },
  {
    "question": "Quelle structure VBA est utilisée pour éviter de répéter un objet dans un bloc ?",
    "options": [
      "If...Then",
      "Do...Loop",
      "With...End With",
      "For...Each"
    ],
    "answer": "C",
    "explanation": "`With...End With` permet de référencer un objet une seule fois et d’y appliquer plusieurs propriétés ou méthodes."
  },
  {
    "question": "Quel mot-clé permet de quitter une Sub prématurément ?",
    "options": [
      "Stop",
      "Exit Sub",
      "Return",
      "End"
    ],
    "answer": "B",
    "explanation": "`Exit Sub` arrête immédiatement l’exécution d’une subroutine sans aller jusqu’à la fin du bloc."
  },
  {
    "question": "Quelle fonction permet de collecter un critère depuis l’utilisateur ?",
    "options": [
      "Input()",
      "MsgBox()",
      "InputBox()",
      "ReadLine()"
    ],
    "answer": "C",
    "explanation": "`InputBox()` affiche une boîte de saisie à l’utilisateur et retourne la valeur saisie."
  },
  {
    "question": "Quel opérateur permet une condition courte dans une seule ligne ?",
    "options": [
      "IIf()",
      "If Then",
      "Switch()",
      "Select Case"
    ],
    "answer": "A",
    "explanation": "`IIf(condition, vrai, faux)` agit comme un opérateur ternaire pour des expressions rapides."
  },
  {
    "question": "Quelle méthode permet de copier uniquement les lignes visibles d’un filtre ?",
    "options": [
      ".Copy",
      ".RangeVisible.Copy",
      ".SpecialCells(xlCellTypeVisible).Copy",
      ".Filter.CopyVisible"
    ],
    "answer": "C",
    "explanation": "`SpecialCells(xlCellTypeVisible)` cible uniquement les lignes visibles après un filtre automatique."
  },
  {
    "question": "Quel objet VBA permet de contenir des éléments uniques ?",
    "options": [
      "Array",
      "Collection",
      "List",
      "Dictionary"
    ],
    "answer": "B",
    "explanation": "Une `Collection` peut contenir des valeurs uniques si une clé (`CStr(val)`) est utilisée pour éviter les doublons."
  },
  {
    "question": "Comment éviter un filtre actif avant de relancer un nouveau filtre ?",
    "options": [
      "Filter.Clear()",
      "ws.Filters.Reset()",
      "If ws.AutoFilterMode Then ws.AutoFilterMode = False",
      "Range.Unfilter()"
    ],
    "answer": "C",
    "explanation": "La condition `If ws.AutoFilterMode Then ws.AutoFilterMode = False` supprime tout filtre actif avant d’en appliquer un nouveau."
  },
  {
    "question": "Pourquoi limiter un nom de feuille à 31 caractères en VBA ?",
    "options": [
      "Pour améliorer la lisibilité du code",
      "Parce qu'Excel refuse tout nom de feuille de plus de 31 caractères",
      "Pour éviter les erreurs de compilation",
      "Parce que les macros ne reconnaissent que les 31 premiers caractères"
    ],
    "answer": "B",
    "explanation": "Excel impose une limite stricte de 31 caractères pour le nom des feuilles. Dépasser cette limite génère une erreur à l’exécution."
  },
  {
    "question": "Quel est l’intérêt de copier uniquement les lignes visibles d’un filtre ?",
    "options": [
      "Pour éviter les erreurs de format",
      "Pour accélérer la macro",
      "Pour ne pas copier les lignes masquées par le filtre",
      "Pour trier automatiquement les données"
    ],
    "answer": "C",
    "explanation": "Seules les lignes visibles représentent les résultats pertinents du filtre. Copier tout inclurait les lignes cachées, ce qui fausserait l’analyse."
  },
  {
    "question": "Dans quel cas utiliser `InputBox()` est préférable à un champ de saisie manuel ?",
    "options": [
      "Lorsque l'utilisateur doit sélectionner une cellule",
      "Lorsque la saisie utilisateur est obligatoire dans une boucle automatique",
      "Lorsque tu veux éviter d’ouvrir une feuille spécifique",
      "Lorsque tu veux collecter un critère rapidement sans interface graphique complexe"
    ],
    "answer": "D",
    "explanation": "`InputBox()` est idéal pour demander une valeur ponctuelle, comme un nom ou une date, sans interface lourde ni formulaire personnalisé."
  },
  {
    "question": "Pourquoi utiliser `With...End With` dans une macro VBA ?",
    "options": [
      "Pour tester une condition sur plusieurs lignes",
      "Pour initialiser plusieurs objets à la fois",
      "Pour appliquer plusieurs instructions sur un même objet sans le répéter",
      "Pour optimiser les boucles imbriquées"
    ],
    "answer": "C",
    "explanation": "`With...End With` évite de répéter l’objet à chaque ligne, ce qui améliore la lisibilité et les performances du code."
  },
  {
    "question": "Quelle est la meilleure manière de structurer une macro de reporting pour plusieurs clients ?",
    "options": [
      "Faire un copier-coller manuel pour chaque feuille",
      "Créer une feuille vide et utiliser des formules Excel",
      "Parcourir les clients et générer dynamiquement les feuilles avec filtre et copie",
      "Utiliser une boucle Do Until avec une boîte de message"
    ],
    "answer": "C",
    "explanation": "L’approche dynamique avec boucle, filtre et copie permet d’automatiser totalement la génération de rapports personnalisés, sans intervention manuelle."
  }
  ],
  avance: [
    {
    "question": "Quel code permet de copier uniquement les lignes visibles après un filtre automatique ?",
    "options": [
      "plage.Copy",
      "plage.SpecialCells(xlCellTypeVisible).Copy",
      "plage.Rows.Hidden = False",
      "plage.VisibleCells.Copy"
    ],
    "answer": "B",
    "explanation": "`SpecialCells(xlCellTypeVisible)` cible uniquement les lignes visibles — c’est la méthode correcte après filtrage."
  },
  {
    "question": "Quel code permet de récupérer la dernière ligne non vide dans la colonne A ?",
    "options": [
      "ws.Range(\"A1\").End(xlDown).Row",
      "ws.Range(\"A:A\").Rows.Count",
      "ws.Cells(Rows.Count, 1).End(xlUp).Row",
      "ws.Columns(\"A\").End(xlDown).Row"
    ],
    "answer": "C",
    "explanation": "`Cells(Rows.Count, 1).End(xlUp).Row` remonte depuis le bas de la colonne pour trouver la dernière cellule utilisée."
  },
  {
    "question": "Quel code permet de générer un nom de feuille avec date et heure ?",
    "options": [
      "Sheets.Add.Name = Date()",
      "ws.Name = Time()",
      "ws.Name = Format(Now, \"dd-mm-yyyy\")",
      "ws.Name = Format(Now, \"yyyymmdd_hhnnss\")"
    ],
    "answer": "D",
    "explanation": "Le format `yyyymmdd_hhnnss` assure un nom horodaté unique compatible avec Excel."
  },
  {
    "question": "Quel code permet d'ajouter un champ 'Montant' en valeurs dans un TCD ?",
    "options": [
      "pt.AddField \"Montant\"",
      "pt.PivotFields(\"Montant\").Orientation = xlDataField",
      "pt.Fields(\"Montant\").Aggregate = Sum",
      "pt.AddDataField(\"Montant\")"
    ],
    "answer": "B",
    "explanation": "Pour définir un champ de valeurs dans un TCD, il faut définir `.Orientation = xlDataField` sur le champ."
  },
  {
    "question": "Quel code permet de tester si une valeur est numérique et non vide ?",
    "options": [
      "If IsNumeric(cell.Value)",
      "If cell.Value <> \"\"",
      "If Not IsEmpty(cell.Value) And IsNumeric(cell.Value)",
      "If IsNumber(cell.Value)"
    ],
    "answer": "C",
    "explanation": "La combinaison `Not IsEmpty` + `IsNumeric` garantit que la cellule est remplie et contient bien un nombre."
  },
  {
    "question": "Que fait le code suivant ?\n`Set ws = Sheets(\"Base\")`",
    "options": [
      "Supprime la feuille nommée 'Base'",
      "Crée une nouvelle feuille appelée 'Base'",
      "Crée un raccourci vers la feuille nommée 'Base'",
      "Active la feuille nommée 'Base'"
    ],
    "answer": "C",
    "explanation": "`Set ws = Sheets(\"Base\")` signifie que `ws` est un alias vers cette feuille, mais ne l’active pas automatiquement."
  },
  {
    "question": "Que fait ce code ?\n`If ws.AutoFilterMode Then ws.AutoFilterMode = False`",
    "options": [
      "Applique un filtre",
      "Réinitialise tout filtre actif sur la feuille",
      "Vérifie s’il y a des filtres mais ne fait rien",
      "Active le filtre automatique"
    ],
    "answer": "B",
    "explanation": "Ce code désactive tout filtre actif, ce qui est utile avant de poser de nouveaux critères."
  },
  {
    "question": "Quel est le rôle de ce code ?\n`uniqueClients.Add val, CStr(val)` avec `On Error Resume Next`",
    "options": [
      "Ajoute tous les doublons dans la collection",
      "Ignore les erreurs pour éviter les valeurs vides",
      "Ajoute uniquement les valeurs uniques dans une Collection",
      "Trie automatiquement les clients par nom"
    ],
    "answer": "C",
    "explanation": "L'utilisation de la valeur comme clé (`CStr(val)`) combinée à l'ignorance des erreurs empêche les doublons."
  },
  {
    "question": "Quel est l’effet de ce code ?\n`With ws.PageSetup: .Zoom = False: .FitToPagesWide = 1: End With`",
    "options": [
      "Réduit le zoom d'affichage à 1%",
      "Imprime sur une seule ligne verticale",
      "Adapte la feuille à la largeur d'une page à l'impression",
      "Réinitialise le zoom par défaut"
    ],
    "answer": "C",
    "explanation": "`FitToPagesWide = 1` limite l'impression à une page de large, utile pour les tableaux horizontaux."
  },
  {
    "question": "Que fait ce code ?\n`MsgBox \"Reportings générés avec succès !\", vbInformation`",
    "options": [
      "Affiche une erreur système",
      "Affiche un message avec icône d'information",
      "Lance une boîte de saisie",
      "Envoie un e-mail automatique"
    ],
    "answer": "B",
    "explanation": "`vbInformation` affiche une icône bleue avec un message de confirmation utilisateur."
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

<strong>Réponse :</strong>
<div className="answer-text answer-liste">
  {slide.answer}
</div>
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