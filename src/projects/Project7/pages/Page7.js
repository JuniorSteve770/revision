// src/projects/Project3/pages/Page_GitHubDeploy.js

import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "GitHub Actions — Architecture & déclencheurs | Deploy automatisé",
    "answer": "**GitHub Actions** = CI/CD natif GitHub. Chaque workflow est un fichier YAML dans `.github/workflows/`. ◆ **Déclencheurs (`on:`)** : `push: branches: [main]` (push sur main), `pull_request: branches: [main]` (toute PR vers main), `workflow_dispatch:` (déclenchement manuel via l'UI), `schedule: cron: '0 18 * * 1-5'` (tous les soirs à 18h lundi-vendredi), `release: types: [published]` (publication d'une release). ◆ **Logique bancaire** : PR vers main → CI (tests + qualité). Merge sur main → CD (deploy prod). Push sur develop → deploy recette automatique. ◆ **Mots-clés** : `on:`, `jobs:`, `steps:`, `uses:`, `run:`, `env:`, `secrets:`, `needs:` (dépendance entre jobs), `if:` (condition d'exécution)."
  },
  {
    "question": "GitHub Actions → AWS — ECS, EC2, Lambda | Deploy Cloud",
    "answer": "**AWS + GitHub Actions** : 3 cibles principales. ◆ **ECS (Elastic Container Service)** : déploiement de conteneurs Docker. Flow : `docker build` → `docker push ECR` → `aws ecs update-service`. Action : `aws-actions/amazon-ecs-deploy-task-definition`. ◆ **EC2** : déploiement sur VM. Via `aws-actions/aws-codedeploy` ou SSH + `appleboy/ssh-action`. ◆ **Lambda** : fonctions serverless. `aws lambda update-function-code --function-name fermat-calculator --zip-file fileb://function.zip`. ◆ **Auth** : `aws-actions/configure-aws-credentials` avec OIDC (plus sécurisé que access keys). ◆ **ECR** : registry Docker AWS (équivalent Harbor). `aws ecr get-login-password | docker login`. ◆ **Mots-clés** : `ECS`, `ECR`, `task definition`, `OIDC`, `IAM role`, `region`."
  },
  {
    "question": "GitHub Actions → Azure — App Service, AKS, ACR | Deploy Cloud",
    "answer": "**Azure + GitHub Actions** : 3 cibles principales. ◆ **Azure App Service** : déploiement d'applications web C#/.NET. Action : `azure/webapps-deploy@v3`. `publish-profile` dans les secrets GitHub. ◆ **AKS (Azure Kubernetes Service)** : K8s managé Azure. `azure/aks-set-context` → `kubectl apply`. ◆ **ACR (Azure Container Registry)** : registry Docker Azure. `azure/docker-login@v1` → `docker push myacr.azurecr.io/fermat:$SHA`. ◆ **Auth** : `azure/login@v2` avec Service Principal (JSON dans secrets) ou OIDC Federated Credentials. ◆ **Slot deployment** : App Service Slots — déploie sur `staging` slot d'abord → tests → `swap` vers production (Blue/Green natif Azure). ◆ **Mots-clés** : `App Service`, `AKS`, `ACR`, `Service Principal`, `slot swap`, `resource group`."
  },
  {
    "question": "GitHub Actions — Stratégies de déploiement par branche | Contextes",
    "answer": "**Logique de déploiement par contexte** : ◆ **Push sur `feature/*`** → CI uniquement (build + tests). Pas de deploy. ◆ **Push sur `develop`** → CI + deploy automatique en **recette** (`environment: staging`). ◆ **Merge/push sur `main`** → CI + deploy automatique en **staging** + deploy **prod** `if: github.ref == 'refs/heads/main'`. ◆ **`workflow_dispatch:`** → deploy manuel depuis l'UI GitHub avec paramètres (choix de l'environnement, version). ◆ **`release: types: [published]`** → deploy prod déclenché par la publication d'une release GitHub (tag versionné). ◆ **`schedule:`** → calcul EOD ou rapport quotidien. ◆ **Condition dans un job** : `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`."
  },
  {
    "question": "GitHub Actions — OIDC : authentification sans clé secrète | AWS & Azure",
    "answer": "**Problème** : stocker `AWS_ACCESS_KEY_ID` et `AWS_SECRET_ACCESS_KEY` dans les secrets GitHub = risque de fuite, rotation manuelle. ◆ **OIDC (OpenID Connect)** : GitHub génère un token JWT signé pour chaque workflow. AWS/Azure valide ce token et donne un accès temporaire (15 minutes) — aucune clé secrète stockée. ◆ **AWS OIDC** : créer un IAM Identity Provider GitHub (`token.actions.githubusercontent.com`) + IAM Role avec condition `repo:MyOrg/fermat:ref:refs/heads/main`. Action : `aws-actions/configure-aws-credentials@v4` avec `role-to-assume`. ◆ **Azure OIDC** : Federated Credentials sur le Service Principal. `azure/login@v2` avec `client-id`, `tenant-id`, `subscription-id`. ◆ **Avantage** : pas de secrets à gérer, accès automatiquement expiré, traçabilité par workflow."
  },
  {
    "question": "GitHub Actions — Environments, Protection Rules & Approvals",
    "answer": "**Environments GitHub** : namespaces pour les déploiements avec règles de protection. ◆ **Required reviewers** : un job `deploy-prod` dans l'environnement `production` attend l'approbation d'un reviewer désigné avant de s'exécuter. ◆ **Wait timer** : délai obligatoire avant déploiement (ex: 10 minutes de vérification post-deploy staging). ◆ **Branch restrictions** : seule la branche `main` peut déployer sur `production`. ◆ **Deployment history** : historique complet de tous les déploiements par environnement (qui, quand, quel commit). ◆ **Secrets scoped** : `ORACLE_PROD_CONN` visible uniquement par les jobs dans l'environnement `production`. ◆ **Usage** : `environment: name: production url: https://fermat.company.com` dans le job. ◆ **Équivalent GitLab** : `when: manual` + protected environments."
  },
  {
    "question": "GitHub Actions — Matrix Strategy & Parallel Jobs | Optimisation",
    "answer": "**Matrix strategy** : exécuter le même job avec des paramètres différents en parallèle. ◆ **Exemple C#** : `matrix: dotnet-version: [6.0, 7.0, 8.0]` → teste l'application sur 3 versions .NET simultanément. ◆ **Exemple multi-OS** : `matrix: os: [ubuntu-latest, windows-latest]` → vérifie la compatibilité cross-platform. ◆ **Exemple multi-env** : `matrix: environment: [recette, staging]` → déploie en parallèle sur 2 environnements. ◆ **`needs:`** : définit les dépendances entre jobs. `deploy-prod needs: [test, sonarqube, security]` → tous doivent réussir avant le deploy. ◆ **`fail-fast: false`** : si un job matrix échoue, les autres continuent (utile pour les rapports de compatibilité). ◆ **Mots-clés** : `matrix:`, `include:`, `exclude:`, `needs:`, `fail-fast:`."
  },
  {
    "question": "GitHub Actions — Cas moins connus : Dependabot & GitHub Pages | Automatisation avancée",
    "answer": "**Dependabot** : bot GitHub qui crée automatiquement des PRs pour mettre à jour les dépendances (NuGet, pip, npm). Config dans `.github/dependabot.yml`. `package-ecosystem: nuget` + `schedule: interval: weekly`. Auto-merge possible pour les mises à jour patch. ◆ **GitHub Pages** : déploiement automatique de documentation statique. `actions/upload-pages-artifact` + `actions/deploy-pages`. Utile pour publier les rapports de coverage ou la doc API (Swagger) après chaque merge sur main. ◆ **GitHub Container Registry (GHCR)** : `ghcr.io/myorg/fermat:sha` — registry Docker intégré à GitHub. Auth : `GITHUB_TOKEN` automatique, pas de secret supplémentaire. ◆ **Composite Actions** : factoriser des étapes communes dans une action réutilisable locale (`.github/actions/setup-dotnet/action.yml`)."
  }
];

