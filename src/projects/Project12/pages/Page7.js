// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== NIVEAU 1-2 ====================
  {
    question: "Niveau 1-2 — Matrices et Voisinage",
    answer:
      "◆ **Matrice** : tableau 2D, accès grille[ligne, colonne] ◆ **Double boucle** : for (ligne) { for (colonne) { ... } } ◆ **Voisins 4 directions** : haut(-1,0), bas(1,0), gauche(0,-1), droite(0,1) ◆ **Voisins 8 directions** : ajout des diagonales ◆ **Validation** : vérifier nl>=0 && nl<n && nc>=0 && nc<m ◆ **Ordre** : ligne d'abord, colonne ensuite ⚠️ La gestion du voisinage est la clé de tous les algorithmes de pathfinding",
  },
  // ==================== NIVEAU 3 ====================
  {
    question: "Niveau 3 — DFS (Depth First Search)",
    answer:
      "◆ **Principe** : explorer le plus profond possible avant de revenir en arrière ◆ **Structure** : Stack (Pile) ou Récursion ◆ **Applications** : labyrinthes, détection de cycles, backtracking (Sudoku), comptage d'îles ◆ **Code clé** : `visite[l,c]=true` puis appels récursifs sur les voisins ◆ **Backtracking** : annuler la modification après l'exploration ◆ **vs BFS** : DFS ne garantit PAS le plus court chemin, BFS oui ⚠️ DFS est plus simple à implémenter récursivement, mais peut causer StackOverflow",
  },
  // ==================== NIVEAU 4 ====================
  {
    question: "Niveau 4 — BFS (Breadth First Search)",
    answer:
      "◆ **Principe** : explorer couche par couche (cercles concentriques) ◆ **Structure** : Queue (File) ◆ **Garantie** : trouve toujours le plus court chemin (sans poids) ◆ **Code clé** : file.Enqueue((nl,nc,dist+1)) ◆ **Reconstruction** : tableau parent pour retrouver le chemin ◆ **BFS multi-source** : plusieurs points de départ simultanés ◆ **vs DFS** : plus gourmand en mémoire, mais garantit l'optimalité ⚠️ BFS est l'algorithme fondamental du pathfinding",
  },
  // ==================== NIVEAU 5 ====================
  {
    question: "Niveau 5 — Flood Fill",
    answer:
      "◆ **Principe** : propager une valeur depuis un point de départ vers toutes les cellules connectées ◆ **Application** : outil 'pot de peinture' ◆ **Algorithme** : DFS ou BFS sur les cellules adjacentes de même couleur ◆ **Code clé** : `if (grille[l,c] != ancienne) return; grille[l,c] = nouvelle;` ◆ **Récursif vs Itératif** : récursif simple mais risque StackOverflow, itératif avec Queue plus sûr ◆ **Détection régions fermées** : Flood Fill depuis les bords pour marquer les zones accessibles ⚠️ Flood Fill = BFS/DFS avec une condition de couleur",
  },
  // ==================== NIVEAU 6 ====================
  {
    question: "Niveau 6 — Graphes",
    answer:
      "◆ **Graphe** : ensemble de noeuds (sommets) reliés par des arêtes ◆ **Liste d'adjacence** : Dictionary<int, List<(int voisin, int poids)>> ◆ **Matrice d'adjacence** : int[,] adj = new int[n,n] ◆ **BFS sur graphe** : HashSet pour visite, Queue pour exploration ◆ **Graphe orienté vs non-orienté** : orientation des arêtes ◆ **DAG** : Directed Acyclic Graph (graphe orienté acyclique) ◆ **Tri topologique** : ordre d'exécution des tâches avec dépendances ⚠️ Un graphe est une généralisation de la grille",
  },
  // ==================== NIVEAU 7 ====================
  {
    question: "Niveau 7 — Dijkstra",
    answer:
      "◆ **Principe** : trouver le chemin le moins coûteux dans un graphe à poids positifs ◆ **Structure** : PriorityQueue (min-heap) triée par distance ◆ **Initialisation** : dist[source]=0, tous les autres = infini ◆ **Mise à jour** : si dist[u] + poids < dist[v], mettre à jour ◆ **Applications** : GPS, réseaux, coûts de terrain ◆ **vs BFS** : BFS = tous les poids = 1, Dijkstra = poids variables ◆ **Limite** : ne fonctionne pas avec des poids négatifs ⚠️ Dijkstra = BFS avec des coûts variables",
  },
  // ==================== NIVEAU 8 ====================
  {
    question: "Niveau 8 — A* (A-Star)",
    answer:
      "◆ **Principe** : Dijkstra + heuristique (estimation de la distance restante) ◆ **Formule** : f(n) = g(n) + h(n) ◆ **Heuristiques** : Manhattan (4 dir), Euclidienne (8 dir), Chebyshev (8 dir) ◆ **Admissible** : ne surestime jamais le coût réel → garantit l'optimalité ◆ **Structure** : PriorityQueue triée par fCost ◆ **Code clé** : `int fCost = gCost + Heuristique(nl,nc, eL,eC)` ◆ **vs Dijkstra** : A* explore beaucoup moins de noeuds grâce à l'heuristique ⚠️ A* est le roi du pathfinding, utilisé dans tous les jeux vidéo",
  },
  // ==================== NIVEAU 9 ====================
  {
    question: "Niveau 9 — Bidirectional BFS",
    answer:
      "◆ **Principe** : deux BFS simultanés depuis le départ ET depuis l'arrivée ◆ **Rencontre** : quand les deux fronts se rejoignent → chemin trouvé ◆ **Complexité** : 2 × O(b^(d/2)) au lieu de O(b^d) ◆ **Gain** : factor ~512x pour b=4, d=10 ◆ **Code clé** : visD, visA, distD, distA, deux queues ◆ **Reconstruction** : fusionner les deux chemins à la rencontre ◆ **Bidirectionnel A*** : combinaison avec heuristique ⚠️ Bidirectionnel = racine carrée de la complexité de BFS",
  },
  // ==================== NIVEAU 10 ====================
  {
    question: "Niveau 10 — NavMesh & Algorithmes Avancés",
    answer:
      "◆ **NavMesh** : décompose l'espace en polygones convexes (technique Unity/Unreal) ◆ **Jump Point Search (JPS)** : saute les noeuds redondants sur grilles uniformes ◆ **Theta*** : chemins en ligne droite (pas contraints à la grille) ◆ **D* Lite** : replanification rapide quand le terrain change ◆ **HPA*** : pathfinding hiérarchique pour très grandes cartes ◆ **NavMesh vs Grille** : plus précis, plus naturel, utilisé en production ◆ **Structure** : Polygone { Sommets, Centre, Voisins } ⚠️ Le NavMesh est la technique professionnelle, utilisée par Unity et Unreal Engine",
  },
 // ==================== NOUVEAU : COMPLEXITÉ ET OPTIMISATION ====================
  {
    question: "Complexité et Optimisation — Comprendre les performances",
    answer:
      "◆ **Big O** : notation pour décrire la complexité (temps/mémoire) ◆ **O(1)** : constant (accès dict, set) ◆ **O(log n)** : logarithmique (PriorityQueue, B-Tree) ◆ **O(n)** : linéaire (parcours de liste) ◆ **O(n²)** : quadratique (double boucle sur matrice) ◆ **O(b^d)** : exponentiel (BFS/DFS sans optimisation) ◆ **Optimisation clé** : éviter les doublons avec HashSet/visite ◆ **Early exit** : s'arrêter dès que la cible est trouvée ◆ **Choix structure** : Queue pour BFS, Stack pour DFS, PriorityQueue pour Dijkstra/A* ⚠️ La complexité détermine si l'algorithme passe à l'échelle",
  },
  // ==================== NOUVEAU : STRUCTURES DE DONNÉES EN C# ====================
  {
    question: "Structures de données C# pour le pathfinding",
    answer:
      "◆ **Queue<T>** : FIFO (First In, First Out) → BFS ◆ **Stack<T>** : LIFO (Last In, First Out) → DFS itératif ◆ **PriorityQueue<TElement, TPriority>** : min-heap → Dijkstra, A* ◆ **HashSet<T>** : O(1) pour visite/doublons ◆ **Dictionary<K,V>** : O(1) pour adjacence/parents ◆ **List<T>** : stockage flexible ◆ **Tuple (int,int)** : coordonnées légères ◆ **ValueTuple** : `(int l, int c)` → plus performant que Tuple ◆ **Span<T>** : accès mémoire rapide (avancé) ⚠️ Le bon choix de structure impacte directement la performance de l'algorithme",
  },
  // ==================== NOUVEAU : ERREURS COURANTES ====================
  {
    question: "Erreurs courantes en pathfinding — Les pièges à éviter",
    answer:
      "◆ **Oublier la validation** : indices hors limites → IndexOutOfRangeException ◆ **Oublier le tableau de visite** : boucle infinie sur les noeuds déjà visités ◆ **Confondre ligne et colonne** : grille[l,c] ≠ grille[c,l] ◆ **Ne pas initialiser les distances** : dist = int.MaxValue pour Dijkstra/A* ◆ **Oublier le parent** : impossible de reconstruire le chemin ◆ **Mauvaise heuristique** : heuristique non admissible → A* non optimal ◆ **Récursion profonde** : StackOverflowException avec DFS sur grande grille ◆ **Ne pas gérer l'absence de chemin** : retourner -1 ou null ◆ **Oublier de marquer la source comme visitée** : la source est revisitée ⚠️ 80% des bugs viennent du tableau de visite ou de la validation des indices",
  },
  // ==================== METHODOLOGIE ====================
  {
    question: "Méthodologie — Comment aborder un exercice de pathfinding",
    answer:
      "◆ **1. Lire et comprendre** : qu'est-ce qu'on cherche ? (chemin, distance, composantes) ◆ **2. Identifier la structure** : grille (matrice) ou graphe (liste d'adjacence) ? ◆ **3. Choisir l'algorithme** : BFS (plus court chemin sans poids), Dijkstra (poids variables), A* (avec heuristique), DFS (exploration/backtracking) ◆ **4. Dessiner sur papier** : visualiser le problème avant de coder ◆ **5. Implémenter les briques** : validation des indices, voisinage, structures de données ◆ **6. Tester pas à pas** : commencer par une petite grille (3x3), puis augmenter ◆ **7. Vérifier les cas limites** : départ = arrivée, aucun chemin, grille vide, obstacles tout autour ◆ **8. Optimiser** : early exit, HashSet, PriorityQueue, éviter les allocations inutiles ⚠️ La méthodologie est plus importante que l'algorithme lui-même — 80% du travail est l'analyse avant le code",
  },
];

