package com.example.demo.service;

import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MemberService {
    
    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    public List<Member> saveAllMembers(List<Member> members) {
        return memberRepository.saveAll(members);
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    public List<Member> searchByName(String name) {
        return memberRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Member> searchByLocation(String location) {
        return memberRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Member> searchBySkill(String skill) {
        return memberRepository.findBySkillsContainingIgnoreCase(skill);
    }

    public List<Member> searchByInterest(String interest) {
        return memberRepository.findByInterestsContainingIgnoreCase(interest);
    }
}