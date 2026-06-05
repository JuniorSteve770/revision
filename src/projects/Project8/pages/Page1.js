// src/projects/BackendInterview/MLComparaisonsSupervise.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — Comparaisons & Choix de modèles ML",
    answer:
      "◆ **Bloc 1** : Supervisé vs Non-supervisé — quand utiliser quoi ◆ **Bloc 2** : Régression vs Classification — différences fondamentales, algorithmes clés ◆ **Bloc 3** : Régression Linéaire vs Régression Logistique — le versus le plus piégeux ◆ **Bloc 4** : Decision Tree vs Linear Regression — interprétabilité vs linéarité ◆ **Bloc 5** : SVM vs Régression Logistique — frontière linéaire ou non, contexte d'usage ◆ **Bloc 6** : KNN vs SVM vs Arbre — 3 paradigmes, 3 cas d'usage ◆ **Bloc 7** : K-Means vs DBSCAN — clustering partitionnel vs densité ◆ **Bloc 8** : PCA vs LDA — réduction de dimension sans vs avec labels",
  },
  {
    question: "Supervisé vs Non-supervisé — Le choix fondamental",
    answer:
      "◆ **Supervisé** : tu as des labels y — objectif = apprendre f(X)→y — Régression, Classification ◆ **Non-supervisé** : pas de labels — objectif = trouver une structure dans X — Clustering, Réduction de dimension ◆ **Semi-supervisé** : peu de labels + beaucoup de données non étiquetées — Self-training, Label Propagation ◆ **Quand supervisé** : prédire un prix, classifier un email, détecter une fraude ◆ **Quand non-supervisé** : segmenter des clients, compresser des données, détecter des anomalies ◆ **Piège** : ne pas avoir de labels ne signifie pas que le non-supervisé est automatiquement la solution — parfois labelliser quelques exemples est plus rentable ⚠️ Clustering non-supervisé ne garantit pas des groupes métier cohérents — toujours valider avec des experts",
  },
  {
    question: "Régression vs Classification — Différences fondamentales",
    answer:
      "◆ **Régression** : sortie continue — prédire un nombre (prix, température, score) ◆ **Classification** : sortie discrète — prédire une catégorie (spam/ham, malade/sain, A/B/C) ◆ **Métriques Régression** : MSE, RMSE, MAE, R² — mesurent l'erreur en unités de y ◆ **Métriques Classification** : Accuracy, Precision, Recall, F1, AUC — mesurent la qualité des décisions ◆ **Même algorithme, deux modes** : Decision Tree fait régression (MSE) ou classification (Gini), SVM fait régression (SVR) ou classification (SVC) ◆ **Régression → Classification** : seuiller la sortie (ex: proba > 0.5 = positif) ◆ **Classification → Rang** : utiliser les probabilités au lieu des classes brutes ⚠️ Prédire des probabilités (classification calibrée) est souvent plus utile que des classes binaires",
  },
  {
    question: "Régression Linéaire vs Régression Logistique — Le versus piégeux",
    answer:
      "◆ **Malgré le nom** : Logistique est un classifieur, pas un modèle de régression ◆ **Sortie Lin.** : valeur réelle ℝ — ex: 45 000€ (prix d'une maison) ◆ **Sortie Log.** : probabilité [0,1] via sigmoid — ex: 0.87 (proba d'être spam) ◆ **Loss Lin.** : MSE — pénalise les erreurs quadratiquement ◆ **Loss Log.** : Binary Cross-Entropy — pénalise les probabilités mal calibrées ◆ **Frontière** : Lin. = aucune (valeur continue) / Log. = hyperplan linéaire ◆ **Quand utiliser Lin.** : prédire un prix, une durée, un score numérique ◆ **Quand utiliser Log.** : probabilité d'appartenir à une classe binaire ou multi-classes ⚠️ Utiliser la régression linéaire pour une sortie 0/1 peut donner des probabilités < 0 ou > 1 — toujours utiliser la logistique pour la classification",
  },
  {
    question: "Decision Tree vs Linear Regression — Interprétabilité vs Linéarité",
    answer:
      "◆ **Relation entre X et y** : Lin. suppose une relation linéaire stricte / Arbre partitionne l'espace sans hypothèse ◆ **Interprétabilité** : Lin. = coefficients interprétables (β₁ = effet de x₁ toutes choses égales) / Arbre = règles SI/ALORS lisibles ◆ **Overfitting** : Lin. résiste naturellement / Arbre profond overfitte facilement (contrôler max_depth) ◆ **Relations non-linéaires** : Lin. rate (unless feature engineering) / Arbre capte automatiquement ◆ **Outliers** : Lin. très sensible / Arbre plus robuste ◆ **Données tabulaires mixtes** : Arbre gère nativement les features catégorielles / Lin. nécessite encodage ◆ **Interactions** : Lin. nécessite des termes explicites x₁×x₂ / Arbre les capte implicitement ⚠️ Un arbre unique deep = overfitting ; une régression linéaire sur données non-linéaires = underfitting — dans les deux cas, envisager un ensemble",
  },
  {
    question: "SVM vs Régression Logistique — Quand choisir ?",
    answer:
      "◆ **Frontière de décision** : les deux sont linéaires par défaut — SVM avec kernel RBF devient non-linéaire ◆ **Objectif SVM** : maximiser la marge entre classes — focus sur les points frontière (support vectors) ◆ **Objectif Log.** : maximiser la vraisemblance — focus sur la distribution globale des probabilités ◆ **SVM gagne** : petits datasets, haute dimension (texte, ADN), données non-linéaires avec kernel ◆ **Log. gagne** : besoin de probabilités calibrées, grands datasets, interprétabilité des coefficients ◆ **Temps d'entraînement** : Log. O(n·p) rapide / SVM O(n²) à O(n³) lent sur grands n ◆ **Régularisation** : Log. C ou lambda / SVM paramètre C (même sémantique) ⚠️ SVM sans normalisation des features = résultats arbitraires — StandardScaler obligatoire",
  },
  {
    question: "KNN vs SVM vs Arbre de Décision — 3 Paradigmes",
    answer:
      "◆ **KNN** : mémoire, pas de modèle — classe selon les K voisins les plus proches — lazy learner ◆ **SVM** : modèle de frontière — trouve l'hyperplan de marge maximale — eager learner ◆ **Arbre** : modèle de règles — partitionne récursivement selon Gini/MSE — eager learner ◆ **KNN quand** : peu de données, prototypage rapide, données localement structurées ◆ **SVM quand** : peu de données mais haute dimension, séparation nette entre classes ◆ **Arbre quand** : interprétabilité requise, features mixtes, interactions complexes ◆ **Prédiction KNN** : O(n·d) lent / **SVM** : O(sv·d) rapide / **Arbre** : O(depth) très rapide ⚠️ KNN souffre de la malédiction de la dimensionnalité — inutilisable au-delà de ~20 features sans réduction",
  },
  {
    question: "K-Means vs DBSCAN — Clustering : Partitionnel vs Densité",
    answer:
      "◆ **K-Means** : partitionne en K clusters sphériques en minimisant l'inertie intra-cluster ◆ **K-Means algo** : init K centroïdes → assigner chaque point au centroïde le plus proche → recalculer centroïdes → répéter ◆ **DBSCAN** : groupe les points denses, identifie les outliers comme bruit — pas besoin de K ◆ **DBSCAN params** : eps (rayon de voisinage) + min_samples (points minimum pour un core point) ◆ **K-Means gagne** : clusters sphériques et compacts de taille similaire, K connu ◆ **DBSCAN gagne** : clusters de forme arbitraire, outliers présents, K inconnu ◆ **K-Means limite** : sensible aux outliers, doit choisir K (Elbow method ou Silhouette score) ◆ **DBSCAN limite** : difficile à paramétrer eps/min_samples, mauvais sur clusters de densités très différentes ⚠️ K-Means avec des clusters non-sphériques (croissants, spirales) = résultats absurdes — utiliser DBSCAN ou GMM",
  },
  {
    question: "PCA vs LDA — Réduction de dimension : Non-supervisée vs Supervisée",
    answer:
      "◆ **PCA (Principal Component Analysis)** : non-supervisé — trouve les directions de variance maximale dans X ◆ **LDA (Linear Discriminant Analysis)** : supervisé — maximise la séparabilité entre classes (variance inter-classes / variance intra-classes) ◆ **PCA sortie** : composantes principales orthogonales, sans connaissance des labels ◆ **LDA sortie** : au maximum C-1 composantes (C = nombre de classes) — directement optimisé pour la classification ◆ **PCA quand** : compression, visualisation, débruitage, pas de labels disponibles ◆ **LDA quand** : avant un classifieur, labels disponibles, maximiser la discrimination ◆ **Hypothèse LDA** : distribution gaussienne par classe, matrices de covariance égales — violer ces hypothèses dégrade LDA ⚠️ PCA peut éliminer des composantes avec peu de variance mais très discriminantes pour la classification — toujours comparer PCA et LDA avant de choisir",
  },
  {
    question: "Choisir un algo supervisé — La grille de décision",
    answer:
      "◆ **Peu de données (<1000)** : Régression logistique, SVM, KNN — pas de deep learning ◆ **Beaucoup de données (>100K)** : LightGBM, XGBoost, réseaux de neurones ◆ **Interprétabilité requise** : Régression logistique (coefficients), Arbre de décision (règles) ◆ **Données non-linéaires** : Random Forest, XGBoost, SVM RBF ◆ **Features textuelles** : SVM linéaire, régression logistique (TF-IDF) — efficaces en haute dimension ◆ **Latence prédiction faible** : Arbre seul (O(depth)), régression logistique (O(p)) ◆ **Données déséquilibrées** : XGBoost avec scale_pos_weight, ou SMOTE + n'importe quel modèle ⚠️ Toujours commencer par un modèle simple (régression logistique) comme baseline — si ça suffit en prod, inutile d'ajouter de la complexité",
  },
  {
    question: "Choisir un algo non-supervisé — La grille de décision",
    answer:
      "◆ **Clustering, clusters sphériques** : K-Means — rapide, scalable, besoin de K ◆ **Clustering, forme arbitraire** : DBSCAN — robuste aux outliers, paramétrage difficile ◆ **Clustering, distribution de probabilité** : GMM (Gaussian Mixture Models) — sorties probabilistes ◆ **Réduction de dim., pas de labels** : PCA — standard, très rapide, interprétable ◆ **Réduction de dim., visualisation** : t-SNE (2D/3D) ou UMAP — non-linéaires, pour l'exploration ◆ **Réduction de dim., avant classification** : LDA si labels disponibles, PCA sinon ◆ **Détection d'anomalies** : Isolation Forest, One-Class SVM, Autoencoder ⚠️ t-SNE et UMAP ne préservent pas les distances globales — uniquement pour la visualisation, jamais pour la classification directe",
  },
  {
    question: "Paramétrage des modèles — Les hyperparamètres qui comptent vraiment",
    answer:
      "◆ **Régression Log.** : C (inverse de régularisation) — petit C = forte régularisation / solver ('lbfgs', 'saga' pour grandes données) ◆ **SVM** : C (marge), kernel ('rbf' > 'linear' si non-linéaire), gamma (RBF bandwidth) ◆ **Arbre** : max_depth (3-8 en prod), min_samples_split, criterion ('gini' vs 'entropy' — souvent identique) ◆ **KNN** : n_neighbors K (5-20 typiquement), metric ('euclidean', 'manhattan') ◆ **K-Means** : n_clusters K (Elbow method), init ('k-means++' >> 'random'), n_init=10 ◆ **DBSCAN** : eps (kdistance graph), min_samples (= 2×dimensions règle empirique) ◆ **PCA** : n_components (% de variance expliquée visée, ex: 0.95) ⚠️ Tuner max_depth d'un arbre et C d'un SVM sans cross-validation = hyperparamètre overfit sur le validation set",
  },
  {
    question: "Anti-patterns courants — Les erreurs de choix de modèle",
    answer:
      "◆ **Deep Learning par défaut** : réseau de neurones sur 500 lignes de données tabulaires = overfitting massif — commencer par XGBoost ◆ **K-Means sur données non-sphériques** : clusters en forme de croissants ou spirales = résultats incohérents — utiliser DBSCAN ◆ **PCA avant LDA** : réduire la dimension avec PCA puis classifier avec LDA perd de l'information discriminante — LDA directement si labels disponibles ◆ **Régression linéaire pour classification** : prédire 0/1 avec MSE peut donner des probabilités négatives — toujours logistique ◆ **KNN sans normalisation** : features en €€€ dominent les features en % — StandardScaler obligatoire ◆ **Ignorer le temps de prédiction** : Random Forest à 500 arbres = acceptable en batch, inacceptable en temps réel ⚠️ Le vrai anti-pattern : choisir un modèle sans comprendre ses hypothèses et ses limites",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[Versus] Tu dois prédire le prix de vente d'un appartement en euros. Quel type de problème est-ce et quel modèle de base utiliser ?",
      options: [
        "Classification → Régression Logistique",
        "Régression → Régression Linéaire comme baseline",
        "Clustering → K-Means pour grouper les appartements similaires",
        "Réduction de dimension → PCA pour compresser les features",
      ],
      answer: "Régression → Régression Linéaire comme baseline",
      explanation:
        "Le prix est une valeur continue → problème de régression. La régression linéaire est le baseline naturel : rapide, interprétable, coefficients montrent l'effet de chaque feature. Si les relations sont non-linéaires, passer à XGBoost ou Random Forest. Jamais logistique pour une sortie continue.",
    },
    {
      question:
        "[Versus] Régression Logistique vs Decision Tree pour classifier des emails en spam/non-spam. Quelle différence fondamentale ?",
      options: [
        "La régression logistique est plus lente que le Decision Tree",
        "La Log. suppose une frontière linéaire entre classes ; le Decision Tree crée des partitions non-linéaires en cascade — Log. plus robuste sur hautes dimensions (TF-IDF), Arbre plus expressif sur données tabulaires mixtes",
        "Le Decision Tree ne peut pas faire de la classification binaire",
        "La régression logistique ne donne pas de probabilités",
      ],
      answer:
        "La Log. suppose une frontière linéaire entre classes ; le Decision Tree crée des partitions non-linéaires en cascade — Log. plus robuste sur hautes dimensions (TF-IDF), Arbre plus expressif sur données tabulaires mixtes",
      explanation:
        "Pour le spam avec TF-IDF (milliers de features) : régression logistique est souvent le meilleur choix — linéaire, rapide, régularisable. Le Decision Tree peut capturer des interactions entre mots mais overfitte sur hautes dimensions sans contrainte max_depth. Les deux sont valides — mais Log. est le standard pour la classification de texte.",
    },
    {
      question:
        "[Versus] K-Means vs DBSCAN pour segmenter des clients. Tes données contiennent des outliers (clients très atypiques) et les clusters n'ont pas une forme sphérique. Que choisir ?",
      options: [
        "K-Means — plus simple à interpréter et paramétrer",
        "DBSCAN — gère les formes arbitraires et identifie les outliers comme bruit (label -1)",
        "Les deux donnent le même résultat sur des données clients",
        "K-Means avec K=1 pour éviter les outliers",
      ],
      answer:
        "DBSCAN — gère les formes arbitraires et identifie les outliers comme bruit (label -1)",
      explanation:
        "K-Means force chaque point dans un cluster, y compris les outliers qui faussent les centroïdes. Il suppose des clusters sphériques. DBSCAN groupe les zones denses, ignore les points isolés (outliers = label -1), et gère les formes non-sphériques. Paramétrer eps avec la courbe kDistance (coude = bon eps).",
    },
    {
      question:
        "[Versus] PCA vs LDA pour réduire la dimension avant de classifier des images de chiffres (0-9). Tu as les labels disponibles. Que choisir ?",
      options: [
        "PCA — toujours préférable car non-supervisé",
        "LDA — supervisé, maximise la séparabilité entre les 10 classes → composantes directement optimisées pour la classification",
        "Les deux sont équivalents si on garde le même nombre de composantes",
        "Ni l'un ni l'autre — utiliser directement les pixels bruts",
      ],
      answer:
        "LDA — supervisé, maximise la séparabilité entre les 10 classes → composantes directement optimisées pour la classification",
      explanation:
        "Labels disponibles + objectif = classification → LDA est supérieur à PCA. LDA maximise le ratio variance inter-classes / variance intra-classes → les composantes sont directement discriminantes. PCA trouve les directions de variance globale qui peuvent ne pas correspondre aux directions discriminantes. LDA donne au maximum C-1=9 composantes pour 10 classes.",
    },
    {
      question:
        "[Versus] SVM vs KNN sur un dataset de 50 000 exemples avec 500 features (données génomiques). Quelle est la combinaison optimale ?",
      options: [
        "KNN avec K=5 — simple et efficace en haute dimension",
        "SVM avec kernel linéaire — haute dimension favorise la séparabilité linéaire, SVM est conçu pour ça",
        "KNN avec K=100 — plus K est grand, moins c'est sensible à la dimension",
        "Les deux sont équivalents en haute dimension",
      ],
      answer:
        "SVM avec kernel linéaire — haute dimension favorise la séparabilité linéaire, SVM est conçu pour ça",
      explanation:
        "En haute dimension : KNN souffre de la malédiction de la dimensionnalité — toutes les distances se ressemblent, les voisins ne sont plus représentatifs. SVM linéaire excelle en haute dimension (théorème de Cover : données linéairement séparables avec haute probabilité en grande dimension). Avec 50K samples, SVM peut être lent — envisager LinearSVC pour la scalabilité.",
    },
    {
      question:
        "[Versus] Decision Tree vs Linear Regression pour prédire la consommation de carburant selon le poids et la puissance du moteur. Les données montrent une relation non-linéaire. Que choisir ?",
      options: [
        "Linear Regression — plus simple et toujours plus précise",
        "Decision Tree — capture les relations non-linéaires sans transformation des features",
        "Les deux sont équivalents si tu ajoutes assez de features",
        "Linear Regression avec normalisation — la normalisation corrige la non-linéarité",
      ],
      answer:
        "Decision Tree — capture les relations non-linéaires sans transformation des features",
      explanation:
        "Relation non-linéaire → Régression Linéaire underfitte sauf si tu crées manuellement des features polynomiales (poids², poids×puissance). Le Decision Tree partitionne automatiquement l'espace non-linéairement. En pratique pour ce genre de problème : Random Forest ou XGBoost seront encore meilleurs qu'un arbre seul.",
    },
    {
      question:
        "[Paramétrage] Ton K-Means converge vers des clusters de mauvaise qualité (score Silhouette = 0.15). Quels hyperparamètres ajuster en priorité ?",
      options: [
        "Augmenter max_iter — le modèle a besoin de plus d'itérations",
        "Tester différentes valeurs de K (Elbow method) + utiliser init='k-means++' + augmenter n_init=20 pour éviter les minima locaux",
        "Changer la metric de distance vers Manhattan",
        "Réduire n_clusters à 2 — moins de clusters = meilleure qualité",
      ],
      answer:
        "Tester différentes valeurs de K (Elbow method) + utiliser init='k-means++' + augmenter n_init=20 pour éviter les minima locaux",
      explanation:
        "Silhouette=0.15 ≈ clusters sans structure claire. Causes probables : mauvais K, initialisation aléatoire convergée vers un minimum local. Elbow method : tracer l'inertie vs K, choisir le coude. k-means++ choisit des centroïdes initiaux bien dispersés. n_init=20 = 20 initialisations différentes, garder la meilleure. Normaliser les features avant K-Means.",
    },
    {
      question:
        "[Versus] Dans quel cas préférer un modèle linéaire simple (régression logistique) à XGBoost pour un problème de classification en production ?",
      options: [
        "Jamais — XGBoost est toujours plus performant",
        "Quand l'interprétabilité est requise (réglementation), le dataset est petit (<500 lignes), la latence de prédiction doit être < 1ms, ou les données sont linéairement séparables",
        "Quand les données sont déséquilibrées — la logistique gère mieux ce cas",
        "Quand tu n'as pas le temps de tuner les hyperparamètres",
      ],
      answer:
        "Quand l'interprétabilité est requise (réglementation), le dataset est petit (<500 lignes), la latence de prédiction doit être < 1ms, ou les données sont linéairement séparables",
      explanation:
        "Régression logistique > XGBoost quand : secteur bancaire/médical (réglementation RGPD/Bâle III demande des explications), petit dataset (XGBoost overfitte), temps réel strict (logistique = O(p), XGBoost = O(depth × n_trees)), données textuelles TF-IDF (linéairement séparables). XGBoost gagne sur données tabulaires complexes de taille moyenne/grande.",
    },
  ],
  avance: [
    {
      question:
        "[Versus complexe] Explique quand DBSCAN est PIRE que K-Means, malgré ses avantages théoriques.",
      options: [
        "DBSCAN est toujours supérieur à K-Means — ses avantages sont universels",
        "DBSCAN échoue quand les clusters ont des densités très différentes (eps fixe ne convient pas à tous), quand le dataset est très grand (O(n²) sans index spatial), et quand les clusters sont sphériques et compacts",
        "DBSCAN échoue uniquement sur les données en haute dimension",
        "DBSCAN est pire uniquement si K est mal choisi dans K-Means",
      ],
      answer:
        "DBSCAN échoue quand les clusters ont des densités très différentes (eps fixe ne convient pas à tous), quand le dataset est très large (O(n²) sans index spatial), et quand les clusters sont sphériques et compacts",
      explanation:
        "Clusters de densités mixtes : un eps adapté au cluster dense va fragmenter le cluster rare. HDBSCAN corrige ce problème avec un eps variable. Grande échelle : DBSCAN standard est O(n²) — utiliser HDBSCAN ou Ball-Tree indexing. Sur données sphériques : K-Means est plus précis et 100x plus rapide. Choisir l'algorithme selon la FORME des clusters attendus.",
    },
    {
      question:
        "[Versus paramétrage] Ton SVM avec kernel RBF overfitte (train_acc=0.99, val_acc=0.72). Quels paramètres ajuster et dans quel sens ?",
      options: [
        "Augmenter C et augmenter gamma — plus de complexité pour capturer les patterns",
        "Réduire C (plus grande marge, moins strict) ET réduire gamma (RBF bandwidth plus large, généralise mieux) — les deux contrôlent la complexité du SVM RBF",
        "Changer le kernel vers 'poly' — plus simple que RBF",
        "Augmenter le dataset — le SVM overfitte uniquement par manque de données",
      ],
      answer:
        "Réduire C (plus grande marge, moins strict) ET réduire gamma (RBF bandwidth plus large, généralise mieux) — les deux contrôlent la complexité du SVM RBF",
      explanation:
        "SVM RBF a deux hyperparamètres de complexité : C (petit = marge large = simpler boundary) et gamma (petit = RBF kernel large = smoother decision boundary). Overfitting = trop complexe → réduire les deux. GridSearchCV sur C=[0.01,0.1,1,10] × gamma=[0.001,0.01,0.1] avec CV=5 est la procédure standard.",
    },
    {
      question:
        "[Versus PCA vs LDA] Tu appliques PCA (95% variance) puis un classifieur. Performance = 0.78. Tu passes à LDA directement. Performance = 0.89. Explique l'écart.",
      options: [
        "PCA a réduit trop de features — garder plus de composantes PCA",
        "PCA maximise la variance globale indépendamment des classes — certaines directions à forte variance peuvent être intra-classes et donc non-discriminantes. LDA maximise directement la séparabilité → composantes pertinentes pour la classification",
        "La différence vient du classifieur utilisé après, pas de la réduction de dimension",
        "PCA et LDA donnent toujours le même résultat si on garde le même nombre de composantes",
      ],
      answer:
        "PCA maximise la variance globale indépendamment des classes — certaines directions à forte variance peuvent être intra-classes et donc non-discriminantes. LDA maximise directement la séparabilité → composantes pertinentes pour la classification",
      explanation:
        "Cas classique : une feature qui varie beaucoup au sein de chaque classe (forte variance totale) mais peu entre classes. PCA garde cette direction. LDA l'ignore au profit des directions qui séparent les classes. La règle : si labels disponibles et objectif = classification → LDA > PCA. PCA reste utile pour la visualisation et si les hypothèses LDA (gaussianité, covariance égale) sont violées.",
    },
    {
      question:
        "[Versus paramétrage] KNN avec K=1 vs K=50 vs K=200 sur un dataset de 1000 exemples. Analyser le biais-variance de chaque choix.",
      options: [
        "K=1 overfitte, K=50 est l'optimum universel, K=200 underfitte toujours",
        "K=1 = haute variance (mémorise chaque point), K=50 = équilibre biais-variance (à valider par CV), K=200 = haut biais (20% du dataset, lisse trop la frontière)",
        "Plus K est grand, meilleure est la performance — toujours utiliser le K maximum possible",
        "K ne change pas les performances si les données sont normalisées",
      ],
      answer:
        "K=1 = haute variance (mémorise chaque point), K=50 = équilibre biais-variance (à valider par CV), K=200 = haut biais (20% du dataset, lisse trop la frontière)",
      explanation:
        "K=1 = chaque point est son propre cluster → frontière très irrégulière → overfitting. K=N = vote de tout le dataset → toujours la classe majoritaire → underfitting. K optimal ≈ √N (règle empirique) = √1000 ≈ 32. Toujours valider par CV. K impair pour éviter les égalités en binaire.",
    },
    {
      question:
        "[Choix de modèle] Dataset : 2000 clients, 15 features numériques, problème de segmentation (pas de labels). Tu veux des segments interprétables pour le marketing. Quel est le meilleur pipeline ?",
      options: [
        "Random Forest pour classifier les clients en segments",
        "StandardScaler → PCA (visualisation) → K-Means (Elbow pour K) → validation par Silhouette score → interprétation des centroïdes",
        "DBSCAN directement — plus robuste que K-Means",
        "Régression logistique avec 5 classes définies manuellement",
      ],
      answer:
        "StandardScaler → PCA (visualisation) → K-Means (Elbow pour K) → validation par Silhouette score → interprétation des centroïdes",
      explanation:
        "Pas de labels + interprétabilité marketing → clustering. StandardScaler obligatoire (K-Means sensible aux échelles). PCA pour visualiser en 2D et comprendre la structure. K-Means pour des clusters sphériques interprétables (centroïdes = profil du segment). Elbow + Silhouette pour choisir K. K=3-5 est souvent optimal pour la segmentation marketing.",
    },
    {
      question:
        "[Versus non-supervisé] t-SNE vs PCA pour visualiser un dataset de 10 000 images en 2D. Quelle différence dans les résultats obtenus ?",
      options: [
        "t-SNE et PCA donnent des visualisations identiques",
        "PCA = projection linéaire globale (préserve les distances globales, rapide) ; t-SNE = embedding non-linéaire (préserve les voisinages locaux, révèle des clusters non linéaires, mais distances globales non-préservées et résultat non-reproductible sans seed)",
        "t-SNE est meilleur que PCA dans tous les cas de visualisation",
        "PCA est préférable pour les images car t-SNE ne gère pas les données de haute dimension",
      ],
      answer:
        "PCA = projection linéaire globale (préserve les distances globales, rapide) ; t-SNE = embedding non-linéaire (préserve les voisinages locaux, révèle des clusters non linéaires, mais distances globales non-préservées et résultat non-reproductible sans seed)",
      explanation:
        "t-SNE est spectaculaire pour révéler des clusters cachés mais : distances inter-clusters non-interprétables, paramètre perplexity critique, lent O(n²) sans approximation, non-reproductible sans random_state. PCA : distances préservées globalement, rapide, reproductible. En pratique : PCA d'abord pour compression (ex: 512→50 dims), puis t-SNE pour la visualisation finale.",
    },
    {
      question:
        "[Anti-pattern] Un data scientist utilise KNN avec K=3 sur un dataset de 100 000 exemples et 200 features pour un système de recommandation temps réel. Quels sont les deux problèmes critiques ?",
      options: [
        "K=3 est trop petit, et 100 000 exemples c'est trop peu",
        "Malédiction de la dimensionnalité (200 features rend les distances peu informatives) + prédiction lente O(n×d) = 100K×200 = 20M opérations par requête temps réel",
        "KNN ne peut pas être utilisé pour les recommandations",
        "100 000 exemples cause l'overfitting avec KNN",
      ],
      answer:
        "Malédiction de la dimensionnalité (200 features rend les distances peu informatives) + prédiction lente O(n×d) = 100K×200 = 20M opérations par requête temps réel",
      explanation:
        "Problème 1 : en 200 dimensions, toutes les distances euclidiennes convergent vers la même valeur → les K voisins ne sont pas plus proches que les autres → KNN perd son sens. Solutions : réduire avec PCA/UMAP avant, ou utiliser des métriques adaptées. Problème 2 : 20M opérations par requête = latence inacceptable. Solution : ANN (Approximate Nearest Neighbors) avec FAISS ou Annoy, ou un modèle de matrix factorization.",
    },
    {
      question:
        "[Paramétrage avancé] Tu paramètres un SVM RBF avec GridSearchCV. Les meilleurs params sur val sont C=1000, gamma=0.1. Mais sur le test set la performance chute. Pourquoi ?",
      options: [
        "GridSearchCV a un bug — il faut utiliser RandomizedSearchCV",
        "Overfitting des hyperparamètres : avec une grille large et un seul val set, le modèle sélectionne les params par chance. Solution : nested cross-validation (outer CV pour évaluer, inner CV pour tuner)",
        "C=1000 est toujours trop élevé — limiter à C=10",
        "gamma=0.1 est incompatible avec les grands datasets",
      ],
      answer:
        "Overfitting des hyperparamètres : avec une grille large et un seul val set, le modèle sélectionne les params par chance. Solution : nested cross-validation (outer CV pour évaluer, inner CV pour tuner)",
      explanation:
        "Quand on teste 100+ combinaisons d'hyperparamètres, il y en a statistiquement une qui performe bien sur le val set par chance. Nested CV : outer loop = K folds pour l'évaluation non-biaisée, inner loop = K folds pour la sélection d'hyperparamètres. Résultat : estimation honnête de la performance générale. Alternative : validation set 3-voies (train/val/test stricts).",
    },
  ],
  expert: [
    {
      question:
        "[Entretien] Un manager te demande : 'Quelle est LA différence entre régression et classification ?' Tu dois répondre en 30 secondes. Quelle réponse est la plus juste et complète ?",
      options: [
        "La régression prédit des nombres, la classification prédit des lettres",
        "La régression prédit une valeur continue (ℝ) avec une loss sur l'erreur (MSE/MAE) ; la classification prédit une catégorie discrète avec une loss sur la probabilité (Cross-Entropy). Le même algorithme peut souvent faire les deux selon sa configuration",
        "La classification est plus difficile que la régression",
        "La régression utilise des droites, la classification utilise des courbes",
      ],
      answer:
        "La régression prédit une valeur continue (ℝ) avec une loss sur l'erreur (MSE/MAE) ; la classification prédit une catégorie discrète avec une loss sur la probabilité (Cross-Entropy). Le même algorithme peut souvent faire les deux selon sa configuration",
      explanation:
        "La distinction clé est dans la nature de la sortie ET dans la fonction de loss. Un Decision Tree, Random Forest, XGBoost, réseau de neurones peuvent faire les deux. La régression logistique, malgré son nom, est un classifieur. En entretien : toujours mentionner la loss function — c'est ce qui distingue vraiment les deux paradigmes.",
    },
    {
      question:
        "[Design système] Tu dois choisir entre K-Means, DBSCAN, et GMM pour segmenter 500 000 transactions bancaires. Les transactions frauduleuses (<0.1%) doivent être identifiées. Quelle approche ?",
      options: [
        "K-Means avec K=2 (normal/fraude) — rapide et interprétable",
        "Isolation Forest ou One-Class SVM pour la détection d'anomalies — les fraudes sont des outliers, pas un cluster. Clustering non-supervisé ne convient pas quand la classe minoritaire est < 1%",
        "DBSCAN — identifie les outliers comme classe -1",
        "GMM avec 2 composantes — modélise la distribution de chaque classe",
      ],
      answer:
        "Isolation Forest ou One-Class SVM pour la détection d'anomalies — les fraudes sont des outliers, pas un cluster. Clustering non-supervisé ne convient pas quand la classe minoritaire est < 1%",
      explanation:
        "Les fraudes (0.1%) ne forment pas un cluster cohérent — elles sont diverses et rares. DBSCAN les marquerait en bruit mais sans garantie. GMM avec 2 composantes : la petite composante ne sera pas détectée. Solution : Isolation Forest (algorithme d'anomalie dédié, O(n·log n), gère bien les grandes dimensions) ou, si quelques labels disponibles, XGBoost avec SMOTE.",
    },
    {
      question:
        "[Théorie] Prouve mathématiquement pourquoi la régression linéaire est un cas particulier de la régression logistique.",
      options: [
        "Ce n'est pas vrai — les deux sont des modèles fondamentalement différents",
        "Les deux minimisent une log-vraisemblance : LinReg sous hypothèse gaussienne (→ MSE), LogReg sous hypothèse Bernoulli (→ Binary Cross-Entropy). Changer la distribution assumée dans le GLM (Generalized Linear Model) passe de l'un à l'autre",
        "La logistique devient linéaire quand sigma → infini dans la fonction sigmoid",
        "La linéaire est un cas de la logistique quand le seuil est mis à 0",
      ],
      answer:
        "Les deux minimisent une log-vraisemblance : LinReg sous hypothèse gaussienne (→ MSE), LogReg sous hypothèse Bernoulli (→ Binary Cross-Entropy). Changer la distribution assumée dans le GLM (Generalized Linear Model) passe de l'un à l'autre",
      explanation:
        "GLM (Generalized Linear Model) unifie les deux : LinReg = GLM avec distribution gaussienne et lien identitaire (g(μ)=μ). LogReg = GLM avec distribution Bernoulli et lien logit (g(μ)=log(μ/(1-μ))). Maximiser la log-vraisemblance gaussienne → minimiser MSE. Maximiser la log-vraisemblance Bernoulli → minimiser la Cross-Entropy. C'est la même mécanique, deux familles différentes.",
    },
    {
      question:
        "[Cas réel] On te donne un dataset client (âge, revenus, historique d'achats) sans labels. Tu dois à la fois segmenter les clients ET prédire qui va churner. Propose une architecture ML complète.",
      options: [
        "K-Means pour tout — simple et efficace",
        "Pipeline deux-étapes : 1) Clustering non-supervisé (K-Means/DBSCAN) pour créer des segments → 2) Semi-supervisé : utiliser les segments comme pseudo-labels pour bootstrapper un classifieur de churn (Log. Reg. ou XGBoost) une fois quelques labels obtenus manuellement",
        "Régression logistique directement — les labels peuvent être créés artificiellement",
        "PCA suivi d'une SVM — la réduction de dimension améliore toujours la classification",
      ],
      answer:
        "Pipeline deux-étapes : 1) Clustering non-supervisé (K-Means/DBSCAN) pour créer des segments → 2) Semi-supervisé : utiliser les segments comme pseudo-labels pour bootstrapper un classifieur de churn (Log. Reg. ou XGBoost) une fois quelques labels obtenus manuellement",
      explanation:
        "Phase 1 (non-supervisé) : K-Means pour trouver des profils clients naturels. Phase 2 (semi-supervisé) : labelliser manuellement ~100 exemples par segment (churner/non-churner), puis self-training ou Label Spreading pour propager aux non-labellisés. Finalement XGBoost sur les données complètes. Cette approche est réaliste en production où les labels coûtent cher.",
    },
    {
      question:
        "[Versus théorique] Dans quels contextes précis DBSCAN est-il théoriquement optimal par rapport à K-Means, et quels sont les 3 conditions nécessaires ?",
      options: [
        "DBSCAN est toujours optimal — il généralise K-Means",
        "DBSCAN est optimal quand : 1) les clusters ont des formes non-convexes (DBSCAN connectivité dense vs K-Means distances euclidiennes) 2) des outliers sont présents (DBSCAN les étiquette, K-Means les absorbe) 3) K est inconnu (DBSCAN autodétermine le nombre de clusters)",
        "DBSCAN est optimal uniquement pour les données 2D",
        "DBSCAN est optimal quand les clusters sont de taille égale",
      ],
      answer:
        "DBSCAN est optimal quand : 1) les clusters ont des formes non-convexes (DBSCAN connectivité dense vs K-Means distances euclidiennes) 2) des outliers sont présents (DBSCAN les étiquette, K-Means les absorbe) 3) K est inconnu (DBSCAN autodétermine le nombre de clusters)",
      explanation:
        "Condition 1 : K-Means minimise la distance euclidienne → convexe par construction. Anneaux, croissants, spirales → K-Means échoue. Condition 2 : un outlier fausse le centroïde K-Means → DBSCAN les isole en bruit. Condition 3 : K-Means nécessite K a priori. Contre-conditions DBSCAN : densités mixtes → HDBSCAN, grande échelle → approximation, haute dimension → malédiction des distances.",
    },
    {
      question:
        "[Optimisation] Pour choisir K dans K-Means, tu as trois méthodes : Elbow, Silhouette, et Gap Statistic. Quand chaque méthode est-elle la plus fiable ?",
      options: [
        "Les trois donnent toujours le même K — utiliser la plus simple (Elbow)",
        "Elbow : rapide, visuellement intuitif mais coude souvent flou. Silhouette : plus robuste, donne un score par K [-1,1], K optimal = max. Gap Statistic : compare au clustering aléatoire, statistiquement rigoureux mais lent. En pratique : Silhouette pour la rigueur, Elbow pour la vitesse, Gap pour les publications",
        "Gap Statistic est toujours la meilleure méthode",
        "Elbow est la seule méthode valide pour les grands datasets",
      ],
      answer:
        "Elbow : rapide, visuellement intuitif mais coude souvent flou. Silhouette : plus robuste, donne un score par K [-1,1], K optimal = max. Gap Statistic : compare au clustering aléatoire, statistiquement rigoureux mais lent. En pratique : Silhouette pour la rigueur, Elbow pour la vitesse, Gap pour les publications",
      explanation:
        "Elbow : tracer inertie vs K, choisir le coude — subjectif et parfois absent. Silhouette(K) = (b-a)/max(a,b) où a=cohésion intra, b=séparation inter → score moyen sur tout le dataset → maximiser. Gap Statistic : compare W_k (inertie) à E[W_k^*] sur données uniformes, K optimal = plus petit K où Gap(K) >= Gap(K+1) - std. Utiliser au moins Silhouette + Elbow ensemble.",
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

const MLComparaisonsSupervise = () => {
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

export default MLComparaisonsSupervise;
