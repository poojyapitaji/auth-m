import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

class User extends Model {
  public uuid!: string;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    this.init(
      {
        uuid: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'user',
        tableName: 'users',
        timestamps: true,
        underscored: true
      }
    );
  }

  public static applyScopes(): void {
    this.addScope('defaultScope', {
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    this.addScope('withPassword', {
      attributes: { include: ['password'] },
      order: [['createdAt', 'DESC']]
    });
  }
}

User.initialize(sequelize);
User.applyScopes();
User.sync();

export default User;
