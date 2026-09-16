import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/v1/courses';

  // جلب جميع الكورسات
  getAllCourses(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // إضافة كورس جديد (Admin)
  createCourse(courseData: any): Observable<any> {
    return this.http.post(this.baseUrl, courseData);
  }

  // الاشتراك في كورس (Student)
  enrollCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${courseId}/enroll`, {});
  }

  // جلب كورسات الطالب المسجل فيها
  getMyCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-courses`);
  }

  // حذف كورس (Admin)
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${courseId}`);
  }
}