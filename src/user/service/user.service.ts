import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { UserEntity } from '../models/user_entity';
import { AuthService } from 'src/auth/service/auth.service';
import { User, UserRole } from '../models/user_interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CustomBadRequestFilter } from 'src/expection/bad_exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(user: CreateUserDto): Promise<Partial<User>> {
    try {
      // Check if username or email is already taken
      const existingUser = await this.userRepository.findOne({
        where: [{ username: user.username }, { email: user.email }],
      });

      if (existingUser) {
        throw new BadRequestException('Username or email already exists');
      }

      // Hash the password
      const hashPassword = await this.authService.hashPassword(user.password);

      const newUser = this.userRepository.create(
        Object.assign(user, { password: hashPassword }),
      );

      const savedUser = await this.userRepository.save(newUser);

      const { password, ...result } = savedUser;
      console.log(result);

      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  // findOne(id: number): Observable<User> {
  //   return from(
  //     this.userRepository.findOne({ id }, { relations: ['blogEntries'] }),
  //   ).pipe(
  //     map((user: User) => {
  //       const { password, ...result } = user;
  //       return result;
  //     }),
  //   );
  // }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // paginate(options: IPaginationOptions): Observable<Pagination<User>> {
  //   return from(paginate<User>(this.userRepository, options)).pipe(
  //     map((usersPageable: Pagination<User>) => {
  //       usersPageable.items.forEach(function (v) {
  //         delete v.password;
  //       });
  //       return usersPageable;
  //     }),
  //   );
  // }

  // paginateFilterByUsername(
  //   options: IPaginationOptions,
  //   user: User,
  // ): Observable<Pagination<User>> {
  //   return from(
  //     this.userRepository.findAndCount({
  //       skip: Number(options.page) * Number(options.limit) || 0,
  //       take: Number(options.limit) || 10,
  //       order: { id: 'ASC' },
  //       select: ['id', 'name', 'username', 'email', 'role'],
  //       where: [{ username: Like(`%${user.username}%`) }],
  //     }),
  //   ).pipe(
  //     map(([users, totalUsers]) => {
  //       const usersPageable: Pagination<User> = {
  //         items: users,
  //         links: {
  //           first: options.route + `?limit=${options.limit}`,
  //           previous: options.route + ``,
  //           next:
  //             options.route +
  //             `?limit=${options.limit}&page=${Number(options.page) + 1}`,
  //           last:
  //             options.route +
  //             `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`,
  //         },
  //         meta: {
  //           currentPage: Number(options.page),
  //           itemCount: users.length,
  //           itemsPerPage: Number(options.limit),
  //           totalItems: totalUsers,
  //           totalPages: Math.ceil(totalUsers / Number(options.limit)),
  //         },
  //       };
  //       return usersPageable;
  //     }),
  //   );
  // }

  // deleteOne(id: number): Observable<any> {
  //   return from(this.userRepository.delete(id));
  // }

  // updateOne(id: number, user: User): Observable<any> {
  //   delete user.email;
  //   delete user.password;
  //   delete user.role;

  //   return from(this.userRepository.update(id, user)).pipe(
  //     switchMap(() => this.findOne(id)),
  //   );
  // }

  // updateRoleOfUser(id: number, user: User): Observable<any> {
  //   return from(this.userRepository.update(id, user));
  // }

  // login(user: User): Observable<string> {
  //   return this.validateUser(user.email, user.password).pipe(
  //     switchMap((user: User) => {
  //       if (user) {
  //         return this.authService
  //           .generateJWT(user)
  //           .pipe(map((jwt: string) => jwt));
  //       } else {
  //         return 'Wrong Credentials';
  //       }
  //     }),
  //   );
  // }

  // validateUser(email: string, password: string): Observable<User> {
  //   return from(
  //     this.userRepository.findOne(
  //       { email },
  //       {
  //         select: [
  //           'id',
  //           'password',
  //           'name',
  //           'username',
  //           'email',
  //           'role',
  //           'profileImage',
  //         ],
  //       },
  //     ),
  //   ).pipe(
  //     switchMap((user: User) =>
  //       this.authService.comparePasswords(password, user.password).pipe(
  //         map((match: boolean) => {
  //           if (match) {
  //             const { password, ...result } = user;
  //             return result;
  //           } else {
  //             throw Error;
  //           }
  //         }),
  //       ),
  //     ),
  //   );
  // }

  // findByMail(email: string): Observable<User> {
  //   return from(this.userRepository.findOne({ email }));
  // }
}
