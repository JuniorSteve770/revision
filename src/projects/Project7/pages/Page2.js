// src/projects/aws/Page_AWS.js
import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — AWS pour DevOps : EC2, S3 et au-delà",
    answer:
      "◆ **Bloc 1** : AWS vs Azure — grands points de comparaison, positionnement marché ◆ **Bloc 2** : Fondamentaux AWS — Régions, AZ, IAM, VPC, Security Groups ◆ **Bloc 3** : EC2 — types d'instances, création, connexion SSH, gestion ◆ **Bloc 4** : S3 — buckets, permissions, hébergement statique, CLI ◆ **Bloc 5** : Déploiement depuis un PC local — SCP, FileZilla, CodeDeploy ◆ **Bloc 6** : Mise à jour avec PuTTY / FileZilla — quotidien DevOps ◆ **Bloc 7** : Avancé — ML sur EC2, Docker, ECR, ECS, Auto Scaling",
  },
  {
    question: "AWS vs Azure — Comparaison stratégique",
    answer:
      "◆ **Part de marché** : AWS leader (~32%), Azure 2e (~23%) — AWS plus mature, Azure dominant en entreprise Microsoft ◆ **EC2 vs VM Azure** : EC2 = instances à la demande / réservées / spot ; Azure = VMs avec tailles prédéfinies (B, D, E series) ◆ **S3 vs Azure Blob Storage** : S3 référence mondiale, Blob intégré à l'écosystème Azure/Office 365 ◆ **IAM vs Azure AD** : IAM = gestion fine par politiques JSON ; Azure AD = intégration Active Directory d'entreprise ◆ **Tarification** : AWS pay-as-you-go + Reserved Instances ; Azure favorise les engagements hybrides ⚠️ AWS a plus de services (200+) mais Azure gagne en entreprises déjà sous Microsoft 365",
  },
  {
    question: "Fondamentaux AWS — Régions, AZ, IAM",
    answer:
      "◆ **Région** : zone géographique (ex: `eu-west-3` = Paris) — choisir selon latence utilisateur et conformité RGPD ◆ **Availability Zone (AZ)** : datacenter physique dans une région — au moins 3 par région pour la haute disponibilité ◆ **IAM** (Identity & Access Management) : gère qui peut faire quoi — Users, Groups, Roles, Policies JSON ◆ **Principe du moindre privilège** : donner uniquement les droits nécessaires — jamais utiliser le compte root en production ◆ Exemple : rôle IAM `EC2FullAccess` attaché à un utilisateur DevOps ⚠️ Ne jamais hardcoder les clés AWS dans le code — utiliser les rôles IAM ou AWS Secrets Manager",
  },
  {
    question: "VPC et Security Groups — Réseau AWS",
    answer:
      "◆ **VPC** (Virtual Private Cloud) : réseau privé isolé dans AWS — sous-réseaux publics et privés ◆ **Subnet public** : accessible depuis Internet (EC2 web, load balancer) ◆ **Subnet privé** : non accessible directement (BDD, ML models) ◆ **Security Group** : pare-feu virtuel par instance — règles Inbound/Outbound ◆ Exemple : ouvrir le port 22 (SSH) uniquement depuis ton IP, port 80/443 depuis `0.0.0.0/0` pour le web ◆ **Internet Gateway** : connecte le VPC à Internet ⚠️ Un Security Group par défaut bloque tout — penser à ouvrir les ports applicatifs (3000, 8000, 8080...)",
  },
  {
    question: "EC2 — Types d'instances et choix",
    answer:
      "◆ **Familles** : t3/t4g = usage général (web, dev) ; c6i = CPU intensif ; r6g = mémoire (BDD) ; p3/p4 = GPU (ML/Deep Learning) ; g4dn = GPU moins cher (inférence ML) ◆ **Tailles** : micro < small < medium < large < xlarge < 2xlarge... ◆ **t2.micro** : gratuit 12 mois (Free Tier) — parfait pour apprendre ◆ **Modèles de facturation** : On-Demand (à l'heure), Reserved (-72%, engagement 1-3 ans), Spot (-90%, interruptible) ◆ Exemple : API Flask sur t3.small, entraînement ML sur p3.2xlarge Spot ⚠️ Éteindre les instances inutilisées — une instance oubliée peut coûter cher",
  },
  {
    question: "Créer une instance EC2 — Étapes complètes",
    answer:
      "◆ **1. Console AWS** → EC2 → Launch Instance ◆ **2. Nom et AMI** : choisir Amazon Linux 2023 ou Ubuntu 22.04 LTS ◆ **3. Type d'instance** : t2.micro pour débuter (Free Tier) ◆ **4. Key Pair** : créer une paire de clés `.pem` — la télécharger et la garder précieusement ◆ **5. Security Group** : ouvrir SSH (port 22) depuis ton IP, HTTP (80) si serveur web ◆ **6. Storage** : 8 Go minimum (EBS gp3) — augmenter selon le projet ◆ **7. Launch** → noter l'IP publique ◆ Connexion : `ssh -i ma-cle.pem ec2-user@IP_PUBLIQUE` ⚠️ La clé `.pem` ne peut être téléchargée qu'une seule fois — la perdre = recréer l'instance",
  },
  {
    question: "Gestion des instances EC2 — Opérations courantes",
    answer:
      "◆ **Start/Stop** : arrêter une instance = plus de facturation CPU (mais EBS continue) ◆ **Terminate** : supprime définitivement l'instance et les données — irréversible ◆ **Elastic IP** : IP fixe qui ne change pas au redémarrage — associer à l'instance ◆ **AMI personnalisée** : snapshot de ton instance configurée → cloner rapidement ◆ **User Data** : script bash exécuté au premier démarrage (installer Nginx, Node...) ◆ Commandes utiles : `sudo systemctl start nginx` / `pm2 start app.js` / `sudo reboot` ⚠️ L'IP publique change à chaque redémarrage sans Elastic IP",
  },
  {
    question: "S3 — Buckets, Objects et Permissions",
    answer:
      "◆ **Bucket** : conteneur global — nom unique mondial, lié à une région ◆ **Object** : fichier stocké dans S3 avec une clé (chemin) — ex: `assets/images/logo.png` ◆ **Storage classes** : Standard (fréquent), Infrequent Access (moins cher), Glacier (archivage) ◆ **Permissions** : Public Access bloqué par défaut — débloquer uniquement pour les sites statiques ◆ **Bucket Policy** : JSON qui définit qui accède à quoi ◆ **Versioning** : garder l'historique de chaque version d'un fichier ⚠️ Ne jamais mettre de données sensibles dans un bucket public — fuite de données très fréquente sur S3",
  },
  {
    question: "S3 — Hébergement statique et CLI",
    answer:
      "◆ **Hébergement statique** : S3 peut servir un site HTML/CSS/JS directement via URL publique ◆ **Étapes** : Properties → Static website hosting → activer → index.html + error.html ◆ **AWS CLI** : `aws s3 cp monsite/ s3://mon-bucket/ --recursive` — synchronise en une commande ◆ **Sync** : `aws s3 sync ./dist s3://mon-bucket --delete` — n'envoie que les fichiers modifiés ◆ **Pré-signed URL** : URL temporaire d'accès privé — `aws s3 presign s3://bucket/fichier --expires-in 3600` ◆ Cas concret : déployer un build React/Vue sur S3 + CloudFront pour un CDN mondial ⚠️ `--delete` dans sync supprime les fichiers absents localement — vérifier avant",
  },
  {
    question: "Déploiement depuis PC local — SCP et FileZilla",
    answer:
      "◆ **SCP** (Secure Copy) : copie de fichiers via SSH — `scp -i cle.pem ./app.zip ec2-user@IP:/home/ec2-user/` ◆ **FileZilla** : client FTP/SFTP graphique — configurer avec Site Manager : hôte = IP EC2, protocole SFTP, clé `.ppk` (PuTTYgen) ◆ **PuTTY** : terminal SSH Windows — convertir `.pem` en `.ppk` avec PuTTYgen, puis renseigner IP + clé ◆ **Workflow déploiement** : 1) zip le projet local → 2) SCP/FileZilla vers EC2 → 3) SSH sur EC2 → 4) unzip → 5) `npm install && pm2 restart app` ◆ **Git pull** : alternative propre — `git pull origin main` directement sur l'instance ⚠️ Ne jamais copier les fichiers `.env` avec FileZilla en clair — utiliser AWS Secrets Manager",
  },
  {
    question: "PuTTY — Connexion SSH depuis Windows",
    answer:
      "◆ **PuTTYgen** : convertir la clé `.pem` AWS en `.ppk` : Load → `.pem` → Save private key ◆ **PuTTY configuration** : Session → Host Name = `ec2-user@IP` (Amazon Linux) ou `ubuntu@IP` (Ubuntu) ◆ Connection → SSH → Auth → Credentials → clé `.ppk` ◆ **Commandes quotidiennes** : `cd /var/www/html` → `ls -la` → `sudo nano fichier.conf` → `tail -f /var/log/nginx/error.log` ◆ **Sessions sauvegardées** : nommer et sauvegarder dans PuTTY pour un accès en 1 clic ◆ Astuce : Ctrl+D pour fermer proprement la session SSH ⚠️ Sur Mac/Linux, PuTTY inutile — `ssh -i cle.pem user@IP` directement dans le terminal",
  },
  {
    question: "Quotidien DevOps EC2 — Opérations courantes",
    answer:
      "◆ **Monitoring** : `htop` (CPU/RAM), `df -h` (disque), `netstat -tulnp` (ports ouverts) ◆ **Logs** : `journalctl -u nginx -f` / `tail -f /var/log/app/error.log` ◆ **Process manager** : `pm2 status` / `pm2 logs` / `pm2 restart all` — maintenir Node.js en vie ◆ **Nginx** : `sudo nginx -t` (tester config) / `sudo systemctl reload nginx` ◆ **Mises à jour** : `sudo yum update -y` (Amazon Linux) / `sudo apt upgrade` (Ubuntu) ◆ **Crontab** : `crontab -e` — automatiser sauvegardes, scripts, sync S3 ⚠️ Toujours tester la config Nginx avant reload — une mauvaise config coupe le site",
  },
  {
    question: "Elastic Load Balancer et Auto Scaling",
    answer:
      "◆ **ELB** (Elastic Load Balancer) : distribue le trafic entre plusieurs instances EC2 ◆ **Types** : ALB (Application, niveau HTTP/HTTPS) ; NLB (Network, niveau TCP, très rapide) ◆ **Auto Scaling Group** : ajoute/retire automatiquement des instances selon la charge (CPU > 70% → scale out) ◆ **Launch Template** : modèle d'instance pour l'Auto Scaling — AMI + type + SG + User Data ◆ **Target Group** : groupe d'instances derrière le load balancer avec health checks ◆ Architecture type : Internet → Route 53 → CloudFront → ALB → EC2 instances → RDS ⚠️ Configurer les health checks correctement — une instance qui ne répond pas est retirée automatiquement",
  },
  {
    question: "Docker sur EC2 — Conteneurisation",
    answer:
      "◆ **Docker** : empaquète l'app + ses dépendances dans une image portable ◆ **Installation** : `sudo yum install docker -y && sudo service docker start && sudo usermod -aG docker ec2-user` ◆ **Workflow** : `docker build -t mon-app:v1 .` → `docker run -d -p 80:3000 mon-app:v1` ◆ **ECR** (Elastic Container Registry) : registry Docker privé AWS — `aws ecr get-login-password | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.REGION.amazonaws.com` ◆ **ECS** (Elastic Container Service) : orchestration de conteneurs géré AWS ◆ **EKS** : Kubernetes managé — pour les architectures microservices complexes ⚠️ Sans orchestrateur, un conteneur qui crash ne redémarre pas automatiquement — utiliser `--restart=always`",
  },
  {
    question: "ML sur EC2 — Déploiement de modèles",
    answer:
      "◆ **Instance GPU** : p3.2xlarge (Tesla V100) pour l'entraînement, g4dn.xlarge (T4) pour l'inférence ◆ **AMI Deep Learning** : AMI AWS préconfigurée avec CUDA, PyTorch, TensorFlow — prête en 5 min ◆ **Servir un modèle** : Flask/FastAPI + `uvicorn model_api:app --host 0.0.0.0 --port 8000` ◆ **S3 pour les artefacts** : stocker les modèles `.pkl`/`.pt` sur S3, les télécharger au démarrage de l'instance ◆ **SageMaker** : alternative managée — entraînement, déploiement, endpoints auto-scalables ◆ Workflow : entraîner sur Spot p3 → sauvegarder sur S3 → déployer sur g4dn ou SageMaker endpoint ⚠️ Les instances GPU coûtent cher — utiliser les instances Spot pour l'entraînement (-90%)",
  },
];

