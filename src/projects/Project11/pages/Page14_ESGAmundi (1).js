// src/projects/Project3/pages/Page14_ESGAmundi.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "ESG — Les Fondamentaux",
    "answer": "**ESG = Environnemental, Social, Gouvernance** — critères extra-financiers pour évaluer une entreprise au-delà de ses résultats financiers. ◆ **E — Environnemental** : émissions CO₂, consommation d'eau et d'énergie, biodiversité, déchets, stratégie climatique. ◆ **S — Social** : conditions de travail, droits humains, égalité H/F, santé/sécurité, relations avec les communautés locales, diversité. ◆ **G — Gouvernance** : composition du conseil d'administration, rémunération des dirigeants, lutte contre la corruption, transparence, droits des actionnaires. ◆ **ISR (Investissement Socialement Responsable)** : approche d'investissement intégrant les critères ESG dans les décisions de portefeuille. ESG = les critères. ISR = la démarche d'investissement qui les utilise. ◆ **Notation ESG** : les agences (MSCI ESG, Sustainalytics, Moody's ESG, ISS) attribuent un score à chaque entreprise. Les méthodologies diffèrent → scores souvent divergents entre agences. ◆ **Extra-financier** : ne pas confondre avec 'non financier' — ces critères ont un impact financier réel (risque de réputation, risque réglementaire, risque opérationnel)."
  },
  {
    "question": "ESG — Stratégies d'Investissement & Labels",
    "answer": "**Stratégies ESG principales** : ◆ **Best-in-class** : sélectionner les meilleures entreprises ESG de chaque secteur, y compris les secteurs controversés (pétrole, tabac). ◆ **Best-in-universe** : sélectionner les meilleures ESG tous secteurs confondus → exclut naturellement les secteurs les moins vertueux. ◆ **Exclusions normatives** : exclure les entreprises violant les conventions internationales (OIT, ONU). ◆ **Exclusions sectorielles** : armes controversées, charbon thermique, tabac. ◆ **Impact investing** : investir dans des projets à impact social/environnemental mesurable et intentionnel. Plus exigeant que l'ESG classique. ◆ **Engagement actionnarial** : exercer ses droits de vote en AG pour influencer les pratiques ESG des entreprises. Amundi = l'un des acteurs les plus actifs en engagement. ◆ **Label ISR français** : créé par le gouvernement, attribué aux fonds intégrant sérieusement l'ESG. Réformé en 2024. ◆ **Label Greenfin** : spécifique à la transition énergétique et écologique, plus strict, exclut le nucléaire et les énergies fossiles."
  },
  {
    "question": "ESG — Réglementation européenne (SFDR, CSRD, Taxonomie)",
    "answer": "**SFDR (Sustainable Finance Disclosure Regulation)** : règlement européen de transparence. ◆ **Article 6** : fonds sans caractéristiques ESG particulières. ◆ **Article 8** : fonds qui 'promeuvent' des caractéristiques E ou S. ◆ **Article 9** : fonds avec un objectif d'investissement durable explicite (le plus strict). ◆ **Taxonomie européenne** : classification des activités économiques 'durables'. 6 objectifs environnementaux (neutralité carbone, biodiversité, eau...). Une activité est 'verte' si elle contribue à un objectif sans en nuire à un autre (DNSH - Do No Significant Harm). ◆ **CSRD (Corporate Sustainability Reporting Directive)** : remplace la NFRD. Obligation pour les grandes entreprises de publier un rapport de durabilité standardisé (ESRS). Couvre les entreprises cotées + grandes PME. ◆ **Double matérialité** : les entreprises doivent reporter sur l'impact du climat sur elles (risques financiers) ET leur impact sur le climat (impact society). ◆ **Greenwashing** : communication trompeuse sur les vertus ESG d'un produit ou d'une entreprise. L'ESMA et l'AMF luttent activement contre cette pratique."
  },
  {
    "question": "Amundi — Entreprise, ESG & IT",
    "answer": "**Amundi en chiffres** : ~2 400 Mds€ d'AUM (Assets Under Management), leader européen de la gestion d'actifs, Top 10 mondial, +200M clients, ~7 000 employés. ◆ **Actionnariat** : filiale du groupe Crédit Agricole (majoritaire), société cotée en Bourse. **CEO** : Valérie Baudson. ◆ **Produits** : fonds actifs, ETF (Lyxor intégré en 2022 → Amundi ETF leader européen), fonds ISR, fonds impact, solutions retraite. ◆ **ESG chez Amundi** : pionnier de l'investissement responsable. Stratégie ESG intégrée à tous les fonds depuis 2021. 1er gestionnaire mondial à s'être engagé sur une politique charbon. Engagement actionnarial actif : vote dans +3 000 AG/an. ◆ **Équipe Responsible Investment** : dédiée à la recherche ESG, aux politiques de vote, aux engagements avec les entreprises, au développement des outils de scoring. ◆ **Amundi Technology (AMT)** : entité IT interne. Développe des outils data/ESG pour les équipes métier et des clients externes. Stack : Python, TypeScript, Angular, SQL, REST APIs, CI/CD (GitHub Actions, ArgoCD), monitoring (Grafana, Splunk). ◆ **MOE/Dev chez AMT** : construire et faire évoluer les outils ESG, >80% de couverture en tests, TDD/BDD, craftsmanship, agile (squads de ~3 devs + 1 PO)."
  }
];

