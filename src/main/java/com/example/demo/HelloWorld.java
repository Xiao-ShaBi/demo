package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloWorld {

//    @Autowired
//    private ITest iTest;

    @RequestMapping(value = "/")
    public String Hello() {
        return "index";
    }

    @RequestMapping(value = "/index")
    public String zhangning() {
        return "uj-termial/index";
    }
}
