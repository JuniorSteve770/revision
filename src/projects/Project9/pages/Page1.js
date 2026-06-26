// src/projects/BackendInterview/BackendInterviewQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Les 4 boucles C# — Quand les utiliser ?",
    answer:
      "◆ **for** : index numérique, nombre d'itérations connu\n```csharp\nfor (int i = 0; i < 10; i++) { ... }\n```\n◆ **foreach** : parcours complet d'une collection, sans index\n```csharp\nforeach (var item in collection) { ... }\n```\n◆ **while** : condition externe, nombre d'itérations inconnu\n```csharp\nwhile (condition) { ... }\n```\n◆ **do-while** : au moins une exécution garantie\n```csharp\ndo { ... } while (condition);\n```\n⚠️ Choisir la bonne boucle = déjà 50% du code juste",
  },
  // ==================== SLIDE 2: STRUCTURES ====================
  {
    question: "Les 4 structures de données essentielles",
    answer:
      "◆ **Array** : taille fixe, accès O(1) par index\n```csharp\nint[] tab = new int[5];\n```\n◆ **List<T>** : taille dynamique, accès O(1) par index\n```csharp\nvar list = new List<int>(); list.Add(10);\n```\n◆ **Dictionary<K,V>** : association clé→valeur, accès O(1) par clé\n```csharp\nvar dict = new Dictionary<string, int>(); dict[\"Alice\"] = 30;\n```\n◆ **HashSet<T>** : unicité garantie, Contains O(1)\n```csharp\nvar set = new HashSet<int>(); set.Add(1); set.Add(1); // ignore\n```\n⚠️ Le mauvais choix coûte en performance",
  },
  // ==================== SLIDE 3: PATTERN 1 ====================
  {
    question: "Pattern 1 — Parsing & Transformation",
    answer:
      "◆ **foreach** : parcourt la collection source\n◆ **for** : parcourt les sous-parties\n◆ **Add** : construit la structure résultante\n◆ **Piège** : for commence parfois à 1 pour ignorer un en-tête\n\n```csharp\nvar resultats = new List<(string, int)>();\n\nforeach (string ligne in donnees)\n{\n    string[] parts = ligne.Split(':');\n    string nom = parts[0];\n    int age = int.Parse(parts[1]);\n    resultats.Add((nom, age));\n}\n```\n⚠️ Pattern le plus fréquent dans les applications métier",
  },
  // ==================== SLIDE 4: PATTERN 2 ====================
  {
    question: "Pattern 2 — Initialisation & Unicité",
    answer:
      "◆ **for** : initialise N structures\n◆ **HashSet** : unicité garantie, Contains O(1)\n◆ **Indépendance** : chaque instance est séparée\n◆ **Piège** : HashSet = unicité, List = ordre\n\n```csharp\nint N = 5;\nvar groupes = new List<HashSet<int>>();\n\nfor (int i = 0; i < N; i++)\n    groupes.Add(new HashSet<int> { i });\n// Résultat : [{0}, {1}, {2}, {3}, {4}]\n```\n⚠️ HashSet = unicité, List = ordre",
  },
  // ==================== SLIDE 5: PATTERN 3 ====================
  {
    question: "Pattern 3 — Simulations & Matrices",
    answer:
      "◆ **for + for** : double boucle = deux dimensions\n◆ **j = i + 1** : évite les paires en double\n◆ **Simulation** : temps × espace\n◆ **Piège** : O(n²) peut être coûteux pour grandes collections\n\n```csharp\n// Matrice : lignes × colonnes\nfor (int l = 0; l < hauteur; l++)\n    for (int c = 0; c < largeur; c++)\n        grille[l, c] = 1;\n\n// Comparaison de paires (sans répétition)\nfor (int i = 0; i < n; i++)\n    for (int j = i + 1; j < n; j++)\n        if (elements[i] == elements[j])\n            Console.WriteLine(\"Doublon\");\n```\n⚠️ La double boucle est le pattern des problèmes à 2 dimensions",
  },
  // ==================== SLIDE 6: PATTERN 4 ====================
  {
    question: "Pattern 4 — Groupement & Indexation",
    answer:
      "◆ **ContainsKey** : vérifier l'existence\n◆ **Add** : créer si absent\n◆ **TryGetValue** : plus performant (1 accès au lieu de 2)\n◆ **Applications** : groupement, comptage, indexation\n\n```csharp\nvar index = new Dictionary<string, List<int>>();\n\nforeach (var item in donnees)\n{\n    string cle = item.Categorie;\n    if (!index.ContainsKey(cle))\n        index[cle] = new List<int>();\n    index[cle].Add(item.Id);\n}\n\n// Version optimisée avec TryGetValue\nif (!index.TryGetValue(cle, out var liste))\n{\n    liste = new List<int>();\n    index[cle] = liste;\n}\nliste.Add(item.Id);\n```\n⚠️ ContainsKey + indexeur = 2 accès → TryGetValue = 1 accès",
  },
  // ==================== SLIDE 7: PATTERN 5 ====================
  {
    question: "Pattern 5 — Agrégation Imbriquée",
    answer:
      "◆ **Trois niveaux** : groupes → membres → données\n◆ **Complexité** : O(n³)\n◆ **Application** : propagation dans réseaux\n◆ **Piège** : O(n³) à éviter sur grandes collections\n\n```csharp\nforeach (var groupe in groupes.Values)\n{\n    if (groupe.Count < 2) continue;\n    var toutes = new HashSet<int>();\n\n    foreach (int membre in groupe)\n        foreach (int info in donnees[membre])\n            toutes.Add(info);\n\n    foreach (int membre in groupe)\n        donnees[membre] = new HashSet<int>(toutes);\n}\n```\n⚠️ La triple boucle est souvent refactorisable avec LINQ",
  },
  // ==================== SLIDE 8: PATTERN 6 ====================
  {
    question: "Pattern 6 — Validation & Sortie Anticipée",
    answer:
      "◆ **break** : sort de la boucle courante seulement\n◆ **return** : sort de toute la méthode\n◆ **continue** : passe à l'itération suivante\n◆ **Gain** : évite de parcourir inutilement\n\n```csharp\nbool tousPositifs = true;\nfor (int i = 0; i < tableau.Length; i++)\n{\n    if (tableau[i] <= 0)\n    {\n        tousPositifs = false;\n        break;\n    }\n}\n\nbool TousPositifs(int[] tab)\n{\n    foreach (int v in tab)\n        if (v <= 0) return false;\n    return true;\n}\n```\n⚠️ break = sort de la boucle, return = sort de la méthode",
  },
  // ==================== SLIDE 9: COMPLEXITE ====================
  {
    question: "Complexités & Optimisation",
    answer:
      "◆ **O(1)** : Array, Dictionary, HashSet\n◆ **O(n)** : List.Contains\n◆ **O(n²)** : double boucle\n◆ **Optimisation** : pré-calculer avec HashSet pour réduire O(n²) → O(n)\n\n```csharp\n// O(n²) — double boucle\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        // n² opérations\n\n// O(n²) → O(n) avec HashSet\nvar set = new HashSet<int>(listeB);\nforeach (int a in listeA)\n    if (set.Contains(a))\n        intersection.Add(a);\n\n// Gain : 1 000 000 opérations → 2 000 opérations\n```\n⚠️ Les structures de données transforment la complexité d'un algorithme",
  },
  // ==================== SLIDE 10: METHODOLOGIE ====================
{
  question: "Comment reconnaître un pattern ? — Méthode en 6 questions",
  answer:
    "◆ **1. Que reçoit le programme ?**\nEntrée : texte, tableau, grille, fichier, collection...\n\n◆ **2. Que veut-on obtenir ?**\nRésultat : liste, dictionnaire, booléen, nombre, structure...\n\n◆ **3. Que faut-il faire ?**\nLire ? Compter ? Chercher ? Grouper ? Simuler ? Transformer ?\n\n◆ **4. Quelle structure choisir ?**\nArray (fixe) ? List (dynamique) ? Dictionary (indexation) ? HashSet (unicité) ?\n\n◆ **5. Quelle boucle utiliser ?**\nfor (index) ? foreach (parcours) ? while (condition externe) ?\n\n◆ **6. Quelle est la complexité ?**\nO(1) (constant) ? O(n) (linéaire) ? O(n²) (quadratique) ? O(n³) (cubique) ?\n\n```csharp\n// Exemple d'application :\n// Entrée : liste de chaînes \"Prénom:Age\"\n// Sortie : Dictionary<string, int> avec les âges\n// Action : parser chaque ligne → Split(':')\n// Structure : Dictionary<string, int>\n// Boucle : foreach sur la liste\n// Complexité : O(n) (une passe sur n éléments)\n```\n⚠️ 80% du problème est résolu quand on a répondu à ces 6 questions",
},
];


