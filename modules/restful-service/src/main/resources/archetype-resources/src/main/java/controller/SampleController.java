package ${groupId}.controller;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@Controller
@Api(value = "/sampleController", description = "Sample Controller")
@RequestMapping("/sample")
public class SampleController {

    @RequestMapping(method = RequestMethod.GET)
    @ApiOperation(value = "Default Hello World Api", notes = "Sample api, please remove",
            responseClass = "java.util.Map")

    @ResponseBody
    public Map<String, String> helloWorld() {
        return Collections.singletonMap("message", "Hello World");
    }

    @RequestMapping(value="test", method=RequestMethod.GET)
    @ApiOperation(value = "Sample Test Api", notes = "Developer notes goes here",
            responseClass = "java.util.Map")
    @ResponseBody
    public Map<String, String> testhelloWorld() {
        return Collections.singletonMap("message", "Hello World");
    }


}