import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-user-detail.component.html',
  styleUrl: './admin-user-detail.component.css'
})
export class AdminUserDetailComponent implements OnInit {
  userId: string | null = null;
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
  }
}

