import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { finalize, timeout } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AlumnoCrud, ParametroListaItem } from 'src/app/models/alumno-crud.interface';
import { EmpresaAuth } from 'src/app/models/empresa-sede.interface';
import { SedeCrud } from 'src/app/models/sede-crud.interface';
import { UniversidadComboItem, UniversidadDetalleCrud } from 'src/app/models/universidad-crud.interface';
import { AlumnoAdminService } from 'src/app/services/alumno-admin.service';
import { ParametrosCatalogoService } from 'src/app/services/parametros-catalogo.service';
import { SedeAdminService } from 'src/app/services/sede-admin.service';
import { SecurityService } from 'src/app/services/security.service';
import { UniversidadAdminService } from 'src/app/services/universidad-admin.service';
import { CicloAdminService } from 'src/app/services/ciclo-admin.service';
import { CicloCrud } from 'src/app/models/ciclo-crud.interface';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css'],
})
export class AlumnoComponent implements OnInit {
  alumnos: AlumnoCrud[] = [];
  totalRows = 0;
  rows = 10;
  loading = false;
  filtro = '';

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
  ciclosModal: CicloCrud[] = [];
  universidadesModal: UniversidadComboItem[] = [];
  detallesCarrera: UniversidadDetalleCrud[] = [];
  sexos: ParametroListaItem[] = [];
  parentescos: ParametroListaItem[] = [];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoAdminService,
    private sedeService: SedeAdminService,
    private universidadService: UniversidadAdminService,
    private cicloAdminService: CicloAdminService,
    private parametrosCatalogo: ParametrosCatalogoService,
    private securityService: SecurityService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      dni: ['', [Validators.maxLength(15)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      nombres: ['', [Validators.required, Validators.maxLength(100)]],
      idParamSexo: [null as number | null],
      dia: [null as number | null],
      mes: [null as number | null],
      anio: [null as number | null],
      carreraPostula: ['', [Validators.maxLength(150)]],
      whatsApp: ['', [Validators.maxLength(15)]],
      ieProcedencia: ['', [Validators.maxLength(150)]],
      ieUbigeo: ['', [Validators.maxLength(20)]],
      idEmpresaModal: [null as number | null, [Validators.required]],
      idSede: [null as number | null, [Validators.required]],
      idCiclo: [null as number | null, [Validators.required]],
      idUniversidad: [null as number | null, [Validators.required]],
      idUniversidadDetalle: [null as number | null, [Validators.required]],
      apoderados: this.fb.array([]),
    });
  }

  get apoderadosFormArray(): FormArray {
    return this.form.get('apoderados') as FormArray;
  }

  ngOnInit(): void {
    this.idEmpresaSesion = Number(this.securityService.leerIdEmpresa() || 0);
    this.empresaNombre = this.securityService.leerEmpresa() || '-';
    this.parametrosCatalogo.obtenerPorTipo('SEXO').pipe(timeout(15000)).subscribe({
      next: (r) => (this.sexos = Array.isArray(r) ? r : []),
      error: () => this.toastr.warning('No se cargaron parámetros de sexo (tabla Parametro).'),
    });
    this.parametrosCatalogo.obtenerPorTipo('PARENTESCO').pipe(timeout(15000)).subscribe({
      next: (r) => (this.parentescos = Array.isArray(r) ? r : []),
      error: () => this.toastr.warning('No se cargaron parámetros de parentesco.'),
    });
    this.cargarEmpresas();
  }

  onLazyLoad(event: LazyLoadEvent): void {
    const first = event.first ?? 0;
    const pageSize = event.rows ?? this.rows;
    const pageNumber = Math.floor(first / pageSize) + 1;
    this.rows = pageSize;
    this.cargarAlumnos(pageNumber, pageSize);
  }

  buscar(): void {
    this.cargarAlumnos(1, this.rows);
  }

  limpiarFiltro(): void {
    this.filtro = '';
    this.cargarAlumnos(1, this.rows);
  }

  onCambioEmpresaFiltro(): void {
    this.idSedeFiltro = null;
    this.refrescarSedesFiltro();
    this.buscar();
  }

  onCambioEmpresaModal(): void {
    const emp = Number(this.form.value.idEmpresaModal);
    this.form.patchValue({
      idSede: null,
      idCiclo: null,
      idUniversidad: null,
      idUniversidadDetalle: null,
    });
    this.ciclosModal = [];
    this.detallesCarrera = [];
    if (emp > 0) {
      this.sedeService.obtenerPorEmpresa(emp).pipe(timeout(15000)).subscribe({
        next: (list) => (this.sedesModal = Array.isArray(list) ? list : []),
        error: () => {
          this.sedesModal = [];
          this.toastr.error('No se pudo cargar sedes.');
        },
      });
      this.universidadService.obtenerCombo(emp).pipe(timeout(15000)).subscribe({
        next: (list) => (this.universidadesModal = Array.isArray(list) ? list : []),
        error: () => {
          this.universidadesModal = [];
          this.toastr.error('No se pudo cargar universidades.');
        },
      });
    } else {
      this.sedesModal = [];
      this.universidadesModal = [];
    }
  }

  onCambioSedeModal(): void {
    const idSede = Number(this.form.value.idSede);
    const emp = Number(this.form.value.idEmpresaModal);
    this.form.patchValue({ idCiclo: null });
    if (idSede > 0 && emp > 0) {
      this.cicloAdminService.obtenerPaginado(emp, idSede, '', 1, 500).pipe(timeout(15000)).subscribe({
        next: (res) => (this.ciclosModal = res?.items ?? []),
        error: () => {
          this.ciclosModal = [];
          this.toastr.error('No se pudo cargar ciclos de la sede.');
        },
      });
    } else {
      this.ciclosModal = [];
    }
  }

  onCambioUniversidadModal(): void {
    const idU = Number(this.form.value.idUniversidad);
    this.form.patchValue({ idUniversidadDetalle: null, carreraPostula: '' });
    this.detallesCarrera = [];
    if (idU > 0) {
      this.universidadService.obtenerDetalle(idU).pipe(timeout(15000)).subscribe({
        next: (list) => (this.detallesCarrera = Array.isArray(list) ? list : []),
        error: () => {
          this.detallesCarrera = [];
          this.toastr.error('No se pudo cargar carreras de la universidad.');
        },
      });
    }
  }

  onCambioDetalleCarrera(): void {
    const idDet = Number(this.form.value.idUniversidadDetalle);
    const det = this.detallesCarrera.find((d) => d.idDetalle === idDet);
    if (det?.carreraNombre) {
      this.form.patchValue({ carreraPostula: det.carreraNombre });
    }
  }

  agregarApoderado(): void {
    this.apoderadosFormArray.push(
      this.fb.group({
        idApoderado: [0],
        dni: ['', [Validators.maxLength(15)]],
        nombre: ['', [Validators.maxLength(150)]],
        whatsApp: ['', [Validators.maxLength(15)]],
        idParamParentesco: [null],
      })
    );
  }

  quitarApoderado(i: number): void {
    this.apoderadosFormArray.removeAt(i);
  }

  abrirNuevo(): void {
    this.editando = false;
    this.idEditando = 0;
    this.limpiarApoderadosForm();
    const emp = (this.idEmpresaFiltro ?? this.idEmpresaSesion) || null;
    this.form.reset({
      dni: '',
      apellidos: '',
      nombres: '',
      idParamSexo: null,
      dia: null,
      mes: null,
      anio: null,
      carreraPostula: '',
      whatsApp: '',
      ieProcedencia: '',
      ieUbigeo: '',
      idEmpresaModal: emp,
      idSede: null,
      idCiclo: null,
      idUniversidad: null,
      idUniversidadDetalle: null,
    });
    this.ciclosModal = [];
    this.detallesCarrera = [];
    this.modalVisible = true;
    if (emp && emp > 0) {
      this.onCambioEmpresaModal();
    }
  }

  editar(item: AlumnoCrud): void {
    this.editando = true;
    this.idEditando = item.idAlumno;
    this.limpiarApoderadosForm();
    const emp = (item.idEmpresa ?? this.idEmpresaFiltro ?? this.idEmpresaSesion) || null;
    this.alumnoService.obtenerPorId(item.idAlumno).pipe(timeout(20000)).subscribe({
      next: (a) => {
        this.form.patchValue({
          dni: a.dni ?? '',
          apellidos: a.apellidos ?? '',
          nombres: a.nombres ?? '',
          idParamSexo: a.idParamSexo ?? null,
          dia: a.dia ?? null,
          mes: a.mes ?? null,
          anio: a.anio ?? null,
          carreraPostula: a.carreraPostula ?? '',
          whatsApp: a.whatsApp ?? '',
          ieProcedencia: a.ieProcedencia ?? '',
          ieUbigeo: a.ieUbigeo ?? '',
          idEmpresaModal: emp,
          idSede: a.idSede,
          idCiclo: null,
          idUniversidad: a.idUniversidad,
          idUniversidadDetalle: a.idUniversidadDetalle,
        });
        if (emp && emp > 0) {
          this.sedeService.obtenerPorEmpresa(emp).pipe(timeout(15000)).subscribe({
            next: (list) => (this.sedesModal = Array.isArray(list) ? list : []),
            error: () => (this.sedesModal = []),
          });
          this.universidadService.obtenerCombo(emp).pipe(timeout(15000)).subscribe({
            next: (list) => (this.universidadesModal = Array.isArray(list) ? list : []),
            error: () => (this.universidadesModal = []),
          });
        }
        if (a.idUniversidad > 0) {
          this.universidadService.obtenerDetalle(a.idUniversidad).pipe(timeout(15000)).subscribe({
            next: (list) => (this.detallesCarrera = Array.isArray(list) ? list : []),
            error: () => (this.detallesCarrera = []),
          });
        }
        if (emp && emp > 0 && a.idSede > 0) {
          this.cicloAdminService.obtenerPaginado(emp, a.idSede, '', 1, 500).pipe(timeout(15000)).subscribe({
            next: (res) => {
              this.ciclosModal = res?.items ?? [];
              this.form.patchValue({ idCiclo: a.idCiclo ?? null });
            },
            error: () => {
              this.ciclosModal = [];
            },
          });
        } else {
          this.ciclosModal = [];
        }
        (a.apoderados ?? []).forEach((ap) => {
          this.apoderadosFormArray.push(
            this.fb.group({
              idApoderado: [ap.idApoderado ?? 0],
              dni: [ap.dni ?? ''],
              nombre: [ap.nombre ?? '', [Validators.maxLength(150)]],
              whatsApp: [ap.whatsApp ?? ''],
              idParamParentesco: [ap.idParamParentesco],
            })
          );
        });
        this.modalVisible = true;
      },
      error: () => this.toastr.error('No se pudo cargar el alumno.'),
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const payload: AlumnoCrud = {
      idAlumno: this.idEditando,
      dni: (v.dni ?? '').trim() || null,
      apellidos: (v.apellidos ?? '').trim(),
      nombres: (v.nombres ?? '').trim(),
      idParamSexo: v.idParamSexo == null ? null : Number(v.idParamSexo),
      dia: v.dia === '' || v.dia === null ? null : Number(v.dia),
      mes: v.mes === '' || v.mes === null ? null : Number(v.mes),
      anio: v.anio === '' || v.anio === null ? null : Number(v.anio),
      carreraPostula: (v.carreraPostula ?? '').trim() || null,
      whatsApp: (v.whatsApp ?? '').trim() || null,
      ieProcedencia: (v.ieProcedencia ?? '').trim() || null,
      ieUbigeo: (v.ieUbigeo ?? '').trim() || null,
      idSede: Number(v.idSede),
      idCiclo: Number(v.idCiclo),
      idUniversidad: Number(v.idUniversidad),
      idUniversidadDetalle: Number(v.idUniversidadDetalle),
      apoderados: this.apoderadosFormArray.controls
        .map((c) => ({
          idApoderado: Number(c.value.idApoderado) || 0,
          dni: (c.value.dni ?? '').trim() || null,
          nombre: (c.value.nombre ?? '').trim(),
          whatsApp: (c.value.whatsApp ?? '').trim() || null,
          idParamParentesco: Number(c.value.idParamParentesco),
        }))
        .filter((a) => a.nombre.length > 0 && a.idParamParentesco > 0),
    };

    if (this.editando) {
      this.alumnoService.actualizar(this.idEditando, payload).subscribe({
        next: () => {
          this.toastr.success('Alumno actualizado.');
          this.modalVisible = false;
          this.cargarAlumnos(1, this.rows);
        },
        error: () => this.toastr.error('No se pudo actualizar el alumno.'),
      });
      return;
    }

    this.alumnoService.crear(payload).subscribe({
      next: () => {
        this.toastr.success('Alumno registrado.');
        this.modalVisible = false;
        this.cargarAlumnos(1, this.rows);
      },
      error: () => this.toastr.error('No se pudo registrar el alumno.'),
    });
  }

  eliminar(item: AlumnoCrud): void {
    void Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Eliminar a ${item.nombres} ${item.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    }).then((r) => {
      if (!r.isConfirmed) {
        return;
      }
      this.alumnoService.eliminar(item.idAlumno).subscribe({
        next: () => {
          this.toastr.success('Alumno eliminado.');
          this.cargarAlumnos(1, this.rows);
        },
        error: () => this.toastr.error('No se pudo eliminar.'),
      });
    });
  }

  private limpiarApoderadosForm(): void {
    while (this.apoderadosFormArray.length) {
      this.apoderadosFormArray.removeAt(0);
    }
  }

  private cargarAlumnos(pageNumber: number, pageSize: number): void {
    this.loading = true;
    this.alumnoService
      .obtenerPaginado(this.idEmpresaFiltro, this.idSedeFiltro, this.filtro, pageNumber, pageSize)
      .pipe(
        timeout(20000),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (res) => {
          this.alumnos = res?.items ?? [];
          this.totalRows = res?.totalRows ?? 0;
        },
        error: () => this.toastr.error('No se pudo cargar el listado de alumnos.'),
      });
  }

  private refrescarSedesFiltro(): void {
    if (this.idEmpresaFiltro && this.idEmpresaFiltro > 0) {
      this.sedeService.obtenerPorEmpresa(this.idEmpresaFiltro).pipe(timeout(15000)).subscribe({
        next: (list) => (this.sedesFiltro = Array.isArray(list) ? list : []),
        error: () => (this.sedesFiltro = []),
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
        this.cargarAlumnos(1, this.rows);
      },
      error: () => this.toastr.error('No se pudo obtener empresas.'),
    });
  }
}
