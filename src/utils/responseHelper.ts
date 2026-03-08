import { GraphQLError } from 'graphql';


export const throwError = (message: string, code: string = 'INTERNAL_SERVER_ERROR') => {
    throw new GraphQLError(message, {
        extensions: {
            code: code,
        },
    });
};