pipeline {
    agent any
    stages {
        // 安装依赖
        stage('Install Dependencies') {
            steps {
                sh 'npm install -D vitepress'
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
                    
                    def dockerFileContent = """
                    FROM nginx:latest
                    COPY .vitepress/dist /usr/share/nginx/html
                    RUN chown -R nginx:nginx /usr/share/nginx/html
                    EXPOSE 80
                    """
                    writeFile file: 'Dockerfile', text: dockerFileContent
                    // 定义镜像名称和标签（根据需要自定义）
                    def dockerImage = 'note-webapp:latest'
                    
                    // 构建镜像
                    sh "docker build -t ${dockerImage} -f Dockerfile ."
                }
            }
        }

        // 推送镜像到阿里云容器镜像仓库
        stage('Push Docker Image') {
            steps {
                script {
                    // 定义阿里云镜像仓库地址和命名空间（根据实际配置修改）
                    def registry = 'crpi-bel3qt8z5v9ykzbp.cn-beijing.personal.cr.aliyuncs.com'
                    def namespace = 'fonzo_dev' // 替换为您的命名空间
                    def imageTag = 'note-webapp:latest'

                    // 登录阿里云容器镜像仓库（使用凭证）
                    withCredentials([usernamePassword(
                        credentialsId: 'aliyun-credentials-id', // 替换为Jenkins中配置的凭证ID
                        usernameVariable: 'ALIYUN_USER',
                        passwordVariable: 'ALIYUN_PASS'
                    )]) {
                        sh "docker login -u ${env.ALIYUN_USER} -p ${env.ALIYUN_PASS} ${registry}"
                    }

                    // 为镜像打tag
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
            // 清理临时文件（可选）
            sh 'docker image prune -f'
        }
    }
}