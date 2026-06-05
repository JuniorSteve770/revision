
// src/projects/aws/Page_Deploy.js
import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
 
const basicSlides = [
  {
    question: "Vue d'ensemble — Conception locale → Déploiement AWS → Monitoring",
    answer:
      "◆ **Bloc 1** : Environnement local — structure projet, venv Python, .env, Git, tests ◆ **Bloc 2** : Déploiement code simple (Flask/Node) — SCP, SSH, PM2, Nginx reverse proxy ◆ **Bloc 3** : Conception locale d'un modèle ML — entraînement, sérialisation, API FastAPI ◆ **Bloc 4** : Déploiement modèle ML sur EC2 GPU — boto3, S3 artefacts, uvicorn ◆ **Bloc 5** : Logs applicatifs — niveaux, formats, rotation ◆ **Bloc 6** : Monitoring EC2 — CloudWatch, alertes, dashboards, métriques système ◆ **Bloc 7** : Debugging en production — lire les logs, diagnostiquer, corriger",
  },
  {
    question: "Bloc 1 — Environnement local : structure et bonnes pratiques",
    answer:
      "◆ **Structure projet Python** : `src/`, `tests/`, `requirements.txt`, `.env`, `.gitignore`, `README.md` ◆ **Virtualenv** : `python -m venv venv` → `source venv/bin/activate` (Mac/Linux) ou `venv\\Scripts\\activate` (Windows) ◆ **Variables d'environnement** : stocker DB_URL, API_KEY, SECRET dans `.env` — jamais dans le code ◆ **Git** : `git init` → `.gitignore` inclut `venv/`, `.env`, `__pycache__/`, `*.pkl` ◆ **Tests locaux** : `pytest tests/` avant tout push ⚠️ Un `.env` commité dans git = fuite de credentials — vérifier `.gitignore` avant le premier push",
  },
  {
    question: "Bloc 2 — Déploiement code simple sur EC2 (Flask/Node)",
    answer:
      "◆ **Étape 1 — Préparer** : `pip freeze > requirements.txt` ou `npm ci` ◆ **Étape 2 — Transférer** : `scp -i cle.pem -r ./app ec2-user@IP:/home/ec2-user/app` ◆ **Étape 3 — Installer** : SSH → `pip install -r requirements.txt` ou `npm install --production` ◆ **Étape 4 — Lancer** : PM2 pour Node (`pm2 start app.js`) ou `gunicorn -w 4 app:app` pour Flask ◆ **Étape 5 — Nginx reverse proxy** : écoute port 80 → forward vers 5000/3000 ◆ **Étape 6 — Elastic IP** : fixer l'IP pour ne pas la perdre au redémarrage ⚠️ `gunicorn` est requis en production — le serveur Flask intégré n'est PAS fait pour la prod",
  },
  {
    question: "Nginx — Configuration reverse proxy",
    answer:
      "◆ **Rôle** : Nginx écoute sur le port 80/443, redirige vers l'app sur un port interne (5000, 8000, 3000) ◆ **Config** : `/etc/nginx/sites-available/monapp` → `location / { proxy_pass http://127.0.0.1:5000; }` ◆ **Activer** : `sudo ln -s /etc/nginx/sites-available/monapp /etc/nginx/sites-enabled/` ◆ **Tester** : `sudo nginx -t` — valide la syntaxe avant reload ◆ **Recharger** : `sudo systemctl reload nginx` ◆ **SSL/HTTPS** : Let's Encrypt via `certbot --nginx -d mondomaine.com` ⚠️ Sans `nginx -t` avant reload, une erreur de syntaxe coupe le serveur web entièrement",
  },
  {
    question: "Bloc 3 — Conception locale d'un modèle ML",
    answer:
      "◆ **Structure projet ML** : `data/`, `notebooks/`, `src/train.py`, `src/predict.py`, `models/`, `api/` ◆ **Entraînement** : `sklearn` / `PyTorch` / `TensorFlow` → `model.fit(X_train, y_train)` ◆ **Évaluation** : `accuracy_score`, `confusion_matrix`, `classification_report` sur `X_test` ◆ **Sérialisation** : `joblib.dump(model, 'models/model.pkl')` ou `torch.save(model.state_dict(), 'model.pt')` ◆ **API locale** : FastAPI → `@app.post('/predict')` → charger le `.pkl`, retourner la prédiction ◆ **Test API local** : `uvicorn api:app --reload` → `curl -X POST http://localhost:8000/predict -d '{\"features\":[1,2,3]}'` ⚠️ Toujours fixer les versions dans `requirements.txt` — une mise à jour sklearn peut casser la désérialisation du modèle",
  },
  {
    question: "Bloc 4 — Déploiement modèle ML sur EC2",
    answer:
      "◆ **Choisir l'instance** : g4dn.xlarge (GPU T4) pour inférence, p3.2xlarge Spot pour réentraînement ◆ **AMI Deep Learning** : préconfigurée CUDA + PyTorch/TF — évite l'installation manuelle ◆ **Workflow artefacts S3** : `aws s3 cp models/model.pkl s3://mon-bucket/models/model.pkl` ◆ **Au démarrage EC2** : `import boto3; s3.download_file('bucket', 'models/model.pkl', '/tmp/model.pkl')` ◆ **Lancer l'API** : `gunicorn -w 2 -k uvicorn.workers.UvicornWorker api:app --bind 0.0.0.0:8000` ◆ **Tester** : `curl -X POST http://IP:8000/predict -H 'Content-Type: application/json' -d '{\"features\":[1,2,3]}'` ⚠️ Fixer la version du modèle dans le nom S3 — `model_v1.2.pkl` — pour pouvoir revenir en arrière",
  },
  {
    question: "Bloc 5 — Logs applicatifs : niveaux et format",
    answer:
      "◆ **Niveaux** (du moins au plus grave) : DEBUG → INFO → WARNING → ERROR → CRITICAL ◆ **Python logging** : `import logging; logging.basicConfig(level=logging.INFO, filename='app.log', format='%(asctime)s %(levelname)s %(message)s')` ◆ **Log d'une prédiction** : `logger.info(f'Prediction: input={data}, output={result}, latency={ms}ms')` ◆ **Log d'erreur** : `logger.error(f'Prediction failed: {e}', exc_info=True)` ◆ **Nginx logs** : access.log (toutes les requêtes) + error.log (erreurs) dans `/var/log/nginx/` ◆ **Format structuré** : JSON logs — facilite la recherche avec `grep` ou CloudWatch Insights ⚠️ Logger en DEBUG en production = disque plein rapidement — utiliser INFO ou WARNING en prod",
  },
  {
    question: "Bloc 6 — Lire et surveiller les logs en temps réel",
    answer:
      "◆ **Suivre en temps réel** : `tail -f /var/log/app/app.log` — affiche les nouvelles lignes au fur et à mesure ◆ **Filtrer les erreurs** : `grep 'ERROR\\|CRITICAL' /var/log/app/app.log` ◆ **Compter les erreurs** : `grep -c 'ERROR' /var/log/app/app.log` ◆ **Dernières 100 lignes** : `tail -100 /var/log/app/app.log` ◆ **Journalctl** : `journalctl -u monapp -f --since '1 hour ago'` — logs du service systemd ◆ **Rotation des logs** : `/etc/logrotate.d/monapp` — évite que les logs remplissent le disque ⚠️ `tail -f` sur un fichier rotaté peut s'arrêter silencieusement — utiliser `tail -F` (majuscule) qui suit le fichier même après rotation",
  },
  {
    question: "Bloc 7 — CloudWatch : métriques EC2 et alertes",
    answer:
      "◆ **Métriques de base** (gratuites) : CPUUtilization, NetworkIn/Out, DiskReadOps — dans la console EC2 ◆ **Métriques mémoire/disque** : nécessitent l'agent CloudWatch — `sudo yum install amazon-cloudwatch-agent -y` ◆ **Config agent** : `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json` — définit quels logs et métriques envoyer ◆ **Alarme CPU** : Console CloudWatch → Alarms → Create → CPUUtilization > 80% pendant 5 min → SNS notification email ◆ **Dashboard** : regrouper CPU, mémoire, requêtes/s, latence ML sur un seul écran ⚠️ CloudWatch Logs coûte selon le volume ingéré — filtrer les logs DEBUG avant envoi en prod",
  },
  {
    question: "Bloc 8 — CloudWatch Logs Insights : analyser les logs",
    answer:
      "◆ **CloudWatch Logs** : envoyer les logs applicatifs via l'agent → Console CloudWatch → Log Groups ◆ **Insights query** : `fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc | limit 20` ◆ **Latence ML** : `fields latency | stats avg(latency), max(latency) by bin(5m)` — détecter les pics ◆ **Taux d'erreur** : `filter status=500 | stats count() by bin(1m)` — graphe en temps réel ◆ **Metric Filter** : créer une métrique à partir d'un pattern de log — ex: compter les `ERROR` → créer une alarme ⚠️ Les requêtes Insights coûtent selon les données scannées — limiter la fenêtre temporelle",
  },
  {
    question: "Bloc 9 — Debugging en production : méthode",
    answer:
      "◆ **Symptôme 1 — App inaccessible** : 1) `curl -v http://localhost:8000` (app répond ?) 2) `sudo systemctl status nginx` 3) `pm2 status` / `systemctl status monapp` ◆ **Symptôme 2 — Erreur 502 Bad Gateway** : Nginx tourne mais l'app est morte — `pm2 restart all` ou `systemctl restart monapp` ◆ **Symptôme 3 — Prédiction ML lente** : `htop` (CPU saturé ?) + `tail -f app.log | grep latency` ◆ **Symptôme 4 — Disque plein** : `df -h` → `du -sh /var/log/*` → `logrotate -f /etc/logrotate.conf` ◆ **Symptôme 5 — Mémoire saturée** : `free -h` → `ps aux --sort=-%mem | head -10` ⚠️ Toujours diagnostiquer dans cet ordre : réseau → service → application → ressources",
  },
  {
    question: "Bloc 10 — Pipeline CI/CD minimal pour déploiement continu",
    answer:
      "◆ **Sans CI/CD** : git pull manuel + risque d'oublier un `pip install` ou `pm2 restart` ◆ **GitHub Actions** : `.github/workflows/deploy.yml` — déclenché sur push main → SSH → pull → restart ◆ **Étapes typiques** : 1) Tests (`pytest`) 2) Build Docker 3) Push ECR 4) SSH EC2 → docker pull + run ◆ **CodeDeploy** : service AWS natif — blue/green deployment, rollback automatique ◆ **Variables secrètes** : GitHub Secrets → `SSH_KEY`, `AWS_ACCESS_KEY_ID` — jamais en clair dans le YAML ◆ **Blue/Green** : déployer sur un nouveau groupe d'instances, basculer le load balancer → 0 downtime ⚠️ Un déploiement sans tests automatiques = jouer à la roulette en production",
  },
];
 
