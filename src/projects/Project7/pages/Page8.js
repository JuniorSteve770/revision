// src/projects/Project3/pages/Page_GitHubDeploy.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
    {
    "question": "1 — La règle d'or : la granularité",
    "answer": "**Première question à se poser** : quelle granularité le métier attend-il dans le résultat ? ◆ **Une ligne par groupe** (par client, par région) → `GROUP BY` : le nombre de lignes diminue. ◆ **Chaque ligne + un calcul** (chaque transaction avec le total du client) → **window function** : toutes les lignes sont conservées. ◆ **Exemple** : « total par client » → `GROUP BY` ; « chaque transaction avec le total du client » → `SUM(montant) OVER (PARTITION BY client_id)`."
  },
  {
    "question": "2 — Les 5 facteurs d'une window function",
    "answer": "**1. Conserver les lignes** : le métier veut voir chaque transaction. ◆ **2. Comparer des lignes** : avec la précédente, la suivante, la moyenne du groupe → `LAG`, `LEAD`, `AVG OVER`. ◆ **3. Classer** : top 3, meilleur, rang → `ROW_NUMBER`, `RANK`, `DENSE_RANK`. ◆ **4. Cumuler** : total cumulé, solde progressif → `SUM OVER (ORDER BY …)`. ◆ **5. Agréger sans perdre de lignes** : chaque employé avec la moyenne de son département → `AVG OVER (PARTITION BY dept)`."
  },
  {
    "question": "3 — La syntaxe OVER",
    "answer": "**Forme** : `fonction(...) OVER (PARTITION BY … ORDER BY … ROWS BETWEEN …)`. ◆ **`PARTITION BY`** : définit les groupes de calcul. Il **ne supprime aucune ligne**. ◆ **`ORDER BY`** : définit l'ordre des lignes dans chaque groupe (obligatoire pour classer, `LAG`, cumul). ◆ **`ROWS BETWEEN`** : précise les lignes prises dans le calcul (ex. les 3 dernières). ◆ **`OVER ()`** vide : la fenêtre est toute la table."
  },
  {
    "question": "4 — Agrégats fenêtrés",
    "answer": "**Total du groupe sur chaque ligne** : `SUM(montant) OVER (PARTITION BY client_id)`. ◆ **Moyenne du groupe** : `AVG(salaire) OVER (PARTITION BY dept)`. ◆ **Écart à la moyenne** : `salaire - AVG(salaire) OVER (PARTITION BY dept)`. ◆ **Part du total** : `montant * 100.0 / SUM(montant) OVER (PARTITION BY client_id)`. ◆ **Nombre de lignes du groupe** : `COUNT(*) OVER (PARTITION BY client_id)`."
  },
  {
    "question": "5 — Classement : ROW_NUMBER, RANK, DENSE_RANK",
    "answer": "**Salaires 5000, 5000, 4000** : `ROW_NUMBER` → 1, 2, 3 ; `RANK` → 1, 1, 3 ; `DENSE_RANK` → 1, 1, 2. ◆ **`ROW_NUMBER`** : numéro unique, idéal pour « une seule ligne par groupe ». ◆ **`RANK`** : ex-aequo au même rang, puis un trou. **`DENSE_RANK`** : ex-aequo, sans trou. ◆ **Top N par groupe** : `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salaire DESC)`, puis filtrer `<= N`. ◆ **Dernière ligne par client** : `ORDER BY date_tx DESC`, puis filtrer `= 1`."
  },
  {
    "question": "6 — Comparer des lignes : LAG, LEAD, FIRST_VALUE",
    "answer": "**`LAG(montant)`** : valeur de la ligne **précédente**. **`LEAD(montant)`** : valeur de la ligne **suivante**. ◆ **Toujours** `PARTITION BY client_id ORDER BY date_tx`, sinon on compare avec un autre client. ◆ **Première ligne** : `LAG` renvoie `NULL` ; `LAG(montant, 1, 0)` renvoie 0. ◆ **Variation** : `montant - LAG(montant) OVER (…)`. ◆ **`FIRST_VALUE(montant)`** : première valeur du groupe dans l'ordre choisi."
  },
  {
    "question": "7 — Cumul et moyenne mobile",
    "answer": "**Cumul** : `SUM(montant) OVER (PARTITION BY client_id ORDER BY date_tx)`. Ajouter `ORDER BY` transforme le total en **cumul progressif**. ◆ **Moyenne mobile sur 3 lignes** : `AVG(ca) OVER (ORDER BY mois ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`. ◆ **Piège** : sans `ROWS`, la fenêtre par défaut est `RANGE` : deux lignes à la **même date** reçoivent le même cumul. ◆ **Cumul ligne à ligne** : `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` avec un tri unique (`date_tx, id`)."
  },
  {
    "question": "8 — Ordre d'exécution et filtrage",
    "answer": "**Ordre logique** : `FROM` → `WHERE` → `GROUP BY` → `HAVING` → **window functions** → `ORDER BY`. ◆ **Conséquence** : impossible d'écrire `WHERE ROW_NUMBER() OVER (…) = 1`. ◆ **Solution** : calculer dans une CTE (`WITH t AS (…)`) ou une sous-requête, puis filtrer à l'extérieur. ◆ **Combinaison possible** : une window function peut s'appliquer au résultat d'un `GROUP BY`, par ex. `RANK() OVER (ORDER BY SUM(ca) DESC)` pour classer les régions."
  },
  {
    "question": "9 — Plusieurs façons d'arriver au même résultat",
    "answer": "**Moyenne du groupe sur chaque ligne** : `AVG OVER` ou `GROUP BY` dans une sous-requête + jointure. ◆ **Valeur précédente** : `LAG` ou jointure de la table sur elle-même. ◆ **Dernière ligne par groupe** : `ROW_NUMBER = 1` ou jointure sur `MAX(date)` (attention : plusieurs lignes si la date max est en double). ◆ **Cumul** : `SUM OVER` ou sous-requête corrélée (même résultat, plus lent). ◆ **En entretien** : donner la window function, puis citer l'alternative."
  },
  {
    "question": "10 — Mots-clés de l'énoncé → réflexe",
    "answer": "**« total / moyenne par X »** (une ligne par X) → `GROUP BY`. ◆ **« chaque … avec … »** → `OVER (PARTITION BY …)`. ◆ **« précédent » / « suivant »** → `LAG` / `LEAD`. ◆ **« top N par » / « meilleur par »** → `ROW_NUMBER` ou `RANK`, puis filtre. ◆ **« cumulé » / « solde »** → `SUM OVER (ORDER BY …)`. ◆ **« mobile » / « 3 derniers »** → `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`. ◆ **« part du total » / « écart à la moyenne »** → agrégat `OVER`. ◆ **« dernier » / « doublon »** → `ROW_NUMBER`."
  }
];

