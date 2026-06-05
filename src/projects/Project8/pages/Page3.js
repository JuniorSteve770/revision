// src/projects/BackendInterview/MLClassicalEval.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Classical Learning + Évaluation de modèles",
    answer:
      "◆ **Bloc 1** : Apprentissage supervisé — régression, classification, les grands algorithmes ◆ **Bloc 2** : Régression Linéaire & Logistique — hypothèses, gradient descent, sigmoid ◆ **Bloc 3** : SVM, KNN, Arbres de décision — mécanismes internes et cas d'usage ◆ **Bloc 4** : Underfitting / Overfitting — biais-variance trade-off, régularisation L1/L2 ◆ **Bloc 5** : Matrice de confusion — TP, TN, FP, FN — lire et interpréter ◆ **Bloc 6** : Métriques clés — Accuracy, Precision, Recall, F1-Score ◆ **Bloc 7** : AUC-ROC, courbe PR — quand les utiliser ◆ **Bloc 8** : Validation croisée, train/val/test split, stratification",
  },
  {
    question: "Apprentissage supervisé — Le cadre général",
    answer:
      "◆ **Principe** : apprendre une fonction f(X) → y à partir d'exemples étiquetés (X, y) ◆ **Régression** : y est continu — prédire un prix, une température, un score ◆ **Classification** : y est discret — prédire une classe (spam/non-spam, maladie/sain) ◆ **Pipeline standard** : Collecter les données → Nettoyer → Feature Engineering → Entraîner → Évaluer → Déployer ◆ **Feature Engineering** : normalisation (StandardScaler), encodage (OneHotEncoder), gestion des NULL ◆ **Train/Test split** : typiquement 80/20 — le test set ne doit JAMAIS être vu pendant l'entraînement ⚠️ Entraîner ET évaluer sur le même jeu = data leakage — le modèle memorise au lieu d'apprendre",
  },
  {
    question: "Régression Linéaire — Mécanisme interne",
    answer:
      "◆ **Hypothèse** : y = w₀ + w₁x₁ + w₂x₂ + ... + wₙxₙ — relation linéaire entre features et cible ◆ **Objectif** : minimiser la MSE (Mean Squared Error) = moyenne de (y_pred - y_réel)² ◆ **Gradient Descent** : ajuster les poids w à chaque itération dans le sens de la pente descendante de la loss ◆ **Learning rate** : trop grand = divergence ; trop petit = convergence lente ◆ **Métriques** : MSE, RMSE (en unités de y), MAE (robuste aux outliers), R² (% variance expliquée) ◆ **Hypothèses** : linéarité, homoscédasticité, pas de multicolinéarité ⚠️ R² élevé ne garantit pas un bon modèle — vérifier les résidus et la distribution des erreurs",
  },
  {
    question: "Régression Logistique — Classification binaire",
    answer:
      "◆ **Malgré son nom** : c'est un algorithme de classification, pas de régression ◆ **Sigmoid** : σ(z) = 1/(1+e^-z) — transforme n'importe quel réel en probabilité [0,1] ◆ **Décision** : si P(y=1|X) > 0.5 → classe 1 (seuil ajustable selon le contexte) ◆ **Loss** : Binary Cross-Entropy (Log Loss) = -[y·log(p) + (1-y)·log(1-p)] ◆ **Régularisation** : L2 (Ridge) pour éviter l'overfitting — paramètre C dans sklearn (C=1/λ) ◆ **Multi-classe** : extension via Softmax (One-vs-Rest ou Multinomial) ⚠️ La régression logistique suppose une frontière de décision LINÉAIRE — si les classes ne sont pas séparables linéairement, envisager SVM avec kernel ou un arbre",
  },
  {
    question: "SVM — Support Vector Machine",
    answer:
      "◆ **Idée** : trouver l'hyperplan qui maximise la marge entre les deux classes ◆ **Support Vectors** : les points les plus proches de l'hyperplan — ils définissent la frontière ◆ **Soft Margin** : paramètre C — C élevé = marge étroite (risque overfitting), C faible = marge large (risque underfitting) ◆ **Kernel Trick** : projeter les données dans un espace de dimension supérieure sans calculer explicitement la transformation — `rbf`, `poly`, `sigmoid` ◆ **Cas d'usage** : classification avec peu de données, données de haute dimension (texte, images) ◆ **Limites** : lent sur grands datasets (O(n²) à O(n³)), difficile à interpréter ⚠️ Sans normalisation des features, le SVM est très sensible aux différences d'échelle",
  },
  {
    question: "Arbres de décision & KNN",
    answer:
      "◆ **Arbre de décision** : partitionne récursivement l'espace en posant des questions binaires sur les features ◆ **Critère de split** : Gini Impurity (classification) ou MSE (régression) — choisir le split qui réduit le plus l'impureté ◆ **Profondeur** : max_depth contrôle l'overfitting — un arbre profond mémorise, un arbre peu profond généralise ◆ **KNN (K-Nearest Neighbors)** : classer un point selon les K voisins les plus proches (distance Euclidienne) ◆ **K** : K petit = overfitting, K grand = underfitting — optimiser via cross-validation ◆ **KNN est paresseux** : pas de phase d'entraînement — toute la computation se fait à la prédiction ⚠️ KNN est très lent en prédiction sur grands datasets et souffre de la malédiction de la dimensionnalité",
  },
  {
    question: "Biais-Variance Trade-off — Underfitting & Overfitting",
    answer:
      "◆ **Biais** : erreur due à des hypothèses trop simplistes — underfitting, mauvaises performances sur train ET test ◆ **Variance** : erreur due à une trop grande sensibilité aux données d'entraînement — overfitting, bonnes perfs sur train, mauvaises sur test ◆ **Trade-off** : réduire le biais augmente souvent la variance et vice versa ◆ **Diagnostiquer** : learning curve — si train_error ≈ val_error (élevés) = underfitting ; si train_error << val_error = overfitting ◆ **Lutter contre l'overfitting** : régularisation L1/L2, dropout, early stopping, plus de données, moins de features ◆ **Lutter contre l'underfitting** : modèle plus complexe, plus de features, réduire la régularisation ⚠️ Le modèle parfait n'existe pas — chercher le juste équilibre selon le contexte métier",
  },
  {
    question: "Régularisation L1 (Lasso) et L2 (Ridge)",
    answer:
      "◆ **Principe** : ajouter une pénalité à la loss pour limiter la magnitude des poids ◆ **L2 (Ridge)** : loss + λ·Σwᵢ² — réduit les poids vers 0 sans les annuler, gère la multicolinéarité ◆ **L1 (Lasso)** : loss + λ·Σ|wᵢ| — peut annuler complètement certains poids → sélection automatique de features ◆ **ElasticNet** : combine L1 + L2 — meilleur des deux mondes ◆ **λ (alpha)** : hyperparamètre à optimiser via cross-validation — grand λ = forte régularisation ◆ **sklearn** : `Ridge(alpha=1.0)`, `Lasso(alpha=0.1)`, `ElasticNet(l1_ratio=0.5)` ⚠️ L1 peut supprimer des features importantes si λ est trop grand — vérifier l'importance des features après",
  },
  {
    question: "Matrice de confusion — Lire et interpréter",
    answer:
      "◆ **Structure 2x2** (binaire) : lignes = réel, colonnes = prédit ◆ **TP (True Positive)** : réel=Positif, prédit=Positif — bonne détection ◆ **TN (True Negative)** : réel=Négatif, prédit=Négatif — bonne exclusion ◆ **FP (Type I)** : réel=Négatif, prédit=Positif — fausse alarme ◆ **FN (Type II)** : réel=Positif, prédit=Négatif — cas manqué ◆ **Exemple médical** : FN = patient malade non détecté (grave) / FP = patient sain diagnostiqué malade (coûteux) ◆ **Lecture** : diagonale principale = bonnes prédictions, hors-diagonale = erreurs ⚠️ L'accuracy peut être trompeuse sur les données déséquilibrées — toujours analyser la matrice complète",
  },
  {
    question: "Accuracy, Precision, Recall, F1-Score",
    answer:
      "◆ **Accuracy** : (TP+TN)/(TP+TN+FP+FN) — % de bonnes prédictions — trompeuse si classes déséquilibrées ◆ **Precision** : TP/(TP+FP) — parmi les prédits positifs, combien sont vrais ? — optimiser si FP coûteux (spam) ◆ **Recall (Sensibilité)** : TP/(TP+FN) — parmi les vrais positifs, combien détectés ? — optimiser si FN coûteux (cancer) ◆ **F1-Score** : 2·(Precision·Recall)/(Precision+Recall) — moyenne harmonique, bon équilibre ◆ **Cas d'usage** : détection de fraude → maximiser Recall (ne pas manquer de fraude), filtre spam → maximiser Precision ◆ **Macro vs Weighted F1** : Macro = moyenne par classe, Weighted = pondérée par le nb d'exemples ⚠️ Il n'existe pas de métrique universelle — choisir en fonction du coût métier des FP vs FN",
  },
  {
    question: "AUC-ROC et Courbe Précision-Rappel",
    answer:
      "◆ **Courbe ROC** : trace TPR (Recall) vs FPR (FP Rate) pour tous les seuils de décision ◆ **AUC** : aire sous la courbe ROC — 0.5 = modèle aléatoire, 1.0 = parfait ◆ **Interprétation AUC** : probabilité que le modèle classe un positif mieux qu'un négatif tiré aléatoirement ◆ **Courbe PR** : Precision vs Recall — préférable quand les négatifs sont très majoritaires ◆ **Seuil de décision** : par défaut 0.5 — ajuster selon le contexte (abaisser pour augmenter Recall) ◆ **AUC-ROC invariante** : ne dépend pas du seuil choisi — métrique de comparaison de modèles ⚠️ AUC-ROC peut être optimiste sur données très déséquilibrées — utiliser AUC-PR dans ce cas",
  },
  {
    question: "Validation croisée & Stratégie d'évaluation",
    answer:
      "◆ **Holdout simple** : 80% train / 20% test — rapide mais dépend du split aléatoire ◆ **K-Fold CV** : diviser en K folds, entraîner K fois (chaque fold devient test une fois), moyenner les scores ◆ **Stratified K-Fold** : maintient la proportion des classes dans chaque fold — obligatoire sur données déséquilibrées ◆ **Leave-One-Out (LOO)** : K = N — très précis mais très lent ◆ **Validation set** : entre train et test — optimiser les hyperparamètres sans toucher au test set ◆ **Données temporelles** : TimeSeriesSplit — ne jamais utiliser les données futures pour entraîner ⚠️ Optimiser les hyperparamètres sur le test set = data leakage — toujours utiliser un validation set séparé",
  },
  {
    question: "Hyperparamètres & Optimisation",
    answer:
      "◆ **Paramètres** : appris pendant l'entraînement (poids, biais) ◆ **Hyperparamètres** : définis avant l'entraînement (learning rate, max_depth, n_estimators) ◆ **GridSearchCV** : teste toutes les combinaisons — exhaustif mais lent ◆ **RandomizedSearchCV** : échantillonne aléatoirement — plus rapide, souvent aussi bon ◆ **Bayesian Optimization** : (Optuna, Hyperopt) — intelligent, exploite les résultats précédents ◆ **Exemple** : `GridSearchCV(SVC(), {C:[0.1,1,10], kernel:['rbf','linear']}, cv=5)` ◆ **Pipeline sklearn** : enchaîner preprocessing + modèle pour éviter le data leakage dans la CV ⚠️ Optimiser trop d'hyperparamètres sur un petit dataset = overfitting des hyperparamètres sur le validation set",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[Pratique] Tu entraînes un modèle de classification binaire. La matrice de confusion donne : TP=90, TN=50, FP=10, FN=50. Quelle est la valeur du Recall ?",
      options: [
        "Recall = 90/(90+10) = 0.90",
        "Recall = 90/(90+50) = 0.643",
        "Recall = 90/(90+50+10) = 0.60",
        "Recall = (90+50)/(90+50+10+50) = 0.70",
      ],
      answer: "Recall = 90/(90+50) = 0.643",
      explanation:
        "Recall = TP/(TP+FN). Parmi les 140 vrais positifs réels (90+50), le modèle en détecte 90. 90/(90+50) = 0.643. L'erreur classique est de confondre FP et FN dans le dénominateur. Recall mesure la capacité à trouver tous les positifs — critique en médecine ou détection de fraude.",
    },
    {
      question:
        "[Pratique] Ton modèle a une Accuracy de 95% sur un dataset de détection de fraude où 95% des transactions sont légitimes. Que conclure ?",
      options: [
        "Le modèle est excellent — 95% d'accuracy est un très bon score",
        "L'accuracy est trompeuse ici — un modèle qui prédit toujours 'légitime' atteint aussi 95% sans rien apprendre",
        "Il faut augmenter le seuil de décision de 0.5 à 0.9",
        "Le modèle souffre d'overfitting — réduire la complexité",
      ],
      answer:
        "L'accuracy est trompeuse ici — un modèle qui prédit toujours 'légitime' atteint aussi 95% sans rien apprendre",
      explanation:
        "Avec 95% de classe majoritaire, un classifieur naïf qui prédit toujours 'légitime' atteint 95% d'accuracy. Ce modèle ne détecte AUCUNE fraude (Recall=0). Sur données déséquilibrées : utiliser F1-Score, AUC-ROC ou AUC-PR, et analyser la matrice de confusion complète.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre Precision et Recall dans un contexte de diagnostic médical ?",
      options: [
        "Precision et Recall mesurent la même chose avec une formule différente",
        "Precision = parmi les diagnostics positifs combien sont vrais (éviter les fausses alarmes) ; Recall = parmi les malades réels combien détectés (ne pas en manquer)",
        "Recall = parmi les diagnostics positifs combien sont vrais ; Precision = parmi les malades réels combien détectés",
        "Precision est utilisée pour la régression, Recall pour la classification",
      ],
      answer:
        "Precision = parmi les diagnostics positifs combien sont vrais (éviter les fausses alarmes) ; Recall = parmi les malades réels combien détectés (ne pas en manquer)",
      explanation:
        "Precision = TP/(TP+FP) — combien de mes alertes sont justes. Recall = TP/(TP+FN) — combien de vrais cas ai-je trouvés. En médecine : un FN (malade non détecté) est plus grave qu'un FP (sain diagnostiqué malade) → maximiser le Recall, quitte à baisser la Precision.",
    },
    {
      question:
        "[Pratique] Un modèle de régression donne MSE=100 et R²=0.85 sur le test set. Que signifie R²=0.85 ?",
      options: [
        "Le modèle fait 85% de bonnes prédictions",
        "Le modèle explique 85% de la variance de la variable cible — 15% reste inexpliqué",
        "L'erreur quadratique moyenne est de 85%",
        "Le modèle est surentraîné — R² doit être inférieur à 0.80",
      ],
      answer:
        "Le modèle explique 85% de la variance de la variable cible — 15% reste inexpliqué",
      explanation:
        "R² (coefficient de détermination) mesure la proportion de variance expliquée par le modèle. R²=1 = prédictions parfaites. R²=0 = le modèle ne fait pas mieux que prédire la moyenne. R² peut être négatif si le modèle est pire que la moyenne. Pour interpréter l'erreur en unités de y, utiliser RMSE = √MSE = 10.",
    },
    {
      question:
        "[Overfitting] Ton modèle obtient train_accuracy=0.99 et val_accuracy=0.72. Quel est le problème et que faire ?",
      options: [
        "Underfitting — le modèle est trop simple, augmenter la complexité",
        "Overfitting — le modèle mémorise les données d'entraînement, ne généralise pas — régulariser, réduire la complexité, ajouter des données",
        "Le split train/val est mal configuré — refaire la séparation",
        "C'est normal — un écart de 0.27 est acceptable en ML",
      ],
      answer:
        "Overfitting — le modèle mémorise les données d'entraînement, ne généralise pas — régulariser, réduire la complexité, ajouter des données",
      explanation:
        "train >> val = overfitting. Le modèle apprend le bruit des données d'entraînement. Solutions : L1/L2 régularisation, réduire max_depth (arbres), dropout (réseaux de neurones), early stopping, data augmentation, cross-validation pour mieux estimer la généralisation.",
    },
    {
      question:
        "[Pratique AUC] Deux modèles de détection de fraude : Modèle A (AUC=0.95, Accuracy=0.92) et Modèle B (AUC=0.78, Accuracy=0.96). Lequel choisir ?",
      options: [
        "Modèle B — l'accuracy est plus élevée",
        "Modèle A — AUC-ROC plus élevée signifie meilleure capacité de discrimination globale, indépendamment du seuil",
        "Les deux sont équivalents — utiliser celui qui s'entraîne le plus vite",
        "Modèle B — AUC > 0.75 est suffisant pour la production",
      ],
      answer:
        "Modèle A — AUC-ROC plus élevée signifie meilleure capacité de discrimination globale, indépendamment du seuil",
      explanation:
        "Sur données déséquilibrées (fraudes rares), l'accuracy est trompeuse. AUC-ROC mesure la capacité du modèle à séparer les classes pour TOUS les seuils. A avec AUC=0.95 est bien meilleur même si son accuracy apparaît plus faible — il détecte mieux les vraies fraudes.",
    },
    {
      question:
        "[Régularisation] Ton modèle de régression linéaire overfitte. Tu veux aussi faire de la sélection automatique de features. Quelle régularisation choisir ?",
      options: [
        "L2 (Ridge) — réduit les poids mais ne les annule pas",
        "L1 (Lasso) — peut annuler complètement certains poids, effectuant une sélection de features",
        "Pas de régularisation — ajouter plus de données suffit",
        "ElasticNet — toujours préférable à L1 ou L2 seuls",
      ],
      answer:
        "L1 (Lasso) — peut annuler complètement certains poids, effectuant une sélection de features",
      explanation:
        "L1 (Lasso) pénalise la somme des valeurs absolues des poids — la géométrie de cette contrainte crée des solutions creuses (sparse) où certains poids = exactement 0. L2 réduit les poids proportionnellement mais ne les annule pas. Si tu veux régulariser sans sélection de features : L2. Si tu veux les deux : ElasticNet.",
    },
    {
      question:
        "[K-Fold] Pourquoi utiliser Stratified K-Fold plutôt que K-Fold standard sur un dataset de détection de maladies rares (2% de positifs) ?",
      options: [
        "Stratified K-Fold est plus rapide computationnellement",
        "Stratified K-Fold maintient la proportion de classes dans chaque fold — évite que certains folds n'aient aucun positif",
        "K-Fold standard est suffisant si K >= 10",
        "Stratified K-Fold est uniquement utile pour la régression",
      ],
      answer:
        "Stratified K-Fold maintient la proportion de classes dans chaque fold — évite que certains folds n'aient aucun positif",
      explanation:
        "Avec 2% de positifs, un K-Fold aléatoire peut créer des folds avec 0 ou 1 positif — l'évaluation devient instable. Stratified K-Fold garantit que chaque fold a ~2% de positifs. sklearn : `StratifiedKFold(n_splits=5)` ou `cross_val_score(..., cv=StratifiedKFold(5))`.",
    },
    {
      question:
        "[SVM pratique] Tu entraînes un SVM avec kernel RBF sur 100 000 samples. L'entraînement prend 8 heures. Quelle est la cause et la solution ?",
      options: [
        "Le kernel RBF est inadapté — passer au kernel linéaire uniquement",
        "SVM a une complexité O(n²) à O(n³) en entraînement — sur grands datasets, utiliser LinearSVC ou SGDClassifier qui sont O(n)",
        "Augmenter le paramètre C pour accélérer la convergence",
        "Réduire le nombre de features avec PCA avant SVM",
      ],
      answer:
        "SVM a une complexité O(n²) à O(n³) en entraînement — sur grands datasets, utiliser LinearSVC ou SGDClassifier qui sont O(n)",
      explanation:
        "SVM classique (sklearn SVC) utilise une optimisation quadratique qui ne passe pas à l'échelle. Sur n > 10 000 : LinearSVC (SVM linéaire via liblinear, O(n)), SGDClassifier (gradient stochastique, O(n)), ou des approximations du kernel avec Nystroem + LinearSVC.",
    },
    {
      question:
        "[Data Leakage] Tu normalises tes données AVANT de faire le train/test split. Quel problème cela crée ?",
      options: [
        "Aucun problème — normaliser avant ou après donne le même résultat",
        "Data leakage — le StandardScaler voit les statistiques du test set pour calculer la moyenne/std, ce qui donne une estimation optimiste des performances",
        "Les données normalisées sont incompatibles avec certains modèles comme les arbres de décision",
        "La normalisation doit toujours se faire sur l'ensemble complet pour être cohérente",
      ],
      answer:
        "Data leakage — le StandardScaler voit les statistiques du test set pour calculer la moyenne/std, ce qui donne une estimation optimiste des performances",
      explanation:
        "Normaliser sur tout le dataset avant split = le scaler apprend la moyenne et std du test set. En production, ce test set est inconnu. Bonne pratique : fit le scaler UNIQUEMENT sur le train set, puis transform sur train ET test. Avec sklearn Pipeline, ce comportement est automatiquement correct.",
    },
  ],
  avance: [
    {
      question:
        "[Pratique complète] Tu construis un classifieur pour détecter des tumeurs malignes (10% des cas). Ordonne ces actions par priorité :\n1) Maximiser l'Accuracy\n2) Utiliser Stratified K-Fold\n3) Analyser la courbe PR plutôt que ROC\n4) Maximiser le Recall",
      options: [
        "1 → 2 → 3 → 4",
        "4 → 2 → 3 → 1 — Recall en priorité, CV stratifiée, courbe PR pour données déséquilibrées, accuracy en dernier",
        "2 → 1 → 4 → 3",
        "3 → 4 → 2 → 1",
      ],
      answer:
        "4 → 2 → 3 → 1 — Recall en priorité, CV stratifiée, courbe PR pour données déséquilibrées, accuracy en dernier",
      explanation:
        "Pour les tumeurs : FN (malade non détecté) = catastrophique → maximiser Recall (4). CV stratifiée (2) pour que chaque fold représente les 10% de positifs. Courbe PR (3) est plus informative qu'AUC-ROC sur données déséquilibrées. Accuracy (1) est la métrique la moins utile ici — un modèle naïf l'obtient à 90%.",
    },
    {
      question:
        "[Analyse] Ton modèle de régression logistique a Precision=0.95 et Recall=0.40 sur la classe fraude. Quel seuil de décision ajuster et dans quel sens ?",
      options: [
        "Augmenter le seuil de 0.5 vers 0.8 — réduire les fausses alarmes",
        "Abaisser le seuil de 0.5 vers 0.3 — le modèle détectera plus de fraudes (Recall ↑) au prix de plus de fausses alarmes (Precision ↓)",
        "Le seuil de 0.5 est optimal — optimiser les hyperparamètres du modèle",
        "Le seuil ne peut pas être changé après l'entraînement",
      ],
      answer:
        "Abaisser le seuil de 0.5 vers 0.3 — le modèle détectera plus de fraudes (Recall ↑) au prix de plus de fausses alarmes (Precision ↓)",
      explanation:
        "Recall=0.40 = 60% des fraudes manquées. Abaisser le seuil → plus de cas classés 'fraude' → plus de TP mais aussi plus de FP → Recall ↑, Precision ↓. Trouver le bon seuil : courbe Precision-Recall ou F-beta score (beta > 1 pour valoriser plus le Recall). Le seuil est réglé APRÈS entraînement.",
    },
    {
      question:
        "[Régularisation avancée] Compléter : tu entraînes une régression Ridge avec alpha=0.001 et observes de l'overfitting. Que faire et pourquoi ?",
      options: [
        "Réduire alpha vers 0.0001 — moins de régularisation pour mieux s'adapter aux données",
        "Augmenter alpha (ex: 1.0 ou 10.0) — une régularisation plus forte réduit la magnitude des poids et contraint le modèle",
        "Passer à L1 — Lasso est toujours meilleur que Ridge contre l'overfitting",
        "Augmenter le learning rate — la régularisation et le learning rate sont liés",
      ],
      answer:
        "Augmenter alpha (ex: 1.0 ou 10.0) — une régularisation plus forte réduit la magnitude des poids et contraint le modèle",
      explanation:
        "alpha=0.001 = presque pas de régularisation. Overfitting → augmenter alpha. La pénalité λ·Σwᵢ² force les poids vers 0, simplifiant le modèle. Tester via cross-validation : `RidgeCV(alphas=[0.1, 1.0, 10.0])`. Si des features doivent être éliminées : Lasso ou ElasticNet.",
    },
    {
      question:
        "[Diagnostic learning curve] Ta learning curve montre : train_error=0.15, val_error=0.16, mais les deux restent élevés même avec plus de données. Quel problème et solution ?",
      options: [
        "Overfitting sévère — ajouter de la régularisation",
        "Underfitting (haut biais) — le modèle est trop simple pour capturer les patterns, train≈val mais tous les deux mauvais — utiliser un modèle plus complexe",
        "Le dataset est trop petit — collecter plus de données résoudra le problème",
        "Le split train/val est mal calibré — utiliser une autre seed",
      ],
      answer:
        "Underfitting (haut biais) — le modèle est trop simple pour capturer les patterns, train≈val mais tous les deux mauvais — utiliser un modèle plus complexe",
      explanation:
        "train ≈ val (élevés) = haut biais = underfitting. Le modèle ne capture pas les patterns même avec plus de données. Solutions : modèle plus complexe (ex: passer de régression linéaire à un arbre de décision profond), ajouter des features, réduire la régularisation. Ajouter des données aide l'overfitting, pas l'underfitting.",
    },
    {
      question:
        "[Matrice de confusion multi-classes] Pour un classifieur 3 classes (A, B, C), où regarder en premier dans la matrice de confusion pour identifier la principale source d'erreur ?",
      options: [
        "La diagonale principale — les bonnes prédictions",
        "Hors diagonale — les confusions entre classes, en particulier les cases avec les valeurs les plus élevées",
        "La dernière ligne — toujours la classe la plus difficile",
        "Le coin supérieur gauche — correspond à la classe majoritaire",
      ],
      answer:
        "Hors diagonale — les confusions entre classes, en particulier les cases avec les valeurs les plus élevées",
      explanation:
        "La diagonale = bonnes prédictions. Hors-diagonale = erreurs. Une case M[i,j] élevée = classe i est souvent confondue avec classe j. Identifier les paires de classes les plus confuses permet de cibler : collecter plus de données pour ces classes, améliorer les features discriminantes, ajuster le seuil de décision.",
    },
    {
      question:
        "[Pipeline sklearn] Pourquoi utiliser sklearn Pipeline au lieu d'appliquer manuellement le StandardScaler puis le modèle ?",
      options: [
        "Pipeline est plus rapide computationnellement",
        "Pipeline empêche le data leakage dans la cross-validation — le scaler est refitted uniquement sur les données train de chaque fold",
        "Pipeline est obligatoire pour sauvegarder un modèle avec joblib",
        "Pipeline permet d'utiliser des modèles non disponibles autrement",
      ],
      answer:
        "Pipeline empêche le data leakage dans la cross-validation — le scaler est refitted uniquement sur les données train de chaque fold",
      explanation:
        "Sans Pipeline et avec cross_val_score, si tu normalises manuellement avant, le scaler voit le fold de validation pendant son fit → data leakage. Avec Pipeline, à chaque fold : scaler.fit_transform(X_train_fold) → model.fit() → scaler.transform(X_val_fold). Garantit une évaluation honnête.",
    },
    {
      question:
        "[Choix de modèle] Dataset : 500 exemples, 50 features, classification binaire, besoin d'interprétabilité. Quel modèle privilégier ?",
      options: [
        "Réseau de neurones profond — le plus performant universellement",
        "Régression logistique avec régularisation L1 — interprétable, gère bien le ratio features/samples, L1 sélectionne les features pertinentes",
        "SVM avec kernel RBF — toujours optimal pour les petits datasets",
        "KNN avec K=1 — aucun paramètre à apprendre, donc pas de risque d'overfitting",
      ],
      answer:
        "Régression logistique avec régularisation L1 — interprétable, gère bien le ratio features/samples, L1 sélectionne les features pertinentes",
      explanation:
        "Avec 500 samples et 50 features, les réseaux profonds overfittent. L1 logistic regression : interprétable (coefficients = importance des features), sélection automatique de features (L1 annule les poids inutiles), rapide, gère bien les p>n situations. KNN avec K=1 overfitte maximalement.",
    },
    {
      question:
        "[F-beta score] Tu construis un système de détection d'avalanches. Un FN (avalanche manquée) est 100x plus grave qu'un FP (fausse alerte). Quelle métrique définir ?",
      options: [
        "F1-Score — équilibre Precision et Recall parfaitement",
        "F-beta score avec beta=10 — valorise fortement le Recall par rapport à la Precision",
        "Accuracy — le plus simple à interpréter pour les décideurs",
        "Precision uniquement — minimiser les fausses alertes coûteuses",
      ],
      answer:
        "F-beta score avec beta=10 — valorise fortement le Recall par rapport à la Precision",
      explanation:
        "Fbeta = (1+β²)·(P·R)/((β²·P)+R). β>1 valorise plus le Recall. β=2 = Recall 2x plus important. Ici β=10 convient. En pratique : sklearn `fbeta_score(y_true, y_pred, beta=10)`. F1 est le cas β=1 (équilibre). Pour les avalanches, manquer une détection est catastrophique → maximiser Recall même au prix de nombreuses fausses alertes.",
    },
  ],
  expert: [
    {
      question:
        "[Cas d'entretien] On te donne ce dataset : 1M d'exemples, 200 features, 0.1% de fraudes, données temporelles. Décris ta stratégie complète d'évaluation.",
      options: [
        "Train/test split 80/20 aléatoire, maximiser l'accuracy, seuil=0.5",
        "TimeSeriesSplit (éviter le leakage temporel), rééchantillonnage SMOTE sur train uniquement, métriques AUC-PR + Recall à précision fixée, seuil optimisé sur validation",
        "K-Fold stratifié avec K=10, F1-Score macro, seuil=0.5",
        "Leave-One-Out CV pour maximiser la précision de l'évaluation",
      ],
      answer:
        "TimeSeriesSplit (éviter le leakage temporel), rééchantillonnage SMOTE sur train uniquement, métriques AUC-PR + Recall à précision fixée, seuil optimisé sur validation",
      explanation:
        "Données temporelles → TimeSeriesSplit obligatoire (pas de K-Fold aléatoire). 0.1% de fraudes → AUC-PR (plus informative qu'AUC-ROC sur données ultra-déséquilibrées). SMOTE uniquement sur train (jamais sur validation/test). Seuil optimisé sur validation selon la contrainte métier (ex: 'Recall >= 0.90 avec Precision la plus haute possible'). LOO est inutilisable sur 1M samples.",
    },
    {
      question:
        "[Régularisation avancée] Quel est l'effet géométrique qui explique pourquoi L1 crée des solutions creuses (sparse) là où L2 ne le fait pas ?",
      options: [
        "L1 a un gradient plus grand que L2, ce qui pousse plus fort vers 0",
        "La boule L1 (losange) a des coins sur les axes — l'optimum se trouve souvent à un coin où certains poids = exactement 0 ; la boule L2 (cercle) a une surface lisse sans coins",
        "L1 utilise la valeur absolue qui est numériquement plus instable, créant des zéros accidentels",
        "L2 ne peut pas annuler des poids car son gradient est toujours non nul",
      ],
      answer:
        "La boule L1 (losange) a des coins sur les axes — l'optimum se trouve souvent à un coin où certains poids = exactement 0 ; la boule L2 (cercle) a une surface lisse sans coins",
      explanation:
        "Géométriquement, la contrainte L1 forme un losange (en 2D) avec des coins sur les axes. L'ellipsoïde de la fonction de coût touche souvent ce losange à un coin → poids = 0. La contrainte L2 est une sphère sans coins → l'intersection est rarement sur un axe → poids réduits mais non nuls. C'est la question d'entretien classique sur la régularisation.",
    },
    {
      question:
        "[Optimisation avancée] Ton GridSearchCV avec 5 paramètres × 4 valeurs chacun et CV=5 folds tourne depuis 48h. Quelle stratégie adopter ?",
      options: [
        "Attendre — GridSearch exhaustif est incontournable pour trouver le vrai optimum",
        "Passer à RandomizedSearchCV (n_iter=50) ou Optuna (Bayesian optimization) — l'espace de recherche est trop grand pour une exploration exhaustive",
        "Réduire le nombre de folds à CV=2 pour aller plus vite",
        "Paralléliser sur plus de CPUs — n_jobs=-1 dans GridSearchCV",
      ],
      answer:
        "Passer à RandomizedSearchCV (n_iter=50) ou Optuna (Bayesian optimization) — l'espace de recherche est trop grand pour une exploration exhaustive",
      explanation:
        "5 paramètres × 4 valeurs = 4^5 = 1024 combinaisons × 5 folds = 5120 entraînements. RandomizedSearchCV avec n_iter=50 évalue 50 combinaisons aléatoires — souvent 90% de la performance de GridSearch en 5% du temps. Optuna est encore plus efficace : il exploite les résultats précédents pour cibler les zones prometteuses. n_jobs=-1 aide mais ne change pas le nombre de combinaisons.",
    },
    {
      question:
        "[Cas réel] Ta courbe ROC montre AUC=0.88 mais ta courbe Precision-Rappel montre AUC-PR=0.23 sur un dataset avec 1% de positifs. Quelle est la bonne interprétation ?",
      options: [
        "Le modèle est excellent — AUC=0.88 confirme de bonnes performances",
        "L'AUC-ROC est optimiste sur données très déséquilibrées — AUC-PR=0.23 révèle que le modèle est en réalité médiocre pour détecter la classe minoritaire",
        "Les deux métriques sont contradictoires — le modèle a un bug",
        "AUC-PR=0.23 est correct pour 1% de positifs — c'est le baseline attendu",
      ],
      answer:
        "L'AUC-ROC est optimiste sur données très déséquilibrées — AUC-PR=0.23 révèle que le modèle est en réalité médiocre pour détecter la classe minoritaire",
      explanation:
        "Sur données très déséquilibrées, la ROC est gonflée par les TN (nombreux négatifs bien classés). AUC-PR est plus sévère : elle mesure la qualité des prédictions sur la classe positive uniquement. Un AUC-PR de 0.23 quand le baseline (prédire toujours positif) donnerait PR=0.01 est correct... mais 0.23 reste faible. En production à 1% de positifs, viser AUC-PR > 0.5 minimum.",
    },
    {
      question:
        "[Architecture d'évaluation] Tu dois comparer 5 algorithmes sur 10 datasets différents. Comment déterminer statistiquement lequel est le meilleur ?",
      options: [
        "Moyenner les AUC-ROC sur les 10 datasets et choisir le plus élevé",
        "Test de Friedman sur les rangs + post-hoc Nemenyi test — évalue si les différences sont statistiquement significatives sur les 10 datasets",
        "Comparer les intervals de confiance des CV scores sur chaque dataset",
        "Utiliser le modèle avec la meilleure performance sur le dataset le plus grand",
      ],
      answer:
        "Test de Friedman sur les rangs + post-hoc Nemenyi test — évalue si les différences sont statistiquement significatives sur les 10 datasets",
      explanation:
        "Pour comparer N algorithmes sur K datasets : Test de Friedman (non-paramétrique, compare les rangs) détermine si au moins un algorithme est différent. Si significatif, test post-hoc de Nemenyi identifie quelles paires diffèrent. Simple average ranking peut suffire pour une comparaison exploratoire. C'est la méthodologie de Demsar (2006), référence dans les benchmarks ML.",
    },
    {
      question:
        "[Biais-Variance théorie] Un modèle de forêt aléatoire avec 1000 arbres profondsа une variance très faible mais un biais légèrement élevé. Quel mécanisme explique la réduction de variance ?",
      options: [
        "Les 1000 arbres apprennent les mêmes patterns — moyenner n'apporte rien",
        "La moyenne de N estimateurs indépendants réduit la variance d'un facteur N — le bootstrap et la sélection aléatoire de features décoèlent les arbres pour les rendre quasi-indépendants",
        "Les arbres profonds ont intrinsèquement une faible variance",
        "La régularisation interne de Random Forest annule les effets d'overfitting",
      ],
      answer:
        "La moyenne de N estimateurs indépendants réduit la variance d'un facteur N — le bootstrap et la sélection aléatoire de features décoèlent les arbres pour les rendre quasi-indépendants",
      explanation:
        "Var(moyenne de N var. indép.) = σ²/N. Les arbres ne sont pas totalement indépendants (même données de base) mais le bootstrap (échantillons différents) + max_features aléatoire réduisent la corrélation. Plus les arbres sont décorélés, plus la réduction de variance est proche du facteur 1/N. C'est le fondement mathématique du bagging. Le léger biais vient de la sélection aléatoire de features qui peut exclure les meilleures.",
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

const MLClassicalEval = () => {
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
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

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

export default MLClassicalEval;
