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
      explanation: "L'image est statique (modèle). Le conteneur est l'exécution de l'image avec une couche inscriptible. Supprimer un conteneur ne supprime pas l'image."
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
      question: "Quelle commande permet de voir les logs d'un conteneur Docker ?",
      options: [
        "docker logs",
        "docker show logs",
        "docker print",
        "docker tail"
      ],
      answer: "docker logs",
      explanation: "`docker logs conteneur` affiche les logs. Avec `-f` pour suivre en temps réel (tail -f)."
    },
    {
      question: "À quoi sert un volume Docker ?",
      options: [
        "À isoler les processus",
        "À persister les données au-delà du cycle de vie du conteneur",
        "À limiter la mémoire",
        "À exposer un port réseau"
      ],
      answer: "À persister les données au-delà du cycle de vie du conteneur",
      explanation: "Le conteneur est éphémère. Le volume est un stockage externe persistant qui survit à la destruction du conteneur."
    },
    {
      question: "Quelle commande permet d'exécuter une commande dans un conteneur en cours ?",
      options: [
        "docker run",
        "docker exec",
        "docker attach",
        "docker start"
      ],
      answer: "docker exec",
      explanation: "`docker exec -it conteneur sh` ouvre un shell interactif dans le conteneur. `run` crée un nouveau conteneur."
    },
    {
      question: "Que fait l'option -d dans docker compose up ?",
      options: [
        "Lance les services en mode debug",
        "Lance les services en arrière-plan (détaché)",
        "Supprime les conteneurs après l'exécution",
        "Exécute les services en mode interactif"
      ],
      answer: "Lance les services en arrière-plan (détaché)",
      explanation: "`-d` (detach) lance les services en arrière-plan, libérant le terminal pour d'autres commandes."
    },
    {
      question: "Qu'est-ce qu'un Pod dans Kubernetes ?",
      options: [
        "Un serveur web",
        "L'unité de base, contenant un ou plusieurs conteneurs partageant le même réseau",
        "Un type de service",
        "Un volume de stockage"
      ],
      answer: "L'unité de base, contenant un ou plusieurs conteneurs partageant le même réseau",
      explanation: "Le Pod est l'unité atomique de Kubernetes. Plusieurs conteneurs dans un Pod peuvent communiquer via localhost et partager des volumes."
    },
    {
      question: "À quoi sert un Deployment dans Kubernetes ?",
      options: [
        "Exposer un service sur le réseau",
        "Gérer le scaling, les rolling updates et les rollbacks des Pods",
        "Stocker des données persistantes",
        "Configurer des variables d'environnement"
      ],
      answer: "Gérer le scaling, les rolling updates et les rollbacks des Pods",
      explanation: "Le Deployment déclare l'état désiré des Pods (réplicas, image). K8s maintient cet état automatiquement."
    },
    {
      question: "Quelle commande kubectl applique un fichier de configuration ?",
      options: [
        "kubectl create -f",
        "kubectl apply -f",
        "kubectl run -f",
        "kubectl deploy -f"
      ],
      answer: "kubectl apply -f",
      explanation: "`kubectl apply -f pod.yaml` applique la configuration (create ou update). `create` ne fait que créer."
    },
    {
      question: "Qu'est-ce qu'une session dans ArmoniK ?",
      options: [
        "Un worker qui exécute des tâches",
        "Un groupe de tâches liées logiquement",
        "Un type de stockage",
        "Une commande de déploiement"
      ],
      answer: "Un groupe de tâches liées logiquement",
      explanation: "Une session regroupe des tâches qui partagent le même contexte et la même configuration."
    },
    {
      question: "Comment copier un fichier dans un conteneur Docker ?",
      options: [
        "docker copy",
        "docker cp",
        "docker transfer",
        "docker push"
      ],
      answer: "docker cp",
      explanation: "`docker cp <source> <conteneur>:<destination>` copie des fichiers entre l'hôte et le conteneur."
    },
    {
      question: "Que fait la commande docker commit ?",
      options: [
        "Supprime une image",
        "Crée une nouvelle image à partir d'un conteneur modifié",
        "Envoie une image vers Docker Hub",
        "Construit une image depuis un Dockerfile"
      ],
      answer: "Crée une nouvelle image à partir d'un conteneur modifié",
      explanation: "`docker commit` sauvegarde les modifications d'un conteneur dans une nouvelle image."
    },
    {
      question: "Comment lister tous les conteneurs Docker (actifs et arrêtés) ?",
      options: [
        "docker list",
        "docker ps -a",
        "docker ps",
        "docker show"
      ],
      answer: "docker ps -a",
      explanation: "`docker ps` liste uniquement les conteneurs actifs. `docker ps -a` liste TOUS les conteneurs (même arrêtés)."
    },
    {
      question: "Que signifie l'option -e dans docker run ?",
      options: [
        "Définit une variable d'environnement",
        "Expose un port",
        "Exécute en mode interactif",
        "Utilise un volume externe"
      ],
      answer: "Définit une variable d'environnement",
      explanation: "`-e NOM=valeur` définit une variable d'environnement dans le conteneur. Essentiel pour la configuration."
    },
    {
      question: "Quel est le rôle de depends_on dans Docker Compose ?",
      options: [
        "Définit les dépendances entre services (ordre de démarrage)",
        "Définit les variables d'environnement",
        "Configure les volumes",
        "Expose les ports des services"
      ],
      answer: "Définit les dépendances entre services (ordre de démarrage)",
      explanation: "`depends_on` assure qu'un service démarre après un autre. Utile quand un service a besoin d'un autre pour fonctionner."
    }
  ],
  avance: [
    {
      question: "Comment créer un réseau Docker personnalisé ?",
      options: [
        "docker network create",
        "docker network new",
        "docker create network",
        "docker network add"
      ],
      answer: "docker network create",
      explanation: "`docker network create <nom>` crée un réseau personnalisé. Les conteneurs sur ce réseau communiquent via leurs noms."
    },
    {
      question: "Comment mettre à l'échelle un service avec Docker Compose ?",
      options: [
        "docker compose scale service=3",
        "docker compose up --scale service=3 -d",
        "docker compose up service=3",
        "docker scale service 3"
      ],
      answer: "docker compose up --scale service=3 -d",
      explanation: "`--scale service=N` crée N instances du service. `docker compose up -d` doit être utilisé pour appliquer le scaling."
    },
    {
      question: "Qu'est-ce qu'une ConfigMap dans Kubernetes ?",
      options: [
        "Un outil de monitoring",
        "Un stockage de données de configuration (non sensibles)",
        "Un type de Pod",
        "Un serveur DNS"
      ],
      answer: "Un stockage de données de configuration (non sensibles)",
      explanation: "ConfigMap stocke des données de configuration (variables d'environnement, fichiers) séparées du code."
    },
    {
      question: "Quelle est la différence entre docker stop et docker rm ?",
      options: [
        "stop arrête le conteneur, rm le supprime définitivement",
        "stop supprime, rm arrête",
        "Les deux font la même chose",
        "stop redémarre, rm arrête"
      ],
      answer: "stop arrête le conteneur, rm le supprime définitivement",
      explanation: "`docker stop` arrête le conteneur mais il reste présent (peut être redémarré). `docker rm` supprime le conteneur."
    },
    {
      question: "Comment les conteneurs Docker communiquent-ils sur un réseau personnalisé ?",
      options: [
        "Via leur adresse IP",
        "Via leur nom de conteneur",
        "Via leur ID",
        "Via le port 80"
      ],
      answer: "Via leur nom de conteneur",
      explanation: "Sur un réseau personnalisé, les conteneurs peuvent se joindre par leur nom. Ex: `ping mysql` depuis un autre conteneur."
    },
    {
      question: "Que fait la commande docker compose down -v ?",
      options: [
        "Arrête les services",
        "Arrête et supprime les conteneurs, réseaux ET volumes",
        "Arrête et redémarre",
        "Supprime uniquement les images"
      ],
      answer: "Arrête et supprime les conteneurs, réseaux ET volumes",
      explanation: "`-v` supprime aussi les volumes définis dans le compose. Attention : les données persistantes sont perdues."
    },
    {
      question: "Qu'est-ce qu'un PersistentVolume (PV) dans Kubernetes ?",
      options: [
        "Un volume temporaire",
        "Un stockage persistant qui survit au cycle de vie des Pods",
        "Un volume partagé entre clusters",
        "Un type de Pod spécial"
      ],
      answer: "Un stockage persistant qui survit au cycle de vie des Pods",
      explanation: "PersistentVolume (PV) est une ressource de stockage provisionnée par l'administrateur. Les Pods y accèdent via PVC."
    },
    {
      question: "Comment exposer un Pod Kubernetes sur le port 8080 de l'hôte ?",
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
        "Un type de Pod",
        "Un volume de stockage",
        "Un contrôleur qui gère l'accès externe avec routage HTTP/HTTPS",
        "Un outil de monitoring"
      ],
      answer: "Un contrôleur qui gère l'accès externe avec routage HTTP/HTTPS",
      explanation: "Ingress gère l'accès externe aux services, avec routage basé sur les hôtes et les chemins."
    },
    {
      question: "Quelle est la commande pour soumettre une tâche dans ArmoniK ?",
      options: [
        "armonik run",
        "armonik submit",
        "armonik start",
        "armonik create"
      ],
      answer: "armonik submit",
      explanation: "`armonik submit --session --payload --input --args` soumet une tâche de calcul à l'orchestrateur ArmoniK."
    },
    {
      question: "Comment voir les logs d'un service dans Docker Compose ?",
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
        "Un type de service caché",
        "Un stockage de données sensibles (mots de passe, clés API)",
        "Un réseau privé",
        "Un pod invisible"
      ],
      answer: "Un stockage de données sensibles (mots de passe, clés API)",
      explanation: "Secret stocke des données sensibles comme les mots de passe, tokens, clés API. Les données sont encodées en base64."
    },
    {
      question: "Comment créer un volume Docker persistant ?",
      options: [
        "docker volume create",
        "docker volume new",
        "docker create volume",
        "docker volume add"
      ],
      answer: "docker volume create",
      explanation: "`docker volume create <nom>` crée un volume persistant. Le volume survit à la suppression des conteneurs."
    },
    {
      question: "Que fait kubectl describe pod ?",
      options: [
        "Affiche les logs du pod",
        "Affiche des détails complets (events, état, conditions)",
        "Supprime le pod",
        "Redémarre le pod"
      ],
      answer: "Affiche des détails complets (events, état, conditions)",
      explanation: "`describe` donne des détails complets (events, état, conditions). `get -o yaml` donne la définition YAML brute."
    },
    {
      question: "Comment redémarrer un conteneur Docker arrêté ?",
      options: [
        "docker restart",
        "docker start",
        "docker run",
        "docker revive"
      ],
      answer: "docker start",
      explanation: "`docker start <conteneur>` redémarre un conteneur arrêté. `restart` redémarre un conteneur en cours d'exécution."
    }
  ],
  expert: [
    {
      question: "Quelle est la commande pour appliquer un rolling update dans Kubernetes ?",
      options: [
        "kubectl update deploy/app --image=new:v2",
        "kubectl set image deploy/app container=new:v2",
        "kubectl patch deploy/app --image=new:v2",
        "kubectl replace deploy/app --image=new:v2"
      ],
      answer: "kubectl set image deploy/app container=new:v2",
      explanation: "`kubectl set image deployment/nom conteneur=nouvelle_image` déclenche un rolling update. Exemple : `kubectl set image deploy/app app=nginx:1.21`."
    },
    {
      question: "Dans Docker Swarm, comment créer un réseau overlay pour les services ?",
      options: [
        "docker network create --driver overlay mon-reseau",
        "docker swarm network create mon-reseau",
        "docker overlay create mon-reseau",
        "docker service network create mon-reseau"
      ],
      answer: "docker network create --driver overlay mon-reseau",
      explanation: "`docker network create --driver overlay mon-reseau` crée un réseau multi-hôtes. Les services Swarm peuvent l'utiliser avec `--network mon-reseau`."
    },
    {
      question: "Quelle est la différence entre un ReplicaSet et un Deployment dans Kubernetes ?",
      options: [
        "ReplicaSet et Deployment sont identiques",
        "ReplicaSet maintient un nombre fixe de Pods, Deployment gère les rolling updates avec ReplicaSet en interne",
        "Deployment est obsolète, ReplicaSet le remplace",
        "ReplicaSet est pour les bases de données"
      ],
      answer: "ReplicaSet maintient un nombre fixe de Pods, Deployment gère les rolling updates avec ReplicaSet en interne",
      explanation: "Le ReplicaSet assure qu'un nombre spécifié de Pods est en cours d'exécution. Le Deployment est une couche au-dessus qui gère les rolling updates et rollbacks."
    },
    {
      question: "Comment utiliser les dépendances entre tâches dans ArmoniK ?",
      options: [
        "armonik submit --depends-on task-id",
        "armonik wait task-id",
        "armonik depend task-id",
        "armonik link task-id"
      ],
      answer: "armonik submit --depends-on task-id",
      explanation: "`--depends-on task-id` spécifie qu'une tâche dépend d'une autre. Le scheduler exécute les tâches dans l'ordre des dépendances."
    },
    {
      question: "Que fait la commande docker system prune -a -f ?",
      options: [
        "Supprime tous les conteneurs",
        "Nettoye toutes les ressources inutilisées (images, conteneurs, réseaux)",
        "Supprime uniquement les images",
        "Redémarre Docker"
      ],
      answer: "Nettoye toutes les ressources inutilisées (images, conteneurs, réseaux)",
      explanation: "`docker system prune -a -f` nettoie toutes les ressources inutilisées sans confirmation. Utile pour libérer de l'espace disque."
    },
    {
      question: "Qu'est-ce qu'un PersistentVolumeClaim (PVC) dans Kubernetes ?",
      options: [
        "Un volume physique",
        "Une demande de stockage par un Pod",
        "Un type de service",
        "Un cluster de stockage"
      ],
      answer: "Une demande de stockage par un Pod",
      explanation: "Un PVC est une demande de stockage par un Pod. Le cluster attribue un PV disponible qui répond aux critères demandés."
    },
    {
      question: "Comment récupérer le résultat d'une tâche ArmoniK ?",
      options: [
        "armonik get result --task task-id",
        "armonik download task-id",
        "armonik output task-id",
        "armonik show task-id"
      ],
      answer: "armonik get result --task task-id",
      explanation: "`armonik get result --task task-id` récupère le résultat d'une tâche. L'option `--output` permet de sauvegarder dans un fichier."
    },
    {
      question: "Quelle est la commande pour voir l'historique des déploiements Kubernetes ?",
      options: [
        "kubectl rollout history deployment/web",
        "kubectl history deployment/web",
        "kubectl get history deployment/web",
        "kubectl describe deployment/web"
      ],
      answer: "kubectl rollout history deployment/web",
      explanation: "`kubectl rollout history deployment/web` affiche l'historique des versions d'un Deployment. Utile pour les rollbacks."
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
      explanation: "`armonik wait --session session-id` bloque jusqu'à ce que toutes les tâches de la session soient terminées."
    },
    {
      question: "Que fait l'option --depends-on dans ArmoniK ?",
      options: [
        "Définit une dépendance entre deux tâches",
        "Définit une dépendance entre deux sessions",
        "Définit une dépendance entre deux workers",
        "Définit une dépendance entre deux clusters"
      ],
      answer: "Définit une dépendance entre deux tâches",
      explanation: "`--depends-on task-id` spécifie qu'une tâche dépend d'une autre. La tâche ne s'exécute que si sa dépendance est terminée avec succès."
    },
    {
      question: "Comment vérifier qu'ArmoniK fonctionne correctement ?",
      options: [
        "armonik status",
        "armonik check",
        "armonik test",
        "armonik health"
      ],
      answer: "armonik status",
      explanation: "`armonik status` affiche l'état de tous les services ArmoniK. `docker ps | grep armonik` permet aussi de vérifier les conteneurs."
    },
    {
      question: "Comment rollback un déploiement Kubernetes ?",
      options: [
        "kubectl rollout undo deployment/web",
        "kubectl rollback deployment/web",
        "kubectl revert deployment/web",
        "kubectl undo deployment/web"
      ],
      answer: "kubectl rollout undo deployment/web",
      explanation: "`kubectl rollout undo deployment/web` annule le dernier déploiement. `--to-revision=N` permet de revenir à une version spécifique."
    },
    {
      question: "Que simule le conteneur market-simulator dans l'exercice financier Docker Compose ?",
      options: [
        "Un serveur web",
        "Un générateur de prix de marché aléatoires",
        "Une base de données",
        "Un cache Redis"
      ],
      answer: "Un générateur de prix de marché aléatoires",
      explanation: "Le market-simulator génère des prix aléatoires et les envoie dans Redis comme un flux de marché réel pour les tests."
    },
    {
      question: "Pourquoi utilise-t-on healthcheck dans un fichier Docker Compose ?",
      options: [
        "Pour vérifier que le service fonctionne avant que les autres en dépendent",
        "Pour améliorer les performances",
        "Pour réduire la taille des images",
        "Pour sécuriser le conteneur"
      ],
      answer: "Pour vérifier que le service fonctionne avant que les autres en dépendent",
      explanation: "healthcheck permet de vérifier qu'un service est prêt avant que les autres services ne s'y connectent. Évite les erreurs de dépendance."
    },
    {
      question: "Comment créer un secret Kubernetes avec kubectl ?",
      options: [
        "kubectl create secret generic --from-literal=key=value",
        "kubectl secret create --key=value",
        "kubectl new secret --key=value",
        "kubectl add secret --key=value"
      ],
      answer: "kubectl create secret generic --from-literal=key=value",
      explanation: "`kubectl create secret generic nom --from-literal=key=value` crée un secret. `--from-file` permet de le créer depuis un fichier."
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