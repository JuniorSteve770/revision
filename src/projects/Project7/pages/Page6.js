// src/projects/Project3/pages/Page_DevOps.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    "question": "DevOps — Culture & cycle de vie | Natixis/Finance",
    "answer": "**DevOps** = fusion des équipes Dev (développement) et Ops (opérations) pour livrer plus vite et plus fiablement. ◆ **Cycle de vie** : Plan → Code → Build → Test → Release → Deploy → Operate → Monitor → (retour à Plan). ◆ **Principes clés** : automatisation maximale, feedback rapide, amélioration continue, responsabilité partagée (le dev déploie et monitore). ◆ **En banque** : DevOps est adopté progressivement — les équipes Natixis Risk IT gèrent leur propre pipeline (GitLab CI), leur infrastructure (Kubernetes), leur monitoring (Splunk). ◆ **Mots-clés** : `automatisation`, `Infrastructure as Code`, `observabilité`, `shift-left` (sécurité intégrée tôt), `toil reduction`."
  },
  {
    "question": "Git & GitFlow — Contrôle de version | Natixis/Finance",
    "answer": "**Git** : système de contrôle de version distribué. Chaque développeur a une copie complète du dépôt. ◆ **GitFlow** : modèle de branches standard en banque. `main` (production stable) + `develop` (intégration continue) + `feature/xxx` (nouvelle fonctionnalité) + `release/x.x` (préparation release) + `hotfix/xxx` (correctif urgent prod). ◆ **Commandes clés** : `git clone`, `git checkout -b feature/cvа-engine`, `git commit -m`, `git push`, `git merge`, `git rebase`, `git cherry-pick`. ◆ **Merge Request / Pull Request** : code review obligatoire avant merge sur `develop`. ◆ **En FERMAT** : feature branches pour chaque nouvelle réglementation (SA-CCR, FRTB), hotfix pour les incidents production critiques."
  },
  {
    "question": "Docker — Conteneurisation | DevOps",
    "answer": "**Docker** : empaquète l'application + ses dépendances dans un conteneur portable. 'Ça marche sur ma machine' → 'Ça marche partout'. ◆ **Image** : template immuable (Dockerfile). **Conteneur** : instance en cours d'exécution d'une image. **Registry** : stockage des images (DockerHub, GitLab Registry, Harbor). ◆ **Dockerfile** : `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `USER`, `ENTRYPOINT`. ◆ **docker-compose** : orchestration locale multi-conteneurs (app + Oracle + Redis pour dev). ◆ **En banque** : Harbor (registry privé on-premise), scanning des images (Trivy), politiques de signature des images. ◆ **Mots-clés** : `image`, `container`, `layer`, `volume`, `network`, `multi-stage build`, `slim`."
  },
  {
    "question": "Kubernetes — Orchestration de conteneurs | Natixis/Finance",
    "answer": "**Kubernetes (K8s)** : orchestre les conteneurs Docker en production. Gère déploiement, scaling, disponibilité, load balancing. ◆ **Objets clés** : `Pod` (1+ conteneurs), `Deployment` (gère les replicas), `Service` (exposition réseau), `ConfigMap` (configuration), `Secret` (données sensibles), `Ingress` (routing HTTP), `Namespace` (isolation). ◆ **Commandes** : `kubectl apply -f`, `kubectl get pods`, `kubectl logs`, `kubectl describe`, `kubectl rollout status/undo`. ◆ **En FERMAT** : `Deployment` avec 3 replicas (haute dispo), `HorizontalPodAutoscaler` (scale automatique pendant le calcul de clôture), `CronJob` (calcul EOD à 18h). ◆ **Helm** : package manager K8s — `helm install fermat ./charts/fermat`."
  },
  {
    "question": "Monitoring & Observabilité — Splunk, Kibana, Grafana | Finance",
    "answer": "**Les 3 piliers** : Logs (ce qui s'est passé), Métriques (valeurs numériques dans le temps), Traces (parcours d'une requête). ◆ **Splunk** : agrégation et recherche de logs. Standard en banque. Query : `index=fermat_prod level=ERROR | stats count by service`. Alertes sur patterns d'erreurs. ◆ **Kibana** : visualisation des logs Elasticsearch (ELK Stack). Dashboards temps réel. ◆ **Grafana** : dashboards de métriques (CPU, RAM, latence API, nombre de calculs/s). ◆ **Control-M** : ordonnanceur de jobs bancaire. Planifie et monitore les calculs EOD (End Of Day) — calcul du VaR à 18h, reporting réglementaire à 20h. ◆ **Mots-clés** : `APM`, `tracing`, `alerting`, `SLA 99.95%`, `MTTR`, `p99 latency`."
  },
  {
    "question": "DevSecOps — Sécurité intégrée au pipeline | Natixis/Finance",
    "answer": "**DevSecOps** = Sécurité intégrée à chaque étape du pipeline, pas ajoutée après. 'Shift-left' : détecter les vulnérabilités le plus tôt possible. ◆ **SAST** (Static Application Security Testing) : Checkmarx, SonarQube — analyse le code source. ◆ **DAST** (Dynamic) : OWASP ZAP — teste l'application déployée. ◆ **SCA** (Software Composition Analysis) : OWASP Dependency Check, `pip audit` — vulnérabilités dans les packages tiers. ◆ **Container scanning** : Trivy — vulnérabilités dans les images Docker. ◆ **Secrets scanning** : GitLeaks — détecte les mots de passe hardcodés. ◆ **OWASP Top 10** : SQL Injection, XSS, CSRF, SSRF, hardcoded credentials. ◆ **En banque** : tout incident sécurité = rapport DORA + notification régulateur possible."
  },
  {
    "question": "Infrastructure as Code — Terraform & Ansible | DevOps",
    "answer": "**IaC** : l'infrastructure est définie en code versionné (Git), pas configurée manuellement. ◆ **Terraform** : provisioning cloud/infra (créer VMs, réseaux, buckets S3, clusters K8s). Déclaratif — décrit l'état final souhaité. `terraform plan` (simulation) → `terraform apply` (exécution). Mots-clés : `provider`, `resource`, `state`, `module`. ◆ **Ansible** : configuration des machines (installer packages, configurer services). Procédural — décrit les étapes. Fichiers YAML (playbooks). Agentless (SSH). Mots-clés : `playbook`, `role`, `inventory`, `task`, `handler`. ◆ **En banque** : Terraform pour provisionner les clusters K8s, Ansible pour configurer les nœuds Oracle/Linux. Tout changement infra = MR GitLab + peer review."
  },
  {
    "question": "Environnements Dev/Recette/Staging/Prod | Natixis/Finance",
    "answer": "**Dev** : environnement local du développeur. Docker Compose avec Oracle en mémoire. Pas de données réelles. ◆ **Recette (SIT)** : System Integration Testing. Données anonymisées ou synthétiques. Deploy automatique depuis `develop`. Tests fonctionnels par l'équipe QA. ◆ **Staging (UAT)** : User Acceptance Testing. Copie de la production. Données quasi-réelles. Validation par les métiers (Risk Managers, Front Office). ◆ **Production** : données réelles, SLA 99.95%, deploy `when: manual` uniquement. Monitoring 24/7 via Splunk. ◆ **En FERMAT** : calcul des expositions sur données réelles de contreparties = criticité maximale. Un bug en prod = potentiellement un dépassement de limite non détecté = risque réglementaire. ◆ **Principe** : aucune modification directe en prod (no manual SSH), tout passe par le pipeline."
  }
];

