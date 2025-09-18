pipeline {
    // Agent Docker pour l'exécution du pipeline
    agent {
        docker {
            image 'docker:dind' // Utilise Docker-in-Docker pour exécuter des commandes Docker
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Permet à Jenkins de communiquer avec le daemon Docker de l'hôte
        }
    }

    // Définition des options du pipeline
    options {
        // Garde un historique des 10 dernières constructions
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // Définition des étapes du pipeline
    stages {
        // Étape 1: Récupération du code
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                // Récupère le code depuis le repository Git
                git branch: 'main', url: 'https://github.com/kevinneves/projet-devops.git'
            }
        }

        // Étape 2: Construction de l'application
        stage('Build') {
            steps {
                echo 'Building Docker images...'
                // Exécute la construction Docker
                script {
                    sh 'docker-compose build'
                }
            }
        }

        // Étape 3: Déploiement dans l'environnement de test
        stage('Deploy to Test') {
            steps {
                echo 'Deploying to Test environment...'
                // Lance les conteneurs en arrière-plan pour le test
                script {
                    sh 'docker-compose up -d --remove-orphans'
                }
            }
        }

        // Étape 4: Exécution des tests automatisés
        stage('Run Automated Tests') {
            steps {
                echo 'Running automated tests...'
                // C'est ici que vous lancerez vos scripts de test.
                // Par exemple, si vous utilisez un autre conteneur pour les tests E2E :
                script {
                    // Exemple de commande pour un conteneur de tests (Cypress, Selenium, etc.)
                    // sh 'docker run --network host mon-image-de-tests'
                    // Pour le moment, une simple vérification de la disponibilité du service
                    sh 'curl -f http://localhost:3000 || exit 1'
                }
            }
        }

        // Étape 5: Nettoyage de l'environnement de test
        stage('Tear Down Test Environment') {
            steps {
                echo 'Tearing down Test environment...'
                script {
                    sh 'docker-compose down'
                }
            }
        }
    }

    // Gestion des post-build
    post {
        // Exécuté si la construction est réussie
        success {
            echo 'All stages passed! Preparing for production deployment...'
            // Étape 6: Déploiement en production
            stage('Deploy to Production') {
                steps {
                    echo 'Deploying to production...'
                    script {
                        // Placez ici votre script de déploiement en production
                        // Exemple: se connecter en SSH au serveur de production et lancer docker-compose
                        // ssh-agent (credentials('votre-cle-ssh')) {
                        //     sh 'ssh user@prod-server "cd /path/to/prod/project && docker-compose up -d --build"'
                        // }
                    }
                }
            }
        }
        // Exécuté si la construction échoue
        failure {
            echo 'Build failed. See logs for details.'
        }
    }
}