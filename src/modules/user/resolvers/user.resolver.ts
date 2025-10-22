import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { CreateUserInput, LoginInput } from '../dto/create-user.input';
import { AuthResponse } from '../dto/auth-response.output';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: CreateUserInput): Promise<AuthResponse> {
    const user = await this.userService.createUser(input);

    // Simple token generation - replace with JWT in production
    const accessToken = 'mock-token-' + user._id;

    return {
      user,
      accessToken,
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.validateUser(input);

    // Simple token generation - replace with JWT in production
    const accessToken = 'mock-token-' + user._id;

    return {
      user,
      accessToken,
    };
  }

  @Query(() => User)
  async me(@CurrentUser() userId: string): Promise<User> {
    return this.userService.findById(userId);
  }

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }
}
