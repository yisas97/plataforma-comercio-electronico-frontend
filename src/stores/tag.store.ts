import { atom } from 'nanostores';
import type {Tag} from '../services/tag.service';

interface TagState {
    tags: Tag[];
}

export const tagStore = atom<TagState>({
    tags: []
});