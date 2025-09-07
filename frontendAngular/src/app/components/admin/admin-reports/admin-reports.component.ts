import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { AdminReportsService, AdminReportData } from '../../../services/admin-reports.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  reportData: AdminReportData | null = null
  selectedPeriod = "month"
  loading = true

  constructor(
    private adminReportsService: AdminReportsService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadReports()
  }

  loadReports() {
    this.loading = true

    this.adminReportsService.getReports(this.selectedPeriod).subscribe({
      next: (data) => {
        this.reportData = data
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading reports:", error)
        this.notificationService.showError("Erreur lors du chargement des rapports")
        this.loading = false
        this.reportData = this.getMockData()
      },
    })
  }

  exportReport() {
    this.adminReportsService.exportReport(this.selectedPeriod).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `rapport-admin-${this.selectedPeriod}-${new Date().toISOString().split("T")[0]}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
        this.notificationService.showSuccess("Rapport exporté avec succès")
      },
      error: (error) => {
        console.error("Error exporting report:", error)
        this.notificationService.showError("Erreur lors de l'export")
      },
    })
  }

  getPerformanceLabel(rating: number): string {
    if (rating >= 4.5) return "Excellent"
    if (rating >= 4) return "Très bien"
    if (rating >= 3.5) return "Bien"
    if (rating >= 3) return "Correct"
    return "À améliorer"
  }

  private getMockData(): AdminReportData {
    return {
      systemStats: {
        totalUsers: 456,
        totalStudents: 245,
        totalCompanies: 67,
        totalFaculty: 23,
        totalOffers: 189,
        totalApplications: 567,
        totalAgreements: 234,
      },
      userActivity: {
        dailyLogins: 89,
        weeklyLogins: 234,
        monthlyLogins: 1245,
      },
      platformUsage: [
        { month: "Janvier", users: 234, offers: 45, applications: 123 },
        { month: "Février", users: 267, offers: 52, applications: 145 },
        { month: "Mars", users: 289, offers: 48, applications: 167 },
        { month: "Avril", users: 312, offers: 61, applications: 189 },
        { month: "Mai", users: 345, offers: 58, applications: 201 },
      ],
      topCompanies: [
        { name: "TechCorp Solutions", offers: 25, applications: 89, rating: 4.8 },
        { name: "InnovateLab", offers: 18, applications: 67, rating: 4.6 },
        { name: "DataSolutions Inc", offers: 15, applications: 54, rating: 4.4 },
        { name: "WebAgency Pro", offers: 12, applications: 43, rating: 4.2 },
        { name: "StartupXYZ", offers: 10, applications: 38, rating: 4.0 },
      ],
      systemHealth: {
        uptime: 99.8,
        responseTime: 245,
        errorRate: 0.2,
        storage: 67,
      },
    }
  }
}
