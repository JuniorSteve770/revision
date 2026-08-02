// src/projects/Project3/pages/Page6_TechInterview.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
  {
    question: "Docker : Définition, image vs conteneur",
    answer:
      "◆ **Définition** : Moteur de conteneurisation qui empaquète applications + dépendances ◆ **Image** : modèle en lecture seule ◆ **Conteneur** : instance exécutable de l'image ◆ **Docker Hub** : registre officiel d'images ◆ **Pull vs Run** : pull télécharge, run télécharge SI absent ET démarre ◆ **Port Mapping** : `-p 8080:80` (hôte → conteneur) ◆ **Volume** : persiste les données hors conteneur ◆ **Détaché vs Interactif** : `-d` (arrière-plan) vs `-it` (interactif) ◆ **Nommage** : `--name` pour gérer facilement ◆ **Logs** : `docker logs` pour déboguer ◆ **Exec** : `docker exec` pour exécuter dans un conteneur ◆ **Réseaux** : bridge, host, overlay ◆ **Dockerfile** : construction d'images personnalisées ◆ **Variables** : `-e` pour configurer ◆ **Couches** : chaque instruction crée une couche"
  },
  {
    question: "Docker : Commandes essentielles",
    answer:
      "◆ **Images** : `pull` • `images` • `rmi` • `build -t` • `save` • `load`\n◆ **Conteneurs** : `run -d --name -p` • `ps` • `ps -a` • `stop` • `start` • `restart` • `rm`\n◆ **Logs & exec** : `logs -f` • `exec -it` • `cp` • `commit`\n◆ **Inspect** : `inspect` pour détails (IP, ports, env)\n◆ **Réseau** : `network create/ls/inspect/connect`\n◆ **Volume** : `volume create/ls/inspect/rm`"
  },
  {
    question: "Docker Compose : Définition et commandes",
    answer:
      "◆ **Définition** : Définit et exécute des applications multi-conteneurs avec YAML ◆ **Fichier** : docker-compose.yml ◆ **Version** : 3.8 (recommandée) ◆ **Services** : chaque service = un conteneur ◆ **Réseaux** : par défaut, tous les services communiquent via leurs noms ◆ **Volumes** : persistent les données ◆ **depends_on** : ordre de démarrage ◆ **Scaling** : `--scale service=N` ◆ **Variables** : fichier .env séparé ◆ **Port Mapping** : \"hôte:conteneur\" ◆ **Build** : construit des images personnalisées ◆ **Healthcheck** : vérifie l'état des services ◆ **Profiles** : démarrage sélectif ◆ **Extensions** : réutilise la configuration"
  },
  {
    question: "Docker Compose : Commandes essentielles",
    answer:
      "◆ **Démarrage** : `up -d` • `down -v`\n◆ **Gestion** : `stop` • `start` • `restart` • `ps` • `logs -f` • `exec`\n◆ **Build** : `build` • `pull` • `config` (validation)\n◆ **Scaling** : `scale web=3` • `up --scale web=3`\n◆ **Info** : `top` • `images` • `port web 80` • `run web bash`"
  },
  {
    question: "Kubernetes : Définition et concepts clés",
    answer:
      "◆ **Définition** : Orchestrateur de conteneurs pour déploiement, scaling et gestion ◆ **Minikube** : cluster local pour apprentissage ◆ **Pod** : unité de base (1+ conteneurs, réseau partagé) ◆ **Deployment** : gère pods, mises à jour et rollback ◆ **Service** : expose les pods (ClusterIP, NodePort, LoadBalancer) ◆ **ConfigMap** : config non sensible ◆ **Secret** : données sensibles (encodées) ◆ **Ingress** : routage HTTP/HTTPS externe ◆ **PV/PVC** : persistance des données ◆ **Namespace** : sépare les environnements ◆ **kubectl** : CLI pour interagir ◆ **Labels** : organise et sélectionne les ressources ◆ **Service Discovery** : DNS interne ◆ **HPA** : scaling automatique ◆ **Probes** : Liveness (pod vivant) + Readiness (peut recevoir du trafic)"
  },
  {
    question: "Kubernetes : Commandes essentielles",
    answer:
      "◆ **Ressources** : `get pods/deployments/services/nodes`\n◆ **Description** : `describe pod/deploy/service`\n◆ **Logs** : `logs -f pod` • `logs --previous`\n◆ **Exec** : `exec -it pod -- bash`\n◆ **Apply** : `apply -f fichier.yaml` • `delete -f fichier.yaml`\n◆ **Scaling** : `scale deployment web --replicas=5`\n◆ **Rollout** : `rollout status/history/undo deployment/web`\n◆ **Port-forward** : `port-forward pod 8080:80`\n◆ **Secrets** : `create secret generic`\n◆ **ConfigMap** : `create configmap`\n◆ **Top** : `top pods/nodes` (ressources)"
  },
  {
    question: "ArmoniK : Définition et concepts clés",
    answer:
      "◆ **Définition** : Orchestrateur de calcul distribué HPC développé par l'ANSSI ◆ **Scheduler** : planifie et distribue les tâches ◆ **Worker** : exécute les tâches de calcul ◆ **Task** : unité de travail atomique ◆ **Session** : groupe de tâches liées ◆ **Armer** : base de données d'état ◆ **Agent** : gère les workers ◆ **Partition** : vue logique des workers ◆ **Object Storage** : stockage entrées/sorties ◆ **Amqp** : messagerie entre composants ◆ **Worker Pool** : ensemble de workers ◆ **Auto-scaling** : ajuste dynamiquement les workers ◆ **Result** : sortie d'une tâche ◆ **Workflow** : ensemble de tâches avec dépendances ◆ **Dépendances** : `--depends-on task-id`"
  },
  {
    question: "ArmoniK : Commandes essentielles",
    answer:
      "◆ **Init** : `armonik init` (crée la config)\n◆ **Démarrage** : `armonik start` • `armonik stop` • `armonik status`\n◆ **Sessions** : `create session --name` • `list sessions` • `delete session`\n◆ **Tâches** : `submit --session --payload --input --args --depends-on` • `list tasks` • `wait`\n◆ **Résultats** : `get result --task` • `get result --output`\n◆ **Logs** : `logs --service scheduler` • `logs --task`"
  },
  {
    question: "Bonnes pratiques : Installation, pannes et diagnostics Docker",
    answer:
      "◆ **Installation Linux** : `apt update` • `apt install docker.io` ou `curl -fsSL https://get.docker.com | sh` • `systemctl start docker` • `systemctl enable docker` • `usermod -aG docker $USER`\n◆ **Installation Windows/Mac** : Docker Desktop • WSL2\n◆ **Vérification** : `docker --version` • `docker run hello-world` • `docker info`\n\n◆ **Conteneur ne démarre pas** :\n  1. `docker ps -a` → vérifier l'état (Exited, CrashLoopBackOff)\n  2. `docker logs <conteneur>` → consulter les erreurs\n  3. `docker inspect <conteneur>` → analyser la configuration\n  4. `docker start <conteneur>` → relancer après correction\n\n◆ **Port déjà utilisé** :\n  1. `sudo netstat -tulpn | grep :80` → identifier le processus\n  2. `docker stop <conteneur>` → arrêter le conteneur qui bloque\n  3. `docker run -p 8080:80 ...` → ou changer de port\n\n◆ **Espace disque insuffisant** :\n  1. `docker system df` → visualiser l'utilisation\n  2. `docker system prune -a -f` → nettoyer tout\n  3. `docker volume prune -f` → supprimer volumes inutilisés\n  4. `docker image prune -a -f` → supprimer images non utilisées\n\n◆ **Problème réseau** :\n  1. `docker network ls` → lister les réseaux\n  2. `docker network inspect <network>` → voir les détails\n  3. `docker exec <conteneur> ping <autre_conteneur>` → tester connectivité\n  4. `docker network connect <network> <conteneur>` → reconnecter"
  },
  {
    question: "Bonnes pratiques : Installation, pannes et diagnostics Kubernetes",
    answer:
      "◆ **Minikube** : `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64` • `sudo install minikube-linux-amd64 /usr/local/bin/minikube` • `minikube start --driver=docker`\n◆ **kubectl** : `curl -LO \"https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl\"` • `sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl`\n◆ **K3s** : `curl -sfL https://get.k3s.io | sh -`\n\n◆ **Pod en CrashLoopBackOff** :\n  1. `kubectl get pods` → identifier l'état\n  2. `kubectl describe pod <pod>` → examiner events et erreurs\n  3. `kubectl logs <pod> --previous` → logs avant le crash\n  4. `kubectl get events --sort-by='.lastTimestamp'` → historique\n  5. `kubectl delete pod <pod>` → forcer la recréation\n\n◆ **Node NotReady** :\n  1. `kubectl get nodes` → vérifier l'état des nœuds\n  2. `kubectl describe node <node>` → détails du nœud\n  3. `kubectl top node` → ressources CPU/MEM\n  4. `ssh <node>` → se connecter au nœud\n  5. `systemctl status kubelet` → vérifier le service\n  6. `journalctl -u kubelet -f` → logs du kubelet\n\n◆ **Service inaccessible** :\n  1. `kubectl get svc` → vérifier les services et ports\n  2. `kubectl describe svc <service>` → détails\n  3. `kubectl get endpoints <service>` → vérifier les endpoints\n  4. `kubectl port-forward pod 8080:80` → test local\n  5. `curl http://localhost:8080` → tester l'accès\n\n◆ **Diagnostic général** :\n  1. `kubectl get all --all-namespaces` → tout lister\n  2. `kubectl describe <ressource> <nom>` → décrire une ressource\n  3. `kubectl exec -it <pod> -- sh` → shell dans le Pod\n  4. `kubectl top pods` → ressources des Pods\n  5. `kubectl logs -f <pod>` → suivre les logs en temps réel"
  },
  {
    question: "Comparatif Docker, Compose et Swarm : les outils Docker natifs",
    answer:
      "◆ **Docker** : Conteneur sur 1 machine ◆ Pas de cluster/nœud ◆ Unité = conteneur ◆ Scaling manuel ◆ Volume Docker ◆ Usages : conteneur unique, CI/CD, dev/test\n\n◆ **Compose** : Groupes sur 1 machine ◆ Pas de cluster/nœud ◆ Unité = groupe ◆ Scaling limité ◆ Volume Compose ◆ Usages : dev local, tests intégration, apps multi-services\n\n◆ **Swarm** : Services multi-machines ◆ Cluster Oui ◆ Rôles Manager/Worker ◆ Unité = service ◆ Scaling via réplicas ◆ Volume partagé ◆ Usages : clusters simples, prototypage, compatibilité Docker"
  },
  {
    question: "Comparatif K8s, K3s et ArmoniK : orchestration et HPC",
    answer:
      "◆ **K8s** : Pods/Deployments ◆ Cluster Oui ◆ Rôles Control Plane/Worker ◆ Unité = Pod ◆ Scaling automatique ◆ Persistent Volume ◆ Usages : production, cloud natif, microservices complexes\n\n◆ **K3s** : K8s allégé ◆ Cluster Oui ◆ Rôles CP/Worker ◆ Unité = Pod ◆ Scaling auto ◆ PV + SQLite ◆ Usages : IoT, Edge, Raspberry Pi, ressources limitées\n\n◆ **ArmoniK** : HPC sur K8s ◆ Cluster Oui ◆ Rôles CP/Worker ◆ Unité = tâche ◆ Scaling auto ◆ PV + batch ◆ Usages : calcul scientifique, simulations, données massives"
  }
];

