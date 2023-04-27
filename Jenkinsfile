pipeline {

    agent { label 'nodejs' }

    stages {

        stage('Build') {
            steps {
                sh 'npm ci --legacy-peer-deps --force && npm run ng build'
            }
        }

        stage('Deploy') {
            steps {
                withAWS(region:'us-east-2', credentials: 'AWS-S3-frontend-access-keys') {
                    s3Upload(bucket:'transliterator-web-frontend-develop', workingDir:'dist/transliterator-web-frontend', includePathPattern:'**/*');
                }
            }
        }

    }

}