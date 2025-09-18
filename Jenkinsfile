pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                git branch: 'main', url: 'https://github.com/kevinneves/projet-devops.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images...'
                sh '/usr/bin/docker-compose build'
            }
        }

        stage('Deploy to Test') {
            steps {
                echo 'Deploying to Test environment...'
                sh '/usr/bin/docker-compose up -d --remove-orphans'
            }
        }

        stage('Run Automated Tests') {
            steps {
                echo 'Running automated tests...'
                sh 'curl -f http://localhost:3000 || exit 1'
            }
        }

        stage('Tear Down Test Environment') {
            steps {
                echo 'Tearing down Test environment...'
                sh '/usr/bin/docker-compose down'
            }
        }
    }

    post {
        success {
            echo 'All stages passed! Starting production deployment.'
            script {
                echo 'Deploying to production...'
                // ssh-agent (credentials('votre-cle-ssh')) {
                //     sh 'ssh user@prod-server "cd /path/to/prod/project && docker-compose up -d --build"'
                // }
            }
        }
        failure {
            echo 'Build failed. See logs for details.'
        }
    }
}