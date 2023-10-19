import AnimePage from "@/components/anime/page";

export default function PopularPage() {
  return <AnimePage label="Popular" apiEndpoint="getPopular" />;
}