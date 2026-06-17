import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities").User>;
    findAll(): Promise<import("./entities").User[]>;
    findOne(id: number, currentUser: any): Promise<import("./entities").User | null>;
    update(id: number, updateUserDto: UpdateUserDto, currentUser: any): Promise<import("./entities").User>;
    remove(id: number): Promise<void>;
}
