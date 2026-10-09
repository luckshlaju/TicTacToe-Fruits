
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

        stage('Login to GHCR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'lucksgit',
                    usernameVariable: 'GHCR_USER',
                    passwordVariable: 'GHCR_TOKEN'
                )]) {
                    bat '''
                        @echo off
                        echo %GHCR_TOKEN% | docker login ghcr.io -u %GHCR_USER% --password-stdin
                    '''
                }
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

        stage('Test SSM Connection') {
            steps {
                bat '''
                    aws ssm send-command ^
                      --region ap-south-1 ^
                      --instance-ids i-08fcef8e218b45d0e ^
                      --document-name AWS-RunShellScript ^
                      --parameters "commands=['echo SSM_DEPLOYMENT_READY']" ^
                      --query "Command.CommandId" ^
                      --output text
                '''
            }
        }
    }
}
