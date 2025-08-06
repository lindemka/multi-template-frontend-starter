package com.example.demo.controller;

import com.example.demo.entity.Member;
import com.example.demo.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(originPatterns = "*")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        Optional<Member> member = memberService.getMemberById(id);
        return member.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberService.saveMember(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<Member>> createMultipleMembers(@RequestBody List<Member> members) {
        List<Member> savedMembers = memberService.saveAllMembers(members);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMembers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        if (!memberService.getMemberById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        member.setId(id);
        Member updatedMember = memberService.saveMember(member);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (!memberService.getMemberById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Member>> searchMembers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String interest) {
        
        List<Member> results;
        
        if (name != null) {
            results = memberService.searchByName(name);
        } else if (location != null) {
            results = memberService.searchByLocation(location);
        } else if (skill != null) {
            results = memberService.searchBySkill(skill);
        } else if (interest != null) {
            results = memberService.searchByInterest(interest);
        } else {
            results = memberService.getAllMembers();
        }
        
        return ResponseEntity.ok(results);
    }
}