const questions = {
  moyen: [
    // ==================== SECTION A: CHOIX DE LA BOUCLE (6 questions) ====================
    {
      question:
        "[Boucles] Vous devez parcourir une liste de 1000 clients et afficher leur nom. Vous n'avez pas besoin d'index. Quelle boucle choisissez-vous ?",
      options: [
        "for (int i = 0; i < clients.Count; i++)",
        "foreach (var client in clients) — plus lisible, sans index",
        "while (i < clients.Count)",
        "do-while (i < clients.Count)",
      ],
      answer: "foreach (var client in clients) — plus lisible, sans index",
      explanation:
        "foreach est le choix naturel quand on parcourt TOUS les éléments d'une collection SANS avoir besoin d'un index. Le code est plus lisible et moins sujet aux erreurs d'index.",
    },
    {
      question:
        "[Boucles] Vous devez afficher les nombres de 0 à 99 (100 itérations). Quelle boucle est la plus adaptée ?",
      options: [
        "for (int i = 0; i < 100; i++) — nombre d'itérations connu, index nécessaire",
        "foreach (int i in Enumerable.Range(0, 100))",
        "while (i < 100)",
        "do-while (i < 100)",
      ],
      answer: "for (int i = 0; i < 100; i++) — nombre d'itérations connu, index nécessaire",
      explanation:
        "for est la boucle idéale quand le nombre d'itérations est connu à l'avance et qu'on a besoin d'un index. C'est le cas le plus classique pour for.",
    },
    {
      question:
        "[Boucles] Vous devez lire un fichier ligne par ligne jusqu'à la fin. Vous ne connaissez pas le nombre de lignes à l'avance. Quelle boucle utilisez-vous ?",
      options: [
        "for (int i = 0; i < 1000; i++) — on suppose 1000 lignes",
        "foreach (string ligne in File.ReadLines(fichier))",
        "while ((ligne = fichier.ReadLine()) != null) — condition externe",
        "do-while (ligne != null) — exécution garantie une fois",
      ],
      answer: "while ((ligne = fichier.ReadLine()) != null) — condition externe",
      explanation:
        "while est adapté quand la condition de sortie dépend d'un état externe (fin de fichier, saisie utilisateur). On ne sait pas combien d'itérations il y aura.",
    },
    {
      question:
        "[Boucles] Vous devez demander un mot de passe à l'utilisateur jusqu'à ce qu'il soit correct. L'utilisateur doit pouvoir essayer au moins une fois. Quelle boucle est la plus adaptée ?",
      options: [
        "for (int i = 0; i < 3; i++) — on limite à 3 essais",
        "while (motDePasse != \"secret\") — condition vérifiée avant la saisie",
        "do { saisie = Console.ReadLine(); } while (saisie != \"secret\") — au moins une tentative garantie",
        "foreach (string tentative in essais) — liste d'essais prédéfinis",
      ],
      answer: "do { saisie = Console.ReadLine(); } while (saisie != \"secret\") — au moins une tentative garantie",
      explanation:
        "do-while garantit que le code s'exécute au moins une fois. C'est parfait pour les saisies utilisateur où on veut laisser une chance même si la condition est déjà fausse.",
    },
    {
      question:
        "[Boucles] Dans ce code, qu'affiche la boucle ?\n\n```for (int i = 5; i > 0; i--)\n    Console.Write(i + \" \");\n```",
      options: [
        "1 2 3 4 5 (croissant)",
        "5 4 3 2 1 (décroissant)",
        "4 3 2 1 (i commence à 5 mais décrémenté avant affichage)",
        "5 4 3 2 1 0 (s'arrête après 0)",
      ],
      answer: "5 4 3 2 1 (décroissant)",
      explanation:
        "La boucle commence à 5, affiche i, puis décrémente. Elle continue tant que i > 0. Donc elle affiche 5,4,3,2,1. L'ordre est décroissant.",
    },
    {
      question:
        "[Boucles] Quelle est l'erreur dans ce code ?\n\n```string[] noms = { \"Alice\", \"Bob\", \"Charlie\" };\nfor (int i = 0; i <= noms.Length; i++)\n    Console.WriteLine(noms[i]);\n```",
      options: [
        "Aucune erreur, le code fonctionne parfaitement",
        "La condition `i <= noms.Length` provoque un index hors limites (i = noms.Length → IndexOutOfRangeException)",
        "Il manque l'incrémentation de i",
        "Il faut utiliser foreach et non for",
      ],
      answer: "La condition `i <= noms.Length` provoque un index hors limites (i = noms.Length → IndexOutOfRangeException)",
      explanation:
        "Pour un tableau de longueur 3, les indices valides sont 0, 1, 2. La condition `i <= noms.Length` (i <= 3) permet i=3, ce qui provoque une IndexOutOfRangeException. Il faut utiliser `<` et non `<=`.",
    },

    // ==================== SECTION B: CHOIX DE LA STRUCTURE (6 questions) ====================
    {
      question:
        "[Structures] Vous devez stocker les jours de la semaine (7 éléments fixes, ne change jamais). Quelle structure est la plus adaptée ?",
      options: [
        "List<string> — flexible mais surdimensionné",
        "Array (string[] jours = new string[7]) — taille fixe, parfait",
        "Dictionary<int, string> — associatif, inutile ici",
        "HashSet<string> — unicité, mais pas d'ordre garanti",
      ],
      answer: "Array (string[] jours = new string[7]) — taille fixe, parfait",
      explanation:
        "Array est la structure idéale quand la taille est fixe et connue à l'avance. Elle ne change jamais. C'est plus léger qu'une List et l'accès est O(1).",
    },
    {
      question:
        "[Structures] Vous devez stocker une liste de courses qui peut grandir (ajouts fréquents). Quelle structure est la plus adaptée ?",
      options: [
        "Array (taille fixe) — impossible d'ajouter au-delà de la taille",
        "List<string> — taille dynamique, Add() en fin est O(1) amorti",
        "Dictionary<int, string> — associatif, inutile pour une liste simple",
        "HashSet<string> — unicité, mais on peut avoir des doublons dans une liste de courses",
      ],
      answer: "List<string> — taille dynamique, Add() en fin est O(1) amorti",
      explanation:
        "List<T> est la structure standard pour les collections de taille variable. Add() en fin est O(1) amorti, et on peut accéder par index en O(1). C'est le choix polyvalent.",
    },
    {
      question:
        "[Structures] Vous devez associer le nom d'un employé à son salaire (recherche par nom rapide). Quelle structure est la plus adaptée ?",
      options: [
        "List<(string, decimal)> — recherche O(n) linéaire",
        "Dictionary<string, decimal> — accès par clé O(1), parfait",
        "HashSet<(string, decimal)> — unicité, mais pas d'accès par clé",
        "Array (nom, salaire) — taille fixe, pas adapté",
      ],
      answer: "Dictionary<string, decimal> — accès par clé O(1), parfait",
      explanation:
        "Dictionary<K,V> offre un accès O(1) par clé. C'est la structure idéale pour les associations clé → valeur (nom → salaire). La recherche par nom est instantanée.",
    },
    {
      question:
        "[Structures] Vous devez stocker des identifiants d'utilisateurs sans doublons et vérifier rapidement si un identifiant existe déjà. Quelle structure est la plus adaptée ?",
      options: [
        "List<int> — Contains est O(n), lent sur grandes collections",
        "HashSet<int> — Contains O(1), unicité garantie automatiquement",
        "Array<int> — taille fixe, pas de vérification de doublon",
        "Dictionary<int, bool> — fonctionne mais surdimensionné (on n'a pas besoin de valeur)",
      ],
      answer: "HashSet<int> — Contains O(1), unicité garantie automatiquement",
      explanation:
        "HashSet<T> est conçu pour l'unicité et les tests d'appartenance rapides. Contains est O(1) et Add ignore automatiquement les doublons. C'est la structure standard pour ce besoin.",
    },
    {
      question:
        "[Structures] Vous devez regrouper des commandes par pays. Chaque pays peut avoir plusieurs commandes. Quelle structure est la plus adaptée ?",
      options: [
        "Dictionary<string, List<Commande>> — clé = pays, valeur = liste de commandes",
        "List<Commande> avec filtrage par pays — O(n) à chaque recherche",
        "HashSet<Commande> — pas de regroupement par pays",
        "Array de (pays, commande) — taille fixe, pas évolutif",
      ],
      answer: "Dictionary<string, List<Commande>> — clé = pays, valeur = liste de commandes",
      explanation:
        "C'est le pattern de groupement par clé (Pattern 4). La clé est le pays, la valeur est une liste de commandes. On peut ajouter des commandes et récupérer la liste d'un pays en O(1).",
    },
    {
      question:
        "[Structures] Quelle est la complexité de Contains() sur une List<T> de taille n ?",
      options: [
        "O(1) — accès constant comme Dictionary",
        "O(log n) — recherche dichotomique",
        "O(n) — recherche linéaire, doit parcourir toute la liste",
        "O(n²) — double boucle implicite",
      ],
      answer: "O(n) — recherche linéaire, doit parcourir toute la liste",
      explanation:
        "List<T>.Contains() effectue une recherche linéaire : elle parcourt les éléments un par un jusqu'à trouver la valeur. En moyenne, elle parcourt la moitié de la liste, donc O(n). HashSet est O(1) pour Contains.",
    },

    // ==================== SECTION C: IDENTIFICATION DES PATTERNS (6 questions) ====================
    {
      question:
        "[Patterns] Quel pattern est utilisé dans ce code ?\n\n```var resultats = new List<int>();\nforeach (string ligne in fichier)\n{\n    string[] parts = ligne.Split(',');\n    for (int i = 1; i < parts.Length; i++)\n        resultats.Add(int.Parse(parts[i]));\n}\n```",
      options: [
        "Pattern 2 — for + HashSet (initialisation)",
        "Pattern 1 — foreach + for + Add (parsing & transformation)",
        "Pattern 3 — for + for (simulation matricielle)",
        "Pattern 6 — boucle + break (validation)",
      ],
      answer: "Pattern 1 — foreach + for + Add (parsing & transformation)",
      explanation:
        "Ce code parse des données texte (lignes CSV) et les transforme en entiers. foreach parcourt les lignes, for parcourt les champs (en commençant à 1 pour ignorer l'en-tête), et Add construit la liste résultat. C'est le Pattern 1.",
    },
    {
      question:
        "[Patterns] Quel pattern est utilisé dans ce code ?\n\n```int N = 10;\nvar groupes = new List<HashSet<int>>();\nfor (int i = 0; i < N; i++)\n    groupes.Add(new HashSet<int> { i });\n```",
      options: [
        "Pattern 1 — parsing et transformation",
        "Pattern 2 — for + HashSet (initialisation de N groupes indépendants)",
        "Pattern 4 — groupement par clé",
        "Pattern 5 — agrégation imbriquée",
      ],
      answer: "Pattern 2 — for + HashSet (initialisation de N groupes indépendants)",
      explanation:
        "Ce code crée N HashSet indépendants, chacun contenant son propre index. C'est l'initialisation de structures par une boucle for, avec HashSet pour l'unicité. C'est le Pattern 2.",
    },
    {
      question:
        "[Patterns] Quel pattern est utilisé dans ce code ?\n\n```for (int l = 0; l < hauteur; l++)\n    for (int c = 0; c < largeur; c++)\n        grille[l, c] = (l + c) % 2 == 0 ? 1 : 0;\n```",
      options: [
        "Pattern 3 — for + for (simulation / matrice)",
        "Pattern 5 — triple foreach (agrégation)",
        "Pattern 4 — groupement avec Dictionary",
        "Pattern 1 — parsing de données",
      ],
      answer: "Pattern 3 — for + for (simulation / matrice)",
      explanation:
        "La double boucle (for + for) est le pattern des problèmes à deux dimensions. Ici, elle remplit une grille (matrice) avec un motif en damier. C'est le Pattern 3.",
    },
    {
      question:
        "[Patterns] Quel pattern est utilisé dans ce code ?\n\n```var index = new Dictionary<string, List<int>>();\nforeach (var item in donnees)\n{\n    if (!index.ContainsKey(item.Categorie))\n        index[item.Categorie] = new List<int>();\n    index[item.Categorie].Add(item.Id);\n}\n```",
      options: [
        "Pattern 2 — for + HashSet (initialisation)",
        "Pattern 1 — parsing (foreach + for + Add)",
        "Pattern 4 — foreach + ContainsKey + Add (groupement par clé)",
        "Pattern 6 — validation avec break",
      ],
      answer: "Pattern 4 — foreach + ContainsKey + Add (groupement par clé)",
      explanation:
        "Ce code groupe des éléments par catégorie. Pour chaque élément, on vérifie si la clé existe déjà (ContainsKey), on crée une liste si elle n'existe pas, puis on ajoute l'élément. C'est le Pattern 4 classique.",
    },
    {
      question:
        "[Patterns] Quel pattern est utilisé dans ce code ?\n\n```foreach (var groupe in groupes)\n{\n    if (groupe.Count < 2) continue;\n    var fusion = new HashSet<int>();\n    foreach (int membre in groupe)\n        foreach (int val in donnees[membre])\n            fusion.Add(val);\n    foreach (int membre in groupe)\n        donnees[membre] = new HashSet<int>(fusion);\n}\n```",
      options: [
        "Pattern 3 — for + for (double boucle simple)",
        "Pattern 5 — triple foreach (agrégation imbriquée, 3 niveaux)",
        "Pattern 4 — groupement avec Dictionary",
        "Pattern 1 — parsing de données",
      ],
      answer: "Pattern 5 — triple foreach (agrégation imbriquée, 3 niveaux)",
      explanation:
        "Ce code traverse une hiérarchie à trois niveaux : groupes → membres → données. Il collecte toutes les données d'un groupe et les distribue à tous les membres. C'est le Pattern 5 (agrégation imbriquée).",
    },
    {
      question:
        "[Patterns] Quel pattern est utilisé dans ce code ?\n\n```bool tousPositifs = true;\nfor (int i = 0; i < tableau.Length; i++)\n{\n    if (tableau[i] <= 0)\n    {\n        tousPositifs = false;\n        break;\n    }\n}\n```",
      options: [
        "Pattern 6 — boucle + break (validation et sortie anticipée)",
        "Pattern 3 — simulation avec double boucle",
        "Pattern 1 — parsing et transformation",
        "Pattern 2 — initialisation de structures",
      ],
      answer: "Pattern 6 — boucle + break (validation et sortie anticipée)",
      explanation:
        "Ce code vérifie une condition sur tous les éléments. Dès qu'un élément ne satisfait pas la condition, on utilise break pour sortir de la boucle. C'est le Pattern 6 (validation avec sortie anticipée).",
    },

    // ==================== SECTION D: PIEGES & BUGS (8 questions) ====================
    {
      question:
        "[Piège] Quel est le bug dans ce code ?\n\n```string[] mots = { \"chat\", \"chien\", \"oiseau\", \"poisson\" };\nforeach (string mot in mots)\n{\n    if (i % 2 == 0)\n        Console.WriteLine(mot);\n}\n```",
      options: [
        "La condition `i % 2 == 0` utilise `i` qui n'est pas défini dans foreach",
        "Le code affiche tous les mots alors qu'il devrait afficher uniquement les pairs",
        "Il manque une incrémentation de i",
        "Le code est correct, il n'y a pas d'erreur",
      ],
      answer: "La condition `i % 2 == 0` utilise `i` qui n'est pas défini dans foreach",
      explanation:
        "foreach ne donne pas accès à un index. La variable `i` n'est pas déclarée. Si on a besoin d'un index, on doit utiliser for (int i = 0; i < mots.Length; i++) et accéder à mots[i].",
    },
    {
      question:
        "[Piège] Quel est le bug dans ce code ?\n\n```var occurrences = new Dictionary<string, int>();\nstring[] mots = { \"le\", \"chat\", \"le\", \"chien\" };\nforeach (string mot in mots)\n{\n    occurrences[mot]++; // BUG\n}\n```",
      options: [
        "La syntaxe occurrences[mot]++ est invalide en C#",
        "Dictionary lève une KeyNotFoundException car la clé n'existe pas encore",
        "Il faut utiliser un HashSet au lieu d'un Dictionary",
        "Aucune erreur, le code fonctionne",
      ],
      answer: "Dictionary lève une KeyNotFoundException car la clé n'existe pas encore",
      explanation:
        "On ne peut pas accéder à `occurrences[mot]` si la clé n'existe pas dans le Dictionary. Il faut vérifier avec ContainsKey ou TryGetValue avant d'incrémenter. Sinon, KeyNotFoundException.",
    },
    {
      question:
        "[Piège] Ce code a un problème de performance. Lequel ?\n\n```var vus = new List<int>();\nforeach (int item in collection)\n{\n    if (!vus.Contains(item))\n        vus.Add(item);\n}\n```",
      options: [
        "List.Contains() est O(n), donc la boucle est O(n²) — utiliser HashSet à la place",
        "Le code est correct, aucune optimisation nécessaire",
        "Il faut utiliser un Dictionary, pas une List",
        "Il faut utiliser foreach sur vus, pas sur collection",
      ],
      answer: "List.Contains() est O(n), donc la boucle est O(n²) — utiliser HashSet à la place",
      explanation:
        "List.Contains() est O(n). Pour chaque élément de la collection, on fait une recherche dans vus. Le coût total est O(n²). Solution : utiliser HashSet<int> dont Contains est O(1), ramenant le tout à O(n).",
    },
    {
      question:
        "[Piège] Que se passe-t-il dans ce code ?\n\n```var liste = new List<int> { 1, 2, 3 };\nforeach (int item in liste)\n{\n    if (item == 2)\n        liste.Remove(item);\n}\n```",
      options: [
        "Le code fonctionne normalement",
        "InvalidOperationException — on modifie la collection pendant son parcours",
        "Seul l'élément 2 est supprimé",
        "La boucle ignore la suppression et continue",
      ],
      answer: "InvalidOperationException — on modifie la collection pendant son parcours",
      explanation:
        "On ne peut pas modifier une collection (ajouter, supprimer) pendant un foreach. Cela lève une InvalidOperationException. Il faut utiliser for (int i = liste.Count - 1; i >= 0; i--) pour supprimer en parcourant à l'envers.",
    },
    {
      question:
        "[Piège] Quelle est la sortie de ce code ?\n\n```int[] tab = { 1, 2, 3, 4, 5 };\nfor (int i = 0; i < tab.Length; i++)\n{\n    if (tab[i] == 3) break;\n    Console.Write(tab[i] + \" \");\n}\n```",
      options: [
        "1 2 3 4 5",
        "1 2 3",
        "1 2 (break sort avant d'afficher 3)",
        "1 2 4 5",
      ],
      answer: "1 2 (break sort avant d'afficher 3)",
      explanation:
        "break sort de la boucle immédiatement. Quand i=2 (tab[2]=3), la condition est vraie, break est exécuté, et la boucle se termine sans afficher 3, 4, ou 5.",
    },
    {
      question:
        "[Piège] Quelle est la différence entre break et continue dans une boucle ?",
      options: [
        "break sort de la boucle, continue passe à l'itération suivante",
        "continue sort de la boucle, break passe à l'itération suivante",
        "break et continue font la même chose",
        "break sort de la méthode entière, continue sort de la boucle",
      ],
      answer: "break sort de la boucle, continue passe à l'itération suivante",
      explanation:
        "break : sort immédiatement de la boucle (fin de la boucle). continue : saute le reste du bloc actuel et passe à l'itération suivante. return sort de toute la méthode.",
    },
    {
      question:
        "[Piège] Dans ce code, quelle ligne cause un problème ?\n\n```var dict = new Dictionary<string, int>();\n// Ligne 1\ndict[\"Alice\"] = 30;\n// Ligne 2\nint age = dict[\"Bob\"];\n// Ligne 3\ndict[\"Charlie\"] = 25;\n```",
      options: [
        "Ligne 1 : la syntaxe est incorrecte pour ajouter une clé",
        "Ligne 2 : la clé \"Bob\" n'existe pas → KeyNotFoundException",
        "Ligne 3 : on ne peut pas ajouter après une lecture",
        "Aucune erreur, le code est correct",
      ],
      answer: "Ligne 2 : la clé \"Bob\" n'existe pas → KeyNotFoundException",
      explanation:
        "Accéder à dict[\"Bob\"] sans vérifier que la clé existe lève une KeyNotFoundException. Il faut utiliser ContainsKey ou TryGetValue. L'ajout avec l'indexeur (dict[\"Alice\"] = 30) est correct.",
    },
    {
      question:
        "[Piège] Ce code parse un CSV mais a un bug. Lequel ?\n\n```string[] lignes = { \"Nom,Age,Ville\", \"Alice,30,Paris\", \"Bob,25,Lyon\" };\nforeach (string ligne in lignes)\n{\n    string[] parts = ligne.Split(',');\n    string nom = parts[0];\n    int age = int.Parse(parts[1]);\n    Console.WriteLine($\"{nom} a {age} ans\");\n}\n```",
      options: [
        "Le code ignore l'en-tête et tente de parser \"Nom\" en int → FormatException",
        "Le code est correct, il fonctionne parfaitement",
        "Il manque une vérification des bornes sur parts",
        "Il faut utiliser un Dictionary, pas une List",
      ],
      answer: "Le code ignore l'en-tête et tente de parser \"Nom\" en int → FormatException",
      explanation:
        "La première ligne est un en-tête (\"Nom,Age,Ville\"). Le code tente de parser \"Age\" (la chaîne \"Age\") en int, ce qui lève une FormatException. Il faut ignorer l'en-tête avec Skip(1) ou vérifier le contenu.",
    },

    // ==================== SECTION E: COMPLEXITE & OPTIMISATION (4 questions) ====================
    {
      question:
        "[Complexité] Quelle est la complexité de ce code ?\n\n```for (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        if (listeA[i] == listeB[j]) intersection.Add(listeA[i]);\n```",
      options: [
        "O(n) — linéaire",
        "O(n log n) — logarithmique-linéaire",
        "O(n²) — quadratique (double boucle)",
        "O(1) — constant",
      ],
      answer: "O(n²) — quadratique (double boucle)",
      explanation:
        "La double boucle imbriquée parcourt n × n = n² paires. C'est O(n²). Pour n=1000, cela fait 1 000 000 opérations.",
    },
    {
      question:
        "[Complexité] Comment optimiser ce code O(n²) en O(n) ?\n\n```foreach (int a in listeA)\n    foreach (int b in listeB)\n        if (a == b) intersection.Add(a);\n```",
      options: [
        "Remplacer listeA par un HashSet",
        "Remplacer listeB par un HashSet et parcourir listeA avec Contains",
        "Remplacer les deux listes par des Arrays",
        "C'est impossible, la complexité est inhérente au problème",
      ],
      answer: "Remplacer listeB par un HashSet et parcourir listeA avec Contains",
      explanation:
        "En convertissant listeB en HashSet, Contains devient O(1). Puis on parcourt listeA une seule fois (O(n)) et on vérifie l'appartenance en O(1). Gain : O(n²) → O(n).",
    },
    {
      question:
        "[Complexité] HashSet<T>.Contains() a quelle complexité ?",
      options: [
        "O(1) en moyenne (grâce à la table de hachage)",
        "O(log n) (arbre équilibré)",
        "O(n) (recherche linéaire)",
        "O(n²) (recherche quadratique)",
      ],
      answer: "O(1) en moyenne (grâce à la table de hachage)",
      explanation:
        "HashSet utilise une table de hachage. Contains est O(1) en moyenne, ce qui le rend très efficace pour les tests d'appartenance. C'est l'avantage principal par rapport à List qui est O(n).",
    },
    {
      question:
        "[Complexité] Quelle est la complexité de List<T>.Add() en fin de liste (cas normal) ?",
      options: [
        "O(1) amorti (l'allocation supplémentaire est rare)",
        "O(log n) (recherche de la position)",
        "O(n) (copie complète de la liste)",
        "O(n²) (quadratique)",
      ],
      answer: "O(1) amorti (l'allocation supplémentaire est rare)",
      explanation:
        "List.Add() est O(1) amorti. Quand la capacité interne est dépassée, une nouvelle allocation plus grande est faite (O(n)), mais cela arrive rarement. En moyenne, l'ajout est très rapide.",
    },

    // ==================== SECTION F: TRYGETVALUE & LINQ (4 questions) ====================
    {
      question:
        "[Modernisation] Quelle est l'avantage de TryGetValue sur ContainsKey + indexeur ?",
      options: [
        "TryGetValue est plus lisible uniquement",
        "TryGetValue effectue 1 accès au Dictionary au lieu de 2 (plus performant)",
        "TryGetValue évite les exceptions, ContainsKey non",
        "TryGetValue est obsolète, il faut utiliser ContainsKey",
      ],
      answer: "TryGetValue effectue 1 accès au Dictionary au lieu de 2 (plus performant)",
      explanation:
        "ContainsKey + indexeur = 2 accès au Dictionary. TryGetValue = 1 seul accès. C'est plus performant et plus concis. Les deux sont sûrs (pas d'exception).",
    },
    {
      question:
        "[Modernisation] Que fait ce code LINQ ?\n\n```var resultat = collection.Where(x => x > 0).Select(x => x * 2).ToList();\n```",
      options: [
        "Filtre les éléments positifs, puis les multiplie par 2, et convertit en List",
        "Multiplie tous les éléments par 2, puis filtre les positifs",
        "Filtre les éléments pairs seulement",
        "Trie la collection par ordre croissant",
      ],
      answer: "Filtre les éléments positifs, puis les multiplie par 2, et convertit en List",
      explanation:
        "Where filtre (garde les > 0). Select transforme (multiplie par 2). ToList convertit le résultat en List. L'ordre des opérations est : filtrage, puis transformation.",
    },
    {
      question:
        "[Modernisation] Comment remplacer ce code par LINQ ?\n\n```var groupes = new Dictionary<string, List<int>>();\nforeach (var item in items)\n{\n    if (!groupes.ContainsKey(item.Categorie))\n        groupes[item.Categorie] = new List<int>();\n    groupes[item.Categorie].Add(item.Id);\n}\n```",
      options: [
        "var groupes = items.GroupBy(x => x.Categorie).ToDictionary(g => g.Key, g => g.Select(x => x.Id).ToList());",
        "var groupes = items.Select(x => x.Categorie).Distinct().ToDictionary(c => c, c => new List<int>());",
        "var groupes = items.OrderBy(x => x.Categorie).GroupBy(x => x.Categorie);",
        "Impossible en LINQ, il faut garder la boucle",
      ],
      answer: "var groupes = items.GroupBy(x => x.Categorie).ToDictionary(g => g.Key, g => g.Select(x => x.Id).ToList());",
      explanation:
        "GroupBy fait le regroupement. ToDictionary transforme chaque groupe en une clé (la catégorie) et une valeur (la liste des Id). C'est l'équivalent LINQ du Pattern 4.",
    },
    {
      question:
        "[Modernisation] Quelle est la différence entre LINQ et une boucle for/foreach ?",
      options: [
        "LINQ est toujours plus rapide que les boucles",
        "LINQ est déclaratif (on dit CE QU'ON VEUT), les boucles sont impératives (on dit COMMENT LE FAIRE)",
        "LINQ ne fonctionne que sur les List, pas sur les Array",
        "Il n'y a pas de différence, LINQ est juste une syntaxe différente",
      ],
      answer: "LINQ est déclaratif (on dit CE QU'ON VEUT), les boucles sont impératives (on dit COMMENT LE FAIRE)",
      explanation:
        "LINQ : on décrit le résultat souhaité (Where, Select, GroupBy). Boucles : on décrit chaque étape (if, ajout, variable intermédiaire). LINQ est plus lisible pour les transformations simples.",
    },

    // ==================== SECTION G: CAS PRATIQUES (6 questions) ====================
    {
      question:
        "[Cas pratique] Vous avez un fichier CSV. Vous devez ignorer la première ligne (en-tête). Comment faire ?",
      options: [
        "foreach (string ligne in lignes) { if (ligne == lignes[0]) continue; ... }",
        "foreach (string ligne in lignes.Skip(1)) { ... } (LINQ)",
        "for (int i = 0; i < lignes.Length; i++) { ... } — vérifier i == 0",
        "Toutes les réponses ci-dessus sont correctes",
      ],
      answer: "Toutes les réponses ci-dessus sont correctes",
      explanation:
        "Toutes ces méthodes permettent d'ignorer l'en-tête. Skip(1) est la plus élégante avec LINQ. La condition `if (ligne == lignes[0])` fonctionne mais est moins robuste (si le même contenu apparaît ailleurs).",
    },
    {
      question:
        "[Cas pratique] Vous devez créer un index des mots par première lettre. Quelle structure choisissez-vous ?",
      options: [
        "Dictionary<char, List<string>> — clé = lettre, valeur = liste de mots",
        "List<(char, string)> — recherche linéaire par lettre",
        "HashSet<(char, string)> — unicité, mais pas de regroupement",
        "Array de 26 listes (une par lettre) — moins flexible",
      ],
      answer: "Dictionary<char, List<string>> — clé = lettre, valeur = liste de mots",
      explanation:
        "C'est le Pattern 4 classique : on groupe par clé. La clé est la première lettre, la valeur est la liste des mots commençant par cette lettre. La recherche par lettre est O(1).",
    },
    {
      question:
        "[Cas pratique] Vous devez vérifier si une collection ne contient QUE des éléments positifs (et s'arrêter dès qu'un négatif est trouvé). Quel pattern utilisez-vous ?",
      options: [
        "Pattern 1 — parsing avec foreach + for",
        "Pattern 4 — groupement avec Dictionary",
        "Pattern 6 — boucle avec return/break (validation et sortie anticipée)",
        "Pattern 3 — simulation avec double boucle",
      ],
      answer: "Pattern 6 — boucle avec return/break (validation et sortie anticipée)",
      explanation:
        "On parcourt la collection jusqu'à trouver un négatif. Dès qu'on en trouve un, on retourne false (return) ou on break. C'est le Pattern 6 : validation avec sortie anticipée.",
    },
    {
      question:
        "[Cas pratique] Pour un tournoi round-robin (chaque équipe affronte chaque autre), comment itérer sur toutes les paires sans répétition ?",
      options: [
        "for (int i = 0; i < n; i++) for (int j = 0; j < n; j++)",
        "for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++)",
        "foreach (var e1 in equipes) foreach (var e2 in equipes)",
        "C'est impossible en C#, il faut utiliser LINQ",
      ],
      answer: "for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++)",
      explanation:
        "Pour éviter les doublons (équipe A vs équipe B est la même que B vs A), on fait démarrer j à i+1. Ainsi, on ne parcourt que les paires uniques, sans répétitions ni doublons.",
    },
    {
      question:
        "[Cas pratique] Vous devez compter les occurrences de chaque mot dans un texte. Quelle est l'approche correcte ?",
      options: [
        "Dictionary<string, int> avec ContainsKey pour initialiser à 0 avant d'incrémenter",
        "List<string> avec Contains pour vérifier l'existence",
        "HashSet<string> pour stocker les mots uniques seulement",
        "Array de 26 lettres pour les premières lettres",
      ],
      answer: "Dictionary<string, int> avec ContainsKey pour initialiser à 0 avant d'incrémenter",
      explanation:
        "Le Pattern 4 s'applique : on groupe par mot (clé) et on incrémente le compteur (valeur). Il faut initialiser la clé à 0 avant d'incrémenter, sinon KeyNotFoundException.",
    },
    {
      question:
        "[Cas pratique] Dans le problème du Gossip, pourquoi utilise-t-on un HashSet pour les gossip plutôt qu'une List ?",
      options: [
        "Pour éviter d'avoir deux fois le même gossip (unicité) et pour tester l'appartenance rapidement (Contains O(1))",
        "Parce que HashSet est plus rapide à itérer avec foreach",
        "Parce que HashSet est plus facile à initialiser",
        "Parce que List ne stocke que des entiers, HashSet stocke des chaînes",
      ],
      answer: "Pour éviter d'avoir deux fois le même gossip (unicité) et pour tester l'appartenance rapidement (Contains O(1))",
      explanation:
        "HashSet est parfait pour les gossips : il élimine automatiquement les doublons (lors de la fusion de groupes) et permet de vérifier rapidement si un gossip est connu (Contains O(1)).",
    },
  ],
};



