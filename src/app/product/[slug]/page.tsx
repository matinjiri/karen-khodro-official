import ProductPage from "@/src/components/product/ProductPage";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <ProductPage slug={slug} />;
}