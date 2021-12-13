import { InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";

import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger("UserRepository");

  async findUserByMobilePhone(mobile_phone: string): Promise<User> {
    const query = this.createQueryBuilder("user")
      .innerJoinAndSelect("user.profile", "profile")
      .select([
        "user.id",
        "user.deny_access",
      ])
      .where("profile.mobile_phone = :mobile_phone", {
        mobile_phone,
      });

    try {
      return await query.getOne();
    } catch (error) {
      this.logger.error(
        `Error al realizar la consulta ${query.getQuery()}, mobile_phone : ${mobile_phone}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

}
