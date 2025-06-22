import DetailView from "@/components/views/pages/Detail/detail";

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
