// src/projects/aws/Page_DeployDB.js
import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";
 
const basicSlides = [
  {
    question: "Vue d'ensemble — App + BDD SQL : Local → EC2 → RDS",
    answer:
      "◆ **Bloc 1** : BDD locale — SQLite (dev rapide) vs PostgreSQL/MySQL (production) ◆ **Bloc 2** : Flask + SQLAlchemy + Alembic — connexion, migrations, pool ◆ **Bloc 3** : Installer PostgreSQL sur EC2 — init, créer BDD et user, sécuriser ◆ **Bloc 4** : RDS — base managée AWS, pourquoi mieux qu'EC2 ◆ **Bloc 5** : Access (.accdb) — pourquoi ça ne tourne pas sur Linux ◆ **Bloc 6** : Migration Access → PostgreSQL — pgLoader, mdb-tools, Python ◆ **Bloc 7** : Sécurité BDD — credentials, Security Groups, backups, pooling",
  },
  {
    question: "Bloc 1 — SQLite vs PostgreSQL en développement",
    answer:
      "◆ **SQLite** : fichier unique `app.db` — zéro installation, parfait pour développer localement ◆ `DATABASE_URL=sqlite:///app.db` dans `.env` — Flask-SQLAlchemy le lit automatiquement ◆ **Limite SQLite** : pas de connexions concurrentes, pas de types avancés, pas adapté à la production ◆ **PostgreSQL local** : `brew install postgresql` (Mac) / `sudo apt install postgresql` (Linux) ◆ `DATABASE_URL=postgresql://user:password@localhost:5432/mabase` ⚠️ SQLite local + PostgreSQL en prod peut masquer des incompatibilités de types SQL",
  },
  {
    question: "Bloc 2 — Flask + SQLAlchemy + Alembic",
    answer:
      "◆ **SQLAlchemy** : ORM Python — `db = SQLAlchemy(app)` puis `class User(db.Model): id = db.Column(db.Integer, primary_key=True)` ◆ **Config** : `app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')` ◆ **Alembic** : `alembic revision --autogenerate -m 'create users'` → `alembic upgrade head` ◆ **Pourquoi migrations** : modifier le schéma sans perdre les données — comme Git pour la BDD ◆ **Pool** : `SQLALCHEMY_POOL_SIZE=5` — limite les connexions simultanées ⚠️ Ne jamais faire `db.create_all()` en production — utiliser Alembic pour toutes les modifications",
  },
  {
    question: "Bloc 3 — Installer PostgreSQL sur EC2",
    answer:
      "◆ **Amazon Linux 2023** : `sudo yum install postgresql15-server -y` → `sudo postgresql-setup --initdb` → `sudo systemctl start postgresql` ◆ **Ubuntu** : `sudo apt install postgresql -y` → `sudo systemctl start postgresql` ◆ **Créer la BDD** : `sudo -u postgres psql` → `CREATE DATABASE mabase;` → `CREATE USER monuser WITH PASSWORD 'secret';` → `GRANT ALL ON DATABASE mabase TO monuser;` ◆ **Connexion app** : `DATABASE_URL=postgresql://monuser:secret@localhost:5432/mabase` ⚠️ Ne jamais ouvrir le port 5432 sur 0.0.0.0/0 — la BDD ne doit pas être accessible depuis Internet",
  },
  {
    question: "Bloc 4 — RDS : base de données managée AWS",
    answer:
      "◆ **RDS** : AWS gère sauvegardes, patches, haute disponibilité — tu gères les données ◆ **Vs BDD sur EC2** : sauvegardes automatiques, réplication Multi-AZ, snapshots, redimensionnement sans downtime ◆ **Création** : Console RDS → Create Database → PostgreSQL → db.t3.micro (Free Tier) → subnet privé ◆ **Security Group RDS** : autoriser port 5432 uniquement depuis le Security Group EC2 — jamais depuis Internet ◆ **Endpoint** : `mabase.xyz.eu-west-3.rds.amazonaws.com:5432` → dans `.env` sur EC2 ◆ **RDS Proxy** : pooling de connexions managé ⚠️ RDS Multi-AZ est payant mais indispensable en production",
  },
  {
    question: "Bloc 5 — Access (.accdb) : pourquoi ça ne fonctionne pas sur Linux",
    answer:
      "◆ **Access = format Windows propriétaire** : le moteur Jet/ACE n'existe que pour Windows ◆ **Sur EC2 Linux** : aucun driver natif — `pyodbc` ne fonctionne pas sans Windows ◆ **Sur EC2 Windows** : possible via `pyodbc` + driver ODBC 64 bits, mais EC2 Windows est plus cher ◆ **Solution réaliste** : migrer Access → PostgreSQL AVANT le déploiement ◆ **Lire .accdb en Python local (Windows)** : `pyodbc.connect('DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:/base.accdb')` ⚠️ Déployer un .accdb sur EC2 Linux = échec garanti — migration obligatoire",
  },
  {
    question: "Bloc 6 — Migration Access → PostgreSQL",
    answer:
      "◆ **pgLoader** : `pgloader ACCESS:///base.accdb postgresql://user:pass@localhost/mabase` — migre tables + données en une commande ◆ **mdb-tools** (Linux) : `mdb-tables base.accdb` → `mdb-export base.accdb MaTable > MaTable.csv` → `COPY MaTable FROM '/tmp/MaTable.csv' CSV HEADER` dans psql ◆ **Python manuel** : `pyodbc` (Windows) → lire → `psycopg2` → insérer dans PostgreSQL ◆ **Vérifier** : `SELECT COUNT(*) FROM MaTable` dans Access vs PostgreSQL ◆ **Adapter les requêtes** : DatePart → EXTRACT, IIf → CASE WHEN, Nz → COALESCE ⚠️ Les types OLE Object et AutoDate Access n'ont pas d'équivalent direct — vérifier chaque colonne",
  },
  {
    question: "Bloc 7 — Déploiement complet Flask + PostgreSQL sur EC2",
    answer:
      "◆ **1.** Développer localement avec PostgreSQL local ◆ **2.** `pip freeze > requirements.txt` — inclut `psycopg2-binary`, `Flask-SQLAlchemy`, `alembic` ◆ **3.** `scp -r ./app ec2-user@IP:/home/ec2-user/app` ◆ **4.** SSH → installer PostgreSQL → créer BDD → stocker credentials dans `.env` sur l'instance ◆ **5.** `pip install -r requirements.txt` ◆ **6.** `alembic upgrade head` — crée les tables ◆ **7.** `gunicorn -w 4 app:app --bind 0.0.0.0:5000` ◆ **8.** Nginx → `proxy_pass http://127.0.0.1:5000` ⚠️ Ne jamais stocker les credentials BDD dans le code — `.env` sur l'instance ou AWS Secrets Manager",
  },
  {
    question: "Bloc 8 — Sécurité et sauvegardes BDD en production",
    answer:
      "◆ **Credentials** : `DATABASE_URL` dans `.env` ou AWS Secrets Manager → `boto3.client('secretsmanager').get_secret_value(SecretId='prod/db')` ◆ **Security Group** : port 5432 ouvert UNIQUEMENT depuis le SG EC2 ◆ **User dédié** : créer un user avec SELECT/INSERT/UPDATE/DELETE uniquement — jamais le superuser `postgres` ◆ **SSL** : `sslmode=require` dans DATABASE_URL pour chiffrer la connexion ◆ **Backups EC2** : cron quotidien — `pg_dump mabase | gzip > backup_$(date +%Y%m%d).sql.gz && aws s3 cp backup_*.sql.gz s3://backups/` ◆ **RDS** : sauvegardes automatiques quotidiennes incluses ⚠️ Un dump PostgreSQL non chiffré sur S3 public = fuite de toutes les données",
  },
  {
    question: "Bloc 9 — Monitoring BDD : logs et métriques PostgreSQL",
    answer:
      "◆ **Logs PostgreSQL** : `/var/log/postgresql/postgresql-*.log` — requêtes lentes, erreurs connexion ◆ **Slow query log** : `log_min_duration_statement = 500` dans `postgresql.conf` — logue les requêtes > 500ms ◆ **RDS CloudWatch** : DatabaseConnections, FreeStorageSpace, ReadLatency, CPUUtilization ◆ **Alarme connexions** : si `DatabaseConnections > 80` → alerte (proche du max_connections=100) ◆ **Requêtes en cours** : `SELECT query, state FROM pg_stat_activity WHERE state='active';` ◆ **Optimiser** : `EXPLAIN ANALYZE SELECT ...` — détecter les Sequential Scan qui manquent d'index ⚠️ PostgreSQL a max_connections=100 par défaut — utiliser PgBouncer ou RDS Proxy pour le pooling",
  },
];
 
