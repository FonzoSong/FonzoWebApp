pipeline {
    agent any
    stages {
        // 安装依赖
        stage('Install Dependencies') {
            steps {
                sh 'node -v'
                sh 'npm config set registry https://registry.npmmirror.com'
                // 添加 sudo 以解决可能的权限问题（如写入 node_modules）
                sh 'sudo npm install'
            }
        }
        // 构建文档
        stage('Build Docs') {
            steps {
                // 添加 sudo 以确保构建命令有足够权限
                sh 'sudo npm run docs:build'
            }
        }
        // 构建 Docker 镜像
        stage('Build Docker Image') {
            steps {
                script {
                    def dockerImage = 'note-webapp:latest'
                    // 添加 sudo 以确保 Docker 命令有权限
                    sh "sudo docker build -t ${dockerImage} -f Dockerfile ."
                }
            }
        }
        // 推送 Docker 镜像到阿里云容器镜像仓库
        stage('Push Docker Image') {
            steps {
                script {
                    def registry = 'crpi-bel3qt8z5v9ykzbp.cn-beijing.personal.cr.aliyuncs.com'
                    def namespace = 'fonzo_dev'
                    def imageTag = 'note-webapp:latest'

                    // 使用凭证登录阿里云（无需 sudo，因为 docker login 是用户权限操作）
                    withCredentials([usernamePassword(
                        credentialsId: 'aliyun-credentials-id',
                        usernameVariable: 'ALIYUN_USER',
                        passwordVariable: 'ALIYUN_PASS'
                    )]) {
                        sh "docker login -u ${env.ALIYUN_USER} -p ${env.ALIYUN_PASS} ${registry}"
                    }

                    def fullImageTag = "${registry}/${namespace}/${imageTag}"
                    // 添加 sudo 以确保 Docker 命令有权限
                    sh "sudo docker tag ${imageTag} ${fullImageTag}"
                    sh "sudo docker push ${fullImageImageTag}"
                }
            }
        }
    }
    post {
        always {
            // 添加 sudo 以确保清理权限
            sh 'sudo docker image prune -f'
        }
    }
}