const questions = {
  moyen: [
    {
      "question": "[GitFlow] Dans FERMAT, un bug critique est détecté en production un vendredi soir. Quelle branche Git doit être créée et quel est le workflow ?",
      "options": [
        "Créer une branche `feature/fix-bug` depuis `develop` et merger sur `main` après tests.",
        "Créer une branche `hotfix/limit-breach-fix` depuis `main`, corriger, merger sur `main` ET `develop`, tagger la release.",
        "Corriger directement sur la branche `main` avec un commit d'urgence.",
        "Créer une branche `release/emergency` depuis `develop`."
      ],
      "answer": "Créer une branche `hotfix/limit-breach-fix` depuis `main`, corriger, merger sur `main` ET `develop`, tagger la release.",
      "explanation": "GitFlow hotfix : `main` représente la production stable. Le hotfix part de `main` (pas de `develop` qui peut contenir du code non testé). Après correction : merge sur `main` (→ déploiement prod) ET sur `develop` (→ la correction est intégrée dans le développement courant). Tag `v1.2.1` pour tracer la release. Sans merger sur `develop`, la correction serait perdue au prochain déploiement depuis `develop`. En banque : tout hotfix = Change Request d'urgence + approbation Risk Manager + post-mortem obligatoire."
    },
    {
      "question": "[Kubernetes — Pods] Dans FERMAT, un pod Kubernetes est en état `CrashLoopBackOff`. Quelle est la première action de diagnostic ?",
      "options": [
        "`kubectl delete pod fermat-pod` pour forcer la recréation.",
        "`kubectl logs fermat-pod --previous` pour lire les logs du pod précédent avant le crash, et `kubectl describe pod fermat-pod` pour voir les events.",
        "`kubectl restart deployment fermat` pour redémarrer tous les pods.",
        "Redémarrer le nœud Kubernetes hébergeant le pod."
      ],
      "answer": "`kubectl logs fermat-pod --previous` pour lire les logs du pod précédent avant le crash, et `kubectl describe pod fermat-pod` pour voir les events.",
      "explanation": "`CrashLoopBackOff` = le conteneur démarre, crashe, est redémarré, crashe encore. `kubectl logs --previous` récupère les logs du conteneur qui vient de crasher (avant redémarrage). `kubectl describe pod` affiche les events Kubernetes (OOMKilled = mémoire insuffisante, Liveness probe failed = health check échoué, Image pull error = image introuvable). Causes communes FERMAT : connexion Oracle impossible au démarrage, mémoire insuffisante pour charger les données de référence, variable d'environnement manquante."
    },
    {
      "question": "[Splunk — Monitoring] Un opérateur Natixis reçoit une alerte Splunk 'ERROR rate > 5% sur fermat-exposure-service'. Quelle requête Splunk permet d'identifier les erreurs ?",
      "options": [
        "`SELECT * FROM fermat_logs WHERE level = 'ERROR'`",
        "`index=fermat_prod service=exposure-service level=ERROR | stats count by error_message | sort -count`",
        "`grep ERROR /var/log/fermat.log | tail -100`",
        "`kubectl logs deployment/fermat-exposure | grep ERROR`"
      ],
      "answer": "`index=fermat_prod service=exposure-service level=ERROR | stats count by error_message | sort -count`",
      "explanation": "Splunk query language (SPL) : `index=` sélectionne la source de logs. `level=ERROR` filtre. `| stats count by error_message` agrège et compte par message d'erreur. `| sort -count` trie du plus fréquent au moins fréquent. Résultat : tableau des erreurs les plus fréquentes → identification rapide du problème dominant. En FERMAT : souvent `OracleException: Connection pool exhausted` (trop de connexions) ou `NullReferenceException: Counterparty not found` (données manquantes). Splunk est à Natixis ce que Google est au web."
    },
    {
      "question": "[Docker — Registry] Dans un pipeline GitLab CI bancaire, comment une image Docker est-elle versionnée et stockée ?",
      "options": [
        "L'image est recompilée à chaque déploiement à partir du Dockerfile.",
        "`docker build -t registry.natixis.com/fermat:$CI_COMMIT_SHA .` puis `docker push` — l'image est taguée avec le SHA du commit et stockée dans le registry Harbor interne.",
        "L'image est stockée directement dans GitLab sous forme de fichier `.tar`.",
        "Docker Hub public est utilisé car les images C# sont open source."
      ],
      "answer": "`docker build -t registry.natixis.com/fermat:$CI_COMMIT_SHA .` puis `docker push` — l'image est taguée avec le SHA du commit et stockée dans le registry Harbor interne.",
      "explanation": "Versionning d'images Docker : le tag `$CI_COMMIT_SHA` (hash Git du commit) garantit l'immutabilité et la traçabilité — chaque image correspond exactement à un commit. Harbor (CNCF) = registry Docker on-premise utilisé en banque (jamais Docker Hub pour les images applicatives). `kubectl set image deployment/fermat app=registry.natixis.com/fermat:abc123` déploie exactement cette version. Rollback = `kubectl set image` avec le SHA précédent. En banque : `latest` est interdit en production — toujours un tag précis."
    },
    {
      "question": "[GitLab CI — Environments] Pourquoi définir `environment: production` dans un job deploy GitLab CI ?",
      "options": [
        "Pour que GitLab autorise le deploy uniquement pendant les heures ouvrables.",
        "Pour activer le suivi des déploiements dans GitLab (historique, rollback UI), les variables d'environnement spécifiques à la production, et les protections de branche.",
        "Pour que le job utilise automatiquement les runners de production.",
        "`environment:` est obligatoire sinon le pipeline échoue."
      ],
      "answer": "Pour activer le suivi des déploiements dans GitLab (historique, rollback UI), les variables d'environnement spécifiques à la production, et les protections de branche.",
      "explanation": "`environment: name: production url: https://fermat.natixis.com` active : (1) L'onglet Deployments dans GitLab avec l'historique de tous les déploiements prod. (2) Les variables CI/CD scoped à l'environnement `production` (chaîne Oracle prod différente de recette). (3) Les règles de protection : seuls les mainteneurs peuvent déclencher le deploy prod. (4) Le bouton 'Rollback' dans l'interface GitLab qui re-déclenche le pipeline du commit précédent. En FERMAT : chaque déploiement prod est tracé avec qui l'a approuvé — audit DORA."
    },
    {
      "question": "[Terraform] Un ingénieur DevOps doit provisionner un cluster Kubernetes pour FERMAT. Quelle est la bonne approche IaC ?",
      "options": [
        "Créer le cluster manuellement dans l'interface cloud et documenter les étapes dans un wiki.",
        "Écrire un module Terraform `k8s_cluster` versionné dans Git, `terraform plan` pour simuler, peer review du plan, `terraform apply` — l'infrastructure est reproductible et auditée.",
        "Utiliser un script bash `create_cluster.sh` exécuté manuellement sur le serveur.",
        "Copier la configuration d'un cluster existant avec `kubectl get all -o yaml`."
      ],
      "answer": "Écrire un module Terraform `k8s_cluster` versionné dans Git, `terraform plan` pour simuler, peer review du plan, `terraform apply` — l'infrastructure est reproductible et auditée.",
      "explanation": "IaC avec Terraform : le code Terraform est dans Git → toute modification infra passe par un Merge Request + peer review (comme le code applicatif). `terraform plan` affiche exactement ce qui va être créé/modifié/détruit → aucune surprise. `terraform apply` exécute. `terraform state` trace l'état réel. En banque : un audit DORA peut demander 'qui a modifié l'infrastructure le 15 mars ?' → `git log` répond. Infrastructure manuelle = non auditable = non conforme. Terraform Cloud/Enterprise gère les state files de façon centralisée."
    },
    {
      "question": "[Kubernetes — ConfigMap vs Secret] Dans FERMAT, comment stocker la chaîne de connexion Oracle et les paramètres de configuration applicatif ?",
      "options": [
        "Les deux dans `ConfigMap` — Kubernetes chiffre automatiquement les données sensibles.",
        "Paramètres non sensibles (URL API, timeouts) dans `ConfigMap`. Chaîne Oracle, mots de passe dans `Secret` (base64, idéalement chiffré avec Vault ou Sealed Secrets).",
        "Tout dans des variables d'environnement hardcodées dans le Dockerfile.",
        "Tout dans `Secret` — ConfigMap ne supporte pas les valeurs string."
      ],
      "answer": "Paramètres non sensibles (URL API, timeouts) dans `ConfigMap`. Chaîne Oracle, mots de passe dans `Secret` (base64, idéalement chiffré avec Vault ou Sealed Secrets).",
      "explanation": "ConfigMap vs Secret : ConfigMap = configuration non sensible (URLs, feature flags, timeouts) — lisible en clair dans `kubectl describe configmap`. Secret = données sensibles — stocké en base64 (attention : base64 ≠ chiffrement). Pour une vraie sécurité : HashiCorp Vault (stockage secrets chiffré, rotation automatique) ou Sealed Secrets (chiffre les secrets dans Git). En banque : la chaîne Oracle de production avec credentials ne doit JAMAIS être visible dans les logs ou dans `kubectl describe secret` — Vault obligatoire pour les environnements prod."
    },
    {
      "question": "[Monitoring — SLA] FERMAT a un SLA de 99.95% de disponibilité. Combien de minutes d'indisponibilité sont autorisées par mois ?",
      "options": [
        "Environ 4h30 par mois.",
        "Environ 21 minutes par mois.",
        "Environ 2h par mois.",
        "Aucune indisponibilité — 99.95% signifie disponibilité totale."
      ],
      "answer": "Environ 21 minutes par mois.",
      "explanation": "Calcul SLA : 99.95% = 0.05% d'indisponibilité autorisée. Mois = 30 jours × 24h × 60min = 43 200 minutes. 0.05% × 43 200 = 21.6 minutes. Contexte FERMAT : 21 minutes/mois = budget d'erreur. Si un déploiement raté cause 30 minutes d'indisponibilité = SLA dépassé = rapport incident + pénalités contractuelles + notification Risk Manager. D'où l'importance du Blue/Green deploy (zéro downtime) et des health checks Kubernetes. MTTR (Mean Time To Recovery) doit être < 10 minutes pour tenir le SLA 99.95%."
    },
    {
      "question": "[DevSecOps — Secrets Scanning] GitLeaks détecte dans un commit : `OraclePassword = \"Natixis2024!\";`. Quelle est la procédure correcte ?",
      "options": [
        "Supprimer la ligne dans le prochain commit — le mot de passe n'est plus dans HEAD.",
        "Révoquer immédiatement le mot de passe Oracle, réécrire l'historique Git avec `git filter-repo` pour supprimer le secret de TOUS les commits, puis stocker le secret dans Vault/Secret CI.",
        "Marquer le commit comme privé dans GitLab — les autres développeurs ne le verront plus.",
        "Changer le mot de passe Oracle dans 30 jours lors de la prochaine rotation planifiée."
      ],
      "answer": "Révoquer immédiatement le mot de passe Oracle, réécrire l'historique Git avec `git filter-repo` pour supprimer le secret de TOUS les commits, puis stocker le secret dans Vault/Secret CI.",
      "explanation": "Secret dans Git = compromis même après suppression : le commit reste dans l'historique, accessible par `git log --all`. Procédure : (1) Révoquer IMMÉDIATEMENT le mot de passe Oracle — le secret est considéré compromis dès le push. (2) `git filter-repo --path-glob '*.cs' --replace-text <(echo 'Natixis2024!==>***REMOVED***')` — réécrit l'historique. (3) Force push sur toutes les branches. (4) Stocker le nouveau mot de passe dans Vault ou GitLab CI Variables. En banque : incident de sécurité à déclarer selon DORA si le repo était accessible à des personnes non autorisées."
    },
    {
      "question": "[Control-M — Jobs bancaires] Dans FERMAT, le calcul EOD (End of Day) est planifié avec Control-M à 18h00. Que se passe-t-il si le job échoue ?",
      "options": [
        "Control-M ignore l'erreur et planifie le prochain job à 18h00 le lendemain.",
        "Control-M envoie une alerte (email, SMS on-call) avec les logs d'erreur, marque le job en échec, et bloque les jobs dépendants (reporting réglementaire, fichiers regulatory).",
        "Control-M relance automatiquement le job 3 fois avant d'alerter.",
        "L'équipe découvre l'erreur le lendemain matin lors de la revue manuelle."
      ],
      "answer": "Control-M envoie une alerte (email, SMS on-call) avec les logs d'erreur, marque le job en échec, et bloque les jobs dépendants (reporting réglementaire, fichiers regulatory).",
      "explanation": "Control-M gère les dépendances entre jobs : `EOD_EXPOSURE_CALC` → `EOD_LIMIT_CHECK` → `EOD_REGULATORY_REPORT` → `EOD_FILE_DELIVERY`. Si `EOD_EXPOSURE_CALC` échoue, tous les jobs downstream sont bloqués — le rapport réglementaire ne part pas. Alerte immédiate on-call (astreinte). SLA : le rapport réglementaire doit partir avant 22h (obligation contractuelle envers l'AMF/BCE). MTTR = temps entre l'alerte et la résolution. En banque : un fichier réglementaire manqué = notification formelle au régulateur le lendemain."
    },
    {
      "question": "[Git — Rebase vs Merge] Dans le workflow FERMAT, quelle est la différence entre `git merge` et `git rebase` pour intégrer une feature branch dans `develop` ?",
      "options": [
        "Ce sont des synonymes — le résultat final est identique.",
        "`git merge` crée un commit de merge et conserve l'historique des branches. `git rebase` rejoue les commits de la feature sur develop — historique linéaire, plus lisible, mais réécrit les SHAs (ne jamais rebase des branches partagées).",
        "`git rebase` est plus sécurisé car il teste les conflits avant merge.",
        "`git merge` est pour les features, `git rebase` est pour les hotfixes."
      ],
      "answer": "`git merge` crée un commit de merge et conserve l'historique des branches. `git rebase` rejoue les commits de la feature sur develop — historique linéaire, plus lisible, mais réécrit les SHAs (ne jamais rebase des branches partagées).",
      "explanation": "Merge vs Rebase en pratique FERMAT : `git merge` = conserve l'historique exact (qui a commencé quoi, quand) — recommandé pour les merge vers `main` et `develop` (traçabilité). `git rebase` = historique propre et linéaire (git log lisible) — recommandé en local avant de pousser une feature branch. Règle d'or : ne jamais `rebase` une branche que d'autres développeurs utilisent (réécriture des SHAs = conflits pour tous). En banque : le squash-merge (un seul commit propre par feature) est souvent la pratique recommandée pour `develop`."
    },
    {
      "question": "[Kubernetes — HPA] Le moteur de calcul FERMAT est surchargé à 18h lors du calcul EOD. Quelle solution Kubernetes permet de scaler automatiquement ?",
      "options": [
        "Augmenter manuellement le nombre de replicas dans le Deployment YAML avant 18h.",
        "HorizontalPodAutoscaler (HPA) : `kubectl autoscale deployment fermat-engine --cpu-percent=70 --min=2 --max=10` — Kubernetes ajoute des pods automatiquement si le CPU dépasse 70%.",
        "VirtualPodAutoscaler (VPA) augmente la mémoire RAM du pod existant.",
        "CronJob qui crée des pods supplémentaires à 17h55 et les supprime à 19h00."
      ],
      "answer": "HorizontalPodAutoscaler (HPA) : `kubectl autoscale deployment fermat-engine --cpu-percent=70 --min=2 --max=10` — Kubernetes ajoute des pods automatiquement si le CPU dépasse 70%.",
      "explanation": "HPA (Horizontal Pod Autoscaler) : monitore les métriques (CPU, mémoire, métriques custom) et ajuste le nombre de replicas. `--min=2` : toujours 2 pods minimum (haute disponibilité). `--max=10` : plafond pour éviter les coûts excessifs. `--cpu-percent=70` : scale up si CPU > 70%. Pendant le calcul EOD FERMAT (calcul des expositions de toutes les contreparties) : CPU monte à 90% → HPA passe de 2 à 8 pods → calcul parallélisé → EOD terminé à temps → HPA descend à 2 pods. VPA = augmente les ressources d'un pod existant (vertical). CronJob = approche valide mais moins réactive que HPA."
    }
  ],
  avance: [
    {
      "question": "[GitOps — ArgoCD] Quelle est la différence entre le modèle push (pipeline CI/CD classique) et le modèle pull (GitOps avec ArgoCD) pour les déploiements Kubernetes FERMAT ?",
      "options": [
        "Push = plus sécurisé car le pipeline contrôle le cluster. Pull = moins fiable.",
        "Push : le pipeline CI/CD applique directement les manifests Kubernetes (`kubectl apply`). Pull (GitOps/ArgoCD) : un agent dans le cluster surveille le dépôt Git et synchronise automatiquement l'état du cluster avec l'état décrit dans Git — le cluster 'pull' sa configuration.",
        "Push et Pull donnent le même résultat — c'est une question de préférence.",
        "Pull est utilisé pour la recette, Push est utilisé pour la production."
      ],
      "answer": "Push : le pipeline CI/CD applique directement les manifests Kubernetes (`kubectl apply`). Pull (GitOps/ArgoCD) : un agent dans le cluster surveille le dépôt Git et synchronise automatiquement l'état du cluster avec l'état décrit dans Git — le cluster 'pull' sa configuration.",
      "explanation": "GitOps avec ArgoCD : l'agent ArgoCD tourne dans le cluster et surveille un dépôt Git (infra-repo). Dès qu'un commit change un manifest Kubernetes, ArgoCD détecte la divergence et synchronise. Avantages : (1) le cluster peut se reconfigurer seul après une panne. (2) Aucun credential kubectl n'est nécessaire dans le pipeline. (3) Drift detection : si quelqu'un modifie manuellement le cluster, ArgoCD le détecte et peut revenir à l'état Git. En banque FERMAT : ArgoCD gère les déploiements des microservices Risk. Le pipeline CI crée l'image Docker, met à jour le manifest Git, ArgoCD synchronise."
    },
    {
      "question": "[Kubernetes — Probes] Un pod FERMAT démarre mais ne répond pas aux requêtes pendant 30 secondes (chargement des données Oracle). Comment éviter que Kubernetes ne le tue pendant ce démarrage ?",
      "options": [
        "Augmenter `terminationGracePeriodSeconds` à 120 secondes.",
        "Configurer `startupProbe` avec `failureThreshold: 30` et `periodSeconds: 5` — Kubernetes attend jusqu'à 150 secondes avant de considérer le démarrage échoué, sans interférer avec `livenessProbe`.",
        "Désactiver la `livenessProbe` en production pour éviter les redémarrages.",
        "Utiliser `initialDelaySeconds: 120` sur la `livenessProbe`."
      ],
      "answer": "Configurer `startupProbe` avec `failureThreshold: 30` et `periodSeconds: 5` — Kubernetes attend jusqu'à 150 secondes avant de considérer le démarrage échoué, sans interférer avec `livenessProbe`.",
      "explanation": "3 types de probes Kubernetes : `startupProbe` = pendant le démarrage (désactive liveness/readiness pendant ce temps). `livenessProbe` = l'application est-elle en vie ? (redémarre si non). `readinessProbe` = l'application est-elle prête à recevoir du trafic ? (retire du load balancer si non). FERMAT : chargement Oracle au démarrage = 45 secondes. `startupProbe: failureThreshold: 30, periodSeconds: 5` = 150s de délai total. Une fois le startup probe passé, liveness et readiness prennent le relais. `initialDelaySeconds: 120` sur liveness = risque de tuer un pod lent mais valide après le démarrage."
    },
    {
      "question": "[Observabilité — Distributed Tracing] Dans une architecture microservices FERMAT (ExposureEngine → LimitChecker → NotificationService), comment tracer une requête de bout en bout pour diagnostiquer une latence ?",
      "options": [
        "Ajouter des `Console.WriteLine` dans chaque service avec le timestamp.",
        "Implémenter le distributed tracing avec OpenTelemetry : chaque service propage un `TraceId` dans les headers HTTP, les spans sont collectés dans Jaeger/Zipkin/Grafana Tempo — latence par service visible en cascade.",
        "Corréler les logs Splunk de chaque service par timestamp approximatif.",
        "Utiliser `kubectl logs` sur chaque pod séquentiellement."
      ],
      "answer": "Implémenter le distributed tracing avec OpenTelemetry : chaque service propage un `TraceId` dans les headers HTTP, les spans sont collectés dans Jaeger/Zipkin/Grafana Tempo — latence par service visible en cascade.",
      "explanation": "Distributed tracing : une requête /computeExposure déclenche des appels en cascade. Sans tracing : impossible de savoir si la latence de 3 secondes vient d'ExposureEngine (calcul), LimitChecker (règle métier), ou NotificationService (envoi email). Avec OpenTelemetry : un `TraceId` unique est propagé dans tous les headers. Chaque service crée un `Span` (début/fin + métadonnées). Jaeger affiche le 'waterfall' : ExposureEngine 200ms → LimitChecker 2700ms → NotificationService 100ms. LimitChecker est le coupable. En .NET : `OpenTelemetry.Extensions.Hosting` + `AddOtlpExporter()`."
    },
    {
      "question": "[IaC — Terraform State] Deux ingénieurs DevOps Natixis exécutent `terraform apply` en même temps sur le cluster FERMAT. Que se passe-t-il et comment l'éviter ?",
      "options": [
        "Terraform détecte le conflit automatiquement et attend que le premier apply termine.",
        "Race condition : les deux lisent le même state, appliquent des changements partiels, le state final est corrompu. Solution : state backend distant avec locking (S3 + DynamoDB, Terraform Cloud) — un seul apply à la fois.",
        "Le second `terraform apply` échoue automatiquement avec une erreur 'cluster already exists'.",
        "Terraform merge les deux plans automatiquement."
      ],
      "answer": "Race condition : les deux lisent le même state, appliquent des changements partiels, le state final est corrompu. Solution : state backend distant avec locking (S3 + DynamoDB, Terraform Cloud) — un seul apply à la fois.",
      "explanation": "Terraform state = source de vérité de l'infrastructure. State local (terraform.tfstate) : catastrophe si deux ingénieurs appliquent en même temps — divergence entre état réel et état déclaré. Solution : remote state avec locking. S3 backend + DynamoDB locking : le premier `terraform apply` acquiert un lock DynamoDB. Le second voit le lock et attend (ou échoue avec message explicite). Terraform Cloud/Enterprise gère ça nativement. En banque FERMAT : le state Terraform est dans un bucket S3 interne avec locking DynamoDB — appliquer depuis le pipeline GitLab CI uniquement (jamais depuis un poste local)."
    },
    {
      "question": "[Kubernetes — Network Policies] Dans un cluster FERMAT multi-tenant (ExposureEngine, TradeService, ComplianceService dans des namespaces séparés), comment isoler le réseau ?",
      "options": [
        "Les namespaces Kubernetes isolent automatiquement le réseau — aucune configuration nécessaire.",
        "Définir des `NetworkPolicy` : `ingress: from: namespaceSelector: matchLabels: name: exposure-engine` — seul ExposureEngine peut appeler LimitChecker. Aucun autre service ne peut accéder au namespace compliance.",
        "Utiliser des VLANs réseau distincts pour chaque namespace.",
        "Configurer des `SecurityContext` par pod pour restreindre les connexions sortantes."
      ],
      "answer": "Définir des `NetworkPolicy` : `ingress: from: namespaceSelector: matchLabels: name: exposure-engine` — seul ExposureEngine peut appeler LimitChecker. Aucun autre service ne peut accéder au namespace compliance.",
      "explanation": "Par défaut, tous les pods d'un cluster K8s peuvent communiquer entre eux (flat network). NetworkPolicy = firewall L3/L4 natif Kubernetes. En banque multi-tenant FERMAT : ComplianceService ne doit être accessible que par ExposureEngine — NetworkPolicy `ingress: from: podSelector + namespaceSelector`. TradeService n'a pas accès à ComplianceService. Isolation stricte par namespace. Implémenté par le CNI (Calico, Cilium). `deny-all` par défaut + whitelist explicite = politique Zero Trust. En banque : obligation réglementaire de ségrégation des données entre desks."
    },
    {
      "question": "[Chaos Engineering] L'équipe SRE de Natixis veut tester la résilience de FERMAT avant la mise en prod. Quelle approche DevOps utiliser ?",
      "options": [
        "Simuler la panne manuellement en stoppant les services un par un en recette.",
        "Chaos Engineering avec des outils comme Chaos Monkey ou LitmusChaos : injecter des pannes contrôlées (kill pod, latence réseau +500ms, saturation CPU) en staging pour vérifier que les circuit breakers, retries et alertes fonctionnent correctement.",
        "Lire les runbooks d'incident et simuler les réponses en réunion (Gameday théorique).",
        "Attendre un incident de production pour identifier les failles de résilience."
      ],
      "answer": "Chaos Engineering avec des outils comme Chaos Monkey ou LitmusChaos : injecter des pannes contrôlées (kill pod, latence réseau +500ms, saturation CPU) en staging pour vérifier que les circuit breakers, retries et alertes fonctionnent correctement.",
      "explanation": "Chaos Engineering (principe Netflix) : tester la résilience en production-like avant que la prod ne le fasse. LitmusChaos pour K8s : `PodDelete` (tue un pod aléatoirement), `NetworkChaos` (ajoute de la latence), `CPUStress`. FERMAT critique : que se passe-t-il si Oracle est indisponible 2 minutes pendant le calcul EOD ? Le circuit breaker Polly retourne-t-il des données en cache ? L'alerte Splunk part-elle ? Les retry policies fonctionnent-elles ? En banque : Chaos Engineering en staging obligatoire avant chaque release majeure. GameDay = exercice structuré où l'équipe réagit à des scénarios de panne simulés."
    },
    {
      "question": "[Service Mesh — Istio] Dans FERMAT, comment implémenter un canary deployment (10% du trafic vers la nouvelle version) sans modifier le code applicatif ?",
      "options": [
        "Modifier le load balancer Nginx pour router 10% vers les nouveaux pods.",
        "Utiliser Istio VirtualService : `weight: 90` vers `fermat-v1`, `weight: 10` vers `fermat-v2` — le service mesh contrôle la répartition du trafic au niveau réseau, transparent pour l'application.",
        "Créer un feature flag dans le code C# qui active la nouvelle version pour 10% des utilisateurs.",
        "Utiliser `kubectl scale deployment fermat-v2 --replicas=1` avec 9 replicas v1 — la répartition est automatiquement 10/90."
      ],
      "answer": "Utiliser Istio VirtualService : `weight: 90` vers `fermat-v1`, `weight: 10` vers `fermat-v2` — le service mesh contrôle la répartition du trafic au niveau réseau, transparent pour l'application.",
      "explanation": "Canary deployment avec Istio : `VirtualService` définit les règles de routage. `DestinationRule` définit les subsets (v1, v2). `weight: 10` = 10% du trafic réel va vers fermat-v2. Monitoring Grafana : si les métriques de v2 (error rate, latence p99) sont équivalentes à v1 → augmenter progressivement 10% → 30% → 50% → 100%. Si anomalie → `weight: 0` sur v2 = rollback instantané. Avantage vs Blue/Green : exposition progressive du risque. En banque FERMAT : canary sur 10% des contreparties → si les calculs d'exposition v2 sont corrects → déploiement complet. `kubectl scale` donne une approximation probabiliste, pas un vrai contrôle du traffic."
    },
    {
      "question": "[DevOps — DORA Metrics] L'équipe FERMAT mesure ses performances DevOps avec les 4 métriques DORA. Quelles sont-elles et que mesurent-elles ?",
      "options": [
        "CPU usage, Memory usage, Disk I/O, Network throughput.",
        "Deployment Frequency (fréquence des déploiements), Lead Time for Changes (délai commit → prod), Change Failure Rate (% déploiements causant un incident), MTTR (temps moyen de restauration après incident).",
        "Code coverage, Bug count, Technical debt, Velocity.",
        "SLA uptime, MTBF, RTO, RPO."
      ],
      "answer": "Deployment Frequency (fréquence des déploiements), Lead Time for Changes (délai commit → prod), Change Failure Rate (% déploiements causant un incident), MTTR (temps moyen de restauration après incident).",
      "explanation": "DORA (DevOps Research and Assessment) 4 métriques : (1) Deployment Frequency : Elite = plusieurs/jour. Low = moins d'un mois. (2) Lead Time : Elite = < 1 heure. Low = 1-6 mois. (3) Change Failure Rate : Elite = 0-15%. Low = 46-60%. (4) MTTR : Elite = < 1 heure. Low = 1 semaine-1 mois. Objectif FERMAT : augmenter Deployment Frequency (CI/CD mature), réduire Lead Time (pipeline rapide), maintenir Change Failure Rate bas (tests suffisants), MTTR < 30min (SLA 99.95%). En banque : DORA metrics = KPIs du département IT présentés au COMEX."
    }
  ],
  expert: [
    {
      "question": "[Kubernetes — PodDisruptionBudget] Lors d'une mise à jour Kubernetes d'un nœud, comment garantir qu'au moins 2 pods FERMAT restent disponibles sur les 3 existants ?",
      "options": [
        "`kubectl cordon node01` empêche automatiquement l'arrêt des pods critiques.",
        "Créer un `PodDisruptionBudget` : `minAvailable: 2` — Kubernetes ne peut pas drainer un nœud si cela ferait tomber le nombre de pods sous 2.",
        "Configurer `replicas: 5` pour avoir une marge de sécurité.",
        "Utiliser `kubectl drain --force` uniquement pendant les fenêtres de maintenance planifiées."
      ],
      "answer": "Créer un `PodDisruptionBudget` : `minAvailable: 2` — Kubernetes ne peut pas drainer un nœud si cela ferait tomber le nombre de pods sous 2.",
      "explanation": "PodDisruptionBudget (PDB) : protège les applications pendant les maintenances volontaires (mise à jour nœud, drain). `minAvailable: 2` = pendant tout `kubectl drain`, K8s garantit qu'au moins 2 pods FERMAT sont disponibles. Si drain rendrait 1 seul pod dispo → K8s bloque le drain et attend que les pods se recréent ailleurs. `maxUnavailable: 1` = autre formulation équivalente (1 pod peut être indisponible à la fois). En banque FERMAT avec SLA 99.95% : PDB obligatoire pour tous les services critiques. Sans PDB : une mise à jour nœud peut tuer tous les pods d'un coup si mal distribués."
    },
    {
      "question": "[DevOps — Post-mortem] Suite à un incident production sur FERMAT (calcul d'exposition incorrect pendant 2h), quelle approche DevOps adopter ?",
      "options": [
        "Identifier le développeur responsable et l'inscrire à une formation.",
        "Post-mortem blameless : timeline précise de l'incident, root cause analysis (5 Why), actions correctives (tests manquants, monitoring insuffisant, déploiement sans validation), partage avec toute l'équipe — amélioration systémique, pas de recherche de coupable.",
        "Ajouter un approval process manuel sur tous les futurs déploiements pour éviter les erreurs.",
        "Documenter l'incident dans le wiki et passer à la feature suivante."
      ],
      "answer": "Post-mortem blameless : timeline précise de l'incident, root cause analysis (5 Why), actions correctives (tests manquants, monitoring insuffisant, déploiement sans validation), partage avec toute l'équipe — amélioration systémique, pas de recherche de coupable.",
      "explanation": "Post-mortem blameless (Google SRE) : l'objectif est d'améliorer le système, pas de punir. Structure : (1) Résumé de l'incident. (2) Timeline factuelle (heure d'occurrence, détection, résolution). (3) Root Cause Analysis (5 Why : pourquoi → pourquoi → pourquoi...). (4) Actions : fix immédiat + actions long terme (ajouter tests, améliorer alerting, revoir le pipeline). (5) Partage avec toute l'équipe (learning). En banque FERMAT : incident de calcul d'exposition = notification Risk Manager + rapport DORA potentiel + revue par le Risk Officer. Le post-mortem est archivé et peut être demandé par l'auditeur."
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

const Page_DevOps = () => {
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

export default Page_DevOps;