const questions = {
  moyen: [
    {
      question:
        "[Confusion] Quelle est la différence entre SQLite et PostgreSQL pour une app Flask ?",
      options: [
        "SQLite est plus rapide que PostgreSQL dans tous les cas",
        "SQLite = fichier local, zéro config, idéal en dev ; PostgreSQL = serveur dédié, connexions concurrentes, adapté à la production",
        "PostgreSQL ne fonctionne qu'avec Django, pas Flask",
        "SQLite et PostgreSQL utilisent exactement la même syntaxe SQL",
      ],
      answer:
        "SQLite = fichier local, zéro config, idéal en dev ; PostgreSQL = serveur dédié, connexions concurrentes, adapté à la production",
      explanation:
        "SQLite écrit dans un fichier — parfait pour développer sans serveur. En production avec des requêtes concurrentes, SQLite bloque les écritures. PostgreSQL gère les transactions simultanées, les rôles, les index avancés. Bonne pratique : développer en PostgreSQL local pour coller à la prod.",
    },
    {
      question:
        "[Terme → Définition] Pourquoi utiliser Alembic pour les migrations de schéma ?",
      options: [
        "Alembic est uniquement pour créer la base de données initiale",
        "Alembic versionne les changements de schéma comme Git versionne le code — modifier une table sans perdre les données existantes",
        "Alembic remplace SQLAlchemy pour les requêtes SQL",
        "Alembic est requis uniquement pour les déploiements sur RDS",
      ],
      answer:
        "Alembic versionne les changements de schéma comme Git versionne le code — modifier une table sans perdre les données existantes",
      explanation:
        "Sans Alembic : db.create_all() ne modifie pas les tables existantes. Alembic génère des scripts de migration. alembic upgrade head les applique. Rollback possible avec alembic downgrade -1.",
    },
    {
      question:
        "[Confusion] Pourquoi un fichier Access (.accdb) ne peut pas être déployé directement sur EC2 Linux ?",
      options: [
        "Access est trop lourd pour EC2",
        "Le moteur Jet/ACE d'Access est propriétaire Windows — aucun driver natif n'existe pour Linux",
        "AWS bloque les fichiers .accdb pour des raisons de licence",
        "Access nécessite .NET Framework indisponible sur Linux",
      ],
      answer:
        "Le moteur Jet/ACE d'Access est propriétaire Windows — aucun driver natif n'existe pour Linux",
      explanation:
        "Access utilise le moteur Microsoft Jet/ACE, binaire Windows uniquement. Sur Linux, même avec Wine, le support est instable. La solution professionnelle : migrer Access → PostgreSQL avant le déploiement avec pgLoader ou mdb-tools.",
    },
    {
      question:
        "[Terme → Définition] Quelle est la différence entre BDD sur EC2 et Amazon RDS ?",
      options: [
        "RDS est gratuit, BDD sur EC2 est payante",
        "BDD sur EC2 = tu gères tout (sauvegardes, patches, HA) ; RDS = AWS gère l'infrastructure, tu gères les données",
        "RDS ne supporte que MySQL, pas PostgreSQL",
        "Une BDD sur EC2 est toujours plus performante que RDS",
      ],
      answer:
        "BDD sur EC2 = tu gères tout (sauvegardes, patches, HA) ; RDS = AWS gère l'infrastructure, tu gères les données",
      explanation:
        "Sur EC2 : tu dois configurer pg_dump, les patches PostgreSQL, la réplication. RDS : sauvegardes automatiques, Multi-AZ, failover automatique. En production : RDS est presque toujours le bon choix malgré le coût légèrement supérieur.",
    },
    {
      question:
        "[Confusion] Quel Security Group configurer pour que l'app EC2 accède à RDS PostgreSQL ?",
      options: [
        "Ouvrir le port 5432 de RDS sur 0.0.0.0/0 pour que l'app puisse se connecter",
        "Security Group RDS : autoriser le port 5432 uniquement depuis le Security Group de l'instance EC2 — jamais depuis Internet",
        "Ouvrir le port 5432 depuis l'IP publique de l'instance EC2",
        "Le port 5432 est ouvert automatiquement lors de la création RDS",
      ],
      answer:
        "Security Group RDS : autoriser le port 5432 uniquement depuis le Security Group de l'instance EC2 — jamais depuis Internet",
      explanation:
        "Source = Security Group EC2 (pas une IP, pas 0.0.0.0/0). Même si l'IP EC2 change, la règle reste valide. La BDD n'est jamais exposée à Internet — seulement accessible depuis les instances autorisées.",
    },
    {
      question:
        "[Terme → Définition] Qu'est-ce que psycopg2 dans un projet Flask + PostgreSQL ?",
      options: [
        "Un ORM qui remplace SQLAlchemy pour PostgreSQL",
        "Le driver Python de bas niveau qui connecte SQLAlchemy à PostgreSQL — nécessaire en tant que dépendance",
        "Un outil de migration de schéma alternatif à Alembic",
        "Un client PostgreSQL en ligne de commande",
      ],
      answer:
        "Le driver Python de bas niveau qui connecte SQLAlchemy à PostgreSQL — nécessaire en tant que dépendance",
      explanation:
        "SQLAlchemy est l'ORM (haut niveau) mais il a besoin d'un driver pour parler à PostgreSQL. psycopg2 est ce driver. En prod : psycopg2-binary dans requirements.txt. Sans lui : ModuleNotFoundError: No module named psycopg2.",
    },
    {
      question:
        "[Confusion] Quelle commande crée les tables en production avec Alembic ?",
      options: [
        "db.create_all() dans le code Flask",
        "alembic upgrade head — applique toutes les migrations jusqu'à la dernière version",
        "alembic init — initialise et crée les tables",
        "alembic revision — génère et applique les migrations",
      ],
      answer:
        "alembic upgrade head — applique toutes les migrations jusqu'à la dernière version",
      explanation:
        "alembic init crée la structure du projet une seule fois. alembic revision --autogenerate génère un script. alembic upgrade head applique les migrations. db.create_all() ne gère pas les modifications de schéma — il ignore les tables existantes.",
    },
    {
      question:
        "[Terme → Définition] Que fait mdb-export base.accdb MaTable > MaTable.csv ?",
      options: [
        "Importe un CSV dans une table Access",
        "Exporte le contenu de la table MaTable depuis le fichier Access en CSV — première étape de migration vers PostgreSQL",
        "Convertit le fichier Access entier en PostgreSQL en une commande",
        "Affiche la structure de la table sans les données",
      ],
      answer:
        "Exporte le contenu de la table MaTable depuis le fichier Access en CSV — première étape de migration vers PostgreSQL",
      explanation:
        "mdb-tools (Linux) permet de lire les .accdb sans Windows. mdb-tables liste les tables, mdb-export exporte en CSV. Ensuite : COPY MaTable FROM '/tmp/MaTable.csv' CSV HEADER dans psql pour importer dans PostgreSQL.",
    },
  ],
  avance: [
    {
      question:
        "[Code → Analyse] Ce code configure la connexion BDD. Quel problème en production ?\napp.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:motdepasse123@localhost/mabase'",
      options: [
        "La syntaxe de l'URI est incorrecte",
        "Les credentials BDD sont hardcodés dans le code source — commités dans git, exposés à tous les développeurs",
        "localhost ne fonctionne pas avec SQLAlchemy",
        "Il manque le numéro de port dans l'URI",
      ],
      answer:
        "Les credentials BDD sont hardcodés dans le code source — commités dans git, exposés à tous les développeurs",
      explanation:
        "Solution : app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') et stocker la valeur dans .env (exclu de git). En prod AWS : utiliser Secrets Manager avec boto3.client('secretsmanager').get_secret_value().",
    },
    {
      question:
        "[Architecture] Ton app Flask a des pics de 500 requêtes simultanées. PostgreSQL sur EC2 tombe. Quelle cause probable et solution ?",
      options: [
        "PostgreSQL est trop lent — passer à MySQL",
        "Le nombre de connexions dépasse max_connections (100 par défaut) — utiliser PgBouncer ou RDS Proxy comme pooler de connexions",
        "gunicorn génère trop de workers — réduire à 1",
        "Le disque EBS est trop lent — passer à SSD",
      ],
      answer:
        "Le nombre de connexions dépasse max_connections (100 par défaut) — utiliser PgBouncer ou RDS Proxy comme pooler de connexions",
      explanation:
        "Chaque worker gunicorn ouvre une connexion PostgreSQL. 4 workers × 10 instances = 40 connexions minimum, dépassement rapide de max_connections=100. PgBouncer mutualise : 500 clients → 20 vraies connexions PostgreSQL.",
    },
    {
      question:
        "[Situation → Outil] Tu migres 50 tables Access vers PostgreSQL. Quel outil pour une migration automatique complète ?",
      options: [
        "pgAdmin — interface graphique pour créer les tables manuellement",
        "pgLoader — migre tables + données + types en une commande depuis un fichier .accdb",
        "Alembic — génère les migrations Access automatiquement",
        "AWS Database Migration Service — s'interface directement avec Access",
      ],
      answer:
        "pgLoader — migre tables + données + types en une commande depuis un fichier .accdb",
      explanation:
        "pgLoader lit les .accdb (avec driver ODBC sur Windows/Mac) et insère directement dans PostgreSQL en gérant les types. Une commande : pgloader ACCESS:///base.accdb postgresql://user:pass@localhost/mabase. AWS DMS ne supporte pas Access directement.",
    },
    {
      question:
        "[Refactoring] Après migration Access → PostgreSQL, cette requête échoue :\nSELECT * FROM users WHERE DatePart('yyyy', date_naissance) = 1990",
      options: [
        "La table users n'existe pas dans PostgreSQL",
        "DatePart() est une fonction Access/SQL Server — en PostgreSQL utiliser EXTRACT(YEAR FROM date_naissance) = 1990",
        "La syntaxe WHERE est incorrecte en PostgreSQL",
        "date_naissance doit être entre guillemets doubles",
      ],
      answer:
        "DatePart() est une fonction Access/SQL Server — en PostgreSQL utiliser EXTRACT(YEAR FROM date_naissance) = 1990",
      explanation:
        "Access utilise des fonctions propriétaires (DatePart, Format, IIf, Nz). PostgreSQL : EXTRACT() pour les dates, COALESCE() pour Nz(), CASE WHEN pour IIf(). Auditer systématiquement toutes les requêtes Access après migration.",
    },
    {
      question:
        "[Anti-pattern] Ton équipe fait db.drop_all(); db.create_all() au démarrage de l'app pour réinitialiser le schéma en production. Quel problème ?",
      options: [
        "drop_all() est trop lent sur les grandes bases",
        "Toutes les données de production sont supprimées à chaque redémarrage — catastrophique",
        "db.create_all() ne fonctionne pas après drop_all()",
        "Acceptable si la BDD est sauvegardée avant",
      ],
      answer:
        "Toutes les données de production sont supprimées à chaque redémarrage — catastrophique",
      explanation:
        "drop_all() supprime TOUTES les tables et données. En production : utiliser Alembic uniquement. Le pattern drop_all + create_all est acceptable uniquement en tests (pytest fixtures) avec une BDD de test dédiée, jamais sur la base de production.",
    },
    {
      question:
        "[Anti-pattern] Tu utilises l'utilisateur postgres (superuser) dans la chaîne de connexion de l'app Flask. Quel risque ?",
      options: [
        "postgres ne peut pas se connecter depuis Flask",
        "En cas de SQL injection, l'attaquant a les droits superuser — DROP DATABASE, lecture de toutes les tables, création de backdoors",
        "L'utilisateur postgres est limité à 10 connexions",
        "Aucun risque si le mot de passe est complexe",
      ],
      answer:
        "En cas de SQL injection, l'attaquant a les droits superuser — DROP DATABASE, lecture de toutes les tables, création de backdoors",
      explanation:
        "Principe du moindre privilège : créer un user dédié avec seulement SELECT/INSERT/UPDATE/DELETE sur les tables de l'app. CREATE USER appuser WITH PASSWORD 'xxx'; GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO appuser — pas de DROP ni CREATE.",
    },
    {
      question:
        "[Situation → Multi-concepts] Comment sauvegarder automatiquement PostgreSQL sur EC2 vers S3 chaque nuit ?",
      options: [
        "RDS gère ça automatiquement — pas besoin de script",
        "Crontab quotidien : pg_dump → gzip → aws s3 cp avec date dans le nom du fichier",
        "Activer le versioning S3 sur la base de données",
        "Utiliser EBS snapshot directement sans pg_dump",
      ],
      answer:
        "Crontab quotidien : pg_dump → gzip → aws s3 cp avec date dans le nom du fichier",
      explanation:
        "Script cron : 0 2 * * * pg_dump mabase | gzip > /tmp/backup_$(date +%Y%m%d).sql.gz && aws s3 cp /tmp/backup_$(date +%Y%m%d).sql.gz s3://backups/postgres/. RDS gère ça automatiquement — bonne raison supplémentaire de préférer RDS en production.",
    },
  ],
  expert: [
    {
      question:
        "[Architecture] Tu migres une app Access/VBA locale vers une API Flask + PostgreSQL sur EC2. Dans quel ordre procéder ?",
      options: [
        "Déployer EC2 → créer l'API Flask → migrer Access → tester",
        "Analyser le schéma Access → migrer vers PostgreSQL local → réécrire les requêtes → tester l'API localement → déployer EC2 + RDS → migrer les données de prod",
        "Migrer Access vers S3 → connecter Flask à S3",
        "Créer RDS directement → importer Access dans RDS → déployer Flask",
      ],
      answer:
        "Analyser le schéma Access → migrer vers PostgreSQL local → réécrire les requêtes → tester l'API localement → déployer EC2 + RDS → migrer les données de prod",
      explanation:
        "L'ordre critique : valider la migration en local avant de déployer. Réécrire les requêtes Access (DatePart, IIf, Nz) en SQL standard d'abord. La migration des données de prod est la dernière étape — avec une fenêtre de maintenance et un rollback préparé.",
    },
    {
      question:
        "[Ordre de dépendance] Pour déployer Flask + PostgreSQL sur EC2 avec Alembic, dans quel ordre ?\n1) gunicorn  2) alembic upgrade head  3) pip install  4) créer la BDD PostgreSQL  5) configurer .env",
      options: [
        "1 → 2 → 3 → 4 → 5",
        "4 → 5 → 3 → 2 → 1",
        "3 → 4 → 5 → 2 → 1",
        "5 → 4 → 3 → 2 → 1",
      ],
      answer: "4 → 5 → 3 → 2 → 1",
      explanation:
        "La BDD doit exister avant que .env pointe dessus. .env doit être configuré avant pip install. Les packages doivent être installés avant alembic. Les migrations doivent être appliquées avant gunicorn — l'app suppose les tables existantes au démarrage.",
    },
    {
      question:
        "[Nommage inversé] Quel composant s'intercale entre l'app et PostgreSQL, maintient un pool de connexions persistantes, réduit les vraies connexions de 90%, supporte des milliers de clients simultanés ?",
      options: [
        "Nginx reverse proxy",
        "PgBouncer ou RDS Proxy",
        "Alembic",
        "SQLAlchemy connection pool interne",
      ],
      answer: "PgBouncer ou RDS Proxy",
      explanation:
        "PgBouncer est un pooler de connexions PostgreSQL : les apps se connectent à PgBouncer (port 6432) qui maintient un petit pool de vraies connexions. 1000 clients → 20 connexions réelles. RDS Proxy est l'équivalent managé AWS. SQLAlchemy a un pool interne mais insuffisant pour Auto Scaling.",
    },
    {
      question:
        "[Architecture] En production avec Auto Scaling, comment gérer le mot de passe PostgreSQL sur les nouvelles instances ?",
      options: [
        "Hardcoder dans le code source pour éviter les problèmes de config",
        "Stocker dans AWS Secrets Manager et récupérer au démarrage via boto3 — les nouvelles instances le récupèrent automatiquement via le rôle IAM",
        "Mettre dans le User Data du Launch Template en clair",
        "Stocker dans un fichier .env sur S3 public",
      ],
      answer:
        "Stocker dans AWS Secrets Manager et récupérer au démarrage via boto3 — les nouvelles instances le récupèrent automatiquement via le rôle IAM",
      explanation:
        "Secrets Manager : secret chiffré, versionné, rotatable automatiquement. Le rôle IAM de l'instance autorise secretsmanager:GetSecretValue — pas de credentials hardcodés. En Auto Scaling, chaque nouvelle instance récupère le secret au démarrage dans le User Data.",
    },
    {
      question:
        "[Situation → Multi-concepts] Ta requête PostgreSQL est lente (5s) en production. Comment diagnostiquer et corriger ?",
      options: [
        "Augmenter la taille de l'instance RDS directement",
        "EXPLAIN ANALYZE sur la requête → identifier un Sequential Scan → CREATE INDEX sur la colonne concernée → valider avec EXPLAIN ANALYZE",
        "Réécrire toute l'app avec un autre ORM",
        "Désactiver le logging PostgreSQL pour réduire la charge",
      ],
      answer:
        "EXPLAIN ANALYZE sur la requête → identifier un Sequential Scan → CREATE INDEX sur la colonne concernée → valider avec EXPLAIN ANALYZE",
      explanation:
        "Méthode : EXPLAIN ANALYZE SELECT * FROM commandes WHERE user_id=42. Si Seq Scan sur une grande table → index manquant. CREATE INDEX idx_commandes_user ON commandes(user_id). Re-lancer EXPLAIN ANALYZE → Index Scan + temps divisé par 100. Activer log_min_duration_statement=500 pour capturer les requêtes lentes automatiquement.",
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

const BackendInterviewAWSAi = () => {
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

export default BackendInterviewAWSAi;
