// src/projects/CIBPricing/CIBPricingPreTradeQCM.js

import React, { useState, useEffect, useCallback } from "react";
import "./Page.css";


const basicSlides = [
   {
    question: "Docker : définition et cas d'usage",
    answer:
      "◆ **Définition** = Plateforme de conteneurisation légère partageant le noyau hôte ◆ **Vs VM** = Mo vs Go, ms vs minutes ◆ **Usages** : Dev/test, microservices, CI/CD, déploiement standardisé ◆ **Avantages** : Portabilité OCI, densité élevée, démarrage rapide"
  },
  {
    question: "Docker : commandes essentielles",
    answer:
      "◆ **Images** : `docker build -t app:tag .` • `docker pull image` • `docker images`\n◆ **Conteneurs** : `docker run -d -p 80:80 app` • `docker ps` • `docker stop app` • `docker rm app`\n◆ **Logs & exec** : `docker logs -f app` • `docker exec -it app sh`\n◆ **Volumes** : `docker volume create data` • `docker volume ls`"
  },
  {
    question: "Swarm : définition et cas d'usage",
    answer:
      "◆ **Définition** = Orchestration native Docker intégrée au moteur ◆ **Mode** = Actif/passif avec gestion de cluster simplifiée ◆ **Usages** : Clusters simples, prototypage, compatibilité Docker native ◆ **Avantages** : Facile à mettre en œuvre, pas de composants externes"
  },
  {
    question: "Swarm : commandes essentielles",
    answer:
      "◆ **Initialisation** : `docker swarm init` • `docker swarm join --token`\n◆ **Services** : `docker service create --replicas 3 --publish 80:80 app` • `docker service ls`\n◆ **Scaling** : `docker service scale app=5` • `docker service update --image new:tag`\n◆ **Monitoring** : `docker service ps app` • `docker service logs app`"
  },
  {
    question: "Kubernetes (K8s) : définition et cas d'usage",
    answer:
      "◆ **Définition** = Orchestrateur standard de l'industrie ◆ **Fonctionnalités** : Auto-réparation, scaling automatique, rolling updates, service discovery ◆ **Usages** : Production, cloud natif, architectures microservices complexes ◆ **Avantages** : Standard industriel, écosystème riche, multi-cloud"
  },
  {
    question: "Kubernetes (K8s) : commandes essentielles",
    answer:
      "◆ **Ressources** : `kubectl apply -f pod.yaml` • `kubectl delete -f pod.yaml`\n◆ **Monitoring** : `kubectl get pods` • `kubectl get nodes` • `kubectl get services`\n◆ **Debug** : `kubectl logs -f pod` • `kubectl describe pod` • `kubectl exec -it pod -- sh`\n◆ **Scaling** : `kubectl scale deploy/app --replicas=5` • `kubectl port-forward pod 8080:80`"
  },
  {
    question: "K3s : définition et cas d'usage",
    answer:
      "◆ **Définition** = Version allégée de Kubernetes certifiée CNCF ◆ **Caractéristiques** : < 100 Mo RAM, < 50 Mo binaire, SQLite par défaut ◆ **Usages** : IoT, Edge computing, Raspberry Pi, dev local, environnements contraints ◆ **Avantages** : Compatibilité totale K8s, faible empreinte mémoire"
  },
  {
    question: "K3s : commandes essentielles",
    answer:
      "◆ **Installation** : `curl -sfL https://get.k3s.io | sh -`\n◆ **Configuration** : `kubectl get nodes` • `kubectl get pods -A`\n◆ **Désinstallation** : `/usr/local/bin/k3s-uninstall.sh`\n◆ **Rappel** : Les commandes K3s sont identiques à K8s (`kubectl`), seule l'installation diffère"
  },
  {
    question: "ArmoniK : définition et cas d'usage",
    answer:
      "◆ **Définition** = Solution d'orchestration HPC (High Performance Computing) sur Kubernetes ◆ **Fonctionnement** = Gère le calcul distribué et le batch processing sur K8s ◆ **Usages** : Calcul scientifique, simulations, traitement de données massives ◆ **Avantages** : Utilise K8s existants, économies sur le calcul cloud"
  },
  {
    question: "ArmoniK : commandes essentielles",
    answer:
      "◆ **Soumission** : `armonik submit -c \"commande\" -d \"data\"`\n◆ **Suivi** : `armonik list tasks` • `armonik status task-id` • `armonik watch task-id`\n◆ **Résultats** : `armonik get results task-id` • `armonik download result-id`\n◆ **Administration** : `armonik describe task-id` • `armonik cancel task-id`"
  },
  {
    question: "Docker : définition et cas d'usage",
    answer:
      "◆ **Définition** = Plateforme de conteneurisation légère partageant le noyau hôte ◆ **Vs VM** : Mo vs Go, ms vs minutes ◆ **Usages** : Dev/test, microservices, CI/CD, déploiement standardisé ◆ **Avantages** : Portabilité OCI, densité élevée, démarrage rapide"
  },
  {
    question: "Docker : commandes essentielles",
    answer:
      "◆ **Images** : `build -t tag .` • `pull image` • `images`\n◆ **Conteneurs** : `run -d -p 80:80` • `ps` • `stop` • `rm`\n◆ **Logs & exec** : `logs -f` • `exec -it sh`\n◆ **Volumes** : `volume create data` • `volume ls`"
  },
  {
    question: "Swarm vs K8s : architecture et usages",
    answer:
      "◆ **Swarm** : Orchestration native Docker, simple, intégrée ◆ Usages : prototypage, clusters simples\n◆ **K8s** : Standard industriel, complexe, riche en fonctionnalités ◆ Usages : production, cloud natif\n◆ **K3s** : Version allégée de K8s (< 100 Mo RAM) ◆ Usages : IoT, Edge, Raspberry Pi\n◆ **ArmoniK** : Orchestration HPC sur K8s ◆ Usages : calcul scientifique, simulations"
  },
  {
    question: "Swarm : commandes essentielles",
    answer:
      "◆ **Init** : `swarm init` • `swarm join --token`\n◆ **Services** : `service create --replicas 3 --publish 80:80` • `service ls`\n◆ **Scaling** : `service scale app=5` • `service update --image new`\n◆ **Monitoring** : `service ps app` • `service logs app`"
  },
  {
    question: "Kubernetes (K8s) : architecture et commandes",
    answer:
      "◆ **Architecture** : Master (API Server, etcd, scheduler) + Workers (kubelet, kube-proxy)\n◆ **Ressources** : Pods, Deployments, Services, ConfigMaps, Secrets\n◆ **Commandes** : `kubectl apply -f pod.yaml` • `get pods` • `logs -f` • `describe pod`\n◆ **Scaling** : `kubectl scale deploy/app --replicas=5` • `port-forward pod 8080:80`"
  },
  {
    question: "K3s : installation et cas d'usage",
    answer:
      "◆ **Définition** = K8s allégé certifié CNCF (< 100 Mo RAM, < 50 Mo binaire)\n◆ **Installation** : `curl -sfL https://get.k3s.io | sh -`\n◆ **Usages** : IoT, Edge computing, Raspberry Pi, dev local\n◆ **Commandes** : Identiques à K8s (`kubectl`), seule l'installation diffère"
  },
  {
    question: "ArmoniK : définition et architecture",
    answer:
      "◆ **Définition** = Orchestration HPC sur Kubernetes pour calcul distribué ◆ **Architecture** : Worker sur K8s, queue de tasks, stockage des résultats\n◆ **Usages** : Calcul scientifique, simulations Monte-Carlo, traitement de données massives\n◆ **Avantages** : Économies cloud, exploite K8s existants"
  },
  {
    question: "ArmoniK : commandes essentielles",
    answer:
      "◆ **Soumission** : `armonik submit -c \"commande\" -d \"data\"`\n◆ **Suivi** : `list tasks` • `status task-id` • `watch task-id`\n◆ **Résultats** : `get results task-id` • `download result-id`\n◆ **Admin** : `describe task-id` • `cancel task-id`"
  },
  {
    question: "Comparatif : isolation, réseau et stockage",
    answer:
      "◆ **Isolation** : Namespaces (PID, NET, MNT, UTS, IPC, USER) + Cgroups (CPU, RAM, I/O)\n◆ **Réseau** : Bridge (local) • Overlay (multi-hôtes, VXLAN)\n◆ **Stockage** : Conteneur = éphémère • Volume = persistant\n◆ **Orchestration** : Docker local → Swarm/K8s distribué → ArmoniK HPC"
  },
  {
    question: "Le fil conducteur : de l'isolation locale à l'orchestration distribuée",
    answer:
      "◆ **Docker** : Isolation locale d'une application, démarrage rapide (ms)\n◆ **Swarm** : Orchestration native Docker pour clusters simples\n◆ **K8s/K3s** : Orchestration standard pour applications cloud natives complexes\n◆ **ArmoniK** : Orchestration de calcul HPC sur K8s pour simulations et batch processing\n◆ **Vision** : Une chaîne d'outils complémentaires du local au distribué"
  }

];

