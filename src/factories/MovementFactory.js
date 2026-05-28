export default class MovementFactory {
  static createMovement(type, data) {
    if (type === 'ENTRADA') {
      if (!data.supplier) {
        throw new Error('El proveedor es obligatorio para una ENTRADA');
      }
      return {
        ...data,
        type: 'ENTRADA'
      };
    } else if (type === 'SALIDA') {
      // Para la salida limpiamos el proveedor si llega por error
      const { supplier, ...rest } = data;
      return {
        ...rest,
        type: 'SALIDA'
      };
    } else {
      throw new Error('Tipo de movimiento no soportado');
    }
  }
}
