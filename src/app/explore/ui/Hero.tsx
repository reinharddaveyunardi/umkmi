import { umkmDetails } from "@/interfaces/Umkm";
import "./css/Hero.css";

export default function Hero({ data }: { data: umkmDetails }) {
  return (
    <div className="hero-wrapper">
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">{data.name}</h1>
        </div>

        <div className="hero-right">
          <img src={data.thumbnail} alt={data.name} className="hero-image" />
        </div>
      </div>
    </div>
  );
}
