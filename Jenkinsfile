pipeline {
    agent {
        docker {
            image 'docker:dind'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                git branch: 'main', url: 'https://github.com/votre-utilisateur/mon-projet-devops.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images...'
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy to Test') {
            steps {
                echo 'Deploying to Test environment...'
                script {
                    sh 'docker-compose up -d --remove-orphans'
                }
            }
        }

        stage('Run Automated Tests') {
            steps {
                echo 'Running automated tests...'
                script {
                    sh 'curl -f http://localhost:3000 || exit 1'
                }
            }
        }

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
            echo 'All stages passed! Starting production deployment.'
            // Le déploiement est une simple étape, pas une stage.
            script {
                echo 'Deploying to production...'
                // ssh-agent (credentials('votre-cle-ssh')) {
                //     sh 'ssh user@prod-server "cd /path/to/prod/project && docker-compose up -d --build"'
                // }
            }
        }
        // Exécuté si la construction échoue
        failure {
            echo 'Build failed. See logs for details.'
        }
    }
}