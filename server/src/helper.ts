import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = 'secret';
const iv = crypto.randomBytes(16);

export const getPermissionsFromUser = async (user) => {
  const permissions = [];
  await user?.roles?.forEach(async (role) => {
    await role?.permissions?.forEach(async (permission) => {
      await permissions.push(permission?.name);
    });
  });

  return permissions;
};

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

export const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};
