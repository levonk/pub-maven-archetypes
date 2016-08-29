import hudson.model.*
import hudson.util.*

node {
    def workSpace = pwd()
    echo "${workSpace}"
    println env

    deleteDir()
    
    stage 'Removing GPG Keys from Jenkins'
    sh '''rm -rf ''' + workSpace + '''/.gnupg'''

    sh """
        echo "***** FIX THIS!!! *****"
        echo "-Should not have to use a folder with wangj117 as the name."
        echo "***** FIX THIS!!! *****"
       """

    stage 'Get GPG Keys from S3'
    sh '''test -d ''' + workSpace + '''/.gnupg || {
        aws s3 cp s3://studios-se-keys/bi/jenkins/mvn.licenses.gnupgd.tgz /tmp/mvn.licenses.gnupgd.tgz 
        tmpdir=/tmp/gnupg.`date +%s`
        mkdir $tmpdir
        pushd $tmpdir
        tar -xzf /tmp/mvn.licenses.gnupgd.tgz Users/wangj117/.gnupg/
        mv Users/wangj117/.gnupg ''' + workSpace + '''/.gnupg
        cd ''' + workSpace + '''/.gnupg
        ls
        pwd
        popd
    }'''

    sshagent(['fe4a50a5-925d-4769-9a7b-dab6e610f202']) {
        //slackSend color: 'good', message: 'Build started: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)'
        stage 'Checkout

        git branch: 'develop', url: 'https://github.com/DGHLJ/pub-maven-archetypes.git'

        sh('git rev-parse HEAD > GIT_COMMIT')
        def gitCommit=readFile('GIT_COMMIT')
        def shortCommit=gitCommit.substring(0, 6)

        wrap([$class: 'ConfigFileBuildWrapper', managedFiles: [[fileId: '61fc9411-08ac-482d-bc0d-3765d885d596', replaceTokens: false, targetLocation: 'settings.xml', variable: '']]]) {
            def mvnHome = tool name: 'first-install-from-apache-3.3.9', type: 'hudson.tasks.Maven$MavenInstallation'
            
            stage 'Get AWS Credentials'
            sh 'export AWS_ACCESS_KEY_ID=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .AccessKeyId  )'
            sh 'export AWS_SECRET_ACCESS_KEY=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .SecretAccessKey  )'
    
            sh 'echo $AWS_ACCESS_KEY_ID'
            sh 'echo $AWS_SECRET_ACCESS_KEY'
            
            stage 'Install Extensions'
            sh """
                ${mvnHome}/bin/mvn -s settings.xml com.github.sviperll:coreext-maven-plugin:install || true
               """

            stage 'Start Release'
            sh "${mvnHome}/bin/mvn -s settings.xml build-helper:parse-version jgitflow:release-start -DreleaseVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.incrementalVersion}.${currentBuild.number}-$shortCommit -DdevelopmentVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.nextIncrementalVersion}-SNAPSHOT -e"

            stage 'Finish Release'
            sh """
                ${mvnHome}/bin/mvn -s settings.xml jgitflow:release-finish -Denforcer.skip=true
               """

            sh """
                echo "***** FIX THIS!!! *****"
                echo "-Should checkout release/X.X.X.X-XXXXXX tag."
                echo "***** FIX THIS!!! *****"
               """

            stage 'Switch to Master Branch'
            sh """
                git checkout -f master ;
                git pull
               """
            
            stage 'Clean'
            sh "${mvnHome}/bin/mvn -s settings.xml -Dmaven.test.failure.ignore -Dmaven.multiModuleProjectDirectory=. -Dgpg.passphrase=8185842015 -Dgpg.homedir=${workSpace}/.gnupg clean"

            stage 'Install'
            sh "${mvnHome}/bin/mvn -s settings.xml -Dmaven.test.failure.ignore -Dmaven.multiModuleProjectDirectory=. -Dgpg.passphrase=8185842015 -Dgpg.homedir=${workSpace}/.gnupg install"


            stage 'Publish Unit Test Reports'
            step([$class: 'JUnitResultArchiver', testResults: '**/TEST-*.xml'])

            stage 'Publish Code Quality Reports'
            step([$class: 'FindBugsPublisher', canComputeNew: false, defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', pattern: '', unHealthy: ''])
            step([$class: 'CheckStylePublisher', canComputeNew: false, defaultEncoding: '', healthy: '', pattern: '', unHealthy: ''])
            step([$class: 'PmdPublisher', canComputeNew: false, defaultEncoding: '', healthy: '', pattern: '', unHealthy: ''])
            step([$class: 'AnalysisPublisher', canComputeNew: false, defaultEncoding: '', healthy: '', unHealthy: ''])

            stage 'Archive Artifacts'
            step([$class: 'ArtifactArchiver', artifacts: '**/*.*', excludes: null])

            stage 'Deploy to Nexus'
            def userInput = input 'Release staged repository?'
            sh "echo $userInput"

            sh """
                cd parent-poms ;
                pwd ;
                ${mvnHome}/bin/mvn -s ../settings.xml -Dmaven.test.failure.ignore -Dgpg.passphrase=8185842015 -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;
                cd ../codequality ;
                pwd ;
                ${mvnHome}/bin/mvn -s ../settings.xml -Dmaven.test.failure.ignore -Dgpg.passphrase=8185842015 -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;
                cd ../licenses ;
                pwd ;
                ${mvnHome}/bin/mvn -s ../settings.xml -Dmaven.test.failure.ignore -Dgpg.passphrase=8185842015 -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;
               """

            stage 'Release Staged Repository'
            sh """
                OUTPUT=\$( ${mvnHome}/bin/mvn -s settings.xml nexus-staging:rc-list -DserverId=oss.sonatype.org -DnexusUrl=https://oss.sonatype.org/ | grep comlevonk | cut -d\\  -f2 ) ;
                echo \$OUTPUT ;
                ${mvnHome}/bin/mvn -s settings.xml nexus-staging:close nexus-staging:release -DstagingRepositoryId=\$OUTPUT -DserverId=oss.sonatype.org -DnexusUrl=https://oss.sonatype.org/ -e
               """

        }

        //slackSend color: 'good', message: 'Build finished: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)'

    }
}