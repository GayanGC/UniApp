/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const platform_express_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const cors_1 = __importDefault(__webpack_require__(143));
const express_1 = __importDefault(__webpack_require__(144));
const server = (0, express_1.default)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.use((0, cors_1.default)({
        origin: ['https://uniapp-prod-frontend.vercel.app', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
        preflightContinue: false,
        optionsSuccessStatus: 200,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((err, req, res, next) => {
        console.error('[CRITICAL RUNTIME ERROR]', {
            method: req.method,
            url: req.url,
            message: err.message,
            stack: err.stack,
        });
        if (res.headersSent)
            return next(err);
        res.status(err.status || 500).json({
            statusCode: err.status || 500,
            message: err.message || 'Internal server error',
        });
    });
    await app.init();
}
bootstrap();
exports["default"] = server;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const typeorm_1 = __webpack_require__(6);
const core_1 = __webpack_require__(1);
const config_2 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(38);
const users_module_1 = __webpack_require__(64);
const students_module_1 = __webpack_require__(69);
const boarding_module_1 = __webpack_require__(74);
const past_papers_module_1 = __webpack_require__(96);
const campus_guide_module_1 = __webpack_require__(105);
const notifications_module_1 = __webpack_require__(90);
const chat_module_1 = __webpack_require__(111);
const resources_module_1 = __webpack_require__(117);
const complaints_module_1 = __webpack_require__(123);
const finance_module_1 = __webpack_require__(129);
const lifestyle_module_1 = __webpack_require__(132);
const alumni_module_1 = __webpack_require__(135);
const safety_module_1 = __webpack_require__(138);
const guards_1 = __webpack_require__(58);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.databaseConfig, config_2.jwtConfig],
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const typeOrmOptions = {
                        type: 'postgres',
                        host: configService.get('database.host'),
                        port: configService.get('database.port'),
                        username: configService.get('database.username'),
                        password: configService.get('database.password'),
                        database: configService.get('database.database'),
                        entities: config_2.typeOrmConfig.entities,
                        synchronize: configService.get('database.synchronize'),
                        logging: configService.get('database.logging'),
                        ssl: configService.get('NODE_ENV') === 'production'
                            ? { rejectUnauthorized: false }
                            : false,
                    };
                    typeOrmOptions['keepConnectionAlive'] = true;
                    typeOrmOptions['retryAttempts'] = 1;
                    typeOrmOptions['retryDelay'] = 3000;
                    typeOrmOptions['extra'] = {
                        max: 10,
                        connectionTimeoutMillis: 5000,
                    };
                    return typeOrmOptions;
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            boarding_module_1.BoardingModule,
            past_papers_module_1.PastPapersModule,
            campus_guide_module_1.CampusGuideModule,
            notifications_module_1.NotificationsModule,
            chat_module_1.ChatModule,
            resources_module_1.ResourcesModule,
            complaints_module_1.ComplaintsModule,
            finance_module_1.FinanceModule,
            lifestyle_module_1.LifestyleModule,
            alumni_module_1.AlumniModule,
            safety_module_1.SafetyModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeOrmConfig = exports.typeOrmDataSource = exports.jwtConfig = exports.databaseConfig = void 0;
var database_config_1 = __webpack_require__(8);
Object.defineProperty(exports, "databaseConfig", ({ enumerable: true, get: function () { return __importDefault(database_config_1).default; } }));
var jwt_config_1 = __webpack_require__(9);
Object.defineProperty(exports, "jwtConfig", ({ enumerable: true, get: function () { return __importDefault(jwt_config_1).default; } }));
var typeorm_config_1 = __webpack_require__(10);
Object.defineProperty(exports, "typeOrmDataSource", ({ enumerable: true, get: function () { return __importDefault(typeorm_config_1).default; } }));
var typeorm_config_2 = __webpack_require__(10);
Object.defineProperty(exports, "typeOrmConfig", ({ enumerable: true, get: function () { return typeorm_config_2.typeOrmConfig; } }));


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__(5);
exports["default"] = (0, config_1.registerAs)('database', () => {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        const url = new URL(dbUrl);
        return {
            host: url.hostname,
            port: parseInt(url.port || '5432', 10),
            username: url.username,
            password: url.password,
            database: url.pathname.replace('/', ''),
            synchronize: process.env.DB_SYNCHRONIZE === 'true',
            logging: process.env.DB_LOGGING === 'true',
        };
    }
    return {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'uni_app_db',
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        logging: process.env.DB_LOGGING === 'true',
    };
});


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_1 = __webpack_require__(5);
exports["default"] = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeOrmConfig = void 0;
const typeorm_1 = __webpack_require__(11);
const config_1 = __webpack_require__(5);
const dotenv_1 = __webpack_require__(12);
const entities_1 = __webpack_require__(13);
const entities_2 = __webpack_require__(20);
const entities_3 = __webpack_require__(23);
const entities_4 = __webpack_require__(25);
const entities_5 = __webpack_require__(28);
const entities_6 = __webpack_require__(30);
const complaint_entity_1 = __webpack_require__(32);
const payment_invoice_entity_1 = __webpack_require__(33);
const local_merchant_entity_1 = __webpack_require__(34);
const campus_event_entity_1 = __webpack_require__(35);
const alumni_feed_entity_1 = __webpack_require__(36);
const anonymous_complaint_entity_1 = __webpack_require__(37);
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.typeOrmConfig = {
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'postgres'),
    database: configService.get('DB_DATABASE', 'uni_app_db'),
    entities: [entities_1.User, entities_1.Student, entities_2.BoardingPost, entities_2.BoardingReview, entities_3.PastPaper, entities_4.Campus, entities_4.CampusPOI, entities_5.ChatMessage, entities_6.ResourceItem, complaint_entity_1.Complaint, payment_invoice_entity_1.PaymentInvoice, local_merchant_entity_1.LocalMerchant, campus_event_entity_1.CampusEvent, alumni_feed_entity_1.AlumniFeed, anonymous_complaint_entity_1.AnonymousComplaint],
    migrations: ['dist/migrations/*.js'],
    synchronize: configService.get('DB_SYNCHRONIZE', false),
    logging: configService.get('DB_LOGGING', true),
    ssl: configService.get('NODE_ENV') === 'production'
        ? {
            rejectUnauthorized: false,
        }
        : false,
};
const dataSource = new typeorm_1.DataSource(exports.typeOrmConfig);
exports["default"] = dataSource;


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(14), exports);
__exportStar(__webpack_require__(19), exports);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const class_transformer_1 = __webpack_require__(16);
const enums_1 = __webpack_require__(17);
const student_entity_1 = __webpack_require__(19);
let User = class User {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => Number }, email: { required: true, type: () => String }, passwordHash: { required: true, type: () => String }, role: { required: true, enum: (__webpack_require__(18).UserRole) }, fullName: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, isTwoFactorEnabled: { required: true, type: () => Boolean }, twoFactorSecret: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, student: { required: false, type: () => (__webpack_require__(19).Student) } };
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255 }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.UserRole,
        default: enums_1.UserRole.PROSPECTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_two_factor_enabled', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isTwoFactorEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'two_factor_secret', type: 'varchar', nullable: true }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "twoFactorSecret", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => student_entity_1.Student, (student) => student.user, { cascade: true }),
    __metadata("design:type", student_entity_1.Student)
], User.prototype, "student", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(18), exports);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["STUDENT"] = "student";
    UserRole["PROSPECTIVE"] = "prospective";
    UserRole["BOARDING_PROVIDER"] = "boarding_provider";
})(UserRole || (exports.UserRole = UserRole = {}));


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Student = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const user_entity_1 = __webpack_require__(14);
let Student = class Student {
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, university: { required: true, type: () => String }, faculty: { required: true, type: () => String }, academicYear: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, user: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'student_id' }),
    __metadata("design:type", Number)
], Student.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'integer', unique: true }),
    __metadata("design:type", Number)
], Student.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "faculty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'academic_year', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.student, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Student.prototype, "user", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)('students')
], Student);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(21), exports);
__exportStar(__webpack_require__(22), exports);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingPost = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
const boarding_review_entity_1 = __webpack_require__(22);
let BoardingPost = class BoardingPost {
    static _OPENAPI_METADATA_FACTORY() {
        return { postId: { required: true, type: () => Number }, providerUserId: { required: true, type: () => Number }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, monthlyRent: { required: true, type: () => Number }, isAvailable: { required: true, type: () => Boolean }, locationDetails: { required: true, type: () => String }, latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number }, images: { required: true, type: () => [String] }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, provider: { required: true, type: () => (__webpack_require__(14).User) }, reviews: { required: true, type: () => [(__webpack_require__(22).BoardingReview)] } };
    }
};
exports.BoardingPost = BoardingPost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'post_id' }),
    __metadata("design:type", Number)
], BoardingPost.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_user_id', type: 'integer' }),
    __metadata("design:type", Number)
], BoardingPost.prototype, "providerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BoardingPost.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BoardingPost.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'monthly_rent', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BoardingPost.prototype, "monthlyRent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_available', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], BoardingPost.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_details', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], BoardingPost.prototype, "locationDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], BoardingPost.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], BoardingPost.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'images', type: 'simple-array', nullable: true, default: null }),
    __metadata("design:type", Array)
], BoardingPost.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], BoardingPost.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], BoardingPost.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'provider_user_id' }),
    __metadata("design:type", entities_1.User)
], BoardingPost.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => boarding_review_entity_1.BoardingReview, (review) => review.post),
    __metadata("design:type", Array)
], BoardingPost.prototype, "reviews", void 0);
exports.BoardingPost = BoardingPost = __decorate([
    (0, typeorm_1.Entity)('boarding_posts')
], BoardingPost);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingReview = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const boarding_post_entity_1 = __webpack_require__(21);
const entities_1 = __webpack_require__(13);
let BoardingReview = class BoardingReview {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, postId: { required: true, type: () => Number }, studentUserId: { required: true, type: () => Number }, rating: { required: true, type: () => Number }, comment: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, post: { required: true, type: () => (__webpack_require__(21).BoardingPost) }, student: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.BoardingReview = BoardingReview;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BoardingReview.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_id', type: 'integer' }),
    __metadata("design:type", Number)
], BoardingReview.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_user_id', type: 'integer' }),
    __metadata("design:type", Number)
], BoardingReview.prototype, "studentUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BoardingReview.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BoardingReview.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], BoardingReview.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => boarding_post_entity_1.BoardingPost, (post) => post.reviews, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", boarding_post_entity_1.BoardingPost)
], BoardingReview.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'student_user_id' }),
    __metadata("design:type", entities_1.User)
], BoardingReview.prototype, "student", void 0);
exports.BoardingReview = BoardingReview = __decorate([
    (0, typeorm_1.Entity)('boarding_reviews')
], BoardingReview);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(24), exports);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PastPaper = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
let PastPaper = class PastPaper {
    static _OPENAPI_METADATA_FACTORY() {
        return { paperId: { required: true, type: () => Number }, university: { required: true, type: () => String }, faculty: { required: true, type: () => String }, subjectName: { required: true, type: () => String }, academicYear: { required: true, type: () => Number }, examYear: { required: true, type: () => Number }, filePath: { required: true, type: () => String }, uploadedByUserId: { required: true, type: () => Number }, isApproved: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, uploadedBy: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.PastPaper = PastPaper;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'paper_id' }),
    __metadata("design:type", Number)
], PastPaper.prototype, "paperId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PastPaper.prototype, "university", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PastPaper.prototype, "faculty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PastPaper.prototype, "subjectName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'academic_year', type: 'integer' }),
    __metadata("design:type", Number)
], PastPaper.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exam_year', type: 'integer' }),
    __metadata("design:type", Number)
], PastPaper.prototype, "examYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], PastPaper.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploaded_by_user_id', type: 'integer' }),
    __metadata("design:type", Number)
], PastPaper.prototype, "uploadedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_approved', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], PastPaper.prototype, "isApproved", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], PastPaper.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], PastPaper.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by_user_id' }),
    __metadata("design:type", entities_1.User)
], PastPaper.prototype, "uploadedBy", void 0);
exports.PastPaper = PastPaper = __decorate([
    (0, typeorm_1.Entity)('past_papers')
], PastPaper);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(27), exports);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Campus = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const campus_poi_entity_1 = __webpack_require__(27);
let Campus = class Campus {
    static _OPENAPI_METADATA_FACTORY() {
        return { campusId: { required: true, type: () => Number }, name: { required: true, type: () => String }, latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number }, address: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, pois: { required: true, type: () => [(__webpack_require__(27).CampusPOI)] } };
    }
};
exports.Campus = Campus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'campus_id' }),
    __metadata("design:type", Number)
], Campus.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Campus.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], Campus.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], Campus.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Campus.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Campus.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Campus.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campus_poi_entity_1.CampusPOI, (poi) => poi.campus),
    __metadata("design:type", Array)
], Campus.prototype, "pois", void 0);
exports.Campus = Campus = __decorate([
    (0, typeorm_1.Entity)('campuses')
], Campus);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampusPOI = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const campus_entity_1 = __webpack_require__(26);
let CampusPOI = class CampusPOI {
    static _OPENAPI_METADATA_FACTORY() {
        return { poiId: { required: true, type: () => Number }, campusId: { required: true, type: () => Number }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, latitude: { required: true, type: () => Number }, longitude: { required: true, type: () => Number }, category: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, campus: { required: true, type: () => (__webpack_require__(26).Campus) } };
    }
};
exports.CampusPOI = CampusPOI;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'poi_id' }),
    __metadata("design:type", Number)
], CampusPOI.prototype, "poiId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campus_id', type: 'integer' }),
    __metadata("design:type", Number)
], CampusPOI.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CampusPOI.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], CampusPOI.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], CampusPOI.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], CampusPOI.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CampusPOI.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CampusPOI.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CampusPOI.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campus_entity_1.Campus, (campus) => campus.pois, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campus_id' }),
    __metadata("design:type", campus_entity_1.Campus)
], CampusPOI.prototype, "campus", void 0);
exports.CampusPOI = CampusPOI = __decorate([
    (0, typeorm_1.Entity)('campus_pois')
], CampusPOI);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(29), exports);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatMessage = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
let ChatMessage = class ChatMessage {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, senderId: { required: true, type: () => Number }, receiverId: { required: true, type: () => Number }, message: { required: true, type: () => String }, isRead: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, sender: { required: true, type: () => (__webpack_require__(14).User) }, receiver: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_id' }),
    __metadata("design:type", Number)
], ChatMessage.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receiver_id' }),
    __metadata("design:type", Number)
], ChatMessage.prototype, "receiverId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ChatMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_read', default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", entities_1.User)
], ChatMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'receiver_id' }),
    __metadata("design:type", entities_1.User)
], ChatMessage.prototype, "receiver", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)('chat_messages')
], ChatMessage);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(31), exports);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourceItem = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
let ResourceItem = class ResourceItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, subjectCode: { required: true, type: () => String }, year: { required: true, type: () => String }, semester: { required: true, type: () => Number }, type: { required: true, type: () => String }, filePath: { required: true, type: () => String }, uploaderId: { required: true, type: () => Number }, uploadedAt: { required: true, type: () => Date }, uploader: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.ResourceItem = ResourceItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ResourceItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ResourceItem.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject_code', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ResourceItem.prototype, "subjectCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ResourceItem.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ResourceItem.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ResourceItem.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], ResourceItem.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploader_id', type: 'integer' }),
    __metadata("design:type", Number)
], ResourceItem.prototype, "uploaderId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'uploaded_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], ResourceItem.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'uploader_id' }),
    __metadata("design:type", entities_1.User)
], ResourceItem.prototype, "uploader", void 0);
exports.ResourceItem = ResourceItem = __decorate([
    (0, typeorm_1.Entity)('resource_items')
], ResourceItem);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Complaint = exports.ComplaintStatus = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["PENDING"] = "PENDING";
    ComplaintStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ComplaintStatus["RESOLVED"] = "RESOLVED";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
