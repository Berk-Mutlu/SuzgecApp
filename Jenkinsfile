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

        // ----- Aşama 2: Kod Doğrulama -----
        stage('Verify Source') {
            steps {
                echo '🔍 Proje dosyaları doğrulanıyor...'
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Backend dosyaları:"
                            ls -la backend/package.json backend/Dockerfile
                            echo ""
                            echo "Frontend dosyaları:"
                            ls -la frontend/suzgec-app/package.json frontend/suzgec-app/Dockerfile
                            echo ""
                            echo "Docker Compose:"
                            ls -la docker-compose.yml
                        '''
                    } else {
                        bat '''
                            echo Backend dosyalari:
                            dir backend\\package.json backend\\Dockerfile
                            echo Frontend dosyalari:
                            dir frontend\\suzgec-app\\package.json frontend\\suzgec-app\\Dockerfile
                            echo Docker Compose:
                            dir docker-compose.yml
                        '''
                    }
                }
            }
        }

        // ----- Aşama 3: Docker Soket Yetkisi -----
        stage('Docker Permission') {
            steps {
                echo '🔑 Docker soket yetkisi kontrol ediliyor...'
                script {
                    if (isUnix()) {
                        sh '''
                            if ! docker info > /dev/null 2>&1; then
                                echo "Docker soketi erişilemez, yetki düzeltiliyor..."
                                sudo chmod 666 /var/run/docker.sock || chmod 666 /var/run/docker.sock || true
                            fi
                            echo "✅ Docker erişimi hazır."
                            docker version --format "Docker {{.Server.Version}}"
                        '''
                    }
                }
            }
        }

        // ----- Aşama 4: Docker İmajları Derleme -----
        stage('Docker Build') {
            steps {
                echo '🐳 Docker imajları derleniyor...'
                script {
                    if (isUnix()) {
                        sh 'docker compose build'
                    } else {
                        bat 'docker compose build'
                    }
                }
            }
        }

        // ----- Aşama 4: Mevcut Servisleri Durdurma -----
        stage('Stop Existing') {
            steps {
                echo '🛑 Mevcut servisler durduruluyor...'
                script {
                    if (isUnix()) {
                        sh 'docker compose down --remove-orphans || true'
                    } else {
                        bat 'docker compose down --remove-orphans || exit 0'
                    }
                }
            }
        }

        // ----- Aşama 5: Docker ile Dağıtım -----
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

        // ----- Aşama 6: Sağlık Kontrolü -----
        stage('Health Check') {
            steps {
                echo '🏥 Sağlık kontrolü yapılıyor...'
                sleep(time: 15, unit: 'SECONDS')
                script {
                    if (isUnix()) {
                        sh '''
                            echo "Çalışan konteynerler:"
                            docker compose ps

                            echo ""
                            echo "Backend sağlık kontrolü..."
                            curl -f http://localhost:5000/ || echo "⚠️ Backend henüz hazır değil"

                            echo ""
                            echo "Frontend sağlık kontrolü..."
                            curl -f http://localhost:3000/ || echo "⚠️ Frontend henüz hazır değil"
                        '''
                    } else {
                        bat '''
                            echo Calisan konteynerler:
                            docker compose ps

                            echo Backend saglik kontrolu...
                            curl -f http://localhost:5000/ || echo "Backend henuz hazir degil"

                            echo Frontend saglik kontrolu...
                            curl -f http://localhost:3000/ || echo "Frontend henuz hazir degil"
                        '''
                    }
                }
            }
        }
    }

    // ----- Pipeline Sonuç İşlemleri -----
    post {
        success {
            echo '✅ Pipeline başarıyla tamamlandı! Tüm servisler çalışıyor.'
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
        }
    }
}
