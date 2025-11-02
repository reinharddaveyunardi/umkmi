import { umkmDetails } from "@/interfaces/Umkm";

export default function Hero({ data }: { data: umkmDetails }) {
  return (
    <div className="w-full h-screen min-h-[50vh] md:min-h-[70vh] flex items-center bg-[url('/1.svg')] bg-cover bg-center py-12 md:py-24">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex flex-col w-full md:w-1/2 justify-center items-center md:items-start text-center md:text-left order-2 md:order-1">
          <h1 className="text-blue-600 font-black text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight">
            {data.name}
          </h1>
          <div></div>
        </div>
        <div className="h-auto w-full md:w-1/2 flex justify-center items-center order-1 md:order-2">
          <img
            src={data.thumbnail}
            alt={data.name}
            className="w-full max-w-sm md:max-w-none h-auto max-h-96 object-cover rounded-4xl"
          />
        </div>
      </div>
    </div>
  );
}
