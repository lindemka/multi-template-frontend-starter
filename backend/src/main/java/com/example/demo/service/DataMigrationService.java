package com.example.demo.service;

import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Profile("postgres")
public class DataMigrationService {

    @Autowired
    private MemberRepository memberRepository;

    @PostConstruct
    @Transactional
    public void migrateData() {
        // Check if we need to update the data
        long currentCount = memberRepository.count();
        if (currentCount == 25) {
            System.out.println("All 25 members already exist in database. Skipping migration.");
            return;
        }
        
        if (currentCount > 0) {
            System.out.println("Found " + currentCount + " members in database. Clearing and reloading with all 25 members...");
            memberRepository.deleteAll();
        } else {
            System.out.println("Starting data migration to PostgreSQL...");
        }
        
        List<Member> members = createMockMembers();
        memberRepository.saveAll(members);
        
        System.out.println("Successfully migrated all " + members.size() + " members to PostgreSQL database.");
    }

    private List<Member> createMockMembers() {
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
                Arrays.asList("English", "Mandarin", "Cantonese")),
            
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
                Arrays.asList("English", "German")),
            
            createMember(5L, "Theresa Chen", "Toronto, Canada", "https://i.pravatar.cc/150?img=9", 892, 4.9,
                "CTO @ DesignAI Labs | Making Design Accessible with AI",
                Arrays.asList("Build up a team", "Find investors"),
                Arrays.asList("AI & Machine Learning", "Human-Machine Interaction & UX Design", "Tech", "Product & Design"),
                Arrays.asList("Developer (Frontend)", "Developer (Backend)", "Software Engineer", "Designer (UX/UI)"),
                "Startup", "DesignAI Labs", "Hiring Engineers",
                "Building AI tools that empower designers and democratize great design.",
                Arrays.asList("AI & Machine Learning", "Human-Machine Interaction & UX Design", "Tech"),
                "Senior engineers and seed investors passionate about design tools.",
                "Technical leadership, full-stack expertise, design thinking methodology.",
                Arrays.asList("English", "Mandarin", "French")),
            
            createMember(6L, "Alex Rodriguez", "Paris, France", "https://i.pravatar.cc/150?img=11", 1023, 5.0,
                "Partner @ Emerge Ventures | Impact-Driven Investor",
                Arrays.asList("Invest"),
                Arrays.asList("Food & Beverage", "Recruiting & Human Resources", "Social Impact & Community Development"),
                Arrays.asList("Business Developer", "Growth Manager"),
                "VC Fund", "Emerge Ventures", "Accepting Pitches",
                "Investing in early-stage startups that create positive social and environmental impact.",
                Arrays.asList("Food & Beverage", "Social Impact & Community Development", "Tech"),
                "Mission-driven founders solving real-world problems.",
                "Seed funding, strategic guidance, network access, operational support.",
                Arrays.asList("English", "Spanish", "French")),
            
            createMember(7L, "Rohith Reddy", "Singapore", "https://i.pravatar.cc/150?img=12", 645, 4.7,
                "Hardware + Software Engineer | Space Tech Enthusiast",
                Arrays.asList("Build up a team", "Find investors"),
                Arrays.asList("AI & Machine Learning", "Consumer Hardware & Electronics", "Space Technology & Exploration"),
                Arrays.asList("Software Engineer", "Developer (Backend)", "Product Manager"),
                null, null, null,
                "Building next-generation consumer electronics with a focus on space technology applications.",
                Arrays.asList("Consumer Hardware & Electronics", "Space Technology & Exploration", "AI & Machine Learning"),
                "Co-founders with hardware expertise and investors in deep tech.",
                "Full-stack development, embedded systems, product strategy.",
                Arrays.asList("English", "Hindi", "Telugu")),
            
            createMember(8L, "Sarah Kim", "Sydney, Australia", "https://i.pravatar.cc/150?img=1", 234, 4.3,
                "Data Scientist | BioTech Specialist",
                Arrays.asList("Join a team"),
                Arrays.asList("Healthcare & Medical Devices", "Biotech & Pharmaceuticals", "AI & Machine Learning"),
                Arrays.asList("Data Scientist", "Developer (Backend)"),
                null, null, "Looking for Opportunities",
                "Applying machine learning to accelerate drug discovery and personalized medicine.",
                Arrays.asList("Healthcare & Medical Devices", "Biotech & Pharmaceuticals", "AI & Machine Learning"),
                "Innovative biotech startups working on cutting-edge therapies.",
                "PhD in Bioinformatics, expertise in ML for genomics, clinical data analysis.",
                Arrays.asList("English", "Korean")),
            
            createMember(9L, "Marcus Johnson", "Remote", "https://i.pravatar.cc/150?img=15", 1567, 4.9,
                "Serial Entrepreneur | Angel Investor | Tech Advisor",
                Arrays.asList("Support startups", "Invest"),
                Arrays.asList("Software & SaaS", "AI & Machine Learning", "Tech"),
                Arrays.asList("Software Engineer", "Developer (Frontend)", "Developer (Backend)"),
                "Angel Investor", "50+ Portfolio Companies", null,
                "Building and investing in the next generation of SaaS companies.",
                Arrays.asList("Software & SaaS", "AI & Machine Learning", "Tech"),
                "B2B SaaS startups with strong product-market fit.",
                "Angel funding, technical mentorship, go-to-market strategy, network introductions.",
                Arrays.asList("English")),
            
            createMember(10L, "Lisa Wang", "Dallas, US", "https://i.pravatar.cc/150?img=16", 445, 4.6,
                "Founder @ SocialGood | Making Philanthropy Accessible",
                Arrays.asList("Build up a team", "Need support"),
                Arrays.asList("Marketing & Sales", "Growth & Venture Relations", "Social Impact & Community Development"),
                Arrays.asList("Marketing Manager", "Sales Manager", "Growth Manager"),
                "Startup", "SocialGood Platform", "Pre-Seed",
                "Creating a platform that connects donors with verified social impact projects worldwide.",
                Arrays.asList("Social Impact & Community Development", "Tech", "Marketing & Sales"),
                "Technical co-founder and impact investors.",
                "Non-profit sector expertise, fundraising experience, marketing strategy.",
                Arrays.asList("English", "Mandarin")),
            
            createMember(11L, "David Park", "Boston, US", "https://i.pravatar.cc/150?img=18", 789, 4.8,
                "CEO @ SpaceTech Solutions | Democratizing Space Data",
                Arrays.asList("Find investors", "Build up a team"),
                Arrays.asList("Space Technology & Exploration", "AI & Machine Learning", "Consumer Hardware & Electronics"),
                Arrays.asList("Software Engineer", "Product Manager"),
                "Startup", "SpaceTech Solutions", "Seeking $2M Seed",
                "Building satellite data analytics platform for agriculture and climate monitoring.",
                Arrays.asList("Space Technology & Exploration", "AI & Machine Learning"),
                "Seed investors and ML engineers passionate about space tech.",
                "Ex-SpaceX, deep space industry knowledge, proven product development.",
                Arrays.asList("English", "Korean")),
            
            createMember(12L, "Emma Wilson", "Los Angeles, US", "https://i.pravatar.cc/150?img=20", 923, 5.0,
                "Senior Product Designer | UX Strategist",
                Arrays.asList("Join a team", "Support startups"),
                Arrays.asList("Human-Machine Interaction & UX Design", "Product & Design", "Tech"),
                Arrays.asList("Designer (UX/UI)", "Product Manager", "Marketing Manager"),
                null, null, null,
                "Creating delightful user experiences that drive business growth.",
                Arrays.asList("Human-Machine Interaction & UX Design", "Product & Design", "Tech"),
                "Product-focused startups that value design excellence.",
                "10+ years design experience, user research, design systems, prototyping.",
                Arrays.asList("English")),
            
            createMember(13L, "James Liu", "Vancouver, Canada", "https://i.pravatar.cc/150?img=22", 156, 4.2,
                "Full-Stack Developer | React & Node.js Expert",
                Arrays.asList("Join a team"),
                Arrays.asList("Developer (Frontend)", "Developer (Backend)", "Software & SaaS"),
                Arrays.asList("Developer (Frontend)", "Developer (Backend)", "Software Engineer"),
                null, null, "Open to Work",
                "Building scalable web applications with modern JavaScript technologies.",
                Arrays.asList("Software & SaaS", "Tech"),
                "Fast-growing startups with interesting technical challenges.",
                "5+ years full-stack experience, React, Node.js, AWS, DevOps.",
                Arrays.asList("English", "Mandarin")),
            
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
                Arrays.asList("English", "Spanish", "Portuguese")),
            
            createMember(15L, "Oliver Brown", "Chicago, US", "https://i.pravatar.cc/150?img=25", 567, 4.5,
                "Founder @ SecureAI | Making Cybersecurity Intelligent",
                Arrays.asList("Build up a team", "Find investors"),
                Arrays.asList("Safety & Security Solutions", "AI & Machine Learning", "Software & SaaS"),
                Arrays.asList("Software Engineer", "Developer (Backend)", "Data Scientist"),
                "Startup", "SecureAI", "Series A Ready",
                "Using AI to detect and prevent cyber threats in real-time.",
                Arrays.asList("Safety & Security Solutions", "AI & Machine Learning", "Software & SaaS"),
                "Series A investors and senior security engineers.",
                "Ex-Microsoft Security, patent-pending technology, $2M ARR.",
                Arrays.asList("English")),
            
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
                Arrays.asList("English", "Hindi", "Gujarati")),
            
            createMember(17L, "Carlos Rivera", "Mexico City, Mexico", "https://i.pravatar.cc/150?img=28", 876, 4.8,
                "Founder @ LocalEats | Empowering Local Food Businesses",
                Arrays.asList("Build up a team", "Need support"),
                Arrays.asList("Food & Beverage", "Tourism & Hospitality", "Social Impact & Community Development"),
                Arrays.asList("Business Developer", "Marketing Manager"),
                "Startup", "LocalEats", "Bootstrapped",
                "Connecting local restaurants with customers while supporting community development.",
                Arrays.asList("Food & Beverage", "Tourism & Hospitality", "Social Impact & Community Development"),
                "Growth capital and technical co-founder.",
                "Restaurant industry expertise, local market knowledge, proven business model.",
                Arrays.asList("Spanish", "English")),
            
            createMember(18L, "Anna Schmidt", "Berlin, Germany", "https://i.pravatar.cc/150?img=29", 1234, 5.0,
                "Director @ TechStars Berlin | Startup Ecosystem Builder",
                Arrays.asList("Support startups", "Invest"),
                Arrays.asList("Tech", "AI & Machine Learning", "Software & SaaS"),
                Arrays.asList("Software Engineer", "Growth Manager"),
                "Accelerator", "TechStars Berlin", null,
                "Accelerating European startups to global scale.",
                Arrays.asList("Tech", "AI & Machine Learning", "Software & SaaS"),
                "Ambitious founders ready to scale globally.",
                "3-month accelerator program, $120K investment, global mentor network.",
                Arrays.asList("German", "English")),
            
            createMember(19L, "Robert Taylor", "Seattle, US", "https://i.pravatar.cc/150?img=31", 345, 4.4,
                "Senior Backend Engineer | Distributed Systems Expert",
                Arrays.asList("Join a team"),
                Arrays.asList("Software & SaaS", "Developer (Backend)", "Tech"),
                Arrays.asList("Developer (Backend)", "Software Engineer", "Data Scientist"),
                null, null, "Exploring Opportunities",
                "Building scalable backend systems that power millions of users.",
                Arrays.asList("Software & SaaS", "Tech"),
                "High-growth startups with interesting scaling challenges.",
                "Ex-Amazon, distributed systems, microservices, cloud architecture.",
                Arrays.asList("English")),
            
            createMember(20L, "Maya Johnson", "Atlanta, US", "https://i.pravatar.cc/150?img=32", 678, 4.6,
                "Founder @ ImpactHub | Design for Social Good",
                Arrays.asList("Build up a team", "Find investors"),
                Arrays.asList("Social Impact & Community Development", "Human-Machine Interaction & UX Design"),
                Arrays.asList("Designer (UX/UI)", "Product Manager", "Marketing Manager"),
                "Startup", "ImpactHub", "Raising Seed",
                "Creating technology solutions that address social inequality.",
                Arrays.asList("Social Impact & Community Development", "Human-Machine Interaction & UX Design"),
                "Impact investors and engineers passionate about social change.",
                "Non-profit experience, design thinking, community engagement.",
                Arrays.asList("English")),
            
            createMember(21L, "Thomas Anderson", "Remote", "https://i.pravatar.cc/150?img=34", 2890, 4.9,
                "Technical Advisor | Fractional CTO",
                Arrays.asList("Support startups"),
                Arrays.asList("AI & Machine Learning", "Software & SaaS", "Tech"),
                Arrays.asList("Software Engineer", "Developer (Frontend)", "Developer (Backend)"),
                "Consultant", "Tech Advisory", null,
                "Helping startups build robust technical foundations and scale engineering teams.",
                Arrays.asList("AI & Machine Learning", "Software & SaaS", "Tech"),
                "Early-stage startups needing technical guidance.",
                "20+ years experience, architecture reviews, team building, technical strategy.",
                Arrays.asList("English")),
            
            createMember(22L, "Isabella Garcia", "Barcelona, Spain", "https://i.pravatar.cc/150?img=35", 556, 4.7,
                "Founder @ TravelConnect | Reimagining Group Travel",
                Arrays.asList("Build up a team", "Need support"),
                Arrays.asList("Tourism & Hospitality", "Marketing & Sales", "Product & Design"),
                Arrays.asList("Marketing Manager", "Designer (UX/UI)", "Growth Manager"),
                "Startup", "TravelConnect", "MVP Launched",
                "Making group travel planning seamless and enjoyable.",
                Arrays.asList("Tourism & Hospitality", "Marketing & Sales", "Product & Design"),
                "Seed funding and backend engineers.",
                "Travel industry expertise, product design, growth marketing.",
                Arrays.asList("Spanish", "Catalan", "English")),
            
            createMember(23L, "Kevin Wu", "Tokyo, Japan", "https://i.pravatar.cc/150?img=36", 423, 4.5,
                "IoT Engineer | Hardware Hacker",
                Arrays.asList("Join a team", "Support startups"),
                Arrays.asList("Consumer Hardware & Electronics", "AI & Machine Learning", "Space Technology & Exploration"),
                Arrays.asList("Software Engineer", "Product Manager"),
                null, null, null,
                "Building smart devices that connect the physical and digital worlds.",
                Arrays.asList("Consumer Hardware & Electronics", "AI & Machine Learning"),
                "Hardware startups working on innovative IoT solutions.",
                "Embedded systems, IoT protocols, product development, manufacturing.",
                Arrays.asList("English", "Japanese", "Mandarin")),
            
            createMember(24L, "Rachel Green", "Denver, US", "https://i.pravatar.cc/150?img=38", 890, 4.8,
                "Partner @ HealthTech Capital | Investing in Digital Health",
                Arrays.asList("Invest"),
                Arrays.asList("Healthcare & Medical Devices", "Biotech & Pharmaceuticals", "AI & Machine Learning"),
                Arrays.asList("Business Developer", "Data Scientist"),
                "VC Fund", "HealthTech Capital", "Active Investing",
                "Backing founders building the future of healthcare delivery.",
                Arrays.asList("Healthcare & Medical Devices", "Biotech & Pharmaceuticals", "AI & Machine Learning"),
                "Digital health startups with validated clinical outcomes.",
                "Series A-B investments, healthcare network, regulatory guidance.",
                Arrays.asList("English")),
            
            createMember(25L, "Mohamed Ali", "Dubai, UAE", "https://i.pravatar.cc/150?img=40", 1456, 4.9,
                "Founder @ SmartBuild MENA | Digital Transformation in Construction",
                Arrays.asList("Build up a team", "Find investors"),
                Arrays.asList("Architecture & Construction", "AI & Machine Learning", "Safety & Security Solutions"),
                Arrays.asList("Product Manager", "Business Developer"),
                "Startup", "SmartBuild MENA", "Series B",
                "Digitizing construction management across the Middle East and North Africa.",
                Arrays.asList("Architecture & Construction", "AI & Machine Learning", "Safety & Security Solutions"),
                "Series B investors and regional expansion partners.",
                "MENA market expertise, government contracts, proven traction in 5 countries.",
                Arrays.asList("Arabic", "English", "French"))
        );
    }

    private Member createMember(Long id, String name, String location, String avatar, Integer followers, Double rating,
                                String tagline, List<String> goals, List<String> interests, List<String> skills,
                                String assetType, String assetLabel, String status,
                                String aboutShort, List<String> industries, String lookingFor, String offering,
                                List<String> languages) {
        Member member = new Member();
        member.setName(name);
        member.setLocation(location);
        member.setAvatar(avatar);
        member.setFollowers(followers);
        member.setRating(rating);
        member.setTagline(tagline);
        member.setGoals(goals);
        member.setInterests(interests);
        member.setSkills(skills);
        member.setStatus(status);
        
        if (assetType != null && assetLabel != null) {
            Member.Asset asset = new Member.Asset();
            asset.setType(assetType);
            asset.setLabel(assetLabel);
            member.setAssets(asset);
        }
        
        Member.About about = new Member.About();
        about.setShortDescription(aboutShort);
        about.setIndustries(industries);
        about.setLookingFor(lookingFor);
        about.setOffering(offering);
        about.setLanguages(languages);
        member.setAbout(about);
        
        return member;
    }
}