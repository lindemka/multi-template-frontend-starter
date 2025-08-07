package com.example.demo.factory;

import com.example.demo.entity.Member;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class MemberDataFactory {
    
    public List<Member> createAllMembers() {
        return Arrays.asList(
            createFounders(),
            createInvestors(),
            createDevelopers(),
            createAdvisors()
        ).stream()
        .flatMap(List::stream)
        .toList();
    }
    
    public List<Member> createFounders() {
        return Arrays.asList(
            createMember(1L, "Ahmed Salman", "New York City, US", "https://i.pravatar.cc/150?img=14", 342, 4.5,
                "Growth Marketing Expert | Data-Driven Strategist | Startup Enthusiast",
                Arrays.asList("Join a team", "Support startups"),
                Arrays.asList("Advertising & Marketing", "AI & Machine Learning", "Software & SaaS"),
                Arrays.asList("Marketing Manager", "Growth Manager", "Data Scientist"),
                null, null, null,
                "Passionate about helping startups scale through data-driven marketing strategies and growth hacking techniques.",
                Arrays.asList("Advertising & Marketing", "AI & Machine Learning", "Software & SaaS"),
                "Innovative teams working on AI-powered marketing solutions.",
                "10+ years of growth marketing experience, expertise in A/B testing, analytics, and user acquisition.",
                Arrays.asList("English", "Arabic", "Spanish")),
            
            createMember(2L, "Andy Mitchell", "San Francisco, US", "https://i.pravatar.cc/150?img=33", 1289, 5.0,
                "CEO @ TravelTech Inc. | Revolutionizing Travel Experiences",
                Arrays.asList("Build up a team", "Find investors", "Need support"),
                Arrays.asList("Tourism & Hospitality", "Marketing & Sales", "Business Developer", "Growth & Venture Relations"),
                Arrays.asList("Business Developer", "Sales Manager"),
                "Startup", "TravelTech Inc.", "Open Jobs",
                "Building the future of travel technology with AI-powered personalization and seamless booking experiences.",
                Arrays.asList("Tourism & Hospitality", "Marketing & Sales", "Tech"),
                "Technical co-founder with expertise in ML and passionate investors in travel tech.",
                "Industry connections, proven track record in hospitality tech, Series A ready.",
                Arrays.asList("English", "French")),
            
            createMember(3L, "Kinne Zhang", "London, UK", "https://i.pravatar.cc/150?img=5", 567, 4.8,
                "Founder @ BuildSmart AI | Making Construction Smarter",
                Arrays.asList("Build up a team", "Find investors"),
                Arrays.asList("Advertising & Marketing", "Architecture & Construction", "AI & Machine Learning"),
                Arrays.asList("Product Manager", "Designer (UX/UI)"),
                "Startup", "BuildSmart AI", "Funded Series A",
                "Using AI to revolutionize the construction industry with predictive analytics and smart project management.",
                Arrays.asList("Architecture & Construction", "AI & Machine Learning"),
                "Engineers passionate about PropTech and investors for Series B.",
                "Deep industry knowledge, technical expertise, proven product-market fit.",
                Arrays.asList("English", "Mandarin", "Cantonese"))
        );
    }
    
    public List<Member> createInvestors() {
        return Arrays.asList(
            createMember(14L, "Sophia Martinez", "Miami, US", "https://i.pravatar.cc/150?img=23", 2341, 4.9,
                "Managing Partner @ Hospitality Ventures",
                Arrays.asList("Invest", "Support startups"),
                Arrays.asList("Tourism & Hospitality", "Food & Beverage", "Marketing & Sales"),
                Arrays.asList("Business Developer", "Sales Manager"),
                "VC Fund", "Hospitality Ventures", null,
                "Investing in the future of travel, hospitality, and food tech.",
                Arrays.asList("Tourism & Hospitality", "Food & Beverage", "Tech"),
                "Innovative startups disrupting the hospitality industry.",
                "$500K-$5M investments, industry expertise, strategic partnerships.",
                Arrays.asList("English", "Spanish", "Portuguese"))
        );
    }
    
    public List<Member> createDevelopers() {
        return Arrays.asList(
            createMember(4L, "Brent Thompson", "Berlin, Germany", "https://i.pravatar.cc/150?img=7", 423, 4.5,
                "Full-Stack ML Engineer | Healthcare Tech Specialist",
                Arrays.asList("Join a team", "Support startups"),
                Arrays.asList("AI & Machine Learning", "Healthcare & Medical Devices", "Biotech & Pharmaceuticals"),
                Arrays.asList("Developer (Backend)", "Software Engineer", "Data Scientist"),
                null, null, null,
                "Combining software engineering with machine learning to solve healthcare challenges.",
                Arrays.asList("Healthcare & Medical Devices", "AI & Machine Learning", "Biotech & Pharmaceuticals"),
                "HealthTech startups working on meaningful problems.",
                "8 years experience in ML/AI, expertise in Python, TensorFlow, cloud architecture.",
                Arrays.asList("English", "German"))
        );
    }
    
    public List<Member> createAdvisors() {
        return Arrays.asList(
            createMember(16L, "Nina Patel", "Austin, US", "https://i.pravatar.cc/150?img=26", 432, 4.7,
                "Product Manager | HealthTech Innovation",
                Arrays.asList("Join a team", "Build up a team"),
                Arrays.asList("Biotech & Pharmaceuticals", "Healthcare & Medical Devices"),
                Arrays.asList("Data Scientist", "Product Manager"),
                null, null, null,
                "Bridging the gap between healthcare providers and technology.",
                Arrays.asList("Healthcare & Medical Devices", "Biotech & Pharmaceuticals"),
                "HealthTech startups focused on improving patient outcomes.",
                "Clinical background, product management, data analytics, regulatory knowledge.",
                Arrays.asList("English", "Hindi", "Gujarati"))
        );
    }
    
    private Member createMember(Long id, String name, String location, String avatar, int followers, double rating,
                                String tagline, List<String> goals, List<String> interests, List<String> skills,
                                String startupTag, String startupName, String startupBadge,
                                String shortAbout, List<String> industries, String lookingFor,
                                String offering, List<String> languages) {
        Member member = new Member();
        member.setId(id);
        member.setName(name);
        member.setLocation(location);
        member.setAvatar(avatar);
        member.setFollowers(followers);
        member.setRating(rating);
        member.setTagline(tagline);
        member.setGoals(goals);
        member.setInterests(interests);
        member.setSkills(skills);
        
        if (startupTag != null) {
            Member.Asset asset = new Member.Asset();
            asset.setTag(startupTag);
            asset.setName(startupName);
            asset.setBadge(startupBadge);
            member.setAssets(asset);
        }
        
        Member.About about = new Member.About();
        about.setShortDescription(shortAbout);
        about.setIndustries(industries);
        about.setLookingFor(lookingFor);
        about.setOffering(offering);
        about.setLanguages(languages);
        member.setAbout(about);
        
        return member;
    }
}