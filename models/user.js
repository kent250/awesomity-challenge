const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => /^\w+([\. -]?\w+)*@\w+([\. -]?\w+)*(\.\w{2,3})+$/.test(value),
            message: "Please enter a valid email address."
          }
    },
    password: {

    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'buyer', 'seller']
    },
    emailVerified: {
        type: Boolean,
        required: true
    },
    profile: {
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        bio: {
            type: String
        }
    }
}, {timestamps: true});


//hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });


userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
