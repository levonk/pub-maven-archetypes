package ${groupId}.batch;

import org.springframework.batch.item.ItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;


@Component
@Scope("step")
public class SampleReader implements ItemReader<String> {
	
	int count=10;
	@Autowired
	public SampleReader(@Value("${${groupId}.param1}") String rootpath){
	   super();
	}

	
	@Override
	public String read()  {
		count --;

		if (count==0)return null;
		
		return "test "+ count;
		
	}

	
	
}
