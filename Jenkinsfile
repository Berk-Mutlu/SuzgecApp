// ===================================
// SuzgecApp - Jenkins CI/CD Pipeline
// Otomatik derleme ve dağıtım
// ===================================

pipeline {
    agent any

    // Ortam değişkenleri
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        NODE_ENV = 'production'
    }

    // Zaman aşımı ve yapılandırma seçenekleri
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        // ----- Aşama 1: Kaynak Kodu Çekme -----
        stage('Checkout') {
            steps {
                echo '📥 Kaynak kodu çekiliyor...'
                checkout scm
            }
        }

        // ----- Aşama 2: Backend Bağımlılıkları -----
        stage('Install Backend Dependencies') {
            steps {
                echo '📦 Backend bağımlılıkları yükleniyor...'
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                        } else {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        // ----- Aşama 3: Frontend Bağımlılıkları -----
        stage('Install Frontend Dependencies') {
            steps {
                echo '📦 Frontend bağımlılıkları yükleniyor...'
                dir('frontend/suzgec-app') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                        } else {
                            bat 'npm ci'
                        }
                    }
                }
            }
        }

        // ----- Aşama 4: Frontend Derleme -----
        stage('Build Frontend') {
            steps {
                echo '🔨 Frontend derleniyor...'
                dir('frontend/suzgec-app') {
                    script {
                        if (isUnix()) {
                            sh 'npm install typescript --save-dev && npm run build'
                        } else {
                            bat 'npm install typescript --save-dev && npm run build'
                        }
                    }
                }
            }
        }

        // ----- Aşama 5: Docker İmajları Derleme -----
        stage('Docker Build') {
            steps {
                echo '🐳 Docker imajları derleniyor...'
                script {
                    if (isUnix()) {
                        sh 'docker compose build --no-cache'
                    } else {
                        bat 'docker compose build --no-cache'
                    }
                }
            }
        }

        // ----- Aşama 6: Docker ile Dağıtım -----
        stage('Docker Deploy') {
            steps {
                echo '🚀 Servisler başlatılıyor...'
                script {
                    if (isUnix()) {
                        sh 'docker compose up -d'
                    } else {
                        bat 'docker compose up -d'
                    }
                }
            }
        }

        // ----- Aşama 7: Sağlık Kontrolü -----
        stage('Health Check') {
            steps {
                echo '🏥 Sağlık kontrolü yapılıyor...'
                sleep(time: 10, unit: 'SECONDS')
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Backend sağlık kontrolü..."
                            curl -f http://localhost:5000/ || echo "⚠️ Backend yanıt vermiyor"

                            echo "Frontend sağlık kontrolü..."
                            curl -f http://localhost:3000/ || echo "⚠️ Frontend yanıt vermiyor"
                        '''
                    } else {
                        bat '''
                            echo Backend saglik kontrolu...
                            curl -f http://localhost:5000/ || echo "Backend yanit vermiyor"

                            echo Frontend saglik kontrolu...
                            curl -f http://localhost:3000/ || echo "Frontend yanit vermiyor"
                        '''
                    }
                }
            }
        }
    }

    // ----- Pipeline Sonuç İşlemleri -----
    post {
        success {
            echo '✅ Pipeline başarıyla tamamlandı!'
        }
        failure {
            echo '❌ Pipeline başarısız oldu! Temizlik yapılıyor...'
            script {
                if (isUnix()) {
                    sh 'docker compose down --remove-orphans || true'
                } else {
                    bat 'docker compose down --remove-orphans || exit 0'
                }
            }
        }
        always {
            echo '📊 Pipeline sona erdi.'
            cleanWs(cleanWhenNotBuilt: false)
        }
    }
}
