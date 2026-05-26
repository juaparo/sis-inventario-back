import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  userCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Role = mongoose.model('Role', RoleSchema);
export default Role;
