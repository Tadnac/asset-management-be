import { throwError } from './responseHelper';

export const parseId = (id: string, label = 'id'): number => {
  const number = Number(id);
  if(!Number.isInteger(number) || number <= 0){
    throwError(`Invalid ${label}`, 'BAD_REQUEST');
  }
  return number;
}
