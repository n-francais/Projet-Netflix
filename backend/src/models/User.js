const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Veuillez fournir un email valide',
      ],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false, // ne jamais renvoyer le mot de passe dans les requêtes
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Le rôle doit être "user" ou "admin"',
      },
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hachage du mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  // Seulement si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer le mot de passe à la connexion
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
