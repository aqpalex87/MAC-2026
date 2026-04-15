import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { finalize, timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { EmpresaAuth } from 'src/app/models/empresa-sede.interface';
import { UniversidadCrud, UniversidadDetalleCrud } from 'src/app/models/universidad-crud.interface';
import { SecurityService } from 'src/app/services/security.service';
import { UniversidadAdminService } from 'src/app/services/universidad-admin.service';

@Component({
  selector: 'app-universidad',
  templateUrl: './universidad.component.html',
  styleUrls: ['./universidad.component.css'],
})
export class UniversidadComponent implements OnInit {
  universidades: UniversidadCrud[] = [];
  detallesPorUniversidad: { [idUniversidad: number]: UniversidadDetalleCrud[] } = {};
  expandedRows: { [key: string]: boolean } = {};

  totalRows = 0;
  rows = 10;
  loading = false;
  busqueda = '';

  modalVisible = false;
  editando = false;
  idEditando = 0;

  idEmpresaSesion = 0;
  empresaNombre = '';
  empresas: EmpresaAuth[] = [];
  idEmpresaFiltro: number | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private universidadService: UniversidadAdminService,
    private securityService: SecurityService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      idEmpresa: [null, [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      detalles: this.fb.array([])
    });
  }

  get detallesFormArray(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  ngOnInit(): void {
    this.idEmpresaSesion = Number(this.securityService.leerIdEmpresa() || 0);
    this.empresaNombre = this.securityService.leerEmpresa() || '-';
    this.cargarEmpresas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    const first = event.first ?? 0;
    const pageSize = event.rows ?? this.rows;
    const pageNumber = Math.floor(first / pageSize) + 1;
    this.rows = pageSize;
    this.cargarUniversidades(pageNumber, pageSize);
  }

  buscar(): void {
    this.cargarUniversidades(1, this.rows);
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.cargarUniversidades(1, this.rows);
  }

  abrirNuevo(): void {
    this.editando = false;
    this.idEditando = 0;
    this.form.reset({
      idEmpresa: this.idEmpresaFiltro || this.idEmpresaSesion || null,
      nombre: ''
    });
    this.detallesFormArray.clear();
    this.agregarDetalle();
    this.modalVisible = true;
  }

  editar(item: UniversidadCrud): void {
    this.editando = true;
    this.idEditando = item.idUniversidad;
    this.form.patchValue({
      idEmpresa: item.idEmpresa,
      nombre: item.nombre
    });
    this.detallesFormArray.clear();
    this.universidadService.obtenerDetalle(item.idUniversidad).pipe(timeout(15000)).subscribe({
      next: (detalles) => {
        (detalles ?? []).forEach(d => this.agregarDetalle(d));
        if (this.detallesFormArray.length === 0) {
          this.agregarDetalle();
        }
        this.modalVisible = true;
      },
      error: () => {
        this.toastr.error('No se pudo cargar el detalle de la universidad.');
      }
    });
  }

  agregarDetalle(detalle?: UniversidadDetalleCrud): void {
    this.detallesFormArray.push(this.fb.group({
      carreraNombre: [detalle?.carreraNombre ?? '', [Validators.required, Validators.maxLength(150)]],
      puntajeMinimo: [detalle?.puntajeMinimo ?? null],
      puntajeMaximo: [detalle?.puntajeMaximo ?? null],
      anio: [detalle?.anio ?? null]
    }));
  }

  quitarDetalle(index: number): void {
    if (this.detallesFormArray.length <= 1) {
      return;
    }
    this.detallesFormArray.removeAt(index);
  }

  guardar(): void {
    if (this.form.invalid || this.detallesFormArray.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const detalles: UniversidadDetalleCrud[] = this.detallesFormArray.controls.map((c) => ({
      idDetalle: 0,
      idUniversidad: this.idEditando,
      carreraNombre: (c.value.carreraNombre ?? '').trim(),
      puntajeMinimo: c.value.puntajeMinimo === null || c.value.puntajeMinimo === '' ? null : Number(c.value.puntajeMinimo),
      puntajeMaximo: c.value.puntajeMaximo === null || c.value.puntajeMaximo === '' ? null : Number(c.value.puntajeMaximo),
      anio: c.value.anio === null || c.value.anio === '' ? null : Number(c.value.anio)
    }));

    const data: UniversidadCrud = {
      idUniversidad: this.idEditando,
      idEmpresa: Number(this.form.value.idEmpresa),
      nombre: (this.form.value.nombre ?? '').trim(),
      detalles
    };

    if (this.editando) {
      this.universidadService.actualizar(this.idEditando, data).subscribe({
        next: () => {
          this.toastr.success('Universidad actualizada correctamente.');
          this.modalVisible = false;
          this.cargarUniversidades(1, this.rows);
        },
        error: () => this.toastr.error('No se pudo actualizar la universidad.'),
      });
      return;
    }

    this.universidadService.crear(data).subscribe({
      next: () => {
        this.toastr.success('Universidad registrada correctamente.');
        this.modalVisible = false;
        this.cargarUniversidades(1, this.rows);
      },
      error: () => this.toastr.error('No se pudo registrar la universidad.'),
    });
  }

  eliminar(item: UniversidadCrud): void {
    void Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Desea eliminar la universidad "${item.nombre}" y su detalle?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
      focusCancel: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.universidadService.eliminar(item.idUniversidad).subscribe({
        next: () => {
          this.toastr.success('Universidad eliminada correctamente.');
          this.cargarUniversidades(1, this.rows);
        },
        error: () => this.toastr.error('No se pudo eliminar la universidad.'),
      });
    });
  }

  onRowExpand(event: any): void {
    const idUniversidad = event?.data?.idUniversidad;
    if (!idUniversidad || this.detallesPorUniversidad[idUniversidad]) {
      return;
    }
    this.universidadService.obtenerDetalle(idUniversidad).pipe(timeout(15000)).subscribe({
      next: (detalles) => {
        this.detallesPorUniversidad[idUniversidad] = detalles ?? [];
      },
      error: () => this.toastr.error('No se pudo cargar el detalle de carreras.')
    });
  }

  private cargarUniversidades(pageNumber: number, pageSize: number): void {
    this.loading = true;
    this.universidadService.obtenerPaginado(this.idEmpresaFiltro, this.busqueda, pageNumber, pageSize)
      .pipe(
        timeout(15000),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.universidades = response?.items ?? [];
          this.totalRows = response?.totalRows ?? 0;
        },
        error: () => this.toastr.error('No se pudo obtener el listado de universidades.'),
      });
  }

  private cargarEmpresas(): void {
    this.securityService.obtenerEmpresasApi().pipe(timeout(15000)).subscribe({
      next: (res: any) => {
        const source = res?.response?.response ?? res?.response ?? [];
        this.empresas = (Array.isArray(source) ? source : []).map((x: any) => ({
          idEmpresa: Number(x?.idEmpresa ?? x?.IdEmpresa ?? 0),
          nombre: (x?.nombre ?? x?.Nombre ?? '').toString()
        })).filter((x: EmpresaAuth) => x.idEmpresa > 0);
        if (this.idEmpresaSesion > 0 && this.empresas.some(x => x.idEmpresa === this.idEmpresaSesion)) {
          this.idEmpresaFiltro = this.idEmpresaSesion;
        }
        this.cargarUniversidades(1, this.rows);
      },
      error: () => this.toastr.error('No se pudo obtener la lista de empresas.')
    });
  }
}
