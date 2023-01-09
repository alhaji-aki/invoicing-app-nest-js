import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        name: 'Abdul Kudus',
        email: 'abdulkudus2922@gmail.com',
        password: await bcrypt.hash('password', 10),
        isAdmin: true,
      },
    ]);
  }
}
