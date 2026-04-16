import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { finalize, timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CicloCrud } from 'src/app/models/ciclo-crud.interface';
import { EmpresaAuth } from 'src/app/models/empresa-sede.interface';
import { SedeCrud } from 'src/app/models/sede-crud.interface';
import { CicloAdminService } from 'src/app/services/ciclo-admin.service';
import { SedeAdminService } from 'src/app/services/sede-admin.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-ciclo',
  templateUrl: './ciclo.component.html',
  styleUrls: ['./ciclo.component.css'],
})
export class CicloComponent implements OnInit {
  ciclos: CicloCrud[] = [];
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
  sedesFiltro: SedeCrud[] = [];
  idSedeFiltro: number | null = null;

  sedesModal: SedeCrud[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cicloService: CicloAdminService,
    private sedeService: SedeAdminService,
    private securityService: SecurityService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      idEmpresaModal: [null as number | null, [Validators.required]],
      idSede: [null as number | null, [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      fechaInicio: [null as string | null],
      fechaFin: [null as string | null],
      activo: [true],
    });
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
    this.cargarCiclos(pageNumber, pageSize);
  }

  buscar(): void {
    this.cargarCiclos(1, this.rows);
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.cargarCiclos(1, this.rows);
  }

  onCambioEmpresaFiltro(): void {
    this.idSedeFiltro = null;
    this.refrescarSedesFiltro();
    this.buscar();
  }

  onCambioEmpresaModal(): void {
    const id = Number(this.form.value.idEmpresaModal);
    this.form.patchValue({ idSede: null });
    if (id > 0) {
      this.sedeService.obtenerPorEmpresa(id).pipe(timeout(15000)).subscribe({
        next: (list) => {
          this.sedesModal = Array.isArray(list) ? list : [];
        },
        error: () => {
          this.sedesModal = [];
          this.toastr.error('No se pudo cargar el listado de sedes.');
        },
      });
    } else {
      this.sedesModal = [];
    }
  }

  abrirNuevo(): void {
    this.editando = false;
    this.idEditando = 0;
    const emp = this.idEmpresaFiltro || this.idEmpresaSesion || null;
    this.form.reset({
      idEmpresaModal: emp,
      idSede: null,
      nombre: '',
      fechaInicio: null,
      fechaFin: null,
      activo: true,
    });
    this.sedesModal = [];
    this.modalVisible = true;
    if (emp && emp > 0) {
      this.onCambioEmpresaModal();
    }
  }

  editar(item: CicloCrud): void {
    this.editando = true;
    this.idEditando = item.idCiclo;
    const emp = (item.idEmpresa ?? this.idEmpresaFiltro ?? this.idEmpresaSesion) || null;
    this.form.patchValue({
      idEmpresaModal: emp,
      idSede: item.idSede,
      nombre: item.nombre,
      fechaInicio: this.toDateInput(item.fechaInicio),
      fechaFin: this.toDateInput(item.fechaFin),
      activo: !!item.activo,
    });
    this.modalVisible = true;
    if (emp && emp > 0) {
      this.sedeService.obtenerPorEmpresa(emp).pipe(timeout(15000)).subscribe({
        next: (list) => {
          this.sedesModal = Array.isArray(list) ? list : [];
        },
        error: () => {
          this.sedesModal = [];
          this.toastr.error('No se pudo cargar el listado de sedes.');
        },
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fi = this.form.value.fechaInicio;
    const ff = this.form.value.fechaFin;
    const data: CicloCrud = {
      idCiclo: this.idEditando,
      nombre: (this.form.value.nombre ?? '').trim(),
      fechaInicio: fi ? `${fi}T00:00:00` : null,
      fechaFin: ff ? `${ff}T00:00:00` : null,
      activo: !!this.form.value.activo,
      idSede: Number(this.form.value.idSede),
    };

    if (this.editando) {
      this.cicloService.actualizar(this.idEditando, data).subscribe({
        next: () => {
          this.toastr.success('Ciclo actualizado correctamente.');
          this.modalVisible = false;
          this.cargarCiclos(1, this.rows);
        },
        error: () => this.toastr.error('No se pudo actualizar el ciclo.'),
      });
      return;
    }

    this.cicloService.crear(data).subscribe({
      next: () => {
        this.toastr.success('Ciclo registrado correctamente.');
        this.modalVisible = false;
        this.cargarCiclos(1, this.rows);
      },
      error: () => this.toastr.error('No se pudo registrar el ciclo.'),
    });
  }

  eliminar(item: CicloCrud): void {
    void Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Desea eliminar el ciclo "${item.nombre}"?`,
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

      this.cicloService.eliminar(item.idCiclo).subscribe({
        next: () => {
          this.toastr.success('Ciclo eliminado correctamente.');
          this.cargarCiclos(1, this.rows);
        },
        error: () => this.toastr.error('No se pudo eliminar el ciclo.'),
      });
    });
  }

  private toDateInput(iso: string | null | undefined): string | null {
    if (!iso) {
      return null;
    }
    const s = String(iso);
    return s.length >= 10 ? s.substring(0, 10) : null;
  }

  private cargarCiclos(pageNumber: number, pageSize: number): void {
    this.loading = true;
    this.cicloService
      .obtenerPaginado(this.idEmpresaFiltro, this.idSedeFiltro, this.busqueda, pageNumber, pageSize)
      .pipe(
        timeout(15000),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.ciclos = response?.items ?? [];
          this.totalRows = response?.totalRows ?? 0;
        },
        error: () => this.toastr.error('No se pudo obtener el listado de ciclos.'),
      });
  }

  private refrescarSedesFiltro(): void {
    if (this.idEmpresaFiltro && this.idEmpresaFiltro > 0) {
      this.sedeService.obtenerPorEmpresa(this.idEmpresaFiltro).pipe(timeout(15000)).subscribe({
        next: (list) => {
          this.sedesFiltro = Array.isArray(list) ? list : [];
        },
        error: () => {
          this.sedesFiltro = [];
        },
      });
    } else {
      this.sedesFiltro = [];
    }
  }

  private cargarEmpresas(): void {
    this.securityService.obtenerEmpresasApi().pipe(timeout(15000)).subscribe({
      next: (res: any) => {
        const source = res?.response?.response ?? res?.response ?? [];
        this.empresas = (Array.isArray(source) ? source : []).map((x: any) => ({
          idEmpresa: Number(x?.idEmpresa ?? x?.IdEmpresa ?? 0),
          nombre: (x?.nombre ?? x?.Nombre ?? '').toString(),
        })).filter((x: EmpresaAuth) => x.idEmpresa > 0);
        if (this.idEmpresaSesion > 0 && this.empresas.some((x) => x.idEmpresa === this.idEmpresaSesion)) {
          this.idEmpresaFiltro = this.idEmpresaSesion;
        }
        this.refrescarSedesFiltro();
        this.cargarCiclos(1, this.rows);
      },
      error: () => {
        this.toastr.error('No se pudo obtener la lista de empresas.');
      },
    });
  }
}