const questions = {
  moyen: [
    {
      question:
        "[Terme → Définition] Pourquoi utiliser `gunicorn` au lieu du serveur Flask intégré en production ?",
      options: [
        "gunicorn est plus simple à configurer que le serveur Flask intégré",
        "Le serveur Flask intégré est mono-thread et non sécurisé pour la prod — gunicorn gère plusieurs workers en parallèle",
        "gunicorn est requis uniquement pour les apps avec base de données",
        "Le serveur Flask intégré ne fonctionne que sur Windows",
      ],
      answer:
        "Le serveur Flask intégré est mono-thread et non sécurisé pour la prod — gunicorn gère plusieurs workers en parallèle",
      explanation:
        "Le serveur de développement Flask (`flask run`) est mono-thread, sans gestion d'erreurs robuste, et non optimisé pour les requêtes concurrentes. Gunicorn lance N workers (ex: -w 4) qui traitent les requêtes en parallèle. En prod : `gunicorn -w 4 app:app --bind 0.0.0.0:5000`.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre `tail -f` et `tail -F` pour suivre les logs ?",
      options: [
        "Ils sont identiques — seule la casse change",
        "`tail -f` suit le fichier par descripteur (s'arrête si rotaté) ; `tail -F` suit le nom du fichier et reprend après rotation",
        "`tail -F` est plus rapide car il utilise inotify",
        "`tail -f` affiche les 10 dernières lignes, `tail -F` affiche tout",
      ],
      answer:
        "`tail -f` suit le fichier par descripteur (s'arrête si rotaté) ; `tail -F` suit le nom du fichier et reprend après rotation",
      explanation:
        "Avec logrotate, le fichier `app.log` est renommé et un nouveau est créé. `tail -f` continue de lire l'ancien fichier renommé en silence. `tail -F` détecte le nouveau fichier et y bascule automatiquement — indispensable pour un monitoring fiable.",
    },
    {
      question:
        "[Terme → Définition] Quel est le rôle du reverse proxy Nginx devant une app Flask ?",
      options: [
        "Nginx remplace gunicorn pour servir les requêtes Python",
        "Nginx écoute sur le port 80/443 et redirige les requêtes vers l'app interne (port 5000/8000), gère SSL et les fichiers statiques",
        "Nginx est uniquement utile pour les sites statiques, pas pour les APIs",
        "Nginx chiffre automatiquement les données entre l'app et la base de données",
      ],
      answer:
        "Nginx écoute sur le port 80/443 et redirige les requêtes vers l'app interne (port 5000/8000), gère SSL et les fichiers statiques",
      explanation:
        "Nginx = porte d'entrée publique. Il reçoit les requêtes HTTP/HTTPS et les proxie vers gunicorn/uvicorn qui tourne en local. Avantages : SSL termination, compression, cache des fichiers statiques, protection contre les attaques basiques.",
    },
    {
      question:
        "[Confusion] Quelle est la différence entre les niveaux de log ERROR et CRITICAL ?",
      options: [
        "ERROR et CRITICAL sont identiques dans Python logging",
        "ERROR = erreur récupérable dans l'app ; CRITICAL = erreur qui compromet l'ensemble du système (BDD down, OOM)",
        "CRITICAL est uniquement pour les erreurs de sécurité",
        "ERROR s'affiche à l'écran, CRITICAL s'envoie par email automatiquement",
      ],
      answer:
        "ERROR = erreur récupérable dans l'app ; CRITICAL = erreur qui compromet l'ensemble du système (BDD down, OOM)",
      explanation:
        "Hiérarchie Python : DEBUG < INFO < WARNING < ERROR < CRITICAL. ERROR = exception dans une requête (la requête échoue mais l'app continue). CRITICAL = la BDD est injoignable, mémoire saturée — l'app peut s'arrêter. En prod, alerter sur ERROR et CRITICAL.",
    },
    {
      question:
        "[Terme → Définition] Pourquoi sérialiser un modèle ML avec `joblib` plutôt que `pickle` ?",
      options: [
        "joblib et pickle sont strictement équivalents",
        "joblib est optimisé pour les gros arrays numpy (compression, mémoire partagée) — plus rapide pour les modèles sklearn",
        "pickle ne fonctionne pas avec scikit-learn",
        "joblib chiffre automatiquement le modèle avant sauvegarde",
      ],
      answer:
        "joblib est optimisé pour les gros arrays numpy (compression, mémoire partagée) — plus rapide pour les modèles sklearn",
      explanation:
        "Les modèles sklearn contiennent souvent de gros arrays numpy (poids, arbres). joblib gère la sérialisation numpy efficacement avec compression gzip optionnelle. `joblib.dump(model, 'model.pkl', compress=3)` réduit la taille du fichier de 50-80%.",
    },
    {
      question:
        "[Confusion] Que signifie une erreur HTTP 502 Bad Gateway sur Nginx ?",
      options: [
        "Le client a envoyé une mauvaise requête",
        "Nginx tourne mais l'application backend est morte ou ne répond pas",
        "Le certificat SSL est expiré",
        "Le port 80 est bloqué par le Security Group AWS",
      ],
      answer:
        "Nginx tourne mais l'application backend est morte ou ne répond pas",
      explanation:
        "502 = Nginx a reçu la requête mais n'obtient pas de réponse du backend (gunicorn/uvicorn crashed, mauvais port dans proxy_pass). Diagnostic : `pm2 status` ou `systemctl status monapp` → si dead, redémarrer. Vérifier aussi que le port dans nginx.conf correspond bien au port de l'app.",
    },
    {
      question:
        "[Terme → Définition] Qu'est-ce que `logrotate` et pourquoi est-il indispensable ?",
      options: [
        "Un outil qui compresse les logs pour les envoyer sur S3",
        "Un démon qui archive et tronque automatiquement les fichiers logs selon une politique (taille, ancienneté) — évite le disque plein",
        "Un outil qui chiffre les logs sensibles",
        "La commande pour faire pivoter l'affichage des logs dans le terminal",
      ],
      answer:
        "Un démon qui archive et tronque automatiquement les fichiers logs selon une politique (taille, ancienneté) — évite le disque plein",
      explanation:
        "Sans logrotate, app.log grossit indéfiniment jusqu'à remplir le disque (df -h à 100% = app qui crash). Config type : rotation quotidienne, garder 7 jours, compresser les anciens. Sur Amazon Linux : `/etc/logrotate.d/monapp`.",
    },
    {
      question:
        "[Confusion] Pourquoi ne pas logger en niveau DEBUG en production ?",
      options: [
        "DEBUG n'est pas supporté par CloudWatch",
        "Le niveau DEBUG génère un volume massif de logs — disque saturé, coûts CloudWatch élevés, performances dégradées",
        "DEBUG expose les mots de passe dans les logs",
        "DEBUG n'est disponible qu'en mode développement local",
      ],
      answer:
        "Le niveau DEBUG génère un volume massif de logs — disque saturé, coûts CloudWatch élevés, performances dégradées",
      explanation:
        "DEBUG logue chaque étape interne. Une API à 100 req/s peut générer des gigaoctets de logs par jour en DEBUG. En prod : INFO (événements normaux) + WARNING/ERROR (anomalies). Le niveau se change dynamiquement sans redémarrer avec `logging.getLogger().setLevel(logging.INFO)`.",
    },
  ],
  avance: [
    {
      question:
        "[Code → Analyse] Ce code Python charge un modèle ML. Quel problème potentiel vois-tu ?\n`model = joblib.load('models/model.pkl')\n@app.post('/predict')\ndef predict(data): return model.predict([data.features])`",
      options: [
        "joblib.load doit être dans la fonction predict",
        "Le modèle est chargé une seule fois au démarrage — si la RAM est insuffisante au démarrage, l'API ne démarre pas. Il manque aussi la gestion d'erreur autour de la prédiction",
        "model.predict doit recevoir un DataFrame, pas une liste",
        "L'endpoint doit être GET, pas POST",
      ],
      answer:
        "Le modèle est chargé une seule fois au démarrage — si la RAM est insuffisante au démarrage, l'API ne démarre pas. Il manque aussi la gestion d'erreur autour de la prédiction",
      explanation:
        "Charger le modèle au démarrage (pas dans chaque requête) est correct pour la performance. Mais il manque : try/except autour de predict (features invalides → 500 sans message clair), logging de la latence, et validation des données d'entrée avec Pydantic. En prod, toujours wrapper la prédiction.",
    },
    {
      question:
        "[Anti-pattern] Ton workflow de déploiement est : SCP du .pkl sur EC2 → relancer l'API manuellement. Quel problème à l'échelle ?",
      options: [
        "SCP est trop lent pour les gros modèles",
        "Pas de versionning du modèle, déploiement manuel non reproductible, pas de rollback, downtime pendant le redémarrage",
        "Le .pkl ne peut pas être transféré via SCP",
        "EC2 ne supporte pas plusieurs versions de modèle simultanément",
      ],
      answer:
        "Pas de versionning du modèle, déploiement manuel non reproductible, pas de rollback, downtime pendant le redémarrage",
      explanation:
        "Solution pro : versionner sur S3 (`model_v1.2.pkl`), déployer via GitHub Actions (SSH → pull S3 → reload gunicorn avec `kill -HUP`). Le reload graceful de gunicorn (`--preload` + SIGHUP) évite le downtime. S3 comme source de vérité permet le rollback en 1 commande.",
    },
    {
      question:
        "[Situation → Outil] Tu veux recevoir un email si le CPU EC2 dépasse 85% pendant 5 minutes. Quel service AWS utiliser ?",
      options: [
        "CloudTrail + Lambda",
        "CloudWatch Alarm → SNS Topic → Email subscription",
        "EC2 Auto Scaling uniquement",
        "S3 Event Notification",
      ],
      answer: "CloudWatch Alarm → SNS Topic → Email subscription",
      explanation:
        "CloudWatch collecte la métrique CPUUtilization. L'alarme se déclenche si > 85% pendant 5 minutes consécutives. L'alarme publie dans un SNS Topic, qui envoie l'email aux abonnés. C'est le pipeline de monitoring de base pour tout DevOps AWS.",
    },
    {
      question:
        "[Code → Analyse] Cette requête CloudWatch Insights est-elle correcte pour détecter les prédictions lentes ?\n`fields @timestamp, latency | filter latency > 500 | stats count() by bin(5m)`",
      options: [
        "Non — filter doit venir avant fields",
        "Oui — elle filtre les prédictions dont la latence dépasse 500ms et compte par fenêtre de 5 minutes",
        "Non — stats count() ne fonctionne pas avec bin()",
        "Non — latency doit être entre guillemets car c'est une string dans les logs",
      ],
      answer:
        "Oui — elle filtre les prédictions dont la latence dépasse 500ms et compte par fenêtre de 5 minutes",
      explanation:
        "La requête est valide. `fields` sélectionne les colonnes, `filter` applique la condition, `stats count() by bin(5m)` agrège par fenêtre temporelle. Résultat : graphe du nombre de prédictions lentes par 5 minutes — idéal pour détecter une dégradation progressive.",
    },
    {
      question:
        "[Refactoring] Ton app Flask loggue comme ça : `print(f'Erreur: {e}')`. Quel problème en production ?",
      options: [
        "print() est identique à logging en production",
        "print() n'inclut pas le timestamp, le niveau, ni le nom du module — non capturé par journalctl/CloudWatch, pas filtrable",
        "print() est synchrone et bloque le thread principal",
        "print() ne fonctionne pas dans gunicorn",
      ],
      answer:
        "print() n'inclut pas le timestamp, le niveau, ni le nom du module — non capturé par journalctl/CloudWatch, pas filtrable",
      explanation:
        "En prod, `print()` va sur stdout sans structure. `logging.error(f'Erreur: {e}', exc_info=True)` inclut : timestamp, niveau ERROR, module, et la stack trace complète. Avec `exc_info=True`, tu vois exactement quelle ligne a levé l'exception — invaluable pour le débogage.",
    },
    {
      question:
        "[Architecture] Quel est l'avantage de stocker les artefacts ML (.pkl, .pt) sur S3 plutôt que directement sur l'EBS de l'instance ?",
      options: [
        "S3 est plus rapide que EBS pour charger un modèle",
        "S3 = stockage central partagé entre instances, versionnable, durable (99.999999999%), indépendant du cycle de vie de l'instance",
        "EBS ne peut pas stocker des fichiers .pkl",
        "Les modèles sur S3 se mettent à jour automatiquement",
      ],
      answer:
        "S3 = stockage central partagé entre instances, versionnable, durable (99.999999999%), indépendant du cycle de vie de l'instance",
      explanation:
        "Si l'instance EC2 est terminée, l'EBS disparaît avec elle. S3 persiste indépendamment. Plusieurs instances peuvent charger le même modèle. Le versioning S3 permet le rollback instantané. En Auto Scaling, chaque nouvelle instance démarre en téléchargeant le bon modèle depuis S3.",
    },
    {
      question:
        "[Anti-pattern] Ton app Python crash avec `MemoryError` sur EC2 lors de l'inférence. Quelle est la première chose à vérifier ?",
      options: [
        "Redémarrer l'instance EC2",
        "Vérifier avec `free -h` si la RAM est saturée, puis `ps aux --sort=-%mem | head -5` pour identifier le process fautif",
        "Augmenter le disque EBS",
        "Désactiver CloudWatch pour libérer des ressources",
      ],
      answer:
        "Vérifier avec `free -h` si la RAM est saturée, puis `ps aux --sort=-%mem | head -5` pour identifier le process fautif",
      explanation:
        "MemoryError = RAM insuffisante. `free -h` montre la RAM disponible. `ps aux --sort=-%mem` trie les process par consommation mémoire. Solutions : batch plus petit à l'inférence, instance plus grande, ou quantisation du modèle (FP16 au lieu de FP32 divise la RAM par 2).",
    },
  ],
  expert: [
    {
      question:
        "[Architecture] Tu déploies une API ML avec pics imprévus. Quelle architecture garantit 0 downtime et auto-scaling ?",
      options: [
        "Une seule grosse instance EC2 avec PM2 cluster mode",
        "ALB + Auto Scaling Group de g4dn.xlarge + Launch Template avec User Data qui télécharge le modèle depuis S3 au démarrage",
        "Lambda avec le modèle en mémoire pour les petits modèles uniquement",
        "EBS multi-attach sur plusieurs instances en lecture simultanée",
      ],
      answer:
        "ALB + Auto Scaling Group de g4dn.xlarge + Launch Template avec User Data qui télécharge le modèle depuis S3 au démarrage",
      explanation:
        "ALB distribue les requêtes. L'ASG ajoute des instances si CPU > seuil. Le Launch Template User Data (`aws s3 cp s3://bucket/model.pkl /tmp/ && systemctl start api`) automatise le démarrage. Chaque instance est identique et interchangeable. La seule instance unique = point de défaillance.",
    },
    {
      question:
        "[Ordre de dépendance] Pour mettre en place un monitoring complet (logs + métriques + alertes), dans quel ordre procéder ?",
      options: [
        "Créer les alarmes → installer l'agent CloudWatch → configurer les logs → créer le dashboard",
        "Configurer le logging Python → installer l'agent CloudWatch → créer le Log Group → créer les Metric Filters → créer les alarmes SNS → dashboard",
        "Dashboard → alarmes → logs → agent",
        "SNS → logs → alarmes → agent CloudWatch",
      ],
      answer:
        "Configurer le logging Python → installer l'agent CloudWatch → créer le Log Group → créer les Metric Filters → créer les alarmes SNS → dashboard",
      explanation:
        "Les dépendances : les logs doivent exister avant de créer des Metric Filters. Les Metric Filters créent des métriques, requises par les alarmes. Les alarmes utilisent SNS (à créer avant ou après). Le dashboard visualise tout — dernier élément car il agrège ce qui existe.",
    },
    {
      question:
        "[Nommage inversé] Quel mécanisme a ces propriétés : rechargement du processus sans downtime, signal UNIX, utilisé avec gunicorn, applique les changements de config/code sans couper les connexions actives ?",
      options: [
        "docker restart",
        "pm2 reload",
        "Graceful reload via SIGHUP — `kill -HUP $(cat gunicorn.pid)` ou `systemctl reload`",
        "nginx -s reload",
      ],
      answer:
        "Graceful reload via SIGHUP — `kill -HUP $(cat gunicorn.pid)` ou `systemctl reload`",
      explanation:
        "SIGHUP (Signal 1) demande à gunicorn de relancer ses workers un par un, sans couper les requêtes en cours. Le master process garde les connexions actives pendant que les nouveaux workers chargent le code mis à jour. Résultat : 0 downtime en déploiement. PM2 reload fait la même chose pour Node.js.",
    },
    {
      question:
        "[Architecture] Tu veux détecter automatiquement une dégradation des prédictions ML (latence P99 > 2s) et scaler. Quel pipeline AWS ?",
      options: [
        "Cron toutes les minutes qui lit les logs et envoie un email",
        "App loggue latency en JSON → CloudWatch Logs → Metric Filter (extrait latency) → Alarm P99 > 2000ms → SNS email + Auto Scaling policy",
        "Uniquement EC2 Auto Scaling basé sur CPU",
        "S3 stocke les latences, Lambda les analyse quotidiennement",
      ],
      answer:
        "App loggue latency en JSON → CloudWatch Logs → Metric Filter (extrait latency) → Alarm P99 > 2000ms → SNS email + Auto Scaling policy",
      explanation:
        "Pipeline complet : 1) Logger `{latency: 1850, status: 'ok'}` en JSON. 2) Metric Filter extrait la valeur numérique. 3) Alarme CloudWatch sur percentile P99 > 2000ms. 4) SNS envoie l'alerte email. 5) L'alarme déclenche aussi une politique Auto Scaling pour ajouter des instances.",
    },
    {
      question:
        "[Situation → Multi-concepts] Ton modèle ML prédit correctement en local mais retourne des résultats aberrants sur EC2. Quelle méthode de débogage appliquer ?",
      options: [
        "Réentraîner le modèle directement sur EC2",
        "Comparer les versions (sklearn, numpy, Python) local vs EC2, vérifier le modèle chargé (hash S3), logger les features reçues par l'API pour détecter une transformation différente",
        "Recréer l'instance EC2 avec une AMI différente",
        "Augmenter la RAM de l'instance",
      ],
      answer:
        "Comparer les versions (sklearn, numpy, Python) local vs EC2, vérifier le modèle chargé (hash S3), logger les features reçues par l'API pour détecter une transformation différente",
      explanation:
        "Causes classiques : différence de version sklearn (le modèle sérialise des comportements version-spécifiques), preprocessing différent en prod vs entraînement, mauvais modèle chargé (vérifier l'ETag S3). Toujours logger les features reçues pour comparer avec les données d'entraînement — c'est le training/serving skew.",
    },
    {
      question:
        "[Architecture] Quelle est la différence entre un déploiement Blue/Green et un Rolling Update sur EC2 ?",
      options: [
        "Blue/Green et Rolling Update sont identiques — seule la terminologie change",
        "Blue/Green : deux environnements complets, bascule instantanée du load balancer, rollback en 30s ; Rolling : remplace les instances une par une, moins de ressources mais rollback plus lent",
        "Rolling Update est uniquement pour Docker, Blue/Green pour les instances EC2",
        "Blue/Green est moins cher car il utilise moins d'instances",
      ],
      answer:
        "Blue/Green : deux environnements complets, bascule instantanée du load balancer, rollback en 30s ; Rolling : remplace les instances une par une, moins de ressources mais rollback plus lent",
      explanation:
        "Blue/Green = 2x les instances en parallèle (coût doublé pendant le déploiement) mais basculement et rollback instantanés via l'ALB. Rolling = économique mais si le nouveau code a un bug, il tourne déjà sur certaines instances avant détection. Pour les APIs ML critiques : Blue/Green ou Canary (5% nouveau → 100%).",
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
        ? <h3 className="success">🚀 Infrastructure REST API CIB maîtrisée — Mission MAPS prête !</h3>
        : <p className="fail">📚 Révisez l'API REST, le multithreading C# et l'architecture microservices CIB.</p>}
    </div>
  );
};

const CIBRestApiInfraQCM = () => {
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
            CIB REST API & Infrastructure 🔹 {level === "basic"
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

export default CIBRestApiInfraQCM;
