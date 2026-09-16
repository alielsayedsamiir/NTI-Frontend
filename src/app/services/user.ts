import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CourseInterface } from '../interface/course-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api/v1/users/courses';

  getUserCourses(): Observable<CourseInterface[]> {
    return this.http.get<any>(this.baseUrl).pipe(map((res) => res.data.myCourses));
  }

  addCourseToUser(courseId: string): Observable<CourseInterface[]> {
    return this.http.post<any>(this.baseUrl, { courseId }).pipe(map((res) => res.data.myCourses));
  }
}