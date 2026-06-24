// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  // ==================== INTRODUCTION ====================
  {
    question: "Pathfinding — Concepts fondamentaux",
    answer:
      "◆ **Pathfinding** : trouver un chemin entre deux points dans un espace avec obstacles ◆ **Applications** : GPS, jeux vidéo, réseaux, robotique, IA ◆ **Grille** : représentation matricielle du terrain (0=obstacle, 1=libre) ◆ **Noeud** : case ou point dans l'espace ◆ **Arête** : connexion entre deux noeuds ◆ **Poids** : coût pour traverser une arête ◆ **Heuristique** : estimation de la distance restante ◆ **Optimalité** : garantie du meilleur chemin possible ⚠️ Le pathfinding est partout — des GPS aux jeux vidéo",
  },
  // ==================== QUAND UTILISER QUEL ALGORITHME ====================
  {
    question: "Quel algorithme pour quel besoin ?",
    answer:
      "◆ **BFS** : trouver le chemin le plus court en nombre de pas (pas de coûts) ◆ **DFS** : vérifier l'existence d'un chemin, explorer toutes les possibilités (backtracking) ◆ **Dijkstra** : trouver le chemin le moins cher avec des coûts variables (pas d'heuristique) ◆ **A*** : trouver le chemin le moins cher rapidement (avec heuristique) ◆ **Bidirectionnel** : optimiser BFS sur de longues distances ◆ **Flood Fill** : colorier/analyser des zones connectées ◆ **JPS** : A* optimisé pour grilles uniformes ◆ **Choix** : BFS = simple, Dijkstra = coûts, A* = performance, JPS = grande grille uniforme ⚠️ Le choix de l'algorithme dépend du contexte, pas de la préférence personnelle",
  },
  // ==================== ANALOGIES ====================
  {
    question: "Les analogies du pathfinding",
    answer:
      "◆ **DFS** : un explorateur qui avance toujours tout droit, revient en arrière quand il est bloqué (fil dans un labyrinthe) ◆ **BFS** : une pierre jetée dans l'eau (vagues concentriques) ◆ **Dijkstra** : un GPS qui considère tous les chemins possibles sans savoir où est la destination ◆ **A*** : un GPS avec une boussole qui pointe vers la destination ◆ **Flood Fill** : un pot de peinture qui se répand ◆ **NavMesh** : une carte découpée en zones (polygones) sur lesquelles on peut se déplacer librement ⚠️ Les analogies aident à comprendre instinctivement chaque algorithme",
  },
];

