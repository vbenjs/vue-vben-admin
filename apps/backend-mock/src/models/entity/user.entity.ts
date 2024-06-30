import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * 密码
   */
  @Column()
  password: string;
  /**
   * 真实姓名
   */
  @Column()
  realName: string;
  /**
   * 角色
   */
  @Column('text', {
    transformer: {
      from: (value: string) => JSON.parse(value),
      to: (value: string[]) => JSON.stringify(value),
    },
  })
  roles: string[];
  /**
   * 用户名
   */
  @Column({ unique: true })
  username: string;
}

export { UserEntity };
