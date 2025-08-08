import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}

// Função para validar URL
function isValidUrl(url?: string) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const ProductItem = ({ product }: ProductItemProps) => {
  const firstVariant = product.variants[0];

  // Define a URL válida ou fallback
  const imageUrl = isValidUrl(firstVariant?.imageUrl)
    ? firstVariant.imageUrl
    : "/placeholder.png"; // Coloque uma imagem placeholder na pasta public/

  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={imageUrl}
        alt={firstVariant?.name || product.name || "Produto"}
        width={200}
        height={200}
        className="rounded-3xl"
      />
      <div className="flex max-w-[200px] flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
