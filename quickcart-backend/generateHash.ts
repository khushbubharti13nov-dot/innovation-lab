import bcrypt from 'bcryptjs';

const generateHash = async () => {
  const password = 'admin123'; // The password you want to use
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log('--- YOUR NEW HASH ---');
  console.log(hash);
  console.log('--- COPY THE HASH ABOVE ---');
};

generateHash();