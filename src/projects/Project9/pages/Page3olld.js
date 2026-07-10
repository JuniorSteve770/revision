// src/projects/CIBPricing/CIBRestApiInfraQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== SLIDE 1: STRUCTURE DU PROBLEME ====================
  {
    question: "Gossiping Drivers — Structure du problème",
    answer:
      "◆ **Énoncé** : N chauffeurs de bus circulent sur des routes cycliques\n◆ **Règle** : à chaque minute, les chauffeurs au même arrêt échangent tous leurs ragots\n◆ **Objectif** : trouver en combien de minutes tous les chauffeurs connaissent tous les ragots\n◆ **Limite** : 480 minutes maximum, sinon retourner -1\n◆ **Entrée** : chaque ligne = 'nombre d'arrêts suivis des arrêts'\n◆ **Sortie** : nombre de minutes ou -1\n\n```csharp\n// Exemple d'entrée :\n// \"3 1 2 3\"  → chauffeur 0 : arrêts 1,2,3\n// \"3 2 3 4\"  → chauffeur 1 : arrêts 2,3,4\n// \"3 3 4 5\"  → chauffeur 2 : arrêts 3,4,5\n// Résultat attendu : 5\n```\n⚠️ Le problème combine parsing, simulation, regroupement et agrégation",
  },
  // ==================== SLIDE 2: PATTERN 1 & 2 ====================
  {
    question: "Pattern 1 & 2 — Parsing + Initialisation",
    answer:
      "◆ **Pattern 1 — foreach + for : parsing du texte**\n```csharp\nforeach (string line in testInput) // chaque ligne\n{\n    string[] parts = line.Split(' ');\n    var arrets = new List<int>();\n    for (int i = 1; i < parts.Length; i++) // i=1 : ignore le 1er élément\n        arrets.Add(int.Parse(parts[i]));\n    routes.Add(arrets.ToArray());\n}\n```\n◆ **Pattern 2 — for seul : initialisation**\n```csharp\nfor (int i = 0; i < nombreDeChauffeurs; i++)\n    gossipsConnus.Add(new HashSet<int> { i }); // chaque chauffeur connaît son propre gossip\n```\n◆ **foreach** : parcourt la collection source\n◆ **for** : parcourt les sous-parties (i=1 pour ignorer l'en-tête)\n◆ **for seul** : initialisation de N structures indépendantes\n\n⚠️ for commence à 1 pour ignorer le nombre d'arrêts (en-tête)",
  },
  // ==================== SLIDE 3: PATTERN 3 ====================
  {
    question: "Pattern 3 — Simulation temporelle (for + for)",
    answer:
      "◆ **for + for imbriqués** : temps × entités\n◆ **Boucle externe** : chaque minute (0 à 479)\n◆ **Boucle interne** : chaque chauffeur\n◆ **Calcul** : position = minute % longueur_route (cyclique)\n\n```csharp\nfor (int minute = 0; minute < 480; minute++)\n{\n    var positionDeChaqueChauffeur = new int[nombreDeChauffeurs];\n\n    for (int i = 0; i < nombreDeChauffeurs; i++)\n    {\n        int positionDansLaRoute = minute % routes[i].Length;\n        positionDeChaqueChauffeur[i] = routes[i][positionDansLaRoute];\n    }\n    // ... traitement des positions ...\n}\n```\n◆ **Double boucle** : O(480 × N) = O(N) constant\n◆ **Simulation** : temps × entités\n◆ **Calcul cyclique** : `%` pour boucler sur la route\n\n⚠️ La boucle externe est le temps, la boucle interne est l'espace",
  },
  // ==================== SLIDE 4: PATTERN 4 ====================
  {
    question: "Pattern 4 — Regroupement conditionnel (for + if)",
    answer:
      "◆ **for + if** : regroupement par arrêt (create-if-absent)\n◆ **Objectif** : regrouper les chauffeurs par arrêt\n◆ **Clé** : numéro d'arrêt\n◆ **Valeur** : liste des chauffeurs à cet arrêt\n\n```csharp\nvar chauffeursParArret = new Dictionary<int, List<int>>();\n\nfor (int i = 0; i < nombreDeChauffeurs; i++)\n{\n    int arret = positionDeChaqueChauffeur[i];\n    if (!chauffeursParArret.ContainsKey(arret))\n        chauffeursParArret[arret] = new List<int>();\n    chauffeursParArret[arret].Add(i);\n}\n```\n◆ **ContainsKey** : vérifier si la clé existe\n◆ **Add** : créer la liste si absente\n◆ **Add** : ajouter le chauffeur à la liste\n\n⚠️ ContainsKey + indexeur = 2 accès → peut être optimisé avec TryGetValue",
  },
  // ==================== SLIDE 5: PATTERN 5 ====================
  {
    question: "Pattern 5 — Agrégation et fusion (foreach + foreach + foreach)",
    answer:
      "◆ **foreach + if/continue + foreach + foreach** : cœur algorithmique\n◆ **Étape 1** : filtrer les groupes de 1 (continue)\n◆ **Étape 2** : collecter tous les ragots du groupe (double foreach)\n◆ **Étape 3** : distribuer à tout le groupe (foreach)\n\n```csharp\nforeach (var groupe in chauffeursParArret.Values)\n{\n    if (groupe.Count < 2) continue; // filtre\n\n    var tousLesGossips = new HashSet<int>();\n\n    // Collecter tous les ragots du groupe\n    foreach (int chauffeur in groupe)\n        foreach (int gossip in gossipsConnus[chauffeur])\n            tousLesGossips.Add(gossip);\n\n    // Distribuer à tout le groupe\n    foreach (int chauffeur in groupe)\n        gossipsConnus[chauffeur] = new HashSet<int>(tousLesGossips);\n}\n```\n◆ **continue** : ignore les groupes de 1 (pas de partage possible)\n◆ **Double foreach** : collecte toutes les données\n◆ **HashSet** : élimine automatiquement les doublons\n\n⚠️ La triple boucle est le cœur du problème — O(n³) mais acceptable ici",
  },
  // ==================== SLIDE 6: PATTERN 6 & 7 ====================
  {
    question: "Pattern 6 & 7 — Validation + Sortie anticipée",
    answer:
      "◆ **Pattern 6 — for + if + break : validation**\n```csharp\nbool toutLeMondeSaitTout = true;\nfor (int i = 0; i < nombreDeChauffeurs; i++)\n{\n    if (gossipsConnus[i].Count < nombreDeChauffeurs)\n    {\n        toutLeMondeSaitTout = false;\n        break; // inutile de continuer\n    }\n}\n```\n◆ **Pattern 7 — if + for : affichage**\n```csharp\nif (toutLeMondeSaitTout)\n{\n    Console.WriteLine($\"Résultat : {minute} minutes\");\n    for (int i = 0; i < nombreDeChauffeurs; i++)\n        Console.WriteLine($\"Route {i} : {string.Join(\", \", routes[i])}\");\n    return;\n}\n```\n◆ **break** : sort de la boucle dès qu'un chauffeur ne sait pas tout\n◆ **return** : sort de toute la méthode\n◆ **if + for** : affichage conditionnel avec boucle\n\n⚠️ break = sort de la boucle, return = sort de la méthode",
  },
];

