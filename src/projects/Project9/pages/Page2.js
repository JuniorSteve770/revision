// src/projects/CIBPricing/CIBPricingPreTradeQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== SLIDE 1: 3 REGLES D'OR ====================
  {
    question: "Les 3 règles d'or de la récursivité",
    answer:
      "◆ **Cas de base** : condition d'arrêt (OBLIGATOIRE)\n```if (n <= 0) return 0;\n```\n◆ **Cas récursif** : appel à soi-même\n```return n + MaFonction(n - 1);\n```\n◆ **Convergence** : chaque appel se rapproche du cas de base\n```// n → n-1 → n-2 → ... → 0 ✅\n// n → n+1 → n+2 → ... → ∞ ❌ BOUCLE INFINIE\n```\n⚠️ Sans cas de base → StackOverflowException",
  },
  // ==================== SLIDE 2: PILE D'APPELS ====================
  {
    question: "La pile d'appels (Call Stack) — comprendre l'empilement",
    answer:
      "◆ **Descente** : empilement des appels\n◆ **Remontée** : dépilement des résultats\n◆ **Stack Overflow** : profondeur > 10 000 → pile déborde\n\n```// Factorielle(3) — DESCENTE (empilement)\n// | Factorielle(0) → 1        | ← sommet (résolu en premier)\n// | Factorielle(1) → 1*F(0)   |\n// | Factorielle(2) → 2*F(1)   |\n// | Factorielle(3) → 3*F(2)   | ← premier appel\n\n// REMONTÉE (dépilement)\n// Factorielle(0) = 1\n// Factorielle(1) = 1 * 1 = 1\n// Factorielle(2) = 2 * 1 = 2\n// Factorielle(3) = 3 * 2 = 6 ← résultat final\n```\n⚠️ Chaque appel consomme de la mémoire",
  },
  // ==================== SLIDE 3: FIBONACCI NAIF ====================
  {
    question: "Fibonacci — Version Naïve (À ÉVITER)",
    answer:
      "◆ **Complexité** : O(2^n) — CATASTROPHIQUE\n```// F(40) = 330 MILLIONS d'appels !\n// F(50) = 2 MILLIARDS d'appels !\n```\n◆ **Inutilisable** pour n > 40\n◆ **Problème** : sous-problèmes recalculés en boucle\n\n```int FibNaif(int n) {\n    if (n <= 1) return n;\n    return FibNaif(n-1) + FibNaif(n-2);\n}\n\n// Arbre d'appels de F(6) :\n// F(6) → F(5) + F(4) → F(4)+F(3) + F(3)+F(2) → ...\n// F(3) est calculé 3 fois !\n// F(2) est calculé 5 fois !\n```\n⚠️ Ne JAMAIS utiliser FibNaif en production",
  },
  // ==================== SLIDE 4: FIBONACCI MEMOISE ====================
  {
    question: "Fibonacci — Version Mémoïsée (Top-Down)",
    answer:
      "◆ **Principe** : stocker pour ne pas recalculer\n◆ **Cache hit** : retourner le résultat stocké\n◆ **Cache miss** : calculer et stocker\n◆ **Gain** : O(2^n) → O(n)\n\n```var memo = new Dictionary<int, long>();\n\nlong FibMemo(int n) {\n    if (n <= 1) return n;\n    if (memo.ContainsKey(n)) return memo[n]; // Cache hit !\n    memo[n] = FibMemo(n-1) + FibMemo(n-2);   // Cache miss\n    return memo[n];\n}\n\n// F(40) = 41 appels seulement !\n// F(1000) = 1001 appels seulement !\n```\n⚠️ La mémoïsation transforme un algorithme exponentiel en linéaire",
  },
  // ==================== SLIDE 5: FIBONACCI BOTTOM-UP ====================
  {
    question: "Fibonacci — Version Bottom-Up (Itératif)",
    answer:
      "◆ **Itératif** : pas de pile récursive\n◆ **O(1) mémoire** : seulement 2 variables\n◆ **Optimal** : temps O(n), mémoire O(1)\n\n```long FibBottomUp(int n) {\n    if (n <= 1) return n;\n    long a = 0, b = 1;\n    for (int i = 2; i <= n; i++)\n        (a, b) = (b, a + b);\n    return b;\n}\n\n// On n'a besoin que des 2 dernières valeurs\n// Pas de pile récursive, pas de cache Dictionary\n```\n⚠️ La version Bottom-Up est la plus efficace",
  },
  // ==================== SLIDE 6: MERGE SORT ====================
  {
    question: "Merge Sort — Diviser pour régner",
    answer:
      "◆ **1. DIVISER** : couper en deux\n```int m = tab.Length / 2;\nvar g = tab.Take(m).ToArray();\nvar d = tab.Skip(m).ToArray();\n```\n◆ **2. RÉGNER** : trier chaque moitié récursivement\n```var gTrie = MergeSort(g);\nvar dTrie = MergeSort(d);\n```\n◆ **3. COMBINER** : fusionner les deux moitiés triées\n```return Fusionner(gTrie, dTrie);\n```\n◆ **Complexité** : O(n log n) garanti\n\n```int[] MergeSort(int[] tab) {\n    if (tab.Length <= 1) return tab; // Cas de base\n    int m = tab.Length / 2;\n    var g = MergeSort(tab.Take(m).ToArray());\n    var d = MergeSort(tab.Skip(m).ToArray());\n    return Fusionner(g, d);\n}\n\nint[] Fusionner(int[] g, int[] d) {\n    var res = new List<int>();\n    int ig=0, id=0;\n    while (ig < g.Length && id < d.Length)\n        res.Add(g[ig] <= d[id] ? g[ig++] : d[id++]);\n    res.AddRange(g.Skip(ig));\n    res.AddRange(d.Skip(id));\n    return res.ToArray();\n}\n```\n⚠️ Merge Sort = stable, mais nécessite O(n) mémoire",
  },
  // ==================== SLIDE 7: QUICK SORT ====================
  {
    question: "Quick Sort — Partition et récursion",
    answer:
      "◆ **Pivot** : élément de référence\n```int pivot = tab[d]; // Dernier élément\n```\n◆ **Partition** : petits à gauche, grands à droite\n```int i = g - 1;\nfor (int j = g; j < d; j++)\n    if (tab[j] <= pivot) {\n        i++;\n        (tab[i], tab[j]) = (tab[j], tab[i]);\n    }\n(tab[i+1], tab[d]) = (tab[d], tab[i+1]);\nreturn i + 1; // Position du pivot\n```\n◆ **Récursion** : trier chaque côté\n```QuickSort(tab, g, p-1); // Partie gauche\nQuickSort(tab, p+1, d); // Partie droite\n```\n◆ **Complexité** : O(n log n) moyenne, O(n²) pire cas\n\n```void QuickSort(int[] tab, int g, int d) {\n    if (g >= d) return; // Cas de base\n    int p = Partitionner(tab, g, d);\n    QuickSort(tab, g, p-1);\n    QuickSort(tab, p+1, d);\n}\n\nint Partitionner(int[] tab, int g, int d) {\n    int pivot = tab[d];\n    int i = g - 1;\n    for (int j = g; j < d; j++)\n        if (tab[j] <= pivot) {\n            i++;\n            (tab[i], tab[j]) = (tab[j], tab[i]);\n        }\n    (tab[i+1], tab[d]) = (tab[d], tab[i+1]);\n    return i + 1;\n}\n```\n⚠️ Quick Sort = rapide en pratique, mais instable",
  },
  // ==================== SLIDE 8: BACKTRACKING ====================
  {
    question: "Backtracking — Essai, Échec, Retour Arrière",
    answer:
      "◆ **1. Choisir** : faire un choix\n```FaireChoix(choix);\n```\n◆ **2. Explorer** : avancer récursivement\n```if (Backtrack(état)) return true;\n```\n◆ **3. Backtrack** : annuler si impasse\n```AnnulerChoix(choix);\n```\n◆ **Applications** : Sudoku, labyrinthes, permutations\n\n```bool Backtrack(état) {\n    if (SolutionComplete()) return true;  // Succès\n    if (Impossible()) return false;       // Échec\n\n    foreach (var choix in OptionsDisponibles) {\n        FaireChoix(choix);                // 1. Choisir\n        if (Backtrack(état)) return true; // 2. Explorer\n        AnnulerChoix(choix);              // 3. Backtrack\n    }\n    return false;\n}\n\n// Exemple : permutations [1,2,3]\nvoid Permutations(int[] tab, int debut) {\n    if (debut == tab.Length) { Enregistrer(); return; }\n    for (int i = debut; i < tab.Length; i++) {\n        (tab[debut], tab[i]) = (tab[i], tab[debut]); // Choisir\n        Permutations(tab, debut + 1);                 // Explorer\n        (tab[debut], tab[i]) = (tab[i], tab[debut]); // Backtrack\n    }\n}\n```\n⚠️ Backtracking = DFS + annulation",
  },
  // ==================== SLIDE 9: RECHERCHE BINAIRE ====================
  {
    question: "Recherche Binaire — O(log n)",
    answer:
      "◆ **Condition** : tableau trié OBLIGATOIRE\n◆ **Principe** : diviser par 2 à chaque étape\n```int m = (g + d) / 2; // Milieu\nif (tab[m] == cible) return m;      // Trouvé !\nif (tab[m] > cible)                 // Aller à gauche\n    return RechercheB(tab, cible, g, m-1);\nelse                                 // Aller à droite\n    return RechercheB(tab, cible, m+1, d);\n```\n◆ **Complexité** : O(log n)\n◆ **Gain** : 1M éléments → 20 comparaisons\n\n```int RechercheB(int[] tab, int cible, int g, int d) {\n    if (g > d) return -1; // Cible absente\n    int m = (g + d) / 2;\n    if (tab[m] == cible) return m;\n    if (tab[m] > cible)\n        return RechercheB(tab, cible, g, m-1);\n    else\n        return RechercheB(tab, cible, m+1, d);\n}\n\n// Version itérative (recommandée)\nint RechercheBIt(int[] tab, int cible) {\n    int g=0, d=tab.Length-1;\n    while (g <= d) {\n        int m = (g+d)/2;\n        if (tab[m] == cible) return m;\n        if (tab[m] < cible) g = m+1;\n        else d = m-1;\n    }\n    return -1;\n}\n```\n⚠️ La version itérative est préférable sur grands tableaux",
  },
  // ==================== SLIDE 10: TABLEAU COMPARATIF DES TRIS ====================
  {
    question: "Algorithmes de tri — Tableau comparatif",
    answer:
      "◆ **Bubble Sort** : O(n²) — pédagogique uniquement\n```for (int i=0; i<n-1; i++)\n    for (int j=0; j<n-1-i; j++)\n        if (tab[j] > tab[j+1])\n            (tab[j], tab[j+1]) = (tab[j+1], tab[j]);\n```\n◆ **Insertion Sort** : O(n²) / O(n) sur quasi-trié\n```for (int i=1; i<n; i++) {\n    int cle = tab[i]; int j = i-1;\n    while (j>=0 && tab[j] > cle) {\n        tab[j+1] = tab[j];\n        j--;\n    }\n    tab[j+1] = cle;\n}\n```\n◆ **Merge Sort** : O(n log n) stable, garanti, O(n) mémoire\n◆ **Quick Sort** : O(n log n) moyenne, O(n²) pire cas, instable\n◆ **En production** : Array.Sort() / List.Sort()\n\n⚠️ En production : toujours Array.Sort() ou List.Sort()",
  },
  // ==================== SLIDE 11: MEMOISATION ====================
  {
    question: "Mémoïsation — Cache des résultats",
    answer:
      "◆ **Principe** : stocker pour ne pas recalculer\n◆ **Cache hit** : retourner le résultat stocké\n```if (memo.ContainsKey(n)) return memo[n]; // Cache hit !\n```\n◆ **Cache miss** : calculer et stocker\n```memo[n] = FibMemo(n-1) + FibMemo(n-2); // Cache miss\n```\n◆ **Gain** : O(2^n) → O(n)\n\n```var memo = new Dictionary<int, long>();\n\nlong FibMemo(int n) {\n    if (n <= 1) return n;\n    if (memo.ContainsKey(n)) return memo[n];\n    memo[n] = FibMemo(n-1) + FibMemo(n-2);\n    return memo[n];\n}\n\n// Rendu de monnaie avec mémoïsation\nint RenduMemo(int[] pieces, int montant, Dictionary<int,int> memo = null) {\n    memo ??= new Dictionary<int, int>();\n    if (montant == 0) return 0;\n    if (montant < 0) return int.MaxValue / 2;\n    if (memo.ContainsKey(montant)) return memo[montant];\n    int min = int.MaxValue / 2;\n    foreach (int piece in pieces)\n        min = Math.Min(min, 1 + RenduMemo(pieces, montant - piece, memo));\n    memo[montant] = min;\n    return min;\n}\n```\n⚠️ La mémoïsation transforme un algorithme exponentiel en linéaire",
  },
  // ==================== SLIDE 12: CHEAT SHEET RECURSIVITE ====================
  {
    question: "Cheat Sheet — Récursivité et Tris",
    answer:
      "◆ **LES 3 QUESTIONS DE LA RÉCURSIVITÉ**\n1. Quel est mon cas de base ?\n   → n=0, tableau vide, chaîne vide, case trouvée...\n2. Comment réduire le problème ?\n   → diviser (n/2), décrémenter (n-1), raccourcir...\n3. La convergence est-elle garantie ?\n   → chaque appel doit se rapprocher du cas de base\n\n◆ **QUEL ALGORITHME DE TRI CHOISIR ?**\nEn production C# → Array.Sort()\nPetite liste (< 20) → Insertion Sort\nGrande liste, tri stable → Merge Sort\nGrande liste, performance → Quick Sort\nDonnées quasi-triées → Insertion Sort (O(n))\n\n◆ **RÉCURSION vs ITÉRATION**\nRécursion → arbres, backtracking, divide & conquer\nItération → boucles simples, performance critique, grande profondeur\n\n```// Exemple récursion : Factorielle\nint Factorielle(int n) {\n    if (n <= 1) return 1;\n    return n * Factorielle(n - 1);\n}\n\n// Exemple itération : Factorielle\nint FactorielleIter(int n) {\n    int res = 1;\n    for (int i = 2; i <= n; i++) res *= i;\n    return res;\n}\n```\n⚠️ La bonne décision au bon moment",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: REGLES RECURSIVITE (5 questions) ====================
    {
      question:
        "[Récursivité] Quelles sont les 3 règles d'or de la récursivité ?",
      options: [
        "Cas de base, Cas récursif, Convergence — chaque appel se rapproche du cas de base",
        "Boucle for, Boucle while, Boucle do-while",
        "Division, Conquête, Combinaison",
        "Initialisation, Condition, Incrémentation",
      ],
      answer: "Cas de base, Cas récursif, Convergence — chaque appel se rapproche du cas de base",
      explanation:
        "Les 3 règles d'or sont : 1) Cas de base (condition d'arrêt), 2) Cas récursif (appel à soi-même), 3) Convergence (chaque appel se rapproche du cas de base). Sans ces 3, la récursion est incorrecte.",
    },
    {
      question:
        "[Récursivité] Que se passe-t-il si une fonction récursive n'a pas de cas de base ?",
      options: [
        "La fonction retourne 0",
        "La fonction s'exécute indéfiniment → StackOverflowException",
        "La fonction s'arrête après 10 appels",
        "La fonction retourne un résultat aléatoire",
      ],
      answer: "La fonction s'exécute indéfiniment → StackOverflowException",
      explanation:
        "Sans cas de base, la récursion ne s'arrête jamais. Chaque appel consomme de la mémoire sur la pile. La pile finit par déborder → StackOverflowException.",
    },
    {
      question:
        "[Récursivité] Quelle est la sortie de cette fonction pour n=4 ?\n\n```int F(int n) {\n    if (n <= 0) return 0;\n    return n + F(n-1);\n}\n```",
      options: [
        "4",
        "10 (4+3+2+1)",
        "24 (4×3×2×1)",
        "0",
      ],
      answer: "10 (4+3+2+1)",
      explanation:
        "La fonction calcule la somme de 1 à n. F(4) = 4 + F(3) = 4 + 3 + F(2) = 4 + 3 + 2 + F(1) = 4 + 3 + 2 + 1 + F(0) = 10. C'est une somme arithmétique.",
    },
    {
      question:
        "[Récursivité] Quelle est la différence entre récursion directe et indirecte ?",
      options: [
        "Directe : f() appelle f() ; Indirecte : f() appelle g() qui appelle f()",
        "Directe : f() appelle g() ; Indirecte : f() appelle f()",
        "Directe est plus rapide que indirecte",
        "Indirecte n'est pas autorisée en C#",
      ],
      answer: "Directe : f() appelle f() ; Indirecte : f() appelle g() qui appelle f()",
      explanation:
        "Récursion directe : la fonction s'appelle elle-même (f → f). Récursion indirecte : f appelle g, qui appelle f (f → g → f). L'indirecte est utile pour les parsers et grammaires.",
    },
    {
      question:
        "[Récursivité] Quel est le risque principal d'une récursion très profonde (n > 10 000) ?",
      options: [
        "Le programme devient trop lent",
        "StackOverflowException (la pile d'appels déborde)",
        "Le résultat est incorrect",
        "La mémoire heap est saturée",
      ],
      answer: "StackOverflowException (la pile d'appels déborde)",
      explanation:
        "Chaque appel récursif ajoute un frame à la pile d'appels. Au-delà de ~10 000 appels, la pile déborde → StackOverflowException. Pour les grandes profondeurs, préférer une boucle itérative.",
    },

    // ==================== SECTION B: RECURSIVITE NOMBRES (5 questions) ====================
    {
      question:
        "[Nombres] Que calcule cette fonction ?\n\n```int F(int a, int b) {\n    if (b == 0) return a;\n    return F(b, a % b);\n}\n```",
      options: [
        "Le plus grand commun diviseur (PGCD) — algorithme d'Euclide",
        "Le plus petit commun multiple (PPCM)",
        "La somme de a et b",
        "Le quotient de a par b",
      ],
      answer: "Le plus grand commun diviseur (PGCD) — algorithme d'Euclide",
      explanation:
        "C'est l'algorithme d'Euclide pour le PGCD. PGCD(a,b) = PGCD(b, a%b). Quand b=0, le résultat est a. Exemple : PGCD(48,18) → PGCD(18,12) → PGCD(12,6) → PGCD(6,0) → 6.",
    },
    {
      question:
        "[Nombres] Quelle est la complexité de cette version naïve de Fibonacci ?\n\n```int Fib(int n) {\n    if (n <= 1) return n;\n    return Fib(n-1) + Fib(n-2);\n}\n```",
      options: [
        "O(n) — linéaire",
        "O(log n) — logarithmique",
        "O(2^n) — exponentielle (catastrophique)",
        "O(n²) — quadratique",
      ],
      answer: "O(2^n) — exponentielle (catastrophique)",
      explanation:
        "La version naïve de Fibonacci a une complexité exponentielle O(2^n). Chaque appel génère deux sous-appels. F(40) = 330 millions d'appels. C'est inutilisable pour n > 40.",
    },
    {
      question:
        "[Nombres] Que calcule cette fonction ?\n\n```int F(int n) {\n    if (n < 10) return n;\n    return (n % 10) + F(n / 10);\n}\n```",
      options: [
        "La somme des chiffres d'un nombre",
        "Le nombre de chiffres d'un nombre",
        "Le produit des chiffres d'un nombre",
        "Le nombre inversé",
      ],
      answer: "La somme des chiffres d'un nombre",
      explanation:
        "La fonction extrait le dernier chiffre avec `n % 10` et l'ajoute à la somme du reste `F(n/10)`. Exemple : F(1234) = 4 + F(123) = 4 + 3 + F(12) = 4+3+2+F(1) = 10.",
    },
    {
      question:
        "[Nombres] Quelle est la sortie de PuissanceRapide(2, 10) ?",
      options: [
        "20",
        "1024 (2^10)",
        "100",
        "512",
      ],
      answer: "1024 (2^10)",
      explanation:
        "PuissanceRapide(2, 10) = 2^10 = 1024. L'algorithme utilise la dichotomie : 2^10 = (2^5)², 2^5 = 2 * (2²)², etc. Il ne fait que 4 multiplications au lieu de 10.",
    },
    {
      question:
        "[Nombres] Ce code contient un bug. Lequel ?\n\n```int Factorielle(int n) {\n    if (n == 1) return 1;\n    return n * Factorielle(n - 1);\n}\n```",
      options: [
        "Le cas de base devrait être `if (n <= 1) return 1;` pour gérer n=0",
        "Il manque la vérification de n négatif",
        "La récursion est infinie",
        "Aucun bug, le code est correct",
      ],
      answer: "Le cas de base devrait être `if (n <= 1) return 1;` pour gérer n=0",
      explanation:
        "Avec `if (n == 1)`, l'appel Factorielle(0) est infini (0 → -1 → -2 → ...). Il faut utiliser `if (n <= 1) return 1;` pour gérer à la fois 0! et 1! = 1.",
    },

    // ==================== SECTION C: RECURSIVITE COLLECTIONS (5 questions) ====================
    {
      question:
        "[Collections] Que fait cette fonction ?\n\n```void F(int[] tab, int g, int d) {\n    if (g >= d) return;\n    (tab[g], tab[d]) = (tab[d], tab[g]);\n    F(tab, g+1, d-1);\n}\n```",
      options: [
        "Inverse l'ordre des éléments du tableau",
        "Trie le tableau par ordre croissant",
        "Trie le tableau par ordre décroissant",
        "Recherche un élément dans le tableau",
      ],
      answer: "Inverse l'ordre des éléments du tableau",
      explanation:
        "La fonction échange les extrémités (g et d) puis s'appelle récursivement avec les indices décalés vers le centre. Elle inverse le tableau en place. Exemple : [1,2,3,4] → [4,3,2,1].",
    },
    {
      question:
        "[Collections] Quelle condition doit être remplie pour utiliser la recherche binaire ?",
      options: [
        "Le tableau doit contenir des entiers uniquement",
        "Le tableau doit être trié par ordre croissant",
        "Le tableau doit avoir une taille paire",
        "Le tableau ne doit pas contenir de doublons",
      ],
      answer: "Le tableau doit être trié par ordre croissant",
      explanation:
        "La recherche binaire repose sur la comparaison de l'élément du milieu. Elle ne fonctionne que si le tableau est trié. C'est une condition impérative. L'ordre peut être croissant ou décroissant.",
    },
    {
      question:
        "[Collections] Quelle est la complexité de la recherche binaire sur un tableau de taille n ?",
      options: [
        "O(n) — linéaire",
        "O(log n) — logarithmique",
        "O(n²) — quadratique",
        "O(1) — constant",
      ],
      answer: "O(log n) — logarithmique",
      explanation:
        "La recherche binaire divise le tableau par 2 à chaque étape. Le nombre d'étapes est log₂(n). Sur 1 000 000 éléments → 20 comparaisons au lieu de 1 000 000 pour la recherche linéaire.",
    },
    {
      question:
        "[Collections] Que fait cette fonction ?\n\n```bool F(string s, int g, int d) {\n    if (g >= d) return true;\n    if (s[g] != s[d]) return false;\n    return F(s, g+1, d-1);\n}\n```",
      options: [
        "Vérifie si une chaîne est un palindrome",
        "Compte les caractères d'une chaîne",
        "Inverse une chaîne",
        "Recherche un caractère dans une chaîne",
      ],
      answer: "Vérifie si une chaîne est un palindrome",
      explanation:
        "La fonction compare les extrémités de la chaîne. Si elles sont différentes → false. Si elles sont identiques, elle continue vers l'intérieur. Si toutes les paires correspondent → true (palindrome).",
    },
    {
      question:
        "[Collections] Ce code de recherche binaire a un bug. Lequel ?\n\n```int RechercheB(int[] tab, int cible, int g, int d) {\n    int m = (g + d) / 2;\n    if (tab[m] == cible) return m;\n    if (tab[m] > cible) return RechercheB(tab, cible, g, m);\n    else return RechercheB(tab, cible, m, d);\n}\n```",
      options: [
        "Le bug est l'absence de cas de base `if (g > d) return -1;`",
        "Le bug est l'utilisation de `>` au lieu de `<`",
        "Le bug est que `m` devrait être `(g+d+1)/2`",
        "Aucun bug, le code est correct",
      ],
      answer: "Le bug est l'absence de cas de base `if (g > d) return -1;`",
      explanation:
        "Sans `if (g > d) return -1;`, la fonction boucle indéfiniment quand la cible n'est pas trouvée. Elle finit par appeler avec g > d, mais n'a pas de condition d'arrêt. Cas de base manquant.",
    },

    // ==================== SECTION D: ALGORITHMES TRI (5 questions) ====================
    {
      question:
        "[Tri] Quel algorithme de tri a une complexité O(n²) et est le plus simple à comprendre ?",
      options: [
        "Merge Sort (O(n log n))",
        "Bubble Sort (O(n²)) — simple mais lent",
        "Quick Sort (O(n log n) en moyenne)",
        "Recherche binaire (O(log n))",
      ],
      answer: "Bubble Sort (O(n²)) — simple mais lent",
      explanation:
        "Bubble Sort est le plus simple : on compare chaque paire adjacente et on les échange si nécessaire. Sa complexité est O(n²). Il est pédagogique mais inutilisable en pratique sur grandes collections.",
    },
    {
      question:
        "[Tri] Quel algorithme de tri est stable, garanti O(n log n) mais nécessite O(n) mémoire ?",
      options: [
        "Bubble Sort (O(n²))",
        "Insertion Sort (O(n²))",
        "Merge Sort (O(n log n), stable, O(n) mémoire)",
        "Quick Sort (O(n log n), instable)",
      ],
      answer: "Merge Sort (O(n log n), stable, O(n) mémoire)",
      explanation:
        "Merge Sort est stable (préserve l'ordre des égaux), garantit O(n log n), mais nécessite O(n) mémoire pour la fusion. Quick Sort est plus rapide en pratique mais instable et a un pire cas O(n²).",
    },
    {
      question:
        "[Tri] Sur un tableau presque trié (1 ou 2 inversions), quel algorithme est le plus rapide ?",
      options: [
        "Quick Sort (O(n log n) même sur quasi-trié)",
        "Bubble Sort (O(n²))",
        "Insertion Sort (O(n) sur quasi-trié)",
        "Merge Sort (O(n log n))",
      ],
      answer: "Insertion Sort (O(n) sur quasi-trié)",
      explanation:
        "Insertion Sort est excellent sur les tableaux presque triés. Il devient O(n) quand il n'y a que quelques inversions. C'est pourquoi il est souvent utilisé en complément de Quick Sort pour les petites parties.",
    },
    {
      question:
        "[Tri] Quelle est la complexité de Quick Sort dans le pire cas (tableau déjà trié avec pivot au dernier élément) ?",
      options: [
        "O(n log n)",
        "O(n²)",
        "O(n)",
        "O(log n)",
      ],
      answer: "O(n²)",
      explanation:
        "Si le pivot est le dernier élément et que le tableau est déjà trié, la partition est déséquilibrée : une moitié vide, l'autre de taille n-1. Quick Sort devient O(n²) dans ce cas. C'est le pire cas.",
    },
    {
      question:
        "[Tri] En production C#, quel algorithme de tri est recommandé pour un tableau aléatoire de 1 000 000 d'éléments ?",
      options: [
        "Bubble Sort (trop lent)",
        "Insertion Sort (trop lent)",
        "Array.Sort() (introspective sort, O(n log n) optimisé)",
        "Merge Sort (stable mais mémoire lourde)",
      ],
      answer: "Array.Sort() (introspective sort, O(n log n) optimisé)",
      explanation:
        "Array.Sort() utilise un tri introspectif (combinaison de Quick Sort, Heap Sort et Insertion Sort). C'est l'algorithme le plus performant en pratique, optimisé par Microsoft. Toujours utiliser Array.Sort() en production.",
    },

    // ==================== SECTION E: BACKTRACKING (5 questions) ====================
    {
      question:
        "[Backtracking] Quelle est la structure du backtracking en 4 étapes ?",
      options: [
        "Initialiser, Condition, Incrémenter, Terminer",
        "Diviser, Régner, Combiner, Retourner",
        "Choisir, Explorer, Backtrack (annuler), Remonter",
        "Lire, Traiter, Afficher, Répéter",
      ],
      answer: "Choisir, Explorer, Backtrack (annuler), Remonter",
      explanation:
        "Le backtracking suit 4 étapes : 1) Choisir une option, 2) Explorer récursivement, 3) Backtrack (annuler le choix) si impasse, 4) Remonter si aucune option ne fonctionne. C'est DFS + annulation.",
    },
    {
      question:
        "[Backtracking] Dans un solveur de Sudoku, que fait l'étape de backtrack ?",
      options: [
        "Elle passe à la case suivante",
        "Elle annule la dernière valeur placée et essaie une autre",
        "Elle vérifie si la grille est valide",
        "Elle affiche la solution",
      ],
      answer: "Elle annule la dernière valeur placée et essaie une autre",
      explanation:
        "Le backtrack annule la dernière décision (remet la case à 0) et essaie une autre valeur. C'est le 'retour en arrière' qui permet d'explorer toutes les possibilités sans conserver les échecs.",
    },
    {
      question:
        "[Backtracking] Combien y a-t-il de permutations de 4 éléments ?",
      options: [
        "4 (4! = 24)",
        "16 (4²)",
        "24 (4! = 24)",
        "120 (5!)",
      ],
      answer: "24 (4! = 24)",
      explanation:
        "Le nombre de permutations de n éléments est n!. Pour n=4, 4! = 4×3×2×1 = 24. C'est la croissance factorielle qui rend le backtracking coûteux pour de grandes entrées.",
    },
    {
      question:
        "[Backtracking] Dans un labyrinthe, comment éviter de boucler indéfiniment sur les cases déjà visitées ?",
      options: [
        "En utilisant une boucle while à la place de récursion",
        "En marquant les cases visitées (grille[x,y] = 'V') avant d'explorer",
        "En vérifiant seulement les murs",
        "C'est impossible à éviter",
      ],
      answer: "En marquant les cases visitées (grille[x,y] = 'V') avant d'explorer",
      explanation:
        "Sans marquage, l'algorithme revisite les mêmes cases en boucle. On marque les cases visitées avant d'explorer leurs voisins, et on les démarque lors du backtrack. C'est essentiel pour éviter les boucles infinies.",
    },
    {
      question:
        "[Backtracking] Quelle est la complexité de génération de toutes les permutations de n éléments ?",
      options: [
        "O(n)",
        "O(n²)",
        "O(n log n)",
        "O(n!) — factorielle",
      ],
      answer: "O(n!) — factorielle",
      explanation:
        "Il y a n! permutations. Pour n=10, 3,6 millions. Pour n=12, 479 millions. La croissance factorielle est explosive. Le backtracking est inutilisable pour n > 12 sans optimisations.",
    },

    // ==================== SECTION F: MEMOISATION & DP (5 questions) ====================
    {
      question:
        "[Mémoïsation] Quel est le gain de la mémoïsation sur Fibonacci ?",
      options: [
        "O(2^n) → O(n²)",
        "O(2^n) → O(n)",
        "O(n) → O(2^n)",
        "O(n²) → O(n)",
      ],
      answer: "O(2^n) → O(n)",
      explanation:
        "La mémoïsation transforme Fibonacci de O(2^n) à O(n). F(40) passe de 330 millions d'appels à 41 appels. C'est la différence entre inutilisable et instantané.",
    },
    {
      question:
        "[Mémoïsation] Quelle est la différence entre mémoïsation et bottom-up ?",
      options: [
        "Mémoïsation est itérative, bottom-up est récursif",
        "Mémoïsation est Top-Down (récursif + cache), bottom-up est Bottom-Up (itératif)",
        "Mémoïsation est plus rapide que bottom-up",
        "Il n'y a pas de différence",
      ],
      answer: "Mémoïsation est Top-Down (récursif + cache), bottom-up est Bottom-Up (itératif)",
      explanation:
        "Mémoïsation (Top-Down) : on part du problème initial, on descend récursivement en mémorisant. Bottom-Up : on construit le tableau de résultats de bas en haut, itérativement. Les deux donnent O(n).",
    },
    {
      question:
        "[Mémoïsation] Dans le rendu de monnaie, que représente la variable `dp[montant]` dans la version bottom-up ?",
      options: [
        "Le nombre de pièces minimal pour atteindre le montant",
        "La valeur des pièces disponibles",
        "Le nombre total de combinaisons possibles",
        "La liste des pièces choisies",
      ],
      answer: "Le nombre de pièces minimal pour atteindre le montant",
      explanation:
        "dp[m] stocke le nombre minimum de pièces pour atteindre le montant m. On le construit de 0 à montant en utilisant les pièces disponibles. C'est la solution du problème du rendu de monnaie.",
    },
    {
      question:
        "[Mémoïsation] Ce code de mémoïsation a un bug. Lequel ?\n\n```var memo = new Dictionary<int, long>();\nlong FibMemo(int n) {\n    if (n <= 1) return n;\n    if (memo.ContainsKey(n)) return memo[n];\n    return FibMemo(n-1) + FibMemo(n-2);\n}\n```",
      options: [
        "Il manque le stockage dans le cache après le calcul",
        "Il manque le cas de base",
        "La clé du Dictionary est incorrecte",
        "Aucun bug, le code est correct",
      ],
      answer: "Il manque le stockage dans le cache après le calcul",
      explanation:
        "Le code vérifie le cache et calcule le résultat, mais il ne stocke PAS le résultat dans le cache. La ligne `memo[n] = FibMemo(n-1) + FibMemo(n-2);` est nécessaire. Sinon, chaque appel est recalculé.",
    },
    {
      question:
        "[Mémoïsation] Quelle est la mémoire utilisée par la version bottom-up optimisée de Fibonacci avec O(1) mémoire ?",
      options: [
        "O(n) — tableau de n éléments",
        "O(1) — seulement 2 variables (a et b)",
        "O(n²) — matrice",
        "O(log n) — arbre",
      ],
      answer: "O(1) — seulement 2 variables (a et b)",
      explanation:
        "La version optimisée de Fibonacci n'utilise que deux variables (a et b) car on n'a besoin que des deux dernières valeurs. C'est la solution en O(n) temps et O(1) mémoire. C'est optimal.",
    },

    // ==================== SECTION G: CAS PRATIQUES (5 questions) ====================
    {
      question:
        "[Cas pratique] Vous devez trier des enregistrements en préservant l'ordre relatif des éléments égaux. Quel algorithme est stable et garantit O(n log n) ?",
      options: [
        "Quick Sort (instable)",
        "Bubble Sort (stable mais O(n²))",
        "Merge Sort (stable, O(n log n))",
        "Insertion Sort (stable mais O(n²))",
      ],
      answer: "Merge Sort (stable, O(n log n))",
      explanation:
        "Merge Sort est le seul algorithme de cette liste qui est à la fois stable ET garanti O(n log n). Quick Sort est instable. Bubble et Insertion sont stables mais O(n²). Pour un tri stable efficace, c'est Merge Sort.",
    },
    {
      question:
        "[Cas pratique] Dans un solveur de Sudoku, quelle structure de données est utilisée pour stocker la grille ?",
      options: [
        "List<int> — liste plate de 81 éléments",
        "int[9,9] — matrice 2D 9×9",
        "Dictionary<string,int> — indexée par 'A1', 'A2'...",
        "HashSet<int> — ensemble des valeurs présentes",
      ],
      answer: "int[9,9] — matrice 2D 9×9",
      explanation:
        "Le Sudoku utilise une grille 9×9. La structure int[9,9] est la plus naturelle : on accède à une case par grille[row, col]. C'est un tableau 2D classique (Pattern 3).",
    },
    {
      question:
        "[Cas pratique] Vous avez un tableau trié de 1 000 000 d'éléments. Vous cherchez une valeur. Combien de comparaisons au maximum avec une recherche binaire ?",
      options: [
        "1 000 000 (recherche linéaire)",
        "20 (log₂(1 000 000) ≈ 20)",
        "50 (recherche dichotomique approximative)",
        "100 (recherche par interpolation)",
      ],
      answer: "20 (log₂(1 000 000) ≈ 20)",
      explanation:
        "La recherche binaire a une complexité O(log₂ n). Pour 1 000 000, log₂(1 000 000) ≈ 20. C'est le nombre maximum de comparaisons. C'est 50 000 fois plus rapide qu'une recherche linéaire (1M comparaisons).",
    },
    {
      question:
        "[Cas pratique] Vous devez générer toutes les combinaisons (sous-ensembles) d'une liste de 10 éléments. Combien y en a-t-il ?",
      options: [
        "10 (10! ?)",
        "100 (10²)",
        "1024 (2^10)",
        "3 628 800 (10!)",
      ],
      answer: "1024 (2^10)",
      explanation:
        "Le nombre de sous-ensembles d'un ensemble de n éléments est 2^n. Pour n=10, 2^10 = 1024. C'est la différence entre combinaisons (2^n) et permutations (n!). Les combinaisons sont beaucoup moins nombreuses.",
    },
    {
      question:
        "[Cas pratique] Dans un labyrinthe, si on utilise un DFS (Depth First Search) récursif avec backtracking, quelle structure est utilisée implicitement ?",
      options: [
        "Queue (FIFO)",
        "Stack (LIFO) — la pile d'appels récursifs",
        "PriorityQueue (min-heap)",
        "List (liste)",
      ],
      answer: "Stack (LIFO) — la pile d'appels récursifs",
      explanation:
        "DFS utilise une Stack (LIFO). En récursif, la stack est la pile d'appels. En itératif, on utilise une Stack<T> explicite. C'est ce qui donne le comportement 'profondeur d'abord'.",
    },
  ],
  avance: [
    // ==================== QUESTIONS AVANCEES (5 questions) ====================
    {
      question:
        "[Avancé] Ce code de Quick Sort a un problème de performance. Lequel ?\n\n```void QuickSort(int[] tab, int g, int d) {\n    if (g >= d) return;\n    int p = Partitionner(tab, g, d);\n    QuickSort(tab, g, p-1);\n    QuickSort(tab, p+1, d);\n}\n```",
      options: [
        "Le partitionnement est trop lent",
        "Le pivot choisi (dernier élément) peut causer O(n²) sur tableau trié",
        "Il manque la fusion (merge)",
        "Aucun problème, le code est optimal",
      ],
      answer: "Le pivot choisi (dernier élément) peut causer O(n²) sur tableau trié",
      explanation:
        "Si le tableau est déjà trié et que le pivot est le dernier élément, chaque partition est déséquilibrée (une moitié vide). Quick Sort devient O(n²). La solution : choisir un pivot aléatoire ou 'médiane de trois'.",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre une solution Top-Down (mémoïsation) et Bottom-Up en programmation dynamique ?",
      options: [
        "Top-Down est itératif, Bottom-Up est récursif",
        "Top-Down résout les sous-problèmes au besoin (récursif + cache), Bottom-Up les résout tous de bas en haut (itératif)",
        "Top-Down est O(n) mémoire, Bottom-Up est O(1)",
        "Les deux sont équivalents, c'est juste un choix de style",
      ],
      answer: "Top-Down résout les sous-problèmes au besoin (récursif + cache), Bottom-Up les résout tous de bas en haut (itératif)",
      explanation:
        "Top-Down ne calcule que les sous-problèmes nécessaires (récursif + cache). Bottom-Up calcule TOUS les sous-problèmes de 0 à n (itératif). Bottom-Up est souvent plus efficace et évite la pile récursive.",
    },
    {
      question:
        "[Avancé] En Merge Sort, quelle est la profondeur de récursion maximale pour trier 1 000 000 d'éléments ?",
      options: [
        "1 000 000 (un élément par appel)",
        "20 (log₂(1 000 000) ≈ 20)",
        "100 (approximatif)",
        "1000 (10 × log₂(n))",
      ],
      answer: "20 (log₂(1 000 000) ≈ 20)",
      explanation:
        "La profondeur de récursion de Merge Sort est log₂(n). Pour 1 000 000, c'est ~20. C'est une profondeur très faible, ce qui rend Merge Sort sûr contre les StackOverflowException.",
    },
    {
      question:
        "[Avancé] Dans le rendu de monnaie, pourquoi la version mémoïsée peut-elle être moins efficace que la version bottom-up ?",
      options: [
        "La mémoïsation est toujours plus efficace",
        "La mémoïsation utilise une pile récursive qui peut déborder pour de grands montants",
        "La mémoïsation est O(2^n), bottom-up est O(n)",
        "La mémoïsation ne fonctionne pas sur les pièces",
      ],
      answer: "La mémoïsation utilise une pile récursive qui peut déborder pour de grands montants",
      explanation:
        "La version mémoïsée est récursive. Pour un grand montant (ex: 10 000), la profondeur de récursion peut dépasser la capacité de la pile. La version bottom-up est itérative et n'a pas ce problème.",
    },
    {
      question:
        "[Avancé] Quelle est la complexité de la génération de toutes les permutations de n éléments ?",
      options: [
        "O(n)",
        "O(n²)",
        "O(n log n)",
        "O(n!) — factorielle",
      ],
      answer: "O(n!) — factorielle",
      explanation:
        "Le nombre de permutations de n éléments est n!. Pour n=10, 3,6 millions. Pour n=12, 479 millions. La croissance factorielle est explosive. Le backtracking pour les permutations n'est viable que pour n ≤ 10.",
    },
  ],
  expert: [
    // ==================== QUESTIONS EXPERT (5 questions) ====================
    {
      question:
        "[Expert] Quelle est la relation entre récursivité et induction mathématique ?",
      options: [
        "Aucune relation, ce sont des concepts totalement différents",
        "Une fonction récursive est l'implémentation informatique d'une preuve par induction : cas de base (étape de base) et cas récursif (étape d'induction)",
        "L'induction est plus puissante que la récursivité",
        "La récursivité est une forme d'induction, mais l'induction n'est pas récursive",
      ],
      answer: "Une fonction récursive est l'implémentation informatique d'une preuve par induction : cas de base (étape de base) et cas récursif (étape d'induction)",
      explanation:
        "La récursivité est l'implémentation informatique de l'induction mathématique. Le cas de base = l'étape de base. Le cas récursif = l'étape d'induction (on suppose le résultat pour n-1 pour prouver n). C'est la même structure.",
    },
    {
      question:
        "[Expert] Dans un solveur de Sudoku, pourquoi le backtracking est-il la technique privilégiée malgré sa complexité exponentielle ?",
      options: [
        "Parce qu'il est plus simple à implémenter que d'autres techniques",
        "Parce que le Sudoku est un problème NP-complet, et le backtracking est une méthode de recherche exhaustive adaptée (avec pruning)",
        "Parce que les autres algorithmes sont moins performants",
        "Parce que le Sudoku a toujours une solution",
      ],
      answer: "Parce que le Sudoku est un problème NP-complet, et le backtracking est une méthode de recherche exhaustive adaptée (avec pruning)",
      explanation:
        "Le Sudoku est un problème NP-complet. Il n'existe pas d'algorithme polynomial garanti. Le backtracking avec pruning (élimination des branches impossibles) est la méthode standard. Avec un bon pruning, il est très efficace en pratique.",
    },
    {
      question:
        "[Expert] Que signifie 'tail recursion' (récursion terminale) et pourquoi n'est-elle pas optimisée en C# ?",
      options: [
        "La récursion terminale est une récursion où l'appel récursif est la dernière instruction — C# ne l'optimise pas, mais F# le fait",
        "La récursion terminale est une récursion infinie",
        "La récursion terminale est plus lente que la récursion normale",
        "C# optimise toujours la récursion terminale",
      ],
      answer: "La récursion terminale est une récursion où l'appel récursif est la dernière instruction — C# ne l'optimise pas, mais F# le fait",
      explanation:
        "La récursion terminale (tail recursion) est optimisée par le compilateur pour éviter de consommer de la pile. C# ne l'optimise pas (le JIT le fait parfois), mais F# (le langage fonctionnel de Microsoft) l'optimise nativement.",
    },
    {
      question:
        "[Expert] En Quick Sort, pourquoi le choix du pivot est-il critique et comment l'optimiser ?",
      options: [
        "Le pivot n'a pas d'importance, Quick Sort est toujours O(n log n)",
        "Le pivot détermine l'équilibre des partitions. Pour éviter O(n²), on utilise la médiane de trois ou un pivot aléatoire",
        "Le pivot doit toujours être le premier élément",
        "Le pivot détermine la stabilité du tri",
      ],
      answer: "Le pivot détermine l'équilibre des partitions. Pour éviter O(n²), on utilise la médiane de trois ou un pivot aléatoire",
      explanation:
        "Si le pivot est mal choisi (ex: dernier élément sur tableau trié), les partitions sont déséquilibrées → O(n²). La solution : médiane de trois (premier, milieu, dernier) ou pivot aléatoire. Ces techniques garantissent O(n log n) en pratique.",
    },
    {
      question:
        "[Expert] Quelle est la différence entre mémoïsation et tabulation en programmation dynamique ?",
      options: [
        "Mémoïsation = Top-Down (récursif + cache), Tabulation = Bottom-Up (itératif + tableau)",
        "Mémoïsation = Bottom-Up, Tabulation = Top-Down",
        "Mémoïsation est plus rapide que tabulation",
        "Tabulation utilise moins de mémoire que mémoïsation",
      ],
      answer: "Mémoïsation = Top-Down (récursif + cache), Tabulation = Bottom-Up (itératif + tableau)",
      explanation:
        "Mémoïsation (Top-Down) : on commence par le problème principal, on descend récursivement en mémorisant. Tabulation (Bottom-Up) : on remplit un tableau de 0 à n, itérativement. Les deux donnent O(n) mais l'approche diffère.",
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
        ? <h3 className="success">🚀 Mission CIB Pricing Pre-Trade maîtrisée !</h3>
        : <p className="fail">📚 Révisez C#, dérivés actions et architecture CIB.</p>
      }
    </div>
  );
};

const CIBPricingPreTradeQCM = () => {
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
      }, 15000);
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
            CIB Pricing Pre-Trade 🔹 {level === "basic"
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

export default CIBPricingPreTradeQCM;