const questions = {
  moyen: [
    
    
    {
      "question": "[Granularité] Le métier veut le montant total des transactions par client, une ligne par client. Quelle approche ?",
      "options": [
        "`GROUP BY client_id` avec `SUM(montant)`",
        "`SUM(montant) OVER (PARTITION BY client_id)`",
        "`LAG(montant)`",
        "`ROW_NUMBER()`"
      ],
      "answer": "`GROUP BY client_id` avec `SUM(montant)`",
      "explanation": "Une ligne par client = on réduit la granularité → `GROUP BY`. La window function garderait toutes les transactions."
    },
    {
      "question": "[Granularité] Le métier veut chaque transaction, avec en plus le total du client. Quelle approche ?",
      "options": [
        "`GROUP BY client_id`",
        "`SUM(montant) OVER (PARTITION BY client_id)`",
        "`HAVING SUM(montant) > 0`",
        "`COUNT(DISTINCT client_id)`"
      ],
      "answer": "`SUM(montant) OVER (PARTITION BY client_id)`",
      "explanation": "On garde chaque transaction et on ajoute un calcul → window function."
    },
    {
      "question": "[Classement] On veut les deux meilleurs salaires de chaque département. Quelle approche ?",
      "options": [
        "`GROUP BY dept` avec `MAX(salaire)`",
        "`AVG(salaire) OVER (PARTITION BY dept)`",
        "`ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salaire DESC)`, puis filtrer `<= 2`",
        "`LAG(salaire)`"
      ],
      "answer": "`ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salaire DESC)`, puis filtrer `<= 2`",
      "explanation": "« Par département » ne veut pas dire `GROUP BY` ici : on classe les lignes à l'intérieur de chaque département. `MAX` ne donnerait qu'un salaire."
    },
    {
      "question": "[Comparaison] On veut comparer chaque transaction au montant de la transaction précédente du même client. Quelle fonction ?",
      "options": [
        "`LEAD(montant) OVER (ORDER BY date_tx)`",
        "`FIRST_VALUE(montant)`",
        "`SUM(montant) OVER (PARTITION BY client_id)`",
        "`LAG(montant) OVER (PARTITION BY client_id ORDER BY date_tx)`"
      ],
      "answer": "`LAG(montant) OVER (PARTITION BY client_id ORDER BY date_tx)`",
      "explanation": "`LAG` = ligne précédente. `PARTITION BY client_id` évite de comparer avec un autre client ; `ORDER BY date_tx` définit « précédent »."
    },
    {
      "question": "[Cumul] On veut le total cumulé des ventes au fil des mois. Quelle écriture ?",
      "options": [
        "`SUM(ca) OVER (ORDER BY mois)`",
        "`SUM(ca) OVER ()`",
        "`GROUP BY mois`",
        "`MAX(ca) OVER (ORDER BY mois)`"
      ],
      "answer": "`SUM(ca) OVER (ORDER BY mois)`",
      "explanation": "Ajouter `ORDER BY` dans `OVER` transforme le total en cumul progressif."
    },
    {
      "question": "[Syntaxe] Quel est le rôle de `PARTITION BY` dans une window function ?",
      "options": [
        "Il supprime les doublons.",
        "Il définit les groupes de calcul, sans supprimer de lignes.",
        "Il remplace le `WHERE`.",
        "Il trie le résultat final."
      ],
      "answer": "Il définit les groupes de calcul, sans supprimer de lignes.",
      "explanation": "Contrairement à `GROUP BY`, `PARTITION BY` ne réduit pas le nombre de lignes : il délimite seulement le groupe utilisé pour le calcul."
    },
    {
      "question": "[Comparaison] On veut afficher, sur chaque transaction, le montant de la transaction suivante du même client. Quelle fonction ?",
      "options": [
        "`LAG`",
        "`RANK`",
        "`LEAD`",
        "`COUNT`"
      ],
      "answer": "`LEAD`",
      "explanation": "`LEAD` = ligne suivante, `LAG` = ligne précédente. Toujours avec `PARTITION BY client_id ORDER BY date_tx`."
    },
    {
      "question": "[Agrégat fenêtré] On veut, sur chaque transaction, sa part en % dans le total du client. Quelle écriture ?",
      "options": [
        "`montant * 100.0 / SUM(montant)` avec `GROUP BY client_id`",
        "`RANK() OVER (PARTITION BY client_id)`",
        "`montant * 100.0 / COUNT(*)`",
        "`montant * 100.0 / SUM(montant) OVER (PARTITION BY client_id)`"
      ],
      "answer": "`montant * 100.0 / SUM(montant) OVER (PARTITION BY client_id)`",
      "explanation": "Le total du client est calculé sur chaque ligne grâce à `OVER`. Le `100.0` évite une division entière."
    },
    {
      "question": "[Moyenne mobile] On veut la moyenne des ventes des 3 derniers mois (mois courant inclus). Quelle écriture ?",
      "options": [
        "`AVG(ca) OVER (ORDER BY mois ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`",
        "`AVG(ca) OVER (PARTITION BY mois)`",
        "`AVG(ca)` avec `GROUP BY mois`",
        "`AVG(ca) OVER (ORDER BY mois ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)`"
      ],
      "answer": "`AVG(ca) OVER (ORDER BY mois ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`",
      "explanation": "2 lignes avant + la ligne courante = 3 mois. `3 PRECEDING` en prendrait 4."
    },
    {
      "question": "[Classement] On veut la dernière transaction de chaque client, avec toutes ses colonnes. Quelle approche ?",
      "options": [
        "`MAX(date_tx)` avec `GROUP BY client_id` seul",
        "`ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY date_tx DESC)`, puis filtrer `= 1`",
        "`LAG(date_tx)`",
        "`SUM(montant) OVER (ORDER BY date_tx)`"
      ],
      "answer": "`ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY date_tx DESC)`, puis filtrer `= 1`",
      "explanation": "`GROUP BY` seul donne la date max, mais pas les autres colonnes de la transaction. `ROW_NUMBER = 1` garde la ligne complète."
    },
    {
      "question": "[Deux requêtes] Chaque employé avec la moyenne de son département.\nA : `SELECT nom, dept, AVG(salaire) OVER (PARTITION BY dept) FROM employes`\nB : `SELECT e.nom, e.dept, m.moy FROM employes e JOIN (SELECT dept, AVG(salaire) AS moy FROM employes GROUP BY dept) m ON e.dept = m.dept`",
      "options": [
        "A seule est correcte.",
        "B seule est correcte.",
        "A et B donnent le même résultat.",
        "Aucune n'est correcte."
      ],
      "answer": "A et B donnent le même résultat.",
      "explanation": "Deux façons valides : la window function (plus courte) ou un `GROUP BY` dans une sous-requête suivi d'une jointure."
    },
    {
      "question": "[Deux requêtes] Total des ventes par région, une ligne par région.\nA : `SELECT region, SUM(ca) FROM ventes GROUP BY region`\nB : `SELECT region, SUM(ca) OVER (PARTITION BY region) FROM ventes`",
      "options": [
        "A et B donnent le même résultat.",
        "B seule est correcte.",
        "Aucune n'est correcte.",
        "A seule est correcte : B renvoie une ligne par vente, avec le total répété."
      ],
      "answer": "A seule est correcte : B renvoie une ligne par vente, avec le total répété.",
      "explanation": "La window function ne réduit pas les lignes. Pour une ligne par région, c'est `GROUP BY`."
    },
    {
      "question": "[Deux requêtes] Afficher, sur chaque transaction, le nombre de transactions du client.\nA : `SELECT t.*, COUNT(*) OVER (PARTITION BY client_id) FROM transactions t`\nB : `SELECT t.*, (SELECT COUNT(*) FROM transactions t2 WHERE t2.client_id = t.client_id) FROM transactions t`",
      "options": [
        "A et B donnent le même résultat.",
        "A seule est correcte.",
        "B seule est correcte.",
        "Aucune n'est correcte."
      ],
      "answer": "A et B donnent le même résultat.",
      "explanation": "B utilise une sous-requête corrélée : même résultat, mais elle est recalculée pour chaque ligne. A est plus lisible et plus performante."
    },
    {
      "question": "[Agrégat fenêtré] On veut l'écart de chaque salaire à la moyenne de son département. Quelle écriture ?",
      "options": [
        "`salaire - AVG(salaire)` avec `GROUP BY dept`",
        "`salaire - AVG(salaire) OVER (PARTITION BY dept)`",
        "`salaire - LAG(salaire)`",
        "`RANK() OVER (ORDER BY salaire)`"
      ],
      "answer": "`salaire - AVG(salaire) OVER (PARTITION BY dept)`",
      "explanation": "On garde chaque employé et on compare à la moyenne du groupe : agrégat avec `OVER`."
    },
    {
      "question": "[Mots-clés] Quel indice dans l'énoncé oriente vers une window function ?",
      "options": [
        "« Une ligne par client ».",
        "« Le nombre de clients distincts ».",
        "« Chaque transaction, avec en plus… ».",
        "« Le total général de la table »."
      ],
      "answer": "« Chaque transaction, avec en plus… ».",
      "explanation": "« Chaque … avec … » = garder les lignes et ajouter un calcul. « Une ligne par » = `GROUP BY`."
    }
  
  ],
  avance: [
    
    {
      "question": "[Classement] Salaires d'un département : 5000, 5000, 4000 (tri décroissant). Que renvoie `RANK()` ?",
      "options": [
        "1, 2, 3",
        "1, 1, 2",
        "1, 1, 1",
        "1, 1, 3"
      ],
      "answer": "1, 1, 3",
      "explanation": "`RANK` donne le même rang aux ex-aequo puis laisse un trou. `ROW_NUMBER` → 1, 2, 3 ; `DENSE_RANK` → 1, 1, 2."
    },
    {
      "question": "[Classement] Mêmes salaires (5000, 5000, 4000). Combien de lignes avec `DENSE_RANK() <= 2` ?",
      "options": [
        "3",
        "2",
        "1",
        "0"
      ],
      "answer": "3",
      "explanation": "`DENSE_RANK` → 1, 1, 2 : les trois lignes ont un rang ≤ 2. Avec `ROW_NUMBER() <= 2`, on en aurait 2."
    },
    {
      "question": "[Filtrage] `SELECT * FROM transactions WHERE ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY date_tx DESC) = 1` — Résultat ?",
      "options": [
        "La dernière transaction de chaque client.",
        "Erreur : une window function est interdite dans `WHERE` ; calculer dans une CTE puis filtrer.",
        "La première transaction de la table.",
        "Toutes les transactions."
      ],
      "answer": "Erreur : une window function est interdite dans `WHERE` ; calculer dans une CTE puis filtrer.",
      "explanation": "Les window functions sont calculées après `WHERE`. Correction : `WITH t AS (SELECT *, ROW_NUMBER() OVER (…) AS rn FROM transactions) SELECT * FROM t WHERE rn = 1`."
    },
    {
      "question": "[Piège LAG] `LAG(montant) OVER (ORDER BY client_id, date_tx)`, sans `PARTITION BY`. Que vaut la valeur pour la première transaction du client 2 ?",
      "options": [
        "`NULL`",
        "0",
        "Le montant de la dernière transaction du client 1.",
        "Le montant de sa propre transaction."
      ],
      "answer": "Le montant de la dernière transaction du client 1.",
      "explanation": "Sans `PARTITION BY client_id`, la fenêtre continue d'un client à l'autre. Avec `PARTITION BY`, on obtiendrait `NULL`."
    },
    {
      "question": "[LAG] Que renvoie `LAG(montant, 1, 0) OVER (PARTITION BY client_id ORDER BY date_tx)` pour la première transaction d'un client ?",
      "options": [
        "0",
        "`NULL`",
        "Le montant de la transaction suivante.",
        "Une erreur."
      ],
      "answer": "0",
      "explanation": "Le troisième argument est la valeur par défaut quand il n'y a pas de ligne précédente. Sans lui, on obtient `NULL`."
    },
    {
      "question": "[Cumul] Différence entre `SUM(montant) OVER (PARTITION BY client_id)` et `SUM(montant) OVER (PARTITION BY client_id ORDER BY date_tx)` ?",
      "options": [
        "Aucune.",
        "La seconde trie seulement l'affichage.",
        "La seconde provoque une erreur.",
        "La première donne le total du client sur chaque ligne ; la seconde un cumul progressif."
      ],
      "answer": "La première donne le total du client sur chaque ligne ; la seconde un cumul progressif.",
      "explanation": "Ajouter `ORDER BY` dans `OVER` change la fenêtre : elle va du début du groupe jusqu'à la ligne courante."
    },
    {
      "question": "[Piège RANGE] Deux transactions d'un client ont la même date. `SUM(montant) OVER (PARTITION BY client_id ORDER BY date_tx)` — Que se passe-t-il sur ces deux lignes ?",
      "options": [
        "Chacune a un cumul différent.",
        "Elles ont le même cumul : la fenêtre par défaut (`RANGE`) inclut toutes les lignes de même date.",
        "Erreur : dates en double.",
        "La seconde ligne vaut `NULL`."
      ],
      "answer": "Elles ont le même cumul : la fenêtre par défaut (`RANGE`) inclut toutes les lignes de même date.",
      "explanation": "Pour un cumul ligne à ligne : `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` et un tri unique (`ORDER BY date_tx, id`)."
    },
    {
      "question": "[GROUP BY + window] `SELECT region, SUM(ca) AS total, RANK() OVER (ORDER BY SUM(ca) DESC) AS rang FROM ventes GROUP BY region` — Ce code est…",
      "options": [
        "valide : il classe les régions selon leur total.",
        "invalide : on ne mélange pas `GROUP BY` et window function.",
        "invalide : il faut `PARTITION BY region`.",
        "valide, mais renvoie une ligne par vente."
      ],
      "answer": "valide : il classe les régions selon leur total.",
      "explanation": "La window function est calculée après le `GROUP BY` : elle s'applique aux lignes déjà agrégées (une par région)."
    },
    {
      "question": "[Deux requêtes] Dernière transaction de chaque client.\nA : CTE avec `ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY date_tx DESC) AS rn`, puis `WHERE rn = 1`\nB : jointure de `transactions` avec `(SELECT client_id, MAX(date_tx) AS dmax FROM transactions GROUP BY client_id)` sur client et date",
      "options": [
        "A et B sont toujours identiques.",
        "B seule est correcte.",
        "Identiques si la date max est unique ; sinon B renvoie plusieurs lignes pour le client.",
        "Aucune n'est correcte."
      ],
      "answer": "Identiques si la date max est unique ; sinon B renvoie plusieurs lignes pour le client.",
      "explanation": "`ROW_NUMBER` garantit une seule ligne. La jointure sur `MAX` renvoie toutes les transactions à la date max."
    }

  
  ],
  expert: [
       {
      "question": "[Deux requêtes] Variation du CA par rapport au mois précédent (mois numérotés 1, 2, 3… sans trou).\nA : `ca - LAG(ca) OVER (ORDER BY mois)`\nB : `v1.ca - v2.ca` avec `ventes v1 LEFT JOIN ventes v2 ON v2.mois = v1.mois - 1`",
      "options": [
        "A seule est correcte.",
        "A et B donnent le même résultat.",
        "B seule est correcte.",
        "Aucune n'est correcte."
      ],
      "answer": "A et B donnent le même résultat.",
      "explanation": "Jointure de la table sur elle-même = alternative classique à `LAG`. Le `LEFT JOIN` garde le premier mois (variation `NULL`, comme avec `LAG`)."
    },
    {
      "question": "[Deux requêtes] Cumul des montants par client (id croissant dans le temps).\nA : `SUM(montant) OVER (PARTITION BY client_id ORDER BY id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`\nB : `(SELECT SUM(t2.montant) FROM transactions t2 WHERE t2.client_id = t.client_id AND t2.id <= t.id)`",
      "options": [
        "A seule est correcte.",
        "B seule est correcte.",
        "Aucune n'est correcte.",
        "A et B donnent le même résultat ; A est plus performante."
      ],
      "answer": "A et B donnent le même résultat ; A est plus performante.",
      "explanation": "B (sous-requête corrélée) recalcule une somme pour chaque ligne. A parcourt chaque groupe une seule fois."
    },
    {
      "question": "[Deux requêtes] Les 3 meilleurs salaires de chaque département.\nA : CTE avec `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salaire DESC) AS rn`, puis `WHERE rn <= 3`\nB : `SELECT * FROM employes ORDER BY salaire DESC FETCH FIRST 3 ROWS ONLY`",
      "options": [
        "A seule est correcte : B donne le top 3 de toute l'entreprise.",
        "A et B donnent le même résultat.",
        "B seule est correcte.",
        "Aucune n'est correcte."
      ],
      "answer": "A seule est correcte : B donne le top 3 de toute l'entreprise.",
      "explanation": "`FETCH FIRST` limite le résultat global. Le « par département » demande un classement dans chaque partition."
    },
    {
      "question": "[Deux requêtes] Repérer les doublons sur (client_id, date_tx, montant).\nA : `ROW_NUMBER() OVER (PARTITION BY client_id, date_tx, montant ORDER BY id) AS rn`, puis `WHERE rn > 1`\nB : `GROUP BY client_id, date_tx, montant HAVING COUNT(*) > 1`",
      "options": [
        "A et B renvoient exactement les mêmes lignes.",
        "Les deux détectent les doublons : A renvoie chaque ligne en trop (avec son id), B une ligne par combinaison en double.",
        "Seule B détecte les doublons.",
        "Seule A détecte les doublons."
      ],
      "answer": "Les deux détectent les doublons : A renvoie chaque ligne en trop (avec son id), B une ligne par combinaison en double.",
      "explanation": "A est utile pour supprimer les lignes en trop (on connaît leur id). B est utile pour compter les combinaisons dupliquées."
    },
    {
      "question": "[OVER vide] Que renvoie `COUNT(*) OVER ()` sur chaque ligne ?",
      "options": [
        "1",
        "Le nombre de lignes du client.",
        "Le nombre total de lignes du résultat.",
        "Une erreur."
      ],
      "answer": "Le nombre total de lignes du résultat.",
      "explanation": "`OVER ()` sans `PARTITION BY` : la fenêtre est tout le résultat. Pratique pour un pourcentage du total général."
    },
    {
      "question": "[FIRST_VALUE] `FIRST_VALUE(montant) OVER (PARTITION BY client_id ORDER BY date_tx)` renvoie…",
      "options": [
        "le montant de la transaction courante.",
        "le montant le plus élevé du client.",
        "la somme des montants du client.",
        "le montant de la première transaction du client."
      ],
      "answer": "le montant de la première transaction du client.",
      "explanation": "`FIRST_VALUE` lit la première ligne de la fenêtre dans l'ordre choisi. Attention : `LAST_VALUE` avec la fenêtre par défaut renvoie la ligne courante."
    }
  ]
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

const Page_GitHubDeploy = () => {
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
            Microservices · JSON · MSMQ · async · LINQ 🔹 {level === "basic"
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

export default Page_GitHubDeploy;


