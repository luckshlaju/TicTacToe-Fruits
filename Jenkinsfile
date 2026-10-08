pipeline {
    agent any

    environment {
        IMAGE_NAME = "ghcr.io/luckshlaju/tictactoe-fruits"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Push to GHCR') {
            steps {
                bat 'docker push %IMAGE_NAME%:latest'
            }
        }
    }
}