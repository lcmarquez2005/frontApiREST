import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, ApiObject } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  items: ApiObject[] = [];

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit() {
    this.apiService.getAll().subscribe({
      next: (res) => this.items = res,
      error: (err) => console.error(err)
    });
  }

  copyId(id: string | undefined) {
    if (!id || !isPlatformBrowser(this.platformId)) return;
    navigator.clipboard.writeText(id).then(() => {
      alert('📋 ID copiado: ' + id);
    });
  }

  // ── PUT: reemplaza el objeto completo ──────────────────────────────────────
  onPut(id: string, formValue: any) {
    if (!id) return;
    const payload: ApiObject = {
      name: formValue.name,
      data: { age: formValue.age, email: formValue.email }
    };
    this.apiService.update(id, payload).subscribe({
      next: (res) => { console.log('PUT:', res); this.ngOnInit(); alert('✅ Registro reemplazado'); },
      error: (err) => console.error('Error PUT:', err)
    });
  }

  // ── PATCH: solo campos que el usuario llenó ────────────────────────────────
  onPatch(id: string, formValue: any) {
    if (!id) return;
    const payload: Partial<ApiObject> = {};
    if (formValue.name?.trim()) payload.name = formValue.name.trim();

    const dataPayload: any = {};
    if (formValue.email?.trim()) dataPayload.email = formValue.email.trim();
    if (formValue.age != null && formValue.age !== '') dataPayload.age = Number(formValue.age);

    if (Object.keys(dataPayload).length > 0) {
      const existing = this.items.find(i => i.id === id);
      payload.data = { ...existing?.data, ...dataPayload };
    }

    if (Object.keys(payload).length === 0) {
      alert('⚠ Ingresa al menos un campo para actualizar'); return;
    }

    this.apiService.partialUpdate(id, payload).subscribe({
      next: (res) => {
        const idx = this.items.findIndex(i => i.id === id);
        if (idx !== -1) this.items[idx] = res;
        alert('✅ Registro actualizado parcialmente');
      },
      error: (err) => console.error('Error PATCH:', err)
    });
  }

  onCreate(formValue: any) {
    const payload: ApiObject = {
      name: formValue.name,
      data: { age: formValue.age, email: formValue.email }
    };
    this.apiService.create(payload).subscribe({
      next: (res) => { console.log('Created:', res); this.ngOnInit(); alert('✅ Registro creado'); },
      error: (err) => console.error('Error creating:', err)
    });
  }

  onDelete(id: string) {
    if (!id) return;
    if (!confirm(`¿Eliminar el registro ${id}?`)) return;
    this.apiService.delete(id).subscribe({
      next: () => { this.items = this.items.filter(item => item.id !== id); alert('🗑 Eliminado'); },
      error: (err) => console.error('Error deleting:', err)
    });
  }
}