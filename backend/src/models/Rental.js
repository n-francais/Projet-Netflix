const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est obligatoire'],
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Le film est obligatoire'],
    },
    rentalDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'returned', 'cancelled'],
        message: 'Le statut doit être "active", "returned" ou "cancelled"',
      },
      default: 'active',
    },
    price: {
      type: Number,
      min: [0, 'Le prix doit être positif'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rental', rentalSchema);
