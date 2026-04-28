import HotelDetailClient from "./HotelDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}
export default async function HotelDetailPage({ params }: Props) {
  const { slug } = await params;
  return <HotelDetailClient slug={slug} />;
}
