import { IIdGeneratorService } from '../../application/services/IIdGeneratorService';
import { v4 as uuidv4 } from 'uuid';

export class UuidGeneratorService implements IIdGeneratorService {
  generate(): string {
    return uuidv4();
  }
}
