import { createProduct } from '@/actions/products';
import ProductForm from '@/components/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Create Product</h1>
      </div>
      <ProductForm action={createProduct} />
    </div>
  );
}
