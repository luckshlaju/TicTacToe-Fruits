
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
                              --parameters "commands=['sudo docker pull ghcr.io/luckshlaju/tictactoe-fruits:latest && sudo docker rm -f tictactoe && sudo docker run -d --name tictactoe -p 80:80 ghcr.io/luckshlaju/tictactoe-fruits:latest']" ^
                              --query "Command.CommandId" ^
                              --output text
                        ''',
                        returnStdout: true
                    ).trim()

                    echo "SSM Command ID: ${commandId}"

                    bat """
                        @echo off
                        set CMD_ID=${commandId}
                        set STATUS=InProgress
                        for /L %%i in (1,1,30) do (
                            for /F %%s in ('aws ssm get-command-invocation --region %AWS_REGION% --command-id %CMD_ID% --instance-id %EC2_INSTANCE% --query Status --output text 2^>nul') do set STATUS=%%s
                            if "!STATUS!"=="Success" goto deployed
                            if "!STATUS!"=="Failed" goto failed
                            if "!STATUS!"=="TimedOut" goto failed
                            if "!STATUS!"=="Cancelled" goto failed
                            timeout /t 5 /nobreak >nul
                        )
                        echo Deployment status: %STATUS%
                        exit /b 1
                        :deployed
                        echo Deployment succeeded.
                        exit /b 0
                        :failed
                        echo Deployment failed with status %STATUS%.
                        aws ssm get-command-invocation --region %AWS_REGION% --command-id %CMD_ID% --instance-id %EC2_INSTANCE% --output text
                        exit /b 1
                    """
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
