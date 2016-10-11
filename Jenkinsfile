import hudson.model.*
import hudson.util.*

node {
	def mvnHome = tool name: 'first-install-from-apache-3.3.9', type: 'hudson.tasks.Maven$MavenInstallation'
	def workSpace = pwd()
	// def mvnCmd = "${mvnHome}/bin/mvn -s settings.xml --show-version --fail-at-end --errors --batch-mode --strict-checksums -T 1.5C "
	def mvnCmd = "${mvnHome}/bin/mvn --show-version --fail-at-end --errors --batch-mode --strict-checksums -s ${workSpace}/settings.xml "

    println "${workSpace}"
    println env

    // Figure out a way to delete the workspace completely.
    // deleteDir() or bash script

    stage 'Removing GPG Keys from Jenkins'
    sh '''rm -rf ''' + workSpace + '''/.gnupg'''

	println "[Jenkinsfile] "***** FIX THIS!!! *****"
	println "[Jenkinsfile] -Should not have to use a folder with wangj117 as the name."
	println "[Jenkinsfile] ***** FIX THIS!!! *****"

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

    sshagent(['wdsds-at-github']) {

        wrap([$class: 'ConfigFileBuildWrapper', managedFiles: [[fileId: '61fc9411-08ac-482d-bc0d-3765d885d596', replaceTokens: false, targetLocation: 'settings.xml', variable: '']]]) {

            withCredentials([[$class: 'StringBinding', credentialsId: 'gpg.password', variable: 'GPG_PASSWORD']]) {

                sh 'ssh-add -l'

                stage 'Checkout'
                git branch: 'develop', credentialsId: 'wdsds-at-github', url: 'ssh://git@github.com/DGHLJ/pub-maven-archetypes.git'

                sh('git rev-parse HEAD > GIT_COMMIT')
                def gitCommit=readFile('GIT_COMMIT')
                def shortCommit=gitCommit.substring(0, 7)


                    println "[Jenkinsfile] ***** FIX THIS!!! *****"
                    println "[Jenkinsfile] -Re-address this in future"

                stage 'Get AWS Credentials'
                sh 'export AWS_ACCESS_KEY_ID=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .AccessKeyId  )'
                sh 'export AWS_SECRET_ACCESS_KEY=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .SecretAccessKey  )'

                println "[Jenkinsfile] " + env['AWS_ACCESS_KEY_ID']
                println "[Jenkinsfile] " + env['AWS_SECRET_ACCESS_KEY']

                stage 'Install Extensions'
                sh """
                    for i in \$(ls -d */);
                    do
                        if [ -f \${i}pom.xml ]; then
                            echo "[Jenkinsfile] cd \${i}";
                            cd \${i}
                            if [ ! -d ".mvn" ]; then
                                ${mvnCmd} com.github.sviperll:coreext-maven-plugin:install || true
                            fi
                            cd ..
                        fi
                    done

                    ${mvnCmd} -Dmaven.multiModuleProjectDirectory=. com.github.sviperll:coreext-maven-plugin:install || true
                   """

                stage 'Start Release'
sh """
    ${mvnCmd}  jgitflow:release-finish -Denforcer.skip=true
   """
                sh "${mvnCmd}  build-helper:parse-version jgitflow:release-start -DreleaseVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.incrementalVersion}.${currentBuild.number}-$shortCommit -DdevelopmentVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.nextIncrementalVersion}-SNAPSHOT -e"

                stage 'Finish Release'
                sh """
                    ${mvnCmd}  jgitflow:release-finish -Denforcer.skip=true
                   """

                    println "[Jenkinsfile] ***** FIX THIS!!! *****"
                    println "[Jenkinsfile] -Should checkout release/X.X.X.X-XXXXXX tag."
                    println "[Jenkinsfile] ***** FIX THIS!!! *****"

                stage 'Switch to Master Branch'
                sh """
                    git checkout -f master ;
                    git pull
                   """

                stage 'Clean'
                sh "${mvnCmd}  -Dmaven.test.failure.ignore -Dmaven.multiModuleProjectDirectory=. -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg clean"

                stage 'Install'
                sh "${mvnCmd}  -Dmaven.test.failure.ignore -Dmaven.multiModuleProjectDirectory=. -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg install"


                stage 'Publish Unit Test Reports'
                step([$class: 'JUnitResultArchiver', testResults: '**/TEST-*.xml'])

                stage 'Publish Code Quality Reports'
                step([$class: 'FindBugsPublisher', canComputeNew: false, defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', pattern: '', unHealthy: ''])
                step([$class: 'CheckStylePublisher', canComputeNew: false, defaultEncoding: '', healthy: '', pattern: '', unHealthy: ''])
                step([$class: 'PmdPublisher', canComputeNew: false, defaultEncoding: '', healthy: '', pattern: '', unHealthy: ''])
                step([$class: 'AnalysisPublisher', canComputeNew: false, defaultEncoding: '', healthy: '', unHealthy: ''])

                stage 'Archive Artifacts'
                step([$class: 'ArtifactArchiver', artifacts: '**/*.*', excludes: null])

                stage 'Deploy to Maven Central'
                def userInput1 = input 'Deploy to Maven Central?'
                println "[Jenkinsfile] $userInput1"

                    println "[Jenkinsfile] ***** FIX THIS!!! *****"
                    println "[Jenkinsfile] -Move Maven command below to def above."
                    println "[Jenkinsfile] -Could benefit from parallel run of deploy steps (via Maven) by parameterization of the command."
                    println "[Jenkinsfile] ***** FIX THIS!!! *****"

                sh """
                    cd parent-poms ;
                    pwd ;
                    ${mvnCmd} -Dmaven.test.failure.ignore -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;
                    cd ../codequality ;
                    pwd ;
                    ${mvnCmd} -Dmaven.test.failure.ignore -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;
                    cd ../licenses ;
                    pwd ;
                    ${mvnCmd} -Dmaven.test.failure.ignore -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;
                   """

                stage 'Promote Staged Repository'
                def userInput2 = input 'Promote stage repository to release repository?'
                println "[Jenkinsfile] $userInput2"

                sh """
                    OUTPUT=\$( ${mvnCmd}  nexus-staging:rc-list -DserverId=oss.sonatype.org -DnexusUrl=https://oss.sonatype.org/ -P maven-central-release | grep comlevonk | cut -d\\  -f2 ) ;
                    echo [Jenkinsfile] \$OUTPUT ;
                    ${mvnCmd}  nexus-staging:close nexus-staging:release -DstagingRepositoryId=\$OUTPUT -DserverId=oss.sonatype.org -DnexusUrl=https://oss.sonatype.org/ -P maven-central-release -e
                   """
            }
        }

    }
}
