import { Controller, Logger, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  private logger = new Logger('TransactionsController')
  constructor(private transactionsService: TransactionsService){}

  @Post('/rent/:id')
  rentMovie(){}

  @Post('/return/:id')
  returnMovie(){}

  @Post('purchase/:id')
  purchaseMovie(){}

}