const questions = {
  moyen: [
    // ==================== MATRICES (4 questions) ====================
    {
      question:
        "[Matrices] Quelle est la syntaxe C# pour créer une matrice 2D de 3 lignes et 4 colonnes ?",
      options: [
        "int[,] grille = new int[3, 4];",
        "int[][] grille = new int[3][4];",
        "int[] grille = new int[12];",
        "Matrix<int> grille = new Matrix<int>(3, 4);",
      ],
      answer: "int[,] grille = new int[3, 4];",
      explanation:
        "En C#, les matrices 2D s'écrivent int[,] avec la syntaxe new int[lignes, colonnes]. L'ordre est toujours : lignes d'abord, colonnes ensuite.",
    },
    {
      question:
        "[Matrices] Dans une matrice, comment accède-t-on à la cellule en ligne 2, colonne 3 ?",
      options: [
        "grille[2, 3]",
        "grille[3, 2]",
        "grille[2][3]",
        "grille[2].colonne[3]",
      ],
      answer: "grille[2, 3]",
      explanation:
        "Les matrices 2D en C# s'accèdent avec la syntaxe grille[ligne, colonne]. Ligne d'abord, colonne ensuite.",
    },
    {
      question:
        "[Matrices] Quelle est la complexité d'un parcours complet d'une matrice n x m avec une double boucle ?",
      options: [
        "O(n) — linéaire en fonction des lignes",
        "O(n × m) — produit du nombre de lignes par le nombre de colonnes",
        "O(n + m) — somme des lignes et colonnes",
        "O(log n) — recherche dichotomique",
      ],
      answer: "O(n × m) — produit du nombre de lignes par le nombre de colonnes",
      explanation:
        "Une double boucle parcourt toutes les cellules de la matrice. Le nombre total de cellules est n × m, donc la complexité est O(n × m).",
    },
    {
      question:
        "[Matrices] Comment vérifier si un voisin (nl, nc) est valide dans une matrice de n lignes et m colonnes ?",
      options: [
        "if (nl >= 0 && nl < n && nc >= 0 && nc < m)",
        "if (nl > 0 && nl < n && nc > 0 && nc < m)",
        "if (nl >= 0 && nl <= n && nc >= 0 && nc <= m)",
        "if (nl > 0 && nl <= n && nc > 0 && nc <= m)",
      ],
      answer: "if (nl >= 0 && nl < n && nc >= 0 && nc < m)",
      explanation:
        "Les indices valides vont de 0 à n-1 pour les lignes et de 0 à m-1 pour les colonnes. La condition est : nl >= 0 && nl < n && nc >= 0 && nc < m.",
    },

    // ==================== VOISINAGE (3 questions) ====================
    {
      question:
        "[Voisinage] Combien de voisins a une cellule centrale dans une grille avec 4 directions ?",
      options: [
        "4 voisins (haut, bas, gauche, droite)",
        "8 voisins (haut, bas, gauche, droite, diagonales)",
        "2 voisins (gauche, droite)",
        "6 voisins (haut, bas, gauche, droite, avant, arrière)",
      ],
      answer: "4 voisins (haut, bas, gauche, droite)",
      explanation:
        "En 4 directions, une cellule centrale a 4 voisins : haut (-1,0), bas (1,0), gauche (0,-1), droite (0,1).",
    },
    {
      question:
        "[Voisinage] Quel tableau de décalages est utilisé pour les 4 directions (haut, bas, gauche, droite) ?",
      options: [
        "dl = {-1, 1, 0, 0}, dc = {0, 0, -1, 1}",
        "dl = {-1, -1, -1, 0}, dc = {0, 1, -1, 1}",
        "dl = {0, 1, -1, 0}, dc = {1, 0, 0, -1}",
        "dl = {-1, 0, 1, 0}, dc = {0, -1, 0, 1}",
      ],
      answer: "dl = {-1, 1, 0, 0}, dc = {0, 0, -1, 1}",
      explanation:
        "Les décalages pour les 4 directions sont : haut(-1,0), bas(1,0), gauche(0,-1), droite(0,1). Les tableaux sont dl = {-1, 1, 0, 0} et dc = {0, 0, -1, 1}.",
    },
    {
      question:
        "[Voisinage] Pourquoi vérifie-t-on toujours la validité d'un voisin avant de l'utiliser ?",
      options: [
        "Pour éviter une exception OutOfRangeException en dehors de la grille",
        "Pour améliorer les performances",
        "Pour que le code soit plus lisible",
        "Pour éviter les boucles infinies",
      ],
      answer: "Pour éviter une exception OutOfRangeException en dehors de la grille",
      explanation:
        "Sans vérification, un voisin en bordure sortirait de la grille et provoquerait une IndexOutOfRangeException. La vérification est indispensable pour la sécurité du code.",
    },

    // ==================== DFS (3 questions) ====================
    {
      question:
        "[DFS] Quelle structure de données est utilisée par DFS de manière récursive ?",
      options: [
        "Queue (File, FIFO)",
        "Stack (Pile, LIFO) — implicite avec la récursion",
        "List (Liste)",
        "Dictionary (Dictionnaire)",
      ],
      answer: "Stack (Pile, LIFO) — implicite avec la récursion",
      explanation:
        "DFS utilise implicitement la pile d'appels (call stack) lors de la récursion. En version itérative, on utilise explicitement une Stack<T>.",
    },
    {
      question:
        "[DFS] DFS garantit-il le plus court chemin dans un labyrinthe ?",
      options: [
        "Oui, toujours",
        "Non, DFS ne garantit pas le plus court chemin",
        "Oui, mais uniquement pour les grilles 5x5",
        "Non, DFS n'explore que les bords",
      ],
      answer: "Non, DFS ne garantit pas le plus court chemin",
      explanation:
        "DFS explore le plus profond possible avant de revenir en arrière. Il trouve un chemin, mais pas nécessairement le plus court. BFS garantit le plus court chemin.",
    },
    {
      question:
        "[DFS] Quelle est une application typique de DFS dans le cours ?",
      options: [
        "GPS (plus court chemin)",
        "Résolution de labyrinthe et comptage d'îles (composantes connexes)",
        "Réseau social (degrés de séparation)",
        "Optimisation de coûts de transport",
      ],
      answer: "Résolution de labyrinthe et comptage d'îles (composantes connexes)",
      explanation:
        "DFS est utilisé pour résoudre des labyrinthes, compter les îles (composantes connexes), et le backtracking (Sudoku). BFS est utilisé pour le plus court chemin.",
    },

    // ==================== BFS (3 questions) ====================
    {
      question:
        "[BFS] Quelle structure de données est utilisée par BFS ?",
      options: [
        "Stack (Pile, LIFO)",
        "Queue (File, FIFO)",
        "List (Liste)",
        "Heap (Tas)",
      ],
      answer: "Queue (File, FIFO)",
      explanation:
        "BFS utilise une Queue (file) pour explorer couche par couche. FIFO (First In, First Out) garantit que les noeuds sont explorés dans l'ordre de découverte.",
    },
    {
      question:
        "[BFS] Pourquoi BFS est-il l'algorithme fondamental du pathfinding ?",
      options: [
        "Parce qu'il est plus rapide que DFS",
        "Parce qu'il garantit le plus court chemin dans un graphe sans poids",
        "Parce qu'il utilise moins de mémoire que DFS",
        "Parce qu'il est plus simple à implémenter",
      ],
      answer: "Parce qu'il garantit le plus court chemin dans un graphe sans poids",
      explanation:
        "BFS explore couche par couche. La première fois qu'il atteint la destination, c'est nécessairement par le chemin le plus court (nombre minimum de pas).",
    },
    {
      question:
        "[BFS] Comment reconstruit-on le chemin après un BFS sur grille ?",
      options: [
        "En stockant la distance dans chaque cellule",
        "En utilisant un tableau parent qui stocke le prédécesseur de chaque cellule",
        "En refaisant une recherche inversée",
        "En utilisant une PriorityQueue",
      ],
      answer: "En utilisant un tableau parent qui stocke le prédécesseur de chaque cellule",
      explanation:
        "On stocke pour chaque cellule ses coordonnées parentes (l,c) lors de la découverte. On remonte ensuite depuis la destination jusqu'à la source.",
    },

    // ==================== FLOOD FILL (2 questions) ====================
    {
      question:
        "[Flood Fill] Quel algorithme est derrière l'outil 'pot de peinture' d'un logiciel de dessin ?",
      options: [
        "Dijkstra",
        "Flood Fill (remplissage par propagation)",
        "A*",
        "Tri topologique",
      ],
      answer: "Flood Fill (remplissage par propagation)",
      explanation:
        "Le Flood Fill propage une couleur depuis un point de départ vers toutes les cellules connectées de la même couleur. C'est exactement l'outil 'pot de peinture'.",
    },
    {
      question:
        "[Flood Fill] Comment éviter une boucle infinie dans un Flood Fill récursif ?",
      options: [
        "En utilisant un Thread.Sleep()",
        "En vérifiant que la couleur ancienne est différente de la couleur nouvelle",
        "En limitant le nombre d'appels à 1000",
        "C'est impossible à éviter",
      ],
      answer: "En vérifiant que la couleur ancienne est différente de la couleur nouvelle",
      explanation:
        "Si ancienne == nouvelle, le Flood Fill ne change rien mais continue de s'appeler indéfiniment (récursion infinie). Il faut vérifier avant de démarrer.",
    },

    // ==================== DIJKSTRA (3 questions) ====================
    {
      question:
        "[Dijkstra] Quelle structure de données est utilisée pour optimiser l'extraction du minimum dans Dijkstra ?",
      options: [
        "Queue (File FIFO)",
        "Stack (Pile LIFO)",
        "PriorityQueue (File de priorité / min-heap)",
        "List (Liste simple)",
      ],
      answer: "PriorityQueue (File de priorité / min-heap)",
      explanation:
        "Dijkstra utilise une PriorityQueue (min-heap) pour toujours extraire le noeud avec la plus petite distance courante. C'est le cœur de l'algorithme.",
    },
    {
      question:
        "[Dijkstra] Quelle est la condition de mise à jour dans Dijkstra ?",
      options: [
        "if (dist[u] + poids < dist[v]) { dist[v] = dist[u] + poids; }",
        "if (dist[v] + poids < dist[u]) { dist[u] = dist[v] + poids; }",
        "if (dist[u] + poids > dist[v]) { dist[v] = dist[u] + poids; }",
        "if (dist[u] > poids) { dist[v] = poids; }",
      ],
      answer: "if (dist[u] + poids < dist[v]) { dist[v] = dist[u] + poids; }",
      explanation:
        "On met à jour dist[v] si on trouve un chemin plus court via u. dist[u] est la distance actuelle de la source à u, poids est le coût de l'arête u→v.",
    },
    {
      question:
        "[Dijkstra] Sur quel type de graphe Dijkstra ne fonctionne-t-il PAS ?",
      options: [
        "Graphes avec des poids positifs",
        "Graphes avec des poids négatifs",
        "Graphes non orientés",
        "Graphes orientés",
      ],
      answer: "Graphes avec des poids négatifs",
      explanation:
        "Dijkstra suppose que tous les poids sont ≥ 0. Avec des poids négatifs, il peut échouer. Pour les poids négatifs, on utilise Bellman-Ford.",
    },

    // ==================== A* (3 questions) ====================
    {
      question:
        "[A*] Quelle est la formule de A* ?",
      options: [
        "f(n) = g(n) + h(n)",
        "f(n) = g(n) - h(n)",
        "f(n) = g(n) * h(n)",
        "f(n) = g(n) / h(n)",
      ],
      answer: "f(n) = g(n) + h(n)",
      explanation:
        "A* combine le coût connu depuis le départ (g(n)) avec l'estimation du coût restant (h(n), l'heuristique). f(n) = g(n) + h(n) est la formule clé.",
    },
    {
      question:
        "[A*] Quelle est l'heuristique la plus utilisée pour une grille avec 4 directions (haut, bas, gauche, droite) ?",
      options: [
        "Heuristique Euclidienne",
        "Heuristique Manhattan (distance en ville)",
        "Heuristique Chebyshev",
        "Heuristique de Dijkstra",
      ],
      answer: "Heuristique Manhattan (distance en ville)",
      explanation:
        "Manhattan est la somme des différences absolues : |l1-l2| + |c1-c2|. C'est parfait pour les 4 directions où les diagonales ne sont pas autorisées.",
    },
    {
      question:
        "[A*] Pourquoi A* explore-t-il moins de noeuds que Dijkstra ?",
      options: [
        "Parce qu'il utilise plus de mémoire",
        "Parce qu'il utilise une heuristique pour se diriger vers la cible",
        "Parce qu'il est plus lent",
        "Parce qu'il ignore les murs",
      ],
      answer: "Parce qu'il utilise une heuristique pour se diriger vers la cible",
      explanation:
        "L'heuristique h(n) guide la recherche vers la destination. A* explore préférentiellement les noeuds proches de la cible, contrairement à Dijkstra qui explore toutes les directions.",
    },

    // ==================== BIDIRECTIONNEL (2 questions) ====================
    {
      question:
        "[Bidirectionnel] Quel est l'avantage principal du Bidirectional BFS par rapport au BFS classique ?",
      options: [
        "Il trouve toujours un meilleur chemin",
        "Il explore beaucoup moins de noeuds (√ de la complexité)",
        "Il utilise moins de code",
        "Il est plus simple à implémenter",
      ],
      answer: "Il explore beaucoup moins de noeuds (√ de la complexité)",
      explanation:
        "BFS classique explore O(b^d) noeuds. Bidirectionnel explore 2 × O(b^(d/2)). Pour b=4, d=10, gain de 512x. C'est la racine carrée de la complexité.",
    },
    {
      question:
        "[Bidirectionnel] Comment détecte-t-on que les deux fronts de Bidirectional BFS se sont rencontrés ?",
      options: [
        "Quand les deux queues sont vides",
        "Quand une cellule est visitée par les deux fronts (visD[nl,nc] && visA[nl,nc])",
        "Quand la distance totale dépasse 1000",
        "Quand le départ et l'arrivée sont identiques",
      ],
      answer: "Quand une cellule est visitée par les deux fronts (visD[nl,nc] && visA[nl,nc])",
      explanation:
        "Quand un front découvre une cellule déjà visitée par l'autre front, les deux chemins se rejoignent. Le chemin total est distD + distA.",
    },

    // ==================== GRAPHES (2 questions) ====================
    {
      question:
        "[Graphes] Quelle est la représentation de graphe la plus efficace en mémoire pour un graphe peu dense (peu d'arêtes) ?",
      options: [
        "Matrice d'adjacence (int[,])",
        "Liste d'adjacence (Dictionary<int, List<(int,int)>>)",
        "Tableau de listes",
        "Les deux sont équivalents",
      ],
      answer: "Liste d'adjacence (Dictionary<int, List<(int,int)>>)",
      explanation:
        "La liste d'adjacence ne stocke que les arêtes existantes. Pour un graphe peu dense, elle est beaucoup plus efficace en mémoire qu'une matrice d'adjacence qui stocke n² valeurs.",
    },
    {
      question:
        "[Graphes] Qu'est-ce qu'un DAG (Directed Acyclic Graph) ?",
      options: [
        "Un graphe orienté avec des cycles",
        "Un graphe orienté sans cycle (acyclique)",
        "Un graphe non orienté",
        "Un graphe sans arêtes",
      ],
      answer: "Un graphe orienté sans cycle (acyclique)",
      explanation:
        "DAG = Directed Acyclic Graph. C'est un graphe orienté qui ne contient aucun cycle. Utilisé pour les dépendances de tâches (tri topologique).",
    },
  ],
  avance: [
    // ==================== AVANCE ====================
    {
      question:
        "[Avancé] En A*, que signifie 'heuristique admissible' ?",
      options: [
        "L'heuristique donne toujours la distance exacte",
        "L'heuristique ne surestime jamais le coût réel → garantit l'optimalité",
        "L'heuristique est toujours plus grande que le coût réel",
        "L'heuristique ne dépend pas de la grille",
      ],
      answer: "L'heuristique ne surestime jamais le coût réel → garantit l'optimalité",
      explanation:
        "Une heuristique admissible ne surestime jamais le coût restant. Cela garantit que A* trouve le chemin optimal (si l'heuristique est aussi cohérente).",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre Manhattan et Chebyshev ?",
      options: [
        "Manhattan = |dl|+|dc| (4 directions), Chebyshev = max(|dl|,|dc|) (8 directions)",
        "Manhattan = max(|dl|,|dc|), Chebyshev = |dl|+|dc|",
        "Manhattan = √(dl²+dc²), Chebyshev = |dl|+|dc|",
        "Il n'y a pas de différence",
      ],
      answer: "Manhattan = |dl|+|dc| (4 directions), Chebyshev = max(|dl|,|dc|) (8 directions)",
      explanation:
        "Manhattan est la distance en ville (4 directions). Chebyshev autorise les diagonales (8 directions) : le coût est le maximum des deux différences.",
    },
    {
      question:
        "[Avancé] Pourquoi Dijkstra ne peut-il pas être utilisé sur une grille avec des poids négatifs ?",
      options: [
        "Parce que les poids négatifs cassent l'algorithme greedy",
        "Parce que les distances deviennent négatives",
        "Parce que la PriorityQueue ne supporte pas les poids négatifs",
        "Parce que Dijkstra est conçu pour les poids positifs uniquement",
      ],
      answer: "Parce que les poids négatifs cassent l'algorithme greedy",
      explanation:
        "Dijkstra suppose qu'une fois qu'un noeud est extrait de la PriorityQueue, sa distance est finale. Avec des poids négatifs, on pourrait trouver un chemin plus court plus tard.",
    },
    {
      question:
        "[Avancé] Quelle est la particularité de Jump Point Search (JPS) par rapport à A* ?",
      options: [
        "Il utilise des poids aléatoires",
        "Il saute les noeuds redondants sur les grilles uniformes",
        "Il utilise une heuristique différente",
        "Il est plus lent que A*",
      ],
      answer: "Il saute les noeuds redondants sur les grilles uniformes",
      explanation:
        "JPS identifie les 'jump points' : les seuls noeuds où le chemin optimal peut changer de direction. Il ignore les noeuds intermédiaires, réduisant les explorés.",
    },
  ],
  expert: [
    // ==================== PIEGES ====================
    {
      question:
        "[PIÈGE] Quelle est la différence entre une matrice de type int[,] et int[][] en C# ?",
      options: [
        "int[,] est une matrice 2D (rectangulaire), int[][] est un tableau de tableaux (jagged array)",
        "int[,] est plus rapide que int[][]",
        "int[][] est plus lent que int[,]",
        "Il n'y a pas de différence",
      ],
      answer: "int[,] est une matrice 2D (rectangulaire), int[][] est un tableau de tableaux (jagged array)",
      explanation:
        "int[,] est une matrice 2D rectangulaire (toutes les lignes ont la même longueur). int[][] est un tableau de tableaux (chaque ligne peut avoir une longueur différente).",
    },
    {
      question:
        "[PIÈGE] En DFS récursive, que se passe-t-il si le labyrinthe est trop grand (ex: 1000x1000) ?",
      options: [
        "La DFS trouve le chemin plus rapidement",
        "La récursion peut causer un StackOverflowException",
        "La DFS utilise plus de mémoire que BFS",
        "La DFS se termine normalement",
      ],
      answer: "La récursion peut causer un StackOverflowException",
      explanation:
        "Chaque appel récursif ajoute un frame à la pile d'appels. Pour un grand labyrinthe, la pile peut déborder (StackOverflowException). Il faut utiliser la version itérative avec Stack<T>.",
    },
    {
      question:
        "[PIÈGE] En C#, quelle est la différence entre PriorityQueue<int,int> et Queue<int> ?",
      options: [
        "Queue est FIFO, PriorityQueue sort par priorité (plus petite priorité d'abord)",
        "PriorityQueue est plus lent que Queue",
        "Queue est plus récent que PriorityQueue",
        "Il n'y a pas de différence",
      ],
      answer: "Queue est FIFO, PriorityQueue sort par priorité (plus petite priorité d'abord)",
      explanation:
        "Queue est FIFO (First In, First Out). PriorityQueue extrait l'élément avec la plus petite priorité (min-heap). C'est essentiel pour Dijkstra et A*.",
    },
    {
      question:
        "[PIÈGE] Pourquoi A* est-il considéré comme 'optimal' dans un jeu vidéo ?",
      options: [
        "Parce qu'il trouve toujours le chemin le plus court",
        "Parce qu'il trouve le chemin le plus court si l'heuristique est admissible",
        "Parce qu'il est plus rapide que tous les autres",
        "Parce qu'il utilise le moins de mémoire",
      ],
      answer: "Parce qu'il trouve le chemin le plus court si l'heuristique est admissible",
      explanation:
        "A* est optimal si l'heuristique est admissible (ne surestime pas le coût réel) et cohérente. Dans ce cas, il garantit le chemin de coût minimum.",
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
