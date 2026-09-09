import CollectionProductCard, {
  CollectionProduct,
} from "./CollectionProductCard";

type Props = {
  products: CollectionProduct[];
  onReset: () => void;
};

export default function ProductGrid({ products, onReset }: Props) {
  if (!products.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center border border-[#171512]/10 bg-[#F0EDE6]">
        <div className="text-center">
          <p className="font-serif text-[30px]">No pieces found</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-5 text-[10px] uppercase tracking-[0.2em] text-[#765A32] underline underline-offset-4"
          >
            Reset Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 xl:gap-8">
      {products.map((product, index) => (
        <CollectionProductCard
          key={`${product.slug}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
}
