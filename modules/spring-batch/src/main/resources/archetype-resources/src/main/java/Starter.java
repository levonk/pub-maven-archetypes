package ${groupId};

import java.util.Collections;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;



public class Starter {
	static public void main(String[] args) throws JobExecutionAlreadyRunningException, JobRestartException, JobInstanceAlreadyCompleteException, JobParametersInvalidException{
		ApplicationContext context= new ClassPathXmlApplicationContext(new String[]{"/META-INF/spring/applicationContext.xml","/META-INF/spring/batch/jobs/*-batch.xml"});
		
		JobLauncher launcher=(JobLauncher) context.getBean("jobLauncher");
		Job job=(Job) context.getBean("${groupId}");
		
		launcher.run(job, new JobParameters(Collections.singletonMap("param1", new JobParameter("Param1_value"))));
		
	}
}
