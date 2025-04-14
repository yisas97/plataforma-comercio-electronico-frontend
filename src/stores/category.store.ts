import { atom } from 'nanostores';
import type {Category} from '../services/category.service';

interface CategoryState {
    categories: Category[];
}

export const categoryStore = atom<CategoryState>({
    categories: []
});