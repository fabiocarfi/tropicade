import { auth } from "@/auth";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SignOutButton from "@/components/shared/sign-out-button";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VerticalPaddingWrapper from "@/components/VerticalPaddingWrapper";
import { getAllConfigurations } from "@/lib/actions/configuration.actions";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-up");
  if (session?.user?.role !== "admin") redirect("/unauthorized");
  const res = await getAllConfigurations();
  return (
    <div>
      <MaxWidthWrapper>
        <VerticalPaddingWrapper>
          <h2 className="text-2xl font-medium text-black text-center mb-8">
            Submitted Designs
          </h2>
          <div className="flex items-center justify-between mb-8">
            <Button>Download Designs</Button>
            <SignOutButton />
          </div>
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tshirt Color</TableHead>
                <TableHead>Tshirt Size</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {res.config && res.config.length >= 1 ? (
                res.config.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium flex items-center justify-left gap-2">
                      <div className="border-[1px] border-solid border-gray-200 flex items-center justify-center rounded-full w-[52px] h-[52px]">
                        <Image
                          width={48}
                          height={48}
                          src={config.image}
                          alt="Image"
                          className="w-[48px] h-[48px]  rounded-full object-contain"
                        />
                      </div>
                      {config.user.name}
                    </TableCell>
                    <TableCell>{config.user.email}</TableCell>
                    <TableCell>{config.shirtColor}</TableCell>
                    <TableCell>{config.shirtSize}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={config.image}
                        download={config.id}
                        target="_blank"
                        className={buttonVariants({ variant: "default" })}
                      >
                        <Download />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>No data found</>
              )}
            </TableBody>
          </Table>
        </VerticalPaddingWrapper>
      </MaxWidthWrapper>
    </div>
  );
};
export default AdminPage;
