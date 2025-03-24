import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Store } from './schemas/store.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name, 'DATABASE_CONNECTION') private readonly storeModel: Model<Store>
    ) {}

    async createStore(store: Store): Promise<Store> {
        const newStore = new this.storeModel(store);
        return newStore.save();
    }

    async getAllStores(): Promise<Store[]> {
        return this.storeModel.find().exec();
    }

    async getStoreById(id: string): Promise<Store> {
        const store = await this.storeModel.findById(id).exec();
        if (!store) {
            throw new NotFoundException(`Store with ID ${id} not found`);
        }
        return store;
    }

    async updateStore(id: string, store: Store): Promise<Store> {
        const existingStore = await this.storeModel.findById(id).exec();
        if (!existingStore) {
            throw new NotFoundException(`Store with ID ${id} not found`);
        }

        console.log('store.storePassword', store.storePassword.length)

        if (store.storePassword === undefined || store.storePassword.length === 0) {
            delete store.storePassword;
        }
    
        const updatedStore = await this.storeModel.findByIdAndUpdate(id, store, { new: true }).exec();
    
        return updatedStore;
    }

    async deleteStore(id: string): Promise<any> {
        const result = await this.storeModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Store with ID ${id} not found`);
        }
        return { message: `Store with ID ${id} successfully deleted` };
    }
}
