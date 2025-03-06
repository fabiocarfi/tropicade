import prisma from "@/db";
import UserList from "./user-list";
import VerticalPaddingWrapper from "@/components/VerticalPaddingWrapper";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const session = await auth();
  if (!session) redirect("/sign-up");
  if (session?.user?.role !== "admin") redirect("/unauthorized");
  console.log(session);

  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <MaxWidthWrapper>
      <VerticalPaddingWrapper>
        <h2 className="text-2xl font-medium text-black text-center mb-8">
          Users
        </h2>
        <UserList users={users} />
      </VerticalPaddingWrapper>
    </MaxWidthWrapper>
  );
}
