import type { Library } from "@/lib/model";

// Change these values and redeploy to update the default page for every visitor.
export const defaultLibrary: Library = {
  version: 1,
  profile: {
    name: "Kim Nam Ho",
    initials: "KNH",
    bio: "한양대학교 컴퓨터소프트웨어학부에 재학중인 김남호 입니다.",
  },
  links: [
    {
      id: "instagram",
      title: "Instagram",
      url: "https://www.instagram.com/mikrok0sm0s?exln=NXI1N3ZlbHhjYzI1",
    },
    { id: "github", title: "GitHub", url: "https://github.com/knh0136" },
    { id: "naver-blog", title: "Naver Blog", url: "https://blog.naver.com/knho0136" },
  ],
};
