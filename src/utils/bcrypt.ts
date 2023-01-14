import * as bcrypt from 'bcrypt';

export function generateHash(password: string) {
  const SALT = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, SALT);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
