pipeline {
    agent any
    stages {
        // 安装依赖
        stage('Install Dependencies') {
            steps {
                sh 'node -v'
                sh 'npm config set registry https://registry.npmmirror.com'
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
                    // 定义镜像名称和标签（可根据需求修改）
                    def dockerImage = 'note-webapp:latest'
                    // 构建镜像
                    sh "docker build -t ${dockerImage} -f Dockerfile ."
                }
            }
        }
        // 推送 Docker 镜像到阿里云容器镜像仓库
        stage('Push Docker Image') {
            steps {
                script {
                    // 定义阿里云镜像仓库地址、命名空间和镜像标签
                    def registry = 'crpi-bel3qt8z5v9ykzbp.cn-beijing.personal.cr.aliyuncs.com'
                    def namespace = 'fonzo_dev'
                    def imageTag = 'note-webapp:latest'
                    // 使用凭证登录阿里云
                    withCredentials([usernamePassword(
                        credentialsId: 'aliyun-credentials-id', // 替换为你在 Jenkins 中配置的凭证 ID
                        usernameVariable: 'ALIYUN_USER',
                        passwordVariable: 'ALIYUN_PASS'
                    )]) {
                        sh "docker login -u ${env.ALIYUN_USER} -p ${env.ALIYUN_PASS} ${registry}"
                    }
                    // 为镜像打 tag
                    def fullImageTag = "${registry}/${namespace}/${imageTag}"
                    sh "docker tag ${imageTag} ${fullImageTag}"
                    // 推送镜像
                    sh "docker push ${fullImageTag}"
                }
            }
        }
    }
    post {
        always {
            // 清理临时 Docker 镜像
            sh 'docker image prune -f'
        }
    }
}
