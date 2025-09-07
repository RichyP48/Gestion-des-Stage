export interface DashboardStats {
  totalOffers: number;
  activeOffers: number;
  totalApplications: number;
  pendingApplications: number;
  totalCompanies: number;
  totalStudents: number;
  applicationsByStatus: { status: string; count: number }[];
  offersByDomain: { domain: string; count: number }[];
  applicationsByMonth: { month: string; count: number }[];
  lastUpdated: string;
}

export interface StudentStats {
  studentId: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  averageApplicationScore?: number;
  applicationTimeline: { date: string; count: number }[];
}

export interface CompanyStats {
  companyId: number;
  companyName: string;
  totalOffers: number;
  activeOffers: number;
  totalApplications: number;
  applicationsByStatus: { status: string; count: number }[];
  offerPerformance: { offerId: number; title: string; applications: number }[];
  lastUpdated: string;
}
