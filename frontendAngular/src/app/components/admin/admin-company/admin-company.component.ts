import { Component, OnInit } from '@angular/core';
import { Company } from '../../../models/company.model';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-company',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './admin-company.component.html',
  styleUrl: './admin-company.component.css'
})
export class AdminCompanyComponent implements OnInit {
    companies: Company[] = []
  filteredCompanies: Company[] = []
  selectedStatus = ""
  loading = true

  stats = {
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
  }

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadCompanies()
  }

  loadCompanies() {
    this.loading = true

    this.apiService.get<any>("/admin/companies?size=1000").subscribe({
      next: (response) => {
        this.companies = response.content || []
        this.filteredCompanies = this.companies
        this.calculateStats()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading companies:", error)
        this.notificationService.showError("Erreur lors du chargement des entreprises")
        this.loading = false
      },
    })
  }

  filterCompanies() {
    if (this.selectedStatus) {
      this.filteredCompanies = this.companies.filter((company) => company.status === this.selectedStatus)
    } else {
      this.filteredCompanies = this.companies
    }
  }

  calculateStats() {
    this.stats.total = this.companies.length
    this.stats.active = this.companies.filter((c) => c.status === "ACTIVE").length
    this.stats.pending = this.companies.filter((c) => c.status === "PENDING").length
    this.stats.suspended = this.companies.filter((c) => c.status === "SUSPENDED").length
  }

  approveCompany(companyId: number) {
    this.apiService.put(`/admin/companies/${companyId}/approve`, {}).subscribe({
      next: () => {
        const company = this.companies.find((c) => c.id === companyId)
        if (company) {
          company.status = "ACTIVE"
          this.calculateStats()
          this.filterCompanies()
        }
        this.notificationService.showSuccess("Entreprise approuvée avec succès")
      },
      error: (error) => {
        console.error("Error approving company:", error)
        this.notificationService.showError("Erreur lors de l'approbation")
      },
    })
  }

  suspendCompany(companyId: number) {
    this.apiService.put(`/admin/companies/${companyId}/suspend`, {}).subscribe({
      next: () => {
        const company = this.companies.find((c) => c.id === companyId)
        if (company) {
          company.status = "SUSPENDED"
          this.calculateStats()
          this.filterCompanies()
        }
        this.notificationService.showSuccess("Entreprise suspendue")
      },
      error: (error) => {
        console.error("Error suspending company:", error)
        this.notificationService.showError("Erreur lors de la suspension")
      },
    })
  }

  activateCompany(companyId: number) {
    this.apiService.put(`/admin/companies/${companyId}/activate`, {}).subscribe({
      next: () => {
        const company = this.companies.find((c) => c.id === companyId)
        if (company) {
          company.status = "ACTIVE"
          this.calculateStats()
          this.filterCompanies()
        }
        this.notificationService.showSuccess("Entreprise réactivée")
      },
      error: (error) => {
        console.error("Error activating company:", error)
        this.notificationService.showError("Erreur lors de la réactivation")
      },
    })
  }

  exportCompanies() {
    // this.apiService.get("/admin/companies/export", { responseType: "blob" }).subscribe({
    //   next: (blob) => {
    //     const url = window.URL.createObjectURL(blob)
    //     const a = document.createElement("a")
    //     a.href = url
    //     a.download = `entreprises-${new Date().toISOString().split("T")[0]}.xlsx`
    //     a.click()
    //     window.URL.revokeObjectURL(url)
    //     this.notificationService.showSuccess("Export réalisé avec succès")
    //   },
    //   error: (error) => {
    //     console.error("Error exporting companies:", error)
    //     this.notificationService.showError("Erreur lors de l'export")
    //   },
    // })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "SUSPENDED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "Active"
      case "PENDING":
        return "En attente"
      case "SUSPENDED":
        return "Suspendue"
      default:
        return status
    }
  }

  getCompanyInitials(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
}
