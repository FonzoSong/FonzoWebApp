pipeline {
    agent any

    stages {
        // 安装依赖
        stage('Install Dependencies') {
            steps {
                sh 'node -v' // 可选：输出Node.js版本
                sh 'ls -l'
                sh 'pwd'
                sh 'npm install -g --no-bin-link'
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
                    // 使用构建号作为镜像标签，确保唯一性
                    def dockerImage = "note-webapp:${env.BUILD_NUMBER}"
                    // 使用docker.build DSL构建镜像
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
                    def imageTag = "note-webapp:${env.BUILD_NUMBER}"
                    def fullImageTag = "${registry}/${namespace}/${imageTag}"

                    // 使用docker.withRegistry简化登录和推送
                    docker.withRegistry("https://${registry}", 'aliyun-credentials-id') {
                        // 推送镜像（自动处理登录和标签）
                        docker.image(imageTag).push()
                    }
                }
            }
        }
    }

    post {
        always {
            // 清理临时镜像（保留当前构建的镜像）
            sh 'docker image prune -f'
        }
    }
}