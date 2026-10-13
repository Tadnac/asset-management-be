import { GraphQLError } from "graphql";

function fail(message: string, code: string): never {
    throw new GraphQLError(message,{extensions: {code} });
}

export function handleError(error: unknown, message:string): never {
    if (error instanceof GraphQLError){
        // pokud to je GQL err tak to echci posilat dal
        throw error;
    }
    const code = (error as {code?: string} | null)?.code;
    if (code === 'P2025') fail('Record not found', 'NOT_FOUND');
    if (code === 'P2002') fail('A record with this value already exists', 'BAD_REQUEST');
    if (code === 'P2003') fail('The record is still used by other data', 'BAD_REQUEST');
    //log pro server
    console.error(`${message}:`, error);
    // obecna chyba pro klienta
    return fail(message, 'INTERNAL_ERROR');
}