// src/projects/Project3/pages/Page6_TechInterview.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";

const basicSlides = [
   
  {
    question: "Docker : Définition et cas d'usage",
    answer:
      "◆ **Définition** = Plateforme de conteneurisation légère partageant le noyau hôte ◆ **Vs VM** : Mo vs Go, ms vs minutes ◆ **Isolation** : Namespaces (isolent la vue : PID, NET, MNT, UTS, IPC, USER) + Cgroups (limitent les ressources : CPU, RAM, I/O) ◆ **Images** : construites via Dockerfile (FROM, RUN, COPY, CMD) ◆ **Usages** : Dev/test, microservices, CI/CD, déploiement standardisé ◆ **Avantages** : Portabilité OCI, densité élevée, démarrage rapide ◆ **Commandes** : `build -t`, `run -d -p`, `ps`, `logs -f`, `exec -it`, `stop/rm`, `volume create`, `network create`"
  },
  {
    question: "Docker : Commandes essentielles",
    answer:
      "◆ **Images** : `docker build -t app:tag .` • `docker pull image` • `docker images` • `docker rmi image`\n◆ **Conteneurs** : `docker run -d -p 80:80 app` • `docker ps` • `docker ps -a` • `docker stop app` • `docker rm app` • `docker restart app`\n◆ **Logs & exec** : `docker logs -f app` • `docker exec -it app sh` • `docker attach app`\n◆ **Volumes** : `docker volume create data` • `docker volume ls` • `docker volume inspect data`\n◆ **Réseau** : `docker network create mynet` • `docker network ls` • `docker network connect mynet app`"
  },
  {
    question: "Docker Compose : Définition, usages et commandes",
    answer:
      "◆ **Définition** = Outil pour définir et lancer des applications multi-conteneurs sur une seule machine ◆ **Fichier** : docker-compose.yml (format YAML) ◆ **Fonctionnalités** : Gère les réseaux (bridge), les volumes, les variables d'environnement, les dépendances entre services ◆ **Usages** : Dev local, tests intégration, applications avec plusieurs services (frontend, backend, DB) ◆ **Limite** : Une seule machine, pas de cluster, pas de répartition multi-hôtes ◆ **Commandes** : `docker-compose up -d` • `docker-compose down` • `docker-compose ps` • `docker-compose logs -f service` • `docker-compose up --scale service=3 -d` • `docker-compose build` • `docker-compose pull` • `docker-compose top service`"
  },
  {
    question: "Docker Swarm : Définition, usages et commandes",
    answer:
      "◆ **Définition** = Orchestration native Docker intégrée au moteur ◆ **Nœuds** : Manager (pilote, scheduling, RAFT consensus) + Worker (exécution) ◆ **Mode** : actif/passif pour haute disponibilité ◆ **Réseau** : Overlay network (VXLAN) pour communication inter-nœuds ◆ **Stockage** : volumes partagés selon configuration ◆ **Usages** : Clusters simples, prototypage, compatibilité Docker native ◆ **Avantages** : Facile à mettre en œuvre, pas de composants externes ◆ **Commandes** : `docker swarm init` • `docker swarm join --token TOKEN` • `docker service create --replicas 3 --publish 80:80 app` • `docker service ls` • `docker service scale app=5` • `docker service update --image new:tag` • `docker service ps app` • `docker service logs app` • `docker service rollback app`"
  },
  {
    question: "Kubernetes (K8s) : Définition, architecture et commandes",
    answer:
      "◆ **Définition** = Orchestrateur standard de l'industrie ◆ **Architecture** : Control Plane (API Server, Scheduler, etcd, Controller Manager) + Worker Nodes (kubelet, kube-proxy) ◆ **Objets clés** : Pod (unité atomique, 1+ conteneurs), Deployment (rolling updates, rollbacks), Service (exposition réseau : ClusterIP, NodePort, LoadBalancer), ReplicaSet (maintien du nombre de réplicas), PersistentVolume (stockage durable), ConfigMap/Secret (configuration) ◆ **Fonctionnalités** : Auto-réparation, scaling automatique, rolling updates, service discovery ◆ **Usages** : Production, cloud natif, architectures microservices complexes ◆ **Commandes** : `kubectl apply -f pod.yaml` • `kubectl get pods` • `kubectl logs -f pod` • `kubectl describe pod` • `kubectl scale deploy/app --replicas=5` • `kubectl port-forward pod 8080:80` • `kubectl set image deploy/app container=new:v2` • `kubectl delete -f pod.yaml`"
  },
  {
    question: "K3s et ArmoniK : Cas d'usage spécifiques",
    answer:
      "◆ **K3s** :\n  • Définition : K8s allégé certifié CNCF\n  • Caractéristiques : < 100 Mo RAM, < 50 Mo binaire, SQLite par défaut\n  • Installation : `curl -sfL https://get.k3s.io | sh -`\n  • Désinstallation : `/usr/local/bin/k3s-uninstall.sh`\n  • Usages : IoT, Edge computing, Raspberry Pi, dev local, environnements contraints\n  • Commandes : identiques à K8s (`kubectl`), seule l'installation diffère\n\n◆ **ArmoniK** :\n  • Définition : Orchestration HPC (High Performance Computing) sur Kubernetes\n  • Fonctionnement : Gère le calcul distribué et le batch processing sur K8s\n  • Usages : Calcul scientifique, simulations Monte-Carlo, traitement de données massives\n  • Avantages : Utilise K8s existants, économies sur le calcul cloud, parallélisation\n  • Commandes : `armonik submit -c \"commande\" -d \"data\"` • `armonik list tasks` • `armonik status task-id` • `armonik watch task-id` • `armonik get results task-id` • `armonik download result-id` • `armonik describe task-id` • `armonik cancel task-id`"
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
  },

  {
    question: "Progression logique et critères de choix",
    answer:
      "◆ **Progression logique** :\n  Isolation locale → Multi-conteneurs → Cluster Docker → Cluster standard → Edge → HPC\n  Docker → Compose → Swarm → K8s → K3s → ArmoniK\n\n◆ **Critères de choix** :\n  • Conteneur unique / CI/CD ? → **Docker**\n  • Dev local / tests ? → **Compose**\n  • Prototypage simple ? → **Swarm**\n  • Production cloud / microservices ? → **K8s**\n  • Ressources limitées (IoT/Edge) ? → **K3s**\n  • Calcul distribué / simulations ? → **ArmoniK**"
  },
  {
  question: "Installation de Docker : étapes et vérification",
  answer:
    "◆ **Installation sur Linux (Ubuntu/Debian)** :\n  • `sudo apt update`\n  • `sudo apt install docker.io` ou `curl -fsSL https://get.docker.com | sh`\n  • `sudo systemctl start docker`\n  • `sudo systemctl enable docker`\n  • `sudo usermod -aG docker $USER` (éviter sudo)\n\n◆ **Installation sur Windows/Mac** :\n  • Télécharger Docker Desktop\n  • Activer WSL2 sur Windows\n  • Démarrer Docker Desktop\n\n◆ **Vérification** :\n  • `docker --version`\n  • `docker run hello-world`\n  • `docker info` (détails du moteur)"
  },
  {
    question: "Installation de Kubernetes (K8s) et outils associés",
    answer:
      "◆ **Minikube** (dev local) :\n  • `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64`\n  • `sudo install minikube-linux-amd64 /usr/local/bin/minikube`\n  • `minikube start --driver=docker`\n  • `minikube status`\n\n◆ **kubectl** (CLI K8s) :\n  • `curl -LO \"https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl\"`\n  • `sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl`\n  • `kubectl version --client`\n\n◆ **K3s** (allégé) :\n  • `curl -sfL https://get.k3s.io | sh -`\n  • `sudo systemctl status k3s`\n  • `kubectl get nodes`"
  },
  {
  question: "Gestion des pannes et diagnostics : Docker",
  answer:
    "◆ **Conteneur ne démarre pas** :\n  1. `docker ps -a` → vérifier l'état (Exited, CrashLoopBackOff)\n  2. `docker logs <conteneur>` → consulter les erreurs\n  3. `docker inspect <conteneur>` → analyser la configuration complète\n  4. `docker start <conteneur>` → relancer après correction\n\n◆ **Port déjà utilisé** :\n  1. `sudo netstat -tulpn | grep :80` → identifier le processus\n  2. `docker stop <conteneur>` → arrêter le conteneur qui bloque\n  3. `docker run -p 8080:80 ...` → ou changer de port\n\n◆ **Espace disque insuffisant** :\n  1. `docker system df` → visualiser l'utilisation\n  2. `docker system prune -a -f` → nettoyer tout (images, conteneurs, réseaux)\n  3. `docker volume prune -f` → supprimer les volumes inutilisés\n  4. `docker image prune -a -f` → supprimer les images non utilisées\n\n◆ **Problème réseau** :\n  1. `docker network ls` → lister les réseaux\n  2. `docker network inspect <network>` → voir les détails\n  3. `docker exec <conteneur> ping <autre_conteneur>` → tester la connectivité\n  4. `docker network connect <network> <conteneur>` → reconnecter"
  },
  {
    question: "Gestion des pannes et diagnostics : Kubernetes",
    answer:
      "◆ **Pod en CrashLoopBackOff** :\n  1. `kubectl get pods` → identifier l'état du Pod\n  2. `kubectl describe pod <pod>` → examiner events et erreurs\n  3. `kubectl logs <pod> --previous` → logs avant le crash\n  4. `kubectl get events --sort-by='.lastTimestamp'` → historique des événements\n  5. `kubectl delete pod <pod>` → forcer la recréation\n\n◆ **Node NotReady** :\n  1. `kubectl get nodes` → vérifier l'état des nœuds\n  2. `kubectl describe node <node>` → détails du nœud\n  3. `kubectl top node` → ressources CPU/MEM\n  4. `ssh <node>` → se connecter au nœud\n  5. `systemctl status kubelet` → vérifier le service kubelet\n  6. `journalctl -u kubelet -f` → logs du kubelet\n\n◆ **Service inaccessible** :\n  1. `kubectl get svc` → vérifier les services et leurs ports\n  2. `kubectl describe svc <service>` → détails du service\n  3. `kubectl get endpoints <service>` → vérifier les endpoints\n  4. `kubectl port-forward pod 8080:80` → test local du Pod\n  5. `curl http://localhost:8080` → tester l'accès\n\n◆ **Diagnostic général** :\n  1. `kubectl get all --all-namespaces` → tout lister\n  2. `kubectl describe <ressource> <nom>` → décrire une ressource\n  3. `kubectl exec -it <pod> -- sh` → shell dans le Pod\n  4. `kubectl top pods` → ressources des Pods\n  5. `kubectl logs -f <pod>` → suivre les logs en temps réel\n  6. `kubectl rollout status deploy/<deployment>` → suivre le déploiement"
  }
];