const questions = {
  moyen: [
    {
      "question": "[Déclencheurs] Un pipeline doit s'exécuter UNIQUEMENT lors d'un push sur `main` ou `develop`, mais pas sur les branches `feature/*`. Quelle configuration est correcte ?",
      "options": [
        "`on: push: branches: ['*']` puis filtrer dans le code du job.",
        "`on: push: branches: [main, develop]` — seules les branches listées déclenchent le workflow.",
        "`on: push: branches-ignore: [feature/*]` — exclut les branches feature mais déclenche sur tout le reste.",
        "`on: push:` sans configuration — GitHub Actions ne déclenche pas sur les branches feature par défaut."
      ],
      "answer": "`on: push: branches: [main, develop]` — seules les branches listées déclenchent le workflow.",
      "explanation": "Whitelist vs blacklist : `branches:` = whitelist (déclenche UNIQUEMENT sur ces branches). `branches-ignore:` = blacklist (déclenche sur tout SAUF ces branches). Pour main + develop uniquement : `on: push: branches: [main, develop]`. Pour exclure feature/* (déclenche sur tout le reste) : `on: push: branches-ignore: ['feature/**']`. En pratique bancaire : whitelist explicite préférable — plus sécurisé (un nouveau type de branche ne déclenche pas par accident)."
    },
    {
      "question": "[AWS — ECS] Un workflow GitHub Actions doit déployer une image Docker sur Amazon ECS. Dans quel ordre les étapes doivent-elles s'exécuter ?",
      "options": [
        "Deploy ECS → Build Docker → Push ECR → Configure AWS credentials.",
        "Configure AWS credentials (OIDC) → Build Docker image → Push vers ECR → Update ECS task definition → Deploy sur ECS.",
        "Build Docker → Configure AWS → Push ECR → Deploy ECS.",
        "Push ECR → Build Docker → Configure AWS → Deploy ECS."
      ],
      "answer": "Configure AWS credentials (OIDC) → Build Docker image → Push vers ECR → Update ECS task definition → Deploy sur ECS.",
      "explanation": "Ordre logique obligatoire : (1) `aws-actions/configure-aws-credentials` avec OIDC — sans auth AWS, rien ne fonctionne. (2) `docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$SHA .` — construire l'image. (3) `docker push $ECR_REGISTRY/$ECR_REPOSITORY:$SHA` — l'image doit être dans ECR avant ECS. (4) `aws-actions/amazon-ecs-render-task-definition` — mettre à jour la task definition avec le nouveau tag d'image. (5) `aws-actions/amazon-ecs-deploy-task-definition` — déployer la nouvelle task definition sur le service ECS. Si on inverse 3 et 4 : ECS référence une image inexistante → CrashLoopBackOff."
    },
    {
      "question": "[Azure — App Service Slots] Quelle est la valeur du déploiement sur un slot `staging` avant un slot swap vers production ?",
      "options": [
        "Les slots staging permettent d'économiser les coûts Azure en déployant sur une infrastructure plus petite.",
        "Le slot staging reçoit le nouveau code et peut être testé/validé (smoke tests, UAT) avant le swap atomique vers production — rollback instantané possible en re-swappant.",
        "Les slots sont obligatoires dans Azure — on ne peut pas déployer directement en production.",
        "Le slot staging permet de déployer sans downtime car il tourne en parallèle de la production."
      ],
      "answer": "Le slot staging reçoit le nouveau code et peut être testé/validé (smoke tests, UAT) avant le swap atomique vers production — rollback instantané possible en re-swappant.",
      "explanation": "Azure App Service Slots = Blue/Green natif. Le swap est atomique (< 1 seconde, zéro downtime) : Azure bascule les URLs entre les slots. Avant swap : tester sur `fermat-app-staging.azurewebsites.net`. Après swap : staging devient l'ancienne version (rollback instantané = re-swapper). Dans GitHub Actions : `azure/webapps-deploy@v3 slot-name: staging` puis `azure/cli@v2` avec `az webapp deployment slot swap --slot staging --target-slot production`. Les variables d'environnement sont 'sticky' (restent dans leur slot) ou 'swappables' selon la config Azure."
    },
    {
      "question": "[OIDC — Sécurité] Pourquoi OIDC est-il préférable aux Access Keys AWS stockées dans les secrets GitHub ?",
      "options": [
        "OIDC est plus rapide car il ne nécessite pas d'appel réseau vers AWS.",
        "OIDC génère des credentials temporaires (15 min) par workflow — pas de secret long terme à stocker/rotation, accès limité à un repo/branche spécifique, traçabilité fine dans AWS CloudTrail.",
        "OIDC est obligatoire pour utiliser AWS avec GitHub Actions.",
        "OIDC fonctionne uniquement pour AWS, pas pour Azure."
      ],
      "answer": "OIDC génère des credentials temporaires (15 min) par workflow — pas de secret long terme à stocker/rotation, accès limité à un repo/branche spécifique, traçabilité fine dans AWS CloudTrail.",
      "explanation": "Problèmes des Access Keys statiques : (1) Rotation manuelle (souvent négligée). (2) Si la clé fuite (repo public accidentel, log), l'attaquant a un accès permanent. (3) Difficile à scoper finement. OIDC : GitHub génère un JWT signé contenant `repo:MyOrg/fermat:ref:refs/heads/main`. AWS IAM vérifie ce token et assume un rôle IAM. Condition IAM : `StringEquals: token.actions.githubusercontent.com:sub: repo:MyOrg/fermat:ref:refs/heads/main` → seul ce workflow précis peut assumer ce rôle. Credentials expirent en 15 min → même en cas de log leak, inutilisables."
    },
    {
      "question": "[`needs:` — Dépendances] Dans un pipeline avec jobs `build`, `test`, `security`, `deploy-staging`, `deploy-prod`, comment garantir que le deploy-prod n'arrive qu'après tous les contrôles ?",
      "options": [
        "Mettre tous les jobs dans le même stage — ils s'exécutent séquentiellement.",
        "`deploy-prod: needs: [test, security, deploy-staging]` — deploy-prod attend la réussite des 3 jobs listés.",
        "`deploy-prod: if: always()` — s'exécute toujours en dernier.",
        "L'ordre des jobs dans le YAML détermine l'ordre d'exécution."
      ],
      "answer": "`deploy-prod: needs: [test, security, deploy-staging]` — deploy-prod attend la réussite des 3 jobs listés.",
      "explanation": "Par défaut, les jobs GitHub Actions s'exécutent EN PARALLÈLE. `needs:` crée une dépendance : `deploy-prod` attend que `test`, `security` ET `deploy-staging` aient réussi. Si l'un échoue → `deploy-prod` est skippé automatiquement. `deploy-staging: needs: [test, security]` → staging ne démarre qu'après tests et sécurité. `deploy-prod: needs: [deploy-staging]` → prod n'arrive qu'après staging validé. L'ordre dans le YAML n'a aucun impact sur l'exécution — seul `needs:` définit le graphe d'exécution."
    },
    {
      "question": "[GitHub Environments — Approval] Comment configurer GitHub Actions pour qu'un déploiement en production nécessite l'approbation d'un lead developer ?",
      "options": [
        "Ajouter `if: github.actor == 'lead-developer'` dans le job de deploy.",
        "Créer un Environment `production` dans GitHub Settings → Environments, ajouter Required Reviewers. Le job `deploy-prod` avec `environment: production` sera mis en pause jusqu'à l'approbation.",
        "Utiliser `when: manual` comme dans GitLab CI.",
        "Ajouter une étape `- run: read -p 'Approuver ? '` dans le YAML."
      ],
      "answer": "Créer un Environment `production` dans GitHub Settings → Environments, ajouter Required Reviewers. Le job `deploy-prod` avec `environment: production` sera mis en pause jusqu'à l'approbation.",
      "explanation": "GitHub Environments Protection Rules : Settings → Environments → production → Required reviewers (jusqu'à 6 personnes/équipes). Quand le job `deploy-prod` démarre, GitHub envoie une notification aux reviewers. Ils peuvent approuver ou rejeter depuis l'interface GitHub ou l'email. Jusqu'à l'approbation, le job est en état 'waiting'. Timer optionnel (ex: 5 min minimum après deploy staging). Branch restriction : seule `main` peut déployer en `production`. En banque : équivalent du Change Advisory Board (CAB) — validation humaine obligatoire."
    },
    {
      "question": "[AWS Lambda — Deploy] Comment déployer une mise à jour d'une fonction Lambda Python depuis GitHub Actions ?",
      "options": [
        "`aws lambda create-function --function-name fermat-calc --zip-file fileb://app.zip`",
        "Zipper le code (`zip -r function.zip src/`), puis `aws lambda update-function-code --function-name fermat-calc --zip-file fileb://function.zip`.",
        "Pousser le code sur S3 et redémarrer Lambda manuellement.",
        "Lambda se met à jour automatiquement quand le code change dans le repo GitHub."
      ],
      "answer": "Zipper le code (`zip -r function.zip src/`), puis `aws lambda update-function-code --function-name fermat-calc --zip-file fileb://function.zip`.",
      "explanation": "Deploy Lambda dans GitHub Actions : (1) `pip install -r requirements.txt -t ./package/` (dépendances dans le zip). (2) `zip -r function.zip package/ src/`. (3) `aws lambda update-function-code --function-name fermat-calc --zip-file fileb://function.zip --region eu-west-1`. Alternative plus robuste : pousser sur S3 d'abord (`aws s3 cp function.zip s3://deploy-bucket/`) puis `aws lambda update-function-code --s3-bucket deploy-bucket --s3-key function.zip` — évite la limite de taille directe (50MB). `create-function` = créer pour la première fois (pas mettre à jour)."
    },
    {
      "question": "[`workflow_dispatch` — Deploy Manuel] Comment créer un workflow GitHub Actions qui permet de déployer manuellement sur un environnement choisi (recette ou prod) depuis l'UI GitHub ?",
      "options": [
        "`on: manual:` dans le YAML.",
        "`on: workflow_dispatch: inputs: environment: description: 'Environnement cible' type: choice options: [recette, production]` — puis `run: echo \"Deploy sur ${{ inputs.environment }}\"`.",
        "`on: push: branches: [manual-deploy]` — pousser sur cette branche déclenche un deploy manuel.",
        "Il n'est pas possible de passer des paramètres à un workflow GitHub Actions."
      ],
      "answer": "`on: workflow_dispatch: inputs: environment: description: 'Environnement cible' type: choice options: [recette, production]` — puis `run: echo \"Deploy sur ${{ inputs.environment }}\"`.",
      "explanation": "`workflow_dispatch` avec `inputs` : ajoute un formulaire dans l'UI GitHub (Actions → Run workflow). Types d'inputs : `string`, `boolean`, `choice`, `environment`, `number`. L'input est accessible via `${{ inputs.environment }}`. Exemple complet : `if: inputs.environment == 'production'` pour conditionner certaines étapes. En banque : utile pour des déploiements d'urgence hors pipeline (hotfix) ou pour rejouer un déploiement sur un environnement spécifique avec un paramètre de version. Combiné avec Required Reviewers sur l'environnement `production` = deploy manuel sécurisé."
    },
    {
      "question": "[GitHub Container Registry] Quelle est la différence entre ECR (AWS), ACR (Azure) et GHCR (GitHub Container Registry) ?",
      "options": [
        "Ce sont des synonymes — ils stockent tous les images Docker de la même façon.",
        "ECR = registry Docker managé AWS (intégré IAM). ACR = registry Docker managé Azure (intégré Azure AD). GHCR = registry Docker intégré GitHub (auth via GITHUB_TOKEN, lié aux packages du repo).",
        "ECR supporte uniquement les images .NET, ACR uniquement Python.",
        "GHCR est limité aux images publiques — ECR et ACR gèrent les images privées."
      ],
      "answer": "ECR = registry Docker managé AWS (intégré IAM). ACR = registry Docker managé Azure (intégré Azure AD). GHCR = registry Docker intégré GitHub (auth via GITHUB_TOKEN, lié aux packages du repo).",
      "explanation": "Choix du registry selon le cloud : AWS → ECR (`123456789.dkr.ecr.eu-west-1.amazonaws.com/fermat`). Azure → ACR (`fermat.azurecr.io/fermat`). GitHub → GHCR (`ghcr.io/myorg/fermat`). GHCR avantage : `GITHUB_TOKEN` automatique dans GitHub Actions — pas de secret supplémentaire, `permissions: packages: write` dans le job suffit. Auth : `echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin`. En banque on-premise : Harbor (CNCF). En startups full-cloud : GHCR pour simplicité, ECR/ACR si déjà dans l'écosystème cloud."
    },
    {
      "question": "[Caching — Actions] Dans un workflow C# qui tourne en 8 minutes à cause de `dotnet restore`, comment réduire ce temps ?",
      "options": [
        "Utiliser `runs-on: ubuntu-latest-fast` — runner plus puissant.",
        "Utiliser `actions/cache@v4` pour cacher le dossier `~/.nuget/packages` — clé basée sur le hash de `*.csproj`. Si les dépendances n'ont pas changé, le cache est restauré en 10 secondes.",
        "Supprimer `dotnet restore` — `dotnet build` le fait implicitement.",
        "Utiliser `dotnet restore --no-cache` pour éviter les conflits de cache."
      ],
      "answer": "Utiliser `actions/cache@v4` pour cacher le dossier `~/.nuget/packages` — clé basée sur le hash de `*.csproj`. Si les dépendances n'ont pas changé, le cache est restauré en 10 secondes.",
      "explanation": "`actions/cache@v4` : `key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}`. Si `*.csproj` n'a pas changé → cache hit → NuGet packages restaurés en ~10s au lieu de `dotnet restore` (~4 minutes). `restore-keys: ${{ runner.os }}-nuget-` = fallback sur le cache le plus récent si la clé exacte n'existe pas. Équivalent Python : cacher `~/.cache/pip` avec clé `hashFiles('requirements.txt')`. Économie : 4-6 minutes par pipeline → sur 50 pipelines/jour = 3-5h de runner time économisées. GitHub Actions facture au runtime (minutes) sur les repos privés."
    },
    {
      "question": "[Azure AKS — Deploy] Comment déployer une application sur AKS (Azure Kubernetes Service) depuis GitHub Actions ?",
      "options": [
        "`az aks deploy --cluster fermat-aks --image fermat:latest`",
        "`azure/aks-set-context@v4` (configure kubectl pour AKS) → `docker push ACR` → `kubectl apply -f k8s/` ou `helm upgrade fermat ./charts`.",
        "AKS se synchronise automatiquement avec GitHub — aucune étape de deploy nécessaire.",
        "`kubectl config use-context aks-fermat` puis `kubectl apply` — les credentials AKS sont automatiquement disponibles."
      ],
      "answer": "`azure/aks-set-context@v4` (configure kubectl pour AKS) → `docker push ACR` → `kubectl apply -f k8s/` ou `helm upgrade fermat ./charts`.",
      "explanation": "Deploy AKS depuis GitHub Actions : (1) `azure/login@v2` (auth Service Principal ou OIDC). (2) `docker build + push vers ACR`. (3) `azure/aks-set-context@v4 cluster-name: fermat-aks resource-group: rg-fermat` — configure `kubectl` avec les credentials AKS. (4) `kubectl set image deployment/fermat app=fermat.azurecr.io/fermat:$SHA` ou `helm upgrade fermat ./charts --set image.tag=$SHA`. (5) `kubectl rollout status deployment/fermat`. Helm recommandé pour FERMAT : gère les ConfigMaps, Secrets, Services, Ingress en un seul chart — `helm upgrade --install` est idempotent."
    },
    {
      "question": "[Dependabot — Sécurité automatique] Dependabot détecte une vulnérabilité critique (CVE) dans une dépendance NuGet de FERMAT. Que se passe-t-il automatiquement ?",
      "options": [
        "Dependabot déploie automatiquement le patch en production.",
        "Dependabot crée une Pull Request avec la version corrigée, déclenche le pipeline CI sur cette PR (tests + SonarQube), et envoie une alerte de sécurité aux mainteneurs du repo.",
        "Dependabot supprime la dépendance vulnérable du code source.",
        "Dependabot envoie un email mais ne crée pas de PR automatiquement."
      ],
      "answer": "Dependabot crée une Pull Request avec la version corrigée, déclenche le pipeline CI sur cette PR (tests + SonarQube), et envoie une alerte de sécurité aux mainteneurs du repo.",
      "explanation": "Dependabot workflow : (1) Scan quotidien/hebdomadaire des dépendances vs GitHub Advisory Database. (2) CVE critique → PR automatique `Bump Newtonsoft.Json from 12.0.1 to 13.0.3`. (3) Le pipeline CI s'exécute sur cette PR (tests, compatibilité). (4) Si CI vert → un mainteneur peut merger (ou auto-merge pour les patches). Config `.github/dependabot.yml` : `package-ecosystem: nuget`, `schedule: interval: daily`, `assignees: [security-lead]`. En banque : Dependabot Security Alerts + secret scanning = GitHub Advanced Security. CVE critique sans fix en 30 jours = non-conformité DORA."
    }
  ],
  avance: [
    {
      "question": "[Reusable Workflows] L'organisation Natixis a 15 repos avec le même pipeline CI C#. Comment éviter de dupliquer le YAML dans chaque repo ?",
      "options": [
        "Copier-coller le YAML dans chaque repo et maintenir 15 versions séparées.",
        "Créer un workflow réutilisable dans un repo central (`natixis-org/shared-workflows/.github/workflows/dotnet-ci.yml`) avec `on: workflow_call:`. Les repos l'appellent avec `uses: natixis-org/shared-workflows/.github/workflows/dotnet-ci.yml@main`.",
        "Utiliser `include:` pour référencer un YAML externe dans GitHub Actions.",
        "Créer une GitHub Action composite dans chaque repo avec `uses: ./local-action`."
      ],
      "answer": "Créer un workflow réutilisable dans un repo central (`natixis-org/shared-workflows/.github/workflows/dotnet-ci.yml`) avec `on: workflow_call:`. Les repos l'appellent avec `uses: natixis-org/shared-workflows/.github/workflows/dotnet-ci.yml@main`.",
      "explanation": "Reusable Workflows : `on: workflow_call: inputs: dotnet-version: type: string default: '8.0'`. Les repos consommateurs : `jobs: ci: uses: natixis-org/shared-workflows/.github/workflows/dotnet-ci.yml@main with: dotnet-version: '8.0' secrets: SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}`. Avantages : un seul endroit de maintenance, mise à jour immédiate pour tous les repos en changeant `@main`. Différence avec Composite Actions : Reusable Workflow = workflow complet réutilisable. Composite Action = ensemble d'étapes réutilisables dans un workflow. En banque : le repo `shared-workflows` est maintenu par la DSI, les équipes applicatives consomment."
    },
    {
      "question": "[AWS — Canary Deploy via CodeDeploy] Comment implémenter un déploiement canary (10% du trafic) sur AWS ECS depuis GitHub Actions ?",
      "options": [
        "Déployer 1 task sur 10 dans le service ECS — la répartition est automatiquement 10%.",
        "Utiliser AWS CodeDeploy avec une `AppSpec` Blue/Green et `Linear10PercentEvery1Minute` — CodeDeploy gère la bascule progressive du trafic via ALB Target Groups, GitHub Actions ne fait que déclencher le déploiement.",
        "Modifier le load balancer ALB manuellement pour router 10% vers le nouveau target group.",
        "Canary deploy n'est pas possible sur ECS — utiliser EKS avec Istio."
      ],
      "answer": "Utiliser AWS CodeDeploy avec une `AppSpec` Blue/Green et `Linear10PercentEvery1Minute` — CodeDeploy gère la bascule progressive du trafic via ALB Target Groups, GitHub Actions ne fait que déclencher le déploiement.",
      "explanation": "AWS CodeDeploy + GitHub Actions : l'action `aws-actions/amazon-ecs-deploy-task-definition` avec `codedeploy-appspec` déclenche CodeDeploy. L'AppSpec définit la stratégie : `Linear10PercentEvery1Minute` = +10% toutes les minutes (10 min pour 100%). `Canary10Percent5Minutes` = 10% pendant 5 min → 100% si OK. ALB route le trafic entre Blue Target Group (ancien) et Green (nouveau). Alarms CloudWatch : si error rate > 1% → rollback automatique CodeDeploy. GitHub Actions déclenche et attend le résultat : `aws deploy wait deployment-successful --deployment-id $DEPLOYMENT_ID`. En FERMAT : canary = calculer sur 10% des contreparties d'abord."
    },
    {
      "question": "[GitHub Actions — Self-Hosted Runners] Natixis ne peut pas utiliser les runners GitHub cloud pour des raisons de sécurité. Quelle alternative ?",
      "options": [
        "Migrer vers GitLab CI qui supporte les runners on-premise.",
        "Déployer des Self-Hosted Runners sur l'infrastructure interne Natixis. `runs-on: self-hosted` (ou labels custom comme `runs-on: [self-hosted, linux, oracle]`). Le runner s'enregistre auprès de GitHub via un token, les jobs s'exécutent en interne.",
        "Les runners GitHub cloud sont obligatoires — il n'y a pas d'alternative.",
        "Utiliser GitHub Enterprise Server qui héberge tout l'infrastructure GitHub on-premise."
      ],
      "answer": "Déployer des Self-Hosted Runners sur l'infrastructure interne Natixis. `runs-on: self-hosted` (ou labels custom comme `runs-on: [self-hosted, linux, oracle]`). Le runner s'enregistre auprès de GitHub via un token, les jobs s'exécutent en interne.",
      "explanation": "Self-Hosted Runners : un agent installé sur un serveur interne Natixis (Linux/Windows). Il se connecte à GitHub via HTTPS sortant (pas de port entrant). Les jobs s'exécutent localement — accès Oracle, accès aux registries internes, pas de transfert de code à l'extérieur. Labels : `[self-hosted, linux, docker, oracle-client]` → cibler des runners avec Oracle Instant Client installé pour les tests d'intégration. Sécurité : ne PAS utiliser self-hosted sur les repos publics (risque d'exécution de code malveillant via PR fork). GitHub Enterprise Server (GHES) = GitHub entier hébergé on-premise — alternative plus complète mais coûteuse."
    },
    {
      "question": "[Multi-Cloud — AWS + Azure] FERMAT est déployé sur AWS (calculs risk) et Azure (reporting/BI). Comment orchestrer un déploiement cohérent des deux depuis GitHub Actions ?",
      "options": [
        "Créer deux repos séparés avec deux pipelines indépendants.",
        "Un seul workflow avec deux jobs parallèles après les tests : `deploy-aws: needs: [test]` et `deploy-azure: needs: [test]`. Chaque job utilise ses propres actions et secrets. `deploy-finalize: needs: [deploy-aws, deploy-azure]` valide que les deux sont déployés.",
        "Déployer AWS en premier, puis Azure séquentiellement dans le même job.",
        "Multi-cloud est impossible à orchestrer depuis GitHub Actions — utiliser Terraform Cloud."
      ],
      "answer": "Un seul workflow avec deux jobs parallèles après les tests : `deploy-aws: needs: [test]` et `deploy-azure: needs: [test]`. Chaque job utilise ses propres actions et secrets. `deploy-finalize: needs: [deploy-aws, deploy-azure]` valide que les deux sont déployés.",
      "explanation": "Multi-cloud depuis GitHub Actions : les jobs sont indépendants (runners séparés, secrets séparés). `deploy-aws` configure `aws-actions/configure-aws-credentials` + push ECR + ECS update. `deploy-azure` configure `azure/login` + push ACR + AKS deploy. Les deux s'exécutent en parallèle — délai réduit. `deploy-finalize: needs: [deploy-aws, deploy-azure]` = smoke tests cross-cloud (vérifier que l'API AWS répond et que le reporting Azure a bien reçu les données). Si AWS déploie et Azure échoue : `deploy-finalize` échoue → alerte → rollback manuel AWS. En FERMAT : cohérence entre le moteur de calcul et le reporting = criticité maximale."
    },
    {
      "question": "[GitHub Actions Security — Hardening] Un audit de sécurité détecte que les workflows FERMAT utilisent `actions/checkout@v3` sans vérification de l'intégrité. Quelle est la bonne pratique ?",
      "options": [
        "Mettre à jour vers `actions/checkout@v4` — la dernière version est toujours la plus sécurisée.",
        "Référencer les actions par leur SHA de commit complet : `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` — immuable et vérifiable via `sigstore/cosign`.",
        "Héberger toutes les actions dans le repo FERMAT pour ne pas dépendre d'actions tierces.",
        "Utiliser `actions/checkout@latest` — le tag `latest` garantit la dernière version sécurisée."
      ],
      "answer": "Référencer les actions par leur SHA de commit complet : `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` — immuable et vérifiable via `sigstore/cosign`.",
      "explanation": "Supply chain attack (ex: SolarWinds) : un attaquant compromet `actions/checkout` et pousse un tag `v3` malveillant. Si vous utilisez `@v3`, votre pipeline exécute le code malveillant. SHA de commit = immuable (un SHA ne peut pas être réassigné à un commit différent). `@v3` est un tag mutable — l'auteur peut le déplacer. `@v3.1.0` est une release, plus stable, mais toujours mutable. SHA = seule garantie d'immuabilité. Outils : `dependabot.yml` avec `package-ecosystem: github-actions` + `openssf/scorecard-action` pour évaluer la sécurité des actions tierces. En banque : audit de sécurité DORA exige des dépendances vérifiables."
    },
    {
      "question": "[GitHub Actions — Concurrency] Deux développeurs poussent sur `main` à 30 secondes d'intervalle. Que se passe-t-il par défaut et comment gérer la concurrence ?",
      "options": [
        "Le second workflow attend que le premier finisse — GitHub Actions sérialise automatiquement.",
        "Les deux workflows s'exécutent en parallèle — risque de deux déploiements simultanés. Solution : `concurrency: group: deploy-prod cancel-in-progress: true` — annule le premier workflow si un plus récent démarre.",
        "Le second workflow échoue avec une erreur de concurrence.",
        "GitHub Actions détecte le conflit et merge automatiquement les deux pipelines."
      ],
      "answer": "Les deux workflows s'exécutent en parallèle — risque de deux déploiements simultanés. Solution : `concurrency: group: deploy-prod cancel-in-progress: true` — annule le premier workflow si un plus récent démarre.",
      "explanation": "Par défaut, GitHub Actions lance un nouveau workflow à chaque déclencheur — deux workflows peuvent déployer simultanément. `concurrency: group: ${{ github.workflow }}-${{ github.ref }} cancel-in-progress: true` : groupe = identifiant unique (workflow + branche). Si un workflow du même groupe est en cours → il est annulé, le nouveau prend le relais. `cancel-in-progress: false` = le nouveau attend (file d'attente). En FERMAT : deux déploiements simultanés sur prod = états incohérents possibles. Sur les PRs : `cancel-in-progress: true` (annuler l'ancien CI quand un nouveau commit arrive). Sur deploy-prod : `cancel-in-progress: false` (attendre le déploiement en cours avant d'en lancer un nouveau)."
    },
    {
      "question": "[Terraform + GitHub Actions — Infrastructure as Code] Comment automatiser le provisioning Terraform depuis GitHub Actions avec review et approbation ?",
      "options": [
        "Exécuter `terraform apply -auto-approve` directement dans le pipeline sans review.",
        "Sur PR : `terraform plan` et publier le plan en commentaire PR. Sur merge main : job séparé avec `terraform apply` dans l'environnement `infrastructure` (Required Reviewers). State dans S3 + DynamoDB locking.",
        "Utiliser `terraform validate` uniquement en CI — apply toujours manuel depuis un poste local.",
        "GitHub Actions ne supporte pas Terraform — utiliser GitHub CLI avec `gh workflow run`."
      ],
      "answer": "Sur PR : `terraform plan` et publier le plan en commentaire PR. Sur merge main : job séparé avec `terraform apply` dans l'environnement `infrastructure` (Required Reviewers). State dans S3 + DynamoDB locking.",
      "explanation": "GitOps Terraform workflow : (1) Branche feature → `terraform plan` → résultat publié en commentaire PR via `hashicorp/setup-terraform` + `github-script`. Les reviewers voient exactement ce qui va changer avant d'approuver. (2) Merge main → `terraform apply` dans l'environnement GitHub `infrastructure` (avec Required Reviewer). (3) State S3 + DynamoDB locking → pas de race condition. (4) `terraform fmt --check` + `terraform validate` dans le CI pour la qualité. Action : `hashicorp/setup-terraform@v3`. En FERMAT : changement infra K8s = plan reviewé par un architecte avant apply — aucune modification infra sans trace Git."
    },
    {
      "question": "[GitHub Actions — OpenID Connect Azure Federated] Comment configurer l'authentification OIDC entre GitHub Actions et Azure sans Service Principal secret ?",
      "options": [
        "Stocker le `client_secret` du Service Principal dans les secrets GitHub comme `AZURE_CLIENT_SECRET`.",
        "Configurer Federated Credentials sur le Service Principal Azure : sujet = `repo:MyOrg/fermat:ref:refs/heads/main`. Dans le workflow : `azure/login@v2` avec `client-id`, `tenant-id`, `subscription-id` (non secrets) + `permissions: id-token: write`.",
        "Utiliser un Managed Identity Azure — GitHub Actions supporte nativement les Managed Identities.",
        "Générer un token Azure AD via `az ad sp create-for-rbac` et le stocker dans GitHub Secrets."
      ],
      "answer": "Configurer Federated Credentials sur le Service Principal Azure : sujet = `repo:MyOrg/fermat:ref:refs/heads/main`. Dans le workflow : `azure/login@v2` avec `client-id`, `tenant-id`, `subscription-id` (non secrets) + `permissions: id-token: write`.",
      "explanation": "Azure Federated Identity Configuration : (1) Azure Portal → App Registrations → Certificates & secrets → Federated credentials → `Add credential` → GitHub Actions. (2) Sujet : `repo:MyOrg/fermat:ref:refs/heads/main` (uniquement cette branche) ou `repo:MyOrg/fermat:environment:production` (uniquement cet environnement). (3) Dans le workflow : `permissions: id-token: write` (obligatoire pour que GitHub génère le JWT OIDC). (4) `azure/login@v2 client-id: ${{ vars.AZURE_CLIENT_ID }} tenant-id: ${{ vars.AZURE_TENANT_ID }} subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}` — ces 3 valeurs ne sont PAS des secrets (pas sensibles). Résultat : zéro secret à gérer, credentials expirés automatiquement."
    },
    {
      "question": "[GitHub Actions — Composite Action vs Reusable Workflow] L'équipe FERMAT veut factoriser les étapes `dotnet restore + build + test` utilisées dans 5 workflows. Quelle approche choisir ?",
      "options": [
        "Reusable Workflow — c'est la seule façon de partager du YAML dans GitHub Actions.",
        "Composite Action (`.github/actions/dotnet-build/action.yml`) si ce sont des étapes à insérer dans un workflow existant. Reusable Workflow si c'est un workflow complet indépendant. Les deux peuvent coexister.",
        "Copier-coller les étapes dans chaque workflow — la duplication est acceptable dans GitHub Actions.",
        "Composite Action uniquement — les Reusable Workflows ne supportent pas les secrets."
      ],
      "answer": "Composite Action (`.github/actions/dotnet-build/action.yml`) si ce sont des étapes à insérer dans un workflow existant. Reusable Workflow si c'est un workflow complet indépendant. Les deux peuvent coexister.",
      "explanation": "Composite Action : `action.yml` avec `runs: using: composite steps:`. Utilisé comme `uses: ./.github/actions/dotnet-build` dans un step. Parfait pour des groupes d'étapes réutilisables dans différents jobs. Reusable Workflow : workflow complet appelé avec `uses: org/repo/.github/workflows/ci.yml@main` dans un job. Parfait pour des pipelines entiers standardisés. Quand utiliser quoi : dotnet restore + build + test = Composite Action (étapes dans un job). Pipeline CI complet standardisé (build + test + quality + deploy) = Reusable Workflow. Les deux supportent `inputs:` et `secrets:`. En FERMAT : Composite Action `setup-fermat-env` (checkout + dotnet + Oracle client), Reusable Workflow `full-ci-pipeline`."
    },
    {
      "question": "[GitHub Actions — Scheduled Deploy + Rollback Auto] FERMAT a un calcul EOD planifié à 18h00. Si le calcul échoue, comment déclencher automatiquement un rollback vers la version précédente ?",
      "options": [
        "Surveiller les logs manuellement à 18h05 et rollback si problème.",
        "`on: schedule: cron: '0 18 * * 1-5'` déclenche le calcul. En cas d'échec du job, un job `rollback: if: failure() needs: [eod-calc]` exécute `aws ecs update-service` avec le task definition ARN précédent stocké en artifact, et publie une alerte Slack/Teams via `slackapi/slack-github-action`.",
        "GitHub Actions ne supporte pas le rollback automatique — utiliser AWS CodeDeploy séparément.",
        "Ajouter `continue-on-error: true` sur le job EOD pour éviter les échecs."
      ],
      "answer": "`on: schedule: cron: '0 18 * * 1-5'` déclenche le calcul. En cas d'échec du job, un job `rollback: if: failure() needs: [eod-calc]` exécute `aws ecs update-service` avec le task definition ARN précédent stocké en artifact, et publie une alerte Slack/Teams via `slackapi/slack-github-action`.",
      "explanation": "Pattern schedule + rollback automatique : `on: schedule: cron: '0 18 * * 1-5'` = lundi-vendredi à 18h00 UTC. Job `eod-calc` : exécute le calcul. Job `rollback: needs: [eod-calc] if: ${{ failure() }}` : `if: failure()` s'exécute uniquement si `eod-calc` a échoué. Le task definition ARN précédent est sauvegardé comme artifact du dernier deploy réussi : `aws ecs describe-services → previous_task_definition_arn`. Notification : `slackapi/slack-github-action` envoie une alerte au canal #fermat-ops avec le lien vers le workflow. En banque : astreinte déclenchée via PagerDuty si le rollback lui-même échoue — SLA 99.95% oblige."
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

  const handleNextQuestion = () => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) { setCurrentQuestion(q => q + 1); setTimeLeft(25); setMessage(""); }
    else {
      if (level === "moyen") setLevel("avance");
      else if (level === "avance") setLevel("expert");
      else setShowResult(true);
      setCurrentQuestion(0); setTimeLeft(25); setMessage("");
    }
  };

  useEffect(() => {
    if (level !== "basic" && !showResult) {
      if (timeLeft > 0) { const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000); return () => clearTimeout(t); }
      else handleNextQuestion();
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