const questions = {
  moyen: [
  {
    question:
      "[Fondamentaux] Quelle est la principale différence entre une VM et un conteneur ?",
    options: [
      "Le conteneur consomme plus de RAM qu'une VM",
      "La VM virtualise le matériel et embarque un OS complet ; le conteneur partage le noyau hôte",
      "Le conteneur est plus lent au démarrage qu'une VM",
      "La VM et le conteneur utilisent tous les deux un hyperviseur",
    ],
    answer:
      "La VM virtualise le matériel et embarque un OS complet ; le conteneur partage le noyau hôte",
    explanation:
      "Les conteneurs partagent le noyau de l'hôte, ce qui les rend plus légers (Mo) et plus rapides à démarrer (ms) qu'une VM (Go, minutes).",
  },
  {
    question: "[Fondamentaux] Que sont les namespaces dans la conteneurisation ?",
    options: [
      "Des mécanismes qui isolent la vue d'un processus sur le système",
      "Des outils de monitoring des ressources",
      "Un type de réseau virtuel",
      "Des volumes persistants pour les conteneurs",
    ],
    answer: "Des mécanismes qui isolent la vue d'un processus sur le système",
    explanation:
      "Les namespaces isolent la vue (PID, NET, MNT, UTS, IPC, USER). Chaque conteneur a ses propres identifiants, réseau et système de fichiers.",
  },
  {
    question: "[Fondamentaux] Quel est le rôle des cgroups ?",
    options: [
      "Isoler la vue réseau d'un conteneur",
      "Limiter et comptabiliser les ressources CPU, mémoire, I/O",
      "Gérer les images Docker",
      "Créer des réseaux overlay",
    ],
    answer: "Limiter et comptabiliser les ressources CPU, mémoire, I/O",
    explanation:
      "Les cgroups empêchent un conteneur de monopoliser les ressources de l'hôte en limitant CPU, RAM, I/O disque et bande passante.",
  },
  {
    question: "[Fondamentaux] Quelle est la différence entre une image et un conteneur ?",
    options: [
      "L'image est une instance exécutable ; le conteneur est un modèle",
      "L'image est un modèle en lecture seule ; le conteneur est une instance exécutable",
      "L'image et le conteneur sont identiques",
      "Le conteneur est construit après l'image mais les deux sont en lecture seule",
    ],
    answer: "L'image est un modèle en lecture seule ; le conteneur est une instance exécutable",
    explanation:
      "L'image est le modèle figé ; le conteneur est l'instance en cours d'exécution avec une couche inscriptible.",
  },
  {
    question: "[Fondamentaux] Comment sont construites les images Docker ?",
    options: [
      "En une seule couche monolithique",
      "Par couches (layers) empilées, chaque instruction du Dockerfile créant une couche",
      "À partir d'un fichier binaire unique",
      "En copiant un système d'exploitation complet",
    ],
    answer:
      "Par couches (layers) empilées, chaque instruction du Dockerfile créant une couche",
    explanation:
      "Chaque instruction (FROM, RUN, COPY, etc.) crée une couche, permettant la mise en cache et la réutilisation.",
  },
  {
    question: "[Fondamentaux] À quoi sert un réseau bridge dans Docker ?",
    options: [
      "À connecter des conteneurs sur plusieurs hôtes physiques",
      "À créer un réseau virtuel local pour les conteneurs sur une même machine",
      "À exposer des ports vers l'extérieur",
      "À chiffrer le trafic entre conteneurs",
    ],
    answer:
      "À créer un réseau virtuel local pour les conteneurs sur une même machine",
    explanation:
      "Le bridge est le réseau par défaut de Docker, permettant la communication entre conteneurs sur le même hôte.",
  },
  {
    question: "[Fondamentaux] À quoi sert un réseau overlay ?",
    options: [
      "À créer un réseau local pour les conteneurs sur un seul hôte",
      "À étendre le réseau sur plusieurs hôtes physiques (multi-hôtes)",
      "À isoler les conteneurs du réseau de l'hôte",
      "À fournir une adresse IP publique à chaque conteneur",
    ],
    answer: "À étendre le réseau sur plusieurs hôtes physiques (multi-hôtes)",
    explanation:
      "Le réseau overlay (souvent en VXLAN) permet à des conteneurs sur des machines différentes de communiquer comme s'ils étaient sur le même réseau local.",
  },
  {
    question: "[Fondamentaux] Pourquoi les volumes sont-ils importants en conteneurisation ?",
    options: [
      "Ils permettent de réduire la taille des images",
      "Ils permettent de persister les données au-delà du cycle de vie du conteneur",
      "Ils améliorent les performances CPU",
      "Ils chiffrent automatiquement les données",
    ],
    answer:
      "Ils permettent de persister les données au-delà du cycle de vie du conteneur",
    explanation:
      "Un conteneur est éphémère ; les données qui doivent survivre (base de données, fichiers) doivent être stockées dans un volume.",
  },
  {
    question: "[Fondamentaux] Que signifie OCI ?",
    options: [
      "Open Container Initiative, une norme pour les images et runtimes de conteneurs",
      "Open Cloud Infrastructure, un standard pour le cloud computing",
      "Orchestration Container Interface, une API pour Kubernetes",
      "Optimized Container Images, un format d'image compressé",
    ],
    answer:
      "Open Container Initiative, une norme pour les images et runtimes de conteneurs",
    explanation:
      "OCI standardise les formats d'images et les runtimes, permettant l'interopérabilité entre outils.",
  },
  {
    question: "[Fondamentaux] Quelle est la première étape de débogage d'un conteneur qui plante ?",
    options: [
      "docker inspect pour voir la configuration",
      "docker logs pour visualiser les logs du conteneur",
      "docker stats pour surveiller les ressources",
      "docker exec pour ouvrir un shell interactif",
    ],
    answer: "docker logs pour visualiser les logs du conteneur",
    explanation:
      "docker logs est le réflexe de premier niveau : il donne la sortie standard et d'erreur du conteneur.",
  },
  {
    question: "[Fondamentaux] Que signifie le code d'erreur 137 dans un conteneur Docker ?",
    options: [
      "Erreur de configuration réseau",
      "SIGKILL, souvent dû à un OOM (Out Of Memory)",
      "Erreur de permission sur les fichiers",
      "Le conteneur a terminé avec succès",
    ],
    answer: "SIGKILL, souvent dû à un OOM (Out Of Memory)",
    explanation:
      "Le code 137 signifie que le conteneur a reçu un SIGKILL, généralement parce que le noyau l'a tué pour dépassement de mémoire.",
  },
  {
    question: "[Fondamentaux] Comment inspecter la configuration complète d'un conteneur ?",
    options: ["docker inspect", "docker config", "docker info", "docker ps -a"],
    answer: "docker inspect",
    explanation:
      "docker inspect affiche toutes les informations de configuration (réseau, volumes, variables d'environnement, limites).",
  },
  {
    question: "[Fondamentaux] Quelle commande ouvre un shell interactif dans un conteneur ?",
    options: [
      "docker exec -it <conteneur> sh",
      "docker run -it <conteneur> sh",
      "docker attach <conteneur>",
      "docker shell <conteneur>",
    ],
    answer: "docker exec -it <conteneur> sh",
    explanation:
      "docker exec -it ouvre un shell interactif dans un conteneur déjà en cours d'exécution.",
  },
  {
    question: "[Fondamentaux] Quel est l'avantage des layers dans une image Docker ?",
    options: [
      "Elles permettent la mise en cache et accélèrent les builds",
      "Elles rendent l'image plus sécurisée",
      "Elles réduisent la taille de l'image finale",
      "Elles permettent d'exécuter plusieurs systèmes d'exploitation",
    ],
    answer: "Elles permettent la mise en cache et accélèrent les builds",
    explanation:
      "Les couches sont mises en cache ; si une couche n'a pas changé, Docker la réutilise sans la reconstruire.",
  },
  {
    question: "[Fondamentaux] Quel est l'avantage principal d'une image de base Alpine ?",
    options: [
      "Elle est plus sécurisée car elle utilise un noyau personnalisé",
      "Sa taille réduite diminue la surface d'attaque et accélère les téléchargements",
      "Elle supporte plus de langages de programmation",
      "Elle est compatible avec tous les hyperviseurs",
    ],
    answer:
      "Sa taille réduite diminue la surface d'attaque et accélère les téléchargements",
    explanation:
      "Alpine pèse environ 5 Mo, ce qui réduit la surface d'attaque et accélère les pulls/pushs.",
  },

  // B. Docker (15)
  {
    question: "[Docker] À quoi sert la commande docker build ?",
    options: [
      "À lancer un conteneur en arrière-plan",
      "À construire une image à partir d'un Dockerfile",
      "À supprimer une image existante",
      "À exporter une image vers un fichier",
    ],
    answer: "À construire une image à partir d'un Dockerfile",
    explanation:
      "docker build lit les instructions du Dockerfile et construit l'image couche par couche.",
  },
  {
    question: "[Docker] Quelle commande lance un conteneur en arrière-plan avec mapping de port ?",
    options: [
      "docker start -d -p 80:80 <image>",
      "docker run -d -p 80:80 <image>",
      "docker run -a -p 80:80 <image>",
      "docker exec -d -p 80:80 <image>",
    ],
    answer: "docker run -d -p 80:80 <image>",
    explanation:
      "run = créer et démarrer ; -d = détaché (background) ; -p = mapping de port hôte:conteneur.",
  },
  {
    question: "[Docker] Que signifie le flag -d dans docker run ?",
    options: [
      "Debug mode — mode de débogage",
      "Détaché — le conteneur tourne en arrière-plan",
      "Démon — le conteneur est géré par un démon séparé",
      "Double — le conteneur est dupliqué pour la haute disponibilité",
    ],
    answer: "Détaché — le conteneur tourne en arrière-plan",
    explanation:
      "-d (detach) signifie que le conteneur s'exécute en arrière-plan sans bloquer le terminal.",
  },
  {
    question: "[Docker] Quelle commande liste les conteneurs actifs ?",
    options: ["docker ps", "docker ps -a", "docker ls", "docker containers"],
    answer: "docker ps",
    explanation: "docker ps liste uniquement les conteneurs en cours d'exécution.",
  },
  {
    question: "[Docker] Quelle commande liste TOUS les conteneurs (y compris arrêtés) ?",
    options: ["docker ps", "docker ps -a", "docker ls -all", "docker containers -a"],
    answer: "docker ps -a",
    explanation: "Le flag -a (all) inclut les conteneurs arrêtés dans la liste.",
  },
  {
    question: "[Docker] Quelle commande suit les logs d'un conteneur en continu ?",
    options: [
      "docker logs <id>",
      "docker logs -f <id>",
      "docker logs --tail <id>",
      "docker follow <id>",
    ],
    answer: "docker logs -f <id>",
    explanation: "-f (follow) suit les logs en continu, comme tail -f.",
  },
  {
    question: "[Docker] À quoi sert docker compose ?",
    options: [
      "À orchestrer des conteneurs sur plusieurs machines",
      "À définir et lancer des applications multi-conteneurs sur un seul hôte",
      "À construire des images en parallèle",
      "À gérer les secrets pour plusieurs conteneurs",
    ],
    answer:
      "À définir et lancer des applications multi-conteneurs sur un seul hôte",
    explanation:
      "Compose utilise un fichier YAML pour définir et lancer plusieurs conteneurs sur un seul hôte.",
  },
  {
    question: "[Docker] Quelle est la commande pour lancer une stack compose en arrière-plan ?",
    options: [
      "docker compose up",
      "docker compose up -d",
      "docker compose start",
      "docker compose run -d",
    ],
    answer: "docker compose up -d",
    explanation: "-d lance la stack en arrière-plan (détaché).",
  },
  {
    question: "[Docker] Que nettoie docker system prune ?",
    options: [
      "Seulement les images non utilisées",
      "Les ressources inutilisées (images, volumes, réseaux orphelins)",
      "Uniquement les conteneurs arrêtés",
      "Toutes les données y compris les volumes utilisés",
    ],
    answer:
      "Les ressources inutilisées (images, volumes, réseaux orphelins)",
    explanation:
      "system prune nettoie les images, conteneurs, réseaux et volumes non utilisés pour libérer de l'espace.",
  },
  {
    question: "[Docker] Comment supprimer un conteneur ?",
    options: ["docker rm <conteneur>", "docker rmi <conteneur>", "docker delete <conteneur>", "docker remove <conteneur>"],
    answer: "docker rm <conteneur>",
    explanation: "rm = remove, pour supprimer un conteneur arrêté.",
  },
  {
    question: "[Docker] Comment supprimer une image ?",
    options: ["docker rm <image>", "docker rmi <image>", "docker delete image <image>", "docker image remove <image>"],
    answer: "docker rmi <image>",
    explanation: "rmi = remove image, pour supprimer une image.",
  },
  {
    question: "[Docker] Quelle commande copie des fichiers entre l'hôte et un conteneur ?",
    options: ["docker copy", "docker cp", "docker sync", "docker transfer"],
    answer: "docker cp",
    explanation: "docker cp copie des fichiers/dossiers entre l'hôte et le conteneur.",
  },
  {
    question: "[Docker] À quoi sert docker commit ?",
    options: [
      "À créer une nouvelle image à partir des modifications d'un conteneur",
      "À enregistrer l'état d'un conteneur dans un fichier",
      "À sauvegarder les logs d'un conteneur",
      "À créer un snapshot du système de fichiers",
    ],
    answer:
      "À créer une nouvelle image à partir des modifications d'un conteneur",
    explanation:
      "commit capture l'état actuel d'un conteneur (couche inscriptible) et en fait une image.",
  },
  {
    question: "[Docker] Que signifie docker save ?",
    options: [
      "Sauvegarder les logs dans un fichier",
      "Exporter une image dans un fichier archive (.tar)",
      "Enregistrer les paramètres d'un conteneur",
      "Créer un checkpoint d'un conteneur",
    ],
    answer: "Exporter une image dans un fichier archive (.tar)",
    explanation: "save exporte une image Docker dans un fichier .tar pour l'archivage ou le transfert.",
  },
  {
    question: "[Docker] Que signifie docker load ?",
    options: [
      "Importer une image depuis un fichier archive (.tar)",
      "Charger les logs en mémoire",
      "Lancer un conteneur en arrière-plan",
      "Démarrer plusieurs conteneurs en parallèle",
    ],
    answer: "Importer une image depuis un fichier archive (.tar)",
    explanation: "load importe une image depuis un fichier .tar créé par docker save.",
  },

  // C. Kubernetes (15)
  {
    question: "[Kubernetes] Quelle est la plus petite unité déployable dans Kubernetes ?",
    options: ["Le Deployment", "Le Pod", "Le Service", "Le Container"],
    answer: "Le Pod",
    explanation:
      "Le Pod est la plus petite unité, contenant un ou plusieurs conteneurs partageant réseau et stockage.",
  },
  {
    question: "[Kubernetes] À quoi sert un Deployment ?",
    options: [
      "À fournir un point d'accès réseau stable",
      "À gérer un ensemble de pods identiques, piloter les rolling updates",
      "À stocker des données sensibles",
      "À exposer des services HTTP/HTTPS",
    ],
    answer:
      "À gérer un ensemble de pods identiques, piloter les rolling updates",
    explanation:
      "Le Deployment gère les ReplicaSets, les rolling updates, les rollbacks et la mise à l'échelle.",
  },
  {
    question: "[Kubernetes] À quoi sert un Service ?",
    options: [
      "À gérer les mises à jour d'une application",
      "À fournir un point d'accès réseau stable vers un ensemble de pods",
      "À configurer les règles de routage HTTP",
      "À stocker la configuration de l'application",
    ],
    answer:
      "À fournir un point d'accès réseau stable vers un ensemble de pods",
    explanation:
      "Le Service agit comme un load balancer interne, donnant une IP/ DNS stable même si les pods changent.",
  },
  {
    question: "[Kubernetes] À quoi sert un Ingress ?",
    options: [
      "À créer un réseau interne entre pods",
      "À gérer les règles de routage HTTP/HTTPS depuis l'extérieur",
      "À stocker des données persistantes",
      "À configurer la sécurité des pods",
    ],
    answer:
      "À gérer les règles de routage HTTP/HTTPS depuis l'extérieur",
    explanation:
      "Ingress apporte le routage HTTP/HTTPS avec TLS, noms de domaine et équilibrage de charge.",
  },
  {
    question: "[Kubernetes] À quoi servent les Namespaces ?",
    options: [
      "À isoler les conteneurs d'un même pod",
      "À partitionner logiquement le cluster pour isoler des équipes ou environnements",
      "À gérer les volumes persistants",
      "À définir les politiques réseau",
    ],
    answer:
      "À partitionner logiquement le cluster pour isoler des équipes ou environnements",
    explanation:
      "Les Namespaces permettent d'isoler des ressources entre équipes, environnements (dev/staging/prod) ou projets.",
  },
  {
    question: "[Kubernetes] Quelle est la différence entre ConfigMap et Secret ?",
    options: [
      "ConfigMap stocke les données sensibles ; Secret stocke la configuration non sensible",
      "ConfigMap stocke la configuration non sensible ; Secret stocke les données sensibles",
      "ConfigMap est utilisé pour les variables d'environnement uniquement",
      "Secret est une alternative à etcd pour le stockage",
    ],
    answer:
      "ConfigMap stocke la configuration non sensible ; Secret stocke les données sensibles",
    explanation:
      "ConfigMap pour les données non sensibles (ex: config d'app) ; Secret pour les données sensibles (ex: mots de passe, tokens).",
  },
  {
    question: "[Kubernetes] Que stocke etcd dans un cluster Kubernetes ?",
    options: [
      "Les logs de tous les pods",
      "L'intégralité de l'état du cluster (source de vérité)",
      "Les images Docker des conteneurs",
      "Les règles de Network Policies",
    ],
    answer: "L'intégralité de l'état du cluster (source de vérité)",
    explanation:
      "etcd est la base de données clé-valeur distribuée qui stocke tout l'état du cluster.",
  },
  {
    question: "[Kubernetes] Quelle est la commande pour lister les pods ?",
    options: [
      "kubectl list pods",
      "kubectl get pods",
      "kubectl show pods",
      "kubectl describe pods",
    ],
    answer: "kubectl get pods",
    explanation: "get est la commande standard pour lister les ressources Kubernetes.",
  },
  {
    question: "[Kubernetes] Quelle commande applique un fichier de configuration ?",
    options: [
      "kubectl create -f <fichier>",
      "kubectl apply -f <fichier>",
      "kubectl set -f <fichier>",
      "kubectl update -f <fichier>",
    ],
    answer: "kubectl apply -f <fichier>",
    explanation:
      "apply est déclaratif : il crée ou met à jour la ressource selon l'état désiré.",
  },
  {
    question: "[Kubernetes] Quelle commande décrit un pod en détail ?",
    options: [
      "kubectl get pod <nom>",
      "kubectl describe pod <nom>",
      "kubectl inspect pod <nom>",
      "kubectl show pod <nom>",
    ],
    answer: "kubectl describe pod <nom>",
    explanation:
      "describe affiche les détails, événements, conditions et raisons d'échec d'un pod.",
  },
  {
    question: "[Kubernetes] Quelle commande suit les logs d'un pod ?",
    options: [
      "kubectl tail -f <pod>",
      "kubectl logs -f <pod>",
      "kubectl show logs <pod>",
      "kubectl get logs <pod>",
    ],
    answer: "kubectl logs -f <pod>",
    explanation: "logs -f suit les logs en continu, comme docker logs -f.",
  },
  {
    question: "[Kubernetes] Quelle commande ouvre un shell dans un pod ?",
    options: [
      "kubectl exec -it <pod> -- sh",
      "kubectl run -it <pod> sh",
      "kubectl shell <pod>",
      "kubectl attach <pod> sh",
    ],
    answer: "kubectl exec -it <pod> -- sh",
    explanation: "exec -it ouvre un shell interactif dans un conteneur du pod.",
  },
  {
    question: "[Kubernetes] Que vérifie la liveness probe ?",
    options: [
      "Si le conteneur est prêt à recevoir du trafic",
      "Si le conteneur est toujours en vie (sinon Kubernetes redémarre le pod)",
      "Si le conteneur a terminé son exécution",
      "Si les volumes sont correctement montés",
    ],
    answer:
      "Si le conteneur est toujours en vie (sinon Kubernetes redémarre le pod)",
    explanation:
      "La liveness probe vérifie que le conteneur ne s'est pas bloqué ; en cas d'échec, Kubernetes le redémarre.",
  },
  {
    question: "[Kubernetes] Que vérifie la readiness probe ?",
    options: [
      "Si le conteneur est prêt à recevoir du trafic (sinon retiré du Service)",
      "Si le conteneur est toujours en vie",
      "Si le conteneur a des ressources CPU suffisantes",
      "Si les montages NFS sont disponibles",
    ],
    answer:
      "Si le conteneur est prêt à recevoir du trafic (sinon retiré du Service)",
    explanation:
      "La readiness probe retire le pod du Service s'il n'est pas prêt ; il n'est pas redémarré pour autant.",
  },
  {
    question: "[Kubernetes] Quelle commande modifie le nombre de réplicas d'un déploiement ?",
    options: [
      "kubectl update deployment <nom> --replicas=5",
      "kubectl scale deployment <nom> --replicas=5",
      "kubectl resize deployment <nom> --replicas=5",
      "kubectl set replicas deployment <nom> --replicas=5",
    ],
    answer: "kubectl scale deployment <nom> --replicas=5",
    explanation:
      "scale est la commande dédiée à la modification du nombre de réplicas.",
  },
],
  avance: [
     {
    question:
      "[Architecture] Décrivez l'architecture complète de Docker (client → démon → conteneur).",
    options: [
      "Client → dockerd → containerd → runc → conteneur",
      "Client → containerd → dockerd → runc → conteneur",
      "dockerd → client → containerd → runc → conteneur",
      "Client → dockerd → runc → containerd → conteneur",
    ],
    answer: "Client → dockerd → containerd → runc → conteneur",
    explanation:
      "Le client CLI/API envoie la requête au démon dockerd, qui utilise containerd pour le cycle de vie, et runc (OCI) pour créer le conteneur.",
  },
  {
    question: "[Architecture] Quels sont les composants du control plane Kubernetes ?",
    options: [
      "API Server, Scheduler, Controller Manager, etcd",
      "kubelet, kube-proxy, containerd",
      "API Server, kubelet, Scheduler, etcd",
      "Controller Manager, kubelet, kube-proxy",
    ],
    answer: "API Server, Scheduler, Controller Manager, etcd",
    explanation:
      "Le control plane est composé de l'API Server, Scheduler, Controller Manager et etcd.",
  },
  {
    question: "[Architecture] Quels sont les composants d'un node Kubernetes ?",
    options: [
      "API Server, Scheduler, etcd",
      "kubelet, kube-proxy, runtime de conteneurs (containerd/CRI-O)",
      "Controller Manager, kubelet, API Server",
      "kube-proxy, Scheduler, containerd",
    ],
    answer: "kubelet, kube-proxy, runtime de conteneurs (containerd/CRI-O)",
    explanation:
      "Chaque node exécute un kubelet (agent), un kube-proxy (réseau) et un runtime de conteneurs.",
  },
  {
    question: "[Architecture] Comment fonctionne la boucle de contrôle dans Kubernetes ?",
    options: [
      "Elle exécute des scripts périodiquement sur chaque node",
      "Elle compare l'état désiré à l'état observé et les réconcilie en continu",
      "Elle redémarre automatiquement les nodes défaillants",
      "Elle maintient un cache des images Docker",
    ],
    answer:
      "Elle compare l'état désiré à l'état observé et les réconcilie en continu",
    explanation:
      "C'est le principe fondamental de Kubernetes : déclarer l'état désiré, le système maintient l'état réel correspondant.",
  },
  {
    question: "[Architecture] Quelle est l'architecture de Docker Swarm ?",
    options: [
      "Un seul manager qui décide de tout",
      "Des managers (plan de contrôle, consensus Raft) et des workers (exécution)",
      "Tous les nodes sont identiques et prennent les décisions collectivement",
      "Un contrôleur central qui orchestre tous les workers",
    ],
    answer:
      "Des managers (plan de contrôle, consensus Raft) et des workers (exécution)",
    explanation:
      "Les managers (nombre impair) forment le plan de contrôle avec Raft ; les workers exécutent les tâches.",
  },
  {
    question: "[Architecture] Comment fonctionne le routing mesh dans Swarm ?",
    options: [
      "Il distribue les requêtes entrantes vers n'importe quel node exposant le service",
      "Il achemine le trafic via un proxy central unique",
      "Il utilise des tables de routage statiques configurées manuellement",
      "Il s'appuie sur un load balancer externe",
    ],
    answer:
      "Il distribue les requêtes entrantes vers n'importe quel node exposant le service",
    explanation:
      "Le routing mesh permet à tout node de recevoir une requête et de la router vers un node qui exécute le service.",
  },
  {
    question: "[Architecture] Quelle est la particularité de k3s par rapport à Kubernetes standard ?",
    options: [
      "Il n'est pas compatible avec les manifests Kubernetes",
      "C'est une version plus sécurisée avec moins de fonctionnalités",
      "Un seul binaire, SQLite par défaut, composants désactivés, Traefik intégré, empreinte réduite",
      "Il utilise un noyau Linux personnalisé",
    ],
    answer:
      "Un seul binaire, SQLite par défaut, composants désactivés, Traefik intégré, empreinte réduite",
    explanation:
      "k3s est certifié CNCF, compatible Kubernetes, mais allégé pour l'edge et les petits environnements.",
  },
  {
    question: "[Architecture] Quel composant est remplacé par SQLite dans k3s par défaut ?",
    options: ["etcd", "kube-apiserver", "kube-scheduler", "containerd"],
    answer: "etcd",
    explanation:
      "SQLite remplace etcd pour les petits clusters mono-node, réduisant l'empreinte mémoire.",
  },
  {
    question: "[Architecture] Comment s'articule ArmoniK avec Kubernetes ?",
    options: [
      "ArmoniK remplace complètement Kubernetes",
      "ArmoniK s'exécute sur un cluster Kubernetes, ajoutant un control plane logique de tâches",
      "ArmoniK est une alternative à Kubernetes pour le HPC",
      "ArmoniK ne dépend pas de Kubernetes",
    ],
    answer:
      "ArmoniK s'exécute sur un cluster Kubernetes, ajoutant un control plane logique de tâches",
    explanation:
      "ArmoniK utilise Kubernetes pour l'orchestration bas niveau des pods et des ressources, en ajoutant sa couche d'orchestration de tâches.",
  },
  {
    question: "[Architecture] Quelle est l'unité de travail dans ArmoniK ?",
    options: [
      "Un Pod Kubernetes",
      "Un Service Kubernetes",
      "Une tâche de calcul (task), pas un service persistant",
      "Une image Docker",
    ],
    answer: "Une tâche de calcul (task), pas un service persistant",
    explanation:
      "L'unité de travail n'est pas un service qui tourne en continu mais une tâche de calcul soumise dynamiquement.",
  },
  {
    question: "[Architecture] Qu'est-ce qu'un DAG dynamique dans ArmoniK ?",
    options: [
      "Un graphe de dépendances statique défini avant l'exécution",
      "Un graphe de dépendances entre tâches qui peut évoluer pendant l'exécution",
      "Un algorithme de répartition de charge",
      "Un protocole de communication entre workers",
    ],
    answer:
      "Un graphe de dépendances entre tâches qui peut évoluer pendant l'exécution",
    explanation:
      "Le DAG dynamique permet à une tâche en cours de générer de nouvelles sous-tâches (ex: Monte-Carlo imbriqué).",
  },
  {
    question: "[Architecture] Comment Docker Swarm assure-t-il la cohérence entre managers ?",
    options: [
      "Via une base de données SQL partagée",
      "Via le protocole Raft qui élit un leader et maintient un état cohérent",
      "Via un stockage distribué sur chaque manager",
      "Via des snapshots réguliers de l'état",
    ],
    answer:
      "Via le protocole Raft qui élit un leader et maintient un état cohérent",
    explanation:
      "Raft est l'algorithme de consensus utilisé par Swarm pour maintenir la cohérence entre managers.",
  },
  {
    question: "[Architecture] Quelle est la différence entre un manager et un worker dans Swarm ?",
    options: [
      "Manager = exécution ; Worker = plan de contrôle",
      "Manager = plan de contrôle (décisions) ; Worker = exécution uniquement",
      "Manager = stockage des images ; Worker = réseau",
      "Ils sont interchangeables et ont les mêmes responsabilités",
    ],
    answer: "Manager = plan de contrôle (décisions) ; Worker = exécution uniquement",
    explanation:
      "Les managers prennent les décisions d'ordonnancement ; les workers exécutent les conteneurs assignés.",
  },
  {
    question: "[Architecture] Quel protocole utilise ArmoniK pour ses communications ?",
    options: ["REST API", "gRPC", "WebSocket", "MQTT"],
    answer: "gRPC",
    explanation:
      "ArmoniK utilise gRPC pour la soumission, le monitoring et la récupération des résultats.",
  },
  {
    question: "[Architecture] Quels composants sont désactivés par défaut dans k3s ?",
    options: [
      "etcd, kubelet, kube-proxy",
      "Pilotes cloud legacy, fonctionnalités alpha rarement utilisées, certains add-ons",
      "Toutes les fonctionnalités de sécurité",
      "Le support du réseau overlay",
    ],
    answer:
      "Pilotes cloud legacy, fonctionnalités alpha rarement utilisées, certains add-ons",
    explanation:
      "k3s retire certains composants legacy ou rarement utilisés pour réduire l'empreinte.",
  },

  // E. Sécurité & Débogage (15)
  {
    question: "[Sécurité] Pourquoi le démon Docker en root est-il un problème de sécurité ?",
    options: [
      "Il ralentit les conteneurs",
      "Un conteneur mal configuré peut avoir des chemins d'évasion vers l'hôte",
      "Il n'est pas compatible avec les images OCI",
      "Il limite le nombre de conteneurs pouvant tourner",
    ],
    answer:
      "Un conteneur mal configuré peut avoir des chemins d'évasion vers l'hôte",
    explanation:
      "Le démon tourne en root ; un conteneur compromis peut potentiellement accéder à l'hôte.",
  },
  {
    question: "[Sécurité] Comment sécuriser Docker ?",
    options: [
      "Désactiver les cgroups",
      "Mode rootless, scan des images, supprimer les secrets des images, limiter les capabilities",
      "Utiliser exclusivement des images Ubuntu",
      "Désactiver le réseau des conteneurs",
    ],
    answer:
      "Mode rootless, scan des images, supprimer les secrets des images, limiter les capabilities",
    explanation:
      "Ces bonnes pratiques réduisent la surface d'attaque et les risques de compromission.",
  },
  {
    question: "[Sécurité] Qu'est-ce que docker secret dans Swarm ?",
    options: [
      "Un mot de passe pour accéder au cluster",
      "Un objet natif pour stocker des données sensibles, chiffré au repos et distribué aux services",
      "Une alternative à etcd",
      "Un outil de chiffrement des volumes",
    ],
    answer:
      "Un objet natif pour stocker des données sensibles, chiffré au repos et distribué aux services",
    explanation:
      "docker secret est chiffré au repos et n'est exposé qu'aux services qui en ont besoin.",
  },
  {
    question: "[Sécurité] Que permet le TLS mutuel dans Swarm ?",
    options: [
      "Chiffrer et authentifier toutes les communications entre nodes du cluster",
      "Chiffrer uniquement les communications avec l'extérieur",
      "Authentifier les utilisateurs via LDAP",
      "Protéger les volumes contre les accès non autorisés",
    ],
    answer:
      "Chiffrer et authentifier toutes les communications entre nodes du cluster",
    explanation:
      "Le TLS mutuel est activé par défaut dans Swarm et protège toutes les communications internes.",
  },
  {
    question: "[Sécurité] Qu'est-ce que RBAC dans Kubernetes ?",
    options: [
      "Un protocole de chiffrement",
      "Role-Based Access Control, contrôle fin de qui peut faire quoi sur quelles ressources",
      "Un système de montage de volumes",
      "Un outil de débogage des pods",
    ],
    answer:
      "Role-Based Access Control, contrôle fin de qui peut faire quoi sur quelles ressources",
    explanation:
      "RBAC est le système d'autorisation de Kubernetes, permettant de restreindre les accès selon les rôles.",
  },
  {
    question: "[Sécurité] Que sont les Network Policies dans Kubernetes ?",
    options: [
      "Des règles qui autorisent tout le trafic par défaut",
      "Des règles qui segmentent le trafic entre pods, refusé par défaut si non explicitement autorisé",
      "Des règles de routage pour les services",
      "Des règles d'équilibrage de charge",
    ],
    answer:
      "Des règles qui segmentent le trafic entre pods, refusé par défaut si non explicitement autorisé",
    explanation:
      "Les Network Policies permettent de contrôler quels pods peuvent communiquer entre eux.",
  },
  {
    question: "[Sécurité] Pourquoi activer le chiffrement des secrets dans etcd ?",
    options: [
      "Pour accélérer l'accès aux données",
      "Parce qu'il n'est pas activé par défaut et que les secrets sont stockés en clair",
      "Pour réduire la taille de la base de données",
      "Pour assurer la haute disponibilité",
    ],
    answer:
      "Parce qu'il n'est pas activé par défaut et que les secrets sont stockés en clair",
    explanation:
      "Les secrets sont stockés en clair dans etcd ; il faut activer le chiffrement au repos manuellement.",
  },
  {
    question: "[Sécurité] Que sont les Pod Security Standards ?",
    options: [
      "Des contraintes sur les privilèges qu'un pod peut demander",
      "Des règles de réseau pour les pods",
      "Des standards de performance pour les pods",
      "Des niveaux de priorité pour les pods",
    ],
    answer:
      "Des contraintes sur les privilèges qu'un pod peut demander",
    explanation:
      "Les PSS définissent des profils de sécurité (Privileged, Baseline, Restricted).",
  },
  {
    question: "[Sécurité] Pourquoi ne pas stocker de secrets dans un Dockerfile ?",
    options: [
      "Parce que ça ralentit le build",
      "Ils restent dans l'historique des couches de l'image, donc exposés",
      "Parce que Dockerfile ne supporte pas les variables",
      "Parce que les secrets sont automatiquement supprimés au build",
    ],
    answer:
      "Ils restent dans l'historique des couches de l'image, donc exposés",
    explanation:
      "Les secrets en clair dans un Dockerfile sont persistants dans l'historique des couches et accessibles.",
  },
  {
    question: "[Débogage] Comment déboguer un problème de planification de pod ?",
    options: [
      "kubectl describe pod → événements et raison de l'échec de planification",
      "kubectl logs pod",
      "kubectl exec -it pod -- sh",
      "kubectl get events --sort-by=.lastTimestamp",
    ],
    answer:
      "kubectl describe pod → événements et raison de l'échec de planification",
    explanation:
      "describe pod affiche les événements qui indiquent pourquoi le pod n'a pas pu être planifié.",
  },
  {
    question: "[Débogage] Que faire si un pod redémarre en boucle ?",
    options: [
      "Redémarrer le cluster",
      "Vérifier les probes (liveness/readiness), logs précédents (--previous), inspecter les events",
      "Supprimer et recréer le pod manuellement",
      "Augmenter la mémoire du pod",
    ],
    answer:
      "Vérifier les probes (liveness/readiness), logs précédents (--previous), inspecter les events",
    explanation:
      "Les redémarrages en boucle viennent souvent d'une mauvaise configuration des probes ou d'erreurs applicatives.",
  },
  {
    question: "[Débogage] Comment suivre la consommation de ressources d'un pod ?",
    options: [
      "kubectl top pod (avec metrics-server installé)",
      "kubectl describe pod",
      "kubectl get pod -o yaml",
      "kubectl logs pod",
    ],
    answer: "kubectl top pod (avec metrics-server installé)",
    explanation:
      "top pod nécessite metrics-server et affiche la consommation CPU/RAM en temps réel.",
  },
  {
    question: "[Débogage] À quoi sert docker events ?",
    options: [
      "Afficher les logs des conteneurs",
      "Flux d'événements du démon, utile pour comprendre l'enchaînement des actions",
      "Lister tous les conteneurs",
      "Inspecter la configuration d'un conteneur",
    ],
    answer:
      "Flux d'événements du démon, utile pour comprendre l'enchaînement des actions",
    explanation:
      "docker events montre les créations, arrêts, échecs de santé en temps réel.",
  },
  {
    question: "[Débogage] Quels réflexes de débogage pour un service Swarm qui redémarre ?",
    options: [
      "docker service ps, docker service logs, docker node ls",
      "docker logs, docker inspect",
      "kubectl describe, kubectl logs",
      "journalctl -u docker",
    ],
    answer: "docker service ps, docker service logs, docker node ls",
    explanation:
      "docker service ps montre l'état des réplicas ; service logs agrège les logs ; node ls vérifie l'état des nodes.",
  },
  {
    question: "[Débogage] Comment déboguer k3s ?",
    options: [
      "kubectl seulement",
      "journalctl -u k3s, k3s check-config, kubectl standard",
      "docker logs k3s",
      "k3s debug",
    ],
    answer: "journalctl -u k3s, k3s check-config, kubectl standard",
    explanation:
      "journalctl pour les logs système, check-config pour valider l'environnement, kubectl pour les ressources.",
  },

  // F. Orchestration & Comparaison (15)
  {
    question:
      "[Orchestration] Quelle est la principale différence entre Swarm et Kubernetes ?",
    options: [
      "Swarm est plus puissant que Kubernetes",
      "Swarm est plus simple mais écosystème en déclin ; Kubernetes est complexe mais standard du marché",
      "Swarm est open source, pas Kubernetes",
      "Swarm ne supporte pas les volumes",
    ],
    answer:
      "Swarm est plus simple mais écosystème en déclin ; Kubernetes est complexe mais standard du marché",
    explanation:
      "Swarm a été conçu pour la simplicité mais son écosystème s'est tari ; Kubernetes est devenu le standard.",
  },
  {
    question:
      "[Orchestration] Quand choisir Docker Swarm plutôt que Kubernetes ?",
    options: [
      "Pour des projets nécessitant une grande scalabilité",
      "Petites infrastructures, équipes déjà à l'aise avec Docker, simplicité prioritaire",
      "Pour des environnements multi-cloud",
      "Pour des applications avec des millions d'utilisateurs",
    ],
    answer:
      "Petites infrastructures, équipes déjà à l'aise avec Docker, simplicité prioritaire",
    explanation:
      "Swarm est adapté aux petits environnements où la simplicité prime sur la richesse fonctionnelle.",
  },
  {
    question: "[Orchestration] Quand choisir k3s plutôt que Kubernetes standard ?",
    options: [
      "Pour la production à grande échelle",
      "Edge/IoT, dev/CI local, matériel contraint, besoin d'un vrai Kubernetes sans l'overhead",
      "Pour des applications nécessitant des opérateurs personnalisés",
      "Pour des clusters multi-région",
    ],
    answer:
      "Edge/IoT, dev/CI local, matériel contraint, besoin d'un vrai Kubernetes sans l'overhead",
    explanation:
      "k3s est idéal pour les environnements contraints tout en restant compatible Kubernetes.",
  },
  {
    question: "[Orchestration] Quand utiliser ArmoniK ?",
    options: [
      "Pour déployer des applications web",
      "HPC/finance quantitative, millions de tâches de calcul avec dépendances dynamiques",
      "Pour orchestrer des microservices",
      "Pour gérer des bases de données en cluster",
    ],
    answer:
      "HPC/finance quantitative, millions de tâches de calcul avec dépendances dynamiques",
    explanation:
      "ArmoniK est conçu pour le calcul haute performance et les graphes de tâches évolutifs.",
  },
  {
    question: "[Orchestration] Qu'est-ce qu'un opérateur Kubernetes ?",
    options: [
      "Un ingénieur qui administre le cluster",
      "Un contrôleur personnalisé qui automatise la gestion d'applications complexes",
      "Un outil de monitoring",
      "Une alternative à Helm",
    ],
    answer:
      "Un contrôleur personnalisé qui automatise la gestion d'applications complexes",
    explanation:
      "Un opérateur encode la logique opérationnelle d'une application dans des contrôleurs Kubernetes.",
  },
  {
    question: "[Orchestration] Que signifie Helm dans l'écosystème Kubernetes ?",
    options: [
      "Un package manager pour Kubernetes, déployant des applications packagées (charts)",
      "Un outil de monitoring des clusters",
      "Un système de stockage distribué",
      "Un outil de sécurité pour les secrets",
    ],
    answer:
      "Un package manager pour Kubernetes, déployant des applications packagées (charts)",
    explanation:
      "Helm est le gestionnaire de paquets de Kubernetes, facilitant le déploiement d'applications complexes.",
  },
  {
    question: "[Orchestration] Pourquoi l'écosystème Swarm est-il en déclin ?",
    options: [
      "Parce que Docker l'a abandonné",
      "Les fournisseurs cloud ne proposent plus d'offres managées, la communauté s'est tournée vers Kubernetes",
      "Parce qu'il est trop complexe",
      "Parce qu'il est payant",
    ],
    answer:
      "Les fournisseurs cloud ne proposent plus d'offres managées, la communauté s'est tournée vers Kubernetes",
    explanation:
      "L'adoption de Kubernetes par le marché a marginalisé Swarm, dont l'écosystème s'est tari.",
  },
  {
    question: "[Orchestration] Quelle est la courbe d'apprentissage de Kubernetes ?",
    options: [
      "Courte (quelques jours)",
      "Longue (plusieurs mois à années) ; complexité opérationnelle considérable",
      "Moyenne (quelques semaines)",
      "Identique à Docker",
    ],
    answer:
      "Longue (plusieurs mois à années) ; complexité opérationnelle considérable",
    explanation:
      "Kubernetes est un système complexe avec des dizaines de concepts interdépendants.",
  },
  {
    question: "[Orchestration] Que coûte la haute disponibilité dans Kubernetes ?",
    options: [
      "Un etcd multi-node, des managers redondants, une complexité opérationnelle accrue",
      "Seulement un node supplémentaire",
      "Aucun coût supplémentaire",
      "Un load balancer externe",
    ],
    answer:
      "Un etcd multi-node, des managers redondants, une complexité opérationnelle accrue",
    explanation:
      "La HA nécessite des composants redondants et ajoute de la complexité opérationnelle.",
  },
  {
    question: "[Orchestration] Quand Docker Compose est-il approprié en production ?",
    options: [
      "Pour des applications multi-hôtes à grande échelle",
      "Jamais à grande échelle ; uniquement pour des applications mono-hôte simples",
      "Pour des environnements de production critiques",
      "Pour des clusters de plusieurs centaines de conteneurs",
    ],
    answer:
      "Jamais à grande échelle ; uniquement pour des applications mono-hôte simples",
    explanation:
      "Compose n'est pas fait pour la production multi-hôtes ; il est conçu pour le développement local.",
  },
  {
    question: "[Orchestration] Pourquoi choisir une offre Kubernetes managée (EKS/GKE/AKS) ?",
    options: [
      "Pour réduire la charge opérationnelle (control plane géré par le cloud provider)",
      "Pour diminuer le coût des ressources",
      "Pour bénéficier de plus de fonctionnalités",
      "Pour éviter d'utiliser des nodes",
    ],
    answer:
      "Pour réduire la charge opérationnelle (control plane géré par le cloud provider)",
    explanation:
      "Les offres managées prennent en charge l'exploitation du control plane, réduisant l'effort SRE.",
  },
  {
    question: "[Orchestration] Qu'est-ce que le vendor lock-in et comment l'éviter ?",
    options: [
      "Dépendance à un fournisseur ; Kubernetes aide à l'éviter grâce à sa standardisation",
      "Un type de licence logicielle",
      "Un protocole réseau propriétaire",
      "Une méthode de cryptage des données",
    ],
    answer:
      "Dépendance à un fournisseur ; Kubernetes aide à l'éviter grâce à sa standardisation",
    explanation:
      "Kubernetes est standardisé par la CNCF, ce qui facilite la migration entre cloud providers.",
  },
  {
    question: "[Orchestration] Quelle est la question à se poser avant de choisir Kubernetes ?",
    options: [
      "Quel est le plus puissant outil du marché ?",
      "Ai-je vraiment besoin de cette complexité, ou est-ce un choix par effet de mode ?",
      "Quel est le plus populaire sur GitHub ?",
      "Quel outil mon concurrent utilise-t-il ?",
    ],
    answer:
      "Ai-je vraiment besoin de cette complexité, ou est-ce un choix par effet de mode ?",
    explanation:
      "Kubernetes est souvent choisi par défaut sans évaluer sa pertinence pour le besoin réel.",
  },
  {
    question: "[Orchestration] Qu'est-ce que le GitOps ?",
    options: [
      "Une approche où l'état désiré du cluster est stocké dans Git, synchronisé automatiquement",
      "Un outil de versionnement pour les images Docker",
      "Une méthode de déploiement manuel",
      "Un framework de test unitaire",
    ],
    answer:
      "Une approche où l'état désiré du cluster est stocké dans Git, synchronisé automatiquement",
    explanation:
      "GitOps utilise Git comme source de vérité, avec des outils comme ArgoCD pour la synchronisation.",
  },
  {
    question: "[Orchestration] Pourquoi les images minimales (distroless, Alpine) sont-elles recommandées ?",
    options: [
      "Pour réduire la surface d'attaque et la taille de l'image",
      "Pour améliorer les performances CPU",
      "Pour faciliter le débogage",
      "Pour supporter plus de langages",
    ],
    answer: "Pour réduire la surface d'attaque et la taille de l'image",
    explanation:
      "Moins de composants signifie moins de vulnérabilités et des pulls/pushs plus rapides.",
  },

  // G. ArmoniK (10)
  {
    question: "[ArmoniK] Quelle est la licence du cœur d'ArmoniK ?",
    options: ["MIT", "Apache 2.0", "AGPL (ArmoniK.Core)", "GPL v3"],
    answer: "AGPL (ArmoniK.Core)",
    explanation:
      "Le composant ArmoniK.Core est sous licence AGPL ; le reste du projet est en Apache 2.0.",
  },
  {
    question: "[ArmoniK] Qu'est-ce que le sub-tasking dans ArmoniK ?",
    options: [
      "La capacité d'une tâche à se décomposer dynamiquement en sous-tâches plus petites",
      "Un mécanisme de répartition de charge",
      "Une méthode de compression des données",
      "Un protocole de communication entre workers",
    ],
    answer:
      "La capacité d'une tâche à se décomposer dynamiquement en sous-tâches plus petites",
    explanation:
      "Le sub-tasking permet une décomposition dynamique des tâches pour mieux utiliser les ressources.",
  },
  {
    question: "[ArmoniK] Comment ArmoniK gère-t-il les dépendances entre tâches ?",
    options: [
      "Via une file FIFO simple",
      "Via un DAG (graphe acyclique dirigé) dynamique qui peut évoluer pendant l'exécution",
      "Via une base de données relationnelle",
      "Via des dépendances implicites basées sur l'ordre de soumission",
    ],
    answer:
      "Via un DAG (graphe acyclique dirigé) dynamique qui peut évoluer pendant l'exécution",
    explanation:
      "Le DAG dynamique permet des graphes de dépendances complexes qui évoluent en temps réel.",
  },
  {
    question: "[ArmoniK] Que signifie Serverless HPC dans le contexte d'ArmoniK ?",
    options: [
      "Pas de serveurs physiques dans le cluster",
      "L'utilisateur soumet des tâches sans gérer les serveurs sous-jacents, étendant FaaS au HPC",
      "Les serveurs s'arrêtent automatiquement après chaque tâche",
      "Aucune infrastructure n'est nécessaire",
    ],
    answer:
      "L'utilisateur soumet des tâches sans gérer les serveurs sous-jacents, étendant FaaS au HPC",
    explanation:
      "ArmoniK abstrait l'infrastructure, permettant de se concentrer sur les calculs.",
  },
  {
    question: "[ArmoniK] Quels langages sont supportés par le SDK ArmoniK ?",
    options: ["Uniquement Python", "Java et C++ seulement", "C#, Python, C++, Java, Rust", "Seulement Go"],
    answer: "C#, Python, C++, Java, Rust",
    explanation:
      "ArmoniK propose des SDK pour C#, Python, C++, Java et Rust via gRPC.",
  },
  {
    question: "[ArmoniK] Où ArmoniK est-il utilisé en production ?",
    options: [
      "Chez Google Cloud",
      "Chez Crédit Agricole CIB pour des calculs de risque quantitatif",
      "Chez AWS",
      "Chez Microsoft Azure",
    ],
    answer: "Chez Crédit Agricole CIB pour des calculs de risque quantitatif",
    explanation:
      "ArmoniK est utilisé en production chez Crédit Agricole CIB pour des calculs de risque (VaR, XVA).",
  },
  {
    question: "[ArmoniK] Que permet le pipelining dans ArmoniK ?",
    options: [
      "Le téléchargement des données d'une tâche future pendant l'exécution de la tâche courante",
      "L'exécution parallèle de toutes les tâches",
      "La suppression automatique des tâches terminées",
      "La compression des résultats de calcul",
    ],
    answer:
      "Le téléchargement des données d'une tâche future pendant l'exécution de la tâche courante",
    explanation:
      "Le pipelining optimise le débit en superposant le transfert de données et le calcul.",
  },
  {
    question: "[ArmoniK] Pourquoi ArmoniK est-il un cas à part dans ce document ?",
    options: [
      "Parce qu'il n'est pas open source",
      "Ce n'est pas un orchestrateur de conteneurs applicatifs, mais un orchestrateur de tâches de calcul sur K8s",
      "Parce qu'il est plus simple que Docker",
      "Parce qu'il n'utilise pas de conteneurs",
    ],
    answer:
      "Ce n'est pas un orchestrateur de conteneurs applicatifs, mais un orchestrateur de tâches de calcul sur K8s",
    explanation:
      "ArmoniK résout un problème différent (HPC) et s'exécute au-dessus de Kubernetes.",
  },
  {
    question: "[ArmoniK] Quelle est la capacité de traitement d'ArmoniK ?",
    options: [
      "10 à 50 tâches par seconde",
      "100 à 500 tâches par seconde",
      "De 250 à plus de 10 000 tâches par seconde",
      "Moins de 10 tâches par seconde",
    ],
    answer: "De 250 à plus de 10 000 tâches par seconde",
    explanation:
      "ArmoniK est conçu pour très haut débit, de 250 à plus de 10 000 tâches par seconde.",
  },
  {
    question: "[ArmoniK] Quels outils de débogage ArmoniK fournit-il ?",
    options: [
      "kubectl uniquement",
      "Dashboard de monitoring, CLI dédiée, outil de rejeu pour relancer localement une tâche",
      "docker logs",
      "helm et kustomize",
    ],
    answer:
      "Dashboard de monitoring, CLI dédiée, outil de rejeu pour relancer localement une tâche",
    explanation:
      "ArmoniK propose des outils spécialisés pour le monitoring et le débogage des tâches de calcul.",
  },
  ],
  expert: [
     {
    question: "[Expert] Dans un cluster Kubernetes en production, un etcd devient lent. Quelle est la première action à mener ?",
    options: [
      "Redémarrer immédiatement tous les nodes etcd",
      "Vérifier la défragmentation de la base de données etcd et la taille du store",
      "Augmenter la mémoire RAM de tous les nodes",
      "Basculer vers une base de données externe",
    ],
    answer: "Vérifier la défragmentation de la base de données etcd et la taille du store",
    explanation:
      "etcd peut devenir lent avec le temps à cause de la fragmentation. etcdctl defrag est la première action. Une taille excessive du store (>8Go) peut également dégrader les performances.",
  },
  {
    question: "[Expert] Comment implémenter une stratégie de rolling update sans downtime dans un cluster Swarm avec 10 réplicas ?",
    options: [
      "docker service update --image <image> --update-parallelism 10 --update-delay 0s <service>",
      "docker service update --image <image> --update-parallelism 1 --update-delay 30s --update-failure-action pause <service>",
      "docker service update --image <image> --force <service>",
      "docker service scale <service>=0 puis docker service update --image <image>",
    ],
    answer:
      "docker service update --image <image> --update-parallelism 1 --update-delay 30s --update-failure-action pause <service>",
    explanation:
      "Un rolling update safe utilise --update-parallelism=1 pour mettre à jour un réplica à la fois, --update-delay=30s pour laisser le temps aux health checks, et --update-failure-action=pause pour stopper automatiquement en cas d'échec.",
  },
  {
    question: "[Expert] Un pod Kubernetes reste en état 'Pending' sans événement explicite. Quelle est la cause la plus probable ?",
    options: [
      "L'image Docker n'existe pas",
      "Un resourceQuota est atteint au niveau du namespace sans message d'erreur clair",
      "Le kubelet est en panne",
      "Le pod a une liveness probe mal configurée",
    ],
    answer: "Un resourceQuota est atteint au niveau du namespace sans message d'erreur clair",
    explanation:
      "Les resourceQuota peuvent bloquer la planification sans événement visible. kubectl describe resourcequota --namespace <ns> révèle les limites atteintes.",
  },
  {
    question: "[Expert] Quelle est la procédure pour migrer un cluster k3s d'une base SQLite vers etcd pour la haute disponibilité ?",
    options: [
      "Installer etcd et restaurer une sauvegarde SQLite convertie",
      "Redémarrer k3s avec le flag --cluster-init et --datastore-endpoint pour migrer automatiquement",
      "Créer un nouveau cluster etcd et réinstaller toutes les ressources",
      "SQLite ne peut pas être migré vers etcd ; il faut recréer le cluster",
    ],
    answer:
      "Redémarrer k3s avec le flag --cluster-init et --datastore-endpoint pour migrer automatiquement",
    explanation:
      "k3s permet de migrer vers etcd via les flags de démarrage, avec une migration automatique des données du datastore existant vers etcd.",
  },
  {
    question: "[Expert] Dans ArmoniK, un DAG dynamique avec 10 000 tâches subit un goulot d'étranglement sur le planificateur. Comment optimiser ?",
    options: [
      "Augmenter le nombre de workers Kubernetes",
      "Réduire la taille des sous-tâches pour augmenter le parallélisme",
      "Augmenter le nombre de schedulers dans la configuration d'ArmoniK",
      "Remplacer gRPC par REST",
    ],
    answer: "Augmenter le nombre de schedulers dans la configuration d'ArmoniK",
    explanation:
      "ArmoniK permet de scaling horizontalement les planificateurs (schedulers) via la configuration, réduisant le goulot d'étranglement sur les DAG complexes.",
  },
  {
    question: "[Expert] Comment détecter une fuite de mémoire dans un conteneur Docker avant qu'il ne soit tué par OOM Killer ?",
    options: [
      "docker stats en temps réel uniquement",
      "Mettre en place cgroup memory.memsw.usage_in_bytes avec alerte Prometheus",
      "docker inspect pour voir la mémoire utilisée",
      "docker logs pour détecter les erreurs OutOfMemory",
    ],
    answer:
      "Mettre en place cgroup memory.memsw.usage_in_bytes avec alerte Prometheus",
    explanation:
      "La surveillance proactive via cgroups et Prometheus permet de détecter les tendances de consommation avant le OOM Killer. --memory-reservation peut aussi être configuré pour éviter l'OOM.",
  },
  {
    question: "[Expert] Un secret Kubernetes est exposé via etcd. Quelle action de sécurité est prioritaire ?",
    options: [
      "Supprimer le secret immédiatement",
      "Activer le chiffrement des secrets au repos dans etcd et effectuer une rotation des secrets",
      "Changer le RBAC du secret",
      "Ajouter un Network Policy pour le pod",
    ],
    answer:
      "Activer le chiffrement des secrets au repos dans etcd et effectuer une rotation des secrets",
    explanation:
      "Le chiffrement au repos dans etcd est la première ligne de défense. Après activation, il faut faire tourner les secrets pour s'assurer que toutes les versions sont chiffrées.",
  },
  {
    question: "[Expert] Un node Kubernetes est marqué 'NotReady' mais le kubelet tourne. Quelle est la cause probable ?",
    options: [
      "Le node a une panne disque",
      "La communication avec l'API server est interrompue ou le kubelet n'a plus de lease",
      "Le runtime containerd est arrêté",
      "Le node a trop de pods",
    ],
    answer:
      "La communication avec l'API server est interrompue ou le kubelet n'a plus de lease",
    explanation:
      "Si le kubelet tourne mais que le node est NotReady, vérifier le lease du kubelet via kubectl get lease -n kube-node-lease. Une absence de lease indique un problème de communication avec l'API server.",
  },
  {
    question: "[Expert] Comment réduire la taille d'une image Docker de 1.2Go à moins de 200Mo pour un projet Java ?",
    options: [
      "Utiliser une image base slim et un multi-stage build avec un layer dédié aux dépendances",
      "Compresser l'image avec gzip",
      "Supprimer les fichiers de log du conteneur",
      "Utiliser une image Ubuntu au lieu de Alpine",
    ],
    answer:
      "Utiliser une image base slim et un multi-stage build avec un layer dédié aux dépendances",
    explanation:
      "Le multi-stage build sépare la construction (JDK) de l'exécution (JRE). La couche des dépendances est mise en cache. Une image base slim réduit la surface d'attaque.",
  },
  {
    question: "[Expert] Un service Swarm est en état 'rejected' après un déploiement. Comment résoudre ?",
    options: [
      "docker service logs --raw <service>",
      "docker service ps --filter 'desired-state=shutdown' <service>",
      "docker service ps --filter 'desired-state=running' <service>",
      "docker service ps --no-trunc <service> pour voir les erreurs de planification",
    ],
    answer: "docker service ps --no-trunc <service> pour voir les erreurs de planification",
    explanation:
      "--no-trunc affiche les messages d'erreur complets, souvent liés à des ressources insuffisantes, des images introuvables ou des conflits de port.",
  },
  {
    question: "[Expert] Quel est l'impact de l'utilisation de --cap-drop ALL dans un conteneur sur les performances ?",
    options: [
      "Aucun impact sur les performances, améliore la sécurité",
      "Réduit les performances de 30%",
      "Augmente les performances de 10%",
      "Empêche complètement le démarrage du conteneur",
    ],
    answer: "Aucun impact sur les performances, améliore la sécurité",
    explanation:
      "--cap-drop ALL retire des privilèges système superflus. Cela n'a pas d'impact sur les performances, mais réduit significativement la surface d'attaque en production.",
  },
  {
    question: "[Expert] Comment orchestrer un déploiement blue/green sur Kubernetes avec deux déploiements distincts ?",
    options: [
      "Utiliser un seul Deployment avec label 'version' et basculer via un Service selector",
      "Deux Deployments (blue/green) avec des labels différents ; un Service pointe vers le deployment actif",
      "Utiliser un Ingress avec des règles de poids",
      "Faire un rolling update avec maxSurge=100%",
    ],
    answer:
      "Deux Deployments (blue/green) avec des labels différents ; un Service pointe vers le deployment actif",
    explanation:
      "Le blue/green utilise deux déploiements parallèles. Le Service est mis à jour avec le nouveau label selector, basculant instantanément le trafic du blue vers le green.",
  },
  {
    question: "[Expert] Un pipeline CI/CD construit des images Docker avec 15 layers, le build prend 8 minutes. Comment l'optimiser ?",
    options: [
      "Réduire à 1 layer avec --squash",
      "Ordonner les instructions du Dockerfile du plus stable (FROM, ENV, RUN) au plus changeant (COPY, ADD)",
      "Utiliser une image de base plus grande",
      "Build sur un node avec plus de CPU",
    ],
    answer:
      "Ordonner les instructions du Dockerfile du plus stable (FROM, ENV, RUN) au plus changeant (COPY, ADD)",
    explanation:
      "L'ordre des layers impacte le cache. Les layers stables en bas, les layers changeants en haut maximisent la réutilisation du cache, réduisant drastiquement les temps de build.",
  },
  {
    question: "[Expert] Dans ArmoniK, comment gérer une tâche qui consomme des données de 50Go sur un worker avec 20Go de RAM ?",
    options: [
      "Augmenter la RAM du worker",
      "Utiliser le streaming via gRPC pour charger les données en flux continu",
      "Utiliser le storage partagé (NFS) et monter en volume",
      "La tâche ne pourra jamais s'exécuter",
    ],
    answer: "Utiliser le streaming via gRPC pour charger les données en flux continu",
    explanation:
      "ArmoniK supporte le streaming de données via gRPC, permettant de traiter de gros volumes de données sans les charger entièrement en mémoire.",
  },
  {
    question: "[Expert] Comment implémenter une stratégie de failure recovery pour un cluster k3s dans un environnement IoT avec connectivité intermittente ?",
    options: [
      "Utiliser SQLite avec des snapshots réguliers et un stockage local",
      "Utiliser etcd en mode cluster malgré la connectivité intermittente",
      "Basculer sur Docker Swarm car il est plus adapté",
      "Désactiver les health checks",
    ],
    answer: "Utiliser SQLite avec des snapshots réguliers et un stockage local",
    explanation:
      "En IoT, les snapshots SQLite locaux avec --snapshotter native permettent une récupération rapide après une perte de connectivité. etcd nécessite un quorum stable, ce qui est incompatible avec l'intermittence.",
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
        ? <h3 className="success">🚀 Mission CIB Pricing Pre-Trade maîtrisée !</h3>
        : <p className="fail">📚 Révisez C#, dérivés actions et architecture CIB.</p>
      }
    </div>
  );
};

