import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, ApiObject } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{

  items: ApiObject[] = [];        // like useState([])
  selectedItem: ApiObject | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {                    // like useEffect(() => {}, [])
    this.apiService.getAll().subscribe({
      next: (res) => this.items = res,
      error: (err) => console.error(err)
    });
  }

  onCreate(formValue: any) {
    const payload: ApiObject = {
      name: formValue.name,
      data: {
        age: formValue.age,
        email: formValue.email
      }
    };
    this.apiService.create(payload).subscribe({
      next: (res) => {
        console.log('Created:', res);
        this.ngOnInit(); // Refresh the list
        alert('Created successfully!');
      },
      error: (err) => console.error('Error creating:', err)
    });
  }

  onUpdate(id: string, formValue: any) {
    const payload: Partial<ApiObject> = {
      name: formValue.name,
      data: {
        age: formValue.age,
        email: formValue.email
      }
    };
    this.apiService.partialUpdate(id, payload).subscribe({
      next: (res) => {
        console.log('Updated:', res);
        alert('Updated successfully!');
      },
      error: (err) => console.error('Error updating:', err)
    });
  }

  onDelete(id: string) {
    this.apiService.delete(id).subscribe({
      next: () => this.items = this.items.filter(item => item.id !== id),
      error: (err) => console.error(err)
    });
  }
}
