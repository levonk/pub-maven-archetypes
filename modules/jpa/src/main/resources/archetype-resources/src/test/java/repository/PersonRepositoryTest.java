package ${groupId}.repository;

import ${groupId}.JpaConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Unit test for simple App.
 */
@SpringApplicationConfiguration(classes = JpaConfiguration.class)
public class PersonRepositoryTest   extends AbstractTestNGSpringContextTests
{
    @Autowired
    PersonRepository personRepository;


    @Test
    public void testGetAll(){
        Assert.assertNotNull(personRepository.findByName("test"));
    }
}

