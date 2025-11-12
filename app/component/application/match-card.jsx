"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  MatchType1,
  MatchType2,
  MatchType3,
  MatchType4,
  MatchType5,
  MatchType6,
} from "@/config";

import Image from "next/image";
import Link from "next/link";

const matches = [
  {
    title: MatchType1,
    link: `/matches/?type=${MatchType1}`,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761068487/br-match_itpoat.jpg",
  },
  {
    title: MatchType2,
    link: `/matches/?type=${MatchType2}`,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761068488/clash-squad_u3dkmq.jpg",
  },
  {
    title: MatchType3,
    link: `/matches/?type=${MatchType3}`,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761068488/lone-wolf_wombhk.jpg",
  },
  {
    title: MatchType4,
    link: `/matches/?type=${MatchType4}`,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761874882/download_vmg5ko.jpg",
  },
  {
    title: MatchType5,
    link: `/matches/?type=${MatchType5}`,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761068488/squad-brRank_etzfrb.jpg",
  },
  {
    title: MatchType6,
    link: `/matches/?type=${MatchType6}`,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761068487/free-match_k9jszq.jpg",
  },
];

export default function MatchCards() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">MATCHES</h2>
      <div className="grid grid-cols-2 gap-4">
        {matches.map((match, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow pt-0"
          >
            <Link href={match.link}>
              <CardHeader className="p-0">
                <div className="relative w-full h-32">
                  <Image
                    src={match.image}
                    alt={match.title}
                    fill
                    className="object-fill rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm font-bold">
                  {match.title}
                </CardTitle>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
