import React, { useState, useEffect } from "react";
import "./QCMStyles.css";

// Flashcards pour le niveau basic
const basicSlides = [
  {
    "question": "Les Responsabilités clés d'un Business Analyst (BA):\n\n1. Recueil et formalisation des besoins métier. \n2. Rédaction des spécifications fonctionnelles (UML/Merise). \n3. Coordination avec les équipes projet (MOA/MOE). \n4. Suivi de projet et gestion des tests (Agile, UAT). \n5. Update et Accompagnement du changement et recueil des évolutions",
    "answer": "."
  },
    {
    "question": "Responsabilités clé du MOE (Chef projet/Systeme): \n\n1. Étude d faisabilité techni+analyse préliminaire. \n2. Propose une solution technique adaptée+chiffrage+conçoit l’architecture. \n3. Définit les choix technologiques, développe les flux/API et intègre les modules. \n4. Effectue les tests techniques (unitaires/intégration) et déploie la solution. \n5. Maintient le système et gère les évolutions et correctifs techniques",
    "answer": "."
  },
  {
    "question": "Les responsabilités d'1 BI (Business Intelligence): \n\n1. Identification des sources de données et définition des KPIs. \n2. Modélisation des tableaux de bord et des data models. \n3. Développement des requêtes SQL/ETL et création de dashboards. \n4. Contrôle qualité des données et du reporting. \n5. Mise en place des accès, support utilisateur, mise à jour des indicateurs",
    "answer": "."
  },
  {
    "question": "Les Responsabilités clés d'1 MOA (Client/Metier): \n\n1. Définit les objectifs métier du projet et rédige le cahier des charges. \n2. Valide les fonctionnalités, hiérarchise les besoins, s'assure que la solution répond aux objectifs. \n3. Valide les grandes orientations en cours de projet et la conformité métier. \n4. Organise la mise en production, forme les utilisateurs et donne le GO de production. \n5. Planifie les nouvelles versions et assure la gouvernance du projet",
    "answer": "."
  },

  {
    "question": "Quelles sont les responsabilités clés d'un Business Analyst (BA) ?",
    "answer": "1. Recueil et formalisation des besoins métier (ateliers, cas d’usage, enjeux). 2. Rédaction des spécifications fonctionnelles (UML, BPMN). 3. Coordination avec les équipes projet (MOA/MOE). 4. Suivi de projet et gestion des tests (Agile, UAT). 5. Accompagnement du changement et recueil des évolutions."
  },
  {
    "question": "Quelles sont les responsabilités clés d'un expert BI (Business Intelligence) ?",
    "answer": "1. Identification des sources de données et définition des KPIs. 2. Modélisation des tableaux de bord et des data models. 3. Développement des requêtes SQL/ETL et création de dashboards. 4. Contrôle qualité des données et du reporting. 5. Mise en place des accès, support utilisateur, mise à jour des indicateurs."
  },
  {
    "question": "Quel est le rôle du BA lors du cadrage du besoin ?",
    "answer": "Recueillir les besoins métier, animer les ateliers et formaliser les enjeux."
  },
  {
    "question": "Comment le BI intervient-il dans la phase de cadrage du besoin ?",
    "answer": "Il identifie les sources de données utiles et valide les KPIs à suivre."
  },
  {
    "question": "Quel est le rôle de la MOA durant le cadrage du besoin ?",
    "answer": "Définir les objectifs métier et rédiger un cahier des charges."
  },
  {
    "question": "Quelles sont les tâches du BA dans l’analyse fonctionnelle ?",
    "answer": "Rédiger les spécifications fonctionnelles (UML, BPMN) et définir les cas d’usage."
  },
  {
    "question": "Quel est le rôle du BI lors de l’analyse fonctionnelle ?",
    "answer": "Proposer les indicateurs, formats et axes de pilotage."
  },
  {
    "question": "Que fait la MOA pendant l’analyse fonctionnelle ?",
    "answer": "Valide les fonctionnalités souhaitées et hiérarchise les besoins."
  },
  {
    "question": "Quel est le rôle du BA lors de la conception de la solution ?",
    "answer": "Collaborer avec la MOE et le métier pour valider la solution cible."
  },
  {
    "question": "Que fait le BI pendant la phase de conception ?",
    "answer": "Il modélise les tableaux de bord et le data model (dimensions, mesures)."
  },
  {
    "question": "Comment intervient la MOA durant la conception de la solution ?",
    "answer": "Elle s’assure que la solution répond aux objectifs métier."
  },
  {
    "question": "Quelles sont les responsabilités du BA pendant la réalisation ?",
    "answer": "Suivre l’avancement, clarifier les demandes (Agile), faire le lien MOA/MOE."
  },
  {
    "question": "Quelles tâches le BI effectue-t-il en phase de réalisation ?",
    "answer": "Préparer les requêtes SQL, ETL et créer les dashboards Power BI / Tableau."
  },
  {
    "question": "Comment la MOA intervient-elle pendant la réalisation du projet ?",
    "answer": "Elle valide les grandes orientations en cours de projet."
  },
  {
    "question": "Quel est le rôle du BA lors de la phase de recette ?",
    "answer": "Rédiger les scénarios de tests (UAT) et coordonner les utilisateurs."
  },
  {
    "question": "Comment le BI participe-t-il aux tests ?",
    "answer": "Il contrôle la qualité des données et du reporting."
  },
  {
    "question": "Que fait la MOA pendant la phase de suivi et d’évolutions ?",
    "answer": "Elle planifie les nouvelles versions et assure la gouvernance du projet."
  },
  {
    "question": "Comment diagnostiquez-vous un incident métier ou technique ?",
    "answer": "Je recueille d'abord les symptômes (logs, retours utilisateurs), isole la source via une analyse des données ou logs, puis utilise des requêtes SQL pour extraire des informations critiques. Enfin, je collabore avec les équipes pour une résolution rapide."
  },
  {
    "question": "Donnez un exemple où vous avez identifié une incohérence dans des données.",
    "answer": "J'ai détecté des doublons dans une table de clients avec une requête `SELECT COUNT(*) vs COUNT(DISTINCT client_id)`. J’ai ensuite proposé un script de nettoyage pour corriger le problème."
  },
  {
    "question": "Comment compteriez-vous le nombre de commandes par client ?",
    "answer": "Avec la requête SQL : `SELECT client_id, COUNT(*) AS nb_commandes FROM commandes GROUP BY client_id;`"
  },
  {
    "question": "Expliquez la différence entre LEFT JOIN et INNER JOIN.",
    "answer": "INNER JOIN retourne uniquement les lignes avec correspondance dans les deux tables, tandis que LEFT JOIN retourne toutes les lignes de la table gauche, même sans correspondance (valeurs NULL à droite)."
  },
  {
    "question": "Comment optimiseriez-vous une requête SQL lente ?",
    "answer": "J’analyse le plan d’exécution pour identifier les scans de table, ajoute des index sur les colonnes filtrées (WHERE/JOIN), et évite les `SELECT *` inutiles."
  },
  {
    "question": "Comment transférez-vous un fichier via SFTP en ligne de commande ?",
    "answer": "Avec la commande : `sftp user@serveur:/distant/chemin < fichier_local` ou interactivement via `sftp user@serveur` puis `put fichier_local`."
  },
  {
    "question": "Comment lister les tâches cron pour un utilisateur ?",
    "answer": "Avec la commande : `crontab -l`."
  },
  {
    "question": "Que feriez-vous si un batch échoue ?",
    "answer": "Je vérifie les logs pour identifier l’erreur, relance manuellement si possible, et analyse la cause (ex : fichier manquant, problème de connexion)."
  },
  {
    "question": "Quels indicateurs suivriez-vous pour une application critique ?",
    "answer": "Temps de réponse, taux d’erreurs HTTP (5xx), disponibilité (SLA > 99.9%), et l’état des batchs nocturnes."
  },
  {
    "question": "Comment vérifier si un service est en cours d’exécution ?",
    "answer": "Avec `systemctl status nom_service` ou `ps aux | grep nom_processus`."
  },
  {
    "question": "Comment suivre les erreurs dans un fichier log en temps réel ?",
    "answer": "Avec `tail -f fichier.log | grep \"ERROR\"`."
  },
  {
    "question": "Comment tester si un port est ouvert sur un serveur ?",
    "answer": "Avec `telnet ip port` ou `nc -zv ip port`."
  },
  {
    "question": "Comment diagnostiquer une lenteur réseau ?",
    "answer": "J’utilise `ping` pour la latence, `traceroute` pour le chemin, et `mtr` pour une analyse combinée."
  },
  {
    "question": "Comment détecter et supprimer des doublons dans une table SQL ?",
    "answer": "Pour détecter : `SELECT colonne, COUNT(*) FROM table GROUP BY colonne HAVING COUNT(*) > 1`. Pour supprimer : utiliser une sous-requête avec `ROW_NUMBER()` ou créer une table temporaire avec les valeurs uniques."
  },
  {
    "question": "Expliquez l'utilité des index en SQL avec un exemple concret.",
    "answer": "Les index accélèrent les recherches. Exemple : `CREATE INDEX idx_client_nom ON clients(nom)` optimise les requêtes avec `WHERE nom = 'Dupont'`. Attention : trop d'index ralentit les INSERT/UPDATE."
  },
  {
    "question": "Comment vérifier l'espace disque disponible sur un serveur Linux ?",
    "answer": "Commande : `df -h` (affiche l'espace par partition) ou `du -sh /dossier` pour la taille d'un dossier spécifique."
  },
  {
    "question": "Quelle commande utiliser pour rechercher un fichier contenant un mot-clé précis ?",
    "answer": "`grep -r \"mot-clé\" /dossier/` (recherche récursive) ou combiné avec `find` : `find /dossier -type f -exec grep -l \"mot-clé\" {} +`."
  },
  {
    "question": "Comment redémarrer un service sous Linux ?",
    "answer": "`systemctl restart nom_service` (ou `service nom_service restart` sur les anciennes distributions)."
  },
  {
    "question": "Qu'est-ce qu'un SLA ? Donnez un exemple métier.",
    "answer": "Un SLA (Service Level Agreement) définit des engagements de performance. Exemple : 'Disponibilité de l'application à 99.95% sur un mois, sous peine de compensation financière'."
  },
  {
    "question": "Comment extraire uniquement les 10 premières lignes d'un fichier CSV en ligne de commande ?",
    "answer": "`head -n 10 fichier.csv` ou `sed -n '1,10p' fichier.csv`."
  },
  {
    "question": "Comment monitorer les processus consommant le plus de CPU ?",
    "answer": "`top` (tri interactif), ou `ps aux --sort=-%cpu | head -n 5` pour afficher les 5 processus les plus gourmands."
  },
  {
    "question": "Quelle est la différence entre HTTP et HTTPS ? Pourquoi est-ce critique en production ?",
    "answer": "HTTPS chiffre les données via SSL/TLS. Critique pour la sécurité (évite les attaques MITM, protège les données sensibles comme les mots de passe)."
  },
  {
    "question": "Comment déboguer une requête API qui retourne une erreur 500 ?",
    "answer": "1) Vérifier les logs côté serveur. 2) Utiliser `curl -v URL` pour inspecter les headers. 3) Tester avec un outil comme Postman en simplifiant la requête."
  },
];

