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
                    // Determine build context by checking common locations for a Dockerfile.
                    // This handles runs where Jenkins workspace is the repo root or the `todui` subfolder.
                    def buildCtx = '.'
                    if (fileExists('Dockerfile')) {
                        buildCtx = '.'
                    } else if (fileExists('todui/Dockerfile')) {
                        buildCtx = 'todui'
                    } else if (fileExists('./todui/Dockerfile')) {
                        buildCtx = 'todui'
                    } else {
                        // last-resort: if `todui` directory exists, use it
                        if (fileExists('todui')) {
                            buildCtx = 'todui'
                        }
                    }
                    if (isUnix()) {
                        sh "docker build -t ${imageTag} ${buildCtx}"
                    } else {
                        bat "docker build -t ${imageTag} ${buildCtx}"
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
