import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { finalize, timeout } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import {
  AsistenciaListadoItem,
  AsistenciaRegistroManualRequest,
} from 'src/app/models/asistencia.interface';
import { ParametroListaItem } from 'src/app/models/alumno-crud.interface';
import { AsistenciaAdminService } from 'src/app/services/asistencia-admin.service';
import { ParametrosCatalogoService } from 'src/app/services/parametros-catalogo.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css'],
})
export class AsistenciaComponent implements OnInit {
  asistencias: AsistenciaListadoItem[] = [];
  totalRows = 0;
  rows = 20;
  loading = false;

  dniFiltro = '';
  fechaInicioFiltro: string | null = null;
  fechaFinFiltro: string | null = null;
  idParamEventoFiltro: number | null = null;

  empresaNombre = '';
  sedeNombre = '';
  eventos: ParametroListaItem[] = [];

  modalManualVisible = false;
  formManual: FormGroup;

  constructor(
    private fb: FormBuilder,
    private asistenciaService: AsistenciaAdminService,
    private parametrosCatalogoService: ParametrosCatalogoService,
    private securityService: SecurityService,
    private toastr: ToastrService
  ) {
    this.formManual = this.fb.group({
      dni: ['', [Validators.required, Validators.maxLength(15)]],
      idParamEvento: [null as number | null, [Validators.required]],
      observacion: ['', [Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.empresaNombre = this.securityService.leerEmpresa() || '-';
    this.sedeNombre = this.securityService.leerSede() || '-';
    this.cargarEventos();
    this.cargarListado(1, this.rows);
  }

  onLazyLoad(event: LazyLoadEvent): void {
    const first = event.first ?? 0;
    const pageSize = event.rows ?? this.rows;
    const pageNumber = Math.floor(first / pageSize) + 1;
    this.rows = pageSize;
    this.cargarListado(pageNumber, pageSize);
  }

  buscar(): void {
    this.cargarListado(1, this.rows);
  }

  limpiarFiltros(): void {
    this.dniFiltro = '';
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.idParamEventoFiltro = null;
    this.cargarListado(1, this.rows);
  }

  abrirManual(): void {
    this.modalManualVisible = true;
    this.formManual.reset({
      dni: '',
      idParamEvento: null,
      observacion: '',
    });
  }

  guardarManual(): void {
    if (this.formManual.invalid) {
      this.formManual.markAllAsTouched();
      return;
    }
    const payload: AsistenciaRegistroManualRequest = {
      dni: (this.formManual.value.dni ?? '').toString().trim(),
      idParamEvento: Number(this.formManual.value.idParamEvento),
      observacion: (this.formManual.value.observacion ?? '').toString().trim() || null,
    };
    this.asistenciaService.registrarManual(payload).pipe(timeout(20000)).subscribe({
      next: () => {
        this.toastr.success('Asistencia registrada correctamente.');
        this.modalManualVisible = false;
        this.cargarListado(1, this.rows);
      },
      error: (err) => {
        const msg = err?.error?.error?.[0] || err?.error?.title || 'No se pudo registrar asistencia manual.';
        this.toastr.error(msg);
      },
    });
  }

  exportarTodo(): void {
    this.asistenciaService
      .obtenerParaExportar(
        this.dniFiltro,
        this.fechaInicioFiltro,
        this.fechaFinFiltro,
        this.idParamEventoFiltro
      )
      .pipe(timeout(30000))
      .subscribe({
        next: (rows) => {
          const data = (rows ?? []).map((r) => ({
            Evento: r.evento ?? '',
            Fecha: r.fecha ?? '',
            Hora: r.hora ?? '',
            Sede: r.sede ?? '',
            Ciclo: r.ciclo ?? '',
            DNI: r.dni ?? '',
            Apellidos: r.apellidos ?? '',
            Nombres: r.nombres ?? '',
            Observacion: r.observacion ?? '',
          }));

          const ws = XLSX.utils.json_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');

          const ab = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([ab], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `asistencias_${new Date().toISOString().slice(0, 10)}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => this.toastr.error('No se pudo exportar asistencias.'),
      });
  }

  private cargarListado(pageNumber: number, pageSize: number): void {
    this.loading = true;
    this.asistenciaService
      .obtenerPaginado(
        this.dniFiltro,
        this.fechaInicioFiltro,
        this.fechaFinFiltro,
        this.idParamEventoFiltro,
        pageNumber,
        pageSize
      )
      .pipe(
        timeout(25000),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (res) => {
          this.asistencias = res?.items ?? [];
          this.totalRows = res?.totalRows ?? 0;
        },
        error: () => this.toastr.error('No se pudo cargar listado de asistencias.'),
      });
  }

  private cargarEventos(): void {
    this.parametrosCatalogoService.obtenerPorTipo('ASISTENCIA').pipe(timeout(15000)).subscribe({
      next: (r) => (this.eventos = Array.isArray(r) ? r : []),
      error: () => this.toastr.warning('No se cargaron parámetros de asistencia.'),
    });
  }
}
