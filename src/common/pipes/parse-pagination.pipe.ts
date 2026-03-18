import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

export interface PaginationParams {
  page:  number;
  limit: number;
  skip:  number;
}

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  constructor(private readonly maxLimit = 100) {}

  transform(value: Record<string, string>, _meta: ArgumentMetadata): PaginationParams {
    const page  = Math.max(1, parseInt(value?.page  || '1',  10) || 1);
    const limit = Math.min(this.maxLimit, Math.max(1, parseInt(value?.limit || '20', 10) || 20));
    return { page, limit, skip: (page - 1) * limit };
  }
}