// QCM pour les niveaux moyen et avancé
const questions = {
  moyen: [
    {
      "question": "Quelle est l’interaction clé entre le BA et la MOE durant la phase de conception ?",
      "options": [
        "Le BA assiste uniquement à la rédaction du cahier des charges",
        "Le BA rédige les tests fonctionnels pour la MOE",
        "Le BA collabore avec la MOE pour valider la solution cible",
        "Le BA ne participe pas à la conception technique"
      ],
      "answer": "Le BA collabore avec la MOE pour valider la solution cible",
      "explanation": "Le BA joue un rôle central en travaillant avec la MOE pour assurer que la solution technique réponde bien aux besoins métier."
    },
    {
      "question": "Quel livrable spécifique est produit par la MOA au moment du cadrage ?",
      "options": [
        "Les spécifications fonctionnelles",
        "Un reporting BI",
        "Un cahier des charges",
        "Une modélisation UML"
      ],
      "answer": "Un cahier des charges",
      "explanation": "La MOA formalise les objectifs métier dans un cahier des charges pour orienter les phases suivantes du projet."
    },
    {
      "question": "Quelle est la priorité du BI dans la phase d’analyse fonctionnelle ?",
      "options": [
        "Valider les cas d’usage",
        "Créer les dashboards",
        "Proposer les indicateurs, formats et axes de pilotage",
        "Faire le lien entre MOA et MOE"
      ],
      "answer": "Proposer les indicateurs, formats et axes de pilotage",
      "explanation": "Le BI définit les éléments clés qui permettront d'assurer un pilotage efficace des données."
    },
    {
      "question": "Qui est responsable de valider la conformité métier durant la recette ?",
      "options": [
        "MOE",
        "MOA",
        "BI",
        "BA"
      ],
      "answer": "MOA",
      "explanation": "La MOA s'assure que les livrables correspondent bien aux exigences métier initialement exprimées."
    },
    {
      "question": "Dans quel cadre le BA clarifie-t-il les demandes en continu ?",
      "options": [
        "Modèle en cascade",
        "Approche Agile",
        "Cycle en V",
        "Méthode Lean"
      ],
      "answer": "Approche Agile",
      "explanation": "Le BA joue un rôle actif dans les échanges continus et l'adaptation des besoins dans un contexte Agile."
    },
    {
      "question": "Quel est le rôle du BI pendant la livraison / déploiement ?",
      "options": [
        "Préparer les cas de test",
        "Fournir les manuels et supports",
        "Valider la conformité métier",
        "Organiser la formation"
      ],
      "answer": "Fournir les manuels et supports",
      "explanation": "Le BI accompagne le déploiement en mettant à disposition les outils, manuels et supports nécessaires aux utilisateurs."
    },
    {
      "question": "Qui assure la gouvernance du projet dans la phase de suivi ?",
      "options": [
        "BA",
        "MOA",
        "BI",
        "MOE"
      ],
      "answer": "MOA",
      "explanation": "La MOA supervise les évolutions et planifie les nouvelles versions en garantissant l’alignement avec les enjeux métiers."
    },
    {
      "question": "Quelle tâche distingue le BA lors de la phase de recette ?",
      "options": [
        "Créer les dashboards",
        "Contrôler la qualité des données",
        "Rédiger les scénarios de tests (UAT)",
        "Préparer les requêtes SQL"
      ],
      "answer": "Rédiger les scénarios de tests (UAT)",
      "explanation": "Le BA s’assure que les tests utilisateurs sont bien rédigés pour valider les fonctionnalités selon les besoins exprimés."
    },
    {
      "question": "Quel livrable est typiquement produit par le BI en réalisation ?",
      "options": [
        "Manuels utilisateurs",
        "Spécifications fonctionnelles",
        "Dashboards dans Power BI ou Tableau",
        "Cahier de charges"
      ],
      "answer": "Dashboards dans Power BI ou Tableau",
      "explanation": "Le BI développe les interfaces de visualisation pour permettre aux utilisateurs de suivre les indicateurs définis."
    },
    {
      "question": "En quoi consiste la contribution de la MOA à l’analyse fonctionnelle ?",
      "options": [
        "Écrire le code SQL",
        "Hiérarchiser les besoins",
        "Installer Power BI",
        "Tester l’application"
      ],
      "answer": "Hiérarchiser les besoins",
      "explanation": "La MOA clarifie et classe les besoins selon leur priorité pour guider les développements à venir."
    },
    {
      "question": "Qui prend le GO pour le passage en production ?",
      "options": [
        "BA",
        "BI",
        "MOA",
        "MOE"
      ],
      "answer": "MOA",
      "explanation": "C’est la MOA qui autorise officiellement le passage en production en fonction de la conformité avec les besoins métiers."
    },
    {
      "question": "Comment le BA contribue-t-il à la gestion des évolutions ?",
      "options": [
        "Déploie les outils BI",
        "Collecte les retours d’usage et formalise les évolutions",
        "Contrôle la qualité du reporting",
        "Fait la formation des utilisateurs"
      ],
      "answer": "Collecte les retours d’usage et formalise les évolutions",
      "explanation": "Le BA recueille les feedbacks utilisateurs et les traduit en demandes d’évolution fonctionnelle."
    },
    {
      "question": "Quel acteur propose des axes de pilotage dès l’analyse fonctionnelle ?",
      "options": [
        "MOA",
        "MOE",
        "BI",
        "BA"
      ],
      "answer": "BI",
      "explanation": "Le BI apporte sa vision orientée données en proposant les axes de suivi les plus pertinents dès les premières phases."
    },
    {
      "question": "Quelle est l’activité principale de la MOA lors du déploiement ?",
      "options": [
        "Rédiger les manuels utilisateurs",
        "Organiser la mise en production et former les utilisateurs finaux",
        "Créer les rapports SQL",
        "Gérer les incidents techniques"
      ],
      "answer": "Organiser la mise en production et former les utilisateurs finaux",
      "explanation": "La MOA coordonne les parties prenantes et s’assure que les utilisateurs sont prêts à utiliser la solution."
    },
    {
      "question": "Pourquoi le lien entre MOA et MOE est-il assuré par le BA ?",
      "options": [
        "Car le BA code la solution",
        "Car le BA assure la conformité légale",
        "Car le BA assure la cohérence entre besoins métiers et solution technique",
        "Car le BA déploie les dashboards"
      ],
      "answer": "Car le BA assure la cohérence entre besoins métiers et solution technique",
      "explanation": "Le rôle du BA est de faire l’interface entre les utilisateurs métier et les équipes techniques pour garantir l’alignement du livrable avec les attentes initiales."
    }
  ],
  avance: [
    {
      "question": "Quelle méthode utiliseriez-vous en priorité pour diagnostiquer un incident applicatif ?",
      "options": [
        "Lancer une analyse post-mortem immédiatement",
        "Extraire les logs et données métiers pertinentes",
        "Redémarrer immédiatement le serveur",
        "Contacter le support sans investigation"
      ],
      "answer": "Extraire les logs et données métiers pertinentes",
      "explanation": "L'extraction des logs et données critiques permet d'identifier la racine du problème avant toute action corrective."
    },
    {
      "question": "Quelle requête compte le nombre de clients uniques ayant passé commande ?",
      "options": [
        "SELECT COUNT(*) FROM clients;",
        "SELECT COUNT(DISTINCT client_id) FROM commandes;",
        "SELECT SUM(client_id) FROM commandes;",
        "SELECT client_id FROM commandes GROUP BY client_id;"
      ],
      "answer": "SELECT COUNT(DISTINCT client_id) FROM commandes;",
      "explanation": "COUNT(DISTINCT) élimine les doublons pour compter les clients unifsques dans la table commandes."
    },
    {
      "question": "Quel protocole garantit un transfert sécurisé de fichiers ?",
      "options": [
        "FTP",
        "SFTP",
        "HTTP",
        "Telnet"
      ],
      "answer": "SFTP",
      "explanation": "SFTP (SSH File Transfer Protocol) chiffre les données durant le transfert, contrairement à FTP."
    },
    {
      "question": "Comment planifier une tâche quotidienne à 2h00 du matin avec cron ?",
      "options": [
        "0 2 * * * /script.sh",
        "* * 2 * * /script.sh",
        "2 0 * * * /script.sh",
        "0 * 2 * * /script.sh"
      ],
      "answer": "0 2 * * * /script.sh",
      "explanation": "La syntaxe cron est 'minute heure * * *'. Ici, '0 2' signifie à 2h00 pile chaque jour."
    },
    {
      "question": "Quel outil permet de visualiser des métriques temps réel via des dashboards ?",
      "options": [
        "Nagios",
        "Grafana",
        "Wireshark",
        "Jenkins"
      ],
      "answer": "Grafana",
      "explanation": "Grafana est spécialisé dans la visualisation de métriques (ex : temps de réponse, CPU) avec des graphiques."
    },
    {
      "question": "Quelle commande affiche les 10 dernières lignes d'un fichier log ?",
      "options": [
        "head -n 10 fichier.log",
        "cat fichier.log | top 10",
        "tail -n 10 fichier.log",
        "grep -n 10 fichier.log"
      ],
      "answer": "tail -n 10 fichier.log",
      "explanation": "tail -n X affiche les X dernières lignes d'un fichier, utile pour les logs récents."
    },
    {
      "question": "Comment tester la connectivité à un serveur sur le port 443 ?",
      "options": [
        "ping 443",
        "telnet serveur 443",
        "curl http://serveur:443",
        "netstat serveur 443"
      ],
      "answer": "telnet serveur 443",
      "explanation": "telnet vérifie si un port est ouvert (ici, le port HTTPS 443). Si la connexion réussit, le port est accessible."
    },
    {
      "question": "Quel index SQL améliore les performances d'une requête avec WHERE et ORDER BY ?",
      "options": [
        "Un index unique",
        "Un index composite sur les colonnes WHERE et ORDER BY",
        "Un index partiel",
        "Un index bitmap"
      ],
      "answer": "Un index composite sur les colonnes WHERE et ORDER BY",
      "explanation": "Un index composite couvrant les conditions de filtrage (WHERE) et de tri (ORDER BY) réduit les opérations de table scan."
    },
    {
      "question": "Quelle commande Linux permet de trouver tous les fichiers modifiés dans les dernières 24h ?",
      "options": [
        "find / -type f -days 1",
        "find / -type f -mtime -1",
        "ls -l | grep '24h'",
        "grep -r \"24h\" /"
      ],
      "answer": "find / -type f -mtime -1",
      "explanation": "find avec -mtime -1 liste les fichiers modifiés il y a moins de 24h (1 journée)."
    },
    {
      "question": "Quelle jointure SQL retourne uniquement les lignes avec correspondance dans les deux tables ?",
      "options": [
        "LEFT JOIN",
        "FULL OUTER JOIN",
        "INNER JOIN",
        "CROSS JOIN"
      ],
      "answer": "INNER JOIN",
      "explanation": "INNER JOIN filtre strictement les lignes présentes dans les deux tables, contrairement à LEFT/FULL JOIN."
    },
    {
      "question": "Quelle méthode permet de détecter les valeurs aberrantes dans un jeu de données ?",
      "options": [
        "Utiliser AVG() en SQL",
        "Analyse des percentiles (ex: boîte à moustaches)",
        "Compter les lignes avec COUNT(*)",
        "Trier les données par ordre alphabétique"
      ],
      "answer": "Analyse des percentiles (ex: boîte à moustaches)",
      "explanation": "L'analyse par percentiles (comme Q1/Q3) identifie statistiquement les valeurs extrêmes en dehors de l'intervalle interquartile."
    },
    {
      "question": "Quel est l'impact d'un INDEX sur une table fréquemment mise à jour ?",
      "options": [
        "Accélère les SELECT mais ralentit les INSERT/UPDATE",
        "Désynchronise les réplicas de base de données",
        "Double la taille de la table",
        "Aucun impact sur les performances"
      ],
      "answer": "Accélère les SELECT mais ralentit les INSERT/UPDATE",
      "explanation": "Les index améliorent les lectures mais nécessitent des mises à jour supplémentaires lors des écritures."
    },
    {
      "question": "Comment identifier tous les processus utilisant plus de 50% de CPU ?",
      "options": [
        "ps aux | awk '$3 > 50'",
        "top -p 50",
        "grep 'CPU' /proc/meminfo",
        "netstat -tuln | grep 50"
      ],
      "answer": "ps aux | awk '$3 > 50'",
      "explanation": "La colonne 3 de 'ps aux' montre le %CPU. Awk filtre les processus dépassant 50%."
    },
    {
      "question": "Quelle commande archive un dossier en conservant les permissions ?",
      "options": [
        "zip -r archive.zip dossier",
        "tar czvf archive.tar.gz dossier",
        "cp -p dossier archive",
        "rsync --perms dossier/ archive/"
      ],
      "answer": "tar czvf archive.tar.gz dossier",
      "explanation": "tar avec l'option 'z' (compression gzip) et 'p' (conservation des permissions) est idéal pour l'archivage."
    },
    {
      "question": "Quel outil permet d'analyser des paquets réseau en temps réel ?",
      "options": [
        "nslookup",
        "tcpdump",
        "crontab -l",
        "df -h"
      ],
      "answer": "tcpdump",
      "explanation": "tcpdump capture et analyse le trafic réseau (ex: 'tcpdump port 80' pour le HTTP)."
    },
    {
      "question": "Comment remplacer 'foo' par 'bar' dans tous les fichiers .txt d'un répertoire ?",
      "options": [
        "grep -l 'foo' *.txt | xargs sed -i 's/foo/bar/g'",
        "echo 's/foo/bar/g' > *.txt",
        "rm -rf *.txt",
        "mv 'foo' 'bar' *.txt"
      ],
      "answer": "grep -l 'foo' *.txt | xargs sed -i 's/foo/bar/g'",
      "explanation": "grep -l liste les fichiers contenant 'foo', xargs applique sed en masse pour le remplacement."
    },
    {
      "question": "Quelle requête trouve les clients sans commande ?",
      "options": [
        "SELECT * FROM clients c INNER JOIN commandes co ON c.id = co.client_id",
        "SELECT * FROM clients c LEFT JOIN commandes co ON c.id = co.client_id WHERE co.id IS NULL",
        "SELECT COUNT(*) FROM clients",
        "DELETE FROM clients WHERE id NOT IN (SELECT client_id FROM commandes)"
      ],
      "answer": "SELECT * FROM clients c LEFT JOIN commandes co ON c.id = co.client_id WHERE co.id IS NULL",
      "explanation": "LEFT JOIN + WHERE IS NULL est le pattern classique pour trouver les absences de correspondance."
    },
    {
      "question": "Comment suivre les appels système d'un processus en cours ?",
      "options": [
        "strace -p <PID>",
        "tail -f /dev/null",
        "ping localhost",
        "chmod +x /proc/<PID>"
      ],
      "answer": "strace -p <PID>",
      "explanation": "strace trace les appels système (open/read/write) d'un processus, crucial pour le debugging."
    },
    {
      "question": "Pourquoi éviter 'SELECT *' en production ?",
      "options": [
        "Cela charge inutilement des colonnes non utilisées",
        "La syntaxe est obsolète en SQL:2023",
        "Cela corrompt les indexes",
        "Cela déclenche toujours un full table scan"
      ],
      "answer": "Cela charge inutilement des colonnes non utilisées",
      "explanation": "Sélectionner uniquement les colonnes nécessaires réduit la charge réseau/CPU."
    },
    {
      "question": "Quel outil permet de gérer l'infrastructure comme code ?",
      "options": [
        "Terraform",
        "Wireshark",
        "MySQL Workbench",
        "Nagios"
      ],
      "answer": "Terraform",
      "explanation": "Terraform (HCL) et Ansible (YAML) sont les standards pour l'IaC (Infrastructure as Code)."
    },
    {
      "question": "Comment vérifier les ports ouverts sur votre machine locale ?",
      "options": [
        "netstat -tuln",
        "ping 127.0.0.1",
        "curl ifconfig.me",
        "dig localhost"
      ],
      "answer": "netstat -tuln",
      "explanation": "netstat -tuln liste les ports en écoute (TCP/UDP) sans résolution DNS (-n)."
    },
    {
      "question": "Pourquoi utiliser des transactions en base de données ?",
      "options": [
        "Pour accélérer les requêtes SELECT",
        "Garantir l'intégrité (tout ou rien)",
        "Contourner les limites de taille de table",
        "Éviter les sauvegardes"
      ],
      "answer": "Garantir l'intégrité (tout ou rien)",
      "explanation": "BEGIN/COMMIT/ROLLBACK assurent que les opérations multiples réussissent ou échouent ensemble."
    },
    {
      "question": "Quel outil analyse l'exécution d'une requête PostgreSQL ?",
      "options": [
        "EXPLAIN ANALYZE",
        "SHOW PROCESSLIST",
        "DEBUG LOG",
        "TABLE STATS"
      ],
      "answer": "EXPLAIN ANALYZE",
      "explanation": "EXPLAIN ANALYZE affiche le plan d'exécution et le temps réel consommé."
    },
    {
      "question": "Comment forcer l'arrêt d'un script Bash après la première erreur ?",
      "options": [
        "set -e",
        "try/catch",
        "exit 1",
        "break on error"
      ],
      "answer": "set -e",
      "explanation": "set -e fait échouer immédiatement le script si une commande retourne un code d'erreur."
    },
    {
      "question": "Quelle commande montre le chemin réseau vers un serveur ?",
      "options": [
        "traceroute",
        "ifconfig",
        "arp -a",
        "route -n"
      ],
      "answer": "traceroute",
      "explanation": "traceroute affiche chaque saut (hop) entre votre machine et la destination, avec les temps de réponse."
    }

  ]
};

