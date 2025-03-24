import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './schemas/store.schema';

@Controller('v1/store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    // Create a new Store
    @Post()
    async createStore(@Body() store): Promise<Store> {
        return this.storeService.createStore(store);
    }

    // Get all stores
    @Get()
    async getAllStores(): Promise<Store[]> {
        return this.storeService.getAllStores();
    }

    // Get a store by ID
    @Get(':id')
    async getStoreById(@Param('id') id: string): Promise<Store> {
        return this.storeService.getStoreById(id);
    }

    // Update a store by ID
    @Patch(':id')
    async updateStore(
        @Param('id') id: string,
        @Body() store
    ): Promise<Store> {
        return this.storeService.updateStore(id, store);
    }

    // Delete a store by ID
    @Delete(':id')
    async deleteStore(@Param('id') id: string): Promise<any> {
        return this.storeService.deleteStore(id);
    }
}
