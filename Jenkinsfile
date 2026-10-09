pipeline {
    agent any

    environment {
        IMAGE_NAME = "ghcr.io/luckshlaju/tictactoe-fruits"
        AWS_REGION = "ap-south-1"
        EC2_INSTANCE = "i-08fcef8e218b45d0e"
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

        stage('Deploy to EC2 via SSM') {
            steps {
                script {
                    def commandId = bat(
                        script: '''
                            @echo off
                            aws ssm send-command ^
                              --region %AWS_REGION% ^
                              --instance-ids %EC2_INSTANCE% ^
                              --document-name AWS-RunShellScript ^
                              --parameters "commands=['sudo docker pull ghcr.io/luckshlaju/tictactoe-fruits:latest && sudo docker rm -f tictactoe && sudo docker run -d --restart unless-stopped --name tictactoe -p 80:80 ghcr.io/luckshlaju/tictactoe-fruits:latest']" ^
                              --query "Command.CommandId" ^
                              --output text
                        ''',
                        returnStdout: true
                    ).trim().readLines().last()

                    echo "SSM Command ID: ${commandId}"

                    def status = 'Pending'

                    for (int i = 0; i < 30; i++) {
                        sleep(time: 5, unit: 'SECONDS')

                        status = bat(
                            script: """
                                @echo off
                                aws ssm get-command-invocation ^
                                  --region %AWS_REGION% ^
                                  --command-id ${commandId} ^
                                  --instance-id %EC2_INSTANCE% ^
                                  --query Status ^
                                  --output text 2>nul
                            """,
                            returnStdout: true
                        ).trim().readLines().last()

                        echo "Deployment status: ${status}"

                        if (status in ['Success', 'Failed', 'TimedOut', 'Cancelled']) {
                            break
                        }
                    }

                    if (status != 'Success') {
                        error("EC2 deployment did not succeed. Final SSM status: ${status}")
                    }

                    echo 'EC2 deployment completed successfully!'
                }
            }
        }
    }

    post {
        always {
            bat 'docker logout ghcr.io'
        }
    }
}