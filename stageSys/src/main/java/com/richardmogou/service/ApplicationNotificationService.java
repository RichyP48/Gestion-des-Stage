package com.richardmogou.service;

import com.richardmogou.entity.Application;
import com.richardmogou.entity.User;
import com.richardmogou.entity.enums.ApplicationStatus;
import com.richardmogou.entity.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationNotificationService {

    private final NotificationService notificationService;

    public void notifyApplicationStatusChange(Application application, ApplicationStatus oldStatus, ApplicationStatus newStatus) {
        User student = application.getStudent();
        String offerTitle = application.getInternshipOffer().getTitle();
        String companyName = application.getInternshipOffer().getCompany().getName();

        switch (newStatus) {
            case ACCEPTED:
                notificationService.createNotification(
                    student,
                    NotificationType.APPLICATION_UPDATE,
                    String.format("Votre candidature pour le poste '%s' chez %s a été acceptée !", offerTitle, companyName),
                    "/student/applications"
                );
                break;
                
            case REJECTED:
                notificationService.createNotification(
                    student,
                    NotificationType.APPLICATION_UPDATE,
                    String.format("Votre candidature pour le poste '%s' chez %s a été rejetée.", offerTitle, companyName),
                    "/student/applications"
                );
                break;
                
            case VIEWED:
                notificationService.createNotification(
                    student,
                    NotificationType.APPLICATION_UPDATE,
                    String.format("Votre candidature pour le poste '%s' chez %s est en cours d'examen.", offerTitle, companyName),
                    "/student/applications"
                );
                break;
                
            default:
                log.debug("No notification needed for status change to: {}", newStatus);
        }
        
        log.info("Application status notification sent to student {} for application {}", student.getEmail(), application.getId());
    }

    public void notifyNewApplication(Application application) {
        // Notify company about new application
        User companyUser = application.getInternshipOffer().getCompany().getPrimaryContactUser();
        if (companyUser != null) {
            notificationService.createNotification(
                companyUser,
                NotificationType.NEW_APPLICATION,
                String.format("Nouvelle candidature reçue pour l'offre '%s' de %s %s", 
                    application.getInternshipOffer().getTitle(),
                    application.getStudent().getFirstName(),
                    application.getStudent().getLastName()),
                "/company/applications"
            );
            log.info("New application notification sent to company user {}", companyUser.getEmail());
        }
    }
}