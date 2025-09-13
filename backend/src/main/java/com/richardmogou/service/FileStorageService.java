package com.richardmogou.service;

import com.richardmogou.exception.FileStorageException;
import com.richardmogou.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);
    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        log.info("File storage location initialized at: {}", this.fileStorageLocation);
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("Created file storage directory: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create the directory where the uploaded files will be stored.", ex);
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Stores the uploaded file and returns a unique filename.
     *
     * @param file The uploaded file.
     * @return The unique filename (including extension) under which the file is stored.
     */
    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        log.debug("Storing file with original name: {}", originalFilename);

        try {
            // Check for invalid characters
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }

            // Generate unique filename to prevent collisions and keep extension
            String fileExtension = "";
            int lastDot = originalFilename.lastIndexOf('.');
            if (lastDot > 0) {
                fileExtension = originalFilename.substring(lastDot); // includes the dot
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);
            log.debug("Target storage path: {}", targetLocation);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            log.info("Successfully stored file: {}", uniqueFilename);
            // Return only the filename, the service/controller will know the base path
            return uniqueFilename;

        } catch (IOException ex) {
            log.error("Could not store file {}. Please try again!", originalFilename, ex);
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    /**
     * Loads a file as a Resource.
     *
     * @param filename The name of the file to load.
     * @return The file as a Resource.
     */
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                log.error("File not found: {}", filename);
                throw new ResourceNotFoundException("File", "filename", filename);
            }
        } catch (MalformedURLException ex) {
            log.error("File not found (Malformed URL): {}", filename, ex);
            throw new ResourceNotFoundException("File", "filename", filename);
        }
    }

    /**
     * Deletes a file from the storage directory.
     *
     * @param filename The name of the file to delete.
     * @return true if deletion was successful, false otherwise.
     */
    public boolean deleteFile(String filename) {
         try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
             log.debug("Attempting to delete file: {}", filePath);
            boolean deleted = Files.deleteIfExists(filePath);
             if (deleted) {
                 log.info("Successfully deleted file: {}", filename);
             } else {
                 log.warn("File not found for deletion or already deleted: {}", filename);
             }
             return deleted;
        } catch (IOException ex) {
            log.error("Could not delete file {}. Please try again!", filename, ex);
            // Depending on requirements, you might re-throw or just return false
            // throw new FileStorageException("Could not delete file " + filename + ". Please try again!", ex);
             return false;
        }
    }
}