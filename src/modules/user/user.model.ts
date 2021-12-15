import { compare } from 'bcrypt';
import {
  AllowNull, BeforeCreate, BeforeUpdate, Column, Default, HasMany, Model, Table, Unique,
} from 'sequelize-typescript';
import { BlogPost } from '../blog-post/blog-post.model';

@Table
export class User extends Model {
  @Unique
  @AllowNull(false)
  @Column
    username!: string;

  @AllowNull(false)
  @Column
    password!: string;

  @Unique
  @AllowNull(false)
  @Column
    email!: string;

  @Column
    fullName?: string;

  @AllowNull(false)
  @Default(5)
  @Column
    role!: number;

  @HasMany(() => BlogPost)
    blogPosts?: BlogPost[];

  @BeforeCreate
  @BeforeUpdate
  static beforeCreateHook(instance: User): void {
    instance.username = instance.username.trim();
  }

  comparePasswrod(password: string): Promise<boolean> {
    return compare(password, this.password).catch((err) => {
      console.error(err);
      return false;
    });
  }
}
