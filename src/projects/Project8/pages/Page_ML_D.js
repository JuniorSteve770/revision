// src/projects/ml/Page_ML_D.js
import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Ensembles : Bagging vs Boosting vs Stacking + AdaBoost vs XGBoost",
    answer:
      "◆ **Bloc 1** : Bagging vs Boosting vs Stacking — 3 stratégies, 3 mécanismes ◆ **Bloc 2** : Random Forest (Bagging) — paramètres clés, quand l'utiliser ◆ **Bloc 3** : AdaBoost — mécanisme de repondération, cas d'usage ◆ **Bloc 4** : XGBoost — gradient boosting optimisé, paramètres critiques ◆ **Bloc 5** : AdaBoost vs XGBoost — comparaison directe ◆ **Bloc 6** : Stacking — out-of-fold, meta-modèle, risque de data leakage ◆ **Bloc 7** : Random Forest vs XGBoost — le versus principal ◆ **Bloc 8** : Choisir son ensemble selon le contexte — grille de décision",
  },
  {
    question: "Bagging vs Boosting vs Stacking — 3 stratégies fondamentales",
    answer:
      "◆ **Bagging** : N modèles entraînés en parallèle sur N bootstrap samples → agrégation par vote/moyenne ◆ **Boosting** : N modèles entraînés séquentiellement → chaque modèle corrige les erreurs du précédent ◆ **Stacking** : M modèles de types différents → leurs prédictions deviennent les features d'un méta-modèle ◆ **Objectif Bagging** : réduire la variance — idéal contre l'overfitting ◆ **Objectif Boosting** : réduire le biais ET la variance — modèles faibles → fort ensemble ◆ **Objectif Stacking** : maximiser la performance — exploiter la diversité des algorithmes ◆ **Complexité** : Bagging < Boosting < Stacking en termes de paramétrage ⚠️ Boosting est séquentiel = non-parallélisable nativement — entraînement plus lent que Bagging pour le même nombre d'estimateurs",
  },
  {
    question: "Random Forest — Bagging d'arbres avec feature randomness",
    answer:
      "◆ **Mécanisme** : Bagging + à chaque split, sélection aléatoire de max_features features parmi toutes ◆ **Pourquoi max_features** : décorrèle les arbres → chaque arbre voit différentes features → ensemble plus robuste ◆ **Paramètres clés** : n_estimators (100-500), max_depth (None ou 10-20), max_features ('sqrt' classification, 'log2' ou None régression), min_samples_leaf ◆ **OOB score** : ~37% des données non utilisées par chaque arbre → évaluation gratuite sans holdout ◆ **Feature importance** : réduction moyenne d'impureté par feature — biaisée vers les features continues ◆ **RF vs arbre seul** : arbre profond overfitte → RF parallélise 200 arbres profonds → variance ÷ N ⚠️ RF avec n_estimators=10 est instable — toujours utiliser au moins 100, idéalement 200-500",
  },
  {
    question: "AdaBoost — Mécanisme de repondération des erreurs",
    answer:
      "◆ **Principe** : entraîner T weak learners (arbres à 1 nœud = stumps) séquentiellement ◆ **Étape 1** : entraîner le stump 1 sur données pondérées uniformément ◆ **Étape 2** : calculer l'erreur pondérée ε = Σwᵢ·1(yᵢ ≠ ŷᵢ) ◆ **Étape 3** : calculer le poids du stump α = 0.5·ln((1-ε)/ε) — bon stump = fort poids ◆ **Étape 4** : augmenter le poids des exemples mal classés, diminuer les bien classés ◆ **Prédiction finale** : vote pondéré Σαₜ·hₜ(x) ◆ **Cas d'usage** : données binaires propres, features peu nombreuses, interprétabilité souhaitée ◆ **Limites** : très sensible aux outliers (ils obtiennent des poids élevés), ne gère pas bien les données multi-classes ⚠️ Un outlier dans les données va concentrer tout le poids sur lui → adaboost devient obsédé par cet outlier",
  },
  {
    question: "XGBoost — Gradient Boosting avec régularisation avancée",
    answer:
      "◆ **Mécanisme** : construire les arbres en minimisant la loss + termes de régularisation via le gradient ET le hessien ◆ **Différence vs AdaBoost** : XGBoost ajuste sur les pseudo-résidus (gradient), AdaBoost repondère les exemples ◆ **Régularisation intégrée** : L1 (alpha) + L2 (lambda) sur les poids des feuilles — absent dans AdaBoost classique ◆ **Paramètres critiques** : n_estimators + early_stopping, learning_rate (0.01-0.1), max_depth (3-6), subsample (0.6-0.9), colsample_bytree (0.6-0.9) ◆ **Gestion des NULL** : XGBoost apprend la direction par défaut pour les valeurs manquantes — no imputation needed ◆ **Performance** : standard de facto sur données tabulaires Kaggle depuis 2015 ⚠️ XGBoost sans early_stopping_rounds + eval_set = overfitting certain — toujours configurer les deux",
  },
  {
    question: "AdaBoost vs XGBoost — Comparaison directe",
    answer:
      "◆ **Modèles de base** : AdaBoost = stumps (1 niveau) / XGBoost = arbres de profondeur 3-6 ◆ **Correction des erreurs** : Ada = repondération des exemples / XGB = résidus du gradient ◆ **Régularisation** : Ada = aucune nativement / XGB = L1 + L2 intégrés + learning rate shrinkage ◆ **Outliers** : Ada = très sensible (poids excessifs) / XGB = plus robuste (perte de la sous-requête) ◆ **Valeurs manquantes** : Ada = prétraitement obligatoire / XGB = gestion native ◆ **Performance brute** : XGB >> Ada sur la majorité des benchmarks tabulaires ◆ **Interprétabilité** : Ada = stumps lisibles / XGB = SHAP pour l'interprétation ◆ **Quand Ada** : baseline rapide, peu de données, pas de NULL, problème binaire simple ◆ **Quand XGB** : compétition de performance, données réelles complexes, NULL présents ⚠️ AdaBoost est un excellent algorithme pédagogique mais XGBoost le domine en production dans presque tous les contextes",
  },
  {
    question: "Stacking — Architecture et risques de data leakage",
    answer:
      "◆ **Architecture** : niveau 0 (base models : LR, RF, SVM, XGB) → niveau 1 (meta-model : LR simple ou XGB léger) ◆ **Out-of-Fold** : générer les prédictions de niveau 0 via K-Fold pour éviter le leakage — chaque fold test = données non vues ◆ **Procédure** : split en K folds → pour chaque fold, entraîner les N modèles sur les K-1 autres folds → prédire sur le fold test → empiler → entraîner le méta-modèle ◆ **Meta-model** : souvent régression logistique (simple, peu de features = prédictions N modèles) ◆ **Diversité** : clé du stacking — combiner des modèles très différents (LR + RF + SVM + NN) ◆ **Blending** : variante — utiliser un holdout fix (20%) plutôt que K-Fold ⚠️ Entraîner les modèles de niveau 0 sur le train complet puis leur prédiction sur ce même set pour le méta-modèle = data leakage — résultat illusoirement excellent",
  },
  {
    question: "Random Forest vs XGBoost — Le versus principal",
    answer:
      "◆ **Parallélisme** : RF = totalement parallèle / XGB = séquentiel (chaque arbre dépend du précédent) ◆ **Temps d'entraînement** : RF plus rapide sur N cœurs / XGB plus lent mais early stopping compense ◆ **Tuning** : RF = robuste avec les defaults / XGB = nombreux hyperparamètres à tuner ◆ **Overfitting** : RF = résistant naturellement / XGB = overfitte si mal paramétré ◆ **Performance peak** : XGB >> RF sur la majorité des benchmarks tabulaires ◆ **Avec peu de données** : RF plus stable / XGB overfitte facilement ◆ **Features manquantes** : XGB gère nativement / RF nécessite imputation ◆ **Interprétabilité** : égalité — tous deux ont feature importance + support SHAP ⚠️ Ne pas opposer les deux : en pratique, tester les deux et choisir selon la CV — XGB gagne souvent mais pas toujours",
  },
  {
    question: "Grille de décision — Quel ensemble choisir ?",
    answer:
      "◆ **Overfitting d'un arbre seul** → Random Forest : réduit la variance sans perdre l'expressivité ◆ **Maximiser la performance sur données tabulaires** → XGBoost ou LightGBM : standard Kaggle ◆ **Dataset grand (>500K lignes)** → LightGBM : 5-10x plus rapide qu'XGBoost ◆ **Peu de données (<1000)** → Random Forest : XGBoost overfitte, RF plus stable ◆ **Besoin de diversité maximale (compétition)** → Stacking : combiner LR + RF + XGB + SVM ◆ **Production avec latence** → arbre seul ou LR : ensemble = plus lent à la prédiction ◆ **Baseline rapide** → Random Forest avec defaults : un seul hyperparamètre (n_estimators) suffit pour commencer ⚠️ LightGBM croît feuille par feuille (leaf-wise) au lieu de niveau par niveau (level-wise comme XGBoost) → plus rapide mais plus sensible à l'overfitting si max_depth n'est pas contrôlé",
  },
  {
    question: "Paramétrage XGBoost — Les 6 paramètres qui comptent",
    answer:
      "◆ **n_estimators** : nombre d'arbres — mettre grand (1000+) et utiliser early_stopping ◆ **learning_rate (eta)** : 0.01-0.05 avec beaucoup d'arbres OU 0.1-0.3 avec peu d'arbres — tradeoff vitesse/généralisation ◆ **max_depth** : 3-6 — plus profond = plus expressif mais overfitting. 6 est souvent la limite ◆ **subsample** : 0.6-0.9 — fraction des lignes par arbre — réduit la variance ◆ **colsample_bytree** : 0.6-0.9 — fraction des features par arbre — comme max_features de RF ◆ **scale_pos_weight** : ratio négatifs/positifs — pour les classes déséquilibrées ◆ **Stratégie** : commencer par les defaults, early stopping, puis tuner max_depth et learning_rate, puis subsample/colsample ⚠️ Tuner n_estimators et learning_rate ensemble sans early stopping = double overfitting",
  },
  {
    question: "Paramétrage Random Forest — Les 4 paramètres qui comptent",
    answer:
      "◆ **n_estimators** : 100-500 — plus = mieux mais rendements décroissants après ~200 ◆ **max_features** : 'sqrt' pour classification (√p features), 'log2' ou None pour régression — contrôle la décorrélation ◆ **max_depth** : None (arbres complets) par défaut — si overfitting, essayer 10-20 ◆ **min_samples_leaf** : 1 par défaut — augmenter à 5-20 si overfitting ou dataset bruité ◆ **class_weight='balanced'** : pour les classes déséquilibrées — pondère automatiquement ◆ **random_state** : fixer pour la reproductibilité ◆ **n_jobs=-1** : paralléliser sur tous les cœurs — RF est l'ensemble le plus facile à paralléliser ⚠️ max_features='sqrt' est souvent optimal pour la classification — 'None' (toutes les features) élimine l'effet décorrélation et RF dégénère vers Bagging simple",
  },
  {
    question: "Voting Classifier — Soft Vote vs Hard Vote",
    answer:
      "◆ **Hard Vote** : chaque modèle vote pour une classe → classe majoritaire gagne — 1 modèle = 1 voix ◆ **Soft Vote** : chaque modèle donne ses probabilités → moyenne des probas → classe avec proba max ◆ **Soft Vote supérieur** quand les modèles sont bien calibrés — exploite la CONFIANCE de chaque modèle ◆ **Exemple** : LR prédit [0.95, 0.05], RF prédit [0.49, 0.51], SVM prédit [0.48, 0.52] ◆ **Hard Vote** : 1-0 + 0-1 + 0-1 = 2 vs 1 → classe NÉGATIVE gagne ◆ **Soft Vote** : (0.95+0.49+0.48)/3 = 0.64 → classe POSITIVE gagne (plus logique) ◆ **Calibration** : si les modèles ne donnent pas de probas calibrées (SVM brut), Hard Vote est préférable ⚠️ SVM sans CalibratedClassifierCV donne des scores de décision, pas des probabilités — Soft Vote avec SVM brut = résultats arbitraires",
  },
  {
    question: "Ensembles en production — Compromis performance vs latence",
    answer:
      "◆ **Latence de prédiction** : arbre seul (μs) < LR (μs) < RF-10 (ms) < XGB-100 (ms) < Stacking (10ms+) ◆ **Cas batch (offline)** : utiliser le meilleur ensemble possible — pas de contrainte temps ◆ **Cas API temps réel** : mesurer la latence P99 — si > budget → réduire n_estimators ou distiller ◆ **Distillation** : entraîner un modèle simple sur les prédictions de l'ensemble — garder 80% de la performance à 10% du coût ◆ **Modèle champion/challenger** : déployer le nouveau modèle en shadow mode, comparer sur le trafic réel ◆ **Monitoring drift** : surveiller la distribution des prédictions — concept drift détectable par une variation de la distribution de sortie ⚠️ Un stacking à 5 niveaux avec 10 modèles gagne 0.2% d'AUC mais multiplie par 10 la latence et la complexité de maintenance",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[Versus] Quelle est la différence fondamentale entre Bagging et Boosting dans la manière dont les modèles apprennent ?",
      options: [
        "Bagging utilise des arbres, Boosting utilise des réseaux de neurones",
        "Bagging entraîne N modèles indépendants en parallèle (réduction de variance) ; Boosting entraîne N modèles séquentiellement où chaque modèle corrige les erreurs du précédent (réduction de biais)",
        "Bagging est plus lent que Boosting car il utilise plus de mémoire",
        "Les deux méthodes produisent des modèles identiques avec assez d'estimateurs",
      ],
      answer:
        "Bagging entraîne N modèles indépendants en parallèle (réduction de variance) ; Boosting entraîne N modèles séquentiellement où chaque modèle corrige les erreurs du précédent (réduction de biais)",
      explanation:
        "Bagging : chaque modèle voit un échantillon bootstrap différent, ils sont indépendants → parallélisable → réduit la variance. Boosting : le modèle t dépend de t-1 → séquentiel → réduit le biais en se concentrant sur les cas difficiles. Un arbre de décision qui overfitte = problème de variance → Bagging. Un arbre-souche (stump) qui underfitte = problème de biais → Boosting.",
    },
    {
      question:
        "[Versus] Ton arbre de décision overfitte avec train_acc=0.99 et val_acc=0.74. Tu hésites entre Random Forest et AdaBoost. Que choisir ?",
      options: [
        "AdaBoost — le boosting est toujours supérieur au bagging",
        "Random Forest — bagging d'arbres profonds qui réduit directement la variance du problème d'overfitting",
        "Les deux donnent le même résultat dans ce cas",
        "AdaBoost avec stumps — la simplification des modèles de base corrige l'overfitting",
      ],
      answer:
        "Random Forest — bagging d'arbres profonds qui réduit directement la variance du problème d'overfitting",
      explanation:
        "Overfitting = haute variance → Bagging (RF) est la solution directe. RF entraîne de nombreux arbres profonds sur des données bootstrappées et moyennise → variance réduite. AdaBoost utilise des stumps (arbres 1 niveau) → biais élevé → problème différent. AdaBoost conviendrait si le problème était l'underfitting d'un modèle de base.",
    },
    {
      question:
        "[Versus AdaBoost vs XGBoost] Dans quel cas AdaBoost serait-il préférable à XGBoost ?",
      options: [
        "Jamais — XGBoost domine AdaBoost dans tous les contextes",
        "Dataset propre (pas de NULL), petit (< 500 lignes), classification binaire simple, besoin d'un baseline rapide sans tuning intensif",
        "Quand les données sont très déséquilibrées",
        "Quand tu veux maximiser la performance en compétition",
      ],
      answer:
        "Dataset propre (pas de NULL), petit (< 500 lignes), classification binaire simple, besoin d'un baseline rapide sans tuning intensif",
      explanation:
        "AdaBoost : simple à implémenter, peu de paramètres (n_estimators, learning_rate), stumps interprétables. XGBoost : supérieur en performance mais nécessite de l'imputation (pas de NULL nativement dans sklearn), plus de paramètres à tuner, risque d'overfitting sur petits datasets. AdaBoost reste un bon algo de baseline et un must pour comprendre le boosting.",
    },
    {
      question:
        "[Paramétrage XGBoost] Tu entraînes XGBoost avec n_estimators=1000 et val_score plafonne à l'epoch 234. Quelle est la bonne pratique ?",
      options: [
        "Garder tous les 1000 arbres — plus d'arbres améliore toujours",
        "Utiliser early_stopping_rounds=50 avec un eval_set — XGBoost s'arrête quand le val_score ne s'améliore plus et retourne le meilleur modèle",
        "Réduire n_estimators à 100 avant d'entraîner",
        "Augmenter le learning_rate pour accélérer la convergence",
      ],
      answer:
        "Utiliser early_stopping_rounds=50 avec un eval_set — XGBoost s'arrête quand le val_score ne s'améliore plus et retourne le meilleur modèle",
      explanation:
        "early_stopping_rounds=50 : si le val_score ne s'améliore pas pendant 50 rounds consécutifs, arrêt automatique. Le modèle retenu est celui à l'epoch avec le meilleur val_score (ici epoch 234). Configurer : xgb.fit(X_train, y_train, eval_set=[(X_val, y_val)], early_stopping_rounds=50). Sans ça, les 766 arbres supplémentaires overfittent.",
    },
    {
      question:
        "[Versus RF vs XGBoost] Ton dataset a 200 000 lignes, 50 features, 5% de valeurs manquantes. Tu as 4 heures pour le projet. Que choisir ?",
      options: [
        "Random Forest — toujours plus rapide à entraîner",
        "XGBoost avec gestion native des NULL — pas d'imputation nécessaire, meilleure performance, early stopping pour le timing",
        "AdaBoost — le plus simple à paramétrer",
        "Stacking — 4 heures sont suffisantes pour l'architecture complète",
      ],
      answer:
        "XGBoost avec gestion native des NULL — pas d'imputation nécessaire, meilleure performance, early stopping pour le timing",
      explanation:
        "5% de valeurs manquantes : XGBoost apprend la direction par défaut pour les NULL (imputation implicite). RF nécessite une imputation manuelle préalable. 200K lignes : XGBoost avec early stopping est gérable en 4h. Performance peak : XGBoost >> RF dans la majorité des benchmarks. Si 4h semblent courtes, LightGBM serait encore plus rapide.",
    },
    {
      question:
        "[Data leakage Stacking] Dans ton stacking, les modèles de niveau 0 sont entraînés sur X_train et prédisent sur X_train pour créer les features du méta-modèle. Quel est le problème ?",
      options: [
        "Aucun problème — les modèles voient le même dataset",
        "Data leakage — les modèles ont mémorisé X_train, leurs prédictions sur ce set sont quasi-parfaites → le méta-modèle apprend des signaux qui n'existent pas en production",
        "Le méta-modèle aura trop peu de features pour apprendre",
        "Le stacking nécessite que les modèles soient entraînés sur le test set",
      ],
      answer:
        "Data leakage — les modèles ont mémorisé X_train, leurs prédictions sur ce set sont quasi-parfaites → le méta-modèle apprend des signaux qui n'existent pas en production",
      explanation:
        "Un RF profond sur ses données d'entraînement prédit ~100% de précision. Ces prédictions parfaites ne reflètent pas ce qui se passe en production. Solution : out-of-fold predictions via K-Fold. Pour le fold k, les modèles sont entraînés sur les K-1 autres folds → prédisent sur le fold k (données non vues). Les prédictions honnêtes deviennent les features du méta-modèle.",
    },
    {
      question:
        "[Versus Soft vs Hard Vote] 3 modèles : LR=[0.92, 0.08], RF=[0.48, 0.52], SVM=[0.45, 0.55]. Quel est le résultat en Hard Vote vs Soft Vote ?",
      options: [
        "Hard Vote = classe 0 (1 contre 2), Soft Vote = classe 0 (0.617 vs 0.383)",
        "Hard Vote = classe 1 (2 contre 1), Soft Vote = classe 0 (0.617 vs 0.383)",
        "Hard Vote = classe 0 (2 contre 1), Soft Vote = classe 1 (0.617 vs 0.383)",
        "Hard Vote et Soft Vote donnent toujours le même résultat",
      ],
      answer:
        "Hard Vote = classe 1 (2 contre 1), Soft Vote = classe 0 (0.617 vs 0.383)",
      explanation:
        "Hard Vote : LR→0, RF→1, SVM→1 → 2 contre 1 → classe 1. Soft Vote : proba classe 0 = (0.92+0.48+0.45)/3 = 0.617 → classe 0 gagne. LR est très confiant à 0.92, RF et SVM sont hésitants (0.48/0.52 et 0.45/0.55). Soft Vote valorise la forte confiance de LR. C'est précisément pourquoi Soft Vote est généralement meilleur.",
    },
    {
      question:
        "[Paramétrage RF] Random Forest avec n_estimators=10 vs n_estimators=500 sur un dataset de 5000 exemples. Quelle différence en pratique ?",
      options: [
        "Aucune — 10 arbres suffisent pour la plupart des datasets",
        "RF-10 = instable (chaque run donne des résultats différents, variance élevée), RF-500 = stable, meilleure performance, rendements décroissants au-delà de ~200",
        "RF-500 overfitte toujours plus que RF-10",
        "La différence est uniquement dans le temps d'entraînement, pas dans la performance",
      ],
      answer:
        "RF-10 = instable (chaque run donne des résultats différents, variance élevée), RF-500 = stable, meilleure performance, rendements décroissants au-delà de ~200",
      explanation:
        "Avec 10 arbres, chaque arbre a un impact fort sur l'ensemble → variance élevée, résultats non-reproductibles. À partir de ~100-200 arbres, la performance se stabilise (loi des grands nombres). Les rendements deviennent marginaux après 300-500. Compromis pratique : n_estimators=200 avec n_jobs=-1 couvre 95% de la performance maximale de RF.",
    },
  ],
  avance: [
    {
      question:
        "[Versus profond] Un étudiant dit : 'XGBoost est un Random Forest qui booste'. Corriger cette confusion.",
      options: [
        "C'est correct — XGBoost est une amélioration de Random Forest",
        "RF = Bagging d'arbres décorrélés (bootstrap + max_features) → réduit la variance. XGBoost = Boosting par gradient descent (résidus séquentiels) → réduit biais et variance. Deux familles d'ensembles complètement différentes avec des mécanismes opposés",
        "La seule différence est la parallélisation",
        "XGBoost utilise la même technique que RF mais avec des arbres plus profonds",
      ],
      answer:
        "RF = Bagging d'arbres décorrélés (bootstrap + max_features) → réduit la variance. XGBoost = Boosting par gradient descent (résidus séquentiels) → réduit biais et variance. Deux familles d'ensembles complètement différentes avec des mécanismes opposés",
      explanation:
        "RF : N arbres indépendants sur bootstrap samples, décorrélés par max_features, agrégés par moyenne → réduit Var. XGB : arbre T prédit le gradient de la loss de l'ensemble T-1, ajouté au modèle cumulatif × learning_rate → réduit Biais+Var séquentiellement. Un arbre RF peut être supprimé sans affecter les autres. Un arbre XGB ne peut pas — il dépend de tous les précédents.",
    },
    {
      question:
        "[Analyse paramétrage XGBoost] Tu constates que XGBoost avec learning_rate=0.3 et n_estimators=100 underfitte légèrement. Deux stratégies : A) réduire learning_rate=0.01 et augmenter n_estimators=3000 avec early stopping. B) augmenter max_depth de 3 à 8. Quelle est la différence ?",
      options: [
        "Les deux stratégies sont équivalentes",
        "A = réduit le biais tout en maîtrisant la variance (shrinkage fort + early stopping évite l'overfit) mais plus lent. B = augmente la capacité d'un seul arbre, risque d'overfitting si max_depth=8 sans augmenter la régularisation",
        "B est toujours préférable — profondeur > nombre d'arbres",
        "A est toujours préférable — learning_rate faible est le paramètre le plus important",
      ],
      answer:
        "A = réduit le biais tout en maîtrisant la variance (shrinkage fort + early stopping évite l'overfit) mais plus lent. B = augmente la capacité d'un seul arbre, risque d'overfitting si max_depth=8 sans augmenter la régularisation",
      explanation:
        "Stratégie A : learning_rate faible + many trees = meilleure généralisation théorique (shrinkage theory), early stopping contrôle l'overfitting automatiquement. Recommandée en compétition. Stratégie B : max_depth=8 crée des interactions à 8 niveaux → très expressif mais peut overfitter. Utiliser avec subsample=0.8 + colsample=0.8 + lambda/alpha pour compenser. En pratique : tester les deux avec CV.",
    },
    {
      question:
        "[Stacking avancé] Ton stacking K-Fold (5 folds) avec 4 modèles de base prend 6 heures à entraîner. Comment optimiser sans sacrifier la rigueur ?",
      options: [
        "Réduire K à 2 folds — plus rapide et suffisamment rigoureux",
        "Blending (holdout 20%) au lieu de K-Fold : générer les meta-features en une seule passe sur le holdout — 5x plus rapide avec une légère perte de données pour le méta-modèle",
        "Supprimer les modèles lents — garder uniquement LR et arbre",
        "Paralléliser les 4 modèles sur 4 cœurs — réduction directe de 4x",
      ],
      answer:
        "Blending (holdout 20%) au lieu de K-Fold : générer les meta-features en une seule passe sur le holdout — 5x plus rapide avec une légère perte de données pour le méta-modèle",
      explanation:
        "Blending = entraîner les modèles de base sur 80% des données, prédire sur le holdout 20% → ces prédictions deviennent les features du méta-modèle. Avantage : 5x plus rapide que K-Fold (1 fit par modèle au lieu de K). Inconvénient : le méta-modèle n'est entraîné que sur 20% des données. Compromis acceptable en compétition où le temps compte. K-Fold reste préférable si les données permettent le temps.",
    },
    {
      question:
        "[Versus RF vs LightGBM] Tu dois classer entre RF, XGBoost, et LightGBM pour un dataset de 2M lignes, 100 features, 8 classes, temps d'entraînement < 30 minutes. Quel est l'ordre de préférence ?",
      options: [
        "RF > XGBoost > LightGBM — RF est plus parallèle",
        "LightGBM > XGBoost > RF — LightGBM est le plus rapide sur grands datasets, XGBoost est plus lent mais meilleur que RF en performance",
        "XGBoost > LightGBM > RF — XGBoost est toujours plus précis",
        "RF > LightGBM > XGBoost — RF gère mieux la multi-classification",
      ],
      answer:
        "LightGBM > XGBoost > RF — LightGBM est le plus rapide sur grands datasets, XGBoost est plus lent mais meilleur que RF en performance",
      explanation:
        "LightGBM : histogram-based splits O(n·bins) + leaf-wise growth = 5-10x plus rapide qu'XGBoost sur 2M lignes → respecte les 30 min. XGBoost : level-wise = plus lent mais souvent plus stable, peut dépasser 30 min sur 2M. RF : très parallèle mais performance peak généralement sous XGB/LGBM sur grandes données. Multi-classe : LightGBM gère efficacement avec num_class=8.",
    },
    {
      question:
        "[AdaBoost mécanisme] À l'itération t=3 d'AdaBoost, les exemples mal classés aux itérations 1 et 2 ont accumulé des poids très élevés. Un outlier est parmi eux. Quel est l'effet et comment y remédier ?",
      options: [
        "L'outlier est ignoré car AdaBoost filtre les anomalies",
        "L'outlier monopolise les poids → le stump t=3 s'optimise pour classer cet outlier → dégradation de la frontière globale → AdaBoost overfitte sur l'outlier. Remède : nettoyage des données avant AdaBoost ou utiliser XGBoost (plus robuste)",
        "AdaBoost avec des stumps est immunisé contre les outliers",
        "L'outlier est automatiquement neutralisé par le vote pondéré final",
      ],
      answer:
        "L'outlier monopolise les poids → le stump t=3 s'optimise pour classer cet outlier → dégradation de la frontière globale → AdaBoost overfitte sur l'outlier. Remède : nettoyage des données avant AdaBoost ou utiliser XGBoost (plus robuste)",
      explanation:
        "C'est la faiblesse principale d'AdaBoost. Un outlier impossible à classer correctement voit son poids augmenter exponentiellement. Les stumps suivants se concentrent dessus au détriment des vrais patterns. XGBoost est plus robuste car il utilise le gradient de la loss (dérivée bornée avec loss robuste comme Huber) plutôt qu'un repondération exponentielle.",
    },
    {
      question:
        "[Architecture Stacking] Tu construis un stacking pour une compétition Kaggle. Quels modèles de niveau 0 maximisent la diversité ?",
      options: [
        "5 XGBoost avec des hyperparamètres différents — le plus performant",
        "Régression Logistique (linéaire, calibrée) + Random Forest (non-linéaire, arbres) + XGBoost (boosting) + SVM (marge maximale) — paradigmes très différents → erreurs diversifiées",
        "3 Random Forests avec des n_estimators différents",
        "XGBoost + LightGBM + CatBoost — les 3 meilleurs boostings",
      ],
      answer:
        "Régression Logistique (linéaire, calibrée) + Random Forest (non-linéaire, arbres) + XGBoost (boosting) + SVM (marge maximale) — paradigmes très différents → erreurs diversifiées",
      explanation:
        "La diversité = algorithmes de natures différentes → ils se trompent sur des exemples différents → le méta-modèle peut compenser. 5 XGBoost = faible diversité (erreurs corrélées). XGB+LGBM+CatBoost = diversité modérée (tous des boostings). LR+RF+XGB+SVM = haute diversité (4 paradigmes : linéaire, bagging, boosting, marge) → stacking optimal.",
    },
    {
      question:
        "[Versus distillation] Ton stacking (5 modèles) atteint AUC=0.94 mais la latence de prédiction est de 200ms. Un seul XGBoost donne AUC=0.91 en 20ms. Comment récupérer de la performance tout en réduisant la latence ?",
      options: [
        "Augmenter les ressources serveur pour réduire la latence du stacking",
        "Distillation du modèle : entraîner un XGBoost ou LR simple sur les prédictions (soft labels) du stacking — l'élève apprend la 'connaissance' de l'ensemble et atteint AUC~0.93 en 20ms",
        "Réduire le nombre de modèles dans le stacking de 5 à 2",
        "Il n'existe pas de compromis — choisir entre AUC et latence",
      ],
      answer:
        "Distillation du modèle : entraîner un XGBoost ou LR simple sur les prédictions (soft labels) du stacking — l'élève apprend la 'connaissance' de l'ensemble et atteint AUC~0.93 en 20ms",
      explanation:
        "Knowledge distillation : le teacher (stacking AUC=0.94) génère des soft probas sur le dataset complet. L'élève (XGBoost) est entraîné non pas sur les labels bruts (0/1) mais sur ces soft probas → il apprend la structure fine du problème capturée par l'ensemble. Résultat typique : l'élève récupère 50-80% du gain de l'ensemble à 10% de son coût.",
    },
    {
      question:
        "[Paramétrage] Tu as un dataset très déséquilibré (1% positifs). Comment configurer XGBoost et Random Forest différemment pour gérer ce cas ?",
      options: [
        "Les deux algorithmes gèrent automatiquement le déséquilibre — aucune configuration spéciale",
        "XGBoost : scale_pos_weight = 99 (négatifs/positifs) + eval avec AUC-PR. RF : class_weight='balanced' (pondère chaque classe inversement à sa fréquence) + max_samples pour le bootstrap. Les deux : évaluer avec F1/AUC-PR, jamais avec l'accuracy",
        "Réduire n_estimators pour les deux — moins d'arbres = moins d'overfitting sur la majorité",
        "Utiliser threshold=0.01 au lieu de 0.5 pour les deux modèles",
      ],
      answer:
        "XGBoost : scale_pos_weight = 99 (négatifs/positifs) + eval avec AUC-PR. RF : class_weight='balanced' (pondère chaque classe inversement à sa fréquence) + max_samples pour le bootstrap. Les deux : évaluer avec F1/AUC-PR, jamais avec l'accuracy",
      explanation:
        "XGBoost scale_pos_weight=99 : pondère chaque positif comme 99 négatifs dans la fonction de loss → modèle plus sensible aux positifs. RF class_weight='balanced' : même principe mais dans les critères de split (Gini pondéré). Les deux peuvent être combinés avec SMOTE sur le train set. Évaluation : accuracy avec 1% de positifs = 99% en prédisant toujours négatif → useless.",
    },
  ],
  expert: [
    {
      question:
        "[Entretien senior] 'Décris la différence mathématique entre AdaBoost et Gradient Boosting.' Quelle est la réponse correcte ?",
      options: [
        "AdaBoost utilise des arbres, Gradient Boosting utilise des réseaux de neurones",
        "AdaBoost = forward stagewise additive modeling avec loss exponentielle + repondération des exemples. GB = forward stagewise additive modeling avec descente de gradient fonctionnelle sur n'importe quelle loss différentiable → GB est une généralisation d'AdaBoost",
        "Gradient Boosting est simplement AdaBoost avec plus d'arbres",
        "AdaBoost optimise l'AUC, Gradient Boosting optimise la MSE",
      ],
      answer:
        "AdaBoost = forward stagewise additive modeling avec loss exponentielle + repondération des exemples. GB = forward stagewise additive modeling avec descente de gradient fonctionnelle sur n'importe quelle loss différentiable → GB est une généralisation d'AdaBoost",
      explanation:
        "Friedman (2001) a montré que AdaBoost est un cas particulier de Gradient Boosting avec la loss exponentielle L(y, F) = exp(-yF(x)). GB remplace la dérivée de cette loss spécifique par le gradient de n'importe quelle loss. Cette généralisation permet : logloss (classification), MSE/MAE (régression), Huber (robuste aux outliers). AdaBoost = GB avec une loss spéciale non-robuste aux outliers.",
    },
    {
      question:
        "[Théorie] Prouve que l'erreur d'un ensemble de N classifieurs indépendants est toujours inférieure à l'erreur d'un seul classifieur (sous quelle condition ?)",
      options: [
        "C'est toujours vrai — plus d'estimateurs = toujours mieux",
        "Condition : chaque classifieur doit avoir une erreur individuelle p < 0.5 (mieux que le hasard) + être indépendant. Alors P(vote majoritaire erroné) = Σ C(N,k)·pᵏ·(1-p)^(N-k) pour k>N/2 → tend vers 0 quand N → ∞",
        "L'ensemble est toujours meilleur si N > 10",
        "Condition : les classifieurs doivent être identiques pour garantir la réduction d'erreur",
      ],
      answer:
        "Condition : chaque classifieur doit avoir une erreur individuelle p < 0.5 (mieux que le hasard) + être indépendant. Alors P(vote majoritaire erroné) = Σ C(N,k)·pᵏ·(1-p)^(N-k) pour k>N/2 → tend vers 0 quand N → ∞",
      explanation:
        "Théorème de Condorcet adapté au ML. Exemple p=0.4 (60% de précision) : P(vote erroné N=3) = C(3,2)·0.4²·0.6 + C(3,3)·0.4³ = 0.288 + 0.064 = 0.352 < 0.4. Si p=0.6 (> 0.5) : l'ensemble diverge. En pratique, les classifieurs ne sont pas indépendants (corrélés via les données d'entraînement) → le gain réel est partiel mais significatif.",
    },
    {
      question:
        "[Design système] Tu dois déployer un modèle ML en temps réel pour une banque avec : performance max (AUC > 0.92), latence < 10ms, interprétabilité par transaction (réglementation RGPD), et réentraînement quotidien. Quelle architecture ?",
      options: [
        "Stacking complet — meilleure performance",
        "XGBoost avec max_depth=4 (rapide en inférence) + SHAP values pour l'explication de chaque prédiction + pipeline de réentraînement quotidien automatisé + champion/challenger deployment",
        "Deep Neural Network — les plus performants pour la détection de fraude",
        "Random Forest — le plus interprétable",
      ],
      answer:
        "XGBoost avec max_depth=4 (rapide en inférence) + SHAP values pour l'explication de chaque prédiction + pipeline de réentraînement quotidien automatisé + champion/challenger deployment",
      explanation:
        "Contraintes : AUC>0.92 → XGBoost capable. Latence < 10ms → max_depth faible + n_estimators modéré (200-300). RGPD interprétabilité → SHAP TreeExplainer (rapide O(T·L·features), en ms par prédiction). Réentraînement quotidien → pipeline MLflow + validation automatique avant promotion. Stacking trop lent. DNN non-interprétable. RF atteint rarement AUC>0.92 sur fraude.",
    },
    {
      question:
        "[Versus théorique] Stacking vs Bayesian Model Averaging (BMA) : quelle est la différence conceptuelle dans la manière de combiner les modèles ?",
      options: [
        "BMA et Stacking sont identiques — seule la terminologie diffère",
        "Stacking = empirique, le méta-modèle APPREND les poids des modèles de base depuis les données. BMA = bayésien, pondère les modèles par leur probabilité a posteriori P(Mₖ|data) — optimal asymptotiquement mais intractable en pratique",
        "BMA utilise un réseau de neurones pour combiner, Stacking utilise une régression",
        "Stacking est plus rigoureux que BMA car il utilise la cross-validation",
      ],
      answer:
        "Stacking = empirique, le méta-modèle APPREND les poids des modèles de base depuis les données. BMA = bayésien, pondère les modèles par leur probabilité a posteriori P(Mₖ|data) — optimal asymptotiquement mais intractable en pratique",
      explanation:
        "BMA : P(y|x,data) = Σₖ P(y|x,Mₖ,data)·P(Mₖ|data). Le poids P(Mₖ|data) ∝ P(data|Mₖ)·P(Mₖ) — marginalise sur tous les paramètres possibles. Optimal bayésien mais calcul de P(data|Mₖ) = ∫P(data|θ,Mₖ)P(θ)dθ intractable. Stacking = approximation discriminative qui fonctionne en pratique. Pseudo-BMA+ via Pareto-smoothed importance sampling (PSIS) est un compromis moderne.",
    },
    {
      question:
        "[Cas de recherche] Quand Stacking sous-performe par rapport au meilleur modèle individuel, quelle est la cause la plus probable ?",
      options: [
        "Stacking est toujours supérieur au meilleur modèle individuel — impossible de sous-performer",
        "Faible diversité des modèles de base (erreurs corrélées → méta-modèle n'apprend rien de nouveau) OU data leakage dans la génération des meta-features OU méta-modèle trop complexe qui overfitte les prédictions OOF",
        "Le méta-modèle devrait être un deep learning pour être efficace",
        "Stacking nécessite au moins 10 000 exemples pour surperformer",
      ],
      answer:
        "Faible diversité des modèles de base (erreurs corrélées → méta-modèle n'apprend rien de nouveau) OU data leakage dans la génération des meta-features OU méta-modèle trop complexe qui overfitte les prédictions OOF",
      explanation:
        "Cause 1 : si RF, XGB et LGBM font les mêmes erreurs, le méta-modèle ne peut pas compenser → stacking ≈ moyenne. Solution : diversifier (LR + SVM + RF + XGB). Cause 2 : data leakage → méta-modèle apprend des patterns irréels → overfit sur train, chute sur test. Cause 3 : méta-modèle XGBoost deep overfitte sur les N prédictions OOF → utiliser LR ou XGB avec max_depth=2 pour le méta-modèle.",
    },
    {
      question:
        "[Optimisation avancée] Tu veux maximiser la performance d'un ensemble final sur Kaggle. Tu as 2 jours. Quelle est la stratégie optimale ?",
      options: [
        "Entraîner le plus grand XGBoost possible avec n_estimators=10000",
        "Jour 1 : entraîner 4-5 modèles très différents (LR, RF, XGB, LGBM, SVM) bien tunés individuellement. Jour 2 : stacking OOF avec méta-modèle LR, + Soft Vote Ensemble pour diversifier, comparer les deux sur le leaderboard public",
        "Utiliser uniquement LightGBM — le plus rapide et précis",
        "Deep Learning avec 2 jours — les réseaux convergent plus vite que les ensembles",
      ],
      answer:
        "Jour 1 : entraîner 4-5 modèles très différents (LR, RF, XGB, LGBM, SVM) bien tunés individuellement. Jour 2 : stacking OOF avec méta-modèle LR, + Soft Vote Ensemble pour diversifier, comparer les deux sur le leaderboard public",
      explanation:
        "Stratégie gagnante Kaggle : 1) modèles de base bien tunés individuellement (sans stacking, juste CV score). 2) Stacking OOF propre avec méta-LR (simple, évite l'overfitting des meta-features). 3) Soft Vote comme alternative moins risquée (pas de data leakage possible). 4) Soumettre les deux sur le leaderboard public → choisir. En 2 jours, SVM est souvent à exclure si le dataset est grand (lent).",
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
        ? <h3 className="success">🚀 Excellent ! Ensembles & Comparaisons maîtrisés.</h3>
        : <p className="fail">📚 Retravailler Bagging vs Boosting et les paramètres XGBoost — clés des entretiens ML.</p>
      }
    </div>
  );
};

const MLEnsemblesVersus = () => {
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

export default MLEnsemblesVersus;
