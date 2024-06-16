import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductSearchResult } from './types/productSearchResult.interface';
import { ProductSearchBody } from './types/productSearchBody.interface';
@Injectable()
export class ProductSearchService {
    index = 'product'
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async indexProduct(product: any) {
        return this.elasticsearchService.index<ProductSearchBody>({
            index: this.index,
            id: product._id,
            body: {
                category_id: product.category_id,
                name: product.name,
                specification: product.specification,
                detail: product.detail,
                standard: product.standard,
                unit: product.unit,
                quantity: product.quantity,
            }
        })
    }

    async search(text: string, from: number, size: number) {
        try {
            const body: any = await this.elasticsearchService.search<ProductSearchResult>({
                index: this.index,
                body: {
                    from,
                    size,
                    query: {
                        multi_match: {
                            query: text,
                            fields: ['name', 'specification', 'detail', 'standard', 'unit']
                        }
                    }
                }
            });
            const data = body.hits.hits;
            return data.map((item) => item._id);

        } catch (error) {
            console.log("🚀 ~ ProductSearchService ~ search ~ error:", error)
        }
    }

    async indexProductImport(products: any) {
        try {
            const promises = products.map(product => {
                return this.elasticsearchService.index<ProductSearchBody>({
                    index: this.index,
                    id: product._id,
                    body: {
                        category_id: product.category_id,
                        name: product.name,
                        specification: product.specification,
                        detail: product.detail,
                        standard: product.standard,
                        unit: product.unit,
                        quantity: product.quantity,
                    }
                });
            });

            await Promise.all(promises);
            console.log('All products indexed successfully');

            return true
        } catch (error) {
            console.error('Error indexing products:', error);
        }
    }

    async updateProduct(id: string, data: any) {
        try {
            return await this.elasticsearchService.update({
                index: this.index,
                id,
                body: {
                    doc: data
                }
            });
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }

    async deleteProduct(deleteProduct: string[]) {
        try {
            const bulkDelete = deleteProduct.map(item => ({ delete: { _index: this.index, _id: item } }))
            return this.elasticsearchService.bulk({ body: bulkDelete });
        } catch (error) {
            console.error('Error delete document:', error);
        }
    }
}