import DetailView from "@/components/views/pages/Detail/DetailView";

export const metadata = {
  title: "GonNime!",
};

const DetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const animeId = parseInt(id, 10);

  return <DetailView animeId={animeId} />;
};

export default DetailPage;
