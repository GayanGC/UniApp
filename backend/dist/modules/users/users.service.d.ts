import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, Student } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly studentRepository;
    private readonly configService;
    private readonly saltRounds;
    constructor(userRepository: Repository<User>, studentRepository: Repository<Student>, configService: ConfigService);
    create(createUserDto: CreateUserDto): Promise<User>;
    createStudentProfile(userId: number, university?: string, faculty?: string, academicYear?: string): Promise<Student>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    validatePassword(user: User, password: string): Promise<boolean>;
    updateTwoFactorSecret(userId: number, secret: string): Promise<void>;
    enableTwoFactor(userId: number): Promise<void>;
}
