export type TshirtColorsType = {
  label: string;
  slug: string;
  value: string;
  imgUrl: string;
};

export type TshirtSizesType = {
  label: string;
  size: string;
};

export const TshirtSizes: TshirtSizesType[] = [
  {
    label: "small",
    size: "X",
  },
  {
    label: "medium",
    size: "M",
  },
  {
    label: "large",
    size: "L",
  },
  {
    label: "xlarge",
    size: "XL",
  },
  {
    label: "2xlarge",
    size: "2X",
  },
  {
    label: "3xlarge",
    size: "3X",
  },
  {
    label: "4xlarge",
    size: "4X",
  },
  {
    label: "5xlarge",
    size: "5X",
  },
];

export const TshirtColors: TshirtColorsType[] = [
  {
    label: "Black",
    slug: "black",
    value: "#000",
    imgUrl: "/tshirts/tshirt-black.webp",
  },
  {
    label: "White",
    slug: "white",
    value: "#FFFFFF",
    imgUrl: "/tshirts/tshirt-white.webp",
  },
  {
    label: "Natural",
    slug: "natural",
    value: "#F1EBDF",
    imgUrl: "/tshirts/tshirt-natural.webp",
  },
  {
    label: "Pink",
    slug: "pink",
    value: "#F5D3DB",
    imgUrl: "/tshirts/tshirt-pink.webp",
  },

  {
    label: "Charcoal",
    slug: "charcoal",
    value: "##53565A",
    imgUrl: "/tshirts/tshirt-charcoal.webp",
  },
  {
    label: "Red Ringer",
    slug: "r-ringer",
    value: "#BF0811",
    imgUrl: "/tshirts/tshirt-red-ringer.webp",
  },
  {
    label: "Black Ringer",
    slug: "b-ringer",
    value: "#000",
    imgUrl: "/tshirts/tshirt-black-ringer.webp",
  },
];
