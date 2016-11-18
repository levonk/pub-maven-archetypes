import hudson.model.*
import hudson.util.*

node {
	def mvnHome = tool name: 'first-install-from-apache-3.3.9', type: 'hudson.tasks.Maven$MavenInstallation'
	def workSpace = pwd()
	// def mvnCmd = "${mvnHome}/bin/mvn -s settings.xml --show-version --fail-at-end --errors --batch-mode --strict-checksums -T 1.5C "
	def mvnCmd = "${mvnHome}/bin/mvn --show-version --fail-at-end --errors --batch-mode --strict-checksums -s ${workSpace}/settings.xml -DsetBuildServer "

	println ">>workSpace = ${workSpace}"
	//println ">>ENVIRONMENTS follow:"
	//println env.getEnvironment()


	stage '1. Prep'
	// Figure out a way to delete the workspace completely.
	// deleteDir() or bash script
	println "[Jenkinsfile] Show branches"
	sshagent(['wdsds-at-github']) {
		checkout scm
		sh '''git branch -a && {
			echo "[Jenkinsfile] get rid of all in process releases that might be left over from a previous failure to allow jgitflow to progress"
			git for-each-ref --format="%(refname:short)" 'refs/heads/release/*' | xargs git branch -D || true 
			echo "[Jenkinsfile] Assure that we don't have copies of remote branches that no longer exist, otherwise jgitflow might fail"
			git fetch --prune
			git branch -a
			}
		'''
		println "[Jenkinsfile] Checkout master and update it to remote branch, otherwise jgitflow might fail"
		if ( 'master' != env.BRANCH_NAME )
		{
			sh '''{
				git branch
				currBranch=`git symbolic-ref --short HEAD`
				git checkout master && git pull
				git checkout $currBranch
				git branch
				git status
			}'''
		}
	}


	println "[Jenkinsfile] Remove GPG Keys from Jenkins"
	sh '''rm -rf ''' + workSpace + '''/.gnupg'''

	println "[Jenkinsfile] Ensure sudo"
	sh '''{
		if [[ $EUID -ne 0 ]]; then
			which sudo
		else
			echo '[Jenkinsfile] WARNING: We really should not be running as root!'
		fi
	}'''

	println "[Jenkinsfile] Ensure AWS CLI"
	sh '''which aws || {
			sudo=""
			if [[ $EUID -ne 0 ]]; then
				sudo=$( which sudo 2>/dev/null )
			fi
			installer=$(which apt-get 2>/dev/null || which yum 2>/dev/null)
			$sudo $installer update -y 
			case "$installer" in
				*apt-get)
					 pkgname="awscli"
				 ;;
				*yum)
					 pkgname="aws-cli"
				 ;;
				*) 
					 echo "No installer found" >&2 
					 exit 1
				 ;;
			esac
			cmd="$sudo $installer install -y $pkgname"
			echo [Jenkinsfile] executing command:"$cmd"
			eval $cmd
		}
	'''

	println "[Jenkinsfile] Ensure jq"
	sh '''which jq || {
			sudo=""
			if [[ $EUID -ne 0 ]]; then
				sudo=$( which sudo 2>/dev/null )
			fi
			installer=$(which apt-get 2>/dev/null || which yum 2>/dev/null)
			pkgname="jq"
			cmd="$sudo $installer install -y $pkgname"
			echo [Jenkinsfile] executing command:"$cmd"
			eval $cmd
		}
	'''

	println "[Jenkinsfile] Get New GPG Keys"
	// consider using s3 artifact plugin step
	println "[Jenkinsfile] ***** FIX THIS!!! *****"
	println "[Jenkinsfile] -Should not have to use a folder with wangj117 as the name."
	println "[Jenkinsfile] ***** FIX THIS!!! *****"

	sh '''test -d ''' + workSpace + '''/.gnupg || {
		aws s3 cp s3://studios-se-keys/bi/jenkins/mvn.licenses.gnupgd.tgz /tmp/mvn.licenses.gnupgd.tgz 
		tmpdir=/tmp/gnupg.`date +%s`
		mkdir $tmpdir
		pushd $tmpdir
		tar -xzf /tmp/mvn.licenses.gnupgd.tgz Users/wangj117/.gnupg/
		mv Users/wangj117/.gnupg ''' + workSpace + '''/.gnupg
		chmod 700 ''' + workSpace + '''/.gnupg
		cd ''' + workSpace + '''/.gnupg
		ls
		pwd
		popd
	}'''

	println "[Jenkinsfile] Ensure Maven"


	sshagent(['wdsds-at-github']) {

		wrap([$class: 'ConfigFileBuildWrapper', managedFiles: [[fileId: '61fc9411-08ac-482d-bc0d-3765d885d596', replaceTokens: false, targetLocation: 'settings.xml', variable: '']]]) {
		println '[Jenkinsfile] Ensure Maven Wrapper'

		withCredentials([[$class: 'StringBinding', credentialsId: 'gpg.password', variable: 'GPG_PASSWORD']]) {

                sh 'ssh-add -l'

				println '[Jenkinsfile] Checkout'
                git branch: 'develop', credentialsId: 'wdsds-at-github', url: 'ssh://git@github.com/DGHLJ/pub-maven-archetypes.git'

                sh('git rev-parse HEAD > GIT_COMMIT')
                def gitCommit=readFile('GIT_COMMIT')
                def shortCommit=gitCommit.substring(0, 7)


		println "[Jenkinsfile] ***** FIX THIS!!! *****"
		println "[Jenkinsfile] -Re-address this in future"

				println '[Jenkinsfile] Get AWS Credentials'
                sh 'export AWS_ACCESS_KEY_ID=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .AccessKeyId  )'
                sh 'export AWS_SECRET_ACCESS_KEY=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .SecretAccessKey  )'

                println '[Jenkinsfile] Install Extensions'
                sh """
					git branch -a
                    for i in \$(ls -d */);
                    do
                        if [ -f \${i}pom.xml ]; then
                            echo "[Jenkinsfile] cd \${i}";
                            cd \${i}
                            if [ ! -d ".mvn" ]; then
                                ${mvnCmd} com.github.sviperll:coreext-maven-plugin:install || true 2>&1 >/dev/null
                            fi
                            cd ..
                        fi
                    done

                    ${mvnCmd} -Dmaven.multiModuleProjectDirectory=. com.github.sviperll:coreext-maven-plugin:install || true 2>&1 >/dev/null
					pushd .
					cd parent-poms
                    ${mvnCmd} -PbuildServerPrep validate || true
					${mvnCmd} io.takari:maven:wrapper
					popd
                   """

				stage '2. Start Release'
				sh 'git branch -a && git status'
                sh "${mvnCmd}  -X build-helper:parse-version jgitflow:release-start -DreleaseVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.incrementalVersion}.${currentBuild.number}-$shortCommit -DdevelopmentVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.nextIncrementalVersion}-SNAPSHOT -e || (git status --ignored -u --porcelain && git remote show origin && false)"
				sh 'git branch -a && git status'

				stage '3. Finish Release'
                sh """
                    ${mvnCmd}  jgitflow:release-finish -Denforcer.skip=true
                   """

                    println "[Jenkinsfile] ***** FIX THIS!!! *****"
                    println "[Jenkinsfile] -Should checkout release/X.X.X.X-XXXXXX tag."
                    println "[Jenkinsfile] ***** FIX THIS!!! *****"

				println '[Jenkinsfile] Switch to Master Branch'
                sh """
                    git checkout -f master ;
                    git pull
                   """

				println '[Jenkinsfile] Clean & Install'
                sh "${mvnCmd}  -Dmaven.test.failure.ignore -Dmaven.multiModuleProjectDirectory=. -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg clean install"


				stage '4. Publish Unit Test Reports'
                step([$class: 'JUnitResultArchiver', testResults: '**/TEST-*.xml'])

				stage '5. Publish Code Quality Reports'
                step([$class: 'FindBugsPublisher', canComputeNew: false, defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', pattern: '', unHealthy: ''])
                step([$class: 'CheckStylePublisher', canComputeNew: false, defaultEncoding: '', healthy: '', pattern: '', unHealthy: ''])
                step([$class: 'PmdPublisher', canComputeNew: false, defaultEncoding: '', healthy: '', pattern: '', unHealthy: ''])
                step([$class: 'AnalysisPublisher', canComputeNew: false, defaultEncoding: '', healthy: '', unHealthy: ''])

				stage '6. Archive Artifacts'
                step([$class: 'ArtifactArchiver', artifacts: '**/*.*', excludes: null])

				stage '7. Deploy to Maven Central'
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

                stage '8. Promote Staged Repository'
		println "[Jenkinsfile] @TODO Update Changemanagement"
		println "[Jenkinsfile] @TODO Set Moniotring Markers"
		println "[Jenkinsfile] @TODO Communicate Stage"
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
/* vi: set filetype=groovy syntax=groovy noexpandtab tabstop=4 shiftwidth=4: */
