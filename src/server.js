import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'; 
// 👇 SOLUCIÓN: Importación de las rutas de productos para definir la variable 👇
import productRoutes from './routes/productRoutes.js'; 
import movementRoutes from './routes/movementRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas Globales de la API
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/products', productRoutes); // <-- Ahora la variable compila con éxito
app.use('/api/movements', movementRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/alerts', alertRoutes);

// Ruta base / de prueba
app.get('/', (req, res) => {
  res.send('API del Sistema de Inventario ejecutándose correctamente.');
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocurrió un error interno en el servidor.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});