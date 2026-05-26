import Role from '../models/Role.js';
import User from '../models/User.js';

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    // Actualizar dinámicamente los contadores de usuarios por rol
    const updatedRoles = await Promise.all(roles.map(async (role) => {
      const count = await User.countDocuments({ role: role._id });
      if (role.userCount !== count) {
        role.userCount = count;
        await role.save();
      }
      return role;
    }));
    return res.status(200).json(updatedRoles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return res.status(500).json({ message: 'Error al obtener los roles' });
  }
};

// Crear un rol
export const createRole = async (req, res) => {
  const { name, description, permissions } = req.body;
  try {
    if (!name || !description) {
      return res.status(400).json({ message: 'El nombre y la descripción son requeridos' });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Ya existe un rol con ese nombre' });
    }

    const newRole = new Role({
      name,
      description,
      permissions: permissions || [],
      status: 'active',
      userCount: 0
    });

    await newRole.save();
    return res.status(201).json(newRole);
  } catch (error) {
    console.error('Error al crear rol:', error);
    return res.status(500).json({ message: 'Error al crear el rol' });
  }
};

// Actualizar un rol
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, permissions } = req.body;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    role.name = name || role.name;
    role.description = description || role.description;
    if (permissions) {
      role.permissions = permissions;
    }

    await role.save();

    // Actualizar el conteo final (ahora se busca por ObjectId)
    const count = await User.countDocuments({ role: role._id });
    role.userCount = count;
    await role.save();

    return res.status(200).json(role);
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    return res.status(500).json({ message: 'Error al actualizar el rol' });
  }
};

// Alternar estado del rol
export const toggleRoleStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    role.status = role.status === 'active' ? 'inactive' : 'active';
    await role.save();

    return res.status(200).json(role);
  } catch (error) {
    console.error('Error al alternar estado del rol:', error);
    return res.status(500).json({ message: 'Error al alternar el estado del rol' });
  }
};