let Complaint = class Complaint {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, category: { required: true, type: () => String }, status: { required: true, enum: (__webpack_require__(32).ComplaintStatus) }, studentId: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, student: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.Complaint = Complaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Complaint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Complaint.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Complaint.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ComplaintStatus, default: ComplaintStatus.PENDING }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', type: 'integer' }),
    __metadata("design:type", Number)
], Complaint.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Complaint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", entities_1.User)
], Complaint.prototype, "student", void 0);
exports.Complaint = Complaint = __decorate([
    (0, typeorm_1.Entity)('complaints')
], Complaint);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentInvoice = exports.InvoiceStatus = exports.InvoiceType = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
var InvoiceType;
(function (InvoiceType) {
    InvoiceType["DEBIT"] = "DEBIT";
    InvoiceType["CREDIT"] = "CREDIT";
})(InvoiceType || (exports.InvoiceType = InvoiceType = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["PENDING"] = "PENDING";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
let PaymentInvoice = class PaymentInvoice {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, amount: { required: true, type: () => Number }, type: { required: true, enum: (__webpack_require__(33).InvoiceType) }, status: { required: true, enum: (__webpack_require__(33).InvoiceStatus) }, date: { required: true, type: () => Date }, studentId: { required: true, type: () => Number }, student: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.PaymentInvoice = PaymentInvoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PaymentInvoice.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InvoiceType }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING }),
    __metadata("design:type", String)
], PaymentInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], PaymentInvoice.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', type: 'integer' }),
    __metadata("design:type", Number)
], PaymentInvoice.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", entities_1.User)
], PaymentInvoice.prototype, "student", void 0);
exports.PaymentInvoice = PaymentInvoice = __decorate([
    (0, typeorm_1.Entity)('payment_invoices')
], PaymentInvoice);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalMerchant = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const campus_entity_1 = __webpack_require__(26);
let LocalMerchant = class LocalMerchant {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, category: { required: true, type: () => String }, discountDescription: { required: true, type: () => String }, couponCode: { required: true, type: () => String }, campusId: { required: true, type: () => Number }, campus: { required: true, type: () => (__webpack_require__(26).Campus) } };
    }
};
exports.LocalMerchant = LocalMerchant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LocalMerchant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], LocalMerchant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], LocalMerchant.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], LocalMerchant.prototype, "discountDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], LocalMerchant.prototype, "couponCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campus_id', type: 'integer' }),
    __metadata("design:type", Number)
], LocalMerchant.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campus_entity_1.Campus, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campus_id' }),
    __metadata("design:type", campus_entity_1.Campus)
], LocalMerchant.prototype, "campus", void 0);
exports.LocalMerchant = LocalMerchant = __decorate([
    (0, typeorm_1.Entity)('local_merchants')
], LocalMerchant);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampusEvent = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const campus_entity_1 = __webpack_require__(26);
let CampusEvent = class CampusEvent {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, description: { required: true, type: () => String }, date: { required: true, type: () => Date }, registrationLink: { required: true, type: () => String }, campusId: { required: true, type: () => Number }, campus: { required: true, type: () => (__webpack_require__(26).Campus) } };
    }
};
exports.CampusEvent = CampusEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CampusEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CampusEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CampusEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], CampusEvent.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CampusEvent.prototype, "registrationLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campus_id', type: 'integer' }),
    __metadata("design:type", Number)
], CampusEvent.prototype, "campusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campus_entity_1.Campus, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campus_id' }),
    __metadata("design:type", campus_entity_1.Campus)
], CampusEvent.prototype, "campus", void 0);
exports.CampusEvent = CampusEvent = __decorate([
    (0, typeorm_1.Entity)('campus_events')
], CampusEvent);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlumniFeed = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
let AlumniFeed = class AlumniFeed {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, content: { required: true, type: () => String }, company: { required: true, type: () => String }, role: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, authorId: { required: true, type: () => Number }, author: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.AlumniFeed = AlumniFeed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AlumniFeed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AlumniFeed.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AlumniFeed.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AlumniFeed.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], AlumniFeed.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id', type: 'integer' }),
    __metadata("design:type", Number)
], AlumniFeed.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", entities_1.User)
], AlumniFeed.prototype, "author", void 0);
exports.AlumniFeed = AlumniFeed = __decorate([
    (0, typeorm_1.Entity)('alumni_feed')
], AlumniFeed);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnonymousComplaint = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
let AnonymousComplaint = class AnonymousComplaint {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, incidentDescription: { required: true, type: () => String }, location: { required: true, type: () => String }, dateOfIncident: { required: true, type: () => Date }, isUrgent: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date } };
    }
};
exports.AnonymousComplaint = AnonymousComplaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AnonymousComplaint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AnonymousComplaint.prototype, "incidentDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AnonymousComplaint.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], AnonymousComplaint.prototype, "dateOfIncident", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], AnonymousComplaint.prototype, "isUrgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], AnonymousComplaint.prototype, "createdAt", void 0);
exports.AnonymousComplaint = AnonymousComplaint = __decorate([
    (0, typeorm_1.Entity)('anonymous_complaints')
], AnonymousComplaint);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(39);
const passport_1 = __webpack_require__(40);
const config_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(41);
const auth_controller_1 = __webpack_require__(47);
const strategies_1 = __webpack_require__(61);
const users_module_1 = __webpack_require__(64);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('jwt.secret'),
                    signOptions: {
                        expiresIn: configService.get('jwt.expiresIn'),
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, strategies_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 40 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(39);
const config_1 = __webpack_require__(5);
const users_service_1 = __webpack_require__(42);
const enums_1 = __webpack_require__(17);
const google_auth_library_1 = __webpack_require__(44);
const speakeasy = __importStar(__webpack_require__(45));
const qrcode = __importStar(__webpack_require__(46));
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.oauth2Client = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID') || 'YOUR_PLACEHOLDER_CLIENT_ID');
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const user = await this.usersService.create({
            email: registerDto.email,
            password: registerDto.password,
            fullName: registerDto.fullName,
            role: registerDto.role,
            isActive: true,
        });
        if (registerDto.role === enums_1.UserRole.STUDENT) {
            await this.usersService.createStudentProfile(user.userId, registerDto.university, registerDto.faculty, registerDto.academicYear);
        }
        const accessToken = await this.generateToken(user.userId, user.email, user.role);
        return {
            accessToken,
            user: {
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
            },
        };
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        const isPasswordValid = await this.usersService.validatePassword(user, loginDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isTwoFactorEnabled) {
            return {
                requires2FA: true,
                userId: user.userId,
            };
        }
        const accessToken = await this.generateToken(user.userId, user.email, user.role);
        return {
            accessToken,
            user: {
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
            },
        };
    }
    async googleLogin(googleLoginDto) {
        try {
            const ticket = await this.oauth2Client.verifyIdToken({
                idToken: googleLoginDto.token,
                audience: this.configService.get('GOOGLE_CLIENT_ID') || 'YOUR_PLACEHOLDER_CLIENT_ID',
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new common_1.UnauthorizedException('Invalid Google token');
            }
            let user = await this.usersService.findByEmail(payload.email);
            if (!user) {
                user = await this.usersService.create({
                    email: payload.email,
                    password: Math.random().toString(36).slice(-10),
                    fullName: payload.name || `${payload.given_name} ${payload.family_name}`,
                    role: enums_1.UserRole.STUDENT,
                    isActive: true,
                });
                await this.usersService.createStudentProfile(user.userId, 'Unknown', 'Unknown', '1');
            }
            if (user.isTwoFactorEnabled) {
                return {
                    requires2FA: true,
                    userId: user.userId,
                };
            }
            const accessToken = await this.generateToken(user.userId, user.email, user.role);
            return {
                accessToken,
                user: {
                    userId: user.userId,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    isActive: user.isActive,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Google authentication failed');
        }
    }
    async generateTwoFactorAuthSecret(user) {
        const secret = speakeasy.generateSecret({ name: `UniApp (${user.email})` });
        await this.usersService.updateTwoFactorSecret(user.userId, secret.base32);
        const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url || '');
        return { qrCodeDataUrl };
    }
    async turnOnTwoFactorAuthentication(userId, code) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.twoFactorSecret) {
            throw new common_1.UnauthorizedException('2FA secret not generated');
        }
        const isCodeValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
        });
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Invalid 2FA code');
        }
        await this.usersService.enableTwoFactor(userId);
        return { success: true };
    }
    async authenticate2FA(userId, code) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new common_1.UnauthorizedException('2FA is not enabled for this account');
        }
        const isCodeValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
        });
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Invalid 2FA code');
        }
        const accessToken = await this.generateToken(user.userId, user.email, user.role);
        return {
            accessToken,
            user: {
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
            },
        };
    }
    async generateToken(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role,
        };
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: this.configService.get('jwt.expiresIn'),
        });
    }
    async validateToken(token) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('jwt.secret'),
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const bcrypt = __importStar(__webpack_require__(43));
const config_1 = __webpack_require__(5);
const entities_1 = __webpack_require__(13);
let UsersService = class UsersService {
    constructor(userRepository, studentRepository, configService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.configService = configService;
        this.saltRounds = this.configService.get('BCRYPT_SALT_ROUNDS', 10);
    }
    async create(createUserDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        try {
            const passwordHash = await bcrypt.hash(createUserDto.password, this.saltRounds);
            const user = this.userRepository.create({
                email: createUserDto.email,
                passwordHash,
                fullName: createUserDto.fullName,
                role: createUserDto.role,
                isActive: createUserDto.isActive ?? true,
            });
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async createStudentProfile(userId, university, faculty, academicYear) {
        try {
            const student = this.studentRepository.create({
                userId,
                university,
                faculty,
                academicYear,
            });
            return await this.studentRepository.save(student);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create student profile');
        }
    }
    async findAll() {
        return await this.userRepository.find({
            relations: ['student'],
            select: {
                userId: true,
                email: true,
                role: true,
                fullName: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { userId: id },
            relations: ['student'],
        });
        return user;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['student'],
        });
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        try {
            if (updateUserDto.password) {
                const passwordHash = await bcrypt.hash(updateUserDto.password, this.saltRounds);
                user.passwordHash = passwordHash;
            }
            if (updateUserDto.email)
                user.email = updateUserDto.email;
            if (updateUserDto.fullName)
                user.fullName = updateUserDto.fullName;
            if (updateUserDto.role)
                user.role = updateUserDto.role;
            if (updateUserDto.isActive !== undefined)
                user.isActive = updateUserDto.isActive;
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update user');
        }
    }
    async remove(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        try {
            await this.userRepository.remove(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete user');
        }
    }
    async validatePassword(user, password) {
        return await bcrypt.compare(password, user.passwordHash);
    }
    async updateTwoFactorSecret(userId, secret) {
        await this.userRepository.update(userId, { twoFactorSecret: secret });
    }
    async enableTwoFactor(userId) {
        await this.userRepository.update(userId, { isTwoFactorEnabled: true });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], UsersService);


/***/ }),
/* 43 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("google-auth-library");

/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("speakeasy");

/***/ }),
/* 46 */
/***/ ((module) => {

module.exports = require("qrcode");

/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(41);
const dto_1 = __webpack_require__(48);
const decorators_1 = __webpack_require__(54);
const guards_1 = __webpack_require__(58);
const swagger_1 = __webpack_require__(15);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async login(loginDto) {
        return await this.authService.login(loginDto);
    }
    async getProfile(user) {
        return {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };
    }
    async googleLogin(googleLoginDto) {
        return await this.authService.googleLogin(googleLoginDto);
    }
    async generate2FA(user) {
        return await this.authService.generateTwoFactorAuthSecret(user);
    }
    async turnOn2FA(user, body) {
        return await this.authService.turnOnTwoFactorAuthentication(user.userId, body.code);
    }
    async authenticate2FA(body) {
        return await this.authService.authenticate2FA(Number(body.userId), body.code);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user profile returned.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('google'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login with Google OAuth2' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GoogleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/generate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate TOTP secret and QR code' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generate2FA", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/turn-on'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Turn on 2FA by verifying the first code' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.Verify2FADto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOn2FA", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('2fa/authenticate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Exchange 2FA code for JWT token' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.Authenticate2FADto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate2FA", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(52), exports);
__exportStar(__webpack_require__(53), exports);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const enums_1 = __webpack_require__(17);
class RegisterDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/" }, fullName: { required: true, type: () => String, minLength: 2 }, role: { required: true, enum: (__webpack_require__(18).UserRole) }, university: { required: false, type: () => String }, faculty: { required: false, type: () => String }, academicYear: { required: false, type: () => String } };
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Full name must be at least 2 characters long' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.UserRole, { message: 'Invalid user role' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role is required' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "university", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "faculty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "academicYear", void 0);


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class LoginDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleLoginDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class GoogleLoginDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { token: { required: true, type: () => String } };
    }
}
exports.GoogleLoginDto = GoogleLoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GoogleLoginDto.prototype, "token", void 0);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Authenticate2FADto = exports.Verify2FADto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class Verify2FADto {
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, minLength: 6, maxLength: 6 } };
    }
}
exports.Verify2FADto = Verify2FADto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], Verify2FADto.prototype, "code", void 0);
class Authenticate2FADto extends Verify2FADto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String } };
    }
}
exports.Authenticate2FADto = Authenticate2FADto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Authenticate2FADto.prototype, "userId", void 0);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
__exportStar(__webpack_require__(57), exports);


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = void 0;
const common_1 = __webpack_require__(4);
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(4);
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentUser = void 0;
const common_1 = __webpack_require__(4);
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(59), exports);
__exportStar(__webpack_require__(60), exports);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(40);
const core_1 = __webpack_require__(1);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(1);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(62), exports);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(4);
const passport_1 = __webpack_require__(40);
const passport_jwt_1 = __webpack_require__(63);
const config_1 = __webpack_require__(5);
const users_service_1 = __webpack_require__(42);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.secret'),
        });
        this.configService = configService;
        this.usersService = usersService;
    }
    async validate(payload) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], JwtStrategy);


