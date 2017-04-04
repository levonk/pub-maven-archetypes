Maven Archetypes
========================

Release: [![Build Status](https://travis-ci.org/DGHLJ/pub-maven-archetypes.svg?branch=master)](https://travis-ci.org/DGHLJ/pub-maven-archetypes)
Develop: [![Build Status](https://travis-ci.org/DGHLJ/pub-maven-archetypes.svg?branch=develop)](https://travis-ci.org/DGHLJ/pub-maven-archetypes)

#Description
This project helps to create a multi-module maven project. It contains the following archetype
  1. `parent` -- this is the parent project, it also creates a common module in the root parent
  2. `exectable-jar` -- this is a submodule which creates fat executable JAR
  3. `restful-api` -- restful API archetype with Spring Boot and Spring MVC
  4. `webapp` -- web application with Spring MVC
  5. `couchdb-design` -- create couchdb design doc with couchdbapp
  6. `code quality definition files` -- configuration for various code quality tools      
  7. `spring batch `

#The following plugin and frameworks are pre configure. 
-  Spring Boot   
-  jacoco   
-  findbug   
-  testng   
-  equalsverifier  
-  mockito  
-  checkers-quals  
-  checkstyle   
-  enforcer   
-  pmd   
-  cobertura    
-  antrun   
-  pojomatic   
-  spring test framework   
 
#Usage 
maven repository: https://github.com/DGHLJ/pub-maven-archetypes/blob/master/

##parent project:
mvn archetype:generate -DarchetypeRepository=https://github.com/DGHLJ/pub-maven-archetypes-repo/raw/master/releases 	-DarchetypeGroupId=com.archetype -DarchetypeArtifactId=mvn-archetype-parent -DarchetypeVersion=1.0 -DgroupId=<project group id> -DartifactId=&lt;project artifact Id&gt;

##executable-jar: 
mvn archetype:generate -DarchetypeRepository=https://github.com/DGHLJ/pub-maven-archetypes-repo/raw/master/releases -DarchetypeGroupId=com.archetype -DarchetypeArtifactId=executable-jar -DarchetypeVersion=1.0 -DgroupId=<submodule group id> -DartifactId=&lt;submodule artifact Id&gt;

##jpa:
mvn archetype:generate -DarchetypeRepository=https://github.com/DGHLJ/pub-maven-archetypes-repo/raw/master/releases -DarchetypeGroupId=com.archetype -DarchetypeArtifactId=jpa -DarchetypeVersion=1.0 -DgroupId=<submodule group id> -DartifactId=&lt;submodule artifact Id&gt;

##restful API
mvn archetype:generate -DarchetypeRepository=https://github.com/DGHLJ/pub-maven-archetypes-repo/raw/master/releases -DarchetypeGroupId=com.archetype -DarchetypeArtifactId=restful-service -DarchetypeVersion=1.0 -DgroupId=<submodule group id> -DartifactId=&lt;submodule artifact Id&gt;

##spring batch
mvn archetype:generate -DarchetypeRepository=https://github.com/DGHLJ/pub-maven-archetypes-repo/raw/master/releases -DarchetypeGroupId=com.archetype -DarchetypeArtifactId=spring-batch -DarchetypeVersion=1.0 -DgroupId=<submodule group id> -DartifactId=&lt;submodule artifact Id&gt;

# Outstanding issues
reflow-maven-skin causes the following non-breaking issue:
https://github.com/andriusvelykis/reflow-maven-skin/issues/51
Investigate https://github.com/vackosar/gitflow-incremental-builder