const CIBPricingPreTradeQCM = () => {
  const [level, setLevel] = useState("basic");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ moyen: 0, avance: 0, expert: 0 });
  const [timeLeft, setTimeLeft] = useState(25);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("");

  const handleNextQuestion = useCallback(() => {
    const qs = questions[level];
    if (currentQuestion + 1 < qs.length) {
      setCurrentQuestion(q => q + 1);
      setTimeLeft(13);
      setMessage("");
    } else {
      if (level === "moyen") { setLevel("avance"); }
      else if (level === "avance") { setLevel("expert"); }
      else { setShowResult(true); }
      setCurrentQuestion(0);
      setTimeLeft(13);
      setMessage("");
    }
  }, [level, currentQuestion]);;

  useEffect(() => {
    if (level !== "basic" && !showResult && !message) {
      if (timeLeft > 0) {
        const t = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
        return () => clearTimeout(t);
      } else handleNextQuestion();
    }
  }, [timeLeft, level, showResult, message, handleNextQuestion]);

  useEffect(() => {
    if (level === "basic" && !showResult) {
      const i = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev + 1 < basicSlides.length) return prev + 1;
          setLevel("moyen");
          setCurrentQuestion(0);
          setTimeLeft(13);
          return 0;
        });
      }, 13000);
      return () => clearInterval(i);
    }
  }, [level, showResult]);

  const handleAnswerClick = (option) => {
    if (message) return;
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
            CIB Pricing Pre-Trade 🔹 {level === "basic"
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

export default CIBPricingPreTradeQCM;
