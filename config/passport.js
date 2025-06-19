import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { User, Role } from '../models/index.js';

const initializePassport = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email }, include: Role });
        if (!user) return done(null, false, { message: 'Email not registered' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return done(null, false, { message: 'Incorrect password' });

        // Safely assign role name if Role exists
        user.role = user.Role ? user.Role.name : null;

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id, { include: Role });
      if (user) {
        // Safely assign role name if Role exists
        user.role = user.Role ? user.Role.name : null;
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  });
};

export default initializePassport;
