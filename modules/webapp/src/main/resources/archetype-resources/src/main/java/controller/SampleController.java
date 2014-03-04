package ${groupId}.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.Map;

@Controller
public class SampleController {

    @RequestMapping("/")
    @ResponseBody
    public Map<String, String> helloWorld() {
        return Collections.singletonMap("message", "Hello World");
    }



}