import DetailView from "@/components/views/pages/Detail";

export const metadata = {
  title: "GonNime!", 
};

const DetailPage = () => {
    return (
       <>
       <DetailView animeId="20" />        
       </>
    )
}

export default DetailPage;