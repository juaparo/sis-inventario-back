export class AdminStrategy {
  canAccess(action) {
    return true; // Admin can access everything
  }
}

export class ManagerStrategy {
  canAccess(action) {
    const allowed = [
      'dashboard_view', 
      'products_view', 
      'products_edit',
      'categories_view',
      'categories_manage',
      'movements_create',
      'alerts_manage'
    ];
    return allowed.includes(action);
  }
}

export class AuxiliarStrategy {
  canAccess(action) {
    const allowed = [
      'dashboard_view',
      'products_view',
      'categories_view',
      'movements_create'
    ];
    return allowed.includes(action);
  }
}