const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${idx}`} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${keyPrefix}-${idx}`} style={{
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
      return <em key={`${keyPrefix}-${idx}`} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
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

  const segments = cleanText.split(" ◆ ");

  return (
    <span style={{ display: 'block', lineHeight: '1.7' }}>
      {segments.map((segment, segIdx) => (
        <span key={segIdx} style={{ display: 'block', marginBottom: segIdx < segments.length - 1 ? '6px' : '0' }}>
          {segIdx > 0 && (
            <span style={{ color: '#1a73e8', fontWeight: 'bold', marginRight: '5px' }}>◆</span>
          )}
          {renderInlineTokens(segment, `seg-${segIdx}`)}
        </span>
      ))}
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
  const totalScore = scores.moyen + scores.avance + scores.expert;
  const totalQuestions = questions.moyen.length + questions.avance.length + questions.expert.length;
  return (
    <div className="results">
      <h3>🎯 Score : {totalScore} / {totalQuestions}</h3>
      <p>✅ Moyen : {scores.moyen}/{questions.moyen.length} | ✅ Avancé : {scores.avance}/{questions.avance.length} | ✅ Expert : {scores.expert}/{questions.expert.length}</p>
      {totalScore >= Math.floor(totalQuestions * 0.6)
        ? <h3 className="success">🚀 Excellent ! Backend development maîtrisé.</h3>
        : <p className="fail">📚 Révisez les concepts backend fondamentaux et avancés.</p>
      }
    </div>
  );
};

const BackendInterviewQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(25);
      setMessage("");
    } else {
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
      setCurrentQuestion(0);
      setTimeLeft(25);
      setMessage("");
    }
  }, [level, currentQuestion]);

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, handleNextQuestion, message]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen");
          setCurrentQuestion(0);
          setTimeLeft(25);
          return 0;
        });
      }, 20000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
    const current = questions[level][currentQuestion];
    if (option === current.answer) {
      setScores(p => ({ ...p, [level]: p[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            Backend Interview 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`
            }
          </h4>
          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default BackendInterviewQCM;
