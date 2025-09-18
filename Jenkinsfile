pipeline {
    agent {
        docker {
            image 'docker/compose:1.29.2'
            args "-v /var/run/docker.sock:/var/run/docker.sock"
        }
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building Docker images...'
                sh 'docker-compose build'
            }
        }
        stage('Deploy to Test') {
            steps {
                echo 'Deploying to Test environment...'
                sh 'docker-compose up -d --remove-orphans'
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
                sh 'docker-compose down'
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