import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
  playground: true,
  context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
  formatError: (error) => {
    return {
      message: error.message,
      code: error.extensions?.code,
      locations: error.locations,
      path: error.path,
    };
  },
};
