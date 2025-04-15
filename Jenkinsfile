pipeline {
    agent any

    stages {
        // 安装依赖
        stage('Install Dependencies') {
            steps {
                sh 'node -v'
                sh 'ls -l'
                sh 'pwd'
                sh 'npm install'
            }
        }

        // 构建文档
        stage('Build Docs') {
            steps {
                sh 'npm run docs:build'
            }
        }

        // 构建 Docker 镜像
        stage('Build Docker Image') {
            steps {
                script {
                    def dockerImage = "note-webapp:${env.BUILD_NUMBER}"
                    docker.build(dockerImage, '-f Dockerfile .')
                }
            }
        }

        // 推送 Docker 镜像到阿里云容器镜像仓库
        stage('Push Docker Image') {
            steps {
                script {
                    def registry = 'crpi-bel3qt8z5v9ykzbp.cn-beijing.personal.cr.aliyuncs.com'
                    def namespace = 'fonzo_dev'
                    def imageTag = "latest"
                    def fullImageTag = "${registry}/${namespace}/note-webapp:${imageTag}"

                    withCredentials([usernamePassword(credentialsId: 'aliyun-credentials-id', usernameVariable: 'ALIYUN_DOCKER_USERNAME', passwordVariable: 'ALIYUN_DOCKER_PASSWORD')]) {
                        sh """
                        echo \$ALIYUN_DOCKER_PASSWORD | docker login --username=\$ALIYUN_DOCKER_USERNAME --password-stdin ${registry}
                        """
                        sh "docker tag note-webapp:${env.BUILD_NUMBER} ${fullImageTag}"
                        sh "docker push ${fullImageTag}"
                    }
                }
            }
        }

        // 部署到 Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f deployment.yaml'
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
