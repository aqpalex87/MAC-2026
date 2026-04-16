import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import dayjs from 'dayjs';
import { finalize, timeout } from 'rxjs/operators';
import JsBarcode from 'jsbarcode';
import { toDataURL as qrToDataUrl } from 'qrcode';
import { CarnetListadoItem } from 'src/app/models/carnet-listado.interface';
import { EmpresaAuth } from 'src/app/models/empresa-sede.interface';
import { SedeCrud } from 'src/app/models/sede-crud.interface';
import { CarnetAdminService } from 'src/app/services/carnet-admin.service';
import { SedeAdminService } from 'src/app/services/sede-admin.service';
import { SecurityService } from 'src/app/services/security.service';

/** Texto fijo en reverso del carnet (ajustable). */
const CARNET_DIRECCION = 'Cerro Colorado — sede académica';
const CARNET_TELEFONO = '921 092 925';

@Component({
  selector: 'app-generar-carnet',
  templateUrl: './generar-carnet.component.html',
  styleUrls: ['./generar-carnet.component.css'],
})
export class GenerarCarnetComponent implements OnInit {
  @ViewChild('barcodeSvg') barcodeSvg?: ElementRef<SVGElement>;
  @ViewChild('qrImg') qrImg?: ElementRef<HTMLImageElement>;

  items: CarnetListadoItem[] = [];
  totalRows = 0;
  rows = 15;
  loading = false;
  filtro = '';

  idEmpresaSesion = 0;
  empresaNombre = '';
  empresas: EmpresaAuth[] = [];
  idEmpresaFiltro: number | null = null;
  sedesFiltro: SedeCrud[] = [];
  idSedeFiltro: number | null = null;

  dialogCarnet = false;
  carnetSeleccionado: CarnetListadoItem | null = null;
  readonly direccionCarnet = CARNET_DIRECCION;
  readonly telefonoCarnet = CARNET_TELEFONO;

  constructor(
    private carnetService: CarnetAdminService,
    private sedeService: SedeAdminService,
    private securityService: SecurityService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idEmpresaSesion = Number(this.securityService.leerIdEmpresa() || 0);
    this.empresaNombre = this.securityService.leerEmpresa() || '-';
    this.cargarEmpresas();
  }

  formatoFecha(v: string | null | undefined): string {
    if (v == null || v === '') {
      return '—';
    }
    const d = dayjs(v);
    return d.isValid() ? d.format('DD/MM/YYYY') : String(v);
  }

  formatoFechaHora(v: string | null | undefined): string {
    if (v == null || v === '') {
      return '—';
    }
    const d = dayjs(v);
    return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : String(v);
  }

  nombreCompletoAlumno(c: CarnetListadoItem): string {
    return `${(c.nombres ?? '').trim()} ${(c.apellidos ?? '').trim()}`.trim().toUpperCase();
  }

  marcaAcademia(c: CarnetListadoItem): string {
    return ((c.nombreEmpresa ?? this.empresaNombre) || 'ACADEMIA').toUpperCase();
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

  limpiarFiltro(): void {
    this.filtro = '';
    this.cargarListado(1, this.rows);
  }

  onCambioEmpresaFiltro(): void {
    this.idSedeFiltro = null;
    this.refrescarSedesFiltro();
    this.buscar();
  }

  abrirVistaCarnet(row: CarnetListadoItem): void {
    this.carnetSeleccionado = row;
    this.dialogCarnet = true;
    this.cdr.detectChanges();
    setTimeout(() => void this.pintarCodigos(), 0);
  }

  onCarnetDialogShown(): void {
    void this.pintarCodigos();
  }

  imprimirCarnet(): void {
    const root = document.documentElement;
    root.classList.add('carnet-print-mode');
    const cleanup = (): void => {
      root.classList.remove('carnet-print-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    window.setTimeout(cleanup, 2000);
  }

  cerrarDialogCarnet(): void {
    this.carnetSeleccionado = null;
  }

  private async pintarCodigos(): Promise<void> {
    const row = this.carnetSeleccionado;
    if (!row || !this.dialogCarnet) {
      return;
    }
    const dni = (row.dni ?? '').trim() || '00000000';
    const svg = this.barcodeSvg?.nativeElement;
    if (svg) {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
      try {
        JsBarcode(svg, dni, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 11,
          margin: 2,
          height: 44,
          width: 1.6,
        });
      } catch {
        this.toastr.warning('No se pudo generar el código de barras.');
      }
    }
    const payload = JSON.stringify({
      dni: row.dni,
      nombres: row.nombres,
      apellidos: row.apellidos,
      idAlumno: row.idAlumno,
      idCarnet: row.idCarnet,
      vencimiento: row.fechaVencimiento,
      inscripcion: row.fechaInscripcion,
      registro: row.fechaRegistro,
      carrera: row.carreraPostula,
      ciclo: row.nombreCiclo,
    });
    const img = this.qrImg?.nativeElement;
    if (img) {
      try {
        img.src = await qrToDataUrl(payload, { margin: 1, width: 220, errorCorrectionLevel: 'M' });
      } catch {
        this.toastr.warning('No se pudo generar el código QR.');
      }
    }
  }

  private cargarListado(pageNumber: number, pageSize: number): void {
    const idEmp = this.idEmpresaFiltro ?? this.idEmpresaSesion;
    if (!idEmp || idEmp <= 0) {
      this.toastr.warning('Seleccione una empresa.');
      return;
    }
    this.loading = true;
    this.carnetService
      .obtenerListado(idEmp, this.idSedeFiltro, this.filtro, pageNumber, pageSize)
      .pipe(
        timeout(25000),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: (res) => {
          this.items = res?.items ?? [];
          this.totalRows = res?.totalRows ?? 0;
        },
        error: () => this.toastr.error('No se pudo cargar el listado de carnets.'),
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
        this.cargarListado(1, this.rows);
      },
      error: () => this.toastr.error('No se pudo obtener empresas.'),
    });
  }
}
