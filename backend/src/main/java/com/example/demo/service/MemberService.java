package com.example.demo.service;

import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MemberService {
    
    @Autowired
    private MemberRepository memberRepository;

    @Cacheable(value = "members", key = "'all'")
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Cacheable(value = "memberDetails", key = "#id")
    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    @CachePut(value = "memberDetails", key = "#member.id")
    @CacheEvict(value = "members", allEntries = true)
    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    @CacheEvict(value = "members", allEntries = true)
    public List<Member> saveAllMembers(List<Member> members) {
        return memberRepository.saveAll(members);
    }

    @CacheEvict(value = {"members", "memberDetails"}, allEntries = true)
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    @Cacheable(value = "searchResults", key = "'name:' + #name")
    public List<Member> searchByName(String name) {
        return memberRepository.findByNameContainingIgnoreCase(name);
    }

    @Cacheable(value = "searchResults", key = "'location:' + #location")
    public List<Member> searchByLocation(String location) {
        return memberRepository.findByLocationContainingIgnoreCase(location);
    }

    @Cacheable(value = "searchResults", key = "'skill:' + #skill")
    public List<Member> searchBySkill(String skill) {
        return memberRepository.findBySkillsContainingIgnoreCase(skill);
    }

    @Cacheable(value = "searchResults", key = "'interest:' + #interest")
    public List<Member> searchByInterest(String interest) {
        return memberRepository.findByInterestsContainingIgnoreCase(interest);
    }
}