// Timer
const Timer = ({ timeLeft }) => (
  <p className="timer">⏳ Temps restant : <span>{timeLeft}s</span></p>
);

// Composant QCM
const QuestionCard = ({ question, options, onAnswerClick, timeLeft }) => (
  <div className="question-card">
    <h4>💡 {question}</h4>
    <Timer timeLeft={timeLeft} />
    <div className="options-container">
      {options.map((option, index) => (
        <button key={index} onClick={() => onAnswerClick(option)} className="option-button">
          {index + 1}. {option}
        </button>
      ))}
    </div>
  </div>
);

// Composant Flashcard
const Flashcard = ({ slide, index, total }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    {/* <h5>🧠 Flashcard {index + 1} / {total}</h5> */}
    <strong>Question :</strong>
    <pre style={{ margin: '0', padding: '4px', background: '#f5f5f5', borderRadius: '3px', overflowX: 'auto' }}>
      <code style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: '0.4' }}>
        {slide.question}
      </code>
    
    </pre>
    <strong>Réponse :</strong> {slide.answer}
  </div>
);




// Composant Résultat
const Results = ({ scores }) => {
  const totalScore = scores.moyen + scores.avance;
  const totalQuestions = Object.values(questions).flat().length;
  return (
    <div className="results">
      <h3>🎯 Score final : {totalScore} / {totalQuestions}</h3>
      <p>✅ Niveau Moyen : {scores.moyen}</p>
      <p>✅ Niveau Avancé : {scores.avance}</p>
      {totalScore > 3 ? (
        <h3 className="success">🚀 Excellent travail ! Vous maîtrisez bien les Produits !</h3>
      ) : (
        <p className="fail">📚 Révisez encore un peu pour bien comprendre les concepts, ou retournez voir les flashcards !</p>
      )}
    </div>
  );
};

