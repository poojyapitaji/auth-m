import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../libs';

interface LogAttributes {
  uuid: string;
  log: unknown;
}

class Log extends Model<LogAttributes> {
  public uuid!: string;
  public log!: unknown;

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
        log: {
          type: DataTypes.JSON,
          allowNull: false,
          get() {
            return JSON.parse(JSON.stringify(this.getDataValue('log')));
          }
        }
      },
      {
        sequelize,
        modelName: 'logs',
        tableName: 'logs',
        timestamps: true,
        underscored: true
      }
    );
  }

  public static applyDefaultScope(): void {
    this.addScope('defaultScope', {
      order: [['createdAt', 'DESC']]
    });
  }
}

Log.initialize(sequelize);
Log.applyDefaultScope();
Log.sync();

export default Log;
