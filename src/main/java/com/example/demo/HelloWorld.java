package com.example.demo;

import com.example.service.ITest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloWorld {

    @Autowired
    private ITest iTest;

    @RequestMapping(value = "/")
    public String Hello() {
        return iTest.test();
    }
}
