import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from '../models/Role.js';
import User from '../models/User.js';

dotenv.config();

const rolesData = [
  {
    name: 'Administrador',
    description: 'Acceso total al sistema con todos los permisos',
    permissions: [
      'dashboard_view',
      'products_view',
      'products_edit',
      'categories_view',
      'categories_manage',
      'movements_create',
      'alerts_manage',
      'users_view',
      'users_manage',
      'roles_view',
      'roles_manage'
    ],
    status: 'active',
    userCount: 0
  },
  {
    name: 'Gerente',
    description: 'Acceso básico del inventario',
    permissions: [
      'dashboard_view', 
      'products_view', 
      'products_edit',
      'categories_view',
      'categories_manage',
      'movements_create',
      'alerts_manage'
    ],
    status: 'active',
    userCount: 0
  },
  {
    name: 'Auxiliar de Bodega',
    description: 'Acceso limitado',
    permissions: [
      'dashboard_view',
      'products_view',
      'categories_view',
      'movements_create'
    ],
    status: 'active',
    userCount: 0
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario';
    console.log('Conectando a la base de datos para sembrado...');
    await mongoose.connect(mongoURI);
    console.log('Conexión establecida.');

    // Limpiar colecciones
    console.log('Limpiando colecciones de Roles y Usuarios...');
    await Role.deleteMany({});
    await User.deleteMany({});

    // Crear Roles
    console.log('Insertando roles...');
    const createdRoles = await Role.insertMany(rolesData);
    console.log(`${createdRoles.length} roles creados.`);

    // Mapear roles por nombre para acceso rápido
    const roleMap = {};
    createdRoles.forEach(role => {
      roleMap[role.name] = role._id;
    });

    // Datos de usuarios con referencia al ObjectId del rol
    const usersData = [
      {
        name: 'Juan Pérez',
        email: 'admin@inventario.com',
        password: 'admin123',
        role: roleMap['Administrador'],
        status: 'active'
      },
      {
        name: 'María García',
        email: 'auxiliar@inventario.com',
        password: 'auxiliar123',
        role: roleMap['Auxiliar de Bodega'],
        status: 'active'
      },
      {
        name: 'Carlos López',
        email: 'gerente@inventario.com',
        password: 'gerente123',
        role: roleMap['Gerente'],
        status: 'active'
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@inventario.com',
        password: 'ana.martinez123',
        role: roleMap['Auxiliar de Bodega'],
        status: 'active'
      },
      {
        name: 'Pedro Sánchez',
        email: 'pedro.sanchez@inventario.com',
        password: 'pedro.sanchez123',
        role: roleMap['Gerente'],
        status: 'inactive'
      }
    ];

    // Crear Usuarios
    console.log('Insertando usuarios (las contraseñas se encriptarán automáticamente)...');
    for (const u of usersData) {
      await User.create(u);
    }
    console.log(`${usersData.length} usuarios creados.`);

    // Actualizar userCount de cada rol en base a los usuarios reales creados
    console.log('Actualizando contadores de usuarios por rol...');
    for (const role of createdRoles) {
      const count = await User.countDocuments({ role: role._id });
      role.userCount = count;
      await role.save();
    }

    console.log('¡Semillero (Seeding) completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDB();
