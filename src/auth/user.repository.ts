import { Logger, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entities/user.entity";
import { AuthtCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtPayload } from "./jwt-payload.interface";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger("UserRepository");

  async validateUserPassword( authtCredentialsDto: AuthtCredentialsDto ): Promise<User> {
    const { username: mobile_phone, password } = authtCredentialsDto;

    const query = this.createQueryBuilder("user")
      .innerJoinAndSelect("user.profile", "profile")
      .innerJoinAndSelect("user.role", "role")
      .select([
        "user.id",
        "user.role_id",
        "user.password",
        "user.salt",
        "user.last_password_update",
        "role.role",
        "profile.id",
        "profile.user_id",
        "profile.mobile_phone",
      ])
      .where(
        "profile.mobile_phone = :mobile_phone and user.deny_access = 0",
        {
          mobile_phone,
        }
      );

    try {
      const user = await query.getOne();
      if (user && (await user.validatePassword(password))) {
        return user;
      }
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${query.getQuery()}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async validateJwt(payload: JwtPayload): Promise<User> {
    const { role_id, username : mobile_phone } = payload;
   
    const query = this.createQueryBuilder("user")
      .innerJoinAndSelect("user.profile", "profile")
      .innerJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("role.permissions", "permissions")
      .select([
        "user.id",
        "user.last_password_update",
        "user.deny_access",
        "profile.first_name",
        "profile.last_name",
        "profile.mobile_phone",
        "role.id",
        "permissions.code",
      ])
      .where(
        "profile.mobile_phone = :mobile_phone and user.role_id = :role_id",
        {
          mobile_phone,
          role_id,
        }
      );

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${query.getQuery()}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }
}
