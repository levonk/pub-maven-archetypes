#!/bin/sh

MAX_OUTDATED_LIBRARIES=${1:-0}

OUTPUT="target/outdated.txt"
mkdir -p target
rm ${OUTPUT}

docker run --rm -it \
	-v ${HOME}/.m2:/home/user/.m2 \
	-v $(pwd):/workdir levonk/maven:latest \
	versions:display-dependency-updates \
	dependency:tree \
	-Dversions.outputFile="${OUTPUT}"

OUTDATED_LIBRARIES=`grep . "${OUTPUT}" | tail -n +2 | wc -l`

if [ ${OUTDATED_LIBRARIES} -ge ${MAX_OUTDATED_LIBRARIES} ]; then
	echo "There is ${OUTDATED_LIBRARIES} outdated libraries!\n"
	echo "Hit [ENTER] to see summary\n"
	read FOO
	printf '%b\n\n' "$(cat ${OUTPUT})"
	exit ${OUTDATED_LIBRARIES}
fi

