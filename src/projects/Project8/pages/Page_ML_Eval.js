// src/projects/ml/Page_ML_Eval.js
import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Évaluation complète des modèles ML — Métriques, Inconvénients & Corrections",
    answer:
      "◆ **Métriques de régression** : MSE, RMSE, MAE, R² — quand chaque métrique est trompeuse ◆ **Métriques de classification** : Accuracy, Precision, Recall, F1, AUC-ROC, AUC-PR — quel contexte impose quelle métrique ◆ **Matrice de confusion** : TP, TN, FP, FN — lire les 4 cases, calculer les métriques ◆ **Seuil de décision** : comment et pourquoi l'ajuster ◆ **Problèmes universels** : overfitting, underfitting, data leakage, biais de classe ◆ **Corrections** : early stopping, régularisation L1/L2, dropout, SMOTE, class_weight, pipeline sklearn ◆ **Inconvénients par famille** : linéaire, arbres, SVM, KNN, ensembles — et comment les corriger ◆ **Validation** : K-Fold, Stratified, TimeSeriesSplit — quand chaque méthode s'impose",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[Confusion Métriques] Ton modèle de détection de cancer atteint Accuracy=98% sur un dataset où 98% des patients sont sains. Que conclure ?",
      options: [
        "Le modèle est excellent — 98% d'accuracy est un résultat remarquable",
        "L'accuracy est inutile ici — un modèle qui prédit toujours 'sain' atteint 98% sans rien apprendre. Analyser Recall sur la classe 'cancer'",
        "Il faut augmenter le dataset pour avoir plus de cas positifs",
        "Le modèle souffre d'overfitting — réduire la complexité",
      ],
      answer:
        "L'accuracy est inutile ici — un modèle qui prédit toujours 'sain' atteint 98% sans rien apprendre. Analyser Recall sur la classe 'cancer'",
      explanation:
        "Classe déséquilibrée : 98% de négatifs → prédire toujours négatif = 98% d'accuracy. Ce modèle a Recall=0 sur la classe cancer (0 vrai positif détecté). Métriques utiles : Recall (ne pas manquer de malades), F1, AUC-PR (plus informative qu'AUC-ROC sur données très déséquilibrées). Correction : class_weight='balanced', SMOTE sur train, scale_pos_weight dans XGBoost.",
    },
    {
      question:
        "[Confusion FP vs FN] Dans un système d'alerte d'avalanche, un FN (avalanche manquée) est-il plus grave qu'un FP (fausse alerte) ? Quelle métrique optimiser ?",
      options: [
        "FP est plus grave — les fausses alertes coûtent cher en évacuations inutiles. Optimiser Precision",
        "FN est plus grave — une avalanche manquée = vies perdues. Optimiser Recall même si Precision baisse",
        "Les deux sont équivalents — optimiser F1-Score",
        "Ni Precision ni Recall — utiliser l'Accuracy",
      ],
      answer:
        "FN est plus grave — une avalanche manquée = vies perdues. Optimiser Recall même si Precision baisse",
      explanation:
        "FN = avalanche réelle non détectée = catastrophe. FP = fausse alerte = coût acceptable. Optimiser Recall = TP/(TP+FN). Abaisser le seuil de décision de 0.5 à 0.2-0.3 augmente Recall (plus d'alertes déclenchées) au prix d'une Precision plus faible. F-beta avec beta=5+ pour valoriser fortement le Recall. Même raisonnement pour la détection de maladies rares.",
    },
    {
      question:
        "[Confusion Recall vs Precision] Un filtre anti-spam a Precision=0.99 et Recall=0.60. Quel est le problème concret pour l'utilisateur ?",
      options: [
        "40% des spams arrivent quand même dans la boîte de réception (FN élevé) — Recall faible",
        "1% des emails légitimes sont classés spam (FP élevé) — Precision faible",
        "Le modèle est trop lent — améliorer le temps de prédiction",
        "Le seuil de décision doit être réduit pour augmenter la Precision",
      ],
      answer:
        "40% des spams arrivent quand même dans la boîte de réception (FN élevé) — Recall faible",
      explanation:
        "Recall=0.60 = 40% des vrais spams passent en boîte de réception (FN). Precision=0.99 = 1% des emails classés spam sont légitimes (FP acceptable). Pour un filtre spam, le FP est très coûteux (email important perdu) donc haute Precision est souhaitée. Mais Recall=0.60 reste insuffisant — 40% de spams visibles. Ajuster le seuil ou collecter plus d'exemples de spam.",
    },
    {
      question:
        "[Confusion Overfitting] train_loss=0.05, val_loss=0.48. Quel problème et quelle correction en priorité ?",
      options: [
        "Underfitting — le modèle est trop simple, augmenter la complexité",
        "Overfitting — le modèle mémorise le training set. Corrections : réduire la complexité, ajouter régularisation L1/L2, early stopping, dropout si réseau de neurones",
        "Data leakage — refaire le split train/val",
        "Biais de classe — utiliser class_weight='balanced'",
      ],
      answer:
        "Overfitting — le modèle mémorise le training set. Corrections : réduire la complexité, ajouter régularisation L1/L2, early stopping, dropout si réseau de neurones",
      explanation:
        "train_loss=0.05 << val_loss=0.48 = overfitting sévère. Le modèle apprend le bruit du training set. Corrections par priorité : 1) Réduire max_depth (arbres) ou n_layers (NN). 2) Régularisation L2 (Ridge) réduit les poids. 3) Early stopping : arrêter l'entraînement quand val_loss remonte. 4) Dropout (NN) : éteindre aléatoirement 20-50% des neurones à chaque step. 5) Plus de données.",
    },
    {
      question:
        "[Confusion Underfitting] train_accuracy=0.64, val_accuracy=0.63. Les deux sont faibles et proches. Quel problème ?",
      options: [
        "Overfitting — train et val sont trop proches",
        "Underfitting (haut biais) — le modèle est trop simple pour capturer les patterns. train≈val (faibles) = biais. Corrections : modèle plus complexe, plus de features, réduire la régularisation",
        "Le dataset est trop petit — collecter plus de données",
        "Le seuil de décision est mal calibré — ajuster à 0.3",
      ],
      answer:
        "Underfitting (haut biais) — le modèle est trop simple pour capturer les patterns. train≈val (faibles) = biais. Corrections : modèle plus complexe, plus de features, réduire la régularisation",
      explanation:
        "train ≈ val (tous les deux mauvais) = haut biais = underfitting. Le modèle n'a pas assez de capacité. Corrections : passer d'une régression logistique à un Random Forest, ajouter des features (interactions, polynomiales), réduire L1/L2, augmenter max_depth. Ajouter des données aide l'overfitting mais peu l'underfitting.",
    },
    {
      question:
        "[Confusion R²] Ton modèle de régression a R²=0.91 sur le training set et R²=0.34 sur le test set. Que conclure ?",
      options: [
        "Le modèle est excellent — R²=0.91 sur train confirme la qualité",
        "Overfitting sévère — R² élevé sur train et faible sur test. Le modèle mémorise les données d'entraînement",
        "R²=0.34 est excellent pour un problème de régression",
        "Il faut augmenter le learning rate pour améliorer les performances",
      ],
      answer:
        "Overfitting sévère — R² élevé sur train et faible sur test. Le modèle mémorise les données d'entraînement",
      explanation:
        "R²=0.91 (train) vs R²=0.34 (test) = overfitting massif. Le modèle explique 91% de la variance sur les données connues mais seulement 34% sur les nouvelles. Corrections : régularisation Ridge/Lasso, réduire la complexité du modèle, plus de données d'entraînement, cross-validation pour détecter l'overfitting plus tôt.",
    },
    {
      question:
        "[Confusion MSE vs MAE] Ton dataset de prix immobiliers contient des maisons à 5M€ (outliers). Quelle métrique de régression est plus robuste ?",
      options: [
        "MSE — pénalise fortement les grandes erreurs et est donc plus stricte",
        "MAE — ne pénalise pas quadratiquement les outliers, reste stable même avec des prix exceptionnels",
        "R² — indépendant des unités et des outliers",
        "RMSE — meilleure que MSE car dans les unités de y",
      ],
      answer:
        "MAE — ne pénalise pas quadratiquement les outliers, reste stable même avec des prix exceptionnels",
      explanation:
        "MSE = moyenne des (erreur)². Un prix à 5M€ au lieu de 1M€ → erreur=4M² → (4M)²=16M² = impact énorme sur la loss. MAE = moyenne des |erreur| → l'erreur 4M pèse linéairement. Sur des données avec outliers de prix : MAE est plus robuste. MSE est préférable quand les grandes erreurs sont particulièrement coûteuses (finance, médecine).",
    },
    {
      question:
        "[Confusion AUC-ROC vs AUC-PR] Dataset : 99% de transactions légitimes, 1% de fraudes. Quelle métrique choisir pour comparer deux modèles ?",
      options: [
        "AUC-ROC — c'est la métrique standard pour tous les classifieurs binaires",
        "AUC-PR — plus informative sur données très déséquilibrées car focus sur la classe minoritaire (fraude)",
        "Accuracy — plus intuitive pour les équipes métier",
        "F1-Score macro — équilibre toutes les classes",
      ],
      answer:
        "AUC-PR — plus informative sur données très déséquilibrées car focus sur la classe minoritaire (fraude)",
      explanation:
        "AUC-ROC sur données très déséquilibrées : le grand nombre de TN (transactions légitimes) gonfle le TPR/FPR → courbe ROC optimiste. AUC-PR mesure Precision vs Recall sur la classe positive uniquement → révèle la vraie capacité à détecter les fraudes. Un modèle naïf (tout légitime) a AUC-ROC≈0.5 mais AUC-PR≈0.01 → AUC-PR est plus honnête.",
    },
    {
      question:
        "[Confusion Early Stopping] A quoi sert early stopping et à quel problème répond-il exactement ?",
      options: [
        "Accélérer l'entraînement en limitant le nombre d'époques",
        "Stopper l'entraînement quand la val_loss commence à remonter — évite l'overfitting en restaurant le meilleur modèle vu pendant l'entraînement",
        "Éviter l'underfitting en arrêtant avant que le modèle soit trop simple",
        "Réduire la consommation mémoire pendant l'entraînement",
      ],
      answer:
        "Stopper l'entraînement quand la val_loss commence à remonter — évite l'overfitting en restaurant le meilleur modèle vu pendant l'entraînement",
      explanation:
        "Au fil de l'entraînement : train_loss baisse toujours, mais val_loss baisse puis remonte (overfitting). Early stopping surveille val_loss et arrête l'entraînement quand elle ne s'améliore plus depuis N epochs (patience=N). Le modèle retenu = celui avec la meilleure val_loss. Utilisé dans XGBoost (early_stopping_rounds), Keras (EarlyStopping callback), LightGBM.",
    },
    {
      question:
        "[Confusion SMOTE] À quoi sert SMOTE et quand l'appliquer dans le pipeline ?",
      options: [
        "SMOTE supprime les outliers du dataset",
        "SMOTE génère des exemples synthétiques de la classe minoritaire pour rééquilibrer — à appliquer UNIQUEMENT sur le training set, jamais sur le validation ou test set",
        "SMOTE normalise les features avant l'entraînement",
        "SMOTE est un algorithme de clustering pour identifier les classes",
      ],
      answer:
        "SMOTE génère des exemples synthétiques de la classe minoritaire pour rééquilibrer — à appliquer UNIQUEMENT sur le training set, jamais sur le validation ou test set",
      explanation:
        "SMOTE (Synthetic Minority Oversampling Technique) : pour chaque minoritaire, crée des points synthétiques sur les segments entre voisins. Augmente la représentation de la classe minoritaire. CRITIQUE : appliquer après le train/test split, uniquement sur X_train. Appliquer sur l'ensemble complet = data leakage (le val/test contiendrait des copies synthétiques des données d'entraînement).",
    },
    {
      question:
        "[Confusion Dropout] Qu'est-ce que le Dropout et quel problème corrige-t-il ?",
      options: [
        "Le Dropout supprime les features peu importantes avant l'entraînement",
        "Le Dropout éteint aléatoirement p% des neurones à chaque mini-batch pendant l'entraînement — force le réseau à ne pas dépendre de neurones spécifiques → réduit l'overfitting dans les réseaux de neurones",
        "Le Dropout accélère l'entraînement en réduisant le nombre de paramètres",
        "Le Dropout normalise les activations entre les couches (comme Batch Normalization)",
      ],
      answer:
        "Le Dropout éteint aléatoirement p% des neurones à chaque mini-batch pendant l'entraînement — force le réseau à ne pas dépendre de neurones spécifiques → réduit l'overfitting dans les réseaux de neurones",
      explanation:
        "Dropout(0.5) : à chaque batch, 50% des neurones sont mis à 0 aléatoirement. Cela force le réseau à apprendre des représentations redondantes et robustes — chaque neurone doit être utile seul. À l'inférence, le Dropout est désactivé (tous les neurones actifs). C'est une forme de régularisation spécifique aux réseaux de neurones — pour les arbres, utiliser max_depth ou min_samples.",
    },
    {
      question:
        "[Confusion Seuil] Ton classifieur prédit P(spam)=0.7 avec seuil=0.5. Si tu baisses le seuil à 0.3, qu'arrive-t-il à Precision et Recall ?",
      options: [
        "Precision augmente, Recall augmente — abaisser le seuil améliore tout",
        "Precision baisse (plus de FP), Recall augmente (moins de FN) — le modèle classe plus d'emails comme spam",
        "Precision augmente (moins de FP), Recall baisse (plus de FN)",
        "Ni Precision ni Recall ne change — le seuil n'affecte pas les métriques",
      ],
      answer:
        "Precision baisse (plus de FP), Recall augmente (moins de FN) — le modèle classe plus d'emails comme spam",
      explanation:
        "Abaisser le seuil → plus de cas classés positifs. Parmi eux, certains sont de vrais positifs (Recall ↑) mais aussi plus de faux positifs (Precision ↓). Courbe Precision-Recall : abaisser le seuil = se déplacer vers la droite sur la courbe (Recall ↑, Precision ↓). Pour le spam : seuil élevé (0.8) = Precision forte (peu d'emails légitimes perdus). Pour le cancer : seuil bas (0.2) = Recall fort (peu de malades manqués).",
    },
  ],
  avance: [
    {
      question:
        "[Confusion Inconvénients KNN] Tu déploies KNN pour un système de recommandation temps réel avec 1M d'utilisateurs et 200 features. Quels sont les 3 problèmes critiques et comment les corriger ?",
      options: [
        "KNN est parfait pour ce cas — pas de problème",
        "1) Malédiction de la dimensionnalité (200 features → distances non informatives) → réduire avec PCA/UMAP. 2) Prédiction lente O(n×d)=200M ops/requête → FAISS/ANN pour l'approximation. 3) Pas de modèle sauvegardable — toutes les données en mémoire → inadapté si dataset grandit",
        "KNN est trop simple — utiliser un réseau de neurones",
        "Le seul problème est la normalisation — StandardScaler résout tout",
      ],
      answer:
        "1) Malédiction de la dimensionnalité (200 features → distances non informatives) → réduire avec PCA/UMAP. 2) Prédiction lente O(n×d)=200M ops/requête → FAISS/ANN pour l'approximation. 3) Pas de modèle sauvegardable — toutes les données en mémoire → inadapté si dataset grandit",
      explanation:
        "KNN lazy learner = tout le dataset en mémoire à l'inférence. En 200 dimensions, dist(A,B)≈dist(A,C) pour tous B,C → K voisins sans sens. Solution complète : PCA (→50 dims) + FAISS IndexIVFFlat (approximate NN, 100x plus rapide) + mise à jour incrémentale. En production de recommandation : matrix factorization (SVD++) ou Transformer-based retrieval sont préférables.",
    },
    {
      question:
        "[Confusion Inconvénients SVM] SVM RBF sur 200K exemples prend 12h à entraîner et 3 secondes par prédiction. Quels inconvénients et corrections ?",
      options: [
        "SVM n'a pas d'inconvénients — il faut un meilleur serveur",
        "Entraînement O(n²-n³) : inacceptable sur 200K → LinearSVC ou SGDClassifier. Prédiction O(sv×d) où sv=support vectors : si sv élevé → modèle peu compressé. Corrections : LinearSVC (O(n)), Nystroem+LinearSVC (approx kernel), ou XGBoost qui scale mieux",
        "Le seul problème est le kernel RBF — passer à 'linear' résout tout",
        "Augmenter C pour réduire le nombre de support vectors et accélérer",
      ],
      answer:
        "Entraînement O(n²-n³) : inacceptable sur 200K → LinearSVC ou SGDClassifier. Prédiction O(sv×d) où sv=support vectors : si sv élevé → modèle peu compressé. Corrections : LinearSVC (O(n)), Nystroem+LinearSVC (approx kernel), ou XGBoost qui scale mieux",
      explanation:
        "SVM classique (sklearn SVC) utilise libsvm qui est O(n²) à O(n³) en mémoire et temps. Sur 200K : intractable. Alternatives : LinearSVC (liblinear, O(n)), SGDClassifier avec hinge loss (≈SVM linéaire stochastique, O(n)), Nystroem(gamma)+LinearSVC (approxime le kernel RBF à O(n)). Pour la prédiction : C élevé → plus de support vectors → plus lent. Réduire C ou utiliser LinearSVC.",
    },
    {
      question:
        "[Confusion Data Leakage] Tu normalises avec StandardScaler sur tout le dataset AVANT le train/test split, puis tu fais GridSearchCV. Quel est le problème et comment le corriger ?",
      options: [
        "Aucun problème — normaliser avant ou après est équivalent",
        "Double data leakage : le scaler voit les stats du test set + GridSearchCV sans Pipeline expose les stats du val fold au scaler. Correction : sklearn Pipeline(StandardScaler, model) + GridSearchCV avec ce pipeline",
        "Le seul problème est GridSearchCV — utiliser RandomizedSearchCV",
        "Il faut normaliser après le GridSearchCV, pas avant",
      ],
      answer:
        "Double data leakage : le scaler voit les stats du test set + GridSearchCV sans Pipeline expose les stats du val fold au scaler. Correction : sklearn Pipeline(StandardScaler, model) + GridSearchCV avec ce pipeline",
      explanation:
        "Leakage 1 : scaler.fit(X_complet) apprend la moyenne et std du test set → le modèle bénéficie d'information future. Leakage 2 : dans GridSearchCV, si le scaler est fitté sur tout X_train, il voit les folds de validation → scores optimistes. Correction : `pipe = Pipeline([('scaler', StandardScaler()), ('model', SVC())])`. GridSearchCV sur pipe : à chaque fold, scaler.fit(X_train_fold) uniquement.",
    },
    {
      question:
        "[Confusion Inconvénients Régression Logistique] Quels sont les 3 inconvénients majeurs de la régression logistique et leur correction ?",
      options: [
        "La régression logistique n'a pas d'inconvénients — c'est le meilleur modèle de base",
        "1) Frontière linéaire → underfitting si données non-linéaires → feature engineering (interactions, polynômes) ou changer de modèle. 2) Multicolinéarité → coefficients instables → L2 (Ridge). 3) Sensible aux features non normalisées → StandardScaler obligatoire",
        "Le seul inconvénient est la vitesse — lent sur grands datasets",
        "La régression logistique ne gère pas la multi-classification",
      ],
      answer:
        "1) Frontière linéaire → underfitting si données non-linéaires → feature engineering (interactions, polynômes) ou changer de modèle. 2) Multicolinéarité → coefficients instables → L2 (Ridge). 3) Sensible aux features non normalisées → StandardScaler obligatoire",
      explanation:
        "Frontière linéaire : si les classes ne sont pas séparables linéairement, la Log. Reg. atteint un plafond même avec plus de données. Fix : ajouter x²,x₁×x₂ comme features ou passer à RF/XGBoost. Multicolinéarité : si x₁≈x₂, les coefficients deviennent instables (peuvent changer de signe). Fix : L2 (C petit) ou PCA avant. Normalisation : sans StandardScaler, les gradients sont déséquilibrés → convergence lente ou coefficients mal calibrés.",
    },
    {
      question:
        "[Confusion Validation] Tu veux évaluer un modèle sur des données de ventes journalières (série temporelle). Tu utilises KFold(n_splits=5, shuffle=True). Quel est le problème ?",
      options: [
        "K=5 est insuffisant — utiliser K=10",
        "KFold avec shuffle sur données temporelles = leakage temporel — le modèle peut être entraîné sur des données futures pour prédire le passé. Utiliser TimeSeriesSplit qui respecte l'ordre chronologique",
        "shuffle=True améliore toujours la robustesse de l'évaluation",
        "KFold ne fonctionne pas sur les séries temporelles — utiliser LOO",
      ],
      answer:
        "KFold avec shuffle sur données temporelles = leakage temporel — le modèle peut être entraîné sur des données futures pour prédire le passé. Utiliser TimeSeriesSplit qui respecte l'ordre chronologique",
      explanation:
        "Séries temporelles : l'ordre est crucial. KFold shuffle mélange les dates → le fold de validation peut contenir des dates AVANT le fold d'entraînement → le modèle 'voit l'avenir'. TimeSeriesSplit : chaque fold test est toujours dans le futur par rapport au fold train. Fold 1 : train [jan-mar], test [avr]. Fold 2 : train [jan-avr], test [mai]. Etc.",
    },
    {
      question:
        "[Confusion Inconvénients Random Forest] Random Forest donne feature_importance=[0.45, 0.03, 0.42, 0.10] pour [revenue, color, age, zip_code]. Tu décides de supprimer 'color' et 'zip_code'. Quel problème potentiel ?",
      options: [
        "Aucun — les features avec faible importance peuvent toujours être supprimées",
        "Feature importance RF est biaisée vers les features continues à haute cardinalité (revenue, age) — 'color' et 'zip_code' peuvent avoir une vraie importance non capturée. Valider avec permutation importance ou SHAP avant de supprimer",
        "Il faut toujours garder toutes les features pour ne pas perdre d'information",
        "La feature importance RF est parfaitement fiable — supprimer color et zip_code est correct",
      ],
      answer:
        "Feature importance RF est biaisée vers les features continues à haute cardinalité (revenue, age) — 'color' et 'zip_code' peuvent avoir une vraie importance non capturée. Valider avec permutation importance ou SHAP avant de supprimer",
      explanation:
        "Mean Decrease Impurity (importance RF par défaut) : les features continues offrent plus d'opportunités de split → elles reçoivent plus d'importance artificiellement. 'zip_code' peut être très discriminant mais catégoriel → sous-estimé. Méthodes non-biaisées : Permutation Importance (dégrade la performance en permutant une feature), SHAP TreeExplainer (théorie des jeux, distribution équitable).",
    },
    {
      question:
        "[Confusion Inconvénients XGBoost] XGBoost avec n_estimators=1000, learning_rate=0.3, max_depth=10 donne train_AUC=0.99, val_AUC=0.71. Identifie les 3 hyperparamètres problématiques et leur correction.",
      options: [
        "n_estimators=1000 est le seul problème — réduire à 100",
        "learning_rate=0.3 trop élevé (arbres trop forts) + max_depth=10 trop profond (trop expressif) + n_estimators=1000 sans early stopping = triple overfitting. Corrections : lr=0.05, max_depth=4-6, early_stopping_rounds=50",
        "val_AUC=0.71 est acceptable — aucun problème",
        "Le seul problème est max_depth — réduire à 3 résout tout",
      ],
      answer:
        "learning_rate=0.3 trop élevé (arbres trop forts) + max_depth=10 trop profond (trop expressif) + n_estimators=1000 sans early stopping = triple overfitting. Corrections : lr=0.05, max_depth=4-6, early_stopping_rounds=50",
      explanation:
        "Learning_rate=0.3 + n_estimators=1000 = chaque arbre contribue fortement → surapprentissage rapide. max_depth=10 = arbres très profonds capturant le bruit. Correction : learning_rate=0.01-0.05 (shrinkage fort) + max_depth=4-6 + n_estimators=3000 + early_stopping_rounds=50 + subsample=0.8 + colsample_bytree=0.8. Paramétrage systématique : commencer par max_depth et learning_rate.",
    },
    {
      question:
        "[Confusion Stratified K-Fold] Sur un dataset de détection de tumeurs (3% positifs), tu utilises KFold standard au lieu de Stratified KFold. Quel est l'effet concret ?",
      options: [
        "Aucune différence — les deux méthodes sont équivalentes avec un grand dataset",
        "Certains folds peuvent avoir 0 ou 1 positif (3% de 200 = 6 positifs dans un fold) → évaluation instable, variance élevée entre les folds, scores non-représentatifs. Stratified maintient ~3% dans chaque fold",
        "KFold standard est plus rigoureux que Stratified sur les petits datasets",
        "Le seul effet est une légère différence de temps d'exécution",
      ],
      answer:
        "Certains folds peuvent avoir 0 ou 1 positif (3% de 200 = 6 positifs dans un fold) → évaluation instable, variance élevée entre les folds, scores non-représentatifs. Stratified maintient ~3% dans chaque fold",
      explanation:
        "Avec 1000 exemples et 3% de positifs = 30 positifs. KFold k=10 : chaque fold ~100 exemples, mais les 30 positifs peuvent se concentrer dans 2-3 folds → certains folds test ont 0 positifs → Recall indéfini ou biaisé. Stratified K-Fold garantit ~3 positifs par fold de 100. Toujours utiliser StratifiedKFold quand l'une des classes représente < 20% du dataset.",
    },
    {
      question:
        "[Confusion Inconvénients K-Means] K-Means sur un dataset de comportements clients donne 3 clusters dont 2 avec 95% des points. Score Silhouette=0.12. Quels sont les problèmes ?",
      options: [
        "K=3 est trop petit — augmenter à K=10",
        "1) Clusters déséquilibrés → K-Means force des clusters de taille similaire si mal initialisé. 2) Silhouette=0.12 ≈ pas de structure claire → les données ne se clusterisent peut-être pas naturellement. 3) K-Means sensible à l'initialisation → relancer avec k-means++ et n_init=20. Vérifier si DBSCAN ou GMM convient mieux",
        "K-Means est parfait — Silhouette de 0.12 est un bon score",
        "Le problème est la normalisation — StandardScaler avant K-Means résout tout",
      ],
      answer:
        "1) Clusters déséquilibrés → K-Means force des clusters de taille similaire si mal initialisé. 2) Silhouette=0.12 ≈ pas de structure claire → les données ne se clusterisent peut-être pas naturellement. 3) K-Means sensible à l'initialisation → relancer avec k-means++ et n_init=20. Vérifier si DBSCAN ou GMM convient mieux",
      explanation:
        "Silhouette ∈ [-1, 1]. Silhouette=0.12 ≈ clusters se chevauchant. Causes : K mal choisi, données sans structure naturelle, features mal normalisées. Actions : 1) Elbow + Silhouette pour K optimal. 2) StandardScaler avant K-Means. 3) k-means++ (initialisation intelligente) + n_init=20. 4) Visualiser avec PCA/t-SNE. 5) Si pas de structure → peut-être DBSCAN (clusters denses) ou GMM (distributions probabilistes).",
    },
    {
      question:
        "[Confusion Régularisation L1 vs L2] Tu as 500 features dont tu estimes que 450 sont inutiles. Quelle régularisation choisir et pourquoi L1 peut être problématique ?",
      options: [
        "L2 (Ridge) — annule les features inutiles plus efficacement",
        "L1 (Lasso) car il crée des solutions creuses (450 poids=0) mais risque d'éliminer des features corrélées utiles — vérifier avec CV. ElasticNet si certaines features utiles sont corrélées entre elles",
        "Pas de régularisation — 500 features sont insuffisantes pour overfitter",
        "L2 avec alpha très grand — équivalent à L1 pour la sélection de features",
      ],
      answer:
        "L1 (Lasso) car il crée des solutions creuses (450 poids=0) mais risque d'éliminer des features corrélées utiles — vérifier avec CV. ElasticNet si certaines features utiles sont corrélées entre elles",
      explanation:
        "L1 (Lasso) = sélection automatique de features via poids=0. Problème : si deux features utiles sont corrélées (x₁≈x₂), L1 en garde une et annule l'autre arbitrairement. ElasticNet = L1+L2 : L1 pour la sparsité, L2 pour gérer la multicolinéarité → garde les features corrélées groupées. Paramétrer : `ElasticNet(l1_ratio=0.9, alpha=0.01)` pour une forte sparsité avec gestion des corrélations.",
    },
    {
      question:
        "[Confusion Inconvénients Arbres de Décision] Decision Tree avec max_depth=None sur 1000 exemples. train_acc=1.00, val_acc=0.61. Quelle correction et pourquoi max_depth=None est dangereux ?",
      options: [
        "max_depth=None est la configuration recommandée — l'arbre s'optimise seul",
        "max_depth=None = arbre qui pousse jusqu'à 1 exemple par feuille = mémorisation parfaite. Corrections : max_depth=5-10 par CV, min_samples_leaf=5-20, ou passer directement à Random Forest",
        "Il faut augmenter le dataset — 1000 exemples est insuffisant pour un arbre",
        "Utiliser criterion='entropy' au lieu de 'gini' pour éviter l'overfitting",
      ],
      answer:
        "max_depth=None = arbre qui pousse jusqu'à 1 exemple par feuille = mémorisation parfaite. Corrections : max_depth=5-10 par CV, min_samples_leaf=5-20, ou passer directement à Random Forest",
      explanation:
        "max_depth=None : l'arbre pousse jusqu'à ce que chaque feuille ait un seul exemple → train_acc=1.00 garanti. 0 généralisation. Corrections : 1) Pruning : max_depth=5-10 (trouver par CV), min_samples_leaf=10 (au moins 10 exemples par feuille). 2) Post-pruning : ccp_alpha (minimal cost-complexity pruning) dans sklearn. 3) Meilleure solution : Random Forest avec 200 arbres — résout l'overfitting structurellement.",
    },
    {
      question:
        "[Confusion Courbe d'apprentissage] Ta learning curve montre : avec 100 exemples train_score=0.94/val_score=0.68, avec 10 000 exemples train_score=0.81/val_score=0.79. Que conclure ?",
      options: [
        "Avec 10 000 exemples le modèle underfitte — il faut plus de complexité",
        "Les courbes convergent avec plus de données : overfitting se résorbe. Avec 100 exemples : overfitting fort (gap=0.26). Avec 10K : convergence (gap=0.02). Plus de données = meilleure solution contre l'overfitting ici",
        "Le modèle est instable — le score train baisse avec plus de données, c'est anormal",
        "Il faut changer de modèle — la convergence est trop lente",
      ],
      answer:
        "Les courbes convergent avec plus de données : overfitting se résorbe. Avec 100 exemples : overfitting fort (gap=0.26). Avec 10K : convergence (gap=0.02). Plus de données = meilleure solution contre l'overfitting ici",
      explanation:
        "Train_score qui baisse = normal (plus de données → le modèle ne peut plus mémoriser). Val_score qui monte = généralisation qui s'améliore. Gap qui se réduit = overfitting qui se résorbe. Conclusions : 1) Collecte de données est bénéfique ici. 2) Avec 100 exemples, la régularisation ou la réduction de complexité aident. 3) Si les courbes convergent toujours avec un gap élevé = underfitting → modèle plus complexe.",
    },
  ],
  expert: [
    {
      question:
        "[Confusion Entretien] Un recruteur demande : 'Comment diagnostiques-tu et corriges-tu l'overfitting vs l'underfitting ?' Quelle réponse est la plus complète ?",
      options: [
        "Overfitting = réduire les données, underfitting = augmenter les données",
        "Diagnostic par learning curve : train>>val = overfitting (haute variance), train≈val faibles = underfitting (haut biais). Overfitting : régularisation L1/L2, dropout, early stopping, réduction max_depth, plus de données. Underfitting : modèle plus complexe, plus de features, réduire régularisation",
        "Les deux se corrigent avec plus de données et un meilleur modèle",
        "Overfitting = augmenter le learning rate, underfitting = réduire le learning rate",
      ],
      answer:
        "Diagnostic par learning curve : train>>val = overfitting (haute variance), train≈val faibles = underfitting (haut biais). Overfitting : régularisation L1/L2, dropout, early stopping, réduction max_depth, plus de données. Underfitting : modèle plus complexe, plus de features, réduire régularisation",
      explanation:
        "Méthode rigoureuse : 1) Tracer la learning curve (score vs taille du dataset). 2) train>>val → overfitting → Bagging (RF), régularisation, early stopping, dropout (NN), sous-échantillonner la complexité. 3) train≈val(bas) → underfitting → Boosting, features polynomiales, réduire lambda. La distinction biais/variance est la base de tout diagnostic ML — savoir l'articuler clairement est attendu en entretien senior.",
    },
    {
      question:
        "[Confusion Métriques Avancé] Tu présentes un modèle de détection de fraude à ton directeur avec AUC-ROC=0.94. Il demande : 'À quel seuil de décision le déploies-tu et pourquoi ?' Quelle est la bonne réponse ?",
      options: [
        "Seuil=0.5 — c'est le standard",
        "Le seuil n'est pas déterminé par l'AUC-ROC mais par l'analyse coût-bénéfice métier : coût d'un FN (fraude manquée en €) vs coût d'un FP (investigation inutile en €). Tracer la courbe Precision-Recall et choisir le seuil qui maximise l'utilité attendue",
        "Seuil=0.9 — pour maximiser la Precision en production",
        "Seuil=0.1 — pour maximiser le Recall et ne manquer aucune fraude",
      ],
      answer:
        "Le seuil n'est pas déterminé par l'AUC-ROC mais par l'analyse coût-bénéfice métier : coût d'un FN (fraude manquée en €) vs coût d'un FP (investigation inutile en €). Tracer la courbe Precision-Recall et choisir le seuil qui maximise l'utilité attendue",
      explanation:
        "AUC-ROC est une métrique de comparaison de modèles, indépendante du seuil. Le seuil optimal : U(seuil) = TP × gain_détection_fraude - FP × coût_investigation. Si fraude_moyenne=500€ et coût_investigation=10€ : seuil très bas (chercher Recall). Si fraude_rare et investigation coûteuse : seuil plus élevé. `precision_recall_curve()` + `f1_score(threshold)` en sklearn pour visualiser le compromis.",
    },
    {
      question:
        "[Confusion Inconvénients Stacking] Ton stacking atteint val_AUC=0.96 mais test_AUC=0.78. Qu'est-il probablement arrivé ?",
      options: [
        "Le test set est de mauvaise qualité — ignorer ce résultat",
        "Data leakage dans le stacking : les modèles de base ont été entraînés sur le train set et prédisent sur ce même set pour le méta-modèle → prédictions quasi-parfaites → val_AUC gonflée. Sur le test set (jamais vu), le stacking révèle ses vraies performances",
        "Le stacking souffre d'underfitting — le méta-modèle est trop simple",
        "L'écart est normal pour le stacking — il faut toujours privilégier le val_AUC",
      ],
      answer:
        "Data leakage dans le stacking : les modèles de base ont été entraînés sur le train set et prédisent sur ce même set pour le méta-modèle → prédictions quasi-parfaites → val_AUC gonflée. Sur le test set (jamais vu), le stacking révèle ses vraies performances",
      explanation:
        "Leakage classique du stacking sans out-of-fold. RF sur ses données d'entraînement prédit ~1.00 → méta-modèle apprend à faire confiance à ces scores parfaits → artificiellement élevé sur val (même leakage). Sur test (propre), les scores sont réalistes (0.78). Correction : out-of-fold predictions. Pour chaque fold k, entraîner les modèles de base sur les K-1 autres folds, prédire sur le fold k → méta-features honnêtes.",
    },
    {
      question:
        "[Confusion Théorie Biais-Variance] Explique mathématiquement pourquoi augmenter n_estimators dans Random Forest réduit la variance mais pas le biais.",
      options: [
        "Plus d'arbres = modèle plus complexe → réduit les deux",
        "E[(ȳ-y)²] = Biais² + Var. Biais = E[ȳ]-y dépend de la structure de chaque arbre (inchangée). Var(ȳ) = Var(Σhₜ/N) = [ρσ² + (1-ρ)σ²/N] → réduit avec N via le terme σ²/N. Biais inchangé car chaque arbre individuel a le même biais",
        "n_estimators réduit les deux — le biais baisse car les arbres se corrigent mutuellement",
        "La variance ne peut pas être réduite par l'ajout d'arbres",
      ],
      answer:
        "E[(ȳ-y)²] = Biais² + Var. Biais = E[ȳ]-y dépend de la structure de chaque arbre (inchangée). Var(ȳ) = Var(Σhₜ/N) = [ρσ² + (1-ρ)σ²/N] → réduit avec N via le terme σ²/N. Biais inchangé car chaque arbre individuel a le même biais",
      explanation:
        "Décomposition biais-variance : MSE = Biais² + Variance + Bruit irréductible. Biais = erreur systématique liée aux hypothèses du modèle → dépend de max_depth, max_features de chaque arbre → N arbres identiques ont le même biais systématique. Variance = ρσ² (arbres corrélés) + (1-ρ)σ²/N (terme qui diminue). ρ = corrélation entre arbres réduite par bootstrap et max_features aléatoire. Donc N↑ → variance↓ via σ²/N, biais inchangé.",
    },
    {
      question:
        "[Confusion Calibration] Ton modèle prédit P(fraude)=0.87 pour une transaction. Le client conteste. Quelle différence entre un score de décision brut et une probabilité calibrée ?",
      options: [
        "Il n'y a pas de différence — tout score entre 0 et 1 est une probabilité",
        "Score brut = valeur de décision non-calibrée (SVM : distance à l'hyperplan, RF : % arbres en accord). Probabilité calibrée = reflète la vraie fréquence observée. Calibrer avec CalibratedClassifierCV (Platt scaling ou isotonic regression) pour interpréter comme une vraie probabilité",
        "Une probabilité calibrée est toujours plus élevée qu'un score brut",
        "La calibration n'est nécessaire que pour la régression, pas la classification",
      ],
      answer:
        "Score brut = valeur de décision non-calibrée (SVM : distance à l'hyperplan, RF : % arbres en accord). Probabilité calibrée = reflète la vraie fréquence observée. Calibrer avec CalibratedClassifierCV (Platt scaling ou isotonic regression) pour interpréter comme une vraie probabilité",
      explanation:
        "RF.predict_proba() = fraction d'arbres qui votent positif → pas une vraie probabilité. Si RF prédit 0.87 mais seulement 60% des transactions avec ce score sont des fraudes → mal calibré. Reliability curve (calibration curve) : comparer les prédictions moyennes vs la fréquence réelle. Fix : CalibratedClassifierCV(rf, method='isotonic', cv=5) → after calibration, P(fraude)=0.87 signifie vraiment ~87% de chance de fraude.",
    },
    {
      question:
        "[Confusion Cas réel] Pour un système de notation de crédit (banque), les régulateurs exigent : interprétabilité de chaque décision, détection de discrimination par tranche d'âge, et AUC > 0.80. Quelle architecture ML ?",
      options: [
        "Deep Learning — la meilleure performance garantit l'approbation réglementaire",
        "Régression Logistique + L1 (coefficients interprétables, RGPD-compatible) + analyse des coefficients par sous-groupe (fairness ML) + SHAP pour chaque décision individuelle + monitoring AUC en production",
        "Random Forest — feature importance répond à l'exigence d'interprétabilité",
        "XGBoost — SHAP suffisant pour satisfaire tous les régulateurs",
      ],
      answer:
        "Régression Logistique + L1 (coefficients interprétables, RGPD-compatible) + analyse des coefficients par sous-groupe (fairness ML) + SHAP pour chaque décision individuelle + monitoring AUC en production",
      explanation:
        "Contraintes réglementaires bancaires (Bâle III, RGPD Art. 22) : interprétabilité causale (pas seulement corrélation). Régression logistique : coefficients β = effet log-odds de chaque variable → interprétable légalement. Fairness : tester que P(refus|âge>60) ≈ P(refus|âge<30) à score équivalent (demographic parity ou equalized odds). SHAP TreeExplainer pour RF/XGB n'est pas toujours accepté par les régulateurs qui préfèrent les modèles intrinsèquement linéaires.",
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
        ? <h3 className="success">🚀 Excellent ! Évaluation & inconvénients ML maîtrisés.</h3>
        : <p className="fail">📚 Retravailler les métriques selon le contexte et les corrections d'overfitting — cœur des entretiens.</p>
      }
    </div>
  );
};

const MLEvaluationInconvenients = () => {
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

export default MLEvaluationInconvenients;
