import { getProduct, updateProduct } from '@/actions/products';
import ProductForm from '@/components/products/ProductForm';

export default async function EditProductPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const product = await getProduct(id);
  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
      </div>
      <ProductForm action={updateProductWithId} initialData={product} />
    </div>
  );
}
