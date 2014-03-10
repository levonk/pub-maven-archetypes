package ${groupId}.${artifactId};



import org.testng.annotations.Test;
import org.testng.Assert;

/**
 * Created by wangj117 on 1/28/14.
 */

public class AppTest {

   @Test
   public void testApp()  {

       Assert.assertEquals("Hello World!",new App().hello("World"));
   }
}
