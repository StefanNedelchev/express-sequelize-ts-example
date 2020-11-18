import { AllowNull, BelongsTo, Column, ForeignKey, Model, Table, Unique } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class BlogPost extends Model<BlogPost> {

  @Unique
  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  description!: string;

  @Column
  published: boolean = false;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