const questions = {
  moyen: [
    {
      question: "Quelle est la différence principale entre un conteneur Docker et une machine virtuelle ?",
      options: [
        "Le conteneur est plus lent qu'une VM",
        "Le conteneur partage le noyau hôte (Mo, ms) tandis qu'une VM virtualise le matériel + OS (Go, minutes)",
        "La VM est moins sécurisée qu'un conteneur",
        "Il n'y a pas de différence significative"
      ],
      answer: "Le conteneur partage le noyau hôte (Mo, ms) tandis qu'une VM virtualise le matériel + OS (Go, minutes)",
      explanation: "Docker utilise le noyau de l'hôte (lightweight, démarrage ms), alors que chaque VM embarque son propre OS (lourd, Go, démarrage minutes)."
    },
    {
      question: "Quelle commande Docker permet de créer et lancer un conteneur à partir d'une image ?",
      options: [
        "docker create",
        "docker start",
        "docker run",
        "docker build"
      ],
      answer: "docker run",
      explanation: "`docker run` crée et lance un conteneur à partir d'une image. `docker create` crée sans lancer, `start` lance un conteneur existant, `build` construit une image."
    },
    {
      question: "Quelle commande affiche les conteneurs en cours d'exécution ?",
      options: [
        "docker list",
        "docker ps",
        "docker status",
        "docker show"
      ],
      answer: "docker ps",
      explanation: "`docker ps` liste les conteneurs actifs. Ajoutez `-a` pour voir aussi les conteneurs arrêtés."
    },
    {
      question: "Comment visualiser les logs d'un conteneur Docker ?",
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
      question: "Quelle est la différence entre une image Docker et un conteneur ?",
      options: [
        "Une image est un modèle en lecture seule, un conteneur est une instance exécutable de l'image",
        "Un conteneur est un modèle, une image est une instance",
        "Image et conteneur sont identiques",
        "L'image contient les données persistantes du conteneur"
      ],
      answer: "Une image est un modèle en lecture seule, un conteneur est une instance exécutable de l'image",
      explanation: "L'image est statique (modèle). Le conteneur est l'exécution de l'image avec une couche inscriptible. Supprimer un conteneur ne supprime pas l'image."
    },
    {
      question: "Quel mécanisme permet d'isoler la vue des processus dans un conteneur ?",
      options: [
        "Cgroups",
        "Namespaces",
        "OverlayFS",
        "Seccomp"
      ],
      answer: "Namespaces",
      explanation: "Les Namespaces isolent la vue (PID, NET, MNT, UTS, IPC, USER). Cgroups limitent les ressources (CPU, RAM)."
    },
    {
      question: "Quel mécanisme limite les ressources CPU et RAM d'un conteneur ?",
      options: [
        "Namespaces",
        "Cgroups",
        "OverlayFS",
        "Capabilities"
      ],
      answer: "Cgroups",
      explanation: "Cgroups (Control Groups) limitent les ressources (CPU, RAM, I/O). Namespaces isolent la vue."
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
      question: "Quel réseau Docker est utilisé par défaut pour les conteneurs sur un même hôte ?",
      options: [
        "bridge",
        "overlay",
        "host",
        "none"
      ],
      answer: "bridge",
      explanation: "Le réseau bridge est le réseau local par défaut de Docker sur un hôte. Overlay est pour les clusters multi-hôtes."
    },
    {
      question: "Quelle est l'utilité du fichier Dockerfile ?",
      options: [
        "Définir les conteneurs d'une application",
        "Construire une image Docker pas à pas",
        "Configurer Docker Swarm",
        "Gérer les volumes"
      ],
      answer: "Construire une image Docker pas à pas",
      explanation: "Le Dockerfile contient les instructions (FROM, RUN, COPY, CMD) pour construire une image automatisée."
    },
    {
      question: "Que signifie l'acronyme OCI ?",
      options: [
        "Open Container Initiative",
        "Open Code Integration",
        "Operating Container Interface",
        "Online Container Infrastructure"
      ],
      answer: "Open Container Initiative",
      explanation: "OCI est un projet Linux Foundation qui standardise les conteneurs (runtime, image, distribution)."
    },
    {
      question: "Quelle est la commande pour construire une image Docker avec un tag ?",
      options: [
        "docker build -t app:v1 .",
        "docker create -t app:v1",
        "docker run -t app:v1",
        "docker tag app:v1 build"
      ],
      answer: "docker build -t app:v1 .",
      explanation: "`-t` permet de taguer l'image. Le `.` est le chemin du contexte de build (Dockerfile)."
    },
    {
      question: "Comment arrêter proprement un conteneur Docker ?",
      options: [
        "docker kill",
        "docker stop",
        "docker rm",
        "docker pause"
      ],
      answer: "docker stop",
      explanation: "`docker stop` envoie SIGTERM (arrêt propre). `kill` envoie SIGKILL (forcé). `rm` supprime le conteneur arrêté."
    },
    {
      question: "Comment exposer un port d'un conteneur sur l'hôte ?",
      options: [
        "docker run -p 8080:80",
        "docker run -P 8080",
        "docker port 8080",
        "docker expose 8080"
      ],
      answer: "docker run -p 8080:80",
      explanation: "`-p host:container` : le port 8080 de l'hôte est redirigé vers le port 80 du conteneur."
    }
  ],
  avance: [
    {
      question: "Quel est l'objectif principal de Docker Compose ?",
      options: [
        "Créer un cluster de conteneurs",
        "Lancer plusieurs conteneurs sur une seule machine",
        "Orchestrer des conteneurs sur plusieurs nœuds",
        "Construire des images Docker"
      ],
      answer: "Lancer plusieurs conteneurs sur une seule machine",
      explanation: "Compose définit une application multi-conteneurs dans un fichier YAML et les lance sur une seule machine Docker."
    },
    {
      question: "Quel fichier utilise-t-on pour configurer Docker Compose ?",
      options: [
        "dockerfile.yml",
        "docker-compose.yaml",
        "compose.yml",
        "compose.yaml"
      ],
      answer: "docker-compose.yaml",
      explanation: "Le fichier docker-compose.yaml (ou .yml) définit les services, réseaux et volumes de l'application."
    },
    {
      question: "Docker Compose peut-il répartir des conteneurs sur plusieurs machines ?",
      options: [
        "Oui, par défaut",
        "Non, il reste sur une seule machine Docker",
        "Oui, avec le flag --multi",
        "Oui, mais seulement avec Swarm mode"
      ],
      answer: "Non, il reste sur une seule machine Docker",
      explanation: "Compose est limité à une seule machine. Pour la répartition multi-hôtes, il faut Swarm ou Kubernetes."
    },
    {
      question: "Quelle est la différence entre Docker Compose et Docker Swarm ?",
      options: [
        "Compose est plus récent que Swarm",
        "Compose gère plusieurs conteneurs sur une machine, Swarm orchestre sur plusieurs machines",
        "Swarm est un fichier YAML, Compose est une commande",
        "Il n'y a pas de différence"
      ],
      answer: "Compose gère plusieurs conteneurs sur une machine, Swarm orchestre sur plusieurs machines",
      explanation: "Compose = multi-conteneurs local. Swarm = cluster distribué avec nœuds Manager/Worker."
    },
    {
      question: "Quelle commande initialise un cluster Docker Swarm ?",
      options: [
        "docker swarm create",
        "docker swarm init",
        "docker swarm start",
        "docker swarm new"
      ],
      answer: "docker swarm init",
      explanation: "`docker swarm init` initialise un nouveau cluster Swarm sur le nœud local. La machine devient le premier Manager."
    },
    {
      question: "Dans Docker Swarm, quel est le rôle d'un nœud Manager ?",
      options: [
        "Exécuter uniquement les conteneurs",
        "Piloter et gérer le cluster (scheduling, orchestration)",
        "Fournir du stockage persistant",
        "Créer les images Docker"
      ],
      answer: "Piloter et gérer le cluster (scheduling, orchestration)",
      explanation: "Le Manager orchestre le cluster, planifie les tâches, maintient l'état. Le Worker exécute les conteneurs."
    },
    {
      question: "Quelle commande crée un service avec 3 réplicas dans Swarm ?",
      options: [
        "docker run --replicas 3 app",
        "docker service create --replicas 3 app",
        "docker swarm create --replicas 3 app",
        "docker compose up --scale 3 app"
      ],
      answer: "docker service create --replicas 3 app",
      explanation: "`docker service create` est la commande Swarm pour créer des services. `--replicas 3` demande 3 instances du conteneur."
    },
    {
      question: "Comment augmenter le nombre de réplicas d'un service Swarm ?",
      options: [
        "docker service scale app=5",
        "docker service update app --replicas 5",
        "docker scale app 5",
        "docker swarm scale app 5"
      ],
      answer: "docker service scale app=5",
      explanation: "`docker service scale app=5` augmente les réplicas. `update` peut aussi le faire avec `--replicas 5`."
    },
    {
      question: "Qu'est-ce qu'un overlay network dans Swarm ?",
      options: [
        "Un réseau local sur un hôte",
        "Un réseau multi-hôtes utilisant VXLAN",
        "Un réseau sans fil",
        "Un réseau de stockage"
      ],
      answer: "Un réseau multi-hôtes utilisant VXLAN",
      explanation: "L'overlay network permet aux conteneurs sur différents nœuds Swarm de communiquer comme s'ils étaient sur le même réseau."
    },
    {
      question: "Kubernetes peut-il fonctionner sur une seule machine ?",
      options: [
        "Oui, avec Minikube ou kind pour le développement",
        "Non, Kubernetes nécessite au moins 3 machines",
        "Oui, mais uniquement en production",
        "Non, Kubernetes est exclusivement cloud"
      ],
      answer: "Oui, avec Minikube ou kind pour le développement",
      explanation: "Minikube, kind (Kubernetes in Docker), ou K3s permettent un cluster K8s sur une seule machine pour le dev/test."
    },
    {
      question: "Quelle est l'unité de base dans Kubernetes ?",
      options: [
        "Conteneur",
        "Pod",
        "Deployment",
        "Service"
      ],
      answer: "Pod",
      explanation: "Le Pod est l'unité atomique de Kubernetes. Il contient un ou plusieurs conteneurs partageant le même réseau et volume."
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
      question: "Quelle est la commande Swarm pour joindre un nœud au cluster ?",
      options: [
        "docker join",
        "docker swarm join",
        "docker node join",
        "docker cluster join"
      ],
      answer: "docker swarm join",
      explanation: "`docker swarm join --token TOKEN ADRESSE` permet à un nœud de rejoindre un cluster Swarm existant."
    },
    {
      question: "Comment obtenir les logs d'un service Swarm ?",
      options: [
        "docker logs service",
        "docker service logs service",
        "docker swarm logs service",
        "docker ps logs service"
      ],
      answer: "docker service logs service",
      explanation: "`docker service logs service` affiche les logs de tous les réplicas du service Swarm."
    }
  ],
  expert: [
    {
      question: "Dans Kubernetes, quelle est la différence entre un Service de type ClusterIP et NodePort ?",
      options: [
        "ClusterIP expose en interne uniquement, NodePort expose sur un port de chaque nœud (30000-32767)",
        "NodePort est plus sécurisé que ClusterIP",
        "ClusterIP est utilisé pour les bases de données uniquement",
        "Il n'y a pas de différence, ce sont des alias"
      ],
      answer: "ClusterIP expose en interne uniquement, NodePort expose sur un port de chaque nœud (30000-32767)",
      explanation: "ClusterIP : accessible uniquement à l'intérieur du cluster. NodePort : expose le service sur un port statique (30000-32767) de chaque nœud, accessible de l'extérieur via <IP_Nœud>:<Port>."
    },
    {
      question: "Quelle est la commande kubectl pour mettre à jour l'image d'un Deployment ?",
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
      explanation: "`docker network create --driver overlay mon-reseau` crée un réseau multi-hôtes. Les services Swarm peuvent ensuite utiliser ce réseau avec `--network mon-reseau`."
    },
    {
      question: "Quelle est la différence entre un ReplicaSet et un Deployment dans Kubernetes ?",
      options: [
        "ReplicaSet et Deployment sont identiques",
        "ReplicaSet maintient un nombre fixe de Pods, Deployment gère les rolling updates et rollbacks en utilisant ReplicaSet en interne",
        "Deployment est obsolète, ReplicaSet le remplace",
        "ReplicaSet est pour les bases de données, Deployment pour les applications web"
      ],
      answer: "ReplicaSet maintient un nombre fixe de Pods, Deployment gère les rolling updates et rollbacks en utilisant ReplicaSet en interne",
      explanation: "Le ReplicaSet assure qu'un nombre spécifié de Pods est en cours d'exécution. Le Deployment est une couche au-dessus qui gère les mises à jour progressives (rolling updates) et les rollbacks, en manipulant des ReplicaSets en interne."
    },
    {
      question: "Quelle est la différence entre un Pod et un conteneur dans Kubernetes ?",
      options: [
        "Un Pod est une alternative à un conteneur",
        "Un conteneur est un Pod, mais pas l'inverse",
        "Un Pod peut contenir plusieurs conteneurs partageant le même réseau et volume",
        "Les Pods ne contiennent que des conteneurs identiques"
      ],
      answer: "Un Pod peut contenir plusieurs conteneurs partageant le même réseau et volume",
      explanation: "Le Pod est l'unité atomique de K8s. Plusieurs conteneurs dans un Pod peuvent communiquer via localhost et partager des volumes."
    },
    {
      question: "Quel est le rôle du Control Plane dans Kubernetes ?",
      options: [
        "Exécuter les applications des utilisateurs",
        "Piloter le cluster (API Server, Scheduler, etcd)",
        "Fournir du stockage persistant",
        "Gérer les conteneurs uniquement"
      ],
      answer: "Piloter le cluster (API Server, Scheduler, etcd)",
      explanation: "Le Control Plane gère l'état du cluster, planifie les Pods, expose l'API. Les Worker Nodes exécutent les applications."
    },
    {
      question: "Quelle est la différence entre K3s et Kubernetes ?",
      options: [
        "K3s est un outil de monitoring, Kubernetes est un orchestrateur",
        "K3s est une version allégée de Kubernetes (< 100 Mo RAM)",
        "K3s ne supporte pas les conteneurs",
        "Kubernetes est obsolète, K3s est le remplaçant"
      ],
      answer: "K3s est une version allégée de Kubernetes (< 100 Mo RAM)",
      explanation: "K3s est certifié CNCF, compatible avec Kubernetes, mais optimisé pour l'IoT/Edge avec une empreinte mémoire réduite."
    },
    {
      question: "À quoi sert ArmoniK ?",
      options: [
        "À déployer des applications web",
        "À gérer des bases de données",
        "À orchestrer du calcul distribué HPC sur Kubernetes",
        "À remplacer Docker"
      ],
      answer: "À orchestrer du calcul distribué HPC sur Kubernetes",
      explanation: "ArmoniK est une solution d'orchestration HPC (High Performance Computing) sur Kubernetes pour le calcul scientifique et les simulations."
    },
    {
      question: "Comment obtenir les logs d'un Pod dans Kubernetes ?",
      options: [
        "kubectl logs pod",
        "kubectl get logs pod",
        "kubectl describe pod",
        "kubectl show pod"
      ],
      answer: "kubectl logs pod",
      explanation: "`kubectl logs pod` affiche les logs du Pod. Avec `-f` pour suivre en temps réel. `describe` donne les détails du Pod."
    },
    {
      question: "Qu'est-ce qu'un Persistent Volume dans Kubernetes ?",
      options: [
        "Un volume temporaire",
        "Un stockage persistant qui survit au cycle de vie des Pods",
        "Un volume partagé entre clusters",
        "Un type de Pod spécial"
      ],
      answer: "Un stockage persistant qui survit au cycle de vie des Pods",
      explanation: "PersistentVolume (PV) est une ressource de stockage provisionnée par l'administrateur. Les Pods y accèdent via PersistentVolumeClaim (PVC)."
    },
    {
      question: "Quelle est la différence entre un service ClusterIP et NodePort ?",
      options: [
        "ClusterIP expose en interne, NodePort expose sur un port de chaque nœud",
        "NodePort n'expose que sur le nœud maître",
        "ClusterIP est plus sécurisé",
        "Il n'y a pas de différence"
      ],
      answer: "ClusterIP expose en interne, NodePort expose sur un port de chaque nœud",
      explanation: "ClusterIP : accessible uniquement dans le cluster. NodePort : accessible de l'extérieur via <IP_Nœud>:<Port>."
    },
    {
      question: "Qu'est-ce qu'un ReplicaSet dans Kubernetes ?",
      options: [
        "Un ensemble de conteneurs",
        "Un gestionnaire de réplicas qui maintient un nombre fixe de Pods",
        "Un type de service",
        "Un outil de backup"
      ],
      answer: "Un gestionnaire de réplicas qui maintient un nombre fixe de Pods",
      explanation: "Le ReplicaSet assure qu'un nombre spécifié de Pods est toujours en cours d'exécution. Les Deployments les utilisent en interne."
    },
    {
      question: "Quelle commande kubectl permet de décrire un Pod en détail ?",
      options: [
        "kubectl describe pod",
        "kubectl inspect pod",
        "kubectl get pod -o yaml",
        "kubectl show pod"
      ],
      answer: "kubectl describe pod",
      explanation: "`describe` donne des détails complets (events, état, conditions). `get -o yaml` donne la définition YAML brute."
    },
    {
      question: "Quelle est la différence entre Swarm et Kubernetes ?",
      options: [
        "Swarm est plus complexe que Kubernetes",
        "Swarm est plus simple mais moins riche fonctionnellement que Kubernetes",
        "Kubernetes est obsolète",
        "Swarm ne supporte pas les conteneurs"
      ],
      answer: "Swarm est plus simple mais moins riche fonctionnellement que Kubernetes",
      explanation: "Swarm est intégré à Docker, plus simple à configurer. Kubernetes est plus complexe mais plus puissant (auto-réparation, scaling avancé, service discovery)."
    },
    {
      question: "Quand utiliser K3s plutôt que Kubernetes ?",
      options: [
        "Jamais, K3s est inférieur",
        "Pour les environnements contraints en ressources (IoT, Edge, Raspberry Pi)",
        "K3s est pour le cloud uniquement",
        "K3s remplace totalement Kubernetes"
      ],
      answer: "Pour les environnements contraints en ressources (IoT, Edge, Raspberry Pi)",
      explanation: "K3s est idéal quand les ressources sont limitées (< 100 Mo RAM) ou pour le développement local, tout en restant compatible K8s."
    },
    {
      question: "Quelle commande kubectl permet de redimensionner un Deployment à 5 réplicas ?",
      options: [
        "kubectl scale deploy/app --replicas=5",
        "kubectl resize deploy/app 5",
        "kubectl update deploy/app --replicas=5",
        "kubectl set replicas deploy/app=5"
      ],
      answer: "kubectl scale deploy/app --replicas=5",
      explanation: "`kubectl scale` modifie le nombre de réplicas. La syntaxe est `kubectl scale deployment nom --replicas=N`."
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
      question: "Quelle commande ArmoniK permet de soumettre une tâche ?",
      options: [
        "armonik run",
        "armonik submit",
        "armonik start",
        "armonik create"
      ],
      answer: "armonik submit",
      explanation: "`armonik submit -c \"commande\" -d \"data\"` soumet une tâche de calcul à l'orchestrateur ArmoniK."
    },
    {
      question: "Quelle est la chaîne logique complète de Docker à Kubernetes ?",
      options: [
        "Image → Conteneur → Service → Pod",
        "Image → Conteneur → Pod → Deployment → Service → Cluster",
        "Docker → Swarm → K3s → ArmoniK",
        "Image → Volume → Pod → Service"
      ],
      answer: "Image → Conteneur → Pod → Deployment → Service → Cluster",
      explanation: "La progression : Image Docker → Conteneur → Pod K8s (unité atomique) → Deployment (gestion) → Service (exposition) → Cluster (ensemble des nœuds)."
    }
  ]
};




// ===== COMPOSANTS =====

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
        ? <h3 className="success">🚀 Architecture Docker & Kubernetes maîtrisée !</h3>
        : <p className="fail">📚 Révisez Docker, Swarm, Kubernetes, K3s et ArmoniK.</p>
      }
    </div>
  );
};

// ===== COMPOSANT PRINCIPAL =====

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