// src/projects/aws/Page_AWS.js
import React, { useState, useEffect } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Vue d'ensemble — AWS Pratique : EC2, S3, Déploiement & Opérations",
    answer:
      "◆ **Bloc 1** : Lancer une instance EC2 — AMI, type, Key Pair, Security Group, connexion SSH ◆ **Bloc 2** : Opérations quotidiennes EC2 — Start/Stop, Elastic IP, surveillance CPU/RAM/disque ◆ **Bloc 3** : S3 en pratique — créer un bucket, uploader, contrôler les accès, CLI aws s3 ◆ **Bloc 4** : Déployer un projet depuis son PC — SCP, FileZilla, git pull, npm/pip install ◆ **Bloc 5** : Mettre à jour une app en production — PuTTY, recharger Nginx, redémarrer PM2 ◆ **Bloc 6** : Surveiller & diagnostiquer — logs, htop, df, netstat, CloudWatch ◆ **Bloc 7** : Sécuriser — Security Groups, chmod 400, IAM roles, .env sur l'instance",
  },
  {
    question: "Créer une instance EC2 — Les 7 étapes pas à pas",
    answer:
      "◆ **Étape 1** : Console AWS → EC2 → Launch Instance → donner un nom ◆ **Étape 2** : Choisir l'AMI — Amazon Linux 2023 (`ec2-user`) ou Ubuntu 22.04 (`ubuntu`) ◆ **Étape 3** : Type d'instance — `t2.micro` pour le Free Tier, `t3.small` pour un projet réel ◆ **Étape 4** : Key Pair — créer une paire `.pem`, la télécharger une seule fois et la conserver ◆ **Étape 5** : Security Group — ouvrir SSH port 22 depuis ton IP, HTTP port 80 si serveur web ◆ **Étape 6** : Storage EBS — 8 Go minimum, augmenter si l'app est lourde ◆ **Étape 7** : Launch → copier l'IPv4 publique affiché dans la console ⚠️ La clé `.pem` ne se télécharge qu'UNE seule fois — la stocker hors du dépôt git",
  },
  {
    question: "Se connecter en SSH — Mac/Linux vs Windows",
    answer:
      "◆ **Mac/Linux** : `chmod 400 cle.pem` (droits obligatoires) puis `ssh -i cle.pem ec2-user@IP` ◆ **Utilisateurs selon AMI** : Amazon Linux → `ec2-user` / Ubuntu → `ubuntu` / Debian → `admin` ◆ **Windows PuTTY** : convertir `.pem` → `.ppk` avec PuTTYgen, puis configurer Session (IP) + Auth (clé .ppk) ◆ **Windows PowerShell** : depuis Windows 10 — `ssh -i cle.pem ec2-user@IP` fonctionne nativement ◆ **Erreur fréquente** : `Permission denied` = permissions .pem trop ouvertes → `chmod 400 cle.pem` ⚠️ `Permission denied (publickey)` sur Ubuntu = utiliser `ubuntu` et non `ec2-user`",
  },
  {
    question: "Opérations quotidiennes EC2 — Surveiller l'instance",
    answer:
      "◆ **CPU & RAM** : `htop` — vue temps réel des processus, charge CPU, mémoire consommée ◆ **Disque** : `df -h` — espace utilisé/disponible sur chaque partition ◆ **Espace par dossier** : `du -sh /var/log/*` — identifier ce qui remplit le disque ◆ **Ports ouverts** : `netstat -tulnp` — vérifier quelles apps écoutent sur quels ports ◆ **Logs Nginx** : `tail -f /var/log/nginx/error.log` — suivre les erreurs en temps réel ◆ **Logs app** : `journalctl -u monapp -f` ou `pm2 logs` ◆ **Uptime** : `uptime` — depuis combien de temps l'instance tourne ⚠️ Disque plein = app qui plante silencieusement — surveiller `df -h` régulièrement",
  },
  {
    question: "Gérer les services sur EC2 — Nginx, PM2, Systemd",
    answer:
      "◆ **Nginx démarrage** : `sudo systemctl start nginx` / `sudo systemctl enable nginx` (démarrage auto au reboot) ◆ **Tester la config** : `sudo nginx -t` — TOUJOURS avant reload ◆ **Recharger sans coupure** : `sudo systemctl reload nginx` ◆ **PM2 Node.js** : `pm2 start app.js --name monapp` → `pm2 status` → `pm2 restart monapp` → `pm2 logs` ◆ **PM2 au reboot** : `pm2 startup` → copier-coller la commande générée → `pm2 save` ◆ **Python/Flask** : `gunicorn -w 4 app:app --bind 0.0.0.0:5000 --daemon` ◆ **Reboot** : `sudo reboot` — l'instance redémarre, les services `enable`'s redémarrent automatiquement ⚠️ Sans `pm2 startup` + `pm2 save`, ton app Node.js ne redémarre pas après reboot",
  },
  {
    question: "S3 — Créer un bucket et uploader des fichiers",
    answer:
      "◆ **Créer un bucket** : Console S3 → Create bucket → nom unique mondial → choisir la région → désactiver Block Public Access si site statique ◆ **Uploader via console** : glisser-déposer dans l'interface web ◆ **Uploader via CLI** : `aws s3 cp ./monFichier.zip s3://mon-bucket/` ◆ **Uploader un dossier** : `aws s3 cp ./dist/ s3://mon-bucket/ --recursive` ◆ **Synchroniser** : `aws s3 sync ./dist s3://mon-bucket --delete` — n'envoie que les fichiers modifiés ◆ **Lister** : `aws s3 ls s3://mon-bucket/` ◆ **Supprimer** : `aws s3 rm s3://mon-bucket/fichier.zip` ⚠️ `--delete` dans sync supprime sur S3 les fichiers absents localement — toujours vérifier avant",
  },
  {
    question: "Déployer un projet depuis son PC vers EC2",
    answer:
      "◆ **Workflow complet** : 1) Préparer l'archive locale 2) Transférer 3) Installer 4) Démarrer ◆ **SCP (terminal)** : `scp -i cle.pem -r ./monapp ec2-user@IP:/home/ec2-user/app` ◆ **FileZilla** : Site Manager → SFTP → IP EC2 → clé .ppk → glisser les fichiers ◆ **Sur EC2 après transfert** : `cd /home/ec2-user/app && npm install --production && pm2 restart monapp` ◆ **Alt. Git** : sur EC2 — `git clone https://github.com/user/repo.git` puis `git pull origin main` pour les mises à jour ◆ **Alt. S3** : `aws s3 cp s3://mon-bucket/app.zip . && unzip app.zip` ⚠️ Ne jamais transférer les fichiers `.env` via SCP/FileZilla — les créer directement sur l'instance via nano",
  },
  {
    question: "Mettre à jour une app en production — Opérations courantes",
    answer:
      "◆ **Via git** : SSH sur EC2 → `cd /home/ec2-user/app` → `git pull origin main` → `npm install` → `pm2 restart monapp` ◆ **Via SCP** : transférer les nouveaux fichiers → SSH → `pip install -r requirements.txt` → `pm2 restart` ◆ **Rechargement Nginx** : modifier la config → `sudo nginx -t` → `sudo systemctl reload nginx` ◆ **Vérifier le résultat** : `curl http://localhost:80` ou `pm2 status` ◆ **Rollback rapide** : `git log --oneline` → `git checkout COMMIT_ID` → redémarrer ◆ **Zero downtime Node.js** : `pm2 reload monapp` (graceful reload sans coupure) ⚠️ `pm2 restart` coupe brièvement le service — utiliser `pm2 reload` en production",
  },
  {
    question: "S3 — Hébergement statique et Bucket Policy",
    answer:
      "◆ **Activer l'hébergement** : S3 bucket → Properties → Static website hosting → activer → définir `index.html` et `error.html` ◆ **URL générée** : `http://bucket-name.s3-website.eu-west-3.amazonaws.com` ◆ **Bucket Policy publique** : `{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::bucket-name/*\"}` ◆ **Déployer un build React** : `npm run build` → `aws s3 sync ./build s3://mon-bucket --delete` ◆ **CloudFront** : CDN devant S3 — HTTPS, cache mondial, URL personnalisée ◆ **Pre-signed URL** : `aws s3 presign s3://bucket/fichier --expires-in 3600` — accès privé temporaire ⚠️ S3 statique ne supporte pas le routing côté serveur — configurer `error.html` = `index.html` pour les SPA",
  },
  {
    question: "Nginx — Configuration reverse proxy",
    answer:
      "◆ **Rôle** : Nginx reçoit les requêtes sur le port 80/443 et les redirige vers l'app interne (5000, 3000, 8000) ◆ **Fichier config** : `/etc/nginx/sites-available/monapp` ◆ **Config minimale** : `server { listen 80; server_name IP_ou_domaine; location / { proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; } }` ◆ **Activer** : `sudo ln -s /etc/nginx/sites-available/monapp /etc/nginx/sites-enabled/` ◆ **HTTPS Let's Encrypt** : `sudo certbot --nginx -d mondomaine.com` ◆ **Test puis reload** : `sudo nginx -t && sudo systemctl reload nginx` ⚠️ Ne jamais faire reload sans `nginx -t` — une erreur de syntaxe coupe tout le serveur web",
  },
  {
    question: "Security Groups — Ouvrir les bons ports",
    answer:
      "◆ **Règles Inbound** : définissent ce qui ENTRE dans l'instance — Type, Port, Source ◆ **SSH** : TCP port 22, Source = Mon IP uniquement (jamais 0.0.0.0/0) ◆ **HTTP** : TCP port 80, Source = 0.0.0.0/0 (tout Internet) ◆ **HTTPS** : TCP port 443, Source = 0.0.0.0/0 ◆ **App custom** : TCP port 3000/5000/8000, Source = 0.0.0.0/0 si public ◆ **Outbound** : tout ouvert par défaut ◆ **Modifier** : Console EC2 → Security Groups → Edit inbound rules ◆ **Erreur fréquente** : `Connection refused` ou `timeout` = port pas ouvert dans le Security Group ⚠️ Le port 22 ouvert sur 0.0.0.0/0 expose l'instance aux attaques brute-force — toujours restreindre à son IP",
  },
  {
    question: "Variables d'environnement & Secrets sur EC2",
    answer:
      "◆ **Fichier .env sur l'instance** : `nano /home/ec2-user/app/.env` → taper les variables → Ctrl+O → Ctrl+X ◆ **Contenu typique** : `DATABASE_URL=postgresql://...`, `API_KEY=xxx`, `PORT=3000` ◆ **Charger dans PM2** : `pm2 start app.js --env production` ou via `ecosystem.config.js` ◆ **Charger dans gunicorn** : `source .env && gunicorn app:app` ou utiliser `python-dotenv` ◆ **AWS Secrets Manager** : `aws secretsmanager get-secret-value --secret-id prod/myapp` via boto3/SDK ◆ **Ne JAMAIS** : transférer .env via SCP/FileZilla/git — créer le fichier directement sur l'instance ⚠️ Un `.env` commité dans git = toutes les credentials exposées dans l'historique pour toujours",
  },
  {
    question: "Elastic IP & Nom de domaine sur EC2",
    answer:
      "◆ **Problème** : l'IP publique d'EC2 change à chaque Stop/Start — les DNS/configs externes se cassent ◆ **Solution** : Elastic IP = IP statique attachée au compte, pas à l'instance ◆ **Allocation** : Console EC2 → Elastic IPs → Allocate → Associate to instance ◆ **Coût** : gratuit si attachée à une instance en cours — facturée si non utilisée ◆ **Nom de domaine** : Route 53 → Create Record → A record → saisir l'Elastic IP ◆ **Nginx** : mettre à jour `server_name mondomaine.com` ◆ **HTTPS** : `sudo certbot --nginx -d mondomaine.com --email toi@email.com --agree-tos` ⚠️ Toujours libérer une Elastic IP après avoir supprimé l'instance — sinon facturation continue",
  },
  {
    question: "Sauvegardes & AMI personnalisée",
    answer:
      "◆ **AMI (Amazon Machine Image)** : snapshot complet de l'instance — OS + config + données + dépendances installées ◆ **Créer une AMI** : Console EC2 → sélectionner instance → Actions → Image → Create image ◆ **Usage** : cloner l'instance configurée en 5 min au lieu de tout réinstaller ◆ **Snapshot EBS** : sauvegarde d'un volume seul — moins complet qu'une AMI ◆ **Backup S3 via cron** : `crontab -e` → `0 2 * * * tar -czf /tmp/backup.tar.gz /home/ec2-user/app && aws s3 cp /tmp/backup.tar.gz s3://backups/$(date +%Y%m%d).tar.gz` ◆ **Lifecycle Manager** : automatiser les snapshots EBS ⚠️ Les AMI sont stockées sur S3 en interne et facturées — supprimer les AMI obsolètes",
  },
  {
    question: "CloudWatch — Monitoring et alertes EC2",
    answer:
      "◆ **Métriques de base** (gratuites) : CPUUtilization, NetworkIn/Out, DiskReadOps — dans la console EC2 → Monitoring ◆ **Agent CloudWatch** : installer pour avoir RAM et disque — `sudo yum install amazon-cloudwatch-agent -y` ◆ **Créer une alarme** : CloudWatch → Alarms → Create → CPUUtilization > 80% pendant 5 min → SNS → email ◆ **CloudWatch Logs** : envoyer les logs app → `tail` depuis la console, sans SSH ◆ **Dashboard** : regrouper CPU, RAM, requêtes/s sur un seul écran ◆ **Logs Insights** : `fields @timestamp | filter @message like /ERROR/ | sort @timestamp desc` ⚠️ Sans l'agent, RAM et disque ne sont PAS visibles dans CloudWatch — seulement CPU et réseau",
  },
];