const questions = {
  moyen: [
    {
      question: "[Terme → Définition] Qu'est-ce qu'une Availability Zone (AZ) dans AWS ?",
      options: [
        "Un datacenter physique isolé au sein d'une même région AWS",
        "Une zone géographique comme eu-west-3 (Paris)",
        "Un groupe de régions proches géographiquement",
        "Le nom du réseau privé d'une instance EC2",
      ],
      answer: "Un datacenter physique isolé au sein d'une même région AWS",
      explanation:
        "Une Région contient plusieurs AZ (ex: eu-west-3a, 3b, 3c). Chaque AZ est un datacenter physiquement séparé. Déployer sur 2 AZ garantit la haute disponibilité — si un datacenter tombe, l'autre prend le relais. Confondre Région et AZ est une erreur courante.",
    },
    {
      question: "[Confusion] Quelle est la différence entre Stop et Terminate sur une instance EC2 ?",
      options: [
        "Stop et Terminate font la même chose — ils coupent l'instance",
        "Stop arrête l'instance (données conservées, facturation CPU stoppée) ; Terminate supprime définitivement l'instance",
        "Terminate arrête temporairement, Stop supprime définitivement",
        "Stop supprime le stockage EBS, Terminate ne supprime que l'instance",
      ],
      answer:
        "Stop arrête l'instance (données conservées, facturation CPU stoppée) ; Terminate supprime définitivement l'instance",
      explanation:
        "Stop = pause. L'EBS est conservé, l'IP publique change au redémarrage (sauf Elastic IP). Terminate = destruction irréversible. En production, utiliser Stop pour économiser la nuit, jamais Terminate sauf pour nettoyer.",
    },
    {
      question: "[Terme → Définition] À quoi sert un Security Group dans AWS ?",
      options: [
        "Un pare-feu virtuel par instance qui contrôle le trafic entrant et sortant",
        "Un groupe d'utilisateurs IAM avec les mêmes permissions",
        "Un système de sauvegarde automatique des instances EC2",
        "Un certificat SSL attaché à une instance",
      ],
      answer:
        "Un pare-feu virtuel par instance qui contrôle le trafic entrant et sortant",
      explanation:
        "Le Security Group définit des règles Inbound (entrant) et Outbound (sortant) par port/protocole/source. Par défaut tout est bloqué. Pour un serveur web : ouvrir 80/443 depuis 0.0.0.0/0, 22 depuis ton IP uniquement.",
    },
    {
      question:
        "[Positionnement] Où doit être placée la clause WHERE dans une requête SQL ?",
      options: [
        "Après GROUP BY",
        "Après HAVING",
        "Après FROM et avant GROUP BY",
        "Après ORDER BY",
      ],
      answer: "Après FROM et avant GROUP BY",
      explanation:
        "L'ordre logique d'une requête SQL est : FROM → WHERE → GROUP BY → HAVING → ORDER BY. WHERE filtre les lignes avant toute agrégation. Une mauvaise position provoque une erreur de syntaxe ou un résultat incorrect.",
    },
    {
      question:
        "[Contexte] Dans quel cas utiliser WHERE plutôt que HAVING ?",
      options: [
        "Pour filtrer une moyenne calculée",
        "Pour filtrer un COUNT(*)",
        "Pour filtrer des lignes individuelles avant regroupement",
        "Pour filtrer le résultat d'une fonction AVG()",
      ],
      answer:
        "Pour filtrer des lignes individuelles avant regroupement",
      explanation:
        "WHERE agit sur chaque ligne avant le GROUP BY. Exemple : `WHERE note > 10`. Dès qu'un calcul d'agrégation est impliqué (AVG, COUNT, SUM...), il faut généralement utiliser HAVING.",
    },
    {
      question:
        "[Code → Analyse] Quelle requête affiche uniquement les étudiants de niveau Master ?",
      options: [
        "SELECT * FROM etudiants HAVING niveau = 'Master'",
        "SELECT * FROM etudiants WHERE niveau = 'Master'",
        "SELECT * FROM etudiants GROUP BY niveau = 'Master'",
        "SELECT * FROM etudiants ORDER BY niveau = 'Master'",
      ],
      answer:
        "SELECT * FROM etudiants WHERE niveau = 'Master'",
      explanation:
        "Le filtre porte sur une colonne simple de la table. Aucun regroupement n'est nécessaire. WHERE est donc la clause adaptée.",
    },
    {
      question:
        "[Positionnement] Où doit être placée la clause GROUP BY ?",
      options: [
        "Après HAVING",
        "Après ORDER BY",
        "Après WHERE et avant HAVING",
        "Avant FROM",
      ],
      answer:
        "Après WHERE et avant HAVING",
      explanation:
        "L'ordre classique est : FROM → WHERE → GROUP BY → HAVING → ORDER BY. GROUP BY crée les groupes sur lesquels les fonctions d'agrégation vont travailler.",
    },
    {
      question:
        "[Contexte] Quand utiliser GROUP BY ?",
      options: [
        "Pour trier les résultats",
        "Pour filtrer les lignes",
        "Pour calculer des agrégats par catégorie",
        "Pour créer une table",
      ],
      answer:
        "Pour calculer des agrégats par catégorie",
      explanation:
        "GROUP BY permet de regrouper les lignes avant d'appliquer AVG(), COUNT(), SUM(), MIN() ou MAX(). Exemple : moyenne par matière ou nombre d'étudiants par niveau.",
    },
    {
      question:
        "[Code → Analyse] Quelle requête calcule le nombre d'étudiants par niveau ?",
      options: [
        "SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau",
        "SELECT niveau, COUNT(*) FROM etudiants HAVING niveau",
        "SELECT niveau, COUNT(*) FROM etudiants ORDER BY niveau",
        "SELECT niveau, COUNT(*) FROM etudiants WHERE niveau",
      ],
      answer:
        "SELECT niveau, COUNT(*) FROM etudiants GROUP BY niveau",
      explanation:
        "GROUP BY niveau crée un groupe pour chaque niveau (Licence, Master...). COUNT(*) est ensuite calculé pour chaque groupe.",
    },
    {
      question:
        "[Positionnement] Où doit être placée la clause HAVING ?",
      options: [
        "Avant GROUP BY",
        "Après GROUP BY",
        "Avant WHERE",
        "Avant FROM",
      ],
      answer:
        "Après GROUP BY",
      explanation:
        "HAVING intervient après la création des groupes. Elle sert à filtrer les résultats agrégés produits par GROUP BY.",
    },
    {
      question:
        "[Contexte] Quand utiliser HAVING ?",
      options: [
        "Pour filtrer une ligne individuelle",
        "Pour filtrer un résultat d'agrégation",
        "Pour effectuer une jointure",
        "Pour créer un index",
      ],
      answer:
        "Pour filtrer un résultat d'agrégation",
      explanation:
        "HAVING est conçu pour travailler avec AVG(), COUNT(), SUM(), MIN() ou MAX(). Exemple : `HAVING AVG(note) > 12`.",
    },
    {
      question:
        "[Confusion] Quelle requête est correcte pour afficher les matières dont la moyenne dépasse 12 ?",
      options: [
        "SELECT matiere, AVG(note) FROM notes WHERE AVG(note) > 12 GROUP BY matiere",
        "SELECT matiere, AVG(note) FROM notes GROUP BY matiere HAVING AVG(note) > 12",
        "SELECT matiere, AVG(note) FROM notes HAVING AVG(note) > 12",
        "SELECT matiere, AVG(note) FROM notes ORDER BY AVG(note) > 12",
      ],
      answer:
        "SELECT matiere, AVG(note) FROM notes GROUP BY matiere HAVING AVG(note) > 12",
      explanation:
        "AVG(note) n'existe qu'après le regroupement. Il faut donc d'abord faire GROUP BY puis utiliser HAVING pour filtrer les moyennes calculées.",
    },
    {
      question:
        "[Ordre logique] Quelle est la bonne séquence d'exécution SQL ?",
      options: [
        "SELECT → FROM → WHERE → GROUP BY → HAVING",
        "FROM → WHERE → GROUP BY → HAVING → SELECT",
        "WHERE → FROM → GROUP BY → SELECT → HAVING",
        "FROM → GROUP BY → SELECT → WHERE → HAVING",
      ],
      answer:
        "FROM → WHERE → GROUP BY → HAVING → SELECT",
      explanation:
        "Même si on écrit SELECT en premier, le moteur SQL commence par FROM, applique WHERE, crée les groupes avec GROUP BY, filtre avec HAVING puis construit le résultat SELECT.",
    },
    {
      question:
        "[Cas pratique] Vous voulez calculer la moyenne des notes des étudiants de Master uniquement. Quelle clause doit être utilisée pour filtrer les Masters ?",
      options: [
        "HAVING niveau = 'Master'",
        "GROUP BY niveau = 'Master'",
        "WHERE niveau = 'Master'",
        "ORDER BY niveau = 'Master'",
      ],
      answer:
        "WHERE niveau = 'Master'",
      explanation:
        "Le filtre porte sur les lignes avant le calcul de la moyenne. WHERE doit être utilisé avant GROUP BY et AVG.",
    },
    {
      question:
        "[Cas pratique] Vous souhaitez afficher uniquement les niveaux contenant plus de 100 étudiants. Quelle clause doit être utilisée ?",
      options: [
        "WHERE COUNT(*) > 100",
        "GROUP BY COUNT(*) > 100",
        "HAVING COUNT(*) > 100",
        "ORDER BY COUNT(*) > 100",
      ],
      answer:
        "HAVING COUNT(*) > 100",
      explanation:
        "COUNT(*) est un agrégat. Il faut d'abord calculer le nombre d'étudiants par niveau puis utiliser HAVING pour filtrer les groupes obtenus.",
    },
    {
      question:
        "[Erreur fréquente] Pourquoi la requête `WHERE AVG(note) > 12` est-elle incorrecte ?",
      options: [
        "AVG ne fonctionne qu'avec SUM",
        "AVG ne peut être utilisé qu'après GROUP BY et doit être filtré avec HAVING",
        "AVG ne fonctionne pas sur les nombres",
        "AVG ne peut être utilisé qu'avec ORDER BY",
      ],
      answer:
        "AVG ne peut être utilisé qu'après GROUP BY et doit être filtré avec HAVING",
      explanation:
        "Au moment où WHERE est exécuté, AVG(note) n'a pas encore été calculé. HAVING intervient après le calcul des agrégats.",
    },
    {
      question:
        "[Situation réelle] Vous devez afficher les matières ayant plus de 50 notes enregistrées. Quelle requête est correcte ?",
      options: [
        "SELECT matiere, COUNT(*) FROM notes GROUP BY matiere HAVING COUNT(*) > 50",
        "SELECT matiere, COUNT(*) FROM notes WHERE COUNT(*) > 50",
        "SELECT matiere, COUNT(*) FROM notes ORDER BY COUNT(*) > 50",
        "SELECT matiere, COUNT(*) FROM notes HAVING matiere > 50",
      ],
      answer:
        "SELECT matiere, COUNT(*) FROM notes GROUP BY matiere HAVING COUNT(*) > 50",
      explanation:
        "COUNT(*) est calculé pour chaque matière grâce à GROUP BY. HAVING filtre ensuite les groupes dont le nombre de lignes dépasse 50.",
    },
    {
      question: "[Confusion] Quelle est la différence entre une Région et une AZ ?",
      options: [
        "Région = zone géographique (Paris, Dublin), AZ = datacenter physique au sein de cette région",
        "AZ = zone géographique (Paris), Région = datacenter physique",
        "Région et AZ désignent la même chose selon le contexte",
        "Une Région contient toujours exactement une seule AZ",
      ],
      answer:
        "Région = zone géographique (Paris, Dublin), AZ = datacenter physique au sein de cette région",
      explanation:
        "eu-west-3 = Région Paris. eu-west-3a, 3b, 3c = 3 AZ de cette région. Déployer multi-AZ = haute disponibilité. Déployer multi-Région = disaster recovery. Choisir la région Paris pour conformité RGPD.",
    },
    {
      question: "[Terme → Définition] Qu'est-ce qu'une Elastic IP dans EC2 ?",
      options: [
        "Une IP publique dynamique qui change à chaque redémarrage",
        "Une IP publique statique attachée à ton compte AWS, qui ne change pas au redémarrage",
        "L'adresse IP privée du VPC de l'instance",
        "Un service de DNS automatique pour les instances EC2",
      ],
      answer:
        "Une IP publique statique attachée à ton compte AWS, qui ne change pas au redémarrage",
      explanation:
        "Sans Elastic IP, l'IP publique change à chaque Stop/Start. L'Elastic IP est facturée si elle n'est PAS attachée à une instance en cours — ne pas oublier de la libérer après suppression d'une instance.",
    },
    {
      question: "[Confusion] Quelle est la différence entre S3 Standard et S3 Glacier ?",
      options: [
        "S3 Standard pour l'archivage froid, Glacier pour les données fréquemment accédées",
        "S3 Standard pour les données fréquemment accédées, Glacier pour l'archivage long terme à bas coût",
        "Glacier est plus rapide que Standard mais plus cher",
        "Il n'y a pas de différence de prix entre Standard et Glacier",
      ],
      answer:
        "S3 Standard pour les données fréquemment accédées, Glacier pour l'archivage long terme à bas coût",
      explanation:
        "S3 Standard = accès immédiat, prix élevé. Glacier = archivage, récupération en minutes à heures, très bon marché. Cas concret : logs applicatifs actifs sur Standard, sauvegardes mensuelles sur Glacier.",
    },
    {
      question: "[Définition → Terme] Quel outil Windows convertit une clé .pem AWS en .ppk pour PuTTY ?",
      options: ["PuTTY Manager", "PuTTYgen", "AWS Key Converter", "OpenSSH"],
      answer: "PuTTYgen",
      explanation:
        "PuTTY n'accepte pas les clés .pem (format OpenSSH). PuTTYgen les convertit en .ppk (format PuTTY). Sur Mac/Linux : ssh -i cle.pem user@IP fonctionne directement sans conversion.",
    },
    {
      question: "[Confusion] Quelle est la commande correcte pour se connecter en SSH à une instance Amazon Linux ?",
      options: [
        "ssh -i cle.pem root@IP_PUBLIQUE",
        "ssh -i cle.pem ec2-user@IP_PUBLIQUE",
        "ssh -i cle.pem admin@IP_PUBLIQUE",
        "ssh -i cle.ppk ubuntu@IP_PUBLIQUE",
      ],
      answer: "ssh -i cle.pem ec2-user@IP_PUBLIQUE",
      explanation:
        "Amazon Linux utilise ec2-user. Ubuntu utilise ubuntu. Debian utilise admin. CentOS utilise centos. .ppk est le format PuTTY, pas OpenSSH. Utiliser root est bloqué par défaut sur les AMI AWS.",
    },
    {
      question: "[Terme → Définition] Qu'est-ce que IAM dans AWS ?",
      options: [
        "Instance Access Manager — gère les connexions SSH aux instances",
        "Identity and Access Management — gère les utilisateurs, rôles et permissions AWS",
        "Infrastructure as a Module — outil d'infrastructure as code",
        "Integrated Application Manager — dashboard de gestion des apps",
      ],
      answer:
        "Identity and Access Management — gère les utilisateurs, rôles et permissions AWS",
      explanation:
        "IAM contrôle qui peut faire quoi sur AWS via Users, Groups, Roles et Policies JSON. Principe du moindre privilège : ne donner que les droits nécessaires. Ne jamais utiliser le compte root en production.",
    },
    {
      question: "[Confusion] Quelle est la différence entre une AMI et un snapshot EBS ?",
      options: [
        "Ils sont identiques — AMI et snapshot désignent la même chose",
        "AMI = image complète d'une instance (OS + config + data) ; snapshot = sauvegarde d'un volume EBS seul",
        "Snapshot = image complète d'une instance ; AMI = sauvegarde d'un volume",
        "AMI est utilisée pour les instances Windows, snapshot pour Linux",
      ],
      answer:
        "AMI = image complète d'une instance (OS + config + data) ; snapshot = sauvegarde d'un volume EBS seul",
      explanation:
        "Une AMI inclut un ou plusieurs snapshots EBS + les métadonnées de lancement. Un snapshot seul ne peut pas lancer une instance directement. Créer une AMI personnalisée pour cloner une instance configurée.",
    },
  ],
  avance: [
    {
      question:
        "[Code → Analyse] Que fait cette commande ?\n`aws s3 sync ./dist s3://mon-bucket --delete --cache-control max-age=31536000`",
      options: [
        "Copie tous les fichiers sans vérifier les modifications et supprime le bucket",
        "Synchronise uniquement les fichiers modifiés, supprime les fichiers absents localement, et ajoute un header cache d'1 an",
        "Crée un nouveau bucket et y copie tous les fichiers",
        "Synchronise et chiffre les fichiers avec une clé KMS",
      ],
      answer:
        "Synchronise uniquement les fichiers modifiés, supprime les fichiers absents localement, et ajoute un header cache d'1 an",
      explanation:
        "sync n'envoie que les différences (plus rapide que cp). --delete supprime sur S3 les fichiers supprimés localement (attention en production). --cache-control optimise le cache CDN CloudFront pour les assets statiques React/Vue.",
    },
    {
      question:
        "[Anti-pattern] Qu'est-ce qui est problématique dans ce fichier de déploiement ?\n`AWS_ACCESS_KEY_ID=AKIA... AWS_SECRET=xxx git push origin main`",
      options: [
        "La commande git push est incorrecte",
        "Les clés AWS sont exposées dans l'historique git — fuite de credentials irréversible",
        "Il manque la région AWS dans la commande",
        "Les clés doivent être en minuscules",
      ],
      answer:
        "Les clés AWS sont exposées dans l'historique git — fuite de credentials irréversible",
      explanation:
        "Une clé AWS dans git est compromise pour toujours — même supprimée, elle reste dans l'historique. AWS détecte les clés publiées sur GitHub et les désactive automatiquement. Solution : variables d'environnement, IAM Roles sur EC2, ou AWS Secrets Manager.",
    },
    {
      question:
        "[Situation → Outil] Ton app Node.js plante aléatoirement sur EC2 et ne redémarre pas. Quel outil résout ce problème ?",
      options: [
        "Nginx — configuré comme proxy inverse pour redémarrer le process",
        "PM2 — process manager Node.js avec redémarrage automatique et monitoring",
        "Systemd seul suffit sans outil supplémentaire",
        "Docker — les conteneurs se relancent automatiquement",
      ],
      answer:
        "PM2 — process manager Node.js avec redémarrage automatique et monitoring",
      explanation:
        "PM2 maintient les process Node.js en vie (--watch, --restart-delay), expose des logs centralisés (pm2 logs), et démarre automatiquement au reboot (pm2 startup). Docker avec --restart=always est une alternative valide mais PM2 est plus léger pour Node.js seul.",
    },
    {
      question:
        "[Architecture] Tu déploies une API Flask + modèle ML (500 Mo). Quelle architecture EC2/S3 est la plus adaptée ?",
      options: [
        "Stocker le modèle directement sur le disque EBS de l'instance, sans S3",
        "Instance g4dn.xlarge avec le modèle stocké sur S3, téléchargé au démarrage via boto3",
        "Utiliser uniquement S3 pour servir l'API directement",
        "Stocker le modèle dans la base de données RDS",
      ],
      answer:
        "Instance g4dn.xlarge avec le modèle stocké sur S3, téléchargé au démarrage via boto3",
      explanation:
        "g4dn.xlarge = GPU T4 adapté à l'inférence ML (moins cher que p3). S3 comme storage central permet de partager le modèle entre instances, facilite les mises à jour sans recréer l'instance. boto3 : `s3.download_file('bucket', 'model.pkl', '/tmp/model.pkl')`.",
    },
    {
      question:
        "[Situation → Multi-concepts] Comment déployer une app Dockerisée sur EC2 avec mise à jour automatique ?",
      options: [
        "Copier le Dockerfile avec FileZilla et relancer manuellement à chaque mise à jour",
        "Pousser l'image sur ECR, SSH sur EC2, docker pull + docker run avec --restart=always",
        "Héberger directement sur S3 en activant le Docker runtime",
        "Utiliser uniquement git clone sans Docker",
      ],
      answer:
        "Pousser l'image sur ECR, SSH sur EC2, docker pull + docker run avec --restart=always",
      explanation:
        "Workflow CI/CD Docker : build → tag → push ECR → pull sur EC2 → run. ECR est le registry privé AWS. --restart=always garantit le redémarrage après reboot. ECS est l'étape suivante pour automatiser entièrement ce processus.",
    },
    {
      question:
        "[Refactoring] Tu te connectes en SSH avec `ssh -i cle.pem ec2-user@IP` mais tu obtiens 'Permission denied'. Quelle est la cause la plus probable ?",
      options: [
        "L'instance est arrêtée",
        "Les permissions de la clé .pem sont trop ouvertes — faire `chmod 400 cle.pem`",
        "Le nom d'utilisateur doit être 'admin' sur Amazon Linux",
        "Il faut utiliser le port 443 au lieu du port 22",
      ],
      answer:
        "Les permissions de la clé .pem sont trop ouvertes — faire `chmod 400 cle.pem`",
      explanation:
        "SSH refuse les clés privées lisibles par d'autres utilisateurs (erreur 'Permissions 0644 are too open'). `chmod 400 cle.pem` = lecture seule pour le propriétaire. C'est la première erreur rencontrée par les débutants sur Linux/Mac. Sur Windows avec PuTTY, ce problème ne se pose pas.",
    },
    {
      question:
        "[Anti-pattern] Ton bucket S3 est configuré en public pour héberger ton site. Quel risque as-tu pris si ton bucket contient aussi des fichiers de config ?",
      options: [
        "Aucun risque — S3 public ne sert que les fichiers HTML/CSS/JS",
        "Tous les fichiers du bucket sont publiquement accessibles — y compris les .env, configs, clés",
        "S3 filtre automatiquement les fichiers sensibles en public",
        "Seul le dossier racine est public, pas les sous-dossiers",
      ],
      answer:
        "Tous les fichiers du bucket sont publiquement accessibles — y compris les .env, configs, clés",
      explanation:
        "Un bucket public expose TOUS ses objets. Séparer les assets publics (CSS/JS/images) dans un bucket dédié. Les configs, clés, backups dans un bucket privé distinct. C'est une des causes principales de fuites de données sur AWS.",
    },
  ],
  expert: [
    {
      question:
        "[Architecture] Tu dois déployer un modèle ML avec pic de 1000 requêtes/min le jour et quasi 0 la nuit. Quelle architecture AWS choisir ?",
      options: [
        "Une instance p3.8xlarge allumée en permanence",
        "Auto Scaling Group de g4dn.xlarge + ALB + mise en veille la nuit via scheduled scaling",
        "Lambda function avec le modèle chargé en mémoire",
        "Uniquement S3 avec des scripts Python hébergés",
      ],
      answer:
        "Auto Scaling Group de g4dn.xlarge + ALB + mise en veille la nuit via scheduled scaling",
      explanation:
        "Auto Scaling adapte le nombre d'instances à la charge (scale out le jour, scale in la nuit). ALB distribue les requêtes. Scheduled scaling = économies prévisibles. p3 permanent = coût fixe maximal. Lambda ne supporte pas les GPU pour l'inférence ML lourde.",
    },
    {
      question:
        "[Ordre de dépendance] Pour déployer une app Flask Dockerisée sur ECS avec accès à S3, dans quel ordre configurer les ressources ?",
      options: [
        "ECS Cluster → ECR → IAM Role → VPC → Docker build",
        "VPC → IAM Role (S3 access) → ECR → Docker build/push → ECS Task Definition → ECS Service",
        "Docker build → S3 → ECS → IAM → VPC",
        "IAM → S3 → Docker → VPC → ECS → ECR",
      ],
      answer:
        "VPC → IAM Role (S3 access) → ECR → Docker build/push → ECS Task Definition → ECS Service",
      explanation:
        "Dépendances : VPC précède tout (réseau). IAM Role précède ECS Task (la tâche a besoin du rôle pour accéder à S3). ECR précède le push. L'image doit exister dans ECR avant de créer la Task Definition. Le Service référence la Task Definition.",
    },
    {
      question:
        "[Nommage inversé] Quel service AWS a ces propriétés : entraînement géré, déploiement en endpoint scalable, stockage des artefacts sur S3, facturation à la seconde, intégré à Jupyter ?",
      options: ["EC2 avec AMI Deep Learning", "SageMaker", "ECS avec GPU", "Lambda ML"],
      answer: "SageMaker",
      explanation:
        "SageMaker est le service ML managé AWS : notebooks Jupyter hébergés, entraînement distribué, déploiement en endpoint auto-scalable, intégration native S3 pour les datasets et modèles. EC2 Deep Learning AMI est plus flexible mais nécessite plus de gestion manuelle.",
    },
    {
      question:
        "[Architecture] Quelle est la différence entre ECS et EKS pour l'orchestration de conteneurs ?",
      options: [
        "ECS = Kubernetes managé AWS ; EKS = orchestrateur propriétaire AWS",
        "ECS = orchestrateur propriétaire AWS, plus simple ; EKS = Kubernetes managé, plus flexible pour les architectures complexes",
        "ECS et EKS sont identiques — seul le prix diffère",
        "EKS est uniquement pour les conteneurs Windows, ECS pour Linux",
      ],
      answer:
        "ECS = orchestrateur propriétaire AWS, plus simple ; EKS = Kubernetes managé, plus flexible pour les architectures complexes",
      explanation:
        "ECS est natif AWS, simple à configurer, idéal pour démarrer avec les conteneurs. EKS = Kubernetes standard, portable (évite le vendor lock-in), indispensable si l'équipe maîtrise déjà K8s ou pour des microservices complexes. ECS Fargate = serverless, pas de gestion de serveurs sous-jacents.",
    },
    {
      question:
        "[Situation → Multi-concepts] Pour un pipeline ML complet (données → entraînement → déploiement), quel combo de services AWS utiliser ?",
      options: [
        "S3 uniquement pour tout stocker et exécuter",
        "S3 (données/artefacts) + EC2 Spot p3 (entraînement) + ECR (image Docker) + ECS/SageMaker (inférence) + CloudWatch (monitoring)",
        "RDS + EC2 standard + Lambda uniquement",
        "EC2 permanente pour tout faire sans S3 ni conteneurs",
      ],
      answer:
        "S3 (données/artefacts) + EC2 Spot p3 (entraînement) + ECR (image Docker) + ECS/SageMaker (inférence) + CloudWatch (monitoring)",
      explanation:
        "Architecture ML optimale : S3 = source de vérité pour datasets et modèles. Spot p3 = entraînement à -90%. ECR = versionning des images de serving. ECS/SageMaker = déploiement scalable. CloudWatch = alertes si latence ou erreurs. Chaque service a un rôle précis — ne pas tout mettre sur une seule instance.",
    },
    {
      question:
        "[Architecture] Quel est le risque principal d'un déploiement direct par `git pull` sur une instance EC2 de production sans pipeline CI/CD ?",
      options: [
        "Git pull est trop lent pour la production",
        "Déploiement non reproductible, risque de déployer du code non testé, pas de rollback facile, downtime pendant l'installation des dépendances",
        "Git n'est pas compatible avec EC2",
        "Le seul risque est la taille du repo git",
      ],
      answer:
        "Déploiement non reproductible, risque de déployer du code non testé, pas de rollback facile, downtime pendant l'installation des dépendances",
      explanation:
        "Sans CI/CD : pas de tests automatiques avant déploiement, pas de version taggée, rollback = git reset manuel risqué, npm install en production peut casser. Solution pro : CodePipeline + CodeDeploy (ou GitHub Actions) → déploiement blue/green sans downtime + rollback automatique.",
    },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────
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

const BackendInterviewAWS = () => {
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

export default BackendInterviewAWS;