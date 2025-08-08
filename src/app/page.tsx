import Image from "next/image";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import Product from "./product/page";
import ProductList from "@/components/common/product-list";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    }
  });
  console.log(products);
  return (
    <>
      <Header />
      <div className="space-y-6 px-5">
        <Image
          src="/banner01.png"
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vn"
          className="h-auto w-full"
        />

        <ProductList products={products} title="Mais Vendidos"/>

        <Image
          src="/banner02.png"
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vn"
          className="h-auto w-full"
        />
      </div>
    </>
  );
};

export default Home;
