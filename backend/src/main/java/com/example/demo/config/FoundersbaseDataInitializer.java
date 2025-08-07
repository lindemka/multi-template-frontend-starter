package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.UserProfileService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Configuration
public class FoundersbaseDataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(FoundersbaseDataInitializer.class);

    @Autowired
    private AuthUserRepository authUserRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private FounderProfileRepository founderProfileRepository;
    
    @Autowired
    private InvestorProfileRepository investorProfileRepository;
    
    @Autowired
    private StartupRepository startupRepository;
    
    @Autowired
    private StartupMemberRepository startupMemberRepository;
    
    @Autowired
    private UserProfileService userProfileService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void initializeData() {
        try {
            logger.info("=== Starting Foundersbase Data Initialization ===");
            
            // Step 1: Create or fix users from existing auth_users
            ensureUsersExist();
            
            // Step 2: Create user profiles for all users
            createUserProfiles();
            
            // Step 3: Create founder and investor profiles
            createFounderAndInvestorProfiles();
            
            // Step 4: Create startups
            createStartups();
            
            // Step 5: Add startup members
            createStartupMembers();
            
            logger.info("=== Foundersbase Data Initialization Complete ===");
            logDatabaseStatus();
            
        } catch (Exception e) {
            logger.error("Error initializing Foundersbase data: ", e);
        }
    }
    
    private void ensureUsersExist() {
        logger.info("Ensuring users exist...");
        
        // Check if we have any users
        long userCount = authUserRepository.count();
        
        if (userCount == 0) {
            // Create sample users aligned with Foundersbase vision
            createSampleUsers();
        } else {
            // Fix any existing users with null fields
            fixExistingUsers();
        }
    }
    
    private void createSampleUsers() {
        logger.info("Creating sample users for Foundersbase...");
        
        List<AuthUser> users = Arrays.asList(
            createUser("sarah.chen", "sarah.chen@example.com", "Sarah", "Chen", "password123"),
            createUser("alex.johnson", "alex.johnson@example.com", "Alex", "Johnson", "password123"),
            createUser("maria.garcia", "maria.garcia@example.com", "Maria", "Garcia", "password123"),
            createUser("james.kim", "james.kim@example.com", "James", "Kim", "password123"),
            createUser("emma.wilson", "emma.wilson@example.com", "Emma", "Wilson", "password123"),
            createUser("david.patel", "david.patel@example.com", "David", "Patel", "password123"),
            createUser("lisa.anderson", "lisa.anderson@example.com", "Lisa", "Anderson", "password123"),
            createUser("michael.zhang", "michael.zhang@example.com", "Michael", "Zhang", "password123")
        );
        
        authUserRepository.saveAll(users);
        logger.info("Created {} sample users", users.size());
    }
    
    private AuthUser createUser(String username, String email, String firstName, String lastName, String password) {
        AuthUser user = new AuthUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        user.setEnabled(true);
        return user;
    }
    
    private void fixExistingUsers() {
        logger.info("Fixing existing users...");
        
        List<AuthUser> users = authUserRepository.findAll();
        for (AuthUser user : users) {
            boolean changed = false;
            
            if (user.getUsername() == null) {
                user.setUsername(user.getEmail() != null ? user.getEmail() : "user" + user.getId());
                changed = true;
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode("password123"));
                changed = true;
            }
            if (user.getFirstName() == null) {
                user.setFirstName(user.getUsername().split("@")[0].split("\\.")[0]);
                changed = true;
            }
            if (user.getLastName() == null) {
                user.setLastName("User");
                changed = true;
            }
            if (user.getRole() == null) {
                user.setRole("USER");
                changed = true;
            }
            if (user.getEnabled() == null) {
                user.setEnabled(true);
                changed = true;
            }
            
            if (changed) {
                authUserRepository.save(user);
            }
        }
    }
    
    private void createUserProfiles() {
        logger.info("Creating user profiles...");
        
        List<AuthUser> users = authUserRepository.findAll();
        int created = 0;
        
        for (AuthUser user : users) {
            if (userProfileRepository.findByUserId(user.getId()).isEmpty()) {
                UserProfile profile = new UserProfile();
                profile.setUser(user);
                profile.setName(user.getFullName());
                profile.setAvatar("https://ui-avatars.com/api/?name=" + user.getFullName().replace(" ", "+") + "&background=random");
                profile.setFollowers((int)(Math.random() * 500));
                profile.setRating(3.5 + Math.random() * 1.5);
                
                // Set location based on user index
                String[] locations = {"San Francisco, CA", "New York, NY", "Austin, TX", "Berlin, Germany", 
                                     "London, UK", "Singapore", "Toronto, Canada", "Tel Aviv, Israel"};
                profile.setLocation(locations[created % locations.length]);
                
                // Set tagline based on user type
                String[] taglines = {
                    "Serial Entrepreneur | Building the Future",
                    "Technical Co-founder | Full-Stack Developer",
                    "Growth Hacker | Marketing Expert",
                    "Product Designer | UX Specialist",
                    "Angel Investor | Startup Advisor",
                    "AI/ML Engineer | Deep Learning Expert",
                    "Business Development | Strategic Partnerships",
                    "Operations Expert | Scaling Startups"
                };
                profile.setTagline(taglines[created % taglines.length]);
                
                // Set goals
                List<String> goalOptions = Arrays.asList(
                    "Find co-founder", "Join a team", "Find investors", "Build network", 
                    "Support startups", "Find mentors", "Hire talent", "Learn and grow"
                );
                profile.setGoals(Arrays.asList(
                    goalOptions.get((int)(Math.random() * goalOptions.size())),
                    goalOptions.get((int)(Math.random() * goalOptions.size()))
                ));
                
                // Set interests
                List<String> interestOptions = Arrays.asList(
                    "AI & Machine Learning", "Blockchain", "SaaS", "Fintech", "Healthcare",
                    "E-commerce", "EdTech", "Climate Tech", "Web3", "Marketplace"
                );
                profile.setInterests(Arrays.asList(
                    interestOptions.get((int)(Math.random() * interestOptions.size())),
                    interestOptions.get((int)(Math.random() * interestOptions.size())),
                    interestOptions.get((int)(Math.random() * interestOptions.size()))
                ));
                
                // Set skills
                List<String> skillOptions = Arrays.asList(
                    "Product Management", "Software Development", "Marketing", "Sales",
                    "Design", "Data Science", "Business Development", "Operations",
                    "Finance", "Legal", "HR", "Content Creation"
                );
                profile.setSkills(Arrays.asList(
                    skillOptions.get((int)(Math.random() * skillOptions.size())),
                    skillOptions.get((int)(Math.random() * skillOptions.size()))
                ));
                
                // Set about
                UserProfile.About about = new UserProfile.About();
                about.setShortDescription("Passionate about building innovative solutions that solve real problems. " +
                    "Looking to connect with like-minded entrepreneurs and builders.");
                about.setLookingFor("Co-founders, investors, and talented team members who share the vision");
                about.setOffering("Experience, network, and dedication to building something meaningful");
                about.setLanguages(Arrays.asList("English", Math.random() > 0.5 ? "Spanish" : "Mandarin"));
                profile.setAbout(about);
                
                userProfileRepository.save(profile);
                created++;
            }
        }
        
        logger.info("Created {} user profiles", created);
    }
    
    private void createFounderAndInvestorProfiles() {
        logger.info("Creating founder and investor profiles...");
        
        List<UserProfile> profiles = userProfileRepository.findAll();
        int founders = 0;
        int investors = 0;
        
        for (int i = 0; i < profiles.size(); i++) {
            UserProfile profile = profiles.get(i);
            
            // First 5 users are founders
            if (i < 5 && founderProfileRepository.findByUserProfileId(profile.getId()).isEmpty()) {
                FounderProfile founder = new FounderProfile();
                founder.setUserProfile(profile);
                founder.setMyIntroduction("I'm a passionate entrepreneur with " + (3 + i) + " years of experience building startups.");
                founder.setMyMotivation("To create technology that makes a meaningful impact on people's lives.");
                founder.setMyAchievement("Previously founded a startup that reached 10K users and secured seed funding.");
                founder.setMyCharacter("Resilient, creative problem-solver who thrives in uncertainty.");
                founder.setLookingForCofounder(i % 2 == 0);
                founder.setLookingForInvestor(true);
                founder.setLookingForMentor(i % 3 == 0);
                founder.setExpertiseAreas(Arrays.asList("Product Strategy", "Fundraising", "Team Building"));
                founder.setYearsExperience(3 + i);
                founder.setPreviousStartups(i > 2 ? 1 : 0);
                
                founderProfileRepository.save(founder);
                founders++;
            }
            
            // Users 5-7 are investors
            if (i >= 5 && i < 8 && investorProfileRepository.findByUserProfileId(profile.getId()).isEmpty()) {
                InvestorProfile investor = new InvestorProfile();
                investor.setUserProfile(profile);
                investor.setInvestmentFocus("Early-stage B2B SaaS and AI startups with strong technical teams");
                investor.setInvestmentExperience((i - 4) + " years of angel investing, " + (i * 2) + " portfolio companies");
                investor.setInvestorIntroduction("Angel investor focused on helping technical founders build scalable businesses");
                investor.setInvestmentRangeMin(new BigDecimal("10000"));
                investor.setInvestmentRangeMax(new BigDecimal("100000"));
                investor.setPreferredStages(Arrays.asList("pre-seed", "seed"));
                investor.setPreferredIndustries(Arrays.asList("SaaS", "AI/ML", "Developer Tools"));
                investor.setPortfolioCompanies(Arrays.asList("TechStartup Inc", "AI Solutions Co"));
                
                investorProfileRepository.save(investor);
                investors++;
            }
        }
        
        logger.info("Created {} founder profiles and {} investor profiles", founders, investors);
    }
    
    private void createStartups() {
        logger.info("Creating startups...");
        
        if (startupRepository.count() > 0) {
            logger.info("Startups already exist, skipping creation");
            return;
        }
        
        List<Startup> startups = Arrays.asList(
            createStartup("NeuralFlow", "AI-powered workflow automation for enterprises",
                "We're building the next generation of workflow automation using advanced AI to help enterprises streamline operations",
                "mvp", "AI/ML", "San Francisco, CA", true, true),
            
            createStartup("GreenGrid", "Sustainable energy management platform",
                "Helping businesses optimize energy consumption and reduce carbon footprint through smart analytics",
                "revenue", "Climate Tech", "Berlin, Germany", true, false),
            
            createStartup("HealthBridge", "Connecting patients with specialists worldwide",
                "Telemedicine platform that breaks down geographical barriers in healthcare",
                "growth", "Healthcare", "New York, NY", true, true),
            
            createStartup("EduSpark", "Personalized learning powered by AI",
                "Adaptive learning platform that customizes education for each student's needs",
                "idea", "EdTech", "Austin, TX", false, true),
            
            createStartup("FinFlow", "Modern treasury management for startups",
                "All-in-one financial operations platform designed for fast-growing startups",
                "seed", "Fintech", "London, UK", true, false)
        );
        
        startupRepository.saveAll(startups);
        logger.info("Created {} startups", startups.size());
    }
    
    private Startup createStartup(String name, String tagline, String description, 
                                  String stage, String industry, String location,
                                  boolean isHiring, boolean isFundraising) {
        Startup startup = new Startup();
        startup.setName(name);
        startup.setTagline(tagline);
        startup.setDescription(description);
        startup.setStage(stage);
        startup.setIndustry(industry);
        startup.setLocation(location);
        startup.setIsHiring(isHiring);
        startup.setIsFundraising(isFundraising);
        startup.setTeamSize((int)(2 + Math.random() * 8));
        startup.setFoundedDate(LocalDate.now().minusMonths((int)(Math.random() * 24)));
        startup.setWebsite("https://www." + name.toLowerCase() + ".com");
        startup.setLogoUrl("https://ui-avatars.com/api/?name=" + name + "&background=random");
        
        if (stage.equals("revenue") || stage.equals("growth")) {
            startup.setRevenueRange("$10K-100K MRR");
            startup.setProductStatus("launched");
        } else if (stage.equals("mvp") || stage.equals("seed")) {
            startup.setProductStatus("beta");
        } else {
            startup.setProductStatus("development");
        }
        
        startup.setAchievements(Arrays.asList(
            "Completed accelerator program",
            "First " + (int)(10 + Math.random() * 90) + " customers",
            "Product-market fit validated"
        ));
        
        return startup;
    }
    
    private void createStartupMembers() {
        logger.info("Creating startup members...");
        
        List<Startup> startups = startupRepository.findAll();
        List<AuthUser> users = authUserRepository.findAll();
        
        if (startups.isEmpty() || users.isEmpty()) {
            logger.warn("No startups or users found, skipping member creation");
            return;
        }
        
        int membersCreated = 0;
        
        for (int i = 0; i < Math.min(startups.size(), users.size()); i++) {
            Startup startup = startups.get(i);
            
            // Add founder
            if (!startupMemberRepository.existsByStartupIdAndUserId(startup.getId(), users.get(i).getId())) {
                StartupMember founder = new StartupMember();
                founder.setStartup(startup);
                founder.setUser(users.get(i));
                founder.setRole("Founder & CEO");
                founder.setEquityPercentage(new BigDecimal("40.00"));
                founder.setJoinedDate(startup.getFoundedDate());
                founder.setIsActive(true);
                startupMemberRepository.save(founder);
                membersCreated++;
            }
            
            // Add co-founder if we have enough users
            if (i + 1 < users.size() && 
                !startupMemberRepository.existsByStartupIdAndUserId(startup.getId(), users.get(i + 1).getId())) {
                StartupMember cofounder = new StartupMember();
                cofounder.setStartup(startup);
                cofounder.setUser(users.get(i + 1));
                cofounder.setRole("Co-Founder & CTO");
                cofounder.setEquityPercentage(new BigDecimal("30.00"));
                cofounder.setJoinedDate(startup.getFoundedDate().plusDays(7));
                cofounder.setIsActive(true);
                startupMemberRepository.save(cofounder);
                membersCreated++;
            }
        }
        
        logger.info("Created {} startup members", membersCreated);
    }
    
    private void logDatabaseStatus() {
        logger.info("=== Database Status ===");
        logger.info("Users: {}", authUserRepository.count());
        logger.info("User Profiles: {}", userProfileRepository.count());
        logger.info("Founder Profiles: {}", founderProfileRepository.count());
        logger.info("Investor Profiles: {}", investorProfileRepository.count());
        logger.info("Startups: {}", startupRepository.count());
        logger.info("Startup Members: {}", startupMemberRepository.count());
    }
}