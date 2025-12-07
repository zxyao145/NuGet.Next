"use client";

import React from "react";
import { Typography } from "antd";
import Link from "next/link";
import { Download, Flag, Tags } from "lucide-react";
import Image from "next/image";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";

const { Text } = Typography;

interface PackageItem {
  iconUrl: string;
  id: string;
  version: string;
  authors: string[];
  totalDownloads: number;
  tags: string[];
  description: string;
  title?: string;
}

interface PackageItemProps {
  packageItem: PackageItem;
}

const PackageItem: React.FC<PackageItemProps> = ({ packageItem }) => {
  return (
    <Item className="items-start">
      <ItemMedia className="">
        <Image
          width={40}
          src={packageItem.iconUrl}
          alt="The package icon"
          className="package-icon"
          onError={(e) => (e.currentTarget.src = "/images/default-package-icon-256x256.png")}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <Link
            className="package-title text-2xl"
            style={{
              cursor: "pointer",
              color: "#1890ff",
            }}
            href={`/packages/${packageItem.id}/${packageItem.version}`}
          >
            {packageItem.id}
          </Link>
        </ItemTitle>
        <div>
          <Text>by: {packageItem.authors?.join(" ")}</Text>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <Download size={14} />
            <Text>{packageItem.totalDownloads?.toLocaleString()} total downloads</Text>
          </span>
          <span className="flex items-center gap-1">
            <Flag size={14} />
            <Text>Latest version: {packageItem.version}</Text>
          </span>
        </div>
        {packageItem.tags?.length > 0 && (
          <div className="flex items-center gap-1">
            <Tags size={14} />
            <div className="flex">
              {packageItem.tags.map((tag) => (
                <Badge variant="secondary" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <ItemDescription className="mb-0">
          <Text>{packageItem.description}</Text>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default PackageItem;
