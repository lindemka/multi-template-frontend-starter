package com.example.demo.repository;

import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByNameContainingIgnoreCase(String name);
    List<Member> findByLocationContainingIgnoreCase(String location);
    List<Member> findBySkillsContainingIgnoreCase(String skill);
    List<Member> findByInterestsContainingIgnoreCase(String interest);
}