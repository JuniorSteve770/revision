// src/projects/ml/Page_ML_B.js
import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Ensemble Learning + Reinforcement Learning",
    answer:
      "◆ **Bloc 1** : Bagging — principe, Random Forest, réduction de variance ◆ **Bloc 2** : Boosting — AdaBoost, Gradient Boosting, XGBoost, LightGBM ◆ **Bloc 3** : Stacking & Voting — combiner des modèles hétérogènes ◆ **Bloc 4** : Quand choisir Bagging vs Boosting vs Stacking ◆ **Bloc 5** : Reinforcement Learning — agent, environnement, reward, politique ◆ **Bloc 6** : Q-Learning & Deep Q-Network (DQN) — mécanisme et algorithme ◆ **Bloc 7** : Policy Gradient & Actor-Critic — approches basées sur la politique ◆ **Bloc 8** : Exploration vs Exploitation — epsilon-greedy, UCB, Thompson Sampling",
  },
  {
    question: "Bagging — Bootstrap Aggregating",
    answer:
      "◆ **Principe** : entraîner N modèles indépendants sur N sous-ensembles bootstrap (tirés avec remise) puis agréger ◆ **Agrégation** : vote majoritaire (classification) ou moyenne (régression) ◆ **Effet** : réduit la variance sans augmenter le biais — parfait contre l'overfitting ◆ **Random Forest** : bagging d'arbres de décision + sélection aléatoire de features à chaque split (max_features=sqrt(n_features)) ◆ **Out-of-Bag (OOB)** : ~37% des échantillons non utilisés pour chaque arbre → score OOB est une évaluation gratuite ◆ **n_estimators** : plus d'arbres = meilleur (asymptotique) mais plus lent ⚠️ Si les modèles de base sont trop corrélés entre eux, le bagging ne réduit pas bien la variance",
  },
  {
    question: "Boosting — AdaBoost et Gradient Boosting",
    answer:
      "◆ **Principe** : entraîner des modèles séquentiellement — chaque modèle corrige les erreurs du précédent ◆ **AdaBoost** : pondère plus fortement les exemples mal classés à chaque itération ◆ **Gradient Boosting** : ajuste chaque nouvel arbre sur les résidus (pseudo-résidus = gradient de la loss) ◆ **Learning rate** : shrinkage — réduit la contribution de chaque arbre, nécessite plus d'arbres mais généralise mieux ◆ **XGBoost** : implémentation optimisée de GB — régularisation L1/L2 intégrée, gestion native des NULL, très rapide ◆ **LightGBM** : gradient-based one-side sampling + histogram-based splitting — 10x plus rapide qu'XGBoost sur grands datasets ⚠️ Boosting est plus sensible à l'overfitting que Bagging — toujours utiliser early_stopping_rounds sur un validation set",
  },
  {
    question: "XGBoost — Paramètres clés et bonnes pratiques",
    answer:
      "◆ **n_estimators** : nombre d'arbres — augmenter avec early stopping ◆ **max_depth** : profondeur max (3-6 recommandé) — plus profond = plus expressif mais risque d'overfitting ◆ **learning_rate (eta)** : 0.01-0.3 — plus faible = meilleur mais plus lent ◆ **subsample** : fraction des données pour chaque arbre (0.6-0.8) — réduction de la variance ◆ **colsample_bytree** : fraction des features par arbre — analogue à Random Forest ◆ **early_stopping_rounds=50** : arrêter si le score de validation ne s'améliore pas pendant 50 rounds ◆ **scale_pos_weight** : gérer les classes déséquilibrées — ratio négatifs/positifs ⚠️ Tuner XGBoost sans early stopping = risque fort d'overfitting sur le validation set",
  },
  {
    question: "Stacking & Voting — Ensembles hétérogènes",
    answer:
      "◆ **Voting** : combiner plusieurs modèles différents — Hard Vote (majorité) ou Soft Vote (moyenne des probabilités) ◆ **Soft Voting** : plus performant que Hard si les modèles sont bien calibrés ◆ **Stacking** : les prédictions des modèles de niveau 1 (base models) deviennent les features du modèle de niveau 2 (meta-model) ◆ **Meta-model** : souvent une régression logistique ou un XGBoost simple ◆ **Out-of-fold predictions** : générer les prédictions de niveau 1 via cross-validation pour éviter le data leakage ◆ **Blending** : variante simplifiée — utiliser un holdout set pour entraîner le méta-modèle ⚠️ Stacking sans out-of-fold predictions = data leakage — le méta-modèle voit des prédictions sur des données déjà vues",
  },
  {
    question: "Bagging vs Boosting vs Stacking — Choisir",
    answer:
      "◆ **Bagging** : modèle de base qui overfitte (haute variance) → Random Forest — parallélisable, robuste ◆ **Boosting** : modèle de base faible (haut biais) → XGBoost/LightGBM — séquentiel, plus précis mais plus sensible ◆ **Stacking** : maximiser la performance — combine modèles hétérogènes, plus complexe à mettre en œuvre ◆ **Cas tabular data** : XGBoost / LightGBM dominent les compétitions Kaggle ◆ **Cas haute dimension** : Random Forest est plus stable ◆ **Cas latence critique** : un seul modèle simple > ensemble complexe ◆ **Interprétabilité** : un arbre seul > Random Forest (feature importance) > XGBoost > Stacking ⚠️ Plus d'ensembles ≠ forcément meilleur — diversité des modèles de base est la clé",
  },
  {
    question: "Reinforcement Learning — Cadre général",
    answer:
      "◆ **Composants** : Agent (apprend), Environnement (réagit), État s, Action a, Récompense r, Politique π ◆ **Boucle** : Agent observe l'état s → choisit l'action a via π → l'environnement retourne r et s' ◆ **Objectif** : maximiser la récompense cumulée (Return) = Σ γᵗ·rₜ ◆ **γ (gamma)** : discount factor [0,1] — pondère les récompenses futures (γ proche de 1 = vision long terme) ◆ **Épisode** : séquence d'états/actions jusqu'à un état terminal ◆ **Value Function V(s)** : récompense cumulée attendue en partant de s en suivant π ◆ **Q-Function Q(s,a)** : récompense cumulée attendue en faisant a depuis s, puis en suivant π ⚠️ RL nécessite beaucoup plus d'exemples que le supervisé — des millions d'épisodes pour des tâches complexes",
  },
  {
    question: "Q-Learning & Deep Q-Network (DQN)",
    answer:
      "◆ **Q-Learning** : algorithme off-policy qui apprend Q(s,a) via l'équation de Bellman : Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)] ◆ **Table Q** : fonctionne pour les espaces d'état/action discrets et petits ◆ **DQN** : remplace la Q-table par un réseau de neurones — input = état, output = Q(s,a) pour chaque action ◆ **Experience Replay** : stocker les transitions (s,a,r,s') dans un replay buffer, tirer aléatoirement → casse les corrélations temporelles ◆ **Target Network** : copie gelée du réseau principal mise à jour périodiquement → stabilise l'entraînement ◆ **Atari** : DQN (DeepMind 2015) a atteint le niveau humain sur 49 jeux avec pixels en input ⚠️ Q-Learning souffre du problème de maximization bias — Double DQN le corrige en séparant sélection et évaluation",
  },
  {
    question: "Policy Gradient & Actor-Critic",
    answer:
      "◆ **Policy Gradient** : optimiser directement la politique π(a|s;θ) par gradient ascent sur E[Return] ◆ **REINFORCE** : Monte Carlo PG — calculer le return complet d'un épisode, mettre à jour θ ◆ **Problème** : haute variance des gradients → nécessite des baselines ◆ **Actor-Critic (A2C/A3C)** : Actor = apprend la politique, Critic = estime V(s) comme baseline ◆ **Advantage** : A(s,a) = Q(s,a) - V(s) — combien cette action est meilleure que la moyenne ◆ **PPO (Proximal Policy Optimization)** : limitation du changement de politique à chaque update — stable et largement utilisé ◆ **Applications** : AlphaGo, robots, jeux de stratégie, trading ⚠️ Policy Gradient est moins sample-efficient que Q-Learning — nécessite plus d'interactions avec l'environnement",
  },
  {
    question: "Exploration vs Exploitation",
    answer:
      "◆ **Dilemme** : exploiter les actions connues (optimal local) vs explorer de nouvelles actions (optimal global) ◆ **ε-greedy** : avec probabilité ε, action aléatoire ; sinon action optimale — ε décroît avec le temps ◆ **ε decay** : ε_t = ε_0 × decay^t — exploration intensive au début, exploitation en fin d'entraînement ◆ **UCB (Upper Confidence Bound)** : choisir l'action qui maximise Q(s,a) + c·√(ln(t)/N(a)) — bonus d'exploration pour les actions peu essayées ◆ **Thompson Sampling** : approche bayésienne — maintenir une distribution de probabilité sur Q(s,a) ◆ **Intrinsic Motivation** : récompense bonus pour la nouveauté — Curiosity-driven exploration (ICM) ⚠️ Trop peu d'exploration = convergence vers un sous-optimal ; trop = apprentissage très lent",
  },
  {
    question: "RL Avancé — Cas d'usage et algorithmes modernes",
    answer:
      "◆ **Model-Based RL** : apprendre un modèle de l'environnement pour planifier — plus sample-efficient ◆ **Model-Free** : Q-Learning, Policy Gradient — n'apprend pas le modèle de l'env, plus simple ◆ **Multi-Agent RL** : plusieurs agents interagissant — coopération, compétition (AlphaStar, OpenAI Five) ◆ **Hierarchical RL** : décomposer une tâche longue en sous-tâches — options framework ◆ **Inverse RL** : apprendre la récompense en observant un expert — imitation learning ◆ **RLHF** (RL from Human Feedback) : utilisé dans ChatGPT/Claude — reward model appris depuis les préférences humaines ◆ **Limites RL** : reward shaping difficile, sample inefficiency, instabilité entraînement ⚠️ Concevoir la fonction de récompense est souvent le défi principal — une mauvaise récompense peut mener à des comportements inattendus",
  },
  {
    question: "Feature Importance & Interprétabilité des ensembles",
    answer:
      "◆ **Random Forest Feature Importance** : moyenne de la réduction d'impureté (Gini) apportée par chaque feature — rapide mais biaisée vers les features à haute cardinalité ◆ **XGBoost Feature Importance** : gain (contribution à la réduction de loss), cover (nb d'exemples couverts), fréquence ◆ **Permutation Importance** : permuter aléatoirement une feature et mesurer la dégradation de la performance — non biaisée ◆ **SHAP (SHapley Additive exPlanations)** : décomposer chaque prédiction en contributions par feature — théorie des jeux ◆ **LIME** : approximation locale linéaire pour expliquer une prédiction individuelle ◆ **Partial Dependence Plot (PDP)** : effet marginal d'une feature sur la prédiction ⚠️ La feature importance de base (RF/XGB) peut être trompeuse — préférer SHAP pour les décisions critiques",
  },
  {
    question: "Comparaison finale — Quel algorithme pour quel problème ?",
    answer:
      "◆ **Données tabulaires, précision max** : XGBoost / LightGBM — standard Kaggle ◆ **Données tabulaires, robustesse** : Random Forest — moins sensible aux hyperparamètres ◆ **Images / texte** : Deep Learning (CNN, Transformer) — pas d'ensemble classique ◆ **Décisions séquentielles** : RL (DQN, PPO, A3C) ◆ **Peu de données** : SVM, régression logistique + régularisation ◆ **Interprétabilité requise** : arbre de décision, régression logistique ◆ **Temps réel, latence faible** : modèle simple (LR, arbre profondeur 3) ou distillation d'ensemble ⚠️ Il n'existe pas d'algorithme universel — le No Free Lunch theorem affirme que tout algorithme est optimal sur certains problèmes et nul sur d'autres",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[Bagging pratique] Un arbre de décision profond sur ton dataset donne train_acc=0.99, val_acc=0.73. Tu passes à une Random Forest avec 200 arbres. Quel effet attendre ?",
      options: [
        "La Random Forest aura aussi val_acc=0.73 — les ensembles n'aident pas contre l'overfitting",
        "val_acc va augmenter significativement — la moyenne de 200 arbres réduit la variance sans augmenter le biais",
        "train_acc va baisser et val_acc va baisser aussi — les ensembles moyennent les erreurs",
        "Aucun effet — un seul arbre profond est équivalent à 200 arbres peu profonds",
      ],
      answer:
        "val_acc va augmenter significativement — la moyenne de 200 arbres réduit la variance sans augmenter le biais",
      explanation:
        "L'arbre seul overfitte (haute variance). Bagging réduit la variance en moyennant des modèles entraînés sur des sous-ensembles bootstrap. La Random Forest ajoute la sélection aléatoire de features pour décorréler les arbres davantage. Résultat typique : train_acc baisse légèrement, val_acc monte significativement.",
    },
    {
      question:
        "[Boosting vs Bagging] Quelle est la différence fondamentale de stratégie entre Random Forest et XGBoost ?",
      options: [
        "Random Forest utilise des arbres, XGBoost utilise des réseaux de neurones",
        "Random Forest = arbres parallèles indépendants (bagging) pour réduire la variance ; XGBoost = arbres séquentiels qui corrigent les erreurs des précédents (boosting) pour réduire biais et variance",
        "XGBoost utilise plus d'arbres que Random Forest",
        "Random Forest est supervisé, XGBoost est non-supervisé",
      ],
      answer:
        "Random Forest = arbres parallèles indépendants (bagging) pour réduire la variance ; XGBoost = arbres séquentiels qui corrigent les erreurs des précédents (boosting) pour réduire biais et variance",
      explanation:
        "Bagging = parallèle + indépendant = réduit la variance. Boosting = séquentiel + chaque modèle apprend des erreurs du précédent = réduit biais et variance mais séquentiellement. XGBoost est généralement plus précis mais plus sensible à l'overfitting et plus lent à entraîner.",
    },
    {
      question:
        "[RL bases] Dans un jeu de navigation, l'agent reçoit +10 si il atteint la cible, -1 à chaque pas. Quel comportement γ=0.99 encourage-t-il vs γ=0.1 ?",
      options: [
        "γ=0.99 et γ=0.1 encouragent le même comportement",
        "γ=0.99 encourage les chemins les plus courts (récompense future fortement valorisée) ; γ=0.1 rend l'agent 'myope', peu motivé par la récompense finale lointaine",
        "γ=0.1 encourage les chemins les plus courts car la pénalité immédiate -1 est plus visible",
        "γ=0.99 fait toujours converger plus vite que γ=0.1",
      ],
      answer:
        "γ=0.99 encourage les chemins les plus courts (récompense future fortement valorisée) ; γ=0.1 rend l'agent 'myope', peu motivé par la récompense finale lointaine",
      explanation:
        "Return = r₁ + γr₂ + γ²r₃ + ... Avec γ=0.99 : une récompense à 100 pas = 0.99^100 × 10 ≈ 3.7 → encore très motivante. Avec γ=0.1 : 0.1^100 ≈ 0 → la récompense finale est presque ignorée. γ=0.99 = vision long terme, cherche le chemin optimal. γ=0.1 = comportement court-termiste.",
    },
    {
      question:
        "[ε-greedy] Ton agent RL explore avec ε=0.5 (50% d'actions aléatoires). L'entraînement stagne. Quelle cause et solution ?",
      options: [
        "ε trop faible — augmenter à ε=0.9 pour plus d'exploration",
        "ε trop élevé — l'agent passe 50% du temps à explorer aléatoirement, ne capitalise pas sur ses connaissances. Utiliser ε decay pour réduire progressivement l'exploration",
        "ε=0.5 est la valeur standard recommandée — changer d'algorithme",
        "Le problème est lié au learning rate, pas à ε",
      ],
      answer:
        "ε trop élevé — l'agent passe 50% du temps à explorer aléatoirement, ne capitalise pas sur ses connaissances. Utiliser ε decay pour réduire progressivement l'exploration",
      explanation:
        "ε=0.5 = trop d'aléatoire pour capitaliser sur l'apprentissage. Stratégie standard : ε_start=1.0 (exploration totale), ε_decay appliqué à chaque épisode, ε_min=0.01 (1% d'exploration résiduelle). Le modèle explore au début (découverte), exploite en fin d'entraînement (raffinement).",
    },
    {
      question:
        "[Soft vs Hard Voting] Ton Voting Classifier combine SVM, Random Forest et Logistic Regression. Pourquoi privilégier Soft Voting ?",
      options: [
        "Soft Voting est plus rapide à calculer",
        "Soft Voting moyenne les probabilités — exploite la confiance de chaque modèle ; un modèle très confiant à 0.95 pèse plus qu'un modèle hésitant à 0.55",
        "Hard Voting fait toujours plus d'erreurs que Soft Voting",
        "Soft Voting est obligatoire si les modèles ont des accuracies différentes",
      ],
      answer:
        "Soft Voting moyenne les probabilités — exploite la confiance de chaque modèle ; un modèle très confiant à 0.95 pèse plus qu'un modèle hésitant à 0.55",
      explanation:
        "Hard Vote : 2 contre 1 = classe gagnante (ignore la confiance). Soft Vote : moyenne des probabilités, pondérée implicitement par la confiance. Si RF donne 0.95 'positif', LR donne 0.51 'négatif', SVM donne 0.52 'négatif' : Hard = 2:1 négatif ; Soft = (0.95+0.49+0.48)/3 = 0.64 positif. Soft est généralement meilleur sur modèles bien calibrés.",
    },
    {
      question:
        "[XGBoost pratique] Tu entraînes XGBoost et le val_score plafonne à l'epoch 847/1000. Quelle est la bonne configuration ?",
      options: [
        "Continuer jusqu'à 1000 epochs — plus d'arbres est toujours mieux",
        "Utiliser early_stopping_rounds=50 — stopper automatiquement si le val_score ne s'améliore pas pendant 50 rounds, garder le meilleur modèle",
        "Réduire n_estimators à 100 — moins d'arbres évite l'overfitting",
        "Augmenter le learning_rate pour converger plus vite",
      ],
      answer:
        "Utiliser early_stopping_rounds=50 — stopper automatiquement si le val_score ne s'améliore pas pendant 50 rounds, garder le meilleur modèle",
      explanation:
        "Après l'epoch 847, le modèle overfitte si le val_score stagne ou baisse. early_stopping_rounds=50 arrête l'entraînement si pas d'amélioration pendant 50 rounds et restaure le meilleur modèle. Paramétrage : xgb.train(..., evals=[(val_set,'val')], early_stopping_rounds=50). Le modèle final a n_estimators = best_iteration.",
    },
    {
      question:
        "[Q-Learning] Dans l'équation de Bellman : Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)], que représente le terme [r + γ·max Q(s',a') - Q(s,a)] ?",
      options: [
        "La récompense totale accumulée depuis le début de l'épisode",
        "L'erreur TD (Temporal Difference) — différence entre la valeur estimée actuelle et la cible boostrap (récompense immédiate + valeur future estimée)",
        "Le gradient de la politique par rapport aux paramètres θ",
        "Le discount factor appliqué à la récompense immédiate",
      ],
      answer:
        "L'erreur TD (Temporal Difference) — différence entre la valeur estimée actuelle et la cible boostrap (récompense immédiate + valeur future estimée)",
      explanation:
        "TD Error = [r + γ·maxQ(s',a')] - Q(s,a). r + γ·maxQ(s',a') = cible TD (ce que Q(s,a) devrait valoir). Q(s,a) = valeur actuelle. α contrôle la vitesse de mise à jour. Si TD Error > 0 : Q(s,a) est sous-estimé → augmenter. Si < 0 : sur-estimé → diminuer.",
    },
    {
      question:
        "[Out-of-Bag] La Random Forest donne un OOB score de 0.87 et un val score (hold-out) de 0.85. Que conclure ?",
      options: [
        "Le modèle overfitte — les deux scores sont trop proches",
        "Les deux estimations sont cohérentes — OOB est une évaluation honnête sur ~37% des données non vues, concordance avec le hold-out rassure",
        "Le hold-out score est plus fiable — utiliser uniquement celui-ci",
        "OOB score > val score signifie toujours data leakage",
      ],
      answer:
        "Les deux estimations sont cohérentes — OOB est une évaluation honnête sur ~37% des données non vues, concordance avec le hold-out rassure",
      explanation:
        "OOB : chaque arbre est évalué sur les ~37% d'exemples non tirés dans son bootstrap. Score OOB ≈ score K-Fold CV sans coût supplémentaire. La cohérence OOB≈val_score est un bon signe. Si OOB >> val : overfitting du model à la structure du train set. OOB est particulièrement utile quand les données sont limitées.",
    },
  ],
  avance: [
    {
      question:
        "[Stacking data leakage] Ton stacking utilise 5 modèles de base dont les prédictions sont générées sur le train set complet pour entraîner le meta-modèle. Quel est le problème ?",
      options: [
        "Aucun problème — le meta-modèle doit voir toutes les données pour bien apprendre",
        "Data leakage — les modèles de base ont mémorisé le train set, leurs prédictions sont trop optimistes, le meta-modèle apprend sur des prédictions non représentatives de la production",
        "Le meta-modèle sera trop complexe avec 5 features d'entrée",
        "Le stacking ne fonctionne que si les 5 modèles sont du même type",
      ],
      answer:
        "Data leakage — les modèles de base ont mémorisé le train set, leurs prédictions sont trop optimistes, le meta-modèle apprend sur des prédictions non représentatives de la production",
      explanation:
        "Les modèles de base ont vu les exemples du train set pendant l'entraînement → leurs prédictions sur ce même set sont optimistes (quasi-parfaites pour les modèles qui overfittent). Solution : out-of-fold predictions via K-Fold CV. Pour chaque fold test, les modèles de base n'ont PAS vu ces données → prédictions honnêtes pour le meta-modèle.",
    },
    {
      question:
        "[DQN pratique] Ton DQN sur un jeu Atari diverge après 500 000 steps — les Q-values explosent vers l'infini. Quelles techniques permettent de stabiliser l'entraînement ?",
      options: [
        "Augmenter le learning rate pour converger plus vite avant la divergence",
        "Experience Replay (casse les corrélations temporelles) + Target Network fixe (cible stable pour le calcul de la loss) + gradient clipping",
        "Réduire la taille du réseau de neurones",
        "Utiliser uniquement des épisodes courts pour limiter l'accumulation d'erreurs",
      ],
      answer:
        "Experience Replay (casse les corrélations temporelles) + Target Network fixe (cible stable pour le calcul de la loss) + gradient clipping",
      explanation:
        "Divergence DQN = Q-values qui s'embrasent. Causes : corrélations temporelles (transitions consécutives sont très similaires → overfitting), bootstrap instable (cible change à chaque update). Solutions : Replay Buffer (mélange les transitions) + Target Network (copie gelée mise à jour tous les N steps) + gradient clipping (||grad|| ≤ 1 ou 10). Ces 3 techniques constituent le DQN original de DeepMind.",
    },
    {
      question:
        "[Gradient Boosting résidus] Dans Gradient Boosting, chaque nouvel arbre est entraîné sur quoi exactement ?",
      options: [
        "Sur les exemples mal classés avec un poids plus élevé (comme AdaBoost)",
        "Sur les pseudo-résidus = gradient négatif de la loss par rapport aux prédictions actuelles — ce que le modèle actuel sous-estime",
        "Sur un sous-ensemble bootstrap des données originales",
        "Sur la différence entre les prédictions du dernier arbre et y",
      ],
      answer:
        "Sur les pseudo-résidus = gradient négatif de la loss par rapport aux prédictions actuelles — ce que le modèle actuel sous-estime",
      explanation:
        "Gradient Boosting = descente de gradient dans l'espace fonctionnel. Résidu = -∂L/∂F(x). Pour MSE : résidu = y - F(x) (différence simple). Pour log loss : résidu = y - p(x) (différence probabiliste). Chaque arbre apprend à prédire ce résidu. Ajouter ce résidu × learning_rate à la prédiction corrige les erreurs du modèle cumulé.",
    },
    {
      question:
        "[PPO vs REINFORCE] Pourquoi PPO (Proximal Policy Optimization) est-il préféré à REINFORCE classique en pratique ?",
      options: [
        "PPO est plus simple à implémenter que REINFORCE",
        "REINFORCE a une très haute variance des gradients et peut détruire la politique avec une grande mise à jour — PPO clippe le ratio de la politique pour garantir des updates stables",
        "PPO apprend plus vite car il utilise moins de données",
        "REINFORCE ne fonctionne que pour les espaces d'action discrets",
      ],
      answer:
        "REINFORCE a une très haute variance des gradients et peut détruire la politique avec une grande mise à jour — PPO clippe le ratio de la politique pour garantir des updates stables",
      explanation:
        "REINFORCE : gradient = Σ log π(a|s) × Return — très bruité. Une mauvaise mise à jour peut effondrer la politique. PPO : objective clipée = min(r_t × A, clip(r_t, 1-ε, 1+ε) × A) où r_t = π_new/π_old. Le clipping empêche des changements trop importants. PPO est simple, stable, le standard de facto en RL moderne (OpenAI, robotique).",
    },
    {
      question:
        "[SHAP vs Feature Importance] Sur ton Random Forest, la feature 'revenue' a importance=0.45 mais son SHAP value moyenne est 0.12. Quelle interprétation est correcte ?",
      options: [
        "La feature importance est plus fiable — ignorer les SHAP values",
        "L'importance classique (réduction d'impureté) est biaisée vers les features continues à haute cardinalité — SHAP est plus fiable pour mesurer l'impact réel sur les prédictions",
        "Les deux métriques mesurent des choses différentes et sont toutes les deux correctes",
        "Un écart aussi important indique un bug dans le calcul",
      ],
      answer:
        "L'importance classique (réduction d'impureté) est biaisée vers les features continues à haute cardinalité — SHAP est plus fiable pour mesurer l'impact réel sur les prédictions",
      explanation:
        "Feature importance (mean decrease impurity) surestime les features continues avec beaucoup de valeurs uniques car elles offrent plus d'opportunités de split. SHAP (Shapley values) distribue équitablement la contribution de chaque feature à chaque prédiction. Pour les décisions critiques : SHAP. Permutation importance est aussi une bonne alternative non biaisée.",
    },
    {
      question:
        "[LightGBM vs XGBoost] Ton dataset a 5M de lignes et 300 features. XGBoost prend 4h pour un training. Pourquoi LightGBM serait-il plus adapté ?",
      options: [
        "LightGBM utilise moins de mémoire grâce à la quantification des features",
        "LightGBM utilise Histogram-based splitting (discrétise les features en bins) + Gradient-based One-Side Sampling (garde les exemples avec grands gradients) → 10x plus rapide sur grands datasets",
        "LightGBM a moins d'hyperparamètres à tuner que XGBoost",
        "LightGBM est toujours plus précis que XGBoost peu importe le dataset",
      ],
      answer:
        "LightGBM utilise Histogram-based splitting (discrétise les features en bins) + Gradient-based One-Side Sampling (garde les exemples avec grands gradients) → 10x plus rapide sur grands datasets",
      explanation:
        "XGBoost trie les données pour chaque split (O(n·f·log n)). LightGBM : histogrammes pré-calculés (O(n·f) puis O(bins·f)) → dramatiquement plus rapide. GOSS : ne calcule les gradients que sur les ~10% d'exemples avec les plus grands gradients + sous-échantillon des petits. Sur 5M lignes : LightGBM typiquement 5-10x plus rapide avec performance similaire.",
    },
    {
      question:
        "[Reward shaping] Ton agent RL doit apprendre à marcher. La récompense originale est +1 si il atteint le but (rare). L'entraînement ne converge pas. Quelle technique appliquer ?",
      options: [
        "Augmenter γ à 0.999 pour mieux valoriser la récompense finale lointaine",
        "Reward shaping — ajouter des récompenses intermédiaires denses (ex: +vitesse de déplacement) pour guider l'apprentissage sans attendre la récompense terminale rare",
        "Réduire ε pour que l'agent exploite plus",
        "Augmenter la taille du replay buffer",
      ],
      answer:
        "Reward shaping — ajouter des récompenses intermédiaires denses (ex: +vitesse de déplacement) pour guider l'apprentissage sans attendre la récompense terminale rare",
      explanation:
        "Récompense sparse = signal très rare → l'agent ne sait pas quoi apprendre. Reward shaping : ajouter des récompenses denses alignées avec l'objectif (vitesse, direction, posture debout). Risque : l'agent optimise la récompense shapée au lieu de l'objectif réel (reward hacking). Solution rigoureuse : potential-based shaping F(s,s') = γΦ(s')-Φ(s) qui préserve la politique optimale originale.",
    },
    {
      question:
        "[Ensemble théorie] Pourquoi la diversité des modèles de base est-elle plus importante que leur performance individuelle dans un ensemble ?",
      options: [
        "Les modèles plus précis individuellement sont toujours meilleurs en ensemble",
        "Des modèles diversifiés font des erreurs différentes — quand l'un se trompe, les autres peuvent compenser. Des modèles similaires et précis font les mêmes erreurs ensemble",
        "La diversité est importante uniquement pour le Stacking, pas pour Bagging ou Boosting",
        "Des modèles faibles (weak learners) sont meilleurs en ensemble que des modèles forts",
      ],
      answer:
        "Des modèles diversifiés font des erreurs différentes — quand l'un se trompe, les autres peuvent compenser. Des modèles similaires et précis font les mêmes erreurs ensemble",
      explanation:
        "Erreur d'ensemble = f(erreur individuelle, corrélation entre modèles). Si corrélation=1 (modèles identiques) : l'ensemble ne fait pas mieux. Si corrélation=0 (modèles indépendants) : l'erreur baisse en √N. Sources de diversité : algorithmes différents (LR, RF, SVM), hyperparamètres différents, features différentes, sous-ensembles de données différents.",
    },
  ],
  expert: [
    {
      question:
        "[Entretien RL] Explique pourquoi DQN souffre du maximization bias et comment Double DQN le corrige.",
      options: [
        "DQN sur-estime les Q-values car max est une opération biaisée positivement sur des estimations bruitées — Double DQN sépare la sélection de l'action (réseau principal) et l'évaluation (target network)",
        "DQN sous-estime les Q-values — Double DQN les normalise",
        "Le maximization bias vient de l'experience replay — Double DQN utilise deux replay buffers",
        "Double DQN utilise deux agents qui se corrigent mutuellement",
      ],
      answer:
        "DQN sur-estime les Q-values car max est une opération biaisée positivement sur des estimations bruitées — Double DQN sépare la sélection de l'action (réseau principal) et l'évaluation (target network)",
      explanation:
        "DQN : target = r + γ·max_a Q_target(s',a). Sur des estimations bruitées, max sélectionne toujours l'erreur la plus positive → biais de sur-estimation qui se propage. Double DQN : a* = argmax_a Q_main(s',a) (sélection via réseau principal), target = r + γ·Q_target(s', a*) (évaluation via target network). Séparer sélection et évaluation débiaise l'estimation.",
    },
    {
      question:
        "[Théorie Ensemble] Démontre pourquoi le boosting peut réduire à la fois le biais ET la variance, contrairement au bagging qui réduit principalement la variance.",
      options: [
        "Boosting réduit le biais car les modèles séquentiels sont plus complexes que les parallèles",
        "Bagging moyenne des modèles haute variance → réduit la variance. Boosting entraîne des weak learners séquentiellement sur les résidus → chaque arbre réduit le biais résiduel, et la limitation de profondeur + learning rate contrôlent la variance",
        "Boosting réduit la variance car il utilise moins d'arbres que Bagging",
        "Les deux méthodes réduisent biais et variance de façon équivalente",
      ],
      answer:
        "Bagging moyenne des modèles haute variance → réduit la variance. Boosting entraîne des weak learners séquentiellement sur les résidus → chaque arbre réduit le biais résiduel, et la limitation de profondeur + learning rate contrôlent la variance",
      explanation:
        "Bagging : Var(moyenne) = ρσ² + (1-ρ)σ²/N → réduit σ²/N si ρ faible, biais inchangé. Boosting : somme d'estimateurs Fₘ, chaque Fₘ prédit le résidu de Fₘ₋₁ → réduit le biais itérativement. La régularisation (learning rate <1, max_depth=3, subsample) limite l'overfitting de chaque arbre → contrôle la variance. XGBoost ajoute L1/L2 sur les poids des feuilles.",
    },
    {
      question:
        "[RL théorie] Quelle est la différence fondamentale entre méthodes on-policy et off-policy en RL, et donne un exemple de chaque ?",
      options: [
        "On-policy = apprend depuis un expert, off-policy = apprend seul",
        "On-policy : apprend la valeur de la politique courante (SARSA, A3C) — les données d'expérience doivent venir de la politique actuelle. Off-policy : apprend la politique optimale indépendamment de la politique de collecte (Q-Learning, DQN) — peut réutiliser des expériences passées",
        "On-policy utilise un réseau de neurones, off-policy utilise une Q-table",
        "Off-policy est plus stable, on-policy est plus sample-efficient",
      ],
      answer:
        "On-policy : apprend la valeur de la politique courante (SARSA, A3C) — les données d'expérience doivent venir de la politique actuelle. Off-policy : apprend la politique optimale indépendamment de la politique de collecte (Q-Learning, DQN) — peut réutiliser des expériences passées",
      explanation:
        "On-policy (SARSA) : Q(s,a) ← Q(s,a) + α[r + γQ(s',a') - Q(s,a)] où a' est l'action réellement prise. Off-policy (Q-Learning) : target = max_a Q(s',a) quel que soit l'action prise. Off-policy permet le replay buffer (réutiliser vieilles transitions) → meilleure sample efficiency. On-policy est plus stable (pas de distribution shift). PPO est on-policy, DQN est off-policy.",
    },
    {
      question:
        "[Cas complexe] Tu construis un système de recommandation. Tu as le choix entre Gradient Boosting sur features statiques (user_id, item_id, historique) et RL pour optimiser l'engagement long terme. Justifie l'approche.",
      options: [
        "RL est toujours meilleur pour les systèmes de recommandation — optimise directement l'engagement",
        "GB pour le démarrage (cold start, données historiques, interprétabilité) ; RL si l'objectif est l'engagement long terme séquentiel ET si tu as assez de données d'interaction et une simulation fidèle de l'environnement",
        "Les deux sont équivalents — choisir selon la préférence de l'équipe",
        "RL est impossible pour la recommandation car l'espace d'action est trop grand",
      ],
      answer:
        "GB pour le démarrage (cold start, données historiques, interprétabilité) ; RL si l'objectif est l'engagement long terme séquentiel ET si tu as assez de données d'interaction et une simulation fidèle de l'environnement",
      explanation:
        "GB : efficace sur données historiques, interprétable, facile à déployer, gère bien les features hétérogènes. Limite : optimise le prochain clic, pas l'engagement long terme. RL : modélise la séquence de recommandations, optimise une récompense cumulée (rétention). Défis RL : reward shaping (engagement ≠ satisfaction), cold start, offline RL (data historique ≠ rollouts online), simulation fidèle. En pratique : commencer par GB, ajouter RL (Bandits contextuels d'abord) progressivement.",
    },
    {
      question:
        "[No Free Lunch] En compétition Kaggle, XGBoost domine les datasets tabulaires. Cela contredit-il le No Free Lunch theorem ?",
      options: [
        "Oui — XGBoost est universellement supérieur, le NFL theorem est dépassé",
        "Non — XGBoost domine sur la distribution spécifique des datasets Kaggle (tabulaires, hétérogènes, taille moyenne) mais pas universellement. NFL dit qu'intégré sur TOUS les problèmes possibles, tous les algorithmes sont équivalents",
        "Le NFL theorem s'applique uniquement aux algorithmes d'optimisation, pas au ML",
        "XGBoost ne contredit pas NFL car il intègre tous les autres algorithmes",
      ],
      answer:
        "Non — XGBoost domine sur la distribution spécifique des datasets Kaggle (tabulaires, hétérogènes, taille moyenne) mais pas universellement. NFL dit qu'intégré sur TOUS les problèmes possibles, tous les algorithmes sont équivalents",
      explanation:
        "NFL (Wolpert 1996) : aucun algorithme n'est meilleur qu'un autre en moyenne sur tous les problèmes. XGBoost est excellent sur la distribution de problèmes tabulaires Kaggle — mais sur images (CNN), texte (Transformers), données séquentielles (LSTM/Transformer), XGBoost est médiocre. La réalité pratique : les problèmes réels ne sont pas uniformément distribués — certains algorithmes dominent sur certaines distributions de problèmes.",
    },
    {
      question:
        "[RLHF avancé] Comment RLHF (Reinforcement Learning from Human Feedback) est-il utilisé pour aligner les LLMs, et quels sont ses problèmes fondamentaux ?",
      options: [
        "RLHF entraîne directement le LLM sur les préférences humaines sans modèle de récompense",
        "RLHF : 1) SFT sur données supervisées 2) Reward Model appris depuis comparaisons humaines 3) PPO pour optimiser le LLM selon le reward model — problèmes : reward hacking, mode collapse, coût des annotations, distribution shift",
        "RLHF est une variante de Q-Learning adaptée aux LLMs",
        "RLHF fonctionne uniquement pour les modèles < 7B paramètres",
      ],
      answer:
        "RLHF : 1) SFT sur données supervisées 2) Reward Model appris depuis comparaisons humaines 3) PPO pour optimiser le LLM selon le reward model — problèmes : reward hacking, mode collapse, coût des annotations, distribution shift",
      explanation:
        "Pipeline RLHF : SFT (Supervised Fine-Tuning) sur exemples de qualité → Reward Model (classifieur entraîné sur préférences A>B) → PPO pour maximiser le reward model + KL divergence avec le modèle SFT (évite le mode collapse). Problèmes : reward hacking (le modèle exploite des failles du reward model), coût élevé des comparaisons humaines, reward model ne généralise pas hors distribution. Alternatives : DPO (Direct Preference Optimization) — élimine le reward model explicit.",
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
    .replace(/\r?\n- /g, " ◆ ").replace(/\r?\n• /g, " ◆ ")
    .replace(/\r?\n/g, " ").replace(/\.-\s*\*\*/g, " ◆ **").replace(/-\s*\*\*/g, " ◆ **");
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
        ? <h3 className="success">🚀 Excellent ! Ensemble Learning & RL maîtrisés.</h3>
        : <p className="fail">📚 Révisez XGBoost, les mécanismes de RL et la diversité des ensembles.</p>
      }
    </div>
  );
};

const MLEnsembleRL = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage("");
    } else {
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

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
            ML Interview 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`
            }
          </h4>
          {level === "basic"
            ? <Flashcard slide={basicSlides[currentSlide]} />
            : <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          }
          {message && <p className="message" style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default MLEnsembleRL;
