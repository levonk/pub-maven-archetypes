package ${groupId}.batch;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * The Class FacebookCommentsItemWriter.
 */
@Component
@Scope("step")
public class SampleWriter implements ItemWriter<String> {
	
    @Autowired
	public SampleWriter (@Value("${${groupId}.param1}") String param1) {
		super();
	}
	/* (non-Javadoc)
	 * @see org.springframework.batch.item.ItemWriter#write(java.util.List)
	 */
	@Override
	public void write(List<? extends String> data){
		for(String item: data){
			System.out.println(item);
		}
		
	}


}

