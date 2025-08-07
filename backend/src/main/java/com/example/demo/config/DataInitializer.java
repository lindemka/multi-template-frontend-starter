package com.example.demo.config;

import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import com.example.demo.factory.MemberDataFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private MemberDataFactory memberDataFactory;

    @Override
    public void run(String... args) throws Exception {
        if (memberRepository.count() == 0) {
            initializeMembers();
        }
    }
    
    private void initializeMembers() {
        List<Member> members = memberDataFactory.createAllMembers();
        memberRepository.saveAll(members);
        System.out.println("Demo members initialized successfully! Total: " + members.size());
    }
}