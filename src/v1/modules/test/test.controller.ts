import { Controller, UseGuards, Get, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../../auth/get-user.decorators';
import { User } from '../../../entities/user.entity';
import { TestService } from './test.service';

@Controller('test')
export class TestController {

    private logger = new Logger("TestController");
    constructor(private testService: TestService) {}

    @UseGuards(AuthGuard())
    @Get("/list")
    async list(@GetUser() userLogged: User): Promise<void> {
        this.logger.verbose(`Petición para obtener la lista de partners`);
        console.log(userLogged);
        //return this.partnerService.list(userLogged);
    }
}
