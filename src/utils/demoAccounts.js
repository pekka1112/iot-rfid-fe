export const demoAccounts = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    email: 'admin@example.com',
    avatar: 'logo/logo-1.jpg',
  },
  {
    id: 2,
    username: 'staff',
    password: 'staff123',
    role: 'Nhân viên',
    email: 'staff@example.com',
    avatar: 'logo/logo-1.jpg',
  },
  {
    id: 3,
    username: 'manager',
    password: 'manager123',
    role: 'Quản lý',
    email: 'manager@example.com',
    avatar: 'logo/logo-1.jpg',
  },
  {
    id: 4,
    username: 'user',
    password: 'user123',
    role: 'Người dùng',
    email: 'user@example.com',
    avatar: 'logo/logo-1.jpg',
  },
   {
    id: 5,
    username: 'thankfat',
    password: '1203',
    role: 'Người dùng',
    email: 'thankfat@gmail.com',
    avatar: 'logo/logo-2.jpg',
  },
];

export const validateCredentials = (username, password) => {
  const account = demoAccounts.find(
    (acc) => acc.username === username && acc.password === password
  );
  return account || null;
};
