#! /bin/sh

## http://www.mvnvm.org/
## Makes it so you can support multiple maven versions 

## Usage:
##  First Time
##    echo "mvn_version=3.0.5" > mvnvm.properties
##    git add mvnvm.properties
##  Subsequent time
##    mvn -d clean package ## Should now download maven before using it

MVN_EXE=~/bin/mvn

which brew || mkdir -p ~/bin;  curl -s 'https://bitbucket.org/mjensen/mvnvm/raw/master/mvn' > $MVN_EXE && chmod 0755 $MVN_EXE
which brew && brew install mvnvm

MVNVM_PROPS=mvnvm.properties
[ -f ${MVNVM_PROPS} ] ||  echo "mvn_versions=3.0.5" > ${MVNVM_PROPS}