const questions = {
  moyen: [
    {
      question: "Quelle est la différence entre une image Docker et un conteneur ?",
      options: [
        "Une image est un modèle en lecture seule, un conteneur est une instance en cours d'exécution",
        "Un conteneur est un modèle, une image est une instance",
        "Image et conteneur sont identiques",
        "L'image contient les données persistantes du conteneur"
      ],
      answer: "Une image est un modèle en lecture seule, un conteneur est une instance en cours d'exécution",
      explanation: "L'image est statique (modèle). Le conteneur est l'exécution de l'image avec une couche inscriptible."
    },
    {
      question: "Que signifie l'option -p 8080:80 dans docker run ?",
      options: [
        "Le port 8080 du conteneur est mappé vers le port 80 de l'hôte",
        "Le port 8080 de l'hôte est mappé vers le port 80 du conteneur",
        "Les ports 8080 et 80 sont tous les deux exposés",
        "Cela signifie que le conteneur utilise les ports 8080 et 80"
      ],
      answer: "Le port 8080 de l'hôte est mappé vers le port 80 du conteneur",
      explanation: "La syntaxe -p hôte:conteneur signifie que le port 8080 de votre machine est redirigé vers le port 80 du conteneur."
    },
    {
      question: "Quelle combinaison de commandes permet de télécharger une image ET lancer un conteneur en une seule fois ?",
      options: [
        "docker pull puis docker run",
        "docker run seul (télécharge si l'image n'existe pas)",
        "docker start puis docker run",
        "docker create puis docker start"
      ],
      answer: "docker run seul (télécharge si l'image n'existe pas)",
      explanation: "`docker run` télécharge l'image SI elle n'existe pas localement ET démarre le conteneur. C'est une combinaison de pull + create + start."
    },
    {
      question: "Quelle commande permet de voir les logs d'un conteneur Docker en temps réel ?",
      options: [
        "docker logs conteneur",
        "docker logs -f conteneur",
        "docker logs --tail conteneur",
        "docker show logs conteneur"
      ],
      answer: "docker logs -f conteneur",
      explanation: "`-f` (follow) permet de suivre les logs en temps réel, comme `tail -f`."
    },
    {
      question: "À quoi sert un volume Docker ?",
      options: [
        "À isoler les processus du conteneur",
        "À persister les données au-delà du cycle de vie du conteneur",
        "À limiter la mémoire utilisée",
        "À exposer un port réseau vers l'extérieur"
      ],
      answer: "À persister les données au-delà du cycle de vie du conteneur",
      explanation: "Le conteneur est éphémère. Le volume est un stockage externe persistant qui survit à la destruction du conteneur."
    },
    {
      question: "Quelle combinaison de commandes permet de copier un fichier DANS un conteneur puis d'exécuter une commande à l'intérieur ?",
      options: [
        "docker cp puis docker exec",
        "docker copy puis docker run",
        "docker transfer puis docker start",
        "docker move puis docker attach"
      ],
      answer: "docker cp puis docker exec",
      explanation: "`docker cp` copie le fichier dans le conteneur, puis `docker exec` exécute la commande à l'intérieur."
    },
    {
      question: "Que fait l'option -d dans docker compose up -d ?",
      options: [
        "Lance les services en mode debug avec logs détaillés",
        "Lance les services en arrière-plan (détaché)",
        "Supprime les conteneurs après l'exécution",
        "Exécute les services en mode interactif avec terminal"
      ],
      answer: "Lance les services en arrière-plan (détaché)",
      explanation: "`-d` (detach) lance les services en arrière-plan, libérant le terminal pour d'autres commandes."
    },
    {
      question: "Quelle combinaison de commandes Docker Compose permet de démarrer les services en arrière-plan ET de voir les logs d'un service spécifique ?",
      options: [
        "docker compose up -d puis docker compose logs -f service",
        "docker compose start puis docker compose show service",
        "docker compose run puis docker compose output service",
        "docker compose up puis docker compose inspect service"
      ],
      answer: "docker compose up -d puis docker compose logs -f service",
      explanation: "`up -d` démarre en arrière-plan, puis `logs -f service` suit les logs du service spécifique."
    },
    {
      question: "Qu'est-ce qu'un Pod dans Kubernetes ?",
      options: [
        "Un serveur web intégré à Kubernetes",
        "L'unité de base, contenant un ou plusieurs conteneurs partageant le même réseau",
        "Un type de service pour exposer des applications",
        "Un volume de stockage persistant pour les données"
      ],
      answer: "L'unité de base, contenant un ou plusieurs conteneurs partageant le même réseau",
      explanation: "Le Pod est l'unité atomique de Kubernetes. Plusieurs conteneurs dans un Pod communiquent via localhost et partagent des volumes."
    },
    {
      question: "À quoi sert un Deployment dans Kubernetes ?",
      options: [
        "À exposer un service sur le réseau externe",
        "À gérer le scaling, les rolling updates et les rollbacks des Pods",
        "À stocker des données persistantes pour l'application",
        "À configurer des variables d'environnement pour les Pods"
      ],
      answer: "À gérer le scaling, les rolling updates et les rollbacks des Pods",
      explanation: "Le Deployment déclare l'état désiré des Pods (réplicas, image). K8s maintient cet état automatiquement."
    },
    {
      question: "Quelle combinaison de commandes kubectl permet d'appliquer une configuration ET de vérifier l'état des Pods ?",
      options: [
        "kubectl apply -f fichier.yaml puis kubectl get pods",
        "kubectl create -f fichier.yaml puis kubectl describe pods",
        "kubectl run -f fichier.yaml puis kubectl list pods",
        "kubectl deploy -f fichier.yaml puis kubectl show pods"
      ],
      answer: "kubectl apply -f fichier.yaml puis kubectl get pods",
      explanation: "`apply -f` applique la configuration, puis `get pods` vérifie l'état des Pods créés."
    },
    {
      question: "Qu'est-ce qu'une session dans ArmoniK ?",
      options: [
        "Un worker qui exécute des tâches de calcul",
        "Un groupe de tâches liées logiquement partageant le même contexte",
        "Un type de stockage pour les résultats de calcul",
        "Une commande de déploiement de l'orchestrateur"
      ],
      answer: "Un groupe de tâches liées logiquement partageant le même contexte",
      explanation: "Une session regroupe des tâches qui partagent le même contexte et la même configuration."
    },
    {
      question: "Quelle combinaison de commandes Docker permet de créer une image ET de la lancer immédiatement ?",
      options: [
        "docker build -t image . puis docker run image",
        "docker create image puis docker start image",
        "docker commit puis docker run",
        "docker save puis docker load"
      ],
      answer: "docker build -t image . puis docker run image",
      explanation: "`docker build` construit l'image avec un tag, puis `docker run` la lance immédiatement."
    },
    {
      question: "Comment lister tous les conteneurs Docker (actifs et arrêtés) ?",
      options: [
        "docker list --all",
        "docker ps -a",
        "docker ps",
        "docker show --all"
      ],
      answer: "docker ps -a",
      explanation: "`docker ps` liste uniquement les conteneurs actifs. `docker ps -a` liste TOUS les conteneurs (même arrêtés)."
    },
    {
      question: "Que signifie l'option -e dans docker run ?",
      options: [
        "Définit une variable d'environnement pour configurer le conteneur",
        "Expose un port du conteneur vers l'extérieur",
        "Exécute le conteneur en mode interactif",
        "Utilise un volume externe pour les données"
      ],
      answer: "Définit une variable d'environnement pour configurer le conteneur",
      explanation: "`-e NOM=valeur` définit une variable d'environnement dans le conteneur. Essentiel pour la configuration."
    },
    {
      question: "Quelle combinaison de commandes Docker Compose permet d'arrêter les services ET de nettoyer les volumes ?",
      options: [
        "docker compose stop puis docker compose rm",
        "docker compose down -v",
        "docker compose kill puis docker compose prune",
        "docker compose pause puis docker compose delete"
      ],
      answer: "docker compose down -v",
      explanation: "`docker compose down -v` arrête les services, supprime les conteneurs, les réseaux ET les volumes."
    }
  ],
  avance: [
    {
      question: "Comment créer un réseau Docker personnalisé pour faire communiquer plusieurs conteneurs ?",
      options: [
        "docker network create mon-reseau",
        "docker network new mon-reseau",
        "docker create network mon-reseau",
        "docker network add mon-reseau"
      ],
      answer: "docker network create mon-reseau",
      explanation: "`docker network create` crée un réseau personnalisé. Les conteneurs sur ce réseau communiquent via leurs noms."
    },
    {
      question: "Quelle combinaison de commandes permet de lancer 3 instances d'un service avec Docker Compose ?",
      options: [
        "docker compose up -d --scale service=3",
        "docker compose run --replicas 3 service",
        "docker compose start --instances 3 service",
        "docker compose deploy --scale service=3"
      ],
      answer: "docker compose up -d --scale service=3",
      explanation: "`--scale service=N` crée N instances du service avec `up -d` pour les lancer en arrière-plan."
    },
    {
      question: "Qu'est-ce qu'une ConfigMap dans Kubernetes ?",
      options: [
        "Un outil de monitoring pour les Pods",
        "Un stockage de données de configuration non sensibles, séparées du code",
        "Un type de Pod spécial pour la configuration",
        "Un serveur DNS interne au cluster"
      ],
      answer: "Un stockage de données de configuration non sensibles, séparées du code",
      explanation: "ConfigMap stocke des données de configuration (variables d'environnement, fichiers) séparées du code."
    },
    {
      question: "Quelle combinaison de commandes Docker permet d'arrêter ET de supprimer un conteneur en une seule fois ?",
      options: [
        "docker stop conteneur puis docker rm conteneur",
        "docker rm -f conteneur",
        "docker kill conteneur puis docker delete",
        "docker stop conteneur puis docker delete"
      ],
      answer: "docker rm -f conteneur",
      explanation: "`docker rm -f` force l'arrêt ET la suppression du conteneur en une seule commande."
    },
    {
      question: "Comment les conteneurs Docker communiquent-ils sur un réseau personnalisé ?",
      options: [
        "Via leur adresse IP attribuée automatiquement",
        "Via leur nom de conteneur (résolution DNS interne)",
        "Via leur ID unique de conteneur",
        "Via le port 80 par défaut"
      ],
      answer: "Via leur nom de conteneur (résolution DNS interne)",
      explanation: "Sur un réseau personnalisé, les conteneurs peuvent se joindre par leur nom. Ex: `ping mysql` depuis un autre conteneur."
    },
    {
      question: "Quelle combinaison de commandes Kubernetes permet de voir les logs d'un Pod ET d'exécuter une commande à l'intérieur ?",
      options: [
        "kubectl logs pod puis kubectl exec -it pod -- bash",
        "kubectl describe pod puis kubectl run pod",
        "kubectl get pod puis kubectl attach pod",
        "kubectl show pod puis kubectl enter pod"
      ],
      answer: "kubectl logs pod puis kubectl exec -it pod -- bash",
      explanation: "`logs` affiche les logs, `exec -it` ouvre un shell interactif dans le Pod."
    },
    {
      question: "Qu'est-ce qu'un PersistentVolume (PV) dans Kubernetes ?",
      options: [
        "Un volume temporaire qui disparaît avec le Pod",
        "Un stockage persistant qui survit au cycle de vie des Pods",
        "Un volume partagé entre plusieurs clusters Kubernetes",
        "Un type de Pod spécial pour le stockage"
      ],
      answer: "Un stockage persistant qui survit au cycle de vie des Pods",
      explanation: "PersistentVolume (PV) est une ressource de stockage provisionnée par l'administrateur. Les Pods y accèdent via PVC."
    },
    {
      question: "Comment exposer un Pod Kubernetes sur le port 8080 de l'hôte pour le débogage ?",
      options: [
        "kubectl expose pod --port=8080",
        "kubectl port-forward pod 8080:80",
        "kubectl publish pod 8080",
        "kubectl forward pod 80:8080"
      ],
      answer: "kubectl port-forward pod 8080:80",
      explanation: "`port-forward` redirige le port local 8080 vers le port 80 du Pod. Utile pour le debugging local."
    },
    {
      question: "Qu'est-ce qu'un Ingress dans Kubernetes ?",
      options: [
        "Un type de Pod pour le routage",
        "Un contrôleur qui gère l'accès externe avec routage HTTP/HTTPS",
        "Un volume de stockage persistant",
        "Un outil de monitoring intégré"
      ],
      answer: "Un contrôleur qui gère l'accès externe avec routage HTTP/HTTPS",
      explanation: "Ingress gère l'accès externe aux services, avec routage basé sur les hôtes et les chemins."
    },
    {
      question: "Quelle combinaison de commandes ArmoniK permet de créer une session ET de soumettre une tâche ?",
      options: [
        "armonik create session puis armonik submit --session",
        "armonik init puis armonik run",
        "armonik start puis armonik task",
        "armonik new session puis armonik add task"
      ],
      answer: "armonik create session puis armonik submit --session",
      explanation: "`create session` crée la session, puis `submit --session` soumet la tâche dans cette session."
    },
    {
      question: "Quelle combinaison de commandes Docker permet de lancer un conteneur MySQL AVEC variables d'environnement ET volume persistant ?",
      options: [
        "docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -v mysql-data:/var/lib/mysql mysql",
        "docker start mysql -env MYSQL_ROOT_PASSWORD=root -volume mysql-data",
        "docker create mysql --env root=root --volume mysql-data",
        "docker run mysql -p 3306 -v data mysql"
      ],
      answer: "docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -v mysql-data:/var/lib/mysql mysql",
      explanation: "`-e` pour les variables, `-v` pour le volume persistant, `-d` pour l'arrière-plan."
    },
    {
      question: "Comment voir les logs d'un service spécifique dans Docker Compose ?",
      options: [
        "docker compose logs -f service",
        "docker compose show service",
        "docker logs service",
        "docker compose output service"
      ],
      answer: "docker compose logs -f service",
      explanation: "`docker compose logs -f service` affiche et suit les logs du service spécifié."
    },
    {
      question: "Qu'est-ce qu'un Secret dans Kubernetes ?",
      options: [
        "Un type de service caché non exposé",
        "Un stockage de données sensibles (mots de passe, clés API) encodées",
        "Un réseau privé isolé",
        "Un pod invisible aux autres pods"
      ],
      answer: "Un stockage de données sensibles (mots de passe, clés API) encodées",
      explanation: "Secret stocke des données sensibles comme les mots de passe, tokens, clés API. Les données sont encodées en base64."
    },
    {
      question: "Quelle combinaison de commandes Docker permet de sauvegarder une image ET de la charger sur un autre poste ?",
      options: [
        "docker save image > image.tar puis docker load < image.tar",
        "docker export image > image.tar puis docker import < image.tar",
        "docker backup image puis docker restore image",
        "docker copy image puis docker paste image"
      ],
      answer: "docker save image > image.tar puis docker load < image.tar",
      explanation: "`docker save` sauvegarde l'image dans un fichier tar, `docker load` la charge depuis ce fichier."
    },
    {
      question: "Que fait kubectl describe pod ?",
      options: [
        "Affiche les logs en temps réel du pod",
        "Affiche des détails complets (events, état, conditions, IP)",
        "Supprime définitivement le pod",
        "Redémarre le pod automatiquement"
      ],
      answer: "Affiche des détails complets (events, état, conditions, IP)",
      explanation: "`describe` donne des détails complets (events, état, conditions). `get -o yaml` donne la définition YAML brute."
    },
    {
      question: "Quelle combinaison de commandes ArmoniK permet de soumettre une tâche AVEC dépendance ET de récupérer le résultat ?",
      options: [
        "armonik submit --depends-on task-id puis armonik get result --task",
        "armonik run --after task-id puis armonik download",
        "armonik task --depends task-id puis armonik output",
        "armonik start --wait task-id puis armonik fetch"
      ],
      answer: "armonik submit --depends-on task-id puis armonik get result --task",
      explanation: "`--depends-on` spécifie la dépendance, puis `get result` récupère le résultat de la tâche."
    }
  ],
  expert: [
    {
      question: "Quelle combinaison de commandes Kubernetes permet de mettre à jour l'image d'un Deployment AVEC rolling update ?",
      options: [
        "kubectl set image deploy/app container=new:v2 puis kubectl rollout status",
        "kubectl update deploy/app --image=new:v2 puis kubectl wait",
        "kubectl patch deploy/app --image=new:v2 puis kubectl describe",
        "kubectl replace deploy/app --image=new:v2 puis kubectl get pods"
      ],
      answer: "kubectl set image deploy/app container=new:v2 puis kubectl rollout status",
      explanation: "`set image` déclenche le rolling update, `rollout status` suit la progression du déploiement."
    },
    {
      question: "Dans Docker Swarm, comment créer un réseau overlay pour les services multi-hôtes ?",
      options: [
        "docker network create --driver overlay mon-reseau",
        "docker swarm network create mon-reseau",
        "docker overlay create mon-reseau",
        "docker service network create mon-reseau"
      ],
      answer: "docker network create --driver overlay mon-reseau",
      explanation: "`--driver overlay` crée un réseau multi-hôtes pour Swarm. Les services peuvent l'utiliser avec `--network`."
    },
    {
      question: "Quelle est la différence entre un ReplicaSet et un Deployment dans Kubernetes ?",
      options: [
        "ReplicaSet et Deployment sont identiques et interchangeables",
        "ReplicaSet maintient un nombre fixe de Pods, Deployment gère les rolling updates avec ReplicaSet en interne",
        "Deployment est obsolète et remplacé par ReplicaSet",
        "ReplicaSet est pour les bases de données, Deployment pour les applications web"
      ],
      answer: "ReplicaSet maintient un nombre fixe de Pods, Deployment gère les rolling updates avec ReplicaSet en interne",
      explanation: "Le ReplicaSet assure qu'un nombre spécifié de Pods est en cours d'exécution. Le Deployment est une couche au-dessus qui gère les rolling updates et rollbacks."
    },
    {
      question: "Quelle combinaison de commandes ArmoniK permet de créer un workflow avec dépendances entre tâches ?",
      options: [
        "armonik submit --depends-on task-id pour chaque tâche dépendante",
        "armonik link task1 task2 puis armonik run",
        "armonik chain task1 task2 puis armonik execute",
        "armonik sequence task1 task2 puis armonik start"
      ],
      answer: "armonik submit --depends-on task-id pour chaque tâche dépendante",
      explanation: "Chaque tâche utilise `--depends-on` pour spécifier ses dépendances. Le scheduler exécute dans l'ordre."
    },
    {
      question: "Quelle combinaison de commandes Docker permet de nettoyer TOUTES les ressources inutilisées (images, conteneurs, réseaux, volumes) ?",
      options: [
        "docker system prune -a -f puis docker volume prune -f",
        "docker clean --all",
        "docker remove --unused",
        "docker purge --everything"
      ],
      answer: "docker system prune -a -f puis docker volume prune -f",
      explanation: "`system prune -a -f` nettoie images, conteneurs, réseaux. `volume prune -f` nettoie les volumes inutilisés."
    },
    {
      question: "Qu'est-ce qu'un PersistentVolumeClaim (PVC) dans Kubernetes ?",
      options: [
        "Un volume physique sur le nœud",
        "Une demande de stockage par un Pod, qui déclenche l'attribution d'un PV",
        "Un type de service pour le stockage",
        "Un cluster de stockage distribué"
      ],
      answer: "Une demande de stockage par un Pod, qui déclenche l'attribution d'un PV",
      explanation: "Un PVC est une demande de stockage par un Pod. Le cluster attribue un PV disponible qui répond aux critères demandés."
    },
    {
      question: "Quelle combinaison de commandes ArmoniK permet de récupérer un résultat ET de le sauvegarder dans un fichier ?",
      options: [
        "armonik get result --task task-id --output fichier.txt",
        "armonik download task-id > fichier.txt",
        "armonik result task-id --save fichier.txt",
        "armonik fetch task-id --file fichier.txt"
      ],
      answer: "armonik get result --task task-id --output fichier.txt",
      explanation: "`--output` sauvegarde le résultat directement dans le fichier spécifié."
    },
    {
      question: "Quelle combinaison de commandes Kubernetes permet de voir l'historique des déploiements ET d'annuler le dernier ?",
      options: [
        "kubectl rollout history deployment/web puis kubectl rollout undo",
        "kubectl history deployment/web puis kubectl rollback",
        "kubectl get deployments puis kubectl revert",
        "kubectl describe deployment/web puis kubectl restore"
      ],
      answer: "kubectl rollout history deployment/web puis kubectl rollout undo",
      explanation: "`rollout history` affiche les versions, `rollout undo` annule le dernier déploiement."
    },
    {
      question: "Comment attendre la fin de toutes les tâches d'une session ArmoniK ?",
      options: [
        "armonik wait --session session-id",
        "armonik sleep session-id",
        "armonik monitor session-id",
        "armonik track session-id"
      ],
      answer: "armonik wait --session session-id",
      explanation: "`armonik wait --session` bloque jusqu'à ce que toutes les tâches de la session soient terminées."
    },
    {
      question: "Quelle combinaison de commandes Docker permet de construire une image ET de la taguer pour Docker Hub ?",
      options: [
        "docker build -t monimage:latest . puis docker tag monimage:latest utilisateur/monimage:latest",
        "docker build monimage puis docker push monimage",
        "docker create --tag monimage puis docker tag monimage hub",
        "docker make monimage puis docker hub tag monimage"
      ],
      answer: "docker build -t monimage:latest . puis docker tag monimage:latest utilisateur/monimage:latest",
      explanation: "`docker build -t` construit et tague, `docker tag` ajoute le préfixe utilisateur pour Docker Hub."
    },
    {
      question: "Quelle combinaison de commandes kubectl permet de redimensionner un Deployment ET de vérifier le résultat ?",
      options: [
        "kubectl scale deployment web --replicas=5 puis kubectl get pods",
        "kubectl resize deployment web 5 puis kubectl list pods",
        "kubectl update deployment web --replicas=5 puis kubectl show pods",
        "kubectl set deployment web --scale=5 puis kubectl describe pods"
      ],
      answer: "kubectl scale deployment web --replicas=5 puis kubectl get pods",
      explanation: "`scale` modifie le nombre de réplicas, `get pods` vérifie que les nouveaux Pods sont créés."
    },
    {
      question: "Que signifie l'erreur CrashLoopBackOff dans Kubernetes ?",
      options: [
        "Le Pod a été supprimé par l'utilisateur",
        "Le Pod crash en boucle et Kubernetes ne parvient pas à le maintenir en vie",
        "Le Pod est en attente de ressources CPU",
        "Le Pod est en cours de déploiement"
      ],
      answer: "Le Pod crash en boucle et Kubernetes ne parvient pas à le maintenir en vie",
      explanation: "CrashLoopBackOff signifie que le Pod crash au démarrage, redémarre, recrash, etc. Kubernetes augmente le délai entre les tentatives."
    },
    {
      question: "Quelle combinaison de commandes ArmoniK permet de lister les sessions ET de supprimer une session spécifique ?",
      options: [
        "armonik list sessions puis armonik delete session --session id",
        "armonik show sessions puis armonik remove session id",
        "armonik get sessions puis armonik kill session id",
        "armonik display sessions puis armonik clean session id"
      ],
      answer: "armonik list sessions puis armonik delete session --session id",
      explanation: "`list sessions` affiche toutes les sessions avec leurs IDs, `delete session` supprime celle spécifiée."
    },
    {
      question: "Quelle combinaison de commandes Docker Compose permet de construire les images ET de démarrer les services ?",
      options: [
        "docker compose build puis docker compose up -d",
        "docker compose make puis docker compose start",
        "docker compose create puis docker compose run",
        "docker compose compile puis docker compose launch"
      ],
      answer: "docker compose build puis docker compose up -d",
      explanation: "`build` construit les images personnalisées, `up -d` démarre les services en arrière-plan."
    },
    {
      question: "Quelle combinaison de commandes Kubernetes permet d'exposer un Deployment en NodePort ET de récupérer l'URL ?",
      options: [
        "kubectl expose deployment web --type=NodePort --port=80 puis minikube service web --url",
        "kubectl create service web --type=NodePort puis kubectl get service web",
        "kubectl deploy web --expose --type=NodePort puis kubectl describe service web",
        "kubectl run web --expose --port=80 --type=NodePort puis kubectl get svc web"
      ],
      answer: "kubectl expose deployment web --type=NodePort --port=80 puis minikube service web --url",
      explanation: "`expose` crée un service NodePort, `minikube service --url` récupère l'URL d'accès."
    }
  ]
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

const Flashcard = ({ slide, timeLeft }) => (
  <div className="question-card" style={{ fontSize: '14px', margin: '0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a73e8', margin: '0' }}>{slide.question}</p>
      <Timer timeLeft={timeLeft} />
    </div>
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
        ? <h3 className="success">🚀 Docker, Kubernetes & ArmoniK maîtrisés !</h3>
        : <p className="fail">📚 Révisez Docker, Compose, Kubernetes et ArmoniK.</p>
      }
    </div>
  );
};

