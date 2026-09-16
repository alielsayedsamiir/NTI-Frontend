import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  userRole: string = 'student';
  private apiUrl = 'http://localhost:5000/api/v1/courses';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || 'student';
    this.loadCourses();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  loadCourses(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error('Error fetching courses from database:', err);
      }
    });
  }

  onLogout(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  async onAddUser(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Add New System User',
      html:
        '<input id="swal-username" class="swal2-input" placeholder="Username / Name">' +
        '<input id="swal-email" class="swal2-input" placeholder="Email">' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Password">' +
        '<select id="swal-role" class="swal2-input">' +
          '<option value="student">Student</option>' +
          '<option value="admin">Admin</option>' +
        '</select>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create User',
      preConfirm: () => {
        const name = (document.getElementById('swal-username') as HTMLInputElement).value;
        const email = (document.getElementById('swal-email') as HTMLInputElement).value;
        const password = (document.getElementById('swal-password') as HTMLInputElement).value;
        const role = (document.getElementById('swal-role') as HTMLSelectElement).value;

        if (!name || !email || !password) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }
        return { name, email, password, role };
      }
    });

    if (formValues) {
      const existingUsers = JSON.parse(localStorage.getItem('system_users') || '[]');
      existingUsers.push(formValues);
      localStorage.setItem('system_users', JSON.stringify(existingUsers));

      Swal.fire({
        icon: 'success',
        title: 'User Created Successfully!',
        text: `User ${formValues.name} (${formValues.role}) has been added to the system.`,
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  async onAddCourse(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Course',
      html:
        '<input id="swal-title" class="swal2-input" placeholder="Course Title">' +
        '<textarea id="swal-desc" class="swal2-textarea" placeholder="Course Description"></textarea>' +
        '<input id="swal-instructor" class="swal2-input" placeholder="Instructor Name">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Course',
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        const instructor = (document.getElementById('swal-instructor') as HTMLInputElement).value;

        if (!title || !description || !instructor) {
          Swal.showValidationMessage('Please fill all required fields');
          return false;
        }
        return { title, description, instructor };
      }
    });

    if (formValues) {
      this.http.post(this.apiUrl, formValues, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Saved to Database!', timer: 1500, showConfirmButton: false });
          this.loadCourses();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Add failed', text: err.message });
        }
      });
    }
  }

  async onEditCourse(course: any): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Course',
      html:
        `<input id="swal-title" class="swal2-input" placeholder="Course Title" value="${course.title}">` +
        `<textarea id="swal-desc" class="swal2-textarea" placeholder="Course Description">${course.description || ''}</textarea>` +
        `<input id="swal-instructor" class="swal2-input" placeholder="Instructor Name" value="${course.instructor || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        const instructor = (document.getElementById('swal-instructor') as HTMLInputElement).value;

        if (!title) {
          Swal.showValidationMessage('Title is required');
          return false;
        }
        return { title, description, instructor };
      }
    });

    if (formValues) {
      this.http.put(this.apiUrl + '/' + course._id, formValues, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Updated successfully!', timer: 1500, showConfirmButton: false });
          this.loadCourses();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Update failed', text: err.message });
        }
      });
    }
  }

  onDeleteCourse(course: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${course.title}" permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(this.apiUrl + '/' + course._id, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
            this.loadCourses();
          },
          error: (err) => {
            Swal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
          }
        });
      }
    });
  }

  onViewCourse(course: any): void {
    Swal.fire({
      title: `<span class="fw-bold">${course.title}</span>`,
      html: `
        <div class="text-start mt-3 fs-6">
          <p><strong>Description:</strong></p>
          <p class="text-muted bg-light p-3 rounded-3">${course.description || 'No description available.'}</p>
          <hr>
          <p><strong>Instructor:</strong> ${course.instructor || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }
}