const questions = {
  moyen: [
    // ==================== CHOIX DE L'ALGORITHME (6 questions) ====================
    {
      question:
        "[Choix] Vous devez trouver le chemin le plus COURT en NOMBRE DE PAS sur une grille sans coûts. Quel algorithme choisissez-vous ?",
      options: [
        "DFS (Depth First Search) — exploration en profondeur",
        "BFS (Breadth First Search) — exploration couche par couche",
        "Dijkstra — avec des coûts variables",
        "A* — avec heuristique",
      ],
      answer: "BFS (Breadth First Search) — exploration couche par couche",
      explanation:
        "BFS garantit le plus court chemin en nombre de pas sur une grille sans poids. DFS ne le garantit pas. Dijkstra et A* sont surdimensionnés pour ce cas (et fonctionnent aussi, mais BFS est plus simple et plus rapide).",
    },
    {
      question:
        "[Choix] Votre jeu vidéo a une carte 1000x1000 avec des terrains variés (route=1, forêt=5). Vous voulez le chemin le moins coûteux. Quel algorithme est le plus adapté ?",
      options: [
        "BFS (gère les coûts uniformes uniquement)",
        "DFS (exploration en profondeur)",
        "Dijkstra (gère les coûts variables, pas d'heuristique)",
        "Flood Fill (coloriage de zones)",
      ],
      answer: "Dijkstra (gère les coûts variables, pas d'heuristique)",
      explanation:
        "Dijkstra est conçu pour les coûts variables. A* pourrait aussi fonctionner avec une heuristique, mais Dijkstra est plus simple si on n'a pas besoin d'optimisation. BFS ne gère que les coûts uniformes (tous = 1).",
    },
    {
      question:
        "[Choix] Vous devez colorier toutes les cases connectées de la même couleur dans une image. Quel algorithme utilisez-vous ?",
      options: [
        "Dijkstra (chemin pondéré)",
        "A* (chemin guidé)",
        "Flood Fill (remplissage par propagation)",
        "Tri topologique (ordre de tâches)",
      ],
      answer: "Flood Fill (remplissage par propagation)",
      explanation:
        "Flood Fill est spécifiquement conçu pour propager une valeur depuis un point de départ vers toutes les cellules connectées de même couleur. C'est l'outil 'pot de peinture'.",
    },
    {
      question:
        "[Choix] Vous devez savoir si un chemin EXISTE entre deux points dans un labyrinthe, sans vous soucier de sa longueur. Quel algorithme est le plus simple à implémenter ?",
      options: [
        "BFS (exploration couche par couche)",
        "DFS (exploration en profondeur avec backtracking)",
        "Dijkstra (calcul des distances)",
        "A* (avec heuristique)",
      ],
      answer: "DFS (exploration en profondeur avec backtracking)",
      explanation:
        "DFS est le plus simple pour vérifier l'existence d'un chemin. Il explore en profondeur et revient en arrière si nécessaire. BFS fonctionne aussi mais est plus gourmand en mémoire.",
    },
    {
      question:
        "[Choix] Votre GPS doit calculer un itinéraire en tenant compte du trafic (coûts variables). Il doit répondre en moins de 100ms sur un réseau de 10 000 villes. Quel algorithme est le plus adapté ?",
      options: [
        "BFS (trop simple, ne gère pas les coûts)",
        "Dijkstra (optimal mais peut être lent sur 10 000 noeuds)",
        "A* avec une bonne heuristique (guidé, plus rapide)",
        "Flood Fill (pas adapté)",
      ],
      answer: "A* avec une bonne heuristique (guidé, plus rapide)",
      explanation:
        "A* est le choix standard pour les GPS. L'heuristique (distance à vol d'oiseau) guide la recherche vers la destination. Dijkstra serait plus lent sur un grand réseau car il explore dans toutes les directions.",
    },
    {
      question:
        "[Choix] Vous avez une grande grille uniforme (tous les coûts = 1) de 5000x5000. A* est trop lent. Quelle optimisation pouvez-vous utiliser ?",
      options: [
        "Dijkstra (encore plus lent sur grille uniforme)",
        "Jump Point Search (JPS) — saute les noeuds redondants",
        "Flood Fill (pas adapté)",
        "BFS bidirectionnel (bon mais moins efficace que JPS)",
      ],
      answer: "Jump Point Search (JPS) — saute les noeuds redondants",
      explanation:
        "JPS est spécifiquement conçu pour optimiser A* sur les grilles uniformes. Il 'saute' les noeuds intermédiaires et ne garde que les 'jump points', réduisant les explorés de 10 à 20 fois.",
    },

    // ==================== STRUCTURES DE DONNEES (4 questions) ====================
    {
      question:
        "[Structures] Queue (FIFO) est à BFS ce que Stack (LIFO) est à :",
      options: [
        "Dijkstra (PriorityQueue)",
        "DFS (Depth First Search)",
        "A* (PriorityQueue)",
        "Flood Fill (Queue également)",
      ],
      answer: "DFS (Depth First Search)",
      explanation:
        "BFS utilise une Queue (FIFO). DFS utilise une Stack (LIFO) — en récursif implicitement, en itératif explicitement. C'est la seule différence structurelle entre BFS et DFS.",
    },
    {
      question:
        "[Structures] Quelle structure de données est utilisée pour extraire le minimum en O(log n) dans Dijkstra et A* ?",
      options: [
        "Queue (FIFO) — O(1) en entrée/sortie",
        "Stack (LIFO) — O(1) en push/pop",
        "PriorityQueue (min-heap) — O(log n) en extraction",
        "List (liste) — O(n) en recherche du min",
      ],
      answer: "PriorityQueue (min-heap) — O(log n) en extraction",
      explanation:
        "Dijkstra et A* utilisent une PriorityQueue (min-heap) pour extraire le noeud avec la plus petite distance. L'extraction du min est O(log n). Une liste simple serait O(n).",
    },
    {
      question:
        "[Structures] Pourquoi utilise-t-on un tableau parent[] dans BFS et Dijkstra ?",
      options: [
        "Pour stocker la distance de chaque noeud",
        "Pour reconstruire le chemin après la recherche (remonter les parents)",
        "Pour marquer les noeuds visités",
        "Pour stocker la priorité des noeuds",
      ],
      answer: "Pour reconstruire le chemin après la recherche (remonter les parents)",
      explanation:
        "Le tableau parent[] stocke pour chaque noeud son prédécesseur. Une fois la destination atteinte, on remonte les parents jusqu'à la source pour reconstruire le chemin complet.",
    },
    {
      question:
        "[Structures] Quelle structure est utilisée pour la détection des doublons (visite) en BFS et DFS ?",
      options: [
        "List<T> (recherche O(n))",
        "HashSet<T> (recherche O(1))",
        "Dictionary<T,T> (stocke clé/valeur)",
        "Stack<T> (LIFO)",
      ],
      answer: "HashSet<T> (recherche O(1))",
      explanation:
        "HashSet permet de vérifier en O(1) si un noeud a déjà été visité. Une liste nécessiterait O(n). C'est critique pour la performance des algorithmes de graphe.",
    },

    // ==================== PIEGES D'IMPLEMENTATION (5 questions) ====================
    {
      question:
        "[Piège] Quelle est la conséquence d'oublier le tableau de visite dans un DFS ou BFS ?",
      options: [
        "L'algorithme est plus rapide",
        "L'algorithme boucle indéfiniment sur les noeuds déjà visités",
        "L'algorithme trouve un chemin plus court",
        "L'algorithme utilise moins de mémoire",
      ],
      answer: "L'algorithme boucle indéfiniment sur les noeuds déjà visités",
      explanation:
        "Sans tableau de visite, l'algorithme revisite les mêmes noeuds en boucle. Il n'y a pas de condition d'arrêt, la recherche ne se termine jamais. C'est le bug numéro 1 en pathfinding.",
    },
    {
      question:
        "[Piège] Pourquoi doit-on vérifier les bornes (nl>=0 && nl<n && nc>=0 && nc<m) AVANT d'accéder à grille[nl, nc] ?",
      options: [
        "Pour améliorer les performances du code",
        "Pour éviter une IndexOutOfRangeException",
        "Pour que le code soit plus lisible",
        "Pour éviter des calculs inutiles",
      ],
      answer: "Pour éviter une IndexOutOfRangeException",
      explanation:
        "Si on accède à grille[nl, nc] sans vérifier les bornes, un voisin en bordure provoque une IndexOutOfRangeException. La vérification est obligatoire et doit être faite avant l'accès.",
    },
    {
      question:
        "[Piège] Dans Dijkstra, quelle est la conséquence d'oublier l'initialisation des distances à int.MaxValue ?",
      options: [
        "Les distances sont correctes par défaut",
        "Le noeud de départ a la distance maximale",
        "La condition if (dist[u] + w < dist[v]) fonctionne mal (dist[v] = 0 au départ)",
        "Le programme compile mais produit des résultats incorrects",
      ],
      answer: "La condition if (dist[u] + w < dist[v]) fonctionne mal (dist[v] = 0 au départ)",
      explanation:
        "Si dist[v] est initialisé à 0 au lieu de int.MaxValue, la condition (dist[u] + w < 0) est fausse. Les noeuds ne sont jamais mis à jour. Les distances restent à 0. Dijkstra échoue silencieusement.",
    },
    {
      question:
        "[Piège] Dans un Flood Fill récursif, que se passe-t-il si ancienne == nouvelle ?",
      options: [
        "L'algorithme fonctionne normalement",
        "L'algorithme boucle infiniment",
        "L'algorithme ignore la condition",
        "L'algorithme lève une exception",
      ],
      answer: "L'algorithme boucle infiniment",
      explanation:
        "Si ancienne == nouvelle, la condition `if (grille[l,c] != ancienne) return;` n'est jamais vraie. La récursion continue sans fin. Il faut vérifier cette condition avant de commencer.",
    },
    {
      question:
        "[Piège] En DFS récursive, pourquoi l'ordre des appels récursifs (haut, bas, gauche, droite) est-il important pour le chemin trouvé ?",
      options: [
        "L'ordre n'a aucune importance, le chemin est toujours le même",
        "L'ordre détermine quel chemin est trouvé en premier (si plusieurs existent)",
        "L'ordre détermine la distance du chemin trouvé",
        "L'ordre détermine la performance uniquement",
      ],
      answer: "L'ordre détermine quel chemin est trouvé en premier (si plusieurs existent)",
      explanation:
        "DFS trouve un chemin, mais pas nécessairement le plus court. L'ordre des directions détermine quel chemin est exploré en premier. Si on teste 'haut' d'abord, DFS privilégiera les chemins vers le haut.",
    },

    // ==================== NAVMESH & AVANCE (3 questions) ====================
    {
      question:
        "[NavMesh] Quelle est la différence fondamentale entre une grille et un NavMesh ?",
      options: [
        "Une grille est 3D, un NavMesh est 2D",
        "Une grille est basée sur des cases (mouvement contraint), un NavMesh est basé sur des polygones (mouvement libre)",
        "Un NavMesh est plus lent qu'une grille",
        "Un NavMesh est utilisé uniquement pour les jeux en 2D",
      ],
      answer: "Une grille est basée sur des cases (mouvement contraint), un NavMesh est basé sur des polygones (mouvement libre)",
      explanation:
        "La grille contraint le mouvement aux cases (effet 'escalier'). Le NavMesh permet des mouvements en ligne droite réelle à l'intérieur des polygones. C'est plus naturel pour les jeux 3D.",
    },
    {
      question:
        "[Avancé] Quelle est la différence entre A* et Theta* ?",
      options: [
        "Theta* est plus lent que A*",
        "Theta* permet des chemins en ligne droite réelle (pas contraints à la grille)",
        "Theta* utilise une heuristique différente",
        "Theta* est une version de A* pour les grilles uniformes",
      ],
      answer: "Theta* permet des chemins en ligne droite réelle (pas contraints à la grille)",
      explanation:
        "A* contraint les chemins à suivre les cellules de la grille (effet escalier). Theta* vérifie si le grand-parent est visible en ligne droite et relie directement, créant des chemins plus naturels.",
    },
    {
      question:
        "[Avancé] Qu'est-ce que D* Lite et dans quel contexte est-il utilisé ?",
      options: [
        "Un algorithme de pathfinding pour les grilles statiques",
        "Un algorithme de replanification rapide quand le terrain change (robotique)",
        "Une version de A* pour les grilles uniformes",
        "Un algorithme de coloration de zones",
      ],
      answer: "Un algorithme de replanification rapide quand le terrain change (robotique)",
      explanation:
        "D* Lite est utilisé en robotique et dans les jeux avec terrain changeant. Il ne recalcule pas tout le chemin à chaque modification, mais met à jour uniquement les zones affectées. C'est un replanning dynamique.",
    },

    // ==================== CAS CONCRETS (4 questions) ====================
    {
      question:
        "[Cas concret] Dans un jeu de stratégie, 10 unités doivent se déplacer sur la même carte. Que faut-il prendre en compte en plus du pathfinding ?",
      options: [
        "Rien, le pathfinding standard suffit",
        "L'évitement de collision entre unités (pathfinding coopératif)",
        "La réduction du nombre d'unités",
        "L'utilisation d'un seul algorithme pour toutes les unités",
      ],
      answer: "L'évitement de collision entre unités (pathfinding coopératif)",
      explanation:
        "Quand plusieurs unités se déplacent, elles peuvent se bloquer mutuellement. Il faut des mécanismes d'évitement de collision, de priorité, ou de pathfinding coopératif. C'est un problème avancé en jeux vidéo.",
    },
    {
      question:
        "[Cas concret] Dans un GPS, comment l'heuristique de A* est-elle généralement calculée ?",
      options: [
        "Par la distance en kilomètres déjà parcourue",
        "Par la distance à vol d'oiseau (euclidienne) entre le point courant et la destination",
        "Par le temps estimé avec le trafic",
        "Par le nombre de feux rouges sur le trajet",
      ],
      answer: "Par la distance à vol d'oiseau (euclidienne) entre le point courant et la destination",
      explanation:
        "L'heuristique en GPS est généralement la distance euclidienne (à vol d'oiseau). Elle ne surestime jamais le coût réel (une route n'est jamais plus courte qu'une ligne droite), donc A* est optimal.",
    },
    {
      question:
        "[Cas concret] Vous devez planifier l'ordre de collecte de 5 objets dans un jeu (problème du voyageur de commerce simplifié). Quelle est l'approche la plus simple ?",
      options: [
        "Utiliser A* une seule fois",
        "Précalculer les distances A* entre toutes les paires, puis tester toutes les permutations (force brute)",
        "Utiliser DFS standard",
        "Utiliser BFS depuis chaque objet",
      ],
      answer: "Précalculer les distances A* entre toutes les paires, puis tester toutes les permutations (force brute)",
      explanation:
        "Avec 5 objets, il y a 5! = 120 permutations. On précalcule une fois les distances A* entre toutes les paires, puis on évalue les 120 permutations. La force brute est viable pour n <= 10.",
    },
    {
      question:
        "[Cas concret] Dans un réseau social, vous voulez savoir si deux personnes sont connectées en moins de 6 degrés. Quel algorithme est le plus adapté ?",
      options: [
        "DFS (exploration en profondeur)",
        "BFS bidirectionnel (exploration depuis les deux personnes)",
        "Dijkstra (chemins pondérés)",
        "Flood Fill (coloriage de zones)",
      ],
      answer: "BFS bidirectionnel (exploration depuis les deux personnes)",
      explanation:
        "BFS bidirectionnel est idéal pour les réseaux sociaux. Il explore depuis les deux personnes simultanément. Sur un réseau de 20 personnes, il est très efficace et peut vérifier la théorie des 6 degrés.",
    },
  ],
  avance: [
    // ==================== QUESTIONS D'ENTRETIEN (6 questions) ====================
    {
      question:
        "[Entretien] Expliquez la différence entre BFS et DFS à un non-technicien.",
      options: [
        "BFS est plus rapide que DFS",
        "BFS explore comme une vague (couche par couche), DFS explore comme un explorateur qui va toujours tout droit puis revient",
        "DFS est toujours meilleur que BFS",
        "BFS utilise moins de mémoire que DFS",
      ],
      answer: "BFS explore comme une vague (couche par couche), DFS explore comme un explorateur qui va toujours tout droit puis revient",
      explanation:
        "C'est l'explication attendue en entretien. L'analogie de la vague pour BFS et de l'explorateur pour DFS est claire et montre qu'on a compris le concept.",
    },
    {
      question:
        "[Entretien] Dans quel cas Dijkstra est-il préférable à A* ?",
      options: [
        "Toujours, Dijkstra est meilleur que A*",
        "Quand on ne peut pas définir une bonne heuristique (ou heuristique = 0)",
        "Quand les coûts sont uniformes",
        "Jamais, A* est toujours meilleur",
      ],
      answer: "Quand on ne peut pas définir une bonne heuristique (ou heuristique = 0)",
      explanation:
        "Dijkstra est A* avec h(n)=0. Si on ne peut pas définir d'heuristique admissible (ou si l'heuristique est mauvaise), Dijkstra est plus fiable. Il explore plus mais donne le même résultat optimal.",
    },
    {
      question:
        "[Entretien] Pourquoi la PriorityQueue est-elle essentielle pour Dijkstra et A* ?",
      options: [
        "Pour stocker les noeuds visités",
        "Pour toujours traiter le noeud avec la plus petite distance en premier (O(log n))",
        "Pour éviter les doublons dans la file",
        "Pour reconstruire le chemin final",
      ],
      answer: "Pour toujours traiter le noeud avec la plus petite distance en premier (O(log n))",
      explanation:
        "La PriorityQueue garantit l'extraction du minimum en O(log n). C'est le cœur de Dijkstra et A* : traiter d'abord les noeuds les plus prometteurs. Sans elle, l'algorithme serait en O(n²).",
    },
    {
      question:
        "[Entretien] Qu'est-ce que le 'N+1 problem' en pathfinding sur grille avec BFS ?",
      options: [
        "Un problème de performance quand BFS explore N noeuds puis N+1",
        "Le fait que BFS explore N noeuds inutiles avant d'atteindre la destination",
        "Un problème de mémoire quand la grille est trop grande",
        "Ce terme n'existe pas en pathfinding",
      ],
      answer: "Le fait que BFS explore N noeuds inutiles avant d'atteindre la destination",
      explanation:
        "Sur une grande grille, BFS explore comme une vague dans toutes les directions. Si la destination est à 20 cases, BFS peut explorer des milliers de cases inutiles. A* résout ce problème avec l'heuristique.",
    },
    {
      question:
        "[Entretien] Comment améliorer les performances de A* sur une très grande carte ouverte (peu d'obstacles) ?",
      options: [
        "Rien, A* est déjà optimal",
        "Utiliser Jump Point Search (JPS) pour sauter les noeuds intermédiaires",
        "Utiliser BFS classique",
        "Augmenter la priorité de l'heuristique",
      ],
      answer: "Utiliser Jump Point Search (JPS) pour sauter les noeuds intermédiaires",
      explanation:
        "Sur les cartes ouvertes, A* explore encore beaucoup de noeuds. JPS identifie les 'jump points' et saute les noeuds intermédiaires, réduisant les explorés de 10 à 20 fois.",
    },
    {
      question:
        "[Entretien] Pourquoi dit-on que 'le premier chemin trouvé par BFS est le plus court' ?",
      options: [
        "Parce que BFS explore en profondeur d'abord",
        "Parce que BFS explore couche par couche (vague) — la première fois qu'il atteint la destination, c'est nécessairement par le nombre minimum de pas",
        "Parce que BFS utilise une PriorityQueue",
        "Parce que BFS ne visite jamais deux fois le même noeud",
      ],
      answer: "Parce que BFS explore couche par couche (vague) — la première fois qu'il atteint la destination, c'est nécessairement par le nombre minimum de pas",
      explanation:
        "C'est la propriété fondamentale de BFS. Les cercles concentriques garantissent que la première atteinte est par le chemin le plus court. Aucune route plus courte ne peut exister.",
    },
  ],
  expert: [
    // ==================== QUESTIONS DIFFICILES (6 questions) ====================
    {
      question:
        "[Expert] Dans un graphe avec des poids négatifs, quel algorithme devez-vous utiliser ?",
      options: [
        "Dijkstra (il gère les poids négatifs en réalité)",
        "Bellman-Ford (ou SPFA) — supporte les poids négatifs",
        "A* (avec une heuristique adaptée)",
        "BFS (pas de poids)",
      ],
      answer: "Bellman-Ford (ou SPFA) — supporte les poids négatifs",
      explanation:
        "Dijkstra ne fonctionne pas avec des poids négatifs. Bellman-Ford est l'algorithme standard pour les graphes avec des poids négatifs (sans cycle négatif). SPFA est une optimisation de Bellman-Ford.",
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
        "[Expert] Quelle est la complexité de BFS bidirectionnel par rapport à BFS classique ?",
      options: [
        "BFS bidirectionnel est 2 fois plus rapide",
        "BFS bidirectionnel est √(complexité) fois plus rapide (racine carrée)",
        "BFS bidirectionnel est aussi rapide que BFS classique",
        "BFS bidirectionnel est plus lent que BFS classique",
      ],
      answer: "BFS bidirectionnel est √(complexité) fois plus rapide (racine carrée)",
      explanation:
        "BFS classique explore O(b^d) noeuds. Bidirectionnel explore 2 × O(b^(d/2)). Pour b=4, d=10 : 4^10=1 048 576 vs 2×4^5=2 048. Le gain est spectaculaire, c'est la racine carrée de la complexité.",
    },
    {
      question:
        "[Expert] Dans l'implémentation de A*, pourquoi utilise-t-on un tableau 'closed' ET une condition 'if (closed[l,c]) continue' ?",
      options: [
        "Pour éviter la duplication de code",
        "Parce qu'un noeud peut être ajouté plusieurs fois à la PriorityQueue avant d'être traité (meilleur chemin trouvé après)",
        "Pour économiser de la mémoire",
        "Pour améliorer l'heuristique",
      ],
      answer: "Parce qu'un noeud peut être ajouté plusieurs fois à la PriorityQueue avant d'être traité (meilleur chemin trouvé après)",
      explanation:
        "Un noeud peut être enfilé plusieurs fois avec des distances différentes (si on trouve un meilleur chemin). Le tableau closed garantit qu'on ne traite le noeud qu'une fois, avec sa meilleure distance. La condition `if (closed) continue` ignore les entrées en double.",
    },
    {
      question:
        "[Expert] Pourquoi le NavMesh est-il préféré aux grilles dans les jeux 3D professionnels ?",
      options: [
        "Parce qu'il est plus facile à coder",
        "Pour des mouvements naturels (ligne droite réelle), moins de mémoire, et meilleure précision dans les espaces complexes",
        "Parce qu'il est plus rapide à l'exécution",
        "Parce qu'il utilise moins de CPU",
      ],
      answer: "Pour des mouvements naturels (ligne droite réelle), moins de mémoire, et meilleure précision dans les espaces complexes",
      explanation:
        "Le NavMesh offre des mouvements naturels (pas d'effet 'escalier'), une meilleure précision (pas de problème de couloirs étroits), et moins de mémoire (polygones vs millions de cases). C'est la technique professionnelle.",
    },
    {
      question:
        "[Expert] Comment fonctionne l'algorithme de Kahn pour le tri topologique d'un DAG ?",
      options: [
        "En utilisant DFS récursive sur chaque noeud",
        "En partant des noeuds sans dépendances (in-degree=0), en les retirant du graphe, et en répétant",
        "En utilisant BFS depuis la source",
        "En triant les noeuds par ordre alphabétique",
      ],
      answer: "En partant des noeuds sans dépendances (in-degree=0), en les retirant du graphe, et en répétant",
      explanation:
        "L'algorithme de Kahn est un BFS sur les in-degrés. On part des noeuds qui n'ont pas de dépendances. On les ajoute à l'ordre, on réduit les in-degrés de leurs successeurs, et on répète. Un cycle se détecte si tous les noeuds ne sont pas traités.",
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
