import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { Marketplace } from './schemas/marketplace.schema';

@Controller('v1/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // ✅ Create Marketplace
  @Post()
  create(@Body() data) {
    return this.marketplaceService.create(data);
  }

  // ✅ Get All Marketplaces
  @Get()
  findAll() {
    return this.marketplaceService.findAll();
  }

  // ✅ Get Marketplace by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  // ✅ Update Marketplace
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Marketplace>) {
    return this.marketplaceService.update(id, data);
  }

  // ✅ Delete Marketplace
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.marketplaceService.delete(id);
  }

  @Post('generate-token/:id')
  generateToken(@Param('id') id: string) {
    return this.marketplaceService.generateToken(id);
  }

  
}
