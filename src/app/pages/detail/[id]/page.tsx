// src/app/detail/[id]/page.tsx
import DetailView from "@/components/views/pages/Detail";

export const metadata = {
  title: "GonNime!",
};

type Props = {
  params: {
    id: number;
  };
};

const DetailPage = ({ params }: Props) => {
  return <DetailView animeId={params.id} />;
};

export default DetailPage;