const questions = {
  moyen: [
    // ── ESG (25 questions) ──
    {
      "question": "[ESG] Que signifient les lettres E, S et G dans ESG ?",
      "options": [
        "Économique, Social, Géopolitique",
        "Environnemental, Social, Gouvernance — les trois piliers d'évaluation extra-financière d'une entreprise.",
        "Éthique, Solidaire, Global",
        "Environnemental, Sociétal, Gérable"
      ],
      "answer": "Environnemental, Social, Gouvernance — les trois piliers d'évaluation extra-financière d'une entreprise.",
      "explanation": "E : émissions CO₂, consommation d'eau/énergie, biodiversité, déchets. S : conditions de travail, droits humains, égalité H/F, diversité. G : composition du CA, rémunération des dirigeants, lutte contre la corruption, droits des actionnaires. Ces critères permettent d'évaluer une entreprise au-delà de ses seuls résultats financiers. Amundi les intègre dans sa politique d'investissement sur l'ensemble de ses fonds depuis 2021."
    },
    {
      "question": "[ESG] Quelle est la différence entre ESG et ISR ?",
      "options": [
        "ESG et ISR sont exactement synonymes.",
        "ESG désigne les critères (Environnemental, Social, Gouvernance). ISR (Investissement Socialement Responsable) est la démarche d'investissement qui intègre ces critères.",
        "L'ISR est une version plus stricte de l'ESG avec des exclusions obligatoires.",
        "ESG est européen, ISR est américain."
      ],
      "answer": "ESG désigne les critères (Environnemental, Social, Gouvernance). ISR (Investissement Socialement Responsable) est la démarche d'investissement qui intègre ces critères.",
      "explanation": "Les critères ESG sont des outils d'analyse. L'ISR est une philosophie d'investissement qui utilise ces critères pour construire des portefeuilles. Un fonds ISR peut utiliser différentes approches : best-in-class (sélectionner les meilleurs de chaque secteur), exclusions (exclure certains secteurs), ou impact investing (investir dans des projets à impact mesurable). En entretien chez Amundi : montrer qu'on comprend cette distinction."
    },
    {
      "question": "[ESG] Qu'est-ce que la stratégie 'Best-in-class' ?",
      "options": [
        "Sélectionner uniquement les entreprises du secteur technologique.",
        "Sélectionner les entreprises avec le meilleur score ESG au sein de chaque secteur — y compris les secteurs controversés comme le pétrole ou le tabac.",
        "Exclure tous les secteurs controversés et ne garder que les secteurs vertueux.",
        "Investir uniquement dans les entreprises avec un score ESG parfait."
      ],
      "answer": "Sélectionner les entreprises avec le meilleur score ESG au sein de chaque secteur — y compris les secteurs controversés comme le pétrole ou le tabac.",
      "explanation": "Best-in-class : dans chaque secteur (pétrole, tabac, armement léger...), on sélectionne l'entreprise la plus vertueuse sur les critères ESG. Avantage : maintenir une diversification sectorielle. Critique : on peut investir dans des entreprises polluantes si elles sont 'les moins mauvaises' de leur secteur. Différence avec best-in-universe : cette stratégie sélectionne les meilleures entreprises tous secteurs confondus, excluant naturellement les secteurs les moins vertueux. Amundi utilise les deux approches selon les fonds."
    },
    {
      "question": "[ESG] Qu'est-ce que le greenwashing ?",
      "options": [
        "Un processus de nettoyage environnemental des usines.",
        "Une communication trompeuse sur les vertus environnementales ou ESG d'un produit, d'un fonds ou d'une entreprise — sans que la réalité ne le justifie.",
        "Un label officiel pour les fonds verts.",
        "Une technique de blanchiment des émissions carbone."
      ],
      "answer": "Une communication trompeuse sur les vertus environnementales ou ESG d'un produit, d'un fonds ou d'une entreprise — sans que la réalité ne le justifie.",
      "explanation": "Exemples de greenwashing : un fonds se présentant comme 'vert' mais investissant dans des entreprises fortement carbonées, une entreprise communiquant sur ses actions climatiques sans réduire réellement ses émissions. Les régulateurs (AMF en France, ESMA en Europe) intensifient la surveillance. La réglementation SFDR impose des exigences de transparence pour limiter le greenwashing sur les fonds. Amundi, en tant que leader de l'ISR, s'est engagé à documenter et justifier toutes ses positions ESG."
    },
    {
      "question": "[ESG] Que signifie SFDR Article 8 ?",
      "options": [
        "Un fonds qui exclut toutes les entreprises non durables.",
        "Un fonds qui 'promeut' des caractéristiques environnementales ou sociales — pas d'objectif durable explicite mais des critères ESG intégrés dans la sélection.",
        "Un fonds sans aucune caractéristique ESG — destiné au grand public.",
        "Un fonds avec un objectif d'investissement durable explicite et mesurable."
      ],
      "answer": "Un fonds qui 'promeut' des caractéristiques environnementales ou sociales — pas d'objectif durable explicite mais des critères ESG intégrés dans la sélection.",
      "explanation": "SFDR (Sustainable Finance Disclosure Regulation) : règlement européen de transparence sur la finance durable. Article 6 : fonds sans caractéristiques ESG particulières (fonds conventionnels). Article 8 : fonds qui 'promeuvent' des caractéristiques E ou S — ESG intégré dans le processus de sélection. Article 9 : fonds avec un objectif d'investissement durable explicite (le plus contraignant, ex: fonds 100% aligné sur la taxonomie). Amundi a classifié la majorité de ses fonds en Article 8 et 9."
    },
    {
      "question": "[ESG] Qu'est-ce que la 'double matérialité' imposée par la CSRD ?",
      "options": [
        "L'obligation de publier deux rapports financiers par an.",
        "Les entreprises doivent reporter sur l'impact du changement climatique sur leur activité (matérialité financière) ET sur leur propre impact sur le climat et la société (matérialité d'impact).",
        "La double vérification des données ESG par deux agences indépendantes.",
        "L'obligation de matérialiser les risques ESG dans les comptes financiers."
      ],
      "answer": "Les entreprises doivent reporter sur l'impact du changement climatique sur leur activité (matérialité financière) ET sur leur propre impact sur le climat et la société (matérialité d'impact).",
      "explanation": "CSRD (Corporate Sustainability Reporting Directive) remplace la NFRD depuis 2024. Double matérialité : 1) Outside-in : comment les enjeux ESG affectent l'entreprise (risques et opportunités financiers). 2) Inside-out : comment l'entreprise affecte l'environnement et la société (externalités). Les deux dimensions sont obligatoires. Cela oblige les entreprises à être transparentes sur leurs impacts réels, pas seulement sur les risques qu'elles subissent. Amundi utilise ces données pour affiner ses scores ESG."
    },
    {
      "question": "[ESG] Qu'est-ce que l'engagement actionnarial en ESG ?",
      "options": [
        "Vendre ses actions dans les entreprises qui ne respectent pas l'ESG.",
        "Exercer ses droits de vote en Assemblée Générale et dialoguer avec les dirigeants pour influencer les pratiques ESG des entreprises en portefeuille.",
        "Signer des pétitions contre les entreprises polluantes.",
        "Publier des rapports publics critiques sur les entreprises."
      ],
      "answer": "Exercer ses droits de vote en Assemblée Générale et dialoguer avec les dirigeants pour influencer les pratiques ESG des entreprises en portefeuille.",
      "explanation": "L'engagement (ou stewardship) est une alternative à la désinvestissement : plutôt que de vendre les actions des entreprises non-vertueuses, on les conserve pour exercer une influence. Deux leviers : 1) Vote en AG : résolutions sur la rémunération, la diversité, les objectifs climatiques. 2) Dialogue direct avec les dirigeants. Amundi est l'un des acteurs les plus actifs en Europe : vote dans +3 000 AG par an, co-dépôt de résolutions. C'est une dimension clé du Responsible Investment chez Amundi."
    },
    {
      "question": "[ESG] Quelle est la différence entre le Label ISR français et le Label Greenfin ?",
      "options": [
        "Les deux sont identiques — créés par le même organisme.",
        "Label ISR : attribué aux fonds intégrant sérieusement l'ESG dans tous les secteurs. Greenfin : spécifique à la transition énergétique, plus strict, exclut le nucléaire et les énergies fossiles.",
        "Greenfin est un label européen, ISR est mondial.",
        "Label ISR est uniquement pour les fonds actions, Greenfin pour les fonds obligataires."
      ],
      "answer": "Label ISR : attribué aux fonds intégrant sérieusement l'ESG dans tous les secteurs. Greenfin : spécifique à la transition énergétique, plus strict, exclut le nucléaire et les énergies fossiles.",
      "explanation": "Label ISR (créé par le gouvernement français en 2016, réformé en 2024) : applicable à tous types de fonds, vérifie la méthodologie ESG, la transparence et la gestion des controverses. Greenfin (ex-label TEEC, créé en 2015 par le Ministère de l'Environnement) : orienté financement de la transition énergétique et écologique. Exclut le nucléaire, les énergies fossiles. Plus restrictif sur les activités finançables. Amundi gère des fonds labellisés ISR et Greenfin. En entretien : montrer qu'on connaît ces labels spécifiques au marché français."
    },
    {
      "question": "[ESG] Qu'est-ce qu'un score ESG et comment est-il calculé ?",
      "options": [
        "Un score attribué par les gouvernements aux entreprises cotées.",
        "Une note attribuée par des agences spécialisées (MSCI, Sustainalytics, ISS) à partir de données publiques et questionnaires — évalue les pratiques E, S et G de l'entreprise.",
        "Un score calculé uniquement à partir du bilan carbone de l'entreprise.",
        "Un score financier qui intègre les risques ESG dans le compte de résultat."
      ],
      "answer": "Une note attribuée par des agences spécialisées (MSCI, Sustainalytics, ISS) à partir de données publiques et questionnaires — évalue les pratiques E, S et G de l'entreprise.",
      "explanation": "Agences principales : MSCI ESG Research (notation AAA à CCC), Sustainalytics (score de risque), ISS ESG, Moody's ESG, S&P Global. Données sources : rapports annuels, rapports de durabilité, questionnaires, médias, bases de données de controverses. Problème : les méthodologies divergent fortement entre agences → une même entreprise peut avoir un bon score chez MSCI et mauvais chez Sustainalytics. Amundi développe ses propres scores ESG propriétaires pour ne pas dépendre uniquement des agences."
    },
    {
      "question": "[ESG] Qu'est-ce que la Taxonomie européenne ?",
      "options": [
        "Un classement des entreprises par secteur d'activité.",
        "Un système de classification européen qui définit quelles activités économiques sont considérées 'durables' selon 6 objectifs environnementaux et le principe DNSH.",
        "Un label pour les fonds verts européens.",
        "Une liste d'exclusions sectorielles obligatoires pour les fonds ESG."
      ],
      "answer": "Un système de classification européen qui définit quelles activités économiques sont considérées 'durables' selon 6 objectifs environnementaux et le principe DNSH.",
      "explanation": "6 objectifs de la Taxonomie : 1) Atténuation du changement climatique. 2) Adaptation au changement climatique. 3) Utilisation durable de l'eau. 4) Transition vers une économie circulaire. 5) Prévention de la pollution. 6) Protection de la biodiversité. DNSH (Do No Significant Harm) : une activité ne peut être classée verte si elle nuit à l'un des 5 autres objectifs. Utilisée par les fonds Art.9 SFDR pour justifier leurs investissements. Amundi intègre l'alignement taxonomique dans sa gestion."
    },
    {
      "question": "[ESG] Qu'est-ce que l'impact investing et en quoi diffère-t-il de l'ESG classique ?",
      "options": [
        "L'impact investing est identique à l'ESG — c'est juste un terme marketing.",
        "L'impact investing recherche un impact social ou environnemental positif, intentionnel et mesurable — plus exigeant que l'ESG qui vise surtout à éviter les entreprises à risques.",
        "L'impact investing exclut les entreprises cotées en bourse.",
        "L'impact investing est réservé aux investisseurs institutionnels."
      ],
      "answer": "L'impact investing recherche un impact social ou environnemental positif, intentionnel et mesurable — plus exigeant que l'ESG qui vise surtout à éviter les entreprises à risques.",
      "explanation": "ESG classique : sélectionner les entreprises avec les meilleures pratiques, éviter les risques extra-financiers. Impact investing : 3 critères clés — intentionnalité (l'impact est voulu), additivité (l'investissement crée un impact qui n'aurait pas existé sans lui), mesurabilité (indicateurs d'impact définis et suivis). Exemples : obligations vertes (green bonds) pour financer des projets d'énergies renouvelables, fonds investissant dans l'accès à l'eau potable en Afrique. Amundi propose des solutions d'impact investing via ses partenariats (ex: avec l'IFC)."
    },
    {
      "question": "[ESG] Que sont les controverses ESG ?",
      "options": [
        "Des débats académiques sur la pertinence de l'ESG.",
        "Des incidents négatifs liés aux pratiques E, S ou G d'une entreprise (scandales sociaux, accidents environnementaux, fraudes...) — qui peuvent impacter le score ESG et la décision d'investissement.",
        "Des désaccords entre agences de notation ESG sur les scores.",
        "Des plaintes déposées par des actionnaires contre les dirigeants."
      ],
      "answer": "Des incidents négatifs liés aux pratiques E, S ou G d'une entreprise (scandales sociaux, accidents environnementaux, fraudes...) — qui peuvent impacter le score ESG et la décision d'investissement.",
      "explanation": "Exemples : scandale Dieselgate (Volkswagen → controverse environnementale), travail forcé dans la chaîne d'approvisionnement (Nike → controverse sociale), rémunération abusive des dirigeants (Renault → controverse gouvernance). Les agences ESG maintiennent des bases de données de controverses actualisées en temps réel. Amundi intègre les controverses dans ses scores ESG propriétaires et peut exclure une entreprise suite à une controverse grave, ou lancer un dialogue d'engagement."
    },
    {
      "question": "[ESG] Qu'est-ce qu'une exclusion normative en ESG ?",
      "options": [
        "Exclure les entreprises qui ne publient pas de rapport ESG.",
        "Exclure les entreprises qui violent les conventions et normes internationales reconnues (OIT, Pacte Mondial ONU, Principes Directeurs ONU sur les entreprises et les droits de l'homme).",
        "Exclure les entreprises avec un score ESG inférieur à un seuil fixé.",
        "Exclure un secteur entier comme le tabac ou les armes."
      ],
      "answer": "Exclure les entreprises qui violent les conventions et normes internationales reconnues (OIT, Pacte Mondial ONU, Principes Directeurs ONU sur les entreprises et les droits de l'homme).",
      "explanation": "Exclusions normatives = filtres basés sur le comportement de l'entreprise par rapport aux normes internationales. Contrairement aux exclusions sectorielles (qui éliminent un secteur entier), les exclusions normatives ciblent des entreprises spécifiques, peu importe leur secteur. Exemples de violations : travail des enfants, travail forcé, atteintes graves à l'environnement, corruption systémique. Amundi applique des exclusions normatives à tous ses fonds — les entreprises violant le Pacte Mondial ONU sont écartées."
    },
    {
      "question": "[ESG] Qu'est-ce qu'un green bond (obligation verte) ?",
      "options": [
        "Une action d'entreprise dont l'activité principale est verte.",
        "Une obligation dont les fonds levés sont exclusivement destinés à financer des projets ayant un bénéfice environnemental — énergies renouvelables, efficacité énergétique, transports propres.",
        "Un instrument financier garanti par l'État pour les projets verts.",
        "Un fonds d'investissement spécialisé dans les entreprises écologiques."
      ],
      "answer": "Une obligation dont les fonds levés sont exclusivement destinés à financer des projets ayant un bénéfice environnemental — énergies renouvelables, efficacité énergétique, transports propres.",
      "explanation": "Green bonds : émis par des États, collectivités, entreprises pour financer des projets verts. Les fonds sont fléchés (ring-fenced) — on peut tracer l'utilisation du capital. Encadrés par les Green Bond Principles (ICMA). Marché en forte croissance. Social bonds : même principe pour des projets sociaux. Sustainability bonds : mix E+S. Sustainability-linked bonds : le coupon varie selon l'atteinte d'objectifs ESG (plus innovant mais plus complexe à vérifier). Amundi est un acteur majeur de ce marché via ses fonds obligataires ISR."
    },
    {
      "question": "[ESG] Quelle est la principale critique faite aux agences de notation ESG ?",
      "options": [
        "Elles sont trop transparentes sur leurs méthodologies.",
        "Leurs scores divergent fortement entre agences pour la même entreprise — manque de standardisation des méthodologies et des données source.",
        "Elles sont trop lentes à publier leurs scores.",
        "Elles ne couvrent pas les petites capitalisations."
      ],
      "answer": "Leurs scores divergent fortement entre agences pour la même entreprise — manque de standardisation des méthodologies et des données source.",
      "explanation": "Étude MIT (2019) : la corrélation entre les scores ESG des différentes agences est de seulement ~0.5 (vs ~0.9 pour les notations de crédit). Une même entreprise peut être 'leader ESG' chez MSCI et 'à risque élevé' chez Sustainalytics. Causes : définitions différentes des critères ESG, pondération différente des piliers E/S/G, sources de données différentes (déclaratif vs observé). C'est pourquoi Amundi a développé ses propres modèles de scoring ESG propriétaires — pour ne pas dépendre aveuglément des agences."
    },
    {
      "question": "[ESG] Qu'est-ce que le Net Zero et l'Accord de Paris dans le contexte ESG ?",
      "options": [
        "Des objectifs de performance financière pour les fonds verts.",
        "L'Accord de Paris (2015) vise à limiter le réchauffement à +1.5°C. Net Zero = atteindre la neutralité carbone (émissions = absorptions) d'ici 2050 pour les entreprises et les États.",
        "Des labels ESG pour les entreprises engagées dans la réduction de leurs émissions.",
        "Des indicateurs de mesure de la biodiversité utilisés en ESG."
      ],
      "answer": "L'Accord de Paris (2015) vise à limiter le réchauffement à +1.5°C. Net Zero = atteindre la neutralité carbone (émissions = absorptions) d'ici 2050 pour les entreprises et les États.",
      "explanation": "Accord de Paris : 196 pays s'engagent à maintenir le réchauffement bien en dessous de +2°C, idéalement +1.5°C. Net Zero 2050 : les entreprises s'engagent à réduire drastiquement leurs émissions (scopes 1, 2 et 3) et à compenser le résiduel. Net Zero Asset Managers Initiative : coalition dont Amundi fait partie — engagement à aligner les portefeuilles sur Net Zero. Scopes d'émissions : Scope 1 (émissions directes), Scope 2 (électricité achetée), Scope 3 (toute la chaîne de valeur — le plus complexe à mesurer)."
    },
    {
      "question": "[ESG] Qu'est-ce que l'indice de référence climatique PAB (Paris-Aligned Benchmark) ?",
      "options": [
        "Un classement des villes les plus vertueuses climatiquement.",
        "Un indice boursier dont la construction exclut les entreprises incompatibles avec l'Accord de Paris et réduit l'intensité carbone de 50% vs un indice classique, avec une réduction de 7%/an.",
        "Un benchmark de performance des fonds ISR.",
        "Un outil de mesure des émissions Scope 3 des entreprises."
      ],
      "answer": "Un indice boursier dont la construction exclut les entreprises incompatibles avec l'Accord de Paris et réduit l'intensité carbone de 50% vs un indice classique, avec une réduction de 7%/an.",
      "explanation": "PAB (Paris-Aligned Benchmark) et CTB (Climate Transition Benchmark) : définis par la réglementation européenne 2019. PAB : le plus strict — 50% de réduction carbone vs l'indice parent + 7%/an. Exclut les secteurs les plus émetteurs (charbon, hydrocarbures). CTB : 30% de réduction + 7%/an, moins d'exclusions. Amundi utilise ces benchmarks pour ses ETF ESG et fonds climatiques. En entretien chez Amundi IT ESG : ces indices sont des données clés pour les outils que l'équipe développe."
    },
    {
      "question": "[ESG] Qu'est-ce que le reporting ESG d'une entreprise ?",
      "options": [
        "La publication des résultats financiers en incluant une section ESG.",
        "La publication d'informations extra-financières sur les pratiques E, S et G de l'entreprise — rendu obligatoire pour les grandes entreprises par la CSRD via les normes ESRS.",
        "Un rapport interne destiné uniquement aux actionnaires.",
        "La notation annuelle de l'entreprise par les agences ESG."
      ],
      "answer": "La publication d'informations extra-financières sur les pratiques E, S et G de l'entreprise — rendu obligatoire pour les grandes entreprises par la CSRD via les normes ESRS.",
      "explanation": "CSRD impose les ESRS (European Sustainability Reporting Standards) : standards précis sur ce qui doit être reporté (émissions GES, politique de diversité, gouvernance...). Le rapport doit être intégré dans le rapport annuel (pas séparé) et audité par un tiers. Calendrier : les grandes entreprises cotées depuis 2024, les PME cotées à partir de 2026. Ce reporting est une source de données primaire pour les outils IT ESG d'Amundi — l'équipe dans laquelle tu postules traite ces données."
    },
    {
      "question": "[ESG] Que mesure l'empreinte carbone d'un portefeuille ?",
      "options": [
        "Le bilan carbone du gestionnaire d'actifs.",
        "Les émissions de gaz à effet de serre (GES) des entreprises dans lesquelles le portefeuille investit, pondérées par la part de détention — exprimées en tonnes CO₂ équivalent.",
        "Les émissions compensées par le portefeuille via des crédits carbone.",
        "La contribution du portefeuille à la reforestation mondiale."
      ],
      "answer": "Les émissions de gaz à effet de serre (GES) des entreprises dans lesquelles le portefeuille investit, pondérées par la part de détention — exprimées en tonnes CO₂ équivalent.",
      "explanation": "Indicateurs courants : empreinte carbone (tCO₂e / M€ investis), intensité carbone (tCO₂e / M€ de revenus), température implicite du portefeuille (de combien de degrés la planète se réchaufferait si toutes les entreprises avaient ce profil d'émissions). Scopes inclus : Scope 1+2 obligatoires, Scope 3 recommandé (mais données moins fiables). Amundi calcule et publie l'empreinte carbone de ses fonds. En entretien : connaître ces indicateurs montre une maîtrise concrète de l'ESG."
    },
    {
      "question": "[ESG] Qu'est-ce que la biodiversité comme enjeu ESG et comment est-elle mesurée ?",
      "options": [
        "La biodiversité n'est pas encore un critère ESG reconnu.",
        "L'impact des entreprises sur les écosystèmes et la diversité du vivant — mesurée par des frameworks comme TNFD (Taskforce on Nature-related Financial Disclosures) et des indicateurs comme MSA (Mean Species Abundance).",
        "La diversité des espèces d'animaux dans les bureaux des entreprises.",
        "Un indicateur uniquement applicable aux entreprises agricoles."
      ],
      "answer": "L'impact des entreprises sur les écosystèmes et la diversité du vivant — mesurée par des frameworks comme TNFD (Taskforce on Nature-related Financial Disclosures) et des indicateurs comme MSA (Mean Species Abundance).",
      "explanation": "La biodiversité est le 'nouveau front' de l'ESG après le climat. COP15 (Kunming-Montréal 2022) : cadre mondial pour la biodiversité. TNFD : framework de reporting sur la nature (analogue au TCFD pour le climat). Indicateurs : empreinte sur la biodiversité (MSA.km²), dépendance aux services écosystémiques. Amundi s'est engagé sur la biodiversité — ses outils ESG intègrent de plus en plus ces données. Enjeu IT : ces nouvelles sources de données doivent être intégrées dans les systèmes de l'équipe."
    },
    {
      "question": "[ESG] Qu'est-ce que le principe 'you build it, you run it' mentionné dans la mission Amundi ?",
      "options": [
        "Chaque équipe développe et maintient en production les systèmes qu'elle a construits — responsabilité end-to-end incluant le monitoring et le support prod.",
        "Chaque développeur doit reconstruire le système s'il y a un incident.",
        "Les équipes doivent documenter tout ce qu'elles construisent.",
        "Les devs doivent tester leurs propres fonctionnalités avant livraison."
      ],
      "answer": "Chaque équipe développe et maintient en production les systèmes qu'elle a construits — responsabilité end-to-end incluant le monitoring et le support prod.",
      "explanation": "Principe DevOps fondamental. Contrairement au modèle traditionnel (dev construit, ops maintient), en 'you build it, you run it' : les développeurs sont responsables de leurs systèmes en production. Conséquences : forte culture du monitoring (ArgoCD, Grafana, Splunk chez Amundi), alertes, on-call, amélioration continue. Avantage : les développeurs comprennent mieux les besoins de fiabilité et de maintenabilité. Chez Amundi AMT : participation active aux mises en production et suivi de la santé des outils ESG en prod."
    },
    {
      "question": "[ESG] Qu'est-ce que le TCFD et pourquoi est-il important pour l'ESG ?",
      "options": [
        "Task Force on Climate-related Financial Disclosures — framework international de reporting sur les risques et opportunités financiers liés au climat.",
        "Technical Committee for Financial Data — comité de standardisation des données financières.",
        "Total Carbon Financial Disclosure — méthode de comptabilité carbone pour les entreprises.",
        "TCFD est un label européen pour les fonds investissant dans la transition."
      ],
      "answer": "Task Force on Climate-related Financial Disclosures — framework international de reporting sur les risques et opportunités financiers liés au climat.",
      "explanation": "TCFD (créé par le FSB en 2015) : framework en 4 piliers — Gouvernance (comment l'entreprise gère les risques climatiques), Stratégie (impact sur l'activité), Gestion des risques (processus d'identification), Métriques & cibles (KPIs climatiques). Devenu quasi-obligatoire dans de nombreux pays (UK, Japon, Canada). Intégré dans la CSRD européenne via les ESRS. Amundi utilise les disclosures TCFD de ses entreprises en portefeuille pour évaluer leur stratégie climatique. En entretien : connaître TCFD montre une maîtrise avancée de l'ESG."
    },
    {
      "question": "[ESG] Quels sont les principaux risques ESG pour un investisseur ?",
      "options": [
        "Les risques ESG ne sont pas des risques financiers réels.",
        "Risques physiques (actifs exposés au changement climatique), risques de transition (stranded assets, nouvelles réglementations), risques de réputation (controverses), risques litigieux (procès climatiques).",
        "Uniquement le risque de réputation en cas de scandale médiatique.",
        "Les risques ESG ne concernent que les fonds classifiés Article 9."
      ],
      "answer": "Risques physiques (actifs exposés au changement climatique), risques de transition (stranded assets, nouvelles réglementations), risques de réputation (controverses), risques litigieux (procès climatiques).",
      "explanation": "Risques physiques : inondations, sécheresses affectant les actifs (ex: usine en zone inondable). Risques de transition : une centrale à charbon peut devenir un stranded asset (actif échoué) à cause des nouvelles réglementations. Risques de réputation : controverse ESG → fuite de clients, baissoursement de l'action. Risques litigieux : les procès climatiques contre les entreprises se multiplient (Total, Shell). Ces risques sont désormais intégrés dans les modèles de valorisation des asset managers comme Amundi."
    },
    {
      "question": "[ESG] Qu'est-ce que la gestion passive ESG (ETF ESG) ?",
      "options": [
        "Des ETF qui n'investissent pas dans les entreprises ESG.",
        "Des fonds indiciels (ETF) qui répliquent un indice ESG — comme l'MSCI World ESG Leaders ou un indice PAB — en appliquant des filtres ESG à l'indice parent.",
        "Une stratégie où le gestionnaire ne vote pas en AG pour rester neutre.",
        "Des ETF qui passent automatiquement en gestion active en cas de crise ESG."
      ],
      "answer": "Des fonds indiciels (ETF) qui répliquent un indice ESG — comme l'MSCI World ESG Leaders ou un indice PAB — en appliquant des filtres ESG à l'indice parent.",
      "explanation": "ETF ESG : la sélection des entreprises suit un indice ESG prédéfini. Avantages : coûts réduits (pas de gestion active), transparence, liquidité. Amundi est le leader européen des ETF ESG depuis l'intégration de Lyxor en 2022. Gamme Amundi ETF ESG : réplique des indices MSCI ESG, MSCI Low Carbon, PAB, CTB. Différence avec la gestion active ESG : dans les fonds actifs, le gérant choisit les titres selon sa propre analyse ESG, pouvant s'écarter de l'indice. Chez Amundi : les deux approches coexistent."
    },
    {
      "question": "[ESG] Qu'est-ce que la gouvernance d'entreprise (pilier G de l'ESG) ?",
      "options": [
        "La stratégie de croissance de l'entreprise.",
        "La manière dont l'entreprise est dirigée et contrôlée : composition et indépendance du CA, rémunération des dirigeants, droits des actionnaires, transparence, lutte contre la corruption.",
        "La politique de communication externe de l'entreprise.",
        "La gouvernance informatique et la cybersécurité."
      ],
      "answer": "La manière dont l'entreprise est dirigée et contrôlée : composition et indépendance du CA, rémunération des dirigeants, droits des actionnaires, transparence, lutte contre la corruption.",
      "explanation": "Critères G clés : % d'administrateurs indépendants, séparation PDG/Président du CA, diversité du CA (genre, compétences), politique de rémunération des dirigeants (Say on Pay en AG), audit et contrôle interne, éthique des affaires et anti-corruption. Amundi vote systématiquement contre les rémunérations excessives et pour l'indépendance des CA en AG. La gouvernance est souvent le pilier le plus mesurable et le plus lié à la performance financière à long terme."
    },

    // ── AMUNDI (10 questions) ──
    {
      "question": "[Amundi] Quel est le montant des actifs sous gestion (AUM) d'Amundi ?",
      "options": [
        "Environ 500 milliards d'euros.",
        "Environ 2 400 milliards d'euros — ce qui en fait le leader européen de la gestion d'actifs et un acteur du Top 10 mondial.",
        "Environ 10 000 milliards d'euros.",
        "Environ 100 milliards d'euros."
      ],
      "answer": "Environ 2 400 milliards d'euros — ce qui en fait le leader européen de la gestion d'actifs et un acteur du Top 10 mondial.",
      "explanation": "Amundi gère environ 2 400 milliards € d'actifs sous gestion (AUM = Assets Under Management). C'est le 1er gestionnaire d'actifs européen et dans le Top 10 mondial. Pour comparaison : BlackRock (US) gère ~10 000 Mds$. Amundi a +200 millions de clients et ~7 000 employés dans le monde. Ces chiffres clés sont à connaître pour tout entretien chez Amundi — ils montrent l'échelle de l'entreprise et l'impact de chaque décision d'investissement."
    },
    {
      "question": "[Amundi] Quelle est la relation entre Amundi et le Crédit Agricole ?",
      "options": [
        "Amundi est un concurrent direct du Crédit Agricole.",
        "Amundi est une filiale du groupe Crédit Agricole, qui en est l'actionnaire majoritaire. Amundi est par ailleurs cotée en Bourse.",
        "Amundi et le Crédit Agricole ont fusionné en 2022.",
        "Amundi est une filiale de BNP Paribas."
      ],
      "answer": "Amundi est une filiale du groupe Crédit Agricole, qui en est l'actionnaire majoritaire. Amundi est par ailleurs cotée en Bourse.",
      "explanation": "Amundi a été créée en 2010 par la fusion des activités de gestion d'actifs du Crédit Agricole et de la Société Générale (cette dernière a depuis revendu ses parts). Crédit Agricole est aujourd'hui l'actionnaire majoritaire (~69%). Amundi est cotée à la Bourse de Paris depuis 2015 (ticker : AMUN). Cette structure explique pourquoi Amundi distribue ses produits via les réseaux bancaires du Crédit Agricole (LCL, Caisses Régionales) — une distribution unique en France."
    },
    {
      "question": "[Amundi] Qui est la CEO d'Amundi ?",
      "options": [
        "Yves Perrier",
        "Valérie Baudson — depuis 2021.",
        "Jean-Louis Laurens",
        "Pascal Blanqué"
      ],
      "answer": "Valérie Baudson — depuis 2021.",
      "explanation": "Valérie Baudson est CEO d'Amundi depuis mai 2021, succédant à Yves Perrier qui dirigeait l'entreprise depuis sa création. Avant de devenir CEO, elle dirigeait notamment CPR Asset Management (filiale d'Amundi spécialisée dans les thématiques). Pascal Blanqué était le directeur des investissements (CIO) d'Amundi jusqu'en 2022. Connaître le nom du CEO est un minimum pour tout entretien dans une grande entreprise — cela montre que vous avez fait vos recherches."
    },
    {
      "question": "[Amundi] Qu'est-ce qu'Amundi Technology (AMT) et quel est son rôle ?",
      "options": [
        "Une startup tech acquise par Amundi pour ses compétences en IA.",
        "L'entité IT interne d'Amundi qui développe des solutions technologiques pour les équipes métier d'Amundi ET pour des clients externes — notamment des outils data et ESG.",
        "Le département cybersécurité d'Amundi.",
        "Une filiale qui développe des robots-advisors pour les particuliers."
      ],
      "answer": "L'entité IT interne d'Amundi qui développe des solutions technologiques pour les équipes métier d'Amundi ET pour des clients externes — notamment des outils data et ESG.",
      "explanation": "Amundi Technology (AMT) est l'entité tech d'Amundi. Elle développe des outils pour : 1) Les équipes internes (gestion des portefeuilles, ESG, risk management). 2) Des clients externes (d'autres gestionnaires d'actifs achètent des solutions AMT). Le poste MOE/dev dans lequel tu postules est au sein d'AMT, dans l'équipe IT Responsible Investments Management (ESG). Stack : Python, TypeScript, Angular, SQL, REST APIs, GitHub Actions, ArgoCD, Grafana, Splunk. Organisation : squads de ~3 devs + 1 PO/BA."
    },
    {
      "question": "[Amundi] Quel est le positionnement d'Amundi sur l'ESG ?",
      "options": [
        "Amundi est un acteur récent dans l'ESG, depuis 2022 uniquement.",
        "Amundi est pionnier de l'investissement responsable en Europe — stratégie ESG intégrée à tous ses fonds, 1er gestionnaire mondial à s'engager sur une politique charbon, engagement actionnarial actif dans +3 000 AG/an.",
        "Amundi a une approche ESG exclusivement centrée sur les exclusions sectorielles.",
        "Amundi ne gère pas de fonds ESG — ce n'est pas son cœur de métier."
      ],
      "answer": "Amundi est pionnier de l'investissement responsable en Europe — stratégie ESG intégrée à tous ses fonds, 1er gestionnaire mondial à s'engager sur une politique charbon, engagement actionnarial actif dans +3 000 AG/an.",
      "explanation": "Amundi s'est engagé à intégrer l'ESG dans 100% de ses fonds ouverts depuis 2021. Premier gestionnaire mondial à avoir adopté une politique d'exclusion du charbon thermique (en 2021). Amundi vot dans plus de 3 000 assemblées générales par an — l'un des acteurs les plus actifs en Europe sur l'engagement actionnarial. Amundi a co-fondé la Net Zero Asset Managers Initiative. Publication d'un rapport ESG annuel détaillé. En entretien : connaître ces engagements concrets montre une vraie compréhension du positionnement d'Amundi."
    },
    {
      "question": "[Amundi] Qu'est-ce que la mission MOE dans le contexte du poste Amundi ?",
      "options": [
        "Manager of Operations and Engineering — responsable des opérations.",
        "Maîtrise d'Œuvre — rôle technique qui assure la conception, le développement et la mise en œuvre des solutions IT, en lien avec la Maîtrise d'Ouvrage (métier).",
        "Middle Office Expert — expert des opérations de middle office.",
        "Module Oriented Engineering — approche de développement modulaire."
      ],
      "answer": "Maîtrise d'Œuvre — rôle technique qui assure la conception, le développement et la mise en œuvre des solutions IT, en lien avec la Maîtrise d'Ouvrage (métier).",
      "explanation": "MOE (Maîtrise d'Œuvre) vs MOA (Maîtrise d'Ouvrage) : la MOA représente le métier (besoins fonctionnels), la MOE est l'équipe technique qui réalise. Chez Amundi AMT : la MOE développe les outils ESG (Python, TypeScript, Angular, SQL) selon les besoins exprimés par les équipes métier ESG (Responsible Investment). Les missions : analyse et conception technique, développement, tests (>80%), CI/CD, support prod. Le poste est un rôle de dev senior avec une forte dimension craftsmanship (TDD, BDD, code review, Clean Code)."
    },
    {
      "question": "[Amundi] Quelle méthodologie agile est utilisée chez Amundi AMT ?",
      "options": [
        "Waterfall — avec des cycles de livraison de 6 mois.",
        "Agile avec des squads (3 devs + 1 PO/BA) — cérémonies : Planning, Daily Scrum, Démonstration, Rétrospective, Guild, Chapter.",
        "Kanban pur sans sprint ni planning.",
        "SAFe (Scaled Agile Framework) avec des PI Planning trimestriels."
      ],
      "answer": "Agile avec des squads (3 devs + 1 PO/BA) — cérémonies : Planning, Daily Scrum, Démonstration, Rétrospective, Guild, Chapter.",
      "explanation": "La description de poste mentionne explicitement : 'Participation aux cérémonies agile (Planning / Daily Scrum / Demonstration / Retrospective / Guild / Chapter)'. Organisation en squads autonomes (~3 devs + 1 PO/BA) — modèle inspiré de Spotify. Guild = communauté de pratique transverse (ex: tous les devs Python de toutes les squads). Chapter = groupe thématique au sein d'une tribu. En entretien : montrer qu'on connaît les cérémonies agile et qu'on y participe activement (pas juste 'j'ai entendu parler de Scrum')."
    },
    {
      "question": "[Amundi] Qu'est-ce qu'un ETF et quel est le positionnement d'Amundi sur ce marché ?",
      "options": [
        "Exchange Traded Fund — fonds coté en Bourse qui réplique un indice. Amundi est le leader européen des ETF depuis l'intégration de Lyxor en 2022.",
        "Amundi ne propose pas d'ETF — uniquement de la gestion active.",
        "European Trading Fund — un fonds réservé aux investisseurs institutionnels européens.",
        "Amundi est numéro 3 européen sur les ETF, derrière iShares et Vanguard."
      ],
      "answer": "Exchange Traded Fund — fonds coté en Bourse qui réplique un indice. Amundi est le leader européen des ETF depuis l'intégration de Lyxor en 2022.",
      "explanation": "ETF : fonds indiciel coté en Bourse, achetable comme une action. Avantages : coûts faibles, liquidité, diversification immédiate. Amundi a racheté Lyxor (Société Générale) en 2022, devenant ainsi le 1er fournisseur d'ETF en Europe. Gamme Amundi ETF : réplique des indices classiques (MSCI World, CAC 40) et des indices ESG (MSCI ESG Leaders, PAB, CTB). La gestion d'ETF représente une part significative de l'AUM d'Amundi. En entretien : mentionner l'intégration de Lyxor montre que vous avez suivi l'actualité d'Amundi."
    },
    {
      "question": "[Amundi] Pourquoi la mission chez Amundi AMT concerne-t-elle à la fois les équipes internes et des clients externes ?",
      "options": [
        "C'est une erreur dans la description de poste — AMT ne travaille que pour Amundi.",
        "Amundi Technology développe des solutions ESG utilisées par les équipes internes d'Amundi ET commercialisées auprès d'autres gestionnaires d'actifs qui achètent la technologie AMT.",
        "Les clients externes sont les clients particuliers d'Amundi.",
        "AMT travaille pour des clients externes uniquement lors de projets de conseil."
      ],
      "answer": "Amundi Technology développe des solutions ESG utilisées par les équipes internes d'Amundi ET commercialisées auprès d'autres gestionnaires d'actifs qui achètent la technologie AMT.",
      "explanation": "AMT a un double rôle : 1) Fournisseur interne : développer des outils pour les équipes d'Amundi (Responsible Investment, gestion de portefeuille, risk). 2) Fournisseur externe (B2B) : d'autres gestionnaires d'actifs achètent des solutions technologiques développées par AMT. C'est un modèle de 'tech company inside a financial company'. Cela signifie que le code doit être suffisamment robuste, documenté et maintenable pour être utilisé et maintenu par des tiers. D'où l'exigence de craftsmanship (>80% coverage, TDD, code review)."
    },
    {
      "question": "[Amundi] Quels outils de monitoring sont utilisés chez Amundi AMT en production ?",
      "options": [
        "Uniquement des logs fichiers consultés manuellement.",
        "ArgoCD (déploiement GitOps Kubernetes), Grafana (métriques et dashboards), Splunk (centralisation et analyse des logs).",
        "New Relic et Dynatrace exclusivement.",
        "Les outils de monitoring sont définis par chaque squad indépendamment."
      ],
      "answer": "ArgoCD (déploiement GitOps Kubernetes), Grafana (métriques et dashboards), Splunk (centralisation et analyse des logs).",
      "explanation": "La description de poste mentionne explicitement : 'monitoring via ArgoCD / Grafana / Splunk'. ArgoCD : outil GitOps pour Kubernetes — les déploiements sont déclenchés par des commits Git, l'état de l'infra est dans Git. Grafana : visualisation de métriques (CPU, latence, taux d'erreur) via des dashboards. Splunk : plateforme de centralisation et d'analyse des logs — requêtes sur les logs de prod, alertes. En entretien : mentionner ces outils montre qu'on a lu la mission et qu'on comprend l'importance du 'you build it, you run it' chez Amundi."
    }
  ],
  avance: []
};

