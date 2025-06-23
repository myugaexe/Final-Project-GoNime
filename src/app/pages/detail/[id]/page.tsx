import DetailView from "@/components/views/pages/Detail/DetailView";

export const metadata = {
  title: "GonNime!",
};

type Props = {
  params: {
    id: string;  
  };
};

const DetailPage = ({ params }: Props) => {
  const animeId = parseInt(params.id, 10); 

  return <DetailView animeId={animeId} />;
};

export default DetailPage;
