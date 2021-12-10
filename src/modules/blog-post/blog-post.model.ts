import {
 AllowNull, BelongsTo, Column, Default, ForeignKey, Model, Table, Unique,
} from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class BlogPost extends Model {
  @Unique
  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  description!: string;

  @Default(false)
  @Column
  published!: boolean;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
