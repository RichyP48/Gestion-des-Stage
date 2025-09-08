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
    private final SchoolRepository schoolRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final InternshipAgreementService agreementService; // Use service to handle complex creation

    @Override
    @Transactional // Run initialization within a transaction
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");

        if (userRepository.count() > 0) {
            log.info("Data already exists. Checking faculty assignments...");
            fixFacultyAssignments();
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

        // Create Schools and Faculties
        log.info("Creating Schools and Faculties...");
        School paris = schoolRepository.save(createSchool("Université de Paris", "Université publique française"));
        School mit = schoolRepository.save(createSchool("MIT", "Massachusetts Institute of Technology"));
        School stanford = schoolRepository.save(createSchool("Stanford University", "Private research university"));
        log.info("Created schools: Paris({}), MIT({}), Stanford({})", paris.getId(), mit.getId(), stanford.getId());
        
        Faculty informatiqueParis = facultyRepository.save(createFaculty("Informatique", paris));
        Faculty mathsParis = facultyRepository.save(createFaculty("Mathématiques", paris));
        Faculty csMit = facultyRepository.save(createFaculty("Computer Science", mit));
        Faculty engineeringMit = facultyRepository.save(createFaculty("Engineering", mit));
        Faculty businessStanford = facultyRepository.save(createFaculty("Business Administration", stanford));
        Faculty csStanford = facultyRepository.save(createFaculty("Computer Science", stanford));
        log.info("Created {} faculties total", facultyRepository.count());

        // 2. Create Users
        log.info("Creating Users...");
        User adminUser = userRepository.save(createUser("Admin", "User", "richardmogou@app.com", "password", Role.ADMIN, true));
        User facultyUser1 = userRepository.save(createFacultyUser("Alice", "Professor", "alice.prof@university.edu", "password", paris, informatiqueParis));
        User facultyUser2 = userRepository.save(createFacultyUser("Bob", "Lecturer", "bob.lect@university.edu", "password", mit, csMit));
        log.info("Created faculty users - Alice faculty: {}, Bob faculty: {}", 
                facultyUser1.getFaculty() != null ? facultyUser1.getFaculty().getName() : "NULL",
                facultyUser2.getFaculty() != null ? facultyUser2.getFaculty().getName() : "NULL");

        User companyUser1 = userRepository.save(createUser("Jane", "Smith", "jane.mogou@techcorp.com", "password", Role.COMPANY, true));
        User companyUser2 = userRepository.save(createUser("Peter", "Jones", "peter.jones@innovate.io", "password", Role.COMPANY, true));
        User companyUser3 = userRepository.save(createUser("Mark", "Chief", "mark.chief@financeplus.com", "password", Role.COMPANY, true));


        User studentUser1 = userRepository.save(createStudentUser("John", "Doe", "john.doe@student.com", "password", paris, informatiqueParis));
        User studentUser2 = userRepository.save(createStudentUser("Sarah", "Connor", "sarah.connor@student.com", "password", mit, csMit));
        User studentUser3 = userRepository.save(createStudentUser("Mike", "Student", "mike.stu@student.com", "password", stanford, businessStanford));

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
        // Agreement for App 2 (Pending Faculty) - John Doe from informatiqueParis
        InternshipAgreement agreement2 = agreementService.createAgreementForApplication(app2.getId());
        // Alice is from informatiqueParis, same as John Doe, so she should see it
        agreement2.setStatus(InternshipAgreementStatus.PENDING_FACULTY_VALIDATION);
        agreement2.setSignedByStudent(false);
        agreement2.setSignedByCompany(false);
        agreement2.setSignedByFaculty(false);
        agreementRepository.save(agreement2);
        log.info("Created agreement ID {} for App ID {}, assigned to Faculty ID {}", agreement2.getId(), app2.getId(), facultyUser1.getId());

        // Agreement for App 4 (Simulate full approval)
        InternshipAgreement agreement4 = agreementService.createAgreementForApplication(app4.getId());
        agreement4.setFacultyValidator(facultyUser2);
        agreement4.setStatus(InternshipAgreementStatus.PENDING_ADMIN_APPROVAL); // Simulate faculty validation
        agreement4.setFacultyValidationDate(LocalDateTime.now().minusDays(1));
        agreement4.setSignedByStudent(true);
        agreement4.setSignedByCompany(true);
        agreement4.setSignedByFaculty(false);
        agreement4.setStudentSignatureDate(LocalDateTime.now().minusDays(2));
        agreement4.setCompanySignatureDate(LocalDateTime.now().minusDays(1));
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

    private User createStudentUser(String firstName, String lastName, String email, String password, School school, Faculty faculty) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.STUDENT);
        user.setEnabled(true);
        user.setSchool(school);
        user.setFaculty(faculty);
        return user;
    }

    private User createFacultyUser(String firstName, String lastName, String email, String password, School school, Faculty faculty) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.FACULTY);
        user.setEnabled(true);
        user.setSchool(school);
        user.setFaculty(faculty);
        return user;
    }

    private School createSchool(String name, String description) {
        School school = new School();
        school.setName(name);
        school.setDescription(description);
        return school;
    }

    private Faculty createFaculty(String name, School school) {
        Faculty faculty = new Faculty();
        faculty.setName(name);
        faculty.setSchool(school);
        return faculty;
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
    
    private void fixFacultyAssignments() {
        log.info("Fixing faculty assignments for existing users...");
        
        // Find Alice and assign her to informatique faculty
        userRepository.findByEmail("alice.prof@university.edu").ifPresent(alice -> {
            if (alice.getFaculty() == null) {
                facultyRepository.findByName("Informatique").ifPresent(informatique -> {
                    alice.setFaculty(informatique);
                    userRepository.save(alice);
                    log.info("Assigned Alice to Informatique faculty");
                });
            } else {
                log.info("Alice already has faculty: {}", alice.getFaculty().getName());
            }
        });
        
        // Find John Doe and assign him to informatique faculty
        userRepository.findByEmail("john.doe@student.com").ifPresent(john -> {
            if (john.getFaculty() == null) {
                facultyRepository.findByName("Informatique").ifPresent(informatique -> {
                    john.setFaculty(informatique);
                    userRepository.save(john);
                    log.info("Assigned John Doe to Informatique faculty");
                });
            } else {
                log.info("John Doe already has faculty: {}", john.getFaculty().getName());
            }
        });
    }
}