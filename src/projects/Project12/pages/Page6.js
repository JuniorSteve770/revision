// src/projects/CIBPricing/MicroservicesFoundationsQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [

  // ==================== ALM BASES ====================
  {
    question: "ALM — Asset Liability Management — Vue d'ensemble",
    answer:
      "◆ **ALM** : gestion des actifs et passifs d'une banque ◆ **Objectif** : gérer les risques (taux, liquidité, change) ◆ **Actifs** : prêts, obligations, investissements ◆ **Passifs** : dépôts, emprunts, dettes ◆ **Risque de taux** : impact des variations de taux d'intérêt ◆ **Risque de liquidité** : capacité à faire face aux engagements ◆ **Gap de taux** : différence entre actifs et passifs sensibles aux taux ◆ **Duration** : sensibilité de la valeur d'un portefeuille aux taux ⚠️ L'ALM est le cœur de la gestion des risques bancaires",
  },
  // ==================== INDICATEURS ALM ====================
  {
    question: "Indicateurs ALM — Gap, Duration, NII",
    answer:
      "◆ **Gap (écart)** : Actifs sensibles aux taux - Passifs sensibles aux taux ◆ **Gap positif** : plus d'actifs que de passifs sensibles → bénéfice en cas de hausse des taux ◆ **Gap négatif** : plus de passifs que d'actifs sensibles → bénéfice en cas de baisse des taux ◆ **Duration** : sensibilité de la valeur d'un portefeuille à une variation de 1% des taux ◆ **NII** : Net Interest Income (revenus d'intérêts nets) ◆ **NIM** : Net Interest Margin (marge d'intérêt nette) ◆ **EVE** : Economic Value of Equity (valeur économique des fonds propres) ⚠️ Le gap est l'indicateur ALM le plus simple et le plus utilisé",
  },
  // ==================== RISQUES DE MARCHE ====================
  {
    question: "Risques de marché — Taux, Change, Crédit",
    answer:
      "◆ **Risque de taux** : variation des taux d'intérêt → impact sur la valeur des actifs/passifs ◆ **Risque de change** : variation des taux de change → impact sur les positions en devises ◆ **Risque de crédit** : défaut de l'emprunteur → perte sur les prêts ◆ **Risque de liquidité** : incapacité à vendre un actif sans perte ◆ **Risque opérationnel** : erreurs humaines, défaillances systèmes ◆ **Stress tests** : simulation de scénarios extrêmes (choc de taux, crise) ◆ **Value at Risk (VaR)** : perte maximale avec un niveau de confiance donné ⚠️ L'Assistant Trader doit connaître ces risques et leurs indicateurs",
  },
  // ==================== TRADING & MARCHE ====================
  {
    question: "Trading — Concepts de base",
    answer:
      "◆ **Spread** : différence entre prix d'achat (bid) et prix de vente (ask) ◆ **Liquidité** : capacité à acheter/vendre sans impacter le prix ◆ **Volatilité** : amplitude des variations de prix ◆ **Carré** : position neutre (pas de position ouverte) ◆ **Couverture (Hedge)** : position qui compense le risque d'une autre ◆ **Arbitrage** : profit sur une différence de prix entre deux marchés ◆ **Position** : quantité détenue d'un actif (longue ou courte) ◆ **Mark-to-Market** : valorisation à la valeur de marché ⚠️ Le spread est une source de revenu pour le trader",
  },
  // ==================== OUTILS TRADING ====================
  {
    question: "Outils du trader — Bloomberg, Reuters, Excel",
    answer:
      "◆ **Bloomberg Terminal** : données de marché, actualités, analytics ◆ **Reuters / Refinitiv** : données financières et actualités ◆ **Excel** : calculs, backtests, reporting (Power Query, VBA) ◆ **Python / SQL** : analyse de données, backtesting, automatisation ◆ **Order Management Systems (OMS)** : gestion des ordres ◆ **Risk Management Systems** : suivi des risques ◆ **Algo Trading** : exécution automatisée des ordres ⚠️ La maîtrise d'Excel et la connaissance de Bloomberg sont des atouts majeurs pour un Assistant Trader",
  },
  // ==================== QUESTIONS D'ENTRETIEN ====================
  {
    question: "Questions d'entretien — Assistant Trader Junior",
    answer:
      "◆ **Pourquoi ce poste ?** : passion pour les marchés, rigueur, envie d'apprendre ◆ **Parle-moi des marchés** : actions, obligations, devises, matières premières ◆ **Qu'est-ce que le spread bid-ask ?** : différence entre prix d'achat et de vente ◆ **Qu'est-ce qu'une position courte ?** : vendre un actif qu'on ne possède pas ◆ **C'est quoi le GAP ALM ?** : écart entre actifs et passifs sensibles aux taux ◆ **Comment gères-tu le stress ?** : méthode, priorités, gestion des urgences ◆ **Connais-tu Bloomberg ?** : terminal, fonctions principales, actualités ◆ **Pourquoi les taux montent ?** : inflation, politique monétaire, croissance ⚠️ L'Assistant Trader doit être curieux, rigoureux et réactif",
  },
];

