import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';

async function seed() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('nestjs-demo');
    const usersCollection = db.collection('users');

    // Xóa dữ liệu cũ
    await usersCollection.deleteMany({});

    // Tạo mật khẩu đã mã hóa
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Thêm user thường
    await usersCollection.insertOne({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      isActive: true,
      roles: ['user'],
      createdAt: new Date(),
    });

    // Thêm user admin
    await usersCollection.insertOne({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      isActive: true,
      roles: ['admin', 'user'],
      createdAt: new Date(),
    });

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seed(); 