const questions = {
  moyen: [
    {
      question:
        "[Pratique SSH] Tu viens de créer une instance Amazon Linux. Quelle est la commande SSH correcte avec ta clé `projet.pem` et l'IP `54.12.34.56` ?",
      options: [
        "ssh -i projet.pem root@54.12.34.56",
        "ssh -i projet.pem ec2-user@54.12.34.56",
        "ssh projet.pem ubuntu@54.12.34.56",
        "ssh -key projet.pem admin@54.12.34.56",
      ],
      answer: "ssh -i projet.pem ec2-user@54.12.34.56",
      explanation:
        "Amazon Linux utilise ec2-user. Ubuntu utilise ubuntu, Debian utilise admin. L'option -i spécifie la clé privée. Sur Mac/Linux, il faut d'abord faire chmod 400 projet.pem sinon SSH refuse la connexion avec 'Permissions too open'.",
    },
    {
      question:
        "[Pratique Security Group] Ton app Node.js tourne sur le port 3000. Tu l'atteins en local (curl localhost:3000 sur EC2) mais pas depuis ton navigateur. Que faire ?",
      options: [
        "Redémarrer l'instance EC2",
        "Ouvrir le port 3000 dans le Security Group — Inbound rule : TCP 3000 depuis 0.0.0.0/0",
        "Changer le port de l'app vers le port 80",
        "Désactiver le pare-feu Linux avec iptables -F",
      ],
      answer:
        "Ouvrir le port 3000 dans le Security Group — Inbound rule : TCP 3000 depuis 0.0.0.0/0",
      explanation:
        "Le Security Group est le pare-feu AWS externe à l'instance. 'Connection refused' depuis l'extérieur alors que l'app répond en local = port fermé dans le SG. Ajouter une règle Inbound TCP port 3000 source 0.0.0.0/0. Alternative professionnelle : Nginx sur le port 80 qui proxy vers 3000.",
    },
    {
      question:
        "[Pratique S3 CLI] Quelle commande copie le dossier `./dist` vers le bucket S3 `mon-site` en n'envoyant que les fichiers modifiés et en supprimant les anciens ?",
      options: [
        "aws s3 cp ./dist s3://mon-site --recursive",
        "aws s3 sync ./dist s3://mon-site --delete",
        "aws s3 upload ./dist s3://mon-site",
        "aws s3 push ./dist s3://mon-site --force",
      ],
      answer: "aws s3 sync ./dist s3://mon-site --delete",
      explanation:
        "sync compare les fichiers locaux et distants, n'envoie que les différences. --delete supprime sur S3 les fichiers absents localement. aws s3 cp --recursive tout-copie sans comparer. 'upload' et 'push' n'existent pas dans la CLI AWS S3.",
    },
    {
      question:
        "[Pratique déploiement] Tu veux transférer ton dossier `./api` depuis ton PC vers `/home/ec2-user/api` sur EC2. Quelle commande SCP utiliser ?",
      options: [
        "scp ./api ec2-user@IP:/home/ec2-user/",
        "scp -i cle.pem -r ./api ec2-user@IP:/home/ec2-user/",
        "scp -r ./api ec2-user@IP:~/api --key cle.pem",
        "ftp -i cle.pem ./api ec2-user@IP:/home/ec2-user/",
      ],
      answer: "scp -i cle.pem -r ./api ec2-user@IP:/home/ec2-user/",
      explanation:
        "-i cle.pem spécifie la clé SSH. -r copie récursivement (dossier entier). Sans -i, SCP ne sait pas avec quelle clé s'authentifier. Sans -r, SCP ne copie que les fichiers du niveau racine. ftp est un protocole différent qui ne supporte pas les clés .pem.",
    },
    {
      question:
        "[Pratique PM2] Tu viens de déployer ton app Node.js sur EC2. Quelle séquence de commandes la démarre et garantit qu'elle redémarre après reboot ?",
      options: [
        "node app.js & — suffisant pour rester en arrière-plan",
        "pm2 start app.js --name monapp → pm2 startup → copier la commande générée → pm2 save",
        "pm2 start app.js → reboot — PM2 redémarre automatiquement sans setup",
        "sudo systemctl start app.js",
      ],
      answer:
        "pm2 start app.js --name monapp → pm2 startup → copier la commande générée → pm2 save",
      explanation:
        "pm2 start lance l'app. pm2 startup génère la commande systemd à copier-coller pour activer le démarrage automatique. pm2 save enregistre la liste des process à relancer. Sans pm2 save, la liste est perdue au reboot. node app.js & s'arrête à la fermeture du terminal SSH.",
    },
    {
      question:
        "[Pratique monitoring] Ton instance EC2 est lente. Quelle commande donne une vue temps réel de la consommation CPU et mémoire par processus ?",
      options: [
        "df -h",
        "htop",
        "netstat -tulnp",
        "tail -f /var/log/syslog",
      ],
      answer: "htop",
      explanation:
        "htop affiche en temps réel les processus triés par consommation CPU/RAM, la charge système et la mémoire totale. df -h montre l'espace disque. netstat -tulnp liste les ports ouverts. tail -f suit les logs. Pour identifier un process qui bouffe les ressources : htop est la première commande à lancer.",
    },
    {
      question:
        "[Confusion Stop vs Terminate] Tu veux éteindre ton EC2 pour la nuit sans perdre tes données. Quelle action choisir dans la console AWS ?",
      options: [
        "Terminate — arrête l'instance et conserve les données",
        "Stop — arrête l'instance, conserve l'EBS, stoppe la facturation CPU",
        "Hibernate — met en veille et arrête la facturation entièrement",
        "Reboot — équivalent à Stop pour économiser la nuit",
      ],
      answer:
        "Stop — arrête l'instance, conserve l'EBS, stoppe la facturation CPU",
      explanation:
        "Stop = pause. L'EBS (disque) reste intact et continue d'être facturé au stockage. La facturation CPU/mémoire s'arrête. Terminate = destruction irréversible de l'instance ET du disque (sauf si le volume EBS a DeleteOnTermination désactivé). Reboot redémarre sans arrêter.",
    },
    {
      question:
        "[Pratique Nginx] Tu modifies la config Nginx et veux appliquer les changements. Dans quel ordre exécuter ces commandes ?",
      options: [
        "sudo systemctl restart nginx — directement, sans tester",
        "sudo nginx -t → si OK → sudo systemctl reload nginx",
        "sudo systemctl stop nginx → modifier → sudo systemctl start nginx",
        "sudo nginx --check → sudo nginx --reload",
      ],
      answer: "sudo nginx -t → si OK → sudo systemctl reload nginx",
      explanation:
        "sudo nginx -t valide la syntaxe sans rien appliquer — si erreur, nginx indique la ligne problématique. reload applique la config sans couper les connexions actives. restart coupe toutes les connexions. Faire restart sans tester = risque de coupure si la config est invalide.",
    },
    {
      question:
        "[Pratique .pem] Tu es sur Mac et tu obtiens 'WARNING: UNPROTECTED PRIVATE KEY FILE' lors de ta connexion SSH. Quelle commande résout le problème ?",
      options: [
        "mv cle.pem cle.ppk",
        "chmod 400 cle.pem",
        "sudo chmod 777 cle.pem",
        "chown root cle.pem",
      ],
      answer: "chmod 400 cle.pem",
      explanation:
        "SSH refuse les clés lisibles par d'autres utilisateurs pour des raisons de sécurité. chmod 400 = lecture seule pour le propriétaire uniquement. 777 aggraverait le problème (tout le monde peut lire). La conversion .ppk est pour PuTTY sur Windows, pas pour SSH natif Mac/Linux.",
    },
    {
      question:
        "[Pratique Elastic IP] Ton app est accessible via l'IP publique EC2 mais après chaque Stop/Start l'IP change. Quelle est la solution AWS ?",
      options: [
        "Configurer l'instance en mode Dedicated Host",
        "Allouer une Elastic IP et l'associer à l'instance",
        "Utiliser une Reserved Instance — l'IP ne change plus",
        "Activer Enhanced Networking sur l'instance",
      ],
      answer: "Allouer une Elastic IP et l'associer à l'instance",
      explanation:
        "Une Elastic IP est une IP publique statique attachée au compte AWS, pas à l'instance. Elle reste la même même après Stop/Start. Elle est gratuite tant qu'elle est attachée à une instance active. Si l'instance est stoppée ou si l'Elastic IP n'est pas associée, AWS facture ~3$/mois.",
    },
  ],
  avance: [
    {
      question:
        "[Scénario déploiement complet] Tu déploies une API Flask sur EC2 Ubuntu. Mets les étapes dans le bon ordre :\n1) pip install -r requirements.txt  2) scp -i cle.pem -r ./api ubuntu@IP:~/  3) gunicorn -w 4 app:app --bind 0.0.0.0:5000  4) ssh -i cle.pem ubuntu@IP  5) configurer Nginx reverse proxy",
      options: [
        "1 → 2 → 3 → 4 → 5",
        "2 → 4 → 1 → 3 → 5",
        "4 → 2 → 1 → 3 → 5",
        "2 → 1 → 4 → 5 → 3",
      ],
      answer: "2 → 4 → 1 → 3 → 5",
      explanation:
        "Ordre logique : SCP transfère les fichiers depuis le PC local. SSH permet d'entrer sur l'instance. pip install installe les dépendances. gunicorn lance l'app. Nginx est configuré en dernier pour proxier les requêtes. On ne peut pas faire pip install avant d'avoir les fichiers sur l'instance.",
    },
    {
      question:
        "[Analyse commande] Que fait exactement cette commande ?\n`aws s3 sync ./build s3://mon-site-prod --delete --cache-control max-age=86400`",
      options: [
        "Copie tous les fichiers du build et supprime le bucket entier",
        "Synchronise uniquement les fichiers modifiés, supprime sur S3 ceux absents localement, définit un cache HTTP de 24h sur tous les fichiers",
        "Crée un nouveau bucket mon-site-prod et y upload tout",
        "Synchronise et chiffre les fichiers avec SSE-S3",
      ],
      answer:
        "Synchronise uniquement les fichiers modifiés, supprime sur S3 ceux absents localement, définit un cache HTTP de 24h sur tous les fichiers",
      explanation:
        "sync = delta only (plus rapide que cp). --delete supprime sur S3 les fichiers qui n'existent plus localement. --cache-control max-age=86400 ajoute le header HTTP Cache-Control sur chaque objet S3, indiquant aux CDN/navigateurs de cacher 24h (86400 secondes). Attention : --delete peut supprimer des fichiers utiles si le dossier local n'est pas complet.",
    },
    {
      question:
        "[Diagnostic production] Ton app Node.js renvoie une erreur 502 Bad Gateway depuis Nginx. Quelle est la cause la plus probable et comment diagnostiquer ?",
      options: [
        "Nginx est mal configuré — relancer nginx",
        "L'app Node.js est morte ou ne répond pas sur son port — vérifier avec `pm2 status` et `curl localhost:3000`",
        "Le Security Group bloque le port 80",
        "L'IP publique de l'instance a changé",
      ],
      answer:
        "L'app Node.js est morte ou ne répond pas sur son port — vérifier avec `pm2 status` et `curl localhost:3000`",
      explanation:
        "502 Bad Gateway = Nginx tourne mais ne reçoit pas de réponse du backend. Nginx lui-même fonctionne. Diagnostic : pm2 status (l'app est-elle online ?) puis curl localhost:3000 (répond-elle en local ?). Si pm2 status = errored, pm2 logs pour voir l'erreur. Ensuite pm2 restart. Le SG ne bloquerait pas le port 80 si Nginx répond (même avec 502).",
    },
    {
      question:
        "[Sécurité pratique] Tu trouves le fichier `.env` dans ton dépôt GitHub après un push accidentel. Quelles actions mener dans l'ordre ?",
      options: [
        "Supprimer le commit et c'est réglé — GitHub efface les données",
        "Révoquer immédiatement les clés/credentials exposés → ajouter .env au .gitignore → purger l'historique git → générer de nouvelles clés",
        "Rendre le dépôt privé — les clés ne sont plus visibles",
        "Changer uniquement le mot de passe du compte GitHub",
      ],
      answer:
        "Révoquer immédiatement les clés/credentials exposés → ajouter .env au .gitignore → purger l'historique git → générer de nouvelles clés",
      explanation:
        "Une clé dans git est compromise définitivement — même supprimée, elle reste dans l'historique et des bots scannent GitHub en permanence. Ordre : 1) Révoquer (AWS Console → IAM → Désactiver la clé). 2) .gitignore. 3) git filter-branch ou BFG pour purger l'historique. 4) Générer de nouvelles clés. Rendre le dépôt privé ne suffit pas — les bots ont peut-être déjà crawlé.",
    },
    {
      question:
        "[Pratique User Data] Tu veux qu'une nouvelle instance EC2 installe automatiquement Node.js et clone ton repo au premier démarrage. Où configurer ça ?",
      options: [
        "Dans un fichier .bashrc sur l'instance après connexion SSH",
        "Dans le champ User Data lors de la création de l'instance — script bash exécuté une seule fois au premier boot",
        "Dans la Bucket Policy S3 associée à l'instance",
        "Dans les tags de l'instance EC2",
      ],
      answer:
        "Dans le champ User Data lors de la création de l'instance — script bash exécuté une seule fois au premier boot",
      explanation:
        "User Data est un script bash exécuté avec les droits root au premier démarrage de l'instance. Exemple : `#!/bin/bash\\ncurl -fsSL https://rpm.nodesource.com/setup_18.x | bash -\\nyum install -y nodejs\\ngit clone https://github.com/user/repo.git /home/ec2-user/app`. Idéal pour les AMI personnalisées ou l'Auto Scaling. .bashrc est exécuté à chaque connexion interactive, pas au boot.",
    },
    {
      question:
        "[Anti-pattern] Tu ouvres le port SSH 22 avec Source = 0.0.0.0/0 dans ton Security Group. Quel est le risque concret ?",
      options: [
        "Aucun risque si la clé .pem est sécurisée",
        "L'instance est exposée à des attaques brute-force SSH permanentes — journaux remplis, charge CPU, risque d'exploitation si une vulnérabilité SSH existe",
        "Le port 22 ouvert sur 0.0.0.0/0 est bloqué automatiquement par AWS",
        "Le seul risque est la consommation de bande passante réseau",
      ],
      answer:
        "L'instance est exposée à des attaques brute-force SSH permanentes — journaux remplis, charge CPU, risque d'exploitation si une vulnérabilité SSH existe",
      explanation:
        "Des scanners automatiques tentent des connexions SSH sur toutes les IPs publiques en permanence. Même avec une clé .pem, cela génère des milliers de tentatives par jour dans /var/log/secure. Bonne pratique : Source = Votre IP uniquement. Pour les équipes : utiliser un VPN ou AWS Systems Manager Session Manager pour SSH sans exposer le port 22.",
    },
    {
      question:
        "[Pratique mise à jour] Ton équipe pousse une mise à jour. La procédure actuelle est `git pull && pm2 restart`. Quel est le problème et quelle amélioration proposer ?",
      options: [
        "git pull est trop lent — utiliser SCP à la place",
        "pm2 restart coupe brièvement le service — utiliser pm2 reload pour un rechargement sans coupure + tester avant de pousser en prod",
        "Il faut d'abord arrêter Nginx avant de faire git pull",
        "Aucun problème — c'est la procédure recommandée AWS",
      ],
      answer:
        "pm2 restart coupe brièvement le service — utiliser pm2 reload pour un rechargement sans coupure + tester avant de pousser en prod",
      explanation:
        "pm2 restart = arrêt brutal puis redémarrage = quelques secondes de downtime. pm2 reload = graceful reload, les requêtes en cours sont terminées avant que les nouveaux workers prennent le relais = 0 downtime. Amélioration supplémentaire : GitHub Actions qui teste automatiquement avant de déployer, et rollback automatique en cas d'échec.",
    },
    {
      question:
        "[Diagnostic disque] La commande `df -h` affiche `/dev/xvda1  8G  7.9G  0 100%`. Quelle est la priorité et comment diagnostiquer la cause ?",
      options: [
        "Redémarrer l'instance — le disque se libère automatiquement",
        "Identifier les dossiers volumineux avec `du -sh /* | sort -h`, purger les logs ou agrandir le volume EBS",
        "Supprimer tous les fichiers dans /tmp",
        "Désactiver les logs Nginx pour libérer de l'espace",
      ],
      answer:
        "Identifier les dossiers volumineux avec `du -sh /* | sort -h`, purger les logs ou agrandir le volume EBS",
      explanation:
        "Disque à 100% = app qui plante silencieusement (impossible d'écrire des logs, des sessions, des uploads). Diagnostic : du -sh /var/log/* (logs non rotatés), du -sh /home/ec2-user/* (vieux builds). Actions : logrotate, supprimer les anciennes versions, ou agrandir l'EBS depuis la console AWS (Actions → Modify Volume) sans recréer l'instance.",
    },
  ],
  expert: [
    {
      question:
        "[Architecture déploiement zéro downtime] Tu dois mettre à jour une API Node.js sur EC2 sans interruption de service. Quelle approche combiner ?",
      options: [
        "pm2 restart monapp — rapide et suffisant",
        "ALB + deux instances EC2 : déployer sur la seconde, basculer l'ALB, vérifier, supprimer l'ancienne — Blue/Green deployment",
        "Arrêter Nginx pendant la mise à jour pour éviter les requêtes en cours",
        "Utiliser git pull directement sur l'instance de production",
      ],
      answer:
        "ALB + deux instances EC2 : déployer sur la seconde, basculer l'ALB, vérifier, supprimer l'ancienne — Blue/Green deployment",
      explanation:
        "Blue/Green : environnement 'green' = nouvelle version. ALB bascule le trafic du 'blue' vers le 'green'. Si problème : rollback instantané en rebasculant l'ALB. pm2 reload est une amélioration mais reste sur la même instance. Pour une API critique, Blue/Green + ALB est le standard. AWS CodeDeploy automatise ce processus.",
    },
    {
      question:
        "[Architecture complète] Tu construis une architecture pour un site React + API Node.js + BDD. Quel setup AWS sur une seule instance EC2 t3.medium ?",
      options: [
        "React, Node.js et PostgreSQL sur le même serveur — Nginx gère tout sur le port 80",
        "React buildé sur S3 (statique), API Node.js sur EC2 (port 3000 proxié par Nginx sur 80/443), PostgreSQL sur RDS (subnet privé) — séparation des responsabilités",
        "Tout sur EC2 avec Docker Compose — un conteneur par service",
        "React et Node.js sur EC2, S3 uniquement pour les images uploadées par les utilisateurs",
      ],
      answer:
        "React buildé sur S3 (statique), API Node.js sur EC2 (port 3000 proxié par Nginx sur 80/443), PostgreSQL sur RDS (subnet privé) — séparation des responsabilités",
      explanation:
        "Chaque composant à sa place : S3 = hosting statique gratuit/scalable, pas besoin d'EC2 pour le front. EC2 = API dynamique. RDS = base de données managée (sauvegardes auto, Multi-AZ). Nginx = SSL termination + reverse proxy. Cette séparation permet de scaler chaque couche indépendamment et sécurise la BDD dans un subnet privé non accessible depuis Internet.",
    },
    {
      question:
        "[Ordre de dépendance] Tu construis un pipeline CI/CD GitHub Actions pour déployer automatiquement sur EC2 à chaque push sur main. Dans quel ordre configurer les éléments ?",
      options: [
        "GitHub Actions YAML → SSH key → EC2 → Tests → Deploy",
        "EC2 lancée et configurée → clé SSH dans GitHub Secrets → .github/workflows/deploy.yml avec jobs : tests → build → scp/ssh deploy → pm2 reload",
        "PM2 → Nginx → EC2 → GitHub → SSH",
        "GitHub Actions → EC2 → Tests → SSH → pm2",
      ],
      answer:
        "EC2 lancée et configurée → clé SSH dans GitHub Secrets → .github/workflows/deploy.yml avec jobs : tests → build → scp/ssh deploy → pm2 reload",
      explanation:
        "L'EC2 doit exister et être configurée avant de déployer dessus. La clé SSH privée dans GitHub Secrets permet au workflow de se connecter. Le YAML orchestre : tests d'abord (fail fast), puis build, puis déploiement via SSH/SCP, puis pm2 reload. Sans tests en amont, on déploie potentiellement du code cassé.",
    },
    {
      question:
        "[Diagnostic avancé] `curl http://IP` ne répond pas. Voici ce que tu sais : l'instance est running, Nginx est actif, pm2 status est online. Quelle est la cause probable et le diagnostic ?",
      options: [
        "L'app a un bug — vérifier le code source",
        "Le port 80 n'est pas ouvert dans le Security Group — vérifier les règles Inbound depuis la console AWS",
        "Nginx écoute sur le mauvais port — relancer nginx",
        "L'instance est dans un subnet privé sans route vers Internet",
      ],
      answer:
        "Le port 80 n'est pas ouvert dans le Security Group — vérifier les règles Inbound depuis la console AWS",
      explanation:
        "Méthode d'élimination : instance running ✓, Nginx actif ✓, app online ✓ = tout fonctionne en interne. La barrière est externe. Sur EC2, la couche externe = Security Group. Si `curl localhost:80` fonctionne sur EC2 mais pas depuis l'extérieur = SG. Vérifier Console EC2 → Security Groups → Inbound rules → port 80 TCP depuis 0.0.0.0/0.",
    },
    {
      question:
        "[Automation cron] Tu veux sauvegarder automatiquement le dossier `/home/ec2-user/app/uploads` vers S3 chaque nuit à 2h. Quelle configuration crontab est correcte ?",
      options: [
        "* 2 * * * aws s3 sync /home/ec2-user/app/uploads s3://mon-bucket/backups/",
        "0 2 * * * aws s3 sync /home/ec2-user/app/uploads s3://mon-bucket/backups/$(date +%Y%m%d)/",
        "2 0 * * * aws s3 cp /home/ec2-user/app/uploads s3://mon-bucket/",
        "0 2 1 * * aws s3 sync /home/ec2-user/app/uploads s3://mon-bucket/",
      ],
      answer:
        "0 2 * * * aws s3 sync /home/ec2-user/app/uploads s3://mon-bucket/backups/$(date +%Y%m%d)/",
      explanation:
        "Format cron : minute heure jour mois jour_semaine. `0 2 * * *` = chaque nuit à 2h00. `$(date +%Y%m%d)` crée un sous-dossier daté (ex: backups/20250603/). `* 2` = toutes les minutes de la 2ème heure. `2 0` = à 0h02. `0 2 1 * *` = uniquement le 1er du mois. Prérequis : l'instance EC2 doit avoir un rôle IAM avec permissions s3:PutObject.",
    },
    {
      question:
        "[Scénario coûts] Ton équipe laisse tourner 3 instances t3.medium en permanence pour un projet dev/test qui n'est utilisé que 8h par jour en semaine. Quelle stratégie AWS réduit les coûts de ~70% ?",
      options: [
        "Passer aux instances t2.micro — moins chères",
        "Automatiser le Stop/Start via AWS Lambda + EventBridge (9h-18h lun-ven) ou utiliser des Instances Spot",
        "Utiliser S3 à la place d'EC2 pour l'environnement de développement",
        "Migrer vers Reserved Instances 3 ans",
      ],
      answer:
        "Automatiser le Stop/Start via AWS Lambda + EventBridge (9h-18h lun-ven) ou utiliser des Instances Spot",
      explanation:
        "8h/jour × 5 jours = 40h/semaine vs 168h = 76% de downtime potentiel. EventBridge (anciennement CloudWatch Events) déclenche une Lambda qui démarre/arrête les instances selon un schedule. Spot Instances = -90% pour les workloads interruptibles. Reserved 3 ans = engagement long non adapté à un projet dev. Downgrade t2.micro ne résout pas l'inutilisation nocturne.",
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
