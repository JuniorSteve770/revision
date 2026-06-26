// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== SLIDE 1: MATRICES ====================
  {
    question: "Niveau 1 — Matrices — Syntaxe et parcours",
    answer:
      "```csharp\n// Déclaration d'une matrice 3x4\nint[,] grille = new int[3, 4];\n\n// Parcours complet — double boucle\nfor (int l = 0; l < n; l++)\n    for (int c = 0; c < m; c++)\n        Console.Write(grille[l, c]);\n\n// Accès : grille[ligne, colonne] — ligne d'abord !\n// Ordre des indices : (ligne, colonne) ⚠️ ne pas inverser\n```\n◆ **Syntaxe** : `int[,]` pour matrice 2D ◆ **Accès** : `grille[l, c]` ◆ **Parcours** : double boucle (lignes → colonnes) ◆ **Erreur fréquente** : confondre ligne et colonne ⚠️ `grille[3,0]` → IndexOutOfRangeException si 3 lignes",
  },
  // ==================== SLIDE 2: VOISINAGE ====================
  {
    question: "Niveau 2 — Voisinage — Les 4 directions",
    answer:
      "```csharp\n// Tableaux de décalages — technique universelle\nint[] dl = { -1, 1, 0, 0 }; // haut, bas, gauche, droite\nint[] dc = { 0, 0, -1, 1 };\n\n// Récupérer les voisins valides\nfor (int i = 0; i < 4; i++)\n{\n    int nl = l + dl[i];\n    int nc = c + dc[i];\n    // Vérifier les bornes AVANT d'accéder !\n    if (nl >= 0 && nl < n && nc >= 0 && nc < m)\n        Console.WriteLine(grille[nl, nc]);\n}\n```\n◆ **4 directions** : haut(-1,0), bas(1,0), gauche(0,-1), droite(0,1) ◆ **Validation** : toujours vérifier les bornes avant l'accès ◆ **Piège** : oublier la validation → IndexOutOfRangeException ⚠️ L'ordre des conditions && est crucial",
  },
  // ==================== SLIDE 3: DFS ====================
  {
    question: "Niveau 3 — DFS — Exploration récursive",
    answer:
      "```csharp\nbool[,] visite = new bool[n, m];\n\nvoid DFS(int[,] g, int l, int c, int n, int m)\n{\n    // 1. Hors grille\n    if (l < 0 || l >= n || c < 0 || c >= m) return;\n    // 2. Déjà visité\n    if (visite[l, c]) return;\n    // 3. Obstacle\n    if (g[l, c] == 0) return;\n\n    visite[l, c] = true; // marquer AVANT d'explorer\n    Console.WriteLine($\"({l},{c})\");\n\n    // Appels récursifs — 4 directions\n    DFS(g, l-1, c, n, m); // haut\n    DFS(g, l+1, c, n, m); // bas\n    DFS(g, l, c-1, n, m); // gauche\n    DFS(g, l, c+1, n, m); // droite\n}\n```\n◆ **Stack implicite** : la pile d'appels ◆ **Backtracking** : retour en arrière automatique ◆ **Limite** : risque StackOverflow sur grandes grilles ⚠️ L'ordre des 3 conditions d'arrêt est critique",
  },
  // ==================== SLIDE 4: BFS ====================
  {
    question: "Niveau 4 — BFS — Plus court chemin",
    answer:
      "```csharp\n// Queue (FIFO) — exploration couche par couche\nQueue<(int l, int c, int dist)> q = new();\nq.Enqueue((sL, sC, 0));\nvisite[sL, sC] = true;\n\nwhile (q.Count > 0)\n{\n    var (l, c, dist) = q.Dequeue();\n    if (l == eL && c == eC) return dist; // premier = plus court !\n\n    for (int i = 0; i < 4; i++)\n    {\n        int nl = l + dl[i], nc = c + dc[i];\n        if (valide(nl, nc) && !visite[nl, nc] && g[nl, nc] != 0)\n        {\n            visite[nl, nc] = true;\n            q.Enqueue((nl, nc, dist + 1));\n        }\n    }\n}\nreturn -1; // aucun chemin\n```\n◆ **Structure** : Queue<T> (FIFO) ◆ **Garantie** : premier chemin trouvé = plus court ◆ **Reconstruction** : tableau parent pour retrouver le chemin ⚠️ BFS = BFS + Queue + distance",
  },
  // ==================== SLIDE 5: DIJKSTRA ====================
  {
    question: "Niveau 5 — Dijkstra — Coûts variables",
    answer:
      "```csharp\nint[] dist = new int[n];\nArray.Fill(dist, int.MaxValue);\ndist[source] = 0;\n\nvar pq = new PriorityQueue<int, int>();\npq.Enqueue(source, 0);\n\nwhile (pq.Count > 0)\n{\n    int u = pq.Dequeue();\n    foreach (var (v, w) in graphe[u])\n    {\n        // Relaxation — cœur de l'algorithme\n        if (dist[u] + w < dist[v])\n        {\n            dist[v] = dist[u] + w;\n            pq.Enqueue(v, dist[v]);\n        }\n    }\n}\n```\n◆ **Structure** : PriorityQueue (min-heap) ◆ **Opération** : relaxation `if (dist[u] + w < dist[v])` ◆ **Garantie** : chemin le moins coûteux (poids ≥ 0) ⚠️ Ne pas oublier d'initialiser dist à int.MaxValue",
  },
  // ==================== SLIDE 6: A* ====================
  {
    question: "Niveau 6 — A* — Pathfinding guidé",
    answer:
      "```csharp\n// f(n) = g(n) + h(n)\nint Heuristique(int l, int c, int eL, int eC)\n    => Math.Abs(l - eL) + Math.Abs(c - eC); // Manhattan\n\n// Dans la boucle\nint ng = gCost[l, c] + 1;\nif (ng < gCost[nl, nc])\n{\n    gCost[nl, nc] = ng;\n    parent[nl, nc] = (l, c);\n    int f = ng + Heuristique(nl, nc, eL, eC);\n    open.Enqueue((nl, nc), f); // trié par f(n)\n}\n```\n◆ **Formule** : f(n) = g(n) + h(n) ◆ **Heuristiques** : Manhattan (4 dir), Euclidienne, Chebyshev ◆ **Admissible** : h(n) ne surestime jamais → optimalité garantie ⚠️ A* = Dijkstra + heuristique",
  },
  // ==================== SLIDE 7: BIDIRECTIONNEL ====================
  {
    question: "Niveau 7 — Bidirectional BFS — 2 fronts",
    answer:
      "```csharp\n// Deux fronts simultanés\nQueue<(int,int)> qD = new(); qD.Enqueue((sL, sC)); // départ\nQueue<(int,int)> qA = new(); qA.Enqueue((eL, eC)); // arrivée\n\nwhile (qD.Count > 0 || qA.Count > 0)\n{\n    // Avancer le front depuis le départ\n    if (qD.Count > 0)\n    {\n        var (l, c) = qD.Dequeue();\n        // ... exploration 4 directions ...\n        if (visA[nl, nc]) // RENCONTRE !\n            return distD[nl, nc] + distA[nl, nc];\n    }\n    // Avancer le front depuis l'arrivée (symétrique)\n    if (qA.Count > 0) { /* idem avec visD */ }\n}\nreturn -1;\n```\n◆ **Gain** : √ de la complexité BFS ◆ **Rencontre** : `visD && visA` ◆ **Reconstruction** : fusionner les deux chemins ⚠️ BFS classique : O(b^d) → Bidirectionnel : 2×O(b^(d/2))",
  },
  // ==================== SLIDE 8: FLOOD FILL ====================
  {
    question: "Niveau 8 — Flood Fill — Pot de peinture",
    answer:
      "```csharp\nvoid FloodFill(int[,] g, int sL, int sC, \n               int ancienne, int nouvelle, int n, int m)\n{\n    if (ancienne == nouvelle) return; // PIÈGE !\n    if (g[sL, sC] != ancienne) return;\n\n    Queue<(int,int)> q = new();\n    g[sL, sC] = nouvelle;\n    q.Enqueue((sL, sC));\n\n    while (q.Count > 0)\n    {\n        var (l, c) = q.Dequeue();\n        for (int i = 0; i < 4; i++)\n        {\n            int nl = l + dl[i], nc = c + dc[i];\n            if (valide(nl, nc) && g[nl, nc] == ancienne)\n            {\n                g[nl, nc] = nouvelle; // colorier AVANT d'enfiler\n                q.Enqueue((nl, nc));\n            }\n        }\n    }\n}\n```\n◆ **Colorier avant d'enfiler** : évite les doublons ◆ **Piège** : `ancienne == nouvelle` → boucle infinie ◆ **Version récursive** : simple mais risque StackOverflow ⚠️ Flood Fill = BFS/DFS + condition de couleur",
  },
  // ==================== SLIDE 9: GRAPHES ====================
  {
    question: "Niveau 9 — Graphes — Liste d'adjacence",
    answer:
      "```csharp\n// Liste d'adjacence — la plus utilisée\nvar g = new Dictionary<int, List<(int voisin, int poids)>>();\n\nvoid Ajouter(int u, int v, int w)\n{\n    if (!g.ContainsKey(u)) g[u] = new();\n    if (!g.ContainsKey(v)) g[v] = new();\n    g[u].Add((v, w)); // u -> v\n    g[v].Add((u, w)); // v -> u (non-orienté)\n}\n\n// Parcours des voisins\nforeach (var (v, w) in g[u])\n    Console.WriteLine($\"{u} -> {v} coût {w}\");\n```\n◆ **Liste d'adjacence** : `Dictionary<int, List<(int, int)>>` ◆ **Matrice** : `int[,] adj = new int[n,n]` ◆ **BFS sur graphe** : HashSet + Queue (identique à grille) ⚠️ La grille est un cas particulier de graphe",
  },
  // ==================== SLIDE 10: NAVMESH ====================
  {
    question: "Niveau 10 — NavMesh — Polygones",
    answer:
      "```csharp\nclass Polygone\n{\n    public List<(float x, float y)> Sommets { get; set; }\n    public (float x, float y) Centre { get; set; }\n    public List<int> Voisins { get; set; }\n}\n\n// A* sur NavMesh = A* sur graphe de polygones\n// Heuristique : distance euclidienne entre centroïdes\nfloat H(Polygone a, Polygone b)\n{\n    float dx = a.Centre.x - b.Centre.x;\n    float dy = a.Centre.y - b.Centre.y;\n    return MathF.Sqrt(dx*dx + dy*dy);\n}\n```\n◆ **NavMesh** : décompose l'espace en polygones convexes ◆ **Portails** : arêtes partagées entre polygones ◆ **Mouvement** : plus naturel que la grille ◆ **Utilisation** : Unity, Unreal Engine, jeux 3D ⚠️ NavMesh = standard professionnel, pas une grille",
  },
];