const Page6_TechInterview = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(15);
  const [slideTimeLeft, setSlideTimeLeft] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(15);
      setMessage("");
    } else {
      if (level === "moyen") { 
        setLevel("avance"); 
        setCurrentQuestion(0);
        setTimeLeft(15);
        setMessage("");
      } else if (level === "avance") { 
        setLevel("expert");
        setCurrentQuestion(0);
        setTimeLeft(15);
        setMessage("");
      } else { 
        setShowResult(true); 
      }
    }
  }, [level, currentQuestion]);

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else {
        handleNextQuestion();
      }
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const slideTimer = setInterval(() => {
        setSlideTimeLeft(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            setCurrentSlide(prevSlide => {
              if (prevSlide + 1 < basicSlides.length) {
                setSlideTimeLeft(15);
                return prevSlide + 1;
              } else {
                setLevel("moyen");
                setCurrentQuestion(0);
                setTimeLeft(15);
                setSlideTimeLeft(15);
                return 0;
              }
            });
            return 15;
          }
        });
      }, 1000);
      return () => clearInterval(slideTimer);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
    const current = questions[level][currentQuestion];
    if (option === current.answer) {
      setScores(p => ({ ...p, [level]: p[level] + 1 }));
      setMessage("✅ Correct !");
    } else {
      setMessage(`❌ Réponse : ${current.answer}\n\nℹ️ ${current.explanation}`);
    }
    setTimeout(() => {
      handleNextQuestion();
    }, 4000);
  };

  return (
    <div className="qcm-container">
      {showResult ? <Results scores={scores} /> : (
        <div>
          <h4 className="subtitle" style={{ fontSize: '10px', margin: '0 0 6px 0' }}>
            Docker & Orchestration 🔹 {level === "basic"
              ? `Slide ${currentSlide + 1}/${basicSlides.length}`
              : `QCM ${level.toUpperCase()} — Q${currentQuestion + 1}/${questions[level].length}`
            }
          </h4>
          {level === "basic" ? (
            <Flashcard slide={basicSlides[currentSlide]} timeLeft={slideTimeLeft} />
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

export default Page6_TechInterview;