const Flashcard = ({ slide }) => (
  <div className="flashcard">
    <h3 className="question">{slide.question}</h3>
    <p className="answer" style={{ whiteSpace: "pre-wrap", fontSize: "11px", lineHeight: "1.5" }}
      dangerouslySetInnerHTML={{ __html: slide.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/`(.*?)`/g, "<code>$1</code>") }}
    />
  </div>
);

const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <div className="timer">⏱ {timeLeft}s</div>
    <h3 className="question" style={{ fontSize: "12px" }}>{question}</h3>
    <div className="options">
      {options.map((opt, i) => (
        <button key={i} className="option-btn" onClick={() => onAnswerClick(opt)}
          style={{ fontSize: "11px", textAlign: "left", padding: "6px 10px", marginBottom: "4px", width: "100%" }}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Results = ({ scores }) => (
  <div className="results">
    <h2>🎯 Résultats</h2>
    <p>Score ESG + Amundi : {scores.moyen} / {questions.moyen.length}</p>
    <p style={{ fontSize: "12px", marginTop: "8px", color: scores.moyen >= 28 ? "green" : scores.moyen >= 21 ? "orange" : "red" }}>
      {scores.moyen >= 28 ? "✅ Excellent — tu es prêt(e) pour l'entretien !" : scores.moyen >= 21 ? "⚠️ Bien — encore quelques points à revoir." : "❌ À retravailler — reprends les slides."}
    </p>
  </div>
);

const Page14_ESGAmundi = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.moyen.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(25);
      setMessage("");
    } else {
      setShowResult(true);
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else {
        handleNextQuestion();
      }
    }
  }, [timeLeft, level, showResult]);

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
      }, 12000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    const current = questions.moyen[currentQuestion];
    if (option === current.answer) {
      setScores(p => ({ ...p, moyen: p.moyen + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ ${current.answer}\n\nℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 4000);
  };

  const isESG = currentQuestion < 25;
  const tag = level === "basic" ? "" : isESG ? "🌱 ESG" : "🏦 Amundi";

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: "10px", margin: "0 0 6px 0" }}>
            Entretien Amundi {tag} 🔹{" "}
            {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `Q${currentQuestion + 1}/${questions.moyen.length}`}
          </h4>
          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} />
          ) : (
            <QuestionCard
              question={questions.moyen[currentQuestion].question}
              options={questions.moyen[currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}
          {message && (
            <p className="message" style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page14_ESGAmundi;
