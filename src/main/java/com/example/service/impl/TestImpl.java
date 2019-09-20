package com.example.service.impl;

import com.example.service.ITest;

import org.springframework.stereotype.Service;

@Service
class TestImpl implements ITest {

    @Override
    public String test() {
        return "dfssfddd";
    }
}
