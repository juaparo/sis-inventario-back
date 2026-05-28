export default class ReportFactory {
  static createReport(type, data) {
    if (type === 'PDF') {
      return {
        format: 'PDF',
        content: `Reporte en PDF con ${data.length} registros.`
      };
    } else if (type === 'EXCEL') {
      return {
        format: 'EXCEL',
        content: `Reporte en EXCEL con ${data.length} registros.`
      };
    } else {
      throw new Error('Tipo de reporte no soportado');
    }
  }
}
