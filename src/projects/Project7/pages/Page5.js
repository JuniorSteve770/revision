// src/projects/Project3/pages/Page_CICD.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "CI/CD — Définition & pipeline | Natixis/Finance",
    "answer": "**CI = Continuous Integration** : chaque `git push` déclenche automatiquement compilation, tests, qualité, sécurité. Objectif : détecter les bugs le plus tôt possible. ◆ **CD = Continuous Delivery/Deployment** : le code validé est automatiquement packagé et déployé vers recette → staging → prod. ◆ **Pipeline bancaire** : `git push` → Build → Tests → SonarQube → Checkmarx → Docker build → Deploy recette → (manuel) Deploy prod. ◆ **Mots-clés** : `pipeline`, `stage`, `job`, `runner`, `artifact`, `trigger`, `webhook`. ◆ **En banque** : deploy prod toujours `when: manual` — validation humaine obligatoire (DORA, risque opérationnel). ◆ **Outils** : GitLab CI (on-premise bancaire), GitHub Actions (hors banque), Jenkins (legacy)."
  },
  {
    "question": "CI/CD — C# vs Python : différences clés | Natixis/Finance",
    "answer": "**C# — étape Build obligatoire** : `dotnet build` compile le code. Toute erreur de syntaxe ou de type = pipeline bloqué AVANT les tests. Filet de sécurité fort. ◆ **Python — pas de compilation** : le pipeline passe directement aux tests. Une erreur de syntaxe dans un fichier non couvert par les tests peut passer le CI et exploser en prod. ◆ **Conséquence** : coverage Python doit être plus strict (≥80%) pour compenser l'absence de compilation. ◆ **C#** : `dotnet restore` → `dotnet build` → `dotnet test` → `dotnet publish`. ◆ **Python** : `pip install -r requirements.txt` → `ruff check` (lint) → `pytest --cov` → `docker build`. ◆ **Package** : C# = `.dll`/`.exe` via `dotnet publish` | Python = `.whl` via `pip wheel`."
  },
  {
    "question": "GitHub Actions — Structure YAML | C# & Python",
    "answer": "**Fichier** : `.github/workflows/ci.yml` à la racine. ◆ **Déclencheurs** : `on: push` (branches) + `on: pull_request`. ◆ **Structure** : `jobs:` → `runs-on: ubuntu-latest` → `steps:` → `uses:` (action) ou `run:` (commande shell). ◆ **C# essentiel** : `uses: actions/setup-dotnet@v4` → `run: dotnet restore` → `run: dotnet build` → `run: dotnet test --collect:\"XPlat Code Coverage\"`. ◆ **Python essentiel** : `uses: actions/setup-python@v5` → `run: pip install -r requirements.txt` → `run: ruff check .` → `run: pytest --cov=src --cov-fail-under=80`. ◆ **Différence** : C# a une étape `dotnet build` explicite. Python remplace le build par `ruff check` (lint statique)."
  },
  {
    "question": "GitLab CI — Pipeline bancaire Natixis FERMAT | C#",
    "answer": "**Fichier** : `.gitlab-ci.yml` à la racine. Runners **on-premise** (code ne sort jamais des serveurs internes). ◆ **Stages** : `build` → `test` → `quality` → `security` → `package` → `deploy`. ◆ **Variables** : `variables: SONAR_PROJECT_KEY: fermat-risk`. ◆ **Artifacts** : `artifacts: paths: [\"**/bin/Release/\"]` conserve les binaires entre stages. ◆ **Deploy recette** : `only: [develop]` + automatique. **Deploy prod** : `only: [main]` + `when: manual` (OBLIGATOIRE en banque). ◆ **Pourquoi GitLab on-premise ?** RGPD + confidentialité code source (formules de risque) + DORA (contrôle des données). GitHub héberge sur serveurs Microsoft = interdit en banque pour code sensible."
  },
  {
    "question": "Docker dans le pipeline CI/CD | C# vs Python",
    "answer": "**C# — Multi-stage build** : Stage 1 (`sdk:8.0`, 780 MB) compile avec `dotnet publish`. Stage 2 (`aspnet:8.0`, 220 MB) contient uniquement le runtime. Image finale 3× plus légère, surface d'attaque réduite. ◆ **Python — Layer caching** : copier `requirements.txt` AVANT le code source → Docker cache le layer `pip install` si requirements ne change pas → build 10× plus rapide. ◆ **Bonne pratique commune** : utilisateur non-root (`USER appuser`), image `slim`/`alpine` pour minimiser la taille. ◆ **Dans le pipeline** : `docker build -t fermat:$CI_COMMIT_SHA .` → `docker push registry/fermat:$CI_COMMIT_SHA` → `kubectl set image deployment/fermat app=fermat:$CI_COMMIT_SHA`."
  },
  {
    "question": "SonarQube & Checkmarx — Qualité et sécurité | CI/CD",
    "answer": "**SonarQube** : analyse qualité du code. Métriques : coverage, code smells, bugs, vulnérabilités, dette technique. **Quality Gate** = seuil qui bloque le pipeline si non atteint (ex: coverage < 80% ou vuln critique). Supporte C# (Roslyn) et Python. ◆ **Checkmarx** : SAST (Static Application Security Testing) — analyse le code source pour détecter les vulnérabilités OWASP (injection SQL, XSS, secrets hardcodés). ◆ **C# spécifique** : Roslyn Analyzers (intégrés au SDK), `dotnet format`. ◆ **Python spécifique** : Bandit (vulnérabilités sécurité), Ruff/Flake8 (qualité/style), `pip audit`/Safety (packages vulnérables). ◆ **DevSecOps** : sécurité intégrée DANS le pipeline, pas après. SAST + DAST + Dependency Check."
  },
  {
    "question": "GitLab CI vs GitHub Actions — Comparatif bancaire",
    "answer": "**GitLab CI** : fichier `.gitlab-ci.yml`. Runners on-premise. Natif GitLab (merge requests, issues). `stages:` définis explicitement. Artifacts entre jobs. Standard en banque (BNP, SG, Natixis, CACIB). ◆ **GitHub Actions** : fichier `.github/workflows/*.yml`. Runners cloud (ubuntu-latest, windows-latest). Marketplace d'actions (`uses: actions/...`). Standard hors banque et startups. ◆ **Différence clé** : GitHub = serveurs Microsoft (cloud). GitLab on-premise = serveurs internes banque. ◆ **Variables secrètes** : GitLab → `$CI_REGISTRY_PASSWORD` (CI/CD Variables). GitHub → `${{ secrets.DOCKER_PASSWORD }}` (Secrets). ◆ **Syntaxe commune** : YAML, stages/jobs, artifacts, environnements, déclencheurs."
  },
  {
    "question": "Coverage & Tests dans le pipeline | C# vs Python",
    "answer": "**C# coverage** : `dotnet test --collect:\"XPlat Code Coverage\"` génère `coverage.cobertura.xml`. GitLab CI extrait le % avec une regex. `coverlet` est la lib standard. ◆ **Python coverage** : `pytest --cov=src --cov-report=xml --cov-fail-under=80`. `pytest-cov` = lib standard. `--cov-fail-under=80` = exit code 1 si coverage < 80% (bloque le pipeline). ◆ **Pourquoi 80% minimum ?** En Python, compenser l'absence de compilation. En C#, bonne pratique industrie. ◆ **Types de tests dans CI** : unitaires (rapides, pas de DB), intégration (Docker Compose, DB test), e2e (staging uniquement). ◆ **Rapport coverage** : publié sur GitLab Pages ou Codecov pour visualisation par l'équipe."
  }
];

