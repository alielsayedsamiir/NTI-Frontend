import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  private coursesService = inject(CoursesService);

  courses: any[] = [];
  newCourse = { title: '', description: '', instructor: '' };

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.coursesService.getAllCourses().subscribe({
      next: (res: any) => this.courses = res.data || res,
      error: (err) => console.error(err)
    });
  }

  addCourse() {
    this.coursesService.createCourse(this.newCourse).subscribe({
      next: () => {
        this.newCourse = { title: '', description: '', instructor: '' };
        this.loadCourses();
      }
    });
  }

  deleteCourse(id: string) {
    this.coursesService.deleteCourse(id).subscribe({
      next: () => this.loadCourses()
    });
  }
}