const questions = {
  moyen: [
    // ==================== ALM BASES (5 questions) ====================
    {
      question:
        "[ALM] Que signifie l'acronyme ALM en finance ?",
      options: [
        "Asset Liability Management (gestion des actifs et passifs)",
        "Active Liquidity Management (gestion active de la liquidité)",
        "Automated Loan Management (gestion automatisée des prêts)",
        "Advanced Leverage Model (modèle d'effet de levier avancé)",
      ],
      answer: "Asset Liability Management (gestion des actifs et passifs)",
      explanation:
        "ALM signifie Asset Liability Management. C'est la discipline qui vise à gérer les risques liés aux actifs et passifs d'une banque (taux, liquidité, change).",
    },
    {
      question:
        "[ALM] Quel est l'objectif principal de l'ALM ?",
      options: [
        "Maximiser les profits à court terme",
        "Gérer les risques (taux, liquidité, change) et assurer la solvabilité de la banque",
        "Minimiser les impôts",
        "Augmenter le nombre de clients",
      ],
      answer: "Gérer les risques (taux, liquidité, change) et assurer la solvabilité de la banque",
      explanation:
        "L'ALM vise à gérer les risques (taux d'intérêt, liquidité, change) pour assurer la pérennité et la solvabilité de la banque. Ce n'est pas un objectif de profit à court terme.",
    },
    {
      question:
        "[ALM] Qu'est-ce qu'un 'gap de taux' en ALM ?",
      options: [
        "La différence entre le taux d'emprunt et le taux de prêt",
        "L'écart entre les actifs sensibles aux taux et les passifs sensibles aux taux",
        "La différence entre le prix d'achat et le prix de vente d'un actif",
        "La durée moyenne des prêts",
      ],
      answer: "L'écart entre les actifs sensibles aux taux et les passifs sensibles aux taux",
      explanation:
        "Le gap de taux est Actifs sensibles aux taux - Passifs sensibles aux taux. Il mesure l'exposition de la banque aux variations de taux d'intérêt.",
    },
    {
      question:
        "[ALM] Quelle est la conséquence d'un gap de taux positif ?",
      options: [
        "La banque perd de l'argent en cas de hausse des taux",
        "La banque gagne de l'argent en cas de hausse des taux",
        "La banque est neutre aux variations de taux",
        "La banque est exposée au risque de change",
      ],
      answer: "La banque gagne de l'argent en cas de hausse des taux",
      explanation:
        "Un gap positif (plus d'actifs que de passifs sensibles) signifie que la banque bénéficie d'une hausse des taux. Les actifs se renégocient à la hausse plus vite que les passifs.",
    },
    {
      question:
        "[ALM] Quel indicateur mesure la sensibilité d'un portefeuille aux variations de taux d'intérêt ?",
      options: [
        "Le spread bid-ask",
        "La Duration (duration modifiée)",
        "Le P/E ratio",
        "Le Beta",
      ],
      answer: "La Duration (duration modifiée)",
      explanation:
        "La duration mesure la sensibilité de la valeur d'un portefeuille à une variation de 1% des taux d'intérêt. Plus la duration est élevée, plus le portefeuille est sensible aux taux.",
    },

    // ==================== RISQUES (4 questions) ====================
    {
      question:
        "[Risques] Qu'est-ce que le risque de liquidité ?",
      options: [
        "Le risque que la banque perde de l'argent sur ses prêts",
        "Le risque de ne pas pouvoir faire face à ses engagements (manque de liquidités)",
        "Le risque de variation des taux de change",
        "Le risque d'erreur opérationnelle",
      ],
      answer: "Le risque de ne pas pouvoir faire face à ses engagements (manque de liquidités)",
      explanation:
        "Le risque de liquidité est le risque que la banque ne puisse pas faire face à ses engagements (retraits de dépôts, paiements). Elle peut être forcée de vendre des actifs à perte.",
    },
    {
      question:
        "[Risques] Qu'est-ce que le risque de crédit ?",
      options: [
        "Le risque de variation des taux d'intérêt",
        "Le risque de défaut de l'emprunteur (non-remboursement d'un prêt)",
        "Le risque de change",
        "Le risque opérationnel",
      ],
      answer: "Le risque de défaut de l'emprunteur (non-remboursement d'un prêt)",
      explanation:
        "Le risque de crédit est le risque que l'emprunteur ne rembourse pas son prêt (défaut). C'est l'un des risques majeurs pour les banques.",
    },
    {
      question:
        "[Risques] Qu'est-ce qu'un stress test en finance ?",
      options: [
        "Un test de résistance qui simule des scénarios extrêmes (choc de taux, crise)",
        "Un test de performance informatique",
        "Un questionnaire de recrutement",
        "Un test de connaissance des marchés",
      ],
      answer: "Un test de résistance qui simule des scénarios extrêmes (choc de taux, crise)",
      explanation:
        "Un stress test simule des scénarios extrêmes (hausse brutale des taux, crise économique) pour évaluer la résilience de la banque. C'est un outil clé de l'ALM.",
    },
    {
      question:
        "[Risques] Quelle est la définition de la Value at Risk (VaR) ?",
      options: [
        "La perte maximale avec un niveau de confiance donné sur un horizon donné",
        "La valeur des actifs de la banque",
        "Le rendement attendu d'un portefeuille",
        "La liquidité d'un actif",
      ],
      answer: "La perte maximale avec un niveau de confiance donné sur un horizon donné",
      explanation:
        "La VaR est une mesure statistique : 'Nous avons 95% de certitude que la perte ne dépassera pas X sur 1 jour' . C'est un indicateur standard en gestion des risques.",
    },

    // ==================== TRADING (5 questions) ====================
    {
      question:
        "[Trading] Que signifie 'carré' dans le jargon d'un trader ?",
      options: [
        "Avoir une position longue",
        "Avoir une position courte",
        "Être neutre (pas de position ouverte)",
        "Avoir doublé sa position",
      ],
      answer: "Être neutre (pas de position ouverte)",
      explanation:
        "'Être carré' signifie avoir une position neutre (flat), c'est-à-dire ne pas avoir de position ouverte (ni longue, ni courte). C'est le statut par défaut avant de prendre une position.",
    },
    {
      question:
        "[Trading] Quelle est la différence entre le prix bid et le prix ask ?",
      options: [
        "Le bid est le prix d'achat, le ask est le prix de vente",
        "Le bid est le prix de vente, le ask est le prix d'achat",
        "Le bid est le prix moyen, le ask est le prix le plus haut",
        "Le bid et le ask sont identiques",
      ],
      answer: "Le bid est le prix d'achat, le ask est le prix de vente",
      explanation:
        "Le bid est le prix auquel un acheteur est prêt à acheter (prix d'achat). Le ask est le prix auquel un vendeur est prêt à vendre (prix de vente). Le spread est la différence entre les deux.",
    },
    {
      question:
        "[Trading] Qu'est-ce que le spread bid-ask ?",
      options: [
        "La différence entre le prix d'achat et le prix de vente",
        "Le rendement d'un investissement",
        "La variation d'un prix sur une journée",
        "Le nombre d'actions échangées",
      ],
      answer: "La différence entre le prix d'achat et le prix de vente",
      explanation:
        "Le spread bid-ask est la différence entre le prix d'achat (bid) et le prix de vente (ask). C'est le coût de transaction pour un investisseur et une source de revenu pour le trader.",
    },
    {
      question:
        "[Trading] Qu'est-ce qu'une position courte (short position) ?",
      options: [
        "Acheter un actif en espérant qu'il monte",
        "Vendre un actif qu'on ne possède pas (emprunté), en espérant le racheter moins cher",
        "Détenir un actif physiquement",
        "Ne pas avoir de position",
      ],
      answer: "Vendre un actif qu'on ne possède pas (emprunté), en espérant le racheter moins cher",
      explanation:
        "Une position courte (short) consiste à vendre un actif emprunté, en espérant le racheter à un prix plus bas. On profite ainsi d'une baisse de prix. C'est une stratégie de trading courante.",
    },
    {
      question:
        "[Trading] Qu'est-ce que l'arbitrage en trading ?",
      options: [
        "Profiter d'une différence de prix d'un même actif sur deux marchés différents",
        "Acheter et vendre le même actif simultanément",
        "Investir à long terme",
        "Copier les trades d'autres traders",
      ],
      answer: "Profiter d'une différence de prix d'un même actif sur deux marchés différents",
      explanation:
        "L'arbitrage consiste à profiter d'une différence de prix d'un même actif sur deux marchés (ou entre deux instruments). On achète là où c'est moins cher et on vend là où c'est plus cher. C'est théoriquement sans risque.",
    },

    // ==================== OUTILS (4 questions) ====================
    {
      question:
        "[Outils] Quel terminal est le plus utilisé par les traders pour les données de marché en temps réel ?",
      options: [
        "Bloomberg Terminal (le standard)",
        "Microsoft Excel",
        "Google Finance",
        "Yahoo Finance",
      ],
      answer: "Bloomberg Terminal (le standard)",
      explanation:
        "Le Bloomberg Terminal est le terminal de trading le plus utilisé par les professionnels. Il fournit des données de marché en temps réel, des actualités, des analytics et des outils de trading.",
    },
    {
      question:
        "[Outils] Pourquoi Excel est-il encore très utilisé par les traders et assistants traders ?",
      options: [
        "Parce que c'est gratuit",
        "Pour les calculs rapides, le backtesting, la création de rapports et la flexibilité",
        "Parce que c'est le seul outil autorisé",
        "Parce que c'est plus rapide que Bloomberg",
      ],
      answer: "Pour les calculs rapides, le backtesting, la création de rapports et la flexibilité",
      explanation:
        "Excel est très utilisé pour la flexibilité : calculs rapides, backtesting, création de rapports, modèles de pricing, analyses. La maîtrise d'Excel est un atout majeur pour un Assistant Trader.",
    },
    {
      question:
        "[Outils] Qu'est-ce qu'un OMS (Order Management System) ?",
      options: [
        "Un système de gestion des ordres de trading",
        "Un logiciel de comptabilité",
        "Un outil de gestion de portefeuille",
        "Un système de gestion des risques",
      ],
      answer: "Un système de gestion des ordres de trading",
      explanation:
        "Un OMS (Order Management System) est un système qui gère les ordres de trading : saisie, transmission, suivi, exécution, allocation. C'est un outil essentiel pour les traders.",
    },
    {
      question:
        "[Outils] Quelle fonction Bloomberg est utilisée pour consulter les actualités financières ?",
      options: [
        "FLDS (Field Search)",
        "N (News) ou TOP (Top News)",
        "Q (Quote)",
        "B (Bloomberg)",
      ],
      answer: "N (News) ou TOP (Top News)",
      explanation:
        "Sur le terminal Bloomberg, la fonction N (News) ou TOP (Top News) permet de consulter les actualités financières en temps réel. C'est l'une des fonctions les plus utilisées.",
    },

    // ==================== MARCHE (3 questions) ====================
    {
      question:
        "[Marché] Qu'est-ce qu'une obligation (bond) ?",
      options: [
        "Un titre de créance (on prête de l'argent à l'émetteur)",
        "Une part de propriété d'une entreprise",
        "Un contrat à terme",
        "Une devise étrangère",
      ],
      answer: "Un titre de créance (on prête de l'argent à l'émetteur)",
      explanation:
        "Une obligation est un titre de créance. L'acheteur prête de l'argent à l'émetteur (État, entreprise) et reçoit des intérêts. C'est différent d'une action qui est une part de propriété.",
    },
    {
      question:
        "[Marché] Qu'est-ce que le taux directeur (policy rate) ?",
      options: [
        "Le taux auquel une banque prête à ses meilleurs clients",
        "Le taux fixé par la banque centrale qui influence tous les taux",
        "Le taux d'inflation",
        "Le taux de change",
      ],
      answer: "Le taux fixé par la banque centrale qui influence tous les taux",
      explanation:
        "Le taux directeur est fixé par la banque centrale (ex : BCE, Fed). Il influence les taux d'intérêt de l'économie (crédits, obligations, épargne). C'est un outil de politique monétaire.",
    },
    {
      question:
        "[Marché] Pourquoi les taux d'intérêt montent-ils généralement ?",
      options: [
        "Parce que l'inflation augmente (la banque centrale remonte les taux)",
        "Parce que la bourse est en baisse",
        "Parce que le chômage augmente",
        "Parce que le PIB diminue",
      ],
      answer: "Parce que l'inflation augmente (la banque centrale remonte les taux)",
      explanation:
        "Les taux augmentent généralement pour lutter contre l'inflation. La banque centrale remonte les taux pour refroidir l'économie et maîtriser la hausse des prix. C'est un mécanisme de politique monétaire.",
    },

    // ==================== QUESTIONS D'ENTRETIEN (5 questions) ====================
    {
      question:
        "[Entretien] Que répondriez-vous à 'Pourquoi voulez-vous devenir Assistant Trader ?'",
      options: [
        "Pour l'argent et le prestige",
        "Parce que je suis passionné par les marchés financiers, rigoureux et j'aime le travail en équipe",
        "Parce que je ne sais pas quoi faire d'autre",
        "Pour travailler dans une banque",
      ],
      answer: "Parce que je suis passionné par les marchés financiers, rigoureux et j'aime le travail en équipe",
      explanation:
        "C'est la réponse attendue : montrer une véritable passion pour les marchés, de la rigueur, et une capacité à travailler en équipe (sous pression).",
    },
    {
      question:
        "[Entretien] Comment gérez-vous le stress dans un environnement de trading ?",
      options: [
        "Je panique et je quitte la salle",
        "Je reste calme, je priorise les tâches, je vérifie les données plusieurs fois",
        "Je demande à mon chef de gérer",
        "Je prends des risques pour compenser",
      ],
      answer: "Je reste calme, je priorise les tâches, je vérifie les données plusieurs fois",
      explanation:
        "Un Assistant Trader doit gérer le stress. La réponse attendue : calme, organisation, vérification des données, méthode. Le trading est un environnement stressant.",
    },
    {
      question:
        "[Entretien] Que signifie 'position longue' (long position) ?",
      options: [
        "Acheter un actif en espérant qu'il monte",
        "Vendre un actif qu'on ne possède pas",
        "Ne pas avoir de position",
        "Avoir une position de plus de 100 000 euros",
      ],
      answer: "Acheter un actif en espérant qu'il monte",
      explanation:
        "Une position longue (long) consiste à acheter un actif dans l'espoir qu'il augmente de prix. On profite de la hausse. C'est le contraire d'une position courte (short).",
    },
    {
      question:
        "[Entretien] Comment réagiriez-vous si vous vous rendez compte d'une erreur sur un ordre ?",
      options: [
        "Je cache l'erreur pour ne pas avoir de problèmes",
        "Je préviens immédiatement mon supérieur, je propose une solution et je documente l'erreur",
        "J'attends que quelqu'un d'autre s'en rende compte",
        "Je laisse l'erreur se résoudre d'elle-même",
      ],
      answer: "Je préviens immédiatement mon supérieur, je propose une solution et je documente l'erreur",
      explanation:
        "La réponse attendue : transparence immédiate, proposition de solution, documentation. Cacher une erreur est inacceptable dans le trading.",
    },
    {
      question:
        "[Entretien] Quelle est selon vous la qualité la plus importante pour un Assistant Trader ?",
      options: [
        "La rapidité d'exécution",
        "La rigueur et l'attention aux détails (une erreur coûte cher)",
        "La connaissance des mathématiques avancées",
        "La capacité à parler plusieurs langues",
      ],
      answer: "La rigueur et l'attention aux détails (une erreur coûte cher)",
      explanation:
        "La rigueur est la qualité numéro un pour un Assistant Trader. Une erreur de saisie peut coûter des millions. La rapidité vient avec l'expérience.",
    },
  ],
  avance: [
    // ==================== ALM AVANCE ====================
    {
      question:
        "[Avancé] Qu'est-ce que le NII (Net Interest Income) ?",
      options: [
        "Le revenu net d'intérêts (intérêts perçus - intérêts payés)",
        "La marge d'intérêt nette",
        "La valeur des fonds propres",
        "Le rendement des capitaux investis",
      ],
      answer: "Le revenu net d'intérêts (intérêts perçus - intérêts payés)",
      explanation:
        "Le NII est le revenu net d'intérêts. C'est la différence entre les intérêts perçus sur les actifs (prêts) et les intérêts payés sur les passifs (dépôts). C'est un indicateur clé de l'ALM.",
    },
    {
      question:
        "[Avancé] En ALM, quelle est la différence entre le gap statique et le gap dynamique ?",
      options: [
        "Gap statique = historique, Gap dynamique = prévisionnel",
        "Gap statique = à un instant T, Gap dynamique = intègre les flux futurs de trésorerie",
        "Gap statique = pour les actifs, Gap dynamique = pour les passifs",
        "Il n'y a pas de différence",
      ],
      answer: "Gap statique = à un instant T, Gap dynamique = intègre les flux futurs de trésorerie",
      explanation:
        "Le gap statique est calculé à un instant T (stock). Le gap dynamique intègre les flux de trésorerie futurs (prévisionnels). Le gap dynamique est plus précis pour l'ALM.",
    },
    {
      question:
        "[Avancé] Quelle est la durée modifiée (modified duration) d'un portefeuille obligataire ?",
      options: [
        "La durée de vie moyenne des obligations",
        "La sensibilité de la valeur du portefeuille à une variation de 1% des taux",
        "Le rendement moyen du portefeuille",
        "Le nombre d'obligations dans le portefeuille",
      ],
      answer: "La sensibilité de la valeur du portefeuille à une variation de 1% des taux",
      explanation:
        "La duration modifiée mesure la variation en % de la valeur d'un portefeuille obligataire pour une variation de 1% des taux. Ex : duration modifiée de 5 → 1% de hausse des taux → -5% sur le portefeuille.",
    },

    // ==================== TRADING AVANCE ====================
    {
      question:
        "[Avancé] Qu'est-ce qu'un algorithme de trading (algo trading) ?",
      options: [
        "Un programme qui exécute automatiquement des ordres selon des règles prédéfinies",
        "Un calcul mathématique complexe",
        "Une stratégie manuelle de trading",
        "Un outil de reporting",
      ],
      answer: "Un programme qui exécute automatiquement des ordres selon des règles prédéfinies",
      explanation:
        "L'algo trading utilise des programmes informatiques pour exécuter automatiquement des ordres selon des règles définies (moments, prix, volumes). C'est très répandu sur les marchés financiers.",
    },
    {
      question:
        "[Avancé] Qu'est-ce que le mark-to-market (MtM) ?",
      options: [
        "La valorisation d'un actif ou d'une position à sa valeur de marché actuelle",
        "Le prix d'achat d'un actif",
        "Le prix de vente d'un actif",
        "La valeur comptable d'un actif",
      ],
      answer: "La valorisation d'un actif ou d'une position à sa valeur de marché actuelle",
      explanation:
        "Le mark-to-market consiste à valoriser un actif ou une position à sa valeur de marché actuelle (et non à son prix d'achat). Les P&L sont calculés en MtM.",
    },
  ],
  expert: [
    // ==================== PIEGES ====================
    {
      question:
        "[PIÈGE] Que signifie 'EVE' en ALM (Economic Value of Equity) ?",
      options: [
        "La valeur économique des fonds propres (sensibilité aux taux)",
        "Le rendement des capitaux propres",
        "La marge d'intérêt nette",
        "Le ratio de solvabilité",
      ],
      answer: "La valeur économique des fonds propres (sensibilité aux taux)",
      explanation:
        "L'EVE (Economic Value of Equity) est la valeur économique des fonds propres. Elle mesure la sensibilité des fonds propres aux variations de taux d'intérêt. C'est un indicateur ALM important.",
    },
    {
      question:
        "[PIÈGE] Pourquoi un gap de taux positif est-il risqué en cas de baisse des taux ?",
      options: [
        "La banque perd de l'argent car ses actifs baissent plus vite que ses passifs",
        "La banque gagne de l'argent",
        "La banque est neutre",
        "La banque est protégée",
      ],
      answer: "La banque perd de l'argent car ses actifs baissent plus vite que ses passifs",
      explanation:
        "Un gap positif signifie plus d'actifs que de passifs sensibles. En cas de baisse des taux, les actifs se renégocient à la baisse plus vite que les passifs, ce qui réduit le NII. Le gap est une arme à double tranchant.",
    },
    {
      question:
        "[PIÈGE] En trading, que signifie 'slippage' ?",
      options: [
        "La différence entre le prix attendu et le prix réellement exécuté",
        "Une perte de connexion réseau",
        "Un retard d'exécution",
        "Une erreur de saisie",
      ],
      answer: "La différence entre le prix attendu et le prix réellement exécuté",
      explanation:
        "Le slippage est la différence entre le prix auquel on attendait d'exécuter un ordre et le prix réellement exécuté. En période de forte volatilité, le slippage peut être important. C'est un risque pour le trader.",
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

export default MicroservicesFoundationsQCM;
