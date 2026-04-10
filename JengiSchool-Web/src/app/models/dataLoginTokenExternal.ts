export interface DataLoginTokenExternal {
  token: string
  estado: string
  urlApiAutenticate: string
  urlApiObtenerUsuario: string
}

export interface LoginDto<T> {
  codigo: string,
  estado: string,
  mensaje: string,
  response: T
}

export interface ResponseLoginTokenExternal {
  vToken: string,
  vEmail: string,
  vNombre: string,
  vUsuarioWeb: string,
  vOpcion: string,
  vPerfilDescripcion: string,
  vDescripcionAgencia: string,
  vSolCredito: string,
  vNumDocumento: string,
  vIdFC:number
}
