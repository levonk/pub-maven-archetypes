import hudson.model.*
import hudson.util.*

node {
	def mvnHome = tool name: 'first-install-from-apache-3.3.9', type: 'hudson.tasks.Maven$MavenInstallation'
	def workSpace = pwd()
	// def mvnCmd = "${mvnHome}/bin/mvn -s settings.xml --show-version --fail-at-end --errors --batch-mode --strict-checksums -T 1.5C "
	def mvnCmd = "${mvnHome}/bin/mvn --show-version --fail-at-end --errors --batch-mode --strict-checksums -s ${workSpace}/settings.xml -DsetBuildServer "

	println "[Jenkinsfile] workSpace = ${workSpace}"


	stage '1. Prep'
	// Figure out a way to delete the workspace completely.  deleteDir() or bash script
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

	println "[Jenkinsfile] Short Circuit, jgitflow insists on clean working directory and it has a symlink bug"
	sh '''[[ ! -z $(find ''' + workSpace + ''' -type l) ]] && echo "No Symlinks because of jgitflow bug" && false || true'''

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
		chmod -R 0700 ''' + workSpace + '''/.gnupg
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
                String gitCommit=readFile('GIT_COMMIT')
                String shortCommit=gitCommit.substring(0, 7)


		println "[Jenkinsfile] ***** FIX THIS!!! *****"
		println "[Jenkinsfile] -Re-address this in future"

				println '[Jenkinsfile] Get AWS Credentials'
                sh 'export AWS_ACCESS_KEY_ID=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .AccessKeyId  )'
                sh 'export AWS_SECRET_ACCESS_KEY=$( curl -s  169.254.169.254/latest/meta-data/iam/security-credentials/adm-wds-docker | jq -r .SecretAccessKey  )'

                println '[Jenkinsfile] Install Extensions'
                sh """
					git branch -a

                    ${mvnCmd} -Dmaven.multiModuleProjectDirectory=. com.github.sviperll:coreext-maven-plugin:install || true 2>&1 >/dev/null
					pushd .
					cd parent-poms
                    ${mvnCmd} -PbuildServerPrep validate io.takari:maven:wrapper || true
					popd
                   """

				stage '2. Start Release'
				sh 'git branch -a && git status'
                sh "${mvnCmd}  -X build-helper:parse-version jgitflow:release-start -DreleaseVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.incrementalVersion}.${currentBuild.number}-$shortCommit -DdevelopmentVersion=\\\${parsedVersion.majorVersion}.\\\${parsedVersion.minorVersion}.\\\${parsedVersion.nextIncrementalVersion}-SNAPSHOT -e || (git remote -v && git status --ignored -u --porcelain && git remote show origin && false)"
				sh 'git branch -a && git status'

				stage '3. Finish Release'
				"${mvnCmd}  jgitflow:release-finish".execute();

				println '[Jenkinsfile] Switch to Master Branch'
				println "[Jenkinsfile] -Should checkout release/X.X.X.X-XXXXXX tag."
                sh """
                    git checkout -f master ;
                    git pull
                   """

				println '[Jenkinsfile] Clean & Install'
                "${mvnCmd}  -Dmaven.multiModuleProjectDirectory=. -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg clean install".execute();


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
                def userInput1 = input 'Deploy to Maven Central staging?'
                println "[Jenkinsfile] $userInput1"

				"${mvnCmd} --also-make --projects 'parent-poms,codequality,licenses' -Dgpg.passphrase=${env.GPG_PASSWORD} -Dgpg.homedir=${workSpace}/.gnupg deploy -P maven-central-release;".execute();

                stage '8. Promote Staged Repository'
		println "[Jenkinsfile] @TODO Update Changemanagement"
		println "[Jenkinsfile] @TODO Set Moniotring NewRelic, etc... Markers"
		println "[Jenkinsfile] @TODO Communicate Stage via Slack, etc..."


				println "[Jenkinsfile] Use Maven to determine our nexus staging respository"
				StringBuilder sout = new StringBuilder();
				StringBuilder serr = new StringBuilder();
				String cmdListOfNexusRepos = "${mvnCmd} nexus-staging:rc-list -DserverId=oss.sonatype.org -DnexusUrl=https://oss.sonatype.org/ -P maven-central-release";
				Process proc = cmdListOfNexusRepos.execute();
				proc.consumeProcessOutput( sout, serr );
				proc.waitForOrKill( 5 * 60 * 1000 );
				
				println "[Jenkinsfile] using output of nexus-staging:rc-list find ours"
				String myRepo;
				sout.eachLine { line ->
					def (repoid, repostate, repodescription ) = line.split( ' ' );
					if ( "OPEN".equals(repostate) && (repoid =~ /comlevonk/) ) {
						myRepo = repoid;
						break;
					}
				}
                def userInput2 = input "Promote stage repository \"${myRepo}\" to release repository?"
                println "[Jenkinsfile] $userInput2"

                "${mvnCmd} -X -e nexus-staging:close nexus-staging:release -DstagingRepositoryId=$myRepo -P maven-central-release".execute();
            }
        }
    }
}
/* vi: set filetype=groovy syntax=groovy noexpandtab tabstop=4 shiftwidth=4: */
