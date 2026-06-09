pipeline {
    agent any

    environment {
        CONT = "todoui"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "todoui:${env.BUILD_NUMBER}"
                    env.IMAGE = imageTag
                    if (isUnix()) {
                        sh "docker build -t ${imageTag} todui"
                    } else {
                        bat "docker build -t ${imageTag} todui"
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    try {
                        if (isUnix()) {
                            sh "docker rm -f ${env.CONT}"
                        } else {
                            bat "docker rm -f ${env.CONT}"
                        }
                    } catch (err) {
                        echo "No existing container to remove: ${err}"
                    }

                    if (isUnix()) {
                        sh "docker run -d --name ${env.CONT} -p 8081:80 ${env.IMAGE}"
                    } else {
                        bat "docker run -d --name ${env.CONT} -p 8081:80 ${env.IMAGE}"
                    }
                }
            }
        }
    }
}