/***/ }),
/* 63 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const users_service_1 = __webpack_require__(42);
const users_controller_1 = __webpack_require__(65);
const entities_1 = __webpack_require__(13);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.User, entities_1.Student])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const users_service_1 = __webpack_require__(42);
const dto_1 = __webpack_require__(66);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto) {
        return await this.usersService.create(createUserDto);
    }
    async findAll() {
        return await this.usersService.findAll();
    }
    async findOne(id, currentUser) {
        if (currentUser.role !== enums_1.UserRole.ADMIN && currentUser.userId !== id) {
            throw new Error('Unauthorized to view this user');
        }
        return await this.usersService.findById(id);
    }
    async update(id, updateUserDto, currentUser) {
        if (currentUser.role !== enums_1.UserRole.ADMIN && currentUser.userId !== id) {
            throw new Error('Unauthorized to update this user');
        }
        return await this.usersService.update(id, updateUserDto);
    }
    async remove(id) {
        await this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: (__webpack_require__(14).User) }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(14).User)] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__(14).User) }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(67), exports);
__exportStar(__webpack_require__(68), exports);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const enums_1 = __webpack_require__(17);
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8 }, fullName: { required: true, type: () => String }, role: { required: true, enum: (__webpack_require__(18).UserRole) }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Full name is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.UserRole, { message: 'Invalid user role' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const enums_1 = __webpack_require__(17);
class UpdateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 8 }, fullName: { required: false, type: () => String }, role: { required: false, enum: (__webpack_require__(18).UserRole) }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.UserRole, { message: 'Invalid user role' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StudentsModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const students_service_1 = __webpack_require__(70);
const students_controller_1 = __webpack_require__(71);
const entities_1 = __webpack_require__(13);
let StudentsModule = class StudentsModule {
};
exports.StudentsModule = StudentsModule;
exports.StudentsModule = StudentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Student])],
        controllers: [students_controller_1.StudentsController],
        providers: [students_service_1.StudentsService],
        exports: [students_service_1.StudentsService],
    })
], StudentsModule);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StudentsService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
let StudentsService = class StudentsService {
    constructor(studentRepository) {
        this.studentRepository = studentRepository;
    }
    async updateProfile(userId, updateStudentProfileDto) {
        let student = await this.studentRepository.findOne({
            where: { userId },
        });
        if (!student) {
            try {
                student = this.studentRepository.create({
                    userId,
                    university: updateStudentProfileDto.university,
                    faculty: updateStudentProfileDto.faculty,
                    academicYear: updateStudentProfileDto.academicYear,
                });
                return await this.studentRepository.save(student);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException('Failed to create student profile');
            }
        }
        try {
            if (updateStudentProfileDto.university !== undefined) {
                student.university = updateStudentProfileDto.university;
            }
            if (updateStudentProfileDto.faculty !== undefined) {
                student.faculty = updateStudentProfileDto.faculty;
            }
            if (updateStudentProfileDto.academicYear !== undefined) {
                student.academicYear = updateStudentProfileDto.academicYear;
            }
            return await this.studentRepository.save(student);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update student profile');
        }
    }
    async getProfile(userId) {
        const student = await this.studentRepository.findOne({
            where: { userId },
            relations: ['user'],
            select: {
                user: {
                    userId: true,
                    email: true,
                    fullName: true,
                    role: true,
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student profile not found');
        }
        return student;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentsService);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StudentsController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const students_service_1 = __webpack_require__(70);
const dto_1 = __webpack_require__(72);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
const swagger_1 = __webpack_require__(15);
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async updateProfile(updateStudentProfileDto, userId) {
        return await this.studentsService.updateProfile(userId, updateStudentProfileDto);
    }
    async getProfile(userId) {
        return await this.studentsService.getProfile(userId);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Patch)('profile'),
    (0, decorators_1.Roles)(enums_1.UserRole.STUDENT),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update student profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student profile updated.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: (__webpack_require__(19).Student) }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateStudentProfileDto, Number]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, decorators_1.Roles)(enums_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get student profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student profile returned.' }),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__(19).Student) }),
    __param(0, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getProfile", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(73), exports);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateStudentProfileDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class UpdateStudentProfileDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { university: { required: false, type: () => String, maxLength: 255 }, faculty: { required: false, type: () => String, maxLength: 255 }, academicYear: { required: false, type: () => String, maxLength: 50 } };
    }
}
exports.UpdateStudentProfileDto = UpdateStudentProfileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'University name must not exceed 255 characters' }),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "university", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Faculty name must not exceed 255 characters' }),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "faculty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Academic year must not exceed 50 characters' }),
    __metadata("design:type", String)
], UpdateStudentProfileDto.prototype, "academicYear", void 0);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const boarding_service_1 = __webpack_require__(75);
const boarding_review_service_1 = __webpack_require__(79);
const boarding_controller_1 = __webpack_require__(80);
const boarding_review_controller_1 = __webpack_require__(89);
const entities_1 = __webpack_require__(20);
const notifications_module_1 = __webpack_require__(90);
let BoardingModule = class BoardingModule {
};
exports.BoardingModule = BoardingModule;
exports.BoardingModule = BoardingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.BoardingPost, entities_1.BoardingReview]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [boarding_controller_1.BoardingController, boarding_review_controller_1.BoardingReviewController],
        providers: [boarding_service_1.BoardingService, boarding_review_service_1.BoardingReviewService],
        exports: [boarding_service_1.BoardingService],
    })
], BoardingModule);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(20);
const notifications_gateway_1 = __webpack_require__(76);
let BoardingService = class BoardingService {
    constructor(boardingPostRepository, notificationsGateway) {
        this.boardingPostRepository = boardingPostRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async create(providerUserId, createBoardingPostDto) {
        try {
            const boardingPost = this.boardingPostRepository.create({
                providerUserId,
                title: createBoardingPostDto.title,
                description: createBoardingPostDto.description,
                monthlyRent: createBoardingPostDto.monthlyRent,
                isAvailable: createBoardingPostDto.isAvailable ?? true,
                locationDetails: createBoardingPostDto.locationDetails,
                images: createBoardingPostDto.images ?? [],
            });
            const saved = await this.boardingPostRepository.save(boardingPost);
            this.notificationsGateway.sendToUser(providerUserId, {
                id: `boarding-created-${saved.postId}-${Date.now()}`,
                title: '🏠 Listing Published',
                message: `Your listing "${saved.title}" is now live!`,
                type: 'success',
                createdAt: new Date().toISOString(),
            });
            return saved;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create boarding post');
        }
    }
    async findMyPosts(providerUserId) {
        return await this.boardingPostRepository.find({
            where: { providerUserId },
            order: { createdAt: 'DESC' },
        });
    }
    async findAllWithFilters(filterDto) {
        const { location, minPrice, maxPrice, available, page = 1, limit = 10 } = filterDto;
        const where = {};
        if (available !== undefined) {
            where.isAvailable = available;
        }
        else {
            where.isAvailable = true;
        }
        if (location) {
            where.locationDetails = (0, typeorm_2.ILike)(`%${location.trim()}%`);
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            where.monthlyRent = (0, typeorm_2.Between)(minPrice, maxPrice);
        }
        else if (minPrice !== undefined) {
            where.monthlyRent = (0, typeorm_2.MoreThanOrEqual)(minPrice);
        }
        else if (maxPrice !== undefined) {
            where.monthlyRent = (0, typeorm_2.LessThanOrEqual)(maxPrice);
        }
        const skip = (page - 1) * limit;
        const [data, total] = await this.boardingPostRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            relations: ['provider', 'reviews'],
            select: {
                provider: {
                    userId: true,
                    fullName: true,
                    email: true,
                },
            },
            take: limit,
            skip,
        });
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async findOne(postId) {
        const post = await this.boardingPostRepository.findOne({
            where: { postId },
            relations: ['provider', 'reviews'],
            select: {
                provider: {
                    userId: true,
                    fullName: true,
                    email: true,
                },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('Boarding post not found');
        }
        this.notificationsGateway.sendToUser(post.providerUserId, {
            id: `boarding-view-${postId}-${Date.now()}`,
            title: '👀 Someone viewed your listing',
            message: `A user just viewed your post "${post.title}".`,
            type: 'boarding',
            createdAt: new Date().toISOString(),
        });
        return post;
    }
    async update(postId, providerUserId, updateBoardingPostDto) {
        const post = await this.boardingPostRepository.findOne({
            where: { postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Boarding post not found');
        }
        if (post.providerUserId !== providerUserId) {
            throw new common_1.ForbiddenException('You can only update your own posts');
        }
        try {
            if (updateBoardingPostDto.title !== undefined) {
                post.title = updateBoardingPostDto.title;
            }
            if (updateBoardingPostDto.description !== undefined) {
                post.description = updateBoardingPostDto.description;
            }
            if (updateBoardingPostDto.monthlyRent !== undefined) {
                post.monthlyRent = updateBoardingPostDto.monthlyRent;
            }
            if (updateBoardingPostDto.isAvailable !== undefined) {
                post.isAvailable = updateBoardingPostDto.isAvailable;
            }
            if (updateBoardingPostDto.locationDetails !== undefined) {
                post.locationDetails = updateBoardingPostDto.locationDetails;
            }
            if (updateBoardingPostDto.images !== undefined) {
                post.images = updateBoardingPostDto.images;
            }
            return await this.boardingPostRepository.save(post);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update boarding post');
        }
    }
    async remove(postId, providerUserId) {
        const post = await this.boardingPostRepository.findOne({
            where: { postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Boarding post not found');
        }
        if (post.providerUserId !== providerUserId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        try {
            await this.boardingPostRepository.remove(post);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete boarding post');
        }
    }
    async getProviderAnalytics(providerUserId) {
        const posts = await this.boardingPostRepository.find({
            where: { providerUserId },
            relations: ['reviews'],
        });
        const totalPosts = posts.length;
        let totalReviewsCount = 0;
        let totalRatingSum = 0;
        const ratingDistribution = [
            { rating: 1, count: 0 },
            { rating: 2, count: 0 },
            { rating: 3, count: 0 },
            { rating: 4, count: 0 },
            { rating: 5, count: 0 },
        ];
        for (const post of posts) {
            if (post.reviews && post.reviews.length > 0) {
                totalReviewsCount += post.reviews.length;
                for (const review of post.reviews) {
                    totalRatingSum += review.rating;
                    const index = ratingDistribution.findIndex(r => r.rating === review.rating);
                    if (index !== -1) {
                        ratingDistribution[index].count++;
                    }
                }
            }
        }
        const averageRating = totalReviewsCount > 0
            ? Number((totalRatingSum / totalReviewsCount).toFixed(1))
            : 0;
        return {
            totalPosts,
            totalReviewsCount,
            averageRating,
            ratingDistribution,
        };
    }
};
exports.BoardingService = BoardingService;
exports.BoardingService = BoardingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.BoardingPost)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], BoardingService);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsGateway = void 0;
const websockets_1 = __webpack_require__(77);
const socket_io_1 = __webpack_require__(78);
const common_1 = __webpack_require__(4);
const jwt_1 = __webpack_require__(39);
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
        this.userSockets = new Map();
    }
    afterInit(server) {
        this.logger.log('🔌 NotificationsGateway initialised');
    }
    async handleConnection(client) {
        try {
            const userId = this.extractUserIdFromHandshake(client);
            if (!userId) {
                this.logger.warn(`Socket ${client.id} — no/invalid token; disconnecting`);
                client.disconnect(true);
                return;
            }
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId).add(client.id);
            client.userId = userId;
            this.logger.log(`✅ User ${userId} connected (socket ${client.id}) — active sockets: ${this.userSockets.get(userId).size}`);
            client.emit('connected', { userId, socketId: client.id });
        }
        catch (err) {
            this.logger.error(`handleConnection error: ${err}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const userId = client.userId;
        if (userId !== undefined) {
            const sockets = this.userSockets.get(userId);
            if (sockets) {
                sockets.delete(client.id);
                if (sockets.size === 0)
                    this.userSockets.delete(userId);
            }
            this.logger.log(`❌ User ${userId} disconnected (socket ${client.id})`);
        }
    }
    sendToUser(userId, payload) {
        const sockets = this.userSockets.get(userId);
        if (!sockets || sockets.size === 0) {
            this.logger.debug(`sendToUser(${userId}) — user not connected; skipping`);
            return;
        }
        sockets.forEach((socketId) => {
            this.server.to(socketId).emit('notification', payload);
        });
        this.logger.log(`📨 Notification sent to user ${userId} on ${sockets.size} socket(s): "${payload.title}"`);
    }
    broadcastToAll(payload) {
        this.server.emit('notification', payload);
        this.logger.log(`📣 Broadcast notification: "${payload.title}"`);
    }
    emitToUser(userId, event, payload) {
        const sockets = this.userSockets.get(userId);
        if (!sockets || sockets.size === 0)
            return;
        sockets.forEach((socketId) => {
            this.server.to(socketId).emit(event, payload);
        });
    }
    handlePing(client, data) {
        client.emit('pong', { timestamp: new Date().toISOString() });
    }
    extractUserIdFromHandshake(client) {
        try {
            const raw = client.handshake.auth?.token ??
                client.handshake.headers?.authorization;
            if (!raw)
                return null;
            const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
            const payload = this.jwtService.verify(token);
            const userId = payload.sub ?? payload.userId;
            return typeof userId === 'number' ? userId : null;
        }
        catch {
            return null;
        }
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handlePing", null);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
        },
        namespace: '/notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);


/***/ }),
/* 77 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 78 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingReviewService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(20);
let BoardingReviewService = class BoardingReviewService {
    constructor(reviewRepository, boardingRepository) {
        this.reviewRepository = reviewRepository;
        this.boardingRepository = boardingRepository;
    }
    async createReview(postId, studentUserId, createReviewDto) {
        const post = await this.boardingRepository.findOne({ where: { postId } });
        if (!post) {
            throw new common_1.NotFoundException('Boarding post not found');
        }
        const existing = await this.reviewRepository.findOne({
            where: { postId, studentUserId },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this boarding post');
        }
        try {
            const review = this.reviewRepository.create({
                postId,
                studentUserId,
                rating: createReviewDto.rating,
                comment: createReviewDto.comment,
            });
            return await this.reviewRepository.save(review);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create review');
        }
    }
    async getReviews(postId) {
        return await this.reviewRepository.find({
            where: { postId },
            relations: ['student'],
            select: {
                student: {
                    userId: true,
                    fullName: true,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.BoardingReviewService = BoardingReviewService;
exports.BoardingReviewService = BoardingReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.BoardingReview)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.BoardingPost)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BoardingReviewService);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(2);
const multer_1 = __webpack_require__(81);
const path_1 = __webpack_require__(82);
const uuid_1 = __webpack_require__(83);
const boarding_service_1 = __webpack_require__(75);
const dto_1 = __webpack_require__(84);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
const swagger_1 = __webpack_require__(15);
const boardingImageStorage = (0, multer_1.diskStorage)({
    destination: process.env.UPLOAD_DIR || '/tmp/uploads/boarding',
    filename: (_req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const imageFileFilter = (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
    if (allowed.test((0, path_1.extname)(file.originalname))) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed'), false);
    }
};
let BoardingController = class BoardingController {
    constructor(boardingService) {
        this.boardingService = boardingService;
    }
    async create(createBoardingPostDto, userId, files) {
        if (files && files.length > 0) {
            createBoardingPostDto.images = files.map((f) => `/uploads/boarding/${f.filename}`);
        }
        return await this.boardingService.create(userId, createBoardingPostDto);
    }
    async getMyPosts(userId) {
        return await this.boardingService.findMyPosts(userId);
    }
    async getProviderAnalytics(userId) {
        return await this.boardingService.getProviderAnalytics(userId);
    }
    async findAll(filterDto) {
        return await this.boardingService.findAllWithFilters(filterDto);
    }
    async findOne(id) {
        return await this.boardingService.findOne(id);
    }
    async update(id, updateBoardingPostDto, userId, files) {
        if (files && files.length > 0) {
            updateBoardingPostDto.images = files.map((f) => `/uploads/boarding/${f.filename}`);
        }
        return await this.boardingService.update(id, userId, updateBoardingPostDto);
    }
    async remove(id, userId) {
        await this.boardingService.remove(id, userId);
    }
};
exports.BoardingController = BoardingController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(enums_1.UserRole.BOARDING_PROVIDER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new boarding post (with optional image uploads)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Boarding post created.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 6, {
        storage: boardingImageStorage,
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: (__webpack_require__(21).BoardingPost) }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('userId')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBoardingPostDto, Number, Array]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-posts'),
    (0, decorators_1.Roles)(enums_1.UserRole.BOARDING_PROVIDER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all posts created by the authenticated provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of posts.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(21).BoardingPost)] }),
    __param(0, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "getMyPosts", null);
__decorate([
    (0, common_1.Get)('provider/analytics'),
    (0, decorators_1.Roles)(enums_1.UserRole.BOARDING_PROVIDER),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics dashboard metrics for the provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics data returned.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "getProviderAnalytics", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all boarding posts with optional search & filtering' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of boarding posts.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetBoardingFilterDto]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single boarding post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The boarding post.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Boarding post not found.' }),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__(21).BoardingPost) }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.BOARDING_PROVIDER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a boarding post (with optional image uploads)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Boarding post updated.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 6, {
        storage: boardingImageStorage,
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__(21).BoardingPost) }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('userId')),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateBoardingPostDto, Number, Array]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.BOARDING_PROVIDER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a boarding post' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Boarding post deleted.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BoardingController.prototype, "remove", null);
exports.BoardingController = BoardingController = __decorate([
    (0, swagger_1.ApiTags)('Boarding'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('boarding'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [boarding_service_1.BoardingService])
], BoardingController);


/***/ }),
/* 81 */
/***/ ((module) => {

module.exports = require("multer");

/***/ }),
/* 82 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 83 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(85), exports);
__exportStar(__webpack_require__(86), exports);
__exportStar(__webpack_require__(87), exports);
__exportStar(__webpack_require__(88), exports);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBoardingPostDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class CreateBoardingPostDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, maxLength: 255 }, description: { required: false, type: () => String }, monthlyRent: { required: true, type: () => Number, minimum: 0 }, isAvailable: { required: false, type: () => Boolean }, locationDetails: { required: false, type: () => String, maxLength: 500 }, latitude: { required: false, type: () => Number }, longitude: { required: false, type: () => Number }, images: { required: false, type: () => [String] } };
    }
}
exports.CreateBoardingPostDto = CreateBoardingPostDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Title must not exceed 255 characters' }),
    __metadata("design:type", String)
], CreateBoardingPostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBoardingPostDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Monthly rent is required' }),
    (0, class_validator_1.Min)(0, { message: 'Monthly rent must be a positive number' }),
    __metadata("design:type", Number)
], CreateBoardingPostDto.prototype, "monthlyRent", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBoardingPostDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Location details must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateBoardingPostDto.prototype, "locationDetails", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBoardingPostDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBoardingPostDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateBoardingPostDto.prototype, "images", void 0);


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateBoardingPostDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class UpdateBoardingPostDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, maxLength: 255 }, description: { required: false, type: () => String }, monthlyRent: { required: false, type: () => Number, minimum: 0 }, isAvailable: { required: false, type: () => Boolean }, locationDetails: { required: false, type: () => String, maxLength: 500 }, latitude: { required: false, type: () => Number }, longitude: { required: false, type: () => Number }, images: { required: false, type: () => [String] } };
    }
}
exports.UpdateBoardingPostDto = UpdateBoardingPostDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'Title must not exceed 255 characters' }),
    __metadata("design:type", String)
], UpdateBoardingPostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBoardingPostDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'Monthly rent must be a positive number' }),
    __metadata("design:type", Number)
], UpdateBoardingPostDto.prototype, "monthlyRent", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateBoardingPostDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Location details must not exceed 500 characters' }),
    __metadata("design:type", String)
], UpdateBoardingPostDto.prototype, "locationDetails", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateBoardingPostDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateBoardingPostDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateBoardingPostDto.prototype, "images", void 0);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetBoardingFilterDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const class_transformer_1 = __webpack_require__(16);
class GetBoardingFilterDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { location: { required: false, type: () => String }, minPrice: { required: false, type: () => Number, minimum: 0 }, maxPrice: { required: false, type: () => Number, minimum: 0 }, available: { required: false, type: () => Boolean }, page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 10, minimum: 1 } };
    }
}
exports.GetBoardingFilterDto = GetBoardingFilterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetBoardingFilterDto.prototype, "location", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'minPrice must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'minPrice must be a non-negative number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetBoardingFilterDto.prototype, "minPrice", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'maxPrice must be a valid number' }),
    (0, class_validator_1.Min)(0, { message: 'maxPrice must be a non-negative number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetBoardingFilterDto.prototype, "maxPrice", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)({ message: 'available must be a boolean (true or false)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetBoardingFilterDto.prototype, "available", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'page must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'page must be at least 1' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetBoardingFilterDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'limit must be a valid number' }),
    (0, class_validator_1.Min)(1, { message: 'limit must be at least 1' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetBoardingFilterDto.prototype, "limit", void 0);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBoardingReviewDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class CreateBoardingReviewDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { rating: { required: true, type: () => Number, minimum: 1, maximum: 5 }, comment: { required: true, type: () => String } };
    }
}
exports.CreateBoardingReviewDto = CreateBoardingReviewDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Rating must be at least 1' }),
    (0, class_validator_1.Max)(5, { message: 'Rating must not exceed 5' }),
    __metadata("design:type", Number)
], CreateBoardingReviewDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Comment is required' }),
    __metadata("design:type", String)
], CreateBoardingReviewDto.prototype, "comment", void 0);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardingReviewController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const boarding_review_service_1 = __webpack_require__(79);
const dto_1 = __webpack_require__(84);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
const swagger_1 = __webpack_require__(15);
let BoardingReviewController = class BoardingReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(postId, createReviewDto, userId) {
        return await this.reviewService.createReview(postId, userId, createReviewDto);
    }
    async getReviews(postId) {
        return await this.reviewService.getReviews(postId);
    }
};
exports.BoardingReviewController = BoardingReviewController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)(enums_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a review for a boarding post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already reviewed this post.' }),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__(22).BoardingReview) }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateBoardingReviewDto, Number]),
    __metadata("design:returntype", Promise)
], BoardingReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews for a boarding post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of reviews returned.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(22).BoardingReview)] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardingReviewController.prototype, "getReviews", null);
exports.BoardingReviewController = BoardingReviewController = __decorate([
    (0, swagger_1.ApiTags)('Boarding Reviews'),
    (0, common_1.Controller)('boarding/:id/reviews'),
    __metadata("design:paramtypes", [boarding_review_service_1.BoardingReviewService])
], BoardingReviewController);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(39);
const config_1 = __webpack_require__(5);
const notifications_service_1 = __webpack_require__(91);
const notifications_controller_1 = __webpack_require__(93);
const admin_notifications_controller_1 = __webpack_require__(94);
const notifications_gateway_1 = __webpack_require__(76);
const notification_entity_1 = __webpack_require__(92);
const users_module_1 = __webpack_require__(64);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification]),
            users_module_1.UsersModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('jwt.secret'),
                    signOptions: { expiresIn: config.get('jwt.expiresIn', '7d') },
                }),
            }),
        ],
        providers: [notifications_service_1.NotificationsService, notifications_gateway_1.NotificationsGateway],
        controllers: [notifications_controller_1.NotificationsController, admin_notifications_controller_1.AdminNotificationsController],
        exports: [notifications_gateway_1.NotificationsGateway, notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),
/* 91 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const notification_entity_1 = __webpack_require__(92);
let NotificationsService = class NotificationsService {
    constructor(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async createNotification(dto, userId) {
        if (dto.target_type === 'University-Specific' && !dto.target_university) {
            throw new common_1.BadRequestException('target_university is required for University-Specific notifications');
        }
        if (dto.target_type === 'Faculty-Specific' && (!dto.target_university || !dto.target_faculty)) {
            throw new common_1.BadRequestException('target_university and target_faculty are required for Faculty-Specific notifications');
        }
        if (dto.is_event && !dto.event_date) {
            throw new common_1.BadRequestException('event_date is required for event notifications');
        }
        const notification = this.notificationsRepository.create({
            ...dto,
            user: { userId: userId },
        });
        return await this.notificationsRepository.save(notification);
    }
    async getStudentFeed(studentProfile) {
        const { university, faculty, academic_year } = studentProfile;
        return await this.notificationsRepository
            .createQueryBuilder('notification')
            .where('notification.target_type = :general', { general: 'General' })
            .orWhere('(notification.target_university = :university AND notification.target_faculty = :faculty AND notification.target_year = :year)', { university, faculty, year: academic_year })
            .orWhere('(notification.target_university = :university AND notification.target_faculty = :faculty AND notification.target_year IS NULL)', { university, faculty })
            .orWhere('(notification.target_university = :university AND notification.target_faculty IS NULL AND notification.target_year IS NULL)', { university })
            .orderBy('notification.posted_at', 'DESC')
            .getMany();
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Notification = void 0;
const openapi = __webpack_require__(15);
const typeorm_1 = __webpack_require__(11);
const entities_1 = __webpack_require__(13);
let Notification = class Notification {
    static _OPENAPI_METADATA_FACTORY() {
        return { notificationId: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, title: { required: true, type: () => String }, content: { required: true, type: () => String }, isRead: { required: true, type: () => Boolean }, type: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, user: { required: true, type: () => (__webpack_require__(14).User) } };
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'notification_id' }),
    __metadata("design:type", Number)
], Notification.prototype, "notificationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'integer' }),
    __metadata("design:type", Number)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'info' }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Notification.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => entities_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", entities_1.User)
], Notification.prototype, "user", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications')
], Notification);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const notifications_service_1 = __webpack_require__(91);
const jwt_auth_guard_1 = __webpack_require__(59);
const roles_guard_1 = __webpack_require__(60);
const roles_decorator_1 = __webpack_require__(56);
const users_service_1 = __webpack_require__(42);
const enums_1 = __webpack_require__(17);
let NotificationsController = class NotificationsController {
    constructor(notificationsService, usersService) {
        this.notificationsService = notificationsService;
        this.usersService = usersService;
    }
    async getMyFeed(req) {
        const userId = req.user.user_id;
        const user = await this.usersService.findById(userId);
        if (!user || !user.student) {
            throw new Error('Student profile not found');
        }
        const profile = {
            university: user.student.university,
            faculty: user.student.faculty,
            academic_year: Number(user.student.academicYear),
        };
        return await this.notificationsService.getStudentFeed(profile);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('my-feed'),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(92).Notification)] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getMyFeed", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('api/v1/notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.STUDENT),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        users_service_1.UsersService])
], NotificationsController);


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminNotificationsController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const notifications_service_1 = __webpack_require__(91);
const create_notification_dto_1 = __webpack_require__(95);
const jwt_auth_guard_1 = __webpack_require__(59);
const roles_guard_1 = __webpack_require__(60);
const enums_1 = __webpack_require__(17);
const roles_decorator_1 = __webpack_require__(56);
let AdminNotificationsController = class AdminNotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async createNotification(dto, req) {
        const userId = req.user.user_id;
        return await this.notificationsService.createNotification(dto, userId);
    }
};
exports.AdminNotificationsController = AdminNotificationsController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__(92).Notification) }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notification_dto_1.CreateNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], AdminNotificationsController.prototype, "createNotification", null);
exports.AdminNotificationsController = AdminNotificationsController = __decorate([
    (0, common_1.Controller)('api/v1/admin/notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], AdminNotificationsController);


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateNotificationDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class CreateNotificationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, content: { required: true, type: () => String }, target_type: { required: true, type: () => String }, target_university: { required: false, type: () => String }, target_faculty: { required: false, type: () => String }, target_year: { required: false, type: () => Number }, is_event: { required: true, type: () => Boolean }, event_date: { required: false, type: () => Date } };
    }
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "target_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "target_university", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "target_faculty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNotificationDto.prototype, "target_year", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "is_event", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateNotificationDto.prototype, "event_date", void 0);


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PastPapersModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const platform_express_1 = __webpack_require__(2);
const past_papers_service_1 = __webpack_require__(97);
const past_papers_controller_1 = __webpack_require__(100);
const entities_1 = __webpack_require__(23);
const multer_config_1 = __webpack_require__(104);
let PastPapersModule = class PastPapersModule {
};
exports.PastPapersModule = PastPapersModule;
exports.PastPapersModule = PastPapersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.PastPaper]), platform_express_1.MulterModule.register(multer_config_1.multerConfig)],
        controllers: [past_papers_controller_1.PastPapersController],
        providers: [past_papers_service_1.PastPapersService],
        exports: [past_papers_service_1.PastPapersService],
    })
], PastPapersModule);


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PastPapersService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(23);
const promises_1 = __webpack_require__(98);
const fs_1 = __webpack_require__(99);
let PastPapersService = class PastPapersService {
    constructor(pastPaperRepository) {
        this.pastPaperRepository = pastPaperRepository;
    }
    async upload(uploadDto, filePath, userId) {
        try {
            const pastPaper = this.pastPaperRepository.create({
                university: uploadDto.university,
                faculty: uploadDto.faculty,
                subjectName: uploadDto.subjectName,
                academicYear: uploadDto.academicYear,
                examYear: uploadDto.examYear,
                filePath,
                uploadedByUserId: userId,
                isApproved: false,
            });
            return await this.pastPaperRepository.save(pastPaper);
        }
        catch (error) {
            if ((0, fs_1.existsSync)(filePath)) {
                await (0, promises_1.unlink)(filePath).catch(() => { });
            }
            throw new common_1.InternalServerErrorException('Failed to upload past paper');
        }
    }
    async findAll(filterDto) {
        const query = this.pastPaperRepository
            .createQueryBuilder('paper')
            .where('paper.isApproved = :isApproved', { isApproved: true });
        if (filterDto.university) {
            query.andWhere('LOWER(paper.university) = LOWER(:university)', {
                university: filterDto.university,
            });
        }
        if (filterDto.faculty) {
            query.andWhere('LOWER(paper.faculty) = LOWER(:faculty)', {
                faculty: filterDto.faculty,
            });
        }
        if (filterDto.subjectName) {
            query.andWhere('LOWER(paper.subjectName) LIKE LOWER(:subjectName)', {
                subjectName: `%${filterDto.subjectName}%`,
            });
        }
        if (filterDto.academicYear) {
            query.andWhere('paper.academicYear = :academicYear', {
                academicYear: filterDto.academicYear,
            });
        }
        if (filterDto.examYear) {
            query.andWhere('paper.examYear = :examYear', {
                examYear: filterDto.examYear,
            });
        }
        query.orderBy('paper.examYear', 'DESC').addOrderBy('paper.createdAt', 'DESC');
        return await query.getMany();
    }
    async findOne(paperId) {
        const paper = await this.pastPaperRepository.findOne({
            where: { paperId },
            relations: ['uploadedBy'],
            select: {
                uploadedBy: {
                    userId: true,
                    fullName: true,
                    email: true,
                },
            },
        });
        if (!paper) {
            throw new common_1.NotFoundException('Past paper not found');
        }
        return paper;
    }
    async approve(paperId) {
        const paper = await this.findOne(paperId);
        paper.isApproved = true;
        return await this.pastPaperRepository.save(paper);
    }
    async remove(paperId) {
        const paper = await this.findOne(paperId);
        try {
            if ((0, fs_1.existsSync)(paper.filePath)) {
                await (0, promises_1.unlink)(paper.filePath);
            }
            await this.pastPaperRepository.remove(paper);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete past paper');
        }
    }
    async findByUploader(userId) {
        return await this.pastPaperRepository.find({
            where: { uploadedByUserId: userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getStatistics() {
        const total = await this.pastPaperRepository.count();
        const approved = await this.pastPaperRepository.count({
            where: { isApproved: true },
        });
        const pending = total - approved;
        return { total, approved, pending };
    }
};
exports.PastPapersService = PastPapersService;
exports.PastPapersService = PastPapersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.PastPaper)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PastPapersService);


/***/ }),
/* 98 */
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),
/* 99 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PastPapersController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(2);
const past_papers_service_1 = __webpack_require__(97);
const dto_1 = __webpack_require__(101);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
const multer_config_1 = __webpack_require__(104);
const fs_1 = __webpack_require__(99);
let PastPapersController = class PastPapersController {
    constructor(pastPapersService) {
        this.pastPapersService = pastPapersService;
    }
    async upload(file, uploadDto, userId) {
        if (!file) {
            throw new common_1.BadRequestException('PDF file is required');
        }
        const dto = {
            ...uploadDto,
            academicYear: parseInt(uploadDto.academicYear, 10),
            examYear: parseInt(uploadDto.examYear, 10),
        };
        const pastPaper = await this.pastPapersService.upload(dto, file.path, userId);
        return {
            message: 'Past paper uploaded successfully',
            data: pastPaper,
        };
    }
    async findAll(filterDto) {
        const papers = await this.pastPapersService.findAll(filterDto);
        return {
            message: 'Past papers retrieved successfully',
            count: papers.length,
            data: papers,
        };
    }
    async findOne(id) {
        const paper = await this.pastPapersService.findOne(id);
        return {
            message: 'Past paper retrieved successfully',
            data: paper,
        };
    }
    async download(paperId, res) {
        const paper = await this.pastPapersService.findOne(paperId);
        if (!(0, fs_1.existsSync)(paper.filePath)) {
            throw new common_1.BadRequestException('File not found on server');
        }
        const filename = `${paper.university}_${paper.faculty}_${paper.subjectName}_${paper.examYear}.pdf`
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_.-]/g, '');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const fileStream = (0, fs_1.createReadStream)(paper.filePath);
        fileStream.pipe(res);
    }
    async approve(id) {
        const paper = await this.pastPapersService.approve(id);
        return {
            message: 'Past paper approved successfully',
            data: paper,
        };
    }
    async remove(id) {
        await this.pastPapersService.remove(id);
    }
    async getMyUploads(userId) {
        const papers = await this.pastPapersService.findByUploader(userId);
        return {
            message: 'Your uploads retrieved successfully',
            count: papers.length,
            data: papers,
        };
    }
    async getStatistics() {
        const stats = await this.pastPapersService.getStatistics();
        return {
            message: 'Statistics retrieved successfully',
            data: stats,
        };
    }
};
exports.PastPapersController = PastPapersController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multer_config_1.multerConfig)),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UploadPastPaperDto, Number]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FilterPastPapersDto]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('download/:paperId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('paperId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "download", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "approve", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('my/uploads'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "getMyUploads", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PastPapersController.prototype, "getStatistics", null);
exports.PastPapersController = PastPapersController = __decorate([
    (0, common_1.Controller)('past-papers'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [past_papers_service_1.PastPapersService])
], PastPapersController);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(102), exports);
__exportStar(__webpack_require__(103), exports);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadPastPaperDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class UploadPastPaperDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { university: { required: true, type: () => String, maxLength: 255 }, faculty: { required: true, type: () => String, maxLength: 255 }, subjectName: { required: true, type: () => String, maxLength: 255 }, academicYear: { required: true, type: () => Number, minimum: 1, maximum: 10 }, examYear: { required: true, type: () => Number, minimum: 1900, maximum: 2100 } };
    }
}
exports.UploadPastPaperDto = UploadPastPaperDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'University is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'University name must not exceed 255 characters' }),
    __metadata("design:type", String)
], UploadPastPaperDto.prototype, "university", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Faculty is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Faculty name must not exceed 255 characters' }),
    __metadata("design:type", String)
], UploadPastPaperDto.prototype, "faculty", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Subject name is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Subject name must not exceed 255 characters' }),
    __metadata("design:type", String)
], UploadPastPaperDto.prototype, "subjectName", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Academic year must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Academic year must be at least 1' }),
    (0, class_validator_1.Max)(10, { message: 'Academic year must not exceed 10' }),
    __metadata("design:type", Number)
], UploadPastPaperDto.prototype, "academicYear", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Exam year must be an integer' }),
    (0, class_validator_1.Min)(1900, { message: 'Exam year must be at least 1900' }),
    (0, class_validator_1.Max)(2100, { message: 'Exam year must not exceed 2100' }),
    __metadata("design:type", Number)
], UploadPastPaperDto.prototype, "examYear", void 0);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FilterPastPapersDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const class_transformer_1 = __webpack_require__(16);
class FilterPastPapersDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { university: { required: false, type: () => String }, faculty: { required: false, type: () => String }, subjectName: { required: false, type: () => String }, academicYear: { required: false, type: () => Number, minimum: 1 }, examYear: { required: false, type: () => Number, minimum: 1900 } };
    }
}
exports.FilterPastPapersDto = FilterPastPapersDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterPastPapersDto.prototype, "university", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterPastPapersDto.prototype, "faculty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterPastPapersDto.prototype, "subjectName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterPastPapersDto.prototype, "academicYear", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    __metadata("design:type", Number)
], FilterPastPapersDto.prototype, "examYear", void 0);


/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUploadDir = exports.multerConfig = void 0;
const multer_1 = __webpack_require__(81);
const path_1 = __webpack_require__(82);
const fs_1 = __webpack_require__(99);
const common_1 = __webpack_require__(4);
const uploadDir = process.env.UPLOAD_DIR || '/tmp/uploads/past-papers';
if (!(0, fs_1.existsSync)(uploadDir)) {
    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
}
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = (0, path_1.extname)(file.originalname);
            cb(null, `paper-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new common_1.BadRequestException('Only PDF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
};
const getUploadDir = () => uploadDir;
exports.getUploadDir = getUploadDir;


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampusGuideModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const campus_guide_service_1 = __webpack_require__(106);
const campus_guide_controller_1 = __webpack_require__(107);
const entities_1 = __webpack_require__(25);
let CampusGuideModule = class CampusGuideModule {
};
exports.CampusGuideModule = CampusGuideModule;
exports.CampusGuideModule = CampusGuideModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Campus, entities_1.CampusPOI])],
        controllers: [campus_guide_controller_1.CampusGuideController],
        providers: [campus_guide_service_1.CampusGuideService],
        exports: [campus_guide_service_1.CampusGuideService],
    })
], CampusGuideModule);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampusGuideService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(25);
let CampusGuideService = class CampusGuideService {
    constructor(campusRepository, poiRepository) {
        this.campusRepository = campusRepository;
        this.poiRepository = poiRepository;
    }
    async createCampus(createCampusDto) {
        try {
            const existing = await this.campusRepository.findOne({
                where: { name: createCampusDto.name },
            });
            if (existing) {
                throw new common_1.ConflictException('Campus with this name already exists');
            }
            const campus = this.campusRepository.create(createCampusDto);
            return await this.campusRepository.save(campus);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create campus');
        }
    }
    async createPOI(createPOIDto) {
        try {
            const campus = await this.campusRepository.findOne({
                where: { campusId: createPOIDto.campusId },
            });
            if (!campus) {
                throw new common_1.NotFoundException('Campus not found');
            }
            const poi = this.poiRepository.create(createPOIDto);
            return await this.poiRepository.save(poi);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create POI');
        }
    }
    async getAllCampuses() {
        return await this.campusRepository.find({
            order: { name: 'ASC' },
        });
    }
    async getCampusById(campusId) {
        const campus = await this.campusRepository.findOne({
            where: { campusId },
        });
        if (!campus) {
            throw new common_1.NotFoundException('Campus not found');
        }
        return campus;
    }
    async getPOIsByCampus(campusId) {
        await this.getCampusById(campusId);
        return await this.poiRepository.find({
            where: { campusId },
            order: { category: 'ASC', name: 'ASC' },
        });
    }
    async getAllCampusesWithPOIs() {
        return await this.campusRepository.find({
            relations: ['pois'],
            order: { name: 'ASC' },
        });
    }
    async updateCampus(campusId, updateData) {
        const campus = await this.getCampusById(campusId);
        Object.assign(campus, updateData);
        return await this.campusRepository.save(campus);
    }
    async deleteCampus(campusId) {
        const campus = await this.getCampusById(campusId);
        await this.campusRepository.remove(campus);
    }
    async deletePOI(poiId) {
        const poi = await this.poiRepository.findOne({
            where: { poiId },
        });
        if (!poi) {
            throw new common_1.NotFoundException('POI not found');
        }
        await this.poiRepository.remove(poi);
    }
    async getPOIsByCategory(category) {
        return await this.poiRepository.find({
            where: { category },
            order: { name: 'ASC' },
        });
    }
};
exports.CampusGuideService = CampusGuideService;
exports.CampusGuideService = CampusGuideService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Campus)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.CampusPOI)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CampusGuideService);


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CampusGuideController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const campus_guide_service_1 = __webpack_require__(106);
const dto_1 = __webpack_require__(108);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
let CampusGuideController = class CampusGuideController {
    constructor(campusGuideService) {
        this.campusGuideService = campusGuideService;
    }
    async createCampus(createCampusDto) {
        const campus = await this.campusGuideService.createCampus(createCampusDto);
        return {
            message: 'Campus created successfully',
            data: campus,
        };
    }
    async createPOI(createPOIDto) {
        const poi = await this.campusGuideService.createPOI(createPOIDto);
        return {
            message: 'POI created successfully',
            data: poi,
        };
    }
    async getAllCampuses() {
        const campuses = await this.campusGuideService.getAllCampuses();
        return {
            message: 'Campuses retrieved successfully',
            count: campuses.length,
            data: campuses,
        };
    }
    async getAllCampusesWithPOIs() {
        const campuses = await this.campusGuideService.getAllCampusesWithPOIs();
        return {
            message: 'Campuses with POIs retrieved successfully',
            count: campuses.length,
            data: campuses,
        };
    }
    async getCampusById(id) {
        const campus = await this.campusGuideService.getCampusById(id);
        return {
            message: 'Campus retrieved successfully',
            data: campus,
        };
    }
    async getPOIsByCampus(campusId) {
        const pois = await this.campusGuideService.getPOIsByCampus(campusId);
        return {
            message: 'POIs retrieved successfully',
            count: pois.length,
            data: pois,
        };
    }
    async getPOIsByCategory(category) {
        const pois = await this.campusGuideService.getPOIsByCategory(category);
        return {
            message: 'POIs retrieved successfully',
            count: pois.length,
            data: pois,
        };
    }
    async deleteCampus(id) {
        await this.campusGuideService.deleteCampus(id);
    }
    async deletePOI(id) {
        await this.campusGuideService.deletePOI(id);
    }
};
exports.CampusGuideController = CampusGuideController;
__decorate([
    (0, common_1.Post)('campus'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCampusDto]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "createCampus", null);
__decorate([
    (0, common_1.Post)('poi'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePOIDto]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "createPOI", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "getAllCampuses", null);
__decorate([
    (0, common_1.Get)('all-with-pois'),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "getAllCampusesWithPOIs", null);
__decorate([
    (0, common_1.Get)('campus/:id'),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "getCampusById", null);
__decorate([
    (0, common_1.Get)('pois/:campusId'),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('campusId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "getPOIsByCampus", null);
__decorate([
    (0, common_1.Get)('pois/category/:category'),
    (0, decorators_1.Public)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "getPOIsByCategory", null);
__decorate([
    (0, common_1.Delete)('campus/:id'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "deleteCampus", null);
__decorate([
    (0, common_1.Delete)('poi/:id'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CampusGuideController.prototype, "deletePOI", null);
exports.CampusGuideController = CampusGuideController = __decorate([
    (0, common_1.Controller)('campus-guide'),
    __metadata("design:paramtypes", [campus_guide_service_1.CampusGuideService])
], CampusGuideController);


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(109), exports);
__exportStar(__webpack_require__(110), exports);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCampusDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class CreateCampusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, maxLength: 255 }, latitude: { required: true, type: () => Number, minimum: -90, maximum: 90 }, longitude: { required: true, type: () => Number, minimum: -180, maximum: 180 }, address: { required: true, type: () => String, maxLength: 500 } };
    }
}
exports.CreateCampusDto = CreateCampusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Campus name is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Campus name must not exceed 255 characters' }),
    __metadata("design:type", String)
], CreateCampusDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Latitude is required' }),
    (0, class_validator_1.Min)(-90, { message: 'Latitude must be between -90 and 90' }),
    (0, class_validator_1.Max)(90, { message: 'Latitude must be between -90 and 90' }),
    __metadata("design:type", Number)
], CreateCampusDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Longitude is required' }),
    (0, class_validator_1.Min)(-180, { message: 'Longitude must be between -180 and 180' }),
    (0, class_validator_1.Max)(180, { message: 'Longitude must be between -180 and 180' }),
    __metadata("design:type", Number)
], CreateCampusDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Address is required' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Address must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCampusDto.prototype, "address", void 0);


/***/ }),
/* 110 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreatePOIDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class CreatePOIDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { campusId: { required: true, type: () => Number }, name: { required: true, type: () => String, maxLength: 255 }, description: { required: false, type: () => String, maxLength: 500 }, latitude: { required: true, type: () => Number, minimum: -90, maximum: 90 }, longitude: { required: true, type: () => Number, minimum: -180, maximum: 180 }, category: { required: true, type: () => String, maxLength: 100 } };
    }
}
exports.CreatePOIDto = CreatePOIDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Campus ID is required' }),
    __metadata("design:type", Number)
], CreatePOIDto.prototype, "campusId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'POI name is required' }),
    (0, class_validator_1.MaxLength)(255, { message: 'POI name must not exceed 255 characters' }),
    __metadata("design:type", String)
], CreatePOIDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Description must not exceed 500 characters' }),
    __metadata("design:type", String)
], CreatePOIDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Latitude is required' }),
    (0, class_validator_1.Min)(-90, { message: 'Latitude must be between -90 and 90' }),
    (0, class_validator_1.Max)(90, { message: 'Latitude must be between -90 and 90' }),
    __metadata("design:type", Number)
], CreatePOIDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Longitude is required' }),
    (0, class_validator_1.Min)(-180, { message: 'Longitude must be between -180 and 180' }),
    (0, class_validator_1.Max)(180, { message: 'Longitude must be between -180 and 180' }),
    __metadata("design:type", Number)
], CreatePOIDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category is required' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Category must not exceed 100 characters' }),
    __metadata("design:type", String)
], CreatePOIDto.prototype, "category", void 0);


/***/ }),
/* 111 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const entities_1 = __webpack_require__(28);
const entities_2 = __webpack_require__(13);
const chat_service_1 = __webpack_require__(112);
const chat_controller_1 = __webpack_require__(113);
const chat_gateway_1 = __webpack_require__(114);
const notifications_module_1 = __webpack_require__(90);
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.ChatMessage, entities_2.User]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, chat_gateway_1.ChatGateway],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);


/***/ }),
/* 112 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(28);
const entities_2 = __webpack_require__(13);
const notifications_gateway_1 = __webpack_require__(76);
let ChatService = class ChatService {
    constructor(chatMessageRepository, userRepository, notificationsGateway) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async saveMessage(senderId, receiverId, message) {
        const chatMsg = this.chatMessageRepository.create({
            senderId,
            receiverId,
            message,
        });
        const saved = await this.chatMessageRepository.save(chatMsg);
        const sender = await this.userRepository.findOne({ where: { userId: senderId } });
        if (sender) {
            saved.sender = sender;
        }
        this.notificationsGateway.emitToUser(receiverId, 'receive_message', saved);
        this.notificationsGateway.emitToUser(senderId, 'receive_message', saved);
        return saved;
    }
    async getHistory(user1Id, user2Id) {
        return await this.chatMessageRepository.find({
            where: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id },
            ],
            order: { createdAt: 'ASC' },
        });
    }
    async getConversations(userId) {
        const messages = await this.chatMessageRepository.find({
            where: [
                { senderId: userId },
                { receiverId: userId },
            ],
            relations: ['sender', 'receiver'],
            order: { createdAt: 'DESC' },
        });
        const conversationMap = new Map();
        for (const msg of messages) {
            const counterpartId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            const counterpart = msg.senderId === userId ? msg.receiver : msg.sender;
            if (!conversationMap.has(counterpartId)) {
                conversationMap.set(counterpartId, {
                    user: {
                        userId: counterpart.userId,
                        fullName: counterpart.fullName,
                        email: counterpart.email,
                        role: counterpart.role,
                    },
                    latestMessage: msg,
                    unreadCount: 0,
                });
            }
            if (msg.receiverId === userId && !msg.isRead) {
                conversationMap.get(counterpartId).unreadCount++;
            }
        }
        return Array.from(conversationMap.values());
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ChatMessage)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_2.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], ChatService);


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const chat_service_1 = __webpack_require__(112);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const swagger_1 = __webpack_require__(15);
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getConversations(userId) {
        return await this.chatService.getConversations(userId);
    }
    async getHistory(currentUserId, counterpartId) {
        return await this.chatService.getHistory(currentUserId, counterpartId);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of conversations (Inbox)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of conversations with latest messages.' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, decorators_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('history/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get historical messages between current user and specified user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of chat messages.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(29).ChatMessage)] }),
    __param(0, (0, decorators_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getHistory", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);


/***/ }),
/* 114 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatGateway = void 0;
const websockets_1 = __webpack_require__(77);
const socket_io_1 = __webpack_require__(78);
const chat_service_1 = __webpack_require__(112);
const dto_1 = __webpack_require__(115);
const common_1 = __webpack_require__(4);
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
    }
    async handleSendMessage(client, payload) {
        const senderId = client.userId;
        if (!senderId) {
            this.logger.warn(`Unauthorized socket attempted to send message: ${client.id}`);
            return;
        }
        try {
            await this.chatService.saveMessage(senderId, payload.receiverId, payload.message);
        }
        catch (error) {
            this.logger.error(`Error saving chat message: ${error.message}`);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/notifications' }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(116), exports);


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SendMessageDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class SendMessageDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { receiverId: { required: true, type: () => Number }, message: { required: true, type: () => String } };
    }
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], SendMessageDto.prototype, "receiverId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);


/***/ }),
/* 117 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourcesModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const entities_1 = __webpack_require__(30);
const resources_service_1 = __webpack_require__(118);
const resources_controller_1 = __webpack_require__(119);
let ResourcesModule = class ResourcesModule {
};
exports.ResourcesModule = ResourcesModule;
exports.ResourcesModule = ResourcesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.ResourceItem])],
        controllers: [resources_controller_1.ResourcesController],
        providers: [resources_service_1.ResourcesService],
        exports: [resources_service_1.ResourcesService],
    })
], ResourcesModule);


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourcesService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const entities_1 = __webpack_require__(30);
let ResourcesService = class ResourcesService {
    constructor(resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
    async uploadResource(uploaderId, dto, filePath) {
        try {
            const resource = this.resourceRepository.create({
                title: dto.title,
                subjectCode: dto.subjectCode.toUpperCase(),
                year: dto.year,
                semester: parseInt(dto.semester, 10),
                type: dto.type,
                filePath,
                uploaderId,
            });
            return await this.resourceRepository.save(resource);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to save resource to database');
        }
    }
    async findAllWithFilters(filters) {
        const where = {};
        if (filters.subjectCode) {
            where.subjectCode = (0, typeorm_2.ILike)(`%${filters.subjectCode.trim()}%`);
        }
        if (filters.year) {
            where.year = filters.year;
        }
        if (filters.semester) {
            where.semester = parseInt(filters.semester, 10);
        }
        if (filters.type) {
            where.type = filters.type;
        }
        return await this.resourceRepository.find({
            where,
            relations: ['uploader'],
            select: {
                uploader: {
                    userId: true,
                    fullName: true,
                },
            },
            order: { uploadedAt: 'DESC' },
        });
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ResourceItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResourcesService);


/***/ }),
/* 119 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResourcesController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(2);
const multer_1 = __webpack_require__(81);
const path_1 = __webpack_require__(82);
const uuid_1 = __webpack_require__(83);
const resources_service_1 = __webpack_require__(118);
const dto_1 = __webpack_require__(120);
const guards_1 = __webpack_require__(58);
const decorators_1 = __webpack_require__(54);
const swagger_1 = __webpack_require__(15);
const resourceStorage = (0, multer_1.diskStorage)({
    destination: process.env.UPLOAD_DIR || '/tmp/uploads/resources',
    filename: (_req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const resourceFileFilter = (_req, file, cb) => {
    const allowed = /\.(pdf|doc|docx)$/i;
    if (allowed.test((0, path_1.extname)(file.originalname))) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException('Only PDF and DOCX files are allowed'), false);
    }
};
let ResourcesController = class ResourcesController {
    constructor(resourcesService) {
        this.resourcesService = resourcesService;
    }
    async uploadResource(uploadResourceDto, userId, file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const filePath = `/uploads/resources/${file.filename}`;
        return await this.resourcesService.uploadResource(userId, uploadResourceDto, filePath);
    }
    async getResources(filters) {
        return await this.resourcesService.findAllWithFilters(filters);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a past paper or lecture note' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Resource uploaded successfully.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: resourceStorage,
        fileFilter: resourceFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__(31).ResourceItem) }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('userId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UploadResourceDto, Number, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "uploadResource", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all resources with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of resources.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(31).ResourceItem)] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetResourcesFilterDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getResources", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, swagger_1.ApiTags)('Academic Resources'),
    (0, common_1.Controller)('resources'),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService])
], ResourcesController);


/***/ }),
/* 120 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(121), exports);
__exportStar(__webpack_require__(122), exports);


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadResourceDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class UploadResourceDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, subjectCode: { required: true, type: () => String }, year: { required: true, type: () => String, enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'] }, semester: { required: true, type: () => String, enum: ['1', '2'] }, type: { required: true, type: () => String, enum: ['past-paper', 'lecture-note'] } };
    }
}
exports.UploadResourceDto = UploadResourceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadResourceDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadResourceDto.prototype, "subjectCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other']),
    __metadata("design:type", String)
], UploadResourceDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['1', '2']),
    __metadata("design:type", String)
], UploadResourceDto.prototype, "semester", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['past-paper', 'lecture-note']),
    __metadata("design:type", String)
], UploadResourceDto.prototype, "type", void 0);


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetResourcesFilterDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class GetResourcesFilterDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { subjectCode: { required: false, type: () => String }, year: { required: false, type: () => String }, semester: { required: false, type: () => String }, type: { required: false, type: () => String } };
    }
}
exports.GetResourcesFilterDto = GetResourcesFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetResourcesFilterDto.prototype, "subjectCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetResourcesFilterDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetResourcesFilterDto.prototype, "semester", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetResourcesFilterDto.prototype, "type", void 0);


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintsModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const complaint_entity_1 = __webpack_require__(32);
const complaints_service_1 = __webpack_require__(124);
const complaints_controller_1 = __webpack_require__(125);
const notifications_module_1 = __webpack_require__(90);
let ComplaintsModule = class ComplaintsModule {
};
exports.ComplaintsModule = ComplaintsModule;
exports.ComplaintsModule = ComplaintsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([complaint_entity_1.Complaint]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [complaints_controller_1.ComplaintsController],
        providers: [complaints_service_1.ComplaintsService],
        exports: [complaints_service_1.ComplaintsService],
    })
], ComplaintsModule);


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintsService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const complaint_entity_1 = __webpack_require__(32);
const notifications_gateway_1 = __webpack_require__(76);
const uuid_1 = __webpack_require__(83);
let ComplaintsService = class ComplaintsService {
    constructor(complaintRepository, notificationsGateway) {
        this.complaintRepository = complaintRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async createComplaint(studentId, dto) {
        const complaint = this.complaintRepository.create({
            title: dto.title,
            description: dto.description,
            category: dto.category,
            studentId,
            status: complaint_entity_1.ComplaintStatus.PENDING,
        });
        return await this.complaintRepository.save(complaint);
    }
    async getStudentComplaints(studentId) {
        return await this.complaintRepository.find({
            where: { studentId },
            order: { createdAt: 'DESC' },
        });
    }
    async getAllComplaints() {
        return await this.complaintRepository.find({
            relations: ['student'],
            select: {
                student: {
                    userId: true,
                    fullName: true,
                    email: true,
                },
            },
            order: { createdAt: 'DESC' },
        });
    }
    async updateComplaintStatus(id, dto) {
        const complaint = await this.complaintRepository.findOne({ where: { id } });
        if (!complaint) {
            throw new common_1.NotFoundException('Complaint not found');
        }
        complaint.status = dto.status;
        const updated = await this.complaintRepository.save(complaint);
        this.notificationsGateway.sendToUser(complaint.studentId, {
            id: (0, uuid_1.v4)(),
            title: 'Complaint Status Updated',
            message: `Your complaint "${complaint.title}" has been updated to ${dto.status}.`,
            type: 'info',
            createdAt: new Date().toISOString(),
        });
        return updated;
    }
};
exports.ComplaintsService = ComplaintsService;
exports.ComplaintsService = ComplaintsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(complaint_entity_1.Complaint)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], ComplaintsService);


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplaintsController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const complaints_service_1 = __webpack_require__(124);
const dto_1 = __webpack_require__(126);
const guards_1 = __webpack_require__(58);
const roles_guard_1 = __webpack_require__(60);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
const decorators_2 = __webpack_require__(54);
const swagger_1 = __webpack_require__(15);
let ComplaintsController = class ComplaintsController {
    constructor(complaintsService) {
        this.complaintsService = complaintsService;
    }
    async createComplaint(userId, dto) {
        return await this.complaintsService.createComplaint(userId, dto);
    }
    async getMyComplaints(userId) {
        return await this.complaintsService.getStudentComplaints(userId);
    }
    async getAllComplaints() {
        return await this.complaintsService.getAllComplaints();
    }
    async updateComplaintStatus(id, dto) {
        return await this.complaintsService.updateComplaintStatus(id, dto);
    }
};
exports.ComplaintsController = ComplaintsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(enums_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Lodge a new complaint (Student only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Complaint created successfully.' }),
    openapi.ApiResponse({ status: 201, type: (__webpack_require__(32).Complaint) }),
    __param(0, (0, decorators_2.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateComplaintDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "createComplaint", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, decorators_1.Roles)(enums_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({ summary: 'Get all complaints lodged by the current student' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of personal complaints.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(32).Complaint)] }),
    __param(0, (0, decorators_2.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "getMyComplaints", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all system complaints (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all complaints.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(32).Complaint)] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "getAllComplaints", null);
__decorate([
    (0, common_1.Patch)('admin/:id/status'),
    (0, decorators_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a complaint status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Complaint status updated.' }),
    openapi.ApiResponse({ status: 200, type: (__webpack_require__(32).Complaint) }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateComplaintStatusDto]),
    __metadata("design:returntype", Promise)
], ComplaintsController.prototype, "updateComplaintStatus", null);
exports.ComplaintsController = ComplaintsController = __decorate([
    (0, swagger_1.ApiTags)('Complaints'),
    (0, common_1.Controller)('complaints'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [complaints_service_1.ComplaintsService])
], ComplaintsController);


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(127), exports);
__exportStar(__webpack_require__(128), exports);


/***/ }),
/* 127 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateComplaintDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
class CreateComplaintDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, description: { required: true, type: () => String }, category: { required: true, type: () => String } };
    }
}
exports.CreateComplaintDto = CreateComplaintDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplaintDto.prototype, "category", void 0);


/***/ }),
/* 128 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateComplaintStatusDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const complaint_entity_1 = __webpack_require__(32);
class UpdateComplaintStatusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, enum: (__webpack_require__(32).ComplaintStatus) } };
    }
}
exports.UpdateComplaintStatusDto = UpdateComplaintStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(complaint_entity_1.ComplaintStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateComplaintStatusDto.prototype, "status", void 0);


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinanceModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const payment_invoice_entity_1 = __webpack_require__(33);
const finance_service_1 = __webpack_require__(130);
const finance_controller_1 = __webpack_require__(131);
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payment_invoice_entity_1.PaymentInvoice])],
        controllers: [finance_controller_1.FinanceController],
        providers: [finance_service_1.FinanceService],
        exports: [finance_service_1.FinanceService],
    })
], FinanceModule);


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinanceService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const payment_invoice_entity_1 = __webpack_require__(33);
let FinanceService = class FinanceService {
    constructor(invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    async getSummary(studentId) {
        const invoices = await this.invoiceRepository.find({ where: { studentId } });
        let totalDue = 0;
        let totalPaid = 0;
        let activeScholarships = 0;
        for (const inv of invoices) {
            const amount = Number(inv.amount);
            if (inv.type === payment_invoice_entity_1.InvoiceType.DEBIT) {
                if (inv.status === payment_invoice_entity_1.InvoiceStatus.PENDING)
                    totalDue += amount;
                if (inv.status === payment_invoice_entity_1.InvoiceStatus.PAID)
                    totalPaid += amount;
            }
            else if (inv.type === payment_invoice_entity_1.InvoiceType.CREDIT) {
                activeScholarships += 1;
            }
        }
        return { totalDue, totalPaid, activeScholarships };
    }
    async getInvoices(studentId) {
        return await this.invoiceRepository.find({
            where: { studentId },
            order: { date: 'DESC' },
        });
    }
    async getChartData(studentId) {
        const invoices = await this.invoiceRepository.find({
            where: { studentId },
            order: { date: 'ASC' },
        });
        const groupedData = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (const inv of invoices) {
            const date = new Date(inv.date);
            const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
            if (!groupedData[key]) {
                groupedData[key] = { month: key, paid: 0, received: 0 };
            }
            const amount = Number(inv.amount);
            if (inv.type === payment_invoice_entity_1.InvoiceType.DEBIT && inv.status === payment_invoice_entity_1.InvoiceStatus.PAID) {
                groupedData[key].paid += amount;
            }
            else if (inv.type === payment_invoice_entity_1.InvoiceType.CREDIT && inv.status === payment_invoice_entity_1.InvoiceStatus.PAID) {
                groupedData[key].received += amount;
            }
        }
        return Object.values(groupedData);
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_invoice_entity_1.PaymentInvoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FinanceService);


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FinanceController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const finance_service_1 = __webpack_require__(130);
const guards_1 = __webpack_require__(58);
const roles_guard_1 = __webpack_require__(60);
const decorators_1 = __webpack_require__(54);
const enums_1 = __webpack_require__(17);
const decorators_2 = __webpack_require__(54);
const swagger_1 = __webpack_require__(15);
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    async getSummary(userId) {
        return await this.financeService.getSummary(userId);
    }
    async getInvoices(userId) {
        return await this.financeService.getInvoices(userId);
    }
    async getChartData(userId) {
        return await this.financeService.getChartData(userId);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dynamic financial aggregates for the student' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial summary returned successfully.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_2.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed list of all payment invoices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of invoices returned.' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(33).PaymentInvoice)] }),
    __param(0, (0, decorators_2.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Get)('chart'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly financial trends for charting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chart data returned.' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, decorators_2.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getChartData", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_1.ApiTags)('Finance & Scholarships'),
    (0, common_1.Controller)('finance'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, decorators_1.Roles)(enums_1.UserRole.STUDENT),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LifestyleModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const local_merchant_entity_1 = __webpack_require__(34);
const campus_event_entity_1 = __webpack_require__(35);
const lifestyle_service_1 = __webpack_require__(133);
const lifestyle_controller_1 = __webpack_require__(134);
let LifestyleModule = class LifestyleModule {
};
exports.LifestyleModule = LifestyleModule;
exports.LifestyleModule = LifestyleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([local_merchant_entity_1.LocalMerchant, campus_event_entity_1.CampusEvent])],
        controllers: [lifestyle_controller_1.LifestyleController],
        providers: [lifestyle_service_1.LifestyleService],
        exports: [lifestyle_service_1.LifestyleService],
    })
], LifestyleModule);


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LifestyleService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const local_merchant_entity_1 = __webpack_require__(34);
const campus_event_entity_1 = __webpack_require__(35);
let LifestyleService = class LifestyleService {
    constructor(merchantRepository, eventRepository) {
        this.merchantRepository = merchantRepository;
        this.eventRepository = eventRepository;
    }
    async getMerchantsByCampus(campusId) {
        return await this.merchantRepository.find({ where: { campusId } });
    }
    async getEventsByCampus(campusId) {
        return await this.eventRepository.find({
            where: { campusId },
            order: { date: 'ASC' },
        });
    }
};
exports.LifestyleService = LifestyleService;
exports.LifestyleService = LifestyleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(local_merchant_entity_1.LocalMerchant)),
    __param(1, (0, typeorm_1.InjectRepository)(campus_event_entity_1.CampusEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LifestyleService);


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LifestyleController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const lifestyle_service_1 = __webpack_require__(133);
const guards_1 = __webpack_require__(58);
const swagger_1 = __webpack_require__(15);
let LifestyleController = class LifestyleController {
    constructor(lifestyleService) {
        this.lifestyleService = lifestyleService;
    }
    async getMerchants(campusId) {
        return await this.lifestyleService.getMerchantsByCampus(campusId);
    }
    async getEvents(campusId) {
        return await this.lifestyleService.getEventsByCampus(campusId);
    }
};
exports.LifestyleController = LifestyleController;
__decorate([
    (0, common_1.Get)('campus/:campusId/merchants'),
    (0, swagger_1.ApiOperation)({ summary: 'Get local merchants and offers for a specific campus' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(34).LocalMerchant)] }),
    __param(0, (0, common_1.Param)('campusId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LifestyleController.prototype, "getMerchants", null);
__decorate([
    (0, common_1.Get)('campus/:campusId/events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active events for a specific campus' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(35).CampusEvent)] }),
    __param(0, (0, common_1.Param)('campusId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LifestyleController.prototype, "getEvents", null);
exports.LifestyleController = LifestyleController = __decorate([
    (0, swagger_1.ApiTags)('Campus Lifestyle'),
    (0, common_1.Controller)('lifestyle'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lifestyle_service_1.LifestyleService])
], LifestyleController);


/***/ }),
/* 135 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlumniModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const alumni_feed_entity_1 = __webpack_require__(36);
const alumni_service_1 = __webpack_require__(136);
const alumni_controller_1 = __webpack_require__(137);
let AlumniModule = class AlumniModule {
};
exports.AlumniModule = AlumniModule;
exports.AlumniModule = AlumniModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([alumni_feed_entity_1.AlumniFeed])],
        controllers: [alumni_controller_1.AlumniController],
        providers: [alumni_service_1.AlumniService],
        exports: [alumni_service_1.AlumniService],
    })
], AlumniModule);


/***/ }),
/* 136 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlumniService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const alumni_feed_entity_1 = __webpack_require__(36);
let AlumniService = class AlumniService {
    constructor(feedRepository) {
        this.feedRepository = feedRepository;
    }
    async getFeed() {
        return await this.feedRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.AlumniService = AlumniService;
exports.AlumniService = AlumniService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alumni_feed_entity_1.AlumniFeed)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AlumniService);


/***/ }),
/* 137 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlumniController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const alumni_service_1 = __webpack_require__(136);
const guards_1 = __webpack_require__(58);
const swagger_1 = __webpack_require__(15);
let AlumniController = class AlumniController {
    constructor(alumniService) {
        this.alumniService = alumniService;
    }
    async getFeed() {
        return await this.alumniService.getFeed();
    }
};
exports.AlumniController = AlumniController;
__decorate([
    (0, common_1.Get)('feed'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the alumni insights and tips feed' }),
    openapi.ApiResponse({ status: 200, type: [(__webpack_require__(36).AlumniFeed)] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlumniController.prototype, "getFeed", null);
exports.AlumniController = AlumniController = __decorate([
    (0, swagger_1.ApiTags)('Alumni Insights'),
    (0, common_1.Controller)('alumni'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [alumni_service_1.AlumniService])
], AlumniController);


/***/ }),
/* 138 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SafetyModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const anonymous_complaint_entity_1 = __webpack_require__(37);
const safety_service_1 = __webpack_require__(139);
const safety_controller_1 = __webpack_require__(141);
const mailer_1 = __webpack_require__(140);
let SafetyModule = class SafetyModule {
};
exports.SafetyModule = SafetyModule;
exports.SafetyModule = SafetyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([anonymous_complaint_entity_1.AnonymousComplaint]),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
                    port: Number(process.env.SMTP_PORT) || 587,
                    auth: {
                        user: process.env.SMTP_USER || 'ethereal.user',
                        pass: process.env.SMTP_PASS || 'ethereal.pass',
                    },
                },
                defaults: {
                    from: '"UniApp Safety Alert" <noreply@uniapp.com>',
                },
            }),
        ],
        controllers: [safety_controller_1.SafetyController],
        providers: [safety_service_1.SafetyService],
    })
], SafetyModule);


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SafetyService = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(11);
const anonymous_complaint_entity_1 = __webpack_require__(37);
const mailer_1 = __webpack_require__(140);
const config_1 = __webpack_require__(5);
let SafetyService = class SafetyService {
    constructor(complaintRepository, mailerService, configService) {
        this.complaintRepository = complaintRepository;
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async submitAnonymousComplaint(dto) {
        try {
            const complaint = this.complaintRepository.create({
                incidentDescription: dto.incidentDescription,
                location: dto.location,
                dateOfIncident: new Date(dto.dateOfIncident),
                isUrgent: dto.isUrgent,
            });
            const savedComplaint = await this.complaintRepository.save(complaint);
            const welfareEmail = this.configService.get('WELFARE_EMAIL') || 'welfare@university.edu';
            this.mailerService.sendMail({
                to: welfareEmail,
                subject: dto.isUrgent ? 'URGENT: Anti-Ragging Anonymous Report' : 'Anti-Ragging Anonymous Report',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ff4d4d; border-radius: 8px;">
            <h2 style="color: #ff4d4d;">Anonymous Anti-Ragging Report</h2>
            <p><strong>Incident ID:</strong> ${savedComplaint.id}</p>
            <p><strong>Date of Incident:</strong> ${savedComplaint.dateOfIncident.toISOString()}</p>
            <p><strong>Location:</strong> ${savedComplaint.location}</p>
            <p><strong>Urgency:</strong> ${savedComplaint.isUrgent ? '<span style="color:red; font-weight:bold;">HIGH</span>' : 'Normal'}</p>
            <hr />
            <h3>Description:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${savedComplaint.incidentDescription}</p>
            <hr />
            <small style="color: #888;">This report was submitted via the UniApp Anonymous Portal. Sender identity is entirely stripped.</small>
          </div>
        `,
            }).catch(err => console.error('Failed to dispatch anti-ragging email:', err));
            return { success: true, message: 'Report submitted anonymously and safely.' };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to submit anonymous report.');
        }
    }
};
exports.SafetyService = SafetyService;
exports.SafetyService = SafetyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(anonymous_complaint_entity_1.AnonymousComplaint)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mailer_1.MailerService,
        config_1.ConfigService])
], SafetyService);


/***/ }),
/* 140 */
/***/ ((module) => {

module.exports = require("@nestjs-modules/mailer");

/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SafetyController = void 0;
const openapi = __webpack_require__(15);
const common_1 = __webpack_require__(4);
const safety_service_1 = __webpack_require__(139);
const create_anonymous_complaint_dto_1 = __webpack_require__(142);
const decorators_1 = __webpack_require__(54);
const swagger_1 = __webpack_require__(15);
let SafetyController = class SafetyController {
    constructor(safetyService) {
        this.safetyService = safetyService;
    }
    async submitAnonymousComplaint(dto) {
        return await this.safetyService.submitAnonymousComplaint(dto);
    }
};
exports.SafetyController = SafetyController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('anti-ragging'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a strictly anonymous anti-ragging report' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Anonymous report submitted and alerted successfully.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_anonymous_complaint_dto_1.CreateAnonymousComplaintDto]),
    __metadata("design:returntype", Promise)
], SafetyController.prototype, "submitAnonymousComplaint", null);
exports.SafetyController = SafetyController = __decorate([
    (0, swagger_1.ApiTags)('Campus Safety'),
    (0, common_1.Controller)('safety'),
    __metadata("design:paramtypes", [safety_service_1.SafetyService])
], SafetyController);


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAnonymousComplaintDto = void 0;
const openapi = __webpack_require__(15);
const class_validator_1 = __webpack_require__(50);
const swagger_1 = __webpack_require__(15);
class CreateAnonymousComplaintDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { incidentDescription: { required: true, type: () => String }, location: { required: true, type: () => String }, dateOfIncident: { required: true, type: () => String }, isUrgent: { required: true, type: () => Boolean } };
    }
}
exports.CreateAnonymousComplaintDto = CreateAnonymousComplaintDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnonymousComplaintDto.prototype, "incidentDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnonymousComplaintDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnonymousComplaintDto.prototype, "dateOfIncident", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAnonymousComplaintDto.prototype, "isUrgent", void 0);


/***/ }),
/* 143 */
/***/ ((module) => {

module.exports = require("cors");

/***/ }),
/* 144 */
/***/ ((module) => {

module.exports = require("express");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;