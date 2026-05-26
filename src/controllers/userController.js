import User from '../models/User.js';
import Role from '../models/Role.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('role');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Crear un usuario
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // role ahora es un ObjectId
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ message: 'El rol especificado no existe en el sistema' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: roleExists._id,
      status: 'active'
    });

    await newUser.save();

    // Actualizar contador del rol
    roleExists.userCount = await User.countDocuments({ role: roleExists._id });
    await roleExists.save();

    // Populate antes de devolver
    const populatedUser = await User.findById(newUser._id).select('-password').populate('role');

    return res.status(201).json(populatedUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const oldRoleId = user.role;

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
      user.email = email.toLowerCase();
    }

    user.name = name || user.name;

    if (role && role.toString() !== oldRoleId.toString()) {
      const roleExists = await Role.findById(role);
      if (!roleExists) {
        return res.status(400).json({ message: 'El rol especificado no existe en el sistema' });
      }
      user.role = roleExists._id;
    }

    if (password) {
      user.password = password;
    }

    await user.save();

    // Si cambió el rol del usuario, actualizar el contador de ambos roles
    if (role && role.toString() !== oldRoleId.toString()) {
      const oldRoleDoc = await Role.findById(oldRoleId);
      if (oldRoleDoc) {
        oldRoleDoc.userCount = await User.countDocuments({ role: oldRoleId });
        await oldRoleDoc.save();
      }
      const newRoleDoc = await Role.findById(role);
      if (newRoleDoc) {
        newRoleDoc.userCount = await User.countDocuments({ role: newRoleDoc._id });
        await newRoleDoc.save();
      }
    }

    const populatedUser = await User.findById(user._id).select('-password').populate('role');

    return res.status(200).json(populatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Alternar estado del usuario
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    const populatedUser = await User.findById(user._id).select('-password').populate('role');

    return res.status(200).json(populatedUser);
  } catch (error) {
    console.error('Error al alternar estado del usuario:', error);
    return res.status(500).json({ message: 'Error al alternar el estado del usuario' });
  }
};
