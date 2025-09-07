package com.richardmogou.config;

import com.richardmogou.entity.*;
import com.richardmogou.entity.enums.ApplicationStatus;
import com.richardmogou.entity.enums.InternshipAgreementStatus;
import com.richardmogou.entity.enums.InternshipOfferStatus;
import com.richardmogou.entity.enums.Role;
import com.richardmogou.repository.*;
import com.richardmogou.service.InternshipAgreementService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
//@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final DomainRepository domainRepository;
    private final SectorRepository sectorRepository;
    private final InternshipOfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final InternshipAgreementRepository agreementRepository;
    private final PasswordEncoder passwordEncoder;
    private final InternshipAgreementService agreementService; // Use service to handle complex creation

    @Override
    @Transactional // Run initialization within a transaction
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");

        if (userRepository.count() > 0) {
            log.info("Data already initialized. Skipping.");
            return;
        }

        // 1. Create Supporting Resources
        log.info("Creating Skills, Domains, Sectors...");
        Skill java = skillRepository.save(createSkill("Java"));
        Skill spring = skillRepository.save(createSkill("Spring Boot"));
        Skill sql = skillRepository.save(createSkill("SQL"));
        Skill react = skillRepository.save(createSkill("React"));
        Skill angular = skillRepository.save(createSkill("Angular"));
        Skill python = skillRepository.save(createSkill("Python"));
        Skill communication = skillRepository.save(createSkill("Communication"));
        Skill problemSolving = skillRepository.save(createSkill("Problem Solving"));

        Domain cs = domainRepository.save(createDomain("Computer Science"));
        Domain marketing = domainRepository.save(createDomain("Marketing"));
        Domain finance = domainRepository.save(createDomain("Finance"));
        Domain design = domainRepository.save(createDomain("Graphic Design"));

        Sector tech = sectorRepository.save(createSector("Technology"));
        Sector financeSector = sectorRepository.save(createSector("Finance"));
        Sector marketingSector = sectorRepository.save(createSector("Marketing Agency"));

        // 2. Create Users
        log.info("Creating Users...");
        User adminUser = userRepository.save(createUser("Admin", "User", "richardmogou@app.com", "password", Role.ADMIN, true));
        User facultyUser1 = userRepository.save(createUser("Alice", "Professor", "alice.prof@university.edu", "password", Role.FACULTY, true));
        User facultyUser2 = userRepository.save(createUser("Bob", "Lecturer", "bob.lect@university.edu", "password", Role.FACULTY, true));

        User companyUser1 = userRepository.save(createUser("Jane", "Smith", "jane.mogou@techcorp.com", "password", Role.COMPANY, true));
        User companyUser2 = userRepository.save(createUser("Peter", "Jones", "peter.jones@innovate.io", "password", Role.COMPANY, true));
        User companyUser3 = userRepository.save(createUser("Mark", "Chief", "mark.chief@financeplus.com", "password", Role.COMPANY, true));


        User studentUser1 = userRepository.save(createUser("John", "Doe", "john.doe@student.com", "password", Role.STUDENT, true));
        User studentUser2 = userRepository.save(createUser("Sarah", "Connor", "sarah.connor@student.com", "password", Role.STUDENT, true));
        User studentUser3 = userRepository.save(createUser("Mike", "Student", "mike.stu@student.com", "password", Role.STUDENT, true));

        // 3. Create Companies (and link to users)
        log.info("Creating Companies...");
        Company techCorp = companyRepository.save(createCompany("TechCorp", "Leading tech solutions.", "techcorp.com", "1 Tech Way", tech, companyUser1));
        Company innovateIO = companyRepository.save(createCompany("Innovate IO", "Startup incubator.", "innovate.io", "2 Startup Ave", tech, companyUser2));
        Company financePlus = companyRepository.save(createCompany("FinancePlus", "Financial consulting.", "financeplus.com", "3 Money St", financeSector, companyUser3));


        // 4. Create Internship Offers
        log.info("Creating Internship Offers...");
        InternshipOffer offer1 = offerRepository.save(createOffer("Backend Developer Intern", "Work with Java/Spring.", java.getName() + ", " + spring.getName() + ", " + sql.getName(), cs.getName(), "Remote", "3 Months", LocalDate.now().plusMonths(1), InternshipOfferStatus.OPEN, techCorp));
        InternshipOffer offer2 = offerRepository.save(createOffer("Frontend Developer Intern", "Build UIs with React.", react.getName() + ", " + communication.getName(), cs.getName(), "New York, NY", "6 Weeks", LocalDate.now().plusMonths(2), InternshipOfferStatus.OPEN, techCorp));
        InternshipOffer offer3 = offerRepository.save(createOffer("Data Science Intern", "Analyze data with Python.", python.getName() + ", " + sql.getName(), cs.getName(), "Remote", "10 Weeks", LocalDate.now().plusMonths(1), InternshipOfferStatus.OPEN, innovateIO));
        InternshipOffer offer4 = offerRepository.save(createOffer("Marketing Intern", "Develop campaigns.", communication.getName(), marketing.getName(), "London, UK", "3 Months", LocalDate.now().plusMonths(3), InternshipOfferStatus.CLOSED, innovateIO)); // Closed offer
        InternshipOffer offer5 = offerRepository.save(createOffer("Financial Analyst Intern", "Market analysis.", problemSolving.getName(), finance.getName(), "Chicago, IL", "3 Months", LocalDate.now().plusMonths(2), InternshipOfferStatus.OPEN, financePlus));


        // 5. Create Applications (Various Statuses)
        log.info("Creating Applications...");
        // Student 1 applies to Offer 1 (Pending)
        Application app1 = applicationRepository.save(createApplication(studentUser1, offer1, "cv1.pdf", "Cover letter for backend role.", ApplicationStatus.PENDING));
        // Student 1 applies to Offer 3 (Accepted -> Agreement Pending Faculty)
        Application app2 = applicationRepository.save(createApplication(studentUser1, offer3, "cv1_datasci.pdf", "Cover letter for data science.", ApplicationStatus.ACCEPTED));
        // Student 2 applies to Offer 1 (Rejected)
        Application app3 = applicationRepository.save(createApplication(studentUser2, offer1, "cv2.pdf", "Cover letter from Sarah.", ApplicationStatus.REJECTED, "Not enough Spring Boot experience."));
        // Student 2 applies to Offer 2 (Accepted -> Agreement Approved)
        Application app4 = applicationRepository.save(createApplication(studentUser2, offer2, "cv2_frontend.pdf", "Cover letter for frontend.", ApplicationStatus.ACCEPTED));
         // Student 3 applies to Offer 5 (Viewed)
        Application app5 = applicationRepository.save(createApplication(studentUser3, offer5, "cv3_finance.pdf", "Cover letter for finance analyst.", ApplicationStatus.VIEWED));


        // 6. Create Agreements (where application was accepted)
        log.info("Creating Agreements for accepted applications...");
        // Agreement for App 2 (Pending Faculty)
        InternshipAgreement agreement2 = agreementService.createAgreementForApplication(app2.getId());
        agreement2.setFacultyValidator(facultyUser1); // Assign faculty
        agreementRepository.save(agreement2);
        log.info("Created agreement ID {} for App ID {}, assigned to Faculty ID {}", agreement2.getId(), app2.getId(), facultyUser1.getId());

        // Agreement for App 4 (Simulate full approval)
        InternshipAgreement agreement4 = agreementService.createAgreementForApplication(app4.getId());
        agreement4.setFacultyValidator(facultyUser2);
        agreement4.setStatus(InternshipAgreementStatus.PENDING_ADMIN_APPROVAL); // Simulate faculty validation
        agreement4.setFacultyValidationDate(LocalDateTime.now().minusDays(1));
        agreementRepository.save(agreement4); // Save after faculty step
        agreement4.setAdminApprover(adminUser);
        agreement4.setStatus(InternshipAgreementStatus.APPROVED); // Simulate admin approval
        agreement4.setAdminApprovalDate(LocalDateTime.now());
        agreementRepository.save(agreement4); // Save after admin step
        log.info("Created and fully approved agreement ID {} for App ID {}", agreement4.getId(), app4.getId());


        log.info("Data initialization finished.");
    }

    // Helper methods to create entities
    private User createUser(String firstName, String lastName, String email, String password, Role role, boolean enabled) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(enabled);
        return user;
    }

    private Company createCompany(String name, String description, String website, String address, Sector sector, User contact) {
        Company company = new Company();
        company.setName(name);
        company.setDescription(description);
        company.setWebsite(website);
        company.setAddress(address);
        company.setIndustrySector(sector != null ? sector.getName() : null); // Assuming Sector entity stores name
        company.setPrimaryContactUser(contact);
        return company;
    }

     private Skill createSkill(String name) {
        Skill skill = new Skill();
        skill.setName(name);
        return skill;
    }

     private Domain createDomain(String name) {
        Domain domain = new Domain();
        domain.setName(name);
        return domain;
    }

     private Sector createSector(String name) {
        Sector sector = new Sector();
        sector.setName(name);
        return sector;
    }


    private InternshipOffer createOffer(String title, String description, String skills, String domain, String location, String duration, LocalDate startDate, InternshipOfferStatus status, Company company) {
        InternshipOffer offer = new InternshipOffer();
        offer.setTitle(title);
        offer.setDescription(description);
        offer.setRequiredSkills(skills);
        offer.setDomain(domain);
        offer.setLocation(location);
        offer.setDuration(duration);
        offer.setStartDate(startDate);
        offer.setStatus(status);
        offer.setCompany(company);
        return offer;
    }

     private Application createApplication(User student, InternshipOffer offer, String cvPath, String coverLetter, ApplicationStatus status) {
        return createApplication(student, offer, cvPath, coverLetter, status, null);
    }

    private Application createApplication(User student, InternshipOffer offer, String cvPath, String coverLetter, ApplicationStatus status, String feedback) {
        Application app = new Application();
        app.setStudent(student);
        app.setInternshipOffer(offer);
        app.setCvPath(cvPath); // Store dummy path for now
        app.setCoverLetter(coverLetter);
        app.setStatus(status);
        app.setApplicationDate(LocalDateTime.now().minusDays(5)); // Simulate past application date
        app.setCompanyFeedback(feedback);
        return app;
    }
}