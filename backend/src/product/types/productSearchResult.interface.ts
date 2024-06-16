
import { ProductSearchBody } from './productSearchBody.interface';

export interface ProductSearchResult {
    data: {
        total: number;
        data: Array<{
            _source: ProductSearchBody;
        }>;
    };
}