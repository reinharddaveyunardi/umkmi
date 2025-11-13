import { baseUmkm, FlattenedUMKM, umkmDetails } from "@/interfaces/Umkm";

export class umkm {
  static apiUrl = "https://umkmi-backend.vercel.app";
  static async get() {
    const res = await fetch(`${this.apiUrl}/api/umkms/all`, {
      headers: {
        "x-api-key": "lombamia",
        "x-server-request": "1",
      },
      method: "GET",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", res.status, text);
      return Response.json(
        { error: "Backend request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const mappedData = data.map((umkm: any) => ({
      name: umkm.name,
      lat: umkm.location?.lat ?? umkm.lat ?? 0,
      lon: umkm.location?.lng ?? umkm.lon ?? 0,
      thumbnailUrl: umkm.thumbnail || "/images/default-thumbnail.jpg",
    }));

    return mappedData;
  }

  static async getNearby(lat: number, lon: number): Promise<FlattenedUMKM[]> {
    try {
      const res = await fetch(
        `${this.apiUrl}/api/nearby-umkms?lat=${lat}&lon=${lon}`,
        {
          headers: {
            "x-api-key": "lombamia",
            "x-server-request": "1",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed fetching nearby UMKM:", res.status);
        return [];
      }

      const data: FlattenedUMKM[] = await res.json();

      const mappedData = data.map((umkm: any) => ({
        id: umkm.id,
        name: umkm.name,
        lat: umkm.location?.lat ?? umkm.lat ?? 0,
        lon: umkm.location?.lng ?? umkm.lon ?? 0,
        thumbnailUrl: umkm.thumbnail || "/images/default-thumbnail.jpg",
        rating: umkm.rating,
      }));

      return mappedData;
    } catch (err) {
      console.error("Error in getNearby():", err);
      return [];
    }
  }

  static async getAll(): Promise<FlattenedUMKM[]> {
    try {
      const res = await fetch(`${this.apiUrl}/api/umkms/all`, {
        headers: {
          "x-api-key": "lombamia",
          "x-server-request": "1",
        },
      });

      if (!res.ok) {
        console.error("Failed fetching all UMKM:", res.status);
        return [];
      }

      const data: baseUmkm[] = await res.json();

      const mappedData = data.map((umkm: any) => ({
        id: umkm.id,
        name: umkm.name,
        lat: umkm.location?.lat ?? umkm.lat ?? 0,
        lon: umkm.location?.lng ?? umkm.lon ?? 0,
        thumbnailUrl: umkm.thumbnail || "/images/default-thumbnail.jpg",
        rating: umkm.rating,
      }));

      return mappedData;
    } catch (err) {
      console.error("Error in getAll():", err);
      return [];
    }
  }

  static async getDetails(id: string) {
    try {
      const res = await fetch(
        `${this.apiUrl}/api/umkm/ChIJLTSG7aMh1DERGTJ_Gai0Ya4`,
        {
          headers: {
            "x-api-key": "lombamia",
            "x-server-request": "1",
          },
        }
      );

      if (!res.ok) {
        console.error("Failed fetching UMKM details:", res.status);
        return {};
      }

      const data: umkmDetails = await res.json();

      return data;
    } catch (err) {
      console.error("Error in getDetails():", err);
      return {};
    }
  }
}
