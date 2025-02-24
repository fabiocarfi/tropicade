import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
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
import { Download } from "lucide-react";
import Image from "next/image";

const AdminPage = () => {
  return (
    <div>
      <MaxWidthWrapper>
        <VerticalPaddingWrapper>
          <h2 className="text-2xl font-medium text-black text-center mb-8">
            Submitted Designs
          </h2>

          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Download File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex gap-2">
                  <Image
                    width={64}
                    height={64}
                    src={"/brand-logo.svg"}
                    alt="Image"
                  />
                  <span>Abdul Sattar</span>
                </TableCell>
                <TableCell>
                  <span>abdul@gmail.com</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button>
                    <Download />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </VerticalPaddingWrapper>
      </MaxWidthWrapper>
    </div>
  );
};
export default AdminPage;