const questions = {
  moyen: [
    // ==================== SECTION A: PARSING & INITIALISATION (6 questions) ====================
    {
      question:
        "[Parsing] Dans le parsing du Gossiping Drivers, pourquoi la boucle for commence-t-elle à i=1 ?\n\n```csharp\nfor (int i = 1; i < parts.Length; i++)\n    arrets.Add(int.Parse(parts[i]));\n```",
      options: [
        "Pour ignorer le premier arrêt qui est toujours 0",
        "Pour ignorer le nombre d'arrêts (en-tête) et ne garder que les arrêts",
        "Parce que les indices commencent à 1 en C#",
        "Pour ignorer les arrêts en double",
      ],
      answer: "Pour ignorer le nombre d'arrêts (en-tête) et ne garder que les arrêts",
      explanation:
        "La première valeur de chaque ligne est le nombre d'arrêts. Les valeurs suivantes sont les arrêts eux-mêmes. On commence à i=1 pour ignorer ce nombre et ne garder que les arrêts.",
    },
    {
      question:
        "[Parsing] Quelle combinaison de structures est utilisée dans le parsing du code Gossiping Drivers ?",
      options: [
        "foreach + for (parcours ligne puis colonnes)",
        "for + foreach (parcours colonnes puis ligne)",
        "while + for (condition externe puis index)",
        "foreach seul",
      ],
      answer: "foreach + for (parcours ligne puis colonnes)",
      explanation:
        "Le parsing utilise foreach pour parcourir les lignes, et for pour parcourir les colonnes (arrêts) de chaque ligne. C'est le pattern 1 : foreach + for + Add.",
    },
    {
      question:
        "[Initialisation] Que fait ce code d'initialisation ?\n\n```csharp\nfor (int i = 0; i < nombreDeChauffeurs; i++)\n    gossipsConnus.Add(new HashSet<int> { i });\n```",
      options: [
        "Crée une liste de chauffeurs vides",
        "Initialise chaque chauffeur avec son propre gossip (lui-même)",
        "Crée un HashSet contenant tous les chauffeurs",
        "Initialise les routes de chaque chauffeur",
      ],
      answer: "Initialise chaque chauffeur avec son propre gossip (lui-même)",
      explanation:
        "Chaque chauffeur commence avec un seul gossip : le sien (représenté par son index i). Le HashSet { i } contient initialement uniquement l'index du chauffeur.",
    },
    {
      question:
        "[Parsing] Quelle est la structure de la variable routes après le parsing ?\n\n```csharp\nroutes.Add(arrets.ToArray());\n```",
      options: [
        "List<int[]> — une liste de tableaux d'entiers (chaque tableau = route d'un chauffeur)",
        "List<List<int>> — une liste de listes d'entiers",
        "int[,] — une matrice 2D",
        "Dictionary<int, int[]> — dictionnaire indexé par chauffeur",
      ],
      answer: "List<int[]> — une liste de tableaux d'entiers (chaque tableau = route d'un chauffeur)",
      explanation:
        "routes est une List<int[]>. Chaque élément est un tableau d'entiers représentant la route (les arrêts) d'un chauffeur. `arrets.ToArray()` convertit la List<int> en int[].",
    },
    {
      question:
        "[Parsing] Que se passe-t-il si une ligne d'entrée est vide dans le parsing ?",
      options: [
        "La ligne est ignorée silencieusement",
        "Le programme lève une exception (parts.Length = 0, for ne s'exécute pas)",
        "Le programme ajoute une route vide",
        "Le programme continue normalement",
      ],
      answer: "Le programme lève une exception (parts.Length = 0, for ne s'exécute pas)",
      explanation:
        "Si une ligne est vide, `parts.Length = 0`. La boucle for ne s'exécute pas (i=1; i<0; false). Aucune route n'est ajoutée, ce qui cause une incohérence plus tard.",
    },
    {
      question:
        "[Initialisation] Pourquoi utilise-t-on un HashSet pour stocker les ragots plutôt qu'une List ?",
      options: [
        "HashSet est plus rapide pour l'itération",
        "HashSet garantit l'unicité des ragots (pas de doublons)",
        "HashSet est plus facile à initialiser",
        "HashSet stocke les éléments dans l'ordre",
      ],
      answer: "HashSet garantit l'unicité des ragots (pas de doublons)",
      explanation:
        "HashSet élimine automatiquement les doublons. Lors de la fusion des ragots, on ne veut pas de doublons. HashSet est parfait pour cette utilisation.",
    },

    // ==================== SECTION B: SIMULATION TEMPORELLE (4 questions) ====================
    {
      question:
        "[Simulation] Quelle combinaison de structures est utilisée pour la simulation temporelle ?",
      options: [
        "for + for (temps × entités)",
        "foreach + for (lignes × colonnes)",
        "while + for (condition × entités)",
        "do-while + for (exécution garantie × entités)",
      ],
      answer: "for + for (temps × entités)",
      explanation:
        "La simulation utilise une double boucle for : la boucle externe parcourt les minutes (temps), la boucle interne parcourt les chauffeurs (entités). C'est le pattern 3.",
    },
    {
      question:
        "[Simulation] Que fait cette ligne de calcul ?\n\n```csharp\nint positionDansLaRoute = minute % routes[i].Length;\n```",
      options: [
        "Calcule la position du chauffeur de manière cyclique (boucle sur la route)",
        "Calcule la position du chauffeur de manière aléatoire",
        "Calcule la position du chauffeur en fonction de la minute",
        "Calcule la position du chauffeur en fonction de son index",
      ],
      answer: "Calcule la position du chauffeur de manière cyclique (boucle sur la route)",
      explanation:
        "L'opérateur `%` (modulo) fait boucler la position sur la longueur de la route. Si la route a 3 arrêts, minute=0→0, 1→1, 2→2, 3→0, 4→1, etc. C'est un déplacement cyclique.",
    },
    {
      question:
      "[Simulation] Quelle est la complexité de la simulation si N = nombre de chauffeurs ?",
      options: [
        "O(N) — linéaire",
        "O(480 × N) — constant car 480 est fixe",
        "O(N²) — quadratique",
        "O(480) — constant",
      ],
      answer: "O(480 × N) — constant car 480 est fixe",
      explanation:
        "La boucle externe est fixe (480 minutes). La boucle interne est O(N). La complexité totale est O(480 × N), mais comme 480 est une constante, on peut dire O(N).",
    },
    {
      question:
        "[Simulation] Pourquoi la limite de 480 minutes est-elle importante ?",
      options: [
        "C'est une limite arbitraire sans importance",
        "C'est la limite maximum avant de déclarer l'échec (retourner -1)",
        "C'est le temps moyen pour que tous les ragots se propagent",
        "C'est le nombre maximum de routes possibles",
      ],
      answer: "C'est la limite maximum avant de déclarer l'échec (retourner -1)",
      explanation:
        "Si après 480 minutes tous les chauffeurs ne connaissent pas tous les ragots, on considère que c'est impossible et on retourne -1. C'est une limite de temps pour éviter une boucle infinie.",
    },
          ],
  avance: [
    // ==================== SECTION C: REGROUPEMENT CONDITIONNEL (4 questions) ====================
    {
      question:
        "[Regroupement] Quelle combinaison de structures est utilisée pour le regroupement par arrêt ?",
      options: [
        "foreach + ContainsKey + Add",
        "for + ContainsKey + Add",
        "while + ContainsKey + Add",
        "do-while + ContainsKey + Add",
      ],
      answer: "for + ContainsKey + Add",
      explanation:
        "Le regroupement utilise for pour parcourir les chauffeurs, ContainsKey pour vérifier l'existence de la clé, et Add pour créer la liste ou ajouter le chauffeur. C'est le pattern 4.",
    },
    {
      question:
        "[Regroupement] Dans ce code, que représente la variable `arret` ?\n\n```csharp\nint arret = positionDeChaqueChauffeur[i];\n```",
      options: [
        "L'index du chauffeur",
        "Le numéro de l'arrêt où se trouve le chauffeur à cette minute",
        "La route du chauffeur",
        "Le nombre d'arrêts du chauffeur",
      ],
      answer: "Le numéro de l'arrêt où se trouve le chauffeur à cette minute",
      explanation:
        "`positionDeChaqueChauffeur[i]` contient le numéro de l'arrêt où le chauffeur i se trouve à cette minute. C'est la position actuelle du chauffeur.",
    },
    {
      question:
        "[Regroupement] Pourquoi utilise-t-on un Dictionary<int, List<int>> pour regrouper les chauffeurs par arrêt ?",
      options: [
        "Pour trier les chauffeurs par ordre alphabétique",
        "Pour associer chaque arrêt (clé) à la liste des chauffeurs qui s'y trouvent (valeur)",
        "Pour compter le nombre total de chauffeurs",
        "Pour stocker les routes de chaque chauffeur",
      ],
      answer: "Pour associer chaque arrêt (clé) à la liste des chauffeurs qui s'y trouvent (valeur)",
      explanation:
        "La clé est le numéro de l'arrêt, la valeur est la liste des chauffeurs présents à cet arrêt. C'est une structure de groupement classique (Pattern 4).",
    },
    {
      question:
        "[Regroupement] Que ferait ce code si on utilisait TryGetValue à la place de ContainsKey ?",
      options: [
        "Il serait plus lent",
        "Il ferait 1 accès au lieu de 2 (plus performant)",
        "Il ne fonctionnerait pas",
        "Il serait plus difficile à lire",
      ],
      answer: "Il ferait 1 accès au lieu de 2 (plus performant)",
      explanation:
        "ContainsKey + indexeur = 2 accès au Dictionary. TryGetValue = 1 seul accès. C'est plus performant et plus concis. Les deux sont sûrs (pas d'exception).",
    },

    // ==================== SECTION D: AGREGATION & FUSION (6 questions) ====================
    {
      question:
        "[Fusion] Quelle combinaison de structures est utilisée pour la fusion des ragots ?",
      options: [
        "foreach + if/continue + foreach + foreach",
        "for + if/break + for + for",
        "while + if/continue + for + for",
        "do-while + if/continue + foreach",
      ],
      answer: "foreach + if/continue + foreach + foreach",
      explanation:
        "La fusion utilise foreach pour parcourir les groupes, if/continue pour filtrer les groupes de 1, puis double foreach pour collecter et distribuer les ragots. C'est le pattern 5.",
    },
    {
      question:
        "[Fusion] Que fait `if (groupe.Count < 2) continue;` dans la fusion ?",
      options: [
        "Ignorer les groupes de 1 (pas de partage possible)",
        "Ignorer les groupes de 2",
        "Arrêter la boucle",
        "Sortir de toute la méthode",
      ],
      answer: "Ignorer les groupes de 1 (pas de partage possible)",
      explanation:
        "Si un groupe a moins de 2 chauffeurs, il n'y a personne avec qui échanger. `continue` saute ce groupe et passe au suivant. C'est un filtre d'optimisation.",
    },
    {
      question:
        "[Fusion] Dans la collecte des ragots, pourquoi utilise-t-on un HashSet pour `tousLesGossips` ?",
      options: [
        "Pour trier les ragots par ordre croissant",
        "Pour éliminer automatiquement les doublons",
        "Pour stocker les ragots dans l'ordre d'arrivée",
        "Pour compter le nombre de ragots",
      ],
      answer: "Pour éliminer automatiquement les doublons",
      explanation:
        "En collectant les ragots de plusieurs chauffeurs, il peut y avoir des doublons. HashSet élimine automatiquement les doublons, garantissant que chaque ragot n'apparaît qu'une fois.",
    },
    {
      question:
        "[Fusion] Que fait la distribution des ragots ?\n\n```csharp\nforeach (int chauffeur in groupe)\n    gossipsConnus[chauffeur] = new HashSet<int>(tousLesGossips);\n```",
      options: [
        "Ajoute les ragots à chaque chauffeur du groupe",
        "Remplace les ragots de chaque chauffeur par l'ensemble fusionné",
        "Supprime les ragots de chaque chauffeur",
        "Crée une copie des ragots pour chaque chauffeur",
      ],
      answer: "Remplace les ragots de chaque chauffeur par l'ensemble fusionné",
      explanation:
        "Chaque chauffeur du groupe reçoit une copie de l'ensemble fusionné. Il ne s'agit pas d'un ajout, mais d'un remplacement total par le nouvel ensemble.",
    },
    {
      question:
        "[Fusion] Quelle est la complexité de la fusion des ragots dans le pire cas ?",
      options: [
        "O(n) — linéaire",
        "O(n²) — quadratique",
        "O(n³) — cubique (3 boucles imbriquées)",
        "O(log n) — logarithmique",
      ],
      answer: "O(n³) — cubique (3 boucles imbriquées)",
      explanation:
        "La fusion utilise 3 boucles imbriquées : groupes → membres → données. C'est O(n³) dans le pire cas. Cependant, le nombre de chauffeurs est limité, donc acceptable.",
    },
    {
      question:
        "[Fusion] Pourquoi la collecte et la distribution sont-elles faites en deux étapes séparées ?",
      options: [
        "Pour des raisons de performance",
        "Pour éviter de modifier la collection pendant l'itération",
        "Pour garantir que tous les chauffeurs reçoivent exactement le même ensemble",
        "Les deux B et C sont corrects",
      ],
      answer: "Les deux B et C sont corrects",
      explanation:
        "On collecte d'abord tous les ragots dans un HashSet pour éviter de modifier les collections pendant l'itération, ET pour garantir que tous les chauffeurs reçoivent exactement le même ensemble fusionné.",
    },
      ],
  expert: [

    // ==================== SECTION E: VALIDATION & SORTIE (4 questions) ====================
    {
      question:
        "[Validation] Quelle combinaison de structures est utilisée pour la vérification globale ?",
      options: [
        "for + if + break (sortie anticipée)",
        "foreach + if + continue",
        "while + if + break",
        "do-while + if + return",
      ],
      answer: "for + if + break (sortie anticipée)",
      explanation:
        "La vérification utilise for pour parcourir les chauffeurs, if pour tester la condition, et break pour sortir de la boucle dès qu'un chauffeur ne sait pas tout. C'est le pattern 6.",
    },
    {
      question:
        "[Validation] Que fait `break` dans ce code ?\n\n```csharp\nif (gossipsConnus[i].Count < nombreDeChauffeurs)\n{\n    toutLeMondeSaitTout = false;\n    break;\n}\n```",
      options: [
        "Sort de toute la méthode (return)",
        "Sort de la boucle for uniquement",
        "Passe à l'itération suivante (continue)",
        "Ignore la condition et continue",
      ],
      answer: "Sort de la boucle for uniquement",
      explanation:
        "`break` sort de la boucle for uniquement. On a déjà trouvé un chauffeur qui ne sait pas tout, donc on peut arrêter de vérifier les autres. C'est une optimisation.",
    },
    {
      question:
        "[Validation] Quand le programme retourne-t-il -1 dans le problème du Gossiping Drivers ?",
      options: [
        "Quand tous les chauffeurs savent tout",
        "Quand la limite de 480 minutes est atteinte sans que tous sachent tout",
        "Quand une erreur de parsing se produit",
        "Quand il n'y a qu'un seul chauffeur",
      ],
      answer: "Quand la limite de 480 minutes est atteinte sans que tous sachent tout",
      explanation:
        "Si après 480 minutes tous les chauffeurs ne connaissent pas tous les ragots, on considère que c'est impossible et on retourne -1. C'est la condition d'échec.",
    },
    {
      question:
        "[Validation] Quelle est la différence entre `break` et `return` dans ce problème ?",
      options: [
        "break sort de la boucle, return sort de toute la méthode",
        "break sort de la méthode, return sort de la boucle",
        "break et return font la même chose",
        "break est utilisé pour les erreurs, return pour les succès",
      ],
      answer: "break sort de la boucle, return sort de toute la méthode",
      explanation:
        "break sort uniquement de la boucle courante (on continue après la boucle). return sort de toute la méthode (fin d'exécution). break est utilisé pour la vérification, return pour le résultat final.",
    },

    // ==================== SECTION F: SYNTHESE (6 questions) ====================
    {
      question:
        "[Synthèse] Quel est le rôle du pattern `foreach + for` dans le code Gossiping Drivers ?",
      options: [
        "Parser les données d'entrée (texte → structures)",
        "Simuler le temps minute par minute",
        "Fusionner les ragots entre chauffeurs",
        "Afficher le résultat final",
      ],
      answer: "Parser les données d'entrée (texte → structures)",
      explanation:
        "`foreach + for` est utilisé pour parser les données d'entrée : foreach parcourt les lignes, for parcourt les arrêts de chaque ligne. C'est le pattern 1 (parsing).",
    },
    {
      question:
        "[Synthèse] Quel est le rôle du pattern `for + for` dans le code Gossiping Drivers ?",
      options: [
        "Parser les données d'entrée",
        "Simuler les positions des chauffeurs minute par minute",
        "Fusionner les ragots entre chauffeurs",
        "Initialiser les structures de données",
      ],
      answer: "Simuler les positions des chauffeurs minute par minute",
      explanation:
        "`for + for` est utilisé pour la simulation temporelle : boucle externe = minutes, boucle interne = chauffeurs. C'est le pattern 3 (simulation).",
    },
    {
      question:
        "[Synthèse] Quel est le rôle du pattern `for + if + ContainsKey` dans le code Gossiping Drivers ?",
      options: [
        "Parser les données d'entrée",
        "Regrouper les chauffeurs par arrêt (create-if-absent)",
        "Fusionner les ragots entre chauffeurs",
        "Valider la condition de fin",
      ],
      answer: "Regrouper les chauffeurs par arrêt (create-if-absent)",
      explanation:
        "`for + if + ContainsKey` est utilisé pour regrouper les chauffeurs par arrêt. C'est le pattern 4 : pour chaque chauffeur, on vérifie si l'arrêt existe, on le crée si nécessaire, puis on ajoute le chauffeur.",
    },
    {
      question:
        "[Synthèse] Quel est le rôle du pattern `foreach + if/continue + foreach + foreach` dans le code Gossiping Drivers ?",
      options: [
        "Parser les données d'entrée",
        "Simuler les positions des chauffeurs",
        "Fusionner les ragots entre chauffeurs d'un même groupe",
        "Valider la condition de fin",
      ],
      answer: "Fusionner les ragots entre chauffeurs d'un même groupe",
      explanation:
        "Ce pattern est le cœur algorithmique : il filtre les groupes de 1, collecte tous les ragots du groupe, puis les distribue à tous les membres. C'est le pattern 5.",
    },
    {
      question:
        "[Synthèse] Quel est le rôle du pattern `for + if + break` dans le code Gossiping Drivers ?",
      options: [
        "Parser les données d'entrée",
        "Simuler les positions des chauffeurs",
        "Fusionner les ragots entre chauffeurs",
        "Vérifier si tous les chauffeurs savent tout (sortie anticipée)",
      ],
      answer: "Vérifier si tous les chauffeurs savent tout (sortie anticipée)",
      explanation:
        "`for + if + break` est utilisé pour vérifier si tous les chauffeurs connaissent tous les ragots. Dès qu'un chauffeur ne sait pas tout, on break pour éviter des vérifications inutiles. C'est le pattern 6.",
    },
    {
      question:
        "[Synthèse] Quelle est la condition d'arrêt du problème du Gossiping Drivers ?",
      options: [
        "Tous les chauffeurs sont au même arrêt",
        "Tous les chauffeurs connaissent tous les ragots (Count == nombreDeChauffeurs)",
        "Tous les chauffeurs ont parcouru leur route complète",
        "La minute atteint 480",
      ],
      answer: "Tous les chauffeurs connaissent tous les ragots (Count == nombreDeChauffeurs)",
      explanation:
        "Le problème est résolu quand chaque chauffeur (gossipsConnus[i]) connaît tous les ragots, c'est-à-dire quand le nombre de ragots connus est égal au nombre total de chauffeurs.",
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
          display: 'inline', backgroundColor: '#eef2f7', padding: '1px 5px',
          borderRadius: '3px', fontFamily: 'monospace', color: '#e01e5a',
          fontWeight: 'bold', fontSize: '13px'
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
    .replace(/\r?\n- /g, " ◆ ").replace(/\r?\n• /g, " ◆ ").replace(/\r?\n/g, " ")
    .replace(/\.-\s*\*\*/g, " ◆ **").replace(/-\s*\*\*/g, " ◆ **");
  if (cleanText.startsWith(" ◆ ")) cleanText = cleanText.substring(3);
  if (cleanText.startsWith("- ")) cleanText = cleanText.substring(2);
  const segments = cleanText.split(" ◆ ");
  return (
    <span style={{ display: 'block', lineHeight: '1.7' }}>
      {segments.map((segment, segIdx) => (
        <span key={segIdx} style={{ display: 'block', marginBottom: segIdx < segments.length - 1 ? '6px' : '0' }}>
          {segIdx > 0 && <span style={{ color: '#1a73e8', fontWeight: 'bold', marginRight: '5px' }}>◆</span>}
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
        ? <h3 className="success">🚀 Infrastructure REST API CIB maîtrisée — Mission MAPS prête !</h3>
        : <p className="fail">📚 Révisez l'API REST, le multithreading C# et l'architecture microservices CIB.</p>}
    </div>
  );
};

const CIBRestApiInfraQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") setLevel("avance");
      else if (level === "avance") setLevel("expert");
      else setShowResult(true);
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  }, [level, currentQuestion]);

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, handleNextQuestion, message]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen"); setCurrentQuestion(0); setTimeLeft(25); return 0;
        });
      }, 20000);
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
            CIB REST API & Infrastructure 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`}
          </h4>
          {level === "basic"
            ? <Flashcard slide={basicSlides[currentSlide]} />
            : <QuestionCard question={questions[level][currentQuestion].question} options={questions[level][currentQuestion].options} onAnswerClick={handleAnswerClick} timeLeft={timeLeft} />}
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default CIBRestApiInfraQCM;
