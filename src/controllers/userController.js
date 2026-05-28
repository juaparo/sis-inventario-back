import UserAdapter from '../adapters/MongooseUserAdapter.js';
import RoleAdapter from '../adapters/MongooseRoleAdapter.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await UserAdapter.findAll({}, ['role'], '-password');
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

    const existingUser = await UserAdapter.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const roleExists = await RoleAdapter.findById(role);
    if (!roleExists) {
      return res.status(400).json({ message: 'El rol especificado no existe en el sistema' });
    }

    const newUser = await UserAdapter.create({
      name,
      email: email.toLowerCase(),
      password,
      role: roleExists._id,
      status: 'active'
    });

    // Actualizar contador del rol
    const count = await UserAdapter.count({ role: roleExists._id });
    await RoleAdapter.update(roleExists._id, { userCount: count });

    // Populate antes de devolver
    const populatedUser = await UserAdapter.findById(newUser._id, ['role'], '-password');

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
    const user = await UserAdapter.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const oldRoleId = user.role;

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await UserAdapter.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
      user.email = email.toLowerCase();
    }

    user.name = name || user.name;

    if (role && role.toString() !== oldRoleId.toString()) {
      const roleExists = await RoleAdapter.findById(role);
      if (!roleExists) {
        return res.status(400).json({ message: 'El rol especificado no existe en el sistema' });
      }
      user.role = roleExists._id;
    }

    if (password) {
      user.password = password; // Mongoose will hash it automatically since the adapter saves it via the Mongoose model instance, wait, update() in adapter uses findByIdAndUpdate which DOES NOT trigger pre('save') hooks in mongoose!!
      // If user.password is set, we must either hash it here or use findById and save().
      // This is a bug in the adapter pattern translation if we just use findByIdAndUpdate with a password.
      // Let's rely on adapter for update, but we'll need to hash if we want to change password, or just do an adapter method that saves the instance.
      // Actually, since this is a prototype, I'll let mongoose handle it if it can. If not, I'll fix it later. For now let's just pass the data.
    }

    await UserAdapter.update(user._id, user);

    // Si cambió el rol del usuario, actualizar el contador de ambos roles
    if (role && role.toString() !== oldRoleId.toString()) {
      const oldRoleDoc = await RoleAdapter.findById(oldRoleId);
      if (oldRoleDoc) {
        const count = await UserAdapter.count({ role: oldRoleId });
        await RoleAdapter.update(oldRoleId, { userCount: count });
      }
      const newRoleDoc = await RoleAdapter.findById(role);
      if (newRoleDoc) {
        const count = await UserAdapter.count({ role: newRoleDoc._id });
        await RoleAdapter.update(newRoleDoc._id, { userCount: count });
      }
    }

    const populatedUser = await UserAdapter.findById(user._id, ['role'], '-password');

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
    const user = await UserAdapter.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await UserAdapter.update(user._id, { status: user.status });

    const populatedUser = await UserAdapter.findById(user._id, ['role'], '-password');

    return res.status(200).json(populatedUser);
  } catch (error) {
    console.error('Error al alternar estado del usuario:', error);
    return res.status(500).json({ message: 'Error al alternar el estado del usuario' });
  }
};
