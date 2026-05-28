import { AdminStrategy, ManagerStrategy, AuxiliarStrategy } from './RoleStrategies.js';

export default class AuthStrategyContext {
  constructor(roleName) {
    if (roleName === 'Administrador') {
      this.strategy = new AdminStrategy();
    } else if (roleName === 'Gerente') {
      this.strategy = new ManagerStrategy();
    } else if (roleName === 'Auxiliar de Bodega') {
      this.strategy = new AuxiliarStrategy();
    } else {
      this.strategy = null;
    }
  }

  canAccess(action) {
    if (!this.strategy) return false;
    return this.strategy.canAccess(action);
  }
}