const questions = {
  moyen: [
    {
      "question": "[CI/CD — Définition] Quelle est la différence entre Continuous Delivery et Continuous Deployment ?",
      "options": [
        "Ce sont des synonymes — les deux désignent le même processus.",
        "Continuous Delivery : le pipeline s'arrête avant la prod et attend une validation humaine. Continuous Deployment : tout est automatique jusqu'en production sans intervention.",
        "Continuous Delivery concerne C#, Continuous Deployment concerne Python.",
        "Continuous Delivery déploie sur recette, Continuous Deployment déploie sur staging."
      ],
      "answer": "Continuous Delivery : le pipeline s'arrête avant la prod et attend une validation humaine. Continuous Deployment : tout est automatique jusqu'en production sans intervention.",
      "explanation": "Nuance importante : Delivery = livraison prête à déployer, déploiement sur décision humaine. Deployment = déploiement automatique à chaque commit validé. En banque, on utilise Continuous Delivery pour la prod (validation obligatoire par un humain — DORA, risque opérationnel). Continuous Deployment est courant dans les SaaS/startups où le risque d'un déploiement raté est faible."
    },
    {
      "question": "[GitHub Actions — YAML] Dans GitHub Actions, que fait `uses: actions/checkout@v4` ?",
      "options": [
        "Installe Git sur le runner.",
        "Publie l'artefact sur GitHub Packages.",
        "Clone le dépôt Git sur le runner pour que les étapes suivantes accèdent aux fichiers sources.",
        "Crée une nouvelle branche pour le pipeline."
      ],
      "answer": "Clone le dépôt Git sur le runner pour que les étapes suivantes accèdent aux fichiers sources.",
      "explanation": "`actions/checkout` est toujours la première étape d'un workflow GitHub Actions. Sans elle, le runner ne possède pas le code source. Elle exécute `git clone` et `git checkout` sur la branche qui a déclenché le pipeline. Sans cette étape, `dotnet build` ou `pytest` échoueraient car aucun fichier source n'est présent."
    },
    {
      "question": "[CI/CD C# vs Python] Pourquoi un pipeline Python a-t-il besoin d'un coverage minimum plus strict qu'un pipeline C# ?",
      "options": [
        "Python produit plus de bugs que C# par nature.",
        "Sans étape de compilation, une erreur de syntaxe dans un fichier non couvert par les tests peut passer le CI et exploser en production.",
        "pytest est moins fiable que dotnet test.",
        "GitHub Actions impose un coverage minimum de 80% pour Python."
      ],
      "answer": "Sans étape de compilation, une erreur de syntaxe dans un fichier non couvert par les tests peut passer le CI et exploser en production.",
      "explanation": "C# compile avant de tester : toute erreur de syntaxe ou de type est détectée au build, avant même les tests. Python est interprété : un fichier `strategy.py` avec une `SyntaxError` qui n'est jamais importé dans les tests passera silencieusement le CI. `--cov-fail-under=80` est le filet de sécurité : il force à couvrir 80% du code, réduisant la probabilité qu'un fichier buggé passe inaperçu."
    },
    {
      "question": "[Docker — C#] Pourquoi utilise-t-on un Dockerfile multi-stage pour une application C# ?",
      "options": [
        "Pour que Docker puisse builder en parallèle.",
        "Stage 1 (sdk, 780 MB) compile avec `dotnet publish`. Stage 2 (aspnet, 220 MB) contient uniquement le runtime. L'image finale est 3× plus légère — surface d'attaque réduite et déploiement plus rapide.",
        "Le multi-stage est obligatoire pour .NET 8.",
        "Pour séparer les tests du build dans le Dockerfile."
      ],
      "answer": "Stage 1 (sdk, 780 MB) compile avec `dotnet publish`. Stage 2 (aspnet, 220 MB) contient uniquement le runtime. L'image finale est 3× plus légère — surface d'attaque réduite et déploiement plus rapide.",
      "explanation": "L'image `sdk:8.0` contient les compilateurs, outils de diagnostic, debugger — inutiles en production et dangereux (surface d'attaque). L'image `aspnet:8.0` contient uniquement ce qu'il faut pour exécuter une app ASP.NET. Multi-stage = compiler avec le grand outil, déployer avec l'outil minimal. En banque : images Docker auditées et minimales = politique de sécurité."
    },
    {
      "question": "[GitLab CI — Bancaire] Pourquoi les banques (Natixis, BNP, SG) utilisent-elles GitLab on-premise plutôt que GitHub ?",
      "options": [
        "GitLab est gratuit, GitHub est payant.",
        "Le code source et les pipelines ne doivent pas transiter par des serveurs externes : RGPD, confidentialité des formules de risque, et réglementation DORA imposent le contrôle total des données.",
        "GitHub ne supporte pas les pipelines C#.",
        "GitLab on-premise est 10× plus rapide que GitHub Actions."
      ],
      "answer": "Le code source et les pipelines ne doivent pas transiter par des serveurs externes : RGPD, confidentialité des formules de risque, et réglementation DORA imposent le contrôle total des données.",
      "explanation": "Contraintes réglementaires bancaires : le code source contient des formules de risque propriétaires (CVA, SA-CCR), des algorithmes de trading. RGPD interdit l'envoi de certaines données hors UE. DORA (Digital Operational Resilience Act) impose la souveraineté des systèmes critiques. GitLab on-premise = runners sur serveurs internes, aucune donnée ne sort du SI bancaire. GitHub (Microsoft cloud) = non conforme pour le code source sensible."
    },
    {
      "question": "[SonarQube] Qu'est-ce qu'un Quality Gate dans SonarQube ?",
      "options": [
        "Une interface graphique pour visualiser le code.",
        "Un ensemble de seuils (coverage minimum, vulnérabilités critiques, code smells) qui, si non atteints, font échouer le pipeline CI/CD.",
        "Un système d'authentification pour accéder au code source.",
        "Un outil pour merger automatiquement les branches."
      ],
      "answer": "Un ensemble de seuils (coverage minimum, vulnérabilités critiques, code smells) qui, si non atteints, font échouer le pipeline CI/CD.",
      "explanation": "Quality Gate SonarQube = définition de 'done' technique. Exemple : coverage ≥ 80%, zéro vulnérabilité critique, dette technique < 1 jour, zéro bug bloquant. Si un commit introduit une vulnérabilité critique ou fait chuter le coverage, le stage SonarQube échoue → le merge est bloqué. En banque : Quality Gates configurés par la DSI avec des seuils stricts pour les applications de risque."
    },
    {
      "question": "[Docker — Python] Pourquoi copier `requirements.txt` AVANT le code source dans un Dockerfile Python ?",
      "options": [
        "Python exige que les dépendances soient déclarées avant le code source.",
        "Docker cache chaque instruction (layer). Copier `requirements.txt` en premier permet de mettre en cache le layer `pip install` — il n'est ré-exécuté que si `requirements.txt` change, pas à chaque modification du code.",
        "Pour que `pip install` soit exécuté en parallèle du `COPY`.",
        "Pour réduire la taille de l'image finale."
      ],
      "answer": "Docker cache chaque instruction (layer). Copier `requirements.txt` en premier permet de mettre en cache le layer `pip install` — il n'est ré-exécuté que si `requirements.txt` change, pas à chaque modification du code.",
      "explanation": "Optimisation Docker layer caching : Docker invalide le cache à partir du premier COPY/RUN modifié. Si on copie tout le code d'abord (`COPY . .`), le moindre changement d'un fichier `.py` invalide le cache de `pip install` → re-téléchargement de toutes les dépendances à chaque build. Ordre correct : `COPY requirements.txt ./` → `RUN pip install -r requirements.txt` → `COPY src/ ./src/`. Build 10× plus rapide en développement."
    },
    {
      "question": "[GitLab CI — Stages] Dans un pipeline GitLab CI C#, que se passe-t-il si le stage `test` échoue (coverage < 80%) ?",
      "options": [
        "Le pipeline continue vers `quality` et `deploy` malgré l'échec.",
        "Les stages suivants (`quality`, `security`, `deploy`) ne s'exécutent pas — le pipeline est marqué `failed` et le merge request est bloqué.",
        "GitLab envoie un email et continue quand même.",
        "Le stage `test` est ignoré si `allow_failure: true` est absent."
      ],
      "answer": "Les stages suivants (`quality`, `security`, `deploy`) ne s'exécutent pas — le pipeline est marqué `failed` et le merge request est bloqué.",
      "explanation": "Comportement par défaut GitLab CI : si un job échoue (exit code ≠ 0), le pipeline s'arrête. Les stages suivants ne s'exécutent pas. Le merge request affiche un badge rouge. Exception : `allow_failure: true` permet à un job d'échouer sans bloquer le pipeline (utilisé pour des analyses non bloquantes). En banque : `allow_failure: false` (défaut) est obligatoire sur les jobs `test` et `security`."
    },
    {
      "question": "[CI/CD — Commandes] Quelle commande .NET génère un rapport de coverage au format Cobertura (XML) ?",
      "options": [
        "`dotnet coverage --format xml`",
        "`dotnet test --collect:\"XPlat Code Coverage\"` avec le package `coverlet.collector`",
        "`dotnet analyze --coverage`",
        "`dotnet report --cobertura`"
      ],
      "answer": "`dotnet test --collect:\"XPlat Code Coverage\"` avec le package `coverlet.collector`",
      "explanation": "`--collect:\"XPlat Code Coverage\"` active la collecte de coverage via `coverlet.collector` (NuGet package). Il génère automatiquement `coverage.cobertura.xml` dans le répertoire de test results. GitLab CI peut parser ce fichier pour afficher le % dans l'interface. Configuration dans GitLab CI : `coverage: '/Total[^|]*\\|[^|]*\\|\\s*(\\d+\\.?\\d*)%/'` pour extraire le pourcentage."
    },
    {
      "question": "[Bandit — Python] Quel type de vulnérabilités détecte Bandit dans un pipeline Python ?",
      "options": [
        "Uniquement les erreurs de syntaxe Python.",
        "Les vulnérabilités de sécurité dans le code source : injection de commandes shell, usage de hashlib.md5 sans `usedforsecurity=False`, hardcoding de mots de passe, `subprocess` avec `shell=True`.",
        "Les packages Python avec des licences non conformes.",
        "Les violations de style PEP 8."
      ],
      "answer": "Les vulnérabilités de sécurité dans le code source : injection de commandes shell, usage de hashlib.md5 sans `usedforsecurity=False`, hardcoding de mots de passe, `subprocess` avec `shell=True`.",
      "explanation": "Bandit est un analyseur SAST Python (Static Application Security Testing). Il détecte les patterns dangereux : `subprocess.call('rm -rf /', shell=True)` (injection), `password = 'oracle123'` (hardcoded secret), `md5(data)` (algorithme faible), `pickle.loads(data)` (désérialisation non sécurisée). Équivalent Python de Checkmarx pour les vérifications rapides en CI. `bandit -r src/ -ll` = signale uniquement les Medium et High."
    },
    {
      "question": "[GitHub Actions vs GitLab CI] Comment référence-t-on un secret (mot de passe, token) dans chaque outil ?",
      "options": [
        "Les deux utilisent `${SECRET_NAME}` dans le YAML.",
        "GitHub Actions : `${{ secrets.MY_TOKEN }}`. GitLab CI : `$MY_TOKEN` (défini dans CI/CD Variables du projet).",
        "GitHub Actions : `$MY_TOKEN`. GitLab CI : `{{ secrets.MY_TOKEN }}`.",
        "Les secrets ne sont pas supportés dans les pipelines YAML — il faut un fichier `.env`."
      ],
      "answer": "GitHub Actions : `${{ secrets.MY_TOKEN }}`. GitLab CI : `$MY_TOKEN` (défini dans CI/CD Variables du projet).",
      "explanation": "Syntaxe différente, concept identique : les secrets sont stockés chiffrés dans l'interface du service (jamais en clair dans le YAML). GitHub Actions : `${{ secrets.DOCKER_PASSWORD }}` dans les étapes. GitLab CI : `$CI_REGISTRY_PASSWORD` pour les variables prédéfinies ou `$SONAR_TOKEN` pour les variables définies dans Settings → CI/CD → Variables. En banque : les secrets (connexions Oracle, tokens SonarQube) sont définis dans GitLab Variables et injectés automatiquement."
    },
    {
      "question": "[Pipeline — `when: manual`] Dans quel cas utilise-t-on `when: manual` dans un pipeline GitLab CI bancaire ?",
      "options": [
        "Pour les jobs qui prennent plus de 10 minutes.",
        "Uniquement pour le déploiement en production — validation humaine obligatoire avant toute mise en prod (risque opérationnel, DORA).",
        "Pour tous les jobs de test — les tests doivent être approuvés par un lead developer.",
        "Pour le stage SonarQube car il peut prendre du temps."
      ],
      "answer": "Uniquement pour le déploiement en production — validation humaine obligatoire avant toute mise en prod (risque opérationnel, DORA).",
      "explanation": "`when: manual` crée un bouton 'play' dans l'interface GitLab — le job ne s'exécute que si quelqu'un clique. En banque, le deploy prod est TOUJOURS manuel : une mise en prod automatique d'un bug critique sur un système de risque peut avoir des conséquences réglementaires graves. DORA impose des procédures de changement documentées. Recette et staging peuvent être automatiques (`when: on_success`), prod = manuel avec approbation du release manager."
    }
  ],
  avance: [
    {
      "question": "[CI/CD — Multi-environnements] Comment gérer des configurations différentes (Oracle recette vs Oracle prod) dans un pipeline GitLab CI C# ?",
      "options": [
        "Hardcoder les deux configurations dans le code et commenter l'une.",
        "Utiliser des variables GitLab CI par environnement (`$ORACLE_CONN_RECETTE`, `$ORACLE_CONN_PROD`) combinées avec `appsettings.{Environment}.json` — l'environnement est injecté via `ASPNETCORE_ENVIRONMENT`.",
        "Créer deux branches différentes — une pour recette, une pour prod.",
        "Dupliquer le `.gitlab-ci.yml` pour chaque environnement."
      ],
      "answer": "Utiliser des variables GitLab CI par environnement (`$ORACLE_CONN_RECETTE`, `$ORACLE_CONN_PROD`) combinées avec `appsettings.{Environment}.json` — l'environnement est injecté via `ASPNETCORE_ENVIRONMENT`.",
      "explanation": "Pattern standard .NET multi-env : `appsettings.json` (base) + `appsettings.Recette.json` (override) + `appsettings.Production.json`. `ASPNETCORE_ENVIRONMENT=Production` déclenche la surcharge. GitLab CI injecte la valeur via `variables:` par environnement (Settings → Environments). La chaîne Oracle est stockée dans GitLab CI Variables (chiffrée), jamais dans le code. `dotnet publish` ne contient pas les secrets — ils sont injectés au runtime par Kubernetes via ConfigMap/Secret."
    },
    {
      "question": "[Docker — Sécurité] Un pipeline CI/CD bancaire exige que l'image Docker finale ne tourne pas en root. Comment l'implémenter correctement ?",
      "options": [
        "Utiliser `CMD [\"sudo\", \"-u\", \"appuser\", \"dotnet\", \"app.dll\"]`",
        "Créer un utilisateur non-root dans le Dockerfile : `RUN adduser --disabled-password appuser && chown -R appuser /app` puis `USER appuser` avant `ENTRYPOINT`.",
        "Utiliser `EXPOSE 443` au lieu de `EXPOSE 80` pour sécuriser.",
        "Ajouter `--no-root` dans la commande `docker run`."
      ],
      "answer": "Créer un utilisateur non-root dans le Dockerfile : `RUN adduser --disabled-password appuser && chown -R appuser /app` puis `USER appuser` avant `ENTRYPOINT`.",
      "explanation": "Sécurité conteneur : par défaut, les processus Docker tournent en `root` — si un attaquant exploite une vulnérabilité, il a les droits root dans le conteneur (et potentiellement sur l'hôte). Bonne pratique : créer un utilisateur dédié avec le minimum de privilèges. `chown -R appuser /app` donne les droits sur le répertoire applicatif uniquement. `USER appuser` bascule avant l'ENTRYPOINT. En banque : scanning des images Docker (Trivy, Clair) vérifie l'absence de root process."
    },
    {
      "question": "[Pipeline — Artifacts & Cache] Dans GitLab CI, quelle est la différence entre `artifacts` et `cache` ?",
      "options": [
        "Ce sont des synonymes — les deux stockent des fichiers entre jobs.",
        "`artifacts` : fichiers générés par un job, partagés entre stages du MÊME pipeline (ex: binaires compilés). `cache` : fichiers réutilisés entre PLUSIEURS pipelines (ex: packages NuGet, venv Python) pour accélérer les builds.",
        "`artifacts` sont stockés sur GitLab. `cache` est stocké localement sur le runner.",
        "`cache` est chiffré, `artifacts` ne le sont pas."
      ],
      "answer": "`artifacts` : fichiers générés par un job, partagés entre stages du MÊME pipeline (ex: binaires compilés). `cache` : fichiers réutilisés entre PLUSIEURS pipelines (ex: packages NuGet, venv Python) pour accélérer les builds.",
      "explanation": "Usage pratique FERMAT : `artifacts` sur le job `build` avec `paths: [\"**/bin/Release/\"]` → le job `test` peut utiliser les binaires compilés sans recompiler (`dotnet test --no-build`). `cache` sur `paths: [\".nuget/\"]` → `dotnet restore` ne re-télécharge pas les packages NuGet à chaque pipeline. `expire_in: 1 hour` sur les artifacts (inutiles après le pipeline). Cache = persistant entre pipelines. Artifacts = éphémère dans le pipeline."
    },
    {
      "question": "[DevSecOps — SAST vs DAST] Quelle est la différence entre SAST et DAST dans un pipeline CI/CD bancaire ?",
      "options": [
        "SAST analyse le code Python, DAST analyse le code C#.",
        "SAST (Static) analyse le code source sans l'exécuter — détecte les vulnérabilités dans le code. DAST (Dynamic) teste l'application en cours d'exécution — simule des attaques réelles sur l'API déployée.",
        "SAST est exécuté en production, DAST en développement.",
        "Ce sont deux noms pour le même outil — Checkmarx fait les deux simultanément."
      ],
      "answer": "SAST (Static) analyse le code source sans l'exécuter — détecte les vulnérabilités dans le code. DAST (Dynamic) teste l'application en cours d'exécution — simule des attaques réelles sur l'API déployée.",
      "explanation": "Pipeline DevSecOps complet : SAST (Checkmarx, SonarQube) dans le stage `security` — analyse le code statiquement, avant déploiement. DAST (OWASP ZAP, Burp Suite) dans un stage `staging-security` après déploiement sur staging — envoie des requêtes malveillantes et détecte les vulnérabilités runtime (injections SQL, XSS, authentification faible). En banque : les deux sont obligatoires pour les applications exposant une API (API REST FERMAT). SAST = rapide (minutes). DAST = lent (heures)."
    },
    {
      "question": "[Pipeline Python — `--cov-fail-under`] Un pipeline Python retourne exit code 1 malgré tous les tests verts. Quelle est la cause et la solution ?",
      "options": [
        "pytest est mal installé — réinstaller avec `pip install --upgrade pytest`.",
        "Le coverage global est inférieur au seuil `--cov-fail-under=80`. Solution : `pytest --cov-report=term-missing` pour identifier les lignes non couvertes, puis écrire les tests manquants.",
        "Un test est marqué `@pytest.mark.skip` — le supprimer pour que le coverage augmente.",
        "Le fichier `conftest.py` est absent du répertoire de test."
      ],
      "answer": "Le coverage global est inférieur au seuil `--cov-fail-under=80`. Solution : `pytest --cov-report=term-missing` pour identifier les lignes non couvertes, puis écrire les tests manquants.",
      "explanation": "`--cov-fail-under=80` force exit code 2 si le coverage total est sous 80%, indépendamment du résultat des tests. `--cov-report=term-missing` affiche dans le terminal les lignes exactes non couvertes (ex: `strategies.py   line 45-52: not covered`). Solution correcte : écrire des tests unitaires pour ces lignes. Ne JAMAIS baisser le seuil ou ajouter `# pragma: no cover` sans justification — en banque, le code non testé est un risque de production."
    },
    {
      "question": "[GitLab CI — `only` vs `rules`] Dans une pipeline GitLab CI récente, pourquoi préférer `rules:` à `only:` pour contrôler les déclencheurs d'un job ?",
      "options": [
        "`only:` est déprécié depuis GitLab 14 — `rules:` est le remplacement recommandé avec des conditions plus expressives (`if`, `changes`, `exists`).",
        "Ce sont des synonymes, le choix est une question de style.",
        "`rules:` est plus rapide que `only:` car il court-circuite l'évaluation.",
        "`only:` ne fonctionne que sur les branches protégées."
      ],
      "answer": "`only:` est déprécié depuis GitLab 14 — `rules:` est le remplacement recommandé avec des conditions plus expressives (`if`, `changes`, `exists`).",
      "explanation": "`rules:` offre des conditions composées : `if: $CI_COMMIT_BRANCH == 'main' && $CI_PIPELINE_SOURCE == 'push'` (branche + source). `changes:` déclenche uniquement si des fichiers spécifiques changent : `changes: [\"src/Risk/**/*\"]` → le job `test-risk` ne tourne que si des fichiers Risk ont changé — pipeline plus rapide. `exists:` vérifie la présence d'un fichier. `only:` ne supporte pas ces combinaisons. En FERMAT : `rules: changes: [\"src/ExposureEngine/**\"]` pour ne tester que le module modifié."
    },
    {
      "question": "[CI/CD — Rollback] Dans un pipeline Kubernetes (Natixis), comment implémenter un rollback automatique si le déploiement échoue ?",
      "options": [
        "Supprimer manuellement le pod défaillant dans Kubernetes.",
        "`kubectl rollout status deployment/fermat --timeout=5m` suivi de `kubectl rollout undo deployment/fermat` si le status échoue — intégré dans le script de deploy du pipeline.",
        "Redéployer l'image Docker précédente manuellement depuis l'interface GitLab.",
        "Kubernetes gère automatiquement les rollbacks sans configuration supplémentaire."
      ],
      "answer": "`kubectl rollout status deployment/fermat --timeout=5m` suivi de `kubectl rollout undo deployment/fermat` si le status échoue — intégré dans le script de deploy du pipeline.",
      "explanation": "Pattern rollback automatique dans GitLab CI : `script: - kubectl apply -f k8s/deployment.yaml - kubectl rollout status deployment/fermat --timeout=5m || (kubectl rollout undo deployment/fermat && exit 1)`. Si le rollout échoue (pods en CrashLoopBackOff, readiness probe échoue), `rollout undo` revient à la version précédente et le job échoue → alerte. En FERMAT : health check via `/health` endpoint après déploiement. Timeout 5 minutes = temps de démarrage d'une application Risk IT avec chargement des données Oracle."
    },
    {
      "question": "[Pipeline — Monorepo] FERMAT est un monorepo avec 3 modules (ExposureEngine, LimitMonitor, Reporting). Comment optimiser le pipeline GitLab CI pour ne tester que le module modifié ?",
      "options": [
        "Créer 3 branches séparées — une par module.",
        "Utiliser `rules: changes:` par job pour conditionner l'exécution aux fichiers modifiés : `rules: - changes: [\"src/ExposureEngine/**\"]` sur le job `test-exposure`.",
        "Tester les 3 modules à chaque push — c'est la seule façon fiable.",
        "Utiliser des sous-pipelines indépendants avec `trigger:` pour chaque module."
      ],
      "answer": "Utiliser `rules: changes:` par job pour conditionner l'exécution aux fichiers modifiés : `rules: - changes: [\"src/ExposureEngine/**\"]` sur le job `test-exposure`.",
      "explanation": "Optimisation monorepo avec `changes:` : `test-exposure: rules: - changes: [\"src/ExposureEngine/**\", \"tests/ExposureEngine/**\"]`. Un commit dans `src/Reporting/` ne déclenche que `test-reporting` — pas `test-exposure` ni `test-limitmonitor`. Pipeline 3× plus rapide. Alternative avancée : `trigger:` avec sous-pipelines (`include: local: 'src/ExposureEngine/.gitlab-ci.yml'`) — chaque module a son propre pipeline. En pratique FERMAT : les 3 modules partagent des classes (`Models/`) — `changes` sur `Models/` déclenche les 3 tests."
    }
  ],

  expert: [
    {
      "question": "[Checkmarx — SAST] Un scan Checkmarx détecte une vulnérabilité `SQL Injection` dans le code C# de FERMAT. Quelle est la correction appropriée ?",
      "options": [
        "Ajouter un commentaire `// NOSONAR` pour ignorer la vulnérabilité.",
        "Remplacer la concaténation de chaîne SQL par des paramètres liés : `new OracleCommand(\"SELECT * FROM EXPOSURE WHERE ID = :id\", conn)` avec `cmd.Parameters.Add(\":id\", id)` — jamais de `\"SELECT ... WHERE ID = \" + id`.",
        "Encoder l'input utilisateur en Base64 avant de l'injecter dans la requête SQL.",
        "Utiliser `try/catch` autour de la requête SQL pour gérer les injections."
      ],
      "answer": "Remplacer la concaténation de chaîne SQL par des paramètres liés : `new OracleCommand(\"SELECT * FROM EXPOSURE WHERE ID = :id\", conn)` avec `cmd.Parameters.Add(\":id\", id)` — jamais de `\"SELECT ... WHERE ID = \" + id`.",
      "explanation": "SQL Injection = vulnérabilité OWASP Top 1. Pattern dangereux : `\"SELECT * FROM EXPOSURE WHERE CPTY_ID = '\" + counterpartyId + \"'\"` → si `counterpartyId = \"'; DROP TABLE EXPOSURE; --\"` → catastrophe. Paramètres liés = la seule protection fiable : Oracle/SQL Server traite `:id` comme une valeur, jamais comme du SQL. En banque : une injection SQL sur la table EXPOSURE = accès à toutes les positions de toutes les contreparties = incident de sécurité majeur. Checkmarx bloque le merge jusqu'à la correction."
    },
    {
      "question": "[CI/CD Avancé — Blue/Green Deploy] Natixis déploie FERMAT en Blue/Green deployment. Qu'est-ce que cela implique dans le pipeline ?",
      "options": [
        "Le pipeline déploie deux versions différentes du code en même temps sur le même environnement.",
        "Le pipeline déploie la nouvelle version (Green) en parallèle de l'ancienne (Blue), bascule le trafic progressivement via le load balancer, et détruit Blue si Green est stable — rollback instantané possible en rebasculant sur Blue.",
        "Blue = C#, Green = Python — les deux versions du service coexistent.",
        "Blue/Green = déploiement le matin (Blue) et le soir (Green)."
      ],
      "answer": "Le pipeline déploie la nouvelle version (Green) en parallèle de l'ancienne (Blue), bascule le trafic progressivement via le load balancer, et détruit Blue si Green est stable — rollback instantané possible en rebasculant sur Blue.",
      "explanation": "Blue/Green dans le pipeline FERMAT : `kubectl apply -f k8s/deployment-green.yaml` (nouvelle version). Health checks sur Green pendant 5 minutes. Si OK : `kubectl patch service fermat-svc -p '{\"spec\":{\"selector\":{\"version\":\"green\"}}}'` (bascule du trafic). Monitoring 15 minutes. Si KO : patch selector vers 'blue' (rollback < 1s). Si OK : `kubectl delete deployment fermat-blue`. Avantage : zéro downtime, rollback instantané. En banque : critique pour les services de risque temps réel — un arrêt pendant le calcul du VaR de clôture est inacceptable."
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

const Page_CICD = () => {
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

export default Page_CICD;

