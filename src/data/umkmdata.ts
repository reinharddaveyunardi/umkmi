import { NewUMKM } from "@/interfaces/Umkm";

const jkt: NewUMKM[] = [
  {
    name: "Mie Baso Tenda Biru",
    rating: 4.5,
    rangePrice: { min: 5000, max: 10000 },
    location: {
      lat: -6.112912,
      long: 106.8945722,
      name: "Jl. Lorong 101 No.73 RT.06/RW.12, RT.6/RW.10, Koja, Kec. Koja, Jkt Utara, Daerah Khusus Ibukota Jakarta 14220",
    },
    thumbnail:
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSywbV7lRsh7k1MbyhrXrwJucRv2qoQHu83jAzWLX0GSmZZxX6sxfm9oqQXCLrMlt50hVywYQhyngAOi6F_k580PMBVl3HS9gzTL6UxRq5QlvE8PB2NCViMnq5osbmZ0n8zxOLVt=w426-h240-k-no",
    servicesOption: ["Dine In", "Take Away"],
    albums: [
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyK0hPuGLb5R6J4qxVgeH9jyTe8dF6tvYLVCeVRevg_aum_UGLUO3TyYa7jaf3FyvbUOXdm5ZooWs3VyPxqsEF0m5hAtZTFNvpWrA0bF0LyoqyBugCJGxXzlS5n763G7abqxDeS=w640-h640-n-k-no",
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxPwfuKVdLa9DZhuyLwhUDrpBgs7clKZJyOcj2uRw3lpr-JY6S5QFUImgOH6Rwlqa9XeleZRCeBkaoqjWJNGyX48rj7o8Z9ZxBs__pg8Em5e_ICczWIxVcrODQZo_ADlz3PB2h_=w640-h640-n-k-no",
    ],
    status: {
      time: {
        mon: {
          isOpen: true,
          open: "09:00",
          close: "21:00",
        },
        tue: {
          isOpen: true,
          open: "09:00",
          close: "21:00",
        },
        wed: {
          isOpen: true,
          open: "09:00",
          close: "21:00",
        },
        thu: {
          isOpen: true,
          open: "09:00",
          close: "21:00",
        },
        fri: {
          isOpen: true,
          open: "09:00",
          close: "21:00",
        },
        sat: {
          isOpen: true,
          open: "09:00",
          close: "21:00",
        },
        sun: {
          isOpen: false,
          open: "09:00",
          close: "21:00",
        },
      },
    },
  },
  {
    name: "Rumah Makan Tumatenden",
    albums: [
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxDJRpIotARUIhnB3QXUTpThpKsDKziUTkFxPvyA3vObpDSwLM9DVCI4E-ATPooN2gOqxNTpn24KwVWOHlCuaCvGLRrV49Lo-8uapy4elRBxJfLXYuvtBn6ueqzOyvBSGe7ocqV=w640-h640-n-k-no",
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSy752wuID9doiI4cS_C0-qgwAm8x7ckXNixLw-JrEZDQ-8wUkO_0DHPUo8RUpWyfnf7wP5ecgPlW5G8ZXmqRoLBeBUtXSDEAWn7umCx5srTy0NtGUyk6bkIieOUlC4u6qIG488=w640-h640-n-k-no",
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyUAJ-N57KD2naWmWO24JBhfSXr6Ilzdz668ZKdSbjbHQAEkHU9YxMcnsLijXDlsPwjwgNRgdcZVTZDSWp3RySSuoJseQbcn0SAWCeAQLZda72QvGChPOHuqaaIiV0WW2MlaNOEbA=w640-h640-n-k-no",
    ],
    location: {
      name: "Jl. Swasembada Timur XI No.5, RT.12/RW.10, Kb. Bawang, Kec. Tj. Priok, Jkt Utara, Daerah Khusus Ibukota Jakarta 14320",
      lat: -6.1226129,
      long: 106.8892223,
    },
    rangePrice: { min: 10000, max: 25000 },
    rating: 4.7,
    servicesOption: ["Dine In", "Take Away"],
    status: {
      time: {
        mon: {
          isOpen: true,
          open: "10:00",
          close: "09:00",
        },
        tue: {
          isOpen: true,
          open: "10:00",
          close: "09:00",
        },
        wed: {
          isOpen: true,
          open: "10:00",
          close: "09:00",
        },
        thu: {
          isOpen: true,
          open: "10:00",
          close: "09:00",
        },
        fri: {
          isOpen: true,
          open: "10:00",
          close: "09:00",
        },
        sat: {
          isOpen: true,
          open: "10:00",
          close: "09:00",
        },
        sun: {
          isOpen: false,
          open: "10:00",
          close: "09:00",
        },
      },
    },
    thumbnail:
      "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyT_FHULDS1me14vjiGIE8WLkz4iRu6uVVyzYJwFYLsZ6_VNiKcxK1EJif5ZznM_PWnaH5y7rXv6AxMkr4rFp4iSLuLVpd8apZZTd8lWITwiVrzA4p97gaG3vLIlpbX8dt4_mSZ5g=w408-h306-k-no",
  },
];

export const umkmList = { jkt };