const questions = {
  moyen: [
    // ==================== QUESTIONS SUR LE CODE (10 questions) ====================
    {
      question:
        "[Code] Que fait ce code ?\n\n```csharp\nint[,] g = new int[3, 4];\nfor (int l = 0; l < 3; l++)\n    for (int c = 0; c < 4; c++)\n        g[l, c] = 1;\n```",
      options: [
        "Crée une matrice 4x3 remplie de 0",
        "Crée une matrice 3x4 remplie de 1",
        "Crée une liste de 12 éléments",
        "Crée une matrice 3x4 avec des valeurs aléatoires",
      ],
      answer: "Crée une matrice 3x4 remplie de 1",
      explanation:
        "`new int[3,4]` = 3 lignes, 4 colonnes. Les deux boucles remplissent toutes les cases avec la valeur 1. L'ordre est (lignes, colonnes).",
    },
    {
      question:
        "[Code] Que fait la fonction suivante ?\n\n```csharp\nstatic bool Valide(int l, int c, int n, int m)\n{\n    return l >= 0 && l < n && c >= 0 && c < m;\n}\n```",
      options: [
        "Vérifie si une case est un mur",
        "Vérifie si une case est dans la grille (bornes)",
        "Vérifie si une case a été visitée",
        "Vérifie si une case est libre",
      ],
      answer: "Vérifie si une case est dans la grille (bornes)",
      explanation:
        "Cette fonction vérifie que les indices (l,c) sont dans les bornes de la grille : 0 <= l < n et 0 <= c < m. C'est la validation standard avant d'accéder à une cellule.",
    },
    {
      question:
        "[Code] Quel est le bug dans ce code DFS ?\n\n```csharp\nvoid DFS(int[,] g, int l, int c, int n, int m)\n{\n    if (g[l, c] == 0) return;\n    if (visite[l, c]) return;\n    if (l < 0 || l >= n || c < 0 || c >= m) return;\n    visite[l, c] = true;\n    DFS(g, l-1, c, n, m);\n}\n```",
      options: [
        "L'ordre des conditions d'arrêt est correct",
        "La vérification des bornes est faite après l'accès à g[l,c] → risque d'IndexOutOfRangeException",
        "Il manque la condition de destination",
        "La récursion n'est pas terminée",
      ],
      answer: "La vérification des bornes est faite après l'accès à g[l,c] → risque d'IndexOutOfRangeException",
      explanation:
        "Le code accède à `g[l,c]` avant de vérifier les bornes. Si l ou c sont hors grille, cela provoque une IndexOutOfRangeException. La vérification des bornes doit TOUJOURS être en premier.",
    },
    {
      question:
        "[Code] Que retourne ce code BFS si la destination n'est pas atteinte ?\n\n```csharp\nwhile (q.Count > 0)\n{\n    var (l, c, dist) = q.Dequeue();\n    if (l == eL && c == eC) return dist;\n    // ...\n}\nreturn -1;\n```",
      options: [
        "0",
        "La distance parcourue",
        "-1 (indique qu'aucun chemin n'existe)",
        "int.MaxValue",
      ],
      answer: "-1 (indique qu'aucun chemin n'existe)",
      explanation:
        "Si la file est vide sans avoir atteint la destination, BFS retourne -1 pour indiquer qu'aucun chemin n'existe. C'est une convention standard.",
    },
    {
      question:
        "[Code] Que fait cette ligne dans Dijkstra ?\n\n```csharp\nif (dist[u] + w < dist[v])\n```",
      options: [
        "Vérifie si u est plus proche que v",
        "Relaxe l'arête u→v : trouve un chemin plus court vers v via u",
        "Compare les poids de u et v",
        "Vérifie si v a déjà été visité",
      ],
      answer: "Relaxe l'arête u→v : trouve un chemin plus court vers v via u",
      explanation:
        "C'est l'opération de relaxation. Si passer par u améliore la distance vers v (dist[u] + w < dist[v]), on met à jour dist[v]. C'est le cœur de Dijkstra.",
    },
    {
      question:
        "[Code] Pourquoi ce code utilise-t-il une PriorityQueue ?\n\n```csharp\nvar pq = new PriorityQueue<int, int>();\npq.Enqueue(source, 0);\n```",
      options: [
        "Pour stocker les noeuds visités",
        "Pour extraire le noeud avec la plus petite distance en O(log n)",
        "Pour éviter les doublons dans la file",
        "Pour reconstruire le chemin final",
      ],
      answer: "Pour extraire le noeud avec la plus petite distance en O(log n)",
      explanation:
        "La PriorityQueue (min-heap) garantit que le noeud extrait a toujours la plus petite distance. L'extraction du min est O(log n), ce qui est essentiel pour la performance de Dijkstra.",
    },
    {
      question:
        "[Code] Quel est le problème avec ce Flood Fill ?\n\n```csharp\nif (g[sL, sC] != ancienne) return;\nFloodFill(g, l-1, c, ancienne, nouvelle);\n```",
      options: [
        "Il manque la condition d'arrêt sur les bornes",
        "Il manque la vérification `if (ancienne == nouvelle) return;`",
        "Il manque la vérification des bornes",
        "Toutes les réponses ci-dessus",
      ],
      answer: "Toutes les réponses ci-dessus",
      explanation:
        "Le code manque : 1) la vérification des bornes, 2) la vérification `ancienne == nouvelle` (sinon boucle infinie), 3) la condition de couleur sur les voisins. C'est un Flood Fill incomplet.",
    },
    {
      question:
        "[Code] Dans ce code DFS, que représente `chemin.RemoveAt(chemin.Count - 1)` ?\n\n```csharp\nchemin.Add((l, c));\nif (l == eL && c == eC) return true;\nfor (...) { if (DFS(...)) return true; }\nchemin.RemoveAt(chemin.Count - 1); // ligne clé\nreturn false;\n```",
      options: [
        "La suppression du dernier élément quand une branche échoue (backtracking)",
        "La suppression du chemin entier",
        "La suppression de la destination",
        "L'ajout d'un élément au chemin",
      ],
      answer: "La suppression du dernier élément quand une branche échoue (backtracking)",
      explanation:
        "Quand une branche échoue, on retire le dernier élément ajouté (backtrack). C'est le mécanisme qui permet d'explorer différentes branches sans garder les échecs dans le chemin final.",
    },
    {
      question:
        "[Code] Que fait cette fonction d'heuristique ?\n\n```csharp\nint H(int l1, int c1, int l2, int c2)\n{\n    return Math.Abs(l1 - l2) + Math.Abs(c1 - c2);\n}\n```",
      options: [
        "Distance Euclidienne",
        "Distance de Manhattan (4 directions)",
        "Distance de Chebyshev (8 directions)",
        "Distance de Dijkstra",
      ],
      answer: "Distance de Manhattan (4 directions)",
      explanation:
        "La fonction retourne |l1-l2| + |c1-c2|, c'est la distance de Manhattan. Elle est utilisée pour les grilles avec 4 directions (haut, bas, gauche, droite).",
    },
    {
      question:
        "[Code] Comment le BFS bidirectionnel détecte-t-il la rencontre des deux fronts ?",
      options: [
        "Quand les deux queues sont vides",
        "Quand une cellule est visitée par les deux fronts (`visD[nl,nc] && visA[nl,nc]`)",
        "Quand la distance totale dépasse 1000",
        "Quand le départ et l'arrivée sont identiques",
      ],
      answer: "Quand une cellule est visitée par les deux fronts (`visD[nl,nc] && visA[nl,nc]`)",
      explanation:
        "La rencontre se produit quand un front découvre une cellule déjà visitée par l'autre front. La distance totale est `distD + distA`. C'est la condition d'arrêt du BFS bidirectionnel.",
    },

    // ==================== QUESTIONS THEORIQUES (8 questions) ====================
    {
      question:
        "[Théorie] Quel algorithme garantit le plus court chemin dans un graphe sans poids ?",
      options: [
        "DFS (Depth First Search)",
        "BFS (Breadth First Search)",
        "Dijkstra (plus court chemin pondéré)",
        "Flood Fill (coloriage)",
      ],
      answer: "BFS (Breadth First Search)",
      explanation:
        "BFS explore couche par couche. La première fois qu'il atteint la destination, c'est par le chemin le plus court en nombre de pas. DFS ne garantit pas le plus court chemin.",
    },
    {
      question:
        "[Théorie] Quel algorithme utilise une PriorityQueue (min-heap) ?",
      options: [
        "DFS et BFS",
        "Dijkstra et A*",
        "Flood Fill uniquement",
        "Tri topologique",
      ],
      answer: "Dijkstra et A*",
      explanation:
        "Dijkstra et A* utilisent tous les deux une PriorityQueue (min-heap) pour extraire le noeud avec la plus petite distance/priorité. BFS utilise une Queue, DFS une Stack.",
    },
    {
      question:
        "[Théorie] Pourquoi A* est-il plus rapide que Dijkstra sur une grande carte ?",
      options: [
        "Parce qu'il utilise plus de mémoire",
        "Parce qu'il utilise une heuristique pour se diriger vers la cible, explorant moins de noeuds",
        "Parce qu'il est écrit en C#",
        "Parce qu'il ignore les murs",
      ],
      answer: "Parce qu'il utilise une heuristique pour se diriger vers la cible, explorant moins de noeuds",
      explanation:
        "L'heuristique h(n) guide la recherche vers la destination. A* explore préférentiellement les noeuds proches de la cible, contrairement à Dijkstra qui explore dans toutes les directions.",
    },
    {
      question:
        "[Théorie] Quel est l'ordre de complexité d'un parcours complet de matrice n x m ?",
      options: [
        "O(n)",
        "O(n × m)",
        "O(n + m)",
        "O(log n)",
      ],
      answer: "O(n × m)",
      explanation:
        "Une double boucle parcourt toutes les cellules. Le nombre total de cellules est n × m, donc la complexité est O(n × m). C'est la complexité de base pour tous les algorithmes de pathfinding sur grille.",
    },
    {
      question:
        "[Théorie] Que signifie 'heuristique admissible' dans A* ?",
      options: [
        "L'heuristique donne toujours la distance exacte",
        "L'heuristique ne surestime jamais le coût réel → garantit l'optimalité",
        "L'heuristique est toujours plus grande que le coût réel",
        "L'heuristique est calculée en temps réel",
      ],
      answer: "L'heuristique ne surestime jamais le coût réel → garantit l'optimalité",
      explanation:
        "Une heuristique admissible ne surestime jamais le coût restant. Cela garantit que A* trouve le chemin optimal. Si h(n) = 0, A* devient Dijkstra.",
    },
    {
      question:
        "[Théorie] Quelle est la différence entre une grille 4 directions et 8 directions ?",
      options: [
        "4 directions = 4 fois plus rapide",
        "4 directions autorise haut/bas/gauche/droite, 8 directions ajoute les diagonales",
        "8 directions est plus précis pour les mouvements",
        "Les deux B et C sont corrects",
      ],
      answer: "Les deux B et C sont corrects",
      explanation:
        "4 directions : haut, bas, gauche, droite. 8 directions : ajoute les 4 diagonales. 8 directions permet des mouvements plus précis mais l'heuristique doit être adaptée (Chebyshev).",
    },
    {
      question:
        "[Théorie] Pourquoi le tableau de visite est-il essentiel en BFS et DFS ?",
      options: [
        "Pour améliorer les performances",
        "Pour éviter les boucles infinies sur les noeuds déjà visités",
        "Pour stocker les distances",
        "Pour reconstruire le chemin",
      ],
      answer: "Pour éviter les boucles infinies sur les noeuds déjà visités",
      explanation:
        "Sans tableau de visite, l'algorithme revisite les mêmes noeuds en boucle. Il n'y a pas de condition d'arrêt. C'est le bug numéro 1 en pathfinding.",
    },
    {
      question:
        "[Théorie] Dans quel cas utilise-t-on un BFS multi-source ?",
      options: [
        "Quand on a une seule source",
        "Quand on a plusieurs sources simultanées (ex: zombies qui se propagent)",
        "Quand on n'a pas de destination",
        "Quand on veut un chemin plus court",
      ],
      answer: "Quand on a plusieurs sources simultanées (ex: zombies qui se propagent)",
      explanation:
        "Le BFS multi-source initialise la Queue avec TOUTES les sources à la fois (dist=0). La propagation se fait simultanément depuis toutes les sources. C'est idéal pour les simulations de contamination.",
    },
  ],
  avance: [
    // ==================== QUESTIONS AVANCEES (6 questions) ====================
    {
      question:
        "[Avancé] Ce code Dijkstra a un bug. Lequel ?\n\n```csharp\nint[] dist = new int[n];\n// Oubli de l'initialisation à int.MaxValue\nfor (int i = 0; i < n; i++) dist[i] = 0;\ndist[source] = 0;\n\nif (dist[u] + w < dist[v])\n{\n    dist[v] = dist[u] + w;\n}\n```",
      options: [
        "La condition `dist[u] + w < dist[v]` ne sera jamais vraie car dist[v] = 0",
        "La PriorityQueue est manquante",
        "Le tableau parent est manquant",
        "Aucun bug, le code est correct",
      ],
      answer: "La condition `dist[u] + w < dist[v]` ne sera jamais vraie car dist[v] = 0",
      explanation:
        "Si dist[v] est initialisé à 0, la condition (dist[u] + w < 0) est fausse. Les distances ne sont jamais mises à jour. Dijkstra échoue silencieusement. Il faut initialiser à int.MaxValue.",
    },
    {
      question:
        "[Avancé] Dans ce code A*, que manque-t-il pour garantir l'optimalité ?\n\n```csharp\nint f = ng + Heuristique(nl, nc, eL, eC);\nopen.Enqueue((nl, nc), f);\n```",
      options: [
        "Il manque le tableau `closed` pour ignorer les noeuds déjà traités",
        "Il manque la validation des bornes",
        "Il manque la vérification des murs",
        "Il manque la PriorityQueue",
      ],
      answer: "Il manque le tableau `closed` pour ignorer les noeuds déjà traités",
      explanation:
        "Sans `closed` (ou son équivalent `visite`), un noeud peut être traité plusieurs fois. Cela ne casse pas l'optimalité mais détruit les performances. Le code présent est un extrait, pas complet.",
    },
    {
      question:
        "[Avancé] Pourquoi le backoff exponentiel est-il utilisé dans les mécanismes de retry ?",
      options: [
        "Pour accélérer les tentatives",
        "Pour éviter l'effet de 'thundering herd' — tous les clients réessaient en même temps",
        "Pour réduire le code",
        "Pour améliorer la sécurité",
      ],
      answer: "Pour éviter l'effet de 'thundering herd' — tous les clients réessaient en même temps",
      explanation:
        "Le backoff exponentiel (1s, 2s, 4s, 8s) espace les tentatives. Le jitter (hasard) ajoute une variation pour éviter que tous les clients réessaient exactement en même temps, submergeant le système.",
    },
    {
      question:
        "[Avancé] Que signifie 'idempotence' dans le contexte des APIs et des retry ?",
      options: [
        "L'API est rapide",
        "Une requête peut être exécutée plusieurs fois avec le même résultat",
        "L'API est sécurisée",
        "L'API est asynchrone",
      ],
      answer: "Une requête peut être exécutée plusieurs fois avec le même résultat",
      explanation:
        "L'idempotence est une propriété essentielle pour les retry. Si une requête est retryée (ex: paiement), le résultat doit être le même que la première exécution. Sinon, des doublons peuvent se produire.",
    },
    {
      question:
        "[Avancé] Quelle est la complexité de l'extraction du minimum d'une PriorityQueue ?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n log n)",
      ],
      answer: "O(log n)",
      explanation:
        "L'extraction du minimum d'une PriorityQueue (min-heap) est O(log n). C'est la raison pour laquelle Dijkstra et A* sont efficaces. L'insertion est aussi O(log n).",
    },
    {
      question:
        "[Avancé] En quoi le NavMesh est-il plus efficace qu'une grille pour une grande carte 3D ?",
      options: [
        "Il est plus simple à coder",
        "Il utilise des polygones au lieu de millions de cases, et permet des mouvements naturels en ligne droite",
        "Il est plus lent mais plus précis",
        "Il utilise moins de CPU",
      ],
      answer: "Il utilise des polygones au lieu de millions de cases, et permet des mouvements naturels en ligne droite",
      explanation:
        "Le NavMesh est plus efficace en mémoire (polygones vs millions de cases) et permet des mouvements en ligne droite réelle (pas d'effet escalier). C'est la technique utilisée dans les jeux 3D professionnels.",
    },
  ],
  expert: [
    // ==================== QUESTIONS EXPERT (4 questions) ====================
    {
      question:
        "[Expert] Dans un graphe avec des poids négatifs, pourquoi Dijkstra échoue-t-il ?",
      options: [
        "Parce que les poids négatifs rendent l'algorithme trop lent",
        "Parce que Dijkstra suppose qu'une fois un noeud extrait de la PriorityQueue, sa distance est finale — faux avec des poids négatifs",
        "Parce que la PriorityQueue ne supporte pas les poids négatifs",
        "Parce que Dijkstra n'est pas conçu pour les graphes orientés",
      ],
      answer: "Parce que Dijkstra suppose qu'une fois un noeud extrait de la PriorityQueue, sa distance est finale — faux avec des poids négatifs",
      explanation:
        "Dijkstra est un algorithme greedy. Il suppose que la première fois qu'il atteint un noeud, c'est par le plus court chemin. Avec des poids négatifs, un chemin plus court peut apparaître plus tard. Bellman-Ford résout ce problème.",
    },
    {
      question:
        "[Expert] Que signifie 'heuristique cohérente' en A* et pourquoi est-ce important ?",
      options: [
        "L'heuristique est toujours nulle",
        "L'heuristique satisfait h(n) <= coût(n→m) + h(m) — elle garantit que A* est optimal sans revisiter les noeuds",
        "L'heuristique est toujours positive",
        "L'heuristique est calculée en temps réel",
      ],
      answer: "L'heuristique satisfait h(n) <= coût(n→m) + h(m) — elle garantit que A* est optimal sans revisiter les noeuds",
      explanation:
        "Une heuristique cohérente est aussi admissible. Elle garantit que la première fois qu'on atteint un noeud, c'est par le meilleur chemin (pas besoin de revisiter). C'est plus fort que la simple admissibilité.",
    },
    {
      question:
        "[Expert] Dans un réseau social de 20 personnes, quel est le diamètre maximum possible si le graphe est connecté ?",
      options: [
        "20 (le nombre de personnes)",
        "19 (le nombre maximum de degrés de séparation)",
        "6 (théorie des 6 degrés)",
        "Cela dépend de la structure du graphe",
      ],
      answer: "19 (le nombre maximum de degrés de séparation)",
      explanation:
        "Le diamètre d'un graphe de 20 noeuds connectés est au maximum 19 (si le graphe est une chaîne). La théorie des 6 degrés est une observation empirique, pas une limite mathématique.",
    },
    {
      question:
        "[Expert] Dans l'algorithme de Kahn, comment détecte-t-on un cycle ?",
      options: [
        "Si tous les noeuds ont un in-degree > 0",
        "Si le nombre de noeuds dans l'ordre est inférieur au nombre total de noeuds",
        "Si la file d'attente est vide avant la fin",
        "Si la file d'attente est pleine",
      ],
      answer: "Si le nombre de noeuds dans l'ordre est inférieur au nombre total de noeuds",
      explanation:
        "Si un cycle existe, certains noeuds auront toujours un in-degree > 0. À la fin, si `ordre.Count < n`, un cycle est détecté. Le projet est impossible (dépendance circulaire).",
    },
  ],
};



const renderInlineTokens = (text, keyPrefix) => {
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${keyPrefix}-${idx}`} style={{ display: 'inline', fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return (
      <code key={`${keyPrefix}-${idx}`} style={{ display: 'inline', backgroundColor: '#eef2f7', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', color: '#e01e5a', fontWeight: 'bold', fontSize: '13px' }}>
        {part.slice(1, -1)}
      </code>
    );
    if (part.startsWith("*") && part.endsWith("*")) return <em key={`${keyPrefix}-${idx}`} style={{ display: 'inline' }}>{part.slice(1, -1)}</em>;
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
        ? <h3 className="success">🚀 Fondations Microservices / JSON / async / LINQ maîtrisées !</h3>
        : <p className="fail">📚 Révisez les slides — focus sur les points de confusion marqués ⚠️.</p>}
    </div>
  );
};

const MicroservicesFoundationsQCM = () => {
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
      }, 15000);
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
            Matrices/Voisinage, DFS, BFS Graphes, Dijkstra, A*, Algo avancés🔹 {level === "basic"
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

export default MicroservicesFoundationsQCM;