// Page principale
const Nforms = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0 });
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  // Timer pour les niveaux QCM
  useEffect(() => {
    if (level !== "basic" && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (level !== "basic" && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, level, showResult]);

  // Slide auto pour les flashcards
  useEffect(() => {
    if (level === "basic" && !showResult) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev + 1 < basicSlides.length) {
            return prev + 1;
          } else {
            setLevel("moyen");
            setCurrentQuestion(0);
            setTimeLeft(20);
            return 0;
          }
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    const currentQuestions = questions[level];
    const current = currentQuestions[currentQuestion];
    if (option === current.answer) {
      setScores((prevScores) => ({ ...prevScores, [level]: prevScores[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ Incorrect ! La bonne réponse était : ${current.answer}\n ℹ️ ${current.explanation}`);
    }
    setTimeout(handleNextQuestion, 2500);
  };

  const handleNextQuestion = () => {
    const currentQuestions = questions[level];
    if (currentQuestion + 1 < currentQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20);
      setMessage("");
    } else {
      if (level === "moyen") {
        setLevel("avance");
      } else {
        setShowResult(true);
      }
      setCurrentQuestion(0);
      setTimeLeft(20);
      setMessage("");
    }
  };

  return (
    <div className="qcm-container">
      {showResult ? (
        <Results scores={scores} />
      ) : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0' }}>
              Fixed Inc! 🔹 Niveau : {level.toUpperCase()}
          </h4>

          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} index={currentSlide} total={basicSlides.length} />
          ) : (
            <QuestionCard
              question={questions[level][currentQuestion].question}
              options={questions[level][currentQuestion].options}
              onAnswerClick={handleAnswerClick}
              timeLeft={timeLeft}
            />
          )}

          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Nforms;
