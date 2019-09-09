package com.example.demo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorld1 {

    @RequestMapping(value = "/hello1", method = RequestMethod.GET)
    public String Hello1(String name) {
        return "Hello " + name